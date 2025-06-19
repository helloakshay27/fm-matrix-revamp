
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X } from "lucide-react";

interface WasteGenerationBulkDialogProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'import' | 'update';
}

export const WasteGenerationBulkDialog = ({ isOpen, onClose, type }: WasteGenerationBulkDialogProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleAction = () => {
    if (!selectedFile) {
      alert('Please select a file first');
      return;
    }
    
    console.log(`${type === 'import' ? 'Importing' : 'Updating'} file:`, selectedFile.name);
    onClose();
  };

  const handleDownloadSample = () => {
    console.log('Downloading sample format');
    // Create a sample CSV content
    const csvContent = "Location,Vendor,Commodity/Source,Category,Operational Name,UoM,Generated Unit,Recycled Unit,Agency Name,Waste Date\n" +
                      "Building A - Floor 1,EcoWaste Solutions,Paper,Recyclable,ABC Corp,KG,150,120,Green Agency,2024-01-15\n";
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'waste_generation_sample.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>Bulk {type === 'import' ? 'Upload' : 'Update'}</DialogTitle>
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
        
        <div className="space-y-6">
          <div className="space-y-4">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <Input
                type="file"
                accept=".csv,.xlsx,.xls"
                onChange={handleFileChange}
                className="hidden"
                id="file-upload"
              />
              <label htmlFor="file-upload" className="cursor-pointer">
                <div className="text-red-600 font-medium">Choose File</div>
                <div className="text-gray-500 text-sm mt-1">
                  {selectedFile ? selectedFile.name : 'No file chosen'}
                </div>
              </label>
            </div>

            <div className="flex justify-center">
              <Button
                onClick={handleAction}
                style={{ backgroundColor: '#C72030' }}
                className="text-white hover:bg-[#A01B26] px-8"
              >
                {type === 'import' ? 'Import' : 'Update'}
              </Button>
            </div>

            <div className="flex justify-center">
              <Button
                onClick={handleDownloadSample}
                variant="outline"
                className="px-6"
              >
                Download Sample Format
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
