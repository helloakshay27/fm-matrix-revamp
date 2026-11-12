import type { TimeValue, TrainerAvailabilitySlot, TrainerSetup } from "./trainerSetupMockData";

export type TrainerFormPayload = Omit<TrainerSetup, "id" | "credentials"> & { email: string };
export type TrainerFiles = {
  image: File | null;
  certificate: File | null;
  contract: File | null;
};

type TrainerRequest = Record<string, unknown>;

const numericValue = (value: string | number | undefined, fallback = 0) => {
  if (value === undefined || value === "") return fallback;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

export const buildTrainerRequest = (payload: TrainerFormPayload): TrainerRequest => {
  // The form shows one set of booking rules for the whole trainer, but the backend stores them on every
  // slot row, so they are repeated on each row.
  const sharedBookingRules = {
    bookable_slot_count: numericValue(payload.bookableSlotsPerDay),
    book_before_day: numericValue(payload.bookingAllowedBefore?.day),
    book_before_hour: numericValue(payload.bookingAllowedBefore?.hour),
    book_before_min: numericValue(payload.bookingAllowedBefore?.minute),
    advance_booking_day: numericValue(payload.advanceBooking?.day),
    advance_booking_hour: numericValue(payload.advanceBooking?.hour),
    advance_booking_min: numericValue(payload.advanceBooking?.minute),
    cancel_day: numericValue(payload.canCancelBefore?.day),
    cancel_hour: numericValue(payload.canCancelBefore?.hour),
    cancel_min: numericValue(payload.canCancelBefore?.minute),
    max_bookings_per_user_per_day: numericValue(payload.facilityBookedTimes),
  };

  // One entry per "Facility Operational Timings" row. A saved row carries its id so the backend edits it in
  // place; a new row has none. An untouched new row (00:00 - 00:00) is ignored by the backend.
  const slotRows = (payload.availabilitySlots ?? []).map((slot) => ({
    ...(slot.id ? { id: slot.id } : {}),
    start_hour: numericValue(slot.startTime.hour),
    start_min: numericValue(slot.startTime.minute),
    break_start_hour: numericValue(slot.breakTimeStart?.hour),
    break_start_min: numericValue(slot.breakTimeStart?.minute),
    break_end_hour: numericValue(slot.breakTimeEnd?.hour),
    break_end_min: numericValue(slot.breakTimeEnd?.minute),
    end_hour: numericValue(slot.endTime.hour),
    end_min: numericValue(slot.endTime.minute),
    concurrent_slots: numericValue(slot.concurrentSlots),
    slot_by: numericValue(slot.slotBy, 15),
    ...sharedBookingRules,
  }));

  // Saved rows removed with the X button.
  const removedRows = (payload.removedAvailabilitySlotIds ?? []).map((id) => ({ id, _destroy: true }));
  const facilitySlots = [...slotRows, ...removedRows];

  return {
    first_name: payload.firstName ?? payload.name.split(/\s+/)[0] ?? "",
    last_name: payload.lastName ?? payload.name.split(/\s+/).slice(1).join(" "),
    mobile: payload.contactNumber,
    email: payload.email,
    ...(payload.emergencyContact ? { emergency_contact: payload.emergencyContact } : {}),
    specialization: payload.specialization,
    experience: payload.experience,
    trainer_type: "in_house",
    status: payload.status.toLowerCase(),
    user_roaster_id: payload.roster ?? "",
    user_shift_id: payload.shift ?? "",
    ...(facilitySlots.length > 0 ? { facility_slots_attributes: facilitySlots } : {}),
  };
};

// Flattens nested objects/arrays into the bracket keys Rails reads from multipart bodies, e.g.
// trainer[facility_slots_attributes][0][start_hour].
const appendNested = (formData: FormData, key: string, value: unknown) => {
  if (Array.isArray(value)) {
    value.forEach((item, index) => appendNested(formData, `${key}[${index}]`, item));
  } else if (value && typeof value === "object") {
    Object.entries(value).forEach(([nestedKey, nestedValue]) => appendNested(formData, `${key}[${nestedKey}]`, nestedValue));
  } else if (value !== undefined && value !== null) {
    formData.append(key, String(value));
  }
};

export const buildTrainerFormData = (trainer: TrainerRequest, files: TrainerFiles) => {
  const formData = new FormData();

  Object.entries(trainer).forEach(([key, value]) => appendNested(formData, `trainer[${key}]`, value));

  [files.image, files.certificate, files.contract].forEach((file) => {
    if (file) formData.append("attachments[]", file);
  });

  return formData;
};

const toMinutes = (time?: TimeValue) => numericValue(time?.hour) * 60 + numericValue(time?.minute);
const pad = (value: number) => String(value).padStart(2, "0");
const timeLabel = (minutes: number) => `${pad(Math.floor(minutes / 60))}:${pad(minutes % 60)}`;

// The same rules the backend enforces (it answers 422 otherwise), checked up front so the message can name
// the row. A row left at 00:00 - 00:00 is an unused row and is skipped, as is a break of 00:00 - 00:00.
export const validateAvailabilitySlots = (slots: TrainerAvailabilitySlot[]): string | null => {
  const used: { row: number; start: number; end: number }[] = [];

  for (const [index, slot] of slots.entries()) {
    const row = index + 1;
    const start = toMinutes(slot.startTime);
    const end = toMinutes(slot.endTime);
    if (start === 0 && end === 0) continue;

    if (end <= start) return `Row ${row}: end time must be after the start time`;

    const breakStart = toMinutes(slot.breakTimeStart);
    const breakEnd = toMinutes(slot.breakTimeEnd);
    if (breakStart > 0 || breakEnd > 0) {
      if (breakEnd <= breakStart) return `Row ${row}: break end must be after the break start`;
      if (breakStart < start || breakEnd > end) return `Row ${row}: the break must be within the start and end time`;
    }

    used.push({ row, start, end });
  }

  for (const [i, a] of used.entries()) {
    for (const b of used.slice(i + 1)) {
      if (a.start < b.end && b.start < a.end) {
        return `Row ${a.row} (${timeLabel(a.start)}-${timeLabel(a.end)}) overlaps row ${b.row} (${timeLabel(b.start)}-${timeLabel(b.end)})`;
      }
    }
  }

  return null;
};

// The backend answers validation failures with { errors: ["message", ...] } (422). Show them rather than
// a generic failure message.
export const getApiErrorMessage = (error: unknown, fallback: string): string => {
  const data = (error as { response?: { data?: any } } | undefined)?.response?.data;
  const errors = data?.errors;
  const detail =
    (Array.isArray(errors) && errors.length > 0 ? errors.map(String).join("; ") : undefined) ??
    (typeof errors === "string" && errors ? errors : undefined) ??
    (typeof data?.error === "string" && data.error ? data.error : undefined) ??
    (typeof data?.message === "string" && data.message ? data.message : undefined);
  return detail ? `${fallback}: ${detail}` : fallback;
};
