<?php

namespace Database\Seeders;

use App\Models\TransportRoute;
use App\Models\Trip;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $passenger = User::updateOrCreate(
            ['email' => 'pasajero@example.com'],
            [
                'name' => 'Pasajero Demo',
                'phone' => '999-111-222',
                'role' => 'passenger',
                'is_available' => false,
                'password' => Hash::make('password'),
            ]
        );

        $driver = User::updateOrCreate(
            ['email' => 'conductor@example.com'],
            [
                'name' => 'Conductor Demo',
                'phone' => '999-333-444',
                'role' => 'driver',
                'is_available' => true,
                'password' => Hash::make('password'),
            ]
        );

        User::updateOrCreate(
            ['email' => 'admin@conorld.com'],
            [
                'name' => 'Administrador',
                'phone' => '999-000-111',
                'role' => 'admin',
                'is_available' => true,
                'password' => Hash::make('asucar123YON'),
            ]
        );

        Trip::factory()->create([
            'user_id' => $passenger->id,
            'origin' => 'Plaza de Armas',
            'destination' => 'Av. Peru',
            'price' => 8.5,
        ]);

        Trip::factory()->create([
            'user_id' => $passenger->id,
            'driver_id' => $driver->id,
            'origin' => 'Mercado Modelo',
            'destination' => 'Terminal Selva Central',
            'status' => Trip::STATUS_IN_PROGRESS,
            'price' => 10,
        ]);

        Trip::factory()->create([
            'user_id' => $passenger->id,
            'driver_id' => $driver->id,
            'origin' => 'Av. San Martin',
            'destination' => 'Km 12 Margen Derecha',
            'status' => Trip::STATUS_COMPLETED,
            'price' => 12.5,
            'rating' => 5,
        ]);

        collect([
            [
                'name' => 'Plaza de Armas - Mercado Modelo',
                'origin' => 'Plaza de Armas',
                'destination' => 'Mercado Modelo',
                'distance_km' => 3.5,
                'estimated_time' => '15 min',
                'base_price' => 6.5,
            ],
            [
                'name' => 'Terminal - Universidad',
                'origin' => 'Terminal Selva Central',
                'destination' => 'Universidad Continental',
                'distance_km' => 6.8,
                'estimated_time' => '25 min',
                'base_price' => 9.5,
            ],
        ])->each(fn ($route) => TransportRoute::updateOrCreate(
            ['name' => $route['name']],
            array_merge($route, ['status' => 'active'])
        ));
    }
}
