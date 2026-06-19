import React, { useState, useEffect, useRef, useCallback } from "react";
import ReactDOM from "react-dom";
import { toast } from "sonner";

// ── Design tokens ──
const C = {
  primary: "#DA7756",
  primaryHov: "#c9674a",
  primaryBg: "#fef6f4",
  primaryTint: "rgba(218,119,86,0.10)",
  primaryBord: "rgba(218,119,86,0.20)",
  pageBg: "#ffffff",
  textMain: "#111827",
  textMuted: "#6b7280",
  borderLgt: "#e5e7eb",
  font: "'Poppins', sans-serif",
};

const getBaseUrl = () => {
  const raw = (localStorage.getItem("baseUrl") || "").replace(/\/$/, "");
  if (!raw) return "";
  return raw.startsWith("http://") || raw.startsWith("https://")
    ? raw
    : `https://${raw}`;
};

const BASE_URL = getBaseUrl();

const getAuthHeaders = (): Record<string, string> => {
  const token = localStorage.getItem("token") || "";
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: token } : {}),
  };
};

// ── Types ──
interface Kpi {
  id: number;
  name: string;
  description?: string;
  category?: string;
  unit?: string;
  frequency: string;
  target_value?: number | null;
  current_value?: number | null;
  department_id?: number | null;
  assignee_id?: number | null;
  department_name?: string | null;
  selected: boolean;
  owner?: string | null;
}

interface KpiFormState {
  name: string;
  unit: string;
  frequency: string;
  current_value: string;
  target_value: string;
  department_id: string;
  assign_to_id: string;
}

interface UserOption {
  id: number;
  name: string;
}

interface DeptOption {
  id: number;
  name: string;
}

const EMPTY_FORM: KpiFormState = {
  name: "",
  unit: "Select unit",
  frequency: "Monthly",
  current_value: "",
  target_value: "",
  department_id: "",
  assign_to_id: "",
};

const formatKpiNumber = (value: unknown) => {
  if (value === null || value === undefined || value === "") return "";
  const numericValue = Number(value);
  if (!Number.isFinite(numericValue)) return String(value);
  return Number.isInteger(numericValue)
    ? String(numericValue)
    : String(numericValue);
};

// ── API helpers ──
const getKpiDepartmentId = (k: any) =>
  k.department_id ??
  k.department?.id ??
  k.department?.department_id ??
  k.department_detail?.id ??
  null;

const getKpiDepartmentName = (k: any) =>
  k.department_name ??
  k.department?.name ??
  k.department?.title ??
  (typeof k.department === "string" ? k.department : null) ??
  null;

const getKpiAssignee = (k: any) => {
  const assignee =
    k.assignee ??
    (Array.isArray(k.assignees) ? k.assignees[0] : null) ??
    (Array.isArray(k.users) ? k.users[0] : null) ??
    (Array.isArray(k.assigned_users) ? k.assigned_users[0] : null);
  const assigneeId =
    k.assignee_id ??
    (Array.isArray(k.assignee_ids) ? k.assignee_ids[0] : null) ??
    assignee?.id ??
    assignee?.user_id ??
    null;
  const assigneeName =
    assignee?.full_name ||
    assignee?.name ||
    `${assignee?.first_name || assignee?.firstname || ""} ${assignee?.last_name || assignee?.lastname || ""
      }`.trim() ||
    k.owner ||
    null;

  return {
    id: assigneeId,
    name: assigneeName || null,
  };
};

const fetchKpisFromApi = async (): Promise<Kpi[]> => {
  const res = await fetch(`${BASE_URL}/kpis`, {
    method: "GET",
    headers: getAuthHeaders(),
  });
  const raw = await res.text();
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${raw.slice(0, 200)}`);
  let json: any;
  try {
    json = JSON.parse(raw);
  } catch {
    json = [];
  }
  const list: any[] = Array.isArray(json)
    ? json
    : Array.isArray(json.data)
      ? json.data
      : Array.isArray(json.data?.kpis)
        ? json.data.kpis
        : (json.kpis ?? []);
  return list.map((k: any) => {
    const assignee = getKpiAssignee(k);
    return {
      id: k.id,
      name: k.name ?? "",
      description: k.description ?? "",
      category: k.category ?? "",
      unit: k.unit ?? "",
      frequency: k.frequency ?? "monthly",
      target_value: k.target_value ?? null,
      current_value: k.current_value ?? null,
      department_id: getKpiDepartmentId(k),
      department_name: getKpiDepartmentName(k),
      assignee_id: assignee.id,
      owner: assignee.name ?? k.owner ?? null,
      selected: true,
    };
  });
};

const fetchUsersFromApi = async (): Promise<UserOption[]> => {
  const orgId =
    localStorage.getItem("org_id") ||
    localStorage.getItem("organization_id") ||
    "";
  const url = `${BASE_URL}/api/users${orgId ? `?organization_id=${orgId}` : ""}`;
  const res = await fetch(url, { method: "GET", headers: getAuthHeaders() });
  const raw = await res.text();
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${raw.slice(0, 200)}`);
  let json: any;
  try {
    json = JSON.parse(raw);
  } catch {
    json = [];
  }
  const list: any[] = Array.isArray(json)
    ? json
    : Array.isArray(json.users)
      ? json.users
      : Array.isArray(json.data?.users)
        ? json.data.users
        : Array.isArray(json.data)
          ? json.data
          : [];

  return list
    .filter((u: any) => u?.id)
    .map((u: any) => {
      const fName =
        u.full_name ||
        u.name ||
        `${u.first_name || u.firstname || ""} ${u.last_name || u.lastname || ""
          }`.trim();
      const displayName = fName || `User ${u.id}`;
      return {
        id: u.id,
        name: displayName.trim(),
      };
    });
};

