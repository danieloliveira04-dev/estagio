<?php

namespace App\Events;

use App\Models\ProjectInvitation;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class ProjectInvitationCreated
{
    use Dispatchable, SerializesModels;

    public ProjectInvitation $invitation;

    public function __construct(ProjectInvitation $invitation)
    {
        $this->invitation = $invitation;
    }
}