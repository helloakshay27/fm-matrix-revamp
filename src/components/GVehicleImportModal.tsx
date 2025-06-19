
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { X, Download } from 'lucide-react';

interface GVehicleImportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GVehicleImportModal = ({ isOpen, onClose }: GVehicleImportModalProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleDownloadSample = () => {
    console.log('Downloading sample format...');
    // Mock sample download
    alert('Sample format downloaded successfully!');
  };

  const handleImport = () => {
    if (selectedFile) {
      console.log('Importing file:', selectedFile.name);
      // Mock import functionality
      alert(`File "${selectedFile.name}" imported successfully!`);
      setSelectedFile(null);
      onClose();
    } else {
      alert('Please select a file to import');
    }
  };

  const handleClose = () => {
    setSelectedFile(null);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-white [&>button]:hidden">
        <DialogHeader className="flex flex-row items-center justify-between border-b pb-4">
          <DialogTitle className="text-lg font-semibold">Bulk Upload</DialogTitle>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleClose}
            className="h-6 w-6 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>
        
        <div className="p-6 space-y-6">
          {/* Upload Section */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Upload
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center bg-gray-50">
              <input
                type="file"
                id="file-upload"
                accept=".csv,.xlsx,.xls"
                onChange={handleFileChange}
                className="hidden"
              />
              <label
                htmlFor="file-upload"
                className="cursor-pointer inline-flex items-center gap-2"
              >
                <Button
                  type="button"
                  variant="outline"
                  className="bg-orange-500 hover:bg-orange-600 text-white border-orange-500"
                  onClick={() => document.getElementById('file-upload')?.click()}
                >
                  Choose File
                </Button>
                <span className="text-gray-500">
                  {selectedFile ? selectedFile.name : 'No file chosen'}
                </span>
              </label>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button 
              onClick={handleDownloadSample}
              className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Download Sample Format
            </Button>
            <Button 
              onClick={handleImport}
              className="bg-[#8B4A9C] hover:bg-[#7A4089] text-white"
            >
              Import
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
