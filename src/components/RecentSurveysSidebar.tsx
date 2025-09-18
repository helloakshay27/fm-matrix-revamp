import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, Users, ArrowRight, RefreshCw } from 'lucide-react';
import { ticketManagementAPI } from '../services/ticketManagementAPI';
import { toast } from 'sonner';

interface SurveyResponse {
    // option_id: number;
    question_id: number;
    question_name: string;
    option_id: number;
    option_name: string;
    option_type: string;
    created_at: string;
    complaints: Array<{
        complaint_id: number;
        ticket_number: string;
        heading: string;
        assigned_to: number;
        assignee: string;
        created_at: string;
    }>;
}

interface SurveyMapping {
    id: number;
    survey_id: number;
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
    responded_questions_count: number;
    responses: SurveyResponse[];
}

interface RecentSurvey {
    survey_id: number;
    survey_name: string;
    survey_mappings: SurveyMapping[];
}

export const RecentSurveysSidebar: React.FC = () => {
    const navigate = useNavigate();
    const [recentSurveys, setRecentSurveys] = useState<RecentSurvey[]>([]);
    const [isLoading, setIsLoading] = useState(false);


    const fetchRecentSurveys = async () => {
        setIsLoading(true);
        try {
            console.log('Fetching recent surveys...');
            const response = await ticketManagementAPI.getRecentSurveys();
            console.log('Recent surveys response:', response);
            
            if (response && response.surveys && Array.isArray(response.surveys)) {
                setRecentSurveys(response.surveys);
            } else {
                console.error('Invalid response format:', response);
                setRecentSurveys([]);
            }
        } catch (error) {
            console.error('Error fetching recent surveys:', error);
            toast.error('Failed to load recent surveys. Please try again.');
            setRecentSurveys([]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchRecentSurveys();
    }, []);

    const getResponseCount = (survey: RecentSurvey) => {
        if (!survey.survey_mappings || !Array.isArray(survey.survey_mappings)) {
            return 0;
        }
        return survey.survey_mappings.reduce((total, mapping) => {
            return total + (mapping.responded_questions_count || 0);
        }, 0);
    };

    const getTotalMappings = (survey: RecentSurvey) => {
        if (!survey.survey_mappings || !Array.isArray(survey.survey_mappings)) {
            return 0;
        }
        return survey.survey_mappings.length;
    };

    const getStatusColor = (responseCount: number, totalMappings: number) => {
        if (responseCount === 0) {
            return 'bg-orange-100 text-orange-700 border-orange-200'; // No responses
        } else if (responseCount < totalMappings) {
            return 'bg-blue-100 text-blue-700 border-blue-200'; // Partial responses
        } else {
            return 'bg-green-100 text-green-700 border-green-200'; // All responded
        }
    };

    const getStatusText = (responseCount: number, totalMappings: number) => {
        if (responseCount === 0) {
            return 'No Responses';
        } else if (responseCount < totalMappings) {
            return 'In Progress';
        } else {
            return 'Completed';
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
        
        if (diffInDays === 0) return 'Today';
        if (diffInDays === 1) return 'Yesterday';
        if (diffInDays < 7) return `${diffInDays} days ago`;
        return date.toLocaleDateString();
    };

    const getLastResponseDate = (survey: RecentSurvey) => {
        if (!survey.survey_mappings || !Array.isArray(survey.survey_mappings)) {
            return 'No responses yet';
        }
        
        let latestDate = null;
        
        survey.survey_mappings.forEach(mapping => {
            if (mapping.responses && Array.isArray(mapping.responses)) {
                mapping.responses.forEach(response => {
                    if (response.created_at) {
                        const responseDate = new Date(response.created_at);
                        if (!latestDate || responseDate > latestDate) {
                            latestDate = responseDate;
                        }
                    }
                });
            }
        });
        
        return latestDate ? latestDate.toLocaleDateString() : 'No responses yet';
    };

    const handleViewDetails = (surveyId: number) => {
        navigate(`/maintenance/survey/response/details/${surveyId}`);
    };

    return (
        <div className="w-full bg-[#C4B89D]/25 border-l border-gray-200 p-4 h-full xl:max-h-[1208px] overflow-hidden flex flex-col overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Recent Responses</h3>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={fetchRecentSurveys}
                    disabled={isLoading}
                    className="text-gray-500 hover:text-gray-700"
                >
                    <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                </Button>
            </div>

            {isLoading ? (
                <div className="space-y-4">
                    {[...Array(3)].map((_, index) => (
                        <div key={index} className="animate-pulse bg-[#C4B89D]/20 rounded-lg p-4">
                            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                            <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
                            <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                        </div>
                    ))}
                </div>
            ) : recentSurveys.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                    <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p className="text-sm">No recent surveys found</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {recentSurveys.map((survey) => {
                        const responseCount = getResponseCount(survey);
                        const totalMappings = getTotalMappings(survey);
                        const latestResponseDate = getLastResponseDate(survey);
                        
                        return (
                            <div
                                key={survey.survey_id}
                                className="bg-[#C4B89D]/20 rounded-lg p-4 shadow-sm border border-[#C4B89D] border-opacity-60 hover:shadow-md transition-shadow cursor-pointer group"
                            >
                                <div className="flex items-start justify-between mb-2">
                                    <h4 className="text-sm font-medium text-gray-900 line-clamp-2 group-hover:text-[#C72030] transition-colors">
                                        {survey.survey_name}
                                    </h4>
                                    <ArrowRight className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 ml-2" />
                                </div>

                                <div className="flex flex-wrap gap-2 mb-3">
                                    <Badge 
                                        variant="outline" 
                                        className={`text-xs ${getStatusColor(responseCount, totalMappings)}`}
                                    >
                                        {getStatusText(responseCount, totalMappings)}
                                    </Badge>
                                    <Badge 
                                        variant="outline" 
                                        className="text-xs bg-purple-100 text-purple-700 border-purple-200"
                                    >
                                        Survey
                                    </Badge>
                                </div>

                                <div className="space-y-2 text-xs text-gray-500">
                                    <div className="flex items-center gap-1">
                                        <Users className="w-3 h-3" />
                                        <span>{responseCount} responses from {totalMappings} locations</span>
                                    </div>
                                    {latestResponseDate && (
                                        <div className="flex items-center gap-1">
                                            <Clock className="w-3 h-3" />
                                            <span>Last response {formatDate(latestResponseDate)}</span>
                                        </div>
                                    )}
                                    <div className="text-xs text-gray-400">
                                        Survey ID: {survey.survey_id}
                                    </div>
                                </div>
                                <div className="mt-4 pt-3 border-t border-gray-200 border-opacity-60 flex justify-end">
                                    <button 
                                        className="text-blue-600 text-sm font-medium underline hover:text-blue-800" 
                                        onClick={() => handleViewDetails(survey.survey_id)}
                                    >
                                        View Details&gt;&gt;
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

           
        </div>
    );
};
