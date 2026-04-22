import React, { useState } from "react";
import {
  BookOpen,
  CheckCircle2,
  HelpCircle,
  Clock,
  Lightbulb,
  MessageSquare,
  Play,
  Send,
  Video,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AdminViewEmulation } from "@/components/AdminViewEmulation";

type Tutorial = {
  id: string;
  title: string;
  duration: string;
  description: string;
  thumbClass: string;
  thumbLabel?: string;
};

const VIDEO_TUTORIALS: Tutorial[] = [
  {
    id: "1",
    title: "How to set Priorities (English)",
    duration: "6 min",
    description:
      "How to select what to prioritize using the Wheel of Life and Eisenhower Matrix.",
    thumbClass:
      "bg-gradient-to-br from-neutral-400 via-neutral-500 to-neutral-700",
    thumbLabel: "Quadrant 3: DELEGATE",
  },
  {
    id: "2",
    title: "How to set Priorities (Hindi)",
    duration: "6 min",
    description:
      "Priorities और Eisenhower Matrix का उपयोग करके सही फोकस चुनना सीखें।",
    thumbClass:
      "bg-gradient-to-br from-orange-300 via-orange-400 to-orange-600",
    thumbLabel: "प्राथमिकताएँ",
  },
];

function TutorialVideoCard({ item }: { item: Tutorial }) {
  return (
    <Card className="overflow-hidden rounded-2xl border border-[#DA7756]/20 bg-[#DA7756]/10 shadow-sm transition-shadow hover:shadow-md">
      <div
        className={cn(
          "relative aspect-video w-full overflow-hidden",
          item.thumbClass
        )}
      >
        {item.thumbLabel && (
          <div className="absolute inset-0 flex items-center justify-center p-4">
            <span className="text-center text-sm font-bold uppercase tracking-wide text-white/90 drop-shadow-md sm:text-base">
              {item.thumbLabel}
            </span>
          </div>
        )}
        <button
          type="button"
          className={cn(
            "absolute left-1/2 top-1/2 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center",
            "rounded-full bg-white/95 shadow-lg transition-transform hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#DA7756]/40"
          )}
          aria-label={`Play ${item.title}`}
        >
          <Play
            className="ml-0.5 h-7 w-7 fill-[#DA7756] text-[#DA7756]"
            strokeWidth={0}
          />
        </button>
      </div>
      <div className="space-y-3 p-4 sm:p-5">
        <h3 className="text-base font-bold leading-snug text-neutral-900 sm:text-lg">
          {item.title}
        </h3>
        <div className="flex flex-wrap items-center gap-3">
          <span className="rounded-full bg-sky-100 px-2.5 py-0.5 text-xs font-semibold text-sky-800">
            Tutorial
          </span>
          <span className="flex items-center gap-1 text-xs text-neutral-500">
            <Clock className="h-3.5 w-3.5" strokeWidth={2} />
            {item.duration}
          </span>
        </div>
        <p className="text-sm leading-relaxed text-neutral-600 line-clamp-2">
          {item.description}
        </p>
      </div>
    </Card>
  );
}

type GuideEntry = {
  id: string;
  title: string;
  tips: string[];
  bestPractices: string[];
};

