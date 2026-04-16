import Flash from "@/components/flash";
import Heading from "@/components/heading";
import InputError from "@/components/input-error";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import AppLayout from "@/layouts/app-layout";
import { list } from "@/routes/admin/users";
import { BreadcrumbItem, FlashType, Role, User } from "@/types";
import { Head, Link, useForm } from "@inertiajs/react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { ChevronLeft, LoaderCircle } from "lucide-react";
import UserController from "@/actions/App/Http/Controllers/Admin/UserController";

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Usuários',
        href: list().url,
    },
    {
        title: 'Editar usuário',
        href: '',
    },
];

interface AdminUsersFormProps {
    user: User;
    roles: Role[];
    flash?: FlashType;
}

export default function AdminUsersForm({ user, roles, flash }: AdminUsersFormProps) {
    const { data, setData, put, errors, processing } = useForm({
        name: user.name,
        email: user.email,
        password: '',
        phone: user.phone,
        roleId: user.role.id,
        status: user.status,
    });


    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        put(UserController.update({ id: user.id }).url);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Editar usuário" />

            <div className="px-4 py-6">
                <Heading title="Editar usuário" />

                <Flash flash={flash} className="mb-6" />

                <form onSubmit={submit}>
                    <div className="grid grid-cols-3 gap-6">
                        <div className="grid gap-2">
                            <Label htmlFor="name">Nome *</Label>
                            <Input
                                id="name"
                                type="text"
                                required
                                autoFocus
                                tabIndex={1}
                                name="name"
                                placeholder="Nome"
                                value={data.name}
                                onChange={e => setData('name', e.target.value)}
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="email">E-mail *</Label>
                            <Input 
                                id="email"
                                type="email"
                                required
                                tabIndex={2}
                                name="email"
                                placeholder="E-mail"
                                value={data.email}
                                onChange={e => setData('email', e.target.value)}
                            />
                            <InputError message={errors.email} className="mt-2" />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="password">Senha</Label>
                            <Input 
                                id="password"
                                type="password"
                                tabIndex={2}
                                name="password"
                                placeholder="Senha"
                                value={data.password}
                                onChange={e => setData('password', e.target.value)}
                            />
                            <InputError message={errors.email} className="mt-2" />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="phone">Telefone</Label>
                            <Input 
                                id="phone"
                                type="text"
                                tabIndex={3}
                                name="phone"
                                placeholder="Telefone"
                                value={data.phone}
                                onChange={e => setData('phone', e.target.value)}
                            />
                            <InputError message={errors.email} className="mt-2" />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="role">Perfil *</Label>
                            <Select value={String(data.roleId)} onValueChange={value => setData('roleId', parseInt(value))}>
                                <SelectTrigger tabIndex={2}>
                                    <SelectValue placeholder="Perfil" />
                                </SelectTrigger>
                                <SelectContent>
                                    {roles.map((role) => (
                                        <SelectItem key={role.id} value={String(role.id)}>
                                            {role.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <InputError message={errors.roleId} className="mt-2" />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="status">Status *</Label>
                            <div className="flex items-center space-x-2">
                                <Switch id="status" name="status" checked={data.status === 'active'} onCheckedChange={checked => setData('status', checked ? 'active' : 'inactive')} />
                                <span>Ativo</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 mt-6">
                        <Button type="submit" tabIndex={3}>
                            {processing && <LoaderCircle size={16} className="animate-spin" />}
                            Salvar
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