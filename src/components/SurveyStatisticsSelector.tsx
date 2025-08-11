import React from 'react';
import { Download, TrendingUp, Users, CheckCircle, Clock, Star, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SurveyStatisticsSelectorProps {
    dateRange: {
        startDate: Date;
        endDate: Date;
    };
    onDownload: (type: string) => void;
    layout?: 'grid' | 'horizontal' | 'vertical';
}

export const SurveyStatisticsSelector: React.FC<SurveyStatisticsSelectorProps> = ({
    dateRange,
    onDownload,
    layout = 'grid'
}) => {
    // Mock statistics data - replace with actual data from props or API
    const statistics = {
        total_surveys: 45,
        total_responses: 320,
        completed_surveys: 38,
        pending_surveys: 7,
        active_surveys: 25,
        expired_surveys: 13,
        average_rating: 4.2,
        response_rate: 78.5,
    };

    const cards = [
        {
            title: 'Total Surveys',
            value: statistics.total_surveys,
            icon: BarChart3,
            color: 'bg-blue-50 text-blue-600',
            bgColor: 'bg-blue-500',
        },
        {
            title: 'Total Responses',
            value: statistics.total_responses,
            icon: Users,
            color: 'bg-green-50 text-green-600',
            bgColor: 'bg-green-500',
        },
        {
            title: 'Completed',
            value: statistics.completed_surveys,
            icon: CheckCircle,
            color: 'bg-emerald-50 text-emerald-600',
            bgColor: 'bg-emerald-500',
        },
        {
            title: 'Pending',
            value: statistics.pending_surveys,
            icon: Clock,
            color: 'bg-orange-50 text-orange-600',
            bgColor: 'bg-orange-500',
        },
        {
            title: 'Active',
            value: statistics.active_surveys,
            icon: TrendingUp,
            color: 'bg-purple-50 text-purple-600',
            bgColor: 'bg-purple-500',
        },
        {
            title: 'Average Rating',
            value: `${statistics.average_rating}/5`,
            icon: Star,
            color: 'bg-yellow-50 text-yellow-600',
            bgColor: 'bg-yellow-500',
        },
    ];

    const getLayoutClass = () => {
        switch (layout) {
            case 'horizontal':
                return 'flex flex-wrap gap-4';
            case 'vertical':
                return 'space-y-4';
            default:
                return 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4';
        }
    };

    return (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Survey Statistics</h3>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onDownload('statistics')}
                    className="flex items-center gap-2"
                >
                    <Download className="w-4 h-4" />
                    Download
                </Button>
            </div>

            <div className={getLayoutClass()}>
                {cards.map((card, index) => {
                    const IconComponent = card.icon;
                    return (
                        <div
                            key={index}
                            className="bg-[#F6F4EE] p-4 rounded-lg flex items-center space-x-3"
                        >
                            <div className="relative w-12 h-12 flex items-center justify-center flex-shrink-0">
                                <div className="absolute inset-0 bg-[#C72030] opacity-10 rounded-full"></div>
                                <div className="relative w-8 h-8 bg-[#C72030] rounded-full flex items-center justify-center">
                                    <IconComponent className="w-4 h-4 text-white" />
                                </div>
                            </div>
                            <div className="min-w-0">
                                <div className="text-xl sm:text-2xl font-bold text-[#C72030]">
                                    {typeof card.value === 'number' ? card.value.toLocaleString() : card.value}
                                </div>
                                <div className="text-sm text-gray-600 truncate">{card.title}</div>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="mt-4 text-sm text-gray-500 text-center">
                Data from {dateRange.startDate.toLocaleDateString()} to {dateRange.endDate.toLocaleDateString()}
            </div>
        </div>
    );
};
