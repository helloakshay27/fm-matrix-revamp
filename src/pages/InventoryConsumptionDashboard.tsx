import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Download, Upload, Filter, Eye, Edit2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { EnhancedTable } from '@/components/enhanced-table/EnhancedTable';
import { ColumnConfig } from '@/hooks/useEnhancedTable';

const InventoryConsumptionDashboard = () => {
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
          <Button 
            variant="outline"
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
        hideTableExport={true}
        hideTableSearch={true}
        hideColumnsButton={false}
      />
    </div>
  );
};

export default InventoryConsumptionDashboard;