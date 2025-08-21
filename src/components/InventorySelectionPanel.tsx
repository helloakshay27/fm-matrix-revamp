import React, { useRef } from 'react';
import { X, Plus, FileText, Upload, Loader2 } from 'lucide-react';
import { useLayout } from '@/contexts/LayoutContext';

interface InventorySelectionPanelProps {
  selectedIds: string[];
  onAddConsumable: () => void;
  onPrintQR: () => void;
  onClose: () => void;
  printing?: boolean;
  onAdd?: () => void;
  onImport?: () => void;
}

// Inventory specific panel replicating PannelTab styling, restricted to Add Consumable & Print QR
export const InventorySelectionPanel: React.FC<InventorySelectionPanelProps> = ({
  selectedIds,
  onAddConsumable,
  onPrintQR,
  onClose,
  printing = false,
  onAdd,
  onImport,
}) => {
  const panelRef = useRef<HTMLDivElement>(null);
  const { isSidebarCollapsed } = useLayout();

  return (
    <div
      className={`fixed z-50 flex items-end justify-center pb-8 sm:pb-[16rem] pointer-events-none transition-all duration-300 ${isSidebarCollapsed ? 'left-16' : 'left-64'} right-0 bottom-0`}
    >
      {/* Container replicating original SelectionPanel layout */}
      <div className="flex max-w-full pointer-events-auto bg-white border border-gray-200 rounded-lg shadow-lg mx-4 overflow-hidden">
        {/* Right vertical bar (decorative) */}
        <div className="hidden sm:flex w-8 bg-[#C4B89D54] items-center justify-center text-red-600 font-semibold text-sm" />
        {/* Main content */}
        <div ref={panelRef} className="p-4 sm:p-6 w-full sm:w-auto">
          <div className="flex flex-wrap justify-center sm:justify-start items-center gap-6 sm:gap-12">
            {/* When no selection: show Add & Import */}
            {selectedIds.length === 0 && (
              <>
                {onAdd && (
                  <button
                    onClick={onAdd}
                    className="flex flex-col items-center justify-center cursor-pointer text-[#374151] hover:text-black w-16 sm:w-auto"
                  >
                    <Plus className="w-6 h-6 mb-1" />
                    <span className="text-sm font-medium text-center">Add</span>
                  </button>
                )}
                {onImport && (
                  <button
                    onClick={onImport}
                    className="flex flex-col items-center justify-center cursor-pointer text-[#374151] hover:text-black w-16 sm:w-auto"
                  >
                    <Upload className="w-6 h-6 mb-1" />
                    <span className="text-sm font-medium text-center">Import</span>
                  </button>
                )}
              </>
            )}
            {/* Add Consumable (only when single selection) */}
            {selectedIds.length === 1 && (
              <button
                onClick={onAddConsumable}
                className="flex flex-col items-center justify-center cursor-pointer text-[#374151] hover:text-black w-16 sm:w-auto"
              >
                <Plus className="w-6 h-6 mb-1" />
                <span className="text-sm font-medium text-center">Add Consumable</span>
              </button>
            )}
            {/* Print QR */}
            {selectedIds.length > 0 && (
              <button
                onClick={onPrintQR}
                disabled={printing}
                className="flex flex-col items-center justify-center cursor-pointer text-[#374151] hover:text-black disabled:opacity-60 w-16 sm:w-auto"
              >
                {printing ? (
                  <Loader2 className="w-6 h-6 mb-1 animate-spin" />
                ) : (
                  <FileText className="w-6 h-6 mb-1" />
                )}
                <span className="text-sm font-medium text-center">{printing ? 'Generating…' : 'Print QR'}</span>
              </button>
            )}
            {/* Divider */}
            <div className="w-px h-8 bg-black opacity-20 mx-2 sm:mx-4" />
            {/* Close */}
            <div
              onClick={onClose}
              className="flex flex-col items-center justify-center cursor-pointer text-gray-400 hover:text-gray-600 w-16 sm:w-auto"
            >
              <X className="w-6 h-6 mb-1" />
              <span className="text-sm font-medium text-center">Close</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InventorySelectionPanel;