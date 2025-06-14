
import React from 'react';
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Filter, FileCheck, Clock, HourglassIcon, CheckCircle, XCircle, RotateCcw, Archive } from 'lucide-react';

const statsData = [
  { label: 'Total Permits', count: 0, icon: FileCheck, color: 'bg-purple-500' },
  { label: 'Draft Permits', count: 0, icon: Clock, color: 'bg-orange-500' },
  { label: 'Hold Permits', count: 0, icon: HourglassIcon, color: 'bg-red-900' },
  { label: 'Open Permits', count: 0, icon: Clock, color: 'bg-orange-500' },
  { label: 'Approved Permits', count: 0, icon: CheckCircle, color: 'bg-green-500' },
  { label: 'Rejected Permits', count: 0, icon: XCircle, color: 'bg-red-500' },
  { label: 'Extended Permits', count: 0, icon: RotateCcw, color: 'bg-teal-500' },
  { label: 'Closed Permits', count: 0, icon: Archive, color: 'bg-green-600' },
];

export const PermitListDashboard = () => {
  return (
    <div className="flex-1 p-6 bg-white min-h-screen">
      {/* Breadcrumb */}
      <div className="mb-6">
        <nav className="flex items-center text-sm text-gray-600 mb-4">
          <span>Permit</span>
          <span className="mx-2">{'>'}</span>
          <span>Permit List</span>
        </nav>
        <h1 className="text-2xl font-bold text-gray-900">Permit LIST</h1>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {statsData.map((stat, index) => (
          <Card key={index} className="relative overflow-hidden">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div className={`p-2 rounded-lg ${stat.color}`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-gray-900">{stat.count}</div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="text-sm font-medium text-gray-600">{stat.label}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4 mb-6">
        <Button className="bg-purple-600 hover:bg-purple-700 text-white">
          <Plus className="w-4 h-4 mr-2" />
          Add
        </Button>
        <Button variant="outline">
          <Filter className="w-4 h-4 mr-2" />
          Filter
        </Button>
      </div>

      {/* Permit To Complete Badge */}
      <div className="flex justify-end mb-4">
        <div className="bg-purple-500 text-white px-3 py-1 rounded text-sm font-medium">
          Permit To Complete
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead>Actions</TableHead>
              <TableHead>ID</TableHead>
              <TableHead>Ref No.</TableHead>
              <TableHead>Permit Type</TableHead>
              <TableHead>Permit For</TableHead>
              <TableHead>Created By</TableHead>
              <TableHead>Designation</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Vendor Name</TableHead>
              <TableHead>Created On</TableHead>
              <TableHead>Permit Expiry/Extend Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell colSpan={12} className="text-center py-8 text-gray-500">
                No permits found
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default PermitListDashboard;
