// Shared type/constants for Class Setup - the CRUD itself now goes through the
// real API (GET/POST/PUT/DELETE on /pms/admin/club_classes), wired directly in
// ClassSetupList/Add/Edit/Details.tsx.

export interface ClassSetup {
  id: string;
  className: string;
  classType: string;
  activityType: string;
  amountPerPerson: string;
  minParticipants: number;
  maxCapacity: number;
  location: string;
  duration: string;
  trainer: string[];
  status: "Active" | "Inactive";
  // 24h "HH:mm" values from the native <input type="time"> pickers.
  startTime?: string;
  endTime?: string;
  description: string;
  trainers: ClassTrainer[];
}

export interface ClassTrainer {
  id: string;
  name: string;
  email: string;
  specialization: string;
  experience: string;
  status: "Active" | "Inactive";
}

export interface ClassAttachment {
  id: string;
  name: string;
  url: string;
}

// The API's attachment `url` comes back URL-encoded and protocol-relative, e.g.
// "%2F%2Fs3.amazonaws.com%2F...%2Ffile.pdf?169..." -> "//s3.amazonaws.com/.../file.pdf?169...".
// Decode it and add the scheme back so it's a normal clickable/downloadable link.
export function resolveAttachmentUrl(rawUrl: string): string {
  const decoded = decodeURIComponent(rawUrl);
  return decoded.startsWith("//") ? `https:${decoded}` : decoded;
}

export const CLASS_TYPES = ["Group", "Private"];
export const ACTIVITY_TYPES = ["Pilates", "Yoga"];
