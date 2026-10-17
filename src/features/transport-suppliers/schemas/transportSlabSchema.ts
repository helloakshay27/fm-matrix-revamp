import { z } from "zod";
import type {
  CreateTransportSlabPayload,
  TransportSlab,
  UpdateTransportSlabPayload,
} from "../types/transportSlab";

const DECIMAL = /^\d+(\.\d+)?$/;
const INTEGER = /^\d+$/;

// Form fields are strings (what the inputs produce); toCreateSlabPayload
// converts them to the numbers/hour-minute pairs the API expects.
export const transportSlabSchema = z
  .object({
    rate_basis: z.string().min(1, "Rate basis is required"),
    rate_amount: z
      .string()
      .trim()
      .min(1, "Rate amount is required")
      .refine((value) => DECIMAL.test(value) && Number(value) > 0, "Enter a valid amount greater than 0"),
    max_rides_per_day: z
      .string()
      .trim()
      .refine((value) => !value || INTEGER.test(value), "Enter a whole number"),
    max_km_per_day: z
      .string()
      .trim()
      .refine((value) => !value || DECIMAL.test(value), "Enter a valid number"),
    effective_from: z.string().min(1, "Effective from date is required"),
    effective_to: z.string(),
    available_24_7: z.boolean(),
    // "HH:MM" from <input type="time">; only used when not available 24/7.
    start_time: z.string(),
    end_time: z.string(),
  })
  .superRefine((values, ctx) => {
    // ISO dates (YYYY-MM-DD) compare correctly as strings.
    if (values.effective_to && values.effective_from && values.effective_to < values.effective_from) {
      ctx.addIssue({
        code: "custom",
        path: ["effective_to"],
        message: "Effective to must be on or after effective from",
      });
    }
    if (!values.available_24_7) {
      if (!values.start_time) {
        ctx.addIssue({ code: "custom", path: ["start_time"], message: "Start time is required" });
      }
      if (!values.end_time) {
        ctx.addIssue({ code: "custom", path: ["end_time"], message: "End time is required" });
      }
      if (values.start_time && values.end_time && values.start_time === values.end_time) {
        ctx.addIssue({
          code: "custom",
          path: ["end_time"],
          message: "End time must differ from start time",
        });
      }
    }
  });

export type TransportSlabFormData = z.infer<typeof transportSlabSchema>;

export const transportSlabDefaultValues: TransportSlabFormData = {
  rate_basis: "km",
  rate_amount: "",
  max_rides_per_day: "",
  max_km_per_day: "",
  effective_from: "",
  effective_to: "",
  available_24_7: true,
  start_time: "",
  end_time: "",
};

const splitTime = (time: string) => {
  const [hour, minute] = time.split(":").map(Number);
  return { hour, minute };
};

export const toCreateSlabPayload = (values: TransportSlabFormData): CreateTransportSlabPayload => {
  const payload: CreateTransportSlabPayload = {
    rate_basis: values.rate_basis,
    rate_amount: Number(values.rate_amount),
    effective_from: values.effective_from,
    available_24_7: values.available_24_7,
  };
  if (values.max_rides_per_day) payload.max_rides_per_day = Number(values.max_rides_per_day);
  if (values.max_km_per_day) payload.max_km_per_day = Number(values.max_km_per_day);
  if (values.effective_to) payload.effective_to = values.effective_to;
  if (!values.available_24_7) {
    const start = splitTime(values.start_time);
    const end = splitTime(values.end_time);
    payload.availability_start_hour = start.hour;
    payload.availability_start_min = start.minute;
    payload.availability_end_hour = end.hour;
    payload.availability_end_min = end.minute;
  }
  return payload;
};

export const toUpdateSlabPayload = (values: TransportSlabFormData): UpdateTransportSlabPayload => {
  const created = toCreateSlabPayload(values);
  return {
    ...created,
    max_rides_per_day: created.max_rides_per_day ?? null,
    max_km_per_day: created.max_km_per_day ?? null,
    effective_to: created.effective_to ?? null,
    availability_start_hour: created.availability_start_hour ?? null,
    availability_start_min: created.availability_start_min ?? null,
    availability_end_hour: created.availability_end_hour ?? null,
    availability_end_min: created.availability_end_min ?? null,
  };
};

const toTimeString = (hour: number | null, minute: number | null) =>
  hour === null ? "" : `${String(hour).padStart(2, "0")}:${String(minute ?? 0).padStart(2, "0")}`;

// Decimal strings like "800.0" are shown as "800" in the form.
const toNumberString = (value: string | number | null) => {
  if (value === null || value === "") return "";
  const number = Number(value);
  return Number.isNaN(number) ? String(value) : String(number);
};

export const toSlabFormValues = (slab: TransportSlab): TransportSlabFormData => ({
  rate_basis: slab.rate_basis ?? "km",
  rate_amount: toNumberString(slab.rate_amount),
  max_rides_per_day: toNumberString(slab.max_rides_per_day),
  max_km_per_day: toNumberString(slab.max_km_per_day),
  effective_from: slab.effective_from ?? "",
  effective_to: slab.effective_to ?? "",
  available_24_7: slab.available_24_7,
  start_time: toTimeString(slab.availability_start_hour, slab.availability_start_min),
  end_time: toTimeString(slab.availability_end_hour, slab.availability_end_min),
});
