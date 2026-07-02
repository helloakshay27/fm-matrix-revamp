import { useState } from 'react';
import { createPortal } from 'react-dom';
import { AlertTriangle, CheckCircle2, CheckSquare, ChevronRight, Eye, Loader2, MessageSquare, Star, Target, Trophy, Plus, X } from 'lucide-react';
import ProjectTaskCreateModal from '@/components/ProjectTaskCreateModal';
import AddIssueModal from '@/components/AddIssueModal';
import AddToDoModal from '@/components/AddToDoModal';
import { PriorityInput } from './PriorityInput';

interface WinsAndPrioritiesProps {
    report: any;
    priorityText: string;
    selectedPriorityDay: string;
    isPriorityDropdownOpen: boolean;
    priorityLoading: boolean;
    daysOfWeek: string[];
    feedbackText?: string;
    feedbackScore?: number;
    feedbackLoading?: boolean;
    recentFeedbacks?: any[];
    recentFeedbacksLoading?: boolean;
    onPriorityChange: (text: string) => void;
    onPriorityDaySelect: (day: string) => void;
    onTogglePriorityDropdown: () => void;
    onAddPriority: () => void;
    onFeedbackChange?: (text: string) => void;
    onFeedbackScoreChange?: (score: number) => void;
    onSubmitFeedback?: () => void;
    onFetchRatings?: () => void;
    onViewItem?: (item: any) => void;
}

const getReportItemText = (item: unknown): string => {
    if (typeof item === 'string') return item;
    if (item && typeof item === 'object') {
        const value = item as Record<string, unknown>;
        if (typeof value.title === 'string') return value.title;
        if (typeof value.text === 'string') return value.text;
        if (typeof value.name === 'string') return value.name;
    }
    return String(item ?? '');
};

const getReportItemType = (item: unknown): 'task' | 'issue' | 'todo' | 'note' => {
    if (!item || typeof item !== 'object') return 'note';
    const value = item as Record<string, any>;
    const rawType = String(
        value.source_type ||
        value.sourceType ||
        value.originalData?.source_type ||
        value.originalData?.sourceType ||
        value.type ||
        ''
    ).toLowerCase();
    const rawId = String(value.id || value.source_id || '').toLowerCase();

    if (rawType.includes('issue') || rawId.startsWith('issue-')) return 'issue';
    if (rawType.includes('todo') || rawType.includes('to_do') || rawId.startsWith('todo-')) return 'todo';
    if (rawType.includes('task') || rawId.startsWith('task-')) return 'task';
    return 'note';
};

const getReportItemSourceId = (item: unknown) => {
    if (!item || typeof item !== 'object') return null;
    const value = item as Record<string, any>;
    const rawId =
        value.source_id ??
        value.sourceId ??
        value.task_id ??
        value.taskId ??
        value.issue_id ??
        value.issueId ??
        value.todo_id ??
        value.todoId ??
        value.originalData?.source_id ??
        value.originalData?.sourceId ??
        value.originalData?.id ??
        null;

    if (rawId === null || rawId === undefined || rawId === '') return null;
    return String(rawId).replace(/^(task|issue|todo)-/i, '') || rawId;
};

const getTypePillClass = (type: 'task' | 'issue' | 'todo' | 'note') =>
    type === 'issue'
        ? 'bg-red-100 text-red-700 border-red-200'
        : type === 'todo'
            ? 'bg-violet-100 text-violet-700 border-violet-200'
            : type === 'task'
                ? 'bg-[#FFF3EE] text-[#DA7756] border-[#DA7756]/30'
                : 'bg-gray-100 text-gray-600 border-gray-200';

const countDayPlans = (plans: unknown): number => {
    if (!Array.isArray(plans)) return 0;
    return plans.reduce((count, item) => {
        if (!item || typeof item !== 'object' || Array.isArray(item)) return count + 1;
        return count + Object.values(item).reduce((total: number, dayItems) => total + (Array.isArray(dayItems) ? dayItems.length : 0), 0);
    }, 0);
};

