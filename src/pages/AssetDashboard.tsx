import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Plus, Upload, Download, FileText, Search, Filter, Eye, Settings, DollarSign, Laptop, Monitor, Package, AlertTriangle, Trash2, RotateCcw, ExternalLink } from 'lucide-react';
import { BulkUploadDialog } from '@/components/BulkUploadDialog';
import { AssetFilterDialog } from '@/components/AssetFilterDialog';
import { ColumnVisibilityDropdown } from '@/components/ColumnVisibilityDropdown';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const assetData = [
  {
    id: '203696',
    name: 'Dell Laptop Pro',
    code: '026d4956a50be20318za',
    assetNo: 'DL-001',
    status: 'In Use',
    equipmentId: 'EQ-LT-001',
    site: 'Main Campus',
    building: 'Building A',
    wing: 'East Wing',
    floor: '3rd Floor',
    area: 'IT Department',
    room: 'Room 301',
    meterType: 'Power Meter',
    assetType: 'IT Equipment'
  },
  {
    id: '203694',
    name: 'HP Printer Scanner',
    code: '5e298bffcab011bb6e16',
    assetNo: 'HP-002',
    status: 'Breakdown',
    equipmentId: 'EQ-PR-002',
    site: 'Main Campus',
    building: 'Building B',
    wing: 'West Wing',
    floor: '2nd Floor',
    area: 'Admin Office',
    room: 'Room 205',
    meterType: 'Usage Meter',
    assetType: 'Office Equipment'
  },
  {
    id: '203695',
    name: 'Air Conditioning Unit',
    code: '7f456abc789def123456',
    assetNo: 'AC-003',
    status: 'In Use',
    equipmentId: 'EQ-AC-003',
    site: 'Branch Office',
    building: 'Building C',
    wing: 'North Wing',
    floor: '1st Floor',
    area: 'Reception',
    room: 'Lobby',
    meterType: 'Energy Meter',
    assetType: 'HVAC Equipment'
  },
  {
    id: '203697',
    name: 'Security Camera System',
    code: '9e123def456ghi789abc',
    assetNo: 'SC-004',
    status: 'In Use',
    equipmentId: 'EQ-SC-004',
    site: 'Main Campus',
    building: 'Building A',
    wing: 'Central',
    floor: 'All Floors',
    area: 'Security',
    room: 'Multiple',
    meterType: 'Network Meter',
    assetType: 'Security Equipment'
  },
  {
    id: '203698',
    name: 'Conference Room Projector',
    code: '4a789bcd012efg345hij',
    assetNo: 'PR-005',
    status: 'Maintenance',
    equipmentId: 'EQ-PJ-005',
    site: 'Main Campus',
    building: 'Building B',
    wing: 'South Wing',
    floor: '4th Floor',
    area: 'Conference Area',
    room: 'Conference Room A',
    meterType: 'Usage Meter',
    assetType: 'AV Equipment'
  }
];

