import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Plus, Eye, Folder } from "lucide-react";
import { ColumnConfig } from "@/hooks/useEnhancedTable";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { DocumentActionPanel } from "@/components/document/DocumentActionPanel";
import { DocumentFilterModal } from "@/components/document/DocumentFilterModal";
import { DocumentEnhancedTable } from "@/components/document/DocumentEnhancedTable";

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
    key: "actions",
    label: "Action",
    sortable: false,
    hideable: false,
    draggable: false,
  },
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
    label: "Created Date",
    sortable: true,
    hideable: true,
    draggable: true,
  },
];

export const DocumentManagement = () => {
  const navigate = useNavigate();
  const [showActionPanel, setShowActionPanel] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({
    createdDate: "",
    createdBy: "",
    category: "",
    status: "",
  });

  const itemsPerPage = 10;
  const totalPages = Math.ceil(mockDocuments.length / itemsPerPage);

  const handleViewDetails = (documentId: number) => {
    navigate(`/maintenance/documents/folder/${documentId}`);
  };

  const renderCell = (document: Document, columnKey: string) => {
    switch (columnKey) {
      case "folder_title":
        return (
          <div className="flex items-center gap-2">
            <Folder className="w-5 h-5 text-[#C72030]" />
            <span className="font-medium">{document.folder_title}</span>
          </div>
        );
      case "status":
        return (
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium ${
              document.status === "Active"
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
      <Button
        variant="ghost"
        size="sm"
        onClick={() => handleViewDetails(document.id)}
        className="p-1 h-8 w-8"
      >
        <Eye className="w-4 h-4 text-[#C72030]" />
      </Button>
    );
  };

  const handleApplyFilters = (newFilters: typeof filters) => {
    setFilters(newFilters);
    setShowFilterModal(false);
  };

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-[1400px] mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-[#1a1a1a]">Documents</h1>
        </div>

        {/* Document Enhanced Table with all view modes */}
        <DocumentEnhancedTable
          documents={mockDocuments}
          columns={columns}
          onViewDetails={handleViewDetails}
          onFilterOpen={() => setShowFilterModal(true)}
          onActionClick={() => setShowActionPanel(true)}
          renderCell={renderCell}
        />

        {/* Pagination */}
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
              {[...Array(totalPages)].map((_, index) => (
                <PaginationItem key={index}>
                  <PaginationLink
                    onClick={() => setCurrentPage(index + 1)}
                    isActive={currentPage === index + 1}
                    className="cursor-pointer"
                  >
                    {index + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}
              <PaginationItem>
                <PaginationNext
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(totalPages, prev + 1))
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
          console.log("Create Folder clicked");
        }}
      />

      {/* Filter Modal */}
      <DocumentFilterModal
        isOpen={showFilterModal}
        onClose={() => setShowFilterModal(false)}
        filters={filters}
        onApplyFilters={handleApplyFilters}
      />
    </div>
  );
};
