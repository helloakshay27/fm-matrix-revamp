import React, { useEffect, useMemo, useState } from "react";
import { Check, X, Settings } from "lucide-react";
import { StatsCard } from "@/components/StatsCard";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "@/components/ui/pagination";
import axios from "axios";
import { API_CONFIG, getAuthHeader } from "@/config/apiConfig";
import { useParams } from "react-router-dom";
import { StatusBadge } from "@/components/StatusBadge"; // Fixed: named import

interface AMCAnalyticsTab {
  amc: AMCData;
  amcId?: string | number;
}

interface AMCData {
  id: number;
  amc_vendor_name?: string;
  amc_cost?: number;
  amc_start_date?: string;
  amc_end_date?: string;
  created_at?: string;
  updated_at?: string;
  created_by?: string;
  last_updated_by?: string;
  // ...other fields...
}

interface AMCAnalyticsResponse {
  basic_info?: boolean;
  supplier?: boolean;
  visit_schedule?: boolean;
  red_fag?: boolean;
  tickets?: boolean;
  attachmemnts?: boolean;
  sla_achieved?: string | number | null;
  critical_assets_covered_number?: number | null;
  critical_assets_covered_value?: number | null;
  visits_completed?: number | null;
  pending_visits?: number | null;
  open_tickets?: number | null;
  past_ppm?: PastPPMEntry[];
}

interface PastPPMEntry {
  id: number;
  contract_name?: string | null;
  amc_cost?: number | null;
  amc_start_date?: string | null;
  amc_end_date?: string | null;
  status?: string | null;
  amc_type?: string | null;
  checklist_type?: string | null;
  supplier_company_name?: string | null;
  amc_assets?: any[];
  total_associated_assets?: number | null;
}

