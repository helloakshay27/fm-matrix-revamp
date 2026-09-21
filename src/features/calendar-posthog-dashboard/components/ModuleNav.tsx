import { useCalendarDashboard } from '../context/calendarDashboardStore';

/**
 * Module pills for the Workflow Usage layer.
 *
 * Rendered from the live `modules` API response — each pill shows the module's
 * display name and its user count badge, matching the reference design.
 * Selecting a pill sets `selectedModule` which is forwarded as the `module`
 * query-param to the `workflow_usage` API call.
 */
export function ModuleNav() {
  const { modulesList, selectedModule, setSelectedModule, flowsLoading } = useCalendarDashboard();

  return (
    <div
      className="mnav"
      id="modNav"
      title="Choose a module — filters the workflow usage data below"
    >
      <div className="mnav-mods">
        <div className="segbar" style={{ flexWrap: 'wrap', gap: 6 }}>
          {/* "All Modules" sentinel pill */}
          <button
            type="button"
            className={selectedModule === null ? 'on' : undefined}
            onClick={() => setSelectedModule(null)}
          >
            All Modules
          </button>

          {/* Live API module pills */}
          {flowsLoading && modulesList.length === 0
            ? /* skeleton pills while first load */ (
              Array.from({ length: 6 }).map((_, i) => (
                <span
                  key={i}
                  className="segbar-skeleton"
                  style={{
                    display: 'inline-block',
                    width: 80 + (i % 3) * 20,
                    height: 28,
                    borderRadius: 6,
                    background: 'var(--surface2)',
                    opacity: 0.5,
                  }}
                />
              ))
            )
            : modulesList.map((m) => {
                const displayName = m.name
                  .replace(/_/g, ' ')
                  .replace(/\b\w/g, (c) => c.toUpperCase());
                return (
                  <button
                    key={m.name}
                    type="button"
                    className={m.name === selectedModule ? 'on' : undefined}
                    onClick={() => setSelectedModule(m.name === selectedModule ? null : m.name)}
                  >
                    {displayName}
                    {m.users > 0 && <span className="mcount">{m.users}</span>}
                  </button>
                );
              })}
        </div>
      </div>
    </div>
  );
}
