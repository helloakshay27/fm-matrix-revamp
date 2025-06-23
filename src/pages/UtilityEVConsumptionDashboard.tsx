
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { EVConsumptionFilterDialog } from '@/components/EVConsumptionFilterDialog';

const UtilityEVConsumptionDashboard = () => {
  const [isFilterDialogOpen, setIsFilterDialogOpen] = useState(false);

  const evConsumptionData: any[] = [];

  return (
    <div className="p-6 space-y-6">
      {/* Breadcrumb */}
      <div className="text-sm text-gray-600">
        EV Consumption &gt; EV Consumption List
      </div>

      {/* Page Title */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[#1a1a1a]">EV CONSUMPTION LIST</h1>
      </div>

      {/* Filters Button */}
      <div className="flex justify-start">
        <Button 
          variant="outline" 
          onClick={() => setIsFilterDialogOpen(true)}
          className="border-[#C72030] text-[#C72030] hover:bg-[#C72030] hover:text-white"
        >
          🔍 Filters
        </Button>
      </div>

      {/* EV Consumption Table */}
      <Card className="border border-gray-200">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead className="font-semibold text-[#1a1a1a]">ID</TableHead>
                <TableHead className="font-semibold text-[#1a1a1a]">Transaction Date</TableHead>
                <TableHead className="font-semibold text-[#1a1a1a]">Transaction Id</TableHead>
                <TableHead className="font-semibold text-[#1a1a1a]">Name</TableHead>
                <TableHead className="font-semibold text-[#1a1a1a]">Site</TableHead>
                <TableHead className="font-semibold text-[#1a1a1a]">Units Consumed</TableHead>
                <TableHead className="font-semibold text-[#1a1a1a]">Tariff Rate</TableHead>
                <TableHead className="font-semibold text-[#1a1a1a]">Sale of Energy</TableHead>
                <TableHead className="font-semibold text-[#1a1a1a]">Tax Percentage</TableHead>
                <TableHead className="font-semibold text-[#1a1a1a]">Tax Amount</TableHead>
                <TableHead className="font-semibold text-[#1a1a1a]">Total Amount</TableHead>
                <TableHead className="font-semibold text-[#1a1a1a]">Created By</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {evConsumptionData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={12} className="text-center py-8 text-gray-500">
                    No EV consumption data found
                  </TableCell>
                </TableRow>
              ) : (
                evConsumptionData.map((item) => (
                  <TableRow key={item.id} className="hover:bg-gray-50">
                    <TableCell className="text-[#1a1a1a]">{item.id}</TableCell>
                    <TableCell className="text-[#1a1a1a]">{item.transactionDate}</TableCell>
                    <TableCell className="text-[#1a1a1a]">{item.transactionId}</TableCell>
                    <TableCell className="text-[#1a1a1a]">{item.name}</TableCell>
                    <TableCell className="text-[#1a1a1a]">{item.site}</TableCell>
                    <TableCell className="text-[#1a1a1a]">{item.unitsConsumed}</TableCell>
                    <TableCell className="text-[#1a1a1a]">₹{item.tariffRate}</TableCell>
                    <TableCell className="text-[#1a1a1a]">₹{item.saleOfEnergy}</TableCell>
                    <TableCell className="text-[#1a1a1a]">{item.taxPercentage}</TableCell>
                    <TableCell className="text-[#1a1a1a]">₹{item.taxAmount}</TableCell>
                    <TableCell className="text-[#1a1a1a]">₹{item.totalAmount}</TableCell>
                    <TableCell className="text-[#1a1a1a]">{item.createdBy}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Filter Dialog */}
      <EVConsumptionFilterDialog 
        isOpen={isFilterDialogOpen}
        onClose={() => setIsFilterDialogOpen(false)}
      />
    </div>
  );
};

export default UtilityEVConsumptionDashboard;
