import {
    CalendarIcon,
    TrendingUp,
    FileText,
    Clipboard,
    Activity,
    Star,
    MessageSquare,
} from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { WinsAndPriorities } from './WinsAndPriorities';

interface KpiRow {
    name: string;
    target?: any;
    actual?: any;
    achievement?: any;
    total?: any;
    achieved?: any;
    period?: any;
    members?: any;
}

const getReportData = (report: any) => report.weekly_report?.report_data || report.report_data || {};

const getItemText = (item: any) => {
    if (typeof item === 'string') return item;
    if (item && typeof item === 'object') return item.title || item.text || item.name || JSON.stringify(item);
    return String(item ?? '');
};

const formatCell = (value: any) => {
    if (value === undefined || value === null || value === '') return '-';
    if (Array.isArray(value)) return value.map(getItemText).filter(Boolean).join(', ') || '-';
    if (typeof value === 'object') return getItemText(value);
    return String(value);
};

const normalizeKpiRow = (item: any, fallbackName = ''): KpiRow | null => {
    if (typeof item === 'string') return { name: item };
    if (!item || typeof item !== 'object') return null;

    const name = item.name || item.title || item.kpi || item.label || fallbackName;
    if (!name) return null;

    return {
        name: String(name),
        target: item.target ?? item.goal ?? item.expected,
        actual: item.actual ?? item.value ?? item.current ?? item.score,
        achievement: item.achievement ?? item.achievement_percentage ?? item.achieved_percentage ?? item.percent ?? item.percentage,
        total: item.total,
        achieved: item.achieved,
        period: item.period ?? item.week ?? item.month ?? item.date,
        members: item.names ?? item.members,
    };
};

const rowsFromSource = (source: any): KpiRow[] => {
    if (!source) return [];

    if (Array.isArray(source)) {
        return source.map((item) => normalizeKpiRow(item)).filter(Boolean) as KpiRow[];
    }

    if (typeof source === 'string') {
        return [{ name: source }];
    }

    if (typeof source === 'object') {
        return Object.entries(source)
            .map(([key, value]) => normalizeKpiRow(value, key))
            .filter(Boolean) as KpiRow[];
    }

    return [];
};

const getKpiRows = (reportData: any, type: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'other') => {
    const sections = reportData.sections || {};

    const sourceByType: Record<string, any[]> = {
        daily: [reportData.daily_kpis, reportData.daily_kpi, reportData.kpis?.daily],
        weekly: [reportData.weekly_kpis, reportData.weekly_kpi, reportData.kpi_summary, reportData.kpis?.weekly, reportData.kpi],
        monthly: [reportData.monthly_kpis, reportData.monthly_kpi, reportData.kpis?.monthly],
        quarterly: [reportData.quarterly_kpis, reportData.qtrly_kpis, reportData.kpis?.quarterly],
        other: [reportData.other_kpis, reportData.other_kpi, reportData.kpis?.other],
    };

    const rows = sourceByType[type].flatMap(rowsFromSource);

    if (type === 'daily' && sections.daily_kpi_achievement !== undefined && rows.length === 0) {
        rows.push({ name: 'Daily KPI Achievement', achievement: sections.daily_kpi_achievement });
    }

    if (type === 'weekly' && sections.weekly_kpi_achievement !== undefined && rows.length === 0) {
        rows.push({ name: 'Weekly KPI Achievement', achievement: sections.weekly_kpi_achievement });
    }

    return rows;
};

