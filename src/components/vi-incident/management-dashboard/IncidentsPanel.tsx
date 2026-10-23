import { CHARTS, RECENT, fmt } from "./data";
import { ChartCard } from "./ChartCard";
import { IncidentChart } from "./IncidentChart";
import { DownloadIcon } from "./icons";

interface IncidentsPanelProps {
  values: readonly number[];
  highlighted: boolean;
  onDownload: (section: string) => void;
  onDrill: (key: string) => void;
  onRow: (index: number) => void;
}

const badge = (status: string) => (status === "Closed" ? "b-info" : status === "Open" ? "b-err" : "b-warn");

export function IncidentsPanel({ values, highlighted, onDownload, onDrill, onRow }: IncidentsPanelProps) {
  const closedPct = values[0] ? `${((values[3] / values[0]) * 100).toFixed(1)}%` : "0%";
  return (
    <div className={`accordion-panel${highlighted ? " nav-highlight" : ""}`} id="acc-inc">
      <div className="acc-hd">
        <div><div className="acc-title">Incidents</div><div className="acc-sub">Volume, status, where and when incidents happen, and injury impact</div></div>
        <div className="acc-hd-actions"><button type="button" className="acc-dl-btn" onClick={() => onDownload("Incidents")}><DownloadIcon size={13} />Excel</button></div>
      </div>
      <div className="g g3">
        <ChartCard title="Incident Status" sub="Draft · Open · Closed" spec={CHARTS.incStatus} options={["donut", "bar"]}>
          {(type) => (
            <div className="donut-block">
              <div className="donut-c">
                <IncidentChart spec={CHARTS.incStatus} type={type} compactDonut />
                <div className="donut-center"><div className="dh-val">{closedPct}</div><div className="dh-lbl">Closed</div></div>
              </div>
              <div className="donut-legend">
                <Legend swatch="#F4795F" label="Draft" value={fmt(values[1])} onClick={() => onDrill("inc-draft")} />
                <Legend swatch="var(--vi-red)" label="Open" value={fmt(values[2])} onClick={() => onDrill("inc-open")} />
                <Legend swatch="#0D47A1" label="Closed" value={fmt(values[3])} onClick={() => onDrill("inc-closed")} />
              </div>
            </div>
          )}
        </ChartCard>
        <ChartCard title="Open Incident Stage" sub="Who owes the next step" spec={CHARTS.incStage} options={["donut", "bar"]}>
          {(type) => (
            <div className="donut-block">
              <div className="donut-c">
                <IncidentChart spec={CHARTS.incStage} type={type} compactDonut />
                <div className="donut-center"><div className="dh-val">{fmt(values[2])}</div><div className="dh-lbl">Open</div></div>
              </div>
              <div className="donut-legend">
                <Legend swatch="#F9A592" label="Pending By SPOC" value={fmt(values[5])} onClick={() => onDrill("inc-review")} />
                <Legend swatch="#FDE2C8" label="Pending By Action Owner" value={fmt(values[6])} border onClick={() => onDrill("inc-ao")} />
              </div>
            </div>
          )}
        </ChartCard>
        <ChartCard title="Incidents with Injury" sub="“Any injury happened?” answered Yes or No" spec={CHARTS.incInjury} options={["donut", "bar"]} />
      </div>
      <div className="g g2" style={{ marginTop: 16 }}>
        <ChartCard title="Incidents Reported vs Closed · 12 Months" sub="Monthly volume" spec={CHARTS.incTrend} options={["line", "bar"]} />
        <ChartCard title="Incidents per Circle" sub="Top 12 circles · open vs closed" spec={CHARTS.incCircle} options={["bar", "table"]} />
      </div>
      <div className="g g2" style={{ marginTop: 16 }}>
        <ChartCard title="Incident Classification" sub="Classification chosen by the Reporter" spec={CHARTS.incClass} options={["donut", "bar"]} />
        <ChartCard title="Incidents by Category" sub="Category and sub-category roll-up" spec={CHARTS.incCategory} options={["bar", "donut", "table"]} />
      </div>
      <div className="g g3" style={{ marginTop: 16 }}>
        <ChartCard title="Incidents by Type of Facility" sub="Type of Facility on the report" spec={CHARTS.incFacility} options={["bar", "donut"]} />
        <ChartCard title="Incidents by Function" sub="Function selected on the report" spec={CHARTS.incFunc} options={["donut", "bar"]} />
        <ChartCard title="Incidents by Time of Day" sub="Time of Incident, 4-hour bands" spec={CHARTS.incTime} options={["bar", "donut"]} />
      </div>
      <div className="g g2" style={{ marginTop: 16 }}>
        <ChartCard title="Nature of Person Impacted" sub="FTE, Non FTE, Vendor partner, Member of the public" spec={CHARTS.incPerson} options={["donut", "bar"]} />
        <ChartCard title="Nature of Injury" sub="Nature of injury recorded on the report" spec={CHARTS.incInjType} options={["bar", "donut"]} />
      </div>
      <div className="g g2" style={{ marginTop: 16 }}>
        <ChartCard title="Body Part Affected" sub="Body part recorded on the report" spec={CHARTS.incBody} options={["bar", "donut"]} />
        <ChartCard title="Days Away vs Restricted Work Days" sub="Recorded by the SPOC · monthly total" spec={CHARTS.incLost} options={["line", "bar"]} />
      </div>
      <div className="card" style={{ marginTop: 16 }}>
        <div className="card-hd">
          <div><div className="card-title">Recent Incidents</div><div className="card-sub">Latest incidents across the selected scope · click a row for full details</div></div>
          <span className="card-tag">Sample data</span>
        </div>
        <div className="tbl-scroll" style={{ maxHeight: 260 }}>
          <table className="tbl">
            <thead><tr><th>Incident ID</th><th>Classification</th><th>Location</th><th>Reporter</th><th>Date</th><th>Injury</th><th>Status</th></tr></thead>
            <tbody>
              {RECENT.map((row) => (
                <tr key={row.id} style={{ cursor: "pointer" }} onClick={() => onRow(row.index)}>
                  <td><b>{row.id}</b></td><td>{row.classification}</td><td>{row.location}</td><td>{row.reporter}</td><td>{row.date}</td><td>{row.injury}</td>
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
