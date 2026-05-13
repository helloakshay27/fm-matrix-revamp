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
  MessageSquare,
  Layers,
  Circle,
  Loader2,
  Trophy,
  Crown,
  Calendar,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { getBaseUrl, getAuthHeaders } from "./Shared";
import { toast } from "sonner";
import ProjectTaskCreateModal from "../../../components/ProjectTaskCreateModal";
import AddIssueModal from "../../../components/AddIssueModal";
import { createTheme, ThemeProvider } from "@mui/material/styles";

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
          disabled && "opacity-60 cursor-not-allowed"
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
            open ? "rotate-180 text-[#EB4A4A]" : "text-[#8C8580]"
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
                      : "text-[#1A1A1A] hover:bg-[#FFF5F5] hover:text-[#D37E5F]"
                  )}
                >
                  <span
                    className={cn(
                      "w-1.5 h-1.5 rounded-full shrink-0 transition-colors",
                      isSelected
                        ? "bg-[#D37E5F]"
                        : "bg-transparent group-hover:bg-[#EB4A4A]/30"
                    )}
                  />
                  <span className="truncate flex-1">{opt.label}</span>
                  {isSelected && (
                    <span className="ml-auto shrink-0">
                      <svg
                        className="w-3.5 h-3.5 text-[#EB4A4A]"
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
  const draftRaw = report.daily_report?.report_data || {};
  const hasDraft = !!report.daily_report;
  const hasReportData = rd && Object.keys(rd).length > 0;

  const normalizeDraftRaw = (raw) => ({
    ...raw,
    accomplishments:
      raw.accomplishments?.items ||
      (Array.isArray(raw.accomplishments) ? raw.accomplishments : []),
    self_rating:
      raw.details?.self_rating ?? raw.sections?.self_rating ?? null,
    total_score: raw.total_score ?? null,
    is_absent: raw.details?.is_absent ?? raw.sections?.is_absent ?? null,
  });

  if (!hasReportData && hasDraft) {
    return normalizeDraftRaw(draftRaw);
  }

  if (report.status === "pending" && hasDraft) {
    return normalizeDraftRaw(draftRaw);
  }

  if (hasReportData && hasDraft) {
    const normalizedDraft = normalizeDraftRaw(draftRaw);

    return {
      ...normalizedDraft,
      ...rd,
      tasks_issues: Array.isArray(rd.tasks_issues)
        ? rd.tasks_issues
        : normalizedDraft.tasks_issues || [],
      tomorrow_plan: Array.isArray(rd.tomorrow_plan)
        ? rd.tomorrow_plan
        : normalizedDraft.tomorrow_plan || [],
      accomplishments:
        rd.accomplishments?.items ||
        (Array.isArray(rd.accomplishments)
          ? rd.accomplishments
          : normalizedDraft.accomplishments || []),
      self_rating: rd.self_rating ?? normalizedDraft.self_rating,
      total_score: rd.total_score ?? normalizedDraft.total_score,
      is_absent: rd.is_absent ?? normalizedDraft.is_absent,
    };
  }

  return rd;
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
        report.report_data?.meeting_notes
    ) ||
    allReports.find(
      (report) => report.status === "submitted" && report.report_data?.meeting_notes
    ) ||
    allReports.find((report) => report.report_data?.meeting_notes);

  return data.report_data?.meeting_notes || sourceReport?.report_data?.meeting_notes || {};
};

const getItemTitle = (item) => {
  if (!item) return "";
  if (typeof item === "string") return item;
  if (typeof item === "object") return String(item.title || item.name || "");
  return String(item);
};

const getItemStatus = (item) => {
  if (!item || typeof item !== "object") return "open";
  return item.status || "open";
};

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

  const matchAccChal = text.match(/Acc:\s*(\d+)\s*\|\s*Chal:\s*(\d+)/i);
  if (matchAccChal) {
    return (
      <span className="text-[13px] text-[#1A1A1A]">
        <span className="font-bold">{matchAccChal[1]}</span> accomplishments,{" "}
        <span className="font-bold">{matchAccChal[2]}</span> challenges
      </span>
    );
  }

  return <span className="text-[13px] text-[#1A1A1A]">{text}</span>;
};

