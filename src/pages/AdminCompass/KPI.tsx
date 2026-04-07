// ─────────────────────────────────────────────
// KPI.tsx  —  Root component
// ─────────────────────────────────────────────
import React, { useMemo, useState, useEffect } from "react";
import Axios from "axios";
import { BookOpen, Plus, BarChart3 } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
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
import {
  BASE_URL as ADMIN_COMPASS_BASE_URL,
  C,
  getAuthHeaders as getAdminCompassAuthHeaders,
  kpiClass,
} from "./AdminCompassComponent/Shared";
import {
  type ArchivedKPIEntry,
  type KPICardData,
} from "./AdminCompassComponent/kpiTypes";
import { getBaseUrl, getToken as getAuthToken } from "@/utils/auth";

// ─────────────────────────────────────────────
// API CONFIG
// ─────────────────────────────────────────────
const DEFAULT_BASE_URL = "https://fm-uat-api.lockated.com";
const KPI_LIST_ENDPOINTS = ["/kpis", "/api/kpis"] as const;

type RawKpiData = {
  id?: string | number;
  kpi_name?: string;
  name?: string;
  assignee_name?: string;
  assignee?: string | { name?: string; full_name?: string };
  target_value?: number;
  current_value?: number;
  unit?: string;
  frequency?: string;
  category?: string;
  priority?: string;
  department_id?: number;
  assignee_id?: number;
  description?: string;
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
};

type KpiUpdatePayload = {
  current_value: number;
  target_value: number;
  frequency: "weekly" | "monthly" | "quarterly";
};

type CompanyUser = {
  id: number;
  name: string;
  email?: string;
  departmentId?: number;
};

type CompanyDepartment = {
  id: number;
  name: string;
};

type RawCompanyUser = {
  id?: number | string;
  name?: string;
  full_name?: string;
  firstname?: string;
  lastname?: string;
  email?: string;
  official_email?: string;
  work_email?: string;
  department_id?: number | string;
  dept_id?: number | string;
};

type RawDepartment = {
  id?: number | string;
  name?: string;
  department_name?: string;
  title?: string;
};

type RawExtraField = {
  group_name?: string;
  values?: unknown;
  field_description?: string;
};

const KPI_UNITS_GROUP_NAME = "kpi_units_configuration";
const KPI_UNITS_UAT_TOKEN =
  "eyJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjo4Nzk4OX0.pHlLUDAbJSUJbV-wTIdDyuXScLS7MKbPY9P3BZ8TmzI";
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

const getApiBaseUrl = () => getBaseUrl() || DEFAULT_BASE_URL;

const getApiBaseCandidates = () => {
  const fromAuth = getBaseUrl();
  const candidates = [fromAuth, DEFAULT_BASE_URL].filter(
    (v): v is string => typeof v === "string" && v.length > 0
  );
  return Array.from(new Set(candidates));
};

const apiHeaders = () => ({
  ...(getToken()
    ? {}
    : (() => {
        throw new Error("Missing auth token. Please login again.");
      })()),
  Accept: "application/json",
  "Content-Type": "application/json",
  Authorization: `Bearer ${getToken()}`,
});

const adminCompassHeaders = () => {
  getToken();
  return getAdminCompassAuthHeaders();
};

const getKpiUnitsApiHeaders = () => ({
  Accept: "application/json",
  "Content-Type": "application/json",
  Authorization: `Bearer ${localStorage.getItem("admin_compass_uat_token") || KPI_UNITS_UAT_TOKEN}`,
});

const KPI_UNITS_QUERY_URLS = [
  `${ADMIN_COMPASS_BASE_URL}/extra_fields?q[group_name_in][]=${KPI_UNITS_GROUP_NAME}&include_grouped=true`,
  `${ADMIN_COMPASS_BASE_URL}/extra_fields?group_name=${KPI_UNITS_GROUP_NAME}`,
];

const withNoCacheTs = (url: string): string => {
  const separator = url.includes("?") ? "&" : "?";
  return `${url}${separator}_ts=${Date.now()}`;
};

