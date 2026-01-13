import React, { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import {
  ArrowLeft,
  Eye,
  LayoutGrid,
  List,
  MoreVertical,
  FileText,
  Trash2,
  Edit,
  FolderIcon,
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
import {
  getFolderDetails,
  FolderDetailsResponse,
} from "@/services/documentService";
import { FileIcon } from "@/components/document/FileIcon";

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
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<"table" | "grid">("grid");
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);

  // Check if this is a file list view (not folder list)
  const isFileListView = location.pathname.includes("/folder/");
  const [folderData, setFolderData] = useState<FolderDetailsResponse | null>(
    null
  );
  const [folderItems, setFolderItems] = useState<FolderItem[]>([]);
  const [loading, setLoading] = useState(true);

  const folderName = folderData?.name || "Folder Details";

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
      // Open preview for files
      handlePreview(itemId);
    }
  };

  const handlePreview = (itemId: string) => {
    // TODO: Implement document preview
    console.log("Preview document:", itemId);
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
      console.log("Update item:", itemId);
      // TODO: Implement update functionality
    } else {
      // Update multiple selected items
      console.log("Update items:", selectedItems);
      // TODO: Implement bulk update functionality
    }
  };

  const handleDelete = (itemId?: string) => {
    const itemsToDelete = itemId ? [itemId] : selectedItems;
    if (
      window.confirm(
        `Are you sure you want to delete ${itemsToDelete.length} item(s)?`
      )
    ) {
      console.log("Delete items:", itemsToDelete);
      // TODO: Implement delete functionality
      if (!itemId) {
        setSelectedItems([]);
      }
    }
  };

  const handleClearSelection = () => {
    setSelectedItems([]);
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
          <DropdownMenuItem onClick={() => handlePreview(item.id.toString())}>
            <Eye className="w-4 h-4 mr-2" />
            Preview
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => handleOpenDetail(item.id.toString())}
          >
            <FileText className="w-4 h-4 mr-2" />
            Open in Detail
          </DropdownMenuItem>
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

  // Grid View Component
  const GridView = () => (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 p-6">
      {folderItems.map((item) => (
        <div
          key={item.id}
          className="border border-gray-200 rounded-lg overflow-hidden hover:border-[#C72030] hover:shadow-md transition-all bg-white relative group"
        >
          {/* Three-dot menu */}
          <div className="absolute top-2 right-2 z-10">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  onClick={(e) => e.stopPropagation()}
                  className="p-1.5 bg-white rounded-full shadow-sm hover:bg-gray-100 transition-colors opacity-0 group-hover:opacity-100"
                >
                  <MoreVertical className="w-4 h-4 text-gray-600" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem
                  onClick={() => handlePreview(item.id.toString())}
                >
                  <Eye className="w-4 h-4 mr-2" />
                  Preview
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handleOpenDetail(item.id.toString())}
                >
                  <FileText className="w-4 h-4 mr-2" />
                  Open in Detail
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handleUpdate(item.id.toString())}
                >
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
            className="aspect-square bg-gray-100 flex items-center justify-center cursor-pointer"
            onClick={() => handlePreview(item.id.toString())}
          >
            <FileIcon
              fileName={item.folder_title}
              isFolder={false}
              className="w-16 h-16"
            />
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
            {item.format && (
              <span className="inline-block mt-2 px-2 py-1 bg-gray-100 text-xs text-gray-600 rounded">
                {item.format}
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );

  // View Mode Switcher Component
  const ViewModeSwitcher = () => (
    <div className="absolute top-4 right-6 z-10 flex items-center gap-2 bg-white px-2 py-1 rounded-lg border border-gray-200">
      <button
        onClick={() => setViewMode("grid")}
        className={`p-2 rounded transition-colors ${
          viewMode === "grid"
            ? "bg-[#C72030] text-white"
            : "text-gray-600 hover:bg-gray-100"
        }`}
        title="Grid View"
      >
        <LayoutGrid className="w-4 h-4" />
      </button>
      <button
        onClick={() => setViewMode("table")}
        className={`p-2 rounded transition-colors ${
          viewMode === "table"
            ? "bg-[#C72030] text-white"
            : "text-gray-600 hover:bg-gray-100"
        }`}
        title="Table View"
      >
        <List className="w-4 h-4" />
      </button>
    </div>
  );

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
      <div className="max-w-[1400px] mx-auto p-6">
        {/* Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 relative">
          {/* View Mode Switcher - Only show in file list view */}
          {isFileListView && <ViewModeSwitcher />}

          {/* Render View based on mode */}
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="text-gray-500">Loading folder contents...</div>
            </div>
          ) : (
            <>
              {viewMode === "table" && (
                <DocumentEnhancedTable
                  documents={folderItems}
                  columns={columns}
                  renderCell={renderCell}
                  renderActions={renderActions}
                  onViewDetails={(itemId) => handleViewItem(itemId.toString())}
                  onFilterOpen={() => {}}
                  onActionClick={() => {}}
                />
              )}

              {viewMode === "grid" && <GridView />}
            </>
          )}

          {/* Selection Action Panel */}
          {selectedItems.length > 0 && (
            <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-white border border-gray-200 rounded-lg shadow-xl z-50 flex items-center gap-4 px-6 py-4">
              <div className="flex items-center gap-3">
                <span className="text-sm font-semibold text-[#1a1a1a]">
                  {selectedItems.length} selected
                </span>
                <div className="h-6 w-px bg-gray-300" />
              </div>

              {/* Update Button */}
              <button
                onClick={() => handleUpdate()}
                className="flex items-center gap-2 px-4 py-2 bg-[#FFF5F5] hover:bg-[#FFE5E5] rounded-lg transition-colors"
              >
                <Edit className="w-4 h-4 text-[#C72030]" />
                <span className="text-sm font-medium text-[#C72030]">
                  Update
                </span>
              </button>

              {/* Delete Button */}
              <button
                onClick={() => handleDelete()}
                className="flex items-center gap-2 px-4 py-2 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
              >
                <Trash2 className="w-4 h-4 text-red-600" />
                <span className="text-sm font-medium text-red-600">Delete</span>
              </button>

              {/* Clear Selection */}
              <button
                onClick={handleClearSelection}
                className="ml-2 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Clear
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
