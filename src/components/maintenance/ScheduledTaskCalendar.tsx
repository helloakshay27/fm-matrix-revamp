import React, { useState, useEffect, useMemo } from 'react';
import { Calendar, momentLocalizer, Views } from 'react-big-calendar';
import moment from 'moment';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { CalendarEvent } from '@/services/calendarService';

const localizer = momentLocalizer(moment);

interface ScheduledTaskCalendarProps {
  events?: CalendarEvent[];
  onDateRangeChange?: (start: string, end: string) => void;
  onFiltersChange?: (filters: any) => void;
}

export const ScheduledTaskCalendar: React.FC<ScheduledTaskCalendarProps> = ({
  events = [],
  onDateRangeChange,
  onFiltersChange
}) => {
  const [view, setView] = useState<'month' | 'week' | 'day' | 'agenda'>('month');
  const [date, setDate] = useState(new Date());
  const [dateFrom, setDateFrom] = useState('01/07/2025');
  const [dateTo, setDateTo] = useState('31/07/2025');
  const [amc, setAmc] = useState('');
  const [service, setService] = useState('');

  // Convert API events to calendar events
  const calendarEvents = useMemo(() => {
    return events.map(event => ({
      id: event.id,
      title: event.title,
      start: new Date(event.start),
      end: new Date(moment(event.start).add(1, 'hour').toISOString()), // Default 1 hour duration
      color: event.color,
      status: event.status,
      resource: event
    }));
  }, [events]);

  const handleNavigate = (newDate: Date) => {
    setDate(newDate);
  };

  const handleViewChange = (newView: any) => {
    setView(newView);
  };

  const handleApply = () => {
    if (onDateRangeChange) {
      onDateRangeChange(dateFrom, dateTo);
    }
    if (onFiltersChange) {
      onFiltersChange({ amc, service });
    }
  };

  const handleReset = () => {
    setDateFrom('01/07/2025');
    setDateTo('31/07/2025');
    setAmc('');
    setService('');
    if (onDateRangeChange) {
      onDateRangeChange('01/07/2025', '31/07/2025');
    }
    if (onFiltersChange) {
      onFiltersChange({ amc: '', service: '' });
    }
  };

  const handleExport = () => {
    console.log('Export calendar data');
  };

  // Custom event style
  const eventStyleGetter = (event: any) => {
    const backgroundColor = event.color || '#fdbb0b';
    return {
      style: {
        backgroundColor,
        borderColor: backgroundColor,
        color: '#000',
        fontSize: '11px',
        padding: '2px 4px',
        borderRadius: '2px',
        border: 'none'
      }
    };
  };

  // Custom toolbar
  const CustomToolbar = ({ label, onNavigate, onView }: any) => (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onNavigate('PREV')}
          className="h-8 w-8 p-0"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onNavigate('NEXT')}
          className="h-8 w-8 p-0"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onNavigate('TODAY')}
          className="px-3 py-1 h-8"
        >
          today
        </Button>
      </div>
      
      <h2 className="text-xl font-semibold">{label}</h2>
      
      <div className="flex items-center gap-2">
        <Button
          variant={view === 'month' ? 'default' : 'outline'}
          size="sm"
          onClick={() => onView('month')}
          className="px-3 py-1 h-8"
        >
          month
        </Button>
        <Button
          variant={view === 'week' ? 'default' : 'outline'}
          size="sm"
          onClick={() => onView('week')}
          className="px-3 py-1 h-8"
        >
          week
        </Button>
        <Button
          variant={view === 'day' ? 'default' : 'outline'}
          size="sm"
          onClick={() => onView('day')}
          className="px-3 py-1 h-8"
        >
          day
        </Button>
        <Button
          variant={view === 'agenda' ? 'default' : 'outline'}
          size="sm"
          onClick={() => onView('agenda')}
          className="px-3 py-1 h-8"
        >
          list
        </Button>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="text-sm text-gray-600">
        Scheduled Task &gt; Scheduled Task List
      </div>

      {/* Title */}
      <h1 className="text-2xl font-bold">SCHEDULED TASK CALENDER</h1>

      {/* Tab Navigation */}
      <div className="flex gap-2 border-b">
        <Button variant="ghost" className="border-b-2 border-transparent hover:border-gray-300">
          List
        </Button>
        <Button variant="ghost" className="border-b-2 border-orange-500 text-orange-500">
          Calender
        </Button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4 flex-wrap">
        <Input
          placeholder="01/07/2025"
          value={dateFrom}
          onChange={(e) => setDateFrom(e.target.value)}
          className="w-32"
        />
        <Input
          placeholder="31/07/2025"
          value={dateTo}
          onChange={(e) => setDateTo(e.target.value)}
          className="w-32"
        />
        <Select value={amc} onValueChange={setAmc}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="AMC" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="amc1">AMC 1</SelectItem>
            <SelectItem value="amc2">AMC 2</SelectItem>
            <SelectItem value="amc3">AMC 3</SelectItem>
          </SelectContent>
        </Select>
        <Select value={service} onValueChange={setService}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Service" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="maintenance">Maintenance</SelectItem>
            <SelectItem value="cleaning">Cleaning</SelectItem>
            <SelectItem value="security">Security</SelectItem>
          </SelectContent>
        </Select>
        <Button onClick={handleApply} className="bg-purple-600 hover:bg-purple-700 text-white px-6">
          Apply
        </Button>
        <Button onClick={handleReset} variant="outline" className="px-6">
          Reset
        </Button>
        <Button onClick={handleExport} variant="outline" className="px-6">
          Export
        </Button>
      </div>

      {/* Legends */}
      <div className="flex items-center gap-6 text-sm">
        <span className="font-medium">Legends</span>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-yellow-400 rounded"></div>
          <span>Scheduled</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-pink-500 rounded"></div>
          <span>Open</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-blue-500 rounded"></div>
          <span>In Progress</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-green-500 rounded"></div>
          <span>Closed</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-red-500 rounded"></div>
          <span>Overdue</span>
        </div>
      </div>

      {/* Calendar */}
      <div className="bg-white border rounded-lg p-4" style={{ height: '600px' }}>
        <Calendar
          localizer={localizer}
          events={calendarEvents}
          startAccessor="start"
          endAccessor="end"
          style={{ height: '100%' }}
          view={view}
          onView={handleViewChange}
          date={date}
          onNavigate={handleNavigate}
          eventPropGetter={eventStyleGetter}
          components={{
            toolbar: CustomToolbar
          }}
          views={[Views.MONTH, Views.WEEK, Views.DAY, Views.AGENDA]}
          step={60}
          showMultiDayTimes
          formats={{
            timeGutterFormat: 'HH:mm',
            eventTimeRangeFormat: ({ start, end }: any) => 
              `${moment(start).format('HH:mm')} - ${moment(end).format('HH:mm')}`,
            agendaTimeFormat: 'HH:mm',
            agendaTimeRangeFormat: ({ start, end }: any) => 
              `${moment(start).format('HH:mm')} - ${moment(end).format('HH:mm')}`
          }}
        />
      </div>
    </div>
  );
};