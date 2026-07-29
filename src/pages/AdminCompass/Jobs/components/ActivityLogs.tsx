// @ts-nocheck
import { useState, useMemo } from "react";
import { useJobs } from "../JobsContext";
import { T } from "../constants";
import { ico } from "../icons";
import { pill } from "./UI";

const actionTypes = [
  { key: "all", label: "All" },
  { key: "create", label: "Created" },
  { key: "edit", label: "Edited" },
  { key: "assign", label: "Assigned" },
  { key: "activate", label: "Activated" },
  { key: "deactivate", label: "Deactivated" },
  { key: "progress", label: "Progress" },
  { key: "achievement", label: "Achieved" },
];

const actionColors = {
  create: T.growth,
  edit: T.infoBlue,
  assign: T.lavender,
  activate: T.growth,
  deactivate: T.warning,
  progress: T.orange,
  achievement: T.success,
};

const actionLabels = {
  create: "Created",
  edit: "Edited",
  assign: "Assigned",
  activate: "Activated",
  deactivate: "Deactivated",
  progress: "Progress",
  achievement: "Achieved",
};

export default function ActivityLogs() {
  const { activityLogs } = useJobs();
  const [activityFilter, setActivityFilter] = useState("all");

  const filteredLogs = useMemo(() => {
    if (activityFilter === "all") return activityLogs;
    return activityLogs.filter((log) => log.type === activityFilter);
  }, [activityLogs, activityFilter]);

  return (
    <div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 20,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ display: "flex", color: T.orange }}>
            {ico.clock}
          </span>
          <span style={{ fontSize: 14, fontWeight: 700 }}>
            Activity Logs
          </span>
          <div
            style={{
              padding: "4px 12px",
              borderRadius: 999,
              background: T.orangeSoft,
              fontSize: 11,
              fontWeight: 700,
              color: T.orange,
            }}
          >
            {activityLogs.length} entries
          </div>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 4,
            padding: 4,
            background: T.raised,
            borderRadius: T.rmd,
            border: `1px solid ${T.borderSoft}`,
            width: "fit-content",
          }}
        >
          {actionTypes.map((t) => (
            <button
              key={t.key}
              style={pill(activityFilter === t.key)}
              onClick={() => setActivityFilter(t.key)}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>
      <div
        style={{
          background: T.surface,
          border: `1px solid ${T.borderSoft}`,
          borderRadius: T.rlg,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "130px 70px 110px 1fr 1fr 110px",
            gap: 10,
            padding: "12px 20px",
            fontSize: 11,
            fontWeight: 700,
            color: T.inkMuted,
            textTransform: "uppercase",
            letterSpacing: ".05em",
            borderBottom: `1px solid ${T.borderSoft}`,
          }}
        >
          <span>Date & Time</span>
          <span>Action</span>
          <span>Entity</span>
          <span>Name</span>
          <span>Detail</span>
          <span>By</span>
        </div>
        {filteredLogs.length === 0 ? (
          <div
            style={{
              padding: "48px 20px",
              textAlign: "center",
              fontSize: 13,
              color: T.inkMuted,
            }}
          >
            No activity logs match the selected filter.
          </div>
        ) : (
          filteredLogs.map((log, i) => (
            <div
              key={log.id}
              style={{
                display: "grid",
                gridTemplateColumns: "130px 70px 110px 1fr 1fr 110px",
                gap: 10,
                padding: "12px 20px",
                fontSize: 12.5,
                borderBottom:
                  i < filteredLogs.length - 1
                    ? `1px solid ${T.borderSoft}`
                    : "none",
                alignItems: "center",
              }}
              onMouseOver={(e) =>
                (e.currentTarget.style.background = T.warm)
              }
              onMouseOut={(e) =>
                (e.currentTarget.style.background = "transparent")
              }
            >
              <span
                style={{
                  fontSize: 11.5,
                  color: T.inkMuted,
                  fontFamily: "monospace",
                }}
              >
                {log.timestamp}
              </span>
              <span
                style={{
                  padding: "2px 8px",
                  borderRadius: 999,
                  fontSize: 10,
                  fontWeight: 700,
                  background: `${actionColors[log.type] || T.kpiCream}30`,
                  color: actionColors[log.type] || T.ink,
                }}
              >
                {actionLabels[log.type] || log.type}
              </span>
              <span
                style={{
                  padding: "2px 8px",
                  borderRadius: 999,
                  fontSize: 10,
                  fontWeight: 600,
                  background:
                    log.entity === "KRA"
                      ? T.kpiBlue
                      : log.entity === "KPI"
                        ? T.kpiMint
                        : T.kpiLav,
                }}
              >
                {log.entity}
              </span>
              <span style={{ fontWeight: 600, fontSize: 12 }}>
                {log.name}
              </span>
              <span style={{ color: T.inkSoft, fontSize: 12 }}>
                {log.detail}
              </span>
              <span style={{ fontSize: 12, color: T.inkSoft }}>
                {log.user}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
