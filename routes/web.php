<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\MenuController;
use App\Http\Controllers\CartController;
use App\Http\Controllers\CepController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\CustomerOrderController;
use App\Http\Controllers\ManifestController;
use App\Http\Controllers\Admin\AddonCategoryController;
use App\Http\Controllers\Admin\AddonController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\ProductController;
use App\Http\Controllers\Admin\CategoryController;
use App\Http\Controllers\Admin\AppearanceSettingsController;
use App\Http\Controllers\Admin\BusinessHoursSettingsController;
use App\Http\Controllers\Admin\OrderController as AdminOrderController;
use App\Http\Controllers\AddressController;

Route::get('/', [MenuController::class, 'index'])->name('menu');
Route::get('/cart', [CartController::class, 'index'])->name('cart');
Route::post('/orders', [OrderController::class, 'store'])->name('orders.store');

Route::get('/api/cep/{cep}', [CepController::class, 'show'])->name('api.cep');

Route::get('/produto/{id}', [App\Http\Controllers\Public\ProductController::class, 'show'])->name('product.show');
Route::get('/manifest.json', ManifestController::class)->name('manifest');

Route::middleware(['auth'])->group(function () {
    Route::get('/my-orders', [CustomerOrderController::class, 'index'])->name('customer.orders');
Route::get('/my-orders/{order}', [CustomerOrderController::class, 'show'])->name('customer.orders.show');
    Route::resource('addresses', AddressController::class)->only(['store', 'update', 'destroy']);
});

Route::middleware(['auth', 'admin'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/', [DashboardController::class, 'index'])->name('dashboard');
    Route::resource('categories', CategoryController::class);
    Route::resource('products', ProductController::class);
    Route::resource('orders', AdminOrderController::class);
    Route::patch('orders/{order}/status', [AdminOrderController::class, 'updateStatus'])->name('orders.update-status');

    Route::get('addon-categories', [AddonCategoryController::class, 'index'])->name('addon-categories.index');
    Route::get('addon-categories/create', [AddonCategoryController::class, 'create'])->name('addon-categories.create');
    Route::post('addon-categories', [AddonCategoryController::class, 'store'])->name('addon-categories.store');
    Route::get('addon-categories/{addonCategory}/edit', [AddonCategoryController::class, 'edit'])->name('addon-categories.edit');
    Route::put('addon-categories/{addonCategory}', [AddonCategoryController::class, 'update'])->name('addon-categories.update');
    Route::delete('addon-categories/{addonCategory}', [AddonCategoryController::class, 'destroy'])->name('addon-categories.destroy');

    Route::get('addon-categories/{addonCategory}/addons', [AddonController::class, 'index'])->name('addons.index');
    Route::get('addons/create', [AddonController::class, 'create'])->name('addons.create');
    Route::post('addons', [AddonController::class, 'store'])->name('addons.store');
    Route::get('addons/{addon}/edit', [AddonController::class, 'edit'])->name('addons.edit');
    Route::put('addons/{addon}', [AddonController::class, 'update'])->name('addons.update');
    Route::delete('addons/{addon}', [AddonController::class, 'destroy'])->name('addons.destroy');

    Route::get('settings/appearance', [AppearanceSettingsController::class, 'index'])->name('settings.appearance');
    Route::patch('settings/appearance', [AppearanceSettingsController::class, 'update'])->name('settings.appearance.update');

    Route::get('settings/business-hours', [BusinessHoursSettingsController::class, 'index'])->name('settings.business-hours');
    Route::patch('settings/business-hours', [BusinessHoursSettingsController::class, 'update'])->name('settings.business-hours.update');
});

Route::get('/sw.js', function () {
    return response()
        ->view('sw')
        ->header('Content-Type', 'application/javascript');
})->name('sw');

require __DIR__.'/auth.php';
require __DIR__.'/settings.php';
