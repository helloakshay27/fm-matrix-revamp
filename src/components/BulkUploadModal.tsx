
import React, { useState } from 'react';
import { X, Upload } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface BulkUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BulkUploadModal = ({ isOpen, onClose }: BulkUploadModalProps) => {
  const [uploadType, setUploadType] = useState<'upload' | 'update'>('upload');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    setSelectedFile(file);
  };

  const handleImport = () => {
    if (selectedFile) {
      console.log(`${uploadType === 'upload' ? 'Bulk Upload' : 'Bulk Update'} file:`, selectedFile.name);
      // Handle file upload logic here
      onClose();
    }
  };

  const handleDownloadSample = () => {
    console.log('Download Sample Format');
    // Handle sample download logic here
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-[#1a1a1a]">
            Bulk Upload
          </DialogTitle>
          <button
            onClick={onClose}
            className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </button>
        </DialogHeader>
        
        <div className="space-y-6 p-2">
          {/* Radio buttons for Upload/Update */}
          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="uploadType"
                value="upload"
                checked={uploadType === 'upload'}
                onChange={(e) => setUploadType(e.target.value as 'upload')}
                className="w-4 h-4 text-[#C72030] border-[#D5DbDB] focus:ring-[#C72030]"
              />
              <span className="text-sm text-[#1a1a1a]">Bulk Upload</span>
            </label>
            
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="uploadType"
                value="update"
                checked={uploadType === 'update'}
                onChange={(e) => setUploadType(e.target.value as 'update')}
                className="w-4 h-4 text-[#C72030] border-[#D5DbDB] focus:ring-[#C72030]"
              />
              <span className="text-sm text-[#1a1a1a]">Bulk Update</span>
            </label>
          </div>

          {/* File selection */}
          <div className="space-y-2">
            <label className="block">
              <span className="text-sm text-[#C72030] cursor-pointer">Choose File</span>
              <input
                type="file"
                accept=".csv,.xlsx,.xls"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
            <span className="text-sm text-[#1a1a1a] opacity-70">
              {selectedFile ? selectedFile.name : 'No file chosen'}
            </span>
          </div>

          {/* Import button */}
          <div className="flex justify-start">
            <Button
              onClick={handleImport}
              disabled={!selectedFile}
              className="bg-[#8B4B8C] hover:bg-[#8B4B8C]/90 text-white px-6 py-2 rounded-lg"
            >
              Import
            </Button>
          </div>

          {/* Download Sample Format */}
          <div className="flex justify-end pt-4">
            <Button
              onClick={handleDownloadSample}
              variant="outline"
              className="border-[#D5DbDB] text-[#1a1a1a] hover:bg-[#f6f4ee]"
            >
              Download Sample Format
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
