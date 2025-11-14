<?php

namespace App\Http\Controllers;

use App\Helpers\LogHelper;
use App\Models\ProjectStatus;
use Illuminate\Http\Request;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Symfony\Component\Translation\Dumper\FileDumper;

class ProjectStatusController extends Controller
{
    public function show(Request $request): Response {
        $search = $request->input('search');

        $projectStatus = ProjectStatus::query()
            ->when($search, function($query, $search) {
                $query->where('name', 'like', "%{$search}%");
            })
            ->orderBy('created_at', 'desc')
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('admin/projectStatus/list', [
            'projectStatus' => $projectStatus,
        ]);
    }

    public function edit(ProjectStatus $projectStatus): Response {
        return Inertia::render('admin/projectStatus/form', [
            'projectStatus' => $projectStatus,
        ]);
    }

    public function update(ProjectStatus $projectStatus, Request $request): RedirectResponse {
        $request->validate([
            'name' => 'required|string|max:45|unique:projectsStatus,name,' . $projectStatus->id,
        ]);

        $input = $request->only(['name']);

        try {

            $projectStatus->fill($input)->save();

            return redirect()
                ->route('admin.projectStatus.list')
                ->with('flash', [
                    'type' => 'success',
                    'message' => 'Status de projeto atualizado com sucesso.',
                ]);
            
        } catch (\Exception $ex) {
            LogHelper::exception($ex);

            $msg = 'Ocorreu um erro ao tentar salvar os dados.';

            if (!app()->environment('production')) {
                $msg .= ' Detalhes: ' . $ex->getMessage();
            }

            return redirect(route('admin.projectStatus.list'))->with('flash', [
                'type' => 'error',
                'message' => $msg,
            ]);
        }
    }

    public function delete(ProjectStatus $projectStatus): RedirectResponse {
        if(!$projectStatus->projects->isEmpty()) {
            return redirect()
                ->route('admin.projectStatus.list')
                ->with('flash', [
                    'type' => 'error',
                    'message' => 'Não é possível excluir esse status, pois está vinculado aos projetos: ' 
                        . $projectStatus->projects->pluck('name')->join(', ')
                ]);
        }

        try {    
            $projectStatus->delete();

            return redirect()
                ->route('admin.projectStatus.list')
                ->with('flash', [
                    'type' => 'success',
                    'message' => 'Status de projeto excluído com sucesso.',
                ]);

        } catch (\Exception $ex) {
            LogHelper::exception($ex);

            $msg = 'Ocorreu um erro ao tentar salvar os dados.';

            if (!app()->environment('production')) {
                $msg .= ' Detalhes: ' . $ex->getMessage();
            }

            return redirect(route('admin.projectStatus.list'))->with('flash', [
                'type' => 'error',
                'message' => $msg,
            ]);
        }
    }
    
    public function form(): Response {
        return Inertia::render('admin/projectStatus/form', [
        ]);
    }

    public function store(Request $request): RedirectResponse {
        $request->validate([
            'name' => 'required|string|max:45|unique:tasksStatus,name',
        ]);

        try {
            
            ProjectStatus::create([
                'name' => $request->name,
            ]);

            return redirect()
                ->route('admin.projectStatus.list')
                ->with('flash', [
                    'type' => 'success',
                    'message' => 'Status de projeto criado com sucesso!',
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
        $status = ProjectStatus::query()
            ->with(['projects'])
            ->findOrFail($id);
                
        return response()->json([
            'projectStatus' => $status,
            'projects' => $status->projects,
            'canDelete' => $status->projects->isEmpty(),
        ]);
    }
}