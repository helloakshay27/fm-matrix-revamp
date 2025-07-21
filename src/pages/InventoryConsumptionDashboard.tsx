import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Download, Filter, Eye, X } from 'lucide-react';
import { EnhancedTable } from '@/components/enhanced-table/EnhancedTable';
import { ColumnConfig } from '@/hooks/useEnhancedTable';

const InventoryConsumptionDashboard = () => {
  const navigate = useNavigate();
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filterValues, setFilterValues] = useState({
    group: '',
    subGroup: '',
    criticality: '',
    name: ''
  });
  
  const [consumptionData] = useState([{
    id: 1,
    inventory: 'Handwash',
    stock: '0.0',
    unit: '',
    minStockLevel: '2',
    group: '-',
    subGroup: '-',
    criticality: 'Non-Critical'
  }, {
    id: 2,
    inventory: 'Notepad',
    stock: '3.0',
    unit: '',
    minStockLevel: '2',
    group: '-',
    subGroup: '-',
    criticality: 'Non-Critical'
  }, {
    id: 3,
    inventory: 'Pen',
    stock: '3.0',
    unit: '',
    minStockLevel: '3',
    group: '-',
    subGroup: '-',
    criticality: 'Non-Critical'
  }, {
    id: 4,
    inventory: 'Sanitizer',
    stock: '9.0',
    unit: '',
    minStockLevel: '1',
    group: '-',
    subGroup: '-',
    criticality: 'Non-Critical'
  }, {
    id: 5,
    inventory: 'Tissue Paper',
    stock: '4.0',
    unit: '',
    minStockLevel: '5',
    group: '-',
    subGroup: '-',
    criticality: 'Non-Critical'
  }, {
    id: 6,
    inventory: 'Phenyl',
    stock: '5.0',
    unit: '',
    minStockLevel: '1',
    group: '-',
    subGroup: '-',
    criticality: 'Non-Critical'
  }, {
    id: 7,
    inventory: 'Toilet Paper',
    stock: '5.0',
    unit: '',
    minStockLevel: '5',
    group: '-',
    subGroup: '-',
    criticality: 'Non-Critical'
  }]);

  // Define table columns for drag and drop functionality
  const columns: ColumnConfig[] = [{
    key: 'inventory',
    label: 'Inventory',
    sortable: true,
    draggable: true
  }, {
    key: 'stock',
    label: 'Stock',
    sortable: true,
    draggable: true
  }, {
    key: 'unit',
    label: 'Unit',
    sortable: true,
    draggable: true
  }, {
    key: 'minStockLevel',
    label: 'Min. Stock Level',
    sortable: true,
    draggable: true
  }, {
    key: 'group',
    label: 'Group',
    sortable: true,
    draggable: true
  }, {
    key: 'subGroup',
    label: 'Sub Group',
    sortable: true,
    draggable: true
  }, {
    key: 'criticality',
    label: 'Criticality',
    sortable: true,
    draggable: true
  }];

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

  // Handle select change
  const handleSelectChange = (field: string, value: string) => {
    setFilterValues(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handle text field change
  const handleTextChange = (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setFilterValues(prev => ({
      ...prev,
      [field]: event.target.value
    }));
  };

  // Apply filters
  const handleApplyFilter = () => {
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

  // Navigate to view page
  const handleViewItem = (item: any) => {
    navigate(`/maintenance/inventory-consumption/view/${item.id}`);
  };

  // Render actions for each row
  const renderActions = (item: any) => (
    <div className="flex gap-2 justify-center">
      <Button size="sm" variant="ghost" className="h-8 w-8 p-0 hover:bg-gray-100" onClick={() => handleViewItem(item)} title="View Details">
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
          <Button className="bg-[#C72030] text-white hover:bg-[#A01B28] transition-colors duration-200 rounded-lg px-4 py-2 h-10 text-sm font-medium flex items-center gap-2">
            <Download className="w-4 h-4" />
            Import
          </Button>
          <Button className="bg-[#C72030] text-white hover:bg-[#A01B28] transition-colors duration-200 rounded-lg px-4 py-2 h-10 text-sm font-medium flex items-center gap-2">
            Export
          </Button>
          <Button 
            variant="outline" 
            onClick={() => setIsFilterOpen(true)}
            className="border border-gray-400 text-gray-700 hover:bg-gray-50 transition-colors duration-200 rounded-lg px-4 py-2 h-10 text-sm font-medium flex items-center gap-2"
          >
            <Filter className="w-4 h-4" />
            Filter
          </Button>
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
        hideTableExport={false} 
        hideTableSearch={false} 
        hideColumnsButton={false} 
        searchPlaceholder="Search inventory items..." 
      />

      {/* Floating Filter Modal */}
      {isFilterOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            {/* Header */}
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
                  <label className="block text-sm font-medium text-gray-700">Group</label>
                  <select
                    value={filterValues.group}
                    onChange={(e) => handleSelectChange('group', e.target.value)}
                    className="w-full h-12 px-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C72030] focus:border-[#C72030] outline-none bg-white"
                  >
                    <option value="" disabled className="text-red-500">Select Group</option>
                    <option value="group1">Group 1</option>
                    <option value="group2">Group 2</option>
                    <option value="group3">Group 3</option>
                  </select>
                </div>

                {/* Sub Group */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Sub Group</label>
                  <select
                    value={filterValues.subGroup}
                    onChange={(e) => handleSelectChange('subGroup', e.target.value)}
                    className="w-full h-12 px-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C72030] focus:border-[#C72030] outline-none bg-white"
                  >
                    <option value="" disabled className="text-red-500">Select Sub Group</option>
                    <option value="subgroup1">Sub Group 1</option>
                    <option value="subgroup2">Sub Group 2</option>
                    <option value="subgroup3">Sub Group 3</option>
                  </select>
                </div>

                {/* Criticality */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Select Criticality</label>
                  <select
                    value={filterValues.criticality}
                    onChange={(e) => handleSelectChange('criticality', e.target.value)}
                    className="w-full h-12 px-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C72030] focus:border-[#C72030] outline-none bg-white"
                  >
                    <option value="" disabled className="text-red-500">Select Criticality</option>
                    <option value="critical">Critical</option>
                    <option value="non-critical">Non-Critical</option>
                    <option value="medium">Medium</option>
                  </select>
                </div>
              </div>

              {/* Second Row - Name Input */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <input
                  type="text"
                  placeholder="Enter Name"
                  value={filterValues.name}
                  onChange={handleTextChange('name')}
                  className="w-full h-12 px-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C72030] focus:border-[#C72030] outline-none"
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
          </div>
        </div>
      )}
    </div>
  );
};

export default InventoryConsumptionDashboard;