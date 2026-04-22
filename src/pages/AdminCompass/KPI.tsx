// ─────────────────────────────────────────────
// KPI.tsx  —  Root component (Restyled to match BhagSection/BusinessPlan theme)
// ─────────────────────────────────────────────
import React, { useCallback, useMemo, useState, useEffect } from "react";
import Axios from "axios";
import { BookOpen, Plus, BarChart3 } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import KPIManagementTab from "./AdminCompassComponent/KPIManagementTab";
import ArchivedKPIsTab from "./AdminCompassComponent/ArchivedKPIsTab";
import MissedEntitiesTab from "./AdminCompassComponent/MissedEntitiesTab";
import KPIHistoryTab from "./AdminCompassComponent/KPIHistoryTab";
import KPISettingsTab from "./AdminCompassComponent/KPISettingsTab";
import KPIGuideTab from "./AdminCompassComponent/KPIGuideTab";
import CreateKPIDialog from "./AdminCompassComponent/CreateKPIDialog";
import EditKPIDialog, {
  type EditKPIFormValues,
} from "./AdminCompassComponent/EditKPIDialog";
import { C, kpiClass } from "./AdminCompassComponent/Shared";
import {
  type ArchivedKPIEntry,
  type KPICardData,
} from "./AdminCompassComponent/kpiTypes";
import type { KPIHistoryRow } from "./AdminCompassComponent/KPIHistoryTab";
import { getBaseUrl, getToken as getAuthToken } from "@/utils/auth";

// ─────────────────────────────────────────────
// DESIGN TOKENS — aligned with BhagSection / BusinessPlan
// ─────────────────────────────────────────────
const T = {
  primary: "#DA7756",
  primaryHov: "#c9673f",
  primaryBg: "#fdf9f7",
  primaryTint: "rgba(218,119,86,0.06)",
  primaryBord: "rgba(218,119,86,0.22)",
  primaryBordStr: "#d4cdc6",
  tealBg: "#9EC8BA",
  deepTeal: "#1E3F36",
  pageBg: "#f6f4ee",
  cardBg: "#ffffff",
  textMain: "#1a1a1a",
  textMuted: "#6b7280",
  borderLgt: "#ebebeb",
  font: "'Poppins', sans-serif",
} as const;

// ─────────────────────────────────────────────
// API CONFIG  (unchanged)
// ─────────────────────────────────────────────
const KPI_LIST_ENDPOINTS = ["/kpis", "/api/kpis"] as const;
const KPI_ARCHIVED_ENDPOINT_PATHS = [
  "/kpis/archived.json",
  "/kpis/archived",
] as const;
const KPI_HISTORY_ENDPOINT_PATHS = [
  "/kpis/history.json",
  "/kpis/history",
] as const;
const KPI_ARCHIVED_BEARER_TOKEN =
  "eyJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjo4Nzk4OX0.pHlLUDAbJSUJbV-wTIdDyuXScLS7MKbPY9P3BZ8TmzI";
const KPI_OWNER_CACHE_KEY = "kpi_owner_name_cache_v1";
const KPI_ASSIGNEE_CACHE_KEY = "kpi_assignee_ids_cache_v1";
const KPI_COMPANY_USERS_CACHE_KEY = "kpi_company_users_cache_v1";
const KPI_ARCHIVE_API_KEY_CACHE = "kpi_archive_api_key_v1";
const KPI_ARCHIVE_API_BASE_CACHE = "kpi_archive_api_base_v1";
const KPI_RESTORE_API_KEY_CACHE = "kpi_restore_api_key_v1";
const KPI_RESTORE_API_BASE_CACHE = "kpi_restore_api_base_v1";

let runtimeArchiveApiKey: string | null = null;
let runtimeArchiveApiBase: string | null = null;
let runtimeRestoreApiKey: string | null = null;
let runtimeRestoreApiBase: string | null = null;
let companyUsersRequestPromise: Promise<CompanyUser[]> | null = null;
let companyUsersMemoryCache: { data: CompanyUser[]; ts: number } | null = null;
const COMPANY_USERS_CACHE_TTL_MS = 5 * 60 * 1000;

type ApiMethod = "post" | "put" | "patch" | "delete";
type ApiCandidate = {
  key: string;
  method: ApiMethod;
  url: string;
  body?: Record<string, unknown>;
};

type RawKpiData = {
  id?: string | number;
  kpi_name?: string;
  name?: string;
  assignee_name?: string;
  assignee?:
    | string
    | { id?: string | number; name?: string; full_name?: string };
  target_value?: number;
  current_value?: number;
  unit?: string;
  frequency?: string;
  category?: string;
  priority?: string;
  department_id?: number;
  assignee_id?: number;
  assignee_ids?: Array<number | string> | string;
  assignees?: Array<{ id?: string | number; user_id?: string | number }>;
  assigned_users?: Array<{ id?: string | number; user_id?: string | number }>;
  users?: Array<{ id?: string | number; user_id?: string | number }>;
  description?: string;
  weight?: number;
};

type RawArchivedKpiData = RawKpiData & {
  archived_at?: string;
  archived_on?: string;
  archived_date?: string;
  reason?: string;
  archived_reason?: string;
  deletion_reason?: string;
  owner_name?: string;
};

type KpiPayload = {
  name: string;
  description?: string;
  category: string;
  unit: string;
  frequency: string;
  target_value: number;
  current_value: number;
  department_id?: number | null;
  assignee_id?: number | null;
  assignee_ids?: number[];
  weight?: number;
  priority?: string;
  organization_id?: number | string;
  organisation_id?: number | string;
  org_id?: number | string;
  company_id?: number | string;
};

type KpiUpdatePayload = {
  current_value: number;
  target_value: number;
  frequency: "daily" | "weekly" | "monthly" | "quarterly";
  weight?: number;
  priority?: string;
};

type CompanyUser = {
  id: number;
  name: string;
  email?: string;
  departmentId?: number;
};
type CompanyDepartment = { id: number; name: string };

type RawCompanyUser = {
  id?: number | string;
  user_id?: number | string;
  name?: string;
  full_name?: string;
  employee_name?: string;
  display_name?: string;
  user_name?: string;
  firstname?: string;
  first_name?: string;
  lastname?: string;
  last_name?: string;
  email?: string;
  official_email?: string;
  work_email?: string;
  department_id?: number | string;
  dept_id?: number | string;
  user?: {
    id?: number | string;
    name?: string;
    full_name?: string;
    firstname?: string;
    first_name?: string;
    lastname?: string;
    last_name?: string;
    email?: string;
    official_email?: string;
    work_email?: string;
    department_id?: number | string;
  };
  lock_user_permission?: {
    department_id?: number | string;
    employee_id?: number | string;
  };
};

type RawDepartment = {
  id?: number | string;
  name?: string;
  department_name?: string;
  title?: string;
};
type RawExtraField = {
  id?: number | string;
  extra_field_id?: number | string;
  name?: string;
  field_name?: string;
  field_value?: unknown;
  group_name?: string;
  values?: unknown;
  field_description?: string;
};
type RawHistoryEntry = {
  id?: string | number;
  kpi_id?: string | number;
  date?: string;
  created_at?: string;
  entry_date?: string;
  entry_type?: string;
  type?: string;
  action?: string;
  kpi_name?: string;
  kpi?: { id?: string | number; name?: string; kpi_name?: string };
  department?: string;
  department_name?: string;
  user?: string;
  user_name?: string;
  assignee_name?: string;
  target_value?: string | number;
  planned_value?: string | number;
  planned?: string | number;
  actual_value?: string | number;
  current_value?: string | number;
  actual?: string | number;
  achievement?: string | number;
  achievement_percentage?: string | number;
  status?: string;
  notes?: string;
  remarks?: string;
  comment?: string;
  frequency?: string;
  kpi_frequency?: string;
};

