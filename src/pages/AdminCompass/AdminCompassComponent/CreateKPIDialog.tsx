// ─────────────────────────────────────────────
// CreateKPIDialog.tsx — matches BugReports Dialog shell + KPI form
// ─────────────────────────────────────────────
import React, { useEffect, useState } from "react";
import {
  BarChart3,
  Building2,
  Calendar,
  ChevronDown,
  LineChart,
  Users,
  Search,
  X,
  Loader2,
  ChevronsUpDown,
  Check,
} from "lucide-react";
import { toast } from "sonner";
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
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

const DEPARTMENTS = [
  "Sales",
  "Operations",
  "Finance",
  "Accounts",
  "HR",
  "IT",
  "Marketing",
] as const;

type AssigneeUser = {
  id: number;
  name: string;
};

type DepartmentOption = {
  id: number;
  name: string;
};

const inputClass =
  "h-11 w-full rounded-xl border border-neutral-200 bg-white px-3 text-sm text-neutral-900 placeholder:text-neutral-400 outline-none focus-visible:ring-2 focus-visible:ring-[#DA7756]/25";

const selectTriggerClass =
  "h-11 w-full rounded-xl border-neutral-200 bg-white focus:ring-[#DA7756]/25";

export interface CreateKPIDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreated?: (kpi: KPICardData) => Promise<void> | void;
  isLoading?: boolean;
  users?: AssigneeUser[];
  departments?: DepartmentOption[];
  units?: string[];
}

