import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
  Calendar, FileText, History as HistoryIcon, BarChart2, Settings,
  ChevronDown, AlertTriangle, FileSpreadsheet,
  Search, Eye, RefreshCw, X, Plus, Star,
  CheckCircle2, Circle, ArrowLeft, ArrowRight,
  TrendingUp, TrendingDown, Users, Target, CalendarIcon,
  Activity, Building2, MoreHorizontal, Clock, Filter,
  Edit, Trash, Info, Sparkles, ChevronLeft, ChevronRight,
  MessageSquare, LineChart, ChevronUp
} from 'lucide-react';
import {
  LineChart as ReLineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, AreaChart, Area, Legend
} from 'recharts';
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";

// ── Design Tokens ──
const C = {
  primary:     '#DA7756',
  primaryHov:  '#c9674a',
  primaryBg:   '#fef6f4',
  primaryTint: 'rgba(218,119,86,0.10)',
  primaryBord: 'rgba(218,119,86,0.22)',
  pageBg:      '#ffffff',
  textMain:    '#1a1a1a',
  textMuted:   '#6b7280',
  borderLgt:   '#e5e7eb',
  cardBg:      '#fff',
};

// ── Mock Data ──
const datesData = [
  { id: 1,  dateNum: '24', day: 'TUE', monthYear: 'Mar, 2026', status: 'missed',   label: 'Miss'    },
  { id: 2,  dateNum: '25', day: 'WED', monthYear: 'Mar, 2026', status: 'missed',   label: 'Miss'    },
  { id: 3,  dateNum: '26', day: 'THU', monthYear: 'Mar, 2026', status: 'done',     label: 'Done'    },
  { id: 4,  dateNum: '27', day: 'FRI', monthYear: 'Mar, 2026', status: 'done',     label: 'Done'    },
  { id: 5,  dateNum: '28', day: 'SAT', monthYear: 'Mar, 2026', status: 'holiday',  label: 'Holiday' },
  { id: 6,  dateNum: '29', day: 'SUN', monthYear: 'Mar, 2026', status: 'holiday',  label: 'Holiday' },
  { id: 7,  dateNum: '30', day: 'MON', monthYear: 'Mar, 2026', status: 'missed',   label: 'Miss'    },
  { id: 8,  dateNum: '31', day: 'TUE', monthYear: 'Mar, 2026', status: 'missed',   label: 'Miss'    },
  { id: 9,  dateNum: '01', day: 'WED', monthYear: 'Apr, 2026', status: 'upcoming', label: ''        },
  { id: 10, dateNum: '02', day: 'THU', monthYear: 'Apr, 2026', status: 'upcoming', label: ''        },
  { id: 11, dateNum: '03', day: 'FRI', monthYear: 'Apr, 2026', status: 'upcoming', label: ''        },
];

const mockLogs = [
  { id: 1, date: 'Mar 30, 2026', user: 'Yash Rathod',      email: 'yash.rathod@lockated.com',      score: 7,  dept: 'Business Excellence', highlights: '2 accomplishments, 0 challenges', submittedAt: 'Mar 31, 2026\n10:09 AM' },
  { id: 2, date: 'Mar 30, 2026', user: 'Arun Mohan',       email: 'arun.mohan@lockated.com',       score: 13, dept: 'Client Servicing',    highlights: '3 accomplishments, 0 challenges', submittedAt: 'Mar 31, 2026\n10:07 AM' },
  { id: 3, date: 'Mar 30, 2026', user: 'Adhip Shetty',     email: 'adhip.shetty@lockated.com',     score: 11, dept: 'Business Excellence', highlights: '3 accomplishments, 0 challenges', submittedAt: 'Mar 31, 2026\n9:52 AM'  },
  { id: 4, date: 'Mar 30, 2026', user: 'Bilal Shaikh',     email: 'bilal.shaikh@lockated.com',     score: 35, dept: 'Engineering',         highlights: '10 accomplishments, 0 challenges', submittedAt: 'Mar 31, 2026\n9:23 AM' },
  { id: 5, date: 'Mar 30, 2026', user: 'Mahendra Lungare', email: 'mahendra.lungare@lockated.com', score: 13, dept: 'Engineering',         highlights: '4 accomplishments, 0 challenges', submittedAt: 'Mar 31, 2026\n9:17 AM' },
  { id: 6, date: 'Mar 30, 2026', user: 'Punit Jain',       email: 'punit.jain@lockated.com',       score: 35, dept: 'Accounts',            highlights: '6 accomplishments, 0 challenges', submittedAt: 'Mar 30, 2026\n7:34 PM' },
  { id: 7, date: 'Mar 30, 2026', user: 'Kshitij Rasal',    email: 'kshitij.rasal@lockated.com',    score: 50, dept: 'Design',              highlights: '6 accomplishments, 0 challenges', submittedAt: 'Mar 30, 2026\n7:19 PM' },
];

const failedMembers = ['Adhip Shetty', 'Fatema Tashrifwala', 'Akshay Shinde', 'Arun Mohan', 'Chetan Bafna', 'Kshitij Rasal', 'Mahendra Lungare', 'Punit Jain', 'Yash Rathod'];