export const AMCAnalyticsTab: React.FC<AMCAnalyticsTab> = ({
  amc,
  amcId,
}) => {
  const { id } = useParams();
  const targetId = amcId ?? id;
  const [analytics, setAnalytics] = useState<AMCAnalyticsResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [pastAmcPage, setPastAmcPage] = useState(1);

  useEffect(() => {
    const fetchAnalytics = async () => {
      if (!targetId) return;
      setLoading(true);
      try {
        const response = await axios.get(
          `${API_CONFIG.BASE_URL}/pms/asset_amcs/${targetId}/analytics.json`,
          {
            headers: {
              Authorization: getAuthHeader(),
            },
          }
        );
        setAnalytics(response.data || null);
      } catch (error) {
        console.error("[AMCAnalyticsTab] analytics fetch failed", error);
        setAnalytics(null);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [targetId]);

  const configRows = useMemo(
    () => [
      { label: "Basic Info", key: "basic_info" as const },
      { label: "Supplier", key: "supplier" as const },
      { label: "Visit Schedule", key: "visit_schedule" as const },
      { label: "Red Flag", key: "red_fag" as const },
      { label: "Tickets", key: "tickets" as const },
      { label: "Attachments", key: "attachmemnts" as const },
    ],
    []
  );

  const formatValue = (value?: string | number | null) => {
    if (value === null || value === undefined || value === "") return "-";
    return typeof value === "number" ? value.toLocaleString() : value;
  };

  const formatDate = (dateStr?: string | null) => {
    if (!dateStr) return "-";
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return "-";
    return date.toLocaleDateString("en-GB");
  };

  const pastPPM = analytics?.past_ppm ?? [];
  const PAST_AMC_PER_PAGE = 15;
  const pastAmcTotalPages = Math.max(1, Math.ceil(pastPPM.length / PAST_AMC_PER_PAGE));
  const pastPPMPage = pastPPM.slice((pastAmcPage - 1) * PAST_AMC_PER_PAGE, pastAmcPage * PAST_AMC_PER_PAGE);

  return (
    <div style={{ backgroundColor: 'rgba(250, 250, 250, 1)' }}>
      {/* AMC Detail Table Section */}
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-[14px] font-medium text-[#1A1A1A]">
            AMC Detail Table
          </h2>
        </div>

        <div className="rounded-lg border border-gray-200 shadow-sm p-4 mx-4 mb-4" style={{ backgroundColor: 'rgba(250, 250, 250, 1)' }}>
          <div className="overflow-x-auto">
            <table className="min-w-full">
            <thead>
              <tr style={{ backgroundColor: 'rgba(237, 234, 227, 1)' }}>
                {configRows.map(({ label }) => (
                  <th
                    key={label}
                    className="px-4 py-3 text-left text-sm font-medium text-gray-700 border-b border-gray-200"
                  >
                    {label === "Red Flag" ? (
                      <div className="flex items-center gap-1">
                        <span className="text-red-600 text-xs">🚩</span>
                        <span>Red Flag</span>
                      </div>
                    ) : (
                      label
                    )}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr className="bg-white">
                {configRows.map(({ key }) => {
                  const value = analytics ? (analytics as Record<string, any>)[key] : undefined;
                  const isEnabled = Boolean(value);
                  return (
                    <td
                      key={key}
                      className="px-4 py-3 text-center border-b border-gray-200"
                    >
                      {analytics ? (
                        isEnabled ? (
                          <Check className="w-5 h-5 text-green-600 mx-auto" />
                        ) : (
                          <X className="w-5 h-5 text-red-500 mx-auto" />
                        )
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                  );
                })}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      </div>

      {/* Analytics Cards Section */}
      <div className="space-y-4 p-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 px-4 pb-4">
          <StatsCard
            title="SLA Achieved"
            value={formatValue(analytics?.sla_achieved)}
            icon={<Settings className="w-6 h-6 sm:w-8 sm:h-8" style={{ color: "#C72030" }} />}
          />
          <StatsCard
            title="No. of Critical Assets Covered"
            value={formatValue(analytics?.critical_assets_covered_number)}
            icon={<Settings className="w-6 h-6 sm:w-8 sm:h-8" style={{ color: "#C72030" }} />}
          />
          <StatsCard
            title="Critical Assets Covered (Value)"
            value={formatValue(analytics?.critical_assets_covered_value)}
            icon={<Settings className="w-6 h-6 sm:w-8 sm:h-8" style={{ color: "#C72030" }} />}
          />
          <StatsCard
            title="Visits Completed"
            value={formatValue(analytics?.visits_completed)}
            icon={<Settings className="w-6 h-6 sm:w-8 sm:h-8" style={{ color: "#C72030" }} />}
          />
          <StatsCard
            title="Pending Visits"
            value={formatValue(analytics?.pending_visits)}
            icon={<Settings className="w-6 h-6 sm:w-8 sm:h-8" style={{ color: "#C72030" }} />}
          />
          <StatsCard
            title="Open Tickets"
            value={formatValue(analytics?.open_tickets)}
            icon={<Settings className="w-6 h-6 sm:w-8 sm:h-8" style={{ color: "#C72030" }} />}
          />
        </div>
      </div>

      {/* Past AMC Section */}
      <div className="space-y-4 p-4">
        <h2 
          className="text-[#1A1A1A] capitalize"
          style={{
            fontFamily: 'Work Sans',
            fontWeight: 600,
            fontStyle: 'normal',
            fontSize: '20px',
            lineHeight: '100%',
            letterSpacing: '0%',
            verticalAlign: 'middle',
            textTransform: 'capitalize'
          }}
        >
          Past AMC
        </h2>
        
        <div className="rounded-lg border border-gray-200 shadow-sm mx-4 mb-4" style={{ backgroundColor: 'rgba(250, 250, 250, 1)' }}>
          <div className="overflow-x-auto" style={{ maxHeight: '600px', overflowY: 'auto' }}>
            <table className="min-w-full">
              <thead>
                <tr className="bg-gray-50" style={{ backgroundColor: '#F6F4EE' }}>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 border-b">Contract Name</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 border-b">Start & End Date</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 border-b">AMC Type</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 border-b">Total Associated Assets</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 border-b">AMC Value</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 border-b">Status</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-6 text-center text-gray-500">
                      Loading past AMC data...
                    </td>
                  </tr>
                ) : pastPPM.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-6 text-center text-gray-500">
                      No past AMC records available.
                    </td>
                  </tr>
                ) : (
                  pastPPMPage.map((entry) => {
                    const statusVal = (entry.status || '').toLowerCase();
                    const isActive = statusVal === 'active';
                    const isExpired = statusVal === 'expired';
                    const statusBg = isActive
                      ? 'bg-green-100 text-green-800'
                      : isExpired
                      ? 'bg-red-100 text-red-700'
                      : 'bg-gray-100 text-gray-700';
                    const statusLabel = isActive ? 'Active' : isExpired ? 'Expired' : (entry.status || '—');
                    const totalAssets = Array.isArray(entry.amc_assets)
                      ? entry.amc_assets.length
                      : (entry.total_associated_assets ?? '—');
                    return (
                      <tr
                        key={entry.id}
                        className="border-b"
                        style={{ backgroundColor: "rgba(250, 250, 250, 1)" }}
                      >
                        <td className="px-4 py-3 text-sm text-gray-600">{entry.contract_name || '—'}</td>
                        <td className="px-4 py-3 text-sm text-gray-600 whitespace-nowrap">
                          {formatDate(entry.amc_start_date)} – {formatDate(entry.amc_end_date)}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">
                          {entry.checklist_type || entry.amc_type || '—'}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600 text-center">{totalAssets}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">
                          {entry.amc_cost !== undefined && entry.amc_cost !== null
                            ? `₹ ${entry.amc_cost.toLocaleString()}`
                            : '—'}
                        </td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 rounded text-xs font-medium ${statusBg}`}>{statusLabel}</span>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Past AMC Pagination */}
        {pastAmcTotalPages > 1 && (
          <div className="flex justify-center mt-4 mb-4">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => setPastAmcPage((p) => Math.max(1, p - 1))}
                    className={pastAmcPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                  />
                </PaginationItem>
                {(() => {
                  const items: React.ReactNode[] = [];
                  const delta = 1;
                  let last = 0;
                  for (let i = 1; i <= pastAmcTotalPages; i++) {
                    if (i === 1 || i === pastAmcTotalPages || (i >= pastAmcPage - delta && i <= pastAmcPage + delta)) {
                      if (last && i - last > 1) {
                        items.push(
                          <PaginationItem key={`e-${i}`}>
                            <PaginationEllipsis />
                          </PaginationItem>
                        );
                      }
                      items.push(
                        <PaginationItem key={i}>
                          <PaginationLink
                            isActive={pastAmcPage === i}
                            onClick={() => setPastAmcPage(i)}
                            className="cursor-pointer"
                          >
                            {i}
                          </PaginationLink>
                        </PaginationItem>
                      );
                      last = i;
                    }
                  }
                  return items;
                })()}
                <PaginationItem>
                  <PaginationNext
                    onClick={() => setPastAmcPage((p) => Math.min(pastAmcTotalPages, p + 1))}
                    className={pastAmcPage === pastAmcTotalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </div>
    </div>
  );
};
