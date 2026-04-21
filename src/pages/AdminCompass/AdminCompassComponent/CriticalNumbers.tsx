import React, { useState, useEffect, useCallback, useRef } from "react";
import ReactDOM from "react-dom";
import { toast } from "sonner";

// ── Design tokens — from BusinessPlanAndGoles ──
const C = {
  primary: "#DA7756",
  primaryHov: "#c9673f",
  primaryBg: "#fdf9f7",
  primaryTint: "rgba(218,119,86,0.06)",
  primaryBord: "#e8e3de",
  primaryBordStrong: "#d4cdc6",
  pageBg: "#f6f4ee",
  cardBg: "#ffffff",
  tealBg: "#9EC8BA",
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
  selected: boolean;
  owner?: string | null;
}

interface KpiFormState {
  name: string;
  unit: string;
  frequency: string;
  target_value: string;
  department_id: string; // id as string
  assign_to_id: string; // id as string
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
  target_value: "",
  department_id: "",
  assign_to_id: "",
};

// ── API helpers ──
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
  return list.map((k: any) => ({
    id: k.id,
    name: k.name ?? "",
    description: k.description ?? "",
    category: k.category ?? "",
    unit: k.unit ?? "",
    frequency: k.frequency ?? "monthly",
    target_value: k.target_value ?? null,
    current_value: k.current_value ?? null,
    department_id: k.department_id ?? null,
    assignee_id: k.assignee_id ?? null,
    owner: k.assignee?.name ?? k.owner ?? null,
    selected: true,
  }));
};

// ── Users API ──
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

  // Handle various response shapes
  const list: any[] = Array.isArray(json)
    ? json
    : Array.isArray(json.users)
      ? json.users
      : Array.isArray(json.data)
        ? json.data
        : [];

  return list
    .filter((u: any) => u?.id)
    .map((u: any) => {
      // Only showing name, removed email logic
      const fName =
        u.full_name ||
        u.name ||
        `${u.first_name || ""} ${u.last_name || ""}`.trim();
      let displayName = fName || `User ${u.id}`;
      return {
        id: u.id,
        name: displayName.trim(),
      };
    });
};

