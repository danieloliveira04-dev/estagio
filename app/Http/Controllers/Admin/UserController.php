<?php

namespace App\Http\Controllers\Admin;

use App\Events\InvitationCreated;
use App\Events\UserStatusChanged;
use App\Helpers\LogHelper;
use App\Http\Controllers\Controller;
use App\Models\Invitation;
use App\Models\Role;
use App\Models\Task;
use App\Models\User;
use Carbon\Carbon;
use DB;
use Hash;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Str;

class UserController extends Controller 
{

    public function show(Request $request): Response {
        $search = $request->input('search');

        $users = User::query()
            ->with(['role'])
            ->when($search, function($query, $search) {
                $query->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%");
            })
            ->orderBy('created_at', 'desc')
            ->paginate(10)
            ->withQueryString();
        
        return Inertia::render('admin/users/list', [
            'users' => $users,
        ]);
    }

    public function edit(User $user): Response {

        $user->load(['role']);

        return Inertia::render('admin/users/form', [
            'roles' => Role::where('type', Role::TYPE_PROFILE)->get(),
            'user' => $user,
        ]);
    }

    public function update(User $user, Request $request): RedirectResponse {
        $request->validate([
            'name' => 'required|string|max:225',
            'email' => 'required|string|lowercase|email|max:225|unique:users,email,' . $user->id,
            'password' => 'nullable|min:3',
            'phone' => 'nullable|max:20',
            'roleId' => ['required', 'integer', 'exists:roles,id'],
            'status' => 'required|in:' . implode(',', [User::STATUS_ACTIVE, User::STATUS_INACTIVE]),
        ]);

        $input = $request->only(['name', 'email', 'phone', 'roleId', 'status']);

        if($input['status'] === User::STATUS_INACTIVE) {
            $check = $user->checkDeletionConstraints();

            if ($check['isBlocked']) {
                return redirect()
                    ->route('admin.users.list')
                    ->with('flash', [
                        'type' => 'error',
                        'message' => 'Não é possível inativar este usuário. Ele é o único gestor dos seguintes projetos: ' 
                            . $check['blockedProjects']->pluck('name')->join(', ')
                    ]);
            }
        }
    
        try {
            if ($request->filled('password')) {
                $input['password'] = Hash::make($request->password);
            }

            $user->fill($input);
            $user->save();

            event(new UserStatusChanged($user));

            return redirect()
                ->route('admin.users.list')
                ->with('flash', [
                    'type' => 'success',
                    'message' => 'Usuário atualizado com sucesso.',
                ]);
            
        } catch (\Exception $ex) {
            LogHelper::exception($ex);

            $msg = 'Ocorreu um erro ao tentar salvar os dados.';

            if (!app()->environment('production')) {
                $msg .= ' Detalhes: ' . $ex->getMessage();
            }

            return redirect(route('admin.users.list'))->with('flash', [
                'type' => 'error',
                'message' => 'Ocorreu um erro ao tentar salvar os dados.',
            ]);
        }
    }

    public function delete(User $user): RedirectResponse {
        $check = $user->checkDeletionConstraints();

        if ($check['isBlocked']) {
            return redirect()
                ->route('admin.users.list')
                ->with('flash', [
                    'type' => 'error',
                    'message' => 'Não é possível excluir este usuário. Ele é o único gestor dos seguintes projetos: ' 
                        . $check['blockedProjects']->pluck('name')->join(', ')
                ]);
        }

        try {
            DB::beginTransaction();
            
            $user->delete();

            Task::query()
                ->where('pmUserId', $user->id)
                ->update([
                    'projectMemberId' => null,
                ]);

            event(new UserStatusChanged($user));

            DB::commit();

            return redirect()
                ->route('admin.users.list')
                ->with('flash', [
                    'type' => 'success',
                    'message' => 'Usuário excluído com sucesso.',
                ]);

        } catch (\Exception $ex) {
            DB::rollBack();

            LogHelper::exception($ex);

            $msg = 'Ocorreu um erro ao tentar salvar os dados.';

            if (!app()->environment('production')) {
                $msg .= ' Detalhes: ' . $ex->getMessage();
            }

            return redirect(route('admin.users.list'))->with('flash', [
                'type' => 'error',
                'message' => 'Ocorreu um erro ao tentar salvar os dados.',
            ]);
        }
    }

    public function inviteForm(): Response {
        return Inertia::render('admin/users/invite/form', [
            'roles' => Role::where('type', Role::TYPE_PROFILE)->get(),
        ]);
    }

    public function inviteStore(Request $request): RedirectResponse {
        $request->validate([
            'email' => 'required|string|lowercase|email|max:225|unique:'.User::class,
            'roleId' => ['required', 'integer', 'exists:roles,id'],
        ]);

        /** @var \Illuminate\Contracts\Auth\Guard|\Illuminate\Contracts\Auth\StatefulGuard $auth */
        $auth = auth();

        try {
            DB::beginTransaction();

            // Expira convites pendentes existentes para o mesmo email
            Invitation::query()
                ->where('email', $request->email)
                ->where('status', Invitation::STATUS_PENDING)
                ->update(['status' => Invitation::STATUS_EXPIRED]);

            $invitation = Invitation::create([
                'email' => $request->email,
                'roleId' => $request->roleId,
                'token' => Str::uuid(),
                'status' => Invitation::STATUS_PENDING,
                'expiredAt' => Carbon::now()->addDays(7),
                'createdByUserId' => $auth->user()->id,
            ]);

            event(new InvitationCreated($invitation));

            DB::commit();

            return redirect()
                ->route('admin.users.list')
                ->with('flash', [
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

            return back()->withInput()->with('flash', [
                'type' => 'error',
                'message' => 'Ocorreu um erro ao tentar salvar os dados.',
            ]);
        }
    }

    //--

    public function autocomplete(Request $request) {
        $filters = $request->query();

        $users = User::query()
            ->when($filters['query'] ?? false, function ($query, $text) {
                $query->where('email', 'like', $text . '%');
            })
            ->when($filters['email'] ?? false, function ($query, $email) {
                $query->where('email', $email);
            })
            ->get();

        return response()->json($users);
    }

    public function getDetails(string $id) {
        $user = User::query()
            ->with([
                'projects' => function($query) use ($id) {
                    $query->with([
                        'members',
                        'tasks' => function($tasksQuery) use ($id) {
                            $tasksQuery->where('pmUserId', $id);
                        }
                    ]);
                }
            ])
            ->findOrFail($id);

        // Montar lista de projetos onde ele é gestor e não há outro gestor
        $projectsBlocked = $user->projects->filter(function ($project) use ($user) {
            $managers = $project->members->filter(fn($member) => $member->roleId === Role::MANAGER);
            return $managers->count() === 1 && $managers->first()->userId === $user->id;
        })->values();
                
        return response()->json([
            'user' => $user,
            'projectsCount' => $user->projects->count(),
            'tasksCount' => $user->projects->sum(fn($p) => $p->tasks->count()),
            'projectsBlocked' => $projectsBlocked,
            'canDelete' => $projectsBlocked->isEmpty(),
        ]);
    }

}