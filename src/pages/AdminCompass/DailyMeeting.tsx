import React, { useState, useRef, useEffect } from 'react';
import {
  Calendar, FileText, History as HistoryIcon, BarChart2, Settings,
  ChevronDown, AlertTriangle, FileSpreadsheet,
  Search, Eye, RefreshCw, X, Plus, Star,
  CheckCircle2, Circle, ArrowLeft, ArrowRight,
  TrendingUp, TrendingDown, Users, Target, CalendarIcon,
  Activity, Building2, MoreHorizontal, Clock, Filter,
  Edit, Trash, Info, Sparkles, ChevronLeft, ChevronRight,
  MessageSquare, LineChart
} from 'lucide-react';
import {
  LineChart as ReLineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, AreaChart, Area, Legend
} from 'recharts';
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";

// ── Design Tokens (from FeedbackDashboard) ──
const C = {
  primary:     '#DA7756',
  primaryHov:  '#c9674a',
  primaryBg:   '#fef6f4',
  primaryTint: 'rgba(218,119,86,0.10)',
  primaryBord: 'rgba(218,119,86,0.22)',
  pageBg:      '#f6f4ee',
  textMain:    '#171717',
  textMuted:   '#737373',
  borderLgt:   '#ede8e5',
  cardBg:      '#fff',
  skyBg:       'rgb(224 242 254 / 0.9)',
  greenBg:     '#E3F4E8',
  violetBg:    'rgb(237 233 254 / 0.9)',
  orangeBg:    'rgb(255 237 213 / 0.9)',
};

// ── Mock Data ──
const datesData = [
  { id: 1, dateNum: '24', day: 'TUE', monthYear: 'Mar, 2026', status: 'missed',   label: 'Miss'    },
  { id: 2, dateNum: '25', day: 'WED', monthYear: 'Mar, 2026', status: 'missed',   label: 'Miss'    },
  { id: 3, dateNum: '26', day: 'THU', monthYear: 'Mar, 2026', status: 'done',     label: 'Done'    },
  { id: 4, dateNum: '27', day: 'FRI', monthYear: 'Mar, 2026', status: 'done',     label: 'Done'    },
  { id: 5, dateNum: '28', day: 'SAT', monthYear: 'Mar, 2026', status: 'holiday',  label: 'Holiday' },
  { id: 6, dateNum: '29', day: 'SUN', monthYear: 'Mar, 2026', status: 'holiday',  label: 'Holiday' },
  { id: 7, dateNum: '30', day: 'MON', monthYear: 'Mar, 2026', status: 'missed',   label: 'Miss'    },
  { id: 8, dateNum: '31', day: 'TUE', monthYear: 'Mar, 2026', status: 'missed',   label: 'Miss'    },
  { id: 9, dateNum: '01', day: 'WED', monthYear: 'Apr, 2026', status: 'upcoming', label: ''        },
];

const mockLogs = [
  { id: 1, date: 'Mar 30, 2026', user: 'Yash Rathod',      email: 'yash.rathod@lockated.com',      score: 7,  dept: 'Business Excellence', highlights: '2 accomplishments, 0 challenges', submittedAt: 'Mar 31, 2026\n10:09 AM' },
  { id: 2, date: 'Mar 30, 2026', user: 'Arun Mohan',       email: 'arun.mohan@lockated.com',        score: 13, dept: 'Client Servicing',     highlights: '3 accomplishments, 0 challenges', submittedAt: 'Mar 31, 2026\n10:07 AM' },
  { id: 3, date: 'Mar 30, 2026', user: 'Adhip Shetty',     email: 'adhip.shetty@lockated.com',      score: 11, dept: 'Business Excellence', highlights: '3 accomplishments, 0 challenges', submittedAt: 'Mar 31, 2026\n9:52 AM'  },
  { id: 4, date: 'Mar 30, 2026', user: 'Bilal Shaikh',     email: 'bilal.shaikh@lockated.com',      score: 35, dept: 'Engineering',          highlights: '10 accomplishments, 0 challenges', submittedAt: 'Mar 31, 2026\n9:23 AM' },
  { id: 5, date: 'Mar 30, 2026', user: 'Mahendra Lungare', email: 'mahendra.lungare@lockated.com',  score: 13, dept: 'Engineering',          highlights: '4 accomplishments, 0 challenges', submittedAt: 'Mar 31, 2026\n9:17 AM'  },
  { id: 6, date: 'Mar 30, 2026', user: 'Punit Jain',       email: 'punit.jain@lockated.com',        score: 35, dept: 'Accounts',             highlights: '6 accomplishments, 0 challenges', submittedAt: 'Mar 30, 2026\n7:34 PM'  },
  { id: 7, date: 'Mar 30, 2026', user: 'Kshitij Rasal',    email: 'kshitij.rasal@lockated.com',     score: 50, dept: 'Design',               highlights: '6 accomplishments, 0 challenges', submittedAt: 'Mar 30, 2026\n7:19 PM'  },
];

const trendData = [
  { day: 'Mar 25', attendance: 0,  kpi: 0 },
  { day: 'Mar 26', attendance: 0,  kpi: 0 },
  { day: 'Mar 27', attendance: 10, kpi: 5 },
  { day: 'Mar 28', attendance: 0,  kpi: 0 },
  { day: 'Mar 29', attendance: 80, kpi: 0 },
  { day: 'Mar 30', attendance: 20, kpi: 0 },
  { day: 'Mar 31', attendance: 5,  kpi: 0 },
];

const teamKPIs = [
  { name: 'Adhip Shetty',     kpis: 0 },
  { name: 'arun.mohan',       kpis: 0 },
  { name: 'bilal.shaikh',     kpis: 0 },
  { name: 'chetan.bafna',     kpis: 0 },
  { name: 'kshitij.rasal',    kpis: 0 },
  { name: 'mahendra.lungare', kpis: 0 },
  { name: 'punit.jain',       kpis: 1, detail: 'Invoices Raised', progress: 0 },
  { name: 'Sadanand Gupta',   kpis: 0 },
  { name: 'yash.rathod',      kpis: 0 },
  { name: 'akshay.shinde',    kpis: 0 },
];

const analyticsActivityData = [
  { date: 'Mar 18', reports: 0, accomplishments: 0,  stuck: 0 },
  { date: 'Mar 20', reports: 0, accomplishments: 0,  stuck: 0 },
  { date: 'Mar 22', reports: 0, accomplishments: 0,  stuck: 0 },
  { date: 'Mar 24', reports: 0, accomplishments: 0,  stuck: 0 },
  { date: 'Mar 26', reports: 0, accomplishments: 0,  stuck: 0 },
  { date: 'Mar 28', reports: 0, accomplishments: 0,  stuck: 0 },
  { date: 'Mar 29', reports: 2, accomplishments: 4,  stuck: 0 },
  { date: 'Mar 30', reports: 8, accomplishments: 22, stuck: 0 },
  { date: 'Mar 31', reports: 0, accomplishments: 0,  stuck: 0 },
];

const departmentsList = [
  'Accounts', 'Business Excellence', 'Client Servicing',
  'Design', 'Engineering', 'Front End',
  'HR', 'Human Resources', 'Management',
  'Marketing', 'Product', 'QA', 'Sales',
];

const uniqueDepartments = Array.from(new Set(mockLogs.map(l => l.dept))).sort();

const monthMap = {
  Jan: '01', Feb: '02', Mar: '03', Apr: '04', May: '05', Jun: '06',
  Jul: '07', Aug: '08', Sep: '09', Oct: '10', Nov: '11', Dec: '12',
};

const statusColors = {
  missed:   { bg: '#fee2e2', border: '#fca5a5', text: '#ef4444'  },
  done:     { bg: '#dcfce7', border: '#bbf7d0', text: '#22c55e'  },
  holiday:  { bg: '#ffedd5', border: '#fed7aa', text: '#f97316'  },
  upcoming: { bg: '#f3f4f6', border: C.borderLgt, text: '#9ca3af' },
};

const tabs = [
  { name: 'Daily',     icon: Calendar        },
  { name: 'Daily Log', icon: FileText         },
  { name: 'History',   icon: HistoryIcon      },
  { name: 'Reports',   icon: FileSpreadsheet  },
  { name: 'Analytics', icon: BarChart2        },
  { name: 'Settings',  icon: Settings         },
];

