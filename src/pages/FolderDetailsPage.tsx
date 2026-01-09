import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Eye,
  FileText,
  Folder as FolderIcon,
  LayoutGrid,
  List,
  ListTree,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { DocumentEnhancedTable } from "@/components/document/DocumentEnhancedTable";
import { ColumnConfig } from "@/hooks/useEnhancedTable";
import { AssetSelectionPanel } from "@/components/AssetSelectionPanel";
import {
  getFolderDetails,
  FolderDetailsResponse,
} from "@/services/documentService";

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
  const { id } = useParams<{ id: string }>();
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<"table" | "grid" | "tree">("table");
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
          // Add child folders
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
          // Add documents
          ...response.documents.map((doc) => ({
            id: doc.id,
            folder_title: doc.title,
            type: "file" as const,
            category:
              doc.document_category_name || response.name || "Uncategorized",
            format: doc.file_type?.toUpperCase() || "PDF",
            size: formatFileSize(doc.file_size || 0),
            document_count: 1,
            status: doc.active ? ("Active" as const) : ("Inactive" as const),
            created_by: doc.created_by_full_name || "Unknown",
            created_date: formatDate(doc.created_at),
            modified_date: doc.updated_at
              ? formatDate(doc.updated_at)
              : undefined,
          })),
        ];

        setFolderItems(items);
      } catch (error) {
        console.error("Error fetching folder details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFolderDetails();
  }, [id]);

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
      navigate(`/maintenance/documents/details/${itemId}`);
    }
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

  const handleUpdate = () => {
    // TODO: Implement update functionality
  };

  const handleDelete = () => {
    if (
      window.confirm(
        `Are you sure you want to delete ${selectedItems.length} item(s)?`
      )
    ) {
      // TODO: Implement delete functionality
      setSelectedItems([]);
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
            <FileText className="w-5 h-5 text-[#C72030]" />
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
      <Button
        variant="ghost"
        size="sm"
        onClick={() => handleViewItem(item.id.toString())}
        className="p-1 h-8 w-8"
      >
        <Eye className="w-4 h-4 text-[#C72030]" />
      </Button>
    );
  };

  // Grid View Component
  const GridView = () => (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 p-6">
      {folderItems.map((item) => (
        <div
          key={item.id}
          className="border border-gray-200 rounded-lg p-4 hover:border-[#C72030] hover:shadow-md transition-all cursor-pointer bg-white"
          onClick={() => handleViewItem(item.id.toString())}
        >
          <div className="flex flex-col items-center gap-3">
            <FileText className="w-12 h-12 text-[#C72030]" />
            <div className="text-center w-full">
              <p
                className="text-sm font-medium text-gray-900 truncate"
                title={item.folder_title}
              >
                {item.folder_title}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Created: {item.created_date}
              </p>
              {item.format && (
                <span className="inline-block mt-2 px-2 py-1 bg-gray-100 text-xs text-gray-600 rounded">
                  {item.format}
                </span>
              )}
            </div>
          </div>
          {/* Selection Checkbox */}
          <div
            className="mt-3 flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <input
              type="checkbox"
              checked={selectedItems.includes(item.id.toString())}
              onChange={(e) =>
                handleSelectItem(item.id.toString(), e.target.checked)
              }
              className="w-4 h-4 text-[#C72030] focus:ring-[#C72030] border-gray-300 rounded cursor-pointer"
            />
          </div>
        </div>
      ))}
    </div>
  );

  // Tree View Component
  const TreeView = () => {
    const folders = folderItems.filter((item) => item.type === "folder");
    const files = folderItems.filter((item) => item.type === "file");

    return (
      <div className="p-6 space-y-4">
        {/* Folders Section */}
        {folders.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <FolderIcon className="w-4 h-4" />
              Folders ({folders.length})
            </h3>
            <div className="space-y-2 ml-4 border-l-2 border-gray-200 pl-4">
              {folders.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-lg hover:border-[#C72030] hover:shadow-sm transition-all cursor-pointer"
                  onClick={() => handleViewItem(item.id.toString())}
                >
                  <input
                    type="checkbox"
                    checked={selectedItems.includes(item.id.toString())}
                    onChange={(e) => {
                      e.stopPropagation();
                      handleSelectItem(item.id.toString(), e.target.checked);
                    }}
                    className="w-4 h-4 text-[#C72030] focus:ring-[#C72030] border-gray-300 rounded cursor-pointer"
                  />
                  <FolderIcon className="w-5 h-5 text-[#C72030] flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {item.folder_title}
                    </p>
                    <p className="text-xs text-gray-500">{item.size}</p>
                  </div>
                  <Eye className="w-4 h-4 text-gray-400 flex-shrink-0" />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Files Section */}
        {files.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Files ({files.length})
            </h3>
            <div className="space-y-2 ml-4 border-l-2 border-gray-200 pl-4">
              {files.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-lg hover:border-[#C72030] hover:shadow-sm transition-all cursor-pointer"
                  onClick={() => handleViewItem(item.id.toString())}
                >
                  <input
                    type="checkbox"
                    checked={selectedItems.includes(item.id.toString())}
                    onChange={(e) => {
                      e.stopPropagation();
                      handleSelectItem(item.id.toString(), e.target.checked);
                    }}
                    className="w-4 h-4 text-[#C72030] focus:ring-[#C72030] border-gray-300 rounded cursor-pointer"
                  />
                  <FileText className="w-5 h-5 text-gray-500 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {item.folder_title}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      {item.format && (
                        <span className="px-2 py-0.5 bg-gray-100 text-xs text-gray-600 rounded">
                          {item.format}
                        </span>
                      )}
                      <span className="text-xs text-gray-500">{item.size}</span>
                    </div>
                  </div>
                  <Eye className="w-4 h-4 text-gray-400 flex-shrink-0" />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
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
      <div className="max-w-[1400px] mx-auto p-6">
        {/* Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 relative">
          {/* View Mode Switcher */}

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

              {viewMode === "tree" && <TreeView />}
            </>
          )}

          {/* Asset Selection Panel - matches asset dashboard pattern */}
          {selectedItems.length > 0 && (
            <AssetSelectionPanel
              selectedCount={selectedItems.length}
              selectedAssets={selectedItemObjects}
              selectedAssetIds={selectedItems}
              onMoveAsset={handleUpdate}
              onDisposeAsset={handleDelete}
              onPrintQRCode={() => {}}
              onCheckIn={() => {}}
              onClearSelection={handleClearSelection}
            />
          )}
        </div>
      </div>
    </div>
  );
};
