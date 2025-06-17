
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Upload, Download, FileText, Filter, Search, Eye } from 'lucide-react';

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
  // Add more sample data as needed
];

export const InventoryDashboard = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredInventory, setFilteredInventory] = useState(inventoryData);

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

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <p className="text-[#1a1a1a] opacity-70 mb-2">Inventories &gt; Inventory List</p>
        <h1 className="text-2xl font-bold text-[#1a1a1a]">INVENTORY LIST</h1>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-3 mb-6">
        <Button style={{ backgroundColor: '#C72030' }} className="text-white">
          <Upload className="w-4 h-4 mr-2" />
          Import
        </Button>
        <Button style={{ backgroundColor: '#C72030' }} className="text-white">
          <Download className="w-4 h-4 mr-2" />
          Export
        </Button>
        <Button style={{ backgroundColor: '#C72030' }} className="text-white">
          <FileText className="w-4 h-4 mr-2" />
          Print QR
        </Button>
        <Button style={{ backgroundColor: '#C72030' }} className="text-white">
          <FileText className="w-4 h-4 mr-2" />
          Print All QR
        </Button>
        <Button variant="outline" className="border-[#C72030] text-[#C72030]">
          <Filter className="w-4 h-4 mr-2" />
          Filters
        </Button>
      </div>

      {/* Inventory Table */}
      <div className="bg-white rounded-lg border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <input type="checkbox" />
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
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredInventory.map((item) => (
              <TableRow key={item.id}>
                <TableCell>
                  <input type="checkbox" />
                </TableCell>
                <TableCell>
                  <Button variant="ghost" size="sm">
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
                <TableCell>{item.active}</TableCell>
                <TableCell>{item.unit}</TableCell>
                <TableCell>{item.cost}</TableCell>
                <TableCell>{item.sacHsnCode}</TableCell>
                <TableCell>{item.maxStockLevel}</TableCell>
                <TableCell>{item.minStockLevel}</TableCell>
                <TableCell className="text-blue-600">{item.minOrderLevel}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* Footer with pagination info */}
        <div className="p-4 border-t bg-gray-50">
          <div className="text-sm text-gray-600 text-right">
            Showing 1 - 15 of 72 items
          </div>
        </div>
      </div>
    </div>
  );
};
