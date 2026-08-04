import { Card, CardHead } from '../components/Card';
import { Tile } from '../components/Tile';
import { Guard } from '../components/Guard';
import { ModuleNav } from '../components/ModuleNav';
import { Funnel } from '../components/charts/Funnel';
import { FlowListTable } from '../components/tables/FlowListTable';
import { PathTable } from '../components/tables/PathTable';
import { useDashboard } from '../context/DashboardContext';

export function WorkflowSection() {
  const { vm } = useDashboard();
  const { flows, status } = vm;

  return (
    <div className="phg-section" id="secFlows">
      <div className="phg-section-head">
        <h2>Workflow usage — <span>{flows.modName}</span></h2>
        <span className="phg-layerpill">Layer 3 · F-adopt / F-comp / F-step / F-vol</span>
        <span className="phg-sd">Where in the app's key workflows do people engage — or drop off? Funnel steps are inferred from URL patterns.</span>
      </div>

      <ModuleNav />

      <div className="phg-tiles" style={{ gridTemplateColumns: 'repeat(4,1fr)' }}>
        {flows.tiles.map((t) => <Tile key={t.id} {...t} />)}
      </div>

      <div className="phg-two-32" style={{ marginTop: 14 }}>
        <Card
          accent="orange"
          infoKey="chart.funnel"
          aiKey="chart.funnel"
          head={<CardHead cr="F-step · flow drop-off" ct={flows.flagshipFunnelName} cd="Sessions reaching each step: module root → create form → detail/edit. Biggest drop is highlighted." />}
        >
          <Guard status={status.flows} empty={flows.funnel.steps.length === 0}>
            <Funnel funnel={flows.funnel} />
          </Guard>
        </Card>

        <Card
          accent="blue"
          infoKey="chart.flowList"
          aiKey="chart.flowList"
          bodyClassName="phg-tbl-wrap"
          head={<CardHead cr="All screens in this module" ct="Users, events & sessions per path" cd="Raw sub-paths of the module. Per-path F-comp needs a flow_key property that isn't instrumented yet." />}
        >
          <Guard status={status.flows} empty={flows.flowRows.length === 0}>
            <table className="phg-league"><FlowListTable rows={flows.flowRows} /></table>
          </Guard>
        </Card>
      </div>

      <Card
        accent="green"
        infoKey="chart.path"
        aiKey="chart.path"
        style={{ marginTop: 14 }}
        bodyClassName="phg-tbl-wrap"
        head={<CardHead cr="Top entry screens (this module)" ct="Where people land & whether they bounce" cd="Initial path · visitors · views · bounce rate. Trend vs previous period." />}
      >
        <Guard status={status.flows} empty={flows.pathRows.length === 0}>
          <table className="phg-pathtbl"><PathTable rows={flows.pathRows} /></table>
        </Guard>
      </Card>
    </div>
  );
}
