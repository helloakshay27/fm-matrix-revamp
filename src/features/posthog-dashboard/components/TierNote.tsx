import { useDashboard } from '../context/DashboardContext';

const NOTES: Record<string, string> = {
  t1: "Site Manager view. Scope locked to your single site. You see Traffic + Adoption for your team plus every module's workflow drop-off. Cross-site comparison is not shown at this tier.",
  t2: "Regional view (inherits Site Manager). Everything a Site Manager sees, rolled up across your region's sites — plus the site league table (A9) so you can spot which sites are disengaging. Drill a site to open its Site view.",
  t3: 'Management view (inherits Regional + Site). All lower-tier metrics for the whole organisation, plus the region roll-up and portfolio adoption health. Drill region → site → team.',
};

export function TierNote() {
  const { vm } = useDashboard();
  const note = NOTES[vm.state.tier];
  const [lead, ...rest] = note.split('. ');
  return (
    <div className="phg-scope-note">
      <span>▸</span>
      <span><b>{lead}.</b> {rest.join('. ')}</span>
    </div>
  );
}

export function BenchmarkNote() {
  return (
    <div className="phg-bmnote">
      <span>◎</span>
      <span>
        <b>Benchmarks are yours to set.</b> Every KPI tile has a <b>Target</b> field — type your own number and the tile shows <b>✓ on target</b> or <b>✕ off target</b> live. Rate KPIs start with a suggested target; count KPIs start blank for you to define. In production these targets are saved per customer (and can be set per site / region / tier).
      </span>
    </div>
  );
}
