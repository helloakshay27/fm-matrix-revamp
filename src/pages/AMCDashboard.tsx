
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Eye, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { EnhancedTable } from '@/components/enhanced-table/EnhancedTable';
import { ColumnConfig } from '@/hooks/useEnhancedTable';

interface AMCRecord {
  id: string;
  assetName: string;
  type: string;
  vendor: string;
  startDate: string;
  endDate: string;
  firstService: string;
  status: boolean;
  createdOn: string;
}

const initialAmcData: AMCRecord[] = [{
  id: '51016',
  assetName: '',
  type: 'Asset',
  vendor: 'MODWIN NETWORKS PVT.LTD',
  startDate: '04/04/2025',
  endDate: '02/05/2025',
  firstService: '04/04/2025',
  status: true,
  createdOn: '04/04/2025, 03:25PM'
}, {
  id: '51015',
  assetName: '',
  type: 'Asset',
  vendor: 'TBS ELECTRICAL',
  startDate: '01/04/2025',
  endDate: '10/05/2025',
  firstService: '09/04/2025',
  status: true,
  createdOn: '04/04/2025, 03:24PM'
}, {
  id: '49130',
  assetName: '',
  type: 'Asset',
  vendor: 'Mohan Khopade',
  startDate: '04/02/2025',
  endDate: '04/02/2025',
  firstService: '04/02/2025',
  status: true,
  createdOn: '04/02/2025, 04:29PM'
}, {
  id: '49120',
  assetName: '',
  type: 'Asset',
  vendor: 'MODWIN NETWORKS PVT.LTD',
  startDate: '04/02/2025',
  endDate: '04/02/2025',
  firstService: '04/02/2025',
  status: true,
  createdOn: '04/02/2025, 12:43AM'
}, {
  id: '49119',
  assetName: '',
  type: 'Asset',
  vendor: 'Mohammad Sageer',
  startDate: '04/02/2025',
  endDate: '04/02/2025',
  firstService: '04/02/2025',
  status: true,
  createdOn: '04/02/2025, 12:31AM'
}];

const columns: ColumnConfig[] = [
  { key: 'id', label: 'ID', sortable: true, defaultVisible: true, draggable: true },
  { key: 'assetName', label: 'Asset Name', sortable: true, defaultVisible: true, draggable: true },
  { key: 'type', label: 'Type', sortable: true, defaultVisible: true, draggable: true },
  { key: 'vendor', label: 'Vendor', sortable: true, defaultVisible: true, draggable: true },
  { key: 'startDate', label: 'Start Date', sortable: true, defaultVisible: true, draggable: true },
  { key: 'endDate', label: 'End Date', sortable: true, defaultVisible: true, draggable: true },
  { key: 'firstService', label: 'First Service', sortable: true, defaultVisible: true, draggable: true },
  { key: 'status', label: 'Status', sortable: true, defaultVisible: true, draggable: true },
  { key: 'createdOn', label: 'Created On', sortable: true, defaultVisible: true, draggable: true },
];

export const AMCDashboard = () => {
  const navigate = useNavigate();
  const [amcData, setAmcData] = useState<AMCRecord[]>(initialAmcData);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  const handleAddClick = () => {
    navigate('/maintenance/amc/add');
  };

  const handleViewDetails = (id: string) => {
    navigate(`/maintenance/amc/details/${id}`);
  };

  const handleStatusToggle = (id: string) => {
    const updatedAmcData = amcData.map(amc => 
      amc.id === id ? { ...amc, status: !amc.status } : amc
    );
    setAmcData(updatedAmcData);
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedItems(amcData.map(item => item.id));
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

  const handleBulkDelete = (selectedItems: AMCRecord[]) => {
    const selectedIds = selectedItems.map(item => item.id);
    setAmcData(prev => prev.filter(item => !selectedIds.includes(item.id)));
    setSelectedItems([]);
  };

  const renderCell = (item: AMCRecord, columnKey: string) => {
    switch (columnKey) {
      case 'id':
        return <span className="font-medium">{item.id}</span>;
      case 'assetName':
        return item.assetName || '-';
      case 'type':
        return item.type;
      case 'vendor':
        return item.vendor;
      case 'startDate':
        return item.startDate;
      case 'endDate':
        return item.endDate;
      case 'firstService':
        return item.firstService;
      case 'status':
        return (
          <div className="flex items-center">
            <div 
              className={`relative inline-flex items-center h-6 rounded-full w-11 cursor-pointer transition-colors ${
                item.status ? 'bg-green-500' : 'bg-gray-300'
              }`} 
              onClick={() => handleStatusToggle(item.id)}
            >
              <span 
                className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${
                  item.status ? 'translate-x-6' : 'translate-x-1'
                }`} 
              />
            </div>
          </div>
        );
      case 'createdOn':
        return item.createdOn;
      default:
        return '-';
    }
  };

  const renderActions = (item: AMCRecord) => (
    <Button 
      variant="ghost" 
      size="sm" 
      onClick={() => handleViewDetails(item.id)}
    >
      <Eye className="w-4 h-4" />
    </Button>
  );

  const bulkActions = [
    {
      label: 'Delete Selected',
      icon: Trash2,
      variant: 'destructive' as const,
      onClick: handleBulkDelete,
    },
  ];

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <p className="text-[#1a1a1a] opacity-70 mb-2">AMC &gt; AMC List</p>
        <h1 className="font-work-sans font-semibold text-base sm:text-2xl lg:text-[26px] leading-auto tracking-normal text-[#1a1a1a]">
          AMC LIST
        </h1>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-3 mb-6">
        <Button 
          onClick={handleAddClick} 
          className="text-white bg-[#C72030] hover:bg-[#C72030]/90"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add
        </Button>
      </div>

      {/* Enhanced Table with drag and drop, sorting, and row selection */}
      <EnhancedTable
        data={amcData}
        columns={columns}
        renderCell={renderCell}
        renderActions={renderActions}
        onRowClick={(item) => handleViewDetails(item.id)}
        selectable={true}
        selectedItems={selectedItems}
        onSelectAll={handleSelectAll}
        onSelectItem={handleSelectItem}
        storageKey="amc-dashboard-table"
        emptyMessage="No AMC records found"
        searchPlaceholder="Search AMC records..."
        enableExport={true}
        exportFileName="amc-records"
        bulkActions={bulkActions}
        showBulkActions={true}
        pagination={true}
        pageSize={10}
      />
    </div>
  );
};
