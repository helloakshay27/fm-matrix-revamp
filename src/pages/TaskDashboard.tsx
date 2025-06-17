import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Filter, Search, Eye, Download, ChevronDown } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TaskAdvancedFilterDialog } from '@/components/TaskAdvancedFilterDialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

const taskData = [
  {
    id: '17598329',
    checklist: 'Test Ladies washroom Checklist',
    type: 'PPM',
    schedule: '17/06/2025, 11:00PM',
    assignTo: 'Vinayak Mane',
    status: 'Open',
    scheduleFor: 'Service',
    assetsServices: 'Test Ladies washroom Service',
    site: 'Locatled',
    location: 'Building - :Ideal Landmark / Wing - A / Floor - NA / Area - NA / Room - NA',
    supplier: '',
    graceTime: '3Hour',
    duration: ''
  },
  {
    id: '17598328',
    checklist: 'Test Ladies washroom Checklist',
    type: 'PPM',
    schedule: '17/06/2025, 10:00PM',
    assignTo: 'Vinayak Mane',
    status: 'In Progress',
    scheduleFor: 'Service',
    assetsServices: 'Test Ladies washroom Service',
    site: 'Locatled',
    location: 'Building - :Ideal Landmark / Wing - A / Floor - NA / Area - NA / Room - NA',
    supplier: '',
    graceTime: '3Hour',
    duration: ''
  },
  {
    id: '14481305',
    checklist: 'LIFT LOBBY CLEANING',
    type: 'PPM',
    schedule: '17/06/2025, 09:00PM',
    assignTo: '',
    status: 'Closed',
    scheduleFor: 'Service',
    assetsServices: 'Daily Cleaning_Cabin',
    site: 'Locatled',
    location: 'Building - Jyoti Tower / Wing - NA / Floor - 2nd Floor / Area - NA / Room - Main Cabin',
    supplier: '',
    graceTime: '30ay',
    duration: ''
  },
  {
    id: '14488168',
    checklist: 'LIFT LOBBY CLEANING',
    type: 'PPM',
    schedule: '17/06/2025, 09:00PM',
    assignTo: '',
    status: 'Overdue',
    scheduleFor: 'Service',
    assetsServices: 'Daily Cleaning_Cabin',
    site: 'Locatled',
    location: 'Building - Jyoti Tower / Wing - NA / Floor - 2nd Floor / Area - NA / Room - Main Cabin',
    supplier: '',
    graceTime: '30ay',
    duration: ''
  },
  {
    id: '14503809',
    checklist: 'platform cleaning',
    type: 'PPM',
    schedule: '17/06/2025, 09:00PM',
    assignTo: '',
    status: 'Open',
    scheduleFor: 'Service',
    assetsServices: 'Daily Cleaning_Dining Area',
    site: 'Locatled',
    location: 'Building - Jyoti Tower / Wing - NA / Floor - 2nd Floor / Area - NA / Room - Dinning Area',
    supplier: '',
    graceTime: '30Minutes',
    duration: ''
  },
  {
    id: '17598327',
    checklist: 'Test Ladies washroom Checklist',
    type: 'PPM',
    schedule: '17/06/2025, 09:00PM',
    assignTo: 'Vinayak Mane',
    status: 'Open',
    scheduleFor: 'Service',
    assetsServices: 'Test Ladies washroom Service',
    site: 'Locatled',
    location: 'Building - :Ideal Landmark / Wing - A / Floor - NA / Area - NA / Room - NA',
    supplier: '',
    graceTime: '3Hour',
    duration: ''
  }
];

const statusCounts = {
  Scheduled: 1107,
  Open: 171,
  'In Progress': 6,
  Closed: 6,
  Overdue: 1287
};

const statusColors = {
  Scheduled: 'bg-purple-600',
  Open: 'bg-green-500',
  'In Progress': 'bg-orange-500',
  Closed: 'bg-yellow-500',
  Overdue: 'bg-red-500'
};

