import React, { useState, useEffect, useCallback, useRef } from 'react';
import ReactDOM from 'react-dom';

// ── Design Tokens ──
const C = {
  primary:     '#DA7756',
  primaryHov:  '#c9673f',
  primaryBg:   '#f6f4ee',
  primaryTint: 'rgba(218,119,86,0.06)',
  primaryBord: '#e8e3de',
  tealBg:      '#9EC8BA',
  cardBg:      '#ffffff',
  textMain:    '#1a1a1a',
  textMuted:   '#6b7280',
  borderLgt:   '#ebebeb',
  font:        "'Poppins', sans-serif",
};

// ── API Helpers — read localStorage fresh on every call ──
const apiUrl = (path: string): string => {
  let base = (localStorage.getItem('baseUrl') || '').replace(/\/$/, '');
  if (!base) return path;
  if (!base.startsWith('http://') && !base.startsWith('https://')) base = `https://${base}`;
  return `${base}${path}`;
};

const authHeaders = (): Record<string, string> => {
  const token = localStorage.getItem('token') || '';
  const bearer = token ? (token.startsWith('Bearer ') ? token : `Bearer ${token}`) : '';
  return {
    'Content-Type': 'application/json',
    ...(bearer ? { Authorization: bearer } : {}),
  };
};

// ── Date Helpers ──
const toApiDate = (s: string): string => {
  if (!s) return '';
  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return s;           // already yyyy-mm-dd
  const p = s.split('-');
  if (p.length === 3 && p[2].length === 4) return `${p[2]}-${p[1]}-${p[0]}`; // dd-mm-yyyy → yyyy-mm-dd
  return s;
};

const toDisplayDate = (s: string): string => {
  if (!s) return '';
  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) {
    const [y, m, d] = s.split('-');
    return `${d}-${m}-${y}`;                              // yyyy-mm-dd → dd-mm-yyyy
  }
  return s;
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

const clamp = (val: any): number => {
  const n = Math.round(Number(val));
  return isNaN(n) ? 0 : Math.min(100, Math.max(0, n));
};

const sliderBg = (pct: number) =>
  `linear-gradient(to right, ${C.primary} ${pct}%, #e5e7eb ${pct}%)`;

const MONTHS     = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const DAYS_SHORT = ['Su','Mo','Tu','We','Th','Fr','Sa'];

// ── Icons ──
const EditIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
  </svg>
);
const TrashIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
  </svg>
);
const CalendarIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);
const ChevronLeft  = () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/></svg>;
const ChevronRight = () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/></svg>;
const LoaderIcon   = ({ className = 'w-4 h-4' }: { className?: string }) => (
  <svg className={`${className} animate-spin`} fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth={4} />
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
  </svg>
);
const CloseIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

