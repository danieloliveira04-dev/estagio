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
        Schema::create('tasks', function (Blueprint $table) {
            $table->id();
            $table->string('title', 120);
            $table->text('description')->nullable();
            $table->dateTime('startDate')->nullable();
            $table->dateTime('endDate')->nullable();
            $table->foreignId('projectId')->constrained('projects');
            $table->foreignId('taskStatusId')->constrained('tasksStatus')->nullable();
            $table->unsignedBigInteger('pmProjectId')->nullable();
            $table->unsignedBigInteger('pmUserId')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->foreign(['pmProjectId', 'pmUserId'])
                ->references(['projectId', 'userId'])
                ->on('projectsMembers')
                ->onDelete('set null');
        });

        Schema::table('notifications', function (Blueprint $table) {
            $table->foreignId('taskId')
                ->nullable()
                ->constrained('tasks')
                ->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('notifications', function (Blueprint $table) {
            $table->dropForeign(['taskId']);
            $table->dropColumn('taskId');
        });

        Schema::table('tasks', function (Blueprint $table) {
            $table->dropForeign(['projectId']);
            $table->dropForeign(['taskStatusId']);

            $table->dropForeign(['pmProjectId', 'pmUserId']);
        });

        Schema::dropIfExists('tasks');
    }
};
