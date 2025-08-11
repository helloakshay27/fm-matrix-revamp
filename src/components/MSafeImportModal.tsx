
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Upload, X, Download } from 'lucide-react';

interface MSafeImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (file: File) => void;
}

export const MSafeImportModal = ({ isOpen, onClose, onImport }: MSafeImportModalProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const handleSubmit = () => {
    if (selectedFile) {
      onImport(selectedFile);
      setSelectedFile(null);
      onClose();
    }
  };

  const handleDownloadSample = () => {
    const sampleData = [
      ['ID', 'User Name', 'Gender', 'Mobile Number', 'Email', 'Vendor Company Name', 'Entity Name', 'Unit', 'Role', 'Employee ID', 'Created By', 'Access Level', 'Type', 'Status', 'Active', 'Face Recognition', 'App Downloaded'],
      ['230826', 'John Doe', 'Male', '9876543210', 'john.doe@example.com', 'Sample Vendor', 'Sample Entity', 'Unit A', 'Engineer', 'EMP001', 'Site', 'Admin', 'Admin', 'Approved', 'Yes', 'No', 'No'],
      ['230827', 'Jane Smith', 'Female', '9876543211', 'jane.smith@example.com', 'Sample Vendor', 'Sample Entity', 'Unit B', 'Manager', 'EMP002', 'Company', 'Admin', 'Admin', 'Approved', 'Yes', 'No', 'No']
    ];
    
    const csvContent = sampleData.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'm_safe_users_sample_format.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle className="text-lg font-semibold">Import M Safe Users</DialogTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="p-1"
          >
            <X className="w-4 h-4 text-red-500" />
          </Button>
        </DialogHeader>
        
        <div className="space-y-6">
          <div 
            className="border-2 border-dashed border-purple-700 rounded-lg p-8 text-center"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
          >
            <Upload className="w-8 h-8 mx-auto mb-2 text-purple-700" />
            <label htmlFor="file-upload" className="cursor-pointer">
              <span className="text-gray-600">Drag & Drop or </span>
              <span className="text-purple-700 underline">Choose File</span>
              <input
                id="file-upload"
                type="file"
                accept=".csv,.xlsx,.xls"
                onChange={handleFileSelect}
                className="hidden"
              />
            </label>
            {selectedFile && (
              <p className="mt-2 text-sm text-green-600">
                Selected: {selectedFile.name}
              </p>
            )}
          </div>

          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={handleDownloadSample}
              className="border-purple-700 text-purple-700 hover:bg-purple-50"
            >
              <Download className="w-4 h-4 mr-2" />
              Download Sample Format
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!selectedFile}
              className="bg-purple-700 hover:bg-purple-800 text-white"
            >
              <Upload className="w-4 h-4 mr-2" />
              Import
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
