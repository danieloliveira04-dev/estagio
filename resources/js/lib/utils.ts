import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { format, isToday, isYesterday, differenceInHours, formatDistanceToNow } from "date-fns";
import { ptBR } from 'date-fns/locale';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function formatDate(date: string | number | Date, formatStr: string = 'dd/MM/yyyy') {
    return format(date, formatStr, {locale: ptBR});
}

export function formatNumber(
    value: number,
    options?: {
        decimals?: number;
        compact?: boolean;
        suffix?: string;
    }
) {
    if (value === null || value === undefined) return '-';

    const { decimals = 0, compact = false, suffix = '' } = options || {};

    if (compact) {
        if (value >= 1_000_000) {
            return `${(value / 1_000_000).toFixed(decimals)}M${suffix}`;
        }

        if (value >= 1_000) {
            return `${(value / 1_000).toFixed(decimals)}k${suffix}`;
        }
    }

    return `${value.toLocaleString('pt-BR', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
    })}${suffix}`;
}

export function formatPercentage(value: number): string {
  return formatNumber(value, { suffix: '%' });
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

export function formatDateSmart(dateInput: string | Date): string {
  const date = new Date(dateInput);
  const now = new Date();

  const hoursDiff = differenceInHours(now, date);

  if (hoursDiff < 24) {
    return formatDistanceToNow(date, {
      addSuffix: true,
      locale: ptBR,
    }); // ex: "há 7 minutos", "há 3 horas"
  }

  if (isYesterday(date)) {
    return `Ontem às ${format(date, "HH:mm")}`;
  }

  if (isToday(date)) {
    return format(date, "HH:mm");
  }

  if (date.getFullYear() === now.getFullYear()) {
    return format(date, "dd/MM, HH:mm");
  }

  return format(date, "dd/MM/yyyy, HH:mm");
}