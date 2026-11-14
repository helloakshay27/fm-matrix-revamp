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
    f: "Count of different signed-in people (each counted once) who did at least one thing on the Pulse web portal or app in the selected period.",
    m: "Each person is counted only once no matter how many times they log in. This is your reach — how many people actually used Pulse in the period."
  },
  "Screen Views": {
    f: "Count of every screen-load (view) event in the selected range: each page view on the web portal, each screen-viewed / screen-opened event in the app.",
    m: "Unlike active users, this counts every screen opened — so it climbs when people browse more deeply, not just when more people log in."
  },
  "Sessions": {
    f: "Total number of visits in the selected range. A session is one continuous visit that ends after about 30 minutes of no activity.",
    m: "If one person logs in three separate times, that's three sessions. It measures how often people are coming back, not just how many people."
  },
  "Session Duration": {
    f: "Total time everyone spent in the app ÷ total number of sessions.",
    m: "The average length of a single visit, shown in minutes and seconds. A session ends after ~30 minutes of inactivity, so this reflects real time-in-app."
  },
  "Bounce Rate": {
    f: "Sessions that only saw the launch or home page (sign-in, or the Pulse home page) ÷ all sessions, shown as a percentage.",
    m: "A \"bounce\" is a visit where someone opened Pulse but left without doing anything. Lower is better — it means people are finding a reason to stay."
  },
  "Returning Users": {
    f: "Users active in the period who were also active in a prior period.",
    m: "Retention and loyalty of the resident base."
  },
  "Recently Online": {
    f: "Count of distinct signed-in people who were active in the last 30 minutes.",
    m: "A near-live pulse of who is in Pulse right now. It moves up and down through the day rather than reflecting the whole date range."
  },
  "Views / Session": {
    f: "Total screen views ÷ total sessions.",
    m: "How much of the app a resident explores per visit."
  },
  "Device / Platform Split": {
    f: "Sessions split by the device they came from — Desktop, Mobile and Tablet — each shown as a share of total sessions.",
    m: "Tells you how residents are reaching the app. A heavy mobile/tablet share usually means people working on the move rather than at a desk — Pulse is a mobile-first community app."
  },
  "Seat Utilisation": {
    f: "Weekly active users (WAU) ÷ total seats (licences purchased), shown as a percentage.",
    m: "Of all the logins you pay for, what share are actually being used each week. A low number means licences are sitting idle."
  },
  "Stickiness": {
    f: "Average daily active users ÷ monthly active users, shown as a percentage (DAU ÷ MAU).",
    m: "Of the people who use the app in a month, what share use it on any given day. Roughly 30% means the average active user shows up ~9 days a month. Higher means more habitual use."
  },
  "Adoption Trend": {
    f: "This week's active users (the last 7 days) compared with the average of the 8 weeks before: (this week − average) ÷ average, as a percentage. Weeks before Pulse went live are left out of the average.",
    m: "A simple momentum reading: a positive number means more people are engaging than over the last two months, a negative number means engagement is slipping."
  },
  "14-Day Activation": {
    f: "New users who did a first real action (used a feature, not just sign-in or the home page) within 14 days of first appearing ÷ all new users in the period, as a percentage.",
    m: "\"Activated\" means a new user got past just logging in and actually did something real. It shows how well newcomers get off the ground in their first two weeks."
  },
  "Module Breadth": {
    f: "Count of Pulse modules (the section after /pulse/ in the page address, e.g. carpool or amenity) used in the range, out of every module at least 3 people have ever used. Sign-in pages and this usage dashboard are not modules.",
    m: "How much of Pulse is genuinely in use versus sitting idle, not just the home page."
  },
  "Workflow Adoption": {
    f: "Users who did the workflow's first step ÷ users active in the period, as a percentage.",
    m: "For the module you're viewing, how many of the active people have actually begun using its workflow at all."
  },
  "Completion Rate": {
    f: "Users who reached the final step ÷ users who did the first step, as a percentage.",
    m: "Of the people who begin a process (e.g. an amenity booking or a carpool setup), how many carry it through to the end rather than abandoning partway."
  },
  "Biggest Step Drop": {
    f: "At every step, users lost ÷ users at the step before; the largest loss is shown, as a percentage.",
    m: "Pinpoints the one place people most often get stuck or give up. Lower is better; a high number flags a confusing or heavy step to fix first."
  },
  "Usage Volume": {
    f: "Count of users who reached the final step in the selected range.",
    m: "How much work was actually completed in the module — how many people finished the workflow. Shows overall throughput."
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
