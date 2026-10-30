import { useEffect, useState } from "react";
import { KPI_ICONS, fmt } from "./data";
import { Skeleton } from "@/components/ui/skeleton";
import { PathIcon } from "./icons";
import { InfoButton } from "./InfoButton";
import type { ClosureProgress, InspectionKpi } from "./viInspectionDashboardApi";

interface InspectionOverviewProps {
  kpi: InspectionKpi | null;
  closure: ClosureProgress | null;
  loading: boolean;
  activeGroup: string | null;
  onJump: (panel: string, group: string) => void;
}

// KPI cards from GET /vi_inspection_dashboard/kpi. The CAPA cards jump to the Action Plans section.
const LIVE_KPIS: { key: keyof InspectionKpi; label: string; info: string; color: string; tint: string; icon: string; panel?: string; group?: string }[] = [
  { key: "total_inspections", label: "Total Inspections", info: "Inspections submitted in the selected period and filters.", color: "var(--terra)", tint: "rgba(218,119,86,.12)", icon: KPI_ICONS.document },
  { key: "total_observations", label: "Total Observations", info: "Checklist items answered “No” on those inspections.", color: "var(--vi-red)", tint: "rgba(238,39,55,.10)", icon: KPI_ICONS.clock },
  { key: "capa_planned", label: "CAPA Planned", info: "Corrective and preventive action plans created by the SPOC.", color: "var(--warn)", tint: "rgba(237,196,136,.22)", icon: KPI_ICONS.pen, panel: "acc-act", group: "act" },
  { key: "capa_closed", label: "CAPA Closed", info: "Action plans closed by the Action Owner.", color: "var(--blue)", tint: "rgba(107,155,204,.16)", icon: KPI_ICONS.check, panel: "acc-act", group: "act" },
];

const closurePct = (planned: number, closed: number) => (planned ? `${Math.round((closed / planned) * 100)}%` : "—");

const closureBadge = (planned: number, closed: number) => {
  if (!planned) return "b-neutral";
  const pct = (closed / planned) * 100;
  return pct >= 90 ? "b-ok" : pct >= 70 ? "b-warn" : "b-err";
};

export function InspectionOverview({ kpi, closure, loading, activeGroup, onJump }: InspectionOverviewProps) {
  const sheets = closure?.checksheets ?? [];
  const [sheetId, setSheetId] = useState<number | null>(null);
  // Default to the first checksheet that has data; keep the user's pick while it still exists.
  useEffect(() => {
    if (sheets.some((sheet) => sheet.inspection_type_id === sheetId)) return;
    setSheetId((sheets.find((sheet) => sheet.rows.length > 0) ?? sheets[0])?.inspection_type_id ?? null);
  }, [sheets, sheetId]);
  const sheet = sheets.find((item) => item.inspection_type_id === sheetId);

  return (
    <>
      <div className="sec" id="sec-overview">
        <div className="sec-hd"><div className="sec-lbl">Overview — Inspection Snapshot</div><div className="sec-line" /></div>
        <div className="kpi-grid flow-kpi-grid">
          {LIVE_KPIS.map((item) => (
            <div
              key={item.key}
              className={`kpi flow-kpi${item.group && activeGroup === item.group ? " kpi-active" : ""}`}
              style={{ ["--kpi-c" as string]: item.color, ["--kpi-tint" as string]: item.tint, cursor: item.panel ? "pointer" : "default" }}
              onClick={() => item.panel && item.group && onJump(item.panel, item.group)}
            >
              <div className="kpi-top">
                <div className="kpi-lbl">{item.label}<InfoButton text={item.info} /></div>
                <div className="kpi-ico"><PathIcon d={item.icon} size={14} /></div>
              </div>
              <div className="kpi-val">{loading ? <Skeleton className="h-6 w-20" /> : kpi ? fmt(kpi[item.key]) : "-"}</div>
              {item.panel && <div className="kpi-flow-arrow">↓ tap to view Action Plans</div>}
            </div>
          ))}
        </div>
      </div>
      <div className="sec" id="sec-heatmap">
        <div className="card">
          <div className="card-hd">
            <div>
              <div className="card-title">Closure Progress by Circle<InfoButton text="Per checksheet (inspection type): sites mapped, inspections completed, observations and CAPA planned vs closed for each circle." /></div>
              <div className="card-sub">Pick a checksheet · closure % = CAPA closed ÷ CAPA planned</div>
            </div>
          </div>
          {!loading && sheets.length > 0 && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 12 }}>
              {sheets.map((item) => (
                <button
                  key={item.inspection_type_id}
                  type="button"
                  className={`persona-pill${item.inspection_type_id === sheetId ? " active" : ""}`}
                  onClick={() => setSheetId(item.inspection_type_id)}
                >
                  {item.checksheet} ({item.rows.length})
                </button>
              ))}
            </div>
          )}
          <div className="tbl-scroll" style={{ maxHeight: 360 }}>
            <table className="tbl">
              <thead>
                <tr><th>Circle</th><th>Sites Mapped</th><th>Inspections Completed</th><th>Observations</th><th>CAPA Planned</th><th>CAPA Closed</th><th>Closure</th></tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={7} style={{ textAlign: "center" }}>Loading…</td></tr>
                ) : !closure ? (
                  <tr><td colSpan={7} style={{ textAlign: "center" }}>Couldn’t load closure progress</td></tr>
                ) : !sheet || sheet.rows.length === 0 ? (
                  <tr><td colSpan={7} style={{ textAlign: "center" }}>No inspections for this checksheet</td></tr>
                ) : (
                  <>
                    {sheet.rows.map((row) => (
                      <tr key={row.id}>
                        <td><b>{row.name}</b></td>
                        <td>{fmt(row.sites_mapped)}</td>
                        <td>{fmt(row.inspections_completed)}</td>
                        <td>{fmt(row.observations)}</td>
                        <td>{fmt(row.capa_planned)}</td>
                        <td>{fmt(row.capa_closed)}</td>
                        <td><span className={`badge ${closureBadge(row.capa_planned, row.capa_closed)}`}>{closurePct(row.capa_planned, row.capa_closed)}</span></td>
                      </tr>
                    ))}
                    <tr>
                      <td><b>Total</b></td>
                      <td><b>{fmt(sheet.totals.sites_mapped)}</b></td>
                      <td><b>{fmt(sheet.totals.inspections_completed)}</b></td>
                      <td><b>{fmt(sheet.totals.observations)}</b></td>
                      <td><b>{fmt(sheet.totals.capa_planned)}</b></td>
                      <td><b>{fmt(sheet.totals.capa_closed)}</b></td>
                      <td><span className={`badge ${closureBadge(sheet.totals.capa_planned, sheet.totals.capa_closed)}`}>{closurePct(sheet.totals.capa_planned, sheet.totals.capa_closed)}</span></td>
                    </tr>
                  </>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
