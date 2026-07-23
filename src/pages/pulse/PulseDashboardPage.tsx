import { useState, useEffect } from "react";
import { useAppSelector } from "@/store/hooks";
import type { PulseFilters } from "@/services/pulseDashboardApi";
import { PulseCustomers } from "./sections/PulseCustomers";
import { PulseUsers } from "./sections/PulseUsers";
import { PulseAmenities } from "./sections/PulseAmenities";
import { PulseEvents } from "./sections/PulseEvents";
import { PulseNotices } from "./sections/PulseNotices";
import { PulseCommunity } from "./sections/PulseCommunity";
import { PulseCarpool } from "./sections/PulseCarpool";
import { PulseAiAlerts } from "./PulseAiAlerts";
import { PulseGreeting } from "./PulseGreeting";
import "@/styles/pulse-dashboard.css";
import "@/styles/pulse-shell.css";
import { DashboardHeader } from "@/components/DashboardHeader";
import { UnifiedDateRangeFilter } from "@/components/dashboard/UnifiedDateRangeFilter";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SlidersHorizontal, MapPin, X } from "lucide-react";

type DateRange = {
  from?: Date;
  to?: Date;
};

type Section = "customers" | "users" | "amenities" | "events" | "notices" | "community" | "carpool";

const SECTIONS: { key: Section; label: string }[] = [
  { key: "customers", label: "Customers" },
  { key: "users", label: "Users" },
  { key: "amenities", label: "Amenities" },
  { key: "events", label: "Events" },
  { key: "notices", label: "Notices" },
  { key: "community", label: "Community" },
  { key: "carpool", label: "Carpool" },
];

function getDefaultDates() {
  const now = new Date();
  const fromDate = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate()).toISOString().split("T")[0];
  const toDate = now.toISOString().split("T")[0];
  return { fromDate, toDate };
}

export function PulseDashboardPage() {
  const { sites } = useAppSelector((state) => state.site);
  const [activeSection, setActiveSection] = useState<Section>("customers");

  // Dropdown-driven site selection for this dashboard ("all" or a specific site id)
  const [siteSelection, setSiteSelection] = useState<string>(() => {
    const storedSiteId = localStorage.getItem("selectedSiteId");
    return storedSiteId || "all";
  });

  const allSiteIds = (() => {
    const stored = localStorage.getItem("allSiteIds");
    if (stored) return stored.split(",").filter(Boolean).map(Number);
    return sites.map((s) => s.id);
  })();

  const [filters, setFilters] = useState<PulseFilters>(() => {
    const storedSiteId = localStorage.getItem("selectedSiteId");
    return {
      siteIds: storedSiteId ? [Number(storedSiteId)] : [],
      ...getDefaultDates(),
    };
  });
  const [dateRange, setDateRange] = useState<DateRange | undefined>(() => {
    const { fromDate, toDate } = getDefaultDates();
    return {
      from: new Date(fromDate),
      to: new Date(toDate),
    };
  });

  const handleDateRangeChange = (range: DateRange | undefined) => {
    setDateRange(range);
    if (range?.from && range?.to) {
      setFilters((f) => ({
        ...f,
        fromDate: range.from!.toISOString().split("T")[0],
        toDate: range.to!.toISOString().split("T")[0],
      }));
    }
  };

  // Recompute siteIds whenever the dashboard's own site dropdown changes:
  // a specific site sends just that id, "all" sends every allowed site id.
  useEffect(() => {
    const siteIds = siteSelection === "all" ? allSiteIds : [Number(siteSelection)];
    setFilters((f) => ({ ...f, siteIds }));
  }, [siteSelection, sites]);

  const handleResetFilters = () => {
    setSiteSelection("all");
    const { fromDate, toDate } = getDefaultDates();
    setDateRange({ from: new Date(fromDate), to: new Date(toDate) });
    setFilters((f) => ({ ...f, fromDate, toDate }));
  };

  const todayLabel = new Date().toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  const defaultDates = getDefaultDates();
  const hasActiveFilters =
    siteSelection !== "all" ||
    filters.fromDate !== defaultDates.fromDate ||
    filters.toDate !== defaultDates.toDate;

  return (
    <>
      <div className="bg-white border-b border-analytics-border">
        <DashboardHeader />
      </div>

      <div className="pulse-shell">
        {/* Page nav strip */}
        {/* <div className="ps-nav">
          <div className="ps-logo">
            <div className="ps-logo-mark">
              <svg viewBox="0 0 24 24">
                <path d="M2 12h4l2-7 4 14 3-9 2 5h5" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div>
              <div className="ps-logo-text">Pulse Analytics</div>
              <div className="ps-logo-sub">Community &amp; Engagement Dashboard</div>
            </div>
          </div>
          <div className="ps-date-tag">{todayLabel}</div>
        </div> */}

        <PulseGreeting />

        {/* Filter bar */}
        <div className="ps-fbar">
          <div className="ps-flbl">
            <SlidersHorizontal size={11} />
            Filters
          </div>

          <Select value={siteSelection} onValueChange={setSiteSelection}>
            <SelectTrigger className="ps-fsel-trigger">
              <MapPin size={13} className="ps-fsel-icon" />
              <SelectValue placeholder="Select Site" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Sites</SelectItem>
              {sites.map((site) => (
                <SelectItem key={site.id} value={String(site.id)}>
                  {site.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="ps-date-wrap">
            <UnifiedDateRangeFilter
              dateRange={dateRange}
              onDateRangeChange={handleDateRangeChange}
            />
          </div>

          {hasActiveFilters && (
            <button type="button" className="ps-freset" onClick={handleResetFilters}>
              <X size={11} />
              Reset
            </button>
          )}
        </div>

        <PulseAiAlerts filters={filters} />

        {/* Section tabs */}
        <div className="ps-tabbar">
          {SECTIONS.map((s) => (
            <button
              key={s.key}
              type="button"
              onClick={() => setActiveSection(s.key)}
              className={`ps-tabbtn${activeSection === s.key ? " active" : ""}`}
            >
              {s.label}
            </button>
          ))}
        </div>

        <div className="pulse-db p-6">
          {activeSection === "customers" && <PulseCustomers filters={filters} />}
          {activeSection === "users" && <PulseUsers filters={filters} />}
          {activeSection === "amenities" && <PulseAmenities filters={filters} />}
          {activeSection === "events" && <PulseEvents filters={filters} />}
          {activeSection === "notices" && <PulseNotices filters={filters} />}
          {activeSection === "community" && <PulseCommunity filters={filters} />}
          {activeSection === "carpool" && <PulseCarpool filters={filters} />}
        </div>
      </div>
    </>
  );
}
