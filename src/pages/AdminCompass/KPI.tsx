// ─────────────────────────────────────────────
// KPI.tsx  —  Root component
// ─────────────────────────────────────────────
import React, { useMemo, useState } from "react";
import { BookOpen, Plus, BarChart3 } from "lucide-react";
import { cn } from "@/lib/utils";
import KPIManagementTab from "./AdminCompassComponent/KPIManagementTab";
import ArchivedKPIsTab from "./AdminCompassComponent/ArchivedKPIsTab";
import MissedEntitiesTab from "./AdminCompassComponent/MissedEntitiesTab";
import KPIHistoryTab from "./AdminCompassComponent/KPIHistoryTab";
import KPISettingsTab from "./AdminCompassComponent/KPISettingsTab";
import KPIGuideTab from "./AdminCompassComponent/KPIGuideTab";
import CreateKPIDialog from "./AdminCompassComponent/CreateKPIDialog";
import { C, kpiClass } from "./AdminCompassComponent/Shared";
import {
  initialKpiCards,
  type KPICardData,
} from "./AdminCompassComponent/kpiTypes";

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
  const [kpis, setKpis] = useState<KPICardData[]>(initialKpiCards);
  const [createKpiOpen, setCreateKpiOpen] = useState(false);

  const { totalKPIs, onTargetCount, atRiskCount } = useMemo(() => {
    const onTargetCount = kpis.filter((k) => k.status === "on-target").length;
    const atRiskCount = kpis.filter((k) => k.status === "at-risk").length;
    return { totalKPIs: kpis.length, onTargetCount, atRiskCount };
  }, [kpis]);

  return (
    <div
      className="mx-auto rounded-[28px] border border-[rgba(218,119,86,0.16)] bg-[#f6f4ee] shadow-[0_18px_50px_rgba(15,23,42,0.05)]"
      style={{ background: C.pageBg, color: C.textMain }}
    >
      <CreateKPIDialog
        open={createKpiOpen}
        onOpenChange={setCreateKpiOpen}
        onCreated={(kpi) => setKpis((prev) => [kpi, ...prev])}
      />
      <div className="p-6 pb-0 max-w-7xl mx-auto">
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

      <div className="mx-auto max-w-7xl p-6 pt-5">
        {activeTab === "KPI Management" && (
          <KPIManagementTab kpis={kpis} setKpis={setKpis} />
        )}
        {activeTab === "Archived KPIs" && <ArchivedKPIsTab />}
        {activeTab === "Missed Entries" && <MissedEntitiesTab />}
        {activeTab === "KPI History" && <KPIHistoryTab />}
        {activeTab === "Settings" && <KPISettingsTab />}
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
