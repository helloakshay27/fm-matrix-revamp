// @ts-nocheck
import axios from "axios";
import { getAuthHeader } from "@/config/apiConfig";

export interface EscalateUser {
  id: number;
  full_name: string;
}

export async function fetchEscalateUsers(): Promise<EscalateUser[]> {
  // localStorage may hold the host with or without a scheme — normalize both.
  const baseUrl = (localStorage.getItem("baseUrl") || "")
    .trim()
    .replace(/\/+$/, "")
    .replace(/^https?:\/\//, "");

  if (!baseUrl) throw new Error("Base URL not found in localStorage");

  const orgId = localStorage.getItem("org_id") || "";
  const query = orgId ? `?organization_id=${encodeURIComponent(orgId)}` : "";
  const url = `https://${baseUrl}/pms/users/get_escalate_to_users.json${query}`;

  const res = await axios.get(url, {
    headers: {
      Accept: "application/json, text/plain, */*",
      Authorization: getAuthHeader(),
    },
  });

  return res.data?.users || [];
}
