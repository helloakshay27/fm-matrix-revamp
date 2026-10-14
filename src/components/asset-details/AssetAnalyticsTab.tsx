import React, { useEffect, useState } from "react";
import { Clock, Check, Download, X } from "lucide-react";
import axios from "axios";
import { API_CONFIG, getAuthHeader } from "@/config/apiConfig";
import { useParams } from "react-router-dom";

interface AssetAnalyticsTab {
  asset: Asset;
  assetId?: string | number;
}
interface Asset {
  id: number;
  name: string;
  created_by?: string;
  last_updated_by?: string;
  updated_at?: string;
  // ...other fields...
  breakdown?: boolean;
}

interface ConfigStatus {
  asset_basic: boolean;
  amc: boolean;
  ppm: boolean;
  group: boolean;
  depreciation: boolean;
  tagged: boolean;
  mtr: boolean;
  audit: boolean;
  tickets: boolean;
  ebom: boolean;
  readings: boolean;
  asset_breakdown?: boolean;
  asset_down_time?: string | number;
}

interface DashboardSummary {
  ppm_comp_rate: string;
  next_amc_due: string | null;
  last_ppm: string | null;
  next_ppm_due: string | null;
  upcoming_amc_date: string | null;
  tickets: string | number;
  asset_down_time?: string | number;
}

// Neutral 18px line icon shared by the summary cards below (inkSoft, per the
// design system - decorative status-style colour is reserved for real status
// indicators elsewhere, not these informational tiles).
const SummaryCogIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M12 15.5A3.5 3.5 0 1 0 12 8.5a3.5 3.5 0 0 0 0 7Z"
      stroke="#6B7280"
      strokeWidth="1.5"
    />
    <path
      d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33h.01a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51h.01a1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82v.01a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1Z"
      stroke="#6B7280"
      strokeWidth="1.5"
    />
  </svg>
);

const SummaryInfoIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="10" stroke="#6B7280" strokeWidth="1.5" />
    <rect x="11" y="10" width="2" height="7" rx="1" fill="#6B7280" />
    <rect x="11" y="7" width="2" height="2" rx="1" fill="#6B7280" />
  </svg>
);

// Same card anatomy as the Asset dashboard stat cards (components/AssetStats.tsx):
// value on top (24px/600), label below (14px/500), 56px icon tile, p-6 — so both
// screens render identical cards. `meta` is an optional single truncated line.
const SummaryCard: React.FC<{
  icon: React.ReactNode;
  value: React.ReactNode;
  label: string;
  meta?: string;
}> = ({ icon, value, label, meta }) => (
  <div className="h-full bg-[#F6F4EE] p-6 rounded-lg shadow-[0px_1px_8px_rgba(45,45,45,0.05)] flex items-center gap-4">
    <div className="w-14 h-14 bg-[#C4B89D54] flex items-center justify-center rounded shrink-0">
      {icon}
    </div>
    <div className="min-w-0">
      <div className="text-2xl font-semibold text-[#1A1A1A] truncate">{value}</div>
      <div className="text-sm font-medium text-[#1A1A1A]">{label}</div>
      {meta && (
        <div className="text-xs text-[#9CA3AF] mt-1 truncate" title={meta}>
          {meta}
        </div>
      )}
    </div>
  </div>
);

