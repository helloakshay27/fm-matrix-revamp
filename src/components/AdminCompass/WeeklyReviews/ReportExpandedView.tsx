import { useState } from 'react';
import {
    CalendarIcon,
    TrendingUp,
    FileText,
    Clipboard,
    Star,
    MessageSquare,
    Eye,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import TodoDetailsModal from '@/components/TodoDetailsModal';
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

const getBaseUrl = () => {
    const rawBase = localStorage.getItem('baseUrl') || '';
    if (!rawBase) return '';
    return rawBase.startsWith('http://') || rawBase.startsWith('https://') ? rawBase.replace(/\/$/, '') : `https://${rawBase.replace(/\/$/, '')}`;
};

const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
        Accept: 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
};

const normalizeStatus = (status: any) => String(status || 'open').toLowerCase().replace(/\s+/g, '_');

const getItemType = (item: any): 'task' | 'issue' | 'todo' => {
    const rawType = String(
        item?.source_type ||
        item?.sourceType ||
        item?.originalData?.source_type ||
        item?.originalData?.sourceType ||
        item?.type ||
        '',
    ).toLowerCase();
    const rawId = String(item?.id || item?.source_id || '').toLowerCase();

    if (rawType.includes('issue') || rawId.startsWith('issue-')) return 'issue';
    if (rawType.includes('todo') || rawType.includes('to_do') || rawId.startsWith('todo-')) return 'todo';
    return 'task';
};

const getItemSourceId = (item: any) => {
    const rawId =
        item?.source_id ??
        item?.sourceId ??
        item?.task_id ??
        item?.taskId ??
        item?.issue_id ??
        item?.issueId ??
        item?.todo_id ??
        item?.todoId ??
        item?.originalData?.source_id ??
        item?.originalData?.sourceId ??
        item?.originalData?.id ??
        item?.originalData?.task_id ??
        item?.originalData?.taskId ??
        item?.originalData?.issue_id ??
        item?.originalData?.issueId ??
        item?.originalData?.todo_id ??
        item?.originalData?.todoId ??
        item?.id;

    if (rawId === null || rawId === undefined || rawId === '') return null;
    return String(rawId).replace(/^(task|issue|todo)-/i, '') || rawId;
};

const isVisibleTaskIssueStatus = (status: any) =>
    ['open', 'pending', 'reopen', 'reopened', 'in_progress', 'started', 'on_hold'].includes(normalizeStatus(status)) &&
    !['completed', 'complete', 'closed', 'done'].includes(normalizeStatus(status));

const formatCell = (value: any) => {
    if (value === undefined || value === null || value === '') return '-';
    if (Array.isArray(value)) return value.map(getItemText).filter(Boolean).join(', ') || '-';
    if (typeof value === 'object') return getItemText(value);
    return String(value);
};

const toNumber = (value: any) => {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : 0;
};

const calculateWeeklyKpiScore = (rows: any[]) => {
    const percentages = rows
        .map((row) => {
            const actual = toNumber(row?.actual_value ?? row?.actual ?? row?.value ?? row?.current);
            const target = toNumber(row?.target_value ?? row?.target ?? row?.goal ?? row?.expected);
            if (target === 0) return actual > 0 ? 100 : 0;
            return Math.min((actual / target) * 100, 100);
        })
        .filter((value) => Number.isFinite(value));

    if (percentages.length === 0) return null;
    const average = percentages.reduce((sum, value) => sum + value, 0) / percentages.length;
    return Math.round(((20 * average) / 100) * 10) / 10;
};

