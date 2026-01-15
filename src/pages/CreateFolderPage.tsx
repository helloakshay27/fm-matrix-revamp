import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Eye, Plus, Trash2, MoveRight, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { AddDocumentModal } from "@/components/document/AddDocumentModal";
import { AddExistingDocumentModal } from "@/components/document/AddExistingDocumentModal";
import { EnhancedTable } from "@/components/enhanced-table/EnhancedTable";
import { ColumnConfig } from "@/hooks/useEnhancedTable";

import {
  getCategories,
  createFolder,
  fileToBase64,
  Category,
  CreateFolderPayload,
} from "@/services/documentService";

interface NewDocument {
  id?: number;
  title: string;
  documentCategory: string;
  attachment: string; // base64 string
  fileName?: string;
  fileSize?: number;
  format?: string;
  size?: string;
}

interface SelectedDocument {
  id: number;
  title: string;
  category: string;
  folder: string;
  format: string;
  size: string;
  created_by: string;
}

const columns: ColumnConfig[] = [
  { key: "title", label: "Title", sortable: true, defaultVisible: true },
  {
    key: "documentCategory",
    label: "Category",
    sortable: true,
    defaultVisible: true,
  },
  { key: "format", label: "Format", sortable: true, defaultVisible: true },
  { key: "size", label: "Size", sortable: true, defaultVisible: true },
];

