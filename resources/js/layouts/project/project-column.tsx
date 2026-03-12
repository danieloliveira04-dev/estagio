import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuPortal, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ProjectColumn as ProjectColumnType } from "@/types";
import { ArrowLeft, ArrowRight, ArrowRightLeft, Ellipsis, Pencil, Plus, Trash2 } from "lucide-react";

interface ProjectColumnProps {
    column: ProjectColumnType;
    onEdit: (column: ProjectColumnType) => void;
    onDelete: (column: ProjectColumnType) => void;
    onMove: (column: ProjectColumnType, move: number) => void;
};

export default function ProjectColumn({ column, onEdit, onDelete, onMove }: ProjectColumnProps) {
    return (
        <div className="bg-card text-card-foreground rounded-xl border shadow-sm w-[320px] shrink-0 snap-start max-h-full">
          
          {/* header */}
          <div className="sticky top-0 px-3 py-2 flex items-center justify-between gap-2 bg-card rounded-t-xl border-b z-10">
              <h3 className="text-sm font-medium truncate">
                  {column.name}
              </h3>

              <ColumnActionsMenu 
                  onEdit={() => onEdit(column)}
                  onDelete={() => onDelete(column)}
                  onMoveLeft={() => onMove(column, -1)}
                  onMoveRight={() => onMove(column, 1)}
              />
          </div>

          {/* tasks */}
          <div className="flex-1 overflow-y-auto space-y-3 p-2">
              {column.tasks?.map(task => (
                  <div key={task.id} className="bg-neutral-400/10 px-2 py-1 rounded-lg">
                      <p className="text-sm mb-1">{task.description}</p>
                      <span className="text-muted-foreground text-xs italic">
                          {task.task_status?.name}
                      </span>
                  </div>
              ))}

               {column.tasks?.map(task => (
                  <div key={task.id} className="bg-neutral-400/10 px-2 py-1 rounded-lg">
                      <p className="text-sm mb-1">{task.description}</p>
                      <span className="text-muted-foreground text-xs italic">
                          {task.task_status?.name}
                      </span>
                  </div>
              ))}
          </div>

          {/* footer */}
          <div className="border-t">
            <Button type="button" variant="ghost" className="w-full justify-start">
                <Plus /> Nova tarefa
            </Button>
              {/* <button className="text-sm text-muted-foreground hover:text-foreground">
                  + Nova tarefa
              </button> */}
          </div>

      </div>
    );
}

interface ColumnActionsMenuProps {
    onEdit: () => void;
    onDelete: () => void;
    onMoveLeft: () => void;
    onMoveRight: () => void;
}

function ColumnActionsMenu({ onEdit, onDelete, onMoveLeft, onMoveRight }: ColumnActionsMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="size-7 text-muted-foreground data-[state=open]:bg-muted"
        >
          <Ellipsis className="size-4" />
          <span className="sr-only">Abrir menu</span>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-40">
        <DropdownMenuItem className="gap-2 cursor-pointer">
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