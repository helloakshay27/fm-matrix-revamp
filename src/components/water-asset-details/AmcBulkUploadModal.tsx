import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';

interface AmcBulkUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUploadSuccess?: () => void;
}

export const AmcBulkUploadModal = ({
  isOpen,
  onClose,
  onUploadSuccess,
}: AmcBulkUploadModalProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadType, setUploadType] = useState<'upload' | 'update'>('upload');

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      console.log('File selected:', file.name);
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files?.[0];
    if (file) {
      setSelectedFile(file);
      console.log('File dropped:', file.name);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const handleUpload = async (actionType: 'upload' | 'update') => {
    if (!selectedFile) {
      toast.error('Please select a file');
      return;
    }

    const baseUrl = localStorage.getItem('baseUrl');
    const token = localStorage.getItem('token');

    if (!baseUrl || !token) {
      toast.error('Base URL or token is missing');
      return;
    }

    const url =
      actionType === 'upload'
        ? `https://${baseUrl}/pms/asset_amcs/bulk_upload.json`
        : `https://${baseUrl}/pms/asset_amcs/update_amcs.json`;

    const formData = new FormData();
    formData.append('amc_file', selectedFile);

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Server responded with ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      console.log(`Bulk ${actionType} successful:`, data);
      toast.success(`Bulk ${actionType} successful`);
      onUploadSuccess?.();
      onClose();
    } catch (error) {
      console.error(`Error during bulk ${actionType}:`, error);
      toast.error(`Failed to perform bulk ${actionType}`);
    }
  };

  const handleImport = async () => {
    await handleUpload(uploadType);
  };

  const handleDownloadSample = () => {
    console.log('Downloading AMC sample format');
    const csvContent =
      'AMC Name,Asset,Start Date,End Date,Details\nSample AMC,Asset 1,2023-01-01,2024-01-01,Maintenance Contract';
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', 'amc_sample_format.csv');
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Bulk AMC Upload</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="flex gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="uploadType"
                value="upload"
                checked={uploadType === 'upload'}
                onChange={(e) => setUploadType(e.target.value as 'upload' | 'update')}
                className="w-4 h-4"
                style={{ accentColor: '#C72030' }}
              />
              <span className="text-sm">Bulk Upload</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="uploadType"
                value="update"
                checked={uploadType === 'update'}
                onChange={(e) => setUploadType(e.target.value as 'upload' | 'update')}
                className="w-4 h-4"
                style={{ accentColor: '#C72030' }}
              />
              <span className="text-sm">Bulk Update</span>
            </label>
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
              <label
                htmlFor="file-upload"
                className="text-[#C72030] cursor-pointer underline"
              >
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
            >
              Download Sample Format
            </Button>
            <Button
              onClick={handleImport}
              style={{ backgroundColor: '#C72030' }}
              className="text-white hover:bg-[#C72030]/90"
            >
              Import
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};