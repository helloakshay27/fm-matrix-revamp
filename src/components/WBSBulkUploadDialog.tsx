
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X } from 'lucide-react';

interface WBSBulkUploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const WBSBulkUploadDialog: React.FC<WBSBulkUploadDialogProps> = ({
  open,
  onOpenChange,
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
      'PLANT001,Equipment,EQ001,Generator Set,GEN001,Site A'
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
            <DialogTitle className="text-lg font-semibold">Bulk Upload</DialogTitle>
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
          <div className="text-center space-y-4">
            <div>
              <label className="text-blue-600 cursor-pointer hover:underline">
                Choose File
                <input
                  type="file"
                  className="hidden"
                  accept=".csv,.xlsx,.xls"
                  onChange={handleFileSelect}
                />
              </label>
              <span className="ml-2 text-gray-600">
                {selectedFile ? selectedFile.name : 'No file chosen'}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button 
              onClick={handleDownloadSample}
              variant="outline"
              className="flex-1 border-[#C72030] text-[#C72030] hover:bg-[#C72030] hover:text-white"
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
