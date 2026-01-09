import React from "react";
import { Button } from "@/components/ui/button";
import { X, Edit, Trash2 } from "lucide-react";

interface Document {
  id: number;
  folder_title: string;
}

interface DocumentSelectionPanelProps {
  selectedItems: string[];
  selectedDocuments: Document[];
  onUpdate: () => void;
  onDelete: () => void;
  onClearSelection: () => void;
}

export const DocumentSelectionPanel: React.FC<DocumentSelectionPanelProps> = ({
  selectedItems,
  selectedDocuments,
  onUpdate,
  onDelete,
  onClearSelection,
}) => {
  return (
    <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50">
      <div className="bg-white border border-gray-200 rounded-lg shadow-[0px_4px_20px_rgba(0,0,0,0.15)] flex h-[80px] min-w-[500px]">
        {/* Left Strip */}
        <div className="w-[44px] bg-[#C4B59A] rounded-l-lg flex items-center justify-center">
          <span className="text-[#C72030] font-bold text-xs">S</span>
        </div>

        {/* Main Content */}
        <div className="flex items-center justify-between px-6 flex-1">
          {/* Selection Info */}
          <div className="flex items-center gap-4">
            <span className="text-sm font-semibold text-[#1a1a1a]">
              {selectedItems.length}{" "}
              {selectedItems.length === 1 ? "folder" : "folders"} selected
            </span>
            <div className="h-8 w-px bg-gray-300" />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            {/* Update Button */}
            <Button
              onClick={onUpdate}
              variant="outline"
              size="sm"
              className="flex items-center gap-2 border-[#C72030] text-[#C72030] hover:bg-[#FFF5F5]"
            >
              <Edit className="w-4 h-4" />
              Update
            </Button>

            {/* Delete Button */}
            <Button
              onClick={onDelete}
              variant="outline"
              size="sm"
              className="flex items-center gap-2 border-red-600 text-red-600 hover:bg-red-50"
            >
              <Trash2 className="w-4 h-4" />
              Delete
            </Button>

            {/* Clear Selection */}
            <Button
              onClick={onClearSelection}
              variant="ghost"
              size="sm"
              className="p-2"
            >
              <X className="w-5 h-5 text-gray-500" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
