
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { SolarGeneratorFilterDialog } from '@/components/SolarGeneratorFilterDialog';

const UtilitySolarGeneratorDashboard = () => {
  const [isFilterDialogOpen, setIsFilterDialogOpen] = useState(false);

  const solarGeneratorData: any[] = [];

  return (
    <div className="p-6 space-y-6">
      {/* Breadcrumb */}
      <div className="text-sm text-gray-600">
        Solar Generators &gt; Solar Generators List
      </div>

      {/* Page Title */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[#1a1a1a]">SOLAR GENERATORS LIST</h1>
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

      {/* Solar Generator Table */}
      <Card className="border border-gray-200">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead className="font-semibold text-[#1a1a1a]">ID</TableHead>
                <TableHead className="font-semibold text-[#1a1a1a]">Date</TableHead>
                <TableHead className="font-semibold text-[#1a1a1a]">Total Units</TableHead>
                <TableHead className="font-semibold text-[#1a1a1a]">Plant day Generation</TableHead>
                <TableHead className="font-semibold text-[#1a1a1a]">Tower</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {solarGeneratorData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                    No solar generator data found
                  </TableCell>
                </TableRow>
              ) : (
                solarGeneratorData.map((item) => (
                  <TableRow key={item.id} className="hover:bg-gray-50">
                    <TableCell className="text-[#1a1a1a]">{item.id}</TableCell>
                    <TableCell className="text-[#1a1a1a]">{item.date}</TableCell>
                    <TableCell className="text-[#1a1a1a]">{item.totalUnits}</TableCell>
                    <TableCell className="text-[#1a1a1a]">{item.plantDayGeneration}</TableCell>
                    <TableCell className="text-[#1a1a1a]">{item.tower}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Filter Dialog */}
      <SolarGeneratorFilterDialog 
        isOpen={isFilterDialogOpen}
        onClose={() => setIsFilterDialogOpen(false)}
      />
    </div>
  );
};

export default UtilitySolarGeneratorDashboard;
