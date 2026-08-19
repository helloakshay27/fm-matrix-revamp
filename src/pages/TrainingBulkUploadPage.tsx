import React, { useState, useRef, useCallback, useEffect } from "react";
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
  // Guards state updates once the component is gone, so a poll loop that's
  // still in flight when the user navigates away doesn't touch dead state.
  const isMountedRef = useRef(true);
  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  // Get token and baseUrl dynamically - first from URL params, then from auth utils
  const urlParams = new URLSearchParams(window.location.search);
  const token = urlParams.get("token") || getToken();
  const baseUrl = urlParams.get("baseUrl") || getBaseUrl();

  const POLL_INTERVAL_MS = 3000;
  const MAX_POLL_ATTEMPTS = 60; // ~3 minutes at 3s intervals before giving up

  // Extracts the result file from a response and triggers a browser download —
  // shared by both the "instant blob" upload response and the final
  // download=true call once polling confirms the job is ready.
  const downloadBlobResponse = async (response: Response, fallbackName: string) => {
    const blob = await response.blob();
    const downloadUrl = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = downloadUrl;

    const contentDisposition = response.headers.get("content-disposition");
    let filename = fallbackName;
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
  };

  // Once the status poll reports the job is ready, make one final call with
  // download=true — the same endpoint switches from returning job status JSON
  // to actually serving the result file when this flag is set.
  const fetchResultFile = async (jobId: string) => {
    const response = await fetch(
      `${baseUrl}/trainings/bulk_upload?token=${token}&job_id=${jobId}&download=true`
    );
    if (!response.ok) {
      throw new Error(`Failed to download result file (status ${response.status})`);
    }
    await downloadBlobResponse(response, "training_upload_result.xlsx");
  };

  // Polls the same endpoint with job_id until the response reports
  // `download_ready: true`, then fetches the result file (with &download=true) and stops.
  const pollJobStatus = async (jobId: string) => {
    for (let attempt = 0; attempt < MAX_POLL_ATTEMPTS; attempt++) {
      await new Promise((resolve) => setTimeout(resolve, POLL_INTERVAL_MS));
      if (!isMountedRef.current) return;

      const response = await fetch(
        `${baseUrl}/trainings/bulk_upload?token=${token}&job_id=${jobId}`
      );
      if (!response.ok) {
        throw new Error(`Status check failed with status ${response.status}`);
      }
      const data = await response.json();

      if (data?.download_ready === true) {
        await fetchResultFile(jobId);
        if (!isMountedRef.current) return;
        setUploadStatus({
          status: "success",
          message: "File processed! Result file downloaded.",
        });
        toast.success("File processed! Result file downloaded.");
        setSelectedFile(null);
        return;
      }

    }

    throw new Error("Processing is taking longer than expected. Please try again later.");
  };

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
    // Only .xlsx is accepted for training bulk upload.
    const allowedTypes = [".xlsx"];
    const fileExtension = "." + file.name.split(".").pop()?.toLowerCase();

    if (!allowedTypes.includes(fileExtension)) {
      toast.error("Invalid file type. Only .xlsx files are allowed.");
      return;
    }

    // Check file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast.error("File size exceeds 2MB limit");
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
        `${baseUrl}/trainings/bulk_upload?token=${token}`,
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

      // Handle file download response (Excel, CSV, etc.) — the job finished
      // synchronously and the result file came back on the very first call.
      if (
        contentType.includes("application/vnd.openxmlformats-officedocument") ||
        contentType.includes("application/vnd.ms-excel") ||
        contentType.includes("application/octet-stream") ||
        contentType.includes("text/csv")
      ) {
        await downloadBlobResponse(response, "training_upload_result.xlsx");

        setUploadStatus({
          status: "success",
          message: "File processed! Result file downloaded.",
        });
        toast.success("File processed! Result file downloaded.");
        setSelectedFile(null);
        return;
      }

      // Handle JSON response — a job_id means processing happens in the
      // background, so poll the same endpoint until it reports
      // download_ready: true, then fetch the result file and stop.
      const data = await response.json();

      if (data?.job_id) {
        // Rare case: the job already finished by the time this first response
        // came back, so download_ready is already true — skip straight to the
        // result fetch instead of waiting a full poll interval for nothing.
        if (data?.download_ready === true) {
          await fetchResultFile(data.job_id);
          setUploadStatus({
            status: "success",
            message: "File processed! Result file downloaded.",
          });
          toast.success("File processed! Result file downloaded.");
          setSelectedFile(null);
          return;
        }

        setUploadStatus({
          status: "uploading",
          message: "File uploaded — processing has started…",
        });
        await pollJobStatus(data.job_id);
        return;
      }

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
            accept=".xlsx"
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
                  Supports: XLSX only (Max 2MB)
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
                ? uploadStatus.message || "Uploading..."
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