export const AssetAnalyticsTab: React.FC<AssetAnalyticsTab> = ({
  asset,
  assetId,
}) => {
  const { id } = useParams();
  const [configStatus, setConfigStatus] = useState<ConfigStatus | null>(null);
  const [dashboardSummary, setDashboardSummary] =
    useState<DashboardSummary | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [breakdownStartTime, setBreakdownStartTime] = useState<Date | null>(null);

  // Countdown timer effect
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Reset breakdown start time when breakdown status changes
  useEffect(() => {
    if (!asset?.breakdown) {
      setBreakdownStartTime(null);
    }
  }, [asset?.breakdown]);

  // Function to format asset down time to DD:HH:MM format
  const formatDownTime = (downTime: string | number | undefined): string => {
    if (!downTime) return "00:00:00";

    if (typeof downTime === 'string') {
      // Try to parse as a date-time string first
      const breakdownDate = new Date(downTime);

      // Check if it's a valid date
      if (!isNaN(breakdownDate.getTime())) {
        // Calculate elapsed time from breakdown date to now
        const currentTimeMs = Date.now();
        const elapsedMs = currentTimeMs - breakdownDate.getTime();
        const elapsedSeconds = Math.floor(elapsedMs / 1000);

        // Ensure we don't show negative time
        const totalSeconds = Math.max(0, elapsedSeconds);

        // Convert to days, hours, minutes
        const days = Math.floor(totalSeconds / (24 * 3600));
        const hours = Math.floor((totalSeconds % (24 * 3600)) / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);

        return `${days.toString().padStart(2, '0')}:${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
      }

      // If it's in DD:HH:MM format, return as is
      if (downTime.includes(':')) {
        return downTime;
      }
    }

    // Convert to number if it's a string
    let totalMinutes = typeof downTime === 'string' ? parseInt(downTime) : downTime;

    // If the value is in seconds, convert to minutes
    if (totalMinutes > 10000) {
      totalMinutes = Math.floor(totalMinutes / 60);
    }

    const days = Math.floor(totalMinutes / (24 * 60));
    const hours = Math.floor((totalMinutes % (24 * 60)) / 60);
    const minutes = totalMinutes % 60;

    return `${days.toString().padStart(2, '0')}:${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  };

  // Function to format countdown timer (live updating)
  const formatCountdownTime = (downTime: string | number | undefined): string => {
    if (!downTime) return "00:00:00";

    if (typeof downTime === 'string') {
      // Try to parse as a date-time string first
      const breakdownDate = new Date(downTime);

      // Check if it's a valid date
      if (!isNaN(breakdownDate.getTime())) {
        // Set breakdown start time if not already set
        if (!breakdownStartTime) {
          setBreakdownStartTime(breakdownDate);
        }

        // Calculate elapsed time since breakdown started
        const currentTimeMs = currentTime.getTime();
        const startTimeMs = breakdownStartTime ? breakdownStartTime.getTime() : breakdownDate.getTime();
        const elapsedMs = currentTimeMs - startTimeMs;
        const elapsedSeconds = Math.floor(elapsedMs / 1000);

        // Ensure we don't show negative time
        const totalSeconds = Math.max(0, elapsedSeconds);

        // Convert to DD:HH:MM format
        const days = Math.floor(totalSeconds / (24 * 3600));
        const hours = Math.floor((totalSeconds % (24 * 3600)) / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);

        return `${days.toString().padStart(2, '0')}:${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
      }

      // If it's in DD:HH:MM format, parse and create live countdown
      if (downTime.includes(':')) {
        const timeParts = downTime.split(':');
        if (timeParts.length === 3) {
          const initialDays = parseInt(timeParts[0]) || 0;
          const initialHours = parseInt(timeParts[1]) || 0;
          const initialMinutes = parseInt(timeParts[2]) || 0;

          // Convert to total minutes
          const totalInitialMinutes = (initialDays * 24 * 60) + (initialHours * 60) + initialMinutes;

          // If we don't have a breakdown start time, set it to now minus the initial time
          if (!breakdownStartTime) {
            const startTime = new Date(Date.now() - (totalInitialMinutes * 60 * 1000));
            setBreakdownStartTime(startTime);
          }

          // Calculate elapsed time since breakdown started
          const currentTimeMs = currentTime.getTime();
          const startTimeMs = breakdownStartTime ? breakdownStartTime.getTime() : Date.now() - (totalInitialMinutes * 60 * 1000);
          const elapsedMs = currentTimeMs - startTimeMs;
          const elapsedMinutes = Math.floor(elapsedMs / (60 * 1000));

          // Ensure we don't show negative time
          const totalMinutes = Math.max(0, elapsedMinutes);

          // Convert back to DD:HH:MM
          const days = Math.floor(totalMinutes / (24 * 60));
          const hours = Math.floor((totalMinutes % (24 * 60)) / 60);
          const minutes = totalMinutes % 60;

          return `${days.toString().padStart(2, '0')}:${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
        }
      }
    }

    // Fallback to original logic for number format
    return formatDownTime(downTime);
  };

  // Function to render downtime display based on breakdown status
  const renderDownTimeDisplay = () => {
    if (asset?.breakdown) {
      // Show countdown timer when breakdown is true
      return formatCountdownTime(configStatus?.asset_down_time);
    } else {
      // Show static formatted time when breakdown is false
      return formatDownTime(configStatus?.asset_down_time);
    }
  };

  useEffect(() => {
    const fetchConfigStatus = async () => {
      try {
        const response = await axios.get(
          `${API_CONFIG.BASE_URL}/pms/assets/config_status.json?id=${id}`,
          {
            headers: {
              Authorization: getAuthHeader(),
            },
          }
        );
        setConfigStatus(response.data);

      } catch (error) {
        setConfigStatus(null);
      }
    };

    const fetchDashboardSummary = async () => {
      try {
        const response = await axios.get(
          `${API_CONFIG.BASE_URL}/pms/assets/dashboard_summary.json?id=${id}`,
          {
            headers: {
              Authorization: getAuthHeader(),
            },
          }
        );
        setDashboardSummary(response.data);
      } catch (error) {
        setDashboardSummary(null);
      }
    };

    fetchConfigStatus();
    fetchDashboardSummary();
  }, [id]);

  const configHeaders = [
    "Asset Info",
    // "Analytics",
    "AMC Details",
    "PPM",
    "EBom",
    // "Attachments",
    "Readings",
    // "History Card",
    "Depreciation",
    "Tickets",
  ];

  const configKeys: (keyof ConfigStatus)[] = [
    "asset_basic",
    "amc",
    "ppm",
    "ebom",
    "readings",

    "depreciation",


    "tickets",
  ];
  console.log(dashboardSummary);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-[14px] font-medium text-[#1A1A1A]">
          Asset Config Table
        </h2>

        <div className="flex items-center gap-4">
          <span className="text-[#1A1A1A] text-[14px] font-medium">
            Asset Down Time
          </span>
          <div
            className={`flex items-center gap-2 px-3 py-2 rounded-lg border ${asset?.breakdown
              ? 'border-red-400 bg-red-50'
              : 'border-red-200'
              }`}
            style={{ backgroundColor: asset?.breakdown ? "#fef2f2" : "#f6f4ee" }}
          >
            <Clock className={`w-5 h-5 ${asset?.breakdown ? 'text-red-700' : 'text-red-600'
              }`} />
            <span className={`font-medium text-sm ${asset?.breakdown ? 'text-red-700' : 'text-red-600'
              }`}>
              {renderDownTimeDisplay()}
            </span>
            {asset?.breakdown && (
              <span className="text-xs text-red-500 ml-2 animate-pulse">
                (Live)
              </span>
            )}
          </div>
        </div>
      </div>

      <div
        className="rounded-xl p-3 sm:p-6 border shadow-lg"
        style={{ backgroundColor: "#F6F4EE" }}
      >
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-300 rounded-lg">
            <thead>
              <tr>
                {configHeaders.map((header, idx) => (
                  <th
                    key={idx}
                    className="p-4 text-center text-black font-semibold text-lg border border-gray-300"
                    style={{ backgroundColor: "#EDEAE3" }}
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                {configKeys.map((key, idx) => (
                  <td
                    key={idx}
                    className="p-4 text-center border border-gray-300 bg-white"
                  >
                    {configStatus ? (
                      configStatus[key] ? (
                        <Check className="w-6 h-6 text-green-600 mx-auto" />
                      ) : (
                        <X className="w-6 h-6 text-red-500 mx-auto" />
                      )
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* <div className="rounded-xl p-3 sm:p-6 border shadow-lg bg-white">
        
        <div className="overflow-x-auto">
          <table className="min-w-full border rounded-lg">
            <thead>
              <tr>
                {configHeaders.map((header, idx) => (
                  <th
                    key={idx}
                    className="p-3 text-center text-gray-600 font-medium border-b bg-[hsl(var(--analytics-background))]"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                {configKeys.map((key, idx) => (
                  <td
                    key={idx}
                    className="p-3 text-center border-b border-red-100"
                  >
                    {configStatus ? (
                      configStatus[key] ? (
                        <Check className="w-5 h-5 text-green-600 mx-auto" />
                      ) : (
                        <X className="w-5 h-5 text-red-600 mx-auto" />
                      )
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div> */}

      {/* Cards Grid - four columns regardless of count, per the design system */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 auto-rows-fr gap-4 mb-6">
        <SummaryCard
          icon={<SummaryCogIcon />}
          value={dashboardSummary?.tickets !== undefined ? dashboardSummary.tickets : "-"}
          label="Open Tickets"
        />
        <SummaryCard
          icon={<SummaryCogIcon />}
          value={dashboardSummary?.upcoming_amc_date || "-"}
          label="Upcoming AMC"
        />
        <SummaryCard
          icon={<SummaryCogIcon />}
          value={dashboardSummary?.ppm_comp_rate || "-"}
          label="PPM Completion %"
        />
        <SummaryCard
          icon={<SummaryCogIcon />}
          value={dashboardSummary?.last_ppm || "-"}
          label="Last PPM Conducted On"
        />
        <SummaryCard
          icon={<SummaryCogIcon />}
          value={dashboardSummary?.next_ppm_due || "-"}
          label="Next PPM Due"
        />
        <SummaryCard
          icon={<SummaryInfoIcon />}
          value={asset?.last_updated_by || "-"}
          label="Recent Updates"
          meta={
            asset?.created_by && asset?.updated_at
              ? `Created by ${asset.created_by} • Last updated on ${asset.updated_at}`
              : undefined
          }
        />
      </div>
    </div>
  );
};
