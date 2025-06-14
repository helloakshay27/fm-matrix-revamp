
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  ChevronDown,
  Upload,
  Download,
  Filter,
  Search,
  Eye,
  Printer,
  FileText
} from 'lucide-react';

export const InventoryDashboard = () => {
  const [searchTerm, setSearchTerm] = useState('');

  // Sample inventory data matching the image
  const inventoryData = [
    {
      id: '97700',
      name: 'test12',
      referenceNumber: '',
      code: '123987',
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
      minOrderLevel: ''
    },
    {
      id: '96857',
      name: 'Test 1234',
      referenceNumber: '',
      code: '123',
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
      maxStockLevel: '10',
      minStockLevel: '',
      minOrderLevel: ''
    },
    {
      id: '96856',
      name: 'Test Abhi',
      referenceNumber: '',
      code: '123',
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
      maxStockLevel: '10',
      minStockLevel: '',
      minOrderLevel: ''
    },
    {
      id: '96855',
      name: 'Test lap',
      referenceNumber: '',
      code: '52666',
      serialNumber: '5566',
      type: '',
      group: 'Daikin',
      subGroup: 'Daikin AC',
      category: '',
      manufacturer: '',
      criticality: 'Non-Critical',
      quantity: '',
      active: 'Active',
      unit: '1000.0',
      cost: '',
      sacHsnCode: '',
      maxStockLevel: '',
      minStockLevel: '',
      minOrderLevel: ''
    },
    {
      id: '96834',
      name: 'test',
      referenceNumber: '',
      code: 'ca/01',
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
      cost: '',
      sacHsnCode: '',
      maxStockLevel: '1',
      minStockLevel: '1',
      minOrderLevel: ''
    },
    {
      id: '96567',
      name: 'Laptop',
      referenceNumber: '',
      code: '1234565454',
      serialNumber: 'abc01',
      type: '',
      group: 'Electronic Devices',
      subGroup: 'Laptops',
      category: '',
      manufacturer: '',
      criticality: 'Non-Critical',
      quantity: '46.0',
      active: 'Active',
      unit: 'Piece',
      cost: '30000.0',
      sacHsnCode: '',
      maxStockLevel: '30',
      minStockLevel: '10',
      minOrderLevel: 'Lap'
    },
    {
      id: '69988',
      name: 'Drainex Power',
      referenceNumber: '',
      code: '1234565454',
      serialNumber: '',
      type: 'Consumable',
      group: '',
      subGroup: 'Housekeeping',
      category: '',
      manufacturer: '',
      criticality: 'Non-Critical',
      quantity: '84.5',
      active: 'Active',
      unit: 'Piece',
      cost: '180.0',
      sacHsnCode: '',
      maxStockLevel: '10',
      minStockLevel: '5',
      minOrderLevel: '2'
    },
    {
      id: '69987',
      name: 'Salwar Big',
      referenceNumber: '',
      code: '1234565454',
      serialNumber: '',
      type: 'Consumable',
      group: '',
      subGroup: 'Pantry',
      category: '',
      manufacturer: '',
      criticality: 'Critical',
      quantity: '84.5',
      active: 'Active',
      unit: 'Nos',
      cost: '2640.0',
      sacHsnCode: '',
      maxStockLevel: '',
      minStockLevel: '5',
      minOrderLevel: '3'
    },
    {
      id: '69986',
      name: 'Cruel Set',
      referenceNumber: '',
      code: '1234565454',
      serialNumber: '',
      type: 'Consumable',
      group: '',
      subGroup: 'Pantry',
      category: '',
      manufacturer: '',
      criticality: 'Critical',
      quantity: '149.0',
      active: 'Active',
      unit: 'Piece',
      cost: '130.0',
      sacHsnCode: '',
      maxStockLevel: '30',
      minStockLevel: '10',
      minOrderLevel: '5'
    },
    {
      id: '69985',
      name: 'Soft Broom',
      referenceNumber: '',
      code: '1234565454',
      serialNumber: '',
      type: 'Consumable',
      group: '',
      subGroup: 'Housekeeping',
      category: '',
      manufacturer: '',
      criticality: 'Non-Critical',
      quantity: '90.0',
      active: 'Active',
      unit: 'Packet',
      cost: '17.0',
      sacHsnCode: '',
      maxStockLevel: '10',
      minStockLevel: '10',
      minOrderLevel: '5'
    },
    {
      id: '69984',
      name: 'Carpet Brush',
      referenceNumber: '',
      code: '1234565454',
      serialNumber: '',
      type: 'Consumable',
      group: '',
      subGroup: 'Housekeeping',
      category: '',
      manufacturer: '',
      criticality: 'Non-Critical',
      quantity: '59.0',
      active: 'Active',
      unit: 'Piece',
      cost: '70.0',
      sacHsnCode: '',
      maxStockLevel: '10',
      minStockLevel: '2',
      minOrderLevel: '2'
    },
    {
      id: '69983',
      name: 'Fevi Kwik',
      referenceNumber: '',
      code: '1234565454',
      serialNumber: '',
      type: 'Consumable',
      group: '',
      subGroup: 'Stationary',
      category: '',
      manufacturer: '',
      criticality: 'Non-Critical',
      quantity: '',
      active: 'Active',
      unit: 'Piece',
      cost: '4.9',
      sacHsnCode: '',
      maxStockLevel: '20',
      minStockLevel: '10',
      minOrderLevel: ''
    },
    {
      id: '69982',
      name: 'Green Scrubber',
      referenceNumber: '',
      code: 'CR/01',
      serialNumber: '',
      type: 'Consumable',
      group: '',
      subGroup: 'Pantry',
      category: '',
      manufacturer: '',
      criticality: 'Critical',
      quantity: '',
      active: 'Active',
      unit: 'Packet',
      cost: '190.0',
      sacHsnCode: '',
      maxStockLevel: '10',
      minStockLevel: '5',
      minOrderLevel: '5'
    },
    {
      id: '69981',
      name: 'Box File',
      referenceNumber: '',
      code: 'BF/01',
      serialNumber: '',
      type: 'Consumable',
      group: '',
      subGroup: 'Stationary',
      category: '',
      manufacturer: '',
      criticality: 'Non-Critical',
      quantity: '',
      active: 'Active',
      unit: 'Piece',
      cost: '65.0',
      sacHsnCode: '',
      maxStockLevel: '15',
      minStockLevel: '5',
      minOrderLevel: '3'
    },
    {
      id: '69980',
      name: 'Sketch Pen',
      referenceNumber: '',
      code: 'SP/01',
      serialNumber: '',
      type: 'Consumable',
      group: '',
      subGroup: 'Stationary',
      category: '',
      manufacturer: '',
      criticality: 'Non-Critical',
      quantity: '',
      active: 'Active',
      unit: 'Box',
      cost: '30.0',
      sacHsnCode: '',
      maxStockLevel: '3',
      minStockLevel: '1',
      minOrderLevel: '1'
    }
  ];

  return (
    <div className="flex-1 p-6 bg-white min-h-screen">
      {/* Breadcrumb */}
      <div className="mb-4">
        <span className="text-sm text-gray-600">Inventories {'>'} Inventory List</span>
      </div>

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">INVENTORY LIST</h1>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2 mb-6">
        <Button className="bg-blue-600 hover:bg-blue-700 text-white">
          <Upload className="w-4 h-4 mr-2" />
          Import
        </Button>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white">
          <Download className="w-4 h-4 mr-2" />
          Export
        </Button>
        <Button className="bg-red-600 hover:bg-red-700 text-white">
          <Printer className="w-4 h-4 mr-2" />
          Print QR
        </Button>
        <Button className="bg-red-600 hover:bg-red-700 text-white">
          <Printer className="w-4 h-4 mr-2" />
          Print All QR
        </Button>
        <Button variant="outline" className="border-gray-300">
          <Filter className="w-4 h-4 mr-2" />
          Filters
        </Button>
      </div>

      {/* Table */}
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="w-12">
                <input type="checkbox" className="rounded" />
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
              <TableHead>Max. Stock Level</TableHead>
              <TableHead>Min. Stock Level</TableHead>
              <TableHead>Min.Order Level</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {inventoryData.map((item, index) => (
              <TableRow key={item.id} className="hover:bg-gray-50">
                <TableCell>
                  <input type="checkbox" className="rounded" />
                </TableCell>
                <TableCell>
                  <Eye className="w-4 h-4 text-gray-500 cursor-pointer" />
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
                    item.criticality === 'Critical' 
                      ? 'bg-red-100 text-red-800' 
                      : 'bg-green-100 text-green-800'
                  }`}>
                    {item.criticality}
                  </span>
                </TableCell>
                <TableCell>{item.quantity}</TableCell>
                <TableCell>
                  <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs">
                    {item.active}
                  </span>
                </TableCell>
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
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between mt-4">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="w-8 h-8 p-0">1</Button>
          <Button variant="outline" size="sm" className="w-8 h-8 p-0">2</Button>
          <Button variant="outline" size="sm" className="w-8 h-8 p-0">3</Button>
          <Button variant="outline" size="sm" className="w-8 h-8 p-0">4</Button>
          <Button variant="outline" size="sm" className="w-8 h-8 p-0">5</Button>
          <Button variant="outline" size="sm" className="w-8 h-8 p-0">6</Button>
          <Button variant="outline" size="sm" className="bg-purple-600 text-white">Last {'>>'}</Button>
        </div>
        <div className="text-sm text-gray-600">
          Showing 1 - 15 of 72 items
        </div>
      </div>

      {/* Footer */}
      <div className="mt-8 text-center text-sm text-gray-600">
        Powered by{' '}
        <span className="font-semibold">
          <span className="text-orange-500">go</span>Phygital.work
        </span>
      </div>
    </div>
  );
};

export default InventoryDashboard;
