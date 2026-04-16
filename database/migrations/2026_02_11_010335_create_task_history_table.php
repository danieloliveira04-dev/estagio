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
            $table->enum('action', [
                'created',            // tarefa criada
                'updated',            // tarefa atualizada (genérico)
                'status_changed',     // status/coluna alterado
                'assigned',           // tarefa atribuída a um usuário
                'unassigned',         // tarefa removida de um usuário
                'reassigned',         // tarefa reatribuída para outro usuário
                'commented',          // comentário adicionado
                'priority_changed',   // prioridade alterada
                'due_date_changed',   // data de entrega alterada
                'archived',           // tarefa arquivada
                'restored',           // tarefa restaurada
                'deleted'             // tarefa excluída
            ]);
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
