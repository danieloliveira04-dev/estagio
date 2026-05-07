<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Project;
use App\Models\ProjectMember;
use App\Models\Task;
use App\Models\TaskHistory;
use Carbon\Carbon;
use DB;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller {

    public function index(): Response {
        return Inertia::render('admin/dashboard/index');
    }

    public function metrics() {
        $now = Carbon::now();

        $startOfDay = $now->copy()->startOfDay();
        $endOfDay = $now->copy()->endOfDay();

        $startLastMonth = $now->copy()->subMonth()->startOfMonth();
        $endLastMonth = $now->copy()->subMonth()->endOfMonth();

        $startOfWeek = $now->copy()->startOfWeek();
        $endOfWeek = $now->copy()->endOfWeek();

        // Projetos ativos HOJE
        $activeProjectsCount = Project::query()
            ->where('projectStatusId', '!=', env('projectStatusClosedId'))
            ->count();

        // Projetos ativos no FINAL do mês passado
        $activeProjectsPrevMonth = Project::query()
            ->where('created_at', '<=', $endLastMonth)
            ->where(function ($query) use ($startLastMonth) {
                $query
                    ->whereNull('finishedAt')
                    ->orWhere('finishedAt', '>=', $startLastMonth);
            })
            ->count();

        $activeProjects = [
            "value" => $activeProjectsCount,
            "change" => $this->calculateChange($activeProjectsCount, $activeProjectsPrevMonth),
        ];

        //--

        // Tarefas abertas HOJE
        $openTasksCount = Task::query()
            ->whereNotIn('taskStatusId', [
                env('taskStatusCompletedId'),
                env('taskStatusCanceledId'),
            ])
            ->count();

        // Tarefas abertas no FINAL do mês passado
        $openTasksPrevMonth = Task::query()
            ->where('created_at', '<=', $endLastMonth)
            ->where(function ($query) use ($endLastMonth) {
                $query
                    ->whereDoesntHave('taskHistory', function ($q) {
                        $q->where('action', TaskHistory::ACTION_COMPLETED);
                    })
                    ->orWhereHas('taskHistory', function ($q) use ($endLastMonth) {
                        $q->where('action', TaskHistory::ACTION_COMPLETED)
                        ->where('created_at', '>', $endLastMonth);
                    });
            })
            ->count();

        $openTasks = [
            'value' => $openTasksCount,
            'change' => $this->calculateChange($openTasksCount, $openTasksPrevMonth),
        ];

        //--

        $tasksDueTodayBase = Task::query()
            ->whereBetween('endDate', [$startOfDay, $endOfDay]);

        $tasksOpenToday = (clone $tasksDueTodayBase)
            ->count();

        $tasksCompletedToday = (clone $tasksDueTodayBase)
            ->where('taskStatusId', env('taskStatusCompletedId'))
            ->count();

        $tasksDueToday = [
            'total' => $tasksOpenToday,
            'completed' => $tasksCompletedToday,
        ];
        
        //--

        $tasksWeekBase = Task::query()
            ->whereBetween('endDate', [$startOfWeek, $endOfWeek])
            ->whereNot('taskStatusId', env('taskStatusCanceledId'));

        $totalTasksWeek = (clone $tasksWeekBase)->count();

        $completedTasksWeek = (clone $tasksWeekBase)
            ->where('taskStatusId', env('taskStatusCompletedId'))
            ->count();

        $completionRate = $totalTasksWeek > 0
            ? round(($completedTasksWeek / $totalTasksWeek) * 100)
            : 0;

        $tasksCompletionWeek = [
            'rate' => $completionRate,
            'completed' => $completedTasksWeek,
            'total' => $totalTasksWeek,
        ];

        //--

        $scopedTasks = Task::query()
            ->selectRaw('YEAR(endDate) as year, WEEK(endDate, 1) as week, COUNT(*) as total')
            ->groupByRaw('YEAR(endDate), WEEK(endDate, 1)')
            ->orderByRaw('YEAR(endDate), WEEK(endDate, 1)')
            ->get();

        $completedTasks = TaskHistory::query()
            ->selectRaw('YEAR(created_at) as year, WEEK(created_at, 1) as week, COUNT(DISTINCT taskId) as total')
            ->where('action', TaskHistory::ACTION_COMPLETED)
            ->groupByRaw('YEAR(created_at), WEEK(created_at, 1)')
            ->orderByRaw('YEAR(created_at), WEEK(created_at, 1)')
            ->get();

        $weeks = [];
        foreach ($scopedTasks as $item) {
            $key = $item->year . '-' . $item->week;

            $weeks[$key] = [
                'year' => $item->year,
                'week' => $item->week,
                'scope' => $item->total,
                'done' => 0,
            ];
        }

        foreach ($completedTasks as $item) {
            $key = $item->year . '-' . $item->week;

            if (!isset($weeks[$key])) {
                $weeks[$key] = [
                    'year' => $item->year,
                    'week' => $item->week,
                    'scope' => 0,
                    'done' => $item->total,
                ];
            } else {
                $weeks[$key]['done'] = $item->total;
            }
        }

        $weeklyChart = collect($weeks)
            ->sortBy(['year', 'week'])
            ->values();
    
        //--

        $criticalTasksQuery = Task::query()
            ->whereNotIn('taskStatusId', [
                env('taskStatusCompletedId'),
                env('taskStatusCanceledId'),
            ])
            ->where(function ($query) use ($now, $startOfDay, $endOfDay) {
                $query
                    ->where('endDate', '<', $now)
                    ->orWhereBetween('endDate', [$startOfDay, $endOfDay]);
            });

        $criticalTasks = $criticalTasksQuery
            ->orderByRaw("
                CASE 
                    WHEN endDate < NOW() THEN 0
                    ELSE 1
                END
            ")
            ->orderBy('endDate', 'asc')
            ->get();

        //--

        $teamPerformance = \App\Models\User::query()
            ->leftJoin('projectsMembers', 'projectsMembers.userId', '=', 'users.id')
            ->leftJoin('tasks', 'tasks.projectMemberId', '=', 'projectsMembers.id')
            ->select(
                'users.id',
                'users.name',
                DB::raw('COUNT(tasks.id) as total_tasks'),
                DB::raw("
                    SUM(CASE 
                        WHEN tasks.taskStatusId = " . env('taskStatusCompletedId') . " 
                        THEN 1 ELSE 0 END
                    ) as completed_tasks
                ")
            )
            ->groupBy('users.id', 'users.name')
            ->get();

        $teamPerformance = $teamPerformance->map(function ($member) {
            $total = (int) $member->total_tasks;
            $completed = (int) $member->completed_tasks;

            $workload = $total > 0 
                ? round(($completed / $total) * 100) 
                : 0;

            return [
                'id' => $member->id,
                'name' => $member->name,
                'tasks' => "{$completed}/{$total}",
                'workload' => $workload, // %
                'index' => $this->calculateIndex($completed, $total),
            ];
        });

        //--

        $importantActions = [
            TaskHistory::ACTION_CREATED,
            TaskHistory::ACTION_COMPLETED,
            TaskHistory::ACTION_CANCELLED,
            // TaskHistory::ACTION_STATUS_CHANGED,
            TaskHistory::ACTION_ASSIGNED,
            TaskHistory::ACTION_REASSIGNED,
            TaskHistory::ACTION_PRIORITY_CHANGED,
            TaskHistory::ACTION_DUE_DATE_CHANGED,
        ];

        $recentActivities = TaskHistory::query()
            ->with(['user'])
            ->whereIn('action', $importantActions)
            ->latest()
            ->limit(10)
            ->get();

        //--

        return response()->json([
            "activeProjects" => $activeProjects,
            "openTasks" => $openTasks,
            "tasksDueToday" => $tasksDueToday,
            "tasksCompletionWeek" => $tasksCompletionWeek,

            "weeklyChart" => $weeklyChart,

            "criticalTasks" => $criticalTasks,

            "teamPerformance" => $teamPerformance,

            "recentActivities" => $recentActivities,
        ]);
    }

    private function calculateChange(float $current, float $previous) {
        if ($previous <= 0) {
            return [
                "value" => 0,
                "type" => "neutral"
            ];
        }

        $diff = $current - $previous;

        return [
            "value" => round(($diff / $previous) * 100),
            "type" => $diff > 0 ? "increase" : ($diff < 0 ? "decrease" : "neutral")
        ];
    }

    private function calculateIndex(int $completed, int $total) {
        if ($total === 0) return 0;

        $rate = $completed / $total;

        return round($rate * 10, 1); // escala 0 a 10 (igual seu 9.4)
    }

}