const normalizeKpiRow = (item: any, fallbackName = ''): KpiRow | null => {
    if (typeof item === 'string') return { name: item };
    if (!item || typeof item !== 'object') return null;

    const actual = item.actual ?? item.actual_value ?? item.value ?? item.current ?? item.score;
    const target = item.target ?? item.target_value ?? item.goal ?? item.expected;
    const calculatedAchievement =
        item.achievement ??
        item.achievement_percentage ??
        item.achieved_percentage ??
        item.percent ??
        item.percentage;
    const name = item.name || item.title || item.kpi_name || item.kpi || item.notes || item.label || fallbackName;
    if (!name) return null;

    return {
        name: String(name),
        target,
        actual,
        achievement:
            calculatedAchievement ??
            (target !== undefined && actual !== undefined
                ? `${Math.round((toNumber(target) === 0 ? (toNumber(actual) > 0 ? 100 : 0) : Math.min((toNumber(actual) / toNumber(target)) * 100, 100)) * 10) / 10}%`
                : undefined),
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
        weekly: [reportData.past_kpis, reportData.weekly_kpis, reportData.weekly_kpi, reportData.kpi_summary, reportData.kpis?.weekly],
        monthly: [reportData.monthly_kpis, reportData.monthly_kpi, reportData.kpis?.monthly],
        quarterly: [reportData.quarterly_kpis, reportData.qtrly_kpis, reportData.kpis?.quarterly],
        other: [reportData.other_kpis, reportData.other_kpi, reportData.kpis?.other],
    };

    const rows = sourceByType[type].flatMap(rowsFromSource);

    if (type === 'daily' && sections.daily_kpi_achievement !== undefined && Number(sections.daily_kpi_achievement) !== 0 && rows.length === 0) {
        rows.push({ name: 'Daily KPI Achievement', achievement: sections.daily_kpi_achievement });
    }

    if (type === 'weekly') {
        const calculatedScore = calculateWeeklyKpiScore(Array.isArray(reportData.past_kpis) ? reportData.past_kpis : []);
        const score = sections.weekly_kpi_achievement ?? calculatedScore;
        if (score !== undefined && score !== null) {
            rows.unshift({
                name: 'Weekly KPI Score',
                target: '20 pts',
                actual: `${score} pts`,
                achievement: `${score}/20`,
            });
        }
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
    priorityText: string;
    selectedPriorityDay: string;
    showDayDropdown: string | null;
    priorityLoading: Record<number, boolean>;
    daysOfWeek: string[];
    feedbackText: string;
    feedbackScore: number;
    feedbackLoading: Record<number, boolean>;
    ratingsData: Record<number, any>;
    ratingsLoading: Record<number, boolean>;
    onPriorityChange: (text: string) => void;
    onPriorityDaySelect: (day: string) => void;
    onTogglePriorityDropdown: () => void;
    onAddPriority: () => void;
    onFeedbackChange: (text: string) => void;
    onFeedbackScoreChange: (score: number) => void;
    onSubmitFeedback: () => void;
    onTabChange: (tab: string) => void;
    onFetchRatings: (userId: number) => void;
}

export const ReportExpandedView = ({
    report,
    activeTab,
    priorityText,
    selectedPriorityDay,
    showDayDropdown,
    priorityLoading,
    daysOfWeek,
    feedbackText,
    feedbackScore,
    feedbackLoading,
    ratingsData,
    ratingsLoading,
    onPriorityChange,
    onPriorityDaySelect,
    onTogglePriorityDropdown,
    onAddPriority,
    onFeedbackChange,
    onFeedbackScoreChange,
    onSubmitFeedback,
    onTabChange,
    onFetchRatings,
}: ReportExpandedViewProps) => {
    const navigate = useNavigate();
    const reportData = getReportData(report);
    const feedbackList = getFeedbackList(ratingsData, report.user_id);
    const savedTasksIssues = Array.isArray(reportData.tasks_issues) ? reportData.tasks_issues : [];
    const [selectedTodo, setSelectedTodo] = useState<any>(null);
    const [isTodoDetailsModalOpen, setIsTodoDetailsModalOpen] = useState(false);
    const remarks = Array.isArray(reportData.remarks) ? reportData.remarks : [];
    const sections = reportData.sections || {};
    const dailyRows = getKpiRows(reportData, 'daily');
    const weeklyRows = getKpiRows(reportData, 'weekly');
    const hasSopScore = sections.sop_health !== undefined && sections.sop_health !== null;
    const taskIssueDisplayItems = savedTasksIssues.filter((item) => isVisibleTaskIssueStatus(item.status));

    const fetchTodoDetails = async (todoId: any) => {
        const baseUrl = getBaseUrl();
        if (!baseUrl || !todoId) return null;
        try {
            const response = await fetch(`${baseUrl}/todos/${todoId}.json`, { headers: getAuthHeaders() });
            if (!response.ok) return null;
            const json = await response.json();
            return json?.todo || json?.data?.todo || json?.data || json;
        } catch (error) {
            console.error('Failed to fetch todo details:', error);
            return null;
        }
    };

    const handleViewTaskIssueTodo = async (item: any) => {
        const type = getItemType(item);
        const sourceId = getItemSourceId(item);
        if (!sourceId) return;

        if (type === 'todo') {
            const details = await fetchTodoDetails(sourceId);
            setSelectedTodo(details || { ...item.originalData, ...item, id: sourceId });
            setIsTodoDetailsModalOpen(true);
            return;
        }

        navigate(type === 'task' ? `/vas/tasks/${sourceId}` : `/vas/issues/${sourceId}`);
    };

    const tabs = [
        { label: 'Daily', count: dailyRows.length, color: 'bg-[#4f46e5]', icon: CalendarIcon },
        { label: 'Weekly', count: weeklyRows.length, color: 'bg-[#4f46e5]', icon: TrendingUp },
        { label: 'Task/Issues/Todos', count: taskIssueDisplayItems.length, color: 'bg-[#475569]', icon: FileText },
        { label: 'SOPs', count: hasSopScore ? 1 : 0, color: 'bg-[#475569]', icon: Clipboard },
    ];

    return (
        <div className="mt-4 space-y-5 border-t border-slate-100 pt-4 animate-in fade-in slide-in-from-top-2 duration-300 min-w-0 max-w-full overflow-hidden">
            <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
                <div className="flex items-center justify-center w-full">
                    <TabsList className="flex flex-wrap items-center justify-center gap-2 rounded-2xl border border-slate-100 bg-slate-50/80 p-2 h-auto w-full">
                        {tabs.map((tab) => (
                            <TabsTrigger
                                key={tab.label}
                                value={tab.label}
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

                    <TabsContent value="Task/Issues/Todos">
                        <TasksIssuesContent
                            items={taskIssueDisplayItems}
                            isLoading={false}
                            onViewItem={handleViewTaskIssueTodo}
                        />
                    </TabsContent>

                    <TabsContent value="SOPs">
                        <SopsContent sections={sections} />
                    </TabsContent>
                </div>
            </Tabs>

            <WinsAndPriorities
                report={report}
                priorityText={priorityText}
                selectedPriorityDay={selectedPriorityDay}
                isPriorityDropdownOpen={showDayDropdown === `priority-${report.user_id}`}
                priorityLoading={priorityLoading[report.user_id] || false}
                daysOfWeek={daysOfWeek}
                feedbackText={feedbackText}
                feedbackScore={feedbackScore}
                feedbackLoading={feedbackLoading[report.user_id] || false}
                recentFeedbacks={feedbackList}
                recentFeedbacksLoading={ratingsLoading[report.user_id] || false}
                onPriorityChange={onPriorityChange}
                onPriorityDaySelect={onPriorityDaySelect}
                onTogglePriorityDropdown={onTogglePriorityDropdown}
                onAddPriority={onAddPriority}
                onFeedbackChange={onFeedbackChange}
                onFeedbackScoreChange={onFeedbackScoreChange}
                onSubmitFeedback={onSubmitFeedback}
                onFetchRatings={() => onFetchRatings(report.user_id)}
                onViewItem={handleViewTaskIssueTodo}
            />

            <CommentsAndFeedback report={report} remarks={remarks} />

            <TodoDetailsModal
                isModalOpen={isTodoDetailsModalOpen}
                setIsModalOpen={setIsTodoDetailsModalOpen}
                todo={selectedTodo}
            />
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

const TasksIssuesContent = ({
    items,
    isLoading,
    onViewItem,
}: {
    items: any[];
    isLoading: boolean;
    onViewItem: (item: any) => void;
}) => {
    const buckets = [
        {
            key: 'in_progress',
            label: 'In Progress',
            statuses: ['in_progress', 'started'],
            colorClass: 'text-sky-700',
            headerBg: 'bg-sky-50',
            pillBg: 'bg-sky-100 text-sky-700',
            itemBg: 'bg-sky-50/60 border-sky-100',
        },
        {
            key: 'open',
            label: 'Open',
            statuses: ['open', 'pending', 'reopen', 'reopened'],
            colorClass: 'text-slate-600',
            headerBg: 'bg-slate-50',
            pillBg: 'bg-slate-100 text-slate-600',
            itemBg: 'bg-slate-50/60 border-slate-100',
        },
        {
            key: 'on_hold',
            label: 'On Hold',
            statuses: ['on_hold'],
            colorClass: 'text-orange-700',
            headerBg: 'bg-orange-50',
            pillBg: 'bg-orange-100 text-orange-700',
            itemBg: 'bg-orange-50/60 border-orange-100',
        },
    ];

    return (
        <div className="bg-white border border-[#F0E8E3] rounded-2xl overflow-hidden shadow-sm min-w-0">
            <div className="bg-[#FFFAF8] p-4 border-b border-[#F0E8E3] flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#DA7756]" />
                <span className="font-black text-neutral-700" style={{ fontSize: '12px' }}>
                    Tasks, Issues & Todos
                </span>
                <span className="ml-auto text-[10px] font-bold text-neutral-400">{items.length}</span>
            </div>
            <div className="p-4 space-y-3 min-w-0">
                {isLoading ? (
                    <p className="text-sm font-semibold text-slate-400">Loading tasks, issues and todos...</p>
                ) : items.length > 0 ? (
                    buckets.map((bucket) => {
                        const bucketItems = items.filter((item) => bucket.statuses.includes(normalizeStatus(item.status)));
                        if (bucketItems.length === 0) return null;
                        return (
                            <div key={bucket.key} className="space-y-2">
                                <div className={`flex items-center gap-2 px-2 py-1.5 rounded-[6px] ${bucket.headerBg}`}>
                                    <span className={`text-[10px] font-black uppercase tracking-wider flex-1 ${bucket.colorClass}`}>
                                        {bucket.label}
                                    </span>
                                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${bucket.pillBg}`}>
                                        {bucketItems.length}
                                    </span>
                                </div>
                                <div className="space-y-1.5">
                                    {bucketItems.map((item, index) => (
                                        <TaskCard
                                            key={item.id ?? `${bucket.key}-${index}`}
                                            item={item}
                                            itemBg={bucket.itemBg}
                                            onViewItem={onViewItem}
                                        />
                                    ))}
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <p className="text-sm font-semibold text-slate-400">No open, in-progress, or on-hold tasks/issues/todos</p>
                )}
            </div>
        </div>
    );
};

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

const TaskCard = ({
    item,
    itemBg,
    onViewItem,
}: {
    item: any;
    itemBg: string;
    onViewItem: (item: any) => void;
}) => {
    const type = getItemType(item);
    const typePillStyle =
        type === 'issue'
            ? 'bg-red-100 text-red-700 border-red-200'
            : type === 'todo'
                ? 'bg-violet-100 text-violet-700 border-violet-200'
                : 'bg-[#FFF3EE] text-[#DA7756] border-[#DA7756]/30';
    const priority = item.priority || item.priority_level || '';
    const priorityPill =
        String(priority).toLowerCase() === 'high'
            ? 'bg-red-50 text-red-600 border-red-200'
            : String(priority).toLowerCase() === 'medium'
                ? 'bg-yellow-50 text-yellow-700 border-yellow-200'
                : String(priority).toLowerCase() === 'low'
                    ? 'bg-green-50 text-green-700 border-green-200'
                    : '';
    const dueDate = item.due_date || item.target_date || item.end_date || item.deadline;

    return (
        <div
            className={`flex flex-col rounded-[10px] border transition-all cursor-pointer hover:border-[#DA7756]/40 hover:bg-[#FFF8F5] ${itemBg}`}
            onClick={() => onViewItem(item)}
        >
            <div className="flex items-center gap-2 px-3 py-2.5">
                <span className={`shrink-0 text-[9px] font-black uppercase tracking-wide px-2 py-0.5 rounded-full border ${typePillStyle}`}>
                    {type === 'todo' ? 'todo' : type}
                </span>
                <span className="flex-1 min-w-0 text-xs font-semibold text-neutral-800 leading-tight break-words">
                    {getItemText(item)}
                </span>
                {priorityPill && (
                    <span className={`shrink-0 text-[9px] font-bold px-2 py-0.5 rounded-full border ${priorityPill}`}>
                        {priority}
                    </span>
                )}
                <button
                    type="button"
                    onClick={(event) => {
                        event.stopPropagation();
                        onViewItem(item);
                    }}
                    className="shrink-0 flex items-center gap-1 px-2 py-1 rounded-[6px] bg-white border border-gray-200 text-[#DA7756] hover:bg-[#FFF3EE] transition-colors shadow-sm"
                    title={`View ${type}`}
                >
                    <Eye className="w-3 h-3" />
                </button>
            </div>
            {dueDate && (
                <div className="flex items-center gap-1 px-3 pb-2 -mt-1">
                    <CalendarIcon className="w-3 h-3 text-gray-400 shrink-0" />
                    <span className="text-[10px] text-gray-500">
                        {new Date(dueDate).toLocaleDateString('en-GB', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric',
                        })}
                    </span>
                </div>
            )}
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

                        <div className="space-y-4">
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
