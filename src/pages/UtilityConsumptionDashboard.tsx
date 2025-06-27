
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Filter } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const UtilityConsumptionDashboard = () => {
  const [consumptionData] = useState([
    // Sample data - in real app this would come from API
  ]);

  return (
    <div className="p-6 space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center space-x-2 text-sm text-gray-600">
        <span>Utility</span>
        <span>{">"}</span>
        <span className="text-gray-900 font-medium">Calculations</span>
      </div>

      {/* Header with buttons */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Utility Consumption</h1>
        <div className="flex gap-3">
          <Button 
            className="bg-white text-[#C72030] border border-[#C72030] hover:bg-[#C72030] hover:text-white transition-colors duration-200 rounded-none px-4 py-2 h-9 text-sm font-medium flex items-center gap-2"
          >
            <Filter className="w-4 h-4" />
            Filters
          </Button>
          <Button 
            className="bg-white text-[#C72030] border border-[#C72030] hover:bg-[#C72030] hover:text-white transition-colors duration-200 rounded-none px-4 py-2 h-9 text-sm font-medium flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Generate New
          </Button>
        </div>
      </div>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead className="font-semibold text-gray-900">Action</TableHead>
                <TableHead className="font-semibold text-gray-900">Client Name</TableHead>
                <TableHead className="font-semibold text-gray-900">Meter No.</TableHead>
                <TableHead className="font-semibold text-gray-900">Location</TableHead>
                <TableHead className="font-semibold text-gray-900">Reading Type</TableHead>
                <TableHead className="font-semibold text-gray-900">Adjustment Factor</TableHead>
                <TableHead className="font-semibold text-gray-900">Rate/KWH</TableHead>
                <TableHead className="font-semibold text-gray-900">Actual Consumption</TableHead>
                <TableHead className="font-semibold text-gray-900">Total Consumption</TableHead>
                <TableHead className="font-semibold text-gray-900">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {consumptionData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={10} className="text-center py-8 text-gray-500">
                    No consumption data available
                  </TableCell>
                </TableRow>
              ) : (
                consumptionData.map((item, index) => (
                  <TableRow key={index} className="hover:bg-gray-50">
                    <TableCell>
                      <div className="flex gap-2">
                        <Button 
                          size="sm"
                          className="bg-white text-[#C72030] border border-[#C72030] hover:bg-[#C72030] hover:text-white transition-colors duration-200 rounded-none px-3 py-1 h-8 text-xs font-medium"
                        >
                          Edit
                        </Button>
                        <Button 
                          size="sm"
                          className="bg-white text-[#C72030] border border-[#C72030] hover:bg-[#C72030] hover:text-white transition-colors duration-200 rounded-none px-3 py-1 h-8 text-xs font-medium"
                        >
                          Delete
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell>{item.clientName}</TableCell>
                    <TableCell>{item.meterNo}</TableCell>
                    <TableCell>{item.location}</TableCell>
                    <TableCell>{item.readingType}</TableCell>
                    <TableCell>{item.adjustmentFactor}</TableCell>
                    <TableCell>{item.ratePerKWH}</TableCell>
                    <TableCell>{item.actualConsumption}</TableCell>
                    <TableCell>{item.totalConsumption}</TableCell>
                    <TableCell>{item.amount}</TableCell>
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

export default UtilityConsumptionDashboard;
