import * as UiSelect from "@/components/ui/select";

export interface SelectProps {
    name?: string;
    placeholder?: string;
    required?: boolean;
    disabled?: boolean;
    value?: string;
    onValueChange?: (value?: string) => void;
    items: Record<string | number, string>;
}

export function Select({
    placeholder,
    name,
    value,
    onValueChange,
    items,
    required,
    disabled,
}: SelectProps) {

    const handleValueChange = (value: string) => {
        onValueChange?.(value !== "none" ? value : undefined);
    }

    return (
        <UiSelect.Select
            name={name}
            value={value}
            onValueChange={handleValueChange}
            required={required}
            disabled={disabled}
        >
            <UiSelect.SelectTrigger className="w-full" >
                <UiSelect.SelectValue placeholder={placeholder} />
            </UiSelect.SelectTrigger>

            <UiSelect.SelectContent>
                <UiSelect.SelectItem value="none">-</UiSelect.SelectItem>
                {Object.entries(items).map(([key, label]) => (
                    <UiSelect.SelectItem
                        key={key}
                        value={String(key)}
                    >
                        {label}
                    </UiSelect.SelectItem>
                ))}
            </UiSelect.SelectContent>
        </UiSelect.Select>
    );
}