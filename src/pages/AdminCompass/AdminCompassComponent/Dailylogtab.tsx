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
  MessageSquare,
  Layers,
  Circle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { fetchDailyLogsFromAPI, getBaseUrl, getAuthHeaders } from "./Shared";
import { toast, Toaster } from "sonner";

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
// API helpers
// ─────────────────────────────────────────────
const createTask = async (payload) => {
  const res = await fetch(`${getBaseUrl()}/tasks`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
};

const createStuckIssue = async (payload) => {
  const res = await fetch(`${getBaseUrl()}/stuck_issues`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
};

const submitFeedback = async (payload) => {
  const res = await fetch(`${getBaseUrl()}/feedbacks`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
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

// ─────────────────────────────────────────────
// Add Task Modal
// ─────────────────────────────────────────────
const AddTaskModal = ({ reportUser, reportId, onClose }) => {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [dueDate, setDueDate] = useState("");
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {
    if (!title.trim()) {
      toast.error("Task title is required.");
      return;
    }
    if (!dueDate) {
      toast.error("Due date is required.");
      return;
    }
    setLoading(true);
    try {
      await createTask({
        title: title.trim(),
        description: desc.trim(),
        priority,
        due_date: dueDate,
        progress: Number(progress),
        user_journal_id: reportId,
      });
      toast.success(`Task created for ${reportUser}`);
      onClose();
    } catch (e) {
      toast.error(e.message);
    } finally {
      setLoading(false);
    }
  };

  return createPortal(
    <div
      className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      style={{ fontFamily: "'Poppins', sans-serif" }}
    >
      <div className="bg-white rounded-[28px] shadow-2xl w-full max-w-[520px] overflow-hidden border border-[#F0EBE8]">
        <div className="flex items-center justify-between px-7 pt-7 pb-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-[12px] bg-[#FDF5F1] border border-[#F6E1D7] flex items-center justify-center">
              <FileText className="w-5 h-5 text-[#D37E5F]" />
            </div>
            <h2 className="text-lg font-black text-[#1A1A1A]">
              Add Task for {reportUser}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center rounded-[14px] bg-white border border-[#F0EBE8] hover:bg-gray-50 text-gray-500 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="px-7 pt-6 pb-8 space-y-5 font-medium">
          <div>
            <label className="block text-sm font-bold text-[#8C8580] mb-1.5 uppercase tracking-wider text-[11px]">
              Task Title <span className="text-[#EB4A4A]">*</span>
            </label>
            <input
              autoFocus
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What needs to be done?"
              className="w-full border border-[#F0EBE8] bg-[#FCFAFA] rounded-[16px] px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#EB4A4A]/20 focus:border-[#EB4A4A] transition-colors text-[#1A1A1A]"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-[#8C8580] mb-1.5 uppercase tracking-wider text-[11px]">
              Description
            </label>
            <textarea
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              placeholder="Additional details..."
              rows={3}
              className="w-full border border-[#F0EBE8] bg-[#FCFAFA] rounded-[16px] px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#EB4A4A]/20 focus:border-[#EB4A4A] resize-none transition-colors text-[#1A1A1A]"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-[#8C8580] mb-1.5 uppercase tracking-wider text-[11px]">
                Priority
              </label>
              <div className="relative">
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  className="w-full appearance-none border border-[#F0EBE8] bg-[#FCFAFA] rounded-[16px] px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#EB4A4A]/20 focus:border-[#EB4A4A] text-[#1A1A1A]"
                >
                  {["Low", "Medium", "High", "Critical"].map((p) => (
                    <option key={p}>{p}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold text-[#8C8580] mb-1.5 uppercase tracking-wider text-[11px]">
                Due Date <span className="text-[#EB4A4A]">*</span>
              </label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full border border-[#F0EBE8] bg-[#FCFAFA] rounded-[16px] px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#EB4A4A]/20 focus:border-[#EB4A4A] text-[#1A1A1A]"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-bold text-[#8C8580] mb-2 uppercase tracking-wider text-[11px]">
              Progress: {progress}%
            </label>
            <input
              type="range"
              min={0}
              max={100}
              step={5}
              value={progress}
              onChange={(e) => setProgress(Number(e.target.value))}
              className="w-full h-2 rounded-full cursor-pointer accent-[#EB4A4A] bg-[#F0EBE8]"
            />
          </div>
          <div className="flex items-center justify-end gap-3 pt-3">
            <button
              onClick={onClose}
              className="px-6 py-3 border border-[#F0EBE8] rounded-[14px] text-sm font-bold text-[#8C8580] hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleCreate}
              disabled={loading}
              className="flex items-center gap-2 px-6 py-3 bg-[#EB4A4A] hover:bg-[#DA3B3B] text-white rounded-[14px] text-sm font-bold shadow-sm transition-colors disabled:opacity-60"
            >
              <Plus className="w-4 h-4" />{" "}
              {loading ? "Creating…" : "Create Task"}
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

// ─────────────────────────────────────────────
// Inline quick-action input
// ─────────────────────────────────────────────
const InlineActionInput = ({ action, reportId, onClose }) => {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);

  const cfg = {
    issue: {
      placeholder: "Enter stuck issue description…",
      btnText: "Add Issue",
      btnCls: "bg-[#F05252] hover:bg-[#DA3B3B]",
      successMsg: "Stuck issue logged.",
      apiCall: (t) =>
        createStuckIssue({ description: t, user_journal_id: reportId }),
    },
    plan: {
      placeholder: "Add to tomorrow's plan…",
      btnText: "Add to Plan",
      btnCls: "bg-[#F4D35E] text-[#856417] hover:bg-[#DAB835]",
      successMsg: "Added to tomorrow's plan.",
      apiCall: (t) =>
        createTask({ title: t, type: "plan", user_journal_id: reportId }),
    },
  }[action];

  if (!cfg) return null;

  const handleSubmit = async () => {
    if (!text.trim()) return;
    setLoading(true);
    try {
      await cfg.apiCall(text.trim());
      toast.success(cfg.successMsg);
      onClose(true);
    } catch (e) {
      toast.error(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-4 space-y-2">
      <div className="flex gap-2">
        <input
          autoFocus
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          placeholder={cfg.placeholder}
          className="flex-1 border border-[#F0EBE8] bg-[#FCFAFA] rounded-[14px] px-4 py-2 text-sm focus:outline-none focus:border-[#EB4A4A] font-medium text-[#1A1A1A]"
        />
        <button
          onClick={handleSubmit}
          disabled={loading}
          className={cn(
            "px-5 py-2 font-bold text-sm rounded-[14px] transition-colors",
            cfg.btnCls,
            loading && "opacity-60"
          )}
        >
          {loading ? "…" : cfg.btnText}
        </button>
        <button
          onClick={() => onClose(false)}
          className="px-4 py-2 border border-[#F0EBE8] rounded-[14px] text-sm font-bold text-[#8C8580] hover:bg-gray-50"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────
// Feedback panel
// ─────────────────────────────────────────────
const FeedbackPanel = ({ reportId, onClose }) => {
  const [rating, setRating] = useState(0);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (rating === 0) {
      toast.error("Please select a rating.");
      return;
    }
    if (!text.trim()) {
      toast.error("Feedback text is required.");
      return;
    }
    setLoading(true);
    try {
      await submitFeedback({
        rating,
        feedback: text.trim(),
        user_journal_id: reportId,
      });
      toast.success("Feedback submitted successfully!");
      onClose(true);
    } catch (e) {
      toast.error(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-4 bg-[#FCFAFA] p-5 rounded-[20px] border border-[#F0EBE8] space-y-4">
      <div className="flex items-center gap-4">
        <span className="text-[11px] uppercase tracking-wider font-bold text-[#8C8580]">
          Rating:
        </span>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((n) => (
            <Star
              key={n}
              onClick={() => setRating(n)}
              className={cn(
                "w-7 h-7 cursor-pointer transition-colors",
                n <= rating
                  ? "text-[#F4D35E] fill-[#F4D35E]"
                  : "text-gray-300 hover:text-[#F4D35E]/50"
              )}
            />
          ))}
        </div>
      </div>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Enter constructive feedback…"
        rows={3}
        className="w-full border border-[#F0EBE8] rounded-[14px] px-4 py-3 text-sm font-medium text-[#1A1A1A] resize-none focus:outline-none focus:border-[#EB4A4A]"
      />
      <div className="flex justify-end gap-2 mt-2">
        <button
          onClick={() => onClose(false)}
          className="px-5 py-2.5 border border-[#F0EBE8] rounded-[14px] text-sm font-bold text-[#8C8580] hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="px-5 py-2.5 bg-[#EB4A4A] hover:bg-[#DA3B3B] text-white rounded-[14px] text-sm font-bold transition-colors disabled:opacity-60"
        >
          {loading ? "Submitting…" : "Submit Feedback"}
        </button>
      </div>
    </div>
  );
};

/// ─────────────────────────────────────────────
// Report Detail Modal (API Integrated + 3-Column Layout)
// ─────────────────────────────────────────────
const ReportDetailModal = ({ log, onClose }) => {
  const [activeAction, setActiveAction] = useState(null);
  const [taskModalOpen, setTaskModalOpen] = useState(false);

  // API Fetch State
  const [details, setDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const isPending = log.status === "pending";

  useEffect(() => {
    const fetchDetails = async () => {
      // Agar pending hai ya dummy ID hai, toh API call mat karo
      if (isPending || !log.id || String(log.id).startsWith("user-")) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        const baseUrl = getBaseUrl(); // Shared.jsx ka function
        const headers = getAuthHeaders(); // Shared.jsx ka function
        const url = `${baseUrl}/user_journals/${log.id}.json`;

        const res = await fetch(url, { method: "GET", headers });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const data = await res.json();
        setDetails(data);
      } catch (error) {
        toast.error("Failed to load report details: " + error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDetails();
  }, [log.id, isPending]);

  // Extract data from API response or fallback to empty arrays
  const reportData = details?.report_data || {};

  const tasks = Array.isArray(reportData.tasks_issues)
    ? reportData.tasks_issues
    : [];
  const accomplishments = Array.isArray(reportData.accomplishments)
    ? reportData.accomplishments
    : [];
  const plans = Array.isArray(reportData.tomorrow_plan)
    ? reportData.tomorrow_plan
    : [];

  // Agar accomplishments empty hai, toh table wala highlight dikha do
  const fallbackAccomplishments =
    accomplishments.length === 0 && log.highlights && !isPending
      ? [{ title: log.highlights }]
      : accomplishments;

  // JSON me text "title", "text", ya "description" key me ho sakta hai
  const getText = (item) =>
    typeof item === "string"
      ? item
      : item.title || item.text || item.description || "";

  return (
    <>
      {createPortal(
        <div
          className="fixed inset-0 z-[9990] flex items-center justify-center p-4 sm:p-6"
          style={{ fontFamily: "'Poppins', sans-serif" }}
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
            onClick={onClose}
          />

          {/* Modal Container */}
          <div className="relative z-10 bg-[#FCFAFA] w-full max-w-[1100px] max-h-[90vh] shadow-2xl flex flex-col rounded-[20px] overflow-hidden">
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
                // Loading Skeleton
                <div className="flex flex-col items-center justify-center h-40 space-y-4">
                  <RefreshCw className="w-8 h-8 text-[#EB4A4A] animate-spin" />
                  <p className="text-sm font-bold text-[#8C8580]">
                    Fetching journal details...
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
                  {/* Column 1: Tasks & Issues */}
                  <div className="bg-white rounded-[16px] border border-[#F0EBE8] flex flex-col overflow-hidden shadow-sm">
                    <div className="bg-[#FFF5F5] px-4 py-3 border-b border-[#F05252]/20 flex items-center gap-2 shrink-0">
                      <Circle
                        className="w-4 h-4 text-[#F05252]"
                        fill="#F05252"
                        fillOpacity={0.15}
                      />
                      <h3 className="font-bold text-[#F05252] text-sm">
                        Tasks & Issues
                      </h3>
                    </div>
                    <div className="p-5 flex-1">
                      {tasks.length === 0 ? (
                        <p className="text-sm font-medium text-[#8C8580] italic">
                          No tasks or issues
                        </p>
                      ) : (
                        <ul className="space-y-4">
                          {tasks.map((item, i) => {
                            const t = getText(item);
                            const isTask =
                              item.type === "task" ||
                              t.toLowerCase().includes("task");
                            return (
                              <li key={i} className="flex items-start gap-3">
                                <Circle className="w-4 h-4 text-[#F05252] shrink-0 mt-0.5" />
                                <span className="text-sm font-medium text-gray-700 leading-relaxed flex-1">
                                  {t}
                                </span>
                                {isTask && (
                                  <span className="text-[10px] bg-blue-50 text-blue-500 border border-blue-100 px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wide shrink-0">
                                    Task
                                  </span>
                                )}
                              </li>
                            );
                          })}
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
                        <ul className="space-y-4">
                          {fallbackAccomplishments.map((item, i) => {
                            const t = getText(item);
                            const tLower = t.toLowerCase();
                            const isInProcess =
                              tLower.includes("in process") ||
                              tLower.includes("started");
                            const Icon = isInProcess ? Circle : CheckCircle2;

                            return (
                              <li key={i} className="flex items-start gap-3">
                                <Icon className="w-4 h-4 text-[#2ECC71] shrink-0 mt-0.5" />
                                <span className="text-sm font-medium text-gray-700 leading-relaxed">
                                  {t}
                                </span>
                              </li>
                            );
                          })}
                        </ul>
                      )}
                    </div>
                  </div>

                  {/* Column 3: Tomorrow's Plan */}
                  <div className="bg-white rounded-[16px] border border-[#F0EBE8] flex flex-col overflow-hidden shadow-sm">
                    <div className="bg-[#FEFCE8] px-4 py-3 border-b border-[#F4D35E]/40 flex items-center gap-2 shrink-0">
                      <div className="w-2 h-2 rounded-full bg-[#DAB835] ml-1" />
                      <h3 className="font-bold text-[#DAB835] text-sm ml-1">
                        Tomorrow's Plan
                      </h3>
                    </div>
                    <div className="p-5 flex-1">
                      {plans.length === 0 ? (
                        <p className="text-sm font-medium text-[#8C8580] italic">
                          No plan recorded
                        </p>
                      ) : (
                        <ul className="space-y-4">
                          {plans.map((item, i) => {
                            const t = getText(item);
                            return (
                              <li key={i} className="flex items-start gap-3">
                                <div className="w-1.5 h-1.5 rounded-full bg-[#DAB835] shrink-0 mt-2 ml-1" />
                                <span className="text-sm font-medium text-gray-700 leading-relaxed">
                                  {t}
                                </span>
                              </li>
                            );
                          })}
                        </ul>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Footer / Quick Actions */}
            {!isPending &&
              log.id &&
              !String(log.id).startsWith("user-") &&
              !isLoading && (
                <div className="px-6 py-5 border-t border-[#F0EBE8] bg-white shrink-0">
                  <p className="text-[11px] font-black text-[#8C8580] uppercase tracking-widest mb-3">
                    Quick Actions
                  </p>
                  {activeAction === null && (
                    <div className="flex flex-wrap items-center gap-3">
                      <button
                        onClick={() => setTaskModalOpen(true)}
                        className="flex items-center gap-2 px-4 py-2 border border-[#F0EBE8] bg-white rounded-[12px] text-sm font-bold text-[#1A1A1A] hover:bg-gray-50 transition-colors shadow-sm"
                      >
                        <Plus className="w-4 h-4 text-blue-600" /> Task
                      </button>
                      <button
                        onClick={() => setActiveAction("issue")}
                        className="flex items-center gap-2 px-4 py-2 border border-[#F0EBE8] bg-white rounded-[12px] text-sm font-bold text-[#1A1A1A] hover:bg-gray-50 transition-colors shadow-sm"
                      >
                        <Plus className="w-4 h-4 text-red-500" /> Stuck Issue
                      </button>
                      <button
                        onClick={() => setActiveAction("plan")}
                        className="flex items-center gap-2 px-4 py-2 border border-[#F0EBE8] bg-white rounded-[12px] text-sm font-bold text-[#1A1A1A] hover:bg-gray-50 transition-colors shadow-sm"
                      >
                        <Plus className="w-4 h-4 text-yellow-500" /> Add to Plan
                      </button>

                      <button
                        onClick={() => setActiveAction("feedback")}
                        className="flex items-center gap-2 px-5 py-2 bg-[#8B5CF6] text-white rounded-[12px] text-sm font-bold shadow-sm hover:bg-[#7C3AED] transition-all ml-auto"
                      >
                        Feedback
                      </button>
                    </div>
                  )}

                  {/* Inline Action Inputs */}
                  {(activeAction === "issue" || activeAction === "plan") && (
                    <InlineActionInput
                      action={activeAction}
                      reportId={log.id}
                      onClose={() => setActiveAction(null)}
                    />
                  )}
                  {activeAction === "feedback" && (
                    <FeedbackPanel
                      reportId={log.id}
                      onClose={() => setActiveAction(null)}
                    />
                  )}
                </div>
              )}
          </div>
        </div>,
        document.body
      )}

      {/* Task Modal Overlay */}
      {taskModalOpen && !isPending && (
        <AddTaskModal
          reportUser={log.user}
          reportId={log.id}
          onClose={() => setTaskModalOpen(false)}
        />
      )}
    </>
  );
};

// ─────────────────────────────────────────────
// ✅ Simple FormattedHighlights Component (No Red BG, Auto-wrap)
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

  // Format 1: "Acc: 8 | Chal: 0"
  const matchAccChal = text.match(/Acc:\s*(\d+)\s*\|\s*Chal:\s*(\d+)/i);
  if (matchAccChal) {
    return (
      <span className="text-sm text-[#1A1A1A]">
        <span className="font-bold">{matchAccChal[1]}</span> accomplishments,{" "}
        <span className="font-bold">{matchAccChal[2]}</span> challenges
      </span>
    );
  }

  // Format 2: "8 accomplishments, 0 challenges"
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

  // Fallback for normal text
  return <span className="text-sm text-[#1A1A1A]">{text}</span>;
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
      if (data.length > 0) setSelectedMeetingFilter(data[0].id);
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

      let logsArray = Array.isArray(response) ? response : [];

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

      setMetaExpected(response.total || logsArray.length);
      setMetaSubmitted(response.submitted || logsArray.length);
    } catch (err) {
      setApiError(err.message);
      setApiLogs([]);
      setGroupedApiLogs({});
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
        {/* Score Column */}
        <td className="px-6 py-4">
          <span
            className={cn(
              // inline-grid aur place-items-center duniya ka sabse perfect centering solution hai
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
        {/* ✅ Updated TD with normal text wrapping and no scroll */}
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
      <Toaster
        position="bottom-right"
        toastOptions={{
          classNames: {
            toast:
              "font-['Poppins'] shadow-lg border rounded-[16px] text-sm font-semibold",
            success: "bg-[#F0FDF4] border-[#BBF7D0] text-[#166534]",
            error: "bg-[#FFF1F2] border-[#FECDD3] text-[#BE123C]",
            warning: "bg-amber-50 border-amber-200 text-amber-900",
            info: "bg-sky-50 border-sky-200 text-sky-900",
          },
        }}
      />

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
              <div className="flex items-center gap-4 mt-1.5 text-[12px] font-bold text-[#8C8580] uppercase tracking-widest">
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
          {/* Search */}
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

          {/* Group toggle */}
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

          {/* Refresh */}
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
        <div className="bg-[#EB4A4A]/10 text-[#EB4A4A] text-sm font-bold p-5 rounded-[20px] flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 shrink-0" />
          {apiError.includes("No Auth Token")
            ? "No auth token. Please set it via bootstrapAuthToken() first."
            : `API Error: ${apiError}`}
        </div>
      )}

      {/* Table */}
      <div className="bg-white border border-[#F0EBE8] rounded-[32px] shadow-sm overflow-hidden ">
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
                        <div className="w-20 h-4 bg-[#F0EBE8] rounded-full"></div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-2">
                          <div className="w-24 h-4 bg-[#F0EBE8] rounded-full"></div>
                          <div className="w-32 h-3 bg-[#F0EBE8] rounded-full"></div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="w-10 h-6 bg-[#F0EBE8] rounded-[8px]"></div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="w-20 h-6 bg-[#F0EBE8] rounded-[8px]"></div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="w-48 h-4 bg-[#F0EBE8] rounded-full"></div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-2">
                          <div className="w-24 h-4 bg-[#F0EBE8] rounded-full"></div>
                          <div className="w-16 h-3 bg-[#F0EBE8] rounded-full"></div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="w-9 h-9 bg-[#F0EBE8] rounded-[12px] mx-auto"></div>
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
                    No reports found for the selected date and filters.
                  </td>
                </tr>
              ) : isGrouped && sortedDepts.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="text-center py-20 text-sm font-bold text-[#8C8580]"
                  >
                    No reports found for the selected date and filters.
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
