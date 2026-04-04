// ─────────────────────────────────────────────
// DailyTab.jsx
// ─────────────────────────────────────────────
import React, { useState } from "react";
import { createPortal } from "react-dom";
import {
  Calendar, FileText, ChevronDown, ChevronUp, AlertTriangle,
  CheckCircle2, Circle, ArrowRight, Users, CalendarIcon,
  RefreshCw, X, Plus, MessageSquare,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  datesData, detailedReports, failedMembers, statusColors, fullMonthNames,
  SectionCard, BtnPrimary, BtnOutline, BtnIcon, BtnPurple,
} from "./shared";

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
      <SectionCard>
        <div className="flex items-center gap-3 mb-5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#fef6f4] border border-[rgba(218,119,86,0.22)]">
            <FileText className="w-4 h-4 text-[#DA7756]" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-neutral-900">HOD Huddle — Daily Meeting</h2>
            <p className="text-xs text-neutral-500 mt-0.5">{fullDateString}</p>
          </div>
        </div>

        <div className="flex gap-2.5 overflow-x-auto pt-3 pb-5 px-2 mb-3 -mx-2">
          {datesData.map((date) => {
            const sc = statusColors[date.status];
            const isSelected = selectedDate.id === date.id;
            return (
              <div
                key={date.id}
                onClick={() => setSelectedDateId(date.id)}
                className="flex-shrink-0 flex flex-col items-center justify-center rounded-2xl cursor-pointer transition-all duration-200 select-none"
                style={{
                  width: 70, height: 84,
                  background: isSelected ? sc.text : sc.bg,
                  border: `1.5px solid ${isSelected ? sc.text : sc.border}`,
                  color: isSelected ? "#fff" : sc.text,
                  transform: isSelected ? "scale(1.07)" : "scale(1)",
                  boxShadow: isSelected ? "0 4px 12px rgba(0,0,0,0.13)" : "0 1px 2px rgba(0,0,0,0.04)",
                }}
              >
                <span className="text-[10px] font-bold uppercase tracking-wider opacity-90">{date.day}</span>
                <span className="text-2xl font-extrabold leading-none my-0.5">{date.dateNum}</span>
                <span className="text-[10px] font-bold uppercase tracking-wider">{date.label}</span>
              </div>
            );
          })}
        </div>

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

      {selectedDate.status === "missed" && (
        <div className="bg-orange-50 border border-orange-200 rounded-2xl p-4 shadow-sm">
          <div className="flex items-center gap-2 text-orange-600 font-bold text-sm mb-3">
            <AlertTriangle className="w-4 h-4" /> Missed Meetings on {missedDateLabel} (1):
          </div>
          <button className="bg-white border border-orange-300 text-orange-700 text-xs font-bold px-3 py-1.5 rounded-xl hover:bg-orange-100 shadow-sm transition-all active:scale-[0.97]">
            HOD Huddle
          </button>
        </div>
      )}

      <div className="flex items-center gap-4 flex-wrap">
        {[
          { label: "MEETING", value: selectedMeeting, setter: setSelectedMeeting },
          { label: "MEMBER", value: selectedMember, setter: setSelectedMember },
        ].map(({ label, value, setter }) => (
          <div key={label} className="flex items-center gap-2">
            <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">{label}</span>
            <div className="flex items-center gap-1.5 bg-[#fffaf8] border border-[rgba(218,119,86,0.3)] rounded-xl px-3 py-1.5 shadow-sm cursor-pointer hover:bg-[#fef6f4] transition-colors">
              <span className="text-sm font-semibold text-neutral-800">{value}</span>
              <ChevronDown className="w-3.5 h-3.5 text-[#DA7756]/70" />
            </div>
            <button onClick={() => setter(label === "MEETING" ? "All Meetings" : "All Members")} className="p-1.5 text-[#DA7756]/70 hover:text-[#DA7756] bg-[#fffaf8] border border-[rgba(218,119,86,0.2)] rounded-xl shadow-sm transition-colors">
              <X className="w-3 h-3" />
            </button>
          </div>
        ))}
      </div>

      <div className="border border-[rgba(218,119,86,0.18)] rounded-2xl shadow-sm overflow-hidden bg-white">
        <div className="p-4 border-b border-[rgba(218,119,86,0.1)] flex justify-between items-start flex-wrap gap-3 bg-[#fffaf8]">
          <div>
            <h3 className="font-bold text-sm text-neutral-900 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#DA7756]" /> Daily Reports for HOD Huddle
            </h3>
            <p className="text-xs text-neutral-400 mt-0.5">31 Mar 2026 (Tue)</p>
          </div>
          <div className="flex items-center gap-2 text-xs font-semibold flex-wrap">
            <span className="px-2.5 py-1 rounded-xl text-xs font-bold bg-[#DA7756] text-white shadow-sm">Team 11</span>
            <span className="px-2.5 py-1 rounded-xl text-xs font-bold bg-[#f6a67d] text-white shadow-sm">Submitted 2</span>
            <span className="px-2.5 py-1 rounded-xl text-xs font-bold bg-[#8f3f24] text-white shadow-sm">Missed 9</span>
          </div>
        </div>
        <div className="p-4 bg-[#fef6f4]">
          <div className="bg-white border border-[rgba(218,119,86,0.18)] rounded-2xl overflow-hidden shadow-sm">
            <div className="flex items-center justify-between p-3 border-b border-[rgba(218,119,86,0.1)] bg-[#fffaf8]">
              <div className="flex items-center gap-2 font-semibold text-neutral-800 text-sm">
                <Users className="w-4 h-4 text-[#DA7756]" /> HOD Huddle (10:00) · 31 Mar (Tue)
              </div>
              <div className="flex gap-2">
                <BtnIcon title="Calendar"><CalendarIcon className="w-3.5 h-3.5 text-[#DA7756]" /></BtnIcon>
                <BtnIcon title="Refresh"><RefreshCw className="w-3.5 h-3.5" /></BtnIcon>
              </div>
            </div>
            <div className="p-4">
              <label className="block text-sm font-bold text-neutral-800 mb-2">Meeting Notes</label>
              <textarea
                value={meetingNotes}
                onChange={(e) => setMeetingNotes(e.target.value)}
                className="w-full border border-[rgba(218,119,86,0.18)] rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[rgba(218,119,86,0.22)] min-h-[80px] resize-y placeholder:text-neutral-400 text-neutral-700 bg-[#fffaf8]"
                placeholder="Enter meeting remarks, feedback, action items... Use @ to mention team members."
              />
            </div>
            <div className="flex items-center justify-between bg-[#fffaf8] p-3 border-t border-[rgba(218,119,86,0.1)]">
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
              <BtnPrimary icon={FileText}>Save Meeting</BtnPrimary>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-[#fef6f4] border border-[rgba(218,119,86,0.25)] rounded-2xl p-4 shadow-sm">
        <div className="flex items-center gap-2 text-[#DA7756] font-bold text-sm mb-3">
          <AlertTriangle className="w-4 h-4" /> Team Members Who Failed to Submit Reports ({failedMembers.length}):
        </div>
        <div className="flex flex-wrap gap-2">
          {failedMembers.map((member) => (
            <button key={member} className="text-[11px] font-bold px-3 py-1.5 rounded-xl border border-[rgba(218,119,86,0.4)] bg-white text-[#DA7756] shadow-sm hover:bg-[#DA7756] hover:text-white hover:border-[#DA7756] active:scale-[0.96] transition-all duration-150">
              {member}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        {detailedReports.map((report) => {
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
                    onChange={(e) => { e.stopPropagation(); toggleSelect(report.id); }}
                  />
                  <div className="flex items-center justify-center w-10 h-10 rounded-full border-2 border-red-400 text-red-600 font-bold text-base flex-shrink-0 bg-red-50">
                    {report.score}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-bold text-neutral-900 text-sm">{report.user}</h3>
                      <span className="text-[10px] font-bold text-[#993C1D] border border-[rgba(218,119,86,0.18)] bg-[#FAECE7] px-2 py-0.5 rounded-xl">{report.dept}</span>
                    </div>
                    <div className="text-xs text-neutral-400 mt-0.5">{report.email} • {report.timestamp}</div>
                    <div className="flex flex-wrap items-center gap-1.5 mt-2">
                      {report.kpiStats.map((stat, i) => (
                        <span key={i} className="bg-red-50 text-red-500 text-[10px] font-bold px-2 py-0.5 rounded-xl border border-red-100">
                          {stat.label}: {stat.val}
                        </span>
                      ))}
                    </div>
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
                      { title: "Tasks & Issues", icon: Circle, color: "red", items: report.tasksAndIssues },
                      { title: "Accomplishments", icon: CheckCircle2, color: "green", items: report.accomplishments },
                      { title: "Tomorrow's Plan", icon: ArrowRight, color: "amber", items: report.plans },
                    ].map(({ title, icon: Icon, color, items }) => (
                      <div key={title} className="p-4">
                        <h4 className={cn("flex items-center gap-2 font-bold mb-3 text-xs uppercase tracking-wider", color === "red" ? "text-red-500" : color === "green" ? "text-green-600" : "text-amber-500")}>
                          <Icon className="w-3.5 h-3.5" /> {title}
                        </h4>
                        <ul className="space-y-2.5">
                          {items.map((item) => (
                            <li key={item.id} className="flex items-start gap-2 text-xs text-neutral-700">
                              {item.done !== undefined ? (
                                item.done
                                  ? <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                                  : <Circle className="w-4 h-4 text-[#DA7756] mt-0.5 flex-shrink-0" />
                              ) : (
                                <div className="w-1.5 h-1.5 rounded-full bg-neutral-300 mt-1.5 shrink-0" />
                              )}
                              <span className="flex-1 leading-snug">{item.text}</span>
                              {item.type && (
                                <span className={cn("text-[9px] font-bold px-1.5 py-0.5 rounded-xl uppercase flex-shrink-0 border", item.type === "task" ? "text-[#993C1D] border-[rgba(218,119,86,0.18)] bg-[#FAECE7]" : "text-red-500 border-red-200 bg-red-50")}>
                                  {item.type}
                                </span>
                              )}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>

                  <div className="p-4 border-t border-[rgba(218,119,86,0.1)] bg-neutral-50">
                    <div className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-3">Quick Actions</div>
                    {activeInlineAction.reportId !== report.id ? (
                      <div className="flex items-center gap-2 flex-wrap">
                        <BtnOutline onClick={() => handleActionClick(report.id, "task")} icon={Plus} iconClass="text-[#DA7756]">Task</BtnOutline>
                        <BtnOutline onClick={() => handleActionClick(report.id, "issue")} icon={Plus} iconClass="text-red-500">Stuck Issue</BtnOutline>
                        <BtnOutline onClick={() => handleActionClick(report.id, "plan")} icon={Plus} iconClass="text-amber-500">Add to Plan</BtnOutline>
                        <BtnPurple onClick={() => handleActionClick(report.id, "feedback")} icon={MessageSquare}>Feedback</BtnPurple>
                      </div>
                    ) : (
                      <div className="bg-white p-3 rounded-2xl border border-[rgba(218,119,86,0.2)] shadow-sm max-w-2xl">
                        <div className="flex gap-2">
                          <input
                            type="text"
                            placeholder={`Add ${activeInlineAction.action}...`}
                            value={inlineText}
                            onChange={(e) => setInlineText(e.target.value)}
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

      {isTaskModalOpen && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border border-[rgba(218,119,86,0.18)]">
            <div className="flex justify-between items-center p-4 border-b border-neutral-100 bg-[#fef6f4]">
              <h5 className="font-bold text-sm text-neutral-900 flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#DA7756]" /> Add Task for {detailedReports.find((r) => r.id === taskModalReportId)?.user}
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
        document.body
      )}
    </div>
  );
};

export default DailyTab;