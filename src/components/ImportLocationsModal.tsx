
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface ImportLocationsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ImportLocationsModal = ({ isOpen, onClose }: ImportLocationsModalProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      console.log('Location file selected:', file.name);
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files?.[0];
    if (file) {
      setSelectedFile(file);
      console.log('Location file dropped:', file.name);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const handleImport = () => {
    if (!selectedFile) {
      alert('Please select a file first');
      return;
    }
    console.log('Importing locations file:', selectedFile);
    alert('Locations imported successfully!');
    onClose();
  };

  const handleDownloadSample = () => {
    console.log('Downloading locations sample format');
    const csvContent = "Site,Building,Wing,Area,Floor,Room\nTower 4,Wing2,South,Lobby,Ground Floor,Room 101\nSEBC,Main Building,North,Office,First Floor,Room 201";
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', 'locations_sample_format.csv');
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Bulk Upload</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* File upload area */}
          <div 
            className="border-2 border-dashed border-orange-300 rounded-lg p-12 text-center"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
          >
            <input
              type="file"
              onChange={handleFileChange}
              className="hidden"
              id="locations-file-upload"
              accept=".csv,.xlsx,.xls"
            />
            <div className="mb-4">
              <span className="text-gray-600">Drag & Drop or </span>
              <label 
                htmlFor="locations-file-upload" 
                className="text-orange-500 hover:text-orange-600 cursor-pointer underline"
              >
                Choose File
              </label>
            </div>
            <div className="text-sm text-gray-500">
              {selectedFile ? selectedFile.name : 'No file chosen'}
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex justify-between">
            <Button 
              variant="outline"
              onClick={handleDownloadSample}
              className="border-[#C72030] text-[#C72030] hover:bg-[#C72030]/10"
            >
              Download Sample Format
            </Button>
            <Button 
              onClick={handleImport}
              style={{ backgroundColor: '#C72030' }}
              className="text-white hover:bg-[#C72030]/90"
            >
              Import
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
