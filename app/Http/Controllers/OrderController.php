<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\Product;
use App\Models\Setting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class OrderController extends Controller
{
    public function store(Request $request)
    {
        if (! Setting::isOpen()) {
            return response()->json(['error' => 'Restaurante fechado no momento.'], 403);
        }

        $validated = $request->validate([
            'customer_name' => 'required|string|max:255',
            'customer_phone' => 'required|string|max:20',
            'notes' => 'nullable|string',
            'items' => 'required|array',
            'items.*.id' => 'required|exists:products,id',
            'items.*.quantity' => 'required|integer|min:1',
            'items.*.addons' => 'nullable|array',
            'items.*.addons.*.id' => 'exists:addons,id',
            'items.*.addons.*.name' => 'required|string',
            'items.*.addons.*.price' => 'required|numeric|min:0',
            'total' => 'required|numeric',
            'address_id' => 'nullable|exists:addresses,id',
        ]);

        return DB::transaction(function () use ($validated) {
            $calculatedTotal = 0;
            $finalItems = [];

            $productIds = collect($validated['items'])->pluck('id');
            $products = Product::whereIn('id', $productIds)->get()->keyBy('id');

            foreach ($validated['items'] as $item) {
                $product = $products->get($item['id']);

                if (! $product) {
                    continue;
                }

                $price = $product->promotional_price ?? $product->price;
                $subtotal = $price * $item['quantity'];
                $calculatedTotal += $subtotal;

                $addonDetails = [];
                if (!empty($item['addons'])) {
                    foreach ($item['addons'] as $addon) {
                        $addonDetails[] = [
                            'id' => $addon['id'],
                            'name' => $addon['name'],
                            'price' => (float) $addon['price'],
                        ];
                        $calculatedTotal += (float) $addon['price'] * $item['quantity'];
                    }
                }

                $finalItems[] = [
                    'name' => $product->name,
                    'price' => $price,
                    'quantity' => $item['quantity'],
                    'subtotal' => $subtotal,
                    'addons' => $addonDetails,
                ];
            }

            $addressId = Auth::check()
                ? ($validated['address_id'] ?? Auth::user()->defaultAddress?->id)
                : null;

            $order = Order::create([
                'customer_name' => $validated['customer_name'],
                'customer_phone' => $validated['customer_phone'],
                'notes' => $validated['notes'],
                'items' => $finalItems,
                'total' => $calculatedTotal,
                'status' => 'pending',
                'user_id' => Auth::id(),
                'address_id' => $addressId,
            ]);

            $whatsappMessage = "Olá! Gostaria de fazer um pedido:\n\n";
            foreach ($finalItems as $item) {
                $whatsappMessage .= "- {$item['quantity']}x {$item['name']} (R$ ".number_format($item['subtotal'], 2, ',', '.').")\n";
                if (!empty($item['addons'])) {
                    foreach ($item['addons'] as $addon) {
                        $messageAddonPrice = number_format($addon['price'], 2, ',', '.');
                        if ($addon['price'] > 0) {
                            $whatsappMessage .= "    + {$addon['name']} (+R\$ {$messageAddonPrice})\n";
                        } else {
                            $whatsappMessage .= "    + {$addon['name']}\n";
                        }
                    }
                }
            }
            $whatsappMessage .= "\nTotal: R$ ".number_format($calculatedTotal, 2, ',', '.');
            $whatsappMessage .= "\n\nNome: {$order->customer_name}\nTelefone: {$order->customer_phone}";

            if ($order->address) {
                $address = $order->address;
                $whatsappMessage .= "\nEndereço: {$address->street}, {$address->number} - {$address->neighborhood}, {$address->city} - {$address->zip_code}";
            }

            $restaurantWhatsapp = Setting::getValue('restaurant_whatsapp', config('app.whatsapp'));
            $whatsappLink = 'https://wa.me/'.preg_replace('/\D/', '', $restaurantWhatsapp).'?text='.urlencode($whatsappMessage);

            return response()->json([
                'order_id' => $order->id,
                'whatsapp_link' => $whatsappLink,
            ]);
        });
    }
}
