import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Eye, Upload, Filter, Download, Search, RotateCcw, Activity, ThumbsUp, ClipboardList } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Pagination, PaginationItem, PaginationContent, PaginationPrevious, PaginationLink, PaginationEllipsis, PaginationNext } from '@/components/ui/pagination';
import { EnhancedTable } from '../components/enhanced-table/EnhancedTable';
import { SurveyResponseFilterModal } from '@/components/SurveyResponseFilterModal';
import { SurveyResponseAnalytics } from '@/components/SurveyResponseAnalytics';
import { SurveyAnalyticsContent } from '@/components/SurveyAnalyticsContent';
import { surveyApi, SurveyResponseData } from '@/services/surveyApi';
import { apiClient } from '@/utils/apiClient';
import { API_CONFIG, getFullUrl, getAuthenticatedFetchOptions } from '@/config/apiConfig';
import { toast } from 'sonner';

interface FilterState {
  surveyTitle: string;
  surveyMappingId: string;
  surveyType: string;
  startDate: Date | null;
  endDate: Date | null;
}

interface AnalyticsData {
  statistics?: {
    active_surveys?: number;
    total_surveys?: number;
    [key: string]: unknown;
  };
  status?: {
    info?: {
      total_active_surveys?: number;
      [key: string]: unknown;
    };
    [key: string]: unknown;
  };
  distributions?: {
    info?: {
      total_feedback_surveys?: number;
      total_feedback_count?: number;
      total_assessment_surveys?: number;
      total_survey_count?: number;
      [key: string]: unknown;
    };
    [key: string]: unknown;
  };
  typeWise?: {
    [key: string]: unknown;
  };
  categoryWise?: {
    [key: string]: unknown;
  };
  dateRange?: {
    startDate?: Date;
    endDate?: Date;
    [key: string]: unknown;
  };
}

// New interfaces for the response list API
interface Complaint {
  complaint_id: number;
  ticket_number: string;
  heading: string;
  assigned_to: number | null;
  assignee: string;
  created_at: string;
}

interface Response {
  answer_id: number;
  question_id: number | null;
  option_id: number | null;
  option_type: string | null;
  created_at: string;
  complaints: Complaint[];
}

interface SurveyMapping {
  id: number;
  site_id: number;
  building_id: number;
  wing_id: number | null;
  floor_id: number | null;
  area_id: number | null;
  room_id: number | null;
  site_name: string;
  building_name: string;
  wing_name: string | null;
  floor_name: string | null;
  area_name: string | null;
  room_name: string | null;
  responses: Response[];
}

interface Survey {
  survey_id: number;
  survey_name: string;
  survey_mappings: SurveyMapping[];
}

interface SurveyResponseApiResponse {
  surveys: Survey[];
  pagination: {
    current_page: number;
    per_page: number;
    total_count: number;
    total_pages: number;
  };
}

// Transformed interface for table display
interface TransformedSurveyResponse {
  id: number;
  survey_name: string;
  survey_id: number;
  mapping_id?: number;
  site_name: string;
  building_name: string;
  wing_name: string;
  floor_name: string;
  area_name: string;
  room_name: string;
  total_responses: number;
  total_complaints: number;
  latest_response_date: string;
}

