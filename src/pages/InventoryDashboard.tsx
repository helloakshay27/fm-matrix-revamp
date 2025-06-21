
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Upload, Download, FileText, Filter, Search, Eye } from 'lucide-react';
import { BulkUploadDialog } from '@/components/BulkUploadDialog';
import { InventoryFilterDialog } from '@/components/InventoryFilterDialog';

const inventoryData = [
  {
    id: '97100',
    name: 'test12',
    referenceNumber: '123987',
    code: '',
    serialNumber: '',
    type: '',
    group: 'CCTV',
    subGroup: 'CCTV Camera',
    category: '',
    manufacturer: '',
    criticality: 'Critical',
    quantity: '8.0',
    active: 'Active',
    unit: '',
    cost: '',
    sacHsnCode: '',
    maxStockLevel: '',
    minStockLevel: '',
    minOrderLevel: '10'
  },
  {
    id: '96857',
    name: 'Test 1234',
    referenceNumber: '123',
    code: '',
    serialNumber: '',
    type: '',
    group: '',
    subGroup: '',
    category: '',
    manufacturer: '',
    criticality: 'Critical',
    quantity: '0.0',
    active: 'Active',
    unit: '',
    cost: '',
    sacHsnCode: '',
    maxStockLevel: '',
    minStockLevel: '',
    minOrderLevel: '10'
  },
  {
    id: '96856',
    name: 'Test Abhi',
    referenceNumber: '123',
    code: '',
    serialNumber: '',
    type: '',
    group: '',
    subGroup: '',
    category: '',
    manufacturer: '',
    criticality: 'Critical',
    quantity: '10.0',
    active: 'Active',
    unit: '',
    cost: '',
    sacHsnCode: '',
    maxStockLevel: '',
    minStockLevel: '',
    minOrderLevel: '10'
  },
  {
    id: '96855',
    name: 'Test Tap',
    referenceNumber: '52666',
    code: '5566',
    serialNumber: '',
    type: '',
    group: 'Daikin',
    subGroup: 'Daikin AC',
    category: '',
    manufacturer: '',
    criticality: 'Non-Critical',
    quantity: '',
    active: 'Active',
    unit: '100.0',
    cost: '',
    sacHsnCode: '',
    maxStockLevel: '',
    minStockLevel: '',
    minOrderLevel: ''
  },
  {
    id: '96834',
    name: 'test',
    referenceNumber: 'cp/01',
    code: '',
    serialNumber: '',
    type: '',
    group: '',
    subGroup: '',
    category: '',
    manufacturer: '',
    criticality: 'Non-Critical',
    quantity: '1.0',
    active: 'Active',
    unit: '',
    cost: '1',
    sacHsnCode: '',
    maxStockLevel: '1',
    minStockLevel: '',
    minOrderLevel: '1'
  },
  {
    id: '96067',
    name: 'Laptop',
    referenceNumber: '1234565454',
    code: 'abc01',
    serialNumber: '',
    type: '',
    group: 'Electronic Devices',
    subGroup: 'Laptops',
    category: '',
    manufacturer: '',
    criticality: 'Non-Critical',
    quantity: '46.0',
    active: 'Active',
    unit: 'Piece',
    cost: '20000.0',
    sacHsnCode: '',
    maxStockLevel: '50',
    minStockLevel: '10',
    minOrderLevel: ''
  },
  {
    id: '69988',
    name: 'Drainex Power',
    referenceNumber: '1234565454',
    code: '',
    serialNumber: '',
    type: 'Consumable',
    group: '',
    subGroup: 'Housekeeping',
    category: '',
    manufacturer: '',
    criticality: 'Non-Critical',
    quantity: '64.0',
    active: 'Active',
    unit: 'Piece',
    cost: '1800.0',
    sacHsnCode: '',
    maxStockLevel: '10',
    minStockLevel: '5',
    minOrderLevel: '3'
  }
];

