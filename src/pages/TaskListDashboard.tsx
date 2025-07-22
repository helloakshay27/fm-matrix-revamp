
import React, { useState } from 'react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Eye, Filter, Upload, Users, Calendar } from 'lucide-react';

const statusCards = [
  { title: 'Scheduled', count: 1356, color: 'bg-[#8B4513]', icon: Calendar },
  { title: 'Open', count: 176, color: 'bg-green-600', icon: Users },
  { title: 'In Progress', count: 1, color: 'bg-orange-500', icon: Users },
  { title: 'Closed', count: 2, color: 'bg-orange-400', icon: Users },
  { title: 'Overdue', count: 1033, color: 'bg-red-600', icon: Users }
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
    graceTime: '3Hour'
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
    graceTime: '3Hour'
  }
];

export const TaskListDashboard = () => {
  const [dateFrom, setDateFrom] = useState('01/06/2025');
  const [dateTo, setDateTo] = useState('30/06/2025');

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#1a1a1a]">SCHEDULED TASK</h1>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 mb-6">
        <Button variant="outline" className="border-b-2 border-red-500 text-red-500 bg-white">
          List
        </Button>
        <Button variant="ghost" className="text-gray-600">
          Calendar
        </Button>
      </div>

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
          <Card key={index} className={`${card.color} text-white`}>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <card.icon className="w-5 h-5" />
              </div>
              <div>
                <div className="text-2xl font-bold">{card.count}</div>
                <div className="text-sm opacity-90">{card.title}</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Search and Actions */}
      <div className="flex gap-3 mb-6">
        <Button variant="outline" className="border-[#8B4513] text-[#8B4513]">
          <Filter className="w-4 h-4 mr-2" />
          Filters
        </Button>
        <Input placeholder="Search with Task ID" className="max-w-xs" />
        <Input placeholder="Search using checklist name or assigned to" className="max-w-xs" />
        <Button className="bg-[#8B4513] hover:bg-[#7A3F12] text-white">Go</Button>
        <Button className="bg-[#8B4513] hover:bg-[#7A3F12] text-white">
          <Upload className="w-4 h-4 mr-2" />
          Export
        </Button>
      </div>

      {/* Table */}
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
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
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockTaskData.map((task) => (
              <TableRow key={task.id}>
                <TableCell>
                  <Eye className="w-4 h-4 text-gray-600 cursor-pointer" />
                </TableCell>
                <TableCell>{task.id}</TableCell>
                <TableCell>{task.checklist}</TableCell>
                <TableCell>{task.type}</TableCell>
                <TableCell>{task.schedule}</TableCell>
                <TableCell>{task.assignTo}</TableCell>
                <TableCell>
                  <Badge className="bg-green-100 text-green-800">{task.status}</Badge>
                </TableCell>
                <TableCell>{task.scheduleFor}</TableCell>
                <TableCell>{task.assetsServices}</TableCell>
                <TableCell>{task.site}</TableCell>
                <TableCell className="max-w-xs truncate">{task.location}</TableCell>
                <TableCell>{task.supplier}</TableCell>
                <TableCell>{task.graceTime}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
