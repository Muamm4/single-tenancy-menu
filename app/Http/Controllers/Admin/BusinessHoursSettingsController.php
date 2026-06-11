<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use Illuminate\Http\Request;
use Inertia\Inertia;

class BusinessHoursSettingsController extends Controller
{
    public function index()
    {
        $hoursData = Setting::getGroup('business_hours');
        $hours = isset($hoursData['business_hours'])
            ? json_decode($hoursData['business_hours'], true)
            : [];

        return Inertia::render('admin/settings/BusinessHours', [
            'hours' => $hours,
        ]);
    }

    public function update(Request $request)
    {
        $validated = $request->validate([
            'hours' => ['required', 'array', 'size:7'],
            'hours.*.day' => ['required', 'integer', 'between:0,6'],
            'hours.*.open' => ['required', 'string', 'date_format:H:i'],
            'hours.*.close' => ['required', 'string', 'date_format:H:i'],
            'hours.*.closed' => ['required', 'boolean'],
        ]);

        Setting::setGroup('business_hours', [
            'business_hours' => json_encode($validated['hours']),
        ]);

        return redirect()->route('admin.settings.business-hours')
            ->with('success', 'Horários atualizados com sucesso!');
    }
}
