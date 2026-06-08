export default function StickyActionBar() {
  return (
    <div className="sticky-bar">
      <div className="sticky-label">Act today</div>
      <div className="sticky-actions">
        <div className="sa">
          <div className="sa-dot" style={{ background: '#E7848E' }} />
          <div>
            <div className="sa-text">Close Sprints 3–8 — 404 days overrun is corrupting all velocity data</div>
            <div className="sa-action" style={{ color: '#E7848E' }}>→ Sprint settings · today</div>
          </div>
        </div>
        <div className="sa">
          <div className="sa-dot" style={{ background: '#E7848E' }} />
          <div>
            <div className="sa-text">Sadanand Gupta has 1,214 overdue tasks — redistribute or reprioritise</div>
            <div className="sa-action" style={{ color: '#E7848E' }}>→ Task reassignment · this week</div>
          </div>
        </div>
        <div className="sa">
          <div className="sa-dot" style={{ background: '#EDC488' }} />
          <div>
            <div className="sa-text">Backlog growing 38% faster than cleared — freeze non-critical creation</div>
            <div className="sa-action" style={{ color: '#EDC488' }}>→ Backlog review · this week</div>
          </div>
        </div>
        <div className="sa">
          <div className="sa-dot" style={{ background: '#6B9BCC' }} />
          <div>
            <div className="sa-text">Only 17 of 22,307 tasks use recurring — team is creating duplicate tasks manually instead</div>
            <div className="sa-action" style={{ color: '#6B9BCC' }}>→ Process fix · this week</div>
          </div>
        </div>
      </div>
    </div>
  );
}
