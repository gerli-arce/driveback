<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\TransportRouteRequest;
use App\Http\Resources\TransportRouteResource;
use App\Models\TransportRoute;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Http\Response;

class AdminRouteController extends Controller
{
    public function index(Request $request): AnonymousResourceCollection
    {
        $query = TransportRoute::query()->orderBy('name');

        if ($status = $request->query('status')) {
            $query->where('status', $status);
        }

        return TransportRouteResource::collection($query->get());
    }

    public function store(TransportRouteRequest $request): TransportRouteResource
    {
        $route = TransportRoute::create($request->validated());

        return TransportRouteResource::make($route);
    }

    public function update(TransportRouteRequest $request, TransportRoute $route): TransportRouteResource
    {
        $route->update($request->validated());

        return TransportRouteResource::make($route->fresh());
    }

    public function destroy(TransportRoute $route): Response
    {
        $route->delete();

        return response()->noContent();
    }
}
