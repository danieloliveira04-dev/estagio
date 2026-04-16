import Flash from "@/components/flash";
import Heading from "@/components/heading";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import AppLayout from "@/layouts/app-layout";
import { deleteMethod, edit, form, getDetails, list } from "@/routes/admin/taskStatus";
import { BreadcrumbItem, FlashType, TaskStatus, Task, PaginationResponse } from "@/types";
import { Head, Link, router, usePage } from "@inertiajs/react";
import { Edit, LoaderCircle, Search, Trash } from "lucide-react";
import { useRef, useState } from "react";
import { 
    AlertDialog, 
    AlertDialogContent, 
    AlertDialogHeader, 
    AlertDialogTitle, 
    AlertDialogDescription, 
    AlertDialogFooter 
} from "@/components/ui/alert-dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import Pagination from "@/components/pagination";

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: "Status das tarefas",
        href: list().url,
    },
];

interface AdminTaskStatusListProps {
    taskStatus: PaginationResponse<TaskStatus>;
}

interface TaskStatusDetails {
    taskStatus: TaskStatus;
    tasks: Task[];
    canDelete: boolean;
}

export default function AdminTaskStatusList({ taskStatus }: AdminTaskStatusListProps) {
    const { flash } = usePage().props as { flash?: FlashType };
    const [search, setSearch] = useState<string>('');
    const searchTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
    const [statusToDelete, setStatusToDelete] = useState<TaskStatus | null>(null);
    const [statusDetails, setStatusDetails] = useState<TaskStatusDetails | null>(null);
    const [loadingDetails, setLoadingDetails] = useState(false);

    const handleDeleteStatus = (id: number) => {
        router.delete(deleteMethod({ id }).url, {
            onSuccess: () => {
                setStatusToDelete(null);
            },
            onError: (errors) => {
                console.error(errors);
            },
            preserveScroll: true,
            preserveState: true,
        });
    };

    const handleOpenDeleteModal = async (status: TaskStatus) => {
        setStatusToDelete(status);
        setLoadingDetails(true);

        try {
            const res = await fetch(getDetails({ id: status.id }).url);
            const data = await res.json();
            setStatusDetails(data);
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

    const start = (taskStatus.current_page - 1) * taskStatus.per_page + 1;
    const end = Math.min(taskStatus.current_page * taskStatus.per_page, taskStatus.total);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Status das tarefas" />

            <div className="px-4 py-6">
                <Heading title="Status das tarefas" />

                <Flash flash={flash} className="mb-6" />

                <div className="flex items-center justify-between gap-10 mb-4">
                    <div className="relative w-[320px]">
                        <Search size={18} className="absolute top-1/2 start-2 -translate-y-1/2" />
                        <Input placeholder="Buscar por nome ou e-mail" className="ps-9" value={search} onChange={handleSearchChange} />
                    </div>

                    <Button render={
                        <Link href={form()}>Adicionar status</Link>
                    }/>
                </div>

                <div>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-1/12">ID</TableHead>
                                <TableHead className="w-7/12">Status</TableHead>
                                <TableHead className="w-4/12"></TableHead>
                            </TableRow>
                        </TableHeader>

                        <TableBody>
                            {!taskStatus.data.length && (
                                <TableRow>
                                    <TableCell colSpan={3}>
                                        <p className="text-muted-foreground text-md text-center py-3">
                                            Sem resultados encontrados
                                        </p>
                                    </TableCell>
                                </TableRow>
                            )}

                            {taskStatus.data.map((status) => (
                                <TableRow key={status.id}>
                                    <TableCell className="font-medium">{status.id}</TableCell>
                                    <TableCell>{status.name}</TableCell>
                                    <TableCell>
                                        <div className="flex items-center justify-end gap-2">
                                            <Button size="icon" variant="outline" title="Editar" render={
                                                <Link href={edit({ id: status.id })}>
                                                    <Edit />
                                                </Link>
                                            }/>
                                            <Button
                                                size="icon"
                                                variant="destructive"
                                                title="Excluir"
                                                onClick={() => handleOpenDeleteModal(status)}
                                                disabled={statusToDelete?.id === status.id && loadingDetails}
                                            >
                                                {statusToDelete?.id === status.id && loadingDetails ? (
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
                            Mostrando {start}–{end} de {taskStatus.total} usuários
                        </span>

                        <Pagination links={taskStatus.links} />
                    </div>
                </div>
            </div>

            {statusToDelete && statusDetails && (
                <AlertDialog
                    open={!!statusToDelete}
                    onOpenChange={(open) => {
                        if (!open) setStatusToDelete(null);
                    }}
                >
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                            <AlertDialogDescription>
                                Tem certeza que deseja excluir o status{" "}
                                <strong>{statusToDelete.name}</strong>? Esta ação não pode ser desfeita.
                                <div className="mt-2">
                                    <p>Qtde. tarefas vinculadas: {statusDetails?.tasks.length}</p>
                                </div>

                                {statusDetails?.tasks.length > 0 && (
                                    <div className="mt-2 text-red-500">
                                        <p className="mb-1">
                                            Não é possível excluir este status porque ele está vinculado às tarefas:
                                        </p>
                                        <ScrollArea className="h-[120px]">
                                            <ul className="list-disc ml-5">
                                                {statusDetails.tasks.map((t) => (
                                                    <li key={t.id}>{t.title}</li>
                                                ))}
                                            </ul>
                                        </ScrollArea>
                                    </div>
                                )}
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <Button variant="outline" onClick={() => setStatusToDelete(null)}>
                                Cancelar
                            </Button>
                            <Button
                                variant="destructive"
                                disabled={!statusDetails?.canDelete}
                                onClick={() => handleDeleteStatus(statusToDelete.id)}
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
