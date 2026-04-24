/**
 * Leaderboard.tsx — Full production version with robust API integration
 * Engine and architecture upgraded to match Feedback.tsx.
 * Exact original visual theme and layout preserved, including Tabs styling.
 */

import React, { useEffect, useState } from "react";
import axios, { AxiosError } from "axios";
import {
  useQuery,
  QueryClient,
  QueryClientProvider,
  useQueryErrorResetBoundary,
} from "@tanstack/react-query";
import { z } from "zod";
import {
  AlertCircle,
  BookOpen,
  Calendar,
  CheckCircle2,
  FileText,
  LineChart,
  Loader2,
  Medal,
  Star,
  TrendingUp,
  Trophy,
  MessageSquarePlus,
  RefreshCw,
  X,
} from "lucide-react";
import { GiveFeedbackModal } from "@/components/BusinessCompass/GiveFeedbackModal";
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

// Imports to match Feedback.tsx architecture
import { API_CONFIG, getAuthHeader } from "@/config/apiConfig";
import {
  getEmbeddedOrgId,
  getEmbeddedToken,
  resolveBaseUrlByOrgId,
} from "@/utils/embeddedMode";
import { getUser } from "@/utils/auth";

// ─── React Query Client ────────────────────────────────────────────────────────

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error) => {
        const status = (error as unknown as AppError)?.status;
        if (status === 401 || status === 403 || status === 404) return false;
        return failureCount < 3;
      },
      retryDelay: (attempt) =>
        Math.min(1000 * Math.pow(2, attempt) + Math.random() * 500, 15_000),
      staleTime: 30_000,
      refetchOnWindowFocus: false,
    },
  },
});

// ─── Types & Error Handling ────────────────────────────────────────────────────

export type AppError = {
  message: string;
  status?: number;
  kind: "network" | "auth" | "forbidden" | "notFound" | "server" | "unknown";
};

type FallbackProps = { error: Error; resetErrorBoundary: () => void };
type ErrorBoundaryProps = {
  FallbackComponent: React.ComponentType<FallbackProps>;
  onReset?: () => void;
  children: React.ReactNode;
};
type ErrorBoundaryState = { hasError: boolean; error: Error | null };

class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }
  reset = () => {
    this.props.onReset?.();
    this.setState({ hasError: false, error: null });
  };
  render() {
    if (this.state.hasError && this.state.error) {
      return (
        <this.props.FallbackComponent
          error={this.state.error}
          resetErrorBoundary={this.reset}
        />
      );
    }
    return this.props.children;
  }
}

function normalizeError(error: unknown): AppError {
  if (error && typeof error === "object" && "kind" in error) {
    return error as AppError;
  }
  if (error instanceof AxiosError) {
    const status = error.response?.status;
    const data = error.response?.data as Record<string, unknown> | undefined;
    const raw =
      (typeof data?.message === "string" ? data.message : "") ||
      (typeof data?.error === "string" ? data.error : "") ||
      error.message;

    if (!error.response) {
      return {
        message: "Network error — check your connection and try again.",
        kind: "network",
      };
    }
    if (status === 401) {
      return {
        message: "Your session has expired. Please log in again.",
        status,
        kind: "auth",
      };
    }
    if (status === 403) {
      return {
        message: "You don't have permission to perform this action.",
        status,
        kind: "forbidden",
      };
    }
    if (status === 404) {
      return { message: "Resource not found.", status, kind: "notFound" };
    }
    if (status && status >= 500) {
      return {
        message: raw || "Server error — please try again shortly.",
        status,
        kind: "server",
      };
    }
    return { message: raw || "Unexpected error.", status, kind: "unknown" };
  }
  if (error instanceof Error) {
    return { message: error.message, kind: "unknown" };
  }
  return { message: "An unexpected error occurred.", kind: "unknown" };
}

// ─── Axios Setup ───────────────────────────────────────────────────────────────

let _accessToken: string | null = null;
let _refreshPromise: Promise<string> | null = null;

function getAccessToken(): string {
  if (_accessToken) return _accessToken;
  const embedded = getEmbeddedToken();
  if (embedded) {
    _accessToken = embedded;
    return embedded;
  }
  return getAuthHeader();
}

function clearAccessToken(): void {
  _accessToken = null;
}

const apiClient = axios.create({
  timeout: 30_000,
  headers: { Accept: "application/json" },
});

