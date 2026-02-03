import { z } from "zod";

export const TravelerSchema = z.object({
  id: z.number().optional(),
  created_at: z.any().optional(), 
  email: z.string().email().nullable().optional(),
  name: z.string().nullable(),
  password: z.string().nullable().optional(),
  role: z.string().nullable(),
  status: z.string().optional(),
  target: z.string().optional(),
  limit: z.string().optional(),
  reviewer: z.string().optional(),
});

// Type inference
export type Traveler = z.infer<typeof TravelerSchema>;
