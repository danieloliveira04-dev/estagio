<?php

namespace App\Http\Controllers;

use App\Models\Tag;
use Illuminate\Http\Request;
use Inertia\Response;
use Inertia\Inertia;
use App\Helpers\LogHelper;
use Illuminate\Http\RedirectResponse;

class TagController extends Controller
{
    public function show(Request $request): Response {
        $search = $request->input('search');

        $tags = Tag::query()
            ->when($search, function($query, $search) {
                $query->where('name', 'like', "%{$search}%");
            })
            ->orderBy('created_at', 'desc')
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('admin/tags/list', [
            'tags' => $tags, 
        ]);
    }

    public function edit(Tag $tag): Response {
        return Inertia::render('admin/tags/form', [
            'tag' => $tag,
        ]);
    }

    public function update(Request $request, Tag $tag): RedirectResponse {
        $request->validate([
            'name' => 'required|string|min:3|max:45|unique:tags,name,' . $tag->id,
        ]);

        $input = $request->only(['name']);

        try {

            $tag->fill($input)->save();

            return redirect()
                ->route('admin.tags.list')
                ->with('flash', [
                    'type' => 'success',
                    'message' => 'Tag atualizada com sucesso.',
                ]);

        } catch (\Exception $ex) {
            LogHelper::exception($ex);

            $msg = 'Ocorreu um erro ao tentar salvar os dados.';

            if (!app()->environment('production')) {
                $msg .= ' Detalhes: ' . $ex->getMessage();
            }

            return redirect(route('admin.tags.list'))->with('flash', [
                'type' => 'error',
                'message' => $msg,
            ]);
        }
    }

    public function delete(Tag $tag): RedirectResponse {
        try {    
            $tag->delete();

            return redirect()
                ->route('admin.tags.list')
                ->with('flash', [
                    'type' => 'success',
                    'message' => 'Tag excluída com sucesso.',
                ]);

        } catch (\Exception $ex) {
            LogHelper::exception($ex);

            $msg = 'Ocorreu um erro ao tentar salvar os dados.';

            if (!app()->environment('production')) {
                $msg .= ' Detalhes: ' . $ex->getMessage();
            }

            return redirect(route('admin.tags.list'))->with('flash', [
                'type' => 'error',
                'message' => $msg,
            ]);
        }
    }

    public function form(): Response {
        return Inertia::render('admin/tags/form', []);
    }

    public function store(Request $request): RedirectResponse {
        $request->validate([
            'name' => 'required|string|min:3|max:45|unique:tags,name'
        ]);

        try {

            Tag::create([
                'name' => $request->name,
            ]);

            return redirect()
                ->route('admin.tags.list')
                ->with('flash', [
                    'type' => 'success',
                    'message' => 'Tag criada com sucesso!',
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
        $tag = Tag::query()
            ->findOrFail($id);

        return response()->json([
            'tag' => $tag,
            'canDelete' => true,
        ]);
    }
}
