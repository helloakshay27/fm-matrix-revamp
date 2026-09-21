import { fmtC } from '@/features/posthog-dashboard/data/format';
import { useViDashboard } from '../context/viDashboardStore';
import { toModuleLabel } from '../data/usageChart';

/**
 * Module selector for Layer 3 — one chip per entry in the `modules` endpoint's `tree`.
 *
 * The names are the API's own, not a hand-kept catalogue: under `scope_mode: app` the tree
 * returns the Vi app's real event groups (`msafe_home`, `vi_home_tab`, `tickets_create`,
 * `home_post_possession`, …), already ordered by event volume. Picking one sends it as
 * `module` — and only `module`, since the tree is flat — so every card below, including the
 * funnel, is the response for exactly that module. The chip shows a tidied label
 * (toModuleLabel) while the raw key stays in the tooltip and in the request.
 */
export function ModuleNav() {
  const { vm, setModule } = useViDashboard();
  const { modules, state } = vm;

  if (modules.length === 0) return null;

  return (
    <div
      className="mnav"
      title="Choose a module — this filter applies to the Workflow Usage section only"
    >
      <div className="mnav-mods">
        <div className="segbar">
          {modules.map((m) => (
            <button
              key={m.name}
              type="button"
              className={m.name === state.module ? 'on' : undefined}
              onClick={() => setModule(m.name)}
              title={`${m.name} · ${fmtC(m.users)} users · ${fmtC(m.events)} events · ${fmtC(
                m.sessions,
              )} sessions`}
            >
              {toModuleLabel(m.name)}
              <span className="mcount">{fmtC(m.events)}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
