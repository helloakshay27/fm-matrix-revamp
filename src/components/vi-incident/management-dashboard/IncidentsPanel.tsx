import { useMemo, useState } from "react";
import type { RecentIncident } from "./api";
import type { ChartSpec } from "./data";
import { ChartCard } from "./ChartCard";
import { SearchIcon } from "./icons";
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

// `values` / `onDrill` stay in the props for the KPI legends these cards used to show.
export function IncidentsPanel({ charts, recent, highlighted, onRecent }: IncidentsPanelProps) {
  const loading = useDashboardLoading();
  const [query, setQuery] = useState("");
  // Matches against every column shown in the Recent Incidents table.
  const needle = query.trim().toLowerCase();
  const visibleRecent = needle
    ? recent.filter((row) => [row.incident_id, row.classification, row.location, row.reporter, row.incident_date, row.injury, row.status].some((cell) => String(cell ?? "").toLowerCase().includes(needle)))
    : recent;
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
  return (
    <div className={`accordion-panel${highlighted ? " nav-highlight" : ""}`} id="acc-inc">
      <div className="acc-hd">
        <div><div className="acc-title">Incidents</div><div className="acc-sub">Volume, status, where and when incidents happen, and injury impact</div></div>
      </div>
      <div className="g g3">
        {/* Plain charts, same as Incidents with Injury; the custom centre labels and side legends are retired. */}
        <ChartCard title="Incident Status" sub="Open · Closed" spec={INC_STATUS_SPEC} options={["donut", "bar"]} />
        <ChartCard title="Open Incident Stage" sub="Who owes the next step" spec={charts.incStage} options={["donut", "bar"]} />
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
      {/* Hidden for now — restore it and switch this row back to "g g3".
      <ChartCard title="Incidents by Time of Day" sub="Time of Incident, 4-hour bands" spec={charts.incTime} options={["bar", "donut"]} /> */}
      <div className="g g2" style={{ marginTop: 16 }}>
        <ChartCard title="Incidents by Type of Facility" sub="Type of Facility on the report" spec={charts.incFacility} options={["bar", "donut"]} />
        <ChartCard title="Incidents by Function" sub="Function selected on the report" spec={charts.incFunc} options={["donut", "bar"]} />
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
          <div className="usr-search">
            <SearchIcon />
            <input placeholder="Search…" value={query} onChange={(event) => setQuery(event.target.value)} />
          </div>
        </div>
        <div className="tbl-scroll" style={{ maxHeight: 260 }}>
          <table className="tbl">
            <thead><tr><th>Incident ID</th><th>Classification</th><th>Location</th><th>Reporter</th><th>Date</th><th>Injury</th><th>Status</th></tr></thead>
            <tbody>
              {loading || visibleRecent.length === 0 ? <tr><td colSpan={7} style={{ textAlign: "center", color: "var(--sage)" }}>{loading ? "Loading…" : needle ? "No incidents match your search" : "No incidents in the selected scope"}</td></tr> : null}
              {!loading && visibleRecent.map((row) => (
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
