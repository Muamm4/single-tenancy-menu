<?php

namespace App\Http\Controllers;

use App\Models\Setting;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class CartController extends Controller
{
    public function index()
    {
        $appearance = Setting::getGroup('appearance');

        if (($appearance['menu_only'] ?? 'false') === 'true') {
            return redirect()->route('menu');
        }

        $addresses = [];
        $defaultAddress = null;

        if (Auth::check()) {
            $addresses = Auth::user()->addresses()->orderBy('is_default', 'desc')->get();
            $defaultAddress = Auth::user()->defaultAddress;
        }

        return Inertia::render('customer/Cart', [
            'addresses' => $addresses,
            'defaultAddress' => $defaultAddress,
        ]);
    }
}
