import React, { useState, useEffect, useMemo } from "react";
import { createPortal } from "react-dom";
import {
  Calendar,
  FileText,
  NotepadText,
  ChevronDown,
  AlertTriangle,
  RefreshCw,
  X,
  Plus,
  MessageSquare,
  ChevronLeft,
  ChevronRight,
  Crown,
  Loader2,
  Users,
  Trophy,
  CheckCircle2,
  Circle,
  Star,
  Eye,
  Clock,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ActiveTimer } from "@/pages/ProjectTaskDetails";
import { getAuthHeaders, getBaseUrl } from "./Shared";
import ProjectTaskCreateModal from "../../../components/ProjectTaskCreateModal";
import AddIssueModal from "../../../components/AddIssueModal";
import AddToDoModal from "../../../components/AddToDoModal";
import TodoDetailsModal from "@/components/TodoDetailsModal";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

// ── UI Components ──
const BtnIcon = ({
  onClick,
  children,
  className = "",
  title = "",
  disabled = false,
}: any) => (
  <button
    disabled={disabled}
    onClick={onClick}
    title={title}
    className={cn(
      "inline-flex items-center justify-center w-8 h-8 rounded-xl bg-white border border-[#CE7A5A]/40 text-neutral-500 shadow-sm transition-all",
      disabled
        ? "opacity-50 cursor-not-allowed"
        : "hover:bg-[#fef6f4] hover:text-[#DA7756] active:scale-95",
      className
    )}
  >
    {children}
  </button>
);

const BtnPrimary = ({
  children,
  onClick,
  className = "",
  icon: Icon,
  disabled = false,
  loading = false,
}: any) => (
  <button
    disabled={disabled}
    onClick={onClick}
    className={cn(
      "inline-flex items-center justify-center gap-2 px-6 py-2 rounded-2xl text-sm font-bold bg-[#CE7A5A] text-white shadow-sm hover:bg-[#BC6B4A] active:scale-97 transition-all disabled:opacity-60 disabled:cursor-not-allowed",
      className
    )}
  >
    {Icon && <Icon className={cn("w-4 h-4", loading && "animate-spin")} />}{" "}
    {children}
  </button>
);

