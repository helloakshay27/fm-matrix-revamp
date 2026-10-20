import { useState, type DragEvent } from "react";
import { FileSpreadsheet, Upload, X } from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { getAuthHeader, getFullUrl } from "@/config/apiConfig";

// Bulk upload of Vi external (Non-FTE) users. Follows the base URL of the logged-in site
// (live-api on production, vi-uat-api on UAT).
const BULK_UPLOAD_EXTERNAL_USERS_ENDPOINT = "/smts/vi_bulk_upload_external_users.json";
// The external-users import only accepts Excel .xlsx files.
const ACCEPTED_EXTENSIONS = ["xlsx"];
const ACCEPT = ".xlsx,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";

const isAcceptedFile = (file: File) =>
  ACCEPTED_EXTENSIONS.includes(file.name.split(".").pop()?.toLowerCase() ?? "");

// A response is the result file (not JSON) when it is a spreadsheet / binary or an attachment.
const isFileResponse = (response: Response) => {
  const type = (response.headers.get("content-type") || "").toLowerCase();
  const disposition = (response.headers.get("content-disposition") || "").toLowerCase();
  return (
    disposition.includes("attachment") ||
    type.includes("spreadsheetml") ||
    type.includes("ms-excel") ||
    type.includes("octet-stream")
  );
};

// File name from Content-Disposition (filename*=UTF-8''… or filename="…"), when the server sends one.
const fileNameFromResponse = (response: Response) => {
  const disposition = response.headers.get("content-disposition") || "";
  const encoded = disposition.match(/filename\*=UTF-8''([^;]+)/i)?.[1];
  if (encoded) return decodeURIComponent(encoded.trim());
  return disposition.match(/filename="?([^";]+)"?/i)?.[1]?.trim() || "";
};

const resultFileName = () => `external_users_upload_result_${new Date().toISOString().split("T")[0]}.xlsx`;

const downloadBlob = (blob: Blob, fileName: string) => {
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};

// One error entry as text: a string, or an object with message / error.
const errorText = (entry: unknown): string => {
  if (typeof entry === "string") return entry;
  if (entry && typeof entry === "object") {
    const e = entry as Record<string, unknown>;
    if (typeof e.message === "string") return e.message;
    if (typeof e.error === "string") return e.error;
    return JSON.stringify(entry);
  }
  return "";
};

/**
 * Best-effort message from an API response: { message } / { error } / { errors: [...] } /
 * { import_errors: [{ message }] } (the 422 shape for a bad upload file).
 */
const responseMessage = (body: unknown): string => {
  if (!body || typeof body !== "object") return "";
  const b = body as Record<string, unknown>;
  if (typeof b.message === "string") return b.message;
  if (typeof b.error === "string") return b.error;
  for (const key of ["import_errors", "errors"]) {
    const list = b[key];
    if (Array.isArray(list) && list.length) {
      return list.map(errorText).filter(Boolean).slice(0, 5).join(" ");
    }
  }
  return "";
};

