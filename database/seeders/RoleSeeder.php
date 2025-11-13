<?php

namespace Database\Seeders;

use App\Models\Role;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class RoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Role::create([
            'name' => 'Administrador',
            'type' => Role::TYPE_PROFILE,
        ]);

        Role::create([
            'name' => 'Usuário',
            'type' => Role::TYPE_PROFILE,
        ]);

        Role::create([
            'name' => 'Gestor',
            'type' => Role::TYPE_FUNCTION,
        ]);

        Role::create([
            'name' => 'Colaborador',
            'type' => Role::TYPE_FUNCTION,
        ]);

        Role::create([
            'name' => 'Cliente',
            'type' => Role::TYPE_FUNCTION,
        ]);
    }
}
