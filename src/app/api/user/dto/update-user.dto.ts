import { z } from "zod";

export const UpdateUserDTO = z.object({
  name: z.string().min(3).optional(),
  email: z.string().email().optional(),
  timesRevoked: z.number().optional(),
});
