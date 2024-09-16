import { z } from "zod";

export const EditUserDTO = z.object({
  email: z.string().email(),
  discordUser: z.string().min(3).optional(),
  githubUser: z.string().min(3).optional()
})