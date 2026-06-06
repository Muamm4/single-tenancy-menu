<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\Setting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class CustomerOrderController extends Controller
{
    public function index()
    {
        $appearance = Setting::getGroup('appearance');

        if (($appearance['menu_only'] ?? 'false') === 'true') {
            return redirect()->route('menu');
        }

        $orders = Order::where('user_id', Auth::id())
            ->latest()
            ->paginate(20);

        return Inertia::render('customer/Orders', [
            'orders' => $orders
        ]);
    }
}
