<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Role extends Model
{
    use SoftDeletes;

    public const TYPE_PROFILE = 'profile';
    public const TYPE_FUNCTION = 'function';
    
    public const ADMIN = 1;
    public const USER = 2;
    public const MANAGER = 3;
    public const COLLABORATOR = 4;
    public const CLIENT = 5;

    protected $fillable = [
        'name',
        'type'
    ];


    public function users() {
        return $this->hasMany(User::class, 'roleId');
    }

}
