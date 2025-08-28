import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Download, X, FileText, Image, File } from 'lucide-react';

interface AttachmentPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  attachment: {
    id: string;
    name: string;
    type: string;
    url: string;
    size: string;
  } | null;
}

export const AttachmentPreviewModal: React.FC<AttachmentPreviewModalProps> = ({
  isOpen,
  onClose,
  attachment
}) => {
  if (!attachment) return null;

  const handleDownload = () => {
    // Create a temporary link element and trigger download
    const link = document.createElement('a');
    link.href = attachment.url;
    link.download = attachment.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const renderPreview = () => {
    if (attachment.type.startsWith('image/')) {
      return (
        <div className="flex justify-center">
          <img
            src={attachment.url}
            alt={attachment.name}
            className="max-w-full max-h-96 object-contain rounded-lg"
          />
        </div>
      );
    } else if (attachment.type === 'application/pdf') {
      return (
        <div className="flex flex-col items-center justify-center h-64 bg-muted rounded-lg">
          <FileText className="w-16 h-16 text-muted-foreground mb-4" />
          <p className="text-muted-foreground">PDF Preview</p>
          <p className="text-sm text-muted-foreground">{attachment.name}</p>
        </div>
      );
    } else {
      return (
        <div className="flex flex-col items-center justify-center h-64 bg-muted rounded-lg">
          <File className="w-16 h-16 text-muted-foreground mb-4" />
          <p className="text-muted-foreground">Document Preview</p>
          <p className="text-sm text-muted-foreground">{attachment.name}</p>
        </div>
      );
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-auto">
        <DialogHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <DialogTitle className="text-xl font-semibold">{attachment.name}</DialogTitle>
          <DialogClose asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <X className="h-4 w-4" />
            </Button>
          </DialogClose>
        </DialogHeader>

        <div className="space-y-4">
          {/* File Info */}
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>Size: {attachment.size}</span>
            <span>Type: {attachment.type}</span>
          </div>

          {/* Preview Area */}
          <div className="border border-border rounded-lg p-4">
            {renderPreview()}
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
            <Button onClick={handleDownload} className="flex items-center gap-2">
              <Download className="w-4 h-4" />
              Download
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};