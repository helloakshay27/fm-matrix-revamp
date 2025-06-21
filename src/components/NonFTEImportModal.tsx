
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

interface NonFTEImportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NonFTEImportModal = ({ isOpen, onClose }: NonFTEImportModalProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    setSelectedFile(file || null);
  };

  const handleDownloadSampleFormat = () => {
    // Create a sample CSV content for Non-FTE users
    const sampleData = [
      ['User Name', 'Gender', 'Mobile Number', 'Email', 'Department', 'Circle', 'Cluster', 'Role', 'Line Manager Name', 'Line Manager Mobile Number'],
      ['John Doe', 'Male', '9876543210', 'john.doe@example.com', 'Engineering', 'North Circle', 'Cluster A', 'Engineer', 'Jane Smith', '9876543211']
    ];
    
    const csvContent = sampleData.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'non_fte_users_sample_format.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleImport = () => {
    if (selectedFile) {
      console.log('Importing file:', selectedFile.name);
      alert('Import completed successfully!');
      onClose();
    } else {
      alert('Please select a file first');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-white">
        <DialogHeader className="flex flex-row items-center justify-between border-b pb-4">
          <DialogTitle className="text-lg font-semibold">IMPORT DATA</DialogTitle>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-6 w-6 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>
        
        <div className="p-6 space-y-6">
          <div className="border-2 border-dashed border-orange-300 rounded-lg p-8 text-center">
            <input
              type="file"
              accept=".csv,.xlsx,.xls"
              onChange={handleFileChange}
              className="hidden"
              id="file-upload"
            />
            <label
              htmlFor="file-upload"
              className="cursor-pointer text-gray-600 hover:text-gray-800"
            >
              <div className="text-sm">
                {selectedFile ? (
                  <span className="text-green-600">Selected: {selectedFile.name}</span>
                ) : (
                  <>
                    <span className="text-orange-500">Choose File</span> No file chosen
                  </>
                )}
              </div>
            </label>
          </div>
          
          <div className="flex gap-3 justify-end">
            <Button
              onClick={handleDownloadSampleFormat}
              className="text-white"
              style={{ backgroundColor: '#C72030' }}
            >
              Download Sample Format
            </Button>
            <Button
              onClick={handleImport}
              disabled={!selectedFile}
              className="text-white disabled:bg-gray-300"
              style={{ backgroundColor: selectedFile ? '#C72030' : undefined }}
            >
              Import
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
