import React from 'react';
import { Button } from './ui/button';
import { X, Plus, Upload } from 'lucide-react';

interface ActionSelectionPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onAddVisitor: () => void;
  onImportVisitors: () => void;
}

export const ActionSelectionPanel: React.FC<ActionSelectionPanelProps> = ({
  isOpen,
  onClose,
  onAddVisitor,
  onImportVisitors
}) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white shadow-[0px_4px_20px_rgba(0,0,0,0.15)] rounded-lg z-50 flex h-[105px]">
      {/* Beige left strip - 44px wide */}
      <div className="w-[44px] bg-[#C4B59A] rounded-l-lg flex flex-col items-center justify-center">
        <div className="text-[#C72030] font-bold text-lg">
          
        </div>
      </div>
      
      {/* Main content */}
      <div className="flex items-center justify-between gap-4 px-6 flex-1">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-[#1a1a1a]">Action</span>
          </div>
          <div className="flex items-center gap-2">
            
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {/* Add Visitor Button */}
          <Button
            onClick={onAddVisitor}
            variant="ghost"
            size="sm"
            className="flex flex-col items-center gap-1 h-auto py-2 px-3 hover:bg-gray-50 transition-colors duration-200"
          >
            <Plus className="w-6 h-6 text-black" />
            <span className="text-xs text-gray-600">Add Visitor</span>
          </Button>

          {/* Import Visitors Button */}
          <Button
            onClick={onImportVisitors}
            variant="ghost"
            size="sm"
            className="flex flex-col items-center gap-1 h-auto py-2 px-3 hover:bg-gray-50 transition-colors duration-200"
          >
            <Upload className="w-6 h-6 text-black" />
            <span className="text-xs text-gray-600">Import</span>
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
  );
};