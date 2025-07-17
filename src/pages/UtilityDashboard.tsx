
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Search, Plus, Import, RefreshCw, FileDown, Printer, Filter } from 'lucide-react';
import { Package, CheckCircle, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { UtilityFilterDialog } from '../components/UtilityFilterDialog';
import { BulkUploadDialog } from '../components/BulkUploadDialog';
import { AssetTable } from '../components/AssetTable';
import { StatsCard } from '../components/StatsCard';
import { useAssetDashboard } from '../hooks/useAssetDashboard';

export const UtilityDashboard = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isBulkUploadOpen, setIsBulkUploadOpen] = useState(false);
  const [uploadType, setUploadType] = useState<'import' | 'update'>('import');

  // Get dashboard data from API
  const { dashboardStats, loading: statsLoading } = useAssetDashboard(searchTerm, currentPage);

  const handleAdd = () => {
    navigate('/utility/add-asset');
  };

  const handleImport = () => {
    setUploadType('import');
    setIsBulkUploadOpen(true);
  };

  const handleUpdate = () => {
    setUploadType('update');
    setIsBulkUploadOpen(true);
  };

  const handleExportAll = () => {
    // Create and download CSV file
    const csvContent = "data:text/csv;charset=utf-8," + 
      "Asset Name,Asset ID,Asset Code,Asset No.,Asset Status,Equipment Id,Site,Building,Wing,Floor,Area,Room,Meter Type,Asset Type\n" +
      "Diesel Generator,53614,83898732f107c5df0119,501,In Use,,Located Site 1,Sarova,SW1,FW1,AW1,,Main Meter,Comprehensive\n" +
      "Panel meter,53616,f32e0f1a1a8b5c2d3e4f,503,In Use,,Located Site 1,Twin Tower,TW1,FTW1,ATW1,,Sub Meter,Non-Comprehensive";
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "energy_assets.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    console.log('Exporting all energy assets data...');
  };

  const handlePrintQR = () => {
    console.log('Printing QR codes...');
  };

  const handleInActiveAssets = () => {
    navigate('/utility/inactive-assets');
  };

  const handleSearch = () => {
    console.log('Searching for:', searchTerm);
    // The search is now handled automatically by the AssetTable component
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Breadcrumb */}
      <div className="text-sm text-gray-600">
        Assets &gt; Asset List
      </div>

      {/* Page Title */}
      <h1 className="text-2xl font-bold text-gray-900">ASSET LIST</h1>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatsCard
          title="Total Asset"
          value={statsLoading ? "..." : dashboardStats.totalAssets.toString()}
          icon={<Package className="w-8 h-8" />}
        />
        <StatsCard
          title="In Use"
          value={statsLoading ? "..." : dashboardStats.inUse.toString()}
          icon={<CheckCircle className="w-8 h-8" />}
        />
        <StatsCard
          title="Breakdown"
          value={statsLoading ? "..." : dashboardStats.breakdown.toString()}
          icon={<AlertTriangle className="w-8 h-8" />}
        />
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-3">
        <Button 
          onClick={handleAdd}
          className="bg-[#C72030] text-white hover:bg-[#A01B29] transition-colors duration-200 rounded-none px-4 py-2 h-9 text-sm font-medium flex items-center gap-2 border-0"
        >
          <Plus className="w-4 h-4" />
          Add
        </Button>
        <Button 
          onClick={handleImport}
          className="bg-[#C72030] text-white hover:bg-[#A01B29] transition-colors duration-200 rounded-none px-4 py-2 h-9 text-sm font-medium flex items-center gap-2 border-0"
        >
          <Import className="w-4 h-4" />
          Import
        </Button>
        <Button 
          onClick={handleUpdate}
          className="bg-[#C72030] text-white hover:bg-[#A01B29] transition-colors duration-200 rounded-none px-4 py-2 h-9 text-sm font-medium flex items-center gap-2 border-0"
        >
          <RefreshCw className="w-4 h-4" />
          Update
        </Button>
        <Button 
          onClick={handleExportAll}
          className="bg-[#C72030] text-white hover:bg-[#A01B29] transition-colors duration-200 rounded-none px-4 py-2 h-9 text-sm font-medium flex items-center gap-2 border-0"
        >
          <FileDown className="w-4 h-4" />
          Export All
        </Button>
        <Button 
          onClick={handlePrintQR}
          className="bg-[#C72030] text-white hover:bg-[#A01B29] transition-colors duration-200 rounded-none px-4 py-2 h-9 text-sm font-medium flex items-center gap-2 border-0"
        >
          <Printer className="w-4 h-4" />
          Print QR
        </Button>
        <Button 
          onClick={handleInActiveAssets}
          className="bg-[#C72030] text-white hover:bg-[#A01B29] transition-colors duration-200 rounded-none px-4 py-2 h-9 text-sm font-medium flex items-center gap-2 border-0"
        >
          In-Active Assets
        </Button>
      </div>

      {/* Search and Filter */}
      <div className="flex justify-between items-center">
        <Button 
          onClick={() => setIsFilterOpen(true)}
          className="bg-[#C72030] text-white hover:bg-[#A01B29] transition-colors duration-200 rounded-none px-4 py-2 h-9 text-sm font-medium flex items-center gap-2 border-0"
        >
          <Filter className="w-4 h-4" />
          Filters
        </Button>
        <div className="flex items-center space-x-2">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={handleKeyPress}
              className="pl-10 w-64 h-10 bg-white border border-gray-300 rounded-none focus:outline-none focus:ring-2 focus:ring-[#C72030] focus:border-[#C72030] text-sm"
            />
          </div>
          <Button 
            onClick={handleSearch}
            className="bg-[#C72030] text-white hover:bg-[#A01B29] transition-colors duration-200 rounded-none px-6 py-2 h-10 text-sm font-medium border-0"
          >
            Go!
          </Button>
        </div>
      </div>

      {/* Data Table with search functionality */}
      <Card>
        <CardContent className="p-0">
          <AssetTable 
            searchTerm={searchTerm} 
            currentPage={currentPage}
            onPageChange={(page) => setCurrentPage(page)}
          />
        </CardContent>
      </Card>

      {/* Dialogs */}
      <UtilityFilterDialog 
        isOpen={isFilterOpen} 
        onClose={() => setIsFilterOpen(false)} 
      />
      
      <BulkUploadDialog 
        open={isBulkUploadOpen} 
        onOpenChange={setIsBulkUploadOpen}
        title={uploadType === 'import' ? 'Import Energy Assets' : 'Update Energy Assets'}
      />
    </div>
  );
};

export default UtilityDashboard;
