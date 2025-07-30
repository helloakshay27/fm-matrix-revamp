import baseClient from "@/utils/withoutTokenBase";
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

export interface SurveySubmissionRequest {
  survey_response: {
    mapping_id: string;
    rating: number;
    emoji: string;
    label: string;
    issues: string[];
    description?: string;
    option_id?: number;
    question_id?: number;
  };
}

export const surveyApi = {
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
      console.log("Submitting survey response:", surveyData);
       const response = await baseClient.post("/add_survey_feedback.json?skp_dr=true", surveyData); 
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
