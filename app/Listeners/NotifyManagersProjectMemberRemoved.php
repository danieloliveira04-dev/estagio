<?php

namespace App\Listeners;

use App\Events\ProjectMemberRemoved;
use App\Jobs\SendQueuedEmail;

class NotifyManagersProjectMemberRemoved
{
    public function handle(ProjectMemberRemoved $event)
    {
        $managers = $event->project->members()
            ->where('roleId', env('roleManagerId'))
            ->with('user')
            ->get();

        $event->member->load('user');

        foreach($managers as $manager) {
            SendQueuedEmail::dispatch(
                $manager->user->email,
                \App\Mail\ProjectMemberRemovedMail::class,
                [
                    'project' => $event->project->toArray(),
                    'member' => $event->member->toArray(),
                    'tasks' => $event->tasks->toArray(), 
                ]
            );
        }
    }
}