// AUTO-GENERATED from the Life Compass source workbook
// (see "life compass/*.html"). Regenerate rather than hand-editing.

export interface LcTableBlock {
  kind: "table";
  header: string[] | null;
  rows: string[][];
}
export interface LcTextBlock {
  kind: "heading" | "note";
  text: string;
}
export type LcBlock = LcTableBlock | LcTextBlock;

export interface LcFeature {
  sr: string;
  name: string;
  description: string;
  usp: boolean;
  module: string;
}

export interface LcEnhancement {
  sr: string;
  name: string;
  current: string;
  enhanced: string;
  integration: string;
}

export interface LcSwot {
  strengths: string[];
  weaknesses: string[];
  opportunities: string[];
  threats: string[];
}

export const lifeCompassTitles: Record<string, string> = {
  "summary": "Product Summary",
  "features": "Feature List",
  "usecases": "Use Cases",
  "market": "Market Analysis",
  "pricing": "Features & Pricing",
  "swot": "SWOT Analysis",
  "roadmap": "Product Roadmap",
  "gtm": "GTM Strategy",
  "enhancements": "Enhancement Roadmap",
  "vc": "VC & Family Office",
  "fundraise": "Fundraise Strategy",
  "deck": "Fundraise Deck Brief"
};

export const lifeCompassFeatures: LcFeature[] = [
  {
    "sr": "1",
    "name": "AI Summary",
    "description": "AI Summary unlocks last after all life areas have baseline data",
    "usp": true,
    "module": "General > Dashboard"
  },
  {
    "sr": "2",
    "name": "Vision Board",
    "description": "Dashboard vision board preview after Blueprint Vision Board is unlocked",
    "usp": true,
    "module": "General > Dashboard"
  },
  {
    "sr": "3",
    "name": "Todays Mindset",
    "description": "Dashboard todays mindset card after Blueprint Vision onboarding",
    "usp": true,
    "module": "General > Dashboard"
  },
  {
    "sr": "4",
    "name": "Vision Alignment",
    "description": "Dashboard vision alignment score after Vision is set",
    "usp": true,
    "module": "General > Dashboard"
  },
  {
    "sr": "5",
    "name": "Mission Alignment",
    "description": "Dashboard mission alignment score after Mission is set",
    "usp": true,
    "module": "General > Dashboard"
  },
  {
    "sr": "6",
    "name": "Alignment Score",
    "description": "Dashboard have do be alignment after Vision + Have inputs",
    "usp": true,
    "module": "General > Dashboard"
  },
  {
    "sr": "7",
    "name": "Finance",
    "description": "Dashboard finance summary after Finance AA flow completion",
    "usp": true,
    "module": "General > Dashboard"
  },
  {
    "sr": "8",
    "name": "Health",
    "description": "Dashboard health summary after Health daily tracking begins",
    "usp": true,
    "module": "General > Dashboard"
  },
  {
    "sr": "9",
    "name": "Relationships",
    "description": "Dashboard relationships summary after People contacts and dates",
    "usp": true,
    "module": "General > Dashboard"
  },
  {
    "sr": "10",
    "name": "Career",
    "description": "Dashboard career summary after LinkedIn + career entry",
    "usp": true,
    "module": "General > Dashboard"
  },
  {
    "sr": "11",
    "name": "Life Alignment Radar",
    "description": "Dashboard life alignment radar after all pillars have data",
    "usp": true,
    "module": "General > Dashboard"
  },
  {
    "sr": "12",
    "name": "Daily User Input",
    "description": "User checks off daily habit completion on Dashboard",
    "usp": false,
    "module": "General > Dashboard"
  },
  {
    "sr": "13",
    "name": "Goal Streak",
    "description": "Dashboard goal streak after goals created and tracked",
    "usp": false,
    "module": "General > Dashboard"
  },
  {
    "sr": "14",
    "name": "Goal Progress",
    "description": "Dashboard goal progress after goals created",
    "usp": false,
    "module": "General > Dashboard"
  },
  {
    "sr": "15",
    "name": "Journal Trend",
    "description": "Dashboard journal trend after 7 days consistent entries",
    "usp": false,
    "module": "General > Dashboard"
  },
  {
    "sr": "16",
    "name": "Time Allocation By Pillar",
    "description": "Dashboard time allocation after Vision + Goals + Calendar configured",
    "usp": true,
    "module": "General > Dashboard"
  },
  {
    "sr": "17",
    "name": "Weekly Monthly Filters",
    "description": "User sets up weekly calendar view preference",
    "usp": false,
    "module": "General > Calendar"
  },
  {
    "sr": "18",
    "name": "Create Event",
    "description": "User creates calendar event",
    "usp": false,
    "module": "General > Calendar"
  },
  {
    "sr": "19",
    "name": "Create To Do",
    "description": "User creates to do from calendar",
    "usp": false,
    "module": "General > Calendar"
  },
  {
    "sr": "20",
    "name": "Schedule Appointment",
    "description": "User schedules appointment",
    "usp": false,
    "module": "General > Calendar"
  },
  {
    "sr": "21",
    "name": "Book Personal Time",
    "description": "User blocks personal time",
    "usp": false,
    "module": "General > Calendar"
  },
  {
    "sr": "22",
    "name": "Block Time Slot",
    "description": "User blocks time slot",
    "usp": false,
    "module": "General > Calendar"
  },
  {
    "sr": "23",
    "name": "Set Availability Hours",
    "description": "User sets availability hours on Calendar for AI scheduling",
    "usp": false,
    "module": "General > Calendar"
  },
  {
    "sr": "24",
    "name": "Share Availability",
    "description": "User shares availability link",
    "usp": false,
    "module": "General > Calendar"
  },
  {
    "sr": "25",
    "name": "Suggested Time Blocks",
    "description": "AI time block suggestions after full Blueprint onboarding + Calendar availability + Goals + Habits",
    "usp": true,
    "module": "General > Calendar"
  },
  {
    "sr": "26",
    "name": "Goal Allocation Suggestions",
    "description": "Goal allocation suggestions after Goals + Habits + Calendar availability",
    "usp": true,
    "module": "General > Calendar"
  },
  {
    "sr": "27",
    "name": "Habit Time Slots",
    "description": "Habit time slot suggestions after Habits created + Calendar availability",
    "usp": true,
    "module": "General > Calendar"
  },
  {
    "sr": "28",
    "name": "AI planner OS",
    "description": "AI Planner OS unlocks after full Blueprint onboarding + Calendar + Goals + Habits",
    "usp": true,
    "module": "General > Calendar"
  },
  {
    "sr": "29",
    "name": "To Do",
    "description": "User creates new to do item",
    "usp": false,
    "module": "General > Calendar"
  },
  {
    "sr": "30",
    "name": "Due Date",
    "description": "User assigns due date",
    "usp": false,
    "module": "General > Calendar"
  },
  {
    "sr": "31",
    "name": "Priority",
    "description": "User sets priority level",
    "usp": false,
    "module": "General > Calendar"
  },
  {
    "sr": "32",
    "name": "Life Area Tag",
    "description": "Life area tags suggested once Vision pillars and Goals are defined",
    "usp": false,
    "module": "General > Calendar"
  },
  {
    "sr": "33",
    "name": "Eisenhower Matrix",
    "description": "Eisenhower matrix populates from to do entries after Goals + Habits context",
    "usp": false,
    "module": "General > Calendar"
  },
  {
    "sr": "34",
    "name": "List View",
    "description": "List view populates from to do entries",
    "usp": false,
    "module": "General > Calendar"
  },
  {
    "sr": "35",
    "name": "Kanban View",
    "description": "Kanban view populates from to do entries",
    "usp": false,
    "module": "General > Calendar"
  },
  {
    "sr": "36",
    "name": "Today",
    "description": "User filters by today",
    "usp": false,
    "module": "General > Calendar"
  },
  {
    "sr": "37",
    "name": "Weekly",
    "description": "User filters by week",
    "usp": false,
    "module": "General > Calendar"
  },
  {
    "sr": "38",
    "name": "Monthly",
    "description": "User filters by month",
    "usp": false,
    "module": "General > Calendar"
  },
  {
    "sr": "39",
    "name": "Yearly",
    "description": "User filters by year",
    "usp": false,
    "module": "General > Calendar"
  },
  {
    "sr": "40",
    "name": "Custom",
    "description": "User sets custom date range",
    "usp": false,
    "module": "General > Calendar"
  },
  {
    "sr": "41",
    "name": "Suggested Due Date",
    "description": "Suggested due dates after 7 days To Do usage + Goals context",
    "usp": false,
    "module": "General > Calendar"
  },
  {
    "sr": "42",
    "name": "Suggested Priority",
    "description": "Suggested priority after 7 days To Do usage + Goals context",
    "usp": false,
    "module": "General > Calendar"
  },
  {
    "sr": "43",
    "name": "To Do Analysis",
    "description": "To Do analysis after 7 days consistent task creation and completion",
    "usp": false,
    "module": "General > Calendar"
  },
  {
    "sr": "44",
    "name": "Recurring Tasks",
    "description": "Recurring task patterns after 7 days To Do usage",
    "usp": false,
    "module": "General > Calendar"
  },
  {
    "sr": "45",
    "name": "Goal Impact",
    "description": "Goal impact assessment after 7 days To Do tracking against Goals",
    "usp": true,
    "module": "General > Calendar"
  },
  {
    "sr": "46",
    "name": "Task Mix",
    "description": "Task mix breakdown after 7 days categorised To Do entries",
    "usp": false,
    "module": "General > Calendar"
  },
  {
    "sr": "47",
    "name": "Completion Trend",
    "description": "Completion trend chart after 7 days To Do tracking",
    "usp": false,
    "module": "General > Calendar"
  },
  {
    "sr": "48",
    "name": "Gratitude",
    "description": "User writes daily gratitude reflection",
    "usp": false,
    "module": "General > Journal"
  },
  {
    "sr": "49",
    "name": "Accomplishment",
    "description": "User logs daily accomplishment",
    "usp": false,
    "module": "General > Journal"
  },
  {
    "sr": "50",
    "name": "Suggested Completed Task",
    "description": "Suggested completed tasks pulled from To Do list for that journal day",
    "usp": false,
    "module": "General > Journal"
  },
  {
    "sr": "51",
    "name": "Todays Habits",
    "description": "User checks off today's habits in journal",
    "usp": false,
    "module": "General > Journal"
  },
  {
    "sr": "52",
    "name": "Challenges",
    "description": "User reflects on today's challenges",
    "usp": false,
    "module": "General > Journal"
  },
  {
    "sr": "53",
    "name": "Mood",
    "description": "User logs mood score",
    "usp": false,
    "module": "General > Journal"
  },
  {
    "sr": "54",
    "name": "Energy",
    "description": "User logs energy score",
    "usp": false,
    "module": "General > Journal"
  },
  {
    "sr": "55",
    "name": "Affirmation",
    "description": "Daily affirmation suggested from Vision + Mission + Dreams",
    "usp": true,
    "module": "General > Journal"
  },
  {
    "sr": "56",
    "name": "Tomorrows Headstart",
    "description": "User writes tomorrow's headstart plan",
    "usp": false,
    "module": "General > Journal"
  },
  {
    "sr": "57",
    "name": "Top To Dos",
    "description": "Top To Dos suggested from active task list",
    "usp": false,
    "module": "General > Journal"
  },
  {
    "sr": "58",
    "name": "Priorities For Tomorrow",
    "description": "Priority suggestions from Goals alignment + To Do backlog",
    "usp": false,
    "module": "General > Journal"
  },
  {
    "sr": "59",
    "name": "Daily Past Records",
    "description": "Past daily entries viewable after journal entries are completed",
    "usp": false,
    "module": "General > Journal"
  },
  {
    "sr": "60",
    "name": "Write Letter To Future Self",
    "description": "User writes letter to future self and sets delivery date",
    "usp": false,
    "module": "General > Journal"
  },
  {
    "sr": "61",
    "name": "Scheduled Letters",
    "description": "Scheduled letters appear after user writes and schedules a letter",
    "usp": false,
    "module": "General > Journal"
  },
  {
    "sr": "62",
    "name": "Delivered Letters",
    "description": "Delivered letters appear when scheduled delivery date is reached",
    "usp": false,
    "module": "General > Journal"
  },
  {
    "sr": "63",
    "name": "Mood & Energy Trends",
    "description": "Journal insight unlocks after 7 days of consistent daily entries",
    "usp": false,
    "module": "General > Journal"
  },
  {
    "sr": "64",
    "name": "Mood Distribution",
    "description": "Journal insight unlocks after 7 days of consistent daily entries",
    "usp": false,
    "module": "General > Journal"
  },
  {
    "sr": "65",
    "name": "Alignment Over Time",
    "description": "Journal insight unlocks after 7 days of consistent daily entries",
    "usp": false,
    "module": "General > Journal"
  },
  {
    "sr": "66",
    "name": "What'S Driving Your Energy",
    "description": "Journal insight unlocks after 7 days of consistent daily entries",
    "usp": false,
    "module": "General > Journal"
  },
  {
    "sr": "67",
    "name": "Most Gratitude Themes",
    "description": "Journal insight unlocks after 7 days of consistent daily entries",
    "usp": false,
    "module": "General > Journal"
  },
  {
    "sr": "68",
    "name": "Recurring Key Insights",
    "description": "Journal insight unlocks after 7 days of consistent daily entries",
    "usp": false,
    "module": "General > Journal"
  },
  {
    "sr": "69",
    "name": "Weekly Score Trend",
    "description": "Journal insight unlocks after 7 days of consistent daily entries",
    "usp": false,
    "module": "General > Journal"
  },
  {
    "sr": "70",
    "name": "Score Breakdown Trend",
    "description": "Journal insight unlocks after 7 days of consistent daily entries",
    "usp": false,
    "module": "General > Journal"
  },
  {
    "sr": "71",
    "name": "Habits Consistency",
    "description": "Journal insight unlocks after 7 days of consistent daily entries",
    "usp": false,
    "module": "General > Journal"
  },
  {
    "sr": "72",
    "name": "Recurring Win Themes",
    "description": "Journal insight unlocks after 7 days of consistent daily entries",
    "usp": false,
    "module": "General > Journal"
  },
  {
    "sr": "73",
    "name": "Add Custom Course",
    "description": "User adds custom course to learning plan",
    "usp": false,
    "module": "General > Learn"
  },
  {
    "sr": "74",
    "name": "Career Milestone",
    "description": "Career goal learning plan from LinkedIn + career entries + Goals",
    "usp": true,
    "module": "General > Learn"
  },
  {
    "sr": "75",
    "name": "Ai Insights",
    "description": "AI learning insights from Career + Goals + DISC",
    "usp": true,
    "module": "General > Learn"
  },
  {
    "sr": "76",
    "name": "This Weeks Learning Block",
    "description": "Weekly learning block from career goals + Calendar availability",
    "usp": false,
    "module": "General > Learn"
  },
  {
    "sr": "77",
    "name": "Courses",
    "description": "Course library from Career profile and skill gaps",
    "usp": false,
    "module": "General > Learn"
  },
  {
    "sr": "78",
    "name": "Disc Improvements",
    "description": "DISC improvement courses after quiz completion",
    "usp": true,
    "module": "General > Learn"
  },
  {
    "sr": "79",
    "name": "History",
    "description": "Learning history from completed and added courses",
    "usp": false,
    "module": "General > Learn"
  },
  {
    "sr": "80",
    "name": "Add Bank Account",
    "description": "User adds bank account during Finance onboarding",
    "usp": false,
    "module": "My life > Finance"
  },
  {
    "sr": "81",
    "name": "Connected Sources",
    "description": "User connects financial data sources",
    "usp": false,
    "module": "My life > Finance"
  },
  {
    "sr": "82",
    "name": "Account Details",
    "description": "User provides account details for AA flow",
    "usp": false,
    "module": "My life > Finance"
  },
  {
    "sr": "83",
    "name": "Add Data Source",
    "description": "User adds data source in AA flow",
    "usp": false,
    "module": "My life > Finance"
  },
  {
    "sr": "84",
    "name": "Review Consent",
    "description": "User reviews consent request in AA flow",
    "usp": false,
    "module": "My life > Finance"
  },
  {
    "sr": "85",
    "name": "verify OTP",
    "description": "User verifies OTP in AA flow",
    "usp": false,
    "module": "My life > Finance"
  },
  {
    "sr": "86",
    "name": "Setup Consent",
    "description": "User completes consent setup in AA flow",
    "usp": false,
    "module": "My life > Finance"
  },
  {
    "sr": "87",
    "name": "Fetch Statements",
    "description": "Auto-fetched after bank AA consent flow completion",
    "usp": false,
    "module": "My life > Finance"
  },
  {
    "sr": "88",
    "name": "Statement List",
    "description": "Auto-fetched after bank AA consent flow completion",
    "usp": false,
    "module": "My life > Finance"
  },
  {
    "sr": "89",
    "name": "Transactions",
    "description": "Auto-fetched after bank AA consent flow completion",
    "usp": false,
    "module": "My life > Finance"
  },
  {
    "sr": "90",
    "name": "Income",
    "description": "Financial snapshot calculated from transaction data after AA flow",
    "usp": false,
    "module": "My life > Finance"
  },
  {
    "sr": "91",
    "name": "Expenses",
    "description": "Financial snapshot calculated from transaction data after AA flow",
    "usp": false,
    "module": "My life > Finance"
  },
  {
    "sr": "92",
    "name": "Savings",
    "description": "Financial snapshot calculated from transaction data after AA flow",
    "usp": false,
    "module": "My life > Finance"
  },
  {
    "sr": "93",
    "name": "Investments",
    "description": "Financial snapshot calculated from transaction data after AA flow",
    "usp": false,
    "module": "My life > Finance"
  },
  {
    "sr": "94",
    "name": "Savings Goals Tracking",
    "description": "Savings goal gauge from Finance data + financial goals",
    "usp": false,
    "module": "My life > Finance"
  },
  {
    "sr": "95",
    "name": "Add To Do/Goal/Habit",
    "description": "Savings plan suggested from cash flow + Goals; actionable as to do/goal/habit",
    "usp": true,
    "module": "My life > Finance"
  },
  {
    "sr": "96",
    "name": "Monthly Chart",
    "description": "Cash flow chart from transaction history",
    "usp": false,
    "module": "My life > Finance"
  },
  {
    "sr": "97",
    "name": "Annual Chart",
    "description": "Cash flow chart from transaction history",
    "usp": false,
    "module": "My life > Finance"
  },
  {
    "sr": "98",
    "name": "income - EMIs - variable spends",
    "description": "Free cash flow: income minus EMIs minus variable spends",
    "usp": false,
    "module": "My life > Finance"
  },
  {
    "sr": "99",
    "name": "AI insight",
    "description": "AI insight on free cash flow optimisation",
    "usp": true,
    "module": "My life > Finance"
  },
  {
    "sr": "100",
    "name": "Portfolio Breakdown",
    "description": "Portfolio breakdown from investment data",
    "usp": false,
    "module": "My life > Finance"
  },
  {
    "sr": "101",
    "name": "AI insight",
    "description": "AI insight on investment allocation",
    "usp": true,
    "module": "My life > Finance"
  },
  {
    "sr": "102",
    "name": "fixed EMIs",
    "description": "Fixed EMI breakdown from recurring transactions",
    "usp": false,
    "module": "My life > Finance"
  },
  {
    "sr": "103",
    "name": "Variable Monthly Spends",
    "description": "Variable spend breakdown from categorised transactions",
    "usp": false,
    "module": "My life > Finance"
  },
  {
    "sr": "104",
    "name": "AI insight",
    "description": "AI insight on expense optimisation",
    "usp": true,
    "module": "My life > Finance"
  },
  {
    "sr": "105",
    "name": "Physical",
    "description": "Health balance score from daily tracking data (water, food, reflections)",
    "usp": false,
    "module": "My life > health"
  },
  {
    "sr": "106",
    "name": "Mental",
    "description": "Health balance score from daily tracking data (water, food, reflections)",
    "usp": false,
    "module": "My life > health"
  },
  {
    "sr": "107",
    "name": "Nutritional",
    "description": "Health balance score from daily tracking data (water, food, reflections)",
    "usp": false,
    "module": "My life > health"
  },
  {
    "sr": "108",
    "name": "Exercise",
    "description": "Health target set by user during onboarding or later, progress tracked automatically",
    "usp": false,
    "module": "My life > health"
  },
  {
    "sr": "109",
    "name": "Meditation",
    "description": "Health target set by user during onboarding or later, progress tracked automatically",
    "usp": false,
    "module": "My life > health"
  },
  {
    "sr": "110",
    "name": "Journaling",
    "description": "Health target set by user during onboarding or later, progress tracked automatically",
    "usp": false,
    "module": "My life > health"
  },
  {
    "sr": "111",
    "name": "Water",
    "description": "Health target set by user during onboarding or later, progress tracked automatically",
    "usp": false,
    "module": "My life > health"
  },
  {
    "sr": "112",
    "name": "Weight",
    "description": "Health target set by user during onboarding or later, progress tracked automatically",
    "usp": false,
    "module": "My life > health"
  },
  {
    "sr": "113",
    "name": "Lower Anxiety",
    "description": "Health target set by user during onboarding or later, progress tracked automatically",
    "usp": false,
    "module": "My life > health"
  },
  {
    "sr": "114",
    "name": "Nutritional",
    "description": "Health target set by user during onboarding or later, progress tracked automatically",
    "usp": false,
    "module": "My life > health"
  },
  {
    "sr": "115",
    "name": "Add To Do/Habit/Goal",
    "description": "Action plan suggested from health data + Goals + Calendar; creates to do/habit/goal",
    "usp": true,
    "module": "My life > health"
  },
  {
    "sr": "116",
    "name": "Protein & Calories",
    "description": "Protein & calorie summary from food capture entries",
    "usp": false,
    "module": "My life > health"
  },
  {
    "sr": "117",
    "name": "Hydration",
    "description": "Hydration summary from water logging entries",
    "usp": false,
    "module": "My life > health"
  },
  {
    "sr": "118",
    "name": "Nutrition Analysis",
    "description": "Nutrition analysis from food intake patterns",
    "usp": true,
    "module": "My life > health"
  },
  {
    "sr": "119",
    "name": "Today'S Energy Chart",
    "description": "Energy chart from daily reflections energy scores",
    "usp": false,
    "module": "My life > health"
  },
  {
    "sr": "120",
    "name": "Health Improvement Chart",
    "description": "Health improvement chart tracking all metrics over time",
    "usp": false,
    "module": "My life > health"
  },
  {
    "sr": "121",
    "name": "Spike Foods",
    "description": "Spike foods identified from food impact on weight",
    "usp": false,
    "module": "My life > health"
  },
  {
    "sr": "122",
    "name": "Detox Foods",
    "description": "Detox foods identified from food impact on weight",
    "usp": false,
    "module": "My life > health"
  },
  {
    "sr": "123",
    "name": "Recommended Diet",
    "description": "Personalised diet from food habits, allergies, deficiencies",
    "usp": true,
    "module": "My life > health"
  },
  {
    "sr": "124",
    "name": "Workouts Suitable For You",
    "description": "Workout plan from health profile and fitness goals",
    "usp": true,
    "module": "My life > health"
  },
  {
    "sr": "125",
    "name": "Mood & Stress & Energy Chart",
    "description": "Mood, stress, energy chart from reflections data",
    "usp": true,
    "module": "My life > health"
  },
  {
    "sr": "126",
    "name": "Active Path",
    "description": "Active wellness path from mental health tracking",
    "usp": true,
    "module": "My life > health"
  },
  {
    "sr": "127",
    "name": "Quick Exercises",
    "description": "Quick exercises suggested from health profile and stress levels",
    "usp": true,
    "module": "My life > health"
  },
  {
    "sr": "128",
    "name": "Mood Uplifters",
    "description": "Mood uplifters suggested from reflection patterns",
    "usp": true,
    "module": "My life > health"
  },
  {
    "sr": "129",
    "name": "Water Amount",
    "description": "User logs daily water intake amount",
    "usp": false,
    "module": "My life > health"
  },
  {
    "sr": "130",
    "name": "Bottle Size",
    "description": "User configures water bottle size for hydration tracking",
    "usp": false,
    "module": "My life > health"
  },
  {
    "sr": "131",
    "name": "Daily Capture",
    "description": "User captures daily food intake entry",
    "usp": false,
    "module": "My life > health"
  },
  {
    "sr": "132",
    "name": "Food Entry Log Popup",
    "description": "User configures food entry log popup for meal tracking",
    "usp": false,
    "module": "My life > health"
  },
  {
    "sr": "133",
    "name": "Energy Score",
    "description": "Energy score logged in journal reflection, feeds health insights",
    "usp": false,
    "module": "My life > health"
  },
  {
    "sr": "134",
    "name": "Alignment Score",
    "description": "Alignment score logged in journal reflection, feeds health insights",
    "usp": false,
    "module": "My life > health"
  },
  {
    "sr": "135",
    "name": "Past Present Future",
    "description": "Past/present/future reflection logged in journal, feeds health insights",
    "usp": false,
    "module": "My life > health"
  },
  {
    "sr": "136",
    "name": "Recipes",
    "description": "Recipe library personalised to diet and nutritional needs",
    "usp": false,
    "module": "My life > health"
  },
  {
    "sr": "137",
    "name": "Workouts",
    "description": "Workout library personalised to fitness level",
    "usp": false,
    "module": "My life > health"
  },
  {
    "sr": "138",
    "name": "Stress Relief",
    "description": "Stress relief content personalised to mental health profile",
    "usp": false,
    "module": "My life > health"
  },
  {
    "sr": "139",
    "name": "Goal Progress",
    "description": "Career goal progress summary on career snapshot",
    "usp": false,
    "module": "My life > Career"
  },
  {
    "sr": "140",
    "name": "Skill Progress",
    "description": "Skill progress summary on career snapshot",
    "usp": false,
    "module": "My life > Career"
  },
  {
    "sr": "141",
    "name": "Learning Progress",
    "description": "Learning progress summary on career snapshot",
    "usp": false,
    "module": "My life > Career"
  },
  {
    "sr": "142",
    "name": "Stages Timeline",
    "description": "Career roadmap generated from current role, target role, and goals",
    "usp": false,
    "module": "My life > Career"
  },
  {
    "sr": "143",
    "name": "Impact Score",
    "description": "Impact score calculated from career progression data",
    "usp": false,
    "module": "My life > Career"
  },
  {
    "sr": "144",
    "name": "Strengths",
    "description": "SWOT Strengths generated from career data + DISC profile",
    "usp": true,
    "module": "My life > Career"
  },
  {
    "sr": "145",
    "name": "Weaknesses",
    "description": "SWOT Weaknesses generated from career data + DISC profile",
    "usp": true,
    "module": "My life > Career"
  },
  {
    "sr": "146",
    "name": "Opportunities",
    "description": "SWOT Opportunities generated from career data + DISC profile",
    "usp": true,
    "module": "My life > Career"
  },
  {
    "sr": "147",
    "name": "Threats",
    "description": "SWOT Threats generated from career data + DISC profile",
    "usp": true,
    "module": "My life > Career"
  },
  {
    "sr": "148",
    "name": "Course 1",
    "description": "Skill enhancement course recommended based on career gaps and target role",
    "usp": false,
    "module": "My life > Career"
  },
  {
    "sr": "149",
    "name": "Course 2",
    "description": "Skill enhancement course recommended based on career gaps and target role",
    "usp": false,
    "module": "My life > Career"
  },
  {
    "sr": "150",
    "name": "Course 3",
    "description": "Skill enhancement course recommended based on career gaps and target role",
    "usp": false,
    "module": "My life > Career"
  },
  {
    "sr": "151",
    "name": "LinkedIn pdf",
    "description": "User uploads LinkedIn PDF for career analysis",
    "usp": false,
    "module": "My life > Career"
  },
  {
    "sr": "152",
    "name": "Add Entry",
    "description": "User adds manual career entry (role change, certification, project)",
    "usp": false,
    "module": "My life > Career"
  },
  {
    "sr": "153",
    "name": "Vision",
    "description": "User writes personal Vision statement; first onboarding input",
    "usp": false,
    "module": "My life > blueprint"
  },
  {
    "sr": "154",
    "name": "Mission",
    "description": "User writes personal Mission statement",
    "usp": false,
    "module": "My life > blueprint"
  },
  {
    "sr": "155",
    "name": "Legacy",
    "description": "User writes personal Legacy statement",
    "usp": false,
    "module": "My life > blueprint"
  },
  {
    "sr": "156",
    "name": "Vision Board",
    "description": "Vision board unlocks after vision, mission, legacy, dreams, bucket list, core values, have/do/be & goals are entered",
    "usp": false,
    "module": "My life > blueprint"
  },
  {
    "sr": "157",
    "name": "Have",
    "description": "User defines what they want to Have in life",
    "usp": true,
    "module": "My life > blueprint"
  },
  {
    "sr": "158",
    "name": "Do Be",
    "description": "Do and Be unlock after user enters Have, Vision, Mission, Legacy and Dreams",
    "usp": false,
    "module": "My life > blueprint"
  },
  {
    "sr": "159",
    "name": "My Goals Linked",
    "description": "My Goals Linked view unlocks after Vision, Mission, Legacy, Dreams, DISC and Goals are configured",
    "usp": true,
    "module": "My life > blueprint"
  },
  {
    "sr": "160",
    "name": "Dreams and bucketlist",
    "description": "User inputs Dreams and Bucket List items",
    "usp": true,
    "module": "My life > blueprint"
  },
  {
    "sr": "161",
    "name": "Beliefs",
    "description": "User inputs personal Beliefs",
    "usp": true,
    "module": "My life > blueprint"
  },
  {
    "sr": "162",
    "name": "Limiting beliefs",
    "description": "User identifies Limiting Beliefs holding them back",
    "usp": true,
    "module": "My life > blueprint"
  },
  {
    "sr": "163",
    "name": "Core Values",
    "description": "User defines Core Values",
    "usp": true,
    "module": "My life > blueprint"
  },
  {
    "sr": "164",
    "name": "Affirmations",
    "description": "Affirmations generated across life areas after full Blueprint + Goals onboarding",
    "usp": true,
    "module": "My life > blueprint"
  },
  {
    "sr": "165",
    "name": "Manifestations",
    "description": "Manifestations generated across life areas after full Blueprint + Goals onboarding",
    "usp": true,
    "module": "My life > blueprint"
  },
  {
    "sr": "166",
    "name": "Progress overview",
    "description": "Progress overview unlocks once Goals and Habits are created and daily tracking begins",
    "usp": false,
    "module": "My life > blueprint"
  },
  {
    "sr": "167",
    "name": "Add New Habit",
    "description": "User creates first habit to support goals",
    "usp": false,
    "module": "My life > blueprint"
  },
  {
    "sr": "168",
    "name": "Input Daily Habit Update",
    "description": "User inputs daily habit completion update",
    "usp": false,
    "module": "My life > blueprint"
  },
  {
    "sr": "169",
    "name": "Past Entries",
    "description": "User reviews past habit entries",
    "usp": false,
    "module": "My life > blueprint"
  },
  {
    "sr": "170",
    "name": "Goals Tracker",
    "description": "User tracks and updates goal progress",
    "usp": false,
    "module": "My life > blueprint"
  },
  {
    "sr": "171",
    "name": "Add New Goal",
    "description": "User creates first goal linked to Vision and Dreams",
    "usp": false,
    "module": "My life > blueprint"
  },
  {
    "sr": "172",
    "name": "Goal Momentum",
    "description": "Goal momentum insights after consistent goal tracking",
    "usp": true,
    "module": "My life > blueprint"
  },
  {
    "sr": "173",
    "name": "Habit Consistency",
    "description": "Habit consistency insights after consistent daily habit updates",
    "usp": true,
    "module": "My life > blueprint"
  },
  {
    "sr": "174",
    "name": "Goal Impact",
    "description": "Goal impact assessment after goal tracking against life areas",
    "usp": true,
    "module": "My life > blueprint"
  },
  {
    "sr": "175",
    "name": "Next Action To Do",
    "description": "Next action to do suggested from goal gaps and habit data",
    "usp": true,
    "module": "My life > blueprint"
  },
  {
    "sr": "176",
    "name": "Person Name",
    "description": "User adds person name to contacts",
    "usp": false,
    "module": "Social > People"
  },
  {
    "sr": "177",
    "name": "Relationship",
    "description": "User defines relationship type",
    "usp": false,
    "module": "Social > People"
  },
  {
    "sr": "178",
    "name": "Email",
    "description": "User adds email for contact",
    "usp": false,
    "module": "Social > People"
  },
  {
    "sr": "179",
    "name": "Phone",
    "description": "User adds phone for contact",
    "usp": false,
    "module": "Social > People"
  },
  {
    "sr": "180",
    "name": "Birthday",
    "description": "User adds birthday",
    "usp": false,
    "module": "Social > People"
  },
  {
    "sr": "181",
    "name": "Anniversary",
    "description": "User adds anniversary",
    "usp": false,
    "module": "Social > People"
  },
  {
    "sr": "182",
    "name": "Contact Frequency",
    "description": "User sets contact frequency rhythm",
    "usp": false,
    "module": "Social > People"
  },
  {
    "sr": "183",
    "name": "Last Contact",
    "description": "User logs last contact date",
    "usp": false,
    "module": "Social > People"
  },
  {
    "sr": "184",
    "name": "Reach-Out Reminder",
    "description": "Reach-out reminders after People contacts, dates, and rhythm are set",
    "usp": false,
    "module": "Social > People"
  },
  {
    "sr": "185",
    "name": "Relationship Health",
    "description": "User inputs relationship health assessment",
    "usp": false,
    "module": "Social > People"
  },
  {
    "sr": "186",
    "name": "Post",
    "description": "User posts in community",
    "usp": false,
    "module": "Social > community"
  },
  {
    "sr": "187",
    "name": "Like And Comment Other'S Posts",
    "description": "User engages with community posts",
    "usp": false,
    "module": "Social > community"
  },
  {
    "sr": "188",
    "name": "Suggestions To Join Communities",
    "description": "Community suggestions after Goals + Career + Health + DISC profile data",
    "usp": true,
    "module": "Social > community"
  },
  {
    "sr": "189",
    "name": "set PIN",
    "description": "User sets Vault PIN for secure access",
    "usp": false,
    "module": "personal > vault"
  },
  {
    "sr": "190",
    "name": "Bank Name",
    "description": "User enters bank name in Vault",
    "usp": false,
    "module": "personal > vault"
  },
  {
    "sr": "191",
    "name": "Account Number",
    "description": "User enters account number in Vault",
    "usp": false,
    "module": "personal > vault"
  },
  {
    "sr": "192",
    "name": "Account Type",
    "description": "User enters account type in Vault",
    "usp": false,
    "module": "personal > vault"
  },
  {
    "sr": "193",
    "name": "branch / IFSC",
    "description": "User enters branch/IFSC in Vault",
    "usp": false,
    "module": "personal > vault"
  },
  {
    "sr": "194",
    "name": "Nominee Name",
    "description": "User enters nominee in Vault",
    "usp": false,
    "module": "personal > vault"
  },
  {
    "sr": "195",
    "name": "FD details",
    "description": "User enters FD details in Vault",
    "usp": false,
    "module": "personal > vault"
  },
  {
    "sr": "196",
    "name": "Demat Portfolio",
    "description": "User enters demat portfolio in Vault",
    "usp": false,
    "module": "personal > vault"
  },
  {
    "sr": "197",
    "name": "Bonds / Debentures",
    "description": "User enters bonds/debentures in Vault",
    "usp": false,
    "module": "personal > vault"
  },
  {
    "sr": "198",
    "name": "PPF account",
    "description": "User enters PPF account in Vault",
    "usp": false,
    "module": "personal > vault"
  },
  {
    "sr": "199",
    "name": "NPS / EPF / gratuity",
    "description": "User enters NPS/EPF/gratuity in Vault",
    "usp": false,
    "module": "personal > vault"
  },
  {
    "sr": "200",
    "name": "Gold / Jewellery",
    "description": "User enters gold/jewellery in Vault",
    "usp": false,
    "module": "personal > vault"
  },
  {
    "sr": "201",
    "name": "Bank Locker Details",
    "description": "User enters bank locker details in Vault",
    "usp": false,
    "module": "personal > vault"
  },
  {
    "sr": "202",
    "name": "Uploaded Documents",
    "description": "User enters uploaded documents in Vault",
    "usp": false,
    "module": "personal > vault"
  },
  {
    "sr": "203",
    "name": "Card Name / Bank",
    "description": "User enters card name/bank in Vault",
    "usp": false,
    "module": "personal > vault"
  },
  {
    "sr": "204",
    "name": "Last 4 Digits",
    "description": "User enters last 4 digits in Vault",
    "usp": false,
    "module": "personal > vault"
  },
  {
    "sr": "205",
    "name": "Credit Limit",
    "description": "User enters credit limit in Vault",
    "usp": false,
    "module": "personal > vault"
  },
  {
    "sr": "206",
    "name": "Due Date",
    "description": "User enters due date in Vault",
    "usp": false,
    "module": "personal > vault"
  },
  {
    "sr": "207",
    "name": "Reward Programme",
    "description": "User enters reward programme in Vault",
    "usp": false,
    "module": "personal > vault"
  },
  {
    "sr": "208",
    "name": "Property Type",
    "description": "User enters property type in Vault",
    "usp": false,
    "module": "personal > vault"
  },
  {
    "sr": "209",
    "name": "Address",
    "description": "User enters address in Vault",
    "usp": false,
    "module": "personal > vault"
  },
  {
    "sr": "210",
    "name": "Registration Number",
    "description": "User enters registration number in Vault",
    "usp": false,
    "module": "personal > vault"
  },
  {
    "sr": "211",
    "name": "Document Location",
    "description": "User enters document location in Vault",
    "usp": false,
    "module": "personal > vault"
  },
  {
    "sr": "212",
    "name": "Vehicle Type",
    "description": "User enters vehicle type in Vault",
    "usp": false,
    "module": "personal > vault"
  },
  {
    "sr": "213",
    "name": "Make & Model",
    "description": "User enters make & model in Vault",
    "usp": false,
    "module": "personal > vault"
  },
  {
    "sr": "214",
    "name": "Registration Number",
    "description": "User enters registration number in Vault",
    "usp": false,
    "module": "personal > vault"
  },
  {
    "sr": "215",
    "name": "RC / title location",
    "description": "User enters RC/title location in Vault",
    "usp": false,
    "module": "personal > vault"
  },
  {
    "sr": "216",
    "name": "Provider",
    "description": "User enters provider in Vault",
    "usp": false,
    "module": "personal > vault"
  },
  {
    "sr": "217",
    "name": "Coverage Type",
    "description": "User enters coverage type in Vault",
    "usp": false,
    "module": "personal > vault"
  },
  {
    "sr": "218",
    "name": "Plan Name",
    "description": "User enters plan name in Vault",
    "usp": false,
    "module": "personal > vault"
  },
  {
    "sr": "219",
    "name": "Spouse Coverage",
    "description": "User enters spouse coverage in Vault",
    "usp": false,
    "module": "personal > vault"
  },
  {
    "sr": "220",
    "name": "Life Insurance Policies",
    "description": "User enters life insurance policy in Vault",
    "usp": false,
    "module": "personal > vault"
  },
  {
    "sr": "221",
    "name": "Annual Leave",
    "description": "User enters annual leave in Vault",
    "usp": false,
    "module": "personal > vault"
  },
  {
    "sr": "222",
    "name": "Sick Leave",
    "description": "User enters sick leave in Vault",
    "usp": false,
    "module": "personal > vault"
  },
  {
    "sr": "223",
    "name": "EPF member",
    "description": "User enters EPF member in Vault",
    "usp": false,
    "module": "personal > vault"
  },
  {
    "sr": "224",
    "name": "Gratuity Eligible",
    "description": "User enters gratuity eligible in Vault",
    "usp": false,
    "module": "personal > vault"
  },
  {
    "sr": "225",
    "name": "Pension Plan",
    "description": "User enters pension plan in Vault",
    "usp": false,
    "module": "personal > vault"
  },
  {
    "sr": "226",
    "name": "Will Location",
    "description": "User enters will location in Vault",
    "usp": false,
    "module": "personal > vault"
  },
  {
    "sr": "227",
    "name": "Attorney Details",
    "description": "User enters attorney details in Vault",
    "usp": false,
    "module": "personal > vault"
  },
  {
    "sr": "228",
    "name": "Executor Name",
    "description": "User enters executor name in Vault",
    "usp": false,
    "module": "personal > vault"
  },
  {
    "sr": "229",
    "name": "Notes For Family",
    "description": "User enters notes for family in Vault",
    "usp": false,
    "module": "personal > vault"
  },
  {
    "sr": "230",
    "name": "Upload Will Document",
    "description": "User enters will document in Vault",
    "usp": false,
    "module": "personal > vault"
  },
  {
    "sr": "231",
    "name": "Organ Donation Preference",
    "description": "User enters organ donation preference in Vault",
    "usp": false,
    "module": "personal > vault"
  },
  {
    "sr": "232",
    "name": "Document Location",
    "description": "User enters guardianship doc location in Vault",
    "usp": false,
    "module": "personal > vault"
  },
  {
    "sr": "233",
    "name": "Additional Notes",
    "description": "User enters additional notes in Vault",
    "usp": false,
    "module": "personal > vault"
  },
  {
    "sr": "234",
    "name": "Attached Documents",
    "description": "User enters attached documents in Vault",
    "usp": false,
    "module": "personal > vault"
  },
  {
    "sr": "235",
    "name": "Vault Completion Score",
    "description": "Vault completion score from sections filled across all tabs",
    "usp": false,
    "module": "personal > vault"
  },
  {
    "sr": "236",
    "name": "Quiz",
    "description": "User completes DISC personality quiz for AI personalisation",
    "usp": true,
    "module": "personal > DISC"
  },
  {
    "sr": "237",
    "name": "Analysis",
    "description": "DISC Profile and Behaviour Style generated after quiz completion",
    "usp": true,
    "module": "personal > DISC"
  },
  {
    "sr": "238",
    "name": "Net Worth",
    "description": "Financial snapshot calculated from transaction data after AA flow",
    "usp": false,
    "module": "My life > Finance"
  },
  {
    "sr": "239",
    "name": "AI Summary",
    "description": "AI Summary unlocks after health baseline data is captured",
    "usp": true,
    "module": "My life > health"
  },
  {
    "sr": "240",
    "name": "Dietary Preferences",
    "description": "User sets dietary preferences during onboarding",
    "usp": false,
    "module": "Onboarding > health"
  },
  {
    "sr": "241",
    "name": "AI Summary",
    "description": "AI Summary unlocks after career baseline data is captured",
    "usp": true,
    "module": "My life > Career"
  },
  {
    "sr": "242",
    "name": "Income Alignment",
    "description": "Income alignment shown on career snapshot vs financial goals",
    "usp": false,
    "module": "My life > Career"
  },
  {
    "sr": "243",
    "name": "Upcoming Dates",
    "description": "Upcoming birthdays and anniversaries surfaced from People dates",
    "usp": false,
    "module": "Social > People"
  },
  {
    "sr": "244",
    "name": "Reach Out To",
    "description": "Suggested reach-out list from contact rhythm and last contact data",
    "usp": false,
    "module": "Social > People"
  },
  {
    "sr": "245",
    "name": "People Directory",
    "description": "Directory view of all contacts across relationship types",
    "usp": false,
    "module": "Social > People"
  },
  {
    "sr": "246",
    "name": "Personal And Family Details",
    "description": "User enters personal and family details for contacts",
    "usp": false,
    "module": "Social > People"
  },
  {
    "sr": "247",
    "name": "Professional Contacts",
    "description": "Professional contacts view filtered from People directory",
    "usp": false,
    "module": "Social > People"
  },
  {
    "sr": "248",
    "name": "Emergency Contacts",
    "description": "User tags contacts as emergency contacts",
    "usp": false,
    "module": "Social > People"
  },
  {
    "sr": "249",
    "name": "Data Sovereignty Guarantee",
    "description": "User data is never sold or shared with third parties for advertising or marketing purposes; all personal data stays within a user-controlled, sovereign boundary.",
    "usp": true,
    "module": "Personal > Trust & Privacy"
  },
  {
    "sr": "250",
    "name": "No Ad-Targeting Policy",
    "description": "Personal data is never used to build advertising profiles or targeted marketing segments, inside the app or for any external advertiser.",
    "usp": true,
    "module": "Personal > Trust & Privacy"
  },
  {
    "sr": "251",
    "name": "Metadata-Only AI Personalisation",
    "description": "AI recommendations are generated from aggregated behavioural metadata (patterns, frequencies, completions) rather than reading or exposing personal content itself, wherever technically possible.",
    "usp": true,
    "module": "Personal > Trust & Privacy"
  },
  {
    "sr": "252",
    "name": "User Data Ownership & Export",
    "description": "Users can export or permanently delete their complete data set at any time; the user, not the platform, owns their data.",
    "usp": true,
    "module": "Personal > Trust & Privacy"
  },
  {
    "sr": "253",
    "name": "Regional Data Residency",
    "description": "Data is stored within the user's own region/jurisdiction (India, GCC, UK, US, EU) to meet local data-sovereignty and compliance expectations.",
    "usp": true,
    "module": "Personal > Trust & Privacy"
  }
];

