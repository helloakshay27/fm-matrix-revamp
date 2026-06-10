import { useState } from "react";
import WeeklyReviews from "@/components/AdminCompass/WeeklyReviews";
import WeeklyLog from "@/components/AdminCompass/WeeklyLog";
import MeetingHistory from "@/components/AdminCompass/MeetingHistory";
import WeeklyMeetingReports from "@/components/AdminCompass/WeeklyMeetingReports";
import WeeklyMeetingSettings from "@/components/AdminCompass/WeeklyMeetingSettings";
import {
  Calendar,
  ChartColumn,
  FileText,
  History,
  Settings,
} from "lucide-react";

const PRIMARY = "#DA7756";

const TABS = [
  { key: "weekly", label: "Weekly", Icon: Calendar },
  { key: "weeklyLog", label: "Weekly Log", Icon: FileText },
  { key: "meetingHistory", label: "Meeting History", Icon: History },
  { key: "reports", label: "Reports", Icon: ChartColumn },
  { key: "settings", label: "Settings", Icon: Settings },
] as const;

type TabKey = (typeof TABS)[number]["key"];

const WeeklyMeetings = () => {
  const [selectedWeekDate, setSelectedWeekDate] = useState(() => new Date());
  const [activeTab, setActiveTab] = useState<TabKey>("weekly");
  const [selectedMeetingId, setSelectedMeetingId] = useState("");

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

      {/* Tab Bar */}
      <div
        style={{
          display: "inline-flex",
          gap: "4px",
          overflowX: "auto",
          marginTop: "16px",
          marginBottom: "24px",
          padding: "5px",
          backgroundColor: "#ffffff",
          borderRadius: "9999px",
          border: "1px solid #e5e7eb",
          boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
          alignSelf: "flex-start",
        }}
      >
        {TABS.map(({ key, label, Icon }) => {
          const isActive = activeTab === key;
          return (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                padding: "7px 22px",
                borderRadius: "9999px",
                fontSize: "13.5px",
                fontWeight: isActive ? 700 : 500,
                whiteSpace: "nowrap",
                transition: "all 0.18s ease",
                cursor: "pointer",
                border: "none",
                fontFamily: "'Poppins', sans-serif",
                letterSpacing: "0.01em",
                ...(isActive
                  ? {
                      backgroundColor: PRIMARY,
                      color: "#ffffff",
                      boxShadow: "0 2px 10px rgba(218,119,86,0.30)",
                    }
                  : {
                      backgroundColor: "transparent",
                      color: "#6b7280",
                    }),
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.backgroundColor = "#f3f4f6";
                  e.currentTarget.style.color = "#374151";
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.backgroundColor = "transparent";
                  e.currentTarget.style.color = "#6b7280";
                }
              }}
            >
              <Icon style={{ width: 15, height: 15, flexShrink: 0 }} />
              {label}
            </button>
          );
        })}
      </div>

      <div className="mt-5">
        {activeTab === "weekly" && (
          <WeeklyReviews
            initialWeekDate={selectedWeekDate}
            onWeekDateChange={setSelectedWeekDate}
            selectedMeetingId={selectedMeetingId}
            onSelectedMeetingChange={setSelectedMeetingId}
            onMeetingSaved={() => setActiveTab("meetingHistory")}
          />
        )}
        {activeTab === "weeklyLog" && (
          <WeeklyLog
            initialWeekDate={selectedWeekDate}
            onWeekDateChange={setSelectedWeekDate}
            selectedMeetingId={selectedMeetingId}
            onSelectedMeetingChange={setSelectedMeetingId}
          />
        )}
        {activeTab === "meetingHistory" && (
          <MeetingHistory
            initialWeekDate={selectedWeekDate}
            onWeekDateChange={setSelectedWeekDate}
          />
        )}
        {activeTab === "reports" && (
          <WeeklyMeetingReports
            selectedMeetingId={selectedMeetingId}
            onSelectedMeetingChange={setSelectedMeetingId}
          />
        )}
        {activeTab === "settings" && <WeeklyMeetingSettings />}
      </div>
    </div>
  );
};

export default WeeklyMeetings;
