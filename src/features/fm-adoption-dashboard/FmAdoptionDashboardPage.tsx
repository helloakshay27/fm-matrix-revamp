import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { format as formatDate, subDays } from "date-fns";
import { Eye, MousePointerClick, Timer, TrendingUp, Users } from "lucide-react";
import {
  fetchOverview,
  fetchTimeseries,
  fetchEngagement,
  fetchModules,
  fetchEvents,
  fetchSites,
  fetchRoles,
  type FmAdoptionFilters,
} from "@/services/fmAdoptionApi";
import Spinner from "@/components/common/Spinner";
import ErrorState from "@/components/common/ErrorState";
import { FilterBar } from "./components/FilterBar";
import { SectionCard } from "./components/SectionCard";
import { KpiTile } from "./components/KpiTile";
import { DeviceSplit } from "./components/DeviceSplit";
import { TimeseriesCharts } from "./components/TimeseriesCharts";
import { EngagementMeters } from "./components/EngagementMeters";
import { BarList } from "./components/BarList";
import { EventsTable } from "./components/EventsTable";
import { SitesTable } from "./components/SitesTable";
import { formatCompactNumber, formatDuration, formatPercent } from "./utils/format";

function defaultRange(days: number) {
  const to = new Date();
  const from = subDays(to, days - 1);
  return { from, to };
}

const SITE_DIRECTORY_FILTERS: FmAdoptionFilters = {
  siteIds: [],
  fromDate: formatDate(subDays(new Date(), 364), "yyyy-MM-dd"),
  toDate: formatDate(new Date(), "yyyy-MM-dd"),
};

