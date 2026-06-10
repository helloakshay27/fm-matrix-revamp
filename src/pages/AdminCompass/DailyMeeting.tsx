// ─────────────────────────────────────────────
// DailyMeeting.jsx  —  Root component
// ─────────────────────────────────────────────
import React, { useState } from "react";
import DailyLogTab from "./AdminCompassComponent/Dailylogtab";
import ReportsTab from "./AdminCompassComponent/Reportstab";
import HistoryTab from "./AdminCompassComponent/Historytab";
import AnalyticsTab from "./AdminCompassComponent/Analyticstab";
import SettingsTab from "./AdminCompassComponent/Settingstab";
import DailyTab from "./AdminCompassComponent/Dailytab";

const tabs = ["Daily", "Daily Log", "History", "Reports", "Analytics", "Settings"];

const getLocalDateKey = (date = new Date()) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const DailyMeeting = () => {
  const [activeTab, setActiveTab] = useState("Daily");
  const [selectedMeetingDate, setSelectedMeetingDate] = useState(() =>
    getLocalDateKey()
  );
  const [selectedMeetingId, setSelectedMeetingId] = useState("");

  const handleMeetingSaved = (date: string) => {
    setSelectedMeetingDate(date);
    setActiveTab("Log");
  };

  return (
    <div
      style={{
        padding: "32px",
        backgroundColor: "#f8fafc",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        gap: "0px",
        fontFamily: "'Poppins', sans-serif",
        color: "#1a1a1a",
      }}
    >
      {/* ── Page Header ── */}
      <div style={{ marginBottom: "8px" }}>
        <h1
          style={{
            fontSize: "22px",
            fontWeight: 700,
            color: "#1a1a1a",
            margin: 0,
          }}
        >
          Daily Meetings
        </h1>
        <p style={{ fontSize: "13px", color: "#6b7280", marginTop: "4px" }}>
          Review daily reports and conduct team meetings
        </p>
      </div>

      {/* ── Tab bar ── */}
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
        {tabs.map((name) => {
          const isActive = activeTab === name;
          return (
            <button
              key={name}
              onClick={() => setActiveTab(name)}
              style={{
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
                      backgroundColor: "#DA7756",
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
                  (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#f3f4f6";
                  (e.currentTarget as HTMLButtonElement).style.color = "#374151";
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  (e.currentTarget as HTMLButtonElement).style.backgroundColor = "transparent";
                  (e.currentTarget as HTMLButtonElement).style.color = "#6b7280";
                }
              }}
            >
              {name}
            </button>
          );
        })}
      </div>

      {/* ── Tab content ── */}
      <div>
        {activeTab === "Daily" && (
          <DailyTab
            selectedDate={selectedMeetingDate}
            onSelectedDateChange={setSelectedMeetingDate}
            selectedMeetingId={selectedMeetingId}
            onSelectedMeetingChange={setSelectedMeetingId}
            onMeetingSaved={handleMeetingSaved}
          />
        )}
        {activeTab === "Daily Log" && (
          <DailyLogTab
            initialDate={selectedMeetingDate}
            onSelectedDateChange={setSelectedMeetingDate}
            selectedMeetingId={selectedMeetingId}
            onSelectedMeetingChange={setSelectedMeetingId}
          />
        )}
        {activeTab === "History" && (
          <HistoryTab
            initialDate={selectedMeetingDate}
            onSelectedDateChange={setSelectedMeetingDate}
            selectedMeetingId={selectedMeetingId}
            onSelectedMeetingChange={setSelectedMeetingId}
          />
        )}
        {activeTab === "Reports" && (
          <ReportsTab
            selectedMeetingId={selectedMeetingId}
            onSelectedMeetingChange={setSelectedMeetingId}
          />
        )}
        {activeTab === "Analytics" && (
          <AnalyticsTab
            selectedMeetingId={selectedMeetingId}
            onSelectedMeetingChange={setSelectedMeetingId}
          />
        )}
        {activeTab === "Settings" && <SettingsTab />}
      </div>
    </div>
  );
};

export default DailyMeeting;
