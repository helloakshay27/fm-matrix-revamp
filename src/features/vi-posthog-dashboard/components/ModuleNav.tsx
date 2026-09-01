import { fmtC } from '@/features/posthog-dashboard/data/format';
import { useViDashboard } from '../context/viDashboardStore';

/** How many modules / sub-modules get their own button before the "more" select takes over. */
const VISIBLE = 8;

/**
 * Module and sub-module selector. Both lists come from the `modules` endpoint's `$pathname`
 * tree — nothing here is hardcoded, so the nav reflects whatever the tenant actually uses.
 */
export function ModuleNav() {
  const { vm, setModule, setSubModule } = useViDashboard();
  const { modules, subModules, state } = vm;

  const shown = modules.slice(0, VISIBLE);
  const rest = modules.slice(VISIBLE);
  const selectedIsHidden = !!state.module && !shown.some((m) => m.name === state.module);

  const subShown = subModules.slice(0, VISIBLE);
  const subRest = subModules.slice(VISIBLE);
  const subSelectedIsHidden =
    !!state.subModule && !subShown.some((m) => m.name === state.subModule);

  return (
    <div
      className="mnav"
      title="Module & sub-module are derived from real $pathname segments — this filter applies to the Workflow Usage section only"
    >
      <div className="mnav-buckets">
        {shown.map((m) => (
          <button
            key={m.name}
            type="button"
            className={m.name === state.module ? 'on' : undefined}
            onClick={() => setModule(m.name)}
            title={`${fmtC(m.users)} users · ${fmtC(m.sessions)} sessions`}
          >
            {m.name}
          </button>
        ))}
        {rest.length > 0 && (
          <select
            className="mmore"
            value={selectedIsHidden ? state.module! : ''}
            onChange={(e) => e.target.value && setModule(e.target.value)}
          >
            <option value="">More ({rest.length})…</option>
            {rest.map((m) => (
              <option key={m.name} value={m.name}>
                {m.name}
              </option>
            ))}
          </select>
        )}
      </div>

      <div className="mnav-mods">
        {subShown.length > 0 ? (
          <div className="segbar">
            {subShown.map((m) => (
              <button
                key={m.name}
                type="button"
                className={m.name === state.subModule ? 'on' : undefined}
                onClick={() => setSubModule(m.name)}
                title={`${fmtC(m.users)} users · ${fmtC(m.events)} events`}
              >
                {m.name}
              </button>
            ))}
            {subRest.length > 0 && (
              <select
                className="mmore"
                value={subSelectedIsHidden ? state.subModule! : ''}
                onChange={(e) => e.target.value && setSubModule(e.target.value)}
              >
                <option value="">More ({subRest.length})…</option>
                {subRest.map((m) => (
                  <option key={m.name} value={m.name}>
                    {m.name}
                  </option>
                ))}
              </select>
            )}
          </div>
        ) : (
          <span className="sd">
            {state.module ? `No sub-paths recorded under /${state.module}` : 'Loading modules…'}
          </span>
        )}
      </div>
    </div>
  );
}
