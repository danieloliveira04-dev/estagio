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
        Schema::create('projectColumns', function (Blueprint $table) {
            $table->id();
            $table->string('name', 45);
            $table->foreignId('projectId')->constrained('projects')->cascadeOnDelete();
            $table->foreignId('taskStatusId')->nullable()->constrained('tasksStatus')->cascadeOnDelete();
            $table->integer('position')->default(0);
            $table->timestamps();
            $table->softDeletes();
        });

        Schema::table('tasks', function (Blueprint $table) {
            $table->foreignId('projectColumnId')->constrained('projectColumns');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('tasks', function (Blueprint $table) {
            $table->dropForeign(['projectColumnId']);
            $table->dropColumn('projectColumnId');
        });

        Schema::dropIfExists('projectColumns');
    }
};
