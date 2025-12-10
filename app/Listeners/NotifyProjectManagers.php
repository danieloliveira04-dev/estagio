<?php

namespace App\Listeners;

use App\Events\UserStatusChanged;
use App\Jobs\SendQueuedEmail;
use App\Models\Role;
use App\Models\User;

class NotifyProjectManagers
{
    /**
     * Create the event listener.
     */
    public function __construct()
    {
        //
    }

    /**
     * Handle the event.
     */
    public function handle(UserStatusChanged $event): void
    {
        $user = $event->user;

        if (!$user->isActive() || $user->deleted_at) {
            $user->load([
                'projects' => function($query) use ($user) {
                    $query->with([
                        'members',
                        'tasks' => function($tasksQuery) use ($user) {
                            $tasksQuery->where('pmUserId', $user->id);
                        }
                    ]);
                }
            ]);
            
            foreach ($user->projects as $project) {
                $managers = $project->members->filter(fn($m) => $m->roleId === Role::MANAGER);
                
                foreach ($managers as $manager) {
                    $managerUser = User::find($manager->userId);
                    
                    SendQueuedEmail::dispatch(
                        $managerUser->email,
                        \App\Mail\UserStatusChangedMail::class,
                        [
                            'user' => $user->toArray(),
                            'manager' => $managerUser->toArray(),
                            'project' => $project->toArray()
                        ]
                    );
                }
            }
        }
    }
}
