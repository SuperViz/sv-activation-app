import { z } from "zod"

export const DiscordWebhookBodySchema = z.object({
  globalname: z.string(),
  username: z.string()
})