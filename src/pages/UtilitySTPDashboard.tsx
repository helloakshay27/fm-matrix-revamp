
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Search, Plus, Import, RefreshCw, FileDown, Printer, Filter } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { UtilitySTPFilterDialog } from '@/components/UtilitySTPFilterDialog';
import { BulkUploadDialog } from '@/components/BulkUploadDialog';

export const UtilitySTPDashboard = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isBulkUploadOpen, setIsBulkUploadOpen] = useState(false);
  const [uploadType, setUploadType] = useState<'import' | 'update'>('import');

  const stats = [
    { title: 'Total Asset', value: '3', color: 'bg-blue-500' },
    { title: 'In Use', value: '3', color: 'bg-green-500' },
    { title: 'Breakdown', value: '0', color: 'bg-red-600' }
  ];

  // Sample STP data
  const stpData = [
    {
      id: 'STP001',
      assetName: 'Primary STP Unit',
      assetCode: 'STP-001-A',
      assetNo: '301',
      status: 'In Use',
      site: 'Main Site',
      building: 'Treatment Plant',
      capacity: '500 KLD',
      type: 'Biological Treatment'
    },
    {
      id: 'STP002', 
      assetName: 'Secondary STP Unit',
      assetCode: 'STP-002-B',
      assetNo: '302',
      status: 'In Use',
      site: 'Main Site',
      building: 'Treatment Plant',
      capacity: '300 KLD',
      type: 'Chemical Treatment'
    },
    {
      id: 'STP003',
      assetName: 'Tertiary STP Unit',
      assetCode: 'STP-003-C', 
      assetNo: '303',
      status: 'In Use',
      site: 'Secondary Site',
      building: 'Treatment Facility',
      capacity: '200 KLD',
      type: 'Membrane Treatment'
    }
  ];

  const handleAdd = () => {
    navigate('/utility/stp/add-asset');
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
    const csvContent = "data:text/csv;charset=utf-8," + 
      "Asset Name,Asset ID,Asset Code,Asset No.,Asset Status,Site,Building,Capacity,Type\n" +
      stpData.map(item => `${item.assetName},${item.id},${item.assetCode},${item.assetNo},${item.status},${item.site},${item.building},${item.capacity},${item.type}`).join('\n');
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "stp_assets.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    console.log('Exporting all STP assets data...');
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

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const filteredData = stpData.filter(item =>
    searchTerm === '' || 
    item.assetName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.assetCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Breadcrumb */}
      <div className="text-sm text-gray-600">
        Assets &gt; STP Asset List
      </div>

      {/* Page Title */}
      <h1 className="text-2xl font-bold text-gray-900">STP ASSET LIST</h1>

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
          className="bg-[#C72030] hover:bg-[#C72030]/90 text-white rounded-md shadow-sm px-4 py-2 flex items-center gap-2 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add
        </Button>
        <Button 
          onClick={handleImport}
          className="bg-[#C72030] hover:bg-[#C72030]/90 text-white rounded-md shadow-sm px-4 py-2 flex items-center gap-2 transition-colors"
        >
          <Import className="w-4 h-4" />
          Import
        </Button>
        <Button 
          onClick={handleUpdate}
          className="bg-[#C72030] hover:bg-[#C72030]/90 text-white rounded-md shadow-sm px-4 py-2 flex items-center gap-2 transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          Update
        </Button>
        <Button 
          onClick={handleExportAll}
          className="bg-[#C72030] hover:bg-[#C72030]/90 text-white rounded-md shadow-sm px-4 py-2 flex items-center gap-2 transition-colors"
        >
          <FileDown className="w-4 h-4" />
          Export All
        </Button>
        <Button 
          onClick={handlePrintQR}
          className="bg-[#C72030] hover:bg-[#C72030]/90 text-white rounded-md shadow-sm px-4 py-2 flex items-center gap-2 transition-colors"
        >
          <Printer className="w-4 h-4" />
          Print QR
        </Button>
        <Button 
          onClick={handleInActiveAssets}
          className="bg-[#C72030] hover:bg-[#C72030]/90 text-white rounded-md shadow-sm px-4 py-2 transition-colors"
        >
          In-Active Assets
        </Button>
      </div>

      {/* Search and Filter */}
      <div className="flex justify-between items-center">
        <Button 
          onClick={() => setIsFilterOpen(true)}
          className="bg-[#C72030] hover:bg-[#C72030]/90 text-white rounded-md shadow-sm px-4 py-2 flex items-center gap-2 transition-colors"
        >
          <Filter className="w-4 h-4" />
          Filters
        </Button>
        <div className="flex items-center space-x-2">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
            <Input
              placeholder="Search STP assets..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={handleKeyPress}
              className="pl-10 w-64 rounded-md border border-gray-300 shadow-sm"
            />
          </div>
          <Button 
            onClick={handleSearch}
            className="bg-[#C72030] hover:bg-[#C72030]/90 text-white rounded-md shadow-sm px-4 py-2 transition-colors"
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
              <TableRow className="bg-gray-50">
                <TableHead className="font-semibold">Asset Name</TableHead>
                <TableHead className="font-semibold">Asset ID</TableHead>
                <TableHead className="font-semibold">Asset Code</TableHead>
                <TableHead className="font-semibold">Asset No.</TableHead>
                <TableHead className="font-semibold">Status</TableHead>
                <TableHead className="font-semibold">Site</TableHead>
                <TableHead className="font-semibold">Building</TableHead>
                <TableHead className="font-semibold">Capacity</TableHead>
                <TableHead className="font-semibold">Type</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.map((item) => (
                <TableRow key={item.id} className="hover:bg-gray-50">
                  <TableCell className="font-medium text-blue-600 cursor-pointer">
                    {item.assetName}
                  </TableCell>
                  <TableCell>{item.id}</TableCell>
                  <TableCell>{item.assetCode}</TableCell>
                  <TableCell>{item.assetNo}</TableCell>
                  <TableCell>
                    <span className="px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-800">
                      {item.status}
                    </span>
                  </TableCell>
                  <TableCell>{item.site}</TableCell>
                  <TableCell>{item.building}</TableCell>
                  <TableCell>{item.capacity}</TableCell>
                  <TableCell>{item.type}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Dialogs */}
      <UtilitySTPFilterDialog 
        isOpen={isFilterOpen} 
        onClose={() => setIsFilterOpen(false)} 
      />
      
      <BulkUploadDialog 
        open={isBulkUploadOpen} 
        onOpenChange={setIsBulkUploadOpen}
        title={uploadType === 'import' ? 'Import STP Assets' : 'Update STP Assets'}
      />
    </div>
  );
};
