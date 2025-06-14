
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const UtilitySolarGeneratorDashboard = () => {
  const solarGeneratorData = [
    {
      id: "001",
      date: "2024-01-15",
      totalUnits: "1250.5",
      plantDayGeneration: "1180.2",
      tower: "Tower A"
    },
    {
      id: "002",
      date: "2024-01-16",
      totalUnits: "1340.8",
      plantDayGeneration: "1295.6",
      tower: "Tower B"
    },
    {
      id: "003",
      date: "2024-01-17",
      totalUnits: "1156.3",
      plantDayGeneration: "1098.7",
      tower: "Tower C"
    },
    {
      id: "004",
      date: "2024-01-18",
      totalUnits: "1420.9",
      plantDayGeneration: "1365.4",
      tower: "Tower A"
    },
    {
      id: "005",
      date: "2024-01-19",
      totalUnits: "1380.2",
      plantDayGeneration: "1325.8",
      tower: "Tower B"
    }
  ];

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
          className="border-[#C72030] text-[#C72030] hover:bg-[#C72030] hover:text-white"
        >
          🔍 Filters
        </Button>
      </div>

      {/* Solar Generators Table */}
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
              {solarGeneratorData.map((item) => (
                <TableRow key={item.id} className="hover:bg-gray-50">
                  <TableCell className="text-[#1a1a1a]">{item.id}</TableCell>
                  <TableCell className="text-[#1a1a1a]">{item.date}</TableCell>
                  <TableCell className="text-[#1a1a1a]">{item.totalUnits}</TableCell>
                  <TableCell className="text-[#1a1a1a]">{item.plantDayGeneration}</TableCell>
                  <TableCell className="text-[#1a1a1a]">{item.tower}</TableCell>
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
