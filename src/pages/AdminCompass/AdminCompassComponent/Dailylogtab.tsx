// ─────────────────────────────────────────────
// DailyLogTab.jsx — Unified Modern Theme (Matching Calendar)
// ─────────────────────────────────────────────
import React, { useState, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import {
  FileText, Search, Eye, RefreshCw, X, Plus, Star,
  CheckCircle2, ArrowLeft, ArrowRight, AlertTriangle,
  ChevronDown, MessageSquare, Layers, Circle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { fetchDailyLogsFromAPI, BASE_URL, getAuthHeaders } from "./Shared";

// ─────────────────────────────────────────────
// Departments API
// ─────────────────────────────────────────────
const fetchMeetingsAPI = async () => {
  const res = await fetch(`${BASE_URL}/daily_meeting_configs`, {
    method: "GET",
    headers: getAuthHeaders(),
  });
  const raw = await res.text();
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  let json;
  try { json = JSON.parse(raw); } catch { json = []; }
  
  let list = [];
  if (Array.isArray(json)) list = json;
  else if (Array.isArray(json.data?.daily_meeting_configs)) list = json.data.daily_meeting_configs;
  else if (Array.isArray(json.data?.meeting_configs)) list = json.data.meeting_configs;
  else if (Array.isArray(json.data)) list = json.data;
  else if (Array.isArray(json.daily_meeting_configs)) list = json.daily_meeting_configs;
  else if (Array.isArray(json.meeting_configs)) list = json.meeting_configs;
  
  return list.map((m) => ({
    id: String(m.id),
    label: m.name ?? m.title ?? m.label ?? `Meeting ${m.id}`,
  }));
};

const fetchDepartmentsAPI = async () => {
  const res = await fetch(`${BASE_URL}/pms/departments.json`, {
    method: "GET",
    headers: getAuthHeaders(),
  });
  const raw = await res.text();
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  let json;
  try { json = JSON.parse(raw); } catch { json = []; }
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
  const res = await fetch(`${BASE_URL}/tasks`, {
    method: "POST", headers: getAuthHeaders(), body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
};

const createStuckIssue = async (payload) => {
  const res = await fetch(`${BASE_URL}/stuck_issues`, {
    method: "POST", headers: getAuthHeaders(), body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
};

const submitFeedback = async (payload) => {
  const res = await fetch(`${BASE_URL}/feedbacks`, {
    method: "POST", headers: getAuthHeaders(), body: JSON.stringify(payload),
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
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
};

// Updated Score Colors to match calendar (Vibrant Green & Red)
const scoreColor = (s) =>
  s >= 50 ? "bg-[#2ECC71] text-white" : "bg-[#EB4A4A] text-white";

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
    if (!title.trim()) { setError("Task title is required."); return; }
    if (!dueDate) { setError("Due date is required."); return; }
    setLoading(true); setError(null);
    try {
      await createTask({
        title: title.trim(), description: desc.trim(), priority,
        due_date: dueDate, progress: Number(progress), user_journal_id: reportId,
      });
      onClose();
    } catch (e) { setError(e.message); } 
    finally { setLoading(false); }
  };

  return createPortal(
    <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4" style={{ fontFamily: "'Poppins', sans-serif" }}>
      <div className="bg-white rounded-[28px] shadow-2xl w-full max-w-[520px] overflow-hidden border border-[#F0EBE8]">
        <div className="flex items-center justify-between px-7 pt-7 pb-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-[12px] bg-[#FDF5F1] border border-[#F6E1D7] flex items-center justify-center">
              <FileText className="w-5 h-5 text-[#D37E5F]" />
            </div>
            <h2 className="text-lg font-black text-[#1A1A1A]">Add Task for {reportUser}</h2>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center rounded-[14px] bg-white border border-[#F0EBE8] hover:bg-gray-50 text-gray-500 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="px-7 pt-6 pb-8 space-y-5 font-medium">
          {error && (
            <div className="bg-[#EB4A4A]/10 text-[#EB4A4A] text-sm p-3 rounded-[14px] flex items-center gap-2 font-bold">
              <AlertTriangle className="w-4 h-4 shrink-0" /> {error}
            </div>
          )}
          <div>
            <label className="block text-sm font-bold text-[#8C8580] mb-1.5 uppercase tracking-wider text-[11px]">
              Task Title <span className="text-[#EB4A4A]">*</span>
            </label>
            <input
              autoFocus type="text" value={title} onChange={(e) => setTitle(e.target.value)}
              placeholder="What needs to be done?"
              className="w-full border border-[#F0EBE8] bg-[#FCFAFA] rounded-[16px] px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#EB4A4A]/20 focus:border-[#EB4A4A] transition-colors text-[#1A1A1A]"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-[#8C8580] mb-1.5 uppercase tracking-wider text-[11px]">Description</label>
            <textarea
              value={desc} onChange={(e) => setDesc(e.target.value)}
              placeholder="Additional details..." rows={3}
              className="w-full border border-[#F0EBE8] bg-[#FCFAFA] rounded-[16px] px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#EB4A4A]/20 focus:border-[#EB4A4A] resize-none transition-colors text-[#1A1A1A]"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-[#8C8580] mb-1.5 uppercase tracking-wider text-[11px]">Priority</label>
              <div className="relative">
                <select
                  value={priority} onChange={(e) => setPriority(e.target.value)}
                  className="w-full appearance-none border border-[#F0EBE8] bg-[#FCFAFA] rounded-[16px] px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#EB4A4A]/20 focus:border-[#EB4A4A] text-[#1A1A1A]"
                >
                  {["Low", "Medium", "High", "Critical"].map((p) => (<option key={p}>{p}</option>))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold text-[#8C8580] mb-1.5 uppercase tracking-wider text-[11px]">
                Due Date <span className="text-[#EB4A4A]">*</span>
              </label>
              <input
                type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)}
                className="w-full border border-[#F0EBE8] bg-[#FCFAFA] rounded-[16px] px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#EB4A4A]/20 focus:border-[#EB4A4A] text-[#1A1A1A]"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-bold text-[#8C8580] mb-2 uppercase tracking-wider text-[11px]">
              Progress: {progress}%
            </label>
            <input
              type="range" min={0} max={100} step={5} value={progress}
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
              onClick={handleCreate} disabled={loading}
              className="flex items-center gap-2 px-6 py-3 bg-[#EB4A4A] hover:bg-[#DA3B3B] text-white rounded-[14px] text-sm font-bold shadow-sm transition-colors disabled:opacity-60"
            >
              <Plus className="w-4 h-4" /> {loading ? "Creating…" : "Create Task"}
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
      placeholder: "Enter stuck issue description…", btnText: "Add Issue", btnCls: "bg-[#F05252] hover:bg-[#DA3B3B]",
      apiCall: (t) => createStuckIssue({ description: t, user_journal_id: reportId }),
    },
    plan: {
      placeholder: "Add to tomorrow's plan…", btnText: "Add to Plan", btnCls: "bg-[#F4D35E] text-[#856417] hover:bg-[#DAB835]",
      apiCall: (t) => createTask({ title: t, type: "plan", user_journal_id: reportId }),
    },
  }[action];
  
  if (!cfg) return null;

  const handleSubmit = async () => {
    if (!text.trim()) return;
    setLoading(true); setError(null);
    try { await cfg.apiCall(text.trim()); onClose(true); } 
    catch (e) { setError(e.message); } 
    finally { setLoading(false); }
  };

  return (
    <div className="mt-4 space-y-2">
      {error && <p className="text-xs font-bold text-[#EB4A4A]">{error}</p>}
      <div className="flex gap-2">
        <input
          autoFocus type="text" value={text} onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSubmit()} placeholder={cfg.placeholder}
          className="flex-1 border border-[#F0EBE8] bg-[#FCFAFA] rounded-[14px] px-4 py-2 text-sm focus:outline-none focus:border-[#EB4A4A] font-medium text-[#1A1A1A]"
        />
        <button
          onClick={handleSubmit} disabled={loading}
          className={cn("px-5 py-2 font-bold text-sm rounded-[14px] transition-colors", cfg.btnCls, loading && "opacity-60")}
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
  const [error, setError] = useState(null);

  const handleSubmit = async () => {
    if (rating === 0) { setError("Please select a rating."); return; }
    if (!text.trim()) { setError("Feedback text is required."); return; }
    setLoading(true); setError(null);
    try {
      await submitFeedback({ rating, feedback: text.trim(), user_journal_id: reportId });
      onClose(true);
    } catch (e) { setError(e.message); } 
    finally { setLoading(false); }
  };

  return (
    <div className="mt-4 bg-[#FCFAFA] p-5 rounded-[20px] border border-[#F0EBE8] space-y-4">
      {error && <p className="text-xs font-bold text-[#EB4A4A]">{error}</p>}
      <div className="flex items-center gap-4">
        <span className="text-[11px] uppercase tracking-wider font-bold text-[#8C8580]">Rating:</span>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((n) => (
            <Star
              key={n} onClick={() => setRating(n)}
              className={cn("w-7 h-7 cursor-pointer transition-colors", n <= rating ? "text-[#F4D35E] fill-[#F4D35E]" : "text-gray-300 hover:text-[#F4D35E]/50")}
            />
          ))}
        </div>
      </div>
      <textarea
        value={text} onChange={(e) => setText(e.target.value)}
        placeholder="Enter constructive feedback…" rows={3}
        className="w-full border border-[#F0EBE8] rounded-[14px] px-4 py-3 text-sm font-medium text-[#1A1A1A] resize-none focus:outline-none focus:border-[#EB4A4A]"
      />
      <div className="flex justify-end gap-2 mt-2">
        <button onClick={() => onClose(false)} className="px-5 py-2.5 border border-[#F0EBE8] rounded-[14px] text-sm font-bold text-[#8C8580] hover:bg-gray-50">
          Cancel
        </button>
        <button onClick={handleSubmit} disabled={loading} className="px-5 py-2.5 bg-[#EB4A4A] hover:bg-[#DA3B3B] text-white rounded-[14px] text-sm font-bold transition-colors disabled:opacity-60">
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
  const tasks = Array.isArray(raw.tasks_and_issues) ? raw.tasks_and_issues : Array.isArray(raw.tasks) ? raw.tasks : [];
  const accomplishments = Array.isArray(raw.accomplishments) ? raw.accomplishments : [];
  const plans = Array.isArray(raw.plans) ? raw.plans : Array.isArray(raw.tomorrows_plan) ? raw.tomorrows_plan : [];
  const fallbackAccomplishments = accomplishments.length === 0 && log.highlights ? [{ text: log.highlights }] : accomplishments;

  return (
    <>
      {createPortal(
        <div className="fixed inset-0 z-[9990] flex items-start justify-end" style={{ fontFamily: "'Poppins', sans-serif" }}>
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
          <div className="relative z-10 bg-white h-full w-full max-w-[600px] shadow-2xl flex flex-col overflow-hidden border-l border-[#F0EBE8] rounded-l-[32px]">
            
            <div className="px-8 pt-8 pb-5 border-b border-[#F0EBE8] shrink-0 flex items-start justify-between bg-[#FCFAFA]">
              <div>
                <h3 className="text-xl font-black text-[#1A1A1A] flex items-center gap-3">
                  <div className="w-10 h-10 rounded-[12px] bg-white border border-[#F0EBE8] flex items-center justify-center">
                    <FileText className="w-5 h-5 text-[#EB4A4A]" />
                  </div>
                  {log.user} — Report
                </h3>
                <p className="text-xs font-bold text-[#8C8580] mt-2 tracking-wider uppercase">
                  {log.dept} {log.date && <> · {fmt(log.date)}</>}
                </p>
              </div>
              <button onClick={onClose} className="w-10 h-10 flex items-center justify-center rounded-[14px] bg-white border border-[#F0EBE8] text-gray-500 hover:bg-gray-50 transition-colors shrink-0">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-8 space-y-6">
              
              <div className="bg-[#FCFAFA] rounded-[20px] border border-[#F05252]/30 p-5">
                <h4 className="flex items-center gap-2 text-[11px] uppercase tracking-widest font-black text-[#F05252] mb-4">
                  <div className="w-2 h-2 rounded-full bg-[#F05252]" /> Tasks &amp; Issues
                </h4>
                {tasks.length === 0 ? (
                  <p className="text-sm font-medium text-[#8C8580] italic">No tasks or issues</p>
                ) : (
                  <ul className="space-y-3">
                    {tasks.map((item, i) => {
                      const t = typeof item === "string" ? item : item.text || item.description || "";
                      return (
                        <li key={i} className="flex items-start gap-3">
                          <Circle className="w-4 h-4 text-[#F05252] shrink-0 mt-0.5" />
                          <span className="text-sm font-medium text-[#1A1A1A] flex-1 leading-relaxed">{t}</span>
                          {item.type && (
                            <span className="text-[10px] font-black px-2 py-1 rounded-[8px] bg-white border border-[#F05252]/30 text-[#F05252] shrink-0 uppercase tracking-wider">
                              {item.type}
                            </span>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>

              <div className="bg-[#FCFAFA] rounded-[20px] border border-[#2ECC71]/30 p-5">
                <h4 className="flex items-center gap-2 text-[11px] uppercase tracking-widest font-black text-[#2ECC71] mb-4">
                  <div className="w-2 h-2 rounded-full bg-[#2ECC71]" /> Accomplishments
                </h4>
                {fallbackAccomplishments.length === 0 ? (
                  <p className="text-sm font-medium text-[#8C8580] italic">No accomplishments</p>
                ) : (
                  <ul className="space-y-3">
                    {fallbackAccomplishments.map((item, i) => {
                      const t = typeof item === "string" ? item : item.text || item.description || "";
                      return (
                        <li key={i} className="flex items-start gap-3">
                          <CheckCircle2 className="w-4 h-4 text-[#2ECC71] shrink-0 mt-0.5" />
                          <span className="text-sm font-medium text-[#1A1A1A] leading-relaxed">{t}</span>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>

              <div className="bg-[#FCFAFA] rounded-[20px] border border-[#F4D35E]/40 p-5">
                <h4 className="flex items-center gap-2 text-[11px] uppercase tracking-widest font-black text-[#DAB835] mb-4">
                  <div className="w-2 h-2 rounded-full bg-[#F4D35E]" /> Tomorrow's Plan
                </h4>
                {plans.length === 0 ? (
                  <p className="text-sm font-medium text-[#8C8580] italic">No plan recorded</p>
                ) : (
                  <ul className="space-y-3">
                    {plans.map((item, i) => {
                      const t = typeof item === "string" ? item : item.text || item.description || "";
                      return (
                        <li key={i} className="flex items-start gap-3">
                          <ArrowRight className="w-4 h-4 text-[#DAB835] shrink-0 mt-0.5" />
                          <span className="text-sm font-medium text-[#1A1A1A] leading-relaxed">{t}</span>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>

              <div className="pt-4 border-t border-[#F0EBE8]">
                <p className="text-[11px] font-black text-[#8C8580] uppercase tracking-widest mb-4">
                  Quick Actions
                </p>
                {activeAction === null && (
                  <div className="flex flex-wrap gap-3">
                    <button onClick={() => setTaskModalOpen(true)} className="flex items-center gap-2 px-5 py-2.5 border border-[#F0EBE8] bg-white rounded-[14px] text-sm font-bold text-[#1A1A1A] hover:border-[#1A1A1A] transition-all">
                      <Plus className="w-4 h-4" /> Task
                    </button>
                    <button onClick={() => setActiveAction("issue")} className="flex items-center gap-2 px-5 py-2.5 border border-[#F0EBE8] bg-white rounded-[14px] text-sm font-bold text-[#F05252] hover:border-[#F05252] hover:bg-[#F05252]/5 transition-all">
                      <Plus className="w-4 h-4" /> Stuck Issue
                    </button>
                    <button onClick={() => setActiveAction("plan")} className="flex items-center gap-2 px-5 py-2.5 border border-[#F0EBE8] bg-white rounded-[14px] text-sm font-bold text-[#DAB835] hover:border-[#DAB835] hover:bg-[#F4D35E]/10 transition-all">
                      <Plus className="w-4 h-4" /> Add to Plan
                    </button>
                    <button onClick={() => setActiveAction("feedback")} className="flex items-center gap-2 px-5 py-2.5 bg-[#1A1A1A] text-white rounded-[14px] text-sm font-bold shadow-sm hover:bg-gray-800 transition-all">
                      <MessageSquare className="w-4 h-4" /> Feedback
                    </button>
                  </div>
                )}
                {(activeAction === "issue" || activeAction === "plan") && (
                  <InlineActionInput action={activeAction} reportId={log.id} onClose={() => setActiveAction(null)} />
                )}
                {activeAction === "feedback" && (
                  <FeedbackPanel reportId={log.id} onClose={() => setActiveAction(null)} />
                )}
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
      {taskModalOpen && <AddTaskModal reportUser={log.user} reportId={log.id} onClose={() => setTaskModalOpen(false)} />}
    </>
  );
};

// ─────────────────────────────────────────────
// DailyLogTab — main component
// ─────────────────────────────────────────────
const DailyLogTab = () => {
  const [selectedDate, setSelectedDate] = useState(() => new Date().toISOString().split("T")[0]);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedDeptId, setSelectedDeptId] = useState("");
  const [selectedMeetingFilter, setSelectedMeetingFilter] = useState("1");
  const [isGrouped, setIsGrouped] = useState(false);

  const [departments, setDepartments] = useState([]);
  const [isFetchingDepts, setIsFetchingDepts] = useState(false);
  const loadDepartments = useCallback(async () => {
    setIsFetchingDepts(true);
    try { setDepartments(await fetchDepartmentsAPI()); } 
    catch (err) { console.error(err); } 
    finally { setIsFetchingDepts(false); }
  }, []);
  useEffect(() => { loadDepartments(); }, [loadDepartments]);

  const [meetings, setMeetings] = useState([]);
  const [isFetchingMeetings, setIsFetchingMeetings] = useState(false);
  const loadMeetings = useCallback(async () => {
    setIsFetchingMeetings(true);
    try { 
      const data = await fetchMeetingsAPI(); 
      setMeetings(data); 
      if (data.length > 0) setSelectedMeetingFilter(data[0].id); 
    } 
    catch (err) { console.error(err); } 
    finally { setIsFetchingMeetings(false); }
  }, []);
  useEffect(() => { loadMeetings(); }, [loadMeetings]);

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
    setIsLoading(true); setApiError(null);
    try {
      const data = await fetchDailyLogsFromAPI({
        meetingId: selectedMeetingFilter, dateStr: selectedDate,
        isGrouped, departmentId: selectedDeptId, search: debouncedSearch,
      });
      if (isGrouped) {
        const grouped = typeof data === "object" && !Array.isArray(data) ? data : {};
        setGroupedApiLogs(grouped); setApiLogs([]);
        const allLogs = Object.values(grouped).flat();
        setMetaSubmitted(allLogs.length);
        setMetaExpected(data?._meta?.expected ?? data?.meta?.expected ?? allLogs.length);
      } else {
        const flat = Array.isArray(data) ? data : [];
        setApiLogs(flat); setGroupedApiLogs({});
        setMetaSubmitted(flat.length); setMetaExpected(flat.length);
      }
    } catch (err) {
      setApiError(err.message); setApiLogs([]); setGroupedApiLogs({});
    } finally { setIsLoading(false); }
  }, [selectedDate, selectedMeetingFilter, isGrouped, selectedDeptId, debouncedSearch]);

  useEffect(() => { loadData(); }, [loadData]);

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
  const totalGrouped = sortedDepts.reduce((s, k) => s + filterLogs(groupedApiLogs[k]).length, 0);
  const displayCount = isGrouped ? totalGrouped : flatFiltered.length;

  const TH = ({ children, center }) => (
    <th className={cn("px-6 py-4 text-[11px] font-black uppercase tracking-widest text-[#8C8580] whitespace-nowrap", center ? "text-center" : "text-left")}>
      {children}
    </th>
  );

  const renderRow = (log) => {
    const sub = log.submittedAt || "";
    const subParts = sub.match(/^(.+?),?\s*(\d{4})\s*(.*)$/);
    const subLine1 = subParts ? `${subParts[1]}, ${subParts[2]}` : sub;
    const subLine2 = subParts ? subParts[3] : "";
    return (
      <tr key={log.id} className="border-b border-[#F0EBE8] hover:bg-[#FCFAFA] transition-colors bg-white">
        <td className="px-6 py-4 text-sm font-semibold text-[#8C8580] whitespace-nowrap">
          {fmt(log.date) || log.date || selectedDate}
        </td>
        <td className="px-6 py-4">
          <div className="text-sm font-black text-[#1A1A1A]">{log.user}</div>
          <div className="text-xs font-semibold text-[#8C8580] mt-0.5">{log.email}</div>
        </td>
        <td className="px-6 py-4">
          <span className={cn("inline-block px-3 py-1.5 rounded-[8px] text-[11px] font-black min-w-[36px] text-center tracking-wider", scoreColor(log.score))}>
            {log.score}
          </span>
        </td>
        <td className="px-6 py-4">
          <span className="inline-block px-3.5 py-1.5 rounded-[8px] border border-[#F0EBE8] bg-[#FCFAFA] text-[10px] font-black text-[#8C8580] uppercase tracking-wider">
            {log.dept}
          </span>
        </td>
        <td className="px-6 py-4 text-sm font-medium text-[#1A1A1A] max-w-[260px] truncate">
          {log.highlights}
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
    <div className="space-y-6 pb-12    min-h-screen pt-8" style={{ fontFamily: "'Poppins', sans-serif" }}>
      
      {/* Header card */}
      <div className="bg-white rounded-[32px] border border-[#F0EBE8] shadow-sm p-6 sm:p-8">
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
                    {displayCount}
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
            <button onClick={() => shiftDate(-1)} className="w-[42px] h-[42px] flex items-center justify-center border border-[#F0EBE8] bg-white rounded-[14px] hover:bg-gray-50 text-gray-800 transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <input
              type="date" value={selectedDate} onChange={(e) => { if (e.target.value) setSelectedDate(e.target.value); }}
              className="h-[42px] border border-[#F0EBE8] bg-[#FCFAFA] rounded-[14px] px-4 text-sm font-bold text-[#1A1A1A] focus:outline-none focus:border-[#EB4A4A] w-[145px]"
            />
            <button onClick={() => shiftDate(1)} className="w-[42px] h-[42px] flex items-center justify-center border border-[#F0EBE8] bg-white rounded-[14px] hover:bg-gray-50 text-gray-800 transition-colors">
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
              type="text" placeholder="Search by user, email..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-10 py-3.5 text-sm font-bold border border-[#F0EBE8] bg-[#FCFAFA] rounded-[16px] focus:outline-none focus:ring-2 focus:ring-[#EB4A4A]/20 focus:border-[#EB4A4A] text-[#1A1A1A] placeholder:text-[#8C8580] transition-colors"
            />
            {searchQuery !== debouncedSearch && (
              <RefreshCw className="w-4 h-4 absolute right-4 top-1/2 -translate-y-1/2 text-[#EB4A4A] animate-spin" />
            )}
            {searchQuery && searchQuery === debouncedSearch && (
              <button onClick={() => setSearchQuery("")} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#EB4A4A]">
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Department dropdown */}
          <div className="relative shrink-0">
            <select
              value={selectedDeptId} onChange={(e) => setSelectedDeptId(e.target.value)} disabled={isFetchingDepts}
              className="appearance-none border border-[#F0EBE8] bg-[#FCFAFA] rounded-[16px] pl-5 pr-10 py-3.5 text-sm font-bold text-[#1A1A1A] focus:outline-none focus:border-[#EB4A4A] min-w-[160px] disabled:opacity-60"
            >
              <option value="">{isFetchingDepts ? "Loading…" : "Department"}</option>
              {departments.map((d) => (<option key={d.id} value={d.id}>{d.label}</option>))}
            </select>
            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8C8580] pointer-events-none" />
          </div>

          {/* Meeting filter */}
          <div className="relative shrink-0">
            <select
              value={selectedMeetingFilter} onChange={(e) => setSelectedMeetingFilter(e.target.value)} disabled={isFetchingMeetings}
              className="appearance-none border border-[#F0EBE8] bg-[#FCFAFA] rounded-[16px] pl-5 pr-10 py-3.5 text-sm font-bold text-[#1A1A1A] focus:outline-none focus:border-[#EB4A4A] min-w-[160px] disabled:opacity-60"
            >
              <option value="">{isFetchingMeetings ? "Loading…" : "Meeting"}</option>
              {meetings.map((m) => (<option key={m.id} value={m.id}>{m.label}</option>))}
            </select>
            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8C8580] pointer-events-none" />
          </div>

          {/* Group toggle */}
          <button
            onClick={() => setIsGrouped(!isGrouped)}
            className={cn(
              "flex items-center justify-center gap-2 px-5 py-3.5 rounded-[16px] text-sm font-bold border transition-all shrink-0",
              isGrouped ? "bg-[#1A1A1A] border-[#1A1A1A] text-white" : "bg-white border-[#F0EBE8] text-[#8C8580] hover:bg-gray-50 hover:text-[#1A1A1A]"
            )}
          >
            <Layers className="w-4 h-4" /> Group
          </button>

          {/* Refresh */}
          <button
            onClick={loadData}
            className="w-[50px] h-[50px] flex items-center justify-center border border-[#F0EBE8] rounded-[16px] bg-white text-[#8C8580] hover:text-[#1A1A1A] hover:bg-gray-50 transition-all shrink-0"
          >
            <RefreshCw className={cn("w-5 h-5", isLoading && "animate-spin text-[#EB4A4A]")} />
          </button>
        </div>
      </div>

      {/* Error */}
      {apiError && (
        <div className="bg-[#EB4A4A]/10 text-[#EB4A4A] text-sm font-bold p-5 rounded-[20px] flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 shrink-0" />
          {apiError.includes("No Auth Token") ? "No auth token. Please set it via bootstrapAuthToken() first." : `API Error: ${apiError}`}
        </div>
      )}

      {/* Table */}
      <div className="bg-white border border-[#F0EBE8] rounded-[32px] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead className="bg-[#FCFAFA] border-b border-[#F0EBE8]">
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
                  <td colSpan={7} className="text-center py-20 text-sm font-bold text-[#8C8580]">
                    <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-[#EB4A4A]" />
                    Fetching logs…
                  </td>
                </tr>
              ) : !isGrouped && flatFiltered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-20 text-sm font-bold text-[#8C8580]">
                    No reports found for the selected date and filters.
                  </td>
                </tr>
              ) : isGrouped && sortedDepts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-20 text-sm font-bold text-[#8C8580]">
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
                          <span className="text-sm font-black text-[#1A1A1A] uppercase tracking-wider">{dept}</span>
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

      {selectedReport && <ReportDetailModal log={selectedReport} onClose={() => setSelectedReport(null)} />}
    </div>
  );
};

export default DailyLogTab;