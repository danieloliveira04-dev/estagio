<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class ProjectMember extends Model
{
    use SoftDeletes;

    protected $table = 'projectsMembers';

    protected $fillable = ['projectId', 'userId', 'roleId', 'description'];

    //--

    public function project() {
        return $this->belongsTo(User::class, 'projectId');
    }

    public function user() {
        return $this->belongsTo(User::class, 'userId');
    }

    public function role() {
        return $this->belongsTo(Role::class, 'roleId');
    }
}