const getFeedbackList = (ratingsData: Record<number, any>, userId: number) => {
    const data = ratingsData[userId];
    const list = Array.isArray(data) ? data : data?.data || data?.ratings || [];
    return Array.isArray(list)
        ? [...list].sort((a: any, b: any) => new Date(b?.created_at || 0).getTime() - new Date(a?.created_at || 0).getTime())
        : [];
};

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
    const reportData = getReportData(report);
    const feedbackList = getFeedbackList(ratingsData, report.user_id);
    const tasksIssues = Array.isArray(reportData.tasks_issues) ? reportData.tasks_issues : [];
    const remarks = Array.isArray(reportData.remarks) ? reportData.remarks : [];
    const sections = reportData.sections || {};
    const dailyRows = getKpiRows(reportData, 'daily');
    const weeklyRows = getKpiRows(reportData, 'weekly');
    const monthlyRows = getKpiRows(reportData, 'monthly');
    const quarterlyRows = getKpiRows(reportData, 'quarterly');
    const otherRows = getKpiRows(reportData, 'other');
    const hasSopScore = sections.sop_health !== undefined && sections.sop_health !== null;

    const tabs = [
        { label: 'Daily', count: dailyRows.length, color: 'bg-[#4f46e5]', icon: CalendarIcon },
        { label: 'Weekly', count: weeklyRows.length, color: 'bg-[#4f46e5]', icon: TrendingUp },
        { label: 'Monthly', count: monthlyRows.length, color: 'bg-[#4f46e5]', icon: CalendarIcon },
        { label: 'Qtrly', count: quarterlyRows.length, color: 'bg-[#4f46e5]', icon: CalendarIcon },
        { label: 'Other', count: otherRows.length, color: 'bg-[#9333ea]', icon: Activity },
        { label: 'Task/Issues', count: tasksIssues.length, color: 'bg-[#475569]', icon: FileText },
        { label: 'SOPs', count: hasSopScore ? 1 : 0, color: 'bg-[#475569]', icon: Clipboard },
        { label: 'FB', count: feedbackList.length, color: 'bg-[#475569]', icon: Star },
    ];

    return (
        <div className="mt-4 space-y-5 border-t border-slate-100 pt-4 animate-in fade-in slide-in-from-top-2 duration-300 min-w-0 max-w-full overflow-hidden">
            <Tabs defaultValue={activeTab} onValueChange={onTabChange} className="w-full">
                <div className="flex items-center justify-center w-full">
                    <TabsList className="flex flex-wrap items-center justify-center gap-2 rounded-2xl border border-slate-100 bg-slate-50/80 p-2 h-auto w-full">
                        {tabs.map((tab) => (
                            <TabsTrigger
                                key={tab.label}
                                value={tab.label}
                                onClick={() => {
                                    if (tab.label === 'FB' && !ratingsData[report.user_id]) {
                                        onFetchRatings(report.user_id);
                                    }
                                }}
                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold transition-all whitespace-nowrap text-white shadow-sm data-[state=active]:bg-[#c21e1e] data-[state=active]:text-white data-[state=active]:shadow-md ${tab.color} hover:opacity-90`}
                                style={{ fontSize: '11px' }}
                            >
                                <tab.icon className="w-3.5 h-3.5" />
                                {tab.label} <span className="ml-0.5 opacity-90">({tab.count})</span>
                            </TabsTrigger>
                        ))}
                    </TabsList>
                </div>

                <div className="mt-4">
                    <TabsContent value="Daily">
                        <KpiTable title="Daily KPIs" icon={CalendarIcon} rows={dailyRows} emptyText="No daily KPIs recorded" />
                    </TabsContent>

                    <TabsContent value="Weekly">
                        <KpiTable title="Weekly KPIs" icon={TrendingUp} rows={weeklyRows} emptyText="No weekly KPIs recorded" />
                    </TabsContent>

                    <TabsContent value="Monthly">
                        <KpiTable title="Monthly KPIs" icon={CalendarIcon} rows={monthlyRows} emptyText="No monthly KPIs recorded" />
                    </TabsContent>

                    <TabsContent value="Qtrly">
                        <KpiTable title="Quarterly KPIs" icon={CalendarIcon} rows={quarterlyRows} emptyText="No quarterly KPIs recorded" />
                    </TabsContent>

                    <TabsContent value="Other">
                        <KpiTable title="Other KPIs" icon={Activity} rows={otherRows} emptyText="No other KPIs recorded" />
                    </TabsContent>

                    <TabsContent value="Task/Issues">
                        <TasksIssuesContent items={tasksIssues} />
                    </TabsContent>

                    <TabsContent value="SOPs">
                        <SopsContent sections={sections} />
                    </TabsContent>

                    <TabsContent value="FB">
                        <FeedbackContent report={report} ratingsData={ratingsData} ratingsLoading={ratingsLoading} />
                    </TabsContent>
                </div>
            </Tabs>

            <WinsAndPriorities report={report} />

            <CommentsAndFeedback report={report} remarks={remarks} />
        </div>
    );
};

