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
  const [activeTab, setActiveTab] = useState("Daily Log");
  const [selectedDateId, setSelectedDateId] = useState(7);

  return (
    <div
      className="mx-auto rounded-[28px] border border-[rgba(218,119,86,0.16)] bg-[#f6f4ee] shadow-[0_18px_50px_rgba(15,23,42,0.05)]"
      style={{ background: C.pageBg, color: C.textMain }}
    >
      {/* ── Tab bar ── */}
      <div className="p-6 pb-0">
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
      <div className={activeTab !== "Settings" ? "p-6 max-w-7xl mx-auto" : "px-2 pb-2"}>
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
