import React from 'react';
import { Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

interface ChartData {
    name: string;
    value: number;
    color?: string;
}

interface SurveyAnalyticsCardProps {
    title: string;
    type: 'statusDistribution' | 'surveyDistributions' | 'categoryWise' | 'typeWise';
    data: ChartData[];
    dateRange: {
        startDate: Date;
        endDate: Date;
    };
    onDownload: () => void;
}

const COLORS = ['#C72030', '#c6b692', '#d8dcdd', '#8B5CF6', '#10B981', '#F59E0B', '#EF4444', '#3B82F6'];

export const SurveyAnalyticsCard: React.FC<SurveyAnalyticsCardProps> = ({
    title,
    type,
    data,
    dateRange,
    onDownload,
}) => {
    // Validate and clean data
    const validData = data.filter(item => item.value > 0 && item.name && item.name !== 'No Data' && item.name !== 'No Data Available');
    const hasValidData = validData.length > 0;

    console.log(`[${title}] Data:`, data);
    console.log(`[${title}] Valid Data:`, validData);
    console.log(`[${title}] Has Valid Data:`, hasValidData);

    const renderChart = () => {
        const chartData = hasValidData ? validData : data;
        
        // For small datasets, use pie chart
        if (chartData.length <= 4 && (type === 'statusDistribution' || type === 'surveyDistributions')) {
            return (
                <div className="w-full">
                    <ResponsiveContainer width="100%" height={350}>
                        <PieChart>
                            <Pie
                                data={chartData}
                                cx="50%"
                                cy="50%"
                                labelLine={true}
                                label={({ name, percent, value }) => `${name}: ${value} (${(percent * 100).toFixed(0)}%)`}
                                outerRadius={100}
                                innerRadius={30}
                                fill="#8884d8"
                                dataKey="value"
                                stroke="#fff"
                                strokeWidth={2}
                            >
                                {chartData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color || COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip 
                                formatter={(value, name) => [value, name]}
                                labelStyle={{ color: '#374151' }}
                                contentStyle={{ 
                                    backgroundColor: '#fff', 
                                    border: '1px solid #e5e7eb',
                                    borderRadius: '8px',
                                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                                }}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            );
        }

        // For larger datasets, use bar chart
        return (
            <div className="w-full">
                <ResponsiveContainer width="100%" height={350}>
                    <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis 
                            dataKey="name" 
                            tick={{ fontSize: 12, fill: '#6b7280' }}
                            angle={-45}
                            textAnchor="end"
                            height={80}
                            stroke="#9ca3af"
                        />
                        <YAxis 
                            tick={{ fontSize: 12, fill: '#6b7280' }}
                            stroke="#9ca3af"
                        />
                        <Tooltip 
                            formatter={(value, name) => [value, 'Count']}
                            labelStyle={{ color: '#374151' }}
                            contentStyle={{ 
                                backgroundColor: '#fff', 
                                border: '1px solid #e5e7eb',
                                borderRadius: '8px',
                                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                            }}
                        />
                        <Bar 
                            dataKey="value" 
                            fill="#C72030" 
                            radius={[4, 4, 0, 0]}
                            stroke="#fff"
                            strokeWidth={1}
                        />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        );
    };

    const getTotalValue = () => {
        const dataToUse = hasValidData ? validData : data;
        return dataToUse.reduce((sum, item) => sum + item.value, 0);
    };

    return (
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200 p-6">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
                    <p className="text-sm text-gray-500 mt-1">
                        Total: {getTotalValue().toLocaleString()}
                    </p>
                </div>
                {/* <Button
                    variant="outline"
                    size="sm"
                    onClick={onDownload}
                    className="flex items-center gap-2 download-btn"
                >
                    <Download className="w-4 h-4" />
                    Download
                </Button> */}
            </div>

            {hasValidData ? (
                <div className="space-y-4">
                    {renderChart()}
                    
                    {/* Legend for pie charts */}
                    {validData.length <= 4 && (type === 'statusDistribution' || type === 'surveyDistributions') && (
                        <div className="grid grid-cols-2 gap-3 mt-6 p-4 bg-gray-50 rounded-lg">
                            {validData.map((entry, index) => (
                                <div key={entry.name} className="flex items-center gap-3">
                                    <div
                                        className="w-4 h-4 rounded-full border-2 border-white shadow-sm"
                                        style={{ backgroundColor: entry.color || COLORS[index % COLORS.length] }}
                                    />
                                    <div className="flex-1 min-w-0">
                                        <span className="text-sm font-medium text-gray-900">{entry.name}</span>
                                        <div className="text-xs text-gray-500">{entry.value.toLocaleString()}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            ) : (
                <div className="flex items-center justify-center h-64 bg-gray-50 rounded-lg">
                    <div className="text-center">
                        <div className="text-gray-400 mb-2">
                            <svg
                                className="w-12 h-12 mx-auto"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                                />
                            </svg>
                        </div>
                        <p className="text-gray-500 text-sm">No data available</p>
                        <p className="text-gray-400 text-xs mt-1">
                            Try adjusting your date range or filters
                        </p>
                    </div>
                </div>
            )}

            <div className="mt-4 text-sm text-gray-500 text-center">
                Data from {dateRange.startDate.toLocaleDateString()} to {dateRange.endDate.toLocaleDateString()}
            </div>
        </div>
    );
};
