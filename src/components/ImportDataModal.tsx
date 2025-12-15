import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

interface ImportDataModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ImportDataModal = ({
  isOpen,
  onClose
}: ImportDataModalProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    setSelectedFile(file || null);
  };

  const handleDownloadSampleFormat = () => {
    // Create a sample CSV content
    const sampleData = [
      ['First Name', 'Last Name', 'Mobile Number', 'Email Address', 'Gender', 'Entity', 'Supplier', 'Employee ID', 'Base Site', 'Base Unit', 'Department', 'Email Preference', 'Designation', 'User Type', 'Role', 'Access Level'],
      ['John', 'Doe', '9876543210', 'john.doe@example.com', 'Male', 'Sample Entity', 'Sample Supplier', 'EMP001', 'Site A', 'Unit 1', 'IT', 'Email', 'Developer', 'Admin', 'Admin', 'Site']
    ];

    const csvContent = sampleData.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'fm_users_sample_format.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleImport = () => {
    if (selectedFile) {
      console.log('Importing file:', selectedFile.name);
      // Handle the import logic here
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-white">
        <DialogHeader className="flex flex-row items-center justify-between border-b pb-4">
          <DialogTitle className="text-lg font-semibold">IMPORT DATA</DialogTitle>
          <Button variant="ghost" size="icon" onClick={onClose} className="h-6 w-6 p-0">
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>
        
        <div className="p-6 space-y-6">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            <input
              type="file"
              accept=".csv,.xlsx,.xls"
              onChange={handleFileChange}
              className="hidden"
              id="file-upload"
            />
            <label htmlFor="file-upload" className="cursor-pointer text-gray-600 hover:text-gray-800">
              <div className="text-sm">
                {selectedFile ? (
                  <span className="text-green-600">Selected: {selectedFile.name}</span>
                ) : (
                  <>
                    <span className="text-red-700">Choose File</span> No file chosen
                  </>
                )}
              </div>
            </label>
          </div>
          
          <div className="flex gap-3 justify-end">
            <Button
              onClick={handleDownloadSampleFormat}
              className="bg-blue-500 hover:bg-blue-600 text-white"
            >
              Download Sample Format
            </Button>
            <Button
              onClick={handleImport}
              disabled={!selectedFile}
              className="bg-green-500 hover:bg-green-600 text-white disabled:bg-gray-300"
            >
              Import
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};