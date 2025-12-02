import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { X, Upload } from 'lucide-react';
import axios from 'axios';
import { toast } from 'sonner';

interface ImportOccupantUsersProps {
  isOpen: boolean;
  onClose: () => void;
  onRefresh?: () => void;
}

export const ImportOccupantUsers = ({
  isOpen,
  onClose,
  onRefresh
}: ImportOccupantUsersProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isImporting, setIsImporting] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragOver(false);
    const file = event.dataTransfer.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const handleDownloadSampleFormat = async () => {
    try {
      const baseUrl = localStorage.getItem("baseUrl");
      const token = localStorage.getItem("token");

      const response = await axios.get(
        `https://${baseUrl}/assets/sample_occupant.xlsx`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          responseType: "blob",
        }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "sample_occupant.xlsx");
      document.body.appendChild(link);
      link.click();
      link.remove();

      toast.success("Sample file downloaded successfully");
    } catch (error) {
      console.error("Download error:", error);
      toast.error("Failed to download sample file");
    }
  };

  const handleImport = async () => {
    if (!selectedFile) {
      toast.error("Please select a file to upload");
      return;
    }

    try {
      setIsImporting(true);
      const baseUrl = localStorage.getItem("baseUrl");
      const token = localStorage.getItem("token");

      const formData = new FormData();
      formData.append("user[pms_occupant_file]", selectedFile);
      formData.append("permissions_hash[pms_complaints][all]", "true");
      formData.append("permissions_hash[pms_notices][all]", "true");

      await axios.post(
        `https://${baseUrl}/pms/occupant_import.json`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      toast.success("Occupant users imported successfully");
      setSelectedFile(null);
      onClose();
      
      // Refresh the data if callback provided
      if (onRefresh) {
        onRefresh();
      }
    } catch (error: any) {
      console.error("Import error:", error);
      toast.error(error?.response?.data?.message || "Failed to import occupant users");
    } finally {
      setIsImporting(false);
    }
  };

  const resetModal = () => {
    if (!isImporting) {
      setSelectedFile(null);
      setDragOver(false);
      setIsImporting(false);
      onClose();
    }
  };

  const handleClose = () => {
    if (!isImporting) {
      resetModal();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md [&>button]:hidden">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-lg font-semibold">Bulk Upload</DialogTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClose}
              className="h-6 w-6 p-0"
              disabled={isImporting}
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
                      onChange={handleFileChange}
                      disabled={isImporting}
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
              onClick={handleDownloadSampleFormat}
              variant="outline"
              className="flex-1 border-[#C72030] text-[#C72030] hover:bg-[#C72030]/10"
              disabled={isImporting}
            >
              Download Sample Format
            </Button>
            <Button
              onClick={handleImport}
              style={{ backgroundColor: '#C72030' }}
              className="text-white hover:bg-[#C72030]/90 flex-1"
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
