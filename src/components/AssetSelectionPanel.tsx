
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
    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-[#1e3a8a] text-white rounded-lg shadow-lg z-50 px-4 py-3">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="bg-white text-[#1e3a8a] rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
            {selectedCount}
          </div>
          <span className="text-sm text-white">
            Assets Selected
          </span>
          <span className="text-sm text-white font-medium">
            Dell Laptop
          </span>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={onMoveAsset}
            className="text-white hover:bg-white/20 flex flex-col items-center gap-1 px-3 py-2 h-auto"
          >
            <RotateCcw className="w-4 h-4" />
            <span className="text-xs">Move Asset</span>
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={onDisposeAsset}
            className="text-white hover:bg-white/20 flex flex-col items-center gap-1 px-3 py-2 h-auto"
          >
            <Trash2 className="w-4 h-4" />
            <span className="text-xs">Dispose Asset</span>
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={onPrintQRCode}
            className="text-white hover:bg-white/20 flex flex-col items-center gap-1 px-3 py-2 h-auto"
          >
            <QrCode className="w-4 h-4" />
            <span className="text-xs">Print QR Code</span>
          </Button>
          
          <Button
            size="sm"
            onClick={onCheckIn}
            className="bg-green-500 hover:bg-green-600 text-white flex flex-col items-center gap-1 px-4 py-2 h-auto"
          >
            <LogIn className="w-4 h-4" />
            <span className="text-xs font-bold">CHECK IN</span>
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={onClearSelection}
            className="text-white hover:bg-white/20 w-6 h-6"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};