const GUIDE_SECTIONS: GuideEntry[] = [
  {
    id: "dashboard",
    title: "Getting Started with Your Dashboard",
    tips: [
      "Review your KPI status tiles first — they summarize where you stand at a glance.",
      "Submit your daily report before end of day so your streak and leaderboard stay accurate.",
      "Use the Pending Tasks section so nothing slips through between meetings.",
    ],
    bestPractices: [
      "Log in at a consistent time each morning to build a quick review habit.",
      "Address red or yellow KPIs before adding new priorities.",
      "Keep the dashboard your single source of truth for daily focus.",
    ],
  },
  {
    id: "daily-report",
    title: "How to Fill Your Daily Report",
    tips: [
      "Capture concrete accomplishments, not just activity — outcomes matter more than hours logged.",
      "Rate your day honestly on a 1–10 scale; patterns help your manager support you.",
      "Note one clear focus for tomorrow so your next session starts with direction.",
    ],
    bestPractices: [
      "Spend 5–10 minutes while the day is still fresh in your mind.",
      "Link wins to team or company goals when you can.",
      "Flag blockers early so they appear in reviews and standups.",
    ],
  },
  {
    id: "weekly-review",
    title: "Completing Your Weekly Review",
    tips: [
      "Reflect on what moved the needle versus what merely kept you busy.",
      "Record breakthroughs and lessons — they compound over quarters.",
      "Set 2–3 priorities for the week ahead and align them with KPIs.",
    ],
    bestPractices: [
      "Block calendar time for your review so it is not skipped at week-end.",
      "Compare this week to last to spot trends, not just single events.",
      "Share highlights with your lead if your org expects visibility.",
    ],
  },
  {
    id: "kpis",
    title: "Understanding Your KPIs",
    tips: [
      "KPIs translate strategy into measurable outcomes you can track weekly.",
      "Update values and notes when you have fresh data — stale numbers mislead everyone.",
      "Green usually means on track, yellow at risk, red off track; confirm definitions with your admin.",
    ],
    bestPractices: [
      "Tie each KPI to an owner and a clear target date or threshold.",
      "Document assumptions when you change a KPI so the team stays aligned.",
      "Review KPIs in weekly syncs, not only at month-end.",
    ],
  },
  {
    id: "tasks-issues",
    title: "Managing Tasks & Issues",
    tips: [
      "Use tasks for one-time workstreams; use recurring patterns for operational habits.",
      "Assign priority so others know what to pick up first when capacity is tight.",
      "Update status and percent complete as you go — silent tasks look abandoned.",
    ],
    bestPractices: [
      "Break large items into smaller tasks with clear done criteria.",
      "Close or cancel tasks you will not do to keep lists trustworthy.",
      "Escalate blockers as issues when they need leadership attention.",
    ],
  },
  {
    id: "strategic-planning",
    title: "Strategic Business Planning",
    tips: [
      "Anchor long-term direction with a BHAG or north-star outcome.",
      "Write core values and behaviors so culture supports the plan.",
      "Break the year into quarters and assign execution owners per initiative.",
    ],
    bestPractices: [
      "Revisit strategy quarterly; markets and teams change faster than annual plans.",
      "Limit active big rocks so execution stays realistic.",
      "Connect every major project back to a stated strategic pillar.",
    ],
  },
  {
    id: "team-kpis",
    title: "Managing Team KPIs",
    tips: [
      "Departmental KPIs should ladder up to company scorecards.",
      "Set thresholds and alerts so the team reacts before misses become crises.",
      "Link KPIs to strategic goals in Business Compass when the feature is enabled.",
    ],
    bestPractices: [
      "Review team KPIs in group forums, not only in 1:1s.",
      "Celebrate public wins when metrics turn green after effort.",
      "Adjust targets when scope or resources change — avoid blame for bad baselines.",
    ],
  },
  {
    id: "managing-team",
    title: "Managing Your Team",
    tips: [
      "Invite members with the right role so permissions match their responsibilities.",
      "Assign people to departments for reporting and DISC or compass views.",
      "Keep profiles and titles current so handoffs and directories stay clear.",
    ],
    bestPractices: [
      "Onboard new hires with a short tour of Business Compass in week one.",
      "Use consistent naming and departments across HR and the tool.",
      "Remove or deactivate accounts promptly when someone leaves.",
    ],
  },
];

type FaqItem = {
  question: string;
  answer: string;
};

type FaqCategory = {
  id: string;
  title: string;
  items: FaqItem[];
};

