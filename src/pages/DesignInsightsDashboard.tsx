
import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Button } from "@/components/ui/button";
import { Plus, Download } from "lucide-react";
import { DesignInsightFilterModal } from '@/components/DesignInsightFilterModal';
import { ExportModal } from '@/components/ExportModal';
import { EnhancedTable } from '@/components/enhanced-table/EnhancedTable';
import { ColumnConfig } from '@/hooks/useEnhancedTable';



interface FilterState {
  dateRange: string;
  zone: string;
  category: string;
  subCategory: string;
  mustHave: string;
  createdBy: string;
}

export const DesignInsightsDashboard = () => {
  const navigate = useNavigate();
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilters, setActiveFilters] = useState<FilterState>({
    dateRange: '',
    zone: '',
    category: '',
    subCategory: '',
    mustHave: '',
    createdBy: ''
  });
  const [designInsightsData, setDesignInsightsData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const baseUrl = localStorage.getItem("baseUrl");
  const token = localStorage.getItem("token");
  // Define columns for the EnhancedTable
  const columns: ColumnConfig[] = [
    { key: 'srNo', label: 'Sr.No', sortable: true, draggable: true, defaultVisible: true },
    { key: 'id', label: 'ID', sortable: true, draggable: true, defaultVisible: true },
    { key: 'date', label: 'Date', sortable: true, draggable: true, defaultVisible: true },
    { key: 'site', label: 'Site', sortable: true, draggable: true, defaultVisible: true },
    { key: 'zone', label: 'Zone', sortable: true, draggable: true, defaultVisible: true },
    { key: 'createdBy', label: 'Created by', sortable: true, draggable: true, defaultVisible: true },
    { key: 'location', label: 'Location', sortable: true, draggable: true, defaultVisible: true },
    { key: 'observation', label: 'Observation', sortable: true, draggable: true, defaultVisible: true },
    { key: 'recommendation', label: 'Recommendation', sortable: true, draggable: true, defaultVisible: true },
    { key: 'category', label: 'Category', sortable: true, draggable: true, defaultVisible: true },
    { key: 'subCategory', label: 'Sub category', sortable: true, draggable: true, defaultVisible: true },
    { key: 'categorization', label: 'Categorization', sortable: true, draggable: true, defaultVisible: true },
    { key: 'tag', label: 'Tag', sortable: true, draggable: true, defaultVisible: true }
  ];

  // Fetch API data
  useEffect(() => {
    const fetchDesignInsights = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          `https://${baseUrl}/pms/design_inputs.json`,
          { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
        );

        const mappedData = res.data.data.map((item: any, index: number) => ({
          srNo: index + 1,
          id: `#${item.id}`,
          date: new Date(item.created_at).toLocaleDateString('en-GB'), // DD/MM/YYYY
          site: item.site_name || '-',
          zone: item.zone_name || '-',
          createdBy: item.created_by || '-',
          location: item.sub_loc_name || '-', // mapping sub_loc_name here
          observation: item.observation || '-',
          recommendation: item.recommendation || '-',
          category: item.category_name || '-',
          subCategory: item.sub_category_name || '-',
          categorization: item.categorization || '-',
          tag: item.tag || '-'
        }));

        setDesignInsightsData(mappedData);
      } catch (error) {
        console.error('Error fetching design insights:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDesignInsights();
  }, []);

  // Filter data
  const filteredData = useMemo(() => {
    return designInsightsData.filter((item) => {
      const matchesZone = !activeFilters.zone || item.zone.toLowerCase().includes(activeFilters.zone.toLowerCase());
      const matchesCategory = !activeFilters.category || item.category.toLowerCase().includes(activeFilters.category.toLowerCase());
      const matchesSubCategory = !activeFilters.subCategory || item.subCategory.toLowerCase().includes(activeFilters.subCategory.toLowerCase());
      const matchesCreatedBy = !activeFilters.createdBy || item.createdBy.toLowerCase().includes(activeFilters.createdBy.toLowerCase());
      const matchesSearch = !searchTerm ||
        Object.values(item).some(value => String(value).toLowerCase().includes(searchTerm.toLowerCase()));

      return matchesZone && matchesCategory && matchesSubCategory && matchesCreatedBy && matchesSearch;
    });
  }, [designInsightsData, activeFilters, searchTerm]);

  const handleAddClick = () => navigate('/transitioning/design-insight/add');

  const handleRowClick = (item: any) => navigate(`/transitioning/design-insight/details/${item.id.replace('#', '')}`);

  const renderCell = (item: any, columnKey: string) => (
    columnKey === 'id'
      ? <span className="text-gray-900 font-medium cursor-pointer hover:underline">{item[columnKey]}</span>
      : <span>{item[columnKey] || '-'}</span>
  );

  const handleApplyFilters = (filters: FilterState) => setActiveFilters(filters);

  const handleResetFilters = () => {
    setActiveFilters({ dateRange: '', zone: '', category: '', subCategory: '', mustHave: '', createdBy: '' });
    setSearchTerm('');
  };

  const handleExportCSV = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `https://${baseUrl}/pms/design_inputs/export_design_input.xlsx`,
        {
          headers: { Authorization: `Bearer ${token}` },
          responseType: 'blob',
        }
      );
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      const timestamp = new Date().toISOString().split('T')[0];
      link.setAttribute('download', `design-insights-${timestamp}.xlsx`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting design insights:', error);
      alert('Failed to export design insights.');
    } finally {
      setLoading(false);
    }
  };

  const hasActiveFilters = Object.values(activeFilters).some(v => v !== '');

  return (
    <div className="flex-1 p-6 bg-white min-h-screen">
      <div className="mb-6 flex items-center justify-between">
  <div>
    <p className="text-sm text-gray-500 mb-1">
      Design Insights &gt; Design Insights List
    </p>
    <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
      Design Insights
    </h1>
  </div>
</div>



      {loading ? (
        <div>Loading...</div>
      ) : (
        <EnhancedTable
          data={filteredData}
          columns={columns}
          renderCell={renderCell}
          onRowClick={handleRowClick}
          storageKey="design-insights-table"
          emptyMessage={hasActiveFilters ? 'No results found for the selected filters.' : 'No data available.'}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          searchPlaceholder="Search design insights..."
          enableExport
          handleExport={handleExportCSV}
          pagination
          pageSize={10}
          enableSearch
          hideTableExport={false}
          onFilterClick={() => setIsFilterOpen(true)}
          leftActions={
            <div className="flex flex-wrap gap-2">
              <Button onClick={handleAddClick} className="bg-[#C72030] hover:bg-[#A61B28] text-white">
                <Plus className="w-4 h-4 mr-2" /> Add
              </Button>
              <Button variant="outline" className="border-[#C72030] text-[#C72030]">
                <Download className="w-4 h-4 mr-2" /> Download Report With Picture
              </Button>
              <Button variant="outline" className="border-[#C72030] text-[#C72030]">
                <Download className="w-4 h-4 mr-2" /> Download Report Without Picture
              </Button>
            </div>
          }
        />
      )}

      <DesignInsightFilterModal
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        onApplyFilters={handleApplyFilters}
      />

      <ExportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
      />
    </div>
  );
};

export default DesignInsightsDashboard;
