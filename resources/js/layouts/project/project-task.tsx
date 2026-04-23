import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDate } from "@/lib/utils";
import { Task } from "@/types";
import { Clock, Ellipsis, Trash2, User } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { PopoverComboboxUser } from "@/components/popover-combobox-user";
import { useInitials } from "@/hooks/use-initials";
import { useForm } from "@inertiajs/react";
import { useEffect } from "react";
import tasks from "@/routes/projects/tasks";
import { useSortable } from "@dnd-kit/react/sortable";

interface ProjectTaskProps {
    task: Task;
    onClick?: () => void;
    onDelete?: () => void;
};

export default function ProjectTask({task, onClick, onDelete}: ProjectTaskProps) {
    const getInitials = useInitials();

    const {ref, isDragging} = useSortable({
        id: task.id,
        index: task.position,
        type: 'item',
        accept: 'item',
        group: `column-${task.projectColumnId}`,
        data: {
            position: task.position,
            columnId: task.projectColumnId,
        },
    });

    const {data, setData, post, processing} = useForm({
        _method: 'put',
        projectMemberId: task.projectMemberId, 
        
    });

    useEffect(() => {
        if(data.projectMemberId != task.projectMemberId) {
            post(tasks.update({ project: task.projectId, task: task.id }).url, {
                preserveScroll: true,
            });
        }
    }, [data]);

    return (
        <div ref={ref} data-dragging={isDragging} className="bg-card shadow p-3 space-y-1 cursor-pointer hover:bg-neutral-200/10" onClick={onClick}>
            <div className="flex items-start gap-1">
                <h3 className="text-sm py-1 grow">{task.title}</h3>

                <TaskActionsMenu
                    onDelete={onDelete}
                />
            </div>

            {task.endDate && (
                <div>
                    <p className="inline-flex items-center gap-1 px-1.5 py-1 text-xs font-semibold bg-amber-100 text-amber-500">
                        <Clock className="size-3.5" />
                        <span>{formatDate(task.endDate, "dd 'de' LLL'.' 'de' yyyy")}</span>
                    </p>
                </div>
            )}

            {task.tags && (
                <div className="flex flex-wrap gap-2 my-2">
                    {task.tags.map(tag => (
                        <p className="inline-flex items-center gap-1 px-1.5 py-1 text-xs font-semibold bg-neutral-100 text-neutral-500">
                            {tag.name}
                        </p>
                    ))}
                </div>
            )} 

            <div className="flex items-end justify-between">
                <span className="text-xs font-medium text-muted-foreground tracking-widest">{task.code}</span>

                <PopoverComboboxUser value={task.projectMemberId} onChange={(value) => setData('projectMemberId', value ? value : undefined)} showInput>
                    {(user) => {
                        if(!user) {
                            return (
                                <Avatar className="size-7">
                                    <AvatarFallback className="bg-muted text-muted-foreground">
                                        <User className="size-4" />
                                    </AvatarFallback>
                                </Avatar>
                            );
                        }

                        return (
                            <Avatar className="size-7">
                                <AvatarImage src={user.photo} alt={user.name} />
                                <AvatarFallback className="bg-muted text-muted-foreground">{getInitials(user.name)}</AvatarFallback>
                            </Avatar>
                        );
                    }}
                </PopoverComboboxUser>
            </div>
        </div>
    );
}

//--

interface TaskActionsMenuProps {
    onDelete?: () => void;
}

function TaskActionsMenu({
    onDelete,
}: TaskActionsMenuProps) {
    const handleClick = (e: React.MouseEvent, callback?: () => void ) => {
        e.stopPropagation();
        callback?.();
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger 
                render={(
                    <Button
                        variant="ghost"
                        size="icon"
                        className="size-7 text-muted-foreground data-[state=open]:bg-muted shrink-0"
                        onClick={(e) => handleClick(e, () => {})}
                    >
                        <Ellipsis className="size-4" />
                        <span className="sr-only">Abrir menu</span>
                    </Button>
                )}
            />

            <DropdownMenuContent align="end" className="w-40">
                <DropdownMenuItem variant="destructive" className="gap-2 cursor-pointer" onClick={(e) => handleClick(e, onDelete)}>
                    <Trash2 className="size-4" />
                    Excluir tarefa
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}