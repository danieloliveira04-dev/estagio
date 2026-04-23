<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Task extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'tasks';

    protected $fillable = ['id', 'sequence', 'position', 'title', 'description', 'startDate', 'endDate', 'projectId', 'taskStatusId', 'projectColumnId', 'projectMemberId'];

    protected $appends = ['code'];

    public function getCodeAttribute() {
        return $this->project->prefix . '-' . $this->sequence;
    }

    //--

    public function project() {
        return $this->belongsTo(Project::class, 'projectId');
    }
 
    public function column() {
        return $this->belongsTo(ProjectColumn::class, 'projectColumnId');
    }

    public function taskStatus() {
        return $this->hasOne(TaskStatus::class, 'id', 'taskStatusId');
    }

    public function taskHistory() {
        return $this->hasMany(TaskHistory::class, 'taskId');
    }

    public function tags() {
        return $this->belongsToMany(Tag::class, 'tagsTasks', 'taskId', 'tagId')->withTimestamps();
    }

    public function assignee() {
        return $this->hasOne(ProjectMember::class, 'id', 'projectMemberId');
    }
}
