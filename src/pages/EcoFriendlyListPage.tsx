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

  // Sample data matching the table structure from the image
  const ecoFriendlyData = [
    {
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
    },
    {
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
    },
    {
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
    }
  ];

  // Column configuration matching the image
  const columns: ColumnConfig[] = [
    { key: 'name', label: 'Name', sortable: true },
    { key: 'itemId', label: 'ID', sortable: true },
    { key: 'code', label: 'Code', sortable: true },
    { key: 'serialNumber', label: 'Serial Number', sortable: true },
    { key: 'type', label: 'Type', sortable: true },
    { key: 'group', label: 'Group', sortable: true },
    { key: 'subGroup', label: 'Sub Group', sortable: true },
    { key: 'category', label: 'Category', sortable: true },
    { key: 'manufacturer', label: 'Manufacturer', sortable: true },
    { key: 'criticality', label: 'Criticality', sortable: true },
    { key: 'quantity', label: 'Quantity', sortable: true },
    { key: 'unit', label: 'Unit', sortable: true },
    { key: 'cost', label: 'Cost', sortable: true },
    { key: 'sacHsnCode', label: 'SAC/HSN Code', sortable: true },
    { key: 'maxStockLevel', label: 'Max. Stock Level', sortable: true },
    { key: 'minStockLevel', label: 'Min. Stock Level', sortable: true },
    { key: 'minOrderLevel', label: 'Min.Order Level', sortable: true },
    { key: 'asset', label: 'Asset', sortable: true },
    { key: 'status', label: 'Status', sortable: true },
    { key: 'expiryDate', label: 'Expiry Date', sortable: true }
  ];

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
        return (
          <div className="flex items-center">
            <div className={`w-3 h-3 rounded-full mr-2 ${
              item.status === 'Active' ? 'bg-green-500' : 'bg-gray-400'
            }`}></div>
            <span className={item.status === 'Active' ? 'text-green-600' : 'text-gray-600'}>
              {item.status}
            </span>
          </div>
        );
      default:
        return item[columnKey] || '';
    }
  };

  // Render actions for each row
  const renderActions = (item: any) => (
    <div className="flex items-center space-x-2">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => handleViewItem(item)}
        className="h-8 w-8 p-0"
      >
        <Eye className="h-4 w-4" />
      </Button>
    </div>
  );

  return (
    <div className="p-6 space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center space-x-2 text-sm text-gray-600">
        <span>Inventories</span>
        <span>{">"}</span>
        <span className="text-gray-900 font-medium">Eco-Friendly List</span>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Eco-Friendly List</h1>
        <div className="flex items-center space-x-3">
          <Dialog open={isFilterOpen} onOpenChange={setIsFilterOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="flex items-center space-x-2">
                <Filter className="w-4 h-4" />
                <span>Filter</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold">Filter Options</h2>
                </div>

                <div className="space-y-4">
                  <FormControl fullWidth size="small">
                    <InputLabel>Type</InputLabel>
                    <Select
                      value={filterValues.type}
                      label="Type"
                      onChange={(e: SelectChangeEvent) => handleFilterChange('type', e.target.value)}
                    >
                      <MenuItem value="">All</MenuItem>
                      <MenuItem value="Consumable">Consumable</MenuItem>
                      <MenuItem value="Non-Consumable">Non-Consumable</MenuItem>
                    </Select>
                  </FormControl>

                  <FormControl fullWidth size="small">
                    <InputLabel>Criticality</InputLabel>
                    <Select
                      value={filterValues.criticality}
                      label="Criticality"
                      onChange={(e: SelectChangeEvent) => handleFilterChange('criticality', e.target.value)}
                    >
                      <MenuItem value="">All</MenuItem>
                      <MenuItem value="Critical">Critical</MenuItem>
                      <MenuItem value="Non-Critical">Non-Critical</MenuItem>
                    </Select>
                  </FormControl>

                  <FormControl fullWidth size="small">
                    <InputLabel>Status</InputLabel>
                    <Select
                      value={filterValues.status}
                      label="Status"
                      onChange={(e: SelectChangeEvent) => handleFilterChange('status', e.target.value)}
                    >
                      <MenuItem value="">All</MenuItem>
                      <MenuItem value="Active">Active</MenuItem>
                      <MenuItem value="Inactive">Inactive</MenuItem>
                    </Select>
                  </FormControl>

                  <TextField
                    fullWidth
                    size="small"
                    label="Group"
                    value={filterValues.group}
                    onChange={(e) => handleFilterChange('group', e.target.value)}
                  />

                  <TextField
                    fullWidth
                    size="small"
                    label="Category"
                    value={filterValues.category}
                    onChange={(e) => handleFilterChange('category', e.target.value)}
                  />

                  <TextField
                    fullWidth
                    size="small"
                    label="Manufacturer"
                    value={filterValues.manufacturer}
                    onChange={(e) => handleFilterChange('manufacturer', e.target.value)}
                  />
                </div>

                <div className="flex space-x-3">
                  <Button 
                    variant="outline" 
                    className="flex-1"
                    onClick={clearFilters}
                  >
                    Clear All
                  </Button>
                  <Button 
                    className="flex-1"
                    onClick={() => setIsFilterOpen(false)}
                  >
                    Apply Filters
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          <Button className="flex items-center space-x-2">
            <Plus className="w-4 h-4" />
            <span>Add Item</span>
          </Button>
        </div>
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
      />
    </div>
  );
};

// Eco-Friendly List Page Component
export default EcoFriendlyListPage;