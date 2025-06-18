import React, { useState } from 'react';
import { Plus, Upload, RefreshCw, Download, QrCode, Filter, Search } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { BulkUploadDialog } from '../components/BulkUploadDialog';
import { UtilitySTPFilterDialog } from '../components/UtilitySTPFilterDialog';
import { useNavigate } from 'react-router-dom';

const UtilitySTPDashboard = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [isUpdateOpen, setIsUpdateOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const navigate = useNavigate();

  const mockData = [
    {
      id: 1,
      assetName: "STP Unit 1",
      assetId: "STP001",
      assetCode: "STP-001",
      assetNo: "001",
      status: "In Use",
      equipmentId: "EQ001",
      site: "Main Site",
      building: "Building A",
      wing: "East Wing",
      floor: "Ground",
      area: "Treatment Area",
      room: "Room 101",
      meterType: "Flow Meter",
      assetType: "STP Equipment"
    },
    {
      id: 2,
      assetName: "STP Unit 2",
      assetId: "STP002",
      assetCode: "STP-002",
      assetNo: "002",
      status: "Breakdown",
      equipmentId: "EQ002",
      site: "Main Site",
      building: "Building B",
      wing: "West Wing",
      floor: "Ground",
      area: "Treatment Area",
      room: "Room 102",
      meterType: "Pressure Meter",
      assetType: "STP Equipment"
    }
  ];

  const handleAdd = () => {
    navigate('/utility/stp/add-asset');
  };

  const handleInActiveAssets = () => {
    navigate('/utility/inactive-assets');
  };

  const handleExportAll = () => {
    // Create and download CSV file
    const csvContent = "data:text/csv;charset=utf-8," + 
      "Asset Name,Asset ID,Asset Code,Asset No.,Asset Status,Equipment Id,Site,Building,Wing,Floor,Area,Room,Meter Type,Asset Type\n" +
      mockData.map(item => 
        `${item.assetName},${item.assetId},${item.assetCode},${item.assetNo},${item.status},${item.equipmentId},${item.site},${item.building},${item.wing},${item.floor},${item.area},${item.room},${item.meterType},${item.assetType}`
      ).join('\n');
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "stp_assets.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    console.log('Exporting all STP assets data...');
  };

  const handleSearch = () => {
    console.log('Searching for:', searchTerm);
  };

  const handlePrintQR = () => {
    console.log('Printing QR codes for STP assets...');
  };

  return (
    <>
      <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
        {/* Header */}
        <div>
          <nav className="text-sm text-gray-600 mb-2">
            Assets &gt; Asset List
          </nav>
          <h1 className="text-2xl font-bold text-gray-900">ASSET LIST</h1>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white p-6 rounded-lg">
            <div className="flex items-center gap-4">
              <div className="bg-white/20 p-3 rounded-full">
                <div className="w-6 h-6 bg-white/40 rounded-full"></div>
              </div>
              <div>
                <div className="text-3xl font-bold">0</div>
                <div className="text-white/90">Total Asset</div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white p-6 rounded-lg">
            <div className="flex items-center gap-4">
              <div className="bg-white/20 p-3 rounded-full">
                <div className="w-6 h-6 bg-white/40 rounded-full"></div>
              </div>
              <div>
                <div className="text-3xl font-bold">0</div>
                <div className="text-white/90">In Use</div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-red-500 to-pink-500 text-white p-6 rounded-lg">
            <div className="flex items-center gap-4">
              <div className="bg-white/20 p-3 rounded-full">
                <div className="w-6 h-6 bg-white/40 rounded-full"></div>
              </div>
              <div>
                <div className="text-3xl font-bold">0</div>
                <div className="text-white/90">Breakdown</div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4">
          <Button 
            onClick={handleAdd}
            style={{ backgroundColor: '#C72030' }}
            className="text-white hover:bg-[#C72030]/90"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add
          </Button>
          <Button 
            onClick={() => setIsImportOpen(true)}
            style={{ backgroundColor: '#C72030' }}
            className="text-white hover:bg-[#C72030]/90"
          >
            <Upload className="w-4 h-4 mr-2" />
            Import
          </Button>
          <Button 
            onClick={() => setIsUpdateOpen(true)}
            style={{ backgroundColor: '#C72030' }}
            className="text-white hover:bg-[#C72030]/90"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Update
          </Button>
          <Button 
            onClick={handleExportAll}
            style={{ backgroundColor: '#C72030' }}
            className="text-white hover:bg-[#C72030]/90"
          >
            <Download className="w-4 h-4 mr-2" />
            Export All
          </Button>
          <Button 
            onClick={handlePrintQR}
            style={{ backgroundColor: '#C72030' }}
            className="text-white hover:bg-[#C72030]/90"
          >
            <QrCode className="w-4 h-4 mr-2" />
            Print QR
          </Button>
          <Button 
            onClick={handleInActiveAssets}
            style={{ backgroundColor: '#C72030' }}
            className="text-white hover:bg-[#C72030]/90"
          >
            In-Active Assets
          </Button>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <Button 
            onClick={() => setIsFilterOpen(true)}
            style={{ backgroundColor: '#C72030' }}
            className="text-white hover:bg-[#C72030]/90"
          >
            <Filter className="w-4 h-4 mr-2" />
            Filters
          </Button>
          
          <div className="flex gap-2 items-center">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input 
                placeholder="Search..." 
                className="pl-10 w-64"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
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

        {/* Data Table */}
        <div className="bg-white rounded-lg border border-gray-200">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead className="w-12">
                  <Checkbox />
                </TableHead>
                <TableHead>Actions</TableHead>
                <TableHead>Asset Name</TableHead>
                <TableHead>Asset ID</TableHead>
                <TableHead>Asset Code</TableHead>
                <TableHead>Asset No.</TableHead>
                <TableHead>Asset Status</TableHead>
                <TableHead>Equipment Id</TableHead>
                <TableHead>Site</TableHead>
                <TableHead>Building</TableHead>
                <TableHead>Wing</TableHead>
                <TableHead>Floor</TableHead>
                <TableHead>Area</TableHead>
                <TableHead>Room</TableHead>
                <TableHead>Meter Type</TableHead>
                <TableHead>Asset Type</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockData.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <Checkbox />
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm" className="text-blue-600">
                      Actions
                    </Button>
                  </TableCell>
                  <TableCell className="font-medium">{item.assetName}</TableCell>
                  <TableCell>{item.assetId}</TableCell>
                  <TableCell>{item.assetCode}</TableCell>
                  <TableCell>{item.assetNo}</TableCell>
                  <TableCell>
                    <Badge 
                      variant={item.status === 'In Use' ? 'default' : 'destructive'}
                      className={item.status === 'In Use' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}
                    >
                      {item.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{item.equipmentId}</TableCell>
                  <TableCell>{item.site}</TableCell>
                  <TableCell>{item.building}</TableCell>
                  <TableCell>{item.wing}</TableCell>
                  <TableCell>{item.floor}</TableCell>
                  <TableCell>{item.area}</TableCell>
                  <TableCell>{item.room}</TableCell>
                  <TableCell>{item.meterType}</TableCell>
                  <TableCell>{item.assetType}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Dialogs */}
      <BulkUploadDialog 
        open={isImportOpen} 
        onOpenChange={setIsImportOpen}
        title="Import STP Assets"
      />
      <BulkUploadDialog 
        open={isUpdateOpen} 
        onOpenChange={setIsUpdateOpen}
        title="Update STP Assets"
      />
      <UtilitySTPFilterDialog 
        isOpen={isFilterOpen} 
        onClose={() => setIsFilterOpen(false)} 
      />
    </>
  );
};

export default UtilitySTPDashboard;
