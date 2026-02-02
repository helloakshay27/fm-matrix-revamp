import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDynamicPermissions } from "@/hooks/useDynamicPermissions";
import { Button } from "@/components/ui/button";
import { Plus, Eye, Edit } from "lucide-react";
import { ColumnConfig } from "@/hooks/useEnhancedTable";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "@/components/ui/pagination";
import { DocumentActionPanel } from "@/components/document/DocumentActionPanel";
import { DocumentFilterModal } from "@/components/document/DocumentFilterModal";
import { DocumentEnhancedTable } from "@/components/document/DocumentEnhancedTable";
import { DocumentSelectionPanel } from "@/components/document/DocumentSelectionPanel";
import {
  getFoldersList,
  FolderListItem,
  deleteFolder,
  createDocument,
  getCategories,
  CreateDocumentPayload,
  FolderPermission,
  Category,
} from "@/services/documentService";
import { toast } from "sonner";
import { FileIcon } from "@/components/document/FileIcon";

interface Document {
  id: number;
  folder_title: string;
  category: string;
  document_count: number;
  size: string;
  status: "Active" | "Inactive";
  created_by: string;
  created_date: string;
  modified_date?: string;
  files_count?: number;
  folders_count?: number;
}

const mockDocuments: Document[] = [
  {
    id: 1,
    folder_title: "Tenant Documents",
    category: "Tenant / Legal",
    document_count: 2,
    size: "124 MB",
    status: "Active",
    created_by: "John Doe",
    created_date: "12 Feb 2025",
    files_count: 2,
    folders_count: 1,
  },
  {
    id: 2,
    folder_title: "Lease Agreements",
    category: "Lease / Legal",
    document_count: 2,
    size: "89 MB",
    status: "Active",
    created_by: "Rohan Desai",
    created_date: "08 Jan 2025",
    modified_date: "08 Jan 2025",
    files_count: 2,
    folders_count: 0,
  },
  {
    id: 3,
    folder_title: "ID Proofs",
    category: "Identity / Verification",
    document_count: 2,
    size: "56 MB",
    status: "Active",
    created_by: "Admin System",
    created_date: "22 Mar 2025",
    files_count: 2,
    folders_count: 1,
  },
  {
    id: 4,
    folder_title: "Fire Safety Certificates",
    category: "Safety & Compliance",
    document_count: 7,
    size: "320 KB",
    status: "Active",
    created_by: "Priya Kulkarni",
    created_date: "05 Dec 2024",
    files_count: 7,
    folders_count: 0,
  },
];

const columns: ColumnConfig[] = [
  {
    key: "folder_title",
    label: "Folder Title",
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
    label: "Created",
    sortable: true,
    hideable: true,
    draggable: true,
  },
];

