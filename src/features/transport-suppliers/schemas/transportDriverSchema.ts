import { z } from "zod";

export const transportDriverSchema = z.object({
  firstname: z
    .string()
    .trim()
    .min(1, "First name is required")
    .max(50, "First name must be 50 characters or less"),
  lastname: z.string().trim().max(50, "Last name must be 50 characters or less"),
  // Drivers are user accounts — every existing driver has an email.
  email: z
    .string()
    .trim()
    .min(1, "Email is required")
    .refine((value) => z.email().safeParse(value).success, "Enter a valid email"),
  mobile: z
    .string()
    .trim()
    .refine((value) => !value || /^\d{10}$/.test(value), "Enter a valid 10-digit mobile number"),
  // Location is only shown (and sent) when editing a driver.
  latitude: z
    .string()
    .trim()
    .refine((value) => !value || isInRange(value, 90), "Latitude must be between -90 and 90"),
  longitude: z
    .string()
    .trim()
    .refine((value) => !value || isInRange(value, 180), "Longitude must be between -180 and 180"),
}).superRefine((values, ctx) => {
  // A lone latitude or longitude is meaningless — require both or neither.
  if (values.latitude && !values.longitude) {
    ctx.addIssue({ code: "custom", path: ["longitude"], message: "Longitude is required with latitude" });
  }
  if (values.longitude && !values.latitude) {
    ctx.addIssue({ code: "custom", path: ["latitude"], message: "Latitude is required with longitude" });
  }
});

function isInRange(value: string, limit: number) {
  if (!/^-?\d+(\.\d+)?$/.test(value)) return false;
  const number = Number(value);
  return number >= -limit && number <= limit;
}

export type TransportDriverFormData = z.infer<typeof transportDriverSchema>;

export const transportDriverDefaultValues: TransportDriverFormData = {
  firstname: "",
  lastname: "",
  email: "",
  mobile: "",
  latitude: "",
  longitude: "",
};
