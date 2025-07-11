
import React from 'react';
import { Button } from '@/components/ui/button';
import { RotateCcw, Trash2, QrCode, LogIn, X } from 'lucide-react';

interface AssetSelectionPanelProps {
  selectedCount: number;
  onMoveAsset: () => void;
  onDisposeAsset: () => void;
  onPrintQRCode: () => void;
  onCheckIn: () => void;
  onClearSelection: () => void;
}

export const AssetSelectionPanel: React.FC<AssetSelectionPanelProps> = ({
  selectedCount,
  onMoveAsset,
  onDisposeAsset,
  onPrintQRCode,
  onCheckIn,
  onClearSelection
}) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-4">
          <div className="bg-[#1e3a8a] text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
            {selectedCount}
          </div>
          <span className="text-gray-600">
            Assets Selected
          </span>
          <span className="text-gray-800 font-medium">
            Dell Laptop
          </span>
        </div>
        
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={onMoveAsset}
            className="flex items-center gap-2 px-4 py-2 border-gray-300"
          >
            <RotateCcw className="w-4 h-4" />
            Move Asset
          </Button>
          
          <Button
            variant="outline"
            onClick={onDisposeAsset}
            className="flex items-center gap-2 px-4 py-2 border-gray-300"
          >
            <Trash2 className="w-4 h-4" />
            Dispose Asset
          </Button>
          
          <Button
            variant="outline"
            onClick={onPrintQRCode}
            className="flex items-center gap-2 px-4 py-2 border-gray-300"
          >
            <QrCode className="w-4 h-4" />
            Print QR Code
          </Button>
          
          <Button
            onClick={onCheckIn}
            className="bg-green-500 hover:bg-green-600 text-white flex items-center gap-2 px-6 py-2"
          >
            <LogIn className="w-4 h-4" />
            CHECK IN
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={onClearSelection}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};
