// No backend API exists for Trainer Setup yet - this in-memory store stands in for one so
// the list/add/edit/details pages can be reviewed end-to-end. Swap these functions for
// real apiClient calls once a trainer-setup endpoint exists; the page components only
// depend on this module's exported functions, not on how the data is stored.

export interface TrainerCredential {
  id: string;
  name: string;
  size: string;
  url: string;
}

export interface TimeValue {
  hour: string;
  minute: string;
}

export interface DurationValue {
  day: string;
  hour: string;
  minute: string;
}

export interface TrainerAvailabilitySlot {
  startTime: TimeValue;
  endTime: TimeValue;
  concurrentSlots: string;
  slotBy: number;
}

export interface TrainerSetup {
  id: string;
  name: string;
  specialization: string;
  experience: string;
  ratePerSession: string;
  contactNumber: string;
  status: "Active" | "Inactive";
  bio: string;
  imageUrl?: string;
  credentials: TrainerCredential[];
  // Preferred session-slot duration and shift roster - optional so existing
  // mock records don't need backfilling.
  slot?: string;
  roster?: string;
  availabilitySlots?: TrainerAvailabilitySlot[];
  bookableSlotsPerDay?: string;
  bookingAllowedBefore?: DurationValue;
  advanceBooking?: DurationValue;
  canCancelBefore?: DurationValue;
  facilityBookedTimes?: string;
}

let trainers: TrainerSetup[] = [
  {
    id: "1",
    name: "Sarah Jenkins",
    specialization: "Yoga & Mindfulness",
    experience: "8 Years",
    ratePerSession: "75",
    contactNumber: "+1 (555) 019-2834",
    status: "Active",
    bio: "Yoga & Mindfulness Specialist with a focus on breath-led vinyasa flow, restorative practice, and guided meditation for stress relief.",
    imageUrl: "",
    credentials: [
      { id: "c1", name: "Yoga Alliance RYT-200.pdf", size: "2.4 MB", url: "" },
      { id: "c2", name: "CPR_AED Certification.pdf", size: "1.1 MB", url: "" },
    ],
  },
  {
    id: "2",
    name: "Marcus Thorne",
    specialization: "HIIT & CrossFit Strength",
    experience: "6 Years",
    ratePerSession: "90",
    contactNumber: "+1 (555) 014-9821",
    status: "Active",
    bio: "High-intensity interval and functional strength coach. Builds circuit programming for all levels with a focus on progressive overload.",
    imageUrl: "",
    credentials: [{ id: "c3", name: "CrossFit Level 2.pdf", size: "1.8 MB", url: "" }],
  },
  {
    id: "3",
    name: "Elena Rostova",
    specialization: "Reformer Pilates",
    experience: "10 Years",
    ratePerSession: "10",
    contactNumber: "+1 (555) 012-4432",
    status: "Active",
    bio: "Classical and contemporary reformer Pilates instructor. Specialises in rehabilitation-focused sessions and spinal alignment.",
    imageUrl: "",
    credentials: [{ id: "c4", name: "Polestar Pilates Cert.pdf", size: "3.2 MB", url: "" }],
  },
  {
    id: "4",
    name: "David Miller",
    specialization: "Boxing & Cardio Kick",
    experience: "5 Years",
    ratePerSession: "80",
    contactNumber: "+1 (555) 015-3891",
    status: "Inactive",
    bio: "Boxing and cardio kickboxing coach. Currently on sabbatical.",
    imageUrl: "",
    credentials: [],
  },
  {
    id: "5",
    name: "Priya Patel",
    specialization: "Ashtanga & Vinyasa Yoga",
    experience: "7 Years",
    ratePerSession: "85",
    contactNumber: "+1 (555) 017-7744",
    status: "Active",
    bio: "Ashtanga and vinyasa yoga teacher trained in Mysore. Leads led-primary series and workshops on inversions.",
    imageUrl: "",
    credentials: [{ id: "c5", name: "RYT-500 Certificate.pdf", size: "2.0 MB", url: "" }],
  },
  {
    id: "6",
    name: "Jordan Vance",
    specialization: "Athletic Conditioning",
    experience: "4 Years",
    ratePerSession: "70",
    contactNumber: "+1 (555) 013-1120",
    status: "Active",
    bio: "Sports performance and athletic conditioning coach working with speed, agility, and power development.",
    imageUrl: "",
    credentials: [],
  },
  {
    id: "7",
    name: "Theresa Webb",
    specialization: "Pre/Post Natal Fitness",
    experience: "9 Years",
    ratePerSession: "95",
    contactNumber: "+1 (555) 018-9080",
    status: "Inactive",
    bio: "Pre and post natal fitness specialist. Certified in diastasis recti and pelvic floor safe programming.",
    imageUrl: "",
    credentials: [{ id: "c6", name: "Pre_Post Natal Cert.pdf", size: "1.5 MB", url: "" }],
  },
];

