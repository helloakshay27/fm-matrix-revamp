import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Eye, FileText, Folder as FolderIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EnhancedTaskTable } from "@/components/enhanced-table/EnhancedTaskTable";
import { ColumnConfig } from "@/hooks/useEnhancedTable";
import { AssetSelectionPanel } from "@/components/AssetSelectionPanel";

interface FolderItem {
  id: number;
  title: string;
  type: "file" | "folder";
  category: string;
  format?: string;
  size: string;
  created_by: string;
  created_date: string;
  modified_date?: string;
}

const mockFolderItems: FolderItem[] = [
  {
    id: 1,
    title: "Lease Agreement",
    type: "file",
    category: "Lease / Legal",
    format: "PDF",
    size: "1.2 MB",
    created_by: "Rohan Desai",
    created_date: "08 Jan 2025",
  },
  {
    id: 2,
    title: "Fire Safety Drill Report",
    type: "file",
    category: "Safety & Compliance",
    format: "DOCX",
    size: "320 KB",
    created_by: "Priya Kulkarni",
    created_date: "15 Dec 2024",
  },
  {
    id: 3,
    title: "Visitor Pass Template",
    type: "file",
    category: "Templates",
    format: "PDF",
    size: "450 KB",
    created_by: "Admin System",
    created_date: "22 Nov 2024",
  },
  {
    id: 4,
    title: "Maintenance Work Order",
    type: "file",
    category: "Maintenance",
    format: "XLSX",
    size: "780 KB",
    created_by: "Mahesh Patil",
    created_date: "05 Jan 2025",
  },
  {
    id: 5,
    title: "Sub Folder 1",
    type: "folder",
    category: "Lease / Legal",
    size: "45 MB",
    created_by: "John Doe",
    created_date: "10 Dec 2024",
  },
  {
    id: 6,
    title: "Sub Folder 2",
    type: "folder",
    category: "Safety & Compliance",
    size: "12 MB",
    created_by: "Jane Smith",
    created_date: "18 Nov 2024",
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
    key: "title",
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
    key: "folder",
    label: "Folder",
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

  const folderName = "Tenant Documents"; // This would come from API

  const handleViewItem = (itemId: string) => {
    const item = mockFolderItems.find((i) => i.id.toString() === itemId);
    if (item?.type === "folder") {
      navigate(`/maintenance/documents/folder/${itemId}`);
    } else {
      navigate(`/maintenance/documents/details/${itemId}`);
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedItems(mockFolderItems.map((item) => item.id.toString()));
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
  const selectedItemObjects = mockFolderItems
    .filter((item) => selectedItems.includes(item.id.toString()))
    .map((item) => ({
      id: item.id.toString(),
      name: item.title,
    }));

  const renderCell = (item: FolderItem, columnKey: string) => {
    switch (columnKey) {
      case "title":
        return (
          <div className="flex items-center gap-2">
            {item.type === "folder" ? (
              <FolderIcon className="w-5 h-5 text-[#C72030]" />
            ) : (
              <FileText className="w-5 h-5 text-gray-500" />
            )}
            <span className="font-medium">{item.title}</span>
          </div>
        );
      case "format":
        return <span>{item.format || "-"}</span>;
      case "folder":
        return <span>{folderName}</span>;
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
          <EnhancedTaskTable
            data={mockFolderItems}
            columns={columns}
            renderCell={renderCell}
            renderActions={renderActions}
            storageKey="folder-details-table"
            emptyMessage="No files or folders found"
            selectable={true}
            selectedItems={selectedItems}
            onSelectAll={handleSelectAll}
            onSelectItem={handleSelectItem}
            getItemId={(item) => item.id.toString()}
            enableSearch={true}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            searchPlaceholder="Search files and folders..."
            hideTableExport={true}
          />

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
