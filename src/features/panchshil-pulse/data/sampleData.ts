export const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export const activeUsersBase = [6400, 6700, 7050, 7400, 7800, 8150, 8500, 8900, 9250, 9600, 9950, 10300];

export const sessionsBase = [19800, 20700, 21700, 22800, 23900, 25000, 26100, 27300, 28400, 29600, 30700, 31900];

export const PROJECTS = [
  'Site A – Residential Tower 1',
  'Site B – Residential Tower 2',
  'Site C – Township Phase 1',
  'Site D – Township Phase 2'
];

export const REGISTERED_RESIDENTS = 12800;

export const modulesList: Array<[string, number]> = [
  ['Home Dashboard', 100],
  ['Auth & Onboarding', 94],
  ['Profile & Settings', 71],
  ['Community', 66],
  ['Notices', 58],
  ['Pulse Hub', 54],
  ['Amenities Booking', 49],
  ['Directory', 47],
  ['Documents', 44],
  ['Wallet & Payments', 39],
  ['Chat & Inbox', 36],
  ['Events', 33],
  ['Carpool', 27],
  ['Food & Beverage (Gokhana)', 25],
  ['Support & Helpdesk', 22],
  ['Curated Services', 19],
  ['Rewards', 16],
  ['Privilege & Loyalty', 14],
  ['Stepathon', 11],
  ['App Diagnostics', 100]
];

export const TOTAL_MODULES = modulesList.length;
export const WORKFLOW_MODULES = modulesList.filter(m => m[0] !== 'App Diagnostics');
export const TOTAL_WORKFLOW_MODULES = WORKFLOW_MODULES.length;
export const TOTAL_REAL_EVENTS = 413;

export const BM_DEFAULTS: Record<string, number> = {
  activeUsers: 75,
  bounceRate: 18,
  engagementRate: 65,
  featureInteractionRate: 50,
  wfAdoption: 50,
  wfCompletion: 70,
  wfDropoff: 30,
  featureAdoptionRate: 60,
  repeatUsageRate: 55,
  day1Retention: 55,
  day7Retention: 35,
  day30Retention: 20,
  churnRate: 10,
  crashFreeUsers: 99,
  crashFreeSessions: 99
};

export const KPI_INFO: Record<string, { f: string; m: string }> = {
  "Active Users": {
    f: "Unique residents (user_id) who fired at least one event during the selected period.",
    m: "Shows the reach of the app among registered residents — pulled directly from PostHog's person-level activity."
  },
  "Screen Views": {
    f: "Count of all screen-viewed style events across modules (e.g. HomeScreenViewed, CommunityMainScreenViewed, PulseScreenViewed).",
    m: "Overall content consumption across the app."
  },
  "Total Sessions": {
    f: "Count of distinct app sessions started in the period (from app open / SplashScreenViewed).",
    m: "Usage volume across all residents."
  },
  "Average Session Duration": {
    f: "Total session time ÷ total sessions.",
    m: "Engagement depth per visit."
  },
  "Bounce Rate": {
    f: "% of sessions with only a splash/home view and no further interaction.",
    m: "Immediate exits or a poor first impression."
  },
  "Returning Users": {
    f: "Users active in the period who were also active in a prior period.",
    m: "Retention and loyalty of the resident base."
  },
  "Recently Online": {
    f: "Distinct residents with an event in the last 30 minutes.",
    m: "A live pulse of who is in the app right now."
  },
  "Views / Session": {
    f: "Total screen views ÷ total sessions.",
    m: "How much of the app a resident explores per visit."
  },
  "Device / Platform Split": {
    f: "Share of active users and sessions by device_platform (android vs ios).",
    m: "Pulse is a mobile-first community app — this shows where engineering and QA effort should concentrate."
  },
  "Engagement Rate": {
    f: "% of sessions with a meaningful interaction beyond a view (a tap/create/submit-style event).",
    m: "Distinguishes active use from passive browsing."
  },
  "Average Time Spent": {
    f: "Total time spent in a module ÷ sessions using it.",
    m: "How much attention a module commands."
  },
  "Average Sessions per User": {
    f: "Total sessions ÷ unique active users.",
    m: "Habit and usage frequency."
  },
  "Feature Interaction Rate": {
    f: "% of sessions where a resident fired a tap/select/submit-style event, not just a *_viewed event.",
    m: "Indicates depth of feature-level engagement."
  },
  "Module Breadth": {
    f: "Count of distinct modules (from the 20-module PostHog event dictionary) used at least once ÷ 20 modules available.",
    m: "How much of the platform a resident base has actually adopted, not just the home screen."
  },
  "Workflow Adoption": {
    f: "% of active users who fired the workflow's first event (e.g. FindRideDateSelected, BookableAmenitiesFetchSuccess).",
    m: "Shows how many residents attempt this process."
  },
  "Workflow Completion Rate": {
    f: "% of users who reached the workflow's terminal success event after starting.",
    m: "How effectively the workflow converts."
  },
  "Drop-off Rate": {
    f: "% of users who fired the start event but never fired the terminal success event.",
    m: "Highlights where the process is losing residents."
  },
  "Average Completion Time": {
    f: "Median time from the workflow's first to last event.",
    m: "Indicates process friction - lower is smoother."
  },
  "Successful Completions": {
    f: "Count of users who fired the workflow's terminal success event this period.",
    m: "Absolute volume of successful task completions."
  },
  "Feature Adoption Rate": {
    f: "% of active users who used at least one tracked module.",
    m: "How broadly modules are being adopted."
  },
  "Feature Usage Frequency": {
    f: "Avg. number of times a module's events fire per active user per week.",
    m: "How habitual a module is once discovered."
  },
  "Unique Users per Feature": {
    f: "Distinct users who triggered any event in the module at least once.",
    m: "Reach of a module across the resident base."
  },
  "Repeat Usage Rate": {
    f: "% of module users who used it more than once.",
    m: "Signals whether a module earns repeat trust."
  },
  "Day 1 Retention": {
    f: "% of new users who return exactly 1 day after their first session.",
    m: "Immediate stickiness of the onboarding experience."
  },
  "Day 7 Retention": {
    f: "% of new users who return in the 7 days after their first session.",
    m: "Whether the app has earned a place in the resident's weekly routine."
  },
  "Day 30 Retention": {
    f: "% of new users still active 30 days after their first session.",
    m: "Long-run habit formation across the resident lifecycle."
  },
  "Churn Rate": {
    f: "% of previously active users with no activity in the last 30 days.",
    m: "How many residents the app is losing outright — the mirror image of retention."
  },
  "Top Entry Screen": {
    f: "The screen property value most often seen on the first event of a session.",
    m: "Where residents land — usually from a push notification or deep link."
  },
  "Top Exit Screen": {
    f: "The screen property value most often seen on the last event of a session.",
    m: "Where residents stop — either task completion or drop-off, depending on the screen."
  }
};