const documentColumns: ColumnConfig[] = [
  {
    key: "folder_title",
    label: "Title",
    sortable: true,
    hideable: true,
    draggable: true,
  },
  {
    key: "actions",
    label: "Action",
    sortable: false,
    hideable: false,
    draggable: false,
  },
  {
    key: "category",
    label: "Category",
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

export const DocumentManagement = () => {
  const navigate = useNavigate();
  const { shouldShow } = useDynamicPermissions();
  const [showActionPanel, setShowActionPanel] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [isCreating, setIsCreating] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [filters, setFilters] = useState({
    title: "",
    folderName: "",
    categoryName: "",
    createdBy: "",
    fileName: "",
    fileType: "",
    createdDateFrom: "",
    createdDateTo: "",
    status: "",
  });

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

  // Fetch folders data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await getFoldersList(currentPage, filters);

        // Transform API response to match Document interface
        const transformedData: Document[] = response.folders
          .filter((folder) => folder.name) // Filter out null names
          .map((folder) => ({
            id: folder.id,
            folder_title: folder.name || "Untitled",
            category: folder.document_category_name || "Uncategorized",
            document_count: folder.total_files,
            size: formatFileSize(folder.total_file_size),
            status: folder.active === false ? "Inactive" : "Active",
            created_by: folder.created_by_full_name || "Unknown",
            created_date: formatDate(folder.created_at),
            modified_date: formatDate(folder.updated_at),
            files_count: folder.total_files,
            folders_count: (folder.childs || []).length,
          }));

        setDocuments(transformedData);
        setTotalPages(response.pagination.total_pages);
      } catch (error) {
        console.error("Error fetching folders:", error);
        toast.error("Failed to load folders");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentPage, filters]);

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

  const handleViewDetails = (documentId: number) => {
    navigate(`/maintenance/documents/folder/${documentId}`);
  };

  const renderCell = (document: Document, columnKey: string) => {
    switch (columnKey) {
      case "folder_title":
        return (
          <div className="flex items-center gap-2">
            <FileIcon
              fileName={document.folder_title}
              isFolder={true}
              className="w-5 h-5"
            />
            <span className="font-medium">{document.folder_title}</span>
          </div>
        );
      case "status":
        return (
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium ${document.status === "Active"
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
              }`}
          >
            {document.status}
          </span>
        );
      case "document_count":
        return <span className="font-medium">{document.document_count}</span>;
      default:
        return document[columnKey as keyof Document];
    }
  };

  const renderActions = (document: Document) => {
    return (
      <div className="flex items-center gap-1">
        {shouldShow("employee_project_documents", "show") && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleViewDetails(document.id)}
            className="p-1 h-8 w-8"
            title="View Details"
          >
            <Eye className="w-4 h-4 text-[#C72030]" />
          </Button>
        )}
        {shouldShow("employee_project_documents", "update") && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() =>
              navigate(`/maintenance/documents/folder/edit/${document.id}`)
            }
            className="p-1 h-8 w-8"
            title="Edit Folder"
          >
            <Edit className="w-4 h-4 text-[#C72030]" />
          </Button>
        )}
      </div>
    );
  };

  const renderPaginationItems = () => {
    if (!totalPages || totalPages <= 0) {
      return null;
    }
    const items = [];
    const showEllipsis = totalPages > 7;

    if (showEllipsis) {
      // Always show first page
      items.push(
        <PaginationItem key={1} className="cursor-pointer">
          <PaginationLink
            onClick={() => setCurrentPage(1)}
            isActive={currentPage === 1}
          >
            1
          </PaginationLink>
        </PaginationItem>
      );

      // Show ellipsis or pages after first page
      if (currentPage > 4) {
        items.push(
          <PaginationItem key="ellipsis1">
            <PaginationEllipsis />
          </PaginationItem>
        );
      } else {
        for (let i = 2; i <= Math.min(3, totalPages - 1); i++) {
          items.push(
            <PaginationItem key={i} className="cursor-pointer">
              <PaginationLink
                onClick={() => setCurrentPage(i)}
                isActive={currentPage === i}
              >
                {i}
              </PaginationLink>
            </PaginationItem>
          );
        }
      }

      // Show current page and surrounding pages
      if (currentPage > 3 && currentPage < totalPages - 2) {
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          items.push(
            <PaginationItem key={i} className="cursor-pointer">
              <PaginationLink
                onClick={() => setCurrentPage(i)}
                isActive={currentPage === i}
              >
                {i}
              </PaginationLink>
            </PaginationItem>
          );
        }
      }

      // Show ellipsis or pages before last page
      if (currentPage < totalPages - 3) {
        items.push(
          <PaginationItem key="ellipsis2">
            <PaginationEllipsis />
          </PaginationItem>
        );
      } else {
        for (let i = Math.max(totalPages - 2, 2); i < totalPages; i++) {
          if (!items.find((item) => item.key === i.toString())) {
            items.push(
              <PaginationItem key={i} className="cursor-pointer">
                <PaginationLink
                  onClick={() => setCurrentPage(i)}
                  isActive={currentPage === i}
                >
                  {i}
                </PaginationLink>
              </PaginationItem>
            );
          }
        }
      }

      // Always show last page
      if (totalPages > 1) {
        items.push(
          <PaginationItem key={totalPages} className="cursor-pointer">
            <PaginationLink
              onClick={() => setCurrentPage(totalPages)}
              isActive={currentPage === totalPages}
            >
              {totalPages}
            </PaginationLink>
          </PaginationItem>
        );
      }
    } else {
      // Show all pages if 7 or fewer
      for (let i = 1; i <= totalPages; i++) {
        items.push(
          <PaginationItem key={i} className="cursor-pointer">
            <PaginationLink
              onClick={() => setCurrentPage(i)}
              isActive={currentPage === i}
            >
              {i}
            </PaginationLink>
          </PaginationItem>
        );
      }
    }

    return items;
  };

  const handleApplyFilters = (newFilters: typeof filters) => {
    setFilters(newFilters);
    setShowFilterModal(false);
  };

  const handleClearSelection = () => {
    setSelectedItems([]);
  };

  const handleUpdate = () => {
    if (selectedItems.length === 0) {
      toast.error("No folders selected");
      return;
    }

    // Get the selected documents
    const selectedDocs = documents.filter((doc) =>
      selectedItems.includes(doc.id.toString())
    );

    // Navigate to folder edit page
    if (selectedDocs.length === 1) {
      navigate(`/maintenance/documents/folder/edit/${selectedDocs[0].id}`);
    } else {
      toast.info("Please select only one folder to update");
    }
  };

  const handleDelete = async () => {
    if (selectedItems.length === 0) {
      toast.error("No folders selected");
      return;
    }

    if (
      !window.confirm(
        `Are you sure you want to delete ${selectedItems.length} folder(s)? This action cannot be undone.`
      )
    ) {
      return;
    }

    try {
      // Delete each folder
      const deletePromises = selectedItems.map((id) =>
        deleteFolder(parseInt(id))
      );
      await Promise.all(deletePromises);

      toast.success(`Successfully deleted ${selectedItems.length} folder(s)`);
      setSelectedItems([]);

      // Refresh the list
      const response = await getFoldersList(currentPage, filters);
      const transformedData: Document[] = response.folders
        .filter((folder) => folder.name)
        .map((folder) => ({
          id: folder.id,
          folder_title: folder.name || "Untitled",
          category: folder.document_category_name || "Uncategorized",
          document_count: folder.total_files,
          size: formatFileSize(folder.total_file_size),
          status: folder.active === false ? "Inactive" : "Active",
          created_by: folder.created_by_full_name || "Unknown",
          created_date: formatDate(folder.created_at),
          modified_date: formatDate(folder.updated_at),
          files_count: folder.total_files,
          folders_count: (folder.childs || []).length,
        }));
      setDocuments(transformedData);
    } catch (error) {
      console.error("Error deleting folders:", error);
      toast.error("Failed to delete folders. Please try again.");
    }
  };

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
          folder_id: undefined,
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
        toast.error("Document created but could not open editor. Please try again.");
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
          folder_id: 297,
          category_id: categories[0]?.id || 1,
          shares: [],
          attachments: [
            {
              filename: "document.docx",
              content: `data:application/vnd.openxmlformats-officedocument.wordprocessingml.document;base64,${pdfBase64}`,
              content_type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
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
        toast.error("Document created but could not open editor. Please try again.");
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
          folder_id: 297,
          category_id: categories[0]?.id || 1,
          shares: [],
          attachments: [
            {
              filename: "document.xlsx",
              content: `data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,${pdfBase64}`,
              content_type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
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
        toast.error("Document created but could not open editor. Please try again.");
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
          folder_id: 297,
          category_id: categories[0]?.id || 1,
          shares: [],
          attachments: [
            {
              filename: "document.pptx",
              content: `data:application/vnd.openxmlformats-officedocument.presentationml.presentation;base64,${pdfBase64}`,
              content_type: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
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
        toast.error("Document created but could not open editor. Please try again.");
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

  return (
    <div className="min-h-screen p-6">
      <div className="w-full space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-[#1a1a1a]">Documents</h1>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="text-gray-500">Loading folders...</div>
          </div>
        ) : (
          <>
            {/* Document Enhanced Table with all view modes */}
            <DocumentEnhancedTable
              documents={documents}
              columns={columns}
              onViewDetails={handleViewDetails}
              onFilterOpen={() => setShowFilterModal(true)}
              onActionClick={() => setShowActionPanel(true)}
              renderCell={renderCell}
              renderActions={renderActions}
              selectedItems={selectedItems}
              onSelectionChange={setSelectedItems}
            />

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-6">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        onClick={() =>
                          setCurrentPage((prev) => Math.max(1, prev - 1))
                        }
                        className={
                          currentPage === 1
                            ? "pointer-events-none opacity-50"
                            : "cursor-pointer"
                        }
                      />
                    </PaginationItem>
                    {renderPaginationItems()}
                    <PaginationItem>
                      <PaginationNext
                        onClick={() =>
                          setCurrentPage((prev) =>
                            Math.min(totalPages, prev + 1)
                          )
                        }
                        className={
                          currentPage === totalPages
                            ? "pointer-events-none opacity-50"
                            : "cursor-pointer"
                        }
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </>
        )}
      </div>

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

      {/* Filter Modal */}
      <DocumentFilterModal
        isOpen={showFilterModal}
        onClose={() => setShowFilterModal(false)}
        filters={filters}
        onApplyFilters={handleApplyFilters}
      />

      {/* Document Selection Panel - Move and Copy hidden for folder list */}
      {selectedItems.length > 0 && (
        <DocumentSelectionPanel
          selectedItems={selectedItems}
          selectedDocuments={documents.filter((doc) =>
            selectedItems.includes(doc.id.toString())
          )}
          onUpdate={handleUpdate}
          onDelete={handleDelete}
          onClearSelection={handleClearSelection}
        />
      )}
    </div>
  );
};
