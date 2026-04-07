// ─────────────────────────────────────────────
// DailyTab.jsx — Unified Modern Theme with Full Dynamic API
// ─────────────────────────────────────────────
import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import {
  Calendar, FileText, ChevronDown, ChevronUp, AlertTriangle,
  CheckCircle2, Circle, ArrowRight, Users, CalendarIcon,
  RefreshCw, X, Plus, MessageSquare, ChevronLeft, ChevronRight,
  Crown
} from "lucide-react";
import { cn } from "@/lib/utils";
import { getAuthHeaders } from "./Shared"; // Replace with your actual auth header helper

// ── Shared UI Components ──
const BtnOutline = ({ children, onClick, className = "", icon: Icon, iconClass = "" }) => (
  <button onClick={onClick} className={cn("inline-flex items-center justify-center gap-2 px-6 py-2 rounded-xl text-sm font-semibold bg-white border border-[#9F2B39] text-[#9F2B39] shadow-sm hover:bg-[#fef6f4] active:scale-[0.97] transition-all duration-150", className)}>
    {Icon && <Icon className={cn("w-4 h-4", iconClass)} />} {children}
  </button>
);

const BtnIcon = ({ onClick, children, className = "", title = "", disabled = false }) => (
  <button disabled={disabled} onClick={onClick} title={title} className={cn("inline-flex items-center justify-center w-8 h-8 rounded-xl bg-white border border-[#9F2B39] text-neutral-500 shadow-sm transition-all duration-150", disabled ? "opacity-50 cursor-not-allowed" : "hover:bg-[#fef6f4] hover:text-[#DA7756] active:scale-[0.95]", className)}>
    {children}
  </button>
);

const BtnDustyPink = ({ children, onClick, className = "", icon: Icon }) => (
  <button onClick={onClick} className={cn("inline-flex items-center justify-center gap-2 px-6 py-2 rounded-xl text-sm font-semibold bg-[#9F2B39] text-white shadow-sm hover:bg-[#8D2532] active:scale-[0.97] transition-all duration-150", className)}>
    {Icon && <Icon className="w-4 h-4" />} {children}
  </button>
);

