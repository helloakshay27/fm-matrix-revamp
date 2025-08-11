import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Search, Plus, Edit, Eye, Filter, Download, Upload } from 'lucide-react';
import { EnhancedTable } from '@/components/enhanced-table/EnhancedTable';
import { ColumnConfig } from '@/hooks/useEnhancedTable';
import { Badge } from '@/components/ui/badge';

// Mock data for customer consumption
const customerConsumptionData = [
  {
    id: '1',
    entity: 'SIFY TECHNOLOGIES LTD',
    fromDate: '2024-05-01',
    toDate: '2024-05-31',
    totalConsumption: '35.93',
    rate: '28.78',
    amount: '1033.95',
    plantDetail: '',
    status: 'pending',
    readingType: 'DGKVAH'
  },
  {
    id: '2',
    entity: 'Tata Starbucks Private Limited',
    fromDate: '2024-05-01',
    toDate: '2024-05-31',
    totalConsumption: '321.27',
    rate: '28.78',
    amount: '9246.21',
    plantDetail: '',
    status: 'pending',
    readingType: 'DGKVAH'
  },
  {
    id: '3',
    entity: 'Storybook Ventures',
    fromDate: '2024-05-01',
    toDate: '2024-05-31',
    totalConsumption: '155.23',
    rate: '28.78',
    amount: '4467.63',
    plantDetail: '',
    status: 'pending',
    readingType: 'DGKVAH'
  },
  {
    id: '4',
    entity: 'CREST DIGITAL PRIVATE LIMITED (Space Tele)',
    fromDate: '2024-05-01',
    toDate: '2024-05-31',
    totalConsumption: '786.67',
    rate: '28.78',
    amount: '22640.5',
    plantDetail: '',
    status: 'pending',
    readingType: 'DGKVAH'
  },
  {
    id: '5',
    entity: 'Reliance Jio Infocomm Limited',
    fromDate: '2024-05-01',
    toDate: '2024-05-31',
    totalConsumption: '97.85',
    rate: '28.78',
    amount: '2816.01',
    plantDetail: '',
    status: 'pending',
    readingType: 'DGKVAH'
  },
  {
    id: '6',
    entity: 'Synechron Technologies Pvt. Ltd.-SE',
    fromDate: '2024-05-01',
    toDate: '2024-05-31',
    totalConsumption: '3525.64',
    rate: '28.78',
    amount: '101468.0',
    plantDetail: '',
    status: 'pending',
    readingType: 'DGKVAH'
  },
  {
    id: '7',
    entity: 'Northern Operating Solutions Pvt. L',
    fromDate: '2024-05-01',
    toDate: '2024-05-31',
    totalConsumption: '7258.89',
    rate: '28.78',
    amount: '208911.0',
    plantDetail: '',
    status: 'pending',
    readingType: 'DGKVAH'
  },
  {
    id: '8',
    entity: 'ALTERA DIGITAL HEALTH (INDIA) LLP',
    fromDate: '2024-05-01',
    toDate: '2024-05-31',
    totalConsumption: '1671.24',
    rate: '28.78',
    amount: '48098.2',
    plantDetail: '',
    status: 'pending',
    readingType: 'DGKVAH'
  },
  {
    id: '9',
    entity: 'CompuCom CSI Systems India Pvt. Ltd',
    fromDate: '2024-05-01',
    toDate: '2024-05-31',
    totalConsumption: '3094.7',
    rate: '28.78',
    amount: '89065.6',
    plantDetail: '',
    status: 'pending',
    readingType: 'DGKVAH'
  },
  {
    id: '10',
    entity: 'Allianz Services Private Limited',
    fromDate: '2024-05-01',
    toDate: '2024-05-31',
    totalConsumption: '2949.43',
    rate: '28.78',
    amount: '84884.5',
    plantDetail: '',
    status: 'pending',
    readingType: 'DGKVAH'
  },
  {
    id: '11',
    entity: 'XPO India Shared Services LLP',
    fromDate: '2024-05-01',
    toDate: '2024-05-31',
    totalConsumption: '2098.84',
    rate: '28.78',
    amount: '60404.6',
    plantDetail: '',
    status: 'pending',
    readingType: 'DGKVAH'
  },
  {
    id: '12',
    entity: 'Cybage Software Pvt. Ltd.',
    fromDate: '2024-05-01',
    toDate: '2024-05-31',
    totalConsumption: '4411.59',
    rate: '28.78',
    amount: '126966.0',
    plantDetail: '',
    status: 'pending',
    readingType: 'DGKVAH'
  },
  {
    id: '13',
    entity: 'Citco Group Services (India) LLP',
    fromDate: '2024-05-01',
    toDate: '2024-05-31',
    totalConsumption: '8275.9',
    rate: '28.78',
    amount: '238180.0',
    plantDetail: '',
    status: 'pending',
    readingType: 'DGKVAH'
  },
  {
    id: '14',
    entity: 'NORTHERN OPERATING SERVICES PRIVATE',
    fromDate: '2024-05-01',
    toDate: '2024-05-31',
    totalConsumption: '35607.8',
    rate: '28.78',
    amount: '1024790.0',
    plantDetail: '',
    status: 'pending',
    readingType: 'DGKVAH'
  },
  {
    id: '15',
    entity: 'Isobar Commerce India Pvt Ltd',
    fromDate: '2024-05-01',
    toDate: '2024-05-31',
    totalConsumption: '1457.26',
    rate: '28.78',
    amount: '41940.0',
    plantDetail: '',
    status: 'pending',
    readingType: 'DGKVAH'
  }
];

