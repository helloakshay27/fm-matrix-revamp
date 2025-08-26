import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search, Download, Upload, Filter, Edit, RefreshCw } from 'lucide-react';
import { EnhancedTable } from '@/components/enhanced-table/EnhancedTable';
import { ColumnConfig } from '@/hooks/useEnhancedTable';
import { toast } from '@/hooks/use-toast';
import { API_CONFIG, getAuthHeader } from '@/config/apiConfig';
import { BulkUploadDialog } from '@/components/BulkUploadDialog';

// Interface definitions for API response
interface CustomerName {
  name: string | null;
  id: number | null;
}

interface Measurement {
  id: number;
  asset_name: string;
  parameter_name: string;
  opening: number;
  reading: number | null;
  consumption: number | null;
  total_consumption: number | null;
  customer_name: CustomerName;
}

interface DailyReadingItem {
  id: string;
  assetName: string;
  parameterName: string;
  opening: string;
  reading: string;
  consumption: string;
  totalConsumption: string;
  customerName: string;
  date: string;
}

// Transform API response to match the table structure
const transformMeasurement = (measurement: Measurement): DailyReadingItem => {
  return {
    id: measurement.id.toString(),
    assetName: measurement.asset_name.trim(),
    parameterName: measurement.parameter_name,
    opening: measurement.opening?.toString() || '0.0',
    reading: measurement.reading?.toString() || '',
    consumption: measurement.consumption?.toString() || '',
    totalConsumption: measurement.total_consumption?.toString() || '',
    customerName: measurement.customer_name?.name || '',
    date: new Date().toISOString().split('T')[0] // Use current date since API doesn't provide date
  };
};

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
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  // API state management
  const [dailyReadingsData, setDailyReadingsData] = useState<DailyReadingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Bulk upload state
  const [isBulkUploadOpen, setIsBulkUploadOpen] = useState(false);

  // API fetch function
  const fetchMeasurements = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.MEASUREMENTS}`, {
        method: 'GET',
        headers: {
          'Authorization': getAuthHeader(),
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Fetched measurements data:', data);

      // Support both array and object API responses
      const measurementsArray = Array.isArray(data)
        ? data
        : Array.isArray(data.measurements)
          ? data.measurements
          : [];

      const transformedData = measurementsArray.map(transformMeasurement);
      setDailyReadingsData(transformedData);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred while fetching measurements';
      setError(errorMessage);
      console.error('Failed to fetch measurements:', err);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch data on component mount
  useEffect(() => {
    fetchMeasurements();
  }, [fetchMeasurements]);

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
    navigate(`/utility/daily-readings/edit/${item.id}`);
  };

  const handleRefresh = async () => {
    try {
      await fetchMeasurements();
      toast({
        title: "Success",
        description: "Data refreshed successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to refresh data",
        variant: "destructive",
      });
    }
  };

  const handleExport = async () => {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.ASSET_MEASUREMENT_EXPORT}`, {
        method: 'GET',
        headers: {
          'Authorization': getAuthHeader(),
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Get the blob from the response
      const blob = await response.blob();

      // Create a temporary URL for the blob
      const url = window.URL.createObjectURL(blob);

      // Create a temporary anchor element and trigger download
      const link = document.createElement('a');
      link.href = url;
      link.download = 'asset_measurement_list.xlsx'; // Set the filename
      document.body.appendChild(link);
      link.click();

      // Clean up
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast({
        title: "Success",
        description: "File exported successfully",
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred while exporting';
      console.error('Export failed:', error);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  const handleImport = () => {
    setIsBulkUploadOpen(true);
  };

  const handleImportComplete = (file: File) => {
    // Refresh the data after successful import
    fetchMeasurements();
    toast({
      title: "Success",
      description: "Data imported successfully",
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
        {/* <Button
          onClick={handleRefresh}
          disabled={loading}
          className="bg-[#C72030] text-white hover:bg-[#A01B29] transition-colors duration-200 rounded-none px-4 py-2 h-9 text-sm font-medium flex items-center gap-2 border-0"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button> */}
        <Button
          onClick={handleImport}
          className="bg-[#C72030] text-white hover:bg-[#A01B29] transition-colors duration-200 rounded-none px-4 py-2 h-9 text-sm font-medium flex items-center gap-2 border-0"
        >
          <Upload className="w-4 h-4" />
          Import
        </Button>
        <Button
          onClick={handleExport}
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
      {/* <div className="flex justify-between items-center">
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
      </div> */}

      {/* Enhanced Data Table */}
      <div>
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <RefreshCw className="w-6 h-6 animate-spin mr-2" />
            <span>Loading daily readings...</span>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-600 mb-4">{error}</p>
            <Button onClick={handleRefresh} variant="outline">
              Try Again
            </Button>
          </div>
        ) : (
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
        )}
      </div>

      {/* Bulk Upload Dialog */}
      <BulkUploadDialog
        open={isBulkUploadOpen}
        onOpenChange={setIsBulkUploadOpen}
        title="Bulk Upload"
        uploadType="upload"
        context="measurements"
        onImport={handleImportComplete}
      />

      {/* Results Count removed as EnhancedTable handles this */}
    </div>
  );
}
