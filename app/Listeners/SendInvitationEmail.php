<?php

namespace App\Listeners;

use App\Events\InvitationCreated;
use App\Jobs\SendQueuedEmail;

class SendInvitationEmail
{
    public function handle(InvitationCreated $event)
    {
        SendQueuedEmail::dispatch(
            $event->invitation->email,
            \App\Mail\InvitationMail::class,
            ['invitation' => $event->invitation->toArray()]
        );
    }
}
