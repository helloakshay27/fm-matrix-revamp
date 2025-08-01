
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, Upload, Filter, Download, Search, RotateCcw, Activity, ThumbsUp, ClipboardList } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { EnhancedTable } from '../components/enhanced-table/EnhancedTable';
import { SurveyResponseFilterModal } from '@/components/SurveyResponseFilterModal';
import { surveyApi, SurveyResponseData } from '@/services/surveyApi';
import { toast } from 'sonner';

export const SurveyResponsePage = () => {
  console.log('SurveyResponsePage component loaded successfully with EnhancedTable');
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [selectedItems, setSelectedItems] = useState<any[]>([]);
  const [responseData, setResponseData] = useState<SurveyResponseData[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch survey responses on component mount
  useEffect(() => {
    fetchSurveyResponses();
  }, []);

  const fetchSurveyResponses = async () => {
    setIsLoading(true);
    try {
      const data = await surveyApi.getAllSurveyResponses();
      console.log('Fetched survey responses:', data);
      setResponseData(data);
    } catch (error) {
      console.error('Error fetching survey responses:', error);
      toast.error('Failed to fetch survey responses');
      setResponseData([]);
    } finally {
      setIsLoading(false);
    }
  };

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
    // { key: 'tickets', label: 'No. Of Tickets', sortable: true, draggable: true },
    // { key: 'expiryDate', label: 'Expiry Date', sortable: true, draggable: true }
  ];

  const renderCell = (item: SurveyResponseData, columnKey: string) => {
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
      case 'id':
        return item.id;
      case 'surveyTitle':
        return item.survey_title || 'N/A';
      case 'responses':
        return item.response_count || 0;
      case 'tickets':
        return String(item[columnKey as keyof SurveyResponseData] || '');
      default:
        const value = item[columnKey as keyof SurveyResponseData];
        return typeof value === 'object' ? JSON.stringify(value) : String(value || '');
    }
  };


  // Filter responses based on search term
  const filteredResponses = responseData.filter(item =>
    item.survey_title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
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

      {/* Enhanced Data Table */}
      <div>
        {isLoading ? (
          <div className="flex justify-center items-center p-8">
            <div className="text-gray-500">Loading survey responses...</div>
          </div>
        ) : (
          <EnhancedTable
            data={filteredResponses}
            columns={columns}
            // selectable={true}
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
        )}
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
