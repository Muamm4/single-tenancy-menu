<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Setting;
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

        $hoursData = Setting::getGroup('business_hours');
        $hours = isset($hoursData['business_hours'])
            ? json_decode($hoursData['business_hours'], true)
            : [];

        return Inertia::render('menu/Index', [
            'categories' => $categories,
            'hours' => $hours,
        ]);
    }
}