export const lifeCompassEnhancements: LcEnhancement[] = [
  {
    "sr": "1",
    "name": "AI Summary",
    "current": "AI Summary is shown as a static card/score on the Dashboard once its unlock condition is met.",
    "enhanced": "An AI agent proactively surfaces 'AI Summary' as a conversational nudge (in-app or via the AI audio companion) at the moment it becomes most relevant, instead of waiting for the user to open the Dashboard.",
    "integration": "AI"
  },
  {
    "sr": "2",
    "name": "Vision Board",
    "current": "vision board is shown as a static card/score on the Dashboard once its unlock condition is met.",
    "enhanced": "An AI agent proactively surfaces 'vision board' as a conversational nudge (in-app or via the AI audio companion) at the moment it becomes most relevant, instead of waiting for the user to open the Dashboard.",
    "integration": "AI"
  },
  {
    "sr": "3",
    "name": "Todays Mindset",
    "current": "todays mindset is shown as a static card/score on the Dashboard once its unlock condition is met.",
    "enhanced": "An AI agent proactively surfaces 'todays mindset' as a conversational nudge (in-app or via the AI audio companion) at the moment it becomes most relevant, instead of waiting for the user to open the Dashboard.",
    "integration": "AI"
  },
  {
    "sr": "4",
    "name": "Vision Alignment",
    "current": "vision alignment is shown as a static card/score on the Dashboard once its unlock condition is met.",
    "enhanced": "An AI agent proactively surfaces 'vision alignment' as a conversational nudge (in-app or via the AI audio companion) at the moment it becomes most relevant, instead of waiting for the user to open the Dashboard.",
    "integration": "AI"
  },
  {
    "sr": "5",
    "name": "Mission Alignment",
    "current": "mission alignment is shown as a static card/score on the Dashboard once its unlock condition is met.",
    "enhanced": "An AI agent proactively surfaces 'mission alignment' as a conversational nudge (in-app or via the AI audio companion) at the moment it becomes most relevant, instead of waiting for the user to open the Dashboard.",
    "integration": "AI"
  },
  {
    "sr": "6",
    "name": "Alignment Score",
    "current": "alignment score is shown as a static card/score on the Dashboard once its unlock condition is met.",
    "enhanced": "An AI agent proactively surfaces 'alignment score' as a conversational nudge (in-app or via the AI audio companion) at the moment it becomes most relevant, instead of waiting for the user to open the Dashboard.",
    "integration": "AI"
  },
  {
    "sr": "7",
    "name": "Finance",
    "current": "finance is shown as a static card/score on the Dashboard once its unlock condition is met.",
    "enhanced": "An AI agent proactively surfaces 'finance' as a conversational nudge (in-app or via the AI audio companion) at the moment it becomes most relevant, instead of waiting for the user to open the Dashboard.",
    "integration": "AI"
  },
  {
    "sr": "8",
    "name": "Health",
    "current": "health is shown as a static card/score on the Dashboard once its unlock condition is met.",
    "enhanced": "An AI agent proactively surfaces 'health' as a conversational nudge (in-app or via the AI audio companion) at the moment it becomes most relevant, instead of waiting for the user to open the Dashboard.",
    "integration": "AI"
  },
  {
    "sr": "9",
    "name": "Relationships",
    "current": "relationships is shown as a static card/score on the Dashboard once its unlock condition is met.",
    "enhanced": "An AI agent proactively surfaces 'relationships' as a conversational nudge (in-app or via the AI audio companion) at the moment it becomes most relevant, instead of waiting for the user to open the Dashboard.",
    "integration": "AI"
  },
  {
    "sr": "10",
    "name": "Career",
    "current": "career is shown as a static card/score on the Dashboard once its unlock condition is met.",
    "enhanced": "An AI agent proactively surfaces 'career' as a conversational nudge (in-app or via the AI audio companion) at the moment it becomes most relevant, instead of waiting for the user to open the Dashboard.",
    "integration": "AI"
  },
  {
    "sr": "11",
    "name": "Life Alignment Radar",
    "current": "life alignment radar is shown as a static card/score on the Dashboard once its unlock condition is met.",
    "enhanced": "An AI agent proactively surfaces 'life alignment radar' as a conversational nudge (in-app or via the AI audio companion) at the moment it becomes most relevant, instead of waiting for the user to open the Dashboard.",
    "integration": "AI"
  },
  {
    "sr": "12",
    "name": "Daily User Input",
    "current": "daily user input is shown as a static card/score on the Dashboard once its unlock condition is met.",
    "enhanced": "An AI agent proactively surfaces 'daily user input' as a conversational nudge (in-app or via the AI audio companion) at the moment it becomes most relevant, instead of waiting for the user to open the Dashboard.",
    "integration": "AI"
  },
  {
    "sr": "13",
    "name": "Goal Streak",
    "current": "goal streak is shown as a static card/score on the Dashboard once its unlock condition is met.",
    "enhanced": "An AI agent proactively surfaces 'goal streak' as a conversational nudge (in-app or via the AI audio companion) at the moment it becomes most relevant, instead of waiting for the user to open the Dashboard.",
    "integration": "AI"
  },
  {
    "sr": "14",
    "name": "Goal Progress",
    "current": "goal progress is shown as a static card/score on the Dashboard once its unlock condition is met.",
    "enhanced": "An AI agent proactively surfaces 'goal progress' as a conversational nudge (in-app or via the AI audio companion) at the moment it becomes most relevant, instead of waiting for the user to open the Dashboard.",
    "integration": "AI"
  },
  {
    "sr": "15",
    "name": "Journal Trend",
    "current": "journal trend is shown as a static card/score on the Dashboard once its unlock condition is met.",
    "enhanced": "An AI agent proactively surfaces 'journal trend' as a conversational nudge (in-app or via the AI audio companion) at the moment it becomes most relevant, instead of waiting for the user to open the Dashboard.",
    "integration": "AI"
  },
  {
    "sr": "16",
    "name": "Time Allocation By Pillar",
    "current": "time allocation by pillar is shown as a static card/score on the Dashboard once its unlock condition is met.",
    "enhanced": "An AI agent proactively surfaces 'time allocation by pillar' as a conversational nudge (in-app or via the AI audio companion) at the moment it becomes most relevant, instead of waiting for the user to open the Dashboard.",
    "integration": "AI"
  },
  {
    "sr": "17",
    "name": "Weekly Monthly Filters",
    "current": "weekly monthly filters is created and managed manually inside the app's own calendar view.",
    "enhanced": "Two-way MCP sync with Google Calendar/Outlook plus an AI layer that adjusts 'weekly monthly filters' automatically as real calendar conflicts or goal priorities change.",
    "integration": "MCP"
  },
  {
    "sr": "18",
    "name": "Create Event",
    "current": "create event is created and managed manually inside the app's own calendar view.",
    "enhanced": "Two-way MCP sync with Google Calendar/Outlook plus an AI layer that adjusts 'create event' automatically as real calendar conflicts or goal priorities change.",
    "integration": "MCP"
  },
  {
    "sr": "19",
    "name": "Create To Do",
    "current": "create to do is created and managed manually inside the app's own calendar view.",
    "enhanced": "Two-way MCP sync with Google Calendar/Outlook plus an AI layer that adjusts 'create to do' automatically as real calendar conflicts or goal priorities change.",
    "integration": "MCP"
  },
  {
    "sr": "20",
    "name": "Schedule Appointment",
    "current": "schedule appointment is created and managed manually inside the app's own calendar view.",
    "enhanced": "Two-way MCP sync with Google Calendar/Outlook plus an AI layer that adjusts 'schedule appointment' automatically as real calendar conflicts or goal priorities change.",
    "integration": "MCP"
  },
  {
    "sr": "21",
    "name": "Book Personal Time",
    "current": "book personal time is created and managed manually inside the app's own calendar view.",
    "enhanced": "Two-way MCP sync with Google Calendar/Outlook plus an AI layer that adjusts 'book personal time' automatically as real calendar conflicts or goal priorities change.",
    "integration": "MCP"
  },
  {
    "sr": "22",
    "name": "Block Time Slot",
    "current": "block time slot is created and managed manually inside the app's own calendar view.",
    "enhanced": "Two-way MCP sync with Google Calendar/Outlook plus an AI layer that adjusts 'block time slot' automatically as real calendar conflicts or goal priorities change.",
    "integration": "MCP"
  },
  {
    "sr": "23",
    "name": "Set Availability Hours",
    "current": "set availability hours is created and managed manually inside the app's own calendar view.",
    "enhanced": "Two-way MCP sync with Google Calendar/Outlook plus an AI layer that adjusts 'set availability hours' automatically as real calendar conflicts or goal priorities change.",
    "integration": "MCP"
  },
  {
    "sr": "24",
    "name": "Share Availability",
    "current": "share availability is created and managed manually inside the app's own calendar view.",
    "enhanced": "Two-way MCP sync with Google Calendar/Outlook plus an AI layer that adjusts 'share availability' automatically as real calendar conflicts or goal priorities change.",
    "integration": "MCP"
  },
  {
    "sr": "25",
    "name": "Suggested Time Blocks",
    "current": "suggested time blocks is created and managed manually inside the app's own calendar view.",
    "enhanced": "Two-way MCP sync with Google Calendar/Outlook plus an AI layer that adjusts 'suggested time blocks' automatically as real calendar conflicts or goal priorities change.",
    "integration": "MCP"
  },
  {
    "sr": "26",
    "name": "Goal Allocation Suggestions",
    "current": "goal allocation suggestions is created and managed manually inside the app's own calendar view.",
    "enhanced": "Two-way MCP sync with Google Calendar/Outlook plus an AI layer that adjusts 'goal allocation suggestions' automatically as real calendar conflicts or goal priorities change.",
    "integration": "MCP"
  },
  {
    "sr": "27",
    "name": "Habit Time Slots",
    "current": "habit time slots is created and managed manually inside the app's own calendar view.",
    "enhanced": "Two-way MCP sync with Google Calendar/Outlook plus an AI layer that adjusts 'habit time slots' automatically as real calendar conflicts or goal priorities change.",
    "integration": "MCP"
  },
  {
    "sr": "28",
    "name": "AI planner OS",
    "current": "AI planner OS is created and managed manually inside the app's own calendar view.",
    "enhanced": "Two-way MCP sync with Google Calendar/Outlook plus an AI layer that adjusts 'AI planner OS' automatically as real calendar conflicts or goal priorities change.",
    "integration": "MCP"
  },
  {
    "sr": "29",
    "name": "To Do",
    "current": "to do is created and managed manually inside the app's own calendar view.",
    "enhanced": "Two-way MCP sync with Google Calendar/Outlook plus an AI layer that adjusts 'to do' automatically as real calendar conflicts or goal priorities change.",
    "integration": "MCP"
  },
  {
    "sr": "30",
    "name": "Due Date",
    "current": "due date is created and managed manually inside the app's own calendar view.",
    "enhanced": "Two-way MCP sync with Google Calendar/Outlook plus an AI layer that adjusts 'due date' automatically as real calendar conflicts or goal priorities change.",
    "integration": "MCP"
  },
  {
    "sr": "31",
    "name": "Priority",
    "current": "priority is created and managed manually inside the app's own calendar view.",
    "enhanced": "Two-way MCP sync with Google Calendar/Outlook plus an AI layer that adjusts 'priority' automatically as real calendar conflicts or goal priorities change.",
    "integration": "MCP"
  },
  {
    "sr": "32",
    "name": "Life Area Tag",
    "current": "life area tag is created and managed manually inside the app's own calendar view.",
    "enhanced": "Two-way MCP sync with Google Calendar/Outlook plus an AI layer that adjusts 'life area tag' automatically as real calendar conflicts or goal priorities change.",
    "integration": "MCP"
  },
  {
    "sr": "33",
    "name": "Eisenhower Matrix",
    "current": "eisenhower matrix is created and managed manually inside the app's own calendar view.",
    "enhanced": "Two-way MCP sync with Google Calendar/Outlook plus an AI layer that adjusts 'eisenhower matrix' automatically as real calendar conflicts or goal priorities change.",
    "integration": "MCP"
  },
  {
    "sr": "34",
    "name": "List View",
    "current": "list view is created and managed manually inside the app's own calendar view.",
    "enhanced": "Two-way MCP sync with Google Calendar/Outlook plus an AI layer that adjusts 'list view' automatically as real calendar conflicts or goal priorities change.",
    "integration": "MCP"
  },
  {
    "sr": "35",
    "name": "Kanban View",
    "current": "kanban view is created and managed manually inside the app's own calendar view.",
    "enhanced": "Two-way MCP sync with Google Calendar/Outlook plus an AI layer that adjusts 'kanban view' automatically as real calendar conflicts or goal priorities change.",
    "integration": "MCP"
  },
  {
    "sr": "36",
    "name": "Today",
    "current": "today is created and managed manually inside the app's own calendar view.",
    "enhanced": "Two-way MCP sync with Google Calendar/Outlook plus an AI layer that adjusts 'today' automatically as real calendar conflicts or goal priorities change.",
    "integration": "MCP"
  },
  {
    "sr": "37",
    "name": "Weekly",
    "current": "weekly is created and managed manually inside the app's own calendar view.",
    "enhanced": "Two-way MCP sync with Google Calendar/Outlook plus an AI layer that adjusts 'weekly' automatically as real calendar conflicts or goal priorities change.",
    "integration": "MCP"
  },
  {
    "sr": "38",
    "name": "Monthly",
    "current": "monthly is created and managed manually inside the app's own calendar view.",
    "enhanced": "Two-way MCP sync with Google Calendar/Outlook plus an AI layer that adjusts 'monthly' automatically as real calendar conflicts or goal priorities change.",
    "integration": "MCP"
  },
  {
    "sr": "39",
    "name": "Yearly",
    "current": "yearly is created and managed manually inside the app's own calendar view.",
    "enhanced": "Two-way MCP sync with Google Calendar/Outlook plus an AI layer that adjusts 'yearly' automatically as real calendar conflicts or goal priorities change.",
    "integration": "MCP"
  },
  {
    "sr": "40",
    "name": "Custom",
    "current": "custom is created and managed manually inside the app's own calendar view.",
    "enhanced": "Two-way MCP sync with Google Calendar/Outlook plus an AI layer that adjusts 'custom' automatically as real calendar conflicts or goal priorities change.",
    "integration": "MCP"
  },
  {
    "sr": "41",
    "name": "Suggested Due Date",
    "current": "suggested due date is created and managed manually inside the app's own calendar view.",
    "enhanced": "Two-way MCP sync with Google Calendar/Outlook plus an AI layer that adjusts 'suggested due date' automatically as real calendar conflicts or goal priorities change.",
    "integration": "MCP"
  },
  {
    "sr": "42",
    "name": "Suggested Priority",
    "current": "suggested priority is created and managed manually inside the app's own calendar view.",
    "enhanced": "Two-way MCP sync with Google Calendar/Outlook plus an AI layer that adjusts 'suggested priority' automatically as real calendar conflicts or goal priorities change.",
    "integration": "MCP"
  },
  {
    "sr": "43",
    "name": "To Do Analysis",
    "current": "to do analysis is created and managed manually inside the app's own calendar view.",
    "enhanced": "Two-way MCP sync with Google Calendar/Outlook plus an AI layer that adjusts 'to do analysis' automatically as real calendar conflicts or goal priorities change.",
    "integration": "MCP"
  },
  {
    "sr": "44",
    "name": "Recurring Tasks",
    "current": "recurring tasks is created and managed manually inside the app's own calendar view.",
    "enhanced": "Two-way MCP sync with Google Calendar/Outlook plus an AI layer that adjusts 'recurring tasks' automatically as real calendar conflicts or goal priorities change.",
    "integration": "MCP"
  },
  {
    "sr": "45",
    "name": "Goal Impact",
    "current": "goal impact is created and managed manually inside the app's own calendar view.",
    "enhanced": "Two-way MCP sync with Google Calendar/Outlook plus an AI layer that adjusts 'goal impact' automatically as real calendar conflicts or goal priorities change.",
    "integration": "MCP"
  },
  {
    "sr": "46",
    "name": "Task Mix",
    "current": "task mix is created and managed manually inside the app's own calendar view.",
    "enhanced": "Two-way MCP sync with Google Calendar/Outlook plus an AI layer that adjusts 'task mix' automatically as real calendar conflicts or goal priorities change.",
    "integration": "MCP"
  },
  {
    "sr": "47",
    "name": "Completion Trend",
    "current": "completion trend is created and managed manually inside the app's own calendar view.",
    "enhanced": "Two-way MCP sync with Google Calendar/Outlook plus an AI layer that adjusts 'completion trend' automatically as real calendar conflicts or goal priorities change.",
    "integration": "MCP"
  },
  {
    "sr": "48",
    "name": "Gratitude",
    "current": "gratitude is captured via manual typed text entry in the daily journal flow.",
    "enhanced": "Voice-to-text capture via the AI audio companion for 'gratitude', with AI sentiment/theme tagging applied automatically instead of the user self-scoring.",
    "integration": "AI"
  },
  {
    "sr": "49",
    "name": "Accomplishment",
    "current": "accomplishment is captured via manual typed text entry in the daily journal flow.",
    "enhanced": "Voice-to-text capture via the AI audio companion for 'accomplishment', with AI sentiment/theme tagging applied automatically instead of the user self-scoring.",
    "integration": "AI"
  },
  {
    "sr": "50",
    "name": "Suggested Completed Task",
    "current": "suggested completed task is captured via manual typed text entry in the daily journal flow.",
    "enhanced": "Voice-to-text capture via the AI audio companion for 'suggested completed task', with AI sentiment/theme tagging applied automatically instead of the user self-scoring.",
    "integration": "AI"
  },
  {
    "sr": "51",
    "name": "Todays Habits",
    "current": "todays habits is captured via manual typed text entry in the daily journal flow.",
    "enhanced": "Voice-to-text capture via the AI audio companion for 'todays habits', with AI sentiment/theme tagging applied automatically instead of the user self-scoring.",
    "integration": "AI"
  },
  {
    "sr": "52",
    "name": "Challenges",
    "current": "challenges is captured via manual typed text entry in the daily journal flow.",
    "enhanced": "Voice-to-text capture via the AI audio companion for 'challenges', with AI sentiment/theme tagging applied automatically instead of the user self-scoring.",
    "integration": "AI"
  },
  {
    "sr": "53",
    "name": "Mood",
    "current": "mood is captured via manual typed text entry in the daily journal flow.",
    "enhanced": "Voice-to-text capture via the AI audio companion for 'mood', with AI sentiment/theme tagging applied automatically instead of the user self-scoring.",
    "integration": "AI"
  },
  {
    "sr": "54",
    "name": "Energy",
    "current": "energy is captured via manual typed text entry in the daily journal flow.",
    "enhanced": "Voice-to-text capture via the AI audio companion for 'energy', with AI sentiment/theme tagging applied automatically instead of the user self-scoring.",
    "integration": "AI"
  },
  {
    "sr": "55",
    "name": "Affirmation",
    "current": "affirmation is captured via manual typed text entry in the daily journal flow.",
    "enhanced": "Voice-to-text capture via the AI audio companion for 'affirmation', with AI sentiment/theme tagging applied automatically instead of the user self-scoring.",
    "integration": "AI"
  },
  {
    "sr": "56",
    "name": "Tomorrows Headstart",
    "current": "tomorrows headstart is captured via manual typed text entry in the daily journal flow.",
    "enhanced": "Voice-to-text capture via the AI audio companion for 'tomorrows headstart', with AI sentiment/theme tagging applied automatically instead of the user self-scoring.",
    "integration": "AI"
  },
  {
    "sr": "57",
    "name": "Top To Dos",
    "current": "top to dos is captured via manual typed text entry in the daily journal flow.",
    "enhanced": "Voice-to-text capture via the AI audio companion for 'top to dos', with AI sentiment/theme tagging applied automatically instead of the user self-scoring.",
    "integration": "AI"
  },
  {
    "sr": "58",
    "name": "Priorities For Tomorrow",
    "current": "priorities for tomorrow is captured via manual typed text entry in the daily journal flow.",
    "enhanced": "Voice-to-text capture via the AI audio companion for 'priorities for tomorrow', with AI sentiment/theme tagging applied automatically instead of the user self-scoring.",
    "integration": "AI"
  },
  {
    "sr": "59",
    "name": "Daily Past Records",
    "current": "daily past records is captured via manual typed text entry in the daily journal flow.",
    "enhanced": "Voice-to-text capture via the AI audio companion for 'daily past records', with AI sentiment/theme tagging applied automatically instead of the user self-scoring.",
    "integration": "AI"
  },
  {
    "sr": "60",
    "name": "Write Letter To Future Self",
    "current": "write letter to future self is captured via manual typed text entry in the daily journal flow.",
    "enhanced": "Voice-to-text capture via the AI audio companion for 'write letter to future self', with AI sentiment/theme tagging applied automatically instead of the user self-scoring.",
    "integration": "AI"
  },
  {
    "sr": "61",
    "name": "Scheduled Letters",
    "current": "scheduled letters is captured via manual typed text entry in the daily journal flow.",
    "enhanced": "Voice-to-text capture via the AI audio companion for 'scheduled letters', with AI sentiment/theme tagging applied automatically instead of the user self-scoring.",
    "integration": "AI"
  },
  {
    "sr": "62",
    "name": "Delivered Letters",
    "current": "delivered letters is captured via manual typed text entry in the daily journal flow.",
    "enhanced": "Voice-to-text capture via the AI audio companion for 'delivered letters', with AI sentiment/theme tagging applied automatically instead of the user self-scoring.",
    "integration": "AI"
  },
  {
    "sr": "63",
    "name": "Mood & Energy Trends",
    "current": "mood & energy trends is captured via manual typed text entry in the daily journal flow.",
    "enhanced": "Voice-to-text capture via the AI audio companion for 'mood & energy trends', with AI sentiment/theme tagging applied automatically instead of the user self-scoring.",
    "integration": "AI"
  },
  {
    "sr": "64",
    "name": "Mood Distribution",
    "current": "mood distribution is captured via manual typed text entry in the daily journal flow.",
    "enhanced": "Voice-to-text capture via the AI audio companion for 'mood distribution', with AI sentiment/theme tagging applied automatically instead of the user self-scoring.",
    "integration": "AI"
  },
  {
    "sr": "65",
    "name": "Alignment Over Time",
    "current": "alignment over time is captured via manual typed text entry in the daily journal flow.",
    "enhanced": "Voice-to-text capture via the AI audio companion for 'alignment over time', with AI sentiment/theme tagging applied automatically instead of the user self-scoring.",
    "integration": "AI"
  },
  {
    "sr": "66",
    "name": "What'S Driving Your Energy",
    "current": "what's driving your energy is captured via manual typed text entry in the daily journal flow.",
    "enhanced": "Voice-to-text capture via the AI audio companion for 'what's driving your energy', with AI sentiment/theme tagging applied automatically instead of the user self-scoring.",
    "integration": "AI"
  },
  {
    "sr": "67",
    "name": "Most Gratitude Themes",
    "current": "most gratitude themes is captured via manual typed text entry in the daily journal flow.",
    "enhanced": "Voice-to-text capture via the AI audio companion for 'most gratitude themes', with AI sentiment/theme tagging applied automatically instead of the user self-scoring.",
    "integration": "AI"
  },
  {
    "sr": "68",
    "name": "Recurring Key Insights",
    "current": "recurring key insights is captured via manual typed text entry in the daily journal flow.",
    "enhanced": "Voice-to-text capture via the AI audio companion for 'recurring key insights', with AI sentiment/theme tagging applied automatically instead of the user self-scoring.",
    "integration": "AI"
  },
  {
    "sr": "69",
    "name": "Weekly Score Trend",
    "current": "weekly score trend is captured via manual typed text entry in the daily journal flow.",
    "enhanced": "Voice-to-text capture via the AI audio companion for 'weekly score trend', with AI sentiment/theme tagging applied automatically instead of the user self-scoring.",
    "integration": "AI"
  },
  {
    "sr": "70",
    "name": "Score Breakdown Trend",
    "current": "score breakdown trend is captured via manual typed text entry in the daily journal flow.",
    "enhanced": "Voice-to-text capture via the AI audio companion for 'score breakdown trend', with AI sentiment/theme tagging applied automatically instead of the user self-scoring.",
    "integration": "AI"
  },
  {
    "sr": "71",
    "name": "Habits Consistency",
    "current": "habits consistency is captured via manual typed text entry in the daily journal flow.",
    "enhanced": "Voice-to-text capture via the AI audio companion for 'habits consistency', with AI sentiment/theme tagging applied automatically instead of the user self-scoring.",
    "integration": "AI"
  },
  {
    "sr": "72",
    "name": "Recurring Win Themes",
    "current": "recurring win themes is captured via manual typed text entry in the daily journal flow.",
    "enhanced": "Voice-to-text capture via the AI audio companion for 'recurring win themes', with AI sentiment/theme tagging applied automatically instead of the user self-scoring.",
    "integration": "AI"
  },
  {
    "sr": "73",
    "name": "Add Custom Course",
    "current": "add custom course is populated from a static, internally curated course/content list.",
    "enhanced": "MCP integration with external course providers (LinkedIn Learning, Coursera) to pull live, personalised 'add custom course' recommendations ranked by an AI model against the user's DISC profile and goals.",
    "integration": "MCP"
  },
  {
    "sr": "74",
    "name": "Career Milestone",
    "current": "career milestone is populated from a static, internally curated course/content list.",
    "enhanced": "MCP integration with external course providers (LinkedIn Learning, Coursera) to pull live, personalised 'career milestone' recommendations ranked by an AI model against the user's DISC profile and goals.",
    "integration": "MCP"
  },
  {
    "sr": "75",
    "name": "Ai Insights",
    "current": "ai insights is populated from a static, internally curated course/content list.",
    "enhanced": "MCP integration with external course providers (LinkedIn Learning, Coursera) to pull live, personalised 'ai insights' recommendations ranked by an AI model against the user's DISC profile and goals.",
    "integration": "MCP"
  },
  {
    "sr": "76",
    "name": "This Weeks Learning Block",
    "current": "this weeks learning block is populated from a static, internally curated course/content list.",
    "enhanced": "MCP integration with external course providers (LinkedIn Learning, Coursera) to pull live, personalised 'this weeks learning block' recommendations ranked by an AI model against the user's DISC profile and goals.",
    "integration": "MCP"
  },
  {
    "sr": "77",
    "name": "Courses",
    "current": "courses is populated from a static, internally curated course/content list.",
    "enhanced": "MCP integration with external course providers (LinkedIn Learning, Coursera) to pull live, personalised 'courses' recommendations ranked by an AI model against the user's DISC profile and goals.",
    "integration": "MCP"
  },
  {
    "sr": "78",
    "name": "Disc Improvements",
    "current": "disc improvements is populated from a static, internally curated course/content list.",
    "enhanced": "MCP integration with external course providers (LinkedIn Learning, Coursera) to pull live, personalised 'disc improvements' recommendations ranked by an AI model against the user's DISC profile and goals.",
    "integration": "MCP"
  },
  {
    "sr": "79",
    "name": "History",
    "current": "History is populated from a static, internally curated course/content list.",
    "enhanced": "MCP integration with external course providers (LinkedIn Learning, Coursera) to pull live, personalised 'History' recommendations ranked by an AI model against the user's DISC profile and goals.",
    "integration": "MCP"
  },
  {
    "sr": "80",
    "name": "Add Bank Account",
    "current": "add bank account relies on data pulled once via the Account Aggregator consent flow and refreshed on a fixed schedule.",
    "enhanced": "Real-time MCP/webhook-based refresh for 'add bank account' plus an AI anomaly-detection layer that flags unusual transactions or drift from goals as they happen, not on the next scheduled sync.",
    "integration": "AI + MCP"
  },
  {
    "sr": "81",
    "name": "Connected Sources",
    "current": "connected sources relies on data pulled once via the Account Aggregator consent flow and refreshed on a fixed schedule.",
    "enhanced": "Real-time MCP/webhook-based refresh for 'connected sources' plus an AI anomaly-detection layer that flags unusual transactions or drift from goals as they happen, not on the next scheduled sync.",
    "integration": "AI + MCP"
  },
  {
    "sr": "82",
    "name": "Account Details",
    "current": "account details relies on data pulled once via the Account Aggregator consent flow and refreshed on a fixed schedule.",
    "enhanced": "Real-time MCP/webhook-based refresh for 'account details' plus an AI anomaly-detection layer that flags unusual transactions or drift from goals as they happen, not on the next scheduled sync.",
    "integration": "AI + MCP"
  },
  {
    "sr": "83",
    "name": "Add Data Source",
    "current": "add data source relies on data pulled once via the Account Aggregator consent flow and refreshed on a fixed schedule.",
    "enhanced": "Real-time MCP/webhook-based refresh for 'add data source' plus an AI anomaly-detection layer that flags unusual transactions or drift from goals as they happen, not on the next scheduled sync.",
    "integration": "AI + MCP"
  },
  {
    "sr": "84",
    "name": "Review Consent",
    "current": "review consent relies on data pulled once via the Account Aggregator consent flow and refreshed on a fixed schedule.",
    "enhanced": "Real-time MCP/webhook-based refresh for 'review consent' plus an AI anomaly-detection layer that flags unusual transactions or drift from goals as they happen, not on the next scheduled sync.",
    "integration": "AI + MCP"
  },
  {
    "sr": "85",
    "name": "verify OTP",
    "current": "verify OTP relies on data pulled once via the Account Aggregator consent flow and refreshed on a fixed schedule.",
    "enhanced": "Real-time MCP/webhook-based refresh for 'verify OTP' plus an AI anomaly-detection layer that flags unusual transactions or drift from goals as they happen, not on the next scheduled sync.",
    "integration": "AI + MCP"
  },
  {
    "sr": "86",
    "name": "Setup Consent",
    "current": "setup consent relies on data pulled once via the Account Aggregator consent flow and refreshed on a fixed schedule.",
    "enhanced": "Real-time MCP/webhook-based refresh for 'setup consent' plus an AI anomaly-detection layer that flags unusual transactions or drift from goals as they happen, not on the next scheduled sync.",
    "integration": "AI + MCP"
  },
  {
    "sr": "87",
    "name": "Fetch Statements",
    "current": "fetch statements relies on data pulled once via the Account Aggregator consent flow and refreshed on a fixed schedule.",
    "enhanced": "Real-time MCP/webhook-based refresh for 'fetch statements' plus an AI anomaly-detection layer that flags unusual transactions or drift from goals as they happen, not on the next scheduled sync.",
    "integration": "AI + MCP"
  },
  {
    "sr": "88",
    "name": "Statement List",
    "current": "statement list relies on data pulled once via the Account Aggregator consent flow and refreshed on a fixed schedule.",
    "enhanced": "Real-time MCP/webhook-based refresh for 'statement list' plus an AI anomaly-detection layer that flags unusual transactions or drift from goals as they happen, not on the next scheduled sync.",
    "integration": "AI + MCP"
  },
  {
    "sr": "89",
    "name": "Transactions",
    "current": "transactions relies on data pulled once via the Account Aggregator consent flow and refreshed on a fixed schedule.",
    "enhanced": "Real-time MCP/webhook-based refresh for 'transactions' plus an AI anomaly-detection layer that flags unusual transactions or drift from goals as they happen, not on the next scheduled sync.",
    "integration": "AI + MCP"
  },
  {
    "sr": "90",
    "name": "Income",
    "current": "income relies on data pulled once via the Account Aggregator consent flow and refreshed on a fixed schedule.",
    "enhanced": "Real-time MCP/webhook-based refresh for 'income' plus an AI anomaly-detection layer that flags unusual transactions or drift from goals as they happen, not on the next scheduled sync.",
    "integration": "AI + MCP"
  },
  {
    "sr": "91",
    "name": "Expenses",
    "current": "expenses relies on data pulled once via the Account Aggregator consent flow and refreshed on a fixed schedule.",
    "enhanced": "Real-time MCP/webhook-based refresh for 'expenses' plus an AI anomaly-detection layer that flags unusual transactions or drift from goals as they happen, not on the next scheduled sync.",
    "integration": "AI + MCP"
  },
  {
    "sr": "92",
    "name": "Savings",
    "current": "savings relies on data pulled once via the Account Aggregator consent flow and refreshed on a fixed schedule.",
    "enhanced": "Real-time MCP/webhook-based refresh for 'savings' plus an AI anomaly-detection layer that flags unusual transactions or drift from goals as they happen, not on the next scheduled sync.",
    "integration": "AI + MCP"
  },
  {
    "sr": "93",
    "name": "Investments",
    "current": "investments relies on data pulled once via the Account Aggregator consent flow and refreshed on a fixed schedule.",
    "enhanced": "Real-time MCP/webhook-based refresh for 'investments' plus an AI anomaly-detection layer that flags unusual transactions or drift from goals as they happen, not on the next scheduled sync.",
    "integration": "AI + MCP"
  },
  {
    "sr": "94",
    "name": "Savings Goals Tracking",
    "current": "savings goals tracking relies on data pulled once via the Account Aggregator consent flow and refreshed on a fixed schedule.",
    "enhanced": "Real-time MCP/webhook-based refresh for 'savings goals tracking' plus an AI anomaly-detection layer that flags unusual transactions or drift from goals as they happen, not on the next scheduled sync.",
    "integration": "AI + MCP"
  },
  {
    "sr": "95",
    "name": "Add To Do/Goal/Habit",
    "current": "add to do/goal/habit relies on data pulled once via the Account Aggregator consent flow and refreshed on a fixed schedule.",
    "enhanced": "Real-time MCP/webhook-based refresh for 'add to do/goal/habit' plus an AI anomaly-detection layer that flags unusual transactions or drift from goals as they happen, not on the next scheduled sync.",
    "integration": "AI + MCP"
  },
  {
    "sr": "96",
    "name": "Monthly Chart",
    "current": "monthly chart relies on data pulled once via the Account Aggregator consent flow and refreshed on a fixed schedule.",
    "enhanced": "Real-time MCP/webhook-based refresh for 'monthly chart' plus an AI anomaly-detection layer that flags unusual transactions or drift from goals as they happen, not on the next scheduled sync.",
    "integration": "AI + MCP"
  },
  {
    "sr": "97",
    "name": "Annual Chart",
    "current": "annual chart relies on data pulled once via the Account Aggregator consent flow and refreshed on a fixed schedule.",
    "enhanced": "Real-time MCP/webhook-based refresh for 'annual chart' plus an AI anomaly-detection layer that flags unusual transactions or drift from goals as they happen, not on the next scheduled sync.",
    "integration": "AI + MCP"
  },
  {
    "sr": "98",
    "name": "income - EMIs - variable spends",
    "current": "income - EMIs - variable spends relies on data pulled once via the Account Aggregator consent flow and refreshed on a fixed schedule.",
    "enhanced": "Real-time MCP/webhook-based refresh for 'income - EMIs - variable spends' plus an AI anomaly-detection layer that flags unusual transactions or drift from goals as they happen, not on the next scheduled sync.",
    "integration": "AI + MCP"
  },
  {
    "sr": "99",
    "name": "AI insight",
    "current": "AI insight relies on data pulled once via the Account Aggregator consent flow and refreshed on a fixed schedule.",
    "enhanced": "Real-time MCP/webhook-based refresh for 'AI insight' plus an AI anomaly-detection layer that flags unusual transactions or drift from goals as they happen, not on the next scheduled sync.",
    "integration": "AI + MCP"
  },
  {
    "sr": "100",
    "name": "Portfolio Breakdown",
    "current": "portfolio breakdown relies on data pulled once via the Account Aggregator consent flow and refreshed on a fixed schedule.",
    "enhanced": "Real-time MCP/webhook-based refresh for 'portfolio breakdown' plus an AI anomaly-detection layer that flags unusual transactions or drift from goals as they happen, not on the next scheduled sync.",
    "integration": "AI + MCP"
  },
  {
    "sr": "101",
    "name": "AI insight",
    "current": "AI insight relies on data pulled once via the Account Aggregator consent flow and refreshed on a fixed schedule.",
    "enhanced": "Real-time MCP/webhook-based refresh for 'AI insight' plus an AI anomaly-detection layer that flags unusual transactions or drift from goals as they happen, not on the next scheduled sync.",
    "integration": "AI + MCP"
  },
  {
    "sr": "102",
    "name": "fixed EMIs",
    "current": "fixed EMIs relies on data pulled once via the Account Aggregator consent flow and refreshed on a fixed schedule.",
    "enhanced": "Real-time MCP/webhook-based refresh for 'fixed EMIs' plus an AI anomaly-detection layer that flags unusual transactions or drift from goals as they happen, not on the next scheduled sync.",
    "integration": "AI + MCP"
  },
  {
    "sr": "103",
    "name": "Variable Monthly Spends",
    "current": "variable monthly spends relies on data pulled once via the Account Aggregator consent flow and refreshed on a fixed schedule.",
    "enhanced": "Real-time MCP/webhook-based refresh for 'variable monthly spends' plus an AI anomaly-detection layer that flags unusual transactions or drift from goals as they happen, not on the next scheduled sync.",
    "integration": "AI + MCP"
  },
  {
    "sr": "104",
    "name": "AI insight",
    "current": "AI insight relies on data pulled once via the Account Aggregator consent flow and refreshed on a fixed schedule.",
    "enhanced": "Real-time MCP/webhook-based refresh for 'AI insight' plus an AI anomaly-detection layer that flags unusual transactions or drift from goals as they happen, not on the next scheduled sync.",
    "integration": "AI + MCP"
  },
  {
    "sr": "105",
    "name": "Physical",
    "current": "physical depends on the user manually logging data (food, water, workouts, mood) into the app.",
    "enhanced": "Automatic capture for 'physical' via wearable/MCP sensor sync and, where relevant, AI computer-vision food/activity recognition, cutting manual entry to a quick confirmation.",
    "integration": "AI + MCP"
  },
  {
    "sr": "106",
    "name": "Mental",
    "current": "mental depends on the user manually logging data (food, water, workouts, mood) into the app.",
    "enhanced": "Automatic capture for 'mental' via wearable/MCP sensor sync and, where relevant, AI computer-vision food/activity recognition, cutting manual entry to a quick confirmation.",
    "integration": "AI + MCP"
  },
  {
    "sr": "107",
    "name": "Nutritional",
    "current": "nutritional depends on the user manually logging data (food, water, workouts, mood) into the app.",
    "enhanced": "Automatic capture for 'nutritional' via wearable/MCP sensor sync and, where relevant, AI computer-vision food/activity recognition, cutting manual entry to a quick confirmation.",
    "integration": "AI + MCP"
  },
  {
    "sr": "108",
    "name": "Exercise",
    "current": "exercise depends on the user manually logging data (food, water, workouts, mood) into the app.",
    "enhanced": "Automatic capture for 'exercise' via wearable/MCP sensor sync and, where relevant, AI computer-vision food/activity recognition, cutting manual entry to a quick confirmation.",
    "integration": "AI + MCP"
  },
  {
    "sr": "109",
    "name": "Meditation",
    "current": "meditation depends on the user manually logging data (food, water, workouts, mood) into the app.",
    "enhanced": "Automatic capture for 'meditation' via wearable/MCP sensor sync and, where relevant, AI computer-vision food/activity recognition, cutting manual entry to a quick confirmation.",
    "integration": "AI + MCP"
  },
  {
    "sr": "110",
    "name": "Journaling",
    "current": "journaling depends on the user manually logging data (food, water, workouts, mood) into the app.",
    "enhanced": "Automatic capture for 'journaling' via wearable/MCP sensor sync and, where relevant, AI computer-vision food/activity recognition, cutting manual entry to a quick confirmation.",
    "integration": "AI + MCP"
  },
  {
    "sr": "111",
    "name": "Water",
    "current": "water depends on the user manually logging data (food, water, workouts, mood) into the app.",
    "enhanced": "Automatic capture for 'water' via wearable/MCP sensor sync and, where relevant, AI computer-vision food/activity recognition, cutting manual entry to a quick confirmation.",
    "integration": "AI + MCP"
  },
  {
    "sr": "112",
    "name": "Weight",
    "current": "weight depends on the user manually logging data (food, water, workouts, mood) into the app.",
    "enhanced": "Automatic capture for 'weight' via wearable/MCP sensor sync and, where relevant, AI computer-vision food/activity recognition, cutting manual entry to a quick confirmation.",
    "integration": "AI + MCP"
  },
  {
    "sr": "113",
    "name": "Lower Anxiety",
    "current": "lower anxiety depends on the user manually logging data (food, water, workouts, mood) into the app.",
    "enhanced": "Automatic capture for 'lower anxiety' via wearable/MCP sensor sync and, where relevant, AI computer-vision food/activity recognition, cutting manual entry to a quick confirmation.",
    "integration": "AI + MCP"
  },
  {
    "sr": "114",
    "name": "Nutritional",
    "current": "nutritional depends on the user manually logging data (food, water, workouts, mood) into the app.",
    "enhanced": "Automatic capture for 'nutritional' via wearable/MCP sensor sync and, where relevant, AI computer-vision food/activity recognition, cutting manual entry to a quick confirmation.",
    "integration": "AI + MCP"
  },
  {
    "sr": "115",
    "name": "Add To Do/Habit/Goal",
    "current": "add to do/habit/goal depends on the user manually logging data (food, water, workouts, mood) into the app.",
    "enhanced": "Automatic capture for 'add to do/habit/goal' via wearable/MCP sensor sync and, where relevant, AI computer-vision food/activity recognition, cutting manual entry to a quick confirmation.",
    "integration": "AI + MCP"
  },
  {
    "sr": "116",
    "name": "Protein & Calories",
    "current": "protein & calories depends on the user manually logging data (food, water, workouts, mood) into the app.",
    "enhanced": "Automatic capture for 'protein & calories' via wearable/MCP sensor sync and, where relevant, AI computer-vision food/activity recognition, cutting manual entry to a quick confirmation.",
    "integration": "AI + MCP"
  },
  {
    "sr": "117",
    "name": "Hydration",
    "current": "hydration depends on the user manually logging data (food, water, workouts, mood) into the app.",
    "enhanced": "Automatic capture for 'hydration' via wearable/MCP sensor sync and, where relevant, AI computer-vision food/activity recognition, cutting manual entry to a quick confirmation.",
    "integration": "AI + MCP"
  },
  {
    "sr": "118",
    "name": "Nutrition Analysis",
    "current": "nutrition analysis depends on the user manually logging data (food, water, workouts, mood) into the app.",
    "enhanced": "Automatic capture for 'nutrition analysis' via wearable/MCP sensor sync and, where relevant, AI computer-vision food/activity recognition, cutting manual entry to a quick confirmation.",
    "integration": "AI + MCP"
  },
  {
    "sr": "119",
    "name": "Today'S Energy Chart",
    "current": "today's energy chart depends on the user manually logging data (food, water, workouts, mood) into the app.",
    "enhanced": "Automatic capture for 'today's energy chart' via wearable/MCP sensor sync and, where relevant, AI computer-vision food/activity recognition, cutting manual entry to a quick confirmation.",
    "integration": "AI + MCP"
  },
  {
    "sr": "120",
    "name": "Health Improvement Chart",
    "current": "health improvement chart depends on the user manually logging data (food, water, workouts, mood) into the app.",
    "enhanced": "Automatic capture for 'health improvement chart' via wearable/MCP sensor sync and, where relevant, AI computer-vision food/activity recognition, cutting manual entry to a quick confirmation.",
    "integration": "AI + MCP"
  },
  {
    "sr": "121",
    "name": "Spike Foods",
    "current": "spike foods depends on the user manually logging data (food, water, workouts, mood) into the app.",
    "enhanced": "Automatic capture for 'spike foods' via wearable/MCP sensor sync and, where relevant, AI computer-vision food/activity recognition, cutting manual entry to a quick confirmation.",
    "integration": "AI + MCP"
  },
  {
    "sr": "122",
    "name": "Detox Foods",
    "current": "detox foods depends on the user manually logging data (food, water, workouts, mood) into the app.",
    "enhanced": "Automatic capture for 'detox foods' via wearable/MCP sensor sync and, where relevant, AI computer-vision food/activity recognition, cutting manual entry to a quick confirmation.",
    "integration": "AI + MCP"
  },
  {
    "sr": "123",
    "name": "Recommended Diet",
    "current": "recommended diet depends on the user manually logging data (food, water, workouts, mood) into the app.",
    "enhanced": "Automatic capture for 'recommended diet' via wearable/MCP sensor sync and, where relevant, AI computer-vision food/activity recognition, cutting manual entry to a quick confirmation.",
    "integration": "AI + MCP"
  },
  {
    "sr": "124",
    "name": "Workouts Suitable For You",
    "current": "workouts suitable for you depends on the user manually logging data (food, water, workouts, mood) into the app.",
    "enhanced": "Automatic capture for 'workouts suitable for you' via wearable/MCP sensor sync and, where relevant, AI computer-vision food/activity recognition, cutting manual entry to a quick confirmation.",
    "integration": "AI + MCP"
  },
  {
    "sr": "125",
    "name": "Mood & Stress & Energy Chart",
    "current": "mood & stress & energy chart depends on the user manually logging data (food, water, workouts, mood) into the app.",
    "enhanced": "Automatic capture for 'mood & stress & energy chart' via wearable/MCP sensor sync and, where relevant, AI computer-vision food/activity recognition, cutting manual entry to a quick confirmation.",
    "integration": "AI + MCP"
  },
  {
    "sr": "126",
    "name": "Active Path",
    "current": "active path depends on the user manually logging data (food, water, workouts, mood) into the app.",
    "enhanced": "Automatic capture for 'active path' via wearable/MCP sensor sync and, where relevant, AI computer-vision food/activity recognition, cutting manual entry to a quick confirmation.",
    "integration": "AI + MCP"
  },
  {
    "sr": "127",
    "name": "Quick Exercises",
    "current": "quick exercises depends on the user manually logging data (food, water, workouts, mood) into the app.",
    "enhanced": "Automatic capture for 'quick exercises' via wearable/MCP sensor sync and, where relevant, AI computer-vision food/activity recognition, cutting manual entry to a quick confirmation.",
    "integration": "AI + MCP"
  },
  {
    "sr": "128",
    "name": "Mood Uplifters",
    "current": "mood uplifters depends on the user manually logging data (food, water, workouts, mood) into the app.",
    "enhanced": "Automatic capture for 'mood uplifters' via wearable/MCP sensor sync and, where relevant, AI computer-vision food/activity recognition, cutting manual entry to a quick confirmation.",
    "integration": "AI + MCP"
  },
  {
    "sr": "129",
    "name": "Water Amount",
    "current": "water amount depends on the user manually logging data (food, water, workouts, mood) into the app.",
    "enhanced": "Automatic capture for 'water amount' via wearable/MCP sensor sync and, where relevant, AI computer-vision food/activity recognition, cutting manual entry to a quick confirmation.",
    "integration": "AI + MCP"
  },
  {
    "sr": "130",
    "name": "Bottle Size",
    "current": "bottle size depends on the user manually logging data (food, water, workouts, mood) into the app.",
    "enhanced": "Automatic capture for 'bottle size' via wearable/MCP sensor sync and, where relevant, AI computer-vision food/activity recognition, cutting manual entry to a quick confirmation.",
    "integration": "AI + MCP"
  },
  {
    "sr": "131",
    "name": "Daily Capture",
    "current": "daily capture depends on the user manually logging data (food, water, workouts, mood) into the app.",
    "enhanced": "Automatic capture for 'daily capture' via wearable/MCP sensor sync and, where relevant, AI computer-vision food/activity recognition, cutting manual entry to a quick confirmation.",
    "integration": "AI + MCP"
  },
  {
    "sr": "132",
    "name": "Food Entry Log Popup",
    "current": "food entry log popup depends on the user manually logging data (food, water, workouts, mood) into the app.",
    "enhanced": "Automatic capture for 'food entry log popup' via wearable/MCP sensor sync and, where relevant, AI computer-vision food/activity recognition, cutting manual entry to a quick confirmation.",
    "integration": "AI + MCP"
  },
  {
    "sr": "133",
    "name": "Energy Score",
    "current": "energy score depends on the user manually logging data (food, water, workouts, mood) into the app.",
    "enhanced": "Automatic capture for 'energy score' via wearable/MCP sensor sync and, where relevant, AI computer-vision food/activity recognition, cutting manual entry to a quick confirmation.",
    "integration": "AI + MCP"
  },
  {
    "sr": "134",
    "name": "Alignment Score",
    "current": "alignment score depends on the user manually logging data (food, water, workouts, mood) into the app.",
    "enhanced": "Automatic capture for 'alignment score' via wearable/MCP sensor sync and, where relevant, AI computer-vision food/activity recognition, cutting manual entry to a quick confirmation.",
    "integration": "AI + MCP"
  },
  {
    "sr": "135",
    "name": "Past Present Future",
    "current": "past present future depends on the user manually logging data (food, water, workouts, mood) into the app.",
    "enhanced": "Automatic capture for 'past present future' via wearable/MCP sensor sync and, where relevant, AI computer-vision food/activity recognition, cutting manual entry to a quick confirmation.",
    "integration": "AI + MCP"
  },
  {
    "sr": "136",
    "name": "Recipes",
    "current": "recipes depends on the user manually logging data (food, water, workouts, mood) into the app.",
    "enhanced": "Automatic capture for 'recipes' via wearable/MCP sensor sync and, where relevant, AI computer-vision food/activity recognition, cutting manual entry to a quick confirmation.",
    "integration": "AI + MCP"
  },
  {
    "sr": "137",
    "name": "Workouts",
    "current": "workouts depends on the user manually logging data (food, water, workouts, mood) into the app.",
    "enhanced": "Automatic capture for 'workouts' via wearable/MCP sensor sync and, where relevant, AI computer-vision food/activity recognition, cutting manual entry to a quick confirmation.",
    "integration": "AI + MCP"
  },
  {
    "sr": "138",
    "name": "Stress Relief",
    "current": "stress relief depends on the user manually logging data (food, water, workouts, mood) into the app.",
    "enhanced": "Automatic capture for 'stress relief' via wearable/MCP sensor sync and, where relevant, AI computer-vision food/activity recognition, cutting manual entry to a quick confirmation.",
    "integration": "AI + MCP"
  },
  {
    "sr": "139",
    "name": "Goal Progress",
    "current": "Goal Progress is generated from data the user manually enters or a LinkedIn PDF they upload once.",
    "enhanced": "AI document parsing auto-extracts and continuously updates 'Goal Progress' from a connected LinkedIn/professional profile via MCP, refreshing automatically instead of requiring a re-upload.",
    "integration": "AI + MCP"
  },
  {
    "sr": "140",
    "name": "Skill Progress",
    "current": "Skill Progress is generated from data the user manually enters or a LinkedIn PDF they upload once.",
    "enhanced": "AI document parsing auto-extracts and continuously updates 'Skill Progress' from a connected LinkedIn/professional profile via MCP, refreshing automatically instead of requiring a re-upload.",
    "integration": "AI + MCP"
  },
  {
    "sr": "141",
    "name": "Learning Progress",
    "current": "Learning Progress is generated from data the user manually enters or a LinkedIn PDF they upload once.",
    "enhanced": "AI document parsing auto-extracts and continuously updates 'Learning Progress' from a connected LinkedIn/professional profile via MCP, refreshing automatically instead of requiring a re-upload.",
    "integration": "AI + MCP"
  },
  {
    "sr": "142",
    "name": "Stages Timeline",
    "current": "stages timeline is generated from data the user manually enters or a LinkedIn PDF they upload once.",
    "enhanced": "AI document parsing auto-extracts and continuously updates 'stages timeline' from a connected LinkedIn/professional profile via MCP, refreshing automatically instead of requiring a re-upload.",
    "integration": "AI + MCP"
  },
  {
    "sr": "143",
    "name": "Impact Score",
    "current": "impact score is generated from data the user manually enters or a LinkedIn PDF they upload once.",
    "enhanced": "AI document parsing auto-extracts and continuously updates 'impact score' from a connected LinkedIn/professional profile via MCP, refreshing automatically instead of requiring a re-upload.",
    "integration": "AI + MCP"
  },
  {
    "sr": "144",
    "name": "Strengths",
    "current": "strengths is generated from data the user manually enters or a LinkedIn PDF they upload once.",
    "enhanced": "AI document parsing auto-extracts and continuously updates 'strengths' from a connected LinkedIn/professional profile via MCP, refreshing automatically instead of requiring a re-upload.",
    "integration": "AI + MCP"
  },
  {
    "sr": "145",
    "name": "Weaknesses",
    "current": "weaknesses is generated from data the user manually enters or a LinkedIn PDF they upload once.",
    "enhanced": "AI document parsing auto-extracts and continuously updates 'weaknesses' from a connected LinkedIn/professional profile via MCP, refreshing automatically instead of requiring a re-upload.",
    "integration": "AI + MCP"
  },
  {
    "sr": "146",
    "name": "Opportunities",
    "current": "opportunities is generated from data the user manually enters or a LinkedIn PDF they upload once.",
    "enhanced": "AI document parsing auto-extracts and continuously updates 'opportunities' from a connected LinkedIn/professional profile via MCP, refreshing automatically instead of requiring a re-upload.",
    "integration": "AI + MCP"
  },
  {
    "sr": "147",
    "name": "Threats",
    "current": "threats is generated from data the user manually enters or a LinkedIn PDF they upload once.",
    "enhanced": "AI document parsing auto-extracts and continuously updates 'threats' from a connected LinkedIn/professional profile via MCP, refreshing automatically instead of requiring a re-upload.",
    "integration": "AI + MCP"
  },
  {
    "sr": "148",
    "name": "Course 1",
    "current": "course 1 is generated from data the user manually enters or a LinkedIn PDF they upload once.",
    "enhanced": "AI document parsing auto-extracts and continuously updates 'course 1' from a connected LinkedIn/professional profile via MCP, refreshing automatically instead of requiring a re-upload.",
    "integration": "AI + MCP"
  },
  {
    "sr": "149",
    "name": "Course 2",
    "current": "course 2 is generated from data the user manually enters or a LinkedIn PDF they upload once.",
    "enhanced": "AI document parsing auto-extracts and continuously updates 'course 2' from a connected LinkedIn/professional profile via MCP, refreshing automatically instead of requiring a re-upload.",
    "integration": "AI + MCP"
  },
  {
    "sr": "150",
    "name": "Course 3",
    "current": "course 3 is generated from data the user manually enters or a LinkedIn PDF they upload once.",
    "enhanced": "AI document parsing auto-extracts and continuously updates 'course 3' from a connected LinkedIn/professional profile via MCP, refreshing automatically instead of requiring a re-upload.",
    "integration": "AI + MCP"
  },
  {
    "sr": "151",
    "name": "LinkedIn pdf",
    "current": "LinkedIn pdf is generated from data the user manually enters or a LinkedIn PDF they upload once.",
    "enhanced": "AI document parsing auto-extracts and continuously updates 'LinkedIn pdf' from a connected LinkedIn/professional profile via MCP, refreshing automatically instead of requiring a re-upload.",
    "integration": "AI + MCP"
  },
  {
    "sr": "152",
    "name": "Add Entry",
    "current": "add entry is generated from data the user manually enters or a LinkedIn PDF they upload once.",
    "enhanced": "AI document parsing auto-extracts and continuously updates 'add entry' from a connected LinkedIn/professional profile via MCP, refreshing automatically instead of requiring a re-upload.",
    "integration": "AI + MCP"
  },
  {
    "sr": "153",
    "name": "Vision",
    "current": "Vision is captured through static text-entry fields during onboarding.",
    "enhanced": "A conversational AI-guided onboarding flow (voice-capable via the AI audio companion) elicits 'Vision' through a natural dialogue, then structures it automatically instead of relying on the user to write it unprompted.",
    "integration": "AI"
  },
  {
    "sr": "154",
    "name": "Mission",
    "current": "Mission is captured through static text-entry fields during onboarding.",
    "enhanced": "A conversational AI-guided onboarding flow (voice-capable via the AI audio companion) elicits 'Mission' through a natural dialogue, then structures it automatically instead of relying on the user to write it unprompted.",
    "integration": "AI"
  },
  {
    "sr": "155",
    "name": "Legacy",
    "current": "Legacy is captured through static text-entry fields during onboarding.",
    "enhanced": "A conversational AI-guided onboarding flow (voice-capable via the AI audio companion) elicits 'Legacy' through a natural dialogue, then structures it automatically instead of relying on the user to write it unprompted.",
    "integration": "AI"
  },
  {
    "sr": "156",
    "name": "Vision Board",
    "current": "vision board is captured through static text-entry fields during onboarding.",
    "enhanced": "A conversational AI-guided onboarding flow (voice-capable via the AI audio companion) elicits 'vision board' through a natural dialogue, then structures it automatically instead of relying on the user to write it unprompted.",
    "integration": "AI"
  },
  {
    "sr": "157",
    "name": "Have",
    "current": "have is captured through static text-entry fields during onboarding.",
    "enhanced": "A conversational AI-guided onboarding flow (voice-capable via the AI audio companion) elicits 'have' through a natural dialogue, then structures it automatically instead of relying on the user to write it unprompted.",
    "integration": "AI"
  },
  {
    "sr": "158",
    "name": "Do Be",
    "current": "do be is captured through static text-entry fields during onboarding.",
    "enhanced": "A conversational AI-guided onboarding flow (voice-capable via the AI audio companion) elicits 'do be' through a natural dialogue, then structures it automatically instead of relying on the user to write it unprompted.",
    "integration": "AI"
  },
  {
    "sr": "159",
    "name": "My Goals Linked",
    "current": "my goals linked is captured through static text-entry fields during onboarding.",
    "enhanced": "A conversational AI-guided onboarding flow (voice-capable via the AI audio companion) elicits 'my goals linked' through a natural dialogue, then structures it automatically instead of relying on the user to write it unprompted.",
    "integration": "AI"
  },
  {
    "sr": "160",
    "name": "Dreams and bucketlist",
    "current": "Dreams and bucketlist is captured through static text-entry fields during onboarding.",
    "enhanced": "A conversational AI-guided onboarding flow (voice-capable via the AI audio companion) elicits 'Dreams and bucketlist' through a natural dialogue, then structures it automatically instead of relying on the user to write it unprompted.",
    "integration": "AI"
  },
  {
    "sr": "161",
    "name": "Beliefs",
    "current": "Beliefs is captured through static text-entry fields during onboarding.",
    "enhanced": "A conversational AI-guided onboarding flow (voice-capable via the AI audio companion) elicits 'Beliefs' through a natural dialogue, then structures it automatically instead of relying on the user to write it unprompted.",
    "integration": "AI"
  },
  {
    "sr": "162",
    "name": "Limiting beliefs",
    "current": "Limiting beliefs is captured through static text-entry fields during onboarding.",
    "enhanced": "A conversational AI-guided onboarding flow (voice-capable via the AI audio companion) elicits 'Limiting beliefs' through a natural dialogue, then structures it automatically instead of relying on the user to write it unprompted.",
    "integration": "AI"
  },
  {
    "sr": "163",
    "name": "Core Values",
    "current": "core values is captured through static text-entry fields during onboarding.",
    "enhanced": "A conversational AI-guided onboarding flow (voice-capable via the AI audio companion) elicits 'core values' through a natural dialogue, then structures it automatically instead of relying on the user to write it unprompted.",
    "integration": "AI"
  },
  {
    "sr": "164",
    "name": "Affirmations",
    "current": "Affirmations is captured through static text-entry fields during onboarding.",
    "enhanced": "A conversational AI-guided onboarding flow (voice-capable via the AI audio companion) elicits 'Affirmations' through a natural dialogue, then structures it automatically instead of relying on the user to write it unprompted.",
    "integration": "AI"
  },
  {
    "sr": "165",
    "name": "Manifestations",
    "current": "manifestations is captured through static text-entry fields during onboarding.",
    "enhanced": "A conversational AI-guided onboarding flow (voice-capable via the AI audio companion) elicits 'manifestations' through a natural dialogue, then structures it automatically instead of relying on the user to write it unprompted.",
    "integration": "AI"
  },
  {
    "sr": "166",
    "name": "Progress overview",
    "current": "Progress overview is captured through static text-entry fields during onboarding.",
    "enhanced": "A conversational AI-guided onboarding flow (voice-capable via the AI audio companion) elicits 'Progress overview' through a natural dialogue, then structures it automatically instead of relying on the user to write it unprompted.",
    "integration": "AI"
  },
  {
    "sr": "167",
    "name": "Add New Habit",
    "current": "add new habit is captured through static text-entry fields during onboarding.",
    "enhanced": "A conversational AI-guided onboarding flow (voice-capable via the AI audio companion) elicits 'add new habit' through a natural dialogue, then structures it automatically instead of relying on the user to write it unprompted.",
    "integration": "AI"
  },
  {
    "sr": "168",
    "name": "Input Daily Habit Update",
    "current": "input daily habit update is captured through static text-entry fields during onboarding.",
    "enhanced": "A conversational AI-guided onboarding flow (voice-capable via the AI audio companion) elicits 'input daily habit update' through a natural dialogue, then structures it automatically instead of relying on the user to write it unprompted.",
    "integration": "AI"
  },
  {
    "sr": "169",
    "name": "Past Entries",
    "current": "past entries is captured through static text-entry fields during onboarding.",
    "enhanced": "A conversational AI-guided onboarding flow (voice-capable via the AI audio companion) elicits 'past entries' through a natural dialogue, then structures it automatically instead of relying on the user to write it unprompted.",
    "integration": "AI"
  },
  {
    "sr": "170",
    "name": "Goals Tracker",
    "current": "goals tracker is captured through static text-entry fields during onboarding.",
    "enhanced": "A conversational AI-guided onboarding flow (voice-capable via the AI audio companion) elicits 'goals tracker' through a natural dialogue, then structures it automatically instead of relying on the user to write it unprompted.",
    "integration": "AI"
  },
  {
    "sr": "171",
    "name": "Add New Goal",
    "current": "add new goal is captured through static text-entry fields during onboarding.",
    "enhanced": "A conversational AI-guided onboarding flow (voice-capable via the AI audio companion) elicits 'add new goal' through a natural dialogue, then structures it automatically instead of relying on the user to write it unprompted.",
    "integration": "AI"
  },
  {
    "sr": "172",
    "name": "Goal Momentum",
    "current": "goal momentum is captured through static text-entry fields during onboarding.",
    "enhanced": "A conversational AI-guided onboarding flow (voice-capable via the AI audio companion) elicits 'goal momentum' through a natural dialogue, then structures it automatically instead of relying on the user to write it unprompted.",
    "integration": "AI"
  },
  {
    "sr": "173",
    "name": "Habit Consistency",
    "current": "habit consistency is captured through static text-entry fields during onboarding.",
    "enhanced": "A conversational AI-guided onboarding flow (voice-capable via the AI audio companion) elicits 'habit consistency' through a natural dialogue, then structures it automatically instead of relying on the user to write it unprompted.",
    "integration": "AI"
  },
  {
    "sr": "174",
    "name": "Goal Impact",
    "current": "goal impact is captured through static text-entry fields during onboarding.",
    "enhanced": "A conversational AI-guided onboarding flow (voice-capable via the AI audio companion) elicits 'goal impact' through a natural dialogue, then structures it automatically instead of relying on the user to write it unprompted.",
    "integration": "AI"
  },
  {
    "sr": "175",
    "name": "Next Action To Do",
    "current": "next action to do is captured through static text-entry fields during onboarding.",
    "enhanced": "A conversational AI-guided onboarding flow (voice-capable via the AI audio companion) elicits 'next action to do' through a natural dialogue, then structures it automatically instead of relying on the user to write it unprompted.",
    "integration": "AI"
  },
  {
    "sr": "176",
    "name": "Person Name",
    "current": "person name is entered and maintained manually by the user for each contact.",
    "enhanced": "MCP integration with phone contacts/WhatsApp to auto-populate and keep 'person name' up to date, with an AI model suggesting relationship-health adjustments based on interaction patterns.",
    "integration": "AI + MCP"
  },
  {
    "sr": "177",
    "name": "Relationship",
    "current": "relationship is entered and maintained manually by the user for each contact.",
    "enhanced": "MCP integration with phone contacts/WhatsApp to auto-populate and keep 'relationship' up to date, with an AI model suggesting relationship-health adjustments based on interaction patterns.",
    "integration": "AI + MCP"
  },
  {
    "sr": "178",
    "name": "Email",
    "current": "email is entered and maintained manually by the user for each contact.",
    "enhanced": "MCP integration with phone contacts/WhatsApp to auto-populate and keep 'email' up to date, with an AI model suggesting relationship-health adjustments based on interaction patterns.",
    "integration": "AI + MCP"
  },
  {
    "sr": "179",
    "name": "Phone",
    "current": "phone is entered and maintained manually by the user for each contact.",
    "enhanced": "MCP integration with phone contacts/WhatsApp to auto-populate and keep 'phone' up to date, with an AI model suggesting relationship-health adjustments based on interaction patterns.",
    "integration": "AI + MCP"
  },
  {
    "sr": "180",
    "name": "Birthday",
    "current": "birthday is entered and maintained manually by the user for each contact.",
    "enhanced": "MCP integration with phone contacts/WhatsApp to auto-populate and keep 'birthday' up to date, with an AI model suggesting relationship-health adjustments based on interaction patterns.",
    "integration": "AI + MCP"
  },
  {
    "sr": "181",
    "name": "Anniversary",
    "current": "anniversary is entered and maintained manually by the user for each contact.",
    "enhanced": "MCP integration with phone contacts/WhatsApp to auto-populate and keep 'anniversary' up to date, with an AI model suggesting relationship-health adjustments based on interaction patterns.",
    "integration": "AI + MCP"
  },
  {
    "sr": "182",
    "name": "Contact Frequency",
    "current": "contact frequency is entered and maintained manually by the user for each contact.",
    "enhanced": "MCP integration with phone contacts/WhatsApp to auto-populate and keep 'contact frequency' up to date, with an AI model suggesting relationship-health adjustments based on interaction patterns.",
    "integration": "AI + MCP"
  },
  {
    "sr": "183",
    "name": "Last Contact",
    "current": "last contact is entered and maintained manually by the user for each contact.",
    "enhanced": "MCP integration with phone contacts/WhatsApp to auto-populate and keep 'last contact' up to date, with an AI model suggesting relationship-health adjustments based on interaction patterns.",
    "integration": "AI + MCP"
  },
  {
    "sr": "184",
    "name": "Reach-Out Reminder",
    "current": "reach-out reminder is entered and maintained manually by the user for each contact.",
    "enhanced": "MCP integration with phone contacts/WhatsApp to auto-populate and keep 'reach-out reminder' up to date, with an AI model suggesting relationship-health adjustments based on interaction patterns.",
    "integration": "AI + MCP"
  },
  {
    "sr": "185",
    "name": "Relationship Health",
    "current": "relationship health is entered and maintained manually by the user for each contact.",
    "enhanced": "MCP integration with phone contacts/WhatsApp to auto-populate and keep 'relationship health' up to date, with an AI model suggesting relationship-health adjustments based on interaction patterns.",
    "integration": "AI + MCP"
  },
  {
    "sr": "186",
    "name": "Post",
    "current": "Post works as a manually browsed, static list or feed.",
    "enhanced": "An AI matching/ranking model personalises 'Post' to the user's Goals, Career and DISC profile, surfacing the most relevant people/communities first instead of a flat chronological or static list.",
    "integration": "AI"
  },
  {
    "sr": "187",
    "name": "Like And Comment Other'S Posts",
    "current": "like and comment other's posts works as a manually browsed, static list or feed.",
    "enhanced": "An AI matching/ranking model personalises 'like and comment other's posts' to the user's Goals, Career and DISC profile, surfacing the most relevant people/communities first instead of a flat chronological or static list.",
    "integration": "AI"
  },
  {
    "sr": "188",
    "name": "Suggestions To Join Communities",
    "current": "suggestions to join communities works as a manually browsed, static list or feed.",
    "enhanced": "An AI matching/ranking model personalises 'suggestions to join communities' to the user's Goals, Career and DISC profile, surfacing the most relevant people/communities first instead of a flat chronological or static list.",
    "integration": "AI"
  },
  {
    "sr": "189",
    "name": "set PIN",
    "current": "set PIN is entered by manually typing values into a Vault form field.",
    "enhanced": "AI/OCR document scanning lets the user photograph or upload the source document for 'set PIN', with the system auto-extracting and pre-filling the field for the user to confirm rather than type.",
    "integration": "AI"
  },
  {
    "sr": "190",
    "name": "Bank Name",
    "current": "bank name is entered by manually typing values into a Vault form field.",
    "enhanced": "AI/OCR document scanning lets the user photograph or upload the source document for 'bank name', with the system auto-extracting and pre-filling the field for the user to confirm rather than type.",
    "integration": "AI"
  },
  {
    "sr": "191",
    "name": "Account Number",
    "current": "account number is entered by manually typing values into a Vault form field.",
    "enhanced": "AI/OCR document scanning lets the user photograph or upload the source document for 'account number', with the system auto-extracting and pre-filling the field for the user to confirm rather than type.",
    "integration": "AI"
  },
  {
    "sr": "192",
    "name": "Account Type",
    "current": "account type is entered by manually typing values into a Vault form field.",
    "enhanced": "AI/OCR document scanning lets the user photograph or upload the source document for 'account type', with the system auto-extracting and pre-filling the field for the user to confirm rather than type.",
    "integration": "AI"
  },
  {
    "sr": "193",
    "name": "branch / IFSC",
    "current": "branch / IFSC is entered by manually typing values into a Vault form field.",
    "enhanced": "AI/OCR document scanning lets the user photograph or upload the source document for 'branch / IFSC', with the system auto-extracting and pre-filling the field for the user to confirm rather than type.",
    "integration": "AI"
  },
  {
    "sr": "194",
    "name": "Nominee Name",
    "current": "nominee name is entered by manually typing values into a Vault form field.",
    "enhanced": "AI/OCR document scanning lets the user photograph or upload the source document for 'nominee name', with the system auto-extracting and pre-filling the field for the user to confirm rather than type.",
    "integration": "AI"
  },
  {
    "sr": "195",
    "name": "FD details",
    "current": "FD details is entered by manually typing values into a Vault form field.",
    "enhanced": "AI/OCR document scanning lets the user photograph or upload the source document for 'FD details', with the system auto-extracting and pre-filling the field for the user to confirm rather than type.",
    "integration": "AI"
  },
  {
    "sr": "196",
    "name": "Demat Portfolio",
    "current": "demat portfolio is entered by manually typing values into a Vault form field.",
    "enhanced": "AI/OCR document scanning lets the user photograph or upload the source document for 'demat portfolio', with the system auto-extracting and pre-filling the field for the user to confirm rather than type.",
    "integration": "AI"
  },
  {
    "sr": "197",
    "name": "Bonds / Debentures",
    "current": "bonds / debentures is entered by manually typing values into a Vault form field.",
    "enhanced": "AI/OCR document scanning lets the user photograph or upload the source document for 'bonds / debentures', with the system auto-extracting and pre-filling the field for the user to confirm rather than type.",
    "integration": "AI"
  },
  {
    "sr": "198",
    "name": "PPF account",
    "current": "PPF account is entered by manually typing values into a Vault form field.",
    "enhanced": "AI/OCR document scanning lets the user photograph or upload the source document for 'PPF account', with the system auto-extracting and pre-filling the field for the user to confirm rather than type.",
    "integration": "AI"
  },
  {
    "sr": "199",
    "name": "NPS / EPF / gratuity",
    "current": "NPS / EPF / gratuity is entered by manually typing values into a Vault form field.",
    "enhanced": "AI/OCR document scanning lets the user photograph or upload the source document for 'NPS / EPF / gratuity', with the system auto-extracting and pre-filling the field for the user to confirm rather than type.",
    "integration": "AI"
  },
  {
    "sr": "200",
    "name": "Gold / Jewellery",
    "current": "gold / jewellery is entered by manually typing values into a Vault form field.",
    "enhanced": "AI/OCR document scanning lets the user photograph or upload the source document for 'gold / jewellery', with the system auto-extracting and pre-filling the field for the user to confirm rather than type.",
    "integration": "AI"
  },
  {
    "sr": "201",
    "name": "Bank Locker Details",
    "current": "bank locker details is entered by manually typing values into a Vault form field.",
    "enhanced": "AI/OCR document scanning lets the user photograph or upload the source document for 'bank locker details', with the system auto-extracting and pre-filling the field for the user to confirm rather than type.",
    "integration": "AI"
  },
  {
    "sr": "202",
    "name": "Uploaded Documents",
    "current": "uploaded documents is entered by manually typing values into a Vault form field.",
    "enhanced": "AI/OCR document scanning lets the user photograph or upload the source document for 'uploaded documents', with the system auto-extracting and pre-filling the field for the user to confirm rather than type.",
    "integration": "AI"
  },
  {
    "sr": "203",
    "name": "Card Name / Bank",
    "current": "card name / bank is entered by manually typing values into a Vault form field.",
    "enhanced": "AI/OCR document scanning lets the user photograph or upload the source document for 'card name / bank', with the system auto-extracting and pre-filling the field for the user to confirm rather than type.",
    "integration": "AI"
  },
  {
    "sr": "204",
    "name": "Last 4 Digits",
    "current": "last 4 digits is entered by manually typing values into a Vault form field.",
    "enhanced": "AI/OCR document scanning lets the user photograph or upload the source document for 'last 4 digits', with the system auto-extracting and pre-filling the field for the user to confirm rather than type.",
    "integration": "AI"
  },
  {
    "sr": "205",
    "name": "Credit Limit",
    "current": "credit limit is entered by manually typing values into a Vault form field.",
    "enhanced": "AI/OCR document scanning lets the user photograph or upload the source document for 'credit limit', with the system auto-extracting and pre-filling the field for the user to confirm rather than type.",
    "integration": "AI"
  },
  {
    "sr": "206",
    "name": "Due Date",
    "current": "due date is entered by manually typing values into a Vault form field.",
    "enhanced": "AI/OCR document scanning lets the user photograph or upload the source document for 'due date', with the system auto-extracting and pre-filling the field for the user to confirm rather than type.",
    "integration": "AI"
  },
  {
    "sr": "207",
    "name": "Reward Programme",
    "current": "reward programme is entered by manually typing values into a Vault form field.",
    "enhanced": "AI/OCR document scanning lets the user photograph or upload the source document for 'reward programme', with the system auto-extracting and pre-filling the field for the user to confirm rather than type.",
    "integration": "AI"
  },
  {
    "sr": "208",
    "name": "Property Type",
    "current": "property type is entered by manually typing values into a Vault form field.",
    "enhanced": "AI/OCR document scanning lets the user photograph or upload the source document for 'property type', with the system auto-extracting and pre-filling the field for the user to confirm rather than type.",
    "integration": "AI"
  },
  {
    "sr": "209",
    "name": "Address",
    "current": "address is entered by manually typing values into a Vault form field.",
    "enhanced": "AI/OCR document scanning lets the user photograph or upload the source document for 'address', with the system auto-extracting and pre-filling the field for the user to confirm rather than type.",
    "integration": "AI"
  },
  {
    "sr": "210",
    "name": "Registration Number",
    "current": "registration number is entered by manually typing values into a Vault form field.",
    "enhanced": "AI/OCR document scanning lets the user photograph or upload the source document for 'registration number', with the system auto-extracting and pre-filling the field for the user to confirm rather than type.",
    "integration": "AI"
  },
  {
    "sr": "211",
    "name": "Document Location",
    "current": "document location is entered by manually typing values into a Vault form field.",
    "enhanced": "AI/OCR document scanning lets the user photograph or upload the source document for 'document location', with the system auto-extracting and pre-filling the field for the user to confirm rather than type.",
    "integration": "AI"
  },
  {
    "sr": "212",
    "name": "Vehicle Type",
    "current": "vehicle type is entered by manually typing values into a Vault form field.",
    "enhanced": "AI/OCR document scanning lets the user photograph or upload the source document for 'vehicle type', with the system auto-extracting and pre-filling the field for the user to confirm rather than type.",
    "integration": "AI"
  },
  {
    "sr": "213",
    "name": "Make & Model",
    "current": "make & model is entered by manually typing values into a Vault form field.",
    "enhanced": "AI/OCR document scanning lets the user photograph or upload the source document for 'make & model', with the system auto-extracting and pre-filling the field for the user to confirm rather than type.",
    "integration": "AI"
  },
  {
    "sr": "214",
    "name": "Registration Number",
    "current": "registration number is entered by manually typing values into a Vault form field.",
    "enhanced": "AI/OCR document scanning lets the user photograph or upload the source document for 'registration number', with the system auto-extracting and pre-filling the field for the user to confirm rather than type.",
    "integration": "AI"
  },
  {
    "sr": "215",
    "name": "RC / title location",
    "current": "RC / title location is entered by manually typing values into a Vault form field.",
    "enhanced": "AI/OCR document scanning lets the user photograph or upload the source document for 'RC / title location', with the system auto-extracting and pre-filling the field for the user to confirm rather than type.",
    "integration": "AI"
  },
  {
    "sr": "216",
    "name": "Provider",
    "current": "provider is entered by manually typing values into a Vault form field.",
    "enhanced": "AI/OCR document scanning lets the user photograph or upload the source document for 'provider', with the system auto-extracting and pre-filling the field for the user to confirm rather than type.",
    "integration": "AI"
  },
  {
    "sr": "217",
    "name": "Coverage Type",
    "current": "coverage type is entered by manually typing values into a Vault form field.",
    "enhanced": "AI/OCR document scanning lets the user photograph or upload the source document for 'coverage type', with the system auto-extracting and pre-filling the field for the user to confirm rather than type.",
    "integration": "AI"
  },
  {
    "sr": "218",
    "name": "Plan Name",
    "current": "plan name is entered by manually typing values into a Vault form field.",
    "enhanced": "AI/OCR document scanning lets the user photograph or upload the source document for 'plan name', with the system auto-extracting and pre-filling the field for the user to confirm rather than type.",
    "integration": "AI"
  },
  {
    "sr": "219",
    "name": "Spouse Coverage",
    "current": "spouse coverage is entered by manually typing values into a Vault form field.",
    "enhanced": "AI/OCR document scanning lets the user photograph or upload the source document for 'spouse coverage', with the system auto-extracting and pre-filling the field for the user to confirm rather than type.",
    "integration": "AI"
  },
  {
    "sr": "220",
    "name": "Life Insurance Policies",
    "current": "life insurance policies is entered by manually typing values into a Vault form field.",
    "enhanced": "AI/OCR document scanning lets the user photograph or upload the source document for 'life insurance policies', with the system auto-extracting and pre-filling the field for the user to confirm rather than type.",
    "integration": "AI"
  },
  {
    "sr": "221",
    "name": "Annual Leave",
    "current": "annual leave is entered by manually typing values into a Vault form field.",
    "enhanced": "AI/OCR document scanning lets the user photograph or upload the source document for 'annual leave', with the system auto-extracting and pre-filling the field for the user to confirm rather than type.",
    "integration": "AI"
  },
  {
    "sr": "222",
    "name": "Sick Leave",
    "current": "sick leave is entered by manually typing values into a Vault form field.",
    "enhanced": "AI/OCR document scanning lets the user photograph or upload the source document for 'sick leave', with the system auto-extracting and pre-filling the field for the user to confirm rather than type.",
    "integration": "AI"
  },
  {
    "sr": "223",
    "name": "EPF member",
    "current": "EPF member is entered by manually typing values into a Vault form field.",
    "enhanced": "AI/OCR document scanning lets the user photograph or upload the source document for 'EPF member', with the system auto-extracting and pre-filling the field for the user to confirm rather than type.",
    "integration": "AI"
  },
  {
    "sr": "224",
    "name": "Gratuity Eligible",
    "current": "gratuity eligible is entered by manually typing values into a Vault form field.",
    "enhanced": "AI/OCR document scanning lets the user photograph or upload the source document for 'gratuity eligible', with the system auto-extracting and pre-filling the field for the user to confirm rather than type.",
    "integration": "AI"
  },
  {
    "sr": "225",
    "name": "Pension Plan",
    "current": "pension plan is entered by manually typing values into a Vault form field.",
    "enhanced": "AI/OCR document scanning lets the user photograph or upload the source document for 'pension plan', with the system auto-extracting and pre-filling the field for the user to confirm rather than type.",
    "integration": "AI"
  },
  {
    "sr": "226",
    "name": "Will Location",
    "current": "will location is entered by manually typing values into a Vault form field.",
    "enhanced": "AI/OCR document scanning lets the user photograph or upload the source document for 'will location', with the system auto-extracting and pre-filling the field for the user to confirm rather than type.",
    "integration": "AI"
  },
  {
    "sr": "227",
    "name": "Attorney Details",
    "current": "attorney details is entered by manually typing values into a Vault form field.",
    "enhanced": "AI/OCR document scanning lets the user photograph or upload the source document for 'attorney details', with the system auto-extracting and pre-filling the field for the user to confirm rather than type.",
    "integration": "AI"
  },
  {
    "sr": "228",
    "name": "Executor Name",
    "current": "executor name is entered by manually typing values into a Vault form field.",
    "enhanced": "AI/OCR document scanning lets the user photograph or upload the source document for 'executor name', with the system auto-extracting and pre-filling the field for the user to confirm rather than type.",
    "integration": "AI"
  },
  {
    "sr": "229",
    "name": "Notes For Family",
    "current": "notes for family is entered by manually typing values into a Vault form field.",
    "enhanced": "AI/OCR document scanning lets the user photograph or upload the source document for 'notes for family', with the system auto-extracting and pre-filling the field for the user to confirm rather than type.",
    "integration": "AI"
  },
  {
    "sr": "230",
    "name": "Upload Will Document",
    "current": "upload will document is entered by manually typing values into a Vault form field.",
    "enhanced": "AI/OCR document scanning lets the user photograph or upload the source document for 'upload will document', with the system auto-extracting and pre-filling the field for the user to confirm rather than type.",
    "integration": "AI"
  },
  {
    "sr": "231",
    "name": "Organ Donation Preference",
    "current": "organ donation preference is entered by manually typing values into a Vault form field.",
    "enhanced": "AI/OCR document scanning lets the user photograph or upload the source document for 'organ donation preference', with the system auto-extracting and pre-filling the field for the user to confirm rather than type.",
    "integration": "AI"
  },
  {
    "sr": "232",
    "name": "Document Location",
    "current": "document location is entered by manually typing values into a Vault form field.",
    "enhanced": "AI/OCR document scanning lets the user photograph or upload the source document for 'document location', with the system auto-extracting and pre-filling the field for the user to confirm rather than type.",
    "integration": "AI"
  },
  {
    "sr": "233",
    "name": "Additional Notes",
    "current": "additional notes is entered by manually typing values into a Vault form field.",
    "enhanced": "AI/OCR document scanning lets the user photograph or upload the source document for 'additional notes', with the system auto-extracting and pre-filling the field for the user to confirm rather than type.",
    "integration": "AI"
  },
  {
    "sr": "234",
    "name": "Attached Documents",
    "current": "attached documents is entered by manually typing values into a Vault form field.",
    "enhanced": "AI/OCR document scanning lets the user photograph or upload the source document for 'attached documents', with the system auto-extracting and pre-filling the field for the user to confirm rather than type.",
    "integration": "AI"
  },
  {
    "sr": "235",
    "name": "Vault Completion Score",
    "current": "vault completion score is entered by manually typing values into a Vault form field.",
    "enhanced": "AI/OCR document scanning lets the user photograph or upload the source document for 'vault completion score', with the system auto-extracting and pre-filling the field for the user to confirm rather than type.",
    "integration": "AI"
  },
  {
    "sr": "236",
    "name": "Quiz",
    "current": "Quiz is a fixed-length quiz/report shown once after completion.",
    "enhanced": "An adaptive AI-driven version of 'Quiz' shortens the quiz using item-response modelling and periodically re-validates the profile against actual in-app behaviour, keeping it current rather than a one-time snapshot.",
    "integration": "AI"
  },
  {
    "sr": "237",
    "name": "Analysis",
    "current": "Analysis is a fixed-length quiz/report shown once after completion.",
    "enhanced": "An adaptive AI-driven version of 'Analysis' shortens the quiz using item-response modelling and periodically re-validates the profile against actual in-app behaviour, keeping it current rather than a one-time snapshot.",
    "integration": "AI"
  },
  {
    "sr": "238",
    "name": "Net Worth",
    "current": "net worth relies on data pulled once via the Account Aggregator consent flow and refreshed on a fixed schedule.",
    "enhanced": "Real-time MCP/webhook-based refresh for 'net worth' plus an AI anomaly-detection layer that flags unusual transactions or drift from goals as they happen, not on the next scheduled sync.",
    "integration": "AI + MCP"
  },
  {
    "sr": "239",
    "name": "AI Summary",
    "current": "AI Summary depends on the user manually logging data (food, water, workouts, mood) into the app.",
    "enhanced": "Automatic capture for 'AI Summary' via wearable/MCP sensor sync and, where relevant, AI computer-vision food/activity recognition, cutting manual entry to a quick confirmation.",
    "integration": "AI + MCP"
  },
  {
    "sr": "240",
    "name": "Dietary Preferences",
    "current": "dietary preferences depends on the user manually logging data (food, water, workouts, mood) into the app.",
    "enhanced": "Automatic capture for 'dietary preferences' via wearable/MCP sensor sync and, where relevant, AI computer-vision food/activity recognition, cutting manual entry to a quick confirmation.",
    "integration": "AI + MCP"
  },
  {
    "sr": "241",
    "name": "AI Summary",
    "current": "AI Summary is generated from data the user manually enters or a LinkedIn PDF they upload once.",
    "enhanced": "AI document parsing auto-extracts and continuously updates 'AI Summary' from a connected LinkedIn/professional profile via MCP, refreshing automatically instead of requiring a re-upload.",
    "integration": "AI + MCP"
  },
  {
    "sr": "242",
    "name": "Income Alignment",
    "current": "Income Alignment is generated from data the user manually enters or a LinkedIn PDF they upload once.",
    "enhanced": "AI document parsing auto-extracts and continuously updates 'Income Alignment' from a connected LinkedIn/professional profile via MCP, refreshing automatically instead of requiring a re-upload.",
    "integration": "AI + MCP"
  },
  {
    "sr": "243",
    "name": "Upcoming Dates",
    "current": "upcoming dates is entered and maintained manually by the user for each contact.",
    "enhanced": "MCP integration with phone contacts/WhatsApp to auto-populate and keep 'upcoming dates' up to date, with an AI model suggesting relationship-health adjustments based on interaction patterns.",
    "integration": "AI + MCP"
  },
  {
    "sr": "244",
    "name": "Reach Out To",
    "current": "reach out to is entered and maintained manually by the user for each contact.",
    "enhanced": "MCP integration with phone contacts/WhatsApp to auto-populate and keep 'reach out to' up to date, with an AI model suggesting relationship-health adjustments based on interaction patterns.",
    "integration": "AI + MCP"
  },
  {
    "sr": "245",
    "name": "People Directory",
    "current": "people directory is entered and maintained manually by the user for each contact.",
    "enhanced": "MCP integration with phone contacts/WhatsApp to auto-populate and keep 'people directory' up to date, with an AI model suggesting relationship-health adjustments based on interaction patterns.",
    "integration": "AI + MCP"
  },
  {
    "sr": "246",
    "name": "Personal And Family Details",
    "current": "personal and family details is entered and maintained manually by the user for each contact.",
    "enhanced": "MCP integration with phone contacts/WhatsApp to auto-populate and keep 'personal and family details' up to date, with an AI model suggesting relationship-health adjustments based on interaction patterns.",
    "integration": "AI + MCP"
  },
  {
    "sr": "247",
    "name": "Professional Contacts",
    "current": "professional contacts is entered and maintained manually by the user for each contact.",
    "enhanced": "MCP integration with phone contacts/WhatsApp to auto-populate and keep 'professional contacts' up to date, with an AI model suggesting relationship-health adjustments based on interaction patterns.",
    "integration": "AI + MCP"
  },
  {
    "sr": "248",
    "name": "Emergency Contacts",
    "current": "emergency contacts is entered and maintained manually by the user for each contact.",
    "enhanced": "MCP integration with phone contacts/WhatsApp to auto-populate and keep 'emergency contacts' up to date, with an AI model suggesting relationship-health adjustments based on interaction patterns.",
    "integration": "AI + MCP"
  },
  {
    "sr": "249",
    "name": "Data Sovereignty Guarantee",
    "current": "User data is never sold or shared with third parties for advertising or marketing purposes; all processing stays within a user-controlled, sovereign data boundary.",
    "enhanced": "Backed by a continuously monitored, third-party-audited compliance dashboard (public status page) rather than a static policy statement.",
    "integration": "AI + MCP"
  },
  {
    "sr": "250",
    "name": "No Ad-Targeting Policy",
    "current": "Personal data is never used to build advertising profiles or targeted marketing segments, inside the app or for any external advertiser.",
    "enhanced": "Enforced as a technical control (no ad-SDK or tracking-pixel integrations possible in the codebase) verified by periodic external audit, not just a written policy.",
    "integration": "AI + MCP"
  },
  {
    "sr": "251",
    "name": "Metadata-Only AI Personalisation",
    "current": "AI recommendations are generated from aggregated behavioural metadata rather than reading or exposing personal content itself, wherever technically possible.",
    "enhanced": "Implemented via a formally documented data-pipeline architecture with automated tests that block any model training path from touching raw personal content.",
    "integration": "AI + MCP"
  },
  {
    "sr": "252",
    "name": "User Data Ownership & Export",
    "current": "Users can export or permanently delete their complete data set at any time; the user, not the platform, owns their data.",
    "enhanced": "Self-serve one-click export/delete via an in-app 'My Data' control centre, instead of requiring a support request.",
    "integration": "AI + MCP"
  },
  {
    "sr": "253",
    "name": "Regional Data Residency",
    "current": "Data is stored within the user's own region/jurisdiction to meet local data-sovereignty and compliance expectations.",
    "enhanced": "Automated region-aware routing that dynamically stores and processes each user's data in their nearest compliant region, verified via an MCP-based infrastructure-monitoring integration.",
    "integration": "AI + MCP"
  }
];