// Pad out to 18 total rows so the list page's pagination (10 per page, page 1 of 2)
// matches the design without hand-writing another dozen realistic rows.
const extra = [
  "Yoga Flow",
  "Strength & Core",
  "Mobility Coaching",
  "Spin & Endurance",
  "Barre Technique",
  "Aqua Fitness",
  "Kids Movement",
  "Senior Wellness",
  "Rehab & Recovery",
  "Dance Cardio",
  "Meditation Guide",
];
extra.forEach((spec, i) => {
  trainers.push({
    id: String(8 + i),
    name: `Trainer ${8 + i}`,
    specialization: spec,
    experience: `${3 + (i % 6)} Years`,
    ratePerSession: String(60 + i * 5),
    contactNumber: `+1 (555) 0${10 + i}-${1000 + i}`,
    status: i % 5 === 0 ? "Inactive" : "Active",
    bio: `${spec} coach - profile to be completed.`,
    imageUrl: "",
    credentials: [],
  });
});
trainers = trainers.slice(0, 18);

export function getTrainers(): TrainerSetup[] {
  return trainers;
}

export function getTrainerById(id: string): TrainerSetup | undefined {
  return trainers.find((t) => t.id === id);
}

export function addTrainer(data: Omit<TrainerSetup, "id" | "credentials">): TrainerSetup {
  const newTrainer: TrainerSetup = {
    ...data,
    id: String(Date.now()),
    credentials: [],
  };
  trainers = [newTrainer, ...trainers];
  return newTrainer;
}

export function updateTrainer(
  id: string,
  data: Omit<TrainerSetup, "id" | "credentials">
): TrainerSetup | undefined {
  const idx = trainers.findIndex((t) => t.id === id);
  if (idx === -1) return undefined;
  trainers[idx] = { ...trainers[idx], ...data };
  return trainers[idx];
}

export function deleteTrainer(id: string): void {
  trainers = trainers.filter((t) => t.id !== id);
}

export const SPECIALIZATIONS = [
  "Yoga & Mindfulness",
  "Reformer Pilates",
  "HIIT & CrossFit Strength",
  "Boxing & Cardio Kick",
  "Ashtanga & Vinyasa Yoga",
  "Athletic Conditioning",
  "Pre/Post Natal Fitness",
];

// Session-slot duration options - mirrors the "Slot by" list used on the
// Amenity Booking Setup facility timings section.
export const SLOT_DURATION_OPTIONS = [
  { value: "15", label: "15 Minutes" },
  { value: "30", label: "Half hour" },
  { value: "45", label: "45 Minutes" },
  { value: "60", label: "1 hour" },
  { value: "90", label: "1 and a half hours" },
  { value: "120", label: "2 hours" },
  { value: "150", label: "2 and a half hours" },
  { value: "180", label: "3 hours" },
  { value: "210", label: "3 and a half hours" },
  { value: "240", label: "4 hours" },
  { value: "270", label: "4 and a half hours" },
];

export const ROSTER_OPTIONS = [
  "Morning Shift",
  "Afternoon Shift",
  "Evening Shift",
  "Full Day",
  "Weekday Only",
  "Weekend Only",
];
