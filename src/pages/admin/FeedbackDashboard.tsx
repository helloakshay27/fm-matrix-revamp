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
  ArrowDownLeft,
  ArrowUpRight,
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

interface DepartmentFeedback {
  id: string;
  rank: number;
  name: string;
  count: number;
  rating: number;
}

interface FeedbackLeaderboardItem {
  id: string;
  rank: number;
  name: string;
  designation: string;
  count: number;
}

interface DashboardData {
  totalFeedbacks: number;
  averageRating: number;
  activeTeam: number;
  readRate: number | null;
  readTrackingAvailable: boolean;
  ratingBreakdown: RatingBreakdown;
  departments: DepartmentFeedback[];
  mostFeedbackReceived: FeedbackLeaderboardItem[];
  mostFeedbackGiven: FeedbackLeaderboardItem[];
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
  activeTeam?: number;
  active_team?: number;
  readRate?: number | null;
  read_rate?: number | null;
  readTrackingAvailable?: boolean;
  read_tracking_available?: boolean;
  ratingBreakdown?: Partial<RatingBreakdown>;
  rating_breakdown?: Partial<RatingBreakdown>;
  feedbackByDepartment?: unknown[];
  feedback_by_department?: unknown[];
  recentFeedbacks?: ApiRecentFeedback[];
  recent_feedbacks?: ApiRecentFeedback[];
}

interface RatingsFeedbackDashboardResponse {
  success?: boolean;
  data?: ApiDashboardData;
}

type ApiRecord = Record<string, unknown>;

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

function toOptionalNumber(value: unknown): number | undefined {
  const num = Number(value);
  return Number.isFinite(num) ? num : undefined;
}

function normalizeKey(key: string): string {
  return key.toLowerCase().replace(/[^a-z0-9]/g, "");
}

function findFirstNumberDeep(
  value: unknown,
  keySet: Set<string>,
  maxDepth = 6,
  depth = 0
): number | undefined {
  if (value === null || value === undefined || depth > maxDepth) {
    return undefined;
  }

  if (Array.isArray(value)) {
    for (const item of value) {
      const found = findFirstNumberDeep(item, keySet, maxDepth, depth + 1);
      if (found !== undefined) return found;
    }
    return undefined;
  }

  if (typeof value !== "object") {
    return undefined;
  }

  const record = value as ApiRecord;
  for (const [key, raw] of Object.entries(record)) {
    if (!keySet.has(normalizeKey(key))) continue;
    const parsed = toOptionalNumber(raw);
    if (parsed !== undefined) return parsed;
  }

  for (const nested of Object.values(record)) {
    const found = findFirstNumberDeep(nested, keySet, maxDepth, depth + 1);
    if (found !== undefined) return found;
  }

  return undefined;
}

function pickFirstNumberDeep(payload: unknown, keys: string[]): number | undefined {
  const normalizedKeySet = new Set(keys.map(normalizeKey));
  return findFirstNumberDeep(payload, normalizedKeySet);
}

function pickFirstValue(record: ApiRecord, keys: string[]): unknown {
  for (const key of keys) {
    if (key in record) return record[key];
  }
  return undefined;
}

function pickFirstNumber(record: ApiRecord, keys: string[]): number | undefined {
  for (const key of keys) {
    if (!(key in record)) continue;
    const parsed = toOptionalNumber(record[key]);
    if (parsed !== undefined) return parsed;
  }
  return undefined;
}

function pickFirstNullableNumber(
  record: ApiRecord,
  keys: string[]
): number | null | undefined {
  for (const key of keys) {
    if (!(key in record)) continue;

    const value = record[key];
    if (value === null) return null;

    const parsed = toOptionalNumber(value);
    if (parsed !== undefined) return parsed;
  }

  return undefined;
}

function toApiRecord(value: unknown): ApiRecord {
  return value && typeof value === "object" ? (value as ApiRecord) : {};
}

function getString(value: unknown): string {
  return typeof value === "string" ? value : "";
}

