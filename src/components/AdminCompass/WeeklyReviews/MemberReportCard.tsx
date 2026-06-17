import { CheckCircle2, ChevronDown, ChevronUp, Clock3, Mail } from 'lucide-react';
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

const toNumber = (value: any) => {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : 0;
};

// Remark types that earn bonus points (mirrors WeeklyReports.tsx scoring).
const REMARK_BONUS_TYPES = ['breakthrough', 'breakdown', 'clientFeedback', 'employeeFeedback'];

const getRemarkType = (remark: any): string => {
    if (!remark || typeof remark === 'string') return 'remark';
    if (typeof remark === 'object') {
        // Supports both { type, text } and { [type]: text } shapes.
        if (remark.type) return String(remark.type);
        const key = Object.keys(remark)[0];
        return key || 'remark';
    }
    return 'remark';
};

// Mirrors WeeklyReports.tsx "Remarks Logged (Max 14 points)".
const calculateRemarksScore = (remarks: any) => {
    if (!Array.isArray(remarks) || remarks.length === 0) return null;
    const score = remarks.reduce(
        (sum, remark) => sum + (REMARK_BONUS_TYPES.includes(getRemarkType(remark)) ? 3 : 1),
        0,
    );
    return Math.min(score, 14);
};

// Mirrors WeeklyReports.tsx "Tasks & Issues (Max 10 points)".
const calculateTasksIssuesScore = (items: any) => {
    if (!Array.isArray(items) || items.length === 0) return null;
    const statusOf = (item: any) => String(item?.status || '').toLowerCase();
    const closed = items.filter((item) => ['completed', 'complete', 'closed', 'done'].includes(statusOf(item))).length;
    const open = items.filter((item) => ['open', 'reopen', 'reopened', 'pending'].includes(statusOf(item))).length;
    const overdue = items.filter((item) => ['overdue', 'overdued'].includes(statusOf(item))).length;

    const positive = closed * 2;
    const openPenalty = Math.max(open * -0.5, -3);
    const overduePenalty = Math.max(overdue * -2, -5);
    return Math.min(Math.max(positive + openPenalty + overduePenalty, 0), 10);
};

const calculateWeeklyKpiScore = (pastKpis: any[]) => {
    const percentages = pastKpis
        .map((kpi) => {
            const actual = toNumber(kpi?.actual_value ?? kpi?.actual ?? kpi?.value);
            const target = toNumber(kpi?.target_value ?? kpi?.target ?? kpi?.goal);
            if (target === 0) return actual > 0 ? 100 : 0;
            return Math.min((actual / target) * 100, 100);
        })
        .filter((value) => Number.isFinite(value));

    if (percentages.length === 0) return null;
    const average = percentages.reduce((sum, value) => sum + value, 0) / percentages.length;
    return Math.round(((20 * average) / 100) * 10) / 10;
};

