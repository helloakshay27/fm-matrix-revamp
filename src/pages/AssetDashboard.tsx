import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Plus, Upload, Download, FileText, Search, Filter, Eye, Settings, DollarSign, Laptop, Monitor, Package, AlertTriangle, Trash2, RotateCcw, Grid3X3, ExternalLink } from 'lucide-react';
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
    name: 'sdcsdc',
    code: '026d4956a50be20318za',
    assetNo: 'sdcsdc',
    status: 'In Use',
    equipmentId: '',
    site: 'Located',
    building: 'sebc',
    wing: '',
    floor: '',
    area: '',
    room: '',
    meterType: '',
    assetType: 'Comprehensive'
  },
  {
    id: '203694',
    name: 'Test History',
    code: '5e298bffcab011bb6e16',
    assetNo: 'f3212',
    status: 'Breakdown',
    equipmentId: 'r34f6S',
    site: 'Located',
    building: 'jyoti tower',
    wing: '',
    floor: '',
    area: '',
    room: '',
    meterType: '',
    assetType: 'Parent Meter'
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

  // Calculate stats dynamically from asset data
  const stats = useMemo(() => {
    const totalAssets = assetData.length;
    const inUseAssets = assetData.filter(asset => asset.status === 'In Use').length;
    const breakdownAssets = assetData.filter(asset => asset.status === 'Breakdown').length;
    const itAssets = assetData.filter(asset => asset.assetType === 'Parent Meter').length;
    const nonItAssets = totalAssets - itAssets;
    const totalValue = 0; // This would be calculated from actual asset values
    const inStoreAssets = 0; // This would be calculated from assets with 'In Store' status
    const disposeAssets = 0; // This would be calculated from assets marked for disposal
    
    return {
      total: totalAssets,
      inUse: inUseAssets,
      breakdown: breakdownAssets,
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

  return (
    <div className="p-6 bg-gray-50 min-h-screen max-w-full overflow-x-hidden">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
          <span>Assets</span>
          <span>&gt;</span>
          <span>Asset List</span>
        </div>
        <h1 className="text-2xl font-bold text-[#1a1a1a] uppercase">ASSET LIST</h1>
      </div>

      {/* Stats Cards - Restored original styling */}
      <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-4 gap-4 mb-6">
        {statData.map((item, i) => (
          <div
            key={i}
            className="bg-[#f6f4ee] p-6 rounded-lg shadow-[0px_2px_18px_rgba(45,45,45,0.1)] flex items-center gap-4"
          >
            {/* Icon with circle background */}
            <div className="w-14 h-14 bg-[#FBEDEC] rounded-full flex items-center justify-center">
              {item.icon}
            </div>

            {/* Text block */}
            <div>
              <div className="text-2xl font-bold text-[#C72030]">{item.value}</div>
              <div className="text-sm font-medium text-gray-600">{item.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* First Row of Action Buttons - Updated styling */}
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <Button 
          onClick={handleAddAsset}
          className="bg-[#1e40af] hover:bg-[#1e40af]/90 text-white px-6"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add
        </Button>

        <Button 
          onClick={handleImport}
          className="bg-[#1e40af] hover:bg-[#1e40af]/90 text-white px-4"
        >
          <Upload className="w-4 h-4 mr-2" />
          Import
        </Button>
        
        <Button 
          onClick={handleUpdate}
          className="bg-[#1e40af] hover:bg-[#1e40af]/90 text-white px-4"
        >
          <Download className="w-4 h-4 mr-2" />
          Download QR All Asset
        </Button>
        
        <Button 
          onClick={() => setIsFilterOpen(true)}
          variant="outline" 
          className="border-gray-600 text-gray-800 bg-white hover:bg-gray-50 px-4"
        >
          <Filter className="w-4 h-4 mr-2" />
          Filters
        </Button>

        {/* Search Box and additional buttons aligned to right */}
        <div className="flex items-center gap-2 ml-auto">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search"
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-10 w-64 bg-white border-gray-300"
            />
          </div>
          
          <Button 
            variant="outline" 
            size="icon"
            onClick={handleRefresh}
            className="border-gray-300 text-gray-600 bg-white hover:bg-gray-50"
          >
            <RotateCcw className="w-4 h-4" />
          </Button>
          
          <ColumnVisibilityDropdown 
            visibleColumns={visibleColumns}
            onColumnChange={handleColumnChange}
          />
          
          <Button 
            variant="outline" 
            size="icon"
            className="border-gray-300 text-gray-600 bg-white hover:bg-gray-50"
          >
            <ExternalLink className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Asset Table */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50 border-b border-gray-200">
                <TableHead className="w-12 px-4 py-3">
                  <input 
                    type="checkbox" 
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    checked={selectedAssets.length === filteredAssets.length && filteredAssets.length > 0}
                    className="rounded border-gray-300"
                  />
                </TableHead>
                {visibleColumns.actions && (
                  <TableHead className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</TableHead>
                )}
                {visibleColumns.assetName && (
                  <TableHead className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Asset Name</TableHead>
                )}
                {visibleColumns.assetId && (
                  <TableHead className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Asset ID</TableHead>
                )}
                {visibleColumns.assetCode && (
                  <TableHead className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Asset Code</TableHead>
                )}
                {visibleColumns.assetNo && (
                  <TableHead className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Asset No.</TableHead>
                )}
                {visibleColumns.assetStatus && (
                  <TableHead className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Asset Status</TableHead>
                )}
                {visibleColumns.equipmentId && (
                  <TableHead className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Equipment Id</TableHead>
                )}
                {visibleColumns.site && (
                  <TableHead className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Site</TableHead>
                )}
                {visibleColumns.building && (
                  <TableHead className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Building</TableHead>
                )}
                {visibleColumns.wing && (
                  <TableHead className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Wing</TableHead>
                )}
                {visibleColumns.floor && (
                  <TableHead className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Floor</TableHead>
                )}
                {visibleColumns.area && (
                  <TableHead className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Area</TableHead>
                )}
                {visibleColumns.room && (
                  <TableHead className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Room</TableHead>
                )}
                {visibleColumns.meterType && (
                  <TableHead className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Meter Type</TableHead>
                )}
                {visibleColumns.assetType && (
                  <TableHead className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Asset Type</TableHead>
                )}
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAssets.map((asset) => (
                <TableRow key={asset.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <TableCell className="px-4 py-3">
                    <input 
                      type="checkbox" 
                      checked={selectedAssets.includes(asset.id)}
                      onChange={(e) => handleSelectAsset(asset.id, e.target.checked)}
                      className="rounded border-gray-300"
                    />
                  </TableCell>
                  {visibleColumns.actions && (
                    <TableCell className="px-4 py-3">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleViewAsset(asset.id)}
                        className="p-1 h-8 w-8"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  )}
                  {visibleColumns.assetName && (
                    <TableCell className="px-4 py-3 text-sm font-medium text-gray-900">{asset.name}</TableCell>
                  )}
                  {visibleColumns.assetId && (
                    <TableCell className="px-4 py-3 text-sm text-gray-600">{asset.id}</TableCell>
                  )}
                  {visibleColumns.assetCode && (
                    <TableCell className="px-4 py-3 text-sm text-gray-600 font-mono">{asset.code}</TableCell>
                  )}
                  {visibleColumns.assetNo && (
                    <TableCell className="px-4 py-3 text-sm text-gray-600">{asset.assetNo}</TableCell>
                  )}
                  {visibleColumns.assetStatus && (
                    <TableCell className="px-4 py-3">
                      <Badge className={`${getStatusColor(asset.status)} text-xs px-2 py-1`}>
                        {asset.status}
                      </Badge>
                    </TableCell>
                  )}
                  {visibleColumns.equipmentId && (
                    <TableCell className="px-4 py-3 text-sm text-gray-600">{asset.equipmentId}</TableCell>
                  )}
                  {visibleColumns.site && (
                    <TableCell className="px-4 py-3 text-sm text-gray-600">{asset.site}</TableCell>
                  )}
                  {visibleColumns.building && (
                    <TableCell className="px-4 py-3 text-sm text-gray-600">{asset.building}</TableCell>
                  )}
                  {visibleColumns.wing && (
                    <TableCell className="px-4 py-3 text-sm text-gray-600">{asset.wing}</TableCell>
                  )}
                  {visibleColumns.floor && (
                    <TableCell className="px-4 py-3 text-sm text-gray-600">{asset.floor}</TableCell>
                  )}
                  {visibleColumns.area && (
                    <TableCell className="px-4 py-3 text-sm text-gray-600">{asset.area}</TableCell>
                  )}
                  {visibleColumns.room && (
                    <TableCell className="px-4 py-3 text-sm text-gray-600">{asset.room}</TableCell>
                  )}
                  {visibleColumns.meterType && (
                    <TableCell className="px-4 py-3 text-sm text-gray-600">{asset.meterType}</TableCell>
                  )}
                  {visibleColumns.assetType && (
                    <TableCell className="px-4 py-3 text-sm text-gray-600">{asset.assetType}</TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Updated Pagination */}
      <div className="mt-6">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious href="#" />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#" isActive>
                1
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">
                2
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">
                3
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">
                4
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">
                5
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">
                6
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">
                7
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">
                8
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">
                Last
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationNext href="#" />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>

      {/* Modals */}
      <BulkUploadDialog 
        open={isBulkUploadOpen}
        onOpenChange={setIsBulkUploadOpen}
        title={uploadType === 'import' ? 'Import Assets' : 'Update Assets'}
      />

      <AssetFilterDialog 
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
      />
    </div>
  );
};
