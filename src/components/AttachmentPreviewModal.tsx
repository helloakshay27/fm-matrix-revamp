import { useCallback } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Download, X, FileText, FileSpreadsheet, File } from 'lucide-react';
import axios from 'axios';
import { toast } from 'sonner';

interface AttachmentPreviewModalProps {
  isModalOpen: boolean;
  setIsModalOpen: (isOpen: boolean) => void;
  selectedDoc: {
    id: number;
    document_name?: string;
    document_file_name?: string;
    url: string;
  } | null;
  setSelectedDoc: React.Dispatch<React.SetStateAction<{
    id: number;
    document_name?: string;
    document_file_name?: string;
    url: string;
  } | null>>;
}

export const AttachmentPreviewModal: React.FC<AttachmentPreviewModalProps> = ({
  isModalOpen,
  setIsModalOpen,
  selectedDoc,
  setSelectedDoc,
}) => {
  const handleDownload = useCallback(async () => {
    if (!selectedDoc?.id) {
      toast.error('No document selected');
      return;
    }

    const token = localStorage.getItem('token');
    const baseUrl = localStorage.getItem('baseUrl');
    if (!token || !baseUrl) {
      toast.error('Missing required configuration');
      return;
    }

    try {
      const response = await axios.get(
        `https://${baseUrl}/attachfiles/${selectedDoc.id}?show_file=true`,
        {
          headers: { Authorization: `Bearer ${token}` },
          responseType: 'blob'
        }
      );

      const contentType = response.headers['content-type'] || 'application/octet-stream';
      const blob = new Blob([response.data], { type: contentType });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = selectedDoc.document_name || selectedDoc.document_file_name || `document_${selectedDoc.id}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      setIsModalOpen(false);
      setSelectedDoc(null);
    } catch (error: any) {
      toast.error(error.message || 'Failed to download file');
    }
  }, [selectedDoc, setIsModalOpen, setSelectedDoc]);

  const handleClose = useCallback(() => {
    setIsModalOpen(false);
    setSelectedDoc(null);
  }, [setIsModalOpen, setSelectedDoc]);

  const isImage = selectedDoc?.url && /\.(jpg|jpeg|png|webp|gif|svg)$/i.test(selectedDoc.url);
  const isPdf = selectedDoc?.url && /\.pdf$/i.test(selectedDoc.url);
  const isExcel = selectedDoc?.url && /\.(xls|xlsx|csv)$/i.test(selectedDoc.url);
  const isWord = selectedDoc?.url && /\.(doc|docx)$/i.test(selectedDoc.url);

  const renderFileIcon = () => {
    if (isPdf) {
      return <FileText className="w-16 h-16 text-red-600" />;
    } else if (isExcel) {
      return <FileSpreadsheet className="w-16 h-16 text-green-600" />;
    } else if (isWord) {
      return <FileText className="w-16 h-16 text-blue-600" />;
    }
    return <File className="w-16 h-16 text-gray-600" />;
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
      <DialogContent className="w-full max-w-[90vw] sm:max-w-2xl bg-white rounded-lg">
        <button
          className="absolute top-3 right-3 text-gray-500 hover:text-black"
          aria-label="Close"
          onClick={handleClose}
        >
          <X className="w-5 h-5" />
        </button>
        <DialogHeader>
          <DialogTitle className="text-center text-lg font-medium">
            {selectedDoc?.document_name || selectedDoc?.document_file_name || 'Document'}
          </DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center justify-center gap-4 py-4">
          {selectedDoc?.url ? (
            <img
              src={selectedDoc.url}
              alt={selectedDoc.document_name || selectedDoc.document_file_name}
              className="max-w-full max-h-[400px] rounded-md border object-contain"
            />
          ) : (
            <div className="flex items-center justify-center w-20 h-20 bg-gray-100 rounded-md border">
              {renderFileIcon()}
            </div>
          )}
          {
            selectedDoc?.id && (
              <Button
                onClick={handleDownload}
                className="bg-blue-600 text-white hover:bg-blue-700"
              >
                <Download className="mr-2 w-4 h-4" />
                Download
              </Button>
            )
          }
        </div>
      </DialogContent>
    </Dialog>
  );
};