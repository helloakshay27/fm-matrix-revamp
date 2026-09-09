# Pulse Module — PostHog Event Reference

> All events are fired via `capturePulseEvent(event, props)` in `src/utils/posthogHelpers.ts`,
> which wraps the shared `capturePostHogEvent` helper and tags every event with
> `project_code: "PULSE-01"`.
>
> Automatic `$pageview` capture on every route change is already handled app-wide by
> `src/components/PostHogPageView.tsx` — it is **not** listed below since it isn't a
> Pulse-specific addition.

## Shared context on every event

Every event below also carries this common payload from `capturePostHogEvent`:

| Field | Source |
|---|---|
| `platform` | `"web"` |
| `release_version` | `VITE_APP_VERSION` env var (or `"dev"`) |
| `project_id` | `"P-223"` |
| `project_code` | `"PULSE-01"` |
| `organization_id` / `organization_name` | localStorage (`selectedOrgId`/`org_id`, `selectedOrg`) |
| `company_id` / `company_name` | localStorage (`selectedCompanyId`/`company_id`, `selectedCompany`) |
| `site_id` / `site_name` | localStorage (`selectedSiteId`/`site_id`, `selectedSiteName`) |
| `user_id` | localStorage (`userId`/`user_id`) |
| `email` | `getUser()?.email` (`src/utils/auth.ts`) |

Org/company/site context for Pulse routes is populated by `src/components/PulseDynamicHeader.tsx`
(mirrors the FM `Header.tsx` fetch pattern, since Pulse renders its own header/sidebar shell).

---

## Dashboard — `src/pages/pulse/PulseDashboardPage.tsx`

| Event | Trigger | Payload |
|---|---|---|
| `Pulse Dashboard Viewed` | Page mount | `{ screen: "pulse_dashboard" }` |
| `Pulse Dashboard Filter Changed` | Site dropdown changed | `{ screen, filter: "site", site_id, site_name }` |
| `Pulse Dashboard Filter Changed` | Date range picked (`UnifiedDateRangeFilter`) | `{ screen, filter: "date_range", from_date, to_date }` |
| `Pulse Dashboard Filters Reset` | "Reset" button clicked | `{ screen }` |
| `Pulse Dashboard Section Viewed` | Section tab switched | `{ screen, section }` — one of `customers \| users \| amenities \| events \| notices \| community \| carpool` |

**Not instrumented:** chart/segment clicks — none of the Recharts elements on this dashboard have `onClick`/navigation; they're static display charts with tooltips only. No export/download feature exists on this page.

---

## Carpool — 9 files

| Event | File | Trigger | Payload |
|---|---|---|---|
| `Pulse Carpool Ride List Viewed` | `CarpoolDashboard.tsx` | Mount | — |
| `Pulse Carpool Ride Detail Opened` | `CarpoolDashboard.tsx` (6 tabs) + `RideDetail.tsx` | Eye-icon click / detail page mount (keyed on ride id) | `{ ride_id, open_source: "list" }` |
| `Pulse Carpool Ride Report Status Updated` | `RideDetail.tsx` | Report-status dropdown changed, after `PATCH` succeeds | `{ ride_id, report_id, from_status, to_status }` |
| `Pulse Carpool Live Tracking Viewed` | `RideTracking.tsx` | Mount | — |
| `Pulse Carpool Ride Reviews Viewed` | `RideReviews.tsx` | Mount | `{ ride_id, driver_user_id }` |
| `Pulse Carpool Ride Settings Viewed` | `RideSettingsPage.tsx` | Mount | — |
| `Pulse Carpool Ride Settings Saved` | `RideSettingsPage.tsx` | Save handler, after `PUT` succeeds | `{ setting_name, setting_label, previous_value, new_value, unit }` |
| `Pulse Carpool Car Configuration Viewed` | `CarConfigurationPage.tsx` | Mount | `{ initial_tab }` |
| `Pulse Carpool Vehicle Brand Added` | `src/components/pulse-carpool/VehicleBrandsTab.tsx` | Create (not edit) submit succeeds | `{ brand_name }` |
| `Pulse Carpool Vehicle Model Added` | `src/components/pulse-carpool/VehicleModelsTab.tsx` | Create (not edit) submit succeeds | `{ model_name, brand_id, seats }` |
| `Pulse Carpool Vehicle Colour Added` | `src/components/pulse-carpool/VehicleColoursTab.tsx` | Create (not edit) submit succeeds | `{ colour_name, hex_code }` |

**Not instrumented:** ride creation/booking — no such UI exists in the admin Carpool pages (`CarpoolDashboard` is management/viewing only, confirmed via grep). Vehicle *edit* submissions were deliberately left uninstrumented — only the "add" path fires an event.

---

## Community, Notices, Amenities, Users, Contests, Rewards — 10 files

