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
        Schema::create('taskAttachments', function (Blueprint $table) {
            $table->id();

            $table->foreignId('projectId')->constrained()->cascadeOnDelete();
            $table->foreignId('taskId')->constrained()->cascadeOnDelete();

            $table->foreignId('taskCommentId')->constrained('taskComments')->nullOnDelete();

            $table->foreignId('userId')->constrained('users'); 

            // dados do arquivo
            $table->string('fileName');
            $table->string('filePath');
            $table->string('fileType')->nullable();
            $table->string('extension')->nullable();
            $table->unsignedBigInteger('size')->nullable();

            // metadados opcionais
            $table->boolean('isImage')->default(false);

            // auditoria
            $table->foreignId('createdByUserId')->nullable()->constrained('users');
            $table->foreignId('deletedByUserId')->nullable()->constrained('users');

            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('taskAttachments');
    }
};
