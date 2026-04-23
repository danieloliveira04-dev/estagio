import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuPortal, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ProjectColumn as ProjectColumnType, Task as TaskType } from "@/types";
import { ArrowLeft, ArrowRight, ArrowRightLeft, Ellipsis, Pencil, Plus, Trash2 } from "lucide-react";
import ProjectTask from "./project-task";
import { useDroppable } from "@dnd-kit/react";
import {CollisionPriority} from '@dnd-kit/abstract';

interface ProjectColumnProps {
  column: ProjectColumnType;
  onEdit: (column: ProjectColumnType) => void;
  onDelete: (column: ProjectColumnType) => void;
  onMove: (column: ProjectColumnType, move: number) => void;
  onTaskCreate: (column: ProjectColumnType) => void;
  onTaskEdit: (task: TaskType) => void;
  onTaskDelete: (task: TaskType) => void;
};

export default function ProjectColumn({
  column,
  onEdit,
  onDelete,
  onMove,
  onTaskCreate,
  onTaskEdit,
  onTaskDelete,
}: ProjectColumnProps) {
  const { ref } = useDroppable({
    id: `column-${column.id}`,
    type: 'column',
    accept: 'item',
    collisionPriority: CollisionPriority.Low,
    data: {
      columnId: column.id,
      position: column.tasks.length,
    }
  });

  return (
    <div ref={ref} className="bg-neutral-400/5 text-card-foreground border shadow-sm w-[320px] shrink-0 snap-start pb-10">

      {/* header */}
      <div className="sticky top-0 px-3 py-2 flex items-center justify-between gap-2 bg-neutral-400/10 border-b z-10">
        <h3 className="text-sm font-medium truncate">
          {column.name}
        </h3>

        <ColumnActionsMenu
          onTaskCreate={() => onTaskCreate(column)}
          onEdit={() => onEdit(column)}
          onDelete={() => onDelete(column)}
          onMoveLeft={() => onMove(column, -1)}
          onMoveRight={() => onMove(column, 1)}
        />
      </div>

      {/* tasks */}
      <div className="flex-1 overflow-y-auto space-y-3 p-1 min-h-[120px] overflow-hidden!">
        {column.tasks?.map(task => (
          <ProjectTask
            key={task.id}
            task={task}
            onClick={() => onTaskEdit(task)}
            onDelete={() => onTaskDelete(task)}
          />
        ))}
      </div>

      <div>
        <Button onClick={() => onTaskCreate(column)} type="button" variant="ghost" className="w-full justify-start rounded-none cursor-pointer">
          <Plus /> Nova tarefa
        </Button>
      </div>
    </div>
  );
}

interface ColumnActionsMenuProps {
  onTaskCreate: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onMoveLeft: () => void;
  onMoveRight: () => void;
}

function ColumnActionsMenu({ onEdit, onDelete, onMoveLeft, onMoveRight, onTaskCreate }: ColumnActionsMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={(
          <Button
            variant="ghost"
            size="icon"
            className="size-7 text-muted-foreground data-[state=open]:bg-muted"
          >
            <Ellipsis className="size-4" />
            <span className="sr-only">Abrir menu</span>
          </Button>
        )}
      />

      <DropdownMenuContent align="end" className="w-40">
        <DropdownMenuItem className="gap-2 cursor-pointer" onClick={onTaskCreate}>
          <Plus className="size-4" />
          Nova tarefa
        </DropdownMenuItem>

        <DropdownMenuItem className="gap-2 cursor-pointer" onClick={onEdit}>
          <Pencil className="size-4" />
          Editar coluna
        </DropdownMenuItem>

        <DropdownMenuSub>
          <DropdownMenuSubTrigger className="gap-2">
            <ArrowRightLeft className="size-4" />
            Mover
          </DropdownMenuSubTrigger>

          <DropdownMenuPortal>
            <DropdownMenuSubContent className="w-40">
              <DropdownMenuItem className="gap-2 cursor-pointer" onClick={onMoveLeft}>
                <ArrowLeft className="size-4" />
                Para esquerda
              </DropdownMenuItem>

              <DropdownMenuItem className="gap-2 cursor-pointer" onClick={onMoveRight}>
                <ArrowRight className="size-4" />
                Para direita
              </DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuPortal>
        </DropdownMenuSub>

        <DropdownMenuItem variant="destructive" className="gap-2 cursor-pointer" onClick={onDelete}>
          <Trash2 className="size-4" />
          Excluir coluna
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};