const FAQ_CATEGORIES: FaqCategory[] = [
  {
    id: "getting-started",
    title: "Getting Started",
    items: [
      {
        question: "How do I complete my daily report?",
        answer:
          "Open Business Compass, go to your daily report section, and fill in accomplishments, your day rating, and tomorrow’s focus. Submit before the cutoff your organization sets so your streak and scores stay accurate.",
      },
      {
        question: "What is a KPI and how do I track it?",
        answer:
          "A KPI (Key Performance Indicator) is a measurable target tied to your role or team. Track it by updating values and notes on the cadence your admin defines — often weekly. Colors (green, yellow, red) usually reflect on-track, at-risk, and off-track status.",
      },
      {
        question: "How often should I submit weekly reports?",
        answer:
          "Submit your weekly review once per week, typically before the weekend or on a day your manager specifies. Consistent weekly submissions improve leaderboard and review quality.",
      },
    ],
  },
  {
    id: "tasks-issues",
    title: "Tasks & Issues",
    items: [
      {
        question: "What's the difference between a task and an issue?",
        answer:
          "Tasks are actionable work items with owners and due dates. Issues are usually blockers or problems that need escalation or cross-team help. Use issues when work cannot proceed without a decision or fix.",
      },
      {
        question: "How do I tag someone for help?",
        answer:
          "When creating or editing a task or comment, mention your colleague by name or use your organization’s @mention pattern if enabled. They’ll get notified according to your company’s notification settings.",
      },
      {
        question: "Can I set recurring tasks?",
        answer:
          "If your tenant has recurring tasks enabled, choose the repeat option when creating a task. Otherwise, duplicate a previous task or use weekly reviews to capture repeating commitments.",
      },
    ],
  },
  {
    id: "meetings",
    title: "Meetings",
    items: [
      {
        question: "How do daily huddles work?",
        answer:
          "Daily huddles are short standups to align on priorities and blockers. Share what you did, what’s next, and what you need — often in a dedicated MOM or huddle view if your org uses one.",
      },
      {
        question: "What should I prepare for weekly meetings?",
        answer:
          "Bring KPI updates, completed tasks, risks, and decisions needed. Review your weekly Business Compass summary so discussion matches what’s already documented.",
      },
      {
        question: "Can I view past meeting notes?",
        answer:
          "Yes, if Minutes of Meeting (MOM) or similar is enabled. Open the meetings or MOM module and filter by date or project to find historical notes.",
      },
    ],
  },
  {
    id: "performance",
    title: "Performance & Gamification",
    items: [
      {
        question: "How do I earn points and badges?",
        answer:
          "Points typically come from timely daily and weekly reports, feedback, and other activities your admin configures. Badges unlock when you hit milestones — check the leaderboard or profile section for progress.",
      },
      {
        question: "What are the different badge levels?",
        answer:
          "Badge levels depend on your organization’s rules. Common patterns include tiers like Bronze, Silver, and Gold tied to consistency, scores, or streaks. Your admin can publish the exact criteria in announcements or policy docs.",
      },
      {
        question: "What is the timely submission bonus?",
        answer:
          "Some programs add extra points when you submit reports before a deadline. The exact bonus and window are set by your admin; watch Help Center announcements for changes.",
      },
    ],
  },
  {
    id: "admin",
    title: "Admin Features",
    items: [
      {
        question: "How do I invite team members?",
        answer:
          "Admins usually invite users from Settings → Users (or equivalent). Send an invite with the correct role and department so permissions and reporting stay accurate.",
      },
      {
        question: "Can I view other team members' reports?",
        answer:
          "If your role includes manager or admin access, you may view reports for your team. Employee privacy rules still apply — only data your organization allows will be visible.",
      },
      {
        question: "How do I set up departmental KPIs?",
        answer:
          "In settings or the KPI module, create KPIs scoped to a department, set targets and thresholds, and assign owners. Link them to company goals where supported so rollups stay aligned.",
      },
    ],
  },
];

function GuideCard({ entry }: { entry: GuideEntry }) {
  return (
    <Card className="rounded-xl border border-[#DA7756]/20 bg-[#DA7756]/10 p-6 shadow-sm sm:p-8">
      <h3 className="text-base font-bold text-neutral-900 sm:text-lg">
        {entry.title}
      </h3>

      <div className="mt-6">
        <p className="text-sm font-bold text-neutral-900">Tips</p>
        <ul className="mt-2 list-disc space-y-2 pl-5 text-sm leading-relaxed text-neutral-900">
          {entry.tips.map((tip) => (
            <li key={tip}>{tip}</li>
          ))}
        </ul>
      </div>

      <div className="mt-6">
        <p className="text-sm font-bold text-neutral-900">Best Practices</p>
        <ul className="mt-3 space-y-2.5">
          {entry.bestPractices.map((line) => (
            <li key={line} className="flex gap-3 text-sm leading-relaxed text-neutral-900">
              <CheckCircle2
                className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600"
                strokeWidth={2}
                aria-hidden
              />
              <span>{line}</span>
            </li>
          ))}
        </ul>
      </div>
    </Card>
  );
}

