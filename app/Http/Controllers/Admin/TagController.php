<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreTagRequest;
use App\Http\Requests\Admin\UpdateTagRequest;
use App\Models\Tag;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;

class TagController extends Controller
{
    public function index()
    {
        return Inertia::render('admin/tags/index', [
            'tags' => Tag::paginate(10)
        ]);
    }

    public function create()
    {
        return Inertia::render('admin/tags/create');
    }

    public function store(StoreTagRequest $request)
    {
        Tag::create([
            'name' => $request->name,
            'slug' => Str::slug($request->name),
        ]);

        return redirect()->route('admin.tags.index')->with('success', 'Etiqueta creada.');
    }

    public function edit(Tag $tag)
    {
        return Inertia::render('admin/tags/edit', [
            'tag' => $tag
        ]);
    }

    public function update(UpdateTagRequest $request, Tag $tag)
    {
        $tag->update([
            'name' => $request->name,
            'slug' => Str::slug($request->name),
        ]);

        return redirect()->route('admin.tags.index')->with('success', 'Etiqueta actualizada.');
    }

    public function destroy(Request $request, Tag $tag)
    {
        //if($request->user()->cannot('manage tags')){
        if(!$request->user()->hasRole('administrador')){
            abort(403, 'No tienes permisos para esta accion');
        }

        $tag->delete();
        return redirect()->route('admin.tags.index')->with('success', 'Tag eliminada con éxito.');
    }
}
