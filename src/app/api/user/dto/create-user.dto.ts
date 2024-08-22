import { z } from 'zod'

export const CreateUserDTO = z.object({
  name: z.string(),
  email: z.string().email(),
  discordUser: z.string()
})