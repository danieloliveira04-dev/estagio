<?php

namespace App\Http\Controllers;

use App\Events\InvitationCreated;
use App\Events\ProjectInvitationAccepted;
use App\Events\ProjectInvitationCreated;
use App\Events\ProjectMemberRemoved;
use App\Helpers\LogHelper;
use App\Models\Invitation;
use App\Models\Project;
use App\Models\ProjectColumn;
use App\Models\ProjectInvitation;
use App\Models\ProjectMember;
use App\Models\Role;
use App\Models\TaskStatus;
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
            'columns' => function($columnsQuery) {
                $columnsQuery->with(['tasks.taskStatus'])
                    ->orderBy('position');
            },
        ]);


        return Inertia::render('projects/show', [
            'project' => $project,
            'taskStatus' => TaskStatus::get(),
        ]);
    }

    public function storeColumn(Project $project, Request $request) {
        $request->validate([
            'name' => 'required|string|max:45',
            'taskStatusId' => 'nullable|exists:tasksStatus,id',
        ]);

        $input = $request->input();

        try {

            $project->columns()->create(array_merge($input, [
                'position' => $project->columns()->count(),
            ]));

            return redirect()
                ->to(route('projects.show', $project->id))
                ->with('flash', [
                    'type' => 'success',
                    'message' => 'Coluna criada com sucesso.',
                ]);
            
        } catch (\Exception $ex) {
            LogHelper::exception($ex);

            $msg = 'Ocorreu um erro ao tentar salvar os dados.';

            if (!app()->environment('production')) {
                $msg .= ' Detalhes: ' . $ex->getMessage();
            }

            return redirect()
                ->to(route('projects.show', $project->id))
                ->with('flash', [
                    'type' => 'error',
                    'message' => $msg,
                ]);
        }
    }

    public function updateColumn(Project $project, ProjectColumn $column, Request $request) {
        $request->validate([
            'name' => 'required|string|max:45',
            'taskStatusId' => 'nullable|exists:tasksStatus,id',
        ]);

        $input = $request->input();

        try {
            DB::beginTransaction();

            $column->fill($input);

            $statusChanged = $column->isDirty('taskStatusId');

            $column->save();

            if ($statusChanged && $column->taskStatusId) {
                $column->tasks()->update([
                    'taskStatusId' => $column->taskStatusId,
                ]);
            }

            DB::commit();

            return redirect()
                ->to(route('projects.show', $project->id))
                ->with('flash', [
                    'type' => 'success',
                    'message' => 'Coluna atualizada com sucesso.',
                ]);
            
        } catch (\Exception $ex) {
            DB::rollBack();

            LogHelper::exception($ex);

            $msg = 'Ocorreu um erro ao tentar salvar os dados.';

            if (!app()->environment('production')) {
                $msg .= ' Detalhes: ' . $ex->getMessage();
            }

            return redirect()
                ->to(route('projects.show', $project->id))
                ->with('flash', [
                    'type' => 'error',
                    'message' => $msg,
                ]);
        }
    }

    public function deleteColumn(Project $project, ProjectColumn $column) {
        if ($column->tasks->isNotEmpty()) {
            return redirect()
                ->to(route('projects.show', $project->id))
                ->with('flash', [
                    'type' => 'error',
                    'message' => "Não é possível excluir a coluna \"{$column->name}\", pois ela possui tarefas vinculadas. Mova as tarefas para outra coluna antes de realizar a exclusão.",
                ]);
        }

        if ($project->columns()->count() === 1) {
            return redirect()
                ->to(route('projects.show', $project->id))
                ->with('flash', [
                    'type' => 'error',
                    'message' => "Não é possível excluir a coluna \"{$column->name}\" porque ela é a única coluna do projeto. O projeto deve possuir pelo menos uma coluna ativa.",
                ]);
        }

        try {

            $column->delete();

            return redirect()
                ->to(route('projects.show', $project->id))
                ->with('flash', [
                    'type' => 'success',
                    'message' => 'Coluna excluída com sucesso.',
                ]);
            
        } catch (\Exception $ex) {
            LogHelper::exception($ex);

            $msg = 'Ocorreu um erro ao tentar salvar os dados.';

            if (!app()->environment('production')) {
                $msg .= ' Detalhes: ' . $ex->getMessage();
            }

            return redirect()
                ->to(route('projects.show', $project->id))
                ->with('flash', [
                    'type' => 'error',
                    'message' => $msg,
                ]);
        }
    }

    public function moveColumn(Project $project, ProjectColumn $column, Request $request) {
        $request->validate([
            'position' => 'required|integer',
        ]);

        $targetColumn = $project->columns()
            ->where('position', $request->input('position'))
            ->first();

        if (!$targetColumn) {
            return redirect()
                ->route('projects.show', $project)
                ->with('flash', [
                    'type' => 'error',
                    'message' => 'Não é possível mover essa coluna para essa direção.',
                ]);
        }

        try {
            DB::beginTransaction();

            $currentPosition = $column->position;

            $column->update([
                'position' => $targetColumn->position,
            ]);

            $targetColumn->update([
                'position' => $currentPosition,    
            ]);

            DB::commit();

            return redirect()
                ->to(route('projects.show', $project->id))
                ->with('flash', [
                    'type' => 'success',
                    'message' => 'Coluna movida com sucesso.',
                ]);
            
        } catch (\Exception $ex) {
            DB::rollBack();

            LogHelper::exception($ex);

            $msg = 'Ocorreu um erro ao tentar salvar os dados.';

            if (!app()->environment('production')) {
                $msg .= ' Detalhes: ' . $ex->getMessage();
            }

            return redirect()
                ->to(route('projects.members', $project->id))
                ->with('flash', [
                    'type' => 'error',
                    'message' => $msg,
                ]);
        }
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

    public function deleteMember(Project $project, ProjectMember $member) {
        $hasAnotherManager = $project->members()
            ->where('roleId', env('roleManagerId'))
            ->where('userId', '!=', $member->userId)
            ->exists();

        if (!$hasAnotherManager && $member->roleId == env('roleManagerId')) {
            return redirect()
                ->route('projects.members', $project)
                ->with('flash', [
                    'type' => 'warning',
                    'message' => 'É obrigatório que exista pelo menos um gestor no projeto.',
                ]);
        }

        try {
            DB::beginTransaction();

            $member->delete();

            $tasks = $member->tasks()->get();

            $member->tasks()->update([
                'projectMemberId' => null,
            ]);

            event(new ProjectMemberRemoved($project, $member, $tasks));

            DB::commit();

            return redirect()
                ->route('projects.members', $project)
                ->with('flash', [
                    'type' => 'success',
                    'message' => 'Membro removido com sucesso.',
                ]);

        } catch (\Exception $ex) {
            DB::rollBack();
            
            LogHelper::exception($ex);

            $message = 'Ocorreu um erro ao tentar salvar os dados.';

            if (!app()->environment('production')) {
                $message .= ' Detalhes: ' . $ex->getMessage();
            }

            return redirect()
                ->route('projects.members', $project)
                ->with('flash', [
                    'type' => 'error',
                    'message' => $message,
                ]);
        }
    }

    public function updateMember(Project $project, ProjectMember $member, Request $request) {
        $request->validate([
            'roleId' => 'required|integer|exists:roles,id',
            'description' => 'nullable|string|max:225',
        ]);

        $input = $request->input();

        $isManager = $member->roleId == env('roleManagerId');
        $changingRole = $input['roleId'] != $member->roleId;

        $hasAnotherManager = $project->members()
            ->where('roleId', env('roleManagerId'))
            ->where('userId', '!=', $member->userId)
            ->exists();

        if ($isManager && $changingRole && !$hasAnotherManager) {
            return redirect()
                ->route('projects.members', $project)
                ->with('flash', [
                    'type' => 'warning',
                    'message' => 'Não é possível alterar a função do único gestor do projeto.',
                ]);
        }

        try {

            $member->update($input);

            return redirect()
                ->to(route('projects.members', $project->id))
                ->with('flash', [
                    'type' => 'success',
                    'message' => 'Dados do membro atualizados com sucesso.',
                ]);
            
        } catch (\Exception $ex) {
            LogHelper::exception($ex);

            $msg = 'Ocorreu um erro ao tentar salvar os dados.';

            if (!app()->environment('production')) {
                $msg .= ' Detalhes: ' . $ex->getMessage();
            }

            return redirect()
                ->to(route('projects.members', $project->id))
                ->with('flash', [
                    'type' => 'error',
                    'message' => $msg,
                ]);
        }
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

    public function deleteInviteMember(Project $project, ProjectInvitation $invitation) {
        if ($invitation->status !== ProjectInvitation::STATUS_PENDING) {
            return redirect()
                ->route('projects.show', $project)
                ->with('flash', [
                    'type' => 'warning',
                    'message' => 'Este convite não pode mais ser cancelado.',
                ]);
        }

        try {
            $invitation->delete();

            return redirect()
                ->route('projects.members', $project)
                ->with('flash', [
                    'type' => 'success',
                    'message' => 'Convite cancelado com sucesso.',
                ]);

        } catch (\Throwable $ex) {
            LogHelper::exception($ex);

            $message = 'Ocorreu um erro ao tentar salvar os dados.';

            if (!app()->environment('production')) {
                $message .= ' Detalhes: ' . $ex->getMessage();
            }

            return redirect()
                ->route('projects.members', $project)
                ->with('flash', [
                    'type' => 'error',
                    'message' => $message,
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
