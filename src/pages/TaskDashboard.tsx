
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Filter, Search, Eye, Download } from 'lucide-react';

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
    id: '14481305',
    checklist: 'LIFT LOBBY CLEANING',
    type: 'PPM',
    schedule: '17/06/2025, 09:00PM',
    assignTo: '',
    status: 'Open',
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
    status: 'Open',
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

export const TaskDashboard = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredTasks, setFilteredTasks] = useState(taskData);
  const [startDate, setStartDate] = useState('01/06/2025');
  const [endDate, setEndDate] = useState('30/06/2025');
  const [view, setView] = useState('List');

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    if (value) {
      const filtered = taskData.filter(task =>
        task.id.toLowerCase().includes(value.toLowerCase()) ||
        task.checklist.toLowerCase().includes(value.toLowerCase()) ||
        task.assignTo.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredTasks(filtered);
    } else {
      setFilteredTasks(taskData);
    }
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
          className={view === 'List' ? 'text-white' : 'border-[#C72030] text-[#C72030]'}
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
        <Button style={{ backgroundColor: '#FFA500' }} className="text-white">
          Reset
        </Button>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-5 gap-4 mb-6">
        <div className="bg-purple-600 text-white p-4 rounded-lg text-center">
          <div className="text-2xl font-bold">1107</div>
          <div className="text-sm">Scheduled</div>
        </div>
        <div className="bg-green-500 text-white p-4 rounded-lg text-center">
          <div className="text-2xl font-bold">171</div>
          <div className="text-sm">Open</div>
        </div>
        <div className="bg-orange-500 text-white p-4 rounded-lg text-center">
          <div className="text-2xl font-bold">6</div>
          <div className="text-sm">In Progress</div>
        </div>
        <div className="bg-yellow-500 text-white p-4 rounded-lg text-center">
          <div className="text-2xl font-bold">6</div>
          <div className="text-sm">Closed</div>
        </div>
        <div className="bg-red-500 text-white p-4 rounded-lg text-center">
          <div className="text-2xl font-bold">1287</div>
          <div className="text-sm">Overdue</div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-3 mb-6">
        <Button variant="outline" className="border-[#C72030] text-[#C72030]">
          <Filter className="w-4 h-4 mr-2" />
          Filters
        </Button>
        <div className="flex items-center gap-3">
          <Input
            placeholder="Search with Task ID"
            className="w-48"
          />
          <Input
            placeholder="Search using checklist name or assigned to"
            className="w-64"
          />
          <Button style={{ backgroundColor: '#C72030' }} className="text-white px-6">
            GO
          </Button>
        </div>
        <Button variant="outline" className="border-[#C72030] text-[#C72030] ml-auto">
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
                  <Button variant="ghost" size="sm">
                    <Eye className="w-4 h-4" />
                  </Button>
                </TableCell>
                <TableCell className="font-medium">{task.id}</TableCell>
                <TableCell>{task.checklist}</TableCell>
                <TableCell>
                  <span className="px-2 py-1 rounded text-xs bg-blue-100 text-blue-700">
                    {task.type}
                  </span>
                </TableCell>
                <TableCell>{task.schedule}</TableCell>
                <TableCell>{task.assignTo}</TableCell>
                <TableCell>
                  <span className="px-2 py-1 rounded text-xs bg-green-100 text-green-700">
                    {task.status}
                  </span>
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
    </div>
  );
};