async function resolveBaseUrl(): Promise<string> {
  const base = API_CONFIG.BASE_URL;
  if (base) return base.replace(/\/+$/, "");

  const embeddedOrgId = getEmbeddedOrgId();
  if (embeddedOrgId) {
    try {
      const resolved = await resolveBaseUrlByOrgId(embeddedOrgId);
      return resolved.replace(/\/+$/, "");
    } catch {
      /* fall through */
    }
  }

  throw {
    message: "API base URL not configured. Please log in again.",
    kind: "unknown",
  } as AppError;
}

apiClient.interceptors.request.use(async (config) => {
  if (!config.baseURL) {
    config.baseURL = await resolveBaseUrl();
  }
  const token = getAccessToken();
  const rawToken = token?.startsWith("Bearer ") ? token.slice(7) : token;
  if (rawToken) {
    config.headers.Authorization = `Bearer ${rawToken}`;
  }
  return config;
});

async function refreshAccessToken(): Promise<string> {
  if (_refreshPromise) return _refreshPromise;
  _refreshPromise = apiClient
    .post<{ access_token: string }>(
      "/auth/refresh",
      {},
      { headers: { "x-skip-auth-retry": "1" } }
    )
    .then(({ data }) => data.access_token)
    .finally(() => {
      _refreshPromise = null;
    });
  return _refreshPromise;
}

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const original = error.config as typeof error.config & {
      _retried?: boolean;
      headers: Record<string, string>;
    };

    if (
      error.response?.status === 401 &&
      !original._retried &&
      !original.headers["x-skip-auth-retry"]
    ) {
      original._retried = true;
      try {
        const newToken = await refreshAccessToken();
        original.headers.Authorization = `Bearer ${newToken}`;
        return apiClient(original);
      } catch {
        clearAccessToken();
        window.dispatchEvent(new CustomEvent("auth:expired"));
      }
    }
    return Promise.reject(normalizeError(error));
  }
);

// ─── Zod Schemas ───────────────────────────────────────────────────────────────

const LeaderboardEntrySchema = z.object({
  user_id: z.coerce.number(),
  name: z.string().catch("Unknown"),
  email: z.string().catch(""),
  daily_points: z.coerce.number().catch(0),
  weekly_points: z.coerce.number().catch(0),
  feedback_points: z.coerce.number().catch(0),
  total_points: z.coerce.number().catch(0),
});

export type LeaderboardEntry = z.infer<typeof LeaderboardEntrySchema>;

// ─── API Hooks ─────────────────────────────────────────────────────────────────

async function fetchLeaderboard(
  timeRange: string
): Promise<LeaderboardEntry[]> {
  try {
    const { data } = await apiClient.get("/business_compass/leaderboard", {
      params: { days: timeRange },
    });
    const rawList = Array.isArray(data?.leaderboard) ? data.leaderboard : [];
    return z.array(LeaderboardEntrySchema).parse(rawList);
  } catch (err) {
    throw normalizeError(err);
  }
}

function useLeaderboard(timeRange: string) {
  return useQuery<LeaderboardEntry[], AppError>({
    queryKey: ["leaderboard", timeRange],
    queryFn: () => fetchLeaderboard(timeRange),
    staleTime: 2 * 60_000, // Cache for 2 minutes
  });
}

// ─── Helper components ────────────────────────────────────────────────────────

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

function LeaderboardLoading() {
  return (
    <div className="flex flex-col items-center justify-center px-4 py-20 text-center sm:py-24">
      <Loader2 className="mb-4 h-10 w-10 animate-spin text-[#DA7756]" />
      <p className="text-sm text-neutral-500">Loading leaderboard…</p>
    </div>
  );
}

function LeaderboardError({
  message,
  onRetry,
}: {
  message: string;
  onRetry?: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center px-4 py-20 text-center sm:py-24">
      <AlertCircle className="mb-4 h-10 w-10 text-red-400" strokeWidth={1.5} />
      <h3 className="text-lg font-bold text-neutral-800">
        Failed to load leaderboard
      </h3>
      <p className="mt-2 max-w-md text-sm text-neutral-500">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-5 inline-flex items-center gap-2 rounded-xl bg-red-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-red-700 transition-colors"
        >
          <RefreshCw className="h-4 w-4" />
          Try Again
        </button>
      )}
    </div>
  );
}

