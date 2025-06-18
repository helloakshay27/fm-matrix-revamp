
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X } from "lucide-react";

interface SpaceManagementImportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const SpaceManagementImportDialog: React.FC<SpaceManagementImportDialogProps> = ({
  open,
  onOpenChange,
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleImport = () => {
    if (selectedFile) {
      console.log('Importing file:', selectedFile.name);
      // Handle file import logic here
      onOpenChange(false);
    } else {
      alert('Please choose a file first');
    }
  };

  const handleDownloadSample = () => {
    // Create and download sample file
    const sampleContent = "data:text/csv;charset=utf-8," + 
      "Employee ID,Employee Name,Employee Email,Schedule Date,Category,Building,Floor\n" +
      "73974,Sample Employee,sample@example.com,29 December 2023,Angular War,Jyoti Tower,2nd Floor";
    
    const encodedUri = encodeURI(sampleContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "booking_sample_format.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md [&>button]:hidden">
        <DialogHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <DialogTitle className="text-lg font-semibold">Upload</DialogTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onOpenChange(false)}
            className="h-6 w-6 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="text-center">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8">
              <Input
                type="file"
                onChange={handleFileChange}
                className="hidden"
                id="file-upload-space"
                accept=".csv,.xlsx,.xls"
              />
              <label 
                htmlFor="file-upload-space" 
                className="text-orange-500 hover:text-orange-600 cursor-pointer font-medium"
              >
                Choose File
              </label>
              <div className="mt-2 text-sm text-gray-600">
                {selectedFile ? selectedFile.name : 'No file chosen'}
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <Button 
              onClick={handleImport}
              style={{ backgroundColor: '#C72030', color: 'white' }}
              className="hover:opacity-90 border-0"
            >
              Import
            </Button>
            <Button 
              onClick={handleDownloadSample}
              variant="outline"
              className="border-gray-300"
            >
              Sample
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
