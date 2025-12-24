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
            ['email' => 'client@conorld.com'],
            [
                'name' => 'Cliente Demo',
                'phone' => '999-111-222',
                'role' => 'passenger',
                'is_available' => false,
                'company' => 'Client Tours Inc.',
                'username' => 'client.demo',
                'first_name' => 'Cliente',
                'last_name' => 'Demo',
                'address' => 'Av. Central 456',
                'city' => 'Lima',
                'postal_code' => '15000',
                'country' => 'Perú',
                'about' => 'Usuario de prueba que solicita viajes frecuentes hacia el centro financiero.',
                'website' => 'https://client-demo.conorld.com',
                'bio' => 'Aplica descuentos corporativos y siempre reporta calidad en el servicio.',
                'password' => Hash::make('asucar123YON'),
            ]
        );

        $driver = User::updateOrCreate(
            ['email' => 'drive@conorld.com'],
            [
                'name' => 'Driver Demo',
                'phone' => '999-333-444',
                'role' => 'driver',
                'is_available' => true,
                'company' => 'Conorld Mobility',
                'username' => 'driver.demo',
                'first_name' => 'Driver',
                'last_name' => 'Demo',
                'address' => 'Av. Principal 123',
                'city' => 'Ciudad de México',
                'postal_code' => '01234',
                'country' => 'Mexico',
                'about' => 'Me gusta ofrecer un servicio puntual y seguro a los pasajeros.',
                'website' => 'https://mi-sitio.com',
                'bio' => 'Soy conductor en la plataforma y me especializo en viajes al aeropuerto.',
                'password' => Hash::make('asucar123YON'),
            ]
        );

        User::updateOrCreate(
            ['email' => 'admin@conorld.com'],
            [
                'name' => 'Administrador',
                'phone' => '999-000-111',
                'role' => 'admin',
                'is_available' => true,
                'company' => 'Conorld Operations',
                'username' => 'admin.conorld',
                'first_name' => 'Admin',
                'last_name' => 'Conorld',
                'address' => 'Av. Ejecutiva 1000',
                'city' => 'Lima',
                'postal_code' => '15001',
                'country' => 'Perú',
                'about' => 'Administra rutas y usuarios con foco en calidad y seguridad.',
                'website' => 'https://admin.conorld.com',
                'bio' => 'Perfil administrativo con acceso completo a todas las métricas y operaciones.',
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
