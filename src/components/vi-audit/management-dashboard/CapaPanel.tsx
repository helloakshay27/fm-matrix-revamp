import { useEffect, useMemo, useState } from "react";
import { fmt, INFO, type ChartSpec } from "./data";
import { ChartCard } from "./ChartCard";
import { StatusBadge } from "./InfoButton";
import { TablePager } from "./TablePager";
import { EMPTY_CHART, type Ageing, type OpenActionOwner, type PastTargetPlan } from "./viAuditDashboardApi";

interface CapaPanelProps {
  highlighted: boolean;
  loading: boolean;
  capaStatus: ChartSpec | null;
  capaAging: ChartSpec | null;
  capaOverdue: ChartSpec | null;
  ageing: Ageing | null;
  owners: OpenActionOwner[] | null;
  pastTarget: PastTargetPlan[] | null;
  pastTargetTotal: number;
  onPlan: (plan: PastTargetPlan) => void;
}

const PAGE_SIZE = 10;

export function CapaPanel({
  highlighted,
  loading,
  capaStatus,
  capaAging,
  capaOverdue,
  ageing,
  owners,
  pastTarget,
  pastTargetTotal,
  onPlan,
}: CapaPanelProps) {
  const [page, setPage] = useState(1);
  const ownerRows = useMemo(() => [...(owners ?? [])].sort((a, b) => b.open - a.open), [owners]);
  const plans = useMemo(() => [...(pastTarget ?? [])].sort((a, b) => b.days_over - a.days_over), [pastTarget]);
  const totalPages = Math.max(1, Math.ceil(plans.length / PAGE_SIZE));
  const rows = plans.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  useEffect(() => {
    setPage(1);
  }, [pastTarget]);

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  return (
    <div className={`accordion-panel${highlighted ? " nav-highlight" : ""}`} id="acc-capa">
      <div className="acc-hd">
        <div>
          <div className="acc-title">Action Plans (CAPA)</div>
          <div className="acc-sub">Corrective and preventive plans, who owes the next step, and what is past its target date</div>
        </div>
      </div>
      <div className="g g2">
        <ChartCard title="Corrective vs Preventive Status" sub="Plans by current state, across the selected circles" spec={capaStatus ?? EMPTY_CHART} options={["bar", "table"]} loading={loading} unavailable={!loading && !capaStatus} />
        <ChartCard title="Waiting for SPOC Action Plan · Aging" sub="Days since the observation was submitted" spec={capaAging ?? EMPTY_CHART} options={["bar", "donut"]} info={INFO.aging} loading={loading} unavailable={!loading && !capaAging} />
      </div>
      <div className="g g2" style={{ marginTop: 16 }}>
        <ChartCard title="Actions Past Target Date by Action Owner" sub="Open actions where today is later than the Target Date" spec={capaOverdue ?? EMPTY_CHART} options={["bar", "table"]} info={INFO.overdue} loading={loading} unavailable={!loading && !capaOverdue} />
        <div className="card">
          <div className="card-hd">
            <div>
              <div className="card-title">Waiting for a SPOC Action Plan</div>
              <div className="card-sub">Observations still without a plan</div>
            </div>
            {!loading && ageing && <span className="card-tag">{fmt(ageing.total)} waiting</span>}
          </div>
          {loading ? (
            <div className="card-sub" style={{ padding: "16px 0", textAlign: "center" }}>Loading…</div>
          ) : !ageing ? (
            <div className="card-sub" style={{ padding: "16px 0", textAlign: "center" }}>Couldn’t load data</div>
          ) : ageing.total === 0 ? (
            <div className="card-sub" style={{ padding: "16px 0", textAlign: "center" }}>No pending plans</div>
          ) : (
            <div className="lb-row" style={{ cursor: "default" }}>
              <div className="lb-rank">1</div>
              <div className="lb-info">
                <div className="lb-name">All observations</div>
                <div className="lb-meta">Waiting for a SPOC to create a plan</div>
              </div>
              <div className="lb-val">{fmt(ageing.total)}</div>
            </div>
          )}
        </div>
      </div>
      <div className="g g2" style={{ marginTop: 16 }}>
        <div className="card">
          <div className="card-hd">
            <div>
              <div className="card-title">Action Owners with Most Open Actions</div>
              <div className="card-sub">Plans assigned and not yet closed</div>
            </div>
          </div>
          {loading ? (
            <div className="card-sub" style={{ padding: "16px 0", textAlign: "center" }}>Loading…</div>
          ) : !owners ? (
            <div className="card-sub" style={{ padding: "16px 0", textAlign: "center" }}>Couldn’t load data</div>
          ) : ownerRows.length === 0 ? (
            <div className="card-sub" style={{ padding: "16px 0", textAlign: "center" }}>No open actions</div>
          ) : (
            ownerRows.map((owner, index) => (
              <div key={owner.action_owner} className="lb-row" style={{ cursor: "default" }}>
                <div className="lb-rank">{index + 1}</div>
                <div className="lb-info">
                  <div className="lb-name">{owner.action_owner}</div>
                  <div className="lb-meta">{fmt(owner.past_target)} past target date</div>
                </div>
                <div className="lb-val">{fmt(owner.open)}</div>
              </div>
            ))
          )}
        </div>
        <div className="card">
          <div className="card-hd">
            <div>
              <div className="card-title">Plans Past Target Date</div>
              <div className="card-sub">Most overdue first</div>
            </div>
            {!loading && pastTarget && (
              <span className="card-tag" style={{ background: "var(--vi-red-tint)", color: "var(--vi-red)", borderColor: "rgba(238,39,55,.20)" }}>
                {fmt(pastTargetTotal || plans.length)} overdue
              </span>
            )}
          </div>
          <div className="tbl-scroll" style={{ maxHeight: 360 }}>
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
                {loading ? (
                  <tr><td colSpan={7} style={{ textAlign: "center" }}>Loading…</td></tr>
                ) : !pastTarget ? (
                  <tr><td colSpan={7} style={{ textAlign: "center" }}>Couldn’t load plans past target date</td></tr>
                ) : rows.length === 0 ? (
                  <tr><td colSpan={7} style={{ textAlign: "center" }}>No plans past their target date</td></tr>
                ) : (
                  rows.map((row) => (
                    <tr key={`${row.plan}-${row.audit}-${row.observation}-${row.days_over}`} onClick={() => onPlan(row)}>
                      <td><b>{row.plan}</b></td>
                      <td>{row.audit}</td>
                      <td>{row.observation}</td>
                      <td>{row.action_owner}</td>
                      <td>{row.target_date}</td>
                      <td style={{ color: "var(--vi-red)", fontWeight: 700 }}>{row.days_over}</td>
                      <td><StatusBadge status={row.status} /></td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          {!loading && pastTarget && (
            <TablePager page={page} totalPages={totalPages} total={plans.length} pageSize={PAGE_SIZE} onPage={setPage} />
          )}
        </div>
      </div>
    </div>
  );
}
