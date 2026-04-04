// ─────────────────────────────────────────────
// ArchivedKPIsTab.tsx
// ─────────────────────────────────────────────
import React, { useState } from "react";
import { Trash2, RotateCcw, MoreVertical } from "lucide-react";
import { cn } from "@/lib/utils";
import { kpiClass } from "./shared";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ArchivedKPI {
  id: string;
  name: string;
  owner: string;
  archivedDate: string;
  reason: string;
  frequency: string;
}

const ArchivedKPIsTab: React.FC = () => {
  const [archived] = useState<ArchivedKPI[]>([]);

  return (
    <div className={cn("rounded-lg p-6 shadow-sm", kpiClass.border, kpiClass.surfaceCard)}>
      <div className="flex gap-3">
        <Trash2 className="mt-0.5 h-5 w-5 shrink-0 text-red-500" strokeWidth={2} aria-hidden />
        <div className="min-w-0 flex-1">
          <h2 className="text-base font-bold text-[#334155]">Archived KPIs</h2>
          <p className="mt-1 text-sm font-normal leading-relaxed text-[#64748b]">
            These KPIs have been archived or orphaned (parent deleted) and are hidden from all
            reports. Restore them to make them active again.
          </p>
        </div>
      </div>

      {archived.length > 0 ? (
        <div className={cn("mt-6 overflow-x-auto rounded-lg border", kpiClass.border, kpiClass.surfacePanel)}>
          <table className="w-full text-sm">
            <thead className="border-b border-[rgba(218,119,86,0.12)] bg-[#f3f1ec]">
              <tr>
                <th className="px-4 py-3 text-left font-semibold text-[#1a1a1a]">KPI Name</th>
                <th className="px-4 py-3 text-left font-semibold text-[#1a1a1a]">Owner</th>
                <th className="px-4 py-3 text-left font-semibold text-[#1a1a1a]">Archived Date</th>
                <th className="px-4 py-3 text-left font-semibold text-[#1a1a1a]">Reason</th>
                <th className="px-4 py-3 text-left font-semibold text-[#1a1a1a]">Frequency</th>
                <th className="px-4 py-3 text-center font-semibold text-[#1a1a1a]">Actions</th>
              </tr>
            </thead>
            <tbody>
              {archived.map((kpi) => (
                <tr
                  key={kpi.id}
                  className="border-b border-[rgba(218,119,86,0.08)] last:border-0 hover:bg-[#fef6f4]/50"
                >
                  <td className="px-4 py-3 font-medium text-[#1a1a1a]">{kpi.name}</td>
                  <td className="px-4 py-3 text-neutral-600">{kpi.owner}</td>
                  <td className="px-4 py-3 text-neutral-600">{kpi.archivedDate}</td>
                  <td className="px-4 py-3 text-neutral-600">{kpi.reason}</td>
                  <td className="px-4 py-3">
                    <span className="inline-block rounded border border-[rgba(218,119,86,0.15)] bg-[#faf9f6] px-2 py-1 text-xs font-medium text-neutral-700">
                      {kpi.frequency}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button
                          type="button"
                          className="inline-flex rounded p-1 transition-colors hover:bg-[#fef6f4]"
                        >
                          <MoreVertical className="h-4 w-4 text-neutral-600" />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem className="cursor-pointer">
                          <RotateCcw className="mr-2 h-4 w-4" />
                          Restore KPI
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="flex min-h-[150px] items-center justify-center">
          <p className="text-center text-[#94a3b8]">No archived KPIs</p>
        </div>
      )}
    </div>
  );
};

export default ArchivedKPIsTab;
