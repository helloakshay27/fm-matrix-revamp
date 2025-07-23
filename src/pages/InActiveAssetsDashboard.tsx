
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { StatsCard } from '../components/StatsCard';
import { InActiveAssetsTable } from '../components/InActiveAssetsTable';
import { InActiveAssetsFilterDialog } from '../components/InActiveAssetsFilterDialog';
import { Package, CheckCircle, AlertTriangle, Search, Filter, Download } from 'lucide-react';

export const InActiveAssetsDashboard = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const handleExportAll = () => {
    // Create and download CSV file for inactive assets
    const csvContent = "data:text/csv;charset=utf-8," + 
      "Asset Name,Asset ID,Asset Code,Asset No.,Asset Status,Equipment Id,Site,Building,Wing,Floor,Area,Room,Meter Type,Asset Type\n" +
      "No in-active assets found";
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "inactive_assets.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSearch = () => {
    console.log('Searching for:', searchTerm);
  };

  return (
    <div className="p-4 sm:p-6 bg-white min-h-screen">
      <div className="mb-6">
        <h1 className="font-work-sans font-semibold text-base sm:text-2xl lg:text-[26px] leading-auto tracking-normal text-[#1a1a1a] uppercase">IN-ACTIVE ASSET LIST</h1>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatsCard
          title="Total Asset"
          value="0"
          icon={<Package className="w-8 h-8" />}
        />
        <StatsCard
          title="In Use"
          value="0"
          icon={<CheckCircle className="w-8 h-8" />}
        />
        <StatsCard
          title="Breakdown"
          value="0"
          icon={<AlertTriangle className="w-8 h-8" />}
        />
      </div>

      {/* Action Buttons - Fully Responsive */}
      <div className="flex flex-col lg:flex-row lg:items-center gap-4 lg:gap-3 mb-6">
        {/* Left side buttons */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-3">
          <Button 
            onClick={handleExportAll}
            className="bg-[#C72030] hover:bg-[#C72030]/90 text-white w-full sm:w-auto"
          >
            <Download className="w-4 h-4 mr-2" />
            Export All
          </Button>
          <Button 
            onClick={() => setIsFilterOpen(true)}
            variant="outline" 
            className="border-gray-300 text-gray-700 bg-white hover:bg-gray-50 w-full sm:w-auto"
          >
            <Filter className="w-4 h-4 mr-2" />
            Filters
          </Button>
        </div>
        
        {/* Right side search */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 lg:ml-auto w-full lg:w-auto">
          <div className="relative flex-1 sm:flex-initial">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search assets..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-white h-[36px] w-full sm:w-64"
              style={{ height: '36px' }}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleSearch();
                }
              }}
            />
          </div>
          <Button 
            onClick={handleSearch}
            className="bg-green-600 hover:bg-green-700 text-white w-full sm:w-auto"
          >
            Go!
          </Button>
        </div>
      </div>
      
      {/* In-Active Assets Table */}
      <InActiveAssetsTable />

      {/* Filter Dialog */}
      <InActiveAssetsFilterDialog 
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
      />
    </div>
  );
};
