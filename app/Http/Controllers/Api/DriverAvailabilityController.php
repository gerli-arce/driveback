<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Driver\UpdateAvailabilityRequest;
use App\Http\Resources\UserResource;

class DriverAvailabilityController extends Controller
{
    public function update(UpdateAvailabilityRequest $request): UserResource
    {
        $user = auth('api')->user();
        $user->update([
            'is_available' => $request->boolean('is_available'),
        ]);

        return UserResource::make($user);
    }
}
