
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { Search, Plus, Import, RefreshCw, FileDown, Printer, Filter } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { WaterFilterDialog } from '../components/WaterFilterDialog';
import { BulkUploadDialog } from '../components/BulkUploadDialog';
import { InActiveAssetsFilterDialog } from '../components/InActiveAssetsFilterDialog';

export const UtilityWaterDashboard = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isBulkUploadOpen, setIsBulkUploadOpen] = useState(false);
  const [isInActiveFilterOpen, setIsInActiveFilterOpen] = useState(false);
  const [uploadType, setUploadType] = useState<'import' | 'update'>('import');

  const stats = [
    { title: 'Total Asset', value: '0', color: 'bg-red-500' },
    { title: 'In Use', value: '0', color: 'bg-green-500' },
    { title: 'Breakdown', value: '0', color: 'bg-red-600' }
  ];

  const tableHeaders = [
    'Actions', 'Asset Name', 'Asset ID', 'Asset Code', 'Asset No.', 
    'Asset Status', 'Equipment Id', 'Site', 'Building', 'Wing', 
    'Floor', 'Area', 'Room', 'Meter Type', 'Asset Type'
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
      tableHeaders.join(",") + "\n" +
      "No data available in table";
    
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
  };

  return (
    <div className="p-6 space-y-6">
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
          className="bg-green-600 hover:bg-green-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add
        </Button>
        <Button 
          variant="outline"
          onClick={handleImport}
        >
          <Import className="w-4 h-4 mr-2" />
          Import
        </Button>
        <Button 
          variant="outline"
          onClick={handleUpdate}
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Update
        </Button>
        <Button 
          variant="outline"
          onClick={handleExportAll}
        >
          <FileDown className="w-4 h-4 mr-2" />
          Export All
        </Button>
        <Button 
          variant="outline"
          onClick={handlePrintQR}
        >
          <Printer className="w-4 h-4 mr-2" />
          Print QR
        </Button>
        <Badge 
          variant="secondary" 
          className="px-4 py-2 cursor-pointer hover:bg-gray-200"
          onClick={handleInActiveAssets}
        >
          In-Active Assets
        </Badge>
      </div>

      {/* Search and Filter */}
      <div className="flex justify-between items-center">
        <Button 
          variant="outline"
          onClick={() => setIsFilterOpen(true)}
        >
          <Filter className="w-4 h-4 mr-2" />
          Filters
        </Button>
        <div className="flex items-center space-x-2">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
            <Input
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-64"
            />
          </div>
          <Button 
            onClick={handleSearch}
            className="bg-green-600 hover:bg-green-700"
          >
            Go
          </Button>
        </div>
      </div>

      {/* Data Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <Checkbox />
                </TableHead>
                {tableHeaders.map((header, index) => (
                  <TableHead key={index} className="min-w-32">
                    {header}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell colSpan={tableHeaders.length + 1} className="text-center py-8 text-gray-500">
                  No data available
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Dialogs */}
      <WaterFilterDialog 
        isOpen={isFilterOpen} 
        onClose={() => setIsFilterOpen(false)} 
      />
      
      <BulkUploadDialog 
        isOpen={isBulkUploadOpen} 
        onClose={() => setIsBulkUploadOpen(false)}
        type={uploadType}
      />
      
      <InActiveAssetsFilterDialog 
        isOpen={isInActiveFilterOpen} 
        onClose={() => setIsInActiveFilterOpen(false)} 
      />
    </div>
  );
};

export default UtilityWaterDashboard;
