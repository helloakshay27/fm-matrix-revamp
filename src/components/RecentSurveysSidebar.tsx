import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, Users, ArrowRight, RefreshCw } from 'lucide-react';

interface RecentSurvey {
    id: number;
    title: string;
    type: 'feedback' | 'assessment' | 'review';
    responses: number;
    status: 'active' | 'expired' | 'pending';
    createdAt: Date;
    expiryDate?: Date;
}

export const RecentSurveysSidebar: React.FC = () => {
    const [recentSurveys, setRecentSurveys] = useState<RecentSurvey[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    // Mock data - replace with actual API call
    const mockSurveys: RecentSurvey[] = [
        {
            id: 1,
            title: 'Customer Satisfaction Q4 2024',
            type: 'feedback',
            responses: 45,
            status: 'active',
            createdAt: new Date('2024-12-01'),
            expiryDate: new Date('2024-12-31'),
        },
        {
            id: 2,
            title: 'Employee Performance Review',
            type: 'assessment',
            responses: 23,
            status: 'active',
            createdAt: new Date('2024-11-28'),
            expiryDate: new Date('2024-12-15'),
        },
        {
            id: 3,
            title: 'Product Feedback Survey',
            type: 'review',
            responses: 67,
            status: 'expired',
            createdAt: new Date('2024-11-15'),
            expiryDate: new Date('2024-11-30'),
        },
        {
            id: 4,
            title: 'Service Quality Assessment',
            type: 'feedback',
            responses: 12,
            status: 'pending',
            createdAt: new Date('2024-12-05'),
            expiryDate: new Date('2024-12-20'),
        },
        {
            id: 5,
            title: 'Training Effectiveness Survey',
            type: 'assessment',
            responses: 38,
            status: 'active',
            createdAt: new Date('2024-11-20'),
            expiryDate: new Date('2024-12-10'),
        },
    ];

    const fetchRecentSurveys = async () => {
        setIsLoading(true);
        try {
            // Simulate API call delay
            await new Promise(resolve => setTimeout(resolve, 1000));
            setRecentSurveys(mockSurveys);
        } catch (error) {
            console.error('Error fetching recent surveys:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchRecentSurveys();
    }, []);

    const getStatusColor = (status: RecentSurvey['status']) => {
        switch (status) {
            case 'active':
                return 'bg-green-100 text-green-700 border-green-200';
            case 'expired':
                return 'bg-red-100 text-red-700 border-red-200';
            case 'pending':
                return 'bg-orange-100 text-orange-700 border-orange-200';
            default:
                return 'bg-gray-100 text-gray-700 border-gray-200';
        }
    };

    const getTypeColor = (type: RecentSurvey['type']) => {
        switch (type) {
            case 'feedback':
                return 'bg-blue-100 text-blue-700';
            case 'assessment':
                return 'bg-purple-100 text-purple-700';
            case 'review':
                return 'bg-yellow-100 text-yellow-700';
            default:
                return 'bg-gray-100 text-gray-700';
        }
    };

    const formatDate = (date: Date) => {
        const now = new Date();
        const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
        
        if (diffInDays === 0) return 'Today';
        if (diffInDays === 1) return 'Yesterday';
        if (diffInDays < 7) return `${diffInDays} days ago`;
        return date.toLocaleDateString();
    };

    const getDaysUntilExpiry = (expiryDate?: Date) => {
        if (!expiryDate) return null;
        const now = new Date();
        const diffInDays = Math.ceil((expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
        return diffInDays;
    };

    return (
        <div className="bg-white rounded-lg border border-gray-200 p-6 h-fit">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Recent Surveys</h3>
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
                        <div key={index} className="animate-pulse">
                            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                            <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
                            <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="space-y-4">
                    {recentSurveys.map((survey) => {
                        const daysUntilExpiry = getDaysUntilExpiry(survey.expiryDate);
                        return (
                            <div
                                key={survey.id}
                                className="p-4 border border-gray-200 rounded-lg hover:shadow-sm transition-shadow cursor-pointer group"
                            >
                                <div className="flex items-start justify-between mb-2">
                                    <h4 className="text-sm font-medium text-gray-900 line-clamp-2 group-hover:text-[#C72030] transition-colors">
                                        {survey.title}
                                    </h4>
                                    <ArrowRight className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 ml-2" />
                                </div>

                                <div className="flex flex-wrap gap-2 mb-3">
                                    <Badge 
                                        variant="outline" 
                                        className={`text-xs ${getStatusColor(survey.status)}`}
                                    >
                                        {survey.status}
                                    </Badge>
                                    <Badge 
                                        variant="outline" 
                                        className={`text-xs ${getTypeColor(survey.type)}`}
                                    >
                                        {survey.type}
                                    </Badge>
                                </div>

                                <div className="space-y-2 text-xs text-gray-500">
                                    <div className="flex items-center gap-1">
                                        <Users className="w-3 h-3" />
                                        <span>{survey.responses} responses</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Clock className="w-3 h-3" />
                                        <span>Created {formatDate(survey.createdAt)}</span>
                                    </div>
                                    {daysUntilExpiry !== null && (
                                        <div className="flex items-center gap-1">
                                            <Clock className="w-3 h-3" />
                                            <span>
                                                {daysUntilExpiry > 0 
                                                    ? `Expires in ${daysUntilExpiry} days`
                                                    : daysUntilExpiry === 0 
                                                    ? 'Expires today'
                                                    : 'Expired'
                                                }
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            <div className="mt-6 pt-4 border-t border-gray-200">
                <Button
                    variant="outline"
                    className="w-full text-sm"
                    onClick={() => {/* Navigate to all surveys */}}
                >
                    View All Surveys
                </Button>
            </div>
        </div>
    );
};
