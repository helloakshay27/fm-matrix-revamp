import React from 'react'
import { Calendar, Plus } from 'lucide-react'
import { Button } from "@/components/ui/button"

const WeeklyMeetingSettings = () => {
    return (
        <div className="mt-6 space-y-6 rounded-2xl border border-[#DA7756]/20 bg-[#fffaf8] p-6 shadow-sm">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-xl font-bold text-[#1a1a1a]">Weekly Meeting Configurations</h2>
                    <p className="text-neutral-500 text-sm mt-1">Configure recurring weekly meetings and their participants</p>
                </div>
                <Button className="h-10 gap-2 rounded-xl bg-[#DA7756] px-4 font-bold text-white hover:bg-[#c9673f]">
                    <Plus className="w-4 h-4" />
                    New Meeting
                </Button>
            </div>

            {/* Empty State */}
            <div className="flex flex-col items-center justify-center space-y-6 rounded-2xl border border-[#DA7756]/15 bg-[#fef6f4] py-20 text-center">
                <div className="rounded-2xl border border-[#DA7756]/15 bg-white p-4">
                    <Calendar className="w-12 h-12 text-[#DA7756]" strokeWidth={1.5} />
                </div>
                <div className="space-y-1">
                    <h3 className="text-[#1a1a1a] font-bold text-lg">No weekly meetings configured</h3>
                    <p className="text-neutral-500 text-sm">Create your first weekly meeting configuration to get started</p>
                </div>
                <Button className="h-11 gap-2 rounded-xl bg-[#DA7756] px-6 font-bold text-white hover:bg-[#c9673f]">
                    <Plus className="w-5 h-5" />
                    Create Meeting
                </Button>
            </div>
        </div>
    )
}

export default WeeklyMeetingSettings
