import React, { useState, useEffect, useCallback, useRef } from "react";
import ReactDOM from "react-dom";

// ── Design Tokens (same as QuarterlySection & MediumTermSection) ──
const C = {
  primary: "#DA7756",
  primaryHov: "#c9673f",
  primaryBg: "#f6f4ee",
  primaryTint: "rgba(218,119,86,0.06)",
  primaryBord: "#e8e3de",
  cardBg: "#ffffff",
  textMain: "#1a1a1a",
  textMuted: "#6b7280",
  borderLgt: "#ebebeb",
  font: "'Poppins', sans-serif",
};

const getBaseUrl = () => {
  const raw = (localStorage.getItem("baseUrl") || "").replace(/\/$/, "");
  if (!raw) return "";
  return raw.startsWith("http://") || raw.startsWith("https://")
    ? raw
    : `https://${raw}`;
};

export const BASE_URL = getBaseUrl();

const getAuthHeaders = (): Record<string, string> => {
  const token = localStorage.getItem("token") || "";
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: token } : {}),
  };
};

const formatDateForApi = (s: string): string => {
  if (!s) return "";
  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return s;
  const p = s.split("-");
  if (p.length === 3 && p[2].length === 4) return `${p[2]}-${p[1]}-${p[0]}`;
  return s;
};

const apiDateToDisplay = (s: string): string => {
  if (!s) return "";
  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) {
    const [y, m, d] = s.split("-");
    return `${d}-${m}-${y}`;
  }
  return s;
};

const parseDDMMYYYY = (s: string): Date | null => {
  if (!s) return null;
  const [d, m, y] = s.split("-").map(Number);
  if (!d || !m || !y) return null;
  const dt = new Date(y, m - 1, d);
  return isNaN(dt.getTime()) ? null : dt;
};

const toDDMMYYYY = (dt: Date): string =>
  `${String(dt.getDate()).padStart(2, "0")}-${String(dt.getMonth() + 1).padStart(2, "0")}-${dt.getFullYear()}`;

const clampProgress = (val: any): number => {
  const n = Math.round(Number(val));
  return isNaN(n) ? 0 : Math.min(100, Math.max(0, n));
};

const SHORT_TERM_PERIOD = "this_year";

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
const DAYS_SHORT = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
const sliderBg = (pct: number) =>
  `linear-gradient(to right, ${C.primary} ${pct}%, #e5e7eb ${pct}%)`;

// ── Icons ──
const InfoIcon = () => (
  <svg
    className="w-4 h-4"
    style={{ color: C.textMuted }}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);
const EditIcon = () => (
  <svg
    className="w-4 h-4"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
    />
  </svg>
);
const TrashIcon = () => (
  <svg
    className="w-4 h-4"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
    />
  </svg>
);
const CalendarIcon = () => (
  <svg
    className="w-4 h-4"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
    />
  </svg>
);
const ChevronLeft = () => (
  <svg
    className="w-4 h-4"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M15 19l-7-7 7-7"
    />
  </svg>
);
const ChevronRight = () => (
  <svg
    className="w-4 h-4"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 5l7 7-7 7"
    />
  </svg>
);
const LoaderIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={`${className} animate-spin`} fill="none" viewBox="0 0 24 24">
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth={4}
    />
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
    />
  </svg>
);
// Same header icon as Quarterly & Medium
const HeaderTargetIcon = () => (
  <svg
    className="w-5 h-5"
    style={{ color: C.primary }}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <circle cx="12" cy="12" r="9" strokeWidth={2.5} />
    <circle cx="12" cy="12" r="4" fill="currentColor" stroke="none" />
  </svg>
);
// Same large empty-state icon
const TargetLargeIcon = () => (
  <svg
    className="w-14 h-14 mx-auto mb-3"
    style={{ color: C.primary }}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
  >
    <circle cx="12" cy="12" r="10" />
    <circle cx="12" cy="12" r="6" />
    <circle cx="12" cy="12" r="2" fill="currentColor" />
  </svg>
);

