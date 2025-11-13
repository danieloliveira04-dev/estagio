<?php

namespace Database\Seeders;

use App\Models\ProjectStatus;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ProjectStatusSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        ProjectStatus::create(['name' => 'Desenvolvimento']);
        ProjectStatus::create(['name' => 'Homologação']);
        ProjectStatus::create(['name' => 'Produção']);
    }
}
