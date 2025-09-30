import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Eye,
  Upload,
  Filter,
  Download,
  Search,
  RotateCcw,
  Activity,
  ThumbsUp,
  ClipboardList,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Pagination,
  PaginationItem,
  PaginationContent,
  PaginationPrevious,
  PaginationLink,
  PaginationEllipsis,
  PaginationNext,
} from "@/components/ui/pagination";
import { EnhancedTable } from "../components/enhanced-table/EnhancedTable";
import { SurveyResponseFilterModal } from "@/components/SurveyResponseFilterModal";
import { SurveyResponseAnalytics } from "@/components/SurveyResponseAnalytics";
import { SurveyAnalyticsContent } from "@/components/SurveyAnalyticsContent";
import { ColumnVisibilityDropdown } from "@/components/ColumnVisibilityDropdown";
import { surveyApi, SurveyResponseData } from "@/services/surveyApi";
import {
  API_CONFIG,
  getFullUrl,
  getAuthenticatedFetchOptions,
} from "@/config/apiConfig";
import { toast } from "sonner";

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

// Updated interfaces for the NEW response list API structure
interface Answer {
  answer_id: number;
  quest_map_id: number;
  question_id: number;
  question_name: string;
  answer_type: string;
  created_at: string;
  level_id: number | null;
  comments: string | null;
  responded_by: string;
  option_id?: number;
  option_name?: string;
  option_type?: string;
  ans_descr?: string | null;
}

interface Complaint {
  // Define complaint structure based on API response
  complaint_id?: number;
  ticket_number?: string;
  heading?: string;
  assigned_to?: number | null;
  assignee?: string;
  created_at?: string;
}

interface SurveyResponse {
  survey_id: number;
  survey_name: string;
  survey_status: boolean;
  answers_count: number;
  complaints_count: number;
  question_count: number;
  mapping_id: number;
  site_id: number;
  building_id: number;
  wing_id: number;
  floor_id: number;
  area_id: number;
  room_id: number;
  site_name: string;
  building_name: string;
  wing_name: string;
  floor_name: string;
  area_name: string;
  room_name: string;
  final_comment: string | null;
  complaint_count: number;
  complaints: Complaint[];
  answers: Answer[];
  responded_time?: string;
  location?: {
    site_name?: string;
    building_name?: string;
    wing_name?: string;
    floor_name?: string;
    area_name?: string;
    room_name?: string;
    status?: boolean;
  };
}

interface NewSurveyResponseApiResponse {
  summary: {
    total_surveys: number;
    active_surveys: number;
    inactive_surveys: number;
    total_responses: number;
  };
  responses: SurveyResponse[];
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
  answer_type: string;
  responded_by: string;
  active: boolean;
}

