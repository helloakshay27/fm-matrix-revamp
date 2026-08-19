import { MapPin, X } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UnifiedDateRangeFilter } from "@/components/dashboard/UnifiedDateRangeFilter";

export interface SiteOption {
  value: string;
  label: string;
}

const PRESETS = [
  { label: "Last 7 days", days: 7 },
  { label: "Last 30 days", days: 30 },
  { label: "Last 90 days", days: 90 },
];

interface FilterBarProps {
  dateRange: { from: Date; to: Date };
  onPresetSelect: (days: number) => void;
  onDateRangeChange: (range: { from?: Date; to?: Date } | undefined) => void;
  activePresetDays: number | null;
  siteId: string;
  onSiteChange: (siteId: string) => void;
  siteOptions: SiteOption[];
  hasActiveFilters: boolean;
  onReset: () => void;
}

export function FilterBar({
  dateRange,
  onPresetSelect,
  onDateRangeChange,
  activePresetDays,
  siteId,
  onSiteChange,
  siteOptions,
  hasActiveFilters,
  onReset,
}: FilterBarProps) {
  return (
    <div className="flex flex-wrap items-center gap-3 rounded-lg border border-brand-border bg-brand-card-white p-3">
      <div className="flex items-center gap-1 rounded-md border border-brand-border bg-brand-bg p-1">
        {PRESETS.map((p) => (
          <button
            key={p.days}
            type="button"
            onClick={() => onPresetSelect(p.days)}
            className={`rounded px-3 py-1.5 text-brand-body-5 font-medium transition-colors ${
              activePresetDays === p.days
                ? "bg-brand text-white"
                : "text-brand-text-light hover:bg-brand-card-white"
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>

      <div className="min-w-[200px] max-w-[260px]">
        <UnifiedDateRangeFilter dateRange={dateRange} onDateRangeChange={onDateRangeChange} />
      </div>

      <Select value={siteId} onValueChange={onSiteChange}>
        <SelectTrigger className="h-10 w-[220px] border-brand-border bg-white">
          <MapPin className="mr-1 h-4 w-4 text-brand-text-light" />
          <SelectValue placeholder="All sites" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All sites</SelectItem>
          {siteOptions.map((s) => (
            <SelectItem key={s.value} value={s.value}>
              {s.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {hasActiveFilters && (
        <button
          type="button"
          onClick={onReset}
          className="flex items-center gap-1 text-brand-body-5 font-medium text-brand-text-light hover:text-brand"
        >
          <X className="h-3.5 w-3.5" />
          Reset
        </button>
      )}
    </div>
  );
}
