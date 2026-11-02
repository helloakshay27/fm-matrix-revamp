import { useEffect, useMemo, useState } from "react";
import { fmt, INFO, type ChartSpec } from "./data";
import { ChartCard } from "./ChartCard";
import { StatusBadge } from "./InfoButton";
import { SearchIcon } from "./icons";
import { TablePager } from "./TablePager";
import { EMPTY_CHART, type Ageing, type OpenActionOwner, type PastTargetPlan, type SpocPendingPlans } from "./viAuditDashboardApi";

interface CapaPanelProps {
  highlighted: boolean;
  loading: boolean;
  capaStatus: ChartSpec | null;
  capaStatusFunc: ChartSpec | null;
  capaAging: ChartSpec | null;
  capaOverdue: ChartSpec | null;
  ageing: Ageing | null;
  spocs: SpocPendingPlans[] | null;
  spocsLoading: boolean;
  spocSearch: string;
  onSpocSearchChange: (value: string) => void;
  owners: OpenActionOwner[] | null;
  ownersLoading: boolean;
  ownerSearch: string;
  onOwnerSearchChange: (value: string) => void;
  pastTarget: PastTargetPlan[] | null;
  pastTargetTotal: number;
  pastTargetLoading: boolean;
  pastTargetSearch: string;
  onPastTargetSearchChange: (value: string) => void;
  onPlan: (plan: PastTargetPlan) => void;
}

const PAGE_SIZE = 5;

