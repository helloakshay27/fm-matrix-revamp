// vCard 3.0 builder for the digital business card's "Save Contact" (.vcf download).
// Values are escaped per RFC 2426 and long lines are folded, so names, addresses and links with
// commas, semicolons or line breaks import correctly on Android, iOS and desktop contacts apps.

export interface VCardLink {
  title?: string;
  url: string;
}

export interface VCardContact {
  fullName: string;
  firstName?: string;
  lastName?: string;
  company?: string;
  designation?: string;
  department?: string;
  /** Mobile number including country code, e.g. "+91 9876543210". */
  mobile?: string;
  email?: string;
  website?: string;
  address?: string;
  /** Base64 JPEG/PNG for an embedded photo, or a photo URL when it can't be embedded. */
  photo?: { base64: string; type: "JPEG" | "PNG" } | { url: string };
  links?: VCardLink[];
}

/** Escape a text value: backslash, comma, semicolon and line breaks. */
export const escapeVCardValue = (value: string) =>
  value
    .replace(/\\/g, "\\\\")
    .replace(/\r\n|\r|\n/g, "\\n")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,");

/** Fold a content line to 75 characters (continuation lines start with one space). */
const foldLine = (line: string) => {
  if (line.length <= 75) return line;
  const parts = [line.slice(0, 75)];
  for (let i = 75; i < line.length; i += 74) parts.push(` ${line.slice(i, i + 74)}`);
  return parts.join("\r\n");
};

const withProtocol = (url: string) => (/^https?:\/\//i.test(url) ? url : `https://${url}`);

/** Split a full name into first / last when the API only gives one string. */
export const splitName = (fullName: string) => {
  const parts = fullName.trim().split(/\s+/).filter(Boolean);
  if (parts.length <= 1) return { firstName: parts[0] ?? "", lastName: "" };
  return { firstName: parts.slice(0, -1).join(" "), lastName: parts[parts.length - 1] };
};

/** A contact is worth saving when it has a name and a way to reach the person. */
export const isSavableContact = (contact: VCardContact) =>
  Boolean(contact.fullName.trim() && (contact.mobile?.trim() || contact.email?.trim()));

export const buildVCard = (contact: VCardContact): string => {
  const e = escapeVCardValue;
  const names = contact.firstName || contact.lastName ? { firstName: contact.firstName ?? "", lastName: contact.lastName ?? "" } : splitName(contact.fullName);
  const lines = ["BEGIN:VCARD", "VERSION:3.0", `FN:${e(contact.fullName.trim())}`, `N:${e(names.lastName)};${e(names.firstName)};;;`];

  if (contact.company || contact.department) {
    lines.push(`ORG:${e(contact.company ?? "")}${contact.department ? `;${e(contact.department)}` : ""}`);
  }
  if (contact.designation) lines.push(`TITLE:${e(contact.designation)}`);
  if (contact.mobile) {
    // Keep only + and digits so dialers and WhatsApp recognise the number.
    const tel = contact.mobile.replace(/[^\d+]/g, "");
    if (tel) lines.push(`TEL;TYPE=CELL,VOICE:${tel}`);
  }
  if (contact.email) lines.push(`EMAIL;TYPE=INTERNET,WORK:${e(contact.email.trim())}`);
  if (contact.website) lines.push(`URL;TYPE=WORK:${e(withProtocol(contact.website.trim()))}`);
  if (contact.address) {
    // Whole address as the street part; the API doesn't split city / postcode.
    lines.push(`ADR;TYPE=WORK:;;${e(contact.address.trim())};;;;`);
  }
  for (const link of contact.links ?? []) {
    if (!link.url?.trim()) continue;
    const url = e(withProtocol(link.url.trim()));
    const type = link.title?.trim() ? e(link.title.trim().toLowerCase()) : "";
    lines.push(type ? `URL;TYPE=${type}:${url}` : `URL:${url}`);
    // iOS Contacts shows these as social profiles.
    if (type) lines.push(`X-SOCIALPROFILE;TYPE=${type}:${url}`);
  }
  if (contact.photo) {
    lines.push("base64" in contact.photo ? `PHOTO;ENCODING=b;TYPE=${contact.photo.type}:${contact.photo.base64}` : `PHOTO;VALUE=URI:${contact.photo.url}`);
  }
  lines.push("END:VCARD");
  return lines.map(foldLine).join("\r\n") + "\r\n";
};

/**
 * Embed a profile photo when the image server allows it (CORS); otherwise fall back to its URL
 * so the contact still saves. Gives up after a few seconds rather than blocking the download.
 */
export const loadVCardPhoto = async (url: string): Promise<VCardContact["photo"]> => {
  const controller = new AbortController();
  const timer = window.setTimeout(() => controller.abort(), 5000);
  try {
    const response = await fetch(url, { signal: controller.signal });
    if (!response.ok) throw new Error(`Photo request failed (${response.status})`);
    const blob = await response.blob();
    const type = blob.type.includes("png") ? "PNG" : "JPEG";
    const dataUrl = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result));
      reader.onerror = () => reject(reader.error);
      reader.readAsDataURL(blob);
    });
    return { base64: dataUrl.slice(dataUrl.indexOf(",") + 1), type };
  } catch {
    return { url };
  } finally {
    window.clearTimeout(timer);
  }
};

/** Download the vCard as a .vcf file. The object URL is revoked after a delay so iOS can open it. */
export const downloadVCard = (vCard: string, fileName: string) => {
  const blob = new Blob([vCard], { type: "text/vcard;charset=utf-8" });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName.endsWith(".vcf") ? fileName : `${fileName}.vcf`;
  link.rel = "noopener";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.setTimeout(() => window.URL.revokeObjectURL(url), 10000);
};
