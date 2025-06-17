
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { X } from 'lucide-react';

interface ServiceBulkUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ServiceBulkUploadModal = ({ isOpen, onClose }: ServiceBulkUploadModalProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadType, setUploadType] = useState<'upload' | 'update'>('upload');

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const handleImport = () => {
    console.log('Importing file:', selectedFile);
    console.log('Upload type:', uploadType);
    // Handle import logic here
    onClose();
  };

  const handleDownloadSample = () => {
    console.log('Downloading sample format');
    // Handle download sample format logic here
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-semibold">Bulk Upload</DialogTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-6 w-6 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Radio buttons for upload type */}
          <div className="flex gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="uploadType"
                value="upload"
                checked={uploadType === 'upload'}
                onChange={(e) => setUploadType(e.target.value as 'upload' | 'update')}
                className="w-4 h-4 text-blue-600"
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
                className="w-4 h-4 text-blue-600"
              />
              <span className="text-sm">Bulk Update</span>
            </label>
          </div>

          {/* File upload area */}
          <div 
            className="border-2 border-dashed border-orange-300 rounded-lg p-12"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
          >
            <div className="text-center">
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
                  className="text-orange-500 hover:text-orange-600 cursor-pointer underline"
                >
                  Choose File
                </label>
              </div>
              <div className="text-sm text-gray-500">
                {selectedFile ? selectedFile.name : 'No file chosen'}
              </div>
            </div>
          </div>

          {/* Action buttons */}
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
