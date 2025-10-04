import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { X, MoveRight, QrCode, Download, Trash2, Loader2 } from 'lucide-react';
import { getFullUrl, getAuthHeader, ENDPOINTS } from '@/config/apiConfig';
import { useToast } from '@/hooks/use-toast';

interface LocationSelectionPanelProps {
  selectedLocations: number[];
  selectedLocationObjects: any[];
  onMoveAssets: () => void;
  onPrintQR: () => void;
  onDownload: () => void;
  onDispose: () => void;
  onClearSelection: () => void;
}

export const LocationSelectionPanel: React.FC<LocationSelectionPanelProps> = ({
  selectedLocations,
  selectedLocationObjects,
  onMoveAssets,
  onPrintQR,
  onDownload,
  onDispose,
  onClearSelection
}) => {
  const navigate = useNavigate();
  const [isMoveLoading, setIsMoveLoading] = useState(false);
  const [isPrintLoading, setIsPrintLoading] = useState(false);
  const [isDownloadLoading, setIsDownloadLoading] = useState(false);
  const [isDisposeLoading, setIsDisposeLoading] = useState(false);
  const { toast } = useToast();

  const handleMoveAssets = () => {
    onMoveAssets();
  };

  const handlePrintQR = () => {
    onPrintQR();
  };

  const handleDownload = () => {
    onDownload();
  };

  const handleDispose = () => {
    onDispose();
  };

  if (selectedLocations.length === 0) {
    return null;
  }

  return (
    <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white shadow-[0px_4px_20px_rgba(0,0,0,0.15)] rounded-lg z-50 flex h-[105px]">
      {/* Beige left strip - 44px wide */}
      <div className="w-[44px] bg-[#C4B59A] rounded-l-lg flex flex-col items-center justify-center">
        <div className="text-[#C72030] font-bold text-lg">
          {selectedLocations.length}
        </div>
      </div>
      
      {/* Main content */}
      <div className="flex items-center justify-between gap-4 px-6 flex-1">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-[#1a1a1a]">Selection</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-600">
              {selectedLocationObjects.slice(0, 2).map(loc => 
                `${loc.site_name} - ${loc.building_name}`
              ).join(', ')}
              {selectedLocationObjects.length > 2 && ` +${selectedLocationObjects.length - 2} more`}
            </span>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {/* <Button
            onClick={handleMoveAssets}
            disabled={isMoveLoading}
            variant="ghost"
            size="sm"
            className="flex flex-col items-center gap-1 h-auto py-2 px-3 hover:bg-gray-50 transition-colors duration-200"
          >
            {isMoveLoading ? (
              <Loader2 className="w-6 h-6 animate-spin text-black" />
            ) : (
              <MoveRight className="w-6 h-6 text-black" />
            )}
            <span className="text-xs text-gray-600">Move Assets</span>
          </Button> */}
          
          <Button
            onClick={handlePrintQR}
            disabled={isPrintLoading}
            variant="ghost"
            size="sm"
            className="flex flex-col items-center gap-1 h-auto py-2 px-3 hover:bg-gray-50 transition-colors duration-200"
          >
            {isPrintLoading ? (
              <Loader2 className="w-6 h-6 animate-spin text-black" />
            ) : (
              <QrCode className="w-6 h-6 text-black" />
            )}
            <span className="text-xs text-gray-600">Print QR</span>
          </Button>
          
          {/* <Button
            onClick={handleDownload}
            disabled={isDownloadLoading}
            variant="ghost"
            size="sm"
            className="flex flex-col items-center gap-1 h-auto py-2 px-3 hover:bg-gray-50 transition-colors duration-200"
          >
            {isDownloadLoading ? (
              <Loader2 className="w-6 h-6 animate-spin text-black" />
            ) : (
              <Download className="w-6 h-6 text-black" />
            )}
            <span className="text-xs text-gray-600">Download</span>
          </Button> */}

          {/* <Button
            onClick={handleDispose}
            disabled={isDisposeLoading}
            variant="ghost"
            size="sm"
            className="flex flex-col items-center gap-1 h-auto py-2 px-3 hover:bg-gray-50 transition-colors duration-200"
          >
            {isDisposeLoading ? (
              <Loader2 className="w-6 h-6 animate-spin text-black" />
            ) : (
              <Trash2 className="w-6 h-6 text-black" />
            )}
            <span className="text-xs text-gray-600">Dispose</span>
          </Button> */}
        </div>
      </div>
      
      {/* Cross button - 44px wide */}
      <div className="w-[44px] flex items-center justify-center border-l border-gray-200">
        <button
          onClick={onClearSelection}
          className="w-full h-full flex items-center justify-center hover:bg-gray-50 transition-colors duration-200"
        >
          <X className="w-4 h-4 text-black" />
        </button>
      </div>
    </div>
  );
};