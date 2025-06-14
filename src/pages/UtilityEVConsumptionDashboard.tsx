
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Filter } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent } from '@/components/ui/card';

const UtilityEVConsumptionDashboard = () => {
  const [evConsumptionData] = useState([
    // Sample data - in real app this would come from API
  ]);

  return (
    <div className="p-6 space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center space-x-2 text-sm text-gray-600">
        <span>EV Consumption</span>
        <span>{">"}</span>
        <span className="text-gray-900 font-medium">EV Consumption List</span>
      </div>

      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">EV CONSUMPTION LIST</h1>
        <div className="flex gap-3">
          <Button variant="outline" className="flex items-center gap-2">
            <Filter className="w-4 h-4" />
            Filters
          </Button>
        </div>
      </div>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead className="font-semibold text-gray-900">ID</TableHead>
                <TableHead className="font-semibold text-gray-900">Transaction Date</TableHead>
                <TableHead className="font-semibold text-gray-900">Transaction Id</TableHead>
                <TableHead className="font-semibold text-gray-900">Name</TableHead>
                <TableHead className="font-semibold text-gray-900">Site</TableHead>
                <TableHead className="font-semibold text-gray-900">Units Consumed</TableHead>
                <TableHead className="font-semibold text-gray-900">Tariff Rate</TableHead>
                <TableHead className="font-semibold text-gray-900">Sale of Energy</TableHead>
                <TableHead className="font-semibold text-gray-900">Tax Percentage</TableHead>
                <TableHead className="font-semibold text-gray-900">Tax Amount</TableHead>
                <TableHead className="font-semibold text-gray-900">Total Amount</TableHead>
                <TableHead className="font-semibold text-gray-900">Created By</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {evConsumptionData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={12} className="text-center py-8 text-gray-500">
                    No EV consumption data available
                  </TableCell>
                </TableRow>
              ) : (
                evConsumptionData.map((item, index) => (
                  <TableRow key={index} className="hover:bg-gray-50">
                    <TableCell>{item.id}</TableCell>
                    <TableCell>{item.transactionDate}</TableCell>
                    <TableCell>{item.transactionId}</TableCell>
                    <TableCell>{item.name}</TableCell>
                    <TableCell>{item.site}</TableCell>
                    <TableCell>{item.unitsConsumed}</TableCell>
                    <TableCell>{item.tariffRate}</TableCell>
                    <TableCell>{item.saleOfEnergy}</TableCell>
                    <TableCell>{item.taxPercentage}</TableCell>
                    <TableCell>{item.taxAmount}</TableCell>
                    <TableCell>{item.totalAmount}</TableCell>
                    <TableCell>{item.createdBy}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default UtilityEVConsumptionDashboard;
