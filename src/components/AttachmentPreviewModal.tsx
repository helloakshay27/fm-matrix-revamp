import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Download, X, FileText, File } from 'lucide-react';
import axios from 'axios';

interface AttachmentPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  attachment: {
    id: number;
    document_file_name: string;
    url: string;
  } | null;
}

export const AttachmentPreviewModal: React.FC<AttachmentPreviewModalProps> = ({
  isOpen,
  onClose,
  attachment
}) => {
  if (!attachment) return null;

  const fileName = attachment.document_file_name;
  const ext = fileName.split(".").pop()?.toLowerCase();

  // derive pseudo type
  const getFileType = () => {
    if (["png", "jpg", "jpeg", "gif", "webp"].includes(ext || "")) return "image";
    if (ext === "pdf") return "pdf";
    return "other";
  };

  const type = getFileType();

  const handleDownload = async () => {
    try {
      const baseUrl = localStorage.getItem("baseUrl");
      const token = localStorage.getItem("token");

      if (!baseUrl || !token) {
        throw new Error("Missing baseUrl or token in localStorage");
      }

      const response = await axios.get(
        `https://${baseUrl}/attachfiles/${attachment.id}.json?show_file=true`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          responseType: "blob",
        }
      );

      const blob = new Blob([response.data]);
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = attachment.document_file_name || "download";
      document.body.appendChild(link);
      link.click();

      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("File download failed:", error);
    }
  };

  const renderPreview = () => {
    if (type === "image") {
      return (
        <div className="flex justify-center">
          <img
            src={attachment.url}
            alt={fileName}
            className="max-w-full max-h-96 object-contain rounded-lg"
          />
        </div>
      );
    } else if (type === "pdf") {
      return (
        <div className="flex flex-col items-center justify-center h-64 bg-muted rounded-lg">
          <FileText className="w-16 h-16 text-muted-foreground mb-4" />
          <p className="text-muted-foreground">PDF File</p>
          <p className="text-sm text-muted-foreground">{fileName}</p>
        </div>
      );
    } else {
      return (
        <div className="flex flex-col items-center justify-center h-64 bg-muted rounded-lg">
          <File className="w-16 h-16 text-muted-foreground mb-4" />
          <p className="text-muted-foreground">Unsupported Preview</p>
          <p className="text-sm text-muted-foreground">{fileName}</p>
        </div>
      );
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-auto">
        <DialogHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <DialogTitle className="text-xl font-semibold">{fileName}</DialogTitle>
          <DialogClose asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <X className="h-4 w-4" />
            </Button>
          </DialogClose>
        </DialogHeader>

        <div className="space-y-4">
          {/* File Info */}
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>Type: {ext?.toUpperCase()}</span>
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
