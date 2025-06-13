
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { ChevronLeft, ChevronRight, Filter, Eye } from 'lucide-react';

const taskData = [
  {
    id: '52696457',
    type: 'Meeting Room Checklist',
    schedule: '13/06/2025, 05:30PM',
    assignTo: 'Nidhi Sankhla, HK supervisor UrbanWrk Aeromall 01, Vishant Tarachandani, Prasad Salunke',
    status: 'Open',
    scheduleFor: 'Service',
    assetsServices: 'Cleaning Mahogany Meeting Room',
    site: 'Aeromall, Viman Nagar',
    location: 'Building -AeroMall / Wing -NA / Floor -3rd Floor / Area - Passage C / Room - Meeting Room Mahogany',
    duration: '3Hour'
  },
  {
    id: '52697497',
    type: 'Meeting Room Checklist',
    schedule: '13/06/2025, 05:30PM',
    assignTo: 'Nidhi Sankhla, HK supervisor UrbanWrk Aeromall 01, Vishant Tarachandani, Prasad Salunke',
    status: 'Open',
    scheduleFor: 'Service',
    assetsServices: 'Cleaning Oak Meeting Room',
    site: 'Aeromall, Viman Nagar',
    location: 'Building -AeroMall / Wing -NA / Floor -3rd Floor / Area - Passage C / Room - Meeting Room Oak',
    duration: '3Hour'
  }
];

const statusStats = [
  { label: 'Scheduled', count: 591, color: 'bg-orange-500' },
  { label: 'Open', count: 23, color: 'bg-green-500' },
  { label: 'In Progress', count: 2, color: 'bg-yellow-500' },
  { label: 'Closed', count: 464, color: 'bg-blue-500' },
  { label: 'Overdue', count: 9, color: 'bg-red-500' }
];

