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
class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
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
      return <this.props.FallbackComponent error={this.state.error} resetErrorBoundary={this.reset} />;
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
  if (embedded) { _accessToken = embedded; return embedded; }
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
      setAccessToken(data.access_token);
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
      return { message: "Network error — check your connection and try again.", kind: "network" };
    }
    if (status === 401) {
      return { message: "Your session has expired. Please log in again.", status, kind: "auth" };
    }
    if (status === 403) {
      return { message: "You don't have permission to perform this action.", status, kind: "forbidden" };
    }
    if (status === 404) {
      return { message: "Resource not found.", status, kind: "notFound" };
    }
    if (status && status >= 500) {
      return { message: raw || "Server error — please try again shortly.", status, kind: "server" };
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
  const embeddedOrgId = getEmbeddedOrgId();
  if (embeddedOrgId) {
    try {
      const resolved = await resolveBaseUrlByOrgId(embeddedOrgId);
      return resolved.replace(/\/+$/, "");
    } catch {
      /* fall through */
    }
  }
  const base = API_CONFIG.BASE_URL;
  if (!base) throw { message: "API base URL not configured. Please log in again.", kind: "unknown" } as AppError;
  return base.replace(/\/+$/, "");
}

// Request interceptor — attach base URL, Authorization header, and access_token query param
apiClient.interceptors.request.use(async (config) => {
  if (!config.baseURL) {
    config.baseURL = await resolveBaseUrl();
  }
  const token = getAccessToken();
  // Extract raw token value (strip "Bearer " prefix if present)
  const rawToken = token?.startsWith("Bearer ") ? token.slice(7) : token;
  if (rawToken) {
    // Set both Authorization header and access_token query param
    // The lockated API accepts both; some routes require the query param
    config.headers.Authorization = `Bearer ${rawToken}`;
    config.params = { ...config.params, access_token: rawToken };
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
    })
    .optional()
    .catch(undefined),
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
    z.object({ team_feedbacks: z.array(FeedbackSchema) }).transform((d) => d.team_feedbacks),
    z.object({ feedbacks: z.array(FeedbackSchema) }).transform((d) => d.feedbacks),
    z.object({ pms_team_feedbacks: z.array(FeedbackSchema) }).transform((d) => d.pms_team_feedbacks),
    z.object({ ratings: z.array(FeedbackSchema) }).transform((d) => d.ratings),
    z.object({ data: z.array(FeedbackSchema) }).transform((d) => d.data),
    z.object({ results: z.array(FeedbackSchema) }).transform((d) => d.results),
    z.object({ items: z.array(FeedbackSchema) }).transform((d) => d.items),
    z.object({ feedback: z.array(FeedbackSchema) }).transform((d) => d.feedback),
  ])
  .catch([]);

const TeamMemberSchema = z.object({
  id: z.coerce.number(),
  name: z.string().optional(),
  full_name: z.string().optional(),
  fullName: z.string().optional(),
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
    z.object({ fm_users: z.array(TeamMemberSchema) }).transform((d) => d.fm_users),
    z.object({ team_members: z.array(TeamMemberSchema) }).transform((d) => d.team_members),
    z.object({ members: z.array(TeamMemberSchema) }).transform((d) => d.members),
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
    raw.rating_from_id ||
    ratingFrom?.id ||
    ratingFrom?.user_id ||
    undefined;

  const preview = [
    raw.positive_opening,
    raw.constructive_feedback,
    raw.positive_closing,
  ]
    .filter(Boolean)
    .join(" ");

  return {
    id: raw.id,
    recipientName: (recipientName as string) || "Team Member",
    date: formatApiDate(raw.created_at ?? raw.createdAt ?? raw.date),
    rating: score,
    status: raw.read ? "read" : "unread",
    detailPreview: preview || undefined,
    resourceId,
    ratingFromType: raw.rating_from_type ?? ratingFrom?.type ?? "Team",
    ratingFromId,
    positiveOpening: raw.positive_opening,
    constructiveFeedback: raw.constructive_feedback,
    positiveClosing: raw.positive_closing,
    createdAt: raw.created_at ?? raw.createdAt,
  };
}

function mapTeamMember(
  raw: z.infer<typeof TeamMemberSchema>
): TeamMemberOption | null {
  if (!raw.id) return null;
  const label =
    raw.name ||
    raw.full_name ||
    raw.fullName ||
    [
      raw.firstname ?? raw.first_name ?? raw.firstName,
      raw.lastname ?? raw.last_name ?? raw.lastName,
    ]
      .filter(Boolean)
      .join(" ") ||
    `User ${raw.id}`;
  return { value: String(raw.id), label, id: raw.id };
}

// ─── Current User Helper ───────────────────────────────────────────────────────

function getCurrentUserId(): number | null {
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
      const id = Number(parsed.id) || Number(parsed.user_id) || Number(parsed.userId);
      if (id) return id;
    } catch { /* ignore */ }
  }
  return null;
}

