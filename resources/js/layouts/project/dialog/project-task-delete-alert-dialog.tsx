import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogMedia,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { deleteMethod as destroyTask } from '@/routes/projects/tasks';
import { Task } from '@/types';
import { useForm } from '@inertiajs/react';
import { Trash2 } from 'lucide-react';

interface ProjectTaskDeleteAlertDialogProps {
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    task?: Task;
}

export function ProjectTaskDeleteAlertDialog({ open, onOpenChange, task }: ProjectTaskDeleteAlertDialogProps) {
    const { delete: destroy, processing } = useForm();

    const handleRemoveTask = () => {
        if (!task) return;

        destroy(destroyTask({ project: task.projectId, task: task.id }).url, {
            preserveScroll: true,
            onSuccess: () => {
                onOpenChange?.(false);
            },
        });
    };

    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent size="sm">
                <AlertDialogHeader>
                    <AlertDialogMedia className="bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-destructive">
                        <Trash2 />
                    </AlertDialogMedia>


                    <AlertDialogTitle>Excluir tarefa?</AlertDialogTitle>

                    <AlertDialogDescription>
                        Você está prestes a excluir a tarefa <strong>#{task?.id} {task?.title}</strong>. Essa ação não poderá ser desfeita.
                    </AlertDialogDescription>
                </AlertDialogHeader>

                <AlertDialogFooter>
                    <AlertDialogCancel variant="outline" disabled={processing}>
                        Voltar
                    </AlertDialogCancel>

                    <AlertDialogAction variant="destructive" onClick={handleRemoveTask} loading={processing}>
                        Excluir tarefa
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
