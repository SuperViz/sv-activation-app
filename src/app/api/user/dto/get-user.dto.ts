import { z } from 'zod'

export const GetUserDTO = z.object({
  email: z.string().email()
})