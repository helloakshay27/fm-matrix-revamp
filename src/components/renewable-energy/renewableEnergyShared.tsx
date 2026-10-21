import React, { useCallback, useEffect, useState, useSyncExternalStore } from "react";
import { Info, RefreshCw } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Tooltip as UITooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getFullUrl, getAuthenticatedFetchOptions } from "@/config/apiConfig";

export interface RenewableEnergyCardProps {
  startDate?: string;
  endDate?: string;
  /** Site name for the API (it filters by name, not id). Undefined = all sites. */
  siteName?: string;
}

const ALL_AREAS = "all";
const FONT = "Work Sans, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial";

export const yearFromDate = (date?: string) => {
  const year = Number((date ?? "").slice(0, 4));
  return Number.isFinite(year) && year > 0 ? year : new Date().getFullYear();
};

const filtersCache = new Map<string, Promise<string[]>>();

// The area list is the same for the 3 cards, so share one request per site/year.
const fetchAreas = (siteName: string | undefined, year: number) => {
  const key = `${siteName ?? ""}|${year}`;
  let pending = filtersCache.get(key);
  if (!pending) {
    const params = new URLSearchParams({ year: String(year) });
    if (siteName) params.set("site", siteName);
    pending = fetch(
      `${getFullUrl("/pms/assets/renewable_energy_filters.json")}?${params.toString()}`,
      getAuthenticatedFetchOptions()
    )
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((body) => (Array.isArray(body?.data?.areas) ? (body.data.areas as string[]) : []))
      .catch((err) => {
        filtersCache.delete(key);
        throw err;
      });
    filtersCache.set(key, pending);
  }
  return pending;
};

// One selected area shared by all renewable energy cards: changing it in any
// card's dropdown updates the other two.
const AREA_STORAGE_KEY = "renewableEnergyArea";
let sharedArea: string = (() => {
  try {
    return localStorage.getItem(AREA_STORAGE_KEY) || ALL_AREAS;
  } catch {
    return ALL_AREAS;
  }
})();
const areaListeners = new Set<() => void>();

const setSharedArea = (next: string) => {
  if (next === sharedArea) return;
  sharedArea = next;
  try {
    localStorage.setItem(AREA_STORAGE_KEY, next);
  } catch {
    /* storage unavailable: the in-memory value still works */
  }
  areaListeners.forEach((listener) => listener());
};

const subscribeArea = (listener: () => void) => {
  areaListeners.add(listener);
  return () => {
    areaListeners.delete(listener);
  };
};

/**
 * Area dropdown state for the renewable energy cards. Options come from
 * renewable_energy_filters.json; the selected value is sent as `area` as-is.
 */
export function useRenewableAreaFilter(siteName: string | undefined, year: number) {
  const [areas, setAreas] = useState<string[]>([]);
  const area = useSyncExternalStore(subscribeArea, () => sharedArea);

  useEffect(() => {
    let cancelled = false;
    fetchAreas(siteName, year)
      .then((list) => {
        if (cancelled) return;
        setAreas(list);
        // The saved area may not exist for this site/year; fall back to all areas.
        if (sharedArea !== ALL_AREAS && !list.includes(sharedArea)) setSharedArea(ALL_AREAS);
      })
      .catch(() => {
        if (!cancelled) setAreas([]);
      });
    return () => {
      cancelled = true;
    };
  }, [siteName, year]);

  return { areas, area, setArea: setSharedArea, areaParam: area === ALL_AREAS ? undefined : area };
}

/** Generic fetch for the renewable energy endpoints, aborting stale requests. */
export function useRenewableEndpoint<T>(
  path: string,
  params: Record<string, string | undefined>
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const paramsKey = JSON.stringify(params);

  const load = useCallback(
    async (signal?: AbortSignal) => {
      setLoading(true);
      setError(null);
      try {
        const qs = new URLSearchParams();
        Object.entries(JSON.parse(paramsKey) as Record<string, string | undefined>).forEach(([k, v]) => {
          if (v) qs.set(k, v);
        });
        const res = await fetch(`${getFullUrl(path)}?${qs.toString()}`, {
          ...getAuthenticatedFetchOptions(),
          signal,
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const body = await res.json();
        if (body?.success === false) throw new Error("Failed to load data");
        setData(body as T);
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") return;
        setError(err instanceof Error ? err.message : "Failed to load data");
      } finally {
        if (!signal?.aborted) setLoading(false);
      }
    },
    [path, paramsKey]
  );

  useEffect(() => {
    const controller = new AbortController();
    load(controller.signal);
    return () => controller.abort();
  }, [load]);

  return { data, loading, error, reload: () => load() };
}

interface FrameProps {
  title: string;
  info?: string;
  areas: string[];
  area: string;
  onAreaChange: (area: string) => void;
  loading: boolean;
  error: string | null;
  onRefresh: () => void;
  children: React.ReactNode;
}

/** Shared card shell, same chrome as the Asset Management analytics cards (title, info, refresh) plus the area dropdown. */
export const RenewableCardFrame: React.FC<FrameProps> = ({
  title,
  info,
  areas,
  area,
  onAreaChange,
  loading,
  error,
  onRefresh,
  children,
}) => (
  <Card className="w-full h-full border border-gray-200 shadow-sm bg-white">
    <CardHeader className="pb-4 px-6 pt-6">
      <div className="flex items-center justify-between gap-3">
        <CardTitle className="text-xl font-bold text-[#C72030]" style={{ fontFamily: FONT }}>
          {title}
        </CardTitle>
        <div className="flex items-center gap-2 shrink-0" data-no-drag="true">
          <Select value={area} onValueChange={onAreaChange}>
            <SelectTrigger
              className="h-8 w-[140px] text-xs"
              onPointerDown={(e) => e.stopPropagation()}
              onMouseDown={(e) => e.stopPropagation()}
            >
              <SelectValue placeholder="Area" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL_AREAS}>All Areas</SelectItem>
              {areas.map((a) => (
                <SelectItem key={a} value={a}>
                  {a}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {info && (
            <TooltipProvider>
              <UITooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="sm" className="w-8 h-8 p-0">
                    <Info className="w-5 h-5 !text-[#000000]" style={{ color: "#000000" }} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="bg-gray-900 text-white border-gray-700">
                  <p className="max-w-xs text-sm font-medium">{info}</p>
                </TooltipContent>
              </UITooltip>
            </TooltipProvider>
          )}
          <RefreshCw
            className={`w-5 h-5 flex-shrink-0 cursor-pointer text-black hover:text-gray-700 transition-colors${loading ? " animate-spin" : ""}`}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onRefresh();
            }}
            onPointerDown={(e) => e.stopPropagation()}
            onMouseDown={(e) => e.stopPropagation()}
          />
        </div>
      </div>
    </CardHeader>
    <CardContent className="px-6 pb-6">
      {error && (
        <div className="mb-3 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}
      <div className="relative bg-gray-50 rounded-lg p-4 min-h-[240px]">
        {loading && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-white/70 rounded-lg">
            <RefreshCw className="w-8 h-8 animate-spin text-[#C72030] mb-2" />
            <span className="text-sm text-gray-500 font-medium">Refreshing...</span>
          </div>
        )}
        {children}
      </div>
    </CardContent>
  </Card>
);

export const EmptyState: React.FC = () => (
  <div className="h-full min-h-[240px] flex items-center justify-center text-sm text-gray-400">
    No data available
  </div>
);
