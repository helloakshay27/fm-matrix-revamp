// @ts-nocheck
import axios from "axios";
import { getAuthHeader } from "@/config/apiConfig";

export interface Department {
  id: number;
  name: string;
}

export async function fetchDepartments(): Promise<Department[]> {
  // localStorage may hold the host with or without a scheme — normalize both.
  const baseUrl = (localStorage.getItem("baseUrl") || "")
    .trim()
    .replace(/\/+$/, "")
    .replace(/^https?:\/\//, "");
  if (!baseUrl) throw new Error("Base URL not found in localStorage");

  const orgId = (localStorage.getItem("org_id") || "").trim();
  if (!orgId) throw new Error("org_id not found in localStorage");

  const url = `https://${baseUrl}/pms/departments.json?org_id=${orgId}`;

  const res = await axios.get(url, {
    headers: {
      Accept: "application/json, text/plain, */*",
      Authorization: getAuthHeader(),
    },
  });

  return Array.isArray(res.data) ? res.data : res.data?.departments || [];
}
