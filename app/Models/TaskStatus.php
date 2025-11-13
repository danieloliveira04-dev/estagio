<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class TaskStatus extends Model
{
    use SoftDeletes;

    protected $table = 'tasksStatus';

    protected $fillable = ['name'];

    public function tasks() {
        return $this->hasMany(Task::class, 'taskStatusId');
    }

}
