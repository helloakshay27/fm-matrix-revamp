
import React, { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight, ChevronDown } from 'lucide-react';
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
    
    // Convert Sunday = 0 to Monday = 0 format
    const mondayStartWeekday = startWeekday === 0 ? 6 : startWeekday - 1;
    const mondayEndWeekday = endWeekday === 0 ? 6 : endWeekday - 1;
    
    const paddingStart = Array(mondayStartWeekday).fill(null);
    const paddingEnd = Array(6 - mondayEndWeekday).fill(null);
    
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
      "date-picker-container",
      className
    )}>
      {/* Header with Month/Year and Navigation */}
      <div className="date-picker-header">
        <div className="month-year-section">
          <span className="month-year-text">
            {format(currentMonth, 'MMMM yyyy')}
          </span>
          <ChevronDown className="dropdown-arrow" />
        </div>
        
        <div className="navigation-arrows">
          <button
            onClick={handlePrevMonth}
            className="nav-arrow-btn"
            aria-label="Previous month"
          >
            <ChevronLeft className="nav-arrow" />
          </button>
          <button
            onClick={handleNextMonth}
            className="nav-arrow-btn"
            aria-label="Next month"
          >
            <ChevronRight className="nav-arrow" />
          </button>
        </div>
      </div>

      {/* Week Days Header */}
      <div className="week-days-row">
        {weekDays.map((day, index) => (
          <div key={index} className="week-day-cell">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="calendar-dates-grid">
        {calendarDays.map((date, index) => {
          if (!date) {
            return <div key={index} className="empty-date-cell" />;
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
                "date-number-cell",
                {
                  'selected-date': isSelected,
                  'today-date': isTodayDate && !isSelected,
                  'disabled-date': isDisabled,
                  'hovered-date': isHovered && !isSelected && !isDisabled
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

      {/* Footer with Action Buttons */}
      <div className="date-picker-footer">
        <button
          onClick={handleCancel}
          className="action-button cancel-btn"
        >
          CANCEL
        </button>
        <button
          onClick={handleOK}
          className="action-button ok-btn"
        >
          OK
        </button>
      </div>
    </div>
  );
};