// ── Shared Card Wrapper ──
const SectionCard = ({ children, className = '' }) => (
  <Card className={cn(
    "rounded-2xl border shadow-md",
    "border-[rgba(218,119,86,0.22)] bg-[rgba(218,119,86,0.10)]",
    "p-4 sm:p-6",
    className
  )}>
    {children}
  </Card>
);

// ── Shared Section Title ──
const SectionTitle = ({ children, className = '' }) => (
  <h2 className={cn("mb-4 text-lg font-semibold text-neutral-900", className)}>{children}</h2>
);

// ─────────────────────────────────────────────
// Sub-component: Daily Tab
// ─────────────────────────────────────────────
const DailyTab = ({ selectedDateId, setSelectedDateId }) => {
  const selectedDate = datesData.find(d => d.id === selectedDateId) || datesData[0];
  const fullDateString = `${selectedDate.dateNum} ${selectedDate.monthYear} (${selectedDate.day.charAt(0) + selectedDate.day.slice(1).toLowerCase()})`;

  return (
    <div className="space-y-6 animate-fade-in">
      <SectionCard>
        <div className="flex items-center gap-3 mb-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#fef6f4] border border-[rgba(218,119,86,0.22)]">
            <FileText className="w-5 h-5 text-[#DA7756]" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-neutral-900">HOD Huddle — Daily Meeting</h2>
            <p className="text-sm text-neutral-500 mt-0.5">{fullDateString}</p>
          </div>
        </div>

        <div className="flex gap-3 overflow-x-auto pb-3 mb-4">
          {datesData.map((date) => {
            const sc = statusColors[date.status];
            const isSelected = selectedDate.id === date.id;
            return (
              <div
                key={date.id}
                onClick={() => setSelectedDateId(date.id)}
                className="flex-shrink-0 flex flex-col items-center justify-center rounded-2xl cursor-pointer transition-all duration-200"
                style={{
                  width: 72, height: 88,
                  background: isSelected ? sc.text : sc.bg,
                  border: `2px solid ${isSelected ? sc.text : sc.border}`,
                  color: isSelected ? '#fff' : sc.text,
                  transform: isSelected ? 'scale(1.07)' : 'scale(1)',
                  boxShadow: isSelected ? '0 4px 14px rgba(0,0,0,0.12)' : 'none',
                }}
              >
                <span className="text-[10px] font-bold uppercase tracking-wider opacity-90">{date.day}</span>
                <span className="text-2xl font-extrabold leading-none my-0.5">{date.dateNum}</span>
                <span className="text-[10px] font-bold uppercase tracking-wider">{date.label}</span>
              </div>
            );
          })}
        </div>

        <div className="flex flex-col items-center justify-center mb-6">
          <div className="flex gap-6 text-sm font-medium flex-wrap justify-center text-neutral-500">
            {[
              { color: '#22c55e', label: 'Meeting Done'   },
              { color: '#ef4444', label: 'Meeting Missed' },
              { color: '#f59e0b', label: 'Holiday'        },
              { color: '#d1d5db', label: 'Upcoming'       },
            ].map(({ color, label }) => (
              <div key={label} className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-sm inline-block border border-black/10" style={{ background: color }} />
                {label}
              </div>
            ))}
          </div>
          <p className="text-xs mt-2 italic text-neutral-400">
            Note: Select the date for which users have filled the report, not the meeting date.
          </p>
        </div>

        {selectedDate.status === 'missed' && (
          <div className="rounded-xl p-4 bg-[#fef6f4] border border-[rgba(218,119,86,0.22)]">
            <div className="flex items-center gap-2 font-semibold mb-3 text-sm text-[#DA7756]">
              <AlertTriangle className="w-4 h-4" />
              Missed Meetings on {selectedDate.monthYear.split(',')[0]} {selectedDate.dateNum}, {selectedDate.monthYear.split(', ')[1]}
            </div>
            <span className="inline-block text-xs font-bold px-3 py-1 rounded-lg bg-white border border-red-200 text-red-500">
              HOD Huddle
            </span>
          </div>
        )}
      </SectionCard>

      <SectionCard className="p-0 overflow-hidden">
        <div className="flex items-center gap-6 p-4 border-b border-[rgba(218,119,86,0.15)] flex-wrap">
          {[
            { label: 'MEETING', value: 'HOD Huddle'  },
            { label: 'MEMBER',  value: 'All Members' },
          ].map(({ label, value }) => (
            <div key={label} className="flex items-center gap-2">
              <span className="text-xs font-bold tracking-wider text-neutral-500">{label}</span>
              <button className="flex items-center justify-between px-3 py-1.5 rounded-xl text-sm font-semibold border border-[rgba(218,119,86,0.22)] bg-white text-neutral-800 hover:bg-[#fef6f4] transition-colors" style={{ minWidth: 140 }}>
                {value} <ChevronDown className="w-4 h-4 ml-2 text-neutral-400" />
              </button>
            </div>
          ))}
        </div>

        <div className="p-6">
          <div className="flex justify-between items-start mb-8 flex-wrap gap-4">
            <div>
              <h3 className="font-bold text-lg text-neutral-900">Daily Reports for HOD Huddle</h3>
              <p className="text-xs text-neutral-500 mt-0.5">{fullDateString}</p>
            </div>
            <div className="flex items-center gap-3 text-sm font-medium text-neutral-500 flex-wrap">
              <div className="flex items-center gap-2">Team: <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-[rgba(218,119,86,0.1)] text-[#DA7756]">8</span></div>
              <div className="flex items-center gap-2">Submitted: <span className="bg-green-100 text-green-800 px-2 py-0.5 rounded-full text-xs font-bold">0</span></div>
              <div className="flex items-center gap-2">Missed: <span className="bg-red-100 text-red-800 px-2 py-0.5 rounded-full text-xs font-bold">8</span></div>
            </div>
          </div>
          <div className="flex flex-col items-center justify-center pb-10 opacity-40">
            <FileText className="w-16 h-16 text-[#DA7756] mb-3" strokeWidth={1} />
            <p className="text-sm font-semibold text-neutral-500">No reports submitted for this date</p>
          </div>
        </div>
      </SectionCard>
    </div>
  );
};

// ─────────────────────────────────────────────
// Sub-component: Daily Log Tab
// ─────────────────────────────────────────────
const DailyLogTab = ({ selectedDateId, setSelectedDateId }) => {
  const [searchQuery,           setSearchQuery]           = useState('');
  const [selectedDeptFilter,    setSelectedDeptFilter]    = useState('');
  const [selectedMeetingFilter, setSelectedMeetingFilter] = useState('');
  const [isGrouped,             setIsGrouped]             = useState(false);
  const [selectedReport,        setSelectedReport]        = useState(null);
  const [activeAction,          setActiveAction]          = useState(null);

  const selectedDate    = datesData.find(d => d.id === selectedDateId) || datesData[6];
  const currentIndex    = datesData.findIndex(d => d.id === selectedDateId);
  const monthStr        = selectedDate.monthYear.split(',')[0];
  const yearStr         = selectedDate.monthYear.split(' ')[1];
  const shortDateString = `${selectedDate.dateNum.padStart(2, '0')}-${monthMap[monthStr]}-${yearStr}`;
  const inputDateValue  = `${yearStr}-${monthMap[monthStr]}-${selectedDate.dateNum.padStart(2, '0')}`;

  const handlePrevDate = () => { if (currentIndex > 0) setSelectedDateId(datesData[currentIndex - 1].id); };
  const handleNextDate = () => { if (currentIndex < datesData.length - 1) setSelectedDateId(datesData[currentIndex + 1].id); };

  const handleDateChange = (e) => {
    const s = e.target.value;
    if (!s) return;
    const [y, m, d] = s.split('-');
    const found = datesData.find(o =>
      o.dateNum.padStart(2, '0') === d &&
      monthMap[o.monthYear.split(',')[0]] === m &&
      o.monthYear.split(' ')[1] === y
    );
    if (found) setSelectedDateId(found.id);
    else alert('For this mock preview, please select a date between Mar 24, 2026 and Apr 1, 2026.');
  };

  const filteredLogs = mockLogs.filter(log => {
    const matchesSearch = log.user.toLowerCase().includes(searchQuery.toLowerCase()) || log.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDept   = selectedDeptFilter ? log.dept === selectedDeptFilter : true;
    return matchesSearch && matchesDept;
  });

  const groupedLogs = filteredLogs.reduce((acc, log) => {
    if (!acc[log.dept]) acc[log.dept] = [];
    acc[log.dept].push(log);
    return acc;
  }, {});
  const sortedDepts = Object.keys(groupedLogs).sort();

  const renderTableRow = (log) => (
    <tr key={log.id} className="border-b hover:bg-[#fef6f4] transition-colors" style={{ borderColor: C.borderLgt }}>
      <td className="p-3 text-sm font-semibold text-neutral-700">{log.date}</td>
      <td className="p-3">
        <div className="text-sm font-bold text-neutral-900">{log.user}</div>
        <div className="text-xs text-neutral-400">{log.email}</div>
      </td>
      <td className="p-3">
        <span className={cn(
          "px-2 py-1 rounded-lg text-xs font-bold",
          log.score >= 50 ? 'bg-orange-100 text-orange-600' : log.score >= 30 ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-600'
        )}>
          {log.score}
        </span>
      </td>
      <td className="p-3">
        <span className="bg-[rgba(218,119,86,0.1)] text-[#DA7756] px-2 py-1 rounded-lg text-xs font-semibold border border-[rgba(218,119,86,0.2)]">{log.dept}</span>
      </td>
      <td className="p-3 text-sm text-neutral-600">{log.highlights}</td>
      <td className="p-3 text-xs text-neutral-400 whitespace-pre-line">{log.submittedAt}</td>
      <td className="p-3 text-center">
        <button onClick={() => { setSelectedReport(log); setActiveAction(null); }} className="p-1.5 rounded-full hover:bg-[rgba(218,119,86,0.1)] text-[#DA7756] transition-colors">
          <Eye className="w-5 h-5" />
        </button>
      </td>
    </tr>
  );

  return (
    <div className="animate-fade-in space-y-4">
      <SectionCard className="p-0 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[rgba(218,119,86,0.15)] flex-wrap gap-3 bg-[#fef6f4]">
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white border border-[rgba(218,119,86,0.22)]">
              <FileText className="w-4 h-4 text-[#DA7756]" />
            </div>
            <h2 className="text-base font-bold text-neutral-900">
              Daily Report Log — {monthStr} {selectedDate.dateNum} ({selectedDate.day.charAt(0) + selectedDate.day.slice(1).toLowerCase()})
            </h2>
            <div className="flex items-center gap-2 ml-1">
              <span className="text-xs font-bold px-2 py-1 bg-green-100 text-green-800 rounded-lg">Submitted: 7</span>
              <span className="text-xs font-bold px-2 py-1 bg-neutral-100 text-neutral-600 rounded-lg border">Expected: 0</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={handlePrevDate} disabled={currentIndex === 0} className="p-1.5 border border-[rgba(218,119,86,0.22)] rounded-lg text-[#DA7756] hover:bg-[#fef6f4] bg-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div className="relative flex items-center">
              <input type="date" value={inputDateValue} onChange={handleDateChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" title="Select Date" />
              <div className="flex items-center justify-center gap-2 px-3 py-1.5 border border-[rgba(218,119,86,0.22)] rounded-lg text-sm font-semibold text-neutral-700 bg-white hover:bg-[#fef6f4] min-w-[130px]">
                {shortDateString} <Calendar className="w-4 h-4 text-[#DA7756]" />
              </div>
            </div>
            <button onClick={handleNextDate} disabled={currentIndex === datesData.length - 1} className="p-1.5 border border-[rgba(218,119,86,0.22)] rounded-lg text-[#DA7756] hover:bg-[#fef6f4] bg-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="p-4 flex items-center justify-between gap-4 flex-wrap bg-white border-b border-[rgba(218,119,86,0.1)]">
          <div className="relative flex-1 min-w-[250px]">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input type="text" placeholder="Search by user, email..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm border border-[rgba(218,119,86,0.22)] rounded-xl focus:outline-none focus:ring-2 focus:ring-[rgba(218,119,86,0.3)] bg-[#fef6f4]" />
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <select value={selectedDeptFilter} onChange={e => setSelectedDeptFilter(e.target.value)} className="border border-[rgba(218,119,86,0.22)] rounded-xl px-3 py-2 text-sm font-semibold text-neutral-700 bg-white focus:outline-none">
              <option value="">Department</option>
              {uniqueDepartments.map(dept => <option key={dept} value={dept}>{dept}</option>)}
            </select>
            <select value={selectedMeetingFilter} onChange={e => setSelectedMeetingFilter(e.target.value)} className="border border-[rgba(218,119,86,0.22)] rounded-xl px-3 py-2 text-sm font-semibold text-neutral-700 bg-white focus:outline-none">
              <option value="">Meeting</option>
              <option value="HOD Huddle">HOD Huddle</option>
              <option value="General Standup">General Standup</option>
            </select>
            <button onClick={() => setIsGrouped(!isGrouped)} className={cn(
              "flex items-center gap-2 px-4 py-2 border rounded-xl text-sm font-bold transition-colors",
              isGrouped ? 'bg-[rgba(218,119,86,0.1)] border-[rgba(218,119,86,0.3)] text-[#DA7756]' : 'bg-white text-neutral-700 border-[rgba(218,119,86,0.22)] hover:bg-[#fef6f4]'
            )}>
              <div className={cn("w-3 h-3 rounded-full", isGrouped ? 'bg-[#DA7756]' : 'border-2 border-neutral-400')} /> Group by Dept
            </button>
            <button className="p-2 border border-[rgba(218,119,86,0.22)] rounded-xl text-neutral-500 hover:bg-[#fef6f4] transition-colors bg-white">
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto bg-white">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#fef6f4] border-y border-[rgba(218,119,86,0.15)]">
                {['Date ↑↓', 'User ↑↓', 'Score ↑↓', 'Department ↑↓', 'Highlights', 'Submitted At ↑↓', 'Actions'].map(h => (
                  <th key={h} className={cn("p-3 text-xs font-bold text-neutral-500 uppercase tracking-wider", h === 'Actions' ? 'text-center' : '')}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredLogs.length === 0 ? (
                <tr><td colSpan={7} className="text-center p-8 text-sm font-semibold text-neutral-400 bg-[#fef6f4]">No reports found matching your criteria.</td></tr>
              ) : !isGrouped ? (
                filteredLogs.map(renderTableRow)
              ) : (
                sortedDepts.map(dept => (
                  <React.Fragment key={dept}>
                    <tr className="bg-[rgba(218,119,86,0.06)] border-b border-[rgba(218,119,86,0.1)]">
                      <td colSpan={7} className="p-2 px-4 text-sm font-bold text-neutral-800">{dept} <span className="text-[#DA7756] ml-1">({groupedLogs[dept].length})</span></td>
                    </tr>
                    {groupedLogs[dept].map(renderTableRow)}
                  </React.Fragment>
                ))
              )}
            </tbody>
          </table>
        </div>
      </SectionCard>

      {/* Report Detail Modal */}
      {selectedReport && (
        <div className="fixed inset-0 z-[9990] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] flex flex-col overflow-hidden border border-[rgba(218,119,86,0.2)]">
            <div className="flex items-center justify-between p-4 border-b border-[rgba(218,119,86,0.15)] bg-[#fef6f4]">
              <div>
                <h3 className="text-lg font-bold text-neutral-900">Daily Report Details</h3>
                <p className="text-xs font-semibold text-neutral-500 mt-1">Report for {selectedReport.user} • {selectedReport.date}</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <div className="text-xs text-neutral-500 font-semibold mb-0.5">Submitted At</div>
                  <div className="text-xs text-neutral-800 font-bold whitespace-pre-line">{selectedReport.submittedAt}</div>
                </div>
                <button onClick={() => { setSelectedReport(null); setActiveAction(null); }} className="p-2 hover:bg-[rgba(218,119,86,0.1)] rounded-full transition-colors">
                  <X className="w-5 h-5 text-neutral-600" />
                </button>
              </div>
            </div>

            <div className="p-6 flex-1 overflow-y-auto bg-[#f6f4ee]">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { title: 'Tasks & Issues', icon: AlertTriangle, color: 'red', items: [
                    { text: 'Shwan has been irresponsive on the webpage, slow and absent to connect almost every alternate day', badge: 'Issue', badgeColor: 'red' },
                    { text: 'Adoption of PATM in Lockated', badge: 'Task', badgeColor: 'blue' },
                  ]},
                  { title: 'Accomplishments', icon: CheckCircle2, color: 'green', items: [
                    { text: 'ISO IT Documentation Meet with Matrix3D and Kunal & Mahi sir' },
                  ]},
                  { title: "Tomorrow's Plan", icon: FileText, color: 'amber', items: [
                    { text: "CEO's Dashboard, SPOC refinement" },
                  ]},
                ].map(({ title, icon: Icon, color, items }) => (
                  <div key={title} className={cn("bg-white rounded-2xl shadow-sm border-t-4 p-4 border-x border-b border-neutral-100",
                    color === 'red' ? 'border-t-red-400' : color === 'green' ? 'border-t-green-500' : 'border-t-amber-400'
                  )}>
                    <h4 className={cn("flex items-center gap-2 font-bold mb-4 pb-2 border-b border-neutral-100",
                      color === 'red' ? 'text-red-600' : color === 'green' ? 'text-green-600' : 'text-amber-600'
                    )}>
                      <Icon className="w-4 h-4" /> {title}
                    </h4>
                    <ul className="space-y-3">
                      {items.map((item, i) => (
                        <li key={i} className="flex items-start gap-3 text-sm text-neutral-800 font-medium">
                          <div className="w-1.5 h-1.5 rounded-full mt-2 shrink-0 bg-neutral-300" />
                          <span>{item.text}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-4 border-t border-[rgba(218,119,86,0.15)] bg-white">
              <div className="text-xs font-bold text-neutral-500 uppercase tracking-wider mb-3">Quick Actions</div>
              {(!activeAction) ? (
                <div className="flex items-center gap-3 flex-wrap">
                  <button onClick={() => setActiveAction('task')} className="flex items-center gap-2 px-4 py-2 bg-white border border-[rgba(218,119,86,0.22)] hover:bg-[#fef6f4] text-neutral-700 text-sm font-bold rounded-xl transition-colors"><Plus className="w-4 h-4 text-[#DA7756]" /> Task</button>
                  <button onClick={() => setActiveAction('issue')} className="flex items-center gap-2 px-4 py-2 bg-white border border-[rgba(218,119,86,0.22)] hover:bg-[#fef6f4] text-neutral-700 text-sm font-bold rounded-xl transition-colors"><Plus className="w-4 h-4 text-red-500" /> Stuck Issue</button>
                  <button onClick={() => setActiveAction('plan')} className="flex items-center gap-2 px-4 py-2 bg-white border border-[rgba(218,119,86,0.22)] hover:bg-[#fef6f4] text-neutral-700 text-sm font-bold rounded-xl transition-colors"><Plus className="w-4 h-4 text-amber-500" /> Add to Plan</button>
                  <button onClick={() => setActiveAction('feedback')} className="flex items-center gap-2 px-4 py-2 bg-[#DA7756] hover:bg-[#c9674a] text-white text-sm font-bold rounded-xl transition-colors ml-auto"><Star className="w-4 h-4" /> Feedback</button>
                </div>
              ) : (
                <div className="bg-[#fef6f4] p-3 rounded-xl border border-[rgba(218,119,86,0.22)]">
                  {activeAction === 'issue' && (
                    <div className="flex gap-2 items-center">
                      <input type="text" placeholder="Enter stuck issue..." className="flex-1 border border-[rgba(218,119,86,0.22)] rounded-xl p-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[rgba(218,119,86,0.3)]" autoFocus />
                      <button className="px-4 py-2.5 bg-red-500 text-white text-sm font-bold rounded-xl hover:bg-red-600">Add</button>
                      <button onClick={() => setActiveAction(null)} className="px-4 py-2.5 text-neutral-600 text-sm font-bold hover:bg-[rgba(218,119,86,0.1)] rounded-xl">Cancel</button>
                    </div>
                  )}
                  {activeAction === 'plan' && (
                    <div className="flex gap-2 items-center">
                      <input type="text" placeholder="Add to tomorrow's plan..." className="flex-1 border border-[rgba(218,119,86,0.22)] rounded-xl p-2.5 text-sm bg-white focus:outline-none" autoFocus />
                      <button className="px-4 py-2.5 bg-amber-500 text-white text-sm font-bold rounded-xl hover:bg-amber-600">Add</button>
                      <button onClick={() => setActiveAction(null)} className="px-4 py-2.5 text-neutral-600 text-sm font-bold hover:bg-[rgba(218,119,86,0.1)] rounded-xl">Cancel</button>
                    </div>
                  )}
                  {activeAction === 'feedback' && (
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-sm font-bold text-neutral-700">Rating (1–5 stars)</span>
                        <div className="flex gap-1 text-neutral-300">
                          {[1,2,3,4,5].map(n => (
                            <Star key={n} className={cn("w-5 h-5 cursor-pointer hover:text-amber-400", n <= 2 ? 'text-amber-400 fill-amber-400' : '')} fill="currentColor" />
                          ))}
                        </div>
                      </div>
                      <textarea placeholder="Enter constructive feedback..." className="w-full border border-[rgba(218,119,86,0.22)] rounded-xl p-3 text-sm h-20 bg-white focus:outline-none focus:ring-2 focus:ring-[rgba(218,119,86,0.3)]" autoFocus />
                      <div className="flex gap-2">
                        <button className="px-4 py-2 bg-[#DA7756] text-white text-sm font-bold rounded-xl hover:bg-[#c9674a]">Add Feedback</button>
                        <button onClick={() => setActiveAction(null)} className="px-4 py-2 text-neutral-600 text-sm font-bold hover:bg-[rgba(218,119,86,0.1)] rounded-xl">Cancel</button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Task Creation Modal */}
      {activeAction === 'task' && selectedReport && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border border-[rgba(218,119,86,0.2)]">
            <div className="flex justify-between items-center p-4 border-b border-[rgba(218,119,86,0.15)] bg-[#fef6f4]">
              <h5 className="font-bold text-md text-neutral-900 flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#DA7756]" /> Add Task for {selectedReport.user}
              </h5>
              <button onClick={() => setActiveAction(null)} className="text-neutral-400 hover:text-neutral-600 p-1 bg-white hover:bg-[rgba(218,119,86,0.1)] rounded-full"><X className="w-4 h-4" /></button>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="text-xs font-bold text-neutral-700 mb-1 block">Task Title *</label>
                <input type="text" placeholder="What needs to be done?" className="w-full border border-[rgba(218,119,86,0.22)] rounded-xl p-2.5 text-sm bg-[#fef6f4] focus:outline-none focus:ring-2 focus:ring-[rgba(218,119,86,0.3)]" autoFocus />
              </div>
              <div>
                <label className="text-xs font-bold text-neutral-700 mb-1 block">Description</label>
                <textarea placeholder="Additional details..." className="w-full border border-[rgba(218,119,86,0.22)] rounded-xl p-2.5 text-sm h-24 resize-none bg-[#fef6f4] focus:outline-none" />
              </div>
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="text-xs font-bold text-neutral-700 mb-1 block">Priority</label>
                  <select className="w-full border border-[rgba(218,119,86,0.22)] rounded-xl p-2.5 text-sm bg-white focus:outline-none">
                    <option>Low</option><option>Medium</option><option>High</option>
                  </select>
                </div>
                <div className="flex-1">
                  <label className="text-xs font-bold text-neutral-700 mb-1 block">Due Date *</label>
                  <input type="date" className="w-full border border-[rgba(218,119,86,0.22)] rounded-xl p-2.5 text-sm text-neutral-600 bg-white focus:outline-none" />
                </div>
              </div>
              <div className="pt-2">
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs font-bold text-neutral-700">Progress</label>
                  <span className="text-xs font-bold text-[#DA7756]">0%</span>
                </div>
                <input type="range" min="0" max="100" defaultValue="0" className="w-full cursor-pointer" style={{ accentColor: C.primary }} />
              </div>
            </div>
            <div className="p-4 border-t border-[rgba(218,119,86,0.15)] bg-[#fef6f4] flex justify-end gap-3">
              <button onClick={() => setActiveAction(null)} className="px-4 py-2.5 text-sm font-bold text-neutral-600 hover:bg-[rgba(218,119,86,0.1)] rounded-xl transition-colors">Cancel</button>
              <button className="px-5 py-2.5 text-sm font-bold bg-[#DA7756] hover:bg-[#c9674a] text-white rounded-xl transition-colors flex items-center gap-2">
                <Plus className="w-4 h-4" /> Create Task
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ─────────────────────────────────────────────
// Sub-component: History Tab
// ─────────────────────────────────────────────
const HistoryTab = () => {
  const [dateOffset, setDateOffset] = useState(0);

  const baseDate = new Date(2026, 2, 30);
  const currentDate = new Date(baseDate);
  currentDate.setDate(currentDate.getDate() + dateOffset);

  const formatDDMMYYYY = (date) => {
    const d = String(date.getDate()).padStart(2, '0');
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const y = date.getFullYear();
    return `${d}-${m}-${y}`;
  };

  const formatMMM_DD_YYYY = (date) => {
    const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
  };

  const formatDD_MMM_YY = (date) => {
    const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    return `${date.getDate()} ${months[date.getMonth()]} ${String(date.getFullYear()).slice(2)}`;
  };

  const dateStr = formatDDMMYYYY(currentDate);

  const historyDataMap = {
    '30-03-2026': { type: 'missed',    missedCount: 1, doneCount: 0, meeting: 'HOD Huddle' },
    '29-03-2026': { type: 'empty' },
    '27-03-2026': { type: 'completed', meeting: 'HOD Huddle', attendees: 11, submittedAt: '30 Mar 26, 10:27 AM IST' },
    '26-03-2026': { type: 'completed', meeting: 'HOD Huddle', attendees: 11, submittedAt: '27 Mar 26, 9:57 AM IST'  },
    '25-03-2026': { type: 'missed',    missedCount: 1, doneCount: 0, meeting: 'HOD Huddle' },
    '23-03-2026': { type: 'completed', meeting: 'HOD Huddle', attendees: 12, submittedAt: '24 Mar 26, 10:39 AM IST' },
  };

  const currentData = historyDataMap[dateStr] || { type: 'empty' };

  return (
    <div className="animate-fade-in pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl font-bold text-neutral-900">Daily Meeting History</h2>
          <p className="text-sm text-neutral-500 mt-1">View and edit past daily meeting reports</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <select className="appearance-none bg-white border border-[rgba(218,119,86,0.22)] rounded-xl py-2 pl-4 pr-10 text-sm font-semibold text-neutral-700 focus:outline-none focus:ring-2 focus:ring-[rgba(218,119,86,0.3)]">
              <option>All Meetings</option>
              <option>HOD Huddle</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none" size={16} />
          </div>

          <button onClick={() => setDateOffset(prev => prev - 1)} className="p-2 border border-[rgba(218,119,86,0.22)] rounded-xl bg-white text-[#DA7756] hover:bg-[#fef6f4] transition-colors">
            <ChevronLeft size={16} />
          </button>

          <div className="px-4 py-2 border border-[rgba(218,119,86,0.22)] rounded-xl bg-white flex items-center gap-3 text-sm font-semibold text-neutral-700">
            {dateStr}
            <CalendarIcon size={16} className="text-[#DA7756]" />
          </div>

          <button onClick={() => setDateOffset(prev => prev + 1)} className="p-2 border border-[rgba(218,119,86,0.22)] rounded-xl bg-white text-[#DA7756] hover:bg-[#fef6f4] transition-colors">
            <ChevronRight size={16} />
          </button>

          <button className="flex items-center gap-2 px-4 py-2 border border-[rgba(218,119,86,0.22)] rounded-xl bg-white text-sm font-semibold text-neutral-700 hover:bg-[#fef6f4] transition-colors">
            <RefreshCw size={16} className="text-[#DA7756]" /> Refresh
          </button>
        </div>
      </div>

      {currentData.type === 'missed' && (
        <div className="animate-fade-in space-y-4">
          <SectionCard>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="text-[#DA7756] font-bold mb-3 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4" />
                  Missed Meetings on {formatMMM_DD_YYYY(currentDate)} (1):
                </div>
                <span className="bg-[#DA7756] text-white text-xs font-bold px-3 py-1.5 rounded-xl shadow-sm">
                  {currentData.meeting}
                </span>
              </div>
              <div className="flex items-center gap-4 text-sm font-bold text-neutral-600">
                <div className="flex items-center gap-2">Done: <span className="bg-green-500 text-white px-2 py-0.5 rounded-lg">{currentData.doneCount}</span></div>
                <div className="flex items-center gap-2">Missed: <span className="bg-red-500 text-white px-2 py-0.5 rounded-lg">{currentData.missedCount}</span></div>
              </div>
            </div>
          </SectionCard>
          <div className="flex flex-col items-center justify-center py-16 text-neutral-400">
            <HistoryIcon size={64} className="mb-4 opacity-30" strokeWidth={1.5} />
            <h3 className="text-sm font-semibold text-neutral-500">No meeting history found for the selected filters</h3>
          </div>
        </div>
      )}

      {currentData.type === 'empty' && (
        <div className="flex flex-col items-center justify-center py-32 text-neutral-400 animate-fade-in">
          <HistoryIcon size={64} className="mb-4 opacity-30" strokeWidth={1.5} />
          <h3 className="text-sm font-semibold text-neutral-500">No meeting history found for the selected filters</h3>
        </div>
      )}

      {currentData.type === 'completed' && (
        <SectionCard className="p-0 overflow-hidden animate-fade-in">
          <div className="p-6 bg-[#DA7756] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h3 className="text-2xl font-bold text-white mb-3">{currentData.meeting} for {formatDD_MMM_YY(currentDate)}</h3>
              <div className="flex items-center gap-3 mb-2">
                <span className="bg-white text-[#DA7756] text-xs font-bold px-2.5 py-1 rounded-lg">completed</span>
                <span className="text-sm font-semibold text-white/90">{currentData.attendees} attendees</span>
              </div>
              <div className="text-xs font-medium text-white/70">Submitted: {currentData.submittedAt}</div>
            </div>
            <div className="flex items-center gap-2">
              <button className="flex items-center gap-1.5 border border-white/30 bg-white/10 hover:bg-white/20 px-3 py-2 rounded-xl text-sm font-semibold text-white transition-colors">
                <Sparkles size={16} /> Generate AI
              </button>
              <button className="flex items-center gap-1.5 border border-white/30 bg-white/10 hover:bg-white/20 px-3 py-2 rounded-xl text-sm font-semibold text-white transition-colors">
                <Edit size={16} /> Edit
              </button>
              <button className="border border-white/30 bg-white/10 hover:bg-white/20 p-2 rounded-xl transition-colors text-white">
                <Trash size={16} />
              </button>
            </div>
          </div>
          <div className="bg-white p-5 flex items-center justify-between cursor-pointer hover:bg-[#fef6f4] transition-colors">
            <div className="flex items-center gap-2 font-bold text-neutral-700 text-base">
              <FileText size={20} className="text-[#DA7756]" /> Raw Meeting Notes
            </div>
            <ChevronDown className="text-neutral-400" />
          </div>
        </SectionCard>
      )}
    </div>
  );
};

// ─────────────────────────────────────────────
// Sub-component: Reports Tab
// ─────────────────────────────────────────────
const ReportsTab = () => {
  const [isKPIExpanded, setIsKPIExpanded] = useState(false);

  const lastWeekDates = [
    { day: 'Wed', date: 18 }, { day: 'Thu', date: 19 }, { day: 'Fri', date: 20 },
    { day: 'Sat', date: 21 }, { day: 'Sun', date: 22 }, { day: 'Mon', date: 23 },
    { day: 'Tue', date: 24 },
  ];

  const StatCard = ({ title, value, sub, icon: Icon, bgClass }) => (
    <Card className={cn("border-0 shadow-md rounded-2xl p-5", bgClass)}>
      <div className="flex flex-col items-center text-center">
        <Icon className="mb-3 h-7 w-7 opacity-70" />
        <p className="text-3xl font-bold tabular-nums text-neutral-900">{value}</p>
        <p className="mt-1 text-xs font-semibold text-neutral-700">{title}</p>
        <p className="mt-0.5 text-xs text-neutral-500">{sub}</p>
      </div>
    </Card>
  );

  return (
    <div className="animate-fade-in space-y-6">
      {/* Missed alert */}
      <SectionCard>
        <div className="flex items-center gap-2 text-[#DA7756] font-bold mb-3">
          <AlertTriangle size={18} /> Missed Meetings This Week (2)
        </div>
        <button className="bg-[rgba(218,119,86,0.1)] border border-[rgba(218,119,86,0.3)] text-[#DA7756] text-xs font-bold py-1.5 px-3 rounded-xl hover:bg-[rgba(218,119,86,0.2)] transition-colors">HOD Huddle (2)</button>
      </SectionCard>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-neutral-900">Meeting Reports & Analytics</h2>
          <p className="text-sm text-neutral-500 mt-1">Comprehensive insights for all daily meetings</p>
        </div>
        <div className="flex items-center gap-3">
          <select className="bg-white border border-[rgba(218,119,86,0.22)] rounded-xl py-2 px-4 text-sm font-bold text-neutral-700 focus:outline-none">
            <option>HOD Huddle</option><option>All Meetings</option>
          </select>
          <select className="bg-white border border-[rgba(218,119,86,0.22)] rounded-xl py-2 px-4 text-sm font-bold text-neutral-700 focus:outline-none">
            <option>Last 7 Days</option><option>Last 14 Days</option><option>Last 30 Days</option>
          </select>
        </div>
      </div>

      {/* HOD Huddle card */}
      <SectionCard className="p-0 overflow-hidden">
        <div className="p-5 bg-[#DA7756] flex justify-between items-start">
          <div>
            <h2 className="text-xl font-bold text-white">HOD Huddle</h2>
            <div className="flex gap-2 mt-2">
              <span className="text-xs bg-white/20 px-2 py-1 rounded-lg font-semibold text-white border border-white/20">Head: Unknown</span>
              <span className="text-xs bg-white/20 px-2 py-1 rounded-lg font-semibold text-white border border-white/20">0 Members</span>
            </div>
          </div>
          <button className="p-2 hover:bg-white/10 rounded-xl transition-colors text-white"><CalendarIcon size={22} /></button>
        </div>

        <div className="p-6 bg-white">
          <div className="font-bold text-neutral-700 mb-6 border-b border-[rgba(218,119,86,0.1)] pb-4">Team Members</div>

          {/* Meeting status week grid */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4 bg-[#fef6f4] p-3 rounded-xl border border-[rgba(218,119,86,0.15)]">
              <h3 className="flex items-center gap-2 font-bold text-neutral-700 text-sm"><Calendar size={16} className="text-[#DA7756]" /> Meeting Status (1 week ago)</h3>
              <div className="flex gap-1">
                <button className="p-1 border border-[rgba(218,119,86,0.22)] rounded-lg text-neutral-500 bg-white hover:bg-[#fef6f4]"><ArrowLeft size={14} /></button>
                <button className="p-1 border border-[rgba(218,119,86,0.22)] rounded-lg text-neutral-500 bg-white hover:bg-[#fef6f4]"><ArrowRight size={14} /></button>
              </div>
            </div>
            <div className="grid grid-cols-7 gap-3">
              {lastWeekDates.map(d => (
                <div key={d.date} className="flex flex-col items-center p-3 rounded-xl border border-red-200 bg-red-50 text-red-500">
                  <span className="text-xs font-bold uppercase tracking-wider">{d.day}</span>
                  <span className="text-xl font-extrabold my-1">{d.date}</span>
                  <span className="text-[10px] font-bold uppercase italic">X</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-center gap-6 text-xs font-bold text-neutral-500 uppercase tracking-wider mb-8 border-b border-neutral-100 pb-8">
            {[['#22c55e', 'Meeting Done'], ['#ef4444', 'Missed'], ['#60a5fa', 'Holiday']].map(([color, label]) => (
              <span key={label} className="flex items-center gap-1.5"><div className="w-3 h-3 rounded" style={{ background: color }} /> {label}</span>
            ))}
          </div>

          {/* Stat cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatCard title="Meetings This Month" value="2"       sub="19 missed of 21 working days" icon={Calendar}      bgClass="bg-sky-100/90" />
            <StatCard title="Attendance Rate"      value="0.0%"   sub="0/22 attended"                icon={TrendingUp}    bgClass="bg-[#E3F4E8]" />
            <StatCard title="Avg Self-Rating"      value="8.6/10" sub="7 ratings"                    icon={Star}          bgClass="bg-violet-100/90" />
            <StatCard title="Unresolved Issues"    value="0"      sub="stuck issues"                 icon={AlertTriangle} bgClass="bg-orange-100/90" />
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {[
              { title: 'Attendance Trend', key: 'attendance', color: '#DA7756', gradId: 'gradAtt' },
              { title: 'KPI Achievement Trend', key: 'kpi', color: '#22c55e', gradId: 'gradKPI' },
            ].map(({ title, key, color, gradId }) => (
              <SectionCard key={title}>
                <div className="flex items-center gap-2 mb-4 font-semibold text-neutral-700 text-sm"><TrendingUp size={16} className="text-[#DA7756]" /> {title}</div>
                <ResponsiveContainer width="100%" height={200}>
                  <AreaChart data={trendData} margin={{ top: 5, right: 0, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%"  stopColor={color} stopOpacity={0.2} />
                        <stop offset="95%" stopColor={color} stopOpacity={0}   />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#a3a3a3' }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#a3a3a3' }} domain={[0, 100]} />
                    <Tooltip />
                    <Area type="monotone" dataKey={key} stroke={color} strokeWidth={2} fillOpacity={1} fill={`url(#${gradId})`} dot={{ r: 3, fill: color }} activeDot={{ r: 5 }} />
                  </AreaChart>
                </ResponsiveContainer>
              </SectionCard>
            ))}
          </div>

          {/* KPI Table */}
          <SectionCard className="p-0 overflow-hidden">
            <div className="bg-[#fef6f4] p-4 flex justify-between items-center cursor-pointer hover:bg-[rgba(218,119,86,0.08)] transition-colors" onClick={() => setIsKPIExpanded(!isKPIExpanded)}>
              <div className="flex items-center gap-3">
                <TrendingUp className="text-[#DA7756]" size={18} />
                <span className="font-bold text-neutral-700 text-sm">Team Member KPIs</span>
                <span className="bg-[rgba(218,119,86,0.15)] text-[#DA7756] text-[10px] font-black px-2 py-0.5 rounded-lg">11 KPIs</span>
              </div>
              <ChevronDown className={cn("text-neutral-400 transition-transform duration-300", isKPIExpanded ? 'rotate-180' : '')} size={18} />
            </div>
            {isKPIExpanded && (
              <div className="divide-y divide-[rgba(218,119,86,0.08)] bg-white">
                {teamKPIs.map((member, i) => (
                  <div key={i} className="p-4 flex flex-col md:flex-row md:items-center justify-between hover:bg-[#fef6f4] transition-colors gap-4">
                    <div className="flex-1">
                      <div className="font-semibold text-neutral-800 text-sm">{member.name}</div>
                      {member.detail
                        ? <div className="mt-1 text-xs text-neutral-500 font-semibold">{member.detail}</div>
                        : <div className="text-xs text-neutral-400 mt-0.5">No KPIs assigned</div>
                      }
                    </div>
                    <span className={cn("text-xs font-black px-3 py-1 rounded-xl border", member.kpis > 0 ? 'border-[rgba(218,119,86,0.3)] bg-[rgba(218,119,86,0.1)] text-[#DA7756]' : 'border-neutral-200 bg-white text-neutral-400')}>
                      {member.kpis} KPIs
                    </span>
                  </div>
                ))}
              </div>
            )}
          </SectionCard>
        </div>
      </SectionCard>
    </div>
  );
};

// ─────────────────────────────────────────────
// Sub-component: Analytics Tab
// ─────────────────────────────────────────────
const CustomAnalyticsTooltip = ({ active, payload, label }) => {
  if (!active || !payload || !payload.length) return null;
  return (
    <div className="bg-white border border-[rgba(218,119,86,0.22)] p-3 rounded-xl shadow-lg text-sm font-semibold">
      <div className="text-neutral-500 mb-2">{label}</div>
      {payload.map((entry, i) => <div key={i} className="flex items-center gap-2 mb-1" style={{ color: entry.color }}>{entry.name}: {entry.value}</div>)}
    </div>
  );
};

const AnalyticsTab = () => {
  const [timeFilter, setTimeFilter] = useState('Last 14 Days');

  const KPICard = ({ title, value, icon: Icon, bgClass }) => (
    <Card className={cn("border-0 shadow-md rounded-2xl p-5", bgClass)}>
      <div className="flex flex-col items-center text-center">
        <Icon className="mb-3 h-7 w-7 opacity-70" />
        <p className="text-3xl font-bold tabular-nums text-neutral-900">{value}</p>
        <p className="mt-1 text-xs font-medium text-neutral-600">{title}</p>
      </div>
    </Card>
  );

  return (
    <div className="animate-fade-in pb-12 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h2 className="text-2xl font-bold text-neutral-900">Team Analytics</h2>
        <div className="relative">
          <select value={timeFilter} onChange={e => setTimeFilter(e.target.value)} className="appearance-none bg-white border border-[rgba(218,119,86,0.22)] rounded-xl py-2 pl-4 pr-10 text-sm font-bold text-neutral-700 focus:outline-none shadow-sm">
            <option>Last 7 Days</option><option>Last 14 Days</option><option>Last 30 Days</option>
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none" size={16} />
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard title="Total Users"      value="0" icon={Users}         bgClass="bg-sky-100/90"      />
        <KPICard title="Active Reporters" value="0" icon={TrendingUp}    bgClass="bg-[#E3F4E8]"       />
        <KPICard title="Lagging"          value="0" icon={TrendingDown}  bgClass="bg-orange-100/90"   />
        <KPICard title="Not Reporting"    value="0" icon={AlertTriangle} bgClass="bg-violet-100/90"   />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SectionCard>
          <div className="flex items-center gap-2 mb-4 font-semibold text-neutral-700 text-sm"><Activity size={16} className="text-[#DA7756]" /> Daily Activity Trend</div>
          <ResponsiveContainer width="100%" height={250}>
            <ReLineChart data={analyticsActivityData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={true} stroke="#e2e8f0" />
              <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#a3a3a3' }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#a3a3a3' }} domain={[0, 24]} />
              <Tooltip content={<CustomAnalyticsTooltip />} />
              <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '12px', fontWeight: 'bold', color: '#737373' }} />
              <Line type="monotone" dataKey="reports"         name="Reports"        stroke="#DA7756" strokeWidth={2} dot={{ r: 3, fill: '#DA7756' }} activeDot={{ r: 6 }} />
              <Line type="monotone" dataKey="accomplishments" name="Accomplishments" stroke="#22c55e" strokeWidth={2} dot={{ r: 3, fill: '#22c55e' }} activeDot={{ r: 6 }} />
              <Line type="monotone" dataKey="stuck"           name="Stuck Issues"   stroke="#eab308" strokeWidth={2} dot={{ r: 3, fill: '#eab308' }} activeDot={{ r: 6 }} />
            </ReLineChart>
          </ResponsiveContainer>
        </SectionCard>
        <SectionCard>
          <div className="flex items-center gap-2 mb-4 font-semibold text-neutral-700 text-sm"><Users size={16} className="text-[#DA7756]" /> Department Performance</div>
          <div className="flex-1 border-2 border-dashed border-[rgba(218,119,86,0.22)] rounded-xl flex items-center justify-center min-h-[200px]">
            <p className="text-xs text-neutral-400 font-semibold">No data available</p>
          </div>
        </SectionCard>
      </div>

      {/* Department Summary */}
      <SectionCard>
        <div className="flex items-center gap-2 mb-6 font-bold text-neutral-900 text-lg">
          <Building2 size={20} className="text-[#DA7756]" /> Department Reporting Summary
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {departmentsList.map((dept, idx) => (
            <div key={idx} className="bg-white border border-[rgba(218,119,86,0.15)] rounded-2xl p-4 shadow-sm relative flex flex-col justify-between min-h-[130px] hover:shadow-md transition-shadow">
              <div className="absolute top-4 right-4 bg-[#DA7756] text-white text-[10px] font-black px-2 py-0.5 rounded-lg">0%</div>
              <div className="mb-4 pr-10">
                <h4 className="font-bold text-neutral-800 text-sm">{dept}</h4>
                <p className="text-xs text-neutral-400 font-semibold mt-0.5">0 members</p>
              </div>
              <div className="flex justify-between items-end border-t border-[rgba(218,119,86,0.1)] pt-3">
                {[['TODAY'], ['THIS WEEK']].map(([label]) => (
                  <div key={label}>
                    <div className="text-[10px] font-bold text-neutral-400 mb-1">{label}</div>
                    <div className="flex items-baseline gap-2">
                      <div className="flex flex-col items-center"><span className="text-lg font-black text-green-500 leading-none">0</span><span className="text-[9px] font-bold text-neutral-400">Done</span></div>
                      <div className="flex flex-col items-center"><span className="text-lg font-black text-red-500 leading-none">0</span><span className="text-[9px] font-bold text-neutral-400">Pending</span></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  );
};

// ─────────────────────────────────────────────
// Sub-component: Settings Tab
// ─────────────────────────────────────────────
const SettingsTab = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode,   setModalMode]   = useState('create');
  const [isMenuOpen,  setIsMenuOpen]  = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setIsMenuOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const openCreateModal = () => { setModalMode('create'); setIsModalOpen(true); };
  const openEditModal   = () => { setModalMode('edit');   setIsModalOpen(true); setIsMenuOpen(false); };

  const daysOfWeek = [
    { label: 'Sun', active: false }, { label: 'Mon', active: true },
    { label: 'Tue', active: true  }, { label: 'Wed', active: true },
    { label: 'Thu', active: true  }, { label: 'Fri', active: true },
    { label: 'Sat', active: true  },
  ];

  return (
    <div className="animate-fade-in pb-12 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-neutral-900">Daily Meeting Configurations</h2>
          <p className="text-sm text-neutral-500 mt-1">Configure recurring daily meetings and their participants</p>
        </div>
        <button onClick={openCreateModal} className="flex items-center gap-2 bg-[#DA7756] hover:bg-[#c9674a] text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-sm transition-colors w-fit">
          <Plus size={18} strokeWidth={2.5} /> New Meeting
        </button>
      </div>

      <SectionCard>
        <div className="flex items-center gap-6 text-sm flex-wrap text-neutral-700 font-semibold">
          <div className="font-bold text-neutral-900">1 Active Meetings</div>
          <div className="text-neutral-500">11 Total Members</div>
          <div className="flex items-center gap-1.5 text-neutral-500 ml-auto"><Clock size={16} className="text-[#DA7756]" /> Next: We at 10:00</div>
        </div>
      </SectionCard>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={18} />
          <input type="text" placeholder="Search meetings..." className="w-full pl-10 pr-4 py-2.5 bg-white border border-[rgba(218,119,86,0.22)] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[rgba(218,119,86,0.3)] shadow-sm" />
        </div>
        <div className="relative w-full sm:w-64">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={18} />
          <select className="w-full appearance-none pl-10 pr-10 py-2.5 bg-white border border-[rgba(218,119,86,0.22)] rounded-xl text-sm font-semibold text-neutral-700 focus:outline-none focus:ring-2 focus:ring-[rgba(218,119,86,0.3)] shadow-sm">
            <option>All Heads</option>
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none" size={16} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white border border-[rgba(218,119,86,0.2)] rounded-2xl shadow-md p-5 relative flex flex-col hover:shadow-lg transition-shadow">
          <div className="flex justify-between items-start mb-4 relative" ref={menuRef}>
            <div>
              <h3 className="text-lg font-bold text-neutral-900 mb-2">HOD Huddle</h3>
              <div className="flex items-center gap-2 mb-3">
                <span className="flex items-center gap-1.5 bg-[rgba(218,119,86,0.1)] text-[#DA7756] text-xs font-bold px-2 py-1 rounded-lg border border-[rgba(218,119,86,0.2)]">
                  <Clock size={12} strokeWidth={3} /> 10:00
                </span>
              </div>
              <div className="flex gap-1.5 flex-wrap">
                <span className="text-[10px] font-bold text-neutral-400 px-1">Su</span>
                {['Mo','Tu','We','Th','Fr','Sa'].map(d => (
                  <span key={d} className="text-[10px] font-bold bg-[rgba(218,119,86,0.12)] text-[#DA7756] px-1.5 py-0.5 rounded-lg">{d}</span>
                ))}
              </div>
            </div>
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-1 text-neutral-400 hover:bg-[#fef6f4] rounded-xl transition-colors">
              <MoreHorizontal size={20} />
            </button>
            {isMenuOpen && (
              <div className="absolute right-0 top-8 bg-white border border-[rgba(218,119,86,0.2)] shadow-lg rounded-2xl w-32 py-1 z-10">
                <button onClick={openEditModal} className="w-full text-left px-4 py-2 text-sm font-semibold text-neutral-700 hover:bg-[#fef6f4] flex items-center gap-2"><Edit size={14} className="text-[#DA7756]" /> Edit</button>
                <button className="w-full text-left px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50 flex items-center gap-2"><Trash size={14} /> Delete</button>
              </div>
            )}
          </div>

          <div className="border-t border-[rgba(218,119,86,0.1)] my-4" />

          <div className="mb-4 flex-1">
            <div className="text-[10px] font-black text-neutral-400 uppercase tracking-widest mb-3">Meeting Head</div>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-8 h-8 rounded-full bg-[#DA7756] text-white flex items-center justify-center font-bold text-sm">?</div>
              <span className="font-bold text-neutral-800 text-sm">Unknown</span>
            </div>
            <div className="text-[10px] font-black text-neutral-400 uppercase tracking-widest mb-2">Members</div>
            <p className="text-xs text-neutral-400 italic">No members assigned</p>
          </div>

          <div className="border-t border-[rgba(218,119,86,0.1)] my-4" />

          <div className="mb-5">
            <div className="text-[10px] font-black text-neutral-400 uppercase tracking-widest mb-3">This Week</div>
            <div className="flex gap-2">
              {[
                { lbl: 'M', status: 'missed'   }, { lbl: 'T', status: 'upcoming' },
                { lbl: 'W', status: 'upcoming' }, { lbl: 'T', status: 'off'      },
                { lbl: 'F', status: 'off'      }, { lbl: 'S', status: 'off'      },
                { lbl: 'S', status: 'off'      },
              ].map(({ lbl, status }, i) => (
                <div key={i} className={cn("flex flex-col items-center gap-1", status === 'off' ? 'opacity-40' : '')}>
                  <span className="text-[10px] font-bold text-neutral-500">{lbl}</span>
                  <div className={cn("w-6 h-6 rounded-lg flex items-center justify-center border",
                    status === 'missed' ? 'bg-red-50 border-red-200' : 'bg-[#fef6f4] border-[rgba(218,119,86,0.2)]'
                  )}>
                    {status !== 'off' && <div className={cn("w-2 h-2 rounded-full", status === 'missed' ? 'bg-red-500' : 'bg-[rgba(218,119,86,0.4)]')} />}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="inline-flex w-fit items-center px-3 py-1 rounded-xl bg-[rgba(218,119,86,0.1)] border border-[rgba(218,119,86,0.25)] text-[#DA7756] text-[11px] font-bold">
            Default Meeting
          </div>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-[500px] flex flex-col relative border border-[rgba(218,119,86,0.2)]">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 p-1 text-neutral-400 hover:bg-[#fef6f4] rounded-full transition-colors"><X size={20} /></button>
            <div className="p-6 pb-4">
              <h3 className="text-xl font-bold text-neutral-900 mb-2">
                {modalMode === 'create' ? 'Create Meeting Configuration' : 'Edit Meeting Configuration'}
              </h3>
              <p className="text-sm text-neutral-500 mb-6">
                Configure a recurring daily meeting. This will auto-select when the meeting head logs in to record minutes.
              </p>
              <div className="space-y-5">
                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="block text-xs font-bold text-neutral-700 mb-1.5">Meeting Name <span className="text-red-500">*</span></label>
                    <input type="text" defaultValue={modalMode === 'edit' ? 'HOD Huddle' : ''} placeholder="e.g., Sales Team Daily Stand-up" className="w-full px-3 py-2 bg-[#fef6f4] border border-[rgba(218,119,86,0.22)] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[rgba(218,119,86,0.3)]" />
                  </div>
                  <div className="w-32">
                    <label className="block text-xs font-bold text-neutral-700 mb-1.5">Meeting Time</label>
                    <input type="time" defaultValue={modalMode === 'edit' ? '10:00' : ''} className="w-full px-3 py-2 bg-[#fef6f4] border border-[rgba(218,119,86,0.22)] rounded-xl text-sm focus:outline-none" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-2">Meeting Days</label>
                  <div className="flex flex-wrap gap-2 mb-1">
                    {daysOfWeek.map(day => (
                      <button key={day.label} className={cn("px-3 py-1.5 rounded-xl text-sm font-bold transition-colors",
                        day.active ? 'bg-[#DA7756] text-white' : 'bg-neutral-100 text-neutral-600 border border-neutral-200 hover:bg-[#fef6f4]'
                      )}>
                        {day.label}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1.5">Meeting Head <span className="text-red-500">*</span></label>
                  <select className="w-full appearance-none pl-3 pr-10 py-2.5 bg-[#fef6f4] border border-[rgba(218,119,86,0.22)] rounded-xl text-sm text-neutral-700 focus:outline-none">
                    <option>Select meeting head</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1.5">Department (Optional)</label>
                  <select className="w-full appearance-none pl-3 pr-10 py-2.5 bg-[#fef6f4] border border-[rgba(218,119,86,0.22)] rounded-xl text-sm text-neutral-700 focus:outline-none">
                    <option>Select department</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1.5">Meeting Members</label>
                  <input type="text" placeholder="Search members..." className="w-full px-3 py-2.5 bg-[#fef6f4] border border-[rgba(218,119,86,0.22)] rounded-xl text-sm focus:outline-none" />
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <input type="checkbox" id="default-meeting" defaultChecked={modalMode === 'edit'} className="w-4 h-4 rounded border-[rgba(218,119,86,0.4)]" style={{ accentColor: C.primary }} />
                  <label htmlFor="default-meeting" className="text-sm font-bold text-neutral-800 cursor-pointer">Set as default meeting</label>
                </div>
              </div>
            </div>
            <div className="p-4 border-t border-[rgba(218,119,86,0.15)] flex justify-end gap-3 bg-[#fef6f4] rounded-b-2xl mt-2">
              <button onClick={() => setIsModalOpen(false)} className="px-5 py-2 text-sm font-bold text-neutral-600 hover:bg-[rgba(218,119,86,0.1)] rounded-xl transition-colors">Cancel</button>
              <button onClick={() => setIsModalOpen(false)} className="bg-[#DA7756] hover:bg-[#c9674a] text-white px-6 py-2 rounded-xl text-sm font-bold shadow-sm transition-colors">
                {modalMode === 'create' ? 'Create' : 'Update'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ─────────────────────────────────────────────
// Main Component
// ─────────────────────────────────────────────
const DailyMeeting = () => {
  const [activeTab,      setActiveTab]      = useState('Daily');
  const [selectedDateId, setSelectedDateId] = useState(1);

  return (
    <div className="min-h-screen px-4 py-6 sm:px-6 font-sans" style={{ background: '#f6f4ee', color: C.textMain }}>
      <div className="mx-auto max-w-6xl space-y-6">

        {/* Header */}
        <header className="flex flex-col gap-1 sm:flex-row sm:items-start sm:gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2 border-[#DA7756] bg-[#DA7756]/10 shadow-sm">
            <Calendar className="h-6 w-6 text-[#DA7756]" strokeWidth={2} />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-0.5">Team standup & accountability</p>
            <h1 className="text-2xl font-bold tracking-tight text-neutral-900 sm:text-3xl">Daily Meetings</h1>
          </div>
        </header>

        {/* Tabs */}
        <div className="flex space-x-1 border-b border-[rgba(218,119,86,0.2)] pb-0 overflow-x-auto">
          {tabs.map((tab) => {
            const Icon     = tab.icon;
            const isActive = activeTab === tab.name;
            return (
              <button
                key={tab.name}
                onClick={() => setActiveTab(tab.name)}
                className={cn(
                  "flex items-center gap-2 px-4 py-3 text-sm font-semibold transition-colors border-b-[3px] whitespace-nowrap",
                  isActive
                    ? "border-[#DA7756] text-[#DA7756] bg-[rgba(218,119,86,0.06)]"
                    : "border-transparent text-neutral-500 hover:text-[#DA7756] hover:bg-[rgba(218,119,86,0.04)]"
                )}
              >
                <Icon className="w-4 h-4" />
                {tab.name}
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        <div>
          {activeTab === 'Daily'     && <DailyTab     selectedDateId={selectedDateId} setSelectedDateId={setSelectedDateId} />}
          {activeTab === 'Daily Log' && <DailyLogTab  selectedDateId={selectedDateId} setSelectedDateId={setSelectedDateId} />}
          {activeTab === 'History'   && <HistoryTab   />}
          {activeTab === 'Reports'   && <ReportsTab   />}
          {activeTab === 'Analytics' && <AnalyticsTab />}
          {activeTab === 'Settings'  && <SettingsTab  />}
        </div>
      </div>
    </div>
  );
};

export default DailyMeeting;