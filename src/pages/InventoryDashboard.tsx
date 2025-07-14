import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Upload, FileText, Filter, Eye, Plus, Package, AlertTriangle, CheckCircle, TrendingUp, DollarSign, BarChart3 } from 'lucide-react';
import { BulkUploadDialog } from '@/components/BulkUploadDialog';
import { InventoryFilterDialog } from '@/components/InventoryFilterDialog';
import { EnhancedTable } from '@/components/enhanced-table/EnhancedTable';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { InventorySelector } from '@/components/InventorySelector';
import { RecentInventorySidebar } from '@/components/RecentInventorySidebar';

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const inventoryData = [
  {
    id: '97100',
    name: 'test12',
    referenceNumber: '123987',
    code: '',
    serialNumber: '',
    type: '',
    group: 'CCTV',
    subGroup: 'CCTV Camera',
    category: '',
    manufacturer: '',
    criticality: 'Critical',
    quantity: '8.0',
    active: 'Active',
    unit: '',
    cost: '',
    sacHsnCode: '',
    maxStockLevel: '',
    minStockLevel: '',
    minOrderLevel: '10'
  },
  {
    id: '96857',
    name: 'Test 1234',
    referenceNumber: '123',
    code: '',
    serialNumber: '',
    type: '',
    group: '',
    subGroup: '',
    category: '',
    manufacturer: '',
    criticality: 'Critical',
    quantity: '0.0',
    active: 'Active',
    unit: '',
    cost: '',
    sacHsnCode: '',
    maxStockLevel: '',
    minStockLevel: '',
    minOrderLevel: '10'
  },
  {
    id: '96856',
    name: 'Test Abhi',
    referenceNumber: '123',
    code: '',
    serialNumber: '',
    type: '',
    group: '',
    subGroup: '',
    category: '',
    manufacturer: '',
    criticality: 'Critical',
    quantity: '10.0',
    active: 'Active',
    unit: '',
    cost: '',
    sacHsnCode: '',
    maxStockLevel: '',
    minStockLevel: '',
    minOrderLevel: '10'
  },
  {
    id: '96855',
    name: 'Test Tap',
    referenceNumber: '52666',
    code: '5566',
    serialNumber: '',
    type: '',
    group: 'Daikin',
    subGroup: 'Daikin AC',
    category: '',
    manufacturer: '',
    criticality: 'Non-Critical',
    quantity: '',
    active: 'Active',
    unit: '100.0',
    cost: '',
    sacHsnCode: '',
    maxStockLevel: '',
    minStockLevel: '',
    minOrderLevel: ''
  },
  {
    id: '96834',
    name: 'test',
    referenceNumber: 'cp/01',
    code: '',
    serialNumber: '',
    type: '',
    group: '',
    subGroup: '',
    category: '',
    manufacturer: '',
    criticality: 'Non-Critical',
    quantity: '1.0',
    active: 'Active',
    unit: '',
    cost: '1',
    sacHsnCode: '',
    maxStockLevel: '1',
    minStockLevel: '',
    minOrderLevel: '1'
  },
  {
    id: '96067',
    name: 'Laptop',
    referenceNumber: '1234565454',
    code: 'abc01',
    serialNumber: '',
    type: '',
    group: 'Electronic Devices',
    subGroup: 'Laptops',
    category: '',
    manufacturer: '',
    criticality: 'Non-Critical',
    quantity: '46.0',
    active: 'Active',
    unit: 'Piece',
    cost: '20000.0',
    sacHsnCode: '',
    maxStockLevel: '50',
    minStockLevel: '10',
    minOrderLevel: ''
  },
  {
    id: '69988',
    name: 'Drainex Power',
    referenceNumber: '1234565454',
    code: '',
    serialNumber: '',
    type: 'Consumable',
    group: '',
    subGroup: 'Housekeeping',
    category: '',
    manufacturer: '',
    criticality: 'Non-Critical',
    quantity: '64.0',
    active: 'Active',
    unit: 'Piece',
    cost: '1800.0',
    sacHsnCode: '',
    maxStockLevel: '10',
    minStockLevel: '5',
    minOrderLevel: '3'
  }
];

