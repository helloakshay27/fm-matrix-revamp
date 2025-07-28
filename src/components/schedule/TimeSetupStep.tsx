import React, { useState } from 'react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Check, ChevronUp, Settings } from 'lucide-react';
import { Box, Card, CardHeader, Typography, IconButton, Collapse, CardContent } from '@mui/material';

interface TimeSetupStepProps {
  data: {
    hourMode: string;
    minuteMode: string;
    dayMode: string;
    monthMode: string;
    selectedHours: string[];
    selectedMinutes: string[];
    selectedWeekdays: string[];
    selectedDays: string[];
    selectedMonths: string[];
    betweenMinuteStart: string;
    betweenMinuteEnd: string;
    betweenMonthStart: string;
    betweenMonthEnd: string;
  };
  updateData?: (data: any) => void;
  onChange?: (field: string, value: any) => void;
  isCompleted?: boolean;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

export const TimeSetupStep: React.FC<TimeSetupStepProps> = ({ 
  data, 
  updateData, 
  onChange, 
  isCompleted, 
  isCollapsed, 
  onToggleCollapse 
}) => {
  // Use props data instead of local state
  const {
    hourMode = 'specific',
    minuteMode = 'specific',
    dayMode = 'weekdays',
    monthMode = 'all',
    selectedHours = ['12'],
    selectedMinutes = ['00'],
    selectedWeekdays = [],
    selectedDays = [],
    selectedMonths = [],
    betweenMinuteStart = '00',
    betweenMinuteEnd = '59',
    betweenMonthStart = 'January',
    betweenMonthEnd = 'December'
  } = data;

  const hours = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0'));
  const specificMinutes = ['00', '05', '10', '15', '20', '25', '30', '35', '40', '45', '50', '55'];
  const allMinutes = Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, '0'));
  const days = Array.from({ length: 31 }, (_, i) => (i + 1).toString().padStart(2, '0'));
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  const weekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  return (
    <div >
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-[#C72030] rounded-full flex items-center justify-center">
          <Settings className="w-5 h-5 text-white" />
        </div>
        <h2 className="text-xl font-semibold text-[#C72030]">Time Setup</h2>
      </div>

    <Card sx={{ mb: 2, pt:3, border: isCompleted ? '1px solid #059669' : '1px solid #E5E7EB' }}>
      
      <Collapse in={!isCollapsed || !isCompleted} timeout="auto" unmountOnExit>
        <CardContent sx={{ pt: 0 }}>
          {/* Main Container with Dashed Border */}
          <div className="border-2 border-dashed border-gray-400 bg-white">
            {/* Column Headers */}
            <div className="grid grid-cols-4 border-b border-gray-300">
              <div className="bg-gray-100 p-4 border-r border-gray-300">
                <h4 className="font-medium text-[#C72030] text-center">Hours</h4>
              </div>
              <div className="bg-gray-100 p-4 border-r border-gray-300">
                <h4 className="font-medium text-[#C72030] text-center">Minutes</h4>
              </div>
              <div className="bg-gray-100 p-4 border-r border-gray-300">
                <h4 className="font-medium text-[#C72030] text-center">Day</h4>
              </div>
              <div className="bg-gray-100 p-4">
                <h4 className="font-medium text-[#C72030] text-center">Month</h4>
              </div>
            </div>

            {/* Content Grid */}
            <div className="grid grid-cols-4">
              {/* Hours Column */}
              <div className="border-r border-gray-300 p-4">
                <div className="space-y-4">
                  <RadioGroup value={hourMode} onValueChange={(value: 'specific') => {
                    onChange?.('hourMode', value);
                  }}>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="specific" id="hour-specific" />
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
                        onChange?.('selectedHours', newHours);
                      }}
                      className="data-[state=checked]:bg-[#C72030] data-[state=checked]:border-[#C72030]"
                    />
                    <Label htmlFor="select-all-hours" className="text-sm">
                      Select All
                    </Label>
                  </div>
                  
                  <div className="grid grid-cols-6 gap-2">
                    {hours.map(hour => (
                      <div key={hour} className="flex items-center space-x-1">
                        <Checkbox
                          id={`hour-${hour}`}
                          checked={selectedHours.includes(hour)}
                          onCheckedChange={(checked) => {
                            const newHours = checked 
                              ? [...selectedHours, hour]
                              : selectedHours.filter(h => h !== hour);
                            onChange?.('selectedHours', newHours);
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
                  <RadioGroup value={minuteMode} onValueChange={(value: 'specific' | 'between') => {
                    onChange?.('minuteMode', value);
                  }}>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="specific" id="minute-specific" />
                      <Label htmlFor="minute-specific" className="text-sm">
                        Specific minutes (choose one or many)
                      </Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="between" id="minute-between" />
                      <Label htmlFor="minute-between" className="text-sm">
                        Every minute between minute
                      </Label>
                    </div>
                  </RadioGroup>
                  
                  {minuteMode === 'specific' && (
                    <div className="grid grid-cols-4 gap-2">
                      {specificMinutes.map(minute => (
                        <div key={minute} className="flex items-center space-x-1">
                          <Checkbox
                            id={`minute-${minute}`}
                            checked={selectedMinutes.includes(minute)}
                            onCheckedChange={(checked) => {
                              const newMinutes = checked 
                                ? [...selectedMinutes, minute]
                                : selectedMinutes.filter(m => m !== minute);
                              onChange?.('selectedMinutes', newMinutes);
                            }}
                            className="h-4 w-4 data-[state=checked]:bg-[#C72030] data-[state=checked]:border-[#C72030]"
                          />
                          <Label htmlFor={`minute-${minute}`} className="text-xs">
                            {minute} min
                          </Label>
                        </div>
                      ))}
                    </div>
                  )}

                  {minuteMode === 'between' && (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <Select value={betweenMinuteStart} onValueChange={(value) => onChange?.('betweenMinuteStart', value)}>
                          <SelectTrigger className="w-16 h-8">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {allMinutes.map(minute => (
                              <SelectItem key={minute} value={minute}>{minute}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <span>and minute</span>
                        <Select value={betweenMinuteEnd} onValueChange={(value) => onChange?.('betweenMinuteEnd', value)}>
                          <SelectTrigger className="w-16 h-8">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {allMinutes.map(minute => (
                              <SelectItem key={minute} value={minute}>{minute}</SelectItem>
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
                  <RadioGroup value={dayMode} onValueChange={(value: 'weekdays' | 'specific') => {
                    onChange?.('dayMode', value);
                  }}>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="weekdays" id="day-weekdays" />
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

                  {dayMode === 'weekdays' && (
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="select-all-weekdays"
                          checked={selectedWeekdays.length === weekdays.length}
                          onCheckedChange={(checked) => {
                            const newWeekdays = checked ? weekdays : [];
                            onChange?.('selectedWeekdays', newWeekdays);
                          }}
                          className="data-[state=checked]:bg-[#C72030] data-[state=checked]:border-[#C72030]"
                        />
                        <Label htmlFor="select-all-weekdays" className="text-sm">
                          Select All
                        </Label>
                      </div>
                      {weekdays.map(day => (
                        <div key={day} className="flex items-center space-x-2">
                          <Checkbox
                            id={`weekday-${day}`}
                            checked={selectedWeekdays.includes(day)}
                            onCheckedChange={(checked) => {
                              const newWeekdays = checked 
                                ? [...selectedWeekdays, day]
                                : selectedWeekdays.filter(w => w !== day);
                              onChange?.('selectedWeekdays', newWeekdays);
                            }}
                            className="h-4 w-4 data-[state=checked]:bg-[#C72030] data-[state=checked]:border-[#C72030]"
                          />
                          <Label htmlFor={`weekday-${day}`} className="text-sm">
                            {day}
                          </Label>
                        </div>
                      ))}
                    </div>
                  )}

                  {dayMode === 'specific' && (
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="select-all-days"
                          checked={selectedDays.length === days.length}
                          onCheckedChange={(checked) => {
                            const newDays = checked ? days : [];
                            onChange?.('selectedDays', newDays);
                          }}
                          className="data-[state=checked]:bg-[#C72030] data-[state=checked]:border-[#C72030]"
                        />
                        <Label htmlFor="select-all-days" className="text-sm">
                          Select All
                        </Label>
                      </div>
                      <div className="grid grid-cols-6 gap-1">
                        {days.map(day => (
                          <div key={day} className="flex items-center space-x-1">
                            <Checkbox
                              id={`day-${day}`}
                              checked={selectedDays.includes(day)}
                              onCheckedChange={(checked) => {
                                const newDays = checked 
                                  ? [...selectedDays, day]
                                  : selectedDays.filter(d => d !== day);
                                onChange?.('selectedDays', newDays);
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
                  <RadioGroup value={monthMode} onValueChange={(value: 'all' | 'specific' | 'between') => {
                    onChange?.('monthMode', value);
                  }}>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="all" id="month-all" />
                      <Label htmlFor="month-all" className="text-sm">
                        All months
                      </Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="specific" id="month-specific" />
                      <Label htmlFor="month-specific" className="text-sm">
                        Specific months
                      </Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="between" id="month-between" />
                      <Label htmlFor="month-between" className="text-sm">
                        Every month between
                      </Label>
                    </div>
                  </RadioGroup>

                  {monthMode === 'specific' && (
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="select-all-months"
                          checked={selectedMonths.length === months.length}
                          onCheckedChange={(checked) => {
                            const newMonths = checked ? months : [];
                            onChange?.('selectedMonths', newMonths);
                          }}
                          className="data-[state=checked]:bg-[#C72030] data-[state=checked]:border-[#C72030]"
                        />
                        <Label htmlFor="select-all-months" className="text-sm">
                          Select All
                        </Label>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        {months.map(month => (
                          <div key={month} className="flex items-center space-x-2">
                            <Checkbox
                              id={`month-${month}`}
                              checked={selectedMonths.includes(month)}
                              onCheckedChange={(checked) => {
                                const newMonths = checked 
                                  ? [...selectedMonths, month]
                                  : selectedMonths.filter(m => m !== month);
                                onChange?.('selectedMonths', newMonths);
                              }}
                              className="h-4 w-4 data-[state=checked]:bg-[#C72030] data-[state=checked]:border-[#C72030]"
                            />
                            <Label htmlFor={`month-${month}`} className="text-sm">
                              {month}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {monthMode === 'between' && (
                    <div className="space-y-2">
                      <Select value={betweenMonthStart} onValueChange={(value) => onChange?.('betweenMonthStart', value)}>
                        <SelectTrigger className="w-32 h-8">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {months.map(month => (
                            <SelectItem key={month} value={month}>{month}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <div className="flex items-center gap-2">
                        <span className="text-sm">and</span>
                        <Select value={betweenMonthEnd} onValueChange={(value) => onChange?.('betweenMonthEnd', value)}>
                          <SelectTrigger className="w-32 h-8">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {months.map(month => (
                              <SelectItem key={month} value={month}>{month}</SelectItem>
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
        </CardContent>
      </Collapse>
    </Card>
    </div>
  );
};