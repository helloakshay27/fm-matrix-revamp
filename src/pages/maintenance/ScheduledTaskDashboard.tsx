import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Filter, Download, Eye, Settings, Clock, AlertCircle, Play, CheckCircle, XCircle } from 'lucide-react';
import { TaskAdvancedFilterDialog } from '@/components/TaskAdvancedFilterDialog';
import { useNavigate } from 'react-router-dom';

const statusCards = [
  { 
    title: 'Scheduled', 
    count: 1555, 
    color: 'bg-blue-50', 
    textColor: 'text-blue-600',
    iconBg: 'bg-blue-100',
    icon: Clock
  },
  { 
    title: 'Open', 
    count: 174, 
    color: 'bg-green-50', 
    textColor: 'text-green-600',
    iconBg: 'bg-green-100',
    icon: AlertCircle
  },
  { 
    title: 'In Progress', 
    count: 0, 
    color: 'bg-yellow-50', 
    textColor: 'text-yellow-600',
    iconBg: 'bg-yellow-100',
    icon: Play
  },
  { 
    title: 'Closed', 
    count: 0, 
    color: 'bg-gray-50', 
    textColor: 'text-gray-600',
    iconBg: 'bg-gray-100',
    icon: CheckCircle
  },
  { 
    title: 'Overdue', 
    count: 907, 
    color: 'bg-red-50', 
    textColor: 'text-red-600',
    iconBg: 'bg-red-100',
    icon: XCircle
  }
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
    <div className="min-h-screen bg-background">
      <div className="bg-card border-b">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
            <span>Scheduled Task</span>
            <span>&gt;</span>
            <span>Scheduled Task List</span>
          </div>
          <h1 className="text-2xl font-bold text-foreground uppercase">SCHEDULED TASK</h1>
        </div>
      </div>
      
      <div className="container mx-auto px-6 py-6">

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
            {statusCards.map((card, index) => {
              const IconComponent = card.icon;
              return (
                <Card key={index} className={`${card.color} border-0 shadow-sm hover:shadow-md transition-shadow`}>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 ${card.iconBg} rounded-lg flex items-center justify-center`}>
                        <IconComponent className={`w-6 h-6 ${card.textColor}`} />
                      </div>
                      <div className="flex-1">
                        <div className={`text-2xl font-bold ${card.textColor}`}>{card.count}</div>
                        <div className="text-sm text-gray-600">{card.title}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
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

          {/* Task Table */}
          <div className="bg-white rounded-lg border">
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
                  <TableHead>%</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {taskData.map((task) => (
                  <TableRow key={task.id} className="hover:bg-gray-50">
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleViewTask(task.id)}
                        className="p-2 h-8 w-8 hover:bg-accent"
                      >
                        <Eye className="w-4 h-4 text-muted-foreground" />
                      </Button>
                    </TableCell>
                    <TableCell className="font-medium">{task.id}</TableCell>
                    <TableCell>{task.checklist}</TableCell>
                    <TableCell>{task.type}</TableCell>
                    <TableCell>{task.schedule}</TableCell>
                    <TableCell>{task.assignTo || '-'}</TableCell>
                    <TableCell>
                      <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-600 font-medium">
                        {task.status}
                      </span>
                    </TableCell>
                    <TableCell>{task.scheduleFor}</TableCell>
                    <TableCell>{task.assetsServices}</TableCell>
                    <TableCell>{task.site}</TableCell>
                    <TableCell className="max-w-xs truncate" title={task.location}>
                      {task.location}
                    </TableCell>
                    <TableCell>{task.supplier || '-'}</TableCell>
                    <TableCell>{task.graceTime}</TableCell>
                    <TableCell>{task.duration || '-'}</TableCell>
                    <TableCell>{task.percentage || '-'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
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
    </div>
  );
};