function SuggestionsTabContent() {
  const [category, setCategory] = useState("improvement");
  const [suggestion, setSuggestion] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Hook to API when ready
    setSuggestion("");
  };

  return (
    <Card className="rounded-2xl border border-[#DA7756]/20 bg-[#DA7756]/10 p-6 shadow-sm sm:p-8">
      <h2 className="text-xl font-bold text-neutral-900 sm:text-2xl">
        Submit a Suggestion
      </h2>
      <p className="mt-2 text-sm text-neutral-500 sm:text-[15px]">
        Help us improve by sharing your ideas and feedback
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-6">
        <div className="space-y-2">
          <Label
            htmlFor="suggestion-category"
            className="text-sm font-medium text-neutral-700"
          >
            Category
          </Label>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger
              id="suggestion-category"
              className="h-11 rounded-lg border-neutral-200 bg-white"
            >
              <SelectValue placeholder="Improvement" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="improvement">Improvement</SelectItem>
              <SelectItem value="feature">Feature request</SelectItem>
              <SelectItem value="bug">Bug report</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="suggestion-body"
            className="text-sm font-medium text-neutral-700"
          >
            Your Suggestion
          </Label>
          <Textarea
            id="suggestion-body"
            value={suggestion}
            onChange={(e) => setSuggestion(e.target.value)}
            placeholder="Describe your suggestion in detail..."
            className="min-h-[140px] resize-y rounded-lg border-neutral-200 bg-white text-sm text-neutral-900 placeholder:text-neutral-400"
          />
        </div>

        <button
          type="submit"
          className={cn(
            "flex w-full items-center justify-center gap-2 rounded-xl bg-[#DA7756] py-3.5 text-sm font-semibold text-white",
            "transition-colors hover:bg-[#DA7756]/85 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#DA7756] focus-visible:ring-offset-2"
          )}
        >
          <Send className="h-4 w-4" strokeWidth={2} />
          Submit Suggestion
        </button>
      </form>
    </Card>
  );
}

