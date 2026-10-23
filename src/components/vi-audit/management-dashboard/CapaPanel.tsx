import { CHARTS, INFO, OVERDUE_ROWS, OWNER_BOARD, SPOC_BOARD } from "./data";
import { ChartCard } from "./ChartCard";
import { DownloadIcon } from "./icons";
import { InfoButton } from "./InfoButton";

interface CapaPanelProps {
  highlighted: boolean;
  onDownload: (section: string) => void;
  onDrill: (key: string) => void;
}

export function CapaPanel({ highlighted, onDownload, onDrill }: CapaPanelProps) {
  return (
    <div className={`accordion-panel${highlighted ? " nav-highlight" : ""}`} id="acc-capa">
      <div className="acc-hd">
        <div>
          <div className="acc-title">Action Plans (CAPA)</div>
          <div className="acc-sub">Corrective and preventive plans, who owes the next step, and what is past its target date</div>
        </div>
        <div className="acc-hd-actions">
          <button type="button" className="acc-dl-btn" onClick={() => onDownload("CAPA")}>
            <DownloadIcon size={13} />
            Excel
          </button>
        </div>
      </div>
      <div className="g g2">
        <ChartCard title="Corrective vs Preventive Status" sub="Plans by current state" spec={CHARTS.capaStatus} options={["bar", "table"]} />
        <ChartCard title="Waiting for SPOC Action Plan · Aging" sub="Days since the observation was submitted" spec={CHARTS.capaAging} options={["bar", "donut"]} info={INFO.aging} />
      </div>
      <div className="g g2" style={{ marginTop: 16 }}>
        <ChartCard title="Actions Past Target Date by Circle" sub="Pending plans where today is later than the Target Date" spec={CHARTS.capaOverdue} options={["bar", "table"]} info={INFO.overdue} />
        <ChartCard title="Target-date Extensions · 12 Months" sub="Plans where an Extend Target Date was entered" spec={CHARTS.capaExt} options={["line", "bar"]} info={INFO.ext} />
      </div>
      <div className="g g2" style={{ marginTop: 16 }}>
        <div className="card">
          <div className="card-hd">
            <div>
              <div className="card-title">SPOCs with Most Pending Plans</div>
              <div className="card-sub">Observations assigned and still without a plan</div>
            </div>
          </div>
          {SPOC_BOARD.map(([name, count], index) => (
            <div key={name} className="lb-row" onClick={() => onDrill("alert-spoc")}>
              <div className="lb-rank">{index + 1}</div>
              <div className="lb-info">
                <div className="lb-name">{name}</div>
                <div className="lb-meta">Observations without a plan</div>
              </div>
              <div className="lb-val">{count}</div>
            </div>
          ))}
        </div>
        <div className="card">
          <div className="card-hd">
            <div>
              <div className="card-title">Action Owners with Most Open Actions</div>
              <div className="card-sub">Plans assigned and not yet closed</div>
            </div>
          </div>
          {OWNER_BOARD.map(([name, count], index) => (
            <div key={name} className="lb-row" onClick={() => onDrill("alert-overdue")}>
              <div className="lb-rank">{index + 1}</div>
              <div className="lb-info">
                <div className="lb-name">{name}</div>
                <div className="lb-meta">Plans not yet closed</div>
              </div>
              <div className="lb-val">{count}</div>
            </div>
          ))}
        </div>
      </div>
      <div className="card" style={{ marginTop: 16 }}>
        <div className="card-hd">
          <div>
            <div className="card-title">Plans Past Target Date</div>
            <div className="card-sub">Most overdue first</div>
          </div>
          <span className="card-tag" style={{ background: "var(--vi-red-tint)", color: "var(--vi-red)", borderColor: "rgba(238,39,55,.20)" }}>
            128 overdue
          </span>
        </div>
        <div className="tbl-scroll" style={{ maxHeight: 260 }}>
          <table className="tbl">
            <thead>
              <tr>
                <th>Plan</th>
                <th>Audit</th>
                <th>Observation</th>
                <th>Action Owner</th>
                <th>Target date</th>
                <th>Days over</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {OVERDUE_ROWS.map((row) => (
                <tr key={`${row.plan}-${row.observation}-${row.days}`} onClick={() => onDrill("alert-overdue")}>
                  <td>
                    <b>{row.plan}</b>
                  </td>
                  <td>{row.audit}</td>
                  <td>{row.observation}</td>
                  <td>{row.owner}</td>
                  <td>{row.target}</td>
                  <td style={{ color: "var(--vi-red)", fontWeight: 700 }}>{row.days}</td>
                  <td>
                    <span className="badge b-warn">Pending By Action Owner</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
