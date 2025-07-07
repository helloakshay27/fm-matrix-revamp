import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Search, Eye, Filter, Download, Ticket, Clock, AlertCircle, CheckCircle, XCircle } from 'lucide-react';
import { TicketsFilterDialog } from '@/components/TicketsFilterDialog';

const ticketData = [
  {
    id: '2189-11106', taskNumber: 'test', description: 'Test description', category: 'Air Conditioner',
    subCategory: 'test', createdBy: 'Abhishek Sharma', assignedTo: 'Vinayak Mane', unit: 'Lockated',
    site: 'Lockated', building: 'J1', wing: 'Wings', floor: '1', area: '', room: '', priority: 'p1',
    status: 'Pending', createdOn: '16/06/2025 5:17 PM', mode: 'Call'
  },
  {
    id: '2189-11105', taskNumber: 'Test 1234', description: 'Another test', category: 'FIRE SYSTEM',
    subCategory: 'NA', createdBy: 'Vishal Vora', assignedTo: 'Deepak Gupta', unit: 'Lockated',
    site: 'Lockated', building: 'J1', wing: 'Wings', floor: '1', area: '', room: '', priority: 'p2',
    status: 'Closed', createdOn: '15/06/2025 3:30 PM', mode: 'Email'
  },
  {
    id: '2189-11104', taskNumber: 'Cleaning Request', description: 'Office cleaning', category: 'Cleaning',
    subCategory: 'Office', createdBy: 'John Doe', assignedTo: 'Vinayak Mane', unit: 'Lockated',
    site: 'Lockated', building: 'J2', wing: 'East', floor: '2', area: '', room: '', priority: 'p3',
    status: 'Pending', createdOn: '14/06/2025 10:15 AM', mode: 'Web'
  }
];

