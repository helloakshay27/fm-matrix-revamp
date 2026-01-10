import React, { useState, useEffect } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { FileIcon } from "./FileIcon";
import { API_CONFIG, getAuthHeader } from "@/config/apiConfig";
import { toast } from "sonner";

interface DocumentItem {
  id: number;
  title: string;
  category_id: number;
  folder_id: number;
  created_at: string;
  document_category_name: string | null;
  created_by_full_name: string | null;
  folder_name: string;
  active: boolean | null;
  created_by_id: number | null;
}

interface FolderTree {
  id: number;
  name: string | null;
  of_phase: string | null;
  documents: DocumentItem[];
  childs: FolderTree[];
}

interface DocumentTreeViewProps {
  documents?: any[];
  onViewDetails?: (documentId: number) => void;
}

export const DocumentTreeView: React.FC<DocumentTreeViewProps> = () => {
  const navigate = useNavigate();
  const [folders, setFolders] = useState<FolderTree[]>([]);
  const [expandedFolders, setExpandedFolders] = useState<
    Record<number, boolean>
  >({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFolderTree();
  }, []);

  const fetchFolderTree = async () => {
    try {
      setLoading(true);
      const baseUrl = API_CONFIG.BASE_URL;
      const response = await fetch(`${baseUrl}/folders/tree.json`, {
        headers: {
          Authorization: getAuthHeader(),
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: FolderTree[] = await response.json();
      // Filter out folders with null names
      const validFolders = data.filter((folder) => folder.name !== null);
      setFolders(validFolders);
    } catch (error) {
      console.error("Error fetching folder tree:", error);
      toast.error("Failed to load folder tree");
    } finally {
      setLoading(false);
    }
  };

  const toggleFolder = (folderId: number, event: React.MouseEvent) => {
    event.stopPropagation();
    setExpandedFolders((prev) => ({
      ...prev,
      [folderId]: !prev[folderId],
    }));
  };

  const handleDocumentClick = (documentId: number) => {
    navigate(`/maintenance/documents/details/${documentId}`);
  };

  const calculateFolderSize = (folder: FolderTree): string => {
    // This is a placeholder - you might want to calculate actual size
    const docCount = folder.documents.length;
    if (docCount === 0) return "0 B";
    return `${docCount * 1} MB`; // Rough estimate
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading folders...</div>
      </div>
    );
  }

  if (folders.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">No folders found</div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {folders.map((folder) => {
        const isExpanded = expandedFolders[folder.id];
        const folderSize = calculateFolderSize(folder);
        const fileCount = folder.documents.length;
        const folderCount = folder.childs.length;

        return (
          <div
            key={folder.id}
            className="bg-[#F6F4EE] border border-[#E5E0D3] rounded-lg overflow-hidden"
          >
            {/* Folder Card Header */}
            <div className="p-4">
              <div className="flex items-center gap-3">
                {/* Folder Icon */}
                <div className="w-12 h-12 bg-[#E5E0D3] rounded flex items-center justify-center flex-shrink-0">
                  <FileIcon
                    fileName={folder.name || "Folder"}
                    isFolder={true}
                    className="w-6 h-6"
                  />
                </div>

                {/* Folder Info */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-[#1A1A1A] text-base">
                    {folder.name}
                  </h3>
                  <p className="text-sm text-[#666666]">
                    {folderSize}{" "}
                    {folderCount > 0 &&
                      `${folderCount} Folder${folderCount !== 1 ? "s" : ""}, `}
                    {fileCount} File{fileCount !== 1 ? "s" : ""}
                  </p>
                </div>

                {/* Expand/Collapse Button */}
                {fileCount > 0 && (
                  <button
                    onClick={(e) => toggleFolder(folder.id, e)}
                    className="p-2 hover:bg-[#E5E0D3] rounded transition-colors flex-shrink-0"
                  >
                    {isExpanded ? (
                      <ChevronUp className="w-5 h-5 text-[#1A1A1A]" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-[#1A1A1A]" />
                    )}
                  </button>
                )}
              </div>
            </div>

            {/* Expanded Content with Documents */}
            {isExpanded && fileCount > 0 && (
              <div className="px-4 pb-4">
                <div className="pl-6 space-y-1 relative">
                  {/* Dotted vertical line */}
                  <div
                    className="absolute left-0 top-0 bottom-0 w-px"
                    style={{
                      backgroundImage:
                        "repeating-linear-gradient(to bottom, #999 0, #999 4px, transparent 4px, transparent 8px)",
                    }}
                  />

                  {/* Document Items */}
                  {folder.documents.map((doc, index) => (
                    <div
                      key={doc.id}
                      className="flex items-center gap-3 py-2 relative cursor-pointer hover:bg-[#E5E0D3] rounded px-2 transition-colors"
                      onClick={() => handleDocumentClick(doc.id)}
                    >
                      {/* Horizontal dotted line */}
                      <div
                        className="absolute left-0 top-1/2 w-6 h-px"
                        style={{
                          backgroundImage:
                            "repeating-linear-gradient(to right, #999 0, #999 4px, transparent 4px, transparent 8px)",
                        }}
                      />
                      <div className="pl-6 flex items-center gap-2 flex-1">
                        <FileIcon
                          fileName={doc.title}
                          isFolder={false}
                          className="w-5 h-5"
                        />
                        <span className="text-sm text-[#1A1A1A]">
                          {doc.title}
                        </span>
                      </div>
                      <ChevronDown className="w-4 h-4 text-[#666666]" />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
