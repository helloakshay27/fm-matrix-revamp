import { z } from "zod";

export const transportSupplierSchema = z.object({
  company_name: z
    .string()
    .trim()
    .min(1, "Company name is required")
    .max(150, "Company name must be 150 characters or less"),
  email: z
    .string()
    .trim()
    .max(100, "Email must be 100 characters or less")
    .refine(
      (value) => !value || z.email().safeParse(value).success,
      "Enter a valid email address (e.g. name@example.com)"
    ),
  // Indian mobile numbers: 10 digits starting with 6-9.
  mobile1: z
    .string()
    .trim()
    .refine((value) => !value || /^\d{10}$/.test(value), "Mobile number must be exactly 10 digits"),
  address: z.string().trim(),
  city: z
    .string()
    .trim()
    .refine((value) => !value || /^[A-Za-z\s]+$/.test(value), "City can contain only letters and spaces"),
  state: z
    .string()
    .trim()
    .refine((value) => !value || /^[A-Za-z\s]+$/.test(value), "State can contain only letters and spaces"),
  pincode: z
    .string()
    .trim()
    .refine((value) => !value || /^\d{6}$/.test(value), "Pincode must be exactly 6 digits"),
});

export type TransportSupplierFormData = z.infer<typeof transportSupplierSchema>;

export const transportSupplierDefaultValues: TransportSupplierFormData = {
  company_name: "",
  email: "",
  mobile1: "",
  address: "",
  city: "",
  state: "",
  pincode: "",
};
