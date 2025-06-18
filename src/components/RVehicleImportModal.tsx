
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { X, Download } from 'lucide-react';

interface RVehicleImportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RVehicleImportModal = ({ isOpen, onClose }: RVehicleImportModalProps) => {
  const handleDownloadSample = () => {
    console.log('Downloading sample format...');
    // Mock sample download
    alert('Sample format downloaded successfully!');
  };

  const handleImport = () => {
    console.log('Importing file...');
    // Mock import functionality
    alert('File imported successfully!');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md [&>button]:hidden">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-lg font-semibold">Bulk Upload</DialogTitle>
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
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Upload
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <button className="text-orange-500 hover:text-orange-600">
                Choose File
              </button>
              <span className="text-gray-500 ml-2">No file chosen</span>
            </div>
          </div>
          
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
              style={{ backgroundColor: '#C72030' }}
              className="hover:bg-[#C72030]/90 text-white"
            >
              Import
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
