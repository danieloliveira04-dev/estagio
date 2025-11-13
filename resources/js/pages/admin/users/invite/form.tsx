import UserController from "@/actions/App/Http/Controllers/Admin/UserController";
import Flash from "@/components/flash";
import Heading from "@/components/heading";
import InputError from "@/components/input-error";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import AppLayout from "@/layouts/app-layout";
import { list } from "@/routes/admin/users";
import { BreadcrumbItem, FlashType, Role } from "@/types";
import { Form, Head, Link } from "@inertiajs/react";
import { ChevronLeft, LoaderCircle } from "lucide-react";
import { useState } from "react";

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
    const [role, setRole] = useState<string>('');

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Adicionar usuário" />

            <div className="px-4 py-6">
                <Heading title="Adicionar usuário" />

                <Flash flash={flash} className="mb-6" />

                <Form 
                    {...UserController.inviteStore()}
                    disableWhileProcessing
                >
                    {({ processing, errors }) => (
                        <>
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
                                        placeholder="E-mail"
                                    />
                                    <InputError message={errors.email} className="mt-2" />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="role">Perfil *</Label>
                                    <Select value={role} onValueChange={setRole}>
                                        <SelectTrigger tabIndex={2}>
                                            <SelectValue placeholder="Perfil" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {roles.map(role => (
                                                <SelectItem key={role.id} value={String(role.id)}>{role.name}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <input type="hidden" name="roleId" value={role} />
                                    <InputError message={errors.roleId} className="mt-2" />
                                </div>
                            </div>

                            <div className="flex items-center gap-4 mt-6">
                                <Button type="submit" tabIndex={3}>
                                    {processing && <LoaderCircle size={16} className="animate-spin" />}
                                    Convidar
                                </Button>

                                <Button variant="outline" tabIndex={4} asChild>
                                    <Link href={list()}>
                                        <ChevronLeft size={16} /> Voltar
                                    </Link>
                                </Button>
                            </div>
                        </>
                    )}
                </Form>

            </div>

        </AppLayout>
    );
}