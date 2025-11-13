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
        Schema::create('invitations', function (Blueprint $table) {
            $table->id();
            $table->timestamp('expiredAt');
            $table->string('email');
            $table->string('token');
            $table->enum('status', ['pending', 'accepted', 'expired']);
            $table->foreignId('createdByUserId')
                ->constrained('users');
            $table->timestamps();
        });

        Schema::table('users', function (Blueprint $table) {
            $table->foreignId('invitationId')
                ->nullable()
                ->constrained('invitations')
                ->onDelete('set null');
        });

    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropForeign(['invitationId']);
            $table->dropColumn('invitationId');
        });

        Schema::table('invitations', function (Blueprint $table) {
            $table->dropForeign(['createdByUserId']);
        });

        Schema::dropIfExists('invitations');
    }
};
