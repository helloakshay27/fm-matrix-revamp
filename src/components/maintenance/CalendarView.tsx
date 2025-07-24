
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Calendar } from '@/components/ui/calendar';

interface Task {
  id: string;
  checklist: string;
  type: string;
  schedule: string;
  assignTo: string;
  status: string;
  scheduleFor: string;
  assetsServices: string;
  site: string;
  location: string;
  supplier: string;
  graceTime: string;
  duration: string;
  percentage: string;
}

interface CalendarViewProps {
  dateFrom: string;
  dateTo: string;
  selectedDate: Date | undefined;
  onDateFromChange: (value: string) => void;
  onDateToChange: (value: string) => void;
  onSelectedDateChange: (date: Date | undefined) => void;
  tasks?: Task[];
}

export const CalendarView: React.FC<CalendarViewProps> = ({
  dateFrom,
  dateTo,
  selectedDate,
  onDateFromChange,
  onDateToChange,
  onSelectedDateChange,
  tasks = []
}) => {
  const [calendarView, setCalendarView] = useState<'month' | 'week' | 'day'>('month');
  const [currentDate, setCurrentDate] = useState(new Date());

  // Get tasks for a specific date
  const getTasksForDate = (date: Date) => {
    return tasks.filter(task => {
      const taskDate = new Date(task.scheduleFor);
      return taskDate.toDateString() === date.toDateString();
    });
  };

  // Check if a date has tasks
  const hasTasksOnDate = (date: Date) => {
    return getTasksForDate(date).length > 0;
  };

  const navigateCalendar = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    if (calendarView === 'month') {
      newDate.setMonth(newDate.getMonth() + (direction === 'next' ? 1 : -1));
    } else if (calendarView === 'week') {
      newDate.setDate(newDate.getDate() + (direction === 'next' ? 7 : -7));
    } else {
      newDate.setDate(newDate.getDate() + (direction === 'next' ? 1 : -1));
    }
    setCurrentDate(newDate);
  };

  const goToToday = () => {
    setCurrentDate(new Date());
    onSelectedDateChange(new Date());
  };
  return (
    <div className="space-y-6">
      {/* Legend */}
      <div className="flex flex-wrap gap-6 text-sm mb-6 p-4 bg-muted/30 rounded-lg">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
          <span>Scheduled ({tasks.filter(t => t.status === 'Scheduled').length})</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          <span>Open ({tasks.filter(t => t.status === 'Open').length})</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
          <span>In Progress ({tasks.filter(t => t.status === 'In Progress').length})</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-green-600 rounded-full"></div>
          <span>Closed ({tasks.filter(t => t.status === 'Closed').length})</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
          <span>Overdue ({tasks.filter(t => t.status === 'Overdue').length})</span>
        </div>
      </div>

      {/* Calendar Navigation */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => navigateCalendar('prev')}
            className="hover:bg-primary/10"
          >
            &lt;
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => navigateCalendar('next')}
            className="hover:bg-primary/10"
          >
            &gt;
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={goToToday}
            className="hover:bg-primary/10"
          >
            Today
          </Button>
        </div>
        <h2 className="text-xl font-semibold text-foreground">
          {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
        </h2>
        <div className="flex gap-2">
          <Button 
            variant={calendarView === 'month' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => setCalendarView('month')}
            className="hover:bg-primary/10"
          >
            Month
          </Button>
          <Button 
            variant={calendarView === 'week' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => setCalendarView('week')}
            className="hover:bg-primary/10"
          >
            Week
          </Button>
          <Button 
            variant={calendarView === 'day' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => setCalendarView('day')}
            className="hover:bg-primary/10"
          >
            Day
          </Button>
        </div>
      </div>

      {/* Enhanced Calendar */}
      <div className="border rounded-lg bg-card shadow-sm">
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={onSelectedDateChange}
          className="w-full p-4 pointer-events-auto"
          month={currentDate}
          onMonthChange={setCurrentDate}
          modifiers={{
            hasTask: (date) => hasTasksOnDate(date)
          }}
          modifiersStyles={{
            hasTask: {
              backgroundColor: 'hsl(var(--primary))',
              color: 'white',
              fontWeight: 'bold'
            }
          }}
          components={{
            Day: ({ date, displayMonth, ...props }: any) => {
              const taskCount = getTasksForDate(date).length;
              return (
                <div className="relative">
                  <button {...props}>
                    {date.getDate()}
                    {taskCount > 0 && (
                      <div className="absolute -top-1 -right-1 bg-primary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                        {taskCount}
                      </div>
                    )}
                  </button>
                </div>
              );
            }
          }}
        />
      </div>

      {/* Selected Date Tasks */}
      {selectedDate && getTasksForDate(selectedDate).length > 0 && (
        <div className="mt-6 p-4 bg-card border rounded-lg">
          <h3 className="text-lg font-semibold mb-4 text-foreground">
            Tasks for {selectedDate.toLocaleDateString()}
          </h3>
          <div className="space-y-2">
            {getTasksForDate(selectedDate).map((task) => (
              <div key={task.id} className="p-3 bg-muted/30 rounded-lg flex items-center justify-between">
                <div>
                  <div className="font-medium text-foreground">{task.checklist}</div>
                  <div className="text-sm text-muted-foreground">
                    {task.type} • {task.assignTo} • {task.location}
                  </div>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  task.status === 'Completed' ? 'bg-green-100 text-green-600' :
                  task.status === 'In Progress' ? 'bg-blue-100 text-blue-600' :
                  task.status === 'Overdue' ? 'bg-red-100 text-red-600' :
                  'bg-yellow-100 text-yellow-600'
                }`}>
                  {task.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
