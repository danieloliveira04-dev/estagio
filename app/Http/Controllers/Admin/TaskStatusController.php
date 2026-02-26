<?php

namespace App\Http\Controllers\Admin;

use App\Helpers\LogHelper;
use App\Http\Controllers\Controller;
use App\Models\TaskStatus;
use Illuminate\Http\Request;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;

class TaskStatusController extends Controller
{
    public function show(Request $request): Response {
        $search = $request->input('search');

        $taskStatus = TaskStatus::query()
            ->when($search, function($query, $search) {
                $query->where('name', 'like', "%{$search}%");
            })
            ->orderBy('created_at', 'desc')
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('admin/taskStatus/list', [
            'taskStatus' => $taskStatus,
        ]);
    }

    public function edit(TaskStatus $taskStatus): Response {
        return Inertia::render('admin/taskStatus/form', [
            'taskStatus' => $taskStatus,
        ]);
    }

    public function update(TaskStatus $taskStatus, Request $request): RedirectResponse {
        $request->validate([
            'name' => 'required|string|max:45|unique:tasksStatus,name,' . $taskStatus->id,
        ]);

        $input = $request->only(['name']);

        try {

            $taskStatus->fill($input)->save();

            return redirect()
                ->route('admin.taskStatus.list')
                ->with('flash', [
                    'type' => 'success',
                    'message' => 'Status da tarefa atualizado com sucesso.',
                ]);
            
        } catch (\Exception $ex) {
            LogHelper::exception($ex);

            $msg = 'Ocorreu um erro ao tentar salvar os dados.';

            if (!app()->environment('production')) {
                $msg .= ' Detalhes: ' . $ex->getMessage();
            }

            return redirect(route('admin.taskStatus.list'))->with('flash', [
                'type' => 'error',
                'message' => $msg,
            ]);
        }
    }

    public function delete(TaskStatus $taskStatus): RedirectResponse {
        if(!$taskStatus->tasks->isEmpty()) {
            return redirect()
                ->route('admin.taskStatus.list')
                ->with('flash', [
                    'type' => 'error',
                    'message' => 'Não é possível excluir este perfil, pois está vinculado aos usuários: ' 
                        . $taskStatus->users()->pluck('name')->join(', ')
                ]);
        }

        try {    
            $taskStatus->delete();

            return redirect()
                ->route('admin.taskStatus.list')
                ->with('flash', [
                    'type' => 'success',
                    'message' => 'Status da tarefa excluído com sucesso.',
                ]);

        } catch (\Exception $ex) {
            LogHelper::exception($ex);

            $msg = 'Ocorreu um erro ao tentar salvar os dados.';

            if (!app()->environment('production')) {
                $msg .= ' Detalhes: ' . $ex->getMessage();
            }

            return redirect(route('admin.taskStatus.list'))->with('flash', [
                'type' => 'error',
                'message' => $msg,
            ]);
        }
    }
    
    public function form(): Response {
        return Inertia::render('admin/taskStatus/form', [
        ]);
    }

    public function store(Request $request): RedirectResponse {
        $request->validate([
            'name' => 'required|string|max:45|unique:tasksStatus,name',
        ]);

        try {
            
            TaskStatus::create([
                'name' => $request->name,
            ]);

            return redirect()
                ->route('admin.taskStatus.list')
                ->with('flash', [
                    'type' => 'success',
                    'message' => 'Status da tarefa criado com sucesso!',
                ]);

        } catch (\Exception $ex) {
            LogHelper::exception($ex);

            $msg = 'Ocorreu um erro ao tentar salvar os dados.';

            if (!app()->environment('production')) {
                $msg .= ' Detalhes: ' . $ex->getMessage();
            }

            return back()->withInput()->with('flash', [
                'type' => 'error',
                'message' => $msg,
            ]);
        }
    }

    public function getDetails(string $id) {
        $taskStatus = TaskStatus::query()
            ->with(['tasks'])
            ->findOrFail($id);
                
        return response()->json([
            'taskStatus' => $taskStatus,
            'tasks' => $taskStatus->tasks,
            'canDelete' => $taskStatus->tasks->isEmpty(),
        ]);
    }
}