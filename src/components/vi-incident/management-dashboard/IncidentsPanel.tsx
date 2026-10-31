import { useMemo } from "react";
import type { RecentIncident } from "./api";
import { BRAND, fmt, type ChartSpec } from "./data";
import { ChartCard } from "./ChartCard";
import { IncidentChart } from "./IncidentChart";
import { useDashboardLoading } from "./loading";

interface IncidentsPanelProps {
  values: readonly number[];
  charts: Record<string, ChartSpec>;
  recent: RecentIncident[];
  highlighted: boolean;
  onDrill: (key: string) => void;
  onRecent: (row: RecentIncident) => void;
}

const badge = (status: string) => (status === "Closed" ? "b-info" : status === "Open" ? "b-err" : "b-warn");

export function IncidentsPanel({ values, charts, recent, highlighted, onDrill, onRecent }: IncidentsPanelProps) {
  const loading = useDashboardLoading();
  // Draft is hidden from the Incident Status chart (donut and bar); the first entry is skipped.
  const INC_STATUS_SPEC = useMemo<ChartSpec>(() => ({
    ...charts.incStatus,
    labels: charts.incStatus.labels.slice(1),
    datasets: charts.incStatus.datasets.map((series) => ({
      ...series,
      data: series.data.slice(1),
      pieColors: series.pieColors?.slice(1),
    })),
  }), [charts.incStatus]);
  const closedPct = values[0] ? `${((values[3] / values[0]) * 100).toFixed(1)}%` : "0%";
  return (
    <div className={`accordion-panel${highlighted ? " nav-highlight" : ""}`} id="acc-inc">
      <div className="acc-hd">
        <div><div className="acc-title">Incidents</div><div className="acc-sub">Volume, status, where and when incidents happen, and injury impact</div></div>
      </div>
      <div className="g g3">
        <ChartCard title="Incident Status" sub="Open · Closed" spec={INC_STATUS_SPEC} options={["donut", "bar"]}>
          {(type) => (
            <div className="donut-block">
              <div className="donut-c">
                <IncidentChart spec={INC_STATUS_SPEC} type={type} compactDonut />
                <div className="donut-center"><div className="dh-val">{closedPct}</div><div className="dh-lbl">Closed</div></div>
              </div>
              <div className="donut-legend">
                {/* <Legend swatch="#F4795F" label="Draft" value={fmt(values[1])} onClick={() => onDrill("inc-draft")} /> */}
                <Legend swatch="var(--vi-red)" label="Open" value={fmt(values[2])} onClick={() => onDrill("inc-open")} />
                <Legend swatch={BRAND.aubergine} label="Closed" value={fmt(values[3])} onClick={() => onDrill("inc-closed")} />
              </div>
            </div>
          )}
        </ChartCard>
        <ChartCard title="Open Incident Stage" sub="Who owes the next step" spec={charts.incStage} options={["donut", "bar"]}>
          {(type) => (
            <div className="donut-block">
              <div className="donut-c">
                <IncidentChart spec={charts.incStage} type={type} compactDonut />
                <div className="donut-center"><div className="dh-val">{fmt(values[2])}</div><div className="dh-lbl">Open</div></div>
              </div>
              <div className="donut-legend">
                <Legend swatch={BRAND.terracotta} label="Pending By SPOC" value={fmt(values[5])} onClick={() => onDrill("inc-review")} />
                <Legend swatch={BRAND.sand} label="Pending By Action Owner" value={fmt(values[6])} border onClick={() => onDrill("inc-ao")} />
              </div>
            </div>
          )}
        </ChartCard>
        <ChartCard title="Incidents with Injury" sub="“Any injury happened?” answered Yes or No" spec={charts.incInjury} options={["donut", "bar"]} />
      </div>
      <div className="g g2" style={{ marginTop: 16 }}>
        <ChartCard title="Incidents Reported vs Closed · 12 Months" sub="Monthly volume" spec={charts.incTrend} options={["line", "bar"]} />
        <ChartCard title="Incidents per Circle" sub="Top 12 circles · open vs closed" spec={charts.incCircle} options={["bar", "table"]} />
      </div>
      <div className="g g2" style={{ marginTop: 16 }}>
        <ChartCard title="Incident Classification" sub="Classification chosen by the Reporter" spec={charts.incClass} options={["donut", "bar"]} />
        <ChartCard title="Incidents by Category" sub="Category and sub-category roll-up" spec={charts.incCategory} options={["bar", "donut", "table"]} />
      </div>
      <div className="g g3" style={{ marginTop: 16 }}>
        <ChartCard title="Incidents by Type of Facility" sub="Type of Facility on the report" spec={charts.incFacility} options={["bar", "donut"]} />
        <ChartCard title="Incidents by Function" sub="Function selected on the report" spec={charts.incFunc} options={["donut", "bar"]} />
        <ChartCard title="Incidents by Time of Day" sub="Time of Incident, 4-hour bands" spec={charts.incTime} options={["bar", "donut"]} />
      </div>
      <div className="g g2" style={{ marginTop: 16 }}>
        <ChartCard title="Nature of Person Impacted" sub="FTE, Non FTE, Vendor partner, Member of the public" spec={charts.incPerson} options={["donut", "bar"]} />
        <ChartCard title="Nature of Injury" sub="Nature of injury recorded on the report" spec={charts.incInjType} options={["bar", "donut"]} />
      </div>
      <div className="g" style={{ marginTop: 16 }}>
        {/* API pending — restore and switch this row back to "g g2".
        <ChartCard title="Body Part Affected" sub="Body part recorded on the report" spec={charts.incBody} options={["bar", "donut"]} /> */}
        <ChartCard title="Days Away vs Restricted Work Days" sub="Recorded by the SPOC · monthly total" spec={charts.incLost} options={["line", "bar"]} />
      </div>
      <div className="card" style={{ marginTop: 16 }}>
        <div className="card-hd">
          <div><div className="card-title">Recent Incidents</div><div className="card-sub">Latest incidents across the selected scope · click a row for full details</div></div>
        </div>
        <div className="tbl-scroll" style={{ maxHeight: 260 }}>
          <table className="tbl">
            <thead><tr><th>Incident ID</th><th>Classification</th><th>Location</th><th>Reporter</th><th>Date</th><th>Injury</th><th>Status</th></tr></thead>
            <tbody>
              {loading || recent.length === 0 ? <tr><td colSpan={7} style={{ textAlign: "center", color: "var(--sage)" }}>{loading ? "Loading…" : "No incidents in the selected scope"}</td></tr> : null}
              {!loading && recent.map((row) => (
                <tr key={row.id} style={{ cursor: "pointer" }} onClick={() => onRecent(row)}>
                  <td><b>{row.incident_id}</b></td><td>{row.classification}</td><td>{row.location}</td><td>{row.reporter}</td><td>{row.incident_date}</td><td>{row.injury}</td>
                  <td><span className={`badge ${badge(row.status)}`}>{row.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function Legend({ swatch, label, value, onClick, border }: { swatch: string; label: string; value: string; onClick: () => void; border?: boolean }) {
  return (
    <div className="dl-row" onClick={onClick}>
      <span className="dl-sw" style={{ background: swatch, border: border ? "1px solid #E8C9A5" : undefined }} />
      <span className="dl-lbl">{label}</span>
      <span className="dl-val">{value}</span>
    </div>
  );
}
