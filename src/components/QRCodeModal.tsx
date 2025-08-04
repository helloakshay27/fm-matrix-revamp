import React from 'react';
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Download } from 'lucide-react';

interface QRCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  qrCode: string;
  serviceName?: string;
  site?: string;
  handleDownloadQR?: () => void;
}

export const QRCodeModal: React.FC<QRCodeModalProps> = ({
  isOpen,
  onClose,
  qrCode,
  serviceName,
  site,
  handleDownloadQR,
}) => {
  const handleDownload = async () => {
    if (!qrCode) return;

    const fileName = `${serviceName.replace(/\s+/g, '_')}_QRCode.png`;

    try {
      const response = await fetch(qrCode, { mode: 'cors' });
      if (!response.ok) throw new Error('Fetch failed');
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (err) {
      // fallback if blob fails
      const fallbackLink = document.createElement('a');
      fallbackLink.href = qrCode;
      fallbackLink.setAttribute('download', fileName);
      fallbackLink.setAttribute('target', '_blank');
      document.body.appendChild(fallbackLink);
      fallbackLink.click();
      document.body.removeChild(fallbackLink);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="max-w-md"
        style={{ backgroundColor: '#F6F4EE8F' }}
      >
        <div className="flex flex-col items-center space-y-4 p-4">
          {/* QR Code Display */}
          <div className="w-48 h-48 bg-white border-2 border-gray-200 flex items-center justify-center">
            {qrCode ? (
              <img
                src={qrCode}
                alt={`${serviceName} QR Code`}
                className="w-44 h-44 object-contain p-2"
              />
            ) : (
              <p className="text-sm text-gray-500">QR code not available</p>
            )}
          </div>

          {/* QR Meta Info */}
          <div className="text-center text-sm text-gray-700">
            <div className="font-semibold">{serviceName}</div>
            <div>{site}</div>
          </div>

          {/* Download Button */}
          {qrCode && (
            <Button
              onClick={handleDownloadQR || handleDownload}
              variant="outline"
              className="flex items-center gap-2 border-[#BF213E] text-[#BF213E] hover:bg-[#BF213E] hover:text-white"
            >
              <Download className="w-4 h-4" />
              Download
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
