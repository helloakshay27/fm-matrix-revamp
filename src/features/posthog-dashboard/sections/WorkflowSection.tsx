import { Card, CardHead } from '../components/Card';
import { Tile } from '../components/Tile';
import { ModuleNav } from '../components/ModuleNav';
import { Funnel } from '../components/charts/Funnel';
import { FlowListTable } from '../components/tables/FlowListTable';
import { PathTable } from '../components/tables/PathTable';
import { useDashboard } from '../context/DashboardContext';

export function WorkflowSection() {
  const { vm } = useDashboard();
  const { flows } = vm;

  return (
    <div className="phg-section" id="secFlows">
      <div className="phg-section-head">
        <h2>Workflow usage — <span>{flows.modName}</span></h2>
        <span className="phg-layerpill">Layer 3 · F-adopt / F-comp / F-step / F-vol</span>
        <span className="phg-sd">Where in the app's key workflows do people engage — or drop off? Internal-dashboard style.</span>
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
          head={<CardHead cr="F-step · flagship flow drop-off" ct={flows.flagshipFunnelName} cd="Users reaching each step of the flow; biggest drop is highlighted." />}
        >
          <Funnel funnel={flows.funnel} />
        </Card>

        <Card
          accent="blue"
          infoKey="chart.flowList"
          aiKey="chart.flowList"
          bodyClassName="phg-tbl-wrap"
          head={<CardHead cr="All flows in this module" ct="Adoption & completion" cd="★ flagship. F-adopt = % of active users who start; F-comp = % who finish." />}
        >
          <table className="phg-league"><FlowListTable rows={flows.flowRows} /></table>
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
        <table className="phg-pathtbl"><PathTable rows={flows.pathRows} /></table>
      </Card>
    </div>
  );
}
