
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

interface RVehicleImportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RVehicleImportModal = ({ isOpen, onClose }: RVehicleImportModalProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md bg-white">
        <DialogHeader className="flex flex-row items-center justify-between border-b pb-4">
          <DialogTitle className="text-lg font-semibold">Bulk Upload</DialogTitle>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-6 w-6 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>
        
        <div className="p-6 space-y-6">
          {/* Upload Section */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Upload</label>
            <div className="border border-gray-300 rounded p-4 text-center">
              <input
                type="file"
                onChange={handleFileChange}
                className="hidden"
                id="file-upload"
                accept=".csv,.xlsx,.xls"
              />
              <label 
                htmlFor="file-upload" 
                className="text-orange-500 hover:text-orange-600 cursor-pointer"
              >
                Choose File
              </label>
              <span className="ml-2 text-gray-500">
                {selectedFile ? selectedFile.name : 'No file chosen'}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between gap-3">
            <Button
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2"
            >
              Download Sample Format
            </Button>
            <Button
              className="bg-[#8B4B8C] hover:bg-[#7A4077] text-white px-6 py-2"
              onClick={onClose}
            >
              Import
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