// ── ThemeStyle (identical to Quarterly & Medium) ──
const ThemeStyle = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800;900&display=swap');
    .shortterm-wrap, .shortterm-wrap * { font-family: 'Poppins', sans-serif !important; }
    .st-goal-slider { -webkit-appearance:none; appearance:none; width:100%; height:6px; border-radius:99px; outline:none; cursor:pointer; }
    .st-goal-slider::-webkit-slider-thumb { -webkit-appearance:none; appearance:none; width:16px; height:16px; border-radius:50%; background:${C.primary}; cursor:pointer; border:2px solid white; box-shadow:0 1px 4px rgba(0,0,0,0.2); transition:transform 0.15s; }
    .st-goal-slider::-webkit-slider-thumb:hover { transform:scale(1.2); }
    .st-modal-slider { -webkit-appearance:none; appearance:none; width:100%; height:6px; border-radius:99px; outline:none; cursor:pointer; }
    .st-modal-slider::-webkit-slider-thumb { -webkit-appearance:none; appearance:none; width:18px; height:18px; border-radius:50%; background:${C.primary}; cursor:pointer; border:2px solid white; box-shadow:0 1px 4px rgba(0,0,0,0.2); transition:transform 0.15s; }
    .st-modal-slider::-webkit-slider-thumb:hover { transform:scale(1.2); }
    .st-modal-portal { position:fixed; inset:0; z-index:99999; display:flex; align-items:center; justify-content:center; padding:16px; background:rgba(0,0,0,0.42); backdrop-filter:blur(4px); }
    .st-modal-box { background:${C.primaryBg}; border-radius:20px; border:1px solid ${C.primaryBord}; box-shadow:0 30px 80px rgba(0,0,0,0.20); width:100%; display:flex; flex-direction:column; max-height:90vh; overflow:hidden; }
    .st-input { width:100%; border:1px solid ${C.borderLgt}; border-radius:12px; padding:10px 12px; font-size:13px; color:${C.textMain}; background:#fff; transition:border-color .15s,box-shadow .15s; outline:none; box-sizing:border-box; font-family:'Poppins',sans-serif; }
    .st-input:focus { border-color:${C.primary}; box-shadow:0 0 0 3px rgba(218,119,86,0.15); }
    .st-input::placeholder { color:#a3a3a3; }
    .st-textarea { width:100%; border:1px solid ${C.borderLgt}; border-radius:12px; padding:10px 12px; font-size:13px; color:${C.textMain}; background:#fff; transition:border-color .15s,box-shadow .15s; outline:none; box-sizing:border-box; min-height:72px; resize:vertical; font-family:'Poppins',sans-serif; }
    .st-textarea:focus { border-color:${C.primary}; box-shadow:0 0 0 3px rgba(218,119,86,0.15); }
    .st-textarea::placeholder { color:#a3a3a3; }
    .st-select { width:100%; border:1px solid ${C.borderLgt}; border-radius:12px; padding:10px 36px 10px 12px; font-size:13px; color:${C.textMain}; background:#fff; appearance:none; -webkit-appearance:none; background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23a3a3a3'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E"); background-repeat:no-repeat; background-position:right 10px center; background-size:16px; cursor:pointer; transition:border-color .15s,box-shadow .15s; outline:none; box-sizing:border-box; font-family:'Poppins',sans-serif; }
    .st-select:focus { border-color:${C.primary}; box-shadow:0 0 0 3px rgba(218,119,86,0.15); }
    .st-label { display:block; font-size:13px; font-weight:700; color:${C.textMain}; margin-bottom:6px; }
    .st-error-banner { background:#fee2e2; border:1px solid #fca5a5; color:#991b1b; border-radius:12px; padding:10px 14px; font-size:13px; font-weight:600; }
    .st-skeleton { background:linear-gradient(90deg,#eeebe4 25%,#e5e1d8 50%,#eeebe4 75%); background-size:200% 100%; animation:st-shimmer 1.4s infinite; border-radius:8px; }
    @keyframes st-shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }
    .st-dp-wrap { position:relative; }
    .st-dp-input-btn { width:100%; border:1px solid ${C.borderLgt}; border-radius:12px; padding:10px 12px; font-size:13px; color:${C.textMain}; background:#fff; display:flex; align-items:center; justify-content:space-between; cursor:pointer; transition:border-color .15s,box-shadow .15s; outline:none; box-sizing:border-box; font-family:'Poppins',sans-serif; }
    .st-dp-input-btn:focus, .st-dp-input-btn.open { border-color:${C.primary}; box-shadow:0 0 0 3px rgba(218,119,86,0.15); }
    .st-dp-input-btn .placeholder { color:#a3a3a3; }
    .st-dp-calendar { position:absolute; top:calc(100% + 6px); left:0; z-index:99999; background:#fff; border:1px solid ${C.borderLgt}; border-radius:16px; box-shadow:0 12px 40px rgba(0,0,0,0.12); padding:16px; width:280px; animation:dp-in .15s ease; font-family:'Poppins',sans-serif; }
    @keyframes dp-in { from{opacity:0;transform:translateY(-4px)} to{opacity:1;transform:translateY(0)} }
    .st-dp-header { display:flex; align-items:center; justify-content:space-between; margin-bottom:12px; }
    .st-dp-nav { background:none; border:none; padding:6px; border-radius:8px; cursor:pointer; color:${C.textMuted}; display:flex; align-items:center; }
    .st-dp-nav:hover { background:${C.primaryTint}; color:${C.primary}; }
    .st-dp-month-year { font-size:14px; font-weight:700; color:${C.textMain}; cursor:pointer; padding:4px 8px; border-radius:8px; }
    .st-dp-month-year:hover { background:${C.primaryTint}; color:${C.primary}; }
    .st-dp-grid { display:grid; grid-template-columns:repeat(7,1fr); gap:2px; }
    .st-dp-dow { text-align:center; font-size:11px; font-weight:700; color:${C.textMuted}; padding:4px 0 8px; }
    .st-dp-day { aspect-ratio:1; display:flex; align-items:center; justify-content:center; font-size:12px; font-weight:500; border-radius:8px; cursor:pointer; color:${C.textMain}; border:none; background:none; transition:background .1s,color .1s; }
    .st-dp-day:hover:not(.empty):not(.selected) { background:${C.primaryTint}; color:${C.primary}; }
    .st-dp-day.today:not(.selected) { color:${C.primary}; font-weight:800; }
    .st-dp-day.selected { background:${C.primary}; color:#fff; font-weight:700; }
    .st-dp-day.empty { cursor:default; }
    .st-dp-months,.st-dp-years { display:grid; grid-template-columns:repeat(3,1fr); gap:6px; padding:4px 0; }
    .st-dp-mitem,.st-dp-yitem { text-align:center; padding:8px 4px; border-radius:10px; font-size:13px; font-weight:600; cursor:pointer; color:${C.textMain}; transition:background .1s; }
    .st-dp-mitem:hover,.st-dp-yitem:hover { background:${C.primaryTint}; color:${C.primary}; }
    .st-dp-mitem.active,.st-dp-yitem.active { background:${C.primary}; color:#fff; }
    .st-dp-clear { margin-top:10px; padding-top:10px; border-top:1px solid ${C.borderLgt}; text-align:center; }
    .st-dp-clear button { font-size:12px; font-weight:600; color:${C.textMuted}; background:none; border:none; cursor:pointer; padding:4px 12px; border-radius:8px; }
    .st-dp-clear button:hover { background:#f3f4f6; color:${C.textMain}; }
  `}</style>
);

// ── DatePicker (identical to other two) ──
interface DatePickerProps {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}
const DatePicker: React.FC<DatePickerProps> = ({
  value,
  onChange,
  placeholder = "Select date",
}) => {
  const today = new Date();
  const parsed = parseDDMMYYYY(value);
  const [open, setOpen] = useState(false);
  const [view, setView] = useState<"days" | "months" | "years">("days");
  const [cursor, setCursor] = useState<Date>(
    parsed || new Date(today.getFullYear(), today.getMonth(), 1)
  );
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);
  const openPicker = () => {
    setCursor(
      parsed
        ? new Date(parsed.getFullYear(), parsed.getMonth(), 1)
        : new Date(today.getFullYear(), today.getMonth(), 1)
    );
    setView("days");
    setOpen(true);
  };
  const selectDay = (day: number) => {
    onChange(
      toDDMMYYYY(new Date(cursor.getFullYear(), cursor.getMonth(), day))
    );
    setOpen(false);
  };
  const daysInMonth = new Date(
    cursor.getFullYear(),
    cursor.getMonth() + 1,
    0
  ).getDate();
  const firstDow = new Date(
    cursor.getFullYear(),
    cursor.getMonth(),
    1
  ).getDay();
  const years = Array.from(
    { length: 21 },
    (_, i) => cursor.getFullYear() - 10 + i
  );
  const displayValue = parsed ? toDDMMYYYY(parsed) : "";
  return (
    <div className="st-dp-wrap" ref={ref}>
      <button
        type="button"
        className={`st-dp-input-btn${open ? " open" : ""}`}
        onClick={() => (open ? setOpen(false) : openPicker())}
      >
        <span
          className={displayValue ? "" : "placeholder"}
          style={{ fontSize: 13 }}
        >
          {displayValue || placeholder}
        </span>
        <span
          style={{ color: C.primary, display: "flex", alignItems: "center" }}
        >
          <CalendarIcon />
        </span>
      </button>
      {open && (
        <div className="st-dp-calendar">
          {view === "days" && (
            <>
              <div className="st-dp-header">
                <button
                  className="st-dp-nav"
                  onClick={() =>
                    setCursor(
                      new Date(cursor.getFullYear(), cursor.getMonth() - 1, 1)
                    )
                  }
                >
                  <ChevronLeft />
                </button>
                <span
                  className="st-dp-month-year"
                  onClick={() => setView("months")}
                >
                  {MONTHS[cursor.getMonth()]} {cursor.getFullYear()}
                </span>
                <button
                  className="st-dp-nav"
                  onClick={() =>
                    setCursor(
                      new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1)
                    )
                  }
                >
                  <ChevronRight />
                </button>
              </div>
              <div className="st-dp-grid">
                {DAYS_SHORT.map((d) => (
                  <div key={d} className="st-dp-dow">
                    {d}
                  </div>
                ))}
                {Array.from({ length: firstDow }).map((_, i) => (
                  <div key={`e${i}`} className="st-dp-day empty" />
                ))}
                {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(
                  (day) => {
                    const isToday =
                      day === today.getDate() &&
                      cursor.getMonth() === today.getMonth() &&
                      cursor.getFullYear() === today.getFullYear();
                    const isSelected =
                      parsed &&
                      day === parsed.getDate() &&
                      cursor.getMonth() === parsed.getMonth() &&
                      cursor.getFullYear() === parsed.getFullYear();
                    return (
                      <button
                        key={day}
                        type="button"
                        className={`st-dp-day${isToday ? " today" : ""}${isSelected ? " selected" : ""}`}
                        onClick={() => selectDay(day)}
                      >
                        {day}
                      </button>
                    );
                  }
                )}
              </div>
              {value && (
                <div className="st-dp-clear">
                  <button
                    onClick={() => {
                      onChange("");
                      setOpen(false);
                    }}
                  >
                    Clear
                  </button>
                </div>
              )}
            </>
          )}
          {view === "months" && (
            <>
              <div className="st-dp-header">
                <button
                  className="st-dp-nav"
                  onClick={() =>
                    setCursor(
                      new Date(cursor.getFullYear() - 1, cursor.getMonth(), 1)
                    )
                  }
                >
                  <ChevronLeft />
                </button>
                <span
                  className="st-dp-month-year"
                  onClick={() => setView("years")}
                >
                  {cursor.getFullYear()}
                </span>
                <button
                  className="st-dp-nav"
                  onClick={() =>
                    setCursor(
                      new Date(cursor.getFullYear() + 1, cursor.getMonth(), 1)
                    )
                  }
                >
                  <ChevronRight />
                </button>
              </div>
              <div className="st-dp-months">
                {MONTHS.map((m, i) => (
                  <div
                    key={m}
                    className={`st-dp-mitem${cursor.getMonth() === i ? " active" : ""}`}
                    onClick={() => {
                      setCursor(new Date(cursor.getFullYear(), i, 1));
                      setView("days");
                    }}
                  >
                    {m.slice(0, 3)}
                  </div>
                ))}
              </div>
            </>
          )}
          {view === "years" && (
            <>
              <div className="st-dp-header">
                <button
                  className="st-dp-nav"
                  onClick={() =>
                    setCursor(
                      new Date(cursor.getFullYear() - 12, cursor.getMonth(), 1)
                    )
                  }
                >
                  <ChevronLeft />
                </button>
                <span className="st-dp-month-year">
                  {years[0]} – {years[years.length - 1]}
                </span>
                <button
                  className="st-dp-nav"
                  onClick={() =>
                    setCursor(
                      new Date(cursor.getFullYear() + 12, cursor.getMonth(), 1)
                    )
                  }
                >
                  <ChevronRight />
                </button>
              </div>
              <div className="st-dp-years">
                {years.map((y) => (
                  <div
                    key={y}
                    className={`st-dp-yitem${cursor.getFullYear() === y ? " active" : ""}`}
                    onClick={() => {
                      setCursor(new Date(y, cursor.getMonth(), 1));
                      setView("months");
                    }}
                  >
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
  targetDate?: string;
  ownerName?: string;
  ownerId?: string | number;
  status?: string;
  updateRemarks?: string;
}

interface StrategicGoalData {
  title: string;
  goalType: string;
  targetDate: string;
  revenueTarget: string;
  profitTarget: string;
}

// ── Modal ──
const Modal = ({
  children,
  onClose,
}: {
  children: React.ReactNode;
  onClose: () => void;
}) => {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);
  return ReactDOM.createPortal(
    <div
      className="st-modal-portal"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {children}
    </div>,
    document.body
  );
};

// ── Skeleton (identical to other two) ──
const SkeletonCards = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    {[1, 2, 3, 4].map((n) => (
      <div
        key={n}
        className="rounded-2xl p-4 border"
        style={{ borderColor: C.borderLgt }}
      >
        <div className="st-skeleton h-4 w-3/4 mb-3" />
        <div className="st-skeleton h-2 w-full mt-4" />
      </div>
    ))}
  </div>
);

// ══════════════════════════════════════════════════════════
export const ShortTermSection = () => {
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [editingGoalId, setEditingGoalId] = useState<number | null>(null);

  const [goals, setGoals] = useState<Goal[]>([]);
  const [allGoals, setAllGoals] = useState<Goal[]>([]);

  const [strategicGoal, setStrategicGoal] = useState<StrategicGoalData>({
    title: "",
    goalType: "Short-term (This Year)",
    targetDate: "",
    revenueTarget: "",
    profitTarget: "",
  });

  // Track saved strategic goal ID for PUT on edit
  const [strategicGoalId, setStrategicGoalId] = useState<number | null>(null);

  const [tempStrategic, setTempStrategic] = useState<StrategicGoalData | null>(
    null
  );
  const [linkedStrategicInitiatives, setLinkedStrategicInitiatives] = useState<
    number[]
  >([]);

  const [isFetching, setIsFetching] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [tempGoal, setTempGoal] = useState<Goal | null>(null);
  const [tempGoalDate, setTempGoalDate] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Fetch the strategic goal (this_year + has revenue/profit target)
  const fetchStrategicGoal = useCallback(async () => {
    try {
      const res = await fetch(`${BASE_URL}/goals`, {
        method: "GET",
        headers: getAuthHeaders(),
      });
      if (!res.ok) return;
      const json = await res.json();
      const records: any[] = Array.isArray(json)
        ? json
        : json.goals || json.data || [];

      const strategic =
        records.find(
          (g: any) =>
            g.period === SHORT_TERM_PERIOD &&
            (g.revenue_target != null || g.profit_target != null)
        ) ||
        records.find(
          (g: any) =>
            g.period === SHORT_TERM_PERIOD &&
            g.description === "Strategic objective for this year"
        ) ||
        null;

      if (strategic) {
        setStrategicGoalId(strategic.id ?? null);
        setStrategicGoal({
          title: strategic.title || "",
          goalType: "Short-term (This Year)",
          targetDate: strategic.target_date || "",
          revenueTarget: String(strategic.revenue_target ?? ""),
          profitTarget: String(strategic.profit_target ?? ""),
        });
        const linked = Array.isArray(strategic.key_initiative_goals)
          ? strategic.key_initiative_goals
              .map((ki: any) => ki.id)
              .filter(Boolean)
          : [];
        setLinkedStrategicInitiatives(linked);
      } else {
        setStrategicGoalId(null);
        setStrategicGoal({
          title: "",
          goalType: "Short-term (This Year)",
          targetDate: "",
          revenueTarget: "",
          profitTarget: "",
        });
        setLinkedStrategicInitiatives([]);
      }
    } catch (err) {
      console.error("[ShortTermSection] fetchStrategicGoal:", err);
    }
  }, []);

  const fetchGoals = useCallback(async () => {
    setIsFetching(true);
    setFetchError(null);
    try {
      const res = await fetch(`${BASE_URL}/goals`, {
        method: "GET",
        headers: getAuthHeaders(),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      const records: any[] = Array.isArray(json)
        ? json
        : json.goals || json.data || [];

      const mapRecord = (g: any, idx: number): Goal => ({
        id: g.id ?? idx + 1,
        title: g.title || g.name || "Untitled Goal",
        progress: Number(g.progress_percentage ?? g.progress ?? 0),
        description: g.description || "",
        targetValue: String(g.target_value ?? "100"),
        currentValue: String(g.current_value ?? "0"),
        unit: g.unit || "%",
        period: g.period || SHORT_TERM_PERIOD,
        targetDate: g.target_date || "",
        ownerName: g.owner_name || "",
        ownerId: g.owner_id || "",
        status: g.status || "On Track",
        updateRemarks: g.update_remarks || "",
      });

      setAllGoals(records.map(mapRecord));

      // Filter only this_year goals, exclude the strategic marker goal
      const yearGoals = records.filter(
        (g: any) =>
          g.period === SHORT_TERM_PERIOD &&
          g.description !== "Strategic objective for this year"
      );
      setGoals(yearGoals.map(mapRecord));
    } catch (err: any) {
      setFetchError(err.message || "Failed to load goals");
    } finally {
      setIsFetching(false);
    }
  }, []);

  useEffect(() => {
    fetchStrategicGoal();
    fetchGoals();
  }, [fetchStrategicGoal, fetchGoals]);

  const handleCardSlider = async (id: number, val: string) => {
    const clamped = clampProgress(val);
    setGoals((prev) =>
      prev.map((g) => (g.id === id ? { ...g, progress: clamped } : g))
    );
    try {
      const res = await fetch(`${BASE_URL}/goals/${id}`, {
        method: "PATCH",
        headers: getAuthHeaders(),
        body: JSON.stringify({
          goal: { progress_percentage: clamped, current_value: clamped },
        }),
      });
      if (!res.ok) fetchGoals();
    } catch {
      fetchGoals();
    }
  };

  const closeModal = () => {
    setActiveModal(null);
    setSaveError(null);
    setTempGoal(null);
    setTempGoalDate("");
    setEditingGoalId(null);
    setTempStrategic(null);
  };

  const openStrategicModal = () => {
    setSaveError(null);
    setTempStrategic({
      title: strategicGoal.title,
      goalType: strategicGoal.goalType || "Short-term (This Year)",
      targetDate: apiDateToDisplay(strategicGoal.targetDate),
      revenueTarget: strategicGoal.revenueTarget,
      profitTarget: strategicGoal.profitTarget,
    });
    setActiveModal("edit_strategic");
  };

  const confirmDeleteStrategic = () =>
    setActiveModal("confirm_delete_strategic");

  const executeDeleteStrategic = async () => {
    if (!strategicGoalId) {
      closeModal();
      return;
    }
    setIsDeleting(true);
    try {
      const res = await fetch(`${BASE_URL}/goals/${strategicGoalId}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });
      if (!res.ok) throw new Error(`API error ${res.status}`);
      setStrategicGoal({
        title: "",
        goalType: "Short-term (This Year)",
        targetDate: "",
        revenueTarget: "",
        profitTarget: "",
      });
      setStrategicGoalId(null);
      setLinkedStrategicInitiatives([]);
      fetchGoals();
    } catch (err: any) {
      alert("Failed to delete: " + (err.message || "Unknown error"));
    } finally {
      setIsDeleting(false);
      closeModal();
    }
  };

  const openEditGoalModal = (goal: Goal) => {
    setTempGoal({ ...goal });
    setTempGoalDate(apiDateToDisplay(goal.targetDate || ""));
    setEditingGoalId(goal.id ?? null);
    setSaveError(null);
    setActiveModal("goal_details");
  };

  const openCreateGoalModal = () => {
    setTempGoal({
      title: "",
      progress: 0,
      description: "",
      targetValue: "100",
      currentValue: "0",
      unit: "%",
      period: SHORT_TERM_PERIOD,
      status: "On Track",
      ownerId: "",
      updateRemarks: "",
    });
    setTempGoalDate("");
    setEditingGoalId(null);
    setSaveError(null);
    setActiveModal("goal_details");
  };

  const saveStrategicGoal = async () => {
    if (!tempStrategic) return;
    if (!tempStrategic.title.trim()) {
      setSaveError("Goal Title cannot be empty.");
      return;
    }
    setIsSaving(true);
    setSaveError(null);
    try {
      const apiTargetDate = tempStrategic.targetDate.trim()
        ? formatDateForApi(tempStrategic.targetDate.trim())
        : "";
      const keyInitiatives = allGoals
        .filter((g) => linkedStrategicInitiatives.includes(g.id as number))
        .map((g) => ({ id: g.id, title: g.title }));

      const payload = {
        goal: {
          title: tempStrategic.title.trim(),
          description: "Strategic objective for this year",
          target_date: apiTargetDate,
          revenue_target: Number(tempStrategic.revenueTarget) || 0,
          profit_target: Number(tempStrategic.profitTarget) || 0,
          target_value: 100,
          current_value: 0,
          unit: "percent",
          period: SHORT_TERM_PERIOD,
          status: "on_track",
          owner_id: null,
          update_remarks: "",
          key_initiative_goals: keyInitiatives,
        },
      };

      let res: Response;
      if (strategicGoalId) {
        res = await fetch(`${BASE_URL}/goals/${strategicGoalId}`, {
          method: "PUT",
          headers: getAuthHeaders(),
          body: JSON.stringify(payload),
        });
      } else {
        res = await fetch(`${BASE_URL}/goals`, {
          method: "POST",
          headers: getAuthHeaders(),
          body: JSON.stringify(payload),
        });
      }
      if (!res.ok) throw new Error(`API error ${res.status}`);

      await fetchStrategicGoal();
      await fetchGoals();
      closeModal();
    } catch (err: any) {
      setSaveError(err.message || "Failed to save. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const saveGoalDetails = async () => {
    if (!tempGoal) return;
    if (!tempGoal.title.trim()) {
      setSaveError("Goal title cannot be empty.");
      return;
    }
    setIsSaving(true);
    setSaveError(null);

    const payload = {
      goal: {
        title: tempGoal.title.trim(),
        description: tempGoal.description || "",
        target_value: Number(tempGoal.targetValue) || 100,
        current_value: Number(tempGoal.currentValue) || 0,
        progress_percentage: clampProgress(tempGoal.progress),
        unit: tempGoal.unit || "%",
        period: SHORT_TERM_PERIOD,
        status: tempGoal.status || "On Track",
        owner_id: tempGoal.ownerId ? Number(tempGoal.ownerId) : undefined,
        target_date: tempGoalDate ? formatDateForApi(tempGoalDate) : "",
        update_remarks: tempGoal.updateRemarks || "",
      },
    };

    try {
      const res = editingGoalId
        ? await fetch(`${BASE_URL}/goals/${editingGoalId}`, {
            method: "PUT",
            headers: getAuthHeaders(),
            body: JSON.stringify(payload),
          })
        : await fetch(`${BASE_URL}/goals`, {
            method: "POST",
            headers: getAuthHeaders(),
            body: JSON.stringify(payload),
          });
      if (!res.ok) throw new Error(`API error ${res.status}`);
      closeModal();
      fetchGoals();
    } catch (err: any) {
      setSaveError(err.message || "Error saving goal.");
    } finally {
      setIsSaving(false);
    }
  };

  const deleteGoal = async (id: number) => {
    if (!window.confirm("Delete this goal?")) return;
    try {
      const res = await fetch(`${BASE_URL}/goals/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      fetchGoals();
    } catch (err: any) {
      alert("Failed to delete: " + err.message);
    }
  };

  const handleModalProgressChange = (val: string) => {
    const c = clampProgress(val);
    setTempGoal((prev: any) => ({
      ...prev,
      progress: c,
      currentValue: String(c),
    }));
  };

  const toggleStrategicLink = (id: number) => {
    setLinkedStrategicInitiatives((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const isEditingStrategic = !!strategicGoal.title;

  const modalBtnBase: React.CSSProperties = {
    border: "none",
    borderRadius: 10,
    padding: "10px 20px",
    fontSize: 13,
    fontWeight: 700,
    cursor: "pointer",
    fontFamily: C.font,
  };

  return (
    <div
      className="shortterm-wrap"
      style={{ padding: "24px 0", fontFamily: C.font }}
    >
      <ThemeStyle />

      <div
        className="rounded-2xl overflow-hidden shadow-sm mt-6 border"
        style={{ background: C.cardBg, borderColor: C.borderLgt }}
      >
        {/* ── Header (same as Quarterly & Medium) ── */}
        <div
          className="px-6 py-4 border-b flex items-center justify-between"
          style={{ borderColor: C.borderLgt, background: C.primaryBg }}
        >
          <div className="flex items-center gap-2">
            <HeaderTargetIcon />
            <h2
              className="font-black text-lg m-0"
              style={{ color: C.textMain }}
            >
              Short-term Goals — This Year
            </h2>
            <InfoIcon />
          </div>
          {isFetching && <LoaderIcon className="w-4 h-4" />}
        </div>

        <div className="p-6">
          {/* ── Strategic Goal block (same as Quarterly & Medium) ── */}
          <div className="mb-8">
            {isFetching ? (
              <div className="st-skeleton h-24 w-full rounded-xl" />
            ) : strategicGoal.title ? (
              <div
                className="bg-white rounded-xl p-5 flex justify-between items-center group transition-all"
                style={{
                  border: `1px solid ${C.borderLgt}`,
                  boxShadow: "0 2px 8px rgba(0,0,0,0.02)",
                }}
              >
                <div>
                  <h3
                    className="font-bold text-[16px] m-0"
                    style={{ color: C.textMain }}
                  >
                    {strategicGoal.title}
                  </h3>
                  {(strategicGoal.revenueTarget ||
                    strategicGoal.profitTarget) && (
                    <div
                      className="text-[12px] mt-1.5 flex gap-3"
                      style={{ color: C.textMuted }}
                    >
                      {strategicGoal.revenueTarget &&
                        strategicGoal.revenueTarget !== "0" && (
                          <span>Revenue: ₹{strategicGoal.revenueTarget}Cr</span>
                        )}
                      {strategicGoal.profitTarget &&
                        strategicGoal.profitTarget !== "0" && (
                          <span>Profit: ₹{strategicGoal.profitTarget}Cr</span>
                        )}
                    </div>
                  )}
                  {strategicGoal.targetDate && (
                    <div
                      className="text-[11px] mt-1"
                      style={{ color: C.textMuted }}
                    >
                      📅 Target: {apiDateToDisplay(strategicGoal.targetDate)}
                    </div>
                  )}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={openStrategicModal}
                    className="p-2 bg-gray-50 hover:bg-gray-100 rounded-lg cursor-pointer transition-colors text-gray-500 border"
                    style={{ borderColor: C.borderLgt }}
                    title="Edit Goal"
                  >
                    <EditIcon />
                  </button>
                  <button
                    onClick={confirmDeleteStrategic}
                    className="p-2 bg-gray-50 hover:bg-red-50 rounded-lg cursor-pointer transition-colors text-gray-500 hover:text-red-500 border"
                    style={{ borderColor: C.borderLgt }}
                    title="Delete Goal"
                  >
                    <TrashIcon />
                  </button>
                </div>
              </div>
            ) : (
              /* Empty state — dashed border, TargetLargeIcon, same as Quarterly & Medium */
              <div
                className="text-center py-10 rounded-2xl mb-4"
                style={{
                  border: `2px dashed ${C.primaryBord}`,
                  backgroundColor: "#fffaf9",
                }}
              >
                <TargetLargeIcon />
                <h3
                  className="text-[16px] font-bold mb-1"
                  style={{ color: C.textMain }}
                >
                  Set Your Annual Priorities
                </h3>
                <p className="text-[13px] mb-5" style={{ color: C.textMuted }}>
                  What are your top goals this year?
                </p>
                <button
                  onClick={openStrategicModal}
                  className="px-5 py-2.5 rounded-lg font-bold text-[13px] transition-colors shadow-sm flex items-center justify-center mx-auto gap-2 text-white"
                  style={{ background: C.primary }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.background = C.primaryHov)
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.background = C.primary)
                  }
                >
                  + Add Annual Goal
                </button>
              </div>
            )}
          </div>

          {/* ── Fetch Error ── */}
          {fetchError && (
            <div className="mb-5 bg-red-100 border border-red-300 text-red-700 text-sm font-semibold rounded-xl px-4 py-3 flex items-center justify-between gap-3">
              <span>⚠ {fetchError}</span>
              <button onClick={fetchGoals} className="text-xs underline">
                Retry
              </button>
            </div>
          )}

          {/* ── Section label (same uppercase style as Quarterly & Medium) ── */}
          <div className="mb-3 flex items-center gap-2">
            <span
              className="text-[10px] font-black uppercase tracking-[0.15em]"
              style={{ color: "#070707" }}
            >
              Annual Initiatives
            </span>
          </div>

          {/* ── Goal Cards (same layout & style as Quarterly & Medium) ── */}
          {isFetching ? (
            <SkeletonCards />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
              {goals.length === 0 && !fetchError && (
                <p
                  className="col-span-2 text-sm italic py-2"
                  style={{ color: C.textMuted }}
                >
                  No annual goals found. Add one below.
                </p>
              )}
              {goals.map((goal) => (
                <div
                  key={goal.id}
                  className="rounded-2xl p-4 transition-all group hover:shadow-md"
                  style={{
                    background: C.cardBg,
                    border: `1px solid ${C.borderLgt}`,
                  }}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-start gap-2.5 flex-1 min-w-0">
                      {/* Bullet circle — same as Quarterly & Medium */}
                      <div
                        className="mt-1 w-3.5 h-3.5 rounded-full border-[3px] bg-white shrink-0"
                        style={{ borderColor: C.primary }}
                      />
                      <div>
                        <span
                          className="font-black text-[14px] leading-snug block"
                          style={{ color: C.textMain }}
                        >
                          {goal.title}
                        </span>
                        <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                          <span
                            className="inline-block px-2 py-0.5 text-[10px] font-black rounded-full uppercase tracking-wider"
                            style={{
                              background: C.primaryTint,
                              color: C.primary,
                            }}
                          >
                            THIS YEAR
                          </span>
                          {(goal.ownerName || goal.targetDate) && (
                            <span
                              className="text-xs font-medium"
                              style={{ color: C.textMuted }}
                            >
                              {goal.ownerName && (
                                <span style={{ color: C.primary }}>• </span>
                              )}
                              {goal.ownerName}
                              {goal.targetDate && (
                                <span className="ml-1">
                                  📅 {apiDateToDisplay(goal.targetDate)}
                                </span>
                              )}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    {/* Edit / Delete — hover reveal, same as Quarterly & Medium */}
                    <div
                      className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0 bg-gray-50 px-1 py-1 rounded-xl border ml-2"
                      style={{ borderColor: C.borderLgt }}
                    >
                      <button
                        onClick={() => openEditGoalModal(goal)}
                        className="p-1 rounded-lg transition-colors"
                        style={{ color: "#9ca3af" }}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.color = C.primary)
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.color = "#9ca3af")
                        }
                      >
                        <EditIcon />
                      </button>
                      <button
                        onClick={() => deleteGoal(goal.id as number)}
                        className="p-1 rounded-lg transition-colors"
                        style={{ color: "#9ca3af" }}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.color = "#ef4444")
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.color = "#9ca3af")
                        }
                      >
                        <TrashIcon />
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <input
                      type="range"
                      min="0"
                      max="100"
                      step="1"
                      value={goal.progress}
                      onChange={(e) =>
                        handleCardSlider(goal.id as number, e.target.value)
                      }
                      className="st-goal-slider"
                      style={{ background: sliderBg(goal.progress) }}
                    />
                    <span
                      className="text-xs font-black w-9 text-right shrink-0 tabular-nums"
                      style={{ color: C.textMuted }}
                    >
                      {goal.progress}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ── Add button (same style as Quarterly & Medium) ── */}
          <div className="mt-6 flex justify-end">
            <button
              onClick={openCreateGoalModal}
              className="text-sm font-black px-4 py-2 rounded-xl transition-colors"
              style={{ color: C.primary, background: "transparent" }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = C.primaryTint)
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = "transparent")
              }
            >
              + Add New Initiative
            </button>
          </div>
        </div>

        {/* ══ Strategic Modal (same as Quarterly & Medium) ══ */}
        {activeModal === "edit_strategic" && tempStrategic && (
          <Modal onClose={closeModal}>
            <div className="st-modal-box" style={{ maxWidth: 600 }}>
              <div
                className="flex justify-between items-center px-6 py-5 border-b bg-white"
                style={{ borderColor: C.primaryBord }}
              >
                <div>
                  <h2
                    className="font-black text-[17px] m-0"
                    style={{ color: C.textMain }}
                  >
                    {isEditingStrategic
                      ? "Edit Annual Strategic Goal"
                      : "Add Annual Strategic Goal"}
                  </h2>
                  <p
                    style={{
                      margin: "4px 0 0",
                      fontSize: 12,
                      color: C.textMuted,
                    }}
                  >
                    {isEditingStrategic
                      ? "Update your annual direction"
                      : "Define your core objective for this year"}
                  </p>
                </div>
                <button
                  onClick={closeModal}
                  className="p-1 rounded-xl hover:bg-black/5 transition-colors"
                  style={{ color: "#9ca3af" }}
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
              <div
                className="p-6 space-y-5 overflow-y-auto"
                style={{ maxHeight: "65vh" }}
              >
                {saveError && (
                  <div className="st-error-banner">{saveError}</div>
                )}
                <div>
                  <label className="st-label">
                    Goal Title <span style={{ color: C.primary }}>*</span>
                  </label>
                  <input
                    type="text"
                    value={tempStrategic.title}
                    onChange={(e) =>
                      setTempStrategic({
                        ...tempStrategic,
                        title: e.target.value,
                      })
                    }
                    placeholder="e.g., Achieve ₹100Cr Revenue this year"
                    className="st-input font-bold"
                    autoFocus
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="st-label">Goal Type</label>
                    <select
                      value={tempStrategic.goalType}
                      onChange={(e) =>
                        setTempStrategic({
                          ...tempStrategic,
                          goalType: e.target.value,
                        })
                      }
                      className="st-select"
                    >
                      <option>Short-term (This Year)</option>
                      <option>Short-term (Quarterly)</option>
                      <option>Medium-term (1-3 years)</option>
                    </select>
                  </div>
                  <div>
                    <label className="st-label">Target Date</label>
                    <DatePicker
                      value={tempStrategic.targetDate}
                      onChange={(v) =>
                        setTempStrategic({ ...tempStrategic, targetDate: v })
                      }
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="st-label">Revenue Target (₹Cr)</label>
                    <input
                      type="number"
                      step="any"
                      value={tempStrategic.revenueTarget}
                      onChange={(e) =>
                        setTempStrategic({
                          ...tempStrategic,
                          revenueTarget: e.target.value,
                        })
                      }
                      placeholder="e.g. 100"
                      className="st-input"
                    />
                  </div>
                  <div>
                    <label className="st-label">Profit Target (₹Cr)</label>
                    <input
                      type="number"
                      step="any"
                      value={tempStrategic.profitTarget}
                      onChange={(e) =>
                        setTempStrategic({
                          ...tempStrategic,
                          profitTarget: e.target.value,
                        })
                      }
                      placeholder="e.g. 20"
                      className="st-input"
                    />
                  </div>
                </div>
                <div>
                  <label className="st-label">Key Initiatives</label>
                  <p
                    className="text-[11px] mb-2"
                    style={{ color: C.textMuted }}
                  >
                    Link operational goals as key initiatives for this year
                  </p>
                  <div
                    className="border rounded-xl p-2 max-h-40 overflow-y-auto space-y-1"
                    style={{ borderColor: C.borderLgt }}
                  >
                    {allGoals.length === 0 ? (
                      <p
                        className="text-sm italic px-2 py-1"
                        style={{ color: C.textMuted }}
                      >
                        No goals available to link.
                      </p>
                    ) : (
                      allGoals.map((g) => (
                        <label
                          key={g.id}
                          className="flex items-start gap-3 p-2 hover:bg-gray-50 rounded-lg cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={linkedStrategicInitiatives.includes(
                              g.id as number
                            )}
                            onChange={() => toggleStrategicLink(g.id as number)}
                            className="mt-0.5 w-4 h-4"
                            style={{ accentColor: C.primary }}
                          />
                          <span
                            className="text-[13px] font-medium leading-tight"
                            style={{ color: C.textMain }}
                          >
                            {g.title}
                          </span>
                        </label>
                      ))
                    )}
                  </div>
                </div>
              </div>
              <div
                className="p-5 flex justify-end gap-3 border-t bg-white"
                style={{ borderColor: C.primaryBord }}
              >
                <button
                  onClick={closeModal}
                  style={{
                    ...modalBtnBase,
                    color: C.textMain,
                    background: "#fff",
                    border: `1px solid ${C.borderLgt}`,
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={saveStrategicGoal}
                  disabled={isSaving}
                  style={{
                    ...modalBtnBase,
                    color: "#fff",
                    background: C.primary,
                    opacity: isSaving ? 0.7 : 1,
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                  }}
                  onMouseEnter={(e) => {
                    if (!isSaving)
                      e.currentTarget.style.background = C.primaryHov;
                  }}
                  onMouseLeave={(e) => {
                    if (!isSaving) e.currentTarget.style.background = C.primary;
                  }}
                >
                  {isSaving && <LoaderIcon />}
                  {isSaving
                    ? "Saving..."
                    : isEditingStrategic
                      ? "Update"
                      : "Save Goal"}
                </button>
              </div>
            </div>
          </Modal>
        )}

        {/* ══ Create/Edit Goal Modal (same as Quarterly & Medium) ══ */}
        {activeModal === "goal_details" && tempGoal && (
          <Modal onClose={closeModal}>
            <div
              style={{
                background: "#fff",
                borderRadius: 16,
                boxShadow: "0 24px 64px rgba(0,0,0,0.18)",
                width: "100%",
                maxWidth: 640,
                display: "flex",
                flexDirection: "column",
                maxHeight: "90vh",
                overflow: "hidden",
                fontFamily: C.font,
              }}
            >
              <div style={{ padding: "28px 28px 0", position: "relative" }}>
                <button
                  onClick={closeModal}
                  style={{
                    position: "absolute",
                    top: 20,
                    right: 20,
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: "#9ca3af",
                    padding: 4,
                    borderRadius: 6,
                  }}
                >
                  <svg
                    width="20"
                    height="20"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
                <h2
                  style={{
                    margin: 0,
                    fontSize: 20,
                    fontWeight: 800,
                    color: C.textMain,
                  }}
                >
                  {editingGoalId
                    ? "Edit Annual Initiative"
                    : "Create Annual Initiative"}
                </h2>
                <p
                  style={{
                    margin: "6px 0 0",
                    fontSize: 13,
                    color: C.textMuted,
                  }}
                >
                  Set a measurable target for this year
                </p>
              </div>
              <div
                style={{
                  padding: "24px 28px",
                  overflowY: "auto",
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  gap: 20,
                }}
              >
                {saveError && (
                  <div className="st-error-banner">{saveError}</div>
                )}
                <div>
                  <label className="st-label">
                    Title <span style={{ color: C.primary }}>*</span>
                  </label>
                  <input
                    type="text"
                    value={tempGoal.title}
                    onChange={(e) =>
                      setTempGoal({ ...tempGoal, title: e.target.value })
                    }
                    className="st-input"
                    placeholder="e.g. Increase conversion by 15%"
                    autoFocus
                  />
                </div>
                <div>
                  <label className="st-label">Description</label>
                  <textarea
                    value={tempGoal.description}
                    onChange={(e) =>
                      setTempGoal({ ...tempGoal, description: e.target.value })
                    }
                    className="st-textarea"
                    placeholder="Add details..."
                  />
                </div>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: 16,
                  }}
                >
                  <div>
                    <label className="st-label">Target Value</label>
                    <input
                      type="number"
                      step="any"
                      value={tempGoal.targetValue}
                      onChange={(e) =>
                        setTempGoal({
                          ...tempGoal,
                          targetValue: e.target.value,
                        })
                      }
                      className="st-input"
                    />
                  </div>
                  <div>
                    <label className="st-label">Target Date</label>
                    <DatePicker
                      value={tempGoalDate}
                      onChange={setTempGoalDate}
                    />
                  </div>
                </div>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr 1fr",
                    gap: 16,
                  }}
                >
                  <div>
                    <label className="st-label">Owner ID</label>
                    <input
                      type="number"
                      value={tempGoal.ownerId || ""}
                      placeholder="e.g. 123"
                      onChange={(e) =>
                        setTempGoal({ ...tempGoal, ownerId: e.target.value })
                      }
                      className="st-input"
                    />
                  </div>
                  <div>
                    <label className="st-label">Unit</label>
                    <select
                      value={tempGoal.unit || ""}
                      onChange={(e) =>
                        setTempGoal({ ...tempGoal, unit: e.target.value })
                      }
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
                    <label className="st-label">Status</label>
                    <select
                      value={tempGoal.status || "On Track"}
                      onChange={(e) =>
                        setTempGoal({ ...tempGoal, status: e.target.value })
                      }
                      className="st-select"
                    >
                      <option>On Track</option>
                      <option>Behind</option>
                      <option>At Risk</option>
                    </select>
                  </div>
                </div>
                {editingGoalId && (
                  <div
                    style={{
                      background: C.primaryBg,
                      borderRadius: 12,
                      padding: "16px 18px",
                      border: `1px solid ${C.primaryBord}`,
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: 12,
                      }}
                    >
                      <label
                        style={{
                          fontSize: 13,
                          fontWeight: 700,
                          color: C.textMain,
                        }}
                      >
                        Current Progress
                      </label>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 6,
                        }}
                      >
                        <input
                          type="number"
                          min="0"
                          max="100"
                          step="1"
                          value={tempGoal.progress}
                          onChange={(e) =>
                            handleModalProgressChange(e.target.value)
                          }
                          style={{
                            width: 56,
                            border: `1px solid ${C.borderLgt}`,
                            borderRadius: 8,
                            textAlign: "center",
                            padding: "4px 6px",
                            fontSize: 13,
                            fontWeight: 800,
                            outline: "none",
                            color: C.textMain,
                            fontFamily: C.font,
                          }}
                        />
                        <span
                          style={{
                            fontSize: 13,
                            fontWeight: 700,
                            color: C.textMuted,
                          }}
                        >
                          %
                        </span>
                      </div>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      step="1"
                      value={tempGoal.progress}
                      onChange={(e) =>
                        handleModalProgressChange(e.target.value)
                      }
                      className="st-modal-slider"
                      style={{ background: sliderBg(tempGoal.progress) }}
                    />
                    <div
                      className="text-white font-black text-center py-2 rounded-xl text-[13px] mt-4"
                      style={{ background: C.primary }}
                    >
                      {tempGoal.progress.toFixed(1)}% Completed
                    </div>
                  </div>
                )}
                {editingGoalId && (
                  <div>
                    <label className="st-label">Update Remarks</label>
                    <textarea
                      placeholder="Add notes about progress..."
                      value={tempGoal.updateRemarks}
                      onChange={(e) =>
                        setTempGoal({
                          ...tempGoal,
                          updateRemarks: e.target.value,
                        })
                      }
                      className="st-textarea"
                    />
                  </div>
                )}
              </div>
              <div style={{ padding: "0 28px 28px" }}>
                <button
                  onClick={saveGoalDetails}
                  disabled={isSaving}
                  style={{
                    width: "100%",
                    background: C.primary,
                    color: "#fff",
                    border: "none",
                    borderRadius: 10,
                    padding: "14px",
                    fontSize: 15,
                    fontWeight: 800,
                    cursor: isSaving ? "not-allowed" : "pointer",
                    opacity: isSaving ? 0.7 : 1,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 8,
                    fontFamily: C.font,
                  }}
                  onMouseEnter={(e) => {
                    if (!isSaving)
                      e.currentTarget.style.background = C.primaryHov;
                  }}
                  onMouseLeave={(e) => {
                    if (!isSaving) e.currentTarget.style.background = C.primary;
                  }}
                >
                  {isSaving && <LoaderIcon />}
                  {isSaving
                    ? "Saving..."
                    : editingGoalId
                      ? "Save Changes"
                      : "Create Goal"}
                </button>
              </div>
            </div>
          </Modal>
        )}

        {/* ══ Confirm Delete Strategic Modal (same as Quarterly & Medium) ══ */}
        {activeModal === "confirm_delete_strategic" && (
          <Modal onClose={closeModal}>
            <div
              style={{
                background: "#fff",
                borderRadius: 16,
                boxShadow: "0 24px 64px rgba(0,0,0,0.18)",
                width: "100%",
                maxWidth: 380,
                overflow: "hidden",
                fontFamily: C.font,
              }}
            >
              <div style={{ padding: "28px 28px 8px", textAlign: "center" }}>
                <div style={{ fontSize: 36, marginBottom: 12 }}>🗑️</div>
                <div
                  style={{
                    fontSize: 15,
                    fontWeight: 700,
                    color: C.textMain,
                    marginBottom: 8,
                  }}
                >
                  Delete Annual Goal?
                </div>
                <p style={{ fontSize: 13, color: C.textMuted, margin: 0 }}>
                  This action cannot be undone.
                </p>
              </div>
              <div
                style={{
                  padding: "20px 28px 28px",
                  display: "flex",
                  justifyContent: "center",
                  gap: 12,
                }}
              >
                <button
                  onClick={executeDeleteStrategic}
                  disabled={isDeleting}
                  style={{
                    padding: "10px 24px",
                    fontWeight: 700,
                    color: "#fff",
                    background: "#dc2626",
                    border: "none",
                    borderRadius: 10,
                    fontSize: 13,
                    cursor: isDeleting ? "not-allowed" : "pointer",
                    opacity: isDeleting ? 0.7 : 1,
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    fontFamily: C.font,
                  }}
                >
                  {isDeleting && <LoaderIcon />}
                  {isDeleting ? "Deleting..." : "Delete"}
                </button>
                <button
                  onClick={closeModal}
                  disabled={isDeleting}
                  style={{
                    padding: "10px 24px",
                    fontWeight: 700,
                    color: C.textMain,
                    background: "#f3f4f6",
                    border: "none",
                    borderRadius: 10,
                    fontSize: 13,
                    cursor: "pointer",
                    fontFamily: C.font,
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </Modal>
        )}
      </div>
    </div>
  );
};
