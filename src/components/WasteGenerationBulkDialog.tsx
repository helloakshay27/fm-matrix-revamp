
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getFullUrl, getAuthHeader } from '@/config/apiConfig';
import { toast } from 'sonner';

interface WasteGenerationBulkDialogProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'import' | 'update';
}

export const WasteGenerationBulkDialog = ({ isOpen, onClose, type }: WasteGenerationBulkDialogProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleAction = async () => {
    if (!selectedFile) {
      toast.error('Please select a file first');
      return;
    }
    
    if (type === 'import') {
      await handleImport();
    } else {
      // Handle update functionality if needed
      console.log('Update functionality not implemented yet');
      toast.info('Update functionality coming soon');
    }
  };

  const handleImport = async () => {
    if (!selectedFile) return;
    
    try {
      setIsUploading(true);
      console.log('Importing waste generation file:', selectedFile.name);
      
      // Create FormData with the required field name
      const formData = new FormData();
      formData.append('pms_waste_generation_file', selectedFile);
      
      const importUrl = getFullUrl('/pms/waste_generations/waste_generation_import.json');
      
      const response = await fetch(importUrl, {
        method: 'POST',
        headers: {
          'Authorization': getAuthHeader(),
          // Don't set Content-Type header - let browser set it with boundary for FormData
        },
        body: formData,
      });

      if (!response.ok) {
        let errorMessage = `Import failed: ${response.status} ${response.statusText}`;
        try {
          const errorData = await response.json();
          console.error('API Error Response:', errorData);
          if (errorData.error) {
            errorMessage = errorData.error;
          } else if (errorData.message) {
            errorMessage = errorData.message;
          } else if (errorData.errors) {
            errorMessage = Array.isArray(errorData.errors) 
              ? errorData.errors.join(', ') 
              : JSON.stringify(errorData.errors);
          }
        } catch (parseError) {
          // If JSON parsing fails, try to get text
          try {
            const errorText = await response.text();
            console.error('API Error Text:', errorText);
            if (errorText) errorMessage += ` - ${errorText}`;
          } catch (textError) {
            console.error('Could not parse error response:', textError);
          }
        }
        throw new Error(errorMessage);
      }

      // Check if response is JSON or binary data
      const contentType = response.headers.get('content-type');
      
      if (contentType && contentType.includes('application/json')) {
        const result = await response.json();
        console.log('Import successful:', result);
        toast.success('Waste generation data imported successfully!');
      } else {
        // Response is likely a file (Excel/binary), which means import was successful
        console.log('Import successful - received file response');
        toast.success('Waste generation data imported successfully!');
        
        // If it's a downloadable file, handle the download
        if (contentType && (contentType.includes('application/vnd.openxmlformats') || contentType.includes('application/vnd.ms-excel'))) {
          const blob = await response.blob();
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = 'import-result.xlsx';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          window.URL.revokeObjectURL(url);
        }
      }
      
      setSelectedFile(null);
      onClose();
      
    } catch (error) {
      console.error('Import error:', error);
      toast.error(`Failed to import waste generation data: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDownloadSample = async () => {
    try {
      console.log('Downloading waste generation sample format');
      
      const sampleUrl = getFullUrl('/assets/Waste Bulk.xlsx');
      
      const response = await fetch(sampleUrl, {
        method: 'GET',
        headers: {
          'Authorization': getAuthHeader(),
        },
      });

      if (!response.ok) {
        throw new Error(`Download failed: ${response.statusText}`);
      }

      // Get the blob data
      const blob = await response.blob();
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'Waste.xlsx';
      
      // Trigger download
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      toast.success('Sample format downloaded successfully!');
      
    } catch (error) {
      console.error('Download error:', error);
      toast.error('Failed to download sample format. Please try again.');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Bulk {type === 'import' ? 'Upload' : 'Update'}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="space-y-4">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <Input
                type="file"
                accept=".csv,.xlsx,.xls"
                onChange={handleFileChange}
                className="hidden"
                id="file-upload"
              />
              <label htmlFor="file-upload" className="cursor-pointer">
                <div className="text-red-600 font-medium">Choose File</div>
                <div className="text-gray-500 text-sm mt-1">
                  {selectedFile ? selectedFile.name : 'No file chosen'}
                </div>
              </label>
            </div>

            <div className="flex justify-center">
              <Button
                onClick={handleAction}
                disabled={isUploading}
                style={{ backgroundColor: '#C72030' }}
                className="text-white hover:bg-[#A01B26] px-8 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isUploading ? 'Uploading...' : (type === 'import' ? 'Import' : 'Update')}
              </Button>
            </div>

            <div className="flex justify-center">
              <Button
                onClick={handleDownloadSample}
                variant="outline"
                className="px-6"
              >
                Download Sample Format
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
