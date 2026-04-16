import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ProjectMember, Role } from "@/types";
import { useForm } from "@inertiajs/react";
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select } from '@/components/select';
import { mapWithKeys } from '@/lib/utils';
import InputError from '@/components/input-error';
import { update } from '@/routes/projects/members';
import { useEffect } from 'react';

interface ProjectMemberDialogProps {
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    roles: Role[];
    member?: ProjectMember;
}

export function ProjectMemberDialog({open, onOpenChange, roles, member}: ProjectMemberDialogProps) {
    
    const { data, setData, errors, processing, put } = useForm({
        roleId: member?.roleId,
        description: member?.description,
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();

        if(!member) return;

        put(update({project: member.projectId, member: member.id }).url, {
            preserveScroll: true,
            onSuccess: () => {
                onOpenChange?.(false);
            },
        });
    }

    useEffect(() => {
        if(member)
            setData(member);
    }, [member, setData]);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <form onSubmit={submit}>
                <DialogContent className="sm:max-w-xl">
                    <DialogHeader>
                        <DialogTitle>Editar membro do projeto</DialogTitle>
                        <DialogDescription>
                            Atualize as informações e permissões deste membro no projeto.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="roleId">Função *</Label>
                            <Select 
                                name="roleId"
                                value={String(data.roleId)}
                                onValueChange={(value) => value && setData('roleId', parseInt(value))}
                                items={mapWithKeys(roles, (role) => [role.id, role.name])}
                                placeholder="Selecione uma função"
                                required
                            />
                            <InputError message={errors.roleId} />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description">Papel</Label>
                            <Textarea value={data.description} onChange={(e) => setData('description', e.target.value)} />
                            <InputError message={errors.description} />
                        </div>
                    </div>

                    <DialogFooter className="mt-6">
                        <DialogClose render={
                            <Button variant="outline">Voltar</Button>
                        }/>

                        <Button type="submit" onClick={submit} disabled={processing}>
                            {processing ? 'Salvando...' : 'Salvar'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </form>
        </Dialog>
    );
}