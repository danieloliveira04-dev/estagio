"use client"

import * as React from "react";
import {
    Combobox,
    ComboboxChip,
    ComboboxChips,
    ComboboxChipsInput,
    ComboboxContent,
    ComboboxEmpty,
    ComboboxItem,
    ComboboxList,
    ComboboxValue,
    useComboboxAnchor,
} from "@/components/ui/combobox";
import { User } from "@/types";
import { getUsersAutocomplete } from "@/services/users";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useInitials } from "@/hooks/use-initials";

export interface ComboboxUsersProps {
    placeholder?: string;
    value?: number[];
    onChange?: (value: number[]) => void;
};

export function ComboboxUsers({ placeholder, value, onChange }: ComboboxUsersProps) {
    const anchor = useComboboxAnchor();
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
        <Combobox
            multiple
            autoHighlight
            items={users}
            value={value}
            onValueChange={onChange}
        >
            <ComboboxChips ref={anchor} className="w-full">
                <ComboboxValue>
                    {(values: number[]) => (
                        <>
                            {values.map((value) => {
                                const user = users.find(
                                    (u) => u.id === value
                                );

                                if (!user) return null;

                                return (
                                    <ComboboxChip key={value} className="!px-1.5 py-1.5 rounded-full h-fit">
                                        <div className="flex items-center gap-2 mr-0.5">
                                            <Avatar className="size-6">
                                                <AvatarImage src={user.photo} alt={user.name} />
                                                <AvatarFallback className="bg-neutral-200 text-black dark:bg-neutral-700 dark:text-white">
                                                    {getInitials(user.name)}
                                                </AvatarFallback>
                                            </Avatar>

                                            <span className="text-sm font-medium">
                                                {user.name}
                                            </span>
                                        </div>
                                    </ComboboxChip>
                                );
                            })}
                            <ComboboxChipsInput placeholder={placeholder} />
                        </>
                    )}
                </ComboboxValue>
            </ComboboxChips>

            <ComboboxContent anchor={anchor}>
                <ComboboxEmpty>Nenhum usuário encontrado.</ComboboxEmpty>
                <ComboboxList>
                    {(item: User) => (
                        <ComboboxItem key={item.id} value={item.id}>
                            <div className="flex gap-3 py-0.5 w-full">
                                <Avatar className="h-8 w-8 overflow-hidden rounded-full">
                                    <AvatarImage src={item.photo} alt={item.name} />
                                    <AvatarFallback className="rounded-lg bg-neutral-200 text-black dark:bg-neutral-700 dark:text-white">
                                        {getInitials(item.name)}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="grid flex-1 text-left text-sm leading-tight">
                                    <span className="truncate font-medium">{item.name}</span>
                                    <span className="truncate text-xs text-muted-foreground">{item.email}</span>
                                </div>
                            </div>
                        </ComboboxItem>
                    )}
                </ComboboxList>
            </ComboboxContent>
        </Combobox>
    );
}
