// @ts-nocheck
import { useEffect } from "react";
import { useJobs } from "../JobsContext";
import { T } from "../constants";
import { ico } from "../icons";
import { SkeletonRows } from "./UI";

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

const logColumns =
  "112px 106px 62px 180px minmax(320px, 1fr) 140px";
const logTableMinWidth = 920;
const logCell = { minWidth: 0 };
const mutedTruncateCell = {
  ...logCell,
  overflow: "hidden",
  textOverflow: "ellipsis",
};

export default function ActivityLogs() {
  const {
    activityLogs,
    logsLoading,
    logsError,
    logsPage,
    logsMeta,
    loadActivityLogs,
  } = useJobs();

  useEffect(() => {
    loadActivityLogs(1);
  }, [loadActivityLogs]);

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
          {logsMeta.total ?? activityLogs.length} entries
        </div>
      </div>
      <div
        style={{
          background: T.surface,
          border: `1px solid ${T.borderSoft}`,
          borderRadius: T.rlg,
          overflowX: "auto",
          overflowY: "hidden",
        }}
      >
        <div style={{ minWidth: logTableMinWidth }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: logColumns,
            justifyContent: "start",
            gap: 8,
            padding: "12px 14px",
            fontSize: 11,
            fontWeight: 700,
            color: T.inkMuted,
            textTransform: "uppercase",
            letterSpacing: ".05em",
            borderBottom: `1px solid ${T.borderSoft}`,
          }}
        >
          <span style={logCell}>Date & Time</span>
          <span style={logCell}>Action</span>
          <span style={logCell}>Entity</span>
          <span style={logCell}>Name</span>
          <span style={logCell}>Detail</span>
          <span style={logCell}>By</span>
        </div>
        {logsLoading ? (
          <SkeletonRows
            rows={8}
            columns={logColumns}
          />
        ) : logsError ? (
          <div
            style={{
              padding: "48px 20px",
              textAlign: "center",
              fontSize: 13,
              color: T.danger,
            }}
          >
            Could not load activity logs: {logsError}
          </div>
        ) : activityLogs.length === 0 ? (
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
                gridTemplateColumns: logColumns,
                justifyContent: "start",
                gap: 8,
                padding: "12px 14px",
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
                  ...logCell,
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
                  justifySelf: "start",
                  background: `${actionColors[log.type] || T.kpiCream}30`,
                  color: actionColors[log.type] || T.ink,
                }}
              >
                {log.action || actionLabels[log.type] || log.type}
              </span>
              <span
                style={{
                  padding: "2px 8px",
                  borderRadius: 999,
                  fontSize: 10,
                  fontWeight: 600,
                  justifySelf: "start",
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
              <span style={{ ...mutedTruncateCell, fontWeight: 600, fontSize: 12 }} title={log.name || undefined}>
                {log.name}
              </span>
              {/* Detail — "Weightage 50 → 60": label muted, purani value
                  strike-through, nayi value highlighted. */}
              <span
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  alignItems: "center",
                  gap: 6,
                  minWidth: 0,
                  maxWidth: "100%",
                  fontSize: 12,
                  lineHeight: 1.45,
                  color: T.inkSoft,
                }}
                title={log.detail || undefined}
              >
                {(log.changes?.length ? log.changes : null)?.map(
                  (change, ci) => (
                    <span
                      key={ci}
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 5,
                        minWidth: 0,
                        maxWidth: "100%",
                        flexBasis: "100%",
                        flexWrap: "wrap",
                      }}
                    >
                      {change.label && (
                        <span style={{ color: T.inkMuted, fontWeight: 600, whiteSpace: "nowrap" }}>
                          {change.label}
                        </span>
                      )}
                      {change.from !== undefined && change.to !== undefined ? (
                        <>
                          <span
                            style={{
                              color: T.inkMuted,
                              textDecoration: "line-through",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {change.from}
                          </span>
                          <span style={{ color: T.inkMuted }}>→</span>
                          <span style={{ color: T.growth, fontWeight: 700, whiteSpace: "nowrap" }}>
                            {change.to}
                          </span>
                        </>
                      ) : change.value !== undefined ? (
                        <span style={{ color: T.ink, fontWeight: 600, whiteSpace: "nowrap" }}>
                          {change.value}
                        </span>
                      ) : (
                        <span style={{ color: T.ink, fontWeight: 600 }}>
                          {change.text}
                        </span>
                      )}
                    </span>
                  )
                ) || (
                  <span style={{ color: T.inkMuted }}>No field changes</span>
                )}
              </span>
              <span style={{ ...mutedTruncateCell, fontSize: 12, color: T.inkSoft }} title={log.user || undefined}>
                {log.user}
              </span>
            </div>
          ))
        )}
        </div>
      </div>
      {(logsPage > 1 || logsMeta.hasMore) && (
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: 8,
            marginTop: 14,
          }}
        >
          <button
            type="button"
            disabled={logsLoading || logsPage <= 1}
            onClick={() => loadActivityLogs(logsPage - 1)}
            style={{
              padding: "8px 12px",
              borderRadius: T.rsm,
              border: `1px solid ${T.borderSoft}`,
              background: T.raised,
              color: logsPage <= 1 ? T.inkMuted : T.ink,
              cursor: logsLoading || logsPage <= 1 ? "not-allowed" : "pointer",
              fontSize: 12,
              fontWeight: 700,
            }}
          >
            Previous
          </button>
          <button
            type="button"
            disabled={logsLoading || !logsMeta.hasMore}
            onClick={() => loadActivityLogs(logsPage + 1)}
            style={{
              padding: "8px 12px",
              borderRadius: T.rsm,
              border: `1px solid ${T.borderSoft}`,
              background: T.raised,
              color: !logsMeta.hasMore ? T.inkMuted : T.ink,
              cursor: logsLoading || !logsMeta.hasMore ? "not-allowed" : "pointer",
              fontSize: 12,
              fontWeight: 700,
            }}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
