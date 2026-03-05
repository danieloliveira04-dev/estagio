<?php

namespace Database\Seeders;

use App\Models\Template;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class TemplateSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $template = Template::create([
            'name' => 'Template Padrão',
        ]);

        $template->columns()->createMany([
            [
                'name' => 'Pendente',
                'taskStatusId' => env('taskStatusPendingId'),
            ],
            [
                'name' => 'Em andamento',
                'taskStatusId' => env('taskStatusInProgressId'),
            ],
            [
                'name' => 'Concluído',
                'taskStatusId' => env('taskStatusCompletedId'),
            ],
            [
                'name' => 'Cancelado',
                'taskStatusId' => env('taskStatusCanceledId'),
            ]
        ]);
    }
}
