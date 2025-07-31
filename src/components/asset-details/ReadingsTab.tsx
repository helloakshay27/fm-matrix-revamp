
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { MaterialDatePicker } from '@/components/ui/material-date-picker';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
interface ReadingsTab {
  asset: Asset;
  assetId?: string | number;
}
interface Asset {
  id: number;
  name: string;
  model_number: string;
  serial_number: string;
  purchase_cost: number;
  purchased_on: string;
  warranty: boolean;
  warranty_expiry: string;
  manufacturer: string;
  asset_number: string;
  asset_code: string;
  group: string;
  sub_group: string;
  allocation_type: string;
  depreciation_applicable: boolean;
  depreciation_method: string;
  useful_life: number;
  salvage_value: number;
  status: string;
  current_book_value: number;
  site_name: string;
  commisioning_date: string;
  vendor_name: string;
}
export const ReadingsTab: React.FC<ReadingsTab> = ({ asset, assetId }) => {
  const [fromDate, setFromDate] = useState('2025-05-19');
  const [toDate, setToDate] = useState('2025-06-17');

  const handleApply = () => {
    console.log('Apply date range:', { fromDate, toDate });
  };

  const handleReset = () => {
    setFromDate('');
    setToDate('');
  };

  const tableHeaders = [
    'Particulars', 'UOM', 'MF', 'Balance',
    '19 MAY', '20 MAY', '21 MAY', '22 MAY', '23 MAY', '24 MAY', '25 MAY', '26 MAY',
    '27 MAY', '28 MAY', '29 MAY', '30 MAY', '31 MAY', '01 JUN', '02 JUN', '03 JUN', '04 JUN'
  ];

  // Filter Component that will be reused in both tabs
  const DateRangeFilter = () => (
    <div className="flex items-center gap-4 mb-6">
      <div className="flex items-center gap-2">
        <MaterialDatePicker
          value={fromDate}
          onChange={setFromDate}
          placeholder="From Date"
          className="w-48"
        />
        <span className="text-gray-500">-</span>
        <MaterialDatePicker
          value={toDate}
          onChange={setToDate}
          placeholder="To Date"
          className="w-48"
        />
      </div>
      <Button
        onClick={handleApply}
        className="bg-[#C72030] hover:bg-[#C72030]/90 text-white"
      >
        Apply
      </Button>
      <Button
        onClick={handleReset}
        variant="outline"
        className="border-gray-300 text-gray-700 hover:bg-gray-50"
      >
        Reset
      </Button>
    </div>
  );

  // Consumption Table Component
  const ConsumptionTable = () => (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <div className="w-12 h-12 rounded-full flex items-center justify-center bg-[#E5E0D3]">
          <span className="text-white text-xs" style={{ color: "#C72030" }}>✕</span>
        </div>
        <h3 className="text-lg font-semibold uppercase text-[#1A1A1A]">Consumption</h3>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                {tableHeaders.map((header, index) => (
                  <th key={index} className="px-3 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider whitespace-nowrap border-r border-gray-200 last:border-r-0">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-gray-100">
              {/* Empty row for spacing */}
              <tr>
                <td colSpan={tableHeaders.length} className="h-8"></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  // Non Consumption Table Component
  const NonConsumptionTable = () => (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <div className="w-12 h-12 rounded-full flex items-center justify-center bg-[#E5E0D3]">
          <span className="text-white text-xs" style={{ color: "#C72030" }}>✕</span>
        </div>
        <h3 className="text-lg font-semibold uppercase text-[#1A1A1A]">Non Consumption</h3>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                {tableHeaders.map((header, index) => (
                  <th key={index} className="px-3 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider whitespace-nowrap border-r border-gray-200 last:border-r-0">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-gray-100">
              {/* Empty row for spacing */}
              <tr>
                <td colSpan={tableHeaders.length} className="h-8"></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <Tabs defaultValue="consumption" style={{ width: "100%" }} className="w-full">
        <TabsList className="w-full mb-6">
          <TabsTrigger 
            value="consumption" 
            className="w-full data-[state=active]:bg-[#EDEAE3] bg-[#FFFFFF] data-[state=active]:text-[#C72030] text-black"
          >
            Consumption
          </TabsTrigger>
          <TabsTrigger 
            value="non-consumption" 
            className="w-full data-[state=active]:bg-[#EDEAE3] bg-[#FFFFFF] data-[state=active]:text-[#C72030] text-black"
          >
            Non Consumption
          </TabsTrigger>
        </TabsList>

        <TabsContent value="consumption" className="space-y-6 mt-6">
          <DateRangeFilter />
          <div className="text-sm text-gray-600">
            (Maximum allowed days are 30)
          </div>
          <ConsumptionTable />
        </TabsContent>

        <TabsContent value="non-consumption" className="space-y-6 mt-6">
          <DateRangeFilter />
          <div className="text-sm text-gray-600">
            (Maximum allowed days are 30)
          </div>
          <NonConsumptionTable />
        </TabsContent>
      </Tabs>
    </div>
  );
};
