<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\UpdateTripRequest;
use App\Http\Resources\TripResource;
use App\Models\Trip;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class AdminTripController extends Controller
{
    public function index(Request $request): AnonymousResourceCollection
    {
        $query = Trip::with(['passenger', 'driver'])->latest();

        if ($status = $request->query('status')) {
            $query->where('status', $status);
        }

        if ($request->boolean('active_only')) {
            $query->whereIn('status', [Trip::STATUS_REQUESTED, Trip::STATUS_ACCEPTED, Trip::STATUS_IN_PROGRESS]);
        }

        return TripResource::collection($query->limit(200)->get());
    }

    public function update(UpdateTripRequest $request, Trip $trip): TripResource
    {
        $data = $request->validated();

        if (array_key_exists('driver_id', $data)) {
            if ($data['driver_id']) {
                $driver = User::where('id', $data['driver_id'])
                    ->where('role', 'driver')
                    ->firstOrFail();

                $trip->driver()->associate($driver);
            } else {
                $trip->driver()->dissociate();
            }

            unset($data['driver_id']);
        }

        if (isset($data['status'])) {
            $status = $data['status'];

            $data['started_at'] = $status === Trip::STATUS_IN_PROGRESS ? now() : $trip->started_at;
            $data['completed_at'] = $status === Trip::STATUS_COMPLETED ? now() : $trip->completed_at;

            if ($status === Trip::STATUS_CANCELLED) {
                $data['driver_id'] = null;
            }
        }

        $trip->update($data);

        return TripResource::make($trip->fresh()->load(['passenger', 'driver']));
    }
}