export const CreateFolderPage = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [categoryId, setCategoryId] = useState<string>("");
  const [shareWith, setShareWith] = useState<"all" | "individual">("all");
  const [shareWithCommunities, setShareWithCommunities] = useState<
    "yes" | "no"
  >("no");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showExistingDocModal, setShowExistingDocModal] = useState(false);
  const [showActionPanel, setShowActionPanel] = useState(false);
  const [selectedDocsForAction, setSelectedDocsForAction] = useState<
    SelectedDocument[]
  >([]);
  const [moveDocuments, setMoveDocuments] = useState<SelectedDocument[]>([]);
  const [copyDocuments, setCopyDocuments] = useState<SelectedDocument[]>([]);
  const [newDocuments, setNewDocuments] = useState<NewDocument[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedTechParks, setSelectedTechParks] = useState<number[]>([]);
  const [selectedCommunities, setSelectedCommunities] = useState<
    { id: number; name: string }[]
  >([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitProgress, setSubmitProgress] = useState<string>("");

  // Fetch categories on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const categoriesData = await getCategories();
        setCategories(categoriesData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  // Check for pending documents from AddDocumentDashboard
  useEffect(() => {
    const pendingDocs = sessionStorage.getItem("pendingDocuments");
    const folderSettings = sessionStorage.getItem("folderSettings");

    if (pendingDocs) {
      const docs: NewDocument[] = JSON.parse(pendingDocs);
      // Add IDs and file metadata
      const docsWithMetadata = docs.map((doc, index) => ({
        ...doc,
        id: Date.now() + index,
        format: doc.fileName
          ? doc.fileName.split(".").pop()?.toUpperCase() || "PDF"
          : "PDF",
        size: doc.fileSize ? formatFileSize(doc.fileSize) : "0 KB",
      }));
      // Append to existing documents instead of replacing
      setNewDocuments((prev) => [...prev, ...docsWithMetadata]);
      sessionStorage.removeItem("pendingDocuments");
      toast.success(
        `${docsWithMetadata.length} document(s) added to insert list`
      );
    }

    if (folderSettings) {
      const settings = JSON.parse(folderSettings);
      // Only set if not already set (preserve user input)
      if (!categoryId && settings.categoryId) {
        setCategoryId(settings.categoryId);
      }
      if (settings.shareWith) {
        setShareWith(settings.shareWith);
      }
      if (settings.shareWithCommunities) {
        setShareWithCommunities(settings.shareWithCommunities);
      }
      if (settings.selectedTechParks) {
        setSelectedTechParks(settings.selectedTechParks);
      }
      if (settings.selectedCommunities) {
        setSelectedCommunities(settings.selectedCommunities);
      }
      // Restore move and copy documents
      if (settings.moveDocuments) {
        setMoveDocuments(settings.moveDocuments);
      }
      if (settings.copyDocuments) {
        setCopyDocuments(settings.copyDocuments);
      }
      // Restore folder title and category
      if (settings.title) {
        setTitle(settings.title);
      }
      sessionStorage.removeItem("folderSettings");
    }
  }, []); // Empty dependency array to run only once on mount

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 KB";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
  };

  const handleAddClick = () => {
    // Show action panel to choose between Add Document and Create New
    setShowAddModal(true);
  };

  const handleAddExisting = () => {
    setShowAddModal(false);
    setShowExistingDocModal(true);
  };

  const handleDocumentsSelected = (docs: SelectedDocument[]) => {
    // Store selected documents and show action panel
    setSelectedDocsForAction(docs);
    setShowExistingDocModal(false);
    setShowActionPanel(true);
  };

  const handleActionSelected = (action: "copy" | "move") => {
    if (action === "move") {
      setMoveDocuments((prev) => {
        const existingIds = new Set(prev.map((d) => d.id));
        const newDocs = selectedDocsForAction.filter(
          (d) => !existingIds.has(d.id)
        );
        if (newDocs.length > 0) {
          toast.success(`${newDocs.length} document(s) added to move list`);
        } else {
          toast.info("Selected documents are already in the move list");
        }
        return [...prev, ...newDocs];
      });
    } else {
      setCopyDocuments((prev) => {
        const existingIds = new Set(prev.map((d) => d.id));
        const newDocs = selectedDocsForAction.filter(
          (d) => !existingIds.has(d.id)
        );
        if (newDocs.length > 0) {
          toast.success(`${newDocs.length} document(s) added to copy list`);
        } else {
          toast.info("Selected documents are already in the copy list");
        }
        return [...prev, ...newDocs];
      });
    }
    setShowActionPanel(false);
    setSelectedDocsForAction([]);
  };

  const handleCreateNew = () => {
    setShowAddModal(false);

    // Save current state to sessionStorage before navigating
    const folderSettings = {
      title: title,
      categoryId: categoryId,
      shareWith: shareWith,
      shareWithCommunities: shareWithCommunities,
      selectedTechParks: selectedTechParks,
      selectedCommunities: selectedCommunities,
      moveDocuments: moveDocuments,
      copyDocuments: copyDocuments,
    };
    sessionStorage.setItem("folderSettings", JSON.stringify(folderSettings));

    navigate("/maintenance/documents/add?source=new");
  };

  const handleSubmit = async () => {
    if (!title) {
      toast.error("Please enter a folder name");
      return;
    }

    setIsSubmitting(true);
    setSubmitProgress("Creating folder...");

    try {
      // Show progress for inserting documents
      if (newDocuments.length > 0) {
        setSubmitProgress(`Inserting ${newDocuments.length} document(s)...`);
        await new Promise((resolve) => setTimeout(resolve, 300)); // Brief delay for UX
      }

      // Show progress for moving documents
      if (moveDocuments.length > 0) {
        setSubmitProgress(`Moving ${moveDocuments.length} document(s)...`);
        await new Promise((resolve) => setTimeout(resolve, 300)); // Brief delay for UX
      }

      // Show progress for copying documents
      if (copyDocuments.length > 0) {
        setSubmitProgress(`Copying ${copyDocuments.length} document(s)...`);
        await new Promise((resolve) => setTimeout(resolve, 300)); // Brief delay for UX
      }

      setSubmitProgress("Finalizing...");

      // Use base64 attachments directly
      const documentsPayload = newDocuments.map((doc) => ({
        title: doc.title,
        attachments: [
          {
            filename: doc.fileName || "document.pdf",
            content_type: doc.format
              ? `application/${doc.format.toLowerCase()}`
              : "application/pdf",
            content: doc.attachment || "",
          },
        ],
      }));

      const payload: CreateFolderPayload = {
        folder: {
          name: title,
          category_id: parseInt(categoryId, 10),
          // parent_id: 1, // Default
          // of_phase: 'post_sale', // Default
        },
        permissions: [
          {
            access_level: shareWith === "all" ? "all" : "selected",
            access_to: "Pms::Site",
            access_ids: shareWith === "individual" ? selectedTechParks : [],
          },
          {
            access_level: shareWithCommunities === "all" ? "all" : "selected",
            access_to: "Community",
            access_ids:
              shareWithCommunities === "yes"
                ? selectedCommunities.map((c) => c.id)
                : [],
          },
        ],
        documents: documentsPayload,
        move_document_ids: moveDocuments.map((doc) => doc.id),
        copy_document_ids: copyDocuments.map((doc) => doc.id),
      };

      const response = await createFolder(payload);

      toast.success("Folder created successfully!");
      navigate("/maintenance/documents");
    } catch (error: unknown) {
      console.error("Error creating folder:", error);
      const err = error as {
        response?: { data?: { message?: string } };
        message?: string;
      };
      console.error("Error response:", err?.response?.data);

      const errorMessage =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to create folder. Please try again.";
      toast.error(`Error: ${errorMessage}`);
    } finally {
      setIsSubmitting(false);
      setSubmitProgress("");
    }
  };

  const handleRemoveNewDocument = (docId: number) => {
    setNewDocuments(newDocuments.filter((doc) => doc.id !== docId));
  };

  const handleRemoveMoveDocument = (docId: number) => {
    setMoveDocuments(moveDocuments.filter((doc) => doc.id !== docId));
  };

  const handleRemoveCopyDocument = (docId: number) => {
    setCopyDocuments(copyDocuments.filter((doc) => doc.id !== docId));
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
      <div className="w-full mx-auto p-6">
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          {/* Folder Details Section */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-[#1a1a1a] mb-4">
              Folder Details
            </h2>

            {/* Title Field */}
            <div className="max-w-md">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Folder Name
              </label>
              <input
                type="text"
                placeholder="Enter Folder Name"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#C72030] focus:border-transparent h-[45px]"
              />
            </div>
          </div>

          {/* Add Document Section */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-[#1a1a1a] mb-4">
              Insert Document
            </h2>

            <Button
              onClick={handleAddClick}
              className="bg-[#C72030] text-white hover:bg-[#C72030]/90 h-9 px-4 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={!title}
            >
              <Plus className="w-4 h-4 mr-2" /> Add
            </Button>

            {/* New Documents Table */}
            {newDocuments.length > 0 && (
              <div className="mt-6 border border-gray-200 rounded-lg overflow-hidden">
                <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                  <p className="text-sm font-medium text-[#1a1a1a]">
                    {newDocuments.length} new document(s)
                  </p>
                </div>
                <div className="overflow-x-auto">
                  <EnhancedTable
                    data={newDocuments}
                    columns={columns}
                    renderCell={(doc, columnKey) => {
                      if (columnKey === "documentCategory") {
                        const value = doc[columnKey];
                        const category = categories.find(
                          (c) => c.id.toString() === value
                        );
                        return <span>{category?.name || value}</span>;
                      }
                      const value = doc[columnKey as keyof NewDocument];
                      return <span>{String(value || "")}</span>;
                    }}
                    renderActions={(doc) => (
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => handleRemoveNewDocument(doc.id!)}
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

            {/* Move Documents Table */}
            {moveDocuments.length > 0 && (
              <div className="mt-6 border border-gray-200 rounded-lg overflow-hidden">
                <div className="bg-orange-50 px-4 py-3 border-b border-orange-200 flex items-center gap-2">
                  <MoveRight className="w-4 h-4 text-orange-600" />
                  <p className="text-sm font-medium text-orange-900">
                    {moveDocuments.length} document(s) to Move
                  </p>
                </div>
                <div className="overflow-x-auto">
                  <EnhancedTable
                    data={moveDocuments}
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
                          onClick={() => handleRemoveMoveDocument(doc.id)}
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

            {/* Copy Documents Table */}
            {copyDocuments.length > 0 && (
              <div className="mt-6 border border-gray-200 rounded-lg overflow-hidden">
                <div className="bg-blue-50 px-4 py-3 border-b border-blue-200 flex items-center gap-2">
                  <Copy className="w-4 h-4 text-blue-600" />
                  <p className="text-sm font-medium text-blue-900">
                    {copyDocuments.length} document(s) to Copy
                  </p>
                </div>
                <div className="overflow-x-auto">
                  <EnhancedTable
                    data={copyDocuments}
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
                          onClick={() => handleRemoveCopyDocument(doc.id)}
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
              className="bg-[#C72030] hover:bg-[#A01828] text-white px-12 py-3 rounded-md font-medium min-w-[200px]"
              disabled={!title || isSubmitting}
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                  <span>{submitProgress || "Processing..."}</span>
                </div>
              ) : (
                "Submit"
              )}
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
        onSelectDocuments={(docs) => {
          // Transform to SelectedDocument format
          const selectedDocs: SelectedDocument[] = docs.map((doc) => ({
            id: doc.id,
            title: doc.title,
            category: doc.category,
            folder: doc.folder,
            format: doc.format,
            size: doc.size,
            created_by: doc.created_by,
          }));
          handleDocumentsSelected(selectedDocs);
        }}
      />

      {/* Action Selection Panel for Copy/Move */}
      <AddDocumentModal
        isOpen={showActionPanel}
        onClose={() => {
          setShowActionPanel(false);
          setSelectedDocsForAction([]);
        }}
        onAddExisting={() => handleActionSelected("copy")}
        onCreateNew={() => handleActionSelected("move")}
        customLabels={{
          addExisting: "Copy",
          createNew: "Move",
        }}
      />
    </div>
  );
};
