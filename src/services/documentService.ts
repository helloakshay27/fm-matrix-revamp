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
  move_document_ids?: number[];
  copy_document_ids?: number[];
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

export interface FolderChild {
  id: number;
  name: string;
  parent_id: number;
}

export interface FolderDocument {
  id: number;
  title: string;
  folder_id: number;
  category_id: number;
  created_at: string;
  updated_at: string;
  file_size?: number;
  file_type?: string;
  document_category_name?: string;
  created_by_full_name?: string;
  active?: boolean;
  attachment?: {
    file_type?: string;
    file_size?: number;
    preview_url?: string;
  };
}

export interface FolderListItem {
  id: number;
  name: string;
  category_id: number;
  parent_id: number | null;
  of_phase: string | null;
  created_at: string;
  updated_at: string;
  total_file_size: number;
  total_files: number;
  document_category_name: string;
  created_by_full_name: string | null;
  active: boolean | null;
  documents: FolderDocument[];
  childs: FolderChild[];
}

export interface FoldersListResponse {
  folders: FolderListItem[];
  pagination: {
    total_count: number;
    current_page: number;
    total_pages: number;
  };
}

export interface FolderDetailsResponse {
  id: number;
  name: string | null;
  category_id: number;
  parent_id: number | null;
  of_phase: string | null;
  documents: FolderDocument[];
  childs: FolderChild[];
}

export interface CommunityMember {
  id: number;
  user_id: number;
  user: string;
  access_card_number: string | null;
  email: string;
  mobile: string | null;
  gender: string | null;
  organization: string | null;
  designation: string | null;
  address: string | null;
}

export interface Community {
  id: number;
  name: string;
  resource_id: number;
  resource_type: string;
  created_at: string;
  updated_at: string;
  description: string | null;
  active: boolean;
  created_by: string;
  icon: string | null;
  status: string;
  members_count: number;
  reported: boolean;
  reported_count: number;
  all_members: CommunityMember[];
  members: { id: number; user_id: number; user: string }[];
}

export interface CommunitiesResponse {
  communities: Community[];
}

export interface DocumentAttachment {
  id: number;
  relation: string;
  relation_id: number;
  filename: string;
  content_type: string;
  file_size: number;
  created_at: string;
  updated_at: string;
  url: string;
  file_type?: string;
  preview_url?: string;
  uuid?: string | null;
}

export interface Document {
  id: number;
  title: string;
  category_id: number;
  folder_id: number;
  created_at: string;
  document_category_name: string | null;
  created_by_full_name: string | null;
  folder_name: string;
  active: boolean | null;
  created_by_id: number | null;
  attachment: DocumentAttachment;
}

export interface DocumentsResponse {
  documents: Document[];
  pagination: {
    total_count: number;
    current_page: number;
    total_pages: number;
  };
}

export interface DocumentDetailResponse {
  id: number;
  title: string;
  category_id: number;
  folder_id: number;
  created_at: string;
  document_category_name: string | null;
  created_by_full_name: string | null;
  folder_name: string;
  active: boolean | null;
  created_by_id: number | null;
  attachment: DocumentAttachment;
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

export interface UpdateDocumentPayload {
  document: {
    title?: string;
    category_id?: number;
    folder_id?: number;
    attachments?: Array<{
      filename: string;
      content: string;
      content_type: string;
    }>;
  };
  permissions?: FolderPermission[];
}

export interface ShareUser {
  user_type: "internal" | "external";
  user_id: number | null;
  email: string | null;
  access_level: "viewer" | "editor";
}

export interface UnshareUser {
  id: number;
}

export interface ShareDocumentPayload {
  shares: ShareUser[];
  unshare: UnshareUser[];
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

