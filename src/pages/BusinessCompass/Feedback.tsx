import React, { useEffect, useMemo, useState } from "react";
import axios, { AxiosError } from "axios";
import { useSelector } from "react-redux";
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

// ─── Types ────────────────────────────────────────────────────────────────────

type SummaryStat = {
  label: string;
  value: string | number;
  icon: React.ElementType;
  bgClass: string;
  iconClass: string;
};

type GivenFeedbackItem = {
  id: string;
  recipientName: string;
  date: string;
  rating: number;
  status: "unread" | "read";
  showActions?: boolean;
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

type ApiRecord = Record<string, unknown>;
type SubmitStatus = "idle" | "loading" | "success" | "error";

// ─── API Endpoints ─────────────────────────────────────────────────────────────

const TEAM_MEMBERS_ENDPOINT = "/pms/users/get_escalate_to_users.json";

const FEEDBACKS_ENDPOINTS = [
  "/pms/team_feedbacks.json",
  "/api/pms/team_feedbacks.json",
  "/pms/team_feedbacks",
  "/api/pms/team_feedbacks",
  "/pms/feedbacks.json",
  "/api/pms/feedbacks.json",
  "/pms/feedbacks",
  "/api/pms/feedbacks",
  "/feedbacks.json",
  "/feedbacks",
  "/api/feedbacks.json",
  "/api/feedbacks",
];

// ─── API Helpers ───────────────────────────────────────────────────────────────

async function resolveFeedbackApiBaseUrl(): Promise<string> {
  const embeddedOrgId = getEmbeddedOrgId();
  if (embeddedOrgId) {
    try {
      const resolved = await resolveBaseUrlByOrgId(embeddedOrgId);
      return resolved.replace(/\/+$/, "");
    } catch {
      /* fall through to session base */
    }
  }
  const base = API_CONFIG.BASE_URL;
  if (!base) throw new Error("API base URL not configured. Please log in again.");
  return base.replace(/\/+$/, "");
}

function getFeedbackAuthHeader(): string {
  const embeddedToken = getEmbeddedToken();
  if (embeddedToken) return `Bearer ${embeddedToken}`;
  return getAuthHeader();
}

async function safeApiRequest<T>(
  method: "get" | "post" | "patch" | "put",
  endpoint: string,
  options?: {
    params?: Record<string, string | number>;
    data?: unknown;
    headers?: Record<string, string>;
  }
): Promise<T> {
  const path = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  const baseURL = await resolveFeedbackApiBaseUrl();

  try {
    const response = await axios.request<T>({
      method,
      baseURL,
      url: path,
      params: options?.params,
      data: options?.data,
      timeout: 45000,
      headers: {
        Authorization: getFeedbackAuthHeader(),
        Accept: "application/json",
        ...(options?.headers ?? {}),
      },
    });
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<ApiRecord>;
    const responseData = toApiRecord(axiosError.response?.data);
    const message =
      getString(responseData.message) ||
      getString(responseData.error) ||
      (axiosError.response?.status
        ? `Request failed with status ${axiosError.response.status}`
        : "") ||
      axiosError.message ||
      "Request failed";
    throw new Error(message);
  }
}

async function createFeedbackWithFallbacks(payload: ApiRecord): Promise<unknown> {
  let latestError: Error | null = null;
  const bodyVariants: ApiRecord[] = [payload, { feedback: payload }];
  for (const endpoint of FEEDBACKS_ENDPOINTS) {
    for (const body of bodyVariants) {
      try {
        return await safeApiRequest<unknown>("post", endpoint, {
          data: body,
          headers: { "Content-Type": "application/json" },
        });
      } catch (error) {
        const msg = error instanceof Error ? error.message : "Failed to send feedback.";
        latestError = new Error(`${endpoint}: ${msg}`);
      }
    }
  }
  throw latestError ?? new Error("Failed to send feedback.");
}

async function updateFeedbackWithFallbacks(
  feedbackId: string,
  payload: ApiRecord
): Promise<unknown> {
  const updateEndpoints = [
    `/pms/team_feedbacks/${feedbackId}.json`,
    `/api/pms/team_feedbacks/${feedbackId}.json`,
    `/pms/feedbacks/${feedbackId}.json`,
    `/api/pms/feedbacks/${feedbackId}.json`,
    `/feedbacks/${feedbackId}.json`,
    `/feedbacks/${feedbackId}`,
    `/api/feedbacks/${feedbackId}`,
  ];
  const bodyVariants: ApiRecord[] = [payload, { feedback: payload }];
  let latestError: Error | null = null;
  for (const endpoint of updateEndpoints) {
    for (const method of ["patch", "put"] as const) {
      for (const body of bodyVariants) {
        try {
          return await safeApiRequest<unknown>(method, endpoint, {
            data: body,
            headers: { "Content-Type": "application/json" },
          });
        } catch (error) {
          const msg = error instanceof Error ? error.message : "Failed to update feedback.";
          latestError = new Error(`${endpoint}: ${msg}`);
        }
      }
    }
  }
  throw latestError ?? new Error("Failed to update feedback.");
}

// ─── Data Utilities ────────────────────────────────────────────────────────────

function toApiRecord(value: unknown): ApiRecord {
  return value && typeof value === "object" ? (value as ApiRecord) : {};
}

function getString(value: unknown): string {
  return typeof value === "string" ? value : "";
}

function getNumber(value: unknown): number {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value.trim() !== "") {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : 0;
  }
  return 0;
}

