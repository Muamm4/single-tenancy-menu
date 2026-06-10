<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreAddonCategoryRequest;
use App\Http\Requests\UpdateAddonCategoryRequest;
use App\Models\AddonCategory;
use Inertia\Inertia;

class AddonCategoryController extends Controller
{
    public function index()
    {
        $addonCategories = AddonCategory::withCount('addons')
            ->orderBy('sort_order')
            ->orderBy('name')
            ->paginate(10);

        return Inertia::render('admin/addon-categories/Index', [
            'addonCategories' => $addonCategories,
        ]);
    }

    public function create()
    {
        return Inertia::render('admin/addon-categories/Form');
    }

    public function store(StoreAddonCategoryRequest $request)
    {
        $data = $request->validated();

        $data['is_active'] = $request->boolean('is_active');
        $data['sort_order'] = (int) $request->input('sort_order', 0);

        AddonCategory::create($data);

        return redirect()->route('admin.addon-categories.index')
            ->with('success', 'Categoria de adicionais criada com sucesso.');
    }

    public function edit(AddonCategory $addonCategory)
    {
        return Inertia::render('admin/addon-categories/Form', [
            'addonCategory' => $addonCategory,
        ]);
    }

    public function update(UpdateAddonCategoryRequest $request, AddonCategory $addonCategory)
    {
        $data = $request->validated();

        $data['is_active'] = $request->boolean('is_active');
        $data['sort_order'] = (int) $request->input('sort_order', 0);

        $addonCategory->update($data);

        return redirect()->route('admin.addon-categories.index')
            ->with('success', 'Categoria de adicionais atualizada com sucesso.');
    }

    public function destroy(AddonCategory $addonCategory)
    {
        $addonCategory->delete();

        return redirect()->route('admin.addon-categories.index')
            ->with('success', 'Categoria de adicionais excluída com sucesso.');
    }
}
