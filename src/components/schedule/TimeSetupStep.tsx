
import React, { useState } from 'react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Settings } from 'lucide-react';

interface TimeSetupStepProps {
  data: any;
  updateData: (data: any) => void;
}

export const TimeSetupStep: React.FC<TimeSetupStepProps> = ({ data, updateData }) => {
  const [selectedHours, setSelectedHours] = useState<string[]>(data.hours || []);
  const [selectedMinutes, setSelectedMinutes] = useState<string[]>(data.minutes || []);
  const [selectedDays, setSelectedDays] = useState<string[]>(data.days || []);
  const [selectedMonths, setSelectedMonths] = useState<string[]>(data.months || []);
  const [hoursSelectAll, setHoursSelectAll] = useState(false);
  const [minutesSelectAll, setMinutesSelectAll] = useState(false);
  const [daysSelectAll, setDaysSelectAll] = useState(false);
  const [monthsSelectAll, setMonthsSelectAll] = useState(false);

  const hours = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0'));
  const minutes = ['00', '15', '30', '45'];
  const days = Array.from({ length: 31 }, (_, i) => (i + 1).toString());
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const handleHourChange = (hour: string, checked: boolean) => {
    const newHours = checked 
      ? [...selectedHours, hour]
      : selectedHours.filter(h => h !== hour);
    setSelectedHours(newHours);
    updateData({ ...data, hours: newHours });
  };

  const handleMinuteChange = (minute: string, checked: boolean) => {
    const newMinutes = checked 
      ? [...selectedMinutes, minute]
      : selectedMinutes.filter(m => m !== minute);
    setSelectedMinutes(newMinutes);
    updateData({ ...data, minutes: newMinutes });
  };

  const handleDayChange = (day: string, checked: boolean) => {
    const newDays = checked 
      ? [...selectedDays, day]
      : selectedDays.filter(d => d !== day);
    setSelectedDays(newDays);
    updateData({ ...data, days: newDays });
  };

  const handleMonthChange = (month: string, checked: boolean) => {
    const newMonths = checked 
      ? [...selectedMonths, month]
      : selectedMonths.filter(m => m !== month);
    setSelectedMonths(newMonths);
    updateData({ ...data, months: newMonths });
  };

  const handleSelectAllHours = (checked: boolean) => {
    setHoursSelectAll(checked);
    const newHours = checked ? hours : [];
    setSelectedHours(newHours);
    updateData({ ...data, hours: newHours });
  };

  const handleSelectAllMinutes = (checked: boolean) => {
    setMinutesSelectAll(checked);
    const newMinutes = checked ? minutes : [];
    setSelectedMinutes(newMinutes);
    updateData({ ...data, minutes: newMinutes });
  };

  const handleSelectAllDays = (checked: boolean) => {
    setDaysSelectAll(checked);
    const newDays = checked ? days : [];
    setSelectedDays(newDays);
    updateData({ ...data, days: newDays });
  };

  const handleSelectAllMonths = (checked: boolean) => {
    setMonthsSelectAll(checked);
    const newMonths = checked ? months : [];
    setSelectedMonths(newMonths);
    updateData({ ...data, months: newMonths });
  };

  return (
    <div className="border-2 border-dashed border-gray-300 p-6 bg-white">
      {/* Header */}
      <div className="flex items-center gap-2 mb-6">
        <Settings className="w-5 h-5 text-[#C72030]" />
        <h3 className="text-lg font-semibold text-gray-900">Time Setup</h3>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-4 gap-0 border border-gray-200">
        {/* Hours Column */}
        <div className="border-r border-gray-200 p-4">
          <div className="mb-4">
            <h4 className="font-medium text-gray-900 mb-2">Hours</h4>
            <div className="flex items-center space-x-2 mb-3">
              <Checkbox
                id="select-all-hours"
                checked={hoursSelectAll}
                onCheckedChange={handleSelectAllHours}
              />
              <Label htmlFor="select-all-hours" className="text-sm text-gray-600">
                Select All
              </Label>
            </div>
          </div>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {hours.map(hour => (
              <div key={hour} className="flex items-center space-x-2">
                <Checkbox
                  id={`hour-${hour}`}
                  checked={selectedHours.includes(hour)}
                  onCheckedChange={(checked) => handleHourChange(hour, checked as boolean)}
                />
                <Label htmlFor={`hour-${hour}`} className="text-sm">
                  {hour}:00
                </Label>
              </div>
            ))}
          </div>
        </div>

        {/* Minutes Column */}
        <div className="border-r border-gray-200 p-4">
          <div className="mb-4">
            <h4 className="font-medium text-gray-900 mb-2">Minutes</h4>
            <div className="flex items-center space-x-2 mb-3">
              <Checkbox
                id="select-all-minutes"
                checked={minutesSelectAll}
                onCheckedChange={handleSelectAllMinutes}
              />
              <Label htmlFor="select-all-minutes" className="text-sm text-gray-600">
                Select All
              </Label>
            </div>
          </div>
          <div className="space-y-2">
            {minutes.map(minute => (
              <div key={minute} className="flex items-center space-x-2">
                <Checkbox
                  id={`minute-${minute}`}
                  checked={selectedMinutes.includes(minute)}
                  onCheckedChange={(checked) => handleMinuteChange(minute, checked as boolean)}
                />
                <Label htmlFor={`minute-${minute}`} className="text-sm">
                  :{minute}
                </Label>
              </div>
            ))}
          </div>
        </div>

        {/* Days Column */}
        <div className="border-r border-gray-200 p-4">
          <div className="mb-4">
            <h4 className="font-medium text-gray-900 mb-2">Day</h4>
            <div className="flex items-center space-x-2 mb-3">
              <Checkbox
                id="select-all-days"
                checked={daysSelectAll}
                onCheckedChange={handleSelectAllDays}
              />
              <Label htmlFor="select-all-days" className="text-sm text-gray-600">
                Select All
              </Label>
            </div>
          </div>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {days.map(day => (
              <div key={day} className="flex items-center space-x-2">
                <Checkbox
                  id={`day-${day}`}
                  checked={selectedDays.includes(day)}
                  onCheckedChange={(checked) => handleDayChange(day, checked as boolean)}
                />
                <Label htmlFor={`day-${day}`} className="text-sm">
                  {day}
                </Label>
              </div>
            ))}
          </div>
        </div>

        {/* Months Column */}
        <div className="p-4">
          <div className="mb-4">
            <h4 className="font-medium text-gray-900 mb-2">Month</h4>
            <div className="flex items-center space-x-2 mb-3">
              <Checkbox
                id="select-all-months"
                checked={monthsSelectAll}
                onCheckedChange={handleSelectAllMonths}
              />
              <Label htmlFor="select-all-months" className="text-sm text-gray-600">
                Select All
              </Label>
            </div>
          </div>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {months.map(month => (
              <div key={month} className="flex items-center space-x-2">
                <Checkbox
                  id={`month-${month}`}
                  checked={selectedMonths.includes(month)}
                  onCheckedChange={(checked) => handleMonthChange(month, checked as boolean)}
                />
                <Label htmlFor={`month-${month}`} className="text-sm">
                  {month}
                </Label>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
