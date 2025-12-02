
import React, { useState, useEffect, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { Filter, Download, Loader2 } from "lucide-react";
import { UtilitySolarGeneratorFilterDialog } from '../components/UtilitySolarGeneratorFilterDialog';
import { EnhancedTable } from '@/components/enhanced-table/EnhancedTable';
import { ColumnConfig } from '@/hooks/useEnhancedTable';
import { solarGeneratorAPI, SolarGenerator, SolarGeneratorFilters } from '@/services/solarGeneratorAPI';
import { useToast } from "@/hooks/use-toast";
import { ColumnVisibilityDropdown } from '@/components/ColumnVisibilityDropdown';

const UtilitySolarGeneratorDashboard = () => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [solarGeneratorData, setSolarGeneratorData] = useState<SolarGenerator[]>([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState<SolarGeneratorFilters>({});
  const { toast } = useToast();

  // Column visibility state
  const [columns, setColumns] = useState([
    { key: 'id', label: 'ID', visible: true },
    { key: 'transaction_date', label: 'Date', visible: true },
    { key: 'unit_consumed', label: 'Total Units', visible: true },
    { key: 'plant_day_generation', label: 'Plant Day Generation', visible: true },
    { key: 'tower_name', label: 'Tower', visible: true }
  ]);

  // Column visibility handlers
  const handleColumnToggle = (columnKey: string, visible: boolean) => {
    console.log('Column toggle called:', { columnKey, visible });
    setColumns(prev => {
      const updated = prev.map(col => 
        col.key === columnKey ? { ...col, visible } : col
      );
      console.log('Updated columns:', updated);
      return updated;
    });
  };

  const isColumnVisible = useCallback((columnKey: string) => {
    return columns.find(col => col.key === columnKey)?.visible ?? true;
  }, [columns]);

  const handleResetColumns = () => {
    setColumns(prev => 
      prev.map(col => ({ ...col, visible: true }))
    );
    toast({
      title: "Columns Reset",
      description: "All columns have been restored to default visibility"
    });
  };

  // Enhanced table columns for EnhancedTable component
  const enhancedTableColumns = React.useMemo(() => {
    const allColumns = [
      { key: 'id', label: 'ID', sortable: true, draggable: true, defaultVisible: true, visible: isColumnVisible('id'), hideable: true },
      { key: 'transaction_date', label: 'Date', sortable: true, draggable: true, defaultVisible: true, visible: isColumnVisible('transaction_date'), hideable: true },
      { key: 'unit_consumed', label: 'Total Units', sortable: true, draggable: true, defaultVisible: true, visible: isColumnVisible('unit_consumed'), hideable: true },
      { key: 'plant_day_generation', label: 'Plant Day Generation', sortable: true, draggable: true, defaultVisible: true, visible: isColumnVisible('plant_day_generation'), hideable: true },
      { key: 'tower_name', label: 'Tower', sortable: true, draggable: true, defaultVisible: true, visible: isColumnVisible('tower_name'), hideable: true }
    ];
    
    // Filter to only show visible columns
    return allColumns.filter(col => col.visible);
  }, [isColumnVisible]);

  // Transform columns for the dropdown (simplified structure)
  const dropdownColumns = React.useMemo(() => 
    columns,
    [columns]
  );

  // Fetch solar generator data
  const fetchSolarGenerators = useCallback(async (appliedFilters?: SolarGeneratorFilters) => {
    try {
      setLoading(true);
      console.log('🚀 Fetching solar generator data from API with filters:', appliedFilters);
      
      const data = await solarGeneratorAPI.getSolarGenerators(appliedFilters || filters);
      console.log('✅ Solar generator data fetched successfully:', data);
      
      setSolarGeneratorData(data);
      console.log('📊 Set solar generator data:', data.length, 'records');
      
    } catch (error) {
      console.error('❌ Error fetching solar generators:', error);
      toast({
        title: "Error",
        description: "Failed to fetch solar generator data",
        variant: "destructive"
      });
      setSolarGeneratorData([]);
    } finally {
      setLoading(false);
    }
  }, [filters, toast]);

  // Fetch data on component mount
  useEffect(() => {
    fetchSolarGenerators();
  }, [fetchSolarGenerators]);

  // Filter handler functions
  const handleApplyFilters = (appliedFilters: SolarGeneratorFilters) => {
    console.log('Applying filters:', appliedFilters);
    setFilters(appliedFilters);
    fetchSolarGenerators(appliedFilters);
  };

  const handleResetFilters = () => {
    console.log('Resetting filters');
    setFilters({});
    fetchSolarGenerators({});
  };

  // Handle export
  const handleExport = async () => {
    try {
      console.log('📤 Exporting solar generator data with filters:', filters);
      
      await solarGeneratorAPI.downloadSolarGenerators(filters);
      
      toast({
        title: "Export Successful",
        description: "Solar generator data exported successfully"
      });
      
    } catch (error) {
      console.error('❌ Export error:', error);
      toast({
        title: "Export Failed",
        description: "Failed to export solar generator data",
        variant: "destructive"
      });
    }
  };

  const renderCell = (item: SolarGenerator, columnKey: string) => {
    switch (columnKey) {
      case 'id':
        return <span>{item.id}</span>;
      case 'transaction_date':
        return <span>{item.transaction_date}</span>;
      case 'unit_consumed':
        return <span>{item.unit_consumed?.toLocaleString() || '-'}</span>;
      case 'plant_day_generation':
        return <span>{item.plant_day_generation?.toLocaleString() || '-'}</span>;
      case 'tower_name':
        return <span>{item.tower_name}</span>;
      default: {
        // Fallback for any other columns
        const value = item[columnKey as keyof SolarGenerator];
        return <span>{value !== null && value !== undefined ? String(value) : '-'}</span>;
      }
    }
  };

  // Filter data based on search term
  const filteredData = solarGeneratorData.filter(item =>
    item.tower_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.transaction_date?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.id?.toString().includes(searchTerm)
  );

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      {/* Page Title */}
      <div className="flex items-center justify-between">
        <h1 className="font-work-sans font-semibold text-base sm:text-2xl lg:text-[26px] leading-auto tracking-normal text-[#1a1a1a]">
          SOLAR GENERATORS LIST
        </h1>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="flex items-center justify-center p-8">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2">Loading solar generator data...</span>
        </div>
      ) : (
        /* Enhanced Solar Generator Table */
        <div>
          <EnhancedTable
            data={filteredData}
            columns={enhancedTableColumns}
            selectable={false}
            renderCell={renderCell}
            storageKey="utility-solar-generator-table"
            handleExport={handleExport}
            exportFileName="solar-generator-data"
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            searchPlaceholder="Search solar generator records..."
            pagination={true}
            pageSize={10}
            hideColumnsButton={true}
            leftActions={
              <div className="flex flex-wrap items-center gap-2 md:gap-4">
                {/* Left actions can be used for other buttons if needed */}
              </div>
            }
            rightActions={
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  className="border-[#C72030] text-[#C72030] hover:bg-[#C72030]/10"
                  onClick={() => setIsFilterOpen(true)}
                >
                  <Filter className="w-4 h-4" />
                </Button>
                <ColumnVisibilityDropdown
                  columns={dropdownColumns}
                  onColumnToggle={handleColumnToggle}
                />
              </div>
            }
          />
        </div>
      )}

      {/* Filter Dialog */}
      <UtilitySolarGeneratorFilterDialog 
        isOpen={isFilterOpen} 
        onClose={() => setIsFilterOpen(false)} 
        onApplyFilters={handleApplyFilters}
        onResetFilters={handleResetFilters}
      />
    </div>
  );
};

export default UtilitySolarGeneratorDashboard;
