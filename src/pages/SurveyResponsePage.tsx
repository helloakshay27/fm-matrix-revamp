
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, Upload, Filter, Download, Search, RotateCcw, Activity, ThumbsUp, ClipboardList, BarChart3 } from 'lucide-react';
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
  },
  {
    id: 12346,
    surveyTitle: "Customer Satisfaction Survey",
    responses: 12,
    tickets: 3,
    expiryDate: "15/07/2025"
  },
  {
    id: 12347,
    surveyTitle: "Employee Feedback Survey",
    responses: 25,
    tickets: 8,
    expiryDate: "20/07/2025"
  },
  {
    id: 12348,
    surveyTitle: "Product Quality Assessment",
    responses: 18,
    tickets: 5,
    expiryDate: "25/07/2025"
  },
  {
    id: 12349,
    surveyTitle: "Service Quality Survey",
    responses: 30,
    tickets: 12,
    expiryDate: "30/07/2025"
  },
  {
    id: 12350,
    surveyTitle: "Market Research Survey",
    responses: 45,
    tickets: 15,
    expiryDate: "05/08/2025"
  },
  {
    id: 12351,
    surveyTitle: "Training Effectiveness Survey",
    responses: 22,
    tickets: 7,
    expiryDate: "10/08/2025"
  },
  {
    id: 12352,
    surveyTitle: "Event Feedback Survey",
    responses: 35,
    tickets: 10,
    expiryDate: "15/08/2025"
  }
];

export const SurveyResponsePage = () => {
  console.log('SurveyResponsePage component loaded successfully with EnhancedTable');
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [selectedItems, setSelectedItems] = useState<any[]>([]);
  const [responseData, setResponseData] = useState(mockResponseData);

  const handleViewDetails = (item: any) => {
    console.log('Eye button clicked - item data:', JSON.stringify(item, null, 2));
    navigate(`/maintenance/survey/response/details/${item.id}`, {
      state: { surveyData: item }
    });
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
    { key: 'actions', label: 'Actions', sortable: false, draggable: false },
    { key: 'id', label: 'ID', sortable: true, draggable: true },
    { key: 'surveyTitle', label: 'Survey Title', sortable: true, draggable: true },
    { key: 'responses', label: 'No. Of Responses', sortable: true, draggable: true },
    { key: 'tickets', label: 'No. Of Tickets', sortable: true, draggable: true },
    { key: 'expiryDate', label: 'Expiry Date', sortable: true, draggable: true }
  ];

  const renderCell = (item: any, columnKey: string) => {
    switch (columnKey) {
      case 'actions':
        return (
          <button
            onClick={() => handleViewDetails(item)}
            className="text-gray-600 hover:text-[#C72030] transition-colors"
          >
            <Eye className="w-4 h-4" />
          </button>
        );
      case 'responses':
      case 'tickets':
        return <div className="text-center">{item[columnKey]}</div>;
      default:
        return item[columnKey];
    }
  };


  // Filter responses based on search term
  const filteredResponses = responseData.filter(item =>
    item.surveyTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.id.toString().includes(searchTerm)
  );

  return (
    <div className="flex-1 p-4 sm:p-6 bg-white min-h-screen">
      {/* Header Navigation */}
      <div className="bg-gray-100 border border-gray-200 rounded-lg mb-6">
        <div className="flex">
          <div className="flex-1 p-4 border-r border-gray-200">
            <div className="flex items-center gap-2">
              <ClipboardList className="w-5 h-5 text-[#C72030]" />
              <span className="font-medium text-[#C72030]">Response List</span>
            </div>
          </div>
          <div className="flex-1 p-4">
            <div className="flex items-center gap-2 text-gray-600 hover:text-[#C72030] cursor-pointer transition-colors">
              <BarChart3 className="w-5 h-5" />
              <span className="font-medium">Analytics</span>
            </div>
          </div>
        </div>
      </div>

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

      {/* Enhanced Data Table */}
      <div>
        <EnhancedTable
          data={filteredResponses}
          columns={columns}
          selectable={true}
          renderCell={renderCell}
          storageKey="survey-response-table"
          enableExport={true}
          exportFileName="survey-response-data"
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          searchPlaceholder="Search responses..."
          pagination={true}
          pageSize={10}
          leftActions={
            <div className="flex flex-wrap gap-2">
              {/* Filter button is now positioned next to search input in EnhancedTable */}
            </div>
          }
          onFilterClick={handleFilterClick}
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
