
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { X, Upload, Download } from 'lucide-react';

interface ChecklistBulkUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ChecklistBulkUploadModal = ({ isOpen, onClose }: ChecklistBulkUploadModalProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleDownloadTemplate = () => {
    console.log('Downloading template...');
  };

  const handleUpload = () => {
    if (selectedFile) {
      console.log('Uploading file:', selectedFile.name);
      setSelectedFile(null);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] p-0">
        <DialogHeader className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-lg font-medium text-gray-900">Bulk Upload</DialogTitle>
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
        
        <div className="px-6 py-4 space-y-4">
          <div 
            className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center bg-gray-50"
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
            <p className="text-gray-600 mb-2">
              {selectedFile ? selectedFile.name : 'Drag and drop your file here, or click to browse'}
            </p>
            <input
              type="file"
              id="fileUpload"
              className="hidden"
              onChange={handleFileSelect}
              accept=".xlsx,.xls,.csv"
            />
            <label
              htmlFor="fileUpload"
              className="text-blue-600 underline cursor-pointer hover:text-blue-700"
            >
              Browse files
            </label>
          </div>

          <div className="flex justify-center">
            <Button
              variant="outline"
              onClick={handleDownloadTemplate}
              className="flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Download Template
            </Button>
          </div>
        </div>

        <div className="flex justify-end px-6 py-4 border-t border-gray-200">
          <Button
            onClick={handleUpload}
            disabled={!selectedFile}
            className="bg-purple-700 hover:bg-purple-800 text-white px-6"
          >
            Upload
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
