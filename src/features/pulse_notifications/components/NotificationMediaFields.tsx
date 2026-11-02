import { useEffect, useRef } from "react";
import { FileText, ImagePlus, Loader2, Paperclip, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { uploadCustomNotificationFile } from "../api/customNotificationsApi";
import { getApiErrorMessage } from "../utils/apiErrorMessage";
import {
  ATTACHMENT_ACCEPT,
  IMAGE_ACCEPT,
  MAX_NOTIFICATION_ATTACHMENTS,
  formatFileSize,
  isImageContentType,
  isImageFile,
  validateDocumentFile,
  validateImageFile,
} from "../utils/notificationFiles";

export interface BannerImageState {
  // A newly picked file (sent as banner_image on submit) and its local preview.
  file: File | null;
  previewUrl: string | null;
  // The image already saved on the notification (Edit only).
  savedUrl: string | null;
}

// saved: already attached to the notification (Edit), kept via attachment_ids.
// image: picked in the browser, sent as images[] on submit.
// document: uploaded right away; id is null while the upload is running.
export type AttachmentItem =
  | {
      kind: "saved";
      key: string;
      id: number;
      name: string;
      url: string;
      contentType: string | null;
      size: number | null;
    }
  | { kind: "image"; key: string; file: File; previewUrl: string }
  | { kind: "document"; key: string; file: File; id: number | null };

interface NotificationMediaFieldsProps {
  banner: BannerImageState;
  onBannerChange: (banner: BannerImageState) => void;
  attachments: AttachmentItem[];
  onAttachmentsChange: React.Dispatch<React.SetStateAction<AttachmentItem[]>>;
}

let attachmentKeySeq = 0;
const nextAttachmentKey = () => `new-${++attachmentKeySeq}`;

export function NotificationMediaFields({
  banner,
  onBannerChange,
  attachments,
  onAttachmentsChange,
}: NotificationMediaFieldsProps) {
  const bannerInputRef = useRef<HTMLInputElement>(null);
  const attachmentInputRef = useRef<HTMLInputElement>(null);

  // Revoke every local preview URL this form created once it unmounts.
  const previewUrlsRef = useRef<Set<string>>(new Set());
  useEffect(() => {
    const previewUrls = previewUrlsRef.current;
    return () => previewUrls.forEach((url) => URL.revokeObjectURL(url));
  }, []);

  const createPreviewUrl = (file: File) => {
    const url = URL.createObjectURL(file);
    previewUrlsRef.current.add(url);
    return url;
  };

  const revokePreviewUrl = (url: string | null) => {
    if (!url) return;
    URL.revokeObjectURL(url);
    previewUrlsRef.current.delete(url);
  };

  const handleBannerPick = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    const error = validateImageFile(file);
    if (error) {
      toast.error(error);
      return;
    }

    revokePreviewUrl(banner.previewUrl);
    onBannerChange({ ...banner, file, previewUrl: createPreviewUrl(file) });
  };

  const handleBannerRemove = () => {
    revokePreviewUrl(banner.previewUrl);
    onBannerChange({ file: null, previewUrl: null, savedUrl: null });
  };

  const uploadDocument = async (key: string, file: File) => {
    try {
      const uploaded = await uploadCustomNotificationFile(file, "attachment");
      onAttachmentsChange((prev) =>
        prev.map((item) =>
          item.key === key && item.kind === "document" ? { ...item, id: uploaded.id } : item
        )
      );
    } catch (error: unknown) {
      onAttachmentsChange((prev) => prev.filter((item) => item.key !== key));
      toast.error(getApiErrorMessage(error, `${file.name}: Upload failed, please try again`));
    }
  };

  const handleAttachmentPick = (event: React.ChangeEvent<HTMLInputElement>) => {
    const picked = Array.from(event.target.files ?? []);
    event.target.value = "";
    if (picked.length === 0) return;

    const remainingSlots = MAX_NOTIFICATION_ATTACHMENTS - attachments.length;
    if (picked.length > remainingSlots) {
      toast.error(`You can attach at most ${MAX_NOTIFICATION_ATTACHMENTS} files`);
    }

    const added: AttachmentItem[] = [];
    for (const file of picked.slice(0, Math.max(0, remainingSlots))) {
      const isImage = isImageFile(file);
      const error = isImage ? validateImageFile(file) : validateDocumentFile(file);
      if (error) {
        toast.error(error);
        continue;
      }

      const key = nextAttachmentKey();
      if (isImage) {
        added.push({ kind: "image", key, file, previewUrl: createPreviewUrl(file) });
      } else {
        added.push({ kind: "document", key, file, id: null });
        void uploadDocument(key, file);
      }
    }

    if (added.length > 0) onAttachmentsChange((prev) => [...prev, ...added]);
  };

  const handleAttachmentRemove = (item: AttachmentItem) => {
    if (item.kind === "image") revokePreviewUrl(item.previewUrl);
    onAttachmentsChange((prev) => prev.filter((existing) => existing.key !== item.key));
  };

  const bannerSrc = banner.previewUrl ?? banner.savedUrl;
  const isFull = attachments.length >= MAX_NOTIFICATION_ATTACHMENTS;

  return (
    <div className="space-y-6">
      {/* Image */}
      <div className="space-y-2">
        <p className="text-sm font-medium text-gray-700">Image</p>
        <input
          ref={bannerInputRef}
          type="file"
          accept={IMAGE_ACCEPT}
          className="hidden"
          onChange={handleBannerPick}
        />
        {bannerSrc ? (
          <div className="flex flex-col sm:flex-row sm:items-end gap-3">
            <div className="relative w-full max-w-sm">
              <img
                src={bannerSrc}
                alt="Notification image"
                className="w-full max-h-48 rounded-lg border border-gray-200 object-cover bg-gray-100"
              />
              <button
                type="button"
                onClick={handleBannerRemove}
                aria-label="Remove image"
                className="absolute top-2 right-2 rounded-full bg-white/90 p-1 text-gray-700 shadow hover:text-brand-error"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="flex flex-col gap-1">
              <Button
                type="button"
                variant="outline"
                onClick={() => bannerInputRef.current?.click()}
                className="!border-brand !text-brand hover:!bg-brand-selected gap-2 w-fit"
              >
                <ImagePlus className="w-4 h-4" />
                Replace
              </Button>
              {banner.file && (
                <span className="text-xs text-gray-500">Sent on submit</span>
              )}
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => bannerInputRef.current?.click()}
            className="flex w-full max-w-sm flex-col items-center justify-center gap-1 rounded-lg border border-dashed border-gray-300 px-4 py-6 text-center hover:border-brand hover:bg-brand-selected transition-colors"
          >
            <ImagePlus className="w-6 h-6 text-brand" />
            <span className="text-sm font-medium text-gray-900">Choose image</span>
            <span className="text-xs text-gray-500">JPG, PNG, GIF or WebP, up to 5 MB</span>
          </button>
        )}
      </div>

      {/* Attachments */}
      <div className="space-y-2">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-sm font-medium text-gray-700">
            Attachments{" "}
            <span className="text-gray-400">
              ({attachments.length}/{MAX_NOTIFICATION_ATTACHMENTS})
            </span>
          </p>
          <input
            ref={attachmentInputRef}
            type="file"
            multiple
            accept={ATTACHMENT_ACCEPT}
            className="hidden"
            onChange={handleAttachmentPick}
          />
          <Button
            type="button"
            variant="outline"
            onClick={() => attachmentInputRef.current?.click()}
            disabled={isFull}
            className="!border-brand !text-brand hover:!bg-brand-selected gap-2"
          >
            <Paperclip className="w-4 h-4" />
            Add file
          </Button>
        </div>
        <p className="text-xs text-gray-500">
          Images (up to 5 MB) or PDF, Word, Excel, PowerPoint, text, CSV, MP4 (up to 10 MB).
          Files are public to anyone with the link, so do not attach confidential documents.
        </p>

        {attachments.length > 0 && (
          <ul className="divide-y divide-gray-100 rounded-lg border border-gray-200">
            {attachments.map((item) => {
              const name = item.kind === "saved" ? item.name : item.file.name;
              const size = item.kind === "saved" ? item.size : item.file.size;
              const thumbnail =
                item.kind === "image"
                  ? item.previewUrl
                  : item.kind === "saved" && isImageContentType(item.contentType)
                    ? item.url
                    : null;
              const isUploading = item.kind === "document" && item.id == null;

              return (
                <li key={item.key} className="flex items-center gap-3 px-3 py-2">
                  {thumbnail ? (
                    <img
                      src={thumbnail}
                      alt=""
                      className="w-10 h-10 flex-shrink-0 rounded object-cover bg-gray-100"
                    />
                  ) : (
                    <div className="w-10 h-10 flex-shrink-0 rounded bg-brand-light flex items-center justify-center">
                      <FileText className="w-5 h-5 text-brand" />
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    {item.kind === "saved" ? (
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block truncate text-sm text-gray-900 hover:text-brand hover:underline"
                      >
                        {name}
                      </a>
                    ) : (
                      <p className="truncate text-sm text-gray-900">{name}</p>
                    )}
                    <p className="flex items-center gap-1 text-xs text-gray-500">
                      {formatFileSize(size)}
                      {item.kind === "image" && <span>· Sent on submit</span>}
                      {isUploading && (
                        <>
                          <span>·</span>
                          <Loader2 className="w-3 h-3 animate-spin" />
                          <span>Uploading...</span>
                        </>
                      )}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleAttachmentRemove(item)}
                    aria-label={`Remove ${name}`}
                    className="flex-shrink-0 rounded p-1 text-gray-500 hover:text-brand-error"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
