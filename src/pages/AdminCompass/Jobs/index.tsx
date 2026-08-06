// @ts-nocheck
import { useJobs } from "./JobsContext";
import { T } from "./constants";
import { card, pill } from "./components/UI";
import OrgSection from "./components/OrgSection";
import MembersSection from "./components/MembersSection";
import JdList from "./components/JdList";
import KraList from "./components/KraList";
import KpiList from "./components/KpiList";
import ActivityLogs from "./components/ActivityLogs";
import SettingsUnits from "./components/SettingsUnits";

export default function AdminCompassJobs() {
  const { activeNav, jobTab, setJobTab } = useJobs();

  return (
    <>
      {activeNav === "organisation" && <OrgSection />}

      {activeNav === "members" && <MembersSection />}

      {activeNav === "jobs" && (
        <>
          <div style={{ marginBottom: 24 }}>
            <h1 style={{ fontSize: 22, fontWeight: 700, margin: 0, lineHeight: 1.2 }}>
              {jobTab === "descriptions"
                ? "Jobs"
                : jobTab === "kra"
                  ? "Key Result Areas"
                  : jobTab === "kpi"
                    ? "Key Performance Indicators"
                    : jobTab === "logs"
                      ? "Activity Logs"
                      : "Settings"}
            </h1>
            <p style={{ fontSize: 13.5, color: T.inkSoft, marginTop: 4, fontWeight: 400, lineHeight: 1.6 }}>
              {jobTab === "descriptions"
                ? "Manage job descriptions, KRAs, and KPIs for every role."
                : jobTab === "kra"
                  ? "All KRAs across your organisation. Expand any row to see linked KPIs."
                  : jobTab === "kpi"
                    ? "A consolidated view of every KPI across all roles."
                    : jobTab === "logs"
                      ? "Chronological audit trail of all KRA and KPI activities."
                      : "Configure organisation-wide KPI settings and units."}
            </p>
          </div>

          <div
            style={{
              display: "flex", alignItems: "center", gap: 4,
              padding: 4, background: T.raised, borderRadius: T.rmd,
              border: `1px solid ${T.borderSoft}`, width: "fit-content", marginBottom: 28,
            }}
          >
            {[
              { key: "descriptions", label: "Job Descriptions" },
              { key: "kra", label: "KRAs" },
              { key: "kpi", label: "KPIs" },
              { key: "logs", label: "Logs" },
              { key: "settings", label: "Settings" },
            ].map((t) => (
              <button
                key={t.key}
                style={pill(jobTab === t.key)}
                onClick={() => setJobTab(t.key)}
              >
                {t.label}
              </button>
            ))}
          </div>

          {jobTab === "descriptions" && <JdList />}
          {jobTab === "kra" && <KraList />}
          {jobTab === "kpi" && <KpiList />}
          {jobTab === "logs" && <ActivityLogs />}
          {jobTab === "settings" && <SettingsUnits />}
        </>
      )}

      {!["organisation", "members", "jobs"].includes(activeNav) && (
        <div>
          <div style={{ marginBottom: 24 }}>
            <h1 style={{ fontSize: 22, fontWeight: 700, margin: 0, lineHeight: 1.2 }}>
              {activeNav.charAt(0).toUpperCase() + activeNav.slice(1)}
            </h1>
            <p style={{ fontSize: 13.5, color: T.inkSoft, marginTop: 4 }}>This section is coming soon.</p>
          </div>
          <div style={{ ...card, display: "flex", flexDirection: "column", alignItems: "center", padding: "64px 20px", textAlign: "center" }}>
            <span style={{ fontSize: 40, marginBottom: 12 }}>
              {activeNav === "dashboard" ? "📊" : activeNav === "plan" ? "📋" : activeNav === "goals" ? "🎯" : activeNav === "meetings" ? "👥" : activeNav === "members" ? "🧑‍🤝‍🧑" : activeNav === "sops" ? "📄" : "🌐"}
            </span>
            <p style={{ fontSize: 14, fontWeight: 600, color: T.inkSoft, margin: "0 0 4px" }}>
              {activeNav.charAt(0).toUpperCase() + activeNav.slice(1)} module
            </p>
            <p style={{ fontSize: 12.5, color: T.inkMuted, margin: 0 }}>We're building this section. It will be available soon.</p>
          </div>
        </div>
      )}
    </>
  );
}
