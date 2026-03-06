import axios from "axios";
import { baseClient } from "@/utils/withoutTokenBase";
import {
  Project,
  ProjectsListResponse,
  CreateProjectPayload,
  UpdateProjectPayload,
} from "@/types/projects";

/**
 * Projects API Service
 * Uses existing axios configuration to avoid duplication
 * Handles all API calls for projects/project management module
 * Follows same token/baseUrl logic as ProjectsDashboard
 */

// Get token from localStorage/sessionStorage (same logic as ProjectsDashboard)
const getToken = () => {
  const mobileToken = sessionStorage.getItem("mobile_token");
  const webToken = localStorage.getItem("token");
  const token = mobileToken || webToken;
  
  if (token) {
    console.log("✅ [API] Token found:", token.substring(0, 20) + "...");
  } else {
    console.warn("⚠️ [API] No token found in sessionStorage or localStorage");
  }
  
  return token;
};

// Get baseUrl
const getBaseUrl = () => {
  const baseUrl = localStorage.getItem("baseUrl") ?? "";
  if (baseUrl) {
    console.log("✅ [API] BaseUrl found:", baseUrl);
  } else {
    console.log("ℹ️ [API] No baseUrl - will use baseClient with dynamic URL resolution");
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
    console.error("❌ [API] No authentication token available");
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
    
    console.log(`📡 [API] ${method.toUpperCase()} ${fullUrl}`, {
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
    
    console.error(`❌ [API] ${method.toUpperCase()} ${url} failed:`, {
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
 * Fetch paginated projects with optional filters and search
 * @param page - Page number (1-indexed)
 * @param filters - Filter string (e.g., "q[status_eq]=active&")
 * @param search - Search term
 * @param sortBy - Sort column name (backend field name from COLUMN_TO_BACKEND_MAP)
 * @param sortDirection - 'asc' or 'desc'
 */
export const fetchProjects = async (
  page = 1,
  filters = "",
  search = "",
  sortBy?: string,
  sortDirection?: "asc" | "desc"
): Promise<ProjectsListResponse> => {
  let queryString = filters;

  // Add search if provided (uses Ransack cont matcher)
  if (search && search.trim()) {
    const searchFilter = `q[title_or_project_type_name_or_project_owner_name_cont]=${encodeURIComponent(
      search.trim()
    )}`;
    queryString += (queryString ? "&" : "") + searchFilter + "&";
  }

  // Add sorting if provided
  if (sortBy && sortDirection) {
    queryString +=
      (queryString ? "&" : "") +
      `order_by=${sortBy}&order_direction=${sortDirection}`;
  }

  // Add pagination
  queryString += (queryString ? "&" : "") + `page=${page}`;

  const response = await apiRequest(
    "get",
    `/project_managements.json?${queryString}`
  );
  return response.data;
};

/**
 * Fetch a single project by ID
 */
export const fetchProjectById = async (
  id: number | string
): Promise<Project> => {
  const response = await apiRequest("get", `/project_managements/${id}.json`);
  return response.data.data || response.data;
};

/**
 * Create a new project
 */
export const createProject = async (
  payload: CreateProjectPayload
): Promise<Project> => {
  const response = await apiRequest(
    "post",
    `/project_managements.json`,
    payload
  );
  return response.data.data || response.data;
};

/**
 * Update an existing project
 */
export const updateProject = async (
  id: number | string,
  payload: UpdateProjectPayload
): Promise<Project> => {
  const response = await apiRequest(
    "put",
    `/project_managements/${id}.json`,
    payload
  );
  return response.data.data || response.data;
};

/**
 * Change project status
 */
export const changeProjectStatus = async (
  id: number | string,
  status: string
): Promise<Project> => {
  const response = await apiRequest(
    "patch",
    `/project_managements/${id}.json`,
    {
      project_management: { status },
    }
  );
  return response.data.data || response.data;
};

/**
 * Delete a project
 */
export const deleteProject = async (id: number | string): Promise<void> => {
  await apiRequest("delete", `/project_managements/${id}.json`);
};

/**
 * Bulk delete projects
 */
export const bulkDeleteProjects = async (ids: number[]): Promise<void> => {
  await apiRequest("post", `/project_managements/bulk_delete.json`, { ids });
};

/**
 * Import projects from file
 */
export const importProjects = async (file: File): Promise<any> => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await apiRequest(
    "post",
    `/project_managements/import.json`,
    formData,
    { "Content-Type": "multipart/form-data" }
  );
  return response.data;
};