const getMemberMetrics = (report: any) => {
    const reportData = getReportData(report);
    const sections = reportData.sections || {};
    const details = reportData.details || {};
    // Prefer the score derived from the actual logged items (matching WeeklyReports.tsx);
    // fall back to the saved section score only when no items are present.
    const computedTasksIssuesScore = calculateTasksIssuesScore(reportData.tasks_issues);
    const tasksIssuesScore = computedTasksIssuesScore ?? sections.tasks_issues_todos ?? sections.tasks_issues;
    const computedRemarksScore = calculateRemarksScore(reportData.remarks);
    const remarksScore = computedRemarksScore ?? sections.remarks;
    const weeklyKpiScore = sections.weekly_kpi_achievement ?? calculateWeeklyKpiScore(Array.isArray(reportData.past_kpis) ? reportData.past_kpis : []);

    const metrics = [
        { label: 'Planning', value: formatMetric(sections.planning) },
        { label: 'SOP', value: formatMetric(sections.sop_health) },
        { label: 'Tasks/Issues/Todos', value: formatMetric(tasksIssuesScore) },
        { label: 'Remarks', value: formatMetric(remarksScore) },
        { label: 'Daily KPI', value: formatMetric(sections.daily_kpi_achievement) },
        { label: 'Weekly KPI', value: formatMetric(weeklyKpiScore) },
        { label: 'Self Rating', value: formatMetric(details.self_rating ?? sections.self_rating ?? reportData.self_rating) },
    ];

    return metrics.filter((metric) => hasValue(metric.value) && !(metric.label === 'Daily KPI' && Number(metric.value) === 0));
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
    isAttendanceLocked?: boolean;
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
    isAttendanceLocked = false,
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
    const metricValue = (label: string) => memberMetrics.find((metric) => metric.label === label)?.value;
    const scorePills = [
        { label: 'Planning', value: metricValue('Planning') },
        { label: 'SOP', value: metricValue('SOP') },
        { label: 'Tasks/Issues/Todos', value: metricValue('Tasks/Issues/Todos') },
        { label: 'Remarks', value: metricValue('Remarks') },
        { label: 'Daily KPI', value: metricValue('Daily KPI') },
        { label: 'Weekly KPI', value: metricValue('Weekly KPI') },
        { label: 'Self Rating', value: metricValue('Self Rating') },
    ].filter((metric) => hasValue(metric.value) && !(metric.label === 'Daily KPI' && Number(metric.value) === 0));

    return (
        <div
            className={`border rounded-xl shadow-sm overflow-hidden transition-all min-w-0 max-w-full ${
                isChecked ? 'border-[#CE7A5A] border-l-[4px] bg-[#FFF8F4]' : 'border-[#EAE3DF] bg-white'
            }`}
        >
            <div className="p-3 transition-colors flex items-start gap-3 hover:bg-black/[0.015] sm:p-4 sm:gap-4">
                <label
                    className={`flex shrink-0 items-center gap-2 self-stretch pt-1 ${
                        isAttendanceLocked ? 'cursor-not-allowed' : 'cursor-pointer'
                    }`}
                    onClick={(event) => event.stopPropagation()}
                    title={isAttendanceLocked ? 'Meeting already submitted' : 'Select for this meeting'}
                >
                    <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={(event) => {
                            event.stopPropagation();
                            onUserCheck?.(event.target.checked);
                        }}
                        disabled={isAttendanceLocked}
                        className={`h-5 w-5 rounded-[6px] border-2 border-gray-300 accent-[#CE7A5A] shrink-0 ${
                            isAttendanceLocked ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'
                        }`}
                    />
                </label>

                <div className="flex-1 min-w-0">
                    <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
                        <div className="min-w-0">
                            <div className="flex items-center gap-2 mb-1 flex-wrap">
                                <h3 className="font-bold text-[#1A1A1A] text-[15px] truncate">
                                    {report.name}
                                </h3>
                                {roleLabels.map((role) => (
                                    <span
                                        key={role}
                                        className="flex items-center gap-1 border border-orange-200 bg-orange-50 text-orange-600 text-[10px] font-bold px-1.5 py-0.5 rounded-full shrink-0"
                                    >
                                        {role}
                                    </span>
                                ))}
                                {report.department && (
                                    <span className="border border-blue-200 bg-blue-50 text-blue-600 text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0">
                                        {report.department}
                                    </span>
                                )}
                            </div>
                            <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-gray-400 mb-2 min-w-0">
                                {report.email ? (
                                    <>
                                        <Mail className="h-3.5 w-3.5 shrink-0" />
                                        <span className="min-w-0 break-all sm:truncate">{report.email}</span>
                                    </>
                                ) : (
                                    <span>Report submitted</span>
                                )}
                                <span className="shrink-0">•</span>
                                <Clock3 className="h-3.5 w-3.5 shrink-0" />
                                <span className="shrink-0">{getSubmittedAt(report)}</span>
                            </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-2 shrink-0 sm:justify-end">
                            {isSubmitted ? (
                                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-white bg-[#10B981] border border-[#10B981] px-2 py-0.5 rounded-full shrink-0">
                                    <CheckCircle2 className="h-3 w-3" />
                                    Submitted
                                </span>
                            ) : (
                                <span className="text-red-500 text-xs font-semibold">
                                    Not submitted
                                </span>
                            )}
                            <span className="px-2.5 py-0.5 rounded-full border border-[rgba(206,122,90,0.3)] bg-[#FFF3EE] text-[#CE7A5A] text-[10px] font-bold shrink-0">
                                Score: {getScore(report)}/100
                            </span>
                            <button
                                type="button"
                                onClick={(event) => {
                                    event.stopPropagation();
                                    onExpand();
                                }}
                                className="flex items-center justify-center w-7 h-7 rounded-full bg-blue-50 text-blue-500 shrink-0 transition-transform"
                            >
                                <ChevronDown className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                            </button>
                        </div>
                    </div>

                    {scorePills.length > 0 && (
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                            {scorePills.map((metric) => (
                                <span
                                    key={metric.label}
                                    className="px-2.5 py-0.5 rounded-full border border-[rgba(206,122,90,0.3)] bg-[#FFF3EE] text-[#CE7A5A] text-[10px] font-bold"
                                >
                                    {metric.label}: {metric.value}
                                </span>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <div className="bg-[#FFFAF8] border-t border-[#EAE3DF] p-3 sm:p-4">
                {memberMetrics.length > scorePills.length && (
                    <div className="mb-4 grid grid-cols-2 gap-2 md:grid-cols-4 xl:grid-cols-7">
                        {memberMetrics
                            .filter((metric) => !scorePills.some((pill) => pill.label === metric.label))
                            .map((metric) => (
                                <div
                                    key={metric.label}
                                    className="rounded-xl border border-[#F0E8E3] bg-white px-3 py-2 shadow-sm"
                                >
                                    <span className="block truncate text-[10px] font-black uppercase tracking-wide text-neutral-400">{metric.label}</span>
                                    <span className="mt-0.5 block text-sm font-black text-neutral-900">{metric.value}</span>
                                </div>
                            ))}
                    </div>
                )}

                <div className="mt-3 flex justify-center">
                    <button
                        onClick={onExpand}
                        className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-bold text-neutral-500 transition-colors hover:bg-white hover:text-neutral-700"
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
                        priorityText={priorityText}
                        selectedPriorityDay={selectedPriorityDay}
                        showDayDropdown={showDayDropdown}
                        priorityLoading={priorityLoading}
                        daysOfWeek={daysOfWeek}
                        feedbackText={feedbackText}
                        feedbackScore={feedbackScore}
                        feedbackLoading={feedbackLoading}
                        ratingsData={ratingsData}
                        ratingsLoading={ratingsLoading}
                        onPriorityChange={onPriorityChange}
                        onPriorityDaySelect={onPriorityDaySelect}
                        onTogglePriorityDropdown={onTogglePriorityDropdown}
                        onAddPriority={onAddPriority}
                        onFeedbackChange={onFeedbackChange}
                        onFeedbackScoreChange={onFeedbackScoreChange}
                        onSubmitFeedback={onSubmitFeedback}
                        onTabChange={onTabChange}
                        onFetchRatings={onFetchRatings}
                    />
                )}
            </div>
        </div>
    );
};
