// Client-side mirror of the API limits; the API checks again and its
// messages are shown as they are.
export const MAX_NOTIFICATION_ATTACHMENTS = 5;

const MB = 1024 * 1024;
const IMAGE_MAX_BYTES = 5 * MB;
const DOCUMENT_MAX_BYTES = 10 * MB;

const IMAGE_EXTENSIONS = ["jpg", "jpeg", "png", "gif", "webp"];
const IMAGE_MIME_TYPES = ["image/jpeg", "image/png", "image/gif", "image/webp"];
const DOCUMENT_EXTENSIONS = ["pdf", "doc", "docx", "xls", "xlsx", "pptx", "txt", "csv", "mp4"];

export const IMAGE_ACCEPT = IMAGE_MIME_TYPES.join(",");
export const ATTACHMENT_ACCEPT = [...IMAGE_EXTENSIONS, ...DOCUMENT_EXTENSIONS]
  .map((ext) => `.${ext}`)
  .join(",");

function fileExtension(file: File): string {
  const dot = file.name.lastIndexOf(".");
  return dot === -1 ? "" : file.name.slice(dot + 1).toLowerCase();
}

export function isImageFile(file: File): boolean {
  return IMAGE_MIME_TYPES.includes(file.type) || IMAGE_EXTENSIONS.includes(fileExtension(file));
}

export function isImageContentType(contentType: string | null | undefined): boolean {
  return !!contentType && contentType.startsWith("image/");
}

// Returns an error message, or null when the file is acceptable.
export function validateImageFile(file: File): string | null {
  if (!isImageFile(file)) return `${file.name}: Image must be a JPG, PNG, GIF or WebP file`;
  if (file.size > IMAGE_MAX_BYTES) return `${file.name}: File is too large (maximum 5 MB)`;
  return null;
}

export function validateDocumentFile(file: File): string | null {
  if (!DOCUMENT_EXTENSIONS.includes(fileExtension(file))) {
    return `${file.name}: This file type is not supported`;
  }
  if (file.size > DOCUMENT_MAX_BYTES) return `${file.name}: File is too large (maximum 10 MB)`;
  return null;
}

export function formatFileSize(bytes: number | null | undefined): string {
  if (bytes == null) return "";
  if (bytes < MB) return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  return `${(bytes / MB).toFixed(1)} MB`;
}
