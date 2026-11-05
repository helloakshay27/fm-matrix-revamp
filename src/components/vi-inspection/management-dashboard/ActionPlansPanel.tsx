import { useState } from "react";
import { fmt } from "./data";
import { SearchIcon } from "./icons";
import {
  useActionOwnerOpenPlans,
  useSpocPendingPlans,
  type InspectionDashboardFilters,
} from "./viInspectionDashboardApi";

interface ActionPlansPanelProps {
  highlighted: boolean;
  filters: InspectionDashboardFilters;
}

interface BoardItem {
  id: number;
  name: string;
  meta: string;
  value: number;
}

// Leaderboards from GET /vi_inspection_dashboard/spoc_pending_plans and /action_owner_open_plans.
export function ActionPlansPanel({ highlighted, filters }: ActionPlansPanelProps) {
  const [spocInput, setSpocInput] = useState("");
  const [spocSearch, setSpocSearch] = useState("");
  const [ownerInput, setOwnerInput] = useState("");
  const [ownerSearch, setOwnerSearch] = useState("");

  const spocQuery = useSpocPendingPlans(filters, spocSearch);
  const ownerQuery = useActionOwnerOpenPlans(filters, ownerSearch);

  const spocItems: BoardItem[] = [...(spocQuery.data?.spocs ?? [])]
    .sort((a, b) => b.pending_plan_count - a.pending_plan_count)
    .map((item) => ({
      id: item.spoc_id,
      name: item.spoc_name,
      meta: `${fmt(item.pending_inspection_count)} inspections · ${fmt(item.pending_plan_count)} of ${fmt(item.total_no_count)} observations pending (${item.pending_percentage}%)`,
      value: item.pending_plan_count,
    }));
  const ownerItems: BoardItem[] = [...(ownerQuery.data?.action_owners ?? [])]
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
        <div>
          <div className="acc-title">Action Plans (CAPA)</div>
          <div className="acc-sub">SPOCs and Action Owners with the most pending plans</div>
        </div>
      </div>
      <div className="g g2">
        <Leaderboard
          title="SPOCs with Most Pending Plans"
          sub="Inspections assigned and still without a plan · search by SPOC name"
          total={spocQuery.data?.total_pending}
          items={spocItems}
          loading={spocQuery.loading}
          failed={!spocQuery.loading && !spocQuery.data}
          searchInput={spocInput}
          searchApplied={spocSearch}
          searchPlaceholder="Search by SPOC name"
          searchAriaLabel="Search SPOCs by name"
          onSearchInputChange={setSpocInput}
          onSearch={() => setSpocSearch(spocInput.trim())}
          onClear={() => {
            setSpocInput("");
            setSpocSearch("");
          }}
        />
        <Leaderboard
          title="Action Owners with Most Open Plans"
          sub="Plans assigned and not yet closed · search by action owner name"
          total={ownerQuery.data?.total_open}
          items={ownerItems}
          loading={ownerQuery.loading}
          failed={!ownerQuery.loading && !ownerQuery.data}
          searchInput={ownerInput}
          searchApplied={ownerSearch}
          searchPlaceholder="Search by action owner name"
          searchAriaLabel="Search action owners by name"
          onSearchInputChange={setOwnerInput}
          onSearch={() => setOwnerSearch(ownerInput.trim())}
          onClear={() => {
            setOwnerInput("");
            setOwnerSearch("");
          }}
        />
      </div>
    </div>
  );
}

interface LeaderboardProps {
  title: string;
  sub: string;
  total?: number;
  items: BoardItem[];
  loading: boolean;
  failed: boolean;
  searchInput: string;
  searchApplied: string;
  searchPlaceholder: string;
  searchAriaLabel: string;
  onSearchInputChange: (value: string) => void;
  onSearch: () => void;
  onClear: () => void;
}

function Leaderboard({
  title,
  sub,
  total,
  items,
  loading,
  failed,
  searchInput,
  searchApplied,
  searchPlaceholder,
  searchAriaLabel,
  onSearchInputChange,
  onSearch,
  onClear,
}: LeaderboardProps) {
  return (
    <div className="card">
      <div className="card-hd">
        <div>
          <div className="card-title">{title}</div>
          <div className="card-sub">{sub}</div>
        </div>
        {!loading && typeof total === "number" && <span className="card-tag">{fmt(total)} total</span>}
      </div>
      <form
        className="capa-board-search"
        onSubmit={(event) => {
          event.preventDefault();
          onSearch();
        }}
      >
        <div className="usr-search" style={{ width: "100%", maxWidth: 280 }}>
          <SearchIcon />
          <input
            type="text"
            aria-label={searchAriaLabel}
            placeholder={searchPlaceholder}
            value={searchInput}
            onChange={(event) => onSearchInputChange(event.target.value)}
          />
        </div>
        <button type="submit" className="capa-board-search-btn" disabled={loading}>
          Search
        </button>
        {(searchInput || searchApplied) && (
          <button type="button" className="capa-board-clear-btn" onClick={onClear} disabled={loading}>
            Clear
          </button>
        )}
      </form>
      {loading ? (
        <div className="card-sub" style={{ padding: "16px 0", textAlign: "center" }}>Loading…</div>
      ) : failed ? (
        <div className="card-sub" style={{ padding: "16px 0", textAlign: "center" }}>Couldn’t load data</div>
      ) : items.length === 0 ? (
        <div className="card-sub" style={{ padding: "16px 0", textAlign: "center" }}>
          {searchApplied ? "No results match your search" : "No pending plans"}
        </div>
      ) : (
        items.map((item, index) => (
          <div key={item.id} className="lb-row" style={{ cursor: "default" }}>
            <div className="lb-rank">{index + 1}</div>
            <div className="lb-info">
              <div className="lb-name">{item.name}</div>
              <div className="lb-meta">{item.meta}</div>
            </div>
            <div className="lb-val">{fmt(item.value)}</div>
          </div>
        ))
      )}
    </div>
  );
}
