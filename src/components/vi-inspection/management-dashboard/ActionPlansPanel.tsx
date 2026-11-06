import { fmt } from "./data";
import type { ActionOwnerOpenPlans, SpocPendingPlans } from "./viInspectionDashboardApi";

interface ActionPlansPanelProps {
  highlighted: boolean;
  loading: boolean;
  spoc: SpocPendingPlans | null;
  owners: ActionOwnerOpenPlans | null;
}

interface BoardItem {
  id: number;
  name: string;
  meta: string;
  value: number;
}

// Leaderboards from GET /vi_inspection_dashboard/spoc_pending_plans and /action_owner_open_plans.
export function ActionPlansPanel({ highlighted, loading, spoc, owners }: ActionPlansPanelProps) {
  const spocItems: BoardItem[] = [...(spoc?.spocs ?? [])]
    .sort((a, b) => b.pending_plan_count - a.pending_plan_count)
    .map((item) => ({
      id: item.spoc_id,
      name: item.spoc_name,
      meta: `${fmt(item.pending_inspection_count)} inspections · ${fmt(item.pending_plan_count)} of ${fmt(item.total_no_count)} observations pending (${item.pending_percentage}%)`,
      value: item.pending_plan_count,
    }));
  const ownerItems: BoardItem[] = [...(owners?.action_owners ?? [])]
    .sort((a, b) => b.open_action_count - a.open_action_count)
    .map((item) => ({
      id: item.action_owner_id,
      name: item.action_owner_name,
      meta: [
        `${fmt(item.open_inspection_count)} inspections`,
        `${fmt(item.overdue_action_count)} overdue`,
        `${fmt(item.total_action_count)} total plans`,
        (item.circles ?? []).map((circle) => circle.name).join(", "),
      ].filter(Boolean).join(" · "),
      value: item.open_action_count,
    }));

  return (
    <div className={`accordion-panel${highlighted ? " nav-highlight" : ""}`} id="acc-act">
      <div className="acc-hd">
        <div><div className="acc-title">Action Plans (CAPA)</div><div className="acc-sub">SPOCs and Action Owners with the most pending plans</div></div>
      </div>
      <div className="g g2">
        <Leaderboard title="SPOCs with Most Pending Plans" sub="Inspections assigned and still without a plan" total={spoc?.total_pending} items={spocItems} loading={loading} failed={!loading && !spoc} />
        <Leaderboard title="Action Owners with Most Open Plans" sub="Plans assigned and not yet closed" total={owners?.total_open} items={ownerItems} loading={loading} failed={!loading && !owners} />
      </div>
    </div>
  );
}

function Leaderboard({ title, sub, total, items, loading, failed }: { title: string; sub: string; total?: number; items: BoardItem[]; loading: boolean; failed: boolean }) {
  return (
    <div className="card">
      <div className="card-hd">
        <div><div className="card-title">{title}</div><div className="card-sub">{sub}</div></div>
        {!loading && typeof total === "number" && <span className="card-tag">{fmt(total)} total</span>}
      </div>
      {loading ? (
        <div className="card-sub" style={{ padding: "16px 0", textAlign: "center" }}>Loading…</div>
      ) : failed ? (
        <div className="card-sub" style={{ padding: "16px 0", textAlign: "center" }}>Couldn’t load data</div>
      ) : items.length === 0 ? (
        <div className="card-sub" style={{ padding: "16px 0", textAlign: "center" }}>No pending plans</div>
      ) : (
        items.map((item, index) => (
          <div key={item.id} className="lb-row" style={{ cursor: "default" }}>
            <div className="lb-rank">{index + 1}</div>
            <div className="lb-info"><div className="lb-name">{item.name}</div><div className="lb-meta">{item.meta}</div></div>
            <div className="lb-val">{fmt(item.value)}</div>
          </div>
        ))
      )}
    </div>
  );
}
