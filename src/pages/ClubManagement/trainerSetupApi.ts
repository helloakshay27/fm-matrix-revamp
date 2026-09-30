import type { TrainerSetup } from "./trainerSetupMockData";

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
  const slot = payload.availabilitySlots?.[0];

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
    facility_slot_attributes: {
      start_hour: numericValue(slot?.startTime.hour),
      start_min: numericValue(slot?.startTime.minute),
      end_hour: numericValue(slot?.endTime.hour),
      end_min: numericValue(slot?.endTime.minute),
      concurrent_slots: numericValue(slot?.concurrentSlots),
      slot_by: numericValue(slot?.slotBy, 15),
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
    },
  };
};

export const buildTrainerFormData = (trainer: TrainerRequest, files: TrainerFiles) => {
  const formData = new FormData();

  Object.entries(trainer).forEach(([key, value]) => {
    if (key === "facility_slot_attributes" && value && typeof value === "object") {
      Object.entries(value).forEach(([nestedKey, nestedValue]) => {
        formData.append(`trainer[facility_slot_attributes][${nestedKey}]`, String(nestedValue));
      });
    } else if (value !== undefined && value !== null) {
      formData.append(`trainer[${key}]`, String(value));
    }
  });

  [files.image, files.certificate, files.contract].forEach((file) => {
    if (file) formData.append("attachments[]", file);
  });

  return formData;
};
