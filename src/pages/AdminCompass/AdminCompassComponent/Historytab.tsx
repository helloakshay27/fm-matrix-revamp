import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import {
  History as HistoryIcon,
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
} from "lucide-react";
import { cn } from "@/lib/utils";
import { getBaseUrl, getAuthHeaders } from "./Shared";

// ─────────────────────────────────────────────
// Dynamic Notes Compiler
// ─────────────────────────────────────────────
const compileDynamicNotes = (data: any): string => {
  if (!data) return "";

  let text = "**Key Discussion Points:**\n\n---\n\n## DETAILED REPORTS\n\n";
  const reports = data.submitted_by || [];

  if (reports.length === 0) return text + "No detailed reports submitted yet.";

  reports.forEach((r: any) => {
    text += `### ${r.user?.name || r.name || "Unknown Member"}\n`;
    if (r.self_rating || r.score) text += `- **Self Rating:** ${r.self_rating || r.score}/10\n`;
    if (r.status) text += `- **Status:** ${r.status}\n`;
    text += `\n`;
    if (r.member_report) text += `**Report:**\n- ${r.member_report}\n\n`;
    if (r.issues) text += `**Issues:**\n- ${r.issues}\n\n`;
    if (r.escalation) text += `**Escalation:**\n- ${r.escalation}\n\n`;
    text += `---\n\n`;
  });

  return text.trim();
};

