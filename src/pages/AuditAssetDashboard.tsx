
import React from 'react';
import { Plus, Download, Filter, Search, Grid2x2, Download as DownloadIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const AuditAssetDashboard = () => {
  const stats = [
    { label: 'Scheduled', count: 0, color: 'bg-blue-500', icon: '📅' },
    { label: 'In Progress', count: 0, color: 'bg-orange-500', icon: '🎯' },
    { label: 'Completed', count: 1, color: 'bg-green-500', icon: '📦' },
    { label: 'Overdue', count: 0, color: 'bg-red-500', icon: '⏰' },
    { label: 'Closed', count: 0, color: 'bg-teal-500', icon: '📦' },
  ];

  const auditData = [
    {
      auditName: 'Tested',
      auditId: '1',
      type: 'Asset-based',
      startDate: '16/05/2025',
      endDate: '16/05/2025',
      auditStatus: 'Completed',
      conductedBy: 'Abdul A',
      report: true
    }
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-screen" style={{ marginLeft: '16rem' }}>
      {/* Breadcrumb */}
      <div className="mb-4">
        <nav className="text-sm text-gray-600">
          <span>Audit</span>
          <span className="mx-2">{'>'}</span>
          <span>Audit List</span>
        </nav>
      </div>

      {/* Title */}
      <h1 className="text-2xl font-bold text-gray-900 mb-6">AUDIT LIST</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-5 gap-4 mb-6">
        {stats.map((stat, index) => (
          <div key={index} className={`${stat.color} text-white rounded-lg p-4 flex items-center gap-3`}>
            <div className="text-2xl">{stat.icon}</div>
            <div>
              <div className="text-2xl font-bold">{stat.count}</div>
              <div className="text-sm">{stat.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex gap-3">
          <Button className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Add
          </Button>
          <Button variant="outline" className="flex items-center gap-2">
            <Download className="w-4 h-4" />
            Import
          </Button>
          <Button variant="outline" className="flex items-center gap-2">
            <Filter className="w-4 h-4" />
            Filters
          </Button>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input 
              placeholder="Search" 
              className="pl-10 w-80"
            />
          </div>
          <Button variant="outline" size="icon">
            <Grid2x2 className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="icon">
            <DownloadIcon className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white rounded-lg shadow">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="font-semibold">Audit Name ↑↓</TableHead>
              <TableHead className="font-semibold">Audit ID ↑↓</TableHead>
              <TableHead className="font-semibold">Type</TableHead>
              <TableHead className="font-semibold">Start Date</TableHead>
              <TableHead className="font-semibold">End Date</TableHead>
              <TableHead className="font-semibold">Audit Status ↑↓</TableHead>
              <TableHead className="font-semibold">Conducted By</TableHead>
              <TableHead className="font-semibold">Report</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {auditData.map((audit, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium">{audit.auditName}</TableCell>
                <TableCell>{audit.auditId}</TableCell>
                <TableCell>{audit.type}</TableCell>
                <TableCell>{audit.startDate}</TableCell>
                <TableCell>{audit.endDate}</TableCell>
                <TableCell>
                  <span className="bg-green-500 text-white px-3 py-1 rounded text-sm font-medium">
                    {audit.auditStatus} ▼
                  </span>
                </TableCell>
                <TableCell>{audit.conductedBy}</TableCell>
                <TableCell>
                  {audit.report && (
                    <Button variant="ghost" size="icon">
                      <DownloadIcon className="w-4 h-4" />
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default AuditAssetDashboard;
