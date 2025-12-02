import React, { useState, forwardRef, useEffect, useRef, ReactNode } from 'react';
import { ChevronLeft, ChevronRight, ChevronUp, X } from 'lucide-react';

interface CustomCalendarProps {
    initialDate?: Date;
    selectedDate?: any;
    eventDates?: Date[];
    taskHoursData?: any[];
    onDateSelect?: (date: any) => void;
    onMonthChange?: (date: Date) => void;
    setShowCalender?: (show: boolean) => void;
}

export const CustomCalender = forwardRef<HTMLDivElement, CustomCalendarProps>(({
    initialDate = new Date(),
    selectedDate: propSelectedDate,
    eventDates = [],
    taskHoursData = [],
    onDateSelect = () => { },
    onMonthChange = () => { },
    setShowCalender,
}, forwardedRef) => {
    const today = new Date();
    const calendarRef = useRef(null);

    // Scroll to top when calendar is visible
    useEffect(() => {
        if (calendarRef.current) {
            setTimeout(() => {
                calendarRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 0);
        }
    }, []);

    // Default to current month and today as selected
    const [currentDate, setCurrentDate] = useState(initialDate || today);

    // Normalize selectedDate to an object shape { date, month, year }
    const getDateFromObject = (dateObj) => {
        if (!dateObj) return null;
        if (dateObj instanceof Date) return { date: dateObj.getDate(), month: dateObj.getMonth(), year: dateObj.getFullYear() };
        if (dateObj.year !== undefined && typeof dateObj.month === 'number' && dateObj.date !== undefined) {
            return { date: dateObj.date, month: dateObj.month, year: dateObj.year };
        }
        return null;
    };

    const [selectedDate, setSelectedDate] = useState(getDateFromObject(propSelectedDate) || { date: today.getDate(), month: today.getMonth(), year: today.getFullYear() });

    // Weekday labels (start week on Sunday)
    const daysOfWeek = ['Su', 'M', 'T', 'W', 'Th', 'F', 'Sa'];

    const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];



    const getDaysInMonth = (date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        return new Date(year, month + 1, 0).getDate();
    };

    const getFirstDayOfMonth = (date) => {
        return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    };

    // Accept either a Date or an object {date, month, year} for selected date
    const isSameDay = (date1, date2) => {
        if (!date1 || !date2) return false;
        const d1 = date1 instanceof Date ? date1 : new Date(date1.year, date1.month, date1.date);
        const d2 = date2 instanceof Date ? date2 : new Date(date2.year, date2.month, date2.date);
        return (
            d1.getDate() === d2.getDate() &&
            d1.getMonth() === d2.getMonth() &&
            d1.getFullYear() === d2.getFullYear()
        );
    };

    const hasEvent = (day, month, year) => {
        return eventDates.some(eventDate =>
            eventDate.getDate() === day &&
            eventDate.getMonth() === month &&
            eventDate.getFullYear() === year
        );
    };

    // Return hours (padded), percentage and color for a given date using taskHoursData
    const getTaskHoursForDate = (day, month, year) => {
        const formattedDate = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

        const matchingData = taskHoursData.find(data => {
            const dataDate = typeof data.date === 'string' ? data.date : data.date.toISOString().split('T')[0];
            return dataDate === formattedDate;
        });

        if (!matchingData) return { hours: '00', percentage: 0, color: null };

        const hoursNum = Number(matchingData.hours) || 0;
        const percentage = (hoursNum / 8) * 100;
        let color = '#c72030';
        if (percentage <= 33) color = '#1FCFB3';
        else if (percentage <= 66) color = '#ED9017';

        return { hours: String(hoursNum).padStart(2, '0'), percentage, color };
    };

    const generateCalendarDays = () => {
        const daysInMonth = getDaysInMonth(currentDate);
        const firstDay = getFirstDayOfMonth(currentDate);
        const days = [];
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();

        const prevMonth = new Date(year, month - 1, 1);
        const daysInPrevMonth = getDaysInMonth(prevMonth);

        // Days from previous month
        for (let i = firstDay - 1; i >= 0; i--) {
            days.push({
                day: daysInPrevMonth - i,
                isCurrentMonth: false,
                month: month - 1,
                year: month === 0 ? year - 1 : year
            });
        }

        // Current month days
        for (let day = 1; day <= daysInMonth; day++) {
            days.push({
                day,
                isCurrentMonth: true,
                month,
                year
            });
        }

        // Next month days to fill grid (6 rows)
        const remainingDays = 42 - days.length;
        for (let day = 1; day <= remainingDays; day++) {
            days.push({
                day,
                isCurrentMonth: false,
                month: month + 1,
                year: month === 11 ? year + 1 : year
            });
        }

        return days;
    };

    const handlePrevMonth = () => {
        const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
        setCurrentDate(newDate);
        onMonthChange(newDate);
    };

    const handleNextMonth = () => {
        const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1);
        setCurrentDate(newDate);
        onMonthChange(newDate);
    };

    const isDateBeforeToday = (day, month, year) => {
        const checkDate = new Date(year, month, day);
        const todayDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        return checkDate < todayDate;
    };

    const handleDateClick = (dayObj) => {
        // Prevent selecting dates before today
        if (isDateBeforeToday(dayObj.day, dayObj.month, dayObj.year)) {
            return;
        }

        const clickedDate = {
            date: dayObj.day,
            month: dayObj.month,
            year: dayObj.year
        };
        setSelectedDate(clickedDate);
        onDateSelect(clickedDate);
        // Close calendar first
        setShowCalender(false);

        // Smooth-scroll to the provided forwardedRef (if available).
        // Delay slightly so any closing animation/DOM changes can happen first.
        try {
            const target = forwardedRef && forwardedRef.current ? forwardedRef.current : null;
            if (target && typeof target.scrollIntoView === 'function') {
                setTimeout(() => {
                    target.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }, 100);
            }
        } catch (e) {
            // noop - scrolling is optional
        }

    };

    const calendarDays = generateCalendarDays();

    return (
        <div ref={calendarRef} className="w-full mx-auto bg-white rounded-2xl shadow-lg py-4 my-3">
            {/* Header */}
            <div className="flex items-center justify-end gap-1 mb-3 mr-4">
                <button
                    type='button'
                    onClick={handlePrevMonth}
                    className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                    aria-label="Previous month"
                >
                    <ChevronLeft className="w-4 h-4" />
                </button>

                <h2 className="text-sm font-medium">
                    {`${monthNames[currentDate.getMonth()]} ${currentDate.getFullYear()}`}
                </h2>

                <button
                    type='button'
                    onClick={handleNextMonth}
                    className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                    aria-label="Next month"
                >
                    <ChevronRight className="w-4 h-4" />
                </button>
                <button
                    type='button'
                    onClick={() => setShowCalender(false)}
                    className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                    aria-label="Next month"
                >
                    <X className="w-4 h-4" />
                </button>
            </div>

            {/* Week Days */}
            <div className="grid grid-cols-7 gap-1 mb-2">
                {daysOfWeek.map(day => (
                    <div key={day} className="text-center font-medium text-gray-700 text-[15px] py-1">
                        {day}
                    </div>
                ))}
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 space-y-2">
                {calendarDays.map((dayObj, index) => {
                    const dateObj = new Date(dayObj.year, dayObj.month, dayObj.day);
                    const selectedObj = selectedDate;
                    const isSelected = isSameDay(dateObj, selectedObj);
                    const isToday = isSameDay(dateObj, today);
                    const isDisabled = isDateBeforeToday(dayObj.day, dayObj.month, dayObj.year);
                    const taskData = getTaskHoursForDate(dayObj.day, dayObj.month, dayObj.year);

                    const isCurrentMonth = dayObj.month === currentDate.getMonth() && dayObj.year === currentDate.getFullYear();

                    return (
                        <button
                            type='button'
                            key={index}
                            onClick={() => handleDateClick(dayObj)}
                            disabled={isDisabled}
                            className={`
                                relative flex flex-col items-center justify-center rounded-md text-xs font-medium transition-all py-1 mx-2 min-h-[56px]
                                ${!dayObj.isCurrentMonth ? 'text-gray-300' : 'text-gray-900'}
                                ${isDisabled ? 'opacity-50 cursor-not-allowed text-gray-400' : isSelected ? 'border-[#c72030] bg-red-50' : 'hover:bg-gray-100'}
                                ${isToday && !isSelected && !isDisabled ? 'border border-red-300' : ''}
                            `}
                        >
                            <span className={`text-sm font-semibold ${isSelected ? 'text-gray-800' : isCurrentMonth ? 'text-gray-800' : 'text-gray-400'}`}>
                                {dayObj.day.toString().padStart(2, '0')}
                            </span>

                            <span className={`w-[50%] h-[2px] my-1 ${taskData.percentage < 33 ? 'bg-[#1FCFB3]' : taskData.percentage < 66 ? 'bg-[#ED9017]' : 'bg-[#C72030]'}`}></span>

                            <span className={`flex flex-col border rounded-sm ${isSelected ? 'border-gray-400' : 'border-gray-300'} px-2 items-center ${isCurrentMonth ? 'text-gray-500' : 'text-gray-400'}`}>
                                <span className={`text-sm font-medium ${isSelected ? 'text-gray-800' : isCurrentMonth ? 'text-gray-800' : 'text-gray-400'}`}>{taskData.hours}</span>
                                <span className='!text-[10px]'>hrs</span>
                            </span>
                        </button>
                    );
                })}
            </div>

            {/* Collapse Button */}
            {/* <div className="flex justify-center mt-3">
                <button
                    type='button'
                    className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                    onClick={() => setShowCalender(false)}
                >
                    <ChevronUp className="w-5 h-5 text-gray-400" />
                </button>
            </div> */}
        </div>
    );
});