const KpiTable = ({
    title,
    icon: Icon,
    rows,
    emptyText,
}: {
    title: string;
    icon: typeof CalendarIcon;
    rows: KpiRow[];
    emptyText: string;
}) => (
    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm min-w-0">
        <div className="bg-slate-50 p-3 flex items-center gap-2 text-slate-800 font-black border-b border-slate-100" style={{ fontSize: '12px' }}>
            <Icon className="w-4 h-4" />
            {title}
        </div>
        <div className="overflow-x-auto">
            {rows.length > 0 ? (
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="text-[10px] font-black uppercase tracking-wide text-slate-500">
                            <th className="px-4 py-3 bg-slate-50 border-b border-slate-100">KPI</th>
                            <th className="px-4 py-3 bg-slate-50 border-b border-slate-100">Target</th>
                            <th className="px-4 py-3 bg-slate-50 border-b border-slate-100">Actual</th>
                            <th className="px-4 py-3 bg-slate-50 border-b border-slate-100">Achieved</th>
                            <th className="px-4 py-3 bg-slate-50 border-b border-slate-100">Period</th>
                            <th className="px-4 py-3 bg-slate-50 border-b border-slate-100">Members</th>
                        </tr>
                    </thead>
                    <tbody className="font-semibold text-slate-700" style={{ fontSize: '12px' }}>
                        {rows.map((row, idx) => (
                            <tr key={`${row.name}-${idx}`} className="border-b border-slate-50 hover:bg-slate-50/70">
                                <td className="px-4 py-3 font-black break-words text-slate-900">{row.name}</td>
                                <td className="px-4 py-3">{formatCell(row.target ?? row.total)}</td>
                                <td className="px-4 py-3">{formatCell(row.actual ?? row.achieved)}</td>
                                <td className="px-4 py-3">{formatCell(row.achievement)}</td>
                                <td className="px-4 py-3">{formatCell(row.period)}</td>
                                <td className="px-4 py-3">{formatCell(row.members)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <div className="p-5 text-sm font-semibold text-slate-400">{emptyText}</div>
            )}
        </div>
    </div>
);

const TasksIssuesContent = ({ items }: { items: any[] }) => (
    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm min-w-0">
        <div className="bg-slate-50 p-4 border-b border-slate-100 flex items-center gap-2">
            <FileText className="w-4 h-4 text-slate-600" />
            <span className="font-black text-slate-700" style={{ fontSize: '12px' }}>
                Tasks & Issues
            </span>
        </div>
        <div className="p-4 space-y-3 max-h-[400px] overflow-y-auto min-w-0">
            {items.length > 0 ? (
                items.map((item, idx) => (
                    <TaskCard
                        key={item.id ?? idx}
                        title={getItemText(item)}
                        priority={item.priority || item.priority_level || '-'}
                        status={item.status || '-'}
                        dueDate={item.due_date || item.target_date || item.created_at || '-'}
                        completion={item.completion || item.completion_percentage || '-'}
                        color={(item.priority || '').toLowerCase() === 'high' ? 'orange' : 'yellow'}
                    />
                ))
            ) : (
                <p className="text-sm font-semibold text-slate-400">No tasks or issues recorded</p>
            )}
        </div>
    </div>
);

const SopsContent = ({ sections }: { sections: any }) => (
    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm p-4 min-w-0">
        <div className="flex items-center gap-2 text-slate-700 font-black mb-3" style={{ fontSize: '12px' }}>
            <Clipboard className="w-4 h-4" />
            SOP Health
        </div>
        <div className="rounded-xl bg-slate-50 border border-slate-100 p-4">
            {sections?.sop_health !== undefined && sections?.sop_health !== null ? (
                <>
                    <p className="text-sm font-black text-slate-900">{sections.sop_health}</p>
                    <p className="text-xs text-gray-500 mt-1">Score from weekly report sections</p>
                </>
            ) : (
                <p className="text-sm font-semibold text-slate-400">No SOP score recorded</p>
            )}
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
        <div className={`border rounded-xl p-4 ${bgColor} min-w-0 shadow-sm`}>
            <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                    <p className="font-black text-slate-800" style={{ fontSize: '12px' }}>
                        <span className="break-words">{title}</span>
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

const FeedbackContent = ({ report, ratingsData, ratingsLoading }: FeedbackContentProps) => {
    const feedbackList = getFeedbackList(ratingsData, report.user_id);

    return (
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm min-w-0">
            <div className="p-4">
                {ratingsLoading[report.user_id] ? (
                    <div className="flex items-center justify-center py-8">
                        <p className="text-gray-500 font-medium">Loading feedback...</p>
                    </div>
                ) : feedbackList.length > 0 ? (
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 pb-4 border-b border-slate-100">
                            <div className="w-8 h-8 flex items-center justify-center rounded-full border border-slate-200 bg-slate-50">
                                <Star className="w-4 h-4 text-slate-600" />
                            </div>
                            <span className="font-black text-slate-700" style={{ fontSize: '14px' }}>
                                Recent Feedback
                            </span>
                        </div>

                        <div className="space-y-4 max-h-[500px] overflow-y-auto pr-1">
                            {feedbackList.slice(0, 10).map((rating: any, idx: number) => (
                                <div key={rating.id ?? idx} className="border border-slate-200 rounded-xl p-4 space-y-3 bg-white min-w-0 shadow-sm">
                                    <div className="flex flex-wrap items-center justify-between gap-2">
                                        <span className="text-sm font-medium text-gray-600">From: {rating.reviewer || rating.reviewer_name || 'Unknown reviewer'}</span>
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
                                                {rating.created_at ? new Date(rating.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Date unavailable'}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="border border-blue-100 rounded-lg p-4 bg-[#f8faff]">
                                        <div className="flex items-center gap-1.5 text-blue-600 font-black mb-2" style={{ fontSize: '12px' }}>
                                            <span>Constructive Feedback</span>
                                        </div>
                                        <p className="text-sm text-gray-700 leading-relaxed break-words">
                                            {rating.fields?.constructive_feedback || rating.reviews || 'No feedback content provided.'}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="pt-4 border-t border-gray-100 flex justify-center">
                            <a
                                href="/business-compass/feedback"
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
};

const CommentsAndFeedback = ({ remarks }: any) => {
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
                    Comments & Feedback ({remarks?.length || 0})
                </div>
            </div>

            {remarks && remarks.length > 0 ? (
                remarks.map((remark: any, idx: number) => {
                    const isObjectRemark = remark && typeof remark === 'object' && !Array.isArray(remark);
                    const remarkType = isObjectRemark ? Object.keys(remark)[0] : 'remark';
                    const remarkValue = isObjectRemark ? remark[remarkType] : remark;
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
                                <p className={`font-medium ${style.text} break-words`} style={{ fontSize: '12px' }}>
                                    {getItemText(remarkValue)}
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
