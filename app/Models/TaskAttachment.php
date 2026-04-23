<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class TaskAttachment extends Model {
    use SoftDeletes;

    protected $table = 'taskAttachments';

    protected $fillable = [
        'projectId',
        'taskId',
        'taskCommentId',
        'userId',

        'fileName',
        'filePath',
        'fileType',
        'extension',
        'size',
        'isImage',

        'createdByUserId',
        'deletedByUserId',
    ];

    public function project() {
        return $this->belongsTo(Project::class, 'projectId');
    }

    public function task() {
        return $this->belongsTo(Task::class, 'taskId');
    }

    public function comment() {
        return $this->belongsTo(TaskComment::class, 'taskCommentId');
    }

    public function user() {
        return $this->belongsTo(User::class, 'userId');
    }

    public function creator() {
        return $this->belongsTo(User::class, 'createdByUserId');
    }

    public function deletedBy() {
        return $this->belongsTo(User::class, 'deletedByUserId');
    }
}