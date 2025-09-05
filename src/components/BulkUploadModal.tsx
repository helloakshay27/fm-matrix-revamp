
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { API_CONFIG, getFullUrl, getAuthenticatedFetchOptions } from '@/config/apiConfig';
import { toast } from 'sonner';

interface BulkUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  onImport?: (file: File) => Promise<void>;
}

export const BulkUploadModal = ({ 
  isOpen, 
  onClose, 
  title = "Bulk Upload",
  description = "Upload a file to import data",
  onImport 
}: BulkUploadModalProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isImporting, setIsImporting] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleImport = async () => {
    if (!selectedFile) {
      toast.error('Please select a file to import');
      return;
    }

    try {
      setIsImporting(true);
      
      if (onImport) {
        // Use custom import function if provided
        await onImport(selectedFile);
      } else {
        // Default import to parking bookings API
        await importParkingBookings(selectedFile);
      }
      
      // Reset file selection and close modal
      setSelectedFile(null);
      onClose();
      
    } catch (error) {
      console.error('Import failed:', error);
      // Error handling is done in the import functions
    } finally {
      setIsImporting(false);
    }
  };

  const importParkingBookings = async (file: File) => {
    // Show loading toast
    toast.info('Importing parking bookings...');
    
    // Create FormData to send the file
    const formData = new FormData();
    formData.append('file', file);
    
    // Construct the API URL
    const url = getFullUrl('/pms/manage/parking_bookings/import.json');
    const options = getAuthenticatedFetchOptions();
    
    // Set up the request with FormData
    const requestOptions = {
      ...options,
      method: 'POST',
      body: formData,
      // Remove Content-Type header to let browser set it with boundary for FormData
      headers: {
        ...options.headers,
      }
    };
    
    // Remove Content-Type to let browser handle it for FormData
    delete requestOptions.headers['Content-Type'];
    
    console.log('🚀 Calling parking bookings import API:', url);
    
    const response = await fetch(url, requestOptions);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Import API Error Response:', errorText);
      throw new Error(`Failed to import parking bookings: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log('✅ Parking bookings imported successfully:', data);
    
    // Show success toast
    toast.success('Parking bookings imported successfully!');
  };

  const resetModal = () => {
    setSelectedFile(null);
    setIsImporting(false);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={resetModal}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && (
            <p className="text-sm text-gray-600 mt-2">{description}</p>
          )}
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="text-center">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8">
              <input
                type="file"
                onChange={handleFileChange}
                className="hidden"
                id="file-upload"
                accept=".csv,.xlsx,.xls"
                disabled={isImporting}
              />
              <label 
                htmlFor="file-upload" 
                className={`text-orange-500 hover:text-orange-600 cursor-pointer ${
                  isImporting ? 'opacity-50 cursor-not-allowed' : ''
                }`}
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
              disabled={isImporting}
            >
              Download Sample Format
            </Button>
            <Button 
              style={{ backgroundColor: '#C72030' }}
              className="hover:bg-[#C72030]/90 text-white px-6"
              onClick={handleImport}
              disabled={!selectedFile || isImporting}
            >
              {isImporting ? 'Importing...' : 'Import'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
