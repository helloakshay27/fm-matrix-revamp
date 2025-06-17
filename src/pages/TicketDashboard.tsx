
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Search, Eye, Filter, Download } from 'lucide-react';

const ticketData = [
  {
    id: '238117516',
    taskNumber: 'not waiting',
    description: '',
    category: 'FIRE SYSTEM',
    subCategory: 'NA',
    createdBy: 'Vishal Vora',
    owner: 'Owner Guna',
    unit: 'Locatled',
    site: 'Locatled',
    building: 'J1',
    wing: 'Wings',
    floor: '1',
    area: '',
    room: '',
    priority: 'Planning',
    status: 'Resolved',
    costToTeam: 'Resolved',
    takesTime: 'NA',
    referenceNumber: '',
    completeNotes: '',
    assignedTo: 'NA',
    assignToName: 'Advanced',
    responseTime: 'Advanced',
    resolveTime: 'Resolved',
    resolution: 'Resolved'
  },
  {
    id: '238117515',
    taskNumber: 'Test 1234',
    description: '',
    category: 'Fire slab form',
    subCategory: 'Cleaning',
    createdBy: 'Vishal Vora',
    owner: 'Desai Guna',
    unit: 'Locatled',
    site: 'Locatled',
    building: 'J1',
    wing: 'Wings',
    floor: '1',
    area: '',
    room: '',
    priority: 'Planning',
    status: 'Resolved',
    costToTeam: 'Resolved',
    takesTime: 'NA',
    referenceNumber: '',
    completeNotes: '',
    assignedTo: 'NA',
    assignToName: 'Advanced',
    responseTime: 'Advanced',
    resolveTime: 'Resolved',
    resolution: 'Resolved'
  }
];

export const TicketDashboard = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredTickets, setFilteredTickets] = useState(ticketData);

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    if (value) {
      const filtered = ticketData.filter(ticket =>
        ticket.id.toLowerCase().includes(value.toLowerCase()) ||
        ticket.taskNumber.toLowerCase().includes(value.toLowerCase()) ||
        ticket.category.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredTickets(filtered);
    } else {
      setFilteredTickets(ticketData);
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <p className="text-[#1a1a1a] opacity-70 mb-2">Tickets &gt; Ticket List</p>
        <h1 className="text-2xl font-bold text-[#1a1a1a]">TICKET LIST</h1>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-5 gap-4 mb-6">
        <div className="bg-blue-500 text-white p-4 rounded-lg text-center">
          <div className="text-2xl font-bold">537</div>
          <div className="text-sm">Total Tickets</div>
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
        <div className="ml-auto flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search tickets..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-10 w-64"
            />
          </div>
          <Button variant="outline" className="border-[#C72030] text-[#C72030]">
            Reset
          </Button>
        </div>
      </div>

      {/* Ticket Table */}
      <div className="bg-white rounded-lg border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Action</TableHead>
              <TableHead>Ticket ID</TableHead>
              <TableHead>Task Number</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Sub Category</TableHead>
              <TableHead>Created By</TableHead>
              <TableHead>Owner</TableHead>
              <TableHead>Unit</TableHead>
              <TableHead>Site</TableHead>
              <TableHead>Building</TableHead>
              <TableHead>Wing</TableHead>
              <TableHead>Floor</TableHead>
              <TableHead>Area</TableHead>
              <TableHead>Room</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Cost To Team</TableHead>
              <TableHead>Takes Time</TableHead>
              <TableHead>Reference Number</TableHead>
              <TableHead>Complete Notes</TableHead>
              <TableHead>Assigned To</TableHead>
              <TableHead>Assign To Name</TableHead>
              <TableHead>Response Time</TableHead>
              <TableHead>Resolve Time</TableHead>
              <TableHead>Resolution</TableHead>
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
                <TableCell>{ticket.taskNumber}</TableCell>
                <TableCell>{ticket.description}</TableCell>
                <TableCell>{ticket.category}</TableCell>
                <TableCell>{ticket.subCategory}</TableCell>
                <TableCell>{ticket.createdBy}</TableCell>
                <TableCell>{ticket.owner}</TableCell>
                <TableCell>{ticket.unit}</TableCell>
                <TableCell>{ticket.site}</TableCell>
                <TableCell>{ticket.building}</TableCell>
                <TableCell>{ticket.wing}</TableCell>
                <TableCell>{ticket.floor}</TableCell>
                <TableCell>{ticket.area}</TableCell>
                <TableCell>{ticket.room}</TableCell>
                <TableCell>
                  <span className="px-2 py-1 rounded text-xs bg-blue-100 text-blue-700">
                    {ticket.priority}
                  </span>
                </TableCell>
                <TableCell>
                  <span className="px-2 py-1 rounded text-xs bg-green-100 text-green-700">
                    {ticket.status}
                  </span>
                </TableCell>
                <TableCell>{ticket.costToTeam}</TableCell>
                <TableCell>{ticket.takesTime}</TableCell>
                <TableCell>{ticket.referenceNumber}</TableCell>
                <TableCell>{ticket.completeNotes}</TableCell>
                <TableCell>{ticket.assignedTo}</TableCell>
                <TableCell>{ticket.assignToName}</TableCell>
                <TableCell>{ticket.responseTime}</TableCell>
                <TableCell>{ticket.resolveTime}</TableCell>
                <TableCell>{ticket.resolution}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