export const SurveyResponsePage = () => {
  console.log('SurveyResponsePage component loaded successfully with EnhancedTable');
  const navigate = useNavigate();
  const location = useLocation();
  
  // Note: survey_id filtering has been removed as requested
  console.log('🔍 Fetching all survey responses without survey_id filter');
  
  const [searchTerm, setSearchTerm] = useState('');
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [selectedItems, setSelectedItems] = useState<TransformedSurveyResponse[]>([]);
  const [responseData, setResponseData] = useState<TransformedSurveyResponse[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('list');
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({
    current_page: 1,
    per_page: 10,
    total_count: 0,
    total_pages: 1
  });
  const [summaryStats, setSummaryStats] = useState({
    total_active_surveys: 0,
    total_feedback_count: 0,
    total_survey_count: 0,
  });
  const [appliedFilters, setAppliedFilters] = useState<FilterState>({
    surveyTitle: '',
    surveyMappingId: '', // Remove default survey_id
    surveyType: '',
    startDate: null,
    endDate: null
  });

  // Handle analytics data updates from the analytics component
  const handleAnalyticsChange = (data: AnalyticsData) => {
    setAnalyticsData(data);
    
    // Update summary stats based on analytics data
    if (data.distributions?.info || data.statistics) {
      setSummaryStats(prev => ({
        total_active_surveys: data.statistics?.active_surveys || data.status?.info?.total_active_surveys || prev.total_active_surveys,
        total_feedback_count: data.distributions?.info?.total_feedback_surveys || data.distributions?.info?.total_feedback_count || prev.total_feedback_count,
        total_survey_count: data.distributions?.info?.total_assessment_surveys || data.statistics?.total_surveys || data.distributions?.info?.total_survey_count || prev.total_survey_count,
      }));
    }
  };

  // New function to fetch survey response list from the API
  const fetchSurveyResponseList = async (page: number = 1) => {
    try {
      const url = getFullUrl('/survey_mappings/response_list.json');
      const options = getAuthenticatedFetchOptions();
      
      const urlWithParams = new URL(url);
      
      // Add access_token parameter
      if (API_CONFIG.TOKEN) {
        urlWithParams.searchParams.append('access_token', API_CONFIG.TOKEN);
        console.log('🔑 Adding access_token to request');
      }
      
      // Add page parameter
      urlWithParams.searchParams.append('page', page.toString());
      
      // Note: survey_id parameter removed as requested
      console.log('🚀 Calling survey response list API (without survey_id filter):', urlWithParams.toString());
      
      const response = await fetch(urlWithParams.toString(), options);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Survey Response List API Error Response:', errorText);
        
        if (response.status === 401) {
          throw new Error('Authentication failed. Please check your access token and try again.');
        } else if (response.status === 403) {
          throw new Error('Access denied. You do not have permission to access this survey data.');
        } else if (response.status === 404) {
          throw new Error('Survey data not found.');
        } else {
          throw new Error(`Failed to fetch survey responses: ${response.status} ${response.statusText}`);
        }
      }
      
      const data: SurveyResponseApiResponse = await response.json();
      console.log('✅ Survey response list fetched successfully:', data);
      
      return data;
    } catch (error) {
      console.error('❌ Error fetching survey response list:', error);
      throw error;
    }
  };

  // Transform API data to table format
  const transformSurveyData = (surveys: Survey[]): TransformedSurveyResponse[] => {
    const transformedData: TransformedSurveyResponse[] = [];
    
    surveys.forEach(survey => {
      if (survey.survey_mappings.length === 0) {
        // Survey with no mappings
        transformedData.push({
          id: survey.survey_id,
          survey_name: survey.survey_name,
          survey_id: survey.survey_id,
          site_name: 'No Mapping',
          building_name: 'No Mapping',
          wing_name: 'No Mapping',
          floor_name: 'No Mapping',
          area_name: 'No Mapping',
          room_name: 'No Mapping',
          total_responses: 0,
          total_complaints: 0,
          latest_response_date: 'No Responses'
        });
      } else {
        // Survey with mappings
        survey.survey_mappings.forEach(mapping => {
          const totalComplaints = mapping.responses.reduce((total, response) => {
            return total + response.complaints.length;
          }, 0);
          
          const latestResponseDate = mapping.responses.length > 0 
            ? new Date(Math.max(...mapping.responses.map(r => new Date(r.created_at).getTime())))
                .toLocaleDateString('en-GB', {
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })
            : 'No Responses';
          
          transformedData.push({
            id: mapping.id,
            survey_name: survey.survey_name,
            survey_id: survey.survey_id,
            mapping_id: mapping.id,
            site_name: mapping.site_name || 'N/A',
            building_name: mapping.building_name || 'N/A',
            wing_name: mapping.wing_name || 'N/A',
            floor_name: mapping.floor_name || 'N/A',
            area_name: mapping.area_name || 'N/A',
            room_name: mapping.room_name || 'N/A',
            total_responses: mapping.responses.length,
            total_complaints: totalComplaints,
            latest_response_date: latestResponseDate
          });
        });
      }
    });
    
    return transformedData;
  };

  // Fetch summary statistics from API
  const fetchSummaryStats = useCallback(async () => {
    try {
      // Fetch from the survey details API with analytics flag
      const url = getFullUrl(API_CONFIG.ENDPOINTS.SURVEY_DETAILS);
      const urlWithParams = new URL(url);
      urlWithParams.searchParams.append('access_token', API_CONFIG.TOKEN || '');
      urlWithParams.searchParams.append('analytics', 'true');
      
      const response = await fetch(urlWithParams.toString());
      if (response.ok) {
        const data = await response.json();
        console.log('Survey summary stats API response:', data);
        
        // Extract counts from the API response
        const activeCount = data.survey_status?.active_survey || 
                          data.analytics?.total_surveys || 
                          responseData.length || 20;
        
        const feedbackCount = data.distributions?.info?.total_feedback_surveys ||
                            data.analytics?.total_feedback_count ||
                            data.survey_details?.surveys?.filter((s: { survey_type: string }) => s.survey_type === 'feedback')?.length ||
                            10;
                            
        const surveyCount = data.distributions?.info?.total_assessment_surveys ||
                          data.analytics?.total_survey_count ||
                          data.survey_details?.surveys?.length ||
                          10;
        
        setSummaryStats({
          total_active_surveys: activeCount,
          total_feedback_count: feedbackCount,
          total_survey_count: surveyCount,
        });
      }
    } catch (error) {
      console.error('Error fetching summary stats:', error);
      // Keep default values on error
      setSummaryStats(prev => ({
        ...prev,
        total_active_surveys: responseData.length || 20
      }));
    }
  }, [responseData.length]);

  const fetchSurveyResponses = async (filters?: FilterState) => {
    setIsLoading(true);
    try {
      console.log('📡 Fetching survey responses for page:', currentPage);
      
      const data = await fetchSurveyResponseList(currentPage);
      const transformedData = transformSurveyData(data.surveys);
      
      console.log('Fetched and transformed survey responses:', transformedData);
      console.log('Pagination data from API:', data.pagination);
      
      setResponseData(transformedData);
      setPagination({
        current_page: data.pagination.current_page,
        per_page: data.pagination.per_page,
        total_count: data.pagination.total_count,
        total_pages: data.pagination.total_pages
      });
      
      // Update summary stats from the transformed data
      const totalSurveys = data.surveys.length;
      const totalResponses = transformedData.reduce((sum, item) => sum + item.total_responses, 0);
      const totalComplaints = transformedData.reduce((sum, item) => sum + item.total_complaints, 0);
      
      setSummaryStats({
        total_active_surveys: totalSurveys,
        total_feedback_count: totalResponses,
        total_survey_count: totalComplaints,
      });
      
      console.log('✅ Pagination updated:', {
        current_page: data.pagination.current_page,
        per_page: data.pagination.per_page,
        total_count: data.pagination.total_count,
        total_pages: data.pagination.total_pages
      });
      
    } catch (error) {
      console.error('Error fetching survey responses:', error);
      toast.error('Failed to fetch survey responses');
      setResponseData([]);
      // Reset pagination on error
      setPagination({
        current_page: 1,
        per_page: 10,
        total_count: 0,
        total_pages: 1
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchFilteredSurveyResponses = async (filters: FilterState) => {
    try {
      // Build query parameters
      let url = '/survey_mapping_responses/all_responses.json?';
      const params = new URLSearchParams();
      
      // Add access_token parameter first
      if (API_CONFIG.TOKEN) {
        params.append('access_token', API_CONFIG.TOKEN);
        console.log('🔑 Adding access_token to filtered request');
      }
      
      // Note: survey_id parameter removed as requested
      console.log('🔍 Filtering responses without survey_id restriction');
      
      if (filters.surveyTitle) {
        params.append('q[survey_mapping_survey_name_cont]', filters.surveyTitle);
      }
      
      if (filters.surveyType) {
        params.append('q[survey_type_eq]', filters.surveyType);
      }
      
      if (filters.startDate) {
        params.append('q[created_at_gteq]', filters.startDate.toISOString());
      }
      
      if (filters.endDate) {
        params.append('q[created_at_lteq]', filters.endDate.toISOString());
      }
      
      url += params.toString();
      
      console.log('🚀 Calling filtered survey responses API:', url);
      
      const response = await apiClient.get(url);
      return response.data || [];
    } catch (error) {
      console.error('Error fetching filtered survey responses:', error);
      throw error;
    }
  };

  const handleViewDetails = (item: TransformedSurveyResponse) => {
    console.log('Eye button clicked - item data:', JSON.stringify(item, null, 2));
    console.log('🔍 Navigating to survey details with survey_id:', item.survey_id);
    console.log('🔍 Using survey_id instead of mapping_id (item.id):', item.id);
    navigate(`/maintenance/survey/response/details/${item.survey_id}`, {
      state: { surveyData: item }
    });
  };

  const handleFilterClick = () => {
    setIsFilterModalOpen(true);
  };

  const handleCloseFilterModal = () => {
    setIsFilterModalOpen(false);
  };

  const handleApplyFilters = (filters: FilterState) => {
    console.log('Applied filters:', filters);
    setAppliedFilters(filters);
    // Reset to page 1 when filters are applied
    setCurrentPage(1);
    // Data will be fetched automatically by useEffect when currentPage changes
  };

  const handleResetFilters = () => {
    const resetFilters = {
      surveyTitle: '',
      surveyMappingId: '', // Remove survey_id from reset filters
      surveyType: '',
      startDate: null,
      endDate: null
    };
    setAppliedFilters(resetFilters);
    // Reset to page 1 when filters are reset
    setCurrentPage(1);
    // Data will be fetched automatically by useEffect when currentPage changes
  };

  const columns = [
    { key: 'actions', label: 'Actions', sortable: false, draggable: false },
    // { key: 'survey_id', label: 'Survey ID', sortable: true, draggable: true },
    { key: 'survey_name', label: 'Survey Name', sortable: true, draggable: true },
    { key: 'site_name', label: 'Site Name', sortable: true, draggable: true },
    { key: 'building_name', label: 'Building Name', sortable: true, draggable: true },
    { key: 'wing_name', label: 'Wing Name', sortable: true, draggable: true },
    { key: 'floor_name', label: 'Floor Name', sortable: true, draggable: true },
    { key: 'area_name', label: 'Area Name', sortable: true, draggable: true },
    { key: 'room_name', label: 'Room Name', sortable: true, draggable: true },
    { key: 'total_responses', label: 'Total Responses', sortable: true, draggable: true },
    { key: 'total_complaints', label: 'Total Complaints', sortable: true, draggable: true },
    { key: 'latest_response_date', label: 'Latest Response', sortable: true, draggable: true }
  ];

  const renderCell = (item: TransformedSurveyResponse, columnKey: string) => {
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
      // case 'survey_id':
      //   return item.survey_id;
      case 'survey_name':
        return item.survey_name || 'N/A';
      case 'site_name':
        return item.site_name || 'N/A';
      case 'building_name':
        return item.building_name || 'N/A';
      case 'wing_name':
        return item.wing_name || 'N/A';
      case 'floor_name':
        return item.floor_name || 'N/A';
      case 'area_name':
        return item.area_name || 'N/A';
      case 'room_name':
        return item.room_name || 'N/A';
      case 'total_responses':
        return (
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            item.total_responses > 0 
              ? 'bg-green-100 text-green-800' 
              : 'bg-gray-100 text-gray-800'
          }`}>
            {item.total_responses}
          </span>
        );
      case 'total_complaints':
        return (
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            item.total_complaints > 0 
              ? 'bg-red-100 text-red-800' 
              : 'bg-gray-100 text-gray-800'
          }`}>
            {item.total_complaints}
          </span>
        );
      case 'latest_response_date':
        return item.latest_response_date || 'No Responses';
      default: {
        const value = item[columnKey as keyof TransformedSurveyResponse];
        return typeof value === 'object' ? JSON.stringify(value) : String(value || '');
      }
    }
  };


  // Filter responses based on search term
  const filteredResponses = responseData.filter(item =>
    item.survey_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.survey_id.toString().includes(searchTerm) ||
    item.site_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.building_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle page change
  const handlePageChange = (page: number) => {
    console.log('📄 Page changed to:', page);
    setCurrentPage(page);
    // Data will be fetched automatically by useEffect when currentPage changes
  };

  // Get dynamic counts from summary stats
  const getTotalActiveCount = () => {
    return summaryStats.total_active_surveys;
  };

  const getFeedbackCount = () => {
    return summaryStats.total_feedback_count;
  };

  const getSurveyCount = () => {
    return summaryStats.total_survey_count;
  };

  // Fetch survey responses when currentPage changes
  useEffect(() => {
    console.log('🔄 useEffect triggered for currentPage:', currentPage);
    
    const fetchData = async () => {
      setIsLoading(true);
      try {
        console.log('📡 Fetching survey responses for page:', currentPage);
        
        const data = await fetchSurveyResponseList(currentPage);
        const transformedData = transformSurveyData(data.surveys);
        
        console.log('Fetched and transformed survey responses:', transformedData);
        console.log('Pagination data from API:', data.pagination);
        
        setResponseData(transformedData);
        setPagination({
          current_page: data.pagination.current_page,
          per_page: data.pagination.per_page,
          total_count: data.pagination.total_count,
          total_pages: data.pagination.total_pages
        });
        
        // Update summary stats from the transformed data
        const totalSurveys = data.surveys.length;
        const totalResponses = transformedData.reduce((sum, item) => sum + item.total_responses, 0);
        const totalComplaints = transformedData.reduce((sum, item) => sum + item.total_complaints, 0);
        
        setSummaryStats({
          total_active_surveys: totalSurveys,
          total_feedback_count: totalResponses,
          total_survey_count: totalComplaints,
        });
        
        console.log('✅ Pagination updated:', {
          current_page: data.pagination.current_page,
          per_page: data.pagination.per_page,
          total_count: data.pagination.total_count,
          total_pages: data.pagination.total_pages
        });
        
      } catch (error) {
        console.error('Error fetching survey responses:', error);
        toast.error('Failed to fetch survey responses');
        setResponseData([]);
        // Reset pagination on error
        setPagination({
          current_page: 1,
          per_page: 10,
          total_count: 0,
          total_pages: 1
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [currentPage]); // Only depend on currentPage
  
  // Fetch summary stats separately
  useEffect(() => {
    fetchSummaryStats();
  }, [fetchSummaryStats]);

  // Update summary stats when response data changes
  useEffect(() => {
    if (responseData.length > 0) {
      fetchSummaryStats();
    }
  }, [responseData.length, fetchSummaryStats]);

  return (
    <div className="flex-1 p-4 sm:p-6 bg-white min-h-screen">
      {/* Breadcrumb */}
      <div className="mb-6">
        {/* API Status Display */}
        {/* <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-blue-800">API Endpoint:</span>
              <span className="text-sm font-bold text-blue-900">/survey_mappings/response_list.json</span>
              <span className="text-xs text-blue-600">
                (fetching all survey responses)
              </span>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-xs text-blue-600">Page:</span>
                <span className="text-xs font-bold text-blue-900">
                  {pagination.current_page} of {pagination.total_pages}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-blue-600">Total:</span>
                <span className="text-xs font-bold text-blue-900">
                  {pagination.total_count} records
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-blue-600">Access Token:</span>
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                  API_CONFIG.TOKEN 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {API_CONFIG.TOKEN ? 'Active' : 'Missing'}
                </span>
              </div>
            </div>
          </div>
        </div> */}
        {/* <nav className="flex items-center text-sm text-gray-600 mb-4">
          <span>Survey</span>
          <span className="mx-2">{'>'}</span>
          <span>Response</span>
        </nav> */}
        {/* <h1 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-6">Survey Response</h1> */}
      </div>

      {/* Tab Navigation */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-white border border-gray-200 mb-6">
          <TabsTrigger
            value="list"
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

        {/* Tab Content */}
        <TabsContent value="list" className="mt-0">
          {/* AMC List-Style Statistics Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-4 mb-6">
            {/* Total Active */}
            <div className="p-3 sm:p-4 rounded-lg shadow-sm h-[100px] sm:h-[132px] flex items-center gap-2 sm:gap-4 bg-[#f6f4ee] cursor-pointer hover:bg-[#edeae3]">
              <div className="w-8 h-8 sm:w-12 sm:h-12 flex items-center justify-center flex-shrink-0 bg-[#C4B89D54]">
                <Activity className="w-4 h-4 sm:w-6 sm:h-6" style={{ color: '#C72030' }} />
              </div>
              <div className="flex flex-col min-w-0 justify-start">
                <div className="text-lg sm:text-2xl font-bold leading-tight truncate">
                  {getTotalActiveCount()}
                  {isLoading && <span className="ml-1 text-xs animate-pulse">...</span>}
                </div>
                <span className="text-xs sm:text-sm text-muted-foreground font-medium leading-tight">Total Active</span>
              </div>
            </div>

            {/* Feedback */}
            <div className="p-3 sm:p-4 rounded-lg shadow-sm h-[100px] sm:h-[132px] flex items-center gap-2 sm:gap-4 bg-[#f6f4ee] cursor-pointer hover:bg-[#edeae3]">
              <div className="w-8 h-8 sm:w-12 sm:h-12 flex items-center justify-center flex-shrink-0 bg-[#C4B89D54]">
                <ThumbsUp className="w-4 h-4 sm:w-6 sm:h-6" style={{ color: '#C72030' }} />
              </div>
              <div className="flex flex-col min-w-0 justify-start">
                <div className="text-lg sm:text-2xl font-bold leading-tight truncate">
                  {getFeedbackCount()}
                  {isLoading && <span className="ml-1 text-xs animate-pulse">...</span>}
                </div>
                <span className="text-xs sm:text-sm text-muted-foreground font-medium leading-tight">Feedback</span>
              </div>
            </div>

            {/* Survey */}
            <div className="p-3 sm:p-4 rounded-lg shadow-sm h-[100px] sm:h-[132px] flex items-center gap-2 sm:gap-4 bg-[#f6f4ee] cursor-pointer hover:bg-[#edeae3]">
              <div className="w-8 h-8 sm:w-12 sm:h-12 flex items-center justify-center flex-shrink-0 bg-[#C4B89D54]">
                <ClipboardList className="w-4 h-4 sm:w-6 sm:h-6" style={{ color: '#C72030' }} />
              </div>
              <div className="flex flex-col min-w-0 justify-start">
                <div className="text-lg sm:text-2xl font-bold leading-tight truncate">
                  {getSurveyCount()}
                  {isLoading && <span className="ml-1 text-xs animate-pulse">...</span>}
                </div>
                <span className="text-xs sm:text-sm text-muted-foreground font-medium leading-tight">Survey</span>
              </div>
            </div>

            {/* Placeholder for 2 more cards if needed */}
            <div className="hidden sm:flex"></div>
            <div className="hidden sm:flex"></div>
          </div>

          {/* Enhanced Data Table */}
          <div>
            {isLoading ? (
              <div className="flex justify-center items-center p-8">
                <div className="text-gray-500">Loading survey responses...</div>
              </div>
            ) : (
              <>
                <EnhancedTable
                  data={filteredResponses}
                  columns={columns}
                  renderCell={renderCell}
                  storageKey="survey-response-table"
                  enableExport={true}
                  exportFileName="survey-response-data"
                  searchTerm={searchTerm}
                  onSearchChange={setSearchTerm}
                  searchPlaceholder="Search responses..."
                  pagination={false}
                  leftActions={
                    <div className="flex flex-wrap gap-2">
                      {/* Filter button is now positioned next to search input in EnhancedTable */}
                    </div>
                  }
                  onFilterClick={handleFilterClick}
                />
                
                {/* Custom API-based Pagination */}
                {pagination.total_pages > 1 && (
                  <div className="mt-6">
                    <Pagination>
                      <PaginationContent>
                        <PaginationItem>
                          <PaginationPrevious
                            onClick={() => {
                              if (pagination.current_page > 1) handlePageChange(pagination.current_page - 1);
                            }}
                            className={pagination.current_page === 1 ? "pointer-events-none opacity-50" : ""}
                          />
                        </PaginationItem>
                        {Array.from(
                          { length: Math.min(pagination.total_pages, 10) },
                          (_, i) => i + 1
                        ).map((page) => (
                          <PaginationItem key={page}>
                            <PaginationLink
                              onClick={() => handlePageChange(page)}
                              isActive={pagination.current_page === page}
                            >
                              {page}
                            </PaginationLink>
                          </PaginationItem>
                        ))}
                        {pagination.total_pages > 10 && (
                          <PaginationItem>
                            <PaginationEllipsis />
                          </PaginationItem>
                        )}
                        <PaginationItem>
                          <PaginationNext
                            onClick={() => {
                              if (pagination.current_page < pagination.total_pages) handlePageChange(pagination.current_page + 1);
                            }}
                            className={pagination.current_page === pagination.total_pages ? "pointer-events-none opacity-50" : ""}
                          />
                        </PaginationItem>
                      </PaginationContent>
                    </Pagination>
                    <div className="text-center mt-2 text-sm text-gray-600">
                      Showing page {pagination.current_page} of {pagination.total_pages} ({pagination.total_count} total records)
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="mt-0">
          <SurveyAnalyticsContent />
        </TabsContent>
      </Tabs>

      {/* Filter Modal */}
      <SurveyResponseFilterModal
        open={isFilterModalOpen}
        onClose={handleCloseFilterModal}
        onApplyFilters={handleApplyFilters}
        onResetFilters={handleResetFilters}
      />
    </div>
  );
};