export const lifeCompassSwot: LcSwot = {
  "strengths": [
    "Only product connecting career, finance, health and relationships in one AI-guided plan — every competitor is single-domain.",
    "Explicit data sovereignty guarantee: data is never sold, shared, or used for ad-targeting, and AI personalisation runs on metadata, not personal content — a structural trust advantage over finance and wellness apps that monetise via ads or cross-selling.",
    "Bootstrapped, profitable parent organisation with an existing enterprise/PropTech customer base and technical team to draw on.",
    "DISC-based personalisation is woven through every module, not a one-time quiz result shown once.",
    "Occupation-agnostic design (founders, homemakers, employees, retirees all fit) gives a wider addressable market than any single competitor.",
    "Full feature architecture (253 features across 13 modules, including Trust & Privacy) already scoped and in active beta build, reducing execution ambiguity."
  ],
  "weaknesses": [
    "Hardware companion (wearable + AI audio device) is still concept-stage, so the most differentiated USP is not yet in market.",
    "Pre-launch with no traction or paying users yet, so there is no proof point for retention or willingness-to-pay assumptions.",
    "Breadth across 13 modules risks a 'jack of all trades, master of none' first impression versus focused single-domain competitors.",
    "No enterprise/B2B2C admin and reporting layer yet, closing off a faster-monetising wellness-benefit channel in the near term.",
    "Onboarding requires substantial upfront input (Vision, Mission, DISC, Goals) before AI value appears, risking early drop-off.",
    "Data sovereignty is currently a stated policy rather than an independently audited or certified claim, so it must be proven, not just asserted, before sceptical users (especially 40+) will fully trust it."
  ],
  "opportunities": [
    "Account Aggregator adoption is accelerating in India, making bank-linked financial insight cheaper and faster to deliver than a few years ago.",
    "No competitor has combined a wearable, an ambient AI companion and a full life-management app — a genuine category-first if executed.",
    "Rising global awareness of data privacy and ad-tracking fatigue makes 'your data works for you, not advertisers' an increasingly persuasive, timely message rather than a niche concern.",
    "Corporate wellness spend is rising post-pandemic, opening a B2B2C channel once an admin/reporting layer is built — and a data-sovereignty guarantee is a strong differentiator to HR buyers who are themselves wary of employee-data misuse.",
    "GCC's high disposable income and digital-adoption rates support premium pricing once the product is proven in India."
  ],
  "threats": [
    "Well-funded single-domain leaders (Whoop, BetterUp, fintech apps) could each bolt on adjacent features and narrow the integration gap faster than we can build hardware.",
    "Data-sensitive categories (finance, health, legal/Vault) invite regulatory scrutiny (data localisation, consent rules) that could slow rollout across multiple geographies at once, even with a data-sovereign architecture.",
    "A single data breach or privacy misstep would be disproportionately damaging given how central the data sovereignty promise is to the brand — the higher the trust claim, the higher the cost of ever breaking it.",
    "Hardware development (hitting cost, reliability and timeline targets for a wearable + AI companion) carries execution risk outside pure software control.",
    "A crowded, well-marketed wellness-app category makes paid user acquisition expensive before the AI/integration/data-sovereignty differentiation is felt by a new user."
  ]
};

