import { cn, formatDateSmart } from "@/lib/utils";
import { TASK_HISTORY_ACTION, TaskHistory } from "@/types";

export interface TaskHistoryItemProps {
  taskHistory: TaskHistory;
}

export function TaskHistoryItem({ taskHistory }: TaskHistoryItemProps) {
  const taskCode = (
    <strong className="text-blue-500">{taskHistory.task.code}</strong>
  );

  const actionMap = {
    [TASK_HISTORY_ACTION.CREATED]: {
      color: "bg-blue-500 ring-blue-500",
      text: "criou a tarefa",
    },
    [TASK_HISTORY_ACTION.UPDATED]: {
      color: "bg-gray-400 ring-gray-400",
      text: "atualizou a tarefa",
    },
    [TASK_HISTORY_ACTION.STATUS_CHANGED]: {
      color: "bg-purple-500 ring-purple-500",
      text: "alterou o status da tarefa",
    },
    [TASK_HISTORY_ACTION.ASSIGNED]: {
      color: "bg-indigo-500 ring-indigo-500",
      text: "atribuiu a tarefa",
    },
    [TASK_HISTORY_ACTION.REASSIGNED]: {
      color: "bg-indigo-500 ring-indigo-500",
      text: "reatribuiu a tarefa",
    },
    [TASK_HISTORY_ACTION.UNASSIGNED]: {
      color: "bg-gray-400 ring-gray-400",
      text: "removeu o responsável da tarefa",
    },
    [TASK_HISTORY_ACTION.COMMENTED]: {
      color: "bg-slate-500 ring-slate-500",
      text: "comentou na tarefa",
    },
    [TASK_HISTORY_ACTION.PRIORITY_CHANGED]: {
      color: "bg-orange-500 ring-orange-500",
      text: "alterou a prioridade da tarefa",
    },
    [TASK_HISTORY_ACTION.DUE_DATE_CHANGED]: {
      color: "bg-pink-500 ring-pink-500",
      text: "alterou a data de entrega da tarefa",
    },
    [TASK_HISTORY_ACTION.ARCHIVED]: {
      color: "bg-zinc-500 ring-zinc-500",
      text: "arquivou a tarefa",
    },
    [TASK_HISTORY_ACTION.RESTORED]: {
      color: "bg-green-500 ring-green-500",
      text: "restaurou a tarefa",
    },
    [TASK_HISTORY_ACTION.DELETED]: {
      color: "bg-red-500 ring-red-500",
      text: "excluiu a tarefa",
    },
    [TASK_HISTORY_ACTION.COMPLETED]: {
      color: "bg-emerald-500 ring-emerald-500",
      text: "finalizou a tarefa",
    },
    [TASK_HISTORY_ACTION.CANCELLED]: {
      color: "bg-red-700 ring-red-700",
      text: "cancelou a tarefa",
    },
  } satisfies Record<
    (typeof TASK_HISTORY_ACTION)[keyof typeof TASK_HISTORY_ACTION],
    { color: string; text: string }
  >;

  const action = actionMap[taskHistory.action];

  const dotClass = action?.color ?? "bg-gray-400 ring-gray-400";

  return (
    <div className="relative flex items-start gap-3 pb-3">
      <div
        className={cn(
          "size-2 ring-2 ring-offset-2 rounded-full mt-1.5 ml-2",
          dotClass
        )}
      ></div>
      <div className="absolute top-4.5 left-2.5 h-full w-0.5 bg-neutral-200"></div>

      <div className="text-sm flex flex-col">
        {action && (
          <p>
            <strong>{taskHistory.user.name}</strong> {action.text} {taskCode}
          </p>
        )}

        <span className="text-xs text-muted-foreground">
          {formatDateSmart(taskHistory.created_at)}
        </span>
      </div>
    </div>
  );
}