export const WinsAndPriorities = ({
    report,
    priorityText,
    selectedPriorityDay,
    isPriorityDropdownOpen,
    priorityLoading,
    daysOfWeek,
    feedbackText = '',
    feedbackScore = 0,
    feedbackLoading = false,
    recentFeedbacks = [],
    recentFeedbacksLoading = false,
    onPriorityChange,
    onPriorityDaySelect,
    onTogglePriorityDropdown,
    onAddPriority,
    onFeedbackChange,
    onFeedbackScoreChange,
    onSubmitFeedback,
    onFetchRatings,
    onViewItem,
}: WinsAndPrioritiesProps) => {
    const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
    const [isIssueModalOpen, setIsIssueModalOpen] = useState(false);
    const [isTodoModalOpen, setIsTodoModalOpen] = useState(false);
    const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
    const reportData = report.weekly_report?.report_data || report.report_data || {};
    const achievements = Array.isArray(reportData.achievements) ? reportData.achievements : [];
    const plans = reportData.upcoming_week_plan || reportData.tasks || [];
    const actionMemberPrefill = report.user_id
        ? {
            responsible_person: {
                id: String(report.user_id),
                name: report.name || 'Unknown',
            },
        }
        : null;

    const dayColors: Record<string, string> = {
        mon: 'text-blue-600',
        tue: 'text-green-600',
        wed: 'text-purple-600',
        thu: 'text-red-500',
        fri: 'text-yellow-600',
        sat: 'text-pink-600',
        sun: 'text-indigo-600',
    };

    const dayLabels: Record<string, string> = {
        mon: 'Mon',
        tue: 'Tue',
        wed: 'Wed',
        thu: 'Thu',
        fri: 'Fri',
        sat: 'Sat',
        sun: 'Sun',
    };

    const renderPriorities = () => {
        if (!Array.isArray(plans) || plans.length === 0) {
            return (
                <li className="flex items-center gap-2 rounded-xl border border-dashed border-blue-100 bg-blue-50/40 px-3 py-3">
                    <Target className="h-3.5 w-3.5 text-blue-300" />
                    <span className="text-gray-400">No tasks recorded</span>
                </li>
            );
        }

        if (plans.length > 0 && typeof plans[0] === 'object' && !Array.isArray(plans[0])) {
            return Object.entries(plans[0])
                .map(([dayKey, dayTasks]: [string, any]) => {
                    const day = dayKey.toLowerCase();
                    if (!Array.isArray(dayTasks) || dayTasks.length === 0) return null;
                    return dayTasks.map((task, idx) => {
                        const type = getReportItemType(task);
                        const hasView = type !== 'note' && !!getReportItemSourceId(task);
                        return (
                            <li key={`${day}-${idx}`} className="flex items-start gap-2 min-w-0 rounded-xl border border-blue-50 bg-white px-3 py-2.5 shadow-sm">
                                <span className={`${dayColors[day] || 'text-gray-500'} shrink-0 rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-black`}>
                                    {dayLabels[day] || dayKey}
                                </span>
                                <span className={`shrink-0 text-[9px] font-black uppercase tracking-wide px-2 py-0.5 rounded-full border ${getTypePillClass(type)}`}>
                                    {type}
                                </span>
                                <span className="flex-1 text-gray-600 break-words min-w-0">{getReportItemText(task)}</span>
                                {hasView && (
                                    <button
                                        type="button"
                                        onClick={() => onViewItem?.(task)}
                                        className="shrink-0 flex items-center gap-1 px-2 py-1 rounded-[6px] bg-white border border-gray-200 text-[#DA7756] hover:bg-[#FFF3EE] transition-colors shadow-sm"
                                        title={`View ${type}`}
                                    >
                                        <Eye className="w-3 h-3" />
                                    </button>
                                )}
                            </li>
                        );
                    });
                })
                .flat()
                .filter(Boolean);
        }

        const dayColorKeys = Object.keys(dayColors);
        const dayLabelKeys = Object.keys(dayLabels);
        return plans.map((task, idx) => {
            const type = getReportItemType(task);
            const hasView = type !== 'note' && !!getReportItemSourceId(task);
            return (
                <li key={idx} className="flex items-start gap-2 min-w-0 rounded-xl border border-blue-50 bg-white px-3 py-2.5 shadow-sm">
                    <span className={`${dayColors[dayColorKeys[idx % dayColorKeys.length]]} shrink-0 rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-black`}>
                        {dayLabels[dayLabelKeys[idx % dayLabelKeys.length]]}
                    </span>
                    <span className={`shrink-0 text-[9px] font-black uppercase tracking-wide px-2 py-0.5 rounded-full border ${getTypePillClass(type)}`}>
                        {type}
                    </span>
                    <span className="flex-1 text-gray-600 break-words min-w-0">{getReportItemText(task)}</span>
                    {hasView && (
                        <button
                            type="button"
                            onClick={() => onViewItem?.(task)}
                            className="shrink-0 flex items-center gap-1 px-2 py-1 rounded-[6px] bg-white border border-gray-200 text-[#DA7756] hover:bg-[#FFF3EE] transition-colors shadow-sm"
                            title={`View ${type}`}
                        >
                            <Eye className="w-3 h-3" />
                        </button>
                    )}
                </li>
            );
        });
    };

    const handleToggleFeedback = () => {
        const nextOpen = !isFeedbackOpen;
        setIsFeedbackOpen(nextOpen);
        if (nextOpen) onFetchRatings?.();
    };

    return (
        <div className="space-y-3 min-w-0">
            <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-[#DA7756] font-bold" style={{ fontSize: '12px' }}>
                    <Trophy className="w-4 h-4" />
                    Wins & Priorities ({achievements.length + countDayPlans(plans)})
                </div>
                <div className="flex flex-wrap gap-2">
                    <button onClick={() => setIsTaskModalOpen(true)} className="flex items-center gap-1.5 px-4 py-1.5 text-blue-600 bg-white border border-blue-200 rounded-full text-xs font-bold shadow-sm hover:bg-blue-50 transition-colors">
                        <Plus className="w-3.5 h-3.5" /> Add Task
                    </button>
                    <button onClick={() => setIsIssueModalOpen(true)} className="flex items-center gap-1.5 px-4 py-1.5 text-red-600 bg-white border border-red-200 rounded-full text-xs font-bold shadow-sm hover:bg-red-50 transition-colors">
                        <AlertTriangle className="w-3.5 h-3.5" /> Add Issue
                    </button>
                    <button onClick={() => setIsTodoModalOpen(true)} className="flex items-center gap-1.5 px-4 py-1.5 text-emerald-600 bg-white border border-emerald-200 rounded-full text-xs font-bold shadow-sm hover:bg-emerald-50 transition-colors">
                        <CheckSquare className="w-3.5 h-3.5" /> Add Todo
                    </button>
                    <button onClick={handleToggleFeedback} className="flex items-center gap-1.5 px-4 py-1.5 text-white bg-[#DA7756] border border-[#c96546] rounded-full text-xs font-bold shadow-sm hover:bg-[#c96546] transition-all duration-150 active:scale-95">
                        <MessageSquare className="w-3.5 h-3.5" /> Feedback
                    </button>
                </div>
            </div>

            {isFeedbackOpen && (
                <div className="border-t border-[#EAE3DF] pt-3 mt-2 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="h-full rounded-xl border border-gray-100 bg-white p-3 shadow-sm">
                            <div className="flex items-center gap-2 mb-3">
                                <div className="w-7 h-7 rounded-lg bg-orange-50 flex items-center justify-center">
                                    <MessageSquare className="w-3.5 h-3.5 text-[#DA7756]" />
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-gray-900 leading-none">Provide Feedback</p>
                                    <p className="text-[10px] font-medium text-gray-400 mt-0.5">Share rating and feedback</p>
                                </div>
                            </div>
                            <div className="rounded-lg border border-gray-100 bg-gray-50/70 px-3 py-2 mb-2">
                                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Rating</p>
                                <div className="flex items-center gap-1">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button key={star} type="button" onClick={() => onFeedbackScoreChange?.(star)} className="rounded-lg transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-[#DA7756]/20">
                                            <Star className={`w-6 h-6 ${star <= feedbackScore ? 'fill-[#ffb000] text-[#ffb000]' : 'text-slate-300'}`} />
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">Feedback Message</p>
                            <textarea
                                autoFocus
                                value={feedbackText}
                                onChange={(e) => onFeedbackChange?.(e.target.value)}
                                placeholder="Enter constructive feedback..."
                                rows={3}
                                className="w-full min-h-[68px] resize-none rounded-lg border border-[#F0E8E3] bg-[#FFFCFA] px-3 py-2 text-xs text-neutral-800 placeholder:text-gray-400 shadow-sm outline-none transition-all focus:border-[#DA7756] focus:ring-2 focus:ring-[#DA7756]/15"
                            />
                            <div className="flex items-center gap-2 mt-3">
                                <button
                                    onClick={async () => {
                                        await onSubmitFeedback?.();
                                        onFetchRatings?.();
                                    }}
                                    disabled={feedbackLoading}
                                    className="inline-flex h-8 flex-1 items-center justify-center rounded-full bg-[#DA7756] px-4 text-xs font-bold text-white shadow-sm transition-colors hover:bg-[#c96546] disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    {feedbackLoading ? 'Submitting...' : 'Submit Feedback'}
                                </button>
                                <button onClick={() => setIsFeedbackOpen(false)} className="inline-flex h-8 items-center justify-center rounded-full border border-gray-200 bg-white px-4 text-xs font-bold text-neutral-700 shadow-sm transition-all duration-150 hover:bg-gray-50 active:scale-95">
                                    Cancel
                                </button>
                            </div>
                        </div>

                        <div className="h-full bg-white rounded-xl p-2.5 border border-gray-100 shadow-sm w-full flex flex-col">
                            <div className="flex h-8 items-center justify-between gap-2">
                                <div className="flex items-center gap-2">
                                    <div className="w-6 h-6 rounded-lg bg-purple-50 flex items-center justify-center">
                                        <Star className="w-3 h-3 text-purple-500" />
                                    </div>
                                    <p className="text-xs font-bold text-gray-900">Recent Feedbacks</p>
                                </div>
                                <a href="/business-compass/feedback" className="inline-flex h-7 items-center gap-1 rounded-full px-2 text-[11px] font-bold text-[#DA7756] hover:bg-orange-50">
                                    View All <ChevronRight className="w-3 h-3" />
                                </a>
                            </div>

                            {recentFeedbacksLoading ? (
                                <div className="flex justify-center items-center h-full py-6">
                                    <Loader2 className="w-6 h-6 animate-spin text-purple-500" />
                                </div>
                            ) : recentFeedbacks.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-full py-6 text-neutral-400">
                                    <MessageSquare className="w-8 h-8 opacity-20 mb-2" />
                                    <span className="text-xs font-medium italic">No past feedback found.</span>
                                </div>
                            ) : (
                                <div className="mt-2 space-y-2">
                                    {recentFeedbacks.slice(0, 3).map((fb: any, idx: number) => (
                                        <div key={fb.id ?? idx} className="bg-gray-50/80 px-2.5 py-2 rounded-lg border border-gray-100 shadow-sm">
                                            <div className="flex items-center gap-1 mb-1.5">
                                                {[1, 2, 3, 4, 5].map((star) => (
                                                    <Star key={star} className={`w-3 h-3 ${star <= (fb.score || 0) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200'}`} />
                                                ))}
                                                {fb.created_at && (
                                                    <span className="text-[9px] text-gray-400 ml-auto font-medium whitespace-nowrap">
                                                        {new Date(fb.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: '2-digit' })}
                                                    </span>
                                                )}
                                            </div>
                                            {fb.reviews ? (
                                                <p className="text-xs text-neutral-700 leading-relaxed">{fb.reviews}</p>
                                            ) : (
                                                <p className="text-xs text-neutral-400 italic">No review provided.</p>
                                            )}
                                            {fb.reviewer && (
                                                <p className="text-[9px] text-neutral-400 mt-1 font-semibold">- {String(fb.reviewer).trim()}</p>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 min-w-0">
                <div className="overflow-hidden rounded-2xl border border-emerald-100 bg-white shadow-sm min-h-[150px] min-w-0">
                    <div className="flex items-center justify-between gap-3 border-b border-emerald-100 bg-emerald-50/60 px-4 py-3">
                        <div className="flex items-center gap-2 text-emerald-700 font-black" style={{ fontSize: '12px' }}>
                            <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-white text-emerald-600 shadow-sm">
                                <Trophy className="w-3.5 h-3.5" />
                            </span>
                            Top Wins
                        </div>
                        <span className="rounded-full border border-emerald-200 bg-white px-2 py-0.5 text-[10px] font-black text-emerald-700">
                            {achievements.length}
                        </span>
                    </div>
                    <ul className="space-y-2 p-4 text-gray-600 font-medium" style={{ fontSize: '12px' }}>
                        {achievements.length > 0 ? (
                            achievements.map((achievement: unknown, idx: number) => {
                                const type = getReportItemType(achievement);
                                const hasView = type !== 'note' && !!getReportItemSourceId(achievement);
                                return (
                                    <li key={idx} className="flex items-start gap-2 min-w-0 rounded-xl border border-emerald-50 bg-emerald-50/35 px-3 py-2.5 shadow-sm">
                                        <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-500" />
                                        <span className={`shrink-0 text-[9px] font-black uppercase tracking-wide px-2 py-0.5 rounded-full border ${getTypePillClass(type)}`}>
                                            {type}
                                        </span>
                                        <span className="flex-1 break-words min-w-0">{getReportItemText(achievement)}</span>
                                        {hasView && (
                                            <button
                                                type="button"
                                                onClick={() => onViewItem?.(achievement)}
                                                className="shrink-0 flex items-center gap-1 px-2 py-1 rounded-[6px] bg-white border border-gray-200 text-[#DA7756] hover:bg-[#FFF3EE] transition-colors shadow-sm"
                                                title={`View ${type}`}
                                            >
                                                <Eye className="w-3 h-3" />
                                            </button>
                                        )}
                                    </li>
                                );
                            })
                        ) : (
                            <li className="flex items-center gap-2 rounded-xl border border-dashed border-emerald-100 bg-emerald-50/30 px-3 py-3">
                                <Trophy className="h-3.5 w-3.5 text-emerald-300" />
                                No achievements recorded
                            </li>
                        )}
                    </ul>
                </div>

                <div className="overflow-hidden rounded-2xl border border-blue-100 bg-white shadow-sm min-h-[150px] min-w-0">
                    <div className="border-b border-blue-100 bg-blue-50/50 px-4 py-3">
                        <div className="mb-3 flex items-center justify-between gap-3">
                            <div className="flex items-center gap-2 text-blue-700 font-black" style={{ fontSize: '12px' }}>
                                <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-white text-blue-600 shadow-sm">
                                    <Target className="w-3.5 h-3.5" />
                                </span>
                                Next Week's Priorities
                            </div>
                            <span className="rounded-full border border-blue-200 bg-white px-2 py-0.5 text-[10px] font-black text-blue-700">
                                {countDayPlans(plans)}
                            </span>
                        </div>
                        <PriorityInput
                            userId={report.user_id}
                            priorityText={priorityText}
                            selectedDay={selectedPriorityDay}
                            isOpen={isPriorityDropdownOpen}
                            isLoading={priorityLoading}
                            daysOfWeek={daysOfWeek}
                            onPriorityChange={onPriorityChange}
                            onDaySelect={onPriorityDaySelect}
                            onToggleDropdown={onTogglePriorityDropdown}
                            onSubmit={onAddPriority}
                            onKeyPress={(e) => {
                                if (e.key === 'Enter') onAddPriority();
                            }}
                        />
                    </div>
                    <ul className="space-y-2 p-4 font-bold" style={{ fontSize: '12px' }}>
                        {renderPriorities()}
                    </ul>
                </div>
            </div>

            {isTaskModalOpen &&
                createPortal(
                    <div className="fixed inset-0 z-[9999] flex">
                        <div className="flex-1 bg-black/40 backdrop-blur-sm" onClick={() => setIsTaskModalOpen(false)} />
                        <div className="relative flex flex-col bg-white shadow-2xl" style={{ width: 'min(760px, 95vw)' }}>
                            <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200 shrink-0">
                                <h2 className="text-base font-bold text-neutral-900">Add Tasks</h2>
                                <button onClick={() => setIsTaskModalOpen(false)} className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-gray-100 transition-colors text-neutral-500">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                            <div className="h-[3px] bg-[#C72030] w-full shrink-0" />
                            <div className="flex-1 overflow-y-auto">
                                <ProjectTaskCreateModal
                                    isEdit={false}
                                    onCloseModal={() => setIsTaskModalOpen(false)}
                                    className="max-w-full mx-0"
                                    prefillData={actionMemberPrefill}
                                    opportunityId={null}
                                    onSuccess={() => setIsTaskModalOpen(false)}
                                    isConversion={false}
                                />
                            </div>
                        </div>
                    </div>,
                    document.body
                )}

            <AddIssueModal
                openDialog={isIssueModalOpen}
                handleCloseDialog={() => setIsIssueModalOpen(false)}
                preSelectedProjectId={undefined}
                prefillData={actionMemberPrefill}
            />
            <AddToDoModal
                isModalOpen={isTodoModalOpen}
                setIsModalOpen={setIsTodoModalOpen}
                getTodos={async () => setIsTodoModalOpen(false)}
                prefillData={actionMemberPrefill}
            />
        </div>
    );
};
