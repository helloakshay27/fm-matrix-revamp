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
    .refine((value) => !value || z.email().safeParse(value).success, "Enter a valid email"),
  mobile1: z
    .string()
    .trim()
    .refine((value) => !value || /^\d{10}$/.test(value), "Enter a valid 10-digit mobile number"),
  address: z.string().trim(),
  city: z.string().trim(),
  state: z.string().trim(),
  pincode: z
    .string()
    .trim()
    .refine((value) => !value || /^\d{6}$/.test(value), "Enter a valid 6-digit pincode"),
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
