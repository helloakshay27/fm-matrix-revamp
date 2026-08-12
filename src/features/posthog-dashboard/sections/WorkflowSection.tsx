import { Card, CardHead } from '../components/Card';
import { Tile } from '../components/Tile';
import { Guard } from '../components/Guard';
import { ModuleNav } from '../components/ModuleNav';
import { Funnel } from '../components/charts/Funnel';
import { FlowListTable } from '../components/tables/FlowListTable';
import { PathTable } from '../components/tables/PathTable';
import { useDashboard } from '../context/DashboardContext';
import { CanvasGrid } from '../components/CanvasGrid';
import { CanvasTile } from '../components/CanvasTile';

export function WorkflowSection() {
  const { vm } = useDashboard();
  const { flows, status } = vm;

  return (
    <section className="page on" id="pgFlows">
      <div className="section">
        <div className="section-head">
          <h2>Summary — <span>{flows.modName}</span></h2>
          <span className="layerpill">Layer 3 · F-adopt / F-comp / F-step / F-vol</span>
        </div>

        <ModuleNav />

        <CanvasGrid id="flows">
          <CanvasTile id="flows-tiles" title="Key Metrics" defaultCs={12}>
            <div className="paper bare">
              <div className="pbody">
                <div className="tiles" style={{ gridTemplateColumns: 'repeat(4,1fr)' }}>
                  {flows.tiles.map((t) => <Tile key={t.id} {...t} />)}
                </div>
              </div>
            </div>
          </CanvasTile>

          <CanvasTile id="flows-funnel" title={flows.flagshipFunnelName} defaultCs={8}>
            <Card
              infoKey="chart.funnel"
              aiKey="chart.funnel"
              head={<CardHead cr="F-step · flow drop-off" ct={flows.flagshipFunnelName} cd="Sessions reaching each step: module root → create form → detail/edit. Biggest drop is highlighted." />}
            >
              <Guard status={status.flows} empty={flows.funnel.steps.length === 0}>
                <Funnel funnel={flows.funnel} />
              </Guard>
            </Card>
          </CanvasTile>

          <CanvasTile id="flows-list" title="All screens in this module" defaultCs={4}>
            <Card
              infoKey="chart.flowList"
              aiKey="chart.flowList"
              bodyClassName="tbl-wrap"
              head={<CardHead cr="All screens in this module" ct="Users, events & sessions per path" cd="Raw sub-paths of the module. Per-path F-comp needs a flow_key property that isn't instrumented yet." />}
            >
              <Guard status={status.flows} empty={flows.flowRows.length === 0}>
                <table className="league"><FlowListTable rows={flows.flowRows} /></table>
              </Guard>
            </Card>
          </CanvasTile>

          <CanvasTile id="flows-path" title="Top entry screens" defaultCs={12}>
            <Card
              infoKey="chart.path"
              aiKey="chart.path"
              bodyClassName="tbl-wrap"
              head={<CardHead cr="Top entry screens (this module)" ct="Where people land & whether they bounce" cd="Initial path · visitors · views · bounce rate. Trend vs previous period." />}
            >
              <Guard status={status.flows} empty={flows.pathRows.length === 0}>
                <table className="pathtbl"><PathTable rows={flows.pathRows} /></table>
              </Guard>
            </Card>
          </CanvasTile>
        </CanvasGrid>
      </div>
    </section>
  );
}
