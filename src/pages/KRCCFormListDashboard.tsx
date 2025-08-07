
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, UserCheck, Clock, Settings, Shield, Eye, Trash2, Plus, Filter } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { EnhancedTable } from '@/components/enhanced-table/EnhancedTable';
import { ColumnConfig } from '@/hooks/useEnhancedTable';
import { SelectionPanel } from '@/components/water-asset-details/PannelTab';
import { KRCCFormFilterDialog } from '@/components/KRCCFormFilterDialog';
import { toast } from 'sonner';
import axios from 'axios';

// Define KRCC Form interface
interface KRCCForm {
  id: number;
  user: string;
  user_email: string;
  status: string;
  created_date?: string;
  updated_date?: string;
  form_type?: string;
}

export const KRCCFormListDashboard = () => {
  const navigate = useNavigate();

  // Dummy KRCC Form data (15 records) in state
  const [krccForms, setKrccForms] = useState<KRCCForm[]>([
    {
      id: 1, user: 'SANJEEV KUMAR', user_email: 'skchauhaanabc@gmail.com', status: 'pending', created_date: '2024-01-15', form_type: 'KRCC-A'
    },
    {
      id: 2, user: 'Rahul Kumar', user_email: 'rahulk5277263@gmail.com', status: 'pending', created_date: '2024-01-16', form_type: 'KRCC-B'
    },
    {
      id: 3, user: 'Mukesh Kumar', user_email: 'mukesh.kumar70@vodafoneidea.com', status: 'pending', created_date: '2024-01-17', form_type: 'KRCC-A'
    },
    {
      id: 4, user: 'Abhijth Debnath', user_email: 'debnathabhijij@gmail.com', status: 'approved', created_date: '2024-01-18', form_type: 'KRCC-C'
    },
    {
      id: 5, user: 'Jay Chauhan', user_email: 'jay.chauhan@vodafoneidea.com', status: 'approved', created_date: '2024-01-19', form_type: 'KRCC-B'
    },
    {
      id: 6, user: 'Amit Sharma', user_email: 'amit.sharma@example.com', status: 'rejected', created_date: '2024-01-20', form_type: 'KRCC-A'
    },
    {
      id: 7, user: 'Priya Singh', user_email: 'priya.singh@example.com', status: 'pending', created_date: '2024-01-21', form_type: 'KRCC-C'
    },
    {
      id: 8, user: 'Rajesh Gupta', user_email: 'rajesh.gupta@example.com', status: 'approved', created_date: '2024-01-22', form_type: 'KRCC-B'
    },
    {
      id: 9, user: 'Neha Patel', user_email: 'neha.patel@example.com', status: 'pending', created_date: '2024-01-23', form_type: 'KRCC-A'
    },
    {
      id: 10, user: 'Vikas Yadav', user_email: 'vikas.yadav@example.com', status: 'approved', created_date: '2024-01-24', form_type: 'KRCC-C'
    },
    {
      id: 11, user: 'Sunita Verma', user_email: 'sunita.verma@example.com', status: 'rejected', created_date: '2024-01-25', form_type: 'KRCC-B'
    },
    {
      id: 12, user: 'Manoj Tiwari', user_email: 'manoj.tiwari@example.com', status: 'pending', created_date: '2024-01-26', form_type: 'KRCC-A'
    },
    {
      id: 13, user: 'Kavita Reddy', user_email: 'kavita.reddy@example.com', status: 'approved', created_date: '2024-01-27', form_type: 'KRCC-C'
    },
    {
      id: 14, user: 'Deepak Singh', user_email: 'deepak.singh@example.com', status: 'pending', created_date: '2024-01-28', form_type: 'KRCC-B'
    },
    {
      id: 15, user: 'Anita Joshi', user_email: 'anita.joshi@example.com', status: 'approved', created_date: '2024-01-29', form_type: 'KRCC-A'
    },
  ]);
  
  const loading = false;
  const [searchTerm, setSearchTerm] = useState('');
  const [showActionPanel, setShowActionPanel] = useState(false);
  const [isFilterDialogOpen, setIsFilterDialogOpen] = useState(false);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  const cardData = [{
    title: "Total Forms",
    count: krccForms?.length || 15,
    icon: Users
  }, {
    title: "Approved Forms",
    count: krccForms?.filter(form => form.status === 'approved').length || 6,
    icon: UserCheck
  }, {
    title: "Pending Forms",
    count: krccForms?.filter(form => form.status === 'pending').length || 7,
    icon: Clock
  }, {
    title: "Rejected Forms",
    count: krccForms?.filter(form => form.status === 'rejected').length || 2,
    icon: Shield
  }];

  const getStatusBadge = (status: string) => {
    if (!status) {
      return <Badge className="bg-gray-500 text-white hover:bg-gray-600">Unknown</Badge>;
    }
    switch (status.toLowerCase()) {
      case 'approved':
        return <Badge className="bg-green-500 text-white hover:bg-green-600">Approved</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-500 text-white hover:bg-yellow-600">Pending</Badge>;
      case 'rejected':
        return <Badge className="bg-red-500 text-white hover:bg-red-600">Rejected</Badge>;
      default:
        return <Badge className="bg-gray-500 text-white hover:bg-gray-600">{status}</Badge>;
    }
  };

  const columns: ColumnConfig[] = [{
    key: 'action',
    label: 'Action',
    sortable: false,
    hideable: false
  }, {
    key: 'user',
    label: 'User',
    sortable: true,
    hideable: false
  }, {
    key: 'user_email',
    label: 'User Email',
    sortable: true,
    hideable: false
  }, {
    key: 'status',
    label: 'Status',
    sortable: true,
    hideable: true
  }, {
    key: 'delete',
    label: 'Delete',
    sortable: false,
    hideable: false
  }];

  const renderCell = (form: KRCCForm, columnKey: string): React.ReactNode => {
    switch (columnKey) {
      case 'action':
        return (
          <div className="flex justify-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => console.log('View form:', form.id)}
              className="h-8 w-8 p-0"
            >
              <Eye className="h-4 w-4" />
            </Button>
          </div>
        );
      case 'user':
        return form.user;
      case 'user_email':
        return form.user_email;
      case 'status':
        return getStatusBadge(form.status);
      case 'delete':
        return (
          <div className="flex justify-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleDelete(form.id)}
              className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        );
      default:
        const value = form[columnKey as keyof KRCCForm];
        return value?.toString() || '';
    }
  };

  const handleDelete = (formId: number) => {
    if (window.confirm('Are you sure you want to delete this KRCC form?')) {
      setKrccForms(prevForms => prevForms.filter(form => form.id !== formId));
      toast.success('KRCC form deleted successfully');
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedItems(krccForms.map(form => form.id.toString()));
    } else {
      setSelectedItems([]);
    }
  };

  const handleActionClick = () => {
    setShowActionPanel(true);
  };

  const handleExport = async () => {
    try {
      // Simulate export functionality
      const selectedForms = selectedItems.length > 0 
        ? krccForms.filter(form => selectedItems.includes(form.id.toString()))
        : krccForms;
      
      console.log('Exporting KRCC forms:', selectedForms);
      toast.success('KRCC forms exported successfully');
    } catch (error) {
      console.error('Export failed:', error);
      toast.error('Failed to export KRCC forms');
    }
  };

  const handleFiltersClick = () => {
    setIsFilterDialogOpen(true);
  };

  const handleApplyFilters = (filters: { startDate?: Date; endDate?: Date; email?: string; circle?: string }) => {
    console.log('Applied filters:', filters);
    toast.success('Filters applied successfully');
  };

  return (
    <>
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {cardData.map((card, index) => (
            <div
              key={index}
              className="p-3 sm:p-4 rounded-lg shadow-sm h-[100px] sm:h-[132px] flex items-center gap-2 sm:gap-4 bg-[#f6f4ee]"
            >
              <div className="w-8 h-8 sm:w-12 sm:h-12 flex items-center justify-center flex-shrink-0 bg-[#C4B89D54] rounded-full">
                <card.icon className="w-4 h-4 sm:w-6 sm:h-6" style={{ color: '#C72030' }} />
              </div>
              <div className="flex flex-col min-w-0">
                <div className="text-lg sm:text-2xl font-bold leading-tight truncate">
                  {card.count}
                </div>
                <div className="text-xs sm:text-sm text-muted-foreground font-medium leading-tight">
                  {card.title}
                </div>
              </div>
            </div>
          ))}
        </div>

        {showActionPanel && (
          <SelectionPanel
            actions={[
              { label: 'Export Selected', icon: Plus, onClick: handleExport },
            ]}
            onClearSelection={() => setShowActionPanel(false)}
          />
        )}

        <div className="rounded-lg">
          <EnhancedTable 
            data={krccForms || []} 
            leftActions={
              <Button
                onClick={handleActionClick}
                className="text-white bg-[#C72030] hover:bg-[#C72030]/90"
              >
                <Plus className="w-4 h-4" />
                Action
              </Button>
            } 
            columns={columns} 
            onFilterClick={handleFiltersClick}
            renderCell={renderCell} 
            onSelectAll={handleSelectAll} 
            storageKey="krcc-forms" 
            searchTerm={searchTerm} 
            onSearchChange={setSearchTerm} 
            searchPlaceholder="Search KRCC forms..." 
            handleExport={handleExport} 
            enableExport={true} 
            exportFileName="krcc-forms" 
            pagination={true} 
            pageSize={10} 
            loading={loading} 
            enableSearch={true} 
            onRowClick={form => console.log('Row clicked:', form)} 
          />
        </div>

        <KRCCFormFilterDialog
          isOpen={isFilterDialogOpen}
          onClose={() => setIsFilterDialogOpen(false)}
          onApplyFilters={handleApplyFilters}
        />
      </div>
    </>
  );
};
