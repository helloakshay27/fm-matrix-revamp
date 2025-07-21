import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Download, Upload, Filter, Eye, Edit2, X, ChevronDown } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { EnhancedTable } from '@/components/enhanced-table/EnhancedTable';
import { ColumnConfig } from '@/hooks/useEnhancedTable';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const InventoryConsumptionDashboard = () => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filterValues, setFilterValues] = useState({
    group: '',
    subGroup: '',
    criticality: '',
    name: ''
  });

  const [consumptionData] = useState([
    {
      id: 1,
      inventory: 'Handwash',
      stock: '0.0',
      unit: '',
      minStockLevel: '2',
      group: '-',
      subGroup: '-',
      criticality: 'Non-Critical'
    },
    {
      id: 2,
      inventory: 'Notepad',
      stock: '3.0',
      unit: '',
      minStockLevel: '2',
      group: '-',
      subGroup: '-',
      criticality: 'Non-Critical'
    },
    {
      id: 3,
      inventory: 'Pen',
      stock: '3.0',
      unit: '',
      minStockLevel: '3',
      group: '-',
      subGroup: '-',
      criticality: 'Non-Critical'
    },
    {
      id: 4,
      inventory: 'Sanitizer',
      stock: '9.0',
      unit: '',
      minStockLevel: '1',
      group: '-',
      subGroup: '-',
      criticality: 'Non-Critical'
    },
    {
      id: 5,
      inventory: 'Tissue Paper',
      stock: '4.0',
      unit: '',
      minStockLevel: '5',
      group: '-',
      subGroup: '-',
      criticality: 'Non-Critical'
    },
    {
      id: 6,
      inventory: 'Phenyl',
      stock: '5.0',
      unit: '',
      minStockLevel: '1',
      group: '-',
      subGroup: '-',
      criticality: 'Non-Critical'
    },
    {
      id: 7,
      inventory: 'Toilet Paper',
      stock: '5.0',
      unit: '',
      minStockLevel: '5',
      group: '-',
      subGroup: '-',
      criticality: 'Non-Critical'
    }
  ]);

  // Define table columns for drag and drop functionality
  const columns: ColumnConfig[] = [
    {
      key: 'inventory',
      label: 'Inventory',
      sortable: true,
      draggable: true
    },
    {
      key: 'stock',
      label: 'Stock',
      sortable: true,
      draggable: true
    },
    {
      key: 'unit',
      label: 'Unit',
      sortable: true,
      draggable: true
    },
    {
      key: 'minStockLevel',
      label: 'Min. Stock Level',
      sortable: true,
      draggable: true
    },
    {
      key: 'group',
      label: 'Group',
      sortable: true,
      draggable: true
    },
    {
      key: 'subGroup',
      label: 'Sub Group',
      sortable: true,
      draggable: true
    },
    {
      key: 'criticality',
      label: 'Criticality',
      sortable: true,
      draggable: true
    }
  ];

  // Render cell content
  const renderCell = (item: any, columnKey: string) => {
    const value = item[columnKey];
    
    if (columnKey === 'criticality') {
      return <span className="text-sm text-gray-600">{value}</span>;
    }
    
    if (columnKey === 'inventory') {
      return <span className="font-medium">{value}</span>;
    }
    
    return value || '-';
  };

  // Handle filter changes
  const handleFilterChange = (field: string, value: string) => {
    setFilterValues(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Apply filters
  const handleApplyFilter = () => {
    // Filter logic would go here
    console.log('Applied filters:', filterValues);
    setIsFilterOpen(false);
  };

  // Reset filters
  const handleResetFilter = () => {
    setFilterValues({
      group: '',
      subGroup: '',
      criticality: '',
      name: ''
    });
  };

  // Render actions for each row
  const renderActions = (item: any) => (
    <div className="flex gap-2 justify-center">
      <Button 
        size="sm"
        variant="ghost"
        className="h-8 w-8 p-0 hover:bg-gray-100"
      >
        <Edit2 className="w-4 h-4 text-gray-600" />
      </Button>
      <Button 
        size="sm"
        variant="ghost"
        className="h-8 w-8 p-0 hover:bg-gray-100"
      >
        <Eye className="w-4 h-4 text-gray-600" />
      </Button>
    </div>
  );

  return (
    <div className="p-6 space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center space-x-2 text-sm text-gray-600">
        <span>Inventory Consumption</span>
        <span>{">"}</span>
        <span className="text-gray-900 font-medium">Consumption List</span>
      </div>

      {/* Header */}
      <div className="space-y-4">
        <h1 className="text-2xl font-bold text-gray-900">Consumption LIST</h1>
        
        {/* Action buttons */}
        <div className="flex gap-3">
          <Button 
            className="bg-[#C72030] text-white hover:bg-[#A01B28] transition-colors duration-200 rounded-lg px-4 py-2 h-10 text-sm font-medium flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Import
          </Button>
          <Button 
            className="bg-[#C72030] text-white hover:bg-[#A01B28] transition-colors duration-200 rounded-lg px-4 py-2 h-10 text-sm font-medium flex items-center gap-2"
          >
            Export
          </Button>
          <Dialog open={isFilterOpen} onOpenChange={setIsFilterOpen}>
            <DialogTrigger asChild>
              <Button 
                variant="outline"
                className="border border-gray-400 text-gray-700 hover:bg-gray-50 transition-colors duration-200 rounded-lg px-4 py-2 h-10 text-sm font-medium flex items-center gap-2"
              >
                <Filter className="w-4 h-4" />
                Filter
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl p-0 gap-0">
              {/* Custom Header */}
              <div className="flex items-center justify-between p-6 border-b">
                <h2 className="text-lg font-semibold text-gray-900">FILTER BY</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsFilterOpen(false)}
                  className="h-6 w-6 p-0 hover:bg-gray-100"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              {/* Filter Content */}
              <div className="p-6 space-y-6">
                {/* First Row - Three Dropdowns */}
                <div className="grid grid-cols-3 gap-6">
                  {/* Group */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-900">Group</label>
                    <Select 
                      value={filterValues.group} 
                      onValueChange={(value) => handleFilterChange('group', value)}
                    >
                      <SelectTrigger className="w-full h-12 border border-gray-300 rounded-lg">
                        <SelectValue 
                          placeholder="Select Group"
                          className="text-red-500 placeholder-red-500"
                        />
                      </SelectTrigger>
                      <SelectContent className="bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                        <SelectItem value="group1">Group 1</SelectItem>
                        <SelectItem value="group2">Group 2</SelectItem>
                        <SelectItem value="group3">Group 3</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Sub Group */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-900">Sub Group</label>
                    <Select 
                      value={filterValues.subGroup} 
                      onValueChange={(value) => handleFilterChange('subGroup', value)}
                    >
                      <SelectTrigger className="w-full h-12 border border-gray-300 rounded-lg">
                        <SelectValue 
                          placeholder="Select Sub Group"
                          className="text-red-500 placeholder-red-500"
                        />
                      </SelectTrigger>
                      <SelectContent className="bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                        <SelectItem value="subgroup1">Sub Group 1</SelectItem>
                        <SelectItem value="subgroup2">Sub Group 2</SelectItem>
                        <SelectItem value="subgroup3">Sub Group 3</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Criticality */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-900">Select Criticality</label>
                    <Select 
                      value={filterValues.criticality} 
                      onValueChange={(value) => handleFilterChange('criticality', value)}
                    >
                      <SelectTrigger className="w-full h-12 border border-gray-300 rounded-lg">
                        <SelectValue 
                          placeholder="Select Criticality"
                          className="text-red-500 placeholder-red-500"
                        />
                      </SelectTrigger>
                      <SelectContent className="bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                        <SelectItem value="critical">Critical</SelectItem>
                        <SelectItem value="non-critical">Non-Critical</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Second Row - Name Input */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-900">Name</label>
                  <Input
                    type="text"
                    placeholder="Enter Name"
                    value={filterValues.name}
                    onChange={(e) => handleFilterChange('name', e.target.value)}
                    className="w-full h-12 border border-gray-300 rounded-lg px-4 placeholder-gray-400"
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end gap-4 pt-6">
                  <Button
                    variant="outline"
                    onClick={handleResetFilter}
                    className="px-8 py-3 h-12 border-2 border-gray-800 text-gray-800 hover:bg-gray-50 rounded-lg font-medium"
                  >
                    Reset
                  </Button>
                  <Button
                    onClick={handleApplyFilter}
                    className="px-8 py-3 h-12 bg-[#6B2C91] text-white hover:bg-[#5A2479] rounded-lg font-medium"
                  >
                    Apply
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Enhanced Table with Drag and Drop */}
      <EnhancedTable
        data={consumptionData}
        columns={columns}
        renderCell={renderCell}
        renderActions={renderActions}
        storageKey="inventory-consumption-table"
        emptyMessage="No consumption data available"
        enableExport={true}
        exportFileName="inventory-consumption"
        hideTableExport={true}
        hideTableSearch={true}
        hideColumnsButton={false}
      />
    </div>
  );
};

export default InventoryConsumptionDashboard;