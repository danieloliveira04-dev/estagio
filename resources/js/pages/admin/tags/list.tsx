import Flash from "@/components/flash";
import Heading from "@/components/heading";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import AppLayout from "@/layouts/app-layout";
import { deleteMethod, edit, form, getDetails, list } from "@/routes/admin/tags";
import { BreadcrumbItem, FlashType, Tag, PaginationResponse } from "@/types";
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
        title: "Tags",
        href: list().url,
    },
];

interface AdminTagListProps {
    tags: PaginationResponse<Tag>;
}

interface TagDetails {
    tag: Tag;
    canDelete: boolean;
}

export default function AdminTagList({ tags }: AdminTagListProps) {
    const { flash } = usePage().props as { flash?: FlashType };
    const [search, setSearch] = useState<string>('');
    const searchTimeout = useRef<NodeJS.Timeout | null>(null);
    const [tagToDelete, setTagToDelete] = useState<Tag | null>(null);
    const [tagDetails, setTagDetails] = useState<TagDetails | null>(null);
    const [loadingDetails, setLoadingDetails] = useState(false);

    const handleDeleteTag = (id: number) => {
        router.delete(deleteMethod({ id }).url, {
            onSuccess: () => setTagToDelete(null),
            onError: (errors) => console.error(errors),
            preserveScroll: true,
            preserveState: true,
        });
    };

    const handleOpenDeleteModal = async (tag: Tag) => {
        setTagToDelete(tag);
        setLoadingDetails(true);

        try {
            const res = await fetch(getDetails({ id: tag.id }).url);
            const data = await res.json();
            setTagDetails(data);
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

    const start = (tags.current_page - 1) * tags.per_page + 1;
    const end = Math.min(tags.current_page * tags.per_page, tags.total);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Tags" />

            <div className="px-4 py-6">
                <Heading title="Tags" />

                <Flash flash={flash} className="mb-6" />

                <div className="flex items-center justify-between gap-10 mb-4">
                    <div className="relative w-[320px]">
                        <Search size={18} className="absolute top-1/2 start-2 -translate-y-1/2" />
                        <Input placeholder="Buscar por nome" className="ps-9" value={search} onChange={handleSearchChange} />
                    </div>

                    <Button asChild>
                        <Link href={form()}>Adicionar tag</Link>
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
                            {!tags.data.length && (
                                <TableRow>
                                    <TableCell colSpan={3}>
                                        <p className="text-muted-foreground text-md text-center py-3">
                                            Sem resultados encontrados
                                        </p>
                                    </TableCell>
                                </TableRow>
                            )}

                            {tags.data.map((tag) => (
                                <TableRow key={tag.id}>
                                    <TableCell className="font-medium">{tag.id}</TableCell>
                                    <TableCell>{tag.name}</TableCell>
                                    <TableCell>
                                        <div className="flex items-center justify-end gap-2">
                                            <Button size="icon" variant="outline" title="Editar" asChild>
                                                <Link href={edit({ id: tag.id })}>
                                                    <Edit />
                                                </Link>
                                            </Button>
                                            <Button
                                                size="icon"
                                                variant="destructive"
                                                title="Excluir"
                                                onClick={() => handleOpenDeleteModal(tag)}
                                                disabled={tagToDelete?.id === tag.id && loadingDetails}
                                            >
                                                {tagToDelete?.id === tag.id && loadingDetails ? (
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
                            Mostrando {start}–{end} de {tags.total} tags
                        </span>

                        <Pagination links={tags.links} />
                    </div>
                </div>
            </div>

            {tagToDelete && tagDetails && (
                <AlertDialog
                    open={!!tagToDelete}
                    onOpenChange={(open) => {
                        if (!open) setTagToDelete(null);
                    }}
                >
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                            <AlertDialogDescription>
                                Tem certeza que deseja excluir a tag{" "}
                                <strong>{tagToDelete.name}</strong>? Esta ação não pode ser desfeita.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <Button variant="outline" onClick={() => setTagToDelete(null)}>
                                Cancelar
                            </Button>
                            <Button
                                variant="destructive"
                                disabled={!tagDetails?.canDelete}
                                onClick={() => handleDeleteTag(tagToDelete.id)}
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
