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
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[#1a1a1a]">DAILY READINGS</h1>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-4 mb-6">
        <Button 
          className="bg-[#C72030] hover:bg-[#B01D2A] text-white border-none rounded-none px-4 py-2 h-9 text-sm font-medium flex items-center gap-2"
        >
          <Upload className="w-4 h-4" />
          Import
        </Button>
        <Button 
          className="bg-[#C72030] hover:bg-[#B01D2A] text-white border-none rounded-none px-4 py-2 h-9 text-sm font-medium flex items-center gap-2"
        >
          <Download className="w-4 h-4" />
          Export
        </Button>
        <Button 
          className="bg-white text-[#C72030] border border-[#C72030] hover:bg-[#C72030] hover:text-white transition-colors duration-200 rounded-none px-4 py-2 h-9 text-sm font-medium flex items-center gap-2"
        >
          <Filter className="w-4 h-4" />
          Filters
        </Button>
      </div>

      {/* Search */}
      <div className="flex items-center gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search readings..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 rounded-none border-gray-300 focus:ring-2 focus:ring-[#C72030] focus:border-[#C72030]"
          />
        </div>
      </div>

      {/* Data Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Action</TableHead>
                  <TableHead>ID</TableHead>
                  <TableHead>Asset name</TableHead>
                  <TableHead>Parameter Name</TableHead>
                  <TableHead>Opening</TableHead>
                  <TableHead>Reading</TableHead>
                  <TableHead>Consumption</TableHead>
                  <TableHead>Total Consumption</TableHead>
                  <TableHead>Customer Name</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredData.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <Button 
                        size="sm"
                        className="bg-white text-[#C72030] border border-[#C72030] hover:bg-[#C72030] hover:text-white transition-colors duration-200 rounded-none px-2 py-1 h-8 text-xs font-medium"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                    </TableCell>
                    <TableCell className="font-mono text-sm">{item.id}</TableCell>
                    <TableCell>{item.assetName}</TableCell>
                    <TableCell>{item.parameterName}</TableCell>
                    <TableCell>{item.opening}</TableCell>
                    <TableCell>{item.reading}</TableCell>
                    <TableCell>{item.consumption}</TableCell>
                    <TableCell>{item.totalConsumption}</TableCell>
                    <TableCell>{item.customerName}</TableCell>
                    <TableCell>{item.date}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Results Count */}
      <div className="text-sm text-gray-600">
        Showing {filteredData.length} of {dailyReadingsData.length} entries
      </div>
    </div>
  );
}
