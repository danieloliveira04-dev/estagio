<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class ProjectMember extends Model
{
    use SoftDeletes;

    protected $table = 'projectsMembers';

    protected $fillable = ['projectId', 'userId', 'roleId', 'description'];

    protected $with = [
        'user',
        'role',
    ];

    //--

    public function project() {
        return $this->belongsTo(Project::class, 'projectId');
    }

    public function user() {
        return $this->belongsTo(User::class, 'userId');
    }

    public function role() {
        return $this->belongsTo(Role::class, 'roleId');
    }

    public function tasks() {
        return $this->hasMany(Task::class, 'projectMemberId');
    }
}
