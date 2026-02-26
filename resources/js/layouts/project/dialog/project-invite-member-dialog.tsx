import { inviteMember } from '@/actions/App/Http/Controllers/ProjectController';
import InputError from '@/components/input-error';
import { Select } from '@/components/select';
import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Spinner } from '@/components/ui/spinner';
import { Textarea } from '@/components/ui/textarea';
import { mapWithKeys } from '@/lib/utils';
import { autocomplete } from '@/routes/admin/users';
import api from '@/services/api';
import { Role, User } from '@/types';
import { useForm } from '@inertiajs/react';
import { useEffect, useState } from 'react';

interface ProjectInviteMemberDialogProps {
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    projectId: number;
    roles: Role[];
}

const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

export function ProjectInviteMemberDialog({ open, onOpenChange, projectId, roles }: ProjectInviteMemberDialogProps) {
    const [foundUser, setFoundUser] = useState<User | null>(null);
    const [hasValidated, setHasValidated] = useState(false);

    const { data, setData, errors, post } = useForm({
        email: '',
        roleId: 0,
        description: '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        
        post(inviteMember({ project: projectId }).url, {
            preserveScroll: true,
            onSuccess: () => {
                onOpenChange?.(false);
            },
        });
    };

    const emailChecked = isValidEmail(data.email) && hasValidated;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <form onSubmit={submit}>
                <DialogContent className="sm:max-w-xl">
                    <DialogHeader>
                        <DialogTitle>Convidar usuário para o projeto</DialogTitle>
                        <DialogDescription>Informe o e-mail do usuário que deseja convidar.</DialogDescription>
                    </DialogHeader>

                    <div className="space-y-6">
                        <div className="space-y-2">
                            <Label>E-mail</Label>

                            <div className="space-y-1">
                                <InputEmail
                                    value={data.email}
                                    onChange={(value) => {
                                        setData('email', value);
                                        setHasValidated(false);
                                    }}
                                    onUserFound={setFoundUser}
                                    onValidated={() => setHasValidated(true)}
                                />

                                {data.email && isValidEmail(data.email) && hasValidated && (
                                    <div className="text-sm">
                                        {foundUser ? (
                                            <p className="text-green-600">Usuário encontrado: {foundUser.name}</p>
                                        ) : (
                                            <p className="text-yellow-600">Nenhum usuário encontrado. Um convite será enviado.</p>
                                        )}
                                    </div>
                                )}
                            </div>

                            <InputError message={errors.email} />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="roleId">Função *</Label>
                            <Select 
                                name="roleId"
                                value={String(data.roleId)}
                                onValueChange={(value) => value && setData('roleId', parseInt(value))}
                                items={mapWithKeys(roles, (role) => [role.id, role.name])}
                                placeholder="Selecione uma função"
                                disabled={!emailChecked}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description">Papel</Label>
                            <Textarea value={data.description} onChange={(e) => setData('description', e.target.value)} disabled={!emailChecked} />
                        </div>
                    </div>

                    <DialogFooter className="mt-6">
                        <DialogClose asChild>
                            <Button variant="outline">Cancelar</Button>
                        </DialogClose>

                        <Button type="submit" onClick={submit} disabled={!emailChecked}>
                            Convidar
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </form>
        </Dialog>
    );
}

interface InputEmailProps {
    value: string;
    onChange: (value: string) => void;
    onUserFound: (user: User | null) => void;
    onValidated: () => void;
}

const InputEmail = ({ value, onChange, onUserFound, onValidated }: InputEmailProps) => {
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState(value);
    const [users, setUsers] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (!search) {
            setUsers([]);
            onUserFound(null);
            return;
        }

        const delay = setTimeout(async () => {
            setIsLoading(true);

            try {
                const response = await api.get(autocomplete({ query: { query: search } }).url);
                const result = response.data ?? [];
                setUsers(result);
            } catch (error) {
                console.error(error);
            } finally {
                setIsLoading(false);
                onValidated();
            }
        }, 500);

        return () => clearTimeout(delay);
    }, [search]);

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button variant="outline" role="combobox" className="w-full justify-between font-normal">
                    {value || 'Buscar ou digitar e-mail'}
                </Button>
            </PopoverTrigger>

            <PopoverContent className="w-full p-0">
                <Command>
                    <CommandInput
                        placeholder="Digite o e-mail..."
                        value={search}
                        onValueChange={(val) => {
                            setSearch(val);
                        }}
                    />

                    <CommandList>
                        {isLoading && (
                            <div className="flex items-center justify-center gap-2 py-4 text-sm text-muted-foreground">
                                <Spinner className="size-4 animate-spin" />
                                Buscando usuário...
                            </div>
                        )}

                        {!isLoading && users.length === 0 && !search && (
                            <CommandEmpty className="px-2 pt-1 text-center text-sm text-muted-foreground">Busque por um usuário</CommandEmpty>
                        )}

                        <CommandGroup>
                            {search && !isLoading && (
                                <CommandItem
                                    value={search}
                                    onSelect={() => {
                                        const user = users.find(u => u.email == search) ?? null;

                                        onChange(search);
                                        setSearch(search);
                                        onUserFound(user);
                                        onValidated();
                                        setOpen(false);
                                    }}
                                >
                                    {' '}
                                    Convidar "{search}"{' '}
                                </CommandItem>
                            )}

                            {!isLoading &&
                                users.map((user) => (
                                    <CommandItem
                                        key={user.id}
                                        value={user.email}
                                        onSelect={() => {
                                            onChange(user.email);
                                            setSearch(user.email);
                                            onUserFound(user);
                                            onValidated();
                                            setOpen(false);
                                        }}
                                    >
                                        <div className="flex flex-col">
                                            <span>{user.name}</span>
                                            <span className="text-xs text-muted-foreground">{user.email}</span>
                                        </div>
                                    </CommandItem>
                                ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
};
