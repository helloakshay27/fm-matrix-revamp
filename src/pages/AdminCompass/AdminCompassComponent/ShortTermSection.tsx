import React, { useState, useEffect, useCallback, useRef } from 'react';
import ReactDOM from 'react-dom';

// ── Design Tokens ──
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

// ── BASE URL ──
export const BASE_URL = 'https://fm-uat-api.lockated.com';

// ── Helpers ──
const getAuthHeaders = (): Record<string, string> => {
  const token = localStorage.getItem('auth_token') || '';
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: token } : {}),
  };
};

// DD-MM-YYYY → YYYY-MM-DD (for API)
const formatDateForApi = (dateStr: string): string => {
  if (!dateStr) return '';
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return dateStr;
  const parts = dateStr.split('-');
  if (parts.length === 3 && parts[2].length === 4)
    return `${parts[2]}-${parts[1]}-${parts[0]}`;
  return dateStr;
};

// YYYY-MM-DD → DD-MM-YYYY (for DatePicker display)
const apiDateToDisplay = (dateStr: string): string => {
  if (!dateStr) return '';
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
    const [y, m, d] = dateStr.split('-');
    return `${d}-${m}-${y}`;
  }
  return dateStr;
};

const parseDDMMYYYY = (s: string): Date | null => {
  if (!s) return null;
  const [d, m, y] = s.split('-').map(Number);
  if (!d || !m || !y) return null;
  const dt = new Date(y, m - 1, d);
  return isNaN(dt.getTime()) ? null : dt;
};

const toDDMMYYYY = (dt: Date): string =>
  `${String(dt.getDate()).padStart(2, '0')}-${String(dt.getMonth() + 1).padStart(2, '0')}-${dt.getFullYear()}`;

const MONTHS     = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const DAYS_SHORT = ['Su','Mo','Tu','We','Th','Fr','Sa'];

const sliderBg = (pct: number) =>
  `linear-gradient(to right, ${C.primary} ${pct}%, #e5e7eb ${pct}%)`;

const clampProgress = (val: any): number => {
  const n = Math.round(Number(val));
  return isNaN(n) ? 0 : Math.min(100, Math.max(0, n));
};

// ── Period mapping ──
const mapPeriodToApi = (label: string): string => {
  const map: Record<string, string> = {
    'This Year':    'this_year',
    'This Quarter': 'this_quarter',
    'BHAG':         'BHAG',
    '3-5 Years':    'three_to_five_years',
  };
  return map[label] || 'this_year';
};

// ── Icons ──
const InfoIcon = () => (
  <svg className="w-4 h-4" style={{ color: C.textMuted }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);
const EditIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
  </svg>
);
const TrashIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
  </svg>
);
const CalendarLargeIcon = () => (
  <svg className="w-5 h-5" style={{ color: C.primary }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);
const TrendIcon = () => (
  <svg className="w-4 h-4" style={{ color: C.primary }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
  </svg>
);
const LoaderIcon = ({ className = 'w-4 h-4' }: { className?: string }) => (
  <svg className={`${className} animate-spin`} fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth={4} />
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
  </svg>
);
const CalendarIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);
const ChevronLeft = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
  </svg>
);
const ChevronRight = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
  </svg>
);

