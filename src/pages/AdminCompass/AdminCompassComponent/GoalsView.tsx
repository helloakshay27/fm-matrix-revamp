import React, { useState, useEffect, useRef, useCallback } from "react";
import ReactDOM from "react-dom";

// ── Design tokens ──
const C = {
  primary: "#DA7756",
  primaryHov: "#c9674a",
  primaryBg: "#fef6f4",
  primaryTint: "rgba(218,119,86,0.10)",
  primaryBord: "rgba(218,119,86,0.20)",
  pageBg: "#f6f4ee",
};

// ── Base URL + Auth ──
const BASE_URL = (() => {
  const raw = (localStorage.getItem("baseUrl") || "").replace(/\/$/, "");
  if (!raw) return "";
  return raw.startsWith("http://") || raw.startsWith("https://")
    ? raw
    : `https://${raw}`;
})();

const getAuthHeaders = (): Record<string, string> => {
  const token = localStorage.getItem("token") || "";
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: token } : {}),
  };
};

// ── Types ──
interface Goal {
  id: number;
  title: string;
  description?: string;
  period: string;
  owner: string;
  owner_id?: number | null;
  dueDate: string;
  target_date?: string;
  current: number;
  target: number;
  unit: string;
  status: string;
  update_remarks?: string;
}

interface GoalFormState {
  title: string;
  description: string;
  period: string;
  owner: string;
  owner_id: string;
  dueDate: string;
  current: number;
  target: number;
  unit: string;
  status: string;
  update_remarks: string;
}

interface UserRecord {
  id: number;
  full_name?: string;
  firstname?: string;
  lastname?: string;
  name?: string;
}

// ── Status config ──
const STATUS_DISPLAY: Record<string, string> = {
  not_started: "Not Started",
  on_track: "On Track",
  achieved: "Achieved",
  behind: "Behind",
};

const STATUS_API: Record<string, string> = {
  "Not Started": "not_started",
  "On Track": "on_track",
  Achieved: "achieved",
  Behind: "behind",
};

const parseStatus = (s: string): string => {
  if (!s) return "on_track";
  if (STATUS_DISPLAY[s]) return s;
  const normalized = s.toLowerCase().replace(/[\s-]/g, "_");
  if (STATUS_DISPLAY[normalized]) return normalized;
  if (STATUS_API[s]) return STATUS_API[s];
  return "on_track";
};

const formatStatus = (s: string): string => {
  if (STATUS_DISPLAY[s]) return s;
  if (STATUS_API[s]) return STATUS_API[s];
  return s.toLowerCase().replace(/[\s-]/g, "_");
};

// ── Period helpers ──
const parsePeriod = (p: string): string => {
  const map: Record<string, string> = {
    this_quarter: "This Quarter",
    this_year: "This Year",
    three_to_five_years: "3-5 Years",
    "3_to_5_years": "3-5 Years",
    "3_5_years": "3-5 Years",
    bhag: "BHAG",
    BHAG: "BHAG",
  };
  const normalized = p?.toLowerCase().replace(/-/g, "_").replace(/ /g, "_");
  return map[p] ?? map[normalized] ?? p ?? "This Quarter";
};

const formatPeriod = (p: string): string => {
  const map: Record<string, string> = {
    "This Quarter": "this_quarter",
    "This Year": "this_year",
    "3-5 Years": "three_to_five_years",
    BHAG: "bhag",
  };
  return map[p] ?? p.toLowerCase().replace(/ /g, "_");
};

// ── Date helpers ──
const formatDateDisplay = (d: string): string => {
  if (!d) return "";
  try {
    return new Date(d).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return d;
  }
};

const parseDateToApi = (d: string): string => {
  if (!d) return "";
  if (/^\d{4}-\d{2}-\d{2}$/.test(d)) return d;
  try {
    const dt = new Date(d);
    if (isNaN(dt.getTime())) return "";
    return dt.toISOString().split("T")[0];
  } catch {
    return "";
  }
};

// ── User display name ──
const getUserName = (u: UserRecord): string =>
  u.full_name ||
  u.name ||
  `${u.firstname || ""} ${u.lastname || ""}`.trim() ||
  `User #${u.id}`;

// ── Map API goal → internal Goal ──
const mapApiGoal = (k: any): Goal => ({
  id: k.id,
  title: k.title ?? "",
  description: k.description ?? "",
  period: parsePeriod(k.period),
  owner: k.owner?.name ?? k.owner_name ?? "Unassigned",
  owner_id: k.owner_id ?? k.owner?.id ?? null,
  dueDate: formatDateDisplay(k.target_date),
  target_date: k.target_date ?? "",
  current: Number(k.current_value ?? 0),
  target: Number(k.target_value ?? 100),
  unit: k.unit ?? "%",
  status: parseStatus(k.status),
  update_remarks: k.update_remarks ?? "",
});

// ── API helpers ──
const fetchGoalsFromApi = async (
  page: number = 1,
  perPage: number = 20
): Promise<{ goals: Goal[]; totalPages: number }> => {
  const res = await fetch(
    `${BASE_URL}/goals?q[goal_category_eq]=operational&page=${page}&per_page=${perPage}`,
    { method: "GET", headers: getAuthHeaders() }
  );
  const raw = await res.text();
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${raw.slice(0, 200)}`);

  let json: any;
  try {
    json = JSON.parse(raw);
  } catch {
    json = {};
  }

  const list: any[] = Array.isArray(json)
    ? json
    : Array.isArray(json.goals)
      ? json.goals
      : Array.isArray(json.data?.goals)
        ? json.data.goals
        : Array.isArray(json.data)
          ? json.data
          : [];

  let totalPages = 1;
  if (json.meta?.total_pages) totalPages = json.meta.total_pages;
  else if (json.pagination?.total_pages)
    totalPages = json.pagination.total_pages;
  else if (json.total_pages) totalPages = json.total_pages;
  else if (json.data?.total_pages) totalPages = json.data.total_pages;

  return { goals: list.map(mapApiGoal), totalPages };
};

const fetchUsersFromApi = async (): Promise<UserRecord[]> => {
  const orgId =
    localStorage.getItem("org_id") ||
    localStorage.getItem("organization_id") ||
    "";
  const url = orgId
    ? `${BASE_URL}/api/users?organization_id=${orgId}`
    : `${BASE_URL}/api/users`;
  try {
    const res = await fetch(url, { method: "GET", headers: getAuthHeaders() });
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data : data.users || data.data || [];
  } catch {
    return [];
  }
};

const createGoalInApi = async (form: GoalFormState): Promise<Goal> => {
  const payload = {
    goal: {
      goal_category: "operational",
      title: form.title.trim(),
      description: form.description.trim() || undefined,
      target_value: Number(form.target),
      current_value: Number(form.current),
      unit: form.unit,
      period: formatPeriod(form.period),
      status: formatStatus(form.status),
      owner_id: form.owner_id ? parseInt(form.owner_id) : undefined,
      target_date: parseDateToApi(form.dueDate) || undefined,
      update_remarks: form.update_remarks.trim() || undefined,
    },
  };
  const res = await fetch(`${BASE_URL}/goals`, {
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
  const k = json.goal ?? json.data?.goal ?? json.data ?? json;
  return mapApiGoal({ ...k, id: k.id });
};

const updateGoalInApi = async (
  id: number,
  form: GoalFormState
): Promise<void> => {
  const payload = {
    goal: {
      goal_category: "operational",
      title: form.title.trim(),
      description: form.description.trim() || undefined,
      target_value: Number(form.target),
      current_value: Number(form.current),
      unit: form.unit,
      period: formatPeriod(form.period),
      status: formatStatus(form.status),
      owner_id: form.owner_id ? parseInt(form.owner_id) : undefined,
      target_date: parseDateToApi(form.dueDate) || undefined,
      update_remarks: form.update_remarks.trim() || undefined,
    },
  };
  const res = await fetch(`${BASE_URL}/goals/${id}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });
  const raw = await res.text();
  if (!res.ok)
    throw new Error(`PUT error ${res.status}: ${raw || res.statusText}`);
};