export function FmAdoptionDashboardPage() {
  const [dateRange, setDateRange] = useState(() => defaultRange(30));
  const [activePresetDays, setActivePresetDays] = useState<number | null>(30);
  const [siteId, setSiteId] = useState("all");

  const filters: FmAdoptionFilters = useMemo(
    () => ({
      siteIds: siteId === "all" ? [] : [siteId],
      fromDate: formatDate(dateRange.from, "yyyy-MM-dd"),
      toDate: formatDate(dateRange.to, "yyyy-MM-dd"),
    }),
    [siteId, dateRange]
  );

  const { data: siteDirectory } = useQuery({
    queryKey: ["fm-adoption", "site-directory"],
    queryFn: () => fetchSites(SITE_DIRECTORY_FILTERS),
    staleTime: 10 * 60 * 1000,
  });

  const siteOptions = (siteDirectory?.sites ?? [])
    .slice()
    .sort((a, b) => a.site_name.localeCompare(b.site_name))
    .map((s) => ({ value: s.site_id, label: `${s.site_name} — ${s.company_name}` }));

  const overviewQ = useQuery({ queryKey: ["fm-adoption", "overview", filters], queryFn: () => fetchOverview(filters) });
  const timeseriesQ = useQuery({ queryKey: ["fm-adoption", "timeseries", filters], queryFn: () => fetchTimeseries(filters) });
  const engagementQ = useQuery({ queryKey: ["fm-adoption", "engagement", filters], queryFn: () => fetchEngagement(filters) });
  const modulesQ = useQuery({ queryKey: ["fm-adoption", "modules", filters], queryFn: () => fetchModules(filters) });
  const eventsQ = useQuery({ queryKey: ["fm-adoption", "events", filters], queryFn: () => fetchEvents(filters) });
  const sitesQ = useQuery({ queryKey: ["fm-adoption", "sites", filters], queryFn: () => fetchSites(filters) });
  const rolesQ = useQuery({ queryKey: ["fm-adoption", "roles", filters], queryFn: () => fetchRoles(filters) });

  const isInitialLoading = [overviewQ, timeseriesQ, engagementQ, modulesQ, eventsQ, sitesQ, rolesQ].some((q) => q.isLoading);
  const isAnyFetching = [overviewQ, timeseriesQ, engagementQ, modulesQ, eventsQ, sitesQ, rolesQ].some((q) => q.isFetching);
  const isAnyError = [overviewQ, timeseriesQ, engagementQ, modulesQ, eventsQ, sitesQ, rolesQ].some((q) => q.isError);

  const handlePresetSelect = (days: number) => {
    setActivePresetDays(days);
    setDateRange(defaultRange(days));
  };

  const handleDateRangeChange = (range: { from?: Date; to?: Date } | undefined) => {
    if (range?.from && range?.to) {
      setActivePresetDays(null);
      setDateRange({ from: range.from, to: range.to });
    }
  };

  const handleReset = () => {
    setSiteId("all");
    handlePresetSelect(30);
  };

  const hasActiveFilters = siteId !== "all" || activePresetDays !== 30;

  const retryAll = () => {
    overviewQ.refetch();
    timeseriesQ.refetch();
    engagementQ.refetch();
    modulesQ.refetch();
    eventsQ.refetch();
    sitesQ.refetch();
    rolesQ.refetch();
  };

  return (
    <div className="min-h-screen bg-brand-bg p-6">
      <div className="mx-auto flex max-w-7xl flex-col gap-5">
        <div>
          <h1 className="text-brand-h1 font-semibold text-brand-text">FM Adoption Analytics</h1>
          <p className="mt-1 text-brand-body-4 text-brand-text-light">
            Traffic, engagement and module adoption for fm-matrix.lockated.com
          </p>
        </div>

        <FilterBar
          dateRange={dateRange}
          onPresetSelect={handlePresetSelect}
          onDateRangeChange={handleDateRangeChange}
          activePresetDays={activePresetDays}
          siteId={siteId}
          onSiteChange={setSiteId}
          siteOptions={siteOptions}
          hasActiveFilters={hasActiveFilters}
          onReset={handleReset}
        />

        {isInitialLoading && (
          <div className="flex justify-center py-24">
            <Spinner className="h-8 w-8" />
          </div>
        )}

        {!isInitialLoading && isAnyError && <ErrorState message="Couldn't load adoption analytics." onRetry={retryAll} />}

        {!isInitialLoading && !isAnyError && (
          <div className={`flex flex-col gap-5 transition-opacity duration-150 ${isAnyFetching ? "opacity-60" : ""}`}>
            <SectionCard title="Overview" subtitle="Traffic and session summary for the selected range">
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                <KpiTile
                  label="Active users"
                  value={formatCompactNumber(overviewQ.data?.tiles.active_users ?? 0)}
                  icon={<Users className="h-4 w-4 text-brand-text-light" />}
                  live={!!overviewQ.data?.tiles.recently_online}
                />
                <KpiTile
                  label="Screen views"
                  value={formatCompactNumber(overviewQ.data?.tiles.screen_views ?? 0)}
                  icon={<Eye className="h-4 w-4 text-brand-text-light" />}
                />
                <KpiTile
                  label="Sessions"
                  value={formatCompactNumber(overviewQ.data?.tiles.sessions ?? 0)}
                  icon={<MousePointerClick className="h-4 w-4 text-brand-text-light" />}
                />
                <KpiTile
                  label="Views / session"
                  value={(overviewQ.data?.tiles.views_per_session ?? 0).toFixed(2)}
                  icon={<TrendingUp className="h-4 w-4 text-brand-text-light" />}
                />
                <KpiTile
                  label="Avg. session length"
                  value={formatDuration(overviewQ.data?.tiles.avg_session_seconds ?? 0)}
                  icon={<Timer className="h-4 w-4 text-brand-text-light" />}
                />
                <KpiTile label="Bounce rate" value={formatPercent(overviewQ.data?.tiles.bounce_rate ?? 0)} />
                <KpiTile
                  label="Recently online"
                  value={String(overviewQ.data?.tiles.recently_online ?? 0)}
                  sublabel="active in the last 5 minutes"
                />
              </div>

              <div className="mt-5 border-t border-brand-border pt-4">
                <div className="mb-2 text-brand-body-5 font-medium text-brand-text-light">Sessions by device</div>
                <DeviceSplit data={overviewQ.data?.device_split ?? []} />
              </div>
            </SectionCard>

            <SectionCard title="Usage over time" subtitle="Daily active users, screen views and sessions">
              <TimeseriesCharts series={timeseriesQ.data?.series ?? []} fromDate={filters.fromDate} toDate={filters.toDate} />
            </SectionCard>

            <SectionCard title="Engagement" subtitle="Stickiness and breadth of module usage">
              {engagementQ.data && <EngagementMeters engagement={engagementQ.data} />}
            </SectionCard>

            <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
              <SectionCard title="Modules" subtitle="Events and users by module">
                <BarList
                  items={(modulesQ.data?.modules ?? []).map((m) => ({
                    label: m.module,
                    value: m.events,
                    meta: `${m.users} users`,
                  }))}
                  valueSuffix=" events"
                />
              </SectionCard>

              <SectionCard title="Roles" subtitle="Events and users by role">
                <BarList
                  items={(rolesQ.data?.roles ?? []).map((r) => ({
                    label: r.role,
                    value: r.events,
                    meta: `${r.users} users`,
                  }))}
                  valueSuffix=" events"
                />
              </SectionCard>
            </div>

            <SectionCard title="Top events" subtitle="Most frequent tracked events in this range">
              <EventsTable events={eventsQ.data?.events ?? []} loading={eventsQ.isLoading} />
            </SectionCard>

            <SectionCard title="Sites" subtitle="Site league — activity by location">
              <SitesTable sites={sitesQ.data?.sites ?? []} loading={sitesQ.isLoading} />
            </SectionCard>
          </div>
        )}
      </div>
    </div>
  );
}

export default FmAdoptionDashboardPage;
