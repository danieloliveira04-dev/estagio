<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class ProjectColumn extends Model
{
    use SoftDeletes;

    protected $table = 'projectColumns';

    protected $fillable = ['name', 'projectId', 'taskStatusId', 'position'];

    //--

    public function project() {
        return $this->belongsTo(Project::class, 'projectId');
    }

    public function tasks() {
        return $this->hasMany(Task::class, 'projectColumnId');
    }
}
