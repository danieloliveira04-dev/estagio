<?php

namespace Database\Seeders;

use App\Models\Project;
use App\Models\Task;
use App\Models\TaskStatus;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class TaskSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Para cada projeto existente
        $projects = Project::all();

        foreach ($projects as $project) {
            // Pegar os colaboradores do projeto (roleId = COLABORADOR)
            $collaborators = \DB::table('projectsMembers')
                ->where('projectId', $project->id)
                ->where('roleId', 4)
                ->get();

            $sequence = 1;

            // Criar 5 tarefas de exemplo para cada projeto
            for ($i = 0; $i < 5; $i++) {
                $random = $collaborators->random();
                $column = $project->columns()->inRandomOrder()->first();

                Task::factory()->create([
                    'projectId'    => $project->id,
                    'projectColumnId' => $column->id,
                    'projectMemberId' => $random->id,
                    'taskStatusId' => $column->taskStatusId,
                    'sequence'         => $sequence++,
                ]);
            }
        }
    }
}
