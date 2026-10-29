import { CHARTS, OVERDUE_PLANS, OVERDUE_TAG, OWNER_BOARD, SPOC_BOARD } from "./data";
import { ChartCard } from "./ChartCard";
import { DownloadIcon } from "./icons";

interface ActionPlansPanelProps {
  highlighted: boolean;
  onDrill: (key: string) => void;
  onExcel: (section: string) => void;
}

export function ActionPlansPanel({ highlighted, onDrill, onExcel }: ActionPlansPanelProps) {
  return (
    <div className={`accordion-panel${highlighted ? " nav-highlight" : ""}`} id="acc-act">
      <div className="acc-hd">
        <div><div className="acc-title">Action Plans (CAPA)</div><div className="acc-sub">Corrective and preventive plans for failed checklist items, and what is past its target date</div></div>
        <div className="acc-hd-actions">
          <button type="button" className="acc-dl-btn" onClick={() => onExcel("Action Plans")}><DownloadIcon />Excel</button>
        </div>
      </div>
      <div className="g g2">
        <ChartCard title="Corrective vs Preventive Status" sub="Plans by current state" spec={CHARTS.actStatus} options={["bar", "table"]} />
        <ChartCard title="Waiting for SPOC Action Plan · Aging" sub="Days since the inspection was submitted" spec={CHARTS.actAging} options={["bar", "donut"]} />
      </div>
      <div className="g g2" style={{ marginTop: 16 }}>
        <ChartCard title="Plans Past Target Date by Circle" sub="Pending plans where today is later than the Target Date" spec={CHARTS.actOverdue} options={["bar", "table"]} />
        <ChartCard title="Target-date Extensions · 12 Months" sub="Plans where an Extend Target Date was entered" spec={CHARTS.actExt} options={["line", "bar"]} />
      </div>
      <div className="g g2" style={{ marginTop: 16 }}>
        <Leaderboard title="SPOCs with Most Pending Plans" sub="Inspections assigned and still without a plan" items={SPOC_BOARD} onClick={() => onDrill("alert-spoc")} />
        <Leaderboard title="Action Owners with Most Open Plans" sub="Plans assigned and not yet closed" items={OWNER_BOARD} onClick={() => onDrill("alert-overdue")} />
      </div>
      <div className="card" style={{ marginTop: 16 }}>
        <div className="card-hd">
          <div><div className="card-title">Plans Past Target Date</div><div className="card-sub">Most overdue first</div></div>
          <span className="card-tag" style={{ background: "var(--vi-red-tint)", color: "var(--vi-red)", borderColor: "rgba(238,39,55,.20)" }}>{OVERDUE_TAG}</span>
        </div>
        <div className="tbl-scroll" style={{ maxHeight: 260 }}>
          <table className="tbl">
            <thead><tr><th>Plan</th><th>Inspection</th><th>Action Owner</th><th>Target date</th><th>Days over</th><th>Status</th></tr></thead>
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
  );
}

function Leaderboard({ title, sub, items, onClick }: { title: string; sub: string; items: readonly { name: string; meta: string; value: string }[]; onClick: () => void }) {
  return (
    <div className="card">
      <div className="card-hd"><div><div className="card-title">{title}</div><div className="card-sub">{sub}</div></div></div>
      {items.map((item, index) => (
        <div key={item.name} className="lb-row" onClick={onClick}>
          <div className="lb-rank">{index + 1}</div>
          <div className="lb-info"><div className="lb-name">{item.name}</div><div className="lb-meta">{item.meta}</div></div>
          <div className="lb-val">{item.value}</div>
        </div>
      ))}
    </div>
  );
}
