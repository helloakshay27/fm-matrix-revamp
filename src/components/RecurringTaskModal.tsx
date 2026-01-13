import { ChevronDown, ChevronUp, X } from "lucide-react";
import { useState } from "react";

export const RecurringTaskModal = ({ isOpen, onClose, onSave, initialData = null }) => {
    const [frequency, setFrequency] = useState(initialData?.frequency || 1);
    const [period, setPeriod] = useState(initialData?.period || 'week');
    const [selectedDays, setSelectedDays] = useState(initialData?.selectedDays || [0, 1]);
    const [endType, setEndType] = useState(initialData?.endType || 'never');
    const [endDate, setEndDate] = useState(initialData?.endDate || '2026-04-13');
    const [occurrences, setOccurrences] = useState(initialData?.occurrences || 13);
    const [monthlyRepeatType, setMonthlyRepeatType] = useState(initialData?.monthlyRepeatType || 'day');
    const [monthlyDay, setMonthlyDay] = useState(initialData?.monthlyDay || 12);
    const [weekOfMonth, setWeekOfMonth] = useState(initialData?.weekOfMonth || 2);
    const [dayOfWeek, setDayOfWeek] = useState(initialData?.dayOfWeek || 1);
    const [showMonthlyOptions, setShowMonthlyOptions] = useState(false);

    const days = [
        { label: 'S', value: 0, full: 'Sunday' },
        { label: 'M', value: 1, full: 'Monday' },
        { label: 'T', value: 2, full: 'Tuesday' },
        { label: 'W', value: 3, full: 'Wednesday' },
        { label: 'T', value: 4, full: 'Thursday' },
        { label: 'F', value: 5, full: 'Friday' },
        { label: 'S', value: 6, full: 'Saturday' },
    ];

    const periods = ['day', 'week', 'month', 'year'];

    const getOrdinal = (n) => {
        const ordinals = ['first', 'second', 'third', 'fourth', 'last'];
        return ordinals[n - 1] || 'first';
    };

    const getDayName = (dayIndex) => {
        const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        return dayNames[dayIndex];
    };

    const toggleDay = (dayValue) => {
        setSelectedDays(prev =>
            prev.includes(dayValue)
                ? prev.filter(d => d !== dayValue)
                : [...prev, dayValue].sort()
        );
    };

    const handleSave = () => {
        const recurringData = {
            frequency,
            period,
            selectedDays,
            endType,
            endDate: endType === 'on' ? endDate : null,
            occurrences: endType === 'after' ? occurrences : null,
            monthlyRepeatType,
            monthlyDay,
            weekOfMonth,
            dayOfWeek,
        };
        onSave(recurringData);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b">
                    <h2 className="text-2xl font-normal">Custom recurrence</h2>
                    <button
                        type="button"
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                    {/* Repeat every */}
                    <div className="flex items-center gap-4">
                        <span className="text-base text-gray-700 min-w-[120px]">Repeat every</span>
                        <div className="flex items-center gap-2">
                            <div className="relative">
                                <input
                                    type="number"
                                    min="1"
                                    value={frequency}
                                    onChange={(e) => setFrequency(Math.max(1, parseInt(e.target.value) || 1))}
                                    className="w-20 px-3 py-2 border border-gray-300 rounded text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                <div className="absolute right-1 top-1 flex flex-col">
                                    <button
                                        type="button"
                                        onClick={() => setFrequency(prev => prev + 1)}
                                        className="p-0.5 hover:bg-gray-100 rounded"
                                    >
                                        <ChevronUp className="w-4 h-4 text-gray-600" />
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setFrequency(prev => Math.max(1, prev - 1))}
                                        className="p-0.5 hover:bg-gray-100 rounded"
                                    >
                                        <ChevronDown className="w-4 h-4 text-gray-600" />
                                    </button>
                                </div>
                            </div>
                            <select
                                value={period}
                                onChange={(e) => setPeriod(e.target.value)}
                                className="px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                {periods.map(p => (
                                    <option key={p} value={p}>
                                        {p}{frequency > 1 ? 's' : ''}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Repeat on (only show for weekly) */}
                    {period === 'week' && (
                        <div>
                            <div className="text-base text-gray-700 mb-3">Repeat on</div>
                            <div className="flex gap-2">
                                {days.map(day => (
                                    <button
                                        type="button"
                                        key={day.value}
                                        onClick={() => toggleDay(day.value)}
                                        className={`w-12 h-12 rounded-full flex items-center justify-center font-medium transition-colors ${selectedDays.includes(day.value)
                                            ? 'bg-blue-600 text-white'
                                            : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                                            }`}
                                        title={day.full}
                                    >
                                        {day.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Monthly repeat options */}
                    {period === 'month' && (
                        <div className="relative">
                            <button
                                type="button"
                                onClick={() => setShowMonthlyOptions(!showMonthlyOptions)}
                                className="w-full px-4 py-3 border border-gray-300 rounded bg-gray-100 text-left flex items-center justify-between hover:bg-gray-200 transition-colors"
                            >
                                <span className="text-base">
                                    {monthlyRepeatType === 'day'
                                        ? `Monthly on day ${monthlyDay}`
                                        : `Monthly on the ${getOrdinal(weekOfMonth)} ${getDayName(dayOfWeek)}`
                                    }
                                </span>
                                <ChevronDown className={`w-5 h-5 text-gray-600 transition-transform ${showMonthlyOptions ? 'rotate-180' : ''}`} />
                            </button>

                            {showMonthlyOptions && (
                                <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-300 rounded shadow-lg z-10">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setMonthlyRepeatType('day');
                                            setShowMonthlyOptions(false);
                                        }}
                                        className={`w-full px-4 py-3 text-left hover:bg-gray-100 transition-colors ${monthlyRepeatType === 'day' ? 'bg-gray-50' : ''
                                            }`}
                                    >
                                        Monthly on day {monthlyDay}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setMonthlyRepeatType('weekday');
                                            setShowMonthlyOptions(false);
                                        }}
                                        className={`w-full px-4 py-3 text-left hover:bg-gray-100 transition-colors border-t ${monthlyRepeatType === 'weekday' ? 'bg-gray-50' : ''
                                            }`}
                                    >
                                        Monthly on the {getOrdinal(weekOfMonth)} {getDayName(dayOfWeek)}
                                    </button>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Ends */}
                    <div>
                        <div className="text-base text-gray-700 mb-3">Ends</div>
                        <div className="space-y-3">
                            {/* Never */}
                            <label className="flex items-center gap-3 cursor-pointer">
                                <input
                                    type="radio"
                                    name="endType"
                                    checked={endType === 'never'}
                                    onChange={() => setEndType('never')}
                                    className="w-5 h-5 text-blue-600 focus:ring-2 focus:ring-blue-500"
                                />
                                <span className="text-base">Never</span>
                            </label>

                            {/* On date */}
                            <label className="flex items-center gap-3 cursor-pointer">
                                <input
                                    type="radio"
                                    name="endType"
                                    checked={endType === 'on'}
                                    onChange={() => setEndType('on')}
                                    className="w-5 h-5 text-blue-600 focus:ring-2 focus:ring-blue-500"
                                />
                                <span className="text-base min-w-[40px]">On</span>
                                <input
                                    type="date"
                                    value={endDate}
                                    onChange={(e) => {
                                        setEndDate(e.target.value);
                                        setEndType('on');
                                    }}
                                    className="flex-1 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-100"
                                />
                            </label>

                            {/* After occurrences */}
                            <label className="flex items-center gap-3 cursor-pointer">
                                <input
                                    type="radio"
                                    name="endType"
                                    checked={endType === 'after'}
                                    onChange={() => setEndType('after')}
                                    className="w-5 h-5 text-blue-600 focus:ring-2 focus:ring-blue-500"
                                />
                                <span className="text-base min-w-[40px]">After</span>
                                <div className="flex items-center gap-2 flex-1">
                                    <div className="relative">
                                        <input
                                            type="number"
                                            min="1"
                                            value={occurrences}
                                            onChange={(e) => {
                                                setOccurrences(Math.max(1, parseInt(e.target.value) || 1));
                                                setEndType('after');
                                            }}
                                            className="w-20 px-3 py-2 border border-gray-300 rounded text-center focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-100"
                                        />
                                        <div className="absolute right-1 top-1 flex flex-col">
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setOccurrences(prev => prev + 1);
                                                    setEndType('after');
                                                }}
                                                className="p-0.5 hover:bg-gray-200 rounded"
                                            >
                                                <ChevronUp className="w-4 h-4 text-gray-600" />
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setOccurrences(prev => Math.max(1, prev - 1));
                                                    setEndType('after');
                                                }}
                                                className="p-0.5 hover:bg-gray-200 rounded"
                                            >
                                                <ChevronDown className="w-4 h-4 text-gray-600" />
                                            </button>
                                        </div>
                                    </div>
                                    <span className="text-gray-600">occurrences</span>
                                </div>
                            </label>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-end gap-3 p-6 border-t">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-6 py-2 text-blue-600 font-medium hover:bg-blue-50 rounded transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={handleSave}
                        className="px-6 py-2 bg-blue-600 text-white font-medium rounded hover:bg-blue-700 transition-colors"
                    >
                        Done
                    </button>
                </div>
            </div>
        </div>
    );
};