import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search, Download, Upload, Filter, Edit } from 'lucide-react';

const dailyReadingsData = [
  {
    id: '1637136',
    assetName: 'Diesel Generator',
    parameterName: 'Diesel Generator KWH',
    opening: '0.0',
    reading: '',
    consumption: '',
    totalConsumption: '',
    customerName: '',
    date: '2023-09-02'
  },
  {
    id: '1637137',
    assetName: 'Diesel Generator',
    parameterName: 'DG Voltage ( R )',
    opening: '0.0',
    reading: '',
    consumption: '',
    totalConsumption: '',
    customerName: '',
    date: '2023-09-02'
  },
  {
    id: '1637138',
    assetName: 'Diesel Generator',
    parameterName: 'DG Voltage ( Y )',
    opening: '0.0',
    reading: '',
    consumption: '',
    totalConsumption: '',
    customerName: '',
    date: '2023-09-02'
  },
  {
    id: '1637139',
    assetName: 'Diesel Generator',
    parameterName: 'DG Voltage ( B )',
    opening: '0.0',
    reading: '',
    consumption: '',
    totalConsumption: '',
    customerName: '',
    date: '2023-09-02'
  },
  {
    id: '1637140',
    assetName: 'Diesel Generator',
    parameterName: 'Diesel Generator Running Hours',
    opening: '0.0',
    reading: '',
    consumption: '',
    totalConsumption: '',
    customerName: '',
    date: '2023-09-02'
  },
  {
    id: '1637141',
    assetName: 'Diesel Generator',
    parameterName: 'Coolant temp.',
    opening: '0.0',
    reading: '',
    consumption: '',
    totalConsumption: '',
    customerName: '',
    date: '2023-09-02'
  },
  {
    id: '1637142',
    assetName: 'Diesel Generator',
    parameterName: 'DG Start Time',
    opening: '0.0',
    reading: '',
    consumption: '',
    totalConsumption: '',
    customerName: '',
    date: '2023-09-02'
  },
  {
    id: '1637143',
    assetName: 'Diesel Generator',
    parameterName: 'DG Stop Time',
    opening: '0.0',
    reading: '',
    consumption: '',
    totalConsumption: '',
    customerName: '',
    date: '2023-09-02'
  },
  {
    id: '1259009',
    assetName: 'Diesel Generator',
    parameterName: 'Diesel Generator KWH',
    opening: '0.0',
    reading: '1.0',
    consumption: '1.0',
    totalConsumption: '',
    customerName: '',
    date: '2023-07-03'
  },
  {
    id: '1259010',
    assetName: 'Diesel Generator',
    parameterName: 'DG Voltage ( R )',
    opening: '0.0',
    reading: '2.0',
    consumption: '2.0',
    totalConsumption: '',
    customerName: '',
    date: '2023-07-03'
  },
  {
    id: '1259011',
    assetName: 'Diesel Generator',
    parameterName: 'DG Voltage ( Y )',
    opening: '0.0',
    reading: '3.0',
    consumption: '3.0',
    totalConsumption: '',
    customerName: '',
    date: '2023-07-03'
  },
  {
    id: '1259012',
    assetName: 'Diesel Generator',
    parameterName: 'DG Voltage ( B )',
    opening: '0.0',
    reading: '4.0',
    consumption: '4.0',
    totalConsumption: '',
    customerName: '',
    date: '2023-07-03'
  },
  {
    id: '1259013',
    assetName: 'Diesel Generator',
    parameterName: 'Diesel Generator Running Hours',
    opening: '0.0',
    reading: '5.0',
    consumption: '5.0',
    totalConsumption: '',
    customerName: '',
    date: '2023-07-03'
  },
  {
    id: '1259014',
    assetName: 'Diesel Generator',
    parameterName: 'Coolant temp.',
    opening: '0.0',
    reading: '2.0',
    consumption: '2.0',
    totalConsumption: '',
    customerName: '',
    date: '2023-07-03'
  },
  {
    id: '1259015',
    assetName: 'Diesel Generator',
    parameterName: 'DG Start Time',
    opening: '0.0',
    reading: '2.0',
    consumption: '2.0',
    totalConsumption: '',
    customerName: '',
    date: '2023-07-03'
  },
  {
    id: '1259016',
    assetName: 'Diesel Generator',
    parameterName: 'DG Stop Time',
    opening: '0.0',
    reading: '2.0',
    consumption: '2.0',
    totalConsumption: '',
    customerName: '',
    date: '2023-07-03'
  },
  {
    id: '1258301',
    assetName: 'Diesel Generator 2',
    parameterName: 'Diesel Generator KWH',
    opening: '0.0',
    reading: '',
    consumption: '',
    totalConsumption: '',
    customerName: '',
    date: '2023-07-03'
  }
];

