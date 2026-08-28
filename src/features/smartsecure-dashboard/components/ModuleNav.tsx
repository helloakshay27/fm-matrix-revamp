import { WORKFLOWS, WORKFLOW_BUCKETS } from '../data/workflows';
import { useSmartSecureDashboard } from '../context/DashboardContext';

/** Bucket tabs + workflow chips, ported from the wireframe's renderWfSelector(). */
export function ModuleNav() {
  const { state, setWorkflow } = useSmartSecureDashboard();
  const current = WORKFLOWS.find((w) => w.key === state.wf) ?? WORKFLOWS[0];
  const currentBucket = current.bucket;
  const modsInBucket = WORKFLOWS.filter((w) => w.bucket === currentBucket);

  return (
    <div className="mnav" title="Choose a module — this filter applies to the per-module cards only">
      <div className="mnav-buckets">
        {WORKFLOW_BUCKETS.map((b) => (
          <button
            key={b}
            className={b === currentBucket ? 'on' : ''}
            onClick={() => setWorkflow(WORKFLOWS.find((w) => w.bucket === b)!.key)}
          >
            {b}
            <span className="mcount">{WORKFLOWS.filter((w) => w.bucket === b).length}</span>
          </button>
        ))}
      </div>
      <div className="mnav-mods">
        <div className="segbar">
          {modsInBucket.map((w) => (
            <button key={w.key} className={w.key === state.wf ? 'on' : ''} onClick={() => setWorkflow(w.key)}>
              {w.name}
              {w.proposed && <span className="proposed-tag"> (proposed)</span>}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
