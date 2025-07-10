
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { 
  Plus, 
  Download, 
  Filter, 
  Search, 
  MoreHorizontal, 
  Calendar,
  Target,
  CheckCircle,
  Clock,
  XCircle,
  FileText
} from 'lucide-react';

export const AuditListDashboard = () => {
  const [searchTerm, setSearchTerm] = useState('');

  // Sample data matching the image
  const auditData = [
    {
      id: 1,
      auditName: 'Tested',
      type: 'Asset-based',
      startDate: '16/05/2025',
      endDate: '16/05/2025',
      status: 'Completed',
      conductedBy: 'Abdul A'
    }
  ];

  const stats = [
    { label: 'Scheduled', count: 0, color: 'bg-blue-500', icon: Calendar },
    { label: 'In Progress', count: 0, color: 'bg-orange-500', icon: Clock },
    { label: 'Completed', count: 1, color: 'bg-green-500', icon: CheckCircle },
    { label: 'Overdue', count: 0, color: 'bg-red-500', icon: XCircle },
    { label: 'Closed', count: 0, color: 'bg-teal-600', icon: Target }
  ];

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      'Completed': 'bg-green-500 text-white',
      'In Progress': 'bg-orange-500 text-white',
      'Scheduled': 'bg-blue-500 text-white',
      'Overdue': 'bg-red-500 text-white',
      'Closed': 'bg-teal-600 text-white'
    };
    
    return statusConfig[status as keyof typeof statusConfig] || 'bg-gray-500 text-white';
  };

  return (
    <div className="p-6 space-y-6">
      {/* Breadcrumb */}
      <div className="text-sm text-gray-600 mb-2">
        Audit &gt; Audit List
      </div>

      {/* Page Title */}
      <h1 className="text-2xl font-bold text-gray-900 mb-6">AUDIT LIST</h1>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        {stats.map((stat, index) => (
          <div key={index} className={`${stat.color} text-white rounded-lg p-4 flex items-center gap-3`}>
            <stat.icon className="w-8 h-8" />
            <div>
              <div className="text-2xl font-bold">{stat.count}</div>
              <div className="text-sm">{stat.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div className="flex flex-wrap gap-2">
          <Button 
            style={{ backgroundColor: '#1e3a8a' }}
            className="text-white hover:opacity-90"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add
          </Button>
          <Button 
            variant="outline"
            style={{ backgroundColor: '#1e3a8a' }}
            className="text-white border-blue-800 hover:opacity-90"
          >
            <Download className="w-4 h-4 mr-2" />
            Import
          </Button>
          <Button 
            variant="outline"
            className="border-gray-300 text-gray-700 hover:bg-gray-50"
          >
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
            <MoreHorizontal className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="font-semibold text-gray-700">
                Audit Name <span className="ml-1">↕</span>
              </TableHead>
              <TableHead className="font-semibold text-gray-700">
                Audit ID <span className="ml-1">↕</span>
              </TableHead>
              <TableHead className="font-semibold text-gray-700">Type</TableHead>
              <TableHead className="font-semibold text-gray-700">Start Date</TableHead>
              <TableHead className="font-semibold text-gray-700">End Date</TableHead>
              <TableHead className="font-semibold text-gray-700">
                Audit Status <span className="ml-1">↕</span>
              </TableHead>
              <TableHead className="font-semibold text-gray-700">Conducted By</TableHead>
              <TableHead className="font-semibold text-gray-700">Report</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {auditData.map((audit) => (
              <TableRow key={audit.id}>
                <TableCell className="font-medium">{audit.auditName}</TableCell>
                <TableCell className="text-blue-600 font-medium">{audit.id}</TableCell>
                <TableCell>{audit.type}</TableCell>
                <TableCell>{audit.startDate}</TableCell>
                <TableCell>{audit.endDate}</TableCell>
                <TableCell>
                  <Badge className={`${getStatusBadge(audit.status)} px-3 py-1 rounded-md font-medium`}>
                    {audit.status} ▼
                  </Badge>
                </TableCell>
                <TableCell>{audit.conductedBy}</TableCell>
                <TableCell>
                  <Button variant="ghost" size="sm" className="p-1">
                    <Download className="w-4 h-4 text-gray-600" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
