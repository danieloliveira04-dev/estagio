import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function formatDate(date: string | number | Date, formatStr: string = 'dd/MM/yyyy') {
    return format(date, formatStr, {locale: ptBR});
}

export function capitalize(text: string): string {
    return text.charAt(0).toUpperCase() + text.slice(1);
}

export function mapWithKeys<T, K extends string | number, V>(
    items: T[],
    callback: (item: T) => [K, V]
): Record<K, V> {
    return Object.fromEntries(
        items.map(callback)
    ) as Record<K, V>;
}