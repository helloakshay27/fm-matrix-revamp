import { BOARDS, CHARTS, OVERDUE_PLANS } from "./data";
import { ChartCard } from "./ChartCard";

export function CapaPanel({ highlighted, onDrill }: { highlighted: boolean; onDrill: (key: string) => void }) {
  const owners = BOARDS.filter((item) => item.meta.includes("Plans"));
  return (
    <div className={`accordion-panel${highlighted ? " nav-highlight" : ""}`} id="acc-capa">
      <div className="acc-hd">
        <div><div className="acc-title">Action Plans (CAPA)</div><div className="acc-sub">Corrective and preventive plans, who owes the next step, and what is past its target date</div></div>
      </div>
      <div className="g g3">
        <ChartCard title="Corrective vs Preventive Status" sub="Plans by current state" spec={CHARTS.capaStatus} options={["bar", "table"]} />
        <ChartCard title="Plans Past Target Date by Circle" sub="Pending plans where today is later than the Target Date" spec={CHARTS.capaOverdue} options={["bar", "table"]} />
        <ChartCard title="Target-date Extensions · 12 Months" sub="Plans where an Extend Target Date was entered" spec={CHARTS.capaExt} options={["line", "bar"]} />
      </div>
      <div className="g g2" style={{ marginTop: 16 }}>
        <div className="card">
          <div className="card-hd"><div><div className="card-title">Action Owners with Most Open Plans</div><div className="card-sub">Plans assigned and not yet closed</div></div></div>
          {owners.map((item, index) => (
            <div key={item.name} className="lb-row" onClick={() => onDrill("alert-overdue")}>
              <div className="lb-rank">{index + 1}</div>
              <div className="lb-info"><div className="lb-name">{item.name}</div><div className="lb-meta">{item.meta}</div></div>
              <div className="lb-val">{item.value}</div>
            </div>
          ))}
        </div>
        <div className="card">
          <div className="card-hd">
            <div><div className="card-title">Plans Past Target Date</div><div className="card-sub">Most overdue first</div></div>
            <span className="card-tag" style={{ background: "var(--vi-red-tint)", color: "var(--vi-red)", borderColor: "rgba(238,39,55,.20)" }}>64 overdue</span>
          </div>
          <div className="tbl-scroll" style={{ maxHeight: 260 }}>
            <table className="tbl">
              <thead><tr><th>Plan</th><th>Incident</th><th>Action Owner</th><th>Target date</th><th>Days over</th><th>Status</th></tr></thead>
              <tbody>
                {OVERDUE_PLANS.map((row) => (
                  <tr key={`${row[0]}-${row[1]}`} style={{ cursor: "pointer" }} onClick={() => onDrill("alert-overdue")}>
                    <td><b>{row[0]}</b></td><td>{row[1]}</td><td>{row[2]}</td><td>{row[3]}</td>
                    <td style={{ color: "var(--vi-red)", fontWeight: 700 }}>{row[4]}</td>
                    <td><span className="badge b-warn">Pending By Action Owner</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
