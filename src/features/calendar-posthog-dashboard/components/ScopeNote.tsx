import { CALENDAR_MODULE, CALENDAR_SUB_MODULE } from '../data/constants';

/**
 * The banner that says a layer's numbers are whole-tenant, not calendar-only.
 *
 * This exists because of a hard limit in the analytics API, verified by calling it: the
 * Layer-1 and Layer-2 endpoints (`traffic_session`, `usage_and_distribution`,
 * `adoption_engagement`, `adoption_trend`, `growth`, `retention`, `roles`) accept no
 * `$pathname` dimension. Passing `module`/`sub_module` to them returns byte-identical
 * responses, and the endpoint's own formula block confirms why — `U1 = uniq(distinct_id) over
 * the period`, tenant-wide, full stop.
 *
 * So these cards show the same figures as `/posthog-dashboard`. That is real, useful context
 * — it is the denominator the calendar's own usage sits inside — but reading "315 active
 * users" as calendar users would be badly wrong, and an unlabelled duplicate dashboard is how
 * that mistake gets made. Only Workflow Usage, and the Calendar-only strip on Traffic &
 * Session, are scoped to `/employee/calendar`.
 */
export function TenantScopeNote({ layer }: { layer: string }) {
  return (
    <div className="bmnote crashnote">
      <span>ⓘ</span>
      <div>
        <b>These are whole-tenant numbers, not calendar-only.</b> The {layer} endpoints take no
        page or module filter — verified against the API — so this section reports every user
        of the tenant, exactly as <code>/posthog-dashboard</code> does. Treat it as the
        denominator the calendar sits inside. For calendar-only figures see the{' '}
        <b>Calendar module</b> strip below and the <b>Workflow Usage</b> layer, both scoped to{' '}
        <code>/{CALENDAR_MODULE}/{CALENDAR_SUB_MODULE}</code>.
      </div>
    </div>
  );
}
