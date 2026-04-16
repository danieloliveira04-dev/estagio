import Flash from "@/components/flash";
import Heading from "@/components/heading";
import InputError from "@/components/input-error";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import AppLayout from "@/layouts/app-layout";
import { list, store, update } from "@/routes/admin/taskStatus";
import { BreadcrumbItem, FlashType, TaskStatus } from "@/types";
import { Head, Link, useForm } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, LoaderCircle } from "lucide-react";

interface AdminTaskStatusFormProps {
    taskStatus?: TaskStatus; 
    flash?: FlashType;
}

export default function AdminTaskStatusForm({ taskStatus, flash }: AdminTaskStatusFormProps) {
    const isEdit = !!taskStatus;

    const { data, setData, post, put, errors, processing } = useForm({
        name: taskStatus?.name || "",
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();

        if (isEdit) {
            put(update({ id: taskStatus!.id }).url);
        } else {
            post(store().url);
        }
    };

    const breadcrumbs: BreadcrumbItem[] = [
        { title: "Status da tarefa", href: list().url },
        { title: isEdit ? "Editar status" : "Novo status", href: "" },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={isEdit ? "Editar status da tarefa" : "Novo status da tarefa"} />

            <div className="px-4 py-6">
                <Heading title={isEdit ? "Editar status da tarefa" : "Novo status da tarefa"} />

                <Flash flash={flash} className="mb-6" />

                <form onSubmit={submit}>
                    <div className="grid grid-cols-1 gap-6">
                        <div className="grid gap-2">
                            <Label htmlFor="name">Nome *</Label>
                            <Input
                                id="name"
                                type="text"
                                required
                                autoFocus
                                name="name"
                                placeholder="Nome do status"
                                value={data.name}
                                onChange={e => setData("name", e.target.value)}
                            />
                            <InputError message={errors.name} className="mt-2" />
                        </div>
                    </div>

                    <div className="flex items-center gap-4 mt-6">
                        <Button type="submit">
                            {processing && <LoaderCircle size={16} className="animate-spin" />}
                            {isEdit ? "Salvar" : "Criar"}
                        </Button>

                        <Button variant="outline" render={
                            <Link href={list()}>
                                <ChevronLeft size={16} /> Voltar
                            </Link>
                        }/>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
