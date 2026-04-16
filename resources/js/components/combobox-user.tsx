'use client';

import {
    Combobox,
    ComboboxContent,
    ComboboxEmpty,
    ComboboxInput,
    ComboboxItem,
    ComboboxList,
    ComboboxTrigger,
    ComboboxValue,
} from '@/components/ui/combobox';
import { useInitials } from '@/hooks/use-initials';
import { getUsersAutocomplete } from '@/services/users';
import { User } from '@/types';
import * as React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';
import { User as UserIcon } from 'lucide-react';

export interface ComboboxUserProps {
    placeholder?: string;
    value?: number | null;
    onChange?: (value: number | null) => void;
    showInput?: boolean;
}

type UserItem = User | { id: null; name: string; email?: string; photo?: string | null };

export function ComboboxUser({ placeholder, value, onChange, showInput = true }: ComboboxUserProps) {
    const getInitials = useInitials();
    const [users, setUsers] = React.useState<User[]>([]);

    React.useEffect(() => {
        const getUsers = async () => {
            const { data } = await getUsersAutocomplete();
            setUsers(data);
        };

        getUsers();
    }, []);

    const items: UserItem[] = React.useMemo(() => {
        return [
            {
                id: null,
                name: 'Não atribuído',
                email: '',
                photo: null,
            },
            ...users,
        ];
    }, [users]);

    return (
        <Combobox
            autoHighlight
            items={items}
            value={value ?? null}
            onValueChange={(val) => onChange?.(val ?? null)}
        >
            <ComboboxTrigger
                render={
                    <Button
                        type="button"
                        variant="outline"
                        className="block h-10 w-full text-left shrink"
                    >
                        <ComboboxValue>
                            {(val: number | null) => {
                                if (!val) {
                                    return (
                                        <span className="text-muted-foreground">
                                            {placeholder ?? 'Não atribuído'}
                                        </span>
                                    );
                                }

                                const user = users.find((u) => u.id === val);

                                if (!user) return null;

                                return (
                                    <div className="flex items-center gap-2">
                                        <Avatar className="size-6 rounded-full">
                                            <AvatarImage src={user.photo} alt={user.name} />
                                            <AvatarFallback className="text-xs rounded-lg bg-neutral-200 text-black dark:bg-neutral-700 dark:text-white">
                                                {getInitials(user.name)}
                                            </AvatarFallback>
                                        </Avatar>

                                        <span className="truncate">{user.name}</span>
                                    </div>
                                );
                            }}
                        </ComboboxValue>
                    </Button>
                }
            />

            <ComboboxContent>
                {showInput && (
                    <ComboboxInput showTrigger={false} />
                )}
                <ComboboxEmpty>Nenhum usuário encontrado.</ComboboxEmpty>

                <ComboboxList>
                    {(item: UserItem) => (
                        <ComboboxItem
                            key={item.id ?? 'unassigned'}
                            value={item.id}
                        >
                            <div className="flex w-full items-center gap-3 py-1">
                                <Avatar className="h-8 w-8 rounded-full">
                                    {item.id === null ? (
                                        <AvatarFallback>
                                            <UserIcon />
                                        </AvatarFallback>
                                    ) : (
                                        <>
                                            <AvatarImage src={item.photo} alt={item.name} />
                                            <AvatarFallback>
                                                {getInitials(item.name)}
                                            </AvatarFallback>
                                        </>
                                    )}
                                </Avatar>

                                <div className="flex flex-col text-sm leading-tight">
                                    <span className="font-medium">{item.name}</span>

                                    {item.id !== null && (
                                        <span className="text-xs text-muted-foreground">
                                            {item.email}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </ComboboxItem>
                    )}
                </ComboboxList>
            </ComboboxContent>
        </Combobox>
    );
}