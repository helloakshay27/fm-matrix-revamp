import { useDashboard } from '../context/DashboardContext';
import { fmtC } from '../data/format';

/** How many modules / sub-modules get their own button before the "more" select takes over. */
const VISIBLE = 8;

export function ModuleNav() {
  const { vm, setModule, setSubModule } = useDashboard();
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
      className="phg-mnav"
      title="Module & sub-module are derived from real $pathname segments — this filter applies to the Workflow usage section only"
    >
      <div className="phg-mnav-buckets">
        {shown.map((m) => (
          <button
            key={m.name}
            className={m.name === state.module ? 'on' : ''}
            onClick={() => setModule(m.name)}
            title={`${fmtC(m.users)} users · ${fmtC(m.sessions)} sessions`}
          >
            {m.name}
          </button>
        ))}
        {rest.length > 0 && (
          <select
            className="phg-mmore"
            value={selectedIsHidden ? state.module! : ''}
            onChange={(e) => e.target.value && setModule(e.target.value)}
          >
            <option value="">More ({rest.length})…</option>
            {rest.map((m) => (
              <option key={m.name} value={m.name}>{m.name}</option>
            ))}
          </select>
        )}
      </div>

      <div className="phg-mnav-mods">
        {subShown.length > 0 ? (
          <div className="phg-segbar">
            {subShown.map((m) => (
              <button
                key={m.name}
                className={m.name === state.subModule ? 'on' : ''}
                onClick={() => setSubModule(m.name)}
                title={`${fmtC(m.users)} users · ${fmtC(m.events)} events`}
              >
                {m.name}
              </button>
            ))}
            {subRest.length > 0 && (
              <select
                className="phg-mmore"
                value={subSelectedIsHidden ? state.subModule! : ''}
                onChange={(e) => e.target.value && setSubModule(e.target.value)}
              >
                <option value="">More ({subRest.length})…</option>
                {subRest.map((m) => (
                  <option key={m.name} value={m.name}>{m.name}</option>
                ))}
              </select>
            )}
          </div>
        ) : (
          <span className="phg-sd">
            {state.module ? `No sub-paths recorded under /${state.module}` : 'Loading modules…'}
          </span>
        )}
      </div>
    </div>
  );
}
