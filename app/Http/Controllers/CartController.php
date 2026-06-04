<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class CartController extends Controller
{
    public function index()
    {
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
