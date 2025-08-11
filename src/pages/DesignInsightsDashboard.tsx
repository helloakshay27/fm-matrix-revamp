
// import React, { useState, useMemo } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { Button } from "@/components/ui/button";
// import { Plus, Download, Filter, RotateCcw } from "lucide-react";
// import { DesignInsightFilterModal } from '@/components/DesignInsightFilterModal';
// import { ExportModal } from '@/components/ExportModal';
// import { EnhancedTable } from '@/components/enhanced-table/EnhancedTable';
// import { ColumnConfig } from '@/hooks/useEnhancedTable';

// interface FilterState {
//   dateRange: string;
//   zone: string;
//   category: string;
//   subCategory: string;
//   mustHave: string;
//   createdBy: string;
// }

// export const DesignInsightsDashboard = () => {
//   const navigate = useNavigate();
//   const [isFilterOpen, setIsFilterOpen] = useState(false);
//   const [isExportOpen, setIsExportOpen] = useState(false);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [activeFilters, setActiveFilters] = useState<FilterState>({
//     dateRange: '',
//     zone: '',
//     category: '',
//     subCategory: '',
//     mustHave: '',
//     createdBy: ''
//   });

//   // Define columns for the EnhancedTable
//   const columns: ColumnConfig[] = [
//     {
//       key: 'id',
//       label: 'ID',
//       sortable: true,
//       draggable: true,
//       defaultVisible: true
//     },
//     {
//       key: 'date',
//       label: 'Date',
//       sortable: true,
//       draggable: true,
//       defaultVisible: true
//     },
//     {
//       key: 'site',
//       label: 'Site',
//       sortable: true,
//       draggable: true,
//       defaultVisible: true
//     },
//     {
//       key: 'zone',
//       label: 'Zone',
//       sortable: true,
//       draggable: true,
//       defaultVisible: true
//     },
//     {
//       key: 'createdBy',
//       label: 'Created by',
//       sortable: true,
//       draggable: true,
//       defaultVisible: true
//     },
//     {
//       key: 'location',
//       label: 'Location',
//       sortable: true,
//       draggable: true,
//       defaultVisible: true
//     },
//     {
//       key: 'observation',
//       label: 'Observation',
//       sortable: true,
//       draggable: true,
//       defaultVisible: true
//     },
//     {
//       key: 'recommendation',
//       label: 'Recommendation',
//       sortable: true,
//       draggable: true,
//       defaultVisible: true
//     },
//     {
//       key: 'category',
//       label: 'Category',
//       sortable: true,
//       draggable: true,
//       defaultVisible: true
//     },
//     {
//       key: 'subCategory',
//       label: 'Sub category',
//       sortable: true,
//       draggable: true,
//       defaultVisible: true
//     },
//     {
//       key: 'categorization',
//       label: 'Categorization',
//       sortable: true,
//       draggable: true,
//       defaultVisible: true
//     },
//     {
//       key: 'tag',
//       label: 'Tag',
//       sortable: true,
//       draggable: true,
//       defaultVisible: true
//     }
//   ];