export const BulkUploadExternalUsersModal = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const pickFile = (candidate: File | undefined) => {
    if (!candidate) return;
    if (!isAcceptedFile(candidate)) {
      toast.error(`${candidate.name} is not supported. Only .xlsx files can be uploaded.`);
      return;
    }
    setFile(candidate);
  };

  const close = () => {
    if (isUploading) return;
    setFile(null);
    onClose();
  };

  const handleDrop = (event: DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    setIsDragging(false);
    pickFile(event.dataTransfer.files?.[0]);
  };

  const handleUpload = async () => {
    if (!file || isUploading) return;
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const response = await fetch(getFullUrl(BULK_UPLOAD_EXTERNAL_USERS_ENDPOINT), {
        method: "POST",
        headers: { Authorization: getAuthHeader() },
        body: formData,
      });
      if (!response.ok) {
        const errorBody = await response.json().catch(() => null);
        throw new Error(responseMessage(errorBody) || `Upload failed with status ${response.status}`);
      }

      // On success (201) the API returns the processed Excel file — download it.
      if (isFileResponse(response)) {
        const blob = await response.blob();
        downloadBlob(blob, fileNameFromResponse(response) || resultFileName());
        toast.success("External users uploaded. The result file has been downloaded.");
      } else {
        const result = await response.json().catch(() => null);
        toast.success(responseMessage(result) || "External users uploaded successfully");
      }
      setFile(null);
      onClose();
    } catch (error) {
      console.error("External users bulk upload failed:", error);
      // Import errors (e.g. 422 missing headers) can be long — keep the toast up long enough to read.
      toast.error(error instanceof Error ? error.message : "Failed to upload external users", { duration: 10000 });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && close()}>
      <DialogContent className="sm:max-w-lg rounded-2xl p-8">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-[#1A1A18]">Bulk Upload For External User</DialogTitle>
          <DialogDescription className="text-sm text-[rgba(26,26,24,0.48)]">
            Upload an Excel (.xlsx) file with the external (Non-FTE) users to add.
          </DialogDescription>
        </DialogHeader>

        <label
          htmlFor="external-users-bulk-upload"
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          className={`mt-2 flex cursor-pointer flex-col items-center justify-center gap-2 rounded-[12px] border-2 border-dashed px-6 py-10 text-center transition-colors ${
            isDragging
              ? "border-[#1A1A18] bg-[#F7F6F2]"
              : "border-[rgba(26,26,24,0.16)] bg-white hover:bg-[#F7F6F2]"
          }`}
        >
          <Upload className="w-7 h-7 text-[rgba(26,26,24,0.48)]" />
          <span className="text-sm text-[rgba(26,26,24,0.68)]">
            Drag &amp; drop or <span className="font-semibold text-[#1A1A18] underline">choose file</span>
          </span>
          <span className="text-xs text-[rgba(26,26,24,0.48)]">Only .xlsx files</span>
          <input
            id="external-users-bulk-upload"
            type="file"
            accept={ACCEPT}
            className="hidden"
            disabled={isUploading}
            onChange={(e) => {
              pickFile(e.target.files?.[0]);
              e.target.value = "";
            }}
          />
        </label>

        {file && (
          <div className="flex items-center justify-between gap-3 rounded-[12px] border border-[rgba(26,26,24,0.09)] bg-[#F5F4F0] px-4 py-3">
            <div className="flex min-w-0 items-center gap-2">
              <FileSpreadsheet className="w-4 h-4 shrink-0 text-[rgba(26,26,24,0.68)]" />
              <span className="truncate text-sm text-[#1A1A18]">{file.name}</span>
            </div>
            <button
              type="button"
              onClick={() => setFile(null)}
              disabled={isUploading}
              className="rounded-[8px] p-1 text-[rgba(26,26,24,0.48)] hover:bg-white hover:text-[#1A1A18]"
              aria-label={`Remove ${file.name}`}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        <div className="flex flex-wrap items-center justify-end gap-3 pt-2">
          <button type="button" className="inline-flex h-[42px] items-center justify-center gap-2 rounded-[8px] border px-[22px] text-[13px] font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1A1A18] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 border-[rgba(26,26,24,0.12)] bg-white text-[#1A1A18] hover:border-[rgba(26,26,24,0.28)] hover:bg-[#F7F6F2]" onClick={close} disabled={isUploading}>
            Cancel
          </button>
          <button type="button" className="inline-flex h-[42px] items-center justify-center gap-2 rounded-[8px] border px-[22px] text-[13px] font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1A1A18] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 border-[#1A1A18] bg-[#1A1A18] text-white hover:bg-[#12100E] [&_svg]:text-white" onClick={handleUpload} disabled={!file || isUploading}>
            <Upload className="w-4 h-4" />
            {isUploading ? "Uploading..." : "Upload"}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
