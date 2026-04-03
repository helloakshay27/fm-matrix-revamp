import {
    History,
    RefreshCw,
    ChevronLeft,
    ChevronRight,
    Calendar as CalendarIcon
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { WeekPicker } from './WeekPicker';

const MeetingHistory = () => {
    return (
        <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm space-y-6 mt-6">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-50 rounded-lg">
                        <History className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-[#1a1a1a]">Weekly Meeting History</h2>
                        <p className="text-sm text-gray-500 font-medium">View and edit past weekly meeting reports</p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                        <Button variant="outline" size="icon" className="h-9 w-9 !bg-white !border-gray-200 rounded-[8px] shadow-sm">
                            <ChevronLeft className="w-4 h-4 text-gray-600" />
                        </Button>
                        <WeekPicker />
                        <Button variant="outline" size="icon" className="h-9 w-9 !bg-white !border-gray-200 rounded-[8px] shadow-sm">
                            <ChevronRight className="w-4 h-4 text-gray-600" />
                        </Button>
                    </div>

                    <Button variant="outline" className="h-9 px-4 !bg-white !border-gray-200 rounded-[8px] !text-gray-700 gap-2 font-bold shadow-sm">
                        <RefreshCw className="w-4 h-4 !text-gray-700" />
                        Refresh
                    </Button>
                </div>
            </div>

            {/* Content Area - Empty State */}
            <div className="bg-[#F8F9FB] border border-gray-100 rounded-2xl p-20 flex flex-col items-center justify-center text-center space-y-4">
                <div className="text-gray-200">
                    <History className="w-16 h-16" strokeWidth={1.5} />
                </div>
                <p className="text-gray-500 font-medium text-lg">No meetings found for Week 13, 2026</p>
            </div>
        </div>
    );
};

export default MeetingHistory;
