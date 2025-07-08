
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X, Upload } from 'lucide-react';
import { toast } from "sonner";

interface BulkUploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  onImport?: (file: File) => void;
}

export const BulkUploadDialog: React.FC<BulkUploadDialogProps> = ({
  open,
  onOpenChange,
  title,
  onImport
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      const allowedTypes = ['.csv', '.xlsx', '.xls'];
      const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
      
      if (!allowedTypes.includes(fileExtension)) {
        toast.error('Please select a valid file format (CSV, Excel)');
        return;
      }
      
      setSelectedFile(file);
      console.log('File selected:', file.name);
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragOver(false);
    
    const file = event.dataTransfer.files[0];
    if (file) {
      // Validate file type
      const allowedTypes = ['.csv', '.xlsx', '.xls'];
      const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
      
      if (!allowedTypes.includes(fileExtension)) {
        toast.error('Please select a valid file format (CSV, Excel)');
        return;
      }
      
      setSelectedFile(file);
      console.log('File dropped:', file.name);
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
    
    // Create sample CSV for WBS
    const sampleData = [
      'Plant Code,Category,Category WBS Code,WBS Name,WBS Code,Site',
      'PLT001,Infrastructure,INF001,Building Maintenance,BM001,Site A',
      'PLT002,Equipment,EQP001,HVAC System,HVAC001,Site B',
      'PLT003,Utilities,UTL001,Power Distribution,PD001,Site C'
    ].join('\n');
    
    const blob = new Blob([sampleData], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'wbs_sample_format.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    
    toast.success('Sample format downloaded successfully');
  };

  const handleImport = async () => {
    if (!selectedFile) {
      toast.error('Please select a file to import');
      return;
    }

    setIsUploading(true);
    console.log('Starting import process for:', selectedFile.name);

    try {
      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      if (onImport) {
        onImport(selectedFile);
      }
      
      // Reset state
      setSelectedFile(null);
      onOpenChange(false);
      
    } catch (error) {
      console.error('Import failed:', error);
      toast.error('Import failed. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleClose = () => {
    if (!isUploading) {
      setSelectedFile(null);
      setDragOver(false);
      onOpenChange(false);
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
              onClick={handleClose}
              className="h-6 w-6 p-0"
              disabled={isUploading}
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
                : 'border-[#C72030] bg-[#ffff]'
            }`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
          >
            <div className="space-y-3">
              <Upload className="mx-auto h-8 w-8 text-gray-400" />
              <div>
                <p className="text-gray-600 mb-2">
                  Drag & Drop or{' '}
                  <label className="text-[#C72030] cursor-pointer hover:underline font-medium">
                    Choose File
                    <input
                      type="file"
                      className="hidden"
                      accept=".csv,.xlsx,.xls"
                      onChange={handleFileSelect}
                      disabled={isUploading}
                    />
                  </label>
                </p>
                <p className="text-sm text-gray-500">
                  Supports: CSV, Excel (.xlsx, .xls)
                </p>
              </div>
              {selectedFile && (
                <div className="mt-3 p-2 bg-white rounded border">
                  <p className="text-sm font-medium text-gray-700">
                    📄 {selectedFile.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {(selectedFile.size / 1024).toFixed(1)} KB
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button 
              onClick={handleDownloadSample}
              variant="outline"
              className="flex-1 border-[#C72030] text-[#C72030] hover:bg-[#C72030]/10"
              disabled={isUploading}
            >
              Download Sample Format
            </Button>
            <Button 
              onClick={handleImport}
              style={{ backgroundColor: '#C72030' }}
              className="text-white hover:bg-[#C72030]/90 flex-1"
              disabled={!selectedFile || isUploading}
            >
              {isUploading ? 'Importing...' : 'Import'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
