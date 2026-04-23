import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import ReactDOM from "react-dom";
import {
  CheckCircle2,
  ChevronRight,
  Circle,
  Clock,
  Copy,
  FileText,
  Filter,
  Lightbulb,
  Pencil,
  Plus,
  RefreshCw,
  Save,
  Search,
  Sparkles,
  Trash2,
  User,
  X,
  XCircle,
  AlertTriangle,
} from "lucide-react";
import { toast } from "sonner";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  closestCorners,
  useDraggable,
  useDroppable,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

// ── Design Tokens (matches BusinessPlanAndGoles) ──
const C = {
  primary: "#DA7756",
  primaryHov: "#c9673f",
  primaryBg: "#fdf9f7",
  primaryTint: "rgba(218,119,86,0.06)",
  primaryBord: "#e8e3de",
  primaryBordStrong: "#d4cdc6",
  pageBg: "#f6f4ee",
  cardBg: "#ffffff",
  textMain: "#1a1a1a",
  textMuted: "#6b7280",
  borderLgt: "#ebebeb",
  font: "'Poppins', sans-serif",
};

// ─────────────────────────────────────────────
// THEME STYLES (matches BusinessPlanAndGoles)
// ─────────────────────────────────────────────
const ThemeStyle = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800;900&display=swap');
.sop-wrap * { font-family: 'Poppins', sans-serif !important; }
.sop-modal-box, .sop-modal-box * { font-family: 'Poppins', sans-serif !important; }    .sop-modal-portal {
      position: fixed; inset: 0; z-index: 99999;
      display: flex; align-items: center; justify-content: center;
      padding: 16px;
      background: rgba(0,0,0,0.40);
      backdrop-filter: blur(4px);
      -webkit-backdrop-filter: blur(4px);
    }
    .sop-modal-box {
      background: #f6f4ee;
      border-radius: 20px;
      border: 1px solid rgba(218,119,86,0.20);
      box-shadow: 0 30px 80px rgba(0,0,0,0.20);
      width: 100%; max-width: 580px;
      display: flex; flex-direction: column;
      max-height: 90vh; overflow: hidden;
    }
    .bp-input {
      width: 100%;
      border: 1px solid #e5e7eb;
      border-radius: 12px;
      padding: 9px 12px;
      font-size: 13px; font-weight: 600;
      color: #1a1a1a;
      background: #fffaf8;
      transition: border-color .15s, box-shadow .15s;
      outline: none;
      box-sizing: border-box;
      font-family: 'Poppins', sans-serif !important;
    }
    .bp-input:focus { border-color: #DA7756; box-shadow: 0 0 0 3px rgba(218,119,86,0.15); }
    .bp-input::placeholder { color: #a3a3a3; font-weight: 500; }
    .bp-select {
      width: 100%;
      border: 1px solid #e5e7eb;
      border-radius: 12px;
      padding: 9px 36px 9px 12px;
      font-size: 13px; font-weight: 600;
      color: #1a1a1a;
      background: #fffaf8;
      appearance: none; -webkit-appearance: none;
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23a3a3a3'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E");
      background-repeat: no-repeat;
      background-position: right 10px center;
      background-size: 16px;
      cursor: pointer; outline: none; box-sizing: border-box;
      font-family: 'Poppins', sans-serif !important;
    }
    .bp-select:focus { border-color: #DA7756; box-shadow: 0 0 0 3px rgba(218,119,86,0.15); }
    .bp-scroll::-webkit-scrollbar { width: 6px; }
    .bp-scroll::-webkit-scrollbar-track { background: transparent; }
    .bp-scroll::-webkit-scrollbar-thumb { background: #C4B89D; border-radius: 10px; }
    .bp-scroll::-webkit-scrollbar-thumb:hover { background: #DA7756; }
    .bh-slider-modal { -webkit-appearance:none; appearance:none; width:100%; height:6px; border-radius:99px; outline:none; cursor:pointer; display:block; }
    .bh-slider-modal::-webkit-slider-thumb { -webkit-appearance:none; width:18px; height:18px; border-radius:50%; background:#DA7756; border:2px solid #fff; box-shadow:0 1px 4px rgba(0,0,0,0.2); cursor:pointer; transition:transform .15s; }
    .bh-slider-modal::-webkit-slider-thumb:hover { transform:scale(1.2); }
    .bh-slider-modal::-moz-range-thumb { width:18px; height:18px; border-radius:50%; background:#DA7756; border:2px solid #fff; box-shadow:0 1px 4px rgba(0,0,0,0.2); cursor:pointer; }
    .bp-card-lift { transition: box-shadow .2s, transform .2s; }
    .bp-card-lift:hover { box-shadow: 0 8px 32px rgba(218,119,86,0.12); transform: translateY(-1px); }
    .sop-kanban-card {
      border-radius: 16px;
      border: 1px solid #ebebeb;
      background: #ffffff;
      padding: 16px;
      box-shadow: 0 1px 4px rgba(0,0,0,0.06);
      transition: box-shadow .2s, transform .2s;
    }
    .sop-kanban-card:hover { box-shadow: 0 6px 20px rgba(218,119,86,0.10); transform: translateY(-1px); }
    .sop-col-panel {
      border-radius: 20px;
      border: 1px solid #e8e3de;
      overflow: hidden;
    }
    .drag-over-col { border: 2px dashed #DA7756 !important; opacity: 0.6; }
  `}</style>
);

// ─────────────────────────────────────────────
// SHARED BUTTONS (matches BusinessPlanAndGoles)
// ─────────────────────────────────────────────
const BtnPrimary = ({
  children,
  onClick,
  disabled = false,
  className = "",
}: any) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`inline-flex items-center justify-center gap-2 px-5 py-2 rounded-xl text-sm font-bold text-white shadow-sm transition-all duration-150 active:scale-[0.97] disabled:opacity-60 ${className}`}
    style={{ background: C.primary, fontFamily: C.font }}
    onMouseEnter={(e) => {
      if (!disabled) e.currentTarget.style.background = C.primaryHov;
    }}
    onMouseLeave={(e) => (e.currentTarget.style.background = C.primary)}
  >
    {children}
  </button>
);

const BtnOutline = ({
  children,
  onClick,
  disabled = false,
  className = "",
}: any) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`inline-flex items-center justify-center gap-2 px-5 py-2 rounded-xl text-sm font-bold bg-white shadow-sm transition-all duration-150 active:scale-[0.97] border disabled:opacity-60 ${className}`}
    style={{ borderColor: C.primaryBord, color: C.primary, fontFamily: C.font }}
    onMouseEnter={(e) => {
      if (!disabled) {
        e.currentTarget.style.background = C.primaryBg;
        e.currentTarget.style.borderColor = C.primaryBordStrong;
      }
    }}
    onMouseLeave={(e) => {
      if (!disabled) {
        e.currentTarget.style.background = "#fff";
        e.currentTarget.style.borderColor = C.primaryBord;
      }
    }}
  >
    {children}
  </button>
);

const BtnIcon = ({ children, onClick, title = "" }: any) => (
  <button
    onClick={onClick}
    title={title}
    onMouseEnter={(e) => {
      e.currentTarget.style.background = C.primaryBg;
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.background = "#fff";
    }}
    className="inline-flex items-center justify-center w-9 h-9 rounded-xl bg-white shadow-sm transition-all duration-150 active:scale-[0.95] border"
    style={{ borderColor: C.primaryBord, color: C.textMuted }}
  >
    {children}
  </button>
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

// ─────────────────────────────────────────────
// API CONFIG
// ─────────────────────────────────────────────
const BASE_URL = () => localStorage.getItem("baseUrl") || "";
const getToken = () => localStorage.getItem("token") || "";

const getUserId = () => {
  try {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    return String(user?.id || "");
  } catch {
    return "";
  }
};

const apiHeaders = () => ({
  Accept: "application/json",
  "Content-Type": "application/json",
  Authorization: `Bearer ${getToken()}`,
});

const STATUS_TO_COL: Record<string, ColumnKey> = {
  "To Start": "toStart",
  to_start: "toStart",
  "to start": "toStart",
  Broken: "broken",
  broken: "broken",
  Running: "running",
  running: "running",
};

const COL_TO_STATUS: Record<ColumnKey, string> = {
  toStart: "To Start",
  broken: "Broken",
  running: "Running",
};

const PRIORITY_MAP: Record<string, SopCardData["priority"]> = {
  Low: "low",
  low: "low",
  Medium: "medium",
  medium: "medium",
  High: "high",
  high: "high",
};

const normalizeSopFromAPI = (raw: any): SopCardData => ({
  id: String(raw.id ?? Math.random()),
  title: raw.system_name ?? raw.title ?? "Untitled",
  department: raw.department ?? raw.department_name ?? raw.dept ?? "General",
  departmentId: raw.department_id ?? null,
  priority: PRIORITY_MAP[raw.priority] ?? "medium",
  healthPercent: coerceHealthPercent(
    raw.health_score ?? raw.healthPercent ?? 0
  ),
  description: raw.description ?? undefined,
  docUrl: raw.documentation_url ?? raw.doc_url ?? raw.docUrl ?? undefined,
  assigneeId: raw.assignee_id ?? raw.assigned_to_id ?? null,
  assigneeName: raw.assignee_name ?? raw.assigned_to ?? null,
  status: raw.status ?? "Broken",
  kpis: Array.isArray(raw.kpis) ? raw.kpis : [],
  createdById: raw.created_by_id ?? null,
  _raw: raw,
});

const fetchAllSops = async (): Promise<SopCardData[]> => {
  const res = await fetch(`https://${BASE_URL()}/system_sops`, {
    headers: apiHeaders(),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const json = await res.json();
  const arr = Array.isArray(json)
    ? json
    : (json.data ?? json.system_sops ?? []);
  return arr.map(normalizeSopFromAPI);
};

const fetchMySops = async (): Promise<SopCardData[]> => {
  const userId = getUserId();
  const res = await fetch(`https://${BASE_URL()}/system_sops`, {
    headers: apiHeaders(),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const json = await res.json();
  const arr = Array.isArray(json)
    ? json
    : (json.data ?? json.system_sops ?? []);
  return arr
    .filter((sop: any) => String(sop.assignee_id) === String(userId))
    .map(normalizeSopFromAPI);
};

const fetchUsersData = async (): Promise<
  { value: string; label: string }[]
> => {
  const orgId = localStorage.getItem("org_id") || "";
  if (!orgId) return [];
  try {
    const res = await fetch(
      `https://${BASE_URL()}/api/users?organization_id=${orgId}`,
      { headers: apiHeaders() }
    );
    if (!res.ok) throw new Error("Failed to fetch users");
    const json = await res.json();
    const arr = Array.isArray(json) ? json : (json.data ?? json.users ?? []);
    return arr.map((u: any) => ({
      value: String(u.id),
      label:
        u.name ||
        `${u.firstname || ""} ${u.lastname || ""}`.trim() ||
        u.email ||
        `User ${u.id}`,
    }));
  } catch (err) {
    console.error("Error fetching users:", err);
    return [];
  }
};

const fetchDepartmentsData = async (): Promise<
  { value: string; label: string; id: number }[]
> => {
  try {
    const res = await fetch(`https://${BASE_URL()}/pms/departments.json`, {
      headers: apiHeaders(),
    });
    if (!res.ok) throw new Error("Failed to fetch departments");
    const json = await res.json();
    const arr = Array.isArray(json)
      ? json
      : (json.data ?? json.departments ?? []);
    return arr.map((d: any) => ({
      value: String(d.name || d.id),
      label: d.name || d.department_name,
      id: d.id,
    }));
  } catch (err) {
    console.error("Error fetching departments:", err);
    return [];
  }
};

const createSop = async (payload: any) => {
  const res = await fetch(`https://${BASE_URL()}/system_sops`, {
    method: "POST",
    headers: apiHeaders(),
    body: JSON.stringify({ system_sop: payload }),
  });
  if (!res.ok) {
    const txt = await res.text().catch(() => "");
    throw new Error(`HTTP ${res.status}: ${txt}`);
  }
  const json = await res.json();
  return normalizeSopFromAPI(json.data ?? json.system_sop ?? json);
};

const updateSop = async (id: string, payload: any) => {
  const res = await fetch(`https://${BASE_URL()}/system_sops/${id}`, {
    method: "PUT",
    headers: apiHeaders(),
    body: JSON.stringify({ system_sop: payload }),
  });
  if (!res.ok) {
    const txt = await res.text().catch(() => "");
    throw new Error(`HTTP ${res.status}: ${txt}`);
  }
  const json = await res.json();
  return normalizeSopFromAPI(json.data ?? json.system_sop ?? json);
};

const patchSopStatus = async (id: string, status: string) => {
  const res = await fetch(`https://${BASE_URL()}/system_sops/${id}`, {
    method: "PATCH",
    headers: apiHeaders(),
    body: JSON.stringify({ system_sop: { status } }),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return true;
};

const deleteSop = async (id: string) => {
  const res = await fetch(`https://${BASE_URL()}/system_sops/${id}`, {
    method: "DELETE",
    headers: apiHeaders(),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return true;
};

// ─────────────────────────────────────────────
// TYPES & UTILS
// ─────────────────────────────────────────────
type SopTab = "my" | "all";
type ColumnKey = "toStart" | "broken" | "running";

type KpiItem = {
  kpi_id: number;
  kpi_name: string;
  kpi_category: string;
  kpi_frequency: string;
  position: number;
};

type SopCardData = {
  id: string;
  title: string;
  department: string;
  departmentId?: number | null;
  priority: "low" | "medium" | "high";
  healthPercent: number;
  description?: string;
  docUrl?: string;
  assigneeId?: number | null;
  assigneeName?: string | null;
  status?: string;
  kpis?: KpiItem[];
  createdById?: number | null;
  _raw?: any;
};

function coerceHealthPercent(n: unknown): number {
  const v = Number(n);
  if (!Number.isFinite(v)) return 0;
  return Math.max(0, Math.min(100, v));
}

function buildColumnsFromList(
  list: SopCardData[]
): Record<ColumnKey, SopCardData[]> {
  const cols: Record<ColumnKey, SopCardData[]> = {
    toStart: [],
    broken: [],
    running: [],
  };
  for (const item of list) {
    const col = STATUS_TO_COL[item.status ?? ""] ?? "broken";
    cols[col].push(item);
  }
  return cols;
}

function findColumnForCard(
  cols: Record<ColumnKey, SopCardData[]>,
  cardId: string
): ColumnKey | null {
  for (const k of Object.keys(cols) as ColumnKey[]) {
    if (cols[k].some((c) => c.id === cardId)) return k;
  }
  return null;
}

function parseCardId(id: string | number): string | null {
  const s = String(id);
  if (!s.startsWith("sop-card-")) return null;
  return s.slice("sop-card-".length);
}

// ─────────────────────────────────────────────
// LABEL FIELD WRAPPER
// ─────────────────────────────────────────────
const FieldBox = ({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) => (
  <div
    className="rounded-2xl border p-4 bg-white"
    style={{ borderColor: C.primaryBord }}
  >
    <label
      className="block text-[12px] font-black mb-2"
      style={{ color: C.textMain }}
    >
      {label} {required && <span style={{ color: C.primary }}>*</span>}
    </label>
    {children}
  </div>
);

// ─────────────────────────────────────────────
// MODAL (matches BusinessPlanAndGoles portal style)
// ─────────────────────────────────────────────
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
      className="sop-modal-portal"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {children}
    </div>,
    document.body
  );
};

// ─────────────────────────────────────────────
// SEARCHABLE SELECT (ported from BhagSection)
// ─────────────────────────────────────────────
const SearchableSelect = ({
  value,
  onChange,
  options,
  placeholder = "Search...",
}: {
  value: string;
  onChange: (val: string) => void;
  options: { value: string; label: string }[];
  placeholder?: string;
}) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);
    };
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, []);

  const selected = options.find((o) => o.value === value);
  const filtered = options.filter((o) =>
    o.label.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div ref={ref} style={{ position: "relative", zIndex: open ? 9999 : 1 }}>
      <div style={{ position: "relative" }}>
        <input
          type="text"
          className="bp-input"
          placeholder={placeholder}
          value={open ? search : (selected?.label ?? "")}
          onClick={() => {
            setOpen(true);
            setSearch("");
          }}
          onChange={(e) => {
            setSearch(e.target.value);
            setOpen(true);
          }}
          style={{ paddingRight: 36, cursor: "pointer" }}
          readOnly={!open}
        />
        <div
          style={{
            position: "absolute",
            right: 12,
            top: "50%",
            transform: "translateY(-50%)",
            color: "#9ca3af",
            pointerEvents: "none",
            transition: "transform .2s",
            ...(open ? { transform: "translateY(-50%) rotate(180deg)" } : {}),
          }}
        >
          <svg
            width="14"
            height="14"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </div>

      {open && (
        <div
          style={{
            position: "absolute",
            bottom: "calc(100% + 4px)",
            left: 0,
            right: 0,
            background: "#fff",
            border: `1px solid ${C.borderLgt}`,
            borderRadius: 12,
            boxShadow: "0 -8px 24px rgba(0,0,0,0.10)",
            maxHeight: 200,
            overflowY: "auto",
            zIndex: 9999,
            fontFamily: C.font,
          }}
        >
          {/* Clear option */}
          {value && (
            <div
              onClick={() => {
                onChange("");
                setOpen(false);
                setSearch("");
              }}
              style={{
                padding: "10px 12px",
                fontSize: 12,
                fontWeight: 700,
                color: "#ef4444",
                cursor: "pointer",
                borderBottom: `1px solid ${C.borderLgt}`,
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "#fef2f2")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = "transparent")
              }
            >
              ✕ Clear
            </div>
          )}
          {filtered.length === 0 ? (
            <div
              style={{
                padding: "12px",
                fontSize: 13,
                color: C.textMuted,
                textAlign: "center",
              }}
            >
              No results found
            </div>
          ) : (
            filtered.map((o) => (
              <div
                key={o.value}
                onClick={() => {
                  onChange(o.value);
                  setOpen(false);
                  setSearch("");
                }}
                style={{
                  padding: "10px 12px",
                  fontSize: 13,
                  fontWeight: 600,
                  color: o.value === value ? C.primary : C.textMain,
                  background: o.value === value ? C.primaryTint : "transparent",
                  cursor: "pointer",
                  borderBottom: `1px solid ${C.borderLgt}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
                onMouseEnter={(e) => {
                  if (o.value !== value)
                    e.currentTarget.style.background = "#f9fafb";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background =
                    o.value === value ? C.primaryTint : "transparent";
                }}
              >
                {o.label}
                {o.value === value && (
                  <svg
                    width="13"
                    height="13"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke={C.primary}
                    strokeWidth={2.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

// ─────────────────────────────────────────────
// SOP FORM DIALOG (restyled)
// ─────────────────────────────────────────────
function SopFormModal({
  open,
  onClose,
  isEdit,
  initialData,
  onSave,
  users,
  departments,
}: {
  open: boolean;
  onClose: () => void;
  isEdit: boolean;
  initialData?: SopCardData | null;
  onSave: (data: any, column: ColumnKey) => Promise<void>;
  users: { value: string; label: string }[];
  departments: { value: string; label: string; id: number }[];
}) {
  const [systemName, setSystemName] = useState("");
  const [description, setDescription] = useState("");
  const [department, setDepartment] = useState("");
  const [statusColumn, setStatusColumn] = useState<ColumnKey>("toStart");
  const [priority, setPriority] = useState<SopCardData["priority"]>("medium");
  const [assignUser, setAssignUser] = useState("");
  const [healthScore, setHealthScore] = useState(0);
  const [docUrl, setDocUrl] = useState("");
  const [kpiInvoice, setKpiInvoice] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (open) {
      if (isEdit && initialData) {
        setSystemName(initialData.title);
        setDescription(initialData.description ?? "");
        setDepartment(initialData.department);
        setStatusColumn(
          (STATUS_TO_COL[initialData.status ?? ""] ?? "broken") as ColumnKey
        );
        setPriority(initialData.priority);
        setAssignUser(String(initialData.assigneeId ?? ""));
        setHealthScore(initialData.healthPercent);
        setDocUrl(initialData.docUrl ?? "");
        setKpiInvoice((initialData.kpis ?? []).some((k) => k.kpi_id === 10));
      } else {
        setSystemName("");
        setDescription("");
        setDepartment("");
        setStatusColumn("toStart");
        setPriority("medium");
        setAssignUser("");
        setHealthScore(0);
        setDocUrl("");
        setKpiInvoice(false);
      }
    }
  }, [open, isEdit, initialData]);

  if (!open) return null;

  const handleSubmit = async () => {
    if (!systemName.trim()) return toast.error("Please enter a system name");
    if (!department) return toast.error("Please select a department");
    if (!assignUser) return toast.error("Please assign a user");
    setIsSaving(true);
    try {
      const selectedDept = departments.find((d) => d.value === department);
      const kpis = kpiInvoice
        ? [
            {
              kpi_id: 10,
              kpi_name: "Invoices Raised",
              kpi_category: "Accounts",
              kpi_frequency: "monthly",
              position: 1,
            },
          ]
        : [];
      const payload = {
        system_name: systemName.trim(),
        description: description.trim() || undefined,
        department_id: selectedDept ? selectedDept.id : 1,
        status: COL_TO_STATUS[statusColumn],
        priority: priority.charAt(0).toUpperCase() + priority.slice(1),
        assignee_id: parseInt(assignUser, 10),
        health_score: healthScore,
        documentation_url: docUrl.trim() || undefined,
        kpis: isEdit ? initialData?.kpis : kpis,
      };
      await onSave(payload, statusColumn);
    } finally {
      setIsSaving(false);
    }
  };

  const statusOptions = [
    {
      value: "toStart",
      label: "To Start",
      icon: <Clock className="w-4 h-4" style={{ color: "#0284c7" }} />,
    },
    {
      value: "broken",
      label: "Broken",
      icon: <XCircle className="w-4 h-4" style={{ color: "#dc2626" }} />,
    },
    {
      value: "running",
      label: "Running",
      icon: <CheckCircle2 className="w-4 h-4" style={{ color: "#16a34a" }} />,
    },
  ];

  const priorityOptions = [
    { value: "low", label: "Low", dot: "#0284c7" },
    { value: "medium", label: "Medium", dot: "#f59e0b" },
    { value: "high", label: "High", dot: "#dc2626" },
  ];

  return (
    <Modal onClose={onClose}>
      <div className="sop-modal-box">
        {/* Header */}
        <div
          className="flex justify-between items-center px-6 py-5 border-b"
          style={{ background: C.cardBg, borderColor: C.primaryBord }}
        >
          <div className="flex items-center gap-3">
            <span
              style={{
                width: 10,
                height: 10,
                borderRadius: "50%",
                background: C.primary,
                flexShrink: 0,
                display: "inline-block",
              }}
            />
            <h2
              className="font-black text-[17px] m-0"
              style={{ color: C.textMain }}
            >
              {isEdit ? "Edit System / SOP" : "Add New System / SOP"}
            </h2>
          </div>
          <BtnIcon onClick={onClose}>
            <X className="w-3.5 h-3.5" />
          </BtnIcon>
        </div>

        {/* Body */}
        <div className="p-6 flex-1 overflow-y-auto bp-scroll space-y-4">
          <FieldBox label="System Name" required>
            <input
              className="bp-input"
              value={systemName}
              onChange={(e) => setSystemName(e.target.value)}
              placeholder="e.g. Invoice Processing System"
            />
          </FieldBox>

          <FieldBox label="Description">
            <textarea
              className="bp-input resize-y"
              style={{ minHeight: 88 }}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe what this system does..."
            />
          </FieldBox>

          <div className="grid grid-cols-2 gap-4">
            <FieldBox label="Department" required>
              <SearchableSelect
                value={department}
                onChange={setDepartment}
                options={departments.map((d) => ({
                  value: d.value,
                  label: d.label,
                }))}
                placeholder="Search department..."
              />
            </FieldBox>
            <FieldBox label="Status" required>
              <select
                className="bp-select"
                value={statusColumn}
                onChange={(e) => setStatusColumn(e.target.value as ColumnKey)}
              >
                {statusOptions.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
            </FieldBox>
          </div>

          <FieldBox label="Priority">
            <div className="flex gap-2 mt-1">
              {priorityOptions.map((p) => (
                <button
                  key={p.value}
                  type="button"
                  onClick={() =>
                    setPriority(p.value as SopCardData["priority"])
                  }
                  className="flex-1 py-2 rounded-xl text-[12px] font-black border transition-all"
                  style={{
                    borderColor: priority === p.value ? C.primary : C.borderLgt,
                    background: priority === p.value ? C.primaryTint : "#fff",
                    color: priority === p.value ? C.primary : C.textMuted,
                    boxShadow:
                      priority === p.value
                        ? `0 0 0 2px ${C.primary}33`
                        : "none",
                  }}
                >
                  <span
                    className="inline-block w-2 h-2 rounded-full mr-1.5"
                    style={{ background: p.dot }}
                  />
                  {p.label}
                </button>
              ))}
            </div>
          </FieldBox>

          <FieldBox label="Assign to User" required>
            <SearchableSelect
              value={assignUser}
              onChange={setAssignUser}
              options={users}
              placeholder="Search user..."
            />
          </FieldBox>

          <FieldBox label={`Health Score — ${healthScore}%`}>
            <input
              type="range"
              min={0}
              max={100}
              step={1}
              value={healthScore}
              onChange={(e) =>
                setHealthScore(parseInt(e.target.value, 10) || 0)
              }
              className="bh-slider-modal w-full mt-1"
              style={{
                background: `linear-gradient(to right, ${C.primary} 0%, ${C.primary} ${healthScore}%, #e5e7eb ${healthScore}%, #e5e7eb 100%)`,
              }}
            />
          </FieldBox>

          <FieldBox label="Documentation URL">
            <input
              type="url"
              className="bp-input"
              value={docUrl}
              onChange={(e) => setDocUrl(e.target.value)}
              placeholder="https://..."
            />
          </FieldBox>

          {!isEdit && (
            <FieldBox label="Link KPIs">
              <div
                className="flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all"
                style={{
                  borderColor: kpiInvoice ? C.primary : C.borderLgt,
                  background: kpiInvoice ? C.primaryTint : "#fff",
                }}
                onClick={() => setKpiInvoice(!kpiInvoice)}
              >
                <input
                  type="checkbox"
                  checked={kpiInvoice}
                  onChange={(e) => setKpiInvoice(e.target.checked)}
                  className="w-4 h-4 accent-[#DA7756] cursor-pointer"
                />
                <span
                  className="text-[13px] font-black"
                  style={{ color: C.textMain }}
                >
                  Invoices Raised
                </span>
                <span
                  className="ml-auto px-2 py-0.5 rounded-md text-[11px] font-black"
                  style={{ background: "#f3f4f6", color: C.textMuted }}
                >
                  Invoices
                </span>
              </div>
            </FieldBox>
          )}
        </div>

        {/* Footer */}
        <div
          className="p-5 flex justify-end gap-3 border-t"
          style={{ background: C.cardBg, borderColor: C.primaryBord }}
        >
          <BtnOutline onClick={onClose} disabled={isSaving}>
            Cancel
          </BtnOutline>
          <button
            onClick={handleSubmit}
            disabled={isSaving}
            className="px-6 py-2 text-[13px] font-black text-white rounded-xl transition-colors shadow-sm active:scale-[0.97] flex items-center gap-2 disabled:opacity-60"
            style={{ background: "#1a1a1a", fontFamily: C.font }}
            onMouseEnter={(e) => {
              if (!isSaving) e.currentTarget.style.background = "#000";
            }}
            onMouseLeave={(e) => (e.currentTarget.style.background = "#1a1a1a")}
          >
            {isSaving && <LoaderIcon />}
            {isSaving ? "Saving..." : isEdit ? "Update SOP" : "Create SOP"}
          </button>
        </div>
      </div>
    </Modal>
  );
}

// ─────────────────────────────────────────────
// KANBAN CARD
// ─────────────────────────────────────────────
const PRIORITY_CHIP: Record<
  SopCardData["priority"],
  { bg: string; color: string }
> = {
  low: { bg: "#e0f2fe", color: "#0369a1" },
  medium: { bg: "#fff7ed", color: "#c2410c" },
  high: { bg: "#fee2e2", color: "#b91c1c" },
};

function SopKanbanCard({
  item,
  column,
  displayHealthPercent,
  dragHandleProps,
  onEditClick,
  onDuplicateClick,
  onDeleteClick,
}: {
  item: SopCardData;
  column: ColumnKey;
  displayHealthPercent: number;
  dragHandleProps?: React.HTMLAttributes<HTMLDivElement>;
  onEditClick?: () => void;
  onDuplicateClick?: () => void;
  onDeleteClick?: () => void;
}) {
  const health = coerceHealthPercent(displayHealthPercent);
  const barColor =
    column === "running"
      ? "#22c55e"
      : column === "toStart"
        ? "#38bdf8"
        : "#ef4444";
  const pChip = PRIORITY_CHIP[item.priority];

  const statusChip =
    column === "running"
      ? { label: "Running", bg: "#dcfce7", color: "#15803d" }
      : column === "toStart"
        ? { label: "To Start", bg: "#e0f2fe", color: "#0369a1" }
        : { label: "Broken", bg: "#fee2e2", color: "#b91c1c" };

  return (
    <div
      {...(dragHandleProps ?? {})}
      className={`sop-kanban-card bp-card-lift ${dragHandleProps ? "cursor-grab active:cursor-grabbing select-none touch-manipulation" : ""}`}
    >
      <p
        className="font-black text-[14px] leading-snug mb-3"
        style={{ color: C.textMain }}
      >
        {item.title}
      </p>

      <div className="flex flex-wrap gap-1.5 mb-3">
        <span
          className="px-2 py-0.5 rounded-lg text-[11px] font-black"
          style={{ background: "#f3f4f6", color: C.textMuted }}
        >
          {item.department}
        </span>
        <span
          className="px-2 py-0.5 rounded-lg text-[11px] font-black capitalize"
          style={{ background: pChip.bg, color: pChip.color }}
        >
          {item.priority}
        </span>
        {item.assigneeName && (
          <span
            className="px-2 py-0.5 rounded-lg text-[11px] font-black"
            style={{ background: "#ede9fe", color: "#7c3aed" }}
          >
            {item.assigneeName}
          </span>
        )}
      </div>

      <div className="space-y-1.5 mb-4">
        <div className="flex items-center justify-between">
          <span
            className="text-[11px] font-black"
            style={{ color: C.textMuted }}
          >
            Health
          </span>
          <span
            className="px-2 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-wide"
            style={{ background: statusChip.bg, color: statusChip.color }}
          >
            {statusChip.label}
          </span>
        </div>
        <div
          className="h-2 w-full rounded-full overflow-hidden"
          style={{ background: "#f3f4f6" }}
        >
          <div
            className="h-full rounded-full transition-all"
            style={{ width: `${health}%`, background: barColor }}
          />
        </div>
        <p
          className="text-right text-[11px] font-black tabular-nums"
          style={{ color: C.textMuted }}
        >
          {health}%
        </p>
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onPointerDown={(e) => e.stopPropagation()}
          onClick={(e) => {
            e.stopPropagation();
            onEditClick?.();
          }}
          className="flex-1 py-2 rounded-xl text-[12px] font-black text-white flex items-center justify-center gap-1.5 shadow-sm transition-all active:scale-[0.97]"
          style={{ background: C.primary }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.background = C.primaryHov)
          }
          onMouseLeave={(e) => (e.currentTarget.style.background = C.primary)}
        >
          <Pencil className="w-3.5 h-3.5" /> Edit
        </button>
        <button
          type="button"
          onPointerDown={(e) => e.stopPropagation()}
          onClick={(e) => {
            e.stopPropagation();
            onDuplicateClick?.();
          }}
          className="w-9 h-9 rounded-xl flex items-center justify-center border shadow-sm transition-all active:scale-[0.97] hover:bg-gray-50"
          style={{ borderColor: C.borderLgt, color: C.textMuted }}
        >
          <Copy className="w-3.5 h-3.5" />
        </button>
        <button
          type="button"
          onPointerDown={(e) => e.stopPropagation()}
          onClick={(e) => {
            e.stopPropagation();
            onDeleteClick?.();
          }}
          className="w-9 h-9 rounded-xl flex items-center justify-center border shadow-sm transition-all active:scale-[0.97] hover:bg-red-50"
          style={{ borderColor: "#fecaca", color: "#ef4444" }}
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}

function DraggableSopCard({
  item,
  column,
  displayHealthPercent,
  disabled,
  onEditClick,
  onDuplicateClick,
  onDeleteClick,
}: any) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: `sop-card-${item.id}`,
      disabled,
      data: { type: "SOP_CARD", item, column },
    });
  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Translate.toString(transform),
        opacity: isDragging ? 0.35 : 1,
      }}
    >
      <SopKanbanCard
        item={item}
        column={column}
        displayHealthPercent={displayHealthPercent}
        dragHandleProps={{ ...listeners, ...attributes }}
        onEditClick={onEditClick}
        onDuplicateClick={onDuplicateClick}
        onDeleteClick={onDeleteClick}
      />
    </div>
  );
}

function SopColumnBody({ colKey, children, emptySlot }: any) {
  const { setNodeRef, isOver } = useDroppable({
    id: `column-${colKey}`,
    data: { type: "SOP_COLUMN", column: colKey },
  });
  return (
    <div
      ref={setNodeRef}
      className={`flex min-h-[180px] flex-1 flex-col rounded-2xl border-2 border-dashed border-transparent p-1 transition-colors ${isOver ? "drag-over-col" : ""}`}
    >
      {children}
      {emptySlot}
    </div>
  );
}

const COLUMN_META = [
  {
    key: "toStart" as const,
    title: "To Start",
    icon: Clock,
    headerBg: "#e0f2fe",
    headerBorder: "#bae6fd",
    iconColor: "#0284c7",
    badgeBg: "#0284c7",
    panelBorder: "#bae6fd",
    panelBg: "#f0f9ff",
    emptyIconColor: "#7dd3fc",
  },
  {
    key: "broken" as const,
    title: "Broken",
    icon: XCircle,
    headerBg: "#fee2e2",
    headerBorder: "#fecaca",
    iconColor: "#dc2626",
    badgeBg: "#dc2626",
    panelBorder: "#fecaca",
    panelBg: "#fff5f5",
    emptyIconColor: "#fca5a5",
  },
  {
    key: "running" as const,
    title: "Running",
    icon: CheckCircle2,
    headerBg: "#dcfce7",
    headerBorder: "#bbf7d0",
    iconColor: "#16a34a",
    badgeBg: "#16a34a",
    panelBorder: "#bbf7d0",
    panelBg: "#f0fdf4",
    emptyIconColor: "#86efac",
  },
];

// ─────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────
const SystemAndSOP = () => {
  const [bannerVisible, setBannerVisible] = useState(true);
  const [sopTab, setSopTab] = useState<SopTab>("my");
  const [search, setSearch] = useState("");
  const [filterDept, setFilterDept] = useState("all");
  const [filterAssignee, setFilterAssignee] = useState("all");
  const [filterPriority, setFilterPriority] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");

  const [columns, setColumns] = useState<Record<ColumnKey, SopCardData[]>>({
    toStart: [],
    broken: [],
    running: [],
  });
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [activeDragId, setActiveDragId] = useState<string | null>(null);

  const [editOpen, setEditOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<{
    item: SopCardData;
    column: ColumnKey;
  } | null>(null);
  const [addOpen, setAddOpen] = useState(false);
  const [users, setUsers] = useState<{ value: string; label: string }[]>([]);
  const [departments, setDepartments] = useState<
    { value: string; label: string; id: number }[]
  >([]);

  useEffect(() => {
    fetchUsersData().then(setUsers);
    fetchDepartmentsData().then(setDepartments);
  }, []);

  const loadSops = useCallback(async () => {
    setIsLoading(true);
    setApiError(null);
    try {
      const list = sopTab === "my" ? await fetchMySops() : await fetchAllSops();
      setColumns(buildColumnsFromList(list));
    } catch (err: any) {
      setApiError(err.message);
      toast.error(`Failed to load SOPs: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  }, [sopTab]);

  useEffect(() => {
    loadSops();
  }, [loadSops]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
  );

  const applyFilters = useCallback(
    (items: SopCardData[]) => {
      const q = search.trim().toLowerCase();
      return items.filter((s) => {
        const matchesSearch =
          !q ||
          s.title.toLowerCase().includes(q) ||
          s.department.toLowerCase().includes(q) ||
          s.priority.toLowerCase().includes(q);
        const matchesDept = filterDept === "all" || s.department === filterDept;
        const matchesAssignee =
          filterAssignee === "all" || String(s.assigneeId) === filterAssignee;
        const matchesPriority =
          filterPriority === "all" || s.priority === filterPriority;
        const colKey = STATUS_TO_COL[s.status ?? ""] ?? "broken";
        const matchesStatus = filterStatus === "all" || colKey === filterStatus;
        return (
          matchesSearch &&
          matchesDept &&
          matchesAssignee &&
          matchesPriority &&
          matchesStatus
        );
      });
    },
    [search, filterDept, filterAssignee, filterPriority, filterStatus]
  );

  const displayedByCol = useMemo(
    () => ({
      toStart: applyFilters(columns.toStart),
      broken: applyFilters(columns.broken),
      running: applyFilters(columns.running),
    }),
    [columns, applyFilters]
  );

  const counts = useMemo(
    () => ({
      toStart: displayedByCol.toStart.length,
      broken: displayedByCol.broken.length,
      running: displayedByCol.running.length,
    }),
    [displayedByCol]
  );

  const activeFilters = useMemo(() => {
    const filters = [];
    if (filterDept !== "all")
      filters.push({
        id: "dept",
        label: `Dept: ${departments.find((d) => d.value === filterDept)?.label || filterDept}`,
        onClear: () => setFilterDept("all"),
      });
    if (filterAssignee !== "all")
      filters.push({
        id: "assignee",
        label: `Person: ${users.find((a) => a.value === filterAssignee)?.label || filterAssignee}`,
        onClear: () => setFilterAssignee("all"),
      });
    if (filterPriority !== "all")
      filters.push({
        id: "priority",
        label: `Priority: ${filterPriority.charAt(0).toUpperCase() + filterPriority.slice(1)}`,
        onClear: () => setFilterPriority("all"),
      });
    if (filterStatus !== "all")
      filters.push({
        id: "status",
        label: `Status: ${COL_TO_STATUS[filterStatus as ColumnKey] || filterStatus}`,
        onClear: () => setFilterStatus("all"),
      });
    return filters;
  }, [
    filterDept,
    filterAssignee,
    filterPriority,
    filterStatus,
    users,
    departments,
  ]);

  const handleDragStart = useCallback(
    (event: DragStartEvent) => setActiveDragId(parseCardId(event.active.id)),
    []
  );

  const handleDragEnd = useCallback(async (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveDragId(null);
    if (!over) return;
    const activeCardId = parseCardId(active.id);
    if (!activeCardId) return;
    setColumns((prev) => {
      const sourceCol = findColumnForCard(prev, activeCardId);
      if (!sourceCol) return prev;
      let targetCol: ColumnKey | null = null;
      let insertBeforeId: string | null = null;
      const overStr = String(over.id);
      if (overStr.startsWith("column-"))
        targetCol = overStr.replace("column-", "") as ColumnKey;
      else {
        const overCardId = parseCardId(over.id);
        if (overCardId && overCardId !== activeCardId) {
          targetCol = findColumnForCard(prev, overCardId);
          insertBeforeId = overCardId;
        }
      }
      if (!targetCol) return prev;
      const fromList = [...prev[sourceCol]];
      const fromIdx = fromList.findIndex((c) => c.id === activeCardId);
      if (fromIdx < 0) return prev;
      const [moved] = fromList.splice(fromIdx, 1);
      if (sourceCol !== targetCol)
        patchSopStatus(activeCardId, COL_TO_STATUS[targetCol])
          .then(() => toast.success(`Moved to ${COL_TO_STATUS[targetCol]}`))
          .catch((e) => toast.error(`Status update failed: ${e.message}`));
      if (sourceCol === targetCol) {
        const list = fromList;
        let idx = insertBeforeId
          ? list.findIndex((c) => c.id === insertBeforeId)
          : list.length;
        if (idx < 0) idx = list.length;
        list.splice(idx, 0, moved);
        return { ...prev, [sourceCol]: list };
      }
      const toList = [...prev[targetCol]];
      let idx = insertBeforeId
        ? toList.findIndex((c) => c.id === insertBeforeId)
        : toList.length;
      if (idx < 0) idx = toList.length;
      toList.splice(idx, 0, moved);
      return { ...prev, [sourceCol]: fromList, [targetCol]: toList };
    });
  }, []);

  const handleDragCancel = useCallback(() => setActiveDragId(null), []);

  const handleEditSave = async (payload: any, targetColumn: ColumnKey) => {
    try {
      const updated = await updateSop(editTarget!.item.id, payload);
      setColumns((prev) => {
        const cleaned = {
          toStart: prev.toStart.filter((c) => c.id !== updated.id),
          broken: prev.broken.filter((c) => c.id !== updated.id),
          running: prev.running.filter((c) => c.id !== updated.id),
        };
        return {
          ...cleaned,
          [targetColumn]: [...cleaned[targetColumn], updated],
        };
      });
      setEditOpen(false);
      setEditTarget(null);
      toast.success("SOP updated");
    } catch (e: any) {
      toast.error(e.message);
      throw e;
    }
  };

  const handleAddCreate = async (payload: any, targetColumn: ColumnKey) => {
    try {
      const created = await createSop(payload);
      setColumns((prev) => ({
        ...prev,
        [targetColumn]: [...prev[targetColumn], created],
      }));
      setAddOpen(false);
      toast.success("SOP created");
    } catch (e: any) {
      toast.error(e.message);
      throw e;
    }
  };

  const handleDuplicateCard = useCallback(
    (item: SopCardData, column: ColumnKey) => {
      const copy: SopCardData = {
        ...item,
        id: `sop-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
        title: `${item.title} (copy)`,
      };
      setColumns((prev) => {
        const list = [...prev[column]];
        const idx = list.findIndex((c) => c.id === item.id);
        const next = [...list];
        next.splice(idx < 0 ? next.length : idx + 1, 0, copy);
        return { ...prev, [column]: next };
      });
    },
    []
  );

  const handleDeleteCard = useCallback(async (itemId: string) => {
    if (!window.confirm("Delete this system/SOP?")) return;
    try {
      await deleteSop(itemId);
      setColumns((prev) => ({
        toStart: prev.toStart.filter((c) => c.id !== itemId),
        broken: prev.broken.filter((c) => c.id !== itemId),
        running: prev.running.filter((c) => c.id !== itemId),
      }));
      toast.success("SOP deleted");
    } catch (err: any) {
      toast.error(`Delete failed: ${err.message}`);
    }
  }, []);

  const activeItem = useMemo(() => {
    if (!activeDragId) return null;
    const col = findColumnForCard(columns, activeDragId);
    return col
      ? (columns[col].find((c) => c.id === activeDragId) ?? null)
      : null;
  }, [activeDragId, columns]);

  const activeColumn = activeDragId
    ? findColumnForCard(columns, activeDragId)
    : null;

  const Shimmer = ({ w = "100%", h = 16 }: { w?: string; h?: number }) => (
    <div
      className="animate-pulse rounded-xl"
      style={{ width: w, height: h, background: "#e5e1d8" }}
    />
  );

  return (
    <div
      className="sop-wrap min-h-screen p-4 md:p-8 w-full mx-auto space-y-6"
      style={{ background: C.pageBg, color: C.textMain, fontFamily: C.font }}
    >
      <ThemeStyle />

      {/* Modals */}
      <SopFormModal
        open={editOpen}
        onClose={() => {
          setEditOpen(false);
          setEditTarget(null);
        }}
        isEdit={true}
        initialData={editTarget?.item}
        onSave={handleEditSave}
        users={users}
        departments={departments}
      />
      <SopFormModal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        isEdit={false}
        onSave={handleAddCreate}
        users={users}
        departments={departments}
      />

      {/* ── Page Header ── */}
      <div
        className="overflow-hidden rounded-2xl border shadow-sm p-8 flex flex-col md:flex-row md:items-center justify-between gap-6"
        style={{
          background: "rgba(218,119,86,0.10)",
          borderColor: C.primaryBord,
        }}
      >
        <div>
          <p
            className="text-[10px] font-black uppercase tracking-[0.18em] mb-1"
            style={{ color: C.textMuted }}
          >
            Monitor your business systems health
          </p>
          <h1
            className="text-2xl font-black tracking-tight"
            style={{ color: "#111" }}
          >
            Systems &amp; SOPs
          </h1>
          <p
            className="text-sm font-semibold mt-1"
            style={{ color: C.textMuted }}
          >
            Standard Operating Procedures
          </p>
        </div>
        <div className="flex gap-3 shrink-0">
          <BtnIcon onClick={loadSops} title="Refresh">
            <RefreshCw
              className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`}
              style={{ color: C.primary }}
            />
          </BtnIcon>
          <BtnPrimary onClick={() => setAddOpen(true)}>
            <Plus className="w-4 h-4" /> Add System
          </BtnPrimary>
        </div>
      </div>

      {/* ── Tab Bar (matches BusinessPlanAndGoles) ── */}
      <div
        className="flex w-fit rounded-2xl p-1 gap-1 overflow-x-auto"
        style={{ background: C.primary }}
      >
        {(["my", "all"] as SopTab[]).map((t) => (
          <button
            key={t}
            onClick={() => setSopTab(t)}
            className="py-2 px-5 rounded-xl text-sm font-bold transition-all duration-150 whitespace-nowrap"
            style={{
              background: sopTab === t ? "#fff" : "transparent",
              color: sopTab === t ? C.primary : "rgba(255,255,255,0.85)",
              boxShadow: sopTab === t ? "0 1px 4px rgba(0,0,0,0.10)" : "none",
            }}
          >
            {t === "my" ? "My SOPs" : "All SOPs"}
          </button>
        ))}
      </div>

      {/* ── Banner ── */}
      {bannerVisible && (
        <div
          className="flex items-center gap-3 rounded-2xl border px-5 py-3 shadow-sm"
          style={{ background: C.primaryTint, borderColor: C.primaryBord }}
        >
          <div
            className="flex w-9 h-9 shrink-0 items-center justify-center rounded-xl"
            style={{ background: "rgba(218,119,86,0.14)" }}
          >
            <Lightbulb
              className="w-5 h-5"
              style={{ color: C.primary }}
              strokeWidth={2}
            />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[13px] font-black" style={{ color: C.textMain }}>
              Creating Systems &amp; SOPs
            </p>
            <p
              className="text-[11px] font-semibold"
              style={{ color: C.textMuted }}
            >
              Click to view tips for building effective SOPs
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-1">
            <button
              className="w-8 h-8 rounded-xl flex items-center justify-center transition-colors"
              style={{
                background: "rgba(218,119,86,0.12)",
                color: C.primary,
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "rgba(218,119,86,0.18)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = "rgba(218,119,86,0.12)")
              }
            >
              <ChevronRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => setBannerVisible(false)}
              className="w-8 h-8 rounded-xl flex items-center justify-center transition-colors"
              style={{
                background: "rgba(218,119,86,0.12)",
                color: C.primary,
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "rgba(218,119,86,0.18)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = "rgba(218,119,86,0.12)")
              }
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ── Filters ── */}
      <div
        className="rounded-2xl border p-4 shadow-sm space-y-3"
        style={{
          background: "rgba(218,119,86,0.06)",
          borderColor: C.primaryBord,
        }}
      >
        <p
          className="text-[10px] font-black uppercase tracking-[0.18em]"
          style={{ color: C.textMuted }}
        >
          Filters
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {[
            {
              label: "All Departments",
              value: filterDept,
              setter: setFilterDept,
              opts: [
                { value: "all", label: "All Departments" },
                ...departments.map((d) => ({ value: d.value, label: d.label })),
              ],
            },
            {
              label: "All People",
              value: filterAssignee,
              setter: setFilterAssignee,
              opts: [
                { value: "all", label: "All People" },
                ...users.map((u) => ({ value: u.value, label: u.label })),
              ],
            },
            {
              label: "All Priorities",
              value: filterPriority,
              setter: setFilterPriority,
              opts: [
                { value: "all", label: "All Priorities" },
                { value: "low", label: "Low" },
                { value: "medium", label: "Medium" },
                { value: "high", label: "High" },
              ],
            },
            {
              label: "All Status",
              value: filterStatus,
              setter: setFilterStatus,
              opts: [
                { value: "all", label: "All Status" },
                { value: "toStart", label: "To Start" },
                { value: "broken", label: "Broken" },
                { value: "running", label: "Running" },
              ],
            },
          ].map((f) => (
            <select
              key={f.label}
              className="bp-select"
              value={f.value}
              onChange={(e) => f.setter(e.target.value)}
            >
              {f.opts.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          ))}
        </div>
        <div className="relative">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
            style={{ color: C.textMuted }}
          />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search systems..."
            className="bp-input"
            style={{ paddingLeft: 38 }}
          />
        </div>

        {activeFilters.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <span
              className="text-[11px] font-black"
              style={{ color: C.textMuted }}
            >
              Active:
            </span>
            {activeFilters.map((f) => (
              <span
                key={f.id}
                className="inline-flex items-center gap-1 rounded-full pl-3 pr-1.5 py-1 text-[11px] font-black border"
                style={{
                  background: C.primaryTint,
                  color: C.primary,
                  borderColor: C.primaryBord,
                }}
              >
                {f.label}
                <button
                  onClick={f.onClear}
                  className="rounded-full p-0.5 transition-colors hover:bg-[rgba(218,119,86,0.20)]"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
            <button
              onClick={() => {
                setFilterDept("all");
                setFilterAssignee("all");
                setFilterPriority("all");
                setFilterStatus("all");
                setSearch("");
              }}
              className="text-[11px] font-black underline underline-offset-2 transition-colors"
              style={{ color: C.textMuted }}
              onMouseEnter={(e) => (e.currentTarget.style.color = C.primary)}
              onMouseLeave={(e) => (e.currentTarget.style.color = C.textMuted)}
            >
              Clear All
            </button>
          </div>
        )}
      </div>

      {/* ── Error ── */}
      {apiError && (
        <div
          className="flex items-center gap-3 rounded-2xl border px-4 py-3 text-sm shadow-sm"
          style={{
            borderColor: "#fecaca",
            background: "#fee2e2",
            color: "#991b1b",
          }}
        >
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span className="flex-1 font-semibold">
            Failed to load SOPs: {apiError}
          </span>
          <button
            onClick={loadSops}
            className="inline-flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-[12px] font-black"
            style={{
              borderColor: "#fecaca",
              background: "#fff",
              color: "#991b1b",
            }}
          >
            <RefreshCw className="w-3.5 h-3.5" /> Retry
          </button>
        </div>
      )}

      {/* ── Kanban Grid ── */}
      {isLoading ? (
        <div className="grid gap-4 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="rounded-2xl border p-5 space-y-3 animate-pulse"
              style={{ borderColor: C.primaryBord, background: C.cardBg }}
            >
              <Shimmer w="50%" h={18} />
              {[1, 2, 3].map((j) => (
                <Shimmer key={j} h={100} />
              ))}
            </div>
          ))}
        </div>
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          onDragCancel={handleDragCancel}
        >
          <div className="grid gap-4 lg:grid-cols-3">
            {COLUMN_META.map((col) => {
              const Icon = col.icon;
              const list = displayedByCol[col.key];
              return (
                <div
                  key={col.key}
                  className="sop-col-panel flex flex-col"
                  style={{
                    background: col.panelBg,
                    borderColor: col.panelBorder,
                    border: `1px solid ${col.panelBorder}`,
                  }}
                >
                  {/* Column Header */}
                  <div
                    className="flex items-center gap-2 px-4 py-3 border-b"
                    style={{
                      background: col.headerBg,
                      borderColor: col.headerBorder,
                    }}
                  >
                    <Icon
                      className="w-5 h-5 shrink-0"
                      style={{ color: col.iconColor }}
                    />
                    <span
                      className="flex-1 font-black text-[13px]"
                      style={{ color: C.textMain }}
                    >
                      {col.title}
                    </span>
                    <span
                      className="rounded-full px-2.5 py-0.5 text-[11px] font-black text-white tabular-nums"
                      style={{ background: col.badgeBg }}
                    >
                      {counts[col.key]}
                    </span>
                  </div>

                  {/* Column Body */}
                  <div className="flex flex-1 flex-col p-3">
                    <SopColumnBody
                      colKey={col.key}
                      emptySlot={
                        list.length === 0 ? (
                          <div className="pointer-events-none flex flex-1 flex-col items-center justify-center py-8">
                            <div
                              className="w-full flex flex-col items-center justify-center rounded-2xl border-2 border-dashed py-10"
                              style={{ borderColor: col.headerBorder }}
                            >
                              <Icon
                                className="w-10 h-10 mb-2"
                                style={{
                                  color: col.emptyIconColor,
                                  strokeWidth: 1.25,
                                }}
                              />
                              <p
                                className="text-[13px] font-black"
                                style={{ color: C.textMuted }}
                              >
                                No systems here
                              </p>
                            </div>
                          </div>
                        ) : null
                      }
                    >
                      {list.length > 0 && (
                        <div className="flex flex-col gap-3">
                          {list.map((item) => (
                            <DraggableSopCard
                              key={item.id}
                              item={item}
                              column={col.key}
                              displayHealthPercent={item.healthPercent}
                              disabled={false}
                              onEditClick={() => {
                                setEditTarget({ item, column: col.key });
                                setEditOpen(true);
                              }}
                              onDuplicateClick={() =>
                                handleDuplicateCard(item, col.key)
                              }
                              onDeleteClick={() => handleDeleteCard(item.id)}
                            />
                          ))}
                        </div>
                      )}
                    </SopColumnBody>
                  </div>
                </div>
              );
            })}
          </div>

          <DragOverlay dropAnimation={null}>
            {activeItem && activeColumn ? (
              <div
                className="w-[min(100vw-2rem,320px)] cursor-grabbing opacity-95"
                style={{ filter: "drop-shadow(0 20px 40px rgba(0,0,0,0.20))" }}
              >
                <SopKanbanCard
                  item={activeItem}
                  column={activeColumn}
                  displayHealthPercent={activeItem.healthPercent}
                />
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
      )}

      {/* ── All empty state ── */}
      {!isLoading &&
        !apiError &&
        counts.toStart === 0 &&
        counts.broken === 0 &&
        counts.running === 0 && (
          <div
            className="rounded-2xl border py-16 flex flex-col items-center justify-center text-center px-4 shadow-sm"
            style={{
              background: "rgba(218,119,86,0.06)",
              borderColor: C.primaryBord,
            }}
          >
            <FileText
              className="w-14 h-14 mb-4"
              style={{ color: C.primary, opacity: 0.35, strokeWidth: 1.25 }}
            />
            <p className="text-[17px] font-black" style={{ color: C.textMain }}>
              No systems found
            </p>
            <p
              className="mt-2 text-[13px] font-semibold max-w-md"
              style={{ color: C.textMuted }}
            >
              Add your first system/SOP or clear active filters
            </p>
            <div className="mt-5">
              <BtnPrimary onClick={() => setAddOpen(true)}>
                <Plus className="w-4 h-4" /> Add First System
              </BtnPrimary>
            </div>
          </div>
        )}
    </div>
  );
};

export default SystemAndSOP;
