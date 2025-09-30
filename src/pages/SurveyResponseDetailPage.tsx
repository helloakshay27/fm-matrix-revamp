import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
} from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import {
  ArrowLeft,
  Copy,
  X,
  Calendar as CalendarIcon,
  List,
  BarChart3,
  Activity,
  Table,
  Ticket,
  Filter,
  Download,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { surveyApi, SurveyResponseData } from "@/services/surveyApi";
import { SurveyAnalyticsCard } from "@/components/SurveyAnalyticsCard";
import { API_CONFIG, getFullUrl, getAuthHeader } from "@/config/apiConfig";
import { toast } from "sonner";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EnhancedTaskTable } from "@/components/enhanced-table/EnhancedTaskTable";

// New interfaces for response list API
interface ResponseAnswer {
  answer_id: number;
  quest_map_id: number;
  question_id: number;
  question_name: string;
  answer_type: string;
  ans_descr?: string;
  option_id?: number;
  option_name?: string;
  responded_by: string;
  complaints: ResponseComplaint[];
  comments?: string; // Add comments field for question-specific comments
}

interface FinalComment {
  comment_id: number;
  body: string;
  created_at: string;
}

interface ResponseLocation {
  site_name: string;
  building_name: string;
  wing_name: string;
  floor_name: string;
  area_name: string;
  room_name: string;
  status: boolean;
}

interface ResponseComplaint {
  complaint_id: number;
  ticket_number: string;
  heading: string;
  icon_category?: string;
  assigned_to: number;
  category: string;
  assignee: string;
  relation_id: number;
  created_at: string;
  status?: string;
  updated_by?: string;
}

interface SurveyResponse {
  response_id: number;
  responded_time: string;
  mapping_id: number;
  survey_id: number;
  survey_name: string;
  survey_status: number;
  answers_count: number;
  questions_count: number;
  complaints_count: number;
  location: ResponseLocation;
  answers: ResponseAnswer[];
  final_comments: FinalComment[];
}

