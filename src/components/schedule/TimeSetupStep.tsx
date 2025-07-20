
import React from 'react';
import { Clock, ChevronDown, ChevronUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';

interface TimeSetupStepProps {
  data: any;
  onChange: (field: string, value: any) => void;
  isCompleted: boolean;
  isCollapsed: boolean;
  onToggleCollapse?: () => void;
}

export const TimeSetupStep = ({ data, onChange, isCompleted, isCollapsed, onToggleCollapse }: TimeSetupStepProps) => {
  const hours = Array.from({ length: 24 }, (_, i) => i);
  const minutes = Array.from({ length: 60 }, (_, i) => i);
  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  const handleTimeSlotChange = (category: string, field: string, value: any) => {
    const updatedTimeSlots = {
      ...data.timeSlots,
      [category]: {
        ...data.timeSlots[category],
        [field]: value
      }
    };
    onChange('timeSlots', updatedTimeSlots);
  };

  const handleSpecificValueToggle = (category: string, value: number) => {
    const current = data.timeSlots[category].specific || [];
    const updated = current.includes(value)
      ? current.filter((v: number) => v !== value)
      : [...current, value];
    
    handleTimeSlotChange(category, 'specific', updated);
  };

  const handleWeekdayToggle = (weekday: string) => {
    const current = data.timeSlots.days.weekdays || [];
    const updated = current.includes(weekday)
      ? current.filter((w: string) => w !== weekday)
      : [...current, weekday];
    
    handleTimeSlotChange('days', 'weekdays', updated);
  };

  const handleDateToggle = (date: number) => {
    const current = data.timeSlots.days.dates || [];
    const updated = current.includes(date)
      ? current.filter((d: number) => d !== date)
      : [...current, date];
    
    handleTimeSlotChange('days', 'dates', updated);
  };

  const handleMonthToggle = (monthIndex: number) => {
    const current = data.timeSlots.months.specific || [];
    const updated = current.includes(monthIndex)
      ? current.filter((m: number) => m !== monthIndex)
      : [...current, monthIndex];
    
    handleTimeSlotChange('months', 'specific', updated);
  };

  if (isCollapsed) {
    return (
      <Card className="border border-gray-200">
        <CardHeader 
          className="cursor-pointer hover:bg-gray-50 transition-colors"
          onClick={onToggleCollapse}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <Clock className="w-4 h-4 text-green-600" />
              </div>
              <div>
                <CardTitle className="text-lg font-semibold text-gray-900">Time Setup</CardTitle>
                <p className="text-sm text-gray-500 mt-1">Schedule timing configuration</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-green-600 font-medium">Completed</span>
              <ChevronDown className="w-5 h-5 text-gray-400" />
            </div>
          </div>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="border border-gray-200">
      <CardHeader className={onToggleCollapse ? 'cursor-pointer hover:bg-gray-50 transition-colors' : ''}>
        <div className="flex items-center justify-between" onClick={onToggleCollapse}>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <Clock className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <CardTitle className="text-lg font-semibold text-gray-900">Time Setup</CardTitle>
              <p className="text-sm text-gray-500 mt-1">Schedule timing configuration</p>
            </div>
          </div>
          {onToggleCollapse && (
            <ChevronUp className="w-5 h-5 text-gray-400" />
          )}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Hours Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between py-3 border-b border-gray-200">
            <h3 className="text-sm font-medium text-gray-900">Hours</h3>
          </div>
          
          <RadioGroup 
            value={data.timeSlots.hours.mode} 
            onValueChange={(value) => handleTimeSlotChange('hours', 'mode', value)}
            className="space-y-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="specific" id="hours-specific" />
              <Label htmlFor="hours-specific" className="text-sm text-gray-700">Specific Hours</Label>
            </div>
            
            {data.timeSlots.hours.mode === 'specific' && (
              <div className="grid grid-cols-6 gap-2 ml-6">
                {hours.map(hour => (
                  <div key={hour} className="flex items-center space-x-2">
                    <Checkbox
                      id={`hour-${hour}`}
                      checked={data.timeSlots.hours.specific?.includes(hour) || false}
                      onCheckedChange={() => handleSpecificValueToggle('hours', hour)}
                    />
                    <Label htmlFor={`hour-${hour}`} className="text-sm">{hour.toString().padStart(2, '0')}</Label>
                  </div>
                ))}
              </div>
            )}
            
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="range" id="hours-range" />
              <Label htmlFor="hours-range" className="text-sm text-gray-700">Range</Label>
            </div>
            
            {data.timeSlots.hours.mode === 'range' && (
              <div className="ml-6 space-y-2">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <Label className="text-sm text-gray-600">From:</Label>
                    <select 
                      className="border border-gray-300 rounded px-2 py-1 text-sm"
                      value={data.timeSlots.hours.range?.start || 0}
                      onChange={(e) => handleTimeSlotChange('hours', 'range', { ...data.timeSlots.hours.range, start: Number(e.target.value) })}
                    >
                      {hours.map(hour => (
                        <option key={hour} value={hour}>{hour.toString().padStart(2, '0')}</option>
                      ))}
                    </select>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Label className="text-sm text-gray-600">To:</Label>
                    <select 
                      className="border border-gray-300 rounded px-2 py-1 text-sm"
                      value={data.timeSlots.hours.range?.end || 23}
                      onChange={(e) => handleTimeSlotChange('hours', 'range', { ...data.timeSlots.hours.range, end: Number(e.target.value) })}
                    >
                      {hours.map(hour => (
                        <option key={hour} value={hour}>{hour.toString().padStart(2, '0')}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            )}
          </RadioGroup>
        </div>

        {/* Minutes Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between py-3 border-b border-gray-200">
            <h3 className="text-sm font-medium text-gray-900">Minutes</h3>
          </div>
          
          <RadioGroup 
            value={data.timeSlots.minutes.mode} 
            onValueChange={(value) => handleTimeSlotChange('minutes', 'mode', value)}
            className="space-y-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="specific" id="minutes-specific" />
              <Label htmlFor="minutes-specific" className="text-sm text-gray-700">Specific Minutes</Label>
            </div>
            
            {data.timeSlots.minutes.mode === 'specific' && (
              <div className="grid grid-cols-6 gap-2 ml-6 max-h-32 overflow-y-auto">
                {minutes.map(minute => (
                  <div key={minute} className="flex items-center space-x-2">
                    <Checkbox
                      id={`minute-${minute}`}
                      checked={data.timeSlots.minutes.specific?.includes(minute) || false}
                      onCheckedChange={() => handleSpecificValueToggle('minutes', minute)}
                    />
                    <Label htmlFor={`minute-${minute}`} className="text-sm">{minute.toString().padStart(2, '0')}</Label>
                  </div>
                ))}
              </div>
            )}
            
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="range" id="minutes-range" />
              <Label htmlFor="minutes-range" className="text-sm text-gray-700">Range</Label>
            </div>
            
            {data.timeSlots.minutes.mode === 'range' && (
              <div className="ml-6 space-y-2">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <Label className="text-sm text-gray-600">From:</Label>
                    <select 
                      className="border border-gray-300 rounded px-2 py-1 text-sm"
                      value={data.timeSlots.minutes.range?.start || 0}
                      onChange={(e) => handleTimeSlotChange('minutes', 'range', { ...data.timeSlots.minutes.range, start: Number(e.target.value) })}
                    >
                      {minutes.map(minute => (
                        <option key={minute} value={minute}>{minute.toString().padStart(2, '0')}</option>
                      ))}
                    </select>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Label className="text-sm text-gray-600">To:</Label>
                    <select 
                      className="border border-gray-300 rounded px-2 py-1 text-sm"
                      value={data.timeSlots.minutes.range?.end || 59}
                      onChange={(e) => handleTimeSlotChange('minutes', 'range', { ...data.timeSlots.minutes.range, end: Number(e.target.value) })}
                    >
                      {minutes.map(minute => (
                        <option key={minute} value={minute}>{minute.toString().padStart(2, '0')}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            )}
          </RadioGroup>
        </div>

        {/* Days Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between py-3 border-b border-gray-200">
            <h3 className="text-sm font-medium text-gray-900">Days</h3>
          </div>
          
          <RadioGroup 
            value={data.timeSlots.days.mode} 
            onValueChange={(value) => handleTimeSlotChange('days', 'mode', value)}
            className="space-y-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="weekdays" id="days-weekdays" />
              <Label htmlFor="days-weekdays" className="text-sm text-gray-700">Weekdays</Label>
            </div>
            
            {data.timeSlots.days.mode === 'weekdays' && (
              <div className="grid grid-cols-2 gap-2 ml-6">
                {weekdays.map(weekday => (
                  <div key={weekday} className="flex items-center space-x-2">
                    <Checkbox
                      id={`weekday-${weekday}`}
                      checked={data.timeSlots.days.weekdays?.includes(weekday) || false}
                      onCheckedChange={() => handleWeekdayToggle(weekday)}
                    />
                    <Label htmlFor={`weekday-${weekday}`} className="text-sm">{weekday}</Label>
                  </div>
                ))}
              </div>
            )}
            
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="dates" id="days-dates" />
              <Label htmlFor="days-dates" className="text-sm text-gray-700">Specific Dates</Label>
            </div>
            
            {data.timeSlots.days.mode === 'dates' && (
              <div className="grid grid-cols-7 gap-2 ml-6">
                {days.map(day => (
                  <div key={day} className="flex items-center space-x-2">
                    <Checkbox
                      id={`date-${day}`}
                      checked={data.timeSlots.days.dates?.includes(day) || false}
                      onCheckedChange={() => handleDateToggle(day)}
                    />
                    <Label htmlFor={`date-${day}`} className="text-sm">{day}</Label>
                  </div>
                ))}
              </div>
            )}
          </RadioGroup>
        </div>

        {/* Months Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between py-3 border-b border-gray-200">
            <h3 className="text-sm font-medium text-gray-900">Months</h3>
          </div>
          
          <RadioGroup 
            value={data.timeSlots.months.mode} 
            onValueChange={(value) => handleTimeSlotChange('months', 'mode', value)}
            className="space-y-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="specific" id="months-specific" />
              <Label htmlFor="months-specific" className="text-sm text-gray-700">Specific Months</Label>
            </div>
            
            {data.timeSlots.months.mode === 'specific' && (
              <div className="grid grid-cols-3 gap-2 ml-6">
                {months.map((month, index) => (
                  <div key={month} className="flex items-center space-x-2">
                    <Checkbox
                      id={`month-${index}`}
                      checked={data.timeSlots.months.specific?.includes(index) || false}
                      onCheckedChange={() => handleMonthToggle(index)}
                    />
                    <Label htmlFor={`month-${index}`} className="text-sm">{month}</Label>
                  </div>
                ))}
              </div>
            )}
            
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="range" id="months-range" />
              <Label htmlFor="months-range" className="text-sm text-gray-700">Range</Label>
            </div>
            
            {data.timeSlots.months.mode === 'range' && (
              <div className="ml-6 space-y-2">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <Label className="text-sm text-gray-600">From:</Label>
                    <select 
                      className="border border-gray-300 rounded px-2 py-1 text-sm"
                      value={data.timeSlots.months.range?.start || 0}
                      onChange={(e) => handleTimeSlotChange('months', 'range', { ...data.timeSlots.months.range, start: Number(e.target.value) })}
                    >
                      {months.map((month, index) => (
                        <option key={month} value={index}>{month}</option>
                      ))}
                    </select>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Label className="text-sm text-gray-600">To:</Label>
                    <select 
                      className="border border-gray-300 rounded px-2 py-1 text-sm"
                      value={data.timeSlots.months.range?.end || 11}
                      onChange={(e) => handleTimeSlotChange('months', 'range', { ...data.timeSlots.months.range, end: Number(e.target.value) })}
                    >
                      {months.map((month, index) => (
                        <option key={month} value={index}>{month}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            )}
          </RadioGroup>
        </div>
      </CardContent>
    </Card>
  );
};
