<?php

namespace App\Http\Controllers\Admin\Reports;

use App\Http\Controllers\Controller;
use App\Models\TaskHistory;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ProductivityReportController extends Controller
{
    public function index(Request $request): Response
    {
        $query = TaskHistory::query()
            ->with([
                'assignee.user',
            ])
            ->where(
                'action',
                TaskHistory::ACTION_COMPLETED
            );

        if ($request->filled('search')) {
            $search = $request->search;

            $query->whereHas('assignee.user', function ($q) use ($search) {
                $q->where(
                    'name',
                    'like',
                    "%{$search}%"
                );
            });
        }

        if ($request->filled('projectId')) {
            $projectId = $request->projectId;

            $query->where(function ($q) use ($projectId) {

                $q->whereRaw(
                    "JSON_EXTRACT(task, '$.projectId') = ?",
                    [$projectId]
                );
            });
        }

        if ($request->filled('userId')) {
            $query->whereHas('assignee', function ($q) use ($request) {
                $q->where(
                    'userId',
                    $request->userId
                );
            });
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
            ->groupBy(fn ($history) => $history->assignee?->user?->id)
            ->map(function ($items) {

                $user = $items
                    ->first()?->assignee?->user;

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

                        $endDate = Carbon::parse(
                            $task['endDate']
                        );

                        return $completedAt->lte($endDate);
                    });

                $lateTasks = $items
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

                        $endDate = Carbon::parse(
                            $task['endDate']
                        );

                        return $completedAt->gt($endDate);
                    });

                $averageCompletionTime = $items
                    ->avg(function ($history) {

                        $task = $history->task;

                        if (
                            !$task ||
                            empty($task['created_at'])
                        ) {
                            return 0;
                        }

                        return Carbon::parse(
                            $task['created_at']
                        )->diffInHours(
                            $history->created_at
                        );
                    });

                return [
                    'user' => $user,

                    'completedTasks' => $completedTasks,

                    'completedOnTime' => $completedOnTime->count(),

                    'lateTasks' => $lateTasks->count(),

                    'averageCompletionTime' => round(
                        $averageCompletionTime ?? 0,
                        2
                    ),
                ];
            })
            ->filter(fn ($item) => $item['user'])
            ->values();

        return Inertia::render(
            'admin/reports/productivity/index',
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