// ─── API Constants ─────────────────────────────────────────────────────────────

const TEAM_MEMBERS_ENDPOINT = "/pms/users/get_escalate_to_users.json";

const FEEDBACK_ENDPOINTS = [
  "/pms/team_feedbacks.json",
  "/api/pms/team_feedbacks.json",
  "/pms/admin/team_feedbacks.json",
  "/pms/pms_team_feedbacks.json",
  "/pms/admin/pms_team_feedbacks.json",
  "/pms/ratings.json",
  "/pms/admin/ratings.json",
  "/pms/feedbacks.json",
  "/api/pms/feedbacks.json",
  "/feedbacks.json",
  "/api/feedbacks.json",
];

// Remembers whichever endpoint returned HTTP 200 during the GET list fetch.
// That same path is tried first on POST, eliminating endpoint guesswork.
let _confirmedFeedbackEndpoint: string | null = null;

// ─── API Functions ─────────────────────────────────────────────────────────────

/**
 * Tries feedback endpoints in order, returning parsed + mapped items.
 * Stops immediately on auth/permission errors (retrying other endpoints
 * won't help if the token is invalid or the user lacks access).
 */
async function fetchFeedbackList(
  direction: "given" | "received",
  userId: number | null
): Promise<FeedbackItem[]> {
  const params: Record<string, string | number> = { _t: Date.now() };
  if (userId) {
    if (direction === "given") params.rating_from_id = userId;
    else params.resource_id = userId;
  }

  let lastError: AppError | null = null;

  for (const endpoint of FEEDBACK_ENDPOINTS) {
    try {
      const { data } = await apiClient.get(endpoint, {
        params,
        headers: { "Cache-Control": "no-cache", Pragma: "no-cache" },
      });

      const raw = FeedbackListSchema.parse(data);

      // Only confirm this endpoint if the response looks like actual feedback
      // data (object or array) — not an HTML redirect or error page.
      if (data && (Array.isArray(data) || typeof data === "object")) {
        _confirmedFeedbackEndpoint = endpoint;
      }

      return raw
        .map(mapRawFeedback)
        .filter((item) => {
          if (!userId) return true;
          return direction === "given"
            ? item.ratingFromId === userId
            : item.resourceId === userId;
        })
        .sort((a, b) => {
          const at = new Date(a.createdAt || 0).getTime();
          const bt = new Date(b.createdAt || 0).getTime();
          return bt - at;
        });
    } catch (err) {
      lastError = normalizeError(err);
      if (lastError.kind === "auth" || lastError.kind === "forbidden") break;
    }
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
    params: { _t: Date.now() },
  });
  const raw = TeamMembersListSchema.parse(data);
  return raw.map(mapTeamMember).filter((m): m is TeamMemberOption => m !== null);
}

interface FeedbackPayload {
  resource_type: string;
  resource_id: number;
  score: number;
  positive_opening?: string;
  constructive_feedback?: string;
  positive_closing?: string;
  rating_from_type?: string;
  rating_from_id?: number;
}