  const response = await axios.get(`https://${baseUrl}/folders.json`, {
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
 * Document filter interface for Ransack queries
 */
export interface DocumentFilters {
  title?: string;
  folderName?: string;
  categoryName?: string;
  createdBy?: string;
  fileName?: string;
  fileType?: string;
  createdDateFrom?: string;
  createdDateTo?: string;
  status?: string;
}

/**
 * Fetch all folders list
 */
export const getFoldersList = async (
  page: number = 1,
  filters?: DocumentFilters
): Promise<FoldersListResponse> => {
  const baseUrl = getBaseUrl();
  const token = getToken();

  // Build Ransack query parameters
  const queryParams: any = { page };

  if (filters) {
    if (filters.title) queryParams["q[name_cont]"] = filters.title;
    if (filters.folderName) queryParams["q[name_cont]"] = filters.folderName;
    if (filters.categoryName)
      queryParams["q[document_category_name_cont]"] = filters.categoryName;
    if (filters.createdBy)
      queryParams["q[created_by_full_name_cont]"] = filters.createdBy;
    if (filters.createdDateFrom)
      queryParams["q[created_at_gteq]"] = filters.createdDateFrom;
    if (filters.createdDateTo)
      queryParams["q[created_at_lteq]"] = filters.createdDateTo;
    if (filters.status === "active") queryParams["q[active_eq]"] = "true";
    if (filters.status === "inactive") queryParams["q[active_eq]"] = "false";
  }

  const response = await axios.get(`https://${baseUrl}/folders.json`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    params: queryParams,
  });

  return response.data;
};

/**
 * Fetch folder details by ID
 */
export const getFolderDetails = async (
  folderId: number
): Promise<FolderDetailsResponse> => {
  const baseUrl = getBaseUrl();
  const token = getToken();

  const response = await axios.get(
    `https://${baseUrl}/folders/${folderId}.json`,
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
 * Fetch all communities
 */
export const getCommunities = async (): Promise<CommunitiesResponse> => {
  const baseUrl = getBaseUrl();
  const token = getToken();

  const response = await axios.get(`https://${baseUrl}/communities.json`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  return response.data;
};

/**
 * Fetch all documents with pagination
 */
export const getDocuments = async (
  page: number = 1
): Promise<DocumentsResponse> => {
  const baseUrl = getBaseUrl();
  const token = getToken();

  const response = await axios.get(
    `https://${baseUrl}/documents.json?page=${page}`,
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
 * Fetch document details by ID
 */
export const getDocumentDetail = async (
  documentId: number
): Promise<Document> => {
  const baseUrl = getBaseUrl();
  const token = getToken();

  const response = await axios.get(
    `https://${baseUrl}/documents/${documentId}.json`,
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
 * Update document by ID
 */
export const updateDocument = async (
  documentId: number,
  payload: UpdateDocumentPayload
): Promise<Document> => {
  const baseUrl = getBaseUrl();
  const token = getToken();

  const response = await axios.put(
    `https://${baseUrl}/documents/${documentId}.json`,
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
 * Delete document by ID
 */
export const deleteDocument = async (documentId: number): Promise<void> => {
  const baseUrl = getBaseUrl();
  const token = getToken();

  await axios.delete(`https://${baseUrl}/documents/${documentId}.json`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
};

/**
 * Delete folder by ID
 */
export const deleteFolder = async (folderId: number): Promise<void> => {
  const baseUrl = getBaseUrl();
  const token = getToken();

  await axios.delete(`https://${baseUrl}/folders/${folderId}.json`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
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

export interface BulkMoveOperation {
  from_folder_id: number;
  to_folder_ids: number[];
  document_ids: number[];
}

export interface BulkCopyOperation {
  from_folder_id: number;
  to_folder_ids: number[];
  document_ids: number[];
}

export interface BulkMoveCopyPayload {
  move?: BulkMoveOperation;
  copy?: BulkCopyOperation;
}

/**
 * Bulk move and/or copy documents between folders
 */
export const bulkMoveCopyDocuments = async (
  payload: BulkMoveCopyPayload
): Promise<{ success: boolean; message: string }> => {
  const baseUrl = getBaseUrl();
  const token = getToken();

  const response = await axios.post(
    `https://${baseUrl}/folders/bulk_move_copy_documents.json`,
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
 * Update document active status
 */
export const updateDocumentStatus = async (
  documentId: number,
  active: boolean
): Promise<Document> => {
  const baseUrl = getBaseUrl();
  const token = getToken();

  const response = await axios.patch(
    `https://${baseUrl}/documents/${documentId}.json`,
    {
      document: {
        active: active,
      },
    },
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
 * Update folder active status
 */
export const updateFolderStatus = async (
  folderId: number,
  active: boolean
): Promise<FolderDetailsResponse> => {
  const baseUrl = getBaseUrl();
  const token = getToken();

  const response = await axios.patch(
    `https://${baseUrl}/folders/${folderId}.json`,
    {
      folder: {
        active: active,
      },
    },
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
 * Update folder details
 */
export const updateFolder = async (
  folderId: number,
  folderData: {
    name?: string;
    category_id?: number;
    parent_id?: number | null;
    active?: boolean;
  },
  permissions?: FolderPermission[]
): Promise<FolderDetailsResponse> => {
  const baseUrl = getBaseUrl();
  const token = getToken();

  const payload: any = {
    folder: folderData,
  };

  if (permissions && permissions.length > 0) {
    payload.permissions = permissions;
  }

  const response = await axios.patch(
    `https://${baseUrl}/folders/${folderId}.json`,
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
 * Share document with users
 */
export const shareDocument = async (
  documentId: number,
  payload: ShareDocumentPayload
): Promise<{ success: boolean; message: string }> => {
  const baseUrl = getBaseUrl();
  const token = getToken();

  const response = await axios.post(
    `https://${baseUrl}/documents/${documentId}/share.json`,
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
