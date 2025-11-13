<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\TransportRouteResource;
use App\Http\Resources\TripResource;
use App\Http\Resources\UserResource;
use App\Models\TransportRoute;
use App\Models\Trip;
use App\Models\User;
use Illuminate\Http\JsonResponse;

class AdminDashboardController extends Controller
{
    public function __invoke(): JsonResponse
    {
        $passengers = User::where('role', 'passenger')->count();
        $drivers = User::where('role', 'driver')->count();
        $viewers = User::where('role', 'viewer')->count();
        $availableDrivers = User::where('role', 'driver')->where('is_available', true)->count();

        $activeTrips = Trip::whereIn('status', [Trip::STATUS_ACCEPTED, Trip::STATUS_IN_PROGRESS])->count();
        $pendingTrips = Trip::where('status', Trip::STATUS_REQUESTED)->count();
        $completedTrips = Trip::where('status', Trip::STATUS_COMPLETED)->count();

        $recentTrips = TripResource::collection(
            Trip::with(['passenger', 'driver'])
                ->latest()
                ->limit(5)
                ->get()
        );

        $featuredRoutes = TransportRouteResource::collection(
            TransportRoute::orderBy('status')
                ->orderByDesc('created_at')
                ->limit(5)
                ->get()
        );

        $topDrivers = User::where('role', 'driver')
            ->withCount([
                'tripsAsDriver as completed_trips_count' => fn ($query) => $query->where('status', Trip::STATUS_COMPLETED),
            ])
            ->orderByDesc('completed_trips_count')
            ->limit(5)
            ->get();

        return response()->json([
            'stats' => [
                'passengers' => $passengers,
                'drivers' => $drivers,
                'viewers' => $viewers,
                'available_drivers' => $availableDrivers,
                'active_trips' => $activeTrips,
                'pending_trips' => $pendingTrips,
                'completed_trips' => $completedTrips,
                'routes' => TransportRoute::count(),
            ],
            'recent_trips' => $recentTrips,
            'routes' => $featuredRoutes,
            'top_drivers' => UserResource::collection($topDrivers),
        ]);
    }
}