// Column configuration for enhanced table
const columns: ColumnConfig[] = [
  { key: 'actions', label: 'Action', sortable: false, defaultVisible: true },
  { key: 'view', label: 'view', sortable: false, defaultVisible: true },
  { key: 'entity', label: 'Entity', sortable: true, defaultVisible: true },
  { key: 'fromDate', label: 'From date', sortable: true, defaultVisible: true },
  { key: 'toDate', label: 'To date', sortable: true, defaultVisible: true },
  { key: 'totalConsumption', label: 'Total consumption', sortable: true, defaultVisible: true },
  { key: 'rate', label: 'Rate', sortable: true, defaultVisible: true },
  { key: 'amount', label: 'Amount', sortable: true, defaultVisible: true },
  { key: 'plantDetail', label: 'Plant detail', sortable: true, defaultVisible: true },
  { key: 'status', label: 'Status', sortable: true, defaultVisible: true },
  { key: 'readingType', label: 'Reading type', sortable: true, defaultVisible: true },
];

export const UtilityRequestDashboard = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  const filteredData = customerConsumptionData.filter(item =>
    item.entity.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
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

  const handleView = (item: any) => {
    console.log('View item:', item);
  };

  const handleAdd = () => {
    console.log('Add new utility request');
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
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
      case 'view':
        return (
          <div className="flex items-center justify-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleView(item)}
              className="h-8 w-8 p-0"
            >
              <Eye className="w-4 h-4" />
            </Button>
          </div>
        );
      case 'entity':
        return <span className="font-medium text-left">{item.entity}</span>;
      case 'fromDate':
        return item.fromDate || '-';
      case 'toDate':
        return item.toDate || '-';
      case 'totalConsumption':
        return <span className="font-medium">{item.totalConsumption}</span>;
      case 'rate':
        return item.rate || '-';
      case 'amount':
        return <span className="font-medium">{item.amount}</span>;
      case 'plantDetail':
        return item.plantDetail || '-';
      case 'status':
        return (
          <Badge className={getStatusColor(item.status)}>
            {item.status}
          </Badge>
        );
      case 'readingType':
        return item.readingType || '-';
      default:
        return item[columnKey] || '-';
    }
  };

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Breadcrumb */}
      <div className="text-sm text-gray-600">
        Utility &gt; Utility Request
      </div>

      {/* Page Title */}
      <h1 className="font-work-sans font-semibold text-base sm:text-2xl lg:text-[26px] leading-auto tracking-normal text-gray-900">Customer Consumption</h1>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-3">
        <Button 
          onClick={handleAdd}
          className="bg-[#C72030] text-white hover:bg-[#A01B29] transition-colors duration-200 rounded-none px-4 py-2 h-9 text-sm font-medium flex items-center gap-2 border-0"
        >
          <Plus className="w-4 h-4" />
          Add
        </Button>
      </div>

      {/* Search */}
      <div className="flex justify-between items-center">
        <div></div>
        <div className="flex items-center space-x-2">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search consumption data..."
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
          pageSize={15}
          emptyMessage="No customer consumption data found"
          selectable={true}
          storageKey="utility-request-table"
        />
      </div>
    </div>
  );
};