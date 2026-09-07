import { ANALYTICS_TENANT_URL } from '../api/adoptionApi';
import { TOTAL_REAL_EVENTS } from '../data/constants';

/**
 * The dashboard's standing disclosure.
 *
 * The wireframe's version said every number was sample data. That is no longer true — the
 * numbers are live — but the catalogue caveats behind them are, so this now states what the
 * data actually is and what still needs confirming.
 */
export function Footer() {
  return (
    <div className="footer">
      <b>Data note.</b> Every number on this dashboard is a live query against the FM Adoption
      Analytics API (<code>/fm/adoption/*</code>), the same nine endpoints behind{' '}
      <code>/posthog-dashboard</code> and <code>/vi-posthog-dashboard</code>, scoped to{' '}
      <code>{ANALYTICS_TENANT_URL}</code>. The <b>module names, screen structure, and event
      names</b> shown on Workflow Usage are the real, documented events from{' '}
      <code>Calendar_App_PostHog_Events.xlsx</code> — {TOTAL_REAL_EVENTS} events across 16
      categories, View/Action/Failure typed.{' '}
      <b>⚠️ This catalogue is a single flat sheet and names no tenant/client value of its
      own</b> — there is no "Read Me" sheet listing the standard device/tenant/session
      properties and no "Known Gaps" sheet — so this dashboard reports on the frontend host it
      is served from (<code>{ANALYTICS_TENANT_URL}</code>), where the web calendar at{' '}
      <code>/employee/calendar</code> is instrumented by <code>PostHogCalendarEvents</code>.
      That <code>url</code> parameter is a <b>frontend hostname, not the app's API base URL</b>
      — passing the backend host returns zero rows. Confirm the mobile app's tenant value with
      engineering before treating these as whole-product numbers, or web and mobile traffic will
      be summed together.{' '}
      <b>⚠️ Traffic &amp; Session and Adoption &amp; Engagement are whole-tenant, not
      calendar-only.</b>{' '}
      Those seven endpoints accept no page or module filter — passing{' '}
      <code>module</code>/<code>sub_module</code> returns byte-identical responses, and the
      endpoint's own formula block confirms it (<code>U1 = uniq(distinct_id) over the
      period</code>, no <code>$pathname</code> dimension) — so those two layers report the same
      figures as <code>/posthog-dashboard</code>. Only the <b>Calendar module</b> strip and the{' '}
      <b>Workflow Usage</b> layer are scoped to <code>/employee/calendar</code>. Narrowing the
      first two layers needs a path filter added to those queries server-side. Two further
      limits are structural, not bugs: the endpoints expose{' '}
      <b>no provider dimension</b>, so the wireframe's Provider filter and Provider-wise
      breakdown are replaced by a module league table; and <code>workflow_usage</code>{' '}
      <b>derives funnels from route segments, not from catalogue event names</b>, so Create
      Event and Connect Calendar Account both resolve to <code>/employee/calendar</code> and
      return the same path-derived funnel until the backend groups on the instrumented step
      events. Workflows with no web screen are listed but left unqueried. Hover the{' '}
      <code>i</code> on any tile or chart for its exact definition.
    </div>
  );
}
