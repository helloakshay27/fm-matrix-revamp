
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Calendar } from '@/components/ui/calendar';

interface CalendarViewProps {
  dateFrom: string;
  dateTo: string;
  selectedDate: Date | undefined;
  onDateFromChange: (value: string) => void;
  onDateToChange: (value: string) => void;
  onSelectedDateChange: (date: Date | undefined) => void;
}

export const CalendarView: React.FC<CalendarViewProps> = ({
  dateFrom,
  dateTo,
  selectedDate,
  onDateFromChange,
  onDateToChange,
  onSelectedDateChange
}) => {
  return (
    <div className="space-y-6">
      {/* Date Range for Calendar */}
      <div className="flex gap-3 mb-6">
        <Input 
          type="date" 
          value={dateFrom.split('/').reverse().join('-')}
          onChange={(e) => onDateFromChange(e.target.value.split('-').reverse().join('/'))}
          className="w-40"
        />
        <Input 
          type="date" 
          value={dateTo.split('/').reverse().join('-')}
          onChange={(e) => onDateToChange(e.target.value.split('-').reverse().join('/'))}
          className="w-40"
        />
        <Input placeholder="Select Some Options" className="max-w-xs" />
        <span className="flex items-center text-sm">Select Schedule Type</span>
        <Button className="bg-purple-600 hover:bg-purple-700 text-white">Apply</Button>
        <Button variant="outline">Reset</Button>
        <Button className="bg-[#8B4513] hover:bg-[#7A3F12] text-white">Export</Button>
      </div>

      {/* Legend */}
      <div className="flex gap-6 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-yellow-400 rounded"></div>
          <span>Scheduled</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-green-500 rounded"></div>
          <span>Open</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-blue-500 rounded"></div>
          <span>In Progress</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-green-600 rounded"></div>
          <span>Closed</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-red-500 rounded"></div>
          <span>Overdue</span>
        </div>
      </div>

      {/* Calendar Navigation */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex gap-2">
          <Button variant="outline" size="sm">&lt;</Button>
          <Button variant="outline" size="sm">&gt;</Button>
          <Button variant="outline" size="sm">today</Button>
        </div>
        <h2 className="text-xl font-semibold">July 2025</h2>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">month</Button>
          <Button variant="outline" size="sm">week</Button>
          <Button variant="outline" size="sm">day</Button>
          <Button variant="outline" size="sm">list</Button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="border rounded-lg bg-white">
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={onSelectedDateChange}
          className="w-full"
        />
      </div>
    </div>
  );
};
