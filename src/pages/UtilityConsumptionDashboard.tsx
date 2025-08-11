import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Search, Plus, Edit, Eye, Filter, Download, Upload } from 'lucide-react';
import { EnhancedTable } from '@/components/enhanced-table/EnhancedTable';
import { ColumnConfig } from '@/hooks/useEnhancedTable';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';

// Mock data for utility calculations
const utilityCalculationsData = [
  {
    id: '1',
    clientName: 'SIFY TECHNOLOGIES LTD',
    meterNo: 'MT001',
    location: 'Building A - Floor 1',
    readingType: 'DGKVAH',
    adjustmentFactor: '1.0',
    rateKWH: '28.78',
    actualConsumption: '35.93',
    totalConsumption: '35.93',
    amount: '1033.95'
  },
  {
    id: '2',
    clientName: 'Tata Starbucks Private Limited',
    meterNo: 'MT002',
    location: 'Building B - Floor 2',
    readingType: 'DGKVAH',
    adjustmentFactor: '1.0',
    rateKWH: '28.78',
    actualConsumption: '321.27',
    totalConsumption: '321.27',
    amount: '9246.21'
  },
  {
    id: '3',
    clientName: 'Storybook Ventures',
    meterNo: 'MT003',
    location: 'Building C - Floor 1',
    readingType: 'DGKVAH',
    adjustmentFactor: '1.0',
    rateKWH: '28.78',
    actualConsumption: '155.23',
    totalConsumption: '155.23',
    amount: '4467.63'
  },
  {
    id: '4',
    clientName: 'CREST DIGITAL PRIVATE LIMITED',
    meterNo: 'MT004',
    location: 'Building A - Floor 3',
    readingType: 'DGKVAH',
    adjustmentFactor: '1.0',
    rateKWH: '28.78',
    actualConsumption: '786.67',
    totalConsumption: '786.67',
    amount: '22640.5'
  },
  {
    id: '5',
    clientName: 'Reliance Jio Infocomm Limited',
    meterNo: 'MT005',
    location: 'Building D - Floor 2',
    readingType: 'DGKVAH',
    adjustmentFactor: '1.0',
    rateKWH: '28.78',
    actualConsumption: '97.85',
    totalConsumption: '97.85',
    amount: '2816.01'
  }
];

// Column configuration for enhanced table
const columns: ColumnConfig[] = [
  { key: 'actions', label: 'Action', sortable: false, defaultVisible: true },
  { key: 'clientName', label: 'Client Name', sortable: true, defaultVisible: true },
  { key: 'meterNo', label: 'Meter No.', sortable: true, defaultVisible: true },
  { key: 'location', label: 'Location', sortable: true, defaultVisible: true },
  { key: 'readingType', label: 'Reading Type', sortable: true, defaultVisible: true },
  { key: 'adjustmentFactor', label: 'Adjustment Factor', sortable: true, defaultVisible: true },
  { key: 'rateKWH', label: 'Rate/KWH', sortable: true, defaultVisible: true },
  { key: 'actualConsumption', label: 'Actual Consumption', sortable: true, defaultVisible: true },
  { key: 'totalConsumption', label: 'Total Consumption', sortable: true, defaultVisible: true },
  { key: 'amount', label: 'Amount', sortable: true, defaultVisible: true },
];

const UtilityConsumptionDashboard = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  const filteredData = utilityCalculationsData.filter(item =>
    item.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.meterNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
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

  const handleGenerateNew = () => {
    console.log('Generate new calculation');
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
      case 'clientName':
        return <span className="font-medium text-left">{item.clientName}</span>;
      case 'meterNo':
        return <span className="font-mono text-sm">{item.meterNo}</span>;
      case 'location':
        return item.location || '-';
      case 'readingType':
        return item.readingType || '-';
      case 'adjustmentFactor':
        return <span className="font-medium">{item.adjustmentFactor}</span>;
      case 'rateKWH':
        return <span className="font-medium">{item.rateKWH}</span>;
      case 'actualConsumption':
        return <span className="font-medium">{item.actualConsumption}</span>;
      case 'totalConsumption':
        return <span className="font-medium">{item.totalConsumption}</span>;
      case 'amount':
        return <span className="font-medium text-green-600">{item.amount}</span>;
      default:
        return item[columnKey] || '-';
    }
  };

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Breadcrumb */}
      <div className="text-sm text-gray-600">
        Utility &gt; Calculations
      </div>

      {/* Page Title */}
      <h1 className="font-work-sans font-semibold text-base sm:text-2xl lg:text-[26px] leading-auto tracking-normal text-gray-900">Calculations</h1>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-3">
        <Button 
          onClick={handleGenerateNew}
          className="bg-[#C72030] text-white hover:bg-[#A01B29] transition-colors duration-200 rounded-none px-4 py-2 h-9 text-sm font-medium flex items-center gap-2 border-0"
        >
          <Plus className="w-4 h-4" />
          Generate New
        </Button>
        <Button 
          className="bg-white text-[#C72030] border border-[#C72030] hover:bg-[#C72030] hover:text-white transition-colors duration-200 rounded-none px-4 py-2 h-9 text-sm font-medium flex items-center gap-2"
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
              placeholder="Search calculations..."
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
          emptyMessage="No calculation data found"
          selectable={true}
          storageKey="utility-consumption-table"
        />
      </div>
    </div>
  );
};

export default UtilityConsumptionDashboard;