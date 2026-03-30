import React, { useState } from 'react';
import { 
  Calendar, FileText, History, BarChart2, Settings, 
  ChevronDown, AlertTriangle, FileSpreadsheet 
} from 'lucide-react';

// ── Design Tokens (from BusinessPlanAndGoles) ──
const C = {
  primary:     '#DA7756',
  primaryHov:  '#c9674a',
  primaryBg:   '#fef6f4',
  primaryTint: 'rgba(218,119,86,0.10)',
  primaryBord: 'rgba(218,119,86,0.22)',
  textMain:    '#171717',
  textMuted:   '#737373',
  borderLgt:   '#ede8e5',
};

// Mock Data for Dates
const datesData = [
  { id: 1, dateNum: "24", day: "TUE", monthYear: "Mar, 2026", status: "missed",   label: "Miss"    },
  { id: 2, dateNum: "25", day: "WED", monthYear: "Mar, 2026", status: "missed",   label: "Miss"    },
  { id: 3, dateNum: "26", day: "THU", monthYear: "Mar, 2026", status: "done",     label: "Done"    },
  { id: 4, dateNum: "27", day: "FRI", monthYear: "Mar, 2026", status: "done",     label: "Done"    },
  { id: 5, dateNum: "28", day: "SAT", monthYear: "Mar, 2026", status: "holiday",  label: "Holiday" },
  { id: 6, dateNum: "29", day: "SUN", monthYear: "Mar, 2026", status: "holiday",  label: "Holiday" },
  { id: 7, dateNum: "30", day: "MON", monthYear: "Mar, 2026", status: "missed",   label: "Miss"    },
  { id: 8, dateNum: "31", day: "TUE", monthYear: "Mar, 2026", status: "upcoming", label: ""        },
  { id: 9, dateNum: "1",  day: "WED", monthYear: "Apr, 2026", status: "upcoming", label: ""        },
];

// Status → colors mapping (semantic colors stay, accent wraps from C.primary)
const statusColors: Record<string, { bg: string; border: string; text: string }> = {
  missed:   { bg: '#ef4444', border: '#ef4444',  text: '#fff'     },
  done:     { bg: '#22c55e', border: '#22c55e',  text: '#fff'     },
  holiday:  { bg: '#f59e0b', border: '#f59e0b',  text: '#fff'     },
  upcoming: { bg: '#f3f4f6', border: C.borderLgt, text: '#9ca3af' },
};

