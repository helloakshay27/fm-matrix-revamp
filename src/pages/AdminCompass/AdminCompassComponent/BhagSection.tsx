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

// ── Icons ──
const QuestionIcon = () => (
  <svg className="w-4 h-4 text-white/70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
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
const EditIconWhite = () => (
  <svg className="w-4 h-4 text-white/80 hover:text-white cursor-pointer transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
  </svg>
);
const TargetIcon = () => (
  <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <circle cx="12" cy="12" r="10" strokeWidth={2} />
    <circle cx="12" cy="12" r="6" strokeWidth={2} />
    <circle cx="12" cy="12" r="2" strokeWidth={2} />
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
    .st-select {
      width: 100%; border: 1px solid ${C.borderLgt}; border-radius: 12px;
      padding: 10px 36px 10px 12px; font-size: 13px; color: ${C.textMain}; background: #ffffff;
      appearance: none; -webkit-appearance: none;
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23a3a3a3'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E");
      background-repeat: no-repeat; background-position: right 10px center; background-size: 16px;
      cursor: pointer; transition: border-color 0.15s, box-shadow 0.15s; outline: none; box-sizing: border-box;
    }
    .st-select:focus { border-color: ${C.primary}; box-shadow: 0 0 0 3px rgba(218,119,86,0.15); }
    .st-error-banner {
      background: #fee2e2; border: 1px solid #fca5a5; color: #991b1b;
      border-radius: 10px; padding: 10px 14px; font-size: 13px; font-weight: 600;
    }
    .st-skeleton {
      background: linear-gradient(90deg, rgba(255,255,255,0.15) 25%, rgba(255,255,255,0.3) 50%, rgba(255,255,255,0.15) 75%);
      background-size: 200% 100%; animation: st-shimmer 1.4s infinite; border-radius: 8px;
    }
    @keyframes st-shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }
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

const sliderBg = (pct: number) =>
  `linear-gradient(to right, ${C.primary} ${pct}%, #e5e7eb ${pct}%)`;

// ── Helpers ──
const getAuthHeaders = (): Record<string, string> => {
  const token = localStorage.getItem('auth_token') || '';
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: token } : {}),
  };
};

const formatDateForApi = (dateStr: string): string => {
  if (!dateStr) return '';
  // Already YYYY-MM-DD
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return dateStr;
  // Convert DD-MM-YYYY → YYYY-MM-DD
  const parts = dateStr.split('-');
  if (parts.length === 3 && parts[2].length === 4)
    return `${parts[2]}-${parts[1]}-${parts[0]}`;
  return dateStr;
};

// Convert YYYY-MM-DD → DD-MM-YYYY for DatePicker display
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

