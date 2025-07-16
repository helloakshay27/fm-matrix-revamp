import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Upload, FileText, Filter, Eye, Plus, Package, AlertTriangle, CheckCircle, TrendingUp, DollarSign, BarChart3, Download, ChevronDown, RotateCcw, ChevronRight } from 'lucide-react';
import { BulkUploadDialog } from '@/components/BulkUploadDialog';
import { InventoryFilterDialog } from '@/components/InventoryFilterDialog';
import { EnhancedTable } from '@/components/enhanced-table/EnhancedTable';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { InventorySelector } from '@/components/InventorySelector';
import { RecentInventorySidebar } from '@/components/RecentInventorySidebar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from 'recharts';

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
    group: 'Electronics',
    subGroup: 'Computers',
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
    group: 'Cleaning',
    subGroup: 'Housekeeping',
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
    group: 'HVAC',
    subGroup: 'Plumbing',
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
    group: 'Security',
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

  // Chart data for donut charts
  const itemStatusData = [
    { name: 'Active', value: activeItems, fill: '#C7B894' },
    { name: 'Inactive', value: totalItems - activeItems, fill: '#D1D5DB' }
  ];

  const criticalityData = [
    { name: 'Critical', value: criticalItems, fill: '#C7B894' },
    { name: 'Non-Critical', value: nonCriticalItems, fill: '#D1D5DB' }
  ];

  // Group data for bar chart
  const groupData = inventoryData.reduce((acc, item) => {
    const group = item.group || 'Unassigned';
    acc[group] = (acc[group] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const groupChartData = Object.entries(groupData).map(([name, value]) => ({
    name,
    value
  }));

  // Aging matrix data - simulated based on groups and priorities
  const agingMatrixData = [
    { priority: 'P1', '0-10': 20, '11-20': 3, '21-30': 4, '31-40': 0, '41-50': 203 },
    { priority: 'P2', '0-10': 2, '11-20': 0, '21-30': 0, '31-40': 0, '41-50': 4 },
    { priority: 'P3', '0-10': 1, '11-20': 0, '21-30': 1, '31-40': 0, '41-50': 7 },
    { priority: 'P4', '0-10': 1, '11-20': 0, '21-30': 0, '31-40': 0, '41-50': 5 }
  ];

  // Recent inventory items for sidebar
  const recentItems = inventoryData.slice(0, 3).map((item, index) => ({
    id: item.id,
    title: item.name,
    subtitle: 'Category: ' + (item.group || 'Unassigned'),
    subcategory: 'Sub-Category: ' + (item.subGroup || 'Unassigned'),
    assignee: 'Manager: John Doe',
    site: 'Site: ' + (item.group ? 'Warehouse A' : 'Warehouse B'),
    status: item.active,
    priority: index === 0 ? 'P1' : 'P1',
    tat: '"A"'
  }));

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

  const CustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
    return null; // No labels on the pie
  };

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
        <TabsList className="grid w-full grid-cols-2 bg-white border border-gray-200">
          <TabsTrigger 
            value="analytics" 
            className="flex items-center gap-2 data-[state=active]:bg-[#C72030] data-[state=active]:text-white data-[state=inactive]:bg-white data-[state=inactive]:text-[#C72030] border-none"
          >
            <BarChart3 className="w-4 h-4" />
            Analytics
          </TabsTrigger>
          <TabsTrigger 
            value="list" 
            className="flex items-center gap-2 data-[state=active]:bg-[#C72030] data-[state=active]:text-white data-[state=inactive]:bg-white data-[state=inactive]:text-[#C72030] border-none"
          >
            <Package className="w-4 h-4" />
            Inventory List
          </TabsTrigger>
        </TabsList>

        <TabsContent value="analytics" className="space-y-6">
          <div className="flex items-center justify-end mb-6">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="text-[#C72030] border-[#C72030]">
                  Inventory Selector ({totalItems}) <ChevronDown className="w-4 h-4 ml-2" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>All Items</DropdownMenuItem>
                <DropdownMenuItem>Critical Items</DropdownMenuItem>
                <DropdownMenuItem>Low Stock Items</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="flex gap-6">
            {/* Main Content */}
            <div className="flex-1">
              {/* Top Charts Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {/* Items Status Chart */}
                <div className="bg-white rounded-lg border p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-[#C72030]">Items</h3>
                    <Download className="w-4 h-4 text-[#C72030]" />
                  </div>
                  <div className="flex items-center justify-center h-48">
                    <div className="relative">
                      <ResponsiveContainer width={200} height={200}>
                        <PieChart>
                          <Pie
                            data={itemStatusData}
                            cx={100}
                            cy={100}
                            innerRadius={60}
                            outerRadius={90}
                            dataKey="value"
                            labelLine={false}
                          >
                            {itemStatusData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.fill} />
                            ))}
                          </Pie>
                        </PieChart>
                      </ResponsiveContainer>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                          <div className="text-xs text-gray-500">Total : {totalItems}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-center gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-[#C7B894] rounded"></div>
                      <span>Active</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-gray-300 rounded"></div>
                      <span>Inactive</span>
                    </div>
                  </div>
                </div>

                {/* Criticality Chart */}
                <div className="bg-white rounded-lg border p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-[#C72030]">Critical Non-Critical Items</h3>
                    <Download className="w-4 h-4 text-[#C72030]" />
                  </div>
                  <div className="flex items-center justify-center h-48">
                    <div className="relative">
                      <ResponsiveContainer width={200} height={200}>
                        <PieChart>
                          <Pie
                            data={criticalityData}
                            cx={100}
                            cy={100}
                            innerRadius={60}
                            outerRadius={90}
                            dataKey="value"
                            labelLine={false}
                          >
                            {criticalityData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.fill} />
                            ))}
                          </Pie>
                        </PieChart>
                      </ResponsiveContainer>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                          <div className="text-xs text-gray-500">Total : {totalItems}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-center gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-[#C7B894] rounded"></div>
                      <span>Critical</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-gray-300 rounded"></div>
                      <span>Non-Critical</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bar Chart */}
              <div className="bg-white rounded-lg border p-6 mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-[#C72030]">Unit Category-wise Items</h3>
                  <Download className="w-4 h-4 text-[#C72030]" />
                </div>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart 
                      data={groupChartData}
                      margin={{
                        top: 20,
                        right: 30,
                        left: 20,
                        bottom: 60,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis 
                        dataKey="name" 
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 12, fill: '#666' }}
                        angle={-45}
                        textAnchor="end"
                        height={60}
                      />
                      <YAxis 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fontSize: 12, fill: '#666' }}
                        domain={[0, 'dataMax + 1']}
                      />
                      <Tooltip 
                        contentStyle={{
                          backgroundColor: '#fff',
                          border: '1px solid #ccc',
                          borderRadius: '4px',
                          fontSize: '12px'
                        }}
                        labelStyle={{ color: '#333' }}
                      />
                      <Bar 
                        dataKey="value" 
                        fill="#C7B894" 
                        radius={[4, 4, 0, 0]}
                        name="Items Count"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Aging Matrix */}
              <div className="bg-white rounded-lg border p-6 mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-[#C72030]">Items Ageing Matrix</h3>
                  <Download className="w-4 h-4 text-[#C72030]" />
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="text-left p-3 font-medium text-gray-700">Priority</th>
                        <th className="text-center p-3 font-medium text-gray-700">No. of Days</th>
                        <th className="text-center p-3 font-medium text-gray-700">0-10</th>
                        <th className="text-center p-3 font-medium text-gray-700">11-20</th>
                        <th className="text-center p-3 font-medium text-gray-700">21-30</th>
                        <th className="text-center p-3 font-medium text-gray-700">31-40</th>
                        <th className="text-center p-3 font-medium text-gray-700">41-50</th>
                      </tr>
                    </thead>
                    <tbody>
                      {agingMatrixData.map((row, index) => (
                        <tr key={row.priority} className="border-b">
                          <td className="p-3 font-medium">{row.priority}</td>
                          <td className="p-3 text-center">-</td>
                          <td className="p-3 text-center">{row['0-10']}</td>
                          <td className="p-3 text-center">{row['11-20']}</td>
                          <td className="p-3 text-center">{row['21-30']}</td>
                          <td className="p-3 text-center">{row['31-40']}</td>
                          <td className="p-3 text-center">{row['41-50']}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Average Resolution Time */}
              <div className="bg-gray-100 rounded-lg p-8 text-center">
                <div className="text-6xl font-bold text-gray-800 mb-2">42 Days</div>
                <div className="text-gray-600">Average Time Taken To Process An Item</div>
              </div>
            </div>

        {/* Right Sidebar */}
        <div className="w-80">
          <div className="w-full bg-[#C4B89D]/25 border-l border-gray-200 p-4 h-full xl:max-h-[1208px] overflow-hidden flex flex-col">
            {/* Header */}
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-red-600 mb-2">
                Recent Items
              </h2>
              <div className="text-sm font-medium text-gray-800">
                16/07/2025
              </div>
            </div>
            
            {/* Items List */}
            <div className="flex-1 overflow-y-auto space-y-4">
              {recentItems.map((item, index) => (
                <div key={`${item.id}-${index}`} className="bg-[#C4B89D]/20 rounded-lg p-4 shadow-sm border border-[#C4B89D] border-opacity-60" style={{ borderWidth: '0.6px' }}>
                  {/* Header with ID, Star, and Priority */}
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-semibold text-gray-800 text-sm">{item.id}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 text-yellow-500">★</div>
                      <span className="bg-pink-300 text-pink-800 px-2 py-1 rounded text-xs font-medium">
                        {item.priority}
                      </span>
                    </div>
                  </div>
                  
                  {/* Title and TAT */}
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-gray-900 text-base">{item.title}</h3>
                    <div className="flex items-center gap-1">
                      <span className="text-sm font-medium text-gray-700">TAT :</span>
                      <span className="text-sm font-bold text-blue-600">{item.tat}</span>
                    </div>
                  </div>
                  
                  {/* Details */}
                  <div className="space-y-3 mb-4">
                    <div className="flex items-center gap-3">
                      <Package className="h-4 w-4 text-red-500" />
                      <span className="text-sm font-medium text-gray-700 min-w-[100px]">Category</span>
                      <span className="text-sm text-gray-700">:</span>
                      <span className="text-sm text-gray-900">{item.subtitle.replace('Category: ', '')}</span>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <Package className="h-4 w-4 text-red-500" />
                      <span className="text-sm font-medium text-gray-700 min-w-[100px]">Sub-Category</span>
                      <span className="text-sm text-gray-700">:</span>
                      <span className="text-sm text-gray-900">{item.subcategory.replace('Sub-Category: ', '')}</span>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <div className="w-4 h-4 rounded-full bg-orange-400"></div>
                      <span className="text-sm font-medium text-gray-700 min-w-[100px]">Assignee Name</span>
                      <span className="text-sm text-gray-700">:</span>
                      <span className="text-sm text-gray-900">{item.assignee.replace('Manager: ', '')}</span>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <div className="w-4 h-4 rounded-full bg-red-400"></div>
                      <span className="text-sm font-medium text-gray-700 min-w-[100px]">Site</span>
                      <span className="text-sm text-gray-700">:</span>
                      <span className="text-sm text-gray-900">{item.site.replace('Site: ', '')}</span>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <RotateCcw className="h-4 w-4 text-red-500" />
                      <span className="text-sm font-medium text-gray-700 min-w-[100px]">Update</span>
                      <span className="text-sm text-gray-700">:</span>
                      <div className="flex items-center gap-2 text-sm">
                        <span className="italic text-gray-600">In Progress</span>
                        <ChevronRight className="h-3 w-3 text-gray-600" />
                        <span className="italic text-gray-600">Processed</span>
                      </div>
                    </div>
                    
                    <div className="text-sm text-gray-600 ml-7">
                      (Handled By Manager)
                    </div>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-6">
                      <button 
                        className="flex items-center gap-2 text-black text-sm font-medium hover:opacity-80"
                      >
                        <FileText className="h-4 w-4 text-red-500" />
                        Add Comment
                      </button>
                      
                      <button 
                        className="flex items-center gap-2 text-black text-sm font-medium hover:opacity-80"
                      >
                        <AlertTriangle className="h-4 w-4 text-red-500" />
                        Flag Issue
                      </button>
                    </div>
                    
                    <button 
                      className="text-blue-600 text-sm font-medium underline hover:text-blue-800"
                      onClick={() => handleViewItem(item.id)}
                    >
                      View Detail&gt;&gt;
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
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