import axios from "axios";
import { baseClient } from "@/utils/withoutTokenBase";
import {
  Milestone,
  MilestonesListResponse,
  CreateMilestonePayload,
  UpdateMilestonePayload,
} from "@/types/milestones";

/**
 * Milestones API Service
 * Uses TanStack Query for caching and automatic refetch
 * Handles all API calls for milestones module
 */

// Get token from localStorage/sessionStorage (same logic as ProjectsDashboard)
const getToken = () => {
  const mobileToken = sessionStorage.getItem("mobile_token");
  const webToken = localStorage.getItem("token");
  const token = mobileToken || webToken;
  
  if (token) {
    console.log("✅ [Milestones API] Token found:", token.substring(0, 20) + "...");
  } else {
    console.warn("⚠️ [Milestones API] No token found in sessionStorage or localStorage");
  }
  
  return token;
};

// Get baseUrl
const getBaseUrl = () => {
  const baseUrl = localStorage.getItem("baseUrl") ?? "";
  if (baseUrl) {
    console.log("✅ [Milestones API] BaseUrl found:", baseUrl);
  } else {
    console.log("ℹ️ [Milestones API] No baseUrl - will use baseClient with dynamic URL resolution");
  }
  return baseUrl;
};

/**
 * Helper function to make requests with baseUrl fallback
 * Decides whether to use direct axios or baseClient based on environment
 */
const apiRequest = async (
  method: "get" | "post" | "put" | "patch" | "delete",
  url: string,
  data?: unknown,
  headers?: Record<string, string>
) => {
  const token = getToken();
  const baseUrl = getBaseUrl();

  if (!token) {
    console.error("❌ [Milestones API] No authentication token available");
    throw new Error("No authentication token found");
  }

  try {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        ...headers,
      },
    };

    const client = baseUrl ? axios : baseClient;
    const fullUrl = baseUrl ? `https://${baseUrl}${url}` : url;
    
    console.log(`📡 [Milestones API] ${method.toUpperCase()} ${fullUrl}`, {
      hasToken: !!token,
      useBaseUrl: !!baseUrl,
      method,
    });

    // Axios method signatures:
    // GET: client.get(url, config)
    // POST: client.post(url, data, config)
    // PUT: client.put(url, data, config)
    // PATCH: client.patch(url, data, config)
    // DELETE: client.delete(url, config)
    switch (method) {
      case "get":
      case "delete":
        return await client[method](fullUrl, config);
      case "post":
      case "put":
      case "patch":
        return await client[method](fullUrl, data, config);
      default:
        throw new Error(`Unsupported HTTP method: ${method}`);
    }
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.message || error.message || "API request failed";
    const statusCode = error.response?.status;
    
    console.error(`❌ [Milestones API] ${method.toUpperCase()} ${url} failed:`, {
      statusCode,
      message: errorMessage,
      data: error.response?.data,
    });
    
    throw {
      message: errorMessage,
      statusCode: statusCode,
      errors: error.response?.data?.errors,
    };
  }
};

/**
 * Fetch milestones for a project
 * @param projectId - ID of the project
 * @param sortBy - Sort column name (backend field name)
 * @param sortDirection - 'asc' or 'desc'
 */
export const fetchMilestones = async (
  projectId: number | string,
  sortBy?: string,
  sortDirection?: "asc" | "desc"
): Promise<MilestonesListResponse> => {
  let queryString = `q[project_management_id_eq]=${projectId}`;

  // Add sorting if provided
  if (sortBy && sortDirection) {
    queryString +=
      `&order_by=${sortBy}&order_direction=${sortDirection}`;
  }

  const response = await apiRequest(
    "get",
    `/milestones.json?${queryString}`
  );
  return response.data;
};

/**
 * Fetch a single milestone by ID
 */
export const fetchMilestoneById = async (
  milestoneId: number | string
): Promise<Milestone> => {
  const response = await apiRequest(
    "get",
    `/milestones/${milestoneId}.json`
  );
  return response.data.data || response.data;
};

/**
 * Create a new milestone
 */
export const createMilestone = async (
  payload: CreateMilestonePayload
): Promise<Milestone> => {
  const response = await apiRequest(
    "post",
    `/milestones.json`,
    payload
  );
  return response.data.data || response.data;
};

/**
 * Update an existing milestone
 */
export const updateMilestone = async (
  milestoneId: number | string,
  payload: UpdateMilestonePayload
): Promise<Milestone> => {
  const response = await apiRequest(
    "put",
    `/milestones/${milestoneId}.json`,
    payload
  );
  return response.data.data || response.data;
};

/**
 * Change milestone status
 */
export const changeMilestoneStatus = async (
  milestoneId: number | string,
  status: string
): Promise<Milestone> => {
  const response = await apiRequest(
    "patch",
    `/milestones/${milestoneId}.json`,
    {
      milestone: { status },
    }
  );
  return response.data.data || response.data;
};

/**
 * Delete a milestone
 */
export const deleteMilestone = async (
  milestoneId: number | string
): Promise<void> => {
  await apiRequest("delete", `/milestones/${milestoneId}.json`);
};

/**
 * Import milestones from file
 */
export const importMilestones = async (
  file: File
): Promise<any> => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await apiRequest(
    "post",
    `/milestones/import.json`,
    formData,
    { "Content-Type": "multipart/form-data" }
  );
  return response.data;
};
