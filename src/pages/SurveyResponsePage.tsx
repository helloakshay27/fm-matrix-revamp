
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, Upload, Filter, Download, Search, RotateCcw, Activity, ThumbsUp, ClipboardList, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
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
    <div className="flex-1 p-4 sm:p-6 bg-gray-50 min-h-screen">
      {/* Header Tabs */}
      <div className="mb-6">
        <Tabs defaultValue="response-list" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-white border border-gray-200">
            <TabsTrigger
              value="response-list"
              className="flex items-center gap-2 data-[state=active]:bg-[#EDEAE3] data-[state=active]:text-[#C72030] data-[state=inactive]:bg-white data-[state=inactive]:text-black border-none font-semibold"
            >
              <svg
                width="18"
                height="19"
                viewBox="0 0 18 19"
                fill="currentColor"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M1.875 4.25L3 5.375L5.25 3.125M1.875 9.5L3 10.625L5.25 8.375M1.875 14.75L3 15.875L5.25 13.625M7.875 9.5H16.125M7.875 14.75H16.125M7.875 4.25H16.125"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Response List
            </TabsTrigger>
            <TabsTrigger
              value="analytics"
              className="flex items-center gap-2 data-[state=active]:bg-[#EDEAE3] data-[state=active]:text-[#C72030] data-[state=inactive]:bg-white data-[state=inactive]:text-black border-none font-semibold"
            >
              <svg
                width="16"
                height="15"
                viewBox="0 0 16 15"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-4 h-4"
              >
                <path
                  d="M7.66681 11.6106C6.59669 11.5192 5.69719 11.0831 4.96831 10.3024C4.23944 9.52162 3.875 8.5875 3.875 7.5C3.875 6.35413 4.27606 5.38019 5.07819 4.57819C5.88019 3.77606 6.85413 3.375 8 3.375C9.0875 3.375 10.0216 3.73825 10.8024 4.46475C11.5831 5.19112 12.0192 6.08944 12.1106 7.15969L10.9179 6.80625C10.7557 6.13125 10.4066 5.57812 9.87031 5.14688C9.33419 4.71563 8.71075 4.5 8 4.5C7.175 4.5 6.46875 4.79375 5.88125 5.38125C5.29375 5.96875 5 6.675 5 7.5C5 8.2125 5.21681 8.8375 5.65044 9.375C6.08406 9.9125 6.636 10.2625 7.30625 10.425L7.66681 11.6106ZM8.56681 14.5946C8.47231 14.6149 8.37788 14.625 8.2835 14.625H8C7.01438 14.625 6.08812 14.438 5.22125 14.064C4.35437 13.69 3.60031 13.1824 2.95906 12.5413C2.31781 11.9002 1.81019 11.1463 1.43619 10.2795C1.06206 9.41275 0.875 8.48669 0.875 7.50131C0.875 6.51581 1.062 5.5895 1.436 4.72237C1.81 3.85525 2.31756 3.101 2.95869 2.45962C3.59981 1.81825 4.35375 1.31044 5.2205 0.936187C6.08725 0.562062 7.01331 0.375 7.99869 0.375C8.98419 0.375 9.9105 0.562062 10.7776 0.936187C11.6448 1.31019 12.399 1.81781 13.0404 2.45906C13.6818 3.10031 14.1896 3.85437 14.5638 4.72125C14.9379 5.58812 15.125 6.51438 15.125 7.5V7.77975C15.125 7.873 15.1149 7.96631 15.0946 8.05969L14 7.725V7.5C14 5.825 13.4187 4.40625 12.2563 3.24375C11.0938 2.08125 9.675 1.5 8 1.5C6.325 1.5 4.90625 2.08125 3.74375 3.24375C2.58125 4.40625 2 5.825 2 7.5C2 9.175 2.58125 10.5938 3.74375 11.7563C4.90625 12.9187 6.325 13.5 8 13.5H8.225L8.56681 14.5946ZM14.1052 14.7332L10.7043 11.325L9.88944 13.7884L8 7.5L14.2884 9.38944L11.825 10.2043L15.2332 13.6052L14.1052 14.7332Z"
                  fill="currentColor"
                />
              </svg>
              Analytics
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="response-list" className="mt-0">
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
          </TabsContent>
          
          <TabsContent value="analytics" className="mt-0">
            {/* Analytics Content */}
            <div className="p-8 text-center text-gray-500">
              Analytics content will be displayed here
            </div>
          </TabsContent>
        </Tabs>
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
