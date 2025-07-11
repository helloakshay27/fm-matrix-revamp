
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { RotateCcw, Trash2, QrCode, LogIn, X, Users, Package } from 'lucide-react';

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
    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 flex items-center px-6 py-4">
      <div className="flex items-center gap-8">
        <div className="flex items-center gap-4">
          <div className="bg-[#1e3a8a] text-white rounded-lg w-12 h-12 flex items-center justify-center text-lg font-bold">
            {selectedCount}
          </div>
          <div className="flex flex-col">
            <span className="text-base font-semibold text-gray-900">
              Assets Selected
            </span>
            <span className="text-sm text-gray-500">
              Dell Laptop
            </span>
          </div>
        </div>
        
        <div className="flex items-center gap-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={onMoveAsset}
            className="text-gray-600 hover:bg-gray-100 flex flex-col items-center gap-2 px-4 py-3 h-auto"
          >
            <Users className="w-6 h-6" />
            <span className="text-xs font-medium">Move Asset</span>
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={onDisposeAsset}
            className="text-gray-600 hover:bg-gray-100 flex flex-col items-center gap-2 px-4 py-3 h-auto"
          >
            <Package className="w-6 h-6" />
            <span className="text-xs font-medium">Dispose Asset</span>
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={onPrintQRCode}
            className="text-gray-600 hover:bg-gray-100 flex flex-col items-center gap-2 px-4 py-3 h-auto"
          >
            <QrCode className="w-6 h-6" />
            <span className="text-xs font-medium">Print QR Code</span>
          </Button>
          
          <Button
            size="sm"
            onClick={onCheckIn}
            className="bg-green-500 hover:bg-green-600 text-white flex items-center gap-2 px-8 py-3 h-auto font-bold text-sm"
          >
            <LogIn className="w-5 h-5" />
            <span>CHECK IN</span>
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={onClearSelection}
            className="text-gray-600 hover:bg-gray-100 w-10 h-10 ml-2"
          >
            <X className="w-6 h-6" />
          </Button>
        </div>
      </div>
    </div>
  );
};
