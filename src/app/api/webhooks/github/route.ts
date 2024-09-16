import { NextRequest, NextResponse } from "next/server";
import { db } from '@/lib/prisma'
import { ActivationType } from "@/global/global.types";
import { publishEvent } from '@/app/services/publishEvent';

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.text()
    const parsed = JSON.parse(body)

    const githubUser = parsed.sender.login
    const completed = parsed.action === 'created'

    const user = await db.user.findFirst({
      where: {
        githubUser
      }
    })

    if (!user) {
      return NextResponse.json({ message: 'User Doesn\'t exists ' }, { status: 200 })
    }

    const activation = await db.activation.findFirst({
      where: {
        name: ActivationType.GITHUB,
        userId: user.id
      }
    })

    if (!activation) {
      return NextResponse.json({ message: 'Activation Doesn\'t exists ' }, { status: 200 })
    }

    await db.activation.update({
      data: {
        completed
      },
      where: {
        id: activation.id
      }
    })

    await publishEvent('default', 'activation.complete', {
      userId: user.id,
      activation: ActivationType.GITHUB
    })

    return NextResponse.json({ message: 'Success' }, { status: 200 })
  } catch (error) {
    console.log(error)

    return NextResponse.json({}, {
      status: 500,
      statusText: 'Internal Server Error'
    })
  }
}