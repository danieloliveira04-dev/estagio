<?php

namespace Database\Seeders;

use App\Models\Project;
use App\Models\Task;
use App\Models\TaskHistory;
use Carbon\Carbon;
use Illuminate\Database\Seeder;

class TaskSeeder extends Seeder
{
    public function run(): void
    {
        $projects = Project::with([
            'columns',
        ])->get();

        foreach ($projects as $project) {

            $members = \DB::table('projectsMembers')
                ->where('projectId', $project->id)
                ->where('roleId', 4)
                ->get();

            if ($members->isEmpty()) {
                continue;
            }

            $todoColumn = $project->columns
                ->firstWhere(
                    'taskStatusId',
                    env('taskStatusPendingId')
                );

            $doingColumn = $project->columns
                ->firstWhere(
                    'taskStatusId',
                    env('taskStatusInProgressId')
                );

            $doneColumn = $project->columns
                ->firstWhere(
                    'taskStatusId',
                    env('taskStatusCompletedId')
                );

            $cancelledColumn = $project->columns
                ->firstWhere(
                    'taskStatusId',
                    env('taskStatusCanceledId')
                );

            $sequence = 1;

            for ($week = 0; $week < 8; $week++) {

                $tasksThisWeek = rand(8, 15);

                for ($i = 0; $i < $tasksThisWeek; $i++) {

                    $assignee = $members->random();

                    $actor = $members->random();

                    $scenario = rand(1, 6);

                    $createdAt = Carbon::now()
                        ->subWeeks(8 - $week)
                        ->addDays(rand(0, 6));

                    $startDate = $createdAt
                        ->copy()
                        ->addDay();

                    $endDate = $startDate
                        ->copy()
                        ->addDays(rand(2, 12));

                    $task = Task::factory()->create([
                        'projectId' => $project->id,

                        'projectColumnId' => $todoColumn?->id,

                        'projectMemberId' => $assignee->id,

                        'taskStatusId' => env('taskStatusPendingId'),

                        'sequence' => $sequence++,

                        'position' => $i,

                        'created_at' => $createdAt,

                        'startDate' => $startDate,

                        'endDate' => $endDate,
                    ]);

                    //--

                    TaskHistory::create([
                        'task' => $task,

                        'taskId' => $task->id,

                        'userId' => $actor->userId,

                        'projectMemberId' => $assignee->id,

                        'taskStatusId' => env('taskStatusPendingId'),

                        'action' => TaskHistory::ACTION_CREATED,

                        'created_at' => $createdAt,
                    ]);

                    /*
                    |--------------------------------------------------------------------------
                    | CENÁRIOS
                    |--------------------------------------------------------------------------
                    |
                    | 1 = concluída no prazo
                    | 2 = concluída atrasada
                    | 3 = atrasada e aberta
                    | 4 = em andamento
                    | 5 = cancelada
                    | 6 = recém criada
                    |
                    */

                    switch ($scenario) {

                        /*
                        |--------------------------------------------------------------------------
                        | CONCLUÍDA NO PRAZO
                        |--------------------------------------------------------------------------
                        */

                        case 1:

                            $completedAt = $endDate
                                ->copy()
                                ->subDays(rand(0, 2));

                            $task->update([
                                'projectColumnId' => $doneColumn?->id,

                                'taskStatusId' => env('taskStatusCompletedId'),
                            ]);

                            TaskHistory::create([
                                'task' => $task,

                                'taskId' => $task->id,

                                'userId' => $actor->userId,

                                'projectMemberId' => $assignee->id,

                                'taskStatusId' => env('taskStatusCompletedId'),

                                'action' => TaskHistory::ACTION_COMPLETED,

                                'created_at' => $completedAt,
                            ]);

                            break;

                        /*
                        |--------------------------------------------------------------------------
                        | CONCLUÍDA ATRASADA
                        |--------------------------------------------------------------------------
                        */

                        case 2:

                            $completedAt = $endDate
                                ->copy()
                                ->addDays(rand(1, 6));

                            $task->update([
                                'projectColumnId' => $doneColumn?->id,

                                'taskStatusId' => env('taskStatusCompletedId'),
                            ]);

                            TaskHistory::create([
                                'task' => $task,

                                'taskId' => $task->id,

                                'userId' => $actor->userId,

                                'projectMemberId' => $assignee->id,

                                'taskStatusId' => env('taskStatusCompletedId'),

                                'action' => TaskHistory::ACTION_COMPLETED,

                                'created_at' => $completedAt,
                            ]);

                            break;

                        /*
                        |--------------------------------------------------------------------------
                        | ATRASADA E ABERTA
                        |--------------------------------------------------------------------------
                        */

                        case 3:

                            $task->update([
                                'projectColumnId' => $doingColumn?->id,

                                'taskStatusId' => env('taskStatusInProgressId'),

                                'endDate' => now()
                                    ->subDays(rand(1, 10)),
                            ]);

                            TaskHistory::create([
                                'task' => $task,

                                'taskId' => $task->id,

                                'userId' => $actor->userId,

                                'projectMemberId' => $assignee->id,

                                'taskStatusId' => env('taskStatusInProgressId'),

                                'action' => TaskHistory::ACTION_STATUS_CHANGED,

                                'created_at' => $createdAt
                                    ->copy()
                                    ->addDays(1),
                            ]);

                            break;

                        /*
                        |--------------------------------------------------------------------------
                        | EM ANDAMENTO
                        |--------------------------------------------------------------------------
                        */

                        case 4:

                            $task->update([
                                'projectColumnId' => $doingColumn?->id,

                                'taskStatusId' => env('taskStatusInProgressId'),
                            ]);

                            TaskHistory::create([
                                'task' => $task,

                                'taskId' => $task->id,

                                'userId' => $actor->userId,

                                'projectMemberId' => $assignee->id,

                                'taskStatusId' => env('taskStatusInProgressId'),

                                'action' => TaskHistory::ACTION_STATUS_CHANGED,

                                'created_at' => $createdAt
                                    ->copy()
                                    ->addDays(1),
                            ]);

                            break;

                        /*
                        |--------------------------------------------------------------------------
                        | CANCELADA
                        |--------------------------------------------------------------------------
                        */

                        case 5:

                            $cancelledAt = $createdAt
                                ->copy()
                                ->addDays(rand(1, 3));

                            $task->update([
                                'projectColumnId' => $cancelledColumn?->id,

                                'taskStatusId' => env('taskStatusCanceledId'),
                            ]);

                            TaskHistory::create([
                                'task' => $task,

                                'taskId' => $task->id,

                                'userId' => $actor->userId,

                                'projectMemberId' => $assignee->id,

                                'taskStatusId' => env('taskStatusCanceledId'),

                                'action' => TaskHistory::ACTION_CANCELLED,

                                'created_at' => $cancelledAt,
                            ]);

                            break;

                        /*
                        |--------------------------------------------------------------------------
                        | RECÉM CRIADA
                        |--------------------------------------------------------------------------
                        */

                        case 6:

                            // fica pendente

                            break;
                    }

                    /*
                    |--------------------------------------------------------------------------
                    | EVENTOS ALEATÓRIOS
                    |--------------------------------------------------------------------------
                    */

                    if (rand(0, 100) < 30) {
                       $availableMembers = $members
                            ->where('id', '!=', $assignee->id);

                        if ($availableMembers->isNotEmpty()) {

                            $newAssignee = $availableMembers->random();

                            $task->update([
                                'projectMemberId' => $newAssignee->id,
                            ]);

                            TaskHistory::create([
                                'task' => $task,

                                'taskId' => $task->id,

                                'userId' => $actor->userId,

                                'projectMemberId' => $newAssignee->id,

                                'taskStatusId' => $task->taskStatusId,

                                'action' => TaskHistory::ACTION_REASSIGNED,

                                'created_at' => $createdAt
                                    ->copy()
                                    ->addDays(rand(1, 4)),
                            ]);
                        }
                    }

                    if (rand(0, 100) < 20) {

                        TaskHistory::create([
                            'task' => $task,

                            'taskId' => $task->id,

                            'userId' => $actor->userId,

                            'projectMemberId' => $task->projectMemberId,

                            'taskStatusId' => $task->taskStatusId,

                            'action' => TaskHistory::ACTION_PRIORITY_CHANGED,

                            'created_at' => $createdAt
                                ->copy()
                                ->addDays(rand(1, 5)),
                        ]);
                    }

                    if (rand(0, 100) < 15) {

                        $newEndDate = Carbon::parse($task->endDate)
                            ->addDays(rand(1, 5));

                        $task->update([
                            'endDate' => $newEndDate,
                        ]);

                        TaskHistory::create([
                            'task' => $task,

                            'taskId' => $task->id,

                            'userId' => $actor->userId,

                            'projectMemberId' => $task->projectMemberId,

                            'taskStatusId' => $task->taskStatusId,

                            'action' => TaskHistory::ACTION_DUE_DATE_CHANGED,

                            'created_at' => $createdAt
                                ->copy()
                                ->addDays(rand(1, 4)),
                        ]);
                    }
                }
            }
        }
    }
}