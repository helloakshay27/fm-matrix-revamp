
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Filter } from 'lucide-react';
import { UtilityEVConsumptionFilterDialog } from '../components/UtilityEVConsumptionFilterDialog';

const UtilityEVConsumptionDashboard = () => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);

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
          onClick={() => setIsFilterOpen(true)}
          className="bg-white text-[#C72030] border border-[#C72030] hover:bg-[#C72030] hover:text-white transition-colors duration-200 rounded-lg px-4 py-2 h-9 text-sm font-medium flex items-center gap-2"
        >
          <Filter className="w-4 h-4" />
          Filters
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
              {evConsumptionData.map((item) => (
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

      {/* Filter Dialog */}
      <UtilityEVConsumptionFilterDialog 
        isOpen={isFilterOpen} 
        onClose={() => setIsFilterOpen(false)} 
      />
    </div>
  );
};

export default UtilityEVConsumptionDashboard;
