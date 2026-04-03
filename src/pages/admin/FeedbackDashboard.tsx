import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  LineChart,
  MessageSquare,
  Star,
  TrendingUp,
  Users,
  Wand2,
  Sparkles,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { API_CONFIG } from "@/config/apiConfig";
import {
  getEmbeddedOrgId,
  getEmbeddedToken,
  resolveBaseUrlByOrgId,
} from "@/utils/embeddedMode";

// ─── API Endpoints ───────────────────────────────────────────────────────────
const RATINGS_FEEDBACK_DASHBOARD_ENDPOINT = "/ratings/feedback_dashboard";

// ─── Types ───────────────────────────────────────────────────────────────────
interface RatingBreakdown {
  "1": number;
  "2": number;
  "3": number;
  "4": number;
  "5": number;
}

interface RecentFeedback {
  id: string;
  rating: number;
  comment: string;
  createdAt: string;
}

interface DashboardData {
  totalFeedbacks: number;
  averageRating: number;
  ratingBreakdown: RatingBreakdown;
  recentFeedbacks: RecentFeedback[];
}

interface ApiRecentFeedback {
  id?: string | number;
  rating?: number | string;
  comment?: string;
  createdAt?: string;
  created_at?: string;
}

interface ApiDashboardData {
  totalFeedbacks?: number;
  total_feedbacks?: number;
  averageRating?: number;
  average_rating?: number;
  ratingBreakdown?: Partial<RatingBreakdown>;
  rating_breakdown?: Partial<RatingBreakdown>;
  recentFeedbacks?: ApiRecentFeedback[];
  recent_feedbacks?: ApiRecentFeedback[];
}

interface AnalyticsBucket {
  count?: number | string;
  percentage?: number | string;
}

interface RatingsFeedbackAnalytics {
  overall_summary?: Record<string, AnalyticsBucket>;
  data?: {
    overall_summary?: Record<string, AnalyticsBucket>;
  };
}

type ApiRecord = Record<string, unknown>;

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

// ─── Helpers ─────────────────────────────────────────────────────────────────
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

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function toNumber(value: unknown, fallback = 0) {
  const num = Number(value);
  return Number.isFinite(num) ? num : fallback;
}

function toApiRecord(value: unknown): ApiRecord {
  return value && typeof value === "object" ? (value as ApiRecord) : {};
}

function getString(value: unknown): string {
  return typeof value === "string" ? value : "";
}

function pickList(payload: unknown, keys: string[]): unknown[] {
  if (Array.isArray(payload)) return payload;

  const record = toApiRecord(payload);
  for (const key of keys) {
    const candidate = record[key];
    if (Array.isArray(candidate)) return candidate;
  }

  for (const value of Object.values(record)) {
    if (Array.isArray(value) && value.length > 0) return value;
  }

  return [];
}

function buildFeedbackComment(item: ApiRecord) {
  const directComment = getString(item.comment) || getString(item.feedback);
  if (directComment) return directComment;

  return [
    getString(item.positive_opening),
    getString(item.constructive_feedback),
    getString(item.positive_closing),
  ]
    .filter(Boolean)
    .join(" ") || "No comment provided";
}

function mapFeedbackItem(rawItem: unknown, index: number): RecentFeedback {
  const item = toApiRecord(rawItem);

  return {
    id: String(item.id ?? `feedback-${index}`),
    rating: Math.min(
      5,
      Math.max(1, Math.round(toNumber(item.score ?? item.rating, 1)) || 1)
    ),
    comment: buildFeedbackComment(item),
    createdAt:
      getString(item.created_at) ||
      getString(item.createdAt) ||
      getString(item.date) ||
      new Date().toISOString(),
  };
}

function buildDashboardDataFromFeedbacks(items: RecentFeedback[]): DashboardData {
  const ratingBreakdown: RatingBreakdown = {
    "1": 0,
    "2": 0,
    "3": 0,
    "4": 0,
    "5": 0,
  };

  for (const item of items) {
    const normalizedRating = String(
      Math.min(5, Math.max(1, Math.round(item.rating)))
    ) as keyof RatingBreakdown;
    ratingBreakdown[normalizedRating] += 1;
  }

  const totalFeedbacks = items.length;
  const averageRating =
    totalFeedbacks > 0
      ? items.reduce((sum, item) => sum + item.rating, 0) / totalFeedbacks
      : 0;

  return {
    totalFeedbacks,
    averageRating,
    ratingBreakdown,
    recentFeedbacks: [...items]
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
      .slice(0, 10),
  };
}

