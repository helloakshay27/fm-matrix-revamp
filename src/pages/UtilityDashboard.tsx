
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { StatsCard } from '../components/StatsCard';
import { AssetTable } from '../components/AssetTable';
import { UtilityFilterDialog } from '../components/UtilityFilterDialog';
import { Plus, Filter, Download, Upload, RotateCcw, FileText, QrCode, Eye } from 'lucide-react';
import { Package, CheckCircle, AlertTriangle } from 'lucide-react';

export const UtilityDashboard = () => {
  const navigate = useNavigate();
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const handleAddClick = () => {
    navigate('/utility/add-asset');
  };

  const handleInActiveAssetsClick = () => {
    navigate('/utility/inactive-assets');
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <div>
          <p className="text-[#1a1a1a] opacity-70 mb-2">Assets &gt; Asset List</p>
          <h1 className="text-2xl font-bold text-[#1a1a1a]">ASSET LIST</h1>
        </div>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatsCard
          title="Total Asset"
          value="5"
          color="orange"
          icon={<Package className="w-8 h-8" />}
        />
        <StatsCard
          title="In Use"
          value="4"
          color="green"
          icon={<CheckCircle className="w-8 h-8" />}
        />
        <StatsCard
          title="Breakdown"
          value="1"
          color="red"
          icon={<AlertTriangle className="w-8 h-8" />}
        />
      </div>
      
      {/* Action Buttons */}
      <div className="flex flex-wrap gap-3 mb-6">
        <Button 
          onClick={handleAddClick}
          className="bg-[#8B4513] hover:bg-[#8B4513]/90 text-white flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add
        </Button>
        
        <Button 
          variant="outline" 
          className="flex items-center gap-2 border-[#8B4513] text-[#8B4513] hover:bg-[#8B4513] hover:text-white"
        >
          <Download className="w-4 h-4" />
          Import
        </Button>
        
        <Button 
          variant="outline" 
          className="flex items-center gap-2 border-[#8B4513] text-[#8B4513] hover:bg-[#8B4513] hover:text-white"
        >
          <Upload className="w-4 h-4" />
          Update
        </Button>
        
        <Button 
          variant="outline" 
          className="flex items-center gap-2 border-[#8B4513] text-[#8B4513] hover:bg-[#8B4513] hover:text-white"
        >
          <Download className="w-4 h-4" />
          Export All
        </Button>
        
        <Button 
          variant="outline" 
          className="flex items-center gap-2 border-[#8B4513] text-[#8B4513] hover:bg-[#8B4513] hover:text-white"
        >
          <QrCode className="w-4 h-4" />
          Print QR
        </Button>
        
        <Button 
          onClick={handleInActiveAssetsClick}
          variant="outline" 
          className="flex items-center gap-2 border-[#8B4513] text-[#8B4513] hover:bg-[#8B4513] hover:text-white"
        >
          In-Active Assets
        </Button>
      </div>

      {/* Second Row Buttons */}
      <div className="flex flex-wrap gap-3 mb-6">
        <Button 
          variant="outline" 
          className="flex items-center gap-2 border-[#8B4513] text-[#8B4513] hover:bg-[#8B4513] hover:text-white"
        >
          <QrCode className="w-4 h-4" />
          Print All QR
        </Button>
        
        <Button 
          onClick={() => setIsFilterOpen(true)}
          variant="outline" 
          className="flex items-center gap-2 border-[#8B4513] text-[#8B4513] hover:bg-[#8B4513] hover:text-white"
        >
          <Filter className="w-4 h-4" />
          Filters
        </Button>
      </div>
      
      {/* Asset Table */}
      <AssetTable />
      
      {/* Filter Dialog */}
      <UtilityFilterDialog 
        isOpen={isFilterOpen} 
        onClose={() => setIsFilterOpen(false)} 
      />
    </div>
  );
};