function RankBadge({ rank }: { rank: number }) {
  if (rank === 1)
    return (
      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-400 shadow-sm">
        <Trophy className="h-4 w-4 text-white" strokeWidth={2.5} />
      </span>
    );
  if (rank === 2)
    return (
      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-neutral-300 shadow-sm">
        <Medal className="h-4 w-4 text-white" strokeWidth={2.5} />
      </span>
    );
  if (rank === 3)
    return (
      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-600/80 shadow-sm">
        <Medal className="h-4 w-4 text-white" strokeWidth={2.5} />
      </span>
    );
  return (
    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-neutral-100 text-xs font-bold text-neutral-500">
      {rank}
    </span>
  );
}

function UserAvatar({ name }: { name: string }) {
  const initials = name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0] ?? "")
    .join("")
    .toUpperCase();

  // Deterministic pastel color from name
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const hue = Math.abs(hash) % 360;
  const bg = `hsl(${hue}, 55%, 70%)`;
  const fg = `hsl(${hue}, 40%, 25%)`;

  return (
    <span
      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[11px] font-bold"
      style={{ background: bg, color: fg }}
    >
      {initials || "?"}
    </span>
  );
}

function PointPill({
  value,
  label,
  colorClass,
}: {
  value: number;
  label: string;
  colorClass: string;
}) {
  return (
    <div className={cn("rounded-lg px-2.5 py-1.5 text-center", colorClass)}>
      <p className="text-xs font-bold leading-none">{value}</p>
      <p className="mt-0.5 text-[10px] font-medium leading-none opacity-75">
        {label}
      </p>
    </div>
  );
}

