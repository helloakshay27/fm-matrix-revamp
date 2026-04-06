// ─────────────────────────────────────────────
// DailyTab.jsx — DailyReport theme
// Accent: #EBE6DD | Border: black | Text: #1a1a1a
// ─────────────────────────────────────────────
import React, { useState } from "react";
import { createPortal } from "react-dom";
import {
  Calendar, FileText, ChevronDown, ChevronUp, AlertTriangle,
  CheckCircle2, Circle, ArrowRight, Users, CalendarIcon,
  RefreshCw, X, Plus, MessageSquare,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ── Theme tokens (DailyReport style) ──
const ACCENT = "#EBE6DD";
const BORDER = "black";
const TEXT = "#1a1a1a";
const WHITE = "#ffffff";

// ── Constants ──
const fullMonthNames = { Jan: "January", Feb: "February", Mar: "March", Apr: "April", May: "May" };

const statusColors = {
  missed:   { bg: "#fee2e2", text: "#b91c1c" },
  done:     { bg: "#dcfce7", text: "#15803d" },
  holiday:  { bg: "#fef9c3", text: "#a16207" },
  upcoming: { bg: "#f3f4f6", text: "#374151" },
};

const datesData = [
  { id: 1,  dateNum: "24", day: "TUE", monthYear: "Mar, 2026", status: "missed",   label: "Miss"    },
  { id: 2,  dateNum: "25", day: "WED", monthYear: "Mar, 2026", status: "missed",   label: "Miss"    },
  { id: 3,  dateNum: "26", day: "THU", monthYear: "Mar, 2026", status: "done",     label: "Done"    },
  { id: 4,  dateNum: "27", day: "FRI", monthYear: "Mar, 2026", status: "done",     label: "Done"    },
  { id: 5,  dateNum: "28", day: "SAT", monthYear: "Mar, 2026", status: "holiday",  label: "Holiday" },
  { id: 6,  dateNum: "29", day: "SUN", monthYear: "Mar, 2026", status: "holiday",  label: "Holiday" },
  { id: 7,  dateNum: "30", day: "MON", monthYear: "Mar, 2026", status: "missed",   label: "Miss"    },
  { id: 8,  dateNum: "31", day: "TUE", monthYear: "Mar, 2026", status: "missed",   label: "Miss"    },
  { id: 9,  dateNum: "01", day: "WED", monthYear: "Apr, 2026", status: "upcoming", label: ""        },
  { id: 10, dateNum: "02", day: "THU", monthYear: "Apr, 2026", status: "upcoming", label: ""        },
  { id: 11, dateNum: "03", day: "FRI", monthYear: "Apr, 2026", status: "upcoming", label: ""        },
];

const failedMembers = ["Adhip Shetty", "Fatema Tashrifwala", "Akshay Shinde", "Arun Mohan"];

const detailedReports = [
  {
    id: 1, user: "Bilal Shaikh", email: "bilal.shaikh@lockated.com",
    dept: "Engineering", timestamp: "Apr 1, 9:41 AM", score: 39,
    kpiStats: [{ label: "KPI", val: "0/20" }, { label: "Tasks", val: "15/25" }],
    tasksAndIssues: [{ id: 101, text: "Fix Banner", type: "task", done: false }],
    accomplishments: [{ id: 201, text: "IOS Release", done: true }],
    plans: [{ id: 301, text: "Work on Admin Module" }],
  },
];

// ── Shared UI (DailyReport-style) ──
const BtnPrimary = ({ children, onClick, icon: Icon, type = "button" }) => (
  <button type={type} onClick={onClick}
    className="inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-bold rounded-sm transition-all duration-150 active:scale-[0.97]"
    style={{ backgroundColor: TEXT, color: WHITE, border: `1px solid ${BORDER}` }}
  >
    {Icon && <Icon className="w-4 h-4" />} {children}
  </button>
);

const BtnOutline = ({ children, onClick, icon: Icon, iconClass = "" }) => (
  <button onClick={onClick}
    className="inline-flex items-center justify-center gap-2 px-3 py-2 text-sm font-semibold rounded-sm transition-all duration-150 active:scale-[0.97] hover:brightness-95"
    style={{ backgroundColor: ACCENT, border: `1px solid ${BORDER}`, color: TEXT }}
  >
    {Icon && <Icon className={cn("w-4 h-4", iconClass)} />} {children}
  </button>
);

const BtnIcon = ({ onClick, children, title = "", disabled = false }) => (
  <button disabled={disabled} onClick={onClick} title={title}
    className={cn("inline-flex items-center justify-center w-8 h-8 rounded-sm transition-all duration-150", disabled ? "opacity-40 cursor-not-allowed" : "hover:brightness-95 active:scale-[0.95]")}
    style={{ backgroundColor: ACCENT, border: `1px solid ${BORDER}`, color: TEXT }}
  >
    {children}
  </button>
);

// SectionTitle — centered bold bar (like DailyReport)
const SectionTitle = ({ text }) => (
  <div className="w-full text-center font-bold tracking-wide text-[15px] py-2"
    style={{ backgroundColor: ACCENT, border: `1px solid ${BORDER}`, borderBottom: "none", color: TEXT }}
  >
    {text}
  </div>
);

// ─────────────────────────────────────────────
const DailyTab = ({ selectedDateId, setSelectedDateId }) => {
  const selectedDate = datesData.find((d) => d.id === selectedDateId) || datesData[0];
  const fullDateString = `${selectedDate.dateNum} ${selectedDate.monthYear} (${selectedDate.day.charAt(0) + selectedDate.day.slice(1).toLowerCase()})`;
  const monthName = selectedDate.monthYear.split(",")[0];
  const yearNum = selectedDate.monthYear.split(" ")[1];
  const missedDateLabel = `${fullMonthNames[monthName] || monthName} ${selectedDate.dateNum}, ${yearNum}`;

  const [expandedReports, setExpandedReports] = useState([]);
  const [selectedReports, setSelectedReports] = useState([]);
  const [activeInlineAction, setActiveInlineAction] = useState({ reportId: null, action: null });
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [taskModalReportId, setTaskModalReportId] = useState(null);
  const [selectedMeeting, setSelectedMeeting] = useState("HOD Huddle");
  const [selectedMember, setSelectedMember] = useState("All Members");
  const [inlineText, setInlineText] = useState("");
  const [taskTitle, setTaskTitle] = useState("");
  const [meetingNotes, setMeetingNotes] = useState("");

  const toggleExpand = (id) =>
    setExpandedReports((p) => p.includes(id) ? p.filter((r) => r !== id) : [...p, id]);
  const toggleSelect = (id) =>
    setSelectedReports((p) => p.includes(id) ? p.filter((r) => r !== id) : [...p, id]);
  const toggleSelectAll = () =>
    selectedReports.length === detailedReports.length
      ? setSelectedReports([])
      : setSelectedReports(detailedReports.map((r) => r.id));

  const handleActionClick = (reportId, actionType) => {
    if (actionType === "task") {
      setTaskModalReportId(reportId);
      setIsTaskModalOpen(true);
      setActiveInlineAction({ reportId: null, action: null });
    } else {
      setActiveInlineAction({ reportId, action: actionType });
    }
  };

  return (
    <div className="space-y-5 pb-12">

      {/* ── Header Card ── */}
      <div className="rounded-sm p-4 sm:p-5" style={{ backgroundColor: ACCENT, border: `1px solid ${BORDER}` }}>
        <div className="flex items-center gap-3 mb-5">
          <div className="flex h-9 w-9 items-center justify-center rounded-sm" style={{ backgroundColor: WHITE, border: `1px solid ${BORDER}` }}>
            <FileText className="w-4 h-4 text-[#1a1a1a]" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-[#1a1a1a]">HOD Huddle — Daily Meeting</h2>
            <p className="text-xs text-gray-500 mt-0.5">{fullDateString}</p>
          </div>
        </div>

        {/* Date Pills */}
        <div className="flex gap-2 overflow-x-auto pt-3 pb-5 px-1 mb-3 -mx-1">
          {datesData.map((date) => {
            const sc = statusColors[date.status];
            const isSelected = selectedDate.id === date.id;
            return (
              <div
                key={date.id}
                onClick={() => setSelectedDateId(date.id)}
                className="flex-shrink-0 flex flex-col items-center justify-center rounded-sm cursor-pointer transition-all duration-200 select-none"
                style={{
                  width: 70, height: 84,
                  backgroundColor: isSelected ? TEXT : sc.bg,
                  border: `1.5px solid ${BORDER}`,
                  color: isSelected ? WHITE : sc.text,
                  transform: isSelected ? "scale(1.06)" : "scale(1)",
                  boxShadow: isSelected ? "2px 2px 0 rgba(0,0,0,0.18)" : "none",
                }}
              >
                <span className="text-[10px] font-bold uppercase tracking-wider opacity-90">{date.day}</span>
                <span className="text-2xl font-extrabold leading-none my-0.5">{date.dateNum}</span>
                <span className="text-[10px] font-bold uppercase tracking-wider">{date.label}</span>
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="flex flex-col items-center">
          <div className="flex gap-5 text-xs font-medium flex-wrap justify-center text-[#1a1a1a]">
            {[
              { bg: "#dcfce7", label: "Meeting Done"    },
              { bg: "#fee2e2", label: "Meeting Missed"  },
              { bg: "#fef9c3", label: "Holiday"         },
              { bg: "#f3f4f6", label: "Upcoming"        },
            ].map(({ bg, label }) => (
              <div key={label} className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm inline-block" style={{ backgroundColor: bg, border: `1px solid ${BORDER}` }} />
                {label}
              </div>
            ))}
          </div>
          <p className="text-[11px] mt-1.5 italic text-gray-500">
            Note: Select the date for which users have filled the report, not the meeting date.
          </p>
        </div>
      </div>

      {/* ── Missed Alert ── */}
      {selectedDate.status === "missed" && (
        <div className="rounded-sm p-4" style={{ backgroundColor: "#fee2e2", border: `1px solid ${BORDER}` }}>
          <div className="flex items-center gap-2 font-bold text-sm mb-3 text-[#b91c1c]">
            <AlertTriangle className="w-4 h-4" /> Missed Meetings on {missedDateLabel} (1):
          </div>
          <button className="text-xs font-bold px-3 py-1.5 rounded-sm hover:brightness-95 active:scale-[0.97] transition-all"
            style={{ backgroundColor: WHITE, border: `1px solid ${BORDER}`, color: TEXT }}
          >
            HOD Huddle
          </button>
        </div>
      )}

      {/* ── Filters ── */}
      <div className="flex items-center gap-4 flex-wrap">
        {[
          { label: "MEETING", value: selectedMeeting, setter: setSelectedMeeting },
          { label: "MEMBER",  value: selectedMember,  setter: setSelectedMember  },
        ].map(({ label, value, setter }) => (
          <div key={label} className="flex items-center gap-2">
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{label}</span>
            <div className="flex items-center gap-1.5 rounded-sm px-3 py-1.5 cursor-pointer hover:brightness-95"
              style={{ backgroundColor: ACCENT, border: `1px solid ${BORDER}` }}
            >
              <span className="text-sm font-semibold text-[#1a1a1a]">{value}</span>
              <ChevronDown className="w-3.5 h-3.5 text-[#1a1a1a]/60" />
            </div>
            <button onClick={() => setter(label === "MEETING" ? "All Meetings" : "All Members")}
              className="p-1.5 rounded-sm hover:brightness-95"
              style={{ backgroundColor: ACCENT, border: `1px solid ${BORDER}` }}
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        ))}
      </div>

      {/* ── Reports Block ── */}
      <div className="rounded-sm overflow-hidden" style={{ border: `1px solid ${BORDER}` }}>
        {/* SectionTitle header */}
        <SectionTitle text="Daily Reports for HOD Huddle" />

        {/* Meta row */}
        <div className="p-4 flex justify-between items-start flex-wrap gap-3"
          style={{ backgroundColor: ACCENT, borderBottom: `1px solid ${BORDER}` }}
        >
          <p className="text-sm font-bold text-[#1a1a1a] flex items-center gap-2">
            <Calendar className="w-4 h-4" /> 31 Mar 2026 (Tue)
          </p>
          <div className="flex items-center gap-2 text-xs font-bold flex-wrap">
            <span className="px-2.5 py-1 rounded-sm text-white"   style={{ backgroundColor: TEXT,      border: `1px solid ${BORDER}` }}>Team 11</span>
            <span className="px-2.5 py-1 rounded-sm text-[#15803d]" style={{ backgroundColor: "#dcfce7", border: `1px solid ${BORDER}` }}>Submitted 2</span>
            <span className="px-2.5 py-1 rounded-sm text-[#b91c1c]" style={{ backgroundColor: "#fee2e2", border: `1px solid ${BORDER}` }}>Missed 9</span>
          </div>
        </div>

        {/* Meeting Notes */}
        <div className="p-4" style={{ backgroundColor: "#f9f7f4" }}>
          <div className="rounded-sm overflow-hidden" style={{ backgroundColor: WHITE, border: `1px solid ${BORDER}` }}>
            <div className="flex items-center justify-between p-3" style={{ backgroundColor: ACCENT, borderBottom: `1px solid ${BORDER}` }}>
              <span className="flex items-center gap-2 font-semibold text-[#1a1a1a] text-sm">
                <Users className="w-4 h-4" /> HOD Huddle (10:00) · 31 Mar (Tue)
              </span>
              <div className="flex gap-2">
                <BtnIcon title="Calendar"><CalendarIcon className="w-3.5 h-3.5" /></BtnIcon>
                <BtnIcon title="Refresh"><RefreshCw className="w-3.5 h-3.5" /></BtnIcon>
              </div>
            </div>
            <div className="p-4">
              <label className="block text-sm font-bold text-[#1a1a1a] mb-2">Meeting Notes</label>
              <textarea
                value={meetingNotes}
                onChange={(e) => setMeetingNotes(e.target.value)}
                className="w-full rounded-sm p-3 text-sm focus:outline-none focus:ring-1 focus:ring-black min-h-[80px] resize-y placeholder:text-gray-400 text-[#1a1a1a]"
                style={{ border: `1px solid ${BORDER}`, backgroundColor: ACCENT }}
                placeholder="Enter meeting remarks, feedback, action items..."
              />
            </div>
            <div className="flex items-center justify-between p-3"
              style={{ backgroundColor: ACCENT, borderTop: `1px solid ${BORDER}` }}
            >
              <label className="flex items-center gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded-sm cursor-pointer accent-black"
                  checked={selectedReports.length === detailedReports.length && detailedReports.length > 0}
                  onChange={toggleSelectAll}
                />
                <span className="text-sm font-bold text-[#1a1a1a]">Select All</span>
              </label>
              <BtnPrimary icon={FileText}>Save Meeting</BtnPrimary>
            </div>
          </div>
        </div>
      </div>

      {/* ── Failed Members ── */}
      <div className="rounded-sm p-4" style={{ backgroundColor: "#fef9c3", border: `1px solid ${BORDER}` }}>
        <div className="flex items-center gap-2 font-bold text-sm mb-3 text-[#a16207]">
          <AlertTriangle className="w-4 h-4" /> Team Members Who Failed to Submit Reports ({failedMembers.length}):
        </div>
        <div className="flex flex-wrap gap-2">
          {failedMembers.map((member) => (
            <button key={member}
              className="text-[11px] font-bold px-3 py-1.5 rounded-sm hover:brightness-95 active:scale-[0.96] transition-all"
              style={{ backgroundColor: WHITE, border: `1px solid ${BORDER}`, color: TEXT }}
            >
              {member}
            </button>
          ))}
        </div>
      </div>

      {/* ── Report Cards ── */}
      <div className="space-y-3">
        {detailedReports.map((report) => {
          const isExpanded = expandedReports.includes(report.id);
          const isSelected = selectedReports.includes(report.id);
          return (
            <div key={report.id} className="rounded-sm overflow-hidden transition-all duration-300"
              style={{ backgroundColor: WHITE, border: `1px solid ${BORDER}` }}
            >
              {/* Row header */}
              <div
                className="p-4 flex items-start sm:items-center justify-between gap-4 cursor-pointer transition-colors"
                style={{
                  backgroundColor: isExpanded ? ACCENT : WHITE,
                  borderBottom: isExpanded ? `1px solid ${BORDER}` : "none",
                }}
                onMouseEnter={(e) => { if (!isExpanded) e.currentTarget.style.backgroundColor = "#f9f7f4"; }}
                onMouseLeave={(e) => { if (!isExpanded) e.currentTarget.style.backgroundColor = WHITE; }}
                onClick={() => toggleExpand(report.id)}
              >
                <div className="flex items-start sm:items-center gap-3">
                  <input
                    type="checkbox"
                    className="w-4 h-4 mt-1 sm:mt-0 rounded-sm cursor-pointer accent-black"
                    checked={isSelected}
                    onChange={(e) => { e.stopPropagation(); toggleSelect(report.id); }}
                  />
                  <div className="flex items-center justify-center w-10 h-10 rounded-sm font-bold text-base flex-shrink-0"
                    style={{ backgroundColor: "#fee2e2", border: `1px solid ${BORDER}`, color: "#b91c1c" }}
                  >
                    {report.score}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-bold text-[#1a1a1a] text-sm">{report.user}</h3>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-sm"
                        style={{ backgroundColor: ACCENT, border: `1px solid ${BORDER}`, color: TEXT }}
                      >
                        {report.dept}
                      </span>
                    </div>
                    <div className="text-xs text-gray-500 mt-0.5">{report.email} • {report.timestamp}</div>
                    <div className="flex flex-wrap items-center gap-1.5 mt-2">
                      {report.kpiStats.map((stat, i) => (
                        <span key={i} className="text-[10px] font-bold px-2 py-0.5 rounded-sm"
                          style={{ backgroundColor: "#fee2e2", border: `1px solid ${BORDER}`, color: "#b91c1c" }}
                        >
                          {stat.label}: {stat.val}
                        </span>
                      ))}
                    </div>
                    <div className="text-[11px] text-gray-400 mt-1.5 italic">Click to view tasks, accomplishments & plan</div>
                  </div>
                </div>
                <div className="p-1.5 rounded-sm flex-shrink-0"
                  style={{ backgroundColor: ACCENT, border: `1px solid ${BORDER}` }}
                >
                  {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </div>
              </div>

              {/* Expanded */}
              {isExpanded && (
                <div>
                  {/* Three-column table — like DailyReport Table */}
                  <div className="grid grid-cols-1 md:grid-cols-3" style={{ borderBottom: `1px solid ${BORDER}` }}>
                    {[
                      { title: "Tasks & Issues",  icon: Circle,       colorCls: "text-[#b91c1c]", items: report.tasksAndIssues  },
                      { title: "Accomplishments", icon: CheckCircle2, colorCls: "text-[#15803d]", items: report.accomplishments },
                      { title: "Tomorrow's Plan", icon: ArrowRight,   colorCls: "text-[#a16207]", items: report.plans           },
                    ].map(({ title, icon: Icon, colorCls, items }, colIdx) => (
                      <div key={title} className="p-4"
                        style={{ borderRight: colIdx < 2 ? `1px solid ${BORDER}` : "none" }}
                      >
                        <h4 className={cn("flex items-center gap-2 font-bold mb-3 text-xs uppercase tracking-wider", colorCls)}>
                          <Icon className="w-3.5 h-3.5" /> {title}
                        </h4>
                        <ul className="space-y-2.5">
                          {items.map((item) => (
                            <li key={item.id} className="flex items-start gap-2 text-xs text-[#1a1a1a]">
                              {item.done !== undefined ? (
                                item.done
                                  ? <CheckCircle2 className="w-4 h-4 text-[#15803d] mt-0.5 flex-shrink-0" />
                                  : <Circle className="w-4 h-4 text-[#b91c1c] mt-0.5 flex-shrink-0" />
                              ) : (
                                <div className="w-1.5 h-1.5 rounded-full bg-gray-400 mt-1.5 shrink-0" />
                              )}
                              <span className="flex-1 leading-snug">{item.text}</span>
                              {item.type && (
                                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-sm uppercase flex-shrink-0"
                                  style={{ backgroundColor: ACCENT, border: `1px solid ${BORDER}`, color: TEXT }}
                                >
                                  {item.type}
                                </span>
                              )}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>

                  {/* Quick Actions */}
                  <div className="p-4" style={{ backgroundColor: "#f9f7f4", borderBottom: `1px solid ${BORDER}` }}>
                    <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-3">Quick Actions</div>
                    {activeInlineAction.reportId !== report.id ? (
                      <div className="flex items-center gap-2 flex-wrap">
                        <BtnOutline onClick={() => handleActionClick(report.id, "task")}     icon={Plus}>Task</BtnOutline>
                        <BtnOutline onClick={() => handleActionClick(report.id, "issue")}    icon={Plus}>Stuck Issue</BtnOutline>
                        <BtnOutline onClick={() => handleActionClick(report.id, "plan")}     icon={Plus}>Add to Plan</BtnOutline>
                        <BtnPrimary onClick={() => handleActionClick(report.id, "feedback")} icon={MessageSquare}>Feedback</BtnPrimary>
                      </div>
                    ) : (
                      <div className="rounded-sm p-3 max-w-2xl"
                        style={{ backgroundColor: WHITE, border: `1px solid ${BORDER}` }}
                      >
                        <div className="flex gap-2">
                          <input
                            type="text"
                            placeholder={`Add ${activeInlineAction.action}...`}
                            value={inlineText}
                            onChange={(e) => setInlineText(e.target.value)}
                            className="flex-1 rounded-sm p-2 text-sm focus:outline-none focus:ring-1 focus:ring-black text-[#1a1a1a]"
                            style={{ border: `1px solid ${BORDER}`, backgroundColor: ACCENT }}
                            autoFocus
                          />
                          <BtnPrimary onClick={() => { setInlineText(""); setActiveInlineAction({ reportId: null, action: null }); }}>Submit</BtnPrimary>
                          <BtnOutline onClick={() => { setInlineText(""); setActiveInlineAction({ reportId: null, action: null }); }}>Cancel</BtnOutline>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Collapse */}
                  <div className="py-2 flex justify-center" style={{ backgroundColor: WHITE }}>
                    <button onClick={() => toggleExpand(report.id)}
                      className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-[#1a1a1a] rounded-sm px-3 py-1 transition-all"
                      style={{ backgroundColor: ACCENT, border: `1px solid ${BORDER}` }}
                    >
                      <ChevronUp className="w-3 h-3" /> Collapse
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* ── Add Task Modal ── */}
      {isTaskModalOpen && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="rounded-sm w-full max-w-md overflow-hidden"
            style={{ backgroundColor: WHITE, border: `1px solid ${BORDER}`, boxShadow: "4px 4px 0 rgba(0,0,0,0.15)" }}
          >
            <div className="flex justify-between items-center p-4"
              style={{ backgroundColor: ACCENT, borderBottom: `1px solid ${BORDER}` }}
            >
              <h5 className="font-bold text-sm text-[#1a1a1a] flex items-center gap-2">
                <FileText className="w-4 h-4" /> Add Task for {detailedReports.find((r) => r.id === taskModalReportId)?.user}
              </h5>
              <BtnIcon onClick={() => setIsTaskModalOpen(false)}><X className="w-3.5 h-3.5" /></BtnIcon>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="text-xs font-bold text-[#1a1a1a] mb-1.5 block">
                  Task Title <span className="text-[#b91c1c]">*</span>
                </label>
                <input
                  type="text"
                  value={taskTitle}
                  onChange={(e) => setTaskTitle(e.target.value)}
                  placeholder="What needs to be done?"
                  className="w-full rounded-sm p-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-black text-[#1a1a1a]"
                  style={{ border: `1px solid ${BORDER}`, backgroundColor: ACCENT }}
                  autoFocus
                />
              </div>
            </div>
            <div className="p-4 flex justify-end gap-2"
              style={{ backgroundColor: ACCENT, borderTop: `1px solid ${BORDER}` }}
            >
              <BtnOutline onClick={() => { setIsTaskModalOpen(false); setTaskTitle(""); }}>Cancel</BtnOutline>
              <BtnPrimary onClick={() => { setIsTaskModalOpen(false); setTaskTitle(""); }} icon={Plus}>Create Task</BtnPrimary>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};

export default DailyTab;