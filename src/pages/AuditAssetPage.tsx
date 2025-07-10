
import React, { useState } from 'react';
import { Plus, Download, Filter, Search, ChevronDown, MoreVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

const AuditAssetPage = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const statusCards = [
    { label: 'Scheduled', count: 0, color: 'bg-blue-500' },
    { label: 'In Progress', count: 0, color: 'bg-orange-500' },
    { label: 'Completed', count: 1, color: 'bg-green-500' },
    { label: 'Overdue', count: 0, color: 'bg-red-500' },
    { label: 'Closed', count: 0, color: 'bg-teal-500' }
  ];

  const auditData = [
    {
      auditName: 'Tested',
      auditId: '1',
      type: 'Asset-based',
      startDate: '16/05/2025',
      endDate: '16/05/2025',
      status: 'Completed',
      conductedBy: 'Abdul A'
    }
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Breadcrumb */}
      <div className="text-sm text-gray-600">
        Audit &gt; Audit List
      </div>

      {/* Page Title */}
      <h1 className="text-2xl font-bold text-gray-900">AUDIT LIST</h1>

      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {statusCards.map((card, index) => (
          <Card key={index} className="border-none shadow-md">
            <CardContent className="p-4">
              <div className={`${card.color} text-white rounded-lg p-4 flex items-center gap-3`}>
                <div className="w-8 h-8 bg-white bg-opacity-20 rounded flex items-center justify-center">
                  <span className="text-xs">📋</span>
                </div>
                <div>
                  <div className="text-2xl font-bold">{card.count}</div>
                  <div className="text-sm opacity-90">{card.label}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Action Buttons and Search */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex flex-wrap gap-2">
          <Button className="bg-blue-600 hover:bg-blue-700 text-white">
            <Plus className="w-4 h-4 mr-2" />
            Add
          </Button>
          <Button variant="outline" className="border-gray-300">
            <Download className="w-4 h-4 mr-2" />
            Import
          </Button>
          <Button variant="outline" className="border-gray-300">
            <Filter className="w-4 h-4 mr-2" />
            Filters
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-64"
            />
          </div>
          <Button variant="outline" size="icon">
            <MoreVertical className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Data Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead className="font-semibold text-gray-700">
                  <div className="flex items-center gap-1">
                    Audit Name
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </TableHead>
                <TableHead className="font-semibold text-gray-700">
                  <div className="flex items-center gap-1">
                    Audit ID
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </TableHead>
                <TableHead className="font-semibold text-gray-700">Type</TableHead>
                <TableHead className="font-semibold text-gray-700">Start Date</TableHead>
                <TableHead className="font-semibold text-gray-700">End Date</TableHead>
                <TableHead className="font-semibold text-gray-700">
                  <div className="flex items-center gap-1">
                    Audit Status
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </TableHead>
                <TableHead className="font-semibold text-gray-700">Conducted By</TableHead>
                <TableHead className="font-semibold text-gray-700">Report</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {auditData.map((audit, index) => (
                <TableRow key={index} className="hover:bg-gray-50">
                  <TableCell className="font-medium">{audit.auditName}</TableCell>
                  <TableCell>{audit.auditId}</TableCell>
                  <TableCell>{audit.type}</TableCell>
                  <TableCell>{audit.startDate}</TableCell>
                  <TableCell>{audit.endDate}</TableCell>
                  <TableCell>
                    <span className="bg-green-500 text-white px-3 py-1 rounded text-sm flex items-center gap-1 w-fit">
                      {audit.status}
                      <ChevronDown className="w-3 h-3" />
                    </span>
                  </TableCell>
                  <TableCell>{audit.conductedBy}</TableCell>
                  <TableCell>
                    <Button variant="ghost" size="icon">
                      <Download className="w-4 h-4" />
                    </Button>
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

export default AuditAssetPage;
