// ─────────────────────────────────────────────
// DailyLogTab.jsx — Unified Modern Theme with Sonner Toasts
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
} from "lucide-react";
import { cn } from "@/lib/utils";
import { fetchDailyLogsFromAPI, getBaseUrl, getAuthHeaders } from "./Shared";
import { toast } from "sonner";
import ProjectTaskCreateModal from "../../../components/ProjectTaskCreateModal";
import AddIssueModal from "../../../components/AddIssueModal";
import { createTheme, ThemeProvider } from "@mui/material/styles";

// ─────────────────────────────────────────────
// MUI z-index override wrapper
// Forces MUI Dialog/Modal above ReportDetailModal (z-9990)
// ─────────────────────────────────────────────
const muiHighZTheme = createTheme({
  zIndex: {
    modal: 10001,
    drawer: 10001,
  },
});
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
          "flex items-center gap-2 bg-[#FCFAFA] border rounded-[16px] pl-5 pr-4 py-3.5 transition-all min-w-[160px]",
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
// Meetings & Departments API
// ─────────────────────────────────────────────
const fetchMeetingsAPI = async () => {
  const res = await fetch(`${getBaseUrl()}/daily_meeting_configs`, {
    method: "GET",
    headers: getAuthHeaders(),
  });
  const raw = await res.text();
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  let json;
  try {
    json = JSON.parse(raw);
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
    is_default: m.is_default || m.isDefault || false, // 🛠 FIX: Extract is_default flag
  }));
};

const fetchDepartmentsAPI = async () => {
  const res = await fetch(`${getBaseUrl()}/pms/departments.json`, {
    method: "GET",
    headers: getAuthHeaders(),
  });
  const raw = await res.text();
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  let json;
  try {
    json = JSON.parse(raw);
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

const scoreColor = (s, status) => {
  if (status === "pending")
    return "bg-gray-100 text-gray-500 border border-gray-200";
  return s >= 50 ? "bg-[#2ECC71] text-white" : "bg-[#EB4A4A] text-white";
};

const normalizeReportData = (rd) => {
  if (!rd || typeof rd !== "object") {
    return {
      accomplishments: [],
      tasks_issues: [],
      tomorrow_plan: [],
      big_win: null,
      self_rating: null,
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
  };
};

const getItemTitle = (item) => {
  if (!item) return "";
  if (typeof item === "string") return item;
  if (typeof item === "object") return String(item.title || item.name || "");
  return String(item);
};

// ─────────────────────────────────────────────
// ✅ Non-working day detection
// Uses meeting_days from API config e.g. ["Mon","Tue","Wed","Thu","Fri"]
// ─────────────────────────────────────────────
const DAY_MAP = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const checkIsNonWorkingDay = (dateStr, meetingDays) => {
  // Agar API ne days nahi bheje, toh working day hi manega (false)
  if (!dateStr || !Array.isArray(meetingDays) || meetingDays.length === 0)
    return false;
  
  // Date split karke parse krr, taaki timezone browser ko shift na kare
  const [y, m, d] = dateStr.split("-").map(Number);
  const dateObj = new Date(y, m - 1, d);
  if (isNaN(dateObj)) return false;
  
  const dayName = DAY_MAP[dateObj.getDay()];
  return !meetingDays.includes(dayName);
};

// ─────────────────────────────────────────────
// FormattedHighlights Component
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
      <span className="text-sm text-[#1A1A1A]">
        <span className="font-bold">{matchAccChal[1]}</span> accomplishments,{" "}
        <span className="font-bold">{matchAccChal[2]}</span> challenges
      </span>
    );
  }

  const matchFull = text.match(
    /(\d+)\s*accomplishments?,\s*(\d+)\s*challenges?/i
  );
  if (matchFull) {
    return (
      <span className="text-sm text-[#1A1A1A]">
        <span className="font-bold">{matchFull[1]}</span> accomplishments,{" "}
        <span className="font-bold">{matchFull[2]}</span> challenges
      </span>
    );
  }

  return <span className="text-sm text-[#1A1A1A]">{text}</span>;
};