// ─────────────────────────────────────────────
// Report Detail Modal
// Uses /user_journals/:id.json — same as before
// ─────────────────────────────────────────────
const ReportDetailModal = ({ log, onClose }) => {
  const [details, setDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isIssueModalOpen, setIsIssueModalOpen] = useState(false);

  const [quickActionOpen, setQuickActionOpen] = useState(false);
  const [quickActionText, setQuickActionText] = useState("");

  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [feedbackRating, setFeedbackRating] = useState(0);
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [fetchedFeedbacks, setFetchedFeedbacks] = useState([]);
  const [isFetchingFeedbacks, setIsFetchingFeedbacks] = useState(false);

  // log.id is journal_id (or daily_report.id as fallback) from the meeting report
  const hasValidId =
    log.id && !String(log.id).startsWith("user-") && log.id !== "null";

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
          { method: "GET", headers: getAuthHeaders() }
        );
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        setDetails(await res.json());
      } catch (error) {
        toast.error("Failed to load report details: " + error.message);
      } finally {
        if (!silent) setIsLoading(false);
      }
    },
    [log.id, hasValidId]
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

  const cleanName = (log.user || "").trim();

  const filteredAccomplishments = displayRd.accomplishments.filter(
    (item) =>
      !item.member ||
      String(item.member).trim().toLowerCase() === cleanName.toLowerCase()
  );

  const filteredTasksIssues = displayRd.tasks_issues.filter(
    (item) =>
      !item.member ||
      String(item.member).trim().toLowerCase() === cleanName.toLowerCase()
  );

  const filteredTomorrowPlan = displayRd.tomorrow_plan.filter(
    (item) =>
      !item.member ||
      String(item.member).trim().toLowerCase() === cleanName.toLowerCase()
  );

  const sd = draftRaw?.score_details || rd?.score_details || {};

  const kpiAchieved =
    sd.kpi?.points ?? details?.kpis?.score ?? details?.score ?? 0;
  const kpiMax = sd.kpi?.maxPoints ?? 20;

  const tasksAchieved = sd.tasksIssues?.points ?? details?.kpis?.tasks ?? 0;
  const tasksMax = sd.tasksIssues?.maxPoints ?? 25;

  const issuesAchieved = details?.kpis?.issues ?? 0;

  const planAchieved = sd.planning?.points ?? details?.kpis?.planning ?? 0;
  const planMax = sd.planning?.maxPoints ?? 25;

  const timeAchieved = sd.timing?.points ?? details?.kpis?.timing ?? 0;
  const timeMax = sd.timing?.maxPoints ?? 25;

  const totalScoreStr = Math.round(
    details?.score ?? rawDisplayRd?.total_score ?? log.score ?? 0
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

    if (patch.tomorrow_plan_item) {
      const existingPlan = Array.isArray(rawSource.tomorrow_plan)
        ? rawSource.tomorrow_plan
        : [];
      const updatedPlan = [
        ...existingPlan,
        { title: patch.tomorrow_plan_item.trim() },
      ];
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
              report_data: { ...rawSource, tomorrow_plan: updatedPlan },
            }),
          }
        );
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
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
          }
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

  // ── Feedback ──
  const loadPastFeedbacks = async () => {
    setIsFetchingFeedbacks(true);
    try {
      const loggedInUserId = localStorage.getItem("userId") || "";
      const targetUserId = log._raw?.user_id || log.userId || "";
      const res = await fetch(
        `${getBaseUrl()}/ratings?resource_type=User&resource_id=${targetUserId}&rating_from_id=${loggedInUserId}`,
        { method: "GET", headers: getAuthHeaders() }
      );
      if (res.ok) {
        const data = await res.json();
        const rawList = Array.isArray(data)
          ? data
          : data.data || data.ratings || [];
        const sorted = [...rawList].sort(
          (a, b) => new Date(b.created_at) - new Date(a.created_at)
        );
        setFetchedFeedbacks(sorted);
      }
    } catch (error) {
      console.error("Failed to fetch feedbacks:", error);
    } finally {
      setIsFetchingFeedbacks(false);
    }
  };

  const handleSubmitFeedback = async () => {
    if (feedbackRating === 0) {
      toast.error("Please select a star rating!");
      return;
    }
    try {
      const loggedInUserId = localStorage.getItem("userId") || "";
      const payload = {
        resource_type: "User",
        resource_id: log._raw?.user_id || log.userId || "",
        rating_from_id: loggedInUserId,
        score: feedbackRating,
        reviews: feedbackMessage,
        positive_opening: "",
        constructive_feedback: "",
        positive_closing: "",
      };
      const res = await fetch(`${getBaseUrl()}/ratings`, {
        method: "POST",
        headers: { ...getAuthHeaders(), "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      toast.success("Feedback added!");
      setFeedbackOpen(false);
      setFeedbackRating(0);
      setFeedbackMessage("");
      loadPastFeedbacks();
    } catch (err) {
      toast.error("Error adding feedback: " + err.message);
    }
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

          <div className="relative z-10 bg-[#FFFDFB] w-full max-w-[1000px] max-h-[90vh] shadow-2xl flex flex-col rounded-[20px] overflow-hidden border border-[#F0EBE8]">
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
                  <div className="p-6 bg-white border-b border-[#F0EBE8]">
                    <div className="flex items-start gap-4">
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
                            <CheckCircle2 className="w-3.5 h-3.5" /> Submitted
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
                          <span className="px-3 py-1 rounded-full border border-[rgba(206,122,90,0.3)] bg-[#FFF3EE] text-[#CE7A5A] text-xs font-bold shadow-sm">
                            KPI: {kpiAchieved}/{kpiMax}
                          </span>
                          <span className="px-3 py-1 rounded-full border border-[rgba(206,122,90,0.3)] bg-[#FFF3EE] text-[#CE7A5A] text-xs font-bold shadow-sm">
                            Tasks: {tasksAchieved}/{tasksMax}
                          </span>
                          <span className="px-3 py-1 rounded-full border border-[rgba(206,122,90,0.3)] bg-[#FFF3EE] text-[#CE7A5A] text-xs font-bold shadow-sm">
                            Issues: {issuesAchieved}
                          </span>
                          <span className="px-3 py-1 rounded-full border border-[rgba(206,122,90,0.3)] bg-[#FFF3EE] text-[#CE7A5A] text-xs font-bold shadow-sm">
                            Planning: {planAchieved}/{planMax}
                          </span>
                          <span className="px-3 py-1 rounded-full border border-[rgba(206,122,90,0.3)] bg-[#FFF3EE] text-[#CE7A5A] text-xs font-bold shadow-sm">
                            Timing: {timeAchieved}/{timeMax}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 space-y-6 bg-[#FFFAF8] flex-1">
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
                      {displayRd.is_absent !== null &&
                        displayRd.is_absent !== undefined && (
                          <div
                            className={cn(
                              "flex items-center gap-2 rounded-xl px-4 py-2.5 border shadow-sm",
                              displayRd.is_absent
                                ? "bg-red-50 border-red-100"
                                : "bg-green-50 border-green-100"
                            )}
                          >
                            <span
                              className={cn(
                                "text-sm font-bold",
                                displayRd.is_absent
                                  ? "text-red-700"
                                  : "text-green-700"
                              )}
                            >
                              {displayRd.is_absent ? "Absent" : "Present"}
                            </span>
                          </div>
                        )}
                    </div>

                    {/* Big Win */}
                    {displayRd.big_win && (
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

                    {/* 3-Column: Accomplishments | Tasks & Issues | Tomorrow's Plan */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                      {/* Accomplishments */}
                      <div className="bg-white border border-[#F0E8E3] rounded-xl p-5 shadow-sm">
                        <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-100">
                          <div className="w-7 h-7 rounded-lg bg-green-100 flex items-center justify-center shrink-0">
                            <CheckCircle2 className="w-4 h-4 text-green-600" />
                          </div>
                          <h4 className="text-sm font-extrabold text-neutral-800 uppercase tracking-wider">
                            Accomplishments
                          </h4>
                        </div>
                        {filteredAccomplishments.length === 0 ? (
                          <p className="text-sm text-neutral-400 italic font-medium">
                            None recorded.
                          </p>
                        ) : (
                          <ul className="space-y-3">
                            {filteredAccomplishments.map((item, i) => (
                              <li
                                key={i}
                                className="flex items-start gap-2.5 text-sm font-medium text-neutral-700"
                              >
                                <div className="w-2 h-2 rounded-full bg-green-400 mt-1.5 shrink-0" />
                                <span className="leading-relaxed">
                                  {getItemTitle(item)}
                                </span>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>

                      {/* Tasks & Issues */}
                      <div className="bg-white border border-[#F0E8E3] rounded-xl p-5 shadow-sm">
                        <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-100">
                          <div className="w-7 h-7 rounded-lg bg-orange-100 flex items-center justify-center shrink-0">
                            <AlertTriangle className="w-4 h-4 text-orange-600" />
                          </div>
                          <h4 className="text-sm font-extrabold text-neutral-800 uppercase tracking-wider">
                            Tasks & Issues
                          </h4>
                        </div>
                        {filteredTasksIssues.length === 0 ? (
                          <p className="text-sm text-neutral-400 italic font-medium">
                            None recorded.
                          </p>
                        ) : (
                          <ul className="space-y-3">
                            {filteredTasksIssues.map((item, i) => (
                              <li
                                key={i}
                                className="flex items-start gap-2.5 text-sm font-medium text-neutral-700"
                              >
                                <span
                                  className={cn(
                                    "shrink-0 text-[10px] font-bold px-2 py-0.5 rounded-full mt-0.5",
                                    getItemStatus(item) === "open"
                                      ? "bg-red-100 text-red-600"
                                      : getItemStatus(item) === "closed"
                                        ? "bg-green-100 text-green-600"
                                        : "bg-gray-100 text-gray-500"
                                  )}
                                >
                                  {getItemStatus(item)}
                                </span>
                                <span className="leading-relaxed">
                                  {getItemTitle(item)}
                                </span>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>

                      {/* Tomorrow's Plan */}
                      <div className="bg-white border border-[#F0E8E3] rounded-xl p-5 shadow-sm">
                        <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-100">
                          <div className="w-7 h-7 rounded-lg bg-blue-100 flex items-center justify-center shrink-0">
                            <Calendar className="w-4 h-4 text-blue-600" />
                          </div>
                          <h4 className="text-sm font-extrabold text-neutral-800 uppercase tracking-wider">
                            Tomorrow's Plan
                          </h4>
                        </div>
                        {filteredTomorrowPlan.length === 0 ? (
                          <p className="text-sm text-neutral-400 italic font-medium">
                            None recorded.
                          </p>
                        ) : (
                          <ul className="space-y-3">
                            {filteredTomorrowPlan.map((item, i) => (
                              <li
                                key={i}
                                className="flex items-start gap-2.5 text-sm font-medium text-neutral-700"
                              >
                                <Circle className="w-3 h-3 text-blue-400 mt-1 shrink-0" />
                                <span className="leading-relaxed">
                                  {getItemTitle(item)}
                                </span>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-wrap gap-3 pt-2">
                      <button
                        onClick={() => setIsTaskModalOpen(true)}
                        className="flex items-center gap-2 px-5 py-2 text-blue-600 bg-white border border-blue-200 rounded-full text-sm font-bold shadow-sm hover:bg-blue-50 transition-colors"
                      >
                        <Plus className="w-4 h-4" /> Add Task
                      </button>
                      <button
                        onClick={() => setIsIssueModalOpen(true)}
                        className="flex items-center gap-2 px-5 py-2 text-red-600 bg-white border border-red-200 rounded-full text-sm font-bold shadow-sm hover:bg-red-50 transition-colors"
                      >
                        <Plus className="w-4 h-4" /> Stuck Issue
                      </button>
                      <button
                        onClick={() => {
                          setQuickActionOpen(!quickActionOpen);
                          setQuickActionText("");
                        }}
                        className="flex items-center gap-2 px-5 py-2 text-orange-600 bg-white border border-orange-200 rounded-full text-sm font-bold shadow-sm hover:bg-orange-50 transition-colors"
                      >
                        <Plus className="w-4 h-4" /> Add to Plan
                      </button>
                      <button
                        onClick={() => {
                          if (feedbackOpen) {
                            setFeedbackOpen(false);
                          } else {
                            setFeedbackOpen(true);
                            setFeedbackRating(0);
                            setFeedbackMessage("");
                            loadPastFeedbacks();
                          }
                        }}
                        className="flex items-center gap-2 px-5 py-2 text-white bg-purple-600 border border-purple-700 rounded-full text-sm font-bold shadow-sm hover:bg-purple-700 transition-colors"
                      >
                        <MessageSquare className="w-4 h-4" /> Feedback
                      </button>
                    </div>

                    {/* Quick Add to Plan */}
                    {quickActionOpen && (
                      <div className="bg-white border border-orange-100 rounded-2xl p-5 shadow-sm">
                        <p className="text-xs font-black text-orange-800 uppercase tracking-widest mb-3 flex items-center gap-2">
                          <Plus className="w-4 h-4" /> Add to Tomorrow's Plan
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

                    {/* Feedback Block */}
                    {feedbackOpen && (
                      <div className="bg-white border border-purple-100 rounded-2xl p-6 shadow-sm">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                          {/* Left: Add new feedback */}
                          <div>
                            <p className="text-xs font-black text-purple-800 uppercase tracking-widest mb-4 flex items-center gap-2">
                              <MessageSquare className="w-4 h-4" /> Provide
                              Feedback
                            </p>
                            <p className="text-sm font-bold text-neutral-800 mb-2">
                              Rating (1–5 stars)
                            </p>
                            <div className="flex items-center gap-1.5 mb-5">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                  key={star}
                                  type="button"
                                  onClick={() => setFeedbackRating(star)}
                                  className="transition-transform hover:scale-110 focus:outline-none"
                                >
                                  <svg
                                    className="w-10 h-10"
                                    viewBox="0 0 24 24"
                                    fill={
                                      star <= feedbackRating
                                        ? "#F59E0B"
                                        : "none"
                                    }
                                    stroke={
                                      star <= feedbackRating
                                        ? "#F59E0B"
                                        : "#D1D5DB"
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
                            <p className="text-sm font-bold text-neutral-800 mb-2">
                              Feedback Message
                            </p>
                            <textarea
                              autoFocus
                              value={feedbackMessage}
                              onChange={(e) =>
                                setFeedbackMessage(e.target.value)
                              }
                              placeholder="Enter constructive feedback..."
                              rows={4}
                              className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm font-medium text-neutral-800 focus:outline-none focus:ring-2 focus:ring-purple-200 placeholder:text-neutral-400 resize-y"
                            />
                            <div className="flex items-center gap-3 mt-5">
                              <button
                                onClick={handleSubmitFeedback}
                                className="px-6 py-2.5 rounded-xl text-sm font-bold text-white bg-purple-600 hover:bg-purple-700 transition-colors shadow-sm"
                              >
                                Submit Feedback
                              </button>
                              <button
                                onClick={() => {
                                  setFeedbackOpen(false);
                                  setFeedbackRating(0);
                                  setFeedbackMessage("");
                                }}
                                className="px-6 py-2.5 rounded-xl text-sm font-bold text-neutral-700 bg-white border border-gray-300 hover:bg-gray-50 transition-colors shadow-sm"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>

                          {/* Right: Recent feedbacks */}
                          <div className="bg-[#FAF7F5] rounded-xl p-6 border border-[#EAE3DF] flex flex-col">
                            <div className="flex items-center justify-between mb-5">
                              <p className="text-xs font-black text-neutral-500 uppercase tracking-widest">
                                Recent Feedbacks
                              </p>
                              <button
                                onClick={() =>
                                  (window.location.href =
                                    "/admin-compass/feedback-dashboard")
                                }
                                className="text-xs font-bold text-purple-600 hover:underline flex items-center gap-1"
                              >
                                View All <ChevronRight className="w-3 h-3" />
                              </button>
                            </div>

                            {isFetchingFeedbacks ? (
                              <div className="flex justify-center items-center h-full py-10">
                                <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
                              </div>
                            ) : fetchedFeedbacks.length === 0 ? (
                              <div className="flex flex-col items-center justify-center h-full py-10 text-neutral-400">
                                <MessageSquare className="w-10 h-10 opacity-20 mb-3" />
                                <span className="text-sm font-medium italic">
                                  No past feedback found.
                                </span>
                              </div>
                            ) : (
                              <div className="space-y-4 overflow-y-auto pr-2 flex-1">
                                {fetchedFeedbacks.slice(0, 3).map((fb, idx) => (
                                  <div
                                    key={fb.id ?? idx}
                                    className="bg-white p-4 rounded-xl shadow-sm border border-gray-100"
                                  >
                                    <div className="flex items-center gap-1 mb-2">
                                      {[1, 2, 3, 4, 5].map((star) => (
                                        <Star
                                          key={star}
                                          className={cn(
                                            "w-3.5 h-3.5",
                                            star <= fb.score
                                              ? "text-yellow-400 fill-yellow-400"
                                              : "text-gray-200"
                                          )}
                                        />
                                      ))}
                                      {fb.created_at && (
                                        <span className="text-[10px] text-gray-400 ml-auto font-bold">
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
                                      <p className="text-sm text-neutral-700 font-medium leading-relaxed">
                                        {fb.reviews}
                                      </p>
                                    ) : (
                                      <p className="text-sm text-neutral-400 italic">
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
          </div>

          {/* Add Task slide-over */}
          {isTaskModalOpen && (
            <MuiZIndexFix>
              <div className="fixed inset-0 z-[10000] flex justify-end">
                <div
                  className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                  onClick={() => setIsTaskModalOpen(false)}
                />
                <div
                  className="relative flex flex-col bg-white shadow-2xl h-full border-l border-gray-200"
                  style={{ width: "min(760px, 95vw)" }}
                >
                  <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 shrink-0 bg-gray-50">
                    <h2 className="text-lg font-bold text-gray-900">
                      Add Task
                    </h2>
                    <button
                      onClick={() => setIsTaskModalOpen(false)}
                      className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-gray-200 transition-colors text-gray-500"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="flex-1 overflow-y-auto p-4">
                    <ProjectTaskCreateModal
                      isEdit={false}
                      onCloseModal={() => setIsTaskModalOpen(false)}
                      className="max-w-full mx-0"
                      prefillData={null}
                      opportunityId={null}
                      onSuccess={async () => {
                        setIsTaskModalOpen(false);
                        refetchDetails(true);
                      }}
                      isConversion={false}
                    />
                  </div>
                </div>
              </div>
            </MuiZIndexFix>
          )}

          {isIssueModalOpen && (
            <MuiZIndexFix>
              <AddIssueModal
                openDialog={isIssueModalOpen}
                handleCloseDialog={() => setIsIssueModalOpen(false)}
                preSelectedProjectId={undefined}
              />
            </MuiZIndexFix>
          )}
        </div>,
        document.body
      )}
    </>
  );
};

// ─────────────────────────────────────────────
// DailyLogTab — Main Component
// ─────────────────────────────────────────────
const DailyLogTab = () => {
  const [selectedDate, setSelectedDate] = useState(
    () => new Date().toISOString().split("T")[0]
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
        setSelectedMeetingFilter(
          defaultMeeting ? defaultMeeting.id : data[0].id
        );
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsFetchingMeetings(false);
    }
  }, []);

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
        meetingNotesData?.missed_report_members
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
          (report) => report.status === "pending" || report.status === "missed"
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
          .filter((id) => Number.isFinite(id) && id > 0)
      );

      const submittedReports =
        detailedReports.length > 0
          ? allReports.filter((report) =>
              detailedReportUserIds.has(Number(report.user_id))
            )
          : allReports.filter(
              (r) => r.status !== "pending" || !!r.daily_report
            );

      // Map to table row format
      let logsArray = submittedReports.map((report) => {
        const rawRd = resolveRawSource(report);
        const rd = normalizeReportData(rawRd);

        // Build highlights summary from accomplishments count
        const highlights =
          rd.accomplishments.length > 0 || rd.tasks_issues.length > 0
            ? `Acc: ${rd.accomplishments.length} | Chal: ${rd.tasks_issues.length}`
            : "";

        return {
          // journal_id is null for draft-only members; fall back to daily_report.id
          id: report.journal_id || report.daily_report?.id || report.id,
          user: report.name || "",
          email: report.email || "",
          score: Math.round(report.score ?? rawRd?.total_score ?? 0),
          dept: report.department || "",
          highlights,
          submittedAt: report.submitted_at
            ? formatDateTime(report.submitted_at)
            : "—",
          status: report.status,
          date: selectedDate,
          userId: report.user_id,
          _raw: report,
        };
      });

      if (logsArray.length === 0 && detailedReports.length > 0) {
        logsArray = detailedReports.map((report) => {
          const accomplishments = Array.isArray(report.accomplishments)
            ? report.accomplishments
            : [];
          const tasksIssues = Array.isArray(report.tasks_issues)
            ? report.tasks_issues
            : [];

          return {
            id: report.user_id || report.name || selectedDate,
            user: report.name || "",
            email: "",
            score: Number(String(report.self_rating || "0").split("/")[0]) || 0,
            dept: "",
            highlights:
              accomplishments.length > 0 || tasksIssues.length > 0
                ? `Acc: ${accomplishments.length} | Chal: ${tasksIssues.length}`
                : "",
            submittedAt: "—",
            status: "submitted",
            date: selectedDate,
            userId: report.user_id,
            _raw: { report_data: report, status: "submitted" },
          };
        });
      }

      // Dept filter
      if (selectedDeptId) {
        logsArray = logsArray.filter(
          (log) =>
            String(log._raw?.department_id) === String(selectedDeptId) ||
            log.dept === selectedDeptId
        );
      }

      // Search filter
      if (debouncedSearch) {
        const q = debouncedSearch.toLowerCase();
        logsArray = logsArray.filter(
          (log) =>
            (log.user && log.user.toLowerCase().includes(q)) ||
            (log.email && log.email.toLowerCase().includes(q)) ||
            (log.dept && log.dept.toLowerCase().includes(q))
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

      setMetaSubmitted(detailedReports.length || logsArray.length);
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
        center ? "text-center" : "text-left"
      )}
    >
      {children}
    </th>
  );

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
        </td>
        <td className="px-3 py-4 sm:px-4">
          <span
            className={cn(
              "flex flex-col justify-center items-center font-semibold p-2 rounded-xl",
              scoreColor(log.score, log.status)
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
            <Eye className="w-4 h-4" />
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
                <X className="w-4 h-4" />
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
            onChange={setSelectedMeetingFilter}
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
                : "bg-white border-[#F0EBE8] text-[#8C8580] hover:bg-gray-50 hover:text-[#1A1A1A]"
            )}
          >
            <Layers className="w-4 h-4" /> Group by Dept
          </button>

          <button
            onClick={loadData}
            className="w-[50px] h-[50px] flex items-center justify-center border border-[#F0EBE8] rounded-[16px] bg-white text-[#8C8580] hover:text-[#1A1A1A] hover:bg-gray-50 transition-all shrink-0"
          >
            <RefreshCw
              className={cn(
                "w-5 h-5",
                isLoading && "animate-spin text-[#EB4A4A]"
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
        />
      )}
    </div>
  );
};

export default DailyLogTab;