const DailyMeeting = () => {
  const [selectedDateId, setSelectedDateId] = useState(1);
  const [activeTab, setActiveTab] = useState('Daily');

  const selectedDate = datesData.find(d => d.id === selectedDateId) || datesData[0];
  const fullDateString = `${selectedDate.dateNum} ${selectedDate.monthYear} (${selectedDate.day.charAt(0) + selectedDate.day.slice(1).toLowerCase()})`;

  const tabs = [
    { name: 'Daily',     icon: Calendar       },
    { name: 'Daily Log', icon: FileText        },
    { name: 'History',   icon: History        },
    { name: 'Reports',   icon: FileSpreadsheet },
    { name: 'Analytics', icon: BarChart2      },
    { name: 'Settings',  icon: Settings       },
  ];

  return (
    <div
      className="min-h-screen p-6 font-sans"
      style={{ background: '#fafafa', color: C.textMain }}
    >
      {/* ── Page Header ── */}
      <div className="mb-6">
        <div
          className="text-[13px] font-bold uppercase tracking-wide mb-1"
          style={{ color: C.textMuted }}
        >
          Team standup &amp; accountability
        </div>
        <h1 className="text-2xl font-black" style={{ color: C.textMain }}>
          Daily Meetings
        </h1>
      </div>

      {/* ── Top Tabs ── */}
      <div
        className="flex space-x-1 mb-6 border-b pb-0"
        style={{ borderColor: C.borderLgt }}
      >
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.name;
          return (
            <button
              key={tab.name}
              onClick={() => setActiveTab(tab.name)}
              className="flex items-center gap-2 px-4 py-3 text-sm font-bold transition-colors border-b-[3px]"
              style={{
                borderColor:  isActive ? C.primary : 'transparent',
                color:        isActive ? C.primary : C.textMuted,
                background:   'transparent',
              }}
              onMouseEnter={e => { if (!isActive) (e.currentTarget as HTMLButtonElement).style.color = C.textMain; }}
              onMouseLeave={e => { if (!isActive) (e.currentTarget as HTMLButtonElement).style.color = C.textMuted; }}
            >
              <Icon className="w-4 h-4" />
              {tab.name}
            </button>
          );
        })}
      </div>

      {/* ── Main Content Card ── */}
      <div
        className="rounded-2xl shadow-sm border p-6 mb-6"
        style={{ background: '#fff', borderColor: C.borderLgt }}
      >
        {/* Huddle Header */}
        <div className="flex items-center gap-3 mb-6">
          <div
            className="p-2 rounded-xl"
            style={{ background: C.primaryBg, border: `1px solid ${C.primaryBord}` }}
          >
            <FileText className="w-5 h-5" style={{ color: C.primary }} />
          </div>
          <div>
            <h2 className="text-xl font-black" style={{ color: C.textMain }}>
              HOD Huddle — Daily Meeting
            </h2>
            <p className="text-[13px] font-medium" style={{ color: C.textMuted }}>
              {fullDateString}
            </p>
          </div>
        </div>

        {/* Date Selector Carousel */}
        <div className="flex gap-3 overflow-x-auto pb-4 mb-4 items-center">
          {datesData.map((date) => {
            const sc = statusColors[date.status];
            const isSelected = selectedDate.id === date.id;
            return (
              <div
                key={date.id}
                onClick={() => setSelectedDateId(date.id)}
                className="flex-shrink-0 flex flex-col items-center justify-center rounded-xl cursor-pointer transition-all"
                style={{
                  width:       72,
                  height:      88,
                  background:  sc.bg,
                  border:      `2px solid ${isSelected ? C.primary : sc.border}`,
                  color:       sc.text,
                  boxShadow:   isSelected ? `0 0 0 3px ${C.primaryBord}` : undefined,
                  transform:   isSelected ? 'scale(1.07)' : 'scale(1)',
                }}
              >
                <span className="text-[10px] font-bold uppercase tracking-wider opacity-90">
                  {date.day}
                </span>
                <span className="text-2xl font-extrabold leading-none my-0.5">
                  {date.dateNum}
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider">
                  {date.label}
                </span>
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="flex flex-col items-center justify-center mb-6">
          <div className="flex gap-6 text-sm font-medium" style={{ color: C.textMuted }}>
            {[
              { color: '#22c55e', label: 'Meeting Done'   },
              { color: '#ef4444', label: 'Meeting Missed' },
              { color: '#f59e0b', label: 'Holiday'        },
              { color: '#f3f4f6', label: 'Upcoming'       },
            ].map(({ color, label }) => (
              <div key={label} className="flex items-center gap-2">
                <span
                  className="w-3 h-3 rounded-sm inline-block"
                  style={{ background: color, border: color === '#f3f4f6' ? `1px solid ${C.borderLgt}` : undefined }}
                />
                {label}
              </div>
            ))}
          </div>
          <p className="text-xs mt-2 italic" style={{ color: C.textMuted }}>
            Note: Select the date for which users have filled the report, not the date on which meeting is conducted.
          </p>
        </div>

        {/* Missed Warning Alert */}
        {selectedDate.status === 'missed' && (
          <div
            className="rounded-xl p-4"
            style={{
              background: C.primaryBg,
              border:     `1px solid ${C.primaryBord}`,
            }}
          >
            <div
              className="flex items-center gap-2 font-bold mb-3 text-sm"
              style={{ color: C.primary }}
            >
              <AlertTriangle className="w-4 h-4" />
              Missed Meetings on {selectedDate.monthYear.split(',')[0]}{' '}
              {selectedDate.dateNum}, {selectedDate.monthYear.split(', ')[1]}
            </div>
            <span
              className="inline-block text-xs font-bold px-3 py-1 rounded-lg"
              style={{
                background: C.primaryTint,
                color:      C.primaryHov,
                border:     `1px solid ${C.primaryBord}`,
              }}
            >
              HOD Huddle
            </span>
          </div>
        )}
      </div>

      {/* ── Filters & Content Section ── */}
      <div
        className="rounded-2xl shadow-sm border"
        style={{ background: '#fff', borderColor: C.borderLgt }}
      >
        {/* Filter Bar */}
        <div
          className="flex items-center gap-6 p-4 border-b"
          style={{ borderColor: C.borderLgt }}
        >
          {[
            { label: 'MEETING', value: 'HOD Huddle'   },
            { label: 'MEMBER',  value: 'All Members'  },
          ].map(({ label, value }) => (
            <div key={label} className="flex items-center gap-2">
              <span
                className="text-xs font-bold tracking-wider"
                style={{ color: C.textMuted }}
              >
                {label}
              </span>
              <button
                className="flex items-center justify-between px-3 py-1.5 rounded-xl text-sm font-bold transition-colors"
                style={{
                  minWidth:     140,
                  border:       `1px solid ${C.borderLgt}`,
                  color:        C.textMain,
                  background:   '#fff',
                }}
                onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.background = C.primaryBg}
                onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.background = '#fff'}
              >
                {value}
                <ChevronDown className="w-4 h-4 ml-2" style={{ color: C.textMuted }} />
              </button>
            </div>
          ))}
        </div>

        {/* Daily Reports Area */}
        <div className="p-6">
          <div className="flex justify-between items-start mb-12">
            <div>
              <h3 className="font-black text-lg" style={{ color: C.textMain }}>
                Daily Reports for HOD Huddle
              </h3>
              <p className="text-xs font-medium mt-0.5" style={{ color: C.textMuted }}>
                {fullDateString}
              </p>
            </div>

            {/* Stats Pills */}
            <div className="flex items-center gap-4 text-sm font-bold" style={{ color: C.textMuted }}>
              <div className="flex items-center gap-2">
                Team:
                <span
                  className="px-2 py-0.5 rounded-full text-xs font-bold"
                  style={{ background: C.primaryTint, color: C.primary }}
                >
                  8
                </span>
              </div>
              <div className="flex items-center gap-2">
                Submitted:
                <span className="bg-green-100 text-green-800 px-2 py-0.5 rounded-full text-xs font-bold">
                  0
                </span>
              </div>
              <div className="flex items-center gap-2">
                Missed:
                <span className="bg-red-100 text-red-800 px-2 py-0.5 rounded-full text-xs font-bold">
                  8
                </span>
              </div>
            </div>
          </div>

          {/* Empty State */}
          <div className="flex flex-col items-center justify-center pb-12 opacity-40">
            <div className="relative mb-4">
              <FileText
                className="w-20 h-20"
                style={{ color: C.primary }}
                strokeWidth={1}
              />
              <AlertTriangle
                className="w-6 h-6 absolute bottom-0 right-0"
                style={{ color: C.textMuted }}
              />
            </div>
            <p className="text-sm font-bold" style={{ color: C.textMuted }}>
              No reports submitted for this date
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DailyMeeting;