// ─────────────────────────────────────────────
// Report Detail Modal
// ─────────────────────────────────────────────
const ReportDetailModal = ({ log, onClose }) => {
  const [details, setDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // ── action modals
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isIssueModalOpen, setIsIssueModalOpen] = useState(false);

  // ── quick-action (Add to Plan)
  const [quickActionOpen, setQuickActionOpen] = useState(false);
  const [quickActionText, setQuickActionText] = useState("");

  // ── feedback state
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [feedbackRating, setFeedbackRating] = useState(0);
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [fetchedFeedbacks, setFetchedFeedbacks] = useState([]);
  const [isFetchingFeedbacks, setIsFetchingFeedbacks] = useState(false);

  const isPending = log.status === "pending";
  const hasValidId = log.id && !String(log.id).startsWith("user-");

  // ── Fetch journal details
  const refetchDetails = useCallback(
    async (silent = false) => {
      if (isPending || !hasValidId) {
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
    [log.id, isPending, hasValidId]
  );

  useEffect(() => {
    refetchDetails(false);
  }, [refetchDetails]);

  const reportData = details?.report_data || {};
  const normalized = normalizeReportData(reportData);

  const fallbackAccomplishments =
    normalized.accomplishments.length === 0 && log.highlights && !isPending
      ? [{ title: log.highlights }]
      : normalized.accomplishments;

  // ── updateJournal
  const updateJournal = async (patch) => {
    if (!hasValidId) {
      toast.error("Journal ID not found.");
      return false;
    }
    const source = normalizeReportData(reportData);
    const payload = {
      user_journal: {
        self_rating: source.self_rating ?? 0,
        status: "submitted",
        report_data: {
          accomplishments: source.accomplishments,
          tasks_issues: source.tasks_issues,
          big_win: source.big_win || null,
          tomorrow_plan: patch.tomorrow_plan_item
            ? [...source.tomorrow_plan, { title: patch.tomorrow_plan_item }]
            : source.tomorrow_plan,
          kpis: reportData.kpis || {},
        },
      },
    };
    try {
      const res = await fetch(
        `${getBaseUrl()}/user_journals/${log.id}.json`,
        {
          method: "PUT",
          headers: { ...getAuthHeaders(), "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return true;
    } catch (err) {
      toast.error("Error updating journal: " + err.message);
      return false;
    }
  };

  // ── GET past feedbacks
  const loadPastFeedbacks = async () => {
    setIsFetchingFeedbacks(true);
    try {
      const loggedInUserId = localStorage.getItem("userId") || "";
      const res = await fetch(
        `${getBaseUrl()}/ratings?resource_type=User&resource_id=${
          log._raw?.user_id || log.userId || ""
        }&rating_from_id=${loggedInUserId}`,
        { method: "GET", headers: getAuthHeaders() }
      );
      if (res.ok) {
        const data = await res.json();
        setFetchedFeedbacks(
          Array.isArray(data) ? data : data.data || data.ratings || []
        );
      }
    } catch (error) {
      console.error("Failed to fetch feedbacks:", error);
    } finally {
      setIsFetchingFeedbacks(false);
    }
  };

  // ── Submit feedback
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
    } catch (err) {
      toast.error("Error adding feedback: " + err.message);
    }
  };

  return (
    <>
      {/* ── Main Detail Modal ── */}
      {createPortal(
        <div
          className="fixed inset-0 z-[9990] flex items-center justify-center p-4 sm:p-6"
          style={{ fontFamily: "'Poppins', sans-serif" }}
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal */}
          <div className="relative z-10 bg-[#FFFDFB] w-full max-w-[1100px] max-h-[90vh] shadow-2xl flex flex-col rounded-[20px] overflow-hidden border border-[#F0EBE8]">
            {/* Header */}
            <div className="px-6 py-4 border-b border-[#F0EBE8] flex items-center justify-between bg-white shrink-0">
              <div>
                <h2 className="text-xl font-bold text-[#1A1A1A] flex items-center gap-2">
                  Daily Report Details
                  {isPending && (
                    <span className="text-[10px] bg-red-50 text-red-500 border border-red-100 px-2 py-0.5 rounded-full uppercase tracking-wider">
                      Pending
                    </span>
                  )}
                </h2>
                <p className="text-xs font-semibold text-[#8C8580] mt-1">
                  {log.user} ({log.dept}) • {log.date && fmt(log.date)}
                </p>
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:bg-gray-100 hover:text-[#EB4A4A] p-2 rounded-[12px] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto p-6">
              {isLoading ? (
                <div className="flex flex-col items-center justify-center h-40 space-y-4">
                  <RefreshCw className="w-8 h-8 text-[#EB4A4A] animate-spin" />
                  <p className="text-sm font-bold text-[#8C8580]">
                    Fetching journal details...
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Big Win */}
                  {normalized.big_win && (
                    <div className="bg-amber-50 border border-amber-100 rounded-xl px-4 py-3 flex items-start gap-3">
                      <Trophy className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                      <div>
                        <div className="text-[10px] font-extrabold text-amber-600 uppercase tracking-widest mb-1">
                          Big Win 🏆
                        </div>
                        <p className="text-sm font-semibold text-amber-900">
                          {normalized.big_win}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* 3-column grid */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
                    {/* Column 1: Tasks & Issues */}
                    <div className="bg-white rounded-[16px] border border-[#F0EBE8] flex flex-col overflow-hidden shadow-sm">
                      <div className="bg-[#FFF5F5] px-4 py-3 border-b border-[#F05252]/20 flex items-center gap-2 shrink-0">
                        <AlertTriangle className="w-4 h-4 text-[#F05252]" />
                        <h3 className="font-bold text-[#F05252] text-sm">
                          Tasks & Issues
                        </h3>
                      </div>
                      <div className="p-5 flex-1">
                        {normalized.tasks_issues.length === 0 ? (
                          <p className="text-sm font-medium text-[#8C8580] italic">
                            No tasks or issues
                          </p>
                        ) : (
                          <ul className="space-y-3">
                            {normalized.tasks_issues.map((item, i) => (
                              <li
                                key={i}
                                className="flex items-start gap-2 text-xs text-neutral-700"
                              >
                                <span
                                  className={cn(
                                    "shrink-0 text-[9px] font-bold px-1.5 py-0.5 rounded-full mt-0.5",
                                    (item.status || "open") === "open"
                                      ? "bg-red-100 text-red-600"
                                      : (item.status || "open") === "closed"
                                      ? "bg-green-100 text-green-600"
                                      : "bg-gray-100 text-gray-500"
                                  )}
                                >
                                  {item.status || "open"}
                                </span>
                                <span className="leading-relaxed">
                                  {getItemTitle(item)}
                                </span>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </div>

                    {/* Column 2: Accomplishments */}
                    <div className="bg-white rounded-[16px] border border-[#F0EBE8] flex flex-col overflow-hidden shadow-sm">
                      <div className="bg-[#F0FDF4] px-4 py-3 border-b border-[#2ECC71]/20 flex items-center gap-2 shrink-0">
                        <CheckCircle2 className="w-4 h-4 text-[#2ECC71]" />
                        <h3 className="font-bold text-[#2ECC71] text-sm">
                          Accomplishments
                        </h3>
                      </div>
                      <div className="p-5 flex-1">
                        {fallbackAccomplishments.length === 0 ? (
                          <p className="text-sm font-medium text-[#8C8580] italic">
                            No accomplishments
                          </p>
                        ) : (
                          <ul className="space-y-3">
                            {fallbackAccomplishments.map((item, i) => (
                              <li
                                key={i}
                                className="flex items-start gap-2 text-xs text-neutral-700"
                              >
                                <div className="w-1.5 h-1.5 rounded-full bg-green-400 mt-1.5 shrink-0" />
                                <span className="leading-relaxed">
                                  {getItemTitle(item)}
                                </span>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </div>

                    {/* Column 3: Tomorrow's Plan */}
                    <div className="bg-white rounded-[16px] border border-[#F0EBE8] flex flex-col overflow-hidden shadow-sm">
                      <div className="bg-[#FEFCE8] px-4 py-3 border-b border-[#F4D35E]/40 flex items-center gap-2 shrink-0">
                        <Circle className="w-4 h-4 text-blue-500" />
                        <h3 className="font-bold text-blue-600 text-sm">
                          Tomorrow's Plan
                        </h3>
                      </div>
                      <div className="p-5 flex-1">
                        {normalized.tomorrow_plan.length === 0 ? (
                          <p className="text-sm font-medium text-[#8C8580] italic">
                            No plan recorded
                          </p>
                        ) : (
                          <ul className="space-y-3">
                            {normalized.tomorrow_plan.map((item, i) => (
                              <li
                                key={i}
                                className="flex items-start gap-2 text-xs text-neutral-700"
                              >
                                <Circle className="w-3 h-3 text-blue-300 mt-0.5 shrink-0" />
                                <span className="leading-relaxed">
                                  {getItemTitle(item)}
                                </span>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* ── Quick Action Buttons ── */}
                  {!isPending && hasValidId && !isLoading && (
                    <div className="space-y-4">
                      <div className="flex flex-wrap gap-2 pt-1">
                        <button
                          onClick={() => setIsTaskModalOpen(true)}
                          className="flex items-center gap-1.5 px-4 py-1.5 text-blue-600 bg-white border border-blue-200 rounded-full text-xs font-bold shadow-sm hover:bg-blue-50 transition-colors"
                        >
                          <Plus className="w-3.5 h-3.5" /> Add Task
                        </button>
                        <button
                          onClick={() => setIsIssueModalOpen(true)}
                          className="flex items-center gap-1.5 px-4 py-1.5 text-red-600 bg-white border border-red-200 rounded-full text-xs font-bold shadow-sm hover:bg-red-50 transition-colors"
                        >
                          <Plus className="w-3.5 h-3.5" /> Stuck Issue
                        </button>
                        <button
                          onClick={() => {
                            setQuickActionOpen(!quickActionOpen);
                            setQuickActionText("");
                          }}
                          className="flex items-center gap-1.5 px-4 py-1.5 text-orange-600 bg-white border border-orange-200 rounded-full text-xs font-bold shadow-sm hover:bg-orange-50 transition-colors"
                        >
                          <Plus className="w-3.5 h-3.5" /> Add to Plan
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
                          className="flex items-center gap-1.5 px-4 py-1.5 text-white bg-purple-600 border border-purple-700 rounded-full text-xs font-bold shadow-sm hover:bg-purple-700 transition-colors"
                        >
                          <MessageSquare className="w-3.5 h-3.5" /> Feedback
                        </button>
                      </div>

                      {/* ── Add to Plan inline input ── */}
                      {quickActionOpen && (
                        <div className="border-t border-[#EAE3DF] pt-4">
                          <p className="text-[10px] font-extrabold text-neutral-400 uppercase tracking-widest mb-3">
                            Quick Actions
                          </p>
                          <div className="flex items-center gap-3">
                            <input
                              autoFocus
                              type="text"
                              value={quickActionText}
                              onChange={(e) =>
                                setQuickActionText(e.target.value)
                              }
                              placeholder="Add to tomorrow's plan..."
                              className="flex-1 border border-gray-300 rounded-full px-4 py-2 text-sm text-neutral-800 focus:outline-none focus:ring-2 focus:ring-orange-200 placeholder:text-neutral-400"
                              onKeyDown={async (e) => {
                                if (
                                  e.key === "Enter" &&
                                  quickActionText.trim()
                                ) {
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
                              className="px-5 py-2 rounded-full text-xs font-bold text-white bg-orange-500 hover:bg-orange-600 transition-colors shadow-sm"
                            >
                              Add
                            </button>
                            <button
                              onClick={() => {
                                setQuickActionOpen(false);
                                setQuickActionText("");
                              }}
                              className="px-5 py-2 rounded-full text-xs font-bold text-neutral-600 bg-white border border-gray-300 hover:bg-gray-50 transition-colors shadow-sm"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      )}

                      {/* ── 2-Column Feedback Block ── */}
                      {feedbackOpen && (
                        <div className="border-t border-[#EAE3DF] pt-5 mt-2">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* COLUMN 1: Add New Feedback */}
                            <div>
                              <p className="text-[10px] font-extrabold text-neutral-400 uppercase tracking-widest mb-4">
                                Provide Feedback
                              </p>
                              <p className="text-sm font-bold text-neutral-800 mb-2">
                                Rating (1-5 stars)
                              </p>
                              <div className="flex items-center gap-1 mb-4">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <button
                                    key={star}
                                    type="button"
                                    onClick={() => setFeedbackRating(star)}
                                    className="transition-transform hover:scale-110"
                                  >
                                    <svg
                                      className="w-8 h-8"
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
                                rows={3}
                                className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm text-neutral-800 focus:outline-none focus:ring-2 focus:ring-purple-200 placeholder:text-neutral-400 resize-y"
                              />
                              <div className="flex items-center gap-3 mt-4">
                                <button
                                  onClick={handleSubmitFeedback}
                                  className="px-6 py-2 rounded-2xl text-sm font-bold text-white bg-purple-600 hover:bg-purple-700 transition-colors shadow-sm"
                                >
                                  Submit Feedback
                                </button>
                                <button
                                  onClick={() => {
                                    setFeedbackOpen(false);
                                    setFeedbackRating(0);
                                    setFeedbackMessage("");
                                  }}
                                  className="px-6 py-2 rounded-2xl text-sm font-bold text-neutral-700 bg-white border border-gray-300 hover:bg-gray-50 transition-colors shadow-sm"
                                >
                                  Cancel
                                </button>
                              </div>
                            </div>

                            {/* COLUMN 2: Recent Feedbacks */}
                            <div className="bg-[#FAF7F5] rounded-xl p-5 border border-[#EAE3DF] h-full flex flex-col">
                              <div className="flex items-center justify-between mb-4">
                                <p className="text-[10px] font-extrabold text-neutral-400 uppercase tracking-widest">
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
                                <div className="space-y-3 overflow-y-auto pr-1 flex-1">
                                  {fetchedFeedbacks
                                    .slice(0, 3)
                                    .map((fb, idx) => (
                                      <div
                                        key={idx}
                                        className="bg-white p-3 rounded-xl shadow-sm border border-gray-100"
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
                                            <span className="text-[9px] text-gray-400 ml-auto font-medium">
                                              {new Date(
                                                fb.created_at
                                              ).toLocaleDateString()}
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
                                      </div>
                                    ))}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* ── Add Task Modal ── */}
      {isTaskModalOpen &&
        createPortal(
          <div className="fixed inset-0 z-[10000] flex">
            <div
              className="flex-1 bg-black/40 backdrop-blur-sm"
              onClick={() => setIsTaskModalOpen(false)}
            />
            <div
              className="relative flex flex-col bg-white shadow-2xl"
              style={{ width: "min(760px, 95vw)" }}
            >
              <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200 shrink-0">
                <h2 className="text-base font-bold text-neutral-900">
                  Add Tasks
                </h2>
                <button
                  onClick={() => setIsTaskModalOpen(false)}
                  className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-gray-100 transition-colors text-neutral-500"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="h-[3px] bg-[#C72030] w-full shrink-0" />
              <div className="flex-1 overflow-y-auto">
                <ProjectTaskCreateModal
                  isEdit={false}
                  onCloseModal={() => setIsTaskModalOpen(false)}
                  className="max-w-full mx-0"
                  prefillData={null}
                  opportunityId={null}
                  onSuccess={async () => {
                    setIsTaskModalOpen(false);
                    await loadDailyData(false);
                  }}
                  isConversion={false}
                />
              </div>
            </div>
          </div>,
          document.body
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
    </>
  );
};

// ─────────────────────────────────────────────
// DailyLogTab — main component
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

  // ✅ Non-working day state
  const [isNonWorkingDay, setIsNonWorkingDay] = useState(false);
  const [meetingDays, setMeetingDays] = useState([]);

  const [departments, setDepartments] = useState([]);
  const [isFetchingDepts, setIsFetchingDepts] = useState(false);
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

  const [meetings, setMeetings] = useState([]);
  const [isFetchingMeetings, setIsFetchingMeetings] = useState(false);
  const loadMeetings = useCallback(async () => {
    setIsFetchingMeetings(true);
    try {
      const data = await fetchMeetingsAPI();
      setMeetings(data);
      if (data.length > 0) {
        // 🛠 FIX: Extract default meeting
        const defaultMeeting = data.find((m) => m.is_default);
        if (defaultMeeting) {
          setSelectedMeetingFilter(defaultMeeting.id);
        } else {
          setSelectedMeetingFilter(data[0].id);
        }
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

  const [apiLogs, setApiLogs] = useState([]);
  const [groupedApiLogs, setGroupedApiLogs] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState(null);

  const [metaSubmitted, setMetaSubmitted] = useState(0);
  const [metaExpected, setMetaExpected] = useState(0);

  const [selectedReport, setSelectedReport] = useState(null);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(searchQuery), 500);
    return () => clearTimeout(t);
  }, [searchQuery]);

  const loadData = useCallback(async () => {
    if (!selectedMeetingFilter) return;
    setIsLoading(true);
    setApiError(null);
    try {
      const response = await fetchDailyLogsFromAPI({
        meetingId: selectedMeetingFilter,
        dateStr: selectedDate,
        isGrouped: false,
        departmentId: selectedDeptId,
        search: debouncedSearch,
      });

      // ✅ Extract meeting_days from config and detect non-working day
      // API response shape: { success, data: { config: { meeting_days: [...] }, total, reports: [...] } }
      const configDays =
        response?.config?.meeting_days ??
        response?.data?.config?.meeting_days ??
        [];
      setMeetingDays(configDays);
      setIsNonWorkingDay(checkIsNonWorkingDay(selectedDate, configDays));

      // ✅ Extract reports array from nested data shape
      let logsArray = Array.isArray(response)
        ? response
        : Array.isArray(response?.reports)
        ? response.reports
        : Array.isArray(response?.data?.reports)
        ? response.data.reports
        : [];

      logsArray = logsArray.filter(
        (log) => log.status && log.status.toLowerCase().trim() === "submitted"
      );

      if (selectedDeptId) {
        logsArray = logsArray.filter(
          (log) => String(log._raw?.department_id) === String(selectedDeptId)
        );
      }

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

      setMetaSubmitted(logsArray.length);
      // ✅ total from API: response.total or response.data.total
      setMetaExpected(
        response?.total ?? response?.data?.total ?? 0
      );
    } catch (err) {
      setApiError(err.message);
      setApiLogs([]);
      setGroupedApiLogs({});
      setMetaSubmitted(0);
      setMetaExpected(0);
      setIsNonWorkingDay(false);
      toast.error(`Failed to load logs: ${err.message}`);
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

  const filterLogs = (arr) => (Array.isArray(arr) ? arr : []);
  const flatFiltered = filterLogs(apiLogs);
  const sortedDepts = Object.keys(groupedApiLogs).sort();

  const TH = ({ children, center }) => (
    <th
      className={cn(
        "px-6 py-4 text-[11px] font-black uppercase tracking-widest text-[#8C8580] whitespace-nowrap border-b border-[#F0EBE8]",
        center ? "text-center" : "text-left"
      )}
    >
      {children}
    </th>
  );

  const renderRow = (log) => {
    const isPending = log.status === "pending";
    const sub = log.submittedAt || "Not Submitted";
    let subLine1 = sub;
    let subLine2 = "";

    if (sub !== "Not Submitted") {
      const subParts = sub.match(/^(.+?),?\s*(\d{4})\s*(.*)$/);
      if (subParts) {
        subLine1 = `${subParts[1]}, ${subParts[2]}`;
        subLine2 = subParts[3];
      }
    }

    return (
      <tr
        key={log.id}
        className="border-b border-[#F0EBE8] hover:bg-[#FCFAFA] transition-colors bg-white"
      >
        <td className="px-6 py-4 text-sm font-semibold text-[#8C8580] whitespace-nowrap">
          {fmt(log.date)}
        </td>
        <td className="px-6 py-4">
          <div className="text-sm font-black text-[#1A1A1A]">{log.user}</div>
          <div className="text-xs font-semibold text-[#8C8580] mt-0.5">
            {log.email}
          </div>
        </td>
        <td className="px-6 py-4">
          <span
            className={cn(
              "flex flex-col justify-center items-center font-semibold p-2 rounded-xl",
              scoreColor(log.score, log.status)
            )}
          >
            {isPending ? "-" : log.score}
          </span>
        </td>
        <td className="px-6 py-4">
          <span className="inline-block px-3.5 py-1.5 rounded-[8px] border border-[#F0EBE8] bg-[#FCFAFA] text-[10px] font-black text-[#8C8580] uppercase tracking-wider">
            {log.dept}
          </span>
        </td>
        <td className="px-6 py-4 max-w-[300px] whitespace-normal break-words">
          <FormattedHighlights text={log.highlights} isPending={isPending} />
        </td>
        <td className="px-6 py-4 text-xs font-semibold text-[#8C8580] whitespace-nowrap">
          <div>{subLine1}</div>
          {subLine2 && <div className="mt-0.5 opacity-80">{subLine2}</div>}
        </td>
        <td className="px-6 py-4 text-center">
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

              {/* ✅ Submitted / Expected / Non-working day — mutually exclusive */}
              <div className="flex items-center gap-4 mt-1.5 text-[12px] font-bold text-[#8C8580] uppercase tracking-widest flex-wrap">
                {isNonWorkingDay ? (
                  // ✅ Non-working day: hide Expected, show amber badge
                  <span className="flex items-center gap-1.5 px-3 py-1 rounded-[8px] bg-amber-50 border border-amber-200 text-amber-700 normal-case tracking-normal text-[11px] font-bold">
                    {/* Sun icon */}
                    <svg
                      className="w-3.5 h-3.5 shrink-0"
                      viewBox="0 0 16 16"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <circle
                        cx="8"
                        cy="8"
                        r="3"
                        stroke="currentColor"
                        strokeWidth="1.5"
                      />
                      <path
                        d="M8 1v1.5M8 13.5V15M1 8h1.5M13.5 8H15M3.05 3.05l1.06 1.06M11.89 11.89l1.06 1.06M11.89 4.11l-1.06 1.06M4.16 11.84l-1.06 1.06"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                      />
                    </svg>
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
                    {metaExpected > 0 && (
                      <span className="flex items-center gap-2">
                        Expected
                        <span className="px-2 py-0.5 rounded-[6px] bg-[#EB4A4A] text-white">
                          {metaExpected}
                        </span>
                      </span>
                    )}
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
              placeholder="Search by user, email..."
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
            <Layers className="w-4 h-4" /> Group by Departments
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
          {apiError.includes("No Auth Token")
            ? "No auth token. Please set it via bootstrapAuthToken() first."
            : `API Error: ${apiError}`}
        </div>
      )}

      {/* ✅ Non-working day banner above table */}
      {isNonWorkingDay && !isLoading && (
        <div className="bg-amber-50 border border-amber-200 rounded-[20px] p-5 mb-6 flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-amber-100 border border-amber-200 flex items-center justify-center shrink-0">
            <svg
              className="w-5 h-5 text-amber-600"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle
                cx="10"
                cy="10"
                r="3.5"
                stroke="currentColor"
                strokeWidth="1.5"
              />
              <path
                d="M10 2v1.5M10 16.5V18M2 10h1.5M16.5 10H18M4.22 4.22l1.06 1.06M14.72 14.72l1.06 1.06M14.72 5.28l-1.06 1.06M5.28 14.72l-1.06 1.06"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </div>
          <div>
            <p className="text-sm font-black text-amber-800">
              Non-working day
            </p>
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
                <>
                  {[1, 2, 3, 4, 5].map((i) => (
                    <tr
                      key={`skeleton-${i}`}
                      className="border-b border-[#F0EBE8] bg-white"
                    >
                      <td className="px-6 py-4">
                        <div className="w-20 h-4 bg-[#F0EBE8] rounded-full" />
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-2">
                          <div className="w-24 h-4 bg-[#F0EBE8] rounded-full" />
                          <div className="w-32 h-3 bg-[#F0EBE8] rounded-full" />
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="w-10 h-6 bg-[#F0EBE8] rounded-[8px]" />
                      </td>
                      <td className="px-6 py-4">
                        <div className="w-20 h-6 bg-[#F0EBE8] rounded-[8px]" />
                      </td>
                      <td className="px-6 py-4">
                        <div className="w-48 h-4 bg-[#F0EBE8] rounded-full" />
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-2">
                          <div className="w-24 h-4 bg-[#F0EBE8] rounded-full" />
                          <div className="w-16 h-3 bg-[#F0EBE8] rounded-full" />
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="w-9 h-9 bg-[#F0EBE8] rounded-[12px] mx-auto" />
                      </td>
                    </tr>
                  ))}
                </>
              ) : !isGrouped && flatFiltered.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="text-center py-20 text-sm font-bold text-[#8C8580]"
                  >
                    {isNonWorkingDay
                      ? "This is a non-working day — no reports are expected."
                      : "No reports found for the selected date and filters."}
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
                      : "No reports found for the selected date and filters."}
                  </td>
                </tr>
              ) : !isGrouped ? (
                flatFiltered.map(renderRow)
              ) : (
                sortedDepts.map((dept) => {
                  const deptLogs = filterLogs(groupedApiLogs[dept]);
                  if (deptLogs.length === 0) return null;
                  return (
                    <React.Fragment key={dept}>
                      <tr className="bg-[#FCFAFA] border-b border-[#F0EBE8]">
                        <td colSpan={7} className="px-6 py-4">
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