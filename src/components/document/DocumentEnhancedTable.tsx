import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Plus,
  Search,
  Filter,
  Grid3x3,
  List,
  FolderTree,
  ChevronDown,
  Eye,
  X,
  MoreVertical,
  FileText,
  Edit,
  Trash2,
} from "lucide-react";
import { EnhancedTable } from "@/components/enhanced-table/EnhancedTable";
import { ColumnConfig } from "@/hooks/useEnhancedTable";
import { DocumentGridView } from "./DocumentGridView";
import { DocumentTreeView } from "./DocumentTreeView";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { FileIcon } from "./FileIcon";

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
  format?: string;
  preview_url?: string;
}

type ViewMode = "grid" | "table" | "tree";
type SortOption = "title_asc" | "title_desc" | "size" | "recent";

interface DocumentEnhancedTableProps {
  documents: Document[];
  columns: ColumnConfig[];
  onViewDetails: (documentId: number) => void;
  onFilterOpen: () => void;
  onActionClick: () => void;
  renderCell: (document: Document, columnKey: string) => React.ReactNode;
  renderActions: (document: Document) => React.ReactNode;
  selectedItems: string[];
  onSelectionChange: (selectedIds: string[]) => void;
}

export const DocumentEnhancedTable: React.FC<DocumentEnhancedTableProps> = ({
  documents,
  columns,
  onViewDetails,
  onFilterOpen,
  onActionClick,
  renderCell,
  renderActions,
  selectedItems,
  onSelectionChange,
}) => {
  // Check if this is a file list view (folder details page)
  const isFileListView = window.location.pathname.includes("/folder/");

  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("title_asc");
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  // Create handlers for selection
  const handleSelectItem = (itemId: string, checked: boolean) => {
    if (checked) {
      // Add to selection
      onSelectionChange([...selectedItems, itemId]);
    } else {
      // Remove from selection
      onSelectionChange(selectedItems.filter((id) => id !== itemId));
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      // Select all documents
      const allIds = documents.map((doc) => doc.id.toString());
      onSelectionChange(allIds);
    } else {
      // Clear all selections
      onSelectionChange([]);
    }
  };
  const handleSortChange = (option: SortOption) => {
    setSortBy(option);
    setShowSortDropdown(false);
  };

  const handleClearSearch = () => {
    setSearchQuery("");
  };

  // Custom File Grid View for file list pages
  const FileGridView = () => (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 p-6">
      {sortedDocuments.map((item) => (
        <div
          key={item.id}
          className="border border-gray-200 rounded-lg overflow-hidden hover:border-[#C72030] hover:shadow-md transition-all bg-white relative group"
        >
          {/* Three-dot menu */}
          <div className="absolute top-2 right-2 z-10">
            {renderActions(item)}
          </div>

          {/* Checkbox */}
          <div className="absolute top-2 left-2 z-10">
            <input
              type="checkbox"
              checked={selectedItems.includes(item.id.toString())}
              onChange={(e) => {
                e.stopPropagation();
                handleSelectItem(item.id.toString(), e.target.checked);
              }}
              className="w-4 h-4 text-[#C72030] focus:ring-[#C72030] border-gray-300 rounded cursor-pointer"
              onClick={(e) => e.stopPropagation()}
            />
          </div>

          {/* Image preview area - click to preview */}
          <div
            className="aspect-square bg-gray-100 flex items-center justify-center cursor-pointer overflow-hidden"
            onClick={() => onViewDetails(item.id)}
          >
            {item.format &&
              ["JPG", "JPEG", "PNG", "GIF", "WEBP", "BMP"].includes(
                item.format.toUpperCase()
              ) &&
              item.preview_url ? (
              <img
                src={item.preview_url}
                alt={item.folder_title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  // Fallback to icon if image fails to load
                  const target = e.target as HTMLImageElement;
                  target.style.display = "none";
                  const parent = target.parentElement;
                  if (parent) {
                    const icon = document.createElement("div");
                    icon.className = "w-16 h-16";
                    parent.appendChild(icon);
                  }
                }}
              />
            ) : (
              <FileIcon
                fileName={
                  item.format
                    ? `file.${item.format.toLowerCase()}`
                    : item.folder_title
                }
                isFolder={false}
                className="w-16 h-16"
              />
            )}
          </div>

          {/* File info */}
          <div className="p-3">
            <p
              className="text-sm font-medium text-gray-900 truncate"
              title={item.folder_title}
            >
              {item.folder_title}
            </p>
            <p className="text-xs text-gray-500 mt-1">{item.created_date}</p>
            {item.size && (
              <span className="inline-block mt-2 px-2 py-1 bg-gray-100 text-xs text-gray-600 rounded">
                {item.size}
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );

  // Filter documents based on search query
  const filteredDocuments = documents.filter(
    (doc) =>
      doc.folder_title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.created_by.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Sort documents based on selected option
  const sortedDocuments = [...filteredDocuments].sort((a, b) => {
    switch (sortBy) {
      case "title_asc":
        return a.folder_title.localeCompare(b.folder_title);
      case "title_desc":
        return b.folder_title.localeCompare(a.folder_title);
      case "size":
        // Simple size comparison (you may need to parse the size string properly)
        return a.size.localeCompare(b.size);
      case "recent":
        return (
          new Date(b.modified_date || b.created_date).getTime() -
          new Date(a.modified_date || a.created_date).getTime()
        );
      default:
        return 0;
    }
  });

  return (
    <div className="space-y-4">
      {/* Action Bar */}
      <div className="flex items-center justify-between gap-3  p-4 rounded-lg shadow-sm  ">
        {/* Left: Action Button - Only show when NOT in file list view */}
        {/* {!isFileListView && ( */}
        <Button
          onClick={onActionClick}
          className="bg-[#C72030] hover:bg-[#A01828] text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          Action
        </Button>
        {/* )} */}

        {/* Right: Search, Filter, Sort, View Toggle */}
        <div className="flex items-center gap-3 ml-auto">
          {/* Search */}
          <div className="relative min-w-[200px]">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-10"
            />
            {searchQuery && (
              <button
                onClick={handleClearSearch}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Filter Button */}
          <Button
            variant="outline"
            onClick={onFilterOpen}
            className="border-[#C72030] text-[#C72030] hover:bg-[#C72030] hover:text-white"
          >
            <Filter className="w-4 h-4 " />
          </Button>

          {/* Sort Dropdown */}
          <div className="relative">
            <Button
              variant="outline"
              onClick={() => setShowSortDropdown(!showSortDropdown)}
              className="border-[#C72030] text-[#C72030] hover:bg-[#C72030] hover:text-white"
            >
              <svg
                width="10"
                height="12"
                viewBox="0 0 10 12"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M2.50392 11.5V9.4375C2.93413 9.32735 3.31544 9.07715 3.58774 8.72635C3.86004 8.37554 4.00784 7.94409 4.00784 7.5C4.00784 7.05591 3.86004 6.62446 3.58774 6.27365C3.31544 5.92285 2.93413 5.67265 2.50392 5.5625L2.50392 0.5C2.50392 0.367392 2.45124 0.240214 2.35748 0.146446C2.26371 0.0526781 2.13653 0 2.00392 0C1.87131 0 1.74414 0.0526781 1.65037 0.146446C1.5566 0.240214 1.50392 0.367392 1.50392 0.5L1.50392 5.5625C1.07371 5.67265 0.692403 5.92285 0.420102 6.27365C0.147801 6.62446 0 7.05591 0 7.5C0 7.94409 0.147801 8.37554 0.420102 8.72635C0.692403 9.07715 1.07371 9.32735 1.50392 9.4375L1.50392 11.5C1.50392 11.6326 1.5566 11.7598 1.65037 11.8536C1.74414 11.9473 1.87131 12 2.00392 12C2.13653 12 2.26371 11.9473 2.35748 11.8536C2.45124 11.7598 2.50392 11.6326 2.50392 11.5ZM1.00392 7.5C1.00392 7.30222 1.06257 7.10888 1.17245 6.94443C1.28233 6.77998 1.43851 6.65181 1.62124 6.57612C1.80396 6.50043 2.00503 6.48063 2.19901 6.51921C2.39299 6.5578 2.57118 6.65304 2.71103 6.79289C2.85088 6.93275 2.94612 7.11093 2.98471 7.30491C3.02329 7.49889 3.00349 7.69996 2.9278 7.88268C2.85211 8.06541 2.72394 8.22159 2.55949 8.33147C2.39504 8.44135 2.2017 8.5 2.00392 8.5C1.73871 8.5 1.48435 8.39464 1.29682 8.20711C1.10928 8.01957 1.00392 7.76522 1.00392 7.5ZM7.50392 0.5V1.5625C7.07371 1.67265 6.6924 1.92285 6.4201 2.27365C6.1478 2.62446 6 3.05591 6 3.5C6 3.94409 6.1478 4.37554 6.4201 4.72635C6.6924 5.07715 7.07371 5.32735 7.50392 5.4375V11.5C7.50392 11.6326 7.5566 11.7598 7.65037 11.8536C7.74414 11.9473 7.87131 12 8.00392 12C8.13653 12 8.26371 11.9473 8.35748 11.8536C8.45124 11.7598 8.50392 11.6326 8.50392 11.5V5.4375C8.93413 5.32735 9.31544 5.07715 9.58774 4.72635C9.86004 4.37554 10.0078 3.94409 10.0078 3.5C10.0078 3.05591 9.86004 2.62446 9.58774 2.27365C9.31544 1.92285 8.93413 1.67265 8.50392 1.5625V0.5C8.50392 0.367392 8.45124 0.240214 8.35748 0.146446C8.26371 0.0526781 8.13653 0 8.00392 0C7.87131 0 7.74414 0.0526781 7.65037 0.146446C7.5566 0.240214 7.50392 0.367392 7.50392 0.5ZM9.00392 3.5C9.00392 3.69778 8.94527 3.89112 8.83539 4.05557C8.72551 4.22002 8.56933 4.34819 8.38661 4.42388C8.20388 4.49957 8.00281 4.51937 7.80883 4.48079C7.61485 4.4422 7.43667 4.34696 7.29681 4.20711C7.15696 4.06725 7.06172 3.88907 7.02314 3.69509C6.98455 3.50111 7.00435 3.30004 7.08004 3.11732C7.15573 2.93459 7.2839 2.77841 7.44835 2.66853C7.6128 2.55865 7.80614 2.5 8.00392 2.5C8.26914 2.5 8.52349 2.60536 8.71103 2.79289C8.89856 2.98043 9.00392 3.23478 9.00392 3.5Z"
                  fill="#C72030"
                />
              </svg>
            </Button>
            {showSortDropdown && (
              <>
                {/* Backdrop to close dropdown */}
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setShowSortDropdown(false)}
                />
                <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-lg shadow-lg z-20">
                  <button
                    onClick={() => handleSortChange("title_asc")}
                    className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-2 transition-colors"
                  >
                    <input
                      type="radio"
                      checked={sortBy === "title_asc"}
                      onChange={() => { }}
                      className="text-[#C72030] focus:ring-[#C72030]"
                    />
                    <span className="text-sm">Title A-Z</span>
                  </button>
                  <button
                    onClick={() => handleSortChange("title_desc")}
                    className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-2 transition-colors"
                  >
                    <input
                      type="radio"
                      checked={sortBy === "title_desc"}
                      onChange={() => { }}
                      className="text-[#C72030] focus:ring-[#C72030]"
                    />
                    <span className="text-sm">Title Z-A</span>
                  </button>
                  <button
                    onClick={() => handleSortChange("size")}
                    className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-2 transition-colors"
                  >
                    <input
                      type="radio"
                      checked={sortBy === "size"}
                      onChange={() => { }}
                      className="text-[#C72030] focus:ring-[#C72030]"
                    />
                    <span className="text-sm">Size</span>
                  </button>
                  <button
                    onClick={() => handleSortChange("recent")}
                    className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-2 transition-colors"
                  >
                    <input
                      type="radio"
                      checked={sortBy === "recent"}
                      onChange={() => { }}
                      className="text-[#C72030] focus:ring-[#C72030]"
                    />
                    <span className="text-sm">Recently Modified</span>
                  </button>
                </div>
              </>
            )}
          </div>

          {/* View Toggle */}
          <div className="flex border border-[#C72030] rounded-lg overflow-hidden">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 transition-colors ${viewMode === "grid"
                  ? "bg-[#C72030] text-white"
                  : "text-[#C72030] hover:bg-red-50"
                }`}
              title="Grid View"
            >
              <Grid3x3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode("table")}
              className={`p-2 border-l border-[#C72030] transition-colors ${viewMode === "table"
                  ? "bg-[#C72030] text-white"
                  : "text-[#C72030] hover:bg-red-50"
                }`}
              title="Table View"
            >
              <List className="w-4 h-4" />
            </button>
            {/* Only show tree view when NOT in file list view */}
            {!isFileListView && (
              <button
                onClick={() => setViewMode("tree")}
                className={`p-2 border-l border-[#C72030] transition-colors ${viewMode === "tree"
                    ? "bg-[#C72030] text-white"
                    : "text-[#C72030] hover:bg-red-50"
                  }`}
                title="Tree View"
              >
                <FolderTree className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Content Area */}
      {viewMode === "grid" &&
        (isFileListView ? (
          <FileGridView />
        ) : (
          <DocumentGridView
            documents={sortedDocuments}
            onViewDetails={onViewDetails}
          />
        ))}

      {viewMode === "table" && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <EnhancedTable
            data={sortedDocuments}
            columns={columns}
            renderCell={renderCell}
            renderActions={renderActions}
            storageKey="document-management-table"
            emptyMessage="No documents found"
            selectable={true}
            selectedItems={selectedItems}
            onSelectItem={handleSelectItem}
            onSelectAll={handleSelectAll}
            getItemId={(doc) => doc.id.toString()}
            hideTableSearch={true}
            hideTableExport={true}
          />
        </div>
      )}

      {viewMode === "tree" && !isFileListView && (
        <DocumentTreeView
          documents={sortedDocuments}
          onViewDetails={onViewDetails}
        />
      )}
    </div>
  );
};
