<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreProductRequest;
use App\Http\Requests\UpdateProductRequest;
use App\Models\Category;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class ProductController extends Controller
{
    public function index(Request $request)
    {
        $query = Product::with('category');

        if ($request->filled('category_id')) {
            $query->where('category_id', $request->category_id);
        }

        $products = $query->orderBy('sort_order')
            ->orderBy('name')
            ->paginate(10)
            ->withQueryString();

        $categories = Category::orderBy('name')->get(['id', 'name']);

        return Inertia::render('admin/products/Index', [
            'products' => $products,
            'categories' => $categories,
            'filterCategory' => $request->category_id,
        ]);
    }

    public function create()
    {
        $categories = Category::orderBy('name')->get();

        return Inertia::render('admin/products/Form', [
            'categories' => $categories,
        ]);
    }

    public function store(StoreProductRequest $request)
    {
        $data = $request->validated();

        if ($request->hasFile('image')) {
            $data['image'] = $request->file('image')->store('products', 'public');
        }

        $data['is_active'] = $request->boolean('is_active');
        $sortOrder = $request->input('sort_order')
            ? (int) $request->input('sort_order')
            : Product::where('category_id', $data['category_id'])->max('sort_order') + 1;

        if ($request->input('sort_order')) {
            DB::transaction(function () use ($data, $sortOrder) {
                Product::where('category_id', $data['category_id'])
                    ->where('sort_order', '>=', $sortOrder)
                    ->increment('sort_order');

                Product::create(array_merge($data, ['sort_order' => $sortOrder]));
            });
        } else {
            $data['sort_order'] = $sortOrder;
            Product::create($data);
        }

        return redirect()->route('admin.products.index')
            ->with('success', 'Produto criado com sucesso.');
    }

    public function edit(Product $product)
    {
        $categories = Category::orderBy('name')->get();

        return Inertia::render('admin/products/Form', [
            'product' => $product,
            'categories' => $categories,
        ]);
    }

    public function update(UpdateProductRequest $request, Product $product)
    {
        $data = $request->validated();

        if ($request->hasFile('image')) {
            if ($product->image) {
                Storage::disk('public')->delete($product->image);
            }

            $data['image'] = $request->file('image')->store('products', 'public');
        } elseif ($request->boolean('remove_image') && $product->image) {
            Storage::disk('public')->delete($product->image);
            $data['image'] = null;
        }

        $data['is_active'] = $request->boolean('is_active');
        $data['sort_order'] = (int) $request->input('sort_order', 0);

        $oldCategoryId = $product->getOriginal('category_id');
        $oldSortOrder = $product->getOriginal('sort_order');
        $newCategoryId = (int) $data['category_id'];
        $newSortOrder = $data['sort_order'];

        $this->reorderProducts($product, $oldSortOrder, $newSortOrder, $oldCategoryId, $newCategoryId);

        $product->update($data);

        return redirect()->route('admin.products.index')
            ->with('success', 'Produto atualizado com sucesso.');
    }

    public function destroy(Product $product)
    {
        if ($product->image) {
            Storage::disk('public')->delete($product->image);
        }

        $product->delete();

        return redirect()->route('admin.products.index')
            ->with('success', 'Produto excluído com sucesso.');
    }

    private function reorderProducts(Product $product, $oldSortOrder, $newSortOrder, $oldCategoryId, $newCategoryId)
    {

     DB::transaction(function () use ($product, $oldCategoryId, $oldSortOrder, $newCategoryId, $newSortOrder) {
            if ($oldCategoryId !== $newCategoryId) {
                // Product moved to a different category
                Product::where('category_id', $oldCategoryId)
                    ->where('sort_order', '>', $oldSortOrder)
                    ->decrement('sort_order');

                Product::where('category_id', $newCategoryId)
                    ->where('sort_order', '>=', $newSortOrder)
                    ->increment('sort_order');
            } elseif ($newSortOrder !== $oldSortOrder) {
                // Same category, sort_order changed
                if ($newSortOrder > $oldSortOrder) {
                    Product::where('category_id', $oldCategoryId)
                        ->where('id', '!=', $product->id)
                        ->whereBetween('sort_order', [$oldSortOrder + 1, $newSortOrder])
                        ->decrement('sort_order');
                } else {
                    Product::where('category_id', $oldCategoryId)
                        ->where('id', '!=', $product->id)
                        ->whereBetween('sort_order', [$newSortOrder, $oldSortOrder - 1])
                        ->increment('sort_order');
                }
            }
        });
    }
}
