<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Project extends Model
{
    use SoftDeletes;

    public function members() {
        return $this->hasMany(ProjectMember::class, 'projectId');
    }

    public function tasks() {
        return $this->hasMany(Task::class, 'projectId');
    }
}
