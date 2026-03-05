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
import { ProjectMember } from '@/types';
import { UserMinusIcon } from 'lucide-react';
import { deleteMethod } from '@/routes/projects/members';

interface ProjectMemberRemoveAlertDialogProps {
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    member?: ProjectMember;
}

export function ProjectMemberRemoveAlertDialog({open, onOpenChange, member}: ProjectMemberRemoveAlertDialogProps) {

    const { delete: destroy, processing } = useForm();

    const handleRemoveMember = () => {
        if (!member) return;

        destroy(deleteMethod({project: member.projectId, member: member.id }).url, {
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
                        <UserMinusIcon />
                    </AlertDialogMedia>

                    <AlertDialogTitle>
                        Remover membro do projeto?
                    </AlertDialogTitle>

                    <AlertDialogDescription>
                        Você está prestes a remover <strong>{member?.user?.name}</strong> do projeto. Essa ação removerá o acesso imediatamente.
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
                        onClick={handleRemoveMember}
                        disabled={processing}
                    >
                        {processing ? 'Removendo...' : 'Remover membro'}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}