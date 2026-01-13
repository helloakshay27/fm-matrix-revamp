import React, { useState, useEffect } from "react";
import { X, Search, Copy, MoveRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EnhancedTable } from "@/components/enhanced-table/EnhancedTable";
import { ColumnConfig } from "@/hooks/useEnhancedTable";
import {
  getDocuments,
  Document as ApiDocument,
} from "@/services/documentService";
import { toast } from "sonner";

interface AddExistingDocumentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectDocuments: (documents: Document[]) => void;
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
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      const response = await getDocuments(1);

      // Transform API documents to match our Document interface
      const transformedDocs: Document[] = response.documents.map((doc) => ({
        id: doc.id,
        title: doc.title,
        category: doc.document_category_name || "N/A",
        folder: doc.folder_name || "N/A",
        format:
          doc.attachment?.filename.split(".").pop()?.toUpperCase() || "FILE",
        size: formatFileSize(doc.attachment?.file_size || 0),
        created_by: doc.created_by_full_name || "Unknown",
        created_on: formatDate(doc.created_at),
        status: doc.active ? "Active" : "Inactive",
      }));

      setDocuments(transformedDocs);
    } catch (error) {
      console.error("Error fetching documents:", error);
      toast.error("Failed to load documents");
    } finally {
      setLoading(false);
    }
  };

  // Fetch documents when modal opens and reset selection when it closes
  useEffect(() => {
    if (isOpen) {
      fetchDocuments();
      setSelectedItems([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i)) + " " + sizes[i];
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = {
      day: "2-digit",
      month: "short",
      year: "numeric",
    };
    return date.toLocaleDateString("en-GB", options);
  };

  if (!isOpen) return null;

  const handleConfirm = () => {
    if (selectedItems.length === 0) {
      toast.error("Please select at least one document");
      return;
    }
    const selectedDocs = documents.filter((doc) =>
      selectedItems.includes(doc.id.toString())
    );
    onSelectDocuments(selectedDocs);
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

  const filteredDocuments = documents.filter((doc) =>
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

        {/* Search Section */}
        <div className="border-b border-gray-200 p-6 space-y-4">
          {/* Search Bar - placeholder for future implementation */}
        </div>

        {/* Table */}
        <div className="flex-1 overflow-auto p-6">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="text-gray-500">Loading documents...</div>
            </div>
          ) : (
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
          )}
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
