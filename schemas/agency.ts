import { z } from "zod";

export const AgencySchema = z.object({
  id: z.number().optional(),
  created_at: z.string(), 
  email: z.string().email().nullable().optional(),
  name: z.string().nullable(),
  role: z.string().nullable(),
  status: z.string().optional(),
  target: z.string().optional(),
  limit: z.string().optional(),
});

// Type inference
export type Agency = z.infer<typeof AgencySchema>;

// export type Agency = {
//   id: number
//   created_at: string
//   email: string | null
//   name: string | null
//   role: string | null
//   status?: string
//   target?: string
//   limit?: string
// }