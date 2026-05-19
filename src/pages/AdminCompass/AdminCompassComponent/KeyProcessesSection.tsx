import { useState, useEffect, useCallback, useRef } from "react";
import ReactDOM from "react-dom";
import { toast } from "sonner";

// ── Design tokens ──
const C = {
  primary: "#DA7756",
  primaryHov: "#c9673f",
  primaryBg: "#fdf9f7",
  primaryTint: "rgba(218,119,86,0.06)",
  primaryBord: "#e8e3de",
  primaryBordStrong: "#d4cdc6",
  pageBg: "#f6f4ee",
  cardBg: "#ffffff",
  tealBg: "#f6f4ee",
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

// ── Icons ──
const DocIcon = () => (
  <svg
    style={{ width: 17, height: 17, color: C.primary }}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
    />
  </svg>
);
const FileIcon = () => (
  <svg
    style={{ width: 14, height: 14 }}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 9h1.5m-1.5 4h6m-6 4h6"
    />
  </svg>
);
const InfoIcon = () => (
  <svg
    style={{ width: 15, height: 15, color: "#1a1a1a", opacity: 0.5 }}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);
const PlusIcon = () => (
  <svg
    style={{ width: 14, height: 14 }}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2.5}
      d="M12 4v16m8-8H4"
    />
  </svg>
);
const SelectIcon = () => (
  <svg
    style={{ width: 14, height: 14 }}
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
const CloseIcon = () => (
  <svg
    style={{ width: 13, height: 13 }}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2.5}
      d="M6 18L18 6M6 6l12 12"
    />
  </svg>
);
const TrashIcon = () => (
  <svg
    style={{ width: 13, height: 13 }}
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
const EditIcon = () => (
  <svg
    style={{ width: 13, height: 13 }}
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
const SearchIcon = () => (
  <svg
    style={{ width: 15, height: 15, color: "#a3a3a3" }}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
    />
  </svg>
);
const RunningIcon = () => (
  <svg
    style={{ width: 14, height: 14, color: "#16a34a" }}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);
const BrokenIcon = () => (
  <svg
    style={{ width: 14, height: 14, color: "#f87171" }}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
    />
  </svg>
);
const LoaderIcon = () => (
  <svg
    style={{ width: 15, height: 15, animation: "kp-spin 0.8s linear infinite" }}
    fill="none"
    viewBox="0 0 24 24"
  >
    <circle
      style={{ opacity: 0.25 }}
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth={4}
    />
    <path
      style={{ opacity: 0.75 }}
      fill="currentColor"
      d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
    />
  </svg>
);

// ── Custom Searchable Select ──
const SearchableSelect = ({
  value,
  onChange,
  options,
  loading,
  placeholder,
}: any) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  const filteredOptions = options.filter((o: any) =>
    o.name.toLowerCase().startsWith(search.toLowerCase())
  );

  const selectedName =
    options.find((o: any) => String(o.id) === String(value))?.name ||
    placeholder;

  return (
    <div ref={ref} style={{ position: "relative", width: "100%" }}>
      <div
        onClick={() => !loading && setIsOpen(!isOpen)}
        className="kp-select"
        style={{
          cursor: loading ? "not-allowed" : "pointer",
          display: "flex",
          alignItems: "center",
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
          paddingRight: "36px",
        }}
      >
        {loading ? "Loading..." : selectedName}
      </div>

      {isOpen && (
        <div
          style={{
            position: "absolute",
            top: "100%",
            left: 0,
            right: 0,
            zIndex: 99,
            background: "#fff",
            border: `1px solid ${C.primaryBord}`,
            borderRadius: 12,
            marginTop: 6,
            boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
            maxHeight: 220,
          }}
        >
          <input
            type="text"
            autoFocus
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="kp-input"
            style={{
              border: "none",
              borderBottom: `1px solid ${C.borderLgt}`,
              borderRadius: 0,
              padding: "10px 14px",
              background: "#fff",
              outline: "none",
            }}
          />
          <div className="kp-modal-body" style={{ overflowY: "auto", flex: 1 }}>
            <div
              onClick={() => {
                onChange("");
                setIsOpen(false);
                setSearch("");
              }}
              style={{
                padding: "10px 14px",
                fontSize: 13,
                cursor: "pointer",
                fontFamily: C.font,
                color: C.textMuted,
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "#f9f9f9")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = "transparent")
              }
            >
              Clear selection
            </div>
            {filteredOptions.map((o: any) => {
              const isSelected = String(o.id) === String(value);
              return (
                <div
                  key={o.id}
                  onClick={() => {
                    onChange(String(o.id));
                    setIsOpen(false);
                    setSearch("");
                  }}
                  style={{
                    padding: "10px 14px",
                    fontSize: 13,
                    cursor: "pointer",
                    fontFamily: C.font,
                    background: isSelected ? C.primaryTint : "transparent",
                    color: isSelected ? C.primary : C.textMain,
                    fontWeight: isSelected ? 700 : 500,
                  }}
                  onMouseEnter={(e) => {
                    if (!isSelected)
                      e.currentTarget.style.background = "#f9f9f9";
                  }}
                  onMouseLeave={(e) => {
                    if (!isSelected)
                      e.currentTarget.style.background = "transparent";
                  }}
                >
                  {o.name}
                </div>
              );
            })}
            {filteredOptions.length === 0 && (
              <div
                style={{
                  padding: "12px 14px",
                  fontSize: 13,
                  color: "#a3a3a3",
                  fontStyle: "italic",
                  textAlign: "center",
                }}
              >
                No match found
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// ── Theme Styles ──
const ThemeStyle = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800;900&display=swap');
    .kp-wrap * { font-family: 'Poppins', sans-serif !important; }
    @keyframes kp-spin    { to { transform: rotate(360deg); } }
    @keyframes kp-pulse   { 0%,100%{opacity:1} 50%{opacity:.5} }
    @keyframes kp-shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }
    .kp-skeleton {
      background: linear-gradient(90deg,rgba(218,119,86,0.07) 25%,rgba(218,119,86,0.03) 50%,rgba(218,119,86,0.07) 75%);
      background-size: 200% 100%; animation: kp-shimmer 1.4s infinite; border-radius: 12px;
    }
    .kp-overlay {
      position: fixed; inset: 0; z-index: 99999;
      display: flex; align-items: center; justify-content: center;
      padding: 16px;
      background: rgba(0,0,0,0.40);
      backdrop-filter: blur(4px); -webkit-backdrop-filter: blur(4px);
    }
    .kp-modal {
      background: #f6f4ee; border-radius: 20px;
      border: 1px solid rgba(218,119,86,0.20);
      box-shadow: 0 30px 80px rgba(0,0,0,0.20);
      width: 100%; position: relative;
      display: flex; flex-direction: column;
      max-height: 90vh; overflow: hidden;
      font-family: 'Poppins', sans-serif;
    }
    .kp-modal-body { overflow-y: auto; flex: 1; }
    .kp-modal-body::-webkit-scrollbar { width: 6px; }
    .kp-modal-body::-webkit-scrollbar-track { background: transparent; }
    .kp-modal-body::-webkit-scrollbar-thumb { background: #C4B89D; border-radius: 10px; }
    .kp-modal-body::-webkit-scrollbar-thumb:hover { background: #DA7756; }
    .kp-input {
      width: 100%; border: 1px solid #e5e7eb; border-radius: 12px;
      padding: 9px 12px; font-size: 13px; font-weight: 600;
      color: #1a1a1a; background: #fffaf8;
      transition: border-color .15s, box-shadow .15s;
      box-sizing: border-box; outline: none;
      font-family: 'Poppins', sans-serif !important;
    }
    .kp-input:focus { border-color: #DA7756; box-shadow: 0 0 0 3px rgba(218,119,86,0.15); }
    .kp-input::placeholder { color: #a3a3a3; font-weight: 500; }
    .kp-textarea {
      width: 100%; border: 1px solid #e5e7eb; border-radius: 12px;
      padding: 9px 12px; font-size: 13px; font-weight: 600;
      color: #1a1a1a; background: #fffaf8;
      transition: border-color .15s, box-shadow .15s;
      box-sizing: border-box; resize: vertical; min-height: 88px;
      outline: none; font-family: 'Poppins', sans-serif !important;
    }
    .kp-textarea:focus { border-color: #DA7756; box-shadow: 0 0 0 3px rgba(218,119,86,0.15); }
    .kp-textarea::placeholder { color: #a3a3a3; font-weight: 500; }
    .kp-select {
      width: 100%; border: 1px solid #e5e7eb; border-radius: 12px;
      padding: 9px 36px 9px 12px; font-size: 13px; font-weight: 600;
      color: #1a1a1a; background: #fffaf8;
      appearance: none; -webkit-appearance: none;
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23a3a3a3'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E");
      background-repeat: no-repeat; background-position: right 10px center; background-size: 16px;
      cursor: pointer; outline: none; box-sizing: border-box;
      font-family: 'Poppins', sans-serif !important;
    }
    .kp-select:focus { border-color: #DA7756; box-shadow: 0 0 0 3px rgba(218,119,86,0.15); }
    .kp-search {
      width: 100%; border: 1.5px solid #e5e7eb; border-radius: 12px;
      padding: 9px 12px 9px 38px; font-size: 13px; font-weight: 600;
      color: #1a1a1a; background: #fffaf8;
      box-sizing: border-box; transition: border-color .15s; outline: none;
      font-family: 'Poppins', sans-serif !important;
    }
    .kp-search:focus { border-color: #DA7756; box-shadow: 0 0 0 3px rgba(218,119,86,0.15); }
    .kp-search::placeholder { color: #a3a3a3; font-weight: 500; }
    .kp-list-item {
      border: 1.5px solid #ebebeb; border-radius: 14px;
      padding: 12px 14px; cursor: pointer; background: #fff;
      transition: border-color .15s, box-shadow .15s;
      box-shadow: 0 1px 3px rgba(0,0,0,0.04);
    }
    .kp-list-item:hover { border-color: #e8e3de; box-shadow: 0 4px 12px rgba(218,119,86,0.09); }
    .kp-list-item.selected-item { border-color: #DA7756; background: #fdf9f7; }
    .kp-process-card {
      background: #fff; border-radius: 14px;
      border: 1px solid #ebebeb; border-left: 4px solid #DA7756;
      display: flex; flex-direction: column; gap: 8px;
      padding: 12px 16px;
      box-shadow: 0 1px 4px rgba(0,0,0,0.05);
      transition: box-shadow .2s, transform .2s;
    }
    .kp-process-card:hover { box-shadow: 0 8px 32px rgba(218,119,86,0.12); transform: translateY(-1px); }
    .kp-process-card .card-actions { opacity: 0; transition: opacity .15s; }
    .kp-process-card:hover .card-actions { opacity: 1; }
    .kp-checkbox-custom {
      width: 17px; height: 17px;
      border: 1.5px solid #d4d4d4; border-radius: 5px;
      background: #fff; cursor: pointer; flex-shrink: 0;
      display: flex; align-items: center; justify-content: center;
      transition: all .15s;
    }
    .kp-checkbox-custom.checked { background: #DA7756; border-color: #DA7756; }
    .kp-tooltip {
      position: absolute; top: 28px; left: 50%; transform: translateX(-50%);
      width: 380px; background-color: #0B1221; color: #ffffff;
      padding: 18px 24px; border-radius: 10px;
      box-shadow: 0 8px 32px rgba(0,0,0,0.5); z-index: 99999;
      font-size: 12px; line-height: 1.6; text-align: center;
      border: 1px solid rgba(255,255,255,0.08);
      font-family: 'Poppins', sans-serif; cursor: default;
    }
    .kp-slider {
      -webkit-appearance: none;
      width: 100%;
      height: 6px;
      background: #e5e7eb;
      border-radius: 4px;
      outline: none;
    }
    .kp-slider::-webkit-slider-thumb {
      -webkit-appearance: none;
      appearance: none;
      width: 16px;
      height: 16px;
      border-radius: 50%;
      background: #DA7756;
      cursor: pointer;
      transition: transform .1s;
    }
    .kp-slider::-webkit-slider-thumb:hover {
      transform: scale(1.2);
    }
  `}</style>
);

// ── Portal Modal ──
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
      className="kp-overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {children}
    </div>,
    document.body
  );
};

// ── Shared icon button ──
const BtnIcon = ({ children, onClick, title = "", danger = false }: any) => (
  <button
    onClick={onClick}
    title={title}
    style={{
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      width: 28,
      height: 28,
      borderRadius: 8,
      background: "#fff",
      border: `1px solid ${C.primaryBord}`,
      color: "#9ca3af",
      cursor: "pointer",
      boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
      transition: "all .15s",
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.background = danger ? "#fff5f5" : C.primaryBg;
      e.currentTarget.style.color = danger ? "#dc2626" : C.primary;
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.background = "#fff";
      e.currentTarget.style.color = "#9ca3af";
    }}
  >
    {children}
  </button>
);

// ── Status badge ──
const STATUS_CONFIG: Record<
  string,
  { bg: string; color: string; border: string }
> = {
  "to start": { bg: "#fef9f0", color: "#92400e", border: "#fde68a" },
  running: { bg: "#f0fdf4", color: "#166534", border: "#bbf7d0" },
  broken: { bg: "#fef2f2", color: "#991b1b", border: "#fecaca" },
  complete: { bg: "#fdf9f7", color: "#9a3412", border: "#e8e3de" },
};
const StatusBadge = ({ status }: { status: string }) => {
  const cfg = STATUS_CONFIG[status?.toLowerCase()] || STATUS_CONFIG["to start"];
  return (
    <span
      style={{
        background: cfg.bg,
        color: cfg.color,
        border: `1px solid ${cfg.border}`,
        fontSize: 11,
        fontWeight: 700,
        padding: "3px 10px",
        borderRadius: 99,
        whiteSpace: "nowrap",
        fontFamily: C.font,
      }}
    >
      {status}
    </span>
  );
};

// ── Types ──
interface SopItem {
  id: number;
  name: string;
  status: string;
  description?: string;
  owner?: string | null;
  health?: number;
  priority?: string;
  documentation_url?: string;
  department_id?: number | null;
  assignee_id?: number | null;
}

const EMPTY_FORM = {
  name: "",
  description: "",
  department_id: "",
  status: "To Start",
  priority: "Medium",
  assignee_id: "",
  health_score: 0,
  documentation_url: "",
};

const STATUSES = ["To Start", "Running", "Broken", "Complete"];
const PRIORITIES = ["Low", "Medium", "High"];

const labelSt: React.CSSProperties = {
  display: "block",
  fontSize: 12,
  fontWeight: 800,
  color: "#1a1a1a",
  marginBottom: 6,
  fontFamily: C.font,
};
const reqStar = <span style={{ color: C.primary }}>*</span>;

// ── Field-level inline hint ──
const FieldHint = ({ msg }: { msg: string }) => (
  <p
    style={{
      fontSize: 11,
      color: "#dc2626",
      marginTop: 4,
      fontWeight: 600,
      fontFamily: C.font,
    }}
  >
    {msg}
  </p>
);

// ══════════════════════════════════════════════════════════
export const KeyProcessesSection = () => {
  const [displayedSops, setDisplayedSops] = useState<SopItem[]>([]);
  const [allSops, setAllSops] = useState<SopItem[]>([]);
  const [isFetching, setIsFetching] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [editingSop, setEditingSop] = useState<SopItem | null>(null);
  const [pendingDeleteId, setPendingDeleteId] = useState<number | null>(null);
  const [form, setForm] = useState<any>(EMPTY_FORM);
  const [selectIds, setSelectIds] = useState<number[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showInfoTooltip, setShowInfoTooltip] = useState(false);
  // track whether user has attempted save (to show inline hints)
  const [attempted, setAttempted] = useState(false);

  const [departments, setDepartments] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [loadingDepts, setLoadingDepts] = useState(false);

  const fetchDepartmentsAndUsers = useCallback(async () => {
    try {
      setLoadingDepts(true);
      const depRes = await fetch(`${BASE_URL}/pms/departments.json`, {
        headers: getAuthHeaders(),
      });
      if (depRes.ok) {
        const dJson = await depRes.json();
        const dList = Array.isArray(dJson)
          ? dJson
          : dJson.departments || dJson.data || [];
        setDepartments(
          dList
            .filter((d: any) => d?.id)
            .map((d: any) => ({
              id: d.id,
              name:
                d.name ||
                d.title ||
                d.department_name ||
                d.label ||
                `Dept ${d.id}`,
            }))
        );
      }
    } catch (err) {
      console.error("Failed to fetch departments", err);
    } finally {
      setLoadingDepts(false);
    }

    try {
      setLoadingUsers(true);
      const orgId = localStorage.getItem("org_id") || "";
      const userRes = await fetch(
        `${BASE_URL}/api/users?organization_id=${orgId}`,
        { headers: getAuthHeaders() }
      );
      if (userRes.ok) {
        const uJson = await userRes.json();
        const uList = Array.isArray(uJson)
          ? uJson
          : uJson.users || uJson.data || [];
        setUsers(
          uList
            .filter((u: any) => u?.id)
            .map((u: any) => {
              const fName =
                u.full_name ||
                u.name ||
                `${u.first_name || ""} ${u.last_name || ""}`.trim();
              return { id: u.id, name: fName || `User ${u.id}` };
            })
        );
      }
    } catch (err) {
      console.error("Failed to fetch users", err);
    } finally {
      setLoadingUsers(false);
    }
  }, []);

  useEffect(() => {
    fetchDepartmentsAndUsers();
  }, [fetchDepartmentsAndUsers]);

  const fetchSops = useCallback(async () => {
    setIsFetching(true);
    setFetchError(null);
    try {
      const res = await fetch(`${BASE_URL}/system_sops`, {
        method: "GET",
        headers: getAuthHeaders(),
      });
      const rawText = await res.text();
      if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      let json: any;
      try {
        json = JSON.parse(rawText);
      } catch {
        json = [];
      }
      const records: any[] = Array.isArray(json)
        ? json
        : json.data || json.system_sops || [];
      const mapped: SopItem[] = records.map((r: any) => ({
        id: r.id,
        name: r.system_name || r.name || "",
        status: (r.status || "to start").toLowerCase(),
        description: r.description || "",
        owner: r.assignee?.name || r.owner || null,
        health: r.health_score ?? 0,
        priority: r.priority || "medium priority",
        documentation_url: r.documentation_url || "",
        department_id: r.department_id || null,
        assignee_id: r.assignee_id || null,
      }));
      setAllSops(mapped);
      const initial = mapped.slice(0, 6);
      setDisplayedSops(initial);
      setSelectIds(initial.map((s) => s.id));
    } catch (err: any) {
      setFetchError(err.message || "Failed to load SOPs.");
    } finally {
      setIsFetching(false);
    }
  }, []);

  useEffect(() => {
    fetchSops();
  }, [fetchSops]);

  // ── Validation ──
  const validate = () => {
    if (!form.name.trim()) {
      toast.error("System name is required.");
      return false;
    }
    if (!form.department_id) {
      toast.error("Please select a department.");
      return false;
    }
    if (!form.priority) {
      toast.error("Please select a priority.");
      return false;
    }
    return true;
  };

  const createSop = async () => {
    setAttempted(true);
    if (!validate()) return;
    setIsSaving(true);
    try {
      const payload = {
        system_sop: {
          system_name: form.name.trim(),
          description: form.description || "",
          department_id: Number(form.department_id),
          status: form.status,
          priority: form.priority,
          assignee_id: form.assignee_id ? Number(form.assignee_id) : null,
          health_score: Number(form.health_score) || 0,
          documentation_url: form.documentation_url || "",
          kpis: [],
        },
      };
      const res = await fetch(`${BASE_URL}/system_sops`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const t = await res.text();
        throw new Error(`API error ${res.status}: ${t || res.statusText}`);
      }
      closeModal();
      fetchSops();
      toast.success("System/SOP created successfully!");
    } catch (err: any) {
      toast.error(err.message || "Failed to create SOP.");
    } finally {
      setIsSaving(false);
    }
  };

  const updateSop = async () => {
    setAttempted(true);
    if (!editingSop || !validate()) return;
    setIsSaving(true);
    try {
      const payload = {
        system_sop: {
          system_name: form.name.trim(),
          description: form.description || "",
          department_id: Number(form.department_id),
          status: form.status,
          priority: form.priority,
          assignee_id: form.assignee_id ? Number(form.assignee_id) : null,
          health_score: Number(form.health_score) || 0,
          documentation_url: form.documentation_url || "",
          kpis: [],
        },
      };
      const res = await fetch(`${BASE_URL}/system_sops/${editingSop.id}`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const t = await res.text();
        throw new Error(`API error ${res.status}: ${t || res.statusText}`);
      }
      closeModal();
      fetchSops();
      toast.success("System/SOP updated successfully!");
    } catch (err: any) {
      toast.error(err.message || "Failed to update SOP.");
    } finally {
      setIsSaving(false);
    }
  };

  // ── Delete: open confirm modal instead of window.confirm ──
  const requestDelete = (id: number) => {
    setPendingDeleteId(id);
    setActiveModal("confirm_delete");
  };

  const executeDelete = async () => {
    if (!pendingDeleteId) {
      closeModal();
      return;
    }
    const id = pendingDeleteId;
    setIsDeleting(true);
    try {
      const res = await fetch(`${BASE_URL}/system_sops/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });
      if (!res.ok) {
        const t = await res.text();
        throw new Error(`API error ${res.status}: ${t}`);
      }
      setDisplayedSops((prev) => prev.filter((s) => s.id !== id));
      setAllSops((prev) => prev.filter((s) => s.id !== id));
      setSelectIds((prev) => prev.filter((x) => x !== id));
      toast.success("System/SOP deleted successfully!");
    } catch (err: any) {
      toast.error(`Delete failed: ${err.message}`);
    } finally {
      setIsDeleting(false);
      setPendingDeleteId(null);
      closeModal();
    }
  };

  const closeModal = () => {
    setActiveModal(null);
    setForm(EMPTY_FORM);
    setEditingSop(null);
    setSearchQuery("");
    setAttempted(false);
    setPendingDeleteId(null);
  };

  const openCreate = () => {
    setEditingSop(null);
    setForm(EMPTY_FORM);
    setAttempted(false);
    setActiveModal("create");
  };

  const openEdit = (sop: SopItem) => {
    setEditingSop(sop);

    const rawPriority = (sop.priority || "Medium")
      .replace(/ priority/i, "")
      .trim();
    const formattedPriority =
      rawPriority.charAt(0).toUpperCase() + rawPriority.slice(1).toLowerCase();

    setForm({
      name: sop.name,
      description: sop.description || "",
      status: sop.status.charAt(0).toUpperCase() + sop.status.slice(1),
      priority: formattedPriority,
      health_score: sop.health ?? 0,
      documentation_url: sop.documentation_url || "",
      department_id: sop.department_id ? String(sop.department_id) : "",
      assignee_id: sop.assignee_id ? String(sop.assignee_id) : "",
    });
    setAttempted(false);
    setActiveModal("edit");
  };

  const openSelect = () => {
    setSelectIds(displayedSops.map((s) => s.id));
    setSearchQuery("");
    setActiveModal("select");
  };

  const toggleSelect = (id: number) =>
    setSelectIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );

  const handleSaveSelection = () => {
    setDisplayedSops(allSops.filter((s) => selectIds.includes(s.id)));
    closeModal();
    toast.success("Selection saved!");
  };

  const filteredSops = allSops.filter(
    (s) =>
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (s.owner || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.status.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const selectedCount = selectIds.length;
  const isValidCount = selectedCount >= 3 && selectedCount <= 6;

  const Shimmer = ({ h = 56 }: { h?: number }) => (
    <div className="kp-skeleton" style={{ height: h }} />
  );

  return (
    <div className="kp-wrap" style={{ fontFamily: C.font, marginTop: 24 }}>
      <ThemeStyle />

      <div
        style={{
          borderRadius: 8,
          border: `1px solid ${C.primaryBord}`,
          boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
        }}
      >
        {/* ── Header ── */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "18px 20px",
            background: C.tealBg,
            borderTopLeftRadius: 8,
            borderTopRightRadius: 8,
            borderBottom: `2px solid ${C.primaryBord}`,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <DocIcon />
            </div>
            <h1
              style={{
                fontSize: 12,
                fontWeight: 900,
                color: "#070707",
                margin: 0,
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                fontFamily: C.font,
              }}
            >
              Key Processes (SOPs)
            </h1>
            <div
              style={{
                position: "relative",
                display: "flex",
                alignItems: "center",
                cursor: "pointer",
              }}
              onMouseEnter={() => setShowInfoTooltip(true)}
              onMouseLeave={() => setShowInfoTooltip(false)}
            >
              <InfoIcon />
              {showInfoTooltip && (
                <div className="kp-tooltip">
                  <div
                    style={{ fontWeight: 800, marginBottom: 12, fontSize: 13 }}
                  >
                    SWOT Analysis - Know Yourself
                  </div>
                  <div style={{ marginBottom: 12 }}>
                    <span style={{ fontWeight: 800 }}>
                      Strengths & Weaknesses:
                    </span>{" "}
                    What you control inside your business
                  </div>
                  <div style={{ marginBottom: 16 }}>
                    <span style={{ fontWeight: 800 }}>
                      Opportunities & Threats:
                    </span>{" "}
                    External market forces you must respond to
                  </div>
                  <div
                    style={{
                      fontStyle: "italic",
                      marginBottom: 16,
                      color: "#cbd5e1",
                    }}
                  >
                    From Scaling Up: "Leverage your strengths, shore up
                    weaknesses, exploit opportunities, and protect against
                    threats."
                  </div>
                  <div style={{ marginBottom: 4, color: "#cbd5e1" }}>
                    Indian context examples:
                  </div>
                  <div style={{ fontStyle: "italic", color: "#cbd5e1" }}>
                    Opportunity: Growing middle class, Digital India push, GST
                    simplification
                  </div>
                  <div
                    style={{
                      fontStyle: "italic",
                      color: "#cbd5e1",
                      marginTop: 4,
                    }}
                  >
                    Threat: New competitors, regulatory changes, talent shortage
                    in smaller cities
                  </div>
                </div>
              )}
            </div>
            {isFetching && <LoaderIcon />}
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <button
              onClick={openCreate}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                fontSize: 12,
                fontWeight: 800,
                color: "#070707",
                background: "rgba(255,255,255,0.25)",
                border: "1px solid rgba(255,255,255,0.40)",
                borderRadius: 8,
                padding: "6px 14px",
                cursor: "pointer",
                fontFamily: C.font,
                transition: "background .15s",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "rgba(255,255,255,0.40)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = "rgba(255,255,255,0.25)")
              }
            >
              <PlusIcon /> Create New
            </button>
            <div
              style={{ width: 1, height: 16, background: "rgba(0,0,0,0.15)" }}
            />
            <button
              onClick={openSelect}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                fontSize: 12,
                fontWeight: 800,
                color: "#070707",
                background: "transparent",
                border: "none",
                cursor: "pointer",
                fontFamily: C.font,
                opacity: 0.7,
                transition: "opacity .15s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = "1")}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = "0.7")}
            >
              <SelectIcon /> Select
            </button>
          </div>
        </div>

        {/* ── Body ── */}
        <div
          style={{
            padding: 20,
            background: C.tealBg,
            borderBottomLeftRadius: 8,
            borderBottomRightRadius: 8,
          }}
        >
          {fetchError && (
            <div
              style={{
                background: "#fee2e2",
                border: "1px solid #fca5a5",
                color: "#991b1b",
                borderRadius: 12,
                padding: "10px 14px",
                fontSize: 13,
                fontWeight: 700,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 8,
                marginBottom: 16,
              }}
            >
              <span>⚠ {fetchError}</span>
              <button
                onClick={fetchSops}
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "#991b1b",
                  textDecoration: "underline",
                  fontFamily: C.font,
                }}
              >
                Retry
              </button>
            </div>
          )}

          {isFetching ? (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3,1fr)",
                gap: 12,
              }}
            >
              {[1, 2, 3].map((n) => (
                <Shimmer key={n} />
              ))}
            </div>
          ) : displayedSops.length === 0 ? (
            <button
              onClick={openCreate}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                width: "100%",
                padding: "36px 0",
                borderRadius: 14,
                border: `2px dashed ${C.primaryBord}`,
                background: C.primaryTint,
                cursor: "pointer",
                fontFamily: C.font,
                transition: "all .15s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = C.primary;
                e.currentTarget.style.background = "#fdf9f7";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = C.primaryBord;
                e.currentTarget.style.background = C.primaryTint;
              }}
            >
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: "50%",
                  background: "rgba(218,119,86,0.18)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: 8,
                  color: C.primary,
                }}
              >
                <PlusIcon />
              </div>
              <span style={{ fontSize: 13, fontWeight: 900, color: C.primary }}>
                Add Key Processes
              </span>
            </button>
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3,1fr)",
                gap: 12,
              }}
            >
              {displayedSops.map((p) => (
                <div key={p.id} className="kp-process-card">
                  <div
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      justifyContent: "space-between",
                    }}
                  >
                    <span
                      style={{
                        fontSize: 13,
                        fontWeight: 700,
                        color: C.textMain,
                        lineHeight: 1.4,
                        fontFamily: C.font,
                        paddingRight: 8,
                      }}
                    >
                      {p.name}
                    </span>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                        flexShrink: 0,
                      }}
                    >
                      <StatusBadge status={p.status} />
                      <div
                        className="card-actions"
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 4,
                        }}
                      >
                        <BtnIcon onClick={() => openEdit(p)} title="Edit">
                          <EditIcon />
                        </BtnIcon>
                        <BtnIcon
                          onClick={() => requestDelete(p.id)}
                          title="Delete"
                          danger
                        >
                          <TrashIcon />
                        </BtnIcon>
                      </div>
                    </div>
                  </div>
                  {p.documentation_url && (
                    <a
                      href={p.documentation_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 4,
                        fontSize: 12,
                        fontWeight: 600,
                        color: C.primary,
                        textDecoration: "none",
                        width: "fit-content",
                        marginTop: 4,
                        fontFamily: C.font,
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.textDecoration = "underline")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.textDecoration = "none")
                      }
                    >
                      <FileIcon /> View Document &rarr;
                    </a>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ══ MODAL: Confirm Delete ══ */}
      {activeModal === "confirm_delete" && (
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
                Delete this SOP?
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
                onClick={executeDelete}
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

      {/* ══ MODAL: Create / Edit ══ */}
      {(activeModal === "create" || activeModal === "edit") && (
        <Modal onClose={closeModal}>
          <div className="kp-modal" style={{ maxWidth: 480 }}>
            {/* Header */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "20px 28px 16px",
                borderBottom: `1px solid ${C.primaryBord}`,
                background: C.cardBg,
                flexShrink: 0,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: "50%",
                    background: C.primary,
                    display: "inline-block",
                    flexShrink: 0,
                  }}
                />
                <h2
                  style={{
                    fontSize: 17,
                    fontWeight: 900,
                    color: C.textMain,
                    margin: 0,
                    fontFamily: C.font,
                  }}
                >
                  {activeModal === "edit" ? "Edit SOP" : "Create New SOP"}
                </h2>
              </div>
              <BtnIcon onClick={closeModal}>
                <CloseIcon />
              </BtnIcon>
            </div>

            {/* Body */}
            <div
              className="kp-modal-body"
              style={{
                padding: "20px 28px",
                display: "flex",
                flexDirection: "column",
                gap: 16,
              }}
            >
              {/* System Name */}
              <div>
                <label style={labelSt}>System Name {reqStar}</label>
                <input
                  type="text"
                  placeholder="e.g., Customer Onboarding Process"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="kp-input"
                  autoFocus
                  style={{
                    borderColor:
                      attempted && !form.name.trim() ? "#fca5a5" : undefined,
                  }}
                />
                {attempted && !form.name.trim() && (
                  <FieldHint msg="System name is required." />
                )}
              </div>

              {/* Description */}
              <div>
                <label style={labelSt}>Description</label>
                <textarea
                  placeholder="What does this system do?"
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                  className="kp-textarea"
                />
              </div>

              {/* Status + Priority */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 14,
                }}
              >
                <div>
                  <label style={labelSt}>Status {reqStar}</label>
                  <select
                    value={form.status}
                    onChange={(e) =>
                      setForm({ ...form, status: e.target.value })
                    }
                    className="kp-select"
                  >
                    {STATUSES.map((s) => (
                      <option key={s}>{s}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={labelSt}>Priority {reqStar}</label>
                  <select
                    value={form.priority}
                    onChange={(e) =>
                      setForm({ ...form, priority: e.target.value })
                    }
                    className="kp-select"
                    style={{
                      borderColor:
                        attempted && !form.priority ? "#fca5a5" : undefined,
                    }}
                  >
                    <option value="">Select priority</option>
                    {PRIORITIES.map((p) => (
                      <option key={p}>{p}</option>
                    ))}
                  </select>
                  {attempted && !form.priority && (
                    <FieldHint msg="Priority is required." />
                  )}
                </div>
              </div>

              {/* Health Score - Full Row */}
              <div>
                <label style={labelSt}>
                  Health Score ({form.health_score}%)
                </label>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    height: "38px",
                  }}
                >
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={form.health_score}
                    onChange={(e) =>
                      setForm({ ...form, health_score: e.target.value })
                    }
                    className="kp-slider"
                    style={{
                      flex: 1,
                      background: `linear-gradient(to right, ${C.primary} ${form.health_score}%, #e5e7eb ${form.health_score}%)`,
                    }}
                  />
                  <span
                    style={{
                      fontSize: 13,
                      fontWeight: 800,
                      color: C.textMain,
                      width: 36,
                      textAlign: "right",
                    }}
                  >
                    {form.health_score}%
                  </span>
                </div>
              </div>

              {/* Department + Assignee - Side by Side */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 14,
                }}
              >
                <div>
                  <label style={labelSt}>Department {reqStar}</label>
                  <div
                    style={{
                      border:
                        attempted && !form.department_id
                          ? "1px solid #fca5a5"
                          : undefined,
                      borderRadius: 12,
                    }}
                  >
                    <SearchableSelect
                      value={form.department_id}
                      onChange={(v: string) =>
                        setForm({ ...form, department_id: v })
                      }
                      options={departments}
                      loading={loadingDepts}
                      placeholder="Search department"
                    />
                  </div>
                  {attempted && !form.department_id && (
                    <FieldHint msg="Department is required." />
                  )}
                </div>
                <div>
                  <label style={labelSt}>Assignee</label>
                  <SearchableSelect
                    value={form.assignee_id}
                    onChange={(v: string) =>
                      setForm({ ...form, assignee_id: v })
                    }
                    options={users}
                    loading={loadingUsers}
                    placeholder="Search user"
                  />
                </div>
              </div>

              {/* Documentation URL */}
              <div>
                <label style={labelSt}>Documentation URL</label>
                <input
                  type="url"
                  placeholder="https://..."
                  value={form.documentation_url}
                  onChange={(e) =>
                    setForm({ ...form, documentation_url: e.target.value })
                  }
                  className="kp-input"
                />
              </div>
            </div>

            {/* Footer */}
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: 10,
                padding: "16px 28px",
                borderTop: `1px solid ${C.primaryBord}`,
                background: C.cardBg,
                flexShrink: 0,
                borderRadius: "0 0 20px 20px",
              }}
            >
              <button
                onClick={closeModal}
                style={{
                  padding: "10px 20px",
                  fontSize: 13,
                  fontWeight: 700,
                  color: C.textMain,
                  background: "#fff",
                  border: `1px solid ${C.primaryBord}`,
                  borderRadius: 12,
                  cursor: "pointer",
                  fontFamily: C.font,
                  transition: "background .15s",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = C.primaryBg)
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = "#fff")
                }
              >
                Cancel
              </button>
              <button
                onClick={activeModal === "edit" ? updateSop : createSop}
                disabled={isSaving}
                style={{
                  padding: "10px 22px",
                  fontSize: 13,
                  fontWeight: 900,
                  color: "#fff",
                  background: isSaving ? "#9ca3af" : "#1a1a1a",
                  border: "none",
                  borderRadius: 12,
                  cursor: isSaving ? "not-allowed" : "pointer",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                  transition: "background .15s",
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  fontFamily: C.font,
                }}
                onMouseEnter={(e) => {
                  if (!isSaving) e.currentTarget.style.background = "#000";
                }}
                onMouseLeave={(e) => {
                  if (!isSaving) e.currentTarget.style.background = "#1a1a1a";
                }}
              >
                {isSaving && <LoaderIcon />}
                {isSaving
                  ? "Saving..."
                  : activeModal === "edit"
                    ? "Save Changes"
                    : "Create SOP"}
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* ══ MODAL: Select Key Processes ══ */}
      {activeModal === "select" && (
        <Modal onClose={closeModal}>
          <div className="kp-modal" style={{ maxWidth: 660 }}>
            <div
              style={{
                flexShrink: 0,
                padding: "20px 28px 16px",
                background: C.cardBg,
                borderBottom: `1px solid ${C.primaryBord}`,
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  justifyContent: "space-between",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span
                    style={{
                      width: 10,
                      height: 10,
                      borderRadius: "50%",
                      background: C.primary,
                      display: "inline-block",
                      flexShrink: 0,
                    }}
                  />
                  <div>
                    <h2
                      style={{
                        fontSize: 17,
                        fontWeight: 900,
                        color: C.textMain,
                        margin: "0 0 2px",
                        fontFamily: C.font,
                      }}
                    >
                      Select Key Processes
                    </h2>
                    <p
                      style={{
                        fontSize: 12,
                        fontWeight: 600,
                        color: C.textMuted,
                        margin: 0,
                        fontFamily: C.font,
                      }}
                    >
                      3 to 6 recommended — choose your most critical SOPs
                    </p>
                  </div>
                </div>
                <BtnIcon onClick={closeModal}>
                  <CloseIcon />
                </BtnIcon>
              </div>
            </div>

            <div style={{ padding: "14px 28px 8px", flexShrink: 0 }}>
              <div style={{ position: "relative" }}>
                <span
                  style={{
                    position: "absolute",
                    left: 12,
                    top: "50%",
                    transform: "translateY(-50%)",
                  }}
                >
                  <SearchIcon />
                </span>
                <input
                  type="text"
                  placeholder="Search by name, owner, or status..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="kp-search"
                />
              </div>
            </div>

            <div style={{ padding: "0 28px 12px", flexShrink: 0 }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "10px 14px",
                  borderRadius: 10,
                  background: C.primaryTint,
                  border: `1px solid ${C.primaryBord}`,
                }}
              >
                <span
                  style={{
                    fontSize: 13,
                    fontWeight: 600,
                    color: C.textMuted,
                    fontFamily: C.font,
                  }}
                >
                  <span style={{ fontWeight: 800, color: C.textMain }}>
                    {selectedCount} selected
                  </span>
                  {" · "}
                  <span>{filteredSops.length} shown</span>
                </span>
                {isValidCount && (
                  <span
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 4,
                      fontSize: 12,
                      fontWeight: 800,
                      color: C.primary,
                      fontFamily: C.font,
                    }}
                  >
                    <svg
                      style={{ width: 13, height: 13 }}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={3}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    Valid count
                  </span>
                )}
              </div>
            </div>

            <div
              className="kp-modal-body"
              style={{
                padding: "0 28px 12px",
                display: "flex",
                flexDirection: "column",
                gap: 8,
              }}
            >
              {isFetching ? (
                [1, 2, 3].map((n) => (
                  <div key={n} className="kp-skeleton" style={{ height: 72 }} />
                ))
              ) : filteredSops.length === 0 ? (
                <p
                  style={{
                    textAlign: "center",
                    color: "#a3a3a3",
                    fontSize: 13,
                    padding: "24px 0",
                    fontFamily: C.font,
                  }}
                >
                  No SOPs found.
                </p>
              ) : (
                filteredSops.map((sop) => {
                  const isSel = selectIds.includes(sop.id);
                  return (
                    <div
                      key={sop.id}
                      className={`kp-list-item${isSel ? " selected-item" : ""}`}
                      onClick={() => toggleSelect(sop.id)}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "flex-start",
                          gap: 12,
                        }}
                      >
                        <div
                          className={`kp-checkbox-custom${isSel ? " checked" : ""}`}
                          style={{ marginTop: 2 }}
                        >
                          {isSel && (
                            <svg
                              style={{ width: 10, height: 10, color: "#fff" }}
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={3.5}
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                          )}
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "space-between",
                              gap: 8,
                            }}
                          >
                            <span
                              style={{
                                fontSize: 13,
                                fontWeight: 800,
                                color: C.textMain,
                                fontFamily: C.font,
                              }}
                            >
                              {sop.name}
                            </span>
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 6,
                                flexShrink: 0,
                              }}
                            >
                              {sop.status === "running" ? (
                                <RunningIcon />
                              ) : sop.status === "broken" ? (
                                <BrokenIcon />
                              ) : null}
                              <StatusBadge status={sop.status} />
                            </div>
                          </div>
                          {sop.description && (
                            <p
                              style={{
                                fontSize: 12,
                                color: C.textMuted,
                                margin: "3px 0 0",
                                fontFamily: C.font,
                                fontWeight: 500,
                              }}
                            >
                              {sop.description}
                            </p>
                          )}
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 12,
                              marginTop: 6,
                              flexWrap: "wrap",
                            }}
                          >
                            {sop.owner && (
                              <span
                                style={{
                                  fontSize: 11,
                                  fontWeight: 600,
                                  color: C.textMuted,
                                  fontFamily: C.font,
                                }}
                              >
                                Owner: {sop.owner}
                              </span>
                            )}
                            <span
                              style={{
                                fontSize: 11,
                                fontWeight: 600,
                                color: C.textMuted,
                                fontFamily: C.font,
                              }}
                            >
                              Health: {sop.health}%
                            </span>
                            {sop.priority && (
                              <span
                                style={{
                                  fontSize: 11,
                                  fontWeight: 600,
                                  color: C.textMuted,
                                  fontFamily: C.font,
                                }}
                              >
                                {sop.priority}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "14px 28px",
                borderTop: `1px solid ${C.primaryBord}`,
                background: C.cardBg,
                flexShrink: 0,
                borderRadius: "0 0 20px 20px",
              }}
            >
              <span
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  color: C.textMuted,
                  fontFamily: C.font,
                }}
              >
                <strong style={{ color: C.textMain, fontWeight: 800 }}>
                  {selectedCount}
                </strong>{" "}
                of {allSops.length} selected
                {isValidCount && (
                  <span
                    style={{ color: C.primary, fontWeight: 900, marginLeft: 4 }}
                  >
                    ✓
                  </span>
                )}
              </span>
              <div style={{ display: "flex", gap: 10 }}>
                {[
                  { label: "Reset", onClick: () => setSelectIds([]) },
                  { label: "Cancel", onClick: closeModal },
                ].map((btn) => (
                  <button
                    key={btn.label}
                    onClick={btn.onClick}
                    style={{
                      padding: "9px 18px",
                      fontSize: 13,
                      fontWeight: 700,
                      color: C.textMain,
                      background: "#fff",
                      border: `1px solid ${C.primaryBord}`,
                      borderRadius: 12,
                      cursor: "pointer",
                      fontFamily: C.font,
                      transition: "background .15s",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.background = C.primaryBg)
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.background = "#fff")
                    }
                  >
                    {btn.label}
                  </button>
                ))}
                <button
                  onClick={handleSaveSelection}
                  style={{
                    padding: "9px 20px",
                    fontSize: 13,
                    fontWeight: 900,
                    color: "#fff",
                    background: "#1a1a1a",
                    border: "none",
                    borderRadius: 12,
                    cursor: "pointer",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                    transition: "background .15s",
                    fontFamily: C.font,
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.background = "#000")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.background = "#1a1a1a")
                  }
                >
                  Save Selection
                </button>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
