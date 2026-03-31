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
            <div className="bg-[#F8F7FA] border border-gray-100 rounded-xl p-4 shadow-sm flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <label className="text-sm font-bold text-gray-600">Week:</label>
                    <div className="flex items-center gap-1">
                        <Button variant="outline" size="icon" className="!bg-white !border-gray-200 !rounded-[8px]">
                            <ChevronLeft className="w-4 h-4" />
                        </Button>
                        <WeekPicker />
                        <Button variant="outline" size="icon" className="!bg-white !border-gray-200 !rounded-[8px]">
                            <ChevronRight className="w-4 h-4" />
                        </Button>
                    </div>
                    <span className="text-sm text-gray-500 font-medium">(Mar 23 - Mar 29)</span>
                </div>

                <div className="flex items-center gap-4">
                    <div className="flex flex-col items-center gap-2">
                        <span className="text-sm text-gray-600">Team</span>
                        <Badge className="bg-[#475569] hover:bg-[#475569] text-white rounded-[6px] text-xs font-bold">16</Badge>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                        <span className="text-sm text-gray-600">Submitted</span>
                        <Badge className="bg-[#22C55E] hover:bg-[#22C55E] text-white rounded-[6px] text-xs font-bold">0</Badge>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                        <span className="text-sm text-gray-600">Missed</span>
                        <Badge className="bg-[#EF4444] hover:bg-[#EF4444] text-white rounded-[6px] text-xs font-bold">16</Badge>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm space-y-6">
                <div className="flex items-center gap-2">
                    <CalendarIcon className="w-5 h-5 text-gray-500" />
                    <h2 className="text-lg font-bold text-[#1a1a1a]">Team Reviews - Week 13 (Mar 23 - Mar 29)</h2>
                </div>

                <div className="bg-[#FFF1F2] border border-[#FECDD3] rounded-xl p-4 space-y-3">
                    <div className="flex items-center gap-2 text-sm font-bold text-[#DC2626]">
                        <AlertTriangle className="w-5 h-5" />
                        <span>Missed Reports (16):</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {missedReports.map((name, idx) => (
                            <Badge key={idx} className="bg-[#EF4444] hover:bg-[#EF4444] text-white rounded-[6px] text-xs">
                                {name}
                            </Badge>
                        ))}
                    </div>
                </div>

                <div className="flex flex-col items-center justify-center text-center space-y-4 py-16 bg-[#F8F7FA] rounded-[10px]">
                    <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                        <CalendarIcon className="w-12 h-12 text-gray-300" strokeWidth={1.5} />
                    </div>
                    <div className="space-y-1">
                        <p className="text-gray-600 font-bold text-lg">No reviews submitted for this week</p>
                        <p className="text-gray-400 font-medium text-sm">1 total reviews in database for other weeks</p>
                        <p className="text-gray-400 font-medium text-xs">Week 13, 2026 - 16 team members</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WeeklyReviews;
