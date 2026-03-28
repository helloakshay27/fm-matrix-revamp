import React, { useState } from "react";
import {
  AlertCircle,
  BookOpen,
  Calendar,
  CheckCircle2,
  FileText,
  LineChart,
  Star,
  TrendingUp,
  Trophy,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AdminViewEmulation } from "@/components/AdminViewEmulation";

function ScoresNotLiveAlert() {
  return (
    <div
      className={cn(
        "flex gap-3 rounded-2xl border border-amber-300/90 bg-[#FFFBF0] px-4 py-3.5 sm:px-5 sm:py-4"
      )}
    >
      <AlertCircle
        className="mt-0.5 h-5 w-5 shrink-0 text-amber-600"
        strokeWidth={2}
        aria-hidden
      />
      <div className="min-w-0 text-sm leading-relaxed text-amber-800">
        <p className="font-bold text-amber-800">Scores are not live</p>
        <p className="mt-1 text-amber-800/95">
          Leaderboard data is refreshed automatically every 3 hours. It may not
          reflect the most recent report submissions.
        </p>
      </div>
    </div>
  );
}

function LeaderboardEmptyState() {
  return (
    <div className="flex flex-col items-center justify-center px-4 py-20 text-center sm:py-24">
      <TrendingUp
        className="mb-4 h-14 w-14 text-sky-400 sm:h-16 sm:w-16"
        strokeWidth={1.5}
        aria-hidden
      />
      <h3 className="text-lg font-bold text-neutral-800">No data yet</h3>
      <p className="mt-2 max-w-md text-sm text-neutral-500">
        Submit daily and weekly reports to appear on the leaderboard.
      </p>
    </div>
  );
}

function SectionTitle({
  icon: Icon,
  children,
}: {
  icon: React.ElementType;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-2">
      <Icon className="h-5 w-5 shrink-0 text-neutral-700" strokeWidth={2} />
      <h2 className="text-base font-bold text-neutral-900 sm:text-lg">
        {children}
      </h2>
    </div>
  );
}

function FormulaBar({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-xl px-4 py-3 text-center text-sm font-semibold text-neutral-900 sm:text-base",
        className
      )}
    >
      {children}
    </div>
  );
}

function PointBreakdown3({
  items,
}: {
  items: [
    { label: string; sub: string; className: string },
    { label: string; sub: string; className: string },
    { label: string; sub: string; className: string },
  ];
}) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
      {items.map((item, idx) => (
        <div
          key={`${item.label}-${idx}`}
          className={cn(
            "rounded-xl px-4 py-4 text-center shadow-sm",
            item.className
          )}
        >
          <p className="text-lg font-bold">{item.label}</p>
          <p className="mt-1 text-xs font-medium opacity-90">{item.sub}</p>
        </div>
      ))}
    </div>
  );
}

const FEEDBACK_RATING_COLUMNS = [
  { stars: 1, pts: "-10 pts", bg: "bg-red-500", text: "text-white" },
  { stars: 2, pts: "-5 pts", bg: "bg-orange-400", text: "text-white" },
  { stars: 3, pts: "0 pts", bg: "bg-sky-200", text: "text-sky-950" },
  { stars: 4, pts: "+5 pts", bg: "bg-emerald-300", text: "text-emerald-950" },
  { stars: 5, pts: "+10 pts", bg: "bg-green-600", text: "text-white" },
] as const;

