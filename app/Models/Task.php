<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Task extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'tasks';

    protected $fillable = ['id', 'title', 'description', 'startDate', 'endDate', 'projectId', 'taskStatusId', 'projectColumnId'];

    public function taskStatus() {
        return $this->hasOne(TaskStatus::class, 'id', 'taskStatusId');
    }

    public function taskHistory() {
        return $this->hasMany(TaskHistory::class, 'taskId');
    }

}
