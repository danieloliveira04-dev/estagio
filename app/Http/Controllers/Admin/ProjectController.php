<?php

namespace App\Http\Controllers\Admin;

use App\Events\ProjectClosed;
use App\Helpers\LogHelper;
use App\Http\Controllers\Controller;
use App\Models\Project;
use App\Models\TaskHistory;
use App\Models\Template;
use Illuminate\Http\Request;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use DB;

class ProjectController extends Controller {
    
    public function index(Request $request): Response {
        $search = $request->input('search');

        $projects = Project::query()
            ->when($search, function ($query, $search) {
                $query->where('name', 'like', "%{$search}%");
            })
            ->with(['projectStatus', 'customer'])
            // ->whereNot('projectStatusId', env('projectStatusClosedId'))
            ->orderBy('created_at', 'desc')
            ->paginate(10)
            ->withQueryString();
        
        return Inertia::render('admin/projects/list', [
            'projects' => $projects,
        ]);
    }

    public function edit(Project $project): Response|RedirectResponse {
        if($project->projectStatusId == env('projectStatusClosedId')) {
            return redirect()
                ->route('admin.projects.list')
                ->with('flash', [
                    'type' => 'error',
                    'message' => 'Este projeto já está encerrado e não pode mais ser alterado.',
                ]);
        }

        return Inertia::render('admin/projects/form', [
            'project' => $project,
            'projectStatus' => \App\Models\ProjectStatus::whereNot('id', env('projectStatusClosedId'))->get(),
            'templates' => \App\Models\Template::get(),
        ]);
    }

    public function update(Project $project, Request $request): RedirectResponse {

        $request->validate([
            'name' => 'required|string|min:3|max:120',
            'description' => 'nullable|string|max:500',
            'customerUserId' => 'nullable|integer|exists:users,id',
            'projectStatusId' => 'nullable|integer|exists:projectsStatus,id',
            'expectedEndAt' => 'nullable|date|after_or_equal:today',
        ]);

        $input = $request->all();

        $input['customerUserId'] = empty($input['customerUserId']) ? null : $input['customerUserId'];

        if($project->projectStatusId == env('projectStatusClosedId')) {
            return redirect()
                ->route('admin.projects.list')
                ->with('flash', [
                    'type' => 'error',
                    'message' => 'Este projeto já está encerrado e não pode mais ser alterado.',
                ]);
        }

        try {

            $project->fill($input)->save();

            return redirect()
                ->route('admin.projects.list')
                ->with('flash', [
                    'type' => 'success',
                    'message' => 'Projeto atualizado com sucesso.',
                ]); 

        } catch (\Exception $ex) {
            LogHelper::exception($ex);

            $msg = 'Ocorreu um erro ao tentar salvar os dados.';

            if (!app()->environment('production')) {
                $msg .= ' Detalhes: ' . $ex->getMessage();
            }

            return redirect(route('admin.projects.list'))->with('flash', [
                'type' => 'error',
                'message' => $msg,
            ]);
        }
    }

    public function terminate(Project $project, Request $request): RedirectResponse {
        $request->validate([
            'reason' => 'required|string|min:3',
        ]);

        $closeReason = $request->input('reason');

        if($project->projectStatusId == env('projectStatusClosedId')) {
            return redirect()
                ->route('admin.projects.list')
                ->with('flash', [
                    'type' => 'error',
                    'message' => 'Este projeto já está encerrado e não pode mais ser alterado.',
                ]);
        }

        try {

            DB::beginTransaction();

            $project->update([
                'projectStatusId' => env('projectStatusClosedId'),
                'closeReason' => $closeReason,
            ]);

            $tasks = $project->tasks()->getQuery()
                ->where('taskStatusId', '!=', env('taskStatusCompletedId'))
                ->get();

            foreach($tasks as $task) {
                $task->update([
                    'taskStatusId' => env('taskStatusCanceledId'),
                ]);

                $task->taskHistory()->create([
                    'taskStatusId' => $task->taskStatusId,
                    'userId' => $request->user()->id,
                    'action' => TaskHistory::ACTION_STATUS_CHANGED,
                    'description' => 'Tarefa cancelada automaticamente devido ao encerramento do projeto.',
                ]);
            }

            DB::commit();
            
            event(new ProjectClosed($project));

            return redirect()
                ->route('admin.projects.list')
                ->with('flash', [
                    'type' => 'success',
                    'message' => 'Projeto encerrado com sucesso.',
                ]);
            
        } catch (\Exception $ex) {
            DB::rollBack();

            LogHelper::exception($ex);

            $msg = 'Ocorreu um erro ao tentar salvar os dados.';

            if (!app()->environment('production')) {
                $msg .= ' Detalhes: ' . $ex->getMessage();
            }

            return redirect(route('admin.projects.list'))->with('flash', [
                'type' => 'error',
                'message' => 'Ocorreu um erro ao tentar salvar os dados.',
            ]);
        }
    }

    public function form(): Response {
        return Inertia::render('admin/projects/form', [
            'projectStatus' => \App\Models\ProjectStatus::whereNot('id', env('projectStatusClosedId'))->get(),
            'templates' => \App\Models\Template::get(),
        ]);
    }

    public function store(Request $request): RedirectResponse {
        $request->validate([
            'name' => 'required|string|min:3|max:120',
            'prefix' => 'required|string|size:3|unique:projects,prefix',
            'description' => 'nullable|string|max:500',
            'customerUserId' => 'nullable|integer|exists:users,id',
            'managersIds' => 'required|array|min:1',
            'managersIds.*' => 'integer|exists:users,id',
            'projectStatusId' => 'required|integer|exists:projectsStatus,id',
            'expectedEndAt' => 'nullable|date|after_or_equal:today',
            'templateId' => 'nullable|integer|exists:templates,id',
        ]);

        try {

            DB::beginTransaction();

            $data = $request->all();
            $data['prefix'] = strtoupper($data['prefix']);

            $project = Project::create($data);

            if($request->filled('customerUserId')) {
                $project->members()->create([
                    'userId' => $request->input('customerUserId'),
                    'roleId' => env('roleCustomerId'),
                    'description' => 'Parte interessada principal do projeto',
                ]);
            }

            //--

            $managersData = collect($request->input('managersIds', []))->map(function ($userId) {
                return [
                    'userId' => $userId,
                    'roleId' => env('roleManagerId'),
                    'description' => 'Responsável pela gestão e organização das atividades do projeto',
                ];
            });
            
            $project->members()->createMany($managersData);

            //--

            if($request->filled('templateId')) {
                $template = Template::with('columns')->find($request->input('templateId'));

                $columns = $template->columns->map(function($column, $index) {
                    return [
                        'name' => $column->name,
                        'taskStatusId' => $column->taskStatusId,
                        'position' => $index,   
                    ];
                });

                $project->columns()->createMany($columns);
            }

            DB::commit();

            return redirect()
                ->route('admin.projects.list')
                ->with('flash', [
                    'type' => 'success',
                    'message' => 'Projeto criado com sucesso!',
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
                'message' => $msg,
            ]);
        }
    }

    public function getDetails(string $id) {
        $project = Project::query()
            ->withCount(['tasks' => function($query) {
                $query->whereNot('taskStatusId', env('taskStatusCompletedId'));
            }])
            ->findOrFail($id);
                
        return response()->json([
            'project' => $project,
            'pendingTasks' => $project->tasks_count,
            'canDelete' => true,
        ]);
    }

}
