import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Download, Upload, Filter, Eye, Edit2 } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent } from '@/components/ui/card';

const InventoryConsumptionDashboard = () => {
  const [consumptionData] = useState([
    {
      id: 1,
      inventory: 'Handwash',
      stock: '0.0',
      unit: '',
      minStockLevel: '2',
      group: '-',
      subGroup: '-',
      criticality: 'Non-Critical'
    },
    {
      id: 2,
      inventory: 'Notepad',
      stock: '3.0',
      unit: '',
      minStockLevel: '2',
      group: '-',
      subGroup: '-',
      criticality: 'Non-Critical'
    },
    {
      id: 3,
      inventory: 'Pen',
      stock: '3.0',
      unit: '',
      minStockLevel: '3',
      group: '-',
      subGroup: '-',
      criticality: 'Non-Critical'
    },
    {
      id: 4,
      inventory: 'Sanitizer',
      stock: '9.0',
      unit: '',
      minStockLevel: '1',
      group: '-',
      subGroup: '-',
      criticality: 'Non-Critical'
    },
    {
      id: 5,
      inventory: 'Tissue Paper',
      stock: '4.0',
      unit: '',
      minStockLevel: '5',
      group: '-',
      subGroup: '-',
      criticality: 'Non-Critical'
    },
    {
      id: 6,
      inventory: 'Phenyl',
      stock: '5.0',
      unit: '',
      minStockLevel: '1',
      group: '-',
      subGroup: '-',
      criticality: 'Non-Critical'
    },
    {
      id: 7,
      inventory: 'Toilet Paper',
      stock: '5.0',
      unit: '',
      minStockLevel: '5',
      group: '-',
      subGroup: '-',
      criticality: 'Non-Critical'
    }
  ]);

  return (
    <div className="p-6 space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center space-x-2 text-sm text-gray-600">
        <span>Inventory Consumption</span>
        <span>{">"}</span>
        <span className="text-gray-900 font-medium">Consumption List</span>
      </div>

      {/* Header */}
      <div className="space-y-4">
        <h1 className="text-2xl font-bold text-gray-900">Consumption LIST</h1>
        
        {/* Action buttons */}
        <div className="flex gap-3">
          <Button 
            className="bg-[#C72030] text-white hover:bg-[#A01B28] transition-colors duration-200 rounded-lg px-4 py-2 h-10 text-sm font-medium flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Import
          </Button>
          <Button 
            className="bg-[#C72030] text-white hover:bg-[#A01B28] transition-colors duration-200 rounded-lg px-4 py-2 h-10 text-sm font-medium flex items-center gap-2"
          >
            Export
          </Button>
          <Button 
            variant="outline"
            className="border border-gray-400 text-gray-700 hover:bg-gray-50 transition-colors duration-200 rounded-lg px-4 py-2 h-10 text-sm font-medium flex items-center gap-2"
          >
            <Filter className="w-4 h-4" />
            Filter
          </Button>
        </div>
      </div>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="font-semibold text-gray-900">Actions</TableHead>
                <TableHead className="font-semibold text-gray-900">View</TableHead>
                <TableHead className="font-semibold text-gray-900">Inventory</TableHead>
                <TableHead className="font-semibold text-gray-900">Stock</TableHead>
                <TableHead className="font-semibold text-gray-900">Unit</TableHead>
                <TableHead className="font-semibold text-gray-900">Min. Stock Level</TableHead>
                <TableHead className="font-semibold text-gray-900">Group</TableHead>
                <TableHead className="font-semibold text-gray-900">Sub Group</TableHead>
                <TableHead className="font-semibold text-gray-900">Criticality</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {consumptionData.map((item) => (
                <TableRow key={item.id} className="hover:bg-gray-50">
                  <TableCell>
                    <Button 
                      size="sm"
                      variant="ghost"
                      className="h-8 w-8 p-0 hover:bg-gray-100"
                    >
                      <Edit2 className="w-4 h-4 text-gray-600" />
                    </Button>
                  </TableCell>
                  <TableCell>
                    <Button 
                      size="sm"
                      variant="ghost"
                      className="h-8 w-8 p-0 hover:bg-gray-100"
                    >
                      <Eye className="w-4 h-4 text-gray-600" />
                    </Button>
                  </TableCell>
                  <TableCell className="font-medium">{item.inventory}</TableCell>
                  <TableCell>{item.stock}</TableCell>
                  <TableCell>{item.unit}</TableCell>
                  <TableCell>{item.minStockLevel}</TableCell>
                  <TableCell>{item.group}</TableCell>
                  <TableCell>{item.subGroup}</TableCell>
                  <TableCell>
                    <span className="text-sm text-gray-600">{item.criticality}</span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default InventoryConsumptionDashboard;