// ── Theme CSS ──
const ThemeStyle = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800;900&display=swap');
    .bhag-wrap, .bhag-wrap * { font-family: 'Poppins', sans-serif !important; box-sizing: border-box; }
    .bhag-input { width:100%; border:1px solid ${C.borderLgt}; border-radius:12px; padding:10px 12px; font-size:13px; color:${C.textMain}; background:#fff; transition:border-color .15s,box-shadow .15s; outline:none; font-family:'Poppins',sans-serif; }
    .bhag-input:focus { border-color:${C.primary}; box-shadow:0 0 0 3px rgba(218,119,86,0.15); }
    .bhag-input::placeholder { color:#a3a3a3; font-weight:400; }
    .bhag-modal-portal { position:fixed; inset:0; z-index:99999; display:flex; align-items:center; justify-content:center; padding:16px; background:rgba(0,0,0,0.42); backdrop-filter:blur(4px); }
    .bhag-modal-box { background:${C.primaryBg}; border-radius:20px; border:1px solid ${C.primaryBord}; box-shadow:0 30px 80px rgba(0,0,0,0.20); width:100%; display:flex; flex-direction:column; max-height:90vh; overflow:hidden; }
    .st-goal-slider { -webkit-appearance:none; appearance:none; width:100%; height:6px; border-radius:99px; outline:none; cursor:pointer; }
    .st-goal-slider::-webkit-slider-thumb { -webkit-appearance:none; appearance:none; width:16px; height:16px; border-radius:50%; background:${C.primary}; cursor:pointer; border:2px solid white; box-shadow:0 1px 4px rgba(0,0,0,0.2); transition:transform 0.15s; }
    .st-goal-slider::-webkit-slider-thumb:hover { transform:scale(1.2); }
    .st-modal-slider { -webkit-appearance:none; appearance:none; width:100%; height:6px; border-radius:99px; outline:none; cursor:pointer; }
    .st-modal-slider::-webkit-slider-thumb { -webkit-appearance:none; appearance:none; width:18px; height:18px; border-radius:50%; background:${C.primary}; cursor:pointer; border:2px solid white; box-shadow:0 1px 4px rgba(0,0,0,0.2); transition:transform 0.15s; }
    .st-modal-slider::-webkit-slider-thumb:hover { transform:scale(1.2); }
    .st-skeleton { background:linear-gradient(90deg,rgba(255,255,255,0.2) 25%,rgba(255,255,255,0.35) 50%,rgba(255,255,255,0.2) 75%); background-size:200% 100%; animation:st-shimmer 1.4s infinite; border-radius:8px; }
    @keyframes st-shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }
    .st-error { background:#fee2e2; border:1px solid #fca5a5; color:#991b1b; border-radius:12px; padding:10px 14px; font-size:13px; font-weight:600; }
    .st-dp-wrap { position:relative; width:100%; }
    .st-dp-btn { width:100%; border:1px solid ${C.borderLgt}; border-radius:12px; padding:10px 12px; font-size:13px; color:${C.textMain}; background:#fff; display:flex; align-items:center; justify-content:space-between; cursor:pointer; transition:border-color .15s,box-shadow .15s; outline:none; font-family:'Poppins',sans-serif; }
    .st-dp-btn.open, .st-dp-btn:focus { border-color:${C.primary}; box-shadow:0 0 0 3px rgba(218,119,86,0.15); }
    .st-dp-btn .ph { color:#a3a3a3; }
    .st-dp-cal { position:absolute; top:calc(100% + 6px); left:0; z-index:999999; background:#fff; border:1px solid ${C.borderLgt}; border-radius:16px; box-shadow:0 12px 40px rgba(0,0,0,0.12); padding:16px; width:280px; animation:dp-in .15s ease; font-family:'Poppins',sans-serif; }
    @keyframes dp-in { from{opacity:0;transform:translateY(-4px)} to{opacity:1;transform:translateY(0)} }
    .st-dp-hd { display:flex; align-items:center; justify-content:space-between; margin-bottom:12px; }
    .st-dp-nav { background:none; border:none; padding:6px; border-radius:8px; cursor:pointer; color:${C.textMuted}; display:flex; align-items:center; }
    .st-dp-nav:hover { background:${C.primaryTint}; color:${C.primary}; }
    .st-dp-my { font-size:14px; font-weight:700; color:${C.textMain}; cursor:pointer; padding:4px 8px; border-radius:8px; }
    .st-dp-my:hover { background:${C.primaryTint}; color:${C.primary}; }
    .st-dp-grid { display:grid; grid-template-columns:repeat(7,1fr); gap:2px; }
    .st-dp-dow { text-align:center; font-size:11px; font-weight:700; color:${C.textMuted}; padding:4px 0 8px; }
    .st-dp-day { aspect-ratio:1; display:flex; align-items:center; justify-content:center; font-size:12px; font-weight:500; border-radius:8px; cursor:pointer; color:${C.textMain}; border:none; background:none; transition:background .1s,color .1s; }
    .st-dp-day:hover:not(.e):not(.s) { background:${C.primaryTint}; color:${C.primary}; }
    .st-dp-day.t:not(.s) { color:${C.primary}; font-weight:800; }
    .st-dp-day.s { background:${C.primary}; color:#fff; font-weight:700; }
    .st-dp-day.e { cursor:default; }
    .st-dp-3g { display:grid; grid-template-columns:repeat(3,1fr); gap:6px; padding:4px 0; }
    .st-dp-item { text-align:center; padding:8px 4px; border-radius:10px; font-size:13px; font-weight:600; cursor:pointer; color:${C.textMain}; transition:background .1s; }
    .st-dp-item:hover { background:${C.primaryTint}; color:${C.primary}; }
    .st-dp-item.a { background:${C.primary}; color:#fff; }
    .st-dp-clr { margin-top:10px; padding-top:10px; border-top:1px solid ${C.borderLgt}; text-align:center; }
    .st-dp-clr button { font-size:12px; font-weight:600; color:${C.textMuted}; background:none; border:none; cursor:pointer; padding:4px 12px; border-radius:8px; }
    .st-dp-clr button:hover { background:#f3f4f6; color:${C.textMain}; }
    .st-select { width:100%; border:1px solid ${C.borderLgt}; border-radius:12px; padding:10px 36px 10px 12px; font-size:13px; color:${C.textMain}; background:#fff url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23a3a3a3'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E") no-repeat right 10px center / 16px; -webkit-appearance:none; appearance:none; cursor:pointer; outline:none; transition:border-color .15s,box-shadow .15s; font-family:'Poppins',sans-serif; }
    .st-select:focus { border-color:${C.primary}; box-shadow:0 0 0 3px rgba(218,119,86,0.15); }
  `}</style>
);

// ── DatePicker ──
const DatePicker: React.FC<{ value: string; onChange: (v: string) => void; placeholder?: string }> = ({
  value, onChange, placeholder = 'Select date',
}) => {
  const today  = new Date();
  const parsed = parseDDMMYYYY(value);
  const [open, setOpen] = useState(false);
  const [view, setView] = useState<'days' | 'months' | 'years'>('days');
  const [cur, setCur]   = useState<Date>(parsed || new Date(today.getFullYear(), today.getMonth(), 1));
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const h = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  const openPicker = () => {
    setCur(parsed ? new Date(parsed.getFullYear(), parsed.getMonth(), 1) : new Date(today.getFullYear(), today.getMonth(), 1));
    setView('days');
    setOpen(true);
  };

  const dim  = new Date(cur.getFullYear(), cur.getMonth() + 1, 0).getDate();
  const fdow = new Date(cur.getFullYear(), cur.getMonth(), 1).getDay();
  const years = Array.from({ length: 21 }, (_, i) => cur.getFullYear() - 10 + i);
  const dv = parsed ? toDDMMYYYY(parsed) : '';

  return (
    <div className="st-dp-wrap" ref={ref}>
      <button type="button" className={`st-dp-btn${open ? ' open' : ''}`}
        onClick={() => open ? setOpen(false) : openPicker()}>
        <span className={dv ? '' : 'ph'} style={{ fontSize: 13 }}>{dv || placeholder}</span>
        <span style={{ color: C.primary, display: 'flex' }}><CalendarIcon /></span>
      </button>
      {open && (
        <div className="st-dp-cal">
          {view === 'days' && (<>
            <div className="st-dp-hd">
              <button className="st-dp-nav" onClick={() => setCur(new Date(cur.getFullYear(), cur.getMonth() - 1, 1))}><ChevronLeft /></button>
              <span className="st-dp-my" onClick={() => setView('months')}>{MONTHS[cur.getMonth()]} {cur.getFullYear()}</span>
              <button className="st-dp-nav" onClick={() => setCur(new Date(cur.getFullYear(), cur.getMonth() + 1, 1))}><ChevronRight /></button>
            </div>
            <div className="st-dp-grid">
              {DAYS_SHORT.map(d => <div key={d} className="st-dp-dow">{d}</div>)}
              {Array.from({ length: fdow }).map((_, i) => <div key={`e${i}`} className="st-dp-day e" />)}
              {Array.from({ length: dim }, (_, i) => i + 1).map(day => {
                const isT = day === today.getDate() && cur.getMonth() === today.getMonth() && cur.getFullYear() === today.getFullYear();
                const isS = parsed && day === parsed.getDate() && cur.getMonth() === parsed.getMonth() && cur.getFullYear() === parsed.getFullYear();
                return (
                  <button key={day} type="button"
                    className={`st-dp-day${isT ? ' t' : ''}${isS ? ' s' : ''}`}
                    onClick={() => { onChange(toDDMMYYYY(new Date(cur.getFullYear(), cur.getMonth(), day))); setOpen(false); }}>
                    {day}
                  </button>
                );
              })}
            </div>
            {value && <div className="st-dp-clr"><button onClick={() => { onChange(''); setOpen(false); }}>Clear</button></div>}
          </>)}
          {view === 'months' && (<>
            <div className="st-dp-hd">
              <button className="st-dp-nav" onClick={() => setCur(new Date(cur.getFullYear() - 1, cur.getMonth(), 1))}><ChevronLeft /></button>
              <span className="st-dp-my" onClick={() => setView('years')}>{cur.getFullYear()}</span>
              <button className="st-dp-nav" onClick={() => setCur(new Date(cur.getFullYear() + 1, cur.getMonth(), 1))}><ChevronRight /></button>
            </div>
            <div className="st-dp-3g">
              {MONTHS.map((m, i) => (
                <div key={m} className={`st-dp-item${cur.getMonth() === i ? ' a' : ''}`}
                  onClick={() => { setCur(new Date(cur.getFullYear(), i, 1)); setView('days'); }}>
                  {m.slice(0, 3)}
                </div>
              ))}
            </div>
          </>)}
          {view === 'years' && (<>
            <div className="st-dp-hd">
              <button className="st-dp-nav" onClick={() => setCur(new Date(cur.getFullYear() - 12, cur.getMonth(), 1))}><ChevronLeft /></button>
              <span className="st-dp-my">{years[0]} – {years[years.length - 1]}</span>
              <button className="st-dp-nav" onClick={() => setCur(new Date(cur.getFullYear() + 12, cur.getMonth(), 1))}><ChevronRight /></button>
            </div>
            <div className="st-dp-3g">
              {years.map(y => (
                <div key={y} className={`st-dp-item${cur.getFullYear() === y ? ' a' : ''}`}
                  onClick={() => { setCur(new Date(y, cur.getMonth(), 1)); setView('months'); }}>
                  {y}
                </div>
              ))}
            </div>
          </>)}
        </div>
      )}
    </div>
  );
};

// ── Types ──
interface Initiative {
  id?: number; title: string; progress: number; description?: string;
  targetValue?: string; currentValue?: string; unit?: string; period?: string;
  targetDate?: string; ownerName?: string; ownerId?: string | number;
  status?: string; updateRemarks?: string;
}

// ── Modal Portal ──
const Modal = ({ children, onClose }: { children: React.ReactNode; onClose: () => void }) => {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);
  return ReactDOM.createPortal(
    <div className="bhag-modal-portal" onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      {children}
    </div>,
    document.body,
  );
};

const SkeletonCards = () => (
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 w-full">
    {[1, 2, 3, 4].map(n => (
      <div key={n} className="bg-white/30 rounded-2xl p-4">
        <div className="st-skeleton h-4 w-3/4 mb-3" />
        <div className="st-skeleton h-2 w-full mt-4" />
      </div>
    ))}
  </div>
);

// ══════════════════════════════════════════════════════════
export const BhagSection = () => {
  const [activeModal, setActiveModal]       = useState<string | null>(null);
  const [editingGoalId, setEditingGoalId]   = useState<number | null>(null);

  // ── BHAG statement state (stored in yyyy-mm-dd internally) ──
  const [bhagStatement, setBhagStatement]   = useState('');
  const [bhagVideoUrl, setBhagVideoUrl]     = useState('');
  const [bhagTargetDate, setBhagTargetDate] = useState('');

  // ── Initiatives ──
  const [initiatives, setInitiatives]       = useState<Initiative[]>([]);
  const [isFetching, setIsFetching]         = useState(true);
  const [fetchError, setFetchError]         = useState<string | null>(null);

  // ── Edit BHAG modal state ──
  const [tempStatement, setTempStatement]   = useState('');
  const [tempVideoUrl, setTempVideoUrl]     = useState('');
  const [tempTargetDate, setTempTargetDate] = useState(''); // dd-mm-yyyy for picker

  // ── Goal modal state ──
  const [tempGoal, setTempGoal]             = useState<Initiative | null>(null);
  const [tempGoalDate, setTempGoalDate]     = useState('');

  // ── Save state ──
  const [isSaving, setIsSaving]             = useState(false);
  const [saveError, setSaveError]           = useState<string | null>(null);

  // ──────────────────────────────────────────────────────
  // FETCH BHAG statement
  // GET /extra_fields?q[group_name_in][]=business_plan_bhag&include_grouped=true
  //
  // Confirmed response structure:
  // {
  //   "success": true,
  //   "data": [...],           ← flat rows, not used
  //   "grouped_data": {
  //     "business_plan_bhag": {
  //       "values": ["statement text"],
  //       "video_url": null | "https://...",
  //       "target_date": "yyyy-mm-dd"
  //     }
  //   }
  // }
  // ──────────────────────────────────────────────────────
  const fetchBhagStatement = useCallback(async () => {
    try {
      const res = await fetch(
        apiUrl('/extra_fields?q[group_name_in][]=business_plan_bhag&include_grouped=true'),
        { method: 'GET', headers: authHeaders() }
      );
      if (!res.ok) return;

      const json = await res.json();

      // Use grouped_data.business_plan_bhag — confirmed exact shape
      const record = json?.grouped_data?.business_plan_bhag;
      if (!record) return;

      const stmt = Array.isArray(record.values)
        ? (record.values[0] || '')
        : (typeof record.values === 'string' ? record.values : '');

      if (stmt)               setBhagStatement(stmt);
      if (record.video_url)   setBhagVideoUrl(record.video_url);
      if (record.target_date) setBhagTargetDate(record.target_date); // stored as yyyy-mm-dd
    } catch (e) {
      console.warn('[BhagSection] fetchBhagStatement:', e);
    }
  }, []);

  // ──────────────────────────────────────────────────────
  // FETCH BHAG goals (initiatives)
  // GET /goals  →  filter by period === 'BHAG'
  // ──────────────────────────────────────────────────────
  const fetchGoals = useCallback(async () => {
    setIsFetching(true);
    setFetchError(null);
    try {
      const res = await fetch(apiUrl('/goals'), { method: 'GET', headers: authHeaders() });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();

      const records: any[] = Array.isArray(json) ? json : (json.goals || json.data || []);

      const bhagGoals = records.filter((g: any) => {
        const p = (g.period || '').toUpperCase();
        return p === 'BHAG' || p.includes('BHAG');
      });

      setInitiatives(
        bhagGoals.map((g: any, idx: number) => ({
          id:            g.id ?? idx + 1,
          title:         g.title || g.name || 'Untitled',
          progress:      clamp(g.progress_percentage ?? g.progress ?? 0),
          description:   g.description || '',
          targetValue:   String(g.target_value ?? '1'),
          currentValue:  String(g.current_value ?? '0'),
          unit:          g.unit || 'days',
          period:        g.period || 'BHAG',
          targetDate:    g.target_date || '',
          ownerName:     g.owner_name || '',
          ownerId:       g.owner_id || '',
          status:        g.status || 'On Track',
          updateRemarks: g.update_remarks || '',
        }))
      );
    } catch (err: any) {
      setFetchError(err.message || 'Failed to load BHAG data');
    } finally {
      setIsFetching(false);
    }
  }, []);

  useEffect(() => {
    fetchBhagStatement();
    fetchGoals();
  }, [fetchBhagStatement, fetchGoals]);

  // ──────────────────────────────────────────────────────
  // SAVE BHAG statement
  // POST /extra_fields/bulk_upsert
  // Exact payload (from Postman):
  // {
  //   "extra_field": {
  //     "group_name": "business_plan_bhag",
  //     "values": ["statement text"],
  //     "video_url": "https://...",       ← optional
  //     "target_date": "2030-12-31"       ← optional, yyyy-mm-dd
  //   }
  // }
  // ──────────────────────────────────────────────────────
  const saveBhagStatement = async () => {
    if (!tempStatement.trim()) { setSaveError('BHAG Statement cannot be empty.'); return; }
    setIsSaving(true);
    setSaveError(null);
    try {
      const apiDate = tempTargetDate ? toApiDate(tempTargetDate) : '';

      const payload: { extra_field: Record<string, any> } = {
        extra_field: {
          group_name: 'business_plan_bhag',
          values:     [tempStatement.trim()],
        },
      };
      // Only add optional fields if they have values
      if (tempVideoUrl.trim()) payload.extra_field.video_url   = tempVideoUrl.trim();
      if (apiDate)             payload.extra_field.target_date = apiDate;

      const res = await fetch(apiUrl('/extra_fields/bulk_upsert'), {
        method:  'POST',
        headers: authHeaders(),
        body:    JSON.stringify(payload),
      });

      if (!res.ok) {
        const errText = await res.text().catch(() => '');
        throw new Error(`API error ${res.status}${errText ? ': ' + errText : ''}`);
      }

      // ── Update local state immediately — no re-fetch ──
      setBhagStatement(tempStatement.trim());
      setBhagVideoUrl(tempVideoUrl.trim());
      setBhagTargetDate(apiDate);  // store as yyyy-mm-dd
      closeModal();
      fetchGoals(); // refresh initiatives only
    } catch (err: any) {
      setSaveError(err.message || 'Failed to save BHAG statement.');
    } finally {
      setIsSaving(false);
    }
  };

  // ── Save goal (create / update) ──
  const saveGoalDetails = async () => {
    if (!tempGoal) return;
    if (!tempGoal.title.trim()) { setSaveError('Goal title cannot be empty.'); return; }
    setIsSaving(true);
    setSaveError(null);

    const payload = {
      goal: {
        title:               tempGoal.title.trim(),
        description:         tempGoal.description || '',
        target_value:        Number(tempGoal.targetValue) || 1,
        current_value:       Number(tempGoal.currentValue) || 0,
        progress_percentage: clamp(tempGoal.progress),
        unit:                tempGoal.unit || 'days',
        period:              'BHAG',
        status:              tempGoal.status || 'On Track',
        owner_id:            tempGoal.ownerId ? Number(tempGoal.ownerId) : undefined,
        target_date:         tempGoalDate ? toApiDate(tempGoalDate) : '',
        update_remarks:      tempGoal.updateRemarks || '',
      },
    };

    try {
      const res = editingGoalId
        ? await fetch(apiUrl(`/goals/${editingGoalId}`), { method: 'PUT',  headers: authHeaders(), body: JSON.stringify(payload) })
        : await fetch(apiUrl('/goals'),                   { method: 'POST', headers: authHeaders(), body: JSON.stringify(payload) });

      if (!res.ok) {
        const errText = await res.text().catch(() => '');
        throw new Error(`API error ${res.status}${errText ? ': ' + errText : ''}`);
      }
      closeModal();
      fetchGoals();
    } catch (err: any) {
      setSaveError(err.message || 'Error saving goal.');
    } finally {
      setIsSaving(false);
    }
  };

  // ── Card slider — optimistic update ──
  const handleCardSlider = async (id: number, val: string) => {
    const c = clamp(val);
    setInitiatives(prev => prev.map(i => i.id === id ? { ...i, progress: c } : i));
    try {
      const res = await fetch(apiUrl(`/goals/${id}`), {
        method: 'PATCH', headers: authHeaders(),
        body: JSON.stringify({ goal: { progress_percentage: c, current_value: c } }),
      });
      if (!res.ok) fetchGoals();
    } catch { fetchGoals(); }
  };

  const deleteGoal = async (id: number) => {
    if (!window.confirm('Delete this initiative?')) return;
    try {
      const res = await fetch(apiUrl(`/goals/${id}`), { method: 'DELETE', headers: authHeaders() });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      fetchGoals();
    } catch (err: any) { alert('Failed to delete: ' + err.message); }
  };

  // ── Modal helpers ──
  const closeModal = () => {
    setActiveModal(null); setSaveError(null);
    setTempGoal(null); setTempGoalDate(''); setEditingGoalId(null);
  };

  const openBhagModal = () => {
    setTempStatement(bhagStatement);
    setTempVideoUrl(bhagVideoUrl);
    setTempTargetDate(toDisplayDate(bhagTargetDate)); // yyyy-mm-dd → dd-mm-yyyy for picker
    setSaveError(null);
    setActiveModal('bhag_statement');
  };

  const openGoalModal = (goal: Initiative) => {
    setTempGoal({ ...goal });
    setTempGoalDate(toDisplayDate(goal.targetDate || ''));
    setEditingGoalId(goal.id ?? null);
    setSaveError(null);
    setActiveModal('goal_details');
  };

  const addInitiative = () => {
    setTempGoal({ title: '', progress: 0, description: '', targetValue: '1', currentValue: '0', unit: 'days', period: 'BHAG', status: 'On Track', ownerId: '', updateRemarks: '' });
    setTempGoalDate('');
    setEditingGoalId(null);
    setSaveError(null);
    setActiveModal('goal_details');
  };

  const handleProgressChange = (val: string) => {
    const c = clamp(val);
    setTempGoal((prev: any) => ({ ...prev, progress: c, currentValue: String(c) }));
  };

  const iStyle: React.CSSProperties = {
    width: '100%', border: `1px solid ${C.borderLgt}`, borderRadius: 10,
    padding: '10px 14px', fontSize: 14, color: C.textMain, outline: 'none',
    fontFamily: C.font, transition: 'border-color .15s', background: '#fff',
  };

  // ──────────────────────────────────────────────────────
  return (
    <div className="bhag-wrap" style={{ padding: '24px 0', fontFamily: C.font }}>
      <ThemeStyle />

      <div className="rounded-2xl overflow-hidden shadow-sm mt-6" style={{ background: C.tealBg }}>
        <div className="p-6">

          {/* ── Header ── */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center bg-white/30 shrink-0 shadow-sm">
                <svg className="w-4 h-4" style={{ color: C.primary }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <circle cx="12" cy="12" r="10" strokeWidth={2} />
                  <circle cx="12" cy="12" r="6"  strokeWidth={2} />
                  <circle cx="12" cy="12" r="2"  strokeWidth={2} />
                </svg>
              </div>
              <span className="text-[12px] font-black tracking-[0.15em] text-[#070707] uppercase">
                Long Term — BHAG (Big Hairy Audacious Goal)
              </span>
            </div>
            <button onClick={openBhagModal}
              className="p-1.5 rounded-xl bg-white/30 hover:bg-white/50 transition-colors border border-white/20"
              style={{ color: C.textMain }}>
              <EditIcon />
            </button>
          </div>

          {/* ── BHAG Statement ── */}
          <div className="mb-5 pl-[36px]">
            {isFetching ? (
              <div className="flex items-center justify-between gap-4">
                <div className="st-skeleton h-7 w-2/3" />
                <div className="st-skeleton h-5 w-24 shrink-0" />
              </div>
            ) : bhagStatement ? (
              <div className="flex items-start justify-between gap-4">
                {/* Left — statement + video */}
                <div className="flex-1 min-w-0">
                  <p className="text-lg font-black leading-snug m-0" style={{ color: C.textMain }}>
                    {bhagStatement}
                  </p>
                  {bhagVideoUrl && (
                    <a href={bhagVideoUrl} target="_blank" rel="noreferrer"
                      className="text-xs font-semibold underline mt-1 inline-block"
                      style={{ color: C.textMain }}>
                      🎬 Watch Vision Video
                    </a>
                  )}
                </div>
                {/* Right — target date pill */}
                {bhagTargetDate && (
                  <div className="shrink-0 flex flex-col items-end gap-0.5">
                    <span className="text-[10px] font-black uppercase tracking-widest" style={{ color: 'rgba(0,0,0,0.4)' }}>
                      Target
                    </span>
                    <span className="text-sm font-black px-3 py-1 rounded-lg"
                      style={{ background: 'rgba(255,255,255,0.5)', color: C.textMain }}>
                      📅 {toDisplayDate(bhagTargetDate)}
                    </span>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-sm italic m-0" style={{ color: 'rgba(0,0,0,0.45)' }}>
                No BHAG statement yet — click ✏️ to add one.
              </p>
            )}
          </div>

          {/* ── Error ── */}
          {fetchError && (
            <div className="mb-4 bg-red-100 border border-red-300 text-red-700 text-sm font-semibold rounded-xl px-4 py-3 flex items-center justify-between gap-3">
              <span>⚠ {fetchError}</span>
              <button onClick={() => { fetchBhagStatement(); fetchGoals(); }} className="text-xs underline">Retry</button>
            </div>
          )}

          {/* ── Label ── */}
          <div className="pl-[36px] mb-3 flex items-center gap-2">
            <span className="text-[10px] font-black uppercase tracking-[0.15em]" style={{ color: '#070707' }}>
              Key Initiatives (BHAG)
            </span>
            {isFetching && <LoaderIcon className="w-3.5 h-3.5" style={{ color: C.textMuted }} />}
          </div>

          {/* ── Cards ── */}
          {isFetching ? <SkeletonCards /> : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 w-full">
              {initiatives.length === 0 && !fetchError && (
                <p className="col-span-2 text-sm italic py-2" style={{ color: C.textMuted }}>
                  No initiatives found. Add one below.
                </p>
              )}
              {initiatives.map(ini => (
                <div key={ini.id}
                  className="bg-white rounded-2xl p-4 shadow-sm group hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between gap-2 mb-4">
                    <div className="flex items-start gap-2.5 flex-1 min-w-0">
                      <div className="mt-1 w-3.5 h-3.5 rounded-full border-[3px] bg-white shrink-0"
                        style={{ borderColor: C.primary }} />
                      <span className="text-[14px] font-black leading-snug" style={{ color: C.textMain }}>
                        {ini.title}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0 bg-gray-50 px-1 py-1 rounded-xl border"
                      style={{ borderColor: C.borderLgt }}>
                      <button onClick={() => openGoalModal(ini)}
                        className="p-1 rounded-lg hover:bg-gray-100 transition-colors"
                        style={{ color: '#9ca3af' }}
                        onMouseEnter={e => e.currentTarget.style.color = C.primary}
                        onMouseLeave={e => e.currentTarget.style.color = '#9ca3af'}>
                        <EditIcon />
                      </button>
                      <button onClick={() => deleteGoal(ini.id as number)}
                        className="p-1 rounded-lg hover:bg-red-50 transition-colors"
                        style={{ color: '#9ca3af' }}
                        onMouseEnter={e => e.currentTarget.style.color = '#ef4444'}
                        onMouseLeave={e => e.currentTarget.style.color = '#9ca3af'}>
                        <TrashIcon />
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <input type="range" min="0" max="100" step="1"
                      value={ini.progress}
                      onChange={e => handleCardSlider(ini.id as number, e.target.value)}
                      className="st-goal-slider"
                      style={{ background: sliderBg(ini.progress) }} />
                    <span className="text-xs font-black w-9 text-right shrink-0 tabular-nums"
                      style={{ color: C.textMuted }}>
                      {ini.progress}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ── Add button ── */}
          <div className="mt-5 flex justify-end">
            <button onClick={addInitiative}
              className="text-sm font-black px-5 py-2.5 rounded-xl transition-colors border"
              style={{ color: C.primary, background: 'rgba(255,255,255,0.5)', borderColor: 'rgba(255,255,255,0.5)' }}
              onMouseEnter={e => e.currentTarget.style.background = '#fff'}
              onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.5)'}>
              + Add New Initiative
            </button>
          </div>
        </div>

        {/* ════════════════════════════════════════
            MODAL 1 — Edit BHAG Statement
        ════════════════════════════════════════ */}
        {activeModal === 'bhag_statement' && (
          <Modal onClose={closeModal}>
            <div className="bhag-modal-box" style={{ maxWidth: 520 }}>
              <div className="flex justify-between items-center px-6 py-5 border-b bg-white"
                style={{ borderColor: C.primaryBord }}>
                <div className="flex items-center gap-3">
                  <span style={{ width: 10, height: 10, borderRadius: '50%', background: C.primary, display: 'inline-block' }} />
                  <h2 className="font-black text-[17px] m-0" style={{ color: C.textMain }}>Edit BHAG</h2>
                </div>
                <button onClick={closeModal}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af', padding: 4, borderRadius: 8 }}>
                  <CloseIcon />
                </button>
              </div>

              <div className="p-6 overflow-y-auto" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                {saveError && <div className="st-error">{saveError}</div>}

                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 800, color: C.textMain, marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                    BHAG Statement <span style={{ color: C.primary }}>*</span>
                  </label>
                  <textarea
                    value={tempStatement}
                    onChange={e => setTempStatement(e.target.value)}
                    placeholder="e.g. Become the leading property management solution in India by 2030"
                    className="bhag-input"
                    style={{ minHeight: 90, resize: 'vertical', fontWeight: 700 }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 800, color: C.textMain, marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                    Video URL{' '}
                    <span style={{ fontSize: 11, fontWeight: 500, color: C.textMuted, textTransform: 'none' }}>(Optional)</span>
                  </label>
                  <input
                    type="url"
                    value={tempVideoUrl}
                    onChange={e => setTempVideoUrl(e.target.value)}
                    placeholder="https://youtube.com/watch?v=..."
                    className="bhag-input"
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 800, color: C.textMain, marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                    Target Date{' '}
                    <span style={{ fontSize: 11, fontWeight: 500, color: C.textMuted, textTransform: 'none' }}>(Optional)</span>
                  </label>
                  <DatePicker value={tempTargetDate} onChange={setTempTargetDate} placeholder="Select target date" />
                </div>
              </div>

              <div className="p-5 flex justify-end gap-3 border-t bg-white" style={{ borderColor: C.primaryBord }}>
                <button onClick={closeModal} disabled={isSaving}
                  style={{ padding: '10px 20px', fontSize: 13, fontWeight: 700, borderRadius: 10, cursor: 'pointer', border: `1px solid ${C.borderLgt}`, background: '#fff', color: C.textMain, fontFamily: C.font, opacity: isSaving ? 0.5 : 1 }}>
                  Cancel
                </button>
                <button onClick={saveBhagStatement} disabled={isSaving}
                  style={{ padding: '10px 24px', fontSize: 13, fontWeight: 700, borderRadius: 10, cursor: isSaving ? 'not-allowed' : 'pointer', border: 'none', background: C.primary, color: '#fff', fontFamily: C.font, opacity: isSaving ? 0.7 : 1, display: 'flex', alignItems: 'center', gap: 8 }}
                  onMouseEnter={e => { if (!isSaving) e.currentTarget.style.background = C.primaryHov; }}
                  onMouseLeave={e => e.currentTarget.style.background = C.primary}>
                  {isSaving && <LoaderIcon />}
                  {isSaving ? 'Saving...' : 'Save Vision'}
                </button>
              </div>
            </div>
          </Modal>
        )}

        {/* ════════════════════════════════════════
            MODAL 2 — Create / Edit Initiative
        ════════════════════════════════════════ */}
        {activeModal === 'goal_details' && tempGoal && (
          <Modal onClose={closeModal}>
            <div style={{
              background: '#fff', borderRadius: 16, boxShadow: '0 24px 64px rgba(0,0,0,0.18)',
              width: '100%', maxWidth: 640, display: 'flex', flexDirection: 'column',
              maxHeight: '90vh', overflow: 'hidden', fontFamily: C.font,
            }}>
              <div style={{ padding: '28px 28px 0', position: 'relative' }}>
                <button onClick={closeModal}
                  style={{ position: 'absolute', top: 20, right: 20, background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af', padding: 4, borderRadius: 6 }}>
                  <CloseIcon />
                </button>
                <h2 style={{ margin: 0, fontSize: 20, fontWeight: 800, color: C.textMain }}>
                  {editingGoalId ? 'Edit Initiative' : 'Create New Initiative'}
                </h2>
                <p style={{ margin: '6px 0 0', fontSize: 13, color: C.textMuted }}>
                  Set a measurable target that contributes to your BHAG
                </p>
              </div>

              <div style={{ padding: '24px 28px', overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: 20 }}>
                {saveError && <div className="st-error">{saveError}</div>}

                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: C.textMain, marginBottom: 6 }}>
                    Initiative Title <span style={{ color: C.primary }}>*</span>
                  </label>
                  <input type="text" value={tempGoal.title}
                    placeholder="e.g. Hire B2B Enterprise Sales Head"
                    onChange={e => setTempGoal({ ...tempGoal, title: e.target.value })}
                    style={iStyle}
                    onFocus={e => e.currentTarget.style.borderColor = C.primary}
                    onBlur={e => e.currentTarget.style.borderColor = C.borderLgt}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: C.textMain, marginBottom: 6 }}>
                    Description
                  </label>
                  <textarea placeholder="Add detailed description..."
                    value={tempGoal.description || ''}
                    onChange={e => setTempGoal({ ...tempGoal, description: e.target.value })}
                    style={{ ...iStyle, minHeight: 80, resize: 'vertical' }}
                    onFocus={e => e.currentTarget.style.borderColor = C.primary}
                    onBlur={e => e.currentTarget.style.borderColor = C.borderLgt}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: C.textMain, marginBottom: 6 }}>Target Value</label>
                    <input type="number" step="any" value={tempGoal.targetValue || ''} placeholder="e.g. 100"
                      onChange={e => setTempGoal({ ...tempGoal, targetValue: e.target.value })}
                      style={iStyle}
                      onFocus={e => e.currentTarget.style.borderColor = C.primary}
                      onBlur={e => e.currentTarget.style.borderColor = C.borderLgt}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: C.textMain, marginBottom: 6 }}>Target Date</label>
                    <DatePicker value={tempGoalDate} onChange={setTempGoalDate} placeholder="dd-mm-yyyy" />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: C.textMain, marginBottom: 6 }}>Owner ID</label>
                    <input type="number" value={tempGoal.ownerId || ''} placeholder="e.g. 123"
                      onChange={e => setTempGoal({ ...tempGoal, ownerId: e.target.value })}
                      style={iStyle}
                      onFocus={e => e.currentTarget.style.borderColor = C.primary}
                      onBlur={e => e.currentTarget.style.borderColor = C.borderLgt}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: C.textMain, marginBottom: 6 }}>Unit</label>
                    <select value={tempGoal.unit || ''} onChange={e => setTempGoal({ ...tempGoal, unit: e.target.value })} className="st-select">
                      <option value="">Select unit</option>
                      <option value="%">%</option>
                      <option value="days">Days</option>
                      <option value="Amount">Amount</option>
                      <option value="count">Count</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: C.textMain, marginBottom: 6 }}>Status</label>
                    <select value={tempGoal.status || 'On Track'} onChange={e => setTempGoal({ ...tempGoal, status: e.target.value })} className="st-select">
                      <option>On Track</option>
                      <option>Behind</option>
                      <option>At Risk</option>
                    </select>
                  </div>
                </div>

                {editingGoalId && (
                  <div style={{ background: C.primaryBg, borderRadius: 12, padding: '16px 18px', border: `1px solid ${C.primaryBord}` }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                      <label style={{ fontSize: 13, fontWeight: 700, color: C.textMain }}>Current Progress</label>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <input type="number" min="0" max="100" step="1" value={tempGoal.progress}
                          onChange={e => handleProgressChange(e.target.value)}
                          style={{ width: 56, border: `1px solid ${C.borderLgt}`, borderRadius: 8, textAlign: 'center', padding: '4px 6px', fontSize: 13, fontWeight: 800, outline: 'none', color: C.textMain, fontFamily: C.font, background: '#fff' }}
                        />
                        <span style={{ fontSize: 13, fontWeight: 700, color: C.textMuted }}>%</span>
                      </div>
                    </div>
                    <input type="range" min="0" max="100" step="1"
                      value={tempGoal.progress}
                      onChange={e => handleProgressChange(e.target.value)}
                      className="st-modal-slider"
                      style={{ background: sliderBg(tempGoal.progress) }}
                    />
                  </div>
                )}

                {editingGoalId && (
                  <div>
                    <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: C.textMain, marginBottom: 6 }}>Update Remarks</label>
                    <textarea placeholder="Add notes about progress..."
                      value={tempGoal.updateRemarks || ''}
                      onChange={e => setTempGoal({ ...tempGoal, updateRemarks: e.target.value })}
                      style={{ ...iStyle, minHeight: 60, resize: 'vertical' }}
                      onFocus={e => e.currentTarget.style.borderColor = C.primary}
                      onBlur={e => e.currentTarget.style.borderColor = C.borderLgt}
                    />
                  </div>
                )}
              </div>

              <div style={{ padding: '0 28px 28px' }}>
                <button onClick={saveGoalDetails} disabled={isSaving}
                  style={{
                    width: '100%', background: C.primary, color: '#fff', border: 'none',
                    borderRadius: 10, padding: '14px', fontSize: 15, fontWeight: 800,
                    cursor: isSaving ? 'not-allowed' : 'pointer', opacity: isSaving ? 0.7 : 1,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    gap: 8, fontFamily: C.font, transition: 'background .15s',
                  }}
                  onMouseEnter={e => { if (!isSaving) e.currentTarget.style.background = C.primaryHov; }}
                  onMouseLeave={e => { if (!isSaving) e.currentTarget.style.background = C.primary; }}>
                  {isSaving && <LoaderIcon />}
                  {isSaving ? 'Saving...' : editingGoalId ? 'Save Changes' : 'Create Initiative'}
                </button>
              </div>
            </div>
          </Modal>
        )}
      </div>
    </div>
  );
};