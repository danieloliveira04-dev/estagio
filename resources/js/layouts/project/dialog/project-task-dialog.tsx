import { ComboboxMultiple } from '@/components/combobox-multiple';
import { DateRangePicker } from '@/components/date-range-picker';
import InputError from '@/components/input-error';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useInitials } from '@/hooks/use-initials';
import { mapWithKeys } from '@/lib/utils';
import { store, update } from '@/routes/projects/tasks';
import { Tag, Task } from '@/types';
import { useForm } from '@inertiajs/react';
import { User } from 'lucide-react';
import { useEffect, useState } from 'react';
import { getTask } from '@/services/tasks';
import { TaskHistoryItem } from '@/components/task-history-item';
import { PopoverComboboxProjectMember } from '@/components/popover-combobox-project-member';

interface ProjectTaskDialogProps {
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    projectId: number;
    task?: Task;
    tags: Tag[];
}

type TaskForm = {
    projectColumnId?: number;
    title: string;
    description: string;
    startDate?: Date;
    endDate?: Date;
    tags: string[];
    projectMemberId?: number,
};

export function ProjectTaskDialog({ open, onOpenChange, projectId, task, tags }: ProjectTaskDialogProps) {
    const getInitials = useInitials();

    const isEditing = !!task;

    const { data, setData, reset, errors, processing, post, put } = useForm<TaskForm>({
        projectColumnId: undefined,
        title: '',
        description: '',
        startDate: undefined,
        endDate: undefined,
        tags: [],
        projectMemberId: undefined,
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();

        if(task?.id) {
            put(update({project: projectId, task: task.id}).url, {
                preserveScroll: true,
                onSuccess: () => {
                    onOpenChange?.(false);
                },
            });
        } else {
            post(store(projectId).url, {
                preserveScroll: true,
                onSuccess: () => {
                    onOpenChange?.(false);
                },
            });
        }
    };

    useEffect(() => {
        if (task) {
            setData({
                projectColumnId: task?.projectColumnId,
                title: task.title || '',
                description: task.description || '',
                startDate: task.startDate ? new Date(task.startDate) : undefined,
                endDate: task.endDate ? new Date(task.endDate) : undefined,
                tags: task.tags?.map((item) => String(item.id)) || [],
                projectMemberId: task.projectMemberId,
            });
        } else {
            reset();
        }
    }, [task, setData, reset]);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>

            <DialogContent className="sm:max-w-6xl">
                <DialogHeader className="mb-2">
                     <DialogTitle>
                        {isEditing ? "Editar tarefa" : "Criar tarefa"}
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={submit} className="space-y-6">
                    <div className="flex gap-6">
                        <div className="w-8/12 space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="title">Título *</Label>
                                <Input name="title" value={data.title} onChange={(e) => setData('title', e.target.value)} required />
                                <InputError message={errors.title} />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description">Descrição</Label>
                                <Textarea name="description" value={data.description} onChange={(e) => setData('description', e.target.value)} />
                            </div>

                            <div className="space-y-2">
                                <h3 className="text-sm font-semibold">Histórico</h3>
                                {task && <ProjectTaskHistory task={task} />}
                            </div>
                        </div>

                        <div className="w-4/12 shrink-0">
                            <Card className="py-4">
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="projectMemberId">Responsável</Label>
                                        <PopoverComboboxProjectMember
                                            projectId={projectId}
                                            value={data.projectMemberId}
                                            onChange={(value) => setData('projectMemberId', value ?? undefined)}
                                            className="w-full"
                                            showInput
                                        >
                                            {(projectMember) => {
                                                const isEmpty = !projectMember;

                                                return (
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        nativeButton={false}
                                                        render={<div />}
                                                        className="flex items-center justify-start gap-2 px-1 py-0.5 h-fit"
                                                    >
                                                        <Avatar className="size-7">
                                                            {isEmpty ? (
                                                                <AvatarFallback className="bg-muted text-muted-foreground">
                                                                    <User className="size-4" />
                                                                </AvatarFallback>
                                                            ) : (
                                                                <>
                                                                    <AvatarImage src={projectMember.user.photo ?? undefined} alt={projectMember.user.name} />
                                                                    <AvatarFallback className="bg-muted text-muted-foreground">
                                                                        {getInitials(projectMember.user.name)}
                                                                    </AvatarFallback>
                                                                </>
                                                            )}
                                                        </Avatar>

                                                        <span className="font-medium truncate">
                                                            {isEmpty ? 'Não atribuído' : projectMember.user.name}
                                                        </span>
                                                    </Button>
                                                );
                                            }}
                                        </PopoverComboboxProjectMember>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="endDate">Prazo</Label>

                                        <DateRangePicker
                                            value={
                                                data.startDate || data.endDate
                                                    ? {
                                                          from: data.startDate,
                                                          to: data.endDate,
                                                      }
                                                    : undefined
                                            }
                                            onChange={(range) => {
                                                setData('startDate', range?.from);
                                                setData('endDate', range?.to);
                                            }}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="tags">Tags</Label>

                                        <ComboboxMultiple
                                            items={mapWithKeys(tags, (item) => ([item.id, item.name]))}
                                            value={data.tags}
                                            onChange={(value) => setData('tags', value)}
                                        />
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>

                    <DialogFooter className="mt-6">
                        <DialogClose render={(
                            <Button variant="outline">
                                Cancelar
                            </Button>
                        )}/>

                        <Button type="submit" loading={processing}>
                            {isEditing ? "Salvar alterações" : "Criar tarefa"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

interface ProjectTaskHistoryProps {
    task: Task;
}

function ProjectTaskHistory({ task: {id, projectId} }: ProjectTaskHistoryProps) {
    const [task, setTask] = useState<Task>();

    useEffect(() => {
        const get = async () => {
            const { data } = await getTask(projectId, id);
            setTask(data);
        };

        get();
    }, []);

    return (
        <div className="space-y-2 [&>*]:last-of-type:pb-0! max-h-[140px] overflow-auto">
            {task?.task_history.map((item) => (
                <TaskHistoryItem key={item.id} taskHistory={item} />
            ))}
        </div>
    );
}
