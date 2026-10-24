import { CHARTS, fmt } from "./data";
import { AuditChart } from "./AuditChart";
import { ChartCard } from "./ChartCard";
import { DownloadIcon } from "./icons";

interface ObservationsPanelProps {
  values: number[];
  highlighted: boolean;
  onDownload: (section: string) => void;
  onDrill: (key: string) => void;
}

const PROGRESS = [
  ["Raised", "100%", "var(--blue)"],
  ["Plan created", "89.3%", "var(--teal)"],
  ["Action taken", "53.9%", "var(--ok)"],
  ["On-time", "41.2%", "var(--sage)"],
] as const;

export function ObservationsPanel({ values, highlighted, onDownload, onDrill }: ObservationsPanelProps) {
  return (
    <div className={`accordion-panel${highlighted ? " nav-highlight" : ""}`} id="acc-obs">
      <div className="acc-hd">
        <div>
          <div className="acc-title">Observations</div>
          <div className="acc-sub">What was observed, where, and how far each observation has progressed</div>
        </div>
        <div className="acc-hd-actions">
          <button type="button" className="acc-dl-btn" onClick={() => onDownload("Observations")}>
            <DownloadIcon size={13} />
            Excel
          </button>
        </div>
      </div>
      <div className="g g2">
        <ChartCard title="Observation Status" sub="Where each observation is now" spec={CHARTS.obsStatus} options={["donut", "bar"]}>
          {(type) => (
            <div className="donut-block">
              <div className="donut-c">
                <AuditChart spec={CHARTS.obsStatus} type={type} compactDonut />
                <div className="donut-center">
                  <div className="dh-val">53.9%</div>
                  <div className="dh-lbl">Closed</div>
                </div>
              </div>
              <div className="donut-legend">
                <div className="dl-row" onClick={() => onDrill("kpi-spoc")}>
                  <span className="dl-sw" style={{ background: "#F9A592" }} />
                  <span className="dl-lbl">Pending By SPOC</span>
                  <span className="dl-val">{fmt(values[5])}</span>
                </div>
                <div className="dl-row" onClick={() => onDrill("kpi-ao")}>
                  <span className="dl-sw" style={{ background: "#FDE2C8", border: "1px solid #E8C9A5" }} />
                  <span className="dl-lbl">Pending By Action Owner</span>
                  <span className="dl-val">{fmt(values[7])}</span>
                </div>
                <div className="dl-row" onClick={() => onDrill("kpi-closedao")}>
                  <span className="dl-sw" style={{ background: "#6B9BCC" }} />
                  <span className="dl-lbl">Closed By Action Owner</span>
                  <span className="dl-val">{fmt(values[8])}</span>
                </div>
              </div>
            </div>
          )}
        </ChartCard>
        {/* <div className="card">
          <div className="card-hd">
            <div>
              <div className="card-title">Observation Progress</div>
              <div className="card-sub">Share of observations reaching each stage</div>
            </div>
          </div>
          <div style={{ padding: "4px 0" }}>
            {PROGRESS.map(([label, value, color]) => (
              <div key={label} className="pb-row">
                <span className="pb-label">{label}</span>
                <div className="pb-wrap">
                  <div className="pb-fill" style={{ width: value, background: color }} />
                </div>
                <span className="pb-val">{value}</span>
              </div>
            ))}
          </div>
        </div> */}
        <ChartCard title="Observation Classification" sub="Classification chosen by the Auditor" spec={CHARTS.obsClass} options={["donut", "bar"]} />
      </div>
      <div className="g" style={{ marginTop: 16 }}>
        <ChartCard title="Observations by Category" sub="Category and sub-category roll-up" spec={CHARTS.obsCategory} options={["bar", "donut", "table"]} />
        {/* <ChartCard title="Observations by Type of Facility" sub="Type of Facility on the audit" spec={CHARTS.obsFacility} options={["bar", "donut"]} /> */}
      </div>
      <div className="g g2" style={{ marginTop: 16 }}>
        <ChartCard title="Observations Raised vs Closed · 12 Months" sub="Monthly volume" spec={CHARTS.obsTrend} options={["line", "bar"]} />
        <ChartCard title="Observations by Vendor" sub="Top vendors recorded on audits" spec={CHARTS.obsVendor} options={["bar", "table"]} />
      </div>
    </div>
  );
}