function normalizeDashboardData(raw: unknown): DashboardData | null {
  if (!raw || typeof raw !== "object") {
    return null;
  }

  const source = raw as ApiDashboardData;
  const breakdown = source.ratingBreakdown ?? source.rating_breakdown ?? {};
  const recent = source.recentFeedbacks ?? source.recent_feedbacks ?? [];

  return {
    totalFeedbacks: toNumber(source.totalFeedbacks ?? source.total_feedbacks),
    averageRating: toNumber(source.averageRating ?? source.average_rating),
    ratingBreakdown: {
      "1": toNumber(breakdown["1"]),
      "2": toNumber(breakdown["2"]),
      "3": toNumber(breakdown["3"]),
      "4": toNumber(breakdown["4"]),
      "5": toNumber(breakdown["5"]),
    },
    recentFeedbacks: recent.map((item, index) => ({
      id: String(item.id ?? `feedback-${index}`),
      rating: toNumber(item.rating),
      comment: item.comment ?? "No comment provided",
      createdAt: item.createdAt ?? item.created_at ?? new Date().toISOString(),
    })),
  };
}

function formatApiDateParam(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function getFeedbackDateRange() {
  const endDate = new Date();
  const startDate = new Date(endDate.getFullYear(), endDate.getMonth(), 1);

  return {
    startDate,
    endDate,
    start: formatApiDateParam(startDate),
    end: formatApiDateParam(endDate),
  };
}

function buildDashboardDataFromAnalytics(
  raw: RatingsFeedbackAnalytics
): DashboardData | null {
  const summary = raw.data?.overall_summary ?? raw.overall_summary;
  if (!summary || typeof summary !== "object") {
    return null;
  }

  const excellent = toNumber(summary.excellent?.count);
  const good = toNumber(summary.good?.count);
  const average = toNumber(summary.average?.count);
  const bad = toNumber(summary.bad?.count);
  const poor = toNumber(summary.poor?.count);

  const ratingBreakdown: RatingBreakdown = {
    "5": excellent,
    "4": good,
    "3": average,
    "2": bad,
    "1": poor,
  };

  const totalFeedbacks = excellent + good + average + bad + poor;
  const weightedScore = excellent * 5 + good * 4 + average * 3 + bad * 2 + poor;

  return {
    totalFeedbacks,
    averageRating: totalFeedbacks > 0 ? weightedScore / totalFeedbacks : 0,
    ratingBreakdown,
    recentFeedbacks: [],
  };
}

async function resolveFeedbackApiBaseUrl(): Promise<string> {
  const embeddedOrgId = getEmbeddedOrgId();

  if (embeddedOrgId) {
    try {
      const resolved = await resolveBaseUrlByOrgId(embeddedOrgId);
      return resolved.replace(/\/+$/, "");
    } catch {
      // Fall back to standard session base URL.
    }
  }

  const baseUrl = API_CONFIG.BASE_URL;
  if (!baseUrl) {
    throw new Error("API base URL is not configured. Please log in again.");
  }

  return baseUrl.replace(/\/+$/, "");
}

function getFeedbackAuthHeader(): string {
  const embeddedToken = getEmbeddedToken();
  const token = embeddedToken || API_CONFIG.TOKEN;
  return token ? `Bearer ${token}` : "";
}

async function safeApiRequest<T>(endpoint: string): Promise<T> {
  const path = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  const baseURL = await resolveFeedbackApiBaseUrl();
  const embeddedToken = getEmbeddedToken();
  const token = embeddedToken || API_CONFIG.TOKEN;
  const { start, end } = getFeedbackDateRange();
  const baseParams: Record<string, string | number> = {
    start_date: start,
    end_date: end,
  };

  let requestError: unknown = null;

  try {
    const response = await axios.request<T>({
      method: "get",
      baseURL,
      url: path,
      params: baseParams,
      timeout: 20000,
      headers: {
        Accept: "application/json",
        ...(token ? { Authorization: getFeedbackAuthHeader() } : {}),
      },
    });

    return response.data;
  } catch (error) {
    requestError = error;

    if (axios.isAxiosError(requestError)) {
      const responseData = toApiRecord(requestError.response?.data);
      const message =
        getString(responseData.message) ||
        getString(responseData.error) ||
        (requestError.response?.status
          ? `Request failed with status ${requestError.response.status}`
          : "") ||
        requestError.message ||
        "Request failed";

      throw new Error(`${path}: ${message}`);
    }

    throw requestError;
  }
}

// ─── Rating Bar ──────────────────────────────────────────────────────────────
function RatingBar({
  label,
  count,
  total,
}: {
  label: string;
  count: number;
  total: number;
}) {
  const pct = total > 0 ? Math.round((count / total) * 100) : 0;
  return (
    <div className="flex items-center gap-3">
      <span className="w-4 shrink-0 text-right text-xs font-semibold text-neutral-600">
        {label}
      </span>
      <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-neutral-200">
        <div
          className="h-full rounded-full bg-amber-400 transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="w-8 shrink-0 text-xs text-neutral-500">{count}</span>
    </div>
  );
}

// ─── Component ───────────────────────────────────────────────────────────────
const FeedbackDashboard = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [aiLoading, setAiLoading] = useState(false);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await safeApiRequest<RatingsFeedbackAnalytics>(
        RATINGS_FEEDBACK_DASHBOARD_ENDPOINT
      );

      const payload =
        buildDashboardDataFromAnalytics(response) ?? normalizeDashboardData(response);

      if (!payload) {
        throw new Error(
          `${RATINGS_FEEDBACK_DASHBOARD_ENDPOINT}: Dashboard payload is empty or invalid.`
        );
      }

      setData(payload);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unexpected error occurred while loading feedback data.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  // ── Loading ────────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="flex min-h-[calc(100vh-5rem)] items-center justify-center bg-[#f6f4ee]">
        <div className="flex flex-col items-center gap-3 text-neutral-500">
          <Loader2 className="h-9 w-9 animate-spin text-[#DA7756]" />
          <p className="text-sm font-medium">Fetching data from API…</p>
        </div>
      </div>
    );
  }

  // ── Error ──────────────────────────────────────────────────────────────────
  if (error || !data) {
    return (
      <div className="flex min-h-[calc(100vh-5rem)] items-center justify-center bg-[#f6f4ee] px-4">
        <div className="w-full max-w-sm rounded-2xl border border-red-200 bg-red-50 p-6 text-center shadow-sm">
          <AlertCircle className="mx-auto mb-3 h-8 w-8 text-red-500" />
          <p className="text-sm font-semibold text-red-700">
            Failed to load dashboard
          </p>
          <p className="mt-1 break-all text-xs text-red-500">{error}</p>
          <button
            onClick={fetchDashboard}
            className="mt-4 rounded-lg bg-[#DA7756] px-5 py-2 text-xs font-semibold text-white hover:bg-[#DA7756]/85"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // ── Real data from API ─────────────────────────────────────────────────────
  const { totalFeedbacks, averageRating, ratingBreakdown, recentFeedbacks } =
    data;

  const totalRatings = Object.values(ratingBreakdown).reduce(
    (a, b) => a + b,
    0
  );

  return (
    <div className="min-h-[calc(100vh-5rem)] bg-[#f6f4ee] px-4 py-6 sm:px-6">
      <div className="mx-auto max-w-6xl space-y-6">

        {/* Header */}
        <header className="flex flex-col gap-1 sm:flex-row sm:items-start sm:gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2 border-[#DA7756] bg-[#DA7756]/10 shadow-sm">
            <LineChart className="h-6 w-6 text-[#DA7756]" strokeWidth={2} />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-neutral-900 sm:text-3xl">
              Feedback Dashboard
            </h1>
            <p className="mt-1 text-sm text-neutral-500 sm:text-base">
              Live feedback overview
            </p>
          </div>
        </header>

        {/* Stat Cards */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:gap-4">

          {/* Total Feedbacks — from API */}
          <Card className="rounded-2xl border-0 bg-sky-100/90 p-5 shadow-md transition-shadow hover:shadow-lg">
            <div className="flex flex-col items-center text-center">
              <MessageSquare className="mb-3 h-7 w-7 text-sky-600" />
              <p className="text-3xl font-bold tabular-nums text-neutral-900">
                {totalFeedbacks}
              </p>
              <p className="mt-1 text-xs font-medium text-neutral-600">
                Total Feedback
              </p>
            </div>
          </Card>

          {/* Average Rating — from API */}
          <Card className="rounded-2xl border-0 bg-violet-100/90 p-5 shadow-md transition-shadow hover:shadow-lg">
            <div className="flex flex-col items-center text-center">
              <div className="mb-3 flex items-center gap-1">
                <Star className="h-6 w-6 fill-amber-400 text-amber-400" />
                <TrendingUp className="h-6 w-6 text-violet-600" />
              </div>
              <p className="text-3xl font-bold tabular-nums text-neutral-900">
                {averageRating.toFixed(1)}
              </p>
              <p className="mt-1 text-xs font-medium text-neutral-600">
                Avg Rating
              </p>
            </div>
          </Card>

          {/* Total Ratings — derived from ratingBreakdown */}
          <Card className="rounded-2xl border-0 bg-orange-100/90 p-5 shadow-md transition-shadow hover:shadow-lg">
            <div className="flex flex-col items-center text-center">
              <Users className="mb-3 h-7 w-7 text-orange-600" />
              <p className="text-3xl font-bold tabular-nums text-neutral-900">
                {totalRatings}
              </p>
              <p className="mt-1 text-xs font-medium text-neutral-600">
                Total Ratings
              </p>
            </div>
          </Card>
        </div>

        <Card className="rounded-2xl border border-[#DA7756]/20 bg-[#DA7756]/10 p-4 shadow-sm sm:p-6">
          <h2 className="mb-4 text-lg font-semibold text-neutral-900">
            Feedback by Department
          </h2>
          <ul className="space-y-3">
            {DEPARTMENTS.map((department) => (
              <li
                key={department.name}
                className="flex items-center gap-3 rounded-xl border border-[#DA7756]/20 bg-[#fef6f4]/90 px-3 py-3 sm:gap-4 sm:px-4"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#DA7756] text-sm font-bold text-white">
                  {department.rank}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-neutral-900">{department.name}</p>
                  <p className="text-xs text-neutral-500">
                    {department.count} feedback{department.count !== 1 ? "s" : ""} received
                  </p>
                </div>
                <span className="shrink-0 rounded-full bg-amber-100 px-2.5 py-1 text-xs font-semibold text-amber-900">
                  {department.rating}
                </span>
              </li>
            ))}
          </ul>
        </Card>

        {/* Rating Breakdown — from API ratingBreakdown */}
        <Card className="rounded-2xl border border-[#DA7756]/20 bg-[#DA7756]/10 p-4 shadow-sm sm:p-6">
          <h2 className="mb-4 text-lg font-semibold text-neutral-900">
            Rating Breakdown
          </h2>
          <div className="space-y-3">
            {(["5", "4", "3", "2", "1"] as const).map((star) => (
              <RatingBar
                key={star}
                label={star}
                count={ratingBreakdown[star]}
                total={totalRatings}
              />
            ))}
          </div>
          <div className="mt-5 flex items-center gap-2">
            <StarRow value={Math.round(averageRating)} />
            <span className="text-sm text-neutral-500">
              {averageRating.toFixed(1)} out of 5 &nbsp;·&nbsp;{totalRatings}{" "}
              ratings
            </span>
          </div>
        </Card>

        {/* AI Summary */}
        <div className="rounded-2xl border border-[#DA7756]/20 bg-[#DA7756]/10 px-4 py-5 shadow-sm sm:px-6 sm:py-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex gap-3 sm:gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-200/70">
                <Wand2 className="h-5 w-5 text-violet-700" strokeWidth={2} />
              </div>
              <div>
                <h2 className="text-base font-semibold text-neutral-900 sm:text-lg">
                  AI-Powered Feedback Analysis
                </h2>
                <p className="mt-1 max-w-xl text-sm text-neutral-600">
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

        {/* Recent Feedbacks — preserve section even when report API has no item rows */}
        <Card className="rounded-2xl border border-[#DA7756]/20 bg-[#DA7756]/10 p-4 shadow-sm sm:p-6">
          <h2 className="mb-4 text-lg font-semibold text-neutral-900">
            Recent Feedback Activity
          </h2>

          {recentFeedbacks.length > 0 ? (
            <ul className="space-y-3">
              {recentFeedbacks.map((row) => (
                <li
                  key={row.id}
                  className="flex flex-col gap-3 rounded-xl border border-[#DA7756]/20 bg-[#fef6f4] p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-neutral-900">{row.comment}</p>
                    <p className="mt-0.5 text-sm text-neutral-500">
                      {formatDate(row.createdAt)}
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-3 sm:justify-end">
                    <StarRow value={row.rating} />
                    <span className="rounded-md bg-orange-100 px-2 py-0.5 text-xs font-medium text-orange-800">
                      {row.id}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="rounded-xl border border-[#DA7756]/20 bg-[#fef6f4] p-5 text-center text-sm text-neutral-600">
              Recent feedback entries are not available in the current dashboard API response.
            </div>
          )}
        </Card>

      </div>
    </div>
  );
};

export default FeedbackDashboard;