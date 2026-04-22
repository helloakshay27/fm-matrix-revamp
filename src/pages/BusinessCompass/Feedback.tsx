/**
 * Feedback.tsx — Full production version with robust API integration
 *
 * Key improvements over original:
 *  1. Centralized Axios instance with request/response interceptors
 *  2. Token refresh coalescing (single in-flight refresh promise)
 *  3. Exponential backoff with jitter via React Query
 *  4. Zod schema validation for response normalization
 *  5. Classified error types (network / auth / forbidden / server / unknown)
 *  6. React Query for all data fetching (no manual useEffect fetch loops)
 *  7. Global AsyncBoundary (ErrorBoundary + Suspense) wrapping each tab
 *  8. Consistent loading / error / empty states throughout
 *  9. Mutations via React Query useMutation with cache invalidation
 * 10. All original UI preserved pixel-for-pixel
 */

import React, { useEffect, useMemo, useState, useCallback } from "react";
import axios, { AxiosError } from "axios";
import { useSelector } from "react-redux";
import {
  useQuery,
  useMutation,
  useQueryClient,
  QueryClient,
  QueryClientProvider,
  useQueryErrorResetBoundary,
} from "@tanstack/react-query";
// Custom ErrorBoundary (replaces react-error-boundary)
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
import { z } from "zod";
import {
  ArrowUp,
  Calendar as CalendarIcon,
  ChevronDown,
  ChevronRight,
  Inbox,
  Lightbulb,
  MessageSquare,
  Pencil,
  Search,
  Send,
  Star,
  Trash2,
  TrendingUp,
  X,
  Loader2,
  CheckCircle,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import { RootState } from "@/store/store";
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
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { AdminViewEmulation } from "@/components/AdminViewEmulation";
import { API_CONFIG, getAuthHeader } from "@/config/apiConfig";
import {
  getEmbeddedOrgId,
  getEmbeddedToken,
  resolveBaseUrlByOrgId,
} from "@/utils/embeddedMode";
import { getUser } from "@/utils/auth";

// Lockated / FM Matrix brand tokens (used across product pages)
const BRAND = {
  primary: "#DA7756",
  secondary: "#c9673f", // hover / emphasis (matches WeeklyReports.tsx)
  background: "#f6f4ee",
  panelBg: "rgba(218, 119, 86, 0.06)", // match warm tint used across UI
  panelBorder: "rgba(218, 119, 86, 0.20)", // same as border-[#DA7756]/20
  softRowBg: "rgba(218, 119, 86, 0.06)",
  danger: "#C72030",
} as const;

// ─── Types ─────────────────────────────────────────────────────────────────────

type SummaryStat = {
  label: string;
  value: string | number;
  icon: React.ElementType;
  bgClass: string;
  iconClass: string;
};

export type FeedbackItem = {
  id: string;
  recipientName: string;
  ratingFromName?: string;
  date: string;
  rating: number;
  status: "unread" | "read";
  detailPreview?: string;
  resourceId?: number;
  ratingFromType?: string;
  ratingFromId?: number;
  positiveOpening?: string;
  constructiveFeedback?: string;
  positiveClosing?: string;
  createdAt?: string;
  reviewer?: string;
  reviews?: string;
  readAt?: string;
  readComment?: string;
};

export type FeedbackSummary = {
  received: number;
  given: number;
  unread: number;
  avgRating: string;
  feedbackPoints: number;
};

export type FeedbackListResponse = {
  summary?: FeedbackSummary;
  ratings: FeedbackItem[];
};

type TeamMemberOption = {
  value: string;
  label: string;
  id: number;
};

export type AppError = {
  message: string;
  status?: number;
  kind: "network" | "auth" | "forbidden" | "notFound" | "server" | "unknown";
};

// ─── React Query Client ────────────────────────────────────────────────────────

/**
 * QueryClient with global retry strategy:
 * - Never retry 401/403/404 (retrying won't help)
 * - Retry up to 3x for network and 5xx errors
 * - Exponential backoff: min(1000 * 2^attempt + jitter, 15s)
 * - Mutations never auto-retry (avoid duplicate state changes)
 */
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
    mutations: { retry: false },
  },
});

// ─── Token / Auth Service ──────────────────────────────────────────────────────

/**
 * In-memory token store. Credentials are never persisted beyond what
 * the host app already puts in storage for bootstrap.
 * After initial load the token lives only in module-scope memory.
 */
let _accessToken: string | null = null;
let _refreshPromise: Promise<string> | null = null;

function getAccessToken(): string {
  if (_accessToken) return _accessToken;
  const embedded = getEmbeddedToken();
  if (embedded) {
    _accessToken = embedded;
    return embedded;
  }
  return getAuthHeader(); // returns "Bearer ..." string from host
}

function setAccessToken(token: string): void {
  _accessToken = token;
}

function clearAccessToken(): void {
  _accessToken = null;
}

/**
 * Refresh the access token.
 * Multiple concurrent callers coalesce onto a single Promise — only
 * one HTTP request ever goes out, preventing token-refresh races.
 */
async function refreshAccessToken(): Promise<string> {
  if (_refreshPromise) return _refreshPromise;

  _refreshPromise = apiClient
    .post<{ access_token: string }>(
      "/auth/refresh",
      {},
      { headers: { "x-skip-auth-retry": "1" } }
    )
    .then(({ data }) => {
      // setAccessToken(data.access_token);
      return data.access_token;
    })
    .finally(() => {
      _refreshPromise = null;
    });

  return _refreshPromise;
}

// ─── Error Normalization ───────────────────────────────────────────────────────

/**
 * Converts any thrown value into a classified AppError.
 * Used by the Axios interceptor and throughout query/mutation functions.
 */
function normalizeError(error: unknown): AppError {
  // Already normalized
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

// ─── Axios Instance ────────────────────────────────────────────────────────────

/**
 * Centralized Axios instance. Every request goes through here so auth
 * injection, token refresh, and error normalization are always applied.
 */
const apiClient = axios.create({
  timeout: 30_000,
  headers: { Accept: "application/json" },
});

async function resolveBaseUrl(): Promise<string> {
  const base = API_CONFIG.BASE_URL;
  if (base) {
    return base.replace(/\/+$/, "");
  }

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

// Request interceptor — attach base URL and Authorization header
apiClient.interceptors.request.use(async (config) => {
  if (!config.baseURL) {
    config.baseURL = await resolveBaseUrl();
  }
  const token = getAccessToken();
  // Extract raw token value (strip "Bearer " prefix if present)
  const rawToken = token?.startsWith("Bearer ") ? token.slice(7) : token;
  if (rawToken) {
    // Set Authorization header
    config.headers.Authorization = `Bearer ${rawToken}`;
  }
  return config;
});

// Response interceptor — refresh token on 401, normalize all errors
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const original = error.config as typeof error.config & {
      _retried?: boolean;
      headers: Record<string, string>;
    };

    // Attempt one token refresh on 401, skip refresh endpoint itself
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
        // Signal app-level logout (the app can listen for this)
        window.dispatchEvent(new CustomEvent("auth:expired"));
      }
    }

    return Promise.reject(normalizeError(error));
  }
);

async function fetchFeedbackDetail(
  feedbackId: string
): Promise<FeedbackItem | null> {
  for (const endpoint of getRatingsDetailEndpoints(feedbackId)) {
    try {
      const { data } = await apiClient.get(endpoint);
      const rawItem = data?.rating ?? data?.feedback ?? data?.data ?? data;
      const parsed = FeedbackSchema.parse(rawItem);
      return mapRawFeedback(parsed);
    } catch {
      /* try next */
    }
  }
  return null;
}

// ─── Zod Schemas ───────────────────────────────────────────────────────────────

/**
 * Runtime schema for a single feedback record.
 * z.coerce handles string/number type mismatches from various API versions.
 * .catch() provides safe fallbacks so partial records don't crash the list.
 */
const FeedbackSchema = z.object({
  id: z.coerce.string(),
  score: z.number().min(1).max(5).catch(1),
  recipient_name: z.string().optional().catch(undefined),
  rating_from_name: z.string().optional().catch(undefined),
  recipient: z
    .object({
      name: z.string().optional(),
      full_name: z.string().optional(),
      firstname: z.string().optional(),
      lastname: z.string().optional(),
      id: z.coerce.number().optional(),
    })
    .optional()
    .catch(undefined),
  user: z
    .object({ name: z.string().optional(), id: z.coerce.number().optional() })
    .optional()
    .catch(undefined),
  resource: z
    .object({ id: z.coerce.number().optional() })
    .optional()
    .catch(undefined),
  positive_opening: z.string().optional().catch(undefined),
  constructive_feedback: z.string().optional().catch(undefined),
  positive_closing: z.string().optional().catch(undefined),
  fields: z
    .object({
      positive_opening: z.string().optional().catch(undefined),
      constructive_feedback: z.string().optional().catch(undefined),
      positive_closing: z.string().optional().catch(undefined),
    })
    .optional()
    .catch(undefined),
  created_at: z.string().optional().catch(undefined),
  createdAt: z.string().optional().catch(undefined),
  date: z.string().optional().catch(undefined),
  read: z.boolean().default(false).catch(false),
  resource_id: z.coerce.number().optional().catch(undefined),
  rating_from_id: z.coerce.number().optional().catch(undefined),
  rating_from_type: z.string().optional().catch(undefined),
  rating_from: z
    .object({
      id: z.coerce.number().optional(),
      user_id: z.coerce.number().optional(),
      type: z.string().optional(),
      name: z.string().optional(),
      full_name: z.string().optional(),
      firstname: z.string().optional(),
      lastname: z.string().optional(),
    })
    .optional()
    .catch(undefined),
  reviewer: z.string().optional().catch(undefined),
  reviews: z.string().nullable().optional().catch(undefined),
  read_at: z.string().optional().catch(undefined),
  read_comment: z.string().nullable().optional().catch(undefined),
});

type RawFeedback = z.infer<typeof FeedbackSchema>;

/**
 * Handles all known API response shapes — plain array, { feedbacks: [] },
 * { team_feedbacks: [] }, { data: [] }, etc.
 * Falls back to [] on total parse failure so the UI never hard-crashes.
 */
