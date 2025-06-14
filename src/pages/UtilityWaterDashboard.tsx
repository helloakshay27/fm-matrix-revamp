
import React, { useState } from 'react';
import { Plus, Download, Upload, FileText, QrCode, Search, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

export const UtilityWaterDashboard = () => {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="p-6 space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center space-x-2 text-sm text-gray-600">
        <span>Assets</span>
        <span>{'>'}</span>
        <span>Asset List</span>
      </div>

      {/* Page Title */}
      <h1 className="text-2xl font-bold text-gray-900">ASSET LIST</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-red-500 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-red-100 text-sm">Total Asset</p>
                <p className="text-3xl font-bold">0</p>
              </div>
              <div className="w-12 h-12 bg-red-400 rounded-full flex items-center justify-center">
                <FileText className="w-6 h-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-green-500 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm">In Use</p>
                <p className="text-3xl font-bold">0</p>
              </div>
              <div className="w-12 h-12 bg-green-400 rounded-full flex items-center justify-center">
                <FileText className="w-6 h-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-red-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-red-100 text-sm">Breakdown</p>
                <p className="text-3xl font-bold">0</p>
              </div>
              <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center">
                <FileText className="w-6 h-6" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-2">
        <Button className="bg-purple-600 hover:bg-purple-700">
          <Plus className="w-4 h-4 mr-2" />
          Add
        </Button>
        <Button variant="outline">
          <Download className="w-4 h-4 mr-2" />
          Import
        </Button>
        <Button variant="outline">
          <Upload className="w-4 h-4 mr-2" />
          Update
        </Button>
        <Button variant="outline">
          <Download className="w-4 h-4 mr-2" />
          Export All
        </Button>
        <Button variant="outline">
          <QrCode className="w-4 h-4 mr-2" />
          Print QR
        </Button>
        <Button variant="outline">
          In-Active Assets
        </Button>
      </div>

      {/* Search and Filter Section */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <Button variant="outline">
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </Button>
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
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
        </CardContent>
      </Card>

      {/* Data Table */}
      <Card>
        <CardContent className="p-0">
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
              <TableRow>
                <TableCell colSpan={16} className="text-center py-8 text-gray-500">
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
