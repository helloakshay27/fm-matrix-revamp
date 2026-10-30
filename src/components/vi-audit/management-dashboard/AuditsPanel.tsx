import { AUDITS, CHARTS, fmt, type ChartSpec } from "./data";
import { AuditChart } from "./AuditChart";
import { ChartCard } from "./ChartCard";
import { DownloadIcon } from "./icons";
import { RecentAuditsCard } from "./RecentAuditsCard";
import { StatusBadge } from "./InfoButton";

interface AuditsPanelProps {
  values: number[];
  highlighted: boolean;
  onDownload: (section: string) => void;
  onDrill: (key: string) => void;
  onAudit: (index: number) => void;
}

// Draft is hidden from the Audit Status chart (donut and bar); the first entry is skipped.
const AUDIT_STATUS_SPEC: ChartSpec = {
  ...CHARTS.auditStatus,
  labels: CHARTS.auditStatus.labels.slice(1),
  datasets: CHARTS.auditStatus.datasets.map((series) => ({
    ...series,
    data: series.data.slice(1),
    pieColors: series.pieColors?.slice(1),
  })),
};

export function AuditsPanel({ values, highlighted, onDownload, onDrill, onAudit }: AuditsPanelProps) {
  return (
    <div className={`accordion-panel${highlighted ? " nav-highlight" : ""}`} id="acc-audits">
      <div className="acc-hd">
        <div>
          <div className="acc-title">Audits</div>
          <div className="acc-sub">Status, volume over time, and where audits are being carried out</div>
        </div>
        <div className="acc-hd-actions">
          <button type="button" className="acc-dl-btn" onClick={() => onDownload("Audits")}>
            <DownloadIcon size={13} />
            Excel
          </button>
        </div>
      </div>
      <div className="g g2">
        {/* <ChartCard title="Audit Status" sub="Open · Closed" spec={AUDIT_STATUS_SPEC} options={["donut", "bar"]}>
          {(type) => (
            <div className="donut-block">
              <div className="donut-c">
                <AuditChart spec={AUDIT_STATUS_SPEC} type={type} compactDonut />
                <div className="donut-center">
                  <div className="dh-val">52.2%</div>
                  <div className="dh-lbl">Closed</div>
                </div>
              </div>
              <div className="donut-legend">
                <div className="dl-row" onClick={() => onDrill("kpi-open")}>
                  <span className="dl-sw" style={{ background: "var(--vi-red)" }} />
                  <span className="dl-lbl">Open</span>
                  <span className="dl-val">{fmt(values[2])}</span>
                </div>
                <div className="dl-row" onClick={() => onDrill("kpi-closed")}>
                  <span className="dl-sw" style={{ background: "var(--aubergine)" }} />
                  <span className="dl-lbl">Closed</span>
                  <span className="dl-val">{fmt(values[3])}</span>
                </div>
              </div>
            </div>
          )}
        </ChartCard> */}
        {/* <ChartCard title="Audit Type" sub="Corporate vs Circle audits" spec={CHARTS.auditType} options={["donut", "bar"]} /> */}
        <ChartCard title="Audits by Function" sub="Audits, observations, CAPA assigned and CAPA closed per function" spec={CHARTS.auditFunc} options={["bar", "table"]} />
        <ChartCard title="Audits per Circle" sub="Top 12 circles · audits, observations, CAPA assigned and CAPA closed" spec={CHARTS.auditCircle} options={["bar", "table"]} />
      </div>
      {/* <div className="g g2" style={{ marginTop: 16 }}>
        <ChartCard title="Audits Conducted · Last 12 Months" sub="Audits by date of audit" spec={CHARTS.auditTrend} options={["line", "bar"]} />
      </div> */}
      <RecentAuditsCard onAudit={onAudit} />
      {/* <div className="card" style={{ marginTop: 16 }}>
        <div className="card-hd">
          <div>
            <div className="card-title">Recent Audits</div>
            <div className="card-sub">Latest audits across the selected scope · click a row for full details</div>
          </div>
          <span className="card-tag">Sample data</span>
        </div>
        <div className="tbl-scroll" style={{ maxHeight: 260 }}>
          <table className="tbl">
            <thead>
              <tr>
                <th>Audit ID</th>
                <th>Type</th>
                <th>Location</th>
                <th>Auditor</th>
                <th>Date</th>
                <th>Observations</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {AUDITS.slice(0, 8).map((audit, index) => (
                <tr key={audit.id} onClick={() => onAudit(index)}>
                  <td>
                    <b>{audit.id}</b>
                  </td>
                  <td>{audit.type}</td>
                  <td>{audit.loc2}</td>
                  <td>{audit.auditor}</td>
                  <td>{audit.date}</td>
                  <td>{audit.obs}</td>
                  <td>
                    <StatusBadge status={audit.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div> */}
    </div>
  );
}
