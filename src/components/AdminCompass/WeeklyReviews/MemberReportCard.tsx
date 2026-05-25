import { BarChart3, CheckCircle2, ChevronDown, ChevronUp, Clock3, Mail } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { PriorityInput } from './PriorityInput';
import { FeedbackInput } from './FeedbackInput';
import { ReportExpandedView } from './ReportExpandedView';

const getReportData = (report: any) => report.weekly_report?.report_data || report.report_data || {};

const getScore = (report: any) => {
    const reportData = getReportData(report);
    return reportData.total_score ?? report.score ?? 0;
};

const hasValue = (value: any) => value !== undefined && value !== null && value !== '';

const formatMetric = (value: any) => {
    if (!hasValue(value)) return null;
    if (typeof value === 'number') return Number.isInteger(value) ? String(value) : value.toFixed(1);
    return String(value);
};

const getMemberMetrics = (report: any) => {
    const reportData = getReportData(report);
    const sections = reportData.sections || {};
    const details = reportData.details || {};

    const metrics = [
        { label: 'Planning', value: formatMetric(sections.planning) },
        { label: 'SOP', value: formatMetric(sections.sop_health) },
        { label: 'Tasks/Issues', value: formatMetric(sections.tasks_issues) },
        { label: 'Remarks', value: formatMetric(sections.remarks) },
        { label: 'Daily KPI', value: formatMetric(sections.daily_kpi_achievement) },
        { label: 'Weekly KPI', value: formatMetric(sections.weekly_kpi_achievement) },
        { label: 'Self Rating', value: formatMetric(details.self_rating ?? sections.self_rating ?? reportData.self_rating) },
    ];

    return metrics.filter((metric) => hasValue(metric.value));
};

const getSubmittedAt = (report: any) => {
    const submittedAt = report.report_data?.submitted_at || report.weekly_report?.submitted_at || report.submitted_at;
    if (!submittedAt) return 'Not submitted';

    return new Date(submittedAt).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
};

const getRoleLabels = (report: any) => {
    const roleValues = [
        ...(Array.isArray(report.roles) ? report.roles : []),
        ...(Array.isArray(report.role_names) ? report.role_names : []),
        report.role,
        report.designation,
        report.position,
    ]
        .filter(Boolean)
        .map((role: any) => String(role));

    if (report.is_hod || report.name?.includes('HOD')) roleValues.push('HOD');
    if (report.is_tl || report.name?.includes('TL')) roleValues.push('TL');

    return [...new Set(roleValues.map((role) => role.trim()).filter(Boolean))];
};

