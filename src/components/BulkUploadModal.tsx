
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface BulkUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BulkUploadModal = ({ isOpen, onClose }: BulkUploadModalProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleImport = () => {
    console.log('Importing file:', selectedFile);
    // Handle import functionality
    onClose();
  };

  const handleDownloadSample = () => {
    console.log('Downloading sample format');
    // Handle download sample format
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Bulk Upload</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="text-center">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8">
              <input
                type="file"
                onChange={handleFileChange}
                className="hidden"
                id="file-upload"
                accept=".csv,.xlsx,.xls"
              />
              <label 
                htmlFor="file-upload" 
                className="text-[#C72030] hover:text-[#A01B28] cursor-pointer font-medium"
              >
                Choose File
              </label>
              <span className="ml-2 text-gray-500">
                {selectedFile ? selectedFile.name : 'No file chosen'}
              </span>
            </div>
          </div>

          <div className="flex justify-between">
            <Button 
              onClick={handleDownloadSample}
              style={{ backgroundColor: '#C72030' }}
              className="hover:bg-[#A01B28] text-white px-6"
            >
              Download Sample Format
            </Button>
            <Button 
              onClick={handleImport}
              style={{ backgroundColor: '#C72030' }}
              className="hover:bg-[#A01B28] text-white px-6"
            >
              Import
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
