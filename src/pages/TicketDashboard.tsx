
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { EnhancedTable } from '@/components/enhanced-table/EnhancedTable';
import { ColumnConfig } from '@/hooks/useEnhancedTable';
import { useToast } from '@/hooks/use-toast';
import { 
  Eye, 
  Flag, 
  Star, 
  Edit, 
  Trash2, 
  Plus, 
  Filter, 
  Search,
  Calendar,
  Users,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  MoreHorizontal
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { cn } from '@/lib/utils';

interface Ticket {
  id: string;
  title: string;
  description: string;
  status: 'Open' | 'In Progress' | 'Closed' | 'Pending';
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  category: string;
  assignedTo: string;
  createdBy: string;
  createdDate: string;
  dueDate: string;
  isFlagged: boolean;
  isStarred: boolean;
}

const TicketDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [ticketToDelete, setTicketToDelete] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<Record<string, boolean>>({});

  // Mock data for demonstration
  useEffect(() => {
    const mockTickets: Ticket[] = [
      {
        id: 'TKT-001',
        title: 'System Login Issue',
        description: 'Users unable to login to the system',
        status: 'Open',
        priority: 'High',
        category: 'Technical',
        assignedTo: 'John Doe',
        createdBy: 'Admin User',
        createdDate: '2024-01-15',
        dueDate: '2024-01-20',
        isFlagged: false,
        isStarred: true
      },
      {
        id: 'TKT-002',
        title: 'Database Performance',
        description: 'Slow database queries affecting performance',
        status: 'In Progress',
        priority: 'Medium',
        category: 'Performance',
        assignedTo: 'Jane Smith',
        createdBy: 'System Monitor',
        createdDate: '2024-01-14',
        dueDate: '2024-01-22',
        isFlagged: true,
        isStarred: false
      },
      {
        id: 'TKT-003',
        title: 'UI Bug Fix',
        description: 'Button alignment issues in dashboard',
        status: 'Closed',
        priority: 'Low',
        category: 'UI/UX',
        assignedTo: 'Bob Johnson',
        createdBy: 'QA Team',
        createdDate: '2024-01-12',
        dueDate: '2024-01-18',
        isFlagged: false,
        isStarred: false
      }
    ];
    setTickets(mockTickets);
  }, []);

  const handleViewTicket = (ticketId: string) => {
    navigate(`/maintenance/ticket/${ticketId}`);
  };

  const handleEditTicket = (ticketId: string) => {
    navigate(`/maintenance/ticket/edit/${ticketId}`);
  };

  const handleToggleFlag = async (ticketId: string) => {
    setActionLoading(prev => ({ ...prev, [ticketId]: true }));
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setTickets(prev => prev.map(ticket => 
        ticket.id === ticketId 
          ? { ...ticket, isFlagged: !ticket.isFlagged }
          : ticket
      ));
      
      const ticket = tickets.find(t => t.id === ticketId);
      toast({
        title: ticket?.isFlagged ? "Flag removed" : "Ticket flagged",
        description: `Ticket ${ticketId} has been ${ticket?.isFlagged ? 'unflagged' : 'flagged'}`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update ticket flag status",
        variant: "destructive",
      });
    } finally {
      setActionLoading(prev => ({ ...prev, [ticketId]: false }));
    }
  };

  const handleToggleStar = async (ticketId: string) => {
    setActionLoading(prev => ({ ...prev, [ticketId]: true }));
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setTickets(prev => prev.map(ticket => 
        ticket.id === ticketId 
          ? { ...ticket, isStarred: !ticket.isStarred }
          : ticket
      ));
      
      const ticket = tickets.find(t => t.id === ticketId);
      toast({
        title: ticket?.isStarred ? "Star removed" : "Ticket starred",
        description: `Ticket ${ticketId} has been ${ticket?.isStarred ? 'unstarred' : 'starred'}`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update ticket star status",
        variant: "destructive",
      });
    } finally {
      setActionLoading(prev => ({ ...prev, [ticketId]: false }));
    }
  };

  const handleDeleteTicket = async (ticketId: string) => {
    setActionLoading(prev => ({ ...prev, [ticketId]: true }));
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setTickets(prev => prev.filter(ticket => ticket.id !== ticketId));
      
      toast({
        title: "Ticket deleted",
        description: `Ticket ${ticketId} has been successfully deleted`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete ticket",
        variant: "destructive",
      });
    } finally {
      setActionLoading(prev => ({ ...prev, [ticketId]: false }));
      setDeleteDialogOpen(false);
      setTicketToDelete(null);
    }
  };

  const openDeleteDialog = (ticketId: string) => {
    setTicketToDelete(ticketId);
    setDeleteDialogOpen(true);
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'Open':
        return 'destructive';
      case 'In Progress':
        return 'default';
      case 'Closed':
        return 'secondary';
      case 'Pending':
        return 'outline';
      default:
        return 'default';
    }
  };

  const getPriorityBadgeVariant = (priority: string) => {
    switch (priority) {
      case 'Critical':
        return 'destructive';
      case 'High':
        return 'destructive';
      case 'Medium':
        return 'default';
      case 'Low':
        return 'secondary';
      default:
        return 'default';
    }
  };

  const columns: ColumnConfig[] = [
    { key: 'id', label: 'Ticket ID', sortable: true, hideable: true, draggable: true },
    { key: 'title', label: 'Title', sortable: true, hideable: true, draggable: true },
    { key: 'status', label: 'Status', sortable: true, hideable: true, draggable: true },
    { key: 'priority', label: 'Priority', sortable: true, hideable: true, draggable: true },
    { key: 'category', label: 'Category', sortable: true, hideable: true, draggable: true },
    { key: 'assignedTo', label: 'Assigned To', sortable: true, hideable: true, draggable: true },
    { key: 'createdDate', label: 'Created Date', sortable: true, hideable: true, draggable: true },
    { key: 'dueDate', label: 'Due Date', sortable: true, hideable: true, draggable: true },
    { key: 'actions', label: 'Actions', sortable: false, hideable: false, draggable: false },
  ];

  const renderRow = (ticket: Ticket) => ({
    id: (
      <div className="flex items-center gap-2">
        <span className="font-medium">{ticket.id}</span>
        {ticket.isFlagged && <Flag className="w-4 h-4 text-red-500" />}
        {ticket.isStarred && <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />}
      </div>
    ),
    title: (
      <div className="max-w-xs">
        <div className="font-medium truncate">{ticket.title}</div>
        <div className="text-sm text-muted-foreground truncate">{ticket.description}</div>
      </div>
    ),
    status: (
      <Badge variant={getStatusBadgeVariant(ticket.status)}>
        {ticket.status}
      </Badge>
    ),
    priority: (
      <Badge variant={getPriorityBadgeVariant(ticket.priority)}>
        {ticket.priority}
      </Badge>
    ),
    category: ticket.category,
    assignedTo: ticket.assignedTo,
    createdDate: ticket.createdDate,
    dueDate: ticket.dueDate,
    actions: (
      <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleViewTicket(ticket.id)}
          className="h-8 w-8 p-0 hover:bg-accent"
          title="View ticket"
        >
          <Eye className="w-4 h-4" />
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleEditTicket(ticket.id)}
          className="h-8 w-8 p-0 hover:bg-accent"
          title="Edit ticket"
        >
          <Edit className="w-4 h-4" />
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleToggleFlag(ticket.id)}
          disabled={actionLoading[ticket.id]}
          className={cn(
            "h-8 w-8 p-0 hover:bg-accent",
            ticket.isFlagged && "text-red-500 hover:text-red-600"
          )}
          title={ticket.isFlagged ? "Remove flag" : "Flag ticket"}
        >
          <Flag className={cn("w-4 h-4", ticket.isFlagged && "fill-current")} />
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleToggleStar(ticket.id)}
          disabled={actionLoading[ticket.id]}
          className={cn(
            "h-8 w-8 p-0 hover:bg-accent",
            ticket.isStarred && "text-yellow-500 hover:text-yellow-600"
          )}
          title={ticket.isStarred ? "Remove star" : "Star ticket"}
        >
          <Star className={cn("w-4 h-4", ticket.isStarred && "fill-current")} />
        </Button>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 hover:bg-accent"
              title="More actions"
            >
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={() => openDeleteDialog(ticket.id)}
              className="text-red-600 hover:text-red-700"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    ),
  });

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Ticket Management</h1>
          <p className="text-muted-foreground">Manage and track all tickets</p>
        </div>
        <Button onClick={() => navigate('/maintenance/ticket/create')} className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Create Ticket
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tickets</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{tickets.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Open Tickets</CardTitle>
            <XCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{tickets.filter(t => t.status === 'Open').length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{tickets.filter(t => t.status === 'In Progress').length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Closed Tickets</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{tickets.filter(t => t.status === 'Closed').length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Tickets Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Tickets</CardTitle>
        </CardHeader>
        <CardContent>
          <EnhancedTable
            data={tickets}
            columns={columns}
            renderRow={renderRow}
            onRowClick={(ticket) => handleViewTicket(ticket.id)}
            storageKey="tickets-table"
            emptyMessage="No tickets found"
            enableSearch={true}
            enableSelection={false}
            enableExport={true}
            exportFileName="tickets"
            searchPlaceholder="Search tickets..."
            loading={loading}
            pagination={true}
            pageSize={10}
          />
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the ticket
              {ticketToDelete && ` ${ticketToDelete}`} and remove all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setTicketToDelete(null)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => ticketToDelete && handleDeleteTicket(ticketToDelete)}
              className="bg-red-600 hover:bg-red-700"
              disabled={ticketToDelete ? actionLoading[ticketToDelete] : false}
            >
              {ticketToDelete && actionLoading[ticketToDelete] ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default TicketDashboard;
