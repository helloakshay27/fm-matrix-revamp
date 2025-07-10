
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Lock, MessageSquareHeart, AlertTriangle, FileText, Grid3X3, RotateCcw, Search, Eye, ChevronDown } from 'lucide-react';

export const TicketTab = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const statusCards = [
    { count: 8, label: 'Open', icon: Lock, bgColor: '#FF6B5A', textColor: 'white' },
    { count: 4, label: 'Closed', icon: Lock, bgColor: '#2DD4BF', textColor: 'white' },
    { count: 8, label: 'Complaints', icon: MessageSquareHeart, bgColor: '#E879A7', textColor: 'white' },
    { count: 2, label: 'Suggestion', icon: AlertTriangle, bgColor: '#FFA726', textColor: 'white' },
    { count: 12, label: 'Requests', icon: FileText, bgColor: '#7C3AED', textColor: 'white' }
  ];

  const ticketData = [
    {
      id: '#1123',
      title: 'Test Title',
      description: 'Not Working',
      priority: 'High',
      createdBy: 'Amit J',
      assignee: 'Rakesh K.',
      status: 'Open',
      attachments: 2
    },
    {
      id: '#1123',
      title: 'Test Title',
      description: 'Not Working',
      priority: 'High',
      createdBy: 'Amit J',
      assignee: 'Rakesh K.',
      status: 'Open',
      attachments: 2
    },
    {
      id: '#1123',
      title: 'Test Title',
      description: 'Not Working',
      priority: 'High',
      createdBy: 'Amit J',
      assignee: 'Rakesh K.',
      status: 'Open',
      attachments: 2
    },
    {
      id: '#1123',
      title: 'Test Title',
      description: 'Not Working',
      priority: 'High',
      createdBy: 'Amit J',
      assignee: 'Rakesh K.',
      status: 'Closed',
      attachments: 2
    },
    {
      id: '#1123',
      title: 'Test Title',
      description: 'Not Working',
      priority: 'High',
      createdBy: 'Amit J',
      assignee: 'Rakesh K.',
      status: 'Closed',
      attachments: 2
    }
  ];

  return (
    <div className="space-y-6">
      {/* Status Cards */}
      <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {statusCards.map((card, index) => {
          const IconComponent = card.icon;
          return (
            <div 
              key={index} 
              className="p-4 rounded-lg flex items-center gap-3"
              style={{ backgroundColor: card.bgColor }}
            >
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <IconComponent className="w-5 h-5" style={{ color: card.textColor }} />
              </div>
              <div>
                <div className="text-2xl font-bold" style={{ color: card.textColor }}>
                  {card.count.toString().padStart(2, '0')}
                </div>
                <div className="text-sm font-medium" style={{ color: card.textColor }}>
                  {card.label}
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
              <SelectItem value="All">All</SelectItem>
              <SelectItem value="Open">Open</SelectItem>
              <SelectItem value="Closed">Closed</SelectItem>
              <SelectItem value="Complaints">Complaints</SelectItem>
              <SelectItem value="Suggestion">Suggestion</SelectItem>
              <SelectItem value="Requests">Requests</SelectItem>
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
            <ChevronDown className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Ticket Table */}
      <div className="bg-white rounded-lg border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Created By</TableHead>
              <TableHead>Assignee</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Attachments</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {ticketData.map((item, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium">{item.id}</TableCell>
                <TableCell>{item.title}</TableCell>
                <TableCell>{item.description}</TableCell>
                <TableCell>{item.priority}</TableCell>
                <TableCell>{item.createdBy}</TableCell>
                <TableCell>{item.assignee}</TableCell>
                <TableCell>
                  <div className={`px-3 py-1 rounded text-sm font-medium inline-flex items-center gap-1 ${
                    item.status === 'Open' 
                      ? 'bg-[#FF6B5A] text-white' 
                      : 'bg-[#2DD4BF] text-white'
                  }`}>
                    {item.status}
                    <ChevronDown className="w-3 h-3" />
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{item.attachments}</span>
                    <Eye className="w-4 h-4 text-gray-500" />
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
