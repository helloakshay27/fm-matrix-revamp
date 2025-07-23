import { z } from 'zod';

export const buildingSchema = z.object({
  name: z.string().min(1, 'Building name is required').max(100, 'Building name must be less than 100 characters'),
  site_id: z.string().min(1, 'Site selection is required'),
  other_detail: z.string().optional(),
  has_wing: z.boolean().default(false),
  has_floor: z.boolean().default(false),
  has_area: z.boolean().default(false),
  has_room: z.boolean().default(false),
  active: z.boolean().default(true),
});

export type BuildingFormData = z.infer<typeof buildingSchema>;