import React, { useRef } from 'react';
import { Calendar as CalendarIcon } from 'lucide-react';
import { format, getWeek } from 'date-fns';

interface WeekPickerProps {
    currentWeek: Date;
    onWeekChange: (date: Date) => void;
}

const toDateInputValue = (date: Date) => format(date, 'yyyy-MM-dd');

const fromDateInputValue = (value: string) => {
    const [year, month, day] = value.split('-').map(Number);
    return new Date(year, month - 1, day);
};

export const WeekPicker = ({ currentWeek, onWeekChange }: WeekPickerProps) => {
    const inputRef = useRef<HTMLInputElement>(null);

    const openNativePicker = () => {
        const input = inputRef.current;
        if (!input) return;

        if (typeof input.showPicker === 'function') {
            input.showPicker();
        } else {
            input.focus();
            input.click();
        }
    };

    return (
        <button
            type="button"
            className="relative inline-flex h-9 min-w-[168px] items-center rounded-[8px] border border-gray-200 bg-white px-3 text-left text-gray-700 shadow-sm hover:bg-white"
            onClick={openNativePicker}
        >
            <span className="mr-2 flex shrink-0 items-center text-gray-500">
                <CalendarIcon className="h-4 w-4" />
            </span>
            <span className="flex-1 text-sm font-semibold leading-none">
                {currentWeek ? `Week ${getWeek(currentWeek)}, ${format(currentWeek, 'yyyy')}` : 'Select Week'}
            </span>
            <input
                ref={inputRef}
                type="date"
                value={currentWeek ? toDateInputValue(currentWeek) : ''}
                onChange={(event) => {
                    if (event.target.value) {
                        onWeekChange(fromDateInputValue(event.target.value));
                    }
                }}
                className="pointer-events-none absolute bottom-0 left-1 h-px w-px opacity-0"
                aria-label="Select week date"
                tabIndex={-1}
            />
        </button>
    );
};
