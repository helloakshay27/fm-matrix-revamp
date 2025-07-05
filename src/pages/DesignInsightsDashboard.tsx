
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, Download, Filter, RotateCcw, Eye } from "lucide-react";
import { DesignInsightFilterModal } from '@/components/DesignInsightFilterModal';
import { ExportModal } from '@/components/ExportModal';

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
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [activeFilters, setActiveFilters] = useState<FilterState>({
    dateRange: '',
    zone: '',
    category: '',
    subCategory: '',
    mustHave: '',
    createdBy: ''
  });

  const designInsightsData = [
    {
      id: '#372',
      date: '24/03/2025',
      site: 'Lockated',
      zone: 'Mumbai',
      createdBy: 'Sony Bhosle',
      location: 'pune',
      observation: 'test',
      recommendation: 'test',
      category: 'Landscape',
      subCategory: '',
      categorization: 'Safety',
      tag: 'Workaround'
    },
    {
      id: '#369',
      date: '11/05/2024',
      site: 'Lockated',
      zone: 'Mumbai',
      createdBy: 'Robert Day2',
      location: '',
      observation: 'sss',
      recommendation: 'aa',
      category: 'Façade',
      subCategory: '',
      categorization: '',
      tag: ''
    },
    {
      id: '#231',
      date: '06/07/2023',
      site: 'Lockated',
      zone: 'Mumbai',
      createdBy: 'sanket Patil',
      location: 'Basement',
      observation: 'Clean the water',
      recommendation: 'Mark',
      category: 'Façade',
      subCategory: '',
      categorization: 'Workaround',
      tag: ''
    },
    {
      id: '#204',
      date: '18/04/2023',
      site: 'Godrej Prime,Gurgaon',
      zone: 'NCR',
      createdBy: 'Robert Day2',
      location: 'Location Demo 123',
      observation: 'Demo',
      recommendation: 'Demo',
      category: 'Security & surveillance',
      subCategory: 'Access Control',
      categorization: '',
      tag: ''
    },
    {
      id: '#203',
      date: '18/04/2023',
      site: 'Lockated',
      zone: 'Mumbai',
      createdBy: 'Devesh Jain',
      location: 'Sndksksk',
      observation: 'Dndndjjd',
      recommendation: 'Dndjdkkd',
      category: 'Security & surveillance',
      subCategory: 'CCTV',
      categorization: '',
      tag: ''
    }
  ];

  // Filter the data based on active filters
  const filteredData = designInsightsData.filter((item) => {
    const matchesZone = !activeFilters.zone || item.zone.toLowerCase().includes(activeFilters.zone);
    const matchesCategory = !activeFilters.category || item.category.toLowerCase().includes(activeFilters.category);
    const matchesSubCategory = !activeFilters.subCategory || item.subCategory.toLowerCase().includes(activeFilters.subCategory);
    const matchesCreatedBy = !activeFilters.createdBy || item.createdBy.toLowerCase().includes(activeFilters.createdBy);
    
    return matchesZone && matchesCategory && matchesSubCategory && matchesCreatedBy;
  });

  const handleAddClick = () => {
    navigate('/transitioning/design-insight/add');
  };

  const handleRowClick = (id: string) => {
    navigate(`/transitioning/design-insight/details${id.replace('#', '/')}`);
  };

  const handleApplyFilters = (filters: FilterState) => {
    setActiveFilters(filters);
    console.log('Filters applied to dashboard:', filters);
  };

  const handleResetFilters = () => {
    setActiveFilters({
      dateRange: '',
      zone: '',
      category: '',
      subCategory: '',
      mustHave: '',
      createdBy: ''
    });
  };

  const handleExportCSV = () => {
    // Define CSV headers
    const headers = [
      'ID',
      'Date', 
      'Site',
      'Zone',
      'Created by',
      'Location',
      'Observation',
      'Recommendation',
      'Category',
      'Sub category',
      'Categorization',
      'Tag'
    ];

    // Convert filtered data to CSV format
    const csvData = [
      headers.join(','), // Header row
      ...filteredData.map(item => [
        item.id,
        item.date,
        `"${item.site}"`, // Wrap in quotes to handle commas
        item.zone,
        `"${item.createdBy}"`,
        `"${item.location}"`,
        `"${item.observation}"`,
        `"${item.recommendation}"`,
        `"${item.category}"`,
        `"${item.subCategory}"`,
        `"${item.categorization}"`,
        `"${item.tag}"`
      ].join(','))
    ].join('\n');

    // Create and download the CSV file
    const blob = new Blob([csvData], { type: 'text/csv;charset-utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    
    // Generate filename with timestamp and filter info
    const timestamp = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
    const filterCount = Object.values(activeFilters).filter(v => v !== '').length;
    const filename = filterCount > 0 
      ? `design-insights-filtered-${timestamp}.csv`
      : `design-insights-${timestamp}.csv`;
    
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    console.log(`Exported ${filteredData.length} records to CSV`);
  };

  const handleSelectItem = (itemId: string, checked: boolean) => {
    if (checked) {
      setSelectedItems([...selectedItems, itemId]);
    } else {
      setSelectedItems(selectedItems.filter(id => id !== itemId));
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedItems(filteredData.map(item => item.id));
    } else {
      setSelectedItems([]);
    }
  };

  const hasActiveFilters = Object.values(activeFilters).some(value => value !== '');

  return (
    <div className="flex-1 p-6 bg-white min-h-screen">
      {/* Breadcrumb */}
      <div className="mb-4">
        <span className="text-sm text-gray-600">Design Insights {'>'} Design Insights List</span>
      </div>

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">DESIGN INSIGHTS</h1>
        
        {/* Active Filters Indicator */}
        {hasActiveFilters && (
          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-sm text-blue-800">
                Filters active - Showing {filteredData.length} of {designInsightsData.length} results
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={handleResetFilters}
                className="text-blue-600 border-blue-300 hover:bg-blue-100"
              >
                Clear All
              </Button>
            </div>
          </div>
        )}
        
        {/* Action Buttons */}
        <div className="flex flex-wrap gap-2">
          <Button 
            onClick={handleAddClick}
            className="bg-[#C72030] hover:bg-[#A61B28] text-white"
          >
            <Plus className="w-4 h-4 mr-2 text-[#C72030] stroke-[#C72030]" />
            Add
          </Button>
          <Button 
            variant="outline" 
            className="border-[#C72030] text-[#C72030] hover:bg-[#C72030] hover:text-white"
          >
            <Download className="w-4 h-4 mr-2" />
            Download Report With Picture
          </Button>
          <Button 
            variant="outline" 
            className="border-[#C72030] text-[#C72030] hover:bg-[#C72030] hover:text-white"
          >
            <Download className="w-4 h-4 mr-2" />
            Download Report Without Picture
          </Button>
          <Button 
            onClick={handleExportCSV}
            variant="outline" 
            className="border-[#C72030] text-[#C72030] hover:bg-[#C72030] hover:text-white"
          >
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button 
            onClick={() => setIsFilterOpen(true)}
            variant="outline" 
            className={`border-gray-400 text-gray-700 hover:bg-gray-50 ${hasActiveFilters ? 'bg-blue-50 border-blue-400 text-blue-700' : ''}`}
          >
            <Filter className="w-4 h-4 mr-2" />
            Filter {hasActiveFilters && `(${Object.values(activeFilters).filter(v => v).length})`}
          </Button>
          <Button 
            onClick={handleResetFilters}
            variant="outline" 
            className="bg-[#C72030] text-white hover:bg-[#A61B28]"
          >
            <RotateCcw className="w-4 h-4 mr-2 text-[#D92818]" />
            Reset
          </Button>
        </div>
      </div>

      {/* Table Container with exact design specifications */}
      <div className="bg-white rounded-lg border overflow-hidden" style={{ width: '1524px', minHeight: '196px' }}>
        <div className="overflow-x-auto">
          <table className="w-full border-separate border-spacing-0">
            <thead>
              <tr style={{ backgroundColor: '#C4B89D', height: '40px' }}>
                <th className="w-5 px-5 py-3 text-left border-b border-gray-200" style={{ paddingLeft: '20px', paddingRight: '16px', paddingTop: '12px', paddingBottom: '12px' }}>
                  <Checkbox 
                    checked={selectedItems.length === filteredData.length && filteredData.length > 0}
                    onCheckedChange={handleSelectAll}
                    className="w-4 h-4"
                  />
                </th>
                <th className="px-10 py-3 text-left border-b border-gray-200" style={{ paddingLeft: '40px' }}>
                  <span style={{ fontFamily: 'Work Sans', fontSize: '14px', fontWeight: 'regular', lineHeight: 'auto', letterSpacing: '0%', color: '#1A1A1A', opacity: '100%' }}>
                    View
                  </span>
                </th>
                <th className="px-4 py-3 text-left border-b border-gray-200">
                  <span style={{ fontFamily: 'Work Sans', fontSize: '14px', fontWeight: 'regular', lineHeight: 'auto', letterSpacing: '0%', color: '#1A1A1A', opacity: '100%' }}>
                    ID
                  </span>
                </th>
                <th className="px-4 py-3 text-left border-b border-gray-200">
                  <span style={{ fontFamily: 'Work Sans', fontSize: '14px', fontWeight: 'regular', lineHeight: 'auto', letterSpacing: '0%', color: '#1A1A1A', opacity: '100%' }}>
                    Date
                  </span>
                </th>
                <th className="px-4 py-3 text-left border-b border-gray-200">
                  <span style={{ fontFamily: 'Work Sans', fontSize: '14px', fontWeight: 'regular', lineHeight: 'auto', letterSpacing: '0%', color: '#1A1A1A', opacity: '100%' }}>
                    Site
                  </span>
                </th>
                <th className="px-4 py-3 text-left border-b border-gray-200">
                  <span style={{ fontFamily: 'Work Sans', fontSize: '14px', fontWeight: 'regular', lineHeight: 'auto', letterSpacing: '0%', color: '#1A1A1A', opacity: '100%' }}>
                    Zone
                  </span>
                </th>
                <th className="px-4 py-3 text-left border-b border-gray-200">
                  <span style={{ fontFamily: 'Work Sans', fontSize: '14px', fontWeight: 'regular', lineHeight: 'auto', letterSpacing: '0%', color: '#1A1A1A', opacity: '100%' }}>
                    Created by
                  </span>
                </th>
                <th className="px-4 py-3 text-left border-b border-gray-200">
                  <span style={{ fontFamily: 'Work Sans', fontSize: '14px', fontWeight: 'regular', lineHeight: 'auto', letterSpacing: '0%', color: '#1A1A1A', opacity: '100%' }}>
                    Location
                  </span>
                </th>
                <th className="px-4 py-3 text-left border-b border-gray-200">
                  <span style={{ fontFamily: 'Work Sans', fontSize: '14px', fontWeight: 'regular', lineHeight: 'auto', letterSpacing: '0%', color: '#1A1A1A', opacity: '100%' }}>
                    Observation
                  </span>
                </th>
                <th className="px-4 py-3 text-left border-b border-gray-200">
                  <span style={{ fontFamily: 'Work Sans', fontSize: '14px', fontWeight: 'regular', lineHeight: 'auto', letterSpacing: '0%', color: '#1A1A1A', opacity: '100%' }}>
                    Recommendation
                  </span>
                </th>
                <th className="px-4 py-3 text-left border-b border-gray-200">
                  <span style={{ fontFamily: 'Work Sans', fontSize: '14px', fontWeight: 'regular', lineHeight: 'auto', letterSpacing: '0%', color: '#1A1A1A', opacity: '100%' }}>
                    Category
                  </span>
                </th>
                <th className="px-4 py-3 text-left border-b border-gray-200">
                  <span style={{ fontFamily: 'Work Sans', fontSize: '14px', fontWeight: 'regular', lineHeight: 'auto', letterSpacing: '0%', color: '#1A1A1A', opacity: '100%' }}>
                    Sub category
                  </span>
                </th>
                <th className="px-4 py-3 text-left border-b border-gray-200">
                  <span style={{ fontFamily: 'Work Sans', fontSize: '14px', fontWeight: 'regular', lineHeight: 'auto', letterSpacing: '0%', color: '#1A1A1A', opacity: '100%' }}>
                    Categorization
                  </span>
                </th>
                <th className="px-4 py-3 text-left border-b border-gray-200">
                  <span style={{ fontFamily: 'Work Sans', fontSize: '14px', fontWeight: 'regular', lineHeight: 'auto', letterSpacing: '0%', color: '#1A1A1A', opacity: '100%' }}>
                    Tag
                  </span>
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredData.length === 0 ? (
                <tr>
                  <td colSpan={14} className="text-center py-8 text-gray-500">
                    {hasActiveFilters ? 'No results found for the selected filters.' : 'No data available.'}
                  </td>
                </tr>
              ) : (
                filteredData.map((item, index) => (
                  <tr key={item.id} className="hover:bg-gray-50 border-b border-gray-200">
                    <td className="w-5 px-5 py-3" style={{ paddingLeft: '20px', paddingRight: '16px', paddingTop: '12px', paddingBottom: '12px' }}>
                      <Checkbox
                        checked={selectedItems.includes(item.id)}
                        onCheckedChange={(checked) => handleSelectItem(item.id, checked as boolean)}
                        className="w-4 h-4"
                      />
                    </td>
                    <td className="px-10 py-3" style={{ paddingLeft: '40px' }}>
                      <button
                        onClick={() => handleRowClick(item.id)}
                        className="text-gray-600 hover:text-gray-800"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <span style={{ fontFamily: 'Work Sans', fontSize: '12px', fontWeight: 'regular', lineHeight: 'auto', letterSpacing: '0%', color: '#1A1A1A', opacity: '100%' }}>
                        {item.id}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span style={{ fontFamily: 'Work Sans', fontSize: '12px', fontWeight: 'regular', lineHeight: 'auto', letterSpacing: '0%', color: '#1A1A1A', opacity: '100%' }}>
                        {item.date}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span style={{ fontFamily: 'Work Sans', fontSize: '12px', fontWeight: 'regular', lineHeight: 'auto', letterSpacing: '0%', color: '#1A1A1A', opacity: '100%' }}>
                        {item.site}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span style={{ fontFamily: 'Work Sans', fontSize: '12px', fontWeight: 'regular', lineHeight: 'auto', letterSpacing: '0%', color: '#1A1A1A', opacity: '100%' }}>
                        {item.zone}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span style={{ fontFamily: 'Work Sans', fontSize: '12px', fontWeight: 'regular', lineHeight: 'auto', letterSpacing: '0%', color: '#1A1A1A', opacity: '100%' }}>
                        {item.createdBy}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span style={{ fontFamily: 'Work Sans', fontSize: '12px', fontWeight: 'regular', lineHeight: 'auto', letterSpacing: '0%', color: '#1A1A1A', opacity: '100%' }}>
                        {item.location}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span style={{ fontFamily: 'Work Sans', fontSize: '12px', fontWeight: 'regular', lineHeight: 'auto', letterSpacing: '0%', color: '#1A1A1A', opacity: '100%' }}>
                        {item.observation}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span style={{ fontFamily: 'Work Sans', fontSize: '12px', fontWeight: 'regular', lineHeight: 'auto', letterSpacing: '0%', color: '#1A1A1A', opacity: '100%' }}>
                        {item.recommendation}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span style={{ fontFamily: 'Work Sans', fontSize: '12px', fontWeight: 'regular', lineHeight: 'auto', letterSpacing: '0%', color: '#1A1A1A', opacity: '100%' }}>
                        {item.category}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span style={{ fontFamily: 'Work Sans', fontSize: '12px', fontWeight: 'regular', lineHeight: 'auto', letterSpacing: '0%', color: '#1A1A1A', opacity: '100%' }}>
                        {item.subCategory}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span style={{ fontFamily: 'Work Sans', fontSize: '12px', fontWeight: 'regular', lineHeight: 'auto', letterSpacing: '0%', color: '#1A1A1A', opacity: '100%' }}>
                        {item.categorization}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span style={{ fontFamily: 'Work Sans', fontSize: '12px', fontWeight: 'regular', lineHeight: 'auto', letterSpacing: '0%', color: '#1A1A1A', opacity: '100%' }}>
                        {item.tag}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

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
