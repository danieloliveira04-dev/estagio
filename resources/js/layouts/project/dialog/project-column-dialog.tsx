import InputError from '@/components/input-error';
import { Select } from '@/components/select';
import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { mapWithKeys } from '@/lib/utils';
import { store, update } from '@/routes/projects/columns';
import { ProjectColumn, TaskStatus } from '@/types';
import { useForm } from '@inertiajs/react';
import { useEffect } from 'react';

interface ProjectColumnDialogProps {
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    projectId: number;
    column?: ProjectColumn;
    taskStatus: TaskStatus[];
}

export function ProjectColumnDialog({open, onOpenChange, projectId, column, taskStatus}: ProjectColumnDialogProps) {

    const isEditing = !!column;

    const {data, setData, errors, processing, post, put} = useForm({
        name: column?.name,
        taskStatusId: column?.taskStatusId,
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();

        if(column) {
            put(update({project: projectId, column: column.id}).url, {
                preserveScroll: true,
                onSuccess: () => {
                    onOpenChange?.(false);
                },
            });
        } else {
            post(store({project: projectId}).url, {
                preserveScroll: true,
                onSuccess: () => {
                    onOpenChange?.(false);
                },
            });
        }
    };

    useEffect(() => {
        if(column) {
            setData(column);
        }
    }, [column, setData]); 

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-sm">
                <form onSubmit={submit} className="space-y-4">
                        <DialogHeader>
                            <DialogTitle>
                                {isEditing ? "Editar coluna" : "Criar coluna"}
                            </DialogTitle>

                            <DialogDescription>
                                {isEditing
                                    ? "Atualize as informações desta coluna."
                                    : "Crie uma nova coluna para organizar as tarefas do projeto."}
                            </DialogDescription>
                        </DialogHeader>

                        <div className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="name">Nome *</Label>
                                <Input 
                                    name="name"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    required
                                />
                                <InputError message={errors.name} />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="taskStatusId">Status</Label>
                                <Select 
                                    name="taskStatusId"
                                    value={data.taskStatusId ? String(data.taskStatusId) : undefined}
                                    onValueChange={(value) => setData('taskStatusId', value ? parseInt(value) : undefined)}
                                    items={mapWithKeys(taskStatus, (status) => [status.id, status.name])}
                                    placeholder="Selecione um status"
                                    required
                                />
                                <InputError message={errors.taskStatusId} />
                            </div>


                        </div>

                        <DialogFooter className="mt-6">
                            <DialogClose asChild>
                                <Button variant="outline">
                                    Cancelar
                                </Button>
                            </DialogClose>

                            <Button type="submit" loading={processing}>
                                {isEditing ? "Salvar alterações" : "Criar coluna"}
                            </Button>
                        </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}