import { useViDashboard } from '../context/viDashboardStore';
import { VI_BUCKETS, findWorkflow, workflowsInBucket } from '../data/workflows';

/**
 * Workflow selector for Layer 3 — bucket tabs over workflow chips, the structure the Vi
 * catalogue itself defines (see data/workflows.ts).
 *
 * This deliberately does NOT list raw `$pathname` modules. The catalogue groups its 304 real
 * events into named workflows under six buckets, and that grouping is what a reader of this
 * dashboard recognises; a flat list of URL segments is an implementation detail of how the
 * events happen to be stored. Picking a workflow sets the `module` the workflow_usage
 * endpoint is queried with, so the cards below follow the selection.
 */
export function ModuleNav() {
  const { workflow, setWorkflow } = useViDashboard();

  const current = findWorkflow(workflow);
  const chips = workflowsInBucket(current.bucket);

  return (
    <div
      className="mnav"
      title="Choose a workflow — this filter applies to the Workflow Usage section only"
    >
      <div className="mnav-buckets">
        {VI_BUCKETS.map((bucket) => (
          <button
            key={bucket}
            type="button"
            className={bucket === current.bucket ? 'on' : undefined}
            // Switching bucket lands on that bucket's first workflow: a bucket is a grouping,
            // not a selectable scope of its own, so there is no "whole bucket" query to run.
            onClick={() => setWorkflow(workflowsInBucket(bucket)[0].key)}
          >
            {bucket}
            <span className="mcount">{workflowsInBucket(bucket).length}</span>
          </button>
        ))}
      </div>

      <div className="mnav-mods">
        <div className="segbar">
          {chips.map((wf) => (
            <button
              key={wf.key}
              type="button"
              className={wf.key === workflow ? 'on' : undefined}
              onClick={() => setWorkflow(wf.key)}
              title={`${wf.tier === 'modern' ? 'Modern' : 'Legacy GA'} instrumentation · ${wf.steps.join(' → ')}`}
            >
              {wf.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