interface ResponseListData {
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

// TypeScript interfaces for the new survey details API response
interface SurveyOption {
  option_id: number;
  option: string;
  response_count: number;
  type?: string; // Add optional type field for rating/emoji
  rating?: number; // Add optional rating field
}

interface SurveyQuestion {
  question_id: number;
  question: string;
  options: SurveyOption[];
  question_type?: string; // Add optional question type field
}

interface SurveyDetail {
  survey_id: number;
  survey_name: string;
  questions: SurveyQuestion[];
}

interface SurveyDetailsResponse {
  survey_details: {
    surveys: SurveyDetail[]; // Updated to match actual API response
  };
}

// Chart data interfaces
interface ChartDataItem {
  name: string;
  value: number;
  color?: string;
}

interface ProcessedQuestion {
  question: string;
  type: string;
  totalResponses: number;
  responseRate: string;
  responses: string[];
}

// Enhanced Table interfaces for tabular data
interface TabularResponseData {
  id: string;
  response_id: string;
  date_time: string;
  building: string;
  wing: string;
  area: string;
  floor: string;
  room: string;
  question_type: string;
  question_name: string;
  answer: string;
  final_comment: string;
  ticket_id: string;
  // Legacy fields for backward compatibility
  icon_category: string;
  rating: string;
  category: string;
  [key: string]: string | number | undefined; // For dynamic question columns
}

interface TicketData {
  id: string;
  complaint_id: number;
  ticket_number: string;
  heading: string;
  category: string;
  assignee: string;
  status: string;
  updated_by: string;
  created_by: string;
  created_at: string;
  location: string;
}

// Filter interface for survey responses
interface SurveyResponseFilters {
  dateRange?: {
    from?: Date;
    to?: Date;
  };
  building?: string;
  wing?: string;
  area?: string;
  floor?: string;
  room?: string;
  iconCategory?: string;
  rating?: string;
  category?: string;
  hasTickets?: boolean;
  assignee?: string;
}

export const SurveyResponseDetailPage = () => {
  const { surveyId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("summary");
  const [surveyData, setSurveyData] = useState<SurveyDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [surveyDetailsData, setSurveyDetailsData] =
    useState<SurveyDetailsResponse | null>(null);
  const [responseListData, setResponseListData] =
    useState<ResponseListData | null>(null);
  
  // Store original unfiltered data for summary tab reset functionality
  const [originalSurveyData, setOriginalSurveyData] = useState<SurveyDetail | null>(null);
  const [originalSurveyDetailsData, setOriginalSurveyDetailsData] = 
    useState<SurveyDetailsResponse | null>(null);

  // Filter states - separate for each tab
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [activeFilterTab, setActiveFilterTab] = useState<"summary" | "tabular">(
    "summary"
  );

  // Summary tab filters
  const [summaryCurrentFilters, setSummaryCurrentFilters] =
    useState<SurveyResponseFilters>({});
  const [summaryFormFilters, setSummaryFormFilters] =
    useState<SurveyResponseFilters>({});

  // Tabular tab filters
  const [tabularCurrentFilters, setTabularCurrentFilters] =
    useState<SurveyResponseFilters>({});
  const [tabularFormFilters, setTabularFormFilters] =
    useState<SurveyResponseFilters>({});

  const [filteredTabularData, setFilteredTabularData] = useState<
    TabularResponseData[]
  >([]);
  const [filteredTicketData, setFilteredTicketData] = useState<TicketData[]>(
    []
  );

  // Export modal states
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportFromDate, setExportFromDate] = useState("");
  const [exportToDate, setExportToDate] = useState("");

  // Helper component for truncated text with tooltip
  const TruncatedText = ({
    text,
    maxLength = 20,
    className = "",
  }: {
    text: string;
    maxLength?: number;
    className?: string;
  }) => {
    const shouldTruncate = text && text.length > maxLength;
    const displayText = shouldTruncate
      ? `${text.substring(0, maxLength)}...`
      : text;

    if (shouldTruncate) {
      return (
        <span className={className} title={text}>
          {displayText}
        </span>
      );
    }
    return <span className={className}>{text}</span>;
  };

  // Fetch response list data from new API
  const fetchResponseListData = useCallback(async () => {
    try {
      const baseUrl = getFullUrl(`/survey_mappings/response_list.json`);
      const url = new URL(baseUrl);

      // Add the required query parameter with dynamic survey ID
      if (surveyId) {
        url.searchParams.append("survey_id", surveyId);
      }

      // Add token parameter instead of Authorization header
      url.searchParams.append(
        "token",
        "fkLRVExOU3z0SUElnlKtEkNd7fJ4jOUL8hKd190ONrU"
      );

      console.log("🚀 Fetching response list from:", url.toString());

      const response = await fetch(url.toString(), {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("✅ Response list data received:", data);
      console.log("✅ Number of responses:", data?.responses?.length || 0);
      setResponseListData(data);
    } catch (error) {
      console.error("Error fetching response list data:", error);
      toast.error("Failed to fetch response list data");
    }
  }, [surveyId]);

  // API function to fetch survey details using the new endpoint
  const fetchSurveyDetails = useCallback(
    async (surveyId: string, fromDate?: Date, toDate?: Date) => {
      try {
        // Validate survey ID
        if (!surveyId || surveyId.trim() === "") {
          throw new Error("Invalid survey ID provided");
        }

        // Build the URL with proper parameters
        const baseUrl = getFullUrl(
          "/pms/admin/snag_checklists/survey_details.json"
        );
        const urlWithParams = new URL(baseUrl);

        // Add survey_id parameter
        urlWithParams.searchParams.append("survey_id", surveyId.trim());

        // Add date filters if provided
        if (fromDate) {
          const fromDateStr = fromDate.toISOString().split("T")[0]; // Format: YYYY-MM-DD
          urlWithParams.searchParams.append("from_date", fromDateStr);
        }

        if (toDate) {
          const toDateStr = toDate.toISOString().split("T")[0]; // Format: YYYY-MM-DD
          urlWithParams.searchParams.append("to_date", toDateStr);
        }

        // Add access_token from API_CONFIG if available
        if (API_CONFIG.TOKEN) {
          urlWithParams.searchParams.append("access_token", API_CONFIG.TOKEN);
        }

        // console.log("🚀 Fetching survey details from:", urlWithParams.toString());
        // console.log("🔍 Survey ID being requested:", surveyId);

        const response = await fetch(urlWithParams.toString(), {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error("Survey Details API Error Response:", errorText);

          if (response.status === 404) {
            throw new Error(`Survey with ID ${surveyId} not found`);
          } else if (response.status === 401) {
            throw new Error("Authentication failed. Please login again.");
          } else if (response.status === 403) {
            throw new Error(
              "You do not have permission to access this survey."
            );
          } else {
            throw new Error(
              `Failed to fetch survey details: ${response.status} ${response.statusText}`
            );
          }
        }

        const data = await response.json();
        // console.log("✅ Survey details response received:", data);
        // console.log(
        //   "🔍 Survey array length:",
        //   data?.survey_details?.surveys?.length || 0
        // );

        return data;
      } catch (error) {
        console.error("❌ Error fetching survey details:", error);
        throw error;
      }
    },
    []
  ); // Empty dependency array since it only uses external utilities

  useEffect(() => {
    const fetchSurveyData = async () => {
      if (!surveyId) {
        console.error("No survey ID provided");
        navigate("/maintenance/survey/response");
        return;
      }

      setIsLoading(true);
      let surveyDetailsResponse = null;

      try {
        // console.log("Fetching survey details for survey ID:", surveyId);

        // Fetch survey details using the new API endpoint
        surveyDetailsResponse = await fetchSurveyDetails(surveyId);
        // console.log("Fetched survey details:", surveyDetailsResponse);
        setSurveyDetailsData(surveyDetailsResponse);
        // Store original data for reset functionality
        setOriginalSurveyDetailsData(surveyDetailsResponse);

        // Extract survey data from the new API response
        if (surveyDetailsResponse?.survey_details?.surveys?.length > 0) {
          const surveyDetail = surveyDetailsResponse.survey_details.surveys[0];

          // Set the survey data directly from the API response
          setSurveyData(surveyDetail);
          // Store original data for reset functionality
          setOriginalSurveyData(surveyDetail);
          // console.log("Survey data set:", surveyDetail);
        } else {
          console.error("No survey data found for survey ID:", surveyId);
          console.error("API Response:", surveyDetailsResponse);
          console.error(
            "Available surveys in response:",
            surveyDetailsResponse?.survey_details?.surveys
          );

          // Check if the response structure is valid but empty
          if (
            surveyDetailsResponse?.survey_details?.surveys &&
            Array.isArray(surveyDetailsResponse.survey_details.surveys)
          ) {
            const surveyCount =
              surveyDetailsResponse.survey_details.surveys.length;
            toast.error(
              `No survey found with ID: ${surveyId}. Found ${surveyCount} surveys in response.`
            );
          } else {
            toast.error("Invalid response format from survey details API");
          }

          // Navigate back to the survey response list
          navigate("/maintenance/survey/response");
          return;
        }
      } catch (error) {
        console.error("Error fetching survey data:", error);

        // Provide more specific error messages
        if (error instanceof Error) {
          if (error.message.includes("Failed to fetch survey details")) {
            toast.error(
              "Unable to connect to survey service. Please try again later."
            );
          } else {
            toast.error(error.message);
          }
        } else {
          toast.error(
            "An unexpected error occurred while fetching survey details"
          );
        }

        // Only navigate away if there's a real error, not just empty data
        if (!surveyDetailsResponse) {
          navigate("/maintenance/survey/response");
        }
      } finally {
        setIsLoading(false);
      }
    };

    // Fetch both survey details and response list data
    const fetchAllData = async () => {
      await Promise.all([fetchSurveyData(), fetchResponseListData()]);
    };

    fetchAllData();
  }, [surveyId, navigate, fetchResponseListData, fetchSurveyDetails]);

  const handleCopyQuestion = async (questionId: number) => {
    const question = surveyData?.questions.find(
      (q: SurveyQuestion) => q.question_id === questionId
    );
    if (question) {
      const responses =
        question.options
          ?.filter((option) => option.response_count > 0)
          .map(
            (option) => `${option.option} (${option.response_count} responses)`
          ) || [];
      const textToCopy = `${question.question}\n${responses.join("\n")}`;
      try {
        await navigator.clipboard.writeText(textToCopy);
        // console.log("Question responses copied to clipboard");
      } catch (err) {
        console.error("Failed to copy to clipboard:", err);
      }
    }
  };

  const handleDownloadQuestion = (questionId: number) => {
    const question = surveyData?.questions.find(
      (q: SurveyQuestion) => q.question_id === questionId
    );
    if (question) {
      const responses =
        question.options
          ?.filter((option) => option.response_count > 0)
          .map(
            (option) => `${option.option} (${option.response_count} responses)`
          ) || [];
      const content = `${question.question}\n${responses.join("\n")}`;
      const blob = new Blob([content], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `question_${questionId}_responses.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  // Helper function to filter responses by date range for summary analytics
  const getSummaryFilteredResponseData = useCallback(() => {
    if (!responseListData?.responses) return [];

    // If no date filters are applied, return all responses
    if (
      !summaryCurrentFilters.dateRange?.from &&
      !summaryCurrentFilters.dateRange?.to
    ) {
      return responseListData.responses;
    }

    return responseListData.responses.filter((response: SurveyResponse) => {
      // Check if this response falls within the date range using response timestamp
      if (
        summaryCurrentFilters.dateRange?.from ||
        summaryCurrentFilters.dateRange?.to
      ) {
        const responseDate = new Date(response.responded_time);

        if (summaryCurrentFilters.dateRange?.from) {
          const fromDate = new Date(summaryCurrentFilters.dateRange.from);
          fromDate.setHours(0, 0, 0, 0);
          if (responseDate < fromDate) return false;
        }

        if (summaryCurrentFilters.dateRange?.to) {
          const toDate = new Date(summaryCurrentFilters.dateRange.to);
          toDate.setHours(23, 59, 59, 999);
          if (responseDate > toDate) return false;
        }
      }

      return true;
    });
  }, [responseListData, summaryCurrentFilters.dateRange]);

  // Helper function to filter responses by date range for tabular data
  const getTabularFilteredResponseData = useCallback(() => {
    if (!responseListData?.responses) return [];

    // If no date filters are applied, return all responses
    if (
      !tabularCurrentFilters.dateRange?.from &&
      !tabularCurrentFilters.dateRange?.to
    ) {
      return responseListData.responses;
    }

    return responseListData.responses.filter((response: SurveyResponse) => {
      // Check if this response falls within the date range using response timestamp
      if (
        tabularCurrentFilters.dateRange?.from ||
        tabularCurrentFilters.dateRange?.to
      ) {
        const responseDate = new Date(response.responded_time);

        if (tabularCurrentFilters.dateRange?.from) {
          const fromDate = new Date(tabularCurrentFilters.dateRange.from);
          fromDate.setHours(0, 0, 0, 0);
          if (responseDate < fromDate) return false;
        }

        if (tabularCurrentFilters.dateRange?.to) {
          const toDate = new Date(tabularCurrentFilters.dateRange.to);
          toDate.setHours(23, 59, 59, 999);
          if (responseDate > toDate) return false;
        }
      }

      return true;
    });
  }, [responseListData, tabularCurrentFilters.dateRange]);

  // Prepare pie chart data for response distribution across all questions
  const getResponseDistributionData = () => {
    // console.log("🔍 Getting response distribution data for all questions");
    // console.log("🔍 Survey details data:", surveyDetailsData);
    // console.log("🔍 Survey data:", surveyData);

    // Get filtered response data based on summary filters
    const filteredResponses = getSummaryFilteredResponseData();
    // console.log("🔍 Filtered responses count:", filteredResponses.length);

    // Use the survey details data which has the most accurate and complete information
    if (surveyDetailsData?.survey_details?.surveys?.[0]?.questions) {
      const questions = surveyDetailsData.survey_details.surveys[0].questions;
      // console.log("🔍 Found questions in survey details:", questions.length);

      const responseDistribution = questions.map(
        (question: SurveyQuestion, index: number) => {
          // Calculate total responses for this question from filtered data
          let totalResponses = 0;

          if (
            filteredResponses.length > 0 &&
            (summaryCurrentFilters.dateRange?.from ||
              summaryCurrentFilters.dateRange?.to)
          ) {
            // Count responses from filtered data
            filteredResponses.forEach((response: SurveyResponse) => {
              response.answers?.forEach((answer: ResponseAnswer) => {
                if (answer.question_id === question.question_id) {
                  totalResponses += 1;
                }
              });
            });
          } else {
            // Fallback to original data if no filters applied
            totalResponses =
              question.options && question.options.length > 0
                ? question.options.reduce(
                    (sum, opt) => sum + (opt.response_count || 0),
                    0
                  )
                : 0;
          }

          // Use the full question name without truncation
          const questionName = question.question;

          // console.log(
          //   `🔍 Question ${index + 1}: "${
          //     question.question
          //   }" - ${totalResponses} total responses (filtered)`
          // );

          return {
            name: questionName,
            value: totalResponses,
            color: [
              "#C72030",
              "#c6b692",
              "#d8dcdd",
              "#8B5CF6",
              "#10B981",
              "#F59E0B",
              "#EF4444",
              "#3B82F6",
            ][index % 8],
          };
        }
      );

      // Filter out questions with zero responses for cleaner visualization
      const filteredDistribution = responseDistribution.filter(
        (item) => item.value > 0
      );

      // console.log(
      //   "🔍 All questions with response counts:",
      //   responseDistribution
      // );
      // console.log(
      //   "🔍 Filtered questions (only with responses):",
      //   filteredDistribution
      // );
      // console.log(
      //   "🔍 Number of questions with responses:",
      //   filteredDistribution.length
      // );

      // If no questions have responses, show a placeholder
      if (filteredDistribution.length === 0) {
        // console.log("⚠️ No questions have responses, showing placeholder");
        return [
          {
            name: "No responses yet",
            value: 1,
            color: "#E5E5E5",
          },
        ];
      }

      // console.log(
      //   "✅ Returning filtered distribution with",
      //   filteredDistribution.length,
      //   "questions"
      // );
      return filteredDistribution;
    }

    // Fallback to original survey data if survey details not available
    if (surveyData?.questions && surveyData.questions.length > 0) {
      const responseDistribution = surveyData.questions.map(
        (question: SurveyQuestion, index: number) => {
          const totalResponses =
            question.options && question.options.length > 0
              ? question.options.reduce(
                  (sum, opt) => sum + (opt.response_count || 0),
                  0
                )
              : 0;

          const questionName = question.question;

          return {
            name: questionName,
            value: totalResponses,
            color: [
              "#C72030",
              "#c6b692",
              "#d8dcdd",
              "#8B5CF6",
              "#10B981",
              "#F59E0B",
              "#EF4444",
              "#3B82F6",
            ][index % 8],
          };
        }
      );

      const filteredDistribution = responseDistribution.filter(
        (item) => item.value > 0
      );

      // console.log(
      //   "🔍 Fallback - All questions with response counts:",
      //   responseDistribution
      // );
      // console.log(
      //   "🔍 Fallback - Filtered questions (only with responses):",
      //   filteredDistribution
      // );

      if (filteredDistribution.length === 0) {
        return [
          {
            name: "No responses yet",
            value: 1,
            color: "#E5E5E5",
          },
        ];
      }

      return filteredDistribution;
    }

    // Ultimate fallback
    const fallbackData = [
      {
        name: "No data available",
        value: 1,
        color: "#C72030",
      },
    ];

    // console.log("🔍 Using ultimate fallback:", fallbackData);
    return fallbackData;
  };

  // Helper function to get standardized emoji options
  const getStandardizedEmojiOptions = (actualOptions: SurveyOption[]) => {
    const standardOptions = [
      { name: "Amazing", value: 0, color: "#C72030" },
      { name: "Good", value: 0, color: "#C72030" },
      { name: "Okay", value: 0, color: "#C72030" },
      { name: "Bad", value: 0, color: "#C72030" },
      { name: "Terrible", value: 0, color: "#C72030" },
    ];

    // Map actual responses to standard options
    actualOptions.forEach((option) => {
      const optionText = option.option?.toLowerCase() || "";
      const responseCount = Math.floor(option.response_count || 0); // Ensure integer values

      if (optionText.includes("amazing") || optionText.includes("excellent")) {
        standardOptions[0].value += responseCount;
      } else if (
        optionText.includes("good") ||
        optionText.includes("satisfied")
      ) {
        standardOptions[1].value += responseCount;
      } else if (
        optionText.includes("okay") ||
        optionText.includes("neutral") ||
        optionText.includes("average")
      ) {
        standardOptions[2].value += responseCount;
      } else if (
        optionText.includes("bad") ||
        optionText.includes("dissatisfied")
      ) {
        standardOptions[3].value += responseCount;
      } else if (
        optionText.includes("terrible") ||
        optionText.includes("awful") ||
        optionText.includes("poor")
      ) {
        standardOptions[4].value += responseCount;
      }
    });

    return standardOptions;
  };

  // Helper function to get standardized rating options
  const getStandardizedRatingOptions = (actualOptions: SurveyOption[]) => {
    const standardOptions = [
      { name: "5 stars", value: 0, color: "#C72030" },
      { name: "4 stars", value: 0, color: "#C72030" },
      { name: "3 stars", value: 0, color: "#C72030" },
      { name: "2 stars", value: 0, color: "#C72030" },
      { name: "1 stars", value: 0, color: "#C72030" },
    ];

    // Map actual responses to standard options
    actualOptions.forEach((option) => {
      const optionText = option.option?.toLowerCase() || "";
      const responseCount = Math.floor(option.response_count || 0); // Ensure integer values

      if (optionText.includes("5 star") || option.rating === 5) {
        standardOptions[0].value += responseCount;
      } else if (optionText.includes("4 star") || option.rating === 4) {
        standardOptions[1].value += responseCount;
      } else if (optionText.includes("3 star") || option.rating === 3) {
        standardOptions[2].value += responseCount;
      } else if (optionText.includes("2 star") || option.rating === 2) {
        standardOptions[3].value += responseCount;
      } else if (optionText.includes("1 star") || option.rating === 1) {
        standardOptions[4].value += responseCount;
      }
    });

    return standardOptions;
  };

  // Helper function to determine question type from options
  const getQuestionType = (
    options: SurveyOption[]
  ): "rating" | "emoji" | "regular" => {
    // Check if any option has a type property
    const hasRatingType = options.some((option) => option.type === "rating");
    const hasEmojiType = options.some((option) => option.type === "emoji");

    if (hasRatingType) return "rating";
    if (hasEmojiType) return "emoji";

    // Fallback detection based on option text
    const hasStarsText = options.some((option) =>
      option.option?.toLowerCase().includes("star")
    );
    const hasEmojiText = options.some((option) => {
      const text = option.option?.toLowerCase() || "";
      return (
        text.includes("amazing") ||
        text.includes("good") ||
        text.includes("okay") ||
        text.includes("bad") ||
        text.includes("terrible")
      );
    });

    if (hasStarsText) return "rating";
    if (hasEmojiText) return "emoji";

    // If no type field exists and no special text patterns, treat as regular multiple choice
    // This includes questions like "How was the security Management" with options like "Perfect", "Good", "Poor"
    // and "Fire safety equipments placed?" with options like "Yes", "No"
    console.log(`🔍 Question determined as regular multiple choice. Options: ${options.map(o => o.option).join(', ')}`);
    return "regular";
  };

  // Prepare pie chart data for individual question showing option distribution
  const getQuestionOptionsData = (questionId: number) => {
    // console.log(
    //   "🔍 Getting question options data for question ID:",
    //   questionId
    // // );
    // console.log("🔍 Survey details data:", surveyDetailsData);
    // console.log("🔍 Survey data questions:", surveyData?.questions);

    // Get filtered response data for summary
    const filteredResponses = getSummaryFilteredResponseData();
    // console.log("🔍 Using filtered responses:", filteredResponses.length);

    // Check if this is a rating/emoji question to determine color scheme
    const isRatingQuestion = shouldUseBarChart(questionId);

    // Get question from survey details API response
    if (surveyDetailsData?.survey_details?.surveys?.[0]) {
      const surveyDetail = surveyDetailsData.survey_details.surveys[0];
      const question = surveyDetail.questions?.find(
        (q) => q.question_id === questionId
      );

      // console.log("🔍 Found question from survey details:", question);

      // Handle questions with options (could be empty array)
      if (question?.options && Array.isArray(question.options)) {
        // If options array is empty, show "No options configured"
        if (question.options.length === 0) {
          return [
            {
              name: "No options configured",
              value: 1,
              color: "#E5E5E5",
            },
          ];
        }

        // If we have filtered data, calculate response counts from filtered responses
        if (
          filteredResponses.length > 0 &&
          (summaryCurrentFilters.dateRange?.from ||
            summaryCurrentFilters.dateRange?.to)
        ) {
          const optionCounts = new Map<number, number>();

          // Initialize all options with 0 counts
          question.options.forEach((option: SurveyOption) => {
            optionCounts.set(option.option_id, 0);
          });

          // Count responses from filtered data
          filteredResponses.forEach((response: SurveyResponse) => {
            response.answers?.forEach((answer: ResponseAnswer) => {
              if (answer.question_id === questionId && answer.option_id) {
                const currentCount = optionCounts.get(answer.option_id) || 0;
                optionCounts.set(answer.option_id, currentCount + 1);
              }
            });
          });

          // Create filtered options data
          const filteredOptionsData = question.options.map(
            (option: SurveyOption, index: number) => {
              const responseCount = optionCounts.get(option.option_id) || 0;

              let color: string;
              if (responseCount > 0) {
                color = [
                  "#C72030",
                  "#c6b692",
                  "#d8dcdd",
                  "#8B5CF6",
                  "#10B981",
                  "#F59E0B",
                  "#EF4444",
                  "#3B82F6",
                ][index % 8];
              } else {
                color = "#E5E5E5";
              }

              return {
                name: option.option || `Option ${index + 1}`,
                value: responseCount,
                color: color,
              };
            }
          );

          // Determine question type and return standardized data if needed
          const questionType = getQuestionType(question.options);

          if (questionType === "rating") {
            // console.log(`🎯 Using standardized rating options for filtered question ${questionId}`);
            return getStandardizedRatingOptions(
              filteredOptionsData.map((item) => ({
                option_id: 0,
                option: item.name,
                response_count: item.value,
                type: "rating",
              }))
            );
          } else if (questionType === "emoji") {
            // console.log(`🎯 Using standardized emoji options for filtered question ${questionId}`);
            return getStandardizedEmojiOptions(
              filteredOptionsData.map((item) => ({
                option_id: 0,
                option: item.name,
                response_count: item.value,
                type: "emoji",
              }))
            );
          }

          return filteredOptionsData;
        }

        // Use original data if no filters applied
        // Only use standardized data for questions that actually use bar charts
        const useBarChart = shouldUseBarChart(questionId);
        
        if (useBarChart) {
          const questionType = getQuestionType(question.options);
          
          if (questionType === "rating") {
            console.log(
              `🎯 Using standardized rating options for question ${questionId}`
            );
            return getStandardizedRatingOptions(question.options);
          } else if (questionType === "emoji") {
            console.log(
              `🎯 Using standardized emoji options for question ${questionId}`
            );
            return getStandardizedEmojiOptions(question.options);
          }
        }

        // For regular questions, use the original logic
        const optionsData = question.options.map(
          (option: SurveyOption, index: number) => {
            let color: string;
            if (option.response_count > 0) {
              // Use varied colors for regular questions
              color = [
                "#C72030",
                "#c6b692",
                "#d8dcdd",
                "#8B5CF6",
                "#10B981",
                "#F59E0B",
                "#EF4444",
                "#3B82F6",
              ][index % 8];
            } else {
              color = "#E5E5E5";
            }

            return {
              name: option.option || `Option ${index + 1}`,
              value: Math.floor(option.response_count || 0), // Ensure integer values
              color: color,
            };
          }
        );

        // console.log("🔍 Options data from survey details:", optionsData);
        // console.log(`🔍 Question ${questionId} type: ${questionType}`);

        // For regular multiple choice questions, show all options in pie chart
        // This ensures pie chart displays all available options, even those with 0 responses
        return optionsData;
      }
    }

    // Fallback: Show no data message
    // console.log("🔍 No data found, returning empty array");
    return [
      {
        name: "No responses yet",
        value: 1,
        color: "#E5E5E5",
      },
    ];
  };

  // Helper function to get axis labels based on question type
  const getAxisLabels = (questionId: number) => {
    // First check the actual response data for answer_type
    const filteredResponses = getSummaryFilteredResponseData();
    const responseAnswer = filteredResponses
      .flatMap(response => response.answers || [])
      .find(answer => answer.question_id === questionId);
    
    if (responseAnswer?.answer_type) {
      if (responseAnswer.answer_type === "emoji") {
        return {
          xAxisLabel: "Response Type",
          yAxisLabel: "Number of Responses"
        };
      } else if (responseAnswer.answer_type === "rating") {
        return {
          xAxisLabel: "Star Rating", 
          yAxisLabel: "Number of Responses"
        };
      }
    }

    // Fallback to survey details data
    if (surveyDetailsData?.survey_details?.surveys?.[0]) {
      const surveyDetail = surveyDetailsData.survey_details.surveys[0];
      const question = surveyDetail.questions?.find(
        (q) => q.question_id === questionId
      );

      if (question?.options) {
        const questionType = getQuestionType(question.options);
        if (questionType === "emoji") {
          return {
            xAxisLabel: "Response Type",
            yAxisLabel: "Number of Responses"
          };
        } else if (questionType === "rating") {
          return {
            xAxisLabel: "Star Rating",
            yAxisLabel: "Number of Responses"
          };
        }
      }
    }
    
    // Default labels for non-bar chart questions
    return {
      xAxisLabel: undefined,
      yAxisLabel: undefined
    };
  };

  // Helper function to determine if question should use bar chart or pie chart
  const shouldUseBarChart = (questionId: number): boolean => {
    // First check the actual response data for answer_type
    const filteredResponses = getSummaryFilteredResponseData();
    const responseAnswer = filteredResponses
      .flatMap(response => response.answers || [])
      .find(answer => answer.question_id === questionId);
    
    if (responseAnswer?.answer_type) {
      // Only use bar chart for emoji and rating questions, exclude multiple choice
      const useBarChart = responseAnswer.answer_type === "emoji" || responseAnswer.answer_type === "rating";
      
      if (useBarChart) {
        console.log(
          `🎯 Found ${responseAnswer.answer_type} question ${questionId}: "${responseAnswer.question_name}"`
        );
      } else {
        console.log(
          `🚫 Excluding ${responseAnswer.answer_type} question ${questionId} from bar chart: "${responseAnswer.question_name}"`
        );
      }
      
      return useBarChart;
    }

    // Fallback to survey details data
    if (surveyDetailsData?.survey_details?.surveys?.[0]) {
      const surveyDetail = surveyDetailsData.survey_details.surveys[0];
      const question = surveyDetail.questions?.find(
        (q) => q.question_id === questionId
      );

      if (question?.options) {
        const questionType = getQuestionType(question.options);
        const useBarChart =
          questionType === "rating" || questionType === "emoji";

        console.log(
          `🔍 Question ${questionId} ("${question.question}") type: ${questionType}, useBarChart: ${useBarChart}`
        );

        if (useBarChart) {
          console.log(
            `🎯 Found ${questionType} question ${questionId}: "${question.question}"`
          );
        } else {
          console.log(
            `🚫 Excluding ${questionType} question ${questionId} from bar chart: "${question.question}"`
          );
        }

        return useBarChart;
      }
    }
    return false;
  };

  // Helper function to get chart type based on question
  const getChartType = (
    questionId: number
  ): "statusDistribution" | "surveyDistributions" => {
    const useBarChart = shouldUseBarChart(questionId);
    const chartType = useBarChart
      ? "surveyDistributions"
      : "statusDistribution";

    // Find question text for debugging
    const question = surveyData?.questions.find(
      (q) => q.question_id === questionId
    );
    const questionText = question?.question || "Unknown";

    // console.log(
    //   `🔍 Chart type for question ${questionId} ("${questionText.substring(
    //     0,
    //     50
    //   )}..."): ${chartType} (useBarChart: ${useBarChart})`
    // );

    return chartType;
  };

  // Prepare pie chart data for survey summary statistics
  const getSurveyTypeDistributionData = () => {
    // console.log("🔍 Getting survey type distribution data");
    // console.log("🔍 Survey data for type distribution:", surveyData);
    // console.log("🔍 Survey details data:", surveyDetailsData);

    if (!surveyData) {
      return [
        {
          name: "No Data",
          value: 1,
          color: "#C72030",
        },
      ];
    }

    const typeDistribution = [];

    // Calculate total responses across all questions (only for questions with options)
    const totalResponses =
      surveyData.questions?.reduce((sum, question) => {
        if (question.options && question.options.length > 0) {
          return (
            sum +
            (question.options.reduce(
              (optSum, opt) => optSum + opt.response_count,
              0
            ) || 0)
          );
        }
        return sum;
      }, 0) || 0;

    // Add total responses across all questions
    if (totalResponses > 0) {
      typeDistribution.push({
        name: "Total Responses",
        value: totalResponses,
        color: "#C72030",
      });
    }

    // Add question count
    if (surveyData.questions?.length > 0) {
      typeDistribution.push({
        name: "Total Questions",
        value: surveyData.questions.length,
        color: "#c6b692",
      });
    }

    // Count questions with options vs questions without options
    const questionsWithOptions =
      surveyData.questions?.filter((q) => q.options && q.options.length > 0)
        .length || 0;
    const questionsWithoutOptions =
      (surveyData.questions?.length || 0) - questionsWithOptions;

    if (questionsWithOptions > 0) {
      typeDistribution.push({
        name: "Questions with Options",
        value: questionsWithOptions,
        color: "#10B981",
      });
    }

    if (questionsWithoutOptions > 0) {
      typeDistribution.push({
        name: "Questions without Options",
        value: questionsWithoutOptions,
        color: "#F59E0B",
      });
    }

    // Add option-specific data from survey details
    if (surveyDetailsData?.survey_details?.surveys?.[0]) {
      const surveyDetail = surveyDetailsData.survey_details.surveys[0];

      if (surveyDetail.questions) {
        // Add total options count across all questions (only for questions that have options)
        const totalOptions = surveyDetail.questions.reduce(
          (sum: number, q: SurveyQuestion) => sum + (q.options?.length || 0),
          0
        );

        if (totalOptions > 0) {
          typeDistribution.push({
            name: "Total Options",
            value: totalOptions,
            color: "#d8dcdd",
          });
        }

        // Add total answered options count
        const totalAnsweredOptions = surveyDetail.questions.reduce(
          (sum: number, q: SurveyQuestion) =>
            sum +
            (q.options?.filter((o: SurveyOption) => (o.response_count || 0) > 0)
              .length || 0),
          0
        );

        if (totalAnsweredOptions > 0) {
          typeDistribution.push({
            name: "Answered Options",
            value: totalAnsweredOptions,
            color: "#8B5CF6",
          });
        }
      }
    }

    // Fallback if no data
    if (typeDistribution.length === 0) {
      typeDistribution.push({
        name: "Survey Data",
        value: 1,
        color: "#C72030",
      });
    }

    // console.log("🔍 Generated type distribution:", typeDistribution);
    return typeDistribution;
  };

  const handleDownloadResponseChart = () => {
    // console.log("Download response distribution chart");
    toast.success("Chart download initiated");
  };

  const handleDownloadTypeChart = () => {
    // console.log("Download survey type distribution chart");
    toast.success("Survey type chart download initiated");
  };

  // Helper to build summary bar chart data
  const getSummaryBarChartData = () => {
    if (!responseListData?.summary) return [];
    return [
      { name: "Total Surveys", value: responseListData.summary.total_surveys },
      {
        name: "Active Surveys",
        value: responseListData.summary.active_surveys,
      },
      {
        name: "Inactive Surveys",
        value: responseListData.summary.inactive_surveys,
      },
      {
        name: "Total Responses",
        value: responseListData.summary.total_responses,
      },
    ];
  };

  // Helper to build question-wise response bar chart data
  const getQuestionWiseBarChartData = () => {
    if (!surveyData?.questions) return [];
    return surveyData.questions.map((q) => ({
      name: q.question.substring(0, 30) + (q.question.length > 30 ? "..." : ""),
      responses:
        q.options?.reduce((sum, opt) => sum + opt.response_count, 0) || 0,
    }));
  };

  // Memoized data functions
  const getTabularData = useCallback((): TabularResponseData[] => {
    console.log("🔍 getTabularData called");
    console.log("🔍 responseListData:", responseListData);

    if (!responseListData?.responses) {
      console.log(
        "🚫 No response data available - responseListData:",
        responseListData
      );
      return [];
    }

    console.log("🔍 Found responses:", responseListData.responses.length);
    console.log("🔍 First response:", responseListData.responses[0]);

    const transformedData: TabularResponseData[] = [];

    responseListData.responses.forEach((response: SurveyResponse) => {
      console.log("🔍 Processing response:", response.response_id);
      console.log("🔍 Response answers:", response.answers);

      // Create one row per response (not per answer)
      const responseId = response.response_id ?? '';
      const rowData: TabularResponseData = {
        id: responseId.toString(),
        response_id: responseId.toString(),
        date_time: response.responded_time
          ? new Date(response.responded_time).toLocaleString("en-GB", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
              hour12: false,
            })
          : "",
        building: response.location?.building_name || "",
        wing: response.location?.wing_name || "",
        area: response.location?.area_name || "",
        floor: response.location?.floor_name || "",
        room: response.location?.room_name || "",
        question_type: "",
        question_name: "",
        answer: "",
        final_comment: "",
        ticket_id: "",
        // Legacy fields for backward compatibility
        icon_category: "",
        rating: "",
        category: "",
      };

      // Create a map to organize answers by question_id for easier lookup
      const answersByQuestionId = new Map<number, ResponseAnswer>();
      if (response.answers && response.answers.length > 0) {
        response.answers.forEach((answer: ResponseAnswer) => {
          answersByQuestionId.set(answer.question_id, answer);
        });
      }

      // Populate dynamic question columns with detailed structure
      if (surveyData?.questions && surveyData.questions.length > 0) {
        surveyData.questions.forEach(
          (question: SurveyQuestion, index: number) => {
            const questionNumber = index + 1;
            const answer = answersByQuestionId.get(question.question_id);

            // Initialize all columns for this question
            const typeKey = `q${questionNumber}_type`;
            const answerKey = `q${questionNumber}_answer`;
            const questionNameKey = `q${questionNumber}_question_name`;
            const iconKey = `q${questionNumber}_icon`;
            const commentKey = `q${questionNumber}_comment`;

            if (answer) {
              // Question Type - use answer.answer_type with first letter capitalized
              const questionType = answer.answer_type || "-";
              rowData[typeKey] =
                questionType === "-"
                  ? "-"
                  : questionType.charAt(0).toUpperCase() +
                    questionType.slice(1);

              // Question Dynamic - use ans_descr for emoji/smiley/rating, option_name for multiple
              let answerValue = "-";
              if (
                answer.answer_type === "rating" ||
                answer.answer_type === "emoji" ||
                answer.answer_type === "smiley"
              ) {
                answerValue = answer.ans_descr || "-";
              } else if (answer.answer_type === "multiple") {
                answerValue = answer.option_name || "-";
              } else {
                answerValue = answer.ans_descr || answer.option_name || "-";
              }
              rowData[answerKey] = answerValue;

              // Question Name - use answer.question_name
              rowData[questionNameKey] =
                answer.question_name || question.question || "-";

              // Issue Icon - complaints icon_category (comma-separated if multiple)
              if (answer.complaints && answer.complaints.length > 0) {
                const iconCategories = answer.complaints
                  .map((complaint) => complaint.icon_category)
                  .filter(Boolean);
                rowData[iconKey] =
                  iconCategories.length > 0 ? iconCategories.join(", ") : "-";
              } else {
                rowData[iconKey] = "-";
              }

              // Comment - answers.comments
              rowData[commentKey] = answer.comments || "-";
            } else {
              // No answer for this question
              rowData[typeKey] = "-";
              rowData[answerKey] = "-";
              rowData[questionNameKey] = question.question || "-";
              rowData[iconKey] = "-";
              rowData[commentKey] = "-";
            }
          }
        );
      }

      // Add final comments from the response
      if (response.final_comments && response.final_comments.length > 0) {
        rowData.final_comment = response.final_comments
          .map((comment) => comment.body)
          .join("; ");
      } else {
        rowData.final_comment = "-";
      }

      // Handle complaints/tickets - collect ticket numbers from all answers
      const allTicketNumbers: string[] = [];
      const categories: string[] = [];

      if (response.answers && response.answers.length > 0) {
        response.answers.forEach((answer: ResponseAnswer) => {
          if (answer.complaints && answer.complaints.length > 0) {
            const ticketNumbers = answer.complaints
              .map((complaint) => complaint.ticket_number)
              .filter(Boolean);
            allTicketNumbers.push(...ticketNumbers);

            const answerCategories = answer.complaints
              .map((complaint) => complaint.category)
              .filter(Boolean);
            categories.push(...answerCategories);
          }
        });
      }

      const ticketIdValue =
        allTicketNumbers.length > 0 ? allTicketNumbers.join(", ") : "-";
      rowData.ticket_id = ticketIdValue;
      rowData.category = categories.join(", ");

      console.log(
        "🎯 Ticket IDs for response",
        response.response_id,
        ":",
        ticketIdValue
      );
      console.log("🔍 Created row data:", rowData);
      transformedData.push(rowData);
    });

    // Sort by response_id (most recent first)
    transformedData.sort(
      (a, b) => parseInt(b.response_id) - parseInt(a.response_id)
    );

    console.log("🎯 Final transformed data for table:", transformedData);
    console.log("🎯 Number of rows:", transformedData.length);
    return transformedData;
  }, [responseListData, surveyData]);

  // Transform ticket data for tickets EnhancedTable
  const getTicketData = useCallback((): TicketData[] => {
    if (!responseListData?.responses) return [];

    const ticketData: TicketData[] = [];

    responseListData.responses.forEach((response: SurveyResponse) => {
      // Check complaints within individual answers
      if (response.answers && response.answers.length > 0) {
        response.answers.forEach((answer: ResponseAnswer) => {
          if (answer.complaints && answer.complaints.length > 0) {
            answer.complaints.forEach((complaint: ResponseComplaint) => {
              // Only add if we have the required complaint data
              if (complaint.complaint_id && complaint.ticket_number) {
                ticketData.push({
                  id: `ticket-${response.mapping_id}-${complaint.complaint_id}`,
                  complaint_id: complaint.complaint_id,
                  ticket_number: complaint.ticket_number,
                  heading: complaint.heading || "Survey Response Issue",
                  category: complaint.category || "-",
                  assignee: complaint.assignee || "-",
                  status: complaint.status || "Pending",
                  updated_by: complaint.updated_by || "-",
                  created_by: "-",
                  created_at: new Date(complaint.created_at).toLocaleString(
                    "en-GB",
                    {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: false,
                    }
                  ),
                  location: `${response.location?.building_name || ""}, ${
                    response.location?.wing_name || ""
                  }`,
                });
              }
            });
          }
        });
      }
    });

    return ticketData;
  }, [responseListData]);

  // Get dynamic columns for tabular data
  const getTabularColumns = () => {
    const baseColumns = [
      {
        key: "response_id",
        label: "Response Id",
        defaultVisible: true,
        sortable: true,
      },
      {
        key: "date_time",
        label: "Time",
        defaultVisible: true,
        sortable: true,
      },
      {
        key: "building",
        label: "Building",
        defaultVisible: true,
        sortable: true,
      },
      { key: "wing", label: "Wing", defaultVisible: true, sortable: true },
      { key: "area", label: "Area", defaultVisible: true, sortable: true },
      { key: "floor", label: "Floor", defaultVisible: true, sortable: true },
      { key: "room", label: "Room", defaultVisible: true, sortable: true },
    ];

    // Add dynamic question columns with detailed structure
    const questionColumns: Array<{
      key: string;
      label: string;
      defaultVisible: boolean;
      sortable: boolean;
    }> = [];
    if (surveyData?.questions && surveyData.questions.length > 0) {
      surveyData.questions.forEach(
        (question: SurveyQuestion, index: number) => {
          // For each question, add 4 columns: Question Type, Question Dynamic, Issue Icon, Comment
          const questionNumber = index + 1;

          // Question Type column
          questionColumns.push({
            key: `q${questionNumber}_type`,
            label: `Question Type`,
            defaultVisible: true,
            sortable: true,
          });

          // Question Dynamic column (shows the actual answer)
          questionColumns.push({
            key: `q${questionNumber}_answer`,
            label:
              question.question.length > 50
                ? `${question.question.substring(0, 50)}...`
                : question.question,
            defaultVisible: true,
            sortable: true,
          });

          // Issue Icon column (complaints icon_category)
          questionColumns.push({
            key: `q${questionNumber}_icon`,
            // label: `Q${questionNumber} Issue Icon`,
            label: `Issue Icon`,

            defaultVisible: true,
            sortable: true,
          });

          // Comment column (answers.comments)
          questionColumns.push({
            key: `q${questionNumber}_comment`,
            // label: `Q${questionNumber} Comment`,
            label: `Comment`,
            defaultVisible: true,
            sortable: true,
          });
        }
      );
    }

    const endColumns = [
      {
        key: "final_comment",
        label: "Final Comments",
        defaultVisible: true,
        sortable: true,
        width: 200, // Set width for final comments
        minWidth: 150,
      },
      {
        key: "ticket_id",
        label: "Ticket Id",
        defaultVisible: true,
        sortable: true,
        width: 200, // Set specific width to accommodate full ticket numbers
        minWidth: 150, // Minimum width to prevent over-compression
      },
    ];

    return [...baseColumns, ...questionColumns, ...endColumns];
  };

  // Static columns for ticket data
  const getTicketColumns = () => [
    // {
    //   key: "complaint_id",
    //   label: "Complaint ID",
    //   defaultVisible: true,
    //   sortable: true,
    // },
    {
      key: "ticket_number",
      label: "ID",
      defaultVisible: true,
      sortable: true,
    },
    { key: "heading", label: "Title", defaultVisible: true, sortable: true },
    {
      key: "category",
      label: "Category",
      defaultVisible: true,
      sortable: true,
    },
    {
      key: "assignee",
      label: "Assignee",
      defaultVisible: true,
      sortable: true,
    },
    {
      key: "status",
      label: "Status",
      defaultVisible: true,
      sortable: true,
    },
    // {
    //   key: "updated_by",
    //   label: "Updated By",
    //   defaultVisible: true,
    //   sortable: true,
    // },
    // {
    //   key: "created_by",
    //   label: "Created By",
    //   defaultVisible: true,
    //   sortable: true,
    // },
    // { key: 'priority', label: 'Priority', defaultVisible: true, sortable: true },
    {
      key: "created_at",
      label: "Created On",
      defaultVisible: true,
      sortable: true,
    },
    // { key: 'description', label: 'Description', defaultVisible: true, sortable: true },
  ];

  // Filter functions
  const applyFiltersToTabularData = (
    data: TabularResponseData[],
    filters: SurveyResponseFilters
  ): TabularResponseData[] => {
    return data.filter((item) => {
      // Date range filter
      if (filters.dateRange?.from || filters.dateRange?.to) {
        // Parse the date_time string which is in format like "22/09/2025, 15:04"
        const dateTimeParts = item.date_time.split(", ");
        const datePart = dateTimeParts[0]; // "22/09/2025"
        const [day, month, year] = datePart.split("/").map(Number);
        const itemDate = new Date(year, month - 1, day); // month is 0-indexed in JS Date

        if (filters.dateRange.from) {
          const fromDate = new Date(filters.dateRange.from);
          fromDate.setHours(0, 0, 0, 0); // Start of day
          if (itemDate < fromDate) return false;
        }

        if (filters.dateRange.to) {
          const toDate = new Date(filters.dateRange.to);
          toDate.setHours(23, 59, 59, 999); // End of day
          if (itemDate > toDate) return false;
        }
      }

      // Location filters
      if (
        filters.building &&
        !(item.building || "")
          .toLowerCase()
          .includes(filters.building.toLowerCase())
      )
        return false;
      if (
        filters.wing &&
        !(item.wing || "").toLowerCase().includes(filters.wing.toLowerCase())
      )
        return false;
      if (
        filters.area &&
        !(item.area || "").toLowerCase().includes(filters.area.toLowerCase())
      )
        return false;
      if (
        filters.floor &&
        !(item.floor || "").toLowerCase().includes(filters.floor.toLowerCase())
      )
        return false;
      if (
        filters.room &&
        !(item.room || "").toLowerCase().includes(filters.room.toLowerCase())
      )
        return false;

      // Icon Category filter
      if (
        filters.iconCategory &&
        !(item.icon_category || "")
          .toLowerCase()
          .includes(filters.iconCategory.toLowerCase())
      )
        return false;

      // Rating filter
      if (filters.rating && !(item.rating || "").includes(filters.rating))
        return false;

      // Category filter
      if (filters.category && item.category !== filters.category) return false;

      // Has tickets filter
      if (filters.hasTickets && !item.ticket_id) return false;

      return true;
    });
  };

  const applyFiltersToTicketData = (
    data: TicketData[],
    filters: SurveyResponseFilters
  ): TicketData[] => {
    return data.filter((item) => {
      // Date range filter
      if (filters.dateRange?.from || filters.dateRange?.to) {
        // Parse the created_at string which is in format like "22/09/2025"
        const [day, month, year] = item.created_at.split("/").map(Number);
        const itemDate = new Date(year, month - 1, day); // month is 0-indexed in JS Date

        if (filters.dateRange.from) {
          const fromDate = new Date(filters.dateRange.from);
          fromDate.setHours(0, 0, 0, 0); // Start of day
          if (itemDate < fromDate) return false;
        }

        if (filters.dateRange.to) {
          const toDate = new Date(filters.dateRange.to);
          toDate.setHours(23, 59, 59, 999); // End of day
          if (itemDate > toDate) return false;
        }
      }

      // Assignee filter
      if (
        filters.assignee &&
        !(item.assignee || "")
          .toLowerCase()
          .includes(filters.assignee.toLowerCase())
      )
        return false;

      // Category filter
      if (
        filters.category &&
        !(item.category || "")
          .toLowerCase()
          .includes(filters.category.toLowerCase())
      )
        return false;

      return true;
    });
  };

  // Local state for date inputs to prevent blinking
  const [localFromDate, setLocalFromDate] = useState("");
  const [localToDate, setLocalToDate] = useState("");

  // Sync local date state with form filters when modal opens
  useEffect(() => {
    if (showFilterModal) {
      const activeFormFilters =
        activeFilterTab === "summary" ? summaryFormFilters : tabularFormFilters;
      setLocalFromDate(
        activeFormFilters.dateRange?.from
          ? new Date(activeFormFilters.dateRange.from)
              .toISOString()
              .split("T")[0]
          : ""
      );
      setLocalToDate(
        activeFormFilters.dateRange?.to
          ? new Date(activeFormFilters.dateRange.to).toISOString().split("T")[0]
          : ""
      );
    }
  }, [
    showFilterModal,
    summaryFormFilters,
    tabularFormFilters,
    activeFilterTab,
  ]);

  // Optimized date handlers using useCallback to prevent unnecessary re-renders
  // Use local state for immediate UI feedback and batch update to form state
  const handleFromDateChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const dateValue = e.target.value;
      setLocalFromDate(dateValue);

      const date = dateValue ? new Date(dateValue) : undefined;

      if (activeFilterTab === "summary") {
        setSummaryFormFilters((prev) => ({
          ...prev,
          dateRange: {
            ...prev.dateRange,
            from: date,
          },
        }));
      } else {
        setTabularFormFilters((prev) => ({
          ...prev,
          dateRange: {
            ...prev.dateRange,
            from: date,
          },
        }));
      }
    },
    [activeFilterTab]
  );

