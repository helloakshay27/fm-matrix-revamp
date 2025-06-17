import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { StatsCard } from '../components/StatsCard';
import { AssetTable } from '../components/AssetTable';
import { UtilityFilterDialog } from '../components/UtilityFilterDialog';
import { BulkUploadDialog } from '../components/BulkUploadDialog';
import { Plus, Filter, Download, Upload, RotateCcw, FileText, QrCode, Eye, Search } from 'lucide-react';
import { Package, CheckCircle, AlertTriangle } from 'lucide-react';

export const UtilityDashboard = () => {
  const navigate = useNavigate();
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isBulkUploadOpen, setIsBulkUploadOpen] = useState(false);
  const [uploadType, setUploadType] = useState<'import' | 'update'>('import');
  const [searchTerm, setSearchTerm] = useState('');

  const handleAddClick = () => {
    navigate('/utility/energy/add-asset');
  };

  const handleInActiveAssetsClick = () => {
    navigate('/utility/inactive-assets');
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
      "Generator,GEN001,GEN001,001,In Use,EQ001,Main Site,Building A,East Wing,Ground Floor,Utility Area,Generator Room,Energy,Parent\n" +
      "Transformer,TRF001,TRF001,002,In Use,EQ002,Main Site,Building A,East Wing,Ground Floor,Utility Area,Transformer Room,Energy,Parent\n" +
      "UPS System,UPS001,UPS001,003,In Use,EQ003,Main Site,Building B,West Wing,First Floor,Server Room,UPS Room,Energy,Sub\n" +
      "Solar Panel,SOL001,SOL001,004,In Use,EQ004,Main Site,Building C,North Wing,Rooftop,Solar Farm,Panel Area,Renewable,Parent\n" +
      "Emergency Generator,EGEN001,EGEN001,005,Breakdown,EQ005,Main Site,Building A,East Wing,Basement,Emergency Area,Generator Room,Energy,Parent";
    
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
    console.log('Printing QR codes for selected assets...');
    // Logic for printing QR codes
  };

  const handlePrintAllQR = () => {
    console.log('Printing QR codes for all assets...');
    // Logic for printing all QR codes
  };

  const handleSearch = () => {
    console.log('Searching for:', searchTerm);
    // Logic for search functionality
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
          onClick={handleImport}
          className="flex items-center gap-2 border-[#8B4513] text-[#8B4513] hover:bg-[#8B4513] hover:text-white"
        >
          <Download className="w-4 h-4" />
          Import
        </Button>
        
        <Button 
          variant="outline" 
          onClick={handleUpdate}
          className="flex items-center gap-2 border-[#8B4513] text-[#8B4513] hover:bg-[#8B4513] hover:text-white"
        >
          <Upload className="w-4 h-4" />
          Update
        </Button>
        
        <Button 
          variant="outline" 
          onClick={handleExportAll}
          className="flex items-center gap-2 border-[#8B4513] text-[#8B4513] hover:bg-[#8B4513] hover:text-white"
        >
          <Download className="w-4 h-4" />
          Export All
        </Button>
        
        <Button 
          variant="outline" 
          onClick={handlePrintQR}
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
          onClick={handlePrintAllQR}
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
      
      {/* Asset Table */}
      <AssetTable />
      
      {/* Filter Dialog */}
      <UtilityFilterDialog 
        isOpen={isFilterOpen} 
        onClose={() => setIsFilterOpen(false)} 
      />

      {/* Bulk Upload Dialog */}
      <BulkUploadDialog 
        isOpen={isBulkUploadOpen} 
        onClose={() => setIsBulkUploadOpen(false)}
        type={uploadType}
      />
    </div>
  );
};