// ─────────────────────────────────────────────
// All existing API helpers — UNCHANGED (abbreviated for brevity, keep original)
// ─────────────────────────────────────────────
const getCachedCompanyUsers = (): CompanyUser[] => {
  try {
    const raw = localStorage.getItem(KPI_COMPANY_USERS_CACHE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed
      .map((item) => {
        const record = item as {
          id?: unknown;
          name?: unknown;
          email?: unknown;
          departmentId?: unknown;
        };
        const id = Number(record.id);
        const name = typeof record.name === "string" ? record.name.trim() : "";
        if (!Number.isFinite(id) || !name) return null;
        return {
          id,
          name,
          email: typeof record.email === "string" ? record.email : undefined,
          departmentId: Number.isFinite(Number(record.departmentId))
            ? Number(record.departmentId)
            : undefined,
        } as CompanyUser;
      })
      .filter((user): user is CompanyUser => user !== null);
  } catch {
    return [];
  }
};

const setCachedCompanyUsers = (users: CompanyUser[]): void => {
  try {
    localStorage.setItem(KPI_COMPANY_USERS_CACHE_KEY, JSON.stringify(users));
  } catch {}
};

const KPI_UNITS_GROUP_NAME = "kpi_units_configuration";
const DEFAULT_KPI_UNITS = [
  "₹",
  "%",
  "Hours",
  "Days",
  "Calls",
  "Leads",
  "Meetings",
  "Tickets",
];

const getToken = () => {
  const adminCompassToken = localStorage.getItem("auth_token");
  const appToken = getAuthToken();
  if (adminCompassToken) return adminCompassToken;
  if (appToken) {
    localStorage.setItem("auth_token", appToken);
    return appToken;
  }
  return "";
};

const getApiBaseCandidates = () => {
  const fromAuth = getBaseUrl();
  const candidates = [fromAuth].filter(
    (v): v is string => typeof v === "string" && v.length > 0
  );
  return Array.from(new Set(candidates));
};

const getApiBaseUrl = () => {
  const [base] = getApiBaseCandidates();
  if (!base) throw new Error("Base URL not found. Please login again.");
  return base;
};

const apiHeaders = () => ({
  ...(getToken()
    ? {}
    : (() => {
        throw new Error("Missing auth token.");
      })()),
  Accept: "application/json",
  "Content-Type": "application/json",
  Authorization: `Bearer ${getToken()}`,
});

const archivedApiHeaders = () => ({
  ...(getToken() || KPI_ARCHIVED_BEARER_TOKEN
    ? {}
    : (() => {
        throw new Error("Missing auth token.");
      })()),
  Accept: "application/json",
  "Content-Type": "application/json",
  Authorization: `Bearer ${getToken() || KPI_ARCHIVED_BEARER_TOKEN}`,
});

const getKpiUnitsApiHeaders = () => ({
  ...(getToken()
    ? {}
    : (() => {
        throw new Error("Missing auth token.");
      })()),
  Accept: "application/json",
  "Content-Type": "application/json",
  Authorization: `Bearer ${getToken()}`,
});

const withNoCacheTs = (url: string): string => {
  const sep = url.includes("?") ? "&" : "?";
  return `${url}${sep}_ts=${Date.now()}`;
};

const getApiErrorMessage = (error: unknown): string => {
  if (Axios.isAxiosError(error)) {
    const status = error.response?.status;
    const data = error.response?.data as
      | { message?: string; error?: string; errors?: string[] }
      | undefined;
    const message =
      data?.message ??
      data?.error ??
      (Array.isArray(data?.errors) ? data.errors[0] : undefined);
    if (status) return `HTTP ${status}${message ? `: ${message}` : ""}`;
    return error.message || "Network error";
  }
  if (error instanceof Error) return error.message;
  return "Unexpected error";
};

const fetchCompanyUsers = async (): Promise<CompanyUser[]> => {
  if (
    companyUsersMemoryCache &&
    Date.now() - companyUsersMemoryCache.ts < COMPANY_USERS_CACHE_TTL_MS
  )
    return companyUsersMemoryCache.data;
  if (companyUsersRequestPromise) return companyUsersRequestPromise;

  const normalizeUsers = (rawUsers: RawCompanyUser[]): CompanyUser[] => {
    const normalizedUsers = rawUsers
      .map((u) => {
        const id = Number(u.id ?? u.user_id ?? u.user?.id);
        const fullNameFromParts = [
          u.firstname ?? u.first_name,
          u.lastname ?? u.last_name,
        ]
          .filter(
            (p): p is string => typeof p === "string" && p.trim().length > 0
          )
          .join(" ");
        const nestedFullNameFromParts = [
          u.user?.firstname ?? u.user?.first_name,
          u.user?.lastname ?? u.user?.last_name,
        ]
          .filter(
            (p): p is string => typeof p === "string" && p.trim().length > 0
          )
          .join(" ");
        const email =
          u.email ??
          u.official_email ??
          u.work_email ??
          u.user?.email ??
          u.user?.official_email ??
          u.user?.work_email;
        const primaryName =
          [
            u.full_name,
            u.employee_name,
            u.display_name,
            fullNameFromParts,
            u.user?.full_name,
            nestedFullNameFromParts,
            u.name,
            u.user?.name,
            u.user_name,
            email,
          ]
            .find(
              (c): c is string => typeof c === "string" && c.trim().length > 0
            )
            ?.trim() ?? `User ${id}`;
        const departmentIdRaw =
          u.department_id ??
          u.dept_id ??
          u.user?.department_id ??
          u.lock_user_permission?.department_id;
        return {
          id,
          name: primaryName,
          email,
          departmentId:
            departmentIdRaw != null && Number.isFinite(Number(departmentIdRaw))
              ? Number(departmentIdRaw)
              : undefined,
        };
      })
      .filter((u) => Number.isFinite(u.id) && u.name.trim().length > 0);
    const deduped = new Map<number, CompanyUser>();
    for (const user of normalizedUsers) deduped.set(user.id, user);
    return Array.from(deduped.values()).sort((a, b) =>
      a.name.localeCompare(b.name, undefined, { sensitivity: "base" })
    );
  };

  const extractRawUsers = (data: unknown): RawCompanyUser[] => {
    if (Array.isArray(data)) return data as RawCompanyUser[];
    if (!data || typeof data !== "object") return [];
    const obj = data as Record<string, unknown>;
    for (const candidate of [obj.users, obj.fm_users, obj.data]) {
      if (Array.isArray(candidate)) return candidate as RawCompanyUser[];
      if (candidate && typeof candidate === "object") {
        const nested = candidate as Record<string, unknown>;
        if (Array.isArray(nested.users))
          return nested.users as RawCompanyUser[];
      }
    }
    return [];
  };

  const endpointCandidates = (() => {
    const rawUser = localStorage.getItem("user");
    let parsedUser: {
      organization_id?: string | number;
      org_id?: string | number;
      company_id?: string | number;
      lock_role?: { company_id?: string | number };
    } | null = null;
    if (rawUser) {
      try {
        parsedUser = JSON.parse(rawUser);
      } catch {
        parsedUser = null;
      }
    }
    const orgId =
      localStorage.getItem("org_id") ||
      localStorage.getItem("organization_id") ||
      (parsedUser?.organization_id != null
        ? String(parsedUser.organization_id)
        : "") ||
      (parsedUser?.org_id != null ? String(parsedUser.org_id) : "") ||
      (parsedUser?.company_id != null ? String(parsedUser.company_id) : "") ||
      (parsedUser?.lock_role?.company_id != null
        ? String(parsedUser.lock_role.company_id)
        : "");
    return orgId
      ? [
          `/api/users?organization_id=${encodeURIComponent(orgId)}`,
          `/api/users?organisation_id=${encodeURIComponent(orgId)}`,
        ]
      : ["/api/users"];
  })();

  companyUsersRequestPromise = (async () => {
    const bases = getApiBaseCandidates();
    const requestUrls = Array.from(
      new Set(
        bases.flatMap((base) => endpointCandidates.map((ep) => `${base}${ep}`))
      )
    );
    if (requestUrls.length === 0) return [];
    try {
      let lastError: unknown = null;
      let users: CompanyUser[] = [];
      for (const url of requestUrls) {
        try {
          const getWithRetry = async () => {
            try {
              return await Axios.get(url, {
                headers: apiHeaders(),
                timeout: 15000,
              });
            } catch (err) {
              const status = Axios.isAxiosError(err)
                ? err.response?.status
                : undefined;
              const code = Axios.isAxiosError(err) ? err.code : undefined;
              if (
                status == null ||
                (typeof status === "number" && status >= 500) ||
                code === "ECONNABORTED"
              ) {
                await new Promise((r) => setTimeout(r, 400));
                return await Axios.get(url, {
                  headers: apiHeaders(),
                  timeout: 15000,
                });
              }
              throw err;
            }
          };
          const { data } = await getWithRetry();
          const normalized = normalizeUsers(extractRawUsers(data));
          if (normalized.length > 0) {
            users = normalized;
            break;
          }
        } catch (err) {
          lastError = err;
        }
      }
      if (users.length === 0)
        throw lastError ?? new Error("All user endpoints returned empty lists");
      companyUsersMemoryCache = { data: users, ts: Date.now() };
      return users;
    } catch (err) {
      console.error("Failed to fetch company users:", err);
      return [];
    } finally {
      companyUsersRequestPromise = null;
    }
  })();
  return companyUsersRequestPromise;
};

const fetchCompanyDepartments = async (): Promise<CompanyDepartment[]> => {
  const { data } = await Axios.get(`${getApiBaseUrl()}/pms/departments.json`, {
    headers: apiHeaders(),
  });
  const rawDepartments = Array.isArray(data)
    ? data
    : (data.departments ?? data.data?.departments ?? data.data ?? []);
  if (!Array.isArray(rawDepartments)) return [];
  return rawDepartments
    .map((d: RawDepartment) => ({
      id: Number(d.id),
      name: d.name ?? d.department_name ?? d.title ?? `Department ${d.id}`,
    }))
    .filter((d: CompanyDepartment) => Number.isFinite(d.id) && !!d.name);
};

const extractUnitValues = (json: unknown): string[] => {
  const unique = (arr: string[]): string[] => Array.from(new Set(arr));
  const readText = (v: unknown): string[] =>
    typeof v === "string" && v.trim().length > 0 ? [v.trim()] : [];
  const readValues = (v: unknown): string[] =>
    Array.isArray(v)
      ? v.filter(
          (x): x is string => typeof x === "string" && x.trim().length > 0
        )
      : [];
  const readFieldValue = (fv: unknown): string[] => {
    if (Array.isArray(fv))
      return fv.filter(
        (v): v is string => typeof v === "string" && v.trim().length > 0
      );
    if (typeof fv !== "string") return [];
    const t = fv.trim();
    if (!t) return [];
    try {
      const p = JSON.parse(t) as unknown;
      if (Array.isArray(p))
        return p.filter(
          (v): v is string => typeof v === "string" && v.trim().length > 0
        );
    } catch {}
    return [t];
  };
  const unitsFromRecord = (record?: RawExtraField): string[] => {
    if (!record) return [];
    const fv = readValues(record.values);
    if (fv.length > 0) return fv;
    const fn = readText(record.field_name ?? record.name);
    if (fn.length > 0) return fn;
    return readFieldValue(record.field_value);
  };
  if (Array.isArray(json)) {
    const records = (json as RawExtraField[]).filter(
      (r) => r.group_name === KPI_UNITS_GROUP_NAME
    );
    return unique(records.flatMap((r) => unitsFromRecord(r)));
  }
  if (json && typeof json === "object") {
    const obj = json as Record<string, unknown>;
    const grouped = obj.extra_fields as
      | Record<string, { values?: unknown }>
      | RawExtraField[]
      | undefined;
    if (grouped && !Array.isArray(grouped))
      return readValues(grouped[KPI_UNITS_GROUP_NAME]?.values);
    if (Array.isArray(grouped)) {
      const records = grouped.filter(
        (r) => r.group_name === KPI_UNITS_GROUP_NAME
      );
      return unique(records.flatMap((r) => unitsFromRecord(r)));
    }
    const ef = obj.extra_field as RawExtraField | undefined;
    if (ef?.group_name === KPI_UNITS_GROUP_NAME)
      return unique(unitsFromRecord(ef));
    const dr = obj as RawExtraField;
    if (dr.group_name === KPI_UNITS_GROUP_NAME)
      return unique(unitsFromRecord(dr));
  }
  return [];
};

const upsertKpiUnitsConfiguration = async (
  values: string[]
): Promise<string[]> => {
  const payload = {
    extra_field: {
      group_name: KPI_UNITS_GROUP_NAME,
      values,
      field_description: "KPI units master v2",
    },
  };
  let lastError: unknown = null;
  for (const baseUrl of getApiBaseCandidates()) {
    try {
      const res = await fetch(
        withNoCacheTs(`${baseUrl}/extra_fields/bulk_upsert`),
        {
          method: "POST",
          headers: getKpiUnitsApiHeaders(),
          body: JSON.stringify(payload),
          cache: "no-store",
        }
      );
      if (!res.ok) {
        const errData = (await res.json().catch(() => ({}))) as {
          message?: string;
          error?: string;
          errors?: string[];
        };
        throw new Error(
          `HTTP ${res.status}${errData.message ? `: ${errData.message}` : ""}`
        );
      }
      const data = await res.json();
      const extracted = extractUnitValues(data);
      return extracted.length > 0 ? extracted : values;
    } catch (err) {
      lastError = err;
    }
  }
  throw lastError ?? new Error("Failed to save KPI units configuration");
};

const createKpiUnitConfiguration = async (
  unit: string
): Promise<number | null> => {
  const payload = {
    extra_field: {
      field_name: unit,
      field_value: unit,
      group_name: KPI_UNITS_GROUP_NAME,
      field_description: "KPI unit option",
    },
  };
  let lastError: unknown = null;
  for (const baseUrl of getApiBaseCandidates()) {
    try {
      const res = await fetch(`${baseUrl}/extra_fields`, {
        method: "POST",
        headers: getKpiUnitsApiHeaders(),
        body: JSON.stringify(payload),
        cache: "no-store",
      });
      if (!res.ok) {
        const errData = (await res.json().catch(() => ({}))) as {
          message?: string;
          error?: string;
          errors?: string[];
        };
        throw new Error(
          `HTTP ${res.status}${errData.message ? `: ${errData.message}` : ""}`
        );
      }
      const data = await res.json().catch(() => null);
      const obj = (data ?? {}) as {
        id?: number | string;
        extra_field?: {
          id?: number | string;
          extra_field_id?: number | string;
        };
        data?: { id?: number | string; extra_field_id?: number | string };
      };
      const idValue =
        obj.id ??
        obj.extra_field?.id ??
        obj.extra_field?.extra_field_id ??
        obj.data?.id ??
        obj.data?.extra_field_id;
      const id = Number(idValue);
      return Number.isFinite(id) ? id : null;
    } catch (err) {
      lastError = err;
    }
  }
  throw lastError ?? new Error("Failed to create KPI unit");
};

const deleteKpiUnitConfiguration = async (unitId: number): Promise<void> => {
  let lastError: unknown = null;
  for (const baseUrl of getApiBaseCandidates()) {
    try {
      const res = await fetch(`${baseUrl}/extra_fields/${unitId}`, {
        method: "DELETE",
        headers: getKpiUnitsApiHeaders(),
        cache: "no-store",
      });
      if (!res.ok) {
        const rawText = await res.text();
        throw new Error(`HTTP ${res.status}: ${rawText.slice(0, 200)}`);
      }
      return;
    } catch (err) {
      lastError = err;
    }
  }
  throw lastError ?? new Error("Failed to delete KPI unit");
};

// ─────────────────────────────────────────────
// API NORMALIZATION (unchanged)
// ─────────────────────────────────────────────
const calculateStatus = (
  current: number,
  target: number
): KPICardData["status"] => {
  if (!target || target === 0) return "on-target";
  const pct = (current / target) * 100;
  if (pct >= 80) return "on-target";
  if (pct >= 50) return "at-risk";
  return "off-target";
};

const normalizeKpiFromAPI = (raw: RawKpiData): KPICardData => {
  const priorityMap: Record<string, "low" | "medium" | "high"> = {
    low: "low",
    medium: "medium",
    high: "high",
  };
  const priority = (priorityMap[raw.priority?.toLowerCase() ?? "medium"] ??
    "medium") as "low" | "medium" | "high";
  const assigneeIds = (() => {
    const ids: number[] = [];
    const pushId = (v: unknown) => {
      const p = Number(v);
      if (Number.isFinite(p)) ids.push(p);
    };
    if (Array.isArray(raw.assignee_ids))
      raw.assignee_ids.forEach((id) => pushId(id));
    else if (typeof raw.assignee_ids === "string")
      raw.assignee_ids
        .split(",")
        .map((v) => v.trim())
        .filter(Boolean)
        .forEach((id) => pushId(id));
    if (Array.isArray(raw.assignees))
      raw.assignees.forEach((item) => pushId(item.id ?? item.user_id));
    if (Array.isArray(raw.assigned_users))
      raw.assigned_users.forEach((item) => pushId(item.id ?? item.user_id));
    if (Array.isArray(raw.users))
      raw.users.forEach((item) => pushId(item.id ?? item.user_id));
    if (typeof raw.assignee === "object" && raw.assignee)
      pushId(raw.assignee.id);
    if (raw.assignee_id != null) pushId(raw.assignee_id);
    return Array.from(new Set(ids));
  })();
  const primaryAssigneeId =
    assigneeIds.length > 0
      ? assigneeIds[0]
      : raw.assignee_id != null
        ? Number(raw.assignee_id)
        : undefined;
  return {
    id: String(raw.id ?? Math.random()),
    name: raw.name ?? raw.kpi_name ?? "Untitled KPI",
    owner:
      raw.assignee_name ??
      (typeof raw.assignee === "string"
        ? raw.assignee
        : (raw.assignee?.name ?? raw.assignee?.full_name)) ??
      "Unassigned",
    target: Math.trunc(Number(raw.target_value) || 0),
    value: Math.trunc(Number(raw.current_value) || 0),
    unit: raw.unit ?? "%",
    status: calculateStatus(
      raw.current_value as number,
      raw.target_value as number
    ),
    frequency: (raw.frequency?.toLowerCase() === "daily"
      ? "Daily"
      : raw.frequency?.toLowerCase() === "weekly"
        ? "Weekly"
        : raw.frequency?.toLowerCase() === "quarterly"
          ? "Quarterly"
          : "Monthly") as KPICardData["frequency"],
    badge: "Active",
    color: "bg-sky-100",
    tags: [raw.category ?? "Operations", "Individual"],
    priority,
    departmentId: raw.department_id,
    assigneeId: primaryAssigneeId,
    assigneeIds,
    description: raw.description,
    weight:
      raw.weight != null ? Math.trunc(Number(raw.weight) || 0) : undefined,
    _raw: raw,
  };
};

const formatArchivedDate = (value?: string): string => {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString();
};

const normalizeArchivedKpiFromAPI = (
  raw: RawArchivedKpiData
): ArchivedKPIEntry => {
  const normalized = normalizeKpiFromAPI(raw);
  return {
    ...normalized,
    owner: raw.owner_name ?? normalized.owner,
    archivedDate: formatArchivedDate(
      raw.archived_at ?? raw.archived_on ?? raw.archived_date
    ),
    reason:
      raw.archived_reason ?? raw.deletion_reason ?? raw.reason ?? "Archived",
  };
};

const normalizeHistoryRow = (raw: RawHistoryEntry): KPIHistoryRow => {
  const dateRaw = raw.date ?? raw.entry_date ?? raw.created_at ?? "";
  const date = dateRaw
    ? (() => {
        const d = new Date(dateRaw);
        return Number.isNaN(d.getTime()) ? dateRaw : d.toLocaleDateString();
      })()
    : "-";
  return {
    id: String(raw.id ?? Math.random()),
    kpiId:
      raw.kpi_id != null
        ? String(raw.kpi_id)
        : raw.kpi?.id != null
          ? String(raw.kpi.id)
          : undefined,
    date,
    type: raw.entry_type ?? raw.type ?? raw.action ?? "-",
    kpiName: raw.kpi_name ?? raw.kpi?.name ?? raw.kpi?.kpi_name ?? "-",
    department: raw.department_name ?? raw.department ?? "-",
    user: raw.user_name ?? raw.assignee_name ?? raw.user ?? "-",
    planned: String(
      raw.planned_value ?? raw.target_value ?? raw.planned ?? "-"
    ),
    actual: String(raw.actual_value ?? raw.current_value ?? raw.actual ?? "-"),
    achievement: String(raw.achievement_percentage ?? raw.achievement ?? "-"),
    status: raw.status ?? "-",
    notes: raw.notes ?? raw.remarks ?? raw.comment ?? "-",
    frequency: raw.frequency ?? raw.kpi_frequency ?? "-",
  };
};

const fetchKpis = async (): Promise<KPICardData[]> => {
  const headers = apiHeaders();
  let lastError: unknown = null;
  for (const base of getApiBaseCandidates()) {
    for (const endpoint of KPI_LIST_ENDPOINTS) {
      try {
        const { data: json } = await Axios.get(`${base}${endpoint}`, {
          headers,
        });
        const arr = Array.isArray(json)
          ? json
          : (json.data?.kpis ??
            json.kpis ??
            json.data ??
            json.kpi_dashboard?.kpis ??
            json.kpi_dashboard ??
            []);
        if (!Array.isArray(arr)) return [];
        return arr.map(normalizeKpiFromAPI);
      } catch (err) {
        lastError = err;
      }
    }
  }
  throw lastError ?? new Error("Failed to load KPI data from API");
};

const fetchHistoryKpis = async (): Promise<KPIHistoryRow[]> => {
  const headers = archivedApiHeaders();
  const bases = Array.from(
    new Set([...getApiBaseCandidates(), "https://fm-uat-api.lockated.com"])
  );
  let json: unknown;
  let lastError: unknown = null;
  for (const base of bases) {
    for (const path of KPI_HISTORY_ENDPOINT_PATHS) {
      try {
        const { data } = await Axios.get(withNoCacheTs(`${base}${path}`), {
          headers,
        });
        json = data;
        lastError = null;
        break;
      } catch (err) {
        lastError = err;
      }
    }
    if (json !== undefined) break;
  }
  if (json === undefined)
    throw lastError ?? new Error("Failed to load KPI history from API");
  const pickFirstArray = (value: unknown): unknown[] => {
    if (Array.isArray(value)) return value;
    if (!value || typeof value !== "object") return [];
    const obj = value as Record<string, unknown>;
    for (const key of [
      "history",
      "entries",
      "kpi_history",
      "rows",
      "data",
      "items",
      "results",
    ]) {
      const c = obj[key];
      if (Array.isArray(c) && c.length > 0) return c;
      if (c && typeof c === "object") {
        const n = pickFirstArray(c);
        if (n.length > 0) return n;
      }
    }
    for (const c of Object.values(obj)) {
      if (Array.isArray(c) && c.length > 0) return c;
      if (c && typeof c === "object") {
        const n = pickFirstArray(c);
        if (n.length > 0) return n;
      }
    }
    return [];
  };
  const arr = pickFirstArray(json);
  if (!Array.isArray(arr)) return [];
  return arr.map((item) => normalizeHistoryRow(item as RawHistoryEntry));
};

const fetchArchivedKpis = async (): Promise<ArchivedKPIEntry[]> => {
  const headers = archivedApiHeaders();
  const bases = Array.from(
    new Set([...getApiBaseCandidates(), "https://fm-uat-api.lockated.com"])
  );
  let json: unknown;
  let lastError: unknown = null;
  for (const base of bases) {
    for (const path of KPI_ARCHIVED_ENDPOINT_PATHS) {
      try {
        const { data } = await Axios.get(withNoCacheTs(`${base}${path}`), {
          headers,
        });
        json = data;
        lastError = null;
        break;
      } catch (err) {
        lastError = err;
      }
    }
    if (json !== undefined) break;
  }
  if (json === undefined)
    throw lastError ?? new Error("Failed to load archived KPIs from API");
  const parsed = (json ?? {}) as {
    data?: { archived_kpis?: unknown; kpis?: unknown } | unknown;
    archived_kpis?: unknown;
    kpis?: unknown;
  };
  const arr = Array.isArray(json)
    ? json
    : ((parsed.data as { archived_kpis?: unknown; kpis?: unknown } | undefined)
        ?.archived_kpis ??
      parsed.archived_kpis ??
      (parsed.data as { archived_kpis?: unknown; kpis?: unknown } | undefined)
        ?.kpis ??
      parsed.kpis ??
      parsed.data ??
      []);
  if (!Array.isArray(arr)) return [];
  return arr.map((item) =>
    normalizeArchivedKpiFromAPI(item as RawArchivedKpiData)
  );
};

const fetchKpiById = async (
  id: string | number
): Promise<KPICardData | null> => {
  try {
    const { data: json } = await Axios.get(`${getApiBaseUrl()}/kpis/${id}`, {
      headers: apiHeaders(),
    });
    return normalizeKpiFromAPI(json.data ?? json.kpi ?? json);
  } catch (err) {
    console.error("Fetch KPI error:", err);
    return null;
  }
};

const createKpi = async (payload: KpiPayload) => {
  const rawUser = localStorage.getItem("user");
  const parsedUser = (() => {
    if (!rawUser) return null;
    try {
      return JSON.parse(rawUser) as Record<string, unknown>;
    } catch {
      return null;
    }
  })();
  const orgIdFromStorage =
    localStorage.getItem("org_id") ||
    localStorage.getItem("organization_id") ||
    localStorage.getItem("organisation_id") ||
    (parsedUser && typeof parsedUser === "object"
      ? (parsedUser.organization_id ??
        parsedUser.organisation_id ??
        parsedUser.org_id ??
        parsedUser.company_id ??
        (parsedUser.lock_role as { company_id?: unknown } | undefined)
          ?.company_id ??
        null)
      : null);
  const orgId =
    orgIdFromStorage != null && String(orgIdFromStorage).trim().length > 0
      ? String(orgIdFromStorage).trim()
      : null;
  const cleanPayload = (c: Partial<KpiPayload>): Partial<KpiPayload> =>
    Object.fromEntries(
      Object.entries(c).filter(([, v]) => v !== undefined && v !== null)
    ) as Partial<KpiPayload>;
  const withOrg = <T extends Partial<KpiPayload>>(c: T): T =>
    orgId
      ? {
          ...c,
          organization_id: c.organization_id ?? orgId,
          organisation_id: c.organisation_id ?? orgId,
          org_id: c.org_id ?? orgId,
          company_id: c.company_id ?? orgId,
        }
      : c;
  const payloadCandidates = [
    cleanPayload(payload),
    cleanPayload({ ...payload, assignee_ids: undefined }),
    cleanPayload({
      name: payload.name,
      category: payload.category,
      unit: payload.unit,
      frequency: payload.frequency,
      target_value: payload.target_value,
      current_value: payload.current_value,
      department_id: payload.department_id,
      assignee_id: payload.assignee_id,
      weight: payload.weight,
      priority: payload.priority,
      description: payload.description,
    }),
  ]
    .map((c) => withOrg(c))
    .filter(
      (c, i, arr) =>
        i === arr.findIndex((x) => JSON.stringify(x) === JSON.stringify(c))
    );
  const endpointCandidates = [
    "/kpis",
    "/kpis.json",
    "/api/kpis",
    "/api/kpis.json",
  ];
  const headersCandidates = (() => {
    const token = getToken();
    const bearer = apiHeaders();
    if (!token) return [bearer];
    return [bearer, { ...bearer, Authorization: token }];
  })();
  let lastError: unknown = null;
  for (const base of Array.from(new Set(getApiBaseCandidates()))) {
    for (const endpoint of endpointCandidates) {
      const urlCandidates = (() => {
        const baseUrl = `${base}${endpoint}`;
        if (!orgId) return [baseUrl];
        const sep = baseUrl.includes("?") ? "&" : "?";
        return [
          baseUrl,
          `${baseUrl}${sep}organization_id=${encodeURIComponent(orgId)}`,
          `${baseUrl}${sep}organisation_id=${encodeURIComponent(orgId)}`,
          `${baseUrl}${sep}org_id=${encodeURIComponent(orgId)}`,
          `${baseUrl}${sep}company_id=${encodeURIComponent(orgId)}`,
        ];
      })();
      for (const candidate of payloadCandidates) {
        const bodyCandidates: Array<Record<string, unknown>> = (() => {
          const base2 = { kpi: candidate };
          const flat = candidate as Record<string, unknown>;
          if (!orgId) return [base2, flat];
          const orgScopedInsideKpi = {
            kpi: {
              ...candidate,
              organization_id: orgId,
              organisation_id: orgId,
              org_id: orgId,
              company_id: orgId,
            },
          };
          const orgScopedTopLevel = {
            ...base2,
            organization_id: orgId,
            organisation_id: orgId,
            org_id: orgId,
            company_id: orgId,
          };
          const orgScopedFlat = {
            ...flat,
            organization_id: orgId,
            organisation_id: orgId,
            org_id: orgId,
            company_id: orgId,
          };
          return [
            orgScopedInsideKpi,
            orgScopedTopLevel,
            orgScopedFlat,
            base2,
            flat,
          ];
        })();
        for (const requestBody of bodyCandidates) {
          for (const headers of headersCandidates) {
            for (const url of urlCandidates) {
              try {
                const { data: json } = await Axios.post(url, requestBody, {
                  headers,
                  timeout: 20000,
                });
                const created =
                  json && typeof json === "object"
                    ? ((json as { data?: unknown; kpi?: unknown }).data ??
                      (json as { data?: unknown; kpi?: unknown }).kpi ??
                      json)
                    : { ...candidate, id: `tmp-${Date.now()}` };
                return normalizeKpiFromAPI(created as RawKpiData);
              } catch (err) {
                lastError = err;
              }
            }
          }
        }
      }
    }
  }
  throw lastError ?? new Error("Failed to create KPI");
};

const cleanKpiUpdatePayload = (
  payload: Partial<KpiPayload> & Partial<KpiUpdatePayload>
): Partial<KpiPayload> & Partial<KpiUpdatePayload> =>
  Object.fromEntries(
    Object.entries(payload).filter(([, v]) => v !== undefined && v !== null)
  ) as Partial<KpiPayload> & Partial<KpiUpdatePayload>;

const updateKpi = async (
  id: string | number,
  payload: Partial<KpiPayload> & KpiUpdatePayload
) => {
  const fullPayload = cleanKpiUpdatePayload(payload);
  const fallbackPayload = cleanKpiUpdatePayload({
    name: payload.name,
    unit: payload.unit,
    frequency: payload.frequency,
    target_value: payload.target_value,
    current_value: payload.current_value,
    weight: payload.weight,
    priority: payload.priority,
  });
  const payloadCandidates = [fullPayload, fallbackPayload].filter(
    (c, i, arr) =>
      i === arr.findIndex((x) => JSON.stringify(x) === JSON.stringify(c))
  );
  const endpointCandidates = [
    `/kpis/${id}`,
    `/kpis/${id}.json`,
    `/api/kpis/${id}`,
  ];
  let lastError: unknown = null;
  for (const base of getApiBaseCandidates()) {
    for (const endpoint of endpointCandidates) {
      for (const candidate of payloadCandidates) {
        try {
          const { data: json } = await Axios.put(
            `${base}${endpoint}`,
            { kpi: candidate },
            { headers: apiHeaders() }
          );
          return normalizeKpiFromAPI(json.data ?? json.kpi ?? json);
        } catch (err) {
          lastError = err;
        }
      }
    }
  }
  throw lastError ?? new Error("Failed to update KPI");
};

const assignKpiUsers = async (
  id: string | number,
  assigneeIds: number[],
  ownerName?: string
) => {
  try {
    const normalizedOwnerName =
      typeof ownerName === "string" && ownerName.trim().length > 0
        ? ownerName.trim()
        : undefined;
    const payload = {
      kpi: {
        assignee_id: assigneeIds[0] ?? null,
        assignee_ids: assigneeIds,
        ...(normalizedOwnerName
          ? {
              assignee_name: normalizedOwnerName,
              owner_name: normalizedOwnerName,
            }
          : {}),
      },
    };
    const { data: json } = await Axios.put(
      `${getApiBaseUrl()}/kpis/${id}`,
      payload,
      { headers: apiHeaders() }
    );
    const normalized = normalizeKpiFromAPI(json.data ?? json.kpi ?? json);
    return {
      ...normalized,
      assigneeIds:
        normalized.assigneeIds && normalized.assigneeIds.length > 0
          ? normalized.assigneeIds
          : assigneeIds,
      assigneeId: normalized.assigneeId ?? assigneeIds[0] ?? null,
      owner:
        normalized.owner && normalized.owner !== "Unassigned"
          ? normalized.owner
          : (ownerName ?? normalized.owner),
    };
  } catch (err) {
    console.error("Assign KPI users error:", err);
    throw err;
  }
};

const deleteKpi = async (id: string | number) => {
  try {
    await Axios.delete(`${getApiBaseUrl()}/kpis/${id}`, {
      headers: apiHeaders(),
    });
    return true;
  } catch (err) {
    console.error("Delete KPI error:", err);
    throw err;
  }
};

const getCachedApiPreference = (key: string): string | null => {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
};
const setCachedApiPreference = (key: string, value: string) => {
  try {
    localStorage.setItem(key, value);
  } catch {}
};
const prioritizeBases = (
  bases: string[],
  preferredBase: string | null
): string[] => {
  if (!preferredBase || !bases.includes(preferredBase)) return bases;
  return [preferredBase, ...bases.filter((b) => b !== preferredBase)];
};
const prioritizeCandidates = (
  candidates: ApiCandidate[],
  preferredKey: string | null
): ApiCandidate[] => {
  if (!preferredKey) return candidates;
  const preferred = candidates.find((c) => c.key === preferredKey);
  if (!preferred) return candidates;
  return [preferred, ...candidates.filter((c) => c.key !== preferredKey)];
};
const executeApiCandidate = async (
  candidate: ApiCandidate,
  headers: Record<string, string>
) => {
  if (candidate.method === "post") {
    await Axios.post(candidate.url, candidate.body ?? {}, { headers });
    return;
  }
  if (candidate.method === "put") {
    await Axios.put(candidate.url, candidate.body ?? {}, { headers });
    return;
  }
  if (candidate.method === "patch") {
    await Axios.patch(candidate.url, candidate.body ?? {}, { headers });
    return;
  }
  await Axios.delete(candidate.url, { headers });
};

const archiveKpi = async (id: string | number) => {
  const headers = archivedApiHeaders();
  const cachedArchiveBase =
    runtimeArchiveApiBase ?? getCachedApiPreference(KPI_ARCHIVE_API_BASE_CACHE);
  const cachedArchiveKey =
    runtimeArchiveApiKey ?? getCachedApiPreference(KPI_ARCHIVE_API_KEY_CACHE);
  const candidateBases = Array.from(
    new Set(["https://fm-uat-api.lockated.com", ...getApiBaseCandidates()])
  );
  const bases = prioritizeBases(candidateBases, cachedArchiveBase);
  let lastError: unknown = null;
  for (const base of bases) {
    const allCandidates = prioritizeCandidates(
      [
        {
          key: "post:/kpis/{id}/archive",
          method: "post",
          url: `${base}/kpis/${id}/archive`,
        },
        {
          key: "post:/kpis/{id}/archive.json",
          method: "post",
          url: `${base}/kpis/${id}/archive.json`,
        },
        {
          key: "post:/kpis/archive/{id}",
          method: "post",
          url: `${base}/kpis/archive/${id}`,
        },
        {
          key: "post:/kpis/archive/{id}.json",
          method: "post",
          url: `${base}/kpis/archive/${id}.json`,
        },
        {
          key: "put:/kpis/{id}/archive",
          method: "put",
          url: `${base}/kpis/${id}/archive`,
        },
        {
          key: "patch:/kpis/{id}/archive",
          method: "patch",
          url: `${base}/kpis/${id}/archive`,
        },
        {
          key: "put:/kpis/{id}:archived=true",
          method: "put",
          url: `${base}/kpis/${id}`,
          body: { kpi: { archived: true } },
        },
        {
          key: "patch:/kpis/{id}:archived=true",
          method: "patch",
          url: `${base}/kpis/${id}`,
          body: { kpi: { archived: true } },
        },
        {
          key: "delete:/kpis/{id}",
          method: "delete",
          url: `${base}/kpis/${id}`,
        },
        {
          key: "delete:/kpis/{id}.json",
          method: "delete",
          url: `${base}/kpis/${id}.json`,
        },
      ],
      cachedArchiveKey
    );
    for (const candidate of allCandidates) {
      try {
        await executeApiCandidate(candidate, headers);
        runtimeArchiveApiKey = candidate.key;
        runtimeArchiveApiBase = base;
        setCachedApiPreference(KPI_ARCHIVE_API_KEY_CACHE, candidate.key);
        setCachedApiPreference(KPI_ARCHIVE_API_BASE_CACHE, base);
        return true;
      } catch (err) {
        lastError = err;
      }
    }
  }
  throw new Error(`Archive failed for ${id}: ${getApiErrorMessage(lastError)}`);
};

const restoreKpi = async (id: string | number) => {
  const headers = archivedApiHeaders();
  const cachedRestoreBase =
    runtimeRestoreApiBase ?? getCachedApiPreference(KPI_RESTORE_API_BASE_CACHE);
  const cachedRestoreKey =
    runtimeRestoreApiKey ?? getCachedApiPreference(KPI_RESTORE_API_KEY_CACHE);
  const bases = prioritizeBases(
    Array.from(
      new Set(["https://fm-uat-api.lockated.com", ...getApiBaseCandidates()])
    ),
    cachedRestoreBase
  );
  let lastError: unknown = null;
  for (const base of bases) {
    const allCandidates = prioritizeCandidates(
      [
        {
          key: "post:/kpis/{id}/restore",
          method: "post",
          url: `${base}/kpis/${id}/restore`,
        },
        {
          key: "post:/kpis/{id}/restore.json",
          method: "post",
          url: `${base}/kpis/${id}/restore.json`,
        },
        {
          key: "post:/kpis/{id}/unarchive",
          method: "post",
          url: `${base}/kpis/${id}/unarchive`,
        },
        {
          key: "put:/kpis/{id}/restore",
          method: "put",
          url: `${base}/kpis/${id}/restore`,
        },
        {
          key: "patch:/kpis/{id}/restore",
          method: "patch",
          url: `${base}/kpis/${id}/restore`,
        },
        {
          key: "put:/kpis/{id}:archived=false",
          method: "put",
          url: `${base}/kpis/${id}`,
          body: { kpi: { archived: false } },
        },
        {
          key: "patch:/kpis/{id}:archived=false",
          method: "patch",
          url: `${base}/kpis/${id}`,
          body: { kpi: { archived: false } },
        },
      ],
      cachedRestoreKey
    );
    for (const candidate of allCandidates) {
      try {
        await executeApiCandidate(candidate, headers);
        runtimeRestoreApiKey = candidate.key;
        runtimeRestoreApiBase = base;
        setCachedApiPreference(KPI_RESTORE_API_KEY_CACHE, candidate.key);
        setCachedApiPreference(KPI_RESTORE_API_BASE_CACHE, base);
        return true;
      } catch (err) {
        lastError = err;
      }
    }
  }
  throw new Error(`Restore failed for ${id}: ${getApiErrorMessage(lastError)}`);
};

const deleteHistoryEntry = async (id: string | number) => {
  const headers = archivedApiHeaders();
  const bases = Array.from(
    new Set([...getApiBaseCandidates(), "https://fm-uat-api.lockated.com"])
  );
  let lastError: unknown = null;
  for (const base of bases) {
    const candidates = [
      { method: "delete" as const, url: `${base}/kpis/history/${id}.json` },
      { method: "delete" as const, url: `${base}/kpis/history/${id}` },
      {
        method: "post" as const,
        url: `${base}/kpis/history/${id}.json`,
        body: { _method: "delete" },
      },
      { method: "delete" as const, url: `${base}/kpis/${id}` },
    ];
    for (const candidate of candidates) {
      try {
        if (candidate.method === "delete") {
          await Axios.delete(candidate.url, { headers });
        } else {
          await Axios.post(
            candidate.url,
            (candidate as { body?: unknown }).body,
            { headers }
          );
        }
        return true;
      } catch (err) {
        lastError = err;
      }
    }
  }
  throw new Error(
    `History delete failed for ${id}: ${getApiErrorMessage(lastError)}`
  );
};

// ─────────────────────────────────────────────
// TAB CONFIG
// ─────────────────────────────────────────────
const tabs = [
  { name: "KPI Management" },
  { name: "Archived KPIs" },
  { name: "Missed Entries" },
  { name: "KPI History" },
  { name: "Settings" },
  { name: "KPI Guide" },
] as const;

// ─────────────────────────────────────────────
// KPI ROOT COMPONENT — restyled
// ─────────────────────────────────────────────
const KPI = () => {
  const [activeTab, setActiveTab] =
    useState<(typeof tabs)[number]["name"]>("KPI Management");
  const [kpis, setKpis] = useState<KPICardData[]>([]);
  const [createKpiOpen, setCreateKpiOpen] = useState(false);
  const [editKpiOpen, setEditKpiOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [companyUsers, setCompanyUsers] = useState<CompanyUser[]>(() =>
    getCachedCompanyUsers()
  );
  const [companyDepartments, setCompanyDepartments] = useState<
    CompanyDepartment[]
  >([]);
  const [kpiUnits, setKpiUnits] = useState<string[]>(DEFAULT_KPI_UNITS);
  const [kpiUnitIdMap, setKpiUnitIdMap] = useState<Record<string, number>>({});
  const [editingKpi, setEditingKpi] = useState<KPICardData | null>(null);
  const [isSavingKpiUnits, setIsSavingKpiUnits] = useState(false);
  const [archivedKpis, setArchivedKpis] = useState<ArchivedKPIEntry[]>([]);
  const [historyKpis, setHistoryKpis] = useState<KPIHistoryRow[]>([]);

  // ── Cache helpers (unchanged) ──
  const getOwnerCache = useCallback((): Record<string, string> => {
    try {
      const raw = localStorage.getItem(KPI_OWNER_CACHE_KEY);
      if (!raw) return {};
      const parsed = JSON.parse(raw) as Record<string, string>;
      return parsed && typeof parsed === "object" ? parsed : {};
    } catch {
      return {};
    }
  }, []);
  const getAssigneeCache = useCallback((): Record<string, number[]> => {
    try {
      const raw = localStorage.getItem(KPI_ASSIGNEE_CACHE_KEY);
      if (!raw) return {};
      const parsed = JSON.parse(raw) as Record<string, unknown>;
      if (!parsed || typeof parsed !== "object") return {};
      return Object.fromEntries(
        Object.entries(parsed).map(([k, v]) => [
          k,
          Array.isArray(v)
            ? v.map((id) => Number(id)).filter((id) => Number.isFinite(id))
            : [],
        ])
      );
    } catch {
      return {};
    }
  }, []);
  const getCachedOwnerName = useCallback(
    (kpiId: string): string | undefined => {
      const cache = getOwnerCache();
      return cache[kpiId];
    },
    [getOwnerCache]
  );
  const getCachedAssigneeIds = useCallback(
    (kpiId: string): number[] => {
      const cache = getAssigneeCache();
      return cache[kpiId] ?? [];
    },
    [getAssigneeCache]
  );
  const upsertOwnerCache = useCallback(
    (items: Array<{ id: string; owner?: string }>) => {
      const cache = getOwnerCache();
      let changed = false;
      for (const item of items) {
        const owner = item.owner?.trim();
        if (!owner || owner === "Unassigned") continue;
        if (cache[item.id] !== owner) {
          cache[item.id] = owner;
          changed = true;
        }
      }
      if (changed)
        localStorage.setItem(KPI_OWNER_CACHE_KEY, JSON.stringify(cache));
    },
    [getOwnerCache]
  );
  const upsertAssigneeCache = useCallback(
    (
      items: Array<{
        id: string;
        assigneeIds?: number[];
        assigneeId?: number | null;
      }>
    ) => {
      const cache = getAssigneeCache();
      let changed = false;
      for (const item of items) {
        const ids = Array.from(
          new Set(
            [
              ...(Array.isArray(item.assigneeIds) ? item.assigneeIds : []),
              item.assigneeId,
            ]
              .map((id) => Number(id))
              .filter((id) => Number.isFinite(id))
          )
        );
        if (ids.length === 0) continue;
        const prev = cache[item.id] ?? [];
        if (JSON.stringify(prev) !== JSON.stringify(ids)) {
          cache[item.id] = ids;
          changed = true;
        }
      }
      if (changed)
        localStorage.setItem(KPI_ASSIGNEE_CACHE_KEY, JSON.stringify(cache));
    },
    [getAssigneeCache]
  );

  const hydrateKpiAssignees = useCallback(
    <T extends KPICardData>(kpi: T): T => {
      const currentIds = Array.from(
        new Set(
          [
            ...(Array.isArray(kpi.assigneeIds) ? kpi.assigneeIds : []),
            kpi.assigneeId,
          ]
            .map((id) => Number(id))
            .filter((id) => Number.isFinite(id))
        )
      );
      if (currentIds.length > 0)
        return {
          ...kpi,
          assigneeIds: currentIds,
          assigneeId: currentIds[0] ?? null,
        };
      const cachedIds = getCachedAssigneeIds(String(kpi.id));
      if (cachedIds.length === 0) return kpi;
      return {
        ...kpi,
        assigneeIds: cachedIds,
        assigneeId: cachedIds[0] ?? null,
      };
    },
    [getCachedAssigneeIds]
  );

  const resolveOwnerName = useCallback(
    (
      owner: string | undefined,
      assigneeId: number | null | undefined,
      assigneeIds: number[] | undefined
    ) => {
      for (const id of [
        assigneeId,
        ...(Array.isArray(assigneeIds) ? assigneeIds : []),
      ]
        .map((id) => Number(id))
        .filter((id) => Number.isFinite(id))) {
        const user = companyUsers.find((u) => u.id === id);
        if (user?.name) return user.name;
      }
      return owner && owner.trim() ? owner : "Unassigned";
    },
    [companyUsers]
  );

  const hydrateKpiOwner = useCallback(
    <T extends KPICardData>(kpi: T): T => {
      const resolvedOwner = resolveOwnerName(
        kpi.owner,
        kpi.assigneeId,
        kpi.assigneeIds
      );
      if (resolvedOwner !== "Unassigned")
        return { ...kpi, owner: resolvedOwner };
      const cachedOwner = getCachedOwnerName(String(kpi.id));
      return cachedOwner
        ? { ...kpi, owner: cachedOwner }
        : { ...kpi, owner: resolvedOwner };
    },
    [getCachedOwnerName, resolveOwnerName]
  );

  const hydrateKpiData = useCallback(
    <T extends KPICardData>(kpi: T): T =>
      hydrateKpiOwner(hydrateKpiAssignees(kpi)),
    [hydrateKpiAssignees, hydrateKpiOwner]
  );

  const loadHistoryKpis = useCallback(async () => {
    try {
      const rows = await fetchHistoryKpis();
      setHistoryKpis(rows);
    } catch (err) {
      const msg = getApiErrorMessage(err);
      toast.error(`Failed to load KPI history: ${msg}`);
      setHistoryKpis([]);
    }
  }, []);

  const loadArchivedKpis = useCallback(async () => {
    try {
      const data = await fetchArchivedKpis();
      setArchivedKpis(data.map((kpi) => hydrateKpiData(kpi)));
    } catch (err) {
      const msg = getApiErrorMessage(err);
      toast.error(`Failed to load archived KPIs: ${msg}`);
      setArchivedKpis([]);
    }
  }, [hydrateKpiData]);

  useEffect(() => {
    const loadKpis = async () => {
      setIsLoading(true);
      try {
        const data = await fetchKpis();
        setKpis(data.map((kpi) => hydrateKpiData(kpi)));
      } catch (err) {
        const msg = getApiErrorMessage(err);
        toast.error(`Failed to load KPIs: ${msg}`);
        setKpis([]);
      } finally {
        setIsLoading(false);
      }
    };
    loadKpis();
  }, [hydrateKpiData]);

  useEffect(() => {
    loadArchivedKpis();
  }, [loadArchivedKpis]);
  useEffect(() => {
    loadHistoryKpis();
  }, [loadHistoryKpis]);
  useEffect(() => {
    if (activeTab === "KPI History") loadHistoryKpis();
  }, [activeTab, loadHistoryKpis]);
  useEffect(() => {
    const loadUsers = async () => {
      try {
        const users = await fetchCompanyUsers();
        setCompanyUsers(users);
        setCachedCompanyUsers(users);
      } catch (err) {
        const msg = getApiErrorMessage(err);
        console.error("Failed to load company users:", msg, err);
      }
    };
    loadUsers();
  }, []);
  useEffect(() => {
    if (companyUsers.length === 0) return;
    setKpis((prev) => prev.map((kpi) => hydrateKpiData(kpi)));
    setArchivedKpis((prev) => prev.map((kpi) => hydrateKpiData(kpi)));
  }, [companyUsers, hydrateKpiData]);
  useEffect(() => {
    upsertOwnerCache(
      kpis.map((kpi) => ({ id: String(kpi.id), owner: kpi.owner }))
    );
  }, [kpis, upsertOwnerCache]);
  useEffect(() => {
    upsertAssigneeCache(
      kpis.map((kpi) => ({
        id: String(kpi.id),
        assigneeIds: kpi.assigneeIds,
        assigneeId: kpi.assigneeId,
      }))
    );
  }, [kpis, upsertAssigneeCache]);
  useEffect(() => {
    upsertOwnerCache(
      archivedKpis.map((kpi) => ({ id: String(kpi.id), owner: kpi.owner }))
    );
  }, [archivedKpis, upsertOwnerCache]);
  useEffect(() => {
    upsertAssigneeCache(
      archivedKpis.map((kpi) => ({
        id: String(kpi.id),
        assigneeIds: kpi.assigneeIds,
        assigneeId: kpi.assigneeId,
      }))
    );
  }, [archivedKpis, upsertAssigneeCache]);
  useEffect(() => {
    const loadDepartments = async () => {
      try {
        const depts = await fetchCompanyDepartments();
        setCompanyDepartments(depts);
      } catch (err) {
        const msg = getApiErrorMessage(err);
        console.error("Failed to load company departments:", msg, err);
      }
    };
    loadDepartments();
  }, []);

  const handleSaveKpiUnits = async (units: string[]) => {
    const previousCount = kpiUnits.length;
    const nextCount = units.length;
    setIsSavingKpiUnits(true);
    try {
      const savedUnits = await upsertKpiUnitsConfiguration(units);
      setKpiUnits(savedUnits);
      toast.success(
        nextCount < previousCount
          ? "Deleted"
          : nextCount > previousCount
            ? "Added"
            : "Saved"
      );
    } catch (err) {
      const msg = getApiErrorMessage(err);
      toast.error("Failed to save");
      throw err;
    } finally {
      setIsSavingKpiUnits(false);
    }
  };

  const handleCreateKpiUnit = async (unit: string) => {
    const next = unit.trim();
    if (!next) return;
    setIsSavingKpiUnits(true);
    try {
      const createdId = await createKpiUnitConfiguration(next);
      setKpiUnits((prev) =>
        prev.some((u) => u.toLowerCase() === next.toLowerCase())
          ? prev
          : [...prev, next]
      );
      if (createdId)
        setKpiUnitIdMap((prev) => ({
          ...prev,
          [next.toLowerCase()]: createdId,
        }));
      toast.success("Added");
    } catch (err) {
      toast.error("Failed to add");
      throw err;
    } finally {
      setIsSavingKpiUnits(false);
    }
  };

  const handleDeleteKpiUnit = async (unit: string) => {
    const target = unit.trim();
    if (!target) return;
    const targetKey = target.toLowerCase();
    const unitId = kpiUnitIdMap[targetKey];
    const nextUnits = kpiUnits.filter(
      (u) => u.toLowerCase() !== target.toLowerCase()
    );
    setIsSavingKpiUnits(true);
    try {
      if (unitId) {
        await deleteKpiUnitConfiguration(unitId);
        setKpiUnits(nextUnits);
      } else {
        const savedUnits = await upsertKpiUnitsConfiguration(nextUnits);
        setKpiUnits(savedUnits.length > 0 ? savedUnits : nextUnits);
      }
      setKpiUnitIdMap((prev) => {
        const next = { ...prev };
        delete next[targetKey];
        return next;
      });
      toast.success("Deleted");
    } catch (err) {
      toast.error("Failed to delete");
      throw err;
    } finally {
      setIsSavingKpiUnits(false);
    }
  };

  const handleCreateKpi = async (kpiData: KPICardData) => {
    setIsCreating(true);
    try {
      const assigneeIds =
        Array.isArray(kpiData.assigneeIds) && kpiData.assigneeIds.length > 0
          ? kpiData.assigneeIds
          : kpiData.assigneeId != null
            ? [Number(kpiData.assigneeId)]
            : [];
      const payload: KpiPayload = {
        name: kpiData.name,
        description: kpiData.description,
        category: kpiData.tags?.[0] || "Operations",
        unit: kpiData.unit,
        frequency: kpiData.frequency?.toLowerCase() || "monthly",
        target_value: parseInt(String(kpiData.target), 10) || 0,
        current_value: parseInt(String(kpiData.value), 10) || 0,
        department_id: kpiData.departmentId || null,
        assignee_id: assigneeIds[0] ?? null,
        assignee_ids: assigneeIds,
        weight: kpiData.weight,
        priority: kpiData.priority,
      };
      const newKpi = await createKpi(payload);
      const resolvedAssigneeId = newKpi.assigneeId ?? assigneeIds[0] ?? null;
      const resolvedAssigneeIds =
        newKpi.assigneeIds && newKpi.assigneeIds.length > 0
          ? newKpi.assigneeIds
          : assigneeIds;
      const resolvedOwner = resolveOwnerName(
        newKpi.owner && newKpi.owner !== "Unassigned"
          ? newKpi.owner
          : kpiData.owner,
        resolvedAssigneeId,
        resolvedAssigneeIds
      );
      const mergedKpi: KPICardData = {
        ...newKpi,
        assigneeIds: resolvedAssigneeIds,
        assigneeId: resolvedAssigneeId,
        owner:
          resolvedOwner && resolvedOwner !== "Unassigned"
            ? resolvedOwner
            : kpiData.owner,
        priority:
          (kpiData.priority as KPICardData["priority"]) ?? newKpi.priority,
      };
      setKpis((prev) => [mergedKpi, ...prev]);
      setCreateKpiOpen(false);
      toast.success("KPI created successfully");
    } catch (err) {
      const msg = getApiErrorMessage(err);
      toast.error(`Failed to create KPI: ${msg}`);
    } finally {
      setIsCreating(false);
    }
  };

  const handleDeleteKpi = async (id: string | number) => {
    try {
      await deleteKpi(id);
      setKpis((prev) => prev.filter((k) => k.id !== String(id)));
      toast.success("KPI deleted successfully");
    } catch (err) {
      const msg = getApiErrorMessage(err);
      toast.error(`Failed to delete KPI: ${msg}`);
      throw err;
    }
  };

  const handleEditKpi = (kpi: KPICardData) => {
    setEditingKpi(kpi);
    setEditKpiOpen(true);
  };

  const handleUpdateKpi = async (formValues: EditKPIFormValues) => {
    setIsUpdating(true);
    try {
      const existing = kpis.find((k) => k.id === String(formValues.id));
      if (!existing) throw new Error("KPI not found for update");
      const payload: Partial<KpiPayload> & KpiUpdatePayload = {
        name: formValues.name,
        description: formValues.relatedUrl,
        category: formValues.departmentName,
        unit: formValues.unit,
        frequency: formValues.frequency,
        target_value: formValues.targetValue,
        current_value: formValues.currentValue,
        ...(formValues.departmentId != null
          ? { department_id: formValues.departmentId }
          : existing.departmentId != null
            ? { department_id: existing.departmentId }
            : {}),
        ...(formValues.assigneeId != null
          ? { assignee_id: formValues.assigneeId }
          : existing.assigneeId != null
            ? { assignee_id: existing.assigneeId }
            : {}),
        weight: formValues.weight ? parseInt(formValues.weight, 10) : undefined,
        priority: formValues.priority,
      };
      const updated = await updateKpi(formValues.id, payload);
      const resolvedAssigneeId =
        formValues.assigneeId ??
        updated.assigneeId ??
        existing.assigneeId ??
        null;
      const resolvedOwner = resolveOwnerName(
        updated.owner && updated.owner !== "Unassigned"
          ? updated.owner
          : existing.owner,
        resolvedAssigneeId,
        updated.assigneeIds
      );
      const mergedUpdated: KPICardData = {
        ...updated,
        assigneeId: resolvedAssigneeId,
        assigneeIds:
          updated.assigneeIds && updated.assigneeIds.length > 0
            ? updated.assigneeIds
            : resolvedAssigneeId != null
              ? [Number(resolvedAssigneeId)]
              : existing.assigneeIds,
        owner: resolvedOwner || existing.owner || "Unassigned",
        priority:
          (formValues.priority as KPICardData["priority"]) ?? updated.priority,
        weight: formValues.weight
          ? parseInt(formValues.weight, 10)
          : updated.weight,
      };
      setKpis((prev) =>
        prev.map((k) => (k.id === String(formValues.id) ? mergedUpdated : k))
      );
      setEditKpiOpen(false);
      setEditingKpi(null);
      toast.success("KPI updated successfully");
    } catch (err) {
      const msg = getApiErrorMessage(err);
      toast.error(`Failed to update KPI: ${msg}`);
      throw err;
    } finally {
      setIsUpdating(false);
    }
  };

  const handleManageUsersSave = async (
    kpiIds: string[],
    assigneeIds: number[]
  ) => {
    const selectedUsers = assigneeIds
      .map((id) => companyUsers.find((u) => u.id === id))
      .filter(
        (u): u is CompanyUser =>
          !!u && typeof u.name === "string" && u.name.trim().length > 0
      );
    const ownerName =
      selectedUsers.length > 0
        ? selectedUsers.map((u) => u.name.trim()).join(", ")
        : undefined;
    const updates = await Promise.all(
      kpiIds.map((kpiId) => assignKpiUsers(kpiId, assigneeIds, ownerName))
    );
    const byId = new Map(updates.map((kpi) => [String(kpi.id), kpi]));
    setKpis((prev) => prev.map((kpi) => byId.get(String(kpi.id)) ?? kpi));
  };

  const handleArchiveSelected = (ids: string[]) => {
    if (ids.length === 0) return;
    void (async () => {
      const idSet = new Set(ids);
      const selected = kpis.filter((k) => idSet.has(k.id));
      if (selected.length === 0) return;
      const results = await Promise.allSettled(
        selected.map((kpi) => archiveKpi(kpi.id))
      );
      const archivedAt = new Date().toLocaleDateString();
      const successIds = selected
        .filter((_, idx) => results[idx].status === "fulfilled")
        .map((kpi) => kpi.id);
      const successIdSet = new Set(successIds);
      const successEntries: ArchivedKPIEntry[] = selected
        .filter((kpi) => successIdSet.has(kpi.id))
        .map((kpi) => ({
          ...kpi,
          owner: kpi.owner?.trim() ? kpi.owner : "Unassigned",
          archivedDate: archivedAt,
          reason: "Archived manually",
        }));
      if (successEntries.length > 0) {
        setArchivedKpis((prev) => [...successEntries, ...prev]);
        setKpis((prev) => prev.filter((k) => !successIdSet.has(k.id)));
        setActiveTab("Archived KPIs");
        toast.success(`${successEntries.length} KPI(s) archived`);
        await loadArchivedKpis();
      }
      const failedCount = selected.length - successEntries.length;
      if (failedCount > 0)
        toast.error(`Failed to archive ${failedCount} KPI(s)`);
    })();
  };

  const handleRestoreArchivedKpi = (id: string) => {
    void (async () => {
      const target = archivedKpis.find((kpi) => kpi.id === id);
      if (!target) return;
      try {
        await restoreKpi(id);
        const { archivedDate: _a, reason: _r, ...restoredKpi } = target;
        setKpis((prev) => [restoredKpi, ...prev]);
        setArchivedKpis((prev) => prev.filter((kpi) => kpi.id !== id));
        toast.success("KPI restored to management");
        await loadArchivedKpis();
      } catch (err) {
        const msg = getApiErrorMessage(err);
        toast.error(`Failed to restore KPI: ${msg}`);
      }
    })();
  };

  const handleDeleteArchivedKpi = (id: string) => {
    setArchivedKpis((prev) => prev.filter((kpi) => kpi.id !== id));
    toast.success("Archived KPI removed");
  };

  const handleDeleteSelectedHistory = async (ids: string[]) => {
    if (ids.length === 0) return;
    const selectedHistoryIds = new Set(ids.map(String));
    const selectedRows = historyKpis.filter((row) =>
      selectedHistoryIds.has(String(row.id))
    );
    const resolvedKpiIds = Array.from(
      new Set(
        selectedRows
          .map(
            (row) => row.kpiId ?? kpis.find((k) => k.name === row.kpiName)?.id
          )
          .filter(
            (v): v is string => typeof v === "string" && v.trim().length > 0
          )
      )
    );
    if (resolvedKpiIds.length === 0)
      throw new Error("Unable to resolve KPI IDs for selected history rows");
    const resolvedKpiIdSet = new Set(resolvedKpiIds.map(String));
    const resolvedKpiNames = new Set(selectedRows.map((row) => row.kpiName));
    setKpis((prev) => prev.filter((k) => !resolvedKpiIdSet.has(String(k.id))));
    setArchivedKpis((prev) =>
      prev.filter((kpi) => !resolvedKpiIdSet.has(String(kpi.id)))
    );
    setHistoryKpis((prev) =>
      prev.filter((row) => {
        if (selectedHistoryIds.has(String(row.id))) return false;
        if (row.kpiId && resolvedKpiIdSet.has(String(row.kpiId))) return false;
        if (!row.kpiId && resolvedKpiNames.has(row.kpiName)) return false;
        return true;
      })
    );
    await Promise.all(resolvedKpiIds.map((kpiId) => deleteKpi(kpiId)));
    await loadHistoryKpis();
  };

  const { totalKPIs, onTargetCount, atRiskCount } = useMemo(() => {
    const onTargetCount = kpis.filter((k) => k.status === "on-target").length;
    const atRiskCount = kpis.filter((k) => k.status === "at-risk").length;
    return { totalKPIs: kpis.length, onTargetCount, atRiskCount };
  }, [kpis]);

  // ─────────────────────────────────────────────
  // RENDER — new design matching BhagSection / BusinessPlan
  // ─────────────────────────────────────────────
  return (
    <div
      style={{
        minHeight: "calc(100vh - 5rem)",
        background: T.pageBg,
        color: T.textMain,
        fontFamily: T.font,
        padding: "24px 16px",
      }}
    >
      {/* Global font import */}
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800;900&display=swap'); * { font-family: 'Poppins', sans-serif !important; }`}</style>

      <CreateKPIDialog
        open={createKpiOpen}
        onOpenChange={setCreateKpiOpen}
        onCreated={handleCreateKpi}
        isLoading={isCreating}
        users={companyUsers}
        departments={companyDepartments}
        units={kpiUnits}
      />
      <EditKPIDialog
        open={editKpiOpen}
        onOpenChange={setEditKpiOpen}
        kpi={editingKpi}
        users={companyUsers}
        departments={companyDepartments}
        units={kpiUnits}
        isLoading={isUpdating}
        onSubmit={handleUpdateKpi}
      />

      <div
        style={{
          maxWidth: 1280,
          margin: "0 auto",
          display: "flex",
          flexDirection: "column",
          gap: 24,
        }}
      >
        {/* ── PAGE HEADER — matches BusinessPlan header ── */}
        <div
          style={{
            borderRadius: 20,
            overflow: "hidden",
            border: `1px solid ${T.primaryBord}`,
            background: `rgba(218,119,86,0.10)`,
            boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
            padding: "28px 32px",
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 20,
          }}
        >
          <div>
            <p
              style={{
                fontSize: 10,
                fontWeight: 800,
                textTransform: "uppercase",
                letterSpacing: "0.18em",
                color: T.textMuted,
                marginBottom: 6,
              }}
            >
              Monitor and manage performance metrics
            </p>
            <h1
              style={{
                fontSize: 28,
                fontWeight: 900,
                letterSpacing: "-0.02em",
                color: "#111",
                margin: 0,
                lineHeight: 1.2,
              }}
            >
              KPIs
            </h1>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              flexWrap: "wrap",
            }}
          >
            {/* KPI Guide button — ghost style */}
            <button
              onClick={() => setActiveTab("KPI Guide")}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "10px 20px",
                borderRadius: 14,
                border: `1px solid ${T.primaryBord}`,
                background: T.cardBg,
                color: T.primary,
                fontSize: 13,
                fontWeight: 700,
                cursor: "pointer",
                boxShadow: "0 1px 3px rgba(0,0,0,0.07)",
                transition: "all 0.15s",
                fontFamily: T.font,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = T.primaryBg;
                e.currentTarget.style.borderColor = T.primaryBordStr;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = T.cardBg;
                e.currentTarget.style.borderColor = T.primaryBord;
              }}
            >
              <BookOpen size={15} />
              KPI Guide
            </button>

            {/* New KPI button — filled */}
            <button
              onClick={() => setCreateKpiOpen(true)}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "10px 24px",
                borderRadius: 14,
                border: "none",
                background: T.primary,
                color: "#fff",
                fontSize: 13,
                fontWeight: 700,
                cursor: "pointer",
                boxShadow: "0 2px 8px rgba(218,119,86,0.30)",
                transition: "background 0.15s",
                fontFamily: T.font,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = T.primaryHov;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = T.primary;
              }}
            >
              <Plus size={15} />
              New KPI
            </button>
          </div>
        </div>

        {/* ── STAT CARDS — styled like BhagSection card style ── */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: 16,
          }}
        >
          {/* Total KPIs */}
          <div
            style={{
              background: T.cardBg,
              borderRadius: 20,
              border: `1px solid ${T.primaryBord}`,
              borderTop: `4px solid ${T.primary}`,
              padding: "20px 22px",
              boxShadow: "0 1px 4px rgba(0,0,0,0.07)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 12,
            }}
          >
            <div>
              <p
                style={{
                  fontSize: 11,
                  fontWeight: 800,
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  color: T.textMuted,
                  marginBottom: 6,
                }}
              >
                Total KPIs
              </p>
              <p
                style={{
                  fontSize: 36,
                  fontWeight: 900,
                  color: T.textMain,
                  margin: 0,
                  lineHeight: 1,
                }}
              >
                {totalKPIs}
              </p>
            </div>
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: "50%",
                background: `rgba(218,119,86,0.12)`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <BarChart3 size={22} color={T.primary} />
            </div>
          </div>

          {/* On Target */}
          <div
            style={{
              background: "#f0fdf4",
              borderRadius: 20,
              border: "1px solid rgba(134,239,172,0.5)",
              borderTop: "4px solid #22c55e",
              padding: "20px 22px",
              boxShadow: "0 1px 4px rgba(0,0,0,0.07)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 12,
            }}
          >
            <div>
              <p
                style={{
                  fontSize: 11,
                  fontWeight: 800,
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  color: "#166534",
                  marginBottom: 6,
                }}
              >
                On Target
              </p>
              <p
                style={{
                  fontSize: 36,
                  fontWeight: 900,
                  color: "#14532d",
                  margin: 0,
                  lineHeight: 1,
                }}
              >
                {onTargetCount}
              </p>
            </div>
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: "50%",
                background: "#dcfce7",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <span
                style={{
                  width: 20,
                  height: 20,
                  borderRadius: "50%",
                  background: "#22c55e",
                  display: "block",
                }}
              />
            </div>
          </div>

          {/* At Risk */}
          <div
            style={{
              background: "#fff1f2",
              borderRadius: 20,
              border: "1px solid rgba(252,165,165,0.5)",
              borderTop: "4px solid #ef4444",
              padding: "20px 22px",
              boxShadow: "0 1px 4px rgba(0,0,0,0.07)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 12,
            }}
          >
            <div>
              <p
                style={{
                  fontSize: 11,
                  fontWeight: 800,
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  color: "#991b1b",
                  marginBottom: 6,
                }}
              >
                At Risk
              </p>
              <p
                style={{
                  fontSize: 36,
                  fontWeight: 900,
                  color: "#7f1d1d",
                  margin: 0,
                  lineHeight: 1,
                }}
              >
                {atRiskCount}
              </p>
            </div>
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: "50%",
                background: "#fee2e2",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <span
                style={{
                  width: 20,
                  height: 20,
                  borderRadius: "50%",
                  background: "#ef4444",
                  display: "block",
                }}
              />
            </div>
          </div>
        </div>

        <Tabs
          value={activeTab}
          onValueChange={(v) =>
            setActiveTab(v as (typeof tabs)[number]["name"])
          }
          className="w-full"
        >
          {/* Pill tabs — match Feedback.tsx */}
          <TabsList className="inline-flex h-12 w-full items-center justify-start gap-2 rounded-full border border-[#DA7756]/20 bg-[#f6f4ee] px-2 shadow-sm sm:w-auto">
            {tabs.map(({ name }) => (
              <TabsTrigger
                key={name}
                value={name}
                className="h-9 rounded-full px-5 text-sm font-semibold text-neutral-500 transition-colors hover:text-neutral-700 data-[state=active]:bg-[#DA7756] data-[state=active]:text-white data-[state=active]:shadow-sm"
              >
                {name}
              </TabsTrigger>
            ))}
          </TabsList>

          <div
            style={{
              background: T.pageBg,
              borderRadius: 20,
            }}
          >
            <TabsContent value="KPI Management" className="mt-6">
              <KPIManagementTab
                kpis={kpis}
                setKpis={setKpis}
                onDeleteKpi={handleDeleteKpi}
                onEditKpi={handleEditKpi}
                onArchiveSelected={handleArchiveSelected}
                onManageUsersSave={handleManageUsersSave}
                users={companyUsers}
                departments={companyDepartments}
              />
            </TabsContent>
            <TabsContent value="Archived KPIs" className="mt-6">
              <ArchivedKPIsTab
                archived={archivedKpis}
                onRestoreKpi={handleRestoreArchivedKpi}
                onDeleteArchivedKpi={handleDeleteArchivedKpi}
              />
            </TabsContent>
            <TabsContent value="Missed Entries" className="mt-6">
              <MissedEntitiesTab
                users={companyUsers}
                departments={companyDepartments}
                kpis={kpis.map((kpi) => ({ id: kpi.id, name: kpi.name }))}
              />
            </TabsContent>
            <TabsContent value="KPI History" className="mt-6">
              <KPIHistoryTab
                users={companyUsers}
                departments={companyDepartments}
                kpis={kpis.map((kpi) => ({ id: kpi.id, name: kpi.name }))}
                entries={historyKpis}
                onDeleteSelected={handleDeleteSelectedHistory}
              />
            </TabsContent>
            <TabsContent value="Settings" className="mt-6">
              <KPISettingsTab
                units={kpiUnits}
                isSaving={isSavingKpiUnits}
                onSave={handleSaveKpiUnits}
                onAddUnit={handleCreateKpiUnit}
                onDeleteUnit={handleDeleteKpiUnit}
              />
            </TabsContent>
            <TabsContent value="KPI Guide" className="mt-6">
              <KPIGuideTab
                onGoToManagement={() => setActiveTab("KPI Management")}
              />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
};

export default KPI;
