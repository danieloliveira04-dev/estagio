<?php

namespace Database\Seeders;

use App\Models\Project;
use App\Models\ProjectMember;
use App\Models\Template;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use SebastianBergmann\Environment\Console;

class ProjectSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Template padrão
        $template = Template::with('columns')->first();

        $columns = $template->columns->map(function($column, $index) {
            return [
                'name' => $column->name,
                'taskStatusId' => $column->taskStatusId,
                'position' => $index,
            ];  
        });

        // Criar alguns projetos
        $projects = [
            [
                'name' => 'Sistema de Gestão',
                'description' => 'Projeto para desenvolvimento de um sistema de gestão interna.',
                'projectStatusId' => 1, // exemplo: Desenvolvimento
            ],
            [
                'name' => 'Site Institucional',
                'description' => 'Projeto para criação do novo site da empresa.',
                'projectStatusId' => 2, // exemplo: Homologação
            ],
        ];

        foreach ($projects as $data) {
            $project = Project::create($data);

            $project->columns()->createMany($columns);

            $project->members()->createMany([
                [
                    'userId' => 2, 
                    'roleId' => 3, // Gestor
                    'description' => 'Responsável pela gestão do projeto',
                ],
                [
                    'userId' => 3, 
                    'roleId' => 4, // Colaborador
                    'description' => 'Executa as tarefas técnicas',
                ],
                [
                    'userId' => 4, 
                    'roleId' => 5, // Cliente
                    'description' => 'Cliente que receberá o produto',
                ],
            ]);
        }
    }
}
