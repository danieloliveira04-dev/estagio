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
import { useForm } from '@inertiajs/react';
import { ProjectColumn } from '@/types';
import { ColumnsIcon } from 'lucide-react';
import { deleteMethod as destroyColumn } from '@/routes/projects/columns';

interface ProjectColumnDeleteAlertDialogProps {
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    column?: ProjectColumn;
}

export function ProjectColumnDeleteAlertDialog({
    open,
    onOpenChange,
    column,
}: ProjectColumnDeleteAlertDialogProps) {

    const { delete: destroy, processing } = useForm();

    const handleRemoveColumn = () => {
        if (!column) return;

        destroy(
            destroyColumn({
                project: column.projectId,
                column: column.id,
            }).url,
            {
                preserveScroll: true,
                onSuccess: () => {
                    onOpenChange?.(false);
                },
            }
        );
    };

    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent size="sm">
                <AlertDialogHeader>
                    <AlertDialogMedia className="bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-destructive">
                        <ColumnsIcon />
                    </AlertDialogMedia>

                    <AlertDialogTitle>
                        Excluir coluna do projeto?
                    </AlertDialogTitle>

                    <AlertDialogDescription>
                        Você está prestes a excluir a coluna <strong>{column?.name}</strong>. 
                        Essa ação não poderá ser desfeita.
                    </AlertDialogDescription>
                </AlertDialogHeader>

                <AlertDialogFooter>
                    <AlertDialogCancel
                        variant="outline"
                        disabled={processing}
                    >
                        Voltar
                    </AlertDialogCancel>

                    <AlertDialogAction
                        variant="destructive"
                        onClick={handleRemoveColumn}
                        loading={processing}
                    >
                        Excluir coluna
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}