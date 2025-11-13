import Flash from "@/components/flash";
import Heading from "@/components/heading";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import AppLayout from "@/layouts/app-layout";
import { deleteMethod, edit, form, getDetails, list } from "@/routes/admin/templates";
import { BreadcrumbItem, FlashType, Template, PaginationResponse } from "@/types";
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
import { Input } from "@/components/ui/input";
import Pagination from "@/components/pagination";

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: "Modelos",
        href: list().url,
    },
];

interface AdminTemplateListProps {
    templates: PaginationResponse<Template>;
}

interface TemplateDetails {
    template: Template;
    canDelete: boolean;
}

export default function AdminTemplateList({ templates }: AdminTemplateListProps) {
    const { flash } = usePage().props as { flash?: FlashType };
    const [search, setSearch] = useState<string>('');
    const searchTimeout = useRef<NodeJS.Timeout | null>(null);
    const [templateToDelete, setTemplateToDelete] = useState<Template | null>(null);
    const [templateDetails, setTemplateDetails] = useState<TemplateDetails | null>(null);
    const [loadingDetails, setLoadingDetails] = useState(false);

    const handleDeleteTemplate = (id: number) => {
        router.delete(deleteMethod({ id }).url, {
            onSuccess: () => setTemplateToDelete(null),
            onError: (errors) => console.error(errors),
            preserveScroll: true,
            preserveState: true,
        });
    };

    const handleOpenDeleteModal = async (template: Template) => {
        setTemplateToDelete(template);
        setLoadingDetails(true);

        try {
            const res = await fetch(getDetails({ id: template.id }).url);
            const data = await res.json();
            setTemplateDetails(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoadingDetails(false);
        }
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearch(value);

        if (searchTimeout.current) clearTimeout(searchTimeout.current);

        searchTimeout.current = setTimeout(() => {
            router.get(list().url, { search: value }, { preserveState: true, replace: true });
        }, 500);
    };

    const start = (templates.current_page - 1) * templates.per_page + 1;
    const end = Math.min(templates.current_page * templates.per_page, templates.total);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Modelos" />

            <div className="px-4 py-6">
                <Heading title="Modelos" />

                <Flash flash={flash} className="mb-6" />

                <div className="flex items-center justify-between gap-10 mb-4">
                    <div className="relative w-[320px]">
                        <Search size={18} className="absolute top-1/2 start-2 -translate-y-1/2" />
                        <Input placeholder="Buscar por nome" className="ps-9" value={search} onChange={handleSearchChange} />
                    </div>

                    <Button asChild>
                        <Link href={form()}>Adicionar modelo</Link>
                    </Button>
                </div>

                <div>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-1/12">ID</TableHead>
                                <TableHead className="w-7/12">Nome</TableHead>
                                <TableHead className="w-4/12"></TableHead>
                            </TableRow>
                        </TableHeader>

                        <TableBody>
                            {!templates.data.length && (
                                <TableRow>
                                    <TableCell colSpan={3}>
                                        <p className="text-muted-foreground text-md text-center py-3">
                                            Nenhum modelo encontrado
                                        </p>
                                    </TableCell>
                                </TableRow>
                            )}

                            {templates.data.map((template) => (
                                <TableRow key={template.id}>
                                    <TableCell className="font-medium">{template.id}</TableCell>
                                    <TableCell>{template.name}</TableCell>
                                    <TableCell>
                                        <div className="flex items-center justify-end gap-2">
                                            <Button size="icon" variant="outline" title="Editar" asChild>
                                                <Link href={edit({ id: template.id })}>
                                                    <Edit />
                                                </Link>
                                            </Button>
                                            <Button
                                                size="icon"
                                                variant="destructive"
                                                title="Excluir"
                                                onClick={() => handleOpenDeleteModal(template)}
                                                disabled={templateToDelete?.id === template.id && loadingDetails}
                                            >
                                                {templateToDelete?.id === template.id && loadingDetails ? (
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
                            Mostrando {start}–{end} de {templates.total} modelos
                        </span>

                        <Pagination links={templates.links} />
                    </div>
                </div>
            </div>

            {templateToDelete && templateDetails && (
                <AlertDialog
                    open={!!templateToDelete}
                    onOpenChange={(open) => {
                        if (!open) setTemplateToDelete(null);
                    }}
                >
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                            <AlertDialogDescription>
                                Tem certeza que deseja excluir o modelo{" "}
                                <strong>{templateToDelete.name}</strong>? Esta ação não pode ser desfeita.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <Button variant="outline" onClick={() => setTemplateToDelete(null)}>
                                Cancelar
                            </Button>
                            <Button
                                variant="destructive"
                                disabled={!templateDetails?.canDelete}
                                onClick={() => handleDeleteTemplate(templateToDelete.id)}
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
