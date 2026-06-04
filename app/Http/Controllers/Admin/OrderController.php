<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\Request;
use Inertia\Inertia;

class OrderController extends Controller
{
    public function index(Request $request)
    {
        $query = Order::recent();

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        $orders = $query->paginate(10)->withQueryString();

        return Inertia::render('admin/orders/Index', [
            'orders' => $orders,
            'filterStatus' => $request->status,
        ]);
    }

    public function show($id)
    {
        $order = Order::findOrFail($id);

        return Inertia::render('admin/orders/Show', [
            'order' => $order,
        ]);
    }

    public function updateStatus(Request $request, $id)
    {
        $request->validate([
            'status' => 'required|in:accepted,rejected,preparing,ready',
        ]);

        $order = Order::findOrFail($id);
        $order->update([
            'status' => $request->status,
        ]);

        return redirect()->back()
            ->with('success', 'Status do pedido atualizado com sucesso.');
    }
}
