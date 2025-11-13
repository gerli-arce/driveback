<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\TripResource;
use App\Models\Trip;
use App\Models\TripRejection;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class DriverTripController extends Controller
{
    public function available(): AnonymousResourceCollection
    {
        $driverId = auth('api')->id();

        $trips = Trip::requested()
            ->whereNull('driver_id')
            ->whereDoesntHave('rejections', fn ($query) => $query->where('driver_id', $driverId))
            ->with('passenger')
            ->orderBy('created_at')
            ->get();

        return TripResource::collection($trips);
    }

    public function assigned(): AnonymousResourceCollection
    {
        $driverId = auth('api')->id();

        $trips = Trip::with(['passenger', 'driver'])
            ->where('driver_id', $driverId)
            ->orderByDesc('updated_at')
            ->get();

        return TripResource::collection($trips);
    }

    public function show(Trip $trip): TripResource
    {
        $this->ensureAssignedDriver($trip);

        return TripResource::make($trip->load(['passenger', 'driver']));
    }

    public function accept(Trip $trip): TripResource|JsonResponse
    {
        if ($trip->status !== Trip::STATUS_REQUESTED || $trip->driver_id) {
            return response()->json(['message' => 'Este viaje ya fue tomado por otro conductor.'], 422);
        }

        $trip->fill([
            'driver_id' => auth('api')->id(),
            'status' => Trip::STATUS_ACCEPTED,
        ])->save();

        TripRejection::where('trip_id', $trip->id)
            ->where('driver_id', auth('api')->id())
            ->delete();

        return TripResource::make($trip->load(['passenger', 'driver']));
    }

    public function reject(Trip $trip): JsonResponse
    {
        if ($trip->status !== Trip::STATUS_REQUESTED || $trip->driver_id) {
            return response()->json(['message' => 'Este viaje ya no esta disponible.'], 422);
        }

        TripRejection::updateOrCreate(
            [
                'trip_id' => $trip->id,
                'driver_id' => auth('api')->id(),
            ],
            []
        );

        return response()->json(['message' => 'Solicitud rechazada. No volvera a mostrarse en tu lista.']);
    }

    public function start(Trip $trip): TripResource|JsonResponse
    {
        if ($trip->status !== Trip::STATUS_ACCEPTED) {
            return response()->json(['message' => 'Solo puedes iniciar viajes aceptados.'], 422);
        }

        $this->ensureAssignedDriver($trip);

        $trip->update([
            'status' => Trip::STATUS_IN_PROGRESS,
            'started_at' => now(),
        ]);

        return TripResource::make($trip->fresh()->load(['passenger', 'driver']));
    }

    public function complete(Trip $trip): TripResource|JsonResponse
    {
        if ($trip->status !== Trip::STATUS_IN_PROGRESS) {
            return response()->json(['message' => 'Solo puedes finalizar viajes en curso.'], 422);
        }

        $this->ensureAssignedDriver($trip);

        $trip->update([
            'status' => Trip::STATUS_COMPLETED,
            'completed_at' => now(),
        ]);

        return TripResource::make($trip->fresh()->load(['passenger', 'driver']));
    }

    protected function ensureAssignedDriver(Trip $trip): void
    {
        if ($trip->driver_id !== auth('api')->id()) {
            abort(403, 'No estas asignado a este viaje.');
        }
    }
}
