import React, { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Plus, Upload, Eye, Trash2, Loader2, X, BarChart3,
  Calendar, Filter, RefreshCw, Leaf, Activity 
} from "lucide-react";
import { useNavigate } from 'react-router-dom';
import { WasteGenerationFilterDialog } from '../components/WasteGenerationFilterDialog';
import { WasteGenerationBulkDialog } from '../components/WasteGenerationBulkDialog';
import { EnhancedTable } from '../components/enhanced-table/EnhancedTable';
import { fetchWasteGenerations, WasteGeneration, WasteGenerationFilters } from '../services/wasteGenerationAPI';
import { useLayout } from '@/contexts/LayoutContext';

// Analytics Components
import { TicketAnalyticsFilterDialog } from "@/components/TicketAnalyticsFilterDialog";
import { SiteWisePowerConsumptionChart } from "@/components/charts/SiteWisePowerConsumptionChart";

const UtilityWasteGenerationDashboard = () => {
  const navigate = useNavigate();
  const { isSidebarCollapsed } = useLayout();
  const panelRef = useRef<HTMLDivElement>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showActionPanel, setShowActionPanel] = useState(false);
  
  // API states
  const [wasteGenerations, setWasteGenerations] = useState<WasteGeneration[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeFilters, setActiveFilters] = useState<WasteGenerationFilters>({});
  const [currentPage, setCurrentPage] = useState(1);

  // Analytics States
  const [isAnalyticsFilterOpen, setIsAnalyticsFilterOpen] = useState(false);
  const [analyticsDateRange, setAnalyticsDateRange] = useState({
    startDate: '01/03/2025',
    endDate: '24/03/2026'
  });

  // Waste Category Breakdown Data (Reusing your main chart component)
  const wasteCategoryData = [
    { site: 'Dry Waste', mains: 500, dg: 0, renewable: 0, consumptionPerSqFt: null },
    { site: 'Wet Waste', mains: 350, dg: 0, renewable: 0, consumptionPerSqFt: null },
    { site: 'Hazardous', mains: 120, dg: 0, renewable: 0, consumptionPerSqFt: null },
    { site: 'E-Waste',   mains: 80,  dg: 0, renewable: 0, consumptionPerSqFt: null }
  ];

  const loadWasteGenerations = async (page: number = 1, filters?: WasteGenerationFilters) => {
    try {
      setIsLoading(true);
      const response = await fetchWasteGenerations(page, filters);
      setWasteGenerations(response.waste_generations || []);
    } catch (err) {
      setWasteGenerations([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadWasteGenerations(currentPage, activeFilters);
  }, [currentPage, activeFilters]);

  // Handlers
  const handleActionClick = () => setShowActionPanel(!showActionPanel);
  const handleClearSelection = () => setShowActionPanel(false);
  const handleApplyFilters = (filters: WasteGenerationFilters) => { setActiveFilters(filters); setCurrentPage(1); };
  const handleView = (id: number) => navigate(`/maintenance/waste/generation/${id}`);

  if (isLoading) return <div className="flex items-center justify-center h-screen"><Loader2 className="animate-spin" /></div>;

  return (
    <>
      <div className="p-4 sm:p-6 bg-gray-50 min-h-screen">
        <div className="mb-6">
          <div className="text-sm text-gray-600 mb-2">Assets &gt; Waste Generation List</div>
          <h1 className="font-semibold text-2xl text-gray-900 uppercase tracking-tight">WASTE GENERATION LIST</h1>
        </div>

        <Tabs defaultValue="list" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-white border border-gray-200">
            <TabsTrigger value="list" className="flex items-center gap-2 data-[state=active]:bg-[#EDEAE3] data-[state=active]:text-[#C72030] font-bold">
              <Trash2 className="w-4 h-4" /> Waste List
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2 data-[state=active]:bg-[#EDEAE3] data-[state=active]:text-[#C72030] font-bold">
              <BarChart3 className="w-4 h-4" /> Analytics
            </TabsTrigger>
          </TabsList>

          {/* ===================== LIST TAB ===================== */}
          <TabsContent value="list" className="mt-6">
            <EnhancedTable
              data={wasteGenerations}
              columns={[
                { key: 'actions', label: 'Actions' },
                { key: 'location_details', label: 'Location' },
                { key: 'vendor', label: 'Vendor' },
                { key: 'category', label: 'Category' },
                { key: 'waste_unit', label: 'Generated (KG)' },
                { key: 'wg_date', label: 'Waste Date' },
              ]}
              renderCell={(item: any, key) => {
                if (key === 'actions') return <Button variant="ghost" onClick={() => handleView(item.id)}><Eye className="h-4 w-4" /></Button>;
                if (key === 'vendor') return item.vendor?.company_name || 'N/A';
                if (key === 'category') return item.category?.category_name || 'N/A';
                return item[key] || 'N/A';
              }}
              getItemId={(item) => item.id.toString()}
              onSearchChange={setSearchTerm}
              onFilterClick={() => setIsFilterOpen(true)}
              leftActions={
                <Button className="bg-[#C72030] text-white rounded-none" onClick={handleActionClick}>
                  <Plus className="w-4 h-4 mr-2" /> Action
                </Button>
              }
            />
          </TabsContent>

          {/* ===================== ANALYTICS TAB ===================== */}
          <TabsContent value="analytics" className="space-y-4 mt-6">
            
            {/* 👇 Date Filter above the cards to the right side with fixed width */}
            <div className="flex justify-end mb-4">
              <Button
                variant="outline"
                onClick={() => setIsAnalyticsFilterOpen(true)}
                className="flex items-center justify-between w-[280px] px-4 py-2 bg-white hover:bg-gray-50 border-gray-300"
              >
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-600" />
                  <span className="text-sm font-medium text-gray-700">
                    {analyticsDateRange.startDate} - {analyticsDateRange.endDate}
                  </span>
                </div>
                <Filter className="w-4 h-4 text-gray-600" />
              </Button>
            </div>

            {/* Stats Summary */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-4 mb-6">
              {[
                { label: "Total Waste Generated", value: "1,050 kg", icon: <Trash2 className="w-6 h-6 text-[#C72030]" /> },
                { label: "Total Recycled", value: "420 kg", icon: <RefreshCw className="w-6 h-6 text-[#C72030]" /> },
                { label: "Dry Waste", value: "500 kg", icon: <Leaf className="w-6 h-6 text-[#C72030]" /> },
                { label: "Hazardous", value: "120 kg", icon: <Activity className="w-6 h-6 text-[#C72030]" /> },
              ].map((item, i) => (
                <div key={i} className="relative bg-[#F6F4EE] p-6 rounded-lg shadow-[0px_1px_8px_rgba(45,45,45,0.05)] flex items-center gap-4 cursor-pointer hover:shadow-lg transition-all duration-300 min-h-[88px]">
                  <div className="w-14 h-14 bg-[#C4B89D54] flex items-center justify-center rounded">
                    {item.icon}
                  </div>
                  <div>
                    <div className="text-xl font-semibold">{item.value}</div>
                    <div className="text-sm font-medium text-[#1A1A1A]">{item.label}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* 👇 ONLY ONE CHART: Category Breakdown */}
            <div className="w-full mt-6">
              <div className="animate-in fade-in duration-300">
                <SiteWisePowerConsumptionChart 
                  title="Waste Category Wise Generation Breakdown (KG)" 
                  data={wasteCategoryData} 
                  className="shadow-md border-none"
                />
              </div>
            </div>

          </TabsContent>
        </Tabs>
      </div>

      {/* Action Panel */}
      {showActionPanel && (
        <div className={`fixed z-50 flex items-end justify-center pb-24 pointer-events-none transition-all duration-300 ${isSidebarCollapsed ? 'left-16' : 'left-64'} right-0 bottom-0`}>
          <div className="pointer-events-auto bg-white border border-gray-200 rounded-lg shadow-2xl p-6 flex gap-12">
            <button onClick={() => navigate('/maintenance/waste/generation/add')} className="flex flex-col items-center hover:text-[#C72030] transition-colors">
              <Plus className="w-6 h-6 mb-1"/><span className="text-xs font-bold uppercase">Add</span>
            </button>
            <button onClick={() => setIsImportOpen(true)} className="flex flex-col items-center hover:text-[#C72030] transition-colors">
              <Upload className="w-6 h-6 mb-1"/><span className="text-xs font-bold uppercase">Import</span>
            </button>
            <div className="w-px h-8 bg-gray-200" />
            <button onClick={handleClearSelection} className="flex flex-col items-center text-gray-400 hover:text-black transition-colors">
              <X className="w-6 h-6 mb-1"/><span className="text-xs font-bold uppercase">Close</span>
            </button>
          </div>
        </div>
      )}

      <WasteGenerationFilterDialog isOpen={isFilterOpen} onClose={() => setIsFilterOpen(false)} onApplyFilters={handleApplyFilters} />
      <WasteGenerationBulkDialog isOpen={isImportOpen} onClose={() => setIsImportOpen(false)} type="import" />
      <TicketAnalyticsFilterDialog title='Waste Generation' isOpen={isAnalyticsFilterOpen} onClose={() => setIsAnalyticsFilterOpen(false)} onApplyFilters={(f) => setAnalyticsDateRange(f)} currentStartDate={analyticsDateRange.startDate} currentEndDate={analyticsDateRange.endDate} />
    </>
  );
};

export default UtilityWasteGenerationDashboard;