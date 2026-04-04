// ─────────────────────────────────────────────
// HistoryTab.jsx
// ─────────────────────────────────────────────
import React, { useState, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import {
  History as HistoryIcon, AlertTriangle, FileText,
  ArrowLeft, ArrowRight, ChevronDown, ChevronUp,
  RefreshCw, Edit, Trash, Sparkles, X, Loader2
} from "lucide-react";
import { cn } from "@/lib/utils";
import { BASE_URL } from "./shared";

// ─────────────────────────────────────────────
// Auth Headers Helper
// ─────────────────────────────────────────────
const getHeadersWithToken = () => {
  const token = localStorage.getItem("auth_token");
  return {
    "Content-Type": "application/json",
    ...(token ? { "Authorization": token } : {})
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
  if (Array.isArray(json))                                  list = json;
  else if (Array.isArray(json.data?.daily_meeting_configs)) list = json.data.daily_meeting_configs;
  else if (Array.isArray(json.data?.meeting_configs))       list = json.data.meeting_configs;
  else if (Array.isArray(json.data))                        list = json.data;
  else if (Array.isArray(json.daily_meeting_configs))       list = json.daily_meeting_configs;
  else if (Array.isArray(json.meeting_configs))             list = json.meeting_configs;
  return list.map((m) => ({
    id:    String(m.id),
    label: m.name ?? m.title ?? m.label ?? `Meeting ${m.id}`,
  }));
};

const fetchDailyMeetingHistory = async (meetingId, date) => {
  const params = new URLSearchParams({ date });
  if (meetingId) params.set("meeting_id", meetingId);
  const url = `${BASE_URL}/user_journals/daily_meeting?${params.toString()}`;
  const res = await fetch(url, {
    method: "GET",
    headers: getHeadersWithToken()
  });
  const raw = await res.text();
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  let json;
  try { json = JSON.parse(raw); } catch { return null; }
  return json?.data ?? json;
};

// ── PUT: dynamic ID + dynamic payload from form ──
const updateMeetingNotesAPI = async (journalId, payload) => {
  const url = `${BASE_URL}/user_journals/${journalId}`;
  const res = await fetch(url, {
    method: "PUT",
    headers: getHeadersWithToken(),
    body: JSON.stringify(payload)
  });
  if (!res.ok) throw new Error(`Failed to update: HTTP ${res.status}`);
  return await res.json();
};

// ── DELETE: dynamic ID ──
const deleteMeetingNotesAPI = async (journalId) => {
  const url = `${BASE_URL}/user_journals/${journalId}`;
  const res = await fetch(url, {
    method: "DELETE",
    headers: getHeadersWithToken(),
  });
  if (!res.ok) throw new Error(`Failed to delete: HTTP ${res.status}`);
  // DELETE may return 204 (no body)
  const text = await res.text();
  try { return text ? JSON.parse(text) : {}; } catch { return {}; }
};

// ─────────────────────────────────────────────
// Dynamic Notes Compiler
// ─────────────────────────────────────────────
const compileDynamicNotes = (data) => {
  if (!data) return "";
  let text = "Key Discussion Points:\nDETAILED REPORTS\n\n";
  const reports = data.member_reports || [];

  if (reports.length === 0) return text + "No detailed reports submitted yet.";

  reports.forEach(r => {
    text += `${r.user?.name || r.name || "Unknown Member"}\n`;
    text += `Attendance: ${r.is_absent ? "X Absent" : "✓ Present"}\n`;
    text += `Self Rating: ${r.self_rating || r.score || "N/A"}/10\n`;

    text += `Accomplishments:\n`;
    const accomplishments = r.report_data?.accomplishments || r.accomplishments || [];
    if (accomplishments.length === 0) text += `- None\n`;
    accomplishments.forEach(a => { text += `✓ ${a.title || a.text || a}\n`; });

    text += `Tomorrow's Plan:\n`;
    const plans = r.report_data?.tomorrow_plan || r.plans || [];
    if (plans.length === 0) text += `- None\n`;
    plans.forEach(p => { text += `- ${p.title || p.text || p}\n`; });

    text += `\n`;
  });
  return text.trim();
};

// ─────────────────────────────────────────────
// Parse accomplishments/plans from textarea back to array
// ─────────────────────────────────────────────
const parseAccomplishments = (text) => {
  return text
    .split("\n")
    .map(l => l.replace(/^[✓\-•]\s*/, "").trim())
    .filter(Boolean)
    .map(title => ({ title }));
};

// ─────────────────────────────────────────────
// HistoryTab Component
// ─────────────────────────────────────────────
const HistoryTab = () => {
  const [selectedMeetingId, setSelectedMeetingId] = useState("");
  const [selectedDate, setSelectedDate]           = useState(() => new Date().toISOString().split("T")[0]);

  const [meetingData, setMeetingData]               = useState(null);
  const [isLoading, setIsLoading]                   = useState(false);
  const [isNotesExpanded, setIsNotesExpanded]       = useState(true);
  const [meetings, setMeetings]                     = useState([]);
  const [isFetchingMeetings, setIsFetchingMeetings] = useState(false);

  // ── Edit Modal States ──
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isSavingNotes, setIsSavingNotes]     = useState(false);
  const [isDeletingNotes, setIsDeletingNotes] = useState(false);

  // ── Edit Form State (mirrors report_data from API) ──
  const [editForm, setEditForm] = useState({
    self_rating:    8,
    status:         "submitted",
    big_win:        "",
    accomplishments: "",   // textarea — newline-separated
    tomorrow_plan:   "",   // textarea — newline-separated
    tasks_issues:    "",   // textarea — newline-separated
    kpi_score:       "",
    kpi_tasks:       "",
    kpi_issues:      "",
    kpi_timing:      "",
    kpi_planning:    "",
  });

  // ── Currently editing journal ID (from API response) ──
  const [editingJournalId, setEditingJournalId] = useState(null);

  const loadMeetings = useCallback(async () => {
    setIsFetchingMeetings(true);
    try {
      const data = await fetchMeetingsAPI();
      setMeetings(data);
      if (data.length > 0 && !selectedMeetingId) {
        setSelectedMeetingId(data[0].id);
      }
    } catch (err) {
      console.error("[Meetings] fetch error:", err);
    } finally {
      setIsFetchingMeetings(false);
    }
  }, [selectedMeetingId]);

  useEffect(() => { loadMeetings(); }, [loadMeetings]);

  const loadHistory = useCallback(async () => {
    if (!selectedMeetingId) return;
    setIsLoading(true);
    try {
      const data = await fetchDailyMeetingHistory(selectedMeetingId, selectedDate);
      setMeetingData(data);
    } catch (err) {
      console.error("Failed to load history:", err);
      setMeetingData(null);
    } finally {
      setIsLoading(false);
    }
  }, [selectedMeetingId, selectedDate]);

  useEffect(() => { loadHistory(); }, [loadHistory]);

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

  const formattedDateLabel = new Date(selectedDate).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "2-digit" });
  const formattedFullDate  = new Date(selectedDate).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });

  const selectedMeetingLabel = meetings.find(m => m.id === selectedMeetingId)?.label ?? "Meeting";

  const missedMembers   = meetingData?.missed_members || [];
  const attendeesCount  = meetingData?.submitted || 0;
  const isMissedDay     = meetingData?.date_row?.find(d => d.full_date === selectedDate)?.status === "missed";
  const compiledRawNotes = compileDynamicNotes(meetingData);

  // ── Open Edit Modal — pre-fill from API data ──
  const handleOpenEditModal = () => {
    // Try to get journal from meetingData — adjust field name if your API differs
    const journal = meetingData?.journal || meetingData?.user_journal || meetingData;
    const rd      = journal?.report_data || {};
    const kpis    = rd.kpis || {};

    // Store the journal ID for PUT/DELETE
    setEditingJournalId(journal?.id ?? null);

    // Pre-fill form from existing data
    setEditForm({
      self_rating:     journal?.self_rating ?? 8,
      status:          journal?.status ?? "submitted",
      big_win:         rd.big_win ?? "",
      accomplishments: (rd.accomplishments || []).map(a => a.title || a.text || a).join("\n"),
      tomorrow_plan:   (rd.tomorrow_plan   || []).map(p => p.title || p.text || p).join("\n"),
      tasks_issues:    (rd.tasks_issues    || []).map(t => t.title || t.text || t).join("\n"),
      kpi_score:    kpis.score    ?? "",
      kpi_tasks:    kpis.tasks    ?? "",
      kpi_issues:   kpis.issues   ?? "",
      kpi_timing:   kpis.timing   ?? "",
      kpi_planning: kpis.planning ?? "",
    });

    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => setIsEditModalOpen(false);

  // ── Save — build payload from form, use dynamic ID ──
  const handleSaveNotes = async () => {
    if (!editingJournalId) {
      alert("No journal ID found. Cannot save.");
      return;
    }
    setIsSavingNotes(true);
    try {
      const payload = {
        user_journal: {
          self_rating: Number(editForm.self_rating) || 8,
          status:      editForm.status || "submitted",
          report_data: {
            big_win: editForm.big_win.trim() || undefined,
            accomplishments: parseAccomplishments(editForm.accomplishments),
            tomorrow_plan:   parseAccomplishments(editForm.tomorrow_plan),
            tasks_issues:    parseAccomplishments(editForm.tasks_issues).map(t => ({
              ...t, status: "open"
            })),
            kpis: {
              score:    editForm.kpi_score    || undefined,
              tasks:    editForm.kpi_tasks    || undefined,
              issues:   editForm.kpi_issues   || undefined,
              timing:   editForm.kpi_timing   || undefined,
              planning: editForm.kpi_planning || undefined,
            },
          },
        },
      };

      console.log("[HistoryTab] PUT /user_journals/" + editingJournalId, JSON.stringify(payload));
      await updateMeetingNotesAPI(editingJournalId, payload);
      setIsEditModalOpen(false);
      loadHistory();
    } catch (err) {
      alert("Error saving notes: " + err.message);
    } finally {
      setIsSavingNotes(false);
    }
  };

  // ── Delete — use dynamic ID ──
  const handleDeleteNotes = async () => {
    if (!editingJournalId && !meetingData?.journal?.id && !meetingData?.id) {
      alert("No journal ID found. Cannot delete.");
      return;
    }
    const journalId = editingJournalId
      || meetingData?.journal?.id
      || meetingData?.user_journal?.id
      || meetingData?.id;

    if (!window.confirm(`Are you sure you want to delete these notes? (ID: ${journalId})`)) return;

    setIsDeletingNotes(true);
    try {
      console.log("[HistoryTab] DELETE /user_journals/" + journalId);
      await deleteMeetingNotesAPI(journalId);
      loadHistory();
    } catch (err) {
      alert("Error deleting notes: " + err.message);
    } finally {
      setIsDeletingNotes(false);
    }
  };

  // ── Input helper ──
  const setField = (key, val) => setEditForm(prev => ({ ...prev, [key]: val }));

  return (
    <div className="pb-12 space-y-5 px-4 sm:px-6 relative">

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[rgba(218,119,86,0.15)] pb-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-2xl bg-[#FAECE7] flex items-center justify-center shrink-0">
            <HistoryIcon className="w-4 h-4 text-[#DA7756]" />
          </div>
          <div>
            <h2 className="text-base font-bold text-neutral-900">Daily Meeting History</h2>
            <p className="text-xs text-neutral-500 mt-0.5">View and edit past daily meeting reports</p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <div className="relative">
            <select
              value={selectedMeetingId}
              onChange={e => setSelectedMeetingId(e.target.value)}
              disabled={isFetchingMeetings}
              className="appearance-none bg-white border border-[rgba(218,119,86,0.22)] rounded-2xl py-1.5 pl-3 pr-8 text-sm font-semibold text-neutral-700 focus:outline-none focus:border-[#DA7756] shadow-sm disabled:opacity-60"
            >
              <option value="">{isFetchingMeetings ? "Loading…" : "Select Meeting"}</option>
              {meetings.map(m => (
                <option key={m.id} value={m.id}>{m.label}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400 w-3.5 h-3.5 pointer-events-none" />
          </div>

          <div className="flex items-center gap-1">
            <button onClick={handlePrevDay} className="px-2 py-1.5 bg-white border border-[rgba(218,119,86,0.22)] rounded-2xl hover:bg-[#fef6f4] shadow-sm text-[#DA7756] transition-colors">
              <ArrowLeft className="w-4 h-4" />
            </button>
            <input
              type="date"
              value={selectedDate}
              onChange={e => setSelectedDate(e.target.value)}
              className="bg-white border border-[rgba(218,119,86,0.22)] rounded-2xl py-1.5 px-3 text-sm font-semibold text-neutral-700 focus:outline-none focus:border-[#DA7756] shadow-sm w-36"
            />
            <button onClick={handleNextDay} className="px-2 py-1.5 bg-white border border-[rgba(218,119,86,0.22)] rounded-2xl hover:bg-[#fef6f4] shadow-sm text-[#DA7756] transition-colors">
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <button onClick={loadHistory} className="flex items-center gap-2 px-3 py-1.5 bg-white border border-[rgba(218,119,86,0.22)] rounded-2xl hover:bg-[#fef6f4] shadow-sm text-sm font-semibold text-[#DA7756] transition-colors">
            <RefreshCw className={cn("w-3.5 h-3.5", isLoading && "animate-spin")} /> Refresh
          </button>
        </div>
      </div>

      {/* Dynamic States */}
      {isLoading ? (
        <div className="flex justify-center py-12">
          <RefreshCw className="w-6 h-6 text-[#DA7756] animate-spin" />
        </div>
      ) : !meetingData ? (
        <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed border-[rgba(218,119,86,0.25)] rounded-2xl text-neutral-400">
          <HistoryIcon size={48} className="mb-4 text-[#DA7756] opacity-20" />
          <p className="text-sm font-medium">No meeting history found for the selected filters</p>
        </div>
      ) : isMissedDay ? (
        <div className="bg-[#fff7ed] border border-[#ffedd5] rounded-2xl p-4 shadow-sm flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-orange-100 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-4 h-4 text-orange-500" />
            </div>
            <div>
              <div className="text-sm font-bold text-orange-900 mb-1.5">
                Missed Meetings on {formattedFullDate} (1):
              </div>
              <span className="inline-block px-3 py-1 bg-white border border-orange-200 text-orange-600 text-xs font-bold rounded-2xl shadow-sm">
                {selectedMeetingLabel}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1.5 bg-green-500 text-white text-xs font-bold rounded-2xl">Done: 0</span>
            <span className="px-3 py-1.5 bg-red-500 text-white text-xs font-bold rounded-2xl">Missed: 1</span>
          </div>
        </div>
      ) : (
        <div className="bg-white border border-[rgba(218,119,86,0.18)] rounded-2xl shadow-sm overflow-hidden">

          {/* Card Header */}
          <div
            className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            style={{ background: "#A855F7" }}
          >
            <div>
              <h3 className="text-2xl font-bold text-white mb-2">{selectedMeetingLabel} for {formattedDateLabel}</h3>
              <div className="flex items-center gap-3 mb-2 text-white/90 text-[13px]">
                <span className="px-3 py-0.5 border border-white/40 text-white text-[11px] font-semibold rounded-md shadow-sm">submitted</span>
                <span className="font-medium">{attendeesCount} attendees</span>
              </div>
              <div className="text-xs text-white/80 mt-2">Date: {formattedFullDate}</div>
            </div>
            <div className="flex items-center gap-3">
              <button className="flex items-center gap-2 px-4 py-2.5 bg-white/20 hover:bg-white/30 border border-white/30 text-white text-sm font-semibold rounded-xl transition-all">
                <Sparkles className="w-4 h-4" /> Generate AI
              </button>
              <button
                onClick={handleOpenEditModal}
                className="flex items-center gap-2 px-5 py-2.5 bg-white/20 hover:bg-white/30 border border-white/30 text-white text-sm font-semibold rounded-xl transition-all"
              >
                <Edit className="w-4 h-4" /> Edit
              </button>
              <button
                onClick={handleDeleteNotes}
                disabled={isDeletingNotes}
                className="w-10 h-10 flex items-center justify-center bg-white/20 hover:bg-red-500/80 border border-white/30 text-white rounded-xl transition-all disabled:opacity-50"
                title="Delete Meeting Notes"
              >
                {isDeletingNotes ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Notes section */}
          <div>
            <div
              className="p-5 flex items-center justify-between cursor-pointer bg-neutral-50 hover:bg-neutral-100 border-b border-[rgba(218,119,86,0.1)] transition-colors"
              onClick={() => setIsNotesExpanded(!isNotesExpanded)}
            >
              <div className="flex items-center gap-2 font-bold text-neutral-800 text-base">
                Raw Meeting Notes
              </div>
              {isNotesExpanded
                ? <ChevronUp className="w-5 h-5 text-neutral-400" />
                : <ChevronDown className="w-5 h-5 text-neutral-400" />
              }
            </div>
            {isNotesExpanded && (
              <div className="p-6 space-y-6">
                <div className="bg-white">
                  <h4 className="text-[14px] font-bold text-neutral-800 mb-3">
                    Team Members Who Missed Report ({missedMembers.length}):
                  </h4>
                  {missedMembers.length === 0 ? (
                    <p className="text-sm text-neutral-400 italic">No missed reports.</p>
                  ) : (
                    <div className="flex flex-col gap-1.5">
                      {missedMembers.map(member => (
                        <span key={member.id || member.name || member} className="text-blue-500 text-[14px] hover:underline cursor-pointer w-fit">
                          {member.name || member}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <div>
                  <pre className="whitespace-pre-wrap font-sans text-[14px] text-neutral-700 leading-relaxed">
                    {compiledRawNotes}
                  </pre>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Edit Modal ── */}
      {isEditModalOpen && createPortal(
        <div
          className="fixed inset-0 flex items-center justify-center bg-black/60 p-4 sm:p-8"
          style={{ zIndex: 2147483647 }}
        >
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl overflow-hidden border border-neutral-200 flex flex-col max-h-[90vh]">

            {/* Modal Header */}
            <div className="flex justify-between items-center p-5 border-b border-neutral-200 bg-white">
              <div>
                <h5 className="font-bold text-lg text-neutral-800">Edit Meeting — {formattedFullDate}</h5>
                {editingJournalId && (
                  <p className="text-xs text-neutral-400 mt-0.5">Journal ID: {editingJournalId}</p>
                )}
              </div>
              <button
                onClick={handleCloseEditModal}
                className="p-1.5 text-neutral-500 hover:text-neutral-800 hover:bg-neutral-100 rounded-md transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 flex-1 overflow-y-auto bg-neutral-50/50 space-y-5">

              {/* Self Rating + Status */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-semibold text-neutral-700 mb-1.5 block">
                    Self Rating <span className="text-neutral-400 font-normal">(out of 10)</span>
                  </label>
                  <input
                    type="number"
                    min={0} max={10}
                    value={editForm.self_rating}
                    onChange={e => setField("self_rating", e.target.value)}
                    className="w-full border border-neutral-300 rounded-lg px-3 py-2 text-sm text-neutral-700 bg-white focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold text-neutral-700 mb-1.5 block">Status</label>
                  <select
                    value={editForm.status}
                    onChange={e => setField("status", e.target.value)}
                    className="w-full border border-neutral-300 rounded-lg px-3 py-2 text-sm text-neutral-700 bg-white focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                  >
                    <option value="submitted">Submitted</option>
                    <option value="draft">Draft</option>
                  </select>
                </div>
              </div>

              {/* Big Win */}
              <div>
                <label className="text-sm font-semibold text-neutral-700 mb-1.5 block">Big Win</label>
                <input
                  type="text"
                  value={editForm.big_win}
                  onChange={e => setField("big_win", e.target.value)}
                  placeholder="e.g. Closed 3 client deals today"
                  className="w-full border border-neutral-300 rounded-lg px-3 py-2 text-sm text-neutral-700 bg-white focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                />
              </div>

              {/* Accomplishments */}
              <div>
                <label className="text-sm font-semibold text-neutral-700 mb-1.5 block">
                  Accomplishments <span className="text-neutral-400 font-normal">(one per line)</span>
                </label>
                <textarea
                  value={editForm.accomplishments}
                  onChange={e => setField("accomplishments", e.target.value)}
                  placeholder={"Deployed auth module\nFixed login bug"}
                  rows={4}
                  className="w-full border border-neutral-300 rounded-lg p-3 text-sm text-neutral-700 bg-white focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 resize-none font-sans"
                />
              </div>

              {/* Tomorrow's Plan */}
              <div>
                <label className="text-sm font-semibold text-neutral-700 mb-1.5 block">
                  Tomorrow's Plan <span className="text-neutral-400 font-normal">(one per line)</span>
                </label>
                <textarea
                  value={editForm.tomorrow_plan}
                  onChange={e => setField("tomorrow_plan", e.target.value)}
                  placeholder={"Code review for PR #42\nSync with design team"}
                  rows={3}
                  className="w-full border border-neutral-300 rounded-lg p-3 text-sm text-neutral-700 bg-white focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 resize-none font-sans"
                />
              </div>

              {/* Tasks / Issues */}
              <div>
                <label className="text-sm font-semibold text-neutral-700 mb-1.5 block">
                  Tasks / Issues <span className="text-neutral-400 font-normal">(one per line)</span>
                </label>
                <textarea
                  value={editForm.tasks_issues}
                  onChange={e => setField("tasks_issues", e.target.value)}
                  placeholder={"Performance issue in dashboard\nLogin redirect bug"}
                  rows={3}
                  className="w-full border border-neutral-300 rounded-lg p-3 text-sm text-neutral-700 bg-white focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 resize-none font-sans"
                />
              </div>

              {/* KPIs */}
              <div>
                <label className="text-sm font-semibold text-neutral-700 mb-2 block">KPIs</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {[
                    { key: "kpi_score",    label: "Score"    },
                    { key: "kpi_tasks",    label: "Tasks"    },
                    { key: "kpi_issues",   label: "Issues"   },
                    { key: "kpi_timing",   label: "Timing"   },
                    { key: "kpi_planning", label: "Planning" },
                  ].map(({ key, label }) => (
                    <div key={key}>
                      <label className="text-xs font-medium text-neutral-500 mb-1 block">{label}</label>
                      <input
                        type="text"
                        value={editForm[key]}
                        onChange={e => setField(key, e.target.value)}
                        placeholder="e.g. 5/25"
                        className="w-full border border-neutral-300 rounded-lg px-3 py-2 text-sm text-neutral-700 bg-white focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-5 border-t border-neutral-200 bg-white flex justify-end gap-3">
              <button
                onClick={handleCloseEditModal}
                disabled={isSavingNotes}
                className="px-6 py-2 border border-neutral-300 text-neutral-700 bg-white hover:bg-neutral-50 rounded-lg text-[14px] font-semibold transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveNotes}
                disabled={isSavingNotes}
                className="flex items-center justify-center gap-2 min-w-[130px] px-6 py-2 bg-[#A855F7] hover:bg-purple-600 text-white rounded-lg text-[14px] font-semibold transition-colors disabled:opacity-50 shadow-sm"
              >
                {isSavingNotes ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save Changes"}
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