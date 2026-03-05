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
import { deleteInvite } from '@/routes/projects/members';
import { ProjectInvitation } from '@/types';
import { useForm } from '@inertiajs/react';
import { Trash2Icon } from 'lucide-react';

interface ProjectInviteMemberCancelAlertDialogProps {
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    invite?: ProjectInvitation;
}

export function ProjectInviteMemberCancelAlertDialog({open, onOpenChange, invite}: ProjectInviteMemberCancelAlertDialogProps) {
    
    const { delete: destroy, processing } = useForm();

    const handleCancelInvite = () => {
        if(!invite?.id) return;

        destroy(deleteInvite({project: invite.projectId, invitation: invite.id }).url, {
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
                        <Trash2Icon />
                    </AlertDialogMedia>
                    <AlertDialogTitle>Cancelar convite?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Você está prestes a cancelar o convite enviado para <strong>{invite?.user?.name || invite?.invitation?.email || 'Desconhecido'}</strong>
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel variant="outline" disabled={processing}>Voltar</AlertDialogCancel>
                    <AlertDialogAction variant="destructive" onClick={handleCancelInvite} disabled={processing}>
                        {processing ? 'Cancelando...' : 'Cancelar'}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
