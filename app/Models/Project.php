<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Project extends Model
{
    use SoftDeletes;

    protected $fillable = ['id', 'name', 'description', 'projectStatusId', 'expectedEndAt', 'finishedAt', 'closeReason'];
    
    //--

    public function projectStatus() {
        return $this->belongsTo(ProjectStatus::class, 'projectStatusId');
    }

    public function members() {
        return $this->hasMany(ProjectMember::class, 'projectId');
    }

    public function tasks() {
        return $this->hasMany(Task::class, 'projectId');
    }
}
