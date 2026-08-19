// @ts-nocheck
import axios from "axios";
import { getAuthHeader } from "@/config/apiConfig";
import { getApiContext } from "../apiClient";

export interface Department {
  id: number;
  name: string;
}

/** org_id runtime pe badalta hai — hamesha localStorage se hi padha jaata hai. */
export const getOrgId = () => String(getApiContext().orgId || "").trim();

export async function fetchDepartments(): Promise<Department[]> {
  // localStorage may hold the host with or without a scheme — normalize both.
  const baseUrl = (localStorage.getItem("baseUrl") || "")
    .trim()
    .replace(/\/+$/, "")
    .replace(/^https?:\/\//, "");
  if (!baseUrl) throw new Error("Base URL not found in localStorage");

  const orgId = getOrgId();
  if (!orgId) throw new Error("org_id not found in localStorage");

  const url = `https://${baseUrl}/pms/departments.json?org_id=${encodeURIComponent(orgId)}`;

  const res = await axios.get(url, {
    headers: {
      Accept: "application/json, text/plain, */*",
      Authorization: getAuthHeader(),
    },
  });

  const rows = Array.isArray(res.data) ? res.data : res.data?.departments || [];
  // Ye endpoint kabhi `name` bhejta hai kabhi `department_name` — dono set kar dete hain.
  return rows.map((d) => ({
    ...d,
    name: d.name || d.department_name || d.title || "",
    department_name: d.department_name || d.name || d.title || "",
  }));
}
