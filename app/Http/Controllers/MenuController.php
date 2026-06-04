<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Inertia\Inertia;

class MenuController extends Controller
{
    public function index()
    {
        $categories = Category::with(['products' => function ($query) {
            $query->with('category')->where('is_active', true)->orderBy('sort_order');
        }])
            ->where('is_active', true)
            ->orderBy('sort_order')
            ->get();

        return Inertia::render('menu/Index', [
            'categories' => $categories,
        ]);
    }
}
