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
  // ...other fields...
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
}

interface DashboardSummary {
  ppm_comp_rate: string;
  next_amc_due: string | null;
  last_ppm: string | null;
  next_ppm_due: string | null;
  upcoming_amc_date: string | null;
  tickets: string | number;
}

export const AssetAnalyticsTab: React.FC<AssetAnalyticsTab> = ({
  asset,
  assetId,
}) => {
  const { id } = useParams();
  const [configStatus, setConfigStatus] = useState<ConfigStatus | null>(null);
  const [dashboardSummary, setDashboardSummary] =
    useState<DashboardSummary | null>(null);

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
    "Ebom",
    // "Attachments",
    "Readings",
    // "History Card",
    "Depriciation",
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
            className="flex items-center gap-2 px-3 py-2 rounded-lg border border-red-200"
            style={{ backgroundColor: "#f6f4ee" }}
          >
            <Clock className="w-5 h-5 text-red-600" />
            <span className="text-red-600 font-medium text-sm">DD:HH:MM</span>
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

      {/* Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Open Tickets */}
        <div
          className="border bg-[#F6F4EE] flex items-center p-4"
          style={{ height: "132px", width: "488px" }}
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
              {dashboardSummary?.tickets !== undefined ? dashboardSummary.tickets : "-"}
            </span>
            
          </div>
        </div>

        {/* Upcoming AMC */}
        <div
          className="border bg-[#F6F4EE] flex items-center p-4"
          style={{ height: "132px", width: "488px" }}
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
              style={{ fontSize: 24 }}
            >
              {dashboardSummary?.upcoming_amc_date || "-"}
            </span>
            <span className="text-[#1A1A1A]" style={{ fontSize: 16 }}>
              Upcoming AMC
            </span>
          </div>
        </div>

        {/* PPM Comp. Rate */}
        <div
          className="border bg-[#F6F4EE] flex items-center p-4"
          style={{ height: "132px", width: "488px" }}
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
              PPM Completion %
            </span>
            <span className="text-[#1A1A1A]" style={{ fontSize: 16 }}>
              {dashboardSummary?.ppm_comp_rate || "-"}
            </span>
          </div>
        </div>

        {/* Last PPM */}
        <div
          className="border bg-[#F6F4EE] flex items-center p-4"
          style={{ height: "132px", width: "488px" }}
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
              Last PPM Conducted On
            </span>
            <span className="text-[#1A1A1A]" style={{ fontSize: 16 }}>
              {dashboardSummary?.last_ppm || "-"}
            </span>
          </div>
        </div>

        {/* Next PPM Due */}
        <div
          className="border bg-[#F6F4EE] flex items-center p-4"
          style={{ height: "132px", width: "488px" }}
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
              style={{ fontSize: 24 }}
            >
              Next PPM Due
            </span>
            <span className="text-[#1A1A1A]" style={{ fontSize: 16 }}>
              {dashboardSummary?.next_ppm_due || "-"}
            </span>
          </div>
        </div>

        {/* 6th Card - Recent Updates */}
        <div
          className="border bg-[#F6F4EE] flex items-center p-4"
          style={{ height: "132px", width: "488px" }}
        >
          <div
            className="flex items-center justify-center rounded-lg mr-4"
            style={{ background: "#EDEAE3", width: 62, height: 62 }}
          >
            {/* Info SVG icon */}
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle
                cx="12"
                cy="12"
                r="10"
                stroke="#C72030"
                strokeWidth="1.5"
              />
              <rect x="11" y="10" width="2" height="7" rx="1" fill="#C72030" />
              <rect x="11" y="7" width="2" height="2" rx="1" fill="#C72030" />
            </svg>
          </div>
          <div className="flex flex-col justify-center">
            <span
              className="font-semibold text-[#1A1A1A]"
              style={{ fontSize: 18 }}
            >
              Recent Updates
            </span>
            <span className="text-[#1A1A1A]" style={{ fontSize: 16 }}>
              Aman Created a new Checklist.
            </span>
            <span className="text-[12px] text-[#9CA3AF] mt-2">
              Created on: 23/07/2025 – 12:23 PM
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
