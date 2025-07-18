
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ChevronDown, ChevronUp, Check, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface TimeSlot {
  hours: {
    mode: 'specific' | 'range';
    specific: number[];
    range: { start: number; end: number };
  };
  minutes: {
    mode: 'specific' | 'range';  
    specific: number[];
    range: { start: number; end: number };
  };
  days: {
    mode: 'weekdays' | 'dates';
    weekdays: string[];
    dates: number[];
  };
  months: {
    mode: 'specific' | 'range';
    specific: number[];
    range: { start: number; end: number };
  };
}

interface TimeSetupStepProps {
  data: {
    timeSlots: TimeSlot;
    selectedDays: number[];
    selectedMonths: number[];
  };
  onChange: (field: string, value: any) => void;
  isCompleted?: boolean;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
  errors?: Record<string, string>;
}

export const TimeSetupStep = ({ 
  data, 
  onChange, 
  isCompleted = false, 
  isCollapsed = false, 
  onToggleCollapse,
  errors = {}
}: TimeSetupStepProps) => {
  
  // Initialize default data structure if not provided
  const timeSlots = data.timeSlots || {
    hours: { mode: 'specific', specific: [], range: { start: 0, end: 23 } },
    minutes: { mode: 'specific', specific: [], range: { start: 0, end: 59 } },
    days: { mode: 'weekdays', weekdays: [], dates: [] },
    months: { mode: 'specific', specific: [], range: { start: 0, end: 11 } }
  };

  const hours = Array.from({ length: 24 }, (_, i) => i);
  const predefinedMinutes = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55];
  const dates = Array.from({ length: 31 }, (_, i) => i + 1);
  const weekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const handleHourModeChange = (mode: 'specific' | 'range') => {
    onChange('timeSlots', {
      ...timeSlots,
      hours: { ...timeSlots.hours, mode }
    });
  };

  const handleSpecificHourToggle = (hour: number) => {
    const currentSpecific = timeSlots.hours.specific || [];
    const newSpecific = currentSpecific.includes(hour)
      ? currentSpecific.filter(h => h !== hour)
      : [...currentSpecific, hour];
    
    onChange('timeSlots', {
      ...timeSlots,
      hours: { ...timeSlots.hours, specific: newSpecific }
    });
  };

  const handleHourSelectAll = (checked: boolean) => {
    onChange('timeSlots', {
      ...timeSlots,
      hours: { ...timeSlots.hours, specific: checked ? hours : [] }
    });
  };

  const handleMinuteModeChange = (mode: 'specific' | 'range') => {
    onChange('timeSlots', {
      ...timeSlots,
      minutes: { ...timeSlots.minutes, mode }
    });
  };

  const handleSpecificMinuteToggle = (minute: number) => {
    const currentSpecific = timeSlots.minutes.specific || [];
    const newSpecific = currentSpecific.includes(minute)
      ? currentSpecific.filter(m => m !== minute)
      : [...currentSpecific, minute];
    
    onChange('timeSlots', {
      ...timeSlots,
      minutes: { ...timeSlots.minutes, specific: newSpecific }
    });
  };

  const handleDayModeChange = (mode: 'weekdays' | 'dates') => {
    onChange('timeSlots', {
      ...timeSlots,
      days: { ...timeSlots.days, mode }
    });
  };

  const handleWeekdayToggle = (weekday: string) => {
    const currentWeekdays = timeSlots.days.weekdays || [];
    const newWeekdays = currentWeekdays.includes(weekday)
      ? currentWeekdays.filter(w => w !== weekday)
      : [...currentWeekdays, weekday];
    
    onChange('timeSlots', {
      ...timeSlots,
      days: { ...timeSlots.days, weekdays: newWeekdays }
    });
  };

  const handleDateToggle = (date: number) => {
    const currentDates = timeSlots.days.dates || [];
    const newDates = currentDates.includes(date)
      ? currentDates.filter(d => d !== date)
      : [...currentDates, date];
    
    onChange('timeSlots', {
      ...timeSlots,
      days: { ...timeSlots.days, dates: newDates }
    });
  };

  const handleMonthModeChange = (mode: 'specific' | 'range') => {
    onChange('timeSlots', {
      ...timeSlots,
      months: { ...timeSlots.months, mode }
    });
  };

  const handleSpecificMonthToggle = (monthIndex: number) => {
    const currentSpecific = timeSlots.months.specific || [];
    const newSpecific = currentSpecific.includes(monthIndex)
      ? currentSpecific.filter(m => m !== monthIndex)
      : [...currentSpecific, monthIndex];
    
    onChange('timeSlots', {
      ...timeSlots,
      months: { ...timeSlots.months, specific: newSpecific }
    });
  };

  const handleMonthSelectAll = (checked: boolean) => {
    onChange('timeSlots', {
      ...timeSlots,
      months: { ...timeSlots.months, specific: checked ? months.map((_, i) => i) : [] }
    });
  };

  // Collapsed view
  if (isCompleted && isCollapsed) {
    return (
      <Card className="mb-6 border-green-200 bg-green-50">
        <CardHeader 
          className="cursor-pointer flex flex-row items-center justify-between py-4"
          onClick={onToggleCollapse}
        >
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-sm">
              <Check className="w-4 h-4" />
            </div>
            <CardTitle className="text-lg text-green-700">Time Setup</CardTitle>
          </div>
          <div className="flex items-center gap-2">
            <Button size="sm" variant="ghost" className="text-red-600 hover:text-red-700">
              <Edit className="w-4 h-4 mr-1" />
              Edit
            </Button>
            <ChevronDown className="w-5 h-5 text-green-600" />
          </div>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className={`mb-6 ${isCompleted ? 'border-green-200 bg-green-50' : 'border-[#C72030]'}`}>
      <CardHeader className={onToggleCollapse ? 'cursor-pointer' : ''} onClick={onToggleCollapse}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-sm text-white ${
              isCompleted ? 'bg-green-600' : 'bg-[#C72030]'
            }`}>
              {isCompleted ? <Check className="w-4 h-4" /> : '4'}
            </div>
            <CardTitle className={`text-lg ${isCompleted ? 'text-green-700' : 'text-gray-900'}`}>
              Time Setup
            </CardTitle>
          </div>
          {isCompleted && onToggleCollapse && (
            <ChevronUp className="w-5 h-5 text-green-600" />
          )}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Hours Column */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900">Hours</h3>
            <RadioGroup 
              value={timeSlots.hours.mode} 
              onValueChange={handleHourModeChange}
              className="space-y-3"
            >
              <div className="flex items-start space-x-2">
                <RadioGroupItem value="specific" id="hours-specific" />
                <Label htmlFor="hours-specific" className="text-sm leading-relaxed">
                  Choose one or more specific hours
                </Label>
              </div>
              <div className="flex items-start space-x-2">
                <RadioGroupItem value="range" id="hours-range" />
                <Label htmlFor="hours-range" className="text-sm leading-relaxed">
                  Every hour between hour X and hour Y
                </Label>
              </div>
            </RadioGroup>

            {timeSlots.hours.mode === 'specific' && (
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="select-all-hours"
                    checked={timeSlots.hours.specific?.length === 24}
                    onCheckedChange={handleHourSelectAll}
                  />
                  <Label htmlFor="select-all-hours" className="text-sm">Select All</Label>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {hours.map((hour) => (
                    <div key={hour} className="flex items-center space-x-2">
                      <Checkbox
                        id={`hour-${hour}`}
                        checked={timeSlots.hours.specific?.includes(hour) || false}
                        onCheckedChange={() => handleSpecificHourToggle(hour)}
                      />
                      <Label htmlFor={`hour-${hour}`} className="text-xs">
                        {hour.toString().padStart(2, '0')}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {timeSlots.hours.mode === 'range' && (
              <div className="space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  <Select value={timeSlots.hours.range?.start?.toString() || '0'}>
                    <SelectTrigger>
                      <SelectValue placeholder="From" />
                    </SelectTrigger>
                    <SelectContent>
                      {hours.map(hour => (
                        <SelectItem key={hour} value={hour.toString()}>
                          {hour.toString().padStart(2, '0')}:00
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={timeSlots.hours.range?.end?.toString() || '23'}>
                    <SelectTrigger>
                      <SelectValue placeholder="To" />
                    </SelectTrigger>
                    <SelectContent>
                      {hours.map(hour => (
                        <SelectItem key={hour} value={hour.toString()}>
                          {hour.toString().padStart(2, '0')}:00
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
          </div>

          {/* Minutes Column */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900">Minutes</h3>
            <RadioGroup 
              value={timeSlots.minutes.mode} 
              onValueChange={handleMinuteModeChange}
              className="space-y-3"
            >
              <div className="flex items-start space-x-2">
                <RadioGroupItem value="specific" id="minutes-specific" />
                <Label htmlFor="minutes-specific" className="text-sm leading-relaxed">
                  Specific minutes (choose one or many)
                </Label>
              </div>
              <div className="flex items-start space-x-2">
                <RadioGroupItem value="range" id="minutes-range" />
                <Label htmlFor="minutes-range" className="text-sm leading-relaxed">
                  Every minute between minute X and minute Y
                </Label>
              </div>
            </RadioGroup>

            {timeSlots.minutes.mode === 'specific' && (
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  {predefinedMinutes.map((minute) => (
                    <div key={minute} className="flex items-center space-x-2">
                      <Checkbox
                        id={`minute-${minute}`}
                        checked={timeSlots.minutes.specific?.includes(minute) || false}
                        onCheckedChange={() => handleSpecificMinuteToggle(minute)}
                      />
                      <Label htmlFor={`minute-${minute}`} className="text-xs">
                        {minute.toString().padStart(2, '0')} min
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {timeSlots.minutes.mode === 'range' && (
              <div className="space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  <Select value={timeSlots.minutes.range?.start?.toString() || '0'}>
                    <SelectTrigger>
                      <SelectValue placeholder="From" />
                    </SelectTrigger>
                    <SelectContent>
                      {predefinedMinutes.map(minute => (
                        <SelectItem key={minute} value={minute.toString()}>
                          {minute.toString().padStart(2, '0')}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={timeSlots.minutes.range?.end?.toString() || '55'}>
                    <SelectTrigger>
                      <SelectValue placeholder="To" />
                    </SelectTrigger>
                    <SelectContent>
                      {predefinedMinutes.map(minute => (
                        <SelectItem key={minute} value={minute.toString()}>
                          {minute.toString().padStart(2, '0')}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
          </div>

          {/* Day Column */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900">Day</h3>
            <RadioGroup 
              value={timeSlots.days.mode} 
              onValueChange={handleDayModeChange}
              className="space-y-3"
            >
              <div className="flex items-start space-x-2">
                <RadioGroupItem value="weekdays" id="days-weekdays" />
                <Label htmlFor="days-weekdays" className="text-sm leading-relaxed">
                  Placeholder
                </Label>
              </div>
              <div className="flex items-start space-x-2">
                <RadioGroupItem value="dates" id="days-dates" />
                <Label htmlFor="days-dates" className="text-sm leading-relaxed">
                  Specific date of month (choose one or many)
                </Label>
              </div>
            </RadioGroup>

            {timeSlots.days.mode === 'weekdays' && (
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="select-all-weekdays"
                    checked={timeSlots.days.weekdays?.length === 7}
                    onCheckedChange={(checked) => {
                      onChange('timeSlots', {
                        ...timeSlots,
                        days: { ...timeSlots.days, weekdays: checked ? weekdays : [] }
                      });
                    }}
                  />
                  <Label htmlFor="select-all-weekdays" className="text-sm">Select All</Label>
                </div>
                <div className="space-y-2">
                  {weekdays.map((day) => (
                    <div key={day} className="flex items-center space-x-2">
                      <Checkbox
                        id={`weekday-${day}`}
                        checked={timeSlots.days.weekdays?.includes(day) || false}
                        onCheckedChange={() => handleWeekdayToggle(day)}
                      />
                      <Label htmlFor={`weekday-${day}`} className="text-sm">
                        {day}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {timeSlots.days.mode === 'dates' && (
              <div className="space-y-3">
                <div className="grid grid-cols-4 gap-2 max-h-48 overflow-y-auto">
                  {dates.map((date) => (
                    <div key={date} className="flex items-center space-x-2">
                      <Checkbox
                        id={`date-${date}`}
                        checked={timeSlots.days.dates?.includes(date) || false}
                        onCheckedChange={() => handleDateToggle(date)}
                      />
                      <Label htmlFor={`date-${date}`} className="text-xs">
                        {date.toString().padStart(2, '0')}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Month Column */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900">Month</h3>
            <RadioGroup 
              value={timeSlots.months.mode} 
              onValueChange={handleMonthModeChange}
              className="space-y-3"
            >
              <div className="flex items-start space-x-2">
                <RadioGroupItem value="specific" id="months-specific" />
                <Label htmlFor="months-specific" className="text-sm leading-relaxed">
                  Placeholder
                </Label>
              </div>
              <div className="flex items-start space-x-2">
                <RadioGroupItem value="range" id="months-range" />
                <Label htmlFor="months-range" className="text-sm leading-relaxed">
                  Every month between X and X
                </Label>
              </div>
            </RadioGroup>

            {timeSlots.months.mode === 'specific' && (
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="select-all-months"
                    checked={timeSlots.months.specific?.length === 12}
                    onCheckedChange={handleMonthSelectAll}
                  />
                  <Label htmlFor="select-all-months" className="text-sm">Select All</Label>
                </div>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {months.map((month, index) => (
                    <div key={month} className="flex items-center space-x-2">
                      <Checkbox
                        id={`month-${index}`}
                        checked={timeSlots.months.specific?.includes(index) || false}
                        onCheckedChange={() => handleSpecificMonthToggle(index)}
                      />
                      <Label htmlFor={`month-${index}`} className="text-sm">
                        {month}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {timeSlots.months.mode === 'range' && (
              <div className="space-y-2">
                <div className="grid grid-cols-1 gap-2">
                  <Select value={timeSlots.months.range?.start?.toString() || '0'}>
                    <SelectTrigger>
                      <SelectValue placeholder="From" />
                    </SelectTrigger>
                    <SelectContent>
                      {months.map((month, index) => (
                        <SelectItem key={index} value={index.toString()}>
                          {month}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={timeSlots.months.range?.end?.toString() || '11'}>
                    <SelectTrigger>
                      <SelectValue placeholder="To" />
                    </SelectTrigger>
                    <SelectContent>
                      {months.map((month, index) => (
                        <SelectItem key={index} value={index.toString()}>
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
      </CardContent>
    </Card>
  );
};
