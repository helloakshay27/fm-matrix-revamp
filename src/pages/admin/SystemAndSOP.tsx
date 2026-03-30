import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  CheckCircle2,
  ChevronRight,
  Circle,
  Clock,
  Copy,
  FileText,
  Filter,
  GripVertical,
  Lightbulb,
  Pencil,
  Plus,
  Save,
  Search,
  Sparkles,
  Trash2,
  User,
  X,
  XCircle,
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
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

type SopTab = "my" | "all";

type ColumnKey = "toStart" | "broken" | "running";

type SopCardData = {
  id: string;
  title: string;
  department: string;
  priority: "low" | "medium" | "high";
  healthPercent: number;
  description?: string;
  docUrl?: string;
};

const ALL_SOPS_BROKEN_MOCK: SopCardData[] = [
  {
    id: "1",
    title: "Accounts Operational Tracker",
    department: "Front End",
    priority: "medium",
    healthPercent: 0,
  },
  {
    id: "2",
    title: "Onboarding Process",
    department: "Front End",
    priority: "medium",
    healthPercent: 0,
  },
  {
    id: "3",
    title: "Client Escalation Workflow",
    department: "Client Servicing",
    priority: "high",
    healthPercent: 0,
  },
  {
    id: "4",
    title: "Monthly Close Checklist",
    department: "Accounts",
    priority: "medium",
    healthPercent: 0,
  },
  {
    id: "5",
    title: "Release Deployment Runbook",
    department: "Engineering",
    priority: "high",
    healthPercent: 0,
  },
  {
    id: "6",
    title: "Incident Response Playbook",
    department: "QA",
    priority: "low",
    healthPercent: 0,
  },
  {
    id: "7",
    title: "Vendor Onboarding SOP",
    department: "Human Resources",
    priority: "medium",
    healthPercent: 0,
  },
];

const PRIORITY_STYLES: Record<SopCardData["priority"], string> = {
  low: "bg-sky-100 text-sky-900",
  medium: "bg-orange-100 text-orange-900",
  high: "bg-rose-100 text-rose-900",
};

const initialColumns = (): Record<ColumnKey, SopCardData[]> => ({
  toStart: [],
  broken: ALL_SOPS_BROKEN_MOCK.map((c) => ({ ...c })),
  running: [],
});

function healthForColumn(col: ColumnKey): number {
  if (col === "running") return 100;
  return 0;
}

const SOP_KANBAN_STORAGE_KEY = "fm-system-sops-kanban-v1";

function loadColumnsFromStorage(): Record<ColumnKey, SopCardData[]> {
  try {
    const raw = localStorage.getItem(SOP_KANBAN_STORAGE_KEY);
    if (!raw) return initialColumns();
    const parsed = JSON.parse(raw) as Record<string, unknown>;
    if (
      !Array.isArray(parsed.toStart) ||
      !Array.isArray(parsed.broken) ||
      !Array.isArray(parsed.running)
    ) {
      return initialColumns();
    }
    return {
      toStart: parsed.toStart as SopCardData[],
      broken: parsed.broken as SopCardData[],
      running: parsed.running as SopCardData[],
    };
  } catch {
    return initialColumns();
  }
}

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
  { value: "u1", label: "Jane Smith" },
  { value: "u2", label: "Ravi Kumar" },
  { value: "u3", label: "Priya Sharma" },
  { value: "u4", label: "Adhip Shetty" },
];

