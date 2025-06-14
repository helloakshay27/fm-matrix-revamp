
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Filter } from "lucide-react";

const UtilityEVConsumptionDashboard = () => {
  const mockEVConsumption = [
    // Empty table as shown in the image
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Breadcrumb */}
      <div className="text-sm text-gray-600">
        EV Consumption &gt; EV Consumption List
      </div>

      {/* Page Title */}
      <h1 className="text-2xl font-bold">EV CONSUMPTION LIST</h1>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-2">
        <Button variant="outline" size="sm">
          <Filter className="w-4 h-4 mr-2" />
          Filters
        </Button>
      </div>

      {/* EV Consumption Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Transaction Date</TableHead>
                <TableHead>Transaction Id</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Site</TableHead>
                <TableHead>Units Consumed</TableHead>
                <TableHead>Tariff Rate</TableHead>
                <TableHead>Sale of Energy</TableHead>
                <TableHead>Tax Percentage</TableHead>
                <TableHead>Tax Amount</TableHead>
                <TableHead>Total Amount</TableHead>
                <TableHead>Created By</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockEVConsumption.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={12} className="text-center py-8 text-gray-500">
                    No data available
                  </TableCell>
                </TableRow>
              ) : (
                mockEVConsumption.map((item, index) => (
                  <TableRow key={index}>
                    {/* Table content would go here */}
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
