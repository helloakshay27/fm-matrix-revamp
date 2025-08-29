import React, { useState } from 'react';
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { API_CONFIG } from "@/config/apiConfig";
import { apiClient } from '@/utils/apiClient';
import { toast } from "sonner";

interface SlotConfigBulkUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SlotConfigBulkUploadModal = ({ isOpen, onClose }: SlotConfigBulkUploadModalProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleClose = () => {
    setSelectedFile(null);
    setIsUploading(false);
    onClose();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleDownloadSample = async () => {
    console.log('Attempting to download parking configuration sample format...');
    console.log('API Config:', {
      BASE_URL: API_CONFIG.BASE_URL,
      TOKEN: API_CONFIG.TOKEN ? 'Present' : 'Missing',
      ENDPOINT: API_CONFIG.ENDPOINTS.PARKING_CONFIG_SAMPLE_FORMAT
    });

    try {
      const response = await apiClient.get(API_CONFIG.ENDPOINTS.PARKING_CONFIG_SAMPLE_FORMAT, {
        responseType: "blob",
      });

      console.log('Download response received:', response);

      const blob = response.data;
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'parking_configuration_sample.xlsx';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      console.log('Parking configuration sample format downloaded successfully');
      toast.success('Sample format downloaded successfully', {
        position: 'top-right',
        duration: 4000,
        style: {
          background: '#10b981',
          color: 'white',
          border: 'none',
        },
      });
    } catch (error) {
      console.error('Download failed:', error);
      console.error('Error details:', {
        message: error.message,
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data
      });
      
      toast.error('Failed to download sample format. Please try again.', {
        position: 'top-right',
        duration: 4000,
        style: {
          background: '#ef4444',
          color: 'white',
          border: 'none',
        },
      });
    }
  };

  const handleImport = async () => {
    if (!selectedFile) {
      toast.error('Please select a file first', {
        position: 'top-right',
        duration: 4000,
        style: {
          background: '#ef4444',
          color: 'white',
          border: 'none',
        },
      });
      return;
    }
    
    console.log('Starting parking configuration import...', selectedFile.name);
    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);
      
      // Add site_id and user_id as required by Rails controller
      const siteId = localStorage.getItem('selectedSiteId');
      const userId = localStorage.getItem('userId');
      
      if (siteId) {
        formData.append('site_id', siteId);
      }
      if (userId) {
        formData.append('user_id', userId);
      }

      console.log('Calling import API:', API_CONFIG.ENDPOINTS.PARKING_CONFIG_IMPORT);
      console.log('Parameters:', { siteId, userId, fileName: selectedFile.name });

      const response = await apiClient.post(API_CONFIG.ENDPOINTS.PARKING_CONFIG_IMPORT, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('Import response:', response.data);

      toast.success('Parking configuration imported successfully!', {
        position: 'top-right',
        duration: 4000,
        style: {
          background: '#10b981',
          color: 'white',
          border: 'none',
        },
      });

      // Reset form and close modal
      setSelectedFile(null);
      handleClose();

    } catch (error) {
      console.error('Import failed:', error);
      console.error('Error details:', {
        message: error.message,
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data
      });

      const errorMessage = error.response?.data?.message || error.message || 'Failed to import parking configuration. Please try again.';
      
      toast.error(errorMessage, {
        position: 'top-right',
        duration: 6000,
        style: {
          background: '#ef4444',
          color: 'white',
          border: 'none',
        },
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Slot Configuration Import</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="text-center">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8">
              <input
                type="file"
                onChange={handleFileChange}
                className="hidden"
                id="slot-file-upload"
                accept=".csv,.xlsx,.xls"
              />
              <label 
                htmlFor="slot-file-upload" 
                className="text-orange-500 hover:text-orange-600 cursor-pointer"
              >
                Choose File
              </label>
              <span className="ml-2 text-gray-500">
                {selectedFile ? selectedFile.name : 'No file chosen'}
              </span>
            </div>
          </div>

          <div className="flex justify-between">
            <Button 
              style={{ backgroundColor: '#C72030' }}
              className="hover:bg-[#C72030]/90 text-white px-6"
              onClick={handleDownloadSample}
              disabled={isUploading}
            >
              Download Sample Format
            </Button>
            <Button 
              style={{ backgroundColor: '#C72030' }}
              className="hover:bg-[#C72030]/90 text-white px-6"
              onClick={handleImport}
              disabled={isUploading}
            >
              {isUploading ? 'Importing...' : 'Import'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