function EditSystemSopDialog({
  open,
  onOpenChange,
  item,
  column,
  onSave,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item: SopCardData | null;
  column: ColumnKey | null;
  onSave: (next: SopCardData, targetColumn: ColumnKey) => void;
}) {
  const [systemName, setSystemName] = useState("");
  const [description, setDescription] = useState("");
  const [department, setDepartment] = useState("");
  const [statusColumn, setStatusColumn] = useState<ColumnKey>("broken");
  const [priority, setPriority] = useState<SopCardData["priority"]>("medium");
  const [assignUser, setAssignUser] = useState<string>("");
  const [healthScore, setHealthScore] = useState<number[]>([0]);
  const [docUrl, setDocUrl] = useState("");
  const [kpiInvoice, setKpiInvoice] = useState(false);

  useEffect(() => {
    if (!open || !item || !column) return;
    setSystemName(item.title);
    setDescription(item.description ?? "");
    setDepartment(item.department);
    setStatusColumn(column);
    setPriority(item.priority);
    setAssignUser("");
    setHealthScore([item.healthPercent]);
    setDocUrl(item.docUrl ?? "");
    setKpiInvoice(false);
  }, [open, item, column]);

  const handleSubmit = () => {
    if (!item) return;
    const next: SopCardData = {
      ...item,
      title: systemName.trim() || item.title,
      department,
      priority,
      healthPercent: healthScore[0] ?? 0,
      description: description.trim() || undefined,
      docUrl: docUrl.trim() || undefined,
    };
    onSave(next, statusColumn);
  };

  const fieldWrap = (borderClass: string, bgClass: string, children: React.ReactNode) => (
    <div
      className={cn(
        "rounded-xl border-2 px-3 py-2.5 sm:px-4 sm:py-3",
        borderClass,
        bgClass
      )}
    >
      {children}
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[92vh] max-w-2xl overflow-y-auto rounded-2xl border border-[#DA7756]/20 bg-[#fef6f4] p-0 shadow-xl sm:max-w-2xl">
        <div className="sticky top-0 z-10 flex items-start justify-between gap-3 border-b border-neutral-100 bg-[#fef6f4] px-5 py-4 sm:px-6">
          <DialogHeader className="m-0 flex-1 space-y-0 p-0 text-left">
            <DialogTitle className="flex items-center gap-2 text-xl font-bold text-[#DA7756]">
              <Pencil className="h-5 w-5 shrink-0 text-[#C72030]" strokeWidth={2} />
              Edit System/SOP
            </DialogTitle>
          </DialogHeader>
          <div className="flex shrink-0 items-center gap-2">
            <button
              type="button"
              onClick={handleSubmit}
              className="inline-flex h-9 items-center gap-1.5 rounded-xl bg-[#DA7756] px-3 text-sm font-semibold text-white shadow-sm hover:bg-[#DA7756]/85"
            >
              <Save className="h-4 w-4" />
              Update
            </button>
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="rounded-lg p-2 text-neutral-500 hover:bg-neutral-100 hover:text-neutral-800"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="space-y-4 px-5 py-5 sm:px-6 sm:py-6">
          {fieldWrap(
            "border-neutral-200",
            "bg-white",
            <>
              <Label htmlFor="sop-system-name" className="font-semibold text-neutral-900">
                System Name <span className="text-[#DA7756]">*</span>
              </Label>
              <input
                id="sop-system-name"
                value={systemName}
                onChange={(e) => setSystemName(e.target.value)}
                className="mt-2 h-11 w-full rounded-xl border border-neutral-200 bg-white px-3 text-sm text-neutral-900 outline-none ring-offset-2 focus-visible:ring-2 focus-visible:ring-[#DA7756]/25"
              />
            </>
          )}

          {fieldWrap(
            "border-neutral-200",
            "bg-neutral-50/30",
            <>
              <Label htmlFor="sop-desc" className="font-semibold text-neutral-900">
                Description
              </Label>
              <Textarea
                id="sop-desc"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="What does this system do?"
                className="mt-2 min-h-[88px] resize-y rounded-xl border-neutral-200 bg-white text-sm"
              />
            </>
          )}

          <div className="grid gap-4 sm:grid-cols-2">
            {fieldWrap(
              "border-neutral-200",
              "bg-white",
              <>
                <Label className="font-semibold text-neutral-900">
                  Department <span className="text-[#DA7756]">*</span>
                </Label>
                <Select value={department} onValueChange={setDepartment}>
                  <SelectTrigger className="mt-2 h-11 rounded-xl border-neutral-200 bg-white">
                    <SelectValue placeholder="Select department" />
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
            {fieldWrap(
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
                        <Clock className="h-4 w-4 text-sky-600" />
                        To Start
                      </span>
                    </SelectItem>
                    <SelectItem value="broken">
                      <span className="flex items-center gap-2">
                        <XCircle className="h-4 w-4 text-rose-600" />
                        Broken
                      </span>
                    </SelectItem>
                    <SelectItem value="running">
                      <span className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                        Running
                      </span>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </>
            )}
          </div>

          {fieldWrap(
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
                      <Circle className="h-3.5 w-3.5 text-sky-500" />
                      Low
                    </span>
                  </SelectItem>
                  <SelectItem value="medium">
                    <span className="flex items-center gap-2">
                      <Circle className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                      Medium
                    </span>
                  </SelectItem>
                  <SelectItem value="high">
                    <span className="flex items-center gap-2">
                      <Circle className="h-3.5 w-3.5 text-rose-500" />
                      High
                    </span>
                  </SelectItem>
                </SelectContent>
              </Select>
            </>
          )}

          {fieldWrap(
            "border-neutral-200",
            "bg-white",
            <>
              <Label className="font-semibold text-neutral-900">
                Assign to User <span className="text-[#DA7756]">*</span>
              </Label>
              <Select value={assignUser} onValueChange={setAssignUser}>
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

          {fieldWrap(
            "border-emerald-200/90",
            "bg-emerald-50/40",
            <>
              <div className="flex items-center justify-between gap-2">
                <Label className="font-semibold text-neutral-900">Health Score</Label>
                <span className="text-sm font-semibold tabular-nums text-emerald-600">
                  {healthScore[0] ?? 0}%
                </span>
              </div>
              <Slider
                value={healthScore}
                onValueChange={setHealthScore}
                min={0}
                max={100}
                step={1}
                className="mt-4 [&_[class*=range]]:bg-emerald-500"
              />
            </>
          )}

          {fieldWrap(
            "border-cyan-200/90",
            "bg-cyan-50/40",
            <>
              <Label htmlFor="sop-doc-url" className="font-semibold text-neutral-900">
                Documentation URL
              </Label>
              <input
                id="sop-doc-url"
                type="url"
                value={docUrl}
                onChange={(e) => setDocUrl(e.target.value)}
                placeholder="https://..."
                className="mt-2 h-11 w-full rounded-xl border border-neutral-200 bg-white px-3 text-sm text-neutral-900 outline-none ring-offset-2 focus-visible:ring-2 focus-visible:ring-[#DA7756]/25"
              />
            </>
          )}

          {fieldWrap(
            "border-amber-200/90",
            "bg-amber-50/40",
            <>
              <Label className="font-semibold text-neutral-900">Link KPIs</Label>
              <p className="mt-1 text-xs text-neutral-500">
                Select KPIs that this system impacts
              </p>
              <div className="mt-3 rounded-xl border border-neutral-200/80 bg-white p-3">
                <div className="flex flex-wrap items-center gap-2">
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="kpi-invoices"
                      checked={kpiInvoice}
                      onCheckedChange={(c) => setKpiInvoice(c === true)}
                    />
                    <label
                      htmlFor="kpi-invoices"
                      className="text-sm font-medium text-neutral-800"
                    >
                      Invoices Raised
                    </label>
                  </div>
                  <span className="rounded-md bg-neutral-100 px-2 py-0.5 text-xs text-neutral-600">
                    Invoices
                  </span>
                  <span className="rounded-md bg-sky-100 px-2 py-0.5 text-xs text-sky-800">
                    monthly
                  </span>
                  <span className="rounded-md bg-amber-100 px-2 py-0.5 text-xs text-amber-900">
                    Accounts
                  </span>
                </div>
              </div>
            </>
          )}
        </div>

        <div className="flex justify-end gap-2 border-t border-neutral-100 bg-[#fef6f4] px-5 py-4 sm:px-6">
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="inline-flex h-10 items-center rounded-xl border border-neutral-200 bg-white px-5 text-sm font-semibold text-neutral-900 shadow-sm hover:bg-neutral-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="inline-flex h-10 items-center gap-2 rounded-xl bg-[#DA7756] px-5 text-sm font-semibold text-white shadow-sm hover:bg-[#DA7756]/85"
          >
            <Save className="h-4 w-4" />
            Update
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function AddNewSystemSopDialog({
  open,
  onOpenChange,
  onCreate,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreate: (item: SopCardData, targetColumn: ColumnKey) => void;
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

  useEffect(() => {
    if (!open) return;
    setSystemName("");
    setDescription("");
    setDepartment("");
    setStatusColumn("toStart");
    setPriority("medium");
    setAssignUser("");
    setHealthScore([0]);
    setDocUrl("");
    setKpiInvoice(false);
  }, [open]);

  const fieldWrap = (
    borderClass: string,
    bgClass: string,
    children: React.ReactNode
  ) => (
    <div
      className={cn(
        "rounded-xl border-2 px-3 py-2.5 sm:px-4 sm:py-3",
        borderClass,
        bgClass
      )}
    >
      {children}
    </div>
  );

  const createBtnClass =
    "inline-flex h-9 items-center gap-1.5 rounded-xl bg-gradient-to-r from-[#DA7756] to-[#c55a42] px-3 text-sm font-semibold text-white shadow-sm hover:opacity-95 sm:h-10 sm:px-4";

  const handleSubmit = () => {
    const name = systemName.trim();
    if (!name) {
      toast.error("Please enter a system name");
      return;
    }
    if (!department) {
      toast.error("Please select a department");
      return;
    }
    if (!assignUser) {
      toast.error("Please assign a user");
      return;
    }
    const newItem: SopCardData = {
      id: `sop-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
      title: name,
      department,
      priority,
      healthPercent: healthScore[0] ?? 0,
      description: description.trim() || undefined,
      docUrl: docUrl.trim() || undefined,
    };
    onCreate(newItem, statusColumn);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[92vh] max-w-2xl overflow-y-auto rounded-2xl border border-[#DA7756]/20 bg-[#fef6f4] p-0 shadow-xl sm:max-w-2xl">
        <div className="sticky top-0 z-10 flex items-start justify-between gap-3 border-b border-neutral-100 bg-[#fef6f4] px-5 py-4 sm:px-6">
          <DialogHeader className="m-0 flex-1 space-y-0 p-0 text-left">
            <DialogTitle className="flex items-center gap-2 text-xl font-bold text-[#DA7756]">
              <Plus className="h-5 w-5 shrink-0 text-[#C72030]" strokeWidth={2} />
              Add New System/SOP
            </DialogTitle>
          </DialogHeader>
          <div className="flex shrink-0 items-center gap-2">
            <button type="button" onClick={handleSubmit} className={createBtnClass}>
              <Sparkles className="h-4 w-4" />
              Create
            </button>
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="rounded-lg p-2 text-neutral-500 hover:bg-neutral-100 hover:text-neutral-800"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="space-y-4 px-5 py-5 sm:px-6 sm:py-6">
          {fieldWrap(
            "border-neutral-200",
            "bg-white",
            <>
              <Label htmlFor="add-sop-name" className="font-semibold text-neutral-900">
                System Name <span className="text-[#DA7756]">*</span>
              </Label>
              <input
                id="add-sop-name"
                value={systemName}
                onChange={(e) => setSystemName(e.target.value)}
                placeholder="e.g., Customer Onboarding Process"
                className="mt-2 h-11 w-full rounded-xl border border-neutral-200 bg-white px-3 text-sm text-neutral-900 placeholder:text-neutral-400 outline-none ring-offset-2 focus-visible:ring-2 focus-visible:ring-[#DA7756]/25"
              />
            </>
          )}

          {fieldWrap(
            "border-neutral-200",
            "bg-neutral-50/30",
            <>
              <Label htmlFor="add-sop-desc" className="font-semibold text-neutral-900">
                Description
              </Label>
              <Textarea
                id="add-sop-desc"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="What does this system do?"
                className="mt-2 min-h-[88px] resize-y rounded-xl border-neutral-200 bg-white text-sm"
              />
            </>
          )}

          <div className="grid gap-4 sm:grid-cols-2">
            {fieldWrap(
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
            {fieldWrap(
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
                        <Clock className="h-4 w-4 text-sky-600" />
                        To Start
                      </span>
                    </SelectItem>
                    <SelectItem value="broken">
                      <span className="flex items-center gap-2">
                        <XCircle className="h-4 w-4 text-rose-600" />
                        Broken
                      </span>
                    </SelectItem>
                    <SelectItem value="running">
                      <span className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                        Running
                      </span>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </>
            )}
          </div>

          {fieldWrap(
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
                      <Circle className="h-3.5 w-3.5 text-sky-500" />
                      Low
                    </span>
                  </SelectItem>
                  <SelectItem value="medium">
                    <span className="flex items-center gap-2">
                      <Circle className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                      Medium
                    </span>
                  </SelectItem>
                  <SelectItem value="high">
                    <span className="flex items-center gap-2">
                      <Circle className="h-3.5 w-3.5 text-rose-500" />
                      High
                    </span>
                  </SelectItem>
                </SelectContent>
              </Select>
            </>
          )}

          {fieldWrap(
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
                    <User className="h-4 w-4 text-sky-500" />
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

          {fieldWrap(
            "border-emerald-200/90",
            "bg-emerald-50/40",
            <>
              <div className="flex items-center justify-between gap-2">
                <Label className="font-semibold text-neutral-900">Health Score</Label>
                <span className="text-sm font-semibold tabular-nums text-emerald-600">
                  {healthScore[0] ?? 0}%
                </span>
              </div>
              <Slider
                value={healthScore}
                onValueChange={setHealthScore}
                min={0}
                max={100}
                step={1}
                className="mt-4 [&_[class*=range]]:bg-emerald-500"
              />
            </>
          )}

          {fieldWrap(
            "border-cyan-200/90",
            "bg-cyan-50/40",
            <>
              <Label htmlFor="add-sop-url" className="font-semibold text-neutral-900">
                Documentation URL
              </Label>
              <input
                id="add-sop-url"
                type="url"
                value={docUrl}
                onChange={(e) => setDocUrl(e.target.value)}
                placeholder="https://..."
                className="mt-2 h-11 w-full rounded-xl border border-neutral-200 bg-white px-3 text-sm text-neutral-900 outline-none ring-offset-2 focus-visible:ring-2 focus-visible:ring-[#DA7756]/25"
              />
            </>
          )}

          {fieldWrap(
            "border-amber-200/90",
            "bg-amber-50/40",
            <>
              <Label className="font-semibold text-neutral-900">Link KPIs</Label>
              <p className="mt-1 text-xs text-neutral-500">
                Select KPIs that this system impacts
              </p>
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
                  <span className="rounded-md bg-sky-100 px-2 py-0.5 text-xs text-sky-800">
                    monthly
                  </span>
                  <span className="rounded-md bg-amber-100 px-2 py-0.5 text-xs text-amber-900">
                    Accounts
                  </span>
                </div>
              </div>
            </>
          )}
        </div>

        <div className="flex justify-end gap-2 border-t border-neutral-100 bg-[#fef6f4] px-5 py-4 sm:px-6">
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="inline-flex h-10 items-center rounded-xl border border-neutral-200 bg-white px-5 text-sm font-semibold text-neutral-900 shadow-sm hover:bg-neutral-50"
          >
            Cancel
          </button>
          <button type="button" onClick={handleSubmit} className={createBtnClass}>
            <Sparkles className="h-4 w-4" />
            Create
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function SopKanbanCard({
  item,
  column,
  dragHandleProps,
  onEditClick,
  onDuplicateClick,
  onDeleteClick,
}: {
  item: SopCardData;
  column: ColumnKey;
  dragHandleProps?: React.HTMLAttributes<HTMLDivElement>;
  onEditClick?: () => void;
  onDuplicateClick?: () => void;
  onDeleteClick?: () => void;
}) {
  const health = item.healthPercent;
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
    <div className="rounded-xl border border-neutral-200/90 bg-white p-3 shadow-sm">
      <div className="flex gap-2">
        {dragHandleProps && (
          <div
            {...dragHandleProps}
            className="mt-0.5 flex h-8 w-8 shrink-0 cursor-grab touch-none items-center justify-center rounded-lg border border-neutral-200 bg-neutral-50 text-neutral-500 hover:bg-neutral-100 active:cursor-grabbing"
            aria-label="Drag to move"
          >
            <GripVertical className="h-4 w-4" />
          </div>
        )}
        <div className="min-w-0 flex-1">
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
          </div>
          <div className="mt-3 space-y-1.5">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-medium text-neutral-600">Health</span>
              {statusBadge}
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-neutral-200">
              <div
                className={cn("h-full rounded-full transition-all", barClass)}
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
              onClick={(e) => {
                e.stopPropagation();
                onEditClick?.();
              }}
              className="inline-flex min-h-9 flex-1 items-center justify-center gap-1.5 rounded-xl bg-[#DA7756] px-3 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-[#DA7756]/85"
            >
              <Pencil className="h-3.5 w-3.5" />
              Edit
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onDuplicateClick?.();
              }}
              className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-neutral-300 bg-white text-neutral-600 shadow-sm transition-colors hover:bg-neutral-50"
              aria-label="Duplicate"
            >
              <Copy className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onDeleteClick?.();
              }}
              className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-rose-200 bg-white text-rose-600 shadow-sm transition-colors hover:bg-rose-50"
              aria-label="Delete"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function DraggableSopCard({
  item,
  column,
  disabled,
  onEditClick,
  onDuplicateClick,
  onDeleteClick,
}: {
  item: SopCardData;
  column: ColumnKey;
  disabled?: boolean;
  onEditClick?: () => void;
  onDuplicateClick?: () => void;
  onDeleteClick?: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: `sop-card-${item.id}`,
      disabled,
      data: { type: "SOP_CARD", item, column },
    });

  const style: React.CSSProperties = {
    transform: CSS.Translate.toString(transform),
    opacity: isDragging ? 0.35 : 1,
    zIndex: isDragging ? 1 : 0,
  };

  return (
    <div ref={setNodeRef} style={style} className="touch-none">
      <SopKanbanCard
        item={item}
        column={column}
        dragHandleProps={{ ...listeners, ...attributes }}
        onEditClick={onEditClick}
        onDuplicateClick={onDuplicateClick}
        onDeleteClick={onDeleteClick}
      />
    </div>
  );
}

function SopColumnBody({
  colKey,
  children,
  emptySlot,
}: {
  colKey: ColumnKey;
  children: React.ReactNode;
  emptySlot: React.ReactNode;
}) {
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
  className,
}: {
  label: string;
  className?: string;
}) {
  return (
    <Select defaultValue="all">
      <SelectTrigger
        className={cn(
          "h-10 w-full min-w-[140px] rounded-xl border-neutral-200 bg-white text-sm",
          className
        )}
      >
        <div className="flex w-full min-w-0 items-center gap-2">
          <Filter className="h-4 w-4 shrink-0 text-neutral-400" aria-hidden />
          <SelectValue placeholder={label} />
        </div>
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">{label}</SelectItem>
      </SelectContent>
    </Select>
  );
}

function parseCardId(id: string | number): string | null {
  const s = String(id);
  if (!s.startsWith("sop-card-")) return null;
  return s.slice("sop-card-".length);
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

const SystemAndSOP = () => {
  const [bannerVisible, setBannerVisible] = useState(true);
  const [sopTab, setSopTab] = useState<SopTab>("my");
  const [search, setSearch] = useState("");
  const [columns, setColumns] = useState<Record<ColumnKey, SopCardData[]>>(
    () => loadColumnsFromStorage()
  );
  const [activeDragId, setActiveDragId] = useState<string | null>(null);
  const [editOpen, setEditOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<{
    item: SopCardData;
    column: ColumnKey;
  } | null>(null);
  const [addOpen, setAddOpen] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem(SOP_KANBAN_STORAGE_KEY, JSON.stringify(columns));
    } catch {
      /* ignore quota / private mode */
    }
  }, [columns]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    })
  );

  const filterBySearch = useCallback(
    (items: SopCardData[]) => {
      const q = search.trim().toLowerCase();
      if (!q) return items;
      return items.filter(
        (s) =>
          s.title.toLowerCase().includes(q) ||
          s.department.toLowerCase().includes(q) ||
          s.priority.toLowerCase().includes(q)
      );
    },
    [search]
  );

  const displayedByCol = useMemo(
    () => ({
      toStart: filterBySearch(columns.toStart),
      broken: filterBySearch(columns.broken),
      running: filterBySearch(columns.running),
    }),
    [columns, filterBySearch]
  );

  const counts = useMemo(
    () => ({
      toStart: columns.toStart.length,
      broken: columns.broken.length,
      running: columns.running.length,
    }),
    [columns]
  );

  const showBottomEmpty =
    sopTab === "my" ||
    (sopTab === "all" &&
      columns.toStart.length === 0 &&
      columns.broken.length === 0 &&
      columns.running.length === 0);

  const handleDragStart = useCallback((event: DragStartEvent) => {
    const id = parseCardId(event.active.id);
    setActiveDragId(id);
  }, []);

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;
    setActiveDragId(null);

    // Dropped outside any valid column/card — state unchanged (card stays)
    if (!over) return;

    const activeCardId = parseCardId(active.id);
    if (!activeCardId) return;

    setColumns((prev) => {
      const sourceCol = findColumnForCard(prev, activeCardId);
      if (!sourceCol) return prev;

      let targetCol: ColumnKey | null = null;
      let insertBeforeId: string | null = null;

      const overStr = String(over.id);
      if (overStr.startsWith("column-")) {
        targetCol = overStr.replace("column-", "") as ColumnKey;
      } else {
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
      const updated: SopCardData = {
        ...moved,
        healthPercent: healthForColumn(targetCol),
      };

      if (sourceCol === targetCol) {
        const list = fromList;
        let insertIdx = insertBeforeId
          ? list.findIndex((c) => c.id === insertBeforeId)
          : list.length;
        if (insertIdx < 0) insertIdx = list.length;
        list.splice(insertIdx, 0, updated);
        return { ...prev, [sourceCol]: list };
      }

      const toList = [...prev[targetCol]];
      let insertIdx = insertBeforeId
        ? toList.findIndex((c) => c.id === insertBeforeId)
        : toList.length;
      if (insertIdx < 0) insertIdx = toList.length;
      toList.splice(insertIdx, 0, updated);

      return {
        ...prev,
        [sourceCol]: fromList,
        [targetCol]: toList,
      };
    });
  }, []);

  const handleDragCancel = useCallback(() => {
    setActiveDragId(null);
  }, []);

  const handleEditSave = useCallback(
    (next: SopCardData, targetColumn: ColumnKey) => {
      setColumns((prev) => {
        const sourceCol = findColumnForCard(prev, next.id);
        if (!sourceCol) return prev;
        const cleaned: Record<ColumnKey, SopCardData[]> = {
          toStart: prev.toStart.filter((c) => c.id !== next.id),
          broken: prev.broken.filter((c) => c.id !== next.id),
          running: prev.running.filter((c) => c.id !== next.id),
        };
        return {
          ...cleaned,
          [targetColumn]: [...cleaned[targetColumn], next],
        };
      });
      setEditOpen(false);
      setEditTarget(null);
    },
    []
  );

  const handleAddCreate = useCallback(
    (item: SopCardData, targetColumn: ColumnKey) => {
      setColumns((prev) => ({
        ...prev,
        [targetColumn]: [...prev[targetColumn], item],
      }));
      setAddOpen(false);
    },
    []
  );

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
        if (idx < 0) {
          return { ...prev, [column]: [...list, copy] };
        }
        const next = [...list];
        next.splice(idx + 1, 0, copy);
        return { ...prev, [column]: next };
      });
    },
    []
  );

  const handleDeleteCard = useCallback((itemId: string) => {
    if (
      !window.confirm("Delete this system/SOP? This cannot be undone.")
    ) {
      return;
    }
    setColumns((prev) => ({
      toStart: prev.toStart.filter((c) => c.id !== itemId),
      broken: prev.broken.filter((c) => c.id !== itemId),
      running: prev.running.filter((c) => c.id !== itemId),
    }));
    let closeModal = false;
    setEditTarget((t) => {
      if (t?.item.id === itemId) {
        closeModal = true;
        return null;
      }
      return t;
    });
    if (closeModal) {
      setEditOpen(false);
    }
  }, []);

  const activeItem = useMemo(() => {
    if (!activeDragId) return null;
    const col = findColumnForCard(columns, activeDragId);
    if (!col) return null;
    return columns[col].find((c) => c.id === activeDragId) ?? null;
  }, [activeDragId, columns]);

  const activeColumn = activeDragId
    ? findColumnForCard(columns, activeDragId)
    : null;

  return (
    <div className="min-h-[calc(100vh-5rem)] bg-[#f6f4ee] px-4 py-6 sm:px-6">
      <EditSystemSopDialog
        open={editOpen}
        onOpenChange={(open) => {
          setEditOpen(open);
          if (!open) setEditTarget(null);
        }}
        item={editTarget?.item ?? null}
        column={editTarget?.column ?? null}
        onSave={handleEditSave}
      />
      <AddNewSystemSopDialog
        open={addOpen}
        onOpenChange={setAddOpen}
        onCreate={handleAddCreate}
      />
      <div className="mx-auto max-w-6xl space-y-6">
        {bannerVisible && (
          <div
            className={cn(
              "flex items-center gap-3 rounded-2xl border border-sky-200/60 bg-sky-50/90 px-4 py-3 shadow-sm",
              "pr-2"
            )}
          >
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
                aria-label="Expand tips"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
              <button
                type="button"
                className="rounded-md p-2 text-sky-700 hover:bg-sky-100"
                aria-label="Dismiss banner"
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
              onClick={() => setAddOpen(true)}
              className="inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-xl bg-[#DA7756] px-4 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#DA7756]/85 sm:px-5"
            >
              <Plus className="h-4 w-4 text-white" strokeWidth={2} />
              Add System
            </button>
          </div>
        </div>

        <Card className="rounded-2xl border border-[#DA7756]/20 bg-[#DA7756]/10 p-3 shadow-sm sm:p-4">
          <div className="flex flex-col gap-3 lg:flex-row lg:flex-wrap lg:items-center">
            <div className="grid flex-1 grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-4">
              <FilterSelect label="All Departments" />
              <FilterSelect label="All People" />
              <FilterSelect label="All Priorities" />
              <FilterSelect label="All Status" />
            </div>
            <div className="relative min-w-0 lg:min-w-[220px] lg:max-w-sm lg:flex-1">
              <Search
                className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400"
                aria-hidden
              />
              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search systems..."
                className="h-10 w-full rounded-xl border border-neutral-200 bg-white py-2 pl-10 pr-3 text-sm text-neutral-900 placeholder:text-neutral-400 outline-none ring-offset-2 focus-visible:ring-2 focus-visible:ring-[#DA7756]/25"
              />
            </div>
          </div>
        </Card>

        {sopTab === "all" ? (
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
                const EmptyIcon = col.emptyIcon;
                const n = counts[col.key];
                const list = displayedByCol[col.key];
                const hasCards = list.length > 0;

                return (
                  <Card
                    key={col.key}
                    className={cn(
                      "flex min-h-[280px] flex-col overflow-hidden rounded-2xl border shadow-sm",
                      col.panelClass
                    )}
                  >
                    <div className="flex items-center gap-2 border-b border-neutral-200/40 bg-white/60 px-3 py-3 sm:px-4">
                      <Icon
                        className={cn("h-5 w-5 shrink-0", col.headerIconClass)}
                      />
                      <span className="min-w-0 flex-1 text-sm font-semibold text-neutral-900">
                        {col.title}
                      </span>
                      <span
                        className={cn(
                          "rounded-full px-2 py-0.5 text-xs font-bold tabular-nums",
                          col.badgeClass
                        )}
                      >
                        {n}
                      </span>
                    </div>
                    <div className="flex min-h-0 flex-1 flex-col p-3 sm:p-4">
                      <SopColumnBody
                        colKey={col.key}
                        emptySlot={
                          !hasCards ? (
                            <div className="pointer-events-none flex flex-1 flex-col items-center justify-center py-6">
                              <div
                                className={cn(
                                  "flex w-full flex-col items-center justify-center rounded-xl border-2 border-dashed border-neutral-300/80 bg-white/50 py-10"
                                )}
                              >
                                <EmptyIcon
                                  className={cn(
                                    "mb-2 h-10 w-10",
                                    col.emptyIconClass
                                  )}
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
                          <div className="flex max-h-[min(70vh,560px)] flex-col gap-3 overflow-y-auto pr-1">
                            {list.map((item) => (
                              <DraggableSopCard
                                key={item.id}
                                item={item}
                                column={col.key}
                                onEditClick={() => {
                                  setEditTarget({ item, column: col.key });
                                  setEditOpen(true);
                                }}
                                onDuplicateClick={() =>
                                  handleDuplicateCard(item, col.key)
                                }
                                onDeleteClick={() =>
                                  handleDeleteCard(item.id)
                                }
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
            <DragOverlay dropAnimation={null}>
              {activeItem && activeColumn ? (
                <div className="w-[min(100vw-2rem,320px)] cursor-grabbing opacity-95 shadow-xl">
                  <SopKanbanCard item={activeItem} column={activeColumn} />
                </div>
              ) : null}
            </DragOverlay>
          </DndContext>
        ) : (
          <div className="grid gap-4 lg:grid-cols-3">
            {COLUMN_META.map((col) => {
              const Icon = col.icon;
              const EmptyIcon = col.emptyIcon;
              return (
                <Card
                  key={col.key}
                  className={cn(
                    "flex min-h-[280px] flex-col overflow-hidden rounded-2xl border shadow-sm",
                    col.panelClass
                  )}
                >
                  <div className="flex items-center gap-2 border-b border-neutral-200/40 bg-white/60 px-3 py-3 sm:px-4">
                    <Icon
                      className={cn("h-5 w-5 shrink-0", col.headerIconClass)}
                    />
                    <span className="min-w-0 flex-1 text-sm font-semibold text-neutral-900">
                      {col.title}
                    </span>
                    <span
                      className={cn(
                        "rounded-full px-2 py-0.5 text-xs font-bold tabular-nums",
                        col.badgeClass
                      )}
                    >
                      0
                    </span>
                  </div>
                  <div className="flex flex-1 flex-col items-center justify-center p-3 sm:p-4">
                    <div
                      className={cn(
                        "flex w-full flex-col items-center justify-center rounded-xl border-2 border-dashed border-neutral-300/80 bg-white/50 py-10"
                      )}
                    >
                      <EmptyIcon
                        className={cn("mb-2 h-10 w-10", col.emptyIconClass)}
                        strokeWidth={1.25}
                      />
                      <p className="text-sm font-medium text-neutral-500">
                        No systems here
                      </p>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}

        {showBottomEmpty && (
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
                Add your first system/SOP to get started
              </p>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default SystemAndSOP;
