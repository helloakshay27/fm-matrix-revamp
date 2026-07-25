import { MODULES } from '../data/constants';
import { useDashboard } from '../context/DashboardContext';

const BUCKETS = [...new Set(MODULES.map((m) => m.bucket))];

export function ModuleNav() {
  const { vm, setMod } = useDashboard();
  const curBucket = (MODULES.find((m) => m.key === vm.state.mod) ?? MODULES[0]).bucket;
  const mods = MODULES.filter((m) => m.bucket === curBucket);

  return (
    <div className="phg-mnav" title="Choose a module — this filter applies to the Workflow usage section only">
      <div className="phg-mnav-buckets">
        {BUCKETS.map((b) => (
          <button
            key={b}
            className={b === curBucket ? 'on' : ''}
            onClick={() => {
              const first = MODULES.find((m) => m.bucket === b);
              if (first) setMod(first.key);
            }}
          >
            {b}<span className="phg-mcount">{MODULES.filter((m) => m.bucket === b).length}</span>
          </button>
        ))}
      </div>
      <div className="phg-mnav-mods">
        <div className="phg-segbar">
          {mods.map((m) => (
            <button key={m.key} className={m.key === vm.state.mod ? 'on' : ''} onClick={() => setMod(m.key)}>{m.name}</button>
          ))}
        </div>
      </div>
    </div>
  );
}
