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

export const CLASS_TYPES = ["Group", "Private"];
export const ACTIVITY_TYPES = ["Pilates", "Yoga"];
