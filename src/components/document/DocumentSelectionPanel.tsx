import React from "react";
import { Button } from "@/components/ui/button";
import { X, Edit, Trash2, FolderInput, Copy, Share2 } from "lucide-react";

interface Document {
  id: number;
  folder_title: string;
}

interface DocumentSelectionPanelProps {
  selectedItems: string[];
  selectedDocuments: Document[];
  onUpdate: () => void;
  onDelete: () => void;
  onMove?: () => void;
  onCopy?: () => void;
  onShare?: () => void;
  onClearSelection: () => void;
}

export const DocumentSelectionPanel: React.FC<DocumentSelectionPanelProps> = ({
  selectedItems,
  selectedDocuments,
  onUpdate,
  onDelete,
  onMove,
  onCopy,
  onShare,
  onClearSelection,
}) => {
  if (selectedItems.length === 0) {
    return null;
  }

  return (
    <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white shadow-[0px_4px_20px_rgba(0,0,0,0.15)] rounded-lg z-50 flex h-[105px]">
      {/* Beige left strip - 44px wide */}
      <div className="w-[44px] bg-[#C4B59A] rounded-l-lg flex flex-col items-center justify-center">
        <div className="text-[#C72030] font-bold text-lg">
          {selectedItems.length}
        </div>
      </div>

      {/* Main content */}
      <div className="flex items-center justify-between gap-4 px-6 flex-1">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-[#1a1a1a]">
              Selection
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-600">
              {selectedDocuments
                .slice(0, 2)
                .map((doc) => doc.folder_title)
                .join(", ")}
              {selectedDocuments.length > 2 &&
                ` +${selectedDocuments.length - 2} more`}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Move Button */}
          {onMove && (
            <Button
              onClick={onMove}
              variant="ghost"
              size="sm"
              className="flex flex-col items-center gap-1 h-auto py-2 px-3 hover:bg-gray-50 transition-colors duration-200"
            >
              <FolderInput className="w-6 h-6 text-black" />
              <span className="text-xs text-gray-600">Move</span>
            </Button>
          )}

          {/* Copy Button */}
          {onCopy && (
            <Button
              onClick={onCopy}
              variant="ghost"
              size="sm"
              className="flex flex-col items-center gap-1 h-auto py-2 px-3 hover:bg-gray-50 transition-colors duration-200"
            >
              <Copy className="w-6 h-6 text-black" />
              <span className="text-xs text-gray-600">Copy</span>
            </Button>
          )}

          {/* Share Button */}
          {onShare && (
            <Button
              onClick={onShare}
              variant="ghost"
              size="sm"
              className="flex flex-col items-center gap-1 h-auto py-2 px-3 hover:bg-gray-50 transition-colors duration-200"
            >
              <Share2 className="w-6 h-6 text-black" />
              <span className="text-xs text-gray-600">Share</span>
            </Button>
          )}

          {/* Update Button */}
          <Button
            onClick={onUpdate}
            variant="ghost"
            size="sm"
            className="flex flex-col items-center gap-1 h-auto py-2 px-3 hover:bg-gray-50 transition-colors duration-200"
          >
            <Edit className="w-6 h-6 text-black" />
            <span className="text-xs text-gray-600">Update</span>
          </Button>

          {/* Delete Button */}
          <Button
            onClick={onDelete}
            variant="ghost"
            size="sm"
            className="flex flex-col items-center gap-1 h-auto py-2 px-3 hover:bg-gray-50 transition-colors duration-200"
          >
            <Trash2 className="w-6 h-6 text-black" />
            <span className="text-xs text-gray-600">Delete</span>
          </Button>
        </div>
      </div>

      {/* Cross button - 44px wide */}
      <div className="w-[44px] flex items-center justify-center border-l border-gray-200">
        <button
          onClick={onClearSelection}
          className="w-full h-full flex items-center justify-center hover:bg-gray-50 transition-colors duration-200"
        >
          <X className="w-4 h-4 text-black" />
        </button>
      </div>
    </div>
  );
};