export const InventoryDashboard = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredInventory, setFilteredInventory] = useState(inventoryData);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  const [showBulkUpload, setShowBulkUpload] = useState(false);
  const [showFilter, setShowFilter] = useState(false);

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    if (value) {
      const filtered = inventoryData.filter(item =>
        item.name.toLowerCase().includes(value.toLowerCase()) ||
        item.id.toLowerCase().includes(value.toLowerCase()) ||
        item.group.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredInventory(filtered);
    } else {
      setFilteredInventory(inventoryData);
    }
  };

  const handleSelectAll = (checked: boolean) => {
    setSelectAll(checked);
    if (checked) {
      setSelectedItems(filteredInventory.map(item => item.id));
    } else {
      setSelectedItems([]);
    }
  };

  const handleSelectItem = (itemId: string, checked: boolean) => {
    if (checked) {
      setSelectedItems([...selectedItems, itemId]);
    } else {
      setSelectedItems(selectedItems.filter(id => id !== itemId));
      setSelectAll(false);
    }
  };

  const handleViewItem = (itemId: string) => {
    navigate(`/maintenance/inventory/details/${itemId}`);
  };

  const handleExport = () => {
    const dataToExport = selectedItems.length > 0 
      ? inventoryData.filter(item => selectedItems.includes(item.id))
      : inventoryData;
    
    console.log('Exporting data:', dataToExport);
    
    // Create CSV content
    const headers = ['ID', 'Name', 'Reference Number', 'Code', 'Group', 'Sub Group', 'Criticality', 'Quantity', 'Active'];
    const csvContent = [
      headers.join(','),
      ...dataToExport.map(item => [
        item.id,
        `"${item.name}"`,
        item.referenceNumber,
        item.code,
        item.group,
        item.subGroup,
        item.criticality,
        item.quantity,
        item.active
      ].join(','))
    ].join('\n');

    // Download CSV file
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `inventory_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handlePrintQR = (printAll = false) => {
    const itemsToPrint = printAll 
      ? inventoryData 
      : inventoryData.filter(item => selectedItems.includes(item.id));
    
    console.log('Printing QR codes for:', itemsToPrint);
    alert(`Printing QR codes for ${itemsToPrint.length} items`);
  };

  return (
    <div className="p-6 bg-[#f6f4ee] min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
          <span>Inventories</span>
          <span>&gt;</span>
          <span>Inventory List</span>
        </div>
        <h1 className="text-2xl font-bold text-[#1a1a1a] uppercase">INVENTORY LIST</h1>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-3 mb-6">
        <Button 
          onClick={() => setShowBulkUpload(true)}
          className="bg-[#C72030] hover:bg-[#A61B2A] text-white"
        >
          <Upload className="w-4 h-4 mr-2" />
          Import
        </Button>
        <Button 
          onClick={handleExport}
          variant="outline" 
          className="border-gray-300 text-gray-700 bg-white hover:bg-gray-50"
        >
          <Download className="w-4 h-4 mr-2" />
          Export
        </Button>
        <Button 
          onClick={() => handlePrintQR(false)}
          variant="outline" 
          className="border-gray-300 text-gray-700 bg-white hover:bg-gray-50"
        >
          <FileText className="w-4 h-4 mr-2" />
          Print QR
        </Button>
        <Button 
          onClick={() => handlePrintQR(true)}
          variant="outline" 
          className="border-gray-300 text-gray-700 bg-white hover:bg-gray-50"
        >
          <FileText className="w-4 h-4 mr-2" />
          Print All QR
        </Button>
        <Button 
          onClick={() => setShowFilter(true)}
          variant="outline" 
          className="border-gray-300 text-gray-700 bg-white hover:bg-gray-50"
        >
          <Filter className="w-4 h-4 mr-2" />
          Filters
        </Button>
        <div className="ml-auto">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search inventory..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-10 w-64 bg-white"
            />
          </div>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="bg-[#f6f4ee]">
              <TableHead className="w-12">
                <input 
                  type="checkbox" 
                  checked={selectAll}
                  onChange={(e) => handleSelectAll(e.target.checked)}
                />
              </TableHead>
              <TableHead>Action</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>ID</TableHead>
              <TableHead>Reference Number</TableHead>
              <TableHead>Code</TableHead>
              <TableHead>Serial Number</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Group</TableHead>
              <TableHead>Sub Group</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Manufacturer</TableHead>
              <TableHead>Criticality</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Active</TableHead>
              <TableHead>Unit</TableHead>
              <TableHead>Cost</TableHead>
              <TableHead>SAC/HSN Code</TableHead>
              <TableHead>Max Stock Level</TableHead>
              <TableHead>Min Stock Level</TableHead>
              <TableHead>Min Order Level</TableHead>
              <TableHead>Asset</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Expiry Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredInventory.map((item) => (
              <TableRow key={item.id}>
                <TableCell>
                  <input 
                    type="checkbox" 
                    checked={selectedItems.includes(item.id)}
                    onChange={(e) => handleSelectItem(item.id, e.target.checked)}
                  />
                </TableCell>
                <TableCell>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => handleViewItem(item.id)}
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                </TableCell>
                <TableCell className="font-medium">{item.name}</TableCell>
                <TableCell>{item.id}</TableCell>
                <TableCell>{item.referenceNumber}</TableCell>
                <TableCell>{item.code}</TableCell>
                <TableCell>{item.serialNumber}</TableCell>
                <TableCell>{item.type}</TableCell>
                <TableCell>{item.group}</TableCell>
                <TableCell>{item.subGroup}</TableCell>
                <TableCell>{item.category}</TableCell>
                <TableCell>{item.manufacturer}</TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded text-xs ${
                    item.criticality === 'Critical' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'
                  }`}>
                    {item.criticality}
                  </span>
                </TableCell>
                <TableCell>{item.quantity}</TableCell>
                <TableCell>
                  <span className="px-2 py-1 rounded text-xs bg-green-100 text-green-700">
                    {item.active}
                  </span>
                </TableCell>
                <TableCell>{item.unit}</TableCell>
                <TableCell>{item.cost}</TableCell>
                <TableCell>{item.sacHsnCode}</TableCell>
                <TableCell>{item.maxStockLevel}</TableCell>
                <TableCell>{item.minStockLevel}</TableCell>
                <TableCell className="text-blue-600">{item.minOrderLevel}</TableCell>
                <TableCell>
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">✓</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">✓</span>
                  </div>
                </TableCell>
                <TableCell></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* Footer with pagination info */}
        <div className="p-4 border-t bg-gray-50">
          <div className="text-sm text-gray-600 text-right">
            Showing 1 - {filteredInventory.length} of {inventoryData.length} items
          </div>
        </div>
      </div>

      {/* Dialogs */}
      <BulkUploadDialog 
        open={showBulkUpload}
        onOpenChange={setShowBulkUpload}
        title="Bulk Upload"
        downloadText="Download Sample Format"
        importText="Import"
      />
      
      <InventoryFilterDialog
        open={showFilter}
        onOpenChange={setShowFilter}
        onApply={(filters) => {
          console.log('Applied filters:', filters);
          // Apply filter logic here
        }}
      />
    </div>
  );
};
