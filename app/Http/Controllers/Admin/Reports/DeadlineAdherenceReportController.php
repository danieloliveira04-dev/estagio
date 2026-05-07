<?php

namespace App\Http\Controllers\Admin\Reports;

use App\Http\Controllers\Controller;
use App\Models\TaskHistory;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DeadlineAdherenceReportController extends Controller
{
    public function index(Request $request): Response
    {
        $query = TaskHistory::query()
            ->with([
                'assignee.project',
            ])
            ->where(
                'action',
                TaskHistory::ACTION_COMPLETED
            );

        if ($request->filled('search')) {

            $search = $request->search;

            $query->whereHas(
                'assignee.project',
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

            $projectId = $request->projectId;

            $query->whereHas(
                'assignee.project',
                function ($q) use ($projectId) {

                    $q->where(
                        'projects.id',
                        $projectId
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

        $histories = $query
            ->orderBy('created_at')
            ->get();

        $report = $histories
            ->groupBy(fn ($history) => $history->assignee?->project?->id)
            ->map(function ($items) {

                $project = $items
                    ->first()?->assignee?->project;

                $completedTasks = $items->count();

                $completedOnTime = $items
                    ->filter(function ($history) {

                        $task = $history->task;

                        if (
                            !$task ||
                            empty($task['endDate'])
                        ) {
                            return false;
                        }

                        $completedAt = Carbon::parse(
                            $history->created_at
                        );

                        $plannedEndDate = Carbon::parse(
                            $task['endDate']
                        );

                        return $completedAt->lte(
                            $plannedEndDate
                        );
                    });

                $completedLate = $items
                    ->filter(function ($history) {

                        $task = $history->task;

                        if (
                            !$task ||
                            empty($task['endDate'])
                        ) {
                            return false;
                        }

                        $completedAt = Carbon::parse(
                            $history->created_at
                        );

                        $plannedEndDate = Carbon::parse(
                            $task['endDate']
                        );

                        return $completedAt->gt(
                            $plannedEndDate
                        );
                    });

                $deadlineChanges = TaskHistory::query()
                    ->where(
                        'action',
                        TaskHistory::ACTION_DUE_DATE_CHANGED
                    )
                    ->where(function ($query) use ($project) {

                        $query->whereRaw(
                            "JSON_EXTRACT(task, '$.projectId') = ?",
                            [$project->id]
                        );
                    })
                    ->count();

                $complianceRate = $completedTasks > 0
                    ? round(
                        (
                            $completedOnTime->count()
                            / $completedTasks
                        ) * 100
                    )
                    : 0;

                return [
                    'project' => $project,

                    'completedTasks' => $completedTasks,

                    'completedOnTime' => $completedOnTime->count(),

                    'completedLate' => $completedLate->count(),

                    'complianceRate' => $complianceRate,

                    'deadlineChanges' => $deadlineChanges,

                    'status' => match (true) {
                        $complianceRate >= 80 => 'Dentro do prazo',
                        $complianceRate >= 50 => 'Atenção',
                        default => 'Atrasado',
                    },
                ];
            })
            ->filter(fn ($item) => $item['project'])
            ->values();

        return Inertia::render(
            'admin/reports/deadline-adherence/index',
            [
                'report' => $report,

                'filters' => $request->only([
                    'search',
                    'projectId',
                    'startDate',
                    'endDate',
                ]),
            ]
        );
    }
}