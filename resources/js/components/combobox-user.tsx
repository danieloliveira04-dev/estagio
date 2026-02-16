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
import { Combobox as ComboboxPrimitive } from '@base-ui/react';
import { X } from 'lucide-react';
import * as React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';

export interface ComboboxUserProps {
    placeholder?: string;
    value?: number;
    onChange?: (value: number | null) => void;
}

export function ComboboxUser({ placeholder, value, onChange }: ComboboxUserProps) {
    const getInitials = useInitials();
    const [users, setUsers] = React.useState<User[]>([]);

    React.useEffect(() => {
        const getUsers = async () => {
            const { data } = await getUsersAutocomplete();
            setUsers(data);
        };

        getUsers();
    }, []);

    return (
        <Combobox autoHighlight items={users} value={value} onValueChange={onChange}>
            <div className="flex gap-2">
                <ComboboxTrigger
                    render={
                        <Button type="button" variant="outline" className="block h-11 w-full text-left group-has-data-[slot=combobox-clear]/input-group:hidden">
                            <ComboboxValue>
                                {(value: number) => {
                                    const user = users.find((u) => u.id === value);

                                    if (!user) {
                                        return <span className="text-muted-foreground">{placeholder ?? 'Selecione um usuário'}</span>;
                                    }

                                    return (
                                        <div className="flex items-center gap-2">
                                            <Avatar className="size-6 rounded-full">
                                                <AvatarImage src={user.photo} alt={user.name} />
                                                <AvatarFallback className="rounded-lg bg-neutral-200 text-black dark:bg-neutral-700 dark:text-white">
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
                {!!Number(value) && (
                    <ComboboxPrimitive.Clear
                        data-slot="combobox-clear"
                        render={
                            <Button className="size-11">
                                <X />
                            </Button>
                        }
                    />
                )}
            </div>

            <ComboboxContent>
                <ComboboxInput showTrigger={false} />
                <ComboboxEmpty>Nenhum usuário encontrado.</ComboboxEmpty>

                <ComboboxList>
                    {(item: User) => (
                        <ComboboxItem key={item.id} value={item.id}>
                            <div className="flex w-full items-center gap-3 py-1">
                                <Avatar className="h-8 w-8 rounded-full">
                                    <AvatarImage src={item.photo} alt={item.name} />
                                    <AvatarFallback className="rounded-lg bg-neutral-200 text-black dark:bg-neutral-700 dark:text-white">
                                        {getInitials(item.name)}
                                    </AvatarFallback>
                                </Avatar>

                                <div className="flex flex-col text-sm leading-tight">
                                    <span className="font-medium">{item.name}</span>
                                    <span className="text-xs text-muted-foreground">{item.email}</span>
                                </div>
                            </div>
                        </ComboboxItem>
                    )}
                </ComboboxList>
            </ComboboxContent>
        </Combobox>
    );
}
