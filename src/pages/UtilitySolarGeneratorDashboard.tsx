
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Filter } from "lucide-react";

// Sample data for solar generators
const solarGeneratorData = [
  {
    id: 1,
    date: "2024-01-15",
    totalUnits: 250.5,
    plantDayGeneration: 2450.8,
    tower: "Tower A"
  },
  {
    id: 2,
    date: "2024-01-16",
    totalUnits: 275.2,
    plantDayGeneration: 2680.4,
    tower: "Tower B"
  },
  {
    id: 3,
    date: "2024-01-17",
    totalUnits: 290.8,
    plantDayGeneration: 2850.6,
    tower: "Tower A"
  },
  {
    id: 4,
    date: "2024-01-18",
    totalUnits: 265.4,
    plantDayGeneration: 2590.2,
    tower: "Tower C"
  },
  {
    id: 5,
    date: "2024-01-19",
    totalUnits: 310.6,
    plantDayGeneration: 3020.8,
    tower: "Tower B"
  }
];

const UtilitySolarGeneratorDashboard = () => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  return (
    <div className="p-6 space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center space-x-2 text-sm text-gray-600">
        <span>Solar Generators</span>
        <span>&gt;</span>
        <span>Solar Generators List</span>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">SOLAR GENERATORS LIST</h1>
      </div>

      {/* Filters Button */}
      <div className="flex justify-start">
        <Button
          variant="outline"
          onClick={() => setIsFilterOpen(!isFilterOpen)}
          className="flex items-center gap-2"
        >
          <Filter className="w-4 h-4" />
          Filters
        </Button>
      </div>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="font-semibold">ID</TableHead>
                <TableHead className="font-semibold">Date</TableHead>
                <TableHead className="font-semibold">Total Units</TableHead>
                <TableHead className="font-semibold">Plant day Generation</TableHead>
                <TableHead className="font-semibold">Tower</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {solarGeneratorData.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.id}</TableCell>
                  <TableCell>{item.date}</TableCell>
                  <TableCell>{item.totalUnits}</TableCell>
                  <TableCell>{item.plantDayGeneration}</TableCell>
                  <TableCell>{item.tower}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default UtilitySolarGeneratorDashboard;
