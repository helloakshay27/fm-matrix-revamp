import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Eye, Filter, Package, BarChart3, TrendingUp, Download, Zap, Wrench, AlertTriangle, Activity } from 'lucide-react';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { BulkUploadDialog } from '@/components/BulkUploadDialog';
import { AssetFilterDialog } from '@/components/AssetFilterDialog';
import { AssetStats } from '@/components/AssetStats';
import { AssetActions } from '@/components/AssetActions';
import { AssetDataTable } from '@/components/AssetDataTable';
import { AssetSelectionPanel } from '@/components/AssetSelectionPanel';
import { MoveAssetDialog } from '@/components/MoveAssetDialog';
import { DisposeAssetDialog } from '@/components/DisposeAssetDialog';
import { AssetSelector } from '@/components/AssetSelector';
import { RecentAssetsSidebar } from '@/components/RecentAssetsSidebar';
import { DonutChartGrid } from '@/components/DonutChartGrid';
import { useAssetData } from '@/hooks/useAssetData';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, rectSortingStrategy } from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

// Sortable Chart Item Component
const SortableChartItem = ({ id, children }: { id: string; children: React.ReactNode }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div 
      ref={setNodeRef} 
      style={style} 
      {...attributes} 
      {...listeners}
      className="cursor-move"
    >
      {children}
    </div>
  );
};

