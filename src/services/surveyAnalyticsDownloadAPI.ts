// Mock Survey Analytics Download API
class SurveyAnalyticsDownloadAPI {
    // Mock delay function
    private delay(ms: number) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // Mock file download function
    private downloadFile(filename: string, data: any) {
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
    }

    async downloadTypeWiseSurveysData(fromDate: Date, toDate: Date): Promise<void> {
        await this.delay(1000);
        
        const data = {
            report_title: 'Type-wise Surveys Report',
            date_range: {
                from: fromDate.toISOString().split('T')[0],
                to: toDate.toISOString().split('T')[0]
            },
            data: [
                { survey_type: 'Customer Feedback', survey_count: 28 },
                { survey_type: 'Employee Assessment', survey_count: 17 },
                { survey_type: 'Product Review', survey_count: 12 },
                { survey_type: 'Service Quality', survey_count: 8 },
            ],
            generated_at: new Date().toISOString()
        };

        this.downloadFile('type-wise-surveys-report.json', data);
    }

    async downloadCategoryWiseSurveysData(fromDate: Date, toDate: Date): Promise<void> {
        await this.delay(1000);
        
        const data = {
            report_title: 'Category-wise Surveys Report',
            date_range: {
                from: fromDate.toISOString().split('T')[0],
                to: toDate.toISOString().split('T')[0]
            },
            data: [
                { category_name: 'Satisfaction', survey_count: 25 },
                { category_name: 'Quality', survey_count: 18 },
                { category_name: 'Performance', survey_count: 15 },
                { category_name: 'Feedback', survey_count: 12 },
                { category_name: 'Assessment', survey_count: 8 },
            ],
            generated_at: new Date().toISOString()
        };

        this.downloadFile('category-wise-surveys-report.json', data);
    }

    async downloadSurveyDistributionsData(fromDate: Date, toDate: Date): Promise<void> {
        await this.delay(1000);
        
        const data = {
            report_title: 'Survey Distributions Report',
            date_range: {
                from: fromDate.toISOString().split('T')[0],
                to: toDate.toISOString().split('T')[0]
            },
            data: {
                total_feedback_surveys: 28,
                total_assessment_surveys: 17,
                sites: [
                    { site_name: 'Main Office', survey_count: 15 },
                    { site_name: 'Branch A', survey_count: 12 },
                    { site_name: 'Branch B', survey_count: 18 },
                ]
            },
            generated_at: new Date().toISOString()
        };

        this.downloadFile('survey-distributions-report.json', data);
    }

    async downloadSurveyResponsesData(fromDate: Date, toDate: Date): Promise<void> {
        await this.delay(1000);
        
        const data = {
            report_title: 'Survey Responses Report',
            date_range: {
                from: fromDate.toISOString().split('T')[0],
                to: toDate.toISOString().split('T')[0]
            },
            data: {
                total_active_surveys: 25,
                total_expired_surveys: 13,
                total_pending_surveys: 7,
                total_responses: 320,
                average_rating: 4.2,
                response_rate: 78.5
            },
            generated_at: new Date().toISOString()
        };

        this.downloadFile('survey-responses-report.json', data);
    }

    async downloadSurveyStatisticsData(fromDate: Date, toDate: Date): Promise<void> {
        await this.delay(1000);
        
        const data = {
            report_title: 'Survey Statistics Report',
            date_range: {
                from: fromDate.toISOString().split('T')[0],
                to: toDate.toISOString().split('T')[0]
            },
            data: {
                total_surveys: 45,
                total_responses: 320,
                completed_surveys: 38,
                pending_surveys: 7,
                active_surveys: 25,
                expired_surveys: 13,
                average_rating: 4.2,
                response_rate: 78.5
            },
            generated_at: new Date().toISOString()
        };

        this.downloadFile('survey-statistics-report.json', data);
    }
}

export const surveyAnalyticsDownloadAPI = new SurveyAnalyticsDownloadAPI();
