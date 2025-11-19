import { DownloadIcon, Upload } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { X } from "lucide-react";
import React from 'react';
import sampleFormatFile from '@/assets/smt_template.xlsx';
import axios from 'axios';
import { toast } from 'sonner';

export const SMTImportModal = ({ isOpen, onClose, onImport }) => {
  const [selectedFile, setSelectedFile] = React.useState(null);
  const [isUploading, setIsUploading] = React.useState(false);
  
  const handleFileSelect = (event) => {
    const file = event.target.files?.[0];
    if (file) setSelectedFile(file);
  };
  const handleDrop = (event) => {
    event.preventDefault();
    const file = event.dataTransfer.files?.[0];
    if (file) setSelectedFile(file);
  };
  const handleDragOver = (event) => event.preventDefault();
  
  const handleSubmit = async () => {
    if (!selectedFile) return;
    
    setIsUploading(true);
    try {
      const token = localStorage.getItem('token');
      const baseUrl = localStorage.getItem('baseUrl') || 'fm-uat-api.lockated.com';
      const cleanBaseUrl = baseUrl.startsWith('http') ? baseUrl : `https://${baseUrl}`;
      
      const formData = new FormData();
      formData.append('file', selectedFile);
      
      console.log('Uploading SMT file:', selectedFile.name);
      console.log('API URL:', `${cleanBaseUrl}/smts/bulk_upload.json`);
      
      const response = await axios.post(
        `${cleanBaseUrl}/smts/bulk_upload.json`,
        formData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      
      console.log('Upload response:', response.data);
      toast.success('SMT data imported successfully!');
      
      if (onImport) {
        onImport(selectedFile);
      }
      
      setSelectedFile(null);
      onClose();
    } catch (error) {
      console.error('Upload error:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to import SMT data';
      toast.error(errorMessage);
    } finally {
      setIsUploading(false);
    }
  };
  const handleDownloadSample = async () => {
    console.log('Downloading SMT sample format...');
    console.log('File path:', sampleFormatFile);
    
    try {
      // Fetch the file from assets
      const response = await fetch(sampleFormatFile);
      
      if (!response.ok) {
        throw new Error('Failed to fetch sample file');
      }
      
      // Convert to blob
      const blob = await response.blob();
      console.log('Blob created:', blob.size, 'bytes');
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'smt_sample_format.xlsx';
      document.body.appendChild(link);
      link.click();
      
      // Cleanup
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      console.log('✅ SMT sample format downloaded successfully');
    } catch (error) {
      console.error('❌ Error downloading sample file:', error);
      alert('Failed to download sample file. Please try again.');
    }
  };
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle className="text-lg font-semibold">Import SMT Data</DialogTitle>
          <Button variant="ghost" size="sm" onClick={onClose} className="p-1">
            <X className="w-4 h-4 text-red-500" />
          </Button>
        </DialogHeader>
        <div className="space-y-6">
          <div 
            className="border-2 border-dashed border-red-700 rounded-lg p-8 text-center"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
          >
            <Upload className="w-8 h-8 mx-auto mb-2 text-red-700" />
            <label htmlFor="smt-file-upload" className="cursor-pointer">
              <span className="text-gray-600">Drag & Drop or </span>
              <span className="text-red-700 underline">Choose File</span>
              <input
                id="smt-file-upload"
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
              className="border-red-700 text-red-500 hover:bg-purple-50"
            >
              <DownloadIcon className="w-4 h-4 mr-2" />
              Download Sample Format
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!selectedFile || isUploading}
              className="bg-red-700 hover:bg-red-800 text-white"
            >
              <Upload className="w-4 h-4 mr-2" />
              {isUploading ? 'Uploading...' : 'Import'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