// ── DatePicker ──
interface DatePickerProps {
  value: string; // DD-MM-YYYY
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
interface Initiative {
  id?: number;
  title: string;
  progress: number;
  description?: string;
  targetValue?: string;
  currentValue?: string;
  unit?: string;
  period?: string;
  targetDate?: string;   // stored as YYYY-MM-DD from API
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

const SkeletonCards = () => (
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 pl-0 md:pl-[36px]">
    {[1, 2, 3, 4].map((n) => (
      <div key={n} className="bg-white/20 rounded-xl p-4">
        <div className="st-skeleton h-4 w-3/4 mb-3" />
        <div className="st-skeleton h-2 w-full mt-4" />
      </div>
    ))}
  </div>
);

// ══════════════════════════════════════════════════════════
export const BhagSection = () => {
  const [activeModal, setActiveModal]     = useState<string | null>(null);
  const [editingGoalId, setEditingGoalId] = useState<number | null>(null);

  const [bhagStatement, setBhagStatement]   = useState('');
  const [bhagVideoUrl, setBhagVideoUrl]     = useState('');
  const [bhagTargetDate, setBhagTargetDate] = useState('');
  const [initiatives, setInitiatives]       = useState<Initiative[]>([]);

  const [isFetching, setIsFetching] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const [tempBhagStatement, setTempBhagStatement] = useState('');
  const [tempVideoUrl, setTempVideoUrl]           = useState('');
  const [tempTargetDate, setTempTargetDate]       = useState(''); // DD-MM-YYYY for DatePicker

  const [tempGoal, setTempGoal]     = useState<Initiative | null>(null);
  const [tempGoalDate, setTempGoalDate] = useState(''); // DD-MM-YYYY for DatePicker

  const [isSaving, setIsSaving]   = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  // ── Fetch BHAG goals from BASE_URL ──
  const fetchBhagData = useCallback(async () => {
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

      // Filter only BHAG period goals
      const bhagGoals = records.filter((g: any) =>
        g.period === 'BHAG' ||
        (g.period && g.period.toLowerCase().includes('bhag'))
      );

      const mappedInitiatives: Initiative[] = bhagGoals.map((g: any, idx: number) => ({
        id: g.id ?? idx + 1,
        title: g.title || g.name || 'Untitled Initiative',
        progress: Number(g.progress_percentage ?? g.progress ?? 0),
        description: g.description || '',
        targetValue: String(g.target_value ?? g.targetValue ?? '1'),
        currentValue: String(g.current_value ?? '0'),
        unit: g.unit || 'days',
        period: g.period || 'BHAG',
        targetDate: g.target_date || '',   // YYYY-MM-DD from API
        ownerName: g.owner_name || '',
        ownerId: g.owner_id || '',
        status: g.status || 'On Track',
        updateRemarks: g.update_remarks || '',
      }));

      setInitiatives(mappedInitiatives);

      // Top-level BHAG statement (if API returns it separately)
      setBhagStatement(json.statement || '');
      setBhagVideoUrl(json.video_url || json.videoUrl || '');
      setBhagTargetDate(json.target_date || json.targetDate || '');

    } catch (err: any) {
      console.error('[BhagSection] fetch error:', err);
      setFetchError(err.message || 'Failed to load BHAG data');
    } finally {
      setIsFetching(false);
    }
  }, []);

  useEffect(() => { fetchBhagData(); }, [fetchBhagData]);

  const clampProgress = (val: any) => {
    const n = Math.round(Number(val));
    return isNaN(n) ? 0 : Math.min(100, Math.max(0, n));
  };

  // ── PATCH progress on card slider change ──
  const handleCardSlider = async (id: number, val: string) => {
    const clamped = clampProgress(val);

    // Optimistic UI update
    setInitiatives((prev) =>
      prev.map((i) => (i.id === id ? { ...i, progress: clamped } : i))
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
        // Rollback on failure
        fetchBhagData();
      }
    } catch (err) {
      console.error('[PATCH progress] network error:', err);
      // Rollback on failure
      fetchBhagData();
    }
  };

  const closeModal = () => {
    setActiveModal(null);
    setSaveError(null);
    setTempGoal(null);
    setTempGoalDate('');
    setEditingGoalId(null);
  };

  // ── Open BHAG Statement Edit Modal ──
  const openBhagModal = () => {
    setTempBhagStatement(bhagStatement);
    setTempVideoUrl(bhagVideoUrl);
    // Convert YYYY-MM-DD → DD-MM-YYYY for DatePicker
    setTempTargetDate(apiDateToDisplay(bhagTargetDate));
    setSaveError(null);
    setActiveModal('bhag_statement');
  };

