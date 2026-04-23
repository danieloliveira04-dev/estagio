'use client';

import UserController from "@/actions/App/Http/Controllers/Admin/UserController";
import Flash from "@/components/flash";
import Heading from "@/components/heading";
import InputError from "@/components/input-error";
import { Select } from "@/components/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import AppLayout from "@/layouts/app-layout";
import { mapWithKeys } from "@/lib/utils";
import { list } from "@/routes/admin/users";
import { BreadcrumbItem, FlashType, Role } from "@/types";
import { useForm, Head, Link } from "@inertiajs/react";
import { ChevronLeft, LoaderCircle } from "lucide-react";

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Usuários',
        href: list().url,
    },
    {
        title: 'Adicionar usuário',
        href: '',
    }
];

interface AdminUsersInviteFormProps {
    roles: Role[];
    flash?: FlashType;
}

export default function AdminUsersInviteForm({ flash, roles }: AdminUsersInviteFormProps) {

    const { data, setData, post, processing, errors } = useForm({
        email: '',
        roleId: undefined as number | undefined,
    });

    function submit(e: React.FormEvent) {
        e.preventDefault();

        post(UserController.inviteStore().url);
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Adicionar usuário" />

            <div className="px-4 py-6">
                <Heading title="Adicionar usuário" />

                <Flash flash={flash} className="mb-6" />

                <form onSubmit={submit}>
                    <div className="grid grid-cols-3 gap-6">
                        <div className="grid gap-2">
                            <Label htmlFor="email">E-mail *</Label>
                            <Input
                                id="email"
                                type="text"
                                required
                                autoFocus
                                tabIndex={1}
                                name="email"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                placeholder="E-mail"
                            />
                            <InputError message={errors.email} className="mt-2" />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="role">Perfil *</Label>

                            <Select
                                name="roleId"
                                value={data.roleId ? String(data.roleId) : null}
                                onValueChange={(value) =>
                                    setData('roleId', value ? parseInt(value) : undefined)
                                }
                                items={mapWithKeys(roles, (role) => [role.id, role.name])}
                                placeholder="Perfil"
                                required
                            />

                            <InputError message={errors.roleId} className="mt-2" />
                        </div>
                    </div>

                    <div className="flex items-center gap-4 mt-6">
                        <Button type="submit" loading={processing}>
                            Convidar
                        </Button>

                        <Button
                            variant="outline"
                            render={<Link href={list()} />}
                        >
                            <ChevronLeft size={16} /> Voltar
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}