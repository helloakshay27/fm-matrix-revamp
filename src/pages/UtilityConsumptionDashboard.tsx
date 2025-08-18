import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Plus, Edit, Eye, Filter, Download, Upload, X } from 'lucide-react';
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
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [filters, setFilters] = useState({
    clientName: '',
    meterNo: '',
    readingType: ''
  });

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
    navigate('/utility/utility-consumption/generate-bill');
  };

  const handleApplyFilters = () => {
    // Apply the filters logic here
    console.log('Applying filters:', filters);
    setIsFilterModalOpen(false);
  };

  const handleResetFilters = () => {
    setFilters({
      clientName: '',
      meterNo: '',
      readingType: ''
    });
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
          onClick={() => setIsFilterModalOpen(true)}
          className="bg-white text-[#C72030] border border-[#C72030] hover:bg-[#C72030] hover:text-white transition-colors duration-200 rounded-none px-4 py-2 h-9 text-sm font-medium flex items-center gap-2"
        >
          <Filter className="w-4 h-4" />
          Filters
        </Button>
      </div>

      {/* Search */}


      {/* Enhanced Data Table */}
      <div >
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

      {/* Filter Modal */}
      <Dialog open={isFilterModalOpen} onOpenChange={setIsFilterModalOpen}>
        <DialogContent className="sm:max-w-[600px] p-0 bg-white">
          <DialogHeader className="px-6 py-4 border-b">
            <div className="flex items-center justify-between">
              <DialogTitle className="text-lg font-medium text-gray-900">Filter</DialogTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsFilterModalOpen(false)}
                className="h-6 w-6 p-0 hover:bg-gray-100"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </DialogHeader>

          <div className="px-6 py-6">
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Client Name</label>
                <Input
                  placeholder="Client Name"
                  value={filters.clientName}
                  onChange={(e) => setFilters(prev => ({ ...prev, clientName: e.target.value }))}
                  className="h-10 rounded-md border-gray-300"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Meter No.</label>
                <Input
                  placeholder="Meter No."
                  value={filters.meterNo}
                  onChange={(e) => setFilters(prev => ({ ...prev, meterNo: e.target.value }))}
                  className="h-10 rounded-md border-gray-300"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Reading Type</label>
                <Select value={filters.readingType} onValueChange={(value) => setFilters(prev => ({ ...prev, readingType: value }))}>
                  <SelectTrigger className="h-10 rounded-md border-gray-300 bg-white">
                    <SelectValue placeholder="Select Reading type" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border shadow-lg z-50">
                    <SelectItem value="DGKVAH">DGKVAH</SelectItem>
                    <SelectItem value="EBKVAH">EBKVAH</SelectItem>
                    <SelectItem value="Water">Water</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <Button
                onClick={handleResetFilters}
                variant="outline"
                className="px-8 py-2 h-10 rounded-md border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                Reset
              </Button>
              <Button
                onClick={handleApplyFilters}
                className="px-8 py-2 h-10 rounded-md bg-purple-600 text-white hover:bg-purple-700"
              >
                Apply
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UtilityConsumptionDashboard;