  // ── POST to extra_fields/bulk_upsert ──
  const saveBhagStatement = async () => {
    if (!tempBhagStatement.trim()) {
      setSaveError('BHAG Statement cannot be empty.');
      return;
    }
    setIsSaving(true);
    setSaveError(null);
    try {
      const payload: any = {
        extra_field: {
          group_name: 'business_plan_bhag',
          values: [tempBhagStatement.trim()],
        },
      };
      if (tempVideoUrl.trim())
        payload.extra_field.video_url = tempVideoUrl.trim();
      if (tempTargetDate.trim())
        payload.extra_field.target_date = formatDateForApi(tempTargetDate.trim());

      const res = await fetch(`${BASE_URL}/extra_fields/bulk_upsert`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(`API error ${res.status}`);

      setBhagStatement(tempBhagStatement.trim());
      setBhagVideoUrl(tempVideoUrl.trim());
      setBhagTargetDate(formatDateForApi(tempTargetDate.trim()));
      closeModal();
      fetchBhagData();
    } catch (err: any) {
      setSaveError(err.message || 'Failed to save. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  // ── Open Goal Edit Modal ──
  const openGoalModal = (goal: Initiative) => {
    setTempGoal({ ...goal });
    // Convert YYYY-MM-DD → DD-MM-YYYY for DatePicker
    setTempGoalDate(apiDateToDisplay(goal.targetDate || ''));
    setEditingGoalId(goal.id ?? null);
    setSaveError(null);
    setActiveModal('goal_details');
  };

  // ── Open Create Goal Modal ──
  const addInitiative = () => {
    setTempGoal({
      title: '',
      progress: 0,
      description: '',
      targetValue: '1',
      currentValue: '0',
      unit: 'days',
      period: 'BHAG',
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
        target_value: Number(tempGoal.targetValue) || 1,
        current_value: Number(tempGoal.currentValue) || 0,
        progress_percentage: clampProgress(tempGoal.progress),
        unit: tempGoal.unit || 'days',
        period: 'BHAG',
        status: tempGoal.status || 'On Track',
        owner_id: tempGoal.ownerId ? Number(tempGoal.ownerId) : undefined,
        target_date: tempGoalDate ? formatDateForApi(tempGoalDate) : '',
        update_remarks: tempGoal.updateRemarks || '',
      },
    };

    try {
      let res: Response;
      if (editingGoalId) {
        // UPDATE existing goal
        res = await fetch(`${BASE_URL}/goals/${editingGoalId}`, {
          method: 'PUT',
          headers: getAuthHeaders(),
          body: JSON.stringify(payload),
        });
      } else {
        // CREATE new goal
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
      fetchBhagData(); // Refresh list
    } catch (err: any) {
      console.error('[saveGoalDetails]', err);
      setSaveError(err.message || 'Error saving goal. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  // ── DELETE Goal ──
  const deleteGoal = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this initiative?')) return;
    try {
      const res = await fetch(`${BASE_URL}/goals/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      fetchBhagData();
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
        className="rounded-2xl overflow-hidden shadow-md mt-6"
        style={{ background: `linear-gradient(135deg, ${C.primary} 0%, #c26040 100%)` }}
      >
        <div className="p-6">

          {/* ── Header ── */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center bg-white/20 shrink-0 shadow-sm border border-white/20">
                <TargetIcon />
              </div>
              <span className="text-[16px] font-bold text-white leading-tight drop-shadow-sm">
                Long Term - (BHAG - Big Hairy Audacious Goal)
              </span>
              <QuestionIcon />
            </div>
            <button
              onClick={openBhagModal}
              className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition-colors shrink-0 shadow-sm border border-white/20"
            >
              <EditIconWhite />
            </button>
          </div>

          {/* ── BHAG Statement ── */}
          <div className="mb-5 pl-[36px]">
            {isFetching ? (
              <div className="st-skeleton h-7 w-2/3" />
            ) : (
              <p className="text-xl font-extrabold text-white leading-snug drop-shadow-md">
                {bhagStatement || (
                  <span className="opacity-60 font-normal text-base italic">
                    No BHAG statement yet — click edit to add one.
                  </span>
                )}
              </p>
            )}
          </div>

          {/* ── Fetch Error ── */}
          {fetchError && (
            <div className="mx-0 md:ml-[36px] mb-4 bg-red-100 border border-red-300 text-red-700 text-sm font-semibold rounded-xl px-4 py-3 flex items-center justify-between gap-3">
              <span>⚠ {fetchError}</span>
              <button onClick={fetchBhagData} className="text-xs underline hover:no-underline shrink-0">Retry</button>
            </div>
          )}

          {/* ── Section Label ── */}
          <div className="pl-[36px] mb-3 flex items-center gap-2">
            <span className="text-xs font-bold text-white/80 tracking-wide uppercase">Key Initiatives (BHAG)</span>
            {isFetching && <LoaderIcon className="w-3.5 h-3.5 text-white/60" />}
          </div>

          {/* ── Initiative Cards ── */}
          {isFetching ? <SkeletonCards /> : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 pl-0 md:pl-[36px]">
              {initiatives.length === 0 && !fetchError && (
                <p className="col-span-2 text-white/60 text-sm italic py-2">
                  No initiatives found. Add one below.
                </p>
              )}
              {initiatives.map((initiative) => (
                <div
                  key={initiative.id}
                  className="bg-white rounded-xl p-4 text-gray-800 shadow-sm group hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between gap-2 mb-4">
                    <div className="flex items-start gap-2.5 flex-1 min-w-0">
                      <div
                        className="mt-1 w-3.5 h-3.5 rounded-full border-[3px] bg-white shrink-0"
                        style={{ borderColor: C.primary }}
                      />
                      <span className="text-[14px] font-bold leading-snug" style={{ color: C.textMain }}>
                        {initiative.title}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0 bg-gray-50 px-1 py-1 rounded-lg border" style={{ borderColor: C.borderLgt }}>
                      <button
                        onClick={() => openGoalModal(initiative)}
                        className="p-1 rounded hover:bg-gray-200 text-gray-400 hover:text-gray-700 transition-colors"
                        title="Edit"
                      >
                        <EditIcon />
                      </button>
                      <button
                        onClick={() => deleteGoal(initiative.id as number)}
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
                      value={initiative.progress}
                      onChange={(e) => handleCardSlider(initiative.id as number, e.target.value)}
                      className="st-goal-slider"
                      style={{ background: sliderBg(initiative.progress) }}
                    />
                    <span
                      className="text-xs font-bold w-9 text-right shrink-0 tabular-nums"
                      style={{ color: C.textMuted }}
                    >
                      {initiative.progress}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ── Add Initiative Button ── */}
          <div className="mt-5 flex justify-end">
            <button
              onClick={addInitiative}
              className="text-sm font-bold text-white bg-white/10 hover:bg-white/20 border border-white/20 px-5 py-2.5 rounded-xl transition-colors flex items-center gap-1 shadow-sm"
            >
              + Add New Initiative
            </button>
          </div>
        </div>

        {/* ══ MODAL 1: Edit BHAG Statement ══ */}
        {activeModal === 'bhag_statement' && (
          <Modal onClose={closeModal}>
            <div className="st-modal-box" style={{ maxWidth: '520px' }}>
              {/* Header */}
              <div className="flex justify-between items-center px-6 py-5 border-b" style={{ borderColor: C.primaryBord, background: '#fff' }}>
                <div className="flex items-center gap-3">
                  <span style={{ width: 10, height: 10, borderRadius: '50%', background: C.primary, flexShrink: 0 }} />
                  <h2 className="font-bold text-[18px] m-0" style={{ color: C.textMain }}>Edit BHAG</h2>
                </div>
                <button onClick={closeModal} className="p-1 rounded-md hover:bg-black/5 text-gray-400 transition-colors">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Body */}
              <div className="p-6 space-y-5 overflow-y-auto" style={{ background: 'transparent' }}>
                {saveError && <div className="st-error-banner">{saveError}</div>}

                <div>
                  <label className="block text-[13px] font-bold mb-1.5" style={{ color: C.textMain }}>
                    Video URL <span className="font-normal text-gray-400">(Optional)</span>
                  </label>
                  <input
                    type="text"
                    value={tempVideoUrl}
                    onChange={(e) => setTempVideoUrl(e.target.value)}
                    placeholder="Paste YouTube, Vimeo, or Direct Video URL..."
                    className="st-input"
                  />
                </div>

                <div>
                  <label className="block text-[13px] font-bold mb-1.5" style={{ color: C.textMain }}>
                    BHAG Statement <span style={{ color: C.primary }}>*</span>
                  </label>
                  <textarea
                    value={tempBhagStatement}
                    onChange={(e) => setTempBhagStatement(e.target.value)}
                    placeholder="Enter your BHAG statement..."
                    className="st-input min-h-[80px] font-bold"
                    style={{ resize: 'vertical' }}
                  />
                </div>

                <div>
                  <label className="block text-[13px] font-bold mb-1.5" style={{ color: C.textMain }}>Target Date</label>
                  <DatePicker value={tempTargetDate} onChange={setTempTargetDate} placeholder="Select target date" />
                </div>
              </div>

              {/* Footer */}
              <div className="p-5 flex justify-end gap-3 border-t bg-white" style={{ borderColor: C.primaryBord }}>
                <button
                  onClick={closeModal}
                  disabled={isSaving}
                  className="px-5 py-2.5 text-[13px] font-bold text-gray-700 bg-white border rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-50"
                  style={{ borderColor: C.borderLgt }}
                >
                  Cancel
                </button>
                <button
                  onClick={saveBhagStatement}
                  disabled={isSaving}
                  className="px-6 py-2.5 text-[13px] font-bold text-white rounded-xl transition-colors shadow-sm flex items-center gap-2 disabled:opacity-70"
                  style={{ background: C.primary }}
                  onMouseEnter={(e) => { if (!isSaving) e.currentTarget.style.background = C.primaryHov; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = C.primary; }}
                >
                  {isSaving && <LoaderIcon />}
                  {isSaving ? 'Saving...' : 'Save Vision'}
                </button>
              </div>
            </div>
          </Modal>
        )}

        {/* ══ MODAL 2: Edit / Create Goal ══ */}
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
                  {editingGoalId ? 'Edit Initiative' : 'Create New Initiative'}
                </h2>
                <p style={{ margin: '6px 0 0', fontSize: 13, color: C.textMuted }}>
                  Set a measurable target that contributes to your BHAG
                </p>
              </div>

              {/* Body */}
              <div style={{ padding: '24px 28px', overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: 20 }}>

                {saveError && (
                  <div style={{ background: '#fee2e2', border: '1px solid #fca5a5', color: '#991b1b', borderRadius: 10, padding: '10px 14px', fontSize: 13, fontWeight: 600 }}>
                    {saveError}
                  </div>
                )}

                {/* Goal Title */}
                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: C.textMain, marginBottom: 6 }}>
                    Goal Title <span style={{ color: C.primary }}>*</span>
                  </label>
                  <input
                    type="text"
                    value={tempGoal.title}
                    placeholder="e.g. Hire B2B Enterprise Sales Head"
                    onChange={(e) => setTempGoal({ ...tempGoal, title: e.target.value })}
                    style={{ width: '100%', border: '1px solid #e5e7eb', borderRadius: 8, padding: '10px 14px', fontSize: 14, color: C.textMain, outline: 'none', boxSizing: 'border-box', transition: 'border-color 0.15s' }}
                    onFocus={(e) => e.currentTarget.style.borderColor = C.primary}
                    onBlur={(e) => e.currentTarget.style.borderColor = '#e5e7eb'}
                  />
                </div>

                {/* Description */}
                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: C.textMain, marginBottom: 6 }}>Description</label>
                  <textarea
                    placeholder="Add detailed description about this goal..."
                    value={tempGoal.description}
                    onChange={(e) => setTempGoal({ ...tempGoal, description: e.target.value })}
                    style={{ width: '100%', border: '1px solid #e5e7eb', borderRadius: 8, padding: '10px 14px', fontSize: 14, color: C.textMain, outline: 'none', boxSizing: 'border-box', minHeight: 90, resize: 'vertical', fontFamily: 'inherit', transition: 'border-color 0.15s' }}
                    onFocus={(e) => e.currentTarget.style.borderColor = C.primary}
                    onBlur={(e) => e.currentTarget.style.borderColor = '#e5e7eb'}
                  />
                </div>

                {/* Target Value + Target Date */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: C.textMain, marginBottom: 6 }}>Target Value</label>
                    <input
                      type="number"
                      step="any"
                      value={tempGoal.targetValue || ''}
                      placeholder="e.g. 100"
                      onChange={(e) => setTempGoal({ ...tempGoal, targetValue: e.target.value })}
                      style={{ width: '100%', border: '1px solid #e5e7eb', borderRadius: 8, padding: '10px 14px', fontSize: 14, color: C.textMain, outline: 'none', boxSizing: 'border-box', transition: 'border-color 0.15s' }}
                      onFocus={(e) => e.currentTarget.style.borderColor = C.primary}
                      onBlur={(e) => e.currentTarget.style.borderColor = '#e5e7eb'}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: C.textMain, marginBottom: 6 }}>Target Date</label>
                    <DatePicker value={tempGoalDate} onChange={setTempGoalDate} placeholder="dd-mm-yyyy" />
                  </div>
                </div>

                {/* Owner ID + Unit + Status */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: C.textMain, marginBottom: 6 }}>Owner ID</label>
                    <input
                      type="number"
                      value={tempGoal.ownerId || ''}
                      placeholder="e.g. 123"
                      onChange={(e) => setTempGoal({ ...tempGoal, ownerId: e.target.value })}
                      style={{ width: '100%', border: '1px solid #e5e7eb', borderRadius: 8, padding: '10px 14px', fontSize: 14, color: C.textMain, outline: 'none', boxSizing: 'border-box', transition: 'border-color 0.15s' }}
                      onFocus={(e) => e.currentTarget.style.borderColor = C.primary}
                      onBlur={(e) => e.currentTarget.style.borderColor = '#e5e7eb'}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: C.textMain, marginBottom: 6 }}>Unit</label>
                    <select
                      value={tempGoal.unit || ''}
                      onChange={(e) => setTempGoal({ ...tempGoal, unit: e.target.value })}
                      className="st-select"
                      style={{ border: '1px solid #e5e7eb', borderRadius: 8, padding: '10px 36px 10px 14px', fontSize: 14, color: tempGoal.unit ? C.textMain : '#9ca3af' }}
                    >
                      <option value="">Select unit</option>
                      <option value="%">%</option>
                      <option value="days">Days</option>
                      <option value="Amount">Amount</option>
                      <option value="count">Count</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: C.textMain, marginBottom: 6 }}>Status</label>
                    <select
                      value={tempGoal.status || 'On Track'}
                      onChange={(e) => setTempGoal({ ...tempGoal, status: e.target.value })}
                      className="st-select"
                      style={{ border: '1px solid #e5e7eb', borderRadius: 8, padding: '10px 36px 10px 14px', fontSize: 14, color: C.textMain }}
                    >
                      <option value="On Track">On Track</option>
                      <option value="Behind">Behind</option>
                      <option value="At Risk">At Risk</option>
                    </select>
                  </div>
                </div>

                {/* Progress (edit mode only) */}
                {editingGoalId && (
                  <div style={{ background: '#f9fafb', borderRadius: 10, padding: '16px 18px', border: '1px solid #e5e7eb' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                      <label style={{ fontSize: 13, fontWeight: 600, color: C.textMain }}>Current Progress</label>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <input
                          type="number"
                          min="0"
                          max="100"
                          step="1"
                          value={tempGoal.progress}
                          onChange={(e) => handleModalProgressChange(e.target.value)}
                          style={{ width: 56, border: '1px solid #e5e7eb', borderRadius: 8, textAlign: 'center', padding: '4px 6px', fontSize: 13, fontWeight: 700, outline: 'none', color: C.textMain }}
                        />
                        <span style={{ fontSize: 13, fontWeight: 600, color: C.textMuted }}>%</span>
                      </div>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      step="1"
                      value={tempGoal.progress}
                      onChange={(e) => handleModalProgressChange(e.target.value)}
                      className="st-modal-slider"
                      style={{ background: sliderBg(tempGoal.progress) }}
                    />
                  </div>
                )}

                {/* Update Remarks (edit mode only) */}
                {editingGoalId && (
                  <div>
                    <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: C.textMain, marginBottom: 6 }}>Update Remarks</label>
                    <textarea
                      placeholder="Add notes about this update..."
                      value={tempGoal.updateRemarks}
                      onChange={(e) => setTempGoal({ ...tempGoal, updateRemarks: e.target.value })}
                      style={{ width: '100%', border: '1px solid #e5e7eb', borderRadius: 8, padding: '10px 14px', fontSize: 14, color: C.textMain, outline: 'none', boxSizing: 'border-box', minHeight: 60, resize: 'vertical', fontFamily: 'inherit', transition: 'border-color 0.15s' }}
                      onFocus={(e) => e.currentTarget.style.borderColor = C.primary}
                      onBlur={(e) => e.currentTarget.style.borderColor = '#e5e7eb'}
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