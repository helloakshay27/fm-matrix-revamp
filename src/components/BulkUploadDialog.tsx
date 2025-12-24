
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X, Upload } from 'lucide-react';
import { toast } from "sonner";
import { apiClient } from '@/utils/apiClient';
import { ENDPOINTS } from '@/config/apiConfig';

interface BulkUploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  uploadType?: "upload" | "update";
  context?: "assets" | "custom_forms" | "measurements"; // New prop to determine context
  onImport?: (file: File) => void;
}

export const BulkUploadDialog: React.FC<BulkUploadDialogProps> = ({
  open,
  onOpenChange,
  title,
  uploadType = "upload",
  context = "assets", // Default to assets for backward compatibility
  onImport
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
 const waitForAssetImportDone = async (importKey: string) => {
  while (true) {
    const res = await apiClient.get("/pms/assets/import_status", {
      params: { import_key: importKey },
    });

    const data = res.data;

    if (data.status === "completed") return data;
    if (data.status === "failed") {
      throw new Error(data.error_message || "Import failed");
    }

    // processing / unknown → wait
    await new Promise((r) => setTimeout(r, 2000));
  }
};



  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      const allowedTypes = ['.csv', '.xlsx', '.xls'];
      const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();

      if (!allowedTypes.includes(fileExtension)) {
        toast.error('Please select a valid file format (CSV, Excel)', {
          position: 'top-right',
          duration: 4000,
          style: {
            background: '#f59e0b',
            color: 'white',
            border: 'none',
          },
        });
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
        toast.error('Please select a valid file format (CSV, Excel)', {
          position: 'top-right',
          duration: 4000,
          style: {
            background: '#f59e0b',
            color: 'white',
            border: 'none',
          },
        });
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

  const handleDownloadSample = async () => {
    console.log('Downloading sample format...');

    try {
      // Determine the endpoint based on context
      let endpoint: string;
      let filename: string;

      if (context === "custom_forms") {
        endpoint = ENDPOINTS.CHECKLIST_SAMPLE_FORMAT;
        filename = 'checklist_sample_format.xlsx';
      } else if (context === "measurements") {
        endpoint = ENDPOINTS.ASSET_MEASUREMENT_SAMPLE;
        filename = 'measurement_sample_format.xlsx';
      } else {
        endpoint = '/assets/asset.xlsx';
        filename = 'asset_sample_format.xlsx';
      }

      // Call the API to download the sample file
      const response = await apiClient.get(endpoint, {
        responseType: 'blob'
      });

      // Create blob URL and trigger download
      const blob = response.data;
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

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
      console.error('Error downloading sample file:', error);
      toast.error('Failed to download sample file. Please try again.', {
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
    toast.error("Please select a file to import");
    return;
  }

  setIsUploading(true);

  try {
    // ===============================
    // 🔹 ASSETS → BACKGROUND IMPORT
    // ===============================
    if (context === "assets") {
      const formData = new FormData();
      formData.append("pms_asset_file", selectedFile);

      // STEP 1: Start background import
      const response = await apiClient.post(
        "/pms/assets/asset_import",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      const { import_key } = response.data;

      if (!import_key) {
        throw new Error("Import key not returned from server");
      }

      toast.info("Import started", {
        description: "Assets are being imported in background…",
      });

      // STEP 2: Poll until finished
      const result = await waitForAssetImportDone(import_key);

      toast.success("Import completed", {
        description: `${result.success_count || 0} assets imported, ${result.error_count || 0} errors`,
      });

      setSelectedFile(null);
      onOpenChange(false);
      return; // ⛔ IMPORTANT: stop here
    }

    // ==================================
    // 🔹 CUSTOM FORMS / MEASUREMENTS
    // (UNCHANGED – DIRECT UPLOAD)
    // ==================================
    let endpoint = "";
    const formData = new FormData();

    if (context === "custom_forms") {
      endpoint = ENDPOINTS.CUSTOM_FORMS_BULK_UPLOAD;
      formData.append("custom_form_file", selectedFile);
    } else if (context === "measurements") {
      endpoint = ENDPOINTS.ASSET_MEASUREMENT_IMPORT;
      formData.append("measurement_file", selectedFile);
    }

    await apiClient.post(endpoint, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    toast.success("Import completed successfully");
    setSelectedFile(null);
    onOpenChange(false);

  } catch (error: any) {
    toast.error(error?.message || "Import failed");
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
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${dragOver
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
