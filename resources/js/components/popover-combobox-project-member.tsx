'use client';

import * as React from 'react';
import { User as UserIcon } from 'lucide-react';

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

import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';

import { cn } from '@/lib/utils';
import { useInitials } from '@/hooks/use-initials';

import { getProjectMembersAutocomplete } from '@/services/project';

import { ProjectMember } from '@/types';

export interface PopoverComboboxProjectMemberProps {
    projectId: number;
    value?: number | null;
    onChange?: (value: number | null) => void;
    showInput?: boolean;
    className?: string;
    children: (projectMember?: ProjectMember) => React.ReactNode;
}

type ProjectMemberItem =
    | ProjectMember
    | {
          id: null;
          user?: {
              name: string;
              email?: string;
              photo?: string | null;
          };
      };

export function PopoverComboboxProjectMember({
    projectId,
    value,
    onChange,
    showInput = false,
    children,
    className,
}: PopoverComboboxProjectMemberProps) {
    const getInitials = useInitials();

    const [projectMembers, setProjectMembers] = React.useState<
        ProjectMember[]
    >([]);

    React.useEffect(() => {
        const fetchProjectMembers = async () => {
            const { data } =
                await getProjectMembersAutocomplete(projectId);

            setProjectMembers(data);
        };

        fetchProjectMembers();
    }, [projectId]);

    const items: ProjectMemberItem[] = React.useMemo(() => {
        return [
            {
                id: null,
                user: {
                    name: 'Não atribuído',
                    email: '',
                    photo: null,
                },
            },
            ...projectMembers,
        ];
    }, [projectMembers]);

    return (
        <Combobox
            autoHighlight
            items={items}
            value={value ?? null}
            onValueChange={(val) => onChange?.(val ?? null)}
        >
            <ComboboxTrigger
                render={
                    <button
                        type="button"
                        onClick={(e) => e.stopPropagation()}
                        className={cn('cursor-pointer', className)}
                    >
                        <ComboboxValue>
                            {(val: number | null) => {
                                const projectMember =
                                    projectMembers.find(
                                        (member) => member.id === val
                                    );

                                return children(projectMember);
                            }}
                        </ComboboxValue>
                    </button>
                }
            />

            <ComboboxContent
                className="w-80"
                onClick={(e) => e.stopPropagation()}
            >
                {showInput && (
                    <ComboboxInput showTrigger={false} />
                )}

                <ComboboxEmpty>
                    Nenhum membro encontrado.
                </ComboboxEmpty>

                <ComboboxList>
                    {(item: ProjectMemberItem) => {
                        const user = item.user;

                        return (
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
                                                <AvatarImage
                                                    src={user?.photo || undefined}
                                                    alt={user?.name}
                                                />

                                                <AvatarFallback>
                                                    {getInitials(
                                                        user?.name ?? ''
                                                    )}
                                                </AvatarFallback>
                                            </>
                                        )}
                                    </Avatar>

                                    <div className="flex flex-col text-sm leading-tight">
                                        <span className="font-medium">
                                            {user?.name}
                                        </span>

                                        {item.id !== null && (
                                            <span className="text-xs text-muted-foreground">
                                                {user?.email}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </ComboboxItem>
                        );
                    }}
                </ComboboxList>
            </ComboboxContent>
        </Combobox>
    );
}