import { z } from 'zod';

export const wingSchema = z.object({
  name: z.string().min(1, 'Wing name is required'),
  building_id: z.string().min(1, 'Building selection is required'),
  active: z.boolean().default(true),
});

export type WingFormData = z.infer<typeof wingSchema>;