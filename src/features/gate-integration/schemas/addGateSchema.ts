import { z } from "zod";

export const addGateSchema = z.object({
  site: z.string().optional(),
  user: z.string().optional(),
  tower: z.string().optional(),
  gateName: z.string().min(1, "Gate name is required"),
  gateDevice: z.string().min(1, "Gate device is required"),
});

export type AddGateFormData = z.infer<typeof addGateSchema>;