| Event | File | Trigger | Payload |
|---|---|---|---|
| `Pulse Event List Viewed` | `sections/PulseEvents.tsx` | Mount (tab switch) | `{ screen: "pulse_events" }` |
| `Pulse Notice List Viewed` | `sections/PulseNotices.tsx` | Mount | `{ screen: "pulse_notices" }` |
| `Pulse Community Viewed` | `sections/PulseCommunity.tsx` | Mount | `{ screen: "pulse_community" }` |
| `Pulse Amenity List Viewed` | `sections/PulseAmenities.tsx` | Mount | `{ screen: "pulse_amenities" }` |
| `Pulse User List Viewed` | `sections/PulseUsers.tsx` | Mount | `{ screen: "pulse_users" }` |
| `Pulse User Filter Applied` | `sections/PulseUsers.tsx` | Admin/Occupant sub-tab clicked (not on "All") | `{ screen, filters_used: ["user_type"], filter_count: 1, user_type }` |
| `Pulse Customer List Viewed` | `sections/PulseCustomers.tsx` | Mount | `{ screen: "pulse_customers" }` |
| `Pulse Contest List Viewed` | `PulseContests.tsx` | Mount | `{ screen: "pulse_contest_list" }` |
| `Pulse Contest List Searched` | `PulseContests.tsx` | 800ms-debounced search query becomes non-empty | `{ screen, query_length, result_count, returned_zero }` |
| `Pulse Contest Status Changed` | `PulseContests.tsx` | Active/inactive toggle, after `PUT` succeeds | `{ screen, contest_id, new_status }` |
| `Pulse Contest Filter Applied` | `PulseContests.tsx` | Status-card clicked (not on clear/"Total Contest") | `{ screen, filters_used: ["status"], filter_count: 1, status }` |
| `Pulse Reward List Viewed` | `PulseContestRewards.tsx` | Mount | `{ screen: "pulse_reward_list" }` |
| `Pulse Contest Reward Detail Opened` | `PulseContestRewardsDetails.tsx` | Claim loaded (keyed on claim id, not on status refetch) | `{ screen, claim_id, status }` |
| `Pulse Contest Reward Status Changed` | `PulseContestRewardsDetails.tsx` | Status updated, after `PUT` succeeds | `{ screen, claim_id, previous_status, new_status }` |
| `Pulse Contest Reward Created` | `PulseContestRewardCreate.tsx` | Create submit succeeds, before navigation away | `{ screen, contest_id, prize_id, user_id, reward_type }` |

**Not instrumented:** event/notice creation or publishing (both section components are read-only KPI/table dashboards fed by the dashboard's filter props — no create button exists); create/moderate/delete on Community and Amenities (same reason); create/edit/deactivate on Users/Customers (read-only listing tables).

---

## SOS / Safety — 4 files

| Event | File | Trigger | Payload |
|---|---|---|---|
| `Pulse SOS Alert List Viewed` | `ActiveSOS.tsx` | Mount | `{ screen: "active_sos" }` |
| `Pulse AI Alert List Viewed` | `PulseAiAlerts.tsx` | Mount (separate from the filter-driven fetch effect) | `{ screen: "pulse_ai_alerts" }` |
| `Pulse Report List Viewed` | `ActiveReports.tsx` | Mount | `{ screen: "active_reports" }` |
| `Pulse Report Status Updated` | `ActiveReports.tsx` | Status dropdown changed, after `PUT` succeeds | `{ screen, report_id, from_status: activeTab, to_status }` |
| `Pulse User Detail Opened` | `UserDetail.tsx` | Passenger detail fetch resolves | `{ screen: "user_detail", user_id, reports_count, reviews_count }` |

**Not instrumented:**
- `PulseGreeting.tsx` — trivial static banner (fetches a greeting/quote, no buttons/links).
- Detail/acknowledge/resolve actions on `ActiveSOS.tsx` and `ActiveReports.tsx` — the only interactive element ("Track Now" / Eye icon) navigates to the out-of-scope Carpool `ride-detail` page and reveals no additional in-component data, so no event was fabricated around it.
- Acknowledge/dismiss on `PulseAiAlerts.tsx` — it's a read-only findings feed; "Refresh" just re-fetches.

---

## Naming convention

- **Title Case, human-readable event names**, prefixed by module (`Pulse Carpool …`, `Pulse Contest …`, `Pulse SOS …`) — matching the existing convention in the FM ticket/helpdesk module (`src/features/tickets/*`).
- One event name is reused across variants where a `screen`/`filter`/`chart_name`-style field disambiguates (e.g. `Pulse Dashboard Filter Changed` for both site and date-range filters) — same pattern as the ticket module's `Analytics Chart Interacted`.
- Every "viewed" event fires once per mount, not on every re-render.
- Deliberately **not** instrumented: any action without a real, verifiable handler in the code. Every skip above was confirmed by reading the actual component, not assumed.
