
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { StatsCard } from '../components/StatsCard';
import { InActiveAssetsTable } from '../components/InActiveAssetsTable';
import { Package, CheckCircle, AlertTriangle, Search, Filter, Download } from 'lucide-react';

export const InActiveAssetsDashboard = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = () => {
    console.log('Searching for:', searchTerm);
  };

  const handleExportAll = () => {
    // Create and download CSV file
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
    
    console.log('Exporting all inactive assets data...');
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
          color="orange"
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
      <div className="flex flex-wrap gap-3 mb-6">
        <Button 
          onClick={handleExportAll}
          className="bg-[#8B4513] hover:bg-[#8B4513]/90 text-white flex items-center gap-2"
        >
          <Download className="w-4 h-4" />
          Export All
        </Button>
      </div>

      {/* Search Bar */}
      <div className="flex justify-end items-center mb-6">
        <div className="flex items-center space-x-2">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
            <Input
              placeholder="Search..."
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
            className="bg-[#8B4513] hover:bg-[#8B4513]/90 text-white"
          >
            Go
          </Button>
        </div>
      </div>
      
      {/* In-Active Assets Table */}
      <InActiveAssetsTable />
    </div>
  );
};