/**
 * Extracts an array from any API response shape:
 *   - plain array   → returned as-is
 *   - { key: [...] } → checks each key name
 *   - last resort   → first array value found in the object
 */
function pickList(payload: unknown, keys: string[]): unknown[] {
  if (Array.isArray(payload)) return payload;
  const record = toApiRecord(payload);
  for (const key of keys) {
    const candidate = record[key];
    if (Array.isArray(candidate)) return candidate;
  }
  // Last resort
  for (const val of Object.values(record)) {
    if (Array.isArray(val) && val.length > 0) return val;
  }
  return [];
}

function formatApiDate(input: unknown): string {
  const raw = getString(input);
  if (!raw) return "-";
  const date = new Date(raw);
  if (Number.isNaN(date.getTime())) return raw;
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function buildPreview(item: ApiRecord): string {
  return [
    getString(item.positive_opening),
    getString(item.constructive_feedback),
    getString(item.positive_closing),
  ]
    .filter(Boolean)
    .join(" ");
}

function mapFeedbackItem(rawItem: unknown): GivenFeedbackItem {
  const item = toApiRecord(rawItem);
  const recipient = toApiRecord(item.recipient ?? item.user ?? item.resource);
  const ratingFrom = toApiRecord(item.rating_from);

  const recipientName =
    getString(item.recipient_name) ||
    getString(recipient.name) ||
    getString(recipient.full_name) ||
    [getString(recipient.firstname), getString(recipient.lastname)].filter(Boolean).join(" ") ||
    "Team Member";

  const itemId =
    getString(item.id) ||
    String(getNumber(item.id) || Date.now() + Math.floor(Math.random() * 1000));

  const score = Math.min(5, Math.max(1, Math.round(getNumber(item.score)) || 1));

  const resourceId =
    getNumber(item.resource_id) ||
    getNumber(recipient.id) ||
    getNumber(toApiRecord(item.resource).id) ||
    undefined;

  const ratingFromId =
    getNumber(item.rating_from_id) ||
    getNumber(ratingFrom.id) ||
    getNumber(ratingFrom.user_id) ||
    undefined;

  return {
    id: itemId,
    recipientName,
    date: formatApiDate(item.created_at ?? item.createdAt ?? item.date),
    rating: score,
    status: item.read === true ? "read" : "unread",
    showActions: true,
    detailPreview: buildPreview(item) || undefined,
    resourceId,
    ratingFromType:
      getString(item.rating_from_type) || getString(ratingFrom.type) || "Team",
    ratingFromId,
    positiveOpening: getString(item.positive_opening) || undefined,
    constructiveFeedback: getString(item.constructive_feedback) || undefined,
    positiveClosing: getString(item.positive_closing) || undefined,
    createdAt: getString(item.created_at) || getString(item.createdAt) || undefined,
  };
}

function extractFeedbackCollection(payload: unknown): unknown[] {
  return pickList(payload, [
    "team_feedbacks",
    "feedbacks",
    "pms_team_feedbacks",
    "ratings",
    "data",
    "results",
    "items",
    "feedback",
  ]);
}

/**
 * Maps a raw API user to TeamMemberOption.
 * Handles all Lockated field name variations.
 */
function mapTeamMember(rawMember: unknown): TeamMemberOption | null {
  const member = toApiRecord(rawMember);
  const id = getNumber(member.id);
  if (!id) return null;

  const firstName =
    getString(member.firstname) ||
    getString(member.first_name) ||
    getString(member.firstName);
  const lastName =
    getString(member.lastname) ||
    getString(member.last_name) ||
    getString(member.lastName);
  const fullName = [firstName, lastName].filter(Boolean).join(" ");

  const label =
    getString(member.name) ||
    getString(member.full_name) ||
    getString(member.fullName) ||
    fullName ||
    `User ${id}`;

  return { value: String(id), label, id };
}

/**
 * Gets the current user's ID — checks storage keys used by Lockated apps.
 */
function getCurrentUserIdFromStorage(): number | null {
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
      const parsed = JSON.parse(raw) as ApiRecord;
      const parsedId =
        getNumber(parsed.id) ||
        getNumber(parsed.user_id) ||
        getNumber(parsed.userId);
      if (parsedId) return parsedId;
    } catch {
      /* ignore */
    }
  }
  return null;
}

