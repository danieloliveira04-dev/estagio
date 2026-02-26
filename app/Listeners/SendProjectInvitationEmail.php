<?php

namespace App\Listeners;

use App\Events\ProjectInvitationCreated;
use App\Jobs\SendQueuedEmail;

class SendProjectInvitationEmail
{
    public function handle(ProjectInvitationCreated $event): void
    {
        $event->invitation->load(['project', 'role', 'user', 'invitation']);

        $email = $event->invitation->user?->email ?? $event->invitation->invitation->email;

        SendQueuedEmail::dispatch(
            $email,
            \App\Mail\ProjectInvitationMail::class,
            ['invitation' => $event->invitation->toArray()]
        );
    }
}