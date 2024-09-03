import { NextRequest, NextResponse } from "next/server";
import { db } from '@/lib/prisma'
import { validateRequestBody } from "@/lib/zod/validate-body";
import { DiscordWebhookBodySchema } from "./discord.dto";
import { z } from "zod";
import { ActivationType } from "@/global/global.types";
import { publishEvent } from '@/app/services/publishEvent';


export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.text()
    const validatedBody = validateRequestBody<z.infer<typeof DiscordWebhookBodySchema>>(DiscordWebhookBodySchema, body)

    if (!validatedBody.success) {
      return validatedBody.response
    }

    const { globalname, username } = validatedBody.response

    const user = await db.user.findFirst({
      where: {
        OR: [
          {
            discordUser: username
          },
          {
            discordUser: globalname
          }
        ]
      }
    })

    if (!user) {
      return NextResponse.json({ message: 'User Doesn\'t exists ' }, { status: 200 })
    }

    const activation = await db.activation.findFirst({
      where: {
        name: ActivationType.DISCORD,
        userId: user.id
      }
    })

    if (!activation) {
      return NextResponse.json({ message: 'Activation Doesn\'t exists ' }, { status: 200 })
    }

    await db.activation.update({
      data: {
        completed: true
      },
      where: {
        id: activation.id
      }
    })

    await publishEvent('default', 'activation.complete', {
      userId: user.id,
      activation: ActivationType.DISCORD
    })


    return NextResponse.json({}, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 })
  }
}