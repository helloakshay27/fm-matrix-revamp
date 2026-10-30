import { observationsByCircleSpec, observationsByFunctionSpec } from "./dashboardCharts";
import { CategoryJourneyCard } from "./CategoryJourneyCard";
import { ChartCard } from "./ChartCard";
import { DownloadIcon } from "./icons";
import type { DashboardSections } from "./managementDashboardApi";

interface ObservationsPanelProps {
  sections: DashboardSections;
  loading: boolean;
  highlighted: boolean;
  onDownload: (section: string) => void;
  onDrill: (key: string) => void;
}

export function ObservationsPanel({ sections, loading, highlighted, onDownload }: ObservationsPanelProps) {
  const emptyLabel = loading ? "Loading…" : "No data for this filter.";
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
      {/* <div className="g">
        <ChartCard title="Total Observations" sub="Count of total observations in each audit" spec={CHARTS.obsPerAudit} options={["bar", "table"]} info={INFO.obs} />
      </div> */}
      <div className="g g2">
        <ChartCard title="Observations by Function" sub="Observations, CAPA assigned and CAPA closed per function" spec={observationsByFunctionSpec(sections.observationsByFunction)} options={["bar", "table"]} emptyLabel={emptyLabel} />
        <ChartCard title="Observations by Circle" sub="Observations, CAPA assigned and CAPA closed" spec={observationsByCircleSpec(sections.observationsByCircle)} options={["bar", "table"]} emptyLabel={emptyLabel} />
      </div>
      <div className="g g2" style={{ marginTop: 16 }}>
        <CategoryJourneyCard
          title="Observations by Classification, Category & Sub Category · By Circle"
          sub="Observations, CAPA plan initiated and CAPA plan closed · pick a circle"
          dimensionLabel="Circle"
          allLabel="All circles"
          groups={sections.classificationByCircle}
          showSubCategory
        />
        <CategoryJourneyCard
          title="Observations by Classification & Category · By Function"
          sub="Observations, CAPA plan initiated and CAPA plan closed · pick a function"
          dimensionLabel="Function"
          allLabel="All functions"
          groups={sections.classificationByFunction}
          showSubCategory
        />
      </div>
      {/* <div className="g g2">
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
                  <span className="dl-sw" style={{ background: "#FF8F6B" }} />
                  <span className="dl-lbl">Pending By SPOC</span>
                  <span className="dl-val">{fmt(values[5])}</span>
                </div>
                <div className="dl-row" onClick={() => onDrill("kpi-ao")}>
                  <span className="dl-sw" style={{ background: "#FFC400", border: "1px solid #E6D7BE" }} />
                  <span className="dl-lbl">Pending By Action Owner</span>
                  <span className="dl-val">{fmt(values[8])}</span>
                </div>
                <div className="dl-row" onClick={() => onDrill("kpi-closedao")}>
                  <span className="dl-sw" style={{ background: "#5A084B" }} />
                  <span className="dl-lbl">Closed By Action Owner</span>
                  <span className="dl-val">{fmt(values[9])}</span>
                </div>
              </div>
            </div>
          )}
        </ChartCard>
        <div className="card">
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
        </div>
        <ChartCard title="Observation Classification" sub="Classification chosen by the Auditor" spec={CHARTS.obsClass} options={["donut", "bar"]} />
      </div>
      <div className="g" style={{ marginTop: 16 }}>
        <ChartCard title="Observations by Category" sub="Category and sub-category roll-up" spec={CHARTS.obsCategory} options={["bar", "donut", "table"]} />
        <ChartCard title="Observations by Type of Facility" sub="Type of Facility on the audit" spec={CHARTS.obsFacility} options={["bar", "donut"]} />
      </div>
      <div className="g g2" style={{ marginTop: 16 }}>
        <ChartCard title="Observations Raised vs Closed · 12 Months" sub="Monthly volume" spec={CHARTS.obsTrend} options={["line", "bar"]} />
        <ChartCard title="Observations by Vendor" sub="Top vendors recorded on audits" spec={CHARTS.obsVendor} options={["bar", "table"]} />
      </div> */}
    </div>
  );
}
