import axios from "axios";
import { baseClient } from "@/utils/withoutTokenBase";

interface FetchIssuesParams {
  baseUrl?: string;
  token?: string;
  page?: number;
  filters?: string;
  search?: string;
  sortBy?: string;
  sortDirection?: "asc" | "desc";
}

interface Issue {
  id: string;
  title: string;
  status: string;
  priority: string;
  issue_type?: string;
  assigned_to?: string;
  created_at?: string;
  updated_at?: string;
  [key: string]: any;
}

interface IssuesResponse {
  issues: Issue[];
  pagination?: {
    current_page: number;
    total_count: number;
    total_pages: number;
  };
}

/**
 * Fetch paginated list of issues
 */
export const fetchIssues = async ({
  baseUrl,
  token,
  page = 1,
  filters = "",
  search = "",
  sortBy,
  sortDirection,
}: FetchIssuesParams): Promise<IssuesResponse> => {
  // Build query string
  let queryString = `page=${page}`;

  // Add filters
  if (filters) {
    queryString += `&${filters}`;
  }

  // Add search
  if (search) {
    queryString += `&q[id_or_title_or_project_management_title_cont]=${encodeURIComponent(search)}`;
  }

  // Add sorting
  if (sortBy && sortDirection) {
    queryString += `&q[s]=${sortBy}%20${sortDirection}`;
  }

  try {
    const response = baseUrl
      ? await axios.get(`https://${baseUrl}/issues.json?${queryString}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
      : await baseClient.get(`/issues.json?${queryString}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

    return response.data;
  } catch (error) {
    console.error("Error fetching issues:", error);
    throw error;
  }
};

/**
 * Fetch single issue by ID
 */
export const fetchIssueById = async (
  id: string | number,
  baseUrl?: string,
  token?: string
): Promise<Issue> => {
  try {
    const response = baseUrl
      ? await axios.get(`https://${baseUrl}/issues/${id}.json`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
      : await baseClient.get(`/issues/${id}.json`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

    return response.data.issue;
  } catch (error) {
    console.error(`Error fetching issue ${id}:`, error);
    throw error;
  }
};

/**
 * Update issue
 */
export const updateIssueApi = async (
  id: string | number,
  data: Partial<Issue>,
  baseUrl?: string,
  token?: string
): Promise<Issue> => {
  try {
    const response = baseUrl
      ? await axios.patch(
          `https://${baseUrl}/issues/${id}.json`,
          { issue: data },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
      : await baseClient.patch(`/issues/${id}.json`, { issue: data }, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

    return response.data.issue || response.data;
  } catch (error) {
    console.error(`Error updating issue ${id}:`, error);
    throw error;
  }
};

/**
 * Import issues from file
 */
export const importIssuesApi = async (
  file: File,
  baseUrl?: string,
  token?: string
): Promise<any> => {
  try {
    const formData = new FormData();
    formData.append("file", file);

    const response = baseUrl
      ? await axios.post(
          `https://${baseUrl}/issues/import_issues.json`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
      : await baseClient.post(`/issues/import_issues.json`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

    return response.data;
  } catch (error) {
    console.error("Error importing issues:", error);
    throw error;
  }
};

/**
 * Download sample file
 */
export const downloadSampleIssueFile = async (
  baseUrl?: string,
  token?: string
): Promise<Blob> => {
  try {
    const response = baseUrl
      ? await axios.get(
          `https://${baseUrl}/assets/sample_issue.xlsx`,
          {
            responseType: "blob",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
      : await baseClient.get(`/assets/sample_issue.xlsx`, {
          responseType: "blob",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

    return response.data;
  } catch (error) {
    console.error("Error downloading sample file:", error);
    throw error;
  }
};
