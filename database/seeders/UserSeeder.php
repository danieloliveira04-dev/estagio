<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        User::factory()->create([
           'name' => 'Daniel Oliveira',
           'email' => 'danielsilvaoliveira004@gmail.com',
           'roleId' => 1,
           'password' => '123qwe123',
           'status' => User::STATUS_ACTIVE, 
        ]);

        User::factory(10)->create();
    }
}
