
import React, { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isToday, isBefore, startOfDay } from 'date-fns';
import { cn } from '@/lib/utils';

interface ComprehensiveDatePickerProps {
  value?: Date;
  onChange?: (date: Date) => void;
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
    onChange?.(date);
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
    onChange?.(today);
  };

  const handleClear = () => {
    setSelectedDate(undefined);
    onChange?.(undefined as any);
  };

  const isDateDisabled = (date: Date) => {
    if (minDate && isBefore(date, startOfDay(minDate))) return true;
    if (maxDate && isBefore(startOfDay(maxDate), date)) return true;
    return false;
  };

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className={cn(
      "comprehensive-date-picker bg-white rounded-none shadow-lg border-0",
      "transition-all duration-300 ease-in-out",
      className
    )}>
      {/* Header */}
      <div className="date-picker-header flex items-center justify-between p-4 border-b border-gray-100">
        <button
          onClick={handlePrevMonth}
          className="nav-button p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
          aria-label="Previous month"
        >
          <ChevronLeft className="w-4 h-4 text-gray-600" />
        </button>
        
        <h2 className="month-year-title font-medium text-gray-900">
          {format(currentMonth, 'MMMM yyyy')}
        </h2>
        
        <button
          onClick={handleNextMonth}
          className="nav-button p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
          aria-label="Next month"
        >
          <ChevronRight className="w-4 h-4 text-gray-600" />
        </button>
      </div>

      {/* Week Days Header */}
      <div className="week-days-header grid grid-cols-7 border-b border-gray-100">
        {weekDays.map((day) => (
          <div
            key={day}
            className="weekday-cell text-center py-2 text-gray-500 font-medium text-sm"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="calendar-grid grid grid-cols-7 gap-0">
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
                "date-cell relative h-10 w-full flex items-center justify-center",
                "transition-all duration-200 ease-in-out",
                "hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50",
                {
                  'bg-red-500 text-white rounded-full': isSelected,
                  'border border-red-500 text-red-500 font-semibold rounded-full': isTodayDate && !isSelected,
                  'bg-gray-100': isHovered && !isSelected,
                  'text-gray-400 cursor-not-allowed': isDisabled,
                  'text-gray-900': !isDisabled && !isSelected && !isTodayDate
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

      {/* Footer Actions */}
      <div className="date-picker-footer flex items-center justify-between p-4 border-t border-gray-100">
        <div className="flex gap-2">
          {showToday && (
            <button
              onClick={handleTodayClick}
              className="today-button px-3 py-1 text-sm text-red-500 hover:bg-red-50 rounded transition-colors duration-200"
            >
              Today
            </button>
          )}
          <button
            onClick={handleClear}
            className="clear-button px-3 py-1 text-sm text-gray-500 hover:bg-gray-100 rounded transition-colors duration-200"
          >
            Clear
          </button>
        </div>
        
        {onClose && (
          <button
            onClick={onClose}
            className="close-button px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded transition-colors duration-200"
          >
            Cancel
          </button>
        )}
      </div>
    </div>
  );
};