const HelpCenter = () => {
  const [tab, setTab] = useState("tutorials");

  return (
    <div className="min-h-[calc(100vh-4rem)] w-full bg-[#f6f4ee] px-4 py-6 sm:px-6">
      <div className="mx-auto max-w-6xl space-y-8">
        <header className="flex flex-col gap-1 sm:flex-row sm:items-start sm:gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#DA7756] shadow-sm">
            <HelpCircle className="h-7 w-7 text-white" strokeWidth={2} />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-neutral-900 sm:text-3xl">
              Help Center
            </h1>
            <p className="mt-1 text-sm text-neutral-500 sm:text-base">
              Guides, FAQs, and ways to help us improve
            </p>
          </div>
        </header>

        <Tabs value={tab} onValueChange={setTab} className="w-full">
          <TabsList
            className={cn(
              // Match pill tabs used in Feedback/KPI pages
              "inline-flex h-12 w-fit max-w-full items-center justify-start gap-2 overflow-x-auto rounded-full border border-[#DA7756]/20",
              "bg-[#f6f4ee] px-2 shadow-sm"
            )}
          >
            <TabsTrigger
              value="tutorials"
              className={cn(
                "h-9 gap-2 rounded-full px-5 text-sm font-semibold text-neutral-500 transition-colors hover:text-neutral-700",
                "data-[state=active]:bg-[#DA7756] data-[state=active]:text-white data-[state=active]:shadow-sm"
              )}
            >
              <Video className="h-4 w-4 shrink-0" />
              Tutorials
            </TabsTrigger>
            <TabsTrigger
              value="guide"
              className={cn(
                "h-9 gap-2 rounded-full px-5 text-sm font-semibold text-neutral-500 transition-colors hover:text-neutral-700",
                "data-[state=active]:bg-[#DA7756] data-[state=active]:text-white data-[state=active]:shadow-sm"
              )}
            >
              <BookOpen className="h-4 w-4 shrink-0" />
              Guide
            </TabsTrigger>
            <TabsTrigger
              value="faq"
              className={cn(
                "h-9 gap-2 rounded-full px-5 text-sm font-semibold text-neutral-500 transition-colors hover:text-neutral-700",
                "data-[state=active]:bg-[#DA7756] data-[state=active]:text-white data-[state=active]:shadow-sm"
              )}
            >
              <MessageSquare className="h-4 w-4 shrink-0" />
              FAQ
            </TabsTrigger>
            <TabsTrigger
              value="suggestions"
              className={cn(
                "h-9 gap-2 rounded-full px-5 text-sm font-semibold text-neutral-500 transition-colors hover:text-neutral-700",
                "data-[state=active]:bg-[#DA7756] data-[state=active]:text-white data-[state=active]:shadow-sm"
              )}
            >
              <Lightbulb className="h-4 w-4 shrink-0" />
              Suggestions
            </TabsTrigger>
          </TabsList>

          <TabsContent
            value="tutorials"
            className="mt-6 focus-visible:outline-none"
          >
            <Card className="rounded-2xl border border-[#DA7756]/20 bg-[#DA7756]/10 p-5 shadow-sm sm:p-8">
              <div className="mb-6 sm:mb-8">
                <h2 className="text-lg font-bold text-neutral-900 sm:text-xl">
                  Video Tutorials
                </h2>
                <p className="mt-1 text-sm text-neutral-500 sm:text-base">
                  Learn how to use Business Compass through video guides
                </p>
              </div>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {VIDEO_TUTORIALS.map((item) => (
                  <TutorialVideoCard key={item.id} item={item} />
                ))}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="guide" className="mt-6 focus-visible:outline-none">
            <div className="space-y-5">
              <div className="rounded-2xl border border-[#DA7756]/20 bg-[#DA7756]/10 px-5 py-5 shadow-sm sm:px-6 sm:py-6">
                <div className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-[#DA7756]" />
                  <h2 className="text-lg font-bold text-neutral-900 sm:text-xl">
                    Guides
                  </h2>
                </div>
                <p className="mt-1 text-sm text-neutral-500 sm:text-[15px]">
                  Practical tips and best practices for Business Compass
                </p>
              </div>
              {GUIDE_SECTIONS.map((entry) => (
                <GuideCard key={entry.id} entry={entry} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="faq" className="mt-6 focus-visible:outline-none">
            <Card className="rounded-2xl border border-[#DA7756]/20 bg-[#DA7756]/10 p-5 shadow-sm sm:p-8 lg:p-10">
              <h2 className="text-xl font-bold text-neutral-900 sm:text-2xl">
                Frequently Asked Questions
              </h2>
              <p className="mt-2 text-sm text-neutral-500 sm:text-base">
                Find quick answers to common questions
              </p>

              <div className="mt-8 space-y-10 sm:mt-10 sm:space-y-12">
                {FAQ_CATEGORIES.map((category) => (
                  <div key={category.id}>
                    <h3 className="text-base font-bold text-neutral-900 sm:text-lg">
                      {category.title}
                    </h3>
                    <Accordion
                      type="single"
                      collapsible
                      className="mt-0 w-full"
                    >
                      {category.items.map((item, index) => (
                        <AccordionItem
                          key={`${category.id}-${index}`}
                          value={`${category.id}-${index}`}
                          className="border-b border-neutral-200 last:border-b-0"
                        >
                          <AccordionTrigger
                            className={cn(
                              "py-4 text-left text-sm font-normal text-neutral-900 hover:no-underline sm:text-[15px]",
                              "[&>svg]:shrink-0 [&>svg]:text-neutral-400"
                            )}
                          >
                            {item.question}
                          </AccordionTrigger>
                          <AccordionContent className="pb-4 pt-0 text-sm leading-relaxed text-neutral-600">
                            {item.answer}
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>

          <TabsContent
            value="suggestions"
            className="mt-6 focus-visible:outline-none"
          >
            <SuggestionsTabContent />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default HelpCenter;
