<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class ProjectStatus extends Model
{
    use SoftDeletes;

    protected $table = 'projectsStatus';

    protected $fillable = ['id', 'name'];

    //--

    public function projects() {
        return $this->hasMany(Project::class, 'projectStatusId');
    }
    
}
