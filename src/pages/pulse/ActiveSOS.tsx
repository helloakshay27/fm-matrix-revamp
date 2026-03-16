import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AlertTriangle, Users, MapPin, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import axios from "axios";

// ─── Types ─────────────────────────────────────────────────────────────────────

interface SOSAlert {
  id: number;
  ride_id: number;
  driver: string;
  reported_by: string;
  latitude: number;
  longitude: number;
  location: string;
  message: string | null;
  status: string;
  created_at: string;
  updated_at: string;
}

// ─── Component ─────────────────────────────────────────────────────────────────

export const ActiveSOS: React.FC = () => {
  const navigate = useNavigate();
  const [alerts, setAlerts] = useState<SOSAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const baseUrl = localStorage.getItem("baseUrl");
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchSOSAlerts = async () => {
      if (!baseUrl || !token) {
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const response = await axios.get(
          `https://${baseUrl}/sos.json`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const data = response.data;
        if (Array.isArray(data)) {
          setAlerts(data);
        } else {
          setAlerts([]);
        }
      } catch (err: unknown) {
        const e = err as { response?: { data?: { error?: string } }; message?: string };
        setError(e.response?.data?.error || e.message || "Failed to load SOS alerts");
      } finally {
        setLoading(false);
      }
    };

    fetchSOSAlerts();
  }, [baseUrl, token]);

  const formatAlertTime = (timeStr: string) => {
    if (!timeStr) return "";
    try {
      const date = new Date(timeStr);
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffMins = Math.floor(diffMs / 60000);
      if (diffMins < 60) return `${diffMins} minutes ago`;
      const diffHrs = Math.floor(diffMins / 60);
      if (diffHrs < 24) return `${diffHrs} hours ago`;
      return date.toLocaleDateString("en-US", { day: "numeric", month: "long", year: "numeric" });
    } catch {
      return timeStr;
    }
  };

  return (
    <div className="p-4 sm:p-6 max-w-full">
      {/* Breadcrumb */}
      <div className="text-sm text-gray-500 mb-6">
        <span
          className="cursor-pointer hover:text-[#C72030]"
          onClick={() => navigate("/pulse/carpool")}
        >
          Carpool
        </span>
        <span className="mx-1">&gt;</span>
        <span className="text-gray-700 font-medium">Active SOS</span>
      </div>

      {/* Header */}
      <div className="mb-6">
        <div className="inline-flex items-center gap-2 text-base font-semibold text-[#DC143C]">
          <div className="h-2.5 w-2.5 rounded-full bg-[#DC143C] animate-pulse"></div>
          Active Alerts
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-[#C72030]" />
          <span className="ml-3 text-gray-500">Loading SOS alerts...</span>
        </div>
      )}

      {/* Error */}
      {!loading && error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <p className="text-red-600 font-medium">{error}</p>
          <p className="text-sm text-gray-500 mt-1">Please try again later.</p>
        </div>
      )}

      {/* Empty state */}
      {!loading && !error && alerts.length === 0 && (
        <div className="bg-[#FAF1F0] border border-[#F2C6C3] rounded-lg p-12 text-center">
          <AlertTriangle className="h-12 w-12 text-[#DC143C] mx-auto mb-4 opacity-40" />
          <p className="text-gray-600 font-medium">No active SOS alerts</p>
          <p className="text-sm text-gray-400 mt-1">All clear! There are no active SOS alerts at this time.</p>
        </div>
      )}

      {/* Alert Cards */}
      {!loading && !error && alerts.length > 0 && (
        <div className="space-y-4">
          {alerts.map((alert) => (
            <div
              key={alert.id}
              className="bg-[#FAF1F0] border border-[#F2C6C3] rounded-lg p-6"
            >
              {/* Card Header */}
              <div className="flex items-start gap-4 mb-5">
                <div className="w-10 h-10 rounded-full bg-[#FCE4E4] flex items-center justify-center flex-shrink-0">
                  <AlertTriangle className="h-5 w-5 text-[#DC143C]" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <span className="text-base font-semibold text-gray-900">
                      {alert.driver || "N/A"}
                    </span>
                    <Badge className="bg-[#DC143C] text-white text-xs px-2 py-0.5 rounded hover:bg-[#B22222]">
                      {alert.status?.toUpperCase() || "ACTIVE"}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-500">
                    {formatAlertTime(alert.created_at)}
                  </p>
                </div>
              </div>

              {/* Card Body */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
                {/* Reported By */}
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Users className="h-4 w-4 text-gray-400" />
                    <span className="text-xs text-gray-500">Reported By</span>
                  </div>
                  <p className="text-sm font-medium text-gray-900 pl-6">
                    {alert.reported_by || "N/A"}
                  </p>
                </div>

                {/* Location */}
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <MapPin className="h-4 w-4 text-gray-400" />
                    <span className="text-xs text-gray-500">Location</span>
                  </div>
                  <p className="text-sm font-medium text-gray-900 pl-6">
                    {alert.location || "N/A"}
                  </p>
                </div>

                {/* Message (if present) */}
                {alert.message && (
                  <div className="sm:col-span-2">
                    <p className="text-sm text-gray-600 italic">{alert.message}</p>
                  </div>
                )}

                {/* Track Now Button */}
                <div className="sm:col-span-2 flex justify-end">
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-[#C72030] text-[#C72030] hover:bg-[#FCE4E4] hover:text-[#C72030] font-medium"
                    onClick={() => navigate(`/pulse/carpool/ride-detail?id=${alert.ride_id}`)}
                  >
                    Track Now
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