export const TaskDashboard = () => {
  const [currentDate, setCurrentDate] = useState(new Date(2025, 5, 1)); // June 2025
  const [viewMode, setViewMode] = useState('month');

  const formatMonth = (date: Date) => {
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    if (direction === 'prev') {
      newDate.setMonth(newDate.getMonth() - 1);
    } else {
      newDate.setMonth(newDate.getMonth() + 1);
    }
    setCurrentDate(newDate);
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#1a1a1a] mb-2">Scheduled Task</h1>
        <p className="text-[#1a1a1a] opacity-70">Scheduled Task &gt; Scheduled Task List</p>
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-semibold text-[#1a1a1a] mb-4">SCHEDULED TASK CALENDAR</h2>
        
        <Tabs defaultValue="list" className="w-full">
          <TabsList className="grid w-fit grid-cols-2 mb-6">
            <TabsTrigger value="list">List</TabsTrigger>
            <TabsTrigger value="calendar">Calendar</TabsTrigger>
          </TabsList>

          <TabsContent value="list" className="space-y-6">
            {/* Date Range and Filters */}
            <div className="flex flex-wrap items-center gap-4 mb-6">
              <Input 
                type="date" 
                defaultValue="2025-06-01"
                className="w-fit"
              />
              <Input 
                type="date" 
                defaultValue="2025-06-30"
                className="w-fit"
              />
              <Button className="bg-green-600 hover:bg-green-700">Apply</Button>
              <Button variant="outline">Reset</Button>
            </div>

            {/* Status Cards */}
            <div className="flex flex-wrap gap-4 mb-6">
              {statusStats.map((stat) => (
                <div key={stat.label} className="flex items-center gap-2 bg-white p-4 rounded-lg border">
                  <div className={`w-8 h-8 rounded-full ${stat.color} flex items-center justify-center`}>
                    <span className="text-white text-sm font-semibold">{stat.count}</span>
                  </div>
                  <span className="text-sm font-medium">{stat.label}</span>
                </div>
              ))}
            </div>

            {/* Search and Filters */}
            <div className="flex flex-wrap items-center gap-4 mb-6">
              <Button variant="outline" className="flex items-center gap-2">
                <Filter className="w-4 h-4" />
                Filters
              </Button>
              <Input 
                placeholder="Search with Task ID"
                className="w-64"
              />
              <Input 
                placeholder="Search using checklist name or assigned to"
                className="w-80"
              />
              <Button className="bg-purple-600 hover:bg-purple-700">Go</Button>
              <Button variant="outline" className="bg-purple-600 text-white hover:bg-purple-700">Export</Button>
            </div>

            {/* Task Table */}
            <div className="bg-white rounded-lg border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Action</TableHead>
                    <TableHead>ID</TableHead>
                    <TableHead>Checklist</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Schedule</TableHead>
                    <TableHead>Assign to</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Schedule For</TableHead>
                    <TableHead>Assets/Services</TableHead>
                    <TableHead>Site</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Supplier</TableHead>
                    <TableHead>Grace Time</TableHead>
                    <TableHead>Duration</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {taskData.map((task) => (
                    <TableRow key={task.id}>
                      <TableCell>
                        <Button variant="ghost" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                      </TableCell>
                      <TableCell className="font-medium">{task.id}</TableCell>
                      <TableCell>{task.type}</TableCell>
                      <TableCell>
                        <Badge variant="outline">Routine</Badge>
                      </TableCell>
                      <TableCell>{task.schedule}</TableCell>
                      <TableCell className="max-w-xs truncate">{task.assignTo}</TableCell>
                      <TableCell>
                        <Badge className="bg-green-100 text-green-800">{task.status}</Badge>
                      </TableCell>
                      <TableCell>{task.scheduleFor}</TableCell>
                      <TableCell>{task.assetsServices}</TableCell>
                      <TableCell>{task.site}</TableCell>
                      <TableCell className="max-w-xs truncate">{task.location}</TableCell>
                      <TableCell>-</TableCell>
                      <TableCell>-</TableCell>
                      <TableCell>{task.duration}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          <TabsContent value="calendar" className="space-y-6">
            {/* Date Range and Filters for Calendar */}
            <div className="flex flex-wrap items-center gap-4 mb-6">
              <Input 
                type="date" 
                defaultValue="2025-06-01"
                className="w-fit"
              />
              <Input 
                type="date" 
                defaultValue="2025-06-30"
                className="w-fit"
              />
              <Select defaultValue="">
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Select Some Options" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="routine">Routine</SelectItem>
                  <SelectItem value="emergency">Emergency</SelectItem>
                </SelectContent>
              </Select>
              <Select defaultValue="">
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Select Schedule Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                </SelectContent>
              </Select>
              <Button className="bg-purple-600 hover:bg-purple-700">Apply</Button>
              <Button variant="outline">Reset</Button>
              <Button variant="outline" className="bg-purple-600 text-white hover:bg-purple-700">Export</Button>
            </div>

            {/* Calendar View */}
            <div className="bg-white rounded-lg border p-6">
              {/* Calendar Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => navigateMonth('prev')}
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => navigateMonth('next')}
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm">today</Button>
                </div>
                
                <h3 className="text-lg font-semibold">{formatMonth(currentDate)}</h3>
                
                <div className="flex gap-2">
                  <Button 
                    variant={viewMode === 'month' ? 'default' : 'outline'} 
                    size="sm"
                    onClick={() => setViewMode('month')}
                  >
                    month
                  </Button>
                  <Button 
                    variant={viewMode === 'week' ? 'default' : 'outline'} 
                    size="sm"
                    onClick={() => setViewMode('week')}
                  >
                    week
                  </Button>
                  <Button 
                    variant={viewMode === 'day' ? 'default' : 'outline'} 
                    size="sm"
                    onClick={() => setViewMode('day')}
                  >
                    day
                  </Button>
                  <Button 
                    variant={viewMode === 'list' ? 'default' : 'outline'} 
                    size="sm"
                    onClick={() => setViewMode('list')}
                  >
                    list
                  </Button>
                </div>
              </div>

              {/* Legend */}
              <div className="flex flex-wrap items-center gap-4 mb-4 text-sm">
                <span>Legends:</span>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-yellow-400 rounded"></div>
                  <span>Scheduled</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-red-500 rounded"></div>
                  <span>Open</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-blue-500 rounded"></div>
                  <span>In Progress</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-green-500 rounded"></div>
                  <span>Closed</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-red-600 rounded"></div>
                  <span>Overdue</span>
                </div>
              </div>

              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-1">
                {/* Header Days */}
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                  <div key={day} className="p-3 text-center font-medium text-blue-600 bg-blue-50">
                    {day}
                  </div>
                ))}
                
                {/* Calendar Days */}
                {Array.from({ length: 30 }, (_, i) => i + 1).map((day) => (
                  <div key={day} className="min-h-20 p-2 border border-gray-200 bg-white">
                    <div className="font-medium text-sm mb-1">{day}</div>
                    {/* Sample events */}
                    {day === 1 && (
                      <div className="space-y-1">
                        <div className="text-xs bg-red-100 text-red-800 p-1 rounded">9a PPM - Pest Control Che</div>
                        <div className="text-xs bg-red-100 text-red-800 p-1 rounded">9a PPM - Plants Hydration</div>
                        <div className="text-xs bg-red-100 text-red-800 p-1 rounded">9a PPM - Sanitary Bins Che</div>
                      </div>
                    )}
                    {day === 10 && (
                      <div className="text-xs bg-red-100 text-red-800 p-1 rounded">9a PPM - Plants Hydration</div>
                    )}
                    {day === 15 && (
                      <div className="text-xs bg-yellow-100 text-yellow-800 p-1 rounded">9a PPM - Pest Control Che</div>
                    )}
                    {day === 20 && (
                      <div className="text-xs bg-yellow-100 text-yellow-800 p-1 rounded">9a PPM - Plants Hydration</div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
