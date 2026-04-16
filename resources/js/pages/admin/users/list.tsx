import Flash from "@/components/flash";
import Heading from "@/components/heading";
import Pagination from "@/components/pagination";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import AppLayout from "@/layouts/app-layout";
import { deleteMethod, edit, list } from "@/routes/admin/users";
import invite from "@/routes/admin/users/invite";
import { BreadcrumbItem, FlashType, PaginationResponse, Project, User } from "@/types";
import { Head, Link, router, usePage } from "@inertiajs/react";
import { Edit, LoaderCircle, Mail, Phone, Search, Trash } from "lucide-react";
import { useRef, useState } from "react";
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter } from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import admin from "@/routes/admin";

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Usuários',
        href: list().url,
    },
];

interface AdminUsersListProps {
    users: PaginationResponse<User>;
}

interface UserDetails {
    user: User;
    projects: Project[];
    projectsCount: number;
    tasksCount: number;
    projectsBlocked: Project[];
    canDelete: boolean;
}

export default function AdminUsersList({ users }: AdminUsersListProps) {
    const { flash } = usePage().props as { flash?: FlashType };
    const [search, setSearch] = useState<string>('');
    const searchTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
    const [userToDelete, setUserToDelete] = useState<User | null>(null);
    const [userDetails, setUserDetails] = useState<UserDetails | null>(null); 
    const [loadingDetails, setLoadingDetails] = useState(false);

    const handleDeleteUser = (id: number) => {
        router.delete(deleteMethod({ id }).url, {
            onSuccess: () => {
                setUserToDelete(null);
            },
            onError: (errors) => {
                console.error(errors);
            },
            preserveScroll: true,
            preserveState: true,
        });
    };

    const handleOpenDeleteModal = async (user: User) => {
        setUserToDelete(user); 
        setLoadingDetails(true);

        try {
            const res = await fetch(admin.users.getDetails({id: user.id}).url);
            const data = await res.json();
            setUserDetails(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoadingDetails(false);
        }
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearch(value);

        if (searchTimeout.current) {
            clearTimeout(searchTimeout.current);
        }

        searchTimeout.current = setTimeout(() => {
            router.get(list().url, { search: value }, { preserveState: true, replace: true });
        }, 500);
    };

    const start = (users.current_page - 1) * users.per_page + 1;
    const end = Math.min(users.current_page * users.per_page, users.total);
    
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Usuários" />

            <div className="px-4 py-6">
                <Heading title="Usuários" />
            
                <Flash flash={flash} className="mb-6" />
            
                <div className="flex items-center justify-between gap-10 mb-4">
                    <div className="relative w-[320px]">
                        <Search size={18} className="absolute top-1/2 start-2 -translate-y-1/2" />
                        <Input placeholder="Buscar por nome ou e-mail" className="ps-9" value={search} onChange={handleSearchChange} />
                    </div>

                    <Button render={
                        <Link href={invite.form()}>Adicionar usuário</Link>
                    }/>
                </div>

                <div>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-1/12">ID</TableHead>
                                <TableHead className="w-5/12">Usuário</TableHead>
                                <TableHead className="w-2/12">Perfil</TableHead>
                                <TableHead className="w-2/12">Status</TableHead>
                                <TableHead className="w-2/12"></TableHead>
                            </TableRow>
                        </TableHeader>

                        <TableBody>
                            {!users.data.length && (
                                <TableRow>
                                    <TableCell colSpan={5}>
                                        <p className="text-muted-foreground text-md text-center py-3">Sem resultados encontrados</p>
                                    </TableCell>
                                </TableRow>
                            )}

                            {users.data.map(user => (
                                <TableRow key={user.id}>
                                    <TableCell className="font-medium">{user.id}</TableCell>
                                    <TableCell>
                                        <div className="flex items-start gap-3">
                                            <Avatar >
                                                <AvatarImage src={user.photo} />
                                                <AvatarFallback>{user.name[0]}</AvatarFallback>
                                            </Avatar>

                                            <div className="mt-px">
                                                <h3 className="text-lg font-medium">{user.name}</h3>
                                                <p className="text-sm text-muted-foreground flex items-center gap-2 mb-1"><Mail size={16} /> {user.email}</p>
                                                {user.phone && (
                                                    <p className="text-sm text-muted-foreground flex items-center gap-2"><Phone size={16} /> {user.phone}</p>
                                                )}
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge>{user.role.name}</Badge>
                                    </TableCell>
                                    <TableCell>
                                        <span className={cn("block w-2 h-2 rounded-full", user.status == 'active' ? 'bg-green-500' : 'bg-red-500')}></span>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center justify-end gap-2">
                                            <Button size="icon" variant="outline" title="Editar" render={
                                                <Link href={edit({ id: user.id })} ><Edit /></Link>
                                            }/>
                                            <Button 
                                                size="icon" 
                                                variant="destructive"
                                                title="Excluir"
                                                onClick={() => handleOpenDeleteModal(user)}
                                                disabled={userToDelete?.id === user.id && loadingDetails}     
                                            >
                                                {userToDelete?.id === user.id && loadingDetails ? (
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
                    
                    <div className="flex items-center justify-between mt-4">
                        <span className="text-muted-foreground flex-1 text-sm">
                            Mostrando {start}–{end} de {users.total} usuários
                        </span>

                        <Pagination links={users.links} />
                    </div>
                </div>
            </div>

            {userToDelete && userDetails && (
                <AlertDialog open={!!userToDelete} onOpenChange={(open) => { if (!open) setUserToDelete(null) }}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                            <AlertDialogDescription>
                                Tem certeza que deseja excluir o usuário <strong>{userToDelete.name}</strong>? Esta ação não pode ser desfeita.
                                <div className="mt-2">
                                    <p>Projetos vinculados: {userDetails?.projectsCount}</p>
                                    <p>Tarefas vinculadas: {userDetails?.tasksCount}</p>
                                </div>

                                {userDetails?.projectsBlocked.length > 0 && (
                                    <div className="mt-2 text-red-500">
                                        <p className="mb-1">Não é possível excluir este usuário porque ele é gestor dos seguintes projetos sem outros gestores:</p>
                                        <ul className="list-disc ml-5">
                                            {userDetails.projectsBlocked.map((p) => (
                                                <li key={p.id}>{p.name}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <Button variant="outline" onClick={() => setUserToDelete(null)}>Cancelar</Button>
                            <Button
                                variant="destructive"
                                disabled={!userDetails?.canDelete}
                                onClick={() => handleDeleteUser(userToDelete.id)}
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