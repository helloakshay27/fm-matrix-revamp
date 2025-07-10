
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, Lock, AlertTriangle, CheckCircle, Clock, Search, RotateCcw, Grid3X3, Download } from 'lucide-react';

export const PPMTab = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('Scheduled');

  const statusCards = [
    { count: 12, label: 'Scheduled', icon: Calendar },
    { count: 8, label: 'Open', icon: Lock },
    { count: 2, label: 'In Progress', icon: AlertTriangle },
    { count: 4, label: 'Closed', icon: CheckCircle },
    { count: 8, label: 'Overdue', icon: Clock }
  ];

  const ppmData = [
    {
      id: '11234',
      checklist: 'Daily Test Assets Reading',
      type: 'PPM',
      schedule: '02/07/2021, 11:00am',
      assignTo: 'Tech Team',
      graceTime: '45 min',
      duration: '01h : 20m : 35s',
      status: 'Scheduled',
      percentage: '0%'
    },
    {
      id: '11234',
      checklist: 'Daily Test Assets Reading',
      type: 'PPM',
      schedule: '02/07/2021, 11:00am',
      assignTo: 'Tech Team',
      graceTime: '45 min',
      duration: '01h : 20m : 35s',
      status: 'Scheduled',
      percentage: '0%'
    },
    {
      id: '11234',
      checklist: 'Daily Test Assets Reading',
      type: 'PPM',
      schedule: '02/07/2021, 11:00am',
      assignTo: 'Tech Team',
      graceTime: '45 min',
      duration: '01h : 20m : 35s',
      status: 'Scheduled',
      percentage: '0%'
    },
    {
      id: '11234',
      checklist: 'Daily Test Assets Reading',
      type: 'PPM',
      schedule: '02/07/2021, 11:00am',
      assignTo: 'Tech Team',
      graceTime: '45 min',
      duration: '01h : 20m : 35s',
      status: 'Scheduled',
      percentage: '0%'
    },
    {
      id: '11234',
      checklist: 'Daily Test Assets Reading',
      type: 'PPM',
      schedule: '02/07/2021, 11:00am',
      assignTo: 'Tech Team',
      graceTime: '45 min',
      duration: '01h : 20m : 35s',
      status: 'Scheduled',
      percentage: '0%'
    },
    {
      id: '11234',
      checklist: 'Daily Test Assets Reading',
      type: 'PPM',
      schedule: '02/07/2021, 11:00am',
      assignTo: 'Tech Team',
      graceTime: '45 min',
      duration: '01h : 20m : 35s',
      status: 'Scheduled',
      percentage: '0%'
    },
    {
      id: '11234',
      checklist: 'Daily Test Assets Reading',
      type: 'PPM',
      schedule: '02/07/2021, 11:00am',
      assignTo: 'Tech Team',
      graceTime: '45 min',
      duration: '01h : 20m : 35s',
      status: 'Scheduled',
      percentage: '0%'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Status Cards */}
      <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {statusCards.map((card, index) => {
          const IconComponent = card.icon;
          return (
            <div key={index} className="p-4 rounded-lg" style={{ backgroundColor: '#F6F4EE' }}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                  <IconComponent className="w-5 h-5" style={{ color: '#C72030' }} />
                </div>
                <div>
                  <div className="text-2xl font-bold text-black">{card.count.toString().padStart(2, '0')}</div>
                  <div className="text-sm font-medium text-black">{card.label}</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex items-center gap-4">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Scheduled">Scheduled</SelectItem>
              <SelectItem value="Open">Open</SelectItem>
              <SelectItem value="In Progress">In Progress</SelectItem>
              <SelectItem value="Closed">Closed</SelectItem>
              <SelectItem value="Overdue">Overdue</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-64 min-w-[200px]"
            />
          </div>
          <Button variant="outline" size="sm">
            <RotateCcw className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="sm">
            <Grid3X3 className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* PPM Table */}
      <div className="bg-white rounded-lg border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Checklist</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Schedule</TableHead>
              <TableHead>Assign To</TableHead>
              <TableHead>Grace Time</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>%</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {ppmData.map((item, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium">{item.id}</TableCell>
                <TableCell>{item.checklist}</TableCell>
                <TableCell>{item.type}</TableCell>
                <TableCell>{item.schedule}</TableCell>
                <TableCell>{item.assignTo}</TableCell>
                <TableCell>{item.graceTime}</TableCell>
                <TableCell>{item.duration}</TableCell>
                <TableCell>
                  <div className="bg-blue-500 text-white px-3 py-1 rounded text-sm font-medium inline-flex items-center gap-1">
                    {item.status}
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-4 h-4 text-white" />
                    </div>
                    <span className="font-medium">{item.percentage}</span>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
