
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Plus, Filter, Download, Search, Eye } from 'lucide-react';

const ticketData = [
  {
    id: '2301-1163',
    jobNumber: 'null writing',
    description: 'FnB SYSTEM',
    category: 'Asset Engine',
    subCategory: 'Closed On site',
    createdBy: 'General Clerk',
    assignedTo: 'General Clerk',
    status: 'Closed',
    site: 'Loccated',
    uom: '',
    department: 'P1',
    clientName: '11-09-2025',
    createdOn: '11-09-2025',
    ticketNo: 'Completed',
    referenceNo: 'Approved',
    completedDate: '10-09-2025',
    assignedOn: 'Closed',
    approvedExpense: 'NA',
    approvedExpenseAmt: 'Approved',
    requestedExpenseAmt: 'Advanced',
    resolutionDate: 'Normal'
  },
  // Add more sample data as needed
];

export const TicketDashboard = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredTickets, setFilteredTickets] = useState(ticketData);

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    if (value) {
      const filtered = ticketData.filter(ticket =>
        ticket.id.toLowerCase().includes(value.toLowerCase()) ||
        ticket.description.toLowerCase().includes(value.toLowerCase()) ||
        ticket.status.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredTickets(filtered);
    } else {
      setFilteredTickets(ticketData);
    }
  };

  // Stats cards data
  const statsData = [
    { label: 'New Ticket', count: 1107, color: 'bg-purple-500' },
    { label: 'Open', count: 171, color: 'bg-green-500' },
    { label: 'In Progress', count: 15, color: 'bg-orange-500' },
    { label: 'Closed', count: 1105, color: 'bg-orange-600' },
    { label: 'Overdue', count: 1287, color: 'bg-red-500' }
  ];

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <p className="text-[#1a1a1a] opacity-70 mb-2">Tickets &gt; Ticket List</p>
        <h1 className="text-2xl font-bold text-[#1a1a1a]">TICKET LIST</h1>
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
        <Button style={{ backgroundColor: '#C72030' }} className="text-white">
          <Plus className="w-4 h-4 mr-2" />
          Add
        </Button>
        <Button variant="outline" className="border-[#C72030] text-[#C72030]">
          <Filter className="w-4 h-4 mr-2" />
          Filters
        </Button>
        <Button variant="outline" className="border-[#C72030] text-[#C72030]">
          <Download className="w-4 h-4 mr-2" />
          Export
        </Button>
        <div className="ml-auto">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search tickets..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-10 w-64"
            />
          </div>
        </div>
        <Button style={{ backgroundColor: '#C72030' }} className="text-white">
          GO
        </Button>
      </div>

      {/* Ticket Table */}
      <div className="bg-white rounded-lg border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Action</TableHead>
              <TableHead>Ticket ID</TableHead>
              <TableHead>Job Number</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Sub-Category</TableHead>
              <TableHead>Created By</TableHead>
              <TableHead>Site</TableHead>
              <TableHead>UoM</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Client Name</TableHead>
              <TableHead>Created On</TableHead>
              <TableHead>Ticket No</TableHead>
              <TableHead>Reference Number</TableHead>
              <TableHead>Completed Date</TableHead>
              <TableHead>Assigned On</TableHead>
              <TableHead>Approved Expense</TableHead>
              <TableHead>Approved Expense Amount</TableHead>
              <TableHead>Requested Expense Amount</TableHead>
              <TableHead>Resolution Priority</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTickets.map((ticket) => (
              <TableRow key={ticket.id}>
                <TableCell>
                  <Button variant="ghost" size="sm">
                    <Eye className="w-4 h-4" />
                  </Button>
                </TableCell>
                <TableCell className="font-medium">{ticket.id}</TableCell>
                <TableCell>{ticket.jobNumber}</TableCell>
                <TableCell>{ticket.description}</TableCell>
                <TableCell>{ticket.category}</TableCell>
                <TableCell>{ticket.subCategory}</TableCell>
                <TableCell>{ticket.createdBy}</TableCell>
                <TableCell>{ticket.site}</TableCell>
                <TableCell>{ticket.uom}</TableCell>
                <TableCell>{ticket.department}</TableCell>
                <TableCell>{ticket.clientName}</TableCell>
                <TableCell>{ticket.createdOn}</TableCell>
                <TableCell>{ticket.ticketNo}</TableCell>
                <TableCell>{ticket.referenceNo}</TableCell>
                <TableCell>{ticket.completedDate}</TableCell>
                <TableCell>{ticket.assignedOn}</TableCell>
                <TableCell>{ticket.approvedExpense}</TableCell>
                <TableCell>{ticket.approvedExpenseAmt}</TableCell>
                <TableCell>{ticket.requestedExpenseAmt}</TableCell>
                <TableCell>{ticket.resolutionDate}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* Pagination */}
        <div className="flex items-center justify-center gap-2 p-4">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((page) => (
            <Button
              key={page}
              variant={page === 1 ? "default" : "outline"}
              size="sm"
              style={page === 1 ? { backgroundColor: '#C72030' } : {}}
              className={page === 1 ? "text-white" : ""}
            >
              {page}
            </Button>
          ))}
          <Button variant="outline" size="sm">Last »</Button>
        </div>
      </div>
    </div>
  );
};
