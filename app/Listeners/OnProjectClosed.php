<?php

namespace App\Listeners;

use App\Events\ProjectClosed;
use App\Jobs\SendQueuedEmail;
use App\Models\User;

class OnProjectClosed
{
    
    public function __construct()
    {
    }

    /**
     * Handle the event.
     */
    public function handle(ProjectClosed $event): void
    {
        $project = $event->project;

        $project->load(['members']);

        $emails = collect();

        foreach($project->members as $member) {
            $user = User::find($member->userId);
            $emails->push($user->email);
        }

        SendQueuedEmail::dispatch(
            $emails->join(','),
            \App\Mail\ProjectClosedMail::class,
            [
                'project' => $project->toArray(),
            ]
        );
    }
}
