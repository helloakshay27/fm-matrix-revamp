import React from "react";
import { Activity, EyeIcon, MapPin, FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface RecentPermit {
  id: number;
  referenceNumber: string;
  permitFor: string;
  permitType: string;
  location: string;
  status: string;
  createdAt: string;
}

interface RecentPermitsSidebarProps {
  permits: {
    id: number;
    reference_number: string;
    permit_for: string;
    permit_type: string;
    location: string;
    status: string;
    created_at: string;
  }[];
  loading?: boolean;
}

export const RecentPermitsSidebar: React.FC<RecentPermitsSidebarProps> = ({
  permits,
  loading = false,
}) => {
  const navigate = useNavigate();

  const transformPermit = (p: RecentPermitsSidebarProps["permits"][0]): RecentPermit => ({
    id: p.id,
    referenceNumber: p.reference_number || "—",
    permitFor: p.permit_for || "—",
    permitType: p.permit_type || "—",
    location: p.location || "—",
    status: p.status || "—",
    createdAt: p.created_at
      ? new Date(p.created_at).toLocaleDateString("en-US", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        })
      : "—",
  });

  const recentPermits: RecentPermit[] = permits.slice(0, 10).map(transformPermit);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "open":
        return "bg-[#AAB9C5] text-[#1A1A1A]";
      case "approved":
        return "bg-[#C4D8C4] text-[#1A1A1A]";
      case "closed":
        return "bg-[#C4B89D] text-[#1A1A1A]";
      case "draft":
        return "bg-[#D5DBDB] text-[#1A1A1A]";
      case "hold":
        return "bg-[#DBC2A9] text-[#1A1A1A]";
      case "rejected":
        return "bg-[#E4626F] text-[#1A1A1A]";
      case "extended":
        return "bg-[#B8CCE4] text-[#1A1A1A]";
      case "expired":
        return "bg-[#D9D9D9] text-[#1A1A1A]";
      default:
        return "bg-[#D5DBDB] text-[#1A1A1A]";
    }
  };

  const handleViewDetails = (id: number) => {
    navigate(`/safety/permit-to-work/${id}`);
  };

  return (
    <div className="bg-white p-4 h-fit border">
      {/* Header */}
      <div className="mb-6">
        <h3 className="text-lg font-bold mb-1" style={{ color: "#C72030" }}>
          Recent Permits
        </h3>
        <p className="text-sm text-gray-600">
          {new Date().toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
      </div>

      <div className="max-h-[600px] overflow-y-auto space-y-4">
        {loading && (
          <div className="flex items-center justify-center py-8">
            <div className="text-sm text-gray-600">Loading recent permits...</div>
          </div>
        )}

        {!loading && recentPermits.length === 0 && (
          <div className="flex items-center justify-center py-8">
            <div className="text-sm text-gray-600">No recent permits found</div>
          </div>
        )}

        {!loading &&
          recentPermits.map((permit) => (
            <div
              key={permit.id}
              className="bg-white border border-[#C4B89D]/40 rounded-lg p-4"
            >
              {/* Permit ID + Date */}
              <div className="flex items-center justify-between mb-4">
                <span className="font-semibold text-gray-500 text-sm leading-[12px] tracking-[0px]">
                  #{permit.referenceNumber}
                </span>
                <span className="text-xs text-gray-400">{permit.createdAt}</span>
              </div>

              {/* Permit For */}
              <div className="mb-3">
                <h3 className="font-semibold text-gray-900 text-sm leading-[14px] tracking-[0px] line-clamp-2">
                  {permit.permitFor}
                </h3>
              </div>

              {/* Permit Type */}
              <div className="flex items-center gap-3 mb-3">
                <FileText className="h-4 w-4 text-red-500 shrink-0" />
                <span className="text-sm font-medium text-gray-700 min-w-[80px]">
                  Type :
                </span>
                <span className="text-sm text-gray-900 truncate">{permit.permitType}</span>
              </div>

              {/* Location */}
              <div className="flex items-center gap-3 mb-3">
                <MapPin className="h-4 w-4 text-red-500 shrink-0" />
                <span className="text-sm font-medium text-gray-700 min-w-[80px]">
                  Location :
                </span>
                <span className="text-sm text-gray-900 truncate">{permit.location}</span>
              </div>

              {/* Status */}
              <div className="flex items-center gap-3 mb-4">
                <Activity className="h-4 w-4 text-red-500 shrink-0" />
                <span className="text-sm font-medium text-gray-700 min-w-[80px]">
                  Status :
                </span>
                <span
                  className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(permit.status)}`}
                >
                  {permit.status}
                </span>
              </div>

              {/* View button */}
              <div className="flex items-center justify-end gap-4">
                <button
                  className="flex items-center gap-1 text-sm font-medium underline text-[#C72030] hover:opacity-80"
                  onClick={() => handleViewDetails(permit.id)}
                >
                  <EyeIcon className="h-[24px] w-[24px]" color="#C72030" />
                </button>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};