const getApiErrorMessage = (error: unknown): string => {
  if (Axios.isAxiosError(error)) {
    const status = error.response?.status;
    const data = error.response?.data as
      | { message?: string; error?: string; errors?: string[] }
      | undefined;
    const message =
      data?.message ?? data?.error ?? (Array.isArray(data?.errors) ? data.errors[0] : undefined);

    if (status) return `HTTP ${status}${message ? `: ${message}` : ""}`;
    return error.message || "Network error";
  }

  if (error instanceof Error) return error.message;
  return "Unexpected error";
};

const fetchCompanyUsers = async (): Promise<CompanyUser[]> => {
  const { data } = await Axios.get(
    `${getApiBaseUrl()}/pms/users/get_escalate_to_users.json`,
    { headers: apiHeaders() }
  );

  const rawUsers = Array.isArray(data)
    ? data
    : (data.users ?? data.fm_users ?? data.data ?? []);

  if (!Array.isArray(rawUsers)) return [];

  return rawUsers
    .map((u: RawCompanyUser) => ({
      id: Number(u.id),
      name:
        u.name ??
        u.full_name ??
        [u.firstname, u.lastname].filter(Boolean).join(" ") ??
        `User ${u.id}`,
      email: u.email ?? u.official_email ?? u.work_email,
      departmentId:
        u.department_id != null
          ? Number(u.department_id)
          : u.dept_id != null
            ? Number(u.dept_id)
            : undefined,
    }))
    .filter((u: CompanyUser) => Number.isFinite(u.id) && !!u.name);
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
  const readValues = (values: unknown): string[] =>
    Array.isArray(values)
      ? values.filter((v): v is string => typeof v === "string" && v.trim().length > 0)
      : [];

  if (Array.isArray(json)) {
    const record = (json as RawExtraField[]).find(
      (r) => r.group_name === KPI_UNITS_GROUP_NAME
    );
    return readValues(record?.values);
  }

  if (json && typeof json === "object") {
    const obj = json as Record<string, unknown>;

    const grouped = obj.extra_fields as
      | Record<string, { values?: unknown }>
      | RawExtraField[]
      | undefined;

    if (grouped && !Array.isArray(grouped)) {
      return readValues(grouped[KPI_UNITS_GROUP_NAME]?.values);
    }

    if (Array.isArray(grouped)) {
      const record = grouped.find((r) => r.group_name === KPI_UNITS_GROUP_NAME);
      return readValues(record?.values);
    }

    const extraField = obj.extra_field as RawExtraField | undefined;
    if (extraField?.group_name === KPI_UNITS_GROUP_NAME) {
      return readValues(extraField.values);
    }

    const directRecord = obj as RawExtraField;
    if (directRecord.group_name === KPI_UNITS_GROUP_NAME) {
      return readValues(directRecord.values);
    }
  }

  return [];
};

