
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Upload, X, Download } from 'lucide-react';

interface ImportReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (file: File) => void;
}

export const ImportReceiptModal = ({ isOpen, onClose, onImport }: ImportReceiptModalProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleSubmit = () => {
    if (selectedFile) {
      onImport(selectedFile);
      setSelectedFile(null);
      onClose();
    }
  };

  const handleDownloadSample = () => {
    // Create a sample CSV content
    const sampleData = 'Receipt Number,Invoice Number,Flat,Customer Name,Amount Received,Payment Mode\n1001,INV001,A-101,John Doe,5000,Cash\n1002,INV002,A-102,Jane Smith,7500,Bank Transfer';
    const blob = new Blob([sampleData], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'receipt_sample_format.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle className="text-lg font-semibold">Import Receipt</DialogTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="p-1"
          >
            <X className="w-4 h-4 text-red-500" />
          </Button>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
            <label htmlFor="file-upload" className="cursor-pointer">
              <span className="text-gray-600">Choose a file...</span>
              <input
                id="file-upload"
                type="file"
                accept=".csv,.xlsx,.xls"
                onChange={handleFileSelect}
                className="hidden"
              />
            </label>
            {selectedFile && (
              <p className="mt-2 text-sm text-green-600">
                Selected: {selectedFile.name}
              </p>
            )}
          </div>

          <Button
            variant="outline"
            onClick={handleDownloadSample}
            className="w-full flex items-center gap-2 text-blue-600 border-blue-600 hover:bg-blue-50"
          >
            <Download className="w-4 h-4" />
            Download Sample Format
          </Button>

          <Button
            onClick={handleSubmit}
            disabled={!selectedFile}
            className="w-full bg-green-600 hover:bg-green-700 text-white"
          >
            Submit
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