// ── Departments API ──
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
      : Array.isArray(json.data)
        ? json.data
        : [];

  return list
    .filter((d: any) => d?.id)
    .map((d: any) => ({
      id: d.id,
      // Robust fallbacks for department names
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
      target_value: form.target_value
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
  return {
    id: k.id,
    name: k.name ?? form.name,
    description: k.description ?? "",
    category: k.category ?? "",
    unit: k.unit ?? "",
    frequency: k.frequency ?? form.frequency.toLowerCase(),
    target_value: k.target_value ?? null,
    current_value: k.current_value ?? null,
    department_id: k.department_id ?? null,
    assignee_id: k.assignee_id ?? null,
    owner: k.assignee?.name ?? null,
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
    assignee_ids: number[]; // Changed to array
    weight?: number;
    related_link_url?: string;
    kpi_type?: string;
    priority?: string;
  }>
) => {
  const payload = { kpi: patch };
  // URL update kiya .json ke sath aur method PATCH kar diya
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

    .kpi-wrap * { font-family: 'Poppins', sans-serif !important; }

    @keyframes kpi-spin { to { transform: rotate(360deg); } }
    @keyframes kpi-pulse {
      0%, 100% { opacity: 1; }
      50%      { opacity: .5; }
    }

    .kpi-overlay {
      position: fixed; inset: 0; z-index: 99999;
      display: flex; align-items: center; justify-content: center; padding: 16px;
      background: rgba(0,0,0,0.40);
      backdrop-filter: blur(4px); -webkit-backdrop-filter: blur(4px);
    }
    .kpi-modal-box {
      background: #f6f4ee;
      border-radius: 20px;
      border: 1px solid rgba(218,119,86,0.20);
      box-shadow: 0 30px 80px rgba(0,0,0,0.20);
      width: 100%; max-width: 520px;
      display: flex; flex-direction: column;
      max-height: 90vh; overflow: hidden;
    }
    .kpi-input {
      width: 100%; border: 1px solid #e5e7eb; border-radius: 12px;
      padding: 9px 12px; font-size: 13px; font-weight: 600;
      color: #1a1a1a; background: #fffaf8;
      transition: border-color .15s, box-shadow .15s;
      box-sizing: border-box; outline: none;
      font-family: 'Poppins', sans-serif !important;
    }
    .kpi-input:focus {
      border-color: #DA7756;
      box-shadow: 0 0 0 3px rgba(218,119,86,0.15);
    }
    .kpi-input::placeholder { color: #a3a3a3; font-weight: 500; }
    
    .kpi-select {
      width: 100%; border: 1px solid #e5e7eb; border-radius: 12px;
      padding: 9px 36px 9px 12px; font-size: 13px; font-weight: 600;
      color: #1a1a1a; background: #fffaf8;
      appearance: none; -webkit-appearance: none;
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23a3a3a3'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E");
      background-repeat: no-repeat; background-position: right 10px center; background-size: 16px;
      cursor: pointer; outline: none; box-sizing: border-box;
      font-family: 'Poppins', sans-serif !important;
    }
    .kpi-select:focus {
      border-color: #DA7756;
      box-shadow: 0 0 0 3px rgba(218,119,86,0.15);
    }
    .kpi-select:disabled { opacity: 0.6; cursor: not-allowed; }
    .kpi-checkbox {
      width: 17px; height: 17px;
      accent-color: #DA7756; cursor: pointer; flex-shrink: 0;
    }
    .kpi-error {
      background: #fee2e2; border: 1px solid #fca5a5; color: #991b1b;
      border-radius: 12px; padding: 10px 14px; font-size: 13px; font-weight: 700;
      font-family: 'Poppins', sans-serif;
    }
    .kpi-card-lift { transition: box-shadow .2s, transform .2s; }
    .kpi-card-lift:hover {
      box-shadow: 0 8px 32px rgba(218,119,86,0.12) !important;
      transform: translateY(-1px);
    }
    .kpi-scroll::-webkit-scrollbar { width: 6px; }
    .kpi-scroll::-webkit-scrollbar-track { background: transparent; }
    .kpi-scroll::-webkit-scrollbar-thumb { background: #C4B89D; border-radius: 10px; }
    .kpi-scroll::-webkit-scrollbar-thumb:hover { background: #DA7756; }
  `}</style>
);

// ── Icons ──
const TrendIcon = () => (
  <svg
    style={{ width: 17, height: 17, color: "#1a1a1a" }}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2.5}
      d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
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
const EditIcon = () => (
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
    style={{ width: 14, height: 14 }}
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
const LoaderIcon = () => (
  <svg
    style={{
      width: 15,
      height: 15,
      animation: "kpi-spin 0.8s linear infinite",
    }}
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

// ── Shared icon button ──
const BtnIcon = ({ children, onClick, title = "", danger = false }: any) => (
  <button
    onClick={onClick}
    title={title}
    style={{
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      width: 30,
      height: 30,
      borderRadius: 10,
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
      className="kpi-overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {children}
    </div>,
    document.body
  );
};

const UNITS = ["Select unit", "%", "₹", "$", "Count", "Hours", "Days", "Score"];
const FREQUENCIES = ["Daily", "Weekly", "Monthly", "Quarterly", "Yearly"];

// ── Custom Searchable Select (Reusable for Users & Departments) ──
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

  // Searching using startsWith
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
        className="kpi-select"
        style={{
          cursor: loading ? "not-allowed" : "pointer",
          display: "flex",
          alignItems: "center",
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
          paddingRight: "36px", // keep space for the arrow
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
            className="kpi-input"
            style={{
              border: "none",
              borderBottom: `1px solid ${C.borderLgt}`,
              borderRadius: 0,
              padding: "10px 14px",
              background: "#fff",
              outline: "none",
            }}
          />
          <div className="kpi-scroll" style={{ overflowY: "auto", flex: 1 }}>
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

  // Info Tooltip State
  const [isInfoHovered, setIsInfoHovered] = useState(false);
  const [infoPos, setInfoPos] = useState({ top: 0, left: 0, transform: "translateX(-50%)" });
  const infoBtnRef = useRef<HTMLSpanElement>(null);

  // Users & Departments
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

  // Fetch users & departments once on mount
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
  const toggleKpi = (id: number) =>
    setKpis((prev) =>
      prev.map((k) => (k.id === id ? { ...k, selected: !k.selected } : k))
    );

  const openCreate = () => {
    setForm(EMPTY_FORM);
    setEditingKpi(null);
    setSaveError(null);
    setShowCreateModal(true);
  };

  const openEdit = (kpi: Kpi) => {
    setForm({
      name: kpi.name,
      unit: kpi.unit ?? "Select unit",
      frequency: kpi.frequency
        ? kpi.frequency.charAt(0).toUpperCase() + kpi.frequency.slice(1)
        : "Monthly",
      target_value: kpi.target_value != null ? String(kpi.target_value) : "",
      department_id: kpi.department_id != null ? String(kpi.department_id) : "",
      assign_to_id: kpi.assignee_id != null ? String(kpi.assignee_id) : "",
    });
    setEditingKpi(kpi);
    setSaveError(null);
    setShowCreateModal(true);
  };

  const closeModal = () => {
    setForm(EMPTY_FORM);
    setEditingKpi(null);
    setSaveError(null);
    setShowCreateModal(false);
  };

  // Helper — find name by id from a list
  const findName = (list: { id: number; name: string }[], idStr: string) =>
    list.find((x) => String(x.id) === idStr)?.name ?? null;

  const handleCreate = async () => {
    if (!form.name.trim()) {
      setSaveError("KPI Name is required.");
      toast.error("KPI Name is required.");
      return;
    }
    setIsSaving(true);
    setSaveError(null);
    try {
      const created = await createKpiInApi(form, departments);
      // Attach resolved names optimistically
      const ownerName = findName(users, form.assign_to_id);
      setKpis((prev) => [
        ...prev,
        { ...created, owner: ownerName ?? created.owner },
      ]);
      closeModal();
      fetchKpisFromApi()
        .then((data) => setKpis(data))
        .catch(() => {});
      toast.success("KPI created successfully!");
    } catch (err: any) {
      setSaveError(err.message || "Failed to create KPI.");
      toast.error(err.message || "Failed to create KPI.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleUpdate = async () => {
    if (!editingKpi) return;
    if (!form.name.trim()) {
      setSaveError("KPI Name is required.");
      toast.error("KPI Name is required.");
      return;
    }
    setIsSaving(true);
    setSaveError(null);
    try {
      // Naya payload structure
      const patch: any = {
        name: form.name.trim(),
        target_value: form.target_value
          ? parseFloat(form.target_value)
          : undefined,
        frequency: form.frequency.toLowerCase(),
      };

      if (form.unit !== "Select unit") patch.unit = form.unit;

      // Department ID pass kar rahe hain (pehle naam pass ho raha tha)
      if (form.department_id) {
        patch.department_id = parseInt(form.department_id, 10);
      }

      // Assignee ID ko array mein wrap kar ke bhej rahe hain
      if (form.assign_to_id) {
        patch.assignee_ids = [parseInt(form.assign_to_id, 10)];
      }

      await updateKpiInApi(editingKpi.id, patch);

      const ownerName = findName(users, form.assign_to_id);
      setKpis((prev) =>
        prev.map((k) =>
          k.id === editingKpi.id
            ? {
                ...k,
                name: form.name,
                unit: form.unit !== "Select unit" ? form.unit : k.unit,
                frequency: form.frequency.toLowerCase(),
                target_value: form.target_value
                  ? parseFloat(form.target_value)
                  : k.target_value,
                department_id: form.department_id
                  ? parseInt(form.department_id, 10)
                  : k.department_id,
                assignee_id: form.assign_to_id
                  ? parseInt(form.assign_to_id, 10)
                  : k.assignee_id,
                owner: ownerName ?? k.owner,
              }
            : k
        )
      );
      closeModal();
      fetchKpisFromApi()
        .then((data) => setKpis(data))
        .catch(() => {});
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

  const canSave = form.name.trim().length > 0;

  return (
    <div className="kpi-wrap" style={{ padding: "24px 0", fontFamily: C.font }}>
      <ThemeStyle />

      {/* ── Header ── */}
      <div
        style={{
          borderRadius: 8,
          padding: "18px 20px",
          background: C.tealBg,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 20,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              background: "rgba(255,255,255,0.30)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <TrendIcon />
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
            Critical Numbers (KPIs)
          </h1>
          <span 
            ref={infoBtnRef}
            onMouseEnter={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              setInfoPos({
                top: rect.bottom + window.scrollY + 10,
                left: rect.left + window.scrollX + rect.width / 2,
                transform: "translateX(-50%)"
              });
              setIsInfoHovered(true);
            }}
            onMouseLeave={() => setIsInfoHovered(false)}
            style={{ cursor: "help", display: "inline-flex" }}
          >
            <InfoIcon />
          </span>

          {isInfoHovered && ReactDOM.createPortal(
            <div 
              style={{
                position: "absolute",
                top: infoPos.top,
                left: infoPos.left,
                transform: infoPos.transform,
                zIndex: 99999,
                background: "#16102b", // Dark purple/blue tint
                color: "#fff",
                borderRadius: 12,
                boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
                padding: "16px",
                width: 380,
                textAlign: "center",
                fontFamily: "'Poppins', sans-serif",
                pointerEvents: "none",
                border: "1px solid rgba(218,119,86,0.2)"
              }}
            >
              <h4 style={{ margin: "0 0 10px 0", fontSize: 13, fontWeight: 800, color: "#fff" }}>
                Critical Numbers - Your Business Dashboard
              </h4>
              <p style={{ margin: "0 0 10px 0", fontSize: 12, lineHeight: 1.5, color: "#d1d5db" }}>
                The 3-5 most important metrics that tell you if your business is healthy. These are leading indicators - numbers that predict future success.
              </p>
              <p style={{ margin: "0 0 10px 0", fontSize: 12, lineHeight: 1.5, color: "#d1d5db" }}>
                Review these WEEKLY in your team meetings. Everyone should know these numbers by heart.
              </p>
              <p style={{ margin: "0 0 10px 0", fontSize: 11, fontStyle: "italic", color: "#9ca3af" }}>
                From Scaling Up: "If you can't measure it, you can't improve it. Pick the vital few metrics, not the trivial many."
              </p>
              <div style={{ fontSize: 11, color: "#9ca3af" }}>
                <div style={{ fontStyle: "italic", marginBottom: 2 }}>
                  Examples for Indian businesses:
                </div>
                <div style={{ fontStyle: "italic", marginBottom: 2 }}>
                  <strong style={{ color: "#d1d5db" }}>Manufacturing:</strong> Daily production units, defect rate, on-time delivery %
                </div>
                <div style={{ fontStyle: "italic" }}>
                  <strong style={{ color: "#d1d5db" }}>Services:</strong> Customer retention rate, average project margin, new client meetings/week
                </div>
              </div>
            </div>,
            document.body
          )}
          
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
            onClick={() => setShowSelectPanel((v) => !v)}
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
            <EditIcon /> Select KPIs
          </button>
        </div>
      </div>

      {/* ── Fetch error ── */}
      {fetchError && (
        <div
          className="kpi-error"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 16,
          }}
        >
          <span>⚠ {fetchError}</span>
          <button
            onClick={loadKpis}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "#991b1b",
              fontWeight: 700,
              textDecoration: "underline",
              fontFamily: C.font,
            }}
          >
            Retry
          </button>
        </div>
      )}

      {/* ── KPI Selection Panel ── */}
      {showSelectPanel && (
        <div
          style={{
            background: C.primaryBg,
            border: `1px solid ${C.primaryBord}`,
            borderRadius: 16,
            padding: 20,
            boxShadow: "0 2px 8px rgba(0,0,0,0.03)",
            marginBottom: 16,
          }}
        >
          <p
            style={{
              fontSize: 13,
              fontWeight: 600,
              color: C.textMuted,
              marginBottom: 16,
              fontFamily: C.font,
            }}
          >
            Select KPIs to display as Critical Numbers (3–5 recommended):
          </p>

          {isFetching ? (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(2,1fr)",
                gap: 12,
                marginBottom: 20,
              }}
            >
              {[1, 2, 3, 4].map((n) => (
                <div
                  key={n}
                  style={{
                    height: 64,
                    borderRadius: 14,
                    background: "#f3f4f6",
                    animation: "kpi-pulse 1.4s ease-in-out infinite",
                  }}
                />
              ))}
            </div>
          ) : kpis.length === 0 ? (
            <p
              style={{
                fontSize: 13,
                color: "#a3a3a3",
                fontStyle: "italic",
                marginBottom: 20,
                fontFamily: C.font,
              }}
            >
              No KPIs found. Create one above.
            </p>
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(2,1fr)",
                gap: 12,
                marginBottom: 20,
              }}
            >
              {kpis.map((kpi) => (
                <label
                  key={kpi.id}
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 12,
                    padding: "12px 14px",
                    background: C.cardBg,
                    borderRadius: 14,
                    cursor: "pointer",
                    border: `1.5px solid ${kpi.selected ? C.primary : C.borderLgt}`,
                    transition: "border-color .15s, box-shadow .15s",
                    boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
                  }}
                >
                  <input
                    type="checkbox"
                    checked={kpi.selected}
                    onChange={() => toggleKpi(kpi.id)}
                    className="kpi-checkbox"
                    style={{ marginTop: 2 }}
                  />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p
                      style={{
                        fontSize: 13,
                        fontWeight: 800,
                        color: C.textMain,
                        margin: "0 0 6px",
                        fontFamily: C.font,
                      }}
                    >
                      {kpi.name}
                    </p>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                        flexWrap: "wrap",
                      }}
                    >
                      <span
                        style={{
                          fontSize: 11,
                          fontWeight: 600,
                          color: C.textMuted,
                          background: C.primaryBg,
                          border: `1px solid ${C.primaryBord}`,
                          padding: "2px 8px",
                          borderRadius: 6,
                          fontFamily: C.font,
                        }}
                      >
                        {kpi.frequency}
                      </span>
                      {kpi.unit && (
                        <span
                          style={{
                            fontSize: 11,
                            fontWeight: 600,
                            color: C.textMuted,
                            background: C.primaryBg,
                            border: `1px solid ${C.primaryBord}`,
                            padding: "2px 8px",
                            borderRadius: 6,
                            fontFamily: C.font,
                          }}
                        >
                          {kpi.unit}
                        </span>
                      )}
                      {kpi.owner && (
                        <span
                          style={{
                            fontSize: 11,
                            fontWeight: 600,
                            color: C.textMuted,
                            background: C.primaryBg,
                            border: `1px solid ${C.primaryBord}`,
                            padding: "2px 8px",
                            borderRadius: 6,
                            fontFamily: C.font,
                          }}
                        >
                          {kpi.owner}
                        </span>
                      )}
                    </div>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 4,
                      flexShrink: 0,
                    }}
                  >
                    <BtnIcon
                      onClick={(e: any) => {
                        e.preventDefault();
                        openEdit(kpi);
                      }}
                      title="Edit"
                    >
                      <EditIcon />
                    </BtnIcon>
                    <BtnIcon
                      onClick={(e: any) => {
                        e.preventDefault();
                        handleDelete(kpi.id);
                      }}
                      title="Delete"
                      danger
                    >
                      {deletingId === kpi.id ? <LoaderIcon /> : <TrashIcon />}
                    </BtnIcon>
                  </div>
                </label>
              ))}
            </div>
          )}

          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              paddingTop: 16,
              borderTop: `1px solid ${C.primaryBord}`,
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
              Selected:{" "}
              <strong style={{ color: C.textMain, fontWeight: 800 }}>
                {selectedCount} KPIs
              </strong>
            </span>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <button
                onClick={() => setShowSelectPanel(false)}
                style={{
                  padding: "8px 18px",
                  fontSize: 13,
                  fontWeight: 700,
                  color: C.textMain,
                  background: "#fff",
                  border: `1px solid ${C.primaryBord}`,
                  borderRadius: 10,
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
                onClick={() => setShowSelectPanel(false)}
                style={{
                  padding: "8px 18px",
                  fontSize: 13,
                  fontWeight: 900,
                  color: "#fff",
                  background: "#1a1a1a",
                  border: "none",
                  borderRadius: 10,
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
      )}

      {/* ── KPI Cards ── */}
      {!showSelectPanel &&
        !isFetching &&
        kpis.filter((k) => k.selected).length > 0 && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3,1fr)",
              gap: 14,
            }}
          >
            {kpis
              .filter((k) => k.selected)
              .map((kpi) => (
                <div
                  key={kpi.id}
                  className="kpi-card-lift"
                  style={{
                    background: C.cardBg,
                    borderRadius: 16,
                    border: `1px solid ${C.borderLgt}`,
                    borderTop: `4px solid ${C.primary}`,
                    padding: "16px 18px",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                    position: "relative",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      justifyContent: "space-between",
                      marginBottom: 14,
                    }}
                  >
                    <p
                      style={{
                        fontSize: 13,
                        fontWeight: 800,
                        color: C.textMain,
                        margin: 0,
                        lineHeight: 1.4,
                        flex: 1,
                        paddingRight: 8,
                        fontFamily: C.font,
                      }}
                    >
                      {kpi.name}
                    </p>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 4,
                        opacity: 0,
                        transition: "opacity .15s",
                        flexShrink: 0,
                      }}
                      className="kpi-card-actions"
                    >
                      <BtnIcon onClick={() => openEdit(kpi)} title="Edit">
                        <EditIcon />
                      </BtnIcon>
                      <BtnIcon
                        onClick={() => handleDelete(kpi.id)}
                        title="Delete"
                        danger
                      >
                        {deletingId === kpi.id ? <LoaderIcon /> : <TrashIcon />}
                      </BtnIcon>
                    </div>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      alignItems: "flex-end",
                      justifyContent: "space-between",
                    }}
                  >
                    <div>
                      <p
                        style={{
                          fontSize: 26,
                          fontWeight: 900,
                          color: C.primary,
                          margin: "0 0 2px",
                          fontFamily: C.font,
                          lineHeight: 1,
                        }}
                      >
                        {kpi.current_value ?? "—"}
                        {kpi.unit && kpi.unit !== "Select unit"
                          ? ` ${kpi.unit}`
                          : ""}
                      </p>
                      {kpi.target_value != null && (
                        <p
                          style={{
                            fontSize: 11,
                            fontWeight: 600,
                            color: C.textMuted,
                            margin: 0,
                            fontFamily: C.font,
                          }}
                        >
                          Target: {kpi.target_value}
                          {kpi.unit && kpi.unit !== "Select unit"
                            ? ` ${kpi.unit}`
                            : ""}
                        </p>
                      )}
                    </div>
                    <span
                      style={{
                        fontSize: 11,
                        fontWeight: 700,
                        color: C.textMuted,
                        background: C.primaryBg,
                        border: `1px solid ${C.primaryBord}`,
                        padding: "4px 10px",
                        borderRadius: 8,
                        textTransform: "capitalize",
                        fontFamily: C.font,
                      }}
                    >
                      {kpi.frequency}
                    </span>
                  </div>

                  <style>{`.kpi-card-lift:hover .kpi-card-actions { opacity: 1 !important; }`}</style>
                </div>
              ))}
          </div>
        )}

      {/* ── Empty state ── */}
      {!showSelectPanel &&
        !isFetching &&
        kpis.filter((k) => k.selected).length === 0 &&
        !fetchError && (
          <button
            onClick={openCreate}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              width: "100%",
              padding: "40px 0",
              borderRadius: 16,
              border: `2px dashed ${C.primaryBord}`,
              background: C.primaryTint,
              cursor: "pointer",
              transition: "all .15s",
              fontFamily: C.font,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = C.primary;
              e.currentTarget.style.background = C.primaryBg;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = C.primaryBord;
              e.currentTarget.style.background = C.primaryTint;
            }}
          >
            <div
              style={{
                width: 40,
                height: 40,
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
            <span
              style={{
                fontSize: 13,
                fontWeight: 900,
                color: C.primary,
                fontFamily: C.font,
              }}
            >
              Create First KPI
            </span>
          </button>
        )}

      {/* ══ Create / Edit Modal ══ */}
      {showCreateModal && (
        <Modal onClose={closeModal}>
          <div className="kpi-modal-box">
            {/* Header */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
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
                  {editingKpi ? "Edit KPI" : "Create New KPI"}
                </h2>
              </div>
              <BtnIcon onClick={closeModal}>
                <CloseIcon />
              </BtnIcon>
            </div>

            {/* Body */}
            <div
              className="kpi-scroll"
              style={{
                padding: "20px 28px",
                overflowY: "auto",
                flex: 1,
                display: "flex",
                flexDirection: "column",
                gap: 16,
              }}
            >
              {saveError && <div className="kpi-error">{saveError}</div>}

              {/* KPI Name */}
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: 12,
                    fontWeight: 800,
                    color: C.textMain,
                    marginBottom: 6,
                    fontFamily: C.font,
                  }}
                >
                  KPI Name <span style={{ color: C.primary }}>*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g., Revenue, Calls Made"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="kpi-input"
                  autoFocus
                />
              </div>

              {/* Unit + Target */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 14,
                }}
              >
                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: 12,
                      fontWeight: 800,
                      color: C.textMain,
                      marginBottom: 6,
                      fontFamily: C.font,
                    }}
                  >
                    Unit
                  </label>
                  <select
                    value={form.unit}
                    onChange={(e) => setForm({ ...form, unit: e.target.value })}
                    className="kpi-select"
                  >
                    {UNITS.map((u) => (
                      <option key={u}>{u}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: 12,
                      fontWeight: 800,
                      color: C.textMain,
                      marginBottom: 6,
                      fontFamily: C.font,
                    }}
                  >
                    Target Value
                  </label>
                  <input
                    type="number"
                    placeholder="e.g., 1000"
                    value={form.target_value}
                    onChange={(e) =>
                      setForm({ ...form, target_value: e.target.value })
                    }
                    className="kpi-input"
                  />
                </div>
              </div>

              {/* Department + Frequency */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 14,
                }}
              >
                {/* Department (Using SearchableSelect) */}
                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: 12,
                      fontWeight: 800,
                      color: C.textMain,
                      marginBottom: 6,
                      fontFamily: C.font,
                    }}
                  >
                    Department
                  </label>
                  <SearchableSelect
                    value={form.department_id}
                    onChange={(v: string) =>
                      setForm({ ...form, department_id: v })
                    }
                    options={departments}
                    loading={loadingDepts}
                    placeholder="Search & select department"
                  />
                </div>
                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: 12,
                      fontWeight: 800,
                      color: C.textMain,
                      marginBottom: 6,
                      fontFamily: C.font,
                    }}
                  >
                    Frequency <span style={{ color: C.primary }}>*</span>
                  </label>
                  <select
                    value={form.frequency}
                    onChange={(e) =>
                      setForm({ ...form, frequency: e.target.value })
                    }
                    className="kpi-select"
                  >
                    {FREQUENCIES.map((f) => (
                      <option key={f}>{f}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Assign to User (Using SearchableSelect) */}
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: 12,
                    fontWeight: 800,
                    color: C.textMain,
                    marginBottom: 6,
                    fontFamily: C.font,
                  }}
                >
                  Assign to User
                </label>
                <SearchableSelect
                  value={form.assign_to_id}
                  onChange={(v: string) =>
                    setForm({ ...form, assign_to_id: v })
                  }
                  options={users}
                  loading={loadingUsers}
                  placeholder="Search & select user"
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
                onClick={editingKpi ? handleUpdate : handleCreate}
                disabled={!canSave || isSaving}
                style={{
                  padding: "10px 22px",
                  fontSize: 13,
                  fontWeight: 900,
                  color: "#fff",
                  background: canSave && !isSaving ? "#1a1a1a" : "#9ca3af",
                  border: "none",
                  borderRadius: 12,
                  cursor: canSave && !isSaving ? "pointer" : "not-allowed",
                  boxShadow: canSave ? "0 2px 8px rgba(0,0,0,0.15)" : "none",
                  transition: "background .15s",
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  fontFamily: C.font,
                }}
                onMouseEnter={(e) => {
                  if (canSave && !isSaving)
                    e.currentTarget.style.background = "#000";
                }}
                onMouseLeave={(e) => {
                  if (canSave && !isSaving)
                    e.currentTarget.style.background = "#1a1a1a";
                }}
              >
                {isSaving && <LoaderIcon />}
                {isSaving
                  ? "Saving..."
                  : editingKpi
                    ? "Save Changes"
                    : "Create KPI"}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
