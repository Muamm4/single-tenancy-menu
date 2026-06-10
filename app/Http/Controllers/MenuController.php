<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Support\Facades\Cache;
use Inertia\Inertia;

class MenuController extends Controller
{
    public function index()
    {
        $categories = Cache::tags(['menu'])->rememberForever('menu_data', function () {
            return Category::with(['products' => function ($query) {
                $query->with('addonCategories')->where('is_active', true)->orderBy('sort_order');
            }])
                ->where('is_active', true)
                ->orderBy('sort_order')
                ->get();
        });

        return Inertia::render('menu/Index', [
            'categories' => $categories,
        ]);
    }
}