// ── API Fetchers ──
const fetchDynamicMeetings = async () => {
  const res = await fetch(`https://fm-uat-api.lockated.com/daily_meeting_configs`, {
    method: "GET",
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error(`HTTP Error: ${res.status}`);
  const json = await res.json();
  const list = Array.isArray(json) ? json : (json.data?.daily_meeting_configs || json.data || []);
  return list.map((m) => ({ id: String(m.id), name: m.name || m.title || `Meeting ${m.id}` }));
};

// Updated Fetcher for Members Dropdown based on the provided JSON
const fetchDynamicMembers = async () => {
  const url = "https://fm-uat-api.lockated.com/api/users?organization_id=88&token=eyJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjo4Nzk4OX0.pHlLUDAbJSUJbV-wTIdDyuXScLS7MKbPY9P3BZ8TmzI";
  const res = await fetch(url, { 
    method: "GET",
    headers: getAuthHeaders() 
  });
  if (!res.ok) throw new Error(`HTTP Error: ${res.status}`);
  const json = await res.json();
  
  // Parse user array
  let list = [];
  if (Array.isArray(json)) list = json;
  else if (Array.isArray(json.data)) list = json.data;
  else if (Array.isArray(json.users)) list = json.users;
  
  // Extract full_name or combine firstname and lastname
  return list.map((u) => ({ 
    id: String(u.id), 
    name: u.full_name || [u.firstname, u.lastname].filter(Boolean).join(" ") || `User ${u.id}` 
  }));
};

const fetchDailyMeetingData = async ({ meetingId, dateStr }) => {
  const url = new URL("https://fm-uat-api.lockated.com/user_journals/daily_meeting");
  url.searchParams.append("date", dateStr);
  if (meetingId && meetingId !== "all") {
    url.searchParams.append("meeting_id", meetingId);
  }

  const res = await fetch(url.toString(), { method: "GET", headers: getAuthHeaders() });
  if (!res.ok) throw new Error(`HTTP Error: ${res.status}`);
  return await res.json();
};

// ─────────────────────────────────────────────
const DailyTab = () => {
  // States
  const [activeDate, setActiveDate] = useState(() => new Date().toISOString().split("T")[0]);
  
  const [meetingsList, setMeetingsList] = useState([]);
  const [selectedMeetingId, setSelectedMeetingId] = useState("all");
  
  const [membersList, setMembersList] = useState([]);
  const [selectedMember, setSelectedMember] = useState("All Members");
  
  // API Data States
  const [dailyData, setDailyData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState(null);

  // UI interaction states
  const [expandedReports, setExpandedReports] = useState([]);
  const [selectedReports, setSelectedReports] = useState([]);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [taskModalReportId, setTaskModalReportId] = useState(null);
  const [taskTitle, setTaskTitle] = useState("");
  const [meetingNotes, setMeetingNotes] = useState("");

  // 1. Fetch Both Meetings and Members Dropdowns
  useEffect(() => {
    const loadDropdowns = async () => {
      try {
        const [meetings, members] = await Promise.all([
          fetchDynamicMeetings(),
          fetchDynamicMembers()
        ]);
        setMeetingsList(meetings);
        setMembersList(members);
      } catch (err) {
        console.error("Failed to fetch dropdown configs", err);
      }
    };
    loadDropdowns();
  }, []);

  // 2. Fetch Daily Meeting Data
  const loadDailyData = async () => {
    setIsLoading(true);
    setApiError(null);
    try {
      const json = await fetchDailyMeetingData({ meetingId: selectedMeetingId, dateStr: activeDate });
      if (json.success) {
        setDailyData(json.data);
      } else {
        throw new Error(json.message || "Failed to fetch data");
      }
    } catch (err) {
      setApiError(err.message);
      setDailyData(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadDailyData();
  }, [selectedMeetingId, activeDate]);

  const changeDate = (days) => {
    const d = new Date(activeDate);
    d.setDate(d.getDate() + days);
    setActiveDate(d.toISOString().split("T")[0]);
  };

  const toggleExpand = (id) => setExpandedReports((p) => p.includes(id) ? p.filter((r) => r !== id) : [...p, id]);
  
  // Derived Data for UI
  const dateRow = dailyData?.date_row || [];
  let memberReports = dailyData?.member_reports || [];
  let failedMembers = dailyData?.missed_members || [];
  const topDateStr = dailyData?.date || activeDate;
  const configName = dailyData?.config?.name || (selectedMeetingId === "all" ? "All Meetings" : "Meeting");

  // Client-side filtering if a specific member is selected
  if (selectedMember !== "All Members") {
    memberReports = memberReports.filter(r => String(r.user_id) === selectedMember || String(r.id) === selectedMember);
    failedMembers = failedMembers.filter(m => String(m.id) === selectedMember);
  }

  // Dummy History Generator to match Video UI look
  const getDummyHistory = () => [
    { day: "T", date: "31", status: "done" },
    { day: "W", date: "1", status: "missed" },
    { day: "T", date: "2", status: "missed" },
    { day: "F", date: "3", status: "holiday" },
    { day: "S", date: "4", status: "holiday" },
    { day: "S", date: "5", status: "upcoming" },
    { day: "M", date: "6", status: "missed" },
  ];

  return (
    <div className="space-y-6 pb-12" style={{ fontFamily: "'Poppins', sans-serif" }}>

      {/* ── EXACT SCREENSHOT CALENDAR ── */}
      <div className="bg-[#FFF9F6] border border-[#F1E8E3] rounded-[32px] p-6 sm:p-8 shadow-[0_2px_12px_rgba(0,0,0,0.02)]">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3.5">
            <div className="flex h-[42px] w-[42px] items-center justify-center rounded-xl bg-[#FFF0E8] border border-[#F6E1D7]">
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

        {/* Dynamic Date Cards */}
        {isLoading && !dailyData ? (
          <div className="flex items-center justify-center py-10">
            <RefreshCw className="w-8 h-8 text-[#CE8261] animate-spin" />
          </div>
        ) : (
          <div className="flex gap-[18px] overflow-x-auto py-4 px-3 mb-2 -mx-3" style={{ msOverflowStyle: "none", scrollbarWidth: "none" }}>
            {dateRow.map((dateItem) => {
              const isSelected = dateItem.full_date === activeDate;
              let bg, textColor, labelBg, labelColor, displayLabel;

              const uiStatus = dateItem.status === "non_meeting" ? "holiday" : dateItem.status;

              if (isSelected) {
                bg = "#D28363"; textColor = "#FFFFFF"; labelBg = "rgba(255,255,255,0.2)"; labelColor = "#FFFFFF"; displayLabel = uiStatus;
              } else if (uiStatus === "missed") {
                bg = "#F34A4A"; textColor = "#FFFFFF"; labelBg = "rgba(255,255,255,0.25)"; labelColor = "#FFFFFF"; displayLabel = "Miss";
              } else if (uiStatus === "holiday") {
                bg = "#F5D142"; textColor = "#8A6D3B"; labelBg = "rgba(0,0,0,0.08)"; labelColor = "#8A6D3B"; displayLabel = "Holiday";
              } else if (uiStatus === "done" || uiStatus === "submitted") {
                bg = "#2ECC71"; textColor = "#FFFFFF"; labelBg = "rgba(255,255,255,0.25)"; labelColor = "#FFFFFF"; displayLabel = "Done";
              } else {
                bg = "#FFFFFF"; textColor = "#6B7280"; labelBg = "#F3F4F6"; labelColor = "#9CA3AF"; displayLabel = "Upcoming";
              }

              return (
                <div
                  key={dateItem.full_date}
                  onClick={() => { if (uiStatus !== "upcoming") setActiveDate(dateItem.full_date); }}
                  className={cn("relative flex-shrink-0 mt-1 ml-1 select-none transition-all", uiStatus === "upcoming" ? "cursor-default opacity-90" : "cursor-pointer")}
                >
                  <div
                    className="flex flex-col items-center justify-center rounded-[16px] transition-all duration-200"
                    style={{
                      width: 90, height: 110, background: bg, color: textColor,
                      boxShadow: isSelected ? "0 0 0 5px #FFF9F6, 0 0 0 7px #D28363" : "0 4px 10px rgba(0,0,0,0.06)",
                      border: uiStatus === "upcoming" && !isSelected ? "1.5px solid #EAE3DF" : "none",
                    }}
                  >
                    <span className="text-[11px] font-extrabold uppercase tracking-widest mb-1 opacity-90" style={{ color: textColor }}>{dateItem.day}</span>
                    <span className="text-[30px] font-bold leading-none" style={{ color: textColor }}>{dateItem.date}</span>
                    <div className="mt-2.5 h-[18px] px-3 rounded-full flex items-center justify-center text-[9px] font-extrabold uppercase tracking-widest" style={{ background: labelBg, color: labelColor }}>
                      {displayLabel}
                    </div>
                  </div>
                  {isSelected && (
                    <div className="absolute top-0 right-0 w-[14px] h-[14px] bg-white rounded-full border-[3px] border-[#D28363]" style={{ transform: "translate(35%, -35%)", zIndex: 10 }} />
                  )}
                </div>
              );
            })}
          </div>
        )}

        <div className="flex items-center px-1 mb-6 mt-3 opacity-60">
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

      {/* ── Meeting / Member filters ── */}
      <div className="flex items-center gap-4 flex-wrap">
        {/* Meeting Dropdown */}
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">MEETING</span>
          <div className="relative flex items-center bg-[#FFFAF8] border border-[rgba(218,119,86,0.3)] rounded-2xl px-4 py-2 shadow-sm cursor-pointer hover:bg-[#fef6f4] transition-colors">
            <select
              value={selectedMeetingId}
              onChange={(e) => setSelectedMeetingId(e.target.value)}
              className="appearance-none bg-transparent w-full text-sm font-semibold text-neutral-800 focus:outline-none pr-6 cursor-pointer"
            >
              <option value="all">All Meetings</option>
              {meetingsList.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
            </select>
            <ChevronDown className="absolute right-3 w-3.5 h-3.5 text-[#9F2B39]/70 pointer-events-none" />
          </div>
        </div>

        {/* Member Dropdown */}
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">MEMBER</span>
          <div className="relative flex items-center bg-[#FFFAF8] border border-[rgba(218,119,86,0.3)] rounded-2xl px-4 py-2 shadow-sm cursor-pointer hover:bg-[#fef6f4] transition-colors">
            <select
              value={selectedMember}
              onChange={(e) => setSelectedMember(e.target.value)}
              className="appearance-none bg-transparent w-full text-sm font-semibold text-neutral-800 focus:outline-none pr-6 cursor-pointer min-w-[140px]"
            >
              <option value="All Members">All Members</option>
              {membersList.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
            </select>
            <ChevronDown className="absolute right-3 w-3.5 h-3.5 text-[#9F2B39]/70 pointer-events-none" />
          </div>
        </div>
      </div>

      {apiError && (
        <div className="bg-red-50 text-red-600 text-sm font-bold p-4 rounded-2xl border border-red-200">
          API Error: {apiError}
        </div>
      )}

      {!isLoading && dailyData && (
        <>
          {/* Reports Section */}
          <div className="border border-[rgba(218,119,86,0.18)] rounded-2xl shadow-sm overflow-hidden bg-[#FFFDFB]">
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
              <div className="flex items-center gap-2 text-xs font-semibold flex-wrap pt-3">
                <span className="px-3.5 py-1.5 rounded-2xl text-xs font-bold bg-[#9F2B39] text-white shadow-sm">Total: {dailyData.total_members || 0}</span>
                <span className="px-3.5 py-1.5 rounded-2xl text-xs font-bold bg-white text-[#9F2B39] border border-[#f6a67d]/70 shadow-sm">Submitted: {dailyData.submitted || 0}</span>
                <span className="px-3.5 py-1.5 rounded-2xl text-xs font-bold bg-white text-[#b91c1c] border border-[#b91c1c]/70 shadow-sm">Missed: {dailyData.missed || 0}</span>
              </div>
            </div>

            {memberReports.length === 0 && failedMembers.length === 0 && (
               <div className="p-10 text-center text-sm font-bold text-neutral-400 bg-white">
                 No reports or pending members found for this selection.
               </div>
            )}

            {memberReports.length > 0 && (
              <div className="p-4 bg-[#FFFDFB]">
                {/* Meeting Notes Input */}
                <div className="bg-white border border-[rgba(218,119,86,0.18)] rounded-2xl overflow-hidden shadow-sm mb-6">
                  <div className="flex items-center justify-between p-3 border-b border-[rgba(218,119,86,0.1)] bg-[#FFFAF8]">
                    <div className="flex items-center gap-2 font-semibold text-neutral-800 text-sm">
                      <Users className="w-4 h-4 text-[#9F2B39]" /> Meeting Notes
                    </div>
                    <div className="flex gap-2 pt-1">
                      <BtnIcon onClick={loadDailyData} title="Refresh"><RefreshCw className="w-3.5 h-3.5" /></BtnIcon>
                    </div>
                  </div>
                  <div className="p-4">
                    <textarea
                      value={meetingNotes}
                      onChange={(e) => setMeetingNotes(e.target.value)}
                      className="w-full border border-[rgba(218,119,86,0.18)] rounded-2xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[rgba(218,119,86,0.22)] min-h-[80px] resize-y placeholder:text-neutral-400 text-neutral-700 bg-[#FFFAF8]"
                      placeholder="Enter meeting remarks, feedback, action items..."
                    />
                  </div>
                  <div className="flex items-center justify-end bg-[#FFFAF8] p-3 border-t border-[rgba(218,119,86,0.1)]">
                    <BtnDustyPink icon={FileText}>Save Meeting</BtnDustyPink>
                  </div>
                </div>

                {/* Report Cards Loop */}
                <div className="space-y-4">
                  {memberReports.map((report) => {
                    const rId = report.journal_id || report.user_id;
                    const isExpanded = expandedReports.includes(rId);
                    const reportData = report.report_data || {};
                    const score = report.score || "0";
                    const isPending = report.status === "pending";
                    const history = getDummyHistory();

                    return (
                      <div key={rId} className={cn("bg-white border rounded-xl shadow-sm overflow-hidden", isPending ? "border-red-200" : "border-[#EAE3DF]")}>
                        
                        {/* Card Header */}
                        <div className="p-4 cursor-pointer hover:bg-gray-50 transition-colors" onClick={() => !isPending && toggleExpand(rId)}>
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <h3 className="font-bold text-[#1A1A1A] text-[15px]">{report.name}</h3>
                            
                            {(report.name.includes("HOD") || report.name.includes("TL")) && (
                              <span className="flex items-center gap-1 border border-orange-200 bg-orange-50 text-orange-600 text-[10px] font-bold px-1.5 py-0.5 rounded">
                                <Crown className="w-3 h-3 text-orange-500 fill-orange-500" /> HOD
                              </span>
                            )}
                            
                            {report.department && (
                              <span className="border border-blue-200 bg-blue-50 text-blue-600 text-[10px] font-bold px-1.5 py-0.5 rounded">
                                {report.department}
                              </span>
                            )}

                            {isPending && (
                              <span className="text-[10px] font-bold text-white bg-red-500 px-2 py-0.5 rounded ml-auto">PENDING</span>
                            )}
                          </div>

                          <div className="text-[12px] text-gray-400 mb-3">
                            {report.email} {report.submitted_at ? `• ${report.submitted_at}` : "• Not Submitted"}
                          </div>

                          {!isPending && (
                            <div className="flex flex-wrap items-center gap-2 mb-3">
                              <span className="text-[11px] font-bold text-gray-600 bg-gray-100 border border-gray-200 px-2 py-1 rounded">
                                {score}/20
                              </span>
                              <span className="text-[11px] font-bold text-orange-600 bg-orange-50 border border-orange-100 px-2 py-1 rounded">
                                Tasks: {reportData.tasks?.length || 0}/25
                              </span>
                              <span className="text-[11px] font-bold text-blue-600 bg-blue-50 border border-blue-100 px-2 py-1 rounded">
                                Issues: {reportData.issues?.length || 0}/25
                              </span>
                              <span className="text-[11px] font-bold text-red-600 bg-red-50 border border-red-100 px-2 py-1 rounded">
                                Planning: {reportData.plans?.length || 0}/25
                              </span>
                              <span className="text-[11px] font-bold text-green-600 bg-green-50 border border-green-100 px-2 py-1 rounded">
                                Timing: 0/25
                              </span>
                            </div>
                          )}

                          {!isPending && (
                            <div className="flex items-center gap-1.5">
                              {history.map((h, i) => (
                                <div key={i} className={cn(
                                  "flex flex-col items-center justify-center w-7 h-8 rounded text-[10px] font-bold border",
                                  h.status === 'done' ? "bg-[#2ECC71] text-white border-[#2ECC71]" :
                                  h.status === 'missed' ? "bg-[#EB4A4A] text-white border-[#EB4A4A]" :
                                  h.status === 'holiday' ? "bg-blue-100 text-blue-500 border-blue-200" :
                                  "bg-gray-100 text-gray-400 border-gray-200"
                                )}>
                                  <span className="text-[8px] opacity-90 leading-none mb-0.5">{h.day}</span>
                                  <span className="leading-none">{h.date}</span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* Expanded Area */}
                        {isExpanded && !isPending && (
                          <div className="bg-[#FFFAF8] border-t border-[#EAE3DF]">
                            <div className="p-4">
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {[
                                  { title: "Tasks & Issues", items: reportData.tasks || [] },
                                  { title: "Accomplishments", items: reportData.accomplishments || [] },
                                  { title: "Tomorrow's Plan", items: reportData.plans || [] },
                                ].map(({ title, items }, idx) => (
                                  <div key={idx}>
                                    <h4 className="font-bold mb-2 text-sm text-gray-800 border-b border-gray-200 pb-1">
                                      {title}
                                    </h4>
                                    <ul className="space-y-2 mt-2">
                                      {items.length === 0 ? <div className="text-xs text-neutral-400 italic">None recorded.</div> : items.map((item, i) => {
                                        const t = typeof item === 'string' ? item : (item.text || item.description);
                                        return (
                                          <li key={i} className="flex items-start gap-2 text-xs text-neutral-700 font-medium">
                                            <div className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 bg-gray-400" />
                                            <span className="flex-1 leading-relaxed">{t}</span>
                                          </li>
                                        )
                                      })}
                                    </ul>
                                  </div>
                                ))}
                              </div>

                              <div className="flex items-center flex-wrap gap-3 mt-6">
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

                              <div className="flex justify-center mt-6">
                                <button onClick={() => toggleExpand(rId)} className="flex items-center gap-1 text-gray-500 text-xs font-bold hover:bg-gray-200 px-4 py-1.5 rounded-full transition-colors">
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

          {/* Failed Members Section */}
          {failedMembers.length > 0 && (
            <div className="bg-[#fff1f2] border border-red-200 rounded-2xl p-5 shadow-sm mt-6">
              <div className="flex items-center gap-2 text-red-600 font-bold text-sm mb-4">
                <AlertTriangle className="w-4 h-4" /> Team Members Who Have Failed to Submit Report ({failedMembers.length}):
              </div>
              <div className="flex flex-wrap gap-2.5">
                {failedMembers.map((member, i) => (
                  <div key={i} className="flex items-center gap-2 bg-white border border-red-100 px-3 py-1.5 rounded-full shadow-sm">
                    <div className="w-2 h-2 rounded-full bg-red-500" />
                    <span className="text-[12px] font-bold text-gray-700">
                      {member.name || member}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {/* Task Modal (UNCHANGED) */}
      {isTaskModalOpen && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border border-[rgba(218,119,86,0.18)]">
            <div className="flex justify-between items-center p-4 border-b border-neutral-100 bg-[#FFFAF8]">
              <h5 className="font-bold text-sm text-neutral-900 flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#9F2B39]" /> Add Task for {memberReports.find((r) => r.id === taskModalReportId)?.user}
              </h5>
              <BtnIcon onClick={() => setIsTaskModalOpen(false)}><X className="w-3.5 h-3.5" /></BtnIcon>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="text-xs font-bold text-neutral-700 mb-1.5 block">Task Title <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  value={taskTitle}
                  onChange={(e) => setTaskTitle(e.target.value)}
                  placeholder="What needs to be done?"
                  className="w-full border border-[rgba(218,119,86,0.22)] rounded-xl p-2.5 text-sm bg-[#FFFAF8] focus:outline-none focus:ring-2 focus:ring-[rgba(218,119,86,0.25)] placeholder:text-neutral-400 text-neutral-700"
                  autoFocus
                />
              </div>
            </div>
            <div className="p-4 border-t border-neutral-100 bg-[#FFFAF8] flex justify-end gap-2">
              <BtnOutline onClick={() => { setIsTaskModalOpen(false); setTaskTitle(""); }}>Cancel</BtnOutline>
              <BtnDustyPink icon={Plus} className="px-6 rounded-2xl">Create Task</BtnDustyPink>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};

export default DailyTab;