import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import {
  Calendar, FileText, ChevronDown, ChevronUp, AlertTriangle,
  RefreshCw, X, Plus, MessageSquare, ChevronLeft, ChevronRight,
  Crown, Loader2, Users, Trophy, CheckCircle2, Circle, Star
} from "lucide-react";
import { cn } from "@/lib/utils";
import { getAuthHeaders, getBaseUrl } from "./Shared";

// ── UI Components ──
const BtnOutline = ({ children, onClick, className = "", icon: Icon }: any) => (
  <button onClick={onClick} className={cn("inline-flex items-center justify-center gap-2 px-6 py-2 rounded-xl text-sm font-semibold bg-white border border-[#9F2B39] text-[#9F2B39] shadow-sm hover:bg-[#fef6f4] active:scale-97 transition-all", className)}>
    {Icon && <Icon className="w-4 h-4" />} {children}
  </button>
);

const BtnIcon = ({ onClick, children, className = "", title = "", disabled = false }: any) => (
  <button disabled={disabled} onClick={onClick} title={title}
    className={cn("inline-flex items-center justify-center w-8 h-8 rounded-xl bg-white border border-[#9F2B39] text-neutral-500 shadow-sm transition-all",
      disabled ? "opacity-50 cursor-not-allowed" : "hover:bg-[#fef6f4] hover:text-[#DA7756] active:scale-95", className)}>
    {children}
  </button>
);

const BtnPrimary = ({ children, onClick, className = "", icon: Icon, disabled = false }: any) => (
  <button disabled={disabled} onClick={onClick}
    className={cn("inline-flex items-center justify-center gap-2 px-6 py-2 rounded-xl text-sm font-bold bg-[#9F2B39] text-white shadow-sm hover:bg-[#8D2532] active:scale-97 transition-all disabled:opacity-60 disabled:cursor-not-allowed", className)}>
    {Icon && <Icon className={cn("w-4 h-4", disabled && "animate-spin")} />} {children}
  </button>
);

// ── API Fetchers ──
const fetchDynamicMeetings = async () => {
  const res = await fetch(`${getBaseUrl()}/daily_meeting_configs`, { headers: getAuthHeaders() });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const json = await res.json();
  const list = Array.isArray(json) ? json : (json.data?.daily_meeting_configs || json.data || []);
  return list.map((m: any) => ({ id: String(m.id), name: m.name || `Meeting ${m.id}` }));
};

const fetchDynamicMembers = async () => {
  const orgId = localStorage.getItem("org_id") || "";
  const res = await fetch(`${getBaseUrl()}/api/users?organization_id=${orgId}`, { headers: getAuthHeaders() });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const json = await res.json();
  const list = Array.isArray(json) ? json : (json.data || json.users || []);
  return list.map((u: any) => ({
    id: String(u.id),
    name: u.full_name || [u.firstname, u.lastname].filter(Boolean).join(" ") || `User ${u.id}`
  }));
};

const fetchDailyMeetingData = async ({ meetingId, dateStr }: { meetingId: string; dateStr: string }) => {
  const url = new URL(`${getBaseUrl()}/user_journals/daily_meeting`);
  url.searchParams.append("date", dateStr);
  if (meetingId && meetingId !== "all") url.searchParams.append("meeting_id", meetingId);
  const res = await fetch(url.toString(), { method: "GET", headers: getAuthHeaders() });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return await res.json();
};

// ── Helpers ──
const formatDateTime = (isoStr: string | null) => {
  if (!isoStr) return null;
  return new Date(isoStr).toLocaleString("en-IN", {
    year: "numeric", month: "2-digit", day: "2-digit",
    hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false
  });
};

