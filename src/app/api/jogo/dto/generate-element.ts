import { z } from 'zod'

export const ElementDTO = z.object({
  elementA: z.string().min(1),
  elementB: z.string().min(1),
  email: z.string().email(),
})