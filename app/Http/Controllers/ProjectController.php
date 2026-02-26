<?php

namespace App\Http\Controllers;

use App\Events\InvitationCreated;
use App\Events\ProjectInvitationAccepted;
use App\Events\ProjectInvitationCreated;
use App\Helpers\LogHelper;
use App\Models\Invitation;
use App\Models\Project;
use App\Models\ProjectInvitation;
use App\Models\Role;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Str;
use Illuminate\Support\Facades\Auth;

class ProjectController extends Controller {

    public function show(Project $project) {
        $project->load([
            'customer',
            'members' => function($membersQuery) {
                $membersQuery->with(['user', 'role']);
            },
        ]);


        return Inertia::render('projects/show', [
            'project' => $project,
        ]);
    }

    public function members(Project $project) {
        $project->load([
            'customer',
            'members' => function($membersQuery) {
                $membersQuery->with(['user', 'role']);
            },
            'invitations' => function($invitationsQuery) {
                $invitationsQuery->with(['user', 'invitation', 'role']);
            },
        ]);

        $roles = Role::query()
            ->where('type', Role::TYPE_FUNCTION)
            ->get();

        return Inertia::render('projects/members', [
            'project' => $project,
            'roles' => $roles,
        ]);
    }

    public function inviteMember(Project $project, Request $request) {
        $request->validate([
            'email' => 'required|string|lowercase|email|max:225',
            'roleId' => 'required|integer|exists:roles,id',
            'description' => 'nullable|string|max:225',
        ]);

        try {
            DB::beginTransaction();

            $user = User::where('email', $request->email)->first();

            if ($user) {
                $isMember = $project->members()
                    ->where('userId', $user->id)
                    ->exists();

                if ($isMember) {
                    return back()->with('flash', [
                        'type' => 'warning',
                        'message' => 'Usuário já é membro do projeto.'
                    ]);
                }

                $hasPendingInvitation = $project->invitations()
                    ->where('userId', $user->id)
                    ->where('status', ProjectInvitation::STATUS_PENDING)
                    ->exists();

                if ($hasPendingInvitation) {
                    return back()->with('flash', [
                        'type' => 'warning',
                        'message' => 'Já existe um convite pendente para esse usuário.'
                    ]);
                }

                $projectInvitation = $project->invitations()->create([
                    'userId' => $user->id,
                    'status' => ProjectInvitation::STATUS_PENDING,
                    'roleId' => $request->roleId,
                    'description' => $request->description,
                    'createdByUserId' => Auth::id(),
                ]);

                event(new ProjectInvitationCreated($projectInvitation));

                DB::commit();

                return back()->with('flash', [
                    'type' => 'success',
                    'message' => 'Convite criado com sucesso!',
                ]);
            }

            $invitation = Invitation::where('email', $request->email)
                ->where('status', Invitation::STATUS_PENDING)
                ->first();

            if (!$invitation) {
                $invitation = Invitation::create([
                    'email' => $request->email,
                    'roleId' => $request->roleId,
                    'token' => Str::uuid(),
                    'status' => Invitation::STATUS_PENDING,
                    'expiredAt' => now()->addDays(7),
                    'createdByUserId' => Auth::id(),
                ]);

                event(new InvitationCreated($invitation));
            }

            $hasPendingInvitation = $project->invitations()
                ->where('invitationId', $invitation->id)
                ->where('status', ProjectInvitation::STATUS_PENDING)
                ->exists();

            if ($hasPendingInvitation) {
                return back()->with('flash', [
                    'type' => 'warning',
                    'message' => 'Já existe um convite pendente para esse usuário.'
                ]);
            }

            $projectInvitation = $project->invitations()->create([
                'invitationId' => $invitation->id,
                'status' => ProjectInvitation::STATUS_PENDING,
                'roleId' => $request->roleId,
                'description' => $request->description,
                'createdByUserId' => Auth::id(),
            ]);

            event(new ProjectInvitationCreated($projectInvitation));

            DB::commit();

            return back()->with('flash', [
                'type' => 'success',
                'message' => 'Convite criado com sucesso!',
            ]);

        } catch (\Exception $ex) {
            DB::rollBack();

            LogHelper::exception($ex);

            $msg = 'Ocorreu um erro ao tentar salvar os dados.';

            if (!app()->environment('production')) {
                $msg .= ' Detalhes: ' . $ex->getMessage();
            }

            return back()->with('flash', [
                'type' => 'error',
                'message' => $msg,
            ]);
        }
    }

    public function acceptInvitation(Project $project, Request $request) {
        $invitation = $project->invitations()
            ->where('userId', Auth::id())
            ->where('status', ProjectInvitation::STATUS_PENDING)
            ->first();

         if (! $invitation) {
            return redirect()
                ->route('projects.list')
                ->with('flash', [
                    'type' => 'error',
                    'message' => 'Você não possui um convite pendente para este projeto.'
                ]);
        }

        try {
            DB::beginTransaction();

            $invitation->update(['status' => ProjectInvitation::STATUS_ACCEPTED]);

            $project->members()->create([
                'userId' => $invitation->userId,
                'roleId' => $invitation->roleId,
                'description' => $invitation->description,
            ]);
            
            event(new ProjectInvitationAccepted($invitation));
            
            DB::commit();

            return redirect()
                ->route('projects.show', $invitation->projectId)
                ->with('flash', [
                    'type' => 'success',
                    'message' => "Convite para o projeto '{$project->name}' aceito com sucesso!"
                ]);

        } catch (\Exception $ex) {
            DB::rollBack();

            LogHelper::exception($ex);

            $msg = 'Ocorreu um erro ao tentar salvar os dados.';

            if (!app()->environment('production')) {
                $msg .= ' Detalhes: ' . $ex->getMessage();
            }

            return redirect()
                ->route('projects.list', $invitation->projectId)
                ->with('flash', [
                    'type' => 'error',
                    'message' => $msg,
                ]);
        }
    }
    

}