// ── Theme Styles ──
const ThemeStyle = () => (
  <style>{`
    .st-goal-slider, .st-modal-slider {
      -webkit-appearance: none; appearance: none;
      width: 100%; height: 6px; border-radius: 99px; outline: none; cursor: pointer;
    }
    .st-goal-slider::-webkit-slider-thumb, .st-modal-slider::-webkit-slider-thumb {
      -webkit-appearance: none; appearance: none;
      width: 16px; height: 16px; border-radius: 50%;
      background: ${C.primary}; cursor: pointer; border: 2px solid white;
      box-shadow: 0 1px 4px rgba(0,0,0,0.25); transition: transform 0.15s;
    }
    .st-modal-slider::-webkit-slider-thumb { width: 18px; height: 18px; }
    .st-goal-slider::-webkit-slider-thumb:hover,
    .st-modal-slider::-webkit-slider-thumb:hover { transform: scale(1.2); }
    .st-goal-slider::-moz-range-thumb, .st-modal-slider::-moz-range-thumb {
      width: 16px; height: 16px; border-radius: 50%;
      background: ${C.primary}; cursor: pointer; border: 2px solid white;
    }
    .st-modal-portal {
      position: fixed; inset: 0; z-index: 99999;
      display: flex; align-items: center; justify-content: center; padding: 16px;
      background: rgba(0,0,0,0.45); backdrop-filter: blur(3px); -webkit-backdrop-filter: blur(3px);
    }
    .st-modal-box {
      background: ${C.primaryBg}; border-radius: 20px;
      border: 1px solid ${C.primaryBord}; box-shadow: 0 30px 80px rgba(0,0,0,0.25);
      width: 100%; display: flex; flex-direction: column;
      max-height: 90vh; position: relative; overflow: hidden;
    }
    .st-input {
      width: 100%; border: 1px solid ${C.borderLgt}; border-radius: 12px;
      padding: 10px 12px; font-size: 13px; color: ${C.textMain}; background: #ffffff;
      transition: border-color 0.15s, box-shadow 0.15s; outline: none; box-sizing: border-box;
    }
    .st-input:focus { border-color: ${C.primary}; box-shadow: 0 0 0 3px rgba(218,119,86,0.15); }
    .st-input::placeholder { color: #a3a3a3; }
    .st-textarea {
      width: 100%; border: 1px solid ${C.borderLgt}; border-radius: 12px;
      padding: 10px 12px; font-size: 13px; color: ${C.textMain}; background: #ffffff;
      transition: border-color 0.15s, box-shadow 0.15s; outline: none; box-sizing: border-box;
      min-height: 72px; resize: vertical; font-family: inherit;
    }
    .st-textarea:focus { border-color: ${C.primary}; box-shadow: 0 0 0 3px rgba(218,119,86,0.15); }
    .st-textarea::placeholder { color: #a3a3a3; }
    .st-select {
      width: 100%; border: 1px solid ${C.borderLgt}; border-radius: 12px;
      padding: 10px 36px 10px 12px; font-size: 13px; color: ${C.textMain}; background: #ffffff;
      appearance: none; -webkit-appearance: none;
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23a3a3a3'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E");
      background-repeat: no-repeat; background-position: right 10px center; background-size: 16px;
      cursor: pointer; transition: border-color 0.15s, box-shadow 0.15s; outline: none; box-sizing: border-box;
    }
    .st-select:focus { border-color: ${C.primary}; box-shadow: 0 0 0 3px rgba(218,119,86,0.15); }
    .st-skeleton {
      background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
      background-size: 200% 100%; animation: st-shimmer 1.4s infinite; border-radius: 8px;
    }
    @keyframes st-shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }
    .st-label { display: block; font-size: 13px; font-weight: 600; color: ${C.textMain}; margin-bottom: 6px; }
    .st-dp-wrap { position: relative; }
    .st-dp-input-btn {
      width: 100%; border: 1px solid ${C.borderLgt}; border-radius: 12px;
      padding: 10px 12px; font-size: 13px; color: ${C.textMain}; background: #ffffff;
      display: flex; align-items: center; justify-content: space-between;
      cursor: pointer; transition: border-color 0.15s, box-shadow 0.15s; outline: none; box-sizing: border-box;
    }
    .st-dp-input-btn:focus, .st-dp-input-btn.open {
      border-color: ${C.primary}; box-shadow: 0 0 0 3px rgba(218,119,86,0.15);
    }
    .st-dp-input-btn .placeholder { color: #a3a3a3; }
    .st-dp-calendar {
      position: absolute; top: calc(100% + 6px); left: 0; z-index: 99999;
      background: #ffffff; border: 1px solid ${C.borderLgt}; border-radius: 16px;
      box-shadow: 0 12px 40px rgba(0,0,0,0.15); padding: 16px; width: 280px;
      animation: st-dp-in 0.15s ease;
    }
    @keyframes st-dp-in { from { opacity: 0; transform: translateY(-4px); } to { opacity: 1; transform: translateY(0); } }
    .st-dp-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px; }
    .st-dp-nav { background: none; border: none; padding: 6px; border-radius: 8px; cursor: pointer; color: ${C.textMuted}; display: flex; align-items: center; }
    .st-dp-nav:hover { background: ${C.primaryTint}; color: ${C.primary}; }
    .st-dp-month-year { font-size: 14px; font-weight: 700; color: ${C.textMain}; cursor: pointer; padding: 4px 8px; border-radius: 8px; }
    .st-dp-month-year:hover { background: ${C.primaryTint}; color: ${C.primary}; }
    .st-dp-grid { display: grid; grid-template-columns: repeat(7, 1fr); gap: 2px; }
    .st-dp-dow { text-align: center; font-size: 11px; font-weight: 700; color: ${C.textMuted}; padding: 4px 0 8px; }
    .st-dp-day {
      aspect-ratio: 1; display: flex; align-items: center; justify-content: center;
      font-size: 12px; font-weight: 500; border-radius: 8px; cursor: pointer;
      color: ${C.textMain}; border: none; background: none; transition: background 0.1s, color 0.1s;
    }
    .st-dp-day:hover:not(.empty):not(.selected) { background: ${C.primaryTint}; color: ${C.primary}; }
    .st-dp-day.today:not(.selected) { color: ${C.primary}; font-weight: 800; }
    .st-dp-day.selected { background: ${C.primary}; color: #fff; font-weight: 700; }
    .st-dp-day.empty { cursor: default; }
    .st-dp-months, .st-dp-years { display: grid; grid-template-columns: repeat(3, 1fr); gap: 6px; padding: 4px 0; }
    .st-dp-mitem, .st-dp-yitem {
      text-align: center; padding: 8px 4px; border-radius: 10px; font-size: 13px;
      font-weight: 600; cursor: pointer; color: ${C.textMain}; transition: background 0.1s;
    }
    .st-dp-mitem:hover, .st-dp-yitem:hover { background: ${C.primaryTint}; color: ${C.primary}; }
    .st-dp-mitem.active, .st-dp-yitem.active { background: ${C.primary}; color: #fff; }
    .st-dp-clear { margin-top: 10px; padding-top: 10px; border-top: 1px solid ${C.borderLgt}; text-align: center; }
    .st-dp-clear button { font-size: 12px; font-weight: 600; color: ${C.textMuted}; background: none; border: none; cursor: pointer; padding: 4px 12px; border-radius: 8px; }
    .st-dp-clear button:hover { background: #f3f4f6; color: ${C.textMain}; }
  `}</style>
);

