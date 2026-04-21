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
        <div className="flex-1 relative" data-priority-dropdown>
            <div className="flex items-center h-10 bg-white border border-gray-200 rounded-xl shadow-sm">
                <div className="relative w-full flex items-center h-full">
                    <button
                        onClick={onToggleDropdown}
                        className="flex items-center gap-1 px-3 rounded-l-[10px] border-r border-gray-100 h-full cursor-pointer hover:bg-gray-50 transition-colors group whitespace-nowrap"
                    >
                        <span className="text-xs text-gray-500 font-medium">{selectedDay}</span>
                        <ChevronDown
                            className={`w-3 h-3 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                        />
                    </button>
                    <input
                        type="text"
                        placeholder="Add priority..."
                        value={priorityText}
                        onChange={(e) => onPriorityChange(e.target.value)}
                        onKeyPress={onKeyPress}
                        className="flex-1 text-xs px-3 h-full focus:outline-none placeholder:text-gray-400"
                    />
                    <div className="p-1 pr-2">
                        <button
                            onClick={onSubmit}
                            disabled={isLoading}
                            className="w-7 h-7 flex items-center justify-center bg-blue-400 text-white rounded-lg hover:bg-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <Plus className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>
            {isOpen && (
                <div className="absolute top-full left-0 mt-1 w-32 bg-white border border-gray-200 rounded-[10px] shadow-xl z-50">
                    {daysOfWeek.map((day) => (
                        <button
                            key={day}
                            onClick={() => {
                                onDaySelect(day);
                            }}
                            className={`block w-full text-left px-4 py-2 text-xs font-medium transition-colors ${selectedDay === day
                                    ? 'bg-blue-50 text-blue-600 rounded-[8px]'
                                    : 'text-gray-600 hover:bg-gray-50'
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
