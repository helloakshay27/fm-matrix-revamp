import { INFO, fmt } from "./data";
import { capaStatusSpec, extendedCapaSpec, pastTargetSpec, spocAgingSpec } from "./dashboardCharts";
import { ChartCard } from "./ChartCard";
import { DownloadIcon } from "./icons";
import { InfoButton, StatusBadge } from "./InfoButton";
import type { ClosureRow, DashboardSections } from "./managementDashboardApi";

interface CapaPanelProps {
  sections: DashboardSections;
  closure: ClosureRow[];
  loading: boolean;
  highlighted: boolean;
  onDownload: (section: string) => void;
  onDrill: (key: string) => void;
}

export function CapaPanel({ sections, closure, loading, highlighted, onDownload, onDrill }: CapaPanelProps) {
  const emptyLabel = loading ? "Loading…" : "No data for this filter.";
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
        <ChartCard title="Corrective vs Preventive Status" sub="Plans by current state, across the selected circles" spec={capaStatusSpec(sections.actionPlans)} options={["bar", "table"]} emptyLabel={emptyLabel} />
        <ChartCard title="Waiting for SPOC Action Plan · Aging" sub={`${fmt(sections.spocWaitingTotal)} observations still waiting for a SPOC plan`} spec={spocAgingSpec(sections.spocAging)} options={["bar", "donut"]} info={INFO.aging} emptyLabel={emptyLabel} />
      </div>
      <div className="g g2" style={{ marginTop: 16 }}>
        <ChartCard title="Actions Past Target Date by Action Owner" sub="Open plans whose target date has passed" spec={pastTargetSpec(sections.actionOwners.map((owner) => owner.name), sections.actionOwners.map((owner) => owner.pastTarget))} options={["bar", "table"]} info={INFO.overdue} emptyLabel={emptyLabel} />
        <ChartCard title="Extended CAPA by Circle" sub="% of CAPA with an extended target date" spec={extendedCapaSpec(closure)} options={["bar", "table"]} info={INFO.ext} emptyLabel={emptyLabel} />
      </div>
      <div className="g g2" style={{ marginTop: 16 }}>
        <div className="card">
          <div className="card-hd">
            <div>
              <div className="card-title">Waiting for SPOC Action Plan</div>
              <div className="card-sub">{fmt(sections.spocWaitingTotal)} observations, grouped by how long they have been waiting</div>
            </div>
          </div>
          {sections.spocAging.length === 0 ? (
            <div className="card-sub" style={{ padding: "12px 0" }}>{emptyLabel}</div>
          ) : (
            sections.spocAging.map((bucket, index) => (
              <div key={bucket.name} className="lb-row" onClick={() => onDrill("alert-spoc")}>
                <div className="lb-rank">{index + 1}</div>
                <div className="lb-info">
                  <div className="lb-name">{bucket.name}</div>
                  <div className="lb-meta">Observations waiting for a SPOC plan</div>
                </div>
                <div className="lb-val">{bucket.count}</div>
              </div>
            ))
          )}
        </div>
        <div className="card">
          <div className="card-hd">
            <div>
              <div className="card-title">Action Owners with Most Open Actions</div>
              <div className="card-sub">Plans assigned and not yet closed</div>
            </div>
          </div>
          {sections.actionOwners.length === 0 ? (
            <div className="card-sub" style={{ padding: "12px 0" }}>{emptyLabel}</div>
          ) : (
            sections.actionOwners.map((owner, index) => (
              <div key={owner.name} className="lb-row" onClick={() => onDrill("alert-overdue")}>
                <div className="lb-rank">{index + 1}</div>
                <div className="lb-info">
                  <div className="lb-name">{owner.name}</div>
                  <div className="lb-meta">{owner.pastTarget} past target date</div>
                </div>
                <div className="lb-val">{owner.open}</div>
              </div>
            ))
          )}
        </div>
      </div>
      <div className="card" style={{ marginTop: 16 }}>
        <div className="card-hd">
          <div>
            <div className="card-title">Plans Past Target Date</div>
            <div className="card-sub">Most overdue first</div>
          </div>
          <span className="card-tag" style={{ background: "var(--vi-red-tint)", color: "var(--vi-red)", borderColor: "rgba(238,39,55,.20)" }}>
            {fmt(sections.overdueTotal)} overdue
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
              {sections.overduePlans.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: "center", padding: 24, color: "var(--sage)" }}>{emptyLabel}</td>
                </tr>
              ) : (
                sections.overduePlans.map((row) => (
                  <tr key={`${row.plan}-${row.audit}-${row.observation}-${row.target}`} onClick={() => onDrill("alert-overdue")}>
                    <td>
                      <b>{row.plan}</b>
                    </td>
                    <td>{row.audit}</td>
                    <td>{row.observation}</td>
                    <td>{row.owner}</td>
                    <td>{row.target}</td>
                    <td style={{ color: "var(--vi-red)", fontWeight: 700 }}>{row.days}</td>
                    <td>
                      <StatusBadge status={row.status} />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