// ─────────────────────────────────────────────
const DailyTab = () => {
  const [activeDate, setActiveDate] = useState(() => new Date().toISOString().split("T")[0]);

  const [meetingsList, setMeetingsList] = useState<any[]>([]);
  const [selectedMeetingId, setSelectedMeetingId] = useState("all");

  const [membersList, setMembersList] = useState<any[]>([]);
  const [selectedMember, setSelectedMember] = useState("all");

  const [dailyData, setDailyData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const [expandedReports, setExpandedReports] = useState<any[]>([]);
  const [selectedReports, setSelectedReports] = useState<any[]>([]);
  const [meetingNotes, setMeetingNotes] = useState("");
  const [isSavingMeeting, setIsSavingMeeting] = useState(false);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [taskTitle, setTaskTitle] = useState("");

  // ── Load Dropdowns ──
  useEffect(() => {
    fetchDynamicMeetings().then(setMeetingsList).catch(console.error);
    fetchDynamicMembers().then(setMembersList).catch(console.error);
  }, []);

  // ── Load Daily Data ──
  const loadDailyData = async () => {
    setIsLoading(true);
    setApiError(null);
    try {
      const json = await fetchDailyMeetingData({ meetingId: selectedMeetingId, dateStr: activeDate });
      if (json.success) setDailyData(json.data);
      else throw new Error(json.message || "Failed to fetch");
    } catch (err: any) {
      setApiError(err.message);
      setDailyData(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { loadDailyData(); }, [selectedMeetingId, activeDate]);

  const changeDate = (days: number) => {
    const d = new Date(activeDate);
    d.setDate(d.getDate() + days);
    setActiveDate(d.toISOString().split("T")[0]);
  };

  const toggleExpand = (id: any) =>
    setExpandedReports((p) => p.includes(id) ? p.filter((r) => r !== id) : [...p, id]);

  const handleSaveMeeting = async () => {
    if (selectedMeetingId === "all") { alert("Please select a specific meeting."); return; }
    setIsSavingMeeting(true);
    try {
      const res = await fetch(`${getBaseUrl()}/user_journals/submit_daily_meeting`, {
        method: "POST", headers: getAuthHeaders(),
        body: JSON.stringify({
          meeting_config_id: parseInt(selectedMeetingId, 10),
          report_date: activeDate,
          meeting_notes: meetingNotes,
          status: "submitted",
        }),
      });
      if (!res.ok) throw new Error(`Failed: ${res.status}`);
      alert("Saved successfully!");
      setMeetingNotes("");
      loadDailyData();
    } catch (err: any) {
      alert("Error: " + err.message);
    } finally {
      setIsSavingMeeting(false);
    }
  };

  // ── Derived Data ──
  const dateRow = dailyData?.date_row || [];
  const config = dailyData?.config;
  const topDateStr = dailyData?.date || activeDate;
  const configName = config?.name || (selectedMeetingId === "all" ? "All Meetings" : "Meeting");

  let memberReports = dailyData?.member_reports || [];
  let failedMembers = dailyData?.missed_members || [];

  // Client-side member filter
  if (selectedMember !== "all") {
    memberReports = memberReports.filter((r: any) => String(r.user_id) === selectedMember);
    failedMembers = failedMembers.filter((m: any) => String(m.id) === selectedMember);
  }

  return (
    <div className="space-y-5 pb-12" style={{ fontFamily: "'Poppins', sans-serif" }}>

      {/* ══════════════════════════════════════
          CALENDAR CARD
      ══════════════════════════════════════ */}
      <div className="bg-[#FFF9F6] border border-[#F1E8E3] rounded-[32px] p-6 sm:p-8 shadow-sm">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3.5">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#FFF0E8] border border-[#F6E1D7]">
              <Calendar className="w-5 h-5 text-[#CE8261]" />
            </div>
            <div>
              <h2 className="text-[18px] font-extrabold text-[#1a1a1a]">Daily Report</h2>
              <p className="text-xs font-bold text-[#CE8261] mt-0.5">{topDateStr}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => changeDate(-1)} className="flex items-center justify-center w-9 h-9 rounded-full bg-white border border-[#EAE3DF] shadow-sm hover:bg-gray-50 transition-colors">
              <ChevronLeft className="w-5 h-5 text-neutral-600" />
            </button>
            <button onClick={() => changeDate(1)} className="flex items-center justify-center w-9 h-9 rounded-full bg-white border border-[#EAE3DF] shadow-sm hover:bg-gray-50 transition-colors">
              <ChevronRight className="w-5 h-5 text-neutral-600" />
            </button>
          </div>
        </div>

        {/* Date Cards */}
        {isLoading && !dailyData ? (
          <div className="flex items-center justify-center py-10">
            <RefreshCw className="w-8 h-8 text-[#CE8261] animate-spin" />
          </div>
        ) : (
          <div className="flex gap-[18px] overflow-x-auto py-4 px-3 mb-2 -mx-3" style={{ msOverflowStyle: "none", scrollbarWidth: "none" }}>
            {dateRow.map((dateItem: any) => {
              const isSelected = dateItem.full_date === activeDate;
              const uiStatus = dateItem.status === "non_meeting" ? "holiday" : dateItem.status;
              let bg = "#FFFFFF", textColor = "#6B7280", labelBg = "#F3F4F6", labelColor = "#9CA3AF", displayLabel = "Upcoming";

              if (uiStatus === "missed") { bg = "#F34A4A"; textColor = "#FFFFFF"; labelBg = "rgba(255,255,255,0.25)"; labelColor = "#FFFFFF"; displayLabel = "Miss"; }
              else if (uiStatus === "holiday") { bg = "#F5D142"; textColor = "#8A6D3B"; labelBg = "rgba(0,0,0,0.08)"; labelColor = "#8A6D3B"; displayLabel = "Holiday"; }
              else if (uiStatus === "done" || uiStatus === "submitted") { bg = "#2ECC71"; textColor = "#FFFFFF"; labelBg = "rgba(255,255,255,0.25)"; labelColor = "#FFFFFF"; displayLabel = "Done"; }

              const finalBg = isSelected ? "#D28363" : bg;
              const finalText = isSelected ? "#FFFFFF" : textColor;
              const finalLabelBg = isSelected ? "rgba(255,255,255,0.2)" : labelBg;
              const finalLabelColor = isSelected ? "#FFFFFF" : labelColor;

              return (
                <div
                  key={dateItem.full_date}
                  onClick={() => uiStatus !== "upcoming" && setActiveDate(dateItem.full_date)}
                  className={cn("relative flex-shrink-0 mt-1 ml-1 select-none transition-all",
                    uiStatus === "upcoming" ? "cursor-default opacity-80" : "cursor-pointer")}
                >
                  <div className="flex flex-col items-center justify-center rounded-[16px] transition-all duration-200"
                    style={{
                      width: 90, height: 110,
                      background: finalBg, color: finalText,
                      boxShadow: isSelected ? "0 0 0 5px #FFF9F6, 0 0 0 7px #D28363" : "0 4px 10px rgba(0,0,0,0.06)",
                      border: uiStatus === "upcoming" && !isSelected ? "1.5px solid #EAE3DF" : "none",
                    }}>
                    <span className="text-[11px] font-extrabold uppercase tracking-widest mb-1 opacity-90">{dateItem.day}</span>
                    <span className="text-[30px] font-bold leading-none">{dateItem.date}</span>
                    <div className="mt-2.5 h-[18px] px-3 rounded-full flex items-center justify-center text-[9px] font-extrabold uppercase tracking-widest"
                      style={{ background: finalLabelBg, color: finalLabelColor }}>
                      {displayLabel}
                    </div>
                  </div>
                  {dateItem.is_today && (
                    <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-[#D28363] rounded-full" />
                  )}
                  {isSelected && (
                    <div className="absolute top-0 right-0 w-[14px] h-[14px] bg-white rounded-full border-[3px] border-[#D28363]"
                      style={{ transform: "translate(35%, -35%)", zIndex: 10 }} />
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Timeline bar */}
        <div className="flex items-center px-1 mb-5 mt-3 opacity-60">
          <div className="w-0 h-0 border-t-[5px] border-b-[5px] border-r-[7px] border-y-transparent border-r-[#A39A96]" />
          <div className="flex-1 h-[5px] bg-[#A39A96] rounded-full mx-[2px]" />
          <div className="w-0 h-0 border-t-[5px] border-b-[5px] border-l-[7px] border-y-transparent border-l-[#A39A96]" />
        </div>

        {/* Legend */}
        <div className="flex gap-x-8 gap-y-3 text-[11px] font-extrabold flex-wrap justify-center text-[#9A938E] tracking-[0.1em] uppercase">
          <div className="flex items-center gap-2.5"><span className="w-[15px] h-[15px] rounded-full bg-[#2ECC71]" /> Filled</div>
          <div className="flex items-center gap-2.5"><span className="w-[15px] h-[15px] rounded-full bg-[#F34A4A]" /> Missed</div>
          <div className="flex items-center gap-2.5"><span className="w-[15px] h-[15px] rounded-full bg-[#F5D142]" /> Holiday</div>
          <div className="flex items-center gap-2.5"><span className="w-[15px] h-[15px] rounded-full bg-white border-[3px] border-[#EAE3DF]" /> Upcoming</div>
        </div>
      </div>

      {/* ══════════════════════════════════════
          FILTERS
      ══════════════════════════════════════ */}
      <div className="flex items-center gap-4 flex-wrap">

        {/* Meeting Dropdown */}
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">MEETING</span>
          <div className="relative flex items-center bg-[#FFFAF8] border border-[rgba(218,119,86,0.3)] rounded-2xl px-4 py-2 shadow-sm hover:bg-[#fef6f4] transition-colors">
            <select
              value={selectedMeetingId}
              onChange={(e) => setSelectedMeetingId(e.target.value)}
              className="appearance-none bg-transparent text-sm font-semibold text-neutral-800 focus:outline-none pr-6 cursor-pointer"
            >
              <option value="all">All Meetings</option>
              {meetingsList.map((m: any) => <option key={m.id} value={m.id}>{m.name}</option>)}
            </select>
            <ChevronDown className="absolute right-3 w-3.5 h-3.5 text-[#9F2B39]/70 pointer-events-none" />
          </div>
        </div>

        {/* Member Dropdown */}
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">MEMBER</span>
          <div className="relative flex items-center bg-[#FFFAF8] border border-[rgba(218,119,86,0.3)] rounded-2xl px-4 py-2 shadow-sm hover:bg-[#fef6f4] transition-colors">
            <select
              value={selectedMember}
              onChange={(e) => setSelectedMember(e.target.value)}
              className="appearance-none bg-transparent text-sm font-semibold text-neutral-800 focus:outline-none pr-6 cursor-pointer min-w-[140px]"
            >
              <option value="all">All Members</option>
              {membersList.map((m: any) => <option key={m.id} value={m.id}>{m.name}</option>)}
            </select>
            <ChevronDown className="absolute right-3 w-3.5 h-3.5 text-[#9F2B39]/70 pointer-events-none" />
          </div>
        </div>

        {/* Refresh */}
        <button onClick={loadDailyData} className="flex items-center gap-1.5 px-4 py-2 bg-white border border-[#EAE3DF] rounded-2xl text-xs font-bold text-neutral-600 shadow-sm hover:bg-gray-50 transition-colors">
          <RefreshCw className={cn("w-3.5 h-3.5", isLoading && "animate-spin text-[#CE8261]")} /> Refresh
        </button>
      </div>

      {/* Error */}
      {apiError && (
        <div className="bg-red-50 text-red-600 text-sm font-bold p-4 rounded-2xl border border-red-200 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 shrink-0" /> {apiError}
        </div>
      )}

      {/* Loading */}
      {isLoading && (
        <div className="flex justify-center py-16">
          <RefreshCw className="w-7 h-7 text-[#CE8261] animate-spin" />
        </div>
      )}

      {/* ══════════════════════════════════════
          REPORTS SECTION
      ══════════════════════════════════════ */}
      {!isLoading && dailyData && (
        <>
          <div className="border border-[rgba(218,119,86,0.18)] rounded-2xl shadow-sm overflow-hidden bg-[#FFFDFB]">

            {/* Section Header */}
            <div className="p-4 border-b border-[rgba(218,119,86,0.1)] flex justify-between items-start flex-wrap gap-3 bg-[#fef6f4]">
              <div>
                <h3 className="font-bold text-sm text-neutral-900 flex items-center gap-2">
                  <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-white border border-[rgba(218,119,86,0.22)]">
                    <FileText className="w-4 h-4 text-[#9F2B39]" />
                  </div>
                  Daily Reports ({configName})
                </h3>
                <p className="text-xs text-neutral-400 mt-0.5">{topDateStr}</p>
              </div>
              <div className="flex items-center gap-2 flex-wrap pt-3">
                <span className="px-3.5 py-1.5 rounded-2xl text-xs font-bold bg-[#9F2B39] text-white shadow-sm">Total: {dailyData.total_members || 0}</span>
                <span className="px-3.5 py-1.5 rounded-2xl text-xs font-bold bg-white text-[#9F2B39] border border-[#f6a67d]/70 shadow-sm">Submitted: {dailyData.submitted || 0}</span>
                <span className="px-3.5 py-1.5 rounded-2xl text-xs font-bold bg-white text-[#b91c1c] border border-[#b91c1c]/70 shadow-sm">Missed: {dailyData.missed || 0}</span>
              </div>
            </div>

            {memberReports.length === 0 && failedMembers.length === 0 && (
              <div className="p-10 text-center text-sm font-bold text-neutral-400 bg-white">
                No reports found for this selection.
              </div>
            )}

            {memberReports.length > 0 && (
              <div className="p-4 bg-[#FFFDFB]">

                {/* Meeting Notes */}
                <div className="bg-white border border-[rgba(218,119,86,0.18)] rounded-2xl overflow-hidden shadow-sm mb-6">
                  <div className="flex items-center justify-between p-3 border-b border-[rgba(218,119,86,0.1)] bg-[#FFFAF8]">
                    <div className="flex items-center gap-2 font-semibold text-neutral-800 text-sm">
                      <Users className="w-4 h-4 text-[#9F2B39]" /> Meeting Notes
                    </div>
                    <BtnIcon onClick={loadDailyData} title="Refresh"><RefreshCw className="w-3.5 h-3.5" /></BtnIcon>
                  </div>
                  <div className="p-4">
                    <textarea
                      value={meetingNotes} onChange={(e) => setMeetingNotes(e.target.value)}
                      className="w-full border border-[rgba(218,119,86,0.18)] rounded-2xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[rgba(218,119,86,0.22)] min-h-[80px] resize-y placeholder:text-neutral-400 text-neutral-700 bg-[#FFFAF8]"
                      placeholder="Enter meeting remarks, feedback, action items..."
                    />
                  </div>
                  <div className="flex items-center justify-end bg-[#FFFAF8] p-3 border-t border-[rgba(218,119,86,0.1)]">
                    <BtnPrimary icon={isSavingMeeting ? Loader2 : FileText} onClick={handleSaveMeeting} disabled={isSavingMeeting}>
                      {isSavingMeeting ? "Saving..." : "Save Meeting"}
                    </BtnPrimary>
                  </div>
                </div>

                {/* ── Report Cards ── */}
                <div className="space-y-4">
                  {memberReports.map((report: any) => {
                    const rId = report.journal_id || report.user_id;
                    const isExpanded = expandedReports.includes(rId);
                    const isPending = report.status === "pending";
                    const rd = report.report_data || {};
                    const kpis = report.kpis || rd.kpis || {};

                    return (
                      <div key={rId} className={cn("bg-white border rounded-2xl shadow-sm overflow-hidden", isPending ? "border-red-200" : "border-[#EAE3DF]")}>

                        {/* Card Header */}
                        <div className="p-4 cursor-pointer hover:bg-gray-50 transition-colors" onClick={() => !isPending && toggleExpand(rId)}>

                          {/* Row 1: checkbox + name + badges */}
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <input
                              type="checkbox"
                              checked={selectedReports.includes(rId)}
                              onChange={(e) => {
                                e.stopPropagation();
                                setSelectedReports(prev => e.target.checked ? [...prev, rId] : prev.filter(id => id !== rId));
                              }}
                              onClick={(e) => e.stopPropagation()}
                              className="w-4 h-4 rounded border-gray-300 accent-[#9F2B39] cursor-pointer"
                            />
                            <h3 className="font-bold text-[#1A1A1A] text-[15px]">{report.name}</h3>

                            {(report.name?.includes("HOD") || report.name?.includes("TL")) && (
                              <span className="flex items-center gap-1 border border-orange-200 bg-orange-50 text-orange-600 text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                                <Crown className="w-3 h-3 fill-orange-400" /> HOD
                              </span>
                            )}
                            {report.department && (
                              <span className="border border-blue-200 bg-blue-50 text-blue-600 text-[10px] font-bold px-2 py-0.5 rounded-full">
                                {report.department}
                              </span>
                            )}
                            {isPending ? (
                              <span className="ml-auto text-[10px] font-bold text-white bg-red-500 px-2 py-0.5 rounded-full">PENDING</span>
                            ) : (
                              <span className="ml-auto text-[10px] font-bold text-green-700 bg-green-100 border border-green-200 px-2 py-0.5 rounded-full flex items-center gap-1">
                                <CheckCircle2 className="w-3 h-3" /> Submitted
                              </span>
                            )}
                          </div>

                          {/* Row 2: email + time */}
                          <div className="text-[12px] text-gray-400 mb-3 ml-6">
                            {report.email}
                            {report.submitted_at && (
                              <span className="ml-2">• {formatDateTime(report.submitted_at)}</span>
                            )}
                          </div>

                          {/* Row 3: KPI Pills */}
                          {!isPending && (
                            <div className="flex flex-wrap items-center gap-2 mb-3 ml-6">
                              <span className="text-[11px] font-bold text-gray-700 bg-gray-100 border border-gray-200 px-2.5 py-1 rounded-lg">
                                {report.score ?? 0}/20
                              </span>
                              {kpis.tasks && (
                                <span className="text-[11px] font-bold text-orange-600 bg-orange-50 border border-orange-100 px-2.5 py-1 rounded-lg">
                                  Tasks: {kpis.tasks}
                                </span>
                              )}
                              {kpis.issues && (
                                <span className="text-[11px] font-bold text-blue-600 bg-blue-50 border border-blue-100 px-2.5 py-1 rounded-lg">
                                  Issues: {kpis.issues}
                                </span>
                              )}
                              {kpis.planning && (
                                <span className="text-[11px] font-bold text-red-600 bg-red-50 border border-red-100 px-2.5 py-1 rounded-lg">
                                  Planning: {kpis.planning}
                                </span>
                              )}
                              {kpis.timing && (
                                <span className="text-[11px] font-bold text-green-600 bg-green-50 border border-green-100 px-2.5 py-1 rounded-lg">
                                  Timing: {kpis.timing}
                                </span>
                              )}
                            </div>
                          )}

                          {/* Row 4: date_row history mini cards */}
                          {!isPending && dateRow.length > 0 && (
                            <div className="flex items-center gap-1.5 ml-6 flex-wrap">
                              {dateRow.map((d: any, i: number) => {
                                const s = d.status === "non_meeting" ? "holiday" : d.status;
                                return (
                                  <div key={i} className={cn(
                                    "flex flex-col items-center justify-center w-7 h-8 rounded-lg text-[10px] font-bold border",
                                    s === "done" || s === "submitted" ? "bg-[#2ECC71] text-white border-[#2ECC71]" :
                                    s === "missed" ? "bg-[#EB4A4A] text-white border-[#EB4A4A]" :
                                    s === "holiday" ? "bg-yellow-100 text-yellow-600 border-yellow-200" :
                                    "bg-gray-100 text-gray-400 border-gray-200"
                                  )}>
                                    <span className="text-[8px] opacity-80 leading-none mb-0.5">{d.day?.charAt(0)}</span>
                                    <span className="leading-none">{d.date}</span>
                                  </div>
                                );
                              })}
                            </div>
                          )}

                          {/* Expand hint */}
                          {!isPending && (
                            <div className="flex justify-center mt-3">
                              <span className="text-[10px] font-bold text-[#CE8261] opacity-50">
                                {isExpanded ? "▲ collapse" : "▼ view details"}
                              </span>
                            </div>
                          )}
                        </div>

                        {/* ── Expanded Details ── */}
                        {isExpanded && !isPending && (
                          <div className="bg-[#FFFAF8] border-t border-[#EAE3DF]">
                            <div className="p-5 space-y-5">

                              {/* Self Rating + Score + Absent row */}
                              <div className="flex flex-wrap gap-3">
                                {rd.self_rating && (
                                  <div className="flex items-center gap-2 bg-yellow-50 border border-yellow-100 rounded-xl px-4 py-2.5">
                                    <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                                    <span className="text-sm font-bold text-yellow-800">Self Rating: {rd.self_rating}/10</span>
                                  </div>
                                )}
                                {rd.total_score !== undefined && (
                                  <div className="flex items-center gap-2 bg-purple-50 border border-purple-100 rounded-xl px-4 py-2.5">
                                    <span className="text-sm font-bold text-purple-800">Total Score: {rd.total_score}</span>
                                  </div>
                                )}
                                {rd.is_absent !== undefined && (
                                  <div className={cn("flex items-center gap-2 rounded-xl px-4 py-2.5 border",
                                    rd.is_absent ? "bg-red-50 border-red-100" : "bg-green-50 border-green-100")}>
                                    <span className={cn("text-sm font-bold", rd.is_absent ? "text-red-700" : "text-green-700")}>
                                      {rd.is_absent ? "Absent" : "Present"}
                                    </span>
                                  </div>
                                )}
                              </div>

                              {/* Big Win */}
                              {rd.big_win && (
                                <div className="bg-amber-50 border border-amber-100 rounded-xl px-4 py-3 flex items-start gap-3">
                                  <Trophy className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                                  <div>
                                    <div className="text-[10px] font-extrabold text-amber-600 uppercase tracking-widest mb-1">Big Win 🏆</div>
                                    <p className="text-sm font-semibold text-amber-900">{rd.big_win}</p>
                                  </div>
                                </div>
                              )}

                              {/* 3-Col Grid */}
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                                {/* Accomplishments */}
                                <div className="bg-white border border-[#F0E8E3] rounded-xl p-4">
                                  <div className="flex items-center gap-2 mb-3 pb-2 border-b border-gray-100">
                                    <div className="w-6 h-6 rounded-lg bg-green-100 flex items-center justify-center shrink-0">
                                      <CheckCircle2 className="w-3.5 h-3.5 text-green-600" />
                                    </div>
                                    <h4 className="text-xs font-extrabold text-neutral-700 uppercase tracking-wider">Accomplishments</h4>
                                  </div>
                                  {(rd.accomplishments || []).length === 0 ? (
                                    <p className="text-xs text-neutral-300 italic">None recorded.</p>
                                  ) : (
                                    <ul className="space-y-2">
                                      {(rd.accomplishments || []).map((item: any, i: number) => (
                                        <li key={i} className="flex items-start gap-2 text-xs text-neutral-700">
                                          <div className="w-1.5 h-1.5 rounded-full bg-green-400 mt-1.5 shrink-0" />
                                          <span className="leading-relaxed">{item.title || item}</span>
                                        </li>
                                      ))}
                                    </ul>
                                  )}
                                </div>

                                {/* Tasks & Issues */}
                                <div className="bg-white border border-[#F0E8E3] rounded-xl p-4">
                                  <div className="flex items-center gap-2 mb-3 pb-2 border-b border-gray-100">
                                    <div className="w-6 h-6 rounded-lg bg-orange-100 flex items-center justify-center shrink-0">
                                      <AlertTriangle className="w-3.5 h-3.5 text-orange-600" />
                                    </div>
                                    <h4 className="text-xs font-extrabold text-neutral-700 uppercase tracking-wider">Tasks & Issues</h4>
                                  </div>
                                  {(rd.tasks_issues || []).length === 0 ? (
                                    <p className="text-xs text-neutral-300 italic">None recorded.</p>
                                  ) : (
                                    <ul className="space-y-2.5">
                                      {(rd.tasks_issues || []).map((item: any, i: number) => (
                                        <li key={i} className="flex items-start gap-2 text-xs text-neutral-700">
                                          <span className={cn(
                                            "shrink-0 text-[9px] font-bold px-1.5 py-0.5 rounded-full mt-0.5",
                                            item.status === "open" ? "bg-red-100 text-red-600" :
                                            item.status === "closed" ? "bg-green-100 text-green-600" :
                                            "bg-gray-100 text-gray-500"
                                          )}>
                                            {item.status || "open"}
                                          </span>
                                          <span className="leading-relaxed">{item.title || item}</span>
                                        </li>
                                      ))}
                                    </ul>
                                  )}
                                </div>

                                {/* Tomorrow's Plan */}
                                <div className="bg-white border border-[#F0E8E3] rounded-xl p-4">
                                  <div className="flex items-center gap-2 mb-3 pb-2 border-b border-gray-100">
                                    <div className="w-6 h-6 rounded-lg bg-blue-100 flex items-center justify-center shrink-0">
                                      <Calendar className="w-3.5 h-3.5 text-blue-600" />
                                    </div>
                                    <h4 className="text-xs font-extrabold text-neutral-700 uppercase tracking-wider">Tomorrow's Plan</h4>
                                  </div>
                                  {(rd.tomorrow_plan || []).length === 0 ? (
                                    <p className="text-xs text-neutral-300 italic">None recorded.</p>
                                  ) : (
                                    <ul className="space-y-2">
                                      {(rd.tomorrow_plan || []).map((item: any, i: number) => (
                                        <li key={i} className="flex items-start gap-2 text-xs text-neutral-700">
                                          <Circle className="w-3 h-3 text-blue-300 mt-0.5 shrink-0" />
                                          <span className="leading-relaxed">{item.title || item}</span>
                                        </li>
                                      ))}
                                    </ul>
                                  )}
                                </div>
                              </div>

                              {/* Action Buttons */}
                              <div className="flex flex-wrap gap-2 pt-1">
                                <button className="flex items-center gap-1.5 px-4 py-1.5 text-red-600 bg-white border border-red-200 rounded-full text-xs font-bold shadow-sm hover:bg-red-50 transition-colors">
                                  <Plus className="w-3.5 h-3.5" /> Stuck Issue
                                </button>
                                <button className="flex items-center gap-1.5 px-4 py-1.5 text-orange-600 bg-white border border-orange-200 rounded-full text-xs font-bold shadow-sm hover:bg-orange-50 transition-colors">
                                  <Plus className="w-3.5 h-3.5" /> Add to Plan
                                </button>
                                <button className="flex items-center gap-1.5 px-4 py-1.5 text-white bg-purple-600 border border-purple-700 rounded-full text-xs font-bold shadow-sm hover:bg-purple-700 transition-colors">
                                  <MessageSquare className="w-3.5 h-3.5" /> Feedback
                                </button>
                              </div>

                              {/* Collapse */}
                              <div className="flex justify-center">
                                <button onClick={() => toggleExpand(rId)}
                                  className="flex items-center gap-1 text-gray-400 text-xs font-bold hover:bg-gray-100 px-4 py-1.5 rounded-full transition-colors">
                                  <ChevronUp className="w-4 h-4" /> Collapse <ChevronUp className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Missed Members */}
          {failedMembers.length > 0 && (
            <div className="bg-[#fff1f2] border border-red-200 rounded-2xl p-5 shadow-sm">
              <div className="flex items-center gap-2 text-red-600 font-bold text-sm mb-4">
                <AlertTriangle className="w-4 h-4" /> Team Members Who Failed to Submit ({failedMembers.length}):
              </div>
              <div className="flex flex-wrap gap-2.5">
                {failedMembers.map((member: any, i: number) => (
                  <div key={i} className="flex items-center gap-2 bg-white border border-red-100 px-3 py-1.5 rounded-full shadow-sm">
                    <div className="w-2 h-2 rounded-full bg-red-500" />
                    <span className="text-[12px] font-bold text-gray-700">{member.name || member}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {/* Task Modal */}
      {isTaskModalOpen && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border border-[rgba(218,119,86,0.18)]">
            <div className="flex justify-between items-center p-4 border-b border-neutral-100 bg-[#FFFAF8]">
              <h5 className="font-bold text-sm text-neutral-900 flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#9F2B39]" /> Add Task
              </h5>
              <BtnIcon onClick={() => setIsTaskModalOpen(false)}><X className="w-3.5 h-3.5" /></BtnIcon>
            </div>
            <div className="p-5">
              <label className="text-xs font-bold text-neutral-700 mb-1.5 block">Task Title <span className="text-red-500">*</span></label>
              <input
                type="text" value={taskTitle} onChange={(e) => setTaskTitle(e.target.value)}
                placeholder="What needs to be done?"
                className="w-full border border-[rgba(218,119,86,0.22)] rounded-xl p-2.5 text-sm bg-[#FFFAF8] focus:outline-none focus:ring-2 focus:ring-[rgba(218,119,86,0.25)] placeholder:text-neutral-400"
                autoFocus
              />
            </div>
            <div className="p-4 border-t border-neutral-100 bg-[#FFFAF8] flex justify-end gap-2">
              <BtnOutline onClick={() => { setIsTaskModalOpen(false); setTaskTitle(""); }}>Cancel</BtnOutline>
              <BtnPrimary icon={Plus}>Create Task</BtnPrimary>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};

export default DailyTab;