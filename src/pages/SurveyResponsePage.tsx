import React, { useState } from 'react';
import { Eye, Upload, Filter, Download, Search, RotateCcw, Activity, ThumbsUp, ClipboardList } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { EnhancedTable } from '../components/enhanced-table/EnhancedTable';
import { SurveyResponseFilterModal } from '@/components/SurveyResponseFilterModal';

const mockResponseData = [
  {
    id: 12345,
    surveyTitle: "Survey Title 123",
    responses: 1,
    tickets: 1,
    expiryDate: "01/07/2025"
  },
  {
    id: 12345,
    surveyTitle: "Survey Title 123",
    responses: 2,
    tickets: 2,
    expiryDate: "01/07/2025"
  },
  {
    id: 12345,
    surveyTitle: "Survey Title 123",
    responses: 2,
    tickets: 2,
    expiryDate: "01/07/2025"
  },
  {
    id: 12345,
    surveyTitle: "Survey Title 123",
    responses: 4,
    tickets: 4,
    expiryDate: "01/07/2025"
  },
  {
    id: 12345,
    surveyTitle: "Survey Title 123",
    responses: 5,
    tickets: 5,
    expiryDate: "01/07/2025"
  },
  {
    id: 12345,
    surveyTitle: "Survey Title 123",
    responses: 7,
    tickets: 7,
    expiryDate: "01/07/2025"
  },
  {
    id: 12345,
    surveyTitle: "Survey Title 123",
    responses: 8,
    tickets: 8,
    expiryDate: "01/07/2025"
  }
];

export const SurveyResponsePage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [selectedItems, setSelectedItems] = useState<any[]>([]);
  const [responseData, setResponseData] = useState(mockResponseData);

  const handleViewDetails = (item: any) => {
    console.log('Viewing details for survey:', item.id);
  };

  const handleFilterClick = () => {
    setIsFilterModalOpen(true);
  };

  const handleCloseFilterModal = () => {
    setIsFilterModalOpen(false);
  };

  const handleApplyFilters = (filters: any) => {
    console.log('Applied filters:', filters);
    // Handle filter application logic here
  };

  const columns = [
    { key: 'id', label: 'ID', sortable: true, draggable: true },
    { key: 'surveyTitle', label: 'Survey Title', sortable: true, draggable: true },
    { key: 'responses', label: 'No. Of Responses', sortable: true, draggable: true },
    { key: 'tickets', label: 'No. Of Tickets', sortable: true, draggable: true },
    { key: 'expiryDate', label: 'Expiry Date', sortable: true, draggable: true }
  ];

  const renderCell = (item: any, columnKey: string) => {
    switch (columnKey) {
      case 'responses':
      case 'tickets':
        return <div className="text-center">{item[columnKey]}</div>;
      default:
        return item[columnKey];
    }
  };

  const renderActions = (item: any) => (
    <button
      onClick={() => handleViewDetails(item)}
      className="text-gray-600 hover:text-[#C72030] transition-colors"
    >
      <Eye className="w-4 h-4" />
    </button>
  );

  // Filter responses based on search term
  const filteredResponses = responseData.filter(item =>
    item.surveyTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.id.toString().includes(searchTerm)
  );

  return (
    <div className="flex-1 p-4 sm:p-6 bg-white min-h-screen">
      {/* Breadcrumb */}
      <div className="mb-6">
        <nav className="flex items-center text-sm text-gray-600 mb-4">
          <span>Survey</span>
          <span className="mx-2">{'>'}</span>
          <span>Response</span>
        </nav>
        <h1 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-6">Response List</h1>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <div className="bg-[#F6F4EE] p-4 rounded-lg flex items-center space-x-3">
          <div className="relative w-12 h-12 flex items-center justify-center flex-shrink-0">
            <div className="absolute inset-0 bg-[#C72030] opacity-10 rounded-full"></div>
            <div className="relative w-8 h-8 bg-[#C72030] rounded-full flex items-center justify-center">
              <Activity className="w-4 h-4 text-white" />
            </div>
          </div>
          <div className="min-w-0">
            <div className="text-xl sm:text-2xl font-bold text-[#C72030]">20</div>
            <div className="text-sm text-gray-600 truncate">Total Active</div>
          </div>
        </div>

        <div className="bg-[#F6F4EE] p-4 rounded-lg flex items-center space-x-3">
          <div className="relative w-12 h-12 flex items-center justify-center flex-shrink-0">
            <div className="absolute inset-0 bg-[#C72030] opacity-10 rounded-full"></div>
            <div className="relative w-8 h-8 bg-[#C72030] rounded-full flex items-center justify-center">
              <ThumbsUp className="w-4 h-4 text-white" />
            </div>
          </div>
          <div className="min-w-0">
            <div className="text-xl sm:text-2xl font-bold text-[#C72030]">10</div>
            <div className="text-sm text-gray-600 truncate">Feedback</div>
          </div>
        </div>

        <div className="bg-[#F6F4EE] p-4 rounded-lg flex items-center space-x-3 sm:col-span-2 lg:col-span-1">
          <div className="relative w-12 h-12 flex items-center justify-center flex-shrink-0">
            <div className="absolute inset-0 bg-[#C72030] opacity-10 rounded-full"></div>
            <div className="relative w-8 h-8 bg-[#C72030] rounded-full flex items-center justify-center">
              <ClipboardList className="w-4 h-4 text-white" />
            </div>
          </div>
          <div className="min-w-0">
            <div className="text-xl sm:text-2xl font-bold text-[#C72030]">10</div>
            <div className="text-sm text-gray-600 truncate">Survey</div>
          </div>
        </div>
      </div>

      {/* Search and Action Buttons */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" className="text-[#C72030] border-[#C72030] hover:bg-[#C72030] hover:text-white">
            <Upload className="w-4 h-4 mr-2" />
            Import
          </Button>
          <Button 
            variant="outline" 
            className="text-[#C72030] border-[#C72030] hover:bg-[#C72030] hover:text-white"
            onClick={handleFilterClick}
          >
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
          <Button variant="outline" className="text-[#C72030] border-[#C72030] hover:bg-[#C72030] hover:text-white">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>

        <div className="flex gap-2 w-full lg:w-auto">
          <div className="relative flex-1 lg:w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search services..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full h-[28px] sm:h-[36px] pl-10 pr-4 border border-gray-300 rounded-none focus:ring-2 focus:ring-[#C72030] focus:border-[#C72030] outline-none text-sm"
            />
          </div>
          <Button variant="outline" className="text-[#C72030] border-[#C72030] hover:bg-[#C72030] hover:text-white flex-shrink-0">
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset
          </Button>
        </div>
      </div>

      {/* Enhanced Data Table */}
      <div>
        <EnhancedTable
          data={filteredResponses}
          columns={columns}
          selectable={true}
          renderActions={renderActions}
          renderCell={renderCell}
          storageKey="survey-response-table"
          enableExport={true}
          exportFileName="survey-response-data"
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          searchPlaceholder="Search responses..."
        />
      </div>

      {/* Filter Modal */}
      <SurveyResponseFilterModal
        open={isFilterModalOpen}
        onClose={handleCloseFilterModal}
        onApplyFilters={handleApplyFilters}
      />
    </div>
  );
};
