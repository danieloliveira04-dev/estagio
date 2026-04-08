'use client';

import * as React from 'react';

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
} from '@/components/ui/combobox';

interface ComboboxMultipleProps {
    items: Record<string | number, string>;
    value?: string[];
    onChange?: (values: string[]) => void;
    placeholder?: string;
    className?: string;
}

export function ComboboxMultiple({ items, value = [], onChange, placeholder = 'Selecione...', className }: ComboboxMultipleProps) {
    const anchor = useComboboxAnchor();

    const [internalValue, setInternalValue] = React.useState<string[]>(value);

    React.useEffect(() => {
        setInternalValue(value);
    }, [value]);

    const handleChange = (values: string[]) => {
        setInternalValue(values);
        onChange?.(values);
    };

    const normalizedItems = React.useMemo(() => {
        return Object.entries(items).map(([key, label]) => ({
            value: key,
            label,
        }));
    }, [items]);

    const itemsMap = React.useMemo(() => {
        return new Map(normalizedItems.map((i) => [i.value, i]));
    }, [normalizedItems]);

    return (
        <Combobox
            modal={false}
            multiple
            autoHighlight
            items={normalizedItems.map((item) => item.value)}
            value={internalValue}
            onValueChange={handleChange}
        >
            <ComboboxChips ref={anchor} className={`w-full ${className}`}>
                <ComboboxValue>
                    {(values) => (
                        <>
                            {values.map((value: string) => {
                                const item = itemsMap.get(value);

                                return <ComboboxChip key={value}>{item?.label ?? value}</ComboboxChip>;
                            })}

                            <ComboboxChipsInput placeholder={values.length === 0 ? placeholder : ''} />
                        </>
                    )}
                </ComboboxValue>
            </ComboboxChips>

            <ComboboxContent anchor={anchor} className="z-50">
                <ComboboxEmpty>Nenhum item encontrado.</ComboboxEmpty>

                <ComboboxList>
                    {(itemValue) => {
                        const item = itemsMap.get(itemValue);

                        return (
                            <ComboboxItem key={itemValue} value={itemValue}>
                                {item?.label ?? itemValue}
                            </ComboboxItem>
                        );
                    }}
                </ComboboxList>
            </ComboboxContent>
        </Combobox>
    );
}