// ─── Sub-components ────────────────────────────────────────────────────────────

function FeedbackEmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <MessageSquare className="mb-4 h-16 w-16 text-neutral-300" strokeWidth={1.25} />
      <h3 className="text-lg font-semibold text-neutral-900">No Feedback Yet</h3>
      <p className="mt-2 max-w-sm text-sm text-neutral-500">
        You haven&apos;t received any feedback from your team members
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
            i <= value ? "fill-amber-400 text-amber-400" : "fill-transparent text-neutral-300"
          )}
          strokeWidth={i <= value ? 0 : 1.5}
        />
      ))}
    </div>
  );
}

function GivenFeedbackList({
  onGiveFeedbackClick,
  items,
  isLoading,
  loadError,
  onRetry,
  onEditFeedback,
  direction,
}: {
  onGiveFeedbackClick: () => void;
  items: GivenFeedbackItem[];
  isLoading: boolean;
  loadError: string;
  onRetry: () => void;
  onEditFeedback: (item: GivenFeedbackItem) => void;
  direction: "to" | "from";
}) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [ratingFilter, setRatingFilter] = useState("all");

  const filtered = items.filter((item) => {
    const q = searchQuery.trim().toLowerCase();
    const matchesSearch =
      !q ||
      item.recipientName.toLowerCase().includes(q) ||
      (item.detailPreview?.toLowerCase().includes(q) ?? false);
    const matchesRating = ratingFilter === "all" || String(item.rating) === ratingFilter;
    return matchesSearch && matchesRating;
  });

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
            Loading feedback...
          </div>
        ) : loadError ? (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-500" />
              <div>
                <p className="text-sm font-semibold text-red-800">Failed to load feedback</p>
                <p className="mt-0.5 text-sm text-red-700">{loadError}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={onRetry}
              className="mt-3 inline-flex h-9 items-center justify-center rounded-lg bg-red-600 px-4 text-xs font-semibold text-white hover:bg-red-700"
            >
              Retry
            </button>
          </div>
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
                    {item.showActions && (
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
                    )}
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

// ─── Date helper ───────────────────────────────────────────────────────────────

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
  teamMembers,
  teamMembersLoading,
  onSubmitted,
  initialFeedback,
  onCancelEdit,
}: {
  teamMembers: TeamMemberOption[];
  teamMembersLoading: boolean;
  onSubmitted: () => void;
  initialFeedback: GivenFeedbackItem | null;
  onCancelEdit: () => void;
}) {
  const [recipient, setRecipient] = useState<string | undefined>(undefined);
  const [feedbackDate, setFeedbackDate] = useState<Date>(() => new Date());
  const [datePickerOpen, setDatePickerOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [context, setContext] = useState("");
  const [positiveOpen, setPositiveOpen] = useState("");
  const [constructive, setConstructive] = useState("");
  const [positiveClose, setPositiveClose] = useState("");
  const [submitStatus, setSubmitStatus] = useState<SubmitStatus>("idle");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const isEditMode = !!initialFeedback;

  // Pre-fill when editing an existing feedback
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
    setSubmitStatus("idle");
    setErrorMessage("");
  }, [initialFeedback, teamMembers]);

  const clearForm = () => {
    setRecipient(undefined);
    setFeedbackDate(new Date());
    setDatePickerOpen(false);
    setRating(0);
    setContext("");
    setPositiveOpen("");
    setConstructive("");
    setPositiveClose("");
    setSubmitStatus("idle");
    setErrorMessage("");
  };

  const handleSubmit = async () => {
    if (!recipient) {
      setErrorMessage("Please select a team member to give feedback to.");
      setSubmitStatus("error");
      return;
    }
    if (rating === 0) {
      setErrorMessage("Please select a star rating.");
      setSubmitStatus("error");
      return;
    }
    const selectedMember = teamMembers.find((m) => m.value === recipient);
    if (!selectedMember) {
      setErrorMessage("Invalid recipient selected.");
      setSubmitStatus("error");
      return;
    }

    const currentUserId = getCurrentUserIdFromStorage();
    const payload: ApiRecord = {
      resource_type: "User",
      resource_id: selectedMember.id,
      score: rating,
      positive_opening: positiveOpen,
      constructive_feedback: constructive,
      positive_closing: positiveClose,
    };

    const ratingFromId = initialFeedback?.ratingFromId || currentUserId;
    if (ratingFromId) {
      payload.rating_from_type = initialFeedback?.ratingFromType || "Team";
      payload.rating_from_id = ratingFromId;
    }

    setSubmitStatus("loading");
    setErrorMessage("");

    try {
      const responseData = isEditMode && initialFeedback?.id
        ? await updateFeedbackWithFallbacks(initialFeedback.id, payload)
        : await createFeedbackWithFallbacks(payload);

      const responseRecord = toApiRecord(responseData);
      if (responseRecord.error) {
        throw new Error(getString(responseRecord.error) || "Unable to send feedback.");
      }

      setSubmitStatus("success");
      onSubmitted();
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Something went wrong. Please try again.";
      setErrorMessage(message);
      setSubmitStatus("error");
    }
  };

  if (submitStatus === "success") {
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

      {submitStatus === "error" && errorMessage && (
        <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3">
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-500" strokeWidth={2} />
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-red-800">Submission Failed</p>
            <p className="mt-0.5 text-sm text-red-700">{errorMessage}</p>
          </div>
          <button
            type="button"
            onClick={() => { setSubmitStatus("idle"); setErrorMessage(""); }}
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
                  Loading members...
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
                  <SelectItem key={m.value} value={m.value}>
                    {m.label}
                  </SelectItem>
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
                onSelect={(d) => {
                  if (d) { setFeedbackDate(d); setDatePickerOpen(false); }
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
            placeholder: "Share what is working well...",
          },
          {
            step: 2,
            color: "bg-orange-500",
            title: "Constructive feedback",
            desc: "Provide specific, actionable feedback for improvement.",
            value: constructive,
            onChange: setConstructive,
            placeholder: "Be clear and kind...",
          },
          {
            step: 3,
            color: "bg-sky-600",
            title: "Positive closing",
            desc: "End with encouragement and confidence in their abilities.",
            value: positiveClose,
            onChange: setPositiveClose,
            placeholder: "Close on a supportive note...",
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
            disabled={submitStatus === "loading"}
            className="inline-flex h-11 items-center justify-center rounded-xl border border-amber-300 bg-amber-50 px-6 text-sm font-semibold text-amber-900 shadow-sm hover:bg-amber-100 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel edit
          </button>
        )}
        <button
          type="button"
          onClick={clearForm}
          disabled={submitStatus === "loading"}
          className="inline-flex h-11 items-center justify-center rounded-xl border border-neutral-300 bg-white px-6 text-sm font-semibold text-neutral-700 shadow-sm hover:bg-neutral-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Clear form
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={submitStatus === "loading" || teamMembersLoading}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#DA7756] px-6 text-sm font-semibold text-white shadow-sm hover:bg-[#DA7756]/85 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {submitStatus === "loading" ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" strokeWidth={2} />
              {isEditMode ? "Updating..." : "Sending..."}
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

const Feedback = () => {
  const [bannerVisible, setBannerVisible] = useState(true);
  const [feedbackTab, setFeedbackTab] = useState("received");
  const [hasLoadedGiven, setHasLoadedGiven] = useState(false);
  const [hasLoadedReceived, setHasLoadedReceived] = useState(false);
  const [editingFeedback, setEditingFeedback] = useState<GivenFeedbackItem | null>(null);

  const [teamMembers, setTeamMembers] = useState<TeamMemberOption[]>([]);
  const [teamMembersLoading, setTeamMembersLoading] = useState(false);

  const [givenFeedback, setGivenFeedback] = useState<GivenFeedbackItem[]>([]);
  const [receivedFeedback, setReceivedFeedback] = useState<GivenFeedbackItem[]>([]);
  const [isLoadingGiven, setIsLoadingGiven] = useState(false);
  const [isLoadingReceived, setIsLoadingReceived] = useState(false);
  const [givenError, setGivenError] = useState("");
  const [receivedError, setReceivedError] = useState("");

  const selectedCompany = useSelector((state: RootState) => state.project.selectedCompany);
  const orgLine = selectedCompany?.name?.toUpperCase() ?? "YOUR ORGANIZATION";

  // Live summary stats from real API data
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

  // Load team members from API
  const loadTeamMembers = async () => {
    setTeamMembersLoading(true);
    try {
      const response = await safeApiRequest<unknown>("get", TEAM_MEMBERS_ENDPOINT, {
        params: { _t: Date.now() },
      });
      // Handles: plain array, { users: [...] }, { fm_users: [...] }, { data: [...] }, etc.
      const users = pickList(response, [
        "users",
        "fm_users",
        "team_members",
        "members",
        "data",
        "results",
      ]);
      const mapped = users
        .map(mapTeamMember)
        .filter((m): m is TeamMemberOption => m !== null);
      setTeamMembers(mapped);
    } catch {
      setTeamMembers([]);
    } finally {
      setTeamMembersLoading(false);
    }
  };

  // Load given or received feedback from API
  const loadFeedback = async (tab: "given" | "received") => {
    const isGiven = tab === "given";
    if (isGiven) { setIsLoadingGiven(true); setGivenError(""); }
    else { setIsLoadingReceived(true); setReceivedError(""); }

    const currentUserId = getCurrentUserIdFromStorage();
    const params: Record<string, string | number> = { _t: Date.now() };
    if (currentUserId) {
      if (isGiven) params.rating_from_id = currentUserId;
      else params.resource_id = currentUserId;
    }

    let succeeded = false;
    let latestError: Error | null = null;

    for (const endpoint of FEEDBACKS_ENDPOINTS) {
      try {
        const response = await safeApiRequest<unknown>("get", endpoint, {
          params,
          headers: { "Cache-Control": "no-cache", Pragma: "no-cache" },
        });

        const mapped = extractFeedbackCollection(response)
          .map(mapFeedbackItem)
          .filter((item) => {
            if (!currentUserId) return true;
            return isGiven
              ? item.ratingFromId === currentUserId
              : item.resourceId === currentUserId;
          })
          .sort((a, b) => {
            const at = new Date(a.createdAt || 0).getTime();
            const bt = new Date(b.createdAt || 0).getTime();
            return bt - at;
          });

        if (isGiven) setGivenFeedback(mapped);
        else setReceivedFeedback(mapped);

        succeeded = true;
        break;
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Unable to fetch feedback.";
        latestError = new Error(msg);
      }
    }

    if (!succeeded) {
      if (isGiven) { setGivenFeedback([]); setGivenError("Unable to load feedback. Please check your connection and try again."); }
      else { setReceivedFeedback([]); setReceivedError("Unable to load feedback. Please check your connection and try again."); }
      console.warn("Feedback fetch failed:", latestError?.message);
    }

    if (isGiven) setIsLoadingGiven(false);
    else setIsLoadingReceived(false);
  };

  // On mount: fetch team members + received feedback (default tab)
  useEffect(() => {
    loadTeamMembers();
    setHasLoadedReceived(true);
    loadFeedback("received");
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Lazy-load given feedback when that tab is first visited
  useEffect(() => {
    if (feedbackTab === "given" && !hasLoadedGiven) {
      setHasLoadedGiven(true);
      loadFeedback("given");
    }
  }, [feedbackTab]); // eslint-disable-line react-hooks/exhaustive-deps

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
            <TabsList
              className={cn(
                "h-auto w-full justify-start gap-1 rounded-none border-b border-[#DA7756]/20",
                "bg-[#DA7756]/10 p-2"
              )}
            >
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
              <GivenFeedbackList
                onGiveFeedbackClick={() => { setEditingFeedback(null); setFeedbackTab("give"); }}
                items={receivedFeedback}
                isLoading={isLoadingReceived}
                loadError={receivedError}
                onRetry={() => loadFeedback("received")}
                onEditFeedback={(item) => { setEditingFeedback(item); setFeedbackTab("give"); }}
                direction="from"
              />
            </TabsContent>

            <TabsContent value="given" className="m-0 focus-visible:outline-none">
              <GivenFeedbackList
                onGiveFeedbackClick={() => { setEditingFeedback(null); setFeedbackTab("give"); }}
                items={givenFeedback}
                isLoading={isLoadingGiven}
                loadError={givenError}
                onRetry={() => loadFeedback("given")}
                onEditFeedback={(item) => { setEditingFeedback(item); setFeedbackTab("give"); }}
                direction="to"
              />
            </TabsContent>

            <TabsContent value="give" className="m-0 focus-visible:outline-none">
              <GiveFeedbackForm
                teamMembers={teamMembers}
                teamMembersLoading={teamMembersLoading}
                initialFeedback={editingFeedback}
                onCancelEdit={() => { setEditingFeedback(null); setFeedbackTab("given"); }}
                onSubmitted={() => {
                  setEditingFeedback(null);
                  setHasLoadedGiven(true);
                  loadFeedback("given");
                  setFeedbackTab("given");
                }}
              />
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </div>
  );
};

export default Feedback;