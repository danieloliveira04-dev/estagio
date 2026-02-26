<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class ProjectInvitation extends Model
{
    use SoftDeletes;

    public const STATUS_PENDING = 'pending';
    public const STATUS_ACCEPTED = 'accepted';
    public const STATUS_DECLINED = 'declined';

    protected $table = 'projectInvitations';

    protected $fillable = [
        'projectId',
        'userId',
        'invitationId',
        'roleId',
        'createdByUserId',
        'status',
        'description',
    ];

    public function project() {
        return $this->belongsTo(Project::class, 'projectId');
    }

    public function user() {
        return $this->belongsTo(User::class, 'userId');
    }

    public function invitation() {
        return $this->belongsTo(Invitation::class, 'invitationId');
    }

    public function role() {
        return $this->belongsTo(Role::class, 'roleId');
    }

    public function createdByUser() {
        return $this->belongsTo(User::class, 'createdByUserId');
    }
}