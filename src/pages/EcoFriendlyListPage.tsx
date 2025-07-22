import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { EnhancedTable } from '@/components/enhanced-table/EnhancedTable';
import { ColumnConfig } from '@/hooks/useEnhancedTable';
import { Eye, Filter, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { TextField, Select, MenuItem, FormControl, InputLabel, SelectChangeEvent } from '@mui/material';
import { RootState, AppDispatch } from '@/store/store';
import { fetchEcoFriendlyList } from '@/store/slices/ecoFriendlyListSlice';
const EcoFriendlyListPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  
  const { inventories, loading, error } = useSelector((state: RootState) => state.ecoFriendlyList);
  
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
  
  useEffect(() => {
    dispatch(fetchEcoFriendlyList());
  }, [dispatch]);
  // Transform API data to match table structure
  const ecoFriendlyData = inventories.map(item => ({
    id: item.id,
    name: item.name,
    itemId: item.id.toString(),
    code: item.code,
    serialNumber: item.serial_number,
    type: item.inventory_type === 2 ? 'Consumable' : 'Non-Consumable',
    group: '', // Not available in API
    subGroup: '', // Not available in API
    category: item.category || '',
    manufacturer: item.manufacturer || '',
    criticality: item.criticality === 0 ? 'Non-Critical' : 'Critical',
    quantity: item.quantity.toString(),
    unit: item.unit || '',
    cost: item.cost?.toString() || '',
    sacHsnCode: item.hsc_hsn_code,
    maxStockLevel: item.max_stock_level?.toString() || '',
    minStockLevel: item.min_stock_level,
    minOrderLevel: item.min_order_level,
    asset: item.asset_id?.toString() || '',
    status: item.active ? 'Active' : 'Inactive',
    expiryDate: '' // Not available in API
  }));

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
            <div onClick={() => handleStatusToggle(item.id)} className={`relative inline-flex items-center h-6 rounded-full w-11 cursor-pointer transition-colors ${item.status === 'Active' ? 'bg-green-500' : 'bg-gray-400'}`}>
              <span className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${item.status === 'Active' ? 'translate-x-6' : 'translate-x-1'}`} />
            </div>
            
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
      <EnhancedTable 
        data={ecoFriendlyData} 
        columns={columns} 
        renderCell={renderCell} 
        renderActions={renderActions} 
        storageKey="eco-friendly-list-table" 
        emptyMessage="No eco-friendly items available" 
        enableExport={true} 
        exportFileName="eco-friendly-list" 
        hideTableExport={false} 
        hideTableSearch={false} 
        hideColumnsButton={false} 
        searchPlaceholder="Search eco-friendly items..."
        loading={loading}
      />
    </div>;
};

// Eco-Friendly List Page Component
export default EcoFriendlyListPage;