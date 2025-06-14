
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search, Plus, Filter, Edit } from 'lucide-react';

const consumptionData = [
  {
    id: '1',
    clientName: 'ABC Company',
    meterNo: 'M001',
    location: 'Floor 1',
    readingType: 'Electric',
    adjustmentFactor: '1.0',
    rateKWH: '5.50',
    actualConsumption: '1250',
    totalConsumption: '1250',
    amount: '6875.00'
  },
  {
    id: '2',
    clientName: 'XYZ Corporation',
    meterNo: 'M002',
    location: 'Floor 2',
    readingType: 'Electric',
    adjustmentFactor: '1.0',
    rateKWH: '5.50',
    actualConsumption: '890',
    totalConsumption: '890',
    amount: '4895.00'
  },
  {
    id: '3',
    clientName: 'Tech Solutions Ltd',
    meterNo: 'M003',
    location: 'Floor 3',
    readingType: 'Electric',
    adjustmentFactor: '1.0',
    rateKWH: '5.50',
    actualConsumption: '1450',
    totalConsumption: '1450',
    amount: '7975.00'
  },
  {
    id: '4',
    clientName: 'Digital Services Inc',
    meterNo: 'M004',
    location: 'Floor 4',
    readingType: 'Electric',
    adjustmentFactor: '1.0',
    rateKWH: '5.50',
    actualConsumption: '1100',
    totalConsumption: '1100',
    amount: '6050.00'
  }
];

export default function UtilityConsumptionDashboard() {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredData = consumptionData.filter(item =>
    item.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.meterNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#1a1a1a]">UTILITY</h1>
          <div className="flex items-center gap-2 mt-2">
            <span className="text-gray-600">Utility</span>
            <span className="text-gray-400">{'>'}</span>
            <span className="text-gray-900 font-medium">Calculations</span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-4 mb-6">
        <Button className="gap-2 bg-purple-700 hover:bg-purple-800">
          <Plus className="w-4 h-4" />
          Generate New
        </Button>
        <Button variant="outline" className="gap-2">
          <Filter className="w-4 h-4" />
          Filters
        </Button>
      </div>

      {/* Search */}
      <div className="flex items-center gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search calculations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
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
                {filteredData.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <Button variant="ghost" size="sm">
                        <Edit className="w-4 h-4" />
                      </Button>
                    </TableCell>
                    <TableCell className="font-medium">{item.clientName}</TableCell>
                    <TableCell className="font-mono text-sm">{item.meterNo}</TableCell>
                    <TableCell>{item.location}</TableCell>
                    <TableCell>{item.readingType}</TableCell>
                    <TableCell>{item.adjustmentFactor}</TableCell>
                    <TableCell>₹{item.rateKWH}</TableCell>
                    <TableCell>{item.actualConsumption} kWh</TableCell>
                    <TableCell>{item.totalConsumption} kWh</TableCell>
                    <TableCell>₹{item.amount}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Results Count */}
      <div className="text-sm text-gray-600">
        Showing {filteredData.length} of {consumptionData.length} entries
      </div>
    </div>
  );
}
