import { useRef, useState } from "react";
import { attachmentApi } from "@/api/attachments";
import type { Attachment } from "@/types/schemas/ticket";

interface FileUploaderProps {
  onAttachmentsChange: (ids: string[]) => void;
}

const FileUploader = ({ onAttachmentsChange }: FileUploaderProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setUploading(true);
    setError(null);
    const uploaded: Attachment[] = [];
    for (const file of Array.from(files)) {
      try {
        const att = await attachmentApi.upload(file);
        uploaded.push(att);
      } catch {
        setError(`Failed to upload "${file.name}"`);
      }
    }
    const next = [...attachments, ...uploaded];
    setAttachments(next);
    onAttachmentsChange(next.map((a) => a.id));
    setUploading(false);
    if (inputRef.current) inputRef.current.value = "";
  };

  const remove = async (id: string) => {
    try {
      await attachmentApi.destroy(id);
    } catch {
      // ignore — attachment may already be gone
    }
    const next = attachments.filter((a) => a.id !== id);
    setAttachments(next);
    onAttachmentsChange(next.map((a) => a.id));
  };

  const formatSize = (bytes: number | null | undefined) => {
    if (!bytes) return "";
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="space-y-2">
      {attachments.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {attachments.map((att) => (
            <div
              key={att.id}
              className="flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs"
              style={{
                backgroundColor: "var(--stone-10)",
                color: "var(--text)",
              }}
            >
              <svg
                className="h-3.5 w-3.5 flex-shrink-0"
                style={{ color: "var(--stone)" }}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
                />
              </svg>
              <span className="max-w-[140px] truncate">{att.filename}</span>
              {att.fileSize && (
                <span style={{ color: "var(--text-muted)" }}>
                  ({formatSize(att.fileSize)})
                </span>
              )}
              <button
                type="button"
                onClick={() => remove(att.id)}
                className="ml-0.5 hover:opacity-70"
                style={{ color: "var(--stone)" }}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors"
          style={{
            backgroundColor: "var(--stone-10)",
            color: "var(--text-muted)",
          }}
        >
          {uploading ? (
            <>
              <svg
                className="h-3.5 w-3.5 animate-spin"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8H4z"
                />
              </svg>
              Uploading…
            </>
          ) : (
            <>
              <svg
                className="h-3.5 w-3.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
                />
              </svg>
              Attach files
            </>
          )}
        </button>
        {error && (
          <span className="text-xs" style={{ color: "var(--crimson)" }}>
            {error}
          </span>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        multiple
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />
    </div>
  );
};

export default FileUploader;
