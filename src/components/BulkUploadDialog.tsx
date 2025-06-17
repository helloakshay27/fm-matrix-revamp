
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
import { X } from 'lucide-react';

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
    console.log('Importing file:', selectedFile);
    onClose();
  };

  const handleDownloadSample = () => {
    console.log('Downloading sample format');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle>Bulk Upload</DialogTitle>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-6 w-6"
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
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

          <div>
            <Input
              type="file"
              onChange={handleFileSelect}
              accept=".xlsx,.xls,.csv"
              className="mb-2"
            />
            {selectedFile && (
              <p className="text-sm text-gray-600">Selected: {selectedFile.name}</p>
            )}
            {!selectedFile && (
              <p className="text-sm text-gray-500">No file chosen</p>
            )}
          </div>

          <div className="flex flex-col gap-3">
            <Button 
              onClick={handleImport}
              disabled={!selectedFile}
              className="bg-[#8B4B8C] hover:bg-[#8B4B8C]/90 text-white"
            >
              Import
            </Button>
            <Button 
              variant="outline"
              onClick={handleDownloadSample}
            >
              Download Sample Format
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
