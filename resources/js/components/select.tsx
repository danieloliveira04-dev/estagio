'use client';

import {
    Combobox,
    ComboboxContent,
    ComboboxEmpty,
    ComboboxInput,
    ComboboxItem,
    ComboboxList,
} from '@/components/ui/combobox';
import * as React from 'react';

export interface SelectProps {
    name?: string;
    placeholder?: string;
    required?: boolean;
    disabled?: boolean;
    value?: string | null;
    onValueChange?: (value?: string | null) => void;
    items: Record<string | number, string>;
}

export function Select({
    placeholder,
    value,
    onValueChange,
    items,
    required,
    disabled,
}: SelectProps) {
    const list = React.useMemo(() => {
        return Object.entries(items).map(([key, label]) => ({
            value: String(key),
            label,
        }));
    }, [items]);

    return (
        <Combobox 
            items={list}
            itemToStringLabel={(value) => items?.[value]}
            value={value ?? null}
            onValueChange={(val) => {
                console.log('changed:', val);
                onValueChange?.(val);
            }}
            disabled={disabled}
            required={required}
        >
            <ComboboxInput placeholder={placeholder ?? 'Selecione...'} showClear  />
            <ComboboxContent>
                <ComboboxEmpty>Nenhuma opção encontrada.</ComboboxEmpty>

                <ComboboxList>
                {(item) => (
                    <ComboboxItem key={item.value} value={item.value}>
                        {item.label}
                    </ComboboxItem>
                )}
                </ComboboxList>
            </ComboboxContent>
        </Combobox>
    );
}