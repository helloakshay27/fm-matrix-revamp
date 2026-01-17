import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Pencil,
  Trash2,
  FileText,
  Download,
  Edit2,
  Copy,
  Move,
  Share2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import {
  getDocumentDetail,
  deleteDocument,
  Document,
  DocumentAttachment,
  bulkMoveCopyDocuments,
  updateDocumentStatus,
  shareDocument,
  ShareDocumentPayload,
} from "@/services/documentService";
import { OnlyOfficeEditor } from "@/components/document/OnlyOfficeEditor";
import { BulkMoveDialog } from "@/components/document/BulkMoveDialog";
import { DocumentShareModal } from "@/components/document/DocumentShareModal";

interface DocumentPermission {
  id: number;
  permissible_type: string;
  permissible_id: number;
  access_to: string | null;
  access_level: string;
  access_scope: string;
  access_ids: string | null;
  access_records: Array<{
    id: number;
    name: string;
  }>;
}

interface DocumentPermission {
  id: number;
  permissible_type: string;
  permissible_id: number;
  access_to: string | null;
  access_level: string;
  access_scope: string;
  access_ids: string | null;
  access_records: Array<{
    id: number;
    name: string;
  }>;
}

interface DocumentUser {
  id: number;
  user_type: "internal" | "external";
  user_id: number | null;
  email: string | null;
  access_level: "viewer" | "editor";
  status: string;
  invited_by_id: number;
  user_name: string;
}

interface DocumentDetail {
  id: number;
  title: string;
  category_id: number;
  folder_id: number;
  document_category_name: string | null;
  created_by_full_name: string | null;
  folder_name: string;
  created_at: string;
  active: boolean | null;
  public_uuid?: string | null;
  attachment: DocumentAttachment;
  document_permissions?: DocumentPermission[];
  document_users?: DocumentUser[];
}

