
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Filter, Download, ChevronRight } from 'lucide-react';

const scheduledTaskData = [
  {
    id: '17589929',
    checklist: 'Test Ladies washroom Checklists',
    type: 'PPM',
    schedule: '12/07/2025, 11:00PM',
    assignTo: 'Vinayak Mane',
    status: 'Open',
    scheduleFor: 'Service',
    assetsServices: 'Test Ladies washroom Service',
    site: 'Leckated',
    location: 'Building ->Ideal Landmark / Wing ->A / Floor ->NA / Area ->NA / Room ->NA',
    supplier: '',
    graceTime: '3Hour',
    duration: '',
    percentage: ''
  },
  {
    id: '17589928', 
    checklist: 'Test Ladies washroom Checklists',
    type: 'PPM',
    schedule: '12/07/2025, 10:00PM',
    assignTo: 'Vinayak Mane',
    status: 'Open',
    scheduleFor: 'Service',
    assetsServices: 'Test Ladies washroom Service',
    site: 'Leckated',
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
    site: 'Leckated',
    location: 'Building ->Jyoti Tower / Wing ->NA / Floor ->2nd Floor / Area ->NA / Room ->Main Cabin',
    supplier: '',
    graceTime: '30ay',
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
    site: 'Leckated',
    location: 'Building ->Jyoti Tower / Wing ->NA / Floor ->2nd Floor / Area ->NA / Room ->Main Cabin',
    supplier: '',
    graceTime: '30ay',
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
    site: 'Leckated',
    location: 'Building ->Jyoti Tower / Wing ->NA / Floor ->2nd Floor / Area ->NA / Room ->Dinning Area',
    supplier: '',
    graceTime: '30Minutes',
    duration: '',
    percentage: ''
  },
  {
    id: '17589927',
    checklist: 'Test Ladies washroom Checklists',
    type: 'PPM',
    schedule: '12/07/2025, 09:00PM',
    assignTo: 'Vinayak Mane',
    status: 'Open',
    scheduleFor: 'Service',
    assetsServices: 'Test Ladies washroom Service',
    site: 'Leckated',
    location: 'Building ->Ideal Landmark / Wing ->A / Floor ->NA / Area ->NA / Room ->NA',
    supplier: '',
    graceTime: '3Hour',
    duration: '',
    percentage: ''
  },
  {
    id: '14481923',
    checklist: 'LIFT LOBBY CLEANING',
    type: 'PPM',
    schedule: '12/07/2025, 08:00PM',
    assignTo: '',
    status: 'Open',
    scheduleFor: 'Service',
    assetsServices: 'Daily Cleaning_Cabin',
    site: 'Leckated',
    location: 'Building ->Jyoti Tower / Wing ->NA / Floor ->2nd Floor / Area ->NA / Room ->Main Cabin',
    supplier: '',
    graceTime: '30ay',
    duration: '',
    percentage: ''
  },
  {
    id: '14488608',
    checklist: 'LIFT LOBBY CLEANING',
    type: 'PPM',
    schedule: '12/07/2025, 08:00PM',
    assignTo: '',
    status: 'Open',
    scheduleFor: 'Service',
    assetsServices: 'Daily Cleaning_Cabin',
    site: 'Leckated',
    location: 'Building ->Jyoti Tower / Wing ->NA / Floor ->2nd Floor / Area ->NA / Room ->Main Cabin',
    supplier: '',
    graceTime: '30ay',
    duration: '',
    percentage: ''
  },
  {
    id: '14503908',
    checklist: 'platform cleaning',
    type: 'PPM',
    schedule: '12/07/2025, 08:00PM',
    assignTo: '',
    status: 'Open',
    scheduleFor: 'Service',
    assetsServices: 'Daily Cleaning_Dining Area',
    site: 'Leckated',
    location: 'Building ->Jyoti Tower / Wing ->NA / Floor ->2nd Floor / Area ->NA / Room ->Dinning Area',
    supplier: '',
    graceTime: '30Minutes',
    duration: '',
    percentage: ''
  },
  {
    id: '17589926',
    checklist: 'Test Ladies washroom Checklists',
    type: 'PPM',
    schedule: '12/07/2025, 08:00PM',
    assignTo: 'Vinayak Mane',
    status: 'Open',
    scheduleFor: 'Service',
    assetsServices: 'Test Ladies washroom Service',
    site: 'Leckated',
    location: 'Building ->Ideal Landmark / Wing ->A / Floor ->NA / Area ->NA / Room ->NA',
    supplier: '',
    graceTime: '3Hour',
    duration: '',
    percentage: ''
  }
];