function pickFirstString(record: ApiRecord, keys: string[]): string {
  for (const key of keys) {
    const value = record[key];
    if (typeof value === "string" && value.trim()) {
      return value.trim();
    }
  }

  return "";
}

function toBoolean(value: unknown): boolean | undefined {
  if (typeof value === "boolean") return value;
  if (typeof value === "number") {
    if (value === 1) return true;
    if (value === 0) return false;
    return undefined;
  }
  if (typeof value === "string") {
    const normalized = value.trim().toLowerCase();
    if (["true", "1", "yes", "read", "viewed", "seen"].includes(normalized)) {
      return true;
    }
    if (["false", "0", "no", "unread", "not_read"].includes(normalized)) {
      return false;
    }
  }

  return undefined;
}

function deriveReadRateFromActivity(activityRows: unknown[]): number | undefined {
  let read = 0;
  let trackable = 0;

  for (const row of activityRows) {
    const item = toApiRecord(row);
    const readState = toBoolean(
      pickFirstValue(item, [
        "is_read",
        "isRead",
        "read",
        "read_status",
        "is_viewed",
        "is_seen",
        "viewed",
        "seen",
      ])
    );

    if (readState === undefined) continue;
    trackable += 1;
    if (readState) read += 1;
  }

  if (trackable === 0) return undefined;
  return (read / trackable) * 100;
}

