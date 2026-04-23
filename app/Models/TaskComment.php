<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class TaskComment extends Model {
    use SoftDeletes;

    protected $table = 'taskComments';

    protected $fillable = [
        'projectId',
        'taskId',
        'userId',
        'content',
        'createdByUserId',
        'deletedByUserId',
    ];


    public function project() {
        return $this->belongsTo(Project::class, 'projectId');
    }

    public function task() {
        return $this->belongsTo(Task::class, 'taskId');
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

    public function attachments() {
        return $this->hasMany(TaskAttachment::class, 'taskCommentId');
    }
}