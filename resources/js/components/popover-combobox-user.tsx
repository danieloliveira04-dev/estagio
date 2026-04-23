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
import { User as UserIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface ComboboxUserProps {
    value?: number | null;
    onChange?: (value: number | null) => void;
    showInput?: boolean;
    children: (user?: User) => React.ReactNode;
    className?: string;
}

type UserItem = User | { id: null; name: string; email?: string; photo?: string | null };

export function PopoverComboboxUser({ value, onChange, showInput = false, children, className }: ComboboxUserProps) {
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
                    <button type="button" onClick={(e) => e.stopPropagation()} className={cn("cursor-pointer", className)}>
                        <ComboboxValue>
                            {(val: number | null) => {
                                const user = users.find((u) => u.id === val);
                                return children(user);
                            }}
                        </ComboboxValue>
                    </button>
                }
            />

            <ComboboxContent className="w-80" onClick={(e) => e.stopPropagation()}>
                {showInput && (
                    <ComboboxInput showTrigger={false} />
                )}
                <ComboboxEmpty>Nenhum usuário encontrado.</ComboboxEmpty>

                <ComboboxList>
                    {(item: UserItem) => (
                        <ComboboxItem
                            key={item.id ?? 'unassigned'}
                            value={item.id}
                            className="cursor-pointer"
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