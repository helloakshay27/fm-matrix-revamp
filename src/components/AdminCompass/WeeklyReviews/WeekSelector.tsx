import { ChevronLeft, ChevronRight } from 'lucide-react';
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

    return (
        <div className="flex items-center justify-between rounded-2xl border border-[#DA7756]/20 bg-[#DA7756]/10 p-4 shadow-sm">
            <div className="flex items-center gap-4">
                <div className="flex items-center gap-3">
                    <label className="text-sm font-bold text-neutral-700">Week:</label>
                    <div className="flex items-center gap-1">
                        <Button
                            variant="outline"
                            size="icon"
                            className="h-9 w-9 rounded-xl border border-[#DA7756]/25 bg-white text-[#DA7756] hover:bg-[#fef6f4]"
                            onClick={onPreviousWeek}
                        >
                            <ChevronLeft className="w-4 h-4" />
                        </Button>
                        <WeekPicker currentWeek={currentWeek} onWeekChange={onWeekChange} />
                        <Button
                            variant="outline"
                            size="icon"
                            className="h-9 w-9 rounded-xl border border-[#DA7756]/25 bg-white text-[#DA7756] hover:bg-[#fef6f4]"
                            onClick={onNextWeek}
                        >
                            <ChevronRight className="w-4 h-4" />
                        </Button>
                    </div>
                    <span className="text-sm font-medium text-neutral-500">
                        ({mondayDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - {sundayDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })})
                    </span>
                </div>
                <div className="flex items-center gap-2">
                    <label className="text-sm font-bold text-neutral-700 block mb-1">Meeting:</label>
                    <Select value={selectedMeeting} onValueChange={onMeetingChange} disabled={loading}>
                        <SelectTrigger className="w-48">
                            <SelectValue placeholder={loading ? 'Loading...' : 'Select meeting'} />
                        </SelectTrigger>
                        <SelectContent>
                            {meetingConfigs.map((config) => (
                                <SelectItem key={config.id} value={config.id}>
                                    {config.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div className="flex items-center gap-4">
                <div className="flex flex-col items-center gap-2">
                    <span className="text-sm text-neutral-600">Team</span>
                    <Badge className="rounded-[6px] bg-[#DA7756] text-xs font-bold text-white hover:bg-[#DA7756]">
                        {weeklyData?.total_members || 0}
                    </Badge>
                </div>
                <div className="flex flex-col items-center gap-2">
                    <span className="text-sm text-neutral-600">Submitted</span>
                    <Badge className="rounded-[6px] bg-[#DA7756] text-xs font-bold text-white hover:bg-[#DA7756]">
                        {weeklyData?.submitted || 0}
                    </Badge>
                </div>
                <div className="flex flex-col items-center gap-2">
                    <span className="text-sm text-neutral-600">Missed</span>
                    <Badge className="rounded-[6px] bg-[#DA7756] text-xs font-bold text-white hover:bg-[#DA7756]">
                        {weeklyData?.missed || 0}
                    </Badge>
                </div>
            </div>
        </div>
    );
};
