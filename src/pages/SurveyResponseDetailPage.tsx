import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
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
  created_at: string;
  level_id: number | null;
  comments: string;
  responded_by: string;
  option_id?: number;
  option_name?: string;
  option_type?: string;
  ans_descr?: string;
}

interface ResponseComplaint {
  complaint_id: number;
  ticket_number: string;
  heading: string;
  assigned_to: number;
  category: string;
  assignee: string;
  relation_id: number;
  created_at: string;
}

interface SurveyResponse {
  survey_id: number;
  survey_name: string;
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
  final_comment: string;
  complaint_count: number;
  complaints: ResponseComplaint[];
  answers: ResponseAnswer[];
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
  rating: string;
  category: string;
  final_comment: string;
  ticket_id: string;
  [key: string]: string | number | undefined; // For dynamic question columns
}

interface TicketData {
  id: string;
  complaint_id: number;
  ticket_number: string;
  heading: string;
  category: string;
  assignee: string;
  created_at: string;
  location: string;
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

  // Fetch response list data from new API
  const fetchResponseListData = useCallback(async () => {
    try {
      const baseUrl = getFullUrl(`/survey_mappings/response_list.json`);
      const url = new URL(baseUrl);

      // Add the required query parameter with dynamic survey ID
      if (surveyId) {
        url.searchParams.append("q[id_eq]", surveyId);
      }

      // Add token parameter instead of Authorization header
      url.searchParams.append("token", "fkLRVExOU3z0SUElnlKtEkNd7fJ4jOUL8hKd190ONrU");

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
      setResponseListData(data);
    } catch (error) {
      console.error("Error fetching response list data:", error);
      toast.error("Failed to fetch response list data");
    }
  }, [surveyId]);

