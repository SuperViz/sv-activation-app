import { z } from "zod";
import { ActivationType } from '@/global/global.types'

export const CreateActivationDTO = z.object({
  name: z.nativeEnum(ActivationType),
  userEmail: z.string().email()
})