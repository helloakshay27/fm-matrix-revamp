import WeeklyReviews from "@/components/AdminCompass/WeeklyReviews";
import WeeklyLog from "@/components/AdminCompass/WeeklyLog";
import MeetingHistory from "@/components/AdminCompass/MeetingHistory";
import WeeklyMeetingReports from "@/components/AdminCompass/WeeklyMeetingReports";
import WeeklyMeetingSettings from "@/components/AdminCompass/WeeklyMeetingSettings";
import { AdminViewEmulation } from "@/components/AdminViewEmulation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Calendar,
  ChartColumn,
  FileText,
  History,
  Settings,
} from "lucide-react";

const WeeklyMeetings = () => {
  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto bg-[#f6f4ee]">
      {/* Header Section */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-[#1a1a1a]">Weekly Meetings</h1>
          <p className="text-neutral-500 mt-1">
            Review weekly reports and conduct team meetings
          </p>
        </div>
      </div>

      <Tabs defaultValue="weekly">
        <TabsList className="w-full rounded-2xl bg-[#DA7756] p-1 h-auto">
          <TabsTrigger
            value="weekly"
            className="w-full rounded-xl text-sm font-semibold text-white/80 data-[state=active]:bg-white data-[state=active]:text-[#DA7756] data-[state=active]:shadow-sm"
          >
            <Calendar className="h-4 w-4 mr-2" />
            Weekly
          </TabsTrigger>
          <TabsTrigger
            value="weeklyLog"
            className="w-full rounded-xl text-sm font-semibold text-white/80 data-[state=active]:bg-white data-[state=active]:text-[#DA7756] data-[state=active]:shadow-sm"
          >
            <FileText className="h-4 w-4 mr-2" />
            Weekly Log
          </TabsTrigger>
          <TabsTrigger
            value="meetingHistory"
            className="w-full rounded-xl text-sm font-semibold text-white/80 data-[state=active]:bg-white data-[state=active]:text-[#DA7756] data-[state=active]:shadow-sm"
          >
            <History className="h-4 w-4 mr-2" />
            Meeting History
          </TabsTrigger>
          <TabsTrigger
            value="reports"
            className="w-full rounded-xl text-sm font-semibold text-white/80 data-[state=active]:bg-white data-[state=active]:text-[#DA7756] data-[state=active]:shadow-sm"
          >
            <ChartColumn className="h-4 w-4 mr-2" />
            Reports
          </TabsTrigger>
          <TabsTrigger
            value="settings"
            className="w-full rounded-xl text-sm font-semibold text-white/80 data-[state=active]:bg-white data-[state=active]:text-[#DA7756] data-[state=active]:shadow-sm"
          >
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="weekly" className="mt-5">
          <WeeklyReviews />
        </TabsContent>
        <TabsContent value="weeklyLog" className="mt-5">
          <WeeklyLog />
        </TabsContent>
        <TabsContent value="meetingHistory" className="mt-5">
          <MeetingHistory />
        </TabsContent>
        <TabsContent value="reports" className="mt-5">
          <WeeklyMeetingReports />
        </TabsContent>
        <TabsContent value="settings" className="mt-5">
          <WeeklyMeetingSettings />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default WeeklyMeetings;