const fetchKpiUnitsConfiguration = async (): Promise<string[]> => {
  let lastError: unknown = null;

  for (const url of KPI_UNITS_QUERY_URLS) {
    try {
      const requestUrl = withNoCacheTs(url);
      console.warn("[KPI Units] GET extra_fields:", requestUrl);

      const response = await fetch(requestUrl, {
        method: "GET",
        headers: getKpiUnitsApiHeaders(),
        cache: "no-store",
      });

      const rawText = await response.text();
      console.warn("[KPI Units] GET status:", response.status);
      console.warn("[KPI Units] GET raw (first 600):", rawText.slice(0, 600));

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${rawText.slice(0, 200)}`);
      }

      let json: unknown = [];
      try {
        json = rawText ? JSON.parse(rawText) : [];
      } catch {
        json = [];
      }

      const extracted = extractUnitValues(json);
      if (extracted.length > 0) return extracted;
    } catch (error) {
      console.error("[KPI Units] GET failed:", error);
      lastError = error;
    }
  }

  if (lastError) throw lastError;
  return [];
};

const upsertKpiUnitsConfiguration = async (values: string[]): Promise<string[]> => {
  const payload = {
    extra_field: {
      group_name: KPI_UNITS_GROUP_NAME,
      values,
      field_description: "KPI units master v2",
    },
  };

  console.warn("[KPI Units] POST bulk_upsert payload:", payload);

  const requestUrl = withNoCacheTs(`${ADMIN_COMPASS_BASE_URL}/extra_fields/bulk_upsert`);
  console.warn("[KPI Units] POST extra_fields:", requestUrl);

  const response = await fetch(requestUrl, {
    method: "POST",
    headers: getKpiUnitsApiHeaders(),
    body: JSON.stringify(payload),
    cache: "no-store",
  });

  console.warn("[KPI Units] POST status:", response.status);

  if (!response.ok) {
    let message = `HTTP ${response.status}`;
    try {
      const errorData = (await response.json()) as {
        message?: string;
        error?: string;
        errors?: string[];
      };
      const errorMessage =
        errorData.message ??
        errorData.error ??
        (Array.isArray(errorData.errors) ? errorData.errors[0] : undefined);
      if (errorMessage) {
        message = `${message}: ${errorMessage}`;
      }
      console.error("[KPI Units] POST error body:", errorData);
    } catch {
      // Ignore parse failures and fall back to status-only message.
    }
    throw new Error(message);
  }

  const data = await response.json();
  console.warn("[KPI Units] POST response:", data);

  const extracted = extractUnitValues(data);
  if (extracted.length > 0) {
    return extracted;
  }

  const refreshedValues = await fetchKpiUnitsConfiguration();
  return refreshedValues.length > 0 ? refreshedValues : values;
};

// ─────────────────────────────────────────────
// API NORMALIZATION & FUNCTIONS
// ─────────────────────────────────────────────

const normalizeKpiFromAPI = (raw: RawKpiData): KPICardData => {
  const categoryMap: Record<string, string> = {
    Sales: "Sales",
    Operations: "Operations",
    Finance: "Finance",
    Accounts: "Accounts",
    HR: "HR",
    IT: "IT",
    Marketing: "Marketing",
  };

  const priorityMap: Record<string, "low" | "medium" | "high"> = {
    low: "low",
    medium: "medium",
    high: "high",
  };

  const priority = (priorityMap[raw.priority?.toLowerCase() ?? "medium"] ??
    "medium") as "low" | "medium" | "high";

  return {
    id: String(raw.id ?? Math.random()),
    name: raw.name ?? raw.kpi_name ?? "Untitled KPI",
    owner:
      raw.assignee_name ??
      (typeof raw.assignee === "string"
        ? raw.assignee
        : raw.assignee?.name ?? raw.assignee?.full_name) ??
      "Unassigned",
    target: raw.target_value ?? 0,
    value: raw.current_value ?? 0,
    unit: raw.unit ?? "%",
    status: calculateStatus(raw.current_value, raw.target_value),
    frequency: (raw.frequency?.toLowerCase() === "weekly"
      ? "Weekly"
      : raw.frequency?.toLowerCase() === "quarterly"
        ? "Quarterly"
        : "Monthly") as KPICardData["frequency"],
    badge: "Active",
    color: "bg-sky-100",
    tags: [raw.category ?? categoryMap[raw.category] ?? "Operations", "Individual"],
    priority,
    departmentId: raw.department_id,
    assigneeId: raw.assignee_id,
    description: raw.description,
    _raw: raw,
  };
};

const calculateStatus = (current: number, target: number): KPICardData["status"] => {
  if (!target || target === 0) return "on-target";
  const percentage = (current / target) * 100;
  if (percentage >= 80) return "on-target";
  if (percentage >= 50) return "at-risk";
  return "off-target";
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
      } catch (error) {
        lastError = error;
      }
    }
  }

  throw lastError ?? new Error("Failed to load KPI data from API");
};

const fetchKpiById = async (id: string | number): Promise<KPICardData | null> => {
  try {
    const { data: json } = await Axios.get(`${getApiBaseUrl()}/kpis/${id}`, {
      headers: apiHeaders(),
    });
    const data = json.data ?? json.kpi ?? json;
    return normalizeKpiFromAPI(data);
  } catch (error) {
    console.error("Fetch KPI error:", error);
    return null;
  }
};

const createKpi = async (payload: KpiPayload) => {
  try {
    const { data: json } = await Axios.post(
      `${getApiBaseUrl()}/kpis`,
      { kpi: payload },
      {
        headers: apiHeaders(),
      }
    );
    return normalizeKpiFromAPI(json.data ?? json.kpi ?? json);
  } catch (error) {
    console.error("Create KPI error:", error);
    throw error;
  }
};

const updateKpi = async (
  id: string | number,
  payload: Partial<KpiPayload> & KpiUpdatePayload
) => {
  try {
    const { data: json } = await Axios.put(
      `${getApiBaseUrl()}/kpis/${id}`,
      { kpi: payload },
      {
        headers: apiHeaders(),
      }
    );
    return normalizeKpiFromAPI(json.data ?? json.kpi ?? json);
  } catch (error) {
    console.error("Update KPI error:", error);
    throw error;
  }
};

const deleteKpi = async (id: string | number) => {
  try {
    await Axios.delete(`${getApiBaseUrl()}/kpis/${id}`, {
      headers: apiHeaders(),
    });
    return true;
  } catch (error) {
    console.error("Delete KPI error:", error);
    throw error;
  }
};
const tabs = [
  { name: "KPI Management" },
  { name: "Archived KPIs" },
  { name: "Missed Entries" },
  { name: "KPI History" },
  { name: "Settings" },
  { name: "KPI Guide" },
] as const;

const KPI = () => {
  const [activeTab, setActiveTab] =
    useState<(typeof tabs)[number]["name"]>("KPI Management");
  const [kpis, setKpis] = useState<KPICardData[]>([]);
  const [createKpiOpen, setCreateKpiOpen] = useState(false);
  const [editKpiOpen, setEditKpiOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [companyUsers, setCompanyUsers] = useState<CompanyUser[]>([]);
  const [companyDepartments, setCompanyDepartments] = useState<CompanyDepartment[]>([]);
  const [kpiUnits, setKpiUnits] = useState<string[]>(DEFAULT_KPI_UNITS);
  const [editingKpi, setEditingKpi] = useState<KPICardData | null>(null);
  const [isSavingKpiUnits, setIsSavingKpiUnits] = useState(false);
  const [archivedKpis, setArchivedKpis] = useState<ArchivedKPIEntry[]>([]);

  // Fetch KPIs on component mount
  useEffect(() => {
    const loadKpis = async () => {
      setIsLoading(true);
      try {
        const data = await fetchKpis();
        setKpis(data);
      } catch (error) {
        const msg = getApiErrorMessage(error);
        console.error("Failed to load KPIs:", msg, error);
        toast.error(`Failed to load KPIs: ${msg}`);
        setKpis([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadKpis();
  }, []);

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const users = await fetchCompanyUsers();
        setCompanyUsers(users);
      } catch (error) {
        const msg = getApiErrorMessage(error);
        console.error("Failed to load company users:", msg, error);
      }
    };

    loadUsers();
  }, []);

  useEffect(() => {
    const loadDepartments = async () => {
      try {
        const depts = await fetchCompanyDepartments();
        setCompanyDepartments(depts);
      } catch (error) {
        const msg = getApiErrorMessage(error);
        console.error("Failed to load company departments:", msg, error);
      }
    };

    loadDepartments();
  }, []);

  useEffect(() => {
    const loadKpiUnits = async () => {
      try {
        const fromApi = await fetchKpiUnitsConfiguration();
        setKpiUnits(fromApi.length > 0 ? fromApi : DEFAULT_KPI_UNITS);
      } catch (error) {
        const msg = getApiErrorMessage(error);
        console.error("Failed to load KPI units configuration:", msg, error);
        setKpiUnits(DEFAULT_KPI_UNITS);
      }
    };

    loadKpiUnits();
  }, []);

  const handleSaveKpiUnits = async (units: string[]) => {
    const previousCount = kpiUnits.length;
    const nextCount = units.length;

    setIsSavingKpiUnits(true);
    try {
      const savedUnits = await upsertKpiUnitsConfiguration(units);
      setKpiUnits(savedUnits);
      if (nextCount < previousCount) {
        toast.success("Deleted");
      } else if (nextCount > previousCount) {
        toast.success("Added");
      } else {
        toast.success("Saved");
      }
    } catch (error) {
      const msg = getApiErrorMessage(error);
      console.error("Update KPI units configuration error:", msg, error);
      toast.error("Failed to save");
      throw error;
    } finally {
      setIsSavingKpiUnits(false);
    }
  };

  const handleCreateKpi = async (kpiData: KPICardData) => {
    setIsCreating(true);
    try {
      // Transform form data to API format
      const payload: KpiPayload = {
        name: kpiData.name,
        description: kpiData.description,
        category: kpiData.tags?.[0] || "Operations",
        unit: kpiData.unit,
        frequency: kpiData.frequency?.toLowerCase() || "monthly",
        target_value: parseFloat(String(kpiData.target)) || 0,
        current_value: parseFloat(String(kpiData.value)) || 0,
        department_id: kpiData.departmentId || null,
        assignee_id: kpiData.assigneeId || null,
      };

      const newKpi = await createKpi(payload);
      setKpis((prev) => [newKpi, ...prev]);
      setCreateKpiOpen(false);
      toast.success("KPI created successfully");
    } catch (error) {
      const msg = getApiErrorMessage(error);
      console.error("Create KPI error:", msg, error);
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
    } catch (error) {
      const msg = getApiErrorMessage(error);
      console.error("Delete KPI error:", msg, error);
      toast.error(`Failed to delete KPI: ${msg}`);
      throw error;
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
        department_id: formValues.departmentId,
        assignee_id: formValues.assigneeId ?? existing.assigneeId ?? null,
      };

      const updated = await updateKpi(formValues.id, payload);
      setKpis((prev) =>
        prev.map((k) => (k.id === String(formValues.id) ? updated : k))
      );
      setEditKpiOpen(false);
      setEditingKpi(null);
      toast.success("KPI updated successfully");
    } catch (error) {
      const msg = getApiErrorMessage(error);
      console.error("Update KPI error:", msg, error);
      toast.error(`Failed to update KPI: ${msg}`);
      throw error;
    } finally {
      setIsUpdating(false);
    }
  };

  const handleArchiveSelected = (ids: string[]) => {
    if (ids.length === 0) return;

    const idSet = new Set(ids);
    const selected = kpis.filter((k) => idSet.has(k.id));
    if (selected.length === 0) return;

    const archivedAt = new Date().toLocaleDateString();
    const archivedEntries: ArchivedKPIEntry[] = selected.map((kpi) => ({
      ...kpi,
      archivedDate: archivedAt,
      reason: "Archived manually",
    }));

    setArchivedKpis((prev) => [...archivedEntries, ...prev]);
    setKpis((prev) => prev.filter((k) => !idSet.has(k.id)));
    setActiveTab("Archived KPIs");
    toast.success(`${selected.length} KPI(s) archived`);
  };

  const handleRestoreArchivedKpi = (id: string) => {
    const target = archivedKpis.find((kpi) => kpi.id === id);
    if (!target) return;

    const { archivedDate: _archivedDate, reason: _reason, ...restoredKpi } = target;
    setKpis((prev) => [restoredKpi, ...prev]);
    setArchivedKpis((prev) => prev.filter((kpi) => kpi.id !== id));
    toast.success("KPI restored to management");
  };

  const handleDeleteArchivedKpi = (id: string) => {
    setArchivedKpis((prev) => prev.filter((kpi) => kpi.id !== id));
    toast.success("Archived KPI removed");
  };

  const { totalKPIs, onTargetCount, atRiskCount } = useMemo(() => {
    const onTargetCount = kpis.filter((k) => k.status === "on-target").length;
    const atRiskCount = kpis.filter((k) => k.status === "at-risk").length;
    return { totalKPIs: kpis.length, onTargetCount, atRiskCount };
  }, [kpis]);

  return (
    <div
      className="mx-auto w-full max-w-7xl rounded-b-[28px] rounded-t-none border border-[rgba(218,119,86,0.16)] border-t-0 bg-[#f6f4ee] shadow-[0_18px_50px_rgba(15,23,42,0.05)]"
      style={{ background: C.pageBg, color: C.textMain }}
    >
      <CreateKPIDialog
        open={createKpiOpen}
        onOpenChange={setCreateKpiOpen}
        onCreated={handleCreateKpi}
        isLoading={isCreating}
        users={companyUsers}
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
      <div className="p-6 pb-0">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-[#1a1a1a] sm:text-[40px] sm:leading-tight">
              KPIs
            </h1>
            <p className="mt-1.5 text-[15px] text-neutral-500">
              Monitor and manage performance metrics
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => setActiveTab("KPI Guide")}
              className={cn(
                "inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-[#DA7756] shadow-sm transition-colors",
                kpiClass.borderStrong,
                kpiClass.surfacePanel,
                "hover:bg-[#f3ebe8]"
              )}
            >
              <BookOpen className="h-4 w-4" />
              KPI Guide
            </button>
            <button
              type="button"
              onClick={() => setCreateKpiOpen(true)}
              className="inline-flex items-center gap-2 rounded-xl bg-[#DA7756] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#c9674a]"
            >
              <Plus className="h-4 w-4" />
              New KPI
            </button>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-[rgba(218,119,86,0.22)] bg-[#fef6f4] px-5 py-5 shadow-sm">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-neutral-600">
                  Total KPIs
                </p>
                <p className="mt-1 text-4xl font-bold leading-none text-[#1a1a1a]">
                  {totalKPIs}
                </p>
              </div>
              <BarChart3 className="h-9 w-9 text-[#DA7756]" />
            </div>
          </div>
          <div className="rounded-2xl border border-emerald-200/70 bg-emerald-50/90 px-5 py-5 shadow-sm">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-neutral-600">
                  On Target
                </p>
                <p className="mt-1 text-4xl font-bold leading-none text-emerald-800">
                  {onTargetCount}
                </p>
              </div>
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-emerald-100">
                <span className="h-5 w-5 rounded-full bg-emerald-500" />
              </span>
            </div>
          </div>
          <div className="rounded-2xl border border-red-200/70 bg-red-50/90 px-5 py-5 shadow-sm">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-neutral-600">
                  At Risk
                </p>
                <p className="mt-1 text-4xl font-bold leading-none text-red-800">
                  {atRiskCount}
                </p>
              </div>
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-red-100">
                <span className="h-5 w-5 rounded-full bg-red-500" />
              </span>
            </div>
          </div>
        </div>

        <div className="mt-6 flex gap-1 rounded-xl border border-[rgba(218,119,86,0.15)] bg-[#eceae4] p-1 shadow-[inset_0_1px_1px_rgba(255,255,255,0.75)] overflow-x-auto">
          {tabs.map(({ name }) => {
            const isActive = activeTab === name;
            return (
              <button
                key={name}
                type="button"
                onClick={() => setActiveTab(name)}
                className={cn(
                  "flex min-w-0 flex-1 items-center justify-center whitespace-nowrap rounded-lg px-3 py-2.5 text-sm font-semibold transition-all duration-150 sm:px-4",
                  isActive
                    ? cn(
                        "border text-[#1a1a1a] shadow-sm",
                        kpiClass.borderStrong,
                        kpiClass.surfacePanel
                      )
                    : "border border-transparent bg-transparent text-neutral-600 hover:bg-[#fef6f4]/80 hover:text-[#1a1a1a]"
                )}
              >
                {name}
              </button>
            );
          })}
        </div>
      </div>

      <div className="px-6 pt-5 pb-2">
        {activeTab === "KPI Management" && (
          <KPIManagementTab
            kpis={kpis}
            setKpis={setKpis}
            onDeleteKpi={handleDeleteKpi}
            onEditKpi={handleEditKpi}
            onArchiveSelected={handleArchiveSelected}
            users={companyUsers}
            departments={companyDepartments}
          />
        )}
        {activeTab === "Archived KPIs" && (
          <ArchivedKPIsTab
            archived={archivedKpis}
            onRestoreKpi={handleRestoreArchivedKpi}
            onDeleteArchivedKpi={handleDeleteArchivedKpi}
          />
        )}
        {activeTab === "Missed Entries" && (
          <MissedEntitiesTab
            users={companyUsers}
            departments={companyDepartments}
            kpis={kpis.map((kpi) => ({ id: kpi.id, name: kpi.name }))}
          />
        )}
        {activeTab === "KPI History" && (
          <KPIHistoryTab
            users={companyUsers}
            departments={companyDepartments}
            kpis={kpis.map((kpi) => ({ id: kpi.id, name: kpi.name }))}
          />
        )}
        {activeTab === "Settings" && (
          <KPISettingsTab
            units={kpiUnits}
            isSaving={isSavingKpiUnits}
            onSave={handleSaveKpiUnits}
            onAddUnit={handleSaveKpiUnits}
          />
        )}
        {activeTab === "KPI Guide" && (
          <KPIGuideTab
            onGoToManagement={() => setActiveTab("KPI Management")}
          />
        )}
      </div>
    </div>
  );
};

export default KPI;