//   const designInsightsData = [
//     {
//       id: '#372',
//       date: '24/03/2025',
//       site: 'Lockated',
//       zone: 'Mumbai',
//       createdBy: 'Sony Bhosle',
//       location: 'pune',
//       observation: 'test',
//       recommendation: 'test',
//       category: 'Landscape',
//       subCategory: '',
//       categorization: 'Safety',
//       tag: 'Workaround'
//     },
//     {
//       id: '#369',
//       date: '11/05/2024',
//       site: 'Lockated',
//       zone: 'Mumbai',
//       createdBy: 'Robert Day2',
//       location: '',
//       observation: 'sss',
//       recommendation: 'aa',
//       category: 'Façade',
//       subCategory: '',
//       categorization: '',
//       tag: ''
//     },
//     {
//       id: '#231',
//       date: '06/07/2023',
//       site: 'Lockated',
//       zone: 'Mumbai',
//       createdBy: 'sanket Patil',
//       location: 'Basement',
//       observation: 'Clean the water',
//       recommendation: 'Mark',
//       category: 'Façade',
//       subCategory: '',
//       categorization: 'Workaround',
//       tag: ''
//     },
//     {
//       id: '#204',
//       date: '18/04/2023',
//       site: 'Godrej Prime,Gurgaon',
//       zone: 'NCR',
//       createdBy: 'Robert Day2',
//       location: 'Location Demo 123',
//       observation: 'Demo',
//       recommendation: 'Demo',
//       category: 'Security & surveillance',
//       subCategory: 'Access Control',
//       categorization: '',
//       tag: ''
//     },
//     {
//       id: '#203',
//       date: '18/04/2023',
//       site: 'Lockated',
//       zone: 'Mumbai',
//       createdBy: 'Devesh Jain',
//       location: 'Sndksksk',
//       observation: 'Dndndjjd',
//       recommendation: 'Dndjdkkd',
//       category: 'Security & surveillance',
//       subCategory: 'CCTV',
//       categorization: '',
//       tag: ''
//     }
//   ];

//   // Filter the data based on active filters and search term
//   const filteredData = useMemo(() => {
//     return designInsightsData.filter((item) => {
//       const matchesZone = !activeFilters.zone || item.zone.toLowerCase().includes(activeFilters.zone.toLowerCase());
//       const matchesCategory = !activeFilters.category || item.category.toLowerCase().includes(activeFilters.category.toLowerCase());
//       const matchesSubCategory = !activeFilters.subCategory || item.subCategory.toLowerCase().includes(activeFilters.subCategory.toLowerCase());
//       const matchesCreatedBy = !activeFilters.createdBy || item.createdBy.toLowerCase().includes(activeFilters.createdBy.toLowerCase());

//       // Search term filter across all visible fields
//       const matchesSearch = !searchTerm || 
//         Object.values(item).some(value => 
//           String(value).toLowerCase().includes(searchTerm.toLowerCase())
//         );

//       return matchesZone && matchesCategory && matchesSubCategory && matchesCreatedBy && matchesSearch;
//     });
//   }, [designInsightsData, activeFilters, searchTerm]);

//   const handleAddClick = () => {
//     navigate('/transitioning/design-insight/add');
//   };

//   const handleRowClick = (item: any) => {
//     navigate(`/transitioning/design-insight/details${item.id.replace('#', '/')}`);
//   };

//   const renderCell = (item: any, columnKey: string) => {
//     const value = item[columnKey];

//     if (columnKey === 'id') {
//       return (
//         <span className="text-gray-900 font-medium cursor-pointer hover:underline">
//           {value}
//         </span>
//       );
//     }

//     return <span>{value || '-'}</span>;
//   };

//   const handleApplyFilters = (filters: FilterState) => {
//     setActiveFilters(filters);
//     console.log('Filters applied to dashboard:', filters);
//   };

//   const handleResetFilters = () => {
//     setActiveFilters({
//       dateRange: '',
//       zone: '',
//       category: '',
//       subCategory: '',
//       mustHave: '',
//       createdBy: ''
//     });
//     setSearchTerm('');
//   };

//   const handleExportCSV = () => {
//     // Define CSV headers
//     const headers = [
//       'ID',
//       'Date', 
//       'Site',
//       'Zone',
//       'Created by',
//       'Location',
//       'Observation',
//       'Recommendation',
//       'Category',
//       'Sub category',
//       'Categorization',
//       'Tag'
//     ];

//     // Convert filtered data to CSV format
//     const csvData = [
//       headers.join(','), // Header row
//       ...filteredData.map(item => [
//         item.id,
//         item.date,
//         `"${item.site}"`, // Wrap in quotes to handle commas
//         item.zone,
//         `"${item.createdBy}"`,
//         `"${item.location}"`,
//         `"${item.observation}"`,
//         `"${item.recommendation}"`,
//         `"${item.category}"`,
//         `"${item.subCategory}"`,
//         `"${item.categorization}"`,
//         `"${item.tag}"`
//       ].join(','))
//     ].join('\n');