const fetchDepartmentsFromApi = async (): Promise<DeptOption[]> => {
  const url = `${BASE_URL}/pms/departments.json`;
  const res = await fetch(url, { method: "GET", headers: getAuthHeaders() });
  const raw = await res.text();
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${raw.slice(0, 200)}`);
  let json: any;
  try {
    json = JSON.parse(raw);
  } catch {
    json = [];
  }
  const list: any[] = Array.isArray(json)
    ? json
    : Array.isArray(json.departments)
      ? json.departments
      : Array.isArray(json.data?.departments)
        ? json.data.departments
        : Array.isArray(json.data)
          ? json.data
          : [];

  return list
    .filter((d: any) => d?.id)
    .map((d: any) => ({
      id: d.id,
      name: d.name || d.title || d.department_name || d.label || `Dept ${d.id}`,
    }));
};

const createKpiInApi = async (
  form: KpiFormState,
  departments: DeptOption[]
): Promise<Kpi> => {
  const deptName = departments.find(
    (d) => String(d.id) === form.department_id
  )?.name;
  const payload = {
    kpi: {
      name: form.name.trim(),
      unit: form.unit !== "Select unit" ? form.unit : undefined,
      frequency: form.frequency.toLowerCase(),
      current_value: form.current_value.trim() !== ""
        ? parseFloat(form.current_value)
        : undefined,
      target_value: form.target_value.trim() !== ""
        ? parseFloat(form.target_value)
        : undefined,
      department: deptName || undefined,
      assignee_id: form.assign_to_id
        ? parseInt(form.assign_to_id, 10)
        : undefined,
    },
  };
  const res = await fetch(`${BASE_URL}/kpis`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });
  const raw = await res.text();
  if (!res.ok)
    throw new Error(`API error ${res.status}: ${raw || res.statusText}`);
  let json: any;
  try {
    json = JSON.parse(raw);
  } catch {
    json = {};
  }
  const k = json.data?.kpi ?? json.data ?? json.kpi ?? json;
  const assignee = getKpiAssignee(k);
  return {
    id: k.id,
    name: k.name ?? form.name,
    description: k.description ?? "",
    category: k.category ?? "",
    unit: k.unit ?? "",
    frequency: k.frequency ?? form.frequency.toLowerCase(),
    target_value: k.target_value ?? null,
    current_value: k.current_value ?? null,
    department_id: getKpiDepartmentId(k),
    department_name: getKpiDepartmentName(k),
    assignee_id: assignee.id,
    owner: assignee.name,
    selected: true,
  };
};

const updateKpiInApi = async (
  id: number,
  patch: Partial<{
    name: string;
    unit: string;
    current_value: number;
    target_value: number;
    frequency: string;
    department_id: number;
    assignee_ids: number[];
  }>
) => {
  const payload = { kpi: patch };
  const res = await fetch(`${BASE_URL}/kpis/${id}.json`, {
    method: "PATCH",
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });
  const raw = await res.text();
  if (!res.ok)
    throw new Error(`PATCH error ${res.status}: ${raw || res.statusText}`);
};

const deleteKpiFromApi = async (id: number) => {
  const res = await fetch(`${BASE_URL}/kpis/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
  if (!res.ok) {
    const t = await res.text();
    throw new Error(`DELETE error ${res.status}: ${t || res.statusText}`);
  }
};