async function createFeedback(payload: FeedbackPayload): Promise<unknown> {
  // Rails wraps POST bodies in the singular model name.
  // The GET response uses "pms_team_feedbacks" so the model is PmsTeamFeedback.
  const bodyVariants = [
    { pms_team_feedback: payload },
    { team_feedback: payload },
    payload,
    { feedback: payload },
    { rating: payload },
  ];
  let lastError: AppError | null = null;

  // Build endpoint list: put the confirmed working GET endpoint first so we
  // don't waste attempts on paths the server has already proven don't exist.
  const endpointsToTry = _confirmedFeedbackEndpoint
    ? [_confirmedFeedbackEndpoint, ...FEEDBACK_ENDPOINTS.filter((e) => e !== _confirmedFeedbackEndpoint)]
    : FEEDBACK_ENDPOINTS;

  for (const endpoint of endpointsToTry) {
    for (const body of bodyVariants) {
      try {
        const { data } = await apiClient.post(endpoint, body);
        console.warn(`[Feedback] POST succeeded on ${endpoint}`);
        return data;
      } catch (err) {
        lastError = normalizeError(err);
        console.warn(`[Feedback] POST ${endpoint} → HTTP ${lastError.status ?? "ERR"} (${lastError.kind})`, body);
        if (lastError.kind === "auth" || lastError.kind === "forbidden") throw lastError;
        // 404 means the route doesn't exist — no point trying other body
        // shapes on the same URL, skip straight to the next endpoint.
        if (lastError.kind === "notFound") break;
      }
    }
  }

  if (lastError?.kind === "notFound") {
    throw {
      ...lastError,
      message:
        "Feedback could not be submitted — the server route is not available for your account. " +
        "Please contact your administrator to enable the feedback module.",
    } as AppError;
  }

  throw lastError ?? { message: "Failed to submit feedback.", kind: "unknown" };
}

async function updateFeedback(
  id: string,
  payload: FeedbackPayload
): Promise<unknown> {
  // Derive the update path from the confirmed working GET endpoint base path
  const baseEndpoints = _confirmedFeedbackEndpoint
    ? [
        // e.g. "/pms/team_feedbacks.json" → "/pms/team_feedbacks/{id}.json"
        _confirmedFeedbackEndpoint.replace(/\.json$/, `/${id}.json`),
        ...[ 
          `/pms/team_feedbacks/${id}.json`,
          `/api/pms/team_feedbacks/${id}.json`,
          `/pms/pms_team_feedbacks/${id}.json`,
          `/pms/ratings/${id}.json`,
          `/pms/feedbacks/${id}.json`,
          `/api/pms/feedbacks/${id}.json`,
          `/feedbacks/${id}.json`,
          `/feedbacks/${id}`,
        ].filter((e) => e !== _confirmedFeedbackEndpoint?.replace(/\.json$/, `/${id}.json`)),
      ]
    : [
        `/pms/team_feedbacks/${id}.json`,
        `/api/pms/team_feedbacks/${id}.json`,
        `/pms/pms_team_feedbacks/${id}.json`,
        `/pms/ratings/${id}.json`,
        `/pms/feedbacks/${id}.json`,
        `/api/pms/feedbacks/${id}.json`,
        `/feedbacks/${id}.json`,
        `/feedbacks/${id}`,
      ];
  const endpoints = baseEndpoints;
  const bodyVariants = [
    { pms_team_feedback: payload },
    { team_feedback: payload },
    payload,
    { feedback: payload },
    { rating: payload },
  ];
  let lastError: AppError | null = null;

  for (const endpoint of endpoints) {
    for (const method of ["patch", "put"] as const) {
      for (const body of bodyVariants) {
        try {
          const { data } = await apiClient[method](endpoint, body);
          return data;
        } catch (err) {
          lastError = normalizeError(err);
          if (lastError.kind === "auth" || lastError.kind === "forbidden") throw lastError;
          if (lastError.kind === "notFound") break;
        }
      }
    }
  }

  if (lastError?.kind === "notFound") {
    throw {
      ...lastError,
      message:
        "Feedback could not be updated — the server route is not available for your account. " +
        "Please contact your administrator to enable the feedback module.",
    } as AppError;
  }

  throw lastError ?? { message: "Failed to update feedback.", kind: "unknown" };
}

// ─── React Query Hooks ─────────────────────────────────────────────────────────

function useFeedbackList(direction: "given" | "received") {
  const userId = getCurrentUserId();
  return useQuery<FeedbackItem[], AppError>({
    queryKey: ["feedback", direction, userId],
    queryFn: () => fetchFeedbackList(direction, userId),
    placeholderData: [],
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
  return useMutation<unknown, AppError, FeedbackPayload>({
    mutationFn: createFeedback,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["feedback", "given"] });
      qc.invalidateQueries({ queryKey: ["feedback", "received"] });
    },
  });
}

