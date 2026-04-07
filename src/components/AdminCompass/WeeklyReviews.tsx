import {
    ChevronLeft,
    ChevronRight,
    Calendar as CalendarIcon,
    AlertTriangle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { WeekPicker } from './WeekPicker';

const missedReports = [
    'Common Admin Id', 'Punit Jain', 'Adhip Shetty', 'Manav Gandhi', 'Yash Rathod', 'Arun Mohan', 'Kshitij Rasal', 'Bilal Shaikh',
    'Mahendra Lungare', 'Akshay Shinde', 'Jyoti', 'Ravi Sampat', 'Fatema Tashrifwala', 'Chetan Bafna', 'Akshit Baid', 'Sadanand Gupta'
];

const WeeklyReviews = () => {
    return (
        <div className="space-y-6 mt-6">
            {/* Week Selector and Stats */}
            <div className="flex items-center justify-between rounded-2xl border border-[#DA7756]/20 bg-[#DA7756]/10 p-4 shadow-sm">
                <div className="flex items-center gap-3">
                    <label className="text-sm font-bold text-neutral-700">Week:</label>
                    <div className="flex items-center gap-1">
                        <Button variant="outline" size="icon" className="h-9 w-9 rounded-xl border border-[#DA7756]/25 bg-white text-[#DA7756] hover:bg-[#fef6f4]">
                            <ChevronLeft className="w-4 h-4" />
                        </Button>
                        <WeekPicker />
                        <Button variant="outline" size="icon" className="h-9 w-9 rounded-xl border border-[#DA7756]/25 bg-white text-[#DA7756] hover:bg-[#fef6f4]">
                            <ChevronRight className="w-4 h-4" />
                        </Button>
                    </div>
                    <span className="text-sm font-medium text-neutral-500">(Mar 23 - Mar 29)</span>
                </div>

                <div className="flex items-center gap-4">
                    <div className="flex flex-col items-center gap-2">
                        <span className="text-sm text-neutral-600">Team</span>
                        <Badge className="rounded-[6px] bg-[#DA7756] text-xs font-bold text-white hover:bg-[#DA7756]">16</Badge>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                        <span className="text-sm text-neutral-600">Submitted</span>
                        <Badge className="rounded-[6px] bg-[#DA7756] text-xs font-bold text-white hover:bg-[#DA7756]">0</Badge>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                        <span className="text-sm text-neutral-600">Missed</span>
                        <Badge className="rounded-[6px] bg-[#DA7756] text-xs font-bold text-white hover:bg-[#DA7756]">16</Badge>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="space-y-6 rounded-2xl border border-[#DA7756]/20 bg-[#fffaf8] p-6 shadow-sm">
                <div className="flex items-center gap-2">
                    <CalendarIcon className="w-5 h-5 text-[#DA7756]" />
                    <h2 className="text-lg font-bold text-[#1a1a1a]">Team Reviews - Week 13 (Mar 23 - Mar 29)</h2>
                </div>

                <div className="space-y-3 rounded-xl border border-[#DA7756]/20 bg-[#fef6f4] p-4">
                    <div className="flex items-center gap-2 text-sm font-bold text-[#DA7756]">
                        <AlertTriangle className="w-5 h-5" />
                        <span>Missed Reports (16):</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {missedReports.map((name, idx) => (
                            <Badge key={idx} className="rounded-[6px] bg-[#DA7756] text-xs text-white hover:bg-[#DA7756]">
                                {name}
                            </Badge>
                        ))}
                    </div>
                </div>

                <div className="flex flex-col items-center justify-center space-y-4 rounded-2xl bg-[#fef6f4] py-16 text-center border border-[#DA7756]/15">
                    <div className="rounded-2xl border border-[#DA7756]/15 bg-white p-6">
                        <CalendarIcon className="w-12 h-12 text-[#DA7756]/30" strokeWidth={1.5} />
                    </div>
                    <div className="space-y-1">
                        <p className="text-neutral-700 font-bold text-lg">No reviews submitted for this week</p>
                        <p className="text-neutral-500 font-medium text-sm">1 total reviews in database for other weeks</p>
                        <p className="text-neutral-500 font-medium text-xs">Week 13, 2026 - 16 team members</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WeeklyReviews;
