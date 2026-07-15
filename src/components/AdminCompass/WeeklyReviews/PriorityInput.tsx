import { ChevronDown, Plus } from 'lucide-react';

interface PriorityInputProps {
    userId: number;
    priorityText: string;
    selectedDay: string;
    isOpen: boolean;
    isLoading: boolean;
    daysOfWeek: string[];
    onPriorityChange: (text: string) => void;
    onDaySelect: (day: string) => void;
    onToggleDropdown: () => void;
    onSubmit: () => void;
    onKeyPress: (e: React.KeyboardEvent) => void;
}

export const PriorityInput = ({
    userId,
    priorityText,
    selectedDay,
    isOpen,
    isLoading,
    daysOfWeek,
    onPriorityChange,
    onDaySelect,
    onToggleDropdown,
    onSubmit,
    onKeyPress,
}: PriorityInputProps) => {
    return (
        <div className="relative min-w-0 w-full" data-priority-dropdown>
            <div className="flex h-12 items-center rounded-2xl border border-slate-200 bg-white p-1.5 shadow-sm transition-colors focus-within:border-blue-300 focus-within:ring-2 focus-within:ring-blue-100">
                <div className="relative w-full flex items-center h-full">
                    <button
                        onClick={onToggleDropdown}
                        className="flex h-9 cursor-pointer items-center gap-1 rounded-xl border border-slate-100 bg-slate-50 px-3 transition-colors hover:bg-slate-100 whitespace-nowrap"
                    >
                        <span className="text-xs font-bold text-slate-600">{selectedDay}</span>
                        <ChevronDown
                            className={`h-3 w-3 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                        />
                    </button>
                    <input
                        type="text"
                        placeholder="Add priority..."
                        value={priorityText}
                        onChange={(e) => onPriorityChange(e.target.value)}
                        onKeyPress={onKeyPress}
                        className="h-9 min-w-0 flex-1 bg-transparent px-3 text-xs font-medium text-slate-700 outline-none placeholder:text-slate-400"
                    />
                    <div className="shrink-0">
                        <button
                            onClick={onSubmit}
                            disabled={isLoading}
                            className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-white shadow-sm transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            <Plus className="h-4 w-4" />
                        </button>
                    </div>
                </div>
            </div>
            {isOpen && (
                <div className="absolute top-full left-0 z-50 mt-2 w-36 overflow-hidden rounded-2xl border border-slate-200 bg-white p-1 shadow-xl">
                    {daysOfWeek.map((day) => (
                        <button
                            key={day}
                            onClick={() => {
                                onDaySelect(day);
                            }}
                            className={`block w-full rounded-xl px-3 py-2 text-left text-xs font-bold transition-colors ${selectedDay === day
                                    ? 'bg-blue-50 text-blue-700'
                                    : 'text-slate-600 hover:bg-slate-50'
                                }`}
                        >
                            {day}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};
