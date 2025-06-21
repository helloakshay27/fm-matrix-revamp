
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X } from 'lucide-react';

interface BulkUploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  downloadText: string;
  importText: string;
}

export const BulkUploadDialog: React.FC<BulkUploadDialogProps> = ({
  open,
  onOpenChange,
  title,
  downloadText,
  importText,
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleDownloadSample = () => {
    console.log('Downloading sample format...');
    // Create sample CSV for WBS
    const sampleData = [
      'Plant Code,Category,Category WBS Code,WBS Name,WBS Code,Site',
      'PLANT001,Construction,WBS001,Building Foundation,WBS-FOUND-001,Site A',
      'PLANT002,Equipment,WBS002,HVAC System,WBS-HVAC-001,Site B'
    ].join('\n');
    
    const blob = new Blob([sampleData], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'wbs_sample_format.csv';
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
      <DialogContent className="sm:max-w-md [&>button]:hidden">
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
        
        <div className="space-y-6">
          {/* File Upload Area */}
          <div className="border border-gray-300 rounded-lg p-8 text-center">
            <div className="space-y-2">
              <label className="text-blue-600 cursor-pointer hover:underline">
                Choose File
                <input
                  type="file"
                  className="hidden"
                  accept=".csv,.xlsx,.xls"
                  onChange={handleFileSelect}
                />
              </label>
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
              {downloadText}
            </Button>
            <Button 
              onClick={handleImport}
              className="text-white flex-1"
              style={{ backgroundColor: '#C72030' }}
            >
              {importText}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
