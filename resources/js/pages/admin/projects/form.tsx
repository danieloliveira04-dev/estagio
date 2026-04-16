import { useState } from "react";
import Flash from "@/components/flash";
import Heading from "@/components/heading";
import InputError from "@/components/input-error";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import AppLayout from "@/layouts/app-layout";
import { list, store, update } from "@/routes/admin/projects";
import { BreadcrumbItem, FlashType, Project, ProjectStatus, Template } from "@/types";
import { Head, Link, useForm } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, LoaderCircle } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { formatDate, mapWithKeys } from "@/lib/utils";

import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import { ComboboxUsers } from "@/components/combobox-users";
import { ComboboxUser } from "@/components/combobox-user";
import { Select } from "@/components/select";

interface AdminProjectFormProps {
    project?: Project;
    flash?: FlashType;
    projectStatus: ProjectStatus[];
    templates: Template[];
}

export default function AdminProjectForm({
    project,
    flash,
    projectStatus,
    templates
}: AdminProjectFormProps) {
    const isEdit = !!project;

    const { data, setData, post, put, errors, processing } = useForm({
        name: project?.name || "",
        prefix: project?.prefix || "",
        description: project?.description || "",
        customerUserId: project?.customerUserId,
        managersIds: project?.members?.map(u => u.userId) || [],
        projectStatusId: project?.projectStatusId,
        expectedEndAt: project?.expectedEndAt || "",
        templateId: "",
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isEdit) {
            put(update({ project: project.id }).url);
        } else {
            post(store().url);
        }
    };

    // Local states para popovers
    const [openTemplate, setOpenTemplate] = useState(false);
    const selectedTemplate = templates.find((t) => t.id === Number(data.templateId));

    const breadcrumbs: BreadcrumbItem[] = [
        { title: "Projetos", href: list().url },
        { title: isEdit ? "Editar projeto" : "Novo projeto", href: "" },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={isEdit ? "Editar projeto" : "Novo projeto"} />

            <div className="px-4 py-6">
                <Heading title={isEdit ? "Editar projeto" : "Novo projeto"} />
                <Flash flash={flash} className="mb-6" />

                <form onSubmit={submit} encType="multipart/form-data">
                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="name">Nome *</Label>
                            <Input
                                id="name"
                                required
                                placeholder="Nome do projeto"
                                value={data.name}
                                onChange={(e) => setData("name", e.target.value)}
                            />
                            <InputError message={errors.name} />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="prefix">Prefixo *</Label>
                            <Input
                                id="prefix"
                                required
                                minLength={3}
                                maxLength={3}
                                placeholder="Prefixo do projeto"
                                value={data.prefix}
                                onChange={(e) => setData("prefix", e.target.value)}
                            />
                            <InputError message={errors.prefix} />
                        </div>

                        <div className="space-y-2 col-span-2">
                            <Label htmlFor="description">Descrição</Label>
                            <Textarea
                                id="description"
                                placeholder="Descrição do projeto"
                                value={data.description}
                                onChange={(e) => setData("description", e.target.value)}
                            />
                            <InputError message={errors.description} />
                        </div>

                        <div className="space-y-2">
                            <Label>Cliente</Label>
                            <ComboboxUser placeholder="Selecione um cliente" value={data.customerUserId} onChange={(v) => setData("customerUserId", v || undefined)} />
                            <InputError message={errors.customerUserId} />
                        </div>

                        {!isEdit && (
                            <div className="space-y-2">
                                <Label>Gestores *</Label>
                                <ComboboxUsers placeholder="Selecione os gestores" value={data.managersIds} onChange={(v) => setData("managersIds", v)} />
                                <InputError message={errors.managersIds} />
                            </div>
                        )}

                        <div className="space-y-2">
                            <Label>Status *</Label>
                            <Select 
                                name="projectStatusId"
                                value={data.projectStatusId ? String(data.projectStatusId) : undefined}
                                onValueChange={(value) => setData('projectStatusId', value ? parseInt(value) : undefined)}
                                items={mapWithKeys(projectStatus, (status) => [status.id, status.name])}
                                placeholder="Status"
                                required
                            />
                            <InputError message={errors.projectStatusId} />
                        </div>

                        <div className="space-y-2">
                            <Label>Prazo</Label>
                            <Input
                                className="block"
                                type="date"
                                min={formatDate(new Date(), "yyyy-MM-dd")}
                                value={data.expectedEndAt ? formatDate(data.expectedEndAt, "yyyy-MM-dd") : ""}
                                onChange={(e) => setData("expectedEndAt", e.target.value + ' 00:00:00')}
                            />
                            <InputError message={errors.expectedEndAt} />
                        </div>

                        {/* <div className="space-y-2">
                            <Label>Documentos</Label>
                            <FileUploadMultiple />
                        </div> */}

                        {!isEdit && (
                            <div className="space-y-2">
                                <Label>Modelo inicial</Label>

                                <Popover open={openTemplate} onOpenChange={setOpenTemplate}>
                                    <PopoverTrigger render={
                                        <Button variant="outline" className="w-full justify-start">
                                            {selectedTemplate ? selectedTemplate.name : "Selecionar modelo"}
                                        </Button>
                                    }/>

                                    <PopoverContent className="p-0" side="bottom" align="start">
                                        <Command>
                                            <CommandInput placeholder="Buscar modelo..." />
                                            <CommandList>
                                                <CommandEmpty>Nenhum modelo encontrado.</CommandEmpty>
                                                <CommandGroup>
                                                    {templates.map((tpl) => (
                                                        <CommandItem
                                                            key={tpl.id}
                                                            onSelect={() => {
                                                                setData("templateId", String(tpl.id));
                                                                setOpenTemplate(false);
                                                            }}
                                                        >
                                                            {tpl.name}
                                                        </CommandItem>
                                                    ))}
                                                </CommandGroup>
                                            </CommandList>
                                        </Command>
                                    </PopoverContent>
                                </Popover>

                                <InputError message={errors.templateId} />
                            </div>
                        )}

                        {project?.closeReason && (
                            <div className="space-y-2">
                                <p className="text-sm font-medium">Motivo do encerramento:</p>
                                <p className="text-muted-foreground">
                                    {project.closeReason}
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Ações */}
                    <div className="flex items-center gap-4 mt-6">
                        <Button type="submit">
                            {processing && <LoaderCircle size={16} className="animate-spin" />}
                            {isEdit ? "Salvar" : "Criar"}
                        </Button>

                        <Button variant="outline" render={
                            <Link href={list().url}>
                                <ChevronLeft size={16} /> Voltar
                            </Link>
                        }/>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
