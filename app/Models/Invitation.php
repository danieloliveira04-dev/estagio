<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Invitation extends Model
{
    use HasFactory;

    public const STATUS_PENDING  = 'pending';
    public const STATUS_ACCEPTED = 'accepted';
    public const STATUS_EXPIRED  = 'expired';

    protected $fillable = [
        'expiredAt', 'email', 'roleId', 'token', 'status', 'createdByUserId'
    ];

    protected function casts(): array
    {
        return [
            'expiredAt' => 'datetime',
        ];
    }

    public function isValid(): bool
    {
        return $this->status === 'pending' && $this->expiredAt->isFuture();
    }

    public function createdByUser()
    {
        return $this->belongsTo(User::class, 'createdByUserId');
    }
}
