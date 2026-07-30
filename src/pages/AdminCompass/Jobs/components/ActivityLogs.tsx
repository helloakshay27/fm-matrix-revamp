// @ts-nocheck
import { useJobs } from "../JobsContext";
import { T } from "../constants";
import { ico } from "../icons";

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

  return (
    <div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          marginBottom: 20,
        }}
      >
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
        {activityLogs.length === 0 ? (
          <div
            style={{
              padding: "48px 20px",
              textAlign: "center",
              fontSize: 13,
              color: T.inkMuted,
            }}
          >
            No activity logs yet.
          </div>
        ) : (
          activityLogs.map((log, i) => (
            <div
              key={log.id}
              style={{
                display: "grid",
                gridTemplateColumns: "130px 70px 110px 1fr 1fr 110px",
                gap: 10,
                padding: "12px 20px",
                fontSize: 12.5,
                borderBottom:
                  i < activityLogs.length - 1
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