export const TaskDashboard = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [searchChecklist, setSearchChecklist] = useState('');
  const [filteredTasks, setFilteredTasks] = useState(taskData);
  const [startDate, setStartDate] = useState('01/06/2025');
  const [endDate, setEndDate] = useState('30/06/2025');
  const [view, setView] = useState<'List' | 'Calendar'>('List');
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [calendarDate, setCalendarDate] = useState<Date | undefined>(new Date());
  const [showAdvancedFilter, setShowAdvancedFilter] = useState(false);
  
  // Filter dropdown states
  const [filterType, setFilterType] = useState('');
  const [filterScheduleType, setFilterScheduleType] = useState('');
  const [filterGroup, setFilterGroup] = useState('');
  const [filterSubGroup, setFilterSubGroup] = useState('');

  const handleSearch = () => {
    let filtered = taskData;
    
    if (searchTerm) {
      filtered = filtered.filter(task =>
        task.id.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (searchChecklist) {
      filtered = filtered.filter(task =>
        task.checklist.toLowerCase().includes(searchChecklist.toLowerCase()) ||
        task.assignTo.toLowerCase().includes(searchChecklist.toLowerCase())
      );
    }
    
    if (selectedStatus) {
      filtered = filtered.filter(task => task.status === selectedStatus);
    }
    
    setFilteredTasks(filtered);
  };

  const handleStatusFilter = (status: string) => {
    setSelectedStatus(selectedStatus === status ? null : status);
    let filtered = taskData;
    
    if (selectedStatus !== status) {
      filtered = filtered.filter(task => task.status === status);
    }
    
    setFilteredTasks(filtered);
  };

  const handleReset = () => {
    setSearchTerm('');
    setSearchChecklist('');
    setSelectedStatus(null);
    setFilteredTasks(taskData);
  };

  const handleViewTask = (taskId: string) => {
    navigate(`/maintenance/task/details/${taskId}`);
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'Open': return 'bg-green-100 text-green-700';
      case 'In Progress': return 'bg-orange-100 text-orange-700';
      case 'Closed': return 'bg-yellow-100 text-yellow-700';
      case 'Overdue': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const handleAdvancedFilter = (filters: any) => {
    console.log('Advanced filters applied:', filters);
    // Apply advanced filters logic here
    let filtered = taskData;
    
    if (filters.type) {
      filtered = filtered.filter(task => task.type.toLowerCase() === filters.type.toLowerCase());
    }
    if (filters.assignedTo) {
      filtered = filtered.filter(task => task.assignTo.toLowerCase().includes(filters.assignedTo.toLowerCase()));
    }
    
    setFilteredTasks(filtered);
  };

  const handleExport = () => {
    // Create CSV content
    const headers = ['ID', 'Checklist', 'Type', 'Schedule', 'Assign to', 'Status', 'Schedule For', 'Assets/Services', 'Site', 'Location', 'Supplier', 'Grace Time', 'Duration'];
    const csvContent = [
      headers.join(','),
      ...filteredTasks.map(task => [
        task.id,
        `"${task.checklist}"`,
        task.type,
        `"${task.schedule}"`,
        `"${task.assignTo}"`,
        task.status,
        task.scheduleFor,
        `"${task.assetsServices}"`,
        task.site,
        `"${task.location}"`,
        task.supplier,
        task.graceTime,
        task.duration
      ].join(','))
    ].join('\n');

    // Create and download CSV file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'scheduled_tasks.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleBasicFilter = () => {
    let filtered = taskData;
    
    if (filterType) {
      filtered = filtered.filter(task => task.type.toLowerCase() === filterType.toLowerCase());
    }
    if (filterGroup) {
      filtered = filtered.filter(task => task.checklist.toLowerCase().includes(filterGroup.toLowerCase()));
    }
    if (filterSubGroup) {
      filtered = filtered.filter(task => task.checklist.toLowerCase().includes(filterSubGroup.toLowerCase()));
    }
    
    setFilteredTasks(filtered);
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <p className="text-[#1a1a1a] opacity-70 mb-2">Scheduled Task &gt; Scheduled Task List</p>
        <h1 className="text-2xl font-bold text-[#1a1a1a]">SCHEDULED TASK</h1>
      </div>

      {/* View Tabs */}
      <div className="flex gap-4 mb-6">
        <Button
          variant={view === 'List' ? 'default' : 'outline'}
          onClick={() => setView('List')}
          style={view === 'List' ? { backgroundColor: '#C72030' } : {}}
          className={view === 'List' ? 'text-white' : 'border-[#C72030] text-[#C7030]'}
        >
          List
        </Button>
        <Button
          variant={view === 'Calendar' ? 'default' : 'outline'}
          onClick={() => setView('Calendar')}
          style={view === 'Calendar' ? { backgroundColor: '#C72030' } : {}}
          className={view === 'Calendar' ? 'text-white' : 'border-[#C72030] text-[#C72030]'}
        >
          Calendar
        </Button>
      </div>

      {view === 'List' ? (
        <>
          {/* Date Range and Apply/Reset */}
          <div className="flex items-center gap-3 mb-6">
            <Input
              type="text"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-32"
            />
            <Input
              type="text"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-32"
            />
            <Button style={{ backgroundColor: '#00A651' }} className="text-white">
              Apply
            </Button>
            <Button style={{ backgroundColor: '#FFA500' }} className="text-white" onClick={handleReset}>
              Reset
            </Button>
          </div>

          {/* Status Cards */}
          <div className="grid grid-cols-5 gap-4 mb-6">
            {Object.entries(statusCounts).map(([status, count]) => (
              <div
                key={status}
                className={`${statusColors[status as keyof typeof statusColors]} text-white p-4 rounded-lg text-center cursor-pointer transition-opacity ${
                  selectedStatus === status ? 'opacity-100 ring-2 ring-white' : 'opacity-90 hover:opacity-100'
                }`}
                onClick={() => handleStatusFilter(status)}
              >
                <div className="text-2xl font-bold">{count}</div>
                <div className="text-sm">{status}</div>
              </div>
            ))}
          </div>

          {/* Filter Row */}
          <div className="flex items-center gap-3 mb-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="border-[#C72030] text-[#C72030]">
                  <Filter className="w-4 h-4 mr-2" />
                  Filter
                  <ChevronDown className="w-4 h-4 ml-2" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-80 p-4 space-y-3">
                <div className="grid grid-cols-1 gap-3">
                  <Select value={filterType} onValueChange={setFilterType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ppm">PPM</SelectItem>
                      <SelectItem value="breakdown">Breakdown</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Select value={filterScheduleType} onValueChange={setFilterScheduleType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Schedule Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Select value={filterGroup} onValueChange={setFilterGroup}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Group" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cleaning">Cleaning</SelectItem>
                      <SelectItem value="washroom">Washroom</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Select value={filterSubGroup} onValueChange={setFilterSubGroup}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Sub Group" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ladies">Ladies</SelectItem>
                      <SelectItem value="lobby">Lobby</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex gap-2 pt-2">
                  <Button 
                    onClick={handleBasicFilter}
                    style={{ backgroundColor: '#C72030' }}
                    className="text-white flex-1"
                  >
                    Apply
                  </Button>
                  <Button 
                    onClick={() => {
                      setFilterType('');
                      setFilterScheduleType('');
                      setFilterGroup('');
                      setFilterSubGroup('');
                      setFilteredTasks(taskData);
                    }}
                    variant="outline"
                    className="flex-1"
                  >
                    Reset
                  </Button>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button 
              variant="outline" 
              className="border-[#C72030] text-[#C72030]"
              onClick={() => setShowAdvancedFilter(true)}
            >
              <Filter className="w-4 h-4 mr-2" />
              Advanced Filter
            </Button>
          </div>

          {/* Filter and Search */}
          <div className="flex items-center gap-3 mb-6">
            <Input
              placeholder="Search with Task ID"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-48"
            />
            <Input
              placeholder="Search using checklist name or assigned to"
              value={searchChecklist}
              onChange={(e) => setSearchChecklist(e.target.value)}
              className="w-64"
            />
            <Button 
              style={{ backgroundColor: '#C72030' }} 
              className="text-white px-6"
              onClick={handleSearch}
            >
              GO
            </Button>
            <Button 
              variant="outline" 
              className="border-[#C72030] text-[#C72030] ml-auto"
              onClick={handleExport}
            >
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>

          {/* Task Table */}
          <div className="bg-white rounded-lg border overflow-x-auto">
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
                {filteredTasks.map((task) => (
                  <TableRow key={task.id}>
                    <TableCell>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleViewTask(task.id)}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                    </TableCell>
                    <TableCell className="font-medium">{task.id}</TableCell>
                    <TableCell>{task.checklist}</TableCell>
                    <TableCell>
                      <Badge className="bg-blue-100 text-blue-700">
                        {task.type}
                      </Badge>
                    </TableCell>
                    <TableCell>{task.schedule}</TableCell>
                    <TableCell>{task.assignTo}</TableCell>
                    <TableCell>
                      <Badge className={getStatusBadgeColor(task.status)}>
                        {task.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{task.scheduleFor}</TableCell>
                    <TableCell>{task.assetsServices}</TableCell>
                    <TableCell>{task.site}</TableCell>
                    <TableCell className="max-w-xs truncate">{task.location}</TableCell>
                    <TableCell>{task.supplier}</TableCell>
                    <TableCell>{task.graceTime}</TableCell>
                    <TableCell>{task.duration}</TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </>
      ) : (
        /* Calendar View */
        <div className="space-y-6">
          {/* Calendar Controls */}
          <div className="flex items-center gap-3 mb-6">
            <Input
              type="text"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-32"
            />
            <Input
              type="text"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-32"
            />
            <Input
              placeholder="Select Some Options"
              className="w-48"
            />
            <Input
              placeholder="Select Schedule Type"
              className="w-48"
            />
            <Button style={{ backgroundColor: '#C72030' }} className="text-white">
              Apply
            </Button>
            <Button style={{ backgroundColor: '#FFA500' }} className="text-white">
              Reset
            </Button>
            <Button variant="outline" className="border-[#C72030] text-[#C72030]">
              Export
            </Button>
          </div>

          {/* Calendar Navigation */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">&lt;</Button>
              <Button variant="outline" size="sm">&gt;</Button>
              <Button variant="outline" size="sm">Today</Button>
            </div>
            <h2 className="text-xl font-semibold">June 2025</h2>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">month</Button>
              <Button variant="outline" size="sm">week</Button>
              <Button variant="outline" size="sm">day</Button>
              <Button variant="outline" size="sm">list</Button>
            </div>
          </div>

          {/* Legend */}
          <div className="flex items-center gap-4 mb-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-yellow-400 rounded"></div>
              <span>Scheduled</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded"></div>
              <span>Open</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-orange-500 rounded"></div>
              <span>In Progress</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded"></div>
              <span>Closed</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-600 rounded"></div>
              <span>Overdue</span>
            </div>
          </div>

          {/* Calendar Grid */}
          <Card>
            <CardContent className="p-6">
              <Calendar
                mode="single"
                selected={calendarDate}
                onSelect={setCalendarDate}
                className="w-full"
              />
              
              {/* Sample calendar entries */}
              <div className="mt-6 space-y-2">
                <div className="text-xs text-gray-600 grid grid-cols-7 gap-1">
                  <div>Sun</div>
                  <div>Mon</div>
                  <div>Tue</div>
                  <div>Wed</div>
                  <div>Thu</div>
                  <div>Fri</div>
                  <div>Sat</div>
                </div>
                
                {/* Calendar entries for demonstration */}
                <div className="grid grid-cols-7 gap-1 text-xs">
                  {Array.from({ length: 30 }, (_, i) => (
                    <div key={i} className="min-h-[100px] border border-gray-200 p-1">
                      <div className="font-semibold">{i + 1}</div>
                      {i % 3 === 0 && (
                        <div className="space-y-1">
                          <div className="bg-red-500 text-white p-1 rounded text-xs">PPM - Diesel Generator</div>
                          <div className="bg-red-500 text-white p-1 rounded text-xs">PPM - Test Ladies washroom</div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
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