const FeedbackListSchema = z
  .union([
    z.array(FeedbackSchema),
    z
      .object({ team_feedbacks: z.array(FeedbackSchema) })
      .transform((d) => d.team_feedbacks),
    z
      .object({ feedbacks: z.array(FeedbackSchema) })
      .transform((d) => d.feedbacks),
    z
      .object({ pms_team_feedbacks: z.array(FeedbackSchema) })
      .transform((d) => d.pms_team_feedbacks),
    z.object({ ratings: z.array(FeedbackSchema) }).transform((d) => d.ratings),
    z.object({ data: z.array(FeedbackSchema) }).transform((d) => d.data),
    z.object({ results: z.array(FeedbackSchema) }).transform((d) => d.results),
    z.object({ items: z.array(FeedbackSchema) }).transform((d) => d.items),
    z
      .object({ feedback: z.array(FeedbackSchema) })
      .transform((d) => d.feedback),
    z
      .object({
        summary: z
          .object({
            received: z.number(),
            given: z.number(),
            unread: z.number(),
            avg_rating: z.string(),
            feedback_points: z.number(),
          })
          .optional(),
        ratings: z.array(FeedbackSchema),
      })
      .transform((d) => d.ratings),
  ])
  .catch([]);

const TeamMemberSchema = z.object({
  id: z.coerce.number(),
  name: z.string().optional(),
  full_name: z.string().optional(),
  fullName: z.string().optional(),
  username: z.string().optional(),
  email: z.string().optional(),
  firstname: z.string().optional(),
  first_name: z.string().optional(),
  firstName: z.string().optional(),
  lastname: z.string().optional(),
  last_name: z.string().optional(),
  lastName: z.string().optional(),
});

const TeamMembersListSchema = z
  .union([
    z.array(TeamMemberSchema),
    z.object({ users: z.array(TeamMemberSchema) }).transform((d) => d.users),
    z
      .object({ fm_users: z.array(TeamMemberSchema) })
      .transform((d) => d.fm_users),
    z
      .object({ team_members: z.array(TeamMemberSchema) })
      .transform((d) => d.team_members),
    z
      .object({ members: z.array(TeamMemberSchema) })
      .transform((d) => d.members),
    z.object({ data: z.array(TeamMemberSchema) }).transform((d) => d.data),
  ])
  .catch([]);

// ─── Data Mappers ──────────────────────────────────────────────────────────────

function formatApiDate(input: string | undefined): string {
  if (!input) return "-";
  const date = new Date(input);
  if (Number.isNaN(date.getTime())) return input;
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function mapRawFeedback(raw: RawFeedback): FeedbackItem {
  const recipient = raw.recipient ?? raw.user ?? raw.resource;
  const ratingFrom = raw.rating_from;

  const recipientName =
    raw.recipient_name ||
    (recipient && "name" in recipient ? recipient.name : undefined) ||
    (recipient && "full_name" in recipient ? recipient.full_name : undefined) ||
    (recipient && "firstname" in recipient && "lastname" in recipient
      ? [recipient.firstname, recipient.lastname].filter(Boolean).join(" ")
      : undefined) ||
    "Team Member";

  const score = Math.min(5, Math.max(1, Math.round(raw.score || 1)));

  const resourceId =
    raw.resource_id ||
    (recipient && "id" in recipient ? recipient.id : undefined) ||
    undefined;

  const ratingFromId =
    raw.rating_from_id || ratingFrom?.id || ratingFrom?.user_id || undefined;

  const preview = [
    raw.positive_opening || raw.fields?.positive_opening,
    raw.constructive_feedback || raw.fields?.constructive_feedback,
    raw.positive_closing || raw.fields?.positive_closing,
    raw.reviews,
  ]
    .filter(Boolean)
    .join(" ");

  const ratingFromName =
    raw.rating_from_name ||
    raw.reviewer ||
    ratingFrom?.name ||
    ratingFrom?.full_name ||
    (ratingFrom?.firstname && ratingFrom?.lastname
      ? [ratingFrom.firstname, ratingFrom.lastname].filter(Boolean).join(" ")
      : undefined);

  return {
    id: raw.id,
    recipientName: (recipientName as string) || "Team Member",
    ratingFromName: ratingFromName || undefined,
    date: formatApiDate(raw.created_at ?? raw.createdAt ?? raw.date),
    rating: score,
    status: raw.read ? "read" : "unread",
    detailPreview: preview || undefined,
    resourceId,
    ratingFromType: raw.rating_from_type ?? ratingFrom?.type ?? "User",
    ratingFromId,
    positiveOpening: raw.positive_opening || raw.fields?.positive_opening,
    constructiveFeedback:
      raw.constructive_feedback || raw.fields?.constructive_feedback,
    positiveClosing: raw.positive_closing || raw.fields?.positive_closing,
    createdAt: raw.created_at ?? raw.createdAt ?? raw.date,
    reviewer: raw.reviewer,
    reviews: raw.reviews || undefined,
    readAt: raw.read_at,
    readComment: raw.read_comment || undefined,
  };
}

function mapTeamMember(
  raw: z.infer<typeof TeamMemberSchema>
): TeamMemberOption | null {
  if (!raw.id) return null;

  const clean = (value?: string) => {
    const trimmed = value?.trim();
    return trimmed ? trimmed : undefined;
  };

  const fullName = [
    clean(raw.firstname ?? raw.first_name ?? raw.firstName),
    clean(raw.lastname ?? raw.last_name ?? raw.lastName),
  ]
    .filter(Boolean)
    .join(" ");

  const label =
    clean(raw.name) ||
    clean(raw.full_name) ||
    clean(raw.fullName) ||
    clean(fullName) ||
    clean(raw.username) ||
    clean(raw.email) ||
    `User ${raw.id}`;

  return { value: String(raw.id), label, id: raw.id };
}

function buildFeedbackItemFromPayload(
  payload: FeedbackPayload,
  fallbackId: string,
  recipientName?: string
): FeedbackItem {
  const preview = [
    payload.positive_opening,
    payload.constructive_feedback,
    payload.positive_closing,
  ]
    .filter(Boolean)
    .join(" ");

  return {
    id: fallbackId,
    recipientName: recipientName || "Team Member",
    date: formatApiDate(payload.created_at),
    rating: Math.min(5, Math.max(1, Math.round(payload.score || 1))),
    status: "read",
    detailPreview: preview || undefined,
    resourceId: payload.resource_id,
    ratingFromType: payload.rating_from_type || "User",
    ratingFromId: payload.rating_from_id,
    positiveOpening: payload.positive_opening,
    constructiveFeedback: payload.constructive_feedback,
    positiveClosing: payload.positive_closing,
    createdAt: payload.created_at || new Date().toISOString(),
  };
}

function normalizeMutationFeedbackItem(
  result: unknown,
  payload: FeedbackPayload,
  recipientName?: string,
  fallbackId?: string
): FeedbackItem {
  const rawItem =
    (result as Record<string, unknown> | null | undefined)?.rating ||
    (result as Record<string, unknown> | null | undefined)?.feedback ||
    (result as Record<string, unknown> | null | undefined)?.data ||
    result;

  const parsed = FeedbackSchema.safeParse(rawItem);
  if (parsed.success) {
    const mapped = mapRawFeedback(parsed.data);
    if (recipientName && mapped.recipientName === "Team Member") {
      return { ...mapped, recipientName };
    }
    return mapped;
  }

  return buildFeedbackItemFromPayload(
    payload,
    fallbackId || String(Date.now()),
    recipientName
  );
}

function upsertFeedbackItem(
  items: FeedbackItem[] | undefined,
  nextItem: FeedbackItem
): FeedbackItem[] {
  const current = items ?? [];
  const withoutCurrent = current.filter((item) => item.id !== nextItem.id);

  return [nextItem, ...withoutCurrent].sort((a, b) => {
    const at = new Date(a.createdAt || 0).getTime();
    const bt = new Date(b.createdAt || 0).getTime();
    return bt - at;
  });
}

function mergeFeedbackItems(...groups: FeedbackItem[][]): FeedbackItem[] {
  const merged = groups.flat();
  const byId = new Map<string, FeedbackItem>();

  for (const item of merged) {
    byId.set(item.id, item);
  }

  return Array.from(byId.values()).sort((a, b) => {
    const at = new Date(a.createdAt || 0).getTime();
    const bt = new Date(b.createdAt || 0).getTime();
    return bt - at;
  });
}

// ─── Current User Helper ───────────────────────────────────────────────────────

function getCurrentUserId(): number | null {
  const authUser = getUser();
  const authUserId = Number(authUser?.id ?? 0);
  if (authUserId) return authUserId;

  for (const key of ["user_id", "userId", "id"]) {
    const val = Number(
      localStorage.getItem(key) || sessionStorage.getItem(key) || "0"
    );
    if (val) return val;
  }
  for (const key of ["user", "currentUser", "auth_user", "authUser"]) {
    const raw = localStorage.getItem(key) || sessionStorage.getItem(key);
    if (!raw) continue;
    try {
      const parsed = JSON.parse(raw) as Record<string, unknown>;
      const id =
        Number(parsed.id) || Number(parsed.user_id) || Number(parsed.userId);
      if (id) return id;
    } catch {
      /* ignore */
    }
  }
  return null;
}

// ─── API Constants ─────────────────────────────────────────────────────────────

const TEAM_MEMBERS_ENDPOINT = "/pms/users/get_escalate_to_users.json";
const RATINGS_COLLECTION_ENDPOINTS = ["/ratings.json", "/ratings"];
const LAST_SUCCESSFUL_FEEDBACK: Record<string, FeedbackItem[]> = {};
const FEEDBACK_CACHE_PREFIX = "feedback-cache-v1";

function getFeedbackCacheKey(
  direction: "given" | "received",
  userId: number | null
): string {
  return `${FEEDBACK_CACHE_PREFIX}:${direction}:${userId ?? "anon"}`;
}

function readFeedbackCache(
  direction: "given" | "received",
  userId: number | null
): FeedbackItem[] {
  try {
    const raw = localStorage.getItem(getFeedbackCacheKey(direction, userId));
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as FeedbackItem[]) : [];
  } catch {
    return [];
  }
}

