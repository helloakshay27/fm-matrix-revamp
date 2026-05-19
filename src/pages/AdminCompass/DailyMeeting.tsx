// ─────────────────────────────────────────────
// DailyMeeting.jsx  —  Root component
// ─────────────────────────────────────────────
import React, { useState } from "react";
import {
  Calendar,
  FileText,
  History as HistoryIcon,
  BarChart2,
  Settings,
  FileSpreadsheet,
} from "lucide-react";
import { cn } from "@/lib/utils";
import DailyLogTab from "./AdminCompassComponent/Dailylogtab";
import HistoryTab from "./AdminCompassComponent/Historytab";
import ReportsTab from "./AdminCompassComponent/Reportstab";
import AnalyticsTab from "./AdminCompassComponent/Analyticstab";
import SettingsTab from "./AdminCompassComponent/Settingstab";
import DailyTab from "./AdminCompassComponent/Dailytab";
import { C } from "./AdminCompassComponent/Shared";

const tabs = [
  { name: "Daily", icon: Calendar },
  { name: "Daily Log", icon: FileText },
  { name: "History", icon: HistoryIcon },
  { name: "Reports", icon: FileSpreadsheet },
  { name: "Analytics", icon: BarChart2 },
  { name: "Settings", icon: Settings },
];

const DailyMeeting = () => {
  const [activeTab, setActiveTab] = useState("Daily");
  const [selectedDateId, setSelectedDateId] = useState(7);

  const [historyInitialDate, setHistoryInitialDate] = useState<
    string | undefined
  >();

  const handleMeetingSaved = (date: string) => {
    setHistoryInitialDate(date);
    setActiveTab("History"); // apna tab key yahan use karo
  };

  return (
    <div
      className="w-full min-h-screen p-6"
      style={{
        background: C.pageBg,
        color: C.textMain,
        fontFamily: "'Poppins', sans-serif",
      }}
    >
      <div className="max-w-7xl mx-auto">
        <h1
          className="text-3xl font-bold"
          style={{ fontFamily: "'Poppins', sans-serif" }}
        >
          Daily Meetings
        </h1>
        <p
          className="text-sm text-gray-500 mt-1"
          style={{ fontFamily: "'Poppins', sans-serif" }}
        >
          Review daily reports and conduct team meetings
        </p>

        {/* ── Tab bar ── */}
        <div className="mt-5">
          <div
            className="flex w-full rounded-2xl p-1 gap-1 overflow-x-auto"
            style={{
              background: "#DA7756",
              fontFamily: "'Poppins', sans-serif",
            }}
          >
            {tabs.map(({ name, icon: Icon }) => {
              const isActive = activeTab === name;
              return (
                <button
                  key={name}
                  onClick={() => setActiveTab(name)}
                  style={{ fontFamily: "'Poppins', sans-serif" }}
                  className={cn(
                    "flex items-center w-full justify-center gap-2 px-5 py-2 rounded-xl text-sm font-bold transition-all duration-150 whitespace-nowrap",
                    isActive
                      ? "bg-white text-[#DA7756] shadow-sm"
                      : "bg-transparent text-white hover:bg-white/20"
                  )}
                >
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  {name}
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Tab content ── */}
        <div
          className={activeTab !== "Settings" ? "mt-6" : "mt-2"}
          style={{ fontFamily: "'Poppins', sans-serif" }}
        >
          {activeTab === "Daily" && (
            <DailyTab onMeetingSaved={handleMeetingSaved} />
          )}
          {activeTab === "Daily Log" && <DailyLogTab />}
          {activeTab === "History" && (
            <HistoryTab initialDate={historyInitialDate} />
          )}
          {activeTab === "Reports" && <ReportsTab />}
          {activeTab === "Analytics" && <AnalyticsTab />}
          {activeTab === "Settings" && <SettingsTab />}
        </div>
      </div>
    </div>
  );
};

export default DailyMeeting;
