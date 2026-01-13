import React, { useEffect, useRef } from "react";
import { X, Plus, FolderPlus, Copy, MoveRight } from "lucide-react";

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
        className="fixed bg-white border border-gray-200 rounded-lg shadow-[0px_4px_20px_rgba(0,0,0,0.15)] z-50 flex h-[105px]"
        style={{ top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}
      >
        {/* Left Strip */}
        <div className="w-[44px] bg-[#C4B59A] rounded-l-lg flex items-center justify-center">
          <span className="text-[#C72030] font-bold text-xs">A</span>
        </div>

        {/* Main Content */}
        <div className="flex items-center px-6 gap-4">
          {/* Action Label */}
          <div className="flex items-center gap-3">
            <span className="text-sm font-semibold text-[#1a1a1a]">Action</span>
            <div className="h-8 w-px bg-gray-300" />
          </div>

          {/* Add Existing Document Button */}
          <button
            onClick={onAddExisting}
            className="flex flex-col items-center gap-1 px-4 py-2 hover:bg-gray-50 rounded-lg transition-colors group"
          >
            <div className="w-10 h-10 rounded-lg bg-[#FFF5F5] flex items-center justify-center group-hover:bg-[#FFE5E5] transition-colors">
              {customLabels?.addExisting === "Copy" ? (
                <Copy className="w-5 h-5 text-[#C72030]" />
              ) : (
                <Plus className="w-5 h-5 text-[#C72030]" />
              )}
            </div>
            <span className="text-xs text-gray-700 whitespace-nowrap">
              {customLabels?.addExisting || "Add Document"}
            </span>
          </button>

          {/* Divider */}
          <div className="h-12 w-px bg-gray-200" />

          {/* Create New Document Button */}
          <button
            onClick={onCreateNew}
            className="flex flex-col items-center gap-1 px-4 py-2 hover:bg-gray-50 rounded-lg transition-colors group"
          >
            <div className="w-10 h-10 rounded-lg bg-[#FFF5F5] flex items-center justify-center group-hover:bg-[#FFE5E5] transition-colors">
              {customLabels?.createNew === "Move" ? (
                <MoveRight className="w-5 h-5 text-[#C72030]" />
              ) : (
                <FolderPlus className="w-5 h-5 text-[#C72030]" />
              )}
            </div>
            <span className="text-xs text-gray-700 whitespace-nowrap">
              {customLabels?.createNew || "Create New Document"}
            </span>
          </button>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="ml-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-4 h-4 text-gray-600" />
          </button>
        </div>
      </div>
    </>
  );
};
