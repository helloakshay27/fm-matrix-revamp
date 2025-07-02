
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
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

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
  const [startDate, setStartDate] = useState<Date>(new Date(2025, 5, 1)); // June 1, 2025
  const [endDate, setEndDate] = useState<Date>(new Date(2025, 5, 30)); // June 30, 2025
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
    <div className="p-4 sm:p-6">
      {/* Header */}
      <div className="mb-4 sm:mb-6">
        <p className="text-[#1a1a1a] opacity-70 mb-2 text-sm sm:text-base">Scheduled Task &gt; Scheduled Task List</p>
        <h1 className="text-xl sm:text-2xl font-bold text-[#1a1a1a]">SCHEDULED TASK</h1>
      </div>

      {/* View Tabs */}
      <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 mb-4 sm:mb-6">
        <Button
          variant={view === 'List' ? 'default' : 'outline'}
          onClick={() => setView('List')}
          style={view === 'List' ? { backgroundColor: '#C72030' } : {}}
          className={cn(
            view === 'List' ? 'text-white' : 'border-[#C72030] text-[#C72030]',
            'text-sm sm:text-base py-2 sm:py-2 px-4 sm:px-6'
          )}
        >
          List
        </Button>
        <Button
          variant={view === 'Calendar' ? 'default' : 'outline'}
          onClick={() => setView('Calendar')}
          style={view === 'Calendar' ? { backgroundColor: '#C72030' } : {}}
          className={cn(
            view === 'Calendar' ? 'text-white' : 'border-[#C72030] text-[#C72030]',
            'text-sm sm:text-base py-2 sm:py-2 px-4 sm:px-6'
          )}
        >
          Calendar
        </Button>
      </div>

      {view === 'List' ? (
        <>
          {/* Date Range with Calendar Dropdown */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-4 sm:mb-6">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full sm:w-[200px] justify-start text-left font-normal text-sm sm:text-base",
                    !startDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {startDate ? format(startDate, "dd/MM/yyyy") : <span>Pick start date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={startDate}
                  onSelect={(date) => date && setStartDate(date)}
                  initialFocus
                  className="pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
            
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full sm:w-[200px] justify-start text-left font-normal text-sm sm:text-base",
                    !endDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {endDate ? format(endDate, "dd/MM/yyyy") : <span>Pick end date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={endDate}
                  onSelect={(date) => date && setEndDate(date)}
                  initialFocus
                  className="pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
            
            <Button style={{ backgroundColor: '#00A651' }} className="text-white w-full sm:w-auto">
              Apply
            </Button>
            <Button style={{ backgroundColor: '#FFA500' }} className="text-white w-full sm:w-auto" onClick={handleReset}>
              Reset
            </Button>
          </div>

          {/* Status Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 mb-4 sm:mb-6">
            {Object.entries(statusCounts).map(([status, count]) => (
              <div
                key={status}
                className="bg-[#F2F0EB] text-[#D92818] p-3 sm:p-4 rounded-lg text-center shadow-[0px_2px_18px_rgba(45,45,45,0.1)] h-[100px] sm:h-[132px] flex flex-col items-center justify-center"
              >
                <div className="text-lg sm:text-2xl font-bold">{count}</div>
                <div className="text-xs sm:text-sm">{status}</div>
              </div>
            ))}
          </div>

          {/* Filter Row */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="border-[#C72030] text-[#C72030] w-full sm:w-auto">
                  <Filter className="w-4 h-4 mr-2" />
                  Filter
                  <ChevronDown className="w-4 h-4 ml-2" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-full sm:w-80 p-4 space-y-3">
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
                
                <div className="flex flex-col sm:flex-row gap-2 pt-2">
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
              className="border-[#C72030] text-[#C72030] w-full sm:w-auto"
              onClick={() => setShowAdvancedFilter(true)}
            >
              <Filter className="w-4 h-4 mr-2" />
              Advanced Filter
            </Button>
          </div>

          {/* Filter and Search */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-4 sm:mb-6">
            <Input
              placeholder="Search with Task ID"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full sm:w-48 text-sm sm:text-base"
            />
            <Input
              placeholder="Search using checklist name or assigned to"
              value={searchChecklist}
              onChange={(e) => setSearchChecklist(e.target.value)}
              className="w-full sm:w-64 text-sm sm:text-base"
            />
            <Button 
              style={{ backgroundColor: '#F2F0E9', color: '#BF213E' }}
              className="hover:opacity-90 px-4 w-full sm:w-auto"
              onClick={handleSearch}
            >
              GO
            </Button>
            <Button 
              variant="outline" 
              className="border-[#C72030] text-[#C72030] w-full sm:w-auto sm:ml-auto"
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
                  <TableHead className="text-xs sm:text-sm">Action</TableHead>
                  <TableHead className="text-xs sm:text-sm">ID</TableHead>
                  <TableHead className="text-xs sm:text-sm">Checklist</TableHead>
                  <TableHead className="text-xs sm:text-sm">Type</TableHead>
                  <TableHead className="text-xs sm:text-sm">Schedule</TableHead>
                  <TableHead className="text-xs sm:text-sm">Assign to</TableHead>
                  <TableHead className="text-xs sm:text-sm">Status</TableHead>
                  <TableHead className="hidden sm:table-cell text-xs sm:text-sm">Schedule For</TableHead>
                  <TableHead className="hidden md:table-cell text-xs sm:text-sm">Assets/Services</TableHead>
                  <TableHead className="hidden md:table-cell text-xs sm:text-sm">Site</TableHead>
                  <TableHead className="hidden lg:table-cell text-xs sm:text-sm">Location</TableHead>
                  <TableHead className="hidden lg:table-cell text-xs sm:text-sm">Supplier</TableHead>
                  <TableHead className="hidden lg:table-cell text-xs sm:text-sm">Grace Time</TableHead>
                  <TableHead className="hidden lg:table-cell text-xs sm:text-sm">Duration</TableHead>
                  <TableHead className="hidden lg:table-cell text-xs sm:text-sm">%</TableHead>
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
                    <TableCell className="font-medium text-xs sm:text-sm">{task.id}</TableCell>
                    <TableCell className="text-xs sm:text-sm">{task.checklist}</TableCell>
                    <TableCell>
                      <Badge className="bg-blue-100 text-blue-700 text-xs sm:text-sm">
                        {task.type}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-xs sm:text-sm">{task.schedule}</TableCell>
                    <TableCell className="text-xs sm:text-sm">{task.assignTo}</TableCell>
                    <TableCell>
                      <Badge className={cn(getStatusBadgeColor(task.status), "text-xs sm:text-sm")}>
                        {task.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell text-xs sm:text-sm">{task.scheduleFor}</TableCell>
                    <TableCell className="hidden md:table-cell text-xs sm:text-sm">{task.assetsServices}</TableCell>
                    <TableCell className="hidden md:table-cell text-xs sm:text-sm">{task.site}</TableCell>
                    <TableCell className="hidden lg:table-cell text-xs sm:text-sm max-w-xs truncate">{task.location}</TableCell>
                    <TableCell className="hidden lg:table-cell text-xs sm:text-sm">{task.supplier}</TableCell>
                    <TableCell className="hidden lg:table-cell text-xs sm:text-sm">{task.graceTime}</TableCell>
                    <TableCell className="hidden lg:table-cell text-xs sm:text-sm">{task.duration}</TableCell>
                    <TableCell className="hidden lg:table-cell text-xs sm:text-sm"></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </>
      ) : (
        /* Calendar View */
        <div className="space-y-4 sm:space-y-6">
          {/* Calendar Controls */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-4 sm:mb-6">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full sm:w-[200px] justify-start text-left font-normal text-sm sm:text-base",
                    !startDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {startDate ? format(startDate, "dd/MM/yyyy") : <span>Pick start date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={startDate}
                  onSelect={(date) => date && setStartDate(date)}
                  initialFocus
                  className="pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
            
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full sm:w-[200px] justify-start text-left font-normal text-sm sm:text-base",
                    !endDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {endDate ? format(endDate, "dd/MM/yyyy") : <span>Pick end date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={endDate}
                  onSelect={(date) => date && setEndDate(date)}
                  initialFocus
                  className="pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
            
            <Input
              placeholder="Select Some Options"
              className="w-full sm:w-48 text-sm sm:text-base"
            />
            <Input
              placeholder="Select Schedule Type"
              className="w-full sm:w-48 text-sm sm:text-base"
            />
            <Button style={{ backgroundColor: '#C72030' }} className="text-white w-full sm:w-auto">
              Apply
            </Button>
            <Button style={{ backgroundColor: '#FFA500' }} className="text-white w-full sm:w-auto">
              Reset
            </Button>
            <Button variant="outline" className="border-[#C72030] text-[#C72030] w-full sm:w-auto">
              Export
            </Button>
          </div>

          {/* Calendar Navigation */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center sm:justify-between mb-4 gap-3">
            <div className="flex items-center gap-2 flex-wrap">
              <Button variant="outline" size="sm" className="text-xs sm:text-sm">&lt;</Button>
              <Button variant="outline" size="sm" className="text-xs sm:text-sm">&gt;</Button>
              <Button variant="outline" size="sm" className="text-xs sm:text-sm">Today</Button>
            </div>
            <h2 className="text-lg sm:text-xl font-semibold">June 2025</h2>
            <div className="flex items-center gap-2 flex-wrap">
              <Button variant="outline" size="sm" className="text-xs sm:text-sm">month</Button>
              <Button variant="outline" size="sm" className="text-xs sm:text-sm">week</Button>
              <Button variant="outline" size="sm" className="text-xs sm:text-sm">day</Button>
              <Button variant="outline" size="sm" className="text-xs sm:text-sm">list</Button>
            </div>
          </div>

          {/* Legend */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-4 mb-4 text-xs sm:text-sm">
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
            <CardContent className="p-4 sm:p-6">
              <Calendar
                mode="single"
                selected={calendarDate}
                onSelect={setCalendarDate}
                className="w-full"
              />
              
              {/* Sample calendar entries */}
              <div className="mt-4 sm:mt-6 space-y-2">
                <div className="text-xs text-gray-600 grid grid-cols-7 gap-1">
                  <div>Sun</div>
                  <div>Mon</div>
                  <div>Tue</div>
                  <div>Wed</div>
                  <div>Thu</div>
                  <div>Fri</div>
                  <div>Sat</div>
                </div>
                
                <div className="grid grid-cols-7 gap-1 text-xs">
                  {Array.from({ length: 30 }, (_, i) => (
                    <div key={i} className="min-h-[80px] sm:min-h-[100px] border border-gray-200 p-1">
                      <div className="font-semibold">{i + 1}</div>
                      {i % 3 === 0 && (
                        <div className="space-y-1">
                          <div className="bg-red-500 text-white p-1 rounded text-[10px] sm:text-xs truncate">PPM - Diesel Generator</div>
                          <div className="bg-red-500 text-white p-1 rounded text-[10px] sm:text-xs truncate">PPM - Test Ladies washroom</div>
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
