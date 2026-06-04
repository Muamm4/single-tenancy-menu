<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\MenuController;
use App\Http\Controllers\CartController;
use App\Http\Controllers\CepController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\CustomerOrderController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\ProductController;
use App\Http\Controllers\Admin\CategoryController;
use App\Http\Controllers\Admin\AppearanceSettingsController;
use App\Http\Controllers\Admin\OrderController as AdminOrderController;

Route::get('/', [MenuController::class, 'index'])->name('menu');
Route::get('/cart', [CartController::class, 'index'])->name('cart');
Route::post('/orders', [OrderController::class, 'store'])->name('orders.store');

Route::get('/api/cep/{cep}', [CepController::class, 'show'])->name('api.cep');

Route::middleware(['auth'])->group(function () {
    Route::get('/my-orders', [CustomerOrderController::class, 'index'])->name('customer.orders');
    Route::resource('addresses', AddressController::class)->only(['store', 'update', 'destroy']);
});

Route::middleware(['auth', 'admin'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/', [DashboardController::class, 'index'])->name('dashboard');
    Route::resource('categories', CategoryController::class);
    Route::resource('products', ProductController::class);
    Route::resource('orders', AdminOrderController::class);
    Route::patch('orders/{order}/status', [AdminOrderController::class, 'updateStatus'])->name('orders.update-status');

    Route::get('settings/appearance', [AppearanceSettingsController::class, 'index'])->name('settings.appearance');
    Route::patch('settings/appearance', [AppearanceSettingsController::class, 'update'])->name('settings.appearance.update');
});

require __DIR__.'/auth.php';
require __DIR__.'/settings.php';
