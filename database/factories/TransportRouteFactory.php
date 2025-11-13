<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\TransportRoute>
 */
class TransportRouteFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $origin = $this->faker->city();
        $destination = $this->faker->city();

        return [
            'name' => "{$origin} - {$destination}",
            'origin' => $origin,
            'destination' => $destination,
            'distance_km' => $this->faker->randomFloat(2, 1, 50),
            'estimated_time' => $this->faker->numberBetween(10, 90).' min',
            'base_price' => $this->faker->randomFloat(2, 3, 25),
            'status' => $this->faker->randomElement(['active', 'inactive']),
            'notes' => $this->faker->sentence(),
        ];
    }
}
