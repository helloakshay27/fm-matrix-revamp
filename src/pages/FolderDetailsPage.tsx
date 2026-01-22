import React, { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import {
  ArrowLeft,
  Eye,
  MoreVertical,
  FileText,
  Trash2,
  Edit,
  FolderIcon,
  Share2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DocumentEnhancedTable } from "@/components/document/DocumentEnhancedTable";
import { ColumnConfig } from "@/hooks/useEnhancedTable";
import { AssetSelectionPanel } from "@/components/AssetSelectionPanel";
import { DocumentActionPanel } from "@/components/document/DocumentActionPanel";
import {
  getFolderDetails,
  FolderDetailsResponse,
  bulkMoveCopyDocuments,
  deleteDocument,
  deleteFolder,
  shareDocument,
  ShareDocumentPayload,
  getDocumentDetail,
  createDocument,
  getCategories,
  CreateDocumentPayload,
  FolderPermission,
  Category,
} from "@/services/documentService";
import { FileIcon } from "@/components/document/FileIcon";
import { BulkMoveDialog } from "@/components/document/BulkMoveDialog";
import { DocumentSelectionPanel } from "@/components/document/DocumentSelectionPanel";
import { DocumentShareModal } from "@/components/document/DocumentShareModal";
import { toast } from "sonner";

interface FolderItem {
  id: number;
  folder_title: string;
  type: "file" | "folder";
  category: string;
  format?: string;
  size: string;
  document_count: number;
  status: "Active" | "Inactive";
  created_by: string;
  created_date: string;
  modified_date?: string;
  preview_url?: string;
  public_uuid?: string | null;
  document_users?: Array<{
    id: number;
    user_type: "internal" | "external";
    user_id: number | null;
    email: string | null;
    access_level: "viewer" | "editor";
    status: string;
    invited_by_id: number;
    user_name: string;
  }>;
}

const mockFolderItems: FolderItem[] = [
  {
    id: 1,
    folder_title: "Lease Agreement",
    type: "file",
    category: "Lease / Legal",
    format: "PDF",
    size: "1.2 MB",
    document_count: 1,
    status: "Active",
    created_by: "Rohan Desai",
    created_date: "08 Jan 2025",
  },
  {
    id: 2,
    folder_title: "Fire Safety Drill Report",
    type: "file",
    category: "Safety & Compliance",
    format: "DOCX",
    size: "320 KB",
    document_count: 1,
    status: "Active",
    created_by: "Priya Kulkarni",
    created_date: "15 Dec 2024",
  },
  {
    id: 3,
    folder_title: "Visitor Pass Template",
    type: "file",
    category: "Templates",
    format: "PDF",
    size: "450 KB",
    document_count: 1,
    status: "Active",
    created_by: "Admin System",
    created_date: "22 Nov 2024",
  },
  {
    id: 4,
    folder_title: "Maintenance Work Order",
    type: "file",
    category: "Maintenance",
    format: "XLSX",
    size: "780 KB",
    document_count: 1,
    status: "Active",
    created_by: "Mahesh Patil",
    created_date: "05 Jan 2025",
  },
  {
    id: 5,
    folder_title: "Sub Folder 1",
    type: "folder",
    category: "Lease / Legal",
    size: "45 MB",
    document_count: 12,
    status: "Active",
    created_by: "John Doe",
    created_date: "10 Dec 2024",
  },
  {
    id: 6,
    folder_title: "Sub Folder 2",
    type: "folder",
    category: "Safety & Compliance",
    size: "12 MB",
    document_count: 5,
    status: "Active",
    created_by: "Jane Smith",
    created_date: "18 Nov 2024",
  },
];

const columns: ColumnConfig[] = [
  {
    key: "folder_title",
    label: "Title",
    sortable: true,
    hideable: true,
    draggable: true,
  },
  {
    key: "category",
    label: "Category",
    sortable: true,
    hideable: true,
    draggable: true,
  },
  {
    key: "document_count",
    label: "Document Count",
    sortable: true,
    hideable: true,
    draggable: true,
  },
  {
    key: "format",
    label: "Format",
    sortable: true,
    hideable: true,
    draggable: true,
  },
  {
    key: "size",
    label: "Size",
    sortable: true,
    hideable: true,
    draggable: true,
  },
  {
    key: "status",
    label: "Status",
    sortable: true,
    hideable: true,
    draggable: true,
  },
  {
    key: "created_by",
    label: "Created By",
    sortable: true,
    hideable: true,
    draggable: true,
  },
  {
    key: "created_date",
    label: "Created Date",
    sortable: true,
    hideable: true,
    draggable: true,
  },
];

export const FolderDetailsPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams<{ id: string }>();
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [showActionPanel, setShowActionPanel] = useState(false);
  const [showMoveDialog, setShowMoveDialog] = useState(false);
  const [showCopyDialog, setShowCopyDialog] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedDocumentForShare, setSelectedDocumentForShare] = useState<
    number | null
  >(null);
  const [operationType, setOperationType] = useState<"move" | "copy">("move");

  // Check if this is a file list view (not folder list)
  const isFileListView = location.pathname.includes("/folder/");
  const [folderData, setFolderData] = useState<FolderDetailsResponse | null>(
    null
  );
  const [folderItems, setFolderItems] = useState<FolderItem[]>([]);
  const [loading, setLoading] = useState(true);

  const hostname = window.location.hostname;
  const isPulseSite =
    hostname.includes("pulse.lockated.com") || hostname.includes("localhost");

  const folderName = folderData?.name || "Folder Details";

  // Fetch categories on mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoriesData = await getCategories();
        setCategories(categoriesData);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

  // Handle creating a blank PDF document
  const handleAddPdf = async () => {
    setIsCreating(true);
    try {
      // Generate random title for the blank PDF
      const randomTitle = `PDF_${Date.now()}`;

      // Fetch blank.pdf from public folder
      const response = await fetch("/blank.pdf");
      const pdfBlob = await response.blob();

      // Convert PDF blob to base64
      const reader = new FileReader();
      const pdfBase64 = await new Promise<string>((resolve, reject) => {
        reader.onload = () => {
          const result = reader.result as string;
          const base64String = result.split(",")[1]; // Remove data:application/pdf;base64, prefix
          resolve(base64String);
        };
        reader.onerror = reject;
        reader.readAsDataURL(pdfBlob);
      });

      // Create payload with blank PDF attachment
      const permissions: FolderPermission[] = [
        {
          access_level: "all",
          access_to: "Pms::Site",
          access_ids: [],
        },
        {
          access_level: "all",
          access_to: "Community",
          access_ids: [],
        },
      ];

      const payload: CreateDocumentPayload = {
        document: {
          title: randomTitle,
          folder_id: id ? parseInt(id) : undefined,
          category_id: categories[0]?.id || 1,
          shares: [],
          attachments: [
            {
              filename: "document.pdf",
              content: `data:application/pdf;base64,${pdfBase64}`,
              content_type: "application/pdf",
            },
          ],
        },
        permissions,
      };

      const createResponse = await createDocument(payload);

      // Extract document ID from response and redirect to editor
      const documentId = (createResponse as any)?.attachment?.id;

      if (documentId) {
        toast.success("Blank PDF created! Opening editor...");
        navigate(`/maintenance/documents/editor/${documentId}`);
      } else {
        toast.error(
          "Document created but could not open editor. Please try again."
        );
        navigate("/maintenance/documents");
      }
    } catch (error: unknown) {
      console.error("Error creating blank PDF:", error);
      const err = error as {
        response?: { data?: { message?: string } };
        message?: string;
      };
      const errorMessage =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to create blank PDF. Please try again.";
      toast.error(errorMessage);
    } finally {
      setIsCreating(false);
    }
  };

  const handleAddDoc = async () => {
    setIsCreating(true);
    try {
      // Generate random title for the blank PDF
      const randomTitle = `Doc_${Date.now()}`;

      // Fetch blank.pdf from public folder
      const response = await fetch("/blank.docx");
      const pdfBlob = await response.blob();

      // Convert PDF blob to base64
      const reader = new FileReader();
      const pdfBase64 = await new Promise<string>((resolve, reject) => {
        reader.onload = () => {
          const result = reader.result as string;
          const base64String = result.split(",")[1]; // Remove data:application/pdf;base64, prefix
          resolve(base64String);
        };
        reader.onerror = reject;
        reader.readAsDataURL(pdfBlob);
      });

      // Create payload with blank PDF attachment
      const permissions: FolderPermission[] = [
        {
          access_level: "all",
          access_to: "Pms::Site",
          access_ids: [],
        },
        {
          access_level: "all",
          access_to: "Community",
          access_ids: [],
        },
      ];

      const payload: CreateDocumentPayload = {
        document: {
          title: randomTitle,
          folder_id: id ? parseInt(id) : undefined,
          category_id: categories[0]?.id || 1,
          shares: [],
          attachments: [
            {
              filename: "document.docx",
              content: `data:application/vnd.openxmlformats-officedocument.wordprocessingml.document;base64,${pdfBase64}`,
              content_type:
                "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            },
          ],
        },
        permissions,
      };

      const createResponse = await createDocument(payload);

      // Extract document ID from response and redirect to editor
      const documentId = (createResponse as any)?.attachment?.id;

      if (documentId) {
        toast.success("Blank PDF created! Opening editor...");
        navigate(`/maintenance/documents/editor/${documentId}`);
      } else {
        toast.error(
          "Document created but could not open editor. Please try again."
        );
        navigate("/maintenance/documents");
      }
    } catch (error: unknown) {
      console.error("Error creating blank PDF:", error);
      const err = error as {
        response?: { data?: { message?: string } };
        message?: string;
      };
      const errorMessage =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to create blank PDF. Please try again.";
      toast.error(errorMessage);
    } finally {
      setIsCreating(false);
    }
  };

  const handleAddSheet = async () => {
    setIsCreating(true);
    try {
      // Generate random title for the blank PDF
      const randomTitle = `Sheet_${Date.now()}`;

      // Fetch blank.pdf from public folder
      const response = await fetch("/black.xlsx");
      const pdfBlob = await response.blob();

      // Convert PDF blob to base64
      const reader = new FileReader();
      const pdfBase64 = await new Promise<string>((resolve, reject) => {
        reader.onload = () => {
          const result = reader.result as string;
          const base64String = result.split(",")[1]; // Remove data:application/pdf;base64, prefix
          resolve(base64String);
        };
        reader.onerror = reject;
        reader.readAsDataURL(pdfBlob);
      });

      // Create payload with blank PDF attachment
      const permissions: FolderPermission[] = [
        {
          access_level: "all",
          access_to: "Pms::Site",
          access_ids: [],
        },
        {
          access_level: "all",
          access_to: "Community",
          access_ids: [],
        },
      ];

      const payload: CreateDocumentPayload = {
        document: {
          title: randomTitle,
          folder_id: id ? parseInt(id) : undefined,
          category_id: categories[0]?.id || 1,
          shares: [],
          attachments: [
            {
              filename: "document.xlsx",
              content: `data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,${pdfBase64}`,
              content_type:
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            },
          ],
        },
        permissions,
      };

      const createResponse = await createDocument(payload);

      // Extract document ID from response and redirect to editor
      const documentId = (createResponse as any)?.attachment?.id;

      if (documentId) {
        toast.success("Blank PDF created! Opening editor...");
        navigate(`/maintenance/documents/editor/${documentId}`);
      } else {
        toast.error(
          "Document created but could not open editor. Please try again."
        );
        navigate("/maintenance/documents");
      }
    } catch (error: unknown) {
      console.error("Error creating blank PDF:", error);
      const err = error as {
        response?: { data?: { message?: string } };
        message?: string;
      };
      const errorMessage =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to create blank PDF. Please try again.";
      toast.error(errorMessage);
    } finally {
      setIsCreating(false);
    }
  };

  const handleAddPpt = async () => {
    setIsCreating(true);
    try {
      // Generate random title for the blank PDF
      const randomTitle = `Presentation_${Date.now()}`;

      // Fetch blank.pdf from public folder
      const response = await fetch("/blank.pptx");
      const pdfBlob = await response.blob();

      // Convert PDF blob to base64
      const reader = new FileReader();
      const pdfBase64 = await new Promise<string>((resolve, reject) => {
        reader.onload = () => {
          const result = reader.result as string;
          const base64String = result.split(",")[1]; // Remove data:application/pdf;base64, prefix
          resolve(base64String);
        };
        reader.onerror = reject;
        reader.readAsDataURL(pdfBlob);
      });

      // Create payload with blank PDF attachment
      const permissions: FolderPermission[] = [
        {
          access_level: "all",
          access_to: "Pms::Site",
          access_ids: [],
        },
        {
          access_level: "all",
          access_to: "Community",
          access_ids: [],
        },
      ];

      const payload: CreateDocumentPayload = {
        document: {
          title: randomTitle,
          folder_id: id ? parseInt(id) : undefined,
          category_id: categories[0]?.id || 1,
          shares: [],
          attachments: [
            {
              filename: "document.pptx",
              content: `data:application/vnd.openxmlformats-officedocument.presentationml.presentation;base64,${pdfBase64}`,
              content_type:
                "application/vnd.openxmlformats-officedocument.presentationml.presentation",
            },
          ],
        },
        permissions,
      };

      const createResponse = await createDocument(payload);

      // Extract document ID from response and redirect to editor
      const documentId = (createResponse as any)?.attachment?.id;

      if (documentId) {
        toast.success("Blank PDF created! Opening editor...");
        navigate(`/maintenance/documents/editor/${documentId}`);
      } else {
        toast.error(
          "Document created but could not open editor. Please try again."
        );
        navigate("/maintenance/documents");
      }
    } catch (error: unknown) {
      console.error("Error creating blank PDF:", error);
      const err = error as {
        response?: { data?: { message?: string } };
        message?: string;
      };
      const errorMessage =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to create blank PDF. Please try again.";
      toast.error(errorMessage);
    } finally {
      setIsCreating(false);
    }
  };

  // Fetch folder details
  useEffect(() => {
    const fetchFolderDetails = async () => {
      if (!id) return;

      setLoading(true);
      try {
        const response = await getFolderDetails(parseInt(id));
        setFolderData(response);

        // Transform child folders and documents to FolderItem[]
        const items: FolderItem[] = [
          // Add child folders (if they exist)
          ...(response.childs || []).map((child) => ({
            id: child.id,
            folder_title: child.name,
            type: "folder" as const,
            category: response.name || "Uncategorized",
            size: "0 B",
            document_count: 0,
            status: "Active" as const,
            created_by: "Unknown",
            created_date: new Date().toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            }),
          })),
          // Add documents
          ...(response.documents || []).map((doc) => ({
            id: doc.id,
            folder_title: doc.title,
            type: "file" as const,
            category:
              doc.document_category_name || response.name || "Uncategorized",
            format: doc.attachment?.file_type?.toUpperCase() || "PDF",
            size: formatFileSize(doc.attachment?.file_size || 0),
            document_count: 1,
            status: doc.active ? ("Active" as const) : ("Inactive" as const),
            created_by: doc.created_by_full_name || "Unknown",
            created_date: formatDate(doc.created_at),
            modified_date: doc.updated_at
              ? formatDate(doc.updated_at)
              : undefined,
            preview_url: doc.attachment?.preview_url,
            public_uuid: doc.public_uuid,
            document_users: doc.document_users || [],
          })),
        ];

        // Filter to only show files if in file list view
        const filteredItems = isFileListView
          ? items.filter((item) => item.type === "file")
          : items;
        setFolderItems(filteredItems);
      } catch (error) {
        console.error("Error fetching folder details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFolderDetails();
  }, [id, isFileListView]);

  // Helper function to format file size
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i)) + " " + sizes[i];
  };

  // Helper function to format date
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = {
      day: "2-digit",
      month: "short",
      year: "numeric",
    };
    return date.toLocaleDateString("en-GB", options);
  };

  const handleViewItem = (itemId: string) => {
    const item = folderItems.find((i) => i.id.toString() === itemId);
    if (item?.type === "folder") {
      navigate(`/maintenance/documents/folder/${itemId}`);
    } else {
      // For pulse clients, open preview_url directly; otherwise use handlePreview
      const doc = folderData?.documents?.find(
        (d) => d.id.toString() === itemId
      );
      if (isPulseSite && doc?.attachment?.preview_url) {
        window.open(doc.attachment.preview_url, "_blank");
      } else {
        handlePreview(itemId);
      }
    }
  };

  const handlePreview = (itemId: string) => {
    const item = folderItems.find((i) => i.id.toString() === itemId);
    if (item) {
      // Get the document from folderData to access attachment
      const doc = folderData?.documents?.find(
        (d) => d.id.toString() === itemId
      );
      if (doc?.attachment) {
        // For pulse clients, open preview_url in new tab; otherwise navigate to editor
        if (isPulseSite && doc.attachment.preview_url) {
          window.open(doc.attachment.preview_url, "_blank");
        } else if (doc.attachment.id) {
          navigate(`/maintenance/documents/editor/${doc.attachment.id}`);
        } else {
          toast.error("Document attachment not found");
        }
      } else {
        toast.error("Document attachment not found");
      }
    }
  };

  const handleOpenDetail = (itemId: string) => {
    navigate(`/maintenance/documents/details/${itemId}`);
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedItems(folderItems.map((item) => item.id.toString()));
    } else {
      setSelectedItems([]);
    }
  };

  const handleSelectItem = (itemId: string, checked: boolean) => {
    if (checked) {
      setSelectedItems((prev) => [...prev, itemId]);
    } else {
      setSelectedItems((prev) => prev.filter((id) => id !== itemId));
    }
  };

  const handleUpdate = (itemId?: string) => {
    if (itemId) {
      // Update single item
      const item = folderItems.find((i) => i.id.toString() === itemId);
      if (item?.type === "folder") {
        navigate(`/maintenance/documents/folder/edit/${itemId}`);
      } else {
        navigate(`/maintenance/documents/edit/${itemId}`);
      }
    } else {
      // Update multiple selected items
      if (selectedItems.length === 0) {
        toast.error("Please select at least one item to update");
        return;
      }
      if (selectedItems.length === 1) {
        const item = folderItems.find(
          (i) => i.id.toString() === selectedItems[0]
        );
        if (item?.type === "folder") {
          navigate(`/maintenance/documents/folder/edit/${selectedItems[0]}`);
        } else {
          navigate(`/maintenance/documents/edit/${selectedItems[0]}`);
        }
      } else {
        toast.info("Please select only one item to update");
      }
    }
  };

  const handleDelete = async (itemId?: string) => {
    const itemsToDelete = itemId ? [itemId] : selectedItems;

    if (itemsToDelete.length === 0) {
      toast.error("Please select at least one item to delete");
      return;
    }

    if (
      !window.confirm(
        `Are you sure you want to delete ${itemsToDelete.length} item(s)? This action cannot be undone.`
      )
    ) {
      return;
    }

    try {
      // Delete each item
      const deletePromises = itemsToDelete.map(async (id) => {
        const item = folderItems.find((i) => i.id.toString() === id);
        if (item?.type === "folder") {
          await deleteFolder(parseInt(id));
        } else {
          await deleteDocument(parseInt(id));
        }
      });

      await Promise.all(deletePromises);

      toast.success(`Successfully deleted ${itemsToDelete.length} item(s)`);

      // Clear selection
      if (!itemId) {
        setSelectedItems([]);
      }

      // Refresh folder contents
      if (id) {
        const response = await getFolderDetails(parseInt(id));
        setFolderData(response);

        const items: FolderItem[] = [
          ...(response.childs || []).map((child) => ({
            id: child.id,
            folder_title: child.name,
            type: "folder" as const,
            category: response.name || "Uncategorized",
            size: "0 B",
            document_count: 0,
            status: "Active" as const,
            created_by: "Unknown",
            created_date: new Date().toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            }),
          })),
          ...(response.documents || []).map((doc) => ({
            id: doc.id,
            folder_title: doc.title,
            type: "file" as const,
            category:
              doc.document_category_name || response.name || "Uncategorized",
            format: doc.attachment?.file_type?.toUpperCase() || "PDF",
            size: formatFileSize(doc.attachment?.file_size || 0),
            document_count: 1,
            status: doc.active ? ("Active" as const) : ("Inactive" as const),
            created_by: doc.created_by_full_name || "Unknown",
            created_date: formatDate(doc.created_at),
            modified_date: doc.updated_at
              ? formatDate(doc.updated_at)
              : undefined,
            preview_url: doc.attachment?.preview_url,
          })),
        ];

        const filteredItems = isFileListView
          ? items.filter((item) => item.type === "file")
          : items;
        setFolderItems(filteredItems);
      }
    } catch (error) {
      console.error("Error deleting items:", error);
      toast.error("Failed to delete items. Please try again.");
    }
  };

  const handleClearSelection = () => {
    setSelectedItems([]);
  };

  const handleMove = () => {
    if (selectedItems.length === 0) {
      toast.error("Please select at least one document");
      return;
    }
    setOperationType("move");
    setShowMoveDialog(true);
  };

  const handleCopy = () => {
    if (selectedItems.length === 0) {
      toast.error("Please select at least one document");
      return;
    }
    setOperationType("copy");
    setShowCopyDialog(true);
  };

  const handleBulkMoveConfirm = async (targetFolderIds: number[]) => {
    if (!id) return;

    const documentIds = selectedItems
      .map((itemId) => {
        const item = folderItems.find((i) => i.id.toString() === itemId);
        return item?.type === "file" ? parseInt(itemId) : null;
      })
      .filter((docId): docId is number => docId !== null);

    if (documentIds.length === 0) {
      toast.error("No documents selected for move operation");
      return;
    }

    try {
      const payload: any = {};

      if (operationType === "move") {
        payload.move = {
          from_folder_id: parseInt(id),
          to_folder_ids: targetFolderIds,
          document_ids: documentIds,
        };
      } else {
        payload.copy = {
          from_folder_id: parseInt(id),
          to_folder_ids: targetFolderIds,
          document_ids: documentIds,
        };
      }

      await bulkMoveCopyDocuments(payload);

      toast.success(
        `Successfully ${operationType === "move" ? "moved" : "copied"} ${documentIds.length} document${documentIds.length !== 1 ? "s" : ""}`
      );

      // Refresh folder contents
      const response = await getFolderDetails(parseInt(id));
      setFolderData(response);

      // Transform data
      const items: FolderItem[] = [
        ...response.childs.map((child) => ({
          id: child.id,
          folder_title: child.name,
          type: "folder" as const,
          category: response.name || "Uncategorized",
          size: "0 B",
          document_count: 0,
          status: "Active" as const,
          created_by: "Unknown",
          created_date: new Date().toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          }),
        })),
        ...response.documents.map((doc) => ({
          id: doc.id,
          folder_title: doc.title,
          type: "file" as const,
          category: response.name || "Uncategorized",
          format: doc.file_type?.toUpperCase() || "PDF",
          size: formatFileSize(doc.file_size || 0),
          document_count: 1,
          status: "Active" as const,
          created_by: "Unknown",
          created_date: formatDate(doc.created_at),
          modified_date: doc.updated_at
            ? formatDate(doc.updated_at)
            : undefined,
        })),
      ];

      setFolderItems(items);
      setSelectedItems([]);
      setShowMoveDialog(false);
      setShowCopyDialog(false);
    } catch (error) {
      console.error(
        `Error ${operationType === "move" ? "moving" : "copying"} documents:`,
        error
      );
      toast.error(`Failed to ${operationType} documents`);
    }
  };

  const handleShare = (itemId?: string) => {
    if (itemId) {
      // Share single document
      const item = folderItems.find((i) => i.id.toString() === itemId);
      if (item?.type === "file") {
        setSelectedDocumentForShare(item.id);
        setShowShareModal(true);
      } else {
        toast.error("Only documents can be shared");
      }
    } else {
      // Share selected documents
      const fileItems = folderItems.filter(
        (item) =>
          selectedItems.includes(item.id.toString()) && item.type === "file"
      );

      if (fileItems.length === 0) {
        toast.error("Please select at least one document to share");
        return;
      }

      if (fileItems.length === 1) {
        setSelectedDocumentForShare(fileItems[0].id);
        setShowShareModal(true);
      } else {
        toast.info("Please select only one document to share at a time");
      }
    }
  };

  const handleSaveShares = async (
    shares: Array<{
      id: string;
      user_type: "internal" | "external";
      user_id: number | null;
      email: string | null;
      full_name?: string;
      access_level: "viewer" | "editor";
    }>
  ) => {
    if (!selectedDocumentForShare) return;

    try {
      // Get the selected document to access existing shares
      const selectedDoc = folderItems.find(
        (item) => item.id === selectedDocumentForShare
      );
      const existingShares = selectedDoc?.document_users || [];
      const existingShareIds = existingShares.map((s) => s.id.toString());

      // Identify new shares
      const newShares = shares
        .filter((share) => !existingShareIds.includes(share.id))
        .map((share) => ({
          user_type: share.user_type,
          user_id: share.user_id,
          email: share.email,
          access_level: share.access_level,
        }));

      // Identify removed shares
      const currentShareIds = shares.map((s) => s.id);
      const removedShares = existingShares
        .filter((existing) => !currentShareIds.includes(existing.id.toString()))
        .map((existing) => ({ id: existing.id }));

      // Build payload
      const payload: ShareDocumentPayload = {
        shares: newShares,
        unshare: removedShares,
      };

      // Call API
      await shareDocument(selectedDocumentForShare, payload);
      toast.success("Document shares updated successfully");

      // Refresh document data
      if (id) {
        const response = await getFolderDetails(parseInt(id));
        setFolderData(response);

        const items: FolderItem[] = [
          ...(response.childs || []).map((child) => ({
            id: child.id,
            folder_title: child.name,
            type: "folder" as const,
            category: response.name || "Uncategorized",
            size: "0 B",
            document_count: 0,
            status: "Active" as const,
            created_by: "Unknown",
            created_date: new Date().toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            }),
          })),
          ...(response.documents || []).map((doc) => ({
            id: doc.id,
            folder_title: doc.title,
            type: "file" as const,
            category:
              doc.document_category_name || response.name || "Uncategorized",
            format: doc.attachment?.file_type?.toUpperCase() || "PDF",
            size: formatFileSize(doc.attachment?.file_size || 0),
            document_count: 1,
            status: doc.active ? ("Active" as const) : ("Inactive" as const),
            created_by: doc.created_by_full_name || "Unknown",
            created_date: formatDate(doc.created_at),
            modified_date: doc.updated_at
              ? formatDate(doc.updated_at)
              : undefined,
            preview_url: doc.attachment?.preview_url,
            public_uuid: doc.public_uuid,
            document_users: doc.document_users || [],
          })),
        ];

        const filteredItems = isFileListView
          ? items.filter((item) => item.type === "file")
          : items;
        setFolderItems(filteredItems);
      }

      setShowShareModal(false);
      setSelectedDocumentForShare(null);
    } catch (error) {
      console.error("Error updating shares:", error);
      toast.error("Failed to update document shares");
    }
  };

  // Convert selected items for AssetSelectionPanel
  const selectedItemObjects = folderItems
    .filter((item) => selectedItems.includes(item.id.toString()))
    .map((item) => ({
      id: item.id.toString(),
      name: item.folder_title,
    }));

  const renderCell = (item: FolderItem, columnKey: string) => {
    switch (columnKey) {
      case "actions":
        return (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleViewItem(item.id.toString())}
            className="p-1 h-8 w-8"
          >
            <Eye className="w-4 h-4 text-[#C72030]" />
          </Button>
        );
      case "folder_title":
        return (
          <div className="flex items-center gap-2">
            <FileIcon
              fileName={item.folder_title}
              isFolder={item.type === "folder"}
              className="w-5 h-5"
            />
            <span className="font-medium">{item.folder_title}</span>
          </div>
        );
      case "format":
        return <span>{item.format || "PDF"}</span>;
      case "document_count":
        return <span className="font-medium">{item.document_count}</span>;
      default:
        return item[columnKey as keyof FolderItem];
    }
  };

  const renderActions = (item: FolderItem) => {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="p-1 h-8 w-8">
            <MoreVertical className="w-4 h-4 text-gray-600" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          {!isPulseSite && (
            <DropdownMenuItem onClick={() => handlePreview(item.id.toString())}>
              <Eye className="w-4 h-4 mr-2" />
              Preview
            </DropdownMenuItem>
          )}
          <DropdownMenuItem
            onClick={() => handleOpenDetail(item.id.toString())}
          >
            <FileText className="w-4 h-4 mr-2" />
            Open in Detail
          </DropdownMenuItem>
          {item.type === "file" && !isPulseSite && (
            <DropdownMenuItem onClick={() => handleShare(item.id.toString())}>
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </DropdownMenuItem>
          )}
          <DropdownMenuItem onClick={() => handleUpdate(item.id.toString())}>
            <Edit className="w-4 h-4 mr-2" />
            Update
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => handleDelete(item.id.toString())}
            className="text-red-600 focus:text-red-600"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/maintenance/documents")}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div>
            <div className="text-sm text-gray-500">Documents &gt; Folders</div>
            <h1 className="text-2xl font-bold text-[#1a1a1a]">{folderName}</h1>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="w-full p-6">
        {/* Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 relative">
          {/* Render View based on mode */}
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="text-gray-500">Loading folder contents...</div>
            </div>
          ) : (
            <DocumentEnhancedTable
              documents={folderItems}
              columns={columns}
              renderCell={renderCell}
              renderActions={renderActions}
              onViewDetails={(itemId) => handleViewItem(itemId.toString())}
              onFilterOpen={() => {}}
              onActionClick={() => setShowActionPanel(true)}
              selectedItems={selectedItems}
              onSelectionChange={setSelectedItems}
            />
          )}

          {/* Document Selection Panel */}
          <DocumentSelectionPanel
            selectedItems={selectedItems}
            selectedDocuments={folderItems
              .filter((item) => selectedItems.includes(item.id.toString()))
              .map((item) => ({
                id: item.id,
                folder_title: item.folder_title,
              }))}
            onUpdate={() => handleUpdate()}
            onDelete={() => handleDelete()}
            onMove={handleMove}
            onCopy={handleCopy}
            onShare={!isPulseSite ? () => handleShare() : undefined}
            onClearSelection={handleClearSelection}
          />
        </div>
      </div>

      {/* Bulk Move Dialog */}
      <BulkMoveDialog
        isOpen={showMoveDialog}
        onClose={() => setShowMoveDialog(false)}
        operationType="move"
        selectedDocumentIds={selectedItems
          .map((itemId) => {
            const item = folderItems.find((i) => i.id.toString() === itemId);
            return item?.type === "file" ? item.id : null;
          })
          .filter((docId): docId is number => docId !== null)}
        sourceFolderId={id ? parseInt(id) : undefined}
        onConfirm={handleBulkMoveConfirm}
      />

      {/* Bulk Copy Dialog */}
      <BulkMoveDialog
        isOpen={showCopyDialog}
        onClose={() => setShowCopyDialog(false)}
        operationType="copy"
        selectedDocumentIds={selectedItems
          .map((itemId) => {
            const item = folderItems.find((i) => i.id.toString() === itemId);
            return item?.type === "file" ? item.id : null;
          })
          .filter((docId): docId is number => docId !== null)}
        sourceFolderId={id ? parseInt(id) : undefined}
        onConfirm={handleBulkMoveConfirm}
      />

      {/* Document Share Modal */}
      {selectedDocumentForShare && (
        <DocumentShareModal
          isOpen={showShareModal}
          onClose={() => {
            setShowShareModal(false);
            setSelectedDocumentForShare(null);
          }}
          documentId={selectedDocumentForShare}
          publicUuid={
            folderItems.find((item) => item.id === selectedDocumentForShare)
              ?.public_uuid
          }
          initialShares={
            folderItems
              .find((item) => item.id === selectedDocumentForShare)
              ?.document_users?.map((user) => ({
                id: user.id.toString(),
                user_type: user.user_type,
                user_id: user.user_id,
                email: user.email,
                full_name: user.user_name,
                access_level: user.access_level,
              })) || []
          }
          onSave={handleSaveShares}
        />
      )}

      {/* Action Panel Modal */}
      <DocumentActionPanel
        isOpen={showActionPanel}
        onClose={() => setShowActionPanel(false)}
        onAddDocument={() => {
          setShowActionPanel(false);
          navigate("/maintenance/documents/add");
        }}
        onCreateFolder={() => {
          setShowActionPanel(false);
          navigate("/maintenance/documents/create-folder");
        }}
        onAddPdf={handleAddPdf}
        onAddDoc={handleAddDoc}
        onAddSheet={handleAddSheet}
        onAddPpt={handleAddPpt}
      />
    </div>
  );
};