export const SurveyResponsePage = () => {
  // console.log('SurveyResponsePage component loaded successfully with EnhancedTable');
  const navigate = useNavigate();
  const location = useLocation();

  // Note: survey_id filtering has been removed as requested
  // console.log('🔍 Fetching all survey responses without survey_id filter');

  const [searchTerm, setSearchTerm] = useState("");
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [selectedItems, setSelectedItems] = useState<
    TransformedSurveyResponse[]
  >([]);
  const [responseData, setResponseData] = useState<TransformedSurveyResponse[]>(
    []
  );
  const [isLoading, setIsLoading] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [activeTab, setActiveTab] = useState("list");
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({
    current_page: 1,
    per_page: 10,
    total_count: 0,
    total_pages: 1,
  });
  const [summaryStats, setSummaryStats] = useState({
    total_active_surveys: 0,
    total_feedback_count: 0,
    total_survey_count: 0,
    total_responses: 0,
  });
  const [appliedFilters, setAppliedFilters] = useState<FilterState>({
    surveyTitle: "",
    surveyMappingId: "", // Remove default survey_id
    surveyType: "",
    startDate: null,
    endDate: null,
  });

  // Column visibility state - matching SurveyMappingDashboard
  const [columns, setColumns] = useState([
    { key: "actions", label: "Actions", visible: true },
    { key: "survey_name", label: "Survey Name", visible: true },
    // { key: 'site_name', label: 'Site Name', visible: true },
    { key: "building_name", label: "Building Name", visible: true },
    { key: "wing_name", label: "Wing Name", visible: true },
    { key: "floor_name", label: "Floor Name", visible: true },
    { key: "area_name", label: "Area Name", visible: true },
    { key: "room_name", label: "Room Name", visible: true },
    { key: "total_responses", label: "Total Responses", visible: true },
    { key: "total_complaints", label: "Total Complaints", visible: true },
    // { key: "latest_response_date", label: "Latest Response", visible: true },
    { key: "status", label: "Status", visible: true }, // Force status column to be visible
    // { key: 'answer_type', label: 'Answer Type', visible: true },
    // { key: "responded_by", label: "Responded By", visible: true },
  ]);

  // Handle analytics data updates from the analytics component
  const handleAnalyticsChange = (data: AnalyticsData) => {
    setAnalyticsData(data);

    // Update summary stats based on analytics data
    if (data.distributions?.info || data.statistics) {
      setSummaryStats((prev) => ({
        total_active_surveys:
          data.statistics?.active_surveys ||
          data.status?.info?.total_active_surveys ||
          prev.total_active_surveys,
        total_feedback_count:
          data.distributions?.info?.total_feedback_surveys ||
          data.distributions?.info?.total_feedback_count ||
          prev.total_feedback_count,
        total_survey_count:
          data.distributions?.info?.total_assessment_surveys ||
          data.statistics?.total_surveys ||
          data.distributions?.info?.total_survey_count ||
          prev.total_survey_count,
        total_responses: prev.total_responses,
      }));
    }
  };

  // New function to fetch survey response list from the API
  const fetchSurveyResponseList = async (
    page: number = 1,
    filters?: FilterState,
    searchQuery?: string
  ) => {
    try {
      const url = getFullUrl("/survey_mappings/response_list.json?list_response=true");
      const options = getAuthenticatedFetchOptions();

      const urlWithParams = new URL(url);

      // Add page parameter
      urlWithParams.searchParams.append("page", page.toString());

      // Add per_page parameter
      urlWithParams.searchParams.append("per_page", "15");

      // Add access_token parameter if available
      if (API_CONFIG.TOKEN) {
        urlWithParams.searchParams.append("access_token", API_CONFIG.TOKEN);
        // console.log('🔑 Adding access_token to request');
      }

      // Add search query if provided
      if (searchQuery && searchQuery.trim()) {
        urlWithParams.searchParams.append("q[name_cont]", searchQuery.trim());
        // console.log('🔍 Adding search query:', searchQuery);
      }

      // Add survey title filter if provided
      if (filters?.surveyTitle && filters.surveyTitle.trim()) {
        urlWithParams.searchParams.append(
          "q[name_cont]",
          filters.surveyTitle.trim()
        );
        // console.log('🔍 Adding survey title filter:', filters.surveyTitle);
      }

      // console.log('🚀 Calling survey response list API:', urlWithParams.toString());

      const response = await fetch(urlWithParams.toString(), options);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Survey Response List API Error Response:", errorText);

        if (response.status === 401) {
          throw new Error(
            "Authentication failed. Please check your access token and try again."
          );
        } else if (response.status === 403) {
          throw new Error(
            "Access denied. You do not have permission to access this survey data."
          );
        } else if (response.status === 404) {
          throw new Error("Survey data not found.");
        } else {
          throw new Error(
            `Failed to fetch survey responses: ${response.status} ${response.statusText}`
          );
        }
      }

      const data: NewSurveyResponseApiResponse = await response.json();
      // console.log('✅ Survey response list fetched successfully:', data);
      // console.log('📊 API Summary data:', data.summary);
      // console.log('📄 API Pagination data:', data.pagination);
      // console.log('🏢 API Response data (first few items):', data.responses?.slice(0, 2));

      // Debug location data in responses
      if (data.responses && data.responses.length > 0) {
        // console.log('🏢 First response location data:', {
        //   survey_name: data.responses[0].survey_name,
        //   site_name: data.responses[0].site_name,
        //   building_name: data.responses[0].building_name,
        //   wing_name: data.responses[0].wing_name,
        //   floor_name: data.responses[0].floor_name,
        //   area_name: data.responses[0].area_name,
        //   room_name: data.responses[0].room_name
        // });
      }

      return data;
    } catch (error) {
      console.error("❌ Error fetching survey response list:", error);
      throw error;
    }
  };

  // Export handler for survey response data
  const handleSurveyResponseExport = async () => {
    try {
      setIsExporting(true);
      // console.log('📤 Exporting survey response data with current filters:', appliedFilters);

      const url = getFullUrl("/survey_mappings/response_list.json");
      const urlWithParams = new URL(url);

      // Add export parameter
      urlWithParams.searchParams.append("export", "true");

      // Add access_token parameter if available
      if (API_CONFIG.TOKEN) {
        urlWithParams.searchParams.append("access_token", API_CONFIG.TOKEN);
        // console.log('🔑 Adding access_token to export request');
      }

      // Add current filters to export
      if (appliedFilters.surveyTitle && appliedFilters.surveyTitle.trim()) {
        urlWithParams.searchParams.append(
          "q[name_cont]",
          appliedFilters.surveyTitle.trim()
        );
        // console.log('🔍 Adding survey title filter to export:', appliedFilters.surveyTitle);
      }

      // Add survey type filter if provided
      if (appliedFilters.surveyType && appliedFilters.surveyType.trim()) {
        urlWithParams.searchParams.append(
          "q[survey_type_eq]",
          appliedFilters.surveyType.trim()
        );
        // console.log('🔍 Adding survey type filter to export:', appliedFilters.surveyType);
      }

      // Add date range filters if provided
      if (appliedFilters.startDate) {
        urlWithParams.searchParams.append(
          "q[created_at_gteq]",
          appliedFilters.startDate.toISOString()
        );
        // console.log('🔍 Adding start date filter to export:', appliedFilters.startDate);
      }

      if (appliedFilters.endDate) {
        urlWithParams.searchParams.append(
          "q[created_at_lteq]",
          appliedFilters.endDate.toISOString()
        );
        // console.log('🔍 Adding end date filter to export:', appliedFilters.endDate);
      }

      // console.log('🚀 Calling export API:', urlWithParams.toString());

      const options = getAuthenticatedFetchOptions();
      const response = await fetch(urlWithParams.toString(), options);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Export API Error Response:", errorText);
        throw new Error(
          `Export failed: ${response.status} ${response.statusText}`
        );
      }

      // Get the blob data
      const blob = await response.blob();

      // Check if we got a valid file
      if (blob.size === 0) {
        throw new Error("Export file is empty");
      }

      // Create download link
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = downloadUrl;

      // Generate filename with timestamp
      const timestamp = new Date()
        .toISOString()
        .slice(0, 19)
        .replace(/:/g, "-");
      const filterSuffix = appliedFilters.surveyTitle
        ? `-${appliedFilters.surveyTitle.replace(/[^a-zA-Z0-9]/g, "_")}`
        : "";
      link.download = `survey-response-export${filterSuffix}-${timestamp}.xlsx`;

      // Trigger download
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);

      // console.log('✅ Survey response data exported successfully!');
      toast.success("Survey response data exported successfully!");
    } catch (error) {
      console.error("❌ Export error:", error);
      toast.error("Failed to export survey response data. Please try again.");
    } finally {
      setIsExporting(false);
    }
  };

  // Transform API data to table format
  const transformSurveyData = (
    responses: SurveyResponse[]
  ): TransformedSurveyResponse[] => {
    const transformedData: TransformedSurveyResponse[] = [];

    // Check if responses is defined and is an array
    if (!responses || !Array.isArray(responses)) {
      console.warn("⚠️ No responses data or invalid format:", responses);
      return transformedData; // Return empty array if no valid data
    }

    responses.forEach((response) => {
      // Get the latest response date from answers
      // Get the latest response date from answers or responded_time
      let latestResponseDate = "No Responses";
      if (response.responded_time) {
        // responded_time is a single value, not an array
        const dateObj = new Date(response.responded_time);
        latestResponseDate = dateObj.toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        });
      }

      // Get answer type from the first answer (or use the most common one)
      const answerType =
        response.answers.length > 0 && response.answers[0].answer_type
          ? response.answers[0].answer_type
          : "N/A";

      // Get responded by from the first answer (or use the most recent one)
      const respondedBy =
        response.answers.length > 0 && response.answers[0].responded_by
          ? response.answers[0].responded_by
          : "Anonymous";

      // Debug location data
      // console.log('🏢 Location data for survey:', response.survey_name, {
      //   site_name: response.site_name,
      //   building_name: response.building_name,
      //   wing_name: response.wing_name,
      //   floor_name: response.floor_name,
      //   area_name: response.area_name,
      //   room_name: response.room_name
      // });

      // Use response.location if available, otherwise fallback to top-level fields
      const location = response.location || {};
      transformedData.push({
        id: response.mapping_id,
        survey_name: response.survey_name,
        survey_id: response.survey_id,
        mapping_id: response.mapping_id,
        site_name:
          (location.site_name || response.site_name) &&
          (location.site_name || response.site_name).trim() !== ""
            ? location.site_name || response.site_name
            : "N/A",
        building_name:
          (location.building_name || response.building_name) &&
          (location.building_name || response.building_name).trim() !== ""
            ? location.building_name || response.building_name
            : "N/A",
        wing_name:
          (location.wing_name || response.wing_name) &&
          (location.wing_name || response.wing_name).trim() !== ""
            ? location.wing_name || response.wing_name
            : "N/A",
        floor_name:
          (location.floor_name || response.floor_name) &&
          (location.floor_name || response.floor_name).trim() !== ""
            ? location.floor_name || response.floor_name
            : "N/A",
        area_name:
          (location.area_name || response.area_name) &&
          (location.area_name || response.area_name).trim() !== ""
            ? location.area_name || response.area_name
            : "N/A",
        room_name:
          (location.room_name || response.room_name) &&
          (location.room_name || response.room_name).trim() !== ""
            ? location.room_name || response.room_name
            : "N/A",
        total_responses: response?.answers_count || 0,
        total_complaints: response?.complaints_count || 0,
        latest_response_date: latestResponseDate,
        answer_type: answerType,
        responded_by: respondedBy,
        active: location.status ?? response.survey_status ?? true,
      });

      // Debug logging for active status
      // console.log('🔍 Survey response data:', {
      //   survey_name: response.survey_name,
      //   active: response.active,
      //   active_type: typeof response.active,
      //   mapping_id: response.mapping_id
      // });
    });

    return transformedData;
  };

  // console.log("resp data", responseData);
  const fetchSurveyResponses = useCallback(
    async (filters?: FilterState, searchQuery?: string, page?: number) => {
      // Only show loading for non-search operations (when searchQuery is empty or this is initial load)
      const isInitialOrFilterLoad = !searchQuery || searchQuery.trim() === "";
      if (isInitialOrFilterLoad) {
        setIsLoading(true);
      }
      
      try {
        const pageToUse = page ?? currentPage;
        // console.log('📡 Fetching survey responses for page:', pageToUse);
        // console.log('🔍 Applied filters:', filters);
        // console.log('🔍 Search query:', searchQuery);

        const data = await fetchSurveyResponseList(
          pageToUse,
          filters,
          searchQuery
        );

        // Check if data and data.responses exist before transforming
        if (!data || !data.responses) {
          console.warn("⚠️ API response missing data or responses:", data);
          setResponseData([]);
          return;
        }

        const transformedData = transformSurveyData(data.responses);

        // console.log('Fetched and transformed survey responses:', transformedData);
        // console.log('Summary data from API:', data.summary);

        setResponseData(transformedData);

        // Update pagination with real API data
        if (data.pagination) {
          // console.log('📄 Using API pagination data:', data.pagination);
          setPagination({
            current_page: data.pagination.current_page,
            per_page: data.pagination.per_page,
            total_count: data.pagination.total_count,
            total_pages: data.pagination.total_pages,
          });
        } else {
          // console.log('⚠️ No pagination data in API response, using fallback');
          // Fallback pagination when API doesn't provide pagination info
          setPagination({
            current_page: 1,
            per_page: data.responses.length,
            total_count: data.responses.length,
            total_pages: 1,
          });
        }

        // Update summary stats from the API summary data
        if (data.summary) {
          // console.log('📊 Using API summary data:', data.summary);
          const newStats = {
            total_active_surveys: data.summary.active_surveys,
            total_feedback_count: data.summary.total_responses,
            total_survey_count: data.summary.total_surveys,
            total_responses: data.summary.total_responses,
          };
          console.log("🔄 Setting summary stats:", newStats);
          setSummaryStats(newStats);
        } else {
          // console.log('⚠️ No summary data in API response, calculating from response data');

          // Calculate values from the response data
          const totalSurveys = data.responses ? data.responses.length : 0;
          const activeSurveys = data.responses
            ? data.responses.filter(
                (response) => response.answers && response.answers.length > 0
              ).length
            : 0;

          // Calculate total responses by counting all answers
          let totalResponsesFromData = 0;
          if (data.responses) {
            data.responses.forEach((response) => {
              if (response.answers) {
                totalResponsesFromData += response.answers.length;
              }
            });
          }

          // console.log('📊 Calculated values:', {
          //   totalSurveys,
          //   activeSurveys,
          //   totalResponsesFromData,
          //   responsesData: data.responses
          // });

          const newStats = {
            total_active_surveys: activeSurveys,
            total_feedback_count: totalResponsesFromData,
            total_survey_count: totalSurveys,
            total_responses: totalResponsesFromData,
          };
          // console.log('🔄 Setting calculated summary stats:', newStats);
          setSummaryStats(newStats);
        }
      } catch (error) {
        console.error("Error fetching survey responses:", error);
        toast.error("Failed to fetch survey responses");
        setResponseData([]);
        // Reset pagination on error
        setPagination({
          current_page: 1,
          per_page: 10,
          total_count: 0,
          total_pages: 1,
        });
      } finally {
        setIsLoading(false);
      }
    },
    [currentPage] // Include currentPage back as dependency
  );

  const fetchFilteredSurveyResponses = async (filters: FilterState) => {
    try {
      // Build query parameters
      const url = getFullUrl("/survey_mapping_responses/all_responses.json");
      const urlWithParams = new URL(url);

      // Add access_token parameter first
      if (API_CONFIG.TOKEN) {
        urlWithParams.searchParams.append("access_token", API_CONFIG.TOKEN);
        // console.log('🔑 Adding access_token to filtered request');
      }

      // console.log('🔍 Filtering responses without survey_id restriction');

      if (filters.surveyTitle) {
        urlWithParams.searchParams.append(
          "q[survey_mapping_survey_name_cont]",
          filters.surveyTitle
        );
      }

      if (filters.surveyType) {
        urlWithParams.searchParams.append(
          "q[survey_type_eq]",
          filters.surveyType
        );
      }

      if (filters.startDate) {
        urlWithParams.searchParams.append(
          "q[created_at_gteq]",
          filters.startDate.toISOString()
        );
      }

      if (filters.endDate) {
        urlWithParams.searchParams.append(
          "q[created_at_lteq]",
          filters.endDate.toISOString()
        );
      }

      // console.log('🚀 Calling filtered survey responses API:', urlWithParams.toString());

      const options = getAuthenticatedFetchOptions();
      const response = await fetch(urlWithParams.toString(), options);

      if (!response.ok) {
        throw new Error(
          `Failed to fetch filtered survey responses: ${response.status}`
        );
      }

      const data = await response.json();
      return data || [];
    } catch (error) {
      console.error("Error fetching filtered survey responses:", error);
      throw error;
    }
  };

  const handleViewDetails = (item: TransformedSurveyResponse) => {
    // console.log('Eye button clicked - item data:', JSON.stringify(item, null, 2));
    console.log(
      "🔍 Navigating to survey details with survey_id:",
      item.survey_id
    );
    // console.log('🔍 Using survey_id instead of mapping_id (item.id):', item.id);
    navigate(`/maintenance/survey/response/details/${item.survey_id}`, {
      state: { surveyData: item },
    });
  };

  const handleStatusToggle = (item: TransformedSurveyResponse) => {
    const newActiveStatus = !item.active; // Toggle the active boolean status

    // Update the local state
    setResponseData((prev) =>
      prev.map((response) =>
        response.id === item.id
          ? { ...response, active: newActiveStatus }
          : response
      )
    );

    // Show success message
    toast.success(
      `Survey status ${
        newActiveStatus ? "activated" : "deactivated"
      } successfully`
    );

    // Here you would typically make an API call to update the server
    // Example:
    // await updateSurveyStatus(item.survey_id, newActiveStatus);
  };

  const handleFilterClick = () => {
    setIsFilterModalOpen(true);
  };

  const handleCloseFilterModal = () => {
    setIsFilterModalOpen(false);
  };

  const handleApplyFilters = useCallback((filters: FilterState) => {
    // console.log('Applied filters:', filters);
    setAppliedFilters(filters);
    // Reset to page 1 when filters are applied
    setCurrentPage(1);
    // Don't call fetchSurveyResponses directly - let useEffect handle it
  }, []);

  const handleResetFilters = useCallback(() => {
    const resetFilters = {
      surveyTitle: "",
      surveyMappingId: "",
      surveyType: "",
      startDate: null,
      endDate: null,
    };
    setAppliedFilters(resetFilters);
    // Reset to page 1 when filters are reset
    setCurrentPage(1);
    // Clear search term
    setSearchTerm("");
    setDebouncedSearchTerm("");
    // Don't call fetchSurveyResponses directly - let useEffect handle it
  }, []);

  // Handle search term changes with debouncing
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500); // 500ms delay

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Handle search term changes
  const handleSearchChange = useCallback((newSearchTerm: string) => {
    setSearchTerm(newSearchTerm);
    // Don't reset to page 1 when searching to maintain user context
    // setCurrentPage(1); // Commented out to prevent page reset
  }, []);

  // Column visibility handlers - matching SurveyMappingDashboard implementation
  const handleColumnToggle = (columnKey: string, visible: boolean) => {
    // console.log('Column toggle called:', { columnKey, visible });
    setColumns((prev) => {
      const updated = prev.map((col) =>
        col.key === columnKey ? { ...col, visible } : col
      );
      // console.log('Updated columns:', updated);
      return updated;
    });
  };

  const isColumnVisible = React.useCallback(
    (columnKey: string) => {
      const column = columns.find((col) => col.key === columnKey);
      const visible = column?.visible ?? true;

      // Debug logging for status column
      if (columnKey === "status") {
        // console.log('🔍 isColumnVisible called for status:', {
        //   columnKey,
        //   column,
        //   visible,
        //   allColumns: columns
        // });
      }

      return visible;
    },
    [columns]
  );

  const handleResetColumns = () => {
    setColumns((prev) => prev.map((col) => ({ ...col, visible: true })));
    toast.success("All columns have been restored to default visibility");
  };

  // Enhanced table columns for EnhancedTable component
  const enhancedTableColumns = React.useMemo(() => {
    const allColumns = [
      {
        key: "actions",
        label: "Actions",
        sortable: false,
        draggable: false,
        defaultVisible: true,
        visible: isColumnVisible("actions"),
        hideable: false,
      },
      {
        key: "survey_name",
        label: "Survey Name",
        sortable: true,
        draggable: true,
        defaultVisible: true,
        visible: isColumnVisible("survey_name"),
        hideable: true,
      },
      // { key: 'site_name', label: 'Site Name', sortable: true, draggable: true, defaultVisible: true, visible: isColumnVisible('site_name'), hideable: true },
      {
        key: "building_name",
        label: "Building Name",
        sortable: true,
        draggable: true,
        defaultVisible: true,
        visible: isColumnVisible("building_name"),
        hideable: true,
      },
      {
        key: "wing_name",
        label: "Wing Name",
        sortable: true,
        draggable: true,
        defaultVisible: true,
        visible: isColumnVisible("wing_name"),
        hideable: true,
      },
      {
        key: "floor_name",
        label: "Floor Name",
        sortable: true,
        draggable: true,
        defaultVisible: true,
        visible: isColumnVisible("floor_name"),
        hideable: true,
      },
      {
        key: "area_name",
        label: "Area Name",
        sortable: true,
        draggable: true,
        defaultVisible: true,
        visible: isColumnVisible("area_name"),
        hideable: true,
      },
      {
        key: "room_name",
        label: "Room Name",
        sortable: true,
        draggable: true,
        defaultVisible: true,
        visible: isColumnVisible("room_name"),
        hideable: true,
      },
      {
        key: "total_responses",
        label: "Total Responses",
        sortable: true,
        draggable: true,
        defaultVisible: true,
        visible: isColumnVisible("total_responses"),
        hideable: true,
      },
      {
        key: "total_complaints",
        label: "Total Complaints",
        sortable: true,
        draggable: true,
        defaultVisible: true,
        visible: isColumnVisible("total_complaints"),
        hideable: true,
      },
      // {
      //   key: "latest_response_date",
      //   label: "Latest Response",
      //   sortable: true,
      //   draggable: true,
      //   defaultVisible: true,
      //   visible: isColumnVisible("latest_response_date"),
      //   hideable: true,
      // },
      {
        key: "status",
        label: "Status",
        sortable: true,
        draggable: true,
        defaultVisible: true,
        visible: isColumnVisible("status"),
        hideable: true,
      },
      // { key: 'answer_type', label: 'Answer Type', sortable: true, draggable: true, defaultVisible: true, visible: isColumnVisible('answer_type'), hideable: true },
      // {
      //   key: "responded_by",
      //   label: "Responded By",
      //   sortable: true,
      //   draggable: true,
      //   defaultVisible: true,
      //   visible: isColumnVisible("responded_by"),
      //   hideable: true,
      // },
    ];

    // Debug logging for status column
    const statusColumn = allColumns.find((col) => col.key === "status");
    // console.log('🔍 Status column configuration:', statusColumn);
    // console.log('🔍 Status column visible:', isColumnVisible('status'));
    // console.log('🔍 All visible columns:', allColumns.filter(col => col.visible).map(col => col.key));

    // Filter to only show visible columns
    const visibleColumns = allColumns.filter((col) => col.visible);
    // console.log('🔍 Final enhanced table columns:', visibleColumns.map(col => ({ key: col.key, label: col.label, visible: col.visible })));
    return visibleColumns;
  }, [isColumnVisible]);

  // Transform columns for the dropdown (only hideable columns with simplified structure)
  const dropdownColumns = React.useMemo(
    () => columns.filter((col) => col.key !== "actions"), // Exclude actions column from dropdown
    [columns]
  );

  const renderCell = (item: TransformedSurveyResponse, columnKey: string) => {
    switch (columnKey) {
      case "actions":
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
      case "survey_name":
        return item.survey_name || "N/A";
      case "site_name":
        return item.site_name || "N/A";
      case "building_name":
        return renderLocation(item.building_name);
      case "wing_name":
        return renderLocation(item.wing_name);
      case "floor_name":
        return renderLocation(item.floor_name);
      case "area_name":
        return renderLocation(item.area_name);
      case "room_name":
        return renderLocation(item.room_name);
      case "total_responses":
        return (
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${
              item.total_responses > 0
            }`}
          >
            {item.total_responses}
          </span>
        );
      case "total_complaints":
        return (
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${
              item.total_complaints > 0
            }`}
          >
            {item.total_complaints}
          </span>
        );
      case "latest_response_date":
        return item.latest_response_date || "No Responses";
      case "status":
        // console.log('🔍 Rendering status cell for item:', {
        //   survey_name: item.survey_name,
        //   active: item.active,
        //   active_type: typeof item.active
        // });
        return (
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${
              item.active
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {item.active ? "Active" : "Inactive"}
          </span>
        );
      case "answer_type":
        return (
          <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            {item.answer_type || "N/A"}
          </span>
        );
      case "responded_by":
        return (
          <span className="px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
            {item.responded_by || "Anonymous"}
          </span>
        );
      default: {
        const value = item[columnKey as keyof TransformedSurveyResponse];
        return typeof value === "object"
          ? JSON.stringify(value)
          : String(value || "");
      }
    }
  };

  // Filter responses based on search term
  // Note: Since we're using server-side pagination, we should show exactly what the API returns
  // The search filtering is now handled server-side through the API
  const filteredResponses = responseData;

  // Handle page change
  const handlePageChange = (page: number) => {
    // console.log('📄 Page changed to:', page);
    setCurrentPage(page);
    // Note: fetchSurveyResponses will be called automatically when currentPage changes due to the useCallback dependency
  };

  // Get dynamic counts from summary stats
  const getTotalActiveCount = () => {
    const count = summaryStats.total_active_surveys;
    // console.log('🎯 Active Surveys count from state:', count);
    return count;
  };

  const getFeedbackCount = () => {
    const count = summaryStats.total_feedback_count;
    // console.log('📝 Feedback count from state:', count);
    return count;
  };

  const getSurveyCount = () => {
    const count = summaryStats.total_survey_count;
    // console.log('📊 Total Surveys count from state:', count);
    return count;
  };

  const getTotalResponsesCount = () => {
    const count = summaryStats.total_responses;
    // console.log('👍 Total Responses count from state:', count);
    return count;
  };

  // Helper: show only first location; show full value on hover with ellipsis
  const renderLocation = (value?: string) => {
    const safe = (value || "").trim();
    if (!safe) return "N/A";
    // Split by comma or pipe or slash common delimiters
    const parts = safe.split(/\s*,\s*|\s*\|\s*|\s*\/\s*/).filter(Boolean);
    const first = parts[0] || safe;
    const hasMore = parts.length > 1;
    return (
      <span title={safe} className="truncate inline-block max-w-[220px] align-middle">
        {first}
        {hasMore ? " ..." : ""}
      </span>
    );
  };

  // Fetch survey responses when component mounts, page changes, or filters change
  useEffect(() => {
    // Determine if this is a search operation by checking if only search term changed


    
    // console.log('� Data fetch triggered - page:', currentPage, 'filters:', appliedFilters, 'search:', debouncedSearchTerm, 'isSearchOperation:', isSearchOperation);
    fetchSurveyResponses(appliedFilters, debouncedSearchTerm, currentPage);
  }, [currentPage, appliedFilters, debouncedSearchTerm, fetchSurveyResponses]); // Include all dependencies

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
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-4 mb-6">
            {/* Active Surveys */}
            <div className="p-3 sm:p-4 rounded-lg shadow-sm h-[100px] sm:h-[132px] flex items-center gap-2 sm:gap-4 bg-[#f6f4ee] cursor-pointer hover:bg-[#edeae3]">
              <div className="w-8 h-8 sm:w-12 sm:h-12 flex items-center justify-center flex-shrink-0 bg-[#C4B89D54]">
                <Activity
                  className="w-4 h-4 sm:w-6 sm:h-6"
                  style={{ color: "#C72030" }}
                />
              </div>
              <div className="flex flex-col min-w-0 justify-start">
                <div className="text-lg sm:text-2xl font-bold leading-tight truncate">
                  {getTotalActiveCount()}
                  {isLoading && (
                    <span className="ml-1 text-xs animate-pulse">...</span>
                  )}
                </div>
                <span className="text-xs sm:text-sm text-muted-foreground font-medium leading-tight">
                  Active Surveys
                </span>
              </div>
            </div>

            {/* Total Surveys */}
            <div className="p-3 sm:p-4 rounded-lg shadow-sm h-[100px] sm:h-[132px] flex items-center gap-2 sm:gap-4 bg-[#f6f4ee] cursor-pointer hover:bg-[#edeae3]">
              <div className="w-8 h-8 sm:w-12 sm:h-12 flex items-center justify-center flex-shrink-0 bg-[#C4B89D54]">
                <ClipboardList
                  className="w-4 h-4 sm:w-6 sm:h-6"
                  style={{ color: "#C72030" }}
                />
              </div>
              <div className="flex flex-col min-w-0 justify-start">
                <div className="text-lg sm:text-2xl font-bold leading-tight truncate">
                  {getSurveyCount()}
                  {isLoading && (
                    <span className="ml-1 text-xs animate-pulse">...</span>
                  )}
                </div>
                <span className="text-xs sm:text-sm text-muted-foreground font-medium leading-tight">
                  Total Surveys
                </span>
              </div>
            </div>

            {/* Total Responses */}
            <div className="p-3 sm:p-4 rounded-lg shadow-sm h-[100px] sm:h-[132px] flex items-center gap-2 sm:gap-4 bg-[#f6f4ee] cursor-pointer hover:bg-[#edeae3]">
              <div className="w-8 h-8 sm:w-12 sm:h-12 flex items-center justify-center flex-shrink-0 bg-[#C4B89D54]">
                <ThumbsUp
                  className="w-4 h-4 sm:w-6 sm:h-6"
                  style={{ color: "#C72030" }}
                />
              </div>
              <div className="flex flex-col min-w-0 justify-start">
                <div className="text-lg sm:text-2xl font-bold leading-tight truncate">
                  {getTotalResponsesCount()}
                  {isLoading && (
                    <span className="ml-1 text-xs animate-pulse">...</span>
                  )}
                </div>
                <span className="text-xs sm:text-sm text-muted-foreground font-medium leading-tight">
                  Total Responses
                </span>
              </div>
            </div>
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
                  columns={enhancedTableColumns}
                  renderCell={renderCell}
                  storageKey="survey-response-table"
                  enableExport={true}
                  exportFileName="survey-response-data"
                  handleExport={handleSurveyResponseExport}
                  searchTerm={searchTerm}
                  onSearchChange={handleSearchChange}
                  searchPlaceholder="Search responses..."
                  pagination={false} // Disable client-side pagination since we're doing server-side
                  pageSize={pagination.per_page}
                  hideColumnsButton={true}
                  leftActions={
                    <div className="flex flex-wrap gap-2">
                      {/* Filter button is now positioned next to search input in EnhancedTable */}
                    </div>
                  }
                  rightActions={
                    <div className="flex items-center gap-2">
                      <ColumnVisibilityDropdown
                        columns={dropdownColumns}
                        onColumnToggle={handleColumnToggle}
                      />
                    </div>
                  }
                  onFilterClick={handleFilterClick}
                />

                {/* Debug info for status column */}
                {/* {process.env.NODE_ENV === 'development' && (
                  <div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded text-xs">
                    <div><strong>Debug Info:</strong></div>
                    <div>Status column visible: {isColumnVisible('status') ? 'Yes' : 'No'}</div>
                    <div>Enhanced table columns: {enhancedTableColumns.map(col => col.key).join(', ')}</div>
                    <div>Sample data active status: {filteredResponses[0]?.active ?? 'No data'}</div>
                  </div>
                )} */}

                {/* Server-side Pagination Controls */}
                {pagination.total_pages > 1 && (
                  <div className="mt-6">
                    <Pagination>
                      <PaginationContent>
                        <PaginationItem>
                          <PaginationPrevious
                            onClick={() => {
                              if (currentPage > 1)
                                handlePageChange(currentPage - 1);
                            }}
                            className={
                              currentPage === 1
                                ? "pointer-events-none opacity-50"
                                : ""
                            }
                          />
                        </PaginationItem>
                        {Array.from(
                          { length: Math.min(pagination.total_pages, 10) },
                          (_, i) => i + 1
                        ).map((page) => (
                          <PaginationItem key={page}>
                            <PaginationLink
                              onClick={() => handlePageChange(page)}
                              isActive={currentPage === page}
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
                              if (currentPage < pagination.total_pages)
                                handlePageChange(currentPage + 1);
                            }}
                            className={
                              currentPage === pagination.total_pages
                                ? "pointer-events-none opacity-50"
                                : ""
                            }
                          />
                        </PaginationItem>
                      </PaginationContent>
                    </Pagination>
                    <div className="text-center mt-2 text-sm text-gray-600">
                      Showing page {currentPage} of {pagination.total_pages} (
                      {pagination.total_count} total survey responses)
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
