import { ChevronDown, ChevronUp, X } from "lucide-react";
import { useState } from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

export const RecurringTaskModal = ({ isOpen, onClose, onSave, initialData = null }) => {
    const [hourMode, setHourMode] = useState(initialData?.hourMode || "specific");
    const [minuteMode, setMinuteMode] = useState(initialData?.minuteMode || "specific");
    const [dayMode, setDayMode] = useState(initialData?.dayMode || "weekdays");
    const [monthMode, setMonthMode] = useState(initialData?.monthMode || "all");

    const [selectedHours, setSelectedHours] = useState(initialData?.selectedHours || ["12"]);
    const [selectedMinutes, setSelectedMinutes] = useState(initialData?.selectedMinutes || ["00"]);
    const [selectedWeekdays, setSelectedWeekdays] = useState(initialData?.selectedWeekdays || ["Monday", "Tuesday"]);
    const [selectedDays, setSelectedDays] = useState(initialData?.selectedDays || []);
    const [selectedMonths, setSelectedMonths] = useState(initialData?.selectedMonths || []);

    const [betweenMinuteStart, setBetweenMinuteStart] = useState(initialData?.betweenMinuteStart || "00");
    const [betweenMinuteEnd, setBetweenMinuteEnd] = useState(initialData?.betweenMinuteEnd || "59");
    const [betweenMonthStart, setBetweenMonthStart] = useState(initialData?.betweenMonthStart || "January");
    const [betweenMonthEnd, setBetweenMonthEnd] = useState(initialData?.betweenMonthEnd || "December");

    const [endType, setEndType] = useState(initialData?.endType || "never");
    const [endDate, setEndDate] = useState(initialData?.endDate || "2026-04-13");
    const [occurrences, setOccurrences] = useState(initialData?.occurrences || 13);

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

    const hours = Array.from({ length: 24 }, (_, i) =>
        i.toString().padStart(2, "0")
    );
    const specificMinutes = [
        "00",
        "05",
        "10",
        "15",
        "20",
        "25",
        "30",
        "35",
        "40",
        "45",
        "50",
        "55",
    ];
    const allMinutes = Array.from({ length: 60 }, (_, i) =>
        i.toString().padStart(2, "0")
    );
    const daysList = Array.from({ length: 31 }, (_, i) =>
        (i + 1).toString().padStart(2, "0")
    );
    const months = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
    ];
    const weekdays = [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
    ];

    const buildCronExpression = () => {
        let minute = '*';
        let hour = '*';
        let dayOfMonth = '?';
        let month = '*';
        let dayOfWeek = '?';

        // Handle minutes
        if (minuteMode === 'specific' && selectedMinutes.length > 0) {
            minute = selectedMinutes.join(',');
        } else if (minuteMode === 'between') {
            const start = parseInt(betweenMinuteStart, 10);
            const end = parseInt(betweenMinuteEnd, 10);
            if (!Number.isNaN(start) && !Number.isNaN(end)) {
                minute = `${start}-${end}`;
            }
        }

        // Handle hours
        if (hourMode === 'specific' && selectedHours.length > 0) {
            hour = selectedHours.join(',');
        }

        // Handle days
        if (dayMode === 'weekdays' && selectedWeekdays.length > 0) {
            const weekdayMap: Record<string, string> = {
                'Sunday': '1',
                'Monday': '2',
                'Tuesday': '3',
                'Wednesday': '4',
                'Thursday': '5',
                'Friday': '6',
                'Saturday': '7'
            };
            dayOfWeek = selectedWeekdays.map(day => weekdayMap[day]).join(',');
            dayOfMonth = '?';
        } else if (dayMode === 'specific' && selectedDays.length > 0) {
            dayOfMonth = selectedDays.join(',');
            dayOfWeek = '?';
        }

        // Handle months
        if (monthMode === 'specific' && selectedMonths.length > 0) {
            const monthMap: Record<string, string> = {
                'January': '1',
                'February': '2',
                'March': '3',
                'April': '4',
                'May': '5',
                'June': '6',
                'July': '7',
                'August': '8',
                'September': '9',
                'October': '10',
                'November': '11',
                'December': '12'
            };
            month = selectedMonths.map(m => monthMap[m]).join(',');
        } else if (monthMode === 'between') {
            const monthMap: Record<string, number> = {
                'January': 1,
                'February': 2,
                'March': 3,
                'April': 4,
                'May': 5,
                'June': 6,
                'July': 7,
                'August': 8,
                'September': 9,
                'October': 10,
                'November': 11,
                'December': 12
            };
            const startMonth = monthMap[betweenMonthStart];
            const endMonth = monthMap[betweenMonthEnd];
            if (startMonth && endMonth) {
                month = `${startMonth}-${endMonth}`;
            }
        }

        return `${minute} ${hour} ${dayOfMonth} ${month} ${dayOfWeek}`;
    };

    const handleSave = () => {
        const recurringData = {
            hourMode,
            minuteMode,
            dayMode,
            monthMode,
            selectedHours,
            selectedMinutes,
            selectedWeekdays,
            selectedDays,
            selectedMonths,
            betweenMinuteStart,
            betweenMinuteEnd,
            betweenMonthStart,
            betweenMonthEnd,
            endType,
            endDate: endType === 'on' ? endDate : null,
            occurrences: endType === 'after' ? occurrences : null,
            cronExpression: buildCronExpression(),
        };
        onSave(recurringData);
        // Parent component handles closing the modal after saving
    };

    const handleCancel = () => {
        // Reset all state to initial values
        setHourMode(initialData?.hourMode || "specific");
        setMinuteMode(initialData?.minuteMode || "specific");
        setDayMode(initialData?.dayMode || "weekdays");
        setMonthMode(initialData?.monthMode || "all");
        setSelectedHours(initialData?.selectedHours || ["12"]);
        setSelectedMinutes(initialData?.selectedMinutes || ["00"]);
        setSelectedWeekdays(initialData?.selectedWeekdays || ["Monday", "Tuesday"]);
        setSelectedDays(initialData?.selectedDays || []);
        setSelectedMonths(initialData?.selectedMonths || []);
        setBetweenMinuteStart(initialData?.betweenMinuteStart || "00");
        setBetweenMinuteEnd(initialData?.betweenMinuteEnd || "59");
        setBetweenMonthStart(initialData?.betweenMonthStart || "January");
        setBetweenMonthEnd(initialData?.betweenMonthEnd || "December");
        setEndType(initialData?.endType || "never");
        setEndDate(initialData?.endDate || "2026-04-13");
        setOccurrences(initialData?.occurrences || 13);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-5xl mx-4">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b">
                    <h2 className="text-2xl font-normal">Custom recurrence</h2>
                    <button
                        type="button"
                        onClick={handleCancel}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6 overflow-y-auto max-h-[70vh]">
                    {/* Main Container with Dashed Border */}
                    <div className="border-2 border-dashed border-gray-400 bg-white">
                        {/* Column Headers */}
                        <div className="grid grid-cols-4 border-b border-gray-300">
                            <div className="bg-gray-100 p-4 border-r border-gray-300">
                                <h4 className="font-medium text-[#C72030] text-center">
                                    Hours
                                </h4>
                            </div>
                            <div className="bg-gray-100 p-4 border-r border-gray-300">
                                <h4 className="font-medium text-[#C72030] text-center">
                                    Minutes
                                </h4>
                            </div>
                            <div className="bg-gray-100 p-4 border-r border-gray-300">
                                <h4 className="font-medium text-[#C72030] text-center">
                                    Day
                                </h4>
                            </div>
                            <div className="bg-gray-100 p-4">
                                <h4 className="font-medium text-[#C72030] text-center">
                                    Month
                                </h4>
                            </div>
                        </div>

                        {/* Content Grid */}
                        <div className="grid grid-cols-4">
                            {/* Hours Column */}
                            <div className="border-r border-gray-300 p-4">
                                <div className="space-y-4">
                                    <RadioGroup
                                        value={hourMode}
                                        onValueChange={(value) => {
                                            setHourMode(value);
                                        }}
                                    >
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem
                                                value="specific"
                                                id="hour-specific"
                                            />
                                            <Label htmlFor="hour-specific" className="text-sm">
                                                Choose one or more specific hours
                                            </Label>
                                        </div>
                                    </RadioGroup>

                                    <div className="flex items-center space-x-2">
                                        <Checkbox
                                            id="select-all-hours"
                                            checked={selectedHours.length === hours.length}
                                            onCheckedChange={(checked) => {
                                                const newHours = checked ? hours : [];
                                                setSelectedHours(newHours);
                                            }}
                                            className="data-[state=checked]:bg-[#C72030] data-[state=checked]:border-[#C72030]"
                                        />
                                        <Label htmlFor="select-all-hours" className="text-sm">
                                            Select All
                                        </Label>
                                    </div>

                                    <div className="grid grid-cols-6 gap-2">
                                        {hours.map((hour) => (
                                            <div key={hour} className="flex items-center space-x-1">
                                                <Checkbox
                                                    id={`hour-${hour}`}
                                                    checked={selectedHours.includes(hour)}
                                                    onCheckedChange={(checked) => {
                                                        const newHours = checked
                                                            ? [...selectedHours, hour]
                                                            : selectedHours.filter((h) => h !== hour);
                                                        setSelectedHours(newHours);
                                                    }}
                                                    className="h-4 w-4 data-[state=checked]:bg-[#C72030] data-[state=checked]:border-[#C72030]"
                                                />
                                                <Label htmlFor={`hour-${hour}`} className="text-xs">
                                                    {hour}
                                                </Label>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Minutes Column */}
                            <div className="border-r border-gray-300 p-4">
                                <div className="space-y-4">
                                    <RadioGroup
                                        value={minuteMode}
                                        onValueChange={(value) => {
                                            setMinuteMode(value);
                                        }}
                                    >
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem
                                                value="specific"
                                                id="minute-specific"
                                            />
                                            <Label htmlFor="minute-specific" className="text-sm">
                                                Specific minutes (choose one or many)
                                            </Label>
                                        </div>

                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem
                                                value="between"
                                                id="minute-between"
                                            />
                                            <Label htmlFor="minute-between" className="text-sm">
                                                Every minute between minute
                                            </Label>
                                        </div>
                                    </RadioGroup>

                                    {minuteMode === "specific" && (
                                        <div className="grid grid-cols-4 gap-2">
                                            {specificMinutes.map((minute) => (
                                                <div
                                                    key={minute}
                                                    className="flex items-center space-x-1"
                                                >
                                                    <Checkbox
                                                        id={`minute-${minute}`}
                                                        checked={selectedMinutes.includes(minute)}
                                                        onCheckedChange={(checked) => {
                                                            const newMinutes = checked
                                                                ? [...selectedMinutes, minute]
                                                                : selectedMinutes.filter((m) => m !== minute);
                                                            setSelectedMinutes(newMinutes);
                                                        }}
                                                        className="h-4 w-4 data-[state=checked]:bg-[#C72030] data-[state=checked]:border-[#C72030]"
                                                    />
                                                    <Label
                                                        htmlFor={`minute-${minute}`}
                                                        className="text-xs"
                                                    >
                                                        {minute}
                                                    </Label>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {minuteMode === "between" && (
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-2 text-sm">
                                                <Select
                                                    value={betweenMinuteStart}
                                                    onValueChange={(value) => {
                                                        setBetweenMinuteStart(value);
                                                    }}
                                                >
                                                    <SelectTrigger className="w-16 h-8">
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {allMinutes.map((minute) => (
                                                            <SelectItem key={minute} value={minute}>
                                                                {minute}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm">
                                                <span>and minute</span>
                                                <Select
                                                    value={betweenMinuteEnd}
                                                    onValueChange={(value) => {
                                                        setBetweenMinuteEnd(value);
                                                    }}
                                                >
                                                    <SelectTrigger className="w-16 h-8">
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {allMinutes.map((minute) => (
                                                            <SelectItem key={minute} value={minute}>
                                                                {minute}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Days Column */}
                            <div className="border-r border-gray-300 p-4">
                                <div className="space-y-4">
                                    <RadioGroup
                                        value={dayMode}
                                        onValueChange={(value) => {
                                            setDayMode(value);
                                        }}
                                    >
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem
                                                value="weekdays"
                                                id="day-weekdays"
                                            />
                                            <Label htmlFor="day-weekdays" className="text-sm">
                                                Days of week
                                            </Label>
                                        </div>

                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="specific" id="day-specific" />
                                            <Label htmlFor="day-specific" className="text-sm">
                                                Specific date of month (choose one or many)
                                            </Label>
                                        </div>
                                    </RadioGroup>

                                    {dayMode === "weekdays" && (
                                        <div className="space-y-2">
                                            <div className="flex items-center space-x-2">
                                                <Checkbox
                                                    id="select-all-weekdays"
                                                    checked={
                                                        selectedWeekdays.length === weekdays.length
                                                    }
                                                    onCheckedChange={(checked) => {
                                                        const newWeekdays = checked ? weekdays : [];
                                                        setSelectedWeekdays(newWeekdays);
                                                    }}
                                                    className="data-[state=checked]:bg-[#C72030] data-[state=checked]:border-[#C72030]"
                                                />
                                                <Label
                                                    htmlFor="select-all-weekdays"
                                                    className="text-sm"
                                                >
                                                    Select All
                                                </Label>
                                            </div>
                                            {weekdays.map((day) => (
                                                <div
                                                    key={day}
                                                    className="flex items-center space-x-2"
                                                >
                                                    <Checkbox
                                                        id={`weekday-${day}`}
                                                        checked={selectedWeekdays.includes(day)}
                                                        onCheckedChange={(checked) => {
                                                            const newWeekdays = checked
                                                                ? [...selectedWeekdays, day]
                                                                : selectedWeekdays.filter((w) => w !== day);
                                                            setSelectedWeekdays(newWeekdays);
                                                        }}
                                                        className="h-4 w-4 data-[state=checked]:bg-[#C72030] data-[state=checked]:border-[#C72030]"
                                                    />
                                                    <Label
                                                        htmlFor={`weekday-${day}`}
                                                        className="text-sm"
                                                    >
                                                        {day}
                                                    </Label>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {dayMode === "specific" && (
                                        <div className="space-y-3">
                                            <div className="flex items-center space-x-2">
                                                <Checkbox
                                                    id="select-all-days"
                                                    checked={selectedDays.length === daysList.length}
                                                    onCheckedChange={(checked) => {
                                                        const newDays = checked ? daysList : [];
                                                        setSelectedDays(newDays);
                                                    }}
                                                    className="data-[state=checked]:bg-[#C72030] data-[state=checked]:border-[#C72030]"
                                                />
                                                <Label htmlFor="select-all-days" className="text-sm">
                                                    Select All
                                                </Label>
                                            </div>
                                            <div className="grid grid-cols-6 gap-1">
                                                {daysList.map((day) => (
                                                    <div
                                                        key={day}
                                                        className="flex items-center space-x-1"
                                                    >
                                                        <Checkbox
                                                            id={`day-${day}`}
                                                            checked={selectedDays.includes(day)}
                                                            onCheckedChange={(checked) => {
                                                                const newDays = checked
                                                                    ? [...selectedDays, day]
                                                                    : selectedDays.filter((d) => d !== day);
                                                                setSelectedDays(newDays);
                                                            }}
                                                            className="h-4 w-4 data-[state=checked]:bg-[#C72030] data-[state=checked]:border-[#C72030]"
                                                        />
                                                        <Label htmlFor={`day-${day}`} className="text-xs">
                                                            {day}
                                                        </Label>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Months Column */}
                            <div className="p-4">
                                <div className="space-y-4">
                                    <RadioGroup
                                        value={monthMode}
                                        onValueChange={(value) => {
                                            setMonthMode(value);
                                        }}
                                    >
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem
                                                value="all"
                                                id="month-all"
                                            />
                                            <Label htmlFor="month-all" className="text-sm">
                                                All months
                                            </Label>
                                        </div>

                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem
                                                value="specific"
                                                id="month-specific"
                                            />
                                            <Label htmlFor="month-specific" className="text-sm">
                                                Specific months
                                            </Label>
                                        </div>

                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem
                                                value="between"
                                                id="month-between"
                                            />
                                            <Label htmlFor="month-between" className="text-sm">
                                                Every month between
                                            </Label>
                                        </div>
                                    </RadioGroup>

                                    {monthMode === "specific" && (
                                        <div className="space-y-2">
                                            <div className="flex items-center space-x-2">
                                                <Checkbox
                                                    id="select-all-months"
                                                    checked={selectedMonths.length === months.length}
                                                    onCheckedChange={(checked) => {
                                                        const newMonths = checked ? months : [];
                                                        setSelectedMonths(newMonths);
                                                    }}
                                                    className="data-[state=checked]:bg-[#C72030] data-[state=checked]:border-[#C72030]"
                                                />
                                                <Label
                                                    htmlFor="select-all-months"
                                                    className="text-sm"
                                                >
                                                    Select All
                                                </Label>
                                            </div>
                                            <div className="grid grid-cols-2 gap-2">
                                                {months.map((month) => (
                                                    <div
                                                        key={month}
                                                        className="flex items-center space-x-2"
                                                    >
                                                        <Checkbox
                                                            id={`month-${month}`}
                                                            checked={selectedMonths.includes(month)}
                                                            onCheckedChange={(checked) => {
                                                                const newMonths = checked
                                                                    ? [...selectedMonths, month]
                                                                    : selectedMonths.filter((m) => m !== month);
                                                                setSelectedMonths(newMonths);
                                                            }}
                                                            className="h-4 w-4 data-[state=checked]:bg-[#C72030] data-[state=checked]:border-[#C72030]"
                                                        />
                                                        <Label
                                                            htmlFor={`month-${month}`}
                                                            className="text-sm"
                                                        >
                                                            {month}
                                                        </Label>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {monthMode === "between" && (
                                        <div className="space-y-2">
                                            <Select
                                                value={betweenMonthStart}
                                                onValueChange={(value) => {
                                                    setBetweenMonthStart(value);
                                                }}
                                            >
                                                <SelectTrigger className="w-32 h-8">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {months.map((month) => (
                                                        <SelectItem key={month} value={month}>
                                                            {month}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm">and</span>
                                                <Select
                                                    value={betweenMonthEnd}
                                                    onValueChange={(value) => {
                                                        setBetweenMonthEnd(value);
                                                    }}
                                                >
                                                    <SelectTrigger className="w-32 h-8">
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {months.map((month) => (
                                                            <SelectItem key={month} value={month}>
                                                                {month}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Cron Expression Display */}
                <div className="px-6 py-4 border-t bg-gray-50">
                    <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-gray-700">Cron:</span>
                        <span className="font-mono text-sm text-gray-900 bg-white px-3 py-1 rounded border border-gray-200">
                            {buildCronExpression()}
                        </span>
                    </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-end gap-3 p-6 border-t">
                    <button
                        type="button"
                        onClick={handleCancel}
                        className="px-6 py-2 text-[#C72030] font-medium hover:bg-red-50 rounded transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={handleSave}
                        className="px-6 py-2 bg-[#C72030] text-white font-medium rounded hover:bg-[#d0606e] transition-colors"
                    >
                        Done
                    </button>
                </div>
            </div>
        </div>
    );
};