<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return response()->json([
        'name' => config('app.name', 'MotoGo API'),
        'version' => app()->version(),
        'message' => 'Bienvenido a la API de MotoGo. Consume los endpoints bajo /api.',
    ]);
});
