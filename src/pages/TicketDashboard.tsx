
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Plus, Eye, Filter, Ticket, Clock, AlertCircle, CheckCircle } from 'lucide-react';
import { TicketsFilterDialog } from '@/components/TicketsFilterDialog';
import { EnhancedTable } from '@/components/enhanced-table/EnhancedTable';

const ticketData = [{
  id: '2189-11106',
  taskNumber: 'test',
  description: 'Test description',
  category: 'Air Conditioner',
  subCategory: 'test',
  createdBy: 'Abhishek Sharma',
  assignedTo: 'Vinayak Mane',
  unit: 'Lockated',
  site: 'Lockated',
  building: 'J1',
  wing: 'Wings',
  floor: '1',
  area: '',
  room: '',
  priority: 'p1',
  status: 'Pending',
  createdOn: '16/06/2025 5:17 PM',
  mode: 'Call'
}, {
  id: '2189-11105',
  taskNumber: 'Test 1234',
  description: 'Another test',
  category: 'FIRE SYSTEM',
  subCategory: 'NA',
  createdBy: 'Vishal Vora',
  assignedTo: 'Deepak Gupta',
  unit: 'Lockated',
  site: 'Lockated',
  building: 'J1',
  wing: 'Wings',
  floor: '1',
  area: '',
  room: '',
  priority: 'p2',
  status: 'Closed',
  createdOn: '15/06/2025 3:30 PM',
  mode: 'Email'
}, {
  id: '2189-11104',
  taskNumber: 'Cleaning Request',
  description: 'Office cleaning',
  category: 'Cleaning',
  subCategory: 'Office',
  createdBy: 'John Doe',
  assignedTo: 'Vinayak Mane',
  unit: 'Lockated',
  site: 'Lockated',
  building: 'J2',
  wing: 'East',
  floor: '2',
  area: '',
  room: '',
  priority: 'p3',
  status: 'Pending',
  createdOn: '14/06/2025 10:15 AM',
  mode: 'Web'
}];

export const TicketDashboard = () => {
  const navigate = useNavigate();
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const totalTickets = ticketData.length;
  const openTickets = ticketData.filter(t => t.status === 'Open').length;
  const inProgressTickets = ticketData.filter(t => t.status === 'In Progress').length;
  const pendingTickets = ticketData.filter(t => t.status === 'Pending').length;
  const closedTickets = ticketData.filter(t => t.status === 'Closed').length;

  const handleViewDetails = (ticketId: string) => {
    navigate(`/maintenance/ticket/details/${ticketId}`);
  };

  const columns = [{
    key: 'id',
    label: 'Ticket ID',
    sortable: true
  }, {
    key: 'taskNumber',
    label: 'Task Number',
    sortable: true
  }, {
    key: 'description',
    label: 'Description',
    sortable: true
  }, {
    key: 'category',
    label: 'Category',
    sortable: true
  }, {
    key: 'subCategory',
    label: 'Sub Category',
    sortable: true
  }, {
    key: 'createdBy',
    label: 'Created By',
    sortable: true
  }, {
    key: 'assignedTo',
    label: 'Assigned To',
    sortable: true
  }, {
    key: 'status',
    label: 'Status',
    sortable: true
  }, {
    key: 'priority',
    label: 'Priority',
    sortable: true
  }, {
    key: 'site',
    label: 'Site',
    sortable: true
  }, {
    key: 'unit',
    label: 'Unit',
    sortable: true
  }, {
    key: 'createdOn',
    label: 'Created On',
    sortable: true
  }];

  const renderCustomActions = () => <div className="flex flex-wrap gap-3">
      <Button onClick={() => navigate('/maintenance/ticket/add')} className="bg-primary text-primary-foreground hover:bg-primary/90">
        <Plus className="w-4 h-4 mr-2" /> Add
      </Button>
      <Button variant="outline" onClick={() => setIsFilterOpen(true)}>
        <Filter className="w-4 h-4 mr-2" /> Filters
      </Button>
    </div>;

  const renderRowActions = ticket => <Button variant="ghost" size="sm" onClick={() => handleViewDetails(ticket.id)}>
      <Eye className="w-4 h-4" />
    </Button>;

  const renderCell = (item, columnKey) => {
    if (columnKey === 'status') {
      return <span className={`px-2 py-1 rounded text-xs ${item.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' : item.status === 'Closed' ? 'bg-green-100 text-green-700' : item.status === 'Open' ? 'bg-blue-100 text-blue-700' : 'bg-orange-100 text-orange-700'}`}>
          {item.status}
        </span>;
    }
    if (columnKey === 'priority') {
      return <span className="px-2 py-1 rounded text-xs bg-gray-100 text-gray-700">
          {item.priority}
        </span>;
    }
    return item[columnKey];
  };

  return <div className="p-4 sm:p-6">
      <div className="mb-6">
        <p className="text-muted-foreground mb-2 text-sm">Tickets &gt; Ticket List</p>
        <h1 className="text-xl sm:text-2xl font-bold uppercase">TICKET LIST</h1>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
        {[{
        label: 'Total Tickets',
        value: totalTickets,
        icon: Ticket
      }, {
        label: 'Open',
        value: openTickets,
        icon: AlertCircle
      }, {
        label: 'In Progress',
        value: inProgressTickets,
        icon: Clock
      }, {
        label: 'Pending',
        value: pendingTickets,
        icon: Clock
      }, {
        label: 'Closed',
        value: closedTickets,
        icon: CheckCircle
      }].map((item, i) => {
        const IconComponent = item.icon;
        return <div key={i} className="p-4 rounded-lg shadow-sm h-[132px] flex items-center gap-4 bg-[f6f4ee] bg-[#f6f4ee]">
              <div className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 bg-[#FBEDEC]">
                <IconComponent className="w-6 h-6" style={{ color: '#C72030' }} />
              </div>
              <div className="flex flex-col">
                <div className="text-2xl font-bold leading-tight" style={{ color: '#C72030' }}>{item.value}</div>
                <div className="text-sm text-muted-foreground font-medium">{item.label}</div>
              </div>
            </div>;
      })}
      </div>

      <div className="mb-4">
        {renderCustomActions()}
      </div>

      <EnhancedTable 
        data={ticketData} 
        columns={columns} 
        renderCell={renderCell} 
        renderActions={renderRowActions} 
        selectable={true} 
        pagination={true} 
        paginationConfig={{
          pageSize: 10,
          showDebug: false
        }}
        enableExport={true} 
        exportFileName="tickets" 
        onRowClick={handleViewDetails} 
        storageKey="tickets-table" 
      />

      <TicketsFilterDialog isOpen={isFilterOpen} onClose={() => setIsFilterOpen(false)} onApplyFilters={filters => {
      console.log('Applied filters:', filters);
      setIsFilterOpen(false);
    }} />
    </div>;
};
