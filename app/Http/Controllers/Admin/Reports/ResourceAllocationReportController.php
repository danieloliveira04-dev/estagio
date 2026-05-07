<?php

namespace App\Http\Controllers\Admin\Reports;

use App\Http\Controllers\Controller;
use App\Models\Task;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ResourceAllocationReportController extends Controller
{
    public function index(Request $request): Response
    {
        $query = Task::query()
            ->with([
                'project',
                'assignee.user',
            ]);

        if ($request->filled('search')) {

            $search = $request->search;

            $query->whereHas(
                'assignee.user',
                function ($q) use ($search) {

                    $q->where(
                        'name',
                        'like',
                        "%{$search}%"
                    );
                }
            );
        }

        if ($request->filled('projectId')) {

            $query->where(
                'projectId',
                $request->projectId
            );
        }

        if ($request->filled('userId')) {

            $query->whereHas(
                'assignee',
                function ($q) use ($request) {

                    $q->where(
                        'userId',
                        $request->userId
                    );
                }
            );
        }

        if ($request->filled('startDate')) {

            $query->whereDate(
                'created_at',
                '>=',
                $request->startDate
            );
        }

        if ($request->filled('endDate')) {

            $query->whereDate(
                'created_at',
                '<=',
                $request->endDate
            );
        }

        $tasks = $query->get();

        $report = $tasks
            ->groupBy(fn ($task) => $task->assignee?->user?->id)
            ->map(function ($items) {

                $user = $items
                    ->first()?->assignee?->user;

                $tasksCount = $items->count();

                $projectsDistribution = $items
                    ->groupBy('projectId')
                    ->map(function ($projectTasks) {

                        $project = $projectTasks
                            ->first()?->project;

                        return [
                            'project' => $project,
                            'tasksCount' => $projectTasks->count(),
                        ];
                    })
                    ->values();

                $completedTasks = $items
                    ->where(
                        'taskStatusId',
                        env('taskStatusCompletedId')
                    )
                    ->count();

                $pendingTasks = $tasksCount - $completedTasks;

                return [
                    'user' => $user,

                    'tasksCount' => $tasksCount,

                    'completedTasks' => $completedTasks,

                    'pendingTasks' => $pendingTasks,

                    'projectsDistribution' => $projectsDistribution,

                    'workloadStatus' => match (true) {
                        $tasksCount >= 15 => 'Sobrecarga',
                        $tasksCount <= 3 => 'Ocioso',
                        default => 'Balanceado',
                    },
                ];
            })
            ->filter(fn ($item) => $item['user'])
            ->values();

        return Inertia::render(
            'admin/reports/resource-allocation/index',
            [
                'report' => $report,

                'filters' => $request->only([
                    'search',
                    'projectId',
                    'userId',
                    'startDate',
                    'endDate',
                ]),
            ]
        );
    }
}