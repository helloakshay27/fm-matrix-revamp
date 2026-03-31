import WeeklyReviews from "@/components/AdminCompass/WeeklyReviews"
import WeeklyLog from "@/components/AdminCompass/WeeklyLog"
import MeetingHistory from "@/components/AdminCompass/MeetingHistory"
import WeeklyMeetingReports from "@/components/AdminCompass/WeeklyMeetingReports"
import WeeklyMeetingSettings from "@/components/AdminCompass/WeeklyMeetingSettings"
import { AdminViewEmulation } from "@/components/AdminViewEmulation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, ChartColumn, FileText, History, Settings } from "lucide-react"

const WeeklyMeetings = () => {
    return (
        <div className="p-6 space-y-6 max-w-7xl mx-auto">
            <AdminViewEmulation />
            {/* Header Section */}
            <div className="flex justify-between items-start">
                <div>
                    <h1 className="text-3xl font-bold text-[#1a1a1a]">Weekly Meetings</h1>
                    <p className="text-gray-500 mt-1">Review weekly reports and conduct team meetings</p>
                </div>
            </div>

            <Tabs defaultValue="weekly">
                <TabsList className='w-full rounded-[10px] bg-primary'>
                    <TabsTrigger value="weekly" className='w-full rounded-[8px]'>
                        <Calendar className="h-4 w-4 mr-2" />
                        Weekly
                    </TabsTrigger>
                    <TabsTrigger value="weeklyLog" className='w-full rounded-[8px]'>
                        <FileText className="h-4 w-4 mr-2" />
                        Weekly Log
                    </TabsTrigger>
                    <TabsTrigger value="meetingHistory" className='w-full rounded-[8px]'>
                        <History className="h-4 w-4 mr-2" />
                        Meeting History
                    </TabsTrigger>
                    <TabsTrigger value="reports" className='w-full rounded-[8px]'>
                        <ChartColumn className="h-4 w-4 mr-2" />
                        Reports
                    </TabsTrigger>
                    <TabsTrigger value="settings" className='w-full rounded-[8px]'>
                        <Settings className="h-4 w-4 mr-2" />
                        Settings
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="weekly">
                    <WeeklyReviews />
                </TabsContent>
                <TabsContent value="weeklyLog">
                    <WeeklyLog />
                </TabsContent>
                <TabsContent value="meetingHistory">
                    <MeetingHistory />
                </TabsContent>
                <TabsContent value="reports">
                    <WeeklyMeetingReports />
                </TabsContent>
                <TabsContent value="settings">
                    <WeeklyMeetingSettings />
                </TabsContent>
            </Tabs>
        </div>
    )
}

export default WeeklyMeetings