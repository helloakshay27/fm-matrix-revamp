import { WORKFLOWS, WORKFLOW_BUCKETS, findWorkflow } from '../data/constants';
import { useCalendarDashboard } from '../context/calendarDashboardStore';

/**
 * Bucket tabs + workflow chips for the Workflow Usage layer. This filter applies to the
 * per-module cards only.
 *
 * A workflow with no web route is still listed rather than hidden: the catalogue is the real
 * contract, and "this flow exists but the web app cannot serve it" is information worth
 * showing. Those chips are marked so the empty card below is read as expected, not broken.
 */
export function ModuleNav() {
  const { workflow, setWorkflow } = useCalendarDashboard();
  const current = findWorkflow(workflow);
  const mods = WORKFLOWS.filter((w) => w.bucket === current.bucket);

  return (
    <div className="mnav" title="Choose a workflow — this filter applies to the per-module cards only">
      <div className="mnav-buckets">
        {WORKFLOW_BUCKETS.map((b) => (
          <button
            key={b}
            type="button"
            className={b === current.bucket ? 'on' : undefined}
            onClick={() => {
              const first = WORKFLOWS.find((w) => w.bucket === b);
              if (first) setWorkflow(first.key);
            }}
          >
            {b}
            <span className="mcount">{WORKFLOWS.filter((w) => w.bucket === b).length}</span>
          </button>
        ))}
      </div>
      <div className="mnav-mods">
        <div className="segbar">
          {mods.map((w) => (
            <button
              key={w.key}
              type="button"
              className={w.key === workflow ? 'on' : undefined}
              title={w.apiModule ? undefined : 'No web screen — awaiting data'}
              onClick={() => setWorkflow(w.key)}
            >
              {w.name}
              {!w.apiModule && (
                <span style={{ opacity: 0.6, fontStyle: 'italic' }}> (no web screen)</span>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
