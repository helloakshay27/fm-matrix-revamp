
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
    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-[#1e3a8a] text-white rounded-lg shadow-lg z-50 flex items-center px-6 py-3">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="bg-white text-[#1e3a8a] rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
            {selectedCount}
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-medium text-white">
              Assets Selected
            </span>
            <span className="text-xs text-gray-300">
              Dell Laptop
            </span>
          </div>
        </div>
        
        <div className="flex items-center gap-6 ml-8">
          <Button
            variant="ghost"
            size="sm"
            onClick={onMoveAsset}
            className="text-white hover:bg-white/20 flex flex-col items-center gap-1 px-4 py-2 h-auto"
          >
            <RotateCcw className="w-5 h-5" />
            <span className="text-xs">Move Asset</span>
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={onDisposeAsset}
            className="text-white hover:bg-white/20 flex flex-col items-center gap-1 px-4 py-2 h-auto"
          >
            <Trash2 className="w-5 h-5" />
            <span className="text-xs">Dispose Asset</span>
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={onPrintQRCode}
            className="text-white hover:bg-white/20 flex flex-col items-center gap-1 px-4 py-2 h-auto"
          >
            <QrCode className="w-5 h-5" />
            <span className="text-xs">Print QR Code</span>
          </Button>
          
          <Button
            size="sm"
            onClick={onCheckIn}
            className="bg-green-500 hover:bg-green-600 text-white flex flex-col items-center gap-1 px-6 py-2 h-auto font-bold"
          >
            <LogIn className="w-5 h-5" />
            <span className="text-xs">CHECK IN</span>
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={onClearSelection}
            className="text-white hover:bg-white/20 w-8 h-8 ml-4"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};
