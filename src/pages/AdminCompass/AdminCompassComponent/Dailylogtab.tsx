// ─────────────────────────────────────────────
// DailyLogTab.jsx — Coral/Amber Theme
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
import {
  fetchDailyLogsFromAPI,
  departmentOptions,
  meetingOptions,
  BASE_URL,
  getAuthHeaders,
} from "./shared";

// ─────────────────────────────────────────────
// API helpers
// ─────────────────────────────────────────────
const createTask = async (payload) => {
  const headers = getAuthHeaders();
  const res = await fetch(`${BASE_URL}/tasks`, {
    method: "POST",
    headers,
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
};

const createStuckIssue = async (payload) => {
  const headers = getAuthHeaders();
  const res = await fetch(`${BASE_URL}/stuck_issues`, {
    method: "POST",
    headers,
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
};

const submitFeedback = async (payload) => {
  const headers = getAuthHeaders();
  const res = await fetch(`${BASE_URL}/feedbacks`, {
    method: "POST",
    headers,
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

const scoreColor = (s) => {
  if (s >= 50) return "bg-green-100 text-green-700";
  return "bg-red-100 text-red-500";
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
  const [error, setError] = useState(null);

  const handleCreate = async () => {
    if (!title.trim()) {
      setError("Task title is required.");
      return;
    }
    if (!dueDate) {
      setError("Due date is required.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await createTask({
        title: title.trim(),
        description: desc.trim(),
        priority,
        due_date: dueDate,
        progress: Number(progress),
        user_journal_id: reportId,
      });
      onClose();
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-[520px]">
        <div className="flex items-center justify-between px-7 pt-7 pb-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-[#FAECE7] flex items-center justify-center">
              <FileText className="w-5 h-5 text-[#DA7756]" />
            </div>
            <h2 className="text-base font-bold text-gray-900">
              Add Task for {reportUser}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-2xl hover:bg-[#fef6f4] text-gray-400 hover:text-[#DA7756] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="px-7 pt-5 pb-7 space-y-5">
          {error && (
            <div className="bg-red-50 text-red-600 text-sm p-3 rounded-2xl flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" /> {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-1.5">
              Task Title <span className="text-[#DA7756]">*</span>
            </label>
            <input
              autoFocus
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What needs to be done?"
              className="w-full border border-gray-300 rounded-2xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#DA7756]/20 focus:border-[#DA7756] transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-1.5">
              Description
            </label>
            <textarea
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              placeholder="Additional details..."
              rows={3}
              className="w-full border border-gray-300 rounded-2xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#DA7756]/20 focus:border-[#DA7756] resize-none transition-colors"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-1.5">
                Priority
              </label>
              <div className="relative">
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  className="w-full appearance-none border border-gray-300 rounded-2xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#DA7756]/20 focus:border-[#DA7756] bg-white"
                >
                  {["Low", "Medium", "High", "Critical"].map((p) => (
                    <option key={p}>{p}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-1.5">
                Due Date <span className="text-[#DA7756]">*</span>
              </label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full border border-gray-300 rounded-2xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#DA7756]/20 focus:border-[#DA7756]"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-2">
              Progress: {progress}%
            </label>
            <input
              type="range"
              min={0}
              max={100}
              step={5}
              value={progress}
              onChange={(e) => setProgress(Number(e.target.value))}
              className="w-full h-1.5 rounded-full cursor-pointer accent-[#DA7756]"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-1">
            <button
              onClick={onClose}
              className="px-5 py-2.5 border border-gray-300 rounded-2xl text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleCreate}
              disabled={loading}
              className="flex items-center gap-2 px-5 py-2.5 bg-[#DA7756] hover:bg-[#c9673f] text-white rounded-2xl text-sm font-semibold shadow-sm transition-colors disabled:opacity-60"
            >
              <Plus className="w-4 h-4" />
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
  const [error, setError] = useState(null);

  const cfg = {
    issue: {
      placeholder: "Enter stuck issue description…",
      btnText: "Add Issue",
      btnCls: "bg-red-500 hover:bg-red-600",
      apiCall: (t) =>
        createStuckIssue({ description: t, user_journal_id: reportId }),
    },
    plan: {
      placeholder: "Add to tomorrow's plan…",
      btnText: "Add to Plan",
      btnCls: "bg-[#DA7756] hover:bg-[#c9673f]",
      apiCall: (t) =>
        createTask({ title: t, type: "plan", user_journal_id: reportId }),
    },
  }[action];

  if (!cfg) return null;

  const handleSubmit = async () => {
    if (!text.trim()) return;
    setLoading(true);
    setError(null);
    try {
      await cfg.apiCall(text.trim());
      onClose(true);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-3 space-y-1.5">
      {error && <p className="text-xs text-red-500">{error}</p>}
      <div className="flex gap-2">
        <input
          autoFocus
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          placeholder={cfg.placeholder}
          className="flex-1 border border-[rgba(218,119,86,0.22)] rounded-2xl px-3 py-2 text-sm focus:outline-none focus:border-[#DA7756]"
        />
        <button
          onClick={handleSubmit}
          disabled={loading}
          className={cn(
            "px-4 py-2 text-white text-sm font-semibold rounded-2xl transition-colors",
            cfg.btnCls,
            loading && "opacity-60"
          )}
        >
          {loading ? "…" : cfg.btnText}
        </button>
        <button
          onClick={() => onClose(false)}
          className="px-3 py-2 border border-[rgba(218,119,86,0.22)] rounded-2xl text-sm text-gray-600 hover:bg-[#fef6f4]"
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
  const [error, setError] = useState(null);

  const handleSubmit = async () => {
    if (rating === 0) {
      setError("Please select a rating.");
      return;
    }
    if (!text.trim()) {
      setError("Feedback text is required.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await submitFeedback({
        rating,
        feedback: text.trim(),
        user_journal_id: reportId,
      });
      onClose(true);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-3 bg-[#fdf8f6] p-4 rounded-2xl border border-[rgba(218,119,86,0.18)] space-y-3">
      {error && <p className="text-xs text-red-500">{error}</p>}
      <div className="flex items-center gap-3">
        <span className="text-sm font-bold text-gray-700">Rating:</span>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((n) => (
            <Star
              key={n}
              onClick={() => setRating(n)}
              className={cn(
                "w-6 h-6 cursor-pointer transition-colors",
                n <= rating
                  ? "text-amber-400 fill-amber-400"
                  : "text-gray-300 hover:text-amber-300"
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
        className="w-full border border-[rgba(218,119,86,0.22)] rounded-2xl px-3 py-2 text-sm resize-none focus:outline-none focus:border-[#DA7756]"
      />
      <div className="flex justify-end gap-2">
        <button
          onClick={() => onClose(false)}
          className="px-4 py-2 border border-[rgba(218,119,86,0.22)] rounded-2xl text-sm font-semibold text-gray-700 hover:bg-[#fef6f4]"
        >
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="px-4 py-2 bg-[#DA7756] hover:bg-[#c9673f] text-white rounded-2xl text-sm font-semibold transition-colors disabled:opacity-60"
        >
          {loading ? "Submitting…" : "Submit Feedback"}
        </button>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────
// Report Detail Modal
// ─────────────────────────────────────────────
const ReportDetailModal = ({ log, onClose }) => {
  const [activeAction, setActiveAction] = useState(null);
  const [taskModalOpen, setTaskModalOpen] = useState(false);

  const raw = log._raw || {};
  const tasks = Array.isArray(raw.tasks_and_issues)
    ? raw.tasks_and_issues
    : Array.isArray(raw.tasks)
      ? raw.tasks
      : [];
  const accomplishments = Array.isArray(raw.accomplishments)
    ? raw.accomplishments
    : [];
  const plans = Array.isArray(raw.plans)
    ? raw.plans
    : Array.isArray(raw.tomorrows_plan)
      ? raw.tomorrows_plan
      : [];
  const fallbackAccomplishments =
    accomplishments.length === 0 && log.highlights
      ? [{ text: log.highlights }]
      : accomplishments;
  const handleActionDone = () => setActiveAction(null);

  return (
    <>
      {createPortal(
        <div className="fixed inset-0 z-[9990] flex items-start justify-end">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={onClose}
          />
          <div className="relative z-10 bg-white h-full w-full max-w-[680px] shadow-2xl flex flex-col overflow-hidden">
            {/* Header */}
            <div className="px-6 pt-5 pb-4 border-b border-[rgba(218,119,86,0.12)] shrink-0 flex items-start justify-between">
              <div>
                <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-[#DA7756]" />
                  {log.user} — Daily Report
                </h3>
                <p className="text-xs text-gray-400 mt-0.5">
                  {log.dept}
                  {log.date && <> · {fmt(log.date)}</>}
                  {log.submittedAt && <> · Submitted: {log.submittedAt}</>}
                </p>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 flex items-center justify-center rounded-2xl hover:bg-[#fef6f4] text-gray-400 hover:text-[#DA7756] transition-colors shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              <div className="grid grid-cols-1 gap-4">
                {/* Tasks & Issues */}
                <div className="bg-red-50 rounded-2xl border border-red-100 p-4">
                  <h4 className="flex items-center gap-2 text-sm font-bold text-red-500 mb-3">
                    <div className="w-5 h-5 rounded-full border-2 border-red-500 flex items-center justify-center">
                      <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
                    </div>
                    Tasks &amp; Issues
                  </h4>
                  {tasks.length === 0 ? (
                    <p className="text-xs text-gray-400 italic">
                      No tasks or issues
                    </p>
                  ) : (
                    <ul className="space-y-2">
                      {tasks.map((item, i) => {
                        const t =
                          typeof item === "string"
                            ? item
                            : item.text || item.description || "";
                        const type = item.type || null;
                        return (
                          <li key={i} className="flex items-start gap-2">
                            <Circle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                            <span className="text-sm text-gray-700 flex-1 leading-snug">
                              {t}
                            </span>
                            {type && (
                              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-lg bg-white border border-red-200 text-red-500 shrink-0">
                                {type}
                              </span>
                            )}
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </div>

                {/* Accomplishments */}
                <div className="bg-green-50 rounded-2xl border border-green-100 p-4">
                  <h4 className="flex items-center gap-2 text-sm font-bold text-green-600 mb-3">
                    <CheckCircle2 className="w-4 h-4" /> Accomplishments
                  </h4>
                  {fallbackAccomplishments.length === 0 ? (
                    <p className="text-xs text-gray-400 italic">
                      No accomplishments
                    </p>
                  ) : (
                    <ul className="space-y-2">
                      {fallbackAccomplishments.map((item, i) => {
                        const t =
                          typeof item === "string"
                            ? item
                            : item.text || item.description || "";
                        return (
                          <li key={i} className="flex items-start gap-2">
                            <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                            <span className="text-sm text-gray-700 leading-snug">
                              {t}
                            </span>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </div>

                {/* Tomorrow's Plan */}
                <div className="bg-[#fdf6ee] rounded-2xl border border-amber-100 p-4">
                  <h4 className="flex items-center gap-2 text-sm font-bold text-amber-600 mb-3">
                    <ArrowRight className="w-4 h-4" /> Tomorrow's Plan
                  </h4>
                  {plans.length === 0 ? (
                    <p className="text-xs text-gray-400 italic">
                      No plan recorded
                    </p>
                  ) : (
                    <ul className="space-y-2">
                      {plans.map((item, i) => {
                        const t =
                          typeof item === "string"
                            ? item
                            : item.text || item.description || "";
                        return (
                          <li key={i} className="flex items-start gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0 mt-2" />
                            <span className="text-sm text-gray-700 leading-snug">
                              {t}
                            </span>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </div>
              </div>

              {/* Quick Actions */}
              <div>
                <p className="text-[10px] font-bold text-[#DA7756]/60 uppercase tracking-widest mb-2">
                  QUICK ACTIONS
                </p>
                {activeAction === null && (
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => setTaskModalOpen(true)}
                      className="flex items-center gap-1.5 px-4 py-2 border border-[rgba(218,119,86,0.22)] rounded-2xl text-sm font-semibold text-gray-700 hover:border-[#DA7756] hover:text-[#DA7756] hover:bg-[#fef6f4] transition-all"
                    >
                      <Plus className="w-4 h-4" /> Task
                    </button>
                    <button
                      onClick={() => setActiveAction("issue")}
                      className="flex items-center gap-1.5 px-4 py-2 border border-[rgba(218,119,86,0.22)] rounded-2xl text-sm font-semibold text-gray-700 hover:border-red-400 hover:text-red-600 hover:bg-red-50 transition-all"
                    >
                      <Plus className="w-4 h-4" /> Stuck Issue
                    </button>
                    <button
                      onClick={() => setActiveAction("plan")}
                      className="flex items-center gap-1.5 px-4 py-2 border border-amber-200 rounded-2xl text-sm font-semibold text-amber-700 hover:bg-amber-50 transition-all"
                    >
                      <Plus className="w-4 h-4" /> Add to Plan
                    </button>
                    <button
                      onClick={() => setActiveAction("feedback")}
                      className="flex items-center gap-1.5 px-4 py-2 bg-[#DA7756] hover:bg-[#c9673f] text-white rounded-2xl text-sm font-semibold shadow-sm transition-all"
                    >
                      <MessageSquare className="w-4 h-4" /> Feedback
                    </button>
                  </div>
                )}
                {(activeAction === "issue" || activeAction === "plan") && (
                  <InlineActionInput
                    action={activeAction}
                    reportId={log.id}
                    onClose={handleActionDone}
                  />
                )}
                {activeAction === "feedback" && (
                  <FeedbackPanel reportId={log.id} onClose={handleActionDone} />
                )}
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}

      {taskModalOpen && (
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
// DailyLogTab — main component
// ─────────────────────────────────────────────
const DailyLogTab = () => {
  const [selectedDate, setSelectedDate] = useState(
    () => new Date().toISOString().split("T")[0]
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedDeptId, setSelectedDeptId] = useState("");
  const [selectedMeetingFilter, setSelectedMeetingFilter] = useState("1");
  const [isGrouped, setIsGrouped] = useState(false); // ← initially off

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
    setIsLoading(true);
    setApiError(null);
    try {
      const data = await fetchDailyLogsFromAPI({
        meetingId: selectedMeetingFilter,
        dateStr: selectedDate,
        isGrouped,
        departmentId: selectedDeptId,
        search: debouncedSearch,
      });

      if (isGrouped) {
        const grouped =
          typeof data === "object" && !Array.isArray(data) ? data : {};
        setGroupedApiLogs(grouped);
        setApiLogs([]);
        const allLogs = Object.values(grouped).flat();
        setMetaSubmitted(allLogs.length);
        const meta = data?._meta || data?.meta;
        setMetaExpected(meta?.expected ?? allLogs.length);
      } else {
        const flat = Array.isArray(data) ? data : [];
        setApiLogs(flat);
        setGroupedApiLogs({});
        setMetaSubmitted(flat.length);
        setMetaExpected(flat.length);
      }
    } catch (err) {
      setApiError(err.message);
      setApiLogs([]);
      setGroupedApiLogs({});
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
    const m = d.toLocaleDateString("en-US", { month: "short" });
    const day = d.getDate();
    const wd = d.toLocaleDateString("en-US", { weekday: "short" });
    return `${m} ${day} (${wd})`;
  })();

  const filterLogs = (arr) => (Array.isArray(arr) ? arr : []);
  const flatFiltered = filterLogs(apiLogs);
  const sortedDepts = Object.keys(groupedApiLogs).sort();
  const totalGrouped = sortedDepts.reduce(
    (s, k) => s + filterLogs(groupedApiLogs[k]).length,
    0
  );
  const displayCount = isGrouped ? totalGrouped : flatFiltered.length;

  const SortIcon = () => (
    <span className="inline-flex flex-col gap-px ml-1 opacity-40">
      <svg width="7" height="4" viewBox="0 0 7 4" fill="none">
        <path d="M3.5 0L7 4H0L3.5 0Z" fill="currentColor" />
      </svg>
      <svg width="7" height="4" viewBox="0 0 7 4" fill="none">
        <path d="M3.5 4L0 0H7L3.5 4Z" fill="currentColor" />
      </svg>
    </span>
  );

  const TH = ({ children, center }) => (
    <th
      className={cn(
        "px-4 py-3 text-xs font-semibold text-gray-500 whitespace-nowrap",
        center ? "text-center" : "text-left"
      )}
    >
      {center ? (
        children
      ) : (
        <span className="inline-flex items-center">
          {children}
          <SortIcon />
        </span>
      )}
    </th>
  );

  const renderRow = (log) => {
    const sub = log.submittedAt || "";
    const subParts = sub.match(/^(.+?),?\s*(\d{4})\s*(.*)$/);
    const subLine1 = subParts ? `${subParts[1]}, ${subParts[2]}` : sub;
    const subLine2 = subParts ? subParts[3] : "";

    return (
      <tr
        key={log.id}
        className="border-b border-[rgba(218,119,86,0.08)] hover:bg-[#fdf8f6] transition-colors"
      >
        <td className="px-4 py-3 text-sm text-gray-600 whitespace-nowrap">
          {fmt(log.date) || log.date || selectedDate}
        </td>
        <td className="px-4 py-3">
          <div className="text-sm font-semibold text-gray-900">{log.user}</div>
          <div className="text-xs text-gray-400 mt-0.5">{log.email}</div>
        </td>
        <td className="px-4 py-3">
          <span
            className={cn(
              "inline-block px-2.5 py-1 rounded-2xl text-xs font-bold min-w-[32px] text-center",
              scoreColor(log.score)
            )}
          >
            {log.score}
          </span>
        </td>
        <td className="px-4 py-3">
          <span className="inline-block px-3 py-1 rounded-2xl border border-[rgba(218,119,86,0.2)] text-xs text-[#993C1D] bg-[#FAECE7] font-medium">
            {log.dept}
          </span>
        </td>
        <td className="px-4 py-3 text-sm text-gray-500 max-w-[240px]">
          {log.highlights}
        </td>
        <td className="px-4 py-3 text-xs text-gray-500 whitespace-nowrap">
          <div>{subLine1}</div>
          {subLine2 && <div className="mt-0.5">{subLine2}</div>}
        </td>
        <td className="px-4 py-3 text-center">
          <button
            onClick={() => setSelectedReport(log)}
            className="inline-flex items-center justify-center w-8 h-8 rounded-2xl border border-[rgba(218,119,86,0.22)] text-[#DA7756] hover:bg-[#fef6f4] hover:border-[#DA7756] transition-all"
            title="View details"
          >
            <Eye className="w-4 h-4" />
          </button>
        </td>
      </tr>
    );
  };

  return (
    <div className="space-y-4 pb-12 px-4 sm:px-6">
      {/* Header card */}
      <div className="bg-white rounded-2xl border border-[rgba(218,119,86,0.18)] shadow-sm p-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-5">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-2xl bg-[#FAECE7] border border-[rgba(218,119,86,0.2)] flex items-center justify-center shrink-0">
              <FileText className="w-5 h-5 text-[#DA7756]" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900">
                Daily Report Log for {titleDate}
              </h1>
              <div className="flex items-center gap-4 mt-1.5 text-sm text-gray-500">
                <span>
                  Submitted:{" "}
                  <span className="inline-block px-2 py-0.5 rounded-2xl bg-green-500 text-white text-xs font-bold ml-1">
                    {displayCount}
                  </span>
                </span>
                {metaExpected > 0 && (
                  <span>
                    Expected:{" "}
                    <span className="inline-block px-2 py-0.5 rounded-2xl bg-[#DA7756] text-white text-xs font-bold ml-1">
                      {metaExpected}
                    </span>
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Date nav */}
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={() => shiftDate(-1)}
              className="w-9 h-9 flex items-center justify-center border border-[rgba(218,119,86,0.22)] rounded-2xl hover:bg-[#fef6f4] text-[#DA7756] transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => {
                if (e.target.value) setSelectedDate(e.target.value);
              }}
              className="border border-[rgba(218,119,86,0.22)] rounded-2xl py-2 px-3 text-sm font-medium text-gray-700 focus:outline-none focus:border-[#DA7756] w-[145px]"
            />
            <button
              onClick={() => shiftDate(1)}
              className="w-9 h-9 flex items-center justify-center border border-[rgba(218,119,86,0.22)] rounded-2xl hover:bg-[#fef6f4] text-[#DA7756] transition-colors"
            >
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Filter bar */}
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
          <div className="relative flex-1 min-w-0">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#DA7756]/40" />
            <input
              type="text"
              placeholder="Search by user, email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-8 py-2.5 text-sm border border-[rgba(218,119,86,0.22)] rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#DA7756]/20 focus:border-[#DA7756] bg-[#fdf8f6]/60 transition-colors"
            />
            {searchQuery !== debouncedSearch && (
              <RefreshCw className="w-3.5 h-3.5 absolute right-3 top-1/2 -translate-y-1/2 text-[#DA7756] animate-spin" />
            )}
            {searchQuery && searchQuery === debouncedSearch && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#DA7756]"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="relative shrink-0">
            <select
              value={selectedDeptId}
              onChange={(e) => setSelectedDeptId(e.target.value)}
              className="appearance-none border border-[rgba(218,119,86,0.22)] rounded-2xl pl-4 pr-8 py-2.5 text-sm text-gray-700 bg-white focus:outline-none focus:border-[#DA7756] shadow-sm min-w-[155px]"
            >
              <option value="">Department</option>
              {departmentOptions.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.label}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>

          <div className="relative shrink-0">
            <select
              value={selectedMeetingFilter}
              onChange={(e) => setSelectedMeetingFilter(e.target.value)}
              className="appearance-none border border-[rgba(218,119,86,0.22)] rounded-2xl pl-4 pr-8 py-2.5 text-sm text-gray-700 bg-white focus:outline-none focus:border-[#DA7756] shadow-sm min-w-[150px]"
            >
              {meetingOptions.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.label}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>

          <button
            onClick={() => setIsGrouped(!isGrouped)}
            className={cn(
              "flex items-center gap-2 px-4 py-2.5 rounded-2xl text-sm font-semibold border transition-all shrink-0",
              isGrouped
                ? "bg-[#DA7756] border-[#DA7756] text-white shadow-md"
                : "bg-white border-[rgba(218,119,86,0.22)] text-gray-700 hover:bg-[#fef6f4] hover:border-[#DA7756] hover:text-[#DA7756]"
            )}
          >
            <Layers className="w-4 h-4" /> Group by Dept
          </button>

          <button
            onClick={loadData}
            className="w-10 h-10 flex items-center justify-center border border-[rgba(218,119,86,0.22)] rounded-2xl bg-white text-gray-500 hover:text-[#DA7756] hover:border-[#DA7756] hover:bg-[#fef6f4] transition-all shrink-0"
          >
            <RefreshCw className={cn("w-4 h-4", isLoading && "animate-spin")} />
          </button>
        </div>
      </div>

      {/* Error */}
      {apiError && (
        <div className="bg-red-50 text-red-700 text-sm font-semibold p-4 rounded-2xl border border-red-100 flex items-center gap-3">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          {apiError.includes("No Auth Token")
            ? "No auth token. Please set it via bootstrapAuthToken() first."
            : `API Error: ${apiError}`}
        </div>
      )}

      {/* Table */}
      <div className="bg-white border border-[rgba(218,119,86,0.18)] rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead className="bg-[#fdf8f6] border-b border-[rgba(218,119,86,0.12)]">
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
                <tr>
                  <td
                    colSpan={7}
                    className="text-center py-16 text-sm text-gray-400"
                  >
                    <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-3 text-[#DA7756]" />
                    Fetching logs…
                  </td>
                </tr>
              ) : !isGrouped && flatFiltered.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="text-center py-16 text-sm text-gray-400"
                  >
                    No reports found for the selected date and filters.
                  </td>
                </tr>
              ) : isGrouped && sortedDepts.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="text-center py-16 text-sm text-gray-400"
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
                      <tr className="bg-[#fdf8f6] border-b border-[rgba(218,119,86,0.12)]">
                        <td colSpan={7} className="px-4 py-2.5">
                          <span className="text-sm font-bold text-[#DA7756]">
                            {dept}
                          </span>
                          <span className="ml-2 text-xs font-semibold text-[#DA7756]/50">
                            ({deptLogs.length})
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
