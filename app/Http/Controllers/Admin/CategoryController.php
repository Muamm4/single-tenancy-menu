<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreCategoryRequest;
use App\Http\Requests\UpdateCategoryRequest;
use App\Models\Category;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class CategoryController extends Controller
{
    public function index()
    {
        $categories = Category::withCount('products')
            ->orderBy('sort_order')
            ->orderBy('name')
            ->paginate(10);

        return Inertia::render('admin/categories/Index', [
            'categories' => $categories,
        ]);
    }

    public function create()
    {
        return Inertia::render('admin/categories/Form');
    }

    public function store(StoreCategoryRequest $request)
    {
        $data = $request->validated();

        if ($request->hasFile('image')) {
            $data['image'] = $request->file('image')->store('categories', 'public');
        }

        $data['is_active'] = $request->boolean('is_active');
        $sortOrder = $request->input('sort_order')
            ? (int) $request->input('sort_order')
            : Category::max('sort_order') + 1;

        if ($request->input('sort_order')) {
            DB::transaction(function () use ($data, $sortOrder) {
                Category::where('sort_order', '>=', $sortOrder)
                    ->increment('sort_order');

                Category::create(array_merge($data, ['sort_order' => $sortOrder]));
            });
        } else {
            $data['sort_order'] = $sortOrder;
            Category::create($data);
        }

        return redirect()->route('admin.categories.index')
            ->with('success', 'Categoria criada com sucesso.');
    }

    public function edit(Category $category)
    {
        return Inertia::render('admin/categories/Form', [
            'category' => $category,
        ]);
    }

    public function update(UpdateCategoryRequest $request, Category $category)
    {
        $data = $request->validated();

        if ($request->hasFile('image')) {
            if ($category->image) {
                Storage::disk('public')->delete($category->image);
            }

            $data['image'] = $request->file('image')->store('categories', 'public');
        }

        $data['is_active'] = $request->boolean('is_active');
        $data['sort_order'] = (int) $request->input('sort_order', 0);

        $oldSortOrder = $category->getOriginal('sort_order');
        $newSortOrder = $data['sort_order'];

        if ($newSortOrder !== $oldSortOrder) {
            DB::transaction(function () use ($category, $oldSortOrder, $newSortOrder) {
                if ($newSortOrder > $oldSortOrder) {
                    Category::where('id', '!=', $category->id)
                        ->whereBetween('sort_order', [$oldSortOrder + 1, $newSortOrder])
                        ->decrement('sort_order');
                } else {
                    Category::where('id', '!=', $category->id)
                        ->whereBetween('sort_order', [$newSortOrder, $oldSortOrder - 1])
                        ->increment('sort_order');
                }
            });
        }

        $category->update($data);

        return redirect()->route('admin.categories.index')
            ->with('success', 'Categoria atualizada com sucesso.');
    }

    public function destroy(Category $category)
    {
        if ($category->image) {
            Storage::disk('public')->delete($category->image);
        }

        $category->delete();

        return redirect()->route('admin.categories.index')
            ->with('success', 'Categoria excluída com sucesso.');
    }
}
