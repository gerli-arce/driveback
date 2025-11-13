<?php

namespace Database\Factories;

use App\Models\Trip;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Trip>
 */
class TripFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $origin = $this->faker->streetAddress();
        $destination = $this->faker->streetAddress();

        return [
            'user_id' => User::factory(),
            'driver_id' => null,
            'origin' => $origin,
            'destination' => $destination,
            'origin_lat' => $this->faker->latitude(-10, -11),
            'origin_lng' => $this->faker->longitude(-75, -76),
            'destination_lat' => $this->faker->latitude(-10, -11),
            'destination_lng' => $this->faker->longitude(-75, -76),
            'price' => $this->faker->randomFloat(2, 3, 20),
            'status' => Trip::STATUS_REQUESTED,
        ];
    }
}