function useUpdateFeedback() {
  const qc = useQueryClient();
  return useMutation<unknown, AppError, { id: string; payload: FeedbackPayload }>({
    mutationFn: ({ id, payload }) => updateFeedback(id, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["feedback", "given"] });
      qc.invalidateQueries({ queryKey: ["feedback", "received"] });
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
      <AlertCircle className="mx-auto mb-3 h-10 w-10 text-red-500" strokeWidth={1.5} />
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
            <Loader2 className="h-5 w-5 animate-spin text-[#DA7756]" />
            Loading…
          </div>
        }
      >
        {children}
      </React.Suspense>
    </ErrorBoundary>
  );
}

// ─── Inline Error Panel ────────────────────────────────────────────────────────

function InlineError({ error, onRetry }: { error: AppError; onRetry: () => void }) {
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

// ─── Sub-components ────────────────────────────────────────────────────────────

function FeedbackEmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <MessageSquare className="mb-4 h-16 w-16 text-neutral-300" strokeWidth={1.25} />
      <h3 className="text-lg font-semibold text-neutral-900">No Feedback Yet</h3>
      <p className="mt-2 max-w-sm text-sm text-neutral-500">
        No feedback records to display right now.
      </p>
    </div>
  );
}

function StarRatingRow({ value }: { value: number }) {
  return (
    <div className="flex shrink-0 gap-0.5" aria-label={`${value} out of 5 stars`}>
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

function GivenFeedbackList({
  onGiveFeedbackClick,
  onEditFeedback,
  direction,
}: {
  onGiveFeedbackClick: () => void;
  onEditFeedback: (item: FeedbackItem) => void;
  direction: "to" | "from";
}) {
  const fetchDirection = direction === "to" ? "given" : "received";
  const { data: items = [], isLoading, isError, error, refetch } =
    useFeedbackList(fetchDirection);

  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [ratingFilter, setRatingFilter] = useState("all");

  const filtered = useMemo(
    () =>
      items.filter((item) => {
        const q = searchQuery.trim().toLowerCase();
        const matchesSearch =
          !q ||
          item.recipientName.toLowerCase().includes(q) ||
          (item.detailPreview?.toLowerCase().includes(q) ?? false);
        const matchesRating =
          ratingFilter === "all" || String(item.rating) === ratingFilter;
        return matchesSearch && matchesRating;
      }),
    [items, searchQuery, ratingFilter]
  );

  return (
    <div className="space-y-4 px-4 py-4 sm:px-6 sm:py-5">
      {/* Toolbar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-stretch sm:justify-between sm:gap-3">
        <div className="flex min-w-0 flex-1 flex-col gap-3 sm:flex-row sm:items-center sm:gap-3">
          <div className="relative min-w-0 flex-1">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400"
              aria-hidden
            />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name or content..."
              className="h-10 w-full rounded-xl border border-neutral-200 bg-white py-2 pl-10 pr-3 text-sm text-neutral-900 placeholder:text-neutral-400 outline-none ring-offset-2 focus-visible:ring-2 focus-visible:ring-[#C72030]/25"
            />
          </div>
          <Select value={ratingFilter} onValueChange={setRatingFilter}>
            <SelectTrigger className="h-10 w-full rounded-xl border-neutral-200 bg-white sm:w-[160px] sm:shrink-0">
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
        </div>
        <button
          type="button"
          onClick={onGiveFeedbackClick}
          className="inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-xl bg-[#DA7756] px-4 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#DA7756]/85 sm:px-5"
        >
          <Send className="h-4 w-4 text-white" strokeWidth={2} />
          Give Feedback
        </button>
      </div>

      {/* List content */}
      <div className="space-y-3">
        {isLoading ? (
          <div className="flex items-center justify-center gap-2 py-12 text-sm text-neutral-500">
            <Loader2 className="h-5 w-5 animate-spin text-[#DA7756]" />
            Loading feedback…
          </div>
        ) : isError ? (
          <InlineError error={normalizeError(error)} onRetry={() => refetch()} />
        ) : filtered.length === 0 ? (
          <FeedbackEmptyState />
        ) : (
          filtered.map((item) => {
            const expanded = expandedId === item.id;
            return (
              <div
                key={item.id}
                className={cn(
                  "rounded-xl border border-neutral-200/90 bg-[#FFFDF0] p-4 shadow-sm",
                  "transition-shadow hover:shadow-md"
                )}
              >
                <div className="flex gap-3 sm:gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#2E7D32] sm:h-12 sm:w-12">
                    <Send className="h-5 w-5 text-white" strokeWidth={2} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <button
                      type="button"
                      className="w-full text-left"
                      onClick={() => setExpandedId(expanded ? null : item.id)}
                    >
                      <p className="font-semibold text-neutral-900">
                        {direction === "to" ? "To" : "From"}: {item.recipientName}
                      </p>
                      <p className="text-sm text-neutral-600">{item.date}</p>
                      {!expanded && (
                        <p className="mt-1 text-xs text-neutral-400">
                          Click to expand feedback details
                        </p>
                      )}
                    </button>
                    {expanded && item.detailPreview && (
                      <p className="mt-3 border-l-2 border-[#2E7D32]/40 pl-3 text-sm leading-relaxed text-neutral-700">
                        {item.detailPreview}
                      </p>
                    )}
                  </div>
                  <div className="flex shrink-0 flex-col items-end gap-2">
                    <StarRatingRow value={item.rating} />
                    <span
                      className={cn(
                        "rounded-md px-2 py-0.5 text-xs font-medium",
                        item.status === "unread"
                          ? "bg-orange-100 text-orange-800"
                          : "bg-neutral-200/80 text-neutral-600"
                      )}
                    >
                      {item.status === "unread" ? "Unread" : "Read"}
                    </span>
                    <div className="mt-1 flex flex-wrap justify-end gap-2">
                      <button
                        type="button"
                        className="inline-flex items-center gap-1.5 rounded-lg border border-neutral-300 bg-white px-3 py-1.5 text-xs font-medium text-neutral-700 shadow-sm hover:bg-neutral-50"
                        onClick={(e) => { e.stopPropagation(); onEditFeedback(item); }}
                      >
                        <Pencil className="h-3.5 w-3.5" />
                        Edit
                      </button>
                      <button
                        type="button"
                        className="inline-flex items-center gap-1.5 rounded-lg bg-[#DA7756] px-3 py-1.5 text-xs font-medium text-white shadow-sm hover:bg-[#DA7756]/85"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        Delete
                      </button>
                    </div>
                    <button
                      type="button"
                      className="mt-1 rounded-md p-1 text-neutral-400 hover:bg-black/5 hover:text-neutral-600"
                      aria-expanded={expanded}
                      aria-label={expanded ? "Collapse" : "Expand"}
                      onClick={() => setExpandedId(expanded ? null : item.id)}
                    >
                      <ChevronDown
                        className={cn("h-5 w-5 transition-transform", expanded && "rotate-180")}
                      />
                    </button>
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
  const { data: teamMembers = [], isLoading: teamMembersLoading } = useTeamMembers();
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

  // Pre-fill when editing existing feedback
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
      setLocalError("Please select a team member to give feedback to.");
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
    const currentUserId = getCurrentUserId();

    const payload: FeedbackPayload = {
      resource_type: "User",
      resource_id: selectedMember.id,
      score: rating,
      positive_opening: positiveOpen || undefined,
      constructive_feedback: constructive || undefined,
      positive_closing: positiveClose || undefined,
    };

    const ratingFromId = initialFeedback?.ratingFromId ?? currentUserId;
    if (ratingFromId) {
      payload.rating_from_type = initialFeedback?.ratingFromType ?? "Team";
      payload.rating_from_id = ratingFromId;
    }

    if (isEditMode && initialFeedback?.id) {
      updateMutation.mutate(
        { id: initialFeedback.id, payload },
        { onSuccess: onSubmitted }
      );
    } else {
      createMutation.mutate(payload, { onSuccess: onSubmitted });
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
            Your feedback has been {isEditMode ? "updated" : "submitted"} successfully.
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
        Start with something positive, share constructive feedback in the middle, and close
        with encouragement —{" "}
        <span className="font-medium">Positive → Constructive → Positive</span>.
      </div>

      {displayError && (
        <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3">
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-500" strokeWidth={2} />
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-red-800">Submission Failed</p>
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
          <Select value={recipient} onValueChange={setRecipient} disabled={teamMembersLoading}>
            <SelectTrigger id="feedback-recipient" className="h-11 rounded-xl border-neutral-200 bg-white">
              {teamMembersLoading ? (
                <span className="flex items-center gap-2 text-neutral-400">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Loading members…
                </span>
              ) : (
                <SelectValue placeholder="Select team member" />
              )}
            </SelectTrigger>
            <SelectContent>
              {teamMembers.length === 0 ? (
                <div className="px-3 py-2 text-sm text-neutral-400">No members found</div>
              ) : (
                teamMembers.map((m) => (
                  <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="feedback-date" className="text-neutral-800">Date</Label>
          <Popover open={datePickerOpen} onOpenChange={setDatePickerOpen}>
            <PopoverTrigger asChild>
              <button
                type="button"
                id="feedback-date"
                className={cn(
                  "flex h-11 w-full items-center justify-between gap-2 rounded-xl border border-neutral-200 bg-white px-3 text-left text-sm text-neutral-900",
                  "outline-none ring-offset-2 transition-colors hover:bg-neutral-50/80",
                  "focus-visible:ring-2 focus-visible:ring-[#DA7756]/25"
                )}
              >
                <span className="tabular-nums">{formatDMY(feedbackDate)}</span>
                <CalendarIcon className="h-4 w-4 shrink-0 text-neutral-500" strokeWidth={2} aria-hidden />
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={feedbackDate}
                onSelect={(d) => { if (d) { setFeedbackDate(d); setDatePickerOpen(false); } }}
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
          <p className="mt-0.5 text-sm text-neutral-500">Rate overall performance (1–5 stars)</p>
        </div>
        <div className="flex gap-1" role="radiogroup" aria-label="Star rating">
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              type="button"
              role="radio"
              aria-checked={rating === n}
              onClick={() => setRating(n)}
              className="rounded-md p-0.5 transition-transform hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C72030]/40"
            >
              <Star
                className={cn(
                  "h-8 w-8 sm:h-9 sm:w-9",
                  n <= rating ? "fill-amber-400 text-amber-400" : "fill-transparent text-neutral-300"
                )}
                strokeWidth={n <= rating ? 0 : 1.5}
              />
            </button>
          ))}
        </div>
        <div className="overflow-hidden rounded-xl border border-neutral-200 shadow-sm">
          <div className="flex">
            {RATING_SEGMENTS.map((seg) => (
              <button
                key={seg.stars}
                type="button"
                onClick={() => setRating(seg.stars)}
                className={cn(
                  "min-w-0 flex-1 px-0.5 py-2.5 text-center transition-all sm:px-1 sm:py-3",
                  seg.bg, seg.text,
                  rating === seg.stars && "relative z-10 ring-2 ring-inset ring-neutral-900/80"
                )}
              >
                <span className="block text-[10px] font-semibold leading-tight sm:text-xs">{seg.stars}★</span>
                <span className="mt-0.5 block text-[9px] font-medium opacity-95 sm:text-[11px]">{seg.pts}</span>
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
          className="h-11 w-full rounded-xl border border-neutral-200 bg-white px-3 text-sm text-neutral-900 placeholder:text-neutral-400 outline-none ring-offset-2 focus-visible:ring-2 focus-visible:ring-[#C72030]/25"
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
              <div className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white", color)}>
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
              className="min-h-[100px] resize-y rounded-xl border-neutral-200 bg-white text-sm"
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
            className="inline-flex h-11 items-center justify-center rounded-xl border border-amber-300 bg-amber-50 px-6 text-sm font-semibold text-amber-900 shadow-sm hover:bg-amber-100 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Cancel edit
          </button>
        )}
        <button
          type="button"
          onClick={clearForm}
          disabled={isPending}
          className="inline-flex h-11 items-center justify-center rounded-xl border border-neutral-300 bg-white px-6 text-sm font-semibold text-neutral-700 shadow-sm hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Clear form
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={isPending || teamMembersLoading}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#DA7756] px-6 text-sm font-semibold text-white shadow-sm hover:bg-[#DA7756]/85 disabled:cursor-not-allowed disabled:opacity-60"
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

      <div className="rounded-2xl border border-violet-100 bg-violet-50/90 px-4 py-4 sm:px-5">
        <div className="flex gap-3 sm:gap-4">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-violet-200/80">
            <Lightbulb className="h-5 w-5 text-violet-700" strokeWidth={2} />
          </div>
          <div>
            <p className="text-sm font-semibold text-violet-950">Feedback tips</p>
            <ul className="mt-2 list-disc space-y-1.5 pl-4 text-sm leading-relaxed text-violet-900/90">
              <li>Be specific — reference real situations and outcomes.</li>
              <li>Focus on behavior and impact, not personality.</li>
              <li>Make it timely; don&apos;t wait weeks to share important input.</li>
              <li>Listen openly when they respond; feedback is a conversation.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────

function FeedbackPage() {
  const [bannerVisible, setBannerVisible] = useState(true);
  const [feedbackTab, setFeedbackTab] = useState("received");
  const [editingFeedback, setEditingFeedback] = useState<FeedbackItem | null>(null);

  const selectedCompany = useSelector((state: RootState) => state.project.selectedCompany);
  const orgLine = selectedCompany?.name?.toUpperCase() ?? "YOUR ORGANIZATION";

  // Both queries are already cached from the list components; no extra requests made
  const { data: givenFeedback = [] } = useFeedbackList("given");
  const { data: receivedFeedback = [] } = useFeedbackList("received");

  const headerSummaryStats = useMemo((): SummaryStat[] => {
    const all = [...givenFeedback, ...receivedFeedback];
    const unread = all.filter((i) => i.status === "unread").length;
    const avgRating =
      all.length > 0
        ? (all.reduce((sum, i) => sum + i.rating, 0) / all.length).toFixed(1)
        : "0";
    return [
      { label: "Received", value: receivedFeedback.length, icon: Inbox, bgClass: "bg-sky-100/90", iconClass: "text-sky-600" },
      { label: "Given", value: givenFeedback.length, icon: Send, bgClass: "bg-[#E3F4E8]", iconClass: "text-[#2E7D32]" },
      { label: "Unread", value: unread, icon: MessageSquare, bgClass: "bg-orange-100/90", iconClass: "text-orange-600" },
      { label: "Avg Rating", value: avgRating, icon: TrendingUp, bgClass: "bg-violet-100/90", iconClass: "text-violet-600" },
      { label: "Feedback Points", value: 0, icon: ArrowUp, bgClass: "bg-teal-100/80", iconClass: "text-teal-600" },
    ];
  }, [givenFeedback, receivedFeedback]);

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[#f6f4ee] px-4 py-6 sm:px-6">
      <AdminViewEmulation />
      <div className="mx-auto max-w-6xl space-y-6">

        {bannerVisible && (
          <div className="flex items-center gap-3 rounded-2xl border border-sky-200/60 bg-sky-50/90 px-4 py-3 pr-2 shadow-sm">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-sky-500">
              <Lightbulb className="h-5 w-5 text-white" strokeWidth={2} />
            </div>
            <button type="button" className="min-w-0 flex-1 text-left" onClick={() => {}}>
              <p className="text-sm font-semibold text-sky-950">Giving & Receiving Feedback</p>
              <p className="text-xs text-sky-700/90">Click to view tips</p>
            </button>
            <div className="flex shrink-0 items-center gap-0.5">
              <button type="button" className="rounded-md p-2 text-sky-700 hover:bg-sky-100" aria-label="Expand tips">
                <ChevronRight className="h-4 w-4" />
              </button>
              <button
                type="button"
                className="rounded-md p-2 text-sky-700 hover:bg-sky-100"
                aria-label="Dismiss banner"
                onClick={() => setBannerVisible(false)}
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        <header className="flex flex-col gap-1 sm:flex-row sm:items-start sm:gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2 border-[#DA7756] bg-white shadow-sm">
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

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5 lg:gap-4">
          {headerSummaryStats.map(({ label, value, icon: Icon, bgClass, iconClass }) => (
            <Card
              key={label}
              className={cn("border-0 shadow-md transition-shadow hover:shadow-lg rounded-2xl p-5", bgClass)}
            >
              <div className="flex flex-col items-center text-center">
                <Icon className={cn("mb-3 h-7 w-7", iconClass)} />
                <p className="text-3xl font-bold tabular-nums text-neutral-900">{value}</p>
                <p className="mt-1 text-xs font-medium text-neutral-600">{label}</p>
              </div>
            </Card>
          ))}
        </div>

        <Card className="overflow-hidden rounded-2xl border border-[#DA7756]/20 bg-[#DA7756]/10 shadow-md">
          <Tabs value={feedbackTab} onValueChange={setFeedbackTab} className="w-full">
            <TabsList className={cn("h-auto w-full justify-start gap-1 rounded-none border-b border-[#DA7756]/20", "bg-[#DA7756]/10 p-2")}>
              <TabsTrigger
                value="received"
                className={cn(
                  "gap-2 rounded-xl px-4 py-2.5 text-sm font-medium text-neutral-600",
                  "data-[state=active]:bg-[#DA7756]/10 data-[state=active]:text-neutral-900 data-[state=active]:shadow-sm"
                )}
              >
                <Inbox className="h-4 w-4" />
                Received
                {receivedFeedback.length > 0 && (
                  <span className="ml-1 rounded-full bg-sky-500 px-1.5 py-0.5 text-[10px] font-bold text-white">
                    {receivedFeedback.length}
                  </span>
                )}
              </TabsTrigger>
              <TabsTrigger
                value="given"
                className={cn(
                  "gap-2 rounded-xl px-4 py-2.5 text-sm font-medium text-neutral-600",
                  "data-[state=active]:bg-[#DA7756]/10 data-[state=active]:text-neutral-900 data-[state=active]:shadow-sm"
                )}
              >
                <Send className="h-4 w-4" />
                Given
                {givenFeedback.length > 0 && (
                  <span className="ml-1 rounded-full bg-[#2E7D32] px-1.5 py-0.5 text-[10px] font-bold text-white">
                    {givenFeedback.length}
                  </span>
                )}
              </TabsTrigger>
              <TabsTrigger
                value="give"
                className={cn(
                  "gap-2 rounded-xl px-4 py-2.5 text-sm font-medium text-neutral-600",
                  "data-[state=active]:bg-[#DA7756] data-[state=active]:text-white",
                  "data-[state=active]:shadow-sm data-[state=active]:[&_svg]:text-white",
                  "data-[state=inactive]:bg-transparent"
                )}
              >
                <Pencil className="h-4 w-4" />
                Give Feedback
              </TabsTrigger>
            </TabsList>

            {feedbackTab === "received" && (
              <div className="border-b border-neutral-100 bg-[#DA7756]/10 px-4 py-3 sm:px-6">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
                  <span className="text-sm text-neutral-600">View feedback for:</span>
                  <Select defaultValue="myself">
                    <SelectTrigger className="h-10 w-full max-w-[220px] rounded-lg border-neutral-200 bg-white">
                      <SelectValue placeholder="Myself" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="myself">Myself</SelectItem>
                      <SelectItem value="team">My team</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            <TabsContent value="received" className="m-0 focus-visible:outline-none">
              <AsyncBoundary>
                <GivenFeedbackList
                  onGiveFeedbackClick={() => { setEditingFeedback(null); setFeedbackTab("give"); }}
                  onEditFeedback={(item) => { setEditingFeedback(item); setFeedbackTab("give"); }}
                  direction="from"
                />
              </AsyncBoundary>
            </TabsContent>

            <TabsContent value="given" className="m-0 focus-visible:outline-none">
              <AsyncBoundary>
                <GivenFeedbackList
                  onGiveFeedbackClick={() => { setEditingFeedback(null); setFeedbackTab("give"); }}
                  onEditFeedback={(item) => { setEditingFeedback(item); setFeedbackTab("give"); }}
                  direction="to"
                />
              </AsyncBoundary>
            </TabsContent>

            <TabsContent value="give" className="m-0 focus-visible:outline-none">
              <AsyncBoundary>
                <GiveFeedbackForm
                  initialFeedback={editingFeedback}
                  onCancelEdit={() => { setEditingFeedback(null); setFeedbackTab("given"); }}
                  onSubmitted={() => { setEditingFeedback(null); setFeedbackTab("given"); }}
                />
              </AsyncBoundary>
            </TabsContent>
          </Tabs>
        </Card>
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