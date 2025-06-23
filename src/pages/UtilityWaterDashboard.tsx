
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Search, Plus, Import, RefreshCw, FileDown, Printer, Filter } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { WaterFilterDialog } from '../components/WaterFilterDialog';
import { BulkUploadDialog } from '../components/BulkUploadDialog';
import { WaterAssetTable } from '../components/WaterAssetTable';

export const UtilityWaterDashboard = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isBulkUploadOpen, setIsBulkUploadOpen] = useState(false);
  const [uploadType, setUploadType] = useState<'import' | 'update'>('import');

  const stats = [
    { title: 'Total Asset', value: '2', color: 'bg-red-500' },
    { title: 'In Use', value: '2', color: 'bg-green-500' },
    { title: 'Breakdown', value: '0', color: 'bg-red-600' }
  ];

  const handleAdd = () => {
    navigate('/utility/water/add-asset');
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
      "Borewell,53619,83898732f107c5df0121,505,In Use,,Located Site 1,Sarova,SW1,FW1,AW1,,Sub Meter,Comprehensive\n" +
      "Tanker,53615,c302fd076e1a78a9116,502,In Use,,Located Site 1,Twin Tower,,,,,Sub Meter,Non-Comprehensive";
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "water_assets.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    console.log('Exporting all water assets data...');
  };

  const handlePrintQR = () => {
    console.log('Printing QR codes...');
  };

  const handleInActiveAssets = () => {
    navigate('/utility/inactive-assets');
  };

  const handleSearch = () => {
    console.log('Searching for:', searchTerm);
    // The search is now handled automatically by the WaterAssetTable component
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className={`w-12 h-12 rounded-full ${stat.color} flex items-center justify-center`}>
                  <span className="text-white font-bold text-lg">{stat.value}</span>
                </div>
                <div>
                  <p className="text-sm text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-3">
        <Button 
          onClick={handleAdd}
          className="bg-[#FF6B35] hover:bg-[#FF6B35]/90 text-white px-6 py-2 rounded-md font-medium transition-colors border-0 shadow-sm"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add
        </Button>
        <Button 
          onClick={handleImport}
          className="bg-[#FF6B35] hover:bg-[#FF6B35]/90 text-white px-6 py-2 rounded-md font-medium transition-colors border-0 shadow-sm"
        >
          <Import className="w-4 h-4 mr-2" />
          Import
        </Button>
        <Button 
          onClick={handleUpdate}
          className="bg-[#FF6B35] hover:bg-[#FF6B35]/90 text-white px-6 py-2 rounded-md font-medium transition-colors border-0 shadow-sm"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Update
        </Button>
        <Button 
          onClick={handleExportAll}
          className="bg-[#FF6B35] hover:bg-[#FF6B35]/90 text-white px-6 py-2 rounded-md font-medium transition-colors border-0 shadow-sm"
        >
          <FileDown className="w-4 h-4 mr-2" />
          Export All
        </Button>
        <Button 
          onClick={handlePrintQR}
          className="bg-[#FF6B35] hover:bg-[#FF6B35]/90 text-white px-6 py-2 rounded-md font-medium transition-colors border-0 shadow-sm"
        >
          <Printer className="w-4 h-4 mr-2" />
          Print QR
        </Button>
        <Button 
          onClick={handleInActiveAssets}
          className="bg-[#FF6B35] hover:bg-[#FF6B35]/90 text-white px-6 py-2 rounded-md font-medium transition-colors border-0 shadow-sm"
        >
          In-Active Assets
        </Button>
      </div>

      {/* Search and Filter */}
      <div className="flex justify-between items-center">
        <Button 
          onClick={() => setIsFilterOpen(true)}
          className="bg-[#FF6B35] hover:bg-[#FF6B35]/90 text-white px-6 py-2 rounded-md font-medium transition-colors border-0 shadow-sm"
        >
          <Filter className="w-4 h-4 mr-2" />
          Filters
        </Button>
        <div className="flex items-center space-x-2">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
            <Input
              placeholder="Search assets..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={handleKeyPress}
              className="pl-10 w-64 rounded-md border border-gray-300"
            />
          </div>
          <Button 
            onClick={handleSearch}
            className="bg-[#FF6B35] hover:bg-[#FF6B35]/90 text-white px-6 py-2 rounded-md font-medium transition-colors border-0 shadow-sm"
          >
            Go
          </Button>
        </div>
      </div>

      {/* Data Table with search functionality */}
      <Card>
        <CardContent className="p-0">
          <WaterAssetTable searchTerm={searchTerm} />
        </CardContent>
      </Card>

      {/* Dialogs */}
      <WaterFilterDialog 
        isOpen={isFilterOpen} 
        onClose={() => setIsFilterOpen(false)} 
      />
      
      <BulkUploadDialog 
        open={isBulkUploadOpen} 
        onOpenChange={setIsBulkUploadOpen}
        title={uploadType === 'import' ? 'Import Water Assets' : 'Update Water Assets'}
      />
    </div>
  );
};

export default UtilityWaterDashboard;
