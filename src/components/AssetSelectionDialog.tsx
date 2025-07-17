import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Download, QrCode, LogIn, X, Users, Package } from 'lucide-react';

interface Asset {
  id: string;
  name: string;
}

interface AssetSelectionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedCount: number;
  selectedAssets: Asset[];
  onPrintQRCode: () => void;
  onCheckIn: () => void;
  onClearSelection: () => void;
}

export const AssetSelectionDialog: React.FC<AssetSelectionDialogProps> = ({
  open,
  onOpenChange,
  selectedCount,
  selectedAssets,
  onPrintQRCode,
  onCheckIn,
  onClearSelection
}) => {
  const [showAll, setShowAll] = useState(false);

  const handleExport = () => {
    console.log('Export clicked for', selectedAssets.length, 'selected assets');
    
    // Create CSV content with headers
    const headers = ['Asset Name', 'Asset ID'];
    const csvContent = [
      headers.join(','),
      ...selectedAssets.map(asset => 
        `"${asset.name}","${asset.id}"`
      )
    ].join('\n');

    // Create and download the file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `selected_assets_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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

  const handleClose = () => {
    onClearSelection();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-2">
              <div className="text-white rounded-lg w-8 h-8 flex items-center justify-center text-sm font-bold bg-red-700">
                {selectedCount}
              </div>
              Assets Selected
            </DialogTitle>
            <Button variant="ghost" size="icon" onClick={handleClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="text-sm text-muted-foreground max-w-full break-words">
            {getDisplayText()}
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <Button variant="outline" onClick={handleExport} className="flex items-center gap-2">
              <Download className="w-4 h-4" />
              Export
            </Button>
            
            <Button variant="outline" onClick={onPrintQRCode} className="flex items-center gap-2">
              <QrCode className="w-4 h-4" />
              Print QR Code
            </Button>
            
            <Button onClick={onCheckIn} className="col-span-2 bg-green-500 hover:bg-green-600 text-white flex items-center gap-2">
              <LogIn className="w-4 h-4" />
              CHECK IN
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};