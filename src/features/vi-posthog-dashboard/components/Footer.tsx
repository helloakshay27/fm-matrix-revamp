import { ANALYTICS_TENANT_URL } from '../api/adoptionApi';

/** Where the numbers come from, and the two caveats that survive from the source dashboard. */
export function Footer() {
  return (
    <div className="footer">
      <b>Data source.</b> Every figure on this page is a live query against the FM Adoption
      Analytics API, scoped to <code>url = {ANALYTICS_TENANT_URL}</code> plus the site, date and
      device filters in the control bar. Tenant metadata (sites and companies) comes from the
      signed-in application API, so the scope selector only lists what your account can reach.
      Layer&nbsp;1 and Layer&nbsp;2 tiles carry the change against the immediately preceding
      window of equal length. <b>Seat Utilisation (A1)</b> stays blank until you enter a licensed
      seat count — that is billing data the events do not carry, and it is sent only to{' '}
      <code>adoption_engagement</code>. <b>Module and sub-module</b> names are derived from real{' '}
      <code>$pathname</code> segments rather than a hardcoded list, so the Workflow Usage nav
      reflects whatever this tenant actually uses. Hover the <code>i</code> on any tile or chart
      for its exact formula.
    </div>
  );
}
