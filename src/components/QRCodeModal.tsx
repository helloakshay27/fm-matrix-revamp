
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Download } from 'lucide-react';

interface QRCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  qrCode: string;
  serviceName: string;
  site: string;
}

export const QRCodeModal: React.FC<QRCodeModalProps> = ({ 
  isOpen, 
  onClose, 
  qrCode, 
  serviceName, 
  site 
}) => {
  const handleDownload = () => {
    console.log(`Downloading QR code ${qrCode} for ${serviceName} at ${site}`);
    // Here you would implement the actual download logic
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        className="max-w-md" 
        style={{ backgroundColor: '#F6F4EE8F' }}
      >
        <DialogHeader>
          <DialogTitle className="text-center">QR Code</DialogTitle>
        </DialogHeader>
        
        <div className="flex flex-col items-center space-y-4 p-4">
          {/* Large QR Code Display */}
          <div className="w-48 h-48 bg-white border-2 border-gray-200 flex items-center justify-center">
            <div className="w-44 h-44 bg-black flex items-center justify-center">
              <div className="w-40 h-40 bg-white grid grid-cols-8 gap-px p-2">
                {Array.from({ length: 64 }).map((_, i) => (
                  <div 
                    key={i} 
                    className="aspect-square" 
                    style={{ 
                      backgroundColor: Math.random() > 0.5 ? 'black' : 'white' 
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
          
          {/* Service Info */}
          <div className="text-center text-sm text-gray-600">
            <div className="font-medium">{serviceName}</div>
            <div>{site}</div>
          </div>
          
          {/* Download Button */}
          <Button 
            onClick={handleDownload}
            variant="outline"
            className="flex items-center gap-2 border-[#BF213E] text-[#BF213E] hover:bg-[#BF213E] hover:text-white"
          >
            <Download className="w-4 h-4" />
            Download
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
