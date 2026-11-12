/**
 * KPI info dictionary — formula + business meaning behind every `i` popover.
 * Copied verbatim from the Calendar App wireframe; keyed by the tile label.
 */
export interface KpiInfo {
  /** Formula. */
  f: string;
  /** Business meaning. */
  m: string;
}

export const KPI_INFO: Record<string, KpiInfo> = {
 "Active Users":{f:"Unique users (user_id) who fired at least one event during the selected period, scoped to the app's tenant/client property and is_test = false.",m:"Shows how many accounts are actually using the app — pulled directly from PostHog's person-level activity."},
 "Screen Views":{f:"Count of all View-typed screen events across modules, grouped by the explicit screen property stamped at the call site — this catalogue does not document PostHog's own automatic $screen event as in use.",m:"Overall screen consumption across the app."},
 "Total Sessions":{f:"Count of distinct sessions (visits) with activity in the selected period.",m:"Usage volume across all users."},
 "Average Session Duration":{f:"Total time of all sessions ÷ number of sessions (a session runs from its first to its last event; sessions started in the period).",m:"How long a user stays active in the app per session."},
 "Bounce Rate":{f:"Sessions that never get past the launch, sign-in or home screen ÷ all sessions × 100.",m:"Immediate exits — a session that opened and closed without any real engagement."},
 "Returning Users":{f:"Users active in the period who were also active in a prior period.",m:"Consistency of usage day over day."},
 "Recently Online":{f:"Distinct users with an event in the last 30 minutes.",m:"A live pulse of who is currently active in the app."},
 "Views / Session":{f:"Total screen views ÷ total sessions.",m:"How much of the app a user traverses per visit."},
 "Device / Platform Split":{f:"Share of active users and sessions by platform (android vs ios), from the device_platform-style property this catalogue names as part of the standard device stamps AnalyticsContext adds to every event.",m:"Shows where engineering and QA effort should concentrate."},
 "Engagement Rate":{f:"% of sessions with a meaningful interaction beyond app_launched (an Action-typed event tied to a real workflow — an event created, a calendar connected, an assistant message sent — not just opening the app).",m:"Distinguishes active app usage from a session that merely opened and left."},
 "Average Time Spent":{f:"Total time spent in a module ÷ sessions using it.",m:"How much attention a module commands during a visit."},
 "Average Sessions per User":{f:"Total sessions ÷ unique active users.",m:"Usage frequency and habit across users."},
 "Feature Interaction Rate":{f:"% of sessions where a user fired an Action-typed event (e.g. creating an event, connecting a calendar, sending an assistant message), not just a screen load.",m:"Indicates depth of feature-level engagement beyond opening the app."},
 "Stickiness (DAU/MAU)":{f:"Average daily active users (DAU) over the period ÷ monthly active users (MAU, the 30 days ending on the end date) × 100.",m:"Whether Calendar use is a daily habit or an occasional check-in."},
 "Adoption Trend":{f:"This week's active users (the last 7 days) vs the average of the 8 weeks before: (this week − average) ÷ average × 100. Weeks before the app went live are left out of the average.",m:"Whether adoption is accelerating or slipping."},
 "14-Day Activation":{f:"New users (first seen in the period) who did a first real action — used a feature, not just sign-in or home — within 14 days of first appearing ÷ all new users × 100.",m:"Whether newcomers actually start using the app in their first two weeks."},
 "Module Adoption":{f:"Users who did the workflow's first step ÷ users active in the period × 100.",m:"Shows how many users attempt this process."},
 "Completion Rate":{f:"Users who reached the final step ÷ users who did the first step × 100.",m:"How effectively the workflow converts to a created event, a signed-in session, or a connected calendar."},
 "Biggest Step Drop":{f:"At every step: users lost ÷ users at the step before × 100. The largest loss is shown.",m:"Where the process is losing users."},
 "Usage Volume":{f:"Count of users who reached the workflow's final step in the period.",m:"Absolute volume of completed event creations, sign-ins or calendar connections."},
 "Module Breadth":{f:"Calendar has no module list yet: screens used at least once in the period ÷ every screen the app has ever sent.",m:"How much of the app a user has actually used, not just Calendar Home."},
 "Workflow Adoption":{f:"% of active users who fired the workflow's first event (e.g. calendar_fab_tapped, login_attempted).",m:"Shows how many users attempt this process."},
 "Workflow Completion Rate":{f:"% of users who reached the workflow's terminal success event after starting.",m:"How effectively the workflow converts to a created event, a signed-in session, or a connected calendar."},
 "Drop-off Rate":{f:"% of users who fired the start event but never fired the terminal success event.",m:"Highlights where the process is losing completions (often a *_failed rejection or an abandoned form).",},
 "Average Completion Time":{f:"Median time from the workflow's first to last event.",m:"Indicates process friction — lower means a faster, smoother path to completing the task."},
 "Successful Completions":{f:"Count of users who fired the workflow's terminal success event this period.",m:"Absolute volume of successful event creations, sign-ins, or calendar connections."},
 "Feature Adoption Rate":{f:"% of active users who used at least one tracked module.",m:"How broadly modules are being adopted across the user base."},
 "Feature Usage Frequency":{f:"Avg. number of times a module's events fire per active user per week.",m:"How habitual a module is once discovered."},
 "Unique Users per Feature":{f:"Distinct users who triggered any event in the module at least once.",m:"Reach of a module across the user base."},
 "Repeat Usage Rate":{f:"% of module users who used it more than once.",m:"Signals whether a module earns repeat trust across visits."},
 "Day 1 Retention":{f:"% of new users who return exactly 1 day after their first session.",m:"Immediate stickiness of onboarding for a newly registered user."},
 "Day 7 Retention":{f:"% of new users who return in the 7 days after their first session.",m:"Whether the app has earned a place in the user's weekly routine."},
 "Day 30 Retention":{f:"% of new users still active 30 days after their first session.",m:"Long-run habit formation among users."},
 "Churn Rate":{f:"% of previously active users with no activity in the last 30 days.",m:"How many accounts have gone inactive outright — the mirror image of retention."},
 "Top Entry Screen":{f:"The screen property value most often seen on the first event of a session.",m:"Where a session lands — this catalogue does not document a routing/destination property analogous to other apps in this family, so this is inferred from app_launched being the confirmed first event."},
 "Top Exit Screen":{f:"The screen property value most often seen on the last event of a session.",m:"Where a session stops — either a completed task or a mid-flow drop-off, depending on the screen."}
};

export function kpiInfo(label: string): KpiInfo {
  return (
    KPI_INFO[label] ?? {
      f: 'Definition not yet finalized for this metric.',
      m: 'Business meaning to be confirmed with product team.',
    }
  );
}
