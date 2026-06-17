// ─────────────────────────────────────────────
// DailyMeeting.jsx  —  Root component
// ─────────────────────────────────────────────
import React, { useEffect, useState } from "react";
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
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== "undefined"
      ? window.matchMedia("(max-width: 640px)").matches
      : false
  );

  useEffect(() => {
    if (typeof window === "undefined") return;

    const mediaQuery = window.matchMedia("(max-width: 640px)");
    const onChange = (event: MediaQueryListEvent) => setIsMobile(event.matches);

    setIsMobile(mediaQuery.matches);
    mediaQuery.addEventListener("change", onChange);

    return () => mediaQuery.removeEventListener("change", onChange);
  }, []);

  const handleMeetingSaved = (date: string) => {
    setSelectedMeetingDate(date);
    setActiveTab("History");
  };

  return (
    <div
      style={{
        padding: "clamp(12px, 3vw, 24px)",
        backgroundColor: "#f8fafc",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        gap: "0px",
        fontFamily: "'Poppins', sans-serif",
        color: "#1a1a1a",
        boxSizing: "border-box",
      }}
    >
      <div style={{ width: "100%", maxWidth: "1200px", margin: "0 auto" }}>
      {/* ── Page Header ── */}
      <div style={{ marginBottom: "8px" }}>
        <h1
          style={{
            fontSize: "clamp(18px, 5vw, 24px)",
            fontWeight: 700,
            color: "#1a1a1a",
            margin: 0,
          }}
        >
          Daily Meetings
        </h1>
        <p style={{ fontSize: "clamp(11px, 3vw, 13px)", color: "#6b7280", marginTop: "4px" }}>
          Review daily reports and conduct team meetings
        </p>
      </div>

      {/* ── Tab controls ── */}
      {isMobile ? (
        <div
          style={{
            marginTop: "14px",
            marginBottom: "18px",
            backgroundColor: "#ffffff",
            borderRadius: "14px",
            border: "1px solid #e5e7eb",
            boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
            padding: "8px",
          }}
        >
          <label
            htmlFor="daily-meeting-tab-select"
            style={{
              display: "block",
              fontSize: "11px",
              color: "#6b7280",
              marginBottom: "6px",
              fontWeight: 600,
            }}
          >
            Navigate Section
          </label>
          <select
            id="daily-meeting-tab-select"
            value={activeTab}
            onChange={(e) => setActiveTab(e.target.value)}
            style={{
              width: "100%",
              borderRadius: "10px",
              border: "1px solid #d1d5db",
              background: "#fff",
              color: "#1f2937",
              fontFamily: "'Poppins', sans-serif",
              fontSize: "14px",
              fontWeight: 600,
              padding: "10px 12px",
              outline: "none",
            }}
          >
            {tabs.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>
        </div>
      ) : (
        <div
          style={{
            display: "flex",
            gap: "4px",
            overflowX: "auto",
            WebkitOverflowScrolling:
              "touch" as React.CSSProperties["WebkitOverflowScrolling"],
            scrollbarWidth: "none" as React.CSSProperties["scrollbarWidth"],
            marginTop: "16px",
            marginBottom: "20px",
            padding: "5px",
            backgroundColor: "#ffffff",
            borderRadius: "9999px",
            border: "1px solid #e5e7eb",
            boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
            alignSelf: "stretch",
          }}
        >
          {tabs.map((name) => {
            const isActive = activeTab === name;
            return (
              <button
                key={name}
                onClick={() => setActiveTab(name)}
                style={{
                  padding: "7px 14px",
                  borderRadius: "9999px",
                  fontSize: "clamp(11px, 2vw, 13.5px)",
                  fontWeight: isActive ? 700 : 500,
                  whiteSpace: "nowrap",
                  transition: "all 0.18s ease",
                  cursor: "pointer",
                  border: "none",
                  fontFamily: "'Poppins', sans-serif",
                  letterSpacing: "0.01em",
                  flexShrink: 0,
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
                    (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                      "#f3f4f6";
                    (e.currentTarget as HTMLButtonElement).style.color = "#374151";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                      "transparent";
                    (e.currentTarget as HTMLButtonElement).style.color = "#6b7280";
                  }
                }}
              >
                {name}
              </button>
            );
          })}
        </div>
      )}

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
    </div>
  );
};

export default DailyMeeting;
