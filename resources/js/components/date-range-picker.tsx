'use client';

import { CalendarIcon } from 'lucide-react';
import * as React from 'react';
import { type DateRange } from 'react-day-picker';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

import { formatDate } from '@/lib/utils';

interface DateRangePickerProps {
  value?: DateRange;
  onChange?: (range?: DateRange) => void;
  placeholder?: string;
  className?: string;
}

export function DateRangePicker({
  value,
  onChange,
  placeholder = 'Escolha a data',
  className,
}: DateRangePickerProps) {
  const [internalValue, setInternalValue] = React.useState<DateRange | undefined>(value);

  React.useEffect(() => {
    setInternalValue(value);
  }, [value]);

  const handleSelect = (range?: DateRange) => {
    setInternalValue(range);
    onChange?.(range);
  };

  const renderLabel = () => {
    if (!internalValue?.from) {
      return <span>{placeholder}</span>;
    }

    if (!internalValue.to) {
      return formatDate(internalValue.from, 'dd LLL, y');
    }

    if (internalValue.from.getTime() === internalValue.to.getTime()) {
      return formatDate(internalValue.from, 'dd LLL, y');
    }

    return (
      <>
        {formatDate(internalValue.from, 'dd LLL, y')} -{' '}
        {formatDate(internalValue.to, 'dd LLL, y')}
      </>
    );
  };

  return (
    <Popover>
      <PopoverTrigger
        render={(
          <Button
            variant="outline"
            className={`w-full justify-start px-2.5 font-normal ${className}`}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {renderLabel()}
          </Button>
        )}
      />

      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="range"
          selected={internalValue}
          onSelect={handleSelect}
          numberOfMonths={2}
        />
      </PopoverContent>
    </Popover>
  );
}