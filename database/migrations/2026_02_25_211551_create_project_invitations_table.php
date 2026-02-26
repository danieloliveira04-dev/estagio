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
        Schema::create('projectInvitations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('projectId')->constrained('projects')->cascadeOnDelete();
            $table->foreignId('userId')->nullable()->constrained('users')->cascadeOnDelete();
            $table->foreignId('invitationId')->nullable()->constrained('invitations')->cascadeOnDelete();
            $table->enum('status', ['pending', 'accepted', 'declined']);
            $table->foreignId('roleId')->constrained('roles')->cascadeOnDelete();
            $table->string('description', 225)->nullable();
            $table->foreignId('createdByUserId')->constrained('users')->cascadeOnDelete();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('projectInvitations');
    }
};
