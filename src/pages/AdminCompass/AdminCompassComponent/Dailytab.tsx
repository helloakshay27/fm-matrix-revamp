// ─────────────────────────────────────────────
// DailyTab.jsx  — with API integration
// ─────────────────────────────────────────────
import React, { useState, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import {
  Calendar, FileText, ChevronDown, ChevronUp, AlertTriangle,
  CheckCircle2, Circle, ArrowRight, Users, CalendarIcon,
  RefreshCw, X, Plus, MessageSquare, Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  statusColors, fullMonthNames,
  SectionCard, BtnPrimary, BtnOutline, BtnIcon, BtnPurple,
} from "./shared";

// ── API config ──────────────────────────────────────────────────────────────
const BASE_URL = "https://fm-uat-api.lockated.com";

const getAuthHeaders = () => {
  const token = localStorage.getItem("auth_token") || "";
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: token } : {}),
  };
};

// ── Meetings API ────────────────────────────────────────────────────────────
const fetchMeetingsAPI = async () => {
  const res = await fetch(`${BASE_URL}/daily_meeting_configs`, {
    method: "GET", headers: getAuthHeaders(),
  });
  const raw = await res.text();
  console.log("[Meetings] GET status:", res.status, "raw:", raw.slice(0, 300));
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  let json;
  try { json = JSON.parse(raw); } catch { json = []; }
  let list = [];
  if (Array.isArray(json))                                  list = json;
  else if (Array.isArray(json.data?.daily_meeting_configs)) list = json.data.daily_meeting_configs;
  else if (Array.isArray(json.data?.meeting_configs))       list = json.data.meeting_configs;
  else if (Array.isArray(json.data))                        list = json.data;
  else if (Array.isArray(json.daily_meeting_configs))       list = json.daily_meeting_configs;
  else if (Array.isArray(json.meeting_configs))             list = json.meeting_configs;
  return list.map((m) => ({ id: String(m.id), label: m.name ?? m.title ?? `Meeting ${m.id}` }));
};

