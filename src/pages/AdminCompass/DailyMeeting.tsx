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

const getLocalDateKey = (date = new Date()) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const DailyMeeting = () => {
  const [activeTab, setActiveTab] = useState("Daily");
  const [selectedMeetingDate, setSelectedMeetingDate] = useState(
    () => getLocalDateKey()
  );

  const handleMeetingSaved = (date: string) => {
    setSelectedMeetingDate(date);
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
            className="bg-[#DA7756] p-1.5 rounded-[12px] h-auto flex w-full shadow-inner mb-6 gap-1 overflow-x-auto"
            style={{
              fontFamily: "'Poppins', sans-serif",
            }}
          >
            {tabs.map(({ name }) => {
              const isActive = activeTab === name;
              return (
                <button
                  key={name}
                  onClick={() => setActiveTab(name)}
                  style={{ fontFamily: "'Poppins', sans-serif" }}
                  className={cn(
                    "flex-1 rounded-[10px] px-8 py-2 bg-transparent text-white transition-all font-bold text-sm whitespace-nowrap text-center",
                    isActive
                      ? "bg-white text-[#DA7756] shadow-md"
                      : "hover:bg-white/20"
                  )}
                >
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
            <DailyTab
              selectedDate={selectedMeetingDate}
              onSelectedDateChange={setSelectedMeetingDate}
              onMeetingSaved={handleMeetingSaved}
            />
          )}
          {activeTab === "Daily Log" && (
            <DailyLogTab
              initialDate={selectedMeetingDate}
              onSelectedDateChange={setSelectedMeetingDate}
            />
          )}
          {activeTab === "History" && (
            <HistoryTab
              initialDate={selectedMeetingDate}
              onSelectedDateChange={setSelectedMeetingDate}
            />
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