export const AssetDashboard = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredAssets, setFilteredAssets] = useState(assetData);
  const [selectedAssets, setSelectedAssets] = useState<string[]>([]);
  const [isBulkUploadOpen, setIsBulkUploadOpen] = useState(false);
  const [uploadType, setUploadType] = useState<'import' | 'update'>('import');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [visibleColumns, setVisibleColumns] = useState({
    actions: true,
    assetName: true,
    assetId: true,
    assetCode: true,
    assetNo: true,
    assetStatus: true,
    equipmentId: true,
    site: true,
    building: true,
    wing: true,
    floor: true,
    area: true,
    room: true,
    meterType: true,
    assetType: true
  });

  const stats = useMemo(() => {
    const totalAssets = assetData.length;
    const inUseAssets = assetData.filter(asset => asset.status === 'In Use').length;
    const breakdownAssets = assetData.filter(asset => asset.status === 'Breakdown').length;
    const maintenanceAssets = assetData.filter(asset => asset.status === 'Maintenance').length;
    const standbyAssets = assetData.filter(asset => asset.status === 'Standby').length;
    const itAssets = assetData.filter(asset => asset.assetType.includes('IT') || asset.assetType.includes('Network')).length;
    const nonItAssets = totalAssets - itAssets;
    const totalValue = 125000;
    const inStoreAssets = 0;
    const disposeAssets = 0;
    
    return {
      total: totalAssets,
      inUse: inUseAssets,
      breakdown: breakdownAssets + maintenanceAssets + standbyAssets,
      totalValue: totalValue,
      nonItAssets: nonItAssets,
      itAssets: itAssets,
      inStore: inStoreAssets,
      dispose: disposeAssets
    };
  }, []);

  const handleAddAsset = () => {
    navigate('/maintenance/asset/add');
  };

  const statData = [
    { label: "Total Assets", value: stats.total, icon: <Package className="w-6 h-6 text-[#C72030]" /> },
    { label: "Total Value", value: `₹${stats.totalValue.toFixed(2)}`, icon: <DollarSign className="w-6 h-6 text-[#C72030]" /> },
    { label: "Non IT Assets", value: stats.nonItAssets, icon: <Settings className="w-6 h-6 text-[#C72030]" /> },
    { label: "IT Assets", value: stats.itAssets, icon: <Monitor className="w-6 h-6 text-[#C72030]" /> },
    { label: "In Use", value: stats.inUse, icon: <Settings className="w-6 h-6 text-[#C72030]" /> },
    { label: "Breakdown", value: stats.breakdown, icon: <AlertTriangle className="w-6 h-6 text-[#C72030]" /> },
    { label: "In Store", value: stats.inStore, icon: <Package className="w-6 h-6 text-[#C72030]" /> },
    { label: "Dispose Assets", value: stats.dispose, icon: <Trash2 className="w-6 h-6 text-[#C72030]" /> },
  ];

  const handleImport = () => {
    setUploadType('import');
    setIsBulkUploadOpen(true);
  };

  const handleUpdate = () => {
    setUploadType('update');
    setIsBulkUploadOpen(true);
  };

  const handleInActiveAssets = () => {
    navigate('/maintenance/asset/inactive');
  };

  const handleExportAll = () => {
    const assetsToExport = selectedAssets.length > 0 
      ? filteredAssets.filter(asset => selectedAssets.includes(asset.id))
      : filteredAssets;

    const headers = "Asset Name,Asset ID,Asset Code,Asset No.,Asset Status,Equipment Id,Site,Building,Wing,Floor,Area,Room,Meter Type,Asset Type\n";
    const csvContent = assetsToExport.map(asset => 
      `"${asset.name}","${asset.id}","${asset.code}","${asset.assetNo}","${asset.status}","${asset.equipmentId}","${asset.site}","${asset.building}","${asset.wing}","${asset.floor}","${asset.area}","${asset.room}","${asset.meterType}","${asset.assetType}"`
    ).join('\n');

    const fullContent = "data:text/csv;charset=utf-8," + headers + csvContent;
    const encodedUri = encodeURI(fullContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `assets_${selectedAssets.length > 0 ? 'selected' : 'all'}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrintQR = () => {
    const assetsToPrint = selectedAssets.length > 0 
      ? filteredAssets.filter(asset => selectedAssets.includes(asset.id))
      : [];

    if (assetsToPrint.length === 0) {
      alert('Please select assets to print QR codes for.');
      return;
    }

    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>QR Codes - Assets</title>
            <style>
              body { font-family: Arial, sans-serif; }
              .qr-container { display: flex; flex-wrap: wrap; gap: 20px; padding: 20px; }
              .qr-item { border: 1px solid #ccc; padding: 10px; text-align: center; }
              .qr-code { width: 100px; height: 100px; border: 1px solid #000; margin: 10px auto; }
            </style>
          </head>
          <body>
            <h1>Asset QR Codes</h1>
            <div class="qr-container">
              ${assetsToPrint.map(asset => `
                <div class="qr-item">
                  <div class="qr-code">QR</div>
                  <p><strong>${asset.name}</strong></p>
                  <p>ID: ${asset.id}</p>
                  <p>Code: ${asset.code}</p>
                </div>
              `).join('')}
            </div>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  const handlePrintAllQR = () => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>All QR Codes - Assets</title>
            <style>
              body { font-family: Arial, sans-serif; }
              .qr-container { display: flex; flex-wrap: wrap; gap: 20px; padding: 20px; }
              .qr-item { border: 1px solid #ccc; padding: 10px; text-align: center; }
              .qr-code { width: 100px; height: 100px; border: 1px solid #000; margin: 10px auto; }
            </style>
          </head>
          <body>
            <h1>All Asset QR Codes</h1>
            <div class="qr-container">
              ${filteredAssets.map(asset => `
                <div class="qr-item">
                  <div class="qr-code">QR</div>
                  <p><strong>${asset.name}</strong></p>
                  <p>ID: ${asset.id}</p>
                  <p>Code: ${asset.code}</p>
                </div>
              `).join('')}
            </div>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    if (value) {
      const filtered = assetData.filter(asset =>
        asset.name.toLowerCase().includes(value.toLowerCase()) ||
        asset.code.toLowerCase().includes(value.toLowerCase()) ||
        asset.assetNo.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredAssets(filtered);
    } else {
      setFilteredAssets(assetData);
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedAssets(filteredAssets.map(asset => asset.id));
    } else {
      setSelectedAssets([]);
    }
  };

  const handleSelectAsset = (assetId: string, checked: boolean) => {
    if (checked) {
      setSelectedAssets([...selectedAssets, assetId]);
    } else {
      setSelectedAssets(selectedAssets.filter(id => id !== assetId));
    }
  };

  const handleViewAsset = (assetId: string) => {
    navigate(`/maintenance/asset/details/${assetId}`);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'In Use':
        return 'bg-green-500 text-white';
      case 'Breakdown':
        return 'bg-red-500 text-white';
      case 'Maintenance':
        return 'bg-yellow-500 text-white';
      case 'Standby':
        return 'bg-blue-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  const handleRefresh = () => {
    window.location.reload();
  };

  const handleColumnChange = (columns: typeof visibleColumns) => {
    setVisibleColumns(columns);
  };

  const handleGridView = () => {
    setVisibleColumns({
      actions: true,
      assetName: true,
      assetId: true,
      assetCode: false,
      assetNo: true,
      assetStatus: true,
      equipmentId: false,
      site: false,
      building: false,
      wing: false,
      floor: false,
      area: false,
      room: false,
      meterType: false,
      assetType: false
    });
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen max-w-full overflow-x-hidden">
      <div className="mb-6">
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
          <span>Assets</span>
          <span>&gt;</span>
          <span>Asset List</span>
        </div>
        <h1 className="text-2xl font-bold text-[#1a1a1a] uppercase">ASSET LIST</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-4 gap-4 mb-6">
        {statData.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg shadow-sm border p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                <p className="text-2xl font-bold" style={{ color: '#1a1a1a' }}>
                  {typeof stat.value === 'number' ? stat.value : stat.value}
                </p>
              </div>
              <div className="ml-2">
                {stat.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-3 mb-6">
        <Button onClick={handleAddAsset} className="bg-[#C72030] hover:bg-[#A61B2A] text-white">
          <Plus className="w-4 h-4 mr-2" />
          Add Asset
        </Button>
        <Button onClick={handleImport} variant="outline" className="text-gray-700 bg-white hover:bg-gray-50">
          <Upload className="w-4 h-4 mr-2" />
          Import
        </Button>
        <Button onClick={handleUpdate} variant="outline" className="text-gray-700 bg-white hover:bg-gray-50">
          <Upload className="w-4 h-4 mr-2" />
          Update
        </Button>
        <Button onClick={handleExportAll} variant="outline" className="text-gray-700 bg-white hover:bg-gray-50">
          <Download className="w-4 h-4 mr-2" />
          Export All
        </Button>
        <Button onClick={handlePrintQR} variant="outline" className="text-gray-700 bg-white hover:bg-gray-50">
          <FileText className="w-4 h-4 mr-2" />
          Print QR
        </Button>
        <Button onClick={handlePrintAllQR} variant="outline" className="text-gray-700 bg-white hover:bg-gray-50">
          <FileText className="w-4 h-4 mr-2" />
          Print All QR
        </Button>
        <Button onClick={() => setIsFilterOpen(true)} variant="outline" className="text-gray-700 bg-white hover:bg-gray-50">
          <Filter className="w-4 h-4 mr-2" />
          Filters
        </Button>
        <Button onClick={handleInActiveAssets} variant="outline" className="text-gray-700 bg-white hover:bg-gray-50">
          <ExternalLink className="w-4 h-4 mr-2" />
          In Active Assets
        </Button>
        <Button onClick={handleRefresh} variant="outline" className="text-gray-700 bg-white hover:bg-gray-50">
          <RotateCcw className="w-4 h-4 mr-2" />
          Refresh
        </Button>
        <Button onClick={handleGridView} variant="outline" className="text-gray-700 bg-white hover:bg-gray-50">
          Grid View
        </Button>
        <ColumnVisibilityDropdown 
          columns={visibleColumns}
          onColumnChange={handleColumnChange}
        />

        <div className="relative ml-auto w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search assets..."
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-10 bg-white"
          />
        </div>
      </div>

      {/* Assets Table */}
      <div className="overflow-x-auto bg-white rounded-lg border border-gray-200 shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="bg-[#f6f4ee]">
              <TableHead>
                <input
                  type="checkbox"
                  checked={selectedAssets.length === filteredAssets.length}
                  onChange={(e) => handleSelectAll(e.target.checked)}
                  className="rounded border-gray-300"
                />
              </TableHead>
              {visibleColumns.actions && <TableHead>Actions</TableHead>}
              {visibleColumns.assetName && <TableHead>Asset Name</TableHead>}
              {visibleColumns.assetId && <TableHead>Asset ID</TableHead>}
              {visibleColumns.assetCode && <TableHead>Asset Code</TableHead>}
              {visibleColumns.assetNo && <TableHead>Asset No.</TableHead>}
              {visibleColumns.assetStatus && <TableHead>Asset Status</TableHead>}
              {visibleColumns.equipmentId && <TableHead>Equipment Id</TableHead>}
              {visibleColumns.site && <TableHead>Site</TableHead>}
              {visibleColumns.building && <TableHead>Building</TableHead>}
              {visibleColumns.wing && <TableHead>Wing</TableHead>}
              {visibleColumns.floor && <TableHead>Floor</TableHead>}
              {visibleColumns.area && <TableHead>Area</TableHead>}
              {visibleColumns.room && <TableHead>Room</TableHead>}
              {visibleColumns.meterType && <TableHead>Meter Type</TableHead>}
              {visibleColumns.assetType && <TableHead>Asset Type</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAssets.map((asset) => (
              <TableRow key={asset.id}>
                <TableCell>
                  <input
                    type="checkbox"
                    checked={selectedAssets.includes(asset.id)}
                    onChange={(e) => handleSelectAsset(asset.id, e.target.checked)}
                    className="rounded border-gray-300"
                  />
                </TableCell>
                {visibleColumns.actions && (
                  <TableCell>
                    <Button variant="ghost" size="sm" onClick={() => handleViewAsset(asset.id)}>
                      <Eye className="w-4 h-4" />
                    </Button>
                  </TableCell>
                )}
                {visibleColumns.assetName && <TableCell>{asset.name}</TableCell>}
                {visibleColumns.assetId && <TableCell style={{ color: '#1a1a1a' }}>{asset.id}</TableCell>}
                {visibleColumns.assetCode && <TableCell className="font-mono text-xs">{asset.code}</TableCell>}
                {visibleColumns.assetNo && <TableCell>{asset.assetNo}</TableCell>}
                {visibleColumns.assetStatus && (
                  <TableCell>
                    <Badge className={`px-3 py-1 text-xs font-medium ${getStatusColor(asset.status)}`}>
                      {asset.status}
                    </Badge>
                  </TableCell>
                )}
                {visibleColumns.equipmentId && <TableCell>{asset.equipmentId}</TableCell>}
                {visibleColumns.site && <TableCell>{asset.site}</TableCell>}
                {visibleColumns.building && <TableCell>{asset.building}</TableCell>}
                {visibleColumns.wing && <TableCell>{asset.wing}</TableCell>}
                {visibleColumns.floor && <TableCell>{asset.floor}</TableCell>}
                {visibleColumns.area && <TableCell>{asset.area}</TableCell>}
                {visibleColumns.room && <TableCell>{asset.room}</TableCell>}
                {visibleColumns.meterType && <TableCell>{asset.meterType}</TableCell>}
                {visibleColumns.assetType && <TableCell>{asset.assetType}</TableCell>}
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <div className="p-4 border-t bg-gray-50 text-sm text-gray-600 text-right">
          Showing 1 - {filteredAssets.length} of {assetData.length} assets
        </div>
      </div>

      {/* Pagination */}
      <div className="mt-6">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious href="#" />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#" isActive>1</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">2</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">3</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">10</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationNext href="#" />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>

      {/* Dialogs */}
      <BulkUploadDialog 
        open={isBulkUploadOpen} 
        onOpenChange={setIsBulkUploadOpen}
        title={uploadType === 'import' ? 'Import Assets' : 'Update Assets'}
      />
      <AssetFilterDialog 
        open={isFilterOpen}
        onOpenChange={setIsFilterOpen}
        onApply={(filters) => console.log('Applied filters:', filters)}
      />
    </div>
  );
};
