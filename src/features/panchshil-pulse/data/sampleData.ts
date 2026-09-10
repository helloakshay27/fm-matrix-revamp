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
    f: "Count of distinct residents who were active at least once in a 7-day window (weekly active users, WAU).",
    m: "Each person is counted only once no matter how many times they log in. This is your reach — how many of your community actually showed up in the week."
  },
  "Screen Views": {
    f: "Total number of screens/pages opened across everyone, added up over the selected date range.",
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
    f: "Sessions where the person viewed only one screen and took no further action ÷ total sessions, shown as a percentage.",
    m: "A \"bounce\" is a visit where someone opened the app but left without doing anything. Lower is better — it means people are finding a reason to stay."
  },
  "Returning Users": {
    f: "Users active in the period who were also active in a prior period.",
    m: "Retention and loyalty of the resident base."
  },
  "Recently Online": {
    f: "Count of distinct residents who were active in the last ~30 minutes.",
    m: "A near-live pulse of who is in the app right now. It moves up and down through the day rather than reflecting the whole date range."
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
    f: "The change in weekly active users now versus four weeks ago, expressed as a percentage rise or fall.",
    m: "A simple momentum reading: a positive number means more of your community is engaging than a month ago, a negative number means engagement is slipping."
  },
  "14-Day Activation": {
    f: "New residents who completed a first meaningful action within 14 days of getting access ÷ all new residents in that window, as a percentage.",
    m: "\"Activated\" means a new user got past just logging in and actually did something real. It shows how well newcomers get off the ground in their first two weeks."
  },
  "Module Breadth": {
    f: "Count of distinct modules (from the Pulse PostHog event dictionary) used at least once ÷ all modules available.",
    m: "How much of the platform a resident base has actually adopted, not just the home screen."
  },
  "Workflow Adoption": {
    f: "Active users who started at least one of this module's workflows ÷ active users who could use them, as a percentage.",
    m: "For the module you're viewing, how many of the relevant residents have actually begun using its workflows at all."
  },
  "Completion Rate": {
    f: "Workflow runs that reached the final step ÷ workflow runs that were started, as a percentage.",
    m: "Of the processes people begin (e.g. an amenity booking, a carpool ride, a helpdesk ticket), how many they carry through to the end rather than abandoning partway."
  },
  "Biggest Step Drop": {
    f: "At the single worst step in the workflow, the share of runs that fail to move on to the next step, as a percentage.",
    m: "Pinpoints the one place people most often get stuck or give up. Lower is better; a high number flags a confusing or heavy step to fix first."
  },
  "Usage Volume": {
    f: "Total count of workflow runs started in this module during the selected range.",
    m: "The raw amount of work flowing through the module — how many bookings, rides or tickets were kicked off. Shows overall throughput."
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
