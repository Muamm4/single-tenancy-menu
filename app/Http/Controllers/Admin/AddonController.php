<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreAddonRequest;
use App\Http\Requests\UpdateAddonRequest;
use App\Models\Addon;
use App\Models\AddonCategory;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AddonController extends Controller
{
    public function index(AddonCategory $addonCategory)
    {
        $addons = Addon::where('addon_category_id', $addonCategory->id)
            ->orderBy('sort_order')
            ->orderBy('name')
            ->paginate(10);

        return Inertia::render('admin/addons/Index', [
            'addonCategory' => $addonCategory,
            'addons' => $addons,
        ]);
    }

    public function create(Request $request)
    {
        $addonCategoryId = $request->query('addon_category_id');
        $addonCategory = $addonCategoryId ? AddonCategory::findOrFail($addonCategoryId) : null;

        $addonCategories = AddonCategory::orderBy('name')->get();

        return Inertia::render('admin/addons/Form', [
            'addonCategory' => $addonCategory,
            'addonCategories' => $addonCategories,
        ]);
    }

    public function store(StoreAddonRequest $request)
    {
        $data = $request->validated();

        $data['is_active'] = $request->boolean('is_active');
        $data['sort_order'] = (int) $request->input('sort_order', 0);

        $addon = Addon::create($data);

        return redirect()->route('admin.addons.index', $addon->addon_category_id)
            ->with('success', 'Adicional criado com sucesso.');
    }

    public function edit(Addon $addon)
    {
        $addon->load('category');

        $addonCategories = AddonCategory::orderBy('name')->get();

        return Inertia::render('admin/addons/Form', [
            'addon' => $addon,
            'addonCategory' => $addon->category,
            'addonCategories' => $addonCategories,
        ]);
    }

    public function update(UpdateAddonRequest $request, Addon $addon)
    {
        $data = $request->validated();

        $data['is_active'] = $request->boolean('is_active');
        $data['sort_order'] = (int) $request->input('sort_order', 0);

        $addon->update($data);

        return redirect()->route('admin.addons.index', $addon->addon_category_id)
            ->with('success', 'Adicional atualizado com sucesso.');
    }

    public function destroy(Addon $addon)
    {
        $addonCategoryId = $addon->addon_category_id;

        $addon->delete();

        return redirect()->route('admin.addons.index', $addonCategoryId)
            ->with('success', 'Adicional excluído com sucesso.');
    }
}
