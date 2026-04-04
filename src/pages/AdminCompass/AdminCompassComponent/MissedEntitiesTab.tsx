// ─────────────────────────────────────────────
// MissedEntitiesTab.tsx  —  Missed Entries
// ─────────────────────────────────────────────
import React, { useMemo, useState } from "react";
import {
  AlertCircle,
  CalendarDays,
  ChevronDown,
  Filter,
  Layers,
  Search,
  Users,
} from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";
import { kpiClass } from "./shared";

interface MissedEntryDetail {
  id: string;
  kpiName: string;
  missedOn?: string;
}

interface MissedUserRow {
  id: string;
  name: string;
  email: string;
  department: string;
  missedCount: number;
  entries: MissedEntryDetail[];
}

const MISSED_USERS: MissedUserRow[] = [
  {
    id: "1",
    name: "Punit Jain",
    email: "punit.jain@lockated.com",
    department: "Accounts",
    missedCount: 2,
    entries: [
      { id: "e1", kpiName: "Invoices Raised", missedOn: "Mar 28, 2026" },
      { id: "e2", kpiName: "Monthly Close Checklist", missedOn: "Mar 30, 2026" },
    ],
  },
];

const selectClass = cn(
  "min-w-[140px] flex-1 rounded-lg px-3 py-2 text-sm text-[#1a1a1a] shadow-sm",
  kpiClass.border,
  kpiClass.surfaceInput,
  kpiClass.focusRing
);

