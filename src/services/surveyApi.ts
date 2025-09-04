import baseClient from "@/utils/withoutTokenBase";
import { getFullUrl, getAuthHeader } from '@/config/apiConfig';

export interface SurveyMapping {
  id: string;
  name: string;
  description: string;
  survey_type: 'washroom' | 'facility' | 'service';
  status: 'active' | 'inactive';
  created_at: string;
  updated_at: string;
}

export interface SurveyResponse {
  id?: string;
  mapping_id: string;
  rating: number;
  emoji: string;
  label: string;
  issues: string[];
  description?: string;
  submitted_at?: string;
  user_info?: {
    ip_address?: string;
    user_agent?: string;
    location?: string;
  };
}

export interface SurveyResponseData {
  id: number;
  survey_mapping_id: number;
  created_by_id: number;
  created_at: string;
  updated_at: string;
  response_json: string;
  parsed_response: Record<string, unknown>;
  question_count: number;
  response_count: number;
  survey_title: string;
  created_by: {
    id: number;
    full_name: string;
  };
  location: string;
}

export interface SurveySubmissionRequest {
  survey_response: {
    mapping_id: string;
    question_id: number;
    option_id?: number; // For multiple choice questions
    issues: string[]; // Array of issue category names
    rating?: number; // For rating and emoji questions
    emoji?: string; // For emoji questions
    label?: string; // For emoji questions
    response_text?: string; // For input/description questions
    description?: string; // Additional description
    final_description?: string; // Final survey description
  };
}

export const surveyApi = {
  // Get all survey responses
  async getAllSurveyResponses(): Promise<SurveyResponseData[]> {
    try {
      const response = await fetch(getFullUrl('/survey_mapping_responses/all_responses.json'), {
        method: 'GET',
        headers: {
          'Authorization': getAuthHeader(),
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching survey responses:", error);
      throw new Error("Failed to fetch survey responses");
    }
  },

  // Get specific survey response by ID
  async getSurveyResponseById(id: string | number): Promise<SurveyResponseData | null> {
    try {
      const allResponses = await this.getAllSurveyResponses();
      const response = allResponses.find(item => item.id.toString() === id.toString());
      return response || null;
    } catch (error) {
      console.error("Error fetching survey response by ID:", error);
      throw new Error("Failed to fetch survey response");
    }
  },

  // Get survey mapping details
  async getSurveyMapping(mappingId: string): Promise<SurveyMapping> {
    try {
      const response = await baseClient.get(`https://fm-uat-api.lockated.com/survey_mappings/${mappingId}/survey.json`);
      return response.data;
    } catch (error) {
      console.error("Error fetching survey mapping:", error);
      throw new Error("Failed to fetch survey mapping");
    }
  },

  // Submit survey response
  async submitSurveyResponse(surveyData: SurveySubmissionRequest): Promise<SurveyResponse> {
    try {
      console.log("=== SURVEY API SUBMISSION ===");
      console.log("Full payload being sent:", JSON.stringify(surveyData, null, 2));
      console.log("survey_response object:", JSON.stringify(surveyData.survey_response, null, 2));
      
      const response = await baseClient.post("/add_survey_feedback.json?skp_dr=true", surveyData); 
      
      console.log("API Response:", response.data);
      return response.data.survey_response;
    } catch (error) {
      console.error("Error submitting survey response:", error);
      throw new Error("Failed to submit survey response");
    }
  },

  // Get survey analytics (optional)
  async getSurveyAnalytics(mappingId: string): Promise<object> {
    try {
      const response = await baseClient.get(`/survey_mappings/${mappingId}/analytics.json`);
      return response.data;
    } catch (error) {
      console.error("Error fetching survey analytics:", error);
      throw new Error("Failed to fetch survey analytics");
    }
  }
};
