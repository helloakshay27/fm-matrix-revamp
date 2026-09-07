import { CALENDAR_WORKFLOWS, findWorkflow } from '../data/sampleData';
import { useCalendarDashboard } from '../context/calendarDashboardStore';

/**
 * Bucket tabs + workflow chips for the Workflow Usage layer. This filter applies to the
 * per-module cards only.
 */
export function ModuleNav() {
  const { workflow, setWorkflow } = useCalendarDashboard();
  const current = findWorkflow(workflow);
  // Declaration order sets tab order, exactly as the reference does it.
  const buckets = [...new Set(CALENDAR_WORKFLOWS.map((w) => w.bucket))];
  const mods = CALENDAR_WORKFLOWS.filter((w) => w.bucket === current.bucket);

  return (
    <div className="mnav" title="Choose a workflow — this filter applies to the per-module cards only">
      <div className="mnav-buckets">
        {buckets.map((b) => (
          <button
            key={b}
            type="button"
            className={b === current.bucket ? 'on' : undefined}
            onClick={() => {
              const first = CALENDAR_WORKFLOWS.find((w) => w.bucket === b);
              if (first) setWorkflow(first.key);
            }}
          >
            {b}
            <span className="mcount">{CALENDAR_WORKFLOWS.filter((w) => w.bucket === b).length}</span>
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
              onClick={() => setWorkflow(w.key)}
            >
              {w.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
