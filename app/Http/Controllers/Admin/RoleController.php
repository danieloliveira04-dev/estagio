<?php

namespace App\Http\Controllers\Admin;

use App\Helpers\LogHelper;
use App\Http\Controllers\Controller;
use App\Models\Role;
use Illuminate\Http\Request;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;

class RoleController extends Controller
{
    public function show(Request $request): Response {
        $roles = Role::query()
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('admin/roles/list', [
            'roles' => $roles,
        ]);
    }

    public function edit(Role $role): Response {
        return Inertia::render('admin/roles/form', [
            'role' => $role,
            'types' => [Role::TYPE_PROFILE, Role::TYPE_FUNCTION],
        ]);
    }

    public function update(Role $role, Request $request): RedirectResponse {
        $request->validate([
            'name' => 'required|string|max:45|unique:roles,name,' . $role->id,
            'type' => 'required|in:' . implode(',', [Role::TYPE_PROFILE, Role::TYPE_FUNCTION]),
        ]);

        $input = $request->only(['name', 'type']);

        try {

            $role->fill($input);
            $role->save();

            return redirect()
                ->route('admin.roles.list')
                ->with('flash', [
                    'type' => 'success',
                    'message' => 'Perfil atualizado com sucesso.',
                ]);
            
        } catch (\Exception $ex) {
            LogHelper::exception($ex);

            $msg = 'Ocorreu um erro ao tentar salvar os dados.';

            if (!app()->environment('production')) {
                $msg .= ' Detalhes: ' . $ex->getMessage();
            }

            return redirect(route('admin.roles.list'))->with('flash', [
                'type' => 'error',
                'message' => 'Ocorreu um erro ao tentar salvar os dados.',
            ]);
        }
    }

    public function delete(Role $role): RedirectResponse {
        if(!$role->users->isEmpty()) {
            return redirect()
                ->route('admin.roles.list')
                ->with('flash', [
                    'type' => 'error',
                    'message' => 'Não é possível excluir este perfil, pois está vinculado aos usuários: ' 
                        . $role->users()->pluck('name')->join(', ')
                ]);
        }

        try {    
            $role->delete();

            return redirect()
                ->route('admin.roles.list')
                ->with('flash', [
                    'type' => 'success',
                    'message' => 'Perfil excluído com sucesso.',
                ]);

        } catch (\Exception $ex) {
            LogHelper::exception($ex);

            $msg = 'Ocorreu um erro ao tentar salvar os dados.';

            if (!app()->environment('production')) {
                $msg .= ' Detalhes: ' . $ex->getMessage();
            }

            return redirect(route('admin.roles.list'))->with('flash', [
                'type' => 'error',
                'message' => 'Ocorreu um erro ao tentar salvar os dados.',
            ]);
        }
    }
    
    public function form(): Response {
        return Inertia::render('admin/roles/form', [
            'types' => [Role::TYPE_PROFILE, Role::TYPE_FUNCTION],
        ]);
    }

    public function store(Request $request): RedirectResponse {
        $request->validate([
            'name' => 'required|string|max:45|unique:roles,name',
            'type' => 'required|in:' . implode(',', [Role::TYPE_PROFILE, Role::TYPE_FUNCTION]),
        ]);

        try {
            
            Role::create([
                'name' => $request->name,
                'type' => $request->type,
            ]);

            return redirect()
                ->route('admin.roles.list')
                ->with('flash', [
                    'type' => 'success',
                    'message' => 'Perfil criado com sucesso!',
                ]);

        } catch (\Exception $ex) {
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

    public function getDetails(string $id) {
        $role = Role::query()
            ->with(['users'])
            ->findOrFail($id);
                
        return response()->json([
            'role' => $role,
            'users' => $role->users,
            'canDelete' => $role->users->isEmpty(),
        ]);
    }
}