export function CapaPanel({
  highlighted,
  loading,
  capaStatus,
  capaStatusFunc,
  capaAging,
  ageing,
  spocs,
  spocsLoading,
  spocSearch,
  onSpocSearchChange,
  owners,
  ownersLoading,
  ownerSearch,
  onOwnerSearchChange,
  pastTarget,
  pastTargetTotal,
  pastTargetLoading,
  pastTargetSearch,
  onPastTargetSearchChange,
  onPlan,
}: CapaPanelProps) {
  const [page, setPage] = useState(1);
  const spocRows = useMemo(
    () => [...(spocs ?? [])].sort((a, b) => b.pending_plans - a.pending_plans),
    [spocs],
  );
  const waitingTotal = useMemo(
    () => (spocs ? spocRows.reduce((sum, row) => sum + row.pending_plans, 0) : ageing?.total ?? 0),
    [spocs, spocRows, ageing],
  );
  const ownerRows = useMemo(() => [...(owners ?? [])].sort((a, b) => b.open - a.open), [owners]);
  const plans = useMemo(
    () => [...(pastTarget ?? [])].sort((a, b) => b.days_over - a.days_over),
    [pastTarget],
  );
  const matchedTotal = pastTargetSearch.trim() ? plans.length : (pastTargetTotal || plans.length);
  const totalPages = Math.max(1, Math.ceil(plans.length / PAGE_SIZE));
  const rows = plans.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  useEffect(() => {
    setPage(1);
  }, [pastTarget, pastTargetSearch]);

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
      <div className="g">
        <ChartCard title="Corrective vs Preventive Status" sub="Per circle · Corrective and Preventive plans by current state" spec={capaStatus ?? EMPTY_CHART} options={["bar", "table"]} loading={loading} unavailable={!loading && !capaStatus} />
      </div>
      <div className="g" style={{ marginTop: 16 }}>
        <ChartCard title="Corrective vs Preventive Status" sub="Per function · Corrective and Preventive plans by current state" spec={capaStatusFunc ?? EMPTY_CHART} options={["bar", "table"]} loading={loading} unavailable={!loading && !capaStatusFunc} />
      </div>
      <div className="g" style={{ marginTop: 16 }}>
        <ChartCard title="Waiting for SPOC Action Plan · Aging" sub="Days since the observation was submitted" spec={capaAging ?? EMPTY_CHART} options={["bar", "donut"]} info={INFO.aging} loading={loading} unavailable={!loading && !capaAging} chartSize="tall" />
      </div>
      <div className="g g2" style={{ marginTop: 16 }}>
        <div className="card">
          <div className="card-hd">
            <div>
              <div className="card-title">Waiting for a SPOC Action Plan</div>
              <div className="card-sub">Observations still without a plan · search by SPOC name</div>
            </div>
            {!spocsLoading && spocs && <span className="card-tag">{fmt(waitingTotal)} waiting</span>}
          </div>
          <div className="usr-search" style={{ width: "100%", maxWidth: 320, marginBottom: 12 }}>
            <SearchIcon />
            <input
              type="text"
              aria-label="Search SPOCs by name"
              placeholder="Search by SPOC name"
              value={spocSearch}
              onChange={(event) => onSpocSearchChange(event.target.value)}
            />
          </div>
          {spocsLoading ? (
            <div className="card-sub" style={{ padding: "16px 0", textAlign: "center" }}>Loading…</div>
          ) : !spocs ? (
            <div className="card-sub" style={{ padding: "16px 0", textAlign: "center" }}>Couldn’t load data</div>
          ) : spocRows.length === 0 ? (
            <div className="card-sub" style={{ padding: "16px 0", textAlign: "center" }}>
              {spocSearch.trim() ? "No SPOCs match your search" : "No pending plans"}
            </div>
          ) : (
            spocRows.map((row, index) => (
              <div key={row.spoc} className="lb-row" style={{ cursor: "default" }}>
                <div className="lb-rank">{index + 1}</div>
                <div className="lb-info">
                  <div className="lb-name">{row.spoc}</div>
                  <div className="lb-meta">Observations without a plan</div>
                </div>
                <div className="lb-val">{fmt(row.pending_plans)}</div>
              </div>
            ))
          )}
        </div>
        <div className="card">
          <div className="card-hd">
            <div>
              <div className="card-title">Action Owners with Most Open Actions</div>
              <div className="card-sub">Plans assigned and not yet closed · search by action owner name</div>
            </div>
          </div>
          <div className="usr-search" style={{ width: "100%", maxWidth: 320, marginBottom: 12 }}>
            <SearchIcon />
            <input
              type="text"
              aria-label="Search action owners by name"
              placeholder="Search by action owner name"
              value={ownerSearch}
              onChange={(event) => onOwnerSearchChange(event.target.value)}
            />
          </div>
          {ownersLoading ? (
            <div className="card-sub" style={{ padding: "16px 0", textAlign: "center" }}>Loading…</div>
          ) : !owners ? (
            <div className="card-sub" style={{ padding: "16px 0", textAlign: "center" }}>Couldn’t load data</div>
          ) : ownerRows.length === 0 ? (
            <div className="card-sub" style={{ padding: "16px 0", textAlign: "center" }}>
              {ownerSearch.trim() ? "No action owners match your search" : "No open actions"}
            </div>
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
      </div>
      <div className="g" style={{ marginTop: 16 }}>
        <div className="card">
          <div className="card-hd">
            <div>
              <div className="card-title">Plans Past Target Date</div>
              <div className="card-sub">
                Most overdue first · search by plan, audit, observation, action owner, target date or status
              </div>
            </div>
            <div className="card-actions-row">
              <div className="usr-search" style={{ width: 360 }}>
                <SearchIcon />
                <input
                  type="text"
                  aria-label="Search plans by plan, audit, observation, action owner, target date or status"
                  placeholder="Search by plan, audit, observation, action owner, target date or status"
                  value={pastTargetSearch}
                  onChange={(event) => onPastTargetSearchChange(event.target.value)}
                />
              </div>
              {!pastTargetLoading && pastTarget && (
                <span className="card-tag" style={{ background: "var(--vi-red-tint)", color: "var(--vi-red)", borderColor: "rgba(238,39,55,.20)" }}>
                  {fmt(matchedTotal)} overdue
                </span>
              )}
            </div>
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
                {pastTargetLoading ? (
                  <tr><td colSpan={7} style={{ textAlign: "center" }}>Loading…</td></tr>
                ) : !pastTarget ? (
                  <tr><td colSpan={7} style={{ textAlign: "center" }}>Couldn’t load plans past target date</td></tr>
                ) : rows.length === 0 ? (
                  <tr>
                    <td colSpan={7} style={{ textAlign: "center" }}>
                      {pastTargetSearch.trim() ? "No plans match your search" : "No plans past their target date"}
                    </td>
                  </tr>
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
          {!pastTargetLoading && pastTarget && (
            <TablePager page={page} totalPages={totalPages} total={plans.length} pageSize={PAGE_SIZE} onPage={setPage} />
          )}
        </div>
      </div>
    </div>
  );
}
