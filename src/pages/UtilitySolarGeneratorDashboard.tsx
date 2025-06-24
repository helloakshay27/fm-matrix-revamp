
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Filter } from "lucide-react";
import { UtilitySolarGeneratorFilterDialog } from '../components/UtilitySolarGeneratorFilterDialog';

// Empty data array for solar generators
const solarGeneratorData = [];

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
        <h1 className="text-2xl font-bold text-[#C72030]">SOLAR GENERATORS LIST</h1>
      </div>

      {/* Filters Button */}
      <div className="flex justify-start">
        <Button
          variant="outline"
          onClick={() => setIsFilterOpen(!isFilterOpen)}
          className="flex items-center gap-2 border-[#C72030] text-[#C72030] hover:bg-[#C72030] hover:text-white"
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
                <TableHead className="font-semibold text-[#C72030]">ID</TableHead>
                <TableHead className="font-semibold text-[#C72030]">Date</TableHead>
                <TableHead className="font-semibold text-[#C72030]">Total Units</TableHead>
                <TableHead className="font-semibold text-[#C72030]">Plant day Generation</TableHead>
                <TableHead className="font-semibold text-[#C72030]">Tower</TableHead>
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

      {/* Filter Dialog */}
      <UtilitySolarGeneratorFilterDialog 
        isOpen={isFilterOpen} 
        onClose={() => setIsFilterOpen(false)} 
      />
    </div>
  );
};

export default UtilitySolarGeneratorDashboard;
