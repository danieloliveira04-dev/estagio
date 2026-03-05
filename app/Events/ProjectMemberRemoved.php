<?php

namespace App\Events;

use App\Models\Project;
use App\Models\ProjectMember;
use App\Models\Task;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class ProjectMemberRemoved
{
    use Dispatchable, SerializesModels;

    public Project $project;
    public ProjectMember $member;
    public Collection $tasks;

    public function __construct(Project $project, ProjectMember $member, Collection $tasks)
    {
        $this->project = $project;
        $this->member = $member;
        $this->tasks = $tasks;
    }
}