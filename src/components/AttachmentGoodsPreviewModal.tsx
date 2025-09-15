
  import React, { useCallback } from 'react';
  import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
  import { Button } from '@/components/ui/button';
  import { Download, X, FileText, FileSpreadsheet, File } from 'lucide-react';
  import axios from 'axios';
  import { toast } from 'sonner';

interface AttachmentGoodsPreviewModalProps {
  isModalOpen: boolean;
  setIsModalOpen: (isOpen: boolean) => void;
  selectedDoc: {
    id?: number;
    document_name?: string;
    document_file_name?: string;
    url?: string;
    attachments?: any[];
    itemIndex?: number;
    itemName?: string;
    received?: boolean;
  } | null;
  setSelectedDoc: React.Dispatch<React.SetStateAction<any>>;
  toReceive?: boolean;
  onReceive?: (
    itemIndex: number,
    received: boolean,
    setReceiveModalOpen: (open: boolean) => void,
    receiveState: {
      handoverTo: string,
      setHandoverTo: (v: string) => void,
      receivedDate: string,
      setReceivedDate: (v: string) => void,
      remarks: string,
      setRemarks: (v: string) => void,
      attachments: File[],
      setAttachments: (v: File[]) => void,
      fileInputRef: React.RefObject<HTMLInputElement>,
    },
  ) => React.ReactNode;
}

export const AttachmentGoodsPreviewModal: React.FC<AttachmentGoodsPreviewModalProps> = ({
  isModalOpen,
  setIsModalOpen,
  selectedDoc,
  setSelectedDoc,
  toReceive = true,
  onReceive,
}) => {
  // Download handler for each attachment
  const handleDownload = useCallback(async (att: any) => {
    if (!att?.id && !att?.document) {
      toast.error('No document selected');
      return;
    }
    // Direct download if public URL
    if (att.document && att.document.startsWith('http')) {
      const link = document.createElement('a');
      link.href = att.document;
      link.download = att.document_name || att.document_file_name || `document_${att.id || 'file'}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      return;
    }
    // Otherwise, try API download (legacy)
    const token = localStorage.getItem('token');
    const baseUrl = localStorage.getItem('baseUrl');
    if (!token || !baseUrl) {
      toast.error('Missing required configuration');
      return;
    }
    try {
      const response = await axios.get(
        `https://${baseUrl}/attachfiles/${att.id}?show_file=true`,
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
      link.download = att.document_name || att.document_file_name || `document_${att.id}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error: any) {
      toast.error(error.message || 'Failed to download file');
    }
  }, []);
  // Receive state for per-item receive UI
  const [handoverTo, setHandoverTo] = React.useState('');
  const [receivedDate, setReceivedDate] = React.useState('');
  const [remarks, setRemarks] = React.useState('');
  const [attachments, setAttachments] = React.useState<File[]>([]);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleClose = useCallback(() => {
    setIsModalOpen(false);
    setSelectedDoc(null);
  }, [setIsModalOpen, setSelectedDoc]);

  const isImage = selectedDoc?.url && /\.(jpg|jpeg|png|webp|gif|svg)$/i.test(selectedDoc.url);
  // Helper to determine file type
  const getFileType = (url: string) => {
    if (/\.(jpg|jpeg|png|webp|gif|svg)$/i.test(url)) return 'image';
    if (/\.pdf$/i.test(url)) return 'pdf';
    if (/\.(xls|xlsx|csv)$/i.test(url)) return 'excel';
    if (/\.(doc|docx)$/i.test(url)) return 'word';
    return 'other';
  };
  // Render icon based on file type
  const renderFileIcon = (url: string) => {
    const type = getFileType(url);
    if (type === 'pdf') return <FileText className="w-16 h-16 text-red-600" />;
    if (type === 'excel') return <FileSpreadsheet className="w-16 h-16 text-green-600" />;
    if (type === 'word') return <FileText className="w-16 h-16 text-blue-600" />;
    return <File className="w-16 h-16 text-gray-600" />;
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
  <DialogContent className="w-full max-w-[90vw] sm:max-w-2xl bg-white rounded-lg h-[80vh] flex flex-col  overflow-y-auto">
  <button
    className="absolute top-3 right-3 text-gray-500 hover:text-black"
    aria-label="Close"
    onClick={handleClose}
  >
    <X className="w-5 h-5" />
  </button>

  <DialogHeader>
    <DialogTitle className="text-center text-lg font-medium">
      {selectedDoc?.itemName || 'Attachments'}
    </DialogTitle>
  </DialogHeader>

  {/* ✅ Make the scrollable section grow and scroll */}
    {selectedDoc?.attachments && selectedDoc.attachments.length > 0 ? (
  <div className="flex-1 px-4 pb-4">
      <div className="w-full flex flex-col gap-4 h-full">
        {selectedDoc.attachments.map((att: any, idx: number) => {
          const url = att.document || att.url || '';
          const type = getFileType(url);
          return (
            <div key={att.id || idx} className="flex items-center gap-4 border rounded p-3 bg-gray-50">
              {type === 'image' && url ? (
                <img
                  src={url}
                  alt={att.document_name || att.document_file_name || 'Attachment'}
                  className="w-20 h-20 object-contain rounded border"
                />
              ) : (
                <div className="flex items-center justify-center w-20 h-20 bg-gray-100 rounded-md border">
                  {renderFileIcon(url)}
                </div>
              )}
              <div className="flex-1">
                <div className="font-medium text-gray-900">
                  {att.document_name || att.document_file_name || url?.split('/').pop() || 'Attachment'}
                </div>
                <div className="text-xs text-gray-500 break-all">{url}</div>
              </div>
              <Button
                onClick={() => handleDownload(att)}
                className="bg-blue-600 text-white hover:bg-blue-700"
              >
                <Download className="mr-2 w-4 h-4" />
                Download
              </Button>
            </div>
          );
        })}
      </div>
  </div>
    ) : (
        <></>
    )}

  {/* Optional receive UI */}
  {toReceive && onReceive && selectedDoc?.itemIndex !== undefined && selectedDoc?.received !== undefined && (
    onReceive(
      selectedDoc.itemIndex,
      selectedDoc.received,
      setIsModalOpen,
      {
        handoverTo,
        setHandoverTo,
        receivedDate,
        setReceivedDate,
        remarks,
        setRemarks,
        attachments,
        setAttachments,
        fileInputRef,
      }
    )
  )}
</DialogContent>

    </Dialog>
  );
};