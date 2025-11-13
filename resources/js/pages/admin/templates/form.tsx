import Flash from "@/components/flash";
import Heading from "@/components/heading";
import InputError from "@/components/input-error";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import AppLayout from "@/layouts/app-layout";
import { list, store, update } from "@/routes/admin/templates";
import { BreadcrumbItem, FlashType, TaskStatus, Template } from "@/types";
import { Head, Link, useForm } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, LoaderCircle } from "lucide-react";
import TemplateColumnsForm from "@/layouts/admin/templates/TemplateColumnsForm";

interface AdminTemplateFormProps {
    template?: Template;
    taskStatus: TaskStatus[]; 
    flash?: FlashType;
}

export default function AdminTemplateForm({ template, taskStatus, flash }: AdminTemplateFormProps) {
    const isEdit = !!template;

    const { data, setData, post, put, errors, processing } = useForm<{
        name: string;
        columns: {
            id?: number;
            name: string;
            taskStatusId: string;
        }[];
    }>({
        name: template?.name || "",
        columns: [],
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();

        if (isEdit) {
            put(update({ id: template!.id }).url);
        } else {
            post(store().url);
        }
    };

    const breadcrumbs: BreadcrumbItem[] = [
        { title: "Modelos", href: list().url },
        { title: isEdit ? "Editar modelo" : "Novo modelo", href: "" },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={isEdit ? "Editar modelo" : "Novo modelo"} />

            <div className="px-4 py-6">
                <Heading title={isEdit ? "Editar modelo" : "Novo modelo"} />

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
                                placeholder="Nome do modelo"
                                value={data.name}
                                onChange={e => setData("name", e.target.value)}
                            />
                            <InputError message={errors.name} className="mt-2" />
                        </div>

                        <TemplateColumnsForm
                            defaultValue={template?.columns?.map(c => ({
                                id: c.id,
                                name: c.name,
                                status: String(c.taskStatusId ?? "")
                            })) ?? []}
                            onChange={(values) =>
                                setData("columns", values.map((col) => ({
                                    name: col.name,
                                    taskStatusId: col.status,
                                })))
                            }
                            status={taskStatus}
                        />
                    </div>

                    <div className="flex items-center gap-4 mt-6">
                        <Button type="submit">
                            {processing && <LoaderCircle size={16} className="animate-spin" />}
                            {isEdit ? "Salvar" : "Criar"}
                        </Button>

                        <Button variant="outline" asChild>
                            <Link href={list()}>
                                <ChevronLeft size={16} /> Voltar
                            </Link>
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
