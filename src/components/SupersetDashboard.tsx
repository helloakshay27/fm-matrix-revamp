import React, { useMemo } from "react";
import { ExternalLink, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";

function SupersetDashboard() {
  // Get dynamic token from authentication
  const token = localStorage.getItem("token");
  const selectedSiteId = localStorage.getItem("selectedSiteId");

  // Build dynamic Superset dashboard URL
  const SUPERSET_DASHBOARD_URL = useMemo(() => {
    const params = new URLSearchParams({
      native_filters_key: "Etpl0AYTl7M",
      standalone: "2",
    });

    if (token) {
      params.append(
        "token",
        "93d65f48f3b24ee90357e76fd3747b863dfba98a5445511b"
      );
    }

    if (selectedSiteId) {
      params.append("project_id", selectedSiteId);
    }

    return `https://superset.lockated.com/superset/dashboard/3/?${params.toString()}`;
  }, [token, selectedSiteId]);

  const handleOpenInNewWindow = () => {
    window.open(
      SUPERSET_DASHBOARD_URL,
      "_blank",
      "noopener,noreferrer,width=1400,height=900"
    );
  };

  return (
    <main className="p-4">
      <div className="flex items-center justify-center h-[calc(100vh-160px)]">
        <div className="text-center space-y-6 max-w-lg">
          <div className="flex justify-center">
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center">
              <BarChart3 className="w-10 h-10 text-blue-600" />
            </div>
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold text-gray-900">
              Executive Dashboard
            </h2>
            <p className="text-gray-600">
              The dashboard is configured to open in a new window for the best
              viewing experience and security.
            </p>
          </div>
          <Button
            onClick={handleOpenInNewWindow}
            className="bg-[#C72030] hover:bg-[#A01020] text-white px-8 py-6 text-lg"
          >
            <ExternalLink className="w-5 h-5 mr-2" />
            Open Dashboard
          </Button>
          <p className="text-sm text-gray-500 mt-4">
            The dashboard will open in a new browser window
          </p>
        </div>
      </div>
    </main>
  );
}

export default SupersetDashboard;