export const lifeCompassBlocks: Record<string, LcBlock[]> = {
  "summary": [
    {
      "kind": "heading",
      "text": "LIFE BLUEPRINT — PRODUCT SUMMARY"
    },
    {
      "kind": "heading",
      "text": "WHAT IT IS"
    },
    {
      "kind": "table",
      "header": null,
      "rows": [
        [
          "One-line",
          "An AI-powered life companion (software + hardware) that unifies career, finance, health, relationships and personal wellbeing into a single personalised operating system, built on a data-sovereign foundation."
        ],
        [
          "How it works",
          "User defines Vision/Mission/Goals; AI suggests habits and a daily plan; the system tracks consistency and progress across all life areas and recommends the next best action — using metadata-driven AI, never personal content, for targeting."
        ],
        [
          "Form factor",
          "Mobile/web app today; roadmap includes a wearable (fitness tracking) + always-on audio AI companion device (non-screen prompts, reflection, task reminders)."
        ]
      ]
    },
    {
      "kind": "heading",
      "text": "WHO IT'S FOR"
    },
    {
      "kind": "table",
      "header": null,
      "rows": [
        [
          "Primary user",
          "Individual consumers (B2C) seeking structure and consistency across life goals — occupation-agnostic: employees, founders, homemakers, students and retirees alike."
        ],
        [
          "Geography",
          "India, GCC, Southeast Asia, UK, US and Europe."
        ],
        [
          "Life-stage priority",
          "20s: career-led. 30s: finance-led. 40s: relationships & health-led. 50+: personal wellbeing-led. Fully user-adjustable."
        ]
      ]
    },
    {
      "kind": "heading",
      "text": "PROBLEM IT SOLVES"
    },
    {
      "kind": "table",
      "header": null,
      "rows": [
        [
          "Fragmentation",
          "Career, finance, health, relationship and personal-growth tools exist in silos today and never talk to each other, so users can't see how progress in one area affects another."
        ],
        [
          "Planning-to-action gap",
          "Most goal-setting tools stop at the plan; Life Blueprint closes the loop — plan, habit suggestion, consistency tracking, progress measurement — in one place."
        ],
        [
          "No always-on support",
          "Existing apps are screen-dependent check-ins; the planned AI companion hardware gives passive, ambient coaching throughout the day."
        ],
        [
          "Data trust deficit",
          "Most life-data apps (finance, health) monetise via advertising or cross-selling on user data; Life Blueprint is built data-sovereign from day one — data is used purely for the user's own betterment, never for ad-targeting."
        ]
      ]
    },
    {
      "kind": "heading",
      "text": "WHERE IT IS TODAY"
    },
    {
      "kind": "table",
      "header": [
        "Stage",
        "Pre-launch, in active software development (beta)."
      ],
      "rows": [
        [
          "Hardware",
          "Concept stage — fitness tracker (Whoop-like) + AI note-taking/audio companion (Neo Sapien-like) being scoped; not yet built."
        ],
        [
          "Software scope",
          "Full feature set defined across Dashboard, Calendar, Journal, Learn, Finance, Health, Career, Blueprint, People, Community, Vault, DISC and Trust & Privacy modules (253 features)."
        ]
      ]
    },
    {
      "kind": "heading",
      "text": "FEATURE SUMMARY (BY MODULE)"
    },
    {
      "kind": "table",
      "header": [
        "Stage",
        "Pre-launch, in active software development (beta)."
      ],
      "rows": [
        [
          "General",
          "Dashboard (16); Calendar (31); Journal (25); Learn (7)"
        ],
        [
          "My life",
          "Finance (26); health (35); Career (16); blueprint (23)"
        ],
        [
          "Social",
          "People (16); community (3)"
        ],
        [
          "personal",
          "vault (47); DISC (2)"
        ],
        [
          "Onboarding",
          "health (1)"
        ],
        [
          "Personal",
          "Trust & Privacy (5)"
        ]
      ]
    },
    {
      "kind": "heading",
      "text": "KEY USPs"
    },
    {
      "kind": "table",
      "header": [
        "Stage",
        "Pre-launch, in active software development (beta)."
      ],
      "rows": [
        [
          "1. True integration",
          "The only product connecting all life areas in one place — competitors are single-domain point solutions."
        ],
        [
          "2. Closed-loop system",
          "Plan -> AI-suggested habits (user consent) -> guided consistency -> progress tracking, end-to-end in one flow."
        ],
        [
          "3. Software + hardware",
          "Only entrant combining an app with a wearable fitness tracker and a 24/7 audio AI companion for screen-free reflection, gratitude prompts and task reminders."
        ],
        [
          "4. Personality-driven personalisation",
          "DISC-based personalisation drives goals, plans, courses and coaching recommendations across every module."
        ],
        [
          "5. Data sovereignty",
          "Complete user comfort that their data is never used to track them for marketing or sold to third parties — it exists purely for their own betterment. AI personalisation runs on metadata (patterns and behaviours), not on reading or targeting personal content."
        ]
      ]
    },
    {
      "kind": "heading",
      "text": "TRACTION / MILESTONES"
    },
    {
      "kind": "table",
      "header": [
        "Stage",
        "Pre-launch, in active software development (beta)."
      ],
      "rows": [
        [
          "Product",
          "Beta-stage software build in progress across all core modules (Dashboard, Blueprint, Calendar, Journal, Finance, Health, Career, Vault, People, Community, DISC, Trust & Privacy)."
        ],
        [
          "Hardware",
          "Not yet started - concept and vendor/build path being evaluated (Whoop-class tracker + Neo Sapien-class audio companion)."
        ],
        [
          "Go-to-market",
          "Not yet launched; pre-launch stage."
        ]
      ]
    }
  ],
  "usecases": [
    {
      "kind": "heading",
      "text": "LIFE BLUEPRINT — USE CASES (B2C, BY TARGET AGE GROUP)"
    },
    {
      "kind": "note",
      "text": "Note: Life Blueprint is occupation-agnostic by design — every adult managing a life, regardless of employment status or income source (salaried, self-employed, founder, homemaker, student, retiree, caregiver) is a fit. This is what expands TAM beyond a working-professional-only market. Data sovereignty (no ad-targeting, metadata-only AI, user-owned data) is a trust foundation that applies across every TG below, and becomes a decisive factor wherever financial, health or legal data is involved."
    },
    {
      "kind": "heading",
      "text": "PART A — TARGET GROUP LEVEL, BY AGE BRACKET (this is a B2C product used across every life stage and life role)"
    },
    {
      "kind": "table",
      "header": [
        "Priority",
        "Age Bracket (TG)",
        "Relevance — Features Used Most & Why",
        "How They Will Use It",
        "Ideal Customer Profile (life stage / income / demographics)",
        "What They Use Today Instead",
        "Urgency (Level + Reason)",
        "Primary Buyer (Who Pays / What Drives the Decision)",
        "Primary User (Who They Are / Daily Frustration)"
      ],
      "rows": [
        [
          "1",
          "20-30 — Early Builders",
          "Blueprint (Vision/Goals), Career roadmap & skill SWOT, Learn module, Habit tracker, Calendar AI planner.",
          "Set a first life vision, build study/work/fitness habits from scratch, use the AI planner to block time around a new job, a new venture, coursework, or running a household for the first time.",
          "Single or newly partnered, 1-8 years into adult life, urban India/GCC/SEA/UK/US, tech-comfortable, modest but growing income (or none yet, if a student). Spans salaried first-jobbers, startup founders and early gig/freelance workers, postgraduate students, and young homemakers managing a new household.",
          "A patchwork of LinkedIn Learning, Notion or a habit-streak app, Instagram/YouTube 'growth' content, and a generic budgeting app — none connected to each other, and most of them monetised via ads on the user's own behaviour.",
          "High — habits and financial patterns formed now compound for decades, and this group is the most receptive to trying a new app; being explicitly ad-free and data-sovereign is a fast trust-builder with a privacy-aware generation.",
          "Self-funded on a freemium/low-cost plan; in India, sometimes parent-subsidised as a 'self-improvement' gift; decision driven by visible, fast progress, gamified feedback, and confidence the app isn't quietly monetising their data.",
          "The user themself, whatever their role — employee, founder, student, or homemaker — daily frustration is having a dozen disconnected apps and no single view of how today's habits ladder up to their bigger goals."
        ],
        [
          "2",
          "30-40 — Builders & Stabilisers",
          "Finance module (net worth, cash flow, savings goals, EMIs), Career snapshot, Health targets, People (family rhythm), Calendar.",
          "Consolidate all bank accounts and EMIs into one view, track a savings/home-purchase goal, and protect health and family time against a heavier daily load — whether that load is a job, a growing business, or running a household.",
          "Married or partnered, often with a first child or a first home purchase underway, dual-income or single-income households, India/GCC/UK. Spans mid-level employees, founders scaling a business, self-employed professionals, and homemakers managing household finances and family logistics full-time.",
          "A spreadsheet for net worth, a couple of banking apps, a shared family calendar, and a mental tally of what's falling through the cracks — plus lingering unease about how much financial data those apps are quietly monetising.",
          "High — this is the highest-complexity life stage (career/business + finances + family + health all peaking at once) and the point where fragmentation hurts most; linking bank accounts here makes data sovereignty a hard requirement, not a nice-to-have.",
          "Self-funded, often a household decision made jointly with a spouse; driven by the promise of one consolidated view instead of five separate tools, backed by a clear guarantee that linked financial data won't be sold or targeted.",
          "The user themself, sometimes their spouse as a secondary user — daily frustration is feeling in control of nothing because everything (career or business, money, family, health) lives in a different place, with no guarantee any of it stays private."
        ],
        [
          "3",
          "40-50 — Peak Responsibility (Sandwich Generation)",
          "Vault (assets, insurance, investments), Finance module, Health targets (weight, anxiety, nutrition), Career SWOT for a pivot or plateau, People reminders.",
          "Organise a growing set of financial assets and insurance policies in one secure place, monitor health as early warning signs appear, and manage relationship commitments to both ageing parents and teenage children — whatever their day job or role looks like.",
          "Senior professionals, established business owners, self-employed specialists, and homemakers running multi-generational households, higher net worth, supporting both children and ageing parents simultaneously, India/GCC/UK/US.",
          "A financial advisor's PDF reports, a folder of insurance papers, a doctor's occasional check-up — no digital thread connecting any of it, and a reluctance to digitise sensitive asset/health data without a clear privacy guarantee.",
          "Medium-High — asset and estate complexity is rising fast and health issues are starting to surface, but this group is busier and harder to reach than younger TGs; a Vault holding wills, insurance and health data will only be adopted if data sovereignty is explicit and provable.",
          "Self-funded on a premium plan, increasingly buys/sets up the Vault for a spouse or parent too; driven by the anxiety of things being 'scattered' and hard to hand over if something happens, and reassured that this sensitive data is never used for marketing.",
          "The user themself, plus their parents as an emerging secondary beneficiary — daily frustration is the mental load of tracking everything for their own life and their parents' too, and worry about who else might see or use that data."
        ],
        [
          "4",
          "50-60 — Legacy & Wellbeing Planners",
          "Vault (will, executor, legal documents, insurance — heaviest usage), Health targets and chronic-condition tracking, Journal letters to future self/family, People (legacy contacts).",
          "Put a will, nominee details and property documents in one place their family can find, track health metrics more closely, and write letters to children or grandchildren for the future.",
          "Pre-retirement professionals, business owners handing over to the next generation, semi-retired consultants, and homemakers whose children are now independent; focus shifting from accumulation to protection and legacy, India/GCC/UK/US, moderate digital comfort that needs a simpler experience.",
          "A physical folder or safe with paper documents, an annual meeting with a lawyer or CA, no digital record accessible to family in an emergency — kept on paper specifically because digitising it feels risky without a clear data-privacy guarantee.",
          "Medium — the need is high, but this group needs a simplified, low-friction experience and an explicit, plain-language data sovereignty promise before they'll trust a will or health record to an app.",
          "Self-funded, sometimes an adult child sets it up on their behalf; driven by wanting family to have clarity 'just in case,' with data sovereignty as the deciding factor between 'worth digitising' and 'stays on paper.'",
          "The user themself, with adult children as indirect beneficiaries — daily frustration is knowing important documents are scattered but never getting around to organising them, partly from not trusting any app with something this sensitive."
        ],
        [
          "5",
          "60 and above — Wellbeing & Continuity Focus",
          "Vault (comprehensive — will, health insurance, guardianship, organ donation), Health (medication/target tracking, mental journey), Journal (letters to family), People (emergency contacts).",
          "Keep every critical document and health record in one place accessible to family, track health consistently, and stay connected to family through simple prompts rather than a complex app.",
          "Retired or semi-retired individuals in a grandparent life stage — former employees, founders, and lifelong homemakers alike — prioritising health monitoring and making information accessible to family, India/GCC/UK/US, digital comfort varies widely and often needs family or companion-device assistance.",
          "Paper records kept at home, a family member manually tracking medications or documents on their behalf, occasional reminders from children — often because 'putting it all in one app' feels exposing without a plain data-sovereignty guarantee.",
          "Medium — strong latent need, but real adoption depends on a very simple or assisted interface and an unambiguous promise that health and legal data is never used for marketing — exactly what the planned AI audio companion hardware and data sovereignty policy are built to solve together.",
          "Often an adult child buys or sets up the account for a parent; self-funded when the user is digitally comfortable; driven by peace of mind for the whole family, reinforced by knowing the data stays private and sovereign.",
          "The user themself, often supported by an adult child as co-user — daily frustration is the cognitive load of managing health, documents and family coordination without help, and the fear both that family won't find what they need in an emergency, and that a company might misuse something this personal."
        ]
      ]
    },
    {
      "kind": "heading",
      "text": "PART B — INTERNAL TEAMS LEVEL (Life Blueprint's own teams, supporting a B2C user base across every age bracket and life role)"
    },
    {
      "kind": "table",
      "header": [
        "Team",
        "Relevant Features & Processes",
        "How They Use It Day-to-Day",
        "Primary Benefit to Team",
        "Frequency of Use"
      ],
      "rows": [
        [
          "Growth & Marketing Team",
          "Onboarding funnel data, DISC profile, Vision/Goals inputs, age-bracket and life-role usage segmentation (aggregated metadata only — never personal content).",
          "Segment campaigns and messaging by age bracket and life role (career-hook creative for a 20s founder, household-finance-hook creative for a homemaker, legacy/Vault-hook creative for 50+); explicitly market the no-ad-targeting, data-sovereignty policy as a differentiator, not just a compliance footnote.",
          "Higher-converting, life-stage-and-role-relevant acquisition, plus a genuine trust differentiator competitors monetising on user data cannot claim.",
          "Daily"
        ],
        [
          "Customer Success / Support Team",
          "Finance AA linking flow, Vault setup, onboarding completion status by user.",
          "Proactively reach out to users stuck mid-flow (e.g. failed bank linking, incomplete Vault setup) — with extra hand-holding scripted for the 50+ and 60+ segments, and a ready, plain-language explanation of the data sovereignty policy for anyone hesitating to link sensitive data.",
          "Lower drop-off and higher activation, especially where hesitation is really a trust concern, not a technical one.",
          "Daily"
        ],
        [
          "AI / Data Science Team",
          "Anonymised, aggregated behavioural metadata (patterns, frequencies, completions) across the user base — not raw personal content.",
          "Continuously retrain recommendation models per age-bracket and life-role behaviour pattern strictly from metadata, enforcing the metadata-only processing policy as a hard technical constraint, not just a stated intention.",
          "Recommendations that stay accurate and relevant while keeping the data-sovereignty promise technically, not just contractually, true.",
          "Weekly (model refresh cycle)"
        ],
        [
          "Content & Coaching Team",
          "Learn library, recipe/workout library, affirmations, journal prompts.",
          "Curate and refresh content calibrated to each age bracket and life role's real priorities — founder-relevant courses, homemaker-relevant financial literacy content, career content for early professionals, legacy and health content for 50s and above.",
          "Content that feels personally relevant to every kind of user, not just the salaried professional, improving daily engagement.",
          "Weekly"
        ],
        [
          "Trust & Security Team",
          "Vault encryption, consent flows for Finance AA and health data, access controls, data-residency configuration, ad-targeting-exclusion controls.",
          "Audit and harden data protection, particularly for sensitive Vault and health data used heavily by the 40+ segments; maintain the technical and contractual proof points behind the data sovereignty guarantee (no ad-network integrations, regional data residency, metadata-only AI pipelines).",
          "User trust and regulatory compliance — the top adoption barrier for older, higher-net-worth or non-salaried users — turned into a provable, marketable strength.",
          "Monthly / continuous monitoring"
        ],
        [
          "Product Team",
          "Feature adoption and drop-off data segmented by age bracket and life role.",
          "Prioritise the roadmap by TG and role — e.g. simplifying UX flows for 50+ users, deepening business/founder-relevant goal-tracking, adding household-budget views useful to homemakers, and surfacing the data sovereignty guarantee visibly at the exact moments (bank linking, Vault setup) where trust is being tested.",
          "A roadmap grounded in real usage differences across life stages and life roles, with trust friction addressed at the point it actually occurs.",
          "Ongoing (sprint planning)"
        ],
        [
          "Partnerships Team",
          "Account Aggregator/finance data links, hardware roadmap, insurance and EdTech integration points.",
          "Line up the right partners for the right TG — EdTech and founder-community partners for 20-30s, insurance and estate-planning partners for 40+, household/family-services partners relevant to homemakers — vetting every partner against the no-data-sharing, no-ad-targeting policy before integration.",
          "Partnerships that map to genuine TG and role needs without compromising the data sovereignty promise that differentiates us.",
          "Monthly"
        ]
      ]
    }
  ],
  "market": [
    {
      "kind": "heading",
      "text": "LIFE BLUEPRINT — MARKET ANALYSIS"
    },
    {
      "kind": "note",
      "text": "Note: Life Blueprint is occupation-agnostic — the addressable market is every adult managing a life, not just salaried professionals. Segments below deliberately include founders, homemakers, students, freelancers and retirees alongside corporate employees within each age bracket. Data sovereignty (no ad-targeting, metadata-only AI, user data ownership) is woven in as a trust factor wherever financial, health or legal data is involved."
    },
    {
      "kind": "heading",
      "text": "PART A — TARGET AUDIENCE, BY AGE BRACKET (India, GCC, Southeast Asia, UK, US, Europe only)"
    },
    {
      "kind": "table",
      "header": [
        "Age Bracket",
        "Segmentation — Who They Are, Exactly",
        "Likely Occupations / Life Roles",
        "Pain Points (Structural + Personal Level)",
        "If Not Solved (Cost / Risk / Missed Opportunity)",
        "What 'Good Enough' Looks Like Today"
      ],
      "rows": [
        [
          "20-30",
          "First-jobbers, early-stage founders, gig/freelance workers, postgraduate students, and newly married young homemakers — mostly single or newly partnered, living in metros away from family, digitally native, still forming financial and health habits regardless of what they do for income.",
          "Salaried employees (tech, BFSI, consulting, retail), startup founders, gig/creative freelancers, students, young homemakers.",
          "1) Structural: career, business and skilling content is generic and not tied to their actual goals or role. 2) Personal: habit and goal apps get abandoned within weeks without personalised structure. 3) Personal: financial habits (saving, investing, budgeting a household or a business) are not being built early, when compounding matters most; a privacy-aware generation is also wary of apps that monetise personal data via ads.",
          "Slower progress in whatever they're building (career, business, household), skill or opportunity gaps, and financial habits that don't compound — costs that only become visible a decade later.",
          "A stitched-together mix of LinkedIn Learning, a habit-streak app, and a generic budgeting app, used inconsistently, abandoned often, and typically ad-supported."
        ],
        [
          "30-40",
          "Dual-income couples, single high-earners, scaling founders, self-employed professionals, and homemakers managing a household full-time — often buying a first home or having a first child, responsibilities rising fast, time is the scarcest resource for all of them.",
          "Mid-to-senior employees, business owners/founders scaling a venture, self-employed professionals, full-time homemakers.",
          "1) Structural: financial products (loans, investments, insurance) are sold in isolation with no life-goal context. 2) Personal: no consolidated view of net worth, EMIs and savings goals, whether the money comes from a salary, a business, or is jointly managed for a household. 3) Personal: family and relationship time quietly erodes under work or business pressure; linking bank data to any single app raises real data-privacy concerns at this life stage.",
          "Missed savings and home targets, under-insurance, and relationship strain that surfaces later as a bigger crisis.",
          "A personal spreadsheet for net worth, a couple of banking apps, and a shared family calendar with no reminders or connection between them, and no explicit data-sovereignty guarantee from any of them."
        ],
        [
          "40-50",
          "Senior professionals, established business owners, self-employed specialists, and homemakers running multi-generational households — supporting both teenage/young-adult children and ageing parents at the same time; asset base and responsibilities both growing regardless of occupation.",
          "Senior corporate roles, established entrepreneurship, self-employed professionals (BFSI, real estate, healthcare, consulting), full-time homemakers managing extended family.",
          "1) Structural: estate, insurance and investment planning are handled by separate, uncoordinated advisors. 2) Personal: no single secure place for assets, policies and documents, whoever in the household manages them. 3) Personal: early health warning signs are noticed but not tracked systematically; digitising sensitive asset and health data feels risky without a clear data-sovereignty commitment.",
          "Estate and succession confusion, coverage gaps discovered too late, and health issues left unmonitored until they become serious.",
          "A financial advisor's periodic PDF report, a folder of insurance papers at home, and an annual health check-up with nothing tracked in between."
        ],
        [
          "50-60",
          "Pre-retirement professionals, business owners handing over to the next generation, semi-retired consultants, and homemakers whose children are now independent — attention shifting from accumulation to protection, health and legacy for every one of them.",
          "Senior leadership roles, business ownership/succession, semi-retired professionals, homemakers entering an empty-nest stage.",
          "1) Structural: will-writing, nominee updates and legacy planning are treated as one-time events, not maintained. 2) Personal: documents families would need in an emergency are scattered across homes, banks and lawyers. 3) Personal: health tracking is inconsistent just as risk starts rising; this group is the least likely to trust a will or health record to any app without an explicit, plain-language privacy guarantee.",
          "Family disputes or delays over undocumented assets, and health conditions that go unmanaged until they become acute.",
          "A physical folder or safe of paper documents and an annual meeting with a lawyer or chartered accountant, kept offline specifically because nothing digital has earned their trust."
        ],
        [
          "60 and above",
          "Retired or semi-retired individuals in a grandparent life stage — former employees, founders and lifelong homemakers alike — prioritising health monitoring, family connection and making information accessible to the next generation.",
          "Retired professionals and business owners across all prior sectors, some active as advisors or board members, lifelong homemakers now grandparents.",
          "1) Structural: digital health and finance tools assume tech fluency this group often doesn't have. 2) Personal: medication, health metrics and key documents are tracked manually or not at all. 3) Personal: family members lack visibility into what to do in an emergency; fear of data misuse (scams, targeted marketing) is a top reason this group avoids digitising sensitive information.",
          "Preventable health complications from inconsistent monitoring, and family crises during emergencies caused by inaccessible information.",
          "Paper records kept at home, with an adult child periodically checking in and manually tracking things on the user's behalf, largely because no digital tool has earned enough trust to replace paper."
        ]
      ]
    },
    {
      "kind": "heading",
      "text": "PART B — COMPETITOR MAPPING"
    },
    {
      "kind": "table",
      "header": [
        "Competitor",
        "Primary Target Customer",
        "Pricing Model & Approx. Price Point",
        "How Buyers Discover Them",
        "Strongest Features & USPs",
        "Weaknesses",
        "Market Gaps We Can Exploit",
        "Their Innovations That Threaten Us"
      ],
      "rows": [
        [
          "Notion (as a DIY life-OS)",
          "Self-directed knowledge workers building their own trackers.",
          "Freemium; paid plans ~$8-15/user/month.",
          "Word of mouth, YouTube/creator templates, workplace adoption.",
          "Infinite flexibility, strong community-made templates, familiar to knowledge workers.",
          "Requires manual setup and discipline; no AI coaching, no automatic tracking, no hardware; habit consistency depends entirely on the user.",
          "We win on 'zero-setup, AI-guided' — a ready-made, personalised, data-sovereign system versus a blank canvas that most users abandon within weeks.",
          "Notion AI and expanding automation could narrow the personalisation gap if they add structured life-planning templates natively."
        ],
        [
          "Fabulous (habit-coaching app)",
          "Consumers seeking guided habit and routine building.",
          "Freemium; premium ~$40-100/year.",
          "App store featured placement, influencer marketing, behavioural-science branding.",
          "Strong behavioural-science-backed onboarding, motivating routine journeys, polished UX.",
          "Habit-only scope; no finance, career or relationship integration; no cross-life-area view of progress.",
          "We win by connecting habit formation to tangible outcomes across finance, career and relationships, not habits in isolation.",
          "Any move by Fabulous into broader life-goal tracking would directly encroach on our core wedge."
        ],
        [
          "Whoop (wearable + coaching app)",
          "Fitness-focused consumers and athletes, increasingly executives.",
          "Hardware ~$200-300 + subscription ~$30/month.",
          "Athlete endorsements, fitness communities, corporate wellness partnerships.",
          "Best-in-class biometric tracking and recovery coaching; strong hardware credibility.",
          "Health/fitness-only; no finance, career, relationship or journaling integration; subscription cost is a barrier for mass-market India/GCC/SEA buyers.",
          "We can position our future hardware companion as 'Whoop plus your whole life, on your terms,' combining broader scope with an explicit data-sovereignty promise Whoop doesn't make.",
          "If Whoop expands into broader wellbeing/coaching content, it directly threatens our planned hardware differentiation."
        ],
        [
          "BetterUp (career/executive coaching platform)",
          "Enterprises buying coaching benefits for managers and executives.",
          "Enterprise B2B2C license; typically $150-300+/employee/year.",
          "Enterprise HR/L&D procurement, analyst reports (Gartner), sales-led enterprise deals.",
          "Human-coach-backed career and leadership development, strong enterprise trust and outcomes data.",
          "Human-coach model is expensive and hard to scale; no daily habit, finance or personal-life integration; enterprise-only, no consumer self-serve tier — and no relevance to non-employed users like homemakers or retirees.",
          "We win with an always-on, affordable, AI-native alternative that covers whole-life goals for anyone, employed or not, not just career coaching for employees.",
          "If BetterUp adds AI-coach tiers at lower price points, it could compress our enterprise wellness pricing power."
        ],
        [
          "INDmoney / Walnut-type fintech apps",
          "Consumers wanting a consolidated financial view.",
          "Freemium; premium ~₹1,000-3,000/year or advisory fee-based.",
          "App store rankings, fintech influencer content, referral programmes.",
          "Strong bank/investment aggregation via Account Aggregator, clean financial dashboards.",
          "Finance-only scope; no career, health, relationship or habit tracking; monetises via cross-selling financial products, which can create trust friction.",
          "We win by using finance as one pillar among five rather than the product itself, and by explicitly not cross-selling financial products or targeting ads off the linked data — directly addressing the trust friction these apps create.",
          "Deeper AI-driven financial coaching from these apps could pull our finance-focused segment away if we under-invest in that module."
        ],
        [
          "Headspace / Calm (mental wellness apps)",
          "Consumers and enterprises seeking meditation and stress relief.",
          "Freemium; premium ~$70/year; enterprise per-employee licensing.",
          "App store features, celebrity content partnerships, employer wellness bundles.",
          "High-quality guided content library, strong brand trust, broad enterprise distribution.",
          "Content-consumption model with no goal-linked planning, no finance/career integration, and no real progress tracking beyond streaks.",
          "We win by turning passive content consumption into active, tracked progress tied to the user's actual life goals.",
          "If they add structured goal-tracking or AI journaling, they could erode our Journal and mental-wellness overlap."
        ]
      ]
    }
  ],
  "pricing": [
    {
      "kind": "heading",
      "text": "LIFE BLUEPRINT — FEATURES & PRICING"
    },
    {
      "kind": "heading",
      "text": "PART A — CURRENT FEATURES VS MARKET STANDARD"
    },
    {
      "kind": "table",
      "header": [
        "Feature Area",
        "Market Standard (what most products offer)",
        "Our Product (Have / Roadmap / Gap)",
        "Summary — Ahead / At Par / Gap"
      ],
      "rows": [
        [
          "Habit & goal tracking",
          "Streak counters, reminders, basic progress bars (Fabulous, Streaks, Habitica).",
          "Have",
          "At par on tracking; ahead on linking habits directly to Vision/Goals and cross-life-area impact."
        ],
        [
          "Journaling & reflection",
          "Free-text or prompted daily journaling with mood tagging (Day One, Reflectly).",
          "Have",
          "At par on capture; ahead on deriving insights (gratitude themes, energy drivers) automatically."
        ],
        [
          "Calendar / task planning",
          "To-do lists, calendar sync, Eisenhower/kanban views (Todoist, TickTick).",
          "Have",
          "At par on core planning views; ahead once AI planner auto-suggests time blocks from goals + habits (roadmap for full 'AI Planner OS')."
        ],
        [
          "Financial aggregation",
          "Bank/investment account linking, cash flow and net worth views (INDmoney, Walnut, Mint).",
          "Have",
          "At par with best-in-class fintech aggregators for India/GCC; gap on brokerage-grade investment analytics some pure fintech apps offer."
        ],
        [
          "Health & fitness tracking",
          "Manual food/water logging, workout plans, biometric charts (MyFitnessPal, Whoop app).",
          "Have (software) / Roadmap (hardware)",
          "At par on manual tracking; gap until the wearable ships to match automatic biometric capture leaders like Whoop."
        ],
        [
          "Career development",
          "Course recommendations, generic career paths (LinkedIn Learning).",
          "Have",
          "Ahead — SWOT analysis and roadmap tied to DISC profile and personal goals is not offered by generic learning platforms."
        ],
        [
          "Personality-based personalisation (DISC etc.)",
          "One-time personality quiz results shown once, rarely reused (Crystal, 16Personalities).",
          "Have",
          "Ahead — DISC output actively drives course, community and coaching recommendations across modules, not a static report."
        ],
        [
          "Relationship / people management",
          "Basic contact books with birthday reminders (any phone contacts app).",
          "Have",
          "Ahead — relationship health scoring and reach-out prompts tied to contact rhythm go beyond a simple reminder."
        ],
        [
          "Secure document vault",
          "Single-category storage (e.g. only insurance, or only passwords) (Bitwarden, insurer apps).",
          "Have",
          "Ahead — one vault spanning finances, assets, benefits, legal and family documents is broader than any single-category competitor."
        ],
        [
          "Community / peer support",
          "Public or semi-public forums tied to one topic (fitness or finance only) (Strava, Reddit finance subs).",
          "Have",
          "At par — anonymous posting exists; gap on moderation tooling and community depth versus mature single-topic communities."
        ],
        [
          "Data sovereignty & privacy architecture",
          "Standard privacy policy and consent checkboxes; most competitors monetise usage/behavioural data via advertising or cross-selling (finance and wellness apps especially).",
          "Have",
          "Ahead — no competitor in this comparison set offers an explicit no-ad-targeting guarantee, metadata-only AI processing, and user-owned/exportable data as a stated product feature, not just legal boilerplate."
        ],
        [
          "AI-driven cross-life insights",
          "Not offered — every competitor is single-domain, so no cross-pillar AI insight exists in the market.",
          "Roadmap",
          "Ahead once shipped — this is the category-defining gap no competitor currently fills; execution risk is the main variable."
        ],
        [
          "Wearable + ambient AI companion hardware",
          "Fitness-only wearables (Whoop) or note-taking-only devices (Neo Sapien) — never combined with a life-management app.",
          "Roadmap",
          "Ahead once shipped — no competitor combines a wearable, an ambient AI companion and a full life-management app; currently the biggest gap to close."
        ],
        [
          "Enterprise/B2B admin & reporting",
          "Mature admin consoles and analytics for HR/benefits buyers (BetterUp, Headspace for Work).",
          "Gap",
          "Gap — no B2B2C admin layer exists yet; needed only if/when an enterprise wellness channel is pursued."
        ]
      ]
    },
    {
      "kind": "table",
      "header": null,
      "rows": [
        [
          "Where we are ahead",
          "Cross-life-area integration, DISC-driven personalisation across every module, relationship-health scoring, a single all-domain Vault, and an explicit data sovereignty guarantee (no ad-targeting, metadata-only AI, user data ownership) — none of which any single-domain competitor offers today."
        ],
        [
          "Where we are at par",
          "Core mechanics within each domain (habit tracking, journaling, calendar/tasks, financial aggregation, community) match category leaders feature-for-feature."
        ],
        [
          "Gaps that will cost us deals",
          "No wearable/hardware companion yet (Whoop-class competitors win on biometric automation), no enterprise admin/reporting layer (blocks any B2B2C wellness-benefit deals), and community moderation depth trails mature single-topic communities."
        ]
      ]
    },
    {
      "kind": "heading",
      "text": "PART B — CURRENT PRICING MARKET"
    },
    {
      "kind": "table",
      "header": [
        "Item",
        "Detail"
      ],
      "rows": [
        [
          "Standard pricing models in this category",
          "Freemium with a paid subscription tier (monthly/annual) is the dominant model across habit, journaling, wellness and fintech-aggregation apps; hardware players (Whoop) bundle a subscription with an upfront or leased device."
        ],
        [
          "India price range (entry / mid / enterprise)",
          "Global headline pricing: freemium up to a $10/month (~$120/year) premium software tier, applied globally as the ceiling price; India and GCC list at the same $10/month cap but with PPP-adjusted local promotional pricing at launch (e.g. introductory ~$5-6/month in India) to drive volume before stepping up to the full $10/month cap."
        ],
        [
          "GCC price range (entry / mid / enterprise)",
          "GCC price range: full $10/month (~AED 37/month) cap supportable at launch given higher disposable income and GCC family offices' willingness to pay for provable data-privacy/AI value; India starts at a discounted introductory price (~$5-6/month, ~Rs 400-500/month) ramping to the full $10/month cap by Year 2-3 as AI insights and the data sovereignty audit are proven."
        ],
        [
          "How competitors categorise features across pricing plans",
          "Free tiers typically cap history (e.g. 7-30 days of data), limit AI/insight features, and cap the number of linked accounts or tracked habits — and often carry ads to monetise the free tier; premium tiers unlock full history, AI insights, and multi-account/family features; enterprise tiers add admin dashboards, aggregate reporting and dedicated support."
        ],
        [
          "What to charge now / at 6 months / at 18 months — and why",
          "Now (launch): Free tier remains ad-free with core Journal/Calendar/Habit tracking; premium software tier launches at a discounted introductory price (~$5-6/month) to seed volume via the GTM channels in Sheet 8. At 6-12 months: step premium pricing up toward the full $10/month (~$120/year) global cap once AI cross-life insights are live, since that is the differentiated value worth charging full price for. At 18 months (hardware launch): introduce a hardware companion as its own subscription add-on at a further $10/month (~$120/year), stacking to a combined $20/month (~$240/year) for software+hardware bundle subscribers, financing the device largely through the recurring fee rather than a large upfront hardware price."
        ],
        [
          "One pricing risk to watch",
          "Two risks to watch: (1) underpricing the AI/insight layer early anchors user expectations too low, making the later step-up to the full $10/month cap harder to justify without a visible, communicated jump in value; (2) bundling hardware as a second $10/month subscription depends on the device's own bill-of-materials and support costs staying low enough that the recurring fee actually covers device subsidy plus service margin - a device that is too expensive to build would break this pricing model and require either a higher fee or an upfront hardware charge instead."
        ]
      ]
    },
    {
      "kind": "heading",
      "text": "PART C — POSITIONING"
    },
    {
      "kind": "table",
      "header": [
        "Item",
        "Detail"
      ],
      "rows": [
        [
          "Our single most defensible position right now",
          "The only life-management product that connects career, finance, health and relationships into one AI-guided plan, on a data-sovereign foundation — every competitor is either single-domain, or bundles life data into an ad-monetised or cross-sell business model."
        ],
        [
          "2-3 customer segments to prioritise this year and why",
          "1) 30-40 Builders & Stabilisers — highest complexity and willingness to pay, fastest to see cross-pillar value, and most sensitive to trusting an app with linked bank data. 2) 20-30 Early Builders — most receptive to new apps and habit formation, builds the long-term user base and data moat early, and is a privacy-aware generation that responds well to a no-ad-targeting promise. 3) Founders/self-employed across age brackets — underserved by both corporate wellness tools and personal finance apps, a clear white space."
        ],
        [
          "The one competitor to displace most aggressively and how",
          "Notion (as a DIY life-OS) — displace it by winning the 'zero-setup, AI-guided, data-sovereign' users who start a Notion life-dashboard, abandon it within weeks, and would convert instantly to a ready-made, personalised alternative they can trust with sensitive data."
        ],
        [
          "What to stop doing or saying that is diluting our position",
          "Stop describing the product primarily as a 'habit tracker' or 'wellness app' in marketing — both categories are crowded and undersell both the cross-life-area integration and the data sovereignty guarantee that are the actual differentiators."
        ],
        [
          "Recommended GTM motion for Year 1",
          "Product-led growth (PLG): a strong, genuinely ad-free free tier plus a referral loop (family/household invites), supported by targeted content marketing to the 20-30 and 30-40 brackets that leads with 'your data works for you, not advertisers'; layer in a small B2B2C wellness-benefit pilot with 1-2 mid-size employers only after the consumer product and AI insights are proven."
        ]
      ]
    },
    {
      "kind": "heading",
      "text": "PART D — VALUE PROPOSITIONS & IMPROVEMENTS"
    },
    {
      "kind": "table",
      "header": [
        "Item",
        "Detail"
      ],
      "rows": [
        [
          "Current Value Proposition",
          "Concrete Suggestion to Sharpen or Expand It"
        ],
        [
          "The only product integrating all life areas in one place.",
          "Add a single visible 'Life Alignment Score' on the dashboard as the flagship proof point of integration, so the value is felt in one glance rather than inferred from using many modules."
        ],
        [
          "Closed-loop system: plan, habit suggestion, consistency tracking, progress measurement.",
          "Make the loop visible as a literal on-screen journey/progress ring per goal, so users see the mechanism working, not just its outputs."
        ],
        [
          "Software + hardware combination (wearable + AI audio companion).",
          "Publish a public hardware roadmap page with an approximate timeline and a waitlist, converting today's software users into tomorrow's hardware buyers and gathering demand signal early."
        ],
        [
          "Personality-driven personalisation via DISC.",
          "Surface DISC-driven 'why this was suggested' explanations next to every AI recommendation, turning a one-time quiz into a constantly-referenced trust signal."
        ],
        [
          "Data sovereignty: your data works for you, never for advertisers.",
          "Add a visible, real-time 'Privacy Ledger' in-app showing exactly what data was used for which recommendation (always metadata, never raw personal content, never shared externally) — turning a policy statement into something the user can see and verify for themselves."
        ]
      ]
    }
  ],
  "roadmap": [
    {
      "kind": "heading",
      "text": "LIFE BLUEPRINT — PRODUCT ROADMAP"
    },
    {
      "kind": "heading",
      "text": "IMMEDIATE (0-3 MONTHS) — Stop losing deals we should be winning"
    },
    {
      "kind": "table",
      "header": [
        "What It Is",
        "Why It Matters",
        "Customer Segment It Unlocks"
      ],
      "rows": [
        [
          "Independent data sovereignty audit/certification (e.g. SOC 2 / ISO 27001) and a published transparency report.",
          "Data sovereignty is currently a stated policy, not a proven one; sceptical, high-net-worth and older users won't trust Vault or Finance features without third-party proof.",
          "40-50, 50-60 and 60+ brackets, and any BFSI/insurance partnership conversation."
        ],
        [
          "In-app 'Privacy Ledger' showing exactly what data (always metadata, never raw content) was used for each AI recommendation.",
          "Turns the data sovereignty promise from a claim into something the user can see and verify, directly addressing the single biggest adoption objection in older and finance-heavy segments.",
          "30-40 through 60+ brackets, especially first-time bank-linking and Vault setup moments."
        ],
        [
          "Simplified, low-friction UX mode (larger text, fewer steps per screen, guided setup) for the Vault and Health onboarding flows.",
          "50+ and 60+ users have the strongest need for Vault and health tracking but the lowest tolerance for a feature-dense interface; this is currently the biggest reason this segment stays on paper.",
          "50-60 and 60+ brackets, and adult children setting up accounts on a parent's behalf."
        ],
        [
          "Regional data residency infrastructure actually deployed for India, GCC, UK, US and EU (not just policy).",
          "The data sovereignty USP is only as credible as the infrastructure behind it; without real regional hosting, the claim can't be substantiated in any market outside the first one launched.",
          "All GCC, UK, US and EU segments — required before any serious geographic expansion."
        ],
        [
          "Community moderation tooling (reporting, auto-flagging of harmful posts, moderator dashboard).",
          "Community is currently at par with, not ahead of, single-topic competitors; without moderation depth, an anonymous-posting feature is a liability, not a differentiator, at scale.",
          "20-30 and 30-40 brackets, who are the heaviest likely community users."
        ]
      ]
    },
    {
      "kind": "heading",
      "text": "SHORT-TERM (3-6 MONTHS) — Expand addressable market / move up-market"
    },
    {
      "kind": "table",
      "header": [
        "What It Is",
        "Why It Matters",
        "Customer Segment It Unlocks"
      ],
      "rows": [
        [
          "Full cross-life-area AI Summary and AI Planner OS (Dashboard AI Summary, Calendar suggested time blocks, goal allocation, habit time slots working together end-to-end).",
          "This is the category-defining, closed-loop feature that no competitor offers today; right now the individual pieces exist but the unified experience does not, which undersells the core USP.",
          "All age brackets, but especially 30-40 (highest cross-pillar complexity) and 20-30 (habit-formation years)."
        ],
        [
          "Light B2B2C enterprise admin and aggregate reporting layer (anonymised engagement dashboards for HR buyers).",
          "Opens the corporate wellness channel identified as a top-priority industry use case; without it, no enterprise pilot can be sold even though the underlying product already fits the need.",
          "Corporate Wellness / HR Benefits buyers, unlocking the 20-30 and 30-40 employee base at scale."
        ],
        [
          "Family/household multi-user plan with shared or delegated Vault access (e.g. adult child managing a parent's Vault with permissioned access).",
          "Directly matches the buying pattern already seen in the 50+ and 60+ brackets, where an adult child is often the actual buyer/setter-up; without this, that motion is unsupported by the product.",
          "50-60 and 60+ brackets, and their adult children as co-users."
        ],
        [
          "Brokerage-grade investment analytics and portfolio optimisation insight in the Finance module.",
          "Closes the one clearly identified gap versus pure-play fintech aggregators (INDmoney/Walnut), removing the last reason a finance-focused user would need a second app.",
          "30-40 and 40-50 brackets with growing investment portfolios."
        ],
        [
          "Published, plain-language data sovereignty commitments per partner integration (Account Aggregator, insurance, EdTech) before each goes live.",
          "As partnerships scale, each new data-sharing integration is a fresh trust test; a repeatable, transparent commitment process protects the core differentiator as the partner ecosystem grows.",
          "All brackets interacting with Finance AA flow, Vault, or partner-sourced content."
        ]
      ]
    },
    {
      "kind": "heading",
      "text": "MEDIUM-TERM (6-18 MONTHS) — Long-term competitive moat"
    },
    {
      "kind": "table",
      "header": [
        "What It Is",
        "Why It Matters",
        "Customer Segment It Unlocks"
      ],
      "rows": [
        [
          "Wearable fitness/health tracker (Whoop-class), fully integrated with the Health module.",
          "Closes the biometric-automation gap versus Whoop and matches the product's own stated software+hardware USP; without it, the hardware differentiation remains theoretical.",
          "All brackets, with strongest early pull from 20-30 and 30-40 fitness-conscious users."
        ],
        [
          "Always-on AI audio companion device (ambient, non-screen reflection and reminder prompts), processing on-device/metadata-first to preserve data sovereignty by design.",
          "This is the single most defensible, hardest-to-copy differentiator in the entire product, and the natural next step for 50+ and 60+ users who need an assisted, non-screen interface.",
          "50-60 and 60+ brackets primarily, with a secondary halo effect across all ages as a category-first product."
        ],
        [
          "Full enterprise wellness admin console with ROI reporting (cost-per-active-user, utilisation, outcome trends) for HR/Finance buyers.",
          "Moves the corporate wellness channel from pilot to scaled revenue line, addressing the exact reporting need Finance/Payroll teams flagged as their renewal justification requirement.",
          "Corporate Wellness / HR Benefits buyers at enterprise scale."
        ],
        [
          "Deep localisation (language, currency, region-specific financial and legal content) for GCC, UK, US and EU markets.",
          "Pricing and product-market fit research shows meaningfully different needs and price sensitivity per region; without localisation, expansion beyond India stays superficial.",
          "GCC, UK, US and Europe segments across all age brackets."
        ],
        [
          "Third-party-certified, continuously-monitored data sovereignty programme (recurring audits, public status page, bug-bounty for data-handling issues).",
          "Converts an initial certification (Immediate horizon) into an ongoing, provable guarantee — the strongest possible long-term moat against competitors who cannot make the same claim about their ad-supported or cross-sell business models.",
          "All brackets, and a decisive factor for any future BFSI, insurance or enterprise partnership at scale."
        ]
      ]
    }
  ],
  "gtm": [
    {
      "kind": "heading",
      "text": "LIFE BLUEPRINT — GO-TO-MARKET (GTM) STRATEGY"
    },
    {
      "kind": "note",
      "text": "GTM is built around low-CAC, trust-based distribution (communities, celebrity equity association, universities) layered with conventional digital marketing and on-ground activation, rather than paid acquisition alone. Figures below are illustrative planning assumptions, not confirmed commitments from any named individual or organisation."
    },
    {
      "kind": "heading",
      "text": "PART A — GTM PILLARS OVERVIEW"
    },
    {
      "kind": "table",
      "header": [
        "Pillar",
        "What It Is",
        "Why It Lowers CAC / Builds Trust"
      ],
      "rows": [
        [
          "Community partnerships (JITO and similar trade/affinity networks)",
          "Distribution through existing, high-trust community networks (e.g. JITO — Jain International Trade Organisation) rather than cold paid acquisition.",
          "Communities like JITO already have internal trust, events, and communication channels; an endorsed or co-branded rollout converts far better than a cold ad, and costs a fraction of equivalent paid reach."
        ],
        [
          "Celebrity & influencer co-branding (including equity-for-association)",
          "Grade-A celebrity association (illustrative profile: figures with the reach and life-relevant credibility of a Virat Kohli or Anushka Sharma) traded partly for equity rather than pure cash fees, plus a tier of mid-size wellness/finance/productivity influencers on standard fees.",
          "Equity-based association preserves cash runway while giving a global audience an instantly recognisable, trusted face for a product about personal wellbeing — and aligns the celebrity's long-term incentive with the company's success rather than a one-off endorsement."
        ],
        [
          "University freemium channel",
          "Free premium-tier access for verified students at partner universities, positioning Life Blueprint as the tool students use to build career, financial and wellbeing habits from day one of adult life.",
          "Universities are dense, low-cost-to-reach, high-word-of-mouth populations exactly matching the 20-30 'Early Builders' target group; freemium removes the price barrier for a segment with limited disposable income today but high lifetime value later."
        ],
        [
          "Digital marketing (paid + organic)",
          "Performance marketing (search, social, app-store optimisation) plus organic content built around the data sovereignty and life-integration story.",
          "Standard, measurable acquisition channel that scales predictably once messaging and unit economics are proven by the lower-cost channels above; used to fill the funnel beyond what community/celebrity/university channels reach organically."
        ],
        [
          "On-ground activations & events",
          "Presence at wellness expos, fintech/consumer-tech conferences, JITO conventions, university fests, and co-branded celebrity appearances/launch events.",
          "Face-to-face activation converts skeptical, privacy-conscious users (especially 40+ segments) far better than a digital ad alone, and generates shareable content that feeds the digital channel."
        ]
      ]
    },
    {
      "kind": "heading",
      "text": "PART B — COMMUNITY PARTNERSHIPS (JITO AND SIMILAR NETWORKS)"
    },
    {
      "kind": "table",
      "header": [
        "Community / Network",
        "Approx. Reach",
        "Partnership Model",
        "Expected Onboarding Impact (Year 1)"
      ],
      "rows": [
        [
          "JITO (Jain International Trade Organisation)",
          "250,000+ members globally across trade, professional and youth wings (JITO Yuva, JITO Angel Network), with strong India, GCC and diaspora (UK/US) presence.",
          "Co-branded wellbeing/financial-literacy sessions at JITO chapter events; a dedicated JITO community offer (extended premium trial); potential JITO Angel Network introductions as part of the fundraise itself, given the founder's existing standing in the community.",
          "Illustrative 3-5% of addressable members engaging via chapter events and word-of-mouth in Year 1 — roughly 8,000-12,000 signups, concentrated in India, UK and GCC diaspora chapters."
        ],
        [
          "Other trade/professional and alumni networks (e.g. industry bodies, professional associations, existing Lockated/GoPhygital client and partner network)",
          "Founder's existing PropTech/B2B network plus adjacent trade and professional bodies across India and GCC.",
          "Leverage existing client and partner relationships for warm introductions, co-branded webinars, and B2B2C-style bulk premium offers to member businesses' employees.",
          "Illustrative 2,000-5,000 signups in Year 1 from warm-network activation, at near-zero incremental marketing cost."
        ],
        [
          "Wellness, fintech and startup community groups (India, GCC, global)",
          "Aggregated reach across relevant online/offline interest communities (wellness meetups, personal-finance communities, founder/operator networks).",
          "Sponsored community AMAs, partnership content, and community-exclusive early-access codes.",
          "Illustrative 3,000-6,000 signups in Year 1, primarily digital-native early adopters who also drive organic word-of-mouth."
        ]
      ]
    },
    {
      "kind": "heading",
      "text": "PART C — CELEBRITY & INFLUENCER CO-BRANDING (INCLUDING EQUITY-FOR-ASSOCIATION)"
    },
    {
      "kind": "note",
      "text": "Named individuals below are illustrative reference profiles for the calibre and audience type being targeted, not confirmed engagements. Any actual celebrity association would need direct negotiation, legal agreement, and category exclusivity review."
    },
    {
      "kind": "table",
      "header": [
        "Community / Network",
        "Approx. Reach",
        "Partnership Model",
        "Expected Onboarding Impact (Year 1)"
      ],
      "rows": [
        [
          "Tier",
          "Illustrative Profile",
          "Structure",
          "Rationale / Expected Impact"
        ],
        [
          "Grade-A celebrity anchor (1 primary association)",
          "A single globally recognised figure with a large, trusted, life-relevant following — illustrative profile: a sports icon (e.g. Virat Kohli) or a actor with an established wellness/lifestyle brand (e.g. Anushka Sharma) — someone whose personal brand already signals discipline, balance or wellbeing.",
          "Primarily equity-based association (a small founder/company equity grant plus a modest cash component) in exchange for co-branded campaign content, social amplification, and a launch-event appearance, rather than a large upfront cash endorsement fee.",
          "A single Grade-A figure with 50-100M+ combined social following can plausibly drive an illustrative 100,000-250,000 app installs during a concentrated launch campaign window, at a fraction of the cash cost of an equivalent paid-media campaign of that reach — and lends instant category credibility that money alone cannot buy."
        ],
        [
          "Mid-tier wellness/finance/productivity influencers (10-20 creators)",
          "Established creators in fitness, personal finance, productivity and mental-wellness niches across India, GCC, UK and US, each with 100K-2M followers.",
          "Standard performance-based influencer deals (flat fee plus affiliate/referral incentive tied to premium conversions) rather than equity, given the smaller individual reach and higher negotiating leverage the company retains at this tier.",
          "Illustrative 20,000-50,000 signups in Year 1 across the cohort, with strong performance-tracking data (referral codes) to identify which niches convert best for future budget allocation."
        ],
        [
          "Category-specific co-branding (e.g. a fitness or finance brand crossover)",
          "A single co-branded campaign or limited-edition feature with an adjacent, non-competing consumer brand (e.g. a fitness apparel or personal-finance brand) to cross-pollinate audiences.",
          "Revenue-share or cross-promotion arrangement (mutual audience access) rather than a cash payment in either direction.",
          "Illustrative 5,000-15,000 signups per campaign, plus brand-credibility halo from association with an established consumer name."
        ]
      ]
    },
    {
      "kind": "heading",
      "text": "PART D — DIGITAL MARKETING & ON-GROUND ACTIVATIONS"
    },
    {
      "kind": "table",
      "header": [
        "Pillar",
        "What It Is",
        "Why It Lowers CAC / Builds Trust"
      ],
      "rows": [
        [
          "Channel",
          "Approach",
          "Role in the Funnel"
        ],
        [
          "Performance marketing (paid social, search, app-store optimisation)",
          "Targeted campaigns by age bracket and life role (career-hook creative for 20-30, household-finance-hook for homemakers, legacy-hook for 50+), using the data sovereignty message as a core creative angle.",
          "Fills the funnel beyond community/celebrity/university reach; the most measurable, budget-elastic channel, scaled up or down based on proven unit economics from the lower-cost channels first."
        ],
        [
          "Organic content & thought leadership",
          "Founder-led content (leveraging the existing personal-brand strategy and LinkedIn content calendar already in motion) plus in-app content marketing around the 'AI life OS' and data sovereignty narrative.",
          "Builds durable, compounding organic reach and category-definition credibility ahead of a Series A, at near-zero marginal cost per additional view."
        ],
        [
          "On-ground activations: wellness expos, fintech/consumer-tech conferences",
          "Booths, demo stations and speaking slots at relevant India/GCC/UK/US wellness, fintech and consumer-AI events.",
          "Converts skeptical or privacy-conscious segments (especially 40+ users) far better than digital ads alone, and generates authentic photo/video content for the digital channel."
        ],
        [
          "JITO conventions & community events",
          "Sponsored presence and speaking slots at JITO chapter conventions and youth-wing (JITO Yuva) events globally.",
          "Directly activates the community-partnership channel (Part B) with a physical, high-trust touchpoint rather than a purely digital ask."
        ],
        [
          "University fests & campus activations",
          "On-campus stalls, hackathon/wellness-challenge sponsorships, and career-fair presence at partner universities.",
          "Directly activates the university freemium channel (Part E) with in-person credibility and peer-to-peer word-of-mouth."
        ],
        [
          "Celebrity launch event",
          "A single flagship co-branded launch event (physical + livestreamed) featuring the Grade-A celebrity anchor.",
          "Concentrates press coverage, social amplification and app-store featuring opportunities into one high-leverage moment rather than spreading celebrity involvement thin."
        ]
      ]
    },
    {
      "kind": "heading",
      "text": "PART E — UNIVERSITY FREEMIUM CHANNEL"
    },
    {
      "kind": "table",
      "header": null,
      "rows": [
        [
          "Model",
          "Verified students at partner universities get full premium access (Finance, Health, Vault, AI insights) free for the duration of their enrolment (or a defined multi-year period), converting to a paid plan post-graduation with a loyalty discount."
        ],
        [
          "Target partner profile",
          "Business schools, engineering colleges and general universities across India, GCC and the UK/US with active career-services and student-wellness offices — natural distribution partners since the product's Career and Health modules map directly onto their own student-support mandate."
        ],
        [
          "Year 1 target",
          "Illustrative 20-30 university partnerships (India-heavy initially, given founder network, with 2-3 GCC/UK anchor universities), reaching an illustrative 15,000-25,000 student signups assuming 10-15% opt-in from partner student bodies."
        ],
        [
          "Why it matters beyond Year 1 signups",
          "Builds brand affinity with the 20-30 'Early Builders' TG at the exact life stage the product's own priority framework identifies as career-led — students who adopt the habit-and-goal-tracking behaviour early are structurally more likely to convert to paid Finance/Health/Vault tiers as their career and income mature, making this a long-duration customer-acquisition investment, not just a Year 1 vanity metric."
        ]
      ]
    },
    {
      "kind": "heading",
      "text": "PART F — GTM-DRIVEN ONBOARDING PROJECTIONS (YEAR 1-3)"
    },
    {
      "kind": "note",
      "text": "Illustrative planning assumptions. 'GTM-accelerated' reflects the combined effect of community, celebrity, university and event channels described above, layered on top of a conventional digital-marketing-only baseline. These are the download/signup figures carried into the detailed financial model (Sheet 12)."
    },
    {
      "kind": "table",
      "header": [
        "Community / Network",
        "Approx. Reach",
        "Partnership Model",
        "Expected Onboarding Impact (Year 1)"
      ],
      "rows": [
        [
          "Channel",
          "Year 1 Signups (Illustrative)",
          "Year 2 Signups (Illustrative)",
          "Year 3 Signups (Illustrative)"
        ],
        [
          "Community partnerships (JITO + other networks, Part B)",
          "15,000-23,000",
          "35,000-50,000",
          "60,000-90,000"
        ],
        [
          "Celebrity & influencer co-branding (Part C)",
          "125,000-315,000",
          "150,000-350,000",
          "180,000-400,000"
        ],
        [
          "University freemium channel (Part E)",
          "15,000-25,000",
          "40,000-70,000",
          "70,000-120,000"
        ],
        [
          "Digital marketing & organic (Part D)",
          "150,000-230,000",
          "500,000-700,000",
          "1,000,000-1,400,000"
        ],
        [
          "On-ground activations & events (Part D)",
          "10,000-15,000",
          "25,000-40,000",
          "50,000-80,000"
        ],
        [
          "Illustrative combined total (mid-point used in Sheet 12 financial model)",
          "~350,000",
          "~1,100,000",
          "~2,800,000"
        ]
      ]
    },
    {
      "kind": "table",
      "header": null,
      "rows": [
        [
          "Impact on the fundraising deck & strategy",
          "This GTM plan materially strengthens the pitch beyond a generic 'huge TAM' claim: it gives investors a named, channel-by-channel user-acquisition thesis (community trust, celebrity equity, campus distribution) with structurally lower blended CAC than a pure paid-acquisition consumer app - directly addressing the top question every consumer-app investor asks first. It also supports a materially higher Year 1-3 user-base narrative in the deck (Sheet 12's financial model now uses the ~350K/~1.1M/~2.8M GTM-accelerated figures rather than a paid-acquisition-only baseline), which in turn supports a stronger valuation conversation for this and future rounds, provided the celebrity/community partnerships are actually secured before or shortly after the raise closes."
        ]
      ]
    },
    {
      "kind": "heading",
      "text": "PART G — DIFFERENTIATION FROM COMPETITORS & HOW THIS DISRUPTS THE CATEGORY"
    },
    {
      "kind": "table",
      "header": [
        "Pillar",
        "What It Is",
        "Why It Lowers CAC / Builds Trust"
      ],
      "rows": [
        [
          "Competitor Benchmarked",
          "Their GTM Model",
          "How Life Blueprint's GTM Disrupts It"
        ],
        [
          "Notion (DIY life-OS)",
          "Pure product-led growth via organic word-of-mouth and workplace adoption; no celebrity, community or university-specific channel strategy.",
          "Community and university channels reach the exact life-stage moment (early career, student life) where a Notion life-dashboard habit would otherwise form from scratch — intercepting that behaviour with a ready-made, celebrity-endorsed alternative before the DIY habit takes hold."
        ],
        [
          "Fabulous / Whoop (paid performance marketing + athlete/creator endorsements)",
          "Heavy reliance on paid digital acquisition and single-domain (fitness) athlete endorsements; high CAC typical of hardware-plus-subscription wellness products.",
          "Equity-for-association with a Grade-A celebrity spanning a broader life narrative (not just fitness) plus trust-based community distribution structurally lowers blended CAC versus a pure paid-media or single-domain-athlete endorsement model."
        ],
        [
          "BetterUp / Headspace for Work (enterprise-led distribution)",
          "Enterprise HR/L&D procurement as the primary distribution channel; consumers only access the product through an employer benefit.",
          "University freemium and community channels build a direct consumer relationship independent of any single employer, reaching homemakers, founders, students and retirees that enterprise-only distribution structurally cannot."
        ],
        [
          "INDmoney / Walnut-type fintech apps (app-store performance marketing)",
          "Standard fintech-app paid acquisition and referral-programme growth, monetised partly via cross-sell of financial products.",
          "Community (JITO) and celebrity association bring a trust premium these apps cannot easily replicate given their cross-sell-dependent business model, directly reinforcing the data sovereignty differentiator at the point of acquisition, not just in the product itself."
        ]
      ]
    },
    {
      "kind": "table",
      "header": null,
      "rows": [
        [
          "The disruption thesis, in one line",
          "Every benchmarked competitor acquires users through paid performance marketing, single-domain athlete/creator endorsement, or enterprise procurement; Life Blueprint's GTM instead leads with trust-based, largely non-cash distribution (community networks, equity-aligned celebrity association, university partnerships), which is structurally harder for an ad-funded or cross-sell-funded competitor to copy without eroding their own margins or business model."
        ]
      ]
    }
  ],
  "vc": [
    {
      "kind": "heading",
      "text": "LIFE BLUEPRINT — INSTITUTIONAL VC & FAMILY OFFICE RESEARCH (GLOBAL)"
    },
    {
      "kind": "note",
      "text": "This is treated as a global product from day one, launchable from any market with customer and investor appetite. Research reflects publicly reported investor activity as of mid-2026 (Tracxn, CB Insights, PitchBook, Inc42, and press coverage). Cheque sizes and theses are directional and change over time — confirm current mandates directly with each investor before outreach."
    },
    {
      "kind": "heading",
      "text": "PART A — INDIA-FOCUSED INVESTOR LANDSCAPE"
    },
    {
      "kind": "table",
      "header": [
        "Investor / Fund",
        "Type",
        "Typical Cheque Size & Stage Focus",
        "Thesis Fit for Life Blueprint",
        "Relevant Portfolio Evidence",
        "Idea/Concept-Stage Likelihood",
        "Why (Reasoning)",
        "Recommended Approach"
      ],
      "rows": [
        [
          "Gruhas / Gruhas Collective Consumer Fund (Nikhil Kamath & Abhijeet Pai)",
          "VC fund (family-founder-led)",
          "$0.5-4M flexible cheque; GCCF closed at ~Rs 100 Cr + Rs 50 Cr green-shoe; invests mainly at Seed, selectively to growth.",
          "Strong — explicit consumer-brand and 'building for long-term impact on human lives' thesis; has backed senior-care, PropTech and consumer-tech; Nikhil Kamath's personal angel book already spans fintech, health and consumer.",
          "67+ investments since 2021 including 1Buy.AI, Nailinit (GCCF pre-seed), Bummer, IPEC; personal angel portfolio (~37 deals via CBI) skews fintech/health/consumer.",
          "Medium",
          "Gruhas has backed pre-seed consumer deals (e.g. Nailinit) through GCCF, so a true idea/concept-stage check with a strong founder story and working beta is plausible, though most cheques land at seed with an initial product live.",
          "Approach via a warm intro through the Gruhas Collective Consumer Fund network or a portfolio founder; lead with the consumer-integration thesis and the founder's existing profitable PropTech track record (Lockated) as a credibility anchor."
        ],
        [
          "Nikhil Kamath (personal angel cheques, outside Gruhas)",
          "Angel investor",
          "Typically co-invests alongside other angels/funds; cheque size varies, often smaller than institutional Gruhas cheques.",
          "Medium-High — personal portfolio explicitly spans fintech, health, consumer and 'long-term value' sectors; publicly supportive of Indian founders taking early bets.",
          "37 angel investments tracked (CB Insights), most recently Rotoris (Seed VC, Dec 2025), alongside health/wellness and fintech names.",
          "Medium",
          "As an individual angel he has more discretion than an institutional fund and has backed very early rounds before, but competes for attention given his profile and volume of inbound pitches.",
          "Best reached through a warm, credible intro (existing portfolio founder, JITO/industry network) rather than a cold pitch; a crisp one-pager emphasising traction-to-date and the data sovereignty differentiator will travel further than a full deck at first touch."
        ],
        [
          "Rainmatter Capital (Nithin Kamath / Zerodha — Nikhil Kamath's brother's fund)",
          "Corporate VC / patient-capital fund",
          "Seed average ~$1.45M, Series A average ~$5.3M; Rs 1,500 Cr+ deployed across 175+ startups since 2016; explicit 'no board seats, no exit clauses' patient-capital model.",
          "High — thesis is explicitly health + fintech convergence ('helping people do better with their money was no longer enough'); has funded Ultrahuman, PeeSafe, FITTR — direct adjacency to Life Blueprint's health + finance + habit integration.",
          "Backed Ultrahuman, FITTR, CRED, Jupiter, Wint Wealth — a portfolio that reads like natural future integration partners.",
          "Medium-High",
          "Rainmatter explicitly funds at Seed with a long-term, mission-driven lens rather than requiring heavy traction proof, and its thesis is an unusually precise match for this product.",
          "Position as a natural adjacency to the existing Ultrahuman/FITTR/CRED portfolio; emphasise patient-capital fit since Rainmatter is explicitly built for a multi-year product build."
        ],
        [
          "Burman Family Holdings (Dabur Family Office)",
          "Family office",
          "$500M+ deployed across sectors; active early-stage investor, healthcare/fintech/branded-consumer focus.",
          "Medium-High — explicit early-stage healthcare and branded-consumer mandate is a good fit; long operating history in consumer wellness (Dabur) gives real domain empathy.",
          "Portfolio includes Isprava, Centricity, Melorra — consumer and healthcare-adjacent early-stage bets.",
          "Medium",
          "Actively backs early-stage ventures and has healthcare/consumer DNA from Dabur's own business, making a concept-to-seed-stage cheque plausible with a credible founder and a working prototype.",
          "Approach with a wellness-and-legacy-brand angle — Dabur's own heritage in health and family wellbeing is a natural narrative bridge to Life Blueprint's health, Vault and legacy-planning modules."
        ],
        [
          "Artha India Ventures (Damani Family Office micro-VC)",
          "Family office / micro-VC",
          "Rs 500 Cr target micro-VC fund; 127 deals, one of the most active seed-stage family-office investors in India.",
          "Medium — sector-agnostic, founder-quality-driven approach; broad consumer-tech portfolio (OYO, Rapido, Purplle) shows willingness to back early, unproven consumer categories.",
          "127 deals including OYO, Rapido, Purplle, Agnikul Cosmos — high deal velocity at seed stage.",
          "Medium-High",
          "Explicitly structured as a high-volume, seed-stage micro-VC willing to make many smaller bets, which suits an idea-to-early-beta stage company better than a large evergreen family office.",
          "Direct pitch approach is viable (Artha is noted as accepting direct founder outreach); lead with founder pedigree, working beta, and a clear path to first paying users."
        ],
        [
          "PremjiInvest (Azim Premji Family Office)",
          "Family office",
          "$15B+ evergreen capital, 165+ investments; cheques of Rs 75-250 Cr typically at growth stage.",
          "Medium — long-term, impact-oriented philosophy and consumer-tech portfolio (Purplle, The Sleep Company) shows comfort with consumer-wellness categories, but cheque size and stage focus skew later.",
          "165+ investments including Zomato, Swiggy, FirstCry, Lenskart at growth stage.",
          "Low",
          "Typical cheque size and growth-stage focus make a true idea-stage or even Seed-stage investment unlikely; more realistic as a Series A/B investor once traction is proven.",
          "Not a near-term target for this raise; keep on a 'future round' watchlist and build a relationship through referral networks well ahead of a Series A conversation."
        ]
      ]
    },
    {
      "kind": "heading",
      "text": "PART B — GLOBAL / SILICON VALLEY & INTERNATIONAL INVESTOR LANDSCAPE"
    },
    {
      "kind": "table",
      "header": [
        "Investor / Fund",
        "Type",
        "Typical Cheque Size & Stage Focus",
        "Thesis Fit for Life Blueprint",
        "Relevant Portfolio Evidence",
        "Idea/Concept-Stage Likelihood",
        "Why (Reasoning)",
        "Recommended Approach"
      ],
      "rows": [
        [
          "Collaborative Fund (Craig Shapiro, New York)",
          "VC fund",
          "$1B+ AUM across flagship funds (latest flagship ~$125M) plus a dedicated pre-seed/seed vehicle (Collab+Sesame); typical early cheque in the low hundreds of thousands to a few million.",
          "Very High — explicit 'for-profit and for-good' thesis across climate, money, food, kids and health; was a seed investor in Whoop and has a long consumer-wellbeing and AI-native portfolio (also runs 'AIR', an accelerator for design-led AI products).",
          "300+ companies backed, ~60 exits; Whoop (seed, 2013), Reddit, Lyft, Sweetgreen, The Farmer's Dog, OLIPOP — a portfolio pattern of category-defining consumer brands with a wellbeing or 'better for people' angle.",
          "Medium-High",
          "Explicitly funds at pre-seed/seed with a mission-alignment-first filter, and has direct experience seed-funding a hardware-plus-coaching wellness company (Whoop) to a $10B+ outcome — one of the closest global thesis matches available.",
          "Lead with the 'for-profit and for-good' framing directly, cite the Whoop parallel explicitly, and apply through Collab+Sesame or the AIR accelerator given the AI-native and design-led-product angle."
        ],
        [
          "NextView Ventures (Boston)",
          "VC fund",
          "Seed-stage specialist; wrote one of Whoop's earliest checks in 2013.",
          "Medium-High — 'everyday, ordinary' consumer-technology thesis, comfortable backing hardware-plus-software wellness bets very early.",
          "Seed investor in Whoop alongside Collaborative Fund and Accomplice.",
          "Medium",
          "Proven early willingness to back a hardware-and-coaching wellness bet from a true seed stage, though the firm's core geography and network are US-centric.",
          "Position the hardware-companion roadmap prominently, drawing the direct Whoop-seed-stage parallel; likely needs a US-based advisor or co-investor to open the door."
        ],
        [
          "OpenAI Startup Fund",
          "Corporate venture fund",
          "Invests alongside OpenAI in early-stage AI-native companies; co-led the funding of Thrive AI Health (Arianna Huffington's AI health-coach venture) alongside Thrive Global.",
          "High thematically, with one caveat — actively funds AI-native personal health/behaviour-change companies, which validates the category, but Thrive AI Health is a close conceptual neighbour (AI health coach) and could be viewed as a portfolio-conflict rather than a clean thesis match.",
          "Thrive AI Health (AI health coach spanning sleep, food, fitness, stress, connection) — very close in spirit to Life Blueprint's Health and Journal modules, though narrower in scope (health-only, not career/finance/relationships/legacy).",
          "Low-Medium",
          "The fund's appetite for AI-native wellbeing companies is proven, but the existing Thrive AI Health investment makes this a harder door to open for a company that could be seen as overlapping; better approached once Life Blueprint's broader, non-health-only integration story is unmistakably differentiated.",
          "If pursued, lead hard with the cross-life-area breadth (career, finance, relationships, legacy — not just health) and the data sovereignty stance as the clear point of difference from Thrive AI Health."
        ],
        [
          "Emerson Collective (Laurene Powell Jobs, Palo Alto)",
          "Family office / impact investor",
          "Historically pre-seed/seed cheques of $100K-$1M for smaller bets, though recent mega-deals (Series B/C) run into hundreds of millions for high-conviction frontier plays; invests across all stages depending on conviction.",
          "Medium-High — explicit impact thesis spanning digital health, fintech and education, structured to blend philanthropy and venture-scale returns; a strong values match for a data-sovereign, wellbeing-first product.",
          "171 investments, 26 exits; digital-health and fintech focus areas align directly with two of Life Blueprint's five pillars.",
          "Medium",
          "Willing to write smaller, earlier cheques historically, and the impact-plus-returns structure is culturally very close to the Kamath-style thesis the founder is targeting, though recent large-check activity suggests growing preference for bigger, later bets.",
          "Approach through the venture team with an explicit impact-and-scale framing (career/finance/health/relationship equity for underserved life stages, not just a consumer app), referencing the digital-health and fintech focus areas directly."
        ],
        [
          "Kapor Capital (Mitch Kapor & Freada Kapor Klein, Oakland)",
          "Impact VC fund",
          "$500K-$1M typical cheque at early stage; ~$10.7M deployed across 19 companies in a recent year.",
          "Medium — 'gap-closing' thesis for underrepresented and lower-income communities in the US is narrower than Life Blueprint's broad occupation-agnostic positioning, but overlaps well specifically where the product serves homemakers, first-generation earners and non-traditional professionals.",
          "170+ portfolio companies including Bitly, Life360, AngelList, spanning education, health, finance and justice.",
          "Low-Medium",
          "Genuinely invests this early and at this cheque size, but the fund's core mandate (closing access gaps for underrepresented US communities) is a narrower fit than most others on this list unless the pitch is reframed around financial and wellbeing access.",
          "Only pursue with a US-specific access/equity framing (e.g. financial literacy and wellbeing tools for underserved communities); not a natural fit for the India/GCC-first go-to-market."
        ],
        [
          "Forerunner Ventures (Kirsten Green, San Francisco)",
          "VC fund",
          "Seed-to-Series-A consumer specialist; has backed category-defining consumer brands from early stage.",
          "Medium — strong consumer-behaviour and brand-building expertise, with health-adjacent portfolio companies (e.g. Hims & Hers), though the thesis is more 'consumer brand builder' than explicitly impact/wellbeing-driven.",
          "Early backer of Glossier, Away, Hims & Hers, Ritual — consumer brands with strong lifestyle and wellbeing positioning.",
          "Low-Medium",
          "Excellent at consumer-brand seed investing generally, but less explicitly mission-driven than Collaborative Fund or Emerson Collective, so the values-fit pitch angle is weaker even though the stage fit is reasonable.",
          "If pursued, lead with product/brand craft and consumer behaviour insight rather than the data-sovereignty/impact framing, which is not this fund's primary lens."
        ],
        [
          "Naval Ravikant (angel investor, Palo Alto)",
          "Angel investor",
          "200+ angel investments historically; typically smaller cheques as part of a syndicate rather than leading rounds.",
          "Medium — not a wellbeing-thesis investor in the formal sense, but his public philosophy (wealth, happiness, self-improvement, 'the most important startup is the self') is unusually aligned with a life-integration product's narrative, and he has backed Notion, a direct adjacent tool in this space.",
          "150-200+ investments including Uber, Notion, Perplexity, Eight Sleep (sleep-tech); still actively writing checks into 2026 (e.g. Quill Notes, Feb 2026).",
          "Medium",
          "Screens primarily on founder quality and clarity of thought rather than sector, and is known to write early, small checks quickly once convinced — a real possibility for a founder who can articulate the philosophical 'why' as sharply as the product 'what'.",
          "Best reached via a warm intro through the AngelList/operator network; lead with the philosophical framing (life integration, self-mastery, data sovereignty as autonomy) since that is what appears to genuinely engage him, more than a standard market-size pitch."
        ],
        [
          "Mubadala Investment Company / Qatar Investment Authority (UAE / Qatar sovereign wealth)",
          "Sovereign wealth fund",
          "Typically late-stage/growth cheques of $100M+ (e.g. joined Whoop's $575M Series G in March 2026); not a seed-stage investor.",
          "Low near-term fit, high long-term relevance — both funds follow category leaders in AI-enabled wellness/health once scale and traction are proven, and both are explicitly building GCC AI/health-tech investment mandates.",
          "Mubadala and QIA both joined Whoop's Series G at a $10.1B valuation; Mubadala was also a strategic investor/customer of BetterUp.",
          "Low (for this raise)",
          "Not realistic for a Seed round, but valuable as a signal: if Life Blueprint reaches category-leadership in the AI-life-management space, this is the type of capital that would plausibly follow at scale, particularly given the product's GCC-inclusive, data-sovereign design.",
          "Not a target for the current $5M raise; note as a long-term aspirational investor for a future growth round once category leadership and GCC traction are demonstrated."
        ]
      ]
    },
    {
      "kind": "heading",
      "text": "PART C — INVESTORS WITH A SIMILAR THESIS TO NIKHIL KAMATH (IMPACT + RETURNS, NOT PURE CAPITALIST)"
    },
    {
      "kind": "note",
      "text": "Nikhil Kamath's own stated approach — long-term value over short-term shortcuts, backing founders 'taking their shot,' and Gruhas's mission to 'build companies that matter' — has real global counterparts. These are the individuals/funds whose public philosophy most closely mirrors that blend of financial ambition and genuine care for human wellbeing."
    },
    {
      "kind": "table",
      "header": [
        "Investor",
        "Geography",
        "Shared Thesis With Kamath's Approach"
      ],
      "rows": [
        [
          "Nikhil Kamath (Gruhas, personal angel)",
          "India",
          "Explicitly backs 'companies that matter,' long-term value over short-term shortcuts, and has personally committed to giving away 50% of his wealth (The Giving Pledge) — capitalism paired with a stated social conscience."
        ],
        [
          "Nithin Kamath (Rainmatter)",
          "India",
          "Runs Rainmatter as patient, no-board-seat, no-exit-clause capital explicitly to 'give forward' toward Indians being healthier — a near-identical framing to the Life Blueprint mission, from within the same family's broader ecosystem."
        ],
        [
          "Craig Shapiro (Collaborative Fund)",
          "United States (New York)",
          "Built an entire fund around the idea that the best entrepreneurs increasingly want to solve real problems, not just chase a pure profit motive — the clearest global institutional parallel to Kamath's stated philosophy on this list."
        ],
        [
          "Arianna Huffington (Thrive Global / Thrive AI Health, with OpenAI Startup Fund)",
          "United States",
          "Reoriented an entire second career around the idea that burnout is not the price of success, and is now building AI-driven tools explicitly to make wellbeing accessible at scale — a founder-operator with the same 'technology should serve human flourishing' conviction, albeit as a builder/co-investor rather than a pure fund."
        ],
        [
          "Laurene Powell Jobs (Emerson Collective)",
          "United States (Palo Alto)",
          "Deliberately blends philanthropy and venture capital on the belief that the two shouldn't be separated — 'venture-scale returns' alongside genuine societal impact, structurally similar to how Kamath frames Gruhas's mission."
        ],
        [
          "Naval Ravikant (angel)",
          "United States (Palo Alto)",
          "Publicly reframes wealth-building as inseparable from personal happiness, consciousness and self-mastery — not identical to Kamath's giving-focused philosophy, but the same instinct that a good life is the actual point, and capital is a means to it, not the end."
        ]
      ]
    },
    {
      "kind": "heading",
      "text": "PART D — OVERALL LIKELIHOOD ASSESSMENT — INVESTING AT THE IDEA / CONCEPT STAGE"
    },
    {
      "kind": "table",
      "header": null,
      "rows": [
        [
          "Institutional VC funds, India (Gruhas, Rainmatter, PremjiInvest)",
          "Low-Medium overall — most institutional funds, even thesis-driven ones like Rainmatter, prefer at least a founding team with a live (even rough) product and some early usage signal before committing. Rainmatter and Gruhas are the most likely to flex this given their explicit early-stage, mission-driven and patient-capital mandates."
        ],
        [
          "Family offices, India (Burman, Artha)",
          "Medium overall — family offices, especially micro-VC-style ones like Artha, are structurally more willing to back a founder and a concept where the founder has a credible track record, which directly favours this specific situation given the existing profitable Lockated business."
        ],
        [
          "Global thesis-fit funds (Collaborative Fund, NextView Ventures, Emerson Collective)",
          "Medium overall — these are genuinely early-stage, mission-aligned investors, but a first-time approach from a non-US, non-network founder typically needs a warm introduction or a US-based advisor to get real traction, which adds time even where the thesis fit is strong."
        ],
        [
          "Global angels with an aligned philosophy (Naval Ravikant and similar)",
          "Medium — angels screen on founder clarity and conviction more than traction, and can move fast once convinced, but access itself (getting the meeting) is the bottleneck rather than their willingness to back an early concept."
        ],
        [
          "GCC family offices / sovereign wealth",
          "Medium for family offices (with a longer relationship-building runway), Low for sovereign wealth funds like Mubadala/QIA at this stage — the latter follow proven category leaders rather than fund ideas."
        ],
        [
          "Overall verdict for this specific venture",
          "The single biggest lever raising the odds above a 'typical' idea-stage founder, anywhere in the world, is that this is not a first-time entrepreneur pitching a slide deck — it is an existing profitable operator (GoPhygital/Lockated, ~Rs 5 Cr ARR, 60 employees) with an in-house technical team already building a beta, pitching a natural extension of proven B2B SaaS/PropTech execution capability into a global B2C product. Combined with a genuinely close thesis match to a specific, identifiable set of global investors (Collaborative Fund, Rainmatter, Emerson Collective) who have each proven they will back exactly this kind of impact-plus-returns bet early, this converts the ask from 'fund an idea' to 'fund an experienced operator's next venture, already in build, in a category these specific investors already believe in.'"
        ]
      ]
    }
  ],
  "fundraise": [
    {
      "kind": "heading",
      "text": "LIFE BLUEPRINT — FUNDRAISE STRATEGY ($5M RAISE, GLOBAL)"
    },
    {
      "kind": "note",
      "text": "Life Blueprint is treated as a global product, launchable from any market with customer and investor appetite — not an India-only raise. The investor mix below deliberately blends India-based and global (US/GCC) capital rather than defaulting to a single geography."
    },
    {
      "kind": "heading",
      "text": "PART A — ROUND STRUCTURING & SIZING"
    },
    {
      "kind": "table",
      "header": [
        "Item",
        "Recommendation"
      ],
      "rows": [
        [
          "How a $5M ask compares to typical rounds",
          "A $5M ask is large for a true pre-seed (India AI pre-seed medians run ~$1.3-2M per recent Crunchbase/Bot Memo data) and more typical of a full Seed or Seed+ round with a working product and initial usage data. Given the beta build is already underway and the founder has an existing profitable operating business, positioning this as a 'Seed' round (not pre-seed/idea-stage) backed by an unusually derisked founder profile is the credible framing."
        ],
        [
          "Recommended structure",
          "Raise in two tranches inside the same round rather than a single $5M close: Tranche 1 (~$1.5-2M) to complete the software build, ship the AI cross-life insights layer, and acquire the first 25-50K users with real engagement data; Tranche 2 (~$3-3.5M) released on hitting agreed usage/retention milestones, to fund AI Planner OS completion, the hardware R&D initiation, and GCC expansion prep."
        ],
        [
          "Why tranche it",
          "Tranching de-risks the round for investors uncomfortable with a $5M idea-stage cheque, while still letting the company message a '$5M raise' externally; it also protects the founder from over-diluting before the product proves cross-life-area engagement, which is the core thesis investors are underwriting."
        ],
        [
          "Suggested instrument",
          "A priced equity round (post-beta, pre-revenue) is more defensible than a SAFE/CCD at this size given the existing operating business provides real valuation anchors (ARR, team, IP); alternatively, a CCPS (compulsorily convertible preference shares) structure, common with Indian family offices (as seen in the Bummer/Gruhas deal), keeps the round flexible for a mixed VC + family office investor base."
        ],
        [
          "Runway this buys",
          "At an estimated monthly burn of ~$150-180K once the full team and AI/hosting costs are running (see Sheet 11 projections), $5M funds approximately 24-28 months of runway — enough to reach the AI Planner OS launch, initial hardware prototype validation, and a first meaningful India user base and revenue line before the next round."
        ]
      ]
    },
    {
      "kind": "heading",
      "text": "PART B — TARGET INVESTOR MIX FOR THE $5M ROUND (GLOBAL BLEND)"
    },
    {
      "kind": "table",
      "header": [
        "Investor Category",
        "Target Cheque Size",
        "Indicative # of Investors",
        "Rationale"
      ],
      "rows": [
        [
          "Thesis-fit India institutional VC (Rainmatter-style, Gruhas Collective Consumer Fund)",
          "$0.5-1.5M",
          "1-2",
          "Anchors the round with a name that validates the health+fintech+consumer integration thesis to every other investor in the mix; Rainmatter's patient-capital, no-board-seat structure is unusually founder-friendly for a first institutional check."
        ],
        [
          "Global thesis-fit VC (Collaborative Fund, NextView Ventures, or Emerson Collective)",
          "$0.5-1.5M",
          "1",
          "Brings a global-category-defining name with direct experience seed-funding a hardware-plus-coaching wellness bet (Whoop) to a multi-billion-dollar outcome, plus instant international credibility for GCC/UK/US expansion conversations."
        ],
        [
          "Family offices, India and global (Burman, Artha, or Emerson Collective/Kapor Capital angle)",
          "$0.5-1M each",
          "2-3",
          "Provides patient, founder-aligned capital and domain credibility (Dabur's wellness heritage, Artha's high-velocity seed activity, or Emerson Collective's impact-plus-returns structure) without the governance overhead a larger fund might require this early."
        ],
        [
          "Strategic/operator angels (ex-Zerodha/fintech, ex-wellness-app operators, Silicon Valley angel syndicates)",
          "$50-150K each",
          "8-12",
          "Brings hands-on product, growth and India-GCC-US distribution expertise; angel checks of this size are easier to close quickly and build early momentum/social proof for the larger cheques. Naval Ravikant-style philosophy-aligned angels are a good fit for this bucket."
        ],
        [
          "GCC family office or advisor (early relationship, smaller cheque or co-invest right)",
          "$250-750K",
          "1",
          "Seeds the GCC relationship and regional data-residency credibility ahead of the planned GCC expansion, even if the primary cheque is small at this stage."
        ],
        [
          "Founder / existing business",
          "$300-500K (self-funded top-up)",
          "1",
          "Signals conviction to every external investor and reduces the external round size needed to hit the same runway target, strengthening negotiating position on valuation."
        ]
      ]
    },
    {
      "kind": "heading",
      "text": "PART C — PITCH POSITIONING BY INVESTOR TYPE (INDIA + GLOBAL)"
    },
    {
      "kind": "table",
      "header": [
        "Investor Type",
        "Positioning Angle",
        "Key Proof Points to Lead With"
      ],
      "rows": [
        [
          "India institutional VCs (Rainmatter, Gruhas)",
          "Category-defining platform play: the first company to integrate career, finance, health and relationships under one AI-guided, data-sovereign roof — a genuine white space no single-domain competitor can credibly enter without cannibalising their own business model.",
          "Founder's existing profitable operating business (Lockated) as an execution-risk mitigant; feature architecture and beta build already in motion; explicit thesis overlap with the investor's own portfolio (e.g. Ultrahuman, FITTR for Rainmatter)."
        ],
        [
          "Global impact-thesis VCs (Collaborative Fund, Emerson Collective)",
          "The same 'for-profit and for-good' category-defining opportunity, framed globally: a genuine white space between wellness, finance, career and legacy planning that no single-domain player (Whoop, BetterUp, Notion) can credibly enter — with an explicit data-sovereignty stance that mirrors these investors' own impact-and-trust-driven values.",
          "Direct Whoop-seed-stage parallel for Collaborative Fund (hardware+coaching wellness bet scaling to $10B+); digital-health and fintech thesis alignment for Emerson Collective; founder's operating track record as an execution-risk mitigant."
        ],
        [
          "Family offices, India and global (Burman, Artha, Sekhsaria, Emerson Collective, Kapor Capital)",
          "Long-term, patient-capital compounding story: a product built for decades of a user's life, mirroring the multi-generational thinking family offices already apply to their own wealth — plus a Vault/legacy module that speaks directly to family-office sensibilities around succession and continuity.",
          "Data sovereignty and Vault/legal-document features as a natural analogue to the family office's own trust-and-legacy mandate; founder's 15 years of entrepreneurship and existing profitable business as a track-record anchor."
        ],
        [
          "GCC family offices",
          "Regionally-relevant, sovereignty-first AI health-and-wealth platform aligned with national digital-health and AI priorities (Vision 2030 / UAE Centennial 2071), with regional data residency built in from day one rather than retrofitted.",
          "Explicit no-ad-targeting and metadata-only AI processing commitments, framed as directly answering the 'trust' requirement regional reports identify as the fastest way to win GCC family-office confidence; GCC-inclusive product design from the outset."
        ],
        [
          "Strategic/operator angels, global (Naval Ravikant-style philosophy-aligned angels)",
          "Insider's-eye opportunity: a chance to shape a product in a category they know intimately (fintech, wellness, coaching, personal productivity tools like Notion) at the earliest, cheapest entry point, with direct input into the roadmap.",
          "Specific, named product gaps versus tools they already use daily (Notion, Whoop, INDmoney) that this product is built to close; the philosophical framing (life integration, self-mastery, data sovereignty as autonomy) that resonates with this investor archetype specifically."
        ]
      ]
    },
    {
      "kind": "heading",
      "text": "PART D — MARKET GAP & COMPARABLE BUSINESS RESEARCH"
    },
    {
      "kind": "table",
      "header": [
        "Investor Category",
        "Target Cheque Size",
        "Indicative # of Investors",
        "Rationale"
      ],
      "rows": [
        [
          "Comparable",
          "Funding Signal",
          "What It Proves",
          "Gap We Fill"
        ],
        [
          "Whoop (wearable + AI coaching)",
          "Raised ~$979M over 11 rounds since a 2013 seed (NextView Ventures, Collab Fund, Accomplice); reached a $10.1B valuation in March 2026 with Mubadala and Qatar Investment Authority joining the Series G.",
          "A hardware-plus-AI-coaching wellness category can scale from a modest seed check to a double-digit-billion valuation, and sovereign wealth capital (GCC) follows category leaders once proven.",
          "Whoop is health/fitness-only; Life Blueprint's software+hardware combination spans career, finance, health and relationships — a structurally larger addressable use-case per user than a fitness-only wearable."
        ],
        [
          "BetterUp (AI/human coaching platform)",
          "Raised $628M over 8 rounds since a 2015 seed (Vista Venture Partners), reaching a ~$4.7-5B valuation by 2021-2024, backed by Lightspeed, Iconiq, Wellington, and Mubadala as a strategic investor/customer.",
          "Enterprise-distributed personal-growth and coaching products command premium valuations when they can prove measurable outcomes for large employers.",
          "BetterUp is enterprise-only and human-coach-dependent, with no reach into non-employed users (homemakers, retirees, founders); Life Blueprint is B2C-first and AI-native, reaching the same coaching outcome at consumer pricing and consumer scale."
        ],
        [
          "Ultrahuman / FITTR (Rainmatter portfolio, India wellness)",
          "Backed by Rainmatter at Seed as part of an explicit 'health is a megatrend' thesis, alongside CRED and Jupiter in fintech — demonstrating Indian investor appetite for both wellness and fintech-adjacent consumer products.",
          "Indian investors are already comfortable backing consumer wellness and fintech-adjacent products individually and are actively looking for the next thesis-fit bet in this space.",
          "Neither product bridges health and finance under one profile; Life Blueprint is positioned as the natural next step in the same investor thesis, integrating rather than sitting alongside these single-domain portfolio bets."
        ],
        [
          "No direct 'life-integration' competitor has raised institutional capital to date",
          "Search across VC/family-office portfolios (Gruhas, Rainmatter, PremjiInvest, Artha, Burman) turns up strong bets in single-domain wellness, fintech and coaching, but no funded company combining career, finance, health, relationships and legacy planning into one AI-guided, data-sovereign product.",
          "This is a genuine, provable white space rather than a crowded category with an unclear angle — the gap itself is investable evidence, not just a founder claim.",
          "Life Blueprint is first-to-market with the integration thesis, with a defensible data sovereignty position that ad-supported or cross-sell-monetised single-domain competitors structurally cannot copy without abandoning their existing business model."
        ]
      ]
    },
    {
      "kind": "heading",
      "text": "PART E — KEY PITCH NOTES & TALKING POINTS"
    },
    {
      "kind": "note",
      "text": "Pitch Notes & Talking Points"
    },
    {
      "kind": "note",
      "text": "• Lead with the founder's existing track record (15 years of entrepreneurship, profitable ~Rs 5 Cr ARR PropTech business, 60-person team) - this is an operator raising to build a second product line, not a first-time founder pitching a slide."
    },
    {
      "kind": "note",
      "text": "• Frame the ask as a Seed round with a de-risked beta build already in motion, not an idea-stage speculative bet - the architecture (253 features across 13 modules) is fully scoped and in active development."
    },
    {
      "kind": "note",
      "text": "• Anchor the market opportunity in named, provable gaps: no competitor (Whoop, BetterUp, Notion, INDmoney, Headspace) combines all five life pillars, and none offers a genuine data sovereignty guarantee - cite the specific competitor weaknesses from the Market Analysis and Features & Pricing sheets."
    },
    {
      "kind": "note",
      "text": "• Use data sovereignty as the headline differentiator specifically with family offices and GCC investors, where trust and legacy-mindedness are cultural strengths, not just a compliance checkbox."
    },
    {
      "kind": "note",
      "text": "• Show the hardware roadmap (wearable + AI audio companion) as a category-first ambition, but be explicit that the raise funds software traction and hardware R&D validation, not a full hardware manufacturing run - this manages investor expectations on capital efficiency."
    },
    {
      "kind": "note",
      "text": "• Reference the Whoop and BetterUp funding trajectories as proof that this category can scale from a modest seed check to a multi-billion-dollar outcome, and that sovereign wealth capital (Mubadala, QIA) follows category leaders once traction is proven - a credible 'why this could get big' argument."
    },
    {
      "kind": "note",
      "text": "• Be upfront about the pre-launch stage and no paying users yet; compensate with the founder's track record, the scoped build, and a clear, milestone-gated tranche structure that gives investors confidence capital will be deployed against proof points, not burned speculatively."
    },
    {
      "kind": "note",
      "text": "• Position this explicitly as a global product from day one, not an India export story - the founder is open to launching from whichever market (India, GCC, UK, US) shows the strongest early customer and investor pull, which widens the credible investor pool to include global impact-thesis funds like Collaborative Fund and Emerson Collective, not just India-focused capital."
    },
    {
      "kind": "note",
      "text": "• When pitching global investors, lead with the specific parallel closest to their own portfolio - the Whoop seed-to-$10B trajectory for Collaborative Fund/NextView Ventures, the digital-health/fintech impact thesis for Emerson Collective - rather than a generic 'huge global market' claim."
    }
  ],
  "deck": [
    {
      "kind": "heading",
      "text": "LIFE BLUEPRINT — FUNDRAISE DECK BRIEF & BUSINESS PLAN SNAPSHOT (GLOBAL)"
    },
    {
      "kind": "note",
      "text": "Life Blueprint is pitched as a global product from day one — launch geography is chosen based on where customer and investor appetite is strongest (India, GCC, UK or US), not fixed to a single home market."
    },
    {
      "kind": "heading",
      "text": "PART A — WHY NOW (MARKET TIMING)"
    },
    {
      "kind": "table",
      "header": [
        "Timing Factor",
        "Why It Matters Now"
      ],
      "rows": [
        [
          "AI capital supercycle",
          "AI companies raised roughly $270B globally in 2025, over half of all VC funding that year — the first time any single technology category has crossed 50% of global VC dollars; seed-stage AI 'agents and companions' alone drew ~$700M in 2025, showing investors are actively hunting for the next consumer AI-companion category before it consolidates."
        ],
        [
          "India's domestic capital shift",
          "Foreign portfolio investors pulled roughly $18-28B out of Indian equities between late 2024 and mid-2026, pushing Indian family offices and domestic funds (Gruhas, Rainmatter, Artha, Burman) to the forefront as the more reliable source of early-stage capital."
        ],
        [
          "GCC family offices actively shifting toward VC-style, AI-first bets",
          "GCC family offices are moving from passive wealth preservation to active early-stage tech investing, with explicit government-driven priority on AI and health-tech (Saudi Vision 2030, UAE Centennial 2071) and an unusually strong emphasis on provable data-privacy compliance as the fastest trust-builder."
        ],
        [
          "Rising ad-tracking fatigue / data-privacy backlash",
          "Growing global scrutiny of ad-driven personal data models makes a genuine no-ad-targeting, metadata-only AI, data-sovereign product an increasingly persuasive and timely differentiator."
        ],
        [
          "Category proof points already established by adjacent players",
          "Whoop's rise to a $10.1B valuation (March 2026) and BetterUp's ~$4.7-5B valuation prove AI-and-hardware-enabled personal wellbeing categories can scale to outsized outcomes — but neither owns the cross-life-area integration this product is built around."
        ],
        [
          "Global, thesis-fit capital already exists and is identifiable",
          "Investors like Collaborative Fund (seed-funded Whoop), Emerson Collective, and Rainmatter Capital have each publicly proven they will back exactly this style of impact-plus-returns bet early (see Sheet 10)."
        ],
        [
          "A named, low-CAC GTM engine is already mapped",
          "The community, celebrity-equity, and university GTM channels (Sheet 8) give this raise a distribution thesis most consumer-AI seed pitches lack at this stage — timing the raise to close before these partnerships are locked in maximises investor conviction."
        ],
        [
          "Founder timing",
          "The founder's existing profitable operating business, in-house technical team, and already-scoped 253-feature architecture mean the company can move from raise to shipped product faster than a typical first-time founder starting from zero."
        ]
      ]
    },
    {
      "kind": "heading",
      "text": "PART B — FUNDRAISE DECK: SLIDE-BY-SLIDE BRIEF"
    },
    {
      "kind": "table",
      "header": [
        "Slide #",
        "Slide Title",
        "Key Talking Points",
        "Suggested Visual"
      ],
      "rows": [
        [
          "1",
          "Cover",
          "Life Blueprint — the AI life companion that brings your career, finance, health and relationships into one plan. Founder name, one-line positioning, 'Raising $5M Seed'.",
          "Clean logo + tagline; minimal text."
        ],
        [
          "2",
          "The Problem",
          "Life management tools exist in silos; the planning-to-action gap means most people never turn goals into consistent daily behaviour; existing apps monetise personal data via ads or cross-selling, creating a trust barrier exactly where trust matters most (finance, health, legal documents).",
          "Simple 'fragmented icons vs. one platform' before/after visual."
        ],
        [
          "3",
          "The Solution",
          "One AI-guided plan spanning Vision/Goals, Career, Finance, Health, Relationships and a secure Vault, with a closed loop: plan -> AI-suggested habits -> consistency tracking -> progress measurement, built on a data-sovereign foundation from day one.",
          "Product screenshot or simplified app-flow diagram."
        ],
        [
          "4",
          "Product Walkthrough",
          "Live or screenshot walkthrough of the Dashboard, Blueprint, Journal, Finance snapshot, Health targets, and Vault — showing the cross-module linkage, not each module in isolation.",
          "3-4 annotated product screenshots in sequence."
        ],
        [
          "5",
          "Data Sovereignty — The Trust Layer",
          "Explicit commitments: data is never sold or used for ad-targeting; AI personalisation runs on metadata, not personal content; users own and can export/delete their data; regional data residency for India, GCC, UK, US and EU.",
          "'Privacy Ledger' concept mockup or a simple 'what we never do' checklist graphic."
        ],
        [
          "6",
          "Market Size & Timing",
          "TAM framed as every adult managing a life across India, GCC, Southeast Asia, UK, US and Europe, occupation-agnostic; timing tailwinds from Part A.",
          "TAM/SAM/SOM funnel graphic with the age-bracket segmentation underneath."
        ],
        [
          "7",
          "Business Model & Pricing",
          "Freemium consumer app (ad-free even on the free tier) stepping up to a $10/month (~$120/year) global premium software cap covering Finance, Health and Vault; a hardware companion subscription adds a further $10/month once launched, stacking to $20/month combined; a later B2B2C enterprise-wellness channel.",
          "Simple pricing-tier comparison table."
        ],
        [
          "8",
          "Go-to-Market",
          "Low-CAC distribution through community partnerships (JITO and similar networks), Grade-A celebrity co-branding (including equity-for-association), university freemium access, layered with conventional digital marketing and on-ground activations — full detail in Sheet 8.",
          "GTM funnel diagram showing channel mix and blended CAC advantage."
        ],
        [
          "9",
          "Traction & Milestones",
          "Beta-stage software build in progress across all 13 modules (253 features scoped); founder's existing profitable PropTech business (~Rs 5 Cr ARR, 60 employees) as an execution-credibility anchor; transparent that there are no paying users yet.",
          "Simple roadmap/timeline graphic showing 'today' clearly marked."
        ],
        [
          "10",
          "Competitive Landscape & Disruption",
          "Positioning map: single-domain competitors (Notion, Fabulous, Whoop, BetterUp, INDmoney/Walnut, Headspace) each own one life pillar and acquire users through paid media, single-domain endorsement, or enterprise procurement; Life Blueprint disrupts this with integration breadth, data sovereignty, and a structurally lower-CAC GTM model (Sheet 8, Part G).",
          "2x2 or radar positioning chart (breadth of integration vs. data trust)."
        ],
        [
          "11",
          "Product & Hardware Roadmap",
          "Immediate: data sovereignty audit/certification, Privacy Ledger, simplified UX for 50+ users. Short-term: full AI Planner OS, light enterprise admin layer. Medium-term: wearable + AI audio companion hardware (subscription-led, +$10/month), full enterprise console, deep localisation.",
          "3-horizon roadmap timeline (0-3 / 3-6 / 6-18 months)."
        ],
        [
          "12",
          "Team",
          "Founder background (15 years of entrepreneurship, current Founder & CEO of a profitable ~60-person PropTech/SaaS business), plus any named co-founders/key hires.",
          "Founder photo + 2-3 line bio; org-chart snippet if key hires are named."
        ],
        [
          "13",
          "Financial Projections",
          "3-year detailed projection: GTM-driven user growth, premium and hardware conversion, revenue by line, COGS, OPEX, and path toward profitability (see Part C for the full P&L).",
          "Revenue/OPEX bar chart plus an EBITDA line over 3 years."
        ],
        [
          "14",
          "The Ask",
          "Raising $5M Seed, structured in two tranches (~$1.5-2M now, ~$3-3.5M on milestone achievement); use of funds breakdown; target investor mix blends India-based (Rainmatter, Gruhas, Artha, Burman) and global thesis-fit capital (Collaborative Fund, Emerson Collective, GCC family offices, philosophy-aligned angels).",
          "Use-of-funds pie/donut chart (see Part D)."
        ],
        [
          "15",
          "Closing / Vision",
          "The BHAG: becoming the AI operating system people use to manage their entire life, on their own terms, with their data always working for them and never against them.",
          "Single strong visual + tagline; contact details."
        ]
      ]
    },
    {
      "kind": "heading",
      "text": "PART C — DETAILED FINANCIAL PROJECTIONS (GTM-DRIVEN, 3-YEAR, ILLUSTRATIVE)"
    },
    {
      "kind": "note",
      "text": "Illustrative planning assumptions only, not a certified forecast. Blue figures are editable assumptions; black figures are calculated with formulas and recalculate automatically if assumptions change. All amounts in USD. Download figures use the GTM-accelerated case from Sheet 8, Part F (mid-point of the combined-channel range). Software premium price ramps toward the $10/month (~$120/year) global cap; hardware subscription launches in Year 3 at a further $10/month (~$120/year) add-on, per the pricing strategy in Sheet 5."
    },
    {
      "kind": "table",
      "header": [
        "Slide #",
        "Slide Title",
        "Key Talking Points",
        "Suggested Visual"
      ],
      "rows": [
        [
          "Metric",
          "Year 1",
          "Year 2",
          "Year 3"
        ]
      ]
    },
    {
      "kind": "note",
      "text": "C1. User Funnel"
    },
    {
      "kind": "table",
      "header": [
        "Slide #",
        "Slide Title",
        "Key Talking Points",
        "Suggested Visual"
      ],
      "rows": [
        [
          "App downloads / signups, cumulative (GTM-accelerated, Sheet 8)",
          "350,000",
          "1,100,000",
          "2,800,000"
        ],
        [
          "Free-to-premium (software) conversion rate",
          "3%",
          "5%",
          "7%"
        ],
        [
          "Premium software subscribers (end of year)",
          "10,500",
          "55,000",
          "196,000"
        ],
        [
          "Hardware attach rate (% of premium subscribers, launches Year 3)",
          "0%",
          "0%",
          "15%"
        ],
        [
          "Hardware subscribers (end of year)",
          "0",
          "0",
          "29,400"
        ]
      ]
    },
    {
      "kind": "note",
      "text": "C2. Revenue"
    },
    {
      "kind": "table",
      "header": [
        "Slide #",
        "Slide Title",
        "Key Talking Points",
        "Suggested Visual"
      ],
      "rows": [
        [
          "Software ARPU, $/year (ramping to the $10/month = $120/year global cap)",
          "$60",
          "$96",
          "$120"
        ],
        [
          "Hardware subscription ARPU, $/year (launches Year 3, $10/month = $120/year add-on)",
          "$0",
          "$0",
          "$120"
        ],
        [
          "Enterprise / B2B2C pilot revenue ($)",
          "$0",
          "$150,000",
          "$600,000"
        ],
        [
          "Software subscription revenue ($)",
          "$630,000",
          "$5,280,000",
          "$23,520,000"
        ],
        [
          "Hardware subscription revenue ($)",
          "$0",
          "$0",
          "$3,528,000"
        ],
        [
          "Total revenue ($)",
          "$630,000",
          "$5,430,000",
          "$27,648,000"
        ]
      ]
    },
    {
      "kind": "note",
      "text": "C3. Cost of Goods Sold (COGS)"
    },
    {
      "kind": "table",
      "header": [
        "Slide #",
        "Slide Title",
        "Key Talking Points",
        "Suggested Visual"
      ],
      "rows": [
        [
          "AI / cloud infrastructure cost ($)",
          "$150,000",
          "$500,000",
          "$1,400,000"
        ],
        [
          "Hardware device subsidy cost ($, recognised when device ships, Year 3)",
          "$0",
          "$0",
          "$2,058,000"
        ],
        [
          "Total COGS ($)",
          "$150,000",
          "$500,000",
          "$3,458,000"
        ],
        [
          "Gross profit ($)",
          "$480,000",
          "$4,930,000",
          "$24,190,000"
        ]
      ]
    },
    {
      "kind": "note",
      "text": "C4. Operating Expenses (OPEX)"
    },
    {
      "kind": "table",
      "header": [
        "Slide #",
        "Slide Title",
        "Key Talking Points",
        "Suggested Visual"
      ],
      "rows": [
        [
          "Team & operations cost ($)",
          "$1,200,000",
          "$2,600,000",
          "$3,800,000"
        ],
        [
          "Marketing & GTM cost ($ — community, celebrity, university, digital, events; Sheet 8)",
          "$900,000",
          "$1,600,000",
          "$2,200,000"
        ],
        [
          "Hardware R&D cost ($)",
          "$150,000",
          "$500,000",
          "$700,000"
        ],
        [
          "Data sovereignty compliance & certification cost ($)",
          "$80,000",
          "$120,000",
          "$180,000"
        ],
        [
          "G&A / other cost ($)",
          "$200,000",
          "$350,000",
          "$550,000"
        ],
        [
          "Total OPEX ($)",
          "$2,530,000",
          "$5,170,000",
          "$7,430,000"
        ]
      ]
    },
    {
      "kind": "note",
      "text": "C5. EBITDA / Net Burn"
    },
    {
      "kind": "table",
      "header": [
        "Slide #",
        "Slide Title",
        "Key Talking Points",
        "Suggested Visual"
      ],
      "rows": [
        [
          "EBITDA / (Net burn) ($)",
          "($2,050,000)",
          "($240,000)",
          "$16,760,000"
        ]
      ]
    },
    {
      "kind": "note",
      "text": "Cumulative burn across Year 1-2 against the $5M raise leaves a working buffer for contingency and the next fundraise; the Year 3 swing to positive EBITDA is driven primarily by the hardware subscription attach rate and software ARPU reaching the full $10/month cap — both are execution-dependent, not guaranteed, and should be treated as an upside case in investor conversations rather than a base-case promise."
    },
    {
      "kind": "heading",
      "text": "PART D — USE OF FUNDS ($5M)"
    },
    {
      "kind": "table",
      "header": [
        "Slide #",
        "Slide Title",
        "Key Talking Points",
        "Suggested Visual"
      ],
      "rows": [
        [
          "Category",
          "% of Raise",
          "Amount ($)",
          "Rationale"
        ],
        [
          "Product & AI engineering (software team, AI Planner OS, cross-life insights)",
          "30%",
          "$1,500,000",
          "Largest single allocation — completes the closed-loop AI experience that is the core investment thesis."
        ],
        [
          "Go-to-market (community partnerships, celebrity/influencer co-branding cash component, university programme, digital marketing, on-ground activations)",
          "20%",
          "$1,000,000",
          "Funds the low-CAC, multi-channel distribution engine in Sheet 8 — note that celebrity association is structured partly as equity rather than cash, which is what keeps this allocation efficient relative to the download volumes it targets."
        ],
        [
          "Hardware R&D (wearable + AI audio companion validation, not full manufacturing)",
          "15%",
          "$750,000",
          "Funds prototype validation and vendor evaluation to de-risk the hardware roadmap without committing to a full production run this round."
        ],
        [
          "Team hiring (engineering, AI/data science, growth, customer success, trust & security)",
          "20%",
          "$1,000,000",
          "Builds out the org needed to ship the roadmap and support the Trust & Security function underpinning the data sovereignty guarantee."
        ],
        [
          "Data sovereignty certification & compliance (audit, regional data residency infrastructure)",
          "5%",
          "$250,000",
          "Converts the data sovereignty policy into an independently verifiable, provable guarantee — a direct response to the top adoption barrier identified across Sheets 3, 4 and 6."
        ],
        [
          "Working capital & contingency",
          "10%",
          "$500,000",
          "Standard buffer for unplanned costs, including any celebrity/community partnership legal and production costs not otherwise budgeted."
        ]
      ]
    },
    {
      "kind": "table",
      "header": [
        "Total",
        "100%",
        "$5,000,000"
      ],
      "rows": []
    }
  ]
};
