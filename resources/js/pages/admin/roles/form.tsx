import Flash from "@/components/flash";
import Heading from "@/components/heading";
import InputError from "@/components/input-error";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import AppLayout from "@/layouts/app-layout";
import { list, store, update } from "@/routes/admin/roles";
import { BreadcrumbItem, FlashType, Role } from "@/types";
import { Head, Link, useForm } from "@inertiajs/react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { ChevronLeft, LoaderCircle } from "lucide-react";
import { roleTypeDescription } from "@/lib/descriptions";

interface AdminRoleFormProps {
    role?: Role; 
    types: string[];
    flash?: FlashType;
}

export default function AdminRoleForm({ role, types, flash }: AdminRoleFormProps) {
    const isEdit = !!role;

    const { data, setData, post, put, errors, processing } = useForm({
        name: role?.name || "",
        type: role?.type || types[0] || "",
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
                            <Select value={data.type} onValueChange={value => setData("type", value)}>
                                <SelectTrigger tabIndex={2}>
                                    <SelectValue placeholder="Tipo" />
                                </SelectTrigger>
                                <SelectContent>
                                    {types.map((t) => (
                                        <SelectItem key={t} value={t}>{roleTypeDescription(t)}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <InputError message={errors.type} className="mt-2" />
                        </div>
                    </div>

                    <div className="flex items-center gap-4 mt-6">
                        <Button type="submit" tabIndex={3}>
                            {processing && <LoaderCircle size={16} className="animate-spin" />}
                            {isEdit ? "Salvar" : "Criar"}
                        </Button>

                        <Button variant="outline" tabIndex={4} asChild>
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
