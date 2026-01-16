import React, { useMemo } from "react";

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

  return (
    <main className="p-4">
      <div className="w-full h-[calc(100vh-120px)] overflow-hidden rounded-lg border border-gray-200 bg-white">
        <iframe
          src={SUPERSET_DASHBOARD_URL}
          title="Superset Dashboard"
          className="w-full h-full border-0"
          allow="clipboard-read; clipboard-write; fullscreen"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>
    </main>
  );
}

export default SupersetDashboard;
