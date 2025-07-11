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
  const handleClearClick = () => {
    console.log('X button clicked - clearing selection');
    onClearSelection();
  };

  return <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-white border border-gray-200 rounded-sm shadow-lg z-50 flex items-center px-4 py-4">
      <div className="flex items-center gap-10">
        <div className="flex items-center gap-2">
          <div className="text-white rounded-lg w-10 flex items-center justify-center text-sm font-bold self-stretch py-2 bg-red-700">
            {selectedCount}
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-gray-900 whitespace-nowrap">
              Assets Selected
            </span>
            <span className="text-xs text-gray-500">
              Dell Laptop
            </span>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={onMoveAsset} className="text-gray-600 hover:bg-gray-100 flex flex-col items-center gap-1 px-2 py-2 h-auto">
            <Users className="w-4 h-4" />
            <span className="text-xs font-medium">Move Asset</span>
          </Button>
          
          <Button variant="ghost" size="sm" onClick={onDisposeAsset} className="text-gray-600 hover:bg-gray-100 flex flex-col items-center gap-1 px-2 py-2 h-auto">
            <Package className="w-4 h-4" />
            <span className="text-xs font-medium">Dispose Asset</span>
          </Button>
          
          <Button variant="ghost" size="sm" onClick={onPrintQRCode} className="text-gray-600 hover:bg-gray-100 flex flex-col items-center gap-1 px-2 py-2 h-auto">
            <QrCode className="w-4 h-4" />
            <span className="text-xs font-medium">Print QR Code</span>
          </Button>
          
          <Button size="sm" onClick={onCheckIn} className="bg-green-500 hover:bg-green-600 text-white flex items-center gap-2 px-4 py-2 h-auto font-bold text-xs">
            <LogIn className="w-4 h-4" />
            <span>CHECK IN</span>
          </Button>
          
          <div className="w-px h-8 bg-gray-300 mx-1"></div>
          
          <Button variant="ghost" size="icon" onClick={handleClearClick} className="text-gray-600 hover:bg-gray-100 w-8 h-8">
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>;
};
