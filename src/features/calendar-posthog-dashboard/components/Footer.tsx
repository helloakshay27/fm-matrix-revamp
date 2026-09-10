import { TOTAL_REAL_EVENTS } from '../data/sampleData';

/**
 * The dashboard's standing disclosure, from the reference wireframe.
 *
 * It says plainly that every number here is illustrative sample data — this page runs off a
 * seeded generator, not a query — while the module names, screen structure and event names
 * are the real, documented ones.
 */
export function Footer() {
  return (
    <div className="footer">
      <b>Wireframe note.</b> Single-tenant view — shows only Calendar App’s own users and their
      events; no cross-tenant data. <b>Every number on this dashboard is illustrative sample
      data</b> — it recomputes as you change <code>Provider</code>, <code>device</code> and{' '}
      <code>previous period</code>, but it is not pulled from a live query. The <b>module names,
      screen structure, and event names</b> are the real, documented events from{' '}
      <code>Calendar_App_PostHog_Events.xlsx</code> — {TOTAL_REAL_EVENTS} events across 16
      categories, View/Action/Failure typed. <b>Unlike every other product in this family, this
      catalogue is a single flat sheet</b> — there is no “Read Me” sheet naming the standard
      device/tenant/session properties (it only states that AnalyticsContext adds them on every
      event, without listing them) and no “Known Gaps” sheet documenting disabled code paths, so
      this dashboard does not claim a specific <code>client</code>/<code>tenant</code> filter
      value the way other products do — confirm the real tenant value with engineering before
      querying, or this dashboard’s numbers will mix in another app’s traffic. Calendar App is a
      single-persona <b>personal productivity app</b>, not a resident/employee/gate-terminal app
      — there is no audience or tier split to filter by, so the Provider dropdown filters by the
      real <code>provider</code> property on <code>calendar_account_connected</code> (Google /
      Outlook / etc.) instead of a site or persona. Per an explicit product decision,{' '}
      <b>Workflow Usage concentrates depth on one primary funnel</b> (Create Event) rather than
      giving every sub-flow its own multi-step funnel — Add People, Booking Slots, Location
      Search, Propose Time and Assistant Voice are real, catalogue-sourced flows but are
      surfaced as reach/adoption reference cards instead (see the Secondary Feature Reach card,
      Adoption &amp; Engagement page). There is <b>no automatic screen tracking documented in
      this catalogue</b> — every module/screen breakdown on this dashboard groups by the
      explicit <code>screen</code> property stamped at the call site instead. Hover the{' '}
      <code>i</code> on any tile or chart for its exact definition.
    </div>
  );
}
