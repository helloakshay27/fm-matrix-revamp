import axios from "axios";
import { baseClient } from "@/utils/withoutTokenBase";
import {
  Task,
  TasksListResponse,
  CreateTaskPayload,
  UpdateTaskPayload,
  ChangeTaskStatusPayload,
} from "@/types/tasks";

/**
 * Tasks API Service
 * Uses existing axios configuration to avoid duplication
 * Handles all API calls for tasks/task management module
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
  headers?: Record<string, string>,
  params?: Record<string, any>
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
      ...(params && { params }),
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
 * Fetch paginated tasks with optional filters
 * @param page - Page number (1-indexed)
 * @param filters - Filter object with Ransack query format (e.g., { q[status_eq]: "open" })
 * @param sortBy - Sort column name (backend field name from COLUMN_TO_BACKEND_MAP)
 * @param sortDirection - 'asc' or 'desc'
 */
export const fetchTasks = async (
  page = 1,
  filters: Record<string, any> = {},
  sortBy?: string,
  sortDirection?: "asc" | "desc"
): Promise<TasksListResponse> => {
  const params: Record<string, any> = {
    page,
    ...filters,
  };

  // Add sorting if provided
  if (sortBy && sortDirection) {
    params.order_by = sortBy;
    params.order_direction = sortDirection;
  }

  const response = await apiRequest("get", `/task_managements.json`, undefined, undefined, params);
  return response.data;
};

/**
 * Fetch "My Tasks" with pagination and filters
 */
export const fetchMyTasks = async (
  page = 1,
  filters: Record<string, any> = {},
  sortBy?: string,
  sortDirection?: "asc" | "desc"
): Promise<TasksListResponse> => {
  const params: Record<string, any> = {
    page,
    ...filters,
  };

  // Add sorting if provided
  if (sortBy && sortDirection) {
    params.order_by = sortBy;
    params.order_direction = sortDirection;
  }

  const response = await apiRequest("get", `/task_managements/my_tasks.json`, undefined, undefined, params);
  return response.data;
};

/**
 * Fetch a single task by ID
 */
export const fetchTaskById = async (
  id: number | string
): Promise<Task> => {
  const response = await apiRequest("get", `/task_managements/${id}.json`);
  return response.data.data || response.data;
};

/**
 * Create a new task
 */
export const createTask = async (
  payload: CreateTaskPayload
): Promise<Task> => {
  const response = await apiRequest(
    "post",
    `/task_managements.json`,
    payload
  );
  return response.data.data || response.data;
};

/**
 * Update an existing task
 */
export const updateTask = async (
  id: number | string,
  payload: UpdateTaskPayload
): Promise<Task> => {
  const response = await apiRequest(
    "put",
    `/task_managements/${id}.json`,
    payload
  );
  return response.data.data || response.data;
};

/**
 * Change task status
 */
export const changeTaskStatus = async (
  id: number | string,
  status: string
): Promise<Task> => {
  const response = await apiRequest(
    "patch",
    `/task_managements/${id}.json`,
    {
      task_management: { status },
    }
  );
  return response.data.data || response.data;
};

/**
 * Update task completion percentage
 */
export const updateTaskCompletion = async (
  id: number | string,
  completionPercent: number
): Promise<Task> => {
  const response = await apiRequest(
    "patch",
    `/task_managements/${id}.json`,
    {
      task_management: { completion_percent: completionPercent },
    }
  );
  return response.data.data || response.data;
};

/**
 * Delete a task
 */
export const deleteTask = async (id: number | string): Promise<void> => {
  await apiRequest("delete", `/task_managements/${id}.json`);
};

/**
 * Import tasks from file
 */
export const importTasks = async (file: File): Promise<any> => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await apiRequest(
    "post",
    `/task_managements/import.json`,
    formData,
    { "Content-Type": "multipart/form-data" }
  );
  return response.data;
};
