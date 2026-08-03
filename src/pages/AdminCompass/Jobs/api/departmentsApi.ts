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
  const selectedCompanyId = localStorage.getItem("selectedCompanyId");
  const selectedSiteId = localStorage.getItem("selectedSiteId");
  const storedUser = localStorage.getItem("user");
  const parsedUser = storedUser ? JSON.parse(storedUser) : null;
  const fallbackCompanyId =
    selectedCompanyId ||
    selectedSiteId ||
    parsedUser?.company_id ||
    parsedUser?.lock_role?.company_id ||
    "";

  if (!baseUrl) throw new Error("Base URL not found in localStorage");
  if (!fallbackCompanyId) {
    throw new Error("Selected company/site ID not found in localStorage");
  }

  const url = `https://${baseUrl}/pms/company_setups/${fallbackCompanyId}/departments.json`;

  const res = await axios.get(url, {
    headers: {
      Accept: "application/json, text/plain, */*",
      Authorization: getAuthHeader(),
    },
  });

  return res.data?.departments || [];
}
