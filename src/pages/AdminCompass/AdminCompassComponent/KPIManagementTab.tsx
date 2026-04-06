// ─────────────────────────────────────────────
// KPIManagementTab.tsx
// ─────────────────────────────────────────────
import React, { useMemo, useState } from "react";
import {
  Trash2,
  Edit,
  UserRound,
  Search,
  LayoutGrid,
  List,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { C, kpiClass } from "./Shared";
import type { KPICardData } from "./kpiTypes";

type FilterUser = {
  id: number;
  name: string;
};

type FilterDepartment = {
  id: number;
  name: string;
};

const tagStyles: Record<string, string> = {
  Sales: "bg-sky-100 text-sky-900 border-sky-200/80",
  Individual: "bg-violet-100 text-violet-900 border-violet-200/80",
  Accounts: "bg-amber-100 text-amber-900 border-amber-200/80",
  Departmental: "bg-rose-100 text-rose-900 border-rose-200/80",
  Operations: "bg-slate-100 text-slate-800 border-slate-200/80",
  Support: "bg-emerald-100 text-emerald-900 border-emerald-200/80",
  Finance: "bg-indigo-100 text-indigo-900 border-indigo-200/80",
  Delivery: "bg-teal-100 text-teal-900 border-teal-200/80",
};

const priorityStyles: Record<KPICardData["priority"], string> = {
  low: "bg-slate-100 text-slate-700 border-slate-200",
  medium: "bg-sky-50 text-[#1e40af] border-sky-200/70",
  high: "bg-orange-50 text-[#c2410c] border-orange-200/80",
};

export interface KPIManagementTabProps {
  kpis: KPICardData[];
  setKpis: React.Dispatch<React.SetStateAction<KPICardData[]>>;
  onDeleteKpi?: (id: string | number) => Promise<void>;
  onEditKpi?: (kpi: KPICardData) => void;
  users?: FilterUser[];
  departments?: FilterDepartment[];
}

const KPICardView: React.FC<{
  kpi: KPICardData;
  selected: boolean;
  onToggleSelect: () => void;
  onDelete: (id: string) => Promise<void>;
  onEdit: (kpi: KPICardData) => void;
}> = ({ kpi, selected, onToggleSelect, onDelete, onEdit }) => {
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    if (!window.confirm(`Delete KPI "${kpi.name}"?`)) return;
    setDeleting(true);
    try {
      await onDelete(kpi.id);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <Card
      className={cn(
        "relative flex flex-col overflow-hidden rounded-[10px] border p-4 shadow-sm transition-shadow hover:shadow-md",
        kpiClass.borderSoft,
        kpiClass.surfaceCard
      )}
    >
      <div className="mb-3 flex flex-wrap items-start gap-2">
        <input
          type="checkbox"
          checked={selected}
          onChange={onToggleSelect}
          className={cn("mt-1 h-4 w-4 shrink-0", kpiClass.checkbox)}
        />
        <div className="flex min-w-0 flex-1 flex-wrap gap-1.5">
          {kpi.tags.map((tag) => (
            <span
              key={tag}
              className={cn(
                "inline-flex rounded-md border px-2 py-0.5 text-[11px] font-semibold",
                tagStyles[tag] ??
                  "bg-neutral-100 text-neutral-800 border-neutral-200"
              )}
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      <h3 className="text-[15px] font-bold leading-snug text-[#1a1a1a]">
        {kpi.name}
      </h3>
      <p className="mt-1 text-xs text-neutral-500">Owner: {kpi.owner}</p>

      <div className="mt-4 flex items-start justify-between gap-3 border-t border-[rgba(218,119,86,0.12)] pt-3">
        <span
          className={cn(
            "inline-flex rounded-md border px-2 py-0.5 text-[11px] font-semibold capitalize",
            priorityStyles[kpi.priority]
          )}
        >
          {kpi.priority}
        </span>
        <div className="text-right">
          <p className="text-[22px] font-bold leading-none tracking-tight text-[#1a1a1a]">
            {kpi.target}
          </p>
          <p className="mt-1 text-xs text-neutral-500">{kpi.frequency}</p>
        </div>
      </div>

      <div className="mt-4 flex items-stretch gap-2">
        <button
          type="button"
          className={cn(
            "inline-flex flex-1 items-center justify-center gap-2 py-2.5 text-sm",
            kpiClass.btnSecondary
          )}
        >
          <UserRound className="h-4 w-4 text-[#DA7756]" />
          Manage
        </button>
        <button
          type="button"
          onClick={() => onEdit(kpi)}
          className={cn(
            "inline-flex h-[42px] w-10 shrink-0 items-center justify-center",
            kpiClass.btnIcon
          )}
          aria-label="Edit KPI"
        >
          <Edit className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={handleDelete}
          disabled={deleting}
          className={cn(
            "inline-flex h-[42px] w-10 shrink-0 items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed",
            kpiClass.btnDanger
          )}
          aria-label="Delete KPI"
        >
          {deleting ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Trash2 className="h-4 w-4" />
          )}
        </button>
      </div>
    </Card>
  );
};

const KPIListView: React.FC<{
  kpis: KPICardData[];
  selectedIds: Set<string>;
  toggleOne: (id: string) => void;
  onDelete: (id: string) => Promise<void>;
  onEdit: (kpi: KPICardData) => void;
}> = ({ kpis, selectedIds, toggleOne, onDelete, onEdit }) => {
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this KPI?")) return;
    setDeletingId(id);
    try {
      await onDelete(id);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div
      className={cn(
        "overflow-hidden rounded-[10px] border shadow-sm",
        kpiClass.borderSoft,
        kpiClass.surfaceCard
      )}
    >
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-[rgba(218,119,86,0.12)] bg-[#faf9f6] text-xs font-semibold uppercase tracking-wide text-neutral-600">
            <th className="w-10 px-3 py-3" />
            <th className="px-3 py-3">KPI</th>
            <th className="px-3 py-3">Owner</th>
            <th className="px-3 py-3">Target</th>
            <th className="px-3 py-3">Frequency</th>
            <th className="px-3 py-3">Priority</th>
            <th className="px-3 py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {kpis.map((kpi) => (
            <tr
              key={kpi.id}
              className="border-b border-neutral-100 last:border-0 hover:bg-[#faf9f6]/80"
            >
              <td className="px-3 py-3 align-middle">
                <input
                  type="checkbox"
                  checked={selectedIds.has(kpi.id)}
                  onChange={() => toggleOne(kpi.id)}
                  className={cn("h-4 w-4", kpiClass.checkbox)}
                />
              </td>
              <td className="px-3 py-3 font-semibold text-[#1a1a1a]">
                {kpi.name}
              </td>
              <td className="px-3 py-3 text-neutral-600">{kpi.owner}</td>
              <td className="px-3 py-3 font-semibold text-[#1a1a1a]">
                {kpi.target}
              </td>
              <td className="px-3 py-3 text-neutral-600">{kpi.frequency}</td>
              <td className="px-3 py-3">
                <span
                  className={cn(
                    "inline-flex rounded-md border px-2 py-0.5 text-[11px] font-semibold capitalize",
                    priorityStyles[kpi.priority]
                  )}
                >
                  {kpi.priority}
                </span>
              </td>
              <td className="px-3 py-3 text-right">
                <div className="inline-flex gap-1">
                  <button
                    type="button"
                    onClick={() => onEdit(kpi)}
                    className={cn(
                      "inline-flex h-8 w-8 items-center justify-center",
                      kpiClass.btnIcon
                    )}
                    aria-label="Edit"
                  >
                    <Edit className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(kpi.id)}
                    disabled={deletingId === kpi.id}
                    className={cn(
                      "inline-flex h-8 w-8 items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed",
                      kpiClass.btnDanger
                    )}
                    aria-label="Delete"
                  >
                    {deletingId === kpi.id ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <Trash2 className="h-3.5 w-3.5" />
                    )}
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const KPIManagementTab: React.FC<KPIManagementTabProps> = ({
  kpis,
  setKpis,
  onDeleteKpi,
  onEditKpi,
  users = [],
  departments = [],
}) => {
  const [view, setView] = useState<"cards" | "list">("cards");
  const [search, setSearch] = useState("");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [selectedDepartment, setSelectedDepartment] = useState("all");
  const [selectedUser, setSelectedUser] = useState("all");
  const [selectedFrequency, setSelectedFrequency] = useState("all");

  const frequencyOptions = useMemo(() => {
    const values = new Set(
      kpis.map((k) => String(k.frequency || "").trim()).filter(Boolean)
    );
    return Array.from(values);
  }, [kpis]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return kpis.filter((k) => {
      const matchesSearch =
        !q ||
        k.name.toLowerCase().includes(q) ||
        k.owner.toLowerCase().includes(q) ||
        k.tags.some((t) => t.toLowerCase().includes(q));

      const matchesDepartment =
        selectedDepartment === "all" ||
        k.tags.some((t) => t.toLowerCase() === selectedDepartment.toLowerCase()) ||
        String(k.departmentId ?? "") === selectedDepartment;

      const matchesUser =
        selectedUser === "all" ||
        String(k.assigneeId ?? "") === selectedUser ||
        k.owner.toLowerCase() ===
          (users.find((u) => String(u.id) === selectedUser)?.name.toLowerCase() ?? "");

      const matchesFrequency =
        selectedFrequency === "all" ||
        k.frequency.toLowerCase() === selectedFrequency.toLowerCase();

      return (
        matchesSearch &&
        matchesDepartment &&
        matchesUser &&
        matchesFrequency
      );
    });
  }, [kpis, search, selectedDepartment, selectedUser, selectedFrequency, users]);

  const allFilteredSelected =
    filtered.length > 0 && filtered.every((k) => selectedIds.has(k.id));

  const toggleSelectAll = () => {
    if (allFilteredSelected) {
      setSelectedIds((prev) => {
        const next = new Set(prev);
        filtered.forEach((k) => next.delete(k.id));
        return next;
      });
    } else {
      setSelectedIds((prev) => {
        const next = new Set(prev);
        filtered.forEach((k) => next.add(k.id));
        return next;
      });
    }
  };

  const toggleOne = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleDeleteKpi = async (id: string) => {
    try {
      // Call API if provided
      if (onDeleteKpi) {
        await onDeleteKpi(id);
      }
      setSelectedIds((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    } catch (error) {
      console.error("Delete error:", error);
      throw error;
    }
  };

  const handleEditKpi = (kpi: KPICardData) => {
    onEditKpi?.(kpi);
  };

  const filterSelectClass = cn(
    "rounded-lg px-3 py-2 text-sm text-[#1a1a1a] shadow-sm",
    kpiClass.border,
    kpiClass.surfaceInput,
    kpiClass.focusRing
  );

  const filterSelectCompactClass = cn(
    "shrink-0 rounded-lg px-2 py-1.5 text-xs text-[#1a1a1a] shadow-sm min-w-[7rem] max-w-[9rem]",
    kpiClass.border,
    kpiClass.surfaceInput,
    kpiClass.focusRingSm
  );

  return (
    <div className="space-y-5">
      <div className="inline-flex rounded-lg border border-[rgba(218,119,86,0.2)] bg-[#eceae4] p-1">
        <button
          type="button"
          onClick={() => setView("cards")}
          className={cn(
            "inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-semibold transition-all",
            view === "cards"
              ? "bg-[#DA7756] text-white shadow-sm"
              : "text-neutral-600 hover:bg-[#fef6f4]/70 hover:text-[#1a1a1a]"
          )}
        >
          <LayoutGrid className="h-4 w-4" />
          Cards
        </button>
        <button
          type="button"
          onClick={() => setView("list")}
          className={cn(
            "inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-semibold transition-all",
            view === "list"
              ? "bg-[#DA7756] text-white shadow-sm"
              : "text-neutral-600 hover:bg-[#fef6f4]/70 hover:text-[#1a1a1a]"
          )}
        >
          <List className="h-4 w-4" />
          List
        </button>
      </div>

      <div
        className="flex flex-col gap-4 rounded-xl border border-[rgba(218,119,86,0.22)] px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5"
        style={{ backgroundColor: C.primaryBg }}
      >
        <div>
          <h3 className="text-sm font-bold text-[#1a1a1a]">
            Quick Setup: Department KPIs
          </h3>
          <p className="mt-1 text-xs text-neutral-600">
            Configure all KPIs for a department at once with priorities and
            thresholds.
          </p>
        </div>
        <select
          className={cn(filterSelectClass, "min-w-[200px] shrink-0")}
          value={selectedDepartment}
          onChange={(e) => setSelectedDepartment(e.target.value)}
        >
          <option value="all">All Departments</option>
          {departments.map((dept) => (
            <option key={dept.id} value={String(dept.id)}>
              {dept.name}
            </option>
          ))}
        </select>
      </div>

      <div className="-mx-1 flex flex-nowrap items-center gap-2 overflow-x-auto px-1 pb-0.5 [scrollbar-width:thin]">
        <label className="flex shrink-0 cursor-pointer items-center gap-1.5 whitespace-nowrap pl-0.5 text-xs font-semibold text-[#1a1a1a] sm:text-sm">
          <input
            type="checkbox"
            checked={allFilteredSelected}
            onChange={toggleSelectAll}
            className={cn(
              "h-3.5 w-3.5 shrink-0 sm:h-4 sm:w-4",
              kpiClass.checkbox
            )}
          />
          Select all
        </label>
        <div className="relative h-8 w-[140px] shrink-0 sm:w-[168px]">
          <Search className="pointer-events-none absolute left-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-neutral-400" />
          <input
            type="search"
            placeholder="Search…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={cn(
              "h-full w-full rounded-lg py-0 pl-8 pr-2 text-xs text-[#1a1a1a] shadow-sm placeholder:text-neutral-400",
              kpiClass.border,
              kpiClass.surfaceInput,
              kpiClass.focusRingSm
            )}
          />
        </div>
        <select
          className={filterSelectCompactClass}
          value={selectedDepartment}
          onChange={(e) => setSelectedDepartment(e.target.value)}
        >
          <option value="all">All Departments</option>
          {departments.map((dept) => (
            <option key={dept.id} value={String(dept.id)}>
              {dept.name}
            </option>
          ))}
        </select>
        <select
          className={filterSelectCompactClass}
          value={selectedUser}
          onChange={(e) => setSelectedUser(e.target.value)}
        >
          <option value="all">All Users</option>
          {users.map((u) => (
            <option key={u.id} value={String(u.id)}>
              {u.name}
            </option>
          ))}
        </select>
        <select
          className={filterSelectCompactClass}
          value={selectedFrequency}
          onChange={(e) => setSelectedFrequency(e.target.value)}
        >
          <option value="all">All Frequencies</option>
          {frequencyOptions.map((freq) => (
            <option key={freq} value={freq}>
              {freq}
            </option>
          ))}
        </select>
        <select className={filterSelectCompactClass} defaultValue="all">
          <option value="all">All KPIs</option>
        </select>
        <select className={filterSelectCompactClass} defaultValue="all">
          <option value="all">All Types</option>
        </select>
        <select className={filterSelectCompactClass} defaultValue="all">
          <option value="all">All Entries</option>
        </select>
      </div>

      {view === "cards" ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((kpi) => (
            <KPICardView
              key={kpi.id}
              kpi={kpi}
              selected={selectedIds.has(kpi.id)}
              onToggleSelect={() => toggleOne(kpi.id)}
              onDelete={handleDeleteKpi}
              onEdit={handleEditKpi}
            />
          ))}
        </div>
      ) : (
        <KPIListView
          kpis={filtered}
          selectedIds={selectedIds}
          toggleOne={toggleOne}
          onDelete={handleDeleteKpi}
          onEdit={handleEditKpi}
        />
      )}
    </div>
  );
};

export default KPIManagementTab;
