import Flash from "@/components/flash";
import Heading from "@/components/heading";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import AppLayout from "@/layouts/app-layout";
import { terminate, edit, form, getDetails, list } from "@/routes/admin/projects";
import { BreadcrumbItem, FlashType, Project, PaginationResponse } from "@/types";
import { Head, Link, router, usePage } from "@inertiajs/react";
import { Edit, LoaderCircle, Search, SquareX } from "lucide-react";
import { useRef, useState } from "react";
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogDescription,
    AlertDialogFooter,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import Pagination from "@/components/pagination";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {show} from "@/routes/projects";

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: "Projetos",
        href: list().url,
    },
];

interface AdminProjectListProps {
    projects: PaginationResponse<Project>;
}

interface ProjectDetails {
    project: Project;
    pendingTasks: number;
}

export default function AdminProjectList({ projects }: AdminProjectListProps) {
    const { flash } = usePage().props as { flash?: FlashType };

    const [search, setSearch] = useState("");
    const searchTimeout = useRef<NodeJS.Timeout | null>(null);

    const [projectToClose, setProjectToClose] = useState<Project | null>(null);
    const [projectDetails, setProjectDetails] = useState<ProjectDetails | null>(null);
    const [loadingDetails, setLoadingDetails] = useState(false);

    const [closeReason, setCloseReason] = useState("");

    /** 🔎 Busca */
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearch(value);

        if (searchTimeout.current) clearTimeout(searchTimeout.current);

        searchTimeout.current = setTimeout(() => {
            router.get(list().url, { search: value }, { preserveState: true, replace: true });
        }, 500);
    };

    /** 📌 Abrir modal para encerrar */
    const handleOpenCloseModal = async (projectItem: Project) => {
        setProjectToClose(projectItem);
        setLoadingDetails(true);

        try {
            const res = await fetch(getDetails({ id: projectItem.id }).url);
            const data = await res.json();
            setProjectDetails(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoadingDetails(false);
        }
    };

    /** Encerrar projeto */
    const handleCloseProject = (id: number, reason: string) => {
        router.post(
            terminate({ project: id }).url,
            { reason },
            {
                onSuccess: () => {
                    setProjectToClose(null);
                    setCloseReason("");
                },
                preserveScroll: true,
            }
        );
    };

    const start = (projects.current_page - 1) * projects.per_page + 1;
    const end = Math.min(projects.current_page * projects.per_page, projects.total);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Projetos" />

            <div className="px-4 py-6">
                <Heading title="Projetos" />
                <Flash flash={flash} className="mb-6" />

                {/* 🔎 Campo de busca + botão adicionar */}
                <div className="flex items-center justify-between gap-10 mb-4">
                    <div className="relative w-[320px]">
                        <Search size={18} className="absolute top-1/2 start-2 -translate-y-1/2" />
                        <Input
                            placeholder="Buscar por nome"
                            className="ps-9"
                            value={search}
                            onChange={handleSearchChange}
                        />
                    </div>

                    <Button asChild>
                        <Link href={form()}>Adicionar projeto</Link>
                    </Button>
                </div>

                {/* 📋 Tabela de projetos */}
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-1/12">ID</TableHead>
                            <TableHead className="w-3/12">Nome</TableHead>
                            <TableHead className="w-2/12">Cliente</TableHead>
                            <TableHead className="w-2/12">Status</TableHead>
                            <TableHead className="w-2/12">Prazo</TableHead>
                            <TableHead className="w-2/12"></TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {!projects.data.length && (
                            <TableRow>
                                <TableCell colSpan={5}>
                                    <p className="text-muted-foreground text-md text-center py-3">
                                        Sem resultados encontrados
                                    </p>
                                </TableCell>
                            </TableRow>
                        )}

                        {projects.data.map((proj) => (
                            <TableRow key={proj.id}>
                                <TableCell className="font-medium">{proj.id}</TableCell>
                                <TableCell>
                                    <Link href={show({ project: proj.id })}>{proj.name}</Link>
                                </TableCell>
                                <TableCell>{proj.customer?.name || '-'}</TableCell>
                                <TableCell>
                                    <Badge variant={proj.closeReason ? 'destructive' : 'default'}>{proj.project_status?.name}</Badge>
                                </TableCell>
                                <TableCell>
                                    {proj.expectedEndAt ? formatDate(proj.expectedEndAt) : "-"}
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center justify-end gap-2 min-h-9">
                                        {!proj.closeReason && (
                                            <>
                                                {/* Editar */}
                                                <Button size="icon" variant="outline" title="Editar" asChild>
                                                    <Link href={edit({ project: proj.id })}>
                                                        <Edit />
                                                    </Link>
                                                </Button>

                                                {/* Encerrar */}
                                                <Button
                                                    size="icon"
                                                    variant="destructive"
                                                    title="Encerrar projeto"
                                                    onClick={() => handleOpenCloseModal(proj)}
                                                    disabled={projectToClose?.id === proj.id && loadingDetails}
                                                >
                                                    {projectToClose?.id === proj.id && loadingDetails ? (
                                                        <LoaderCircle size={16} className="animate-spin" />
                                                    ) : (
                                                        <SquareX />
                                                    )}
                                                </Button>
                                            </>
                                        )}
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>

                <div className="flex items-center justify-between mt-4">
                    <span className="text-muted-foreground flex-1 text-sm">
                        Mostrando {start}–{end} de {projects.total} projetos
                    </span>

                    <Pagination links={projects.links} />
                </div>
            </div>

            {/* Modal de encerramento */}
            {projectToClose && projectDetails && (
                <AlertDialog
                    open={!!projectToClose}
                    onOpenChange={(open) => {
                        if (!open) {
                            setProjectToClose(null);
                            setCloseReason("");
                        }
                    }}
                >
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Confirmar encerramento</AlertDialogTitle>
                            <AlertDialogDescription>
                                Você está prestes a encerrar o projeto{" "}
                                <strong>{projectToClose.name}</strong>.

                                {projectDetails.pendingTasks > 0 ? (
                                    <div className="mt-3 text-red-500">
                                        Existem <strong>{projectDetails.pendingTasks}</strong> tarefas não concluídas.
                                        <br />
                                        Tem certeza que deseja encerrar mesmo assim?
                                    </div>
                                ) : (
                                    <div className="mt-3 text-muted-foreground">
                                        Não há tarefas pendentes neste projeto.
                                    </div>
                                )}

                                {/* Justificativa */}
                                <div className="mt-4">
                                    <Label htmlFor="closeReason">Justificativa do encerramento *</Label>
                                    <Textarea
                                        id="closeReason"
                                        placeholder="Descreva o motivo do encerramento..."
                                        required
                                        className="mt-2"
                                        value={closeReason}
                                        onChange={(e) => setCloseReason(e.target.value)}
                                    />
                                </div>
                            </AlertDialogDescription>
                        </AlertDialogHeader>

                        <AlertDialogFooter>
                            <Button
                                variant="outline"
                                onClick={() => {
                                    setProjectToClose(null);
                                    setCloseReason("");
                                }}
                            >
                                Cancelar
                            </Button>

                            <Button
                                variant="destructive"
                                disabled={closeReason.trim().length === 0}
                                onClick={() => handleCloseProject(projectToClose.id, closeReason)}
                            >
                                Encerrar projeto
                            </Button>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            )}
        </AppLayout>
    );
}
