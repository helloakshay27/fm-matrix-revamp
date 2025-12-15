import React, { useEffect, useMemo, useState } from "react";
import { Check, X } from "lucide-react";
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
  amc_cost?: number | null;
  amc_start_date?: string | null;
  amc_end_date?: string | null;
  status?: string | null;
  amc_type?: string | null;
  supplier_company_name?: string | null;
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

        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 px-4 pb-4">
        {/* SLA Achieved */}
        <div
          className="border bg-[#F6F4EE] flex items-center p-4"
          style={{ height: "132px", width: "auto" }}
        >
          <div
            className="flex items-center justify-center rounded-lg mr-4"
            style={{ background: "#EDEAE3", width: 62, height: 62 }}
          >
            {/* Cog SVG icon */}
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 15.5A3.5 3.5 0 1 0 12 8.5a3.5 3.5 0 0 0 0 7Z"
                stroke="#C72030"
                strokeWidth="1.5"
              />
              <path
                d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33h.01a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51h.01a1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82v.01a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1Z"
                stroke="#C72030"
                strokeWidth="1.5"
              />
            </svg>
          </div>
          <div className="flex flex-col justify-center">
            <span
              className="font-semibold text-[#1A1A1A]"
              style={{ fontSize: 18 }}
            >
              SLA Achieved
            </span>
            <span className="text-[#1A1A1A]" style={{ fontSize: 16 }}>
              {formatValue(analytics?.sla_achieved)}
            </span>
          </div>
        </div>

        {/* No. of Critical Assets Covered */}
        <div
          className="border bg-[#F6F4EE] flex items-center p-4"
          style={{ height: "132px", width: "auto" }}
        >
          <div
            className="flex items-center justify-center rounded-lg mr-4"
            style={{ background: "#EDEAE3", width: 62, height: 62 }}
          >
            {/* Cog SVG icon */}
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 15.5A3.5 3.5 0 1 0 12 8.5a3.5 3.5 0 0 0 0 7Z"
                stroke="#C72030"
                strokeWidth="1.5"
              />
              <path
                d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33h.01a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51h.01a1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82v.01a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1Z"
                stroke="#C72030"
                strokeWidth="1.5"
              />
            </svg>
          </div>
          <div className="flex flex-col justify-center">
            <span
              className="font-semibold text-[#1A1A1A]"
              style={{ fontSize: 18 }}
            >
              No. of Critical Assets Covered
            </span>
            <span className="text-[#1A1A1A]" style={{ fontSize: 16 }}>
              {formatValue(analytics?.critical_assets_covered_number)}
            </span>
          </div>
        </div>

        {/* Critical Assets Covered (Value) */}
        <div
          className="border bg-[#F6F4EE] flex items-center p-4"
          style={{ height: "132px", width: "auto" }}
        >
          <div
            className="flex items-center justify-center rounded-lg mr-4"
            style={{ background: "#EDEAE3", width: 62, height: 62 }}
          >
            {/* Cog SVG icon */}
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 15.5A3.5 3.5 0 1 0 12 8.5a3.5 3.5 0 0 0 0 7Z"
                stroke="#C72030"
                strokeWidth="1.5"
              />
              <path
                d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33h.01a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51h.01a1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82v.01a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1Z"
                stroke="#C72030"
                strokeWidth="1.5"
              />
            </svg>
          </div>
          <div className="flex flex-col justify-center">
            <span
              className="font-semibold text-[#1A1A1A]"
              style={{ fontSize: 18 }}
            >
              Critical Assets Covered (Value)
            </span>
            <span className="text-[#1A1A1A]" style={{ fontSize: 16 }}>
              {formatValue(analytics?.critical_assets_covered_value)}
            </span>
          </div>
        </div>

        {/* Visits Completed */}
        <div
          className="border bg-[#F6F4EE] flex items-center p-4"
          style={{ height: "132px", width: "auto" }}
        >
          <div
            className="flex items-center justify-center rounded-lg mr-4"
            style={{ background: "#EDEAE3", width: 62, height: 62 }}
          >
            {/* Cog SVG icon */}
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 15.5A3.5 3.5 0 1 0 12 8.5a3.5 3.5 0 0 0 0 7Z"
                stroke="#C72030"
                strokeWidth="1.5"
              />
              <path
                d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33h.01a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51h.01a1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82v.01a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1Z"
                stroke="#C72030"
                strokeWidth="1.5"
              />
            </svg>
          </div>
          <div className="flex flex-col justify-center flex-1">
            <span
              className="font-semibold text-[#1A1A1A]"
              style={{ fontSize: 18 }}
            >
              Visits Completed
            </span>
            <span className="text-[#1A1A1A]" style={{ fontSize: 16 }}>
              {formatValue(analytics?.visits_completed)}
            </span>
            {/* {dashboardSummary?.visits_completed_percentage && (
              <div className="mt-2">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-red-600 h-2 rounded-full" 
                    style={{ width: `${dashboardSummary.visits_completed_percentage}%` }}
                  ></div>
                </div>
                <span className="text-xs text-gray-600 mt-1">{dashboardSummary.visits_completed_percentage}%</span>
              </div>
            )} */}
          </div>
        </div>

        {/* Pending Visits */}
        <div
          className="border bg-[#F6F4EE] flex items-center p-4"
          style={{ height: "132px", width: "auto" }}
        >
          <div
            className="flex items-center justify-center rounded-lg mr-4"
            style={{ background: "#EDEAE3", width: 62, height: 62 }}
          >
            {/* Cog SVG icon */}
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 15.5A3.5 3.5 0 1 0 12 8.5a3.5 3.5 0 0 0 0 7Z"
                stroke="#C72030"
                strokeWidth="1.5"
              />
              <path
                d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33h.01a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51h.01a1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82v.01a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1Z"
                stroke="#C72030"
                strokeWidth="1.5"
              />
            </svg>
          </div>
          <div className="flex flex-col justify-center flex-1">
            <span
              className="font-semibold text-[#1A1A1A]"
              style={{ fontSize: 18 }}
            >
              Pending Visits
            </span>
            <span className="text-[#1A1A1A]" style={{ fontSize: 16 }}>
              {formatValue(analytics?.pending_visits)}
            </span>
            {/* {dashboardSummary?.pending_visits_percentage && (
              <div className="mt-2">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-orange-500 h-2 rounded-full" 
                    style={{ width: `${dashboardSummary.pending_visits_percentage}%` }}
                  ></div>
                </div>
                <span className="text-xs text-gray-600 mt-1">{dashboardSummary.pending_visits_percentage}%</span>
              </div>
            )} */}
          </div>
        </div>

        {/* Open Tickets */}
        <div
          className="border bg-[#F6F4EE] flex items-center p-4"
          style={{ height: "132px", width: "auto" }}
        >
          <div
            className="flex items-center justify-center rounded-lg mr-4"
            style={{ background: "#EDEAE3", width: 62, height: 62 }}
          >
            {/* Cog SVG icon */}
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 15.5A3.5 3.5 0 1 0 12 8.5a3.5 3.5 0 0 0 0 7Z"
                stroke="#C72030"
                strokeWidth="1.5"
              />
              <path
                d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33h.01a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51h.01a1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82v.01a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1Z"
                stroke="#C72030"
                strokeWidth="1.5"
              />
            </svg>
          </div>
          <div className="flex flex-col justify-center">
            <span
              className="font-semibold text-[#1A1A1A]"
              style={{ fontSize: 18 }}
            >
              Open Tickets
            </span>
            <span className="text-[#1A1A1A]" style={{ fontSize: 16 }}>
              {formatValue(analytics?.open_tickets)}
            </span>
          </div>
        </div>
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
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 border-b">Start Date</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 border-b">End Date</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 border-b">Vendor</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 border-b">AMC Type</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 border-b">Value</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 border-b">Action Status</th>
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
                  pastPPM.map((entry) => (
                    <tr
                      key={entry.id}
                      className="border-b"
                      style={{ backgroundColor: "rgba(250, 250, 250, 1)" }}
                    >
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {formatDate(entry.amc_start_date)}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {formatDate(entry.amc_end_date)}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {entry.supplier_company_name || "—"}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {entry.amc_type || "—"}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {entry.amc_cost !== undefined && entry.amc_cost !== null
                          ? `₹ ${entry.amc_cost.toLocaleString()}`
                          : "—"}
                      </td>
                      <td className="px-4 py-3">
                        <StatusBadge
                          status={entry.status || "Action Pending"}
                          assetId={`past-amc-${entry.id}`}
                        />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
