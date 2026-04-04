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
import { C } from "./AdminCompassComponent/shared";
import { AdminViewEmulation } from "@/components/AdminViewEmulation";

const tabs = [
  { name: "Daily", icon: Calendar },
  { name: "Daily Log", icon: FileText },
  { name: "History", icon: HistoryIcon },
  { name: "Reports", icon: FileSpreadsheet },
  { name: "Analytics", icon: BarChart2 },
  { name: "Settings", icon: Settings },
];

const DailyMeeting = () => {
  const [activeTab, setActiveTab] = useState("Daily Log");
  const [selectedDateId, setSelectedDateId] = useState(7);

  return (
    <>
    
      <div
        className="space-y-6 mx-auto"
        style={{ background: C.pageBg, color: C.textMain }}
      >
        {/* ── Page Header ── */}
        <div className="px-6 pt-6 max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-900">Daily Meetings</h1>
          <p className="text-sm text-gray-500 mt-1">
            Review daily reports and conduct team meetings
          </p>
        </div>

        {/* ── Tab bar ── */}
        <div className="px-6 pb-0">
          <div className="flex space-x-1 bg-[#DA7756] rounded-2xl p-1 overflow-x-auto max-w-7xl mx-auto">
            {tabs.map(({ name, icon: Icon }) => {
              const isActive = activeTab === name;
              return (
                <button
                  key={name}
                  onClick={() => setActiveTab(name)}
                  className={cn(
                    "flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-150 whitespace-nowrap flex-1",
                    isActive
                      ? "bg-white text-[#DA7756] shadow-sm"
                      : "bg-transparent text-white/75 hover:bg-white/15 hover:text-white"
                  )}
                >
                  <Icon className="w-4 h-4 flex-shrink-0" /> {name}
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Tab content ── */}
        <div className={activeTab !== "Settings" ? "p-6 max-w-7xl mx-auto" : ""}>
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
    </>
  );
};

export default DailyMeeting;