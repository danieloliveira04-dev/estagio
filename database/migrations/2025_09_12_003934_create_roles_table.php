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
        Schema::create('roles', function (Blueprint $table) {
            $table->id();
            $table->string('name', 45);
            $table->enum('type', ['profile', 'function']);
            $table->timestamps();
            $table->softDeletes();
        });

        Schema::table('users', function (Blueprint $table) {
            $table->foreignId('roleId')->constrained('roles');
        });

        Schema::table('invitations', function (Blueprint $table) {
            $table->foreignId('roleId')->constrained('roles');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropForeign(['roleId']);
            $table->dropColumn('roleId');
        });

        Schema::table('invitations', function (Blueprint $table) {
            $table->dropForeign(['roleId']);
            $table->dropColumn('roleId');
        });

        Schema::dropIfExists('roles');
    }
};
