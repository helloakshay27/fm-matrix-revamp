
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Filter } from "lucide-react";

const UtilityConsumptionDashboard = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const mockConsumption = [
    // Empty table as shown in the image
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Breadcrumb */}
      <div className="text-sm text-gray-600">
        Utility &gt; Calculations
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-2">
        <Button className="bg-purple-600 hover:bg-purple-700">
          <Plus className="w-4 h-4 mr-2" />
          Generate New
        </Button>
        <Button variant="outline" size="sm">
          <Filter className="w-4 h-4 mr-2" />
          Filters
        </Button>
      </div>

      {/* Consumption Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Action</TableHead>
                <TableHead>Client Name</TableHead>
                <TableHead>Meter No.</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Reading Type</TableHead>
                <TableHead>Adjustment Factor</TableHead>
                <TableHead>Rate/KWH</TableHead>
                <TableHead>Actual Consumption</TableHead>
                <TableHead>Total Consumption</TableHead>
                <TableHead>Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockConsumption.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={10} className="text-center py-8 text-gray-500">
                    No data available
                  </TableCell>
                </TableRow>
              ) : (
                mockConsumption.map((item, index) => (
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

export default UtilityConsumptionDashboard;
