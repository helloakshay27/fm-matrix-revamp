
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { Filter, Download, Eye, Settings } from 'lucide-react';
import { TaskAdvancedFilterDialog } from '@/components/TaskAdvancedFilterDialog';
import { useNavigate } from 'react-router-dom';

const statusCards = [
  { title: 'Scheduled', count: 1555, color: 'bg-red-500', textColor: 'text-white' },
  { title: 'Open', count: 174, color: 'bg-green-500', textColor: 'text-white' },
  { title: 'In Progress', count: 0, color: 'bg-orange-500', textColor: 'text-white' },
  { title: 'Closed', count: 0, color: 'bg-orange-400', textColor: 'text-white' },
  { title: 'Overdue', count: 907, color: 'bg-red-600', textColor: 'text-white' }
];

const taskData = [
  {
    id: '17598929',
    checklist: 'Test Ladies washroom Checklists',
    type: 'PPM',
    schedule: '12/07/2025, 11:00PM',
    assignTo: 'Vinayak Mane',
    status: 'Open',
    scheduleFor: 'Service',
    assetsServices: 'Test Ladies washroom Service',
    site: 'Lockated',
    location: 'Building ->Ideal Landmark / Wing ->A / Floor ->NA / Area ->NA / Room ->NA',
    supplier: '',
    graceTime: '3Hour',
    duration: '',
    percentage: ''
  },
  {
    id: '17598928',
    checklist: 'Test Ladies washroom Checklists',
    type: 'PPM',
    schedule: '12/07/2025, 10:00PM',
    assignTo: 'Vinayak Mane',
    status: 'Open',
    scheduleFor: 'Service',
    assetsServices: 'Test Ladies washroom Service',
    site: 'Lockated',
    location: 'Building ->Ideal Landmark / Wing ->A / Floor ->NA / Area ->NA / Room ->NA',
    supplier: '',
    graceTime: '3Hour',
    duration: '',
    percentage: ''
  },
  {
    id: '14481924',
    checklist: 'LIFT LOBBY CLEANING',
    type: 'PPM',
    schedule: '12/07/2025, 09:00PM',
    assignTo: '',
    status: 'Open',
    scheduleFor: 'Service',
    assetsServices: 'Daily Cleaning_Cabin',
    site: 'Lockated',
    location: 'Building ->Jyoti Tower / Wing ->NA / Floor ->2nd Floor / Area ->NA / Room ->Main Cabin',
    supplier: '',
    graceTime: '3Day',
    duration: '',
    percentage: ''
  },
  {
    id: '14488609',
    checklist: 'LIFT LOBBY CLEANING',
    type: 'PPM',
    schedule: '12/07/2025, 09:00PM',
    assignTo: '',
    status: 'Open',
    scheduleFor: 'Service',
    assetsServices: 'Daily Cleaning_Cabin',
    site: 'Lockated',
    location: 'Building ->Jyoti Tower / Wing ->NA / Floor ->2nd Floor / Area ->NA / Room ->Main Cabin',
    supplier: '',
    graceTime: '3Day',
    duration: '',
    percentage: ''
  },
  {
    id: '14503909',
    checklist: 'platform cleaning',
    type: 'PPM',
    schedule: '12/07/2025, 09:00PM',
    assignTo: '',
    status: 'Open',
    scheduleFor: 'Service',
    assetsServices: 'Daily Cleaning_Dining Area',
    site: 'Lockated',
    location: 'Building ->Jyoti Tower / Wing ->NA / Floor ->2nd Floor / Area ->NA / Room ->Dinning Area',
    supplier: '',
    graceTime: '30Minutes',
    duration: '',
    percentage: ''
  },
  {
    id: '17598927',
    checklist: 'Test Ladies washroom Checklists',
    type: 'PPM',
    schedule: '12/07/2025, 09:00PM',
    assignTo: 'Vinayak Mane',
    status: 'Open',
    scheduleFor: 'Service',
    assetsServices: 'Test Ladies washroom Service',
    site: 'Lockated',
    location: 'Building ->Ideal Landmark / Wing ->A / Floor ->NA / Area ->NA / Room ->NA',
    supplier: '',
    graceTime: '3Hour',
    duration: '',
    percentage: ''
  }
];

