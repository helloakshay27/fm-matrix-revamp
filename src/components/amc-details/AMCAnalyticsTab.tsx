import React, { useEffect, useMemo, useState } from "react";
import { Check, X, Settings } from "lucide-react";
import { StatsCard } from "@/components/StatsCard";
import axios from "axios";
import { API_CONFIG, getAuthHeader } from "@/config/apiConfig";
import { useParams } from "react-router-dom";
import { StatusBadge } from "@/components/StatusBadge"; // Fixed: named import
import { EnhancedTable } from "@/components/enhanced-table/EnhancedTable";
import { ColumnConfig } from "@/hooks/useEnhancedTable";

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
  const amcDetailColumns: ColumnConfig[] = useMemo(
    () =>
      configRows.map(({ label, key }) => ({
        key,
        label: label === "Red Flag" ? "🚩 Red Flag" : label,
        sortable: false,
        hideable: false,
        defaultVisible: true,
      })),
    [configRows]
  );

  const amcDetailData = useMemo(
    () => [analytics ?? ({} as AMCAnalyticsResponse)],
    [analytics]
  );

  const pastAmcColumns: ColumnConfig[] = [
    { key: "contractName", label: "Contract Name", sortable: false, hideable: false, defaultVisible: true },
    { key: "startEndDate", label: "Start & End Date", sortable: false, hideable: false, defaultVisible: true },
    { key: "amcType", label: "AMC Type", sortable: false, hideable: false, defaultVisible: true },
    { key: "totalAssociatedAssets", label: "Total Associated Assets", sortable: false, hideable: false, defaultVisible: true },
    { key: "amcValue", label: "AMC Value", sortable: false, hideable: false, defaultVisible: true },
    { key: "statusLabel", label: "Status", sortable: false, hideable: false, defaultVisible: true },
  ];

  const pastAmcData = useMemo(
    () =>
      pastPPM.map((entry) => {
        const statusVal = (entry.status || "").toLowerCase();
        const isActive = statusVal === "active";
        const isExpired = statusVal === "expired";
        const totalAssets = Array.isArray(entry.amc_assets)
          ? entry.amc_assets.length
          : entry.total_associated_assets ?? "—";
        return {
          rowId: String(entry.id),
          contractName: entry.contract_name || "—",
          startEndDate: `${formatDate(entry.amc_start_date)} – ${formatDate(entry.amc_end_date)}`,
          amcType: entry.checklist_type || entry.amc_type || "—",
          totalAssociatedAssets: totalAssets,
          amcValue:
            entry.amc_cost !== undefined && entry.amc_cost !== null
              ? `₹ ${entry.amc_cost.toLocaleString()}`
              : "—",
          statusLabel: isActive ? "Active" : isExpired ? "Expired" : entry.status || "—",
        };
      }),
    [pastPPM]
  );

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
          <EnhancedTable
            data={amcDetailData}
            columns={amcDetailColumns}
            renderCell={(item: AMCAnalyticsResponse, columnKey: string) => {
              const value = item[columnKey as keyof AMCAnalyticsResponse];
              if (value === undefined || value === null) {
                return <span className="text-gray-400">-</span>;
              }
              return value ? (
                <Check className="w-5 h-5 text-green-600 mx-auto" />
              ) : (
                <X className="w-5 h-5 text-red-500 mx-auto" />
              );
            }}
            storageKey="amc-analytics-detail-table"
            hideTableSearch
            hideTableExport
            hideColumnsButton
            getItemId={() => "amc-detail-row"}
          />
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
          <EnhancedTable
            data={pastAmcData}
            columns={pastAmcColumns}
            renderCell={(item: (typeof pastAmcData)[number], columnKey: string) => {
              if (columnKey === "statusLabel") {
                return <StatusBadge status={item.statusLabel} size="sm" />;
              }
              return item[columnKey as keyof typeof item] as React.ReactNode;
            }}
            storageKey="amc-analytics-past-amc-table"
            hideTableSearch
            hideTableExport
            hideColumnsButton
            loading={loading}
            loadingMessage="Loading past AMC data..."
            emptyMessage="No past AMC records available."
            pagination
            pageSize={15}
            getItemId={(item) => item.rowId}
          />
        </div>
      </div>
    </div>
  );
};
