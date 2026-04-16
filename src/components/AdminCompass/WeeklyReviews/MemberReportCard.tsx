import { ChevronDown, ChevronUp } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { PriorityInput } from './PriorityInput';
import { FeedbackInput } from './FeedbackInput';
import { ReportExpandedView } from './ReportExpandedView';

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
    return (
        <div
            className={`rounded-2xl border transition-all p-3 px-4 ${report.status === 'submitted' ? 'border-blue-300 bg-blue-50/50' : 'border-[#DA7756]/20 bg-white'
                }`}
        >
            {/* Top Row: Checkbox, Name, Badges, Score, Days, Date */}
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                    <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={(e) => onUserCheck?.(e.target.checked)}
                        className="w-5 h-5 accent-blue-600 cursor-pointer rounded-md border-gray-300"
                    />
                    <span className="font-bold text-[#1e293b] text-base">{report.name}</span>
                </div>

                <div className="flex items-center gap-3">
                    {/* Badges */}
                    <div className="flex items-center gap-2">
                        {report.department && (
                            <Badge className="h-6 rounded-md bg-white border border-blue-200 text-blue-600 text-[10px] font-semibold hover:bg-white shadow-sm px-2">
                                {report.department}
                            </Badge>
                        )}
                        <Badge className="h-6 rounded-md bg-white border border-orange-200 text-orange-600 text-[10px] font-bold hover:bg-white shadow-sm px-2 flex items-center gap-1">
                            <span className="text-orange-400">👑</span> HOD
                        </Badge>
                    </div>

                    {/* Score */}
                    <div className="h-7 px-3 flex items-center bg-white border border-gray-200 rounded-md shadow-sm">
                        <span className="text-xs font-bold text-gray-800">{report.report_data?.score || '28.5'}/100</span>
                    </div>

                    {/* Day Indicators */}
                    <div className="flex items-center gap-1">
                        {['M', 'T', 'W', 'Th', 'F', 'S', 'S'].map((day, idx) => (
                            <div
                                key={idx}
                                className={`w-6 h-6 flex items-center justify-center rounded-md text-[10px] font-bold text-white ${idx < 3 ? 'bg-green-500' : 'bg-red-500'
                                    }`}
                            >
                                {day}
                            </div>
                        ))}
                    </div>

                    {/* Date */}
                    <div className="text-[11px] text-gray-400 font-medium ml-1">
                        {report.report_data?.submitted_at
                            ? new Date(report.report_data.submitted_at).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                            })
                            : 'Apr 8, 10:36 AM'}
                    </div>
                </div>
            </div>

            {/* Middle Row: Priority Input, Feedback Input, Meetings Summary */}
            <div className="flex items-start gap-4">
                {/* Priority Section */}
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

                {/* Feedback Section */}
                <FeedbackInput
                    userId={report.user_id}
                    feedbackText={feedbackText}
                    score={feedbackScore}
                    isLoading={feedbackLoading[report.user_id] || false}
                    onFeedbackChange={onFeedbackChange}
                    onScoreChange={onFeedbackScoreChange}
                    onSubmit={onSubmitFeedback}
                />

                {/* Meetings Summary Section */}
                <div className="w-44 bg-white border border-gray-200 rounded-xl p-2 shadow-sm text-[10px]">
                    <div className="flex items-center justify-between mb-1.5 px-1">
                        <span className="font-bold text-gray-500 tracking-wider">MEETINGS APR</span>
                    </div>
                    <div className="space-y-1.5 px-1">
                        <div className="flex items-center gap-2">
                            <span className="text-gray-400 w-6">Test</span>
                            <div className="flex gap-1">
                                {[0, 1, 2, 3, 4].map((i) => (
                                    <div key={i} className={`w-2.5 h-2.5 rounded-full ${i < 2 ? 'bg-red-500' : 'bg-gray-200'}`} />
                                ))}
                            </div>
                        </div>
                        <div className="flex items-center gap-1.5 pt-0.5 border-t border-gray-50 text-[8px] text-gray-400">
                            <div className="flex items-center gap-0.5">
                                <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                                Done
                            </div>
                            <div className="flex items-center gap-0.5">
                                <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
                                Miss
                            </div>
                            <div className="flex items-center gap-0.5">
                                <div className="w-1.5 h-1.5 rounded-full bg-yellow-400" />
                                Hol
                            </div>
                            <div className="flex items-center gap-0.5">
                                <div className="w-1.5 h-1.5 rounded-full bg-gray-200" />-
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom: Expand Toggle */}
            <div className="mt-2 flex justify-center">
                <button
                    onClick={onExpand}
                    className="flex items-center gap-1.5 text-[10px] text-gray-400 hover:text-gray-600 font-medium transition-colors"
                >
                    {isExpanded ? (
                        <>
                            <ChevronUp className="w-3 h-3" />
                            Collapse
                            <ChevronUp className="w-3 h-3" />
                        </>
                    ) : (
                        <>
                            <ChevronDown className="w-3 h-3" />
                            Expand KPIs, Goals, Tasks & more
                            <ChevronDown className="w-3 h-3" />
                        </>
                    )}
                </button>
            </div>

            {/* Expanded Section */}
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
    );
};
