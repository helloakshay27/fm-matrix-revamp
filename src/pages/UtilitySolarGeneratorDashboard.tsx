
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Filter } from "lucide-react";
import { UtilitySolarGeneratorFilterDialog } from '../components/UtilitySolarGeneratorFilterDialog';
import { EnhancedTable } from '@/components/enhanced-table/EnhancedTable';
import { ColumnConfig } from '@/hooks/useEnhancedTable';

// Sample data for solar generators
const solarGeneratorData = [];

const columns: ColumnConfig[] = [
  {
    key: 'id',
    label: 'ID',
    sortable: true,
    draggable: true,
    defaultVisible: true
  },
  {
    key: 'date',
    label: 'Date',
    sortable: true,
    draggable: true,
    defaultVisible: true
  },
  {
    key: 'totalUnits',
    label: 'Total Units',
    sortable: true,
    draggable: true,
    defaultVisible: true
  },
  {
    key: 'plantDayGeneration',
    label: 'Plant day Generation',
    sortable: true,
    draggable: true,
    defaultVisible: true
  },
  {
    key: 'tower',
    label: 'Tower',
    sortable: true,
    draggable: true,
    defaultVisible: true
  }
];

const UtilitySolarGeneratorDashboard = () => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const renderCell = (item: any, columnKey: string) => {
    const value = item[columnKey];
    return <span className="text-sm">{value}</span>;
  };

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="font-work-sans font-semibold text-base sm:text-2xl lg:text-[26px] leading-auto tracking-normal text-black">
          SOLAR GENERATORS LIST
        </h1>
      </div>

      {/* Filters Button */}
      <div className="flex justify-start">
        <Button
          onClick={() => setIsFilterOpen(!isFilterOpen)}
          className="bg-white text-black hover:bg-gray-50 transition-colors duration-200 rounded-none px-4 py-2 h-9 text-sm font-medium flex items-center gap-2 border border-gray-300"
        >
          <Filter className="w-4 h-4" />
          Filters
        </Button>
      </div>

      {/* Enhanced Table */}
      <Card className="border-[#D5DbDB]">
        <CardContent className="p-0">
          <EnhancedTable
            data={solarGeneratorData}
            columns={columns}
            renderCell={renderCell}
            storageKey="solar-generator-table"
            emptyMessage="No solar generator data available"
            pagination={true}
            pageSize={10}
            enableSearch={false}
            hideTableSearch={true}
            hideTableExport={true}
            hideColumnsButton={true}
          />
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
