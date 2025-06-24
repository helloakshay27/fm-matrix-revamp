
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface BulkUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
}

export const BulkUploadModal: React.FC<BulkUploadModalProps> = ({ 
  isOpen, 
  onClose, 
  title 
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleDownloadSample = () => {
    // Create a simple CSV content for WBS sample
    const csvContent = `Plant Code,Category,Category WBS Code,WBS Name,WBS Code,Site
PLANT001,Category1,WBS001,Sample WBS Name,WBS001,Site1
PLANT002,Category2,WBS002,Sample WBS Name 2,WBS002,Site2`;
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'wbs_sample_format.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImport = () => {
    if (selectedFile) {
      console.log('Importing file:', selectedFile.name);
      // Add your import logic here
      onClose();
      setSelectedFile(null);
    }
  };

  const handleClose = () => {
    setSelectedFile(null);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader className="flex flex-row items-center justify-between pb-4">
          <DialogTitle className="text-lg font-semibold">{title}</DialogTitle>
          <Button 
            variant="ghost" 
            size="icon"
            onClick={handleClose}
            className="h-6 w-6 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>

        <div className="space-y-6">
          {/* File Upload Section */}
          <div className="space-y-3">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <input
                type="file"
                accept=".csv,.xlsx,.xls"
                onChange={handleFileSelect}
                className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200"
              />
              {selectedFile && (
                <p className="mt-2 text-sm text-gray-600">
                  Selected: {selectedFile.name}
                </p>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-center gap-3">
            <Button 
              onClick={handleDownloadSample}
              variant="outline"
              className="px-6"
            >
              Download Sample Format
            </Button>
            <Button 
              onClick={handleImport}
              disabled={!selectedFile}
              style={{ backgroundColor: '#C72030' }}
              className="text-white hover:opacity-90 px-6 disabled:opacity-50"
            >
              Import
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