// ── Custom Searchable Select ──
const SearchableSelect = ({
  value,
  onChange,
  options,
  placeholder = "All",
}: any) => {
  const [open, setOpen] = React.useState(false);
  const [search, setSearch] = React.useState("");
  const ref = React.useRef<HTMLDivElement>(null);
  const menuRef = React.useRef<HTMLDivElement>(null);
  // Menu is portalled to <body> so no ancestor with overflow can clip it.
  const [menuRect, setMenuRect] = React.useState<{
    top: number;
    left: number;
    width: number;
  } | null>(null);

  const selected = options.find((o: any) => String(o.value) === String(value));
  const displayValue = selected?.label || placeholder;

  const updateMenuPosition = React.useCallback(() => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    setMenuRect({ top: rect.bottom + 4, left: rect.left, width: rect.width });
  }, []);

  React.useEffect(() => {
    const handler = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        ref.current &&
        !ref.current.contains(target) &&
        (!menuRef.current || !menuRef.current.contains(target))
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  React.useEffect(() => {
    if (!open) return;
    updateMenuPosition();
    window.addEventListener("scroll", updateMenuPosition, true);
    window.addEventListener("resize", updateMenuPosition);
    return () => {
      window.removeEventListener("scroll", updateMenuPosition, true);
      window.removeEventListener("resize", updateMenuPosition);
    };
  }, [open, updateMenuPosition]);

  // Keep the menu mounted for the exit animation after `open` flips to false
  const [isMenuMounted, setIsMenuMounted] = React.useState(false);
  React.useEffect(() => {
    if (open) {
      setIsMenuMounted(true);
      return;
    }
    if (!isMenuMounted) return;
    const timer = window.setTimeout(() => setIsMenuMounted(false), 120);
    return () => window.clearTimeout(timer);
  }, [open, isMenuMounted]);

  const filteredOptions = options.filter((o: any) =>
    (o.label || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div
      ref={ref}
      className="relative w-full sm:w-auto"
      style={{ fontFamily: "'Poppins', sans-serif" }}
    >
      <div className="relative flex items-center min-w-0 sm:min-w-[160px]">
        <input
          type="text"
          className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 pr-8 text-sm font-medium text-neutral-700 shadow-sm focus:outline-none focus:border-[#CE7A5A]/60 hover:border-[#CE7A5A]/60 transition-all cursor-pointer placeholder:text-neutral-700"
          placeholder={placeholder}
          value={open ? search : displayValue}
          onClick={() => {
            setOpen(true);
            setSearch("");
          }}
          onChange={(e) => {
            setSearch(e.target.value);
            setOpen(true);
          }}
        />
        <ChevronDown
          className={cn(
            "absolute right-3 w-4 h-4 text-neutral-400 transition-transform pointer-events-none",
            open && "rotate-180"
          )}
        />
      </div>
      {isMenuMounted &&
        menuRect &&
        createPortal(
          <div
            ref={menuRef}
            className={cn(
              "bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden",
              open ? "dd-menu-enter" : "dd-menu-exit"
            )}
            style={{
              position: "fixed",
              top: menuRect.top,
              left: menuRect.left,
              minWidth: Math.max(menuRect.width, 200),
              maxWidth: 320,
              maxHeight: 220,
              overflowY: "auto",
              zIndex: 9999,
              fontFamily: "'Poppins', sans-serif",
            }}
          >
            {filteredOptions.length === 0 ? (
              <div className="px-4 py-2.5 text-sm font-medium text-neutral-500 text-center">
                No results found
              </div>
            ) : (
              filteredOptions.map((opt: any) => (
                <button
                  key={opt.value}
                  type="button"
                  title={opt.label}
                  onClick={() => {
                    onChange(opt.value);
                    setOpen(false);
                    setSearch("");
                  }}
                  className={cn(
                    "dd-option w-full text-left px-4 py-2.5 text-sm font-medium leading-snug break-words",
                    String(value) === String(opt.value)
                      ? "bg-[#FFF3EE] text-[#CE7A5A] font-semibold"
                      : "text-neutral-700 hover:bg-[#FFF3EE] hover:text-[#CE7A5A]"
                  )}
                >
                  {opt.label}
                </button>
              ))
            )}
          </div>,
          document.body
        )}
    </div>
  );
};

// ── API Fetchers ──
const fetchDynamicMeetings = async () => {
  const res = await fetch(`${getBaseUrl()}/daily_meeting_configs`, {
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const json = await res.json();
  const list = Array.isArray(json)
    ? json
    : json.data?.daily_meeting_configs || json.data || [];
  return list.map((m: any) => ({
    id: String(m.id),
    name: m.name || `Meeting ${m.id}`,
    is_default: m.is_default || m.isDefault || false,
  }));
};

const fetchDynamicMembers = async () => {
  const orgId = localStorage.getItem("org_id") || "";
  const res = await fetch(
    `${getBaseUrl()}/api/users?organization_id=${orgId}`,
    { headers: getAuthHeaders() }
  );
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const json = await res.json();
  const list = Array.isArray(json) ? json : json.data || json.users || [];
  return list.map((u: any) => ({
    id: String(u.id),
    name:
      u.full_name ||
      [u.firstname, u.lastname].filter(Boolean).join(" ") ||
      `User ${u.id}`,
  }));
};

const getMemberResponsiblePrefill = (member: any) => {
  const id =
    member?.user_id ||
    member?.id ||
    member?.user?.id ||
    member?.daily_report?.user_id ||
    member?.daily_report?.user?.id ||
    "";
  const name =
    member?.name ||
    member?.full_name ||
    member?.user?.full_name ||
    member?.user?.name ||
    [member?.firstname, member?.lastname].filter(Boolean).join(" ") ||
    `User ${id}`;

  return id ? { id: String(id), name } : null;
};

const fetchDailyMeetingData = async ({
  meetingId,
  dateStr,
}: {
  meetingId: string;
  dateStr: string;
}) => {
  const url = new URL(`${getBaseUrl()}/user_journals/daily_meeting`);
  url.searchParams.append("date", dateStr);
  if (meetingId && meetingId !== "all")
    url.searchParams.append("meeting_id", meetingId);
  const res = await fetch(url.toString(), {
    method: "GET",
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return await res.json();
};

// ── Helpers ──
const formatDateTime = (isoStr: string | null) => {
  if (!isoStr) return null;
  try {
    return new Date(isoStr).toLocaleString("en-IN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });
  } catch {
    return null;
  }
};

const pushUnique = (arr: any[], item: any, keyFields: string[]) => {
  const exists = arr.some((x) => keyFields.every((k) => x[k] === item[k]));
  if (!exists) arr.push(item);
};

// ── Normalize report_data ──
const normalizeReportData = (rd: any) => {
  if (!rd || typeof rd !== "object") {
    return {
      accomplishments: [],
      tasks_issues: [],
      tomorrow_plan: [],
      big_win: null,
      self_rating: null,
      total_score: null,
      is_absent: null,
      absent_reason: null,
      kpis: {},
    };
  }

  let accomplishments: any[] = [];
  if (Array.isArray(rd.accomplishments)) {
    accomplishments = rd.accomplishments;
  } else if (Array.isArray(rd.accomplishments?.items)) {
    accomplishments = rd.accomplishments.items;
  }

  return {
    accomplishments,
    tasks_issues: Array.isArray(rd.tasks_issues) ? rd.tasks_issues : [],
    tomorrow_plan: Array.isArray(rd.tomorrow_plan) ? rd.tomorrow_plan : [],
    big_win: rd.big_win ?? null,
    self_rating: rd.self_rating ?? null,
    total_score: rd.total_score ?? null,
    is_absent: rd.is_absent ?? null,
    absent_reason: rd.absent_reason ?? null,
    kpis: rd.kpis && typeof rd.kpis === "object" ? rd.kpis : {},
  };
};

const isAdminAddedMissedPlanReport = (report: any) => {
  const draft = report?.daily_report;
  if (!draft || report?.checked_in_meeting === true || report?.journal_id)
    return false;

  const normalized = normalizeReportData(draft.report_data);
  const hasTomorrowPlan = normalized.tomorrow_plan.length > 0;
  const hasSubmittedContent =
    normalized.accomplishments.length > 0 ||
    normalized.tasks_issues.length > 0 ||
    !!normalized.big_win ||
    normalized.self_rating !== null ||
    normalized.total_score !== null ||
    Object.keys(normalized.kpis || {}).length > 0;

  return (
    hasTomorrowPlan &&
    !hasSubmittedContent &&
    String(draft.status || "").toLowerCase() !== "submitted"
  );
};

const fmtItemDate = (d?: string): string | null => {
  if (!d) return null;
  const dt = new Date(d);
  if (isNaN(dt.getTime())) return null;
  return `${String(dt.getDate()).padStart(2, "0")}/${String(
    dt.getMonth() + 1
  ).padStart(2, "0")}/${dt.getFullYear()}`;
};

const fmtItemHours = (h?: number): string | null => {
  if (!h) return null;
  if (h < 1) return `${Math.round(h * 60)}m`;
  const wh = Math.floor(h);
  const m = Math.round((h - wh) * 60);
  return m > 0 ? `${wh}h ${m}m` : `${wh}h`;
};

const getItemOverdueLabel = (targetDate?: string): string | null => {
  if (!targetDate) return null;
  const end = new Date(targetDate);
  if (isNaN(end.getTime())) return null;
  end.setHours(23, 59, 59, 999);
  const diff = end.getTime() - new Date().getTime();
  if (diff > 0) return null;
  const abs = Math.abs(diff);
  const d = Math.floor(abs / 86400000);
  const h = Math.floor((abs % 86400000) / 3600000);
  const m = Math.floor((abs % 3600000) / 60000);
  if (d > 0) return `${d}d ${h}h overdue`;
  if (h > 0) return `${h}h ${m}m overdue`;
  return `${m}m overdue`;
};

// Cache for item details fetched on-demand by source_id (keyed by `${type}:${id}`)
const itemDetailCache: Record<string, any> = {};
const itemDetailInflight: Record<string, Promise<any> | undefined> = {};

const fetchItemDetail = async (
  type: string,
  id: any
): Promise<any | null> => {
  if (!type || id === undefined || id === null) return null;
  const key = `${type}:${id}`;
  if (key in itemDetailCache) return itemDetailCache[key];
  if (itemDetailInflight[key]) return itemDetailInflight[key];

  let url: string | null = null;
  if (type === "task") url = `${getBaseUrl()}/task_managements/${id}.json`;
  else if (type === "todo") url = `${getBaseUrl()}/todos/${id}.json`;
  else if (type === "issue") url = `${getBaseUrl()}/issues/${id}.json`;
  if (!url) return null;

  const p = (async () => {
    try {
      const res = await fetch(url as string, { headers: getAuthHeaders() });
      if (!res.ok) {
        itemDetailCache[key] = null;
        return null;
      }
      const json = await res.json();
      const data =
        json?.task ||
        json?.todo ||
        json?.issue ||
        json?.data?.task ||
        json?.data?.todo ||
        json?.data?.issue ||
        json?.data ||
        json;
      itemDetailCache[key] = data || null;
      return itemDetailCache[key];
    } catch {
      itemDetailCache[key] = null;
      return null;
    } finally {
      itemDetailInflight[key] = undefined;
    }
  })();
  itemDetailInflight[key] = p;
  return p;
};

// Render target date + overdue + estimated effort + effective (active) time for a report item
export const ReportItemMeta = ({ item }: { item: any }) => {
  const sourceType = (
    item?.source_type ||
    item?.sourceType ||
    item?.type ||
    ""
  ).toLowerCase();
  const sourceId = item?.source_id ?? item?.sourceId ?? item?.id;
  const [fetched, setFetched] = useState<any>(null);

  // When the item lacks embedded details, fetch them by source_id
  useEffect(() => {
    let active = true;
    if (
      !item?.originalData &&
      sourceId &&
      ["task", "todo", "issue"].includes(sourceType)
    ) {
      fetchItemDetail(sourceType, sourceId).then((data) => {
        if (active && data) setFetched(data);
      });
    }
    return () => {
      active = false;
    };
  }, [item?.originalData, sourceId, sourceType]);

  const d = item?.originalData || fetched;
  const status = (item?.status || d?.status || "").toLowerCase();
  const isDone = ["completed", "closed", "done"].includes(status);
  const targetRaw =
    d?.target_date || d?.due_date || d?.end_date || item?.target_date;
  const dueDate = fmtItemDate(targetRaw);
  const overdueLabel = isDone ? null : getItemOverdueLabel(targetRaw);
  const effortEst = fmtItemHours(d?.total_allocated_hours || d?.estimated_hour);
  const hasActiveTime = sourceType === "task" && d?.active_time_till_now;

  if (!dueDate && !overdueLabel && !effortEst && !hasActiveTime) return null;

  return (
    <div className="flex items-center gap-3 px-3 pb-2 -mt-1 flex-wrap">
      {dueDate && (
        <span className="flex items-center gap-1 text-[10px] text-gray-500">
          <Calendar className="w-3 h-3 shrink-0" />
          {dueDate}
        </span>
      )}
      {overdueLabel && (
        <span className="flex items-center gap-1 text-[10px] font-semibold text-red-600">
          <AlertTriangle className="w-3 h-3 shrink-0" />
          {overdueLabel}
        </span>
      )}
      {effortEst && (
        <span className="flex items-center gap-1 text-[10px] text-gray-500">
          <Clock className="w-3 h-3 shrink-0" />
          Est: {effortEst}
        </span>
      )}
      {hasActiveTime && (
        <span className="flex items-center gap-1 text-[10px] text-green-600">
          <Zap className="w-3 h-3 shrink-0" />
          <ActiveTimer
            activeTimeTillNow={d.active_time_till_now}
            isStarted={d.is_started}
          />
        </span>
      )}
    </div>
  );
};

const getItemTitle = (item: any): string => {
  if (!item) return "";
  if (typeof item === "string") return item;
  if (typeof item === "object")
    return String(item.title || item.name || item.text || "");
  return String(item);
};

const getItemStatus = (item: any): string => {
  if (!item || typeof item !== "object") return "open";
  return item.status || "open";
};

const isCompletedStatus = (status: string) =>
  ["closed", "completed", "done"].includes(status.toLowerCase());

const getCalendarDisplayStatus = (status: any) => {
  const normalizedStatus = String(status || "").toLowerCase();
  if (normalizedStatus === "draft") {
    return "submitted";
  }
  if (["holiday", "non_meeting"].includes(normalizedStatus)) {
    return "holiday";
  }
  return normalizedStatus;
};

const getMemberId = (member: any) =>
  member?.user_id ?? member?.id ?? member?.user?.id ?? null;

const getMemberFilterKey = (name: any) =>
  String(name || "").trim().toLowerCase();

const getMemberCalendar = (member: any) => {
  const calendar = member?.daily_calendar || member?.daily_calender;
  return Array.isArray(calendar) ? calendar : [];
};

const mergeCalendarWithFallback = (
  memberCalendar: any[],
  fallbackRow: any[] = []
) => {
  const fallbackByDate = new Map(
    fallbackRow.map((item: any) => [item.full_date, item])
  );

  return memberCalendar.map((item: any) => {
    const fallback = fallbackByDate.get(item.full_date) || {};
    return {
      ...fallback,
      ...item,
      is_meeting: item.is_meeting ?? fallback.is_meeting ?? true,
    };
  });
};

const getSelectedMemberCalendarRow = (
  data: any,
  memberId: string,
  fallbackRow: any[] = []
) => {
  if (!data || memberId === "all") return [];

  const targetId = String(memberId);
  const pools = [
    ...(data.member_reports || []),
    ...(data.reports || []),
    ...(data.missed_members || []),
  ];
  const member = pools.find(
    (item: any) => String(getMemberId(item)) === targetId
  );
  const memberCalendar = getMemberCalendar(member);

  if (!memberCalendar.length) return [];

  return mergeCalendarWithFallback(memberCalendar, fallbackRow);
};

const getItemType = (item: any): string => {
  if (!item || typeof item !== "object") return "note";
  return String(item.type || "note").toLowerCase();
};

const getViewSourceType = (item: any): string => {
  const rawType = String(
    item?.source_type ||
      item?.sourceType ||
      item?.originalData?.source_type ||
      item?.originalData?.sourceType ||
      item?.type ||
      ""
  ).toLowerCase();

  const rawId = String(item?.id || item?.source_id || "").toLowerCase();

  if (rawType.includes("issue") || rawId.startsWith("issue-")) return "issue";
  if (rawType.includes("todo") || rawType.includes("to_do") || rawId.startsWith("todo-")) return "todo";
  if (rawType.includes("task") || rawId.startsWith("task-")) return "task";

  return getItemType(item);
};

const getItemTagNames = (item: any): string[] => {
  const rawTags =
    item?.tags ||
    item?.tag_names ||
    item?.project_tags ||
    item?.task_tags ||
    item?.originalData?.tags ||
    item?.originalData?.tag_names ||
    item?.originalData?.project_tags ||
    item?.originalData?.task_tags;
  const singleTags = [
    item?.tag,
    item?.tag_name,
    item?.project_tag,
    item?.originalData?.tag,
    item?.originalData?.tag_name,
    item?.originalData?.project_tag,
  ];

  const normalizeTag = (tag: any) => {
    if (!tag) return "";
    if (typeof tag === "string") return tag;
    return tag.name || tag.title || tag.label || "";
  };

  const arrayTags = Array.isArray(rawTags) ? rawTags : [];
  return [...arrayTags, ...singleTags]
    .map(normalizeTag)
    .map((tag) => String(tag).trim())
    .filter(Boolean);
};

const getItemProjectName = (item: any): string => {
  const project =
    item?.project_management_title ||
    item?.project_title ||
    item?.project_name ||
    item?.project?.name ||
    item?.project?.title ||
    item?.project_management?.name ||
    item?.project_management?.title ||
    item?.originalData?.project_management_title ||
    item?.originalData?.project_title ||
    item?.originalData?.project_name ||
    item?.originalData?.project?.name ||
    item?.originalData?.project?.title ||
    item?.originalData?.project_management?.name ||
    item?.originalData?.project_management?.title ||
    "";
  return String(project).trim();
};

const getViewSourceId = (item: any): any => {
  const rawId =
    item?.source_id ??
    item?.sourceId ??
    item?.task_id ??
    item?.taskId ??
    item?.issue_id ??
    item?.issueId ??
    item?.todo_id ??
    item?.todoId ??
    item?.originalData?.source_id ??
    item?.originalData?.sourceId ??
    item?.originalData?.id ??
    item?.originalData?.task_id ??
    item?.originalData?.taskId ??
    item?.originalData?.issue_id ??
    item?.originalData?.issueId ??
    item?.originalData?.todo_id ??
    item?.originalData?.todoId ??
    item?.id;

  if (rawId === null || rawId === undefined || rawId === "") return null;

  const cleaned = String(rawId).replace(/^(task|issue|todo)-/i, "");
  return cleaned || rawId;
};

const getPayloadSourceType = (item: any): any => {
  const rawType = String(
    item?.source_type ||
    item?.sourceType ||
    item?.originalData?.source_type ||
    item?.originalData?.sourceType ||
    item?.type ||
    ""
  ).toLowerCase();
  const rawId = String(item?.id || item?.source_id || "").toLowerCase();

  if (rawType.includes("issue") || rawId.startsWith("issue-")) return "issue";
  if (rawType.includes("todo") || rawType.includes("to_do") || rawId.startsWith("todo-")) return "todo";
  if (rawType.includes("task") || rawId.startsWith("task-")) return "task";

  return "note";
};

// ── Tasks / Issues / To-Do column with a 7 / 14 / 30 day range filter ──
const TASK_RANGE_OPTIONS = [
  { value: 7, label: "7 Days" },
  { value: 14, label: "14 Days" },
  { value: 30, label: "30 Days" },
];

const parseDateValue = (value: any): Date | null => {
  if (!value) return null;
  const dt = new Date(value);
  return isNaN(dt.getTime()) ? null : dt;
};

// Date used to decide if an item falls inside the selected range:
// created_at first (when the task/issue/todo was raised), target date as fallback.
const getItemRangeDate = (item: any, detail?: any): Date | null => {
  const d = item?.originalData || detail || {};
  return (
    parseDateValue(item?.created_at) ||
    parseDateValue(d?.created_at) ||
    parseDateValue(item?.target_date) ||
    parseDateValue(d?.target_date) ||
    parseDateValue(d?.updated_at)
  );
};

// Target/due date of an item (from the row itself or the fetched detail).
const getItemTargetDateValue = (item: any, detail?: any): Date | null => {
  const d = item?.originalData || detail || {};
  return (
    parseDateValue(item?.target_date) ||
    parseDateValue(item?.due_date) ||
    parseDateValue(d?.target_date) ||
    parseDateValue(d?.due_date) ||
    parseDateValue(d?.end_date)
  );
};

// Overdue = explicit overdue status, or a past target date on a not-done item.
const isItemOverdue = (item: any, detail?: any): boolean => {
  const status = String(getItemStatus(item)).toLowerCase();
  if (isCompletedStatus(status)) return false;
  if (status === "overdue" || status === "overdued") return true;
  const target = getItemTargetDateValue(item, detail);
  if (!target) return false;
  target.setHours(23, 59, 59, 999);
  return target.getTime() < Date.now();
};

const TASK_STATUS_BUCKETS = [
  {
    key: "overdue",
    label: "Overdue",
    statuses: ["overdue", "overdued"],
    colorClass: "text-red-700",
    headerBg: "bg-red-50",
    pillBg: "bg-red-100 text-red-700",
  },
  {
    key: "in_progress",
    label: "In Progress",
    statuses: ["in_progress", "in progress", "started", "wip"],
    colorClass: "text-sky-700",
    headerBg: "bg-sky-50",
    pillBg: "bg-sky-100 text-sky-700",
  },
  {
    key: "open",
    label: "Open",
    statuses: ["open", "pending", "reopen", "reopened", "new", "to_do", "todo"],
    colorClass: "text-slate-600",
    headerBg: "bg-slate-50",
    pillBg: "bg-slate-100 text-slate-600",
  },
  {
    key: "on_hold",
    label: "On Hold",
    statuses: ["on_hold", "hold"],
    colorClass: "text-orange-700",
    headerBg: "bg-orange-50",
    pillBg: "bg-orange-100 text-orange-700",
  },
];

// Start of the window: today - (days - 1), i.e. last N days including today.
const getRangeStartDate = (days: number) => {
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  start.setDate(start.getDate() - (days - 1));
  return start;
};

const TasksIssuesTodoCard = ({
  items,
  showMemberBadges,
  renderRows,
  isAbsent = false,
}: {
  items: any[];
  showMemberBadges: boolean;
  renderRows: (
    rows: any[],
    showMemberBadges: boolean,
    emptyText?: string
  ) => React.ReactNode;
  isAbsent?: boolean;
}) => {
  const [rangeDays, setRangeDays] = useState(7);
  const [details, setDetails] = useState<Record<string, any>>({});

  const sourceItems = isAbsent ? [] : items;

  // tasks_issues rows from the daily_meeting API carry no dates, so pull
  // created_at / target_date on demand (cached in itemDetailCache).
  useEffect(() => {
    let active = true;
    const pending = sourceItems
      .map((item) => {
        const type = getViewSourceType(item);
        const id = getViewSourceId(item);
        return { item, type, id, key: `${type}:${id}` };
      })
      .filter(
        ({ item, type, id, key }) =>
          !item?.originalData &&
          !item?.created_at &&
          !(key in details) &&
          !!id &&
          ["task", "issue", "todo"].includes(type)
      );
    if (!pending.length) return;

    Promise.all(
      pending.map(async ({ type, id, key }) => {
        const data = await fetchItemDetail(type, id);
        return data ? ([key, data] as [string, any]) : null;
      })
    ).then((entries) => {
      if (!active) return;
      const resolved = entries.filter(Boolean) as [string, any][];
      if (!resolved.length) return;
      setDetails((prev) => {
        const missing = resolved.filter(([key]) => !(key in prev));
        if (!missing.length) return prev;
        const merged = { ...prev };
        missing.forEach(([key, value]) => {
          merged[key] = value;
        });
        return merged;
      });
    });

    return () => {
      active = false;
    };
  }, [sourceItems, details]);

  const filteredItems = useMemo(() => {
    const start = getRangeStartDate(rangeDays);
    return sourceItems.filter((item) => {
      const detail = details[`${getViewSourceType(item)}:${getViewSourceId(item)}`];
      const date = getItemRangeDate(item, detail);
      // No date available for this item — keep it visible instead of dropping it.
      if (!date) return true;
      return date.getTime() >= start.getTime();
    });
  }, [sourceItems, details, rangeDays]);

  // Bifurcate into Overdue / In Progress / Open / On Hold buckets.
  const bucketedItems = useMemo(() => {
    const groups: Record<string, any[]> = {};
    TASK_STATUS_BUCKETS.forEach((bucket) => {
      groups[bucket.key] = [];
    });

    filteredItems.forEach((item) => {
      const detail =
        details[`${getViewSourceType(item)}:${getViewSourceId(item)}`];
      if (isItemOverdue(item, detail)) {
        groups.overdue.push(item);
        return;
      }
      const status = String(getItemStatus(item)).toLowerCase();
      const bucket = TASK_STATUS_BUCKETS.find((b) =>
        b.statuses.includes(status)
      );
      groups[bucket ? bucket.key : "open"].push(item);
    });

    return groups;
  }, [filteredItems, details]);

  return (
    <div className="bg-white border border-[#E8E2DE] rounded-xl p-0 overflow-hidden">
      <div className="flex items-center gap-2 px-3 py-3 border-b border-[#EFE7E2]">
        <NotepadText className="w-4 h-4 shrink-0 text-[#DA7756]" />
        <h4 className="text-[13px] font-extrabold text-[#3E342F] tracking-[0.14em] uppercase min-w-0 truncate">
          Tasks, Issues &amp; To Do ({filteredItems.length})
        </h4>
        <div className="relative ml-auto shrink-0">
          <select
            value={rangeDays}
            onClick={(e) => e.stopPropagation()}
            onChange={(e) => setRangeDays(Number(e.target.value))}
            className="appearance-none cursor-pointer rounded-full border border-[#E8E2DE] bg-white pl-3 pr-7 py-1 text-[11px] font-semibold text-neutral-600 focus:outline-none focus:ring-2 focus:ring-[rgba(218,119,86,0.22)]"
          >
            {TASK_RANGE_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-neutral-400" />
        </div>
      </div>
      <div className="p-4">
        {filteredItems.length === 0 ? (
          renderRows([], showMemberBadges)
        ) : (
          <div className="space-y-3">
            {TASK_STATUS_BUCKETS.map((bucket) => {
              const bucketItems = bucketedItems[bucket.key] || [];
              if (!bucketItems.length) return null;
              return (
                <div key={bucket.key} className="space-y-1.5">
                  <div
                    className={cn(
                      "flex items-center gap-2 px-2 py-1.5 rounded-[6px]",
                      bucket.headerBg
                    )}
                  >
                    <span
                      className={cn(
                        "flex-1 text-[10px] font-black uppercase tracking-wider",
                        bucket.colorClass
                      )}
                    >
                      {bucket.label}
                    </span>
                    <span
                      className={cn(
                        "rounded-full px-1.5 py-0.5 text-[9px] font-bold",
                        bucket.pillBg
                      )}
                    >
                      {bucketItems.length}
                    </span>
                  </div>
                  {renderRows(bucketItems, showMemberBadges)}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

const getApiErrorMessage = (responseData: any, fallback: string) => {
  if (Array.isArray(responseData?.errors) && responseData.errors.length > 0) {
    return responseData.errors.join(", ");
  }
  return responseData?.message || responseData?.error || fallback;
};

const mergeUniqueItems = (primary: any[] = [], fallback: any[] = []) => {
  const merged: any[] = [];
  const seen = new Set<string>();
  [...primary, ...fallback].forEach((item) => {
    const title = getItemTitle(item).trim();
    const key = title.toLowerCase();
    if (!title || seen.has(key)) return;
    seen.add(key);
    merged.push(item);
  });
  return merged;
};

const mergeTasksIssuesPreservingType = (
  primary: any[] = [],
  fallback: any[] = []
) => {
  const merged: any[] = [];
  const seen = new Set<string>();

  [...primary, ...fallback].forEach((item) => {
    const title = getItemTitle(item).trim();
    if (!title) return;

    const type = getItemType(item);
    const hasExplicitType = !!item?.type;
    const typedKey = `${title.toLowerCase()}|${type}`;
    const titleHasTypedItem = merged.some(
      (existing) =>
        getItemTitle(existing).trim().toLowerCase() === title.toLowerCase() &&
        !!existing?.type
    );

    if (!hasExplicitType && titleHasTypedItem) return;
    if (seen.has(typedKey)) return;

    seen.add(typedKey);
    merged.push(item);
  });

  return merged;
};

const getReportTotalScore = (report: any, rawSource: any = null) => {
  const score =
    report?.daily_report?.report_data?.total_score ??
    report?.report_data?.total_score ??
    rawSource?.total_score ??
    report?.score;

  if (score === null || score === undefined || score === "") return null;
  const numericScore = Number(score);
  return Number.isFinite(numericScore) ? numericScore : null;
};

const isReportAbsent = (
  report: any,
  rawSource: any = null,
  normalized: any = null
) =>
  [
    report?.is_absent,
    report?.daily_report?.is_absent,
    rawSource?.is_absent,
    rawSource?.details?.is_absent,
    rawSource?.sections?.is_absent,
    normalized?.is_absent,
  ].some((value) => value === true || value === "true" || value === 1);

const getReportAbsentReason = (
  report: any,
  rawSource: any = null,
  normalized: any = null
) =>
  String(
    report?.absent_reason ??
    report?.daily_report?.absent_reason ??
    rawSource?.absent_reason ??
    rawSource?.details?.absent_reason ??
    rawSource?.sections?.absent_reason ??
    normalized?.absent_reason ??
    "Absent"
  ).trim() || "Absent";

const formatSelfRating = (rating: any): string => {
  if (rating === null || rating === undefined || rating === "") return "";
  const ratingText = String(rating).trim();
  return ratingText.includes("/") ? ratingText : `${ratingText}/10`;
};

// ── Strip missed-members prefix from textarea value before saving ──
const stripMissedMembersPrefix = (text: string): string => {
  const missedHeaderMatch = text.match(
    /^Team Members Who Missed Report \(\d+\):\n(?:- .+\n)*\n?/
  );
  if (missedHeaderMatch) {
    return text.slice(missedHeaderMatch[0].length);
  }
  return text;
};

// ── Resolve the "true" raw source for a report ──
const resolveRawSource = (report: any) => {
  const rd = report.report_data || {};
  const draftReport = report.daily_report || {};
  const draftRaw = draftReport.report_data || {};
  const hasDraft = !!report.daily_report;

  const normalizeDraftRaw = (raw: any) => ({
    ...raw,
    accomplishments:
      raw.accomplishments?.items ||
      (Array.isArray(raw.accomplishments) ? raw.accomplishments : []),
    self_rating:
      raw.self_rating ??
      draftReport.self_rating ??
      raw.details?.self_rating ??
      raw.sections?.self_rating ??
      null,
    total_score: raw.total_score ?? null,
    is_absent:
      raw.is_absent ??
      draftReport.is_absent ??
      raw.details?.is_absent ??
      raw.sections?.is_absent ??
      false,
    absent_reason:
      raw.absent_reason ??
      draftReport.absent_reason ??
      raw.details?.absent_reason ??
      raw.sections?.absent_reason ??
      null,
  });

  if (hasDraft) return normalizeDraftRaw(draftRaw);

  return rd;
};

// -────────────────────────────────────────────
const DailyTab = ({
  onMeetingSaved,
  selectedDate,
  onSelectedDateChange,
  selectedMeetingId: externalSelectedMeetingId,
  onSelectedMeetingChange,
}: {
  onMeetingSaved?: (date: string) => void;
  selectedDate?: string;
  onSelectedDateChange?: (date: string) => void;
  selectedMeetingId?: string;
  onSelectedMeetingChange?: (meetingId: string) => void;
}) => {
  const getLocalDateKey = (date = new Date()) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };
  const [activeDate, setActiveDate] = useState(
    () => selectedDate || getLocalDateKey()
  );
  const [meetingsList, setMeetingsList] = useState<any[]>([]);
  const [meetingsLoaded, setMeetingsLoaded] = useState(false);
  const [selectedMeetingId, setSelectedMeetingIdState] = useState<
    string | null
  >(() => externalSelectedMeetingId || null);
  const [membersList, setMembersList] = useState<any[]>([]);
  const [selectedMember, setSelectedMember] = useState("all");
  const [selectedHod, setSelectedHod] = useState("all");
  const [selectedTag, setSelectedTag] = useState("all");
  const [selectedProject, setSelectedProject] = useState("all");
  const [dailyData, setDailyData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [calendarDateRow, setCalendarDateRow] = useState<any[]>([]);
  const isArrowNav = React.useRef(false);
  const [expandedReports, setExpandedReports] = useState<any[]>([]);
  const [reportMemberFilters, setReportMemberFilters] = useState<Record<string, string>>({});
  const [reportProjectFilters, setReportProjectFilters] = useState<Record<string, string>>({});
  const [selectedReports, setSelectedReports] = useState<any[]>([]);
  const [meetingNotes, setMeetingNotes] = useState("");
  const [savedMeetingNotes, setSavedMeetingNotes] = useState("");
  const [isSavingMeeting, setIsSavingMeeting] = useState(false);
  const [meetingJournalId, setMeetingJournalId] = useState<number | null>(null);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isIssueModalOpen, setIsIssueModalOpen] = useState(false);
  const [isTodoModalOpen, setIsTodoModalOpen] = useState(false);
  const [actionMemberPrefill, setActionMemberPrefill] = useState<any>(null);
  const [quickActionOpenId, setQuickActionOpenId] = useState<any>(null);
  const [quickActionText, setQuickActionText] = useState("");

  // Feedback specific states
  const [feedbackOpenId, setFeedbackOpenId] = useState<any>(null);
  const [feedbackClosingId, setFeedbackClosingId] = useState<any>(null);
  const [feedbackRating, setFeedbackRating] = useState(0);
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [fetchedFeedbacks, setFetchedFeedbacks] = useState<any[]>([]);
  const [isFetchingFeedbacks, setIsFetchingFeedbacks] = useState(false);

  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedTodo, setSelectedTodo] = useState<any>(null);

  const handleViewReportItem = (item: any) => {
    console.log("handleViewReportItem CLICKED, item:", item);
    const computedType = getItemType(item);
    const sourceType = (item.source_type || item.originalData?.source_type || computedType).toLowerCase();
    const sourceId = item.id || item.task_id || item.issue_id || item.source_id || item.originalData?.id || item.originalData?.task_id || item.originalData?.issue_id;
    const originalData = item.originalData || item;

    console.log("handleViewReportItem - computedType:", computedType, "sourceType:", sourceType, "sourceId:", sourceId);

    if (sourceType === "todo") {
      console.log("Opening Todo Details Modal for:", originalData);
      setSelectedTodo(originalData);
      setIsDetailsModalOpen(true);
      return;
    }

    if (!sourceType) return;

    if (sourceType === "task") {
      const navPath = sourceId ? `/vas/tasks/${sourceId}` : '/vas/tasks';
      console.log("Navigating to task path:", navPath);
      navigate(navPath);
    } else if (sourceType === "issue") {
      const navPath = sourceId ? `/vas/issues/${sourceId}` : '/vas/issues';
      console.log("Navigating to issue path:", navPath);
      navigate(navPath);
    }
  };

  const handleViewTaskIssueTodoItem = async (item: any) => {
    const sourceType = getViewSourceType(item);
    const sourceId = getViewSourceId(item);
    const originalData = item?.originalData || item;

    if (sourceType === "todo") {
      const todoId = sourceId;
      setSelectedTodo({ ...originalData, id: todoId ?? originalData?.id });
      setIsDetailsModalOpen(true);

      if (todoId) {
        try {
          const res = await fetch(`${getBaseUrl()}/todos/${todoId}.json`, {
            headers: getAuthHeaders(),
          });
          if (res.ok) {
            const json = await res.json();
            const todoDetails = json?.todo || json?.data?.todo || json?.data || json;
            if (todoDetails) setSelectedTodo(todoDetails);
          }
        } catch (error) {
          console.error("Failed to fetch todo details:", error);
        }
      }
      return;
    }

    if (sourceType === "task") {
      if (!sourceId) {
        toast.error("Task details not found for this item.");
        return;
      }
      navigate(`/vas/tasks/${sourceId}`);
      return;
    }

    if (sourceType === "issue") {
      if (!sourceId) {
        toast.error("Issue details not found for this item.");
        return;
      }
      navigate(`/vas/issues/${sourceId}`);
    }
  };

  useEffect(() => {
    if (!selectedDate) return;
    setActiveDate((currentDate) =>
      currentDate === selectedDate ? currentDate : selectedDate
    );
  }, [selectedDate]);

  useEffect(() => {
    onSelectedDateChange?.(activeDate);
  }, [activeDate, onSelectedDateChange]);

  useEffect(() => {
    if (!externalSelectedMeetingId) return;
    setSelectedMeetingIdState((current) =>
      current === externalSelectedMeetingId
        ? current
        : externalSelectedMeetingId
    );
  }, [externalSelectedMeetingId]);

  const setSelectedMeetingId = (meetingId: string | null) => {
    setSelectedMeetingIdState(meetingId);
    if (meetingId) onSelectedMeetingChange?.(String(meetingId));
  };

  const navigate = useNavigate();

  const openTaskModalForMember = (member: any) => {
    const responsiblePerson = getMemberResponsiblePrefill(member);
    if (!responsiblePerson) {
      toast.error("User ID not found for this member.");
      return;
    }
    setActionMemberPrefill({ responsible_person: responsiblePerson });
    setIsTaskModalOpen(true);
  };

  const openIssueModalForMember = (member: any) => {
    const responsiblePerson = getMemberResponsiblePrefill(member);
    if (!responsiblePerson) {
      toast.error("User ID not found for this member.");
      return;
    }
    setActionMemberPrefill({ responsible_person: responsiblePerson });
    setIsIssueModalOpen(true);
  };

  const openTodoModalForMember = (member: any) => {
    const responsiblePerson = getMemberResponsiblePrefill(member);
    if (!responsiblePerson) {
      toast.error("User ID not found for this member.");
      return;
    }
    setActionMemberPrefill({ responsible_person: responsiblePerson });
    setIsTodoModalOpen(true);
  };

  const closeTaskModal = () => {
    setIsTaskModalOpen(false);
    setActionMemberPrefill(null);
  };

  const closeIssueModal = () => {
    setIsIssueModalOpen(false);
    setActionMemberPrefill(null);
  };

  const closeTodoModal = () => {
    setIsTodoModalOpen(false);
    setActionMemberPrefill(null);
  };

  // ── Auto-populate checked in reports into selectedReports ──
  useEffect(() => {
    if (dailyData) {
      const reports = dailyData.member_reports || dailyData.reports || [];
      const checkedInIds = reports
        .filter((r: any) => r.checked_in_meeting === true)
        .map((r: any) => r.journal_id || r.user_id);

      setSelectedReports((prev) => {
        const combined = new Set([...prev, ...checkedInIds]);
        return Array.from(combined);
      });
    }
  }, [dailyData]);

  // ── Load Dropdowns ──
  useEffect(() => {
    fetchDynamicMeetings()
      .then((list) => {
        setMeetingsList(list);
        setMeetingsLoaded(true);
        if (list?.length > 0) {
          const defaultMeeting = list.find((m) => m.is_default);
          if (externalSelectedMeetingId) {
            setSelectedMeetingId(externalSelectedMeetingId);
          } else if (defaultMeeting) {
            setSelectedMeetingId(defaultMeeting.id);
          } else {
            setSelectedMeetingId(list[0].id);
          }
        } else {
          setSelectedMeetingId(null);
        }
      })
      .catch((err) => {
        console.error(err);
        setSelectedMeetingId(null);
        setMeetingsLoaded(true);
      });
    fetchDynamicMembers().then(setMembersList).catch(console.error);
  }, []);

  const loadDailyData = async (skipNotesRestore = false) => {
    if (selectedMeetingId === null) return;
    setIsLoading(true);
    setApiError(null);
    try {
      const json = await fetchDailyMeetingData({
        meetingId: selectedMeetingId,
        dateStr: activeDate,
      });

      if (json.success || json.data) {
        setDailyData(json.data);

        if (isArrowNav.current || calendarDateRow.length === 0) {
          setCalendarDateRow(json.data?.date_row || []);
        } else {
          const freshDateRow = json.data?.date_row || [];
          setCalendarDateRow((prev) =>
            prev.map((d) => {
              const freshData = freshDateRow.find(
                (fd: any) => fd.full_date === d.full_date
              );
              return freshData ? { ...d, status: freshData.status } : d;
            })
          );
        }
        isArrowNav.current = false;

        const reports: any[] =
          json.data?.member_reports || json.data?.reports || [];
        const headId = json.data?.config?.meeting_head?.id;

        const meetingJournalReport =
          reports.find(
            (r: any) =>
              r.user_id === headId &&
              r.status === "submitted" &&
              r.journal_id &&
              r.report_data?.meeting_notes
          ) ||
          reports.find(
            (r: any) =>
              r.status === "submitted" &&
              r.report_data?.meeting_notes &&
              r.journal_id
          ) ||
          reports.find((r: any) => r.status === "submitted" && r.journal_id) ||
          null;

        setMeetingJournalId(
          json.data?.meeting_journal_id ||
          meetingJournalReport?.journal_id ||
          null
        );

        if (!skipNotesRestore) {
          const DEFAULT_DISCUSSION = "Key Discussion Points:\n";

          if (meetingJournalReport) {
            let savedDiscussion = DEFAULT_DISCUSSION;

            const notesData =
              json.data?.report_data?.meeting_notes ||
              meetingJournalReport?.report_data?.meeting_notes;
            if (notesData) {
              if (Array.isArray(notesData)) {
                savedDiscussion =
                  notesData[0]?.key_discussion_points || DEFAULT_DISCUSSION;
              } else if (typeof notesData === "object") {
                savedDiscussion =
                  notesData.key_discussion_points || DEFAULT_DISCUSSION;
              }
            }

            setMeetingNotes(savedDiscussion);
            setSavedMeetingNotes(savedDiscussion);
          } else {
            const allReports: any[] =
              json.data?.member_reports || json.data?.reports || [];
            const absentSubmittedIds = new Set(
              allReports
                .filter((r: any) => isReportAbsent(r, resolveRawSource(r)))
                .map((r: any) => String(r.user_id))
            );
            const pureMissed = [
              ...allReports
                .filter(
                  (r: any) =>
                    (r.status === "pending" && !r.daily_report) ||
                    isAdminAddedMissedPlanReport(r)
                )
                .map((r: any) => r.name),
              ...(json.data?.missed_members || [])
                .filter(
                  (m: any) => !absentSubmittedIds.has(String(m.id || m.user_id))
                )
                .map((m: any) => m.name || m.user),
            ].filter(Boolean);
            const uniqueMissed = [...new Set(pureMissed)] as string[];

            let prefill = "";
            if (uniqueMissed.length > 0) {
              prefill =
                `Team Members Who Missed Report (${uniqueMissed.length}):\n` +
                uniqueMissed.map((name: string) => `- ${name}`).join("\n") +
                `\n\n`;
            }
            prefill += DEFAULT_DISCUSSION;
            setMeetingNotes(prefill);
            setSavedMeetingNotes(prefill);
          }
        }
      } else {
        throw new Error(json.message || "Failed to fetch");
      }
    } catch (err: any) {
      setApiError(err.message);
      setDailyData(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setCalendarDateRow([]);
    setMeetingJournalId(null);
  }, [selectedMeetingId]);

  useEffect(() => {
    setMeetingJournalId(null);
    loadDailyData(false);
  }, [selectedMeetingId, activeDate]);

  const loadPastFeedbacks = async (targetUserId: string | number) => {
    setIsFetchingFeedbacks(true);
    try {
      const loggedInUserId = localStorage.getItem("userId") || "";
      const url = `${getBaseUrl()}/ratings?resource_type=User&resource_id=${targetUserId}&rating_from_id=${loggedInUserId}`;
      const res = await fetch(url, {
        method: "GET",
        headers: getAuthHeaders(),
      });
      if (res.ok) {
        const data = await res.json();
        const rawList = Array.isArray(data)
          ? data
          : data.data || data.ratings || [];
        // ── Sort newest first by created_at ──
        const sorted = [...rawList].sort(
          (a: any, b: any) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
        setFetchedFeedbacks(sorted);
      } else {
        console.error(`HTTP Error: ${res.status}`);
      }
    } catch (error) {
      console.error("Failed to fetch past feedbacks:", error);
    } finally {
      setIsFetchingFeedbacks(false);
    }
  };

  // ── updateJournal ──
  const updateJournal = async (
    report: any,
    patch: { self_rating?: number; tomorrow_plan_item?: string }
  ) => {
    // The card renders the member's OWN daily report (resolveRawSource →
    // daily_report.report_data), so updates must target that same record.
    // `journal_id` can point at the aggregated meeting journal (only some
    // members have it), which is NOT what's displayed — using it first meant
    // members without a journal_id (or whose journal_id ≠ daily report) didn't
    // reflect the change. Prefer the member's daily report id.
    const journalId =
      report.daily_report?.id || report.journal_id || meetingJournalId;
    if (!journalId) {
      toast.error("Journal ID not found for this report.");
      return false;
    }

    const rawSource = resolveRawSource(report);
    const baseReportData =
      report.daily_report?.report_data || report.report_data || rawSource || {};

    if (patch.tomorrow_plan_item) {
      const existingPlan: any[] = Array.isArray(baseReportData.tomorrow_plan)
        ? baseReportData.tomorrow_plan
        : [];

      const updatedPlan = [
        ...existingPlan,
        { title: patch.tomorrow_plan_item.trim() },
      ];
      const updatedReportData = {
        ...baseReportData,
        tomorrow_plan: updatedPlan,
      };

      try {
        const res = await fetch(
          `${getBaseUrl()}/user_journals/${journalId}.json`,
          {
            method: "PATCH",
            headers: {
              ...getAuthHeaders(),
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              report_data: updatedReportData,
            }),
          }
        );
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return true;
      } catch (err: any) {
        toast.error("Error updating plan: " + err.message);
        return false;
      }
    }

    if (patch.self_rating !== undefined) {
      try {
        const res = await fetch(
          `${getBaseUrl()}/user_journals/${journalId}.json`,
          {
            method: "PATCH",
            headers: {
              ...getAuthHeaders(),
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              self_rating: patch.self_rating,
              report_data: {
                ...rawSource,
                self_rating: patch.self_rating,
              },
            }),
          }
        );
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return true;
      } catch (err: any) {
        toast.error("Error updating rating: " + err.message);
        return false;
      }
    }

    return false;
  };

  const changeDate = (days: number) => {
    const todayKey = getLocalDateKey();
    if (days > 0 && activeDate >= todayKey) return;

    isArrowNav.current = true;
    const currentIndex = calendarRow.findIndex(
      (d: any) => d.full_date === activeDate
    );

    if (currentIndex !== -1) {
      let nextIndex = currentIndex + days;
      while (nextIndex >= 0 && nextIndex < calendarRow.length) {
        const s = getCalendarDisplayStatus(calendarRow[nextIndex].status);
        const nextDate = calendarRow[nextIndex].full_date;
        if (
          s !== "holiday" &&
          s !== "upcoming" &&
          (days < 0 || nextDate <= todayKey)
        ) {
          setActiveDate(calendarRow[nextIndex].full_date);
          return;
        }
        nextIndex += days;
      }
    }

    const d = new Date(activeDate);
    d.setDate(d.getDate() + days);
    const nextDateKey = getLocalDateKey(d);
    if (days < 0 || nextDateKey <= todayKey) {
      setActiveDate(nextDateKey);
    }
  };

  const toggleExpand = (id: any) => {
    const isCollapsing = expandedReports.includes(id);
    setExpandedReports((p) =>
      p.includes(id) ? p.filter((r) => r !== id) : [...p, id]
    );
    // Card band karne par uske andar ke Member/Project filters reset
    if (!isCollapsing) return;
    const cardKey = String(id);
    const clearCardFilter = (prev: Record<string, string>) => {
      if (!(cardKey in prev)) return prev;
      const next = { ...prev };
      delete next[cardKey];
      return next;
    };
    setReportMemberFilters(clearCardFilter);
    setReportProjectFilters(clearCardFilter);
    // Global Members filter is card ko force kar raha tha to wo bhi hata do
    if (
      selectedReporteeExpandId !== null &&
      selectedReporteeExpandId !== undefined &&
      String(selectedReporteeExpandId) === cardKey
    ) {
      setSelectedMember("all");
    }
  };

  const buildCombinedData = (allReports: any[]) => {
    const allAccomplishments: any[] = [];
    const allTasksIssues: any[] = [];
    const allTomorrowPlan: any[] = [];
    let combinedBigWin = "";
    let combinedSelfRating = 0;
    let ratingCount = 0;
    const combinedKpis: any = {
      score: 0,
      tasks: 0,
      issues: 0,
      planning: 0,
      timing: 0,
    };

    allReports
      .filter((r: any) => r.status !== "pending" || !!r.daily_report)
      .forEach((report: any) => {
        const rawSource = resolveRawSource(report);
        const source = normalizeReportData(rawSource);
        const draftRaw = report.daily_report?.report_data || {};
        if (isReportAbsent(report, rawSource, source)) return;

        source.accomplishments.forEach((a: any) =>
          pushUnique(allAccomplishments, { ...a, member: report.name }, [
            "title",
            "member",
          ])
        );
        source.tasks_issues.forEach((t: any) =>
          pushUnique(
            allTasksIssues,
            { ...t, type: getItemType(t), member: report.name },
            ["type", "title", "member"]
          )
        );
        source.tomorrow_plan.forEach((p: any) =>
          pushUnique(allTomorrowPlan, { ...p, member: report.name }, [
            "title",
            "member",
          ])
        );

        if (source.big_win)
          combinedBigWin +=
            (combinedBigWin ? " | " : "") + `${report.name}: ${source.big_win}`;
        if (source.self_rating) {
          combinedSelfRating += Number(source.self_rating) || 0;
          ratingCount++;
        }

        const kpis = report.kpis || rawSource.kpis || {};
        const sections = draftRaw.sections || rawSource.sections || {};

        const t = parseInt(sections.tasks_issues ?? kpis.tasks) || 0;
        const i = parseInt(kpis.issues) || 0;
        const p = parseInt(sections.planning ?? kpis.planning) || 0;
        const tim = parseInt(sections.timing ?? kpis.timing) || 0;

        combinedKpis.tasks += t;
        combinedKpis.issues += i;
        combinedKpis.planning += p;
        combinedKpis.timing += tim;

        const totalScore = getReportTotalScore(report, rawSource);
        if (totalScore !== null) combinedKpis.score += totalScore;
      });

    return {
      allAccomplishments,
      allTasksIssues,
      allTomorrowPlan,
      combinedBigWin,
      avgSelfRating:
        ratingCount > 0 ? Math.round(combinedSelfRating / ratingCount) : 0,
      combinedKpis,
    };
  };

  const buildMeetingNotesObject = (
    allReports: any[],
    allMissed: any[],
    meetingNotesText: string
  ) => {
    const absentSubmittedIds = new Set(
      allReports
        .filter((r: any) => isReportAbsent(r, resolveRawSource(r)))
        .map((r: any) => String(r.user_id))
    );
    const pureMissedNames = allReports
      .filter((r: any) => r.status === "pending" && !r.daily_report)
      .map((r: any) => r.name);
    allMissed.forEach((m: any) => {
      if (absentSubmittedIds.has(String(m.id || m.user_id))) return;
      if (!pureMissedNames.includes(m.name)) pureMissedNames.push(m.name);
    });

    const cleanDiscussion = stripMissedMembersPrefix(meetingNotesText).trim();

    const detailed_reports = allReports
      .filter((r: any) => r.status !== "pending" || !!r.daily_report)
      .map((report: any) => {
        const rawSource = resolveRawSource(report);

        let accRaw: any[] = [];
        if (Array.isArray(rawSource.accomplishments))
          accRaw = rawSource.accomplishments;
        else if (Array.isArray(rawSource.accomplishments?.items))
          accRaw = rawSource.accomplishments.items;

        const accomplishments = accRaw.map((a: any) => ({
          text: a.title || a.text || "",
          done: !!a.done || !!a.completed,
        }));

        let tpRaw: any[] = [];
        if (Array.isArray(rawSource.tomorrow_plan))
          tpRaw = rawSource.tomorrow_plan;

        const tasksIssuesRaw = Array.isArray(rawSource.tasks_issues)
          ? rawSource.tasks_issues
          : [];
        const tasks_issues = tasksIssuesRaw
          .filter((item: any) => !isCompletedStatus(getItemStatus(item)))
          .map((item: any) => ({
            type: getViewSourceType(item),
            title: item.title || item.text || item.name || "",
            text: item.title || item.text || item.name || "",
            status: item.status || "open",
            priority: item.priority || item.urgency || "",
            target_date:
              item.target_date ||
              item.due_date ||
              item.end_date ||
              item.deadline ||
              null,
            source_id: getViewSourceId(item),
            source_type: getViewSourceType(item),
            originalData: item.originalData || item,
          }));

        const tomorrow_plan = tpRaw.map((p: any) =>
          typeof p === "string" ? p : p.title || p.text || ""
        );

        const selfRatingVal =
          rawSource.details?.self_rating ??
          rawSource.sections?.self_rating ??
          rawSource.self_rating ??
          0;

        const isAbsent =
          rawSource.details?.is_absent ??
          rawSource.sections?.is_absent ??
          rawSource.is_absent ??
          false;

        return {
          user_id: report.user_id, // <--- YAHAN USER ID ADD KIYA HAI
          name: report.name || "Unknown",
          attendance: isAbsent ? "Absent" : "Present",
          self_rating: `${selfRatingVal}/10`,
          kpis: Array.isArray(rawSource.kpis) ? rawSource.kpis : [],
          accomplishments,
          tasks_issues,
          tomorrow_plan,
        };
      });

    return {
      missed_report_members: pureMissedNames,
      key_discussion_points: cleanDiscussion,
      detailed_reports,
    };
  };
  // ── Save Meeting (POST) ──
  const handleSaveMeeting = async () => {
    if (selectedMeetingId === "all" || !selectedMeetingId) {
      toast.error("Please select a specific meeting.");
      return;
    }
    setIsSavingMeeting(true);
    try {
      const allReports = dailyData?.member_reports || dailyData?.reports || [];
      const allMissed = dailyData?.missed_members || [];
      const { selectedReportRows, selectedMissedMembers, selectedUserIds } =
        getSelectedMeetingScope(allReports, allMissed);

      if (!ensureSelectedMembersForPayload(selectedUserIds)) {
        setIsSavingMeeting(false);
        return;
      }

      const {
        allAccomplishments,
        allTasksIssues,
        allTomorrowPlan,
        combinedBigWin,
        avgSelfRating,
        combinedKpis,
      } = buildCombinedData(selectedReportRows);

      const meetingNotesObj = buildMeetingNotesObject(
        selectedReportRows,
        selectedMissedMembers,
        meetingNotes
      );

      const reportDataPayload = {
        meeting_notes: meetingNotesObj,
        accomplishments: allAccomplishments.map((a) => ({
          title: a.title || a.text || "",
          source_id: getViewSourceId(a),
          source_type: getPayloadSourceType(a),
        })),
        tasks_issues: allTasksIssues
          .filter((t) => !isCompletedStatus(getItemStatus(t)))
          .map((t) => ({
            type: getViewSourceType(t),
            title: t.title || t.text || "",
            status: t.status || "open",
            source_id: getViewSourceId(t),
            source_type: getViewSourceType(t),
          })),
        big_win: combinedBigWin || null,
        tomorrow_plan: allTomorrowPlan.map((p) => {
          const sourceType = getPayloadSourceType(p);
          return {
            title: p.title || p.text || "",
            source_id: getViewSourceId(p),
            source_type: sourceType,
          };
        }),
        kpis: {
          score: `${combinedKpis.score}`,
          tasks: `${combinedKpis.tasks}`,
          issues: `${combinedKpis.issues}`,
          planning: `${combinedKpis.planning}`,
          timing: `${combinedKpis.timing}`,
        },
        summary: {
          total_members: dailyData?.total_members || 0,
          submitted_count: dailyData?.submitted || 0,
          missed_count: dailyData?.missed || 0,
          meeting_name: dailyData?.config?.name || "",
          meeting_head: dailyData?.config?.meeting_head || null,
        },
      };

      const payload = {
        meeting_config_id: parseInt(selectedMeetingId, 10),
        report_date: activeDate,
        user_ids: selectedUserIds,
        member_ids: selectedUserIds,
        self_rating: avgSelfRating,
        is_absent: false,
        status: "submitted",
        report_data: reportDataPayload,
      };

      const res = await fetch(
        `${getBaseUrl()}/user_journals/submit_daily_meeting`,
        {
          method: "POST",
          headers: { ...getAuthHeaders(), "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      const responseData = await res.json().catch(() => null);
      if (!res.ok || (responseData && responseData.success === false)) {
        const errorMsg = getApiErrorMessage(responseData, `HTTP ${res.status}`);
        throw new Error(errorMsg);
      }

      toast.success("Meeting saved successfully!");
      if (onMeetingSaved) onMeetingSaved(activeDate);

      const newId =
        responseData?.data?.id || responseData?.id || responseData?.journal_id;
      if (newId) {
        setMeetingJournalId(newId);
      }

      setCalendarDateRow((prev) =>
        prev.map((d) =>
          d.full_date === activeDate ? { ...d, status: "submitted" } : d
        )
      );

      const cleanDiscussion = stripMissedMembersPrefix(meetingNotes).trim();
      setMeetingNotes(cleanDiscussion);
      setSavedMeetingNotes(cleanDiscussion);

      await loadDailyData(true);
    } catch (err: any) {
      toast.error(err.message || "Error saving meeting");
    } finally {
      setIsSavingMeeting(false);
    }
  };

  // ── Update Notes Only (PATCH) ──
  const handleUpdateNotesOnly = async () => {
    if (!meetingJournalId) {
      toast.error("No saved meeting found to update.");
      return;
    }
    setIsSavingMeeting(true);
    try {
      const allReports = dailyData?.member_reports || dailyData?.reports || [];
      const allMissed = dailyData?.missed_members || [];
      const { selectedReportRows, selectedMissedMembers, selectedUserIds } =
        getSelectedMeetingScope(allReports, allMissed);

      if (!ensureSelectedMembersForPayload(selectedUserIds)) {
        setIsSavingMeeting(false);
        return;
      }

      const meetingNotesObj = buildMeetingNotesObject(
        selectedReportRows,
        selectedMissedMembers,
        meetingNotes
      );

      const existingRd =
        allReports.find(
          (r: any) =>
            r.journal_id === meetingJournalId && r.report_data?.meeting_notes
        )?.report_data || {};

      const payload = {
        user_ids: selectedUserIds,
        member_ids: selectedUserIds,
        report_data: {
          ...existingRd,
          meeting_notes: meetingNotesObj,
        },
      };

      const res = await fetch(
        `${getBaseUrl()}/user_journals/${meetingJournalId}.json`,
        {
          method: "PATCH",
          headers: { ...getAuthHeaders(), "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      const responseData = await res.json().catch(() => null);
      if (!res.ok || (responseData && responseData.success === false)) {
        const errorMsg = getApiErrorMessage(responseData, `HTTP ${res.status}`);
        throw new Error(errorMsg);
      }

      toast.success("Meeting notes updated!");
      setSavedMeetingNotes(meetingNotes);
      await loadDailyData(true);
    } catch (err: any) {
      toast.error("Error updating meeting notes: " + err.message);
    } finally {
      setIsSavingMeeting(false);
    }
  };

  // ── Update Full Meeting (PATCH) ──
  const handleUpdateMeeting = async () => {
    if (!meetingJournalId) {
      toast.error("No saved meeting found to update.", {
        description: "Please save the meeting first.",
      });
      return;
    }
    setIsSavingMeeting(true);
    try {
      const allReports = dailyData?.member_reports || dailyData?.reports || [];
      const allMissed = dailyData?.missed_members || [];
      const { selectedReportRows, selectedMissedMembers, selectedUserIds } =
        getSelectedMeetingScope(allReports, allMissed);

      if (!ensureSelectedMembersForPayload(selectedUserIds)) {
        setIsSavingMeeting(false);
        return;
      }

      const {
        allAccomplishments,
        allTasksIssues,
        allTomorrowPlan,
        combinedBigWin,
        avgSelfRating,
        combinedKpis,
      } = buildCombinedData(selectedReportRows);

      const meetingNotesObj = buildMeetingNotesObject(
        selectedReportRows,
        selectedMissedMembers,
        meetingNotes
      );

      const reportDataPayload = {
        meeting_notes: meetingNotesObj,
        accomplishments: allAccomplishments.map((a) => ({
          title: a.title || a.text || "",
          source_id: getViewSourceId(a),
          source_type: getPayloadSourceType(a),
        })),
        tasks_issues: allTasksIssues
          .filter((t) => !isCompletedStatus(getItemStatus(t)))
          .map((t) => ({
            type: getViewSourceType(t),
            title: t.title || t.text || "",
            status: t.status || "open",
            source_id: getViewSourceId(t),
            source_type: getViewSourceType(t),
          })),
        big_win: combinedBigWin || null,
        tomorrow_plan: allTomorrowPlan.map((p) => {
          const sourceType = getPayloadSourceType(p);
          return {
            title: p.title || p.text || "",
            source_id: getViewSourceId(p),
            source_type: sourceType,
          };
        }),
        kpis: {
          score: `${combinedKpis.score}`,
          tasks: `${combinedKpis.tasks}`,
          issues: `${combinedKpis.issues}`,
          planning: `${combinedKpis.planning}`,
          timing: `${combinedKpis.timing}`,
        },
      };

      const payload = {
        user_ids: selectedUserIds,
        member_ids: selectedUserIds,
        self_rating: avgSelfRating,
        status: "submitted",
        report_data: reportDataPayload,
      };

      const res = await fetch(
        `${getBaseUrl()}/user_journals/${meetingJournalId}.json`,
        {
          method: "PATCH",
          headers: { ...getAuthHeaders(), "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      const responseData = await res.json().catch(() => null);
      if (!res.ok || (responseData && responseData.success === false)) {
        const errorMsg = getApiErrorMessage(responseData, `HTTP ${res.status}`);
        throw new Error(errorMsg);
      }

      toast.success("Meeting updated successfully!");
      setSavedMeetingNotes(meetingNotes);
      await loadDailyData(true);
    } catch (err: any) {
      toast.error("Error updating meeting: " + err.message);
    } finally {
      setIsSavingMeeting(false);
    }
  };

  // ── Derived Data ──
  const dateRow = dailyData?.date_row || [];
  const baseCalendarRow = calendarDateRow.length > 0 ? calendarDateRow : dateRow;
  const selectedMemberCalendarRow = getSelectedMemberCalendarRow(
    dailyData,
    selectedMember,
    baseCalendarRow
  );
  const calendarRow =
    selectedMemberCalendarRow.length > 0
      ? selectedMemberCalendarRow
      : baseCalendarRow;
  const config = dailyData?.config;
  const topDateStr = dailyData?.date || activeDate;
  const isNextDateDisabled = activeDate >= getLocalDateKey();
  const configName =
    config?.name || (selectedMeetingId === "all" ? "All Meetings" : "Meeting");

  const activeDateStatus = calendarRow.find(
    (d: any) => d.full_date === activeDate
  )?.status;

  const isActiveDateSubmitted =
    !!meetingJournalId ||
    activeDateStatus === "done" ||
    activeDateStatus === "submitted";

  const notesChanged = meetingNotes.trim() !== savedMeetingNotes.trim();

  let memberReports = (dailyData?.member_reports || dailyData?.reports || [])
    .slice()
    .sort((a: any, b: any) =>
      (a.name || "").localeCompare(b.name || "", undefined, {
        sensitivity: "base",
      })
    );
  // HODs = top-level report owners that have reportees under them
  // (fallback: every report owner, when nobody has reportees).
  const hodReports = memberReports.filter(
    (report: any) =>
      Array.isArray(report.reportee_reports) && report.reportee_reports.length > 0
  );
  const hodOptions = [
    { value: "all", label: "All HOD" },
    ...(hodReports.length > 0 ? hodReports : memberReports).map((report: any) => ({
      value: String(report.user_id),
      label: report.department
        ? `${(report.name || "").trim()} — ${report.department}`
        : (report.name || "").trim() || `User ${report.user_id}`,
    })),
  ];

  const getReportFilterItems = (report: any) => {
    const reportData = normalizeReportData(resolveRawSource(report));
    const reporteeItems = Array.isArray(report.reportee_reports)
      ? report.reportee_reports.flatMap((reportee: any) => {
        const reporteeData = normalizeReportData(resolveRawSource(reportee));
        return [
          ...reporteeData.accomplishments,
          ...reporteeData.tasks_issues,
          ...reporteeData.tomorrow_plan,
        ];
      })
      : [];
    return [
      ...reportData.accomplishments,
      ...reportData.tasks_issues,
      ...reportData.tomorrow_plan,
      ...reporteeItems,
    ];
  };
  const addFilterOption = (map: Map<string, string>, label: string) => {
    const cleanLabel = String(label || "").trim();
    if (!cleanLabel) return;
    const key = cleanLabel.toLowerCase();
    if (!map.has(key)) map.set(key, cleanLabel);
  };
  const tagOptionMap = new Map<string, string>();
  const projectOptionMap = new Map<string, string>();
  memberReports.forEach((report: any) => {
    getReportFilterItems(report).forEach((item: any) => {
      getItemTagNames(item).forEach((tag) => addFilterOption(tagOptionMap, tag));
      addFilterOption(projectOptionMap, getItemProjectName(item));
    });
  });
  const tagOptions = [
    { value: "all", label: "All Tags" },
    ...Array.from(tagOptionMap.entries()).map(([value, label]) => ({
      value,
      label,
    })),
  ];
  const projectOptions = [
    { value: "all", label: "All Projects" },
    ...Array.from(projectOptionMap.entries()).map(([value, label]) => ({
      value,
      label,
    })),
  ];
  const adminPlanMissedMembers = memberReports.filter(
    isAdminAddedMissedPlanReport
  );
  const adminPlanMissedById = new Map(
    adminPlanMissedMembers.map((report: any) => [String(report.user_id), report])
  );
  const baseMissedMembers = (dailyData?.missed_members || []).map(
    (member: any) => {
      const memberId = String(member.id || member.user_id);
      const planReport = adminPlanMissedById.get(memberId);
      return planReport ? { ...planReport, ...member, id: memberId } : member;
    }
  );
  const failedMemberIdSet = new Set(
    baseMissedMembers.map((member: any) => String(member.id || member.user_id))
  );
  let failedMembers = [
    ...baseMissedMembers,
    ...adminPlanMissedMembers
      .filter((report: any) => !failedMemberIdSet.has(String(report.user_id)))
      .map((report: any) => ({
        ...report,
        id: report.user_id,
        user_id: report.user_id,
      })),
  ];
  const absentSubmittedUserIds = new Set(
    memberReports
      .filter((report: any) => isReportAbsent(report, resolveRawSource(report)))
      .map((report: any) => String(report.user_id))
  );
  failedMembers = failedMembers.filter(
    (member: any) =>
      !absentSubmittedUserIds.has(String(member.id || member.user_id))
  );
  if (selectedHod !== "all") {
    memberReports = memberReports.filter(
      (r: any) => String(r.user_id) === selectedHod
    );
    failedMembers = failedMembers.filter(
      (m: any) => String(m.id || m.user_id) === selectedHod
    );
  }
  // The picked member may be a reportee rather than a report owner (e.g. Uzair
  // sits under Akshay). In that case show the HOD's card and force that card's
  // member filter to the reportee, so only their rows are listed.
  let selectedReporteeExpandId: any = null;
  let selectedReporteeOwnerId: string | null = null;
  let selectedReporteeMemberKey: string | null = null;
  if (selectedMember !== "all") {
    const isOwnReport = memberReports.some(
      (r: any) => String(r.user_id) === selectedMember
    );
    if (!isOwnReport) {
      const ownerReport = memberReports.find(
        (r: any) =>
          Array.isArray(r.reportee_reports) &&
          r.reportee_reports.some(
            (reportee: any) => String(reportee.user_id) === selectedMember
          )
      );
      if (ownerReport) {
        const reportee = ownerReport.reportee_reports.find(
          (item: any) => String(item.user_id) === selectedMember
        );
        selectedReporteeOwnerId = String(ownerReport.user_id);
        selectedReporteeExpandId =
          ownerReport.journal_id || ownerReport.user_id;
        selectedReporteeMemberKey = getMemberFilterKey(
          reportee?.name || reportee?.email
        );
      }
    }
  }
  if (selectedMember !== "all") {
    memberReports = memberReports.filter((r: any) =>
      selectedReporteeOwnerId
        ? String(r.user_id) === selectedReporteeOwnerId
        : String(r.user_id) === selectedMember
    );
    failedMembers = failedMembers.filter(
      (m: any) => String(m.id) === selectedMember
    );
  }
  if (selectedTag !== "all" || selectedProject !== "all") {
    memberReports = memberReports.filter((report: any) =>
      getReportFilterItems(report).some((item: any) => {
        const matchesTag =
          selectedTag === "all" ||
          getItemTagNames(item).some(
            (tag) => tag.toLowerCase() === selectedTag
          );
        const matchesProject =
          selectedProject === "all" ||
          getItemProjectName(item).toLowerCase() === selectedProject;
        return matchesTag && matchesProject;
      })
    );
  }

  // Reportee selected from the global Members filter → open the HOD's card
  useEffect(() => {
    if (selectedReporteeExpandId === null || selectedReporteeExpandId === undefined)
      return;
    setExpandedReports((prev) =>
      prev.includes(selectedReporteeExpandId)
        ? prev
        : [...prev, selectedReporteeExpandId]
    );
  }, [selectedReporteeExpandId]);

  const getReportSelectionKey = (report: any) =>
    String(report?.journal_id || report?.user_id || "");

  const getSelectedMeetingScope = (reports: any[], missedMembers: any[]) => {
    const selectedKeys = new Set(selectedReports.map((id) => String(id)));
    const selectedReportRows = reports.filter((report: any) =>
      selectedKeys.has(getReportSelectionKey(report))
    );
    const selectedUserIds = Array.from(
      new Set(
        selectedReportRows
          .map((report: any) => Number(report.user_id))
          .filter((id: number) => Number.isFinite(id) && id > 0)
      )
    );
    const selectedUserIdSet = new Set(selectedUserIds.map(String));
    const selectedMissedMembers = missedMembers.filter((member: any) =>
      selectedUserIdSet.has(String(member.id))
    );

    return { selectedReportRows, selectedMissedMembers, selectedUserIds };
  };

  const ensureSelectedMembersForPayload = (selectedUserIds: number[]) => {
    if (selectedUserIds.length > 0) return true;
    toast.error("Please select at least one user.");
    return false;
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      const allIds = memberReports.map((r: any) => r.journal_id || r.user_id);
      setSelectedReports(allIds);
      toast.success(
        `${allIds.length} report${allIds.length !== 1 ? "s" : ""} selected`
      );
    } else {
      const checkedInIds = memberReports
        .filter((r: any) => r.checked_in_meeting === true)
        .map((r: any) => r.journal_id || r.user_id);
      setSelectedReports(checkedInIds);
      toast("Selection cleared for pending members", { icon: "✕" });
    }
  };

  const handleFeedback = () => {
    navigate("/admin-compass/feedback-dashboard");
  };

  // ── Add an item to a member's Tomorrow's Plan ──
  const [isSavingPlan, setIsSavingPlan] = useState(false);
  const toggleAddToPlan = (rId: any) => {
    setQuickActionText("");
    setQuickActionOpenId((current: any) => (current === rId ? null : rId));
  };
  const handleAddToPlan = async (report: any) => {
    const text = quickActionText.trim();
    if (!text) {
      toast.error("Please enter a plan item.");
      return;
    }
    setIsSavingPlan(true);
    const ok = await updateJournal(report, { tomorrow_plan_item: text });
    setIsSavingPlan(false);
    if (ok) {
      toast.success("Added to tomorrow's plan!");
      setQuickActionOpenId(null);
      setQuickActionText("");
      await loadDailyData(true);
    }
  };

  const handleAddMissedMemberPlan = async (member: any) => {
    const text = quickActionText.trim();
    if (!text) {
      toast.error("Please enter a plan item.");
      return;
    }

    const userId = member?.user_id || member?.id || member?.user?.id;
    if (!userId) {
      toast.error("User ID not found for this member.");
      return;
    }

    const currentPlan = normalizeReportData(resolveRawSource(member)).tomorrow_plan;

    setIsSavingPlan(true);
    try {
      const res = await fetch(
        `${getBaseUrl()}/user_journals/upsert_member_tomorrow_plan`,
        {
          method: "POST",
          headers: {
            ...getAuthHeaders(),
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            user_id: Number(userId) || userId,
            report_date: activeDate,
            tomorrow_plan: [
              ...currentPlan,
              {
                title: text,
                is_starred: false,
              },
            ],
          }),
        }
      );
      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      toast.success("Added to tomorrow's plan!");
      setQuickActionOpenId(null);
      setQuickActionText("");
      await loadDailyData(true);
    } catch (err: any) {
      toast.error("Error updating plan: " + err.message);
    } finally {
      setIsSavingPlan(false);
    }
  };

  const resetFeedbackForm = () => {
    setFeedbackRating(0);
    setFeedbackMessage("");
  };

  const openFeedbackPanel = (panelId: any, targetUserId?: string | number) => {
    setFeedbackClosingId(null);
    setFeedbackOpenId(panelId);
    resetFeedbackForm();
    if (targetUserId) loadPastFeedbacks(targetUserId);
  };

  const closeFeedbackPanel = (panelId: any) => {
    setFeedbackClosingId(panelId);
    window.setTimeout(() => {
      setFeedbackOpenId((current: any) => (current === panelId ? null : current));
      setFeedbackClosingId((current: any) => (current === panelId ? null : current));
      resetFeedbackForm();
    }, 180);
  };

  const renderCompactReportItems = (
    items: any[] = [],
    emptyText = "None recorded."
  ) => {
    if (!items.length) {
      return <p className="text-xs text-neutral-300 italic">{emptyText}</p>;
    }

    return (
      <ul className="space-y-2">
        {items.map((item: any, index: number) => {
          const type = getViewSourceType(item);
          const hasDetails = ["task", "issue", "todo"].includes(type);
          const typePillStyle =
            type === "issue"
              ? "bg-red-100 text-red-700 border-red-200"
              : type === "todo"
                ? "bg-violet-100 text-violet-700 border-violet-200"
                : type === "task"
                  ? "bg-[#FFF3EE] text-[#DA7756] border-[#DA7756]/30"
                  : "bg-gray-100 text-gray-600 border-gray-200";

          return (
            <li
              key={index}
              onClick={hasDetails ? () => handleViewTaskIssueTodoItem(item) : undefined}
              className={cn(
                "flex flex-col rounded-[10px] border border-gray-100 bg-gray-50/70 transition-all",
                hasDetails && "cursor-pointer hover:border-[#DA7756]/40 hover:bg-[#FFF8F5]"
              )}
            >
              <div className="flex items-center gap-2 px-3 py-2.5">
                <span
                  className={cn(
                    "shrink-0 text-[9px] font-black uppercase tracking-wide px-2 py-0.5 rounded-full border",
                    typePillStyle
                  )}
                >
                  {type}
                </span>
                <span className="flex-1 min-w-0 text-xs font-semibold text-neutral-800 leading-tight">
                  {getItemTitle(item)}
                </span>
                {hasDetails && (
                  <button
                    onClick={(event) => {
                      event.stopPropagation();
                      handleViewTaskIssueTodoItem(item);
                    }}
                    className="shrink-0 flex items-center gap-1 px-2 py-1 rounded-[6px] bg-white border border-gray-200 text-[#DA7756] hover:bg-[#FFF3EE] transition-colors shadow-sm"
                    title={`View ${type}`}
                  >
                    <Eye className="w-3 h-3" />
                  </button>
                )}
              </div>
              <ReportItemMeta item={item} />
            </li>
          );
        })}
      </ul>
    );
  };

  const getMemberBadgeClass = (name: any) => {
    const colors = [
      "bg-[#E7E3FF] text-[#6756C9]",
      "bg-[#FFE2A8] text-[#8B5A00]",
      "bg-[#BFEADF] text-[#0E6F5E]",
      "bg-[#F0E8FF] text-[#7564C9]",
      "bg-[#FFD9B5] text-[#A15305]",
      "bg-[#DDEBFF] text-[#315FAD]",
    ];
    const seed = String(name || "")
      .split("")
      .reduce((sum, char) => sum + char.charCodeAt(0), 0);
    return colors[seed % colors.length];
  };

  const getMemberShortName = (name: any) => {
    const parts = String(name || "")
      .trim()
      .split(/\s+/)
      .filter(Boolean);
    if (!parts.length) return "";
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
  };

  const renderAccomplishmentRows = (
    items: any[] = [],
    _showMemberBadge = false,
    emptyText = "None recorded."
  ) => {
    if (!items.length) {
      return <p className="px-1 py-2 text-xs text-neutral-300 italic">{emptyText}</p>;
    }

    return (
      <ul className="space-y-3">
        {items.map((item: any, index: number) => {
          const type = getViewSourceType(item);
          const hasDetails = ["task", "issue", "todo"].includes(type);
          // Design: tasks/issues use the orange notepad glyph, todos/notes the blue document glyph
          const isNotepadLike = type === "task" || type === "issue";
          const ItemIcon = isNotepadLike ? NotepadText : FileText;
          const typeLabel =
            type === "task"
              ? "Task"
              : type === "issue"
                ? "Issue"
                : type === "todo"
                  ? "Todo"
                  : "Note";
          const typeBadgeClass =
            type === "task"
              ? "bg-[#DA7756] text-white border-transparent"
              : type === "issue"
                ? "bg-violet-600 text-white border-transparent"
                : type === "todo"
                  ? "bg-amber-500 text-white border-transparent"
                  : "bg-gray-500 text-white border-transparent";
          const memberName = item.member || item.member_name || item.user_name || "";

          return (
            <li
              key={`${getItemTitle(item)}-${memberName}-${index}`}
              onClick={hasDetails ? () => handleViewTaskIssueTodoItem(item) : undefined}
              className={cn(
                "flex min-h-[54px] flex-col rounded-[10px] border border-[#ECEFF3] bg-white shadow-[0_1px_2px_rgba(15,23,42,0.03)]",
                hasDetails &&
                "row-action cursor-pointer hover:border-[#DA7756]/40 hover:bg-[#FFF8F5]"
              )}
            >
              <div className="flex flex-1 items-center gap-3 px-4 py-3">
                <ItemIcon
                  className={cn(
                    "h-[18px] w-[18px] shrink-0",
                    isNotepadLike ? "text-[#F36A3D]" : "text-[#4BA3F2]"
                  )}
                />
                <span className="min-w-0 flex-1 text-[13px] font-medium leading-[16px] text-[#2B2F38]">
                  {getItemTitle(item)}
                </span>
                <span
                  className={cn(
                    "shrink-0 rounded-full border px-2 py-0.5 text-[9px] font-extrabold uppercase leading-none",
                    typeBadgeClass
                  )}
                >
                  {typeLabel}
                </span>
                {memberName && (
                  <span
                    className={cn(
                      "flex h-[22px] min-w-[22px] shrink-0 items-center justify-center rounded-full px-1.5 text-[9px] font-extrabold leading-none",
                      getMemberBadgeClass(memberName)
                    )}
                    title={memberName}
                  >
                    {getMemberShortName(memberName)}
                  </span>
                )}
              </div>
              {/* Target date + overdue + estimated effort + active time */}
              <ReportItemMeta item={item} />
            </li>
          );
        })}
      </ul>
    );
  };

  const visibleReports = memberReports.filter(
    (report: any) =>
      !isAdminAddedMissedPlanReport(report) &&
      (report.status !== "pending" || !!report.daily_report)
  );

  const visibleReportIds = visibleReports.map((r: any) =>
    String(r.journal_id || r.user_id)
  );
  const areAllVisibleReportsSelected =
    visibleReportIds.length > 0 &&
    visibleReportIds.every((id: string) =>
      selectedReports.map((selectedId) => String(selectedId)).includes(id)
    );

  const noMeetings = meetingsLoaded && meetingsList.length === 0;

  return (
    <div
      className="pb-12 space-y-6 min-w-0"
      style={{ fontFamily: "'Poppins', sans-serif" }}
    >
      <style>
        {`
          @keyframes feedbackPanelIn {
            from { opacity: 0; transform: translateY(-6px) scale(0.985); }
            to { opacity: 1; transform: translateY(0) scale(1); }
          }
          @keyframes feedbackPanelOut {
            from { opacity: 1; transform: translateY(0) scale(1); }
            to { opacity: 0; transform: translateY(-6px) scale(0.985); }
          }
          .feedback-panel-enter { animation: feedbackPanelIn 180ms ease-out both; }
          .feedback-panel-exit { animation: feedbackPanelOut 180ms ease-in both; }

          /* Dropdown open / close */
          @keyframes ddMenuIn {
            from { opacity: 0; transform: translateY(-6px) scale(0.97); }
            to { opacity: 1; transform: translateY(0) scale(1); }
          }
          @keyframes ddMenuOut {
            from { opacity: 1; transform: translateY(0) scale(1); }
            to { opacity: 0; transform: translateY(-4px) scale(0.98); }
          }
          .dd-menu-enter { animation: ddMenuIn 150ms cubic-bezier(0.16, 1, 0.3, 1) both; transform-origin: top center; }
          .dd-menu-exit { animation: ddMenuOut 120ms ease-in both; transform-origin: top center; }
          .dd-option { transition: background-color 120ms ease, color 120ms ease, padding-left 120ms ease; }
          .dd-option:hover { padding-left: 20px; }

          /* Expanding a report card */
          @keyframes cardBodyIn {
            from { opacity: 0; transform: translateY(-8px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .card-body-enter { animation: cardBodyIn 200ms cubic-bezier(0.16, 1, 0.3, 1) both; }

          /* Row click → navigate / open details */
          .row-action { transition: transform 130ms ease, box-shadow 130ms ease, border-color 130ms ease, background-color 130ms ease; }
          .row-action:hover { transform: translateY(-1px); box-shadow: 0 4px 12px rgba(15,23,42,0.07); }
          .row-action:active { transform: scale(0.985); box-shadow: none; }

          @media (prefers-reduced-motion: reduce) {
            .dd-menu-enter, .dd-menu-exit, .card-body-enter,
            .feedback-panel-enter, .feedback-panel-exit { animation: none !important; }
            .row-action, .row-action:hover, .row-action:active { transform: none; }
          }
        `}
      </style>
      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] gap-6 items-stretch">
        {/* ══ LEFT COLUMN ══ */}
        <div className="h-full">
          {/* ══ CALENDAR CARD ══ */}
          <div className="rounded-2xl border border-gray-200 bg-white shadow-sm h-full flex flex-col">
            <div className="p-5 flex-1 flex flex-col justify-between">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
                <div className="flex min-w-0 items-center gap-3">
                  <Calendar size={20} className="text-neutral-500 shrink-0" />
                  <span className="text-base sm:text-lg font-bold text-[#1a1a1a] tracking-tight leading-tight">
                    Daily Meeting for {topDateStr}
                  </span>
                </div>
                <div className="flex items-center gap-2 self-end sm:self-auto">
                  <button
                    onClick={() => changeDate(-1)}
                    className="flex items-center justify-center w-9 h-9 rounded-full bg-white border border-[#EAE3DF] shadow-sm hover:bg-gray-50 transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5 text-neutral-600" />
                  </button>
                  <button
                    onClick={() => changeDate(1)}
                    disabled={isNextDateDisabled}
                    className={cn(
                      "flex items-center justify-center w-9 h-9 rounded-full bg-white border border-[#EAE3DF] shadow-sm transition-colors",
                      isNextDateDisabled
                        ? "opacity-40 cursor-not-allowed"
                        : "hover:bg-gray-50"
                    )}
                  >
                    <ChevronRight className="w-5 h-5 text-neutral-600" />
                  </button>
                </div>
              </div>

              {/* ── Calendar Body ── */}
              {isLoading && !dailyData ? (
                <div className="flex gap-4 overflow-x-auto pb-8 pt-4 scrollbar-none snap-x">
                  {[1, 2, 3, 4, 5, 6, 7].map((i) => (
                    <div
                      key={i}
                      className="min-w-[96px] h-[110px] rounded-[16px] skeleton shrink-0"
                    />
                  ))}
                </div>
              ) : noMeetings ? (
                <div className="flex flex-col items-center justify-center py-12 gap-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/70 border border-[#DA7756]/20">
                    <Calendar className="w-7 h-7 text-[#DA7756] opacity-40" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-bold text-neutral-500">
                      No meetings configured
                    </p>
                    <p className="text-xs text-neutral-400 mt-1 max-w-[220px] leading-relaxed">
                      Please configure a meeting first to view the daily
                      calendar.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-7 gap-2 sm:gap-3 overflow-y-visible pb-3 pt-2">
                  {calendarRow.map((dateItem: any) => {
                    const isSelected = dateItem.full_date === activeDate;
                    let rawStatus = dateItem.status;

                    if (isSelected && meetingJournalId) {
                      rawStatus = "submitted";
                    }

                    const displayStatus =
                      getCalendarDisplayStatus(rawStatus) ||
                      (dateItem.full_date > getLocalDateKey()
                        ? "upcoming"
                        : "");
                    const isHoliday = displayStatus === "holiday";
                    const isUpcoming = displayStatus === "upcoming";
                    const isFilled =
                      displayStatus === "done" || displayStatus === "submitted";
                    const isMissed = displayStatus === "missed";

                    // top bar color (BusinessCompass style)
                    let topBarColor = "transparent";
                    let displayLabel = "Upcoming";
                    if (isFilled) {
                      topBarColor = "#61CDBB";
                      displayLabel = "Filled";
                    } else if (isMissed) {
                      topBarColor = "#E28B8B";
                      displayLabel = "Miss";
                    } else if (isHoliday) {
                      topBarColor = "#D1D5DB";
                      displayLabel = "Holiday";
                    } else if (isUpcoming) {
                      displayLabel = "Upcoming";
                    }

                    return (
                      <div
                        key={dateItem.full_date}
                        onClick={
                          isHoliday || isUpcoming
                            ? undefined
                            : () => setActiveDate(dateItem.full_date)
                        }
                        className={cn(
                          "w-full h-[104px] rounded-xl flex flex-col items-center justify-center gap-1.5 transition-all relative",
                          isHoliday || isUpcoming
                            ? "cursor-not-allowed opacity-70"
                            : "cursor-pointer"
                        )}
                        style={{
                          background: isSelected ? "#FFFFFF" : "#F5F3EE",
                          border: isSelected
                            ? "1.5px solid #DA7756"
                            : "1.5px solid transparent",
                          boxShadow: isSelected
                            ? "0 2px 8px rgba(218,119,86,0.18)"
                            : "none",
                        }}
                        title={
                          isHoliday
                            ? "Holiday - not selectable"
                            : isUpcoming
                              ? "Upcoming - not selectable"
                              : displayLabel
                        }
                      >
                        {topBarColor !== "transparent" && (
                          <div
                            className="absolute top-[-1.5px] left-[-1.5px] right-[-1.5px] z-10 h-3 rounded-t-xl"
                            style={{ backgroundColor: topBarColor }}
                          />
                        )}
                        {isUpcoming && !isSelected && (
                          <div
                            className="absolute top-0 right-0 z-20 w-2.5 h-2.5 rounded-full border border-white"
                            style={{
                              backgroundColor: "#E28B8B",
                              transform: "translate(30%, -30%)",
                            }}
                          />
                        )}
                        <span className="text-[13px] font-semibold text-neutral-500 mt-2">
                          {dateItem.day}
                        </span>
                        <span className="text-[24px] font-black text-neutral-800 leading-tight">
                          {dateItem.date}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}

              {!noMeetings && (
                <div className="flex flex-wrap justify-center gap-x-8 gap-y-3 pt-3 border-t border-gray-100 mt-1">
                  <div className="flex items-center gap-1.5 text-[11px] text-gray-500 font-semibold">
                    <span
                      className="w-3 h-3 rounded-sm"
                      style={{ background: "#61CDBB" }}
                    />
                    Held
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px] text-gray-500 font-semibold">
                    <span
                      className="w-3 h-3 rounded-sm"
                      style={{ background: "#E28B8B" }}
                    />
                    Missed
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px] text-gray-500 font-semibold">
                    <span
                      className="w-3 h-3 rounded-sm"
                      style={{ background: "#D1D5DB" }}
                    />
                    Holiday
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px] text-gray-500 font-semibold">
                    <span
                      className="w-3 h-3 rounded-full"
                      style={{ background: "#E28B8B" }}
                    />
                    Upcoming
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        {/* ══ END LEFT COLUMN ══ (calendar only) */}

        {/* ══ RIGHT COLUMN — Notes Panel ══ */}
        <div className="h-full">
          {isLoading && !dailyData && (
            <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm h-full flex flex-col animate-pulse">
              <div className="flex items-center justify-between p-4 border-b border-gray-100">
                <div className="h-4 w-36 rounded-full skeleton" />
                <div className="h-3 w-20 rounded-full skeleton" />
              </div>
              <div className="flex items-center gap-2 flex-wrap px-4 py-3 border-b border-gray-100">
                <div className="h-7 w-20 rounded-2xl skeleton" />
                <div className="h-7 w-24 rounded-2xl skeleton" />
                <div className="h-7 w-20 rounded-2xl skeleton" />
              </div>
              <div className="p-4 flex-1 flex flex-col gap-2">
                <div className="h-3 w-24 rounded-full skeleton" />
                <div className="flex-1 rounded-2xl skeleton min-h-[120px]" />
              </div>
              <div className="flex items-center justify-between bg-gray-50 p-3 px-4 border-t border-gray-100">
                <div className="h-5 w-24 rounded-full skeleton" />
                <div className="h-9 w-32 rounded-2xl skeleton" />
              </div>
            </div>
          )}
          {!isLoading && dailyData && !noMeetings && (
            <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm h-full flex flex-col">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 p-4 border-b border-gray-100">
                <div className="flex min-w-0 items-center gap-2 font-semibold text-neutral-800 text-sm">
                  <FileText className="w-4 h-4 text-[#CE7A5A]" />
                  Daily Reports ({configName})
                </div>
                <span className="text-xs text-neutral-400">{topDateStr}</span>
              </div>

              {/* Stats row */}
              <div className="grid grid-cols-3 gap-3 px-4 py-3">
                <div className="rounded-xl px-4 py-3 bg-[#F2F1EC]">
                  <div className="text-[26px] font-black text-neutral-800 leading-none">
                    {dailyData.total_members || 0}
                  </div>
                  <div className="text-[11px] font-semibold text-neutral-500 mt-1.5">
                    Total
                  </div>
                </div>
                <div className="rounded-xl px-4 py-3 bg-[#CFEDE4]">
                  <div className="text-[26px] font-black text-neutral-800 leading-none">
                    {dailyData.submitted || 0}
                  </div>
                  <div className="text-[11px] font-semibold text-neutral-600 mt-1.5">
                    Submitted
                  </div>
                </div>
                <div className="rounded-xl px-4 py-3 bg-[#F9DDD8]">
                  <div className="text-[26px] font-black text-neutral-800 leading-none">
                    {dailyData.missed || 0}
                  </div>
                  <div className="text-[11px] font-semibold text-neutral-600 mt-1.5">
                    Missed
                  </div>
                </div>
              </div>

              {/* Meeting Notes — grows to fill height */}
              <div className="p-4 flex-1 flex flex-col">
                <p className="text-[11px] font-bold text-neutral-500 mb-2">
                  Meeting Notes
                </p>
                <textarea
                  value={meetingNotes}
                  onChange={(e) => setMeetingNotes(e.target.value)}
                  className="w-full flex-1 border border-gray-200 rounded-2xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[rgba(218,119,86,0.22)] min-h-[120px] resize-none placeholder:text-neutral-400 text-neutral-700 bg-[#FFFAF8]"
                  placeholder={
                    meetingJournalId
                      ? "Edit discussion points..."
                      : "Team members who missed + discussion points will appear here..."
                  }
                />
              </div>

              {/* Select All + Save Meeting moved to the filter bar below */}
            </div>
          )}
        </div>
        {/* ══ END RIGHT COLUMN (notes) ══ */}
      </div>
      {/* ══ END CALENDAR+NOTES GRID ══ */}

      {/* ══ FULL WIDTH BELOW — Filters ══ */}
      {/* ══ FILTERS ══ */}
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm px-4 py-3 flex flex-wrap items-center gap-3 sm:gap-4">
        <div className="flex shrink-0 items-center gap-2">
          {noMeetings ? (
            <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl px-3 py-2">
              <AlertTriangle className="w-3.5 h-3.5 text-red-400 shrink-0" />
              <span className="text-xs font-bold text-red-500">
                No meetings configured
              </span>
            </div>
          ) : (
            <SearchableSelect
              value={selectedMeetingId || ""}
              onChange={setSelectedMeetingId}
              placeholder="Loading Meetings..."
              options={meetingsList.map((m: any) => ({
                value: m.id,
                label: m.name,
              }))}
            />
          )}
        </div>

        {!noMeetings && (
          <>
            <div className="flex shrink-0 items-center gap-2">
              <SearchableSelect
                value={selectedMember}
                onChange={setSelectedMember}
                placeholder="All Members"
                options={[
                  { value: "all", label: "All Members" },
                  ...membersList.map((m: any) => ({
                    value: m.id,
                    label: m.name,
                  })),
                ]}
              />
            </div>

            <div className="flex shrink-0 items-center gap-2">
              <SearchableSelect
                value={selectedTag}
                onChange={setSelectedTag}
                placeholder="All Tags"
                options={tagOptions}
              />
            </div>

            <div className="flex shrink-0 items-center gap-2">
              <SearchableSelect
                value={selectedProject}
                onChange={setSelectedProject}
                placeholder="All Projects"
                options={projectOptions}
              />
            </div>
          </>
        )}
      </div>

      {apiError && (
        <div className="bg-red-50 text-red-600 text-sm font-bold p-4 rounded-2xl border border-red-200 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 shrink-0" /> {apiError}
        </div>
      )}

      {noMeetings && (
        <div className="bg-orange-50 border border-orange-200 rounded-2xl p-6 flex items-start gap-4 shadow-sm">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-100 border border-orange-200 shrink-0 mt-0.5">
            <AlertTriangle className="w-5 h-5 text-orange-500" />
          </div>
          <div>
            <p className="text-sm font-bold text-orange-800">
              No meetings found
            </p>
            <p className="text-xs text-orange-600 mt-1 leading-relaxed">
              There are no daily meeting configurations available. Please ask
              your admin to configure a meeting to start viewing daily reports.
            </p>
          </div>
        </div>
      )}

      {isLoading && !noMeetings && (
        <div className="border border-[#F0EBE8] rounded-2xl shadow-sm overflow-hidden bg-white mt-4">
          <div className="p-4 border-b border-[#F0EBE8] flex justify-between items-center bg-[#FAFAFA] flex-wrap gap-3">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-2xl skeleton" />
              <div className="space-y-2">
                <div className="w-32 h-4 rounded-full skeleton" />
                <div className="w-20 h-3 rounded-full skeleton" />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-20 h-7 rounded-2xl skeleton" />
              <div className="w-24 h-7 rounded-2xl skeleton" />
              <div className="w-20 h-7 rounded-2xl skeleton" />
            </div>
          </div>
          <div className="p-4 space-y-6">
            <div className="border border-[#F0EBE8] rounded-2xl overflow-hidden shadow-sm">
              <div className="flex items-center justify-between p-3 border-b border-[#F0EBE8] bg-[#FAFAFA]">
                <div className="w-24 h-4 rounded-full skeleton" />
                <div className="w-8 h-8 rounded-xl skeleton" />
              </div>
              <div className="p-4 h-24 bg-white" />
              <div className="p-3 border-t border-[#F0EBE8] bg-[#FAFAFA] flex justify-end">
                <div className="w-32 h-9 rounded-2xl skeleton" />
              </div>
            </div>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="border border-[#F0EBE8] rounded-2xl p-4 bg-white shadow-sm flex flex-col gap-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 rounded skeleton" />
                    <div className="w-40 h-5 rounded-full skeleton" />
                    <div className="w-16 h-4 rounded-full ml-auto skeleton" />
                  </div>
                  <div className="w-48 h-3 rounded-full ml-7 skeleton" />
                  <div className="flex gap-2 ml-7">
                    <div className="w-12 h-6 rounded-lg skeleton" />
                    <div className="w-16 h-6 rounded-lg skeleton" />
                    <div className="w-16 h-6 rounded-lg skeleton" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ══ REPORTS SECTION — member cards in left col ══ */}
      {!isLoading && dailyData && !noMeetings && (
        <>
          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-4 space-y-4">
          {/* ══ Action bar: HOD filter + Select All + Save Meeting ══ */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex shrink-0 items-center gap-2">
              <SearchableSelect
                value={selectedHod}
                onChange={(value: string) => {
                  setSelectedHod(value);
                  // HOD badalne par member + project filters wapas "all" par
                  setSelectedMember("all");
                  setSelectedProject("all");
                  setReportMemberFilters({});
                  setReportProjectFilters({});
                }}
                placeholder="Select HOD"
                options={hodOptions}
              />
            </div>
            <div className="flex shrink-0 flex-wrap items-center justify-end gap-3 sm:gap-4">
              <label className="flex shrink-0 items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={areAllVisibleReportsSelected}
                  onChange={handleSelectAll}
                  className="w-4 h-4 shrink-0 rounded border-gray-300 accent-[#CE7A5A] cursor-pointer"
                />
                <span className="text-sm font-bold leading-tight text-[#1A1A1A] whitespace-nowrap">
                  Select All
                </span>
              </label>
              {isActiveDateSubmitted ? (
                <>
                  {!notesChanged && (
                    <span className="max-w-[150px] text-[11px] leading-tight text-neutral-400 font-medium italic">
                      Edit notes to enable update
                    </span>
                  )}
                  <BtnPrimary
                    icon={isSavingMeeting ? Loader2 : RefreshCw}
                    onClick={handleUpdateNotesOnly}
                    disabled={isSavingMeeting || !notesChanged}
                    loading={isSavingMeeting}
                    className="min-h-[44px] whitespace-nowrap rounded-full bg-[#6E8EEB] px-5 py-2.5 text-[13px] leading-tight hover:bg-[#5F7FE0] border-[#6E8EEB] shadow-none disabled:bg-[#9AAEF0] disabled:text-white disabled:opacity-100"
                  >
                    {isSavingMeeting ? "Updating..." : "Update Notes"}
                  </BtnPrimary>
                </>
              ) : meetingJournalId ? (
                <BtnPrimary
                  icon={isSavingMeeting ? Loader2 : RefreshCw}
                  onClick={handleUpdateMeeting}
                  disabled={isSavingMeeting}
                  loading={isSavingMeeting}
                  className="bg-blue-600 hover:bg-blue-700 border-blue-700"
                >
                  {isSavingMeeting ? "Updating..." : "Update Meeting"}
                </BtnPrimary>
              ) : (
                <BtnPrimary
                  icon={isSavingMeeting ? Loader2 : FileText}
                  onClick={handleSaveMeeting}
                  disabled={isSavingMeeting}
                  loading={isSavingMeeting}
                >
                  {isSavingMeeting ? "Saving..." : "Save Meeting"}
                </BtnPrimary>
              )}
            </div>
          </div>

          {visibleReports.length === 0 && failedMembers.length === 0 && (
            <div className="p-10 text-center text-sm font-bold text-neutral-400 bg-white border border-gray-200 rounded-2xl">
              No reports found for this selection.
            </div>
          )}

          {visibleReports.length > 0 && (
            <div>
              {/* ══ Report Cards ══ */}
              <div className="space-y-4">
                {visibleReports
                  .map((report: any) => {
                    const rId = report.journal_id || report.user_id;
                    const isExpanded = expandedReports.includes(rId);
                    const isFeedbackVisible =
                      feedbackOpenId === rId || feedbackClosingId === rId;
                    const isFeedbackClosing = feedbackClosingId === rId;
                    const isRawPending = report.status === "pending";
                    const hasDraft = !!report.daily_report;
                    const isPermanentlyChecked =
                      report.checked_in_meeting === true;
                    const draftRaw = report.daily_report?.report_data || {};

                    const rawDisplayRd = resolveRawSource(report);
                    const displayRd = normalizeReportData(rawDisplayRd);
                    const isAbsentReport = isReportAbsent(
                      report,
                      rawDisplayRd,
                      displayRd
                    );
                    const isPending = isRawPending && !isAbsentReport;
                    const absentReason = getReportAbsentReason(
                      report,
                      rawDisplayRd,
                      displayRd
                    );
                    const attendanceLabel = isAbsentReport ? "Absent" : "Present";
                    const absentReasonText =
                      isAbsentReport && absentReason.toLowerCase() !== "absent"
                        ? absentReason
                        : "";
                    const attendanceBadgeClass = isAbsentReport
                      ? "bg-red-50 text-red-700 border-red-100"
                      : "bg-green-50 text-green-700 border-green-100";

                    const normalizedReportName = (report.name || "")
                      .trim()
                      .toLowerCase();

                    const userAccomplishments =
                      displayRd.accomplishments.filter(
                        (item: any) =>
                          !item.member ||
                          String(item.member).trim().toLowerCase() ===
                          normalizedReportName
                      );

                    const userTasksIssues = displayRd.tasks_issues.filter(
                      (item: any) =>
                        !item.member ||
                        String(item.member).trim().toLowerCase() ===
                        normalizedReportName
                    );
                    const visibleTasksIssues = userTasksIssues.filter(
                      (item: any) => !isCompletedStatus(getItemStatus(item))
                    );

                    const userTomorrowPlan = displayRd.tomorrow_plan.filter(
                      (item: any) =>
                        !item.member ||
                        String(item.member).trim().toLowerCase() ===
                        normalizedReportName
                    );

                    // ── NEW LOGIC FOR SCORING ──
                    const reporteeReports = Array.isArray(report.reportee_reports)
                      ? report.reportee_reports
                      : [];
                    const hasReporteeReports = reporteeReports.length > 0;
                    const combinedAccomplishmentRows = hasReporteeReports
                      ? [
                        ...userAccomplishments.map((item: any) => ({
                          ...item,
                          member: report.name,
                        })),
                        ...reporteeReports.flatMap((reportee: any) => {
                          const reporteeRaw = resolveRawSource(reportee);
                          const reporteeData = normalizeReportData(reporteeRaw);
                          const reporteeAbsent = isReportAbsent(
                            reportee,
                            reporteeRaw,
                            reporteeData
                          );
                          if (reporteeAbsent) return [];
                          return reporteeData.accomplishments.map((item: any) => ({
                            ...item,
                            member: reportee.name || item.member,
                          }));
                        }),
                      ]
                      : userAccomplishments;
                    const combinedTasksIssueRows = hasReporteeReports
                      ? [
                        ...visibleTasksIssues.map((item: any) => ({
                          ...item,
                          member: report.name,
                        })),
                        ...reporteeReports.flatMap((reportee: any) => {
                          const reporteeRaw = resolveRawSource(reportee);
                          const reporteeData = normalizeReportData(reporteeRaw);
                          const reporteeAbsent = isReportAbsent(
                            reportee,
                            reporteeRaw,
                            reporteeData
                          );
                          if (reporteeAbsent) return [];
                          return reporteeData.tasks_issues
                            .filter((item: any) => !isCompletedStatus(getItemStatus(item)))
                            .map((item: any) => ({
                              ...item,
                              member: reportee.name || item.member,
                            }));
                        }),
                      ]
                      : visibleTasksIssues;
                    const combinedTomorrowPlanRows = hasReporteeReports
                      ? [
                        ...userTomorrowPlan.map((item: any) => ({
                          ...item,
                          member: report.name,
                        })),
                        ...reporteeReports.flatMap((reportee: any) => {
                          const reporteeRaw = resolveRawSource(reportee);
                          const reporteeData = normalizeReportData(reporteeRaw);
                          const reporteeAbsent = isReportAbsent(
                            reportee,
                            reporteeRaw,
                            reporteeData
                          );
                          if (reporteeAbsent) return [];
                          return reporteeData.tomorrow_plan.map((item: any) => ({
                            ...item,
                            member: reportee.name || item.member,
                          }));
                        }),
                      ]
                      : userTomorrowPlan;
                    const reportMemberKey = String(rId);
                    const allReportRows = [
                      ...combinedAccomplishmentRows,
                      ...combinedTasksIssueRows,
                      ...combinedTomorrowPlanRows,
                    ];
                    const getRowMemberKey = (item: any) =>
                      getMemberFilterKey(
                        item.member ||
                        item.member_name ||
                        item.name ||
                        item.email ||
                        report.name
                      );

                    // Raw per-card selections (before validating against options)
                    const selectedReportMember =
                      reportMemberFilters[reportMemberKey] || "all";
                    const selectedReportProject =
                      reportProjectFilters[reportMemberKey] || "all";
                    // Global Members filter picked a reportee of this HOD →
                    // lock this card's member filter to that reportee.
                    // (a manual pick on this card still wins)
                    const forcedReporteeMemberKey =
                      selectedReporteeMemberKey &&
                        selectedReporteeOwnerId === String(report.user_id) &&
                        selectedReportMember === "all"
                        ? selectedReporteeMemberKey
                        : null;
                    const memberScopeKey =
                      forcedReporteeMemberKey ?? selectedReportMember;

                    // Project list is scoped to the selected member — only the
                    // projects that member actually worked on stay selectable.
                    const reportProjectMap = new Map<string, string>();
                    allReportRows
                      .filter(
                        (item: any) =>
                          memberScopeKey === "all" ||
                          getRowMemberKey(item) === memberScopeKey
                      )
                      .forEach((item: any) => {
                        const projectName = getItemProjectName(item);
                        if (!projectName) return;
                        const key = projectName.toLowerCase();
                        if (!reportProjectMap.has(key))
                          reportProjectMap.set(key, projectName);
                      });
                    const reportProjectOptions = [
                      { value: "all", label: "All Projects" },
                      ...Array.from(reportProjectMap.entries()).map(
                        ([value, label]) => ({ value, label })
                      ),
                    ];
                    const activeReportProject = reportProjectOptions.some(
                      (option) => String(option.value) === String(selectedReportProject)
                    )
                      ? selectedReportProject
                      : "all";

                    // Member list is scoped to the selected project — only members
                    // who actually have items on that project stay selectable.
                    const hodMemberOption = {
                      value: getMemberFilterKey(report.name || report.email),
                      label: hasReporteeReports
                        ? `${(report.name || report.email || "HOD").trim()} (HOD)`
                        : report.name || report.email || "Member",
                    };
                    // HOD ka apna report bhi selectable rehna chahiye
                    const baseMemberOptions = hasReporteeReports
                      ? [
                        hodMemberOption,
                        ...reporteeReports.map((reportee: any) => ({
                          value: getMemberFilterKey(reportee.name || reportee.email),
                          label: reportee.name || reportee.email || "Reportee",
                        })),
                      ]
                      : [hodMemberOption];
                    const memberKeysInProject = new Set(
                      allReportRows
                        .filter(
                          (item: any) =>
                            activeReportProject === "all" ||
                            getItemProjectName(item).toLowerCase() ===
                            activeReportProject
                        )
                        .map(getRowMemberKey)
                    );
                    const scopedMemberOptions =
                      activeReportProject === "all"
                        ? baseMemberOptions
                        : baseMemberOptions.filter((option) =>
                          memberKeysInProject.has(String(option.value))
                        );
                    const reportMemberOptions = [
                      { value: "all", label: "All Members" },
                      ...scopedMemberOptions,
                    ].filter((option, index, options) =>
                      option.value === "all" ||
                      options.findIndex((item) => item.value === option.value) === index
                    );
                    // Count = jitne members dropdown mein selectable hain (HOD included)
                    const reportMemberCount = reportMemberOptions.length - 1;
                    const reportMemberOptionExists = reportMemberOptions.some(
                      (option) => String(option.value) === String(memberScopeKey)
                    );
                    const activeReportMember = reportMemberOptionExists
                      ? memberScopeKey
                      : "all";

                    const filterRowsForSelectedMember = (items: any[]) => {
                      return items.filter((item: any) => {
                        const memberName =
                          item.member || item.member_name || item.name || item.email || report.name;
                        const matchesMember =
                          activeReportMember === "all" ||
                          getMemberFilterKey(memberName) === activeReportMember;
                        const matchesTag =
                          selectedTag === "all" ||
                          getItemTagNames(item).some(
                            (tag) => tag.toLowerCase() === selectedTag
                          );
                        const itemProject = getItemProjectName(item).toLowerCase();
                        const matchesProject =
                          selectedProject === "all" || itemProject === selectedProject;
                        const matchesReportProject =
                          activeReportProject === "all" ||
                          itemProject === activeReportProject;
                        return (
                          matchesMember &&
                          matchesTag &&
                          matchesProject &&
                          matchesReportProject
                        );
                      });
                    };
                    const filteredAccomplishmentRows = filterRowsForSelectedMember(
                      combinedAccomplishmentRows
                    );
                    const filteredTasksIssueRows = filterRowsForSelectedMember(
                      combinedTasksIssueRows
                    );
                    const filteredTomorrowPlanRows = filterRowsForSelectedMember(
                      combinedTomorrowPlanRows
                    );
                    const showFilteredMemberBadges =
                      hasReporteeReports && activeReportMember === "all";

                    const sections =
                      draftRaw?.sections ||
                      rawDisplayRd?.sections ||
                      displayRd?.sections ||
                      {};
                    const kpisFallback =
                      report.kpis ||
                      rawDisplayRd?.kpis ||
                      {};

                    // Explicit strict checker to prevent `0` from failing over to fallback values
                    const getScore = (val1: any, val2: any) => {
                      if (val1 !== undefined && val1 !== null && val1 !== "")
                        return Number(val1);
                      if (val2 !== undefined && val2 !== null && val2 !== "")
                        return Number(val2);
                      return 0;
                    };

                    const kpiAchieved = isAbsentReport
                      ? 0
                      : getScore(sections.kpi_achievement, kpisFallback.score);
                    const kpiStr = `${kpiAchieved}/20`;

                    const tasksIssuesAchieved = isAbsentReport
                      ? 0
                      : getScore(
                        sections.tasks_issues_todos ?? sections.tasks_issues,
                        kpisFallback.tasks
                      );
                    const tasksIssuesStr = `${tasksIssuesAchieved}/20`;

                    const planAchieved = isAbsentReport
                      ? 0
                      : getScore(sections.planning, kpisFallback.planning);
                    const planStr = `${planAchieved}/20`;

                    const timeAchieved = getScore(
                      sections.timing,
                      kpisFallback.timing
                    );
                    const timeStr = `${timeAchieved}/20`;

                    const selfRating = isAbsentReport
                      ? 0
                      : (rawDisplayRd?.self_rating ??
                        draftRaw?.details?.self_rating ??
                        draftRaw?.sections?.self_rating ??
                        null);
                    const selfRatingText = formatSelfRating(selfRating);

                    const totalScoreValue = getReportTotalScore(
                      report,
                      rawDisplayRd
                    );
                    const totalScoreStr = Math.round(totalScoreValue ?? 0);

                    const canExpand = !isPending || hasDraft;
                    const isSelected = selectedReports.includes(rId);
                    const reportCalendar = getMemberCalendar(report);
                    const reportCalendarRow = reportCalendar.length
                      ? mergeCalendarWithFallback(reportCalendar, baseCalendarRow)
                      : dateRow;
                    const reportStatusInitial = isRawPending
                      ? "M"
                      : attendanceLabel.toLowerCase().startsWith("absent")
                        ? "A"
                        : "P";

                    return (
                      <div
                        key={rId}
                        className={cn(
                          "min-h-[92px] bg-white border border-[#D1D5DB] rounded-[14px] shadow-none overflow-hidden transition-all",
                          isSelected && "ring-1 ring-[#7AD5CC]"
                        )}
                      >
                        <div
                          className={cn(
                            "px-5 py-3 transition-colors flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between",
                            canExpand
                              ? "cursor-pointer hover:bg-[#FAFAFA]"
                              : "cursor-default"
                          )}
                          onClick={() => canExpand && toggleExpand(rId)}
                        >
                          <div className="flex items-start gap-3 pt-[1px]">
                            <input
                              type="checkbox"
                              checked={isPermanentlyChecked || isSelected}
                              disabled={isPermanentlyChecked}
                              onChange={(e) => {
                                e.stopPropagation();
                                if (isPermanentlyChecked) return;
                                setSelectedReports((prev) =>
                                  e.target.checked
                                    ? [...prev, rId]
                                    : prev.filter((id) => id !== rId)
                                );
                              }}
                              onClick={(e) => e.stopPropagation()}
                              className={cn(
                                "w-[15px] h-[15px] rounded border-[#DADDE3] accent-[#CE7A5A] shrink-0 mt-0.5",
                                isPermanentlyChecked
                                  ? "opacity-60 cursor-not-allowed"
                                  : "cursor-pointer"
                              )}
                            />
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4">
                              <div className="min-w-0">
                                <div className="flex items-center gap-2 mb-1 flex-wrap">
                                  <h3 className="font-bold text-[#202124] text-[18px] leading-[22px] truncate">
                                    {report.name}
                                  </h3>
                                  {(report.name?.includes("HOD") ||
                                    report.name?.includes("TL")) && (
                                      <span className="hidden items-center gap-1 border border-orange-200 bg-orange-50 text-orange-600 text-[10px] font-bold px-1.5 py-0.5 rounded-full shrink-0">
                                        <Crown className="w-3 h-3 fill-orange-400" />{" "}
                                        HOD
                                      </span>
                                    )}
                                  {report.department && (
                                    <span className="hidden border border-blue-200 bg-blue-50 text-blue-600 text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0">
                                      {report.department}
                                    </span>
                                  )}
                                </div>
                                <div className="hidden text-[11px] text-gray-400 mb-2 truncate">
                                  {report.email || "Report submitted"}
                                  {report.submitted_at && (
                                    <span className="ml-1">
                                      • {formatDateTime(report.submitted_at)}
                                    </span>
                                  )}
                                </div>
                                <div className="flex flex-wrap items-center gap-[8px] mt-8">
                                  <span className="h-[21px] inline-flex items-center rounded-full border border-[#EA725C] bg-white px-[10px] text-[10px] font-bold text-[#EA725C]">
                                    KPI: {kpiStr}
                                  </span>
                                  <span className="h-[21px] inline-flex items-center rounded-full border border-[#EA725C] bg-white px-[10px] text-[10px] font-bold text-[#EA725C]">
                                    Tasks, Issues &amp; Todos: {tasksIssuesStr}
                                  </span>
                                  <span className="h-[21px] inline-flex items-center rounded-full border border-[#EA725C] bg-white px-[10px] text-[10px] font-bold text-[#EA725C]">
                                    Planning: {planStr}
                                  </span>
                                  <span className="h-[21px] inline-flex items-center rounded-full border border-[#EA725C] bg-white px-[10px] text-[10px] font-bold text-[#EA725C]">
                                    Timing: {timeStr}
                                  </span>
                                </div>
                              </div>

                              <div className="flex flex-wrap items-center gap-[12px] shrink-0">
                                <span className="flex h-[21px] w-[21px] items-center justify-center rounded-full border border-[#39CFC5] bg-[#DDF8F3] text-[10px] font-bold text-[#088F86]">
                                  {reportStatusInitial}
                                </span>
                                {/* Not submitted → "Missed", never Absent/Present */}
                                {isRawPending && (
                                  <span className="flex h-[19px] min-w-[96px] items-center justify-center rounded-full bg-red-50 px-4 text-[9px] font-extrabold uppercase text-red-600 shrink-0">
                                    Not Submitted
                                  </span>
                                )}
                                {/* Attendance is only meaningful for a submitted report —
                                    never tag a non-submitted member as Absent/Present */}
                                {!isRawPending && (
                                  <>
                                <span className="flex h-[19px] min-w-[96px] items-center justify-center rounded-full bg-[#72CFC5] px-4 text-[9px] font-extrabold uppercase text-white shrink-0">
                                      Submitted
                                    </span>
                                    <span
                                      className={cn(
                                        "hidden border text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0",
                                        attendanceBadgeClass
                                      )}
                                    >
                                      {attendanceLabel}
                                      {absentReasonText
                                        ? `: ${absentReasonText}`
                                        : ""}
                                    </span>
                                  </>
                                )}
                                {canExpand && (
                                  <button className="flex h-[26px] w-[26px] items-center justify-center rounded-full bg-[#EEF0F2] text-[#111827] shrink-0 transition-transform">
                                    <ChevronDown
                                      className={cn(
                                        "w-4 h-4 transition-transform",
                                        isExpanded && "rotate-180"
                                      )}
                                    />
                                  </button>
                                )}
                              </div>
                            </div>

                            {canExpand && reportCalendarRow.length > 0 && (
                              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-end gap-2 mt-2">
                                <span className="hidden text-[10px] text-gray-500 font-medium whitespace-nowrap">
                                  {configName}
                                </span>
                                <div className="flex items-center gap-[6px] flex-wrap">
                                  {reportCalendarRow.map(
                                    (d: any, i: number) => {
                                      const s = getCalendarDisplayStatus(
                                        d.status
                                      );
                                      return (
                                        <div
                                          key={i}
                                          className={cn(
                                            "flex h-[25px] w-[25px] items-center justify-center rounded-full border text-[9px] font-bold",
                                            s === "done" || s === "submitted"
                                              ? "bg-[#D7F8F3] text-[#078C83] border-[#33CFC4]"
                                              : s === "missed"
                                                ? "bg-[#FFE4EA] text-[#C71D3C] border-[#FF7D95]"
                                                : s === "holiday"
                                                  ? "bg-[#F3F4F6] text-[#9CA3AF] border-[#E5E7EB]"
                                                  : "bg-white text-[#9CA3AF] border-[#E5E7EB]"
                                          )}
                                        >
                                          <span className="hidden text-[8px] opacity-90 leading-none mb-0.5">
                                            {d.day ? d.day.charAt(0) : ""}
                                          </span>
                                          <span className="leading-none">
                                            {d.date ?? ""}
                                          </span>
                                        </div>
                                      );
                                    }
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>

                        {isExpanded && canExpand && (
                          <div className="card-body-enter bg-[#FFFAF8] border-t border-[#EAE3DF]">
                            <div className="p-5 space-y-5">
                              <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-sm mb-4">
                                <span>
                                  ⭐ Self rating {selfRatingText || "0/10"}
                                </span>
                                <span className="text-gray-400">
                                  Total Score: {totalScoreStr}
                                </span>
                              </div>

                              {!isAbsentReport && displayRd.big_win && (
                                <div className="bg-amber-50 border border-amber-100 rounded-xl px-4 py-3 flex items-start gap-3">
                                  <Trophy className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                                  <div>
                                    <div className="text-[10px] font-extrabold text-amber-600 uppercase tracking-widest mb-1">
                                      Big Win 🏆
                                    </div>
                                    <p className="text-sm font-semibold text-amber-900">
                                      {displayRd.big_win}
                                    </p>
                                  </div>
                                </div>
                              )}

                              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                <p className="text-sm font-extrabold text-[#2B2F38]">
                                  Total Members: {reportMemberCount}
                                </p>
                                <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center sm:gap-3">
                                  <SearchableSelect
                                    value={activeReportMember}
                                    onChange={(value: string) => {
                                      setReportMemberFilters((prev) => ({
                                        ...prev,
                                        [reportMemberKey]: value,
                                      }));
                                      // "All Members" yahan se choose kiya to
                                      // upar wala global Members filter bhi reset
                                      if (value === "all") setSelectedMember("all");
                                    }}
                                    placeholder="Member"
                                    options={reportMemberOptions}
                                  />
                                  <SearchableSelect
                                    value={activeReportProject}
                                    onChange={(value: string) =>
                                      setReportProjectFilters((prev) => ({
                                        ...prev,
                                        [reportMemberKey]: value,
                                      }))
                                    }
                                    placeholder="Project"
                                    options={reportProjectOptions}
                                  />
                                </div>
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {/* Accomplishments */}
                                <div className="bg-white border border-[#E8E2DE] rounded-xl p-0 overflow-hidden">
                                  <div className="flex items-center gap-2 px-3 py-3 border-b border-[#EFE7E2]">
                                    <CheckCircle2 className="w-4 h-4 text-[#798c5e] shrink-0" />
                                    <h4 className="text-[13px] font-extrabold text-[#3E342F] tracking-[0.14em] uppercase">
                                      Accomplishments
                                    </h4>
                                  </div>
                                  <div className="p-4">
                                    {isAbsentReport
                                      ? renderAccomplishmentRows([], false)
                                      : renderAccomplishmentRows(
                                        filteredAccomplishmentRows,
                                        showFilteredMemberBadges
                                      )}
                                  </div>
                                </div>

                                {/* Tasks & Issues — 7 / 14 / 30 day range filter */}
                                <TasksIssuesTodoCard
                                  items={filteredTasksIssueRows}
                                  showMemberBadges={showFilteredMemberBadges}
                                  isAbsent={isAbsentReport}
                                  renderRows={renderAccomplishmentRows}
                                />
                                <div className="hidden bg-white border border-[#F0E8E3] rounded-xl p-4">
                                  <div className="flex items-center gap-2 mb-3 pb-2 border-b border-gray-100">
                                    <div className="w-6 h-6 rounded-lg bg-orange-100 flex items-center justify-center shrink-0">
                                      <AlertTriangle className="w-3.5 h-3.5 text-orange-600" />
                                    </div>
                                    <h4 className="text-xs font-extrabold text-neutral-700 uppercase tracking-wider">
                                      Task, Issues & To Do
                                    </h4>
                                    {visibleTasksIssues.length > 0 && (
                                      <span className="ml-auto text-[10px] font-bold text-neutral-400">
                                        {visibleTasksIssues.length}
                                      </span>
                                    )}
                                  </div>
                                  {isAbsentReport || visibleTasksIssues.length === 0 ? (
                                    <p className="text-xs text-neutral-300 italic">
                                      None recorded.
                                    </p>
                                  ) : (
                                    <div className="space-y-2">
                                      {(
                                        [
                                          {
                                            key: "overdue",
                                            label: "Overdue",
                                            statuses: ["overdue", "overdued"],
                                            colorClass: "text-red-700",
                                            headerBg:
                                              "bg-red-50 hover:bg-red-100",
                                            pillBg: "bg-red-100 text-red-700",
                                            itemBg:
                                              "bg-red-50/60 border-red-100",
                                          },
                                          {
                                            key: "in_progress",
                                            label: "In Progress",
                                            statuses: [
                                              "in_progress",
                                              "started",
                                            ],
                                            colorClass: "text-sky-700",
                                            headerBg:
                                              "bg-sky-50 hover:bg-sky-100",
                                            pillBg: "bg-sky-100 text-sky-700",
                                            itemBg:
                                              "bg-sky-50/60 border-sky-100",
                                          },
                                          {
                                            key: "open",
                                            label: "Open",
                                            statuses: [
                                              "open",
                                              "pending",
                                              "reopen",
                                              "reopened",
                                            ],
                                            colorClass: "text-slate-600",
                                            headerBg:
                                              "bg-slate-50 hover:bg-slate-100",
                                            pillBg:
                                              "bg-slate-100 text-slate-600",
                                            itemBg:
                                              "bg-slate-50/60 border-slate-100",
                                          },
                                          {
                                            key: "on_hold",
                                            label: "On Hold",
                                            statuses: ["on_hold"],
                                            colorClass: "text-orange-700",
                                            headerBg:
                                              "bg-orange-50 hover:bg-orange-100",
                                            pillBg:
                                              "bg-orange-100 text-orange-700",
                                            itemBg:
                                              "bg-orange-50/60 border-orange-100",
                                          },
                                          {
                                            key: "completed",
                                            label: "Completed",
                                            statuses: [
                                              "completed",
                                              "closed",
                                              "done",
                                            ],
                                            colorClass: "text-green-700",
                                            headerBg:
                                              "bg-green-50 hover:bg-green-100",
                                            pillBg:
                                              "bg-green-100 text-green-700",
                                            itemBg:
                                              "bg-green-50/60 border-green-100",
                                          },
                                        ] as const
                                      ).map((bucket) => {
                                        const bucketItems =
                                          visibleTasksIssues.filter((item: any) =>
                                            (
                                              bucket.statuses as readonly string[]
                                            ).includes(
                                              (
                                                item.status || "open"
                                              ).toLowerCase()
                                            )
                                          );
                                        if (bucketItems.length === 0)
                                          return null;
                                        return (
                                          <div key={bucket.key}>
                                            <div
                                              className={cn(
                                                "flex items-center gap-2 px-2 py-1.5 rounded-[6px] mb-1",
                                                bucket.headerBg
                                              )}
                                            >
                                              <span
                                                className={cn(
                                                  "text-[10px] font-black uppercase tracking-wider flex-1",
                                                  bucket.colorClass
                                                )}
                                              >
                                                {bucket.label}
                                              </span>
                                              <span
                                                className={cn(
                                                  "text-[9px] font-bold px-1.5 py-0.5 rounded-full",
                                                  bucket.pillBg
                                                )}
                                              >
                                                {bucketItems.length}
                                              </span>
                                            </div>
                                            <ul className="space-y-2.5 pl-1 mb-1">
                                              {bucketItems.map(
                                                (item: any, i: number) => {
                                                  const type =
                                                    getItemType(item);
                                                  const typePillStyle =
                                                    type === "issue"
                                                      ? "bg-red-50 text-red-700 border-red-200"
                                                      : type === "todo"
                                                        ? "bg-violet-50 text-violet-700 border-violet-200"
                                                        : type === "note"
                                                          ? "bg-blue-50 text-blue-700 border-blue-200"
                                                          : "bg-[#FFF3EE] text-[#DA7756] border-[#DA7756]/30";
                                                  const priority =
                                                    item.priority ||
                                                    item.urgency ||
                                                    "";
                                                  const priorityPill =
                                                    priority?.toLowerCase() ===
                                                      "high"
                                                      ? "bg-red-50 text-red-600 border-red-200"
                                                      : priority?.toLowerCase() ===
                                                        "medium"
                                                        ? "bg-yellow-50 text-yellow-700 border-yellow-200"
                                                        : priority?.toLowerCase() ===
                                                          "low"
                                                          ? "bg-green-50 text-green-700 border-green-200"
                                                          : "";
                                                  const taskId =
                                                    item.id ||
                                                    item.task_id ||
                                                    item.issue_id ||
                                                    item.source_id;
                                                  const dueDate =
                                                    item.target_date ||
                                                    item.due_date ||
                                                    item.end_date ||
                                                    item.deadline;
                                                  const hasDetails = ["task", "issue", "todo"].includes(type);
                                                  const matchingSourceItem = [
                                                    ...displayRd.accomplishments,
                                                    ...displayRd.tomorrow_plan,
                                                  ].find(
                                                    (sourceItem: any) =>
                                                      getItemTitle(sourceItem).trim().toLowerCase() ===
                                                        getItemTitle(item).trim().toLowerCase() &&
                                                      getViewSourceType(sourceItem) === type
                                                  );
                                                  const viewItem = {
                                                    ...matchingSourceItem,
                                                    ...item,
                                                    source_id:
                                                      item.source_id ??
                                                      item.sourceId ??
                                                      matchingSourceItem?.source_id ??
                                                      matchingSourceItem?.sourceId ??
                                                      getViewSourceId(item),
                                                    source_type:
                                                      item.source_type ??
                                                      item.sourceType ??
                                                      matchingSourceItem?.source_type ??
                                                      matchingSourceItem?.sourceType ??
                                                      type,
                                                    originalData:
                                                      item.originalData ?? matchingSourceItem?.originalData,
                                                  };

                                                  return (
                                                    <li
                                                      key={i}
                                                      onClick={hasDetails ? () => handleViewTaskIssueTodoItem(viewItem) : undefined}
                                                      className={cn(
                                                        "flex flex-col rounded-[10px] border transition-all",
                                                        bucket.itemBg,
                                                        hasDetails && "cursor-pointer hover:border-[#DA7756]/40 hover:bg-[#FFF8F5]"
                                                      )}
                                                    >
                                                      <div className="flex items-start gap-3 px-3 py-3">
                                                        {/* Type pill */}
                                                        <span
                                                          className={cn(
                                                            "shrink-0 mt-0.5 text-[9px] font-black uppercase tracking-wide px-2 py-0.5 rounded-full border",
                                                            typePillStyle
                                                          )}
                                                        >
                                                          {type}
                                                        </span>
                                                        
                                                        {/* Title & Priority */}
                                                        <div className="flex-1 min-w-0 flex flex-col gap-1">
                                                          <span className="text-[13px] font-bold text-[#0F172A] leading-snug">
                                                            {getItemTitle(item)}
                                                          </span>
                                                          {priorityPill && (
                                                            <span
                                                              className={cn(
                                                                "self-start text-[9px] font-bold px-2 py-0.5 rounded-full border",
                                                                priorityPill
                                                              )}
                                                            >
                                                              {priority}
                                                            </span>
                                                          )}
                                                        </div>

                                                        {/* View button — always shown for task/issue */}
                                                        {hasDetails && (
                                                          <button
                                                            onClick={(event) => {
                                                              event.stopPropagation();
                                                              handleViewTaskIssueTodoItem(viewItem);
                                                            }}
                                                            className="shrink-0 flex items-center justify-center w-[26px] h-[26px] rounded-[6px] bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors shadow-sm"
                                                            title={`View ${type}`}
                                                          >
                                                            <Eye className="w-3.5 h-3.5" />
                                                          </button>
                                                        )}
                                                      </div>
                                                      {/* Target date · overdue · Est · Effective time */}
                                                      <ReportItemMeta item={viewItem} />
                                                    </li>
                                                  );
                                                }
                                              )}
                                            </ul>
                                          </div>
                                        );
                                      })}
                                    </div>
                                  )}
                                </div>

                                <div className="bg-white border border-[#E8E2DE] rounded-xl p-0 overflow-hidden">
                                  <div className="flex items-center gap-2 px-3 py-3 border-b border-[#EFE7E2]">
                                    <Calendar className="w-4 h-4 text-[#6b9bcc] shrink-0" />
                                    <h4 className="text-[13px] font-extrabold text-[#3E342F] tracking-[0.14em] uppercase">
                                      Tomorrow's Plan
                                    </h4>
                                  </div>
                                  <div className="p-4">
                                    {isAbsentReport
                                      ? renderAccomplishmentRows([], false)
                                      : renderAccomplishmentRows(
                                        filteredTomorrowPlanRows,
                                        showFilteredMemberBadges
                                      )}
                                  </div>
                                </div>
                                <div className="hidden bg-white border border-[#F0E8E3] rounded-xl p-4">
                                  <div className="flex items-center gap-2 mb-3 pb-2 border-b border-gray-100">
                                    <div className="w-6 h-6 rounded-lg bg-blue-100 flex items-center justify-center shrink-0">
                                      <Calendar className="w-3.5 h-3.5 text-blue-600" />
                                    </div>
                                    <h4 className="text-xs font-extrabold text-neutral-700 uppercase tracking-wider">
                                      Tomorrow's Plan
                                    </h4>
                                  </div>
                                  {isAbsentReport || userTomorrowPlan.length === 0 ? (
                                    <p className="text-xs text-neutral-300 italic">
                                      None recorded.
                                    </p>
                                  ) : (
                                    <ul className="space-y-2">
                                      {userTomorrowPlan.map(
                                        (item: any, i: number) => {
                                          const type = (item.source_type || "note").toLowerCase();
                                          const typePillStyle =
                                            type === "issue"
                                              ? "bg-red-100 text-red-700 border-red-200"
                                              : type === "todo"
                                                ? "bg-violet-100 text-violet-700 border-violet-200"
                                                : type === "task"
                                                  ? "bg-[#FFF3EE] text-[#DA7756] border-[#DA7756]/30"
                                                  : "bg-gray-100 text-gray-600 border-gray-200";
                                          const hasDetails = ["task", "issue", "todo"].includes(type);

                                          return (
                                            <li
                                              key={i}
                                              onClick={hasDetails ? () => handleViewTaskIssueTodoItem(item) : undefined}
                                              className={cn(
                                                "flex flex-col rounded-[10px] border transition-all bg-blue-50/60 border-blue-100",
                                                hasDetails && "cursor-pointer hover:border-[#DA7756]/40 hover:bg-[#FFF8F5]"
                                              )}
                                            >
                                              <div className="flex items-center gap-2 px-3 py-2.5">
                                                <span
                                                  className={cn(
                                                    "shrink-0 text-[9px] font-black uppercase tracking-wide px-2 py-0.5 rounded-full border",
                                                    typePillStyle
                                                  )}
                                                >
                                                  {type}
                                                </span>
                                                <span className="flex-1 min-w-0 text-xs font-semibold text-neutral-800 leading-tight">
                                                  {getItemTitle(item)}
                                                </span>
                                                {hasDetails && (
                                                  <button
                                                    onClick={(event) => {
                                                      event.stopPropagation();
                                                      handleViewTaskIssueTodoItem(item);
                                                    }}
                                                    className="shrink-0 flex items-center gap-1 px-2 py-1 rounded-[6px] bg-white border border-gray-200 text-[#DA7756] hover:bg-[#FFF3EE] transition-colors shadow-sm"
                                                    title={`View ${type}`}
                                                  >
                                                    <Eye className="w-3 h-3" />
                                                  </button>
                                                )}
                                              </div>
                                              <ReportItemMeta item={item} />
                                            </li>
                                          );
                                        }
                                      )}
                                    </ul>
                                  )}
                                </div>
                              </div>

                              {false && reporteeReports.length > 0 && (
                                <div className="bg-white border border-[#F0E8E3] rounded-xl p-4">
                                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4 pb-3 border-b border-gray-100">
                                    <div className="flex items-center gap-2">
                                      <div className="w-7 h-7 rounded-lg bg-indigo-100 flex items-center justify-center shrink-0">
                                        <Users className="w-4 h-4 text-indigo-600" />
                                      </div>
                                      <div>
                                        <h4 className="text-xs font-extrabold text-neutral-700 uppercase tracking-wider">
                                          Reportee Reports
                                        </h4>
                                        <p className="text-[10px] text-neutral-400 font-medium">
                                          Reports submitted under {report.name}
                                        </p>
                                      </div>
                                    </div>
                                    <span className="self-start sm:self-auto px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-600 border border-indigo-100 text-[10px] font-bold">
                                      {reporteeReports.length} Reportee{reporteeReports.length > 1 ? "s" : ""}
                                    </span>
                                  </div>

                                  <div className="space-y-4">
                                    {reporteeReports.map((reportee: any) => {
                                      const reporteeId = reportee.journal_id || reportee.user_id;
                                      const reporteeExpandId = `reportee-${rId}-${reporteeId}`;
                                      const isReporteeExpanded = expandedReports.includes(reporteeExpandId);
                                      const reporteeRaw = resolveRawSource(reportee);
                                      const reporteeData = normalizeReportData(reporteeRaw);
                                      const reporteeAbsent = isReportAbsent(
                                        reportee,
                                        reporteeRaw,
                                        reporteeData
                                      );
                                      const reporteeAbsentReason = getReportAbsentReason(
                                        reportee,
                                        reporteeRaw,
                                        reporteeData
                                      );
                                      const reporteeSections =
                                        reportee.daily_report?.report_data?.sections ||
                                        reporteeRaw?.sections ||
                                        reporteeData?.sections ||
                                        {};
                                      const reporteeGetScore = (value: any) =>
                                        value !== undefined && value !== null && value !== ""
                                          ? Number(value)
                                          : 0;
                                      const reporteeSelfRating = reporteeAbsent
                                        ? 0
                                        : reporteeRaw?.self_rating ??
                                        reportee.daily_report?.self_rating ??
                                        null;
                                      const reporteeStatus = reportee.status || "pending";
                                      const hasReporteeDraft = !!reportee.daily_report;
                                      const reporteeIsPending =
                                        reporteeStatus === "pending" && !hasReporteeDraft;

                                      // Mirror the manager card's score chips / summary line
                                      const reporteeKpiStr = `${reporteeAbsent ? 0 : reporteeGetScore(reporteeSections.kpi_achievement)}/20`;
                                      const reporteeTasksIssuesStr = `${reporteeAbsent
                                        ? 0
                                        : reporteeGetScore(
                                          reporteeSections.tasks_issues_todos ??
                                          reporteeSections.tasks_issues
                                        )
                                        }/20`;
                                      const reporteePlanStr = `${reporteeAbsent ? 0 : reporteeGetScore(reporteeSections.planning)}/20`;
                                      const reporteeTimeStr = `${reporteeGetScore(reporteeSections.timing)}/20`;
                                      const reporteeSelfRatingText =
                                        formatSelfRating(reporteeSelfRating);
                                      const reporteeTotalScoreValue = getReportTotalScore(
                                        reportee,
                                        reporteeRaw
                                      );
                                      const reporteeTotalScoreStr =
                                        reporteeTotalScoreValue === null
                                          ? "0"
                                          : String(Math.round(reporteeTotalScoreValue));

                                      return (
                                        <div
                                          key={reporteeId}
                                          className="rounded-xl border border-indigo-100 bg-indigo-50/30 overflow-hidden"
                                        >
                                          <div
                                            className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 p-4 cursor-pointer hover:bg-indigo-50/60 transition-colors"
                                            onClick={() => toggleExpand(reporteeExpandId)}
                                          >
                                            <div className="min-w-0">
                                              <div className="flex flex-wrap items-center gap-2 mb-1">
                                                <h5 className="text-sm font-bold text-neutral-900 truncate">
                                                  {reportee.name}
                                                </h5>
                                                {reportee.department && (
                                                  <span className="border border-blue-200 bg-blue-50 text-blue-600 text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0">
                                                    {reportee.department}
                                                  </span>
                                                )}
                                                {/* Pending reportees get the "Missed" tag on the right instead */}
                                                {!reporteeIsPending && (
                                                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full border shrink-0 bg-green-50 text-green-700 border-green-100">
                                                    Submitted
                                                  </span>
                                                )}
                                              </div>
                                              <p className="text-[11px] text-neutral-400 truncate">
                                                {reportee.email || "Reportee report"}
                                                {reportee.submitted_at && (
                                                  <span className="ml-1">
                                                    - {formatDateTime(reportee.submitted_at)}
                                                  </span>
                                                )}
                                              </p>
                                            </div>

                                            <div className="flex items-center gap-2 shrink-0 self-start sm:self-center ml-auto">
                                              {/* Not submitted → "Missed"; attendance only applies to a submitted report */}
                                              {reporteeIsPending && (
                                                <span className="px-2.5 py-0.5 rounded-full border border-red-100 bg-red-50 text-red-700 text-[10px] font-bold shrink-0">
                                                  Missed
                                                </span>
                                              )}
                                              {!reporteeIsPending && (
                                                <span
                                                  className={cn(
                                                    "px-2.5 py-0.5 rounded-full border text-[10px] font-bold shrink-0",
                                                    reporteeAbsent
                                                      ? "bg-red-50 text-red-700 border-red-100"
                                                      : "bg-green-50 text-green-700 border-green-100"
                                                  )}
                                                >
                                                  {reporteeAbsent ? "Absent" : "Present"}
                                                  {reporteeAbsent &&
                                                    reporteeAbsentReason.toLowerCase() !== "absent"
                                                    ? `: ${reporteeAbsentReason}`
                                                    : ""}
                                                </span>
                                              )}

                                              <button
                                                type="button"
                                                onClick={(event) => {
                                                  event.stopPropagation();
                                                  toggleExpand(reporteeExpandId);
                                                }}
                                                className="flex items-center justify-center w-7 h-7 rounded-full bg-white text-indigo-500 border border-indigo-100 shrink-0 transition-transform"
                                              >
                                                <ChevronDown
                                                  className={cn(
                                                    "w-4 h-4 transition-transform",
                                                    isReporteeExpanded && "rotate-180"
                                                  )}
                                                />
                                              </button>
                                            </div>
                                          </div>

                                          {isReporteeExpanded && (
                                            <div className="border-t border-indigo-100 bg-white/70 p-4">
                                              {reporteeIsPending ? (
                                                <p className="text-xs text-neutral-400 italic">
                                                  Report not submitted for this date.
                                                </p>
                                              ) : (
                                                <>
                                                  {/* Same score chips + summary line as the manager card */}
                                                  <div className="flex flex-wrap items-center gap-2 mb-3">
                                                    <span className="px-2.5 py-0.5 rounded-full border border-[rgba(206,122,90,0.3)] bg-[#FFF3EE] text-[#CE7A5A] text-[10px] font-bold">
                                                      KPI: {reporteeKpiStr}
                                                    </span>
                                                    <span className="px-2.5 py-0.5 rounded-full border border-[rgba(206,122,90,0.3)] bg-[#FFF3EE] text-[#CE7A5A] text-[10px] font-bold">
                                                      Task, Issues &amp; To-do's: {reporteeTasksIssuesStr}
                                                    </span>
                                                    <span className="px-2.5 py-0.5 rounded-full border border-[rgba(206,122,90,0.3)] bg-[#FFF3EE] text-[#CE7A5A] text-[10px] font-bold">
                                                      Planning: {reporteePlanStr}
                                                    </span>
                                                    <span className="px-2.5 py-0.5 rounded-full border border-[rgba(206,122,90,0.3)] bg-[#FFF3EE] text-[#CE7A5A] text-[10px] font-bold">
                                                      Timing: {reporteeTimeStr}
                                                    </span>
                                                  </div>

                                                  <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-sm mb-4">
                                                    <span>
                                                      ⭐ Self rating {reporteeSelfRatingText || "0/10"}
                                                    </span>
                                                    <span className="text-gray-400">
                                                      Total Score: {reporteeTotalScoreStr}
                                                    </span>
                                                  </div>

                                                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                                    <div className="rounded-xl border border-gray-100 bg-white p-3">
                                                      <h6 className="text-[10px] font-extrabold text-neutral-500 uppercase tracking-wider mb-2">
                                                        Accomplishments
                                                      </h6>
                                                      {reporteeAbsent
                                                        ? renderCompactReportItems([], "None recorded.")
                                                        : renderCompactReportItems(reporteeData.accomplishments)}
                                                    </div>
                                                    <div className="rounded-xl border border-gray-100 bg-white p-3">
                                                      <h6 className="text-[10px] font-extrabold text-neutral-500 uppercase tracking-wider mb-2">
                                                        Tasks, Issues & Todos
                                                      </h6>
                                                      {reporteeAbsent
                                                        ? renderCompactReportItems([], "None recorded.")
                                                        : renderCompactReportItems(
                                                          reporteeData.tasks_issues.filter(
                                                            (item: any) =>
                                                              !isCompletedStatus(getItemStatus(item))
                                                          )
                                                        )}
                                                    </div>
                                                    <div className="rounded-xl border border-gray-100 bg-white p-3">
                                                      <h6 className="text-[10px] font-extrabold text-neutral-500 uppercase tracking-wider mb-2">
                                                        Tomorrow's Plan
                                                      </h6>
                                                      {reporteeAbsent
                                                        ? renderCompactReportItems([], "None recorded.")
                                                        : renderCompactReportItems(reporteeData.tomorrow_plan)}
                                                    </div>
                                                  </div>
                                                </>
                                              )}
                                            </div>
                                          )}
                                        </div>
                                      );
                                    })}
                                  </div>
                                </div>
                              )}

                              <div className="flex flex-wrap gap-2 pt-1">
                                <button
                                  onClick={() => openTaskModalForMember(report)}
                                  className="flex items-center gap-1.5 px-4 py-1.5 text-blue-600 bg-white border border-blue-200 rounded-full text-xs font-bold shadow-sm hover:bg-blue-50 transition-colors"
                                >
                                  <Plus className="w-3.5 h-3.5" /> Add Task
                                </button>
                                <button
                                  onClick={() =>
                                    openIssueModalForMember(report)
                                  }
                                  className="flex items-center gap-1.5 px-4 py-1.5 text-red-600 bg-white border border-red-200 rounded-full text-xs font-bold shadow-sm hover:bg-red-50 transition-colors"
                                >
                                  <Plus className="w-3.5 h-3.5" /> Stuck Issue
                                </button>
                                <button
                                  onClick={() => openTodoModalForMember(report)}
                                  className="flex items-center gap-1.5 px-4 py-1.5 text-emerald-600 bg-white border border-emerald-200 rounded-full text-xs font-bold shadow-sm hover:bg-emerald-50 transition-colors"
                                >
                                  <Plus className="w-3.5 h-3.5" /> Add Todo
                                </button>
                                <button
                                  onClick={() => toggleAddToPlan(rId)}
                                  className={cn(
                                    "flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold shadow-sm transition-colors",
                                    quickActionOpenId === rId
                                      ? "text-white bg-indigo-600 border border-indigo-700 hover:bg-indigo-700"
                                      : "text-indigo-600 bg-white border border-indigo-200 hover:bg-indigo-50"
                                  )}
                                >
                                  <Plus className="w-3.5 h-3.5" /> Add to Plan
                                </button>
                                <button
                                  onClick={() => {
                                    if (feedbackOpenId === rId) {
                                      closeFeedbackPanel(rId);
                                    } else {
                                      openFeedbackPanel(rId, report.user_id);
                                    }
                                  }}
                                  className="flex items-center gap-1.5 px-4 py-1.5 text-white bg-[#DA7756] border border-[#c96546] rounded-full text-xs font-bold shadow-sm hover:bg-[#c96546] transition-all duration-150 active:scale-95"
                                >
                                  <MessageSquare className="w-3.5 h-3.5" />{" "}
                                  Feedback
                                </button>
                              </div>

                              {/* ── Add to Tomorrow's Plan input ── */}
                              {quickActionOpenId === rId && (
                                <div className="border-t border-[#EAE3DF] pt-3 mt-2">
                                  <p className="text-[10px] font-extrabold text-neutral-400 uppercase tracking-widest mb-2">
                                    Add to Tomorrow's Plan
                                  </p>
                                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 flex-wrap">
                                    <input
                                      autoFocus
                                      value={quickActionText}
                                      onChange={(e) =>
                                        setQuickActionText(e.target.value)
                                      }
                                      onKeyDown={(e) => {
                                        if (e.key === "Enter" && !isSavingPlan)
                                          handleAddToPlan(report);
                                      }}
                                      placeholder="Enter a plan item for tomorrow..."
                                      className="w-full flex-1 min-w-0 sm:min-w-[200px] border border-gray-300 rounded-xl px-4 py-2 text-sm text-neutral-800 focus:outline-none focus:ring-2 focus:ring-[rgba(218,119,86,0.22)] placeholder:text-neutral-400"
                                    />
                                    <button
                                      onClick={() => handleAddToPlan(report)}
                                      disabled={
                                        isSavingPlan || !quickActionText.trim()
                                      }
                                      className="flex items-center gap-1.5 px-5 py-2 rounded-xl text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 transition-colors shadow-sm disabled:opacity-60 disabled:cursor-not-allowed"
                                    >
                                      {isSavingPlan ? (
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                      ) : (
                                        <Plus className="w-4 h-4" />
                                      )}
                                      Add
                                    </button>
                                    <button
                                      onClick={() => {
                                        setQuickActionOpenId(null);
                                        setQuickActionText("");
                                      }}
                                      className="px-5 py-2 rounded-xl text-sm font-bold text-neutral-700 bg-white border border-gray-300 hover:bg-gray-50 transition-colors shadow-sm"
                                    >
                                      Cancel
                                    </button>
                                  </div>
                                </div>
                              )}

                              {/* ── 2-COLUMN FEEDBACK BLOCK ── */}
                              {isFeedbackVisible && (
                                <div
                                  className={cn(
                                    "border-t border-[#EAE3DF] pt-3 mt-2",
                                    isFeedbackClosing
                                      ? "feedback-panel-exit pointer-events-none"
                                      : "feedback-panel-enter"
                                  )}
                                >
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    {/* COLUMN 1: Add New Feedback */}
                                    <div className="h-full rounded-xl border border-gray-100 bg-white p-3 shadow-sm">
                                      <div className="flex items-center gap-2 mb-3">
                                        <div className="w-7 h-7 rounded-lg bg-orange-50 flex items-center justify-center">
                                          <MessageSquare className="w-3.5 h-3.5 text-[#DA7756]" />
                                        </div>
                                        <div>
                                          <p className="text-xs font-bold text-gray-900 leading-none">
                                            Provide Feedback
                                          </p>
                                          <p className="text-[10px] font-medium text-gray-400 mt-0.5">
                                            Share rating and feedback
                                          </p>
                                        </div>
                                      </div>
                                      <div className="rounded-lg border border-gray-100 bg-gray-50/70 px-3 py-2 mb-2">
                                        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">
                                          Rating
                                        </p>
                                        <div className="flex items-center gap-1">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                          <button
                                            key={star}
                                            type="button"
                                            onClick={() =>
                                              setFeedbackRating(star)
                                            }
                                            className="rounded-lg transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-[#DA7756]/20"
                                          >
                                            <svg
                                              className="w-6 h-6"
                                              viewBox="0 0 24 24"
                                              fill={
                                                star <= feedbackRating
                                                  ? "#ffb000"
                                                  : "none"
                                              }
                                              stroke={
                                                star <= feedbackRating
                                                  ? "#ffb000"
                                                  : "#CBD5E1"
                                              }
                                              strokeWidth="1.5"
                                            >
                                              <path
                                                strokeLinejoin="round"
                                                d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.562.562 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
                                              />
                                            </svg>
                                          </button>
                                        ))}
                                        </div>
                                      </div>
                                      <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                                        Feedback Message
                                      </p>
                                      <textarea
                                        autoFocus
                                        value={feedbackMessage}
                                        onChange={(e) =>
                                          setFeedbackMessage(e.target.value)
                                        }
                                        placeholder="Enter constructive feedback..."
                                        rows={3}
                                        className="w-full min-h-[68px] resize-none rounded-lg border border-[#F0E8E3] bg-[#FFFCFA] px-3 py-2 text-xs text-neutral-800 placeholder:text-gray-400 shadow-sm outline-none transition-all focus:border-[#DA7756] focus:ring-2 focus:ring-[#DA7756]/15"
                                      />
                                      <div className="flex items-center gap-2 mt-3">
                                        <button
                                          onClick={async () => {
                                            if (feedbackRating === 0) {
                                              toast.error(
                                                "Please select a star rating!"
                                              );
                                              return;
                                            }
                                            try {
                                              const loggedInUserId =
                                                localStorage.getItem(
                                                  "userId"
                                                ) || "";
                                              const payload = {
                                                resource_type: "User",
                                                resource_id: report.user_id,
                                                rating_from_id: loggedInUserId,
                                                score: feedbackRating,
                                                reviews: feedbackMessage,
                                                positive_opening: "",
                                                constructive_feedback: "",
                                                positive_closing: "",
                                              };
                                              const res = await fetch(
                                                `${getBaseUrl()}/ratings`,
                                                {
                                                  method: "POST",
                                                  headers: {
                                                    ...getAuthHeaders(),
                                                    "Content-Type":
                                                      "application/json",
                                                  },
                                                  body: JSON.stringify(payload),
                                                }
                                              );
                                              if (!res.ok)
                                                throw new Error(
                                                  `HTTP ${res.status}`
                                                );
                                              toast.success("Feedback added!");
                                              closeFeedbackPanel(rId);
                                              await loadDailyData(false);
                                            } catch (err: any) {
                                              toast.error(
                                                "Error adding feedback: " +
                                                err.message
                                              );
                                            }
                                          }}
                                          className="inline-flex h-8 flex-1 items-center justify-center rounded-full bg-[#DA7756] px-4 text-xs font-bold text-white shadow-sm transition-colors hover:bg-[#c96546]"
                                        >
                                          Submit Feedback
                                        </button>
                                        <button
                                          onClick={() => {
                                            closeFeedbackPanel(rId);
                                          }}
                                          className="inline-flex h-8 items-center justify-center rounded-full border border-gray-200 bg-white px-4 text-xs font-bold text-neutral-700 shadow-sm transition-all duration-150 hover:bg-gray-50 active:scale-95"
                                        >
                                          Cancel
                                        </button>
                                      </div>
                                    </div>

                                    {/* COLUMN 2: Recent Feedbacks — sorted newest first */}
                                    <div className="h-full bg-white rounded-xl p-2.5 border border-gray-100 shadow-sm w-full flex flex-col">
                                      <div className="flex h-8 items-center justify-between gap-2">
                                        <div className="flex items-center gap-2">
                                          <div className="w-6 h-6 rounded-lg bg-purple-50 flex items-center justify-center">
                                            <Star className="w-3 h-3 text-purple-500" />
                                          </div>
                                          <p className="text-xs font-bold text-gray-900">
                                            Recent Feedbacks
                                          </p>
                                        </div>
                                        <button
                                          onClick={handleFeedback}
                                          className="inline-flex h-7 items-center gap-1 rounded-full px-2 text-[11px] font-bold text-[#DA7756] hover:bg-orange-50"
                                        >
                                          View All{" "}
                                          <ChevronRight className="w-3 h-3" />
                                        </button>
                                      </div>

                                      {isFetchingFeedbacks ? (
                                        <div className="flex justify-center items-center h-full py-6">
                                          <Loader2 className="w-6 h-6 animate-spin text-purple-500" />
                                        </div>
                                      ) : fetchedFeedbacks.length === 0 ? (
                                        <div className="flex flex-col items-center justify-center h-full py-6 text-neutral-400">
                                          <MessageSquare className="w-8 h-8 opacity-20 mb-2" />
                                          <span className="text-xs font-medium italic">
                                            No past feedback found.
                                          </span>
                                        </div>
                                      ) : (
                                        <div className="mt-2 space-y-2">
                                          {/* Already sorted newest-first in loadPastFeedbacks */}
                                          {fetchedFeedbacks
                                            .slice(0, 3)
                                            .map((fb: any, idx: number) => (
                                              <div
                                                key={fb.id ?? idx}
                                                className="bg-gray-50/80 px-2.5 py-2 rounded-lg border border-gray-100 shadow-sm"
                                              >
                                                <div className="flex items-center gap-1 mb-1.5">
                                                  {[1, 2, 3, 4, 5].map(
                                                    (star) => (
                                                      <Star
                                                        key={star}
                                                        className={cn(
                                                          "w-3 h-3",
                                                          star <= fb.score
                                                            ? "text-yellow-400 fill-yellow-400"
                                                            : "text-gray-200"
                                                        )}
                                                      />
                                                    )
                                                  )}
                                                  {fb.created_at && (
                                                    <span className="text-[9px] text-gray-400 ml-auto font-medium whitespace-nowrap">
                                                      {new Date(
                                                        fb.created_at
                                                      ).toLocaleDateString(
                                                        "en-IN",
                                                        {
                                                          day: "numeric",
                                                          month: "short",
                                                          year: "2-digit",
                                                        }
                                                      )}
                                                    </span>
                                                  )}
                                                </div>
                                                {fb.reviews ? (
                                                  <p className="text-xs text-neutral-700 leading-relaxed">
                                                    {fb.reviews}
                                                  </p>
                                                ) : (
                                                  <p className="text-xs text-neutral-400 italic">
                                                    No review provided.
                                                  </p>
                                                )}
                                                {fb.reviewer && (
                                                  <p className="text-[9px] text-neutral-400 mt-1 font-semibold">
                                                    — {fb.reviewer.trim()}
                                                  </p>
                                                )}
                                              </div>
                                            ))}
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
              </div>
            </div>
          )}
          </div>
        </>
      )}

      {/* ══ FULL WIDTH — Team members who failed to submit ══ */}
      {failedMembers.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 font-bold text-sm">
              <AlertTriangle className="w-4 h-4 text-[#DA7756]" />
              <span>Team members who failed to submit</span>
            </div>
            <span className="text-sm font-bold text-neutral-500">
              {failedMembers.length}
            </span>
          </div>
          <div className="space-y-4">
            {failedMembers.map((member: any, i: number) => {
              const missedId = `missed-${member.id || member.user_id || member.name || i}`;
              const isMissedExpanded = expandedReports.includes(missedId);
              const isMissedFeedbackVisible =
                feedbackOpenId === missedId || feedbackClosingId === missedId;
              const isMissedFeedbackClosing = feedbackClosingId === missedId;
              const missedMemberData = normalizeReportData(
                resolveRawSource(member)
              );
              const missedTomorrowPlan = missedMemberData.tomorrow_plan;
              const missedMemberCalendar = getMemberCalendar(member);
              const missedMemberCalendarRow = missedMemberCalendar.length
                ? mergeCalendarWithFallback(
                    missedMemberCalendar,
                    baseCalendarRow
                  )
                : dateRow;

              return (
                <div
                  key={missedId}
                  className="min-h-[92px] bg-white border border-[#D1D5DB] rounded-[14px] shadow-none overflow-hidden transition-all"
                >
                  <div
                    className="px-5 py-3 transition-colors flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between cursor-pointer hover:bg-[#FAFAFA]"
                    onClick={() => toggleExpand(missedId)}
                  >
                    <div className="flex items-start gap-3 pt-[1px]">
                      <input
                        type="checkbox"
                        checked
                        readOnly
                        disabled
                        className="w-[15px] h-[15px] rounded border-[#DADDE3] accent-[#CE7A5A] shrink-0 mt-0.5 opacity-60 cursor-not-allowed"
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4">
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <h3 className="font-bold text-[#202124] text-[18px] leading-[22px] truncate">
                              {member.name || member}
                            </h3>
                            {member.department && (
                              <span className="hidden border border-blue-200 bg-blue-50 text-blue-600 text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0">
                                {member.department}
                              </span>
                            )}
                          </div>
                          <div className="hidden text-[11px] text-gray-400 mb-2 truncate">
                            {member.email ||
                              "Report not submitted for this date"}
                          </div>
                          <div className="flex flex-wrap items-center gap-[8px] mt-8">
                            <span className="h-[21px] inline-flex items-center rounded-full border border-[#EA725C] bg-white px-[10px] text-[10px] font-bold text-[#EA725C]">
                              KPI: 0/20
                            </span>
                            <span className="h-[21px] inline-flex items-center rounded-full border border-[#EA725C] bg-white px-[10px] text-[10px] font-bold text-[#EA725C]">
                              Tasks, Issues &amp; Todos: 0/20
                            </span>
                            <span className="h-[21px] inline-flex items-center rounded-full border border-[#EA725C] bg-white px-[10px] text-[10px] font-bold text-[#EA725C]">
                              Planning: 0/20
                            </span>
                            <span className="h-[21px] inline-flex items-center rounded-full border border-[#EA725C] bg-white px-[10px] text-[10px] font-bold text-[#EA725C]">
                              Timing: 0/20
                            </span>
                          </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-[12px] shrink-0">
                          <span className="flex h-[21px] w-[21px] items-center justify-center rounded-full border border-[#39CFC5] bg-[#DDF8F3] text-[10px] font-bold text-[#088F86]">
                            M
                          </span>
                          <span className="flex h-[19px] min-w-[96px] items-center justify-center rounded-full bg-red-50 px-4 text-[9px] font-extrabold uppercase text-red-600 shrink-0">
                            Not Submitted
                          </span>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleExpand(missedId);
                            }}
                            className="flex h-[26px] w-[26px] items-center justify-center rounded-full bg-[#EEF0F2] text-[#111827] shrink-0 transition-transform"
                          >
                            <ChevronDown
                              className={cn(
                                "w-4 h-4 transition-transform",
                                isMissedExpanded && "rotate-180"
                              )}
                            />
                          </button>
                        </div>
                      </div>

                      {missedMemberCalendarRow.length > 0 && (
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-end gap-2 mt-2">
                          <span className="hidden text-[10px] text-gray-500 font-medium whitespace-nowrap">
                            {configName}
                          </span>
                          <div className="flex items-center gap-[6px] flex-wrap">
                            {missedMemberCalendarRow.map(
                              (d: any, dateIndex: number) => {
                                const s =
                                  d.full_date === activeDate
                                    ? "missed"
                                    : getCalendarDisplayStatus(d.status);

                                return (
                                  <div
                                    key={dateIndex}
                                    className={cn(
                                      "flex h-[25px] w-[25px] items-center justify-center rounded-full border text-[9px] font-bold",
                                      s === "done" || s === "submitted"
                                        ? "bg-[#D7F8F3] text-[#078C83] border-[#33CFC4]"
                                        : s === "missed"
                                          ? "bg-[#FFE4EA] text-[#C71D3C] border-[#FF7D95]"
                                          : s === "holiday"
                                            ? "bg-[#F3F4F6] text-[#9CA3AF] border-[#E5E7EB]"
                                            : "bg-white text-[#9CA3AF] border-[#E5E7EB]"
                                    )}
                                  >
                                    <span className="hidden text-[8px] opacity-90 leading-none mb-0.5">
                                      {d.day ? d.day.charAt(0) : ""}
                                    </span>
                                    <span className="leading-none">
                                      {d.date ?? ""}
                                    </span>
                                  </div>
                                );
                              }
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  {isMissedExpanded && (
                    <div className="card-body-enter bg-[#FFFAF8] border-t border-[#EAE3DF]">
                      <div className="p-5 space-y-5">
                        <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-sm mb-4">
                          <span>⭐ Self rating 0/10</span>
                          <span className="text-gray-400">Total Score: 0</span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          {/* Accomplishments */}
                          <div className="bg-white border border-[#E8E2DE] rounded-xl p-0 overflow-hidden">
                            <div className="flex items-center gap-2 px-3 py-3 border-b border-[#EFE7E2]">
                              <div className="w-5 h-5 rounded-full border border-[#252A31] flex items-center justify-center shrink-0">
                                <CheckCircle2 className="w-3.5 h-3.5 text-[#252A31]" />
                              </div>
                              <h4 className="text-[13px] font-extrabold text-[#3E342F] tracking-[0.14em] uppercase">
                                Accomplishments
                              </h4>
                            </div>
                            <div className="p-2">
                              {renderAccomplishmentRows([], false)}
                            </div>
                          </div>

                          {/* Task, Issues & To Do */}
                          <div className="bg-white border border-[#E8E2DE] rounded-xl p-0 overflow-hidden">
                            <div className="flex items-center gap-2 px-3 py-3 border-b border-[#EFE7E2]">
                              <NotepadText className="w-4 h-4 shrink-0 text-[#252A31]" />
                              <h4 className="text-[13px] font-extrabold text-[#3E342F] tracking-[0.14em] uppercase">
                                Task, Issues &amp; To Do (0)
                              </h4>
                            </div>
                            <div className="p-2">
                              {renderAccomplishmentRows([], false)}
                            </div>
                          </div>

                          {/* Tomorrow's Plan */}
                          <div className="bg-white border border-[#E8E2DE] rounded-xl p-0 overflow-hidden">
                            <div className="flex items-center gap-2 px-3 py-3 border-b border-[#EFE7E2]">
                              <div className="w-5 h-5 rounded-full border border-[#4BA3F2] flex items-center justify-center shrink-0">
                                <Calendar className="w-3.5 h-3.5 text-[#4BA3F2]" />
                              </div>
                              <h4 className="text-[13px] font-extrabold text-[#3E342F] tracking-[0.14em] uppercase">
                                Tomorrow's Plan
                              </h4>
                            </div>
                            <div className="p-2">
                              {renderAccomplishmentRows(missedTomorrowPlan, false)}
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-2 pt-1">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              openTaskModalForMember(member);
                            }}
                            className="flex items-center gap-1.5 px-4 py-1.5 text-blue-600 bg-white border border-blue-200 rounded-full text-xs font-bold shadow-sm hover:bg-blue-50 transition-colors"
                          >
                            <Plus className="w-3.5 h-3.5" /> Add Task
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              openIssueModalForMember(member);
                            }}
                            className="flex items-center gap-1.5 px-4 py-1.5 text-red-600 bg-white border border-red-200 rounded-full text-xs font-bold shadow-sm hover:bg-red-50 transition-colors"
                          >
                            <Plus className="w-3.5 h-3.5" /> Stuck Issue
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              openTodoModalForMember(member);
                            }}
                            className="flex items-center gap-1.5 px-4 py-1.5 text-emerald-600 bg-white border border-emerald-200 rounded-full text-xs font-bold shadow-sm hover:bg-emerald-50 transition-colors"
                          >
                            <Plus className="w-3.5 h-3.5" /> Add Todo
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleAddToPlan(missedId);
                            }}
                            className={cn(
                              "flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold shadow-sm transition-colors",
                              quickActionOpenId === missedId
                                ? "text-white bg-indigo-600 border border-indigo-700 hover:bg-indigo-700"
                                : "text-indigo-600 bg-white border border-indigo-200 hover:bg-indigo-50"
                            )}
                          >
                            <Plus className="w-3.5 h-3.5" /> Add to Plan
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              if (feedbackOpenId === missedId) {
                                closeFeedbackPanel(missedId);
                              } else {
                                openFeedbackPanel(
                                  missedId,
                                  member.id || member.user_id
                                );
                              }
                            }}
                            className="flex items-center gap-1.5 px-4 py-1.5 text-white bg-[#DA7756] border border-[#c96546] rounded-full text-xs font-bold shadow-sm hover:bg-[#c96546] transition-all duration-150 active:scale-95"
                          >
                            <MessageSquare className="w-3.5 h-3.5" /> Feedback
                          </button>
                        </div>

                        {quickActionOpenId === missedId && (
                          <div
                            onClick={(e) => e.stopPropagation()}
                            className="border-t border-[#EAE3DF] pt-3 mt-2"
                          >
                            <p className="text-[10px] font-extrabold text-neutral-400 uppercase tracking-widest mb-2">
                              Add to Tomorrow's Plan
                            </p>
                            <div className="flex flex-col sm:flex-row sm:items-center gap-2 flex-wrap">
                              <input
                                autoFocus
                                value={quickActionText}
                                onChange={(e) =>
                                  setQuickActionText(e.target.value)
                                }
                                onKeyDown={(e) => {
                                  if (e.key === "Enter" && !isSavingPlan) {
                                    handleAddMissedMemberPlan(member);
                                  }
                                }}
                                placeholder="Enter a plan item for tomorrow..."
                                className="w-full flex-1 min-w-0 sm:min-w-[200px] border border-gray-300 rounded-xl px-4 py-2 text-sm text-neutral-800 focus:outline-none focus:ring-2 focus:ring-[rgba(218,119,86,0.22)] placeholder:text-neutral-400"
                              />
                              <button
                                onClick={() => handleAddMissedMemberPlan(member)}
                                disabled={
                                  isSavingPlan || !quickActionText.trim()
                                }
                                className="flex items-center gap-1.5 px-5 py-2 rounded-xl text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 transition-colors shadow-sm disabled:opacity-60 disabled:cursor-not-allowed"
                              >
                                {isSavingPlan ? (
                                  <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                  <Plus className="w-4 h-4" />
                                )}
                                Add
                              </button>
                              <button
                                onClick={() => {
                                  setQuickActionOpenId(null);
                                  setQuickActionText("");
                                }}
                                className="px-5 py-2 rounded-xl text-sm font-bold text-neutral-700 bg-white border border-gray-300 hover:bg-gray-50 transition-colors shadow-sm"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        )}

                        {isMissedFeedbackVisible && (
                          <div
                            onClick={(e) => e.stopPropagation()}
                            className={cn(
                              "border-t border-[#EAE3DF] pt-3 mt-2",
                              isMissedFeedbackClosing
                                ? "feedback-panel-exit pointer-events-none"
                                : "feedback-panel-enter"
                            )}
                          >
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              <div className="h-full rounded-xl border border-gray-100 bg-white p-3 shadow-sm">
                                <div className="flex items-center gap-2 mb-3">
                                  <div className="w-7 h-7 rounded-lg bg-orange-50 flex items-center justify-center">
                                    <MessageSquare className="w-3.5 h-3.5 text-[#DA7756]" />
                                  </div>
                                  <div>
                                    <p className="text-xs font-bold text-gray-900 leading-none">
                                      Provide Feedback
                                    </p>
                                    <p className="text-[10px] font-medium text-gray-400 mt-0.5">
                                      Share rating and feedback
                                    </p>
                                  </div>
                                </div>
                                <div className="rounded-lg border border-gray-100 bg-gray-50/70 px-3 py-2 mb-2">
                                  <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">
                                    Rating
                                  </p>
                                  <div className="flex items-center gap-1">
                                  {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                      key={star}
                                      type="button"
                                      onClick={() => setFeedbackRating(star)}
                                      className="rounded-lg transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-[#DA7756]/20"
                                    >
                                      <Star
                                        className={cn(
                                          "w-6 h-6",
                                          star <= feedbackRating
                                            ? "text-[#ffb000] fill-[#ffb000]"
                                            : "text-slate-300 fill-transparent"
                                        )}
                                        strokeWidth={1.5}
                                      />
                                    </button>
                                  ))}
                                  </div>
                                </div>
                                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                                  Feedback Message
                                </p>
                                <textarea
                                  autoFocus
                                  value={feedbackMessage}
                                  onChange={(e) =>
                                    setFeedbackMessage(e.target.value)
                                  }
                                  placeholder="Enter constructive feedback..."
                                  rows={3}
                                  className="w-full min-h-[68px] resize-none rounded-lg border border-[#F0E8E3] bg-[#FFFCFA] px-3 py-2 text-xs text-neutral-800 placeholder:text-gray-400 shadow-sm outline-none transition-all focus:border-[#DA7756] focus:ring-2 focus:ring-[#DA7756]/15"
                                />
                                <div className="flex items-center gap-2 mt-3">
                                  <button
                                    onClick={async () => {
                                      if (feedbackRating === 0) {
                                        toast.error(
                                          "Please select a star rating!"
                                        );
                                        return;
                                      }

                                      const targetUserId =
                                        member.id || member.user_id;
                                      if (!targetUserId) {
                                        toast.error(
                                          "User ID not found for this member."
                                        );
                                        return;
                                      }

                                      try {
                                        const loggedInUserId =
                                          localStorage.getItem("userId") || "";
                                        const payload = {
                                          resource_type: "User",
                                          resource_id: targetUserId,
                                          rating_from_id: loggedInUserId,
                                          score: feedbackRating,
                                          reviews: feedbackMessage,
                                          positive_opening: "",
                                          constructive_feedback: "",
                                          positive_closing: "",
                                        };
                                        const res = await fetch(
                                          `${getBaseUrl()}/ratings`,
                                          {
                                            method: "POST",
                                            headers: {
                                              ...getAuthHeaders(),
                                              "Content-Type":
                                                "application/json",
                                            },
                                            body: JSON.stringify(payload),
                                          }
                                        );
                                        if (!res.ok)
                                          throw new Error(`HTTP ${res.status}`);
                                        toast.success("Feedback added!");
                                        closeFeedbackPanel(missedId);
                                        await loadDailyData(false);
                                      } catch (err: any) {
                                        toast.error(
                                          "Error adding feedback: " +
                                          err.message
                                        );
                                      }
                                    }}
                                    className="inline-flex h-8 flex-1 items-center justify-center rounded-full bg-[#DA7756] px-4 text-xs font-bold text-white shadow-sm transition-colors hover:bg-[#c96546]"
                                  >
                                    Submit Feedback
                                  </button>
                                  <button
                                    onClick={() => {
                                      closeFeedbackPanel(missedId);
                                    }}
                                    className="inline-flex h-8 items-center justify-center rounded-full border border-gray-200 bg-white px-4 text-xs font-bold text-neutral-700 shadow-sm transition-all duration-150 hover:bg-gray-50 active:scale-95"
                                  >
                                    Cancel
                                  </button>
                                </div>
                              </div>

                              <div className="h-full bg-white rounded-xl p-2.5 border border-gray-100 shadow-sm w-full flex flex-col">
                                <div className="flex h-8 items-center justify-between gap-2">
                                  <div className="flex items-center gap-2">
                                    <div className="w-6 h-6 rounded-lg bg-purple-50 flex items-center justify-center">
                                      <Star className="w-3 h-3 text-purple-500" />
                                    </div>
                                    <p className="text-xs font-bold text-gray-900">
                                      Recent Feedbacks
                                    </p>
                                  </div>
                                  <button
                                    onClick={handleFeedback}
                                    className="inline-flex h-7 items-center gap-1 rounded-full px-2 text-[11px] font-bold text-[#DA7756] hover:bg-orange-50"
                                  >
                                    View All{" "}
                                    <ChevronRight className="w-3 h-3" />
                                  </button>
                                </div>

                                {isFetchingFeedbacks ? (
                                  <div className="flex justify-center items-center h-full py-6">
                                    <Loader2 className="w-6 h-6 animate-spin text-purple-500" />
                                  </div>
                                ) : fetchedFeedbacks.length === 0 ? (
                                  <div className="flex flex-col items-center justify-center h-full py-6 text-neutral-400">
                                    <MessageSquare className="w-8 h-8 opacity-20 mb-2" />
                                    <span className="text-xs font-medium italic">
                                      No past feedback found.
                                    </span>
                                  </div>
                                ) : (
                                      <div className="mt-2 space-y-2">
                                        {fetchedFeedbacks
                                          .slice(0, 3)
                                          .map((fb: any, idx: number) => (
                                            <div
                                              key={fb.id ?? idx}
                                              className="bg-gray-50/80 px-2.5 py-2 rounded-lg border border-gray-100 shadow-sm"
                                            >
                                          <div className="flex items-center gap-1 mb-1.5">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                              <Star
                                                key={star}
                                                className={cn(
                                                  "w-3 h-3",
                                                  star <= fb.score
                                                    ? "text-yellow-400 fill-yellow-400"
                                                    : "text-gray-200"
                                                )}
                                              />
                                            ))}
                                            {fb.created_at && (
                                              <span className="text-[9px] text-gray-400 ml-auto font-medium whitespace-nowrap">
                                                {new Date(
                                                  fb.created_at
                                                ).toLocaleDateString("en-IN", {
                                                  day: "numeric",
                                                  month: "short",
                                                  year: "2-digit",
                                                })}
                                              </span>
                                            )}
                                          </div>
                                          {fb.reviews ? (
                                            <p className="text-xs text-neutral-700 leading-relaxed">
                                              {fb.reviews}
                                            </p>
                                          ) : (
                                            <p className="text-xs text-neutral-400 italic">
                                              No review provided.
                                            </p>
                                          )}
                                          {fb.reviewer && (
                                            <p className="text-[9px] text-neutral-400 mt-1 font-semibold">
                                              - {fb.reviewer.trim()}
                                            </p>
                                          )}
                                        </div>
                                      ))}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {isTaskModalOpen &&
        createPortal(
          <div className="fixed inset-0 z-[9999] flex">
            <div
              className="hidden flex-1 bg-black/40 backdrop-blur-sm sm:block"
              onClick={closeTaskModal}
            />
            <div
              className="relative flex h-full w-full flex-col bg-white shadow-2xl sm:h-auto"
              style={{ width: "min(760px, 100vw)" }}
            >
              <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-neutral-200 shrink-0">
                <h2 className="text-base font-bold text-neutral-900">
                  Add Tasks
                </h2>
                <button
                  onClick={closeTaskModal}
                  className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-gray-100 transition-colors text-neutral-500"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="h-[3px] bg-[#C72030] w-full shrink-0" />
              <div className="flex-1 overflow-y-auto">
                <ProjectTaskCreateModal
                  isEdit={false}
                  onCloseModal={closeTaskModal}
                  className="max-w-full mx-0"
                  prefillData={actionMemberPrefill}
                  opportunityId={null}
                  onSuccess={async () => {
                    closeTaskModal();
                    await loadDailyData(false);
                  }}
                  isConversion={false}
                />
              </div>
            </div>
          </div>,
          document.body
        )}

      <AddIssueModal
        openDialog={isIssueModalOpen}
        handleCloseDialog={closeIssueModal}
        preSelectedProjectId={undefined}
        prefillData={actionMemberPrefill}
      />
      <AddToDoModal
        isModalOpen={isTodoModalOpen}
        setIsModalOpen={closeTodoModal}
        getTodos={async () => {
          closeTodoModal();
          await loadDailyData(false);
        }}
        prefillData={actionMemberPrefill}
      />
      <TodoDetailsModal
        isModalOpen={isDetailsModalOpen}
        setIsModalOpen={setIsDetailsModalOpen}
        todo={selectedTodo}
      />
    </div>
  );
};

export default DailyTab;