//     // Create and download the CSV file
//     const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
//     const link = document.createElement('a');
//     const url = URL.createObjectURL(blob);
//     link.setAttribute('href', url);

//     // Generate filename with timestamp and filter info
//     const timestamp = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
//     const filterCount = Object.values(activeFilters).filter(v => v !== '').length;
//     const filename = filterCount > 0 
//       ? `design-insights-filtered-${timestamp}.csv`
//       : `design-insights-${timestamp}.csv`;

//     link.setAttribute('download', filename);
//     link.style.visibility = 'hidden';
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//     URL.revokeObjectURL(url);

//     console.log(`Exported ${filteredData.length} records to CSV`);
//   };

//   const hasActiveFilters = Object.values(activeFilters).some(value => value !== '');

//   return (
//     <div className="flex-1 p-6 bg-white min-h-screen">
//       {/* Breadcrumb */}
//       <div className="mb-4">
//         <span className="text-sm text-gray-600">Design Insights {'>'} Design Insights List</span>
//       </div>

//       {/* Header */}
//       <div className="mb-6">
//         <h1 className="text-2xl font-bold text-gray-900 mb-4">DESIGN INSIGHTS</h1>

//         {/* Active Filters Indicator */}
//         {hasActiveFilters && (
//           <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
//             <div className="flex items-center justify-between">
//               <span className="text-sm text-blue-800">
//                 Filters active - Showing {filteredData.length} of {designInsightsData.length} results
//               </span>
//               <Button
//                 variant="outline"
//                 size="sm"
//                 onClick={handleResetFilters}
//                 className="text-blue-600 border-blue-300 hover:bg-blue-100"
//               >
//                 Clear All
//               </Button>
//             </div>
//           </div>
//         )}
//       </div>

//       {/* Enhanced Table */}
//       <EnhancedTable
//         data={filteredData}
//         columns={columns}
//         renderCell={renderCell}
//         onRowClick={handleRowClick}
//         storageKey="design-insights-table"
//         emptyMessage={hasActiveFilters ? 'No results found for the selected filters.' : 'No data available.'}
//         searchTerm={searchTerm}
//         onSearchChange={setSearchTerm}
//         searchPlaceholder="Search design insights..."
//         enableExport={true}
//         exportFileName="design-insights"
//         onExport={handleExportCSV}
//         pagination={true}
//         pageSize={10}
//         enableSearch={true}
//         hideTableExport={false}
//         onFilterClick={() => setIsFilterOpen(true)}
//         leftActions={
//           <div className="flex flex-wrap gap-2">
//             <Button 
//               onClick={handleAddClick}
//               className="bg-[#C72030] hover:bg-[#A61B28] text-white"
//             >
//               <Plus className="w-4 h-4 mr-2" />
//               Add
//             </Button>
//             <Button 
//               variant="outline" 
//               className="border-[#C72030] text-[#C72030] hover:bg-[#C72030] hover:text-white"
//             >
//               <Download className="w-4 h-4 mr-2" />
//               Download Report With Picture
//             </Button>
//             <Button 
//               variant="outline" 
//               className="border-[#C72030] text-[#C72030] hover:bg-[#C72030] hover:text-white"
//             >
//               <Download className="w-4 h-4 mr-2" />
//               Download Report Without Picture
//             </Button>
//           </div>
//         }
//       />

//       <DesignInsightFilterModal 
//         isOpen={isFilterOpen} 
//         onClose={() => setIsFilterOpen(false)}
//         onApplyFilters={handleApplyFilters}
//       />

//       <ExportModal 
//         isOpen={isExportOpen}
//         onClose={() => setIsExportOpen(false)}
//       />
//     </div>
//   );
// };

// export default DesignInsightsDashboard;
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

        const mappedData = res.data.data.map((item: any) => ({
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
      <div className="mb-4">
        <span className="text-sm text-gray-600">Design Insights {'>'} Design Insights List</span>
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
