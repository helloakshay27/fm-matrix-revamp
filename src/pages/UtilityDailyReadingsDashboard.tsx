import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search, Download, Upload, Filter, Edit } from 'lucide-react';
import { EnhancedTable } from '@/components/enhanced-table/EnhancedTable';
import { ColumnConfig } from '@/hooks/useEnhancedTable';

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

// Column configuration for enhanced table
const columns: ColumnConfig[] = [
  { key: 'actions', label: 'Actions', sortable: false, defaultVisible: true },
  { key: 'id', label: 'ID', sortable: true, defaultVisible: true },
  { key: 'assetName', label: 'Asset Name', sortable: true, defaultVisible: true },
  { key: 'parameterName', label: 'Parameter Name', sortable: true, defaultVisible: true },
  { key: 'opening', label: 'Opening', sortable: true, defaultVisible: true },
  { key: 'reading', label: 'Reading', sortable: true, defaultVisible: true },
  { key: 'consumption', label: 'Consumption', sortable: true, defaultVisible: true },
  { key: 'totalConsumption', label: 'Total Consumption', sortable: true, defaultVisible: true },
  { key: 'customerName', label: 'Customer Name', sortable: true, defaultVisible: true },
  { key: 'date', label: 'Date', sortable: true, defaultVisible: true },
];

export default function UtilityDailyReadingsDashboard() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  const filteredData = dailyReadingsData.filter(item =>
    item.assetName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.parameterName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.id.includes(searchTerm)
  );

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedItems(filteredData.map(item => item.id));
    } else {
      setSelectedItems([]);
    }
  };

  const handleSelectItem = (itemId: string, checked: boolean) => {
    if (checked) {
      setSelectedItems(prev => [...prev, itemId]);
    } else {
      setSelectedItems(prev => prev.filter(id => id !== itemId));
    }
  };

  const handleEdit = (item: any) => {
    console.log('Edit item:', item);
  };

  const renderCell = (item: any, columnKey: string) => {
    switch (columnKey) {
      case 'actions':
        return (
          <div className="flex items-center justify-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleEdit(item)}
              className="h-8 w-8 p-0"
            >
              <Edit className="w-4 h-4" />
            </Button>
          </div>
        );
      case 'id':
        return <span className="font-mono text-sm">{item.id}</span>;
      case 'assetName':
        return <span className="font-medium">{item.assetName}</span>;
      case 'parameterName':
        return item.parameterName || '-';
      case 'opening':
        return item.opening || '-';
      case 'reading':
        return <span className="font-medium">{item.reading || '-'}</span>;
      case 'consumption':
        return <span className="font-medium">{item.consumption || '-'}</span>;
      case 'totalConsumption':
        return item.totalConsumption || '-';
      case 'customerName':
        return item.customerName || '-';
      case 'date':
        return item.date || '-';
      default:
        return item[columnKey] || '-';
    }
  };

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
      <div className="bg-white rounded-lg shadow-sm border">
        <EnhancedTable
          data={filteredData}
          columns={columns}
          renderCell={renderCell}
          onSelectAll={handleSelectAll}
          onSelectItem={handleSelectItem}
          selectedItems={selectedItems}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          enableSearch={false}
          enableExport={false}
          hideColumnsButton={false}
          pagination={true}
          pageSize={20}
          emptyMessage="No daily readings found"
          selectable={true}
          storageKey="daily-readings-table"
        />
      </div>

      {/* Results Count removed as EnhancedTable handles this */}
    </div>
  );
}
