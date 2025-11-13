<?php

namespace Database\Seeders;

use App\Models\Project;
use App\Models\ProjectMember;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ProjectSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
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
