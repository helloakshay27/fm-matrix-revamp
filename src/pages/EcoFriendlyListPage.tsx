import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { EnhancedTable } from '@/components/enhanced-table/EnhancedTable';
import { ColumnConfig } from '@/hooks/useEnhancedTable';
import { Eye, Filter, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { TextField, Select, MenuItem, FormControl, InputLabel, SelectChangeEvent } from '@mui/material';
const EcoFriendlyListPage = () => {
  const navigate = useNavigate();
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filterValues, setFilterValues] = useState({
    type: '',
    group: '',
    category: '',
    manufacturer: '',
    criticality: '',
    status: ''
  });

  // Handle status toggle
  const handleStatusToggle = (id: number) => {
    console.log('Status toggle for eco-friendly item ID:', id);
    // Here you would typically update the status in your state/API
  };

  // Sample data matching the table structure from the image
  const ecoFriendlyData = [{
    id: 1,
    name: 'Paper',
    itemId: '61775',
    code: '55655544',
    serialNumber: '556555442',
    type: 'Consumable',
    group: '',
    subGroup: '',
    category: '',
    manufacturer: '',
    criticality: 'Non-Critical',
    quantity: '1023.0',
    unit: '',
    cost: '',
    sacHsnCode: '',
    maxStockLevel: '',
    minStockLevel: '',
    minOrderLevel: '20',
    asset: '',
    status: 'Active',
    expiryDate: ''
  }, {
    id: 2,
    name: 'Table',
    itemId: '7621',
    code: '1',
    serialNumber: '1',
    type: 'Consumable',
    group: '',
    subGroup: '',
    category: '',
    manufacturer: '',
    criticality: 'Non-Critical',
    quantity: '15.0',
    unit: '',
    cost: '',
    sacHsnCode: '',
    maxStockLevel: '5',
    minStockLevel: '10',
    minOrderLevel: '',
    asset: '',
    status: 'Active',
    expiryDate: ''
  }, {
    id: 3,
    name: 'Table',
    itemId: '7513',
    code: '1101',
    serialNumber: '5521',
    type: 'Consumable',
    group: 'Demo',
    subGroup: '',
    category: '',
    manufacturer: '',
    criticality: 'Non-Critical',
    quantity: '4.0',
    unit: 'Piece',
    cost: '10.0',
    sacHsnCode: '1 73021010',
    maxStockLevel: '5',
    minStockLevel: '5',
    minOrderLevel: '',
    asset: '',
    status: 'Active',
    expiryDate: '10/06/2025'
  }];

  // Column configuration matching the image
  const columns: ColumnConfig[] = [{
    key: 'name',
    label: 'Name',
    sortable: true
  }, {
    key: 'itemId',
    label: 'ID',
    sortable: true
  }, {
    key: 'code',
    label: 'Code',
    sortable: true
  }, {
    key: 'serialNumber',
    label: 'Serial Number',
    sortable: true
  }, {
    key: 'type',
    label: 'Type',
    sortable: true
  }, {
    key: 'group',
    label: 'Group',
    sortable: true
  }, {
    key: 'subGroup',
    label: 'Sub Group',
    sortable: true
  }, {
    key: 'category',
    label: 'Category',
    sortable: true
  }, {
    key: 'manufacturer',
    label: 'Manufacturer',
    sortable: true
  }, {
    key: 'criticality',
    label: 'Criticality',
    sortable: true
  }, {
    key: 'quantity',
    label: 'Quantity',
    sortable: true
  }, {
    key: 'unit',
    label: 'Unit',
    sortable: true
  }, {
    key: 'cost',
    label: 'Cost',
    sortable: true
  }, {
    key: 'sacHsnCode',
    label: 'SAC/HSN Code',
    sortable: true
  }, {
    key: 'maxStockLevel',
    label: 'Max. Stock Level',
    sortable: true
  }, {
    key: 'minStockLevel',
    label: 'Min. Stock Level',
    sortable: true
  }, {
    key: 'minOrderLevel',
    label: 'Min.Order Level',
    sortable: true
  }, {
    key: 'asset',
    label: 'Asset',
    sortable: true
  }, {
    key: 'status',
    label: 'Status',
    sortable: true
  }, {
    key: 'expiryDate',
    label: 'Expiry Date',
    sortable: true
  }];
  const handleFilterChange = (field: string, value: string) => {
    setFilterValues(prev => ({
      ...prev,
      [field]: value
    }));
  };
  const clearFilters = () => {
    setFilterValues({
      type: '',
      group: '',
      category: '',
      manufacturer: '',
      criticality: '',
      status: ''
    });
  };

  // Navigate to view/details page
  const handleViewItem = (item: any) => {
    navigate(`/maintenance/eco-friendly-list/view/${item.id}`);
  };

  // Custom cell renderer
  const renderCell = (item: any, columnKey: string) => {
    switch (columnKey) {
      case 'status':
        return <div className="flex items-center">
            <div 
              onClick={() => handleStatusToggle(item.id)} 
              className={`relative inline-flex items-center h-6 rounded-full w-11 cursor-pointer transition-colors ${
                item.status === 'Active' ? 'bg-green-500' : 'bg-gray-400'
              }`}
            >
              <span className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${
                item.status === 'Active' ? 'translate-x-6' : 'translate-x-1'
              }`} />
            </div>
            <span className={`ml-2 text-sm ${item.status === 'Active' ? 'text-green-600' : 'text-gray-600'}`}>
              {item.status}
            </span>
          </div>;
      default:
        return item[columnKey] || '';
    }
  };

  // Render actions for each row
  const renderActions = (item: any) => <div className="flex items-center space-x-2">
      <Button variant="ghost" size="sm" onClick={() => handleViewItem(item)} className="h-8 w-8 p-0">
        <Eye className="h-4 w-4" />
      </Button>
    </div>;
  return <div className="p-6 space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Eco-Friendly List</h1>
        
      </div>

      {/* Enhanced Table */}
      <EnhancedTable data={ecoFriendlyData} columns={columns} renderCell={renderCell} renderActions={renderActions} storageKey="eco-friendly-list-table" emptyMessage="No eco-friendly items available" enableExport={true} exportFileName="eco-friendly-list" hideTableExport={false} hideTableSearch={false} hideColumnsButton={false} searchPlaceholder="Search eco-friendly items..." />
    </div>;
};

// Eco-Friendly List Page Component
export default EcoFriendlyListPage;