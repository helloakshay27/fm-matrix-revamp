import { CalendarDays, ChevronLeft, ChevronRight, Clock3, Timer, UsersRound } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { WeekPicker } from '../WeekPicker';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface WeekSelectorProps {
    currentWeek: Date;
    selectedMeeting: string;
    meetingConfigs: any[];
    loading: boolean;
    weeklyData: any | null;
    onPreviousWeek: () => void;
    onNextWeek: () => void;
    onWeekChange: (date: Date) => void;
    onMeetingChange: (value: string) => void;
}

export const WeekSelector = ({
    currentWeek,
    selectedMeeting,
    meetingConfigs,
    loading,
    weeklyData,
    onPreviousWeek,
    onNextWeek,
    onWeekChange,
    onMeetingChange,
}: WeekSelectorProps) => {
    const mondayDate = new Date(currentWeek.getTime() - (currentWeek.getDay() === 0 ? 6 : currentWeek.getDay() - 1) * 24 * 60 * 60 * 1000);
    const sundayDate = new Date(currentWeek.getTime() + (7 - (currentWeek.getDay() === 0 ? 6 : currentWeek.getDay() - 1) - 1) * 24 * 60 * 60 * 1000);
    const selectedConfig = weeklyData?.config || meetingConfigs.find((config) => String(config.id) === selectedMeeting);
    const meetingHeads = selectedConfig?.meeting_heads || [];
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const meetingDay = selectedConfig?.day_name || dayNames[selectedConfig?.day_of_week] || '';
    const submittedCount = weeklyData?.member_reports?.filter((report: any) => report.weekly_report !== null).length ?? weeklyData?.submitted ?? 0;
    const missedCount = weeklyData?.member_reports?.filter((report: any) => report.weekly_report === null).length ?? weeklyData?.missed ?? 0;

    return (
        <div className="rounded-2xl border border-[#DA7756]/20 bg-[#fff8f5] p-4 shadow-sm min-w-0 max-w-full overflow-hidden">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
                <div className="grid flex-1 gap-3 min-w-0">
                    <div className="flex flex-wrap items-center gap-3 min-w-0">
                        <label className="text-xs font-black uppercase tracking-wide text-[#9a553f]">Week</label>
                        <div className="flex w-full items-center gap-1 min-w-0 sm:w-auto">
                            <Button
                                variant="outline"
                                size="icon"
                                className="h-9 w-9 shrink-0 rounded-xl border border-[#DA7756]/25 bg-white text-[#DA7756] shadow-sm hover:bg-[#fef6f4]"
                                onClick={onPreviousWeek}
                            >
                                <ChevronLeft className="w-4 h-4" />
                            </Button>
                            <WeekPicker currentWeek={currentWeek} onWeekChange={onWeekChange} />
                            <Button
                                variant="outline"
                                size="icon"
                                className="h-9 w-9 shrink-0 rounded-xl border border-[#DA7756]/25 bg-white text-[#DA7756] shadow-sm hover:bg-[#fef6f4]"
                                onClick={onNextWeek}
                            >
                                <ChevronRight className="w-4 h-4" />
                            </Button>
                        </div>
                        <span className="text-sm font-semibold text-neutral-600 whitespace-normal">
                            ({mondayDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - {sundayDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })})
                        </span>
                        <div className="hidden h-6 w-px bg-[#DA7756]/20 lg:block" />
                        <label className="text-xs font-black uppercase tracking-wide text-[#9a553f]">Meeting</label>
                        <div className="min-w-0 w-full max-w-[360px] flex-1 sm:min-w-[240px]">
                            <Select value={selectedMeeting} onValueChange={onMeetingChange} disabled={loading}>
                                <SelectTrigger className="w-full rounded-xl border-[#DA7756]/20 bg-white shadow-sm">
                                    <SelectValue placeholder={loading ? 'Loading...' : 'Select meeting'} />
                                </SelectTrigger>
                                <SelectContent>
                                    {meetingConfigs.map((config) => (
                                        <SelectItem key={config.id} value={String(config.id)}>
                                            {config.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                {selectedConfig && (
                    <div className="flex flex-wrap items-center gap-2 min-w-0 text-xs">
                        {selectedConfig.meeting_time && (
                            <span className="inline-flex items-center gap-1.5 rounded-xl border border-[#DA7756]/20 bg-white px-3 py-1.5 font-semibold text-neutral-700 shadow-sm">
                                <Clock3 className="h-3.5 w-3.5 text-[#DA7756]" />
                                <span>Time: {selectedConfig.meeting_time}</span>
                            </span>
                        )}
                        {meetingDay && (
                            <span className="inline-flex items-center gap-1.5 rounded-xl border border-[#DA7756]/20 bg-white px-3 py-1.5 font-semibold text-neutral-700 shadow-sm">
                                <CalendarDays className="h-3.5 w-3.5 text-[#DA7756]" />
                                Day: {meetingDay}
                            </span>
                        )}
                        {selectedConfig.duration_minutes !== undefined && selectedConfig.duration_minutes !== null && (
                            <span className="inline-flex items-center gap-1.5 rounded-xl border border-[#DA7756]/20 bg-white px-3 py-1.5 font-semibold text-neutral-700 shadow-sm">
                                <Timer className="h-3.5 w-3.5 text-[#DA7756]" />
                                Duration: {selectedConfig.duration_minutes} min
                            </span>
                        )}
                        {meetingHeads.length > 0 && (
                            <span className="inline-flex max-w-full items-center gap-1.5 rounded-xl border border-[#DA7756]/20 bg-white px-3 py-1.5 font-semibold text-neutral-700 shadow-sm">
                                <UsersRound className="h-3.5 w-3.5 shrink-0 text-[#DA7756]" />
                                <span className="truncate">Heads: {meetingHeads.map((head: any) => head.name).filter(Boolean).join(', ')}</span>
                            </span>
                        )}
                    </div>
                )}
                </div>

                <div className="flex shrink-0 flex-wrap gap-2 xl:justify-end">
                    <div className="inline-flex h-10 flex-1 items-center justify-between gap-2 rounded-xl border border-[#DA7756]/15 bg-white px-3 shadow-sm sm:flex-none sm:justify-start">
                        <span className="text-xs font-bold text-neutral-500">Team</span>
                        <Badge className="rounded-[6px] bg-[#DA7756] text-xs font-bold text-white hover:bg-[#DA7756]">
                            {weeklyData?.total_members || 0}
                        </Badge>
                    </div>
                    <div className="inline-flex h-10 flex-1 items-center justify-between gap-2 rounded-xl border border-emerald-200 bg-white px-3 shadow-sm sm:flex-none sm:justify-start">
                        <span className="text-xs font-bold text-neutral-500">Submitted</span>
                        <Badge className="rounded-[6px] bg-emerald-600 text-xs font-bold text-white hover:bg-emerald-600">
                            {submittedCount}
                        </Badge>
                    </div>
                    <div className="inline-flex h-10 flex-1 items-center justify-between gap-2 rounded-xl border border-red-200 bg-white px-3 shadow-sm sm:flex-none sm:justify-start">
                        <span className="text-xs font-bold text-neutral-500">Missed</span>
                        <Badge className="rounded-[6px] bg-red-600 text-xs font-bold text-white hover:bg-red-600">
                            {missedCount}
                        </Badge>
                    </div>
                </div>
            </div>
        </div>
    );
};
