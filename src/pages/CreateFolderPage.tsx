import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Eye, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AddDocumentModal } from "@/components/document/AddDocumentModal";
import { AddExistingDocumentModal } from "@/components/document/AddExistingDocumentModal";
import { EnhancedTable } from "@/components/enhanced-table/EnhancedTable";
import { ColumnConfig } from "@/hooks/useEnhancedTable";

interface SelectedDocument {
  id: number;
  title: string;
  category: string;
  folder: string;
  format: string;
  size: string;
  created_by: string;
}

// Mock data to map selected IDs to document details
const documentData: Record<number, SelectedDocument> = {
  1: {
    id: 1,
    title: "Lease Agreement",
    category: "Lease / Legal",
    folder: "Lease Agreements",
    format: "PDF",
    size: "1.2 MB",
    created_by: "Rohan Desai",
  },
  2: {
    id: 2,
    title: "Fire Safety Drill Report",
    category: "Safety & Compliance",
    folder: "Fire Safety Certificates",
    format: "DOCX",
    size: "320 KB",
    created_by: "Priya Kulkarni",
  },
  3: {
    id: 3,
    title: "Visitor Pass Template",
    category: "Templates",
    folder: "Visitor Pass Templates",
    format: "PDF",
    size: "450 KB",
    created_by: "Admin System",
  },
  4: {
    id: 4,
    title: "Maintenance Work Order",
    category: "Maintenance",
    folder: "Work Orders",
    format: "XLSX",
    size: "780 KB",
    created_by: "Mahesh Patil",
  },
};

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
];

export const CreateFolderPage = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showExistingDocModal, setShowExistingDocModal] = useState(false);
  const [selectedDocuments, setSelectedDocuments] = useState<number[]>([]);
  const [documentAction, setDocumentAction] = useState<"copy" | "move">("copy");

  const handleAddClick = () => {
    setShowAddModal(true);
  };

  const handleAddExisting = () => {
    setShowAddModal(false);
    setShowExistingDocModal(true);
  };

  const handleCreateNew = () => {
    setShowAddModal(false);
    navigate("/maintenance/documents/add");
  };

  const handleSubmit = () => {
    // TODO: Implement folder creation API call
    navigate("/maintenance/documents");
  };

  const handleRemoveDocument = (docId: number) => {
    setSelectedDocuments(selectedDocuments.filter((id) => id !== docId));
  };

  const getSelectedDocumentDetails = (): SelectedDocument[] => {
    return selectedDocuments.map((id) => documentData[id]).filter(Boolean);
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
          <h1 className="text-2xl font-bold text-[#1a1a1a]">
            Create New Folder
          </h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-[1400px] mx-auto p-6">
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          {/* Document Details Section */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-[#1a1a1a] mb-4">
              Document Details
            </h2>

            {/* Title Field */}
            <div className="max-w-md">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title
              </label>
              <input
                type="text"
                placeholder="Enter Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#C72030] focus:border-transparent"
              />
            </div>
          </div>

          {/* Add Document Section */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-[#1a1a1a] mb-4">
              Add Document
            </h2>

            <button
              onClick={handleAddClick}
              className="px-6 py-2 bg-[#F6F4EE] text-[#C72030] rounded-md hover:bg-[#E5E0D3] transition-colors flex items-center gap-2 font-medium"
            >
              <span className="text-lg">+</span>
              Add
            </button>

            {selectedDocuments.length > 0 && (
              <div className="mt-6 border border-gray-200 rounded-lg overflow-hidden">
                <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                  <p className="text-sm font-medium text-[#1a1a1a]">
                    {selectedDocuments.length} document(s) selected to{" "}
                    {documentAction}
                  </p>
                </div>
                <div className="overflow-x-auto">
                  <EnhancedTable
                    data={getSelectedDocumentDetails()}
                    columns={columns}
                    renderCell={(doc, columnKey) => {
                      const value = doc[columnKey as keyof SelectedDocument];
                      return <span>{value}</span>;
                    }}
                    renderActions={(doc) => (
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Eye className="h-4 w-4 text-gray-600" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => handleRemoveDocument(doc.id)}
                        >
                          <Trash2 className="h-4 w-4 text-red-600" />
                        </Button>
                      </div>
                    )}
                    enableSearch={false}
                    pagination={false}
                    hideTableSearch={true}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="flex justify-center">
            <Button
              onClick={handleSubmit}
              className="bg-[#C72030] hover:bg-[#A01828] text-white px-12 py-3 rounded-md font-medium"
              disabled={!title}
            >
              Submit
            </Button>
          </div>
        </div>
      </div>

      {/* Add Document Modal */}
      <AddDocumentModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAddExisting={handleAddExisting}
        onCreateNew={handleCreateNew}
      />

      {/* Add Existing Document Modal */}
      <AddExistingDocumentModal
        isOpen={showExistingDocModal}
        onClose={() => setShowExistingDocModal(false)}
        onSelectDocuments={(docs, action) => {
          setSelectedDocuments(docs);
          setDocumentAction(action);
          setShowExistingDocModal(false);
        }}
      />
    </div>
  );
};
