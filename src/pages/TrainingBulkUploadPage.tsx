import React, { useState, useRef, useCallback } from "react";
import {
  Upload,
  X,
  FileText,
  CheckCircle,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { getBaseUrl, getToken } from "@/utils/auth";

interface UploadStatus {
  status: "idle" | "uploading" | "success" | "error";
  message?: string;
}

const TrainingBulkUploadPage: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<UploadStatus>({
    status: "idle",
  });
  const inputRef = useRef<HTMLInputElement>(null);

  // Get token and baseUrl dynamically - first from URL params, then from auth utils
  const urlParams = new URLSearchParams(window.location.search);
  const token = urlParams.get("token") || getToken();
  const baseUrl = urlParams.get("baseUrl") || getBaseUrl();

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      validateAndSetFile(file);
    }
  }, []);

  const validateAndSetFile = (file: File) => {
    // Allow common file types for training uploads
    const allowedTypes = [
      ".csv",
      ".xlsx",
      ".xls",
      ".pdf",
      ".doc",
      ".docx",
      ".txt",
    ];
    const fileExtension = "." + file.name.split(".").pop()?.toLowerCase();

    if (!allowedTypes.includes(fileExtension)) {
      toast.error(
        `Invalid file type. Allowed types: ${allowedTypes.join(", ")}`
      );
      return;
    }

    // Check file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error("File size exceeds 10MB limit");
      return;
    }

    setSelectedFile(file);
    setUploadStatus({ status: "idle" });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error("Please select a file to upload");
      return;
    }

    if (!token) {
      toast.error("Authentication token is missing");
      return;
    }

    if (!baseUrl) {
      toast.error("Base URL is missing");
      return;
    }

    setUploadStatus({ status: "uploading" });

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);

      const response = await fetch(
        `${baseUrl}/trainings/bulk_upload.json?token=${token}`,
        {
          method: "POST",
          body: formData,
        }
      );

      // Check content type to determine response type
      const contentType = response.headers.get("content-type") || "";

      if (!response.ok) {
        // Try to parse error as JSON first
        if (contentType.includes("application/json")) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(
            errorData.message || `Upload failed with status ${response.status}`
          );
        }
        throw new Error(`Upload failed with status ${response.status}`);
      }

      // Handle file download response (Excel, CSV, etc.)
      if (
        contentType.includes("application/vnd.openxmlformats-officedocument") ||
        contentType.includes("application/vnd.ms-excel") ||
        contentType.includes("application/octet-stream") ||
        contentType.includes("text/csv")
      ) {
        const blob = await response.blob();
        const downloadUrl = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = downloadUrl;

        // Extract filename from content-disposition header or use default
        const contentDisposition = response.headers.get("content-disposition");
        let filename = "training_upload_result.xlsx";
        if (contentDisposition) {
          const filenameMatch = contentDisposition.match(
            /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/
          );
          if (filenameMatch && filenameMatch[1]) {
            filename = filenameMatch[1].replace(/['"]/g, "");
          }
        }

        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(downloadUrl);

        setUploadStatus({
          status: "success",
          message: "File processed! Result file downloaded.",
        });
        toast.success("File processed! Result file downloaded.");
        setSelectedFile(null);
        return;
      }

      // Handle JSON response
      const data = await response.json();

      setUploadStatus({
        status: "success",
        message: data.message || "File uploaded successfully!",
      });
      toast.success(data.message || "File uploaded successfully!");
      setSelectedFile(null);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Upload failed";
      setUploadStatus({
        status: "error",
        message: errorMessage,
      });
      toast.error(errorMessage);
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setUploadStatus({ status: "idle" });
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
            <Upload className="w-8 h-8 text-[#C72030]" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">
            Training Bulk Upload
          </h1>
          <p className="text-gray-500 mt-2">
            Upload your training data file to import records
          </p>
        </div>

        {/* Upload Area */}
        <div
          className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 ${
            dragActive
              ? "border-[#C72030] bg-red-50"
              : "border-gray-300 hover:border-[#C72030] hover:bg-gray-50"
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            ref={inputRef}
            type="file"
            className="hidden"
            onChange={handleFileChange}
            accept=".csv,.xlsx,.xls,.pdf,.doc,.docx,.txt"
          />

          {!selectedFile ? (
            <div className="space-y-4">
              <div className="flex justify-center">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                  <FileText className="w-6 h-6 text-gray-400" />
                </div>
              </div>
              <div>
                <p className="text-gray-600">
                  Drag & Drop your file here or{" "}
                  <button
                    type="button"
                    onClick={() => inputRef.current?.click()}
                    className="text-[#C72030] font-semibold hover:underline focus:outline-none"
                  >
                    browse
                  </button>
                </p>
                <p className="text-sm text-gray-400 mt-2">
                  Supports: CSV, Excel, PDF, DOC, TXT (Max 10MB)
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-center gap-3 p-4 bg-gray-50 rounded-lg">
                <FileText className="w-10 h-10 text-[#C72030]" />
                <div className="text-left flex-1 min-w-0">
                  <p className="font-medium text-gray-900 truncate">
                    {selectedFile.name}
                  </p>
                  <p className="text-sm text-gray-500">
                    {formatFileSize(selectedFile.size)}
                  </p>
                </div>
                <button
                  onClick={handleRemoveFile}
                  className="p-1 hover:bg-gray-200 rounded-full transition-colors"
                  disabled={uploadStatus.status === "uploading"}
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Status Message */}
        {uploadStatus.status !== "idle" && (
          <div
            className={`mt-4 p-4 rounded-lg flex items-center gap-3 ${
              uploadStatus.status === "uploading"
                ? "bg-blue-50 text-blue-700"
                : uploadStatus.status === "success"
                  ? "bg-green-50 text-green-700"
                  : "bg-red-50 text-red-700"
            }`}
          >
            {uploadStatus.status === "uploading" && (
              <Loader2 className="w-5 h-5 animate-spin" />
            )}
            {uploadStatus.status === "success" && (
              <CheckCircle className="w-5 h-5" />
            )}
            {uploadStatus.status === "error" && (
              <AlertCircle className="w-5 h-5" />
            )}
            <span className="text-sm font-medium">
              {uploadStatus.status === "uploading"
                ? "Uploading..."
                : uploadStatus.message}
            </span>
          </div>
        )}

        {/* Upload Button */}
        <Button
          onClick={handleUpload}
          disabled={!selectedFile || uploadStatus.status === "uploading"}
          className="w-full mt-6 bg-[#C72030] hover:bg-[#a51b28] text-white py-6 text-lg font-semibold rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {uploadStatus.status === "uploading" ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Uploading...
            </>
          ) : (
            <>
              <Upload className="w-5 h-5 mr-2" />
              Upload File
            </>
          )}
        </Button>

        {/* Token Warning */}
        {(!token || !baseUrl) && (
          <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <p className="text-amber-800 text-sm">
              <AlertCircle className="w-4 h-4 inline mr-2" />
              {!token && !baseUrl
                ? "Authentication token and Base URL are missing."
                : !token
                  ? "Authentication token is missing."
                  : "Base URL is missing."}{" "}
              Please ensure you have valid credentials.
            </p>
          </div>
        )}

        {/* Footer Info */}
        <p className="text-center text-xs text-gray-400 mt-6">
          Secure file upload • Data is processed securely
        </p>
      </div>
    </div>
  );
};

export default TrainingBulkUploadPage;
