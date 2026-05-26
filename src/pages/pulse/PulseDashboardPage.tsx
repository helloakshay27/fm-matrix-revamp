import { useState, useEffect } from "react";
import { useAppSelector } from "@/store/hooks";
import type { PulseFilters } from "@/services/pulseDashboardApi";
import { PulseCustomers } from "./sections/PulseCustomers";
import { PulseUsers } from "./sections/PulseUsers";
import { PulseAmenities } from "./sections/PulseAmenities";
import { PulseEvents } from "./sections/PulseEvents";
import { PulseNotices } from "./sections/PulseNotices";
import { PulseCommunity } from "./sections/PulseCommunity";
import "@/styles/pulse-dashboard.css";
import { DashboardHeader } from "@/components/DashboardHeader";
import { UnifiedDateRangeFilter } from "@/components/dashboard/UnifiedDateRangeFilter";

type DateRange = {
  from?: Date;
  to?: Date;
};

type Section = "customers" | "users" | "amenities" | "events" | "notices" | "community";

const SECTIONS: { key: Section; label: string }[] = [
  { key: "customers", label: "Customers" },
  { key: "users", label: "Users" },
  { key: "amenities", label: "Amenities" },
  { key: "events", label: "Events" },
  { key: "notices", label: "Notices" },
  { key: "community", label: "Community" },
];

function getDefaultDates() {
  const now = new Date();
  const fromDate = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate()).toISOString().split("T")[0];
  const toDate = now.toISOString().split("T")[0];
  return { fromDate, toDate };
}

export function PulseDashboardPage() {
  const { selectedSite, sites } = useAppSelector((state) => state.site);
  const [activeSection, setActiveSection] = useState<Section>("customers");
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

  // Sync siteIds from localStorage whenever the selected site changes
  useEffect(() => {
    const storedSiteId = localStorage.getItem("selectedSiteId");
    const siteIds = storedSiteId ? [Number(storedSiteId)] : [];
    setFilters((f) => ({ ...f, siteIds }));
  }, [selectedSite]);

  const allSiteIds = (() => {
    const stored = localStorage.getItem("allSiteIds");
    if (stored) return stored.split(",").filter(Boolean).map(Number);
    return sites.map((s) => s.id);
  })();

  return (
    <>
      <div className="bg-white border-b border-analytics-border">
        <DashboardHeader />
      </div>

      <div className="bg-white ">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="bg-white border-b border-analytics-border">
              <div className="px-6 py-4">
                <h1 className="text-lg font-bold text-gray-900">
                  Pulse Analytics
                </h1>
              </div>
            </div>
            <div className="flex items-center justify-end">

              <div className="flex items-center gap-4">
                <UnifiedDateRangeFilter
                  dateRange={dateRange}
                  onDateRangeChange={handleDateRangeChange}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="pulse-db p-6">
        {/* <div className="flex items-center justify-between mb-5">
          <h1 className="text-2xl font-bold text-gray-900">Pulse Analytics</h1>
        </div>

        <div className="pd-filter-bar">
          <div className="pd-filter-field">
            <span className="pd-filter-label">From</span>
            <input
              type="date"
              className="pd-filter-input"
              value={filters.fromDate}
              onChange={(e) => setFilters((f) => ({ ...f, fromDate: e.target.value }))}
            />
          </div>
          <div className="pd-filter-field">
            <span className="pd-filter-label">To</span>
            <input
              type="date"
              className="pd-filter-input"
              value={filters.toDate}
              onChange={(e) => setFilters((f) => ({ ...f, toDate: e.target.value }))}
            />
          </div>
        </div> */}

        {/* Section tabs */}
        <div className="flex gap-1 mb-6 border-b border-gray-200 overflow-x-auto pb-px">
          {SECTIONS.map((s) => (
            <button
              key={s.key}
              type="button"
              onClick={() => setActiveSection(s.key)}
              className={`px-4 py-2 text-sm font-medium whitespace-nowrap transition-colors border-b-2 -mb-px ${activeSection === s.key
                ? "border-[#DA7756] text-[#DA7756]"
                : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
            >
              {s.label}
            </button>
          ))}
        </div>

        {activeSection === "customers" && <PulseCustomers filters={filters} />}
        {activeSection === "users" && <PulseUsers filters={filters} />}
        {activeSection === "amenities" && <PulseAmenities filters={filters} />}
        {activeSection === "events" && <PulseEvents filters={filters} />}
        {activeSection === "notices" && <PulseNotices filters={filters} />}
        {activeSection === "community" && <PulseCommunity filters={{ ...filters, siteIds: allSiteIds }} />}
      </div>
    </>
  );
}
