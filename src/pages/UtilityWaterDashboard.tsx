
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { Search, Plus, Import, RefreshCw, FileDown, Printer, Filter } from 'lucide-react';

export const UtilityWaterDashboard = () => {
  const [searchTerm, setSearchTerm] = useState('');

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
        <Button className="bg-green-600 hover:bg-green-700">
          <Plus className="w-4 h-4 mr-2" />
          Add
        </Button>
        <Button variant="outline">
          <Import className="w-4 h-4 mr-2" />
          Import
        </Button>
        <Button variant="outline">
          <RefreshCw className="w-4 h-4 mr-2" />
          Update
        </Button>
        <Button variant="outline">
          <FileDown className="w-4 h-4 mr-2" />
          Export All
        </Button>
        <Button variant="outline">
          <Printer className="w-4 h-4 mr-2" />
          Print QR
        </Button>
        <Badge variant="secondary" className="px-4 py-2">
          In-Active Assets
        </Badge>
      </div>

      {/* Search and Filter */}
      <div className="flex justify-between items-center">
        <Button variant="outline">
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
          <Button className="bg-green-600 hover:bg-green-700">
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
    </div>
  );
};

export default UtilityWaterDashboard;
