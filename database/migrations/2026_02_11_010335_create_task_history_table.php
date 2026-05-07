<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('taskHistory', function (Blueprint $table) {
            $table->id();
            $table->foreignId('taskId')->constrained('tasks')->cascadeOnDelete();
            $table->dateTime('startDate')->nullable();
            $table->dateTime('endDate')->nullable();
            $table->foreignId('taskStatusId')->nullable()->constrained('tasksStatus')->nullOnDelete();
            $table->foreignId('projectMemberId')->nullable()->constrained('projectsMembers');
            $table->foreignId('userId')->nullable()->constrained('users')->nullOnDelete();
            $table->string('action');
            $table->text('description')->nullable();
            $table->json('task');
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('taskHistory');
    }
};
