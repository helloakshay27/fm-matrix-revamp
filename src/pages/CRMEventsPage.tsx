import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Filter, Search, RefreshCw, Grid, MoreVertical, Eye, Plus } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';
import { ColumnVisibilityDropdown } from '@/components/ColumnVisibilityDropdown';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

// Sample events data based on the image
const eventsData = [
  {
    id: 1,
    title: 'Test Event',
    unit: '',
    createdBy: 'GodrejLiving',
    startDate: '08/04/2024 11:00 AM',
    endDate: '09/04/2024 12:00 PM',
    eventType: 'General',
    status: 'Published',
    expired: true,
    attachments: '',
    createdOn: '08/04/2024'
  },
  {
    id: 2,
    title: 'Christmas Eve',
    unit: '',
    createdBy: 'GodrejHisociety',
    startDate: '24/12/2024 8:30 PM',
    endDate: '24/12/2024 9:30 PM',
    eventType: 'General',
    status: 'Published',
    expired: true,
    attachments: '',
    createdOn: '05/04/2024'
  },
  {
    id: 3,
    title: 'Christmas Eve',
    unit: '',
    createdBy: 'GodrejHisociety',
    startDate: '15/04/2024 7:45 PM',
    endDate: '15/04/2024 8:45 PM',
    eventType: 'General',
    status: 'Published',
    expired: true,
    attachments: '',
    createdOn: '05/04/2024'
  },
  {
    id: 4,
    title: 'New Event',
    unit: '',
    createdBy: 'GodrejLiving',
    startDate: '14/08/2023 3:45 PM',
    endDate: '14/08/2023 6:45 PM',
    eventType: 'General',
    status: 'Published',
    expired: true,
    attachments: '',
    createdOn: '14/08/2023'
  }
];

