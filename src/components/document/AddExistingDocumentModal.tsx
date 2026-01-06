import React, { useState } from "react";
import { X, Search, Copy, MoveRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EnhancedTable } from "@/components/enhanced-table/EnhancedTable";
import { ColumnConfig } from "@/hooks/useEnhancedTable";

interface AddExistingDocumentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectDocuments: (documentIds: number[], action: "copy" | "move") => void;
}

interface Document {
  id: number;
  title: string;
  category: string;
  folder: string;
  format: string;
  size: string;
  created_by: string;
  created_on: string;
  status: string;
}

const mockDocuments: Document[] = [
  {
    id: 1,
    title: "Lease Agreement",
    category: "Lease / Legal",
    folder: "Lease Agreements",
    format: "PDF",
    size: "1.2 MB",
    created_by: "Rohan Desai",
    created_on: "2024-01-15",
    status: "Active",
  },
  {
    id: 2,
    title: "Fire Safety Drill Report",
    category: "Safety & Compliance",
    folder: "Fire Safety Certificates",
    format: "DOCX",
    size: "320 KB",
    created_by: "Priya Kulkarni",
    created_on: "2024-01-14",
    status: "Active",
  },
  {
    id: 3,
    title: "Visitor Pass Template",
    category: "Templates",
    folder: "Visitor Pass Templates",
    format: "PDF",
    size: "450 KB",
    created_by: "Admin System",
    created_on: "2024-01-13",
    status: "Active",
  },
  {
    id: 4,
    title: "Maintenance Work Order",
    category: "Maintenance",
    folder: "Work Orders",
    format: "XLSX",
    size: "780 KB",
    created_by: "Mahesh Patil",
    created_on: "2024-01-12",
    status: "Active",
  },
];

const columns: ColumnConfig[] = [
  { key: "title", label: "Title", sortable: true, defaultVisible: true },
  { key: "category", label: "Category", sortable: true, defaultVisible: true },
  { key: "folder", label: "Folder", sortable: true, defaultVisible: true },
  { key: "format", label: "Format", sortable: true, defaultVisible: true },
  { key: "size", label: "Size", sortable: true, defaultVisible: true },
  {
    key: "created_by",
    label: "Created By",
    sortable: true,
    defaultVisible: true,
  },
  {
    key: "created_on",
    label: "Created On",
    sortable: true,
    defaultVisible: true,
  },
  { key: "status", label: "Status", sortable: true, defaultVisible: true },
];

export const AddExistingDocumentModal: React.FC<
  AddExistingDocumentModalProps
> = ({ isOpen, onClose, onSelectDocuments }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [action, setAction] = useState<"copy" | "move">("copy");
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  if (!isOpen) return null;

  const handleConfirm = () => {
    const selectedIds = selectedItems.map((id) => parseInt(id, 10));
    onSelectDocuments(selectedIds, action);
  };

  const handleSelectItem = (itemId: string, checked: boolean) => {
    if (checked) {
      setSelectedItems([...selectedItems, itemId]);
    } else {
      setSelectedItems(selectedItems.filter((id) => id !== itemId));
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedItems(filteredDocuments.map((doc) => doc.id.toString()));
    } else {
      setSelectedItems([]);
    }
  };

  const filteredDocuments = mockDocuments.filter((doc) =>
    Object.values(doc).some((value) =>
      value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-7xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-[#1a1a1a]">
            Select Existing Documents
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Search and Action Selection */}
        <div className="border-b border-gray-200 p-6 space-y-4">
          {/* Search Bar */}

          {/* Copy/Move Radio Buttons */}
          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="action"
                value="copy"
                checked={action === "copy"}
                onChange={(e) => setAction(e.target.value as "copy")}
                className="w-4 h-4 text-[#C72030] focus:ring-[#C72030]"
              />
              <span className="text-sm font-medium text-gray-700">Copy</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="action"
                value="move"
                checked={action === "move"}
                onChange={(e) => setAction(e.target.value as "move")}
                className="w-4 h-4 text-[#C72030] focus:ring-[#C72030]"
              />
              <span className="text-sm font-medium text-gray-700">Move</span>
            </label>
          </div>
        </div>

        {/* Table */}
        <div className="flex-1 overflow-auto p-6">
          <EnhancedTable
            data={filteredDocuments}
            columns={columns}
            selectable={true}
            selectedItems={selectedItems}
            onSelectItem={handleSelectItem}
            onSelectAll={handleSelectAll}
            getItemId={(doc) => doc.id.toString()}
            renderCell={(doc, columnKey) => {
              const value = doc[columnKey as keyof Document];
              return <span>{value}</span>;
            }}
            enableSearch={true}
            pagination={true}
            pageSize={10}
            hideTableSearch={false}
          />
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-6 flex items-center justify-between">
          <p className="text-sm text-gray-600">
            {selectedItems.length} document(s) selected
          </p>
          <div className="flex gap-3">
            <Button onClick={onClose} variant="outline" className="px-6">
              Cancel
            </Button>
            <Button
              onClick={handleConfirm}
              className="bg-[#C72030] hover:bg-[#A01828] text-white px-6"
              disabled={selectedItems.length === 0}
            >
              Confirm
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
