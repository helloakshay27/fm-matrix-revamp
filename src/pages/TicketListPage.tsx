import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Plus, Search, RefreshCw, Grid3X3, Eye, Edit, Trash2, Flag, Star } from 'lucide-react';
import { ticketManagementAPI, TicketResponse } from '@/services/ticketManagementAPI';
import { useToast } from '@/hooks/use-toast';

interface TicketListData {
  id: string;
  ticketId: string;
  description: string;
  category: string;
  subCategory: string;
  createdBy: string;
  assignedTo: string;
  status: string;
  priority: string;
  site: string;
  createdOn: string;
  ticketType: string;
  isFlagged: boolean;
  isStarred: boolean;
}

export const TicketListPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTickets, setSelectedTickets] = useState<string[]>([]);
  const [tickets, setTickets] = useState<TicketListData[]>([]);
  const [loading, setLoading] = useState(false);

  // Sample data matching the image structure
  const sampleTickets: TicketListData[] = [
    {
      id: '1',
      ticketId: '2189-11132',
      description: 'Meter Test Details(ed5a3d91e6',
      category: 'Test CTG',
      subCategory: '--',
      createdBy: 'Abhishek Sharma',
      assignedTo: 'HO Technician',
      status: 'Pending',
      priority: 'p1',
      site: 'Lockated, Pune',
      createdOn: '02/08/2025',
      ticketType: 'Request',
      isFlagged: true,
      isStarred: true
    },
    {
      id: '2',
      ticketId: '2189-11131',
      description: 'IT Equipment (81b8036fd089f',
      category: 'Repair & Maintenance',
      subCategory: '--',
      createdBy: 'Abhishek Sharma',
      assignedTo: 'HO Technician',
      status: 'Pending',
      priority: 'p1',
      site: 'Lockated, Pune',
      createdOn: '31/07/2025',
      ticketType: 'Complaint',
      isFlagged: true,
      isStarred: false
    },
    {
      id: '3',
      ticketId: '2189-11114',
      description: 'Test14555',
      category: 'Tech Service',
      subCategory: '--',
      createdBy: 'Abhishek Sharma',
      assignedTo: '--',
      status: 'Pending',
      priority: 'p1',
      site: 'Lockated, Pune',
      createdOn: '28/07/2025',
      ticketType: 'complaint',
      isFlagged: true,
      isStarred: false
    },
    {
      id: '4',
      ticketId: '2189-11118',
      description: 'testinggg',
      category: 'FIRE SYSTEM',
      subCategory: '--',
      createdBy: 'Abhishek Sharma',
      assignedTo: 'Deepak Gupta',
      status: 'Pending',
      priority: 'p1',
      site: 'Lockated, Pune',
      createdOn: '28/07/2025',
      ticketType: 'complaint',
      isFlagged: true,
      isStarred: true
    },
    {
      id: '5',
      ticketId: '2189-11110',
      description: 'updated test',
      category: 'FIRE SYSTEM',
      subCategory: '--',
      createdBy: 'Abhishek Sharma',
      assignedTo: 'Ankit Gupta',
      status: 'Open',
      priority: 'p1',
      site: 'Lockated, Pune',
      createdOn: '28/07/2025',
      ticketType: 'Request',
      isFlagged: true,
      isStarred: true
    },
    {
      id: '6',
      ticketId: '2189-11109',
      description: 'rrrrr',
      category: 'Printer',
      subCategory: '--',
      createdBy: 'Abhishek Sharma',
      assignedTo: 'Omkar Chavan',
      status: 'Open',
      priority: 'p4',
      site: 'Lockated, Pune',
      createdOn: '28/07/2025',
      ticketType: 'Request',
      isFlagged: false,
      isStarred: false
    },
    {
      id: '7',
      ticketId: '2189-11094',
      description: 'Asset 2b-1cabadf39e235a733',
      category: 'Repair & Maintenance',
      subCategory: '--',
      createdBy: 'Abhishek Sharma',
      assignedTo: 'HO Technician',
      status: 'Pending',
      priority: 'p1',
      site: 'Lockated, Pune',
      createdOn: '28/07/2025',
      ticketType: 'Complaint',
      isFlagged: false,
      isStarred: false
    },
    {
      id: '8',
      ticketId: '2189-11091',
      description: 'Test TCK',
      category: 'Air Conditioner',
      subCategory: 'AC, AV, Electrical',
      createdBy: 'Abhishek Sharma',
      assignedTo: 'Omkar Chavan',
      status: 'Pending',
      priority: 'p1',
      site: 'Lockated, Pune',
      createdOn: '28/07/2025',
      ticketType: 'Request',
      isFlagged: false,
      isStarred: false
    },
    {
      id: '9',
      ticketId: '2189-11130',
      description: 'Asset Land Name (ed9306b2b',
      category: 'Repair & Maintenance',
      subCategory: '--',
      createdBy: 'Abhishek Sharma',
      assignedTo: 'HO Technician',
      status: 'Pending',
      priority: 'p1',
      site: 'Lockated, Pune',
      createdOn: '31/07/2025',
      ticketType: 'Complaint',
      isFlagged: false,
      isStarred: false
    }
  ];

  const [filteredTickets, setFilteredTickets] = useState<TicketListData[]>(sampleTickets);

  useEffect(() => {
    const filtered = sampleTickets.filter(ticket =>
      ticket.ticketId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.createdBy.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.assignedTo.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredTickets(filtered);
  }, [searchTerm]);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedTickets(filteredTickets.map(ticket => ticket.id));
    } else {
      setSelectedTickets([]);
    }
  };

  const handleSelectTicket = (ticketId: string, checked: boolean) => {
    if (checked) {
      setSelectedTickets(prev => [...prev, ticketId]);
    } else {
      setSelectedTickets(prev => prev.filter(id => id !== ticketId));
    }
  };

  const handleView = (ticketId: string) => {
    navigate(`/maintenance/ticket/details/${ticketId}`);
  };

  const handleEdit = (ticketId: string) => {
    navigate(`/maintenance/ticket/update/${ticketId}`);
  };

  const handleDelete = (ticketId: string) => {
    console.log(`Deleting ticket: ${ticketId}`);
    toast({
      title: "Delete Ticket",
      description: `Ticket ${ticketId} deletion requested`,
    });
  };

  const handleAdd = () => {
    navigate('/maintenance/ticket/add');
  };

  const getStatusBadge = (status: string) => {
    const statusColors = {
      'Pending': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'Open': 'bg-blue-100 text-blue-800 border-blue-200',
      'Closed': 'bg-green-100 text-green-800 border-green-200',
      'In Progress': 'bg-orange-100 text-orange-800 border-orange-200'
    };
    
    return (
      <Badge 
        className={`px-2 py-1 text-xs font-medium border ${statusColors[status] || 'bg-gray-100 text-gray-800 border-gray-200'}`}
      >
        {status}
      </Badge>
    );
  };

  const getPriorityColor = (priority: string) => {
    const colors = {
      'p1': 'text-red-600',
      'p2': 'text-orange-600', 
      'p3': 'text-yellow-600',
      'p4': 'text-green-600'
    };
    return colors[priority] || 'text-gray-600';
  };

  return (
    <div className="p-6 min-h-screen bg-white">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Ticket Management</h1>
        
        <div className="flex items-center gap-3">
          <Button 
            onClick={handleAdd}
            className="bg-[#00B4D8] hover:bg-[#00B4D8]/90 text-white px-4 py-2"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add
          </Button>
          
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search tickets..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-80"
            />
          </div>
          
          <Button variant="outline" size="icon" className="border-gray-300">
            <RefreshCw className="w-4 h-4" />
          </Button>
          
          <Button variant="outline" size="icon" className="border-gray-300">
            <Grid3X3 className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-[#f6f4ee]">
              <TableHead className="w-12">
                <Checkbox 
                  checked={selectedTickets.length === filteredTickets.length && filteredTickets.length > 0}
                  onCheckedChange={handleSelectAll}
                />
              </TableHead>
              <TableHead className="w-24">Actions</TableHead>
              <TableHead className="w-32">Ticket ID</TableHead>
              <TableHead className="min-w-[200px]">Description</TableHead>
              <TableHead className="w-40">Category</TableHead>
              <TableHead className="w-40">Sub Category</TableHead>
              <TableHead className="w-40">Created By</TableHead>
              <TableHead className="w-40">Assigned To</TableHead>
              <TableHead className="w-32">Status</TableHead>
              <TableHead className="w-24">Priority</TableHead>
              <TableHead className="w-40">Site</TableHead>
              <TableHead className="w-32">Created On</TableHead>
              <TableHead className="w-32">Ticket Type</TableHead>
              <TableHead className="w-16">Comments</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTickets.map((ticket) => (
              <TableRow key={ticket.id} className="hover:bg-gray-50">
                <TableCell>
                  <Checkbox 
                    checked={selectedTickets.includes(ticket.id)}
                    onCheckedChange={(checked) => handleSelectTicket(ticket.id, checked as boolean)}
                  />
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleView(ticket.ticketId)}
                      className="p-1 hover:bg-gray-100 rounded"
                      title="View"
                    >
                      <Eye className="w-4 h-4 text-gray-600" />
                    </button>
                    {ticket.isFlagged && (
                      <Flag className="w-4 h-4 text-red-500" />
                    )}
                    {ticket.isStarred && (
                      <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    )}
                  </div>
                </TableCell>
                <TableCell className="font-medium text-blue-600">
                  {ticket.ticketId}
                </TableCell>
                <TableCell className="max-w-[200px]">
                  <div className="truncate" title={ticket.description}>
                    {ticket.description}
                  </div>
                </TableCell>
                <TableCell>{ticket.category}</TableCell>
                <TableCell>{ticket.subCategory}</TableCell>
                <TableCell>{ticket.createdBy}</TableCell>
                <TableCell>{ticket.assignedTo}</TableCell>
                <TableCell>
                  {getStatusBadge(ticket.status)}
                </TableCell>
                <TableCell className={`font-medium ${getPriorityColor(ticket.priority)}`}>
                  {ticket.priority}
                </TableCell>
                <TableCell>{ticket.site}</TableCell>
                <TableCell>{ticket.createdOn}</TableCell>
                <TableCell className="capitalize">{ticket.ticketType}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleEdit(ticket.ticketId)}
                      className="p-1 hover:bg-gray-100 rounded"
                      title="Edit"
                    >
                      <Edit className="w-4 h-4 text-gray-600 hover:text-blue-600" />
                    </button>
                    <button
                      onClick={() => handleDelete(ticket.ticketId)}
                      className="p-1 hover:bg-gray-100 rounded"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4 text-gray-600 hover:text-red-600" />
                    </button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Selection Info */}
      {selectedTickets.length > 0 && (
        <div className="mt-4 text-sm text-gray-600">
          {selectedTickets.length} ticket(s) selected
        </div>
      )}

      {/* Footer */}
      <div className="mt-6 text-center">
        <div className="inline-flex items-center gap-2 text-sm text-gray-600">
          <span>Powered by</span>
          <div className="w-6 h-6 bg-gray-800 rounded-full flex items-center justify-center">
            <span className="text-white text-xs font-bold">L</span>
          </div>
          <span className="font-semibold text-gray-800">LOCKATED</span>
        </div>
      </div>
    </div>
  );
};