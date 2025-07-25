
import React, { useState } from 'react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { TaskTable } from '../components/maintenance/TaskTable';
import { StatusCard } from '../components/maintenance/StatusCard';
import { Calendar, Clock, AlertCircle, CheckCircle, XCircle, Users, Download, Filter, Search } from 'lucide-react';

const statusCards = [
  { title: 'Scheduled', count: 1356, color: '#F6F4EE', textColor: 'text-[#C72030]', iconBg: '#C72030', icon: Calendar },
  { title: 'Open', count: 176, color: '#F6F4EE', textColor: 'text-[#C72030]', iconBg: '#C72030', icon: Clock },
  { title: 'In Progress', count: 1, color: '#F6F4EE', textColor: 'text-[#C72030]', iconBg: '#C72030', icon: AlertCircle },
  { title: 'Closed', count: 2, color: '#F6F4EE', textColor: 'text-[#C72030]', iconBg: '#C72030', icon: CheckCircle },
  { title: 'Overdue', count: 1033, color: '#F6F4EE', textColor: 'text-[#C72030]', iconBg: '#C72030', icon: XCircle }
];

const mockTaskData = [
  {
    id: '17598257',
    checklist: 'Test Ladies washroom Checklists',
    type: 'PPM',
    schedule: '14/06/2025, 11:00PM',
    assignTo: 'Vinayak Mane',
    status: 'Open',
    scheduleFor: 'Service',
    assetsServices: 'Test Ladies washroom Service',
    site: 'Lockated',
    location: 'Building : Ideal Landmark / Wing : A / Floor : NA / Area : NA / Room : NA',
    supplier: '',
    graceTime: '3Hour',
    duration: '2 Hours',
    percentage: '75%'
  },
  {
    id: '17598256',
    checklist: 'Test Ladies washroom Checklists',
    type: 'PPM',
    schedule: '14/06/2025, 10:00PM',
    assignTo: 'Vinayak Mane',
    status: 'Open',
    scheduleFor: 'Service',
    assetsServices: 'Test Ladies washroom Service',
    site: 'Lockated',
    location: 'Building : Ideal Landmark / Wing : A / Floor : NA / Area : NA / Room : NA',
    supplier: '',
    graceTime: '3Hour',
    duration: '1.5 Hours',
    percentage: '90%'
  }
];

export const TaskListDashboard = () => {
  const [dateFrom, setDateFrom] = useState('2025-06-01');
  const [dateTo, setDateTo] = useState('2025-06-30');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTasks, setSelectedTasks] = useState<string[]>([]);

  const handleViewTask = (taskId: string) => {
    console.log('Viewing task:', taskId);
  };

  const handleDateReset = () => {
    setDateFrom('2025-06-01');
    setDateTo('2025-06-30');
  };

  const handleSearch = () => {
    console.log('Searching for:', searchTerm);
  };

  const handleExport = () => {
    console.log('Exporting tasks...');
  };

  return (
    <div className="p-6 bg-[#EDEAE3] min-h-screen">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">SCHEDULED TASK</h1>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="list" className="w-full">
          <TabsList className="grid w-fit grid-cols-2 bg-white">
            <TabsTrigger 
              value="list" 
              className="data-[state=active]:bg-[#C72030] data-[state=active]:text-white"
            >
              List
            </TabsTrigger>
            <TabsTrigger 
              value="calendar"
              className="data-[state=active]:bg-[#C72030] data-[state=active]:text-white"
            >
              Calendar
            </TabsTrigger>
          </TabsList>

          <TabsContent value="list" className="space-y-6 mt-6">
            {/* Date Range Controls */}
            <div className="flex gap-3 items-center flex-wrap">
              <div className="flex gap-2 items-center">
                <label className="text-sm font-medium text-gray-700">From:</label>
                <Input 
                  type="date" 
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                  className="w-40"
                />
              </div>
              <div className="flex gap-2 items-center">
                <label className="text-sm font-medium text-gray-700">To:</label>
                <Input 
                  type="date" 
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                  className="w-40"
                />
              </div>
              <Button 
                onClick={handleSearch}
                className="bg-[#C72030] hover:bg-[#A01D28] text-white"
              >
                Apply
              </Button>
              <Button 
                variant="outline" 
                onClick={handleDateReset}
                className="border-[#C72030] text-[#C72030] hover:bg-[#C72030] hover:text-white"
              >
                Reset
              </Button>
            </div>

            {/* Status Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
              {statusCards.map((card, index) => (
                <StatusCard
                  key={index}
                  title={card.title}
                  count={card.count}
                  color={card.color}
                  textColor={card.textColor}
                  iconBg={card.iconBg}
                  icon={card.icon}
                />
              ))}
            </div>

            {/* Search and Filter Controls */}
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <div className="flex gap-3 items-center flex-wrap">
                <Button 
                  variant="outline" 
                  className="border-[#C72030] text-[#C72030] hover:bg-[#C72030] hover:text-white"
                >
                  <Filter className="w-4 h-4 mr-2" />
                  Filters
                </Button>
                <div className="flex gap-2 flex-1 min-w-0">
                  <Input 
                    placeholder="Search with Task ID" 
                    className="max-w-xs"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <Input 
                    placeholder="Search using checklist name or assigned to" 
                    className="max-w-xs"
                  />
                </div>
                <div className="flex gap-2">
                  <Button 
                    onClick={handleSearch}
                    className="bg-[#C72030] hover:bg-[#A01D28] text-white"
                  >
                    <Search className="w-4 h-4 mr-2" />
                    Go
                  </Button>
                  <Button 
                    onClick={handleExport}
                    className="bg-[#C72030] hover:bg-[#A01D28] text-white"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Export
                  </Button>
                </div>
              </div>
            </div>

            {/* Selection Panel */}
            {selectedTasks.length > 0 && (
              <div className="bg-[#C72030] text-white rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <span className="font-medium">
                    {selectedTasks.length} task(s) selected
                  </span>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="border-white text-white hover:bg-white hover:text-[#C72030]"
                      onClick={() => setSelectedTasks([])}
                    >
                      Clear Selection
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="border-white text-white hover:bg-white hover:text-[#C72030]"
                    >
                      Bulk Actions
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Task Table */}
            <TaskTable
              tasks={mockTaskData}
              onViewTask={handleViewTask}
              selectedTasks={selectedTasks}
              onTaskSelection={setSelectedTasks}
            />
          </TabsContent>

          <TabsContent value="calendar" className="mt-6">
            <div className="bg-white rounded-lg p-8 text-center">
              <Calendar className="w-16 h-16 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Calendar View</h3>
              <p className="text-gray-600">Calendar view is coming soon...</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
