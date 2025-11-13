<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Passenger\RateTripRequest;
use App\Http\Requests\Passenger\StoreTripRequest;
use App\Http\Resources\TripResource;
use App\Models\Trip;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class PassengerTripController extends Controller
{
    public function index(): AnonymousResourceCollection
    {
        $trips = Trip::with(['driver', 'passenger'])
            ->where('user_id', auth('api')->id())
            ->latest()
            ->get();

        return TripResource::collection($trips);
    }

    public function store(StoreTripRequest $request): JsonResponse
    {
        $trip = Trip::create([
            'user_id' => auth('api')->id(),
            'origin' => $request->input('origin'),
            'destination' => $request->input('destination'),
            'origin_lat' => $request->input('origin_lat'),
            'origin_lng' => $request->input('origin_lng'),
            'destination_lat' => $request->input('destination_lat'),
            'destination_lng' => $request->input('destination_lng'),
            'price' => $request->input('price'),
            'status' => Trip::STATUS_REQUESTED,
        ]);

        return TripResource::make($trip->load(['passenger']))->response()->setStatusCode(201);
    }

    public function rate(RateTripRequest $request, Trip $trip): JsonResponse
    {
        $this->ensurePassengerOwnsTrip($trip);

        if ($trip->status !== Trip::STATUS_COMPLETED) {
            return response()->json(['message' => 'Solo puedes calificar viajes completados.'], 422);
        }

        $trip->update(['rating' => $request->integer('rating')]);

        return response()->json([
            'message' => 'Gracias por calificar al conductor.',
            'data' => TripResource::make($trip->fresh()->load(['driver', 'passenger'])),
        ]);
    }

    protected function ensurePassengerOwnsTrip(Trip $trip): void
    {
        if ($trip->user_id !== auth('api')->id()) {
            abort(403, 'Este viaje no pertenece a tu cuenta.');
        }
    }
}
