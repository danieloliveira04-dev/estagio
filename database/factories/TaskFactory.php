<?php

namespace Database\Factories;

use App\Models\Project;
use App\Models\TaskStatus;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Task>
 */
class TaskFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'title' => $this->faker->sentence(3),
            'description' => $this->faker->paragraph(),
            'startDate' => $this->faker->dateTimeBetween('-1 month', '+1 month'),
            'endDate' => $this->faker->dateTimeBetween('+1 day', '+2 months'),
            'projectId' => Project::inRandomOrder()->first()?->id ?? Project::factory(), // projeto existente ou cria
            'taskStatusId' => TaskStatus::inRandomOrder()->first()?->id ?? TaskStatus::factory(),
        ];
    }
}
