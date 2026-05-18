/**
 * Feedback.tsx — Full production version with robust API integration
 * Styled to match the warm, rounded-2xl DISC Personality Assessment theme.
 */

import React, {
  useEffect,
  useMemo,
  useState,
  useCallback,
  useRef,
} from "react";
import axios, { AxiosError } from "axios";
import { useSelector } from "react-redux";
import { toast } from "sonner";
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
import { API_CONFIG, getAuthHeader } from "@/config/apiConfig";
import {
  getEmbeddedOrgId,
  getEmbeddedToken,
  resolveBaseUrlByOrgId,
} from "@/utils/embeddedMode";
import { getUser } from "@/utils/auth";

// Unified Brand Tokens
const BRAND = {
  primary: "#DA7756",
  secondary: "#BC6B4A",
  background: "#f6f4ee",
  panelBg: "#FFF9F6",
  panelBorder: "rgba(218, 119, 86, 0.18)",
  softRowBg: "rgba(218, 119, 86, 0.04)",
  danger: "#C72030",
} as const;

// ─── Types ─────────────────────────────────────────────────────────────────────

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

// ─── Axios Instance ────────────────────────────────────────────────────────────

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

const FeedbackSchema = z.object({
  id: z.coerce.string(),
  score: z.number().min(1).max(5).catch(1),
  recipient_name: z.string().optional().catch(undefined),
  rating_to_name: z.string().optional().catch(undefined),
  rating_to_id: z.coerce.number().optional().catch(undefined),
  rating_from_name: z.string().optional().catch(undefined),
  resource_user_id: z.coerce.number().optional().catch(undefined),
  user_id: z.coerce.number().optional().catch(undefined),
  recipient_id: z.coerce.number().optional().catch(undefined),
  rated_user_id: z.coerce.number().optional().catch(undefined),
  recipient: z
    .object({
      name: z.string().optional(),
      full_name: z.string().optional(),
      firstname: z.string().optional(),
      lastname: z.string().optional(),
      user_id: z.coerce.number().optional(),
      id: z.coerce.number().optional(),
    })
    .optional()
    .catch(undefined),
  user: z
    .object({
      name: z.string().optional(),
      user_id: z.coerce.number().optional(),
      id: z.coerce.number().optional(),
    })
    .optional()
    .catch(undefined),
  resource: z
    .object({
      user_id: z.coerce.number().optional(),
      resource_id: z.coerce.number().optional(),
      id: z.coerce.number().optional(),
    })
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

const FeedbackSummarySchema = z
  .object({
    received: z.coerce.number().optional(),
    given: z.coerce.number().optional(),
    unread: z.coerce.number().optional(),
    avg_rating: z.union([z.string(), z.number()]).optional(),
    average_rating: z.union([z.string(), z.number()]).optional(),
    feedback_points: z.coerce.number().optional(),
  })
  .passthrough();

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

function isRecord(value: unknown): value is Record<string, unknown> {
  return !!value && typeof value === "object" && !Array.isArray(value);
}

function unwrapFeedbackListResponse(data: unknown): {
  listSource: unknown;
  summarySource?: unknown;
} {
  if (!isRecord(data)) {
    return { listSource: data };
  }

  const nestedData = data.data;
  if (isRecord(nestedData)) {
    return {
      listSource: nestedData,
      summarySource: nestedData.summary ?? data.summary,
    };
  }

  return { listSource: data, summarySource: data.summary };
}

function mapFeedbackSummary(summarySource: unknown): FeedbackSummary | undefined {
  const parsed = FeedbackSummarySchema.safeParse(summarySource);
  if (!parsed.success) return undefined;

  const raw = parsed.data;
  return {
    received: raw.received ?? 0,
    given: raw.given ?? 0,
    unread: raw.unread ?? 0,
    avgRating: String(raw.avg_rating ?? raw.average_rating ?? "0.0"),
    feedbackPoints: raw.feedback_points ?? 0,
  };
}

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
    z
      .object({ data: z.object({ users: z.array(TeamMemberSchema) }) })
      .transform((d) => d.data.users),
    z
      .object({ data: z.object({ members: z.array(TeamMemberSchema) }) })
      .transform((d) => d.data.members),
    z
      .object({ data: z.object({ team_members: z.array(TeamMemberSchema) }) })
      .transform((d) => d.data.team_members),
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
    raw.rating_to_name ||
    (recipient && "name" in recipient ? recipient.name : undefined) ||
    (recipient && "full_name" in recipient ? recipient.full_name : undefined) ||
    (recipient && "firstname" in recipient && "lastname" in recipient
      ? [recipient.firstname, recipient.lastname].filter(Boolean).join(" ")
      : undefined) ||
    "Team Member";

  const score = Math.min(5, Math.max(1, Math.round(raw.score || 1)));

  const resourceId =
    raw.resource_id ||
    raw.rating_to_id ||
    raw.resource_user_id ||
    raw.recipient_id ||
    raw.rated_user_id ||
    (recipient && "user_id" in recipient ? recipient.user_id : undefined) ||
    (recipient && "resource_id" in recipient
      ? recipient.resource_id
      : undefined) ||
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
    status: raw.read || !!raw.read_at ? "read" : "unread",
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

function getLocalStorageUserId(): number | null {
  const id = Number(localStorage.getItem("userId") || "0");
  return Number.isFinite(id) && id > 0 ? id : null;
}

function canModifyFeedback(item: FeedbackItem): boolean {
  const localUserId = getLocalStorageUserId();
  return !!localUserId && item.ratingFromId === localUserId;
}

function showFeedbackAccessDenied(): void {
  toast.error("You don't have access");
}

function isForbiddenFeedbackError(error: AppError): boolean {
  return (
    error.kind === "forbidden" ||
    error.status === 403 ||
    error.message.toLowerCase() === "forbidden"
  );
}

const TEAM_MEMBERS_ENDPOINT = "/pms/users/get_escalate_to_users.json";
const RATINGS_COLLECTION_ENDPOINTS = ["/ratings", "/ratings.json"];
const LAST_SUCCESSFUL_FEEDBACK: Record<string, FeedbackItem[]> = {};
const FEEDBACK_CACHE_PREFIX = "feedback-cache-v1";

function normalizeHttpsBaseUrl(baseUrl: string): string {
  const trimmed = baseUrl.trim().replace(/\/+$/, "");
  if (!trimmed) return "";
  return /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
}

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

      const { listSource, summarySource } = unwrapFeedbackListResponse(data);
      const summary = mapFeedbackSummary(summarySource);

      const raw = FeedbackListSchema.parse(listSource);
      const mapped = raw.map(mapRawFeedback);
      const filtered = mapped.filter((item) => {
        if (!userId) return true;
        return direction === "given"
          ? item.ratingFromId === userId
          : item.resourceId == null || item.resourceId === userId;
      });

      const visibleItems = filtered;

      if (visibleItems.length > 0) {
        LAST_SUCCESSFUL_FEEDBACK[memoryKey] = visibleItems;
        writeFeedbackCache(direction, userId, visibleItems);
      }

      const isLastEndpoint =
        endpoint === RATINGS_COLLECTION_ENDPOINTS[RATINGS_COLLECTION_ENDPOINTS.length - 1];
      if (visibleItems.length === 0 && !isLastEndpoint) {
        continue;
      }

      if (visibleItems.length === 0) {
        LAST_SUCCESSFUL_FEEDBACK[memoryKey] = [];
        writeFeedbackCache(direction, userId, []);
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
  // localStorage se base URL aur org_id nikalo
  const baseUrl = normalizeHttpsBaseUrl(
    localStorage.getItem("baseUrl") ||
    API_CONFIG.BASE_URL ||
    ""
  );

  const orgId = localStorage.getItem("org_id");

  if (!baseUrl) {
    throw {
      message: "Base URL not found. Please log in again.",
      kind: "unknown",
    } as AppError;
  }

  if (!orgId) {
    throw {
      message: "Organization ID not found. Please log in again.",
      kind: "unknown",
    } as AppError;
  }

  const usersUrl = `${baseUrl}/api/users?organization_id=${encodeURIComponent(
    String(orgId)
  )}`;

  const { data } = await axios.get(usersUrl, {
    headers: {
      Authorization:
        (apiClient.defaults.headers.Authorization as string) ||
        `Bearer ${getAccessToken()?.replace("Bearer ", "")}`,
      Accept: "application/json",
    },
    timeout: 30_000,
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

async function markRatingAsRead(
  id: string,
  readComment?: string
): Promise<unknown> {
  const trimmedId = id.trim();
  if (!trimmedId) {
    throw { message: "Invalid feedback id.", kind: "unknown" } as AppError;
  }

  const payload = {
    read_comment: readComment?.trim() ? readComment.trim() : "Reviewed",
  };

  const { data } = await apiClient.patch(
    `/ratings/${encodeURIComponent(trimmedId)}/mark_as_read`,
    payload,
    { headers: { "Content-Type": "application/json" } }
  );
  return data;
}

async function deleteFeedback(id: string): Promise<void> {
  const trimmedId = id.trim();
  if (!trimmedId) {
    throw { message: "Invalid feedback id.", kind: "unknown" } as AppError;
  }

  try {
    await apiClient.delete(`/ratings/${encodeURIComponent(trimmedId)}.json`);
  } catch (err) {
    const error = normalizeError(err);
    if (error.kind === "auth" || error.kind === "forbidden") {
      throw error;
    }
    throw error;
  }
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
  const baseUrl = localStorage.getItem("baseUrl") || "";
  const orgId = localStorage.getItem("org_id") || "";

  return useQuery<TeamMemberOption[], AppError>({
    queryKey: ["teamMembers", baseUrl, orgId],
    queryFn: fetchTeamMembers,
    staleTime: 5 * 60_000,
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

      qc.invalidateQueries({ queryKey: ["feedback", "given"] });
      qc.invalidateQueries({ queryKey: ["feedback", "received"] });
    },
    onError: (error) => {
      if (isForbiddenFeedbackError(error)) {
        showFeedbackAccessDenied();
        return;
      }
      toast.error(error.message || "Failed to update feedback");
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
    onError: (error) => {
      if (isForbiddenFeedbackError(error)) {
        showFeedbackAccessDenied();
        return;
      }
      toast.error(error.message || "Failed to delete feedback");
    },
  });
}

function useMarkAsRead() {
  const qc = useQueryClient();
  return useMutation<unknown, AppError, { id: string; readComment?: string }>({
    mutationFn: ({ id, readComment }) => markRatingAsRead(id, readComment),
    onSuccess: (_, variables) => {
      qc.setQueriesData<{ items: FeedbackItem[]; summary?: FeedbackSummary }>(
        { queryKey: ["feedback", "received"] },
        (old) => {
          if (!old) return old;
          return {
            ...old,
            items: old.items.map((item) =>
              String(item.id) === String(variables.id)
                ? { ...item, status: "read" as const }
                : item
            ),
          };
        }
      );
    },
    onError: (err) => {
      console.error("Mark as read failed:", err);
      if (
        err.kind === "forbidden" ||
        err.status === 403 ||
        err.message.toLowerCase() === "forbidden"
      ) {
        toast.error("You don't have access to mark as read");
        return;
      }
      toast.error(err.message || "Failed to mark feedback as read");
    },
  });
}

// ─── Searchable User Select (BhagSection style) ────────────────────────────────

const UserSelectFeedback = ({
  value,
  onChange,
  users,
  placeholder = "Search team member...",
  disabled = false,
}: {
  value: string | undefined;
  onChange: (val: string) => void;
  users: TeamMemberOption[];
  placeholder?: string;
  disabled?: boolean;
}) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedUser = users.find((u) => u.value === value);
  const displayValue = selectedUser ? selectedUser.label : "";

  const filteredUsers = users.filter((u) =>
    u.label.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ position: "relative", zIndex: open ? 9999 : 1 }} ref={ref}>
      <input
        type="text"
        disabled={disabled}
        placeholder={disabled ? "Loading members…" : placeholder}
        value={open ? search : displayValue}
        onClick={() => {
          if (!disabled) {
            setOpen(true);
            setSearch("");
          }
        }}
        onChange={(e) => {
          setSearch(e.target.value);
          setOpen(true);
        }}
        className="h-12 w-full rounded-xl border border-neutral-200 bg-white px-4 text-sm text-neutral-900 placeholder:text-neutral-400 shadow-sm outline-none focus:border-[#DA7756]/40 focus:ring-1 focus:ring-[#DA7756]/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        style={{ paddingRight: "40px", fontFamily: "inherit" }}
      />
      <div
        style={{
          position: "absolute",
          right: "12px",
          top: "50%",
          transform: "translateY(-50%)",
          color: "#9ca3af",
          pointerEvents: "none",
        }}
      >
        {disabled ? (
          <Loader2
            style={{
              width: "16px",
              height: "16px",
              animation: "spin 0.8s linear infinite",
            }}
          />
        ) : (
          <svg
            width="16"
            height="16"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        )}
      </div>
      {open && !disabled && (
        <div
          style={{
            position: "absolute",
            top: "100%",
            left: 0,
            right: 0,
            marginTop: "4px",
            backgroundColor: "#ffffff",
            border: "1px solid #e5e7eb",
            borderRadius: "12px",
            boxShadow: "0 10px 24px rgba(0,0,0,0.10)",
            maxHeight: "220px",
            overflowY: "auto",
            overflowX: "hidden",
            zIndex: 9999,
            fontFamily: "inherit",
          }}
        >
          {value && (
            <div
              style={{
                padding: "10px 14px",
                fontSize: "13px",
                cursor: "pointer",
                borderBottom: "1px solid #f3f4f6",
                color: "#ef4444",
                fontWeight: 600,
              }}
              onClick={() => {
                onChange("");
                setOpen(false);
                setSearch("");
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = "#fef2f2")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = "transparent")
              }
            >
              Clear selection
            </div>
          )}
          {filteredUsers.length === 0 ? (
            <div
              style={{
                padding: "14px",
                fontSize: "13px",
                color: "#9ca3af",
                textAlign: "center",
              }}
            >
              No members found
            </div>
          ) : (
            filteredUsers.map((u) => (
              <div
                key={u.value}
                style={{
                  padding: "10px 14px",
                  cursor: "pointer",
                  fontSize: "13px",
                  borderBottom: "1px solid #f9fafb",
                  color: "#1a1a1a",
                  transition: "background 0.1s",
                }}
                onClick={() => {
                  onChange(u.value);
                  setOpen(false);
                  setSearch("");
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor = "#fef6f4")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = "transparent")
                }
              >
                {u.label}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

// ─── Searchable User Select for Received Tab ───────────────────────────────────

const UserSelectReceived = ({
  value,
  onChange,
  users,
  myselfLabel,
  currentUserId,
  disabled = false,
}: {
  value: string;
  onChange: (val: string) => void;
  users: TeamMemberOption[];
  myselfLabel: string;
  currentUserId: number | null;
  disabled?: boolean;
}) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const allOptions = [
    { value: "myself", label: myselfLabel },
    ...users.filter((m) => m.id !== currentUserId),
  ];

  const selectedOption = allOptions.find((o) => o.value === value);
  const displayValue = selectedOption ? selectedOption.label : myselfLabel;

  const filteredOptions = allOptions.filter((o) =>
    o.label.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ position: "relative", zIndex: open ? 9999 : 1 }} ref={ref}>
      <input
        type="text"
        disabled={disabled}
        placeholder={disabled ? "Loading…" : "Search member…"}
        value={open ? search : displayValue}
        onClick={() => {
          if (!disabled) {
            setOpen(true);
            setSearch("");
          }
        }}
        onChange={(e) => {
          setSearch(e.target.value);
          setOpen(true);
        }}
        className="h-10 w-[240px] rounded-xl border border-neutral-200 bg-white px-4 text-sm font-semibold text-neutral-900 shadow-sm outline-none focus:border-[#DA7756]/40 focus:ring-1 focus:ring-[#DA7756]/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        style={{ paddingRight: "36px", fontFamily: "inherit" }}
      />
      <div
        style={{
          position: "absolute",
          right: "10px",
          top: "50%",
          transform: "translateY(-50%)",
          color: "#9ca3af",
          pointerEvents: "none",
        }}
      >
        {disabled ? (
          <Loader2
            style={{
              width: "15px",
              height: "15px",
              animation: "spin 0.8s linear infinite",
            }}
          />
        ) : (
          <svg
            width="15"
            height="15"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        )}
      </div>
      {open && !disabled && (
        <div
          style={{
            position: "absolute",
            top: "100%",
            left: 0,
            right: 0,
            marginTop: "4px",
            backgroundColor: "#ffffff",
            border: "1px solid #e5e7eb",
            borderRadius: "12px",
            boxShadow: "0 10px 24px rgba(0,0,0,0.10)",
            maxHeight: "220px",
            overflowY: "auto",
            overflowX: "hidden",
            zIndex: 9999,
            fontFamily: "inherit",
          }}
        >
          {filteredOptions.length === 0 ? (
            <div
              style={{
                padding: "12px 14px",
                fontSize: "13px",
                color: "#9ca3af",
                textAlign: "center",
              }}
            >
              No members found
            </div>
          ) : (
            filteredOptions.map((o) => (
              <div
                key={o.value}
                style={{
                  padding: "10px 14px",
                  cursor: "pointer",
                  fontSize: "13px",
                  borderBottom: "1px solid #f9fafb",
                  color: "#1a1a1a",
                  fontWeight: o.value === value ? 600 : 400,
                  transition: "background 0.1s",
                }}
                onClick={() => {
                  onChange(o.value);
                  setOpen(false);
                  setSearch("");
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor = "#fef6f4")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = "transparent")
                }
              >
                {o.label}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

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
  const [localReadOverrides, setLocalReadOverrides] = useState<
    Record<string, boolean>
  >({});

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

    const existingItem = sourceItems.find((i) => i.id === itemId);
    if (existingItem && !detailCache[itemId]) {
      setDetailCache((prev) => ({ ...prev, [itemId]: existingItem }));
    }

    if (detailCache[itemId]) return;

    setLoadingDetailId(itemId);
    try {
      const detail = await fetchFeedbackDetail(itemId);
      if (detail) {
        setDetailCache((prev) => ({
          ...prev,
          [itemId]: {
            ...(existingItem ?? {}),
            ...detail,
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
      /* ignore */
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

        const displayStatus = localReadOverrides[item.id]
          ? "read"
          : item.status;
        const matchesStatus =
          statusFilter === "all" || displayStatus === statusFilter;

        return matchesSearch && matchesRating && matchesStatus;
      }),
    [
      sourceItems,
      searchQuery,
      ratingFilter,
      statusFilter,
      direction,
      localReadOverrides,
    ]
  );

  const avgRating =
    filtered.length > 0
      ? (filtered.reduce((s, i) => s + i.rating, 0) / filtered.length).toFixed(
          1
        )
      : "0.0";
  const avgRatingNum = Number(avgRating);
  const totalFeedback = filtered.length;
  const points = (() => {
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
      {/* Search and Filter Row */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-1">
        <div className="flex flex-1 items-center gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400"
              aria-hidden
            />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name or content..."
              className="h-10 w-full rounded-xl border border-neutral-200 bg-white py-2 pl-9 pr-3 text-sm text-neutral-900 placeholder:text-neutral-400 outline-none focus:border-[#DA7756]/40 focus:ring-1 focus:ring-[#DA7756]/20 transition-all"
            />
          </div>
          <Select value={ratingFilter} onValueChange={setRatingFilter}>
            <SelectTrigger className="h-10 w-[130px] rounded-xl border border-neutral-200 bg-white text-sm focus:ring-[#DA7756]/20">
              <SelectValue placeholder="All Ratings" />
            </SelectTrigger>
            <SelectContent className="rounded-xl border border-neutral-200">
              <SelectItem value="all">All Ratings</SelectItem>
              <SelectItem value="5">5 stars</SelectItem>
              <SelectItem value="4">4 stars</SelectItem>
              <SelectItem value="3">3 stars</SelectItem>
              <SelectItem value="2">2 stars</SelectItem>
              <SelectItem value="1">1 star</SelectItem>
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="h-10 w-[100px] rounded-xl border border-neutral-200 bg-white text-sm focus:ring-[#DA7756]/20">
              <SelectValue placeholder="All" />
            </SelectTrigger>
            <SelectContent className="rounded-xl border border-neutral-200">
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="unread">Unread</SelectItem>
              <SelectItem value="read">Read</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <button
          type="button"
          onClick={handleSelectAll}
          className="flex items-center gap-2 rounded-xl border border-neutral-200 bg-white px-4 py-2 text-sm font-medium text-neutral-700 shadow-sm transition-colors hover:bg-neutral-50"
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
          <div className="flex items-center gap-3 ml-2">
            <span className="text-sm font-medium text-neutral-600">
              {selectedIds.size} selected
            </span>
            <button
              type="button"
              onClick={() => {
                const selectedItems = filtered.filter((item) =>
                  selectedIds.has(item.id)
                );
                const hasBlockedItem = selectedItems.some(
                  (item) => !canModifyFeedback(item)
                );
                if (hasBlockedItem) {
                  showFeedbackAccessDenied();
                  return;
                }
                if (
                  !window.confirm(
                    `Delete ${selectedIds.size} selected feedback item${selectedIds.size > 1 ? "s" : ""}?`
                  )
                )
                  return;
                selectedItems.forEach((item) =>
                  deleteMutation.mutate({ id: item.id })
                );
                setSelectedIds(new Set());
              }}
              disabled={deleteMutation.isPending}
              className="flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-red-700 disabled:opacity-60 transition-colors"
            >
              <Trash2 className="h-4 w-4" />
              Delete Selected
            </button>
          </div>
        )}
      </div>

      <div className="space-y-3">
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

            const displayStatus = localReadOverrides[item.id]
              ? "read"
              : item.status;

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
                  "rounded-2xl border transition-all duration-200 bg-white shadow-sm hover:shadow-md",
                  expanded
                    ? "border-[#DA7756] ring-1 ring-[#DA7756]/10"
                    : "border-neutral-200 hover:border-[#DA7756]/40"
                )}
              >
                <div className="flex items-start gap-4 p-5">
                  <input
                    type="checkbox"
                    checked={selectedIds.has(item.id)}
                    onChange={() => toggleSelect(item.id)}
                    className="mt-1.5 h-4 w-4 cursor-pointer shrink-0"
                    style={{ accentColor: BRAND.primary }}
                  />

                  <div
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-sm font-bold text-white shadow-sm"
                    style={{ backgroundColor: avatarBg }}
                  >
                    {initial}
                  </div>

                  <div className="flex-1 min-w-0">
                    <button
                      type="button"
                      className="w-full text-left focus:outline-none"
                      onClick={() => handleExpand(item.id)}
                    >
                      <p className="font-bold text-neutral-900 text-[15px]">
                        {direction === "from" ? "From: " : "To: "}
                        {displayName}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <CalendarIcon className="h-3.5 w-3.5 text-neutral-400 shrink-0" />
                        <span className="text-[13px] text-neutral-500">
                          {item.date}
                        </span>
                        <span
                          className={cn(
                            "rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider",
                            displayStatus === "unread"
                              ? "bg-blue-50 text-blue-700 border border-blue-200"
                              : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          )}
                        >
                          {displayStatus === "unread" ? "Unread" : "Read"}
                        </span>
                      </div>
                      {!expanded && (
                        <p className="text-xs text-neutral-400 italic mt-1.5">
                          Click to expand feedback details
                        </p>
                      )}
                    </button>

                    {expanded && (
                      <div className="mt-4 space-y-3">
                        {isLoadingDetail ? (
                          <div className="flex items-center gap-2 text-xs text-neutral-400">
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                            Loading details...
                          </div>
                        ) : (
                          <>
                            {detail.positiveOpening && (
                              <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3">
                                <p className="text-xs font-bold uppercase tracking-wider text-emerald-700 mb-1">
                                  ✓ What You're Doing Well
                                </p>
                                <p className="text-sm text-neutral-800 leading-relaxed">
                                  {detail.positiveOpening}
                                </p>
                              </div>
                            )}
                            {detail.constructiveFeedback && (
                              <div className="rounded-xl border border-orange-200 bg-orange-50 px-4 py-3">
                                <p className="text-xs font-bold uppercase tracking-wider text-orange-600 mb-1">
                                  → Area for Growth
                                </p>
                                <p className="text-sm text-neutral-800 leading-relaxed">
                                  {detail.constructiveFeedback}
                                </p>
                              </div>
                            )}
                            {detail.positiveClosing && (
                              <div className="rounded-xl border border-sky-200 bg-sky-50 px-4 py-3">
                                <p className="text-xs font-bold uppercase tracking-wider text-sky-700 mb-1">
                                  ★ Encouragement
                                </p>
                                <p className="text-sm text-neutral-800 leading-relaxed">
                                  {detail.positiveClosing}
                                </p>
                              </div>
                            )}
                            {!detail.positiveOpening &&
                              !detail.constructiveFeedback &&
                              !detail.positiveClosing &&
                              detail.detailPreview && (
                                <div className="rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3">
                                  <p className="text-sm text-neutral-800 leading-relaxed">
                                    {detail.detailPreview}
                                  </p>
                                </div>
                              )}

                            {direction === "from" &&
                              displayStatus === "unread" && (
                                <div className="mt-4 space-y-3 border-t border-neutral-100 pt-4">
                                  <div>
                                    <label className="text-xs font-bold uppercase tracking-wider text-neutral-500">
                                      Your Notes / Action Items{" "}
                                      <span className="font-normal normal-case text-neutral-400">
                                        (Optional)
                                      </span>
                                    </label>
                                    <textarea
                                      rows={2}
                                      value={notes[item.id] || ""}
                                      onChange={(e) =>
                                        setNotes((prev) => ({
                                          ...prev,
                                          [item.id]: e.target.value,
                                        }))
                                      }
                                      placeholder="Add your notes about how you'll act on this feedback..."
                                      className="mt-1.5 w-full rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-700 placeholder:text-neutral-400 outline-none focus:border-[#DA7756]/40 focus:ring-1 focus:ring-[#DA7756]/20 resize-y"
                                    />
                                  </div>

                                  <button
                                    type="button"
                                    onClick={() => {
                                      markAsReadMutation.mutate(
                                        {
                                          id: item.id,
                                          readComment: notes[item.id]?.trim()
                                            ? notes[item.id].trim()
                                            : "Reviewed",
                                        },
                                        {
                                          onSuccess: () => {
                                            setLocalReadOverrides((prev) => ({
                                              ...prev,
                                              [item.id]: true,
                                            }));
                                          },
                                          onError: () => {
                                            setLocalReadOverrides((prev) => {
                                              const next = { ...prev };
                                              delete next[item.id];
                                              return next;
                                            });
                                          },
                                        }
                                      );
                                    }}
                                    disabled={markAsReadMutation.isPending}
                                    className="inline-flex items-center gap-2 rounded-xl bg-[#10b981] px-5 py-2.5 text-xs font-bold text-white hover:bg-[#059669] transition-colors shadow-sm disabled:opacity-50"
                                  >
                                    <CheckCircle className="h-4 w-4" />
                                    {markAsReadMutation.isPending
                                      ? "Marking..."
                                      : "Mark as Read"}
                                  </button>
                                </div>
                              )}

                            {direction === "from" &&
                              displayStatus === "read" &&
                              detail.readComment &&
                              detail.readComment !== "Reviewed" && (
                                <div className="mt-4 border-t border-neutral-100 pt-4">
                                  <p className="text-xs font-bold uppercase tracking-wider text-neutral-500 mb-1">
                                    Your Saved Notes
                                  </p>
                                  <div className="rounded-xl bg-neutral-50 px-4 py-3 border border-neutral-100">
                                    <p className="text-sm text-neutral-800 leading-relaxed italic">
                                      "{detail.readComment}"
                                    </p>
                                  </div>
                                </div>
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
                      className="rounded-lg p-1.5 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700 transition-colors"
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
                      <div className="flex items-center gap-2 mt-1.5">
                        <button
                          type="button"
                          className="flex items-center gap-1.5 rounded-xl border border-neutral-200 bg-white px-3 py-1.5 text-xs font-semibold text-neutral-700 shadow-sm transition-colors hover:bg-neutral-50 hover:border-neutral-300"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (!canModifyFeedback(item)) {
                              showFeedbackAccessDenied();
                              return;
                            }
                            onEditFeedback(item);
                          }}
                        >
                          <Pencil className="h-3.5 w-3.5 text-neutral-500" />
                          Edit
                        </button>

                        <button
                          type="button"
                          className="flex items-center gap-1.5 rounded-xl border border-red-200 bg-red-50/50 px-3 py-1.5 text-xs font-semibold text-red-700 shadow-sm transition-colors hover:bg-red-100/70 disabled:opacity-50"
                          disabled={
                            deleteMutation.isPending &&
                            deleteMutation.variables?.id === item.id
                          }
                          onClick={(e) => {
                            e.stopPropagation();
                            if (!canModifyFeedback(item)) {
                              showFeedbackAccessDenied();
                              return;
                            }
                            if (
                              window.confirm(
                                "Are you sure you want to delete this feedback?"
                              )
                            ) {
                              deleteMutation.mutate({ id: item.id });
                            }
                          }}
                        >
                          {deleteMutation.isPending &&
                          deleteMutation.variables?.id === item.id ? (
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          ) : (
                            <Trash2 className="h-3.5 w-3.5" />
                          )}
                          {deleteMutation.isPending &&
                          deleteMutation.variables?.id === item.id
                            ? "Deleting..."
                            : "Delete"}
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

// ─── Edit Feedback Modal ───────────────────────────────────────────────────────

function EditFeedbackModal({
  isOpen,
  onClose,
  feedbackItem,
}: {
  isOpen: boolean;
  onClose: () => void;
  feedbackItem: FeedbackItem | null;
}) {
  const updateMutation = useUpdateFeedback();

  const [rating, setRating] = useState(0);
  const [context, setContext] = useState("");
  const [positiveOpen, setPositiveOpen] = useState("");
  const [constructive, setConstructive] = useState("");
  const [positiveClose, setPositiveClose] = useState("");

  useEffect(() => {
    if (feedbackItem && isOpen) {
      setRating(feedbackItem.rating || 0);
      setContext(feedbackItem.reviews || "");
      setPositiveOpen(feedbackItem.positiveOpening || "");
      setConstructive(feedbackItem.constructiveFeedback || "");
      setPositiveClose(feedbackItem.positiveClosing || "");
    }
  }, [feedbackItem, isOpen]);

  if (!isOpen || !feedbackItem) return null;

  const handleSubmit = () => {
    if (!canModifyFeedback(feedbackItem)) {
      showFeedbackAccessDenied();
      return;
    }

    if (rating === 0) {
      alert("Please select a star rating.");
      return;
    }

    const payload: FeedbackPayload = {
      resource_type: "User",
      resource_id: feedbackItem.resourceId,
      score: rating,
      rating_from_type: feedbackItem.ratingFromType || "User",
      rating_from_id: feedbackItem.ratingFromId,
      positive_opening: positiveOpen,
      constructive_feedback: constructive,
      positive_closing: positiveClose,
      reviews: context,
    };

    updateMutation.mutate(
      {
        id: feedbackItem.id,
        payload,
        recipientName: feedbackItem.recipientName,
      },
      { onSuccess: onClose }
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 sm:p-6">
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white shadow-xl flex flex-col">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-neutral-100 bg-white px-6 py-4">
          <h2 className="text-[17px] font-bold text-neutral-900">
            Edit Feedback
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="space-y-1.5">
            <Label className="text-[13px] font-bold text-neutral-800">
              Star Rating
            </Label>
            <div
              className="flex gap-1"
              role="group"
              aria-label="Star rating"
            >
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  type="button"
                  aria-pressed={rating === n}
                  aria-label={`${n} star${n === 1 ? "" : "s"}`}
                  onClick={() => setRating(n)}
                  className="rounded-lg transition-transform hover:scale-110 focus:outline-none"
                >
                  <Star
                    className={cn(
                      "h-8 w-8 sm:h-10 sm:w-10 drop-shadow-sm",
                      n <= rating
                        ? "fill-[#facc15] text-[#facc15]"
                        : "fill-transparent text-neutral-200"
                    )}
                    strokeWidth={n <= rating ? 0 : 1.5}
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="text-[13px] font-bold text-neutral-800">
              Context (Optional)
            </Label>
            <input
              type="text"
              value={context}
              onChange={(e) => setContext(e.target.value)}
              className="h-10 w-full rounded-xl border border-neutral-200 bg-white px-3 text-sm text-neutral-900 shadow-sm outline-none focus:border-[#DA7756]/40 focus:ring-1 focus:ring-[#DA7756]/20 transition-all"
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-[13px] font-bold text-emerald-700 flex items-center gap-1.5">
              <span>✓</span> Positive Opening
            </Label>
            <Textarea
              value={positiveOpen}
              onChange={(e) => setPositiveOpen(e.target.value)}
              className="min-h-[80px] resize-y rounded-xl border-emerald-100 bg-emerald-50/50 p-3 text-sm shadow-sm focus:border-emerald-300 focus:ring-emerald-200 transition-all"
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-[13px] font-bold text-[#d97706] flex items-center gap-1.5">
              <span>→</span> Constructive Feedback
            </Label>
            <Textarea
              value={constructive}
              onChange={(e) => setConstructive(e.target.value)}
              className="min-h-[80px] resize-y rounded-xl border-orange-100 bg-[#fffbeb] p-3 text-sm shadow-sm focus:border-orange-300 focus:ring-orange-200 transition-all"
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-[13px] font-bold text-blue-600 flex items-center gap-1.5">
              <span>★</span> Positive Closing
            </Label>
            <Textarea
              value={positiveClose}
              onChange={(e) => setPositiveClose(e.target.value)}
              className="min-h-[80px] resize-y rounded-xl border-blue-100 bg-blue-50/50 p-3 text-sm shadow-sm focus:border-blue-300 focus:ring-blue-200 transition-all"
            />
          </div>
        </div>

        <div className="sticky bottom-0 z-10 flex items-center justify-end gap-3 border-t border-neutral-100 bg-white px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            disabled={updateMutation.isPending}
            className="inline-flex h-10 items-center justify-center rounded-xl border border-neutral-200 bg-white px-5 text-sm font-bold text-neutral-700 shadow-sm hover:bg-neutral-50 disabled:opacity-60 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={updateMutation.isPending}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-[#DA7756] px-6 text-sm font-bold text-white shadow-sm hover:bg-[#BC6B4A] disabled:opacity-60 transition-all"
          >
            {updateMutation.isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Updating...
              </>
            ) : (
              "Save Changes"
            )}
          </button>
        </div>
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

function GiveFeedbackForm({ onSubmitted }: { onSubmitted: () => void }) {
  const { data: teamMembers = [], isLoading: teamMembersLoading } =
    useTeamMembers();
  const createMutation = useCreateFeedback();

  const isPending = createMutation.isPending;
  const mutationError = createMutation.error;
  const isSuccess = createMutation.isSuccess;

  const [recipient, setRecipient] = useState<string | undefined>(undefined);
  const [feedbackDate, setFeedbackDate] = useState<Date>(() => new Date());
  const [datePickerOpen, setDatePickerOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [context, setContext] = useState("");
  const [positiveOpen, setPositiveOpen] = useState("");
  const [constructive, setConstructive] = useState("");
  const [positiveClose, setPositiveClose] = useState("");
  const [localError, setLocalError] = useState("");

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
    const ratingFromId = currentUserId;

    const payload: FeedbackPayload = {
      resource_type: "User",
      resource_id: selectedMember.id,
      score: rating,
      rating_from_type: "User",
      rating_from_id: ratingFromId,
      positive_opening: positiveOpen,
      constructive_feedback: constructive,
      positive_closing: positiveClose,
      reviews: context,
    };

    payload.created_at = feedbackDate.toISOString();

    createMutation.mutate(
      { payload, recipientName: selectedMember.label },
      { onSuccess: onSubmitted }
    );
  };

  if (isSuccess) {
    return (
      <div className="flex flex-col items-center justify-center gap-5 px-4 py-20 text-center sm:px-6">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
          <CheckCircle className="h-8 w-8 text-emerald-600" strokeWidth={2} />
        </div>
        <div>
          <h3 className="text-lg font-bold text-neutral-900">Feedback Sent!</h3>
          <p className="mt-1 text-sm text-neutral-500">
            Your feedback has been submitted successfully.
          </p>
        </div>
        <button
          type="button"
          onClick={clearForm}
          className="mt-2 inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#DA7756] px-6 text-sm font-bold text-white shadow-sm hover:bg-[#BC6B4A] transition-colors"
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
      <div className="rounded-xl border border-sky-200 bg-sky-50 px-5 py-4 text-sm leading-relaxed text-sky-900 shadow-sm">
        <span className="font-bold">Sandwich technique: </span>
        Start with something positive, share constructive feedback in the
        middle, and close with encouragement —{" "}
        <span className="font-bold underline decoration-sky-300 underline-offset-2">
          Positive → Constructive → Positive
        </span>
        .
      </div>

      {displayError && (
        <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-5 py-4 shadow-sm">
          <AlertCircle
            className="mt-0.5 h-5 w-5 shrink-0 text-red-500"
            strokeWidth={2}
          />
          <div className="min-w-0 flex-1">
            <p className="text-sm font-bold text-red-900">Submission Failed</p>
            <p className="mt-1 text-sm text-red-700">{displayError}</p>
          </div>
          <button
            type="button"
            onClick={() => {
              setLocalError("");
              createMutation.reset();
            }}
            className="shrink-0 rounded-lg p-1 text-red-500 hover:bg-red-100 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      <div className="grid gap-6 sm:grid-cols-2">
        {/* ── Searchable recipient dropdown (BhagSection style) ── */}
        <div className="space-y-2">
          <Label className="text-sm font-bold text-neutral-800">
            Give Feedback To <span className="text-[#DA7756]">*</span>
          </Label>
          <UserSelectFeedback
            value={recipient}
            onChange={setRecipient}
            users={teamMembers}
            disabled={teamMembersLoading}
            placeholder="Search team member..."
          />
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="feedback-date"
            className="text-sm font-bold text-neutral-800"
          >
            Date
          </Label>
          <Popover open={datePickerOpen} onOpenChange={setDatePickerOpen}>
            <PopoverTrigger asChild>
              <button
                type="button"
                id="feedback-date"
                className="flex h-12 w-full items-center justify-between gap-2 rounded-xl border border-neutral-200 bg-white px-4 text-left text-sm text-neutral-900 shadow-sm outline-none focus:ring-2 focus:ring-[#DA7756]/20 hover:bg-neutral-50 transition-colors"
              >
                <span className="tabular-nums font-medium">
                  {formatDMY(feedbackDate)}
                </span>
                <CalendarIcon
                  className="h-4 w-4 shrink-0 text-neutral-500"
                  strokeWidth={2}
                  aria-hidden
                />
              </button>
            </PopoverTrigger>
            <PopoverContent
              className="w-auto p-0 rounded-xl border border-neutral-200 shadow-md"
              align="start"
            >
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
                className="p-3"
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <div className="space-y-3">
        <div>
          <Label className="text-sm font-bold text-neutral-800">
            Star Rating <span className="text-[#DA7756]">*</span>
          </Label>
          <p className="mt-1 text-xs text-neutral-500">
            Rate overall performance (1–5 stars)
          </p>
        </div>
        <div
          className="flex gap-1.5"
          role="group"
          aria-label="Star rating"
        >
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              type="button"
              aria-pressed={rating === n}
              aria-label={`${n} star${n === 1 ? "" : "s"}`}
              onClick={() => setRating(n)}
              className="rounded-lg p-1 transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-[#DA7756]/40"
            >
              <Star
                className={cn(
                  "h-9 w-9 sm:h-10 sm:w-10 drop-shadow-sm",
                  n <= rating
                    ? "fill-amber-400 text-amber-400"
                    : "fill-transparent text-neutral-200"
                )}
                strokeWidth={n <= rating ? 0 : 1.5}
              />
            </button>
          ))}
        </div>
        <div className="overflow-hidden rounded-xl border border-neutral-200 shadow-sm mt-2">
          <div className="flex divide-x divide-white/20">
            {RATING_SEGMENTS.map((seg) => (
              <button
                key={seg.stars}
                type="button"
                onClick={() => setRating(seg.stars)}
                className={cn(
                  "min-w-0 flex-1 px-1 py-3 text-center transition-all",
                  seg.bg,
                  seg.text,
                  rating === seg.stars &&
                    "relative z-10 ring-2 ring-inset ring-neutral-900/40 shadow-inner brightness-90"
                )}
              >
                <span className="block text-[11px] font-bold leading-tight sm:text-[13px]">
                  {seg.stars}★
                </span>
                <span className="mt-0.5 block text-[10px] font-semibold opacity-90 sm:text-[11px]">
                  {seg.pts}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Label
          htmlFor="feedback-context"
          className="text-sm font-bold text-neutral-800"
        >
          Context / Situation{" "}
          <span className="font-medium text-neutral-400">(Optional)</span>
        </Label>
        <input
          id="feedback-context"
          type="text"
          value={context}
          onChange={(e) => setContext(e.target.value)}
          placeholder="e.g., Regarding the client presentation last week..."
          className="h-12 w-full rounded-xl border border-neutral-200 bg-white px-4 text-sm text-neutral-900 placeholder:text-neutral-400 shadow-sm outline-none focus:border-[#DA7756]/40 focus:ring-1 focus:ring-[#DA7756]/20 transition-all"
        />
      </div>

      <div className="space-y-6 border-t border-neutral-200 pt-6">
        {[
          {
            step: 1,
            color: "bg-[#10b981]",
            title: "Positive opening",
            desc: "Start with genuine appreciation and what they're doing well.",
            value: positiveOpen,
            onChange: setPositiveOpen,
            placeholder: "Share what is working well…",
          },
          {
            step: 2,
            color: "bg-[#f59e0b]",
            title: "Constructive feedback",
            desc: "Provide specific, actionable feedback for improvement.",
            value: constructive,
            onChange: setConstructive,
            placeholder: "Be clear and kind…",
          },
          {
            step: 3,
            color: "bg-[#3b82f6]",
            title: "Positive closing",
            desc: "End with encouragement and confidence in their abilities.",
            value: positiveClose,
            onChange: setPositiveClose,
            placeholder: "Close on a supportive note…",
          },
        ].map(({ step, color, title, desc, value, onChange, placeholder }) => (
          <div key={step} className="space-y-3">
            <div className="flex gap-3 items-center">
              <div
                className={cn(
                  "flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-extrabold text-white shadow-sm",
                  color
                )}
              >
                {step}
              </div>
              <div>
                <h3 className="font-bold text-neutral-900">{title}</h3>
                <p className="text-[13px] text-neutral-500">{desc}</p>
              </div>
            </div>
            <Textarea
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder={placeholder}
              className="min-h-[100px] resize-y rounded-xl border-neutral-200 bg-white p-4 text-sm shadow-sm focus:border-[#DA7756]/40 focus:ring-[#DA7756]/20 transition-all"
            />
          </div>
        ))}
      </div>

      <div className="flex flex-col-reverse gap-3 border-t border-neutral-200 pt-6 sm:flex-row sm:justify-end">
        <button
          type="button"
          onClick={clearForm}
          disabled={isPending}
          className="inline-flex h-12 items-center justify-center rounded-xl border border-neutral-200 bg-white px-6 text-sm font-bold text-neutral-700 shadow-sm hover:bg-neutral-50 disabled:opacity-60 transition-colors"
        >
          Clear form
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={isPending || teamMembersLoading}
          className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-[#DA7756] px-8 text-sm font-bold text-white shadow-sm hover:bg-[#BC6B4A] disabled:opacity-60 transition-all"
        >
          {isPending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" strokeWidth={2} />
              Sending…
            </>
          ) : (
            <>
              <Send className="h-4 w-4" strokeWidth={2} />
              Send feedback
            </>
          )}
        </button>
      </div>
    </div>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────

function FeedbackPage() {
  const [feedbackTab, setFeedbackTab] = useState("received");
  const [editingFeedback, setEditingFeedback] = useState<FeedbackItem | null>(
    null
  );
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
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

  const { data: givenFeedbackData = { items: [] } } = useFeedbackList(
    "given",
    selectedReceivedUserId
  );
  const givenFeedback = givenFeedbackData.items;
  const givenSummary = givenFeedbackData.summary;

  const { data: selectedReceivedFeedbackData = { items: [] } } =
    useFeedbackList("received", selectedReceivedUserId);
  const selectedReceivedFeedback = selectedReceivedFeedbackData.items;
  const selectedReceivedSummary = selectedReceivedFeedbackData.summary;

  const selectedReceivedMember =
    selectedReceivedUserId == null
      ? null
      : teamMembers.find((member) => member.id === selectedReceivedUserId);
  const selectedReceivedName =
    receivedView === "myself" ? currentUserName : selectedReceivedMember?.label;

  const receivedFeedback = selectedReceivedFeedback;

  // ── Count for badge: use selected user's actual feedback count ──
  const receivedBadgeCount = selectedReceivedFeedback.length;

  return (
    <div
      className="min-h-[calc(100vh-5rem)] bg-[#f6f4ee] px-4 py-6 sm:px-6"
      style={{ fontFamily: "'Poppins', sans-serif" }}
    >
      <div className="mx-auto max-w-6xl space-y-6">
        <header className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-5">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#DA7756] shadow-sm">
            <MessageSquare className="h-7 w-7 text-white" strokeWidth={2} />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-neutral-900 sm:text-3xl">
              Team Feedback
            </h1>
            <p className="mt-1 text-sm font-medium text-neutral-500">
              Give and receive constructive feedback using the Sandwich
              technique
            </p>
          </div>
        </header>

        <Tabs
          value={feedbackTab}
          onValueChange={(v) => setFeedbackTab(v as any)}
          className="w-full"
        >
          <TabsList className="inline-flex h-auto p-1.5 w-full items-center justify-start gap-1 rounded-[16px] border border-[rgba(218,119,86,0.18)] bg-[#FFF9F6] shadow-sm sm:w-auto">
            <TabsTrigger
              value="received"
              className="h-10 rounded-xl px-5 text-sm font-bold text-neutral-600 transition-colors data-[state=active]:bg-[#DA7756] data-[state=active]:text-white data-[state=active]:shadow-sm hover:bg-[rgba(218,119,86,0.08)] data-[state=active]:hover:bg-[#DA7756]"
            >
              <Inbox className="mr-2 h-4 w-4" />
              Received
              {receivedBadgeCount > 0 && (
                <span
                  className="ml-2 rounded-full px-2 py-0.5 text-[10px] font-extrabold text-white shadow-sm"
                  style={{ backgroundColor: BRAND.danger }}
                >
                  {receivedBadgeCount}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger
              value="given"
              className="h-10 rounded-xl px-5 text-sm font-bold text-neutral-600 transition-colors data-[state=active]:bg-[#DA7756] data-[state=active]:text-white data-[state=active]:shadow-sm hover:bg-[rgba(218,119,86,0.08)] data-[state=active]:hover:bg-[#DA7756]"
            >
              <Send className="mr-2 h-4 w-4" />
              Given
              {givenFeedback.length > 0 && (
                <span
                  className="ml-2 rounded-full px-2 py-0.5 text-[10px] font-extrabold text-white shadow-sm"
                  style={{ backgroundColor: BRAND.danger }}
                >
                  {givenFeedback.length}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger
              value="give"
              className="h-10 rounded-xl px-5 text-sm font-bold text-neutral-600 transition-colors data-[state=active]:bg-[#DA7756] data-[state=active]:text-white data-[state=active]:shadow-sm hover:bg-[rgba(218,119,86,0.08)] data-[state=active]:hover:bg-[#DA7756]"
            >
              <Pencil className="mr-2 h-4 w-4" />
              Give Feedback
            </TabsTrigger>
          </TabsList>

          <TabsContent
            value="received"
            className="mt-6 space-y-4 focus-visible:outline-none"
          >
            <Card className="overflow-hidden rounded-2xl border border-[rgba(218,119,86,0.18)] bg-white shadow-sm">
              <div className="flex items-center gap-3 border-b border-[rgba(218,119,86,0.10)] bg-[#FFF9F6] px-5 py-4">
                <span className="text-sm text-neutral-600 font-bold uppercase tracking-wider">
                  View feedback for:
                </span>
                {/* ── Searchable dropdown (BhagSection style) ── */}
                <UserSelectReceived
                  value={receivedView}
                  onChange={setReceivedView}
                  users={teamMembers}
                  myselfLabel={myselfLabel}
                  currentUserId={currentUserId}
                  disabled={teamMembersLoading}
                />
              </div>
              <div className="p-5">
                <AsyncBoundary>
                  <GivenFeedbackList
                    key={`received-${receivedView}`}
                    onGiveFeedbackClick={() => setFeedbackTab("give")}
                    onEditFeedback={(item) => {
                      setEditingFeedback(item);
                      setIsEditModalOpen(true);
                    }}
                    direction="from"
                    filterUserId={null}
                    itemsOverride={receivedFeedback}
                  />
                </AsyncBoundary>
              </div>
            </Card>
          </TabsContent>

          <TabsContent
            value="given"
            className="mt-6 focus-visible:outline-none"
          >
            <Card className="overflow-hidden rounded-2xl border border-[rgba(218,119,86,0.18)] bg-white shadow-sm">
              <div className="p-5">
                <AsyncBoundary>
                  <GivenFeedbackList
                    key={`given-${receivedView}`}
                    onGiveFeedbackClick={() => setFeedbackTab("give")}
                    onEditFeedback={(item) => {
                      setEditingFeedback(item);
                      setIsEditModalOpen(true);
                    }}
                    direction="to"
                    filterUserId={selectedReceivedUserId}
                    itemsOverride={givenFeedback}
                  />
                </AsyncBoundary>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="give" className="mt-6 focus-visible:outline-none">
            <Card className="overflow-hidden rounded-2xl border border-[rgba(218,119,86,0.18)] bg-[#FFF9F6] shadow-sm">
              <div className="p-2 sm:p-4">
                <AsyncBoundary>
                  <GiveFeedbackForm
                    onSubmitted={() => setFeedbackTab("given")}
                  />
                </AsyncBoundary>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {isEditModalOpen && editingFeedback && (
        <EditFeedbackModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setEditingFeedback(null);
          }}
          feedbackItem={editingFeedback}
        />
      )}
    </div>
  );
}

// ─── Root Export ───────────────────────────────────────────────────────────────

const Feedback = () => (
  <QueryClientProvider client={queryClient}>
    <FeedbackPage />
  </QueryClientProvider>
);

export default Feedback;
