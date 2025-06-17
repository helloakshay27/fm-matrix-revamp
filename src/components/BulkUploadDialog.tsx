
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X } from 'lucide-react';

interface BulkUploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
}

export const BulkUploadDialog: React.FC<BulkUploadDialogProps> = ({
  open,
  onOpenChange,
  title,
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [dragOver, setDragOver] = useState(false);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragOver(false);
    const file = event.dataTransfer.files[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const handleDownloadSample = () => {
    console.log('Downloading sample format...');
    // Create sample CSV
    const sampleData = [
      'Name,ID,Reference Number,Code,Group,Sub Group,Criticality,Quantity,Active',
      'Sample Item,12345,REF001,CODE001,Electronics,Computers,Critical,10,Active'
    ].join('\n');
    
    const blob = new Blob([sampleData], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'inventory_sample_format.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleImport = () => {
    if (selectedFile) {
      console.log('Importing file:', selectedFile.name);
      alert(`Successfully imported ${selectedFile.name}`);
      setSelectedFile(null);
      onOpenChange(false);
    } else {
      alert('Please select a file to import');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-lg font-semibold">{title}</DialogTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onOpenChange(false)}
              className="h-6 w-6 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* File Upload Area */}
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              dragOver 
                ? 'border-[#C72030] bg-red-50' 
                : 'border-orange-300 bg-orange-50'
            }`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
          >
            <div className="space-y-2">
              <p className="text-gray-600">
                Drag & Drop or{' '}
                <label className="text-[#C72030] cursor-pointer hover:underline">
                  Choose File
                  <input
                    type="file"
                    className="hidden"
                    accept=".csv,.xlsx,.xls"
                    onChange={handleFileSelect}
                  />
                </label>
              </p>
              <p className="text-sm text-gray-500">
                {selectedFile ? selectedFile.name : 'No file chosen'}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button 
              onClick={handleDownloadSample}
              variant="outline"
              className="flex-1"
            >
              Download Sample Format
            </Button>
            <Button 
              onClick={handleImport}
              style={{ backgroundColor: '#C72030' }}
              className="text-white hover:bg-[#C72030]/90 flex-1"
            >
              Import
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
