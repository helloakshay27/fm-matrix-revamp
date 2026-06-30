import React, { useEffect, useState } from "react";
import { Activity, EyeIcon, Building2Icon, AlertTriangle, ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { incidentService, Incident } from "@/services/incidentService";

interface RecentIncident {
  id: string;
  description: string;
  buildingName: string;
  status: string;
  level: string;
  createdAt: string;
}

export const RecentIncidentsSidebar = () => {
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = useState<boolean>(() => {
    try { return localStorage.getItem("sidebarCollapsed") === "true"; } catch { return false; }
  });

  // Fetch recent incidents — latest 10
  const {
    data: incidentData,
    isLoading,
    error,
    isError,
  } = useQuery({
    queryKey: ["recent-incidents-sidebar"],
    queryFn: () => incidentService.getIncidents("per_page=10&page=1"),
    refetchInterval: 5 * 60 * 1000,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  useEffect(() => {
    if (incidentData) {
      console.warn("Recent incidents sidebar data:", incidentData);
    }
    if (error) {
      console.error("Recent incidents sidebar error:", error);
    }
  }, [incidentData, error]);

  const transformIncident = (inc: Incident): RecentIncident => ({
    id: inc.id.toString(),
    description: inc.description || "—",
    buildingName: inc.building_name || "—",
    status: inc.current_status || "—",
    level: inc.inc_level_name || "—",
    createdAt: inc.created_at
      ? new Date(inc.created_at).toLocaleDateString("en-US", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        })
      : "—",
  });

  const recentIncidents: RecentIncident[] =
    incidentData?.data?.incidents?.map(transformIncident) || [];

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "open":
        return "bg-[#E4626F] text-[#1A1A1A]";
      case "closed":
        return "bg-[#C4B89D] text-[#1A1A1A]";
      case "under_investigation":
      case "under investigation":
        return "bg-[#DBC2A9] text-[#1A1A1A]";
      case "pending":
        return "bg-[#AAB9C5] text-[#1A1A1A]";
      default:
        return "bg-[#D5DbDB] text-[#1A1A1A]";
    }
  };

  const handleViewDetails = (id: string) => {
    navigate(`/safety/incident/new-details/${id}`);
  };

  return (
    <div
      className="bg-white border flex flex-col transition-all duration-300"
      style={{
        boxShadow: "0px 4px 14.2px 0px #0000001A",
        width: isCollapsed ? 48 : 350,
        minWidth: isCollapsed ? 48 : 350,
        maxWidth: isCollapsed ? 48 : 350,
        height: "100%",
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <div className={`flex items-center justify-between px-3 py-3 border-b border-gray-100 flex-shrink-0 ${isCollapsed ? "flex-col gap-2" : ""}`}>
        {!isCollapsed && (
          <h3 className="text-base font-semibold" style={{ color: "#c72030" }}>Recent Incidents</h3>
        )}
        <button
          onClick={() => setIsCollapsed((v) => {
            const next = !v;
            try { localStorage.setItem("sidebarCollapsed", String(next)); } catch {}
            return next;
          })}
          title={isCollapsed ? "Expand" : "Collapse"}
          className="w-7 h-7 flex items-center justify-center rounded hover:bg-gray-100 text-gray-500"
        >
          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Collapsed vertical label */}
      {isCollapsed && (
        <div className="flex-1 flex items-center justify-center">
          <span
            className="text-xs font-semibold tracking-widest"
            style={{ writingMode: "vertical-rl", color: "#c72030", transform: "rotate(180deg)" }}
          >
            Recent Incidents
          </span>
        </div>
      )}

      {!isCollapsed && (
      <div className="flex-1 space-y-4 overflow-y-auto p-4 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
        {isLoading && (
          <div className="flex items-center justify-center py-8">
            <div className="text-sm text-gray-600">
              Loading recent incidents...
            </div>
          </div>
        )}

        {isError && (
          <div className="flex items-center justify-center py-8">
            <div className="text-sm text-red-600">
              Failed to load recent incidents
            </div>
          </div>
        )}

        {!isLoading && !isError && recentIncidents.length === 0 && (
          <div className="flex items-center justify-center py-8">
            <div className="text-sm text-gray-600">
              No recent incidents found
            </div>
          </div>
        )}

        {!isLoading &&
          !isError &&
          recentIncidents.map((incident) => (
            <div
              key={incident.id}
              className="bg-white border border-[#C4B89D]/40 rounded-lg p-4"
            >
              {/* Incident ID */}
              <div className="flex items-center justify-between mb-4">
                <span className="font-semibold text-gray-500 text-sm leading-[12px] tracking-[0px]">
                  #{incident.id}
                </span>
                <span className="text-xs text-gray-400">
                  {incident.createdAt}
                </span>
              </div>

              {/* Description */}
              <div className="mb-3">
                <h3 className="font-semibold text-gray-900 text-sm leading-[14px] tracking-[0px] line-clamp-2">
                  {incident.description}
                </h3>
              </div>

              {/* Building */}
              <div className="flex items-center gap-3 mb-3">
                <Building2Icon className="h-4 w-4 text-red-500 shrink-0" />
                <span className="text-sm font-medium text-gray-700 min-w-[100px]">
                  Building :
                </span>
                <span className="text-sm text-gray-700">:</span>
                <span className="text-sm text-gray-900 truncate">
                  {incident.buildingName}
                </span>
              </div>

              {/* Level */}
              <div className="flex items-center gap-3 mb-3">
                <AlertTriangle className="h-4 w-4 text-red-500 shrink-0" />
                <span className="text-sm font-medium text-gray-700 min-w-[100px]">
                  Level :
                </span>
                <span className="text-sm text-gray-700">:</span>
                <span className="text-sm text-gray-900">{incident.level}</span>
              </div>

              {/* Status */}
              <div className="flex items-center gap-3 mb-4">
                <Activity className="h-4 w-4 text-red-500 shrink-0" />
                <span className="text-sm font-medium text-gray-700 min-w-[100px]">
                  Status :
                </span>
                <span className="text-sm text-gray-700">:</span>
                <span
                  className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(incident.status)}`}
                >
                  {incident.status}
                </span>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-4">
                <button
                  className="flex items-center gap-1 text-sm font-medium underline text-[#C72030] hover:opacity-80"
                  onClick={() => handleViewDetails(incident.id)}
                >
                  <EyeIcon className="h-[24px] w-[24px]" color="#C72030" />
                </button>
              </div>
            </div>
          ))}
      </div>
      )}
    </div>
  );
};