function LeaderboardTable({
  entries,
  onGiveFeedback,
}: {
  entries: LeaderboardEntry[];
  onGiveFeedback: (user: { user_id: number; name: string }) => void;
}) {
  if (entries.length === 0) return <LeaderboardEmptyState />;

  // Sort by total_points descending
  const sorted = [...entries].sort((a, b) => b.total_points - a.total_points);

  return (
    <div className="divide-y divide-neutral-100/80">
      {sorted.map((entry, idx) => {
        const rank = idx + 1;
        const isTopThree = rank <= 3;

        return (
          <div
            key={entry.user_id}
            className={cn(
              "flex items-center gap-3 px-4 py-3.5 sm:px-5 sm:py-4",
              isTopThree && "bg-gradient-to-r from-[#DA7756]/5 to-transparent",
              rank === 1 && "from-amber-50/60"
            )}
          >
            {/* Rank */}
            <div className="shrink-0">
              <RankBadge rank={rank} />
            </div>

            {/* Avatar */}
            <UserAvatar name={entry.name} />

            {/* Name & email */}
            <div className="min-w-0 flex-1">
              <p
                className={cn(
                  "truncate text-sm font-semibold text-neutral-800",
                  rank === 1 && "text-amber-700"
                )}
              >
                {entry.name.trim()}
              </p>
              <p className="truncate text-xs text-neutral-400">{entry.email}</p>
            </div>

            {/* Point breakdown — hidden on very small screens */}
            <div className="hidden shrink-0 gap-1.5 sm:flex">
              <PointPill
                value={entry.daily_points}
                label="Daily"
                colorClass="bg-sky-50 text-sky-700"
              />
              <PointPill
                value={entry.weekly_points}
                label="Weekly"
                colorClass="bg-violet-50 text-violet-700"
              />
              <PointPill
                value={entry.feedback_points}
                label="Feedback"
                colorClass="bg-emerald-50 text-emerald-700"
              />
            </div>

            {/* Total */}
            <div className="flex shrink-0 items-center gap-4 text-right">
              <div className="flex flex-col items-end">
                <p
                  className={cn(
                    "text-base font-extrabold tabular-nums",
                    rank === 1
                      ? "text-amber-500"
                      : rank === 2
                        ? "text-neutral-400"
                        : rank === 3
                          ? "text-amber-700/70"
                          : "text-neutral-700"
                  )}
                >
                  {entry.total_points}
                </p>
                <p className="text-[10px] font-medium text-neutral-400">pts</p>
              </div>

              {/* Add Give Feedback Action */}
              <button
                onClick={() =>
                  onGiveFeedback({ user_id: entry.user_id, name: entry.name })
                }
                title={`Give feedback to ${entry.name}`}
                className="group flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#DA7756]/10 to-transparent p-2 text-[#DA7756] transition-all hover:scale-110 hover:from-[#DA7756] hover:text-white"
              >
                <MessageSquarePlus className="h-5 w-5 group-hover:animate-pulse" />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─── How Scores Work ──────────────────────────────────────────────────────────

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
    "Prioritize weekly reviews; they're worth much more than a single daily report.",
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

// ─── Main Page Component ──────────────────────────────────────────────────────

function LeaderboardPage() {
  const [timeRange, setTimeRange] = useState("30");
  const [selectedUserForFeedback, setSelectedUserForFeedback] = useState<{
    user_id: number;
    name: string;
  } | null>(null);
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);

  const { data: entries = [], isLoading, isError, error, refetch } = useLeaderboard(
    timeRange
  );

  const handleGiveFeedback = (user: { user_id: number; name: string }) => {
    setSelectedUserForFeedback(user);
    setIsFeedbackModalOpen(true);
  };

  // Column header for the leaderboard card
  const tableHeader = !isLoading && !isError && entries.length > 0 && (
    <div className="hidden items-center gap-3 border-b border-neutral-100 px-5 pb-3 pt-4 text-[11px] font-semibold uppercase tracking-wider text-neutral-400 sm:flex">
      <span className="w-8" />
      <span className="w-9" />
      <span className="flex-1">Member</span>
      <div className="flex gap-1.5">
        <span className="w-14 text-center text-sky-500">Daily</span>
        <span className="w-14 text-center text-violet-500">Weekly</span>
        <span className="w-16 text-center text-emerald-500">Feedback</span>
      </div>
      <span className="w-10 text-right">Total</span>
    </div>
  );

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[#f6f4ee] px-4 py-6 sm:px-6">
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
          <TabsList className="inline-flex h-auto p-1.5 w-full items-center justify-start gap-1 rounded-[16px] border border-[rgba(218,119,86,0.18)] bg-[#FFF9F6] shadow-sm sm:w-auto">
            <TabsTrigger
              value="leaderboard"
              className="h-10 rounded-xl px-5 text-sm font-bold text-neutral-600 transition-colors data-[state=active]:bg-[#DA7756] data-[state=active]:text-white data-[state=active]:shadow-sm hover:bg-[rgba(218,119,86,0.08)] data-[state=active]:hover:bg-[#DA7756]"
            >
              <Trophy className="mr-2 h-4 w-4" />
              Leaderboard
            </TabsTrigger>
            <TabsTrigger
              value="how-scores"
              className="h-10 rounded-xl px-5 text-sm font-bold text-neutral-600 transition-colors data-[state=active]:bg-[#DA7756] data-[state=active]:text-white data-[state=active]:shadow-sm hover:bg-[rgba(218,119,86,0.08)] data-[state=active]:hover:bg-[#DA7756]"
            >
              <BookOpen className="mr-2 h-4 w-4" />
              How Scores Work
            </TabsTrigger>
          </TabsList>

          <TabsContent
            value="leaderboard"
            className="mt-4 focus-visible:outline-none"
          >
            <Card className="overflow-hidden rounded-2xl border border-[#DA7756]/20 bg-white shadow-sm">
              {tableHeader}
              {isLoading ? (
                <LeaderboardLoading />
              ) : isError ? (
                <LeaderboardError
                  message={error?.message || "Something went wrong."}
                  onRetry={() => refetch()}
                />
              ) : (
                <LeaderboardTable
                  entries={entries}
                  onGiveFeedback={handleGiveFeedback}
                />
              )}
            </Card>

            {/* Summary bar */}
            {!isLoading && !isError && entries.length > 0 && (
              <p className="mt-3 text-center text-xs text-neutral-400">
                Showing {entries.length} member
                {entries.length !== 1 ? "s" : ""}
              </p>
            )}
          </TabsContent>

          <TabsContent
            value="how-scores"
            className="mt-6 focus-visible:outline-none"
          >
            <HowScoresWorkContent />
          </TabsContent>
        </Tabs>
      </div>

      <GiveFeedbackModal
        isOpen={isFeedbackModalOpen}
        onClose={() => setIsFeedbackModalOpen(false)}
        receiver={selectedUserForFeedback}
        onSuccess={() => {
          setIsFeedbackModalOpen(false);
          setSelectedUserForFeedback(null);
          // Re-trigger leaderboard fetch to reflect updated feedback_points
          refetch();
        }}
      />
    </div>
  );
}

// ─── Root Export ───────────────────────────────────────────────────────────────

const Leaderboard = () => (
  <QueryClientProvider client={queryClient}>
    <LeaderboardPage />
  </QueryClientProvider>
);

export default Leaderboard;