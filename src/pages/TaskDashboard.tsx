
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Filter, Download, Search, Eye } from 'lucide-react';

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
    site: 'Loccated',
    location: 'Building : Ideal Landmark / Wing : A / Floor : NA / Area : NA / Room : NA',
    supplier: '',
    graceTime: '3Hour',
    duration: ''
  },
  // Add more sample data as needed
];

const statsData = [
  { label: 'Scheduled', count: 1107, color: 'bg-purple-500' },
  { label: 'Open', count: 171, color: 'bg-green-500' },
  { label: 'In Progress', count: 15, color: 'bg-orange-500' },
  { label: 'Closed', count: 1105, color: 'bg-orange-600' },
  { label: 'Overdue', count: 1287, color: 'bg-red-500' }
];

export const TaskDashboard = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredTasks, setFilteredTasks] = useState(taskData);

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
        <p className="text-[#1a1a1a] opacity-70 mb-2">Scheduled Task &gt; Scheduled task List</p>
        <h1 className="text-2xl font-bold text-[#1a1a1a]">SCHEDULED TASK</h1>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="list" className="mb-6">
        <TabsList>
          <TabsTrigger value="list" className="text-[#C72030] data-[state=active]:bg-[#C72030] data-[state=active]:text-white">List</TabsTrigger>
          <TabsTrigger value="calendar" className="text-[#C72030] data-[state=active]:bg-[#C72030] data-[state=active]:text-white">Calendar</TabsTrigger>
        </TabsList>
        
        <TabsContent value="list">
          {/* Date Range Filters */}
          <div className="flex items-center gap-3 mb-6">
            <Input type="date" defaultValue="2025-06-01" className="w-48" />
            <Input type="date" defaultValue="2025-06-30" className="w-48" />
            <Button style={{ backgroundColor: '#C72030' }} className="text-white">Apply</Button>
            <Button variant="outline" className="border-[#C72030] text-[#C72030]">Reset</Button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-5 gap-4 mb-6">
            {statsData.map((stat, index) => (
              <div key={index} className={`${stat.color} text-white p-4 rounded-lg`}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                    <span className="text-lg font-bold">{stat.count}</span>
                  </div>
                  <span className="font-medium text-sm">{stat.label}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 mb-6">
            <Button variant="outline" className="border-[#C72030] text-[#C72030]">
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </Button>
            <Input 
              placeholder="Search with Task ID" 
              className="w-48"
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
            />
            <Input placeholder="Search using checklist name or assigned to" className="w-64" />
            <Button style={{ backgroundColor: '#C72030' }} className="text-white">GO</Button>
            <Button style={{ backgroundColor: '#C72030' }} className="text-white">
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
                      <Button variant="ghost" size="sm">
                        <Eye className="w-4 h-4" />
                      </Button>
                    </TableCell>
                    <TableCell className="font-medium">{task.id}</TableCell>
                    <TableCell>{task.checklist}</TableCell>
                    <TableCell>{task.type}</TableCell>
                    <TableCell>{task.schedule}</TableCell>
                    <TableCell>{task.assignTo}</TableCell>
                    <TableCell>
                      <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs">
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
        </TabsContent>
        
        <TabsContent value="calendar">
          <div className="text-center py-12">
            <p className="text-gray-500">Calendar view coming soon...</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
