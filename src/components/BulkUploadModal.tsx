
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface BulkUploadModalProps {
  onClose: () => void;
}

export const BulkUploadModal = ({ onClose }: BulkUploadModalProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  return (
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
            className="text-orange-500 hover:text-orange-600 cursor-pointer"
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
          className="bg-[#8B5A5A] hover:bg-[#7A4949] text-white px-6"
        >
          Download Sample Format
        </Button>
        <Button 
          className="bg-[#8B5A5A] hover:bg-[#7A4949] text-white px-6"
          onClick={onClose}
        >
          Import
        </Button>
      </div>
    </div>
  );
};
