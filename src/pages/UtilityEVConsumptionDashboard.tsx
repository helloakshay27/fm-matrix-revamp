
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { EVConsumptionFilterDialog } from '@/components/EVConsumptionFilterDialog';

const UtilityEVConsumptionDashboard = () => {
  const [isFilterDialogOpen, setIsFilterDialogOpen] = useState(false);
  const [appliedFilters, setAppliedFilters] = useState({
    dateRange: ''
  });

  const evConsumptionData = [
    {
      id: "001",
      transactionDate: "2024-01-15",
      transactionId: "TXN001",
      name: "John Doe",
      site: "Site A",
      unitsConsumed: "45.2",
      tariffRate: "12.50",
      saleOfEnergy: "565.00",
      taxPercentage: "18%",
      taxAmount: "101.70",
      totalAmount: "666.70",
      createdBy: "Admin"
    },
    {
      id: "002",
      transactionDate: "2024-01-16",
      transactionId: "TXN002",
      name: "Jane Smith",
      site: "Site B",
      unitsConsumed: "32.8",
      tariffRate: "12.50",
      saleOfEnergy: "410.00",
      taxPercentage: "18%",
      taxAmount: "73.80",
      totalAmount: "483.80",
      createdBy: "Manager"
    },
    {
      id: "003",
      transactionDate: "2024-01-17",
      transactionId: "TXN003",
      name: "Mike Johnson",
      site: "Site C",
      unitsConsumed: "28.5",
      tariffRate: "12.50",
      saleOfEnergy: "356.25",
      taxPercentage: "18%",
      taxAmount: "64.13",
      totalAmount: "420.38",
      createdBy: "Admin"
    }
  ];

  const handleFilterApply = (filters: { dateRange: string }) => {
    setAppliedFilters(filters);
    console.log('Applied filters:', filters);
  };

  // Filter data based on applied filters
  const filteredData = evConsumptionData.filter(item => {
    if (appliedFilters.dateRange) {
      // Simple date filtering logic - in real app, you'd implement proper date range filtering
      return item.transactionDate.includes(appliedFilters.dateRange);
    }
    return true;
  });

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
          className="border-[#C72030] text-[#C72030] hover:bg-[#C72030] hover:text-white"
          onClick={() => setIsFilterDialogOpen(true)}
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
              {filteredData.map((item) => (
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
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <EVConsumptionFilterDialog 
        open={isFilterDialogOpen}
        onOpenChange={setIsFilterDialogOpen}
        onApply={handleFilterApply}
      />
    </div>
  );
};

export default UtilityEVConsumptionDashboard;
