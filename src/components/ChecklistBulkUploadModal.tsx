
import React, { useState, useRef } from 'react';
import { X, Upload } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface ChecklistBulkUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ChecklistBulkUploadModal = ({ isOpen, onClose }: ChecklistBulkUploadModalProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    setSelectedFile(file);
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragOver(false);
    const files = event.dataTransfer.files;
    if (files.length > 0) {
      setSelectedFile(files[0]);
    }
  };

  const handleChooseFile = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = () => {
    if (selectedFile) {
      console.log('Checklist bulk upload file:', selectedFile.name);
      // Handle file upload logic here
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-[#1a1a1a]">
            ADD Sub Group
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
          {/* File Upload Area */}
          <div 
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
              isDragOver ? 'border-orange-400 bg-orange-50' : 'border-orange-300'
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={handleChooseFile}
          >
            <div className="space-y-2">
              <p className="text-sm text-gray-600">
                Drag & Drop or{' '}
                <span className="text-orange-500 font-medium cursor-pointer">
                  Choose File
                </span>
              </p>
              {selectedFile ? (
                <p className="text-sm text-gray-800 font-medium">{selectedFile.name}</p>
              ) : (
                <p className="text-xs text-gray-400">No file chosen</p>
              )}
            </div>
            
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv,.xlsx,.xls"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>

          {/* Submit button */}
          <div className="flex justify-end">
            <Button
              onClick={handleSubmit}
              disabled={!selectedFile}
              className="bg-purple-700 hover:bg-purple-800 text-white px-6 py-2 rounded-lg"
            >
              Submit
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
