
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { RotateCcw, Trash2, QrCode, LogIn, X, Users, Package, Download, Loader2 } from 'lucide-react';
import { BASE_URL, getAuthHeader } from '@/config/apiConfig';
import { useToast } from '@/hooks/use-toast';

interface Asset {
  id: string;
  name: string;
}

interface AssetSelectionPanelProps {
  selectedCount: number;
  selectedAssets: Asset[];
  onMoveAsset: () => void;
  onDisposeAsset: () => void;
  onPrintQRCode: () => void;
  onCheckIn: () => void;
  onClearSelection: () => void;
}

export const AssetSelectionPanel: React.FC<AssetSelectionPanelProps> = ({
  selectedCount,
  selectedAssets,
  onMoveAsset,
  onDisposeAsset,
  onPrintQRCode,
  onCheckIn,
  onClearSelection
}) => {
  const [showAll, setShowAll] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [isPrintingQR, setIsPrintingQR] = useState(false);
  const { toast } = useToast();

  const handleClearClick = () => {
    console.log('X button clicked - clearing selection');
    onClearSelection();
  };

  const handleExport = async () => {
    if (selectedAssets.length === 0) {
      toast({
        title: "No assets selected",
        description: "Please select at least one asset to export.",
        variant: "destructive",
      });
      return;
    }

    setIsExporting(true);
    
    try {
      const params = {
        q: {
          id_in: selectedAssets.map(asset => asset.id)
        }
      };
      
      const urlParams = new URLSearchParams();
      params.q.id_in.forEach(id => {
        urlParams.append('q[id_in][]', id);
      });
      
      const url = `${BASE_URL}/pms/assets/assets_data_report.xlsx?${urlParams.toString()}`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': getAuthHeader(),
          'Accept': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        },
      });

      if (!response.ok) {
        throw new Error(`Export failed: ${response.status} ${response.statusText}`);
      }

      const blob = await response.blob();
      
      // Create and trigger download
      const downloadUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = 'assets_data_report.xlsx';
      link.style.display = 'none';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(downloadUrl);

      toast({
        title: "Export successful",
        description: `Successfully exported ${selectedAssets.length} asset(s) to Excel.`,
      });
    } catch (error) {
      console.error('Export error:', error);
      toast({
        title: "Export failed",
        description: error instanceof Error ? error.message : "Failed to export assets. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

  const handlePrintQRCode = async () => {
    if (selectedAssets.length === 0) {
      toast({
        title: "No assets selected",
        description: "Please select at least one asset to print QR codes.",
        variant: "destructive",
      });
      return;
    }

    setIsPrintingQR(true);
    
    try {
      const urlParams = new URLSearchParams();
      selectedAssets.forEach(asset => {
        urlParams.append('asset_ids[]', asset.id);
      });
      
      const url = `${BASE_URL}/pms/assets/print_qr_codes?${urlParams.toString()}`;
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': getAuthHeader(),
          'Accept': 'application/pdf',
        },
      });

      if (!response.ok) {
        throw new Error(`QR code generation failed: ${response.status} ${response.statusText}`);
      }

      const blob = await response.blob();
      
      // Create and trigger download
      const downloadUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = 'qr_codes.pdf';
      link.style.display = 'none';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(downloadUrl);

      toast({
        title: "QR codes generated successfully",
        description: `Successfully generated QR codes for ${selectedAssets.length} asset(s).`,
      });
    } catch (error) {
      console.error('QR code generation error:', error);
      toast({
        title: "QR code generation failed",
        description: error instanceof Error ? error.message : "Failed to generate QR codes. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsPrintingQR(false);
    }
  };

  const getDisplayText = () => {
    if (selectedAssets.length === 0) return '';
    if (selectedAssets.length === 1) return selectedAssets[0].name;
    if (showAll) {
      return selectedAssets.map(asset => asset.name).join(', ');
    }
    if (selectedAssets.length <= 3) {
      return selectedAssets.map(asset => asset.name).join(', ');
    }
    return (
      <>
        {selectedAssets.slice(0, 2).map(asset => asset.name).join(', ')} and{' '}
        <button 
          onClick={() => setShowAll(true)} 
          className="text-blue-600 hover:text-blue-800 underline"
        >
          {selectedAssets.length - 2} more
        </button>
      </>
    );
  };

  return <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-white border border-gray-200 rounded-sm shadow-lg z-50 flex items-center px-4 py-4">
      <div className="flex items-center gap-10">
        <div className="flex items-center gap-2">
          <div className="text-white rounded-lg w-10 flex items-center justify-center text-sm font-bold self-stretch py-2 bg-red-700">
            {selectedCount}
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-gray-900 whitespace-nowrap">
              Assets Selected
            </span>
            <span className="text-xs text-gray-500 max-w-48 break-words">
              {getDisplayText()}
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
          
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleExport} 
            disabled={isExporting}
            className="text-gray-600 hover:bg-gray-100 flex flex-col items-center gap-1 px-2 py-2 h-auto disabled:opacity-50"
          >
            {isExporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
            <span className="text-xs font-medium">Export</span>
          </Button>
          
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handlePrintQRCode} 
            disabled={isPrintingQR}
            className="text-gray-600 hover:bg-gray-100 flex flex-col items-center gap-1 px-2 py-2 h-auto disabled:opacity-50"
          >
            {isPrintingQR ? <Loader2 className="w-4 h-4 animate-spin" /> : <QrCode className="w-4 h-4" />}
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
