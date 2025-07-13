
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { X, Upload } from 'lucide-react';

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

  const handleUpload = () => {
    console.log('Uploading file:', selectedFile);
    setSelectedFile(null);
    onClose();
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
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <Upload className="mx-auto h-12 w-12 text-gray-400" />
            <div className="mt-2">
              <label htmlFor="file-upload" className="cursor-pointer">
                <span className="text-sm font-medium text-gray-700">Upload a file</span>
                <input
                  id="file-upload"
                  type="file"
                  className="hidden"
                  accept=".csv,.xlsx,.xls"
                  onChange={handleFileSelect}
                />
              </label>
              <p className="text-xs text-gray-500 mt-1">CSV, Excel files only</p>
            </div>
          </div>
          
          {selectedFile && (
            <div className="text-sm text-gray-600">
              Selected: {selectedFile.name}
            </div>
          )}
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
