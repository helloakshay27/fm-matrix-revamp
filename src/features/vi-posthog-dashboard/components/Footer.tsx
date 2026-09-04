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
      window of equal length. <b>A1</b> reports active seats rather than a utilisation
      percentage: licensed seats are billing data the events do not carry and no seat count is
      entered here, so the API returns the active count and no denominator. <b>Workflow</b>
      names, their bucket grouping and their event steps come from the Vi PostHog event
      catalogue; every volume, rate and trend on this page comes from the API. Hover the{' '}
      <code>i</code> on any tile or chart for its exact formula.
    </div>
  );
}