export const TicketDashboard = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredTickets, setFilteredTickets] = useState(ticketData);
  const [selectedTickets, setSelectedTickets] = useState<string[]>([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const totalTickets = ticketData.length;
  const openTickets = ticketData.filter(t => t.status === 'Open').length;
  const inProgressTickets = ticketData.filter(t => t.status === 'In Progress').length;
  const pendingTickets = ticketData.filter(t => t.status === 'Pending').length;
  const closedTickets = ticketData.filter(t => t.status === 'Closed').length;

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    if (value) {
      const filtered = ticketData.filter(ticket =>
        ticket.id.toLowerCase().includes(value.toLowerCase()) ||
        ticket.taskNumber.toLowerCase().includes(value.toLowerCase()) ||
        ticket.category.toLowerCase().includes(value.toLowerCase()) ||
        ticket.createdBy.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredTickets(filtered);
    } else {
      setFilteredTickets(ticketData);
    }
  };

  const handleStatusFilter = (status: string) => {
    setStatusFilter(status);
    if (status === 'all') {
      setFilteredTickets(ticketData);
    } else {
      const filtered = ticketData.filter(ticket => 
        ticket.status.toLowerCase() === status.toLowerCase()
      );
      setFilteredTickets(filtered);
    }
  };

  const handleTicketSelect = (ticketId: string) => {
    setSelectedTickets(prev => 
      prev.includes(ticketId) 
        ? prev.filter(id => id !== ticketId)
        : [...prev, ticketId]
    );
  };

  const handleExport = () => {
    const ticketsToExport = selectedTickets.length > 0 
      ? filteredTickets.filter(ticket => selectedTickets.includes(ticket.id))
      : filteredTickets;

    const csvContent = [
      ['Ticket ID', 'Task Number', 'Description', 'Category', 'Sub Category', 'Created By', 'Assigned To', 'Status', 'Priority', 'Created On'],
      ...ticketsToExport.map(ticket => [
        ticket.id,
        ticket.taskNumber,
        ticket.description,
        ticket.category,
        ticket.subCategory,
        ticket.createdBy,
        ticket.assignedTo,
        ticket.status,
        ticket.priority,
        ticket.createdOn
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'tickets.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleViewDetails = (ticketId: string) => {
    navigate(`/maintenance/ticket/details/${ticketId}`);
  };

  return (
    <div className="p-4 sm:p-6">
      <div className="mb-6">
        <p className="text-gray-600 mb-2 text-sm">Tickets &gt; Ticket List</p>
        <h1 className="text-xl sm:text-2xl font-bold text-[#1a1a1a] uppercase">TICKET LIST</h1>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
        {[
          { label: 'Total Tickets', value: totalTickets, icon: Ticket, iconName: 'Ticket' }, 
          { label: 'Open', value: openTickets, icon: AlertCircle, iconName: 'AlertCircle' }, 
          { label: 'In Progress', value: inProgressTickets, icon: Clock, iconName: 'Clock' }, 
          { label: 'Pending', value: pendingTickets, icon: Clock, iconName: 'Clock' }, 
          { label: 'Closed', value: closedTickets, icon: CheckCircle, iconName: 'CheckCircle' }
        ].map((item, i) => {
          const IconComponent = item.icon;
          return (
            <div key={i} className="bg-[#F2F0EB] text-[#D92818] rounded-lg p-4 flex flex-col items-center text-center">
              <div className="mb-2">
                <IconComponent className="w-6 h-6" />
              </div>
              <div className="text-2xl font-bold">{item.value}</div>
              <div className="text-sm">{item.label}</div>
              <div className="text-xs text-gray-500 mt-1">{item.iconName}</div>
            </div>
          );
        })}
      </div>

      <div className="flex flex-wrap gap-3 items-center mb-6">
        <Button onClick={() => navigate('/maintenance/ticket/add')} className="bg-[#C72030] text-white hover:bg-[#C72030]/90">
          <Plus className="w-4 h-4 mr-2" /> Add
        </Button>
        <Button variant="outline" className="border-[#C72030] text-[#C72030] hover:bg-[#C72030] hover:text-white" onClick={() => setIsFilterOpen(true)}>
          <Filter className="w-4 h-4 mr-2" /> Filters
        </Button>
        <Button variant="outline" className="border-[#C72030] text-[#C72030] hover:bg-[#C72030] hover:text-white" onClick={handleExport}>
          <Download className="w-4 h-4 mr-2" /> Export
        </Button>
        <div className="relative ml-auto w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search tickets..."
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button variant="outline" className="border-[#C72030] text-[#C72030] hover:bg-[#C72030] hover:text-white" onClick={() => {
          setSearchTerm('');
          setFilteredTickets(ticketData);
          setStatusFilter('all');
          setSelectedTickets([]);
        }}>Reset</Button>
      </div>

      <div className="overflow-x-auto bg-white rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead><input type="checkbox" onChange={(e) => setSelectedTickets(e.target.checked ? filteredTickets.map(t => t.id) : [])} checked={selectedTickets.length === filteredTickets.length && filteredTickets.length > 0} /></TableHead>
              <TableHead>View</TableHead>
              <TableHead>Ticket ID</TableHead>
              <TableHead>Task Number</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Sub Category</TableHead>
              <TableHead>Created By</TableHead>
              <TableHead>Assigned To</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Site</TableHead>
              <TableHead>Unit</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Created On</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTickets.map((ticket) => (
              <TableRow key={ticket.id}>
                <TableCell><input type="checkbox" checked={selectedTickets.includes(ticket.id)} onChange={() => handleTicketSelect(ticket.id)} /></TableCell>
                <TableCell><Button variant="ghost" size="sm" onClick={() => handleViewDetails(ticket.id)}><Eye className="w-4 h-4" /></Button></TableCell>
                <TableCell>{ticket.id}</TableCell>
                <TableCell>{ticket.taskNumber}</TableCell>
                <TableCell>{ticket.description}</TableCell>
                <TableCell>{ticket.category}</TableCell>
                <TableCell>{ticket.subCategory}</TableCell>
                <TableCell>{ticket.createdBy}</TableCell>
                <TableCell>{ticket.assignedTo}</TableCell>
                <TableCell><span className={`px-2 py-1 rounded text-xs ${ticket.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' : ticket.status === 'Closed' ? 'bg-green-100 text-green-700' : ticket.status === 'Open' ? 'bg-blue-100 text-blue-700' : 'bg-orange-100 text-orange-700'}`}>{ticket.status}</span></TableCell>
                <TableCell><span className="px-2 py-1 rounded text-xs bg-gray-100 text-gray-700">{ticket.priority}</span></TableCell>
                <TableCell>{ticket.site}</TableCell>
                <TableCell>{ticket.unit}</TableCell>
                <TableCell>Technician</TableCell>
                <TableCell>{ticket.createdOn}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <TicketsFilterDialog 
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        onApplyFilters={(filters) => {
          console.log('Applied filters:', filters);
          setIsFilterOpen(false);
        }}
      />
    </div>
  );
};
