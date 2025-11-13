<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TransportRoute extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'origin',
        'destination',
        'distance_km',
        'estimated_time',
        'base_price',
        'status',
        'notes',
    ];

    protected $casts = [
        'distance_km' => 'float',
        'base_price' => 'float',
    ];
}
