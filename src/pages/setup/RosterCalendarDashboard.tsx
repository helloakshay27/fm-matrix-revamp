
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, Users, Clock } from "lucide-react";
import { RosterCalendarFilterDialog } from "@/components/RosterCalendarFilterDialog";

interface RosterEvent {
  id: string;
  date: Date;
  shift: string;
  employees: string[];
  status: 'scheduled' | 'in-progress' | 'completed';
}

export const RosterCalendarDashboard = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedView, setSelectedView] = useState('month');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Mock roster data
  const [rosterEvents] = useState<RosterEvent[]>([
    {
      id: '1',
      date: new Date(),
      shift: 'Morning (9:00 AM - 6:00 PM)',
      employees: ['John Doe', 'Jane Smith', 'Mike Johnson'],
      status: 'scheduled'
    },
    {
      id: '2',
      date: new Date(Date.now() + 86400000), // Tomorrow
      shift: 'Evening (2:00 PM - 11:00 PM)',
      employees: ['Sarah Wilson', 'Tom Brown'],
      status: 'scheduled'
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'in-progress': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const selectedDayEvents = rosterEvents.filter(event => 
    selectedDate && 
    event.date.toDateString() === selectedDate.toDateString()
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-6">
        {/* Header */}
        <div className="mb-6">
          <div className="text-sm text-gray-500 mb-2">Space &gt; Roster Calendar</div>
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-800">ROSTER CALENDAR</h1>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setIsFilterOpen(true)}
              >
                Filter
              </Button>
              <Button className="bg-[#C72030] hover:bg-[#C72030]/90 text-white">
                <CalendarDays className="w-4 h-4 mr-2" />
                Add Roster
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Calendar Section */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-[#C72030]">Calendar View</CardTitle>
                  <Select value={selectedView} onValueChange={setSelectedView}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="month">Month</SelectItem>
                      <SelectItem value="week">Week</SelectItem>
                      <SelectItem value="day">Day</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  className="rounded-md border"
                />
              </CardContent>
            </Card>
          </div>

          {/* Event Details Section */}
          <div className="space-y-6">
            {/* Selected Date Events */}
            <Card>
              <CardHeader>
                <CardTitle className="text-[#C72030] flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  {selectedDate ? selectedDate.toLocaleDateString() : 'Select a date'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {selectedDayEvents.length > 0 ? (
                  <div className="space-y-4">
                    {selectedDayEvents.map((event) => (
                      <div key={event.id} className="p-3 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-[#C72030]" />
                            <span className="font-medium text-sm">{event.shift}</span>
                          </div>
                          <Badge className={getStatusColor(event.status)}>
                            {event.status}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Users className="w-4 h-4" />
                          <span>{event.employees.length} employees</span>
                        </div>
                        <div className="mt-2">
                          <p className="text-xs text-gray-500">
                            {event.employees.join(', ')}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm">No roster events for this date</p>
                )}
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="text-[#C72030]">Quick Stats</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Total Events</span>
                    <span className="font-medium">{rosterEvents.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Scheduled</span>
                    <span className="font-medium text-blue-600">
                      {rosterEvents.filter(e => e.status === 'scheduled').length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">In Progress</span>
                    <span className="font-medium text-yellow-600">
                      {rosterEvents.filter(e => e.status === 'in-progress').length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Completed</span>
                    <span className="font-medium text-green-600">
                      {rosterEvents.filter(e => e.status === 'completed').length}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <RosterCalendarFilterDialog
          open={isFilterOpen}
          onOpenChange={setIsFilterOpen}
        />
      </div>
    </div>
  );
};
