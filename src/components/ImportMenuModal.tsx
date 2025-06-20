
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

interface ImportMenuModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ImportMenuModal = ({ isOpen, onClose }: ImportMenuModalProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleImport = () => {
    if (selectedFile) {
      console.log('Importing file:', selectedFile.name);
      // Handle file import logic here
      setSelectedFile(null);
      onClose();
    }
  };

  const handleDownloadSample = () => {
    console.log('Downloading sample format');
    // Create a simple CSV content for sample
    const csvContent = "SKU,Product Name,Master Price,Display Price,Category,Subcategory\nSKU001,Sample Product,100,120,Breakfast,Continental";
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'menu_sample_format.csv';
    link.click();
    URL.revokeObjectURL(url);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Menu</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="p-1"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        <div className="space-y-4">
          <div>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <input
                type="file"
                onChange={handleFileChange}
                accept=".csv,.xlsx,.xls"
                className="hidden"
                id="file-upload"
              />
              <label htmlFor="file-upload" className="cursor-pointer">
                <p className="text-gray-500 mb-2">Choose File</p>
                <p className="text-sm text-gray-400">
                  {selectedFile ? selectedFile.name : 'No file chosen'}
                </p>
              </label>
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              onClick={handleImport}
              disabled={!selectedFile}
              className="bg-[#8B5A3C] hover:bg-[#8B5A3C]/90 text-white"
            >
              Import
            </Button>
            <Button
              onClick={handleDownloadSample}
              variant="outline"
              className="border-[#C72030] text-[#C72030] hover:bg-[#C72030]/10"
            >
              Download Sample Format
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
