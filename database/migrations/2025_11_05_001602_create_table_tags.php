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
        Schema::create('tags', function (Blueprint $table) {
            $table->id();
            $table->string('name', 45);
            $table->timestamps();
            $table->softDeletes();
        });

        Schema::create('tagsTasks', function (Blueprint $table) {
            $table->foreignId('tagId')->constrained('tags')->onDelete('cascade');
            $table->foreignId('taskId')->constrained('tasks')->onDelete('cascade');
            $table->timestamps();

            $table->primary(['tagId', 'taskId']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tagsTasks');
        Schema::dropIfExists('tags');
    }
};