interface MemberReportCardProps {
    report: any;
    isExpanded: boolean;
    isChecked?: boolean;
    activeTab: string;
    priorityText: string;
    selectedPriorityDay: string;
    showDayDropdown: string | null;
    priorityLoading: Record<number, boolean>;
    feedbackText: string;
    feedbackScore: number;
    feedbackLoading: Record<number, boolean>;
    ratingsData: Record<number, any>;
    ratingsLoading: Record<number, boolean>;
    daysOfWeek: string[];
    onExpand: () => void;
    onUserCheck?: (isChecked: boolean) => void;
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

export const MemberReportCard = ({
    report,
    isExpanded,
    isChecked = false,
    activeTab,
    priorityText,
    selectedPriorityDay,
    showDayDropdown,
    priorityLoading,
    feedbackText,
    feedbackScore,
    feedbackLoading,
    ratingsData,
    ratingsLoading,
    daysOfWeek,
    onExpand,
    onUserCheck,
    onPriorityChange,
    onPriorityDaySelect,
    onTogglePriorityDropdown,
    onAddPriority,
    onFeedbackChange,
    onFeedbackScoreChange,
    onSubmitFeedback,
    onTabChange,
    onFetchRatings,
}: MemberReportCardProps) => {
    const roleLabels = getRoleLabels(report);
    const memberMetrics = getMemberMetrics(report);
    const status = report.weekly_report?.status || report.status;
    const isSubmitted = status === 'submitted';

    return (
        <div
            className={`rounded-2xl border transition-all min-w-0 max-w-full overflow-hidden shadow-sm hover:shadow-md ${isSubmitted ? 'border-blue-200 bg-[#f8fbff]' : 'border-[#DA7756]/20 bg-white'
                }`}
        >
            <div className="flex flex-col gap-3 border-b border-slate-100 bg-white/80 p-4 xl:flex-row xl:items-center xl:justify-between">
                <div className="flex items-start gap-3 min-w-0">
                    <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={(e) => onUserCheck?.(e.target.checked)}
                        className="mt-1 h-5 w-5 shrink-0 cursor-pointer rounded-md border-gray-300 accent-blue-600"
                    />
                    <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                            <span className="font-black text-[#1e293b] text-base break-words min-w-0">{report.name}</span>
                            {isSubmitted && (
                                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700 ring-1 ring-emerald-200">
                                    <CheckCircle2 className="h-3 w-3" />
                                    Submitted
                                </span>
                            )}
                        </div>
                        {report.email && (
                            <div className="mt-1 flex items-center gap-1.5 text-xs font-medium text-slate-400">
                                <Mail className="h-3.5 w-3.5 shrink-0" />
                                <span className="break-all">{report.email}</span>
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-3 min-w-0 xl:justify-end">
                    <div className="flex items-center gap-2 flex-wrap">
                        {report.department && (
                            <Badge className="h-6 rounded-md bg-white border border-blue-200 text-blue-600 text-[10px] font-semibold hover:bg-white shadow-sm px-2">
                                {report.department}
                            </Badge>
                        )}
                        {roleLabels.map((role) => (
                            <Badge
                                key={role}
                                className="h-6 rounded-md bg-white border border-orange-200 text-orange-600 text-[10px] font-bold hover:bg-white shadow-sm px-2"
                            >
                                {role}
                            </Badge>
                        ))}
                    </div>

                    <div className="inline-flex h-8 items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3 shadow-sm">
                        <BarChart3 className="h-3.5 w-3.5 text-slate-500" />
                        <span className="text-xs font-black text-slate-800">{getScore(report)}/100</span>
                    </div>

                    <div className="inline-flex items-center gap-1.5 rounded-xl bg-slate-50 px-3 py-1.5 text-[11px] font-semibold text-slate-500 ring-1 ring-slate-200">
                        <Clock3 className="h-3.5 w-3.5" />
                        {getSubmittedAt(report)}
                    </div>
                </div>
            </div>

            <div className="p-4">
                {memberMetrics.length > 0 && (
                    <div className="mb-4 grid grid-cols-2 gap-2 md:grid-cols-4 xl:grid-cols-7">
                        {memberMetrics.map((metric) => (
                            <div
                                key={metric.label}
                                className="rounded-xl border border-slate-200 bg-white px-3 py-2 shadow-sm"
                            >
                                <span className="block truncate text-[10px] font-black uppercase tracking-wide text-slate-400">{metric.label}</span>
                                <span className="mt-0.5 block text-sm font-black text-slate-900">{metric.value}</span>
                            </div>
                        ))}
                    </div>
                )}

                <div className="grid grid-cols-1 xl:grid-cols-[minmax(220px,1fr)_minmax(320px,1.5fr)] gap-4 min-w-0">
                    <PriorityInput
                        userId={report.user_id}
                        priorityText={priorityText}
                        selectedDay={selectedPriorityDay}
                        isOpen={showDayDropdown === `priority-${report.user_id}`}
                        isLoading={priorityLoading[report.user_id] || false}
                        daysOfWeek={daysOfWeek}
                        onPriorityChange={onPriorityChange}
                        onDaySelect={onPriorityDaySelect}
                        onToggleDropdown={onTogglePriorityDropdown}
                        onSubmit={onAddPriority}
                        onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                                onAddPriority();
                            }
                        }}
                    />

                    <FeedbackInput
                        userId={report.user_id}
                        feedbackText={feedbackText}
                        score={feedbackScore}
                        isLoading={feedbackLoading[report.user_id] || false}
                        onFeedbackChange={onFeedbackChange}
                        onScoreChange={onFeedbackScoreChange}
                        onSubmit={onSubmitFeedback}
                    />
                </div>

                <div className="mt-3 flex justify-center">
                    <button
                        onClick={onExpand}
                        className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-bold text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700"
                    >
                        {isExpanded ? (
                            <>
                                <ChevronUp className="w-3 h-3" />
                                Collapse
                            </>
                        ) : (
                            <>
                                <ChevronDown className="w-3 h-3" />
                                Expand KPIs, Tasks & more
                            </>
                        )}
                    </button>
                </div>

                {isExpanded && (
                    <ReportExpandedView
                        report={report}
                        activeTab={activeTab}
                        ratingsData={ratingsData}
                        ratingsLoading={ratingsLoading}
                        onTabChange={onTabChange}
                        onFetchRatings={onFetchRatings}
                    />
                )}
            </div>
        </div>
    );
};
