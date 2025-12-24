<?php

use App\Http\Controllers\Api\Admin\AdminDashboardController;
use App\Http\Controllers\Api\Admin\AdminRouteController;
use App\Http\Controllers\Api\Admin\AdminTripController;
use App\Http\Controllers\Api\Admin\AdminUserController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\DriverAvailabilityController;
use App\Http\Controllers\Api\DriverTripController;
use App\Http\Controllers\Api\PassengerTripController;
use Illuminate\Support\Facades\Route;

Route::prefix('auth')->group(function (): void {
    Route::post('register', [AuthController::class, 'register']);
    Route::post('login', [AuthController::class, 'login'])->name('login');

    Route::middleware('auth:api')->group(function (): void {
        Route::post('logout', [AuthController::class, 'logout']);
        Route::get('me', [AuthController::class, 'me']);
        Route::get('profile', [AuthController::class, 'profile']);
        Route::patch('profile', [AuthController::class, 'updateProfile']);
    });
});

Route::middleware(['auth:api', 'role:passenger'])
    ->prefix('passenger')
    ->group(function (): void {
        Route::get('trips', [PassengerTripController::class, 'index']);
        Route::post('trips', [PassengerTripController::class, 'store']);
        Route::post('trips/{trip}/rate', [PassengerTripController::class, 'rate'])->whereNumber('trip');
    });

Route::middleware(['auth:api', 'role:driver'])
    ->prefix('driver')
    ->group(function (): void {
        Route::post('availability', [DriverAvailabilityController::class, 'update']);

        Route::get('trips/available', [DriverTripController::class, 'available']);
        Route::get('trips/assigned', [DriverTripController::class, 'assigned']);
        Route::get('trips/{trip}', [DriverTripController::class, 'show'])->whereNumber('trip');
        Route::post('trips/{trip}/accept', [DriverTripController::class, 'accept'])->whereNumber('trip');
        Route::post('trips/{trip}/reject', [DriverTripController::class, 'reject'])->whereNumber('trip');
        Route::post('trips/{trip}/start', [DriverTripController::class, 'start'])->whereNumber('trip');
        Route::post('trips/{trip}/complete', [DriverTripController::class, 'complete'])->whereNumber('trip');
    });

Route::middleware(['auth:api', 'role:admin'])
    ->prefix('admin')
    ->group(function (): void {
        Route::get('dashboard', AdminDashboardController::class);

        Route::get('users', [AdminUserController::class, 'index']);
        Route::patch('users/{user}', [AdminUserController::class, 'update'])->whereNumber('user');

        Route::get('trips', [AdminTripController::class, 'index']);
        Route::patch('trips/{trip}', [AdminTripController::class, 'update'])->whereNumber('trip');

        Route::get('routes', [AdminRouteController::class, 'index']);
        Route::post('routes', [AdminRouteController::class, 'store']);
        Route::put('routes/{route}', [AdminRouteController::class, 'update'])->whereNumber('route');
        Route::delete('routes/{route}', [AdminRouteController::class, 'destroy'])->whereNumber('route');
    });
