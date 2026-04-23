import Flash from "@/components/flash";
import Heading from "@/components/heading";
import InputError from "@/components/input-error";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import AppLayout from "@/layouts/app-layout";
import { list, store, update } from "@/routes/admin/roles";
import { BreadcrumbItem, FlashType, Role } from "@/types";
import { Head, Link, useForm } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { roleTypeDescription } from "@/lib/descriptions";
import { Select } from "@/components/select";
import { mapWithKeys } from "@/lib/utils";

interface AdminRoleFormProps {
    role?: Role; 
    types: string[];
    flash?: FlashType;
}

export default function AdminRoleForm({ role, types, flash }: AdminRoleFormProps) {
    const isEdit = !!role;

    const { data, setData, post, put, errors, processing } = useForm({
        name: role?.name || "",
        type: role?.type,
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();

        if (isEdit) {
            put(update({ id: role!.id }).url);
        } else {
            post(store().url);
        }
    };

    const breadcrumbs: BreadcrumbItem[] = [
        { title: "Perfis", href: list().url },
        { title: isEdit ? "Editar perfil" : "Novo perfil", href: "" },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={isEdit ? "Editar perfil" : "Novo perfil"} />

            <div className="px-4 py-6">
                <Heading title={isEdit ? "Editar perfil" : "Novo perfil"} />

                <Flash flash={flash} className="mb-6" />

                <form onSubmit={submit}>
                    <div className="grid grid-cols-2 gap-6">
                        <div className="grid gap-2">
                            <Label htmlFor="name">Nome *</Label>
                            <Input
                                id="name"
                                type="text"
                                required
                                autoFocus
                                tabIndex={1}
                                name="name"
                                placeholder="Nome do perfil"
                                value={data.name}
                                onChange={e => setData("name", e.target.value)}
                            />
                            <InputError message={errors.name} className="mt-2" />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="type">Tipo *</Label>
                            <Select 
                                name="type"
                                value={data.type}
                                onValueChange={(value) => setData('type', value ? String(value) : undefined)}
                                items={mapWithKeys(types, (type) => [type, roleTypeDescription(type)])}
                                placeholder="Tipo"
                                required
                            />
                            <InputError message={errors.type} className="mt-2" />
                        </div>
                    </div>

                    <div className="flex items-center gap-4 mt-6">
                        <Button type="submit" tabIndex={3} loading={processing}>
                            {isEdit ? "Salvar" : "Criar"}
                        </Button>

                        <Button variant="outline" tabIndex={4} render={
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
