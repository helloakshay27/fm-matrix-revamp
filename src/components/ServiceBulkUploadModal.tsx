import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { X } from 'lucide-react';

interface ServiceBulkUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ServiceBulkUploadModal = ({ isOpen, onClose }: ServiceBulkUploadModalProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadType, setUploadType] = useState<'upload' | 'update'>('upload');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setSelectedFile(null);
      setUploadType('upload');
    }
  }, [isOpen]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) setSelectedFile(file);
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files?.[0];
    if (file) setSelectedFile(file);
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const handleImport = async () => {
    if (!selectedFile) {
      toast.error('Please select a file first');
      return;
    }

    const formData = new FormData();
    formData.append('pms_services_file', selectedFile);

    const token = localStorage.getItem('token');
    const baseUrl = localStorage.getItem('baseUrl');

    if (!token || !baseUrl) {
      toast.error('Missing token or baseUrl');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`https://${baseUrl}/pms/services/upload_services.json`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.message || 'Failed to upload');
      }

      // handle import_errors like AMC modal
      if (data.import_errors && data.import_errors.length > 0) {
        const firstError = data.import_errors[0];
        toast.error('Import completed with errors', {
          description: `Row ${firstError.row_number}: ${firstError.error}`,
          duration: 10000,
        });
      } else {
        toast.success('Upload successful');
        onClose();
      }
    } catch (error) {
      console.error('Upload failed:', error);
      toast.error('Upload failed. Please check the file format or try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadSample = () => {
    const csvContent =
      'Service Name,Site,Building,Wing,Area,Floor,Room,Group,Sub-Group\nSample Service,Tower 4,Wing2,South,Lobby,Ground Floor,Room 101,Maintenance,Electrical';
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'service_sample_format.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader className="relative">
          <DialogTitle className="text-xl font-semibold">Bulk Upload</DialogTitle>
          <button
            onClick={onClose}
            className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
          >
            <X className="w-5 h-5" />
          </button>
        </DialogHeader>

        <div className="space-y-6">
          <div className="flex gap-6">
            {['upload', 'update'].map((type) => (
              <label key={type} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="uploadType"
                  value={type}
                  checked={uploadType === type}
                  onChange={(e) => setUploadType(e.target.value as 'upload' | 'update')}
                  className="w-4 h-4"
                  style={{ accentColor: '#C72030' }}
                />
                <span className="text-sm capitalize">Bulk {type}</span>
              </label>
            ))}
          </div>

          <div
            className="border-2 border-dashed border-[#C72030] rounded-lg p-12 text-center"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
          >
            <input
              type="file"
              onChange={handleFileChange}
              className="hidden"
              id="file-upload"
              accept=".csv,.xlsx,.xls"
            />
            <div className="mb-4">
              <span className="text-gray-600">Drag & Drop or </span>
              <label htmlFor="file-upload" className="text-[#C72030] cursor-pointer underline">
                Choose File
              </label>
            </div>
            <div className="text-sm text-gray-500">
              {selectedFile ? selectedFile.name : 'No file chosen'}
            </div>
          </div>

          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={handleDownloadSample}
              className="border-[#C72030] text-[#C72030] hover:bg-[#C72030]/10"
              disabled={isLoading}
            >
              Download Sample Format
            </Button>
            <Button
              onClick={handleImport}
              style={{ backgroundColor: '#C72030' }}
              className="text-white hover:bg-[#C72030]/90"
              disabled={isLoading}
            >
              {isLoading ? 'Importing...' : 'Import'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
