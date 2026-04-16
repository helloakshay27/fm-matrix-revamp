import { Users, RefreshCw, Send, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface MeetingNotesProps {
    meetingNotes: string;
    markAllAttended: boolean;
    aiSummary: boolean;
    saveMeetingLoading?: boolean;
    onMeetingNotesChange: (value: string) => void;
    onMarkAllAttendedChange: (value: boolean) => void;
    onAiSummaryChange: (value: boolean) => void;
    onSaveMeeting: () => void;
    onClearNotes: () => void;
}

export const MeetingNotes = ({
    meetingNotes,
    markAllAttended,
    aiSummary,
    saveMeetingLoading = false,
    onMeetingNotesChange,
    onMarkAllAttendedChange,
    onAiSummaryChange,
    onSaveMeeting,
    onClearNotes,
}: MeetingNotesProps) => {
    return (
        <div className="bg-white border border-[rgba(218,119,86,0.18)] rounded-2xl overflow-hidden shadow-sm">
            {/* Header */}
            <div className="flex items-center justify-between p-3 border-b border-[rgba(218,119,86,0.1)] bg-[#FFFAF8]">
                <div className="flex items-center gap-2 font-semibold text-neutral-800 text-sm">
                    <Users className="w-4 h-4 text-[#CE7A5A]" />
                    Meeting Notes
                </div>
                <button
                    onClick={onClearNotes}
                    className="inline-flex items-center justify-center w-8 h-8 rounded-xl bg-white border border-[#CE7A5A]/40 text-neutral-500 hover:bg-[#fef6f4] hover:text-[#DA7756] active:scale-95 transition-all"
                    title="Refresh"
                >
                    <RefreshCw className="w-3.5 h-3.5" />
                </button>
            </div>

            {/* Content */}
            <div className="p-4">
                <textarea
                    value={meetingNotes}
                    onChange={(e) => onMeetingNotesChange(e.target.value)}
                    placeholder="Enter meeting remarks, feedback, action items..."
                    className="w-full border border-[rgba(218,119,86,0.18)] rounded-2xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[rgba(218,119,86,0.22)] min-h-[100px] resize-y placeholder:text-neutral-400 text-neutral-700 bg-[#FFFAF8]"
                />
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between bg-[#FFFAF8] p-3 px-4 border-t border-[rgba(218,119,86,0.1)]">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                        type="checkbox"
                        checked={markAllAttended}
                        onChange={(e) => onMarkAllAttendedChange(e.target.checked)}
                        disabled={saveMeetingLoading}
                        className="w-4 h-4 rounded border-gray-300 accent-[#CE7A5A] cursor-pointer disabled:opacity-50"
                    />
                    <span className="text-sm font-medium text-[#1A1A1A]">Mark All Attended</span>
                </label>
                <div className="flex items-center gap-2">
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                        <input
                            type="checkbox"
                            checked={aiSummary}
                            onChange={(e) => onAiSummaryChange(e.target.checked)}
                            disabled={saveMeetingLoading}
                            className="w-4 h-4 rounded border-gray-300 accent-[#CE7A5A] cursor-pointer disabled:opacity-50"
                        />
                        <span className="text-sm font-medium text-[#1A1A1A]">AI Summary</span>
                    </label>
                    <Button
                        size="sm"
                        disabled={saveMeetingLoading}
                        className="px-6 py-2 h-8 text-xs bg-[#CE7A5A] hover:bg-[#BC6B4A] text-white rounded-2xl font-semibold disabled:opacity-60 disabled:cursor-not-allowed"
                        onClick={onSaveMeeting}
                    >
                        {saveMeetingLoading ? (
                            <div className="flex items-center gap-2">
                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                <span>Saving...</span>
                            </div>
                        ) : (
                            'Save Meeting'
                        )}
                    </Button>
                </div>
            </div>
        </div>
    );
};
