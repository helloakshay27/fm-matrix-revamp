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

/** Best-effort message from an API response ({ message } / { error } / { errors }). */
const responseMessage = (body: unknown): string => {
  if (!body || typeof body !== "object") return "";
  const b = body as Record<string, unknown>;
  if (typeof b.message === "string") return b.message;
  if (typeof b.error === "string") return b.error;
  if (Array.isArray(b.errors)) {
    return b.errors
      .map((e) => (typeof e === "string" ? e : JSON.stringify(e)))
      .slice(0, 5)
      .join("; ");
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
      const result = await response.json().catch(() => null);
      if (!response.ok) {
        throw new Error(responseMessage(result) || `Upload failed with status ${response.status}`);
      }
      toast.success(responseMessage(result) || "External users uploaded successfully");
      setFile(null);
      onClose();
    } catch (error) {
      console.error("External users bulk upload failed:", error);
      toast.error(error instanceof Error ? error.message : "Failed to upload external users");
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

        <div className="fm-action-bar pt-2">
          <button type="button" className="fm-action-secondary" onClick={close} disabled={isUploading}>
            Cancel
          </button>
          <button type="button" className="fm-action-primary" onClick={handleUpload} disabled={!file || isUploading}>
            <Upload className="w-4 h-4" />
            {isUploading ? "Uploading..." : "Upload"}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
