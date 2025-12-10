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
        Schema::create('projects', function (Blueprint $table) {
            $table->id();
            $table->string('name', 120);
            $table->text('description')->nullable();
            $table->foreignId('projectStatusId')->constrained('projectsStatus');
            $table->dateTime('expectedEndAt')->nullable();
            $table->dateTime('finishedAt')->nullable();
            $table->text('closeReason')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });

        Schema::create('projectsMembers', function (Blueprint $table) {
            $table->foreignId('projectId')->constrained('projects');
            $table->foreignId('userId')->constrained('users');
            $table->foreignId('roleId')->constrained('roles');
            $table->string('description', 225)->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->primary(['projectId', 'userId']);
        });

        Schema::table('notifications', function (Blueprint $table) {
            $table->foreignId('projectId')
                ->nullable()
                ->constrained('projects')
                ->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('notifications', function (Blueprint $table) {
            $table->dropForeign(['projectId']);
            $table->dropColumn('projectId');
        });

        Schema::table('projectsMembers', function (Blueprint $table) {
            $table->dropForeign(['projectId']);
            $table->dropForeign(['userId']);
            $table->dropForeign(['roleId']);
        });

        Schema::table('projects', function (Blueprint $table) {
            $table->dropForeign(['projectStatusId']);
        });

        Schema::dropIfExists('projectsMembers');
        Schema::dropIfExists('projects');
    }
};