export default function UtilityDailyReadingsDashboard() {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredData = dailyReadingsData.filter(item =>
    item.assetName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.parameterName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.id.includes(searchTerm)
  );

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Breadcrumb */}
      <div className="text-sm text-gray-600">
        Utility &gt; Daily Readings
      </div>

      {/* Page Title */}
      <h1 className="font-work-sans font-semibold text-base sm:text-2xl lg:text-[26px] leading-auto tracking-normal text-gray-900">DAILY READINGS</h1>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-3">
        <Button 
          className="bg-[#C72030] text-white hover:bg-[#A01B29] transition-colors duration-200 rounded-none px-4 py-2 h-9 text-sm font-medium flex items-center gap-2 border-0"
        >
          <Upload className="w-4 h-4" />
          Import
        </Button>
        <Button 
          className="bg-[#C72030] text-white hover:bg-[#A01B29] transition-colors duration-200 rounded-none px-4 py-2 h-9 text-sm font-medium flex items-center gap-2 border-0"
        >
          <Download className="w-4 h-4" />
          Export
        </Button>
        <Button 
          className="bg-[#C72030] text-white hover:bg-[#A01B29] transition-colors duration-200 rounded-none px-4 py-2 h-9 text-sm font-medium flex items-center gap-2 border-0"
        >
          <Filter className="w-4 h-4" />
          Filters
        </Button>
      </div>

      {/* Search */}
      <div className="flex justify-between items-center">
        <div></div>
        <div className="flex items-center space-x-2">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search readings..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-64 h-10 bg-white border border-gray-300 rounded-none focus:outline-none focus:ring-2 focus:ring-[#C72030] focus:border-[#C72030] text-sm"
            />
          </div>
          <Button 
            className="bg-[#C72030] text-white hover:bg-[#A01B29] transition-colors duration-200 rounded-none px-6 py-2 h-10 text-sm font-medium border-0"
          >
            Go!
          </Button>
        </div>
      </div>

      {/* Enhanced Data Table */}
      <Card className="shadow-sm">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-gray-50">
                <TableRow>
                  <TableHead className="font-semibold text-gray-900 border-b border-gray-200 px-4 py-3">Action</TableHead>
                  <TableHead className="font-semibold text-gray-900 border-b border-gray-200 px-4 py-3">ID</TableHead>
                  <TableHead className="font-semibold text-gray-900 border-b border-gray-200 px-4 py-3">Asset name</TableHead>
                  <TableHead className="font-semibold text-gray-900 border-b border-gray-200 px-4 py-3">Parameter Name</TableHead>
                  <TableHead className="font-semibold text-gray-900 border-b border-gray-200 px-4 py-3">Opening</TableHead>
                  <TableHead className="font-semibold text-gray-900 border-b border-gray-200 px-4 py-3">Reading</TableHead>
                  <TableHead className="font-semibold text-gray-900 border-b border-gray-200 px-4 py-3">Consumption</TableHead>
                  <TableHead className="font-semibold text-gray-900 border-b border-gray-200 px-4 py-3">Total Consumption</TableHead>
                  <TableHead className="font-semibold text-gray-900 border-b border-gray-200 px-4 py-3">Customer Name</TableHead>
                  <TableHead className="font-semibold text-gray-900 border-b border-gray-200 px-4 py-3">Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredData.map((item, index) => (
                  <TableRow 
                    key={item.id} 
                    className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-gray-100 transition-colors duration-150`}
                  >
                    <TableCell className="px-4 py-3 border-b border-gray-100">
                      <Button 
                        size="sm"
                        className="bg-[#C72030] text-white hover:bg-[#A01B29] transition-colors duration-200 rounded-none px-3 py-1 h-8 text-xs font-medium flex items-center gap-1 border-0"
                      >
                        <Edit className="w-3 h-3" />
                        Edit
                      </Button>
                    </TableCell>
                    <TableCell className="font-mono text-sm px-4 py-3 border-b border-gray-100 text-gray-700">{item.id}</TableCell>
                    <TableCell className="px-4 py-3 border-b border-gray-100 text-gray-700 font-medium">{item.assetName}</TableCell>
                    <TableCell className="px-4 py-3 border-b border-gray-100 text-gray-700">{item.parameterName}</TableCell>
                    <TableCell className="px-4 py-3 border-b border-gray-100 text-gray-700">{item.opening}</TableCell>
                    <TableCell className="px-4 py-3 border-b border-gray-100 text-gray-700 font-medium">{item.reading}</TableCell>
                    <TableCell className="px-4 py-3 border-b border-gray-100 text-gray-700 font-medium">{item.consumption}</TableCell>
                    <TableCell className="px-4 py-3 border-b border-gray-100 text-gray-700">{item.totalConsumption}</TableCell>
                    <TableCell className="px-4 py-3 border-b border-gray-100 text-gray-700">{item.customerName}</TableCell>
                    <TableCell className="px-4 py-3 border-b border-gray-100 text-gray-700">{item.date}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Results Count */}
      <div className="flex justify-between items-center text-sm text-gray-600">
        <span>Showing {filteredData.length} of {dailyReadingsData.length} entries</span>
        <div className="text-xs text-gray-500">
          Last updated: {new Date().toLocaleString()}
        </div>
      </div>
    </div>
  );
}