const detailedReports = [
  {
    id: 1,
    user: 'Bilal Shaikh', email: 'bilal.shaikh@lockated.com', dept: 'Engineering', timestamp: 'Apr 1, 9:41 AM', score: 39,
    kpiStats: [{ label: 'KPI', val: '0/20' }, { label: 'Tasks', val: '15/25' }, { label: 'Issues', val: '2/25' }, { label: 'Planning', val: '22/25' }, { label: 'Timing', val: '0/25' }],
    tasksAndIssues: [
      { id: 101, text: 'Rectify banner and project banner post...', type: 'task', done: false },
      { id: 102, text: 'Review the steps for review...', type: 'task', done: false },
      { id: 103, text: 'FM Matrix iOS got rejected', type: 'task', done: true },
      { id: 104, text: "FM App is still not live on iOS, causing client impact", type: 'issue', done: false }
    ],
    accomplishments: [
      { id: 201, text: 'Work on Godrej Living full screen visitor...', done: false },
      { id: 202, text: 'Work on Resident App Notification Self Testing - Rashid', done: false },
      { id: 203, text: 'Work on Runwal PP Payment Module - Prasad', done: false },
      { id: 204, text: 'Work on Fm Ios issues - Rashid', done: true },
      { id: 205, text: 'Complete Runwal PS Cms api issue - Prasad', done: true },
    ],
    plans: [
      { id: 301, text: 'Work on Godrej Living full screen visitor...' },
      { id: 302, text: 'Work on Resident App Notification Self...' },
      { id: 303, text: 'Work on Runwal PP Admin - Bilal' },
      { id: 304, text: 'Work on Runwal PP Payment Module - Prasad' },
      { id: 305, text: 'Work on My Daily Help Module - Bilal' },
    ]
  },
  {
    id: 2,
    user: 'Sadanand Gupta', email: 'sadanand.gupta@lockated.com', dept: 'QA', timestamp: 'Apr 1, 7:31 AM', score: 15,
    kpiStats: [{ label: 'KPI', val: '0/20' }, { label: 'Tasks', val: '3/25' }, { label: 'Issues', val: '0/25' }, { label: 'Planning', val: '6/25' }, { label: 'Timing', val: '6/25' }],
    tasksAndIssues: [
      { id: 105, text: 'Testing of the modules: Runwal post possession', type: 'task', done: false },
      { id: 106, text: 'Constant issues in Chennai Metro...', type: 'task', done: false },
      { id: 107, text: 'Recess Club Phase1 Go Live', type: 'task', done: false },
      { id: 108, text: 'Account Module Testing', type: 'task', done: false },
      { id: 109, text: 'Need to connect with team for Feedback for PATM', type: 'task', done: false }
    ],
    accomplishments: [
      { id: 206, text: 'PATM-data-cleaning activity', done: false },
      { id: 207, text: 'PATM - reports for Panchshil', done: true },
    ],
    plans: [
      { id: 306, text: 'Start working on Tutorial for Lockated Product' },
      { id: 307, text: 'PATM data cleaning activity' },
      { id: 308, text: 'Core Team Strategic Alignment Meet - Team Meeting' },
    ]
  }
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

const fullMonthNames = {
  Jan: 'January', Feb: 'February', Mar: 'March',    Apr: 'April',
  May: 'May',     Jun: 'June',     Jul: 'July',      Aug: 'August',
  Sep: 'September', Oct: 'October', Nov: 'November', Dec: 'December',
};

const statusColors = {
  missed:   { bg: '#fee2e2', border: '#fca5a5', text: '#ef4444' },
  done:     { bg: '#dcfce7', border: '#bbf7d0', text: '#22c55e' },
  holiday:  { bg: '#ffedd5', border: '#fed7aa', text: '#f97316' },
  upcoming: { bg: '#f3f4f6', border: '#e5e7eb', text: '#9ca3af' },
};

const tabs = [
  { name: 'Daily',     icon: Calendar        },
  { name: 'Daily Log', icon: FileText        },
  { name: 'History',   icon: HistoryIcon     },
  { name: 'Reports',   icon: FileSpreadsheet },
  { name: 'Analytics', icon: BarChart2       },
  { name: 'Settings',  icon: Settings        },
];

// ── Shared Components ──
// rounded-2xl applied globally on all cards/buttons

const SectionCard = ({ children, className = '' }) => (
  <Card className={cn(
    "rounded-2xl border shadow-sm",
    "border-[rgba(218,119,86,0.18)] bg-[rgba(218,119,86,0.05)]",
    "p-4 sm:p-5",
    className
  )}>
    {children}
  </Card>
);

const BtnPrimary = ({ children, onClick, className = '', type = 'button', icon: Icon }) => (
  <button type={type} onClick={onClick}
    className={cn(
      "inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold",
      "bg-[#DA7756] text-white shadow-sm hover:bg-[#c9674a] active:scale-[0.97] transition-all duration-150",
      className
    )}>
    {Icon && <Icon className="w-4 h-4" />}{children}
  </button>
);

const BtnOutline = ({ children, onClick, className = '', icon: Icon, iconClass = '' }) => (
  <button onClick={onClick}
    className={cn(
      "inline-flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold",
      "bg-white border border-[rgba(218,119,86,0.25)] text-neutral-700",
      "shadow-sm hover:bg-[#fef6f4] hover:border-[rgba(218,119,86,0.45)] active:scale-[0.97] transition-all duration-150",
      className
    )}>
    {Icon && <Icon className={cn("w-4 h-4", iconClass)} />}{children}
  </button>
);

const BtnIcon = ({ onClick, children, className = '', title = '' }) => (
  <button onClick={onClick} title={title}
    className={cn(
      "inline-flex items-center justify-center w-8 h-8 rounded-xl",
      "bg-white border border-[rgba(218,119,86,0.22)] text-neutral-500",
      "shadow-sm hover:bg-[#fef6f4] hover:text-[#DA7756] active:scale-[0.95] transition-all duration-150",
      className
    )}>
    {children}
  </button>
);

const BtnDanger = ({ children, onClick, className = '', icon: Icon }) => (
  <button onClick={onClick}
    className={cn(
      "inline-flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold",
      "bg-white border border-red-200 text-red-600 shadow-sm hover:bg-red-50 active:scale-[0.97] transition-all duration-150",
      className
    )}>
    {Icon && <Icon className="w-4 h-4" />}{children}
  </button>
);

const BtnPurple = ({ children, onClick, className = '', icon: Icon }) => (
  <button onClick={onClick}
    className={cn(
      "inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold",
      "bg-[#8b5cf6] text-white shadow-sm hover:bg-[#7c3aed] active:scale-[0.97] transition-all duration-150",
      className
    )}>
    {Icon && <Icon className="w-4 h-4" />}{children}
  </button>
);

// ─────────────────────────────────────────────
// Daily Tab
// ─────────────────────────────────────────────
const DailyTab = ({ selectedDateId, setSelectedDateId }) => {
  const selectedDate    = datesData.find(d => d.id === selectedDateId) || datesData[0];
  const fullDateString  = `${selectedDate.dateNum} ${selectedDate.monthYear} (${selectedDate.day.charAt(0) + selectedDate.day.slice(1).toLowerCase()})`;
  const monthName       = selectedDate.monthYear.split(',')[0];
  const yearNum         = selectedDate.monthYear.split(' ')[1];
  const missedDateLabel = `${fullMonthNames[monthName]} ${selectedDate.dateNum}, ${yearNum}`;

  const [expandedReports,    setExpandedReports]    = useState([]);
  const [selectedReports,    setSelectedReports]    = useState([]);
  const [activeInlineAction, setActiveInlineAction] = useState({ reportId: null, action: null });
  const [isTaskModalOpen,    setIsTaskModalOpen]    = useState(false);
  const [taskModalReportId,  setTaskModalReportId]  = useState(null);
  const [selectedMeeting,    setSelectedMeeting]    = useState('HOD Huddle');
  const [selectedMember,     setSelectedMember]     = useState('All Members');

  const toggleExpand    = (id) => setExpandedReports(prev => prev.includes(id) ? prev.filter(r => r !== id) : [...prev, id]);
  const toggleSelect    = (id) => setSelectedReports(prev => prev.includes(id) ? prev.filter(r => r !== id) : [...prev, id]);
  const toggleSelectAll = () => selectedReports.length === detailedReports.length ? setSelectedReports([]) : setSelectedReports(detailedReports.map(r => r.id));

  const handleActionClick = (reportId, actionType) => {
    if (actionType === 'task') { setTaskModalReportId(reportId); setIsTaskModalOpen(true); setActiveInlineAction({ reportId: null, action: null }); }
    else setActiveInlineAction({ reportId, action: actionType });
  };

  return (
    <div className="space-y-5 pb-12">

      {/* Date Picker */}
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
              <div key={date.id} onClick={() => setSelectedDateId(date.id)}
                className="flex-shrink-0 flex flex-col items-center justify-center rounded-2xl cursor-pointer transition-all duration-200 select-none"
                style={{
                  width: 70, height: 84,
                  background: isSelected ? sc.text : sc.bg,
                  border: `1.5px solid ${isSelected ? sc.text : sc.border}`,
                  color: isSelected ? '#fff' : sc.text,
                  transform: isSelected ? 'scale(1.07)' : 'scale(1)',
                  boxShadow: isSelected ? '0 4px 12px rgba(0,0,0,0.13)' : '0 1px 2px rgba(0,0,0,0.04)',
                }}>
                <span className="text-[10px] font-bold uppercase tracking-wider opacity-90">{date.day}</span>
                <span className="text-2xl font-extrabold leading-none my-0.5">{date.dateNum}</span>
                <span className="text-[10px] font-bold uppercase tracking-wider">{date.label}</span>
              </div>
            );
          })}
        </div>

        <div className="flex flex-col items-center">
          <div className="flex gap-5 text-xs font-medium flex-wrap justify-center text-neutral-500">
            {[{ color: '#22c55e', label: 'Meeting Done' }, { color: '#ef4444', label: 'Meeting Missed' }, { color: '#f59e0b', label: 'Holiday' }, { color: '#d1d5db', label: 'Upcoming' }].map(({ color, label }) => (
              <div key={label} className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-md inline-block border border-black/10" style={{ background: color }} />
                {label}
              </div>
            ))}
          </div>
          <p className="text-[11px] mt-1.5 italic text-neutral-400">Note: Select the date for which users have filled the report, not the meeting date.</p>
        </div>
      </SectionCard>

      {/* Missed Meetings Banner */}
      {selectedDate.status === 'missed' && (
        <div className="bg-orange-50 border border-orange-200 rounded-2xl p-4 shadow-sm">
          <div className="flex items-center gap-2 text-orange-600 font-bold text-sm mb-3">
            <AlertTriangle className="w-4 h-4" />
            Missed Meetings on {missedDateLabel} (1):
          </div>
          <button className="bg-white border border-orange-300 text-orange-700 text-xs font-bold px-3 py-1.5 rounded-xl hover:bg-orange-100 hover:border-orange-400 shadow-sm transition-all active:scale-[0.97]">
            HOD Huddle
          </button>
        </div>
      )}

      {/* MEETING / MEMBER filter chips */}
      <div className="flex items-center gap-4 flex-wrap">
        {[
          { label: 'MEETING', value: selectedMeeting, fallback: 'All Meetings', setter: setSelectedMeeting },
          { label: 'MEMBER',  value: selectedMember,  fallback: 'All Members',  setter: setSelectedMember  },
        ].map(({ label, value, fallback, setter }) => (
          <div key={label} className="flex items-center gap-2">
            <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">{label}</span>
            <div className="flex items-center gap-1.5 bg-white border border-[rgba(218,119,86,0.3)] rounded-xl px-3 py-1.5 shadow-sm cursor-pointer hover:bg-[#fef6f4] transition-colors">
              <span className="text-sm font-semibold text-neutral-800">{value || fallback}</span>
              <ChevronDown className="w-3.5 h-3.5 text-neutral-400" />
            </div>
            <button onClick={() => setter('')} className="p-1.5 text-neutral-400 hover:text-red-500 bg-white border border-neutral-200 rounded-xl shadow-sm transition-colors">
              <X className="w-3 h-3" />
            </button>
          </div>
        ))}
      </div>

      {/* Meeting Notes Section */}
      <div className="border border-neutral-200 rounded-2xl shadow-sm overflow-hidden bg-white">
        <div className="p-4 border-b border-neutral-100 flex justify-between items-start flex-wrap gap-3">
          <div>
            <h3 className="font-bold text-sm text-neutral-900 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#8b5cf6]" /> Daily Reports for HOD Huddle
            </h3>
            <p className="text-xs text-neutral-400 mt-0.5">31 Mar 2026 (Tue)</p>
          </div>
          <div className="flex items-center gap-2 text-xs font-semibold flex-wrap">
            <span className="px-2.5 py-1 rounded-xl text-xs font-bold bg-blue-500 text-white shadow-sm">Team 11</span>
            <span className="px-2.5 py-1 rounded-xl text-xs font-bold bg-green-500 text-white shadow-sm">Submitted 2</span>
            <span className="px-2.5 py-1 rounded-xl text-xs font-bold bg-red-500 text-white shadow-sm">Missed 9</span>
          </div>
        </div>

        <div className="p-4 bg-[rgba(139,92,246,0.04)]">
          <div className="bg-white border border-[rgba(139,92,246,0.18)] rounded-2xl overflow-hidden shadow-sm">
            <div className="flex items-center justify-between p-3 border-b border-[rgba(139,92,246,0.1)]">
              <div className="flex items-center gap-2 font-semibold text-neutral-800 text-sm">
                <Users className="w-4 h-4 text-[#8b5cf6]" /> HOD Huddle (10:00) · 31 Mar (Tue)
              </div>
              <div className="flex gap-2">
                <BtnIcon title="Calendar"><CalendarIcon className="w-3.5 h-3.5 text-green-500" /></BtnIcon>
                <BtnIcon title="Refresh"><RefreshCw className="w-3.5 h-3.5" /></BtnIcon>
              </div>
            </div>
            <div className="p-4">
              <label className="block text-sm font-bold text-neutral-800 mb-2">Meeting Notes</label>
              <textarea
                className="w-full border border-neutral-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#8b5cf6]/25 min-h-[80px] resize-y placeholder:text-neutral-400 text-neutral-700 bg-neutral-50"
                placeholder="Enter meeting remarks, feedback, action items... Use @ to mention team members."
              />
            </div>
            <div className="flex items-center justify-between bg-neutral-50 p-3 border-t border-neutral-100">
              <label className="flex items-center gap-2.5 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 rounded border-gray-300 cursor-pointer" style={{ accentColor: '#1a1a1a' }}
                  checked={selectedReports.length === detailedReports.length && detailedReports.length > 0} onChange={toggleSelectAll} />
                <span className="text-sm font-bold text-neutral-800">Select All</span>
              </label>
              <BtnPrimary icon={FileText} className="bg-[#8b5cf6] hover:bg-[#7c3aed]">Save Meeting</BtnPrimary>
            </div>
          </div>
        </div>
      </div>

      {/* ── Failed to Submit Banner — theme-coloured pill buttons with hover ── */}
      <div className="bg-[#fef6f4] border border-[rgba(218,119,86,0.25)] rounded-2xl p-4 shadow-sm">
        <div className="flex items-center gap-2 text-[#DA7756] font-bold text-sm mb-3">
          <AlertTriangle className="w-4 h-4" />
          Team Members Who Failed to Submit Reports ({failedMembers.length}):
        </div>
        <div className="flex flex-wrap gap-2">
          {failedMembers.map(member => (
            <button
              key={member}
              className="
                text-[11px] font-bold px-3 py-1.5 rounded-xl
                border border-[rgba(218,119,86,0.4)]
                bg-white text-[#DA7756]
                shadow-sm
                hover:bg-[#DA7756] hover:text-white hover:border-[#DA7756]
                active:scale-[0.96]
                transition-all duration-150
              "
            >
              {member}
            </button>
          ))}
        </div>
      </div>

      {/* Detailed Reports */}
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
                  <input type="checkbox" className="w-4 h-4 mt-1 sm:mt-0 rounded border-gray-300" style={{ accentColor: '#DA7756' }}
                    checked={isSelected} onChange={(e) => { e.stopPropagation(); toggleSelect(report.id); }} />
                  <div className="flex items-center justify-center w-10 h-10 rounded-full border-2 border-red-400 text-red-600 font-bold text-base flex-shrink-0 bg-red-50">
                    {report.score}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-bold text-neutral-900 text-sm">{report.user}</h3>
                      <span className="text-[10px] font-bold text-blue-500 border border-blue-200 bg-blue-50 px-2 py-0.5 rounded-xl">{report.dept}</span>
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
                    {/* Tasks & Issues */}
                    <div className="p-4">
                      <h4 className="flex items-center gap-2 font-bold text-red-500 mb-3 text-xs uppercase tracking-wider">
                        <Circle className="w-3.5 h-3.5 fill-red-500" /> Tasks & Issues
                      </h4>
                      <ul className="space-y-2.5">
                        {report.tasksAndIssues.map(item => (
                          <li key={item.id} className="flex items-start gap-2 text-xs text-neutral-700">
                            {item.done ? <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" /> : <Circle className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />}
                            <span className="flex-1 leading-snug">{item.text}</span>
                            {item.type === 'task'  && <span className="text-[9px] font-bold text-blue-500 border border-blue-200 bg-blue-50 px-1.5 py-0.5 rounded-xl uppercase flex-shrink-0">task</span>}
                            {item.type === 'issue' && <span className="text-[9px] font-bold text-red-500 border border-red-200 bg-red-50 px-1.5 py-0.5 rounded-xl uppercase flex-shrink-0">issue</span>}
                          </li>
                        ))}
                      </ul>
                    </div>
                    {/* Accomplishments */}
                    <div className="p-4">
                      <h4 className="flex items-center gap-2 font-bold text-green-600 mb-3 text-xs uppercase tracking-wider">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Accomplishments
                      </h4>
                      <ul className="space-y-2.5">
                        {report.accomplishments.map(item => (
                          <li key={item.id} className="flex items-start gap-2 text-xs text-neutral-700">
                            {item.done ? <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" /> : <Circle className="w-4 h-4 text-neutral-300 mt-0.5 flex-shrink-0" />}
                            <span className="flex-1 leading-snug text-neutral-600">{item.text}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    {/* Tomorrow's Plan */}
                    <div className="p-4">
                      <h4 className="flex items-center gap-2 font-bold text-amber-500 mb-3 text-xs uppercase tracking-wider">
                        <ArrowRight className="w-3.5 h-3.5" /> Tomorrow's Plan
                      </h4>
                      <ul className="space-y-2.5">
                        {report.plans.map(item => (
                          <li key={item.id} className="flex items-start gap-2 text-xs text-neutral-700">
                            <div className="w-1.5 h-1.5 rounded-full bg-neutral-300 mt-1.5 shrink-0" />
                            <span className="flex-1 leading-snug">{item.text}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div className="p-4 border-t border-[rgba(218,119,86,0.1)] bg-neutral-50">
                    <div className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-3">Quick Actions</div>
                    {activeInlineAction.reportId !== report.id ? (
                      <div className="flex items-center gap-2 flex-wrap">
                        <BtnOutline onClick={() => handleActionClick(report.id, 'task')}     icon={Plus} iconClass="text-[#DA7756]">Task</BtnOutline>
                        <BtnOutline onClick={() => handleActionClick(report.id, 'issue')}    icon={Plus} iconClass="text-red-500">Stuck Issue</BtnOutline>
                        <BtnOutline onClick={() => handleActionClick(report.id, 'plan')}     icon={Plus} iconClass="text-amber-500">Add to Plan</BtnOutline>
                        <BtnPurple  onClick={() => handleActionClick(report.id, 'feedback')} icon={MessageSquare}>Feedback</BtnPurple>
                      </div>
                    ) : (
                      <div className="bg-white p-3 rounded-2xl border border-[rgba(218,119,86,0.2)] shadow-sm max-w-2xl">
                        {activeInlineAction.action === 'issue' && (
                          <div className="flex gap-2 items-center">
                            <input type="text" placeholder="Enter stuck issue..." className="flex-1 border border-[rgba(218,119,86,0.22)] rounded-xl p-2 text-sm bg-[#fef6f4] focus:outline-none focus:ring-2 focus:ring-[rgba(218,119,86,0.25)]" autoFocus />
                            <BtnDanger>Add</BtnDanger>
                            <BtnOutline onClick={() => setActiveInlineAction({ reportId: null, action: null })}>Cancel</BtnOutline>
                          </div>
                        )}
                        {activeInlineAction.action === 'plan' && (
                          <div className="flex gap-2 items-center">
                            <input type="text" placeholder="Add to tomorrow's plan..." className="flex-1 border border-[rgba(218,119,86,0.22)] rounded-xl p-2 text-sm bg-[#fef6f4] focus:outline-none" autoFocus />
                            <button className="px-3 py-2 bg-amber-500 text-white text-sm font-semibold rounded-xl hover:bg-amber-600 shadow-sm transition-all active:scale-[0.97]">Add</button>
                            <BtnOutline onClick={() => setActiveInlineAction({ reportId: null, action: null })}>Cancel</BtnOutline>
                          </div>
                        )}
                        {activeInlineAction.action === 'feedback' && (
                          <div className="space-y-3">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold text-neutral-700">Rating</span>
                              <div className="flex gap-0.5 text-neutral-300">
                                {[1,2,3,4,5].map(n => <Star key={n} className={cn("w-4 h-4 cursor-pointer hover:text-amber-400", n<=2?'text-amber-400 fill-amber-400':'')} fill="currentColor" />)}
                              </div>
                            </div>
                            <textarea placeholder="Enter constructive feedback..." className="w-full border border-[rgba(218,119,86,0.22)] rounded-xl p-2.5 text-sm h-16 bg-[#fef6f4] focus:outline-none focus:ring-2 focus:ring-[rgba(218,119,86,0.25)]" autoFocus />
                            <div className="flex gap-2">
                              <BtnPurple onClick={() => setActiveInlineAction({ reportId: null, action: null })}>Add Feedback</BtnPurple>
                              <BtnOutline onClick={() => setActiveInlineAction({ reportId: null, action: null })}>Cancel</BtnOutline>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="py-2 border-t border-[rgba(218,119,86,0.1)] bg-white flex justify-center">
                    <button onClick={() => toggleExpand(report.id)}
                      className="flex items-center gap-1.5 text-xs font-semibold text-neutral-500 hover:text-[#DA7756] bg-white border border-neutral-200 px-3 py-1 rounded-full shadow-sm hover:border-[rgba(218,119,86,0.3)] transition-all">
                      <ChevronUp className="w-3 h-3" /> Collapse
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Task Modal */}
      {isTaskModalOpen && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border border-[rgba(218,119,86,0.18)]">
            <div className="flex justify-between items-center p-4 border-b border-neutral-100 bg-[#fef6f4]">
              <h5 className="font-bold text-sm text-neutral-900 flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#DA7756]" /> Add Task for {detailedReports.find(r => r.id === taskModalReportId)?.user}
              </h5>
              <BtnIcon onClick={() => setIsTaskModalOpen(false)}><X className="w-3.5 h-3.5" /></BtnIcon>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="text-xs font-bold text-neutral-700 mb-1.5 block">Task Title <span className="text-red-500">*</span></label>
                <input type="text" placeholder="What needs to be done?" className="w-full border border-[rgba(218,119,86,0.22)] rounded-xl p-2.5 text-sm bg-[#fef6f4] focus:outline-none focus:ring-2 focus:ring-[rgba(218,119,86,0.25)]" autoFocus />
              </div>
              <div>
                <label className="text-xs font-bold text-neutral-700 mb-1.5 block">Description</label>
                <textarea placeholder="Additional details..." className="w-full border border-[rgba(218,119,86,0.22)] rounded-xl p-2.5 text-sm h-20 resize-none bg-[#fef6f4] focus:outline-none" />
              </div>
              <div className="flex gap-3">
                <div className="flex-1">
                  <label className="text-xs font-bold text-neutral-700 mb-1.5 block">Priority</label>
                  <select className="w-full border border-[rgba(218,119,86,0.22)] rounded-xl p-2.5 text-sm bg-white focus:outline-none">
                    <option>Low</option><option>Medium</option><option>High</option>
                  </select>
                </div>
                <div className="flex-1">
                  <label className="text-xs font-bold text-neutral-700 mb-1.5 block">Due Date <span className="text-red-500">*</span></label>
                  <input type="date" className="w-full border border-[rgba(218,119,86,0.22)] rounded-xl p-2.5 text-sm text-neutral-600 bg-white focus:outline-none" />
                </div>
              </div>
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="text-xs font-bold text-neutral-700">Progress</label>
                  <span className="text-xs font-bold text-[#DA7756]">0%</span>
                </div>
                <input type="range" min="0" max="100" defaultValue="0" className="w-full cursor-pointer" style={{ accentColor: C.primary }} />
              </div>
            </div>
            <div className="p-4 border-t border-neutral-100 bg-[#fef6f4] flex justify-end gap-2">
              <BtnOutline onClick={() => setIsTaskModalOpen(false)}>Cancel</BtnOutline>
              <BtnPurple icon={Plus}>Create Task</BtnPurple>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};

// ─────────────────────────────────────────────
// Daily Log Tab
// ─────────────────────────────────────────────
const DailyLogTab = ({ selectedDateId, setSelectedDateId }) => {
  const [searchQuery,          setSearchQuery]          = useState('');
  const [selectedDeptFilter,   setSelectedDeptFilter]   = useState('');
  const [selectedMeetingFilter,setSelectedMeetingFilter] = useState('');
  const [isGrouped,            setIsGrouped]            = useState(false);
  const [selectedReport,       setSelectedReport]       = useState(null);
  const [activeAction,         setActiveAction]         = useState(null);

  const selectedDate    = datesData.find(d => d.id === selectedDateId) || datesData[6];
  const currentIndex    = datesData.findIndex(d => d.id === selectedDateId);
  const monthStr        = selectedDate.monthYear.split(',')[0];
  const yearStr         = selectedDate.monthYear.split(' ')[1];
  const shortDateString = `${selectedDate.dateNum.padStart(2,'0')}-${monthMap[monthStr]}-${yearStr}`;
  const inputDateValue  = `${yearStr}-${monthMap[monthStr]}-${selectedDate.dateNum.padStart(2,'0')}`;

  const handlePrevDate = () => { if (currentIndex > 0) setSelectedDateId(datesData[currentIndex-1].id); };
  const handleNextDate = () => { if (currentIndex < datesData.length-1) setSelectedDateId(datesData[currentIndex+1].id); };

  const filteredLogs = mockLogs.filter(log => {
    const matchesSearch = log.user.toLowerCase().includes(searchQuery.toLowerCase()) || log.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDept   = selectedDeptFilter ? log.dept === selectedDeptFilter : true;
    return matchesSearch && matchesDept;
  });

  const groupedLogs = filteredLogs.reduce((acc, log) => { if (!acc[log.dept]) acc[log.dept]=[]; acc[log.dept].push(log); return acc; }, {});
  const sortedDepts = Object.keys(groupedLogs).sort();

  const renderTableRow = (log) => (
    <tr key={log.id} className="border-b hover:bg-[#fef6f4] transition-colors" style={{ borderColor: C.borderLgt }}>
      <td className="p-3 text-sm text-neutral-600">{log.date}</td>
      <td className="p-3">
        <div className="text-sm font-bold text-neutral-900">{log.user}</div>
        <div className="text-xs text-neutral-400">{log.email}</div>
      </td>
      <td className="p-3">
        <span className={cn("px-2.5 py-1 rounded-xl text-xs font-bold shadow-sm",
          log.score>=50?'bg-orange-100 text-orange-600':log.score>=30?'bg-amber-100 text-amber-700':'bg-red-100 text-red-600'
        )}>{log.score}</span>
      </td>
      <td className="p-3">
        <span className="bg-[rgba(218,119,86,0.1)] text-[#DA7756] px-2.5 py-1 rounded-xl text-xs font-semibold border border-[rgba(218,119,86,0.2)]">{log.dept}</span>
      </td>
      <td className="p-3 text-xs text-neutral-600">{log.highlights}</td>
      <td className="p-3 text-xs text-neutral-400 whitespace-pre-line">{log.submittedAt}</td>
      <td className="p-3 text-center">
        <BtnIcon onClick={() => { setSelectedReport(log); setActiveAction(null); }} title="View">
          <Eye className="w-3.5 h-3.5 text-[#DA7756]" />
        </BtnIcon>
      </td>
    </tr>
  );

  return (
    <div className="space-y-4">
      <SectionCard className="p-0 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[rgba(218,119,86,0.12)] flex-wrap gap-3 bg-[#fef6f4] rounded-t-2xl">
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-white border border-[rgba(218,119,86,0.22)] shadow-sm">
              <FileText className="w-4 h-4 text-[#DA7756]" />
            </div>
            <h2 className="text-sm font-bold text-neutral-900">
              Daily Report Log — {monthStr} {selectedDate.dateNum} ({selectedDate.day.charAt(0)+selectedDate.day.slice(1).toLowerCase()})
            </h2>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold px-2.5 py-1 bg-green-100 text-green-700 rounded-xl shadow-sm">Submitted: 7</span>
              <span className="text-xs font-bold px-2.5 py-1 bg-neutral-100 text-neutral-600 rounded-xl border">Expected: 0</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <BtnIcon onClick={handlePrevDate} title="Previous"><ArrowLeft className="w-3.5 h-3.5" /></BtnIcon>
            <div className="relative flex items-center">
              <input type="date" value={inputDateValue} onChange={(e) => {
                const s=e.target.value; if(!s) return;
                const [y,m,d]=s.split('-');
                const found=datesData.find(o=>o.dateNum.padStart(2,'0')===d&&monthMap[o.monthYear.split(',')[0]]===m&&o.monthYear.split(' ')[1]===y);
                if(found) setSelectedDateId(found.id); else alert('Select a date between Mar 24 and Apr 3, 2026.');
              }} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
              <div className="flex items-center gap-2 px-3 py-1.5 border border-[rgba(218,119,86,0.22)] rounded-xl text-xs font-semibold text-neutral-700 bg-white shadow-sm hover:bg-[#fef6f4] min-w-[120px]">
                {shortDateString} <Calendar className="w-3.5 h-3.5 text-[#DA7756]" />
              </div>
            </div>
            <BtnIcon onClick={handleNextDate} title="Next"><ArrowRight className="w-3.5 h-3.5" /></BtnIcon>
          </div>
        </div>

        {/* Filters */}
        <div className="p-4 flex items-center justify-between gap-3 flex-wrap bg-white border-b border-neutral-100">
          <div className="relative flex-1 min-w-[220px]">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input type="text" placeholder="Search by user, email..." value={searchQuery} onChange={e=>setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-4 py-2 text-sm border border-[rgba(218,119,86,0.22)] rounded-xl focus:outline-none focus:ring-2 focus:ring-[rgba(218,119,86,0.25)] bg-[#fef6f4] shadow-sm" />
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <select value={selectedDeptFilter} onChange={e=>setSelectedDeptFilter(e.target.value)}
              className="border border-[rgba(218,119,86,0.22)] rounded-xl px-3 py-2 text-sm font-semibold text-neutral-700 bg-white focus:outline-none shadow-sm">
              <option value="">Department</option>
              {uniqueDepartments.map(d=><option key={d} value={d}>{d}</option>)}
            </select>
            <select value={selectedMeetingFilter} onChange={e=>setSelectedMeetingFilter(e.target.value)}
              className="border border-[rgba(218,119,86,0.22)] rounded-xl px-3 py-2 text-sm font-semibold text-neutral-700 bg-white focus:outline-none shadow-sm">
              <option value="">Meeting</option>
              <option value="HOD Huddle">HOD Huddle</option>
              <option value="General Standup">General Standup</option>
            </select>
            <button onClick={()=>setIsGrouped(!isGrouped)}
              className={cn("flex items-center gap-2 px-3 py-2 border rounded-xl text-sm font-semibold transition-all shadow-sm",
                isGrouped?'bg-[rgba(218,119,86,0.1)] border-[rgba(218,119,86,0.35)] text-[#DA7756]':'bg-white text-neutral-700 border-[rgba(218,119,86,0.22)] hover:bg-[#fef6f4]'
              )}>
              <div className={cn("w-2.5 h-2.5 rounded-full",isGrouped?'bg-[#DA7756]':'border-2 border-neutral-400')} /> Group by Dept
            </button>
            <BtnIcon title="Refresh"><RefreshCw className="w-3.5 h-3.5" /></BtnIcon>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto bg-white rounded-b-2xl">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#fef6f4] border-y border-[rgba(218,119,86,0.12)]">
                {['Date','User','Score','Department','Highlights','Submitted At','Actions'].map(h=>(
                  <th key={h} className={cn("p-3 text-[10px] font-bold text-neutral-500 uppercase tracking-wider",h==='Actions'?'text-center':'')}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredLogs.length===0 ? (
                <tr><td colSpan={7} className="text-center p-8 text-sm text-neutral-400">No reports found.</td></tr>
              ) : !isGrouped ? filteredLogs.map(renderTableRow) : (
                sortedDepts.map(dept=>(
                  <React.Fragment key={dept}>
                    <tr className="bg-[rgba(218,119,86,0.05)] border-b border-[rgba(218,119,86,0.08)]">
                      <td colSpan={7} className="p-2 px-4 text-xs font-bold text-neutral-700">{dept} <span className="text-[#DA7756]">({groupedLogs[dept].length})</span></td>
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
      {selectedReport && createPortal(
        <div className="fixed inset-0 z-[9990] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] flex flex-col overflow-hidden border border-[rgba(218,119,86,0.18)]">
            <div className="flex items-center justify-between p-4 border-b border-neutral-100 bg-[#fef6f4] shrink-0">
              <div>
                <h3 className="text-base font-bold text-neutral-900">Daily Report Details</h3>
                <p className="text-xs text-neutral-500 mt-0.5">{selectedReport.user} • {selectedReport.date}</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <div className="text-[10px] text-neutral-400 font-semibold mb-0.5">Submitted At</div>
                  <div className="text-xs text-neutral-700 font-bold whitespace-pre-line">{selectedReport.submittedAt}</div>
                </div>
                <BtnIcon onClick={()=>{setSelectedReport(null);setActiveAction(null);}}><X className="w-3.5 h-3.5" /></BtnIcon>
              </div>
            </div>
            <div className="p-5 flex-1 overflow-y-auto bg-neutral-50">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { title:'Tasks & Issues', icon:AlertTriangle, color:'red', items:[
                    { text:'Shwan has been irresponsive on the webpage, slow and absent to connect almost every alternate day' },
                    { text:'Adoption of PATM in Lockated' },
                  ]},
                  { title:'Accomplishments', icon:CheckCircle2, color:'green', items:[
                    { text:'ISO IT Documentation Meet with Matrix3D and Kunal & Mahi sir' },
                  ]},
                  { title:"Tomorrow's Plan", icon:FileText, color:'amber', items:[
                    { text:"CEO's Dashboard, SPOC refinement" },
                  ]},
                ].map(({ title, icon:Icon, color, items }) => (
                  <div key={title} className={cn("bg-white rounded-2xl shadow-sm border-t-[3px] p-4 border border-neutral-100",
                    color==='red'?'border-t-red-400':color==='green'?'border-t-green-500':'border-t-amber-400'
                  )}>
                    <h4 className={cn("flex items-center gap-2 font-bold mb-3 pb-2 border-b border-neutral-100 text-sm",
                      color==='red'?'text-red-600':color==='green'?'text-green-600':'text-amber-600'
                    )}>
                      <Icon className="w-4 h-4" /> {title}
                    </h4>
                    <ul className="space-y-2.5">
                      {items.map((item,i)=>(
                        <li key={i} className="flex items-start gap-2 text-xs text-neutral-700">
                          <div className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 bg-neutral-300" />
                          <span>{item.text}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
            <div className="p-4 border-t border-neutral-100 bg-white shrink-0">
              <div className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-3">Quick Actions</div>
              {!activeAction ? (
                <div className="flex items-center gap-2 flex-wrap">
                  <BtnOutline onClick={()=>setActiveAction('task')}     icon={Plus} iconClass="text-[#DA7756]">Task</BtnOutline>
                  <BtnOutline onClick={()=>setActiveAction('issue')}    icon={Plus} iconClass="text-red-500">Stuck Issue</BtnOutline>
                  <BtnOutline onClick={()=>setActiveAction('plan')}     icon={Plus} iconClass="text-amber-500">Add to Plan</BtnOutline>
                  <BtnPrimary onClick={()=>setActiveAction('feedback')} icon={Star} className="ml-auto">Feedback</BtnPrimary>
                </div>
              ) : (
                <div className="bg-[#fef6f4] p-3 rounded-2xl border border-[rgba(218,119,86,0.2)] shadow-sm">
                  {activeAction==='issue' && (
                    <div className="flex gap-2 items-center">
                      <input type="text" placeholder="Enter stuck issue..." className="flex-1 border border-[rgba(218,119,86,0.22)] rounded-xl p-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[rgba(218,119,86,0.25)]" autoFocus />
                      <BtnDanger>Add</BtnDanger>
                      <BtnOutline onClick={()=>setActiveAction(null)}>Cancel</BtnOutline>
                    </div>
                  )}
                  {activeAction==='plan' && (
                    <div className="flex gap-2 items-center">
                      <input type="text" placeholder="Add to tomorrow's plan..." className="flex-1 border border-[rgba(218,119,86,0.22)] rounded-xl p-2.5 text-sm bg-white focus:outline-none" autoFocus />
                      <button className="px-3 py-2 bg-amber-500 text-white text-sm font-semibold rounded-xl hover:bg-amber-600 shadow-sm transition-all active:scale-[0.97]">Add</button>
                      <BtnOutline onClick={()=>setActiveAction(null)}>Cancel</BtnOutline>
                    </div>
                  )}
                  {activeAction==='feedback' && (
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-neutral-700">Rating (1–5)</span>
                        <div className="flex gap-0.5 text-neutral-300">
                          {[1,2,3,4,5].map(n=><Star key={n} className={cn("w-5 h-5 cursor-pointer hover:text-amber-400",n<=2?'text-amber-400 fill-amber-400':'')} fill="currentColor" />)}
                        </div>
                      </div>
                      <textarea placeholder="Enter constructive feedback..." className="w-full border border-[rgba(218,119,86,0.22)] rounded-xl p-3 text-sm h-20 bg-white focus:outline-none focus:ring-2 focus:ring-[rgba(218,119,86,0.25)]" autoFocus />
                      <div className="flex gap-2">
                        <BtnPrimary>Add Feedback</BtnPrimary>
                        <BtnOutline onClick={()=>setActiveAction(null)}>Cancel</BtnOutline>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* Task Modal (inside log detail) */}
      {activeAction==='task' && selectedReport && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border border-[rgba(218,119,86,0.18)]">
            <div className="flex justify-between items-center p-4 border-b border-neutral-100 bg-[#fef6f4]">
              <h5 className="font-bold text-sm text-neutral-900 flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#DA7756]" /> Add Task for {selectedReport.user}
              </h5>
              <BtnIcon onClick={()=>setActiveAction(null)}><X className="w-3.5 h-3.5" /></BtnIcon>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="text-xs font-bold text-neutral-700 mb-1.5 block">Task Title <span className="text-red-500">*</span></label>
                <input type="text" placeholder="What needs to be done?" className="w-full border border-[rgba(218,119,86,0.22)] rounded-xl p-2.5 text-sm bg-[#fef6f4] focus:outline-none focus:ring-2 focus:ring-[rgba(218,119,86,0.25)]" autoFocus />
              </div>
              <div>
                <label className="text-xs font-bold text-neutral-700 mb-1.5 block">Description</label>
                <textarea placeholder="Additional details..." className="w-full border border-[rgba(218,119,86,0.22)] rounded-xl p-2.5 text-sm h-20 resize-none bg-[#fef6f4] focus:outline-none" />
              </div>
              <div className="flex gap-3">
                <div className="flex-1">
                  <label className="text-xs font-bold text-neutral-700 mb-1.5 block">Priority</label>
                  <select className="w-full border border-[rgba(218,119,86,0.22)] rounded-xl p-2.5 text-sm bg-white focus:outline-none">
                    <option>Low</option><option>Medium</option><option>High</option>
                  </select>
                </div>
                <div className="flex-1">
                  <label className="text-xs font-bold text-neutral-700 mb-1.5 block">Due Date <span className="text-red-500">*</span></label>
                  <input type="date" className="w-full border border-[rgba(218,119,86,0.22)] rounded-xl p-2.5 text-sm text-neutral-600 bg-white focus:outline-none" />
                </div>
              </div>
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="text-xs font-bold text-neutral-700">Progress</label>
                  <span className="text-xs font-bold text-[#DA7756]">0%</span>
                </div>
                <input type="range" min="0" max="100" defaultValue="0" className="w-full cursor-pointer" style={{ accentColor: C.primary }} />
              </div>
            </div>
            <div className="p-4 border-t border-neutral-100 bg-[#fef6f4] flex justify-end gap-2">
              <BtnOutline onClick={()=>setActiveAction(null)}>Cancel</BtnOutline>
              <BtnPrimary icon={Plus}>Create Task</BtnPrimary>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};

// ─────────────────────────────────────────────
// History Tab
// ─────────────────────────────────────────────
const HistoryTab = () => {
  const [dateOffset, setDateOffset] = useState(0);
  const baseDate    = new Date(2026,2,30);
  const currentDate = new Date(baseDate);
  currentDate.setDate(currentDate.getDate()+dateOffset);

  const fmt  = d => `${String(d.getDate()).padStart(2,'0')}-${String(d.getMonth()+1).padStart(2,'0')}-${d.getFullYear()}`;
  const fmt2 = d => { const m=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']; return `${m[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`; };
  const fmt3 = d => { const m=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']; return `${d.getDate()} ${m[d.getMonth()]} ${String(d.getFullYear()).slice(2)}`; };

  const dateStr = fmt(currentDate);
  const historyMap = {
    '30-03-2026': { type:'missed',    missedCount:1, doneCount:0, meeting:'HOD Huddle' },
    '29-03-2026': { type:'empty' },
    '27-03-2026': { type:'completed', meeting:'HOD Huddle', attendees:11, submittedAt:'30 Mar 26, 10:27 AM IST' },
    '26-03-2026': { type:'completed', meeting:'HOD Huddle', attendees:11, submittedAt:'27 Mar 26, 9:57 AM IST' },
    '25-03-2026': { type:'missed',    missedCount:1, doneCount:0, meeting:'HOD Huddle' },
    '23-03-2026': { type:'completed', meeting:'HOD Huddle', attendees:12, submittedAt:'24 Mar 26, 10:39 AM IST' },
  };
  const data = historyMap[dateStr] || { type:'empty' };

  return (
    <div className="pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl font-bold text-neutral-900">Daily Meeting History</h2>
          <p className="text-sm text-neutral-500 mt-1">View and edit past daily meeting reports</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <select className="appearance-none bg-white border border-[rgba(218,119,86,0.22)] rounded-xl py-2 pl-4 pr-8 text-sm font-semibold text-neutral-700 focus:outline-none shadow-sm">
              <option>All Meetings</option><option>HOD Huddle</option>
            </select>
            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none w-3.5 h-3.5" />
          </div>
          <BtnIcon onClick={()=>setDateOffset(p=>p-1)}><ChevronLeft className="w-3.5 h-3.5" /></BtnIcon>
          <div className="px-3 py-2 border border-[rgba(218,119,86,0.22)] rounded-xl bg-white flex items-center gap-2 text-sm font-semibold text-neutral-700 shadow-sm">
            {dateStr} <CalendarIcon className="w-3.5 h-3.5 text-[#DA7756]" />
          </div>
          <BtnIcon onClick={()=>setDateOffset(p=>p+1)}><ChevronRight className="w-3.5 h-3.5" /></BtnIcon>
          <BtnOutline icon={RefreshCw} iconClass="text-[#DA7756]">Refresh</BtnOutline>
        </div>
      </div>

      {data.type==='missed' && (
        <div className="space-y-4">
          <SectionCard>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="text-[#DA7756] font-bold mb-3 flex items-center gap-2 text-sm">
                  <AlertTriangle className="w-4 h-4" /> Missed Meetings on {fmt2(currentDate)} (1):
                </div>
                <span className="bg-[#DA7756] text-white text-xs font-bold px-3 py-1.5 rounded-xl shadow-sm">{data.meeting}</span>
              </div>
              <div className="flex items-center gap-3 text-sm font-bold text-neutral-600">
                <div className="flex items-center gap-2">Done: <span className="bg-green-500 text-white px-2.5 py-0.5 rounded-xl shadow-sm">{data.doneCount}</span></div>
                <div className="flex items-center gap-2">Missed: <span className="bg-red-500 text-white px-2.5 py-0.5 rounded-xl shadow-sm">{data.missedCount}</span></div>
              </div>
            </div>
          </SectionCard>
          <div className="flex flex-col items-center justify-center py-16 text-neutral-400">
            <HistoryIcon size={56} className="mb-4 opacity-25" strokeWidth={1.5} />
            <p className="text-sm text-neutral-400">No meeting history found for the selected filters</p>
          </div>
        </div>
      )}

      {data.type==='empty' && (
        <div className="flex flex-col items-center justify-center py-32">
          <HistoryIcon size={56} className="mb-4 opacity-25" strokeWidth={1.5} />
          <p className="text-sm text-neutral-400">No meeting history found for the selected filters</p>
        </div>
      )}

      {data.type==='completed' && (
        <SectionCard className="p-0 overflow-hidden">
          <div className="p-5 bg-[#DA7756] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 rounded-t-2xl">
            <div>
              <h3 className="text-xl font-bold text-white mb-2">{data.meeting} for {fmt3(currentDate)}</h3>
              <div className="flex items-center gap-3 mb-1.5">
                <span className="bg-white text-[#DA7756] text-xs font-bold px-2.5 py-1 rounded-xl shadow-sm">completed</span>
                <span className="text-sm font-semibold text-white/90">{data.attendees} attendees</span>
              </div>
              <div className="text-xs text-white/70">Submitted: {data.submittedAt}</div>
            </div>
            <div className="flex items-center gap-2">
              <button className="flex items-center gap-1.5 border border-white/30 bg-white/15 hover:bg-white/25 px-3 py-2 rounded-xl text-sm font-semibold text-white transition-all shadow-sm active:scale-[0.97]">
                <Sparkles className="w-4 h-4" /> Generate AI
              </button>
              <button className="flex items-center gap-1.5 border border-white/30 bg-white/15 hover:bg-white/25 px-3 py-2 rounded-xl text-sm font-semibold text-white transition-all shadow-sm active:scale-[0.97]">
                <Edit className="w-4 h-4" /> Edit
              </button>
              <button className="border border-white/30 bg-white/15 hover:bg-white/25 p-2 rounded-xl transition-all shadow-sm text-white active:scale-[0.97]">
                <Trash className="w-4 h-4" />
              </button>
            </div>
          </div>
          <div className="bg-white p-4 flex items-center justify-between cursor-pointer hover:bg-[#fef6f4] transition-colors rounded-b-2xl">
            <div className="flex items-center gap-2 font-bold text-neutral-700 text-sm">
              <FileText className="w-4 h-4 text-[#DA7756]" /> Raw Meeting Notes
            </div>
            <ChevronDown className="text-neutral-400 w-4 h-4" />
          </div>
        </SectionCard>
      )}
    </div>
  );
};

// ─────────────────────────────────────────────
// Reports Tab
// ─────────────────────────────────────────────
const ReportsTab = () => {
  const [isKPIExpanded, setIsKPIExpanded] = useState(false);
  const lastWeekDates = [
    {day:'Wed',date:18},{day:'Thu',date:19},{day:'Fri',date:20},
    {day:'Sat',date:21},{day:'Sun',date:22},{day:'Mon',date:23},{day:'Tue',date:24},
  ];
  const StatCard = ({ title, value, sub, icon:Icon, bgClass }) => (
    <Card className={cn("border-0 shadow-sm rounded-2xl p-4", bgClass)}>
      <div className="flex flex-col items-center text-center">
        <Icon className="mb-2 h-6 w-6 opacity-60" />
        <p className="text-2xl font-bold text-neutral-900">{value}</p>
        <p className="mt-0.5 text-xs font-semibold text-neutral-700">{title}</p>
        <p className="mt-0.5 text-[11px] text-neutral-500">{sub}</p>
      </div>
    </Card>
  );

  return (
    <div className="space-y-5">
      <SectionCard>
        <div className="flex items-center gap-2 text-[#DA7756] font-bold mb-3 text-sm">
          <AlertTriangle className="w-4 h-4" /> Missed Meetings This Week (2)
        </div>
        <button className="bg-[rgba(218,119,86,0.1)] border border-[rgba(218,119,86,0.3)] text-[#DA7756] text-xs font-bold py-1.5 px-3 rounded-xl hover:bg-[rgba(218,119,86,0.18)] shadow-sm transition-all active:scale-[0.97]">
          HOD Huddle (2)
        </button>
      </SectionCard>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-neutral-900">Meeting Reports & Analytics</h2>
          <p className="text-sm text-neutral-500 mt-0.5">Comprehensive insights for all daily meetings</p>
        </div>
        <div className="flex items-center gap-2">
          <select className="bg-white border border-[rgba(218,119,86,0.22)] rounded-xl py-2 px-3 text-sm font-semibold text-neutral-700 focus:outline-none shadow-sm">
            <option>HOD Huddle</option><option>All Meetings</option>
          </select>
          <select className="bg-white border border-[rgba(218,119,86,0.22)] rounded-xl py-2 px-3 text-sm font-semibold text-neutral-700 focus:outline-none shadow-sm">
            <option>Last 7 Days</option><option>Last 14 Days</option><option>Last 30 Days</option>
          </select>
        </div>
      </div>

      <SectionCard className="p-0 overflow-hidden">
        <div className="p-4 bg-[#DA7756] flex justify-between items-start rounded-t-2xl">
          <div>
            <h2 className="text-lg font-bold text-white">HOD Huddle</h2>
            <div className="flex gap-2 mt-1.5">
              <span className="text-xs bg-white/20 px-2 py-1 rounded-xl font-semibold text-white border border-white/20">Head: Unknown</span>
              <span className="text-xs bg-white/20 px-2 py-1 rounded-xl font-semibold text-white border border-white/20">0 Members</span>
            </div>
          </div>
          <button className="p-2 hover:bg-white/15 rounded-xl transition-all text-white active:scale-[0.97]">
            <CalendarIcon className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 bg-white rounded-b-2xl">
          <div className="font-bold text-neutral-700 mb-5 text-sm border-b border-neutral-100 pb-4">Team Members</div>
          <div className="mb-7">
            <div className="flex items-center justify-between mb-3 bg-[#fef6f4] p-3 rounded-2xl border border-[rgba(218,119,86,0.15)]">
              <h3 className="flex items-center gap-2 font-bold text-neutral-700 text-sm">
                <Calendar className="w-4 h-4 text-[#DA7756]" /> Meeting Status (1 week ago)
              </h3>
              <div className="flex gap-1.5">
                <BtnIcon><ArrowLeft className="w-3.5 h-3.5" /></BtnIcon>
                <BtnIcon><ArrowRight className="w-3.5 h-3.5" /></BtnIcon>
              </div>
            </div>
            <div className="grid grid-cols-7 gap-2">
              {lastWeekDates.map(d=>(
                <div key={d.date} className="flex flex-col items-center p-2.5 rounded-2xl border border-red-200 bg-red-50 text-red-500 shadow-sm">
                  <span className="text-[10px] font-bold uppercase tracking-wider">{d.day}</span>
                  <span className="text-xl font-extrabold my-0.5">{d.date}</span>
                  <span className="text-[10px] font-bold uppercase italic">X</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-center gap-5 text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-7 border-b border-neutral-100 pb-7">
            {[['#22c55e','Meeting Done'],['#ef4444','Missed'],['#60a5fa','Holiday']].map(([color,label])=>(
              <span key={label} className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-md" style={{background:color}} /> {label}
              </span>
            ))}
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-7">
            <StatCard title="Meetings This Month" value="2"       sub="19 missed of 21 working days" icon={Calendar}      bgClass="bg-sky-100/90" />
            <StatCard title="Attendance Rate"      value="0.0%"   sub="0/22 attended"                icon={TrendingUp}    bgClass="bg-green-100/90" />
            <StatCard title="Avg Self-Rating"      value="8.6/10" sub="7 ratings"                    icon={Star}          bgClass="bg-violet-100/90" />
            <StatCard title="Unresolved Issues"    value="0"      sub="stuck issues"                 icon={AlertTriangle} bgClass="bg-orange-100/90" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-7">
            {[
              { title:'Attendance Trend',      key:'attendance', color:'#DA7756', gradId:'gradAtt' },
              { title:'KPI Achievement Trend', key:'kpi',        color:'#22c55e', gradId:'gradKPI' },
            ].map(({ title, key, color, gradId }) => (
              <SectionCard key={title}>
                <div className="flex items-center gap-2 mb-4 font-semibold text-neutral-700 text-sm">
                  <TrendingUp className="w-4 h-4 text-[#DA7756]" /> {title}
                </div>
                <ResponsiveContainer width="100%" height={200}>
                  <AreaChart data={trendData} margin={{ top:5,right:0,left:-20,bottom:0 }}>
                    <defs>
                      <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%"  stopColor={color} stopOpacity={0.18} />
                        <stop offset="95%" stopColor={color} stopOpacity={0}    />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize:10, fill:'#a3a3a3' }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize:10, fill:'#a3a3a3' }} domain={[0,100]} />
                    <Tooltip />
                    <Area type="monotone" dataKey={key} stroke={color} strokeWidth={2} fillOpacity={1} fill={`url(#${gradId})`} dot={{ r:3, fill:color }} activeDot={{ r:5 }} />
                  </AreaChart>
                </ResponsiveContainer>
              </SectionCard>
            ))}
          </div>

          <SectionCard className="p-0 overflow-hidden">
            <div className="bg-[#fef6f4] p-4 flex justify-between items-center cursor-pointer hover:bg-[rgba(218,119,86,0.08)] transition-colors rounded-t-2xl"
              onClick={()=>setIsKPIExpanded(!isKPIExpanded)}>
              <div className="flex items-center gap-3">
                <TrendingUp className="text-[#DA7756] w-4 h-4" />
                <span className="font-bold text-neutral-700 text-sm">Team Member KPIs</span>
                <span className="bg-[rgba(218,119,86,0.15)] text-[#DA7756] text-[10px] font-black px-2 py-0.5 rounded-xl">11 KPIs</span>
              </div>
              <ChevronDown className={cn("text-neutral-400 w-4 h-4 transition-transform duration-300",isKPIExpanded?'rotate-180':'')} />
            </div>
            {isKPIExpanded && (
              <div className="divide-y divide-[rgba(218,119,86,0.07)] bg-white rounded-b-2xl">
                {teamKPIs.map((member,i)=>(
                  <div key={i} className="p-4 flex flex-col md:flex-row md:items-center justify-between hover:bg-[#fef6f4] transition-colors gap-3">
                    <div className="flex-1">
                      <div className="font-semibold text-neutral-800 text-sm">{member.name}</div>
                      {member.detail?<div className="mt-0.5 text-xs text-neutral-500">{member.detail}</div>:<div className="text-xs text-neutral-400 mt-0.5">No KPIs assigned</div>}
                    </div>
                    <span className={cn("text-xs font-bold px-3 py-1 rounded-xl border shadow-sm",
                      member.kpis>0?'border-[rgba(218,119,86,0.3)] bg-[rgba(218,119,86,0.1)] text-[#DA7756]':'border-neutral-200 bg-white text-neutral-400'
                    )}>{member.kpis} KPIs</span>
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
// Analytics Tab
// ─────────────────────────────────────────────
const CustomAnalyticsTooltip = ({ active, payload, label }) => {
  if (!active||!payload||!payload.length) return null;
  return (
    <div className="bg-white border border-[rgba(218,119,86,0.22)] p-3 rounded-2xl shadow-lg text-sm font-semibold">
      <div className="text-neutral-500 mb-2">{label}</div>
      {payload.map((e,i)=><div key={i} className="flex items-center gap-2 mb-1" style={{color:e.color}}>{e.name}: {e.value}</div>)}
    </div>
  );
};

const AnalyticsTab = () => {
  const [timeFilter, setTimeFilter] = useState('Last 14 Days');
  const KPICard = ({ title, value, icon:Icon, bgClass }) => (
    <Card className={cn("border-0 shadow-sm rounded-2xl p-4", bgClass)}>
      <div className="flex flex-col items-center text-center">
        <Icon className="mb-2 h-6 w-6 opacity-60" />
        <p className="text-2xl font-bold text-neutral-900">{value}</p>
        <p className="mt-0.5 text-xs font-medium text-neutral-600">{title}</p>
      </div>
    </Card>
  );

  return (
    <div className="pb-12 space-y-5">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h2 className="text-xl font-bold text-neutral-900">Team Analytics</h2>
        <div className="relative">
          <select value={timeFilter} onChange={e=>setTimeFilter(e.target.value)}
            className="appearance-none bg-white border border-[rgba(218,119,86,0.22)] rounded-xl py-2 pl-4 pr-8 text-sm font-semibold text-neutral-700 focus:outline-none shadow-sm">
            <option>Last 7 Days</option><option>Last 14 Days</option><option>Last 30 Days</option>
          </select>
          <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none w-3.5 h-3.5" />
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <KPICard title="Total Users"      value="0" icon={Users}         bgClass="bg-sky-100/90"    />
        <KPICard title="Active Reporters" value="0" icon={TrendingUp}    bgClass="bg-green-100/90"  />
        <KPICard title="Lagging"          value="0" icon={TrendingDown}  bgClass="bg-orange-100/90" />
        <KPICard title="Not Reporting"    value="0" icon={AlertTriangle} bgClass="bg-violet-100/90" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <SectionCard>
          <div className="flex items-center gap-2 mb-4 font-semibold text-neutral-700 text-sm">
            <Activity className="w-4 h-4 text-[#DA7756]" /> Daily Activity Trend
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <ReLineChart data={analyticsActivityData} margin={{ top:5,right:10,left:-20,bottom:0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={true} stroke="#e2e8f0" />
              <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize:11, fill:'#a3a3a3' }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize:11, fill:'#a3a3a3' }} domain={[0,24]} />
              <Tooltip content={<CustomAnalyticsTooltip />} />
              <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize:'12px', fontWeight:'600', color:'#737373' }} />
              <Line type="monotone" dataKey="reports"         name="Reports"         stroke="#DA7756" strokeWidth={2} dot={{ r:3,fill:'#DA7756' }} activeDot={{ r:5 }} />
              <Line type="monotone" dataKey="accomplishments" name="Accomplishments" stroke="#22c55e" strokeWidth={2} dot={{ r:3,fill:'#22c55e' }} activeDot={{ r:5 }} />
              <Line type="monotone" dataKey="stuck"           name="Stuck Issues"    stroke="#eab308" strokeWidth={2} dot={{ r:3,fill:'#eab308' }} activeDot={{ r:5 }} />
            </ReLineChart>
          </ResponsiveContainer>
        </SectionCard>
        <SectionCard>
          <div className="flex items-center gap-2 mb-4 font-semibold text-neutral-700 text-sm">
            <Users className="w-4 h-4 text-[#DA7756]" /> Department Performance
          </div>
          <div className="border-2 border-dashed border-[rgba(218,119,86,0.2)] rounded-2xl flex items-center justify-center min-h-[200px]">
            <p className="text-xs text-neutral-400">No data available</p>
          </div>
        </SectionCard>
      </div>

      <SectionCard>
        <div className="flex items-center gap-2 mb-5 font-bold text-neutral-900 text-base">
          <Building2 className="w-5 h-5 text-[#DA7756]" /> Department Reporting Summary
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {departmentsList.map((dept,idx)=>(
            <div key={idx} className="bg-white border border-[rgba(218,119,86,0.15)] rounded-2xl p-4 shadow-sm relative flex flex-col justify-between min-h-[120px] hover:shadow-md transition-shadow">
              <div className="absolute top-3 right-3 bg-[#DA7756] text-white text-[10px] font-bold px-2 py-0.5 rounded-xl shadow-sm">0%</div>
              <div className="mb-3 pr-10">
                <h4 className="font-bold text-neutral-800 text-sm">{dept}</h4>
                <p className="text-[11px] text-neutral-400 mt-0.5">0 members</p>
              </div>
              <div className="flex justify-between items-end border-t border-[rgba(218,119,86,0.08)] pt-2.5">
                {[['TODAY'],['THIS WEEK']].map(([label])=>(
                  <div key={label}>
                    <div className="text-[10px] font-bold text-neutral-400 mb-1">{label}</div>
                    <div className="flex items-baseline gap-2">
                      <div className="flex flex-col items-center"><span className="text-base font-black text-green-500 leading-none">0</span><span className="text-[9px] font-bold text-neutral-400">Done</span></div>
                      <div className="flex flex-col items-center"><span className="text-base font-black text-red-500 leading-none">0</span><span className="text-[9px] font-bold text-neutral-400">Pending</span></div>
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
// Settings Tab
// ─────────────────────────────────────────────
const SettingsTab = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode,   setModalMode]   = useState('create');
  const [isMenuOpen,  setIsMenuOpen]  = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handler = (e) => { if (menuRef.current && !menuRef.current.contains(e.target)) setIsMenuOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const openCreateModal = () => { setModalMode('create'); setIsModalOpen(true); };
  const openEditModal   = () => { setModalMode('edit');   setIsModalOpen(true); setIsMenuOpen(false); };

  const daysOfWeek = [
    {label:'Sun',active:false},{label:'Mon',active:true},{label:'Tue',active:true},
    {label:'Wed',active:true},{label:'Thu',active:true},{label:'Fri',active:true},{label:'Sat',active:true},
  ];

  return (
    <div className="pb-12 space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-neutral-900">Daily Meeting Configurations</h2>
          <p className="text-sm text-neutral-500 mt-0.5">Configure recurring daily meetings and their participants</p>
        </div>
        <BtnPrimary onClick={openCreateModal} icon={Plus} className="w-fit">New Meeting</BtnPrimary>
      </div>

      <SectionCard>
        <div className="flex items-center gap-5 text-sm flex-wrap text-neutral-700">
          <div className="font-bold text-neutral-900">1 Active Meetings</div>
          <div className="text-neutral-500">11 Total Members</div>
          <div className="flex items-center gap-1.5 text-neutral-500 ml-auto">
            <Clock className="w-4 h-4 text-[#DA7756]" /> Next: We at 10:00
          </div>
        </div>
      </SectionCard>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 w-4 h-4" />
          <input type="text" placeholder="Search meetings..." className="w-full pl-9 pr-4 py-2 bg-white border border-[rgba(218,119,86,0.22)] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[rgba(218,119,86,0.25)] shadow-sm" />
        </div>
        <div className="relative w-full sm:w-56">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 w-4 h-4" />
          <select className="w-full appearance-none pl-9 pr-8 py-2 bg-white border border-[rgba(218,119,86,0.22)] rounded-xl text-sm font-semibold text-neutral-700 focus:outline-none shadow-sm">
            <option>All Heads</option>
          </select>
          <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none w-3.5 h-3.5" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        <div className="bg-white border border-[rgba(218,119,86,0.18)] rounded-2xl shadow-sm p-5 relative flex flex-col hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-4 relative" ref={menuRef}>
            <div>
              <h3 className="text-base font-bold text-neutral-900 mb-2">HOD Huddle</h3>
              <div className="flex items-center gap-2 mb-3">
                <span className="flex items-center gap-1.5 bg-[rgba(218,119,86,0.1)] text-[#DA7756] text-xs font-bold px-2.5 py-1 rounded-xl border border-[rgba(218,119,86,0.2)] shadow-sm">
                  <Clock className="w-3 h-3" /> 10:00
                </span>
              </div>
              <div className="flex gap-1.5 flex-wrap">
                <span className="text-[10px] font-bold text-neutral-400 px-1">Su</span>
                {['Mo','Tu','We','Th','Fr','Sa'].map(d=>(
                  <span key={d} className="text-[10px] font-bold bg-[rgba(218,119,86,0.1)] text-[#DA7756] px-1.5 py-0.5 rounded-xl">{d}</span>
                ))}
              </div>
            </div>
            <button onClick={()=>setIsMenuOpen(!isMenuOpen)} className="p-1.5 text-neutral-400 hover:bg-[#fef6f4] rounded-xl transition-colors">
              <MoreHorizontal className="w-5 h-5" />
            </button>
            {isMenuOpen && (
              <div className="absolute right-0 top-8 bg-white border border-[rgba(218,119,86,0.18)] shadow-lg rounded-2xl w-32 py-1 z-10">
                <button onClick={openEditModal} className="w-full text-left px-3 py-2 text-sm font-semibold text-neutral-700 hover:bg-[#fef6f4] flex items-center gap-2">
                  <Edit className="w-3.5 h-3.5 text-[#DA7756]" /> Edit
                </button>
                <button className="w-full text-left px-3 py-2 text-sm font-semibold text-red-600 hover:bg-red-50 flex items-center gap-2">
                  <Trash className="w-3.5 h-3.5" /> Delete
                </button>
              </div>
            )}
          </div>

          <div className="border-t border-[rgba(218,119,86,0.1)] my-3" />

          <div className="mb-4 flex-1">
            <div className="text-[10px] font-black text-neutral-400 uppercase tracking-widest mb-2">Meeting Head</div>
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 rounded-full bg-[#DA7756] text-white flex items-center justify-center font-bold text-sm shadow-sm">?</div>
              <span className="font-bold text-neutral-800 text-sm">Unknown</span>
            </div>
            <div className="text-[10px] font-black text-neutral-400 uppercase tracking-widest mb-2">Members</div>
            <p className="text-xs text-neutral-400 italic">No members assigned</p>
          </div>

          <div className="border-t border-[rgba(218,119,86,0.1)] my-3" />

          <div className="mb-4">
            <div className="text-[10px] font-black text-neutral-400 uppercase tracking-widest mb-2">This Week</div>
            <div className="flex gap-1.5">
              {[{lbl:'M',status:'missed'},{lbl:'T',status:'upcoming'},{lbl:'W',status:'upcoming'},{lbl:'T',status:'off'},{lbl:'F',status:'off'},{lbl:'S',status:'off'},{lbl:'S',status:'off'}].map(({lbl,status},i)=>(
                <div key={i} className={cn("flex flex-col items-center gap-1",status==='off'?'opacity-35':'')}>
                  <span className="text-[10px] font-bold text-neutral-500">{lbl}</span>
                  <div className={cn("w-6 h-6 rounded-xl flex items-center justify-center border shadow-sm",
                    status==='missed'?'bg-red-50 border-red-200':'bg-[#fef6f4] border-[rgba(218,119,86,0.18)]'
                  )}>
                    {status!=='off'&&<div className={cn("w-2 h-2 rounded-full",status==='missed'?'bg-red-500':'bg-[rgba(218,119,86,0.35)]')} />}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <span className="inline-flex w-fit items-center px-2.5 py-1 rounded-xl bg-[rgba(218,119,86,0.1)] border border-[rgba(218,119,86,0.22)] text-[#DA7756] text-[11px] font-bold shadow-sm">
            Default Meeting
          </span>
        </div>
      </div>

      {isModalOpen && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-[500px] flex flex-col relative border border-[rgba(218,119,86,0.18)] max-h-[90vh] overflow-hidden">
            <BtnIcon onClick={()=>setIsModalOpen(false)} className="absolute top-4 right-4 z-10"><X className="w-3.5 h-3.5" /></BtnIcon>
            <div className="p-5 pb-4 overflow-y-auto flex-1">
              <h3 className="text-lg font-bold text-neutral-900 mb-1.5">
                {modalMode==='create'?'Create Meeting Configuration':'Edit Meeting Configuration'}
              </h3>
              <p className="text-xs text-neutral-500 mb-5">Configure a recurring daily meeting. This will auto-select when the meeting head logs in to record minutes.</p>
              <div className="space-y-4">
                <div className="flex gap-3">
                  <div className="flex-1">
                    <label className="block text-xs font-bold text-neutral-700 mb-1.5">Meeting Name <span className="text-red-500">*</span></label>
                    <input type="text" defaultValue={modalMode==='edit'?'HOD Huddle':''} placeholder="e.g., Sales Team Daily Stand-up"
                      className="w-full px-3 py-2 bg-[#fef6f4] border border-[rgba(218,119,86,0.22)] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[rgba(218,119,86,0.25)]" />
                  </div>
                  <div className="w-28">
                    <label className="block text-xs font-bold text-neutral-700 mb-1.5">Time</label>
                    <input type="time" defaultValue={modalMode==='edit'?'10:00':''}
                      className="w-full px-3 py-2 bg-[#fef6f4] border border-[rgba(218,119,86,0.22)] rounded-xl text-sm focus:outline-none" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-2">Meeting Days</label>
                  <div className="flex flex-wrap gap-1.5">
                    {daysOfWeek.map(day=>(
                      <button key={day.label} className={cn("px-3 py-1.5 rounded-xl text-sm font-semibold transition-all shadow-sm active:scale-[0.96]",
                        day.active?'bg-[#DA7756] text-white':'bg-neutral-100 text-neutral-600 border border-neutral-200 hover:bg-[#fef6f4]'
                      )}>{day.label}</button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1.5">Meeting Head <span className="text-red-500">*</span></label>
                  <select className="w-full px-3 py-2.5 bg-[#fef6f4] border border-[rgba(218,119,86,0.22)] rounded-xl text-sm text-neutral-700 focus:outline-none">
                    <option>Select meeting head</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1.5">Department (Optional)</label>
                  <select className="w-full px-3 py-2.5 bg-[#fef6f4] border border-[rgba(218,119,86,0.22)] rounded-xl text-sm text-neutral-700 focus:outline-none">
                    <option>Select department</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1.5">Meeting Members</label>
                  <input type="text" placeholder="Search members..." className="w-full px-3 py-2.5 bg-[#fef6f4] border border-[rgba(218,119,86,0.22)] rounded-xl text-sm focus:outline-none" />
                </div>
                <div className="flex items-center gap-2">
                  <input type="checkbox" id="default-meeting" defaultChecked={modalMode==='edit'}
                    className="w-4 h-4 rounded border-[rgba(218,119,86,0.4)] cursor-pointer" style={{ accentColor:C.primary }} />
                  <label htmlFor="default-meeting" className="text-sm font-bold text-neutral-800 cursor-pointer">Set as default meeting</label>
                </div>
              </div>
            </div>
            <div className="p-4 border-t border-neutral-100 flex justify-end gap-2 bg-[#fef6f4] rounded-b-2xl shrink-0">
              <BtnOutline onClick={()=>setIsModalOpen(false)}>Cancel</BtnOutline>
              <BtnPrimary onClick={()=>setIsModalOpen(false)}>{modalMode==='create'?'Create':'Update'}</BtnPrimary>
            </div>
          </div>
        </div>,
        document.body
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
    <div className="p-6 space-y-6 max-w-7xl mx-auto" style={{ background:'#ffffff', color:C.textMain }}>
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-[#1a1a1a]">Daily Meetings</h1>
          <p className="text-gray-500 mt-1">Review daily reports and conduct team standups</p>
        </div>
      </div>

      <div className="flex space-x-1 bg-[#DA7756] rounded-2xl p-1 overflow-x-auto">
        {tabs.map((tab) => {
          const Icon=tab.icon, isActive=activeTab===tab.name;
          return (
            <button key={tab.name} onClick={()=>setActiveTab(tab.name)}
              className={cn("flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-150 whitespace-nowrap flex-1",
                isActive?"bg-white text-[#DA7756] shadow-sm":"bg-transparent text-white/75 hover:bg-white/15 hover:text-white"
              )}>
              <Icon className="w-4 h-4 flex-shrink-0" />{tab.name}
            </button>
          );
        })}
      </div>

      <div>
        {activeTab==='Daily'     && <DailyTab      selectedDateId={selectedDateId} setSelectedDateId={setSelectedDateId} />}
        {activeTab==='Daily Log' && <DailyLogTab   selectedDateId={selectedDateId} setSelectedDateId={setSelectedDateId} />}
        {activeTab==='History'   && <HistoryTab    />}
        {activeTab==='Reports'   && <ReportsTab    />}
        {activeTab==='Analytics' && <AnalyticsTab  />}
        {activeTab==='Settings'  && <SettingsTab   />}
      </div>
    </div>
  );
};

export default DailyMeeting;