// ─────────────────────────────────────────────
// HistoryTab Component
// ─────────────────────────────────────────────
const HistoryTab = () => {
  const [selectedMeetingId, setSelectedMeetingId] = useState("");
  const [selectedDate, setSelectedDate] = useState(() => new Date().toISOString().split("T")[0]);
  const [refreshKey, setRefreshKey] = useState(0);

  const [historyData, setHistoryData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [meetings, setMeetings] = useState<any[]>([]);
  const [isFetchingMeetings, setIsFetchingMeetings] = useState(false);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [meetingNotesText, setMeetingNotesText] = useState("");
  const [isNotesExpanded, setIsNotesExpanded] = useState(true);

  // ── Meetings Dropdown Fetch ──────────────────
  useEffect(() => {
    setIsFetchingMeetings(true);
    fetch(`${getBaseUrl()}/daily_meeting_configs`, { headers: getAuthHeaders() })
      .then((res) => res.json())
      .then((data) => {
        const list = Array.isArray(data) ? data : data?.data || [];
        setMeetings(list);
        if (list.length > 0) setSelectedMeetingId(String(list[0].id));
      })
      .catch(console.error)
      .finally(() => setIsFetchingMeetings(false));
  }, []);

  // ── History API — fires on date / meeting / refresh change ──
  useEffect(() => {
    if (!selectedMeetingId) return;

    setIsLoading(true);
    setHistoryData(null);

    const url = `${getBaseUrl()}/user_journals/daily_history.json?meeting_id=${selectedMeetingId}&date=${selectedDate}`;
    console.log("Hitting History GET ->", url);

    fetch(url, { method: "GET", headers: getAuthHeaders() })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((json) => {
        setHistoryData(json?.data ?? json);
      })
      .catch((err) => {
        console.error("History fetch error:", err);
        setHistoryData(null);
      })
      .finally(() => setIsLoading(false));
  }, [selectedMeetingId, selectedDate, refreshKey]);

  // ── Date Navigation ──────────────────────────
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

  // ── Derived Values ───────────────────────────
  const formattedDateLabel = new Date(selectedDate).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "2-digit",
  });

  const formattedFullDate = new Date(selectedDate).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const selectedMeetingLabel =
    meetings.find((m) => String(m.id) === String(selectedMeetingId))?.name ?? "All Meetings";

  const missedMembers = historyData?.missed_members || [];
  const attendeesCount =
    historyData?.submitted_by?.length || historyData?.submitted || 0;
  const compiledRawNotes = compileDynamicNotes(historyData);

  // ── Edit Modal Handlers ──────────────────────
  const handleOpenEditModal = () => {
    const journal = historyData?.journal || historyData?.user_journal || historyData;
    setMeetingNotesText(journal?.meeting_notes ?? journal?.notes ?? compiledRawNotes);
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => setIsEditModalOpen(false);

  const handleSaveNotes = () => {
    console.log("Save Notes:", meetingNotesText);
    setIsEditModalOpen(false);
  };

  const handleDeleteNotes = () => {
    console.log("Delete Notes");
  };

  // ── Render ───────────────────────────────────
  return (
    <div
      className="pb-12 space-y-6  min-h-screen pt-8"
      style={{ fontFamily: "'Poppins', sans-serif" }}
    >
      {/* ── Page Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-[24px] font-black text-[#1A1A1A] tracking-tight">
            Daily Meeting History
          </h2>
          <p className="text-[12px] font-bold text-[#8C8580] uppercase tracking-widest mt-1">
            View and edit past daily meeting reports
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">

          {/* Meeting Dropdown */}
          <div className="relative">
            <select
              value={selectedMeetingId}
              onChange={(e) => setSelectedMeetingId(e.target.value)}
              disabled={isFetchingMeetings}
              className="appearance-none bg-[#FCFAFA] border border-[#F0EBE8] rounded-[16px] py-2.5 pl-4 pr-9 text-sm font-bold text-[#1A1A1A] focus:outline-none focus:border-[#D37E5F] shadow-sm disabled:opacity-60 transition-colors"
            >
              <option value="">All Meetings</option>
              {meetings.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name || m.label}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8C8580] pointer-events-none" />
          </div>

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

          {/* Refresh Button */}
          <button
            onClick={() => setRefreshKey((k) => k + 1)}
            className="flex items-center gap-2 px-4 py-2.5 bg-white border border-[#F0EBE8] rounded-[16px] hover:bg-[#FCFAFA] shadow-sm text-sm font-bold text-[#1A1A1A] transition-all"
          >
            <RefreshCw
              className={cn("w-4 h-4 text-[#8C8580]", isLoading && "animate-spin")}
            />
            Refresh
          </button>
        </div>
      </div>

      {/* ── Content Area ── */}
      {isLoading ? (
        <div className="flex justify-center py-20">
          <RefreshCw className="w-6 h-6 text-[#D37E5F] animate-spin" />
        </div>

      ) : !historyData ? (
        <div className="text-center py-24 bg-white border-2 border-dashed border-[#F0EBE8] rounded-[32px]">
          <HistoryIcon className="w-10 h-10 text-[#D37E5F] opacity-30 mx-auto mb-4" />
          <p className="text-[#8C8580] font-bold text-sm">
            No meeting history found for the selected date.
          </p>
        </div>

      ) : (
        <div className="bg-white border border-[#F0EBE8] rounded-[24px] shadow-sm overflow-hidden">

          {/* Card Header */}
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
                className="w-10 h-10 flex items-center justify-center bg-white/10 hover:bg-[#EB4A4A]/80 border border-white/20 text-white rounded-[12px] transition-all"
              >
                <Trash className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Notes Toggle Section */}
          <div>
            <div
              className="px-6 py-4 flex items-center justify-between cursor-pointer bg-[#FCFAFA] hover:bg-[#F5F0EE] border-b border-[#F0EBE8] transition-colors"
              onClick={() => setIsNotesExpanded(!isNotesExpanded)}
            >
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#8C8580]" />
                <span className="text-sm font-black text-[#1A1A1A]">Raw Meeting Notes</span>
              </div>
              {isNotesExpanded ? (
                <ChevronUp className="w-5 h-5 text-[#8C8580]" />
              ) : (
                <ChevronDown className="w-5 h-5 text-[#8C8580]" />
              )}
            </div>

            {isNotesExpanded && (
              <div className="p-6 space-y-6 bg-white">

                {/* Missed Members */}
                <div>
                  <div className="text-[10px] font-black text-[#8C8580] uppercase tracking-widest mb-3">
                    Team Members Who Missed Report ({missedMembers.length})
                  </div>
                  {missedMembers.length === 0 ? (
                    <p className="text-sm font-bold text-[#8C8580] italic">No missed reports.</p>
                  ) : (
                    <div className="flex flex-col gap-1.5">
                      {missedMembers.map((member: any) => (
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

                {/* Notes Box */}
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

      {/* ── Edit Modal ── */}
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

              {/* Modal Body */}
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
                  className="px-5 py-2.5 bg-white border border-[#F0EBE8] text-[#8C8580] rounded-[16px] text-sm font-bold hover:bg-gray-50 hover:text-[#1A1A1A] transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveNotes}
                  className="flex items-center justify-center gap-2 min-w-[140px] px-6 py-2.5 bg-[#D37E5F] hover:bg-[#c96e50] text-white rounded-[16px] text-sm font-bold transition-colors shadow-sm"
                >
                  Save Changes
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