import type { ChartSpec } from "./data";
// import { BOARDS, PROGRESS } from "./data"; — used by the API-pending cards below.
import { ChartCard } from "./ChartCard";

// `onDrill` stays in the props for the SPOC leaderboard once its API is available.
export function InvestigationPanel({ charts, highlighted }: { charts: Record<string, ChartSpec>; highlighted: boolean; onDrill: (key: string) => void }) {
  // const spocs = BOARDS.filter((item) => item.meta.includes("SPOC"));
  return (
    <div className={`accordion-panel${highlighted ? " nav-highlight" : ""}`} id="acc-inv">
      <div className="acc-hd">
        <div><div className="acc-title">Investigation (SPOC)</div><div className="acc-sub">SPOC review, whether an investigation is needed, and what caused the incident</div></div>
      </div>
      <div className="g g3">
        <ChartCard title="Investigation Required?" sub="SPOC decision per incident" spec={charts.invReq} options={["donut", "bar"]} />
        <ChartCard title="Contributing Factor Groups" sub="Substandard Act, Substandard Condition, Personal Factor, Job Factor, Breach of absolute safety rules" spec={charts.invFactors} options={["bar", "donut"]} />
        <ChartCard title="Investigation Conclusion" sub="Conclusion selected by the SPOC" spec={charts.invConc} options={["donut", "bar"]} />
      </div>
      {/* API pending — Top Contributing Causes, SPOC Review Aging and the SPOC leaderboard.
      <div className="g g2" style={{ marginTop: 16 }}>
        <ChartCard title="Top Contributing Causes" sub="Most selected causes across all groups" spec={charts.invCauses} options={["bar"]} />
        <ChartCard title="Waiting for SPOC Review · Aging" sub="Days since the incident was submitted" spec={charts.invAging} options={["bar", "donut"]} />
      </div>
      <div className="g" style={{ marginTop: 16 }}>
        <div className="card">
          <div className="card-hd"><div><div className="card-title">Incident Progress</div><div className="card-sub">Share of reported incidents reaching each stage</div></div></div>
          <div style={{ padding: "4px 0" }}>
            {PROGRESS.map(([label, value, color]) => (
              <div key={label} className="pb-row">
                <span className="pb-label">{label}</span>
                <div className="pb-wrap"><div className="pb-fill" style={{ width: value, background: color }} /></div>
                <span className="pb-val">{value}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="card">
          <div className="card-hd"><div><div className="card-title">SPOCs with Most Pending Reviews</div><div className="card-sub">Incidents assigned and not yet reviewed</div></div></div>
          {spocs.map((item, index) => (
            <div key={item.name} className="lb-row" onClick={() => onDrill("alert-review")}>
              <div className="lb-rank">{index + 1}</div>
              <div className="lb-info"><div className="lb-name">{item.name}</div><div className="lb-meta">{item.meta}</div></div>
              <div className="lb-val">{item.value}</div>
            </div>
          ))}
        </div>
      </div>
      */}
    </div>
  );
}
