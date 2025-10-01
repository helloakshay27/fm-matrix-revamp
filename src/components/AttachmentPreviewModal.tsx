import React, { useCallback } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { X, Download, FileText, FileSpreadsheet, File } from 'lucide-react';
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
  // Early return if no selectedDoc
  if (!selectedDoc) return null;

  const handleDownload = useCallback(async () => {
    // Fix: Check for all possible URL properties
    const downloadUrl = selectedDoc.url || selectedDoc.document_url || selectedDoc.document || selectedDoc.file_url;
    const fileName = selectedDoc.document_name || selectedDoc.document_file_name || selectedDoc.name || 'document';
    
    if (!downloadUrl) {
      console.error('No download URL found for document:', selectedDoc);
      toast.error('No download URL available');
      return;
    }

    // Check if we have an attachment ID for API download
    const attachmentId = selectedDoc.id || selectedDoc.attachment_id;
    
    if (attachmentId) {
      // Use API download if we have an attachment ID
      const token = localStorage.getItem('token');
      const baseUrl = localStorage.getItem('baseUrl');
      
      if (!token || !baseUrl) {
        toast.error('Missing required configuration');
        return;
      }

      try {
        const response = await axios.get(
          `https://${baseUrl}/attachfiles/${attachmentId}?show_file=true`,
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
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
        
        toast.success('File downloaded successfully');
      } catch (error: any) {
        console.error('API download failed:', error);
        // Fallback to direct URL download
        fallbackDownload(downloadUrl, fileName);
      }
    } else {
      // Direct URL download if no attachment ID
      fallbackDownload(downloadUrl, fileName);
    }
  }, [selectedDoc]);

  const fallbackDownload = (url: string, fileName: string) => {
    try {
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success('File download initiated');
    } catch (error) {
      console.error('Direct download failed:', error);
      toast.error('Failed to download file');
    }
  };

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

  const renderContent = () => {
    // Fix: Check for all possible URL properties
    const url = selectedDoc.url || selectedDoc.document_url || selectedDoc.document || selectedDoc.file_url;
    
    if (!url) {
      return (
        <div className="flex flex-col items-center justify-center py-8">
          <p className="text-gray-600 mb-4">
            No preview available - URL not found
          </p>
        </div>
      );
    }
    
    switch (true) {
      case isImage:
        return (
          <div className="flex flex-col items-center">
            <div className="flex justify-center mb-4">
              <img
                src={url}
                alt={selectedDoc.document_name || selectedDoc.document_file_name || 'Attachment'}
                className="max-w-full max-h-96 object-contain"
              />
            </div>
            <Button
              onClick={handleDownload}
              className="bg-[#C72030] text-white hover:bg-[#C72030]/90"
            >
              <Download className="w-4 h-4 mr-2" />
              Download File
            </Button>
          </div>
        );

      case isPdf:
        return (
          <div className="flex flex-col">
            <div className="h-96 mb-4">
              <iframe
                src={url}
                className="w-full h-full border-0"
                title={selectedDoc.document_name || selectedDoc.document_file_name || 'PDF Document'}
              />
            </div>
            <div className="flex justify-center">
              <Button
                onClick={handleDownload}
                className="bg-[#C72030] text-white hover:bg-[#C72030]/90"
              >
                <Download className="w-4 h-4 mr-2" />
                Download File
              </Button>
            </div>
          </div>
        );

      default:
        return (
          <div className="flex flex-col items-center justify-center py-8">
            <div className="w-16 h-16 flex items-center justify-center border rounded-md text-gray-600 bg-white mb-4">
              {isExcel ? (
                <FileSpreadsheet className="w-8 h-8 text-green-600" />
              ) : isWord ? (
                <FileText className="w-8 h-8 text-blue-600" />
              ) : (
                <File className="w-8 h-8" />
              )}
            </div>
            <p className="text-gray-600 mb-4">
              Preview not available for this file type
            </p>
            <Button
              onClick={handleDownload}
              className="bg-[#C72030] text-white hover:bg-[#C72030]/90"
            >
              <Download className="w-4 h-4 mr-2" />
              Download File
            </Button>
          </div>
        );
    }
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-lg font-semibold">
              {selectedDoc.document_name || 'Attachment Preview'}
            </DialogTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClose}
              className="h-6 w-6 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="mt-4">
          {renderContent()}
        </div>
      </DialogContent>
    </Dialog>
  );
};