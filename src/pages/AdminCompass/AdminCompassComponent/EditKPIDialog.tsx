import React, { useEffect, useMemo, useState } from "react";
import {
  Activity,
  Building2,
  Calendar,
  LineChart,
  Loader2,
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
  frequency: "weekly" | "monthly" | "quarterly";
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

  const [name, setName] = useState("");
  const [unit, setUnit] = useState("");
  const [departmentId, setDepartmentId] = useState("");
  const [frequency, setFrequency] = useState<"weekly" | "monthly" | "quarterly">("weekly");
  const [relatedUrl, setRelatedUrl] = useState("");
  const [targetValue, setTargetValue] = useState("");
  const [priority, setPriority] = useState<"low" | "medium" | "high">("medium");
  const [weight, setWeight] = useState("10");

  useEffect(() => {
    if (!kpi || !open) return;

    setName(kpi.name ?? "");
    setUnit(kpi.unit ?? "");
    setDepartmentId(
      resolvedDepartment ? String(resolvedDepartment.id) : ""
    );
    setFrequency(
      kpi.frequency.toLowerCase() === "weekly"
        ? "weekly"
        : kpi.frequency.toLowerCase() === "quarterly"
          ? "quarterly"
          : "monthly"
    );
    setRelatedUrl(kpi.description ?? "");
    setTargetValue(String(kpi.target ?? "0"));
    setPriority(kpi.priority ?? "medium");
    setWeight("10");
  }, [kpi, open, resolvedDepartment]);

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
      targetValue: Number(targetValue) || 0,
      currentValue: Number(kpi.value) || 0,
      priority,
      weight,
      assigneeId: kpi.assigneeId ?? users[0]?.id ?? null,
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
                <Select value={departmentId} onValueChange={setDepartmentId}>
                  <SelectTrigger className={selectTriggerClass}>
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    {departments.map((dept) => (
                      <SelectItem key={dept.id} value={String(dept.id)}>
                        {dept.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="flex items-center gap-1.5 text-sm text-neutral-700">
                  <Calendar className="h-4 w-4 text-[#DA7756]" />
                  Frequency *
                </Label>
                <Select value={frequency} onValueChange={(value) => setFrequency(value as "weekly" | "monthly" | "quarterly")}>
                  <SelectTrigger className={selectTriggerClass}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="quarterly">Quarterly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
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
                  inputMode="decimal"
                  value={targetValue}
                  onChange={(e) => setTargetValue(e.target.value)}
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
                  onChange={(e) => setWeight(e.target.value)}
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