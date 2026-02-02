import axios from "axios";
import React, { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";

function SupersetDashboardMobile() {
    const location = useLocation();
    const [ids, setIds] = useState([])
    const [isLoading, setIsLoading] = useState(true);

    // Extract token, org_id, and user_id from URL
    let token: string | null = null;
    let orgId: string | null = null;
    let userId: string | null = null;

    const searchParams = new URLSearchParams(location.search);
    token = searchParams.get('token') || searchParams.get('access_token');
    orgId = searchParams.get('org_id');
    userId = searchParams.get('user_id');

    if (!token && location.hash) {
        const hash = location.hash.replace(/^#/, '');
        const hashParams = new URLSearchParams(hash);
        token = hashParams.get('token') || hashParams.get('access_token');
        orgId = hashParams.get('org_id');
        userId = hashParams.get('user_id');
    }

    // Store token, org_id, and user_id in storage
    useEffect(() => {
        if (token) {
            sessionStorage.setItem('mobile_token', token);
            localStorage.setItem('token', token);
            console.log("✅ Mobile token stored in sessionStorage and localStorage");
        }
        if (orgId) {
            sessionStorage.setItem('org_id', orgId);
            console.log("✅ org_id stored in sessionStorage:", orgId);
        }
        if (userId) {
            sessionStorage.setItem('user_id', userId);
            localStorage.setItem('user_id', userId);
            console.log("✅ user_id stored in sessionStorage and localStorage:", userId);
        }
    }, [token, orgId, userId]);

    // Get baseUrl
    const baseUrl = localStorage.getItem("baseUrl") ?? "lockated-api.gophygital.work";
    const storedToken = sessionStorage.getItem("mobile_token") || localStorage.getItem("token");
    const storedUserId = sessionStorage.getItem("user_id") || localStorage.getItem('user_id');

    const fetchProjectIds = async () => {
        const tokenToUse = token || storedToken;
        const userIdToUse = userId || storedUserId;

        if (!tokenToUse || !userIdToUse) {
            console.warn("⚠️ No token or userId available");
            setIsLoading(false);
            return;
        }

        try {
            const response = await axios.get(`https://${baseUrl}/users/${userIdToUse}/asssoicated_projects.json?token=${tokenToUse}`)
            setIds(response.data.map((item: any) => item.project_management_id))
        } catch (error) {
            console.error('Error fetching project IDs:', error);
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        const tokenToUse = token || storedToken;
        if (tokenToUse) {
            fetchProjectIds()
        }
    }, [token, storedToken, userId, storedUserId])

    // Build dynamic Superset dashboard URL
    const SUPERSET_DASHBOARD_URL = useMemo(() => {
        const tokenToUse = token || storedToken;
        const params = new URLSearchParams({
            native_filters_key: "Etpl0AYTl7M",
            standalone: "2",
        });

        if (tokenToUse) {
            params.append("token", tokenToUse);
        }

        params.append("project_id", ids.join(","));
        return `https://superset.lockated.com/superset/dashboard/3/?${params.toString()}`;
    }, [token, storedToken, ids]);

    return (
        <main className="p-4">
            <div className="w-full h-[calc(100vh-120px)] overflow-hidden rounded-lg border border-gray-200 bg-white">
                {isLoading ? (
                    <div className="flex items-center justify-center w-full h-full">
                        <p className="text-gray-500">Loading dashboard...</p>
                    </div>
                ) : (
                    <iframe
                        src={SUPERSET_DASHBOARD_URL}
                        title="Superset Dashboard"
                        className="w-full h-full border-0"
                        allow="clipboard-read; clipboard-write; fullscreen"
                        referrerPolicy="no-referrer-when-downgrade"
                    />
                )}
            </div>
        </main>
    );
}

export default SupersetDashboardMobile;