export const CRMEventsPage = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEvents, setSelectedEvents] = useState<number[]>([]);
  const [filters, setFilters] = useState({
    unit: '',
    dateRange: undefined as Date | undefined,
    status: ''
  });

  // Column visibility state
  const [visibleColumns, setVisibleColumns] = useState([
    { key: 'actions', label: 'Actions', visible: true },
    { key: 'title', label: 'Title', visible: true },
    { key: 'unit', label: 'Unit', visible: true },
    { key: 'createdBy', label: 'Created By', visible: true },
    { key: 'startDate', label: 'Start Date', visible: true },
    { key: 'endDate', label: 'End Date', visible: true },
    { key: 'eventType', label: 'Event Type', visible: true },
    { key: 'status', label: 'Status', visible: true },
    { key: 'expired', label: 'Expired', visible: true },
    { key: 'attachments', label: 'Attachments', visible: true },
    { key: 'createdOn', label: 'Created On', visible: true }
  ]);

  const handleEventSelection = (eventId: number) => {
    setSelectedEvents(prev => 
      prev.includes(eventId) 
        ? prev.filter(id => id !== eventId)
        : [...prev, eventId]
    );
  };

  const handleSelectAll = () => {
    if (selectedEvents.length === eventsData.length) {
      setSelectedEvents([]);
    } else {
      setSelectedEvents(eventsData.map(event => event.id));
    }
  };

  const handleViewEvent = (eventId: number) => {
    navigate(`/crm/events/details/${eventId}`);
  };

  const handleAddEvent = () => {
    navigate('/crm/events/add');
  };

  const handleColumnToggle = (columnKey: string, visible: boolean) => {
    setVisibleColumns(prev => 
      prev.map(col => 
        col.key === columnKey ? { ...col, visible } : col
      )
    );
  };

  const getStatusBadge = (status: string) => {
    return (
      <Badge className="bg-green-600 text-white">
        {status}
      </Badge>
    );
  };

  const getEventTypeBadge = (type: string) => {
    return (
      <Badge className="bg-green-600 text-white">
        {type}
      </Badge>
    );
  };

  const getExpiredBadge = (expired: boolean) => {
    if (expired) {
      return (
        <Badge className="bg-red-600 text-white">
          Expired
        </Badge>
      );
    }
    return null;
  };

  const filteredEvents = eventsData.filter(event =>
    event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.createdBy.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Breadcrumb */}
      <div className="text-sm text-gray-600 mb-4">
        Events &gt; Event List
      </div>

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-4">Event List</h1>
        
        {/* Filters Section */}
        <div className="bg-white p-4 rounded-lg shadow mb-4">
          <div className="flex items-center gap-4 mb-4">
            <h3 className="font-medium text-gray-700">Filter</h3>
          </div>
          
          <div className="flex items-center gap-4 mb-4">
            <div className="flex-1">
              <Select onValueChange={(value) => setFilters(prev => ({ ...prev, unit: value }))}>
                <SelectTrigger className="w-full border-gray-300">
                  <SelectValue placeholder="Select Unit" />
                </SelectTrigger>
                <SelectContent className="bg-white border border-gray-200 shadow-lg z-50">
                  <SelectItem value="unit1">Unit 1</SelectItem>
                  <SelectItem value="unit2">Unit 2</SelectItem>
                  <SelectItem value="unit3">Unit 3</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex-1">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal border-gray-300",
                      !filters.dateRange && "text-gray-400"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {filters.dateRange ? format(filters.dateRange, "MM/dd/yyyy") : "Select Date Range"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={filters.dateRange}
                    onSelect={(date) => setFilters(prev => ({ ...prev, dateRange: date }))}
                    initialFocus
                    className="p-3 pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="flex-1">
              <Select onValueChange={(value) => setFilters(prev => ({ ...prev, status: value }))}>
                <SelectTrigger className="w-full border-gray-300">
                  <SelectValue placeholder="Select Status" />
                </SelectTrigger>
                <SelectContent className="bg-white border border-gray-200 shadow-lg z-50">
                  <SelectItem value="published">Published</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="archived">Archived</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button className="bg-green-600 hover:bg-green-700 text-white px-6">
              Apply
            </Button>
            <Button className="bg-blue-500 hover:bg-blue-600 text-white px-6">
              Reset
            </Button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between">
          <Button 
            onClick={handleAddEvent}
            className="bg-[#C72030] hover:bg-[#C72030]/90 text-white px-6"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Event
          </Button>

          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-80 border-gray-300"
              />
            </div>
            <Button variant="outline" size="icon" className="border-gray-300">
              <RefreshCw className="h-4 w-4" />
            </Button>
            <ColumnVisibilityDropdown 
              columns={visibleColumns}
              onColumnToggle={handleColumnToggle}
            />
            <Button variant="outline" size="icon" className="border-gray-300">
              <MoreVertical className="h-4 w-4" />
            </Button>
            <Button className="bg-[#C72030] hover:bg-[#C72030]/90 text-white px-4">
              Go!
            </Button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="w-12">
                <input
                  type="checkbox"
                  checked={selectedEvents.length === eventsData.length}
                  onChange={handleSelectAll}
                  className="rounded border-gray-300"
                />
              </TableHead>
              {visibleColumns.find(col => col.key === 'actions')?.visible && (
                <TableHead className="text-gray-700 font-medium">Actions</TableHead>
              )}
              {visibleColumns.find(col => col.key === 'title')?.visible && (
                <TableHead className="text-gray-700 font-medium">Title</TableHead>
              )}
              {visibleColumns.find(col => col.key === 'unit')?.visible && (
                <TableHead className="text-gray-700 font-medium">Unit</TableHead>
              )}
              {visibleColumns.find(col => col.key === 'createdBy')?.visible && (
                <TableHead className="text-gray-700 font-medium">Created By</TableHead>
              )}
              {visibleColumns.find(col => col.key === 'startDate')?.visible && (
                <TableHead className="text-gray-700 font-medium">Start Date</TableHead>
              )}
              {visibleColumns.find(col => col.key === 'endDate')?.visible && (
                <TableHead className="text-gray-700 font-medium">End Date</TableHead>
              )}
              {visibleColumns.find(col => col.key === 'eventType')?.visible && (
                <TableHead className="text-gray-700 font-medium">Event Type</TableHead>
              )}
              {visibleColumns.find(col => col.key === 'status')?.visible && (
                <TableHead className="text-gray-700 font-medium">Status</TableHead>
              )}
              {visibleColumns.find(col => col.key === 'expired')?.visible && (
                <TableHead className="text-gray-700 font-medium">Expired</TableHead>
              )}
              {visibleColumns.find(col => col.key === 'attachments')?.visible && (
                <TableHead className="text-gray-700 font-medium">Attachments</TableHead>
              )}
              {visibleColumns.find(col => col.key === 'createdOn')?.visible && (
                <TableHead className="text-gray-700 font-medium">Created On</TableHead>
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredEvents.map((event) => (
              <TableRow key={event.id} className="hover:bg-gray-50">
                <TableCell>
                  <input
                    type="checkbox"
                    checked={selectedEvents.includes(event.id)}
                    onChange={() => handleEventSelection(event.id)}
                    className="rounded border-gray-300"
                  />
                </TableCell>
                {visibleColumns.find(col => col.key === 'actions')?.visible && (
                  <TableCell>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 text-blue-600"
                      onClick={() => handleViewEvent(event.id)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </TableCell>
                )}
                {visibleColumns.find(col => col.key === 'title')?.visible && (
                  <TableCell className="font-medium">{event.title}</TableCell>
                )}
                {visibleColumns.find(col => col.key === 'unit')?.visible && (
                  <TableCell>{event.unit}</TableCell>
                )}
                {visibleColumns.find(col => col.key === 'createdBy')?.visible && (
                  <TableCell>{event.createdBy}</TableCell>
                )}
                {visibleColumns.find(col => col.key === 'startDate')?.visible && (
                  <TableCell>{event.startDate}</TableCell>
                )}
                {visibleColumns.find(col => col.key === 'endDate')?.visible && (
                  <TableCell>{event.endDate}</TableCell>
                )}
                {visibleColumns.find(col => col.key === 'eventType')?.visible && (
                  <TableCell>{getEventTypeBadge(event.eventType)}</TableCell>
                )}
                {visibleColumns.find(col => col.key === 'status')?.visible && (
                  <TableCell>{getStatusBadge(event.status)}</TableCell>
                )}
                {visibleColumns.find(col => col.key === 'expired')?.visible && (
                  <TableCell>{getExpiredBadge(event.expired)}</TableCell>
                )}
                {visibleColumns.find(col => col.key === 'attachments')?.visible && (
                  <TableCell>{event.attachments}</TableCell>
                )}
                {visibleColumns.find(col => col.key === 'createdOn')?.visible && (
                  <TableCell className="text-gray-600">{event.createdOn}</TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* Footer */}
        <div className="px-4 py-3 border-t bg-gray-50 text-sm text-gray-600">
          Showing 1 to 4 of 4 rows
        </div>
      </div>

      {/* Updated Pagination */}
      <div className="mt-6">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious href="#" />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#" isActive>
                1
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">
                2
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">
                3
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">
                10
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationNext href="#" />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>

      {/* Footer branding */}
      <div className="text-center text-xs text-gray-500 mt-8">
        <p>Powered by</p>
        <div className="flex items-center justify-center mt-1">
          <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold text-xs mr-2">
            L
          </div>
          <span className="font-semibold">LOCATED</span>
        </div>
      </div>
    </div>
  );
};
