import { ChevronDown } from 'lucide-react';
import { useState, useEffect } from 'react';

export const TaskDatePicker = ({
    onDateSelect,
    selectedDate,
    startDate = null,
    userAvailability = [],
    setShowCalender,
    shift = {},
    maxDate = null,
}) => {
    const today = new Date();

    const getDateFromObject = (dateObj) => {
        if (!dateObj) return null;
        if (dateObj instanceof Date) return dateObj;
        if (dateObj.year && typeof dateObj.month === 'number' && dateObj.date) {
            return new Date(dateObj.year, dateObj.month, dateObj.date);
        }
        return null;
    };

    const initialDate = startDate ? getDateFromObject(startDate) : today;

    const [currentMonth, setCurrentMonth] = useState(initialDate.getMonth());
    const [currentYear, setCurrentYear] = useState(initialDate.getFullYear());

    const daysOfWeek = ['S', 'M', 'T', 'W', 'Th', 'F', 'S'];
    const monthNames = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December',
    ];

    useEffect(() => {
        if (startDate) {
            const sd = getDateFromObject(startDate);
            if (sd) {
                setCurrentMonth(sd.getMonth());
                setCurrentYear(sd.getFullYear());
            }
        }
    }, [startDate]);

    const getWeekDates = () => {
        const rawBase = startDate ? getDateFromObject(startDate) : new Date();
        if (!rawBase) return [];

        const baseDate = new Date(rawBase.getFullYear(), rawBase.getMonth(), rawBase.getDate());

        const weekDates = [];

        for (let i = 0; i < 11; i++) {
            const d = new Date(baseDate);
            d.setDate(baseDate.getDate() + i);

            const formattedDate = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

            const availability = userAvailability?.find((a) => a.date === formattedDate);

            weekDates.push({
                date: d.getDate(),
                dayOfWeek: daysOfWeek[d.getDay()],
                hours: availability ? String(availability.allocated_hours).padStart(2, '0') : '00',
                hasData: !!availability,
                month: d.getMonth(),
                year: d.getFullYear(),
            });
        }

        return weekDates;
    };

    const allDates = getWeekDates();

    const parseShiftNoOfDays = (shift) => {
        if (!shift || !shift.no_of_days) return null;

        const roasterType = (shift.roaster_type || shift.roasterType || '').toString();

        if (roasterType === 'Recurring') {
            let obj = null;
            if (Array.isArray(shift.no_of_days) && typeof shift.no_of_days[0] === 'object') {
                obj = shift.no_of_days[0] || {};
            } else if (typeof shift.no_of_days === 'object') {
                obj = shift.no_of_days;
            }
            if (!obj) return { roasterType };

            const recurring = {};
            Object.keys(obj).forEach((k) => {
                const arr = Array.isArray(obj[k]) ? obj[k] : [];
                recurring[k] = arr.map((v) => Number(v)).filter(Boolean);
            });

            return { roasterType: 'Recurring', recurring };
        }

        const arr = Array.isArray(shift.no_of_days) ? shift.no_of_days : [];
        const working = arr.map((v) => Number(v)).filter(Boolean);
        return { roasterType: roasterType || 'Weekdays/Weekends', working };
    };

    const getWeekOfMonth = (date) => {
        const day = date.getDate();
        return Math.floor((day - 1) / 7) + 1;
    };

    const isDateWorking = (date, shift) => {
        const parsed = parseShiftNoOfDays(shift);
        if (!parsed) {
            const jsDay = date.getDay();
            return jsDay !== 0 && jsDay !== 6;
        }

        const jsDay = date.getDay();
        const dayNumber = jsDay === 0 ? 7 : jsDay;

        if (parsed.roasterType === 'Recurring') {
            const week = String(getWeekOfMonth(date));
            const arr = parsed.recurring[week] || [];
            return arr.includes(dayNumber);
        }

        // Weekdays/Weekends mode
        return parsed.working.includes(dayNumber);
    };

    return (
        <div className="w-full max-w-4xl bg-white rounded-lg shadow-lg py-6 relative">
            <div className="flex justify-end items-center mb-1">
                <span className="text-sm font-semibold text-gray-700">
                    {monthNames[currentMonth]}, {currentYear}
                </span>
            </div>

            <div className="flex justify-center px-6">
                {allDates.map((dateItem) => {
                    const isSelected =
                        selectedDate?.date === dateItem.date &&
                        selectedDate?.month === dateItem.month &&
                        selectedDate?.year === dateItem.year;

                    const isCurrentMonth = dateItem.month === currentMonth && dateItem.year === currentYear;

                    const itemDate = new Date(dateItem.year, dateItem.month, dateItem.date);
                    const isWeekoff = !isDateWorking(itemDate, shift);

                    const isAfterMaxDate = maxDate
                        ? new Date(dateItem.year, dateItem.month, dateItem.date) >
                        new Date(maxDate.year, maxDate.month, maxDate.date)
                        : false;

                    return (
                        <button
                            key={`${dateItem.year}-${dateItem.month}-${dateItem.date}`}
                            type="button"
                            onClick={() => onDateSelect(dateItem)}
                            disabled={isWeekoff || isAfterMaxDate}
                            className={`flex flex-col items-center justify-center min-w-[60px] p-3 rounded-lg transition-all ${isSelected
                                ? 'border-[#c72030] bg-red-50'
                                : isWeekoff || isAfterMaxDate
                                    ? 'border-gray-200 bg-gray-100 opacity-60 cursor-not-allowed'
                                    : isCurrentMonth
                                        ? 'border-gray-200 bg-white hover:border-gray-300'
                                        : 'border-gray-100 bg-gray-50 hover:border-gray-200 opacity-60'
                                }`}
                        >
                            <span
                                className={`text-base font-medium mb-1 ${isCurrentMonth ? 'text-gray-600' : 'text-gray-400'}`}
                            >
                                {dateItem.dayOfWeek}
                            </span>
                            <span
                                className={`text-base font-medium ${isSelected ? 'text-red-600' : isCurrentMonth ? 'text-gray-800' : 'text-gray-400'
                                    }`}
                            >
                                {dateItem.date.toString().padStart(2, '0')}
                            </span>
                            <span
                                className={`w-full h-[2px] my-1 ${Number(((dateItem.hours / 8) * 100).toFixed(2)) < 33 ? 'bg-[#1FCFB3]' : Number(((dateItem.hours / 8) * 100).toFixed(2)) < 66 ? 'bg-[#ED9017]' : 'bg-[#C72030]'}`}
                            ></span>
                            <span
                                className={`flex flex-col items-center ${isCurrentMonth ? 'text-gray-500' : 'text-gray-400'}`}
                            >
                                <span className="text-base font-medium text-black">{dateItem.hours}</span>
                                <span className="!text-[10px]">hrs</span>
                            </span>
                        </button>
                    );
                })}
            </div>

            <div className="flex items-center justify-center absolute bottom-0 left-[50%] translate-x-[-50%] z-20">
                <button type="button" onClick={() => setShowCalender(true)} className="p-1 rounded">
                    <ChevronDown className="w-5 h-5" />
                </button>
            </div>
        </div>
    );
};