const MissedEntitiesTab: React.FC = () => {
  const [search, setSearch] = useState("");
  const [groupByDept, setGroupByDept] = useState(false);
  const [openId, setOpenId] = useState<string | null>(null);
  const [lookbackDays, setLookbackDays] = useState("30");

  const filteredUsers = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return MISSED_USERS;
    return MISSED_USERS.filter(
      (u) =>
        u.name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        u.entries.some((e) => e.kpiName.toLowerCase().includes(q))
    );
  }, [search]);

  const totalMissed = useMemo(
    () => filteredUsers.reduce((acc, u) => acc + u.missedCount, 0),
    [filteredUsers]
  );
  const usersWithMissed = filteredUsers.length;
  const lookbackLabel =
    lookbackDays === "7" ? "7 days" : lookbackDays === "90" ? "90 days" : "30 days";

  const groupedByDept = useMemo(() => {
    const map = new Map<string, MissedUserRow[]>();
    for (const u of filteredUsers) {
      const list = map.get(u.department) ?? [];
      list.push(u);
      map.set(u.department, list);
    }
    return map;
  }, [filteredUsers]);

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-[rgba(218,119,86,0.28)] bg-[#fef6f4] px-5 py-5 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-neutral-600">Total Missed Entries</p>
              <p className="mt-1 text-4xl font-bold leading-none text-[#1a1a1a]">{totalMissed}</p>
            </div>
            <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-[#DA7756]/15">
              <AlertCircle className="h-6 w-6 text-[#DA7756]" strokeWidth={2} />
            </span>
          </div>
        </div>

        <div className="rounded-2xl border border-rose-200/90 bg-rose-50/90 px-5 py-5 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-neutral-600">Users with Missed Entries</p>
              <p className="mt-1 text-4xl font-bold leading-none text-rose-900">{usersWithMissed}</p>
            </div>
            <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-rose-100">
              <Users className="h-6 w-6 text-rose-600" strokeWidth={2} />
            </span>
          </div>
        </div>

        <div className="rounded-2xl border border-sky-200/90 bg-sky-50/90 px-5 py-5 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-neutral-600">Lookback Period</p>
              <p className="mt-1 text-2xl font-bold leading-tight text-sky-950 sm:text-3xl">
                {lookbackLabel}
              </p>
            </div>
            <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-sky-100">
              <CalendarDays className="h-6 w-6 text-sky-600" strokeWidth={2} />
            </span>
          </div>
        </div>
      </div>

      <div className={cn("rounded-xl p-5 shadow-sm", kpiClass.borderSoft, kpiClass.surfaceCard)}>
        <div className="mb-4 flex items-center gap-2">
          <Filter className="h-5 w-5 text-[#DA7756]" strokeWidth={2} />
          <h3 className="text-sm font-bold text-[#1a1a1a]">Filters</h3>
        </div>
        <div className="flex flex-col gap-3 xl:flex-row xl:flex-wrap xl:items-center">
          <div className="relative min-w-[220px] flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
            <input
              type="search"
              placeholder="Search KPI or User…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className={cn(
                "w-full rounded-lg py-2 pl-9 pr-3 text-sm text-[#1a1a1a] shadow-sm placeholder:text-neutral-400",
                kpiClass.border,
                kpiClass.surfaceInput,
                kpiClass.focusRing
              )}
            />
          </div>
          <select className={selectClass} defaultValue="all">
            <option value="all">All Departments</option>
          </select>
          <select className={selectClass} defaultValue="all">
            <option value="all">All Users</option>
          </select>
          <select className={selectClass} defaultValue="all">
            <option value="all">All KPIs</option>
          </select>
          <select
            className={selectClass}
            value={lookbackDays}
            onChange={(e) => setLookbackDays(e.target.value)}
          >
            <option value="7">Last 7 days</option>
            <option value="30">Last 30 days</option>
            <option value="90">Last 90 days</option>
          </select>
        </div>
      </div>

      <div>
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-lg font-bold text-[#1a1a1a]">Missed Entries by User</h2>
          <button
            type="button"
            onClick={() => setGroupByDept((v) => !v)}
            className={cn(
              "inline-flex items-center justify-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-semibold shadow-sm transition-colors",
              groupByDept
                ? "border-[#DA7756] bg-[#DA7756] text-white hover:bg-[#c9674a]"
                : cn(
                    "text-[#1a1a1a]",
                    kpiClass.border,
                    kpiClass.surfacePanel,
                    "hover:bg-[#f3ebe8]"
                  )
            )}
          >
            <Layers className="h-4 w-4" />
            Group by Department
          </button>
        </div>

        {!groupByDept ? (
          <div className="space-y-3">
            {filteredUsers.map((user) => (
              <UserMissedCard
                key={user.id}
                user={user}
                open={openId === user.id}
                onOpenChange={(o) => setOpenId(o ? user.id : null)}
              />
            ))}
            {filteredUsers.length === 0 && (
              <p
                className={cn(
                  "rounded-xl border border-dashed py-12 text-center text-sm text-neutral-500",
                  kpiClass.border,
                  kpiClass.surfacePanel
                )}
              >
                No missed entries match your filters.
              </p>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            {Array.from(groupedByDept.entries()).map(([dept, users]) => (
              <div key={dept}>
                <p className="mb-2 text-xs font-bold uppercase tracking-wide text-neutral-500">
                  {dept}
                </p>
                <div className="space-y-3">
                  {users.map((user) => (
                    <UserMissedCard
                      key={user.id}
                      user={user}
                      open={openId === user.id}
                      onOpenChange={(o) => setOpenId(o ? user.id : null)}
                    />
                  ))}
                </div>
              </div>
            ))}
            {filteredUsers.length === 0 && (
              <p
                className={cn(
                  "rounded-xl border border-dashed py-12 text-center text-sm text-neutral-500",
                  kpiClass.border,
                  kpiClass.surfacePanel
                )}
              >
                No missed entries match your filters.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const UserMissedCard: React.FC<{
  user: MissedUserRow;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}> = ({ user, open, onOpenChange }) => {
  return (
    <Collapsible open={open} onOpenChange={onOpenChange}>
      <div className="overflow-hidden rounded-xl border border-[rgba(218,119,86,0.4)] bg-[#fef6f4] shadow-sm">
        <CollapsibleTrigger className="flex w-full items-center justify-between gap-4 px-4 py-4 text-left transition-colors hover:bg-[#fff8f5] sm:px-5">
          <div className="min-w-0 flex-1">
            <p className="font-bold text-[#1a1a1a]">{user.name}</p>
            <p className="mt-0.5 text-sm text-neutral-600">{user.email}</p>
            <span className="mt-2 inline-flex rounded-md border border-sky-300 bg-[#faf9f6] px-2 py-0.5 text-xs font-semibold text-sky-900">
              {user.department}
            </span>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <span className="rounded-full bg-[#DA7756] px-3 py-1.5 text-sm font-semibold text-white whitespace-nowrap">
              {user.missedCount} missed
            </span>
            <ChevronDown
              className={cn(
                "h-5 w-5 text-neutral-500 transition-transform duration-200",
                open && "rotate-180"
              )}
            />
          </div>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className="border-t border-[rgba(218,119,86,0.2)] bg-[#faf9f6]/95 px-4 py-3 sm:px-5">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-neutral-500">
              Missed KPIs
            </p>
            <ul className="space-y-2">
              {user.entries.map((e) => (
                <li
                  key={e.id}
                  className={cn(
                    "flex flex-col gap-0.5 rounded-lg px-3 py-2 text-sm sm:flex-row sm:items-center sm:justify-between",
                    kpiClass.borderSoft,
                    kpiClass.surfaceCard
                  )}
                >
                  <span className="font-medium text-[#1a1a1a]">{e.kpiName}</span>
                  {e.missedOn && (
                    <span className="text-xs text-neutral-500">{e.missedOn}</span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </CollapsibleContent>
      </div>
    </Collapsible>
  );
};

export default MissedEntitiesTab;