export const AssetDashboard = () => {
  const navigate = useNavigate();
  const [isBulkUploadOpen, setIsBulkUploadOpen] = useState(false);
  const [uploadType, setUploadType] = useState<'import' | 'update'>('import');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isMoveAssetOpen, setIsMoveAssetOpen] = useState(false);
  const [isDisposeAssetOpen, setIsDisposeAssetOpen] = useState(false);
  const [selectedAnalyticsItems, setSelectedAnalyticsItems] = useState<string[]>([
    'total-available', 'assets-in-use', 'asset-breakdown', 'critical-breakdown'
  ]);
  const [visibleColumns, setVisibleColumns] = useState({
    actions: true,
    serialNumber: true,
    assetName: true,
    assetId: true,
    assetNo: true,
    assetStatus: true,
    site: true,
    building: true,
    wing: true,
    floor: true,
    area: true,
    room: true,
    group: true,
    subGroup: true,
    assetType: true
  });
  const [chartOrder, setChartOrder] = useState<string[]>([
    'donutCharts', 'categoryChart', 'agingMatrix', 'performanceMetrics'
  ]);

  // Drag and drop sensors
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const {
    filteredAssets,
    selectedAssets,
    searchTerm,
    stats,
    handleSearch,
    handleSelectAll,
    handleSelectAsset
  } = useAssetData();

  // Get selected asset objects with id and name
  const selectedAssetObjects = filteredAssets.filter(asset => selectedAssets.includes(asset.id)).map(asset => ({
    id: asset.id,
    name: asset.name
  }));

  const handleAddAsset = () => {
    navigate('/maintenance/asset/add');
  };

  const handleImport = () => {
    setUploadType('import');
    setIsBulkUploadOpen(true);
  };

  const handleUpdate = () => {
    setUploadType('update');
    setIsBulkUploadOpen(true);
  };

  const handleViewAsset = (assetId: string) => {
    navigate(`/maintenance/asset/details/${assetId}`);
  };

  const handleRefresh = () => {
    window.location.reload();
  };

  const handleColumnChange = (columns: typeof visibleColumns) => {
    setVisibleColumns(columns);
  };

  // Selection panel handlers
  const handleMoveAsset = () => {
    console.log('Move asset clicked for', selectedAssets.length, 'assets');
    setIsMoveAssetOpen(true);
    // Clear selection to close the panel
    handleSelectAll(false);
  };

  const handleDisposeAsset = () => {
    console.log('Dispose asset clicked for', selectedAssets.length, 'assets');
    setIsDisposeAssetOpen(true);
    // Clear selection to close the panel
    handleSelectAll(false);
  };

  const handlePrintQRCode = () => {
    console.log('Print QR code clicked for', selectedAssets.length, 'assets');
  };

  const handleCheckIn = () => {
    console.log('Check in clicked for', selectedAssets.length, 'assets');
  };

  const handleClearSelection = () => {
    console.log('Clear selection called, current selected assets:', selectedAssets.length);
    handleSelectAll(false);
    console.log('Selection cleared using handleSelectAll(false)');
  };

  // Handle drag end for chart reordering
  const handleDragEnd = (event: any) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      setChartOrder((items) => {
        const oldIndex = items.indexOf(active.id);
        const newIndex = items.indexOf(over.id);

        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  // Analytics data
  const statusData = [
    { name: 'In Use', value: stats.inUse, color: 'hsl(120, 70%, 50%)' },
    { name: 'Breakdown', value: stats.breakdown, color: 'hsl(0, 70%, 50%)' }
  ];

  const assetTypeData = [
    { name: 'IT Equipment', value: stats.itAssets, color: 'hsl(35, 35%, 75%)' },
    { name: 'Non-IT Equipment', value: stats.nonItAssets, color: 'hsl(25, 45%, 55%)' }
  ];

  const categoryData = [
    { name: 'Electronics', value: 2 },
    { name: 'Office', value: 1 },
    { name: 'HVAC', value: 1 },
    { name: 'Security', value: 1 },
    { name: 'AV', value: 1 }
  ];

  const agingMatrixData = [
    { priority: 'P1', '0-1Y': 15, '1-2Y': 8, '2-3Y': 5, '3-4Y': 3, '4-5Y': 2 },
    { priority: 'P2', '0-1Y': 25, '1-2Y': 12, '2-3Y': 8, '3-4Y': 5, '4-5Y': 3 },
    { priority: 'P3', '0-1Y': 35, '1-2Y': 18, '2-3Y': 12, '3-4Y': 8, '4-5Y': 5 }
  ];

  return (
    <div className="p-4 sm:p-6">
      

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
            Asset List
          </TabsTrigger>
        </TabsList>

        <TabsContent value="analytics" className="space-y-6 mt-6">
          {/* Analytics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 mb-6">
            {/* Total Assets Available */}
            <div className="p-4 rounded-lg flex items-center gap-3" style={{ backgroundColor: '#f6f4ee' }}>
              <div className="w-12 h-12 bg-[#FCE8E8] rounded-full flex items-center justify-center">
                <Package className="w-6 h-6 text-[#C72030]" />
              </div>
              <div>
                <div className="text-2xl font-bold text-[#C72030]">{stats.total}</div>
                <div className="text-sm text-gray-600">Total Assets</div>
              </div>
            </div>

            {/* Asset In Use */}
            <div className="p-4 rounded-lg flex items-center gap-3" style={{ backgroundColor: '#f6f4ee' }}>
              <div className="w-12 h-12 bg-[#FCE8E8] rounded-full flex items-center justify-center">
                <Activity className="w-6 h-6 text-[#C72030]" />
              </div>
              <div>
                <div className="text-2xl font-bold text-[#C72030]">{stats.inUse}</div>
                <div className="text-sm text-gray-600">Asset In Use</div>
              </div>
            </div>

            {/* Asset In Breakdown */}
            <div className="p-4 rounded-lg flex items-center gap-3" style={{ backgroundColor: '#f6f4ee' }}>
              <div className="w-12 h-12 bg-[#FCE8E8] rounded-full flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-[#C72030]" />
              </div>
              <div>
                <div className="text-2xl font-bold text-[#C72030]">{stats.breakdown}</div>
                <div className="text-sm text-gray-600">Asset In Breakdown</div>
              </div>
            </div>

            {/* Critical Assets In Breakdown */}
            <div className="p-4 rounded-lg flex items-center gap-3" style={{ backgroundColor: '#f6f4ee' }}>
              <div className="w-12 h-12 bg-[#FCE8E8] rounded-full flex items-center justify-center">
                <Zap className="w-6 h-6 text-[#C72030]" />
              </div>
              <div>
                <div className="text-2xl font-bold text-[#C72030]">15</div>
                <div className="text-sm text-gray-600">Critical Assets In Breakdown</div>
              </div>
            </div>

            {/* PPM Overdue */}
            <div className="p-4 rounded-lg flex items-center gap-3" style={{ backgroundColor: '#f6f4ee' }}>
              <div className="w-12 h-12 bg-[#FCE8E8] rounded-full flex items-center justify-center">
                <Wrench className="w-6 h-6 text-[#C72030]" />
              </div>
              <div>
                <div className="text-2xl font-bold text-[#C72030]">0</div>
                <div className="text-sm text-gray-600">PPM Overdue</div>
              </div>
            </div>

            {/* Customer Average */}
            <div className="p-4 rounded-lg flex items-center gap-3" style={{ backgroundColor: '#f6f4ee' }}>
              <div className="w-12 h-12 bg-[#FCE8E8] rounded-full flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-[#C72030]" />
              </div>
              <div>
                <div className="text-2xl font-bold text-[#C72030]">0</div>
                <div className="text-sm text-gray-600">Customer Average</div>
              </div>
            </div>
          </div>

          {/* Header with Asset Selector */}
          <div className="flex justify-end">
            <AssetSelector 
              selectedItems={selectedAnalyticsItems}
              onSelectionChange={setSelectedAnalyticsItems}
            />
          </div>

          {/* Main Analytics Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Left Section - Charts (3 columns) */}
            <div className="lg:col-span-3 space-y-6">
              {/* All Charts with Drag and Drop */}
              <DndContext 
                sensors={sensors} 
                collisionDetection={closestCenter} 
                onDragEnd={handleDragEnd}
              >
                <SortableContext items={chartOrder} strategy={rectSortingStrategy}>
                  <div className="space-y-6">
                    {chartOrder.map((chartId) => {
                      if (chartId === 'donutCharts') {
                        return (
                          <SortableChartItem key={chartId} id={chartId}>
                            <DonutChartGrid />
                          </SortableChartItem>
                        );
                      }
                      
                      if (chartId === 'categoryChart') {
                        return (
                          <SortableChartItem key={chartId} id={chartId}>
                            <div className="bg-white border border-[hsl(var(--analytics-border))] p-6">
                              <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold" style={{ color: '#C72030' }}>Category-wise Assets</h3>
                                <Download className="w-4 h-4 text-[hsl(var(--analytics-muted))] cursor-pointer" />
                              </div>
                              <ResponsiveContainer width="100%" height={250}>
                                <BarChart data={categoryData}>
                                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--analytics-border))" />
                                  <XAxis 
                                    dataKey="name" 
                                    tick={{ fill: 'hsl(var(--analytics-text))', fontSize: 12 }}
                                  />
                                  <YAxis tick={{ fill: 'hsl(var(--analytics-text))', fontSize: 12 }} />
                                  <Tooltip />
                                  <Bar dataKey="value" fill="hsl(var(--chart-tan))" />
                                </BarChart>
                              </ResponsiveContainer>
                            </div>
                          </SortableChartItem>
                        );
                      }
                      
                      if (chartId === 'agingMatrix') {
                        return (
                          <SortableChartItem key={chartId} id={chartId}>
                            <div className="bg-white border border-[hsl(var(--analytics-border))] p-6">
                              <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold" style={{ color: '#C72030' }}>Asset Aging Matrix</h3>
                                <Download className="w-4 h-4 text-[hsl(var(--analytics-muted))] cursor-pointer" />
                              </div>
                              <div className="overflow-x-auto">
                                <table className="w-full border-collapse">
                                  <thead>
                                    <tr className="bg-[hsl(var(--analytics-background))]">
                                      <th className="border border-[hsl(var(--analytics-border))] p-2 text-left text-sm font-medium text-[hsl(var(--analytics-text))]">Priority</th>
                                      <th className="border border-[hsl(var(--analytics-border))] p-2 text-center text-sm font-medium text-[hsl(var(--analytics-text))]">0-1Y</th>
                                      <th className="border border-[hsl(var(--analytics-border))] p-2 text-center text-sm font-medium text-[hsl(var(--analytics-text))]">1-2Y</th>
                                      <th className="border border-[hsl(var(--analytics-border))] p-2 text-center text-sm font-medium text-[hsl(var(--analytics-text))]">2-3Y</th>
                                      <th className="border border-[hsl(var(--analytics-border))] p-2 text-center text-sm font-medium text-[hsl(var(--analytics-text))]">3-4Y</th>
                                      <th className="border border-[hsl(var(--analytics-border))] p-2 text-center text-sm font-medium text-[hsl(var(--analytics-text))]">4-5Y</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {agingMatrixData.map((row, index) => (
                                      <tr key={index}>
                                        <td className="border border-[hsl(var(--analytics-border))] p-2 font-medium text-[hsl(var(--analytics-text))]">{row.priority}</td>
                                        <td className="border border-[hsl(var(--analytics-border))] p-2 text-center text-[hsl(var(--analytics-text))]">{row['0-1Y']}</td>
                                        <td className="border border-[hsl(var(--analytics-border))] p-2 text-center text-[hsl(var(--analytics-text))]">{row['1-2Y']}</td>
                                        <td className="border border-[hsl(var(--analytics-border))] p-2 text-center text-[hsl(var(--analytics-text))]">{row['2-3Y']}</td>
                                        <td className="border border-[hsl(var(--analytics-border))] p-2 text-center text-[hsl(var(--analytics-text))]">{row['3-4Y']}</td>
                                        <td className="border border-[hsl(var(--analytics-border))] p-2 text-center text-[hsl(var(--analytics-text))]">{row['4-5Y']}</td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          </SortableChartItem>
                        );
                      }
                      
                      if (chartId === 'performanceMetrics') {
                        return (
                          <SortableChartItem key={chartId} id={chartId}>
                            <div className="bg-white border border-[hsl(var(--analytics-border))] p-6">
                              <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold" style={{ color: '#C72030' }}>Performance Metrics</h3>
                                <Download className="w-4 h-4 text-[hsl(var(--analytics-muted))] cursor-pointer" />
                              </div>
                              <div className="space-y-4">
                                <div className="flex justify-between items-center p-3 bg-[hsl(var(--analytics-background))] rounded">
                                  <span className="text-sm text-[hsl(var(--analytics-text))]">Average Uptime</span>
                                  <span className="font-semibold text-green-600">98.5%</span>
                                </div>
                                <div className="flex justify-between items-center p-3 bg-[hsl(var(--analytics-background))] rounded">
                                  <span className="text-sm text-[hsl(var(--analytics-text))]">Maintenance Cost</span>
                                  <span className="font-semibold text-[hsl(var(--analytics-text))]">₹45,000</span>
                                </div>
                                <div className="flex justify-between items-center p-3 bg-[hsl(var(--analytics-background))] rounded">
                                  <span className="text-sm text-[hsl(var(--analytics-text))]">Asset Utilization</span>
                                  <span className="font-semibold text-blue-600">85.2%</span>
                                </div>
                                <div className="flex justify-between items-center p-3 bg-[hsl(var(--analytics-background))] rounded">
                                  <span className="text-sm text-[hsl(var(--analytics-text))]">ROI</span>
                                  <span className="font-semibold text-green-600">12.5%</span>
                                </div>
                              </div>
                            </div>
                          </SortableChartItem>
                        );
                      }
                      
                      return null;
                    })}
                  </div>
                </SortableContext>
              </DndContext>
            </div>

            {/* Right Sidebar - Recent Assets (1 column) */}
            <div className="lg:col-span-1">
              <RecentAssetsSidebar />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="list" className="space-y-6 mt-6">
          <AssetStats stats={stats} />

          <AssetActions
            searchTerm={searchTerm}
            onSearch={handleSearch}
            onAddAsset={handleAddAsset}
            onImport={handleImport}
            onUpdate={handleUpdate}
            onFilterOpen={() => setIsFilterOpen(true)}
            onRefresh={handleRefresh}
            visibleColumns={visibleColumns}
            onColumnChange={handleColumnChange}
          />

          <div className="relative">
            <AssetDataTable
              assets={filteredAssets}
              selectedAssets={selectedAssets}
              visibleColumns={visibleColumns}
              onSelectAll={handleSelectAll}
              onSelectAsset={handleSelectAsset}
              onViewAsset={handleViewAsset}
            />

            {/* Selection Panel - positioned as overlay within table container */}
            {selectedAssets.length > 0 && (
              <AssetSelectionPanel
                selectedCount={selectedAssets.length}
                selectedAssets={selectedAssetObjects}
                onMoveAsset={handleMoveAsset}
                onDisposeAsset={handleDisposeAsset}
                onPrintQRCode={handlePrintQRCode}
                onCheckIn={handleCheckIn}
                onClearSelection={handleClearSelection}
              />
            )}
          </div>

          <div className="mt-6">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious href="#" />
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#" isActive>
                    1
                  </PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#">
                    2
                  </PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#">
                    3
                  </PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#">
                    4
                  </PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#">
                    5
                  </PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#">
                    6
                  </PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#">
                    7
                  </PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#">
                    8
                  </PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#">
                    Last
                  </PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationNext href="#" />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </TabsContent>
      </Tabs>

      <BulkUploadDialog 
        open={isBulkUploadOpen}
        onOpenChange={setIsBulkUploadOpen}
        title={uploadType === 'import' ? 'Import Assets' : 'Update Assets'}
      />

      <AssetFilterDialog 
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
      />

      <MoveAssetDialog
        isOpen={isMoveAssetOpen}
        onClose={() => setIsMoveAssetOpen(false)}
        selectedAssets={selectedAssets}
      />

      <DisposeAssetDialog
        isOpen={isDisposeAssetOpen}
        onClose={() => setIsDisposeAssetOpen(false)}
        selectedAssets={selectedAssets}
      />
    </div>
  );
};
