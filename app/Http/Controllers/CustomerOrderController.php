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
            ->limit(10)
            ->get();

        return Inertia::render('customer/Orders', [
            'orders' => $orders
        ]);
    }

    public function show($id)
    {
        $order = Order::with('address')->findOrFail($id);

        if ($order->user_id !== Auth::id()) {
            abort(403);
        }

        return Inertia::render('customer/OrderShow', [
            'order' => $order,
        ]);
    }
}
