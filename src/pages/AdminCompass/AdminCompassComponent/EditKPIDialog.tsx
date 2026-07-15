import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Activity,
  Building2,
  Calendar,
  Check,
  ChevronDown,
  LineChart,
  Loader2,
  Users,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
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
import type { KPICardData } from "./kpiTypes";

const DEFAULT_KPI_UNITS = [
  "₹",
  "%",
  "Hours",
  "Days",
  "Calls",
  "Leads",
  "Meetings",
  "Tickets",
] as const;

const inputClass =
  "h-11 w-full rounded-xl border border-neutral-200 bg-white px-3 text-sm text-neutral-900 placeholder:text-neutral-400 outline-none focus-visible:ring-2 focus-visible:ring-[#DA7756]/25";

const selectTriggerClass =
  "h-11 w-full rounded-xl border-neutral-200 bg-white focus:ring-[#DA7756]/25";

const SearchableSelect = ({
  value,
  onChange,
  options,
  placeholder = "Search...",
  clearValue = "",
  clearLabel = "Clear",
  showClear = true,
  menuPlacement = "bottom",
}: {
  value: string;
  onChange: (value: string) => void;
  options: Array<{ value: string; label: string }>;
  placeholder?: string;
  clearValue?: string;
  clearLabel?: string;
  showClear?: boolean;
  menuPlacement?: "top" | "bottom";
}) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, []);

  const selected = options.find((option) => option.value === value);
  const filtered = options.filter((option) =>
    option.label.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div ref={ref} className="relative" style={{ zIndex: open ? 50 : 1 }}>
      <div className="relative">
        <input
          type="text"
          className={inputClass}
          placeholder={placeholder}
          value={open ? search : selected?.label ?? ""}
          onClick={() => {
            setOpen(true);
            setSearch("");
          }}
          onChange={(event) => {
            setSearch(event.target.value);
            setOpen(true);
          }}
          readOnly={!open}
          style={{ paddingRight: 36, cursor: "pointer" }}
        />
        <ChevronDown
          className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400 transition-transform"
          style={{ transform: open ? "translateY(-50%) rotate(180deg)" : "translateY(-50%)" }}
        />
      </div>

      {open && (
        <div
          className="absolute left-0 right-0 z-50 max-h-[200px] overflow-y-auto rounded-xl border border-neutral-200 bg-white shadow-lg"
          style={menuPlacement === "top" ? { bottom: "calc(100% + 4px)" } : { top: "calc(100% + 4px)" }}
        >
          {showClear && value && value !== clearValue && (
            <button
              type="button"
              onClick={() => {
                onChange(clearValue);
                setOpen(false);
                setSearch("");
              }}
              className="w-full border-b border-neutral-100 px-3 py-2.5 text-left text-xs font-semibold text-red-500 hover:bg-red-50"
            >
              {clearLabel}
            </button>
          )}
          {filtered.length === 0 ? (
            <div className="px-3 py-3 text-center text-sm text-neutral-500">No results found</div>
          ) : (
            filtered.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  onChange(option.value);
                  setOpen(false);
                  setSearch("");
                }}
                className={cn(
                  "flex w-full items-center justify-between border-b border-neutral-100 px-3 py-2.5 text-left text-sm font-medium last:border-b-0 hover:bg-[#fff8f6]",
                  option.value === value ? "bg-[#fef6f4] text-[#DA7756]" : "text-neutral-800"
                )}
              >
                <span className="truncate">{option.label}</span>
                {option.value === value && <Check className="h-4 w-4 shrink-0 text-[#DA7756]" strokeWidth={3} />}
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
};

type EditUser = {
  id: number;
  name: string;
};

type EditDepartment = {
  id: number;
  name: string;
};

export type EditKPIFormValues = {
  id: string;
  name: string;
  unit: string;
  departmentId: number | null;
  departmentName: string;
  frequency: "daily" | "weekly" | "monthly" | "quarterly";
  relatedUrl: string;
  targetValue: number;
  currentValue: number;
  priority: "low" | "medium" | "high";
  weight: string;
  assigneeId: number | null;
};

export interface EditKPIDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  kpi: KPICardData | null;
  users?: EditUser[];
  departments?: EditDepartment[];
  units?: string[];
  isLoading?: boolean;
  onSubmit: (values: EditKPIFormValues) => Promise<void> | void;
}

const EditKPIDialog: React.FC<EditKPIDialogProps> = ({
  open,
  onOpenChange,
  kpi,
  users = [],
  departments = [],
  units = DEFAULT_KPI_UNITS,
  isLoading = false,
  onSubmit,
}) => {
  const resolvedDepartment = useMemo(() => {
    if (!kpi) return null;

    if (kpi.departmentId != null) {
      return (
        departments.find((dept) => dept.id === kpi.departmentId) ?? null
      );
    }

    const tagDepartment = kpi.tags.find((tag) =>
      departments.some(
        (dept) => dept.name.toLowerCase() === tag.toLowerCase()
      )
    );

    return (
      departments.find(
        (dept) => dept.name.toLowerCase() === tagDepartment?.toLowerCase()
      ) ?? null
    );
  }, [departments, kpi]);

  const resolvedAssigneeId = useMemo(() => {
    if (!kpi) return "";

    if (kpi.assigneeId != null) {
      return String(kpi.assigneeId);
    }

    const matchedUser = users.find(
      (user) => user.name.toLowerCase() === (kpi.owner ?? "").toLowerCase()
    );

    return matchedUser ? String(matchedUser.id) : "";
  }, [kpi, users]);

  const [name, setName] = useState("");
  const [unit, setUnit] = useState("");
  const [departmentId, setDepartmentId] = useState("");
  const [frequency, setFrequency] = useState<"daily" | "weekly" | "monthly" | "quarterly">("weekly");
  const [relatedUrl, setRelatedUrl] = useState("");
  const [targetValue, setTargetValue] = useState("");
  const [priority, setPriority] = useState<"low" | "medium" | "high">("medium");
  const [weight, setWeight] = useState("10");
  const [assigneeId, setAssigneeId] = useState("");
  const toIntegerString = (value: string) => value.replace(/\D/g, "");

  useEffect(() => {
    if (!kpi || !open) return;

    setName(kpi.name ?? "");
    setUnit(kpi.unit ?? "");
    setDepartmentId(
      resolvedDepartment ? String(resolvedDepartment.id) : ""
    );
    setFrequency(
      kpi.frequency.toLowerCase() === "daily"
        ? "daily"
        : kpi.frequency.toLowerCase() === "weekly"
        ? "weekly"
        : kpi.frequency.toLowerCase() === "quarterly"
          ? "quarterly"
          : "monthly"
    );
    setRelatedUrl(kpi.description ?? "");
    setTargetValue(String(Math.trunc(Number(kpi.target) || 0)));
    setPriority(kpi.priority ?? "medium");
    setWeight(String(Math.trunc(Number(kpi.weight) || 10)));
    setAssigneeId(resolvedAssigneeId);
  }, [kpi, open, resolvedAssigneeId, resolvedDepartment]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!kpi) return;

    const selectedDepartment = departments.find(
      (dept) => String(dept.id) === departmentId
    );

    await onSubmit({
      id: kpi.id,
      name: name.trim(),
      unit,
      departmentId: selectedDepartment?.id ?? kpi.departmentId ?? null,
      departmentName:
        selectedDepartment?.name ??
        resolvedDepartment?.name ??
        kpi.tags[0] ??
        "Operations",
      frequency,
      relatedUrl: relatedUrl.trim(),
      targetValue: parseInt(targetValue, 10) || 0,
      currentValue: parseInt(String(kpi.value), 10) || 0,
      priority,
      weight: String(parseInt(weight, 10) || 0),
      assigneeId: assigneeId ? Number(assigneeId) : null,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[92vh] max-w-3xl gap-0 overflow-y-auto rounded-2xl border-[#DA7756]/20 bg-[#fef6f4] p-0 sm:max-w-3xl">
        <div className="flex items-start justify-between border-b border-neutral-100 px-6 pb-4 pt-6 sm:px-8">
          <div className="flex items-start gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#DA7756] shadow-sm">
              <LineChart className="h-6 w-6 text-white" strokeWidth={2} />
            </div>
            <DialogHeader className="space-y-0 text-left">
              <DialogTitle className="text-xl font-bold text-neutral-900">
                Edit KPI
              </DialogTitle>
            </DialogHeader>
          </div>
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="rounded-lg p-1.5 text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 px-6 pb-6 pt-5 sm:px-8">
          <div className="space-y-4 rounded-xl border-2 border-[#DA7756]/25 bg-[#fff8f6] p-4 sm:p-5">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="edit-kpi-name" className="flex items-center gap-1.5 text-sm text-neutral-700">
                  <Activity className="h-4 w-4 text-[#DA7756]" />
                  KPI Name *
                </Label>
                <input
                  id="edit-kpi-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={inputClass}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm text-neutral-700">Unit *</Label>
                <Select value={unit} onValueChange={setUnit}>
                  <SelectTrigger className={selectTriggerClass}>
                    <SelectValue placeholder="Select unit" />
                  </SelectTrigger>
                  <SelectContent>
                    {units.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label className="flex items-center gap-1.5 text-sm text-neutral-700">
                  <Building2 className="h-4 w-4 text-[#DA7756]" />
                  Department *
                </Label>
                <SearchableSelect
                  value={departmentId}
                  onChange={setDepartmentId}
                  options={departments.map((dept) => ({
                    value: String(dept.id),
                    label: dept.name,
                  }))}
                  placeholder="Search department..."
                  clearLabel="Clear department"
                />
              </div>
              <div className="space-y-2">
                <Label className="flex items-center gap-1.5 text-sm text-neutral-700">
                  <Calendar className="h-4 w-4 text-[#DA7756]" />
                  Frequency *
                </Label>
                <Select value={frequency} onValueChange={(value) => setFrequency(value as "daily" | "weekly" | "monthly" | "quarterly")}>
                  <SelectTrigger className={selectTriggerClass}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="quarterly">Quarterly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="mt-4 space-y-2">
              <Label className="flex items-center gap-1.5 text-sm text-neutral-700">
                <Users className="h-4 w-4 text-[#DA7756]" />
                Assigned User
              </Label>
              <SearchableSelect
                value={assigneeId}
                onChange={setAssigneeId}
                options={users.map((user) => ({
                  value: String(user.id),
                  label: user.name,
                }))}
                placeholder="Search user..."
                clearLabel="Clear user"
              />
            </div>

            <div className="mt-4 space-y-2">
              <Label htmlFor="edit-kpi-url" className="text-sm text-neutral-700">
                Related Link URL (optional)
              </Label>
              <input
                id="edit-kpi-url"
                type="url"
                value={relatedUrl}
                onChange={(e) => setRelatedUrl(e.target.value)}
                placeholder="https://..."
                className={inputClass}
              />
            </div>

            <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="edit-kpi-target" className="text-sm text-neutral-700">
                  Target Value
                </Label>
                <input
                  id="edit-kpi-target"
                  type="text"
                  inputMode="numeric"
                  value={targetValue}
                  onChange={(e) => setTargetValue(toIntegerString(e.target.value))}
                  className={inputClass}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm text-neutral-700">Priority</Label>
                <Select value={priority} onValueChange={(value) => setPriority(value as "low" | "medium" | "high")}>
                  <SelectTrigger className={selectTriggerClass}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-kpi-weight" className="text-sm text-neutral-700">
                  Weight (%)
                </Label>
                <input
                  id="edit-kpi-weight"
                  type="text"
                  inputMode="numeric"
                  value={weight}
                  onChange={(e) => setWeight(toIntegerString(e.target.value))}
                  className={inputClass}
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col-reverse gap-3 border-t border-neutral-100 px-0 pt-5 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
              className="rounded-xl border border-neutral-300 bg-white px-5 py-3 text-sm font-semibold text-neutral-900 shadow-sm hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#DA7756] px-5 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#c9674a] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
              {isLoading ? "Updating..." : "Update KPI"}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditKPIDialog;
