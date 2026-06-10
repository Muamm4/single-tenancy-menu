<?php

namespace App\Http\Controllers\Public;

use App\Models\Product;
use App\Http\Controllers\Controller;
use Inertia\Inertia;

class ProductController extends Controller
{
    public function show(int $id)
    {
        $product = Product::with([
            'category',
            'addonCategories' => function ($query) {
                $query->where('is_active', true)->orderBy('sort_order');
            },
            'addonCategories.addons' => function ($query) {
                $query->where('is_active', true)->orderBy('sort_order');
            },
        ])->where('is_active', true)->findOrFail($id);

        return Inertia::render('public/ProductDetail', [
            'product' => $product,
        ]);
    }
}