const CreateKPIDialog: React.FC<CreateKPIDialogProps> = ({
  open,
  onOpenChange,
  onCreated,
  isLoading = false,
  users = [],
  departments = [],
  units = DEFAULT_KPI_UNITS,
}) => {
  const [kpiName, setKpiName] = useState("");
  const [unit, setUnit] = useState<string>("");
  const [department, setDepartment] = useState<string>("");
  const [frequency, setFrequency] = useState<string>("Weekly");
  const [relatedUrl, setRelatedUrl] = useState("");
  const [targetValue, setTargetValue] = useState("0");
  const [priority, setPriority] = useState<string>("medium");
  const [weight, setWeight] = useState("10");
  const [assignees, setAssignees] = useState<Record<string, boolean>>({});
  const [assigneeSearchInput, setAssigneeSearchInput] = useState("");
  const [assigneeSearchTerm, setAssigneeSearchTerm] = useState("");
  const [deptOpen, setDeptOpen] = useState(false);

  const departmentOptions =
    departments.length > 0
      ? departments.map((d) => ({ id: String(d.id), name: d.name }))
      : DEPARTMENTS.map((name, idx) => ({ id: `static-${idx}`, name }));

  useEffect(() => {
    if (!open) {
      setKpiName("");
      setUnit("");
      setDepartment("");
      setFrequency("Weekly");
      setRelatedUrl("");
      setTargetValue("0");
      setPriority("medium");
      setWeight("10");
      setAssignees({});
      setAssigneeSearchInput("");
      setAssigneeSearchTerm("");
    }
  }, [open]);

  const toggleAssignee = (name: string) => {
    setAssignees((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  const handleSearchUsers = () => {
    setAssigneeSearchTerm(assigneeSearchInput.trim().toLowerCase());
  };

  const filteredUsers = users.filter((user) => {
    const term = assigneeSearchInput.trim().toLowerCase();
    if (!term) return true;
    return user.name.toLowerCase().includes(term);
  });

  const toIntegerString = (value: string) => value.replace(/\D/g, "");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!kpiName.trim() || !unit || !department) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      const selectedUsers = users.filter((u) => assignees[String(u.id)]);
      const selectedAssigneeIds = selectedUsers.map((u) => Number(u.id));
      const selectedDepartment = departmentOptions.find((d) => d.id === department);
      const owner =
        selectedUsers.length > 0
          ? selectedUsers.map((u) => u.name).join(", ")
          : "Unassigned";
      const assigneeId = selectedUsers[0]?.id ?? null;
      const departmentName = selectedDepartment?.name ?? "";
      const departmentId =
        departments.length > 0 && selectedDepartment
          ? Number(selectedDepartment.id)
          : undefined;

      const freqLabel =
        frequency === "Daily" || frequency === "Weekly" || frequency === "Monthly" || frequency === "Quarterly"
          ? frequency
          : "Weekly";

      // Format data for API
      const kpiData: KPICardData = {
        id: `kpi-${Date.now()}`,
        name: kpiName.trim(),
        owner,
        target: targetValue.trim() || "0",
        value: targetValue.trim() || "0",
        unit,
        status: "on-target",
        frequency: freqLabel as KPICardData["frequency"],
        badge: "Active",
        color: "bg-sky-100",
        tags: [departmentName, "Individual"],
        priority: priority as KPICardData["priority"],
        description: relatedUrl || undefined,
        departmentId,
        assigneeId,
        assigneeIds: selectedAssigneeIds,
        weight: parseInt(weight, 10) || 0,
      };

      await onCreated?.(kpiData);
    } catch (error) {
      console.error("Submit error:", error);
      toast.error("Failed to create KPI");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={cn(
          "max-h-[92vh] max-w-3xl gap-0 overflow-y-auto rounded-2xl border-[#DA7756]/20 bg-[#fef6f4] p-0 sm:max-w-3xl"
        )}
      >
        <div className="flex items-start justify-between border-b border-neutral-100 px-6 pb-4 pt-6 sm:px-8">
          <div className="flex items-start gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#DA7756] shadow-sm">
              <LineChart className="h-6 w-6 text-white" strokeWidth={2} />
            </div>
            <DialogHeader className="space-y-0 text-left">
              <DialogTitle className="text-xl font-bold text-neutral-900">
                Create New KPI
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
          <div
            className={cn(
              "space-y-4 rounded-xl border-2 p-4 sm:p-5",
              "border-sky-200/90 bg-sky-50/50"
            )}
          >
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label
                  htmlFor="kpi-name"
                  className="flex items-center gap-1.5 text-sm text-neutral-700"
                >
                  <BarChart3 className="h-4 w-4 text-[#DA7756]" strokeWidth={2} />
                  KPI Name <span className="text-red-500">*</span>
                </Label>
                <input
                  id="kpi-name"
                  type="text"
                  value={kpiName}
                  onChange={(e) => setKpiName(e.target.value)}
                  placeholder="e.g., Total Revenue"
                  required
                  className={inputClass}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm text-neutral-700">
                  Unit <span className="text-red-500">*</span>
                </Label>
                <Select value={unit} onValueChange={setUnit}>
                  <SelectTrigger className={selectTriggerClass}>
                    <SelectValue placeholder="Select unit" />
                  </SelectTrigger>
                  <SelectContent>
                    {units.map((u) => (
                      <SelectItem key={u} value={u}>
                        {u}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label
                  htmlFor="kpi-dept"
                  className="flex items-center gap-1.5 text-sm text-neutral-700"
                >
                  <Building2 className="h-4 w-4 text-[#DA7756]" strokeWidth={2} />
                  Department <span className="text-red-500">*</span>
                </Label>
                <Popover open={deptOpen} onOpenChange={setDeptOpen} modal={false}>
                  <PopoverTrigger asChild>
                    <button
                      id="kpi-dept"
                      type="button"
                      role="combobox"
                      aria-expanded={deptOpen}
                      className={cn(
                        "flex h-11 w-full items-center justify-between rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-[#DA7756]/25 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      )}
                    >
                      <span className={cn("[&>span]:line-clamp-1", department ? "text-neutral-900" : "text-muted-foreground")}>
                        {department
                          ? departmentOptions.find((d) => d.id === department)?.name
                          : "Select department"}
                      </span>
                      <ChevronDown className="h-4 w-4 shrink-0 opacity-50" />
                    </button>
                  </PopoverTrigger>
                  <PopoverContent
                    className="p-0"
                    style={{ width: "var(--radix-popover-trigger-width)" }}
                    align="start"
                  >
                    <Command>
                      <CommandInput placeholder="Search department..." />
                      <CommandList
                        className="max-h-[200px] overflow-y-auto"
                        onWheel={(e) => e.stopPropagation()}
                        onTouchMove={(e) => e.stopPropagation()}
                      >
                        <CommandEmpty>No department found.</CommandEmpty>
                        <CommandGroup>
                          {departmentOptions.map((d) => (
                            <CommandItem
                              key={d.id}
                              value={d.name}
                              onSelect={() => {
                                setDepartment(d.id);
                                setDeptOpen(false);
                              }}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  department === d.id ? "opacity-100 text-[#DA7756]" : "opacity-0"
                                )}
                              />
                              {d.name}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>
              <div className="space-y-2">
                <Label className="flex items-center gap-1.5 text-sm text-neutral-700">
                  <Calendar className="h-4 w-4 text-[#DA7756]" strokeWidth={2} />
                  Frequency <span className="text-red-500">*</span>
                </Label>
                <Select value={frequency} onValueChange={setFrequency}>
                  <SelectTrigger className={selectTriggerClass}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Daily">Daily</SelectItem>
                    <SelectItem value="Weekly">Weekly</SelectItem>
                    <SelectItem value="Monthly">Monthly</SelectItem>
                    <SelectItem value="Quarterly">Quarterly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="kpi-url" className="text-sm text-neutral-700">
                Related Link URL (optional)
              </Label>
              <input
                id="kpi-url"
                type="url"
                value={relatedUrl}
                onChange={(e) => setRelatedUrl(e.target.value)}
                placeholder="https://…"
                className={inputClass}
              />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="kpi-target" className="text-sm text-neutral-700">
                  Target Value
                </Label>
                <input
                  id="kpi-target"
                  type="text"
                  inputMode="numeric"
                  value={targetValue}
                  onChange={(e) => setTargetValue(toIntegerString(e.target.value))}
                  className={inputClass}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm text-neutral-700">Priority</Label>
                <Select value={priority} onValueChange={setPriority}>
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
                <Label htmlFor="kpi-weight" className="text-sm text-neutral-700">
                  Weight (%)
                </Label>
                <input
                  id="kpi-weight"
                  type="text"
                  inputMode="numeric"
                  value={weight}
                  onChange={(e) => setWeight(toIntegerString(e.target.value))}
                  className={inputClass}
                />
              </div>
            </div>
          </div>

          <div
            className={cn(
              "rounded-xl border-2 p-4 sm:p-5",
              "border-violet-200/90 bg-violet-50/50"
            )}
          >
            <div className="mb-3 flex items-center gap-2">
              <Users className="h-5 w-5 text-violet-600" strokeWidth={2} />
              <span className="text-sm font-bold text-neutral-900">
                Assign to Users (Optional)
              </span>
            </div>
            <div className="mb-3 relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
              <input
                type="text"
                value={assigneeSearchInput}
                onChange={(e) => setAssigneeSearchInput(e.target.value)}
                placeholder="Search user by name"
                className={cn(inputClass, "pl-9")}
              />
            </div>
            <div
              className={cn(
                "max-h-52 space-y-2 overflow-y-auto rounded-xl border border-neutral-200/90 bg-[#faf9f6] p-3"
              )}
            >
              {filteredUsers.map((user) => (
                <label
                  key={user.id}
                  className="flex cursor-pointer items-center gap-3 rounded-lg px-2 py-2 text-sm text-neutral-800 hover:bg-white/80"
                >
                  <input
                    type="checkbox"
                    checked={!!assignees[String(user.id)]}
                    onChange={() => toggleAssignee(String(user.id))}
                    className="h-4 w-4 rounded border-[rgba(218,119,86,0.42)] text-[#DA7756] focus:ring-2 focus:ring-[#DA7756]/30"
                  />
                  {user.name}
                </label>
              ))}
              {users.length === 0 && (
                <p className="px-2 py-2 text-sm text-neutral-500">
                  No company members found.
                </p>
              )}
              {users.length > 0 && filteredUsers.length === 0 && (
                <p className="px-2 py-2 text-sm text-neutral-500">
                  No users match your search.
                </p>
              )}
            </div>
          </div>

          <div className="flex flex-col-reverse gap-3 border-t border-neutral-100 pt-4 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
              className={cn(
                "rounded-xl border border-neutral-200 bg-white px-5 py-3 text-sm font-semibold text-neutral-900",
                "hover:bg-neutral-50 disabled:opacity-50 disabled:cursor-not-allowed"
              )}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className={cn(
                "flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold text-white shadow-sm transition-colors",
                "bg-[#DA7756] hover:bg-[#c9674a] disabled:opacity-50 disabled:cursor-not-allowed"
              )}
            >
              {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
              {isLoading ? "Creating..." : "Create KPI"}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateKPIDialog;
