import { z } from "zod";

export const transportVehicleSchema = z.object({
  // Kept as a string for the select; converted to a number on submit.
  // Only sent on create — the update payload has no driver_id.
  driver_id: z.string().min(1, "Driver is required"),
  car_model_name: z
    .string()
    .trim()
    .min(1, "Car model is required")
    .max(100, "Car model must be 100 characters or less"),
  registration_number: z
    .string()
    .trim()
    .min(1, "Registration number is required")
    .regex(/^[A-Z0-9]{4,15}$/, "Use 4–15 letters and digits, e.g. MH12AB1234"),
  colour: z
    .string()
    .trim()
    .min(1, "Colour is required")
    .max(30, "Colour must be 30 characters or less"),
  seats: z
    .string()
    .trim()
    .min(1, "Seats is required")
    .refine((value) => /^\d+$/.test(value) && Number(value) >= 1 && Number(value) <= 60, "Seats must be between 1 and 60"),
  fuel_type: z.string().min(1, "Fuel type is required"),
});

export type TransportVehicleFormData = z.infer<typeof transportVehicleSchema>;

export const transportVehicleDefaultValues: TransportVehicleFormData = {
  driver_id: "",
  car_model_name: "",
  registration_number: "",
  colour: "",
  seats: "",
  fuel_type: "",
};
