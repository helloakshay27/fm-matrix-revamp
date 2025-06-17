
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Eye, Plus, Filter, Upload, Users, AlertTriangle, CheckCircle, MessageSquare, FileText } from 'lucide-react';
import { TicketsFilterDialog } from '../components/TicketsFilterDialog';

const statusCards = [
  { title: 'Closed Tickets', count: 301, color: 'bg-[#8B4513]', icon: CheckCircle },
  { title: 'Open Tickets', count: 738, color: 'bg-green-600', icon: AlertTriangle },
  { title: 'Complaint', count: 617, color: 'bg-orange-500', icon: MessageSquare },
  { title: 'Suggestion', count: 110, color: 'bg-orange-400', icon: FileText },
  { title: 'Request', count: 308, color: 'bg-[#C72030]', icon: Users }
];

const mockTicketData = [
  {
    ticketNumber: '2189-11105',
    description: 'not working',
    category: 'FIRE SYSTEM',
    subCategory: 'fire',
    createdBy: 'Ankit Gupta',
    assignedTo: 'Deepak Gupta',
    status: 'Closed',
    site: 'Lockated',
    unit: '',
    department: '',
    adminPriority: 'P1',
    createdOn: '11/06/2025',
    ticketType: 'Complaint',
    referenceNum: ''
  },
  {
    ticketNumber: '2189-11104',
    description: 'Feedback: Tap Faulty, ...',
    category: 'Air Conditioner',
    subCategory: '',
    createdBy: '',
    assignedTo: 'Vinayak Mane',
    status: 'Pending',
    site: 'Lockated',
    unit: '',
    department: '',
    adminPriority: 'P1',
    createdOn: '06/06/2025',
    ticketType: 'Complaint',
    referenceNum: ''
  },
  {
    ticketNumber: '2189-11103',
    description: 'Select Icon: Tap Fault...',
    category: 'Cleaning',
    subCategory: '',
    createdBy: '',
    assignedTo: '',
    status: 'Pending',
    site: 'Lockated',
    unit: '',
    department: '',
    adminPriority: 'P1',
    createdOn: '05/06/2025',
    ticketType: 'Complaint',
    referenceNum: ''
  }
];

export const TicketListDashboard = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const navigate = useNavigate();

  const handleFilterApply = (filters: any) => {
    console.log('Applied filters:', filters);
  };

  const handleAddTicket = () => {
    navigate('/maintenance/tickets/add');
  };

  const handleExport = () => {
    console.log('Exporting tickets...');
    // Create CSV content
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Ticket Number,Description,Category,Sub Category,Created By,Assigned To,Status,Site,Admin Priority,Created On,Ticket Type\n"
      + mockTicketData.map(ticket => 
          `${ticket.ticketNumber},"${ticket.description}",${ticket.category},${ticket.subCategory},${ticket.createdBy},${ticket.assignedTo},${ticket.status},${ticket.site},${ticket.adminPriority},${ticket.createdOn},${ticket.ticketType}`
        ).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "ticket_list.csv");
    link.click();
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
          <span>Tickets</span>
          <span>&gt;</span>
          <span>Ticket List</span>
        </div>
        <h1 className="text-2xl font-bold text-[#1a1a1a]">TICKET LIST</h1>
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

      {/* Action Buttons */}
      <div className="flex gap-3 mb-6">
        <Button 
          onClick={handleAddTicket}
          style={{ backgroundColor: '#C72030' }}
          className="text-white hover:bg-[#C72030]/90"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add
        </Button>
        <Button 
          variant="outline" 
          className="border-[#C72030] text-[#C72030] hover:bg-[#C72030]/10"
          onClick={() => setIsFilterOpen(true)}
        >
          <Filter className="w-4 h-4 mr-2" />
          Filters
        </Button>
        <Button 
          onClick={handleExport}
          style={{ backgroundColor: '#C72030' }}
          className="text-white hover:bg-[#C72030]/90"
        >
          <Upload className="w-4 h-4 mr-2" />
          Export
        </Button>
        <div className="ml-auto flex gap-2">
          <Input 
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-64"
          />
          <Button 
            style={{ backgroundColor: '#C72030' }}
            className="text-white hover:bg-[#C72030]/90"
          >
            Go!
          </Button>
          <Button variant="outline">Reset</Button>
        </div>
      </div>

      {/* Table */}
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead>View</TableHead>
              <TableHead>Action</TableHead>
              <TableHead>Ticket Number</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Sub Category</TableHead>
              <TableHead>Created By</TableHead>
              <TableHead>Assigned To</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Site</TableHead>
              <TableHead>Unit</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Admin Priority</TableHead>
              <TableHead>Created On</TableHead>
              <TableHead>Ticket Type</TableHead>
              <TableHead>Reference Num</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockTicketData.map((ticket) => (
              <TableRow key={ticket.ticketNumber}>
                <TableCell>
                  <Eye className="w-4 h-4 text-gray-600 cursor-pointer" />
                </TableCell>
                <TableCell></TableCell>
                <TableCell className="font-medium">{ticket.ticketNumber}</TableCell>
                <TableCell>{ticket.description}</TableCell>
                <TableCell>{ticket.category}</TableCell>
                <TableCell>{ticket.subCategory}</TableCell>
                <TableCell>{ticket.createdBy}</TableCell>
                <TableCell>{ticket.assignedTo}</TableCell>
                <TableCell>
                  <Badge 
                    className={
                      ticket.status === 'Closed' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }
                  >
                    {ticket.status}
                  </Badge>
                </TableCell>
                <TableCell>{ticket.site}</TableCell>
                <TableCell>{ticket.unit}</TableCell>
                <TableCell>{ticket.department}</TableCell>
                <TableCell>{ticket.adminPriority}</TableCell>
                <TableCell>{ticket.createdOn}</TableCell>
                <TableCell>{ticket.ticketType}</TableCell>
                <TableCell>{ticket.referenceNum}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <TicketsFilterDialog 
        open={isFilterOpen}
        onOpenChange={setIsFilterOpen}
        onApply={handleFilterApply}
      />
    </div>
  );
};
