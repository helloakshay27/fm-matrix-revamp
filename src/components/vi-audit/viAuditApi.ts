// Shared helpers for the Vi Audit API calls.

/** Best-effort message from an API error body ({ message } / { error } / { errors }). */
export const apiErrorMessage = (body: unknown): string => {
  if (!body || typeof body !== "object") return "";
  const b = body as Record<string, unknown>;
  if (typeof b.message === "string") return b.message;
  if (typeof b.error === "string") return b.error;
  if (Array.isArray(b.errors)) return b.errors.filter((e) => typeof e === "string").join(", ");
  if (b.errors && typeof b.errors === "object") {
    return Object.entries(b.errors as Record<string, unknown>)
      .map(([field, msgs]) => `${field} ${Array.isArray(msgs) ? msgs.join(", ") : String(msgs)}`)
      .join("; ");
  }
  return "";
};

// Audit / CAPA attachments: the audit API only accepts PDF, JPEG, JPG and PNG.
const ALLOWED_ATTACHMENT_EXTENSIONS = ["pdf", "jpeg", "jpg", "png"];
const ALLOWED_ATTACHMENT_MIME_TYPES = ["application/pdf", "image/jpeg", "image/png"];
export const ATTACHMENT_ACCEPT = ".pdf,.jpeg,.jpg,.png,application/pdf,image/jpeg,image/png";

export const isAllowedAttachment = (file: File) => {
  const extension = file.name.split(".").pop()?.toLowerCase() ?? "";
  // Check the extension (what the API validates on) and, when the browser reports one, the MIME type.
  return (
    ALLOWED_ATTACHMENT_EXTENSIONS.includes(extension) &&
    (!file.type || ALLOWED_ATTACHMENT_MIME_TYPES.includes(file.type))
  );
};

/**
 * Reads a file as the attachment format the audit API expects:
 * `data:<mime>;name=<filename>;base64,<data>` (one entry per file — any number per observation).
 */
export const fileToNamedDataUrl = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = String(reader.result ?? "");
      // ";" and "," delimit the data-URL header, so keep them out of the file name.
      const safeName = file.name.replace(/[;,]/g, "_");
      resolve(dataUrl.replace(/^data:([^;,]*)/, (_, mime) => `data:${mime || "application/octet-stream"};name=${safeName}`));
    };
    reader.onerror = () => reject(reader.error ?? new Error(`Could not read ${file.name}`));
    reader.readAsDataURL(file);
  });