const patchGoalProgressInApi = async (
  id: number,
  current_value: number
): Promise<void> => {
  const res = await fetch(`${BASE_URL}/goals/${id}`, {
    method: "PATCH",
    headers: getAuthHeaders(),
    body: JSON.stringify({ goal: { current_value } }),
  });
  if (!res.ok) {
    const t = await res.text();
    throw new Error(`PATCH error ${res.status}: ${t || res.statusText}`);
  }
};

const patchGoalStatusInApi = async (
  id: number,
  status: string
): Promise<void> => {
  const res = await fetch(`${BASE_URL}/goals/${id}`, {
    method: "PATCH",
    headers: getAuthHeaders(),
    body: JSON.stringify({ goal: { status: formatStatus(status) } }),
  });
  if (!res.ok) {
    const t = await res.text();
    throw new Error(
      `PATCH status error ${res.status}: ${t || res.statusText}`
    );
  }
};

const deleteGoalFromApi = async (id: number): Promise<void> => {
  const res = await fetch(`${BASE_URL}/goals/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
  if (!res.ok) {
    const t = await res.text();
    throw new Error(`DELETE error ${res.status}: ${t || res.statusText}`);
  }
};

// ── Icons ──
const PlusIcon = () => (
  <svg
    style={{ width: 16, height: 16 }}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 4v16m8-8H4"
    />
  </svg>
);
const SearchIcon = () => (
  <svg
    style={{ width: 16, height: 16, color: "#a3a3a3" }}
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
const GoalIcon = ({ style }: { style?: React.CSSProperties }) => (
  <svg style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <circle cx="12" cy="12" r="9" strokeWidth={1.5} />
    <circle cx="12" cy="12" r="5" strokeWidth={1.5} />
    <circle cx="12" cy="12" r="1.5" fill="currentColor" stroke="none" />
  </svg>
);
const UserIcon = () => (
  <svg
    style={{ width: 12, height: 12 }}
    fill="currentColor"
    viewBox="0 0 24 24"
  >
    <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
  </svg>
);
const CalIcon = () => (
  <svg
    style={{ width: 12, height: 12, color: "#a3a3a3" }}
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
const GripIcon = () => (
  <svg
    style={{ width: 13, height: 13, color: "#d4d4d4", flexShrink: 0 }}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M4 8h16M4 16h16"
    />
  </svg>
);
const CloseIcon = () => (
  <svg
    style={{ width: 18, height: 18 }}
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
);
const FileSearchIcon = () => (
  <svg
    style={{ width: 32, height: 32, color: "#a3a3a3" }}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
    />
  </svg>
);
const LoaderIcon = () => (
  <svg
    style={{
      width: 16,
      height: 16,
      animation: "gv-spin 0.8s linear infinite",
      display: "inline-block",
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
const ChevronLeftIcon = () => (
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
      d="M15 19l-7-7 7-7"
    />
  </svg>
);
const ChevronRightIcon = () => (
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
      d="M9 5l7 7-7 7"
    />
  </svg>
);

// ── Global styles ──
const Styles = () => (
  <style>{`
    @keyframes gv-spin { to { transform: rotate(360deg); } }
    .gv-overlay {
      position: fixed; inset: 0; z-index: 99999;
      display: flex; align-items: center; justify-content: center;
      padding: 16px; background: rgba(0,0,0,0.45); backdrop-filter: blur(3px);
    }
    .gv-modal {
      background: ${C.primaryBg}; border-radius: 20px;
      box-shadow: 0 30px 80px rgba(0,0,0,0.25);
      width: 100%; max-width: 560px;
      display: flex; flex-direction: column; max-height: 92vh; overflow: hidden;
      border: 1px solid ${C.primaryBord};
    }
    .gv-modal-body { overflow-y: auto; flex: 1; }
    .gv-select {
      width: 100%; border: 1px solid #e5e5e5; border-radius: 12px;
      padding: 9px 36px 9px 12px; font-size: 14px; color: #374151;
      background: #fff; appearance: none; -webkit-appearance: none;
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23a3a3a3'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E");
      background-repeat: no-repeat; background-position: right 10px center;
      background-size: 16px; cursor: pointer; box-sizing: border-box; outline: none;
    }
    .gv-select:focus { border-color: ${C.primary}; box-shadow: 0 0 0 3px rgba(218,119,86,0.12); }
    .gv-input {
      width: 100%; border: 1px solid #e5e5e5; border-radius: 12px;
      padding: 10px 14px; font-size: 14px; color: #171717;
      background: #fff; box-sizing: border-box; outline: none; font-family: inherit;
    }
    .gv-input:focus { border-color: ${C.primary}; box-shadow: 0 0 0 3px rgba(218,119,86,0.12); }
    .gv-input::placeholder { color: #a3a3a3; }
    .gv-slider {
      -webkit-appearance: none; appearance: none;
      width: 100%; height: 6px; border-radius: 99px; outline: none; cursor: pointer;
    }
    .gv-slider::-webkit-slider-thumb {
      -webkit-appearance: none; width: 18px; height: 18px;
      border-radius: 50%; background: ${C.primary}; cursor: pointer;
      border: 2px solid white; box-shadow: 0 1px 4px rgba(0,0,0,0.2);
    }
    .gv-card-slider {
      -webkit-appearance: none; appearance: none;
      width: 100%; height: 4px; border-radius: 99px; outline: none; cursor: pointer;
    }
    .gv-card-slider::-webkit-slider-thumb {
      -webkit-appearance: none; width: 14px; height: 14px;
      border-radius: 50%; background: ${C.primary}; cursor: pointer;
      border: 2px solid white; box-shadow: 0 1px 4px rgba(0,0,0,0.2);
      transition: transform 0.15s;
    }
    .gv-card-slider::-webkit-slider-thumb:hover { transform: scale(1.35); }
    .gv-kanban-card { transition: opacity 0.15s, transform 0.15s; cursor: grab; }
    .gv-kanban-card:active { cursor: grabbing; }
    .gv-kanban-card.dragging { opacity: 0.3; transform: scale(0.95) rotate(1deg); }
    .gv-col-zone {
      border-radius: 14px; min-height: 520px; padding: 8px;
      transition: background 0.15s, border-color 0.15s;
      border: 2px solid transparent;
    }
    .gv-col-zone.drag-over { background: #fef6f4 !important; border: 2px dashed ${C.primary} !important; }
    .gv-stat-card { transition: transform 0.15s, box-shadow 0.15s; }
    .gv-stat-card:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(218,119,86,0.15) !important; }
    .gv-error-banner { background: #fee2e2; border: 1px solid #fca5a5; color: #991b1b; border-radius: 10px; padding: 10px 14px; font-size: 13px; font-weight: 600; }
    .gv-skeleton { background: linear-gradient(90deg, #f3f4f6 25%, #e9eaec 50%, #f3f4f6 75%); background-size: 200% 100%; animation: gv-shimmer 1.4s infinite; border-radius: 10px; }
    @keyframes gv-shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }
    .gv-user-dropdown {
      position: absolute; left: 0; right: 0; margin-top: 4px;
      background: #fff; border: 1px solid #e5e5e5; border-radius: 12px;
      box-shadow: 0 10px 24px rgba(0,0,0,0.10); max-height: 200px;
      overflow-y: auto; overflow-x: hidden; z-index: 99999;
    }
    .gv-user-option {
      padding: 9px 12px; font-size: 13px; cursor: pointer;
      border-bottom: 1px solid #f5f5f5; color: #374151;
      display: flex; align-items: center; gap: 8px;
      transition: background 0.1s;
    }
    .gv-user-option:last-child { border-bottom: none; }
    .gv-user-option:hover { background: #fef6f4; }
    .gv-user-option.clear { color: #ef4444; font-weight: 600; }
    .gv-user-option.clear:hover { background: #fef2f2; }
    .gv-user-avatar {
      width: 26px; height: 26px; border-radius: 50%;
      background: rgba(218,119,86,0.15); color: ${C.primary};
      display: flex; align-items: center; justify-content: center;
      font-size: 10px; font-weight: 700; flex-shrink: 0;
    }
    .gv-pagination {
      display: flex; align-items: center; justify-content: center;
      gap: 6px; margin-top: 24px; padding: 16px;
    }
    .gv-page-item {
      display: flex; align-items: center; justify-content: center;
      min-width: 32px; height: 32px; padding: 0 8px;
      border-radius: 6px; font-size: 13px; font-weight: 600;
      color: #374151; background: transparent; border: none;
      cursor: pointer; transition: all 0.2s ease;
    }
    .gv-page-item:hover:not(:disabled):not(.dots) { background: #f0ebe8; color: #1a1a1a; }
    .gv-page-item.active { background: ${C.primary}; color: #fff; }
    .gv-page-item:disabled { color: #a3a3a3; cursor: not-allowed; }
    .gv-page-item.dots { cursor: default; background: transparent; color: #737373; }
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
      className="gv-overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {children}
    </div>,
    document.body
  );
};

// ── Searchable User Dropdown ──
const UserDropdown = ({
  value,
  onChange,
  users,
  placeholder = "Search owner...",
}: {
  value: string;
  onChange: (id: string, name: string) => void;
  users: UserRecord[];
  placeholder?: string;
}) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const ref = useRef<HTMLDivElement>(null);

  const selectedUser = users.find((u) => String(u.id) === value);
  const displayValue = selectedUser ? getUserName(selectedUser) : "";

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const filtered = users.filter((u) =>
    getUserName(u).toLowerCase().includes(search.toLowerCase())
  );

  const initials = (u: UserRecord) =>
    getUserName(u)
      .split(" ")
      .map((p) => p[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);

  return (
    <div style={{ position: "relative" }} ref={ref}>
      <input
        type="text"
        className="gv-input"
        placeholder={placeholder}
        value={open ? search : displayValue}
        onClick={() => {
          setOpen(true);
          setSearch("");
        }}
        onChange={(e) => {
          setSearch(e.target.value);
          setOpen(true);
        }}
        style={{ paddingRight: 36 }}
        autoComplete="off"
      />
      <div
        style={{
          position: "absolute",
          right: 12,
          top: "50%",
          transform: "translateY(-50%)",
          pointerEvents: "none",
          color: "#a3a3a3",
        }}
      >
        <svg
          style={{ width: 16, height: 16 }}
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

      {open && (
        <div className="gv-user-dropdown">
          {value && (
            <div
              className="gv-user-option clear"
              onClick={() => {
                onChange("", "");
                setOpen(false);
                setSearch("");
              }}
            >
              ✕ Clear selection
            </div>
          )}
          {filtered.length === 0 ? (
            <div
              style={{
                padding: "12px",
                fontSize: 13,
                color: "#a3a3a3",
                textAlign: "center",
              }}
            >
              No users found
            </div>
          ) : (
            filtered.map((u) => (
              <div
                key={u.id}
                className="gv-user-option"
                onClick={() => {
                  onChange(String(u.id), getUserName(u));
                  setOpen(false);
                  setSearch("");
                }}
              >
                <div className="gv-user-avatar">{initials(u)}</div>
                {getUserName(u)}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

// ── Config ──
const PERIOD_CONFIG: Record<string, { bg: string; text: string }> = {
  "This Quarter": { bg: "#DA7756", text: "#fff" },
  "This Year": { bg: "#1565c0", text: "#fff" },
  "3-5 Years": { bg: "#f97316", text: "#fff" },
  BHAG: { bg: "#7c3aed", text: "#fff" },
};

const COLUMNS = [
  {
    key: "not_started",
    label: "Not Started",
    hBg: "#fafafa",
    hBorder: "#e5e5e5",
    cntBg: "#e5e5e5",
    cntText: "#525252",
  },
  {
    key: "on_track",
    label: "On Track",
    hBg: "#f0fdf4",
    hBorder: "#bbf7d0",
    cntBg: "#dcfce7",
    cntText: "#166534",
  },
  {
    key: "achieved",
    label: "Achieved",
    hBg: "#fef6f4",
    hBorder: "rgba(218,119,86,0.25)",
    cntBg: "rgba(218,119,86,0.15)",
    cntText: "#9a3412",
  },
  {
    key: "behind",
    label: "Behind",
    hBg: "#fff5f5",
    hBorder: "#fecaca",
    cntBg: "#fee2e2",
    cntText: "#991b1b",
  },
];

const PERIODS = [
  "All Periods",
  "This Quarter",
  "This Year",
  "3-5 Years",
  "BHAG",
];
const STATUSES_LIST = ["not_started", "on_track", "achieved", "behind"];
const UNITS = ["%", "₹", "$", "Count", "Days", "Hours", "Score"];

const EMPTY_FORM: GoalFormState = {
  title: "",
  description: "",
  period: "This Quarter",
  owner: "Unassigned",
  owner_id: "",
  dueDate: "",
  current: 0,
  target: 100,
  unit: "%",
  status: "on_track",
  update_remarks: "",
};

const getProgress = (g: { current: number; target: number }) => {
  const t = Number(g.target);
  if (!t) return 0;
  return Math.min(100, Math.round((Number(g.current) / t) * 100));
};

const getPeriodStyle = (p: string) =>
  PERIOD_CONFIG[p] || { bg: "#737373", text: "#fff" };

const getBarColor = (period: string) =>
  period === "This Quarter"
    ? C.primary
    : period === "This Year"
      ? "#1565c0"
      : period === "3-5 Years"
        ? "#f97316"
        : "#7c3aed";

// ── Goal Card (Kanban) ──
const GoalCard = ({
  goal,
  onEdit,
  onDelete,
  onProgressChange,
  dragHandlers,
  isDeleting,
}: {
  goal: Goal;
  onEdit: (g: Goal) => void;
  onDelete: (id: number) => void;
  onProgressChange: (id: number, val: number) => void;
  dragHandlers: any;
  isDeleting: boolean;
}) => {
  const pct = getProgress(goal);
  const pStyle = getPeriodStyle(goal.period);
  const isUnassigned = goal.owner === "Unassigned" || !goal.owner;
  const barColor = getBarColor(goal.period);
  const sliderBg = `linear-gradient(to right, ${barColor} ${pct}%, #e5e5e5 ${pct}%)`;
  const displayCurrent = Number.isInteger(Number(goal.current))
    ? Number(goal.current)
    : Number(goal.current).toFixed(2);

  return (
    <div
      className="gv-kanban-card"
      style={{
        background: "#fff",
        borderRadius: 14,
        border: "1px solid #f0ebe8",
        borderLeft: `4px solid ${barColor}`,
        marginBottom: 10,
        boxShadow: "0 1px 4px rgba(218,119,86,0.07)",
        opacity: isDeleting ? 0.4 : 1,
      }}
      draggable
      onDragStart={(e) => dragHandlers.onDragStart(e, goal.id)}
      onDragEnd={dragHandlers.onDragEnd}
    >
      <div style={{ padding: "12px 14px" }}>
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            gap: 6,
            marginBottom: 10,
          }}
        >
          <span style={{ marginTop: 3 }}>
            <GripIcon />
          </span>
          <p
            style={{
              fontSize: 13,
              fontWeight: 600,
              color: "#171717",
              lineHeight: 1.4,
              margin: 0,
            }}
          >
            {goal.title}
          </p>
        </div>
        <div
          style={{
            background: pStyle.bg,
            color: pStyle.text,
            fontSize: 11,
            fontWeight: 700,
            padding: "4px 10px",
            borderRadius: 6,
            textAlign: "center",
            marginBottom: 6,
          }}
        >
          {goal.period}
        </div>
        <div
          style={{
            background: isUnassigned ? "transparent" : "rgba(218,119,86,0.12)",
            color: isUnassigned ? "#a3a3a3" : C.primary,
            border: isUnassigned ? "1px solid #e5e5e5" : "none",
            fontSize: 11,
            fontWeight: 600,
            padding: "4px 10px",
            borderRadius: 6,
            display: "flex",
            alignItems: "center",
            gap: 5,
            marginBottom: 6,
          }}
        >
          <UserIcon />
          {isUnassigned ? "Unassigned" : goal.owner}
        </div>
        {goal.dueDate && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 5,
              fontSize: 11,
              color: "#737373",
              marginBottom: 10,
            }}
          >
            <CalIcon />
            {goal.dueDate}
          </div>
        )}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: 11,
            color: "#525252",
            marginBottom: 5,
          }}
        >
          <span>
            {displayCurrent} / {goal.target} {goal.unit}
          </span>
          <span style={{ fontWeight: 700, color: barColor }}>{pct}%</span>
        </div>
        <input
          type="range"
          min={0}
          max={Number(goal.target) || 100}
          step={1}
          value={Number(goal.current)}
          onChange={(e) => onProgressChange(goal.id, Number(e.target.value))}
          onMouseDown={(e) => e.stopPropagation()}
          onTouchStart={(e) => e.stopPropagation()}
          className="gv-card-slider"
          style={{ background: sliderBg, marginBottom: 2 }}
        />
        <div
          style={{
            textAlign: "right",
            fontSize: 10,
            color: "#a3a3a3",
            marginBottom: 10,
          }}
        >
          {pct}%
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            paddingTop: 8,
            borderTop: "1px solid #f5f0ee",
          }}
        >
          <button
            onClick={() => onEdit(goal)}
            style={{
              padding: "5px 8px",
              borderRadius: 8,
              border: "none",
              background: "transparent",
              cursor: "pointer",
              color: "#a3a3a3",
              display: "flex",
              alignItems: "center",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = C.primaryBg;
              e.currentTarget.style.color = C.primary;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
              e.currentTarget.style.color = "#a3a3a3";
            }}
          >
            <EditIcon />
          </button>
          <button
            onClick={() => onDelete(goal.id)}
            disabled={isDeleting}
            style={{
              padding: "5px 8px",
              borderRadius: 8,
              border: "none",
              background: "transparent",
              cursor: isDeleting ? "not-allowed" : "pointer",
              color: "#a3a3a3",
              display: "flex",
              alignItems: "center",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "#fff5f5";
              e.currentTarget.style.color = "#dc2626";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
              e.currentTarget.style.color = "#a3a3a3";
            }}
          >
            {isDeleting ? <LoaderIcon /> : <TrashIcon />}
          </button>
        </div>
      </div>
    </div>
  );
};

// ── Main export ──
export const GoalsView = () => {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [users, setUsers] = useState<UserRecord[]>([]);
  const [isFetching, setIsFetching] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [view, setView] = useState<"kanban" | "list">("kanban");
  const [search, setSearch] = useState("");
  const [filterPeriod, setFilterPeriod] = useState("All Periods");
  const [filterOwner, setFilterOwner] = useState("All Owners");
  const [activeModal, setActiveModal] = useState<"create" | "edit" | null>(null);

  // Pagination (list view only)
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const perPage = 20;

  const [form, setForm] = useState<GoalFormState>(EMPTY_FORM);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [dragOverCol, setDragOverCol] = useState<string | null>(null);
  const progressTimers = useRef<Record<number, ReturnType<typeof setTimeout>>>({});
  const dragId = useRef<number | null>(null);

  const loadGoals = useCallback(
    async (page: number = 1) => {
      setIsFetching(true);
      setFetchError(null);
      try {
        const data = await fetchGoalsFromApi(page, perPage);
        setGoals(data.goals);
        setTotalPages(data.totalPages);
        setCurrentPage(page);
      } catch (err: any) {
        setFetchError(err.message || "Failed to load goals.");
      } finally {
        setIsFetching(false);
      }
    },
    [perPage]
  );

  useEffect(() => {
    loadGoals(1);
    fetchUsersFromApi()
      .then(setUsers)
      .catch(() => {});
  }, [loadGoals]);

  const closeModal = () => {
    setActiveModal(null);
    setForm(EMPTY_FORM);
    setEditingId(null);
    setSaveError(null);
  };

  // ── Owner filter options from actual goals ──
  const ownerNames = Array.from(new Set(goals.map((g) => g.owner)));
  const ownerFilterOptions = ["All Owners", ...ownerNames];

  const filtered = goals.filter((g) => {
    const ms = g.title.toLowerCase().includes(search.toLowerCase());
    const mp = filterPeriod === "All Periods" || g.period === filterPeriod;
    const mo = filterOwner === "All Owners" || g.owner === filterOwner;
    return ms && mp && mo;
  });

  const total = filtered.length;
  const achieved = filtered.filter((g) => g.status === "achieved").length;
  const onTrack = filtered.filter((g) => g.status === "on_track").length;
  const behind = filtered.filter((g) => g.status === "behind").length;

  const openCreate = () => {
    setForm(EMPTY_FORM);
    setSaveError(null);
    setActiveModal("create");
  };

  const openEdit = (goal: Goal) => {
    setForm({
      title: goal.title,
      description: goal.description ?? "",
      period: goal.period,
      owner: goal.owner,
      owner_id: goal.owner_id ? String(goal.owner_id) : "",
      dueDate: goal.target_date ?? goal.dueDate ?? "",
      current: goal.current,
      target: goal.target,
      unit: goal.unit,
      status: goal.status,
      update_remarks: goal.update_remarks ?? "",
    });
    setEditingId(goal.id);
    setSaveError(null);
    setActiveModal("edit");
  };

  const handleDelete = async (id: number) => {
    setDeletingId(id);
    try {
      await deleteGoalFromApi(id);
      loadGoals(currentPage);
    } catch (err: any) {
      setFetchError(err.message || "Failed to delete goal.");
    } finally {
      setDeletingId(null);
    }
  };

  const handleProgressChange = (id: number, val: number) => {
    setGoals((prev) =>
      prev.map((g) => (g.id === id ? { ...g, current: val } : g))
    );
    if (progressTimers.current[id]) clearTimeout(progressTimers.current[id]);
    progressTimers.current[id] = setTimeout(async () => {
      try {
        await patchGoalProgressInApi(id, val);
      } catch (err: any) {
        console.error("[Goals] PATCH progress error:", err);
      }
    }, 600);
  };

  const handleStatusChange = async (id: number, status: string) => {
    setGoals((prev) => prev.map((g) => (g.id === id ? { ...g, status } : g)));
    try {
      await patchGoalStatusInApi(id, status);
    } catch (err: any) {
      console.error("[Goals] PATCH status error:", err);
      loadGoals(currentPage);
    }
  };

  const handleSave = async () => {
    if (!form.title.trim()) {
      setSaveError("Goal title is required.");
      return;
    }
    setIsSaving(true);
    setSaveError(null);
    try {
      if (activeModal === "create") {
        await createGoalInApi(form);
        closeModal();
        loadGoals(currentPage);
      } else if (editingId !== null) {
        await updateGoalInApi(editingId, form);
        closeModal();
        loadGoals(currentPage);
      }
    } catch (err: any) {
      setSaveError(err.message || "Failed to save. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const dragHandlers = {
    onDragStart: (e: React.DragEvent, id: number) => {
      dragId.current = id;
      e.dataTransfer.effectAllowed = "move";
      setTimeout(() => {
        const el = document.getElementById(`gcard-${id}`);
        if (el) el.classList.add("dragging");
      }, 0);
    },
    onDragEnd: () => {
      if (dragId.current) {
        const el = document.getElementById(`gcard-${dragId.current}`);
        if (el) el.classList.remove("dragging");
      }
      dragId.current = null;
      setDragOverCol(null);
    },
  };

  const handleDragOver = (e: React.DragEvent, colKey: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setDragOverCol(colKey);
  };
  const handleDragLeave = (e: React.DragEvent) => {
    if (
      e.relatedTarget &&
      (e.currentTarget as HTMLElement).contains(e.relatedTarget as Node)
    )
      return;
    setDragOverCol(null);
  };
  const handleDrop = (e: React.DragEvent, colKey: string) => {
    e.preventDefault();
    if (dragId.current == null) return;
    handleStatusChange(dragId.current, colKey);
    setDragOverCol(null);
    dragId.current = null;
  };

  const modalSliderBg = (pct: number) =>
    `linear-gradient(to right, ${C.primary} ${pct}%, #e5e5e5 ${pct}%)`;

  const stats = [
    {
      label: "Total Goals",
      value: total,
      iconColor: "#737373",
      bg: "#f5f0ee",
      textColor: "#1c1c1c",
    },
    {
      label: "Achieved",
      value: achieved,
      iconColor: C.primary,
      bg: "rgba(218,119,86,0.10)",
      textColor: "#9a3412",
    },
    {
      label: "On Track",
      value: onTrack,
      iconColor: "#16a34a",
      bg: "#f0fdf4",
      textColor: "#166534",
    },
    {
      label: "Behind",
      value: behind,
      iconColor: "#dc2626",
      bg: "#fff5f5",
      textColor: "#991b1b",
    },
  ];

  const getPageNumbers = (current: number, total: number): (number | string)[] => {
    if (total <= 5) return Array.from({ length: total }, (_, i) => i + 1);
    if (current <= 3) return [1, 2, 3, "...", total];
    if (current >= total - 2) return [1, "...", total - 2, total - 1, total];
    return [1, "...", current, "...", total];
  };

  const pageNumbers = getPageNumbers(currentPage, totalPages);

  return (
    <>
      <Styles />

      {/* ── Top bar ── */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          marginBottom: 20,
          flexWrap: "wrap",
        }}
      >
        <button
          onClick={openCreate}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            padding: "9px 18px",
            background: C.primary,
            color: "#fff",
            border: "none",
            borderRadius: 12,
            fontSize: 14,
            fontWeight: 700,
            cursor: "pointer",
            boxShadow: "0 2px 8px rgba(218,119,86,0.3)",
            flexShrink: 0,
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = C.primaryHov)}
          onMouseLeave={(e) => (e.currentTarget.style.background = C.primary)}
        >
          <PlusIcon /> Add New Goal
        </button>
        <div
          style={{
            flex: 1,
            minWidth: 200,
            background: C.primaryBg,
            border: `1px solid ${C.primaryBord}`,
            borderRadius: 12,
            padding: "9px 16px",
            fontSize: 13,
            color: "#525252",
          }}
        >
          <span style={{ fontWeight: 700, color: "#171717" }}>
            Operational Goals
          </span>{" "}
          are specific, measurable targets that drive your KPIs
        </div>
        <div
          style={{
            display: "flex",
            borderRadius: 12,
            overflow: "hidden",
            border: "1px solid #e5e5e5",
            flexShrink: 0,
          }}
        >
          {(["kanban", "list"] as const).map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              style={{
                padding: "9px 18px",
                fontSize: 13,
                fontWeight: 700,
                border: "none",
                cursor: "pointer",
                background: view === v ? C.primary : "#fff",
                color: view === v ? "#fff" : "#525252",
                transition: "background 0.15s, color 0.15s",
              }}
            >
              {v.charAt(0).toUpperCase() + v.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {fetchError && (
        <div
          className="gv-error-banner"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 16,
          }}
        >
          <span>⚠ {fetchError}</span>
          <button
            onClick={() => loadGoals(currentPage)}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              textDecoration: "underline",
              fontSize: 13,
              fontWeight: 600,
              color: "#991b1b",
            }}
          >
            Retry
          </button>
        </div>
      )}

      {/* ── Stat cards ── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: 14,
          marginBottom: 20,
        }}
      >
        {isFetching
          ? [1, 2, 3, 4].map((n) => (
              <div
                key={n}
                className="gv-skeleton"
                style={{ height: 88, borderRadius: 18 }}
              />
            ))
          : stats.map((s) => (
              <div
                key={s.label}
                className="gv-stat-card"
                style={{
                  background: s.bg,
                  borderRadius: 18,
                  padding: "18px 20px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                }}
              >
                <div>
                  <p
                    style={{
                      fontSize: 28,
                      fontWeight: 800,
                      color: s.textColor,
                      margin: 0,
                      lineHeight: 1,
                    }}
                  >
                    {s.value}
                  </p>
                  <p
                    style={{
                      fontSize: 13,
                      fontWeight: 600,
                      color: s.textColor,
                      opacity: 0.8,
                      margin: "4px 0 0",
                    }}
                  >
                    {s.label}
                  </p>
                </div>
                <GoalIcon
                  style={{
                    width: 30,
                    height: 30,
                    color: s.iconColor,
                    opacity: 0.7,
                  }}
                />
              </div>
            ))}
      </div>

      {/* ── Main card wrapper ── */}
      <div
        style={{
          background: C.primaryTint,
          border: `1px solid ${C.primaryBord}`,
          borderRadius: 20,
          padding: 20,
          boxShadow: "0 2px 8px rgba(218,119,86,0.08)",
        }}
      >
        {/* Filters */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            marginBottom: 20,
            flexWrap: "wrap",
          }}
        >
          <div style={{ position: "relative", flex: 1, minWidth: 180 }}>
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
              placeholder="Search goals..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                width: "100%",
                border: "1px solid #e5e5e5",
                borderRadius: 12,
                padding: "9px 12px 9px 38px",
                fontSize: 14,
                background: "#fff",
                outline: "none",
                boxSizing: "border-box",
                color: "#171717",
              }}
              onFocus={(e) => {
                e.target.style.borderColor = C.primary;
                e.target.style.boxShadow = "0 0 0 3px rgba(218,119,86,0.12)";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "#e5e5e5";
                e.target.style.boxShadow = "none";
              }}
            />
          </div>
          <select
            value={filterPeriod}
            onChange={(e) => setFilterPeriod(e.target.value)}
            className="gv-select"
            style={{ minWidth: 140, maxWidth: 160 }}
          >
            {PERIODS.map((p) => (
              <option key={p}>{p}</option>
            ))}
          </select>
          <select
            value={filterOwner}
            onChange={(e) => setFilterOwner(e.target.value)}
            className="gv-select"
            style={{ minWidth: 140, maxWidth: 160 }}
          >
            {ownerFilterOptions.map((o) => (
              <option key={o}>{o}</option>
            ))}
          </select>
        </div>

        {/* ── KANBAN VIEW (no pagination) ── */}
        {view === "kanban" &&
          (isFetching ? (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(4, 1fr)",
                gap: 12,
              }}
            >
              {[1, 2, 3, 4].map((n) => (
                <div
                  key={n}
                  className="gv-skeleton"
                  style={{ height: 300, borderRadius: 14 }}
                />
              ))}
            </div>
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(4, 1fr)",
                gap: 12,
              }}
            >
              {COLUMNS.map((col) => {
                const colGoals = filtered.filter((g) => g.status === col.key);
                const isOver = dragOverCol === col.key;
                return (
                  <div key={col.key}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: "8px 12px",
                        borderRadius: 10,
                        marginBottom: 8,
                        background: col.hBg,
                        border: `1px solid ${col.hBorder}`,
                      }}
                    >
                      <span
                        style={{
                          fontSize: 13,
                          fontWeight: 700,
                          color: "#374151",
                        }}
                      >
                        {col.label}
                      </span>
                      <span
                        style={{
                          fontSize: 11,
                          fontWeight: 800,
                          padding: "2px 8px",
                          borderRadius: 99,
                          background: col.cntBg,
                          color: col.cntText,
                        }}
                      >
                        {colGoals.length}
                      </span>
                    </div>
                    <div
                      className={`gv-col-zone${isOver ? " drag-over" : ""}`}
                      style={{ background: isOver ? undefined : "transparent" }}
                      onDragOver={(e) => handleDragOver(e, col.key)}
                      onDragLeave={handleDragLeave}
                      onDrop={(e) => handleDrop(e, col.key)}
                    >
                      {colGoals.length === 0 && (
                        <div
                          style={{
                            border: `2px dashed ${C.primaryBord}`,
                            borderRadius: 12,
                            height: 80,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            marginBottom: 8,
                          }}
                        >
                          <p
                            style={{ fontSize: 12, color: "#a3a3a3", margin: 0 }}
                          >
                            Drop goals here
                          </p>
                        </div>
                      )}
                      {colGoals.map((goal) => (
                        <div key={goal.id} id={`gcard-${goal.id}`}>
                          <GoalCard
                            goal={goal}
                            onEdit={openEdit}
                            onDelete={handleDelete}
                            onProgressChange={handleProgressChange}
                            dragHandlers={dragHandlers}
                            isDeleting={deletingId === goal.id}
                          />
                        </div>
                      ))}
                      <div style={{ minHeight: 120 }} />
                    </div>
                  </div>
                );
              })}
            </div>
          ))}

        {/* ── LIST VIEW (with pagination) ── */}
        {view === "list" &&
          (isFetching ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {[1, 2, 3, 4, 5].map((n) => (
                <div
                  key={n}
                  className="gv-skeleton"
                  style={{ height: 52, borderRadius: 10 }}
                />
              ))}
            </div>
          ) : (
            <>
              <div
                style={{
                  background: "#fff",
                  borderRadius: 14,
                  border: "1px solid #f0ebe8",
                  overflow: "hidden",
                  boxShadow: "0 1px 4px rgba(218,119,86,0.08)",
                }}
              >
                {filtered.length === 0 ? (
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      padding: "64px 16px",
                      textAlign: "center",
                    }}
                  >
                    <div
                      style={{
                        width: 64,
                        height: 64,
                        borderRadius: "50%",
                        background: "#f5f0ee",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        marginBottom: 16,
                      }}
                    >
                      <FileSearchIcon />
                    </div>
                    <h3
                      style={{
                        fontSize: 16,
                        fontWeight: 700,
                        color: "#171717",
                        margin: "0 0 6px",
                      }}
                    >
                      No goals found
                    </h3>
                    <p
                      style={{
                        fontSize: 13,
                        color: "#737373",
                        margin: "0 0 16px",
                      }}
                    >
                      Try adjusting your filters or add a new goal.
                    </p>
                    <button
                      onClick={openCreate}
                      style={{
                        fontSize: 13,
                        fontWeight: 700,
                        color: C.primary,
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        textDecoration: "underline",
                      }}
                    >
                      Add New Goal +
                    </button>
                  </div>
                ) : (
                  <table
                    style={{
                      width: "100%",
                      borderCollapse: "collapse",
                      fontSize: 13,
                    }}
                  >
                    <thead>
                      <tr
                        style={{
                          borderBottom: "1px solid #f0ebe8",
                          background: C.primaryBg,
                        }}
                      >
                        {["Goal", "Period", "Owner", "Progress", "Status", ""].map(
                          (h, i) => (
                            <th
                              key={i}
                              style={{
                                textAlign: "left",
                                padding: "12px 16px",
                                fontSize: 11,
                                fontWeight: 700,
                                color: "#737373",
                                textTransform: "uppercase",
                                letterSpacing: "0.05em",
                              }}
                            >
                              {h}
                            </th>
                          )
                        )}
                      </tr>
                    </thead>
                    <tbody>
                      {filtered.map((goal) => {
                        const pct = getProgress(goal);
                        const pStyle = getPeriodStyle(goal.period);
                        const bar = getBarColor(goal.period);
                        const listSlidBg = `linear-gradient(to right, ${bar} ${pct}%, #e5e5e5 ${pct}%)`;
                        return (
                          <tr
                            key={goal.id}
                            style={{
                              borderBottom: "1px solid #faf7f5",
                              opacity: deletingId === goal.id ? 0.4 : 1,
                            }}
                            onMouseEnter={(e) =>
                              (e.currentTarget.style.background = C.primaryBg)
                            }
                            onMouseLeave={(e) =>
                              (e.currentTarget.style.background = "transparent")
                            }
                          >
                            <td
                              style={{
                                padding: "12px 16px",
                                fontWeight: 600,
                                color: "#171717",
                                maxWidth: 200,
                              }}
                            >
                              <p
                                style={{
                                  margin: 0,
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                  whiteSpace: "nowrap",
                                }}
                              >
                                {goal.title}
                              </p>
                            </td>
                            <td
                              style={{
                                padding: "12px 16px",
                                whiteSpace: "nowrap",
                              }}
                            >
                              <span
                                style={{
                                  background: pStyle.bg,
                                  color: pStyle.text,
                                  fontSize: 11,
                                  fontWeight: 700,
                                  padding: "3px 8px",
                                  borderRadius: 6,
                                }}
                              >
                                {goal.period}
                              </span>
                            </td>
                            <td
                              style={{
                                padding: "12px 16px",
                                color: "#525252",
                                whiteSpace: "nowrap",
                                fontSize: 12,
                              }}
                            >
                              {goal.owner}
                            </td>
                            <td style={{ padding: "12px 16px", minWidth: 160 }}>
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 8,
                                }}
                              >
                                <input
                                  type="range"
                                  min={0}
                                  max={Number(goal.target) || 100}
                                  step={1}
                                  value={Number(goal.current)}
                                  onChange={(e) =>
                                    handleProgressChange(
                                      goal.id,
                                      Number(e.target.value)
                                    )
                                  }
                                  className="gv-card-slider"
                                  style={{ background: listSlidBg, flex: 1 }}
                                />
                                <span
                                  style={{
                                    fontSize: 11,
                                    fontWeight: 700,
                                    color: bar,
                                    minWidth: 30,
                                    textAlign: "right",
                                  }}
                                >
                                  {pct}%
                                </span>
                              </div>
                            </td>
                            <td style={{ padding: "12px 16px" }}>
                              <select
                                value={goal.status}
                                onChange={(e) =>
                                  handleStatusChange(goal.id, e.target.value)
                                }
                                style={{
                                  fontSize: 11,
                                  border: "1px solid #e5e5e5",
                                  borderRadius: 8,
                                  padding: "4px 8px",
                                  background: "#fff",
                                  cursor: "pointer",
                                  outline: "none",
                                }}
                              >
                                {STATUSES_LIST.map((s) => (
                                  <option key={s} value={s}>
                                    {STATUS_DISPLAY[s]}
                                  </option>
                                ))}
                              </select>
                            </td>
                            <td style={{ padding: "12px 16px" }}>
                              <div style={{ display: "flex", gap: 4 }}>
                                <button
                                  onClick={() => openEdit(goal)}
                                  style={{
                                    padding: "5px 7px",
                                    borderRadius: 8,
                                    border: "none",
                                    background: "transparent",
                                    cursor: "pointer",
                                    color: "#a3a3a3",
                                  }}
                                  onMouseEnter={(e) => {
                                    e.currentTarget.style.background = C.primaryBg;
                                    e.currentTarget.style.color = C.primary;
                                  }}
                                  onMouseLeave={(e) => {
                                    e.currentTarget.style.background = "transparent";
                                    e.currentTarget.style.color = "#a3a3a3";
                                  }}
                                >
                                  <EditIcon />
                                </button>
                                <button
                                  onClick={() => handleDelete(goal.id)}
                                  disabled={deletingId === goal.id}
                                  style={{
                                    padding: "5px 7px",
                                    borderRadius: 8,
                                    border: "none",
                                    background: "transparent",
                                    cursor:
                                      deletingId === goal.id
                                        ? "not-allowed"
                                        : "pointer",
                                    color: "#a3a3a3",
                                    display: "flex",
                                    alignItems: "center",
                                  }}
                                  onMouseEnter={(e) => {
                                    e.currentTarget.style.background = "#fff5f5";
                                    e.currentTarget.style.color = "#dc2626";
                                  }}
                                  onMouseLeave={(e) => {
                                    e.currentTarget.style.background = "transparent";
                                    e.currentTarget.style.color = "#a3a3a3";
                                  }}
                                >
                                  {deletingId === goal.id ? (
                                    <LoaderIcon />
                                  ) : (
                                    <TrashIcon />
                                  )}
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                )}
              </div>

              {/* ── PAGINATION — List view only ── */}
              {totalPages > 1 && (
                <div className="gv-pagination">
                  <button
                    disabled={currentPage === 1}
                    onClick={() => loadGoals(currentPage - 1)}
                    className="gv-page-item"
                  >
                    <ChevronLeftIcon />
                  </button>
                  {pageNumbers.map((num, idx) => (
                    <button
                      key={idx}
                      className={`gv-page-item ${num === currentPage ? "active" : ""} ${num === "..." ? "dots" : ""}`}
                      disabled={num === "..."}
                      onClick={() => {
                        if (num !== "...") loadGoals(Number(num));
                      }}
                    >
                      {num}
                    </button>
                  ))}
                  <button
                    disabled={currentPage === totalPages}
                    onClick={() => loadGoals(currentPage + 1)}
                    className="gv-page-item"
                  >
                    <ChevronRightIcon />
                  </button>
                </div>
              )}
            </>
          ))}
      </div>

      {/* ══ Create / Edit Modal ══ */}
      {activeModal && (
        <Modal onClose={closeModal}>
          <div className="gv-modal">
            {/* Header */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "20px 28px 16px",
                borderBottom: `1px solid ${C.primaryBord}`,
                flexShrink: 0,
              }}
            >
              <h2
                style={{
                  fontSize: 20,
                  fontWeight: 800,
                  color: "#171717",
                  margin: 0,
                }}
              >
                {activeModal === "create" ? "Add New Goal" : "Edit Goal"}
              </h2>
              <button
                onClick={closeModal}
                style={{
                  padding: 6,
                  borderRadius: 8,
                  border: "none",
                  background: "transparent",
                  cursor: "pointer",
                  color: "#737373",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#f5ede9";
                  e.currentTarget.style.color = C.primary;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.color = "#737373";
                }}
              >
                <CloseIcon />
              </button>
            </div>

            {/* Body */}
            <div
              className="gv-modal-body"
              style={{
                padding: "20px 28px",
                display: "flex",
                flexDirection: "column",
                gap: 16,
              }}
            >
              {saveError && (
                <div className="gv-error-banner">{saveError}</div>
              )}

              {/* Title */}
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: 13,
                    fontWeight: 600,
                    color: "#525252",
                    marginBottom: 6,
                  }}
                >
                  Goal Title <span style={{ color: "#dc2626" }}>*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Increase Revenue by 20%"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="gv-input"
                  autoFocus
                />
              </div>

              {/* Description */}
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: 13,
                    fontWeight: 600,
                    color: "#525252",
                    marginBottom: 6,
                  }}
                >
                  Description
                </label>
                <input
                  type="text"
                  placeholder="e.g. Build enterprise sales capability"
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                  className="gv-input"
                />
              </div>

              {/* Period + Status */}
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
                      fontSize: 13,
                      fontWeight: 600,
                      color: "#525252",
                      marginBottom: 6,
                    }}
                  >
                    Period
                  </label>
                  <select
                    value={form.period}
                    onChange={(e) =>
                      setForm({ ...form, period: e.target.value })
                    }
                    className="gv-select"
                  >
                    {PERIODS.filter((p) => p !== "All Periods").map((p) => (
                      <option key={p}>{p}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: 13,
                      fontWeight: 600,
                      color: "#525252",
                      marginBottom: 6,
                    }}
                  >
                    Status
                  </label>
                  <select
                    value={form.status}
                    onChange={(e) =>
                      setForm({ ...form, status: e.target.value })
                    }
                    className="gv-select"
                  >
                    {STATUSES_LIST.map((s) => (
                      <option key={s} value={s}>
                        {STATUS_DISPLAY[s]}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Owner + Target Date */}
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
                      fontSize: 13,
                      fontWeight: 600,
                      color: "#525252",
                      marginBottom: 6,
                    }}
                  >
                    Owner
                  </label>
                  <UserDropdown
                    value={form.owner_id}
                    onChange={(id, name) =>
                      setForm({
                        ...form,
                        owner_id: id,
                        owner: name || "Unassigned",
                      })
                    }
                    users={users}
                    placeholder="Search owner..."
                  />
                </div>
                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: 13,
                      fontWeight: 600,
                      color: "#525252",
                      marginBottom: 6,
                    }}
                  >
                    Target Date
                  </label>
                  <input
                    type="date"
                    value={
                      form.dueDate.includes("-") && form.dueDate.length === 10
                        ? form.dueDate
                        : parseDateToApi(form.dueDate)
                    }
                    onChange={(e) =>
                      setForm({ ...form, dueDate: e.target.value })
                    }
                    className="gv-input"
                  />
                </div>
              </div>

              {/* Target Value + Unit */}
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
                      fontSize: 13,
                      fontWeight: 600,
                      color: "#525252",
                      marginBottom: 6,
                    }}
                  >
                    Target Value
                  </label>
                  <input
                    type="number"
                    value={form.target}
                    onChange={(e) =>
                      setForm({ ...form, target: Number(e.target.value) })
                    }
                    className="gv-input"
                  />
                </div>
                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: 13,
                      fontWeight: 600,
                      color: "#525252",
                      marginBottom: 6,
                    }}
                  >
                    Unit
                  </label>
                  <select
                    value={form.unit}
                    onChange={(e) => setForm({ ...form, unit: e.target.value })}
                    className="gv-select"
                  >
                    {UNITS.map((u) => (
                      <option key={u}>{u}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Update Remarks */}
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: 13,
                    fontWeight: 600,
                    color: "#525252",
                    marginBottom: 6,
                  }}
                >
                  Update Remarks
                </label>
                <input
                  type="text"
                  placeholder="e.g. Interview pipeline is active"
                  value={form.update_remarks}
                  onChange={(e) =>
                    setForm({ ...form, update_remarks: e.target.value })
                  }
                  className="gv-input"
                />
              </div>

              {/* Progress slider */}
              <div
                style={{
                  background: "#fff",
                  borderRadius: 14,
                  padding: 16,
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
                      fontWeight: 600,
                      color: "#525252",
                    }}
                  >
                    Current Value / Progress
                  </label>
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 6 }}
                  >
                    <input
                      type="number"
                      value={form.current}
                      min={0}
                      max={form.target}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          current: Math.min(
                            Number(e.target.value),
                            Number(form.target)
                          ),
                        })
                      }
                      style={{
                        width: 60,
                        border: "1px solid #e5e5e5",
                        borderRadius: 8,
                        textAlign: "center",
                        padding: "4px 6px",
                        fontSize: 13,
                        outline: "none",
                      }}
                    />
                    <span style={{ fontSize: 13, color: "#737373" }}>
                      {form.unit}
                    </span>
                  </div>
                </div>
                <input
                  type="range"
                  min={0}
                  max={form.target || 100}
                  step={1}
                  value={form.current}
                  onChange={(e) =>
                    setForm({ ...form, current: Number(e.target.value) })
                  }
                  className="gv-slider"
                  style={{ background: modalSliderBg(getProgress(form)) }}
                />
                <div
                  style={{
                    background: C.primary,
                    color: "#fff",
                    fontWeight: 800,
                    textAlign: "center",
                    padding: "8px 0",
                    borderRadius: 10,
                    fontSize: 14,
                    marginTop: 12,
                  }}
                >
                  {getProgress(form)}%
                </div>
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
                background: C.primaryBg,
                flexShrink: 0,
              }}
            >
              <button
                onClick={closeModal}
                style={{
                  padding: "10px 20px",
                  fontSize: 14,
                  fontWeight: 700,
                  color: "#374151",
                  background: "#fff",
                  border: "1px solid #e5e5e5",
                  borderRadius: 12,
                  cursor: "pointer",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = "#f5f5f5")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = "#fff")
                }
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={!form.title.trim() || isSaving}
                style={{
                  padding: "10px 22px",
                  fontSize: 14,
                  fontWeight: 700,
                  color: "#fff",
                  background:
                    form.title.trim() && !isSaving ? C.primary : "#e5b5a3",
                  border: "none",
                  borderRadius: 12,
                  cursor:
                    form.title.trim() && !isSaving ? "pointer" : "not-allowed",
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                }}
                onMouseEnter={(e) => {
                  if (form.title.trim() && !isSaving)
                    e.currentTarget.style.background = C.primaryHov;
                }}
                onMouseLeave={(e) => {
                  if (form.title.trim() && !isSaving)
                    e.currentTarget.style.background = C.primary;
                }}
              >
                {isSaving && <LoaderIcon />}
                {isSaving
                  ? "Saving..."
                  : activeModal === "create"
                    ? "Add Goal"
                    : "Save Changes"}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
};