function HowScoresWorkContent() {
  const tips = [
    "Stay consistent with daily reports — they add up over time.",
    "Prioritize weekly reviews; they’re worth much more than a single daily report.",
    "Focus on quality: clear KPIs, achievements, and context improve automated scores.",
    "Use the date filter to see standings for the window that matters to you.",
  ];

  return (
    <div className="space-y-5">
      <Card className="rounded-2xl border border-[#DA7756]/20 bg-[#DA7756]/10 p-5 shadow-sm sm:p-6">
        <SectionTitle icon={LineChart}>Score overview</SectionTitle>
        <p className="mt-3 text-sm leading-relaxed text-neutral-700 sm:text-[15px]">
          Your <strong>total score</strong> is the sum of points from{" "}
          <strong>daily reports</strong>, <strong>weekly reviews</strong>, and{" "}
          <strong>feedback</strong>. If a report or review is missing for a
          period, it contributes <strong>0 points</strong> for that item.
        </p>
        <div className="mt-4 rounded-xl border border-[#DA7756]/20 bg-[#DA7756]/10 px-4 py-4 text-center shadow-sm">
          <p className="text-sm font-bold text-neutral-900 sm:text-base">
            Total Score = Daily Points + Weekly Points + Feedback Points
          </p>
        </div>
      </Card>

      <Card className="rounded-2xl border border-[#DA7756]/20 bg-[#DA7756]/10 p-5 shadow-sm sm:p-6">
        <SectionTitle icon={Calendar}>Daily report points</SectionTitle>
        <p className="mt-3 text-sm leading-relaxed text-neutral-600">
          Each daily report is scored out of 100 by the automated review. Those
          points convert into leaderboard points using the formula below.
        </p>
        <FormulaBar className="mt-4 bg-[#DA7756]/10">
          Points per report = (automated_score / 100) × 10
        </FormulaBar>
        <p className="mt-3 text-sm text-neutral-600">
          <span className="font-medium text-neutral-800">Example:</span> A daily
          report with a score of <strong>80</strong> earns <strong>8 pts</strong>
          . A score of <strong>100</strong> earns <strong>10 pts</strong>.
        </p>
        <div className="mt-4">
          <PointBreakdown3
            items={[
              {
                label: "10 pts",
                sub: "Max per report",
                className: "bg-emerald-100 text-emerald-900",
              },
              {
                label: "5 pts",
                sub: "Score of 50",
                className: "bg-orange-100 text-orange-900",
              },
              {
                label: "0 pts",
                sub: "Missed / not submitted",
                className: "bg-red-100 text-red-900",
              },
            ]}
          />
        </div>
      </Card>

      <Card className="rounded-2xl border border-[#DA7756]/20 bg-[#DA7756]/10 p-5 shadow-sm sm:p-6">
        <SectionTitle icon={FileText}>Weekly review points</SectionTitle>
        <p className="mt-3 text-sm leading-relaxed text-neutral-600">
          Weekly reviews are weighted higher than daily reports. Each review is
          scored out of 100 and converted using a larger multiplier.
        </p>
        <FormulaBar className="mt-4 bg-[#DA7756]/10">
          Points per review = (automated_score / 100) × 50
        </FormulaBar>
        <p className="mt-3 text-sm text-neutral-600">
          <span className="font-medium text-neutral-800">Example:</span> A weekly
          review with a score of <strong>80</strong> earns{" "}
          <strong>40 pts</strong>. A score of <strong>100</strong> earns{" "}
          <strong>50 pts</strong>.
        </p>
        <div className="mt-4">
          <PointBreakdown3
            items={[
              {
                label: "50 pts",
                sub: "Max per review",
                className: "bg-emerald-100 text-emerald-900",
              },
              {
                label: "25 pts",
                sub: "Score of 50",
                className: "bg-orange-100 text-orange-900",
              },
              {
                label: "0 pts",
                sub: "Missed / not submitted",
                className: "bg-red-100 text-red-900",
              },
            ]}
          />
        </div>
      </Card>

      <Card className="rounded-2xl border border-[#DA7756]/20 bg-[#DA7756]/10 p-5 shadow-sm sm:p-6">
        <SectionTitle icon={Star}>Feedback points</SectionTitle>
        <p className="mt-3 text-sm leading-relaxed text-neutral-600">
          Manager feedback uses a 1–5 star rating. Stars add or subtract
          points from your leaderboard total according to this scale:
        </p>
        <div className="mt-4 overflow-hidden rounded-xl border border-neutral-200">
          <div className="grid grid-cols-5 divide-x divide-white/40">
            {FEEDBACK_RATING_COLUMNS.map((col) => (
              <div
                key={col.stars}
                className={cn(
                  "px-1 py-4 text-center sm:px-2 sm:py-5",
                  col.bg,
                  col.text
                )}
              >
                <div className="flex justify-center gap-0.5">
                  {Array.from({ length: col.stars }, (_, i) => (
                    <Star
                      key={i}
                      className={cn(
                        "h-3.5 w-3.5 sm:h-4 sm:w-4",
                        col.text.includes("white")
                          ? "fill-white text-white stroke-white"
                          : "fill-amber-500 text-amber-600 stroke-amber-600"
                      )}
                      strokeWidth={col.text.includes("white") ? 0 : 1}
                    />
                  ))}
                </div>
                <p className="mt-2 text-[11px] font-bold sm:text-xs">
                  {col.pts}
                </p>
              </div>
            ))}
          </div>
        </div>
      </Card>

      <Card className="rounded-2xl border border-[#DA7756]/20 bg-[#DA7756]/10 p-5 shadow-sm sm:p-6">
        <div className="flex items-center gap-2">
          <Star
            className="h-5 w-5 shrink-0 text-[#DA7756]"
            strokeWidth={2}
          />
          <h2 className="text-base font-bold text-neutral-900 sm:text-lg">
            Tips to climb the leaderboard
          </h2>
        </div>
        <ul className="mt-4 space-y-3">
          {tips.map((tip) => (
            <li key={tip} className="flex gap-3 text-sm text-neutral-900/95">
              <CheckCircle2
                className="mt-0.5 h-5 w-5 shrink-0 text-[#DA7756]"
                strokeWidth={2}
                aria-hidden
              />
              <span className="leading-relaxed">{tip}</span>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}

const Leaderboard = () => {
  const [timeRange, setTimeRange] = useState("30");

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[#f6f4ee] px-4 py-6 sm:px-6">
      <AdminViewEmulation />
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#DA7756] shadow-sm">
              <Trophy className="h-7 w-7 text-white" strokeWidth={2} />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-neutral-900 sm:text-3xl">
                Leaderboard
              </h1>
              <p className="mt-1 text-sm text-neutral-500 sm:text-base">
                Ranked by total report score points.
              </p>
            </div>
          </div>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="h-11 w-full shrink-0 rounded-xl border-neutral-200 bg-white shadow-sm sm:w-[140px] focus-visible:ring-2 focus-visible:ring-[#DA7756]/25">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">7 Days</SelectItem>
              <SelectItem value="30">30 Days</SelectItem>
              <SelectItem value="90">90 Days</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <ScoresNotLiveAlert />

        <Tabs defaultValue="leaderboard" className="w-full">
          <TabsList
            className={cn(
              "h-auto w-full justify-start gap-0 rounded-none border-b border-neutral-200 bg-transparent p-0",
              "sm:inline-flex sm:w-auto"
            )}
          >
            <TabsTrigger
              value="leaderboard"
              className={cn(
                "relative gap-2 rounded-none border-0 bg-transparent px-4 py-3 text-sm text-neutral-500 shadow-none",
                "ring-offset-0 focus-visible:ring-0",
                "data-[state=active]:bg-transparent data-[state=active]:text-neutral-900",
                "data-[state=active]:font-bold data-[state=active]:shadow-none",
                "after:absolute after:bottom-0 after:left-0 after:right-0 after:h-1 after:rounded-t after:bg-transparent",
                "data-[state=active]:after:bg-[#DA7756]"
              )}
            >
              <Trophy className="h-4 w-4" />
              Leaderboard
            </TabsTrigger>
            <TabsTrigger
              value="how-scores"
              className={cn(
                "relative gap-2 rounded-none border-0 bg-transparent px-4 py-3 text-sm text-neutral-500 shadow-none",
                "ring-offset-0 focus-visible:ring-0",
                "data-[state=active]:bg-transparent data-[state=active]:text-neutral-900",
                "data-[state=active]:font-bold data-[state=active]:shadow-none",
                "after:absolute after:bottom-0 after:left-0 after:right-0 after:h-1 after:rounded-t after:bg-transparent",
                "data-[state=active]:after:bg-[#DA7756]"
              )}
            >
              <BookOpen className="h-4 w-4" />
              How Scores Work
            </TabsTrigger>
          </TabsList>

          <TabsContent
            value="leaderboard"
            className="mt-4 focus-visible:outline-none"
          >
            <Card className="rounded-2xl border border-[#DA7756]/20 bg-[#DA7756]/10 shadow-sm">
              <LeaderboardEmptyState />
            </Card>
          </TabsContent>

          <TabsContent
            value="how-scores"
            className="mt-6 focus-visible:outline-none"
          >
            <HowScoresWorkContent />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Leaderboard;
