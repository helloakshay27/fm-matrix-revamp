
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
    setSelectedFile(file || null);
  };

  const handleDownloadSample = () => {
    console.log('Download sample format');
    // Handle download sample format logic
  };

  const handleImport = () => {
    console.log('Import file:', selectedFile);
    // Handle import logic
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md bg-white [&>button]:hidden">
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
          <div className="space-y-4">
            <label className="text-sm font-medium text-gray-700">Upload</label>
            <div className="relative">
              <input
                type="file"
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                accept=".csv,.xlsx,.xls"
              />
              <div className="border border-gray-300 rounded-md p-3 bg-gray-50">
                <span className="text-orange-500 underline cursor-pointer">Choose File</span>
                <span className="text-gray-500 ml-2">
                  {selectedFile ? selectedFile.name : 'No file chosen'}
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3">
            <Button
              onClick={handleDownloadSample}
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2"
            >
              Download Sample Format
            </Button>
            <Button
              onClick={handleImport}
              style={{ backgroundColor: '#6B46C1' }}
              className="hover:bg-purple-700 text-white px-6 py-2"
            >
              Import
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
