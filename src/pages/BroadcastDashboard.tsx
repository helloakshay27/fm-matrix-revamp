import React, { useState } from 'react';
import { Plus, Search, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { EnhancedTable } from '@/components/enhanced-table/EnhancedTable';
import { ColumnConfig } from '@/hooks/useEnhancedTable';
import { useNavigate } from 'react-router-dom';
const broadcastData = [{
  id: 1,
  title: 'Mock Drill',
  type: 'General',
  createdOn: '11/06/2025',
  createdBy: '',
  status: 'Published',
  expiredOn: '18/06/2025',
  expired: 'No',
  attachment: false
}, {
  id: 2,
  title: 'New Demo',
  type: 'General',
  createdOn: '29/05/2025',
  createdBy: 'Atharv Karnekar',
  status: 'Published',
  expiredOn: '30/05/2025',
  expired: 'Yes',
  attachment: false
}, {
  id: 3,
  title: 'askf',
  type: 'General',
  createdOn: '17/05/2025',
  createdBy: 'Ankit Gupta',
  status: 'Published',
  expiredOn: '19/05/2025',
  expired: 'Yes',
  attachment: false
}, {
  id: 4,
  title: 'MR',
  type: 'General',
  createdOn: '10/05/2025',
  createdBy: 'Vinayak Mane',
  status: 'Published',
  expiredOn: '11/05/2025',
  expired: 'Yes',
  attachment: false
}, {
  id: 5,
  title: 'MR',
  type: 'Personal',
  createdOn: '10/05/2025',
  createdBy: 'Vinayak Mane',
  status: 'Published',
  expiredOn: '11/05/2025',
  expired: 'Yes',
  attachment: false
}];
export const BroadcastDashboard = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const columns: ColumnConfig[] = [{
    key: 'title',
    label: 'Title',
    sortable: true,
    hideable: true,
    defaultVisible: true
  }, {
    key: 'type',
    label: 'Type',
    sortable: true,
    hideable: true,
    defaultVisible: true
  }, {
    key: 'createdOn',
    label: 'Created On',
    sortable: true,
    hideable: true,
    defaultVisible: true
  }, {
    key: 'createdBy',
    label: 'Created by',
    sortable: true,
    hideable: true,
    defaultVisible: true
  }, {
    key: 'status',
    label: 'Status',
    sortable: true,
    hideable: true,
    defaultVisible: true
  }, {
    key: 'expiredOn',
    label: 'Expired On',
    sortable: true,
    hideable: true,
    defaultVisible: true
  }, {
    key: 'expired',
    label: 'Expired',
    sortable: true,
    hideable: true,
    defaultVisible: true
  }, {
    key: 'attachment',
    label: 'Attachment',
    sortable: false,
    hideable: true,
    defaultVisible: true
  }];
  const handleViewDetails = (id: number) => {
    navigate(`/crm/broadcast/details/${id}`);
  };
  const renderCell = (item: any, columnKey: string) => {
    switch (columnKey) {
      case 'title':
        return <span className="font-medium">{item.title}</span>;
      case 'type':
        return <Badge variant={item.type === 'General' ? 'default' : 'secondary'} className={item.type === 'General' ? 'bg-red-100 text-red-800' : 'bg-orange-100 text-orange-800'}>
            {item.type}
          </Badge>;
      case 'status':
        return <Badge variant="secondary" className="bg-blue-100 text-blue-800">
            {item.status}
          </Badge>;
      case 'expired':
        return <Badge variant={item.expired === 'No' ? 'secondary' : 'destructive'} className={item.expired === 'No' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
            {item.expired}
          </Badge>;
      case 'attachment':
        return item.attachment ? <div className="w-4 h-4 bg-blue-500 rounded mx-auto"></div> : null;
      default:
        return item[columnKey];
    }
  };
  const renderActions = (item: any) => <Button variant="ghost" size="sm" onClick={() => handleViewDetails(item.id)} className="hover:bg-[#C72030]/10 hover:text-[#C72030]">
      <Eye className="w-4 h-4" />
    </Button>;
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedItems(broadcastData.map(item => item.id.toString()));
    } else {
      setSelectedItems([]);
    }
  };
  const handleSelectItem = (itemId: string, checked: boolean) => {
    if (checked) {
      setSelectedItems(prev => [...prev, itemId]);
    } else {
      setSelectedItems(prev => prev.filter(id => id !== itemId));
    }
  };

  const handleFilterClick = () => {
    setShowFilterModal(true);
  };

  const handleExport = () => {
    // Export functionality for broadcasts
    console.log('Exporting broadcast data...');
  };
  return <div className="p-6 space-y-6">
      {/* Breadcrumb */}
      <div className="text-sm text-gray-600">
        Broadcast &gt; Broadcast List
      </div>
      
      {/* Page Title */}
      <h1 className="text-2xl font-bold text-gray-900">BROADCAST LIST</h1>

      {/* Enhanced Table */}
      <EnhancedTable 
        data={broadcastData} 
        columns={columns} 
        renderCell={renderCell} 
        renderActions={renderActions} 
        storageKey="broadcast-table" 
        enableSearch={true} 
        searchTerm={searchTerm} 
        onSearchChange={setSearchTerm} 
        searchPlaceholder="Search broadcasts..." 
        enableSelection={true} 
        selectedItems={selectedItems} 
        onSelectAll={handleSelectAll} 
        onSelectItem={handleSelectItem} 
        getItemId={item => item.id.toString()} 
        emptyMessage="No broadcasts found"
        enableExport={true}
        exportFileName="broadcast-list"
        onFilterClick={handleFilterClick}
        handleExport={handleExport}
        leftActions={
          <Button className="bg-[#C72030] hover:bg-[#C72030]/90 text-white" onClick={() => navigate('/crm/broadcast/add')}>
            <Plus className="w-4 h-4 mr-2" />
            Add
          </Button>
        } 
        rightActions={
          <div className="flex items-center gap-3">
            <Button className="bg-[#C72030] hover:bg-[#C72030]/90 text-white">
              Go!
            </Button>
            <Button variant="outline" className="border-gray-300">
              Reset
            </Button>
          </div>
        } 
      />

      {/* Footer branding */}
      
    </div>;
};