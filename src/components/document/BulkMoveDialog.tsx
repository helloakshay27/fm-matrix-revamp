import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Search, Folder, ChevronRight, ChevronDown } from "lucide-react";
import { getFoldersTree, FolderTreeResponse } from "@/services/documentService";
import { toast } from "sonner";

interface Folder {
  id: number;
  name: string;
  category_id?: number;
  parent_id?: number;
  children?: Folder[];
}

interface BulkMoveDialogProps {
  isOpen: boolean;
  onClose: () => void;
  operationType: "move" | "copy";
  selectedDocumentIds: number[];
  sourceFolderId?: number;
  onConfirm: (targetFolderIds: number[]) => void;
}

export const BulkMoveDialog: React.FC<BulkMoveDialogProps> = ({
  isOpen,
  onClose,
  operationType,
  selectedDocumentIds,
  sourceFolderId,
  onConfirm,
}) => {
  const [folders, setFolders] = useState<Folder[]>([]);
  const [selectedFolderIds, setSelectedFolderIds] = useState<number[]>([]);
  const [expandedFolders, setExpandedFolders] = useState<
    Record<number, boolean>
  >({});
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchFolders();
    }
  }, [isOpen]);

  const fetchFolders = async () => {
    setLoading(true);
    try {
      const response: FolderTreeResponse = await getFoldersTree();
      setFolders(response.folders || []);
    } catch (error) {
      console.error("Error fetching folders:", error);
      toast.error("Failed to load folders");
    } finally {
      setLoading(false);
    }
  };

  const toggleFolder = (folderId: number) => {
    setExpandedFolders((prev) => ({
      ...prev,
      [folderId]: !prev[folderId],
    }));
  };

  const handleSelectFolder = (folderId: number, checked: boolean) => {
    if (checked) {
      // For move operation, only allow single selection
      if (operationType === "move") {
        setSelectedFolderIds([folderId]);
      } else {
        // For copy operation, allow multiple selection
        setSelectedFolderIds((prev) => [...prev, folderId]);
      }
    } else {
      setSelectedFolderIds((prev) => prev.filter((id) => id !== folderId));
    }
  };

  const handleConfirm = () => {
    if (selectedFolderIds.length === 0) {
      toast.error("Please select at least one target folder");
      return;
    }

    if (
      operationType === "move" &&
      sourceFolderId &&
      selectedFolderIds.includes(sourceFolderId)
    ) {
      toast.error("Cannot move documents to the same folder");
      return;
    }

    onConfirm(selectedFolderIds);
    handleClose();
  };

  const handleClose = () => {
    setSelectedFolderIds([]);
    setSearchTerm("");
    setExpandedFolders({});
    onClose();
  };

  const filterFolders = (folders: Folder[], term: string): Folder[] => {
    if (!term) return folders;

    return folders.filter((folder) => {
      const matchesSearch = folder.name
        .toLowerCase()
        .includes(term.toLowerCase());
      const childMatches =
        folder.children && filterFolders(folder.children, term).length > 0;
      return matchesSearch || childMatches;
    });
  };

  const renderFolderTree = (folders: Folder[], level: number = 0) => {
    const filtered = filterFolders(folders, searchTerm);

    return filtered.map((folder) => {
      const hasChildren = folder.children && folder.children.length > 0;
      const isExpanded = expandedFolders[folder.id];
      const isSelected = selectedFolderIds.includes(folder.id);
      const isDisabled =
        operationType === "move" && folder.id === sourceFolderId;

      return (
        <div key={folder.id} className="select-none">
          <div
            className={`flex items-center gap-2 py-2 px-3 hover:bg-gray-50 rounded transition-colors ${
              isDisabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
            }`}
            style={{ paddingLeft: `${level * 20 + 12}px` }}
          >
            {hasChildren && (
              <button
                onClick={() => toggleFolder(folder.id)}
                className="p-0.5 hover:bg-gray-200 rounded"
              >
                {isExpanded ? (
                  <ChevronDown className="w-4 h-4 text-gray-600" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-gray-600" />
                )}
              </button>
            )}
            {!hasChildren && <div className="w-5" />}

            <Checkbox
              id={`folder-${folder.id}`}
              checked={isSelected}
              disabled={isDisabled}
              onCheckedChange={(checked) =>
                handleSelectFolder(folder.id, checked as boolean)
              }
              className="data-[state=checked]:bg-[#C72030] data-[state=checked]:border-[#C72030]"
            />

            <Folder className="w-4 h-4 text-[#C72030] flex-shrink-0" />

            <label
              htmlFor={`folder-${folder.id}`}
              className={`text-sm flex-1 ${
                isDisabled ? "cursor-not-allowed" : "cursor-pointer"
              }`}
            >
              {folder.name}
            </label>
          </div>

          {hasChildren && isExpanded && (
            <div>{renderFolderTree(folder.children!, level + 1)}</div>
          )}
        </div>
      );
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            {operationType === "move" ? "Move" : "Copy"} Documents
          </DialogTitle>
          <p className="text-sm text-gray-500 mt-1">
            Select{" "}
            {operationType === "move"
              ? "a destination"
              : "one or more destination"}{" "}
            folder
            {operationType === "copy" ? "s" : ""} for{" "}
            {selectedDocumentIds.length} document
            {selectedDocumentIds.length !== 1 ? "s" : ""}
          </p>
        </DialogHeader>

        {/* Search Bar */}
        <div className="relative mt-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search folders..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C72030] focus:border-transparent"
          />
        </div>

        {/* Folder Tree */}
        <div className="flex-1 overflow-y-auto border border-gray-200 rounded-lg mt-4 p-2 min-h-[300px] max-h-[400px]">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-gray-500">Loading folders...</div>
            </div>
          ) : folders.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-gray-500">No folders available</div>
            </div>
          ) : (
            renderFolderTree(folders)
          )}
        </div>

        {/* Selected Count */}
        {selectedFolderIds.length > 0 && (
          <div className="mt-3 text-sm text-gray-600">
            {selectedFolderIds.length} folder
            {selectedFolderIds.length !== 1 ? "s" : ""} selected
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 mt-4 pt-4 border-t border-gray-200">
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            className="bg-[#C72030] hover:bg-[#A01828] text-white"
            disabled={selectedFolderIds.length === 0}
          >
            {operationType === "move" ? "Move" : "Copy"} Documents
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
