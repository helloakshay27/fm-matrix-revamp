import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Plus, Download, Filter, RotateCcw } from "lucide-react";
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
            onClick={() => setIsExportOpen(true)}
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

      {/* Table */}
      <div className="bg-white rounded-lg border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="font-semibold">ID</TableHead>
              <TableHead className="font-semibold">Date</TableHead>
              <TableHead className="font-semibold">Site</TableHead>
              <TableHead className="font-semibold">Zone</TableHead>
              <TableHead className="font-semibold">Created by</TableHead>
              <TableHead className="font-semibold">location</TableHead>
              <TableHead className="font-semibold">Observation</TableHead>
              <TableHead className="font-semibold">Recommendation</TableHead>
              <TableHead className="font-semibold">Category</TableHead>
              <TableHead className="font-semibold">Sub category</TableHead>
              <TableHead className="font-semibold">Categorization</TableHead>
              <TableHead className="font-semibold">Tag</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={12} className="text-center py-8 text-gray-500">
                  {hasActiveFilters ? 'No results found for the selected filters.' : 'No data available.'}
                </TableCell>
              </TableRow>
            ) : (
              filteredData.map((item) => (
                <TableRow key={item.id} className="hover:bg-gray-50">
                  <TableCell 
                    className="text-gray-900 font-medium cursor-pointer hover:underline"
                    onClick={() => handleRowClick(item.id)}
                  >
                    {item.id}
                  </TableCell>
                  <TableCell>{item.date}</TableCell>
                  <TableCell>{item.site}</TableCell>
                  <TableCell>{item.zone}</TableCell>
                  <TableCell>{item.createdBy}</TableCell>
                  <TableCell>{item.location}</TableCell>
                  <TableCell>{item.observation}</TableCell>
                  <TableCell>{item.recommendation}</TableCell>
                  <TableCell>{item.category}</TableCell>
                  <TableCell>{item.subCategory}</TableCell>
                  <TableCell>{item.categorization}</TableCell>
                  <TableCell>{item.tag}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
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
