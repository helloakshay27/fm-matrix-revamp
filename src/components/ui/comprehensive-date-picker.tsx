
import React, { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isToday, isBefore, startOfDay } from 'date-fns';
import { cn } from '@/lib/utils';

interface ComprehensiveDatePickerProps {
  value?: Date;
  onChange?: (date: Date | undefined) => void;
  onClose?: () => void;
  showToday?: boolean;
  disabled?: boolean;
  minDate?: Date;
  maxDate?: Date;
  className?: string;
}

export const ComprehensiveDatePicker: React.FC<ComprehensiveDatePickerProps> = ({
  value,
  onChange,
  onClose,
  showToday = true,
  disabled = false,
  minDate,
  maxDate,
  className
}) => {
  const [currentMonth, setCurrentMonth] = useState(() => value || new Date());
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(value);
  const [hoveredDate, setHoveredDate] = useState<Date | undefined>();

  // Update selected date when value prop changes
  useEffect(() => {
    setSelectedDate(value);
    if (value) {
      setCurrentMonth(value);
    }
  }, [value]);

  // Generate calendar days
  const generateCalendarDays = useCallback(() => {
    const start = startOfMonth(currentMonth);
    const end = endOfMonth(currentMonth);
    const days = eachDayOfInterval({ start, end });
    
    // Add padding days for proper grid layout
    const startWeekday = start.getDay();
    const endWeekday = end.getDay();
    
    const paddingStart = Array(startWeekday).fill(null);
    const paddingEnd = Array(6 - endWeekday).fill(null);
    
    return [...paddingStart, ...days, ...paddingEnd];
  }, [currentMonth]);

  const calendarDays = generateCalendarDays();

  const handleDateClick = (date: Date) => {
    if (disabled) return;
    
    // Check if date is disabled
    if (minDate && isBefore(date, startOfDay(minDate))) return;
    if (maxDate && isBefore(startOfDay(maxDate), date)) return;
    
    setSelectedDate(date);
  };

  const handlePrevMonth = () => {
    setCurrentMonth(prev => subMonths(prev, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(prev => addMonths(prev, 1));
  };

  const handleTodayClick = () => {
    const today = new Date();
    setCurrentMonth(today);
    setSelectedDate(today);
  };

  const handleOK = () => {
    if (selectedDate) {
      onChange?.(selectedDate);
    }
    onClose?.();
  };

  const handleCancel = () => {
    setSelectedDate(value); // Reset to original value
    onClose?.();
  };

  const isDateDisabled = (date: Date) => {
    if (minDate && isBefore(date, startOfDay(minDate))) return true;
    if (maxDate && isBefore(startOfDay(maxDate), date)) return true;
    return false;
  };

  const weekDays = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

  return (
    <div className={cn(
      "comprehensive-date-picker bg-white shadow-lg border-0",
      "w-[328px] h-[386px]",
      className
    )}>
      {/* Header */}
      <div className="date-picker-header flex items-center justify-between px-6 py-4">
        <button
          onClick={handlePrevMonth}
          className="nav-button p-1 hover:bg-gray-100 rounded transition-colors duration-200"
          aria-label="Previous month"
        >
          <ChevronLeft className="w-5 h-5 text-gray-600" />
        </button>
        
        <h2 className="month-year-title text-lg font-normal text-gray-900">
          {format(currentMonth, 'MMMM yyyy')}
        </h2>
        
        <button
          onClick={handleNextMonth}
          className="nav-button p-1 hover:bg-gray-100 rounded transition-colors duration-200"
          aria-label="Next month"
        >
          <ChevronRight className="w-5 h-5 text-gray-600" />
        </button>
      </div>

      {/* Week Days Header */}
      <div className="week-days-header grid grid-cols-7 px-6 pb-2">
        {weekDays.map((day) => (
          <div
            key={day}
            className="weekday-cell text-center py-2 text-gray-500 font-normal text-sm"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="calendar-grid grid grid-cols-7 gap-1 px-6 pb-6">
        {calendarDays.map((date, index) => {
          if (!date) {
            return <div key={index} className="empty-cell h-10" />;
          }

          const isSelected = selectedDate && isSameDay(date, selectedDate);
          const isTodayDate = isToday(date);
          const isHovered = hoveredDate && isSameDay(date, hoveredDate);
          const isDisabled = isDateDisabled(date);

          return (
            <button
              key={date.toISOString()}
              onClick={() => handleDateClick(date)}
              onMouseEnter={() => setHoveredDate(date)}
              onMouseLeave={() => setHoveredDate(undefined)}
              disabled={isDisabled}
              className={cn(
                "date-cell relative h-10 w-10 flex items-center justify-center mx-auto",
                "text-base font-normal transition-all duration-200 ease-in-out",
                "hover:bg-gray-100 focus:outline-none",
                {
                  'bg-red-600 text-white rounded-full': isSelected,
                  'text-gray-900': !isDisabled && !isSelected,
                  'text-gray-400 cursor-not-allowed': isDisabled,
                  'bg-gray-100': isHovered && !isSelected
                }
              )}
              aria-label={format(date, 'EEEE, MMMM do, yyyy')}
              aria-selected={isSelected}
            >
              {format(date, 'd')}
            </button>
          );
        })}
      </div>

      {/* Footer with CANCEL and OK buttons */}
      <div className="date-picker-footer flex items-center justify-end gap-8 px-6 py-4 mt-auto">
        <button
          onClick={handleCancel}
          className="cancel-button text-red-600 font-medium text-sm hover:bg-red-50 px-3 py-1 rounded transition-colors duration-200"
        >
          CANCEL
        </button>
        <button
          onClick={handleOK}
          className="ok-button text-red-600 font-medium text-sm hover:bg-red-50 px-3 py-1 rounded transition-colors duration-200"
        >
          OK
        </button>
      </div>
    </div>
  );
};
