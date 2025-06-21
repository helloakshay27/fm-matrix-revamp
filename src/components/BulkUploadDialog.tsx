
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { toast } from "sonner";

interface BulkUploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  downloadText: string;
  importText: string;
}

export const BulkUploadDialog = ({ 
  open, 
  onOpenChange, 
  title, 
  downloadText, 
  importText 
}: BulkUploadDialogProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      console.log('File selected:', file.name);
    }
  };

  const handleDownloadSample = () => {
    console.log('Downloading sample format...');
    toast.success('Sample format downloaded successfully!');
  };

  const handleImport = () => {
    if (!selectedFile) {
      toast.error('Please select a file to import');
      return;
    }

    console.log('Importing file:', selectedFile.name);
    toast.success('File imported successfully!');
    
    // Reset form
    setSelectedFile(null);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle className="text-lg font-semibold">{title}</DialogTitle>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onOpenChange(false)}
            className="h-6 w-6"
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>

        <div className="space-y-6 pt-4">
          <div>
            <input
              type="file"
              id="fileInput"
              accept=".xlsx,.xls,.csv"
              onChange={handleFileChange}
              className="hidden"
            />
            <label 
              htmlFor="fileInput" 
              className="block w-full p-3 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-50 text-center"
            >
              <span className="text-blue-600">Choose File</span>
              <span className="ml-2 text-gray-500">
                {selectedFile ? selectedFile.name : 'No file chosen'}
              </span>
            </label>
          </div>

          <div className="flex justify-center gap-3">
            <Button 
              variant="outline"
              onClick={handleDownloadSample}
              className="border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              {downloadText}
            </Button>
            <Button 
              onClick={handleImport}
              className="bg-[#C72030] hover:bg-[#A01020] text-white"
            >
              {importText}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
