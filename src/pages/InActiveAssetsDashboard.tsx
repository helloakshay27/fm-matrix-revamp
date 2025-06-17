
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
    <div className="p-6">
      <div className="mb-6">
        <div>
          <p className="text-[#1a1a1a] opacity-70 mb-2">Assets &gt; Asset List</p>
          <h1 className="text-2xl font-bold text-[#1a1a1a]">IN-ACTIVE ASSET LIST</h1>
        </div>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatsCard
          title="Total Asset"
          value="0"
          color="red"
          icon={<Package className="w-8 h-8" />}
        />
        <StatsCard
          title="In Use"
          value="0"
          color="green"
          icon={<CheckCircle className="w-8 h-8" />}
        />
        <StatsCard
          title="Breakdown"
          value="0"
          color="red"
          icon={<AlertTriangle className="w-8 h-8" />}
        />
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-3 mb-6">
        <Button 
          onClick={handleExportAll}
          style={{ backgroundColor: '#C72030' }}
          className="text-white hover:bg-[#C72030]/90"
        >
          <Download className="w-4 h-4 mr-2" />
          Export All
        </Button>
        <Button 
          onClick={() => setIsFilterOpen(true)}
          variant="outline" 
          className="border-[#C72030] text-[#C72030] hover:bg-[#C72030] hover:text-white"
        >
          <Filter className="w-4 h-4 mr-2" />
          Filters
        </Button>
        <div className="ml-auto flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search assets..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-64"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleSearch();
                }
              }}
            />
          </div>
          <Button 
            onClick={handleSearch}
            style={{ backgroundColor: '#C72030' }}
            className="text-white hover:bg-[#C72030]/90"
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