// ── DatePicker ──
interface DatePickerProps {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
}
const DatePicker: React.FC<DatePickerProps> = ({ value, onChange, placeholder = 'Select date' }) => {
  const today  = new Date();
  const parsed = parseDDMMYYYY(value);
  const [open, setOpen]     = useState(false);
  const [view, setView]     = useState<'days' | 'months' | 'years'>('days');
  const [cursor, setCursor] = useState<Date>(parsed || new Date(today.getFullYear(), today.getMonth(), 1));
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const openPicker = () => {
    setCursor(parsed ? new Date(parsed.getFullYear(), parsed.getMonth(), 1) : new Date(today.getFullYear(), today.getMonth(), 1));
    setView('days');
    setOpen(true);
  };

  const selectDay = (day: number) => {
    onChange(toDDMMYYYY(new Date(cursor.getFullYear(), cursor.getMonth(), day)));
    setOpen(false);
  };

  const daysInMonth = new Date(cursor.getFullYear(), cursor.getMonth() + 1, 0).getDate();
  const firstDow    = new Date(cursor.getFullYear(), cursor.getMonth(), 1).getDay();
  const baseYear    = cursor.getFullYear();
  const years       = Array.from({ length: 21 }, (_, i) => baseYear - 10 + i);
  const displayValue = parsed ? toDDMMYYYY(parsed) : '';

  return (
    <div className="st-dp-wrap" ref={ref}>
      <button type="button" className={`st-dp-input-btn${open ? ' open' : ''}`} onClick={() => open ? setOpen(false) : openPicker()}>
        <span className={displayValue ? '' : 'placeholder'} style={{ fontSize: 13 }}>{displayValue || placeholder}</span>
        <span style={{ color: C.primary, display: 'flex', alignItems: 'center' }}><CalendarIcon /></span>
      </button>
      {open && (
        <div className="st-dp-calendar">
          {view === 'days' && (
            <>
              <div className="st-dp-header">
                <button className="st-dp-nav" onClick={() => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() - 1, 1))}><ChevronLeft /></button>
                <span className="st-dp-month-year" onClick={() => setView('months')}>{MONTHS[cursor.getMonth()]} {cursor.getFullYear()}</span>
                <button className="st-dp-nav" onClick={() => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1))}><ChevronRight /></button>
              </div>
              <div className="st-dp-grid">
                {DAYS_SHORT.map((d) => <div key={d} className="st-dp-dow">{d}</div>)}
                {Array.from({ length: firstDow }).map((_, i) => <div key={`e${i}`} className="st-dp-day empty" />)}
                {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((day) => {
                  const isToday    = day === today.getDate() && cursor.getMonth() === today.getMonth() && cursor.getFullYear() === today.getFullYear();
                  const isSelected = parsed && day === parsed.getDate() && cursor.getMonth() === parsed.getMonth() && cursor.getFullYear() === parsed.getFullYear();
                  return (
                    <button key={day} type="button" className={`st-dp-day${isToday ? ' today' : ''}${isSelected ? ' selected' : ''}`} onClick={() => selectDay(day)}>
                      {day}
                    </button>
                  );
                })}
              </div>
              {value && <div className="st-dp-clear"><button onClick={() => { onChange(''); setOpen(false); }}>Clear</button></div>}
            </>
          )}
          {view === 'months' && (
            <>
              <div className="st-dp-header">
                <button className="st-dp-nav" onClick={() => setCursor(new Date(cursor.getFullYear() - 1, cursor.getMonth(), 1))}><ChevronLeft /></button>
                <span className="st-dp-month-year" onClick={() => setView('years')}>{cursor.getFullYear()}</span>
                <button className="st-dp-nav" onClick={() => setCursor(new Date(cursor.getFullYear() + 1, cursor.getMonth(), 1))}><ChevronRight /></button>
              </div>
              <div className="st-dp-months">
                {MONTHS.map((m, i) => (
                  <div key={m} className={`st-dp-mitem${cursor.getMonth() === i ? ' active' : ''}`} onClick={() => { setCursor(new Date(cursor.getFullYear(), i, 1)); setView('days'); }}>
                    {m.slice(0, 3)}
                  </div>
                ))}
              </div>
            </>
          )}
          {view === 'years' && (
            <>
              <div className="st-dp-header">
                <button className="st-dp-nav" onClick={() => setCursor(new Date(cursor.getFullYear() - 12, cursor.getMonth(), 1))}><ChevronLeft /></button>
                <span className="st-dp-month-year">{years[0]} – {years[years.length - 1]}</span>
                <button className="st-dp-nav" onClick={() => setCursor(new Date(cursor.getFullYear() + 12, cursor.getMonth(), 1))}><ChevronRight /></button>
              </div>
              <div className="st-dp-years">
                {years.map((y) => (
                  <div key={y} className={`st-dp-yitem${cursor.getFullYear() === y ? ' active' : ''}`} onClick={() => { setCursor(new Date(y, cursor.getMonth(), 1)); setView('months'); }}>
                    {y}
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

// ── Types ──
interface Goal {
  id?: number;
  title: string;
  progress: number;
  description?: string;
  targetValue?: string;
  currentValue?: string;
  unit?: string;
  period?: string;
  targetDate?: string;   // YYYY-MM-DD from API
  ownerName?: string;
  ownerId?: string | number;
  status?: string;
  updateRemarks?: string;
}

// ── Modal ──
const Modal = ({ children, onClose }: { children: React.ReactNode; onClose: () => void }) => {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);
  return ReactDOM.createPortal(
    <div className="st-modal-portal" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      {children}
    </div>,
    document.body,
  );
};

// ── Skeleton ──
const SkeletonCards = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    {[1, 2, 3, 4].map((n) => (
      <div key={n} className="rounded-xl p-4 border" style={{ borderColor: C.borderLgt }}>
        <div className="st-skeleton h-4 w-3/4 mb-3" />
        <div className="st-skeleton h-2 w-full mt-4" />
      </div>
    ))}
  </div>
);

// ══════════════════════════════════════════════════════════
export const ShortTermSection = () => {
  const [activeModal, setActiveModal]     = useState<string | null>(null);
  const [editingGoalId, setEditingGoalId] = useState<number | null>(null);

  const [goals, setGoals]           = useState<Goal[]>([]);
  const [isFetching, setIsFetching] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const [tempGoal, setTempGoal]         = useState<Goal | null>(null);
  const [tempGoalDate, setTempGoalDate] = useState(''); // DD-MM-YYYY for DatePicker

  const [isSaving, setIsSaving]   = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const [strategicGoal, setStrategicGoal] = useState<any>(null);
  const [tempStrategic, setTempStrategic] = useState<any>(null);

  // ── Fetch goals — filter 'this_year' ──
  const fetchGoals = useCallback(async () => {
    setIsFetching(true);
    setFetchError(null);
    try {
      const res = await fetch(`${BASE_URL}/goals`, {
        method: 'GET',
        headers: getAuthHeaders(),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);

      const json = await res.json();
      const records = Array.isArray(json) ? json : (json.goals || json.data || []);

      // Filter ONLY short-term / this_year goals
      const yearGoals = records.filter((g: any) =>
        g.period === 'this_year' ||
        (g.period && g.period.toLowerCase().includes('year'))
      );

      const mapped: Goal[] = yearGoals.map((g: any, idx: number) => ({
        id: g.id ?? idx + 1,
        title: g.title || g.name || 'Untitled Goal',
        progress: Number(g.progress_percentage ?? g.progress ?? 0),
        description: g.description || '',
        targetValue: String(g.target_value ?? '100'),
        currentValue: String(g.current_value ?? '0'),
        unit: g.unit || '%',
        period: g.period || 'this_year',
        targetDate: g.target_date || '',   // YYYY-MM-DD from API
        ownerName: g.owner_name || '',
        ownerId: g.owner_id || '',
        status: g.status || 'On Track',
        updateRemarks: g.update_remarks || '',
      }));

      setGoals(mapped);

      if (json.dashboard) {
        setStrategicGoal({
          title: `Annual Target: ${json.dashboard.on_track} On Track, ${json.dashboard.behind} Behind`,
          type: 'Annual',
          targetDate: '',
          revenue: '',
          profit: '',
        });
      } else {
        setStrategicGoal({
          title: 'To become the leading platform in our industry by 2030',
          type: 'Annual',
          targetDate: '',
          revenue: '',
          profit: '',
        });
      }
    } catch (err: any) {
      console.error('[ShortTermSection] fetch error:', err);
      setFetchError(err.message || 'Failed to load goals');
    } finally {
      setIsFetching(false);
    }
  }, []);

  useEffect(() => { fetchGoals(); }, [fetchGoals]);

  // ── PATCH progress on card slider change ──
  const handleCardSlider = async (id: number, val: string) => {
    const clamped = clampProgress(val);

    // Optimistic UI update
    setGoals((prev) =>
      prev.map((g) => (g.id === id ? { ...g, progress: clamped } : g))
    );

    try {
      const res = await fetch(`${BASE_URL}/goals/${id}`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          goal: {
            progress_percentage: clamped,
            current_value: clamped,
          },
        }),
      });

      if (!res.ok) {
        console.error(`[PATCH progress] HTTP ${res.status}`);
        fetchGoals(); // Rollback on failure
      }
    } catch (err) {
      console.error('[PATCH progress] network error:', err);
      fetchGoals(); // Rollback on failure
    }
  };

  const closeModal = () => {
    setActiveModal(null);
    setSaveError(null);
    setTempGoal(null);
    setTempGoalDate('');
    setEditingGoalId(null);
  };

  const openStrategicModal = () => {
    setTempStrategic(strategicGoal
      ? { ...strategicGoal }
      : { title: '', type: 'Annual', targetDate: '', revenue: '', profit: '' });
    setActiveModal('edit_strategic');
  };

  const saveStrategic = () => {
    if (tempStrategic?.title?.trim()) setStrategicGoal(tempStrategic);
    closeModal();
  };

  const confirmDeleteStrategic = () => setActiveModal('confirm_delete');
  const executeDeleteStrategic = () => { setStrategicGoal(null); closeModal(); };

  // ── Open Edit Goal Modal ──
  const openGoalModal = (goal: Goal) => {
    setTempGoal({ ...goal });
    // Convert YYYY-MM-DD → DD-MM-YYYY for DatePicker
    setTempGoalDate(apiDateToDisplay(goal.targetDate || ''));
    setEditingGoalId(goal.id ?? null);
    setSaveError(null);
    setActiveModal('goal_details');
  };

  // ── Open Create Goal Modal ──
  const addGoal = () => {
    setTempGoal({
      title: '',
      progress: 0,
      description: '',
      targetValue: '100',
      currentValue: '0',
      unit: '%',
      period: 'this_year',
      status: 'On Track',
      ownerId: '',
      updateRemarks: '',
    });
    setTempGoalDate('');
    setEditingGoalId(null);
    setSaveError(null);
    setActiveModal('goal_details');
  };

  // ── PUT / POST Goal ──
  const saveGoalDetails = async () => {
    if (!tempGoal) return;
    if (!tempGoal.title.trim()) {
      setSaveError('Goal title cannot be empty.');
      return;
    }
    setIsSaving(true);
    setSaveError(null);

    const payload = {
      goal: {
        title: tempGoal.title.trim(),
        description: tempGoal.description || '',
        target_value: Number(tempGoal.targetValue) || 100,
        current_value: Number(tempGoal.currentValue) || 0,
        progress_percentage: clampProgress(tempGoal.progress),
        unit: tempGoal.unit || '%',
        period: mapPeriodToApi(tempGoal.period || 'This Year'),
        status: tempGoal.status || 'On Track',
        owner_id: tempGoal.ownerId ? Number(tempGoal.ownerId) : undefined,
        target_date: tempGoalDate ? formatDateForApi(tempGoalDate) : '',
        update_remarks: tempGoal.updateRemarks || '',
      },
    };

    try {
      let res: Response;
      if (editingGoalId) {
        res = await fetch(`${BASE_URL}/goals/${editingGoalId}`, {
          method: 'PUT',
          headers: getAuthHeaders(),
          body: JSON.stringify(payload),
        });
      } else {
        res = await fetch(`${BASE_URL}/goals`, {
          method: 'POST',
          headers: getAuthHeaders(),
          body: JSON.stringify(payload),
        });
      }

      if (!res.ok) {
        const errBody = await res.text();
        throw new Error(`API error ${res.status}: ${errBody}`);
      }

      closeModal();
      fetchGoals();
    } catch (err: any) {
      console.error('[saveGoalDetails]', err);
      setSaveError(err.message || 'Error saving goal. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  // ── DELETE Goal ──
  const deleteGoal = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this goal?')) return;
    try {
      const res = await fetch(`${BASE_URL}/goals/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      fetchGoals();
    } catch (err: any) {
      console.error('[deleteGoal]', err);
      alert('Failed to delete goal: ' + (err.message || 'Unknown error'));
    }
  };

  const handleModalProgressChange = (val: string) => {
    const clamped = clampProgress(val);
    setTempGoal((prev: any) => ({
      ...prev,
      progress: clamped,
      currentValue: String(clamped),
    }));
  };

  // ─────────────────────────────────────────────────────────
  return (
    <div style={{ padding: '24px 0', fontFamily: 'sans-serif' }}>
      <ThemeStyle />

      <div
        className="rounded-2xl overflow-hidden shadow-sm mt-6 border bg-white"
        style={{ borderColor: C.borderLgt }}
      >
        {/* ── Header ── */}
        <div
          className="px-6 py-4 border-b flex items-center justify-between"
          style={{ borderColor: C.borderLgt, background: '#fafafa' }}
        >
          <div className="flex items-center gap-2">
            <CalendarLargeIcon />
            <h2 className="font-bold text-lg m-0" style={{ color: C.textMain }}>
              Short-term Goals (This Year)
            </h2>
            <InfoIcon />
          </div>
          {isFetching && <LoaderIcon className="w-4 h-4" />}
        </div>

        <div className="p-6">

          {/* ── Strategic / Annual Goal Banner ── */}
          {strategicGoal ? (
            <div
              className="bg-white rounded-xl p-5 mb-8 flex justify-between items-center group transition-all"
              style={{ border: `1.5px solid ${C.primaryBord}`, boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}
            >
              <h3 className="font-bold text-[16px]" style={{ color: C.textMain }}>{strategicGoal.title}</h3>
              <div className="flex gap-2">
                <div onClick={openStrategicModal} className="p-1.5 hover:bg-gray-100 rounded-md cursor-pointer transition-colors" title="Edit">
                  <EditIcon />
                </div>
                <div onClick={confirmDeleteStrategic} className="p-1.5 hover:bg-red-50 rounded-md cursor-pointer transition-colors" title="Delete">
                  <TrashIcon />
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center mb-10 border-b pb-8 mt-4" style={{ borderColor: C.borderLgt }}>
              <CalendarLargeIcon />
              <h3 className="text-xl font-bold mb-1 mt-2" style={{ color: C.textMain }}>Set Your Annual Objectives</h3>
              <p className="text-sm mb-5" style={{ color: C.textMuted }}>What do you want to achieve this year?</p>
              <button
                onClick={openStrategicModal}
                className="px-5 py-2.5 rounded-lg font-bold text-sm transition-colors shadow-sm flex items-center justify-center mx-auto gap-2 text-white"
                style={{ background: C.primary }}
                onMouseEnter={(e) => e.currentTarget.style.background = C.primaryHov}
                onMouseLeave={(e) => e.currentTarget.style.background = C.primary}
              >
                + Add Annual Goal
              </button>
            </div>
          )}

          {/* ── Fetch Error ── */}
          {fetchError && (
            <div className="mb-5 bg-red-100 border border-red-300 text-red-700 text-sm font-semibold rounded-xl px-4 py-3 flex items-center justify-between gap-3">
              <span>⚠ {fetchError}</span>
              <button onClick={fetchGoals} className="text-xs underline hover:no-underline shrink-0">Retry</button>
            </div>
          )}

          {/* ── Section Label ── */}
          <div className="flex items-center gap-2 mb-5">
            <TrendIcon />
            <h4 className="text-[14px] font-bold m-0" style={{ color: C.textMain }}>Annual Initiatives</h4>
          </div>

          {/* ── Goal Cards ── */}
          {isFetching ? <SkeletonCards /> : (
            <>
              {goals.length === 0 && !fetchError && (
                <div
                  className="text-center py-8 text-sm italic rounded-xl mb-4 border border-dashed"
                  style={{ color: C.textMuted, borderColor: C.borderLgt }}
                >
                  No annual goals found. Add one below.
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                {goals.map((goal) => (
                  <div
                    key={goal.id}
                    className="bg-white rounded-xl p-4 transition-all group hover:shadow-md"
                    style={{ border: `1px solid ${C.borderLgt}` }}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-start gap-2.5 flex-1 min-w-0">
                        <div>
                          <span className="font-bold text-[14px] leading-snug block" style={{ color: C.textMain }}>
                            {goal.title}
                          </span>
                          {(goal.ownerName || goal.targetDate) && (
                            <div className="text-xs mt-1 flex items-center gap-1 font-medium" style={{ color: C.textMuted }}>
                              <span style={{ color: C.primary }}>•</span>
                              {goal.ownerName || 'Unassigned'}
                              {goal.targetDate && (
                                <span className="ml-1">
                                  📅 {apiDateToDisplay(goal.targetDate)}
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      </div>

                      <div
                        className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0 bg-gray-50 px-1 py-1 rounded-lg border ml-2"
                        style={{ borderColor: C.borderLgt }}
                      >
                        <button
                          onClick={() => openGoalModal(goal)}
                          className="p-1 rounded hover:bg-gray-200 text-gray-400 hover:text-gray-700 transition-colors"
                          title="Edit"
                        >
                          <EditIcon />
                        </button>
                        <button
                          onClick={() => deleteGoal(goal.id as number)}
                          className="p-1 rounded hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors"
                          title="Delete"
                        >
                          <TrashIcon />
                        </button>
                      </div>
                    </div>

                    {/* Progress Slider */}
                    <div className="flex items-center gap-3">
                      <input
                        type="range"
                        min="0"
                        max="100"
                        step="1"
                        value={goal.progress}
                        onChange={(e) => handleCardSlider(goal.id as number, e.target.value)}
                        className="st-goal-slider"
                        style={{ background: sliderBg(goal.progress) }}
                      />
                      <span
                        className="text-xs font-bold w-9 text-right shrink-0 tabular-nums"
                        style={{ color: C.textMuted }}
                      >
                        {goal.progress}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* ── Add Goal Button ── */}
          <div className="mt-6 flex justify-end">
            <button
              onClick={addGoal}
              className="text-sm font-bold px-4 py-2 rounded-lg transition-colors"
              style={{ color: C.primary, background: 'transparent' }}
              onMouseEnter={(e) => { e.currentTarget.style.background = C.primaryTint; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
            >
              + Add New Initiative
            </button>
          </div>
        </div>

        {/* ══ MODAL 0: Confirm Delete Strategic ══ */}
        {activeModal === 'confirm_delete' && (
          <Modal onClose={closeModal}>
            <div
              style={{
                background: '#fff',
                borderRadius: 16,
                boxShadow: '0 24px 64px rgba(0,0,0,0.18)',
                width: '100%',
                maxWidth: 380,
                overflow: 'hidden',
              }}
            >
              <div style={{ padding: '28px 28px 20px', textAlign: 'center', fontSize: 15, fontWeight: 700, color: C.textMain }}>
                Are you sure you want to delete this strategic goal?
              </div>
              <div style={{ padding: '0 28px 28px', display: 'flex', justifyContent: 'center', gap: 12 }}>
                <button
                  onClick={executeDeleteStrategic}
                  style={{ padding: '10px 24px', fontWeight: 700, color: '#fff', background: '#dc2626', border: 'none', borderRadius: 10, fontSize: 13, cursor: 'pointer' }}
                >
                  Delete
                </button>
                <button
                  onClick={closeModal}
                  style={{ padding: '10px 24px', fontWeight: 700, color: C.textMain, background: '#f3f4f6', border: 'none', borderRadius: 10, fontSize: 13, cursor: 'pointer' }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </Modal>
        )}

        {/* ══ MODAL 1: Edit Strategic Goal ══ */}
        {activeModal === 'edit_strategic' && tempStrategic && (
          <Modal onClose={closeModal}>
            <div
              style={{
                background: '#fff',
                borderRadius: 16,
                boxShadow: '0 24px 64px rgba(0,0,0,0.18)',
                width: '100%',
                maxWidth: 680,
                display: 'flex',
                flexDirection: 'column',
                maxHeight: '90vh',
                overflow: 'hidden',
              }}
            >
              {/* Header */}
              <div style={{ padding: '28px 28px 0', position: 'relative' }}>
                <button
                  onClick={closeModal}
                  style={{ position: 'absolute', top: 20, right: 20, background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af', padding: 4, borderRadius: 6, lineHeight: 1 }}
                >
                  <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
                <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: C.textMain }}>
                  {strategicGoal ? 'Edit Strategic Goal' : 'Set Annual Vision'}
                </h2>
                <p style={{ margin: '6px 0 0', fontSize: 13, color: C.textMuted }}>
                  Define your high-level annual objective
                </p>
              </div>

              {/* Body */}
              <div style={{ padding: '24px 28px', overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: 20 }}>
                <div>
                  <label className="st-label">Goal Title <span style={{ color: C.primary }}>*</span></label>
                  <input
                    type="text"
                    value={tempStrategic.title}
                    placeholder="e.g. Achieve ₹100Cr Revenue"
                    onChange={(e) => setTempStrategic({ ...tempStrategic, title: e.target.value })}
                    className="st-input"
                    onFocus={(e) => e.currentTarget.style.borderColor = C.primary}
                    onBlur={(e) => e.currentTarget.style.borderColor = C.borderLgt}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <div>
                    <label className="st-label">Goal Type</label>
                    <select className="st-select">
                      <option>Annual</option>
                    </select>
                  </div>
                  <div>
                    <label className="st-label">Target Date</label>
                    <DatePicker
                      value={tempStrategic.targetDate}
                      onChange={(val) => setTempStrategic({ ...tempStrategic, targetDate: val })}
                      placeholder="dd-mm-yyyy"
                    />
                  </div>
                  <div>
                    <label className="st-label">Revenue Target (₹Cr)</label>
                    <input
                      type="text"
                      value={tempStrategic.revenue}
                      onChange={(e) => setTempStrategic({ ...tempStrategic, revenue: e.target.value })}
                      className="st-input"
                      onFocus={(e) => e.currentTarget.style.borderColor = C.primary}
                      onBlur={(e) => e.currentTarget.style.borderColor = C.borderLgt}
                    />
                  </div>
                  <div>
                    <label className="st-label">Profit Target (₹Cr)</label>
                    <input
                      type="text"
                      value={tempStrategic.profit}
                      onChange={(e) => setTempStrategic({ ...tempStrategic, profit: e.target.value })}
                      className="st-input"
                      onFocus={(e) => e.currentTarget.style.borderColor = C.primary}
                      onBlur={(e) => e.currentTarget.style.borderColor = C.borderLgt}
                    />
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div style={{ padding: '0 28px 28px', display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
                <button
                  onClick={closeModal}
                  style={{ padding: '10px 20px', fontWeight: 700, fontSize: 13, color: C.textMain, background: '#f3f4f6', border: 'none', borderRadius: 10, cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  onClick={saveStrategic}
                  style={{ padding: '10px 24px', fontWeight: 700, fontSize: 13, color: '#fff', background: C.primary, border: 'none', borderRadius: 10, cursor: 'pointer', transition: 'background 0.15s' }}
                  onMouseEnter={(e) => e.currentTarget.style.background = C.primaryHov}
                  onMouseLeave={(e) => e.currentTarget.style.background = C.primary}
                >
                  Save Vision
                </button>
              </div>
            </div>
          </Modal>
        )}

        {/* ══ MODAL 2: Create / Edit Goal ══ */}
        {activeModal === 'goal_details' && tempGoal && (
          <Modal onClose={closeModal}>
            <div
              style={{
                background: '#fff',
                borderRadius: 16,
                boxShadow: '0 24px 64px rgba(0,0,0,0.18)',
                width: '100%',
                maxWidth: 640,
                display: 'flex',
                flexDirection: 'column',
                maxHeight: '90vh',
                overflow: 'hidden',
              }}
            >
              {/* Header */}
              <div style={{ padding: '28px 28px 0', position: 'relative' }}>
                <button
                  onClick={closeModal}
                  style={{ position: 'absolute', top: 20, right: 20, background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af', padding: 4, borderRadius: 6, lineHeight: 1 }}
                >
                  <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
                <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: C.textMain }}>
                  {editingGoalId ? 'Edit Goal Details' : 'Create New Operational Goal'}
                </h2>
                <p style={{ margin: '6px 0 0', fontSize: 13, color: C.textMuted }}>
                  Set a measurable target that contributes to your strategic objectives
                </p>
              </div>

              {/* Body */}
              <div style={{ padding: '24px 28px', overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: 20 }}>

                {saveError && (
                  <div style={{ background: '#fee2e2', border: '1px solid #fca5a5', color: '#991b1b', borderRadius: 10, padding: '10px 14px', fontSize: 13, fontWeight: 600 }}>
                    {saveError}
                  </div>
                )}

                {/* Title */}
                <div>
                  <label className="st-label">Goal Title <span style={{ color: C.primary }}>*</span></label>
                  <input
                    type="text"
                    value={tempGoal.title}
                    placeholder="e.g. Achieve ₹50Cr revenue"
                    onChange={(e) => setTempGoal({ ...tempGoal, title: e.target.value })}
                    className="st-input"
                    onFocus={(e) => e.currentTarget.style.borderColor = C.primary}
                    onBlur={(e) => e.currentTarget.style.borderColor = C.borderLgt}
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="st-label">Description</label>
                  <textarea
                    placeholder="Add detailed description about this goal..."
                    value={tempGoal.description}
                    onChange={(e) => setTempGoal({ ...tempGoal, description: e.target.value })}
                    className="st-textarea"
                    onFocus={(e) => e.currentTarget.style.borderColor = C.primary}
                    onBlur={(e) => e.currentTarget.style.borderColor = C.borderLgt}
                  />
                </div>

                {/* Target Value + Target Date */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <div>
                    <label className="st-label">Target Value</label>
                    <input
                      type="number"
                      step="any"
                      value={tempGoal.targetValue || ''}
                      placeholder="e.g. 100"
                      onChange={(e) => setTempGoal({ ...tempGoal, targetValue: e.target.value })}
                      className="st-input"
                      onFocus={(e) => e.currentTarget.style.borderColor = C.primary}
                      onBlur={(e) => e.currentTarget.style.borderColor = C.borderLgt}
                    />
                  </div>
                  <div>
                    <label className="st-label">Target Date</label>
                    <DatePicker
                      value={tempGoalDate}
                      onChange={setTempGoalDate}
                      placeholder="dd-mm-yyyy"
                    />
                  </div>
                </div>

                {/* Owner ID + Unit + Period */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
                  <div>
                    <label className="st-label">Owner ID</label>
                    <input
                      type="number"
                      value={tempGoal.ownerId || ''}
                      placeholder="e.g. 123"
                      onChange={(e) => setTempGoal({ ...tempGoal, ownerId: e.target.value })}
                      className="st-input"
                      onFocus={(e) => e.currentTarget.style.borderColor = C.primary}
                      onBlur={(e) => e.currentTarget.style.borderColor = C.borderLgt}
                    />
                  </div>
                  <div>
                    <label className="st-label">Unit</label>
                    <select
                      value={tempGoal.unit || ''}
                      onChange={(e) => setTempGoal({ ...tempGoal, unit: e.target.value })}
                      className="st-select"
                    >
                      <option value="">Select unit</option>
                      <option value="%">%</option>
                      <option value="days">Days</option>
                      <option value="Amount">Amount</option>
                      <option value="count">Count</option>
                    </select>
                  </div>
                  <div>
                    <label className="st-label">Period</label>
                    <select
                      value={tempGoal.period || 'this_year'}
                      onChange={(e) => setTempGoal({ ...tempGoal, period: e.target.value })}
                      className="st-select"
                    >
                      <option value="this_year">This Year</option>
                      <option value="this_quarter">This Quarter</option>
                      <option value="three_to_five_years">3-5 Years</option>
                      <option value="BHAG">BHAG</option>
                    </select>
                  </div>
                </div>

                {/* Progress — edit mode only */}
                {editingGoalId && (
                  <div style={{ background: '#f9fafb', borderRadius: 10, padding: '16px 18px', border: '1px solid #e5e7eb' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                      <label style={{ fontSize: 13, fontWeight: 600, color: C.textMain }}>Current Progress</label>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <input
                          type="number" min="0" max="100" step="1"
                          value={tempGoal.progress}
                          onChange={(e) => handleModalProgressChange(e.target.value)}
                          style={{ width: 56, border: '1px solid #e5e7eb', borderRadius: 8, textAlign: 'center', padding: '4px 6px', fontSize: 13, fontWeight: 700, outline: 'none', color: C.textMain }}
                        />
                        <span style={{ fontSize: 13, fontWeight: 600, color: C.textMuted }}>%</span>
                      </div>
                    </div>
                    <input
                      type="range" min="0" max="100" step="1"
                      value={tempGoal.progress}
                      onChange={(e) => handleModalProgressChange(e.target.value)}
                      className="st-modal-slider"
                      style={{ background: sliderBg(tempGoal.progress) }}
                    />
                    {/* Progress display bar */}
                    <div
                      style={{
                        background: C.primary,
                        color: '#fff',
                        fontWeight: 700,
                        textAlign: 'center',
                        padding: '8px',
                        borderRadius: 8,
                        fontSize: 13,
                        marginTop: 16,
                      }}
                    >
                      {tempGoal.progress.toFixed(1)}% Completed
                    </div>
                  </div>
                )}

                {/* Update Remarks — edit mode only */}
                {editingGoalId && (
                  <div>
                    <label className="st-label">Update Remarks</label>
                    <textarea
                      placeholder="Add notes about this update..."
                      value={tempGoal.updateRemarks}
                      onChange={(e) => setTempGoal({ ...tempGoal, updateRemarks: e.target.value })}
                      className="st-textarea"
                      onFocus={(e) => e.currentTarget.style.borderColor = C.primary}
                      onBlur={(e) => e.currentTarget.style.borderColor = C.borderLgt}
                    />
                  </div>
                )}
              </div>

              {/* Footer */}
              <div style={{ padding: '0 28px 28px' }}>
                <button
                  onClick={saveGoalDetails}
                  disabled={isSaving}
                  style={{
                    width: '100%',
                    background: C.primary,
                    color: '#fff',
                    border: 'none',
                    borderRadius: 8,
                    padding: '14px',
                    fontSize: 15,
                    fontWeight: 700,
                    cursor: isSaving ? 'not-allowed' : 'pointer',
                    transition: 'background 0.15s',
                    opacity: isSaving ? 0.7 : 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 8,
                  }}
                  onMouseEnter={(e) => { if (!isSaving) e.currentTarget.style.background = C.primaryHov; }}
                  onMouseLeave={(e) => { if (!isSaving) e.currentTarget.style.background = C.primary; }}
                >
                  {isSaving && <LoaderIcon />}
                  {isSaving ? 'Saving...' : (editingGoalId ? 'Save Changes' : 'Create Goal')}
                </button>
              </div>
            </div>
          </Modal>
        )}

      </div>
    </div>
  );
};