export const DocumentDetailPage = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [document, setDocument] = useState<DocumentDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [showEditor, setShowEditor] = useState(false);
  const [showMoveDialog, setShowMoveDialog] = useState(false);
  const [showCopyDialog, setShowCopyDialog] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [operationType, setOperationType] = useState<"move" | "copy">("move");
  const hostname = window.location.hostname;

  const isPulseSite = hostname.includes("pulse.lockated.com");

  useEffect(() => {
    const fetchDocument = async () => {
      if (!id) return;

      try {
        setLoading(true);
        const response = await getDocumentDetail(parseInt(id, 10));
        setDocument(response);
      } catch (error) {
        console.error("Error fetching document:", error);
        toast.error("Failed to load document details");
      } finally {
        setLoading(false);
      }
    };

    fetchDocument();
  }, [id]);

  const handleEdit = () => {
    navigate(`/maintenance/documents/edit/${id}`);
  };

  const handleDelete = async () => {
    if (
      !id ||
      !window.confirm("Are you sure you want to delete this document?")
    ) {
      return;
    }

    try {
      await deleteDocument(parseInt(id, 10));
      toast.success("Document deleted successfully");
      navigate("/maintenance/documents");
    } catch (error) {
      console.error("Error deleting document:", error);
      toast.error("Failed to delete document");
    }
  };

  const handleShare = () => {
    setShowShareModal(true);
  };

  const handleSaveShares = async (
    shares: Array<{
      id: string;
      user_type: "internal" | "external";
      user_id: number | null;
      email: string | null;
      full_name?: string;
      access_level: "viewer" | "editor";
    }>
  ) => {
    if (!document || !id) return;

    try {
      // Get existing shares
      const existingShares = document.document_users || [];
      const existingShareIds = existingShares.map((s) => s.id.toString());

      // Identify new shares (shares that don't have an ID in existingShares)
      const newShares = shares
        .filter((share) => {
          // If the share ID is a number from existing shares, skip it
          return !existingShareIds.includes(share.id);
        })
        .map((share) => ({
          user_type: share.user_type,
          user_id: share.user_id,
          email: share.email,
          access_level: share.access_level,
        }));

      // Identify removed shares (existing shares not in current shares list)
      const currentShareIds = shares.map((s) => s.id);
      const removedShares = existingShares
        .filter((existing) => !currentShareIds.includes(existing.id.toString()))
        .map((existing) => ({ id: existing.id }));

      // Build payload
      const payload: ShareDocumentPayload = {
        shares: newShares,
        unshare: removedShares,
      };

      // Call API
      await shareDocument(parseInt(id, 10), payload);
      toast.success("Document shares updated successfully");

      // Refresh document data to get updated shares
      const response = await getDocumentDetail(parseInt(id, 10));
      setDocument(response);
      setShowShareModal(false);
    } catch (error) {
      console.error("Error updating shares:", error);
      toast.error("Failed to update document shares");
    }
  };

  const handleToggleStatus = async (checked: boolean) => {
    if (!document || !id) return;

    try {
      await updateDocumentStatus(parseInt(id), checked);
      setDocument({ ...document, active: checked });
      toast.success(
        `Document ${checked ? "activated" : "deactivated"} successfully`
      );
    } catch (error) {
      console.error("Error updating document status:", error);
      toast.error("Failed to update document status");
    }
  };

  const handleDownload = (url: string, filename: string) => {
    // S3 URL is passed as-is, no need to construct with baseUrl
    const fullUrl = decodeURIComponent(url);

    // Create a temporary anchor element to trigger download
    const link = window.document.createElement("a");
    link.href = fullUrl;
    link.download = filename;
    link.target = "_blank";
    window.document.body.appendChild(link);
    link.click();
    window.document.body.removeChild(link);

    toast.success("Downloading document...");
  };

  const handleOpenEditor = () => {
    setShowEditor(true);
  };

  const handleCloseEditor = () => {
    setShowEditor(false);
  };

  const handleMove = () => {
    if (!document) {
      toast.error("Document not loaded");
      return;
    }
    setOperationType("move");
    setShowMoveDialog(true);
  };

  const handleCopy = () => {
    if (!document) {
      toast.error("Document not loaded");
      return;
    }
    setOperationType("copy");
    setShowCopyDialog(true);
  };

  const handleBulkMoveConfirm = async (targetFolderIds: number[]) => {
    if (!id || !document) return;

    try {
      const payload: {
        move?: {
          from_folder_id: number;
          to_folder_ids: number[];
          document_ids: number[];
        };
        copy?: {
          from_folder_id: number;
          to_folder_ids: number[];
          document_ids: number[];
        };
      } = {};

      if (operationType === "move") {
        payload.move = {
          from_folder_id: document.folder_id,
          to_folder_ids: targetFolderIds,
          document_ids: [parseInt(id)],
        };
      } else {
        payload.copy = {
          from_folder_id: document.folder_id,
          to_folder_ids: targetFolderIds,
          document_ids: [parseInt(id)],
        };
      }

      await bulkMoveCopyDocuments(payload);

      toast.success(
        `Successfully ${operationType === "move" ? "moved" : "copied"} document`
      );

      setShowMoveDialog(false);
      setShowCopyDialog(false);

      // If moved, navigate back to documents list
      if (operationType === "move") {
        navigate("/maintenance/documents");
      }
    } catch (error) {
      console.error(
        `Error ${operationType === "move" ? "moving" : "copying"} document:`,
        error
      );
      toast.error(`Failed to ${operationType} document`);
    }
  };

  const isEditableDocument = (filename: string): boolean => {
    const ext = filename.split(".").pop()?.toLowerCase() || "";
    return [
      "doc",
      "docx",
      "xls",
      "xlsx",
      "ppt",
      "pptx",
      "pdf",
      "odt",
      "ods",
      "odp",
      "rtf",
      "txt",
      "csv",
    ].includes(ext);
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

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i)) + " " + sizes[i];
  };

  const getFileExtension = (filename: string): string => {
    return filename.split(".").pop()?.toUpperCase() || "FILE";
  };

  // Get site permissions (access_to: "Pms::Site")
  const getSitePermissions = () => {
    const sitePermission = document?.document_permissions?.find(
      (perm) => perm.access_to === "Pms::Site"
    );

    if (!sitePermission) return null;

    if (
      sitePermission.access_level === "all" ||
      sitePermission.access_scope === "all_records"
    ) {
      return "All Sites";
    }

    if (
      sitePermission.access_records &&
      sitePermission.access_records.length > 0
    ) {
      return sitePermission.access_records;
    }

    return null;
  };

  // Get community permissions (access_to: "Community")
  const getCommunityPermissions = () => {
    const communityPermission = document?.document_permissions?.find(
      (perm) => perm.access_to === "Community"
    );

    if (!communityPermission) return null;

    if (
      communityPermission.access_level === "all" ||
      communityPermission.access_scope === "all_records"
    ) {
      return "All Communities";
    }

    if (
      communityPermission.access_records &&
      communityPermission.access_records.length > 0
    ) {
      return communityPermission.access_records;
    }

    return null;
  };

  const sitePermissions = getSitePermissions();
  const communityPermissions = getCommunityPermissions();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">Loading document...</div>
      </div>
    );
  }

  if (!document) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">Document not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-500">
            Document &gt; Document Detail
          </div>
          <div className="flex items-center gap-3">
            {/* Share Button */}
            <button
              onClick={handleShare}
              className="w-10 h-10 border border-[#C72030] rounded flex items-center justify-center hover:bg-[#FFF5F5] transition-colors"
              title="Share Document"
            >
              <Share2 className="w-5 h-5 text-[#C72030]" />
            </button>
            {/* Move Button */}
            <button
              onClick={handleMove}
              className="w-10 h-10 border border-[#C72030] rounded flex items-center justify-center hover:bg-[#FFF5F5] transition-colors"
              title="Move Document"
            >
              <Move className="w-5 h-5 text-[#C72030]" />
            </button>
            {/* Copy Button */}
            <button
              onClick={handleCopy}
              className="w-10 h-10 border border-[#C72030] rounded flex items-center justify-center hover:bg-[#FFF5F5] transition-colors"
              title="Copy Document"
            >
              <Copy className="w-5 h-5 text-[#C72030]" />
            </button>
            {/* Edit Button */}
            <button
              onClick={handleEdit}
              className="w-10 h-10 border border-[#C72030] rounded flex items-center justify-center hover:bg-[#FFF5F5] transition-colors"
              title="Edit Document"
            >
              <Pencil className="w-5 h-5 text-[#C72030]" />
            </button>
            {/* Delete Button */}
            <button
              onClick={handleDelete}
              className="w-10 h-10 border border-[#C72030] rounded flex items-center justify-center hover:bg-[#FFF5F5] transition-colors"
              title="Delete Document"
            >
              <Trash2 className="w-5 h-5 text-[#C72030]" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="w-full p-6 space-y-6">
        {/* Document Title Section */}
        <div className="bg-[#F6F4EE] border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-white rounded flex items-center justify-center">
                <FileText className="w-8 h-8 text-[#C72030]" />
              </div>
              <h1 className="text-2xl font-semibold text-[#1a1a1a]">
                {document.title}
              </h1>
            </div>
            <div className="flex items-center gap-3">
              <Switch
                checked={document.active ?? false}
                onCheckedChange={handleToggleStatus}
                className="data-[state=checked]:bg-green-500"
              />
              <span
                className={`text-sm font-medium ${
                  document.active ? "text-green-600" : "text-gray-500"
                }`}
              >
                {document.active ? "Active" : "Inactive"}
              </span>
            </div>
          </div>

          {/* Document Info Grid */}
          <div className="grid grid-cols-2 gap-x-12 gap-y-4 mt-6">
            <div>
              <p className="text-sm text-gray-500 mb-1">Category</p>
              <p className="font-medium text-[#1a1a1a]">
                {document.document_category_name || "Uncategorized"}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Created By</p>
              <p className="font-medium text-[#1a1a1a]">
                {document.created_by_full_name || "Unknown"}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Folder</p>
              <p className="font-medium text-[#1a1a1a]">
                {document.folder_name}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Created On</p>
              <p className="font-medium text-[#1a1a1a]">
                {formatDate(document.created_at)}
              </p>
            </div>
          </div>
        </div>

        {/* Share Section */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-[#F6F4EE] rounded flex items-center justify-center">
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M15 14C14.212 14 13.5 14.31 12.966 14.807L7.91 11.629C7.96 11.424 8 11.214 8 11C8 10.786 7.96 10.576 7.91 10.371L12.96 7.193C13.5 7.69 14.212 8 15 8C16.657 8 18 6.657 18 5C18 3.343 16.657 2 15 2C13.343 2 12 3.343 12 5C12 5.214 12.04 5.424 12.09 5.629L7.04 8.807C6.5 8.31 5.788 8 5 8C3.343 8 2 9.343 2 11C2 12.657 3.343 14 5 14C5.788 14 6.5 13.69 7.034 13.193L12.09 16.371C12.04 16.576 12 16.786 12 17C12 18.657 13.343 20 15 20C16.657 20 18 18.657 18 17C18 15.343 16.657 14 15 14Z"
                  fill="#C72030"
                />
              </svg>
            </div>
            <h2 className="text-lg font-semibold text-[#1a1a1a]">Share</h2>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-gray-500 mb-2">Site Permissions</p>
              <div className="space-y-1">
                {sitePermissions ? (
                  typeof sitePermissions === "string" ? (
                    <p className="font-medium text-[#1a1a1a]">
                      {sitePermissions}
                    </p>
                  ) : (
                    sitePermissions.map((site) => (
                      <p key={site.id} className="font-medium text-[#1a1a1a]">
                        {site.name}
                      </p>
                    ))
                  )
                ) : (
                  <p className="font-medium text-gray-400">No sites selected</p>
                )}
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-2">
                Community Permissions
              </p>
              <div className="space-y-1">
                {communityPermissions ? (
                  typeof communityPermissions === "string" ? (
                    <p className="font-medium text-[#1a1a1a]">
                      {communityPermissions}
                    </p>
                  ) : (
                    communityPermissions.map((community) => (
                      <p
                        key={community.id}
                        className="font-medium text-[#1a1a1a]"
                      >
                        {community.name}
                      </p>
                    ))
                  )
                ) : (
                  <p className="font-medium text-gray-400">
                    No communities selected
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Attachment Section */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-[#F6F4EE] rounded flex items-center justify-center">
              <FileText className="w-5 h-5 text-[#C72030]" />
            </div>
            <h2 className="text-lg font-semibold text-[#1a1a1a]">Attachment</h2>
          </div>

          <div>
            <p className="text-sm font-medium text-[#1a1a1a] mb-4">
              Document File
            </p>
            <div className="grid grid-cols-2 gap-4">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center gap-3 hover:border-[#C72030] transition-colors group cursor-pointer relative">
                <div className="relative">
                  <svg
                    width="48"
                    height="48"
                    viewBox="0 0 48 48"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M28 4H12C10.9 4 10 4.9 10 6V42C10 43.1 10.9 44 12 44H36C37.1 44 38 43.1 38 42V16L28 4Z"
                      fill="#E74C3C"
                    />
                    <path d="M28 4V16H38L28 4Z" fill="#C0392B" />
                    <text
                      x="24"
                      y="32"
                      textAnchor="middle"
                      fill="white"
                      fontSize="10"
                      fontWeight="bold"
                    >
                      {getFileExtension(document.attachment.filename)}
                    </text>
                  </svg>
                </div>
                <div className="text-center w-full px-2">
                  <p className="text-sm font-medium text-[#1a1a1a] break-words overflow-wrap-anywhere">
                    {document.attachment.filename}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {formatFileSize(document.attachment.file_size)}
                  </p>
                </div>

                {/* Action Buttons */}

                <div className="flex items-center gap-2 mt-3">
                  {!isPulseSite &&
                    isEditableDocument(document.attachment.filename) && (
                      <button
                        onClick={handleOpenEditor}
                        className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm font-medium"
                      >
                        <Edit2 className="w-4 h-4" />
                        Edit
                      </button>
                    )}

                  <button
                    onClick={() =>
                      handleDownload(
                        document.attachment.url,
                        document.attachment.filename
                      )
                    }
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-[#C72030] hover:bg-[#A01828] text-white rounded-lg transition-colors text-sm font-medium"
                  >
                    <Download className="w-4 h-4" />
                    Download
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* OnlyOffice Editor Modal */}
      {showEditor && document && (
        <OnlyOfficeEditor
          attachmentId={document.attachment.id}
          filename={document.attachment.filename}
          onClose={handleCloseEditor}
        />
      )}

      {/* Bulk Move Dialog */}
      <BulkMoveDialog
        isOpen={showMoveDialog}
        onClose={() => setShowMoveDialog(false)}
        operationType="move"
        selectedDocumentIds={document ? [document.id] : []}
        sourceFolderId={document?.folder_id}
        onConfirm={handleBulkMoveConfirm}
      />

      {/* Bulk Copy Dialog */}
      <BulkMoveDialog
        isOpen={showCopyDialog}
        onClose={() => setShowCopyDialog(false)}
        operationType="copy"
        selectedDocumentIds={document ? [document.id] : []}
        sourceFolderId={document?.folder_id}
        onConfirm={handleBulkMoveConfirm}
      />

      {/* Document Share Modal */}
      <DocumentShareModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        documentId={document?.id}
        publicUuid={document?.public_uuid}
        initialShares={
          document?.document_users?.map((user) => ({
            id: user.id.toString(),
            user_type: user.user_type,
            user_id: user.user_id,
            email: user.email,
            full_name: user.user_name,
            access_level: user.access_level,
          })) || []
        }
        onSave={handleSaveShares}
      />
    </div>
  );
};