export const ScheduledTaskDashboard = () => {
  const [activeTab, setActiveTab] = useState('List');
  const [fromDate, setFromDate] = useState('01/07/2025');
  const [toDate, setToDate] = useState('31/07/2025');
  const [searchTaskId, setSearchTaskId] = useState('');
  const [searchChecklist, setSearchChecklist] = useState('');

  const scheduledCount = 1885;
  const openCount = 174;
  const inProgressCount = 0;
  const closedCount = 0;
  const overdueCount = 267;

  return (
    <div className="p-4 sm:p-6">
      {/* Breadcrumb */}
      <div className="mb-2 text-sm text-gray-600 flex items-center">
        <span>Scheduled Task</span>
        <ChevronRight className="w-4 h-4 mx-1" />
        <span>Scheduled Task List</span>
      </div>

      {/* Title */}
      <h1 className="text-xl sm:text-2xl font-bold text-[#1a1a1a] uppercase mb-6">
        SCHEDULED TASK
      </h1>

      {/* Tabs */}
      <div className="flex border-b mb-6">
        <button
          onClick={() => setActiveTab('List')}
          className={`px-4 py-2 font-medium ${
            activeTab === 'List'
              ? 'text-[#C72030] border-b-2 border-[#C72030]'
              : 'text-gray-600'
          }`}
        >
          List
        </button>
        <button
          onClick={() => setActiveTab('Calendar')}
          className={`px-4 py-2 font-medium ${
            activeTab === 'Calendar'
              ? 'text-[#C72030] border-b-2 border-[#C72030]'
              : 'text-gray-600'
          }`}
        >
          Calendar
        </button>
      </div>

      {/* Date Range and Buttons */}
      <div className="flex flex-wrap gap-4 items-center mb-6">
        <div className="flex gap-2 items-center">
          <Input
            type="text"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            className="w-32"
          />
          <Input
            type="text"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            className="w-32"
          />
          <Button className="bg-green-600 hover:bg-green-700 text-white">
            Apply
          </Button>
          <Button variant="outline" className="border-gray-300">
            Reset
          </Button>
        </div>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
        <div className="bg-red-500 text-white p-4 rounded-lg flex items-center">
          <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center mr-3">
            <span className="text-2xl font-bold">{scheduledCount}</span>
          </div>
          <div>
            <div className="text-2xl font-bold">{scheduledCount}</div>
            <div className="text-sm opacity-90">Scheduled</div>
          </div>
        </div>

        <div className="bg-green-500 text-white p-4 rounded-lg flex items-center">
          <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center mr-3">
            <span className="text-2xl font-bold">{openCount}</span>
          </div>
          <div>
            <div className="text-2xl font-bold">{openCount}</div>
            <div className="text-sm opacity-90">Open</div>
          </div>
        </div>

        <div className="bg-orange-500 text-white p-4 rounded-lg flex items-center">
          <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center mr-3">
            <span className="text-2xl font-bold">{inProgressCount}</span>
          </div>
          <div>
            <div className="text-2xl font-bold">{inProgressCount}</div>
            <div className="text-sm opacity-90">In Progress</div>
          </div>
        </div>

        <div className="bg-gray-500 text-white p-4 rounded-lg flex items-center">
          <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center mr-3">
            <span className="text-2xl font-bold">{closedCount}</span>
          </div>
          <div>
            <div className="text-2xl font-bold">{closedCount}</div>
            <div className="text-sm opacity-90">Closed</div>
          </div>
        </div>

        <div className="bg-red-600 text-white p-4 rounded-lg flex items-center">
          <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center mr-3">
            <span className="text-2xl font-bold">{overdueCount}</span>
          </div>
          <div>
            <div className="text-2xl font-bold">{overdueCount}</div>
            <div className="text-sm opacity-90">Overdue</div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-wrap gap-3 items-center mb-6">
        <Button variant="outline" className="border-[#C72030] text-[#C72030]">
          <Filter className="w-4 h-4 mr-2" />
          Filters
        </Button>
        
        <Input
          placeholder="Search with Task ID"
          value={searchTaskId}
          onChange={(e) => setSearchTaskId(e.target.value)}
          className="w-48"
        />
        
        <Input
          placeholder="Search using checklist name or assigned to"
          value={searchChecklist}
          onChange={(e) => setSearchChecklist(e.target.value)}
          className="w-64"
        />
        
        <Button className="bg-purple-600 hover:bg-purple-700 text-white">
          Go
        </Button>
        
        <Button variant="outline" className="border-[#C72030] text-[#C72030]">
          <Download className="w-4 h-4 mr-2" />
          Export
        </Button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <Table className="min-w-[1400px]">
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="font-semibold">Action</TableHead>
              <TableHead className="font-semibold">ID</TableHead>
              <TableHead className="font-semibold">Checklist</TableHead>
              <TableHead className="font-semibold">Type</TableHead>
              <TableHead className="font-semibold">Schedule</TableHead>
              <TableHead className="font-semibold">Assign to</TableHead>
              <TableHead className="font-semibold">Status</TableHead>
              <TableHead className="font-semibold">Schedule For</TableHead>
              <TableHead className="font-semibold">Assets/Services</TableHead>
              <TableHead className="font-semibold">Site</TableHead>
              <TableHead className="font-semibold">Location</TableHead>
              <TableHead className="font-semibold">Supplier</TableHead>
              <TableHead className="font-semibold">Grace Time</TableHead>
              <TableHead className="font-semibold">Duration</TableHead>
              <TableHead className="font-semibold">%</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {scheduledTaskData.map((task) => (
              <TableRow key={task.id}>
                <TableCell>
                  <Button size="sm" variant="ghost" className="p-1">
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </TableCell>
                <TableCell className="font-medium">{task.id}</TableCell>
                <TableCell className="max-w-[200px] truncate">{task.checklist}</TableCell>
                <TableCell>{task.type}</TableCell>
                <TableCell>{task.schedule}</TableCell>
                <TableCell>{task.assignTo}</TableCell>
                <TableCell>
                  <span className="px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-700">
                    {task.status}
                  </span>
                </TableCell>
                <TableCell>{task.scheduleFor}</TableCell>
                <TableCell className="max-w-[150px] truncate">{task.assetsServices}</TableCell>
                <TableCell>{task.site}</TableCell>
                <TableCell className="max-w-[300px] truncate">{task.location}</TableCell>
                <TableCell>{task.supplier}</TableCell>
                <TableCell>{task.graceTime}</TableCell>
                <TableCell>{task.duration}</TableCell>
                <TableCell>{task.percentage}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
