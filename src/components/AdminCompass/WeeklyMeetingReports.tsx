import React from 'react'
import { Calendar, ChevronDown } from 'lucide-react'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

const WeeklyMeetingReports = () => {
    return (
        <div className="mt-6 space-y-6 rounded-2xl border border-[#DA7756]/20 bg-[#fffaf8] p-6 shadow-sm">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-xl font-bold text-[#1a1a1a]">Weekly Meeting Reports & Analytics</h2>
                    <p className="text-neutral-500 text-sm mt-1">Comprehensive insights for weekly meetings</p>
                </div>
                <div className="flex items-center gap-3">
                    <Select defaultValue="all">
                        <SelectTrigger className="w-[180px] h-9 rounded-xl border border-[#DA7756]/25 bg-white text-neutral-700 shadow-sm focus:ring-2 focus:ring-[#DA7756]/20 focus:border-[#DA7756]">
                            <SelectValue placeholder="All Meetings" />
                        </SelectTrigger>
                        <SelectContent className="bg-white border-[#DA7756]/20">
                            <SelectItem value="all">All Meetings</SelectItem>
                            <SelectItem value="marketing">Marketing Team</SelectItem>
                            <SelectItem value="sales">Sales Team</SelectItem>
                            <SelectItem value="product">Product Team</SelectItem>
                        </SelectContent>
                    </Select>

                    <Select defaultValue="12weeks">
                        <SelectTrigger className="w-[140px] h-9 rounded-xl border border-[#DA7756]/25 bg-white text-neutral-700 shadow-sm focus:ring-2 focus:ring-[#DA7756]/20 focus:border-[#DA7756]">
                            <SelectValue placeholder="Last 12 Weeks" />
                        </SelectTrigger>
                        <SelectContent className="bg-white border-[#DA7756]/20">
                            <SelectItem value="4weeks">Last 4 Weeks</SelectItem>
                            <SelectItem value="8weeks">Last 8 Weeks</SelectItem>
                            <SelectItem value="12weeks">Last 12 Weeks</SelectItem>
                            <SelectItem value="6months">Last 6 Months</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* Empty State */}
            <div className="flex flex-col items-center justify-center space-y-4 rounded-2xl border border-[#DA7756]/15 bg-[#fef6f4] py-20 text-center">
                <div className="rounded-2xl bg-white p-4 border border-[#DA7756]/15">
                    <Calendar className="w-12 h-12 text-[#DA7756]/30" strokeWidth={1.5} />
                </div>
                <div className="space-y-1">
                    <h3 className="text-[#1a1a1a] font-bold text-lg">No meetings found</h3>
                    <p className="text-neutral-500 text-sm">Create a weekly meeting configuration to see reports</p>
                </div>
            </div>
        </div>
    )
}

export default WeeklyMeetingReports
