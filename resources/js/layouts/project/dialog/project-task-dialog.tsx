import { ComboboxMultiple } from '@/components/combobox-multiple';
import { DateRangePicker } from '@/components/date-range-picker';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { mapWithKeys } from '@/lib/utils';
import { store, update } from '@/routes/projects/tasks';
import { Tag, Task } from '@/types';
import { useForm } from '@inertiajs/react';
import { useEffect } from 'react';

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
};

export function ProjectTaskDialog({ open, onOpenChange, projectId, task, tags }: ProjectTaskDialogProps) {
    const isEditing = !!task;

    const { data, setData, reset, errors, processing, post, put } = useForm<TaskForm>({
        projectColumnId: undefined,
        title: '',
        description: '',
        startDate: undefined,
        endDate: undefined,
        tags: [],
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
            });
        } else {
            reset();
        }
    }, [task, setData, reset]);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>

            <DialogContent className="sm:max-w-3xl">
                <DialogHeader className="mb-2">
                     <DialogTitle>
                        {isEditing ? "Editar tarefa" : "Criar tarefa"}
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={submit} className="space-y-6">
                    <div className="flex gap-6">
                        <div className="w-7/12 space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="title">Título *</Label>
                                <Input name="title" value={data.title} onChange={(e) => setData('title', e.target.value)} required />
                                <InputError message={errors.title} />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description">Descrição</Label>
                                <Textarea name="description" value={data.description} onChange={(e) => setData('description', e.target.value)} />
                            </div>
                        </div>

                        <div className="w-5/12 shrink-0">
                            <Card className="py-4">
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="tags">Tags</Label>

                                        <ComboboxMultiple
                                            items={mapWithKeys(tags, (item) => ([item.id, item.name]))}
                                            value={data.tags}
                                            onChange={(value) => setData('tags', value)}
                                        />
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
