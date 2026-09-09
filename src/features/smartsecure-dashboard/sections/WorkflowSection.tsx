import { Card, CardHead } from '../components/Card';
import { Tile } from '../components/Tile';
import { ModuleNav } from '../components/ModuleNav';
import { Funnel } from '../components/Funnel';
import { ScreensTable } from '../components/tables/ScreensTable';
import { EntryScreensTable } from '../components/tables/EntryScreensTable';
import { useSmartSecureDashboard } from '../context/DashboardContext';

export function WorkflowSection() {
  const { flows } = useSmartSecureDashboard();
  const { workflow: w, scopeNote } = flows;

  return (
    <section className="page on" id="pgFlows">
      <div className="section-head">
        <h2>Workflow Usage</h2>
        <span className="sd">
          Gate staff completion of key operational workflows per module, all-modules comparison, and where staff navigate &amp; exit.
        </span>
      </div>

      <ModuleNav />

      <div className="tiles" style={{ gridTemplateColumns: 'repeat(4,1fr)' }}>
        {flows.tiles.map((t) => <Tile key={t.label} {...t} />)}
      </div>

      {scopeNote && (
        <div className="bmnote crashnote" style={{ marginTop: 16 }}>
          <span>⚠</span>
          <div>
            <b>{scopeNote.kind === 'proposed' ? 'Proposed workflow — not yet in the PostHog catalogue.' : 'Known gap vs. the actual product flow.'}</b>{' '}
            {scopeNote.text}
          </div>
        </div>
      )}

      <Card
        style={{ margin: '16px 0' }}
        infoKey="F-step"
        head={
          <CardHead
            cr={w.proposed ? 'Workflow funnel (proposed event sequence)' : 'Workflow funnel (real event sequence)'}
            ct={`${w.name} — completion funnel`}
            cd={
              w.proposed
                ? 'Shows step-by-step completion and drop-off for the selected workflow, using proposed (not yet confirmed) event names in sequence.'
                : 'Shows step-by-step completion and drop-off for the selected workflow, using the real PostHog event names in sequence.'
            }
          />
        }
      >
        <Funnel funnel={flows.funnel} />
      </Card>

      <Card
        style={{ marginTop: 12 }}
        infoKey="F-scr"
        bodyClassName="tbl-wrap"
        head={<CardHead cr="All screens in this module" ct="All screens in this module" cd={`Every screen path inside ${w.name}, with users, events, sessions and completion rate for each.`} />}
      >
        <ScreensTable rows={flows.screens} />
      </Card>

      <Card
        style={{ marginTop: 12 }}
        infoKey="F-entry"
        bodyClassName="tbl-wrap"
        head={<CardHead cr="Top entry screens" ct="Top entry screens" cd="The first screen seen in each session — usually reached via push notification, deep link, or the app icon." />}
      >
        <EntryScreensTable rows={flows.entryScreens} />
      </Card>
    </section>
  );
}
