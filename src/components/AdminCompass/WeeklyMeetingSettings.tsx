import React from 'react'
import { Calendar, Plus } from 'lucide-react'
import { Button } from "@/components/ui/button"

const WeeklyMeetingSettings = () => {
    return (
        <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm space-y-6 mt-6">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-xl font-bold text-[#1a1a1a]">Weekly Meeting Configurations</h2>
                    <p className="text-gray-500 text-sm mt-1">Configure recurring weekly meetings and their participants</p>
                </div>
                <Button className="bg-[#6366f1] hover:bg-[#5558e3] text-white rounded-[8px] h-10 px-4 font-bold gap-2">
                    <Plus className="w-4 h-4" />
                    New Meeting
                </Button>
            </div>

            {/* Empty State */}
            <div className="bg-white border border-gray-100 rounded-2xl py-20 flex flex-col items-center justify-center text-center space-y-6">
                <div className="p-4 bg-gray-50 rounded-2xl">
                    <Calendar className="w-12 h-12 text-gray-300" strokeWidth={1.5} />
                </div>
                <div className="space-y-1">
                    <h3 className="text-[#1a1a1a] font-bold text-lg">No weekly meetings configured</h3>
                    <p className="text-gray-500 text-sm">Create your first weekly meeting configuration to get started</p>
                </div>
                <Button className="bg-[#6366f1] hover:bg-[#5558e3] text-white rounded-[8px] h-11 px-6 font-bold gap-2">
                    <Plus className="w-5 h-5" />
                    Create Meeting
                </Button>
            </div>
        </div>
    )
}

export default WeeklyMeetingSettings