// ── Theme Styles ──
const ThemeStyle = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800;900&display=swap');

    .cn-wrap * { font-family: 'Poppins', sans-serif !important; box-sizing: border-box; }
    .ac-heading { font-size: 18px; font-weight: 600; color: #111827; margin: 0; font-family: inherit; }

    @keyframes cn-spin { to { transform: rotate(360deg); } }
    @keyframes cn-pulse { 0%, 100% { opacity: 1; } 50% { opacity: .5; } }

    .cn-overlay {
      position: fixed; inset: 0; z-index: 99999;
      display: flex; align-items: center; justify-content: center; padding: 16px;
      background: rgba(0,0,0,0.5); backdrop-filter: blur(4px);
    }
    .cn-modal {
      background: #ffffff; border-radius: 16px;
      box-shadow: 0 20px 40px -10px rgba(0, 0, 0, 0.2);
      width: 100%; max-width: 500px; display: flex; flex-direction: column;
      max-height: 90vh; overflow: hidden; border: none;
    }
    .cn-modal-body { overflow-y: auto; flex: 1; }
    
    .cn-input, .cn-select {
      width: 100%; border: 1px solid #e5e7eb; border-radius: 8px;
      padding: 8px 12px; font-size: 13px; color: #111827; font-weight: 500;
      background: #fafafa; outline: none; font-family: inherit;
      transition: all 0.2s ease;
    }
    .cn-select {
      appearance: none; -webkit-appearance: none;
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23a3a3a3'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E");
      background-repeat: no-repeat; background-position: right 14px center;
      background-size: 16px; cursor: pointer; padding-right: 32px;
    }
    .cn-input:focus, .cn-select:focus { 
      background: #ffffff; border-color: ${C.primary}; 
      box-shadow: 0 0 0 3px ${C.primaryTint}; 
    }
    .cn-input::placeholder { color: #9ca3af; font-weight: 400; }
    .cn-input.error, .cn-select.error { border-color: #fca5a5 !important; box-shadow: 0 0 0 3px rgba(252,165,165,0.15) !important; background: #fff5f5; }
    
    .cn-label { display: block; font-size: 11px; font-weight: 700; color: #4b5563; margin-bottom: 6px; }
    .cn-field-error { font-size: 11px; color: #ef4444; font-weight: 600; margin-top: 4px; }

    .cn-user-dropdown {
      position: absolute; left: 0; right: 0; margin-top: 4px;
      background: #fff; border: 1px solid #e5e7eb; border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.10); max-height: 200px;
      overflow-y: auto; overflow-x: hidden; z-index: 99999;
    }
    .cn-user-option {
      padding: 8px 12px; font-size: 12px; cursor: pointer;
      border-bottom: 1px solid #f9fafb; color: #374151;
      display: flex; align-items: center; gap: 8px; font-weight: 500;
      transition: background 0.15s;
    }
    .cn-user-option:last-child { border-bottom: none; }
    .cn-user-option:hover { background: #fef6f4; color: ${C.primaryHov}; }
    .cn-user-option.clear { color: #ef4444; font-weight: 600; }
    .cn-user-option.clear:hover { background: #fef2f2; }
    .cn-user-avatar {
      width: 24px; height: 24px; border-radius: 50%;
      background: ${C.primaryTint}; color: ${C.primary};
      display: flex; align-items: center; justify-content: center;
      font-size: 9px; font-weight: 700; flex-shrink: 0;
    }

    .cn-error-banner { background: #fee2e2; border: 1px solid #fca5a5; color: #991b1b; border-radius: 8px; padding: 8px 12px; font-size: 12px; font-weight: 600; }
    .cn-kpi-card {
      background: #fff;
      border-radius: 12px;
      border: 1px dashed #d1d5db;
      padding: 16px;
      display: flex;
      flex-direction: column;
      height: 140px;
      box-sizing: border-box;
      transition: border-color .15s, box-shadow .15s, transform .15s;
    }
    .cn-kpi-card:hover {
      border-color: ${C.primary};
      box-shadow: 0 4px 12px rgba(218,119,86,0.10);
      transform: translateY(-1px);
    }
    @media (max-width: 640px) {
      .cn-section-header {
        flex-direction: column !important;
        align-items: stretch !important;
        gap: 10px !important;
        margin-bottom: 14px !important;
      }
      .cn-title-row {
        width: 100% !important;
        min-width: 0 !important;
        gap: 8px !important;
      }
      .cn-title-row .ac-heading {
        font-size: 14px !important;
        line-height: 1.15 !important;
      }
      .cn-actions {
        width: 100% !important;
        display: grid !important;
        grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
        gap: 8px !important;
      }
      .cn-actions button {
        width: 100% !important;
        min-height: 34px !important;
        justify-content: center !important;
        padding: 7px 8px !important;
        font-size: 10px !important;
        line-height: 1.15 !important;
        white-space: normal !important;
      }
      .cn-kpi-grid,
      .cn-select-grid {
        grid-template-columns: 1fr !important;
      }
      .cn-kpi-card {
        min-height: 126px !important;
        height: auto !important;
      }
      .cn-kpi-card:hover {
        transform: none !important;
      }
    }
    .cn-scroll::-webkit-scrollbar { width: 4px; }
    .cn-scroll::-webkit-scrollbar-track { background: transparent; }
    .cn-scroll::-webkit-scrollbar-thumb { background: #d1d5db; border-radius: 10px; }
    .cn-scroll::-webkit-scrollbar-thumb:hover { background: #9ca3af; }
  `}</style>
);

// ── Icons ──
const TrendIcon = () => (
  <svg style={{ width: 16, height: 16, color: C.primary }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
  </svg>
);
const InfoIcon = () => (
  <svg style={{ width: 14, height: 14, color: "#1a1a1a", opacity: 0.5 }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);
const EditIcon = () => (
  <svg style={{ width: 14, height: 14 }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
  </svg>
);
const PlusIcon = () => (
  <svg style={{ width: 14, height: 14 }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
  </svg>
);
const CloseIcon = () => (
  <svg style={{ width: 16, height: 16 }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
  </svg>
);
const TrashIcon = () => (
  <svg style={{ width: 14, height: 14 }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
  </svg>
);
const LoaderIcon = () => (
  <svg style={{ width: 14, height: 14, animation: "cn-spin 0.8s linear infinite" }} fill="none" viewBox="0 0 24 24">
    <circle style={{ opacity: 0.25 }} cx="12" cy="12" r="10" stroke="currentColor" strokeWidth={4} />
    <path style={{ opacity: 0.75 }} fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
  </svg>
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
    <div className="cn-overlay" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      {children}
    </div>,
    document.body
  );
};

const UNITS = ["Select unit", "%", "₹", "$", "Count", "Hours", "Days", "Score"];
const FREQUENCIES = ["Daily", "Weekly", "Monthly", "Quarterly", "Yearly"];

const FieldHint = ({ msg }: { msg: string }) => (
  <p className="cn-field-error">{msg}</p>
);

// ── Custom Searchable Select (Reusable for Users & Departments) ──
const SearchableSelect = ({ value, onChange, options, loading, placeholder, error }: any) => {
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

  const selectedName = options.find((o: any) => String(o.id) === String(value))?.name || placeholder;

  return (
    <div ref={ref} style={{ position: "relative", width: "100%" }}>
      <input
        type="text"
        className={`cn-input ${error ? 'error' : ''}`}
        placeholder={placeholder}
        value={isOpen ? search : selectedName}
        onClick={() => {
          if (!loading) { setIsOpen(true); setSearch(""); }
        }}
        onChange={(e) => {
          setSearch(e.target.value);
          setIsOpen(true);
        }}
        style={{ paddingRight: 32 }}
        autoComplete="off"
      />
      <div style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", pointerEvents: "none", color: "#9ca3af" }}>
        <svg style={{ width: 14, height: 14 }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
        </svg>
      </div>

      {isOpen && (
        <div className="cn-user-dropdown cn-scroll">
          <div
            onClick={() => {
              onChange("");
              setIsOpen(false);
              setSearch("");
            }}
            className="cn-user-option clear"
          >
            ✕ Clear selection
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
                className="cn-user-option"
                style={{
                  background: isSelected ? C.primaryTint : "transparent",
                  color: isSelected ? C.primary : C.textMain,
                  fontWeight: isSelected ? 700 : 500,
                }}
              >
                {o.name}
              </div>
            );
          })}
          {filteredOptions.length === 0 && (
            <div style={{ padding: "8px 12px", fontSize: 12, color: "#9ca3af", textAlign: "center", fontWeight: 500 }}>
              No match found
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// ══════════════════════════════════════════════════════════
export const CriticalNumbers = () => {
  const [kpis, setKpis] = useState<Kpi[]>([]);
  const [isFetching, setIsFetching] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [showSelectPanel, setShowSelectPanel] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingKpi, setEditingKpi] = useState<Kpi | null>(null);
  const [form, setForm] = useState<KpiFormState>(EMPTY_FORM);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [attempted, setAttempted] = useState(false);

  const [isInfoHovered, setIsInfoHovered] = useState(false);
  const [infoPos, setInfoPos] = useState({ top: 0, left: 0, transform: "translateX(-50%)" });
  const infoBtnRef = useRef<HTMLSpanElement>(null);

  const [users, setUsers] = useState<UserOption[]>([]);
  const [departments, setDepartments] = useState<DeptOption[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [loadingDepts, setLoadingDepts] = useState(false);

  const loadKpis = useCallback(async () => {
    setIsFetching(true);
    setFetchError(null);
    try {
      const data = await fetchKpisFromApi();
      setKpis(data);
    } catch (err: any) {
      setFetchError(err.message || "Failed to load KPIs.");
    } finally {
      setIsFetching(false);
    }
  }, []);

  const loadUsers = useCallback(async () => {
    setLoadingUsers(true);
    try {
      const data = await fetchUsersFromApi();
      setUsers(data);
    } catch (err: any) {
      console.error("Failed to load users:", err.message);
    } finally {
      setLoadingUsers(false);
    }
  }, []);

  const loadDepartments = useCallback(async () => {
    setLoadingDepts(true);
    try {
      const data = await fetchDepartmentsFromApi();
      setDepartments(data);
    } catch (err: any) {
      console.error("Failed to load departments:", err.message);
    } finally {
      setLoadingDepts(false);
    }
  }, []);

  useEffect(() => {
    loadKpis();
    loadUsers();
    loadDepartments();
  }, [loadKpis, loadUsers, loadDepartments]);

  const selectedCount = kpis.filter((k) => k.selected).length;
  const selectedKpis = kpis.filter((k) => k.selected);
  const toggleKpi = (id: number) => setKpis((prev) => prev.map((k) => (k.id === id ? { ...k, selected: !k.selected } : k)));

  const openCreate = () => {
    setForm(EMPTY_FORM);
    setEditingKpi(null);
    setSaveError(null);
    setAttempted(false);
    setShowCreateModal(true);
  };

  const openEdit = (kpi: Kpi) => {
    const departmentId = kpi.department_id != null ? String(kpi.department_id) : departments.find((dept) => dept.name.trim().toLowerCase() === String(kpi.department_name || "").trim().toLowerCase())?.id?.toString() || "";
    const assigneeId = kpi.assignee_id != null ? String(kpi.assignee_id) : users.find((user) => user.name.trim().toLowerCase() === String(kpi.owner || "").trim().toLowerCase())?.id?.toString() || "";

    if (departmentId && kpi.department_name) {
      setDepartments((prev) => prev.some((dept) => String(dept.id) === departmentId) ? prev : [...prev, { id: Number(departmentId), name: kpi.department_name || `Dept ${departmentId}` }]);
    }
    if (assigneeId && kpi.owner) {
      setUsers((prev) => prev.some((user) => String(user.id) === assigneeId) ? prev : [...prev, { id: Number(assigneeId), name: kpi.owner || `User ${assigneeId}` }]);
    }

    setForm({
      name: kpi.name,
      unit: kpi.unit ?? "Select unit",
      frequency: kpi.frequency ? kpi.frequency.charAt(0).toUpperCase() + kpi.frequency.slice(1) : "Monthly",
      current_value: kpi.current_value != null ? formatKpiNumber(kpi.current_value) : "",
      target_value: kpi.target_value != null ? formatKpiNumber(kpi.target_value) : "",
      department_id: departmentId,
      assign_to_id: assigneeId,
    });
    setEditingKpi(kpi);
    setSaveError(null);
    setAttempted(false);
    setShowCreateModal(true);
  };

  const closeModal = () => {
    setForm(EMPTY_FORM);
    setEditingKpi(null);
    setSaveError(null);
    setAttempted(false);
    setShowCreateModal(false);
  };

  const findName = (list: { id: number; name: string }[], idStr: string) => list.find((x) => String(x.id) === idStr)?.name ?? null;

  const validate = () => {
    if (!form.name.trim()) { toast.error("KPI Name is required."); return false; }
    if (!form.department_id) { toast.error("Please select a department."); return false; }
    if (!form.frequency) { toast.error("Frequency is required."); return false; }
    if (!form.assign_to_id) { toast.error("Assignee is required."); return false; }
    return true;
  };

  const handleCreate = async () => {
    setAttempted(true);
    if (!validate()) return;
    setIsSaving(true);
    setSaveError(null);
    try {
      const created = await createKpiInApi(form, departments);
      const ownerName = findName(users, form.assign_to_id);
      const departmentName = findName(departments, form.department_id);
      setKpis((prev) => [...prev, { ...created, department_id: form.department_id ? parseInt(form.department_id, 10) : created.department_id, department_name: departmentName ?? created.department_name, assignee_id: form.assign_to_id ? parseInt(form.assign_to_id, 10) : created.assignee_id, owner: ownerName ?? created.owner }]);
      closeModal();
      fetchKpisFromApi().then((data) => setKpis(data)).catch(() => { });
      toast.success("KPI created successfully!");
    } catch (err: any) {
      setSaveError(err.message || "Failed to create KPI.");
      toast.error(err.message || "Failed to create KPI.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleUpdate = async () => {
    setAttempted(true);
    if (!editingKpi) return;
    if (!validate()) return;
    setIsSaving(true);
    setSaveError(null);
    try {
      const patch: any = {
        name: form.name.trim(),
        current_value: form.current_value.trim() !== "" ? parseFloat(form.current_value) : undefined,
        target_value: form.target_value.trim() !== "" ? parseFloat(form.target_value) : undefined,
        frequency: form.frequency.toLowerCase(),
      };
      if (form.unit !== "Select unit") patch.unit = form.unit;
      if (form.department_id) patch.department_id = parseInt(form.department_id, 10);
      if (form.assign_to_id) patch.assignee_ids = [parseInt(form.assign_to_id, 10)];

      await updateKpiInApi(editingKpi.id, patch);

      const ownerName = findName(users, form.assign_to_id);
      const departmentName = findName(departments, form.department_id);
      setKpis((prev) => prev.map((k) => k.id === editingKpi.id ? { ...k, name: form.name, unit: form.unit !== "Select unit" ? form.unit : k.unit, frequency: form.frequency.toLowerCase(), current_value: form.current_value.trim() !== "" ? parseFloat(form.current_value) : k.current_value, target_value: form.target_value.trim() !== "" ? parseFloat(form.target_value) : k.target_value, department_id: form.department_id ? parseInt(form.department_id, 10) : k.department_id, department_name: departmentName ?? k.department_name, assignee_id: form.assign_to_id ? parseInt(form.assign_to_id, 10) : k.assignee_id, owner: ownerName ?? k.owner } : k));
      closeModal();
      fetchKpisFromApi().then((data) => setKpis(data)).catch(() => { });
      toast.success("KPI updated successfully!");
    } catch (err: any) {
      setSaveError(err.message || "Failed to update KPI.");
      toast.error(err.message || "Failed to update KPI.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    setDeletingId(id);
    try {
      await deleteKpiFromApi(id);
      setKpis((prev) => prev.filter((k) => k.id !== id));
      toast.success("KPI deleted successfully!");
    } catch (err: any) {
      setFetchError(err.message || "Failed to delete KPI.");
      toast.error(err.message || "Failed to delete KPI.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="cn-wrap" style={{ padding: "24px", background: "#ffffff", borderRadius: "16px", border: `1px solid ${C.borderLgt}`, boxShadow: "0 1px 3px rgba(0,0,0,0.05)", marginBottom: "24px" }}>
      <ThemeStyle />

      {/* ── Header ── */}
      <div className="cn-section-header" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
        <div className="cn-title-row" style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {/* Logo / Icon with exact light grey background */}
          <div style={{ width: 36, height: 36, borderRadius: 10, background: "#f3f4f6", display: "flex", alignItems: "center", justifyContent: "center", color: C.primary, flexShrink: 0 }}>
            <TrendIcon />
          </div>

          <h2 className="ac-heading" style={{ fontFamily: C.font }}>
            Critical Numbers (KPIs)
          </h2>

          <span
            ref={infoBtnRef}
            onMouseEnter={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              setInfoPos({ top: rect.bottom + window.scrollY + 10, left: rect.left + window.scrollX + rect.width / 2, transform: "translateX(-50%)" });
              setIsInfoHovered(true);
            }}
            onMouseLeave={() => setIsInfoHovered(false)}
            style={{ cursor: "help", display: "inline-flex", color: "#9ca3af" }}
          >
            <InfoIcon />
          </span>

          {isInfoHovered && ReactDOM.createPortal(
            <div style={{ position: "absolute", top: infoPos.top, left: infoPos.left, transform: infoPos.transform, zIndex: 99999, background: "#111827", color: "#fff", borderRadius: 10, boxShadow: "0 4px 20px rgba(0,0,0,0.15)", padding: "12px", width: 320, textAlign: "center", pointerEvents: "none" }}>
              <h4 style={{ margin: "0 0 6px 0", fontSize: 12, fontWeight: 700 }}>Critical Numbers - Your Dashboard</h4>
              <p style={{ margin: "0 0 6px 0", fontSize: 11, lineHeight: 1.4, color: "#d1d5db" }}>The 3-5 most important metrics that tell you if your business is healthy.</p>
              <p style={{ margin: "0", fontSize: 10, fontStyle: "italic", color: "#9ca3af" }}>"If you can't measure it, you can't improve it. Pick the vital few metrics, not the trivial many."</p>
            </div>,
            document.body
          )}
        </div>

        <div className="cn-actions" style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {isFetching && <LoaderIcon />}
          <button
            onClick={() => setShowSelectPanel((v) => !v)}
            style={{ padding: "8px 14px", fontSize: 12, fontWeight: 600, color: "#4b5563", background: "#f3f4f6", border: "none", borderRadius: 8, cursor: "pointer", transition: "all .15s" }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "#e5e7eb"; e.currentTarget.style.color = "#111827"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "#f3f4f6"; e.currentTarget.style.color = "#4b5563"; }}
          >
            Select KPIs
          </button>
          <button
            onClick={openCreate}
            style={{ padding: "8px 16px", background: C.primary, color: "#fff", border: "none", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer", boxShadow: "0 2px 4px rgba(218,119,86,0.2)", display: "flex", alignItems: "center", gap: 6, transition: "background .15s" }}
            onMouseEnter={(e) => e.currentTarget.style.background = C.primaryHov}
            onMouseLeave={(e) => e.currentTarget.style.background = C.primary}
          >
            <PlusIcon /> Create New
          </button>
        </div>
      </div>

      {/* ── Fetch error ── */}
      {fetchError && (
        <div className="cn-error-banner" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
          <span>⚠ {fetchError}</span>
          <button onClick={loadKpis} style={{ background: "none", border: "none", cursor: "pointer", color: "#991b1b", fontWeight: 700, textDecoration: "underline" }}>Retry</button>
        </div>
      )}

      {/* ── KPI Selection Panel ── */}
      {showSelectPanel && (
        <div style={{ background: "#f9fafb", border: `1px solid ${C.borderLgt}`, borderRadius: 12, padding: 16, marginBottom: 16 }}>
          <p style={{ fontSize: 12, fontWeight: 600, color: C.textMuted, marginBottom: 12 }}>Select KPIs to display as Critical Numbers (3–5 recommended):</p>
          {isFetching ? (
            <div className="cn-select-grid" style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 10, marginBottom: 16 }}>
              {[1, 2, 3, 4].map((n) => <div key={n} className="cn-skeleton" style={{ height: 48, borderRadius: 10 }} />)}
            </div>
          ) : kpis.length === 0 ? (
            <p style={{ fontSize: 12, color: "#9ca3af", fontStyle: "italic", marginBottom: 16 }}>No KPIs found. Create one above.</p>
          ) : (
            <div className="cn-select-grid" style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 10, marginBottom: 16 }}>
              {kpis.map((kpi) => (
                <label key={kpi.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", background: "#fff", borderRadius: 8, cursor: "pointer", border: `1px solid ${kpi.selected ? C.primary : C.borderLgt}`, transition: "all .15s", boxShadow: "0 1px 2px rgba(0,0,0,0.03)" }}>
                  <input type="checkbox" checked={kpi.selected} onChange={() => toggleKpi(kpi.id)} style={{ width: 16, height: 16, accentColor: C.primary, cursor: "pointer", flexShrink: 0 }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: 12, fontWeight: 600, color: C.textMain, margin: "0 0 2px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{kpi.name}</p>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
                      <span style={{ fontSize: 10, fontWeight: 500, color: C.textMuted, background: "#f3f4f6", padding: "2px 6px", borderRadius: 4 }}>{kpi.frequency}</span>
                    </div>
                  </div>
                </label>
              ))}
            </div>
          )}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 8, paddingTop: 12, borderTop: `1px solid ${C.borderLgt}` }}>
            <button onClick={() => setShowSelectPanel(false)} style={{ padding: "6px 14px", fontSize: 12, fontWeight: 600, color: "#4b5563", background: "#fff", border: "1px solid #d1d5db", borderRadius: 6, cursor: "pointer" }}>Close</button>
          </div>
        </div>
      )}

      {/* ── KPI Cards ── */}
      {!showSelectPanel && !isFetching && selectedKpis.length > 0 && (
        <div className="cn-kpi-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12 }}>
          {selectedKpis.map((kpi) => (
            <div key={kpi.id} className="cn-kpi-card">
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 8 }}>
                <p style={{ fontSize: 13, fontWeight: 600, color: "#111827", margin: 0, lineHeight: 1.3, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }} title={kpi.name}>{kpi.name}</p>
                <div style={{ display: "flex", gap: 2, flexShrink: 0 }}>
                  <button onClick={() => openEdit(kpi)} style={{ padding: "4px", borderRadius: 4, border: "none", background: "transparent", cursor: "pointer", color: "#9ca3af" }} onMouseEnter={(e) => { e.currentTarget.style.color = C.primary; }} onMouseLeave={(e) => { e.currentTarget.style.color = "#9ca3af"; }}><EditIcon /></button>
                  <button onClick={() => handleDelete(kpi.id)} disabled={deletingId === kpi.id} style={{ padding: "4px", borderRadius: 4, border: "none", background: "transparent", cursor: deletingId === kpi.id ? "not-allowed" : "pointer", color: "#9ca3af" }} onMouseEnter={(e) => { if (!deletingId) e.currentTarget.style.color = "#ef4444"; }} onMouseLeave={(e) => { if (!deletingId) e.currentTarget.style.color = "#9ca3af"; }}>{deletingId === kpi.id ? <LoaderIcon /> : <TrashIcon />}</button>
                </div>
              </div>

              <div style={{ flex: 1 }}>
                <p style={{ fontSize: 22, fontWeight: 800, color: "#9ca3af", margin: "0 0 2px", lineHeight: 1 }}>
                  {kpi.current_value != null ? formatKpiNumber(kpi.current_value) : "—"}
                  {kpi.unit && kpi.unit !== "Select unit" ? ` ${kpi.unit}` : ""}
                </p>
                {kpi.target_value != null && (
                  <p style={{ fontSize: 11, fontWeight: 500, color: "#6b7280", margin: 0 }}>
                    Target: {formatKpiNumber(kpi.target_value)} {kpi.unit && kpi.unit !== "Select unit" ? ` ${kpi.unit}` : ""}
                  </p>
                )}
              </div>

              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "auto", paddingTop: 10, borderTop: "1px solid #f3f4f6" }}>
                <span style={{ fontSize: 11, fontWeight: 500, color: "#6b7280", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{kpi.owner || "Unassigned"}</span>
                <span style={{ fontSize: 10, fontWeight: 600, color: C.primary, background: C.primaryTint, padding: "2px 8px", borderRadius: 6, textTransform: "capitalize" }}>{kpi.frequency}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Empty state ── */}
      {!showSelectPanel && !isFetching && selectedKpis.length === 0 && !fetchError && (
        <button
          onClick={openCreate}
          style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", width: "100%", padding: "32px 0", borderRadius: 12, border: `1px dashed #d1d5db`, background: "#fff", cursor: "pointer", transition: "all .15s" }}
          onMouseEnter={(e) => { e.currentTarget.style.borderColor = C.primary; e.currentTarget.style.background = "#fafafa"; }}
          onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#d1d5db"; e.currentTarget.style.background = "#fff"; }}
        >
          <div style={{ width: 36, height: 36, borderRadius: "50%", background: C.primaryTint, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 8, color: C.primary }}>
            <PlusIcon />
          </div>
          <span style={{ fontSize: 13, fontWeight: 600, color: "#111827" }}>Create First KPI</span>
        </button>
      )}

      {/* ══ Create / Edit Modal ══ */}
      {showCreateModal && (
        <Modal onClose={closeModal}>
          <div className="cn-modal">
            {/* Header */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 24px", background: "#fff", borderBottom: `1px solid #e5e7eb` }}>
              <h2 className="ac-heading" style={{ fontWeight: 700 }}>
                {editingKpi ? "Edit KPI" : "Create New KPI"}
              </h2>
              <button
                onClick={closeModal}
                style={{ width: 28, height: 28, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "50%", border: "none", background: "#f3f4f6", cursor: "pointer", color: "#6b7280", transition: "all 0.2s ease" }}
                onMouseEnter={(e) => { e.currentTarget.style.background = "#fee2e2"; e.currentTarget.style.color = "#ef4444"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "#f3f4f6"; e.currentTarget.style.color = "#6b7280"; }}
              >
                <CloseIcon />
              </button>
            </div>

            {/* Body */}
            <div className="cn-modal-body cn-scroll" style={{ padding: "16px 24px", display: "flex", flexDirection: "column", gap: 16, background: "#fff" }}>
              {saveError && <div className="cn-error-banner">{saveError}</div>}

              {/* KPI Name */}
              <div>
                <label className="cn-label">KPI Name <span style={{ color: "#ef4444" }}>*</span></label>
                <input
                  type="text"
                  placeholder="e.g., Revenue, Calls Made"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className={`cn-input ${attempted && !form.name.trim() ? "error" : ""}`}
                  autoFocus
                />
                {attempted && !form.name.trim() && <FieldHint msg="KPI Name is required." />}
              </div>

              {/* Unit + Values */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
                <div>
                  <label className="cn-label">Unit</label>
                  <select value={form.unit} onChange={(e) => setForm({ ...form, unit: e.target.value })} className="cn-select">
                    {UNITS.map((u) => <option key={u}>{u}</option>)}
                  </select>
                </div>
                <div>
                  <label className="cn-label">Current Value</label>
                  <input type="number" placeholder="e.g., 250" value={form.current_value} onChange={(e) => setForm({ ...form, current_value: e.target.value })} className="cn-input" />
                </div>
                <div>
                  <label className="cn-label">Target Value</label>
                  <input type="number" placeholder="e.g., 1000" value={form.target_value} onChange={(e) => setForm({ ...form, target_value: e.target.value })} className="cn-input" />
                </div>
              </div>

              {/* Department + Frequency */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div>
                  <label className="cn-label">Department <span style={{ color: "#ef4444" }}>*</span></label>
                  <SearchableSelect
                    value={form.department_id}
                    onChange={(v: string) => setForm({ ...form, department_id: v })}
                    options={departments}
                    loading={loadingDepts}
                    placeholder="Search department"
                    error={attempted && !form.department_id}
                  />
                  {attempted && !form.department_id && <FieldHint msg="Department is required." />}
                </div>
                <div>
                  <label className="cn-label">Frequency <span style={{ color: "#ef4444" }}>*</span></label>
                  <select value={form.frequency} onChange={(e) => setForm({ ...form, frequency: e.target.value })} className={`cn-select ${attempted && !form.frequency ? "error" : ""}`}>
                    {FREQUENCIES.map((f) => <option key={f}>{f}</option>)}
                  </select>
                  {attempted && !form.frequency && <FieldHint msg="Frequency is required." />}
                </div>
              </div>

              {/* Assign to User */}
              <div>
                <label className="cn-label">Assign to User <span style={{ color: "#ef4444" }}>*</span></label>
                <SearchableSelect
                  value={form.assign_to_id}
                  onChange={(v: string) => setForm({ ...form, assign_to_id: v })}
                  options={users}
                  loading={loadingUsers}
                  placeholder="Search & select user"
                  error={attempted && !form.assign_to_id}
                />
                {attempted && !form.assign_to_id && <FieldHint msg="Assignee is required." />}
              </div>
            </div>

            {/* Footer */}
            <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, padding: "16px 24px", borderTop: `1px solid #f3f4f6`, background: "#fff" }}>
              <button
                onClick={closeModal}
                style={{ padding: "8px 16px", fontSize: 13, fontWeight: 600, color: "#4b5563", background: "#f3f4f6", border: "none", borderRadius: 8, cursor: "pointer", transition: "0.2s" }}
                onMouseEnter={(e) => e.currentTarget.style.background = "#e5e7eb"}
                onMouseLeave={(e) => e.currentTarget.style.background = "#f3f4f6"}
              >
                Cancel
              </button>
              <button
                onClick={editingKpi ? handleUpdate : handleCreate} disabled={isSaving}
                style={{ padding: "8px 20px", fontSize: 13, fontWeight: 600, color: "#fff", background: !isSaving ? C.primary : "#e5b5a3", border: "none", borderRadius: 8, cursor: !isSaving ? "pointer" : "not-allowed", display: "flex", alignItems: "center", gap: 8, boxShadow: !isSaving ? "0 2px 6px rgba(218,119,86,0.2)" : "none", transition: "0.2s" }}
                onMouseEnter={(e) => { if (!isSaving) e.currentTarget.style.background = C.primaryHov; }}
                onMouseLeave={(e) => { if (!isSaving) e.currentTarget.style.background = C.primary; }}
              >
                {isSaving && <LoaderIcon />}
                {isSaving ? "Saving..." : editingKpi ? "Save Changes" : "Create KPI"}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