  // API function to fetch survey details using the new endpoint
  const fetchSurveyDetails = async (surveyId: string) => {
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

      // Add access_token from API_CONFIG if available
      if (API_CONFIG.TOKEN) {
        urlWithParams.searchParams.append("access_token", API_CONFIG.TOKEN);
      }

      console.log("🚀 Fetching survey details from:", urlWithParams.toString());
      console.log("🔍 Survey ID being requested:", surveyId);

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
          throw new Error("You do not have permission to access this survey.");
        } else {
          throw new Error(
            `Failed to fetch survey details: ${response.status} ${response.statusText}`
          );
        }
      }

      const data = await response.json();
      console.log("✅ Survey details response received:", data);
      console.log(
        "🔍 Survey array length:",
        data?.survey_details?.surveys?.length || 0
      );

      return data;
    } catch (error) {
      console.error("❌ Error fetching survey details:", error);
      throw error;
    }
  };

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
        console.log("Fetching survey details for survey ID:", surveyId);

        // Fetch survey details using the new API endpoint
        surveyDetailsResponse = await fetchSurveyDetails(surveyId);
        console.log("Fetched survey details:", surveyDetailsResponse);
        setSurveyDetailsData(surveyDetailsResponse);

        // Extract survey data from the new API response
        if (surveyDetailsResponse?.survey_details?.surveys?.length > 0) {
          const surveyDetail = surveyDetailsResponse.survey_details.surveys[0];

          // Set the survey data directly from the API response
          setSurveyData(surveyDetail);
          console.log("Survey data set:", surveyDetail);
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
  }, [surveyId, navigate, fetchResponseListData]);

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
        console.log("Question responses copied to clipboard");
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

  // Prepare pie chart data for response distribution for this single response
  const getResponseDistributionData = () => {
    console.log("🔍 Getting response distribution data for single response");
    console.log("🔍 Survey data:", surveyData);

    // For a single response, show the distribution of answers across questions
    if (surveyData?.questions && surveyData.questions.length > 0) {
      const responseDistribution = surveyData.questions.map(
        (question: SurveyQuestion, index: number) => {
          // Only count responses for questions that have options
          const totalResponses =
            question.options && question.options.length > 0
              ? question.options.reduce(
                  (sum, opt) => sum + opt.response_count,
                  0
                )
              : 0;

          return {
            name: `${question.question.substring(0, 30)}${
              question.question.length > 30 ? "..." : ""
            }`,
            value: totalResponses || 1, // Show at least 1 for visualization
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

      console.log(
        "🔍 Response distribution from survey data:",
        responseDistribution
      );
      return responseDistribution;
    }

    // Ultimate fallback: Show single response
    const fallbackData = [
      {
        name: "Single Response",
        value: 1,
        color: "#C72030",
      },
    ];

    console.log("🔍 Using fallback response distribution:", fallbackData);
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

    return "regular";
  };

  // Prepare pie chart data for individual question showing option distribution
  const getQuestionOptionsData = (questionId: number) => {
    console.log(
      "🔍 Getting question options data for question ID:",
      questionId
    );
    console.log("🔍 Survey details data:", surveyDetailsData);
    console.log("🔍 Survey data questions:", surveyData?.questions);

    // Check if this is a rating/emoji question to determine color scheme
    const isRatingQuestion = shouldUseBarChart(questionId);

    // Get question from survey details API response
    if (surveyDetailsData?.survey_details?.surveys?.[0]) {
      const surveyDetail = surveyDetailsData.survey_details.surveys[0];
      const question = surveyDetail.questions?.find(
        (q) => q.question_id === questionId
      );

      console.log("🔍 Found question from survey details:", question);

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

        // Determine question type and return standardized data
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

        console.log("🔍 Options data from survey details:", optionsData);
        console.log(`🔍 Question ${questionId} type: ${questionType}`);

        // For regular questions, only return options that have responses, or all options if none have responses
        const hasResponses = optionsData.some((item) => item.value > 0);
        if (hasResponses) {
          return optionsData.filter((item) => item.value > 0);
        } else {
          // Show all options with 0 values if no responses yet
          return optionsData;
        }
      }
    }

    // Fallback: Show no data message
    console.log("🔍 No data found, returning empty array");
    return [
      {
        name: "No responses yet",
        value: 1,
        color: "#E5E5E5",
      },
    ];
  };

  // Helper function to determine if question should use bar chart or pie chart
  const shouldUseBarChart = (questionId: number): boolean => {
    if (surveyDetailsData?.survey_details?.surveys?.[0]) {
      const surveyDetail = surveyDetailsData.survey_details.surveys[0];
      const question = surveyDetail.questions?.find(
        (q) => q.question_id === questionId
      );

      if (question?.options) {
        const questionType = getQuestionType(question.options);
        const useBarChart =
          questionType === "rating" || questionType === "emoji";

        if (useBarChart) {
          console.log(
            `🎯 Found ${questionType} question ${questionId}: "${question.question}"`
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

    console.log(
      `🔍 Chart type for question ${questionId} ("${questionText.substring(
        0,
        50
      )}..."): ${chartType} (useBarChart: ${useBarChart})`
    );

    return chartType;
  };

  // Prepare pie chart data for survey summary statistics
  const getSurveyTypeDistributionData = () => {
    console.log("🔍 Getting survey type distribution data");
    console.log("🔍 Survey data for type distribution:", surveyData);
    console.log("🔍 Survey details data:", surveyDetailsData);

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

    console.log("🔍 Generated type distribution:", typeDistribution);
    return typeDistribution;
  };

  const handleDownloadResponseChart = () => {
    console.log("Download response distribution chart");
    toast.success("Chart download initiated");
  };

  const handleDownloadTypeChart = () => {
    console.log("Download survey type distribution chart");
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

  // Transform response data for tabular EnhancedTable
  const getTabularData = (): TabularResponseData[] => {
    if (!responseListData?.responses) {
      console.log("❌ No response data available");
      return [];
    }
    
    console.log("🔍 Transforming response data for table:", responseListData.responses);
    
    const transformedData = responseListData.responses.map((response: SurveyResponse) => {
      const answers = response.answers || [];
      console.log(`🔍 Processing response ${response.mapping_id} with ${answers.length} answers`);
      
      const questionAnswers: { [key: number]: ResponseAnswer[] } = {};
      
      // Group answers by question
      answers.forEach((answer) => {
        if (!questionAnswers[answer.question_id]) {
          questionAnswers[answer.question_id] = [];
        }
        questionAnswers[answer.question_id].push(answer);
      });

      // Get rating from emoji or rating type answers (use the latest one)
      const ratingAnswers = answers.filter(
        (a) => a.answer_type === "emoji" || a.answer_type === "rating"
      );
      const ratingAnswer = ratingAnswers.length > 0 ? ratingAnswers[ratingAnswers.length - 1] : null;

      // Get the latest timestamp from all answers
      const latestAnswer = answers.length > 0 ? 
        answers.reduce((latest, current) => 
          new Date(current.created_at) > new Date(latest.created_at) ? current : latest
        ) : null;

      // Create base row data
      const rowData: TabularResponseData = {
        id: `response-${response.mapping_id}`,
        response_id: response.mapping_id.toString(),
        date_time: latestAnswer
          ? new Date(latestAnswer.created_at).toLocaleString("en-GB", {
              day: "2-digit",
              month: "2-digit", 
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
              hour12: false,
            })
          : "-",
        building: response.building_name || "-",
        wing: response.wing_name || "-",
        area: response.area_name || "-",
        floor: response.floor_name || "-",
        room: response.room_name || "-",
        rating: ratingAnswer?.ans_descr || ratingAnswer?.level_id?.toString() || "-",
        category: answers[0]?.answer_type || "-",
        final_comment: response.final_comment || answers.find((a) => a.comments && a.comments.trim() !== "")?.comments || "-",
        ticket_id: response.complaints && response.complaints.length > 0
          ? response.complaints[0].complaint_id?.toString()
          : "-",
      };

      // Add dynamic question data
      const allUniqueQuestions = Array.from(
        new Map(
          responseListData.responses
            .flatMap((r) => r.answers || [])
            .map((answer) => [answer.question_id, answer.question_name])
        ).entries()
      );

      allUniqueQuestions.forEach(([questionId, questionName]) => {
        const questionAnswersForId = questionAnswers[questionId] || [];
        const columnKey = `question_${questionId}`;
        
        // For multiple answers to the same question, use the latest one
        if (questionAnswersForId.length > 0) {
          const latestQuestionAnswer = questionAnswersForId.reduce((latest, current) => 
            new Date(current.created_at) > new Date(latest.created_at) ? current : latest
          );
          rowData[columnKey] = latestQuestionAnswer.option_name || latestQuestionAnswer.ans_descr || "-";
        } else {
          rowData[columnKey] = "-";
        }
      });

      console.log(`🔍 Transformed row data for response ${response.mapping_id}:`, rowData);
      return rowData;
    });
    
    console.log("🎯 Final transformed data for table:", transformedData);
    return transformedData;
  };

  // Transform ticket data for tickets EnhancedTable  
  const getTicketData = (): TicketData[] => {
    if (!responseListData?.responses) return [];
    
    const ticketData: TicketData[] = [];
    
    responseListData.responses.forEach((response: SurveyResponse) => {
      response.complaints?.forEach((complaint: ResponseComplaint) => {
        ticketData.push({
          id: `ticket-${response.mapping_id}-${complaint.complaint_id}`,
          complaint_id: complaint.complaint_id,
          ticket_number: complaint.ticket_number,
          heading: complaint.heading,
          category: complaint.category,
          assignee: complaint.assignee,
          created_at: new Date(complaint.created_at).toLocaleDateString(),
          location: response.site_name && response.building_name
            ? `${response.site_name}, ${response.building_name}`
            : response.site_name || "-",
        });
      });
    });
    
    return ticketData;
  };

  // Get dynamic columns for tabular data
  const getTabularColumns = () => {
    const baseColumns = [
      { key: 'response_id', label: 'Response Id', defaultVisible: true, sortable: true },
      { key: 'date_time', label: 'Date & Time', defaultVisible: true, sortable: true },
      { key: 'building', label: 'Building', defaultVisible: true, sortable: true },
      { key: 'wing', label: 'Wing', defaultVisible: true, sortable: true },
      { key: 'area', label: 'Area', defaultVisible: true, sortable: true },
      { key: 'floor', label: 'Floor', defaultVisible: true, sortable: true },
      { key: 'room', label: 'Room', defaultVisible: true, sortable: true },
      { key: 'rating', label: 'Rating', defaultVisible: true, sortable: true },
    ];

    // Add dynamic question columns
    if (responseListData?.responses) {
      const allUniqueQuestions = Array.from(
        new Map(
          responseListData.responses
            .flatMap((response) => response.answers || [])
            .map((answer) => [answer.question_id, answer.question_name])
        ).entries()
      );

      allUniqueQuestions.forEach(([questionId, questionName]) => {
        baseColumns.push({
          key: `question_${questionId}`,
          label: questionName,
          defaultVisible: true,
          sortable: true,
        });
      });
    }

    baseColumns.push(
      { key: 'category', label: 'Category', defaultVisible: true, sortable: true },
      { key: 'final_comment', label: 'Final Comment', defaultVisible: true, sortable: true },
      { key: 'ticket_id', label: 'Ticket Id', defaultVisible: true, sortable: true }
    );

    console.log("🔍 Generated columns:", baseColumns);
    return baseColumns;
  };

  // Static columns for ticket data
  const getTicketColumns = () => [
    { key: 'complaint_id', label: 'Complaint ID', defaultVisible: true, sortable: true },
    { key: 'ticket_number', label: 'Ticket Number', defaultVisible: true, sortable: true },
    { key: 'heading', label: 'Heading', defaultVisible: true, sortable: true },
    { key: 'category', label: 'Category', defaultVisible: true, sortable: true },
    { key: 'priority', label: 'Priority', defaultVisible: true, sortable: true },
    { key: 'status', label: 'Status', defaultVisible: true, sortable: true },
    { key: 'created_date', label: 'Created Date', defaultVisible: true, sortable: true },
    { key: 'description', label: 'Description', defaultVisible: true, sortable: true },
  ];  if (isLoading) {
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
    <div className="flex-1 p-4 sm:p-6 bg-white min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <Button
          variant="ghost"
          onClick={() => navigate("/maintenance/survey/response")}
          className="mb-4 p-0 h-auto text-gray-600 hover:text-gray-800"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Response List
        </Button>

        <h1 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-6">
          Response Detail
        </h1>

        {/* Tabs wrapper encompasses everything that needs tab context */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="bg-[#F5F3EF] p-4 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 bg-[#C72030] rounded-full flex items-center justify-center text-white font-bold text-sm">
                  S
                </div>
                <div>
                  <div className="text-sm text-gray-500">Survey Details</div>
                  {/* <div className="text-xs text-gray-400">Survey ID: {surveyData.survey_id}</div> */}
                  {/* <div className="text-xs text-gray-400">Survey: {surveyData.survey_name}</div> */}
                </div>
              </div>

              <div className="flex items-center gap-8">
                <TabsList className="bg-transparent border-0 p-0 h-auto">
                  <TabsTrigger
                    value="summary"
                    className="bg-transparent border-0 text-gray-600 data-[state=active]:bg-transparent data-[state=active]:text-gray-900 data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-gray-400 rounded-none pb-1"
                  >
                    Summary
                  </TabsTrigger>
                  <TabsTrigger
                    value="tabular"
                    className="bg-transparent border-0 text-gray-600 data-[state=active]:bg-transparent data-[state=active]:text-gray-900 data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-gray-400 rounded-none pb-1 ml-6"
                  >
                    Tabular
                  </TabsTrigger>
                  <TabsTrigger
                    value="tickets"
                    className="bg-transparent border-0 text-gray-600 data-[state=active]:bg-transparent data-[state=active]:text-gray-900 data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-gray-400 rounded-none pb-1 ml-6"
                  >
                    Tickets
                  </TabsTrigger>
                </TabsList>
              </div>

              <div className="flex items-center gap-2">
                {/* <div className="text-sm text-gray-700">
                Total Responses: <span className="text-[#C72030] font-medium">
                  {surveyData.questions?.reduce((sum, q) => {
                    if (q.options && q.options.length > 0) {
                      return sum + (q.options.reduce((optSum, opt) => optSum + opt.response_count, 0) || 0);
                    }
                    return sum;
                  }, 0) || 0}
                </span>
              </div> */}
              </div>
            </div>
          </div>
          <TabsContent value="summary" className="space-y-6">
            {/* Bar Chart 1: Survey Summary Statistics */}
            {/* <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="text-base font-bold text-[#C72030]">Survey Summary Statistics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={getSummaryBarChartData()} margin={{ top: 20, right: 30, left: 20, bottom: 40 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e0e4e7" />
                      <XAxis dataKey="name" angle={-20} textAnchor="end" fontSize={12} tick={{ fill: '#374151' }} interval={0} height={60} />
                      <YAxis fontSize={12} tick={{ fill: '#374151' }} />
                      <Tooltip />
                      <Bar dataKey="value" fill="#C72030" name="Count" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card> */}

            {/* Bar Chart 2: Question-wise Response Distribution */}
            {/* <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="text-base font-bold text-[#3b82f6]">Question-wise Response Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={getQuestionWiseBarChartData()} margin={{ top: 20, right: 30, left: 20, bottom: 40 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e0e4e7" />
                      <XAxis dataKey="name" angle={-20} textAnchor="end" fontSize={12} tick={{ fill: '#374151' }} interval={0} height={60} />
                      <YAxis fontSize={12} tick={{ fill: '#374151' }} />
                      <Tooltip />
                      <Bar dataKey="responses" fill="#3b82f6" name="Responses" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card> */}

            {/* Summary Statistics from new API */}
            {/* {responseListData?.summary && (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <div className="text-2xl font-bold text-blue-700">{responseListData.summary.total_surveys}</div>
                  <div className="text-sm text-blue-600">Total Surveys</div>
                </div>
                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <div className="text-2xl font-bold text-green-700">{responseListData.summary.active_surveys}</div>
                  <div className="text-sm text-green-600">Active Surveys</div>
                </div>
                <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                  <div className="text-2xl font-bold text-orange-700">{responseListData.summary.total_responses}</div>
                  <div className="text-sm text-orange-600">Total Responses</div>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                  <div className="text-2xl font-bold text-purple-700">{responseListData.summary.inactive_surveys}</div>
                  <div className="text-sm text-purple-600">Inactive Surveys</div>
                </div>
              </div>
            )} */}

            {/* Questions and Responses */}
            {surveyData.questions.map((question: SurveyQuestion) => {
              const totalResponses =
                question.options?.reduce(
                  (sum, opt) => sum + opt.response_count,
                  0
                ) || 0;
              const responseTexts =
                question.options
                  ?.filter((opt) => opt.response_count > 0)
                  .map(
                    (opt) => `${opt.option} (${opt.response_count} responses)`
                  ) || [];

              // Check if question has any options configured
              const hasOptions =
                question.options && question.options.length > 0;

              return (
                <div
                  key={question.question_id}
                  className="bg-[#F5F3EF] p-4 rounded-lg border"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h3 className="font-medium text-gray-800 mb-1 text-base">
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
                      title={`Response Distribution: ${question.question.substring(
                        0,
                        50
                      )}${question.question.length > 50 ? "..." : ""}`}
                      type={getChartType(question.question_id)}
                      data={getQuestionOptionsData(question.question_id)}
                      dateRange={{
                        startDate: new Date(
                          Date.now() - 30 * 24 * 60 * 60 * 1000
                        ),
                        endDate: new Date(),
                      }}
                      onDownload={() => {
                        console.log(
                          `Download chart for question ${question.question_id}`
                        );
                        toast.success(
                          `Chart for question ${question.question_id} download initiated`
                        );
                      }}
                    />
                  </div>

                  {/* Rsponse Total counts */}

                  {/* <div className="space-y-2 max-h-64 overflow-y-auto pr-2">
                    {hasOptions ? (
                      responseTexts.length > 0 ? (
                        responseTexts.map((response: string, index: number) => (
                          <div
                            key={index}
                            className="bg-white p-3 rounded border border-gray-200 text-gray-700"
                          >
                            {response}
                          </div>
                        ))
                      ) : (
                        <div className="bg-white p-3 rounded border border-gray-200 text-gray-500 text-center">
                          No responses yet
                        </div>
                      )
                    ) : (
                      <div className="bg-white p-3 rounded border border-gray-200 text-gray-500 text-center">
                        This question has no configured options
                      </div>
                    )}
                  </div> */}
                </div>
              );
            })}

            {/* Survey Summary Statistics Pie Chart - Second Last Position */}
            <div className="mt-8">
              {/* <SurveyAnalyticsCard
                title="Survey Summary Statistics"
                type="surveyDistributions"
                data={getSurveyTypeDistributionData()}
                dateRange={{ 
                  startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), 
                  endDate: new Date() 
                }}
                onDownload={handleDownloadTypeChart}
              /> */}
            </div>

            {/* Overall Response Distribution Pie Chart - Last Position */}
            <div className="mt-6">
              {/* <SurveyAnalyticsCard
                title="Overall Question Response Distribution"
                type="statusDistribution"
                data={getResponseDistributionData()}
                dateRange={{ 
                  startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), 
                  endDate: new Date() 
                }}
                onDownload={handleDownloadResponseChart}
              /> */}
            </div>
          </TabsContent>
          <TabsContent value="tabular" className="mt-6">
            <div className="bg-white">
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-gray-800">
                  Survey Responses
                </h3>
              </div>

              <EnhancedTaskTable
                data={getTabularData()}
                columns={getTabularColumns()}
                storageKey="survey-response-tabular"
                enableExport={true}
                exportFileName="survey-responses-tabular"
                enableSearch={true}
                searchPlaceholder="Search responses..."
                emptyMessage={!responseListData ? "Loading response data..." : `No response data available (${getTabularData().length} items processed)`}
                pagination={true}
                pageSize={10}
                className="border border-gray-200 rounded-lg"
                loading={isLoading}
                getItemId={(item: TabularResponseData) => item.id}
                renderCell={(item: TabularResponseData, columnKey: string) => {
                  const cellValue = item[columnKey as keyof TabularResponseData];
                  return cellValue || '-';
                }}
              />
            </div>
          </TabsContent>{" "}
          <TabsContent value="tickets" className="mt-6">
            <div className="bg-white">
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-gray-800">
                  Survey Tickets
                </h3>
                <p className="text-sm text-gray-600">
                  Complaints and tickets generated from survey responses
                </p>
              </div>

              <EnhancedTaskTable
                data={getTicketData()}
                columns={getTicketColumns()}
                storageKey="survey-response-tickets"
                enableExport={true}
                exportFileName="survey-tickets"
                enableSearch={true}
                searchPlaceholder="Search tickets..."
                emptyMessage={!responseListData ? "Loading ticket data..." : "No tickets available"}
                pagination={true}
                pageSize={10}
                className="border border-gray-200 rounded-lg"
                loading={isLoading}
                getItemId={(item: TicketData) => item.id}
                renderCell={(item: TicketData, columnKey: string) => {
                  if (columnKey === 'ticket_number') {
                    return (
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                        {item.ticket_number}
                      </span>
                    );
                  }
                  if (columnKey === 'category') {
                    return (
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                        {item.category}
                      </span>
                    );
                  }
                  return item[columnKey as keyof TicketData];
                }}
              />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
