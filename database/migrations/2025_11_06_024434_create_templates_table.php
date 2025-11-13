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
        Schema::create('templates', function (Blueprint $table) {
            $table->id();
            $table->string('name', 45);
            $table->timestamps();
            $table->softDeletes();
        });

        Schema::create('templateColumns', function (Blueprint $table) {
            $table->id();
            $table->string('name', 45);

            $table->foreignId('templateId')
                ->constrained('templates')
                ->onDelete('cascade');

            $table->foreignId('taskStatusId')
                ->nullable()
                ->constrained('tasksStatus')
                ->nullOnDelete();

            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('templateColumns');
        Schema::dropIfExists('templates');
    }
};
