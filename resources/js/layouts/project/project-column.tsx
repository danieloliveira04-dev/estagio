import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ProjectColumn as ProjectColumnType } from "@/types";
import { Ellipsis, Pencil, Plus, Trash2 } from "lucide-react";

interface ProjectColumnProps {
    column: ProjectColumnType;
    onEdit: (column: ProjectColumnType) => void;
    onDelete: (column: ProjectColumnType) => void;
};

export default function ProjectColumn({ column, onEdit, onDelete }: ProjectColumnProps) {
    return (
        <div className="bg-card text-card-foreground rounded-xl border shadow-sm p-2 w-[320px] h-fit shrink-0">
            <div className="px-1 pt-1 pb-2 flex items-center justify-between gap-2">
                <h3 className="text-sm font-medium shrink-0">
                    {column.name}    
                </h3>

                <div>
                    <ColumnActionsMenu 
                        onEdit={() => onEdit(column)}
                        onDelete={() => onDelete(column)}
                    />  
                </div>   
            </div>

            <div className="space-y-3">
              {column.tasks?.map(task => (
                <div key={task.id} className="bg-neutral-400/10 px-2 py-1 rounded-lg">
                  <p className="text-sm mb-1">{task.description}</p>
                  <span className="text-muted-foreground text-sm italic">{task.task_status?.name}</span>
                </div>
              ))}
            </div>

            <div>

            </div>
        </div>
    );
}

interface ColumnActionsMenuProps {
    onEdit: () => void;
    onDelete: () => void;
}

function ColumnActionsMenu({ onEdit, onDelete }: ColumnActionsMenuProps) {
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

        <DropdownMenuItem variant="destructive" className="gap-2 cursor-pointer" onClick={onDelete}>
          <Trash2 className="size-4" />
          Excluir coluna
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};