import { API_CONFIG } from '@/config/apiConfig';

// Real Survey Analytics API Response Interface
export interface SurveyAnalyticsResponse {
  analytics: {
    total_surveys: number;
    total_responses: number;
    positive_responses: number;
    negative_responses: number;
    neutral_responses: number;
    complaints_count: number;
    top_surveys: Array<{
      survey_id: number;
      survey_name: string;
      response_count: number;
      positive_responses: number;
      negative_responses: number;
      neutral_responses: number;
      complaints_count: number;
    }>;
    most_raised_category: {
      category_key: string;
      category_label: string;
      complaint_count: number;
    };
  };
}

// Mock Survey Analytics API (keeping for fallback)
export interface SurveyStatusData {
    info: {
        total_active_surveys: number;
        total_expired_surveys: number;
        total_pending_surveys: number;
    };
}

export interface SurveyStatisticsData {
    total_surveys: number;
    total_responses: number;
    completed_surveys: number;
    pending_surveys: number;
    active_surveys: number;
    expired_surveys: number;
    average_rating: number;
    response_rate: number;
}

export interface SurveyDistributionData {
    success: number;
    message: string;
    info: {
        info: string;
        total_feedback_surveys: number;
        total_assessment_surveys: number;
    };
    sites: Array<{
        site_name: string;
        survey_count: number;
    }>;
}

export interface TypeWiseSurveysData {
    info: string;
    type_wise_surveys: Array<{
        survey_type: string;
        survey_count: number;
    }>;
}

export interface CategoryWiseSurveysData {
    categories: Array<{
        category_name: string;
        survey_count: number;
    }>;
}

class SurveyAnalyticsAPI {
    // Mock delay function
    private delay(ms: number) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async getSurveyStatistics(fromDate: Date, toDate: Date): Promise<SurveyStatisticsData> {
        await this.delay(500); // Simulate API delay
        
        return {
            total_surveys: 45,
            total_responses: 320,
            completed_surveys: 38,
            pending_surveys: 7,
            active_surveys: 25,
            expired_surveys: 13,
            average_rating: 4.2,
            response_rate: 78.5,
        };
    }

    async getSurveyStatus(fromDate: Date, toDate: Date): Promise<SurveyStatusData> {
        await this.delay(300);
        
        return {
            info: {
                total_active_surveys: 25,
                total_expired_surveys: 13,
                total_pending_surveys: 7,
            }
        };
    }

    async getSurveyDistribution(fromDate: Date, toDate: Date): Promise<SurveyDistributionData> {
        await this.delay(400);
        
        return {
            success: 1,
            message: 'Success',
            info: {
                info: 'Survey type distribution',
                total_feedback_surveys: 28,
                total_assessment_surveys: 17,
            },
            sites: [
                { site_name: 'Main Office', survey_count: 15 },
                { site_name: 'Branch A', survey_count: 12 },
                { site_name: 'Branch B', survey_count: 18 },
            ]
        };
    }

    async getTypeWiseSurveys(fromDate: Date, toDate: Date): Promise<TypeWiseSurveysData> {
        await this.delay(350);
        
        return {
            info: 'Type-wise survey distribution',
            type_wise_surveys: [
                { survey_type: 'Customer Feedback', survey_count: 28 },
                { survey_type: 'Employee Assessment', survey_count: 17 },
                { survey_type: 'Product Review', survey_count: 12 },
                { survey_type: 'Service Quality', survey_count: 8 },
            ]
        };
    }

    async getCategoryWiseSurveys(fromDate: Date, toDate: Date): Promise<CategoryWiseSurveysData> {
        await this.delay(400);
        
        return {
            categories: [
                { category_name: 'Satisfaction', survey_count: 25 },
                { category_name: 'Quality', survey_count: 18 },
                { category_name: 'Performance', survey_count: 15 },
                { category_name: 'Feedback', survey_count: 12 },
                { category_name: 'Assessment', survey_count: 8 },
            ]
        };
    }

    // Real API Integration
    async getRealSurveyAnalytics(): Promise<SurveyAnalyticsResponse> {
        try {
            const response = await fetch(`${API_CONFIG.BASE_URL}/pms/admin/snag_checklists/survey_details.json?analytics=true`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${API_CONFIG.TOKEN}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error fetching survey analytics:', error);
            // Return mock data as fallback
            return {
                analytics: {
                    total_surveys: 33,
                    total_responses: 754,
                    positive_responses: 663,
                    negative_responses: 58,
                    neutral_responses: 33,
                    complaints_count: 12,
                    top_surveys: [
                        {
                            survey_id: 12516,
                            survey_name: "multiple questions",
                            response_count: 447,
                            positive_responses: 418,
                            negative_responses: 28,
                            neutral_responses: 1,
                            complaints_count: 3
                        },
                        {
                            survey_id: 12519,
                            survey_name: "Testwwwwww",
                            response_count: 248,
                            positive_responses: 224,
                            negative_responses: 24,
                            neutral_responses: 0,
                            complaints_count: 2
                        },
                        {
                            survey_id: 12504,
                            survey_name: "New 1232",
                            response_count: 42,
                            positive_responses: 21,
                            negative_responses: 6,
                            neutral_responses: 15,
                            complaints_count: 4
                        }
                    ],
                    most_raised_category: {
                        category_key: "category_type_id:0",
                        category_label: "category_type_id:0",
                        complaint_count: 6
                    }
                }
            };
        }
    }
}

export const surveyAnalyticsAPI = new SurveyAnalyticsAPI();
