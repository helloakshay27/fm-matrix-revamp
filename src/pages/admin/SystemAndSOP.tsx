import React, { useCallback, useEffect, useMemo, useState } from "react";
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
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

// ─────────────────────────────────────────────
// API CONFIG
// ─────────────────────────────────────────────
const BASE_URL = "https://fm-uat-api.lockated.com";

const getToken = () => localStorage.getItem("auth_token") || "";

// Apna current logged in user id yahan se get karein
const getUserId = () => localStorage.getItem("user_id") || "1";

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
  const res = await fetch(`${BASE_URL}/system_sops`, { headers: apiHeaders() });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const json = await res.json();
  const arr = Array.isArray(json)
    ? json
    : (json.data ?? json.system_sops ?? []);
  return arr.map(normalizeSopFromAPI);
};

const fetchMySops = async (): Promise<SopCardData[]> => {
  const userId = getUserId();
  // Changed to assignee_id_eq so it fetches SOPs assigned to the user
  const res = await fetch(
    `${BASE_URL}/system_sops?q[assignee_id_eq]=${userId}`,
    { headers: apiHeaders() }
  );
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const json = await res.json();
  const arr = Array.isArray(json)
    ? json
    : (json.data ?? json.system_sops ?? []);
  return arr.map(normalizeSopFromAPI);
};