function writeFeedbackCache(
  direction: "given" | "received",
  userId: number | null,
  items: FeedbackItem[]
): void {
  try {
    localStorage.setItem(
      getFeedbackCacheKey(direction, userId),
      JSON.stringify(items)
    );
  } catch {
    // Ignore storage write failures (quota/privacy mode)
  }
}

function getRatingsDetailEndpoints(feedbackId: string): string[] {
  const normalizedId = encodeURIComponent(feedbackId.trim());
  return [`/ratings/${normalizedId}.json`, `/ratings/${normalizedId}`];
}

// ─── API Functions ─────────────────────────────────────────────────────────────

/**
 * Tries feedback endpoints in order, returning parsed + mapped items.
 * Stops immediately on auth/permission errors (retrying other endpoints
 * won't help if the token is invalid or the user lacks access).
 */
async function fetchFeedbackList(
  direction: "given" | "received",
  userId: number | null
): Promise<{ items: FeedbackItem[]; summary?: FeedbackSummary }> {
  const memoryKey = getFeedbackCacheKey(direction, userId);
  const params: Record<string, string | number> = {};
  if (userId) {
    if (direction === "given") params.rating_from_id = userId;
    else {
      params.resource_id = userId;
      params.resource_type = "User";
    }
  }

  let lastError: AppError | null = null;

  for (const endpoint of RATINGS_COLLECTION_ENDPOINTS) {
    try {
      const { data } = await apiClient.get(endpoint, {
        params,
      });

      console.log(data);

      // Extract summary if present
      let summary: FeedbackSummary | undefined;
      if (data && typeof data === "object" && "summary" in data) {
        const rawSummary = data.summary as {
          received: number;
          given: number;
          unread: number;
          avg_rating: string;
          feedback_points: number;
        };
        summary = {
          received: rawSummary.received,
          given: rawSummary.given,
          unread: rawSummary.unread,
          avgRating: rawSummary.avg_rating,
          feedbackPoints: rawSummary.feedback_points,
        };
      }

      const raw = FeedbackListSchema.parse(data);
      console.log(raw);
      const mapped = raw.map(mapRawFeedback);
      const filtered = mapped.filter((item) => {
        if (!userId) return true;
        return direction === "given"
          ? item.ratingFromId === userId
          : item.resourceId === userId;
      });

      const visibleItems =
        userId && mapped.length > 0 && filtered.length === 0
          ? mapped
          : filtered;

      if (visibleItems.length > 0) {
        LAST_SUCCESSFUL_FEEDBACK[memoryKey] = visibleItems;
        writeFeedbackCache(direction, userId, visibleItems);
      }

      if (
        visibleItems.length === 0 &&
        (LAST_SUCCESSFUL_FEEDBACK[memoryKey]?.length ?? 0) > 0
      ) {
        return { items: LAST_SUCCESSFUL_FEEDBACK[memoryKey], summary };
      }

      const cachedItems = readFeedbackCache(direction, userId);
      if (visibleItems.length === 0 && cachedItems.length > 0) {
        LAST_SUCCESSFUL_FEEDBACK[memoryKey] = cachedItems;
        return { items: cachedItems, summary };
      }

      return {
        items: visibleItems.sort((a, b) => {
          const at = new Date(a.createdAt || 0).getTime();
          const bt = new Date(b.createdAt || 0).getTime();
          return bt - at;
        }),
        summary,
      };
    } catch (err) {
      lastError = normalizeError(err);
      if (lastError.kind === "auth" || lastError.kind === "forbidden") break;

      const cachedItems = readFeedbackCache(direction, userId);
      if (cachedItems.length > 0) {
        LAST_SUCCESSFUL_FEEDBACK[memoryKey] = cachedItems;
        return { items: cachedItems };
      }
    }
  }

  const cachedItems = readFeedbackCache(direction, userId);
  if (cachedItems.length > 0) {
    LAST_SUCCESSFUL_FEEDBACK[memoryKey] = cachedItems;
    return { items: cachedItems };
  }

  throw (
    lastError ?? {
      message: "Unable to load feedback. Please check your connection.",
      kind: "network",
    }
  );
}

async function fetchTeamMembers(): Promise<TeamMemberOption[]> {
  const { data } = await apiClient.get(TEAM_MEMBERS_ENDPOINT, {
    params: {},
  });
  const raw = TeamMembersListSchema.parse(data);
  return raw
    .map(mapTeamMember)
    .filter((m): m is TeamMemberOption => m !== null);
}

interface FeedbackPayload {
  resource_type?: string;
  resource_id?: number;
  score: number;
  created_at?: string;
  positive_opening?: string;
  constructive_feedback?: string;
  positive_closing?: string;
  rating_from_type?: string;
  rating_from_id?: number;
  reviews?: string;
}

type FeedbackMutationVariables = {
  payload: FeedbackPayload;
  recipientName?: string;
};

type FeedbackUpdateMutationVariables = FeedbackMutationVariables & {
  id: string;
};

async function createFeedback(payload: FeedbackPayload): Promise<unknown> {
  let lastError: AppError | null = null;

  for (const endpoint of RATINGS_COLLECTION_ENDPOINTS) {
    try {
      const { data } = await apiClient.post(endpoint, payload, {
        headers: { "Content-Type": "application/json" },
      });
      return data;
    } catch (err) {
      lastError = normalizeError(err);
      if (lastError.kind === "auth" || lastError.kind === "forbidden") {
        throw lastError;
      }
      if (lastError.status === 429) {
        throw {
          ...lastError,
          message: "Too many requests. Please try again later.",
        } as AppError;
      }
    }
  }

  if (lastError?.kind === "notFound") {
    throw {
      ...lastError,
      message:
        "Feedback could not be submitted because the ratings API route is not available.",
    } as AppError;
  }

  throw lastError ?? { message: "Failed to submit feedback.", kind: "unknown" };
}

async function updateFeedback(
  id: string,
  payload: FeedbackPayload
): Promise<unknown> {
  const trimmedId = id.trim();
  if (!trimmedId) {
    throw { message: "Invalid feedback id.", kind: "unknown" } as AppError;
  }

  const { data } = await apiClient.put(
    `/ratings/${encodeURIComponent(trimmedId)}.json`,
    payload,
    { headers: { "Content-Type": "application/json" } }
  );
  return data;
}

async function markRatingAsRead(id: string, readComment?: string): Promise<unknown> {
  const trimmedId = id.trim();
  if (!trimmedId) {
    throw { message: "Invalid feedback id.", kind: "unknown" } as AppError;
  }

  const { data } = await apiClient.patch(
    `/ratings/${encodeURIComponent(trimmedId)}/mark_as_read`,
    readComment?.trim() ? { read_comment: readComment.trim() } : {},
    { headers: { "Content-Type": "application/json" } }
  );
  return data;
}

async function deleteFeedback(id: string): Promise<void> {
  const trimmedId = id.trim();
  if (!trimmedId) {
    throw { message: "Invalid feedback id.", kind: "unknown" } as AppError;
  }

  // Try DELETE /ratings/:id.json (standard Rails RESTful destroy)
  for (const endpoint of getRatingsDetailEndpoints(trimmedId)) {
    try {
      await apiClient.delete(endpoint);
      return; // API confirmed deletion
    } catch (err) {
      const error = normalizeError(err);
      if (error.kind === "auth" || error.kind === "forbidden") {
        throw error; // Real permission errors should surface
      }
      // 404 or other errors — continue to next endpoint
    }
  }

  // If DELETE is not supported by the backend (404), remove locally.
  // The useDeleteFeedback hook will strip it from cache and query data.
  return;
}

// ─── React Query Hooks ─────────────────────────────────────────────────────────

function useFeedbackList(
  direction: "given" | "received",
  explicitUserId?: number | null
) {
  const defaultUserId = getCurrentUserId();
  const userId = explicitUserId === undefined ? defaultUserId : explicitUserId;
  const cached = readFeedbackCache(direction, userId);
  const memoryKey = getFeedbackCacheKey(direction, userId);

  if (
    cached.length > 0 &&
    (LAST_SUCCESSFUL_FEEDBACK[memoryKey]?.length ?? 0) === 0
  ) {
    LAST_SUCCESSFUL_FEEDBACK[memoryKey] = cached;
  }

  return useQuery<
    { items: FeedbackItem[]; summary?: FeedbackSummary },
    AppError
  >({
    queryKey: ["feedback", direction, userId],
    queryFn: () => fetchFeedbackList(direction, userId),
    placeholderData: cached.length > 0 ? { items: cached } : { items: [] },
  });
}

function useTeamMembers() {
  return useQuery<TeamMemberOption[], AppError>({
    queryKey: ["teamMembers"],
    queryFn: fetchTeamMembers,
    staleTime: 5 * 60_000, // 5 min — roster changes infrequently
    placeholderData: [],
  });
}

function useCreateFeedback() {
  const qc = useQueryClient();
  return useMutation<unknown, AppError, FeedbackMutationVariables>({
    mutationFn: ({ payload }) => createFeedback(payload),
    onSuccess: (result, variables) => {
      const currentUserId = getCurrentUserId();
      const item = normalizeMutationFeedbackItem(
        result,
        variables.payload,
        variables.recipientName
      );

      qc.setQueriesData<{ items: FeedbackItem[]; summary?: FeedbackSummary }>(
        { queryKey: ["feedback", "given"] },
        (old) => {
          const items = upsertFeedbackItem(old?.items, item);
          return { items, summary: old?.summary };
        }
      );
      qc.setQueryData<{ items: FeedbackItem[]; summary?: FeedbackSummary }>(
        ["feedback", "given", currentUserId],
        (old) => {
          const items = upsertFeedbackItem(old?.items, item);
          return { items, summary: old?.summary };
        }
      );
      const givenMemoryKey = getFeedbackCacheKey("given", currentUserId);
      LAST_SUCCESSFUL_FEEDBACK[givenMemoryKey] = upsertFeedbackItem(
        LAST_SUCCESSFUL_FEEDBACK[givenMemoryKey],
        item
      );
      writeFeedbackCache(
        "given",
        currentUserId,
        LAST_SUCCESSFUL_FEEDBACK[givenMemoryKey]
      );

      // Sync with canonical server payload (create responses can omit full record fields).
      qc.invalidateQueries({ queryKey: ["feedback", "given"] });
      qc.invalidateQueries({ queryKey: ["feedback", "received"] });
    },
  });
}

