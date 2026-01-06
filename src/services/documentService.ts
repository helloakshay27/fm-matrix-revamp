import axios from "axios";

const getBaseUrl = () => localStorage.getItem("baseUrl") || "";
const getToken = () => localStorage.getItem("token") || "";

export interface Category {
  id: number;
  name: string;
  description: string;
}

export interface Site {
  id: number;
  name: string;
  active: boolean;
  company_id: number;
  region_id: number;
  headquarter_id: number;
  city: string;
  pms_company_setup?: {
    id: number;
    name: string;
  };
  pms_region?: {
    id: number;
    name: string;
    headquarter?: {
      id: number;
      name: string;
    };
  };
  attachfile?: {
    id: number;
    document_file_name: string;
    document_content_type: string;
    document_url: string;
  };
}

export interface SitesResponse {
  sites: Site[];
}

export interface DocumentPayload {
  name: string;
  attachment: string;
  uploaded_by: number;
}

export interface FolderPermission {
  access_level: string;
  scope_type: string;
  scope_ids: number[];
}

export interface CreateFolderPayload {
  folder: {
    name: string;
    category_id: number;
    parent_id?: number;
    of_phase?: string;
  };
  permissions: FolderPermission[];
  documents: DocumentPayload[];
}

export interface Folder {
  id: number;
  name: string;
  category_id?: number;
  parent_id?: number;
  children?: Folder[];
}

export interface FolderTreeResponse {
  folders: Folder[];
}

export interface CreateDocumentPayload {
  document: {
    title: string;
    folder_id?: number;
    category_id: number;
    attachments: Array<{
      filename: string;
      content: string;
      content_type: string;
    }>;
  };
  permissions: FolderPermission[];
}

/**
 * Fetch all categories
 */
export const getCategories = async (): Promise<Category[]> => {
  const baseUrl = getBaseUrl();
  const token = getToken();

  const response = await axios.get(`https://${baseUrl}/categories.json`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  return response.data;
};

/**
 * Fetch all sites
 */
export const getAllSites = async (): Promise<SitesResponse> => {
  const baseUrl = getBaseUrl();
  const token = getToken();

  const response = await axios.get(
    `https://${baseUrl}/pms/sites/all_site_list.json`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );

  return response.data;
};

/**
 * Fetch folders tree
 */
export const getFoldersTree = async (): Promise<FolderTreeResponse> => {
  const baseUrl = getBaseUrl();
  const token = getToken();

  const response = await axios.get(`https://${baseUrl}/folders/tree.json`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  return response.data;
};

/**
 * Create a new folder with permissions and documents
 */
export const createFolder = async (
  payload: CreateFolderPayload
): Promise<unknown> => {
  const baseUrl = getBaseUrl();
  const token = getToken();

  const response = await axios.post(
    `https://${baseUrl}/folders.json`,
    payload,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );

  return response.data;
};

/**
 * Create a new document
 */
export const createDocument = async (
  payload: CreateDocumentPayload
): Promise<unknown> => {
  const baseUrl = getBaseUrl();
  const token = getToken();

  const response = await axios.post(
    `https://${baseUrl}/documents.json`,
    payload,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );

  return response.data;
};

/**
 * Convert file to base64
 */
export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      // Remove the data:image/png;base64, prefix
      const base64 = result.split(",")[1];
      resolve(base64);
    };
    reader.onerror = (error) => reject(error);
  });
};
