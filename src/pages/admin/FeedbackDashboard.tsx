import React, { useState } from "react";
import {
  LineChart,
  MessageSquare,
  Star,
  TrendingUp,
  Users,
  Wand2,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";

const DEPARTMENTS = [
  { rank: 1, name: "Engineering", count: 24, rating: 2.7 },
  { rank: 2, name: "Front End", count: 18, rating: 2.7 },
  { rank: 3, name: "Business Excellence", count: 12, rating: 2.7 },
  { rank: 4, name: "Design", count: 11, rating: 2.7 },
  { rank: 5, name: "QA", count: 9, rating: 2.7 },
  { rank: 6, name: "Client Servicing", count: 8, rating: 2.7 },
  { rank: 7, name: "Accounts", count: 7, rating: 2.7 },
  { rank: 8, name: "Human Resources", count: 6, rating: 2.7 },
  { rank: 9, name: "Marketing", count: 5, rating: 2.7 },
  { rank: 10, name: "Management", count: 5, rating: 2.7 },
  { rank: 11, name: "Sales", count: 4, rating: 2.7 },
  { rank: 12, name: "HR", count: 3, rating: 2.7 },
  { rank: 13, name: "Product", count: 3, rating: 2.7 },
];

const RECEIVED = [
  { rank: 1, name: "Mahendra Lungare", role: "Engineering", count: 20 },
  { rank: 2, name: "Priya Sharma", role: "Design", count: 18 },
  { rank: 3, name: "James Lee", role: "Front End", count: 15 },
  { rank: 4, name: "Sarah Khan", role: "QA", count: 12 },
  { rank: 5, name: "Bilal Shaikh", role: "Engineering", count: 10 },
];

const GIVEN = [
  { rank: 1, name: "Adhip Shetty", role: "Management", count: 73 },
  { rank: 2, name: "Ravi Kumar", role: "Sales", count: 45 },
  { rank: 3, name: "Neha Patel", role: "HR", count: 32 },
  { rank: 4, name: "Chris Allen", role: "Product", count: 28 },
];

const RECENT = [
  {
    id: "1",
    from: "Adhip Shetty",
    to: "Mahendra Lungare",
    date: "Mar 19, 2024",
    rating: 5,
    unread: true,
    bonusPts: 10,
  },
  {
    id: "2",
    from: "Sarah Khan",
    to: "James Lee",
    date: "Mar 18, 2024",
    rating: 4,
    unread: true,
  },
  {
    id: "3",
    from: "Priya Sharma",
    to: "Bilal Shaikh",
    date: "Mar 17, 2024",
    rating: 3,
    unread: false,
  },
];

function StarRow({ value }: { value: number }) {
  return (
    <div className="flex shrink-0 gap-0.5" aria-label={`${value} of 5 stars`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className={cn(
            "h-4 w-4 sm:h-[18px] sm:w-[18px]",
            i <= value
              ? "fill-amber-400 text-amber-400"
              : "fill-transparent text-neutral-300"
          )}
          strokeWidth={i <= value ? 0 : 1.5}
        />
      ))}
    </div>
  );
}