function pickList(payload: unknown, keys: string[], allowAnyArray = false): unknown[] {
  if (Array.isArray(payload)) return payload;

  const record = toApiRecord(payload);
  for (const key of keys) {
    const candidate = record[key];
    if (Array.isArray(candidate)) return candidate;
  }

  if (allowAnyArray) {
    for (const value of Object.values(record)) {
      if (Array.isArray(value) && value.length > 0) return value;
    }
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

function mapLeaderboardItems(rawList: unknown[], mode: "received" | "given") {
  return rawList
    .map((item, index) => {
      const row = toApiRecord(item);

      return {
        id: String(
          row.id ??
            row.user_id ??
            row.employee_id ??
            row.staff_id ??
            `${mode}-${index}`
        ),
        rank: toNumber(row.rank, index + 1),
        name:
          pickFirstString(row, ["name", "user_name", "employee_name", "staff_name"]) ||
          "Unknown User",
        designation:
          pickFirstString(row, ["designation", "department_name", "role"]) ||
          "No designation",
        count: toNumber(
          mode === "received"
            ? row.feedback_received ??
                row.received_count ??
                row.total_feedback_received ??
                row.total_received ??
                row.count
            : row.feedback_given ??
                row.given_count ??
                row.total_feedback_given ??
                row.total_given ??
                row.count
        ),
      };
    })
    .sort((left, right) => left.rank - right.rank)
    .slice(0, 5);
}

function buildLeaderboardFromActivity(
  activityRows: unknown[],
  mode: "received" | "given"
): FeedbackLeaderboardItem[] {
  const byPerson = new Map<
    string,
    { id: string; name: string; designation: string; count: number }
  >();

  for (const activity of activityRows) {
    const row = toApiRecord(activity);
    const name =
      mode === "received"
        ? pickFirstString(row, [
            "receiver_name",
            "feedback_receiver_name",
            "to_user_name",
            "recipient_name",
            "name",
          ])
        : pickFirstString(row, [
            "giver_name",
            "feedback_giver_name",
            "from_user_name",
            "sender_name",
            "name",
          ]);

    if (!name) continue;

    const designation =
      mode === "received"
        ? pickFirstString(row, [
            "receiver_designation",
            "feedback_receiver_designation",
            "receiver_department_name",
            "designation",
            "department_name",
          ])
        : pickFirstString(row, [
            "giver_designation",
            "feedback_giver_designation",
            "giver_department_name",
            "designation",
            "department_name",
          ]);

    const id = String(
      (mode === "received"
        ? row.receiver_id ?? row.feedback_receiver_id ?? row.to_user_id
        : row.giver_id ?? row.feedback_giver_id ?? row.from_user_id) ?? name
    );

    const count = toNumber(
      mode === "received"
        ? row.feedback_received ?? row.received_count ?? row.count
        : row.feedback_given ?? row.given_count ?? row.count,
      1
    );

    const key = `${id}::${name}`;
    const existing = byPerson.get(key);
    if (existing) {
      existing.count += Math.max(1, count);
      if (!existing.designation && designation) {
        existing.designation = designation;
      }
    } else {
      byPerson.set(key, {
        id,
        name,
        designation: designation || "No designation",
        count: Math.max(1, count),
      });
    }
  }

  return [...byPerson.values()]
    .sort((a, b) => b.count - a.count)
    .slice(0, 5)
    .map((row, index) => ({
      id: row.id,
      rank: index + 1,
      name: row.name,
      designation: row.designation,
      count: row.count,
    }));
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
    activeTeam: 0,
    readRate: null,
    readTrackingAvailable: false,
    ratingBreakdown,
    departments: [],
    mostFeedbackReceived: [],
    mostFeedbackGiven: [],
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

  const wrapper = raw as RatingsFeedbackDashboardResponse;
  const source = (wrapper.data ?? raw) as ApiDashboardData;
  const sourceRecord = toApiRecord(source);
  const breakdown = source.ratingBreakdown ?? source.rating_breakdown ?? {};
  const recent =
    source.recentFeedbacks ??
    source.recent_feedbacks ??
    pickList(source, ["recent_feedback_activity", "feedback_activity", "feedback_logs"]);
  const departmentsRaw =
    source.feedbackByDepartment ??
    source.feedback_by_department ??
    pickList(source, ["feedback_by_department"]);
  const departments = departmentsRaw
    .map((item, index) => {
      const department = toApiRecord(item);

      return {
        id: String(department.department_id ?? department.id ?? `department-${index}`),
        rank: toNumber(department.rank, index + 1),
        name: getString(department.department_name) || getString(department.name) || "Unknown Department",
        count: toNumber(
          department.feedback_received ?? department.total_feedback ?? department.count
        ),
        rating: toNumber(department.avg_rating ?? department.average_rating, 0),
      };
    })
    .sort((left, right) => left.rank - right.rank);

  const receivedLeaderboardRaw = pickList(source, [
    "mostFeedbackReceived",
    "most_feedback_received",
    "feedback_received_leaderboard",
    "top_feedback_received",
    "feedback_received_top",
  ]);
  const mostFeedbackReceived =
    receivedLeaderboardRaw.length > 0
      ? mapLeaderboardItems(receivedLeaderboardRaw, "received")
      : buildLeaderboardFromActivity(recent, "received");

  const givenLeaderboardRaw = pickList(source, [
    "mostFeedbackGiven",
    "most_feedback_given",
    "feedback_given_leaderboard",
    "top_feedback_given",
    "feedback_given_top",
  ]);
  const mostFeedbackGiven =
    givenLeaderboardRaw.length > 0
      ? mapLeaderboardItems(givenLeaderboardRaw, "given")
      : buildLeaderboardFromActivity(recent, "given");

  const recentFeedbacks = recent.map((item, index) => {
    const recentItem = toApiRecord(item);

    return {
      id: String(
        recentItem.id ??
          (recentItem.feedback_id as string | number | undefined) ??
          `feedback-${index}`
      ),
      rating: Math.min(
        5,
        Math.max(
          1,
          Math.round(toNumber(recentItem.rating ?? recentItem.avg_rating, 0)) || 1
        )
      ),
      comment:
        getString(recentItem.comment) ||
        getString(recentItem.feedback_comment) ||
        getString(recentItem.department_name) ||
        "No comment provided",
      createdAt:
        getString(recentItem.createdAt) ||
        getString(recentItem.created_at) ||
        getString(recentItem.feedback_date) ||
        new Date().toISOString(),
    };
  });

  const hasBreakdownValues = Object.values(breakdown).some(
    (value) => toNumber(value) > 0
  );
  const derivedRatingBreakdown = hasBreakdownValues
    ? {
        "1": toNumber(breakdown["1"]),
        "2": toNumber(breakdown["2"]),
        "3": toNumber(breakdown["3"]),
        "4": toNumber(breakdown["4"]),
        "5": toNumber(breakdown["5"]),
      }
    : buildDashboardDataFromFeedbacks(recentFeedbacks).ratingBreakdown;

  const totalFeedbacksFromApi =
    pickFirstNumber(sourceRecord, [
      "totalFeedbacks",
      "total_feedbacks",
      "total",
      "feedback_count",
      "total_count",
    ]) ??
    pickFirstNumberDeep(source, [
      "totalFeedbacks",
      "total_feedbacks",
      "total_feedback",
      "feedback_count",
      "total_count",
      "feedbacks_count",
    ]);

  const totalFeedbacksFromBreakdown = Object.values(derivedRatingBreakdown).reduce(
    (sum, count) => sum + count,
    0
  );
  const totalFeedbacksFromDepartments = departments.reduce(
    (sum, department) => sum + department.count,
    0
  );
  const totalFeedbacks =
    totalFeedbacksFromApi ??
    (totalFeedbacksFromBreakdown > 0
      ? totalFeedbacksFromBreakdown
      : totalFeedbacksFromDepartments > 0
      ? totalFeedbacksFromDepartments
      : recentFeedbacks.length);

  const averageRatingFromApi =
    pickFirstNumber(sourceRecord, [
      "averageRating",
      "average_rating",
      "avg_rating",
      "avgRating",
    ]) ??
    pickFirstNumberDeep(source, [
      "averageRating",
      "average_rating",
      "avg_rating",
      "avgRating",
      "overall_average_rating",
      "overall_avg_rating",
      "mean_rating",
    ]);
  const averageRatingFromRecent =
    recentFeedbacks.length > 0
      ? recentFeedbacks.reduce((sum, item) => sum + item.rating, 0) /
        recentFeedbacks.length
      : undefined;
  const averageRatingFromBreakdown =
    totalFeedbacksFromBreakdown > 0
      ? (Number(derivedRatingBreakdown["1"]) * 1 +
          Number(derivedRatingBreakdown["2"]) * 2 +
          Number(derivedRatingBreakdown["3"]) * 3 +
          Number(derivedRatingBreakdown["4"]) * 4 +
          Number(derivedRatingBreakdown["5"]) * 5) /
        totalFeedbacksFromBreakdown
      : undefined;
  const averageRating =
    averageRatingFromApi ?? averageRatingFromRecent ?? averageRatingFromBreakdown ?? 0;

  const activeTeamFromApi =
    pickFirstNumber(sourceRecord, [
      "activeTeam",
      "active_team",
      "active_teams",
      "active_team_count",
      "team_count",
    ]) ??
    pickFirstNumberDeep(source, [
      "activeTeam",
      "active_team",
      "active_teams",
      "active_team_count",
      "active_users",
      "active_users_count",
      "team_count",
      "member_count",
    ]);
  const activeTeamFromLeaderboards = new Set(
    [...mostFeedbackReceived, ...mostFeedbackGiven].map((item) => item.id || item.name)
  ).size;
  const activeTeamFromDepartments = departments.filter(
    (department) => department.count > 0
  ).length;
  const activeTeam =
    activeTeamFromApi ??
    (activeTeamFromLeaderboards > 0
      ? activeTeamFromLeaderboards
      : activeTeamFromDepartments > 0
      ? activeTeamFromDepartments
      : departments.length);

  const readRateFromDirect = pickFirstNullableNumber(sourceRecord, [
    "readRate",
    "read_rate",
    "read_percentage",
    "readPercent",
    "read_percent",
    "feedback_read_rate",
    "read_feedback_rate",
    "read_ratio",
    "readratio",
    "readRatio",
  ]);
  const readRateFromDeep =
    readRateFromDirect === undefined
      ? pickFirstNumberDeep(source, [
          "readRate",
          "read_rate",
          "read_percentage",
          "readPercent",
          "read_percent",
          "feedback_read_rate",
          "read_feedback_rate",
          "read_ratio",
        ])
      : undefined;
  const readCountFromApi = pickFirstNumber(sourceRecord, [
    "read_count",
    "read_feedback_count",
    "feedback_read_count",
    "total_read",
  ]);
  const unreadCountFromApi = pickFirstNumber(sourceRecord, [
    "unread_count",
    "unread_feedback_count",
    "feedback_unread_count",
    "total_unread",
  ]);
  const readRateFromCounts =
    readCountFromApi !== undefined && unreadCountFromApi !== undefined
      ? readCountFromApi + unreadCountFromApi > 0
        ? (readCountFromApi / (readCountFromApi + unreadCountFromApi)) * 100
        : undefined
      : readCountFromApi !== undefined && totalFeedbacks > 0
      ? (readCountFromApi / totalFeedbacks) * 100
      : undefined;
  const readRateFromActivity = deriveReadRateFromActivity(recent);
  const selectedReadRate =
    readRateFromDirect ?? readRateFromDeep ?? readRateFromCounts ?? readRateFromActivity ?? null;
  const readRate =
    selectedReadRate === null
      ? null
      : Math.max(
          0,
          Math.min(
            100,
            selectedReadRate > 0 && selectedReadRate < 1
              ? selectedReadRate * 100
              : selectedReadRate
          )
        );
  const readTrackingFlag = pickFirstValue(sourceRecord, [
    "readTrackingAvailable",
    "read_tracking_available",
    "is_read_tracking_available",
    "readTrackingEnabled",
    "read_tracking_enabled",
  ]);
  const readTrackingAvailable =
    typeof readTrackingFlag === "boolean"
      ? readTrackingFlag
      : typeof readTrackingFlag === "string"
      ? ["true", "1", "yes", "enabled"].includes(
          readTrackingFlag.trim().toLowerCase()
        )
      : typeof readTrackingFlag === "number"
      ? readTrackingFlag > 0
      : readRate !== undefined && readRate !== null;

  return {
    totalFeedbacks,
    averageRating,
    activeTeam,
    readRate: readRate ?? null,
    readTrackingAvailable,
    ratingBreakdown: derivedRatingBreakdown,
    departments,
    mostFeedbackReceived,
    mostFeedbackGiven,
    recentFeedbacks,
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

  let requestError: unknown = null;

  try {
    const response = await axios.request<T>({
      method: "get",
      baseURL,
      url: path,
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
      const response = await safeApiRequest<RatingsFeedbackDashboardResponse>(
        RATINGS_FEEDBACK_DASHBOARD_ENDPOINT
      );

      const payload = normalizeDashboardData(response);

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
            onClick={() => fetchDashboard()}
            className="mt-4 rounded-lg bg-[#DA7756] px-5 py-2 text-xs font-semibold text-white hover:bg-[#DA7756]/85"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // ── Real data from API ─────────────────────────────────────────────────────
  const {
    totalFeedbacks,
    averageRating,
    activeTeam,
    readRate,
    readTrackingAvailable,
    ratingBreakdown,
    departments,
    mostFeedbackReceived,
    mostFeedbackGiven,
    recentFeedbacks,
  } = data;

  const readRateDisplay =
    readRate !== null
      ? `${Number.isInteger(readRate) ? readRate : readRate.toFixed(1)}%`
      : "N/A";

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
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">

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

          {/* Active Team — from API */}
          <Card className="rounded-2xl border-0 bg-orange-100/90 p-5 shadow-md transition-shadow hover:shadow-lg">
            <div className="flex flex-col items-center text-center">
              <Users className="mb-3 h-7 w-7 text-orange-600" />
              <p className="text-3xl font-bold tabular-nums text-neutral-900">
                {activeTeam}
              </p>
              <p className="mt-1 text-xs font-medium text-neutral-600">
                Active Team
              </p>
            </div>
          </Card>

          {/* Read Rate — from API */}
          <Card className="rounded-2xl border-0 bg-emerald-100/90 p-5 shadow-md transition-shadow hover:shadow-lg">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-medium text-neutral-700">Read Rate</p>
                <p className="mt-1 text-3xl font-bold tabular-nums text-neutral-900">
                  {readRateDisplay}
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-emerald-600" strokeWidth={2.2} />
            </div>
          </Card>
        </div>

        <Card className="rounded-2xl border border-[#DA7756]/20 bg-[#DA7756]/10 p-4 shadow-sm sm:p-6">
          <h2 className="mb-4 text-lg font-semibold text-neutral-900">
            Feedback by Department
          </h2>
          {departments.length > 0 ? (
            <ul className="space-y-3">
              {departments.map((department) => (
              <li
                key={department.id}
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
                  {department.rating > 0 ? department.rating.toFixed(1) : "N/A"}
                </span>
              </li>
              ))}
            </ul>
          ) : (
            <div className="rounded-xl border border-[#DA7756]/20 bg-[#fef6f4] p-5 text-center text-sm text-neutral-600">
              Department-wise feedback is not available in the current dashboard API response.
            </div>
          )}
        </Card>

        <div className="grid gap-4 lg:grid-cols-2">
          <Card className="rounded-2xl border border-[#DA7756]/20 bg-[#DA7756]/10 p-4 shadow-sm sm:p-6">
            <div className="mb-4 flex items-center gap-2">
              <ArrowDownLeft className="h-5 w-5 text-[#DA7756]" strokeWidth={2.25} />
              <h2 className="text-lg font-semibold text-neutral-900">Most Feedback Received</h2>
            </div>
            {mostFeedbackReceived.length > 0 ? (
              <ul className="space-y-3">
                {mostFeedbackReceived.map((entry) => (
                  <li
                    key={entry.id}
                    className="flex items-center gap-3 rounded-xl border border-[#DA7756]/20 bg-[#fef6f4] px-3 py-3 sm:gap-4 sm:px-4"
                  >
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#DA7756] text-sm font-bold text-white">
                      {entry.rank}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-semibold text-neutral-900">{entry.name}</p>
                      <p className="truncate text-sm text-neutral-600">{entry.designation}</p>
                    </div>
                    <span className="shrink-0 rounded-lg bg-[#DA7756]/15 px-3 py-1 text-sm font-semibold text-[#9e4f36]">
                      {entry.count} received
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="rounded-xl border border-[#DA7756]/20 bg-[#fef6f4] p-5 text-center text-sm text-neutral-600">
                No feedback-received leaderboard data in current API response.
              </div>
            )}
          </Card>

          <Card className="rounded-2xl border border-[#DA7756]/20 bg-[#DA7756]/10 p-4 shadow-sm sm:p-6">
            <div className="mb-4 flex items-center gap-2">
              <ArrowUpRight className="h-5 w-5 text-[#b85f42]" strokeWidth={2.25} />
              <h2 className="text-lg font-semibold text-neutral-900">Most Feedback Given</h2>
            </div>
            {mostFeedbackGiven.length > 0 ? (
              <ul className="space-y-3">
                {mostFeedbackGiven.map((entry) => (
                  <li
                    key={entry.id}
                    className="flex items-center gap-3 rounded-xl border border-[#DA7756]/20 bg-[#fef6f4] px-3 py-3 sm:gap-4 sm:px-4"
                  >
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#b85f42] text-sm font-bold text-white">
                      {entry.rank}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-semibold text-neutral-900">{entry.name}</p>
                      <p className="truncate text-sm text-neutral-600">{entry.designation}</p>
                    </div>
                    <span className="shrink-0 rounded-lg bg-[#b85f42]/15 px-3 py-1 text-sm font-semibold text-[#8f4a33]">
                      {entry.count} given
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="rounded-xl border border-[#DA7756]/20 bg-[#fef6f4] p-5 text-center text-sm text-neutral-600">
                No feedback-given leaderboard data in current API response.
              </div>
            )}
          </Card>
        </div>

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