// ── API: GET daily meeting data ─────────────────────────────────────────────
// meeting_id is OPTIONAL — omit from URL if not provided
const fetchDailyMeeting = async (meetingId, date) => {
  // Build query params — only add meeting_id if it's a valid non-empty value
  const params = new URLSearchParams({ date });
  if (meetingId && String(meetingId).trim() !== "") {
    params.set("meeting_id", String(meetingId));
  }
  const url = `${BASE_URL}/user_journals/daily_meeting?${params.toString()}`;
  console.log("[DailyMeeting] GET", url);
  const res = await fetch(url, { method: "GET", headers: getAuthHeaders() });
  const raw = await res.text();
  console.log("[DailyMeeting] GET status:", res.status, raw.slice(0, 400));
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${raw.slice(0, 200)}`);
  let json;
  try { json = JSON.parse(raw); } catch { json = {}; }
  return json?.data ?? json;
};

// ── API: POST submit daily meeting ──────────────────────────────────────────
const submitDailyMeeting = async (payload) => {
  const url = `${BASE_URL}/user_journals/submit_daily_meeting`;
  console.log("[DailyMeeting] POST", JSON.stringify(payload, null, 2));
  const res = await fetch(url, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });
  const raw = await res.text();
  console.log("[DailyMeeting] POST response:", raw.slice(0, 400));
  if (!res.ok) throw new Error(`API error ${res.status}: ${raw || res.statusText}`);
  let json;
  try { json = JSON.parse(raw); } catch { json = {}; }
  return json;
};

// ── API: GET meeting members from config ────────────────────────────────────
const fetchMeetingMembers = async (meetingId) => {
  const url = `${BASE_URL}/daily_meeting_configs/${meetingId}`;
  const res = await fetch(url, { method: "GET", headers: getAuthHeaders() });
  const raw = await res.text();
  console.log("[MeetingMembers] GET status:", res.status, raw.slice(0, 300));
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  let json;
  try { json = JSON.parse(raw); } catch { json = {}; }
  const data = json.data ?? json;
  const members = data.members ?? data.member_details ?? [];
  return Array.isArray(members)
    ? members.map(m => ({ id: String(m.id), name: m.name ?? m.full_name ?? `User ${m.id}` }))
    : [];
};

// ── Helpers ─────────────────────────────────────────────────────────────────
const mapStatus = (apiStatus, day, isToday) => {
  if (day === "Sun") return "holiday";
  
  // UPDATED: "non_meeting" always maps to "done" (green)
  if (apiStatus === "non_meeting") return "done";
  
  const map = {
    missed:      "missed",
    done:        "done",
    holiday:     "holiday",
    upcoming:    "upcoming",
    today:       "today",
  };
  return map[apiStatus] ?? "upcoming";
};

const splitApiDate = (fullDateStr) => {
  if (!fullDateStr) return { dateNum: "", monthYear: "", day: "" };
  const match = fullDateStr.match(/^(\d+)\s+(\w+),\s+(\d+)\s+\((\w+)\)/);
  if (match) {
    return {
      dateNum:   match[1],
      monthYear: `${match[2]}, ${match[3]}`,
      day:       match[4],
    };
  }
  return { dateNum: "", monthYear: "", day: "" };
};

const labelFromFullDate = (fullDate) => {
  if (!fullDate) return "";
  const months = ["JAN","FEB","MAR","APR","MAY","JUN","JUL","AUG","SEP","OCT","NOV","DEC"];
  const m = parseInt(fullDate.split("-")[1], 10);
  return months[m - 1] ?? "";
};

const mapMemberReports = (memberReports) => {
  return (memberReports ?? []).map((r, idx) => ({
    id:        r.id ?? idx + 1,
    user:      r.user?.name ?? r.name ?? "Unknown",
    dept:      r.department ?? r.dept ?? "—",
    email:     r.user?.email ?? r.email ?? "",
    timestamp: r.submitted_at ?? r.timestamp ?? "",
    score:     r.self_rating ?? r.score ?? 0,
    kpiStats:  r.report_data?.kpis
      ? Object.entries(r.report_data.kpis).map(([label, val]) => ({ label, val }))
      : (r.kpiStats ?? []),
    tasksAndIssues: (r.report_data?.tasks_issues ?? r.tasksAndIssues ?? []).map((t, i) => ({
      id:   t.id ?? i,
      text: t.title ?? t.text ?? "",
      done: t.status === "done" ? true : t.status === "open" ? false : t.done,
      type: t.type ?? null,
    })),
    accomplishments: (r.report_data?.accomplishments ?? r.accomplishments ?? []).map((a, i) => ({
      id:   a.id ?? i,
      text: a.title ?? a.text ?? "",
    })),
    plans: (r.report_data?.tomorrow_plan ?? r.plans ?? []).map((p, i) => ({
      id:   p.id ?? i,
      text: p.title ?? p.text ?? "",
    })),
    bigWin:   r.report_data?.big_win ?? "",
    isAbsent: r.is_absent ?? false,
  }));
};

const buildDefaultPayload = (meetingId, dateStr, meetingNotes) => {
  const payload = {
    report_date:   dateStr,
    self_rating:   7,
    is_absent:     false,
    status:        "submitted",
    meeting_notes: meetingNotes,
    report_data: {
      accomplishments: [],
      tasks_issues:    [],
      big_win:         "",
      tomorrow_plan:   [],
      kpis: {
        score:    "0/25",
        tasks:    "0/21",
        issues:   "0/25",
        planning: "0/2",
        timing:   "0/25",
      },
    },
  };
  // Only attach meeting_config_id if meetingId is valid
  if (meetingId && String(meetingId).trim() !== "") {
    payload.meeting_config_id = meetingId;
  }
  return payload;
};

// ── Component ────────────────────────────────────────────────────────────────
const DailyTab = ({ selectedDateId, setSelectedDateId }) => {
  // ── Meetings from API ──
  const [meetings, setMeetings]                     = useState([]);
  const [isFetchingMeetings, setIsFetchingMeetings] = useState(false);
  const [activeMeetingId, setActiveMeetingId]       = useState(null); // null = no meeting_id in URL

  // ── API state ──
  const [meetingData, setMeetingData]     = useState(null);
  const [isFetching, setIsFetching]       = useState(true);
  const [fetchError, setFetchError]       = useState(null);
  const [isSubmitting, setIsSubmitting]   = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError]     = useState(null);

  // Derived from API
  const [dateRow, setDateRow]                   = useState([]);
  const [detailedReports, setDetailedReports]   = useState([]);
  const [failedMembers, setFailedMembers]       = useState([]);
  const [config, setConfig]                     = useState(null);
  const [selectedFullDate, setSelectedFullDate] = useState(null);

  // ── UI state ──
  const [expandedReports, setExpandedReports]       = useState([]);
  const [selectedReports, setSelectedReports]       = useState([]);
  const [activeInlineAction, setActiveInlineAction] = useState({ reportId: null, action: null });
  const [isTaskModalOpen, setIsTaskModalOpen]       = useState(false);
  const [taskModalReportId, setTaskModalReportId]   = useState(null);
  const [selectedMeeting, setSelectedMeeting]       = useState("HOD Huddle");
  const [selectedMember, setSelectedMember]         = useState("All Members");
  const [members, setMembers]                       = useState([]);
  const [isFetchingMembers, setIsFetchingMembers]   = useState(false);
  const [inlineText, setInlineText]                 = useState("");
  const [taskTitle, setTaskTitle]                   = useState("");
  const [meetingNotes, setMeetingNotes]             = useState("");

  const todayStr = new Date().toISOString().split("T")[0];

  // ── Core fetch — meeting_id optional ────────────────────────────────────
  // Pass meetingId=null or undefined to fetch without meeting_id param
  const loadMeetingData = useCallback(async (dateStr, meetingId) => {
    setIsFetching(true);
    setFetchError(null);
    setSubmitSuccess(false);
    setSubmitError(null);
    try {
      // meetingId can be null/undefined — fetchDailyMeeting handles it
      const data = await fetchDailyMeeting(meetingId, dateStr);
      setMeetingData(data);
      setConfig(data.config ?? null);

      const mapped = (data.date_row ?? []).map((d, idx) => ({
        id:        idx,
        dateNum:   d.date,
        day:       d.day,
        label:     labelFromFullDate(d.full_date),
        monthYear: d.full_date
          ? `${["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][parseInt(d.full_date.split("-")[1], 10) - 1]}, ${d.full_date.split("-")[0]}`
          : "",
        status:    mapStatus(d.status, d.day, d.is_today),
        fullDate:  d.full_date,
        isToday:   d.is_today,
        isMeeting: d.is_meeting,
      }));
      setDateRow(mapped);

      const matchedEntry = mapped.find(d => d.fullDate === dateStr);
      if (matchedEntry) {
        setSelectedFullDate(matchedEntry.fullDate);
      } else {
        const todayEntry = mapped.find(d => d.isToday) ?? mapped.find(d => d.isMeeting) ?? mapped[0];
        if (todayEntry) setSelectedFullDate(todayEntry.fullDate);
      }

      setDetailedReports(mapMemberReports(data.member_reports ?? []));
      setFailedMembers((data.missed_members ?? []).map(m => m.name ?? m));

      if (data.config?.name) setSelectedMeeting(data.config.name);

      if (data.config?.id) {
        setIsFetchingMembers(true);
        fetchMeetingMembers(data.config.id)
          .then(m => setMembers(m))
          .catch(e => console.warn("[MeetingMembers] fetch error:", e))
          .finally(() => setIsFetchingMembers(false));
      }
    } catch (err) {
      console.error("[DailyMeeting] fetch error:", err);
      setFetchError(err.message || "Failed to load meeting data.");
    } finally {
      setIsFetching(false);
    }
  }, []);

  // ── Load meetings on mount, then load data ──────────────────────────────
  const loadMeetings = useCallback(async () => {
    setIsFetchingMeetings(true);
    try {
      const data = await fetchMeetingsAPI();
      setMeetings(data);
      if (data.length > 0) {
        // First meeting selected by default
        setActiveMeetingId(data[0].id);
        loadMeetingData(todayStr, data[0].id);
      } else {
        // No meetings — load without meeting_id
        loadMeetingData(todayStr, null);
      }
    } catch (err) {
      console.error("[Meetings] fetch error:", err);
      // Fallback: load without meeting_id
      loadMeetingData(todayStr, null);
    } finally {
      setIsFetchingMeetings(false);
    }
  }, [loadMeetingData, todayStr]);

  useEffect(() => { loadMeetings(); }, [loadMeetings]);

  // ── Date chip click ──────────────────────────────────────────────────────
  const handleDateClick = (dateEntry) => {
    if (dateEntry.status === "holiday") return;
    setSelectedFullDate(dateEntry.fullDate);
    // Pass current activeMeetingId (may be null)
    loadMeetingData(dateEntry.fullDate, activeMeetingId);
  };

  // ── Meeting dropdown change ──────────────────────────────────────────────
  const handleMeetingChange = (e) => {
    const val = e.target.value;
    // Empty string = "All Meetings" = no meeting_id
    const newId = val === "" ? null : val;
    setActiveMeetingId(newId);
    loadMeetingData(selectedFullDate ?? todayStr, newId);
  };

  const handleMeetingClear = () => {
    setActiveMeetingId(null);
    loadMeetingData(selectedFullDate ?? todayStr, null);
  };

  // ── Derived display ──────────────────────────────────────────────────────
  const selectedDateEntry = dateRow.find(d => d.fullDate === selectedFullDate) ?? dateRow[0];
  const fullDateString    = meetingData?.date ?? "";
  const { dateNum, monthYear, day } = splitApiDate(fullDateString);
  const monthName       = monthYear.split(",")[0] ?? "";
  const yearNum         = (monthYear.split(", ")[1] ?? "").trim();
  const missedDateLabel = `${fullMonthNames?.[monthName] ?? monthName} ${dateNum}, ${yearNum}`;

  // ── Toggle helpers ───────────────────────────────────────────────────────
  const toggleExpand    = (id) => setExpandedReports(p => p.includes(id) ? p.filter(r => r !== id) : [...p, id]);
  const toggleSelect    = (id) => setSelectedReports(p => p.includes(id) ? p.filter(r => r !== id) : [...p, id]);
  const toggleSelectAll = () =>
    selectedReports.length === detailedReports.length
      ? setSelectedReports([])
      : setSelectedReports(detailedReports.map(r => r.id));

  const handleActionClick = (reportId, actionType) => {
    if (actionType === "task") {
      setTaskModalReportId(reportId);
      setIsTaskModalOpen(true);
      setActiveInlineAction({ reportId: null, action: null });
    } else {
      setActiveInlineAction({ reportId, action: actionType });
    }
  };

  // ── Save Meeting POST ────────────────────────────────────────────────────
  const handleSaveMeeting = async () => {
    setIsSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(false);
    try {
      const dateStr = selectedFullDate ?? todayStr;
      // activeMeetingId may be null — buildDefaultPayload handles it
      const payload = buildDefaultPayload(activeMeetingId, dateStr, meetingNotes);
      await submitDailyMeeting(payload);
      setSubmitSuccess(true);
      setMeetingNotes("");
      await loadMeetingData(dateStr, activeMeetingId);
    } catch (err) {
      console.error("[DailyMeeting] submit error:", err);
      setSubmitError(err.message || "Failed to save meeting.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // ── Stats from API ───────────────────────────────────────────────────────
  const totalMembers   = meetingData?.total_members ?? 0;
  const submittedCount = meetingData?.submitted ?? 0;
  const missedCount    = meetingData?.missed ?? 0;

  // ── Render ───────────────────────────────────────────────────────────────
  return (
    <div className="space-y-5 pb-12">

      {/* ── Meeting header card ── */}
      <SectionCard>
        <div className="flex items-center gap-3 mb-5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#fef6f4] border border-[rgba(218,119,86,0.22)]">
            <FileText className="w-4 h-4 text-[#DA7756]" />
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-bold text-neutral-900">
              {config?.name ?? "HOD Huddle"} — Daily Meeting
            </h2>
            <p className="text-xs text-neutral-500 mt-0.5">
              {isFetching ? "Loading..." : fullDateString}
            </p>
          </div>
          <button
            onClick={() => loadMeetingData(selectedFullDate ?? todayStr, activeMeetingId)}
            disabled={isFetching}
            className="p-2 rounded-xl border border-neutral-200 bg-white shadow-sm text-neutral-400 hover:text-[#DA7756] hover:border-[rgba(218,119,86,0.3)] transition-colors disabled:opacity-50"
            title="Refresh"
          >
            {isFetching
              ? <Loader2 className="w-4 h-4 animate-spin" />
              : <RefreshCw className="w-4 h-4" />
            }
          </button>
        </div>

        {/* Fetch error */}
        {fetchError && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-700 text-sm font-semibold rounded-xl px-4 py-3 flex items-center justify-between gap-3">
            <span>⚠ {fetchError}</span>
            <button onClick={() => loadMeetingData(selectedFullDate ?? todayStr, activeMeetingId)} className="text-xs underline hover:no-underline shrink-0">Retry</button>
          </div>
        )}

        {/* Date row */}
        {isFetching ? (
          <div className="flex gap-2.5 overflow-x-auto pt-3 pb-5 px-2 mb-3 -mx-2">
            {[1,2,3,4,5,6,7].map(n => (
              <div key={n} className="flex-shrink-0 rounded-2xl bg-neutral-100 animate-pulse" style={{ width: 70, height: 84 }} />
            ))}
          </div>
        ) : (
          <div className="flex gap-2.5 overflow-x-auto pt-3 pb-5 px-2 mb-3 -mx-2">
            {dateRow.map((date) => {
              const todayStyle = { bg: "rgba(218,119,86,0.15)", text: "#b85a38", border: "#DA7756" };
              const sc         = date.status === "today"
                ? todayStyle
                : (statusColors?.[date.status] ?? { bg: "#f3f4f6", text: "#9ca3af", border: "#e5e7eb" });
              const isSelected = date.fullDate === selectedFullDate;
              return (
                <div
                  key={date.id}
                  onClick={() => handleDateClick(date)}
                  className="flex-shrink-0 flex flex-col items-center justify-center rounded-2xl transition-all duration-200 select-none"
                  style={{
                    width:      70,
                    height:     84,
                    background: isSelected ? sc.text : sc.bg,
                    border:     `1.5px solid ${isSelected ? sc.text : sc.border}`,
                    color:      isSelected ? "#fff" : sc.text,
                    transform:  isSelected ? "scale(1.07)" : "scale(1)",
                    boxShadow:  isSelected ? "0 4px 12px rgba(0,0,0,0.13)" : "0 1px 2px rgba(0,0,0,0.04)",
                    cursor:     date.status === "holiday" ? "not-allowed" : "pointer",
                    opacity:    date.status === "holiday" ? 0.6 : 1,
                  }}
                >
                  <span className="text-[10px] font-bold uppercase tracking-wider opacity-90">{date.day}</span>
                  <span className="text-2xl font-extrabold leading-none my-0.5">{date.dateNum}</span>
                  <span className="text-[10px] font-bold uppercase tracking-wider">{date.label}</span>
                </div>
              );
            })}
          </div>
        )}

        <div className="flex flex-col items-center">
          <div className="flex gap-5 text-xs font-medium flex-wrap justify-center text-neutral-500">
            {[
              { color: "#22c55e", label: "Meeting Done" },
              { color: "#ef4444", label: "Meeting Missed" },
              { color: "#f59e0b", label: "Holiday" },
              { color: "#d1d5db", label: "Upcoming" },
            ].map(({ color, label }) => (
              <div key={label} className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-md inline-block border border-black/10" style={{ background: color }} /> {label}
              </div>
            ))}
          </div>
          <p className="text-[11px] mt-1.5 italic text-neutral-400">
            Note: Select the date for which users have filled the report, not the meeting date.
          </p>
        </div>
      </SectionCard>

      {/* Missed banner */}
      {selectedDateEntry?.status === "missed" && (
        <div className="bg-orange-50 border border-orange-200 rounded-2xl p-4 shadow-sm">
          <div className="flex items-center gap-2 text-orange-600 font-bold text-sm mb-3">
            <AlertTriangle className="w-4 h-4" /> Missed Meetings on {missedDateLabel} (1):
          </div>
          <button className="bg-white border border-orange-300 text-orange-700 text-xs font-bold px-3 py-1.5 rounded-xl hover:bg-orange-100 shadow-sm transition-all active:scale-[0.97]">
            {config?.name ?? "HOD Huddle"}
          </button>
        </div>
      )}

      {/* ── Filters ── */}
      <div className="flex items-center gap-4 flex-wrap">
        {/* Meeting dropdown */}
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">MEETING</span>
          <div className="relative">
            <select
              value={activeMeetingId ?? ""}
              onChange={handleMeetingChange}
              disabled={isFetchingMeetings}
              className="appearance-none bg-white border border-[rgba(218,119,86,0.3)] rounded-xl pl-3 pr-8 py-1.5 text-sm font-semibold text-neutral-800 focus:outline-none focus:border-[#DA7756] shadow-sm disabled:opacity-60 cursor-pointer hover:bg-[#fef6f4] transition-colors"
            >
              <option value="">{isFetchingMeetings ? "Loading…" : "All Meetings"}</option>
              {meetings.map(m => (
                <option key={m.id} value={m.id}>{m.label}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-neutral-400 pointer-events-none" />
          </div>
          <button
            onClick={handleMeetingClear}
            className="p-1.5 text-neutral-400 hover:text-red-500 bg-white border border-neutral-200 rounded-xl shadow-sm transition-colors"
            title="Clear meeting filter"
          >
            <X className="w-3 h-3" />
          </button>
        </div>

        {/* Member filter */}
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">MEMBER</span>
          <div className="relative">
            <select
              value={selectedMember}
              onChange={e => setSelectedMember(e.target.value)}
              disabled={isFetchingMembers}
              className="appearance-none bg-white border border-[rgba(218,119,86,0.3)] rounded-xl pl-3 pr-8 py-1.5 text-sm font-semibold text-neutral-800 focus:outline-none focus:border-[#DA7756] shadow-sm disabled:opacity-60 cursor-pointer hover:bg-[#fef6f4] transition-colors"
            >
              <option value="All Members">
                {isFetchingMembers ? "Loading…" : "All Members"}
              </option>
              {members.map(m => (
                <option key={m.id} value={m.name}>{m.name}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-neutral-400 pointer-events-none" />
          </div>
          <button
            onClick={() => setSelectedMember("All Members")}
            className="p-1.5 text-neutral-400 hover:text-red-500 bg-white border border-neutral-200 rounded-xl shadow-sm transition-colors"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* ── Meeting notes card ── */}
      <div className="border border-neutral-200 rounded-2xl shadow-sm overflow-hidden bg-white">
        <div className="p-4 border-b border-neutral-100 flex justify-between items-start flex-wrap gap-3">
          <div>
            <h3 className="font-bold text-sm text-neutral-900 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#8b5cf6]" /> Daily Reports for {config?.name ?? "HOD Huddle"}
            </h3>
            <p className="text-xs text-neutral-400 mt-0.5">{fullDateString}</p>
          </div>
          <div className="flex items-center gap-2 text-xs font-semibold flex-wrap">
            <span className="px-2.5 py-1 rounded-xl text-xs font-bold bg-blue-500 text-white shadow-sm">Team {totalMembers}</span>
            <span className="px-2.5 py-1 rounded-xl text-xs font-bold bg-green-500 text-white shadow-sm">Submitted {submittedCount}</span>
            <span className="px-2.5 py-1 rounded-xl text-xs font-bold bg-red-500 text-white shadow-sm">Missed {missedCount}</span>
          </div>
        </div>

        <div className="p-4 bg-[rgba(139,92,246,0.04)]">
          <div className="bg-white border border-[rgba(139,92,246,0.18)] rounded-2xl overflow-hidden shadow-sm">
            <div className="flex items-center justify-between p-3 border-b border-[rgba(139,92,246,0.1)]">
              <div className="flex items-center gap-2 font-semibold text-neutral-800 text-sm">
                <Users className="w-4 h-4 text-[#8b5cf6]" />
                {config?.name ?? "HOD Huddle"} ({config?.meeting_time ?? ""}) · {fullDateString}
              </div>
              <div className="flex gap-2">
                <BtnIcon title="Calendar"><CalendarIcon className="w-3.5 h-3.5 text-green-500" /></BtnIcon>
                <BtnIcon title="Refresh" onClick={() => loadMeetingData(selectedFullDate ?? todayStr, activeMeetingId)}>
                  <RefreshCw className="w-3.5 h-3.5" />
                </BtnIcon>
              </div>
            </div>

            <div className="p-4">
              <label className="block text-sm font-bold text-neutral-800 mb-2">Meeting Notes</label>
              <textarea
                value={meetingNotes}
                onChange={e => setMeetingNotes(e.target.value)}
                className="w-full border border-neutral-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#8b5cf6]/25 min-h-[80px] resize-y placeholder:text-neutral-400 text-neutral-700 bg-neutral-50"
                placeholder="Enter meeting remarks, feedback, action items... Use @ to mention team members."
              />
            </div>

            {submitSuccess && (
              <div className="mx-4 mb-3 bg-green-50 border border-green-200 text-green-700 text-sm font-semibold rounded-xl px-4 py-2.5 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" /> Meeting saved successfully!
              </div>
            )}
            {submitError && (
              <div className="mx-4 mb-3 bg-red-50 border border-red-200 text-red-700 text-sm font-semibold rounded-xl px-4 py-2.5">
                ⚠ {submitError}
              </div>
            )}

            <div className="flex items-center justify-between bg-neutral-50 p-3 border-t border-neutral-100">
              <label className="flex items-center gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-gray-300 cursor-pointer"
                  style={{ accentColor: "#1a1a1a" }}
                  checked={selectedReports.length === detailedReports.length && detailedReports.length > 0}
                  onChange={toggleSelectAll}
                />
                <span className="text-sm font-bold text-neutral-800">Select All</span>
              </label>

              <button
                onClick={handleSaveMeeting}
                disabled={isSubmitting}
                className={cn(
                  "inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold text-white shadow-sm transition-all",
                  isSubmitting ? "bg-[#a78bfa] cursor-not-allowed" : "bg-[#8b5cf6] hover:bg-[#7c3aed]"
                )}
              >
                {isSubmitting
                  ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</>
                  : <><FileText className="w-4 h-4" /> Save Meeting</>
                }
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Failed members */}
      {failedMembers.length > 0 && (
        <div className="bg-[#fef6f4] border border-[rgba(218,119,86,0.25)] rounded-2xl p-4 shadow-sm">
          <div className="flex items-center gap-2 text-[#DA7756] font-bold text-sm mb-3">
            <AlertTriangle className="w-4 h-4" /> Team Members Who Failed to Submit Reports ({failedMembers.length}):
          </div>
          <div className="flex flex-wrap gap-2">
            {failedMembers.map(member => (
              <button key={member} className="text-[11px] font-bold px-3 py-1.5 rounded-xl border border-[rgba(218,119,86,0.4)] bg-white text-[#DA7756] shadow-sm hover:bg-[#DA7756] hover:text-white hover:border-[#DA7756] active:scale-[0.96] transition-all duration-150">
                {member}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Member reports */}
      {isFetching ? (
        <div className="space-y-3">
          {[1,2,3].map(n => (
            <div key={n} className="h-20 rounded-2xl bg-neutral-100 animate-pulse" />
          ))}
        </div>
      ) : detailedReports.length === 0 ? (
        <div className="bg-white border border-[rgba(218,119,86,0.15)] rounded-2xl p-10 flex flex-col items-center text-center shadow-sm">
          <FileText className="w-8 h-8 text-neutral-300 mb-3" />
          <p className="text-sm font-semibold text-neutral-500">No reports submitted for this date yet.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {detailedReports.map(report => {
            const isExpanded = expandedReports.includes(report.id);
            const isSelected = selectedReports.includes(report.id);
            return (
              <div key={report.id} className="bg-white border border-[rgba(218,119,86,0.2)] rounded-2xl shadow-sm overflow-hidden transition-all duration-300">
                <div
                  className={cn("p-4 flex items-start sm:items-center justify-between gap-4 cursor-pointer hover:bg-[#fef6f4] transition-colors", isExpanded ? "border-b border-[rgba(218,119,86,0.12)]" : "")}
                  onClick={() => toggleExpand(report.id)}
                >
                  <div className="flex items-start sm:items-center gap-3">
                    <input
                      type="checkbox"
                      className="w-4 h-4 mt-1 sm:mt-0 rounded border-gray-300"
                      style={{ accentColor: "#DA7756" }}
                      checked={isSelected}
                      onChange={e => { e.stopPropagation(); toggleSelect(report.id); }}
                    />
                    <div className="flex items-center justify-center w-10 h-10 rounded-full border-2 border-red-400 text-red-600 font-bold text-base flex-shrink-0 bg-red-50">
                      {report.score}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-bold text-neutral-900 text-sm">{report.user}</h3>
                        <span className="text-[10px] font-bold text-blue-500 border border-blue-200 bg-blue-50 px-2 py-0.5 rounded-xl">{report.dept}</span>
                        {report.isAbsent && (
                          <span className="text-[10px] font-bold text-red-500 border border-red-200 bg-red-50 px-2 py-0.5 rounded-xl">Absent</span>
                        )}
                      </div>
                      <div className="text-xs text-neutral-400 mt-0.5">{report.email}{report.timestamp ? ` • ${report.timestamp}` : ""}</div>
                      <div className="flex flex-wrap items-center gap-1.5 mt-2">
                        {report.kpiStats.map((stat, i) => (
                          <span key={i} className="bg-red-50 text-red-500 text-[10px] font-bold px-2 py-0.5 rounded-xl border border-red-100">
                            {stat.label}: {stat.val}
                          </span>
                        ))}
                      </div>
                      {report.bigWin && (
                        <div className="text-[11px] text-green-600 font-semibold mt-1">🏆 {report.bigWin}</div>
                      )}
                      <div className="text-[11px] text-neutral-400 mt-1.5 italic">Click to view tasks, accomplishments & plan</div>
                    </div>
                  </div>
                  <div className="p-1.5 text-neutral-400 bg-neutral-50 border border-neutral-200 rounded-xl flex-shrink-0 shadow-sm">
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </div>
                </div>

                {isExpanded && (
                  <div className="bg-white">
                    <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-[rgba(218,119,86,0.1)]">
                      {[
                        { title: "Tasks & Issues",  icon: Circle,       color: "red",   items: report.tasksAndIssues },
                        { title: "Accomplishments", icon: CheckCircle2, color: "green", items: report.accomplishments },
                        { title: "Tomorrow's Plan", icon: ArrowRight,   color: "amber", items: report.plans },
                      ].map(({ title, icon: Icon, color, items }) => (
                        <div key={title} className="p-4">
                          <h4 className={cn("flex items-center gap-2 font-bold mb-3 text-xs uppercase tracking-wider",
                            color === "red" ? "text-red-500" : color === "green" ? "text-green-600" : "text-amber-500")}>
                            <Icon className="w-3.5 h-3.5" /> {title}
                          </h4>
                          {items.length === 0
                            ? <p className="text-xs text-neutral-400 italic">No entries.</p>
                            : (
                              <ul className="space-y-2.5">
                                {items.map(item => (
                                  <li key={item.id} className="flex items-start gap-2 text-xs text-neutral-700">
                                    {item.done !== undefined ? (
                                      item.done
                                        ? <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                                        : <Circle className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                                    ) : (
                                      <div className="w-1.5 h-1.5 rounded-full bg-neutral-300 mt-1.5 shrink-0" />
                                    )}
                                    <span className="flex-1 leading-snug">{item.text}</span>
                                    {item.type && (
                                      <span className={cn("text-[9px] font-bold px-1.5 py-0.5 rounded-xl uppercase flex-shrink-0 border",
                                        item.type === "task" ? "text-blue-500 border-blue-200 bg-blue-50" : "text-red-500 border-red-200 bg-red-50")}>
                                        {item.type}
                                      </span>
                                    )}
                                  </li>
                                ))}
                              </ul>
                            )
                          }
                        </div>
                      ))}
                    </div>

                    {/* Quick Actions */}
                    <div className="p-4 border-t border-[rgba(218,119,86,0.1)] bg-neutral-50">
                      <div className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-3">Quick Actions</div>
                      {activeInlineAction.reportId !== report.id ? (
                        <div className="flex items-center gap-2 flex-wrap">
                          <BtnOutline onClick={() => handleActionClick(report.id, "task")}    icon={Plus} iconClass="text-[#DA7756]">Task</BtnOutline>
                          <BtnOutline onClick={() => handleActionClick(report.id, "issue")}   icon={Plus} iconClass="text-red-500">Stuck Issue</BtnOutline>
                          <BtnOutline onClick={() => handleActionClick(report.id, "plan")}    icon={Plus} iconClass="text-amber-500">Add to Plan</BtnOutline>
                          <BtnPurple  onClick={() => handleActionClick(report.id, "feedback")} icon={MessageSquare}>Feedback</BtnPurple>
                        </div>
                      ) : (
                        <div className="bg-white p-3 rounded-2xl border border-[rgba(218,119,86,0.2)] shadow-sm max-w-2xl">
                          <div className="flex gap-2">
                            <input
                              type="text"
                              placeholder={`Add ${activeInlineAction.action}...`}
                              value={inlineText}
                              onChange={e => setInlineText(e.target.value)}
                              className="flex-1 border border-[rgba(218,119,86,0.22)] rounded-xl p-2 text-sm bg-[#fef6f4] focus:outline-none focus:ring-2 focus:ring-[rgba(218,119,86,0.25)]"
                              autoFocus
                            />
                            <BtnPrimary onClick={() => { setInlineText(""); setActiveInlineAction({ reportId: null, action: null }); }}>Submit</BtnPrimary>
                            <BtnOutline onClick={() => { setInlineText(""); setActiveInlineAction({ reportId: null, action: null }); }}>Cancel</BtnOutline>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="py-2 border-t border-[rgba(218,119,86,0.1)] bg-white flex justify-center">
                      <button onClick={() => toggleExpand(report.id)} className="flex items-center gap-1.5 text-xs font-semibold text-neutral-500 hover:text-[#DA7756] bg-white border border-neutral-200 px-3 py-1 rounded-full shadow-sm transition-all">
                        <ChevronUp className="w-3 h-3" /> Collapse
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Add Task Modal */}
      {isTaskModalOpen && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border border-[rgba(218,119,86,0.18)]">
            <div className="flex justify-between items-center p-4 border-b border-neutral-100 bg-[#fef6f4]">
              <h5 className="font-bold text-sm text-neutral-900 flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#DA7756]" />
                Add Task for {detailedReports.find(r => r.id === taskModalReportId)?.user ?? "Member"}
              </h5>
              <BtnIcon onClick={() => setIsTaskModalOpen(false)}><X className="w-3.5 h-3.5" /></BtnIcon>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="text-xs font-bold text-neutral-700 mb-1.5 block">Task Title <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  value={taskTitle}
                  onChange={e => setTaskTitle(e.target.value)}
                  placeholder="What needs to be done?"
                  className="w-full border border-[rgba(218,119,86,0.22)] rounded-xl p-2.5 text-sm bg-[#fef6f4] focus:outline-none focus:ring-2 focus:ring-[rgba(218,119,86,0.25)]"
                  autoFocus
                />
              </div>
            </div>
            <div className="p-4 border-t border-neutral-100 bg-[#fef6f4] flex justify-end gap-2">
              <BtnOutline onClick={() => { setIsTaskModalOpen(false); setTaskTitle(""); }}>Cancel</BtnOutline>
              <BtnPurple onClick={() => { setIsTaskModalOpen(false); setTaskTitle(""); }} icon={Plus}>Create Task</BtnPurple>
            </div>
          </div>
        </div>,
        document.body,
      )}
    </div>
  );
};

export default DailyTab;