const FeedbackDashboard = () => {
  const [aiLoading, setAiLoading] = useState(false);

  return (
    <div className="min-h-[calc(100vh-5rem)] bg-[#f6f4ee] px-4 py-6 sm:px-6">
      <div className="mx-auto max-w-6xl space-y-6">
        <header className="flex flex-col gap-1 sm:flex-row sm:items-start sm:gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2 border-[#DA7756] bg-white shadow-sm">
            <LineChart className="h-6 w-6 text-[#DA7756]" strokeWidth={2} />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-neutral-900 sm:text-3xl">
              Feedback Dashboard
            </h1>
            <p className="mt-1 text-sm text-neutral-500 sm:text-base">
              Team feedback analytics and insights
            </p>
          </div>
        </header>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:gap-4">
          <Card
            className={cn(
              "border-0 shadow-md transition-shadow hover:shadow-lg",
              "rounded-2xl p-5 bg-sky-100/90"
            )}
          >
            <div className="flex flex-col items-center text-center">
              <MessageSquare className="mb-3 h-7 w-7 text-sky-600" />
              <p className="text-3xl font-bold tabular-nums text-neutral-900">
                95
              </p>
              <p className="mt-1 text-xs font-medium text-neutral-600">
                Total Feedback
              </p>
            </div>
          </Card>
          <Card
            className={cn(
              "border-0 shadow-md transition-shadow hover:shadow-lg",
              "rounded-2xl p-5 bg-[#E3F4E8]"
            )}
          >
            <div className="flex flex-col items-center text-center">
              <TrendingUp className="mb-3 h-7 w-7 text-[#2E7D32]" />
              <p className="text-3xl font-bold tabular-nums text-neutral-900">
                16%
              </p>
              <p className="mt-1 text-xs font-medium text-neutral-600">
                Read Rate
              </p>
            </div>
          </Card>
          <Card
            className={cn(
              "border-0 shadow-md transition-shadow hover:shadow-lg",
              "rounded-2xl p-5 bg-violet-100/90"
            )}
          >
            <div className="flex flex-col items-center text-center">
              <div className="mb-3 flex items-center gap-1">
                <Star className="h-6 w-6 fill-amber-400 text-amber-400" />
                <TrendingUp className="h-6 w-6 text-violet-600" />
              </div>
              <p className="text-3xl font-bold tabular-nums text-neutral-900">
                2.7
              </p>
              <p className="mt-1 text-xs font-medium text-neutral-600">
                Avg Rating
              </p>
            </div>
          </Card>
          <Card
            className={cn(
              "border-0 shadow-md transition-shadow hover:shadow-lg",
              "rounded-2xl p-5 bg-orange-100/90"
            )}
          >
            <div className="flex flex-col items-center text-center">
              <Users className="mb-3 h-7 w-7 text-orange-600" />
              <p className="text-3xl font-bold tabular-nums text-neutral-900">
                16
              </p>
              <p className="mt-1 text-xs font-medium text-neutral-600">
                Active Team
              </p>
            </div>
          </Card>
        </div>

        <Card className="rounded-2xl border border-neutral-200/90 bg-white p-4 shadow-md sm:p-6">
          <h2 className="mb-4 text-lg font-semibold text-neutral-900">
            Feedback by Department
          </h2>
          <ul className="space-y-3">
            {DEPARTMENTS.map((d) => (
              <li
                key={d.name}
                className="flex items-center gap-3 rounded-xl border border-neutral-100 bg-[#FFFDF0]/80 px-3 py-3 sm:gap-4 sm:px-4"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#DA7756] text-sm font-bold text-white">
                  {d.rank}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-neutral-900">{d.name}</p>
                  <p className="text-xs text-neutral-500">
                    {d.count} feedback{d.count !== 1 ? "s" : ""} received
                  </p>
                </div>
                <span className="shrink-0 rounded-full bg-amber-100 px-2.5 py-1 text-xs font-semibold text-amber-900">
                  {d.rating}
                </span>
              </li>
            ))}
          </ul>
        </Card>

        <div className="grid gap-4 lg:grid-cols-2">
          <Card className="rounded-2xl border border-neutral-200/90 bg-white p-4 shadow-md sm:p-6">
            <h2 className="mb-4 text-lg font-semibold text-neutral-900">
              Most Feedback Received
            </h2>
            <ul className="space-y-3">
              {RECEIVED.map((p) => (
                <li
                  key={p.rank}
                  className="flex items-center gap-3 rounded-xl border border-sky-100 bg-sky-50/50 px-3 py-3 sm:gap-4"
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-sky-600 text-sm font-bold text-white">
                    {p.rank}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-neutral-900">{p.name}</p>
                    <p className="text-xs text-neutral-500">{p.role}</p>
                  </div>
                  <span className="shrink-0 rounded-full bg-sky-100 px-2.5 py-1 text-xs font-semibold text-sky-900">
                    {p.count} received
                  </span>
                </li>
              ))}
            </ul>
          </Card>

          <Card className="rounded-2xl border border-neutral-200/90 bg-white p-4 shadow-md sm:p-6">
            <h2 className="mb-4 text-lg font-semibold text-neutral-900">
              Most Feedback Given
            </h2>
            <ul className="space-y-3">
              {GIVEN.map((p) => (
                <li
                  key={p.rank}
                  className="flex items-center gap-3 rounded-xl border border-emerald-100 bg-emerald-50/50 px-3 py-3 sm:gap-4"
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#2E7D32] text-sm font-bold text-white">
                    {p.rank}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-neutral-900">{p.name}</p>
                    <p className="text-xs text-neutral-500">{p.role}</p>
                  </div>
                  <span className="shrink-0 rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-900">
                    {p.count} given
                  </span>
                </li>
              ))}
            </ul>
          </Card>
        </div>

        <div className="rounded-2xl border border-violet-200/80 bg-violet-50/90 px-4 py-5 shadow-sm sm:px-6 sm:py-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex gap-3 sm:gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-200/80">
                <Wand2 className="h-5 w-5 text-violet-700" strokeWidth={2} />
              </div>
              <div>
                <h2 className="text-base font-semibold text-violet-950 sm:text-lg">
                  AI-Powered Feedback Analysis
                </h2>
                <p className="mt-1 max-w-xl text-sm text-violet-900/85">
                  Click &quot;Generate AI Summary&quot; to get insights on team
                  feedback patterns and recommendations.
                </p>
              </div>
            </div>
            <button
              type="button"
              disabled={aiLoading}
              onClick={() => {
                setAiLoading(true);
                window.setTimeout(() => setAiLoading(false), 1200);
              }}
              className="inline-flex h-11 shrink-0 items-center justify-center gap-2 self-start rounded-xl bg-[#DA7756] px-5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#DA7756]/85 disabled:opacity-70 lg:self-center"
            >
              <Sparkles className="h-4 w-4 text-white" strokeWidth={2} />
              {aiLoading ? "Generating…" : "Generate AI Summary"}
            </button>
          </div>
        </div>

        <Card className="rounded-2xl border border-neutral-200/90 bg-white p-4 shadow-md sm:p-6">
          <h2 className="mb-4 text-lg font-semibold text-neutral-900">
            Recent Feedback Activity
          </h2>
          <ul className="space-y-3">
            {RECENT.map((row) => (
              <li
                key={row.id}
                className="flex flex-col gap-3 rounded-xl border border-neutral-200/90 bg-[#FFFDF0] p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-neutral-900">
                    {row.from}{" "}
                    <span className="font-normal text-neutral-400">→</span>{" "}
                    {row.to}
                  </p>
                  <p className="mt-0.5 text-sm text-neutral-500">{row.date}</p>
                </div>
                <div className="flex flex-wrap items-center gap-3 sm:justify-end">
                  <StarRow value={row.rating} />
                  {row.bonusPts != null && (
                    <span className="rounded-md bg-emerald-100 px-2 py-0.5 text-xs font-semibold text-emerald-800">
                      +{row.bonusPts} pts
                    </span>
                  )}
                  <span
                    className={cn(
                      "rounded-md px-2 py-0.5 text-xs font-medium",
                      row.unread
                        ? "bg-orange-100 text-orange-800"
                        : "bg-neutral-200/80 text-neutral-600"
                    )}
                  >
                    {row.unread ? "Unread" : "Read"}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  );
};

export default FeedbackDashboard;
