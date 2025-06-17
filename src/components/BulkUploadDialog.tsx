
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

interface BulkUploadDialogProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'import' | 'update';
}

export const BulkUploadDialog: React.FC<BulkUploadDialogProps> = ({ isOpen, onClose, type }) => {
  const [uploadType, setUploadType] = useState(type === 'import' ? 'upload' : 'update');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleImport = () => {
    if (!selectedFile) {
      alert('Please select a file first.');
      return;
    }
    console.log('Importing file:', selectedFile);
    alert('File imported successfully!');
    onClose();
  };

  const handleDownloadSample = () => {
    // Create sample CSV content
    const sampleContent = "data:text/csv;charset=utf-8," + 
      "Asset Name,Asset Code,Asset No.,Equipment Id,Site,Building,Wing,Floor,Area,Room,Meter Type,Asset Type\n" +
      "Sample Asset,SAMPLE001,001,EQ001,Main Site,Building A,East Wing,Ground Floor,Utility Area,Room 101,Energy,Parent\n" +
      "Sample Asset 2,SAMPLE002,002,EQ002,Main Site,Building B,West Wing,First Floor,Office Area,Room 201,Water,Sub";
    
    const encodedUri = encodeURI(sampleContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "asset_sample_format.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    console.log('Downloading sample format');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Bulk Upload</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          {type === 'import' && (
            <RadioGroup value={uploadType} onValueChange={setUploadType}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="upload" id="upload" />
                <Label htmlFor="upload">Bulk Upload</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="update" id="update" />
                <Label htmlFor="update">Bulk Update</Label>
              </div>
            </RadioGroup>
          )}

          <div className="text-center">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8">
              <Input
                type="file"
                onChange={handleFileSelect}
                accept=".xlsx,.xls,.csv"
                className="hidden"
                id="file-upload"
              />
              <label 
                htmlFor="file-upload" 
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
              disabled={!selectedFile}
              style={{ backgroundColor: '#C72030' }}
              className="text-white hover:bg-[#C72030]/90 disabled:opacity-50"
            >
              Import
            </Button>
            <Button 
              variant="outline"
              onClick={handleDownloadSample}
              className="border-gray-300"
            >
              Download Sample Format
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
