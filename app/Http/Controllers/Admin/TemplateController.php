<?php

namespace App\Http\Controllers\Admin;

use App\Models\Template;
use Illuminate\Http\Request;
use Inertia\Response;
use Inertia\Inertia;
use App\Helpers\LogHelper;
use App\Http\Controllers\Controller;
use App\Models\TaskStatus;
use DB;
use Illuminate\Http\RedirectResponse;

class TemplateController extends Controller
{
    public function index(Request $request): Response {
        $search = $request->input('search');

        $templates = Template::query()
            ->when($search, function($query, $search) {
                $query->where('name', 'like', "%{$search}%");
            })
            ->orderBy('created_at', 'desc')
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('admin/templates/list', [
            'templates' => $templates, 
        ]);
    }

    public function edit(Template $template): Response {
        $template->load('columns');
        return Inertia::render('admin/templates/form', [
            'template' => $template,
            'taskStatus' => TaskStatus::query()->get(),
        ]);
    }

    public function update(Request $request, Template $template): RedirectResponse {
        $validator = \Validator::make($request->all(), [
            'name' => 'required|string|min:3|max:45|unique:templates,name,' . $template->id,
            'columns' => 'array|min:1',
            'columns.*.name' => 'required|string|max:45',
            'columns.*.taskStatusId' => 'nullable|exists:tasksStatus,id',
        ]);

        $validator->after(function ($validator) use ($request) {
            if ($request->filled('columns')) {
                $names = array_column($request->columns, 'name');

                if (count($names) !== count(array_unique($names))) {
                    $validator->errors()->add('columns', 'Os nomes das colunas não podem se repetir.');
                }
            }
        });

        $validated = $validator->validate();

        try {

            DB::beginTransaction();

            $template->fill([
                'name' => $validated['name'],
            ])->save();

            $template->columns()->delete();
            $template->columns()->createMany($validated['columns']);

            DB::commit();

            return redirect()
                ->route('admin.templates.list')
                ->with('flash', [
                    'type' => 'success',
                    'message' => 'Modelo atualizado com sucesso.',
                ]);

        } catch (\Exception $ex) {
            DB::rollBack();

            LogHelper::exception($ex);

            $msg = 'Ocorreu um erro ao tentar salvar os dados.';

            if (!app()->environment('production')) {
                $msg .= ' Detalhes: ' . $ex->getMessage();
            }

            return redirect(route('admin.templates.list'))->with('flash', [
                'type' => 'error',
                'message' => $msg,
            ]);
        }
    }

    public function delete(Template $template): RedirectResponse {
        try {

            $template->delete();

            return redirect()
                ->route('admin.templates.list')
                ->with('flash', [
                    'type' => 'success',
                    'message' => 'Modelo excluído com sucesso.',
                ]);

        } catch (\Exception $ex) {
            LogHelper::exception($ex);

            $msg = 'Ocorreu um erro ao tentar salvar os dados.';

            if (!app()->environment('production')) {
                $msg .= ' Detalhes: ' . $ex->getMessage();
            }

            return redirect(route('admin.templates.list'))->with('flash', [
                'type' => 'error',
                'message' => $msg,
            ]);
        }
    }

    public function form(): Response {
        return Inertia::render('admin/templates/form', [
            'taskStatus' => TaskStatus::query()->get(),
        ]);
    }

    public function store(Request $request): RedirectResponse {
        $validator = \Validator::make($request->all(), [
            'name' => 'required|string|min:3|max:45|unique:templates,name',
            'columns' => 'array|min:1',
            'columns.*.name' => 'required|string|max:45',
            'columns.*.taskStatusId' => 'nullable|exists:tasksStatus,id',
        ]);

        $validator->after(function ($validator) use ($request) {
            if ($request->filled('columns')) {
                $names = array_column($request->columns, 'name');

                if (count($names) !== count(array_unique($names))) {
                    $validator->errors()->add('columns', 'Os nomes das colunas não podem se repetir.');
                }
            }
        });

        $validated = $validator->validate();

        try {

            DB::beginTransaction();

            $template = Template::create([
                'name' => $validated['name'],
            ]);

            $template->columns()->createMany($validated['columns']);

            DB::commit();

            return redirect()
                ->route('admin.templates.list')
                ->with('flash', [
                    'type' => 'success',
                    'message' => 'Modelo criado com sucesso!',
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
        $template = Template::query()
            ->findOrFail($id);

        return response()->json([
            'template' => $template,
            'canDelete' => true,
        ]);
    }
}
