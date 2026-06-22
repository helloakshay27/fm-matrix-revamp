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
  pageBg: "#ffffff", // Changed to pure white
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

// ── API calls ──
const fetchGoalsPage = async (
  page: number,
  perPage: number
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

const fetchAllGoals = async (): Promise<Goal[]> => {
  const first = await fetchGoalsPage(1, 100);
  if (first.totalPages <= 1) return first.goals;
  const remaining = Array.from(
    { length: first.totalPages - 1 },
    (_, i) => i + 2
  );
  const rest = await Promise.all(remaining.map((p) => fetchGoalsPage(p, 100)));
  return [...first.goals, ...rest.flatMap((r) => r.goals)];
};

const fetchGoalsFromApi = async (page: number = 1, perPage: number = 20) =>
  fetchGoalsPage(page, perPage);

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
    throw new Error(`PATCH status error ${res.status}: ${t || res.statusText}`);
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
  <svg style={{ width: 16, height: 16 }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
  </svg>
);
const SearchIcon = () => (
  <svg style={{ width: 15, height: 15, color: "#9ca3af" }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);
const UserIcon = () => (
  <svg style={{ width: 13, height: 13 }} fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
  </svg>
);
const EditIcon = () => (
  <svg style={{ width: 14, height: 14 }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
  </svg>
);
const TrashIcon = () => (
  <svg style={{ width: 14, height: 14 }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
  </svg>
);
const TargetIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <circle cx="12" cy="12" r="6" />
    <circle cx="12" cy="12" r="2" />
  </svg>
);
const CheckCircleIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <path d="M22 4L12 14.01l-3-3" />
  </svg>
);
const TrendingUpIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
    <polyline points="17 6 23 6 23 12" />
  </svg>
);
const ExclamationCircleIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="8" x2="12" y2="12" />
    <line x1="12" y1="16" x2="12.01" y2="16" />
  </svg>
);
const ClockIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);
const ListIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <line x1="8" y1="6" x2="21" y2="6" />
    <line x1="8" y1="12" x2="21" y2="12" />
    <line x1="8" y1="18" x2="21" y2="18" />
    <line x1="3" y1="6" x2="3.01" y2="6" />
    <line x1="3" y1="12" x2="3.01" y2="12" />
    <line x1="3" y1="18" x2="3.01" y2="18" />
  </svg>
);
const KanbanIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <rect x="3" y="3" width="6" height="18" rx="1" />
    <rect x="15" y="3" width="6" height="12" rx="1" />
  </svg>
);
const CloseIcon = () => (
  <svg style={{ width: 16, height: 16 }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
  </svg>
);
const LoaderIcon = () => (
  <svg style={{ width: 16, height: 16, animation: "gv-spin 0.8s linear infinite", display: "inline-block" }} fill="none" viewBox="0 0 24 24">
    <circle style={{ opacity: 0.25 }} cx="12" cy="12" r="10" stroke="currentColor" strokeWidth={4} />
    <path style={{ opacity: 0.75 }} fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
  </svg>
);
const ChevronLeftIcon = () => (
  <svg style={{ width: 14, height: 14 }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
  </svg>
);
const ChevronRightIcon = () => (
  <svg style={{ width: 14, height: 14 }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
  </svg>
);

// ── Global styles ──
const Styles = () => (
  <style>{`
    @keyframes gv-spin { to { transform: rotate(360deg); } }
    .gv-overlay {
      position: fixed; inset: 0; z-index: 99999;
      display: flex; align-items: center; justify-content: center;
      padding: 16px; background: rgba(0,0,0,0.5); backdrop-filter: blur(4px);
    }
    
    /* MODAL STYLES */
    .gv-modal {
      background: #ffffff; border-radius: 24px;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
      width: 100%; max-width: 580px;
      display: flex; flex-direction: column; max-height: 90vh; overflow: hidden;
      border: none;
    }
    .gv-modal-body { overflow-y: auto; flex: 1; }
    
    .gv-input, .gv-select {
      width: 100%; border: 1px solid #e5e7eb; border-radius: 12px;
      padding: 12px 16px; font-size: 14px; color: #111827; font-weight: 600;
      background: #fafafa; box-sizing: border-box; outline: none; font-family: inherit;
      transition: all 0.2s ease;
    }
    .gv-select {
      appearance: none; -webkit-appearance: none;
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23a3a3a3'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E");
      background-repeat: no-repeat; background-position: right 14px center;
      background-size: 16px; cursor: pointer; padding-right: 40px;
    }
    .gv-input:focus, .gv-select:focus { 
      background: #ffffff; border-color: ${C.primary}; 
      box-shadow: 0 0 0 4px ${C.primaryTint}; 
    }
    .gv-input::placeholder { color: #9ca3af; font-weight: 500; }
    .gv-input.error, .gv-select.error { border-color: #fca5a5 !important; box-shadow: 0 0 0 4px rgba(252,165,165,0.15) !important; background: #fff5f5; }
    
    .gv-label {
      display: block; font-size: 11px; font-weight: 800; color: #6b7280; 
      margin-bottom: 8px; text-transform: uppercase; letter-spacing: 0.05em;
    }
    .gv-field-error { font-size: 12px; color: #ef4444; font-weight: 600; margin-top: 6px; }
    
    /* SLIDER */
    .gv-slider {
      -webkit-appearance: none; appearance: none;
      width: 100%; height: 6px; border-radius: 99px; outline: none; cursor: pointer;
    }
    .gv-slider::-webkit-slider-thumb {
      -webkit-appearance: none; width: 20px; height: 20px;
      border-radius: 50%; background: ${C.primary}; cursor: pointer;
      border: 3px solid white; box-shadow: 0 2px 6px rgba(0,0,0,0.25);
    }
    
    /* DROPDOWN */
    .gv-user-dropdown {
      position: absolute; left: 0; right: 0; margin-top: 6px;
      background: #fff; border: 1px solid #e5e7eb; border-radius: 12px;
      box-shadow: 0 10px 25px -5px rgba(0,0,0,0.10); max-height: 220px;
      overflow-y: auto; overflow-x: hidden; z-index: 99999;
    }
    .gv-user-option {
      padding: 10px 14px; font-size: 13px; cursor: pointer;
      border-bottom: 1px solid #f9fafb; color: #374151;
      display: flex; align-items: center; gap: 10px; font-weight: 600;
      transition: background 0.15s;
    }
    .gv-user-option:last-child { border-bottom: none; }
    .gv-user-option:hover { background: #fef6f4; color: ${C.primaryHov}; }
    .gv-user-option.clear { color: #ef4444; font-weight: 700; }
    .gv-user-option.clear:hover { background: #fef2f2; }
    .gv-user-avatar {
      width: 26px; height: 26px; border-radius: 50%;
      background: ${C.primaryTint}; color: ${C.primary};
      display: flex; align-items: center; justify-content: center;
      font-size: 10px; font-weight: 800; flex-shrink: 0;
    }

    /* KANBAN / LIST STYLES */
    .gv-kanban-card { transition: opacity 0.15s, transform 0.15s; cursor: grab; }
    .gv-kanban-card:active { cursor: grabbing; }
    .gv-kanban-card.dragging { opacity: 0.4; transform: scale(0.97) rotate(2deg); }
    .gv-col-zone {
      border-radius: 12px; min-height: 520px; padding-bottom: 20px;
      transition: background 0.15s, border-color 0.15s;
    }
    .gv-col-zone.drag-over { background: #fafafa !important; border: 2px dashed ${C.primary} !important; border-radius: 12px;}
    .gv-error-banner { background: #fee2e2; border: 1px solid #fca5a5; color: #991b1b; border-radius: 10px; padding: 10px 14px; font-size: 13px; font-weight: 600; }
    .gv-skeleton { background: linear-gradient(90deg, #f3f4f6 25%, #e9eaec 50%, #f3f4f6 75%); background-size: 200% 100%; animation: gv-shimmer 1.4s infinite; border-radius: 10px; }
    @keyframes gv-shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }
    .gv-pagination {
      display: flex; align-items: center; justify-content: center;
      gap: 6px; margin-top: 24px; padding: 16px;
    }
    .gv-page-item {
      display: flex; align-items: center; justify-content: center;
      min-width: 32px; height: 32px; padding: 0 8px;
      border-radius: 8px; font-size: 13px; font-weight: 700;
      color: #4b5563; background: transparent; border: none;
      cursor: pointer; transition: all 0.2s ease;
    }
    .gv-page-item:hover:not(:disabled):not(.dots) { background: #f3f4f6; color: #111827; }
    .gv-page-item.active { background: ${C.primary}; color: #fff; }
    .gv-page-item:disabled { color: #9ca3af; cursor: not-allowed; }
    .gv-page-item.dots { cursor: default; background: transparent; color: #9ca3af; }

    /* Top bar standard search box */
    .gv-top-search {
      width: 100%; border: 1px solid #e5e7eb; border-radius: 10px;
      padding: 9px 12px 9px 36px; font-size: 13px; color: #111827; font-weight: 600;
      background: #fff; box-sizing: border-box; outline: none; font-family: inherit;
      transition: all 0.2s ease;
    }
    .gv-top-search:focus {
      border-color: ${C.primary}; box-shadow: 0 0 0 3px ${C.primaryTint};
    }
    .gv-top-select {
      width: 100%; border: 1px solid #e5e7eb; border-radius: 10px;
      padding: 9px 32px 9px 12px; font-size: 13px; color: #4b5563; font-weight: 600;
      background: #fff; appearance: none; -webkit-appearance: none;
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23a3a3a3'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E");
      background-repeat: no-repeat; background-position: right 10px center;
      background-size: 14px; cursor: pointer; box-sizing: border-box; outline: none;
      transition: all 0.2s ease;
    }
    .gv-top-select:focus {
      border-color: ${C.primary}; box-shadow: 0 0 0 3px ${C.primaryTint};
    }
    @media (max-width: 640px) {
      .gv-page-root {
        padding: 12px !important;
        border-radius: 14px !important;
        overflow-x: hidden;
      }
      .gv-stat-grid {
        grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
        gap: 10px !important;
        margin-bottom: 16px !important;
      }
      .gv-stat-card {
        height: 78px !important;
        padding: 10px !important;
      }
      .gv-filter-row {
        align-items: stretch !important;
        margin-bottom: 16px !important;
      }
      .gv-filter-controls,
      .gv-filter-actions {
        width: 100%;
      }
      .gv-filter-controls > *,
      .gv-filter-actions > * {
        width: 100%;
        max-width: 100%;
      }
      .gv-filter-actions {
        gap: 12px !important;
        justify-content: space-between !important;
      }
      .gv-filter-actions > button {
        justify-content: center;
      }
      .gv-top-search,
      .gv-top-select {
        width: 100% !important;
        min-width: 0 !important;
      }
      .gv-kanban-grid {
        grid-template-columns: 1fr !important;
        gap: 12px !important;
      }
      .gv-kanban-column {
        padding: 12px !important;
      }
      .gv-col-zone {
        min-height: 96px;
        padding-bottom: 4px;
      }
      .gv-kanban-card {
        height: auto !important;
        min-height: 150px;
      }
      .gv-list-shell {
        overflow-x: auto !important;
        max-width: 100%;
      }
      .gv-list-shell table {
        min-width: 760px;
      }
      .gv-pagination {
        overflow-x: auto;
        justify-content: flex-start;
        padding: 12px 4px;
      }
      .gv-modal {
        width: 100vw;
        max-width: none;
        min-height: 100dvh;
        max-height: 100dvh;
        border-radius: 0;
      }
      .gv-overlay {
        padding: 0;
      }
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
          right: 14,
          top: "50%",
          transform: "translateY(-50%)",
          pointerEvents: "none",
          color: "#9ca3af",
        }}
      >
        <svg style={{ width: 16, height: 16 }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
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
            <div style={{ padding: "16px", fontSize: 13, color: "#9ca3af", textAlign: "center", fontWeight: 600 }}>
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

// ── Columns Config (Exactly matching Screenshot) ──
const COLUMNS = [
  {
    key: "not_started",
    label: "Not Started",
    icon: <ClockIcon />,
    hText: "#4b5563",
    cntBg: "#e5e7eb",
    cntText: "#374151",
  },
  {
    key: "on_track",
    label: "On Track",
    icon: <TrendingUpIcon />,
    hText: "#047857",
    cntBg: "#d1fae5",
    cntText: "#047857",
  },
  {
    key: "achieved",
    label: "Achieved",
    icon: <CheckCircleIcon />,
    hText: "#047857",
    cntBg: "#d1fae5",
    cntText: "#047857",
  },
  {
    key: "behind",
    label: "Behind",
    icon: <ExclamationCircleIcon />,
    hText: "#dc2626",
    cntBg: "#fee2e2",
    cntText: "#dc2626",
  },
];

const PERIODS = ["All periods", "This Quarter", "This Year", "3-5 Years", "BHAG"];
const STATUSES_LIST = ["not_started", "on_track", "achieved", "behind"];
const UNITS = ["%", "Days", "Amount", "Count"];

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

const getBarColor = (period: string) => C.primary;

// ── Validation ──
interface FormErrors {
  title?: string;
  period?: string;
  unit?: string;
  target?: string;
}

const validateForm = (form: GoalFormState): FormErrors => {
  const errors: FormErrors = {};
  if (!form.title.trim()) errors.title = "Goal title is required.";
  if (!form.period || form.period === "All periods") errors.period = "Period is required.";
  if (!form.unit) errors.unit = "Unit is required.";
  const targetNum = Number(form.target);
  if (!form.target && form.target !== 0) errors.target = "Target value is required.";
  else if (isNaN(targetNum) || targetNum === 0) errors.target = "Target value cannot be zero.";
  else if (targetNum < 0) errors.target = "Target value must be positive.";
  return errors;
};

// ── Goal Card (Kanban) matching screenshot & fixed size ──
const GoalCard = ({
  goal,
  onEdit,
  onDelete,
  dragHandlers,
  isDeleting,
}: {
  goal: Goal;
  onEdit: (g: Goal) => void;
  onDelete: (id: number) => void;
  dragHandlers: any;
  isDeleting: boolean;
}) => {
  const pct = getProgress(goal);
  const displayCurrent = Number.isInteger(Number(goal.current))
    ? Number(goal.current)
    : Number(goal.current).toFixed(2);

  return (
    <div
      id={`gcard-${goal.id}`}
      style={{ width: "100%" }}
    >
      <div
        className="gv-kanban-card"
        style={{
          width: "100%",
          boxSizing: "border-box",
          background: "#fff",
          borderRadius: "12px",
          border: "1px dashed #d1d5db",
          padding: "16px",
          marginBottom: "12px",
          opacity: isDeleting ? 0.4 : 1,
          display: "flex",
          flexDirection: "column",
          height: "180px",
        }}
        draggable
        onDragStart={(e) => dragHandlers.onDragStart(e, goal.id)}
        onDragEnd={dragHandlers.onDragEnd}
      >
        <p
          style={{
            fontSize: "13px",
            fontWeight: 600,
            color: "#111827",
            lineHeight: "1.4",
            margin: "0 0 12px 0",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
          title={goal.title}
        >
          {goal.title}
        </p>

        <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "#6b7280", fontSize: "12px", marginBottom: "16px" }}>
          <UserIcon /> {goal.owner === "Unassigned" || !goal.owner ? "Unassigned" : goal.owner}
        </div>

        {/* Flat Progress Line */}
        <div style={{ height: "4px", background: "#f3f4f6", borderRadius: "4px", overflow: "hidden", marginBottom: "8px" }}>
          <div style={{ height: "100%", width: `${pct}%`, background: C.primary, borderRadius: "4px" }} />
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", color: "#6b7280", marginBottom: "16px", fontWeight: 500 }}>
          <span>{displayCurrent}/{goal.target}</span>
          <span>{pct}%</span>
        </div>

        {/* Pushed to Bottom */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "auto" }}>
          <button
            onClick={() => onEdit(goal)}
            style={{ background: "none", border: "none", color: "#9ca3af", cursor: "pointer", padding: 0 }}
            onMouseEnter={(e) => e.currentTarget.style.color = C.primary}
            onMouseLeave={(e) => e.currentTarget.style.color = "#9ca3af"}
          >
            <EditIcon />
          </button>
          <button
            onClick={() => onDelete(goal.id)}
            disabled={isDeleting}
            style={{ background: "none", border: "none", color: "#9ca3af", cursor: isDeleting ? "not-allowed" : "pointer", padding: 0 }}
            onMouseEnter={(e) => { if (!isDeleting) e.currentTarget.style.color = "#dc2626"; }}
            onMouseLeave={(e) => { if (!isDeleting) e.currentTarget.style.color = "#9ca3af"; }}
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
  const [kanbanGoals, setKanbanGoals] = useState<Goal[]>([]);
  const [listGoals, setListGoals] = useState<Goal[]>([]);
  const [users, setUsers] = useState<UserRecord[]>([]);
  const [isFetchingKanban, setIsFetchingKanban] = useState(true);
  const [isFetchingList, setIsFetchingList] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [view, setView] = useState<"kanban" | "list">("kanban");
  const [search, setSearch] = useState("");
  const [filterPeriod, setFilterPeriod] = useState("All periods");
  const [filterOwner, setFilterOwner] = useState("All owners");
  const [activeModal, setActiveModal] = useState<"create" | "edit" | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const perPage = 20;

  const [form, setForm] = useState<GoalFormState>(EMPTY_FORM);
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [dragOverCol, setDragOverCol] = useState<string | null>(null);
  const progressTimers = useRef<Record<number, ReturnType<typeof setTimeout>>>({});
  const dragId = useRef<number | null>(null);

  const loadKanbanGoals = useCallback(async () => {
    setIsFetchingKanban(true);
    setFetchError(null);
    try {
      const all = await fetchAllGoals();
      setKanbanGoals(all);
    } catch (err: any) {
      setFetchError(err.message || "Failed to load goals.");
    } finally {
      setIsFetchingKanban(false);
    }
  }, []);

  const loadListGoals = useCallback(
    async (page: number = 1) => {
      setIsFetchingList(true);
      setFetchError(null);
      try {
        const data = await fetchGoalsFromApi(page, perPage);
        setListGoals(data.goals);
        setTotalPages(data.totalPages);
        setCurrentPage(page);
      } catch (err: any) {
        setFetchError(err.message || "Failed to load goals.");
      } finally {
        setIsFetchingList(false);
      }
    },
    [perPage]
  );

  useEffect(() => {
    loadKanbanGoals();
    fetchUsersFromApi()
      .then(setUsers)
      .catch(() => { });
  }, [loadKanbanGoals]);

  useEffect(() => {
    if (view === "list") loadListGoals(1);
  }, [view]); // eslint-disable-line

  const closeModal = () => {
    setActiveModal(null);
    setForm(EMPTY_FORM);
    setFormErrors({});
    setEditingId(null);
  };

  const ownerNames = Array.from(new Set(kanbanGoals.map((g) => g.owner)));
  const ownerFilterOptions = ["All owners", ...ownerNames];

  const filtered = kanbanGoals.filter((g) => {
    const ms = g.title.toLowerCase().includes(search.toLowerCase());
    const mp = filterPeriod === "All periods" || g.period === filterPeriod;
    const mo = filterOwner === "All owners" || g.owner === filterOwner;
    return ms && mp && mo;
  });

  const statsSource = kanbanGoals.filter((g) => {
    const ms = g.title.toLowerCase().includes(search.toLowerCase());
    const mp = filterPeriod === "All periods" || g.period === filterPeriod;
    const mo = filterOwner === "All owners" || g.owner === filterOwner;
    return ms && mp && mo;
  });

  const total = statsSource.length;
  const achieved = statsSource.filter((g) => g.status === "achieved").length;
  const onTrack = statsSource.filter((g) => g.status === "on_track").length;
  const behind = statsSource.filter((g) => g.status === "behind").length;

  const openCreate = () => {
    setForm(EMPTY_FORM);
    setFormErrors({});
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
    setFormErrors({});
    setEditingId(goal.id);
    setActiveModal("edit");
  };

  const reloadAfterMutation = () => {
    loadKanbanGoals();
    if (view === "list") loadListGoals(currentPage);
  };

  const handleDelete = async (id: number) => {
    setDeletingId(id);
    try {
      await deleteGoalFromApi(id);
      toast.success("Goal deleted successfully!", { icon: false });
      reloadAfterMutation();
    } catch (err: any) {
      toast.error(err.message || "Failed to delete goal.", { icon: false });
      setFetchError(err.message || "Failed to delete goal.");
    } finally {
      setDeletingId(null);
    }
  };

  const handleProgressChange = (id: number, val: number) => {
    if (view === "kanban") {
      setKanbanGoals((prev) =>
        prev.map((g) => (g.id === id ? { ...g, current: val } : g))
      );
    } else {
      setListGoals((prev) =>
        prev.map((g) => (g.id === id ? { ...g, current: val } : g))
      );
    }
    if (progressTimers.current[id]) clearTimeout(progressTimers.current[id]);
    progressTimers.current[id] = setTimeout(async () => {
      try {
        await patchGoalProgressInApi(id, val);
      } catch (err: any) {
        console.error("[Goals] PATCH progress error:", err);
      }
    }, 600);
  };

  const handleStatusChange = async (id: number, status: string, fromDrag = false) => {
    const prevKanban = kanbanGoals.find((g) => g.id === id);
    const prevList = listGoals.find((g) => g.id === id);

    setKanbanGoals((prev) => prev.map((g) => (g.id === id ? { ...g, status } : g)));
    setListGoals((prev) => prev.map((g) => (g.id === id ? { ...g, status } : g)));

    const label = STATUS_DISPLAY[status] || status;
    if (fromDrag) {
      toast(`Goal moved to "${label}"`, { icon: false });
    } else {
      toast(`Status changed to "${label}"`, { icon: false });
    }

    try {
      await patchGoalStatusInApi(id, status);
    } catch (err: any) {
      console.error("[Goals] PATCH status error:", err);
      toast.error("Failed to update status. Reverting...", { icon: false });
      if (prevKanban) setKanbanGoals((prev) => prev.map((g) => g.id === id ? { ...g, status: prevKanban.status } : g));
      if (prevList) setListGoals((prev) => prev.map((g) => (g.id === id ? { ...g, status: prevList.status } : g)));
    }
  };

  const handleSave = async () => {
    const errors = validateForm(form);
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      const firstErr = Object.values(errors)[0];
      toast.error(firstErr!, { icon: false });
      return;
    }
    setFormErrors({});
    setIsSaving(true);
    try {
      if (activeModal === "create") {
        await createGoalInApi(form);
        toast.success("Goal created successfully!", { icon: false });
        closeModal();
        reloadAfterMutation();
      } else if (editingId !== null) {
        await updateGoalInApi(editingId, form);
        toast.success("Goal updated successfully!", { icon: false });
        closeModal();
        reloadAfterMutation();
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to save. Please try again.", { icon: false });
    } finally {
      setIsSaving(false);
    }
  };

  const updateForm = (field: keyof GoalFormState, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (formErrors[field as keyof FormErrors]) {
      setFormErrors((prev) => {
        const n = { ...prev };
        delete n[field as keyof FormErrors];
        return n;
      });
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
    if (e.relatedTarget && (e.currentTarget as HTMLElement).contains(e.relatedTarget as Node)) return;
    setDragOverCol(null);
  };
  const handleDrop = (e: React.DragEvent, colKey: string) => {
    e.preventDefault();
    if (dragId.current == null) return;
    const id = dragId.current;
    const goal = kanbanGoals.find((g) => g.id === id);
    if (goal && goal.status !== colKey) {
      handleStatusChange(id, colKey, true);
    }
    setDragOverCol(null);
    dragId.current = null;
  };

  const modalSliderBg = (pct: number) => `linear-gradient(to right, ${C.primary} ${pct}%, #e5e7eb ${pct}%)`;

  const stats = [
    { label: "Total Goals", value: total, icon: <TargetIcon />, bg: "#f3f4f8", textColor: "#4b5563" },
    { label: "Achieved", value: achieved, icon: <CheckCircleIcon />, bg: "#e1efe3", textColor: "#4b5563" },
    { label: "On Track", value: onTrack, icon: <TrendingUpIcon />, bg: "#dfecf6", textColor: "#4b5563" },
    { label: "Behind", value: behind, icon: <ExclamationCircleIcon />, bg: "#f6dfde", textColor: "#4b5563" },
  ];

  const getPageNumbers = (current: number, total: number): (number | string)[] => {
    if (total <= 5) return Array.from({ length: total }, (_, i) => i + 1);
    if (current <= 3) return [1, 2, 3, "...", total];
    if (current >= total - 2) return [1, "...", total - 2, total - 1, total];
    return [1, "...", current, "...", total];
  };
  const pageNumbers = getPageNumbers(currentPage, totalPages);

  return (
    <div className="gv-page-root" style={{ background: C.pageBg, padding: "24px", borderRadius: "16px" }}>
      <Styles />

      {fetchError && (
        <div className="gv-error-banner" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
          <span>⚠ {fetchError}</span>
          <button
            onClick={() => view === "kanban" ? loadKanbanGoals() : loadListGoals(currentPage)}
            style={{ background: "none", border: "none", cursor: "pointer", textDecoration: "underline", fontSize: 13, fontWeight: 600, color: "#991b1b" }}
          >
            Retry
          </button>
        </div>
      )}

      {/* ── Stat cards ── */}
      <div className="gv-stat-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 28 }}>
        {isFetchingKanban
          ? [1, 2, 3, 4].map((n) => <div key={n} className="gv-skeleton" style={{ height: 100, borderRadius: 16 }} />)
          : stats.map((s) => (
            <div
              key={s.label}
              className="gv-stat-card"
              style={{
                background: s.bg,
                borderRadius: 16,
                padding: "16px 20px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                gap: 6,
                height: "100px",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "6px", color: s.textColor, fontSize: "12px", fontWeight: 600 }}>
                {s.icon} {s.label}
              </div>
              <p style={{ fontSize: 24, fontWeight: 800, color: "#111827", margin: 0, lineHeight: 1 }}>
                {s.value}
              </p>
            </div>
          ))}
      </div>

      {/* ── Filters & Toggle ── */}
      <div className="gv-filter-row" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24, flexWrap: "wrap", gap: 12 }}>
        <div className="gv-filter-controls" style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          {/* Search */}
          <div style={{ position: "relative" }}>
            <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)" }}>
              <SearchIcon />
            </span>
            <input
              type="text"
              placeholder="Search goals..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="gv-top-search"
              style={{ minWidth: 240 }}
            />
          </div>
          <select value={filterPeriod} onChange={(e) => setFilterPeriod(e.target.value)} className="gv-top-select" style={{ width: 150 }}>
            {PERIODS.map((p) => <option key={p}>{p}</option>)}
          </select>
          <select value={filterOwner} onChange={(e) => setFilterOwner(e.target.value)} className="gv-top-select" style={{ width: 150 }}>
            {ownerFilterOptions.map((o) => <option key={o}>{o}</option>)}
          </select>
        </div>

        <div className="gv-filter-actions" style={{ display: "flex", alignItems: "center", gap: 20 }}>
          {/* View Toggle */}
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 4, color: view === "list" ? "#111827" : "#9ca3af", fontSize: 13, fontWeight: 700 }}>
              <ListIcon /> List
            </div>
            <div
              onClick={() => setView(view === "kanban" ? "list" : "kanban")}
              style={{
                width: 44, height: 24, borderRadius: 24,
                background: view === "kanban" ? C.primary : "#d1d5db",
                position: "relative", cursor: "pointer", transition: "0.2s"
              }}
            >
              <div style={{
                width: 18, height: 18, background: "#fff", borderRadius: "50%",
                position: "absolute", top: 3, left: view === "kanban" ? 23 : 3, transition: "0.2s"
              }} />
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 4, color: view === "kanban" ? "#111827" : "#9ca3af", fontSize: 13, fontWeight: 700 }}>
              <KanbanIcon /> Kanban
            </div>
          </div>
          {/* Add Goal Button */}
          <button
            onClick={openCreate}
            style={{
              padding: "10px 20px", background: C.primary, color: "#fff", border: "none",
              borderRadius: 12, fontSize: 13, fontWeight: 700, cursor: "pointer",
              boxShadow: "0 2px 6px rgba(218,119,86,0.25)", display: "flex", alignItems: "center", gap: 6
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = C.primaryHov}
            onMouseLeave={(e) => e.currentTarget.style.background = C.primary}
          >
            <PlusIcon /> Add Goal
          </button>
        </div>
      </div>

      {/* ── KANBAN VIEW ── */}
      {view === "kanban" &&
        (isFetchingKanban ? (
          <div className="gv-kanban-grid" style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 16 }}>
            {[1, 2, 3, 4].map((n) => <div key={n} className="gv-skeleton" style={{ height: 300, borderRadius: 12 }} />)}
          </div>
        ) : (
          <div className="gv-kanban-grid" style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 16 }}>
            {COLUMNS.map((col) => {
              const colGoals = filtered.filter((g) => g.status === col.key);
              const isOver = dragOverCol === col.key;
              return (
                <div key={col.key} className="gv-kanban-column" style={{ background: "#f3f4f6", borderRadius: "16px", padding: "16px 12px" }}>
                  <div
                    style={{
                      display: "flex", alignItems: "center", justifyContent: "space-between",
                      marginBottom: "16px", color: col.hText
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "14px", fontWeight: 800 }}>
                      {col.icon} {col.label}
                    </div>
                    <span
                      style={{
                        fontSize: "12px", fontWeight: 700, minWidth: "20px", textAlign: "center",
                        borderRadius: "50%", padding: "2px 6px", background: col.cntBg, color: col.cntText,
                      }}
                    >
                      {colGoals.length}
                    </span>
                  </div>

                  <div
                    className={`gv-col-zone${isOver ? " drag-over" : ""}`}
                    onDragOver={(e) => handleDragOver(e, col.key)}
                    onDragLeave={handleDragLeave}
                    onDrop={(e) => handleDrop(e, col.key)}
                  >
                    {colGoals.length === 0 && (
                      <div
                        style={{
                          width: "100%",
                          boxSizing: "border-box",
                          border: `1px dashed #d1d5db`, borderRadius: 12, height: 80,
                          display: "flex", alignItems: "center", justifyContent: "center",
                          marginBottom: 8, background: "transparent"
                        }}
                      >
                        <p style={{ fontSize: 13, color: "#9ca3af", margin: 0, fontWeight: 600 }}>No goals here</p>
                      </div>
                    )}
                    {colGoals.map((goal) => (
                      <GoalCard
                        key={goal.id}
                        goal={goal}
                        onEdit={openEdit}
                        onDelete={handleDelete}
                        dragHandlers={dragHandlers}
                        isDeleting={deletingId === goal.id}
                      />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        ))}

      {/* ── LIST VIEW ── */}
      {view === "list" &&
        (isFetchingList ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {[1, 2, 3, 4, 5].map((n) => <div key={n} className="gv-skeleton" style={{ height: 52, borderRadius: 10 }} />)}
          </div>
        ) : (
          <>
            <div className="gv-list-shell" style={{ background: "#fff", borderRadius: 12, border: "1px solid #e5e7eb", overflow: "hidden", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
              {listGoals.length === 0 ? (
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "64px 16px", textAlign: "center" }}>
                  <h3 style={{ fontSize: 16, fontWeight: 700, color: "#171717", margin: "0 0 6px" }}>No goals found</h3>
                  <p style={{ fontSize: 13, color: "#737373", margin: "0 0 16px" }}>Try adjusting your filters.</p>
                </div>
              ) : (
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                  <thead>
                    <tr style={{ borderBottom: "1px solid #e5e7eb", background: "#f9fafb" }}>
                      {["Goal", "Period", "Owner", "Progress", "Status", ""].map((h, i) => (
                        <th key={i} style={{ textAlign: "left", padding: "14px 16px", fontSize: 11, fontWeight: 700, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.05em" }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {listGoals.map((goal) => {
                      const pct = getProgress(goal);
                      const bar = getBarColor(goal.period);
                      return (
                        <tr key={goal.id} style={{ borderBottom: "1px solid #f3f4f6", opacity: deletingId === goal.id ? 0.4 : 1, transition: "background 0.2s" }} onMouseEnter={(e) => e.currentTarget.style.background = "#fafafa"} onMouseLeave={(e) => e.currentTarget.style.background = "#fff"}>
                          <td style={{ padding: "14px 16px", fontWeight: 600, color: "#111827", maxWidth: 220 }}>
                            <p style={{ margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{goal.title}</p>
                          </td>
                          <td style={{ padding: "14px 16px", whiteSpace: "nowrap" }}>
                            <span style={{ fontSize: 12, fontWeight: 600, color: "#6b7280" }}>{goal.period}</span>
                          </td>
                          <td style={{ padding: "14px 16px", color: "#6b7280", whiteSpace: "nowrap", fontSize: 12, fontWeight: 500 }}>{goal.owner}</td>
                          <td style={{ padding: "14px 16px", minWidth: 160 }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                              <div style={{ height: "6px", background: "#e5e7eb", borderRadius: "99px", overflow: "hidden", flex: 1 }}>
                                <div style={{ height: "100%", width: `${pct}%`, background: bar, borderRadius: "99px" }} />
                              </div>
                              <span style={{ fontSize: 12, fontWeight: 700, color: bar, minWidth: 36, textAlign: "right" }}>{pct}%</span>
                            </div>
                          </td>
                          <td style={{ padding: "14px 16px" }}>
                            <select
                              value={goal.status}
                              onChange={(e) => handleStatusChange(goal.id, e.target.value)}
                              style={{ fontSize: 12, border: "1px solid #d1d5db", borderRadius: 8, padding: "6px 10px", background: "#fff", cursor: "pointer", outline: "none", fontWeight: 600, color: "#374151" }}
                            >
                              {STATUSES_LIST.map((s) => <option key={s} value={s}>{STATUS_DISPLAY[s]}</option>)}
                            </select>
                          </td>
                          <td style={{ padding: "14px 16px" }}>
                            <div style={{ display: "flex", gap: 6, justifyContent: "flex-end" }}>
                              <button onClick={() => openEdit(goal)} style={{ padding: "6px", borderRadius: 8, border: "none", background: "#f3f4f6", cursor: "pointer", color: "#6b7280", transition: "0.2s" }} onMouseEnter={(e) => { e.currentTarget.style.color = C.primary; e.currentTarget.style.background = C.primaryTint; }} onMouseLeave={(e) => { e.currentTarget.style.color = "#6b7280"; e.currentTarget.style.background = "#f3f4f6"; }}><EditIcon /></button>
                              <button onClick={() => handleDelete(goal.id)} disabled={deletingId === goal.id} style={{ padding: "6px", borderRadius: 8, border: "none", background: "#f3f4f6", cursor: deletingId === goal.id ? "not-allowed" : "pointer", color: "#6b7280", transition: "0.2s" }} onMouseEnter={(e) => { if (!deletingId) { e.currentTarget.style.color = "#ef4444"; e.currentTarget.style.background = "#fee2e2"; } }} onMouseLeave={(e) => { if (!deletingId) { e.currentTarget.style.color = "#6b7280"; e.currentTarget.style.background = "#f3f4f6"; } }}>
                                {deletingId === goal.id ? <LoaderIcon /> : <TrashIcon />}
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
            {totalPages > 1 && (
              <div className="gv-pagination">
                <button disabled={currentPage === 1} onClick={() => loadListGoals(currentPage - 1)} className="gv-page-item"><ChevronLeftIcon /></button>
                {pageNumbers.map((num, idx) => (
                  <button key={idx} className={`gv-page-item ${num === currentPage ? "active" : ""} ${num === "..." ? "dots" : ""}`} disabled={num === "..."} onClick={() => { if (num !== "...") loadListGoals(Number(num)); }}>{num}</button>
                ))}
                <button disabled={currentPage === totalPages} onClick={() => loadListGoals(currentPage + 1)} className="gv-page-item"><ChevronRightIcon /></button>
              </div>
            )}
          </>
        ))}

      {/* ══ Create / Edit Modal ══ */}
      {activeModal && (
        <Modal onClose={closeModal}>
          <div className="gv-modal">
            {/* Header */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 28px 16px", background: "#fff" }}>
              <h2 style={{ fontSize: 20, fontWeight: 800, color: "#111827", margin: 0 }}>
                {activeModal === "create" ? "Add New Goal" : "Edit Goal"}
              </h2>
              <button
                onClick={closeModal}
                style={{
                  width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center",
                  borderRadius: "50%", border: "none", background: "#f3f4f6", cursor: "pointer",
                  color: "#6b7280", transition: "all 0.2s ease"
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = "#fee2e2"; e.currentTarget.style.color = "#ef4444"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "#f3f4f6"; e.currentTarget.style.color = "#6b7280"; }}
              >
                <CloseIcon />
              </button>
            </div>

            {/* Body */}
            <div className="gv-modal-body" style={{ padding: "16px 28px 24px", display: "flex", flexDirection: "column", gap: 20, background: "#fff" }}>

              {/* Title */}
              <div>
                <label className="gv-label">Goal Title <span style={{ color: "#ef4444" }}>*</span></label>
                <input type="text" placeholder="e.g. Increase Revenue by 20%" value={form.title} onChange={(e) => updateForm("title", e.target.value)} className={`gv-input${formErrors.title ? " error" : ""}`} autoFocus />
                {formErrors.title && <p className="gv-field-error">{formErrors.title}</p>}
              </div>

              {/* Description */}
              <div>
                <label className="gv-label">Description</label>
                <input type="text" placeholder="e.g. Build enterprise sales capability" value={form.description} onChange={(e) => updateForm("description", e.target.value)} className="gv-input" />
              </div>

              {/* Period + Status */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <div>
                  <label className="gv-label">Period <span style={{ color: "#ef4444" }}>*</span></label>
                  <select value={form.period} onChange={(e) => updateForm("period", e.target.value)} className={`gv-select${formErrors.period ? " error" : ""}`}>
                    {PERIODS.filter((p) => p !== "All periods").map((p) => <option key={p}>{p}</option>)}
                  </select>
                  {formErrors.period && <p className="gv-field-error">{formErrors.period}</p>}
                </div>
                <div>
                  <label className="gv-label">Status</label>
                  <select value={form.status} onChange={(e) => updateForm("status", e.target.value)} className="gv-select">
                    {STATUSES_LIST.map((s) => <option key={s} value={s}>{STATUS_DISPLAY[s]}</option>)}
                  </select>
                </div>
              </div>

              {/* Owner + Target Date */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <div>
                  <label className="gv-label">Owner</label>
                  <UserDropdown value={form.owner_id} onChange={(id, name) => { updateForm("owner_id", id); setForm((p) => ({ ...p, owner: name || "Unassigned", owner_id: id })); }} users={users} placeholder="Search owner..." />
                </div>
                <div>
                  <label className="gv-label">Target Date</label>
                  <input type="date" value={form.dueDate.includes("-") && form.dueDate.length === 10 ? form.dueDate : parseDateToApi(form.dueDate)} onChange={(e) => updateForm("dueDate", e.target.value)} className="gv-input" />
                </div>
              </div>

              {/* Target Value + Unit */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <div>
                  <label className="gv-label">Target Value <span style={{ color: "#ef4444" }}>*</span></label>
                  <input type="number" value={form.target} onChange={(e) => updateForm("target", Number(e.target.value))} className={`gv-input${formErrors.target ? " error" : ""}`} />
                  {formErrors.target && <p className="gv-field-error">{formErrors.target}</p>}
                </div>
                <div>
                  <label className="gv-label">Unit <span style={{ color: "#ef4444" }}>*</span></label>
                  <select value={form.unit} onChange={(e) => updateForm("unit", e.target.value)} className={`gv-select${formErrors.unit ? " error" : ""}`}>
                    <option value="">Select unit</option>
                    {UNITS.map((u) => <option key={u}>{u}</option>)}
                  </select>
                  {formErrors.unit && <p className="gv-field-error">{formErrors.unit}</p>}
                </div>
              </div>

              {/* Update Remarks */}
              <div>
                <label className="gv-label">Update Remarks</label>
                <input type="text" placeholder="e.g. Interview pipeline is active" value={form.update_remarks} onChange={(e) => updateForm("update_remarks", e.target.value)} className="gv-input" />
              </div>

              {/* Progress slider (In modal only) */}
              <div style={{ background: "#fafafa", borderRadius: 16, padding: 20, border: `1px solid #f3f4f6`, marginTop: 4 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                  <label style={{ fontSize: 13, fontWeight: 700, color: "#111827", margin: 0, textTransform: "none", letterSpacing: "normal" }}>Current Progress</label>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <input
                      type="number" value={form.current} min={0} max={form.target}
                      onChange={(e) => updateForm("current", Math.min(Number(e.target.value), Number(form.target)))}
                      style={{
                        width: 70, border: "1px solid #e5e7eb", borderRadius: 8,
                        textAlign: "center", padding: "6px", fontSize: 13, fontWeight: 700, color: C.primary, outline: "none"
                      }}
                    />
                    <span style={{ fontSize: 13, fontWeight: 600, color: "#6b7280" }}>{form.unit || "unit"}</span>
                  </div>
                </div>

                <input
                  type="range" min={0} max={form.target || 100} step={1} value={form.current}
                  onChange={(e) => updateForm("current", Number(e.target.value))}
                  className="gv-slider" style={{ background: modalSliderBg(getProgress(form)) }}
                />

                <div style={{
                  background: C.primary, color: "#fff", fontWeight: 800, textAlign: "center",
                  padding: "8px 0", borderRadius: 10, fontSize: 14, marginTop: 16,
                  boxShadow: "0 4px 10px rgba(218,119,86,0.3)"
                }}>
                  {getProgress(form)}% Achieved
                </div>
              </div>

            </div>

            {/* Footer */}
            <div style={{ display: "flex", justifyContent: "flex-end", gap: 12, padding: "20px 28px", borderTop: `1px solid #f3f4f6`, background: "#fff" }}>
              <button
                onClick={closeModal}
                style={{
                  padding: "10px 20px", fontSize: 13, fontWeight: 700, color: "#4b5563",
                  background: "#f3f4f6", border: "none", borderRadius: 12, cursor: "pointer", transition: "0.2s"
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = "#e5e7eb"}
                onMouseLeave={(e) => e.currentTarget.style.background = "#f3f4f6"}
              >
                Cancel
              </button>
              <button
                onClick={handleSave} disabled={isSaving}
                style={{
                  padding: "10px 24px", fontSize: 13, fontWeight: 700, color: "#fff",
                  background: !isSaving ? C.primary : "#e5b5a3", border: "none", borderRadius: 12,
                  cursor: !isSaving ? "pointer" : "not-allowed", display: "flex", alignItems: "center", gap: 8,
                  boxShadow: !isSaving ? "0 4px 12px rgba(218,119,86,0.25)" : "none", transition: "0.2s"
                }}
                onMouseEnter={(e) => { if (!isSaving) e.currentTarget.style.background = C.primaryHov; }}
                onMouseLeave={(e) => { if (!isSaving) e.currentTarget.style.background = C.primary; }}
              >
                {isSaving && <LoaderIcon />}
                {isSaving ? "Saving..." : activeModal === "create" ? "Add Goal" : "Save Changes"}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
