// ─────────────────────────────────────────────
// KPISettingsTab.tsx  —  KPI Units Configuration
// ─────────────────────────────────────────────
import React, { useState } from "react";
import { Plus, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { kpiClass } from "./shared";

const DEFAULT_UNITS = [
  "₹",
  "#",
  "%",
  "Hours",
  "Days",
  "Calls",
  "Leads",
  "Invoices",
  "Orders",
  "Units",
];

const KPISettingsTab: React.FC = () => {
  const [units, setUnits] = useState<string[]>(DEFAULT_UNITS);
  const [draft, setDraft] = useState("");

  const addUnit = () => {
    const next = draft.trim();
    if (!next) return;
    if (units.some((u) => u.toLowerCase() === next.toLowerCase())) {
      setDraft("");
      return;
    }
    setUnits((prev) => [...prev, next]);
    setDraft("");
  };

  const removeUnit = (unit: string) => {
    setUnits((prev) => prev.filter((u) => u !== unit));
  };

  return (
    <div className="w-full">
      <div
        className={cn(
          "rounded-xl p-6 shadow-sm sm:p-8",
          kpiClass.borderSoft,
          kpiClass.surfaceCard
        )}
      >
        <h2 className="text-lg font-bold text-[#1a1a1a] sm:text-xl">KPI Units Configuration</h2>
        <p className="mt-2 text-sm leading-relaxed text-neutral-600">
          Define the units that will be available when creating KPIs across your organization.
        </p>

        <div className="mt-6 flex flex-wrap gap-2">
          {units.map((unit) => (
            <span
              key={unit}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-[#1a1a1a] shadow-sm",
                kpiClass.border,
                kpiClass.surfacePanel
              )}
            >
              <span className="max-w-[min(100%,18rem)] truncate">{unit}</span>
              <button
                type="button"
                onClick={() => removeUnit(unit)}
                className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-neutral-400 transition-colors hover:bg-[#f3ebe8] hover:text-[#DA7756]"
                aria-label={`Remove unit ${unit}`}
              >
                <X className="h-3.5 w-3.5" strokeWidth={2} />
              </button>
            </span>
          ))}
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-stretch">
          <input
            type="text"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addUnit();
              }
            }}
            placeholder="Add new unit (e.g., Km, Projects, Clients)…"
            className={cn(
              "min-h-[44px] flex-1 rounded-lg px-4 py-2.5 text-sm text-[#1a1a1a] shadow-sm placeholder:text-neutral-400",
              kpiClass.border,
              kpiClass.surfaceInput,
              kpiClass.focusRing
            )}
          />
          <button
            type="button"
            onClick={addUnit}
            className="inline-flex h-[44px] shrink-0 items-center justify-center gap-2 rounded-lg bg-[#DA7756] px-5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#c9674a] sm:px-6"
          >
            <Plus className="h-4 w-4" strokeWidth={2} />
            Add Unit
          </button>
        </div>
      </div>
    </div>
  );
};

export default KPISettingsTab;
