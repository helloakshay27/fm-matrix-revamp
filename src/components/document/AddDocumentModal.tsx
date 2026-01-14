import React, { useEffect, useRef } from "react";
import { X, Plus, FolderPlus, Copy, MoveRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AddDocumentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddExisting: () => void;
  onCreateNew: () => void;
  customLabels?: {
    addExisting?: string;
    createNew?: string;
  };
}

export const AddDocumentModal: React.FC<AddDocumentModalProps> = ({
  isOpen,
  onClose,
  onAddExisting,
  onCreateNew,
  customLabels,
}) => {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        panelRef.current &&
        !panelRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-30 z-40"
        onClick={onClose}
      />

      {/* Action Panel */}
      <div
        ref={panelRef}
        className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white shadow-[0px_4px_20px_rgba(0,0,0,0.15)] rounded-lg z-50 flex h-[105px]"
      >
        {/* Beige left strip - 44px wide */}
        <div className="w-[44px] bg-[#C4B59A] rounded-l-lg flex flex-col items-center justify-center">
          <div className="text-[#C72030] font-bold text-lg">A</div>
        </div>

        {/* Main Content */}
        <div className="flex items-center justify-between gap-4 px-6 flex-1">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-[#1a1a1a]">Action</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Add Existing Button */}
            <Button
              onClick={onAddExisting}
              variant="ghost"
              size="sm"
              className="flex flex-col items-center gap-1 h-auto py-2 px-3 hover:bg-gray-50 transition-colors duration-200"
            >
              {customLabels?.addExisting === "Copy" ? (
                <Copy className="w-6 h-6 text-black" />
              ) : (
                <Plus className="w-6 h-6 text-black" />
              )}
              <span className="text-xs text-gray-600">
                {customLabels?.addExisting || "Add Document"}
              </span>
            </Button>

            {/* Create New Button */}
            <Button
              onClick={onCreateNew}
              variant="ghost"
              size="sm"
              className="flex flex-col items-center gap-1 h-auto py-2 px-3 hover:bg-gray-50 transition-colors duration-200"
            >
              {customLabels?.createNew === "Move" ? (
                <MoveRight className="w-6 h-6 text-black" />
              ) : (
                <FolderPlus className="w-6 h-6 text-black" />
              )}
              <span className="text-xs text-gray-600">
                {customLabels?.createNew || "Create New"}
              </span>
            </Button>
          </div>
        </div>

        {/* Cross button - 44px wide */}
        <div className="w-[44px] flex items-center justify-center border-l border-gray-200">
          <button
            onClick={onClose}
            className="w-full h-full flex items-center justify-center hover:bg-gray-50 transition-colors duration-200"
          >
            <X className="w-4 h-4 text-black" />
          </button>
        </div>
      </div>
    </>
  );
};
