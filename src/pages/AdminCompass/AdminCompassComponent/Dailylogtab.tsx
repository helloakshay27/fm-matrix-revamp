// ─────────────────────────────────────────────
// DailyLogTab.jsx — Uses Daily Meeting API
// ─────────────────────────────────────────────
import React, { useState, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import {
  FileText,
  Search,
  Eye,
  RefreshCw,
  X,
  Plus,
  Star,
  CheckCircle2,
  ArrowLeft,
  ArrowRight,
  AlertTriangle,
  ChevronDown,
  ChevronRight,
  Layers,
  Circle,
  Trophy,
  Crown,
  Calendar,
} from "lucide-react";
import { cn } from "@/lib/utils";/*  */
import { getBaseUrl, getAuthHeaders } from "./Shared";
import { toast } from "sonner";
import TodoDetailsModal from "@/components/TodoDetailsModal";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import { ReportItemMeta } from "./Dailytab";

// ─────────────────────────────────────────────
// MUI z-index override 
// ─────────────────────────────────────────────
const muiHighZTheme = createTheme({ zIndex: { modal: 10001, drawer: 10001 } });
const MuiZIndexFix = ({ children }) => (
  <ThemeProvider theme={muiHighZTheme}>{children}</ThemeProvider>
);

// ─────────────────────────────────────────────
// Custom Themed Select
// ─────────────────────────────────────────────
const CustomSelect = ({
  value,
  onChange,
  options,
  placeholder = "All",
  disabled = false,
}) => {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef(null);
  const selected = options.find((o) => o.value === value);

  React.useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div
      ref={ref}
      className="relative shrink-0"
      style={{ fontFamily: "'Poppins', sans-serif" }}
    >
      <button
        type="button"
        disabled={disabled}
        onClick={() => !disabled && setOpen(!open)}
        className={cn(
          "flex items-center gap-2 bg-[#FCFAFA] border rounded-[16px] pl-4 pr-3 py-3 sm:pl-5 sm:pr-4 sm:py-3.5 transition-all min-w-[140px] sm:min-w-[160px]",
          open
            ? "border-[#EB4A4A] shadow-[0_0_0_3px_rgba(235,74,74,0.10)]"
            : "border-[#F0EBE8] hover:border-[#EB4A4A]",
          disabled && "opacity-60 cursor-not-allowed",
        )}
      >
        <span className="flex-1 text-left text-sm font-semibold truncate">
          {disabled ? (
            <span className="text-[#8C8580]">Loading…</span>
          ) : selected ? (
            <span className="text-[#1A1A1A]">{selected.label}</span>
          ) : (
            <span className="text-[#8C8580]">{placeholder}</span>
          )}
        </span>
        <ChevronDown
          className={cn(
            "w-4 h-4 transition-transform duration-200 shrink-0",
            open ? "rotate-180 text-[#EB4A4A]" : "text-[#8C8580]",
          )}
        />
      </button>

      {open && !disabled && (
        <div
          className="absolute top-full left-0 mt-1.5 z-[999] bg-white border border-[#F0EBE8] rounded-[20px] overflow-hidden min-w-full"
          style={{
            maxHeight: 240,
            overflowY: "auto",
            boxShadow:
              "0 8px 24px rgba(0,0,0,0.08), 0 2px 8px rgba(0,0,0,0.04)",
          }}
        >
          <div className="py-1.5">
            {options.map((opt) => {
              const isSelected = value === opt.value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => {
                    onChange(opt.value);
                    setOpen(false);
                  }}
                  className={cn(
                    "w-full text-left px-4 py-2.5 text-sm font-lg transition-colors flex items-center gap-2.5 group",
                    isSelected
                      ? "bg-[#FFF5F5] text-[#D37E5F]"
                      : "text-[#1A1A1A] hover:bg-[#FFF5F5] hover:text-[#D37E5F]",
                  )}
                >
                  <span
                    className={cn(
                      "w-1.5 h-1.5 rounded-full shrink-0 transition-colors",
                      isSelected
                        ? "bg-[#D37E5F]"
                        : "bg-transparent group-hover:bg-[#EB4A4A]/30",
                    )}
                  />
                  <span className="truncate flex-1">{opt.label}</span>
                  {isSelected && (
                    <span className="ml-auto shrink-0">
                      <svg
                        className="w-3 h-3 text-[#EB4A4A]"
                        viewBox="0 0 14 14"
                        fill="none"
                      >
                        <path
                          d="M2.5 7L5.5 10L11.5 4"
                          stroke="currentColor"
                          strokeWidth="1.8"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

// ─────────────────────────────────────────────
// API — Daily Meeting (replaces fetchDailyLogsFromAPI)
// ─────────────────────────────────────────────
const fetchDailyMeetingData = async ({ meetingId, dateStr }) => {
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

// ─────────────────────────────────────────────
// API — Meetings dropdown
// ─────────────────────────────────────────────
const fetchMeetingsAPI = async () => {
  const res = await fetch(`${getBaseUrl()}/daily_meeting_configs`, {
    method: "GET",
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  let json;
  try {
    json = await res.json();
  } catch {
    json = [];
  }

  let list = [];
  if (Array.isArray(json)) list = json;
  else if (Array.isArray(json.data?.daily_meeting_configs))
    list = json.data.daily_meeting_configs;
  else if (Array.isArray(json.data?.meeting_configs))
    list = json.data.meeting_configs;
  else if (Array.isArray(json.data)) list = json.data;
  else if (Array.isArray(json.daily_meeting_configs))
    list = json.daily_meeting_configs;
  else if (Array.isArray(json.meeting_configs)) list = json.meeting_configs;

  return list.map((m) => ({
    id: String(m.id),
    label: m.name ?? m.title ?? m.label ?? `Meeting ${m.id}`,
    is_default: m.is_default || m.isDefault || false,
  }));
};

// ─────────────────────────────────────────────
// API — Departments dropdown
// ─────────────────────────────────────────────
const fetchDepartmentsAPI = async () => {
  const res = await fetch(`${getBaseUrl()}/pms/departments.json`, {
    method: "GET",
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  let json;
  try {
    json = await res.json();
  } catch {
    json = [];
  }
  const list = Array.isArray(json)
    ? json
    : (json.departments ?? json.data?.departments ?? json.data ?? []);
  return list.map((d) => ({
    id: String(d.id),
    label: d.name ?? d.department_name ?? d.label ?? "",
  }));
};

// ─────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────
const fmt = (dateStr) => {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  if (isNaN(d)) return dateStr;
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const formatDateTime = (isoStr) => {
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

const scoreColor = (s, status) => {
  if (status === "pending")
    return "bg-gray-100 text-gray-500 border border-gray-200";
  return s >= 50 ? "bg-[#2ECC71] text-white" : "bg-[#EB4A4A] text-white";
};

const toRoundedScore = (...values) => {
  for (const value of values) {
    if (value === null || value === undefined || value === "") continue;
    const numericValue = Number(value);
    if (Number.isFinite(numericValue)) return Math.round(numericValue);
  }
  return 0;
};

// ─────────────────────────────────────────────
// Normalize report_data (same as DailyTab)
// ─────────────────────────────────────────────
const normalizeReportData = (rd) => {
  if (!rd || typeof rd !== "object") {
    return {
      accomplishments: [],
      tasks_issues: [],
      tomorrow_plan: [],
      big_win: null,
      self_rating: null,
      total_score: null,
      is_absent: null,
    };
  }
  let accomplishments = [];
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
  };
};

// Resolve the "true" raw source for a report (same as DailyTab)
const resolveRawSource = (report) => {
  const rd = report.report_data || {};
  const draftReport = report.daily_report || {};
  const draftRaw = draftReport.report_data || {};
  const hasDraft = !!report.daily_report;
  const hasReportData = rd && Object.keys(rd).length > 0;

  const normalizeDraftRaw = (raw) => ({
    ...raw,
    accomplishments:
      raw.accomplishments?.items ||
      (Array.isArray(raw.accomplishments) ? raw.accomplishments : []),
    self_rating:
      raw.self_rating ??
      draftReport.self_rating ??
      report.self_rating ??
      raw.details?.self_rating ??
      raw.sections?.self_rating ??
      null,
    total_score: raw.total_score ?? report.score ?? null,
    is_absent:
      raw.is_absent ??
      draftReport.is_absent ??
      raw.details?.is_absent ??
      raw.sections?.is_absent ??
      false,
  });

  const normalizeRootRaw = (raw) => ({
    ...raw,
    self_rating:
      raw.self_rating ??
      report.self_rating ??
      draftReport.self_rating ??
      raw.details?.self_rating ??
      raw.sections?.self_rating ??
      null,
    total_score:
      raw.total_score ?? report.score ?? draftRaw.total_score ?? null,
    is_absent:
      raw.is_absent ??
      draftReport.is_absent ??
      raw.details?.is_absent ??
      raw.sections?.is_absent ??
      false,
  });

  if (hasDraft) return normalizeDraftRaw(draftRaw);

  if (hasReportData && report.journal_type === "daily") {
    return normalizeRootRaw(rd);
  }

  return normalizeRootRaw(rd);
};

const isAbsentReport = (report) => {
  const rawSource = resolveRawSource(report || {});
  return [
    report?.is_absent,
    report?.daily_report?.is_absent,
    rawSource?.is_absent,
    rawSource?.details?.is_absent,
    rawSource?.sections?.is_absent,
  ].some((value) => value === true || value === "true" || value === 1);
};

const getAbsentReason = (report) => {
  const rawSource = resolveRawSource(report || {});
  const reason =
    report?.absent_reason ??
    report?.daily_report?.absent_reason ??
    rawSource?.absent_reason ??
    rawSource?.details?.absent_reason ??
    rawSource?.sections?.absent_reason ??
    "";
  return String(reason || "").trim();
};

const getMeetingNotesData = (data) => {
  if (!data) return {};
  const allReports = data.member_reports || data.reports || [];
  const meetingHeadUserId = data.config?.meeting_head?.id;
  const sourceReport =
    allReports.find(
      (report) =>
        report.user_id === meetingHeadUserId &&
        report.status === "submitted" &&
        report.report_data?.meeting_notes,
    ) ||
    allReports.find(
      (report) =>
        report.status === "submitted" && report.report_data?.meeting_notes,
    ) ||
    allReports.find((report) => report.report_data?.meeting_notes);

  return (
    data.report_data?.meeting_notes ||
    sourceReport?.report_data?.meeting_notes ||
    {}
  );
};

const getItemTitle = (item) => {
  if (!item) return "";
  if (typeof item === "string") return item;
  if (typeof item === "object")
    return String(item.title || item.name || item.text || "");
  return String(item);
};

const mergeUniqueItems = (primary = [], fallback = []) => {
  const merged = [];
  const seen = new Set();
  [...primary, ...fallback].forEach((item) => {
    const title = getItemTitle(item).trim();
    const key = title.toLowerCase();
    if (!title || seen.has(key)) return;
    seen.add(key);
    merged.push(item);
  });
  return merged;
};

const getItemType = (item) => {
  if (!item || typeof item !== "object") return "note";
  const rawType = String(
    item.source_type ||
    item.sourceType ||
    item.originalData?.source_type ||
    item.originalData?.sourceType ||
    item.type ||
    "",
  ).toLowerCase();

  if (rawType.includes("issue")) return "issue";
  if (rawType.includes("todo") || rawType.includes("to_do")) return "todo";
  if (rawType.includes("task")) return "task";

  return "note";
};

const getItemTypeLabel = (type) =>
  type === "todo"
    ? "Todo"
    : type === "issue"
      ? "Issue"
      : type === "task"
        ? "Task"
        : "Note";

const getItemTypePillClass = (type) =>
  type === "todo"
    ? "bg-purple-50 text-purple-700 border-purple-200"
    : type === "issue"
      ? "bg-red-50 text-red-600 border-red-200"
      : type === "task"
        ? "bg-orange-50 text-orange-600 border-orange-200"
        : "bg-white text-neutral-700 border-gray-200";

const getItemSourceId = (item) => {
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
  return String(rawId).replace(/^(task|issue|todo)-/i, "") || rawId;
};

const mergeTasksIssuesPreservingType = (primary = [], fallback = []) => {
  const merged = [];
  const seen = new Set();

  [...primary, ...fallback].forEach((item) => {
    const title = getItemTitle(item).trim();
    if (!title) return;

    const type = getItemType(item);
    const hasExplicitType = !!item?.type;
    const typedKey = `${title.toLowerCase()}|${type}`;
    const titleHasTypedItem = merged.some(
      (existing) =>
        getItemTitle(existing).trim().toLowerCase() === title.toLowerCase() &&
        !!existing?.type,
    );

    if (!hasExplicitType && titleHasTypedItem) return;
    if (seen.has(typedKey)) return;

    seen.add(typedKey);
    merged.push(item);
  });

  return merged;
};

const groupTasksIssuesByType = (items = []) => ({
  tasks: items.filter((item) => getItemType(item) === "task"),
  issues: items.filter((item) => getItemType(item) === "issue"),
  todos: items.filter((item) => getItemType(item) === "todo"),
});

const normalizeName = (name) =>
  String(name || "")
    .trim()
    .replace(/\s+/g, " ")
    .toLowerCase();

const getItemStatus = (item) => {
  if (!item || typeof item !== "object") return "open";
  return item.status || "open";
};

const isCompletedStatus = (status) =>
  ["closed", "completed", "done"].includes(String(status).toLowerCase());

// ─────────────────────────────────────────────
// Non-working day detection
// ─────────────────────────────────────────────
const DAY_MAP = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const checkIsNonWorkingDay = (dateStr, meetingDays) => {
  if (!dateStr || !Array.isArray(meetingDays) || meetingDays.length === 0)
    return false;
  const [y, m, d] = dateStr.split("-").map(Number);
  const dateObj = new Date(y, m - 1, d);
  if (isNaN(dateObj)) return false;
  return !meetingDays.includes(DAY_MAP[dateObj.getDay()]);
};

// ─────────────────────────────────────────────
// FormattedHighlights
// ─────────────────────────────────────────────
const FormattedHighlights = ({ text, isPending }) => {
  if (isPending) {
    return (
      <span className="text-gray-400 italic font-semibold">
        {text || "Pending"}
      </span>
    );
  }
  if (!text) return <span>-</span>;

  const matchAccChal = text.match(
    /Acc:\s*(\d+)\s*\|\s*(?:Chal|Plan):\s*(\d+)/i,
  );
  if (matchAccChal) {
    return (
      <span className="text-[13px] text-[#1A1A1A]">
        <span className="font-bold">{matchAccChal[1]}</span> accomplishments,{" "}
        <span className="font-bold">{matchAccChal[2]}</span> plan for tomorrow
      </span>
    );
  }

  return <span className="text-[13px] text-[#1A1A1A]">{text}</span>;
};

// ─────────────────────────────────────────────
// Report Detail Modal
// Uses /user_journals/:id.json — same as before
// ─────────────────────────────────────────────
const ReportDetailModal = ({ log, onClose, onReportUpdated }) => {
  const navigate = useNavigate();
  const [details, setDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedTodo, setSelectedTodo] = useState(null);

  const handleViewTaskIssueTodoItem = async (item) => {
    const sourceType = getItemType(item);
    const sourceId = getItemSourceId(item);
    const originalData = item?.originalData || item;

    if (!["task", "issue", "todo"].includes(sourceType)) return;

    if (!sourceId) {
      toast.error(`${getItemTypeLabel(sourceType)} details not found for this item.`);
      return;
    }

    if (sourceType === "todo") {
      setSelectedTodo({ ...originalData, id: sourceId });
      setIsDetailsModalOpen(true);

      try {
        const res = await fetch(`${getBaseUrl()}/todos/${sourceId}.json`, {
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
      return;
    }

    navigate(sourceType === "task" ? `/vas/tasks/${sourceId}` : `/vas/issues/${sourceId}`);
  };

  const [quickActionOpen, setQuickActionOpen] = useState(false);
  const [quickActionText, setQuickActionText] = useState("");

  // log.id is journal_id (or daily_report.id as fallback) from the meeting report
  const hasValidId = log.id && /^\d+$/.test(String(log.id));

  const refetchDetails = useCallback(
    async (silent = false) => {
      if (!hasValidId) {
        setIsLoading(false);
        return;
      }
      if (!silent) setIsLoading(true);
      try {
        const res = await fetch(
          `${getBaseUrl()}/user_journals/${log.id}.json`,
          { method: "GET", headers: getAuthHeaders() },
        );
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        const nextDetails = json?.data || json;
        setDetails((prev) =>
          nextDetails?.report_data || nextDetails?.daily_report
            ? nextDetails
            : prev || nextDetails,
        );
      } catch (error) {
        toast.error("Failed to load report details: " + error.message);
      } finally {
        if (!silent) setIsLoading(false);
      }
    },
    [log.id, hasValidId],
  );

  useEffect(() => {
    refetchDetails(false);
  }, [refetchDetails]);

  // ── Data normalization (identical to DailyTab logic) ──
  const isPending = details?.status === "pending" || log.status === "pending";
  const hasDraft = !!details?.daily_report;
  const draftRaw = details?.daily_report?.report_data || {};
  const rd = details?.report_data || {};
  const detailSource =
    details && (details.report_data || details.daily_report)
      ? {
        ...log._raw,
        ...details,
        report_data: details.report_data ?? log._raw?.report_data,
        daily_report: details.daily_report ?? log._raw?.daily_report,
      }
      : log._raw || {
        report_data: rd,
        daily_report: details?.daily_report,
      };

  const rawDisplayRd = resolveRawSource(detailSource);

  const displayRd = normalizeReportData(rawDisplayRd);
  const isDetailAbsent =
    isAbsentReport(detailSource) ||
    displayRd.is_absent === true ||
    displayRd.is_absent === "true" ||
    displayRd.is_absent === 1 ||
    log.isAbsent === true;
  const detailAbsentReason = getAbsentReason(detailSource);

  const cleanName = (log.user || "").trim();

  const filteredAccomplishments = displayRd.accomplishments.filter(
    (item) =>
      !item.member ||
      String(item.member).trim().toLowerCase() === cleanName.toLowerCase(),
  );

  const filteredTasksIssues = displayRd.tasks_issues.filter(
    (item) =>
      !item.member ||
      String(item.member).trim().toLowerCase() === cleanName.toLowerCase(),
  );
  const visibleTasksIssues = filteredTasksIssues.filter(
    (item) => !isCompletedStatus(getItemStatus(item)),
  );
  const filteredTomorrowPlan = displayRd.tomorrow_plan.filter(
    (item) =>
      !item.member ||
      String(item.member).trim().toLowerCase() === cleanName.toLowerCase(),
  );

  const sections =
    draftRaw?.sections || rawDisplayRd?.sections || rd?.sections || {};
  const kpisFallback = details?.kpis || rawDisplayRd?.kpis || {};

  const getScore = (val1, val2) => {
    if (val1 !== undefined && val1 !== null && val1 !== "") return Number(val1);
    if (val2 !== undefined && val2 !== null && val2 !== "") return Number(val2);
    return 0;
  };

  const kpiAchieved = getScore(sections.kpi_achievement, kpisFallback.score);
  const kpiMax = 20;

  const tasksAchieved = getScore(
    sections.tasks_issues_todos ?? sections.tasks_issues,
    kpisFallback.tasks,
  );
  const tasksMax = 20;

  const planAchieved = getScore(sections.planning, kpisFallback.planning);
  const planMax = 20;

  const timeAchieved = getScore(sections.timing, kpisFallback.timing);
  const timeMax = 20;

  const totalScoreStr = toRoundedScore(
    rawDisplayRd?.total_score,
    details?.score,
    log.score,
  );

  const selfRating =
    rawDisplayRd?.self_rating ??
    draftRaw?.details?.self_rating ??
    draftRaw?.sections?.self_rating ??
    null;

  // ── Update Journal (same as DailyTab's updateJournal) ──
  const updateJournal = async (patch) => {
    if (!hasValidId) {
      toast.error("Journal ID not found.");
      return false;
    }

    const rawSource = resolveRawSource(detailSource);
    const baseReportData =
      details?.daily_report?.report_data ||
      log._raw?.daily_report?.report_data ||
      details?.report_data ||
      log._raw?.report_data ||
      rawSource ||
      {};

    if (patch.tomorrow_plan_item) {
      const existingPlan = Array.isArray(baseReportData.tomorrow_plan)
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
          `${getBaseUrl()}/user_journals/${log.id}.json`,
          {
            method: "PATCH",
            headers: {
              ...getAuthHeaders(),
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              report_data: updatedReportData,
            }),
          },
        );
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        setDetails((prev) => {
          const current = prev || details || {};
          const shouldUseRootReportData =
            !!current.report_data || !current.daily_report;
          return {
            ...current,
            report_data: shouldUseRootReportData
              ? updatedReportData
              : current.report_data,
            daily_report: current.daily_report
              ? {
                ...current.daily_report,
                report_data: updatedReportData,
              }
              : current.daily_report,
          };
        });
        onReportUpdated?.(log.id, updatedReportData);
        return true;
      } catch (err) {
        toast.error("Error updating plan: " + err.message);
        return false;
      }
    }

    if (patch.self_rating !== undefined) {
      try {
        const res = await fetch(
          `${getBaseUrl()}/user_journals/${log.id}.json`,
          {
            method: "PATCH",
            headers: {
              ...getAuthHeaders(),
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              self_rating: patch.self_rating,
              report_data: { ...rawSource, self_rating: patch.self_rating },
            }),
          },
        );
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return true;
      } catch (err) {
        toast.error("Error updating rating: " + err.message);
        return false;
      }
    }

    return false;
  };

  return (
    <>
      {createPortal(
        <div
          className="fixed inset-0 z-[9990] flex items-center justify-center p-4 sm:p-6"
          style={{ fontFamily: "'Poppins', sans-serif" }}
        >
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />

          <div className="relative z-10 bg-[#FFFDFB] w-full max-w-[1220px] max-h-[90vh] shadow-2xl flex flex-col rounded-[20px] overflow-hidden border border-[#F0EBE8]">
            {/* Header */}
            <div className="px-6 py-4 border-b border-[#F0EBE8] flex items-center justify-between bg-white shrink-0">
              <h2 className="text-xl font-bold text-[#1A1A1A]">
                Daily Report Details
              </h2>
              <button
                onClick={onClose}
                className="text-gray-400 hover:bg-gray-100 hover:text-[#EB4A4A] p-2 rounded-[12px] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto">
              {isLoading ? (
                <div className="flex flex-col items-center justify-center h-60 space-y-4">
                  <RefreshCw className="w-8 h-8 text-[#CE7A5A] animate-spin" />
                  <p className="text-sm font-bold text-[#8C8580]">
                    Fetching report details...
                  </p>
                </div>
              ) : (
                <div className="flex flex-col">
                  {/* Profile section */}
                  <div className="p-4 bg-white border-b border-[#F0EBE8]">
                    <div className="flex items-start gap-4">
                      {!isDetailAbsent && (
                        <div className="flex flex-col items-center gap-1 shrink-0">
                          <div className="flex items-center justify-center w-14 h-14 rounded-full border-[2px] border-[#CE7A5A] text-[#CE7A5A] font-black text-xl bg-white">
                            {totalScoreStr}
                          </div>
                          {selfRating != null && (
                            <span className="text-[9px] font-bold text-yellow-600 bg-yellow-50 border border-yellow-200 rounded-full px-1.5 py-0.5 whitespace-nowrap">
                              ⭐ {selfRating}/10
                            </span>
                          )}
                        </div>
                      )}

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <h3 className="font-black text-[#1A1A1A] text-lg truncate">
                            {log.user}
                          </h3>
                          {(log.user?.includes("HOD") ||
                            log.user?.includes("TL")) && (
                              <span className="flex items-center gap-1 border border-orange-200 bg-orange-50 text-orange-600 text-xs font-bold px-2 py-0.5 rounded-full shrink-0">
                                <Crown className="w-3 h-3 fill-orange-400" /> HOD
                              </span>
                            )}
                          {log.dept && (
                            <span className="border border-blue-200 bg-blue-50 text-blue-600 text-xs font-bold px-2.5 py-0.5 rounded-full shrink-0">
                              {log.dept}
                            </span>
                          )}
                          <span className="text-xs font-bold text-green-700 bg-green-100 border border-green-200 px-2.5 py-0.5 rounded-full flex items-center gap-1 shrink-0">
                            <CheckCircle2 className="w-3 h-3" /> Submitted
                          </span>
                        </div>

                        <div className="text-xs font-semibold text-gray-500 mb-3 truncate">
                          {log.email}
                          {log._raw?.submitted_at && (
                            <span className="ml-2">
                              • {formatDateTime(log._raw.submitted_at)}
                            </span>
                          )}
                        </div>

                        {/* KPI Pills */}
                        <div className="flex flex-wrap items-center gap-2 mt-1">
                          {!isDetailAbsent && (
                            <>
                              <span className="px-3 py-1 rounded-full border border-[rgba(206,122,90,0.3)] bg-[#FFF3EE] text-[#CE7A5A] text-xs font-bold shadow-sm">
                                KPI: {kpiAchieved}/{kpiMax}
                              </span>
                              <span className="px-3 py-1 rounded-full border border-[rgba(206,122,90,0.3)] bg-[#FFF3EE] text-[#CE7A5A] text-xs font-bold shadow-sm">
                                Tasks, Issues & Todos: {tasksAchieved}/{tasksMax}
                              </span>
                              <span className="px-3 py-1 rounded-full border border-[rgba(206,122,90,0.3)] bg-[#FFF3EE] text-[#CE7A5A] text-xs font-bold shadow-sm">
                                Planning: {planAchieved}/{planMax}
                              </span>
                            </>
                          )}
                          <span className="px-3 py-1 rounded-full border border-[rgba(206,122,90,0.3)] bg-[#FFF3EE] text-[#CE7A5A] text-xs font-bold shadow-sm">
                            Timing: {timeAchieved}/{timeMax}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 space-y-4 bg-[#FFFAF8] flex-1">
                    {/* Status highlights */}
                    <div className="flex flex-wrap gap-3">
                      {selfRating != null && (
                        <div className="flex items-center gap-2 bg-yellow-50 border border-yellow-100 rounded-xl px-4 py-2.5 shadow-sm">
                          <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                          <span className="text-sm font-bold text-yellow-800">
                            Self Rating: {selfRating}/10
                          </span>
                        </div>
                      )}
                      {rawDisplayRd?.total_score != null && (
                        <div className="flex items-center gap-2 bg-purple-50 border border-purple-100 rounded-xl px-4 py-2.5 shadow-sm">
                          <span className="text-sm font-bold text-purple-800">
                            Total Score: {rawDisplayRd.total_score}
                          </span>
                        </div>
                      )}
                      {(isDetailAbsent ||
                        (displayRd.is_absent !== null &&
                          displayRd.is_absent !== undefined)) && (
                          <div
                            className={cn(
                              "flex items-center gap-2 rounded-xl px-4 py-2.5 border shadow-sm",
                              isDetailAbsent
                                ? "bg-red-50 border-red-100"
                                : "bg-green-50 border-green-100",
                            )}
                          >
                            <span
                              className={cn(
                                "text-sm font-bold",
                                isDetailAbsent
                                  ? "text-red-700"
                                  : "text-green-700",
                              )}
                            >
                              {isDetailAbsent
                                ? `Absent${detailAbsentReason ? `: ${detailAbsentReason}` : ""}`
                                : "Present"}
                            </span>
                          </div>
                        )}
                    </div>

                    {/* Big Win */}
                    {!isDetailAbsent && displayRd.big_win && (
                      <div className="bg-amber-50 border border-amber-100 rounded-xl px-5 py-4 flex items-start gap-3 shadow-sm">
                        <Trophy className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                        <div>
                          <div className="text-[11px] font-extrabold text-amber-600 uppercase tracking-widest mb-1.5">
                            Big Win 🏆
                          </div>
                          <p className="text-sm font-semibold text-amber-900 leading-relaxed">
                            {displayRd.big_win}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* 3-Column: Accomplishments | Tasks, Issues & Todos | Tomorrow's Plan */}
                    {!isDetailAbsent && (
                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
                        {/* Accomplishments */}
                        <div className="bg-white border border-[#F0E8E3] rounded-xl p-3 shadow-sm min-h-[210px]">
                          <div className="flex items-center gap-2 mb-2 pb-2 border-b border-gray-100">
                            <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                              <CheckCircle2 className="w-3 h-3 text-green-600" />
                            </div>
                            <h4 className="text-[11px] font-extrabold text-neutral-900 uppercase tracking-wider">
                              Accomplishments
                            </h4>
                          </div>
                          {filteredAccomplishments.length === 0 ? (
                            <p className="text-sm text-neutral-400 italic font-medium">
                              None recorded.
                            </p>
                          ) : (
                            <div className="space-y-1.5">
                              {filteredAccomplishments.map((item, i) => {
                                const type = getItemType(item);
                                const hasDetails = ["task", "issue", "todo"].includes(type);
                                return (
                                  <div
                                    key={i}
                                    className="flex flex-col rounded-[10px] border border-green-200 bg-green-50 min-h-[36px]"
                                  >
                                    <div className="flex items-center gap-2 px-2.5 py-2">
                                    <span
                                      className={cn(
                                        "shrink-0 text-[9px] font-extrabold px-2 py-0.5 rounded-full uppercase border",
                                        getItemTypePillClass(type),
                                      )}
                                    >
                                      {getItemTypeLabel(type)}
                                    </span>
                                    <span className="flex-1 min-w-0 whitespace-normal break-words text-xs font-bold leading-snug text-neutral-900">
                                      {getItemTitle(item)}
                                    </span>
                                    {hasDetails && (
                                      <button
                                        type="button"
                                        onClick={(event) => {
                                          event.stopPropagation();
                                          handleViewTaskIssueTodoItem(item);
                                        }}
                                        className="shrink-0 flex items-center gap-1 px-2 py-1 rounded-[6px] bg-white border border-gray-200 text-[#DA7756] hover:bg-[#FFF3EE] transition-colors shadow-sm"
                                        title={`View ${getItemTypeLabel(type)}`}
                                      >
                                        <Eye className="w-3 h-3" />
                                      </button>
                                    )}
                                    </div>
                                    <ReportItemMeta item={item} />
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>

                      {/* Tasks, Issues & Todos */}
                      <div className="bg-white border border-[#F0E8E3] rounded-xl p-3 shadow-sm min-h-[210px]">
                        <div className="flex items-center justify-between gap-2 mb-2 pb-2 border-b border-gray-100">
                          <div className="flex items-center gap-2 min-w-0">
                            <div className="w-5 h-5 rounded-full bg-orange-100 flex items-center justify-center shrink-0">
                              <AlertTriangle className="w-3 h-3 text-orange-600" />
                            </div>
                            <h4 className="text-[11px] font-extrabold text-neutral-900 uppercase tracking-wider truncate">
                              Task, Issues & To Do
                            </h4>
                          </div>
                          <span className="text-xs font-bold text-neutral-500 shrink-0">
                            {visibleTasksIssues.length}
                          </span>
                        </div>
                        {visibleTasksIssues.length === 0 ? (
                          <p className="text-sm text-neutral-400 italic font-medium">
                            None recorded.
                          </p>
                        ) : (
                          <div className="space-y-2">
                            {[
                              {
                                key: "overdue",
                                label: "Overdue",
                                statuses: ["overdue", "overdued"],
                                colorClass: "text-red-700",
                                headerBg: "bg-red-50 hover:bg-red-100",
                                pillBg: "bg-red-100 text-red-700",
                                itemBg: "bg-red-50/60 border-red-100",
                              },
                              {
                                key: "in_progress",
                                label: "In Progress",
                                statuses: ["in_progress", "started"],
                                colorClass: "text-sky-700",
                                headerBg: "bg-sky-50 hover:bg-sky-100",
                                pillBg: "bg-sky-100 text-sky-700",
                                itemBg: "bg-sky-50/60 border-sky-100",
                              },
                              {
                                key: "open",
                                label: "Open",
                                statuses: ["open", "pending", "reopen", "reopened"],
                                colorClass: "text-slate-600",
                                headerBg: "bg-slate-50 hover:bg-slate-100",
                                pillBg: "bg-slate-100 text-slate-600",
                                itemBg: "bg-slate-50/60 border-slate-100",
                              },
                              {
                                key: "on_hold",
                                label: "On Hold",
                                statuses: ["on_hold"],
                                colorClass: "text-orange-700",
                                headerBg: "bg-orange-50 hover:bg-orange-100",
                                pillBg: "bg-orange-100 text-orange-700",
                                itemBg: "bg-orange-50/60 border-orange-100",
                              },
                              {
                                key: "completed",
                                label: "Completed",
                                statuses: ["completed", "closed", "done"],
                                colorClass: "text-green-700",
                                headerBg: "bg-green-50 hover:bg-green-100",
                                pillBg: "bg-green-100 text-green-700",
                                itemBg: "bg-green-50/60 border-green-100",
                              },
                            ].map((section) => {
                              const sectionItems = visibleTasksIssues.filter((item) =>
                                section.statuses.includes(
                                  String(getItemStatus(item)).toLowerCase(),
                                ),
                              );
                              return sectionItems.length > 0 ? (
                                <div
                                  key={section.key}
                                  className="space-y-1.5"
                                >
                                  <div
                                    className={cn(
                                      "flex items-center gap-2 px-2 py-1.5 rounded-[6px]",
                                      section.headerBg,
                                    )}
                                  >
                                    <p
                                      className={cn(
                                        "text-[10px] font-extrabold uppercase tracking-wider flex-1",
                                        section.colorClass,
                                      )}
                                    >
                                      {section.label}
                                    </p>
                                    <span
                                      className={cn(
                                        "text-[9px] font-bold px-1.5 py-0.5 rounded-full",
                                        section.pillBg,
                                      )}
                                    >
                                      {sectionItems.length}
                                    </span>
                                  </div>
                                  {sectionItems.map((item, i) => {
                                    const type = getItemType(item);
                                    const hasDetails = ["task", "issue", "todo"].includes(type);
                                    return (
                                      <div
                                        key={`${section.key}-${i}`}
                                        onClick={hasDetails ? () => handleViewTaskIssueTodoItem(item) : undefined}
                                        className={cn(
                                          "flex flex-col rounded-lg border transition-all",
                                          section.itemBg,
                                          hasDetails && "cursor-pointer hover:border-[#DA7756]/40 hover:bg-[#FFF8F5]",
                                        )}
                                      >
                                        <div className="flex items-center gap-2 px-2.5 py-2 min-h-[36px]">
                                          <span
                                            className={cn(
                                              "shrink-0 text-[9px] font-extrabold px-2 py-0.5 rounded-full uppercase border",
                                              getItemTypePillClass(type),
                                            )}
                                          >
                                            {getItemTypeLabel(type)}
                                          </span>
                                          <span className="flex-1 min-w-0 whitespace-normal break-words text-xs font-bold leading-snug text-neutral-900">
                                            {getItemTitle(item)}
                                          </span>
                                          {hasDetails && (
                                            <button
                                              type="button"
                                              onClick={(event) => {
                                                event.stopPropagation();
                                                handleViewTaskIssueTodoItem(item);
                                              }}
                                              className="shrink-0 flex items-center gap-1 px-2 py-1 rounded-[6px] bg-white border border-gray-200 text-[#DA7756] hover:bg-[#FFF3EE] transition-colors shadow-sm"
                                              title={`View ${getItemTypeLabel(type)}`}
                                            >
                                              <Eye className="w-3 h-3" />
                                            </button>
                                          )}
                                        </div>
                                        <ReportItemMeta item={item} />
                                      </div>
                                    );
                                  })}
                                </div>
                              ) : null;
                            })}
                          </div>
                        )}
                      </div>

                        {/* Tomorrow's Plan */}
                        <div className="bg-white border border-[#F0E8E3] rounded-xl p-3 shadow-sm min-h-[210px]">
                          <div className="flex items-center gap-2 mb-2 pb-2 border-b border-gray-100">
                            <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                              <Calendar className="w-3 h-3 text-blue-600" />
                            </div>
                            <h4 className="text-[11px] font-extrabold text-neutral-900 uppercase tracking-wider">
                              Tomorrow's Plan
                            </h4>
                          </div>
                          {filteredTomorrowPlan.length === 0 ? (
                            <p className="text-sm text-neutral-400 italic font-medium">
                              None recorded.
                            </p>
                          ) : (
                            <div className="space-y-1.5">
                              {filteredTomorrowPlan.map((item, i) => {
                                const type = getItemType(item);
                                const hasDetails = ["task", "issue", "todo"].includes(type);
                                return (
                                  <div
                                    key={i}
                                    className="flex flex-col rounded-[10px] border border-blue-200 bg-blue-50 min-h-[36px]"
                                  >
                                    <div className="flex items-center gap-2 px-2.5 py-2">
                                    <span
                                      className={cn(
                                        "shrink-0 text-[9px] font-extrabold px-2 py-0.5 rounded-full uppercase border",
                                        getItemTypePillClass(type),
                                      )}
                                    >
                                      {getItemTypeLabel(type)}
                                    </span>
                                    <span className="flex-1 min-w-0 whitespace-normal break-words text-xs font-bold leading-snug text-neutral-900">
                                      {getItemTitle(item)}
                                    </span>
                                    {hasDetails && (
                                      <button
                                        type="button"
                                        onClick={(event) => {
                                          event.stopPropagation();
                                          handleViewTaskIssueTodoItem(item);
                                        }}
                                        className="shrink-0 flex items-center gap-1 px-2 py-1 rounded-[6px] bg-white border border-gray-200 text-[#DA7756] hover:bg-[#FFF3EE] transition-colors shadow-sm"
                                        title={`View ${getItemTypeLabel(type)}`}
                                      >
                                        <Eye className="w-3 h-3" />
                                      </button>
                                    )}
                                    </div>
                                    <ReportItemMeta item={item} />
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Quick Add to Plan */}
                    {!isDetailAbsent && quickActionOpen && (
                      <div className="bg-white border border-orange-100 rounded-2xl p-5 shadow-sm">
                        <p className="text-xs font-black text-orange-800 uppercase tracking-widest mb-3 flex items-center gap-2">
                          <Plus className="w-3.5 h-3.5" /> Add to Tomorrow's Plan
                        </p>
                        <div className="flex items-center gap-3">
                          <input
                            autoFocus
                            type="text"
                            value={quickActionText}
                            onChange={(e) => setQuickActionText(e.target.value)}
                            placeholder="Add item to tomorrow's plan..."
                            className="flex-1 border border-gray-300 rounded-full px-5 py-2.5 text-sm font-medium text-neutral-800 focus:outline-none focus:ring-2 focus:ring-orange-200 placeholder:text-neutral-400"
                            onKeyDown={async (e) => {
                              if (e.key === "Enter" && quickActionText.trim()) {
                                const ok = await updateJournal({
                                  tomorrow_plan_item: quickActionText.trim(),
                                });
                                if (ok) {
                                  toast.success("Added to tomorrow's plan!");
                                  setQuickActionOpen(false);
                                  setQuickActionText("");
                                  refetchDetails(true);
                                }
                              }
                              if (e.key === "Escape") {
                                setQuickActionOpen(false);
                                setQuickActionText("");
                              }
                            }}
                          />
                          <button
                            onClick={async () => {
                              if (quickActionText.trim()) {
                                const ok = await updateJournal({
                                  tomorrow_plan_item: quickActionText.trim(),
                                });
                                if (ok) {
                                  toast.success("Added to tomorrow's plan!");
                                  setQuickActionOpen(false);
                                  setQuickActionText("");
                                  refetchDetails(true);
                                }
                              }
                            }}
                            className="px-6 py-2.5 rounded-full text-sm font-bold text-white bg-orange-500 hover:bg-orange-600 transition-colors shadow-sm"
                          >
                            Add
                          </button>
                          <button
                            onClick={() => {
                              setQuickActionOpen(false);
                              setQuickActionText("");
                            }}
                            className="px-6 py-2.5 rounded-full text-sm font-bold text-neutral-600 bg-white border border-gray-300 hover:bg-gray-50 transition-colors shadow-sm"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    )}

                  </div>
                </div>
              )}
            </div>
          </div>

          <MuiZIndexFix>
            <TodoDetailsModal
              isModalOpen={isDetailsModalOpen}
              setIsModalOpen={setIsDetailsModalOpen}
              todo={selectedTodo}
            />
          </MuiZIndexFix>
        </div>,
        document.body,
      )}
    </>
  );
};

// ─────────────────────────────────────────────
// DailyLogTab — Main Component
// ─────────────────────────────────────────────
const DailyLogTab = ({
  initialDate,
  onSelectedDateChange,
  selectedMeetingId: externalSelectedMeetingId,
  onSelectedMeetingChange,
} = {}) => {
  const [selectedDate, setSelectedDate] = useState(
    () => initialDate || new Date().toISOString().split("T")[0],
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedDeptId, setSelectedDeptId] = useState("");
  const [selectedMeetingFilter, setSelectedMeetingFilter] = useState("");
  const [isGrouped, setIsGrouped] = useState(false);

  const [isNonWorkingDay, setIsNonWorkingDay] = useState(false);
  const [meetingDays, setMeetingDays] = useState([]);

  const [departments, setDepartments] = useState([]);
  const [isFetchingDepts, setIsFetchingDepts] = useState(false);

  const [meetings, setMeetings] = useState([]);
  const [isFetchingMeetings, setIsFetchingMeetings] = useState(false);

  const [apiLogs, setApiLogs] = useState([]);
  const [groupedApiLogs, setGroupedApiLogs] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState(null);

  const [metaSubmitted, setMetaSubmitted] = useState(0);
  const [metaExpected, setMetaExpected] = useState(0);

  const [selectedReport, setSelectedReport] = useState(null);

  useEffect(() => {
    if (!initialDate) return;
    setSelectedDate((currentDate) =>
      currentDate === initialDate ? currentDate : initialDate,
    );
  }, [initialDate]);

  useEffect(() => {
    onSelectedDateChange?.(selectedDate);
  }, [selectedDate, onSelectedDateChange]);

  useEffect(() => {
    if (!externalSelectedMeetingId) return;
    setSelectedMeetingFilter((current) =>
      current === externalSelectedMeetingId
        ? current
        : externalSelectedMeetingId,
    );
  }, [externalSelectedMeetingId]);

  // ── Debounce search ──
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(searchQuery), 500);
    return () => clearTimeout(t);
  }, [searchQuery]);

  // ── Load departments ──
  const loadDepartments = useCallback(async () => {
    setIsFetchingDepts(true);
    try {
      setDepartments(await fetchDepartmentsAPI());
    } catch (err) {
      console.error(err);
    } finally {
      setIsFetchingDepts(false);
    }
  }, []);

  useEffect(() => {
    loadDepartments();
  }, [loadDepartments]);

  // ── Load meetings ──
  const loadMeetings = useCallback(async () => {
    setIsFetchingMeetings(true);
    try {
      const data = await fetchMeetingsAPI();
      setMeetings(data);
      if (data.length > 0) {
        const defaultMeeting = data.find((m) => m.is_default);
        const nextMeetingId =
          externalSelectedMeetingId ||
          (defaultMeeting ? defaultMeeting.id : data[0].id);
        setSelectedMeetingFilter(nextMeetingId);
        if (!externalSelectedMeetingId)
          onSelectedMeetingChange?.(String(nextMeetingId));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsFetchingMeetings(false);
    }
  }, [externalSelectedMeetingId]);

  useEffect(() => {
    loadMeetings();
  }, [loadMeetings]);

  // ── Load data from daily_meeting API ──
  const loadData = useCallback(async () => {
    if (!selectedMeetingFilter) return;
    setIsLoading(true);
    setApiError(null);

    try {
      const json = await fetchDailyMeetingData({
        meetingId: selectedMeetingFilter,
        dateStr: selectedDate,
      });

      const data = json.data || json;

      // Non-working day detection
      const configDays = data?.config?.meeting_days ?? [];
      setMeetingDays(configDays);
      setIsNonWorkingDay(checkIsNonWorkingDay(selectedDate, configDays));

      // Show logs only for saved meetings; member draft data can remain after a meeting is deleted.
      const allReports = data?.member_reports || data?.reports || [];
      const meetingNotesData = getMeetingNotesData(data);
      const detailedReports = Array.isArray(meetingNotesData?.detailed_reports)
        ? meetingNotesData.detailed_reports
        : [];
      const meetingNotesMissedMembers = Array.isArray(
        meetingNotesData?.missed_report_members,
      )
        ? meetingNotesData.missed_report_members
        : [];
      const rootMissedMembers = Array.isArray(data?.missed_members)
        ? data.missed_members
        : [];
      const missedCount =
        meetingNotesMissedMembers.length ||
        rootMissedMembers.length ||
        allReports.filter(
          (report) => report.status === "pending" || report.status === "missed",
        ).length;
      const hasSavedMeetingData =
        !!data?.report_data?.meeting_notes || detailedReports.length > 0;

      if (!hasSavedMeetingData) {
        setApiLogs([]);
        setGroupedApiLogs({});
        setMetaSubmitted(0);
        setMetaExpected(data?.total_members ?? 0);
        return;
      }

      const detailedReportUserIds = new Set(
        detailedReports
          .map((report) => Number(report.user_id))
          .filter((id) => Number.isFinite(id) && id > 0),
      );
      const detailedReportNames = new Set(
        detailedReports
          .map((report) => normalizeName(report.name))
          .filter(Boolean),
      );

      const submittedReports =
        detailedReports.length > 0
          ? allReports.filter(
            (report) =>
              detailedReportUserIds.has(Number(report.user_id)) ||
              detailedReportNames.has(normalizeName(report.name)),
          )
          : allReports.filter(
            (r) =>
              r.status !== "pending" || !!r.daily_report,
          );

      // Map to table row format
      let logsArray = submittedReports.map((report) => {
        const rawRd = resolveRawSource(report);
        const rd = normalizeReportData(rawRd);
        const isAbsent = isAbsentReport(report);
        const absentReason = getAbsentReason(report);

        // Build highlights summary from accomplishments and tomorrow plan counts
        const highlights = isAbsent
          ? `Absent${absentReason ? `: ${absentReason}` : ""}`
          : rd.accomplishments.length > 0 || rd.tomorrow_plan.length > 0
            ? `Acc: ${rd.accomplishments.length} | Plan: ${rd.tomorrow_plan.length}`
            : "";

        return {
          // journal_id is null for draft-only members; fall back to daily_report.id
          id: report.journal_id || report.daily_report?.id || report.id,
          user: report.name || "",
          email: report.email || "",
          score: toRoundedScore(rawRd?.total_score, report.score),
          dept: report.department || "",
          highlights,
          submittedAt: report.submitted_at
            ? formatDateTime(report.submitted_at)
            : "—",
          status: report.status,
          isAbsent,
          absentReason,
          date: selectedDate,
          userId: report.user_id,
          _raw: report,
        };
      });

      if (logsArray.length === 0 && detailedReports.length > 0) {
        logsArray = detailedReports.map((report) => {
          const matchingMemberReport =
            allReports.find(
              (memberReport) =>
                Number(memberReport.user_id) === Number(report.user_id),
            ) ||
            allReports.find(
              (memberReport) =>
                normalizeName(memberReport.name) === normalizeName(report.name),
            );
          const hydratedReport = matchingMemberReport || {
            report_data: report,
            status: "submitted",
            user_id: report.user_id,
            name: report.name,
          };
          const rawRd = resolveRawSource(hydratedReport);
          const rd = normalizeReportData(rawRd);
          const isAbsent = isAbsentReport(hydratedReport);
          const absentReason = getAbsentReason(hydratedReport);
          const accomplishments = rd.accomplishments;
          const tomorrowPlan = rd.tomorrow_plan;
          const reportSelfRating =
            Number(String(report.self_rating || "0").split("/")[0]) || 0;

          return {
            id:
              hydratedReport.journal_id ||
              hydratedReport.daily_report?.id ||
              hydratedReport.id ||
              report.user_id ||
              report.name ||
              selectedDate,
            user: hydratedReport.name || report.name || "",
            email: hydratedReport.email || "",
            score: toRoundedScore(
              rawRd?.total_score,
              hydratedReport.score,
              reportSelfRating,
            ),
            dept: hydratedReport.department || "",
            highlights: isAbsent
              ? `Absent${absentReason ? `: ${absentReason}` : ""}`
              : accomplishments.length > 0 || tomorrowPlan.length > 0
                ? `Acc: ${accomplishments.length} | Plan: ${tomorrowPlan.length}`
                : "",
            submittedAt: "—",
            status: "submitted",
            isAbsent,
            absentReason,
            date: selectedDate,
            userId: hydratedReport.user_id || report.user_id,
            _raw: hydratedReport,
          };
        });
      }

      // Dept filter
      if (selectedDeptId) {
        logsArray = logsArray.filter(
          (log) =>
            String(log._raw?.department_id) === String(selectedDeptId) ||
            log.dept === selectedDeptId,
        );
      }

      // Search filter
      if (debouncedSearch) {
        const q = debouncedSearch.toLowerCase();
        logsArray = logsArray.filter(
          (log) =>
            (log.user && log.user.toLowerCase().includes(q)) ||
            (log.email && log.email.toLowerCase().includes(q)) ||
            (log.dept && log.dept.toLowerCase().includes(q)),
        );
      }

      if (isGrouped) {
        const grouped = logsArray.reduce((acc, log) => {
          const d = log.dept || "Uncategorized";
          if (!acc[d]) acc[d] = [];
          acc[d].push(log);
          return acc;
        }, {});
        setGroupedApiLogs(grouped);
        setApiLogs([]);
      } else {
        setApiLogs(logsArray);
        setGroupedApiLogs({});
      }

      setMetaSubmitted(logsArray.length);
      setMetaExpected(missedCount);
    } catch (err) {
      setApiError(err.message);
      setApiLogs([]);
      setGroupedApiLogs({});
      setMetaSubmitted(0);
      setMetaExpected(0);
      setIsNonWorkingDay(false);
      toast.error(`Failed to load reports: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  }, [
    selectedDate,
    selectedMeetingFilter,
    isGrouped,
    selectedDeptId,
    debouncedSearch,
  ]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const shiftDate = (n) => {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() + n);
    setSelectedDate(d.toISOString().split("T")[0]);
  };

  const titleDate = (() => {
    const d = new Date(selectedDate);
    if (isNaN(d)) return selectedDate;
    return `${d.toLocaleDateString("en-US", { month: "short" })} ${d.getDate()} (${d.toLocaleDateString("en-US", { weekday: "short" })})`;
  })();

  const flatFiltered = Array.isArray(apiLogs) ? apiLogs : [];
  const sortedDepts = Object.keys(groupedApiLogs).sort();

  const TH = ({ children, center }) => (
    <th
      className={cn(
        "px-3 py-4 sm:px-4 text-[11px] font-black uppercase tracking-widest text-[#8C8580] whitespace-nowrap border-b border-[#F0EBE8]",
        center ? "text-center" : "text-left",
      )}
    >
      {children}
    </th>
  );

  const handleReportUpdated = (logId, updatedReportData) => {
    const updateLog = (log) => {
      if (String(log.id) !== String(logId)) return log;
      const raw = log._raw || {};
      const updatedRaw = {
        ...raw,
        report_data: raw.report_data ? updatedReportData : raw.report_data,
        daily_report: raw.daily_report
          ? {
            ...raw.daily_report,
            report_data: updatedReportData,
          }
          : raw.daily_report,
      };
      return { ...log, _raw: updatedRaw };
    };

    setSelectedReport((prev) => (prev ? updateLog(prev) : prev));
    setApiLogs((prev) => prev.map(updateLog));
    setGroupedApiLogs((prev) =>
      Object.fromEntries(
        Object.entries(prev).map(([dept, logs]) => [
          dept,
          Array.isArray(logs) ? logs.map(updateLog) : logs,
        ]),
      ),
    );
  };

  const renderRow = (log) => {
    const sub = log.submittedAt || "—";

    return (
      <tr
        key={log.id}
        className="border-b border-[#F0EBE8] hover:bg-[#FCFAFA] transition-colors bg-white"
      >
        <td className="px-3 py-4 sm:px-4 text-sm font-semibold text-[#8C8580] whitespace-nowrap">
          {fmt(log.date)}
        </td>
        <td className="px-3 py-4 sm:px-4 max-w-[140px] sm:max-w-[180px]">
          <div className="text-sm font-black text-[#1A1A1A] truncate">
            {log.user}
          </div>
          <div className="text-xs font-semibold text-[#8C8580] mt-0.5 truncate">
            {log.email}
          </div>
          {log.isAbsent && (
            <div className="mt-1 inline-flex max-w-full items-center rounded-md border border-red-100 bg-red-50 px-2 py-0.5 text-[10px] font-bold text-red-700">
              <span className="truncate">
                Absent{log.absentReason ? `: ${log.absentReason}` : ""}
              </span>
            </div>
          )}
        </td>
        <td className="px-3 py-4 sm:px-4">
          <span
            className={cn(
              "flex flex-col justify-center items-center font-semibold p-2 rounded-xl",
              scoreColor(log.score, log.status),
            )}
          >
            {log.score}
          </span>
        </td>
        <td className="px-3 py-4 sm:px-4">
          <span className="inline-block px-3.5 py-1.5 rounded-[8px] border border-[#F0EBE8] bg-[#FCFAFA] text-[10px] font-black text-[#8C8580] uppercase tracking-wider">
            {log.dept || "—"}
          </span>
        </td>
        <td className="px-3 py-4 sm:px-4 max-w-[180px] lg:max-w-[220px] whitespace-normal break-words leading-snug">
          <FormattedHighlights text={log.highlights} isPending={false} />
        </td>
        <td className="px-3 py-4 sm:px-4 text-xs font-semibold text-[#8C8580] min-w-[110px]">
          {sub}
        </td>
        <td className="px-3 py-4 sm:px-4 text-center">
          <button
            onClick={() => setSelectedReport(log)}
            className="inline-flex items-center justify-center w-9 h-9 rounded-[12px] border border-[#F0EBE8] text-[#8C8580] hover:bg-[#1A1A1A] hover:text-white hover:border-[#1A1A1A] transition-all"
            title="View details"
          >
            <Eye className="w-3.5 h-3.5" />
          </button>
        </td>
      </tr>
    );
  };

  return (
    <div
      className="pb-12 min-h-screen pt-0"
      style={{ fontFamily: "'Poppins', sans-serif" }}
    >
      {/* Header card */}
      <div className="bg-white rounded-[32px] border border-[#F0EBE8] shadow-sm p-6 sm:p-8 mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          <div className="flex items-center gap-4">
            <div className="w-[48px] h-[48px] rounded-[14px] bg-[#FDF5F1] border border-[#F6E1D7] flex items-center justify-center shrink-0">
              <FileText className="w-6 h-6 text-[#D37E5F]" />
            </div>
            <div>
              <h1 className="text-[24px] font-black text-[#1A1A1A] tracking-tight">
                Daily Report Log for {titleDate}
              </h1>
              <div className="flex items-center gap-4 mt-1.5 text-[12px] font-bold text-[#8C8580] uppercase tracking-widest flex-wrap">
                {isNonWorkingDay ? (
                  <span className="flex items-center gap-1.5 px-3 py-1 rounded-[8px] bg-amber-50 border border-amber-200 text-amber-700 normal-case tracking-normal text-[11px] font-bold">
                    Non-working day — no reports expected
                  </span>
                ) : (
                  <>
                    <span className="flex items-center gap-2">
                      Submitted
                      <span className="px-2 py-0.5 rounded-[6px] bg-[#2ECC71] text-white">
                        {metaSubmitted}
                      </span>
                    </span>
                    <span className="flex items-center gap-2">
                      Missed
                      <span className="px-2 py-0.5 rounded-[6px] bg-[#EB4A4A] text-white">
                        {metaExpected}
                      </span>
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Date nav */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => shiftDate(-1)}
              className="w-[42px] h-[42px] flex items-center justify-center border border-[#F0EBE8] bg-white rounded-[14px] hover:bg-gray-50 text-gray-800 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => {
                if (e.target.value) setSelectedDate(e.target.value);
              }}
              className="h-[42px] border border-[#F0EBE8] bg-[#FCFAFA] rounded-[14px] px-4 text-sm font-bold text-[#1A1A1A] focus:outline-none focus:border-[#EB4A4A] w-[145px]"
            />
            <button
              onClick={() => shiftDate(1)}
              className="w-[42px] h-[42px] flex items-center justify-center border border-[#F0EBE8] bg-white rounded-[14px] hover:bg-gray-50 text-gray-800 transition-colors"
            >
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Filter bar */}
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
          <div className="relative flex-1 min-w-0">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8C8580]" />
            <input
              type="text"
              placeholder="Search by name, email, department..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-10 py-3.5 text-sm font-bold border border-[#F0EBE8] bg-[#FCFAFA] rounded-[16px] focus:outline-none focus:ring-2 focus:ring-[#EB4A4A]/20 focus:border-[#EB4A4A] text-[#1A1A1A] placeholder:text-[#8C8580] transition-colors"
            />
            {searchQuery !== debouncedSearch && (
              <RefreshCw className="w-4 h-4 absolute right-4 top-1/2 -translate-y-1/2 text-[#EB4A4A] animate-spin" />
            )}
            {searchQuery && searchQuery === debouncedSearch && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#EB4A4A]"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <CustomSelect
            value={selectedDeptId}
            onChange={setSelectedDeptId}
            disabled={isFetchingDepts}
            placeholder="Department"
            options={[
              { value: "", label: "All Departments" },
              ...departments.map((d) => ({ value: d.id, label: d.label })),
            ]}
          />

          <CustomSelect
            value={selectedMeetingFilter}
            onChange={(value) => {
              setSelectedMeetingFilter(value);
              onSelectedMeetingChange?.(String(value));
            }}
            disabled={isFetchingMeetings}
            placeholder="Meeting"
            options={meetings.map((m) => ({ value: m.id, label: m.label }))}
          />

          <button
            onClick={() => setIsGrouped(!isGrouped)}
            className={cn(
              "flex items-center justify-center gap-2 px-5 py-3.5 rounded-[16px] text-sm font-bold border transition-all shrink-0",
              isGrouped
                ? "bg-[#1A1A1A] border-[#1A1A1A] text-white"
                : "bg-white border-[#F0EBE8] text-[#8C8580] hover:bg-gray-50 hover:text-[#1A1A1A]",
            )}
          >
            <Layers className="w-3.5 h-3.5" /> Group by Dept
          </button>

          <button
            onClick={loadData}
            className="w-[50px] h-[50px] flex items-center justify-center border border-[#F0EBE8] rounded-[16px] bg-white text-[#8C8580] hover:text-[#1A1A1A] hover:bg-gray-50 transition-all shrink-0"
          >
            <RefreshCw
              className={cn(
                "w-5 h-5",
                isLoading && "animate-spin text-[#EB4A4A]",
              )}
            />
          </button>
        </div>
      </div>

      {/* Error */}
      {apiError && (
        <div className="bg-[#EB4A4A]/10 text-[#EB4A4A] text-sm font-bold p-5 rounded-[20px] flex items-center gap-3 mb-6">
          <AlertTriangle className="w-5 h-5 shrink-0" />
          API Error: {apiError}
        </div>
      )}

      {/* Non-working day banner */}
      {isNonWorkingDay && !isLoading && (
        <div className="bg-amber-50 border border-amber-200 rounded-[20px] p-5 mb-6 flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-amber-100 border border-amber-200 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-5 h-5 text-amber-600" />
          </div>
          <div>
            <p className="text-sm font-black text-amber-800">Non-working day</p>
            <p className="text-xs font-semibold text-amber-600 mt-0.5">
              {titleDate} is not a scheduled meeting day. This meeting runs on{" "}
              {meetingDays.join(", ")} — no reports are expected today.
            </p>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="bg-white border border-[#F0EBE8] rounded-[32px] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead className="bg-[#FCFAFA]">
              <tr>
                <TH>Date</TH>
                <TH>User</TH>
                <TH>Score</TH>
                <TH>Department</TH>
                <TH>Highlights</TH>
                <TH>Submitted At</TH>
                <TH center>Actions</TH>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                [1, 2, 3, 4, 5].map((i) => (
                  <tr
                    key={`skeleton-${i}`}
                    className="border-b border-[#F0EBE8] bg-white"
                  >
                    {[140, 160, 40, 90, 180, 100, 36].map((w, j) => (
                      <td key={j} className="px-3 py-4 sm:px-4">
                        <div
                          className="bg-[#F0EBE8] rounded-full animate-pulse"
                          style={{ width: w, height: 16 }}
                        />
                      </td>
                    ))}
                  </tr>
                ))
              ) : !isGrouped && flatFiltered.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="text-center py-20 text-sm font-bold text-[#8C8580]"
                  >
                    {isNonWorkingDay
                      ? "This is a non-working day — no reports are expected."
                      : "No submitted reports found for the selected date and filters."}
                  </td>
                </tr>
              ) : isGrouped && sortedDepts.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="text-center py-20 text-sm font-bold text-[#8C8580]"
                  >
                    {isNonWorkingDay
                      ? "This is a non-working day — no reports are expected."
                      : "No submitted reports found for the selected date and filters."}
                  </td>
                </tr>
              ) : !isGrouped ? (
                flatFiltered.map(renderRow)
              ) : (
                sortedDepts.map((dept) => {
                  const deptLogs = groupedApiLogs[dept] || [];
                  if (deptLogs.length === 0) return null;
                  return (
                    <React.Fragment key={dept}>
                      <tr className="bg-[#FCFAFA] border-b border-[#F0EBE8]">
                        <td colSpan={7} className="px-3 py-4 sm:px-4">
                          <span className="text-sm font-black text-[#1A1A1A] uppercase tracking-wider">
                            {dept}
                          </span>
                          <span className="ml-3 text-[12px] font-bold text-[#8C8580] px-2 py-1 bg-white border border-[#F0EBE8] rounded-[6px]">
                            {deptLogs.length} Reports
                          </span>
                        </td>
                      </tr>
                      {deptLogs.map(renderRow)}
                    </React.Fragment>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Modal */}
      {selectedReport && (
        <ReportDetailModal
          log={selectedReport}
          onClose={() => setSelectedReport(null)}
          onReportUpdated={handleReportUpdated}
        />
      )}
    </div>
  );
};

export default DailyLogTab;