const createSop = async (payload: any) => {
  const res = await fetch(`${BASE_URL}/system_sops`, {
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
  const res = await fetch(`${BASE_URL}/system_sops/${id}`, {
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
  const res = await fetch(`${BASE_URL}/system_sops/${id}`, {
    method: "PATCH",
    headers: apiHeaders(),
    body: JSON.stringify({ system_sop: { status } }),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return true;
};

const deleteSop = async (id: string) => {
  const res = await fetch(`${BASE_URL}/system_sops/${id}`, {
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

const PRIORITY_STYLES: Record<SopCardData["priority"], string> = {
  low: "bg-sky-100 text-sky-900",
  medium: "bg-orange-100 text-orange-900",
  high: "bg-rose-100 text-rose-900",
};

const DEPARTMENTS = [
  "Front End",
  "Client Servicing",
  "Accounts",
  "Engineering",
  "QA",
  "Human Resources",
  "Design",
  "Marketing",
] as const;

const MOCK_ASSIGNEES = [
  { value: "1", label: "Jane Smith" },
  { value: "2", label: "Ravi Kumar" },
  { value: "3", label: "Priya Sharma" },
  { value: "123", label: "Adhip Shetty" },
];

const DEPT_ID_MAP: Record<string, number> = {
  "Front End": 1,
  "Client Servicing": 2,
  Accounts: 3,
  Engineering: 4,
  QA: 5,
  "Human Resources": 6,
  Design: 7,
  Marketing: 8,
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
// DIALOGS
// ─────────────────────────────────────────────
function SopFormDialog({
  open,
  onOpenChange,
  isEdit,
  initialData,
  onSave,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isEdit: boolean;
  initialData?: SopCardData | null;
  onSave: (data: any, column: ColumnKey) => Promise<void>;
}) {
  const [systemName, setSystemName] = useState("");
  const [description, setDescription] = useState("");
  const [department, setDepartment] = useState("");
  const [statusColumn, setStatusColumn] = useState<ColumnKey>("toStart");
  const [priority, setPriority] = useState<SopCardData["priority"]>("medium");
  const [assignUser, setAssignUser] = useState("");
  const [healthScore, setHealthScore] = useState<number[]>([0]);
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
        setHealthScore([initialData.healthPercent]);
        setDocUrl(initialData.docUrl ?? "");
        setKpiInvoice((initialData.kpis ?? []).some((k) => k.kpi_id === 10));
      } else {
        setSystemName("");
        setDescription("");
        setDepartment("");
        setStatusColumn("toStart");
        setPriority("medium");
        setAssignUser("");
        setHealthScore([0]);
        setDocUrl("");
        setKpiInvoice(false);
      }
    }
  }, [open, isEdit, initialData]);

  const handleSubmit = async () => {
    const name = systemName.trim();
    if (!name) return toast.error("Please enter a system name");
    if (!department) return toast.error("Please select a department");
    if (!assignUser) return toast.error("Please assign a user");

    setIsSaving(true);
    try {
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
        system_name: name,
        description: description.trim() || undefined,
        department_id: DEPT_ID_MAP[department] ?? 1,
        status: COL_TO_STATUS[statusColumn],
        priority: priority.charAt(0).toUpperCase() + priority.slice(1),
        assignee_id: parseInt(assignUser, 10),
        health_score: healthScore[0] ?? 0,
        documentation_url: docUrl.trim() || undefined,
        kpis: isEdit ? initialData?.kpis : kpis, // Only modify KPIs if new, simplify for demo
      };
      await onSave(payload, statusColumn);
    } finally {
      setIsSaving(false);
    }
  };

  const fw = (bc: string, bg: string, children: React.ReactNode) => (
    <div
      className={cn("rounded-xl border-2 px-3 py-2.5 sm:px-4 sm:py-3", bc, bg)}
    >
      {children}
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[92vh] max-w-2xl overflow-y-auto rounded-2xl border border-[#DA7756]/20 bg-[#fef6f4] p-0 shadow-xl">
        <div className="sticky top-0 z-10 flex items-start justify-between gap-3 border-b border-neutral-100 bg-[#fef6f4] px-5 py-4">
          <DialogHeader className="m-0 flex-1 space-y-0 p-0 text-left">
            <DialogTitle className="flex items-center gap-2 text-xl font-bold text-[#DA7756]">
              {isEdit ? (
                <Pencil className="h-5 w-5 shrink-0 text-[#C72030]" />
              ) : (
                <Plus className="h-5 w-5 shrink-0 text-[#C72030]" />
              )}
              {isEdit ? "Edit System/SOP" : "Add New System/SOP"}
            </DialogTitle>
          </DialogHeader>
          <div className="flex shrink-0 items-center gap-2">
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="rounded-lg p-2 text-neutral-500 hover:bg-neutral-100"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="space-y-4 px-5 py-5 sm:px-6">
          {fw(
            "border-neutral-200",
            "bg-white",
            <>
              <Label className="font-semibold text-neutral-900">
                System Name <span className="text-[#DA7756]">*</span>
              </Label>
              <input
                value={systemName}
                onChange={(e) => setSystemName(e.target.value)}
                className="mt-2 h-11 w-full rounded-xl border border-neutral-200 bg-white px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-[#DA7756]/25"
              />
            </>
          )}

          {fw(
            "border-neutral-200",
            "bg-neutral-50/30",
            <>
              <Label className="font-semibold text-neutral-900">
                Description
              </Label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="mt-2 min-h-[88px] resize-y rounded-xl border-neutral-200 bg-white text-sm"
              />
            </>
          )}

          <div className="grid gap-4 sm:grid-cols-2">
            {fw(
              "border-neutral-200",
              "bg-white",
              <>
                <Label className="font-semibold text-neutral-900">
                  Department <span className="text-[#DA7756]">*</span>
                </Label>
                <Select
                  value={department || undefined}
                  onValueChange={setDepartment}
                >
                  <SelectTrigger className="mt-2 h-11 rounded-xl border-neutral-200 bg-white">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    {DEPARTMENTS.map((d) => (
                      <SelectItem key={d} value={d}>
                        {d}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </>
            )}
            {fw(
              "border-sky-200/90",
              "bg-sky-50/40",
              <>
                <Label className="font-semibold text-neutral-900">
                  Status <span className="text-[#DA7756]">*</span>
                </Label>
                <Select
                  value={statusColumn}
                  onValueChange={(v) => setStatusColumn(v as ColumnKey)}
                >
                  <SelectTrigger className="mt-2 h-11 rounded-xl border-neutral-200 bg-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="toStart">
                      <span className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-sky-600" /> To Start
                      </span>
                    </SelectItem>
                    <SelectItem value="broken">
                      <span className="flex items-center gap-2">
                        <XCircle className="h-4 w-4 text-rose-600" /> Broken
                      </span>
                    </SelectItem>
                    <SelectItem value="running">
                      <span className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-emerald-600" />{" "}
                        Running
                      </span>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </>
            )}
          </div>

          {fw(
            "border-orange-200/90",
            "bg-orange-50/40",
            <>
              <Label className="font-semibold text-neutral-900">Priority</Label>
              <Select
                value={priority}
                onValueChange={(v) => setPriority(v as SopCardData["priority"])}
              >
                <SelectTrigger className="mt-2 h-11 rounded-xl border-neutral-200 bg-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">
                    <span className="flex items-center gap-2">
                      <Circle className="h-3.5 w-3.5 text-sky-500" /> Low
                    </span>
                  </SelectItem>
                  <SelectItem value="medium">
                    <span className="flex items-center gap-2">
                      <Circle className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />{" "}
                      Medium
                    </span>
                  </SelectItem>
                  <SelectItem value="high">
                    <span className="flex items-center gap-2">
                      <Circle className="h-3.5 w-3.5 text-rose-500" /> High
                    </span>
                  </SelectItem>
                </SelectContent>
              </Select>
            </>
          )}

          {fw(
            "border-neutral-200",
            "bg-white",
            <>
              <Label className="font-semibold text-neutral-900">
                Assign to User <span className="text-[#DA7756]">*</span>
              </Label>
              <Select
                value={assignUser || undefined}
                onValueChange={setAssignUser}
              >
                <SelectTrigger className="mt-2 h-11 rounded-xl border-neutral-200 bg-white">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-violet-500" />
                    <SelectValue placeholder="Select user" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  {MOCK_ASSIGNEES.map((u) => (
                    <SelectItem key={u.value} value={u.value}>
                      {u.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </>
          )}

          {/* DYNAMIC FILL SLIDER */}
          {fw(
            "border-emerald-200/90",
            "bg-emerald-50/40",
            <>
              <div className="flex items-center justify-between gap-2">
                <Label className="font-semibold text-neutral-900">
                  Health Score
                </Label>
                <span className="text-sm font-semibold tabular-nums text-emerald-600">
                  {healthScore[0] ?? 0}%
                </span>
              </div>
              <input
                type="range"
                min={0}
                max={100}
                step={1}
                value={healthScore[0] ?? 0}
                onChange={(e) =>
                  setHealthScore([parseInt(e.target.value, 10) || 0])
                }
                className="mt-4 w-full h-2.5 appearance-none rounded-full cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/50 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-[3px] [&::-webkit-slider-thumb]:border-emerald-500 [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:border-[3px] [&::-moz-range-thumb]:border-emerald-500 [&::-moz-range-thumb]:shadow-md"
                style={{
                  background: `linear-gradient(to right, #10b981 0%, #10b981 ${healthScore[0] ?? 0}%, #e5e7eb ${healthScore[0] ?? 0}%, #e5e7eb 100%)`,
                }}
              />
            </>
          )}

          {fw(
            "border-cyan-200/90",
            "bg-cyan-50/40",
            <>
              <Label className="font-semibold text-neutral-900">
                Documentation URL
              </Label>
              <input
                type="url"
                value={docUrl}
                onChange={(e) => setDocUrl(e.target.value)}
                placeholder="https://..."
                className="mt-2 h-11 w-full rounded-xl border border-neutral-200 bg-white px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-[#DA7756]/25"
              />
            </>
          )}

          {!isEdit &&
            fw(
              "border-amber-200/90",
              "bg-amber-50/40",
              <>
                <Label className="font-semibold text-neutral-900">
                  Link KPIs
                </Label>
                <div className="mt-3 rounded-xl border border-neutral-200/80 bg-white p-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <div className="flex items-center gap-2">
                      <Checkbox
                        id="add-kpi-invoices"
                        checked={kpiInvoice}
                        onCheckedChange={(c) => setKpiInvoice(c === true)}
                      />
                      <label
                        htmlFor="add-kpi-invoices"
                        className="text-sm font-medium text-neutral-800"
                      >
                        Invoices Raised
                      </label>
                    </div>
                    <span className="rounded-md bg-neutral-100 px-2 py-0.5 text-xs text-neutral-600">
                      Invoices
                    </span>
                  </div>
                </div>
              </>
            )}
        </div>

        <div className="sticky bottom-0 z-10 flex items-center justify-end gap-2 border-t border-neutral-100 bg-[#fef6f4] px-5 py-4 sm:px-6">
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="inline-flex h-10 items-center rounded-xl border border-neutral-200 bg-white px-4 text-sm font-semibold text-neutral-700 hover:bg-neutral-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSaving}
            className="inline-flex h-10 items-center gap-1.5 rounded-xl bg-[#DA7756] px-4 text-sm font-semibold text-white shadow-sm hover:bg-[#DA7756]/85 disabled:opacity-60"
          >
            {isSaving ? (
              <RefreshCw className="h-4 w-4 animate-spin" />
            ) : isEdit ? (
              <Save className="h-4 w-4" />
            ) : (
              <Sparkles className="h-4 w-4" />
            )}
            {isSaving ? "Saving…" : isEdit ? "Update SOP" : "Create SOP"}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ─────────────────────────────────────────────
// KANBAN CARD
// ─────────────────────────────────────────────
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
  const statusBadge =
    column === "running" ? (
      <span className="rounded-md bg-emerald-100 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-emerald-900">
        Running
      </span>
    ) : column === "toStart" ? (
      <span className="rounded-md bg-sky-100 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-sky-900">
        To start
      </span>
    ) : (
      <span className="rounded-md bg-rose-100 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-rose-800">
        Broken
      </span>
    );
  const barClass =
    column === "running"
      ? "bg-emerald-500"
      : column === "toStart"
        ? "bg-sky-400"
        : "bg-rose-500";

  return (
    <div
      {...(dragHandleProps ?? {})}
      className={cn(
        "rounded-xl border border-neutral-200/90 bg-white p-3 shadow-sm",
        dragHandleProps &&
          "cursor-grab touch-manipulation select-none active:cursor-grabbing"
      )}
    >
      <p className="font-semibold leading-snug text-neutral-900">
        {item.title}
      </p>
      <div className="mt-2 flex flex-wrap gap-1.5">
        <span className="rounded-md bg-neutral-100 px-2 py-0.5 text-xs font-medium text-neutral-700">
          {item.department}
        </span>
        <span
          className={cn(
            "rounded-md px-2 py-0.5 text-xs font-medium capitalize",
            PRIORITY_STYLES[item.priority]
          )}
        >
          {item.priority}
        </span>
        {item.assigneeName && (
          <span className="rounded-md bg-violet-100 px-2 py-0.5 text-xs font-medium text-violet-800">
            {item.assigneeName}
          </span>
        )}
      </div>
      <div className="mt-3 space-y-1.5">
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs font-medium text-neutral-600">Health</span>
          {statusBadge}
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-neutral-200">
          <div
            className={cn("h-full rounded-full transition-colors", barClass)}
            style={{ width: `${health}%` }}
          />
        </div>
        <p className="text-right text-[11px] font-medium tabular-nums text-neutral-500">
          {health}%
        </p>
      </div>
      <div className="mt-3 flex items-center gap-2">
        <button
          type="button"
          onPointerDown={(e) => e.stopPropagation()}
          onClick={(e) => {
            e.stopPropagation();
            onEditClick?.();
          }}
          className="inline-flex min-h-9 flex-1 items-center justify-center gap-1.5 rounded-xl bg-[#DA7756] px-3 text-xs font-semibold text-white shadow-sm hover:bg-[#DA7756]/85"
        >
          <Pencil className="h-3.5 w-3.5" /> Edit
        </button>
        <button
          type="button"
          onPointerDown={(e) => e.stopPropagation()}
          onClick={(e) => {
            e.stopPropagation();
            onDuplicateClick?.();
          }}
          className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-neutral-300 bg-white text-neutral-600 shadow-sm hover:bg-neutral-50"
        >
          <Copy className="h-3.5 w-3.5" />
        </button>
        <button
          type="button"
          onPointerDown={(e) => e.stopPropagation()}
          onClick={(e) => {
            e.stopPropagation();
            onDeleteClick?.();
          }}
          className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-rose-200 bg-white text-rose-600 shadow-sm hover:bg-rose-50"
        >
          <Trash2 className="h-3.5 w-3.5" />
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
      className={cn(
        "flex min-h-[200px] min-w-0 flex-1 flex-col rounded-xl border-2 border-dashed border-transparent p-1 transition-colors",
        isOver && "border-[#DA7756]/50 bg-black/[0.02]"
      )}
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
    badgeClass: "bg-sky-600 text-white",
    headerIconClass: "text-sky-600",
    panelClass: "bg-sky-50/90 border-sky-200/60",
    emptyIcon: Clock,
    emptyIconClass: "text-sky-400",
  },
  {
    key: "broken" as const,
    title: "Broken",
    icon: XCircle,
    badgeClass: "bg-rose-600 text-white",
    headerIconClass: "text-rose-600",
    panelClass: "bg-rose-50/90 border-rose-200/60",
    emptyIcon: XCircle,
    emptyIconClass: "text-rose-400",
  },
  {
    key: "running" as const,
    title: "Running",
    icon: CheckCircle2,
    badgeClass: "bg-[#2E7D32] text-white",
    headerIconClass: "text-[#2E7D32]",
    panelClass: "bg-[#E3F4E8]/90 border-emerald-200/60",
    emptyIcon: CheckCircle2,
    emptyIconClass: "text-emerald-500",
  },
];

function FilterSelect({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (val: string) => void;
}) {
  const getOptions = () => {
    if (label === "All Status")
      return [
        { value: "all", label: "All Status" },
        { value: "toStart", label: "To Start" },
        { value: "broken", label: "Broken" },
        { value: "running", label: "Running" },
      ];
    if (label === "All Departments")
      return [
        { value: "all", label: "All Departments" },
        ...DEPARTMENTS.map((d) => ({ value: d, label: d })),
      ];
    if (label === "All People")
      return [
        { value: "all", label: "All People" },
        ...MOCK_ASSIGNEES.map((p) => ({ value: p.value, label: p.label })),
      ];
    if (label === "All Priorities")
      return [
        { value: "all", label: "All Priorities" },
        { value: "low", label: "Low" },
        { value: "medium", label: "Medium" },
        { value: "high", label: "High" },
      ];
    return [{ value: "all", label }];
  };
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="h-10 w-full min-w-[140px] rounded-xl border-neutral-200 bg-white text-sm">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-neutral-400 flex-shrink-0" />
          <SelectValue placeholder={label} />
        </div>
      </SelectTrigger>
      <SelectContent>
        {getOptions().map((o) => (
          <SelectItem key={o.value} value={o.value}>
            {o.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

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
        label: `Dept: ${filterDept}`,
        onClear: () => setFilterDept("all"),
      });
    if (filterAssignee !== "all") {
      const assigneeName =
        MOCK_ASSIGNEES.find((a) => a.value === filterAssignee)?.label ||
        filterAssignee;
      filters.push({
        id: "assignee",
        label: `Person: ${assigneeName}`,
        onClear: () => setFilterAssignee("all"),
      });
    }
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
  }, [filterDept, filterAssignee, filterPriority, filterStatus]);

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

  const KanbanGrid = () => (
    <div className="grid gap-4 lg:grid-cols-3">
      {COLUMN_META.map((col) => {
        const Icon = col.icon;
        const EmptyIcon = col.emptyIcon;
        const list = displayedByCol[col.key];
        const hasCards = list.length > 0;

        return (
          <Card
            key={col.key}
            className={cn(
              "flex min-h-[280px] flex-col rounded-2xl border shadow-sm",
              col.panelClass
            )}
          >
            <div className="flex items-center gap-2 border-b border-neutral-200/40 bg-white/60 px-3 py-3 sm:px-4">
              <Icon className={cn("h-5 w-5 shrink-0", col.headerIconClass)} />
              <span className="min-w-0 flex-1 text-sm font-semibold text-neutral-900">
                {col.title}
              </span>
              <span
                className={cn(
                  "rounded-full px-2 py-0.5 text-xs font-bold tabular-nums",
                  col.badgeClass
                )}
              >
                {counts[col.key]}
              </span>
            </div>
            <div className="flex flex-1 flex-col p-3 sm:p-4">
              <SopColumnBody
                colKey={col.key}
                emptySlot={
                  !hasCards ? (
                    <div className="pointer-events-none flex flex-1 flex-col items-center justify-center py-6">
                      <div className="flex w-full flex-col items-center justify-center rounded-xl border-2 border-dashed border-neutral-300/80 bg-white/50 py-10">
                        <EmptyIcon
                          className={cn("mb-2 h-10 w-10", col.emptyIconClass)}
                          strokeWidth={1.25}
                        />
                        <p className="text-sm font-medium text-neutral-500">
                          No systems here
                        </p>
                      </div>
                    </div>
                  ) : null
                }
              >
                {hasCards && (
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
          </Card>
        );
      })}
    </div>
  );

  return (
    <div className="min-h-[calc(100vh-5rem)] bg-[#f6f4ee] px-4 py-6 sm:px-6">
      <SopFormDialog
        open={editOpen}
        onOpenChange={(o) => {
          setEditOpen(o);
          if (!o) setEditTarget(null);
        }}
        isEdit={true}
        initialData={editTarget?.item}
        onSave={handleEditSave}
      />
      <SopFormDialog
        open={addOpen}
        onOpenChange={setAddOpen}
        isEdit={false}
        onSave={handleAddCreate}
      />

      <div className="mx-auto max-w-6xl space-y-6">
        {bannerVisible && (
          <div className="flex items-center gap-3 rounded-2xl border border-sky-200/60 bg-sky-50/90 px-4 py-3 shadow-sm pr-2">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-sky-500">
              <Lightbulb className="h-5 w-5 text-white" strokeWidth={2} />
            </div>
            <button type="button" className="min-w-0 flex-1 text-left">
              <p className="text-sm font-semibold text-sky-950">
                Creating Systems &amp; SOPs
              </p>
              <p className="text-xs text-sky-700/90">Click to view tips</p>
            </button>
            <div className="flex shrink-0 items-center gap-0.5">
              <button
                type="button"
                className="rounded-md p-2 text-sky-700 hover:bg-sky-100"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
              <button
                type="button"
                className="rounded-md p-2 text-sky-700 hover:bg-sky-100"
                onClick={() => setBannerVisible(false)}
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-neutral-900 sm:text-3xl">
              Systems &amp; SOPs
            </h1>
            <p className="mt-1 text-sm text-neutral-500 sm:text-base">
              Monitor your business systems health
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
            <div className="inline-flex rounded-full bg-neutral-200/70 p-1">
              <button
                type="button"
                onClick={() => setSopTab("my")}
                className={cn(
                  "rounded-full px-4 py-2 text-sm font-medium transition-all",
                  sopTab === "my"
                    ? "bg-white text-neutral-900 shadow-sm"
                    : "text-neutral-600 hover:text-neutral-900"
                )}
              >
                My SOPs
              </button>
              <button
                type="button"
                onClick={() => setSopTab("all")}
                className={cn(
                  "rounded-full px-4 py-2 text-sm font-medium transition-all",
                  sopTab === "all"
                    ? "bg-white text-neutral-900 shadow-sm"
                    : "text-neutral-600 hover:text-neutral-900"
                )}
              >
                All SOPs
              </button>
            </div>
            <button
              type="button"
              onClick={loadSops}
              className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-neutral-200 bg-white text-neutral-600 shadow-sm hover:bg-neutral-50"
            >
              <RefreshCw
                className={cn("h-4 w-4", isLoading && "animate-spin")}
              />
            </button>
            <button
              type="button"
              onClick={() => setAddOpen(true)}
              className="inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-xl bg-[#DA7756] px-4 text-sm font-semibold text-white shadow-sm hover:bg-[#DA7756]/85 sm:px-5"
            >
              <Plus className="h-4 w-4" strokeWidth={2} /> Add System
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <Card className="rounded-2xl border border-[#DA7756]/20 bg-[#DA7756]/10 p-3 shadow-sm sm:p-4">
            <div className="flex flex-col gap-3 lg:flex-row lg:flex-wrap lg:items-center">
              <div className="grid flex-1 grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-4">
                <FilterSelect
                  label="All Departments"
                  value={filterDept}
                  onChange={setFilterDept}
                />
                <FilterSelect
                  label="All People"
                  value={filterAssignee}
                  onChange={setFilterAssignee}
                />
                <FilterSelect
                  label="All Priorities"
                  value={filterPriority}
                  onChange={setFilterPriority}
                />
                <FilterSelect
                  label="All Status"
                  value={filterStatus}
                  onChange={setFilterStatus}
                />
              </div>
              <div className="relative min-w-0 lg:min-w-[180px] lg:max-w-xs lg:flex-shrink-0">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
                <input
                  type="search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search systems..."
                  className="h-10 w-full rounded-xl border border-neutral-200 bg-white py-2 pl-10 pr-3 text-sm placeholder:text-neutral-400 outline-none focus-visible:ring-2 focus-visible:ring-[#DA7756]/25"
                />
              </div>
            </div>
          </Card>

          {activeFilters.length > 0 && (
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold text-neutral-500">
                Active Filters:
              </span>
              {activeFilters.map((f) => (
                <span
                  key={f.id}
                  className="inline-flex items-center gap-1 rounded-full bg-[#DA7756]/10 pl-2.5 pr-1.5 py-1 text-xs font-medium text-[#DA7756] border border-[#DA7756]/20 shadow-sm"
                >
                  {f.label}
                  <button
                    onClick={f.onClear}
                    className="hover:bg-[#DA7756]/20 rounded-full p-0.5 transition-colors"
                  >
                    <X className="h-3 w-3" />
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
                className="text-xs font-semibold text-neutral-500 hover:text-neutral-800 underline underline-offset-2 ml-1 transition-colors"
              >
                Clear All
              </button>
            </div>
          )}
        </div>

        {apiError && (
          <div className="flex items-center gap-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 shadow-sm">
            <AlertTriangle className="h-4 w-4 shrink-0" />
            <span className="flex-1">Failed to load SOPs: {apiError}</span>
            <button
              type="button"
              onClick={loadSops}
              className="inline-flex items-center gap-1.5 rounded-xl border border-red-200 bg-white px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50"
            >
              <RefreshCw className="h-3.5 w-3.5" /> Retry
            </button>
          </div>
        )}

        {isLoading ? (
          <div className="grid gap-4 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="rounded-2xl border border-neutral-200 bg-white p-4 animate-pulse space-y-3"
              >
                <div className="h-4 bg-neutral-100 rounded w-1/2" />
                {[1, 2, 3].map((j) => (
                  <div key={j} className="h-24 bg-neutral-100 rounded-xl" />
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
            <KanbanGrid />
            <DragOverlay dropAnimation={null}>
              {activeItem && activeColumn ? (
                <div className="w-[min(100vw-2rem,320px)] cursor-grabbing opacity-95 shadow-xl">
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

        {!isLoading &&
          !apiError &&
          counts.toStart === 0 &&
          counts.broken === 0 &&
          counts.running === 0 && (
            <Card className="rounded-2xl border border-[#DA7756]/20 bg-[#DA7756]/10 py-16 shadow-sm">
              <div className="flex flex-col items-center justify-center px-4 text-center">
                <FileText
                  className="mb-4 h-14 w-14 text-[#DA7756]/40"
                  strokeWidth={1.25}
                />
                <p className="text-lg font-semibold text-neutral-900">
                  No systems found
                </p>
                <p className="mt-2 max-w-md text-sm text-neutral-500">
                  Add your first system/SOP or clear active filters
                </p>
              </div>
            </Card>
          )}
      </div>
    </div>
  );
};

export default SystemAndSOP;
