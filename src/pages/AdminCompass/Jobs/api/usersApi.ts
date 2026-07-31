// @ts-nocheck
import axios from "axios";
import { getAuthHeader } from "@/config/apiConfig";

export interface EscalateUser {
  id: number;
  full_name: string;
}

export async function fetchEscalateUsers(): Promise<EscalateUser[]> {
  const baseUrl = (localStorage.getItem("baseUrl") || "").replace(/\/$/, "");

  if (!baseUrl) throw new Error("Base URL not found in localStorage");

  const url = `https://${baseUrl}/pms/users/get_escalate_to_users.json`;

  const res = await axios.get(url, {
    headers: {
      Accept: "application/json, text/plain, */*",
      Authorization: getAuthHeader(),
    },
  });

  return res.data?.users || [];
}
