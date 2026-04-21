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
  // Yahan par initial state "Daily" set kar diya hai
  const [activeTab, setActiveTab] = useState("Daily");
  const [selectedDateId, setSelectedDateId] = useState(7);

  return (
    <div
      className="mx-auto border border-[rgba(218,119,86,0.16)] bg-[#f6f4ee] shadow-[0_18px_50px_rgba(15,23,42,0.05)]"
      style={{
        background: C.pageBg,
        color: C.textMain,
        fontFamily: "'Poppins', sans-serif",
      }}
    >
      <div className="px-6 pt-6 max-w-7xl mx-auto">
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
      </div>

      {/* ── Tab bar ── */}
      <div className="p-6 pb-0">
        <div
          className="flex overflow-x-auto max-w-7xl mx-auto"
          style={{
            background: "#EEEEF0",
            borderRadius: "999px",
            padding: "5px",
            gap: "2px",
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
                  "flex items-center justify-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 whitespace-nowrap flex-1",
                  isActive
                    ? "bg-white text-neutral-900 shadow-sm"
                    : "bg-transparent text-neutral-500 hover:text-neutral-700"
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
        className={
          activeTab !== "Settings" ? "p-6 max-w-7xl mx-auto" : "px-2 pb-2"
        }
        style={{ fontFamily: "'Poppins', sans-serif" }}
      >
        {activeTab === "Daily" && (
          <DailyTab
            selectedDateId={selectedDateId}
            setSelectedDateId={setSelectedDateId}
          />
        )}
        {activeTab === "Daily Log" && <DailyLogTab />}
        {activeTab === "History" && <HistoryTab />}
        {activeTab === "Reports" && <ReportsTab />}
        {activeTab === "Analytics" && <AnalyticsTab />}
        {activeTab === "Settings" && <SettingsTab />}
      </div>
    </div>
  );
};

export default DailyMeeting;
