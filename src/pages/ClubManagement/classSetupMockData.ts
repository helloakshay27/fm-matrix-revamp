// No backend API exists for Class Setup yet - this in-memory store stands in for one so
// the list/add/edit/details pages can be reviewed end-to-end. Swap these functions for
// real apiClient calls once a class-setup endpoint exists; the page components only
// depend on this module's exported functions, not on how the data is stored.

export interface ClassSetup {
  id: string;
  className: string;
  amountPerPerson: string;
  minParticipants: number;
  maxCapacity: number;
  location: string;
  duration: string;
  trainer: string;
  status: "Active" | "Inactive";
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

let classes: ClassSetup[] = [
  {
    id: "1",
    className: "Reformer Pilates",
    amountPerPerson: "1500",
    minParticipants: 2,
    maxCapacity: 8,
    location: "Studio A",
    duration: "60 min",
    trainer: "Sarah Johnson",
    status: "Active",
    description:
      "Our Reformer Pilates class provides a complete body strength and conditioning workout using specialized spring-loaded resistance machines. Ideal for establishing core support, upgrading athletic flexibility, and sharpening spinal alignment. Sessions are strictly scaled to 8 members max for personalized guidance.",
    trainers: [
      { id: "t1", name: "Sarah Johnson", email: "sarah.j@recess.club", specialization: "Pilates Reformer, Mat", experience: "5 years", status: "Active" },
      { id: "t2", name: "Mike Chen", email: "mike.chen@recess.club", specialization: "Strength, Rehabilitation", experience: "4 years", status: "Active" },
      { id: "t3", name: "Lisa Park", email: "lisa.park@recess.club", specialization: "Yin Yoga, Pilates Fusion", experience: "6 years", status: "Active" },
      { id: "t4", name: "David Kim", email: "david.k@recess.club", specialization: "Cardio Reformer, Pilates", experience: "3 years", status: "Inactive" },
    ],
  },
  {
    id: "2",
    className: "Cadillac",
    amountPerPerson: "2000",
    minParticipants: 1,
    maxCapacity: 2,
    location: "Studio B",
    duration: "60 min",
    trainer: "Mike Chen",
    status: "Active",
    description: "One-on-one and duo Cadillac sessions using the trapeze table for deep stretching, spring resistance, and rehabilitation-focused training.",
    trainers: [
      { id: "t2", name: "Mike Chen", email: "mike.chen@recess.club", specialization: "Strength, Rehabilitation", experience: "4 years", status: "Active" },
    ],
  },
  {
    id: "3",
    className: "Private Pilates",
    amountPerPerson: "2500",
    minParticipants: 1,
    maxCapacity: 1,
    location: "Studio A",
    duration: "45 min",
    trainer: "Lisa Park",
    status: "Active",
    description: "Fully personalized one-on-one Pilates session tailored to individual goals, mobility, and fitness level.",
    trainers: [
      { id: "t3", name: "Lisa Park", email: "lisa.park@recess.club", specialization: "Yin Yoga, Pilates Fusion", experience: "6 years", status: "Active" },
    ],
  },
  {
    id: "4",
    className: "Yoga",
    amountPerPerson: "800",
    minParticipants: 3,
    maxCapacity: 15,
    location: "Studio C",
    duration: "60 min",
    trainer: "Lisa Park",
    status: "Active",
    description: "Group Vinyasa flow class focused on breath-led movement, flexibility, and stress relief.",
    trainers: [
      { id: "t3", name: "Lisa Park", email: "lisa.park@recess.club", specialization: "Yin Yoga, Pilates Fusion", experience: "6 years", status: "Active" },
    ],
  },
  {
    id: "5",
    className: "HIIT",
    amountPerPerson: "700",
    minParticipants: 4,
    maxCapacity: 20,
    location: "Studio C",
    duration: "45 min",
    trainer: "Mike Chen",
    status: "Inactive",
    description: "High-intensity interval training class combining bodyweight circuits and cardio bursts. Currently paused for the season.",
    trainers: [
      { id: "t2", name: "Mike Chen", email: "mike.chen@recess.club", specialization: "Strength, Rehabilitation", experience: "4 years", status: "Active" },
    ],
  },
  {
    id: "6",
    className: "Pickleball",
    amountPerPerson: "600",
    minParticipants: 2,
    maxCapacity: 4,
    location: "Court 1",
    duration: "60 min",
    trainer: "David Kim",
    status: "Active",
    description: "Doubles and singles pickleball court booking with optional coaching for beginners.",
    trainers: [
      { id: "t4", name: "David Kim", email: "david.k@recess.club", specialization: "Cardio Reformer, Pilates", experience: "3 years", status: "Inactive" },
    ],
  },
];

// Pad out to 18 total rows so the list page's pagination (10 per page, page 1 of 2)
// matches the design without hand-writing another dozen realistic rows.
const extraNames = ["Aqua Pilates", "Barre Fusion", "Spin Class", "Zumba", "Boxing Fit", "Stretch & Recover", "Kids Pilates", "Senior Fitness", "TRX Circuit", "Mobility Flow", "Prenatal Yoga", "Power Yoga"];
extraNames.forEach((name, i) => {
  classes.push({
    id: String(7 + i),
    className: name,
    amountPerPerson: "900",
    minParticipants: 2,
    maxCapacity: 10,
    location: i % 2 === 0 ? "Studio A" : "Studio B",
    duration: "45 min",
    trainer: "Sarah Johnson",
    status: i % 5 === 0 ? "Inactive" : "Active",
    description: `${name} class - details to be configured.`,
    trainers: [],
  });
});
classes = classes.slice(0, 18);

export function getClasses(): ClassSetup[] {
  return classes;
}

export function getClassById(id: string): ClassSetup | undefined {
  return classes.find((c) => c.id === id);
}

export function addClass(data: Omit<ClassSetup, "id" | "trainers">): ClassSetup {
  const newClass: ClassSetup = {
    ...data,
    id: String(Date.now()),
    trainers: [],
  };
  classes = [newClass, ...classes];
  return newClass;
}

export function updateClass(id: string, data: Omit<ClassSetup, "id" | "trainers">): ClassSetup | undefined {
  const idx = classes.findIndex((c) => c.id === id);
  if (idx === -1) return undefined;
  classes[idx] = { ...classes[idx], ...data };
  return classes[idx];
}

export function deleteClass(id: string): void {
  classes = classes.filter((c) => c.id !== id);
}

export function addTrainerToClass(classId: string, trainer: Omit<ClassTrainer, "id">): ClassTrainer | undefined {
  const cls = classes.find((c) => c.id === classId);
  if (!cls) return undefined;
  const newTrainer: ClassTrainer = { ...trainer, id: String(Date.now()) };
  cls.trainers = [...cls.trainers, newTrainer];
  return newTrainer;
}

export function removeTrainerFromClass(classId: string, trainerId: string): void {
  const cls = classes.find((c) => c.id === classId);
  if (!cls) return;
  cls.trainers = cls.trainers.filter((t) => t.id !== trainerId);
}

export const LOCATIONS = ["Studio A", "Studio B", "Studio C", "Court 1"];
export const TRAINERS = ["Sarah Johnson", "Mike Chen", "Lisa Park", "David Kim"];