  const handleToDateChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const dateValue = e.target.value;
      setLocalToDate(dateValue);

      const date = dateValue ? new Date(dateValue) : undefined;

      if (activeFilterTab === "summary") {
        setSummaryFormFilters((prev) => ({
          ...prev,
          dateRange: {
            ...prev.dateRange,
            to: date,
          },
        }));
      } else {
        setTabularFormFilters((prev) => ({
          ...prev,
          dateRange: {
            ...prev.dateRange,
            to: date,
          },
        }));
      }
    },
    [activeFilterTab]
  );

  // Filter handlers
  const handleSummaryFilterClick = useCallback(() => {
    setActiveFilterTab("summary");
    setSummaryFormFilters(summaryCurrentFilters); // Initialize form with current applied filters
    setShowFilterModal(true);
  }, [summaryCurrentFilters]);

  const handleTabularFilterClick = useCallback(() => {
    setActiveFilterTab("tabular");
    setTabularFormFilters(tabularCurrentFilters); // Initialize form with current applied filters
    setShowFilterModal(true);
  }, [tabularCurrentFilters]);

  // Legacy filter click handler for backwards compatibility
  const handleFilterClick = useCallback(() => {
    setActiveFilterTab("tabular");
    setTabularFormFilters(tabularCurrentFilters); // Initialize form with current applied filters
    setShowFilterModal(true);
  }, [tabularCurrentFilters]);

  // Function to refetch survey details with current summary filters
  const refetchSurveyDetailsWithFilters = useCallback(
    async (filters: SurveyResponseFilters) => {
      if (!surveyId) return;

      try {
        setIsLoading(true);
        // console.log("🔄 Refetching survey details with filters:", filters);

        const fromDate = filters.dateRange?.from;
        const toDate = filters.dateRange?.to;

        const surveyDetailsResponse = await fetchSurveyDetails(
          surveyId,
          fromDate,
          toDate
        );

        setSurveyDetailsData(surveyDetailsResponse);

        // Extract survey data from the filtered API response
        if (surveyDetailsResponse?.survey_details?.surveys?.length > 0) {
          const surveyDetail = surveyDetailsResponse.survey_details.surveys[0];
          setSurveyData(surveyDetail);
          // console.log("📊 Survey data updated with filters:", surveyDetail);
        } else {
          console.warn("⚠️ No survey data found for the applied filters");
          toast.info("No data found for the selected date range");
        }
      } catch (error) {
        console.error(
          "❌ Error refetching survey details with filters:",
          error
        );
        toast.error("Failed to apply date filters to survey data");
      } finally {
        setIsLoading(false);
      }
    },
    [surveyId, fetchSurveyDetails]
  );

  console.log("surveyDetails", surveyDetailsData);

  // Export function for tabular data - opens modal
  const handleTabularExport = useCallback(() => {
    if (!surveyId) {
      toast.error("Survey ID is required for export");
      return;
    }

    // Initialize export dates with current tabular filters or empty
    setExportFromDate(tabularCurrentFilters.dateRange?.from 
      ? new Date(tabularCurrentFilters.dateRange.from).toISOString().split("T")[0] 
      : "");
    setExportToDate(tabularCurrentFilters.dateRange?.to 
      ? new Date(tabularCurrentFilters.dateRange.to).toISOString().split("T")[0] 
      : "");
    
    setShowExportModal(true);
  }, [surveyId, tabularCurrentFilters]);

  // Actual export function after date selection
  const handleConfirmExport = useCallback(async () => {
    if (!surveyId) {
      toast.error("Survey ID is required for export");
      return;
    }

    try {
      // Build the export URL with dynamic parameters
      const baseUrl = getFullUrl("/survey_mappings/response_list.xlsx");
      const exportUrl = new URL(baseUrl);

      // Add required parameters
      exportUrl.searchParams.append(
        "access_token",
        "fkLRVExOU3z0SUElnlKtEkNd7fJ4jOUL8hKd190ONrU"
      );
      exportUrl.searchParams.append("survey_id", surveyId);
      exportUrl.searchParams.append("export", "true");

      // Add date filters if they are provided
      if (exportFromDate) {
        const fromDate = new Date(exportFromDate);
        const fromDateStr = fromDate.toLocaleDateString('en-GB', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric'
        }).replace(/\//g, '/'); // Format: DD/MM/YYYY
        exportUrl.searchParams.append("from_date", fromDateStr);
      }

      if (exportToDate) {
        const toDate = new Date(exportToDate);
        const toDateStr = toDate.toLocaleDateString('en-GB', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric'
        }).replace(/\//g, '/'); // Format: DD/MM/YYYY
        exportUrl.searchParams.append("to_date", toDateStr);
      }

      console.log("🚀 Exporting tabular data from:", exportUrl.toString());

      // Create a temporary link element and trigger download
      const link = document.createElement("a");
      link.href = exportUrl.toString();
      
      // Create a more descriptive filename with date range if filters are applied
      let filename = `survey_responses_${surveyId}`;
      if (exportFromDate || exportToDate) {
        const fromStr = exportFromDate 
          ? new Date(exportFromDate).toLocaleDateString('en-GB').replace(/\//g, '-')
          : 'start';
        const toStr = exportToDate
          ? new Date(exportToDate).toLocaleDateString('en-GB').replace(/\//g, '-')
          : 'end';
        filename += `_${fromStr}_to_${toStr}`;
      } else {
        filename += '_all_data';
      }
      filename += '.xlsx';
      
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      const dateRangeText = (exportFromDate || exportToDate) 
        ? ' for selected date range' 
        : ' (all data)';
      toast.success(`Export initiated successfully${dateRangeText}`);
      
      // Close the modal
      setShowExportModal(false);
    } catch (error) {
      console.error("❌ Error exporting tabular data:", error);
      toast.error("Failed to export survey data");
    }
  }, [surveyId, exportFromDate, exportToDate]);

  const handleApplyFilters = useCallback(async () => {
    if (activeFilterTab === "summary") {
      setSummaryCurrentFilters(summaryFormFilters);

      // Refetch survey details with the new date filters for summary tab
      await refetchSurveyDetailsWithFilters(summaryFormFilters);
      
      // Show success toast for summary filters
      toast.success("Summary filters applied successfully");
    } else {
      setTabularCurrentFilters(tabularFormFilters);

      // Apply filters to both datasets for tabular tab
      const baseTabularData = getTabularData();
      const baseTicketData = getTicketData();

      setFilteredTabularData(
        applyFiltersToTabularData(baseTabularData, tabularFormFilters)
      );
      setFilteredTicketData(
        applyFiltersToTicketData(baseTicketData, tabularFormFilters)
      );
      
      // Show success toast for tabular filters
      toast.success("Tabular filters applied successfully");
    }

    setShowFilterModal(false);
  }, [
    activeFilterTab,
    summaryFormFilters,
    tabularFormFilters,
    getTabularData,
    getTicketData,
    refetchSurveyDetailsWithFilters,
  ]);

  const handleClearFilters = useCallback(async () => {
    if (activeFilterTab === "summary") {
      setSummaryCurrentFilters({});
      setSummaryFormFilters({});

      // Instead of refetching, restore original data to avoid page refresh
      if (originalSurveyData && originalSurveyDetailsData) {
        setSurveyData(originalSurveyData);
        setSurveyDetailsData(originalSurveyDetailsData);
      }
      
      // Show success toast for summary filter reset
      toast.success("Summary filters cleared successfully");
    } else {
      setTabularCurrentFilters({});
      setTabularFormFilters({});
      setFilteredTabularData([]);
      setFilteredTicketData([]);
      
      // Show success toast for tabular filter reset
      toast.success("Tabular filters cleared successfully");
    }
    // Keep modal open after clearing filters
  }, [activeFilterTab, originalSurveyData, originalSurveyDetailsData]);

  const getActiveFiltersCount = useCallback(() => {
    const filters =
      activeFilterTab === "summary"
        ? summaryCurrentFilters
        : tabularCurrentFilters;
    let count = 0;
    if (filters.dateRange?.from || filters.dateRange?.to) count++;
    if (filters.building) count++;
    if (filters.wing) count++;
    if (filters.area) count++;
    if (filters.floor) count++;
    if (filters.room) count++;
    if (filters.iconCategory) count++;
    if (filters.rating) count++;
    if (filters.category) count++;
    if (filters.assignee) count++;
    if (filters.hasTickets) count++;
    return count;
  }, [activeFilterTab, summaryCurrentFilters, tabularCurrentFilters]);

  const hasActiveFilters = useCallback(
    () => getActiveFiltersCount() > 0,
    [getActiveFiltersCount]
  );

  // Memoized date values to prevent unnecessary re-computation
  const minDateValue = useMemo(() => {
    return localFromDate || undefined;
  }, [localFromDate]);

  // Get data to display (filtered or original) - for tabular tab
  const getDisplayTabularData = useCallback(() => {
    // console.log("🔍 getDisplayTabularData called");
    // console.log("🔍 tabularCurrentFilters:", tabularCurrentFilters);
    // console.log("🔍 Object.keys(tabularCurrentFilters).length:", Object.keys(tabularCurrentFilters).length);
    // console.log("🔍 filteredTabularData.length:", filteredTabularData.length);

    if (Object.keys(tabularCurrentFilters).length > 0) {
      console.log("🔍 Using filtered data:", filteredTabularData.length);
      return filteredTabularData;
    }

    const rawData = getTabularData();
    console.log("🔍 Using raw tabular data:", rawData.length);
    return rawData;
  }, [tabularCurrentFilters, filteredTabularData, getTabularData]);

  const getDisplayTicketData = useCallback(() => {
    if (Object.keys(tabularCurrentFilters).length > 0) {
      return filteredTicketData;
    }
    return getTicketData();
  }, [tabularCurrentFilters, filteredTicketData, getTicketData]);

  // Export Modal Component
  const ExportModal = useMemo(() => (
    <Dialog open={showExportModal} onOpenChange={setShowExportModal}>
      <DialogContent className="max-w-md bg-white">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-gray-800 flex items-center">
            {/* <Download className="w-5 h-5 mr-2 text-[#C72030]" /> */}
            Export Survey Data
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="text-sm text-gray-600 mb-4">
            <span className="text-red-700 text-xl">* </span>Select date to export range responses, or leave empty to export all data.
          </div>

          <div className="space-y-4">
            <div>
              <Label htmlFor="export-from-date" className="text-sm font-medium text-gray-700">
                From Date
              </Label>
              <Input
                id="export-from-date"
                type="date"
                value={exportFromDate}
                onChange={(e) => setExportFromDate(e.target.value)}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="export-to-date" className="text-sm font-medium text-gray-700">
                To Date
              </Label>
              <Input
                id="export-to-date"
                type="date"
                value={exportToDate}
                onChange={(e) => setExportToDate(e.target.value)}
                min={exportFromDate || undefined}
                className="mt-1"
              />
            </div>
          </div>

          {(exportFromDate || exportToDate) && (
            <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded">
              <strong>Export range:</strong> {' '}
              {exportFromDate ? new Date(exportFromDate).toLocaleDateString('en-GB') : 'Start'} to {' '}
              {exportToDate ? new Date(exportToDate).toLocaleDateString('en-GB') : 'End'}
            </div>
          )}

          {/* {!exportFromDate && !exportToDate && (
            <div className="text-xs text-blue-600 bg-blue-50 p-2 rounded">
              <strong>All data will be exported</strong> - No date filters applied
            </div>
          )} */}
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t">
          <Button
            variant="outline"
            onClick={() => setShowExportModal(false)}
            className="px-6"
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirmExport}
            className="px-6 bg-[#C72030] hover:bg-[#C72030]/90 text-white flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Export
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  ), [showExportModal, exportFromDate, exportToDate, handleConfirmExport]);

  // Filter Modal Component - Memoized to prevent unnecessary re-renders
  const FilterModal = useMemo(
    () => (
      <Dialog open={showFilterModal} onOpenChange={setShowFilterModal}>
        <DialogContent className="max-w-2xl bg-white max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold text-gray-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                Filter Survey Responses
                {hasActiveFilters() && (
                  <span className="bg-[#C72030] text-white text-xs px-2 py-1 rounded-full">
                    {getActiveFiltersCount()}
                  </span>
                )}
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowFilterModal(false)}
                className="h-6 w-6 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Date Range Filter */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-gray-700">
                  {activeFilterTab === "summary"
                    ? "Filter Summary Data"
                    : "Filter Tabular Data"}
                </h3>
                {/* <span className="text-xs text-gray-500">
                  {activeFilterTab === "summary"
                    ? "Apply date filters to survey analytics"
                    : "Filter response records"}
                </span> */}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-xs text-gray-500">From Date</Label>
                  <Input
                    type="date"
                    value={localFromDate}
                    onChange={handleFromDateChange}
                    className="w-full"
                    placeholder="Select start date"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs text-gray-500">To Date</Label>
                  <Input
                    type="date"
                    value={localToDate}
                    min={minDateValue}
                    onChange={handleToDateChange}
                    className="w-full"
                    placeholder="Select end date"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t">
            <Button
              variant="outline"
              onClick={handleClearFilters}
              className="px-6"
            >
              Reset
            </Button>
            <Button
              onClick={handleApplyFilters}
              className="px-6 bg-[#C72030] hover:bg-[#C72030]/90 text-white"
            >
              Apply Filters
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    ),
    [
      showFilterModal,
      hasActiveFilters,
      getActiveFiltersCount,
      minDateValue,
      handleFromDateChange,
      handleToDateChange,
      handleClearFilters,
      handleApplyFilters,
      localFromDate,
      localToDate,
      activeFilterTab,
    ]
  );

  if (isLoading) {
    return (
      <div className="flex-1 p-4 sm:p-6 bg-white min-h-screen">
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#C72030] mx-auto mb-4"></div>
          <h1 className="text-xl font-semibold text-gray-800 mb-2">
            Loading survey details...
          </h1>
          <p className="text-gray-600">
            Please wait while we fetch the survey information.
          </p>
        </div>
      </div>
    );
  }

  if (!surveyData) {
    return (
      <div className="flex-1 p-4 sm:p-6 bg-white min-h-screen">
        <div className="text-center py-8">
          <Button
            variant="ghost"
            onClick={() => navigate("/maintenance/survey/response")}
            className="mb-6 p-0 h-auto text-gray-600 hover:text-gray-800"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Response List
          </Button>
          <div className="max-w-md mx-auto">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl text-gray-400">📋</span>
            </div>
            <h1 className="text-xl font-semibold text-gray-800 mb-2">
              Survey not found
            </h1>
            <p className="text-gray-600 mb-4">
              The survey with ID "{surveyId}" could not be found or has no data
              available.
            </p>
            <Button
              onClick={() => navigate("/maintenance/survey/response")}
              className="bg-[#C72030] hover:bg-[#A01B2A] text-white"
            >
              Return to Survey List
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <Button
          variant="ghost"
          onClick={() => navigate("/maintenance/survey/response")}
          className="mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Response List
        </Button>

        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-[#1a1a1a]">
            Survey Response Details - {surveyData.survey_name}
          </h1>
          <div className="flex gap-2">
            <div className="text-sm text-gray-600">
              Total Responses:{" "}
              <span className="text-[#C72030] font-medium">
                {surveyData.questions?.reduce((sum, q) => {
                  if (q.options && q.options.length > 0) {
                    return (
                      sum +
                      (q.options.reduce(
                        (optSum, opt) => optSum + opt.response_count,
                        0
                      ) || 0)
                    );
                  }
                  return sum;
                }, 0) || 0}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="flex flex-nowrap justify-start overflow-x-auto no-scrollbar bg-gray-50 rounded-t-lg h-auto p-0 text-sm">
            {[
              { label: "Summary", value: "summary" },
              { label: "Tabular", value: "tabular" },
              { label: "Tickets", value: "tickets" },
            ].map((tab) => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className="bg-white data-[state=active]:bg-[#EDEAE3] px-3 py-2 data-[state=active]:text-[#C72030] whitespace-nowrap"
              >
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
          <TabsContent value="summary" className="p-3 sm:p-6">
            {/* Summary Tab Header with Filter */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-800">
                Survey Analytics Summary
              </h2>
              <div className="flex items-center gap-3">
                {Object.keys(summaryCurrentFilters).length > 0 && (
                  <span className="text-sm text-gray-600">
                    {(() => {
                      let count = 0;
                      if (
                        summaryCurrentFilters.dateRange?.from ||
                        summaryCurrentFilters.dateRange?.to
                      )
                        count++;
                      return count;
                    })()}{" "}
                    filter
                    {(() => {
                      let count = 0;
                      if (
                        summaryCurrentFilters.dateRange?.from ||
                        summaryCurrentFilters.dateRange?.to
                      )
                        count++;
                      return count !== 1 ? "s" : "";
                    })()}{" "}
                    active
                  </span>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setActiveFilterTab("summary");
                    setSummaryFormFilters(summaryCurrentFilters);
                    setShowFilterModal(true);
                  }}
                  className="flex items-center gap-2"
                >
                  <Filter className="w-4 h-4" />
                  Filter
                  {Object.keys(summaryCurrentFilters).length > 0 && (
                    <span className="ml-1 px-1.5 py-0.5 text-xs bg-[#C72030] text-white rounded-full">
                      {(() => {
                        let count = 0;
                        if (
                          summaryCurrentFilters.dateRange?.from ||
                          summaryCurrentFilters.dateRange?.to
                        )
                          count++;
                        return count;
                      })()}
                    </span>
                  )}
                </Button>
              </div>
            </div>

            {/* Summary Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-[#C72030] text-white rounded-full flex items-center justify-center">
                      <List className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Total Questions</p>
                      <p className="text-xl font-semibold">
                        {surveyData.questions?.length || 0}
                      </p>
                      {Object.keys(summaryCurrentFilters).length > 0 && (
                        <p className="text-xs text-gray-500">
                          All questions shown
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center">
                      <BarChart3 className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">
                        {Object.keys(summaryCurrentFilters).length > 0
                          ? "Filtered Responses"
                          : "Total Responses"}
                      </p>
                      <p className="text-xl font-semibold">
                        {(() => {
                          const filteredResponses =
                            getSummaryFilteredResponseData();
                          if (
                            Object.keys(summaryCurrentFilters).length > 0 &&
                            filteredResponses.length > 0
                          ) {
                            // Count total answers from filtered responses
                            return filteredResponses.reduce(
                              (total, response) => {
                                return total + (response.answers?.length || 0);
                              },
                              0
                            );
                          }
                          // Original count
                          return (
                            surveyData.questions?.reduce((sum, q) => {
                              if (q.options && q.options.length > 0) {
                                return (
                                  sum +
                                  (q.options.reduce(
                                    (optSum, opt) =>
                                      optSum + opt.response_count,
                                    0
                                  ) || 0)
                                );
                              }
                              return sum;
                            }, 0) || 0
                          );
                        })()}
                      </p>
                      {Object.keys(summaryCurrentFilters).length > 0 && (
                        <p className="text-xs text-gray-500">
                          Based on date filter
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center">
                      <Activity className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">
                        {Object.keys(summaryCurrentFilters).length > 0
                          ? "Filtered Responses"
                          : "Survey Status"}
                      </p>
                      <p
                        className={`text-xl font-semibold ${
                          Object.keys(summaryCurrentFilters).length > 0
                            ? "text-blue-600"
                            : surveyData?.survey_status === 1 ||
                              surveyData?.survey_status === true ||
                              surveyData?.is_active === 1 ||
                              surveyData?.is_active === true
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {Object.keys(summaryCurrentFilters).length > 0
                          ? `${getSummaryFilteredResponseData().length} Records`
                          : surveyData?.survey_status === 1 ||
                            surveyData?.survey_status === true ||
                            surveyData?.is_active === 1 ||
                            surveyData?.is_active === true
                          ? "Active"
                          : "Inactive"}
                      </p>
                      {Object.keys(summaryCurrentFilters).length > 0 && (
                        <p className="text-xs text-gray-500">
                          Matching criteria
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Overall Response Distribution */}
            <Card className="mb-6 border border-[#D9D9D9] bg-[#F6F7F7]">
              <CardHeader className="bg-[#F6F4EE] mb-6">
                <CardTitle className="text-lg flex items-center">
                  <div className="w-8 h-8 bg-[#C72030] text-white rounded-full flex items-center justify-center mr-3">
                    <BarChart3 className="h-4 w-4" />
                  </div>
                  OVERALL RESPONSE DISTRIBUTION
                </CardTitle>
              </CardHeader>
              <CardContent>
                <SurveyAnalyticsCard
                  title="Overall Question Response Distribution"
                  type="statusDistribution"
                  data={getResponseDistributionData()}
                  dateRange={{
                    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
                    endDate: new Date(),
                  }}
                  onDownload={handleDownloadResponseChart}
                />
              </CardContent>
            </Card>

            {/* Questions Response Details */}
            <Card className="mb-6 border border-[#D9D9D9] bg-[#F6F7F7]">
              <CardHeader className="bg-[#F6F4EE] mb-6">
                <CardTitle className="text-lg flex items-center">
                  <div className="w-8 h-8 bg-[#C72030] text-white rounded-full flex items-center justify-center mr-3">
                    <List className="h-4 w-4" />
                  </div>
                  QUESTION RESPONSE DETAILS 
                  
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {surveyData.questions.map((question: SurveyQuestion, index: number) => {
                    const totalResponses =
                      question.options?.reduce(
                        (sum, opt) => sum + opt.response_count,
                        0
                      ) || 0;
                    const responseTexts =
                      question.options
                        ?.filter((opt) => opt.response_count > 0)
                        .map(
                          (opt) =>
                            `${opt.option} (${opt.response_count} responses)`
                        ) || [];

                    // Check if question has any options configured
                    const hasOptions =
                      question.options && question.options.length > 0;

                    return (
                      <div
                        key={question.question_id}
                        className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm"
                      >
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <h3 className="font-medium text-gray-800 mb-1 text-base">
                              <span className="text-[#C72030] font-semibold mr-2">
                                Q{index + 1}.
                              </span>
                              {question.question}
                            </h3>
                            <p className="text-sm text-gray-600">
                              {hasOptions
                                ? `${totalResponses} Responses`
                                : "No options configured"}
                            </p>
                          </div>
                        </div>

                        {/* Question Response Distribution Chart - Dynamic Type */}
                        <div className="mb-4">
                          <SurveyAnalyticsCard
                            title={(() => {
                              // Only show specific emoji/rating titles if shouldUseBarChart returns true
                              const useBarChart = shouldUseBarChart(question.question_id);
                              
                              if (useBarChart) {
                                const questionType = getQuestionType(
                                  question.options || []
                                );
                                if (questionType === "rating") {
                                  return "Rating Response";
                                } else if (questionType === "emoji") {
                                  return "Emoji Responses";
                                }
                              }
                              
                              // For all multiple choice questions (not using bar charts), show generic title
                              return `Response Distribution: ${question.question.substring(
                                0,
                                50
                              )}${
                                question.question.length > 50 ? "..." : ""
                              }`;
                            })()}
                            type={getChartType(question.question_id)}
                            data={getQuestionOptionsData(question.question_id)}
                            dateRange={{
                              startDate: new Date(
                                Date.now() - 30 * 24 * 60 * 60 * 1000
                              ),
                              endDate: new Date(),
                            }}
                            xAxisLabel={getAxisLabels(question.question_id).xAxisLabel}
                            yAxisLabel={getAxisLabels(question.question_id).yAxisLabel}
                            onDownload={() => {
                              // console.log(
                              //   `Download chart for question ${question.question_id}`
                              // );
                              toast.success(
                                `Chart for question ${question.question_id} download initiated`
                              );
                            }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tabular" className="p-3 sm:p-6">
            <Card className="mb-6 border border-[#D9D9D9] bg-[#F6F7F7]">
              <CardHeader className="bg-[#F6F4EE] mb-6">
                <CardTitle className="text-lg flex items-center">
                  <div className="w-8 h-8 bg-[#C72030] text-white rounded-full flex items-center justify-center mr-3">
                    <Table className="h-4 w-4" />
                  </div>
                  SURVEY RESPONSES
                </CardTitle>
              </CardHeader>
              <CardContent>
                <EnhancedTaskTable
                  data={getDisplayTabularData()}
                  columns={getTabularColumns()}
                  storageKey="survey-response-tabular-v2"
                  exportFileName="survey-responses-tabular"
                  enableSearch={true}
                  searchPlaceholder="Search responses..."
                  emptyMessage={
                    !responseListData
                      ? "Loading response data..."
                      : `No response data available (${
                          getTabularData().length
                        } items processed)`
                  }
                  pagination={true}
                  pageSize={10}
                  className="border border-gray-200 rounded-lg"
                  loading={isLoading}
                  onFilterClick={handleFilterClick}
                  rightActions={
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleTabularExport}
                      className="flex items-center gap-2"
                    >
                      <Download className="h-4 w-4" />
                      {/* Export */}
                    </Button>
                  }
                  getItemId={(item: TabularResponseData) => item.id}
                  renderCell={(
                    item: TabularResponseData,
                    columnKey: string
                  ) => {
                    const cellValue =
                      item[columnKey as keyof TabularResponseData];

                    // Format the Answer Type column to capitalize properly
                    if (columnKey === "category") {
                      const answerType = cellValue as string;
                      if (answerType === "multiple") return "Multiple";
                      if (answerType === "rating") return "Rating";
                      if (answerType === "emoji") return "Emoji";
                      return answerType || "-";
                    }

                    // Special handling for Icon Category with truncation and hover
                    if (
                      columnKey === "icon_category" ||
                      columnKey.startsWith("icon_category_")
                    ) {
                      const iconCategoryValue = cellValue as string;
                      if (!iconCategoryValue || iconCategoryValue === "-") {
                        return <span className="text-gray-400">-</span>;
                      }
                      return (
                        <TruncatedText
                          text={iconCategoryValue}
                          maxLength={15}
                          className="text-gray-900 font-medium"
                        />
                      );
                    }

                    // Special handling for Ticket ID - show full value with proper wrapping
                    if (columnKey === "ticket_id") {
                      const ticketValue = cellValue as string;
                      if (!ticketValue || ticketValue === "-") {
                        return <span className="text-gray-400">-</span>;
                      }
                      return (
                        <div
                          className="text-black-600 font-medium break-words text-xs leading-tight overflow-hidden"
                          style={{
                            maxWidth: "180px",
                            minWidth: "140px",
                            wordBreak: "break-all",
                            whiteSpace: "normal",
                            lineHeight: "1.2",
                          }}
                        >
                          {ticketValue}
                        </div>
                      );
                    }

                    return cellValue || "-";
                  }}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tickets" className="p-3 sm:p-6">
            <Card className="mb-6 border border-[#D9D9D9] bg-[#F6F7F7]">
              <CardHeader className="bg-[#F6F4EE] mb-6">
                <CardTitle className="text-lg flex items-center">
                  <div className="w-8 h-8 bg-[#C72030] text-white rounded-full flex items-center justify-center mr-3">
                    <Ticket className="h-4 w-4" />
                  </div>
                  SURVEY TICKETS
                </CardTitle>
              </CardHeader>
              <CardContent>
                <EnhancedTaskTable
                  data={getDisplayTicketData()}
                  columns={getTicketColumns()}
                  storageKey="survey-response-tickets"
                  exportFileName="survey-tickets"
                  enableSearch={true}
                  searchPlaceholder="Search tickets..."
                  emptyMessage={
                    !responseListData
                      ? "Loading ticket data..."
                      : "No tickets available"
                  }
                  pagination={true}
                  pageSize={10}
                  className="border border-gray-200 rounded-lg"
                  loading={isLoading}
                  // onFilterClick={handleFilterClick}
                  getItemId={(item: TicketData) => item.id}
                  renderCell={(item: TicketData, columnKey: string) => {
                    if (columnKey === "ticket_number") {
                      const ticketNumber = item.ticket_number || "-";
                      return (
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                          <TruncatedText text={ticketNumber} maxLength={12} />
                        </span>
                      );
                    }
                    if (columnKey === "category") {
                      const category = item.category || "-";
                      return (
                        <span className="px-2 py-1 rounded-full text-xs font-medium">
                          <TruncatedText text={category} maxLength={15} />
                        </span>
                      );
                    }
                    if (columnKey === "heading") {
                      // For the title/heading column, apply truncation with hover
                      const heading = item.heading || "-";
                      return (
                        <TruncatedText
                          text={heading}
                          maxLength={20}
                          className="text-gray-900 font-medium"
                        />
                      );
                    }
                    if (columnKey === "assignee") {
                      const assignee = item.assignee || "-";
                      return (
                        <span className="px-2 py-1 rounded-full text-xs font-medium">
                          <TruncatedText text={assignee} maxLength={15} />
                        </span>
                      );
                    }
                    return item[columnKey as keyof TicketData];
                  }}
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Export Modal */}
      {ExportModal}

      {/* Filter Modal */}
      {FilterModal}
    </div>
  );
};
