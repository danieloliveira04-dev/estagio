import Flash from "@/components/flash";
import Heading from "@/components/heading";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import AppLayout from "@/layouts/app-layout";
import { deleteMethod, edit, form, getDetails, list } from "@/routes/admin/roles";
import { BreadcrumbItem, FlashType, Role, User } from "@/types";
import { Head, Link, router, usePage } from "@inertiajs/react";
import { Edit, LoaderCircle, Trash } from "lucide-react";
import { useState } from "react";
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter } from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { roleTypeDescription } from "@/lib/descriptions";
import { ScrollArea } from "@/components/ui/scroll-area";

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Perfis',
        href: list().url,
    },
];

interface AdminRolesListProps {
    roles: Role[];
}

interface RoleDetails {
    role: Role;
    users: User[];
    canDelete: boolean;
}

export default function AdminRolesList({ roles }: AdminRolesListProps) {
    const { flash } = usePage().props as { flash?: FlashType };
    const [roleToDelete, setRoleToDelete] = useState<Role | null>(null);
    const [roleDetails, setRoleDetails] = useState<RoleDetails | null>(null); 
    const [loadingDetails, setLoadingDetails] = useState(false);

    const handleDeleteUser = (id: number) => {
        router.delete(deleteMethod({ id }).url, {
            onSuccess: () => {
                setRoleToDelete(null);
            },
            onError: (errors) => {
                console.error(errors);
            },
            preserveScroll: true,
            preserveState: true,
        });
    };

    const handleOpenDeleteModal = async (role: Role) => {
        setRoleToDelete(role); 
        setLoadingDetails(true);

        try {
            const res = await fetch(getDetails({id: role.id}).url);
            const data = await res.json();
            setRoleDetails(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoadingDetails(false);
        }
    };
    
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Perfis" />

            <div className="px-4 py-6">
                <Heading title="Perfis" />
            
                <Flash flash={flash} className="mb-6" />
            
                <div className="flex items-center justify-end gap-10 mb-4">
                    <Button asChild>
                        <Link href={form()}>Adicionar perfil</Link>
                    </Button>
                </div>

                <div>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-1/12">ID</TableHead>
                                <TableHead className="w-5/12">Perfil</TableHead>
                                <TableHead className="w-4/12">Tipo</TableHead>
                                <TableHead className="w-2/12"></TableHead>
                            </TableRow>
                        </TableHeader>

                        <TableBody>
                            {!roles.length && (
                                <TableRow>
                                    <TableCell colSpan={5}>
                                        <p className="text-muted-foreground text-md text-center py-3">Sem resultados encontrados</p>
                                    </TableCell>
                                </TableRow>
                            )}

                            {roles.map(role => (
                                <TableRow key={role.id}>
                                    <TableCell className="font-medium">{role.id}</TableCell>
                                    <TableCell>
                                        {role.name}   
                                    </TableCell>
                                    <TableCell>
                                        <Badge>{roleTypeDescription(role.type)}</Badge>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center justify-end gap-2">
                                            <Button size="icon" variant="outline" title="Editar" asChild>
                                                <Link href={edit({ id: role.id })} ><Edit /></Link>
                                            </Button>
                                            <Button 
                                                size="icon" 
                                                variant="destructive"
                                                title="Excluir"
                                                onClick={() => handleOpenDeleteModal(role)}
                                                disabled={roleToDelete?.id === role.id && loadingDetails}     
                                            >
                                                {roleToDelete?.id === role.id && loadingDetails ? (
                                                    <LoaderCircle size={16} className="animate-spin" />
                                                ) : (
                                                    <Trash />
                                                )}
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>

            {roleToDelete && roleDetails && (
                <AlertDialog open={!!roleToDelete} onOpenChange={(open) => { if (!open) setRoleToDelete(null) }}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                            <AlertDialogDescription>
                                Tem certeza que deseja excluir esse perfil <strong>{roleToDelete.name}</strong>? Esta ação não pode ser desfeita.
                                <div className="mt-2">
                                    <p>Qtde. usuários vinculadas: {roleDetails?.users.length}</p>
                                </div>

                                {roleDetails?.users.length > 0 && (
                                    <div className="mt-2 text-red-500">
                                        <p className="mb-1">Não é possível excluir este perfil porque ele está vinculado:</p>
                                        <ScrollArea className="h-[120px]">
                                            <ul className="list-disc ml-5">
                                                {roleDetails.users.map((u) => (
                                                    <li key={u.id}>{u.name}</li>
                                                ))}
                                            </ul>
                                        </ScrollArea>
                                    </div>
                                )}
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <Button variant="outline" onClick={() => setRoleToDelete(null)}>Cancelar</Button>
                            <Button
                                variant="destructive"
                                disabled={!roleDetails?.canDelete}
                                onClick={() => handleDeleteUser(roleToDelete.id)}
                            >
                                Excluir
                            </Button>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            )}

        </AppLayout>
    );
}