import {
    CalendarIcon,
    TrendingUp,
    FileText,
    Clipboard,
    Activity,
    Target,
    Star,
    MessageSquare,
    ChevronLeft,
    ChevronRight,
} from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { WinsAndPriorities } from './WinsAndPriorities';

interface ReportExpandedViewProps {
    report: any;
    activeTab: string;
    ratingsData: Record<number, any>;
    ratingsLoading: Record<number, boolean>;
    onTabChange: (tab: string) => void;
    onFetchRatings: (userId: number) => void;
}

export const ReportExpandedView = ({
    report,
    activeTab,
    ratingsData,
    ratingsLoading,
    onTabChange,
    onFetchRatings,
}: ReportExpandedViewProps) => {
    const tabs = [
        { label: 'Daily', count: 1, color: 'bg-[#4f46e5]', icon: CalendarIcon },
        { label: 'Weekly', count: 1, color: 'bg-[#4f46e5]', icon: TrendingUp },
        { label: 'Monthly', count: 0, color: 'bg-[#4f46e5]', icon: CalendarIcon },
        { label: 'Qtrly', count: 0, color: 'bg-[#4f46e5]', icon: CalendarIcon },
        { label: 'Other', count: 0, color: 'bg-[#9333ea]', icon: Activity },
        { label: 'Goals', count: 0, color: 'bg-[#475569]', icon: Target },
        { label: 'Task/Issues', count: 7, color: 'bg-[#475569]', icon: FileText },
        { label: 'SOPs', count: 1, color: 'bg-[#475569]', icon: Clipboard },
        { label: 'FB', count: ratingsData[report.user_id]?.summary?.received || 0, color: 'bg-[#475569]', icon: Star },
    ];

    return (
        <div className="mt-4 pt-4 border-t border-gray-100 space-y-6 animate-in fade-in slide-in-from-top-2 duration-300">
            <Tabs defaultValue={activeTab} onValueChange={onTabChange} className="w-full">
                <div className="flex items-center justify-center w-full">
                    <TabsList className="flex items-center justify-start gap-1.5 overflow-x-auto pb-2 bg-transparent h-auto w-full max-w-fit">
                        {tabs.map((tab) => (
                            <TabsTrigger
                                key={tab.label}
                                value={tab.label}
                                onClick={() => {
                                    if (tab.label === 'FB' && !ratingsData[report.user_id]) {
                                        onFetchRatings(report.user_id);
                                    }
                                }}
                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-[8px] font-bold transition-all whitespace-nowrap text-white shadow-sm data-[state=active]:bg-[#c21e1e] data-[state=active]:text-white ${tab.color} hover:opacity-90`}
                                style={{ fontSize: '11px' }}
                            >
                                <tab.icon className="w-3.5 h-3.5" />
                                {tab.label} <span className="ml-0.5 opacity-90">({tab.count})</span>
                            </TabsTrigger>
                        ))}
                    </TabsList>
                </div>

                <div className="mt-6">
                    <TabsContent value="Daily">
                        <DailyKPIsTable />
                    </TabsContent>

                    <TabsContent value="Weekly">
                        <WeeklyKPIsTable />
                    </TabsContent>

                    <TabsContent value="Monthly">
                        <EmptyTabContent title="Monthly KPIs" />
                    </TabsContent>

                    <TabsContent value="Qtrly">
                        <EmptyTabContent title="Quarterly KPIs" />
                    </TabsContent>

                    <TabsContent value="Other">
                        <EmptyTabContent title="Other KPIs" />
                    </TabsContent>

                    <TabsContent value="Goals">
                        <EmptyTabContent title="Goals" />
                    </TabsContent>

                    <TabsContent value="Task/Issues">
                        <TasksIssuesContent />
                    </TabsContent>

                    <TabsContent value="SOPs">
                        <EmptyTabContent title="SOPs" />
                    </TabsContent>

                    <TabsContent value="FB">
                        <FeedbackContent report={report} ratingsData={ratingsData} ratingsLoading={ratingsLoading} />
                    </TabsContent>
                </div>
            </Tabs>

            {/* Wins & Priorities Section */}
            <WinsAndPriorities report={report} />

            {/* Comments & Feedback Section */}
            <CommentsAndFeedback report={report} />
        </div>
    );
};

const DailyKPIsTable = () => (
    <div className="bg-white border border-blue-100 rounded-2xl overflow-hidden shadow-sm">
        <div className="bg-[#f0f2ff] p-3 flex items-center justify-between border-b border-blue-50">
            <div className="flex items-center gap-2 text-[#2d3282] font-bold" style={{ fontSize: '12px' }}>
                <CalendarIcon className="w-4 h-4" />
                Daily KPIs
            </div>
            <div className="flex items-center gap-3">
                <ChevronLeft className="w-3.5 h-3.5 text-[#2d3282] cursor-pointer" />
                <span className="font-bold text-[#2d3282]" style={{ fontSize: '12px' }}>
                    Week of Apr 6, 2026
                </span>
                <ChevronRight className="w-3.5 h-3.5 text-[#2d3282] cursor-pointer" />
            </div>
        </div>
        <div className="overflow-x-auto">
            <table className="w-full text-center border-collapse">
                <thead>
                    <tr className="text-[10px] font-bold">
                        <th className="px-4 py-2 text-left bg-gray-50 text-gray-700 border-b border-gray-100" style={{ fontSize: '12px' }}>
                            KPI
                        </th>
                        {['M', 'T', 'W', 'T'].map((d) => (
                            <th key={d} className="px-2 py-2 bg-[#22c55e] text-white border-r border-white/20">
                                {d}
                            </th>
                        ))}
                        {['F', 'S', 'S'].map((d) => (
                            <th key={d} className="px-2 py-2 bg-[#f87171] text-white border-r border-white/20">
                                {d}
                            </th>
                        ))}
                        <th className="px-4 py-2 bg-[#eef2ff] text-gray-700 border-b border-gray-100" style={{ fontSize: '12px' }}>
                            Target
                        </th>
                        <th className="px-4 py-2 bg-[#eef2ff] text-gray-700 border-b border-gray-100" style={{ fontSize: '12px' }}>
                            Actual
                        </th>
                        <th className="px-4 py-2 bg-[#eef2ff] text-gray-700 border-b border-gray-100" style={{ fontSize: '12px' }}>
                            Ach %
                        </th>
                    </tr>
                </thead>
                <tbody className="font-medium text-gray-700" style={{ fontSize: '12px' }}>
                    <tr className="border-b border-gray-50 hover:bg-gray-50/50">
                        <td className="px-4 py-3 text-left">
                            <div className="flex flex-col gap-1">
                                <span className="font-bold">new</span>
                                <span className="w-5 h-5 flex items-center justify-center bg-blue-50 text-blue-500 rounded-md shadow-sm" style={{ fontSize: '12px' }}>
                                    ₹
                                </span>
                            </div>
                        </td>
                        <td className="px-2 py-3 bg-[#f8fafc]">200</td>
                        <td className="px-2 py-3 bg-[#f8fafc]">0</td>
                        <td className="px-2 py-3 bg-[#f8fafc]">0</td>
                        <td className="px-2 py-3 bg-[#f8fafc]">0</td>
                        <td className="px-2 py-3 bg-[#f8fafc] text-gray-400">-</td>
                        <td className="px-2 py-3 bg-[#f8fafc] text-gray-400">-</td>
                        <td className="px-2 py-3 bg-[#f8fafc] text-gray-400">-</td>
                        <td className="px-4 py-3 font-bold bg-[#f8fafc]">120000</td>
                        <td className="px-4 py-3 font-bold bg-[#f8fafc]">200</td>
                        <td className="px-4 py-3 bg-[#f8fafc]">
                            <span className="bg-[#e11d48] text-white px-3 py-1 rounded-lg font-bold" style={{ fontSize: '10px' }}>
                                0%
                            </span>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
);

const WeeklyKPIsTable = () => (
    <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="bg-[#eef2ff] p-3 flex items-center justify-between border-b border-gray-100">
            <div className="flex items-center gap-2 text-[#2d3282] font-bold" style={{ fontSize: '12px' }}>
                <TrendingUp className="w-4 h-4" />
                Weekly KPIs
            </div>
            <div className="flex items-center gap-3">
                <ChevronLeft className="w-3.5 h-3.5 text-[#2d3282] cursor-pointer" />
                <span className="font-bold text-[#2d3282]" style={{ fontSize: '12px' }}>
                    April 2026
                </span>
                <ChevronRight className="w-3.5 h-3.5 text-[#2d3282] cursor-pointer" />
            </div>
        </div>
        <div className="overflow-x-auto">
            <table className="w-full text-center border-collapse">
                <thead>
                    <tr className="text-[10px] font-bold text-gray-700">
                        <th className="px-4 py-3 text-left bg-[#f8fafc] border-b border-gray-100 w-1/6">KPI</th>
                        <th className="px-3 py-3 bg-[#22c55e] text-white border-r border-white/20">
                            <div className="flex flex-col">
                                <span>Apr 6</span>
                                <span className="text-[9px]">W15</span>
                            </div>
                        </th>
                        <th className="px-3 py-3 bg-[#f8fafc] border-b border-gray-100 border-r">
                            <div className="flex flex-col">
                                <span>Apr 13</span>
                                <span className="text-[9px] text-gray-400">W16</span>
                            </div>
                        </th>
                        <th className="px-3 py-3 bg-[#f8fafc] border-b border-gray-100 border-r">
                            <div className="flex flex-col">
                                <span>Apr 20</span>
                                <span className="text-[9px] text-gray-400">W17</span>
                            </div>
                        </th>
                        <th className="px-3 py-3 bg-[#f8fafc] border-b border-gray-100 border-r">
                            <div className="flex flex-col">
                                <span>Apr 27</span>
                                <span className="text-[9px] text-gray-400">W18</span>
                            </div>
                        </th>
                        <th className="px-4 py-3 bg-[#f8fafc] border-b border-gray-100">Current Week Target</th>
                        <th className="px-4 py-3 bg-[#f8fafc] border-b border-gray-100">%</th>
                        <th className="px-4 py-3 bg-[#f8fafc] border-b border-gray-100">Month Total</th>
                    </tr>
                </thead>
                <tbody className="font-medium text-gray-700" style={{ fontSize: '12px' }}>
                    <tr className="border-b border-gray-50 hover:bg-gray-50/50">
                        <td className="px-4 py-3 text-left">
                            <div className="flex flex-col gap-1">
                                <span className="font-bold">new1</span>
                                <span className="w-5 h-5 flex items-center justify-center bg-gray-50 text-gray-500 rounded-md shadow-sm" style={{ fontSize: '12px' }}>
                                    ₹
                                </span>
                            </div>
                        </td>
                        <td className="px-3 py-3 bg-[#eff6ff] font-bold text-gray-800">1</td>
                        <td className="px-3 py-3 text-gray-400">-</td>
                        <td className="px-3 py-3 text-gray-400">-</td>
                        <td className="px-3 py-3 text-gray-400">-</td>
                        <td className="px-4 py-3 font-bold">1</td>
                        <td className="px-4 py-3">
                            <span className="bg-[#22c55e] text-white px-3 py-1 rounded-lg font-bold" style={{ fontSize: '10px' }}>
                                100%
                            </span>
                        </td>
                        <td className="px-4 py-3 font-bold">1</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
);

const TasksIssuesContent = () => (
    <div className="bg-white border border-blue-100 rounded-2xl overflow-hidden shadow-sm">
        <div className="bg-gray-50 p-4 border-b border-gray-100 flex items-center gap-2">
            <FileText className="w-4 h-4 text-gray-600" />
            <span className="font-bold text-gray-700" style={{ fontSize: '12px' }}>
                Tasks & Issues
            </span>
        </div>
        <div className="p-4 space-y-3 max-h-[400px] overflow-y-auto">
            <TaskCard title="Sales Crm - enhancement points and flow" priority="High" status="open" dueDate="Apr 15" completion="0%" color="orange" />
            <TaskCard title="business compass & admin compass UI + api" priority="Medium" status="open" dueDate="Apr 4" completion="0%" color="yellow" />
            <TaskCard title="Company hub chances UI + Api" priority="High" status="open" dueDate="Mar 31" completion="45%" color="orange" />
        </div>
    </div>
);

interface TaskCardProps {
    title: string;
    priority: string;
    status: string;
    dueDate: string;
    completion: string;
    color: 'orange' | 'yellow';
}

const TaskCard = ({ title, priority, status, dueDate, completion, color }: TaskCardProps) => {
    const bgColor = color === 'orange' ? 'bg-orange-50 border-orange-100' : 'bg-yellow-50 border-yellow-100';
    const badgeColor = color === 'orange' ? 'bg-orange-500' : 'bg-yellow-500';

    return (
        <div className={`border rounded-xl p-4 ${bgColor}`}>
            <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                    <p className="font-bold text-gray-800" style={{ fontSize: '12px' }}>
                        {title}
                    </p>
                </div>
                <span className={`${badgeColor} text-white px-2 py-0.5 rounded text-xs font-bold whitespace-nowrap ml-2`}>{priority}</span>
            </div>
            <div className="flex items-center gap-4 flex-wrap" style={{ fontSize: '11px' }}>
                <span className="bg-white border border-gray-300 px-2 py-1 rounded text-gray-700 font-medium">{status}</span>
                <span className="text-gray-600">Due: {dueDate}</span>
                <span className="text-gray-600">{completion} complete</span>
            </div>
        </div>
    );
};

interface FeedbackContentProps {
    report: any;
    ratingsData: Record<number, any>;
    ratingsLoading: Record<number, boolean>;
}

const FeedbackContent = ({ report, ratingsData, ratingsLoading }: FeedbackContentProps) => (
    <div className="bg-white border border-blue-100 rounded-2xl overflow-hidden shadow-sm">
        <div className="p-4">
            {ratingsLoading[report.user_id] ? (
                <div className="flex items-center justify-center py-8">
                    <p className="text-gray-500 font-medium">Loading feedback...</p>
                </div>
            ) : ratingsData[report.user_id]?.ratings && ratingsData[report.user_id].ratings.length > 0 ? (
                <div className="space-y-4">
                    <div className="flex items-center gap-2 pb-4 border-b border-gray-100">
                        <div className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-200">
                            <Star className="w-4 h-4 text-gray-600" />
                        </div>
                        <span className="font-bold text-gray-700" style={{ fontSize: '14px' }}>
                            Recent Feedback
                        </span>
                    </div>

                    <div className="space-y-4 max-h-[500px] overflow-y-auto pr-1">
                        {ratingsData[report.user_id].ratings.slice(0, 10).map((rating: any, idx: number) => (
                            <div key={idx} className="border border-blue-100 rounded-xl p-4 space-y-3 bg-white">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium text-gray-600">From: {rating.reviewer || 'operational'}</span>
                                    <div className="flex items-center gap-4">
                                        <div className="flex items-center gap-0.5">
                                            {[...Array(5)].map((_, i) => (
                                                <Star
                                                    key={i}
                                                    className={`w-4 h-4 ${i < (rating.score || 0) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200'}`}
                                                />
                                            ))}
                                        </div>
                                        <span className="text-xs text-gray-400 font-medium">
                                            {rating.created_at ? new Date(rating.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Apr 10, 2026'}
                                        </span>
                                    </div>
                                </div>

                                <div className="border border-blue-100 rounded-lg p-4 bg-[#f8faff]">
                                    <div className="flex items-center gap-1.5 text-blue-600 font-bold mb-2" style={{ fontSize: '12px' }}>
                                        <span className="text-blue-600">—</span>
                                        <span>Constructive Feedback</span>
                                    </div>
                                    <p className="text-sm text-gray-700 leading-relaxed">
                                        {rating.fields?.constructive_feedback || rating.reviews || 'No feedback content provided.'}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="pt-4 border-t border-gray-100 flex justify-center">
                        <a
                            href={`/business-compass/feedback`}
                            className="w-full text-center py-2 text-sm font-bold text-gray-900 hover:bg-gray-50 rounded-lg border border-gray-100 transition-colors"
                        >
                            View All Feedback
                        </a>
                    </div>
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-8">
                    <MessageSquare className="w-8 h-8 text-gray-300 mb-2" />
                    <p className="text-sm text-gray-500 font-medium">No feedback yet</p>
                </div>
            )}
        </div>
    </div>
);

const CommentsAndFeedback = ({ report }: any) => {
    const remarkStyles: Record<string, { bg: string; border: string; text: string; label: string }> = {
        breakthrough: { bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-900', label: 'Breakthrough' },
        breakdown: { bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-900', label: 'Breakdown' },
        employeeFeedback: { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-900', label: 'Employee Feedback' },
        clientFeedback: { bg: 'bg-purple-50', border: 'border-purple-200', text: 'text-purple-900', label: 'Client Feedback' },
        remark: { bg: 'bg-orange-50', border: 'border-orange-200', text: 'text-orange-900', label: 'Remark' },
    };

    return (
        <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between text-gray-600 font-bold" style={{ fontSize: '12px' }}>
                <div className="flex items-center gap-2">
                    <MessageSquare className="w-4 h-4" />
                    Comments & Feedback ({report.weekly_report?.report_data?.remarks?.length || 0})
                </div>
                <ChevronRight className="w-4 h-4" />
            </div>

            {report.weekly_report?.report_data?.remarks && report.weekly_report.report_data.remarks.length > 0 ? (
                report.weekly_report.report_data.remarks.map((remark: any, idx: number) => {
                    const remarkType = Object.keys(remark)[0];
                    const remarkValue = remark[remarkType];
                    const style = remarkStyles[remarkType] || {
                        bg: 'bg-gray-50',
                        border: 'border-gray-200',
                        text: 'text-gray-900',
                        label: remarkType,
                    };

                    return (
                        <div key={idx} className={`${style.bg} border ${style.border} rounded-2xl p-4 space-y-3`}>
                            <div className="space-y-2">
                                <div className={`inline-block px-2 py-1 bg-white border ${style.border} rounded-[5px] font-bold ${style.text} shadow-sm capitalize`} style={{ fontSize: '12px' }}>
                                    {style.label}
                                </div>
                                <p className={`font-medium ${style.text}`} style={{ fontSize: '12px' }}>
                                    {remarkValue}
                                </p>
                            </div>
                        </div>
                    );
                })
            ) : (
                <p className="text-gray-400 italic" style={{ fontSize: '12px' }}>
                    No feedback recorded
                </p>
            )}
        </div>
    );
};

const EmptyTabContent = ({ title }: { title: string }) => (
    <div className="bg-white border border-blue-100 rounded-2xl overflow-hidden shadow-sm p-4">
        <p className="text-gray-600 text-base">{title} content goes here</p>
    </div>
);
