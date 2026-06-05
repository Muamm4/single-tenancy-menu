<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AppearanceSettingsController extends Controller
{
    public function index()
    {
        $colors = Setting::getGroup('appearance');

        return Inertia::render('admin/settings/Appearance', [
            'colors' => $colors,
        ]);
    }

    public function update(Request $request)
    {
        $validated = $request->validate([
            'primary_color' => ['required', 'string', 'regex:/^#[0-9A-Fa-f]{6}$/'],
            'primary_foreground' => ['required', 'string', 'regex:/^#[0-9A-Fa-f]{6}$/'],
            'background' => ['required', 'string', 'regex:/^#[0-9A-Fa-f]{6}$/'],
            'foreground' => ['required', 'string', 'regex:/^#[0-9A-Fa-f]{6}$/'],
            'header_background' => ['required', 'string', 'regex:/^#[0-9A-Fa-f]{6}$/'],
            'header_foreground' => ['required', 'string', 'regex:/^#[0-9A-Fa-f]{6}$/'],
            'restaurant_name' => ['nullable', 'string', 'max:255'],
            'menu_only' => ['nullable', 'string', 'in:true,false'],
        ]);

        Setting::setGroup('appearance', $validated);

        return redirect()->route('admin.settings.appearance')
            ->with('success', 'Cores atualizadas com sucesso!');
    }
}
