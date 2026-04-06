// ─────────────────────────────────────────────
// HistoryTab.jsx — Themed to match SettingsTab
// Edit modal: single "Meeting Notes" textarea (as shown in video)
// ─────────────────────────────────────────────
import React, { useState, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import {
  History as HistoryIcon,
  AlertTriangle,
  FileText,
  ArrowLeft,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  Edit,
  Trash,
  Sparkles,
  X,
  Loader2,
  Calendar,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { BASE_URL } from "./Shared";

// ─────────────────────────────────────────────
// Auth Headers Helper
// ─────────────────────────────────────────────
const getHeadersWithToken = () => {
  const token = localStorage.getItem("auth_token");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

// ─────────────────────────────────────────────
// APIs
// ─────────────────────────────────────────────
const fetchMeetingsAPI = async () => {
  const res = await fetch(`${BASE_URL}/daily_meeting_configs`, {
    method: "GET",
    headers: getHeadersWithToken(),
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

// NEW API: Fetch daily history with weeks parameter
const fetchDailyHistoryWithWeeks = async (meetingId, weeks) => {
  const params = new URLSearchParams();
  if (meetingId && meetingId !== "") params.set("meeting_id", meetingId);
  if (weeks) params.set("weeks", weeks);
  
  const url = `${BASE_URL}/user_journals/daily_history?${params.toString()}`;
  console.log("Fetching weekly URL:", url); // Debug log
  
  const res = await fetch(url, { 
    method: "GET", 
    headers: getHeadersWithToken() 
  });
  
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  
  const raw = await res.text();
  let json;
  try { json = JSON.parse(raw); } catch { return null; }
  return json?.data ?? json;
};

const fetchDailyMeetingHistory = async (meetingId, date) => {
  const params = new URLSearchParams({ date });
  if (meetingId && meetingId !== "") params.set("meeting_id", meetingId);
  const url = `${BASE_URL}/user_journals/daily_meeting?${params.toString()}`;
  const res = await fetch(url, { method: "GET", headers: getHeadersWithToken() });
  const raw = await res.text();
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  let json;
  try { json = JSON.parse(raw); } catch { return null; }
  return json?.data ?? json;
};

const updateMeetingNotesAPI = async (journalId, payload) => {
  const url = `${BASE_URL}/user_journals/${journalId}`;
  const res = await fetch(url, {
    method: "PUT",
    headers: getHeadersWithToken(),
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(`Failed to update: HTTP ${res.status}`);
  return await res.json();
};

const deleteMeetingNotesAPI = async (journalId) => {
  const url = `${BASE_URL}/user_journals/${journalId}`;
  const res = await fetch(url, { method: "DELETE", headers: getHeadersWithToken() });
  if (!res.ok) throw new Error(`Failed to delete: HTTP ${res.status}`);
  const text = await res.text();
  try { return text ? JSON.parse(text) : {}; } catch { return {}; }
};

// ─────────────────────────────────────────────
// Dynamic Notes Compiler — produces the editable markdown text
// ─────────────────────────────────────────────
const compileDynamicNotes = (data) => {
  if (!data) return "";

  let text = "**Key Discussion Points:**\n\n---\n\n## DETAILED REPORTS\n\n";
  const reports = data.member_reports || [];

  if (reports.length === 0) return text + "No detailed reports submitted yet.";

  reports.forEach((r) => {
    text += `### ${r.user?.name || r.name || "Unknown Member"}\n`;
    text += `- **Attendance:** ${r.is_absent ? "✗ Absent" : "✓ Present"}\n`;
    text += `- **Self Rating:** ${r.self_rating || r.score || "N/A"}/10\n`;
    text += `- **Status:** ${r.status || "submitted"}\n\n`;

    text += `**Accomplishments:**\n`;
    const accomplishments = r.report_data?.accomplishments || r.accomplishments || [];
    if (accomplishments.length === 0) text += `- None\n`;
    accomplishments.forEach((a) => { text += `- ✓ ${a.title || a.text || a}\n`; });

    text += `\n**Tomorrow's Plan:**\n`;
    const plans = r.report_data?.tomorrow_plan || r.plans || [];
    if (plans.length === 0) text += `- None\n`;
    plans.forEach((p) => { text += `- ${p.title || p.text || p}\n`; });

    text += `\n---\n\n`;
  });

  return text.trim();
};

// ─────────────────────────────────────────────
// HistoryTab Component
// ─────────────────────────────────────────────
const HistoryTab = () => {
  const [selectedMeetingId, setSelectedMeetingId] = useState("");
  const [selectedDate, setSelectedDate] = useState(
    () => new Date().toISOString().split("T")[0]
  );
  const [selectedWeeks, setSelectedWeeks] = useState(4);
  const [meetingData, setMeetingData] = useState(null);
  const [weeklyHistory, setWeeklyHistory] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingWeekly, setIsLoadingWeekly] = useState(false);
  const [isNotesExpanded, setIsNotesExpanded] = useState(true);
  const [meetings, setMeetings] = useState([]);
  const [isFetchingMeetings, setIsFetchingMeetings] = useState(false);
  const [viewMode, setViewMode] = useState("daily"); // "daily" or "weekly"

  // ── Edit Modal ──
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isSavingNotes, setIsSavingNotes] = useState(false);
  const [isDeletingNotes, setIsDeletingNotes] = useState(false);
  const [editingJournalId, setEditingJournalId] = useState(null);

  // Single textarea value
  const [meetingNotesText, setMeetingNotesText] = useState("");

  const loadMeetings = useCallback(async () => {
    setIsFetchingMeetings(true);
    try {
      const data = await fetchMeetingsAPI();
      setMeetings(data);
      if (data.length > 0 && !selectedMeetingId) setSelectedMeetingId(data[0].id);
    } catch (err) {
      console.error("[Meetings] fetch error:", err);
    } finally {
      setIsFetchingMeetings(false);
    }
  }, [selectedMeetingId]);

  useEffect(() => { loadMeetings(); }, [loadMeetings]);

  // Load weekly history using the new API
  const loadWeeklyHistory = useCallback(async () => {
    console.log("Loading weekly history with:", { selectedMeetingId, selectedWeeks });
    setIsLoadingWeekly(true);
    try {
      const data = await fetchDailyHistoryWithWeeks(
        selectedMeetingId || undefined,
        selectedWeeks
      );
      console.log("Weekly history data:", data);
      setWeeklyHistory(data);
    } catch (err) {
      console.error("Failed to load weekly history:", err);
      setWeeklyHistory(null);
    } finally {
      setIsLoadingWeekly(false);
    }
  }, [selectedMeetingId, selectedWeeks]);

  // Load daily meeting history
  const loadDailyHistory = useCallback(async () => {
    console.log("Loading daily history with:", { selectedMeetingId, selectedDate });
    setIsLoading(true);
    try {
      const data = await fetchDailyMeetingHistory(
        selectedMeetingId || undefined,
        selectedDate
      );
      console.log("Daily history data:", data);
      setMeetingData(data);
    } catch (err) {
      console.error("Failed to load history:", err);
      setMeetingData(null);
    } finally {
      setIsLoading(false);
    }
  }, [selectedMeetingId, selectedDate]);

  // Fix: Added proper dependencies to useEffect
  useEffect(() => { 
    if (viewMode === "daily") {
      loadDailyHistory();
    } else {
      loadWeeklyHistory();
    }
  }, [viewMode, selectedMeetingId, selectedDate, selectedWeeks, loadDailyHistory, loadWeeklyHistory]);

  const handlePrevDay = () => {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() - 1);
    setSelectedDate(d.toISOString().split("T")[0]);
  };
  
  const handleNextDay = () => {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() + 1);
    setSelectedDate(d.toISOString().split("T")[0]);
  };

  const handleWeeksChange = (weeks) => {
    setSelectedWeeks(weeks);
  };

  const formattedDateLabel = new Date(selectedDate).toLocaleDateString("en-GB", {
    day: "numeric", month: "short", year: "2-digit",
  });
  const formattedFullDate = new Date(selectedDate).toLocaleDateString("en-US", {
    month: "long", day: "numeric", year: "numeric",
  });

  const selectedMeetingLabel = meetings.find((m) => m.id === selectedMeetingId)?.label ?? "All Meetings";

  const missedMembers = meetingData?.missed_members || [];
  const attendeesCount = meetingData?.submitted || 0;
  const isMissedDay = meetingData?.date_row?.find((d) => d.full_date === selectedDate)?.status === "missed";

  const compiledRawNotes = compileDynamicNotes(meetingData);

  // ── Open Edit Modal — pre-fill textarea with compiled notes ──
  const handleOpenEditModal = () => {
    const journal = meetingData?.journal || meetingData?.user_journal || meetingData;
    setEditingJournalId(journal?.id ?? null);
    setMeetingNotesText(
      journal?.meeting_notes ??
      journal?.notes ??
      compiledRawNotes
    );
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => setIsEditModalOpen(false);

  // ── Save — send meeting_notes as plain text ──
  const handleSaveNotes = async () => {
    if (!editingJournalId) { alert("No journal ID found. Cannot save."); return; }
    setIsSavingNotes(true);
    try {
      const payload = {
        user_journal: {
          meeting_notes: meetingNotesText,
        },
      };
      await updateMeetingNotesAPI(editingJournalId, payload);
      setIsEditModalOpen(false);
      loadDailyHistory();
    } catch (err) {
      alert("Error saving notes: " + err.message);
    } finally {
      setIsSavingNotes(false);
    }
  };

  // ── Delete ──
  const handleDeleteNotes = async () => {
    const journalId = editingJournalId || meetingData?.journal?.id || meetingData?.user_journal?.id || meetingData?.id;
    if (!journalId) { alert("No journal ID found. Cannot delete."); return; }
    if (!window.confirm(`Are you sure you want to delete these notes?`)) return;
    setIsDeletingNotes(true);
    try {
      await deleteMeetingNotesAPI(journalId);
      loadDailyHistory();
    } catch (err) {
      alert("Error deleting notes: " + err.message);
    } finally {
      setIsDeletingNotes(false);
    }
  };

  // Render Weekly View
  const renderWeeklyView = () => {
    if (isLoadingWeekly) {
      return (
        <div className="flex justify-center py-20">
          <RefreshCw className="w-6 h-6 text-[#D37E5F] animate-spin" />
        </div>
      );
    }

    if (!weeklyHistory) {
      return (
        <div className="text-center py-24 bg-white border-2 border-dashed border-[#F0EBE8] rounded-[32px]">
          <HistoryIcon className="w-10 h-10 text-[#D37E5F] opacity-30 mx-auto mb-4" />
          <p className="text-[#8C8580] font-bold text-sm">
            No weekly history found for the selected filters.
          </p>
          <button
            onClick={() => loadWeeklyHistory()}
            className="mt-4 px-4 py-2 bg-[#D37E5F] text-white rounded-[16px] text-sm font-bold"
          >
            Retry
          </button>
        </div>
      );
    }

    // Handle different response structures
    let historyEntries = [];
    if (Array.isArray(weeklyHistory)) {
      historyEntries = weeklyHistory;
    } else if (weeklyHistory.entries && Array.isArray(weeklyHistory.entries)) {
      historyEntries = weeklyHistory.entries;
    } else if (weeklyHistory.data && Array.isArray(weeklyHistory.data)) {
      historyEntries = weeklyHistory.data;
    } else if (typeof weeklyHistory === 'object') {
      // If it's a single object, wrap it in an array
      historyEntries = [weeklyHistory];
    }

    if (historyEntries.length === 0) {
      return (
        <div className="text-center py-24 bg-white border-2 border-dashed border-[#F0EBE8] rounded-[32px]">
          <p className="text-[#8C8580] font-bold text-sm">No entries found for the past {selectedWeeks} weeks.</p>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {historyEntries.map((entry, index) => (
          <div key={index} className="bg-white border border-[#F0EBE8] rounded-[24px] shadow-sm overflow-hidden">
            <div className="p-4 bg-[#FCFAFA] border-b border-[#F0EBE8]">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-[#D37E5F]" />
                  <h4 className="text-base font-black text-[#1A1A1A]">
                    {entry.date || entry.meeting_date || `Entry ${index + 1}`}
                  </h4>
                </div>
                <span className="px-3 py-1 bg-[#D37E5F]/10 text-[#D37E5F] text-xs font-bold rounded-[8px]">
                  {entry.submitted || entry.attendees_count || 0} submitted
                </span>
              </div>
            </div>
            {entry.notes && (
              <div className="p-4">
                <pre className="whitespace-pre-wrap font-sans text-sm text-[#1A1A1A] leading-relaxed">
                  {entry.notes}
                </pre>
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div
      className="pb-12 space-y-6 px-4 sm:px-8 min-h-screen pt-8"
      style={{ fontFamily: "'Poppins', sans-serif" }}
    >
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-[24px] font-black text-[#1A1A1A] tracking-tight">
            Daily Meeting History
          </h2>
          <p className="text-[12px] font-bold text-[#8C8580] uppercase tracking-widest mt-1">
            View and edit past daily meeting reports
          </p>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* View Mode Toggle */}
          <div className="flex gap-1 bg-[#FCFAFA] border border-[#F0EBE8] rounded-[16px] p-1">
            <button
              onClick={() => setViewMode("daily")}
              className={cn(
                "px-4 py-1.5 text-sm font-bold rounded-[12px] transition-all",
                viewMode === "daily"
                  ? "bg-[#D37E5F] text-white"
                  : "text-[#8C8580] hover:text-[#1A1A1A]"
              )}
            >
              Daily
            </button>
            <button
              onClick={() => setViewMode("weekly")}
              className={cn(
                "px-4 py-1.5 text-sm font-bold rounded-[12px] transition-all",
                viewMode === "weekly"
                  ? "bg-[#D37E5F] text-white"
                  : "text-[#8C8580] hover:text-[#1A1A1A]"
              )}
            >
              Weekly
            </button>
          </div>

          {/* Meeting Selector - Optional now */}
          <div className="relative">
            <select
              value={selectedMeetingId}
              onChange={(e) => setSelectedMeetingId(e.target.value)}
              disabled={isFetchingMeetings}
              className="appearance-none bg-[#FCFAFA] border border-[#F0EBE8] rounded-[16px] py-2.5 pl-4 pr-9 text-sm font-bold text-[#1A1A1A] focus:outline-none focus:border-[#D37E5F] shadow-sm disabled:opacity-60 transition-colors"
            >
              <option value="">All Meetings (Optional)</option>
              {meetings.map((m) => (
                <option key={m.id} value={m.id}>{m.label}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8C8580] pointer-events-none" />
          </div>

          {/* Conditional Controls based on view mode */}
          {viewMode === "daily" ? (
            <>
              {/* Date Navigation */}
              <div className="flex items-center gap-1.5">
                <button
                  onClick={handlePrevDay}
                  className="p-2 bg-white border border-[#F0EBE8] rounded-[12px] hover:bg-[#FCFAFA] hover:border-[#D37E5F] text-[#8C8580] hover:text-[#1A1A1A] shadow-sm transition-all"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="bg-[#FCFAFA] border border-[#F0EBE8] rounded-[16px] py-2.5 px-4 text-sm font-bold text-[#1A1A1A] focus:outline-none focus:border-[#D37E5F] shadow-sm transition-colors"
                />
                <button
                  onClick={handleNextDay}
                  className="p-2 bg-white border border-[#F0EBE8] rounded-[12px] hover:bg-[#FCFAFA] hover:border-[#D37E5F] text-[#8C8580] hover:text-[#1A1A1A] shadow-sm transition-all"
                >
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </>
          ) : (
            <>
              {/* Weeks Selector */}
              <div className="relative">
                <select
                  value={selectedWeeks}
                  onChange={(e) => handleWeeksChange(Number(e.target.value))}
                  className="appearance-none bg-[#FCFAFA] border border-[#F0EBE8] rounded-[16px] py-2.5 pl-4 pr-9 text-sm font-bold text-[#1A1A1A] focus:outline-none focus:border-[#D37E5F] shadow-sm transition-colors"
                >
                  <option value={1}>Last 1 week</option>
                  <option value={2}>Last 2 weeks</option>
                  <option value={3}>Last 3 weeks</option>
                  <option value={4}>Last 4 weeks</option>
                  <option value={8}>Last 8 weeks</option>
                  <option value={12}>Last 12 weeks</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8C8580] pointer-events-none" />
              </div>
            </>
          )}

          {/* Refresh */}
          <button
            onClick={() => viewMode === "daily" ? loadDailyHistory() : loadWeeklyHistory()}
            className="flex items-center gap-2 px-4 py-2.5 bg-white border border-[#F0EBE8] rounded-[16px] hover:bg-[#FCFAFA] shadow-sm text-sm font-bold text-[#1A1A1A] transition-all"
          >
            <RefreshCw className={cn("w-4 h-4 text-[#8C8580]", (isLoading || isLoadingWeekly) && "animate-spin")} />
            Refresh
          </button>
        </div>
      </div>

      {/* ── Content based on view mode ── */}
      {viewMode === "weekly" ? (
        renderWeeklyView()
      ) : (
        <>
          {isLoading ? (
            <div className="flex justify-center py-20">
              <RefreshCw className="w-6 h-6 text-[#D37E5F] animate-spin" />
            </div>
          ) : !meetingData ? (
            <div className="text-center py-24 bg-white border-2 border-dashed border-[#F0EBE8] rounded-[32px]">
              <HistoryIcon className="w-10 h-10 text-[#D37E5F] opacity-30 mx-auto mb-4" />
              <p className="text-[#8C8580] font-bold text-sm">
                No meeting history found for the selected filters.
              </p>
            </div>
          ) : isMissedDay ? (
            <div className="bg-white border border-[#F0EBE8] rounded-[24px] p-6 shadow-sm flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-[12px] bg-[#FFF3E0] border border-[#FFE0B2] flex items-center justify-center shrink-0">
                  <AlertTriangle className="w-5 h-5 text-[#F57C00]" />
                </div>
                <div>
                  <div className="text-sm font-black text-[#1A1A1A] mb-2">
                    Missed Meeting on {formattedFullDate}
                  </div>
                  <span className="inline-block px-3 py-1 bg-[#FCFAFA] border border-[#F0EBE8] text-[#8C8580] text-[11px] font-bold rounded-[8px]">
                    {selectedMeetingLabel}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-3 py-1.5 bg-[#D37E5F] text-white text-[11px] font-bold rounded-[8px]">
                  Done: 0
                </span>
                <span className="px-3 py-1.5 bg-[#EB4A4A] text-white text-[11px] font-bold rounded-[8px]">
                  Missed: 1
                </span>
              </div>
            </div>
          ) : (
            <div className="bg-white border border-[#F0EBE8] rounded-[24px] shadow-sm overflow-hidden">
              {/* ── Card Header ── */}
              <div className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#D37E5F] rounded-t-[24px]">
                <div>
                  <h3 className="text-[20px] font-black text-white mb-2 tracking-tight">
                    {selectedMeetingLabel} — {formattedDateLabel}
                  </h3>
                  <div className="flex items-center gap-3 text-white/70 text-[12px] font-bold mb-1">
                    <span className="px-3 py-1 border border-white/20 text-white text-[10px] font-black rounded-[8px] uppercase tracking-widest">
                      Submitted
                    </span>
                    <span>{attendeesCount} attendees</span>
                  </div>
                  <div className="text-[11px] text-white/50 font-bold mt-1 uppercase tracking-widest">
                    {formattedFullDate}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button className="flex items-center gap-2 px-4 py-2.5 bg-white/10 hover:bg-white/20 border border-white/20 text-white text-sm font-bold rounded-[16px] transition-all">
                    <Sparkles className="w-4 h-4" /> Generate AI
                  </button>
                  <button
                    onClick={handleOpenEditModal}
                    className="flex items-center gap-2 px-4 py-2.5 bg-white/10 hover:bg-white/20 border border-white/20 text-white text-sm font-bold rounded-[16px] transition-all"
                  >
                    <Edit className="w-4 h-4" /> Edit
                  </button>
                  <button
                    onClick={handleDeleteNotes}
                    disabled={isDeletingNotes}
                    className="w-10 h-10 flex items-center justify-center bg-white/10 hover:bg-[#EB4A4A]/80 border border-white/20 text-white rounded-[12px] transition-all disabled:opacity-50"
                    title="Delete Meeting Notes"
                  >
                    {isDeletingNotes
                      ? <Loader2 className="w-4 h-4 animate-spin" />
                      : <Trash className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* ── Notes Section ── */}
              <div>
                <div
                  className="px-6 py-4 flex items-center justify-between cursor-pointer bg-[#FCFAFA] hover:bg-[#F5F0EE] border-b border-[#F0EBE8] transition-colors"
                  onClick={() => setIsNotesExpanded(!isNotesExpanded)}
                >
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-[#8C8580]" />
                    <span className="text-sm font-black text-[#1A1A1A]">Raw Meeting Notes</span>
                  </div>
                  {isNotesExpanded
                    ? <ChevronUp className="w-5 h-5 text-[#8C8580]" />
                    : <ChevronDown className="w-5 h-5 text-[#8C8580]" />}
                </div>

                {isNotesExpanded && (
                  <div className="p-6 space-y-6 bg-white">
                    {/* Missed members */}
                    <div>
                      <div className="text-[10px] font-black text-[#8C8580] uppercase tracking-widest mb-3">
                        Team Members Who Missed Report ({missedMembers.length})
                      </div>
                      {missedMembers.length === 0 ? (
                        <p className="text-sm font-bold text-[#8C8580] italic">No missed reports.</p>
                      ) : (
                        <div className="flex flex-col gap-1.5">
                          {missedMembers.map((member) => (
                            <span
                              key={member.id || member.name || member}
                              className="text-sm font-bold text-[#D37E5F] hover:underline cursor-pointer w-fit"
                            >
                              {member.name || member}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Compiled notes */}
                    <div className="bg-[#FCFAFA] border border-[#F0EBE8] rounded-[16px] p-5">
                      <pre className="whitespace-pre-wrap font-sans text-sm text-[#1A1A1A] leading-relaxed font-bold">
                        {compiledRawNotes}
                      </pre>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </>
      )}

      {/* ── Edit Modal — Single textarea only (as per video) ── */}
      {isEditModalOpen &&
        createPortal(
          <div
            className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
            style={{ zIndex: 9999 }}
            onClick={handleCloseEditModal}
          >
            <div
              className="bg-white rounded-[32px] border border-[#F0EBE8] shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="flex items-start justify-between p-6 border-b border-[#F0EBE8] bg-[#FCFAFA]">
                <div>
                  <h2 className="text-[20px] font-black text-[#1A1A1A] tracking-tight">
                    Edit Meeting — {formattedFullDate}
                  </h2>
                  <p className="text-[12px] font-bold text-[#8C8580] mt-1">
                    Update the meeting notes below
                  </p>
                </div>
                <button
                  onClick={handleCloseEditModal}
                  className="text-[#8C8580] hover:text-[#1A1A1A] p-2 rounded-[12px] border border-transparent hover:border-[#F0EBE8] hover:bg-white transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Body — single textarea */}
              <div className="p-6 flex-1 overflow-y-auto bg-white">
                <label className="text-[11px] font-black text-[#8C8580] uppercase tracking-widest mb-2 block">
                  Meeting Notes
                </label>
                <textarea
                  value={meetingNotesText}
                  onChange={(e) => setMeetingNotesText(e.target.value)}
                  rows={16}
                  className="w-full bg-[#FCFAFA] border border-[#F0EBE8] rounded-[16px] px-4 py-3 text-sm font-bold text-[#1A1A1A] focus:outline-none focus:border-[#D37E5F] transition-colors resize-none font-sans leading-relaxed"
                  placeholder="Enter meeting notes here..."
                />
              </div>

              {/* Modal Footer */}
              <div className="p-5 border-t border-[#F0EBE8] bg-[#FCFAFA] flex justify-end gap-3 rounded-b-[32px]">
                <button
                  onClick={handleCloseEditModal}
                  disabled={isSavingNotes}
                  className="px-5 py-2.5 bg-white border border-[#F0EBE8] text-[#8C8580] rounded-[16px] text-sm font-bold hover:bg-gray-50 hover:text-[#1A1A1A] transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveNotes}
                  disabled={isSavingNotes}
                  className={cn(
                    "flex items-center justify-center gap-2 min-w-[140px] px-6 py-2.5 bg-[#D37E5F] hover:bg-[#c96e50] text-white rounded-[16px] text-sm font-bold transition-colors shadow-sm",
                    isSavingNotes && "opacity-50 pointer-events-none"
                  )}
                >
                  {isSavingNotes
                    ? <Loader2 className="w-4 h-4 animate-spin" />
                    : "Save Changes"}
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
};

export default HistoryTab;