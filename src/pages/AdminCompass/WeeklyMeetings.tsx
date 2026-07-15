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

const responsiveStyles = `
  .weekly-meetings-page {
    width: 100%;
    min-width: 0;
    overflow-x: hidden;
  }

  .weekly-meetings-page,
  .weekly-meetings-page * {
    box-sizing: border-box;
  }

  .weekly-meetings-header,
  .weekly-meetings-content {
    min-width: 0;
    max-width: 100%;
  }

  .weekly-meetings-tabs {
    max-width: 100%;
    scrollbar-width: none;
    -ms-overflow-style: none;
  }

  .weekly-meetings-tabs::-webkit-scrollbar {
    display: none;
  }

  .weekly-meeting-tab {
    flex: 0 0 auto;
  }

  .weekly-meetings-content > * {
    min-width: 0;
    max-width: 100%;
  }

  @media (max-width: 640px) {
    .weekly-meetings-page {
      padding: 14px 12px 72px !important;
      max-width: 100% !important;
      margin: 0 !important;
      border-radius: 0;
    }

    .weekly-meetings-header {
      flex-direction: column;
      gap: 6px;
      align-items: stretch;
    }

    .weekly-meetings-title {
      font-size: 22px;
      line-height: 1.2;
    }

    .weekly-meetings-subtitle {
      font-size: 12px;
      line-height: 1.45;
      max-width: 280px;
    }

    .weekly-meetings-tabs {
      display: flex !important;
      width: 100% !important;
      margin-top: 12px !important;
      margin-bottom: 14px !important;
      border-radius: 14px !important;
      padding: 4px !important;
    }

    .weekly-meeting-tab {
      padding: 6px 9px !important;
      font-size: 11px !important;
      gap: 4px !important;
      min-height: 30px;
    }

    .weekly-meeting-tab svg {
      width: 13px !important;
      height: 13px !important;
    }

    .weekly-meetings-content {
      margin-top: 12px !important;
      width: 100%;
      overflow-x: hidden;
    }

    .weekly-meetings-content > div {
      margin-top: 12px !important;
    }

    .weekly-meetings-content :where(.p-6) {
      padding: 14px !important;
    }

    .weekly-meetings-content :where(.p-5, .p-4) {
      padding: 12px !important;
    }

    .weekly-meetings-content :where(.px-5, .px-6) {
      padding-left: 12px !important;
      padding-right: 12px !important;
    }

    .weekly-meetings-content :where(.py-20, .p-20) {
      padding-top: 40px !important;
      padding-bottom: 40px !important;
    }

    .weekly-meetings-content :where(.rounded-2xl) {
      border-radius: 14px !important;
    }

    .weekly-meetings-content :where(.gap-6) {
      gap: 12px !important;
    }

    .weekly-meetings-content :where(.text-xl) {
      font-size: 18px !important;
      line-height: 1.3 !important;
    }

    .weekly-meetings-content :where(.text-lg) {
      font-size: 16px !important;
      line-height: 1.35 !important;
    }

    .weekly-meetings-content :where(input, textarea, button, [role="combobox"]) {
      max-width: 100%;
    }

    .weekly-meetings-content [class*="w-["],
    .weekly-meetings-content [class*="min-w-["],
    .weekly-meetings-content [class*="max-w-"] {
      max-width: 100% !important;
    }

    .weekly-meetings-content table {
      min-width: 720px;
    }

    .weekly-meetings-content :where(th, td) {
      white-space: normal;
    }

    @supports selector(:has(*)) {
      .weekly-meetings-content :where(div):has(table) {
        max-width: 100%;
        overflow-x: auto !important;
        -webkit-overflow-scrolling: touch;
      }
    }
  }
`;

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
    <div className="weekly-meetings-page p-6 space-y-6 max-w-7xl mx-auto bg-[#f6f4ee]">
      <style>{responsiveStyles}</style>
      {/* Header Section */}
      <div className="weekly-meetings-header flex justify-between items-start">
        <div>
          <h1 className="weekly-meetings-title text-3xl font-bold text-[#1a1a1a]">Weekly Meetings</h1>
          <p className="weekly-meetings-subtitle text-neutral-500 mt-1">
            Review weekly reports and conduct team meetings
          </p>
        </div>
      </div>

      {/* Tab Bar */}
      <div
        className="weekly-meetings-tabs"
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
              className="weekly-meeting-tab"
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

      <div className="weekly-meetings-content mt-5">
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
