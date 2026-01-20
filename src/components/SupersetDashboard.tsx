import axios from "axios";
import React, { useEffect, useMemo, useState } from "react";

function SupersetDashboard() {
  // Get dynamic token from authentication
  const [ids, setIds] = useState([])
  const baseUrl = localStorage.getItem("baseUrl");
  const token = localStorage.getItem("token");
  const selectedSiteId = localStorage.getItem("selectedSiteId");
  const userId = localStorage.getItem('userId')

  const fetchProjectIds = async () => {
    try {
      const response = await axios.get(`https://${baseUrl}/users/${userId}/asssoicated_projects.json`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      setIds(response.data.map((item: any) => item.project_management_id))
    } catch (error) {
      console.error('Error fetching project IDs:', error);
    }
  }

  useEffect(() => {
    fetchProjectIds()
  }, [])

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

    params.append("project_id", ids.join(","));
    return `https://superset.lockated.com/superset/dashboard/3/?${params.toString()}`;
  }, [token, selectedSiteId, ids]);

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