export const InventoryDashboard = () => {
  const navigate = useNavigate();
  const [showBulkUpload, setShowBulkUpload] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedOptions, setSelectedOptions] = useState<string[]>(['consumption-green', 'consumption-report-green', 'inventory', 'inventory-trends']);
  const pageSize = 5;

  // Calculate pagination
  const totalPages = Math.ceil(inventoryData.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedData = inventoryData.slice(startIndex, startIndex + pageSize);

  // Analytics calculations
  const totalItems = inventoryData.length;
  const criticalItems = inventoryData.filter(item => item.criticality === 'Critical').length;
  const nonCriticalItems = inventoryData.filter(item => item.criticality === 'Non-Critical').length;
  const activeItems = inventoryData.filter(item => item.active === 'Active').length;
  const lowStockItems = inventoryData.filter(item => {
    const quantity = parseFloat(item.quantity) || 0;
    const minStock = parseFloat(item.minStockLevel) || 0;
    return minStock > 0 && quantity <= minStock;
  }).length;
  const highValueItems = inventoryData.filter(item => {
    const cost = parseFloat(item.cost) || 0;
    return cost > 10000;
  }).length;

  // Chart data
  const criticalityData = [
    { name: 'Critical', value: criticalItems, fill: 'hsl(var(--destructive))' },
    { name: 'Non-Critical', value: nonCriticalItems, fill: 'hsl(var(--muted))' }
  ];

  const groupData = inventoryData.reduce((acc, item) => {
    const group = item.group || 'Unassigned';
    acc[group] = (acc[group] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const groupChartData = Object.entries(groupData).map(([name, value]) => ({
    name,
    value,
    fill: `hsl(${Math.random() * 360}, 70%, 50%)`
  }));

  const stockStatusData = [
    { name: 'Low Stock', value: lowStockItems, fill: 'hsl(var(--destructive))' },
    { name: 'Normal Stock', value: totalItems - lowStockItems, fill: 'hsl(var(--primary))' }
  ];

  const handleViewItem = (itemId: string) => {
    navigate(`/maintenance/inventory/details/${itemId}`);
  };

  const handleAddInventory = () => {
    navigate('/maintenance/inventory/add');
  };

  const columns = [
    { key: 'name', label: 'Name', sortable: true },
    { key: 'id', label: 'ID', sortable: true },
    { key: 'referenceNumber', label: 'Reference Number', sortable: true },
    { key: 'code', label: 'Code', sortable: true },
    { key: 'serialNumber', label: 'Serial Number', sortable: true },
    { key: 'type', label: 'Type', sortable: true },
    { key: 'group', label: 'Group', sortable: true },
    { key: 'subGroup', label: 'Sub Group', sortable: true },
    { key: 'category', label: 'Category', sortable: true },
    { key: 'manufacturer', label: 'Manufacturer', sortable: true },
    { key: 'criticality', label: 'Criticality', sortable: true },
    { key: 'quantity', label: 'Quantity', sortable: true },
    { key: 'active', label: 'Active', sortable: true },
    { key: 'unit', label: 'Unit', sortable: true },
    { key: 'cost', label: 'Cost', sortable: true },
    { key: 'sacHsnCode', label: 'SAC/HSN Code', sortable: true },
    { key: 'maxStockLevel', label: 'Max Stock', sortable: true },
    { key: 'minStockLevel', label: 'Min Stock', sortable: true },
    { key: 'minOrderLevel', label: 'Min Order', sortable: true }
  ];

  const bulkActions = [
    {
      label: 'Print QR Codes',
      icon: FileText,
      onClick: (selectedItems) => {
        alert(`Printing QR codes for ${selectedItems.length} items`);
      }
    }
  ];

  const renderCustomActions = () => (
    <div className="flex flex-wrap gap-3">
      <Button onClick={handleAddInventory} className="bg-primary text-primary-foreground hover:bg-primary/90">
        <Plus className="w-4 h-4 mr-2" /> Add
      </Button>
      <Button onClick={() => setShowBulkUpload(true)} className="bg-primary text-primary-foreground hover:bg-primary/90">
        <Upload className="w-4 h-4 mr-2" /> Import
      </Button>
      <Button onClick={() => setShowFilter(true)} variant="outline">
        <Filter className="w-4 h-4 mr-2" /> Filters
      </Button>
    </div>
  );

  const renderRowActions = (item) => (
    <Button variant="ghost" size="sm" onClick={() => handleViewItem(item.id)}>
      <Eye className="w-4 h-4" />
    </Button>
  );

  const renderCell = (item, columnKey) => {
    if (columnKey === 'criticality') {
      return (
        <span className={`px-2 py-1 rounded text-xs ${
          item.criticality === 'Critical' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'
        }`}>
          {item.criticality}
        </span>
      );
    }
    if (columnKey === 'active') {
      return (
        <span className="px-2 py-1 rounded text-xs bg-green-100 text-green-700">
          {item.active}
        </span>
      );
    }
    return item[columnKey];
  };

  const renderPaginationItems = () => {
    const items = [];
    const showEllipsis = totalPages > 7;
    
    if (showEllipsis) {
      // Show first page
      items.push(
        <PaginationItem key={1}>
          <PaginationLink 
            onClick={() => setCurrentPage(1)}
            isActive={currentPage === 1}
          >
            1
          </PaginationLink>
        </PaginationItem>
      );

      // Show ellipsis or pages 2-3
      if (currentPage > 4) {
        items.push(
          <PaginationItem key="ellipsis1">
            <PaginationEllipsis />
          </PaginationItem>
        );
      } else {
        for (let i = 2; i <= Math.min(3, totalPages - 1); i++) {
          items.push(
            <PaginationItem key={i}>
              <PaginationLink 
                onClick={() => setCurrentPage(i)}
                isActive={currentPage === i}
              >
                {i}
              </PaginationLink>
            </PaginationItem>
          );
        }
      }

      // Show current page area
      if (currentPage > 3 && currentPage < totalPages - 2) {
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          items.push(
            <PaginationItem key={i}>
              <PaginationLink 
                onClick={() => setCurrentPage(i)}
                isActive={currentPage === i}
              >
                {i}
              </PaginationLink>
            </PaginationItem>
          );
        }
      }

      // Show ellipsis or pages before last
      if (currentPage < totalPages - 3) {
        items.push(
          <PaginationItem key="ellipsis2">
            <PaginationEllipsis />
          </PaginationItem>
        );
      } else {
        for (let i = Math.max(totalPages - 2, 2); i < totalPages; i++) {
          if (!items.find(item => item.key === i)) {
            items.push(
              <PaginationItem key={i}>
                <PaginationLink 
                  onClick={() => setCurrentPage(i)}
                  isActive={currentPage === i}
                >
                  {i}
                </PaginationLink>
              </PaginationItem>
            );
          }
        }
      }

      // Show last page
      if (totalPages > 1) {
        items.push(
          <PaginationItem key={totalPages}>
            <PaginationLink 
              onClick={() => setCurrentPage(totalPages)}
              isActive={currentPage === totalPages}
            >
              {totalPages}
            </PaginationLink>
          </PaginationItem>
        );
      }
    } else {
      // Show all pages if total is 7 or less
      for (let i = 1; i <= totalPages; i++) {
        items.push(
          <PaginationItem key={i}>
            <PaginationLink 
              onClick={() => setCurrentPage(i)}
              isActive={currentPage === i}
            >
              {i}
            </PaginationLink>
          </PaginationItem>
        );
      }
    }

    return items;
  };

  const renderAnalyticsCards = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      <div className="bg-gradient-to-br from-blue-500/20 to-purple-600/20 rounded-xl p-6 border border-primary/20">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Total Items</p>
            <p className="text-3xl font-bold text-foreground">{totalItems}</p>
          </div>
          <Package className="h-8 w-8 text-primary" />
        </div>
      </div>

      <div className="bg-gradient-to-br from-red-500/20 to-orange-600/20 rounded-xl p-6 border border-primary/20">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Critical Items</p>
            <p className="text-3xl font-bold text-foreground">{criticalItems}</p>
          </div>
          <AlertTriangle className="h-8 w-8 text-destructive" />
        </div>
      </div>

      <div className="bg-gradient-to-br from-green-500/20 to-emerald-600/20 rounded-xl p-6 border border-primary/20">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Non-Critical Items</p>
            <p className="text-3xl font-bold text-foreground">{nonCriticalItems}</p>
          </div>
          <CheckCircle className="h-8 w-8 text-green-600" />
        </div>
      </div>

      <div className="bg-gradient-to-br from-green-400/20 to-blue-500/20 rounded-xl p-6 border border-primary/20">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Active Items</p>
            <p className="text-3xl font-bold text-foreground">{activeItems}</p>
          </div>
          <TrendingUp className="h-8 w-8 text-green-600" />
        </div>
      </div>

      <div className="bg-gradient-to-br from-orange-500/20 to-red-600/20 rounded-xl p-6 border border-primary/20">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Low Stock Items</p>
            <p className="text-3xl font-bold text-foreground">{lowStockItems}</p>
          </div>
          <AlertTriangle className="h-8 w-8 text-orange-600" />
        </div>
      </div>

      <div className="bg-gradient-to-br from-purple-500/20 to-pink-600/20 rounded-xl p-6 border border-primary/20">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">High Value Items</p>
            <p className="text-3xl font-bold text-foreground">{highValueItems}</p>
          </div>
          <DollarSign className="h-8 w-8 text-purple-600" />
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-4 sm:p-6">
      <div className="mb-6">
        <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground mb-4">
          <span>Inventories</span>
          <span>&gt;</span>
          <span>Inventory Dashboard</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-bold uppercase">INVENTORY DASHBOARD</h1>
      </div>

      <Tabs defaultValue="analytics" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2 mb-6">
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="list">List</TabsTrigger>
        </TabsList>

        <TabsContent value="analytics" className="space-y-6">
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="flex-1">
              <div className="mb-6">
                <InventorySelector
                  onSelectionChange={setSelectedOptions}
                  className="max-w-md"
                />
              </div>

              {renderAnalyticsCards()}

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                <div className="bg-background/60 backdrop-blur-sm rounded-xl p-6 border border-primary/20">
                  <h3 className="text-lg font-semibold mb-4">Criticality Distribution</h3>
                  <div className="h-64 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-2xl font-bold mb-2">Donut Chart</div>
                      <div className="text-sm text-muted-foreground">
                        Critical: {criticalItems} | Non-Critical: {nonCriticalItems}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-background/60 backdrop-blur-sm rounded-xl p-6 border border-primary/20">
                  <h3 className="text-lg font-semibold mb-4">Group Distribution</h3>
                  <div className="h-64 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-2xl font-bold mb-2">Bar Chart</div>
                      <div className="text-sm text-muted-foreground">
                        {Object.keys(groupData).length} groups
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-background/60 backdrop-blur-sm rounded-xl p-6 border border-primary/20">
                  <h3 className="text-lg font-semibold mb-4">Stock Status</h3>
                  <div className="h-64 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-2xl font-bold mb-2">Stock Chart</div>
                      <div className="text-sm text-muted-foreground">
                        Low: {lowStockItems} | Normal: {totalItems - lowStockItems}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-background/60 backdrop-blur-sm rounded-xl p-6 border border-primary/20">
                <h3 className="text-lg font-semibold mb-4">Inventory Aging Matrix</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-primary/20">
                        <th className="text-left p-3">Category</th>
                        <th className="text-left p-3">Critical Items</th>
                        <th className="text-left p-3">Non-Critical Items</th>
                        <th className="text-left p-3">Total Value</th>
                        <th className="text-left p-3">Avg. TAT</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.entries(groupData).map(([group, count]) => {
                        const groupItems = inventoryData.filter(item => (item.group || 'Unassigned') === group);
                        const criticalCount = groupItems.filter(item => item.criticality === 'Critical').length;
                        const nonCriticalCount = groupItems.filter(item => item.criticality === 'Non-Critical').length;
                        const totalValue = groupItems.reduce((sum, item) => sum + (parseFloat(item.cost) || 0), 0);
                        const avgTat = Math.floor(Math.random() * 10) + 1;
                        
                        return (
                          <tr key={group} className="border-b border-primary/10">
                            <td className="p-3 font-medium">{group}</td>
                            <td className="p-3">{criticalCount}</td>
                            <td className="p-3">{nonCriticalCount}</td>
                            <td className="p-3">₹{totalValue.toLocaleString()}</td>
                            <td className="p-3">{avgTat}d</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div className="lg:w-80">
              <RecentInventorySidebar />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="list" className="space-y-6">

          <div className="mb-4">
            {renderCustomActions()}
          </div>

          <EnhancedTable
            data={paginatedData}
            columns={columns}
            renderCell={renderCell}
            renderActions={renderRowActions}
            bulkActions={bulkActions}
            showBulkActions={true}
            selectable={true}
            pagination={false}
            enableExport={true}
            exportFileName="inventory"
            onRowClick={handleViewItem}
            storageKey="inventory-table"
          />

          {/* Custom Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-6">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious 
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''}
                    />
                  </PaginationItem>
                  
                  {renderPaginationItems()}
                  
                  <PaginationItem>
                    <PaginationNext 
                      onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                      className={currentPage === totalPages ? 'pointer-events-none opacity-50' : ''}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </TabsContent>
      </Tabs>

      <BulkUploadDialog open={showBulkUpload} onOpenChange={setShowBulkUpload} title="Bulk Upload" />
      <InventoryFilterDialog open={showFilter} onOpenChange={setShowFilter} onApply={(filters) => console.log('Applied filters:', filters)} />
    </div>
  );
};
