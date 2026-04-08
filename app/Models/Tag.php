<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Tag extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'name',
    ];

    //--

    public function tasks() {
        return $this->belongsToMany(Task::class, 'tagsTasks', 'tagId', 'taskId')->withTimestamps();
    }

}