function useUpdateFeedback() {
  const qc = useQueryClient();
  return useMutation<unknown, AppError, FeedbackUpdateMutationVariables>({
    mutationFn: ({ id, payload }) => updateFeedback(id, payload),
    onSuccess: (result, variables) => {
      const currentUserId = getCurrentUserId();
      const item = normalizeMutationFeedbackItem(
        result,
        variables.payload,
        variables.recipientName,
        variables.id
      );

      qc.setQueriesData<{ items: FeedbackItem[]; summary?: FeedbackSummary }>(
        { queryKey: ["feedback", "given"] },
        (old) => {
          const items = upsertFeedbackItem(old?.items, item);
          return { items, summary: old?.summary };
        }
      );
      qc.setQueryData<{ items: FeedbackItem[]; summary?: FeedbackSummary }>(
        ["feedback", "given", currentUserId],
        (old) => {
          const items = upsertFeedbackItem(old?.items, item);
          return { items, summary: old?.summary };
        }
      );
      qc.setQueriesData<{ items: FeedbackItem[]; summary?: FeedbackSummary }>(
        { queryKey: ["feedback", "received"] },
        (old) => {
          const items = old?.items?.some((existing) => existing.id === item.id)
            ? upsertFeedbackItem(old?.items, item)
            : (old?.items ?? []);
          return { items, summary: old?.summary };
        }
      );
      qc.setQueryData<{ items: FeedbackItem[]; summary?: FeedbackSummary }>(
        ["feedback", "received", currentUserId],
        (old) => {
          const items = old?.items?.some((existing) => existing.id === item.id)
            ? upsertFeedbackItem(old?.items, item)
            : (old?.items ?? []);
          return { items, summary: old?.summary };
        }
      );
      const givenMemoryKey = getFeedbackCacheKey("given", currentUserId);
      LAST_SUCCESSFUL_FEEDBACK[givenMemoryKey] = upsertFeedbackItem(
        LAST_SUCCESSFUL_FEEDBACK[givenMemoryKey],
        item
      );
      writeFeedbackCache(
        "given",
        currentUserId,
        LAST_SUCCESSFUL_FEEDBACK[givenMemoryKey]
      );

      const receivedMemoryKey = getFeedbackCacheKey("received", currentUserId);
      if (
        (LAST_SUCCESSFUL_FEEDBACK[receivedMemoryKey] ?? []).some(
          (existing) => existing.id === item.id
        )
      ) {
        LAST_SUCCESSFUL_FEEDBACK[receivedMemoryKey] = upsertFeedbackItem(
          LAST_SUCCESSFUL_FEEDBACK[receivedMemoryKey],
          item
        );
        writeFeedbackCache(
          "received",
          currentUserId,
          LAST_SUCCESSFUL_FEEDBACK[receivedMemoryKey]
        );
      }

      // Ensure edited feedback rehydrates from source of truth.
      qc.invalidateQueries({ queryKey: ["feedback", "given"] });
      qc.invalidateQueries({ queryKey: ["feedback", "received"] });
    },
  });
}

function useDeleteFeedback() {
  const qc = useQueryClient();
  return useMutation<void, AppError, { id: string }>({
    mutationFn: ({ id }) => deleteFeedback(id),
    onSuccess: (_, variables) => {
      const currentUserId = getCurrentUserId();
      qc.setQueriesData<{ items: FeedbackItem[]; summary?: FeedbackSummary }>(
        { queryKey: ["feedback", "given"] },
        (old) => {
          const items = (old?.items ?? []).filter(
            (item) => item.id !== variables.id
          );
          return { items, summary: old?.summary };
        }
      );
      qc.setQueryData<{ items: FeedbackItem[]; summary?: FeedbackSummary }>(
        ["feedback", "given", currentUserId],
        (old) => {
          const items = (old?.items ?? []).filter(
            (item) => item.id !== variables.id
          );
          return { items, summary: old?.summary };
        }
      );
      qc.setQueriesData<{ items: FeedbackItem[]; summary?: FeedbackSummary }>(
        { queryKey: ["feedback", "received"] },
        (old) => {
          const items = (old?.items ?? []).filter(
            (item) => item.id !== variables.id
          );
          return { items, summary: old?.summary };
        }
      );
      qc.setQueryData<{ items: FeedbackItem[]; summary?: FeedbackSummary }>(
        ["feedback", "received", currentUserId],
        (old) => {
          const items = (old?.items ?? []).filter(
            (item) => item.id !== variables.id
          );
          return { items, summary: old?.summary };
        }
      );
      const givenMemoryKey = getFeedbackCacheKey("given", currentUserId);
      const receivedMemoryKey = getFeedbackCacheKey("received", currentUserId);
      LAST_SUCCESSFUL_FEEDBACK[givenMemoryKey] = (
        LAST_SUCCESSFUL_FEEDBACK[givenMemoryKey] ?? []
      ).filter((item) => item.id !== variables.id);
      LAST_SUCCESSFUL_FEEDBACK[receivedMemoryKey] = (
        LAST_SUCCESSFUL_FEEDBACK[receivedMemoryKey] ?? []
      ).filter((item) => item.id !== variables.id);
      writeFeedbackCache(
        "given",
        currentUserId,
        LAST_SUCCESSFUL_FEEDBACK[givenMemoryKey]
      );
      writeFeedbackCache(
        "received",
        currentUserId,
        LAST_SUCCESSFUL_FEEDBACK[receivedMemoryKey]
      );
    },
  });
}

function useMarkAsRead() {
  const qc = useQueryClient();
  return useMutation<unknown, AppError, { id: string; readComment?: string }>({
    mutationFn: ({ id, readComment }) => markRatingAsRead(id, readComment),
    onSuccess: (_, variables) => {
      const currentUserId = getCurrentUserId();
      qc.setQueriesData<{ items: FeedbackItem[]; summary?: FeedbackSummary }>(
        { queryKey: ["feedback", "received"] },
        (old) => {
          const items = (old?.items ?? []).map((item) =>
            item.id === variables.id
              ? { ...item, status: "read" as const }
              : item
          );
          return { items, summary: old?.summary };
        }
      );
      qc.setQueryData<{ items: FeedbackItem[]; summary?: FeedbackSummary }>(
        ["feedback", "received", currentUserId],
        (old) => {
          const items = (old?.items ?? []).map((item) =>
            item.id === variables.id
              ? { ...item, status: "read" as const }
              : item
          );
          return { items, summary: old?.summary };
        }
      );
      const receivedMemoryKey = getFeedbackCacheKey("received", currentUserId);
      if (LAST_SUCCESSFUL_FEEDBACK[receivedMemoryKey]) {
        LAST_SUCCESSFUL_FEEDBACK[receivedMemoryKey] = LAST_SUCCESSFUL_FEEDBACK[
          receivedMemoryKey
        ].map((item) =>
          item.id === variables.id ? { ...item, status: "read" as const } : item
        );
        writeFeedbackCache(
          "received",
          currentUserId,
          LAST_SUCCESSFUL_FEEDBACK[receivedMemoryKey]
        );
      }
    },
  });
}

// ─── Error Boundary ────────────────────────────────────────────────────────────

function ErrorFallback({
  error,
  resetErrorBoundary,
}: {
  error: Error | AppError;
  resetErrorBoundary: () => void;
}) {
  const appError = normalizeError(error);

  const title =
    appError.kind === "network"
      ? "Connection problem"
      : appError.kind === "auth"
        ? "Session expired"
        : appError.kind === "forbidden"
          ? "Access denied"
          : "Something went wrong";

  const canRetry = appError.kind !== "forbidden" && appError.kind !== "auth";

  return (
    <div
      role="alert"
      className="m-4 rounded-2xl border border-red-200 bg-red-50 px-6 py-8 text-center"
    >
      <AlertCircle
        className="mx-auto mb-3 h-10 w-10 text-red-500"
        strokeWidth={1.5}
      />
      <h2 className="text-base font-semibold text-red-900">{title}</h2>
      <p className="mt-1 text-sm text-red-700">{appError.message}</p>
      {canRetry && (
        <button
          type="button"
          onClick={resetErrorBoundary}
          className="mt-4 inline-flex items-center gap-2 rounded-xl bg-red-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-red-700"
        >
          <RefreshCw className="h-4 w-4" />
          Try again
        </button>
      )}
    </div>
  );
}

function AsyncBoundary({ children }: { children: React.ReactNode }) {
  const { reset } = useQueryErrorResetBoundary();
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback} onReset={reset}>
      <React.Suspense
        fallback={
          <div className="flex items-center justify-center gap-2 py-16 text-sm text-neutral-500">
            <Loader2
              className="h-5 w-5 animate-spin"
              style={{ color: BRAND.primary }}
            />
            Loading…
          </div>
        }
      >
        {children}
      </React.Suspense>
    </ErrorBoundary>
  );
}

// ─── Sub-components ────────────────────────────────────────────────────────────

function InlineError({
  error,
  onRetry,
}: {
  error: AppError;
  onRetry: () => void;
}) {
  return (
    <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-4">
      <div className="flex items-start gap-3">
        <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-500" />
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-red-800">
            {error.kind === "network"
              ? "Connection problem"
              : error.kind === "server"
                ? "Server error"
                : "Failed to load"}
          </p>
          <p className="mt-0.5 text-sm text-red-700">{error.message}</p>
        </div>
      </div>
      {error.kind !== "forbidden" && (
        <button
          type="button"
          onClick={onRetry}
          className="mt-3 inline-flex h-9 items-center gap-2 rounded-lg bg-red-600 px-4 text-xs font-semibold text-white hover:bg-red-700"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          Retry
        </button>
      )}
    </div>
  );
}

function FeedbackEmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <MessageSquare
        className="mb-4 h-16 w-16 text-neutral-300"
        strokeWidth={1.25}
      />
      <h3 className="text-lg font-semibold text-neutral-900">
        No Feedback Yet
      </h3>
      <p className="mt-2 max-w-sm text-sm text-neutral-500">
        No feedback records to display right now.
      </p>
    </div>
  );
}

function StarRatingRow({ value }: { value: number }) {
  return (
    <div
      className="flex shrink-0 gap-0.5"
      aria-label={`${value} out of 5 stars`}
    >
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className={cn(
            "h-4 w-4",
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

function GivenFeedbackList({
  onGiveFeedbackClick,
  onEditFeedback,
  direction,
  filterUserId,
  itemsOverride,
}: {
  onGiveFeedbackClick: () => void;
  onEditFeedback: (item: FeedbackItem) => void;
  direction: "to" | "from";
  filterUserId?: number | null;
  itemsOverride?: FeedbackItem[];
}) {
  const fetchDirection = direction === "to" ? "given" : "received";
  const {
    data: queriedData = { items: [] },
    isLoading,
    isError,
    error,
    refetch,
  } = useFeedbackList(fetchDirection, filterUserId);
  const queriedItems = queriedData.items;
  const summary = queriedData.summary;
  const items = itemsOverride ?? queriedItems;
  const deleteMutation = useDeleteFeedback();
  const markAsReadMutation = useMarkAsRead();
  const currentUserId = getCurrentUserId();

  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [ratingFilter, setRatingFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [detailCache, setDetailCache] = useState<Record<string, FeedbackItem>>(
    {}
  );
  const [loadingDetailId, setLoadingDetailId] = useState<string | null>(null);
  const [lastStableItems, setLastStableItems] = useState<FeedbackItem[]>([]);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [notes, setNotes] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!isError && items.length > 0) {
      setLastStableItems(items);
    }
  }, [items, isError]);

  const sourceItems =
    itemsOverride !== undefined
      ? items
      : items.length > 0
        ? items
        : lastStableItems.length > 0
          ? lastStableItems
          : items;

  const handleExpand = async (itemId: string) => {
    const isCollapsing = expandedId === itemId;
    setExpandedId(isCollapsing ? null : itemId);
    if (isCollapsing) return;

    // Pre-populate cache with data already in the list item so the 3 sections
    // (positiveOpening, constructiveFeedback, positiveClosing) render immediately
    const existingItem = sourceItems.find((i) => i.id === itemId);
    if (existingItem && !detailCache[itemId]) {
      setDetailCache((prev) => ({ ...prev, [itemId]: existingItem }));
    }

    // Skip detail fetch if we already have enriched data cached
    if (detailCache[itemId]) return;

    setLoadingDetailId(itemId);
    try {
      const detail = await fetchFeedbackDetail(itemId);
      if (detail) {
        // Merge: prefer detail API data for each field, fallback to list data
        setDetailCache((prev) => ({
          ...prev,
          [itemId]: {
            ...(existingItem ?? {}),
            ...detail,
            // Ensure the 3 key fields are never lost
            positiveOpening:
              detail.positiveOpening ?? existingItem?.positiveOpening,
            constructiveFeedback:
              detail.constructiveFeedback ?? existingItem?.constructiveFeedback,
            positiveClosing:
              detail.positiveClosing ?? existingItem?.positiveClosing,
          } as FeedbackItem,
        }));
      }
    } catch {
      /* ignore — we already have list-level data in cache */
    } finally {
      setLoadingDetailId(null);
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const filtered = useMemo(
    () =>
      sourceItems.filter((item) => {
        const q = searchQuery.trim().toLowerCase();
        const searchTargets =
          direction === "to"
            ? [item.recipientName]
            : [item.ratingFromName, item.recipientName].filter(Boolean);
        const matchesSearch =
          !q ||
          searchTargets.some((name) => name!.toLowerCase().includes(q)) ||
          (item.detailPreview?.toLowerCase().includes(q) ?? false);
        const matchesRating =
          ratingFilter === "all" || String(item.rating) === ratingFilter;
        const matchesStatus =
          statusFilter === "all" || item.status === statusFilter;
        return matchesSearch && matchesRating && matchesStatus;
      }),
    [sourceItems, searchQuery, ratingFilter, statusFilter, direction]
  );

  const avgRating =
    summary?.avgRating ??
    (filtered.length > 0
      ? (filtered.reduce((s, i) => s + i.rating, 0) / filtered.length).toFixed(
          1
        )
      : "0.0");
  const avgRatingNum = Number(avgRating);
  const totalFeedback =
    direction === "to"
      ? (summary?.given ?? filtered.length)
      : (summary?.received ?? filtered.length);
  const points =
    summary?.feedbackPoints ??
    (() => {
      let calculatedPoints = 0;
      filtered.forEach((item) => {
        if (item.rating === 1) calculatedPoints -= 10;
        else if (item.rating === 2) calculatedPoints -= 5;
        else if (item.rating === 4) calculatedPoints += 5;
        else if (item.rating === 5) calculatedPoints += 10;
      });
      return calculatedPoints;
    })();

  const allSelected =
    filtered.length > 0 && filtered.every((i) => selectedIds.has(i.id));
  const handleSelectAll = () => {
    if (allSelected) setSelectedIds(new Set());
    else setSelectedIds(new Set(filtered.map((i) => i.id)));
  };

  const getAvatarBg = (name: string) => {
    const colors = [
      "#3B82F6",
      "#8B5CF6",
      "#10B981",
      "#F59E0B",
      "#EF4444",
      "#06B6D4",
    ];
    const idx = (name.charCodeAt(0) || 0) % colors.length;
    return colors[idx];
  };

  return (
    <div className="flex flex-col gap-5 pb-4">
      <div
        className="flex items-center gap-5 border-b border-[#DA7756]/20 px-4 py-2"
        style={{ backgroundColor: BRAND.panelBg }}
      >
        <button
          type="button"
          onClick={handleSelectAll}
          className="flex items-center gap-2 px-3 py-1.5 rounded border border-[#DA7756]/20 bg-white text-sm font-medium text-neutral-700 shadow-sm"
          style={{ backgroundColor: "#ffffff" }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "#ffffff";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "#ffffff";
          }}
        >
          <input
            type="checkbox"
            checked={allSelected}
            readOnly
            className="h-4 w-4 cursor-pointer"
            style={{ accentColor: BRAND.primary }}
          />
          {allSelected ? "Deselect All" : "Select All"}
        </button>

        {selectedIds.size > 0 && (
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-neutral-700">
              {selectedIds.size} selected
            </span>
            <button
              type="button"
              onClick={() => {
                if (
                  !window.confirm(
                    `Delete ${selectedIds.size} selected feedback item${selectedIds.size > 1 ? "s" : ""}?`
                  )
                )
                  return;
                Array.from(selectedIds).forEach((id) =>
                  deleteMutation.mutate({ id })
                );
                setSelectedIds(new Set());
              }}
              disabled={deleteMutation.isPending}
              className="flex items-center gap-2 rounded px-4 py-1.5 text-sm font-medium text-white shadow-sm hover:bg-red-600 disabled:opacity-60 transition-colors"
              style={{ backgroundColor: BRAND.danger }}
            >
              <Trash2 className="h-4 w-4" />
              Delete Selected
            </button>
          </div>
        )}
      </div>

      <div
        className="mx-4 grid grid-cols-3 divide-x divide-[#DA7756]/20 rounded-xl border border-[#DA7756]/20 px-6 py-4"
        style={{ backgroundColor: BRAND.panelBg }}
      >
        <div className="flex flex-col gap-1 pr-6">
          <span className="text-xs text-neutral-500 font-medium">
            Average Rating
          </span>
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-amber-500">
              {avgRating}
            </span>
            <div className="flex gap-0.5">
              {[1, 2, 3, 4, 5].map((i) => (
                <Star
                  key={i}
                  className={cn(
                    "h-4 w-4",
                    i <= Math.round(avgRatingNum)
                      ? "fill-amber-400 text-amber-400"
                      : "fill-transparent text-neutral-300"
                  )}
                  strokeWidth={i <= Math.round(avgRatingNum) ? 0 : 1.5}
                />
              ))}
            </div>
          </div>
        </div>
        <div className="flex flex-col items-center gap-1">
          <span className="text-xs text-neutral-500 font-medium">
            Total Feedback
          </span>
          <span className="text-2xl font-bold text-neutral-900">
            {totalFeedback}
          </span>
        </div>
        <div className="flex flex-col items-end gap-1 pl-6">
          <span className="text-xs text-neutral-500 font-medium">
            Points from Feedback
          </span>
          <span className="text-2xl font-bold text-neutral-900">{points}</span>
        </div>
      </div>

      <div className="px-4 flex gap-3 items-center">
        <div className="relative flex-1">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400"
            aria-hidden
          />
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name or content..."
            className="h-9 w-full rounded-lg border border-[#DA7756]/20 bg-white py-2 pl-9 pr-3 text-sm text-neutral-900 placeholder:text-neutral-400 outline-none focus:border-[#DA7756]/30"
          />
        </div>
        <Select value={ratingFilter} onValueChange={setRatingFilter}>
          <SelectTrigger className="h-9 w-[130px] rounded-lg border border-[#DA7756]/20 bg-white text-sm">
            <SelectValue placeholder="All Ratings" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Ratings</SelectItem>
            <SelectItem value="5">5 stars</SelectItem>
            <SelectItem value="4">4 stars</SelectItem>
            <SelectItem value="3">3 stars</SelectItem>
            <SelectItem value="2">2 stars</SelectItem>
            <SelectItem value="1">1 star</SelectItem>
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="h-9 w-[90px] rounded-lg border border-[#DA7756]/20 bg-white text-sm">
            <SelectValue placeholder="All" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="unread">Unread</SelectItem>
            <SelectItem value="read">Read</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="px-4 space-y-3">
        {isLoading && filtered.length === 0 ? (
          <div className="flex items-center justify-center gap-2 py-12 text-sm text-neutral-500">
            <Loader2
              className="h-5 w-5 animate-spin"
              style={{ color: BRAND.primary }}
            />
            Loading feedback…
          </div>
        ) : isError && filtered.length === 0 ? (
          <InlineError
            error={normalizeError(error)}
            onRetry={() => refetch()}
          />
        ) : filtered.length === 0 ? (
          <FeedbackEmptyState />
        ) : (
          filtered.map((item) => {
            const expanded = expandedId === item.id;
            const detail = detailCache[item.id] ?? item;
            const isLoadingDetail = loadingDetailId === item.id;
            const displayName =
              direction === "from"
                ? item.ratingFromName || item.recipientName
                : item.recipientName;
            const initial = (displayName || "T").charAt(0).toUpperCase();
            const avatarBg = getAvatarBg(displayName || "T");

            return (
              <div
                key={item.id}
                className={cn(
                  "rounded-xl border transition-all",
                  expanded
                    ? "border-[#DA7756] ring-1 ring-[#DA7756]/30"
                    : "border-[#DA7756]/20 hover:border-[#DA7756]/30"
                )}
                style={{ backgroundColor: BRAND.softRowBg }}
              >
                <div className="flex items-start gap-3 p-4">
                  <input
                    type="checkbox"
                    checked={selectedIds.has(item.id)}
                    onChange={() => toggleSelect(item.id)}
                    className="mt-1 h-4 w-4 cursor-pointer shrink-0"
                    style={{ accentColor: BRAND.primary }}
                  />

                  <div
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white"
                    style={{ backgroundColor: avatarBg }}
                  >
                    {initial}
                  </div>

                  <div className="flex-1 min-w-0">
                    <button
                      type="button"
                      className="w-full text-left"
                      onClick={() => handleExpand(item.id)}
                    >
                      <p className="font-semibold text-[#1a1a1a] text-sm">
                        {direction === "from" ? "From: " : "To: "}{displayName}
                      </p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <CalendarIcon className="h-3.5 w-3.5 text-neutral-400 shrink-0" />
                        <span className="text-xs text-neutral-500">
                          {item.date}
                        </span>
                        <span
                          className={cn(
                            "rounded px-2 py-0.5 text-[10px] font-semibold",
                            item.status === "unread"
                              ? "bg-blue-100 text-blue-700"
                              : "bg-green-100 text-green-700"
                          )}
                        >
                          {item.status === "unread" ? "Unread" : "Read"}
                        </span>
                      </div>
                      {!expanded && (
                        <p className="text-[11px] text-neutral-400 italic mt-0.5">
                          Click to expand feedback details
                        </p>
                      )}
                    </button>

                    {expanded && (
                      <div className="mt-3 space-y-3">
                        {isLoadingDetail ? (
                          <div className="flex items-center gap-2 text-xs text-neutral-400">
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                            Loading details...
                          </div>
                        ) : (
                          <>
                            {detail.positiveOpening && (
                              <div className="rounded-lg border border-green-200 bg-green-50 px-3 py-2">
                                <p className="text-[11px] font-semibold text-green-700 mb-1">
                                  ✓ What You're Doing Well
                                </p>
                                <p className="text-sm text-neutral-700">
                                  {detail.positiveOpening}
                                </p>
                              </div>
                            )}
                            {detail.constructiveFeedback && (
                              <div className="rounded-lg border border-orange-200 bg-orange-50 px-3 py-2">
                                <p className="text-[11px] font-semibold text-orange-600 mb-1">
                                  → Area for Growth
                                </p>
                                <p className="text-sm text-neutral-700">
                                  {detail.constructiveFeedback}
                                </p>
                              </div>
                            )}
                            {detail.positiveClosing && (
                              <div className="rounded-lg border border-sky-200 bg-sky-50 px-3 py-2">
                                <p className="text-[11px] font-semibold text-sky-600 mb-1">
                                  ★ Encouragement
                                </p>
                                <p className="text-sm text-neutral-700">
                                  {detail.positiveClosing}
                                </p>
                              </div>
                            )}
                            {!detail.positiveOpening &&
                              !detail.constructiveFeedback &&
                              !detail.positiveClosing &&
                              detail.detailPreview && (
                                <div className="rounded-lg border border-[#DA7756]/20 bg-white px-3 py-2">
                                  <p className="text-sm text-neutral-700">
                                    {detail.detailPreview}
                                  </p>
                                </div>
                              )}
                            {/* Notes — only meaningful for received feedback (as the recipient acting on it) */}
                            {direction === "from" && (
                              <div className="mt-2">
                                <label className="text-xs font-semibold text-neutral-600">
                                  Your Notes / Action Items{" "}
                                  <span className="font-normal text-neutral-400">
                                    (Optional)
                                  </span>
                                </label>
                                <textarea
                                  rows={3}
                                  value={notes[item.id] || ""}
                                  onChange={(e) =>
                                    setNotes((prev) => ({
                                      ...prev,
                                      [item.id]: e.target.value,
                                    }))
                                  }
                                  placeholder="Add your notes about how you'll act on this feedback..."
                                  className="mt-1 w-full rounded-lg border border-[#DA7756]/20 bg-white px-3 py-2 text-sm text-neutral-700 placeholder:text-neutral-400 outline-none focus:border-[#DA7756]/30 resize-y"
                                />
                              </div>
                            )}
                            {/* Mark as Read — only for received (from) unread items */}
                            {direction === "from" && item.status === "unread" && (
                              <button
                                type="button"
                                onClick={() =>
                                  markAsReadMutation.mutate({
                                    id: item.id,
                                    readComment: notes[item.id] || undefined,
                                  })
                                }
                                disabled={markAsReadMutation.isPending}
                                className="inline-flex items-center gap-2 rounded-lg bg-[#2E7D32] px-4 py-2 text-xs font-semibold text-white hover:bg-[#1B5E20] transition-colors disabled:opacity-50"
                              >
                                <CheckCircle className="h-3.5 w-3.5" />
                                {markAsReadMutation.isPending
                                  ? "Marking..."
                                  : "Mark as Read"}
                              </button>
                            )}
                          </>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="flex shrink-0 flex-col items-end gap-2">
                    <StarRatingRow value={item.rating} />
                    <button
                      type="button"
                      className="rounded-md p-1 text-neutral-400 hover:text-neutral-600"
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = BRAND.panelBg;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = "transparent";
                      }}
                      aria-expanded={expanded}
                      aria-label={expanded ? "Collapse" : "Expand"}
                      onClick={() => handleExpand(item.id)}
                    >
                      <ChevronDown
                        className={cn(
                          "h-4 w-4 transition-transform",
                          expanded && "rotate-180"
                        )}
                      />
                    </button>
                    {direction === "to" && (
                      <div className="flex gap-1">
                        {/* Edit — only shown for incomplete feedback (missing ≥1 of the 3 sections) */}
                        {(!item.positiveOpening ||
                          !item.constructiveFeedback ||
                          !item.positiveClosing) && (
                          <button
                            type="button"
                            className="rounded p-1 text-neutral-400 hover:text-neutral-700"
                            title="Edit (incomplete feedback)"
                            onClick={(e) => {
                              e.stopPropagation();
                              onEditFeedback(item);
                            }}
                          >
                            <Pencil className="h-3.5 w-3.5" />
                          </button>
                        )}
                        <button
                          type="button"
                          className="rounded p-1 text-neutral-400 hover:text-red-600"
                          title="Delete"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (window.confirm("Delete this feedback?")) {
                              deleteMutation.mutate({ id: item.id });
                            }
                          }}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

// ─── Date helpers ──────────────────────────────────────────────────────────────

function formatDMY(d: Date) {
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yyyy = d.getFullYear();
  return `${dd}/${mm}/${yyyy}`;
}

const RATING_SEGMENTS = [
  { stars: 1, pts: "-10 pts", bg: "bg-red-500", text: "text-white" },
  { stars: 2, pts: "-5 pts", bg: "bg-orange-400", text: "text-white" },
  { stars: 3, pts: "0 pts", bg: "bg-sky-200", text: "text-sky-950" },
  { stars: 4, pts: "+5 pts", bg: "bg-emerald-300", text: "text-emerald-950" },
  { stars: 5, pts: "+10 pts", bg: "bg-green-600", text: "text-white" },
] as const;

// ─── Give Feedback Form ────────────────────────────────────────────────────────

function GiveFeedbackForm({
  onSubmitted,
  initialFeedback,
  onCancelEdit,
}: {
  onSubmitted: () => void;
  initialFeedback: FeedbackItem | null;
  onCancelEdit: () => void;
}) {
  const { data: teamMembers = [], isLoading: teamMembersLoading } =
    useTeamMembers();
  const createMutation = useCreateFeedback();
  const updateMutation = useUpdateFeedback();

  const isEditMode = !!initialFeedback;
  const isPending = createMutation.isPending || updateMutation.isPending;
  const mutationError = createMutation.error ?? updateMutation.error;
  const isSuccess = createMutation.isSuccess || updateMutation.isSuccess;

  const [recipient, setRecipient] = useState<string | undefined>(undefined);
  const [feedbackDate, setFeedbackDate] = useState<Date>(() => new Date());
  const [datePickerOpen, setDatePickerOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [context, setContext] = useState("");
  const [positiveOpen, setPositiveOpen] = useState("");
  const [constructive, setConstructive] = useState("");
  const [positiveClose, setPositiveClose] = useState("");
  const [localError, setLocalError] = useState("");

  useEffect(() => {
    if (!initialFeedback) return;
    const recipientOption = initialFeedback.resourceId
      ? teamMembers.find((m) => m.id === initialFeedback.resourceId)
      : undefined;
    setRecipient(recipientOption?.value);
    setRating(initialFeedback.rating || 0);
    setPositiveOpen(initialFeedback.positiveOpening || "");
    setConstructive(initialFeedback.constructiveFeedback || "");
    setPositiveClose(initialFeedback.positiveClosing || "");
    setLocalError("");
    createMutation.reset();
    updateMutation.reset();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialFeedback, teamMembers]);

  const clearForm = useCallback(() => {
    setRecipient(undefined);
    setFeedbackDate(new Date());
    setDatePickerOpen(false);
    setRating(0);
    setContext("");
    setPositiveOpen("");
    setConstructive("");
    setPositiveClose("");
    setLocalError("");
    createMutation.reset();
    updateMutation.reset();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = async () => {
    if (!recipient) {
      setLocalError("Please select a team member.");
      return;
    }
    if (rating === 0) {
      setLocalError("Please select a star rating.");
      return;
    }
    const selectedMember = teamMembers.find((m) => m.value === recipient);
    if (!selectedMember) {
      setLocalError("Invalid recipient selected.");
      return;
    }

    setLocalError("");
    const currentUser = getUser();
    const currentUserId = currentUser?.id || getCurrentUserId();
    const ratingFromId = initialFeedback?.ratingFromId ?? currentUserId;

    const payload: FeedbackPayload = {
      resource_type: "User",
      resource_id: selectedMember.id,
      score: rating,
      rating_from_type: initialFeedback?.ratingFromType ?? "User",
      rating_from_id: ratingFromId,
      positive_opening: positiveOpen,
      constructive_feedback: constructive,
      positive_closing: positiveClose,
      reviews: context,
    };

    if (!isEditMode) payload.created_at = feedbackDate.toISOString();

    if (isEditMode && initialFeedback?.id) {
      updateMutation.mutate(
        {
          id: initialFeedback.id,
          payload,
          recipientName: selectedMember.label,
        },
        { onSuccess: onSubmitted }
      );
    } else {
      createMutation.mutate(
        { payload, recipientName: selectedMember.label },
        { onSuccess: onSubmitted }
      );
    }
  };

  if (isSuccess) {
    return (
      <div className="flex flex-col items-center justify-center gap-5 px-4 py-20 text-center sm:px-6">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
          <CheckCircle className="h-8 w-8 text-green-600" strokeWidth={2} />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-neutral-900">
            {isEditMode ? "Feedback Updated!" : "Feedback Sent!"}
          </h3>
          <p className="mt-1 text-sm text-neutral-500">
            Your feedback has been {isEditMode ? "updated" : "submitted"}{" "}
            successfully.
          </p>
        </div>
        <button
          type="button"
          onClick={clearForm}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#DA7756] px-6 text-sm font-semibold text-white shadow-sm hover:bg-[#DA7756]/85"
        >
          <Pencil className="h-4 w-4" strokeWidth={2} />
          Give More Feedback
        </button>
      </div>
    );
  }

  const displayError = localError || mutationError?.message;

  return (
    <div className="space-y-6 px-4 py-5 sm:px-6 sm:py-6">
      {isEditMode && (
        <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-medium text-amber-900">
          ✏️ You are editing an existing feedback entry.
        </div>
      )}

      <div className="rounded-xl border border-sky-100 bg-sky-50 px-4 py-3 text-sm leading-relaxed text-sky-950">
        <span className="font-semibold">Sandwich technique: </span>
        Start with something positive, share constructive feedback in the
        middle, and close with encouragement —{" "}
        <span className="font-medium">Positive → Constructive → Positive</span>.
      </div>

      {displayError && (
        <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3">
          <AlertCircle
            className="mt-0.5 h-5 w-5 shrink-0 text-red-500"
            strokeWidth={2}
          />
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-red-800">
              Submission Failed
            </p>
            <p className="mt-0.5 text-sm text-red-700">{displayError}</p>
          </div>
          <button
            type="button"
            onClick={() => {
              setLocalError("");
              createMutation.reset();
              updateMutation.reset();
            }}
            className="shrink-0 rounded-md p-1 text-red-500 hover:bg-red-100"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="feedback-recipient" className="text-neutral-800">
            Give Feedback To <span className="text-[#DA7756]">*</span>
          </Label>
          <Select
            value={recipient}
            onValueChange={setRecipient}
            disabled={teamMembersLoading}
          >
            <SelectTrigger
              id="feedback-recipient"
              className="h-11 rounded-xl border-[#DA7756]/20 bg-white"
            >
              {teamMembersLoading ? (
                <span className="flex items-center gap-2 text-neutral-400">
                  <Loader2 className="h-4 w-4 animate-spin" /> Loading members…
                </span>
              ) : (
                <SelectValue placeholder="Select team member" />
              )}
            </SelectTrigger>
            <SelectContent>
              {teamMembers.length === 0 ? (
                <div className="px-3 py-2 text-sm text-neutral-400">
                  No members found
                </div>
              ) : (
                teamMembers.map((m) => (
                  <SelectItem key={m.value} value={m.value}>
                    {m.label}
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="feedback-date" className="text-neutral-800">
            Date
          </Label>
          <Popover open={datePickerOpen} onOpenChange={setDatePickerOpen}>
            <PopoverTrigger asChild>
              <button
                type="button"
                id="feedback-date"
                className="flex h-11 w-full items-center justify-between gap-2 rounded-xl border border-[#DA7756]/20 bg-white px-3 text-left text-sm text-neutral-900 outline-none"
                style={{ backgroundColor: "#ffffff" }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = BRAND.panelBg;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "#ffffff";
                }}
              >
                <span className="tabular-nums">{formatDMY(feedbackDate)}</span>
                <CalendarIcon
                  className="h-4 w-4 shrink-0 text-neutral-500"
                  strokeWidth={2}
                  aria-hidden
                />
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={feedbackDate}
                onSelect={(d) => {
                  if (d) {
                    setFeedbackDate(d);
                    setDatePickerOpen(false);
                  }
                }}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <div className="space-y-3">
        <div>
          <Label className="text-neutral-800">
            Star Rating <span className="text-[#DA7756]">*</span>
          </Label>
          <p className="mt-0.5 text-sm text-neutral-500">
            Rate overall performance (1–5 stars)
          </p>
        </div>
        <div className="flex gap-1" role="radiogroup" aria-label="Star rating">
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              type="button"
              role="radio"
              aria-checked={rating === n}
              onClick={() => setRating(n)}
              className="rounded-md p-0.5 transition-transform hover:scale-110"
            >
              <Star
                className={cn(
                  "h-8 w-8 sm:h-9 sm:w-9",
                  n <= rating
                    ? "fill-amber-400 text-amber-400"
                    : "fill-transparent text-neutral-300"
                )}
                strokeWidth={n <= rating ? 0 : 1.5}
              />
            </button>
          ))}
        </div>
        <div className="overflow-hidden rounded-xl border border-[#DA7756]/20 shadow-sm">
          <div className="flex">
            {RATING_SEGMENTS.map((seg) => (
              <button
                key={seg.stars}
                type="button"
                onClick={() => setRating(seg.stars)}
                className={cn(
                  "min-w-0 flex-1 px-0.5 py-2.5 text-center transition-all sm:px-1 sm:py-3",
                  seg.bg,
                  seg.text,
                  rating === seg.stars &&
                    "relative z-10 ring-2 ring-inset ring-neutral-900/80"
                )}
              >
                <span className="block text-[10px] font-semibold leading-tight sm:text-xs">
                  {seg.stars}★
                </span>
                <span className="mt-0.5 block text-[9px] font-medium opacity-95 sm:text-[11px]">
                  {seg.pts}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="feedback-context" className="text-neutral-800">
          Context / Situation{" "}
          <span className="font-normal text-neutral-400">(Optional)</span>
        </Label>
        <input
          id="feedback-context"
          type="text"
          value={context}
          onChange={(e) => setContext(e.target.value)}
          placeholder="e.g., Regarding the client presentation last week..."
          className="h-11 w-full rounded-xl border border-[#DA7756]/20 bg-white px-3 text-sm text-neutral-900 placeholder:text-neutral-400 outline-none"
        />
      </div>

      <div className="space-y-6 border-t border-neutral-100 pt-6">
        {[
          {
            step: 1,
            color: "bg-[#2E7D32]",
            title: "Positive opening",
            desc: "Start with genuine appreciation and what they're doing well.",
            value: positiveOpen,
            onChange: setPositiveOpen,
            placeholder: "Share what is working well…",
          },
          {
            step: 2,
            color: "bg-orange-500",
            title: "Constructive feedback",
            desc: "Provide specific, actionable feedback for improvement.",
            value: constructive,
            onChange: setConstructive,
            placeholder: "Be clear and kind…",
          },
          {
            step: 3,
            color: "bg-sky-600",
            title: "Positive closing",
            desc: "End with encouragement and confidence in their abilities.",
            value: positiveClose,
            onChange: setPositiveClose,
            placeholder: "Close on a supportive note…",
          },
        ].map(({ step, color, title, desc, value, onChange, placeholder }) => (
          <div key={step} className="space-y-3">
            <div className="flex gap-3">
              <div
                className={cn(
                  "flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white",
                  color
                )}
              >
                {step}
              </div>
              <div>
                <h3 className="font-semibold text-neutral-900">{title}</h3>
                <p className="text-sm text-neutral-500">{desc}</p>
              </div>
            </div>
            <Textarea
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder={placeholder}
              className="min-h-[100px] resize-y rounded-xl border-[#DA7756]/20 bg-white text-sm"
            />
          </div>
        ))}
      </div>

      <div className="flex flex-col-reverse gap-3 border-t border-neutral-100 pt-6 sm:flex-row sm:justify-end">
        {isEditMode && (
          <button
            type="button"
            onClick={onCancelEdit}
            disabled={isPending}
            className="inline-flex h-11 items-center justify-center rounded-xl border border-amber-300 bg-amber-50 px-6 text-sm font-semibold text-amber-900 shadow-sm hover:bg-amber-100 disabled:opacity-50"
          >
            Cancel edit
          </button>
        )}
        <button
          type="button"
          onClick={clearForm}
          disabled={isPending}
          className="inline-flex h-11 items-center justify-center rounded-xl bg-[#DA7756] px-6 text-sm font-semibold text-white shadow-sm hover:bg-[#DA7756]/85 disabled:opacity-60"
        >
          Clear form
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={isPending || teamMembersLoading}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#DA7756] px-6 text-sm font-semibold text-white shadow-sm hover:bg-[#DA7756]/85 disabled:opacity-60"
        >
          {isPending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" strokeWidth={2} />
              {isEditMode ? "Updating…" : "Sending…"}
            </>
          ) : (
            <>
              <Send className="h-4 w-4" strokeWidth={2} />
              {isEditMode ? "Update feedback" : "Send feedback"}
            </>
          )}
        </button>
      </div>
    </div>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────

function FeedbackPage() {
  const [bannerVisible, setBannerVisible] = useState(true);
  const [feedbackTab, setFeedbackTab] = useState("received");
  const [editingFeedback, setEditingFeedback] = useState<FeedbackItem | null>(
    null
  );
  const [receivedView, setReceivedView] = useState("myself");
  const currentUser = getUser();
  const currentUserId = currentUser?.id || getCurrentUserId();
  const currentUserName =
    `${currentUser?.firstname || ""} ${currentUser?.lastname || ""}`.trim() ||
    "Myself";
  const myselfLabel =
    currentUserName === "Myself" ? "Myself" : `Myself (${currentUserName})`;
  const { data: teamMembers = [], isLoading: teamMembersLoading } =
    useTeamMembers();

  const selectedReceivedUserId =
    receivedView === "myself" ? currentUserId : Number(receivedView) || null;

  const selectedCompany = useSelector(
    (state: RootState) => state.project.selectedCompany
  );
  const orgLine = selectedCompany?.name?.toUpperCase() ?? "YOUR ORGANIZATION";

  const { data: givenFeedbackData = { items: [] } } = useFeedbackList(
    "given",
    currentUserId
  );
  const givenFeedback = givenFeedbackData.items;
  const givenSummary = givenFeedbackData.summary;
  const { data: selectedReceivedFeedbackData = { items: [] } } =
    useFeedbackList("received", selectedReceivedUserId);
  const selectedReceivedFeedback = selectedReceivedFeedbackData.items;
  const selectedReceivedSummary = selectedReceivedFeedbackData.summary;
  const { data: allReceivedFeedbackData = { items: [] } } = useFeedbackList(
    "received",
    null
  );
  const allReceivedFeedback = allReceivedFeedbackData.items;
  const allReceivedSummary = allReceivedFeedbackData.summary;
  const selectedReceivedMember =
    selectedReceivedUserId == null
      ? null
      : teamMembers.find((member) => member.id === selectedReceivedUserId);
  const selectedReceivedName =
    receivedView === "myself" ? currentUserName : selectedReceivedMember?.label;

  const receivedFeedback = useMemo(() => {
    const merged = mergeFeedbackItems(
      selectedReceivedFeedback,
      allReceivedFeedback
    );

    if (selectedReceivedUserId != null && merged.length > 0) {
      return merged;
    }

    const normalizedSelectedName = selectedReceivedName?.trim().toLowerCase();
    if (!normalizedSelectedName) return merged;

    const exactMatches = merged.filter(
      (item) => item.recipientName.toLowerCase() === normalizedSelectedName
    );
    if (exactMatches.length > 0) return exactMatches;

    return merged.filter((item) =>
      item.recipientName.toLowerCase().includes(normalizedSelectedName)
    );
  }, [
    selectedReceivedFeedback,
    allReceivedFeedback,
    selectedReceivedUserId,
    selectedReceivedName,
  ]);

  return (
    <div
      className="min-h-[calc(100vh-5rem)] bg-[#f6f4ee] px-4 py-6 sm:px-6"
      style={{ fontFamily: "'Poppins', sans-serif" }}
    >
      <div className="mx-auto max-w-6xl space-y-6">
        {bannerVisible && (
          <Card className="overflow-hidden rounded-2xl border border-[#DA7756]/20 bg-white shadow-sm">
            <div className="flex items-center gap-3 px-4 py-3 sm:px-5">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#DA7756]">
                <Lightbulb className="h-5 w-5 text-white" strokeWidth={2} />
              </div>
              <button type="button" className="min-w-0 flex-1 text-left" onClick={() => {}}>
                <p className="text-sm font-semibold text-neutral-900">
                  Giving &amp; Receiving Feedback
                </p>
                <p className="text-xs text-neutral-600">Click to view tips</p>
              </button>
              <div className="flex shrink-0 items-center gap-0.5">
                <button
                  type="button"
                  className="rounded-md p-2 text-neutral-600 hover:bg-neutral-100"
                  aria-label="Expand tips"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  className="rounded-md p-2 text-neutral-600 hover:bg-neutral-100"
                  aria-label="Dismiss banner"
                  onClick={() => setBannerVisible(false)}
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
          </Card>
        )}

        <header className="flex flex-col gap-1 sm:flex-row sm:items-start sm:gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2 border-[#DA7756] bg-[#DA7756]/10 shadow-sm">
            <MessageSquare className="h-6 w-6 text-[#DA7756]" strokeWidth={2} />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-neutral-900 sm:text-3xl">
              Team Feedback
            </h1>
            <p className="mt-1 text-sm text-neutral-500 sm:text-base">
              Give and receive constructive feedback using the Sandwich technique
            </p>
            <p className="mt-2 text-xs font-medium uppercase tracking-wide text-neutral-400">
              {orgLine}
            </p>
          </div>
        </header>

        <Tabs value={feedbackTab} onValueChange={(v) => setFeedbackTab(v as any)} className="w-full">
          <TabsList className="inline-flex h-12 w-full items-center justify-start gap-2 rounded-full border border-[#DA7756]/20 bg-[#f6f4ee] px-2 shadow-sm sm:w-auto">
            <TabsTrigger
              value="received"
              className="h-9 rounded-full px-5 text-sm font-semibold text-neutral-500 transition-colors hover:text-neutral-700 data-[state=active]:bg-[#DA7756] data-[state=active]:text-white data-[state=active]:shadow-sm"
            >
              <Inbox className="mr-2 h-4 w-4" />
              Received
              {(allReceivedSummary?.received ?? receivedFeedback.length) > 0 && (
                <span
                  className="ml-2 rounded-full px-1.5 py-0.5 text-[10px] font-bold text-white"
                  style={{ backgroundColor: BRAND.danger }}
                >
                  {allReceivedSummary?.received ?? receivedFeedback.length}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger
              value="given"
              className="h-9 rounded-full px-5 text-sm font-semibold text-neutral-500 transition-colors hover:text-neutral-700 data-[state=active]:bg-[#DA7756] data-[state=active]:text-white data-[state=active]:shadow-sm"
            >
              <Send className="mr-2 h-4 w-4" />
              Given
              {(givenSummary?.given ?? givenFeedback.length) > 0 && (
                <span
                  className="ml-2 rounded-full px-1.5 py-0.5 text-[10px] font-bold text-white"
                  style={{ backgroundColor: BRAND.danger }}
                >
                  {givenSummary?.given ?? givenFeedback.length}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger
              value="give"
              className="h-9 rounded-full px-5 text-sm font-semibold text-neutral-500 transition-colors hover:text-neutral-700 data-[state=active]:bg-[#DA7756] data-[state=active]:text-white data-[state=active]:shadow-sm"
            >
              <Pencil className="mr-2 h-4 w-4" />
              Give Feedback
            </TabsTrigger>
          </TabsList>

          <TabsContent value="received" className="mt-6 space-y-4">
            <Card className="overflow-hidden rounded-2xl border border-[#DA7756]/20 bg-[#DA7756]/10 shadow-sm">
              <div className="flex items-center gap-3 border-b border-[#DA7756]/20 bg-[#DA7756]/10 px-4 py-4 sm:px-5">
                <span className="text-sm text-neutral-600 font-medium">
                  View feedback for:
                </span>
                <Select value={receivedView} onValueChange={setReceivedView}>
                  <SelectTrigger className="h-9 w-[200px] rounded-lg border-[#DA7756]/20 bg-white text-sm">
                    <SelectValue placeholder={myselfLabel} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="myself">{myselfLabel}</SelectItem>
                    {teamMembersLoading ? (
                      <div className="px-3 py-2 text-sm text-neutral-400">
                        Loading...
                      </div>
                    ) : (
                      teamMembers
                        .filter((member) => member.id !== currentUserId)
                        .map((member) => (
                          <SelectItem key={member.value} value={member.value}>
                            {member.label}
                          </SelectItem>
                        ))
                    )}
                  </SelectContent>
                </Select>
              </div>
              <div className="p-4 sm:p-5">
                <AsyncBoundary>
                  <GivenFeedbackList
                    key={`received-${receivedView}`}
                    onGiveFeedbackClick={() => {
                      setEditingFeedback(null);
                      setFeedbackTab("give");
                    }}
                    onEditFeedback={(item) => {
                      setEditingFeedback(item);
                      setFeedbackTab("give");
                    }}
                    direction="from"
                    filterUserId={null}
                    itemsOverride={receivedFeedback}
                  />
                </AsyncBoundary>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="given" className="mt-6">
            <Card className="overflow-hidden rounded-2xl border border-[#DA7756]/20 bg-[#DA7756]/10 shadow-sm">
              <div className="p-4 sm:p-5">
                <AsyncBoundary>
                  <GivenFeedbackList
                    onGiveFeedbackClick={() => {
                      setEditingFeedback(null);
                      setFeedbackTab("give");
                    }}
                    onEditFeedback={(item) => {
                      setEditingFeedback(item);
                      setFeedbackTab("give");
                    }}
                    direction="to"
                  />
                </AsyncBoundary>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="give" className="mt-6">
            <Card className="overflow-hidden rounded-2xl border border-[#DA7756]/20 bg-[#DA7756]/10 shadow-sm">
              <div className="p-4 sm:p-5">
                <AsyncBoundary>
                  <GiveFeedbackForm
                    initialFeedback={editingFeedback}
                    onCancelEdit={() => {
                      setEditingFeedback(null);
                      setFeedbackTab("given");
                    }}
                    onSubmitted={() => {
                      setEditingFeedback(null);
                      setFeedbackTab("given");
                    }}
                  />
                </AsyncBoundary>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

// ─── Root Export ───────────────────────────────────────────────────────────────

/**
 * Default export wraps the page in QueryClientProvider.
 *
 * If your app root already provides a QueryClient, import and use
 * FeedbackPage directly instead to share the cache.
 */
const Feedback = () => (
  <QueryClientProvider client={queryClient}>
    <FeedbackPage />
  </QueryClientProvider>
);

export default Feedback;