export const ScheduledTaskDashboard = () => {
  const navigate = useNavigate();
  const [dateFrom, setDateFrom] = useState('01/07/2025');
  const [dateTo, setDateTo] = useState('31/07/2025');
  const [searchTaskId, setSearchTaskId] = useState('');
  const [searchChecklist, setSearchChecklist] = useState('');
  const [activeTab, setActiveTab] = useState('List');
  const [showAdvancedFilter, setShowAdvancedFilter] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

  const handleViewTask = (taskId: string) => {
    navigate(`/task-details/${taskId}`);
  };

  const handleAdvancedFilter = (filters: any) => {
    console.log('Advanced filters applied:', filters);
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
          <span>Scheduled Task</span>
          <span>&gt;</span>
          <span>Scheduled Task List</span>
        </div>
        <h1 className="text-2xl font-bold text-[#1a1a1a] uppercase">SCHEDULED TASK</h1>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 mb-6">
        <Button 
          variant={activeTab === 'List' ? 'default' : 'ghost'} 
          className={activeTab === 'List' ? 'border-b-2 border-red-500 text-red-500 bg-white' : 'text-gray-600'}
          onClick={() => setActiveTab('List')}
        >
          List
        </Button>
        <Button 
          variant={activeTab === 'Calendar' ? 'default' : 'ghost'} 
          className={activeTab === 'Calendar' ? 'border-b-2 border-red-500 text-red-500 bg-white' : 'text-gray-600'}
          onClick={() => setActiveTab('Calendar')}
        >
          Calendar
        </Button>
      </div>

      {activeTab === 'List' && (
        <>
          {/* Date Range */}
          <div className="flex gap-3 mb-6">
            <Input 
              type="date" 
              value={dateFrom.split('/').reverse().join('-')}
              onChange={(e) => setDateFrom(e.target.value.split('-').reverse().join('/'))}
              className="w-40"
            />
            <Input 
              type="date" 
              value={dateTo.split('/').reverse().join('-')}
              onChange={(e) => setDateTo(e.target.value.split('-').reverse().join('/'))}
              className="w-40"
            />
            <Button className="bg-green-600 hover:bg-green-700 text-white">Apply</Button>
            <Button variant="outline">Reset</Button>
          </div>

          {/* Status Cards */}
          <div className="grid grid-cols-5 gap-4 mb-6">
            {statusCards.map((card, index) => (
              <div key={index} className={`${card.color} ${card.textColor} p-4 rounded-lg flex items-center gap-3`}>
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <span className="text-lg font-bold">{card.count}</span>
                </div>
                <div>
                  <div className="text-2xl font-bold">{card.count}</div>
                  <div className="text-sm opacity-90">{card.title}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Search and Actions */}
          <div className="flex gap-3 mb-6">
            <Button 
              variant="outline" 
              className="border-[#8B4513] text-[#8B4513]"
              onClick={() => setShowAdvancedFilter(true)}
            >
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </Button>
            <Input 
              placeholder="Search with Task ID" 
              value={searchTaskId}
              onChange={(e) => setSearchTaskId(e.target.value)}
              className="max-w-xs" 
            />
            <Input 
              placeholder="Search using checklist name or assigned to" 
              value={searchChecklist}
              onChange={(e) => setSearchChecklist(e.target.value)}
              className="max-w-xs" 
            />
            <Button className="bg-[#8B4513] hover:bg-[#7A3F12] text-white">Go</Button>
            <Button className="bg-[#8B4513] hover:bg-[#7A3F12] text-white">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>

          {/* Task Cards */}
          <div className="grid gap-4">
            {taskData.map((task) => (
              <Card key={task.id} className="border rounded-lg">
                <CardContent className="p-6">
                  <div className="grid grid-cols-12 gap-4 items-center">
                    <div className="col-span-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleViewTask(task.id)}
                        className="p-1"
                      >
                        <Eye className="w-4 h-4 text-gray-600" />
                      </Button>
                    </div>
                    <div className="col-span-1">
                      <span className="text-sm font-medium">{task.id}</span>
                    </div>
                    <div className="col-span-2">
                      <span className="text-sm">{task.checklist}</span>
                    </div>
                    <div className="col-span-1">
                      <span className="text-sm">{task.type}</span>
                    </div>
                    <div className="col-span-2">
                      <span className="text-sm">{task.schedule}</span>
                    </div>
                    <div className="col-span-1">
                      <span className="text-sm">{task.assignTo}</span>
                    </div>
                    <div className="col-span-1">
                      <span className="px-2 py-1 rounded text-xs bg-green-100 text-green-800">
                        {task.status}
                      </span>
                    </div>
                    <div className="col-span-1">
                      <span className="text-sm">{task.scheduleFor}</span>
                    </div>
                    <div className="col-span-2">
                      <span className="text-sm truncate">{task.assetsServices}</span>
                    </div>
                  </div>
                  <div className="mt-4 grid grid-cols-12 gap-4 text-sm text-gray-600">
                    <div className="col-span-1"></div>
                    <div className="col-span-2">
                      <span>Site: {task.site}</span>
                    </div>
                    <div className="col-span-6">
                      <span className="truncate">Location: {task.location}</span>
                    </div>
                    <div className="col-span-2">
                      <span>Grace Time: {task.graceTime}</span>
                    </div>
                    <div className="col-span-1">
                      <span>{task.duration}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      )}

      {activeTab === 'Calendar' && (
        <div className="space-y-6">
          {/* Date Range for Calendar */}
          <div className="flex gap-3 mb-6">
            <Input 
              type="date" 
              value={dateFrom.split('/').reverse().join('-')}
              onChange={(e) => setDateFrom(e.target.value.split('-').reverse().join('/'))}
              className="w-40"
            />
            <Input 
              type="date" 
              value={dateTo.split('/').reverse().join('-')}
              onChange={(e) => setDateTo(e.target.value.split('-').reverse().join('/'))}
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
              onSelect={setSelectedDate}
              className="w-full"
            />
          </div>
        </div>
      )}

      {/* Advanced Filter Dialog */}
      <TaskAdvancedFilterDialog
        open={showAdvancedFilter}
        onOpenChange={setShowAdvancedFilter}
        onApply={handleAdvancedFilter}
      />
    </div>
  );
};
