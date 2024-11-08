import { NextRequest, NextResponse } from "next/server";
import { CreateActivationDTO } from "./dto/create-activation.dto";
import { db } from '@/lib/prisma'
import { validateRequestBody } from "@/lib/zod/validate-body";
import { z } from "zod";
import { publishEvent } from '@/app/services/publishEvent';

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.text()
    const parsedBody = validateRequestBody<z.infer<typeof CreateActivationDTO>>(CreateActivationDTO, body)

    if (!parsedBody?.success) {
      return parsedBody.response
    }

    const { name, userEmail } = parsedBody.response

    const user = await db.user.findUnique({
      where: {
        email: userEmail
      }
    })

    if (!user) {
      return NextResponse.json(
        {
          message: 'User not found',
        },
        {
          status: 404,
          statusText: 'Not Found'
        }
      )
    }

    const list = await db.activation.findMany({
      where: {
        userId: user.id,
      }
    })

    if (list.some((activation) => activation.name === name)) {
      return NextResponse.json({
        message: 'Activation already exists',
      }, {
        status: 409,
        statusText: 'Conflict'
      })
    }

    const activation = await db.activation.create({
      data: {
        name,
        completed: false,
        userId: user.id,
      }
    })

    await publishEvent('default', 'activation.start', {
      userId: user.id,
      activation: activation.name,
    })

    return NextResponse.json(
      {
        message: 'Activation created',
        data: [...list, activation]
      },
      {
        status: 201
      })
  } catch (error) {
    console.log(error)

    return NextResponse.json({}, {
      status: 500,
      statusText: 'Internal Server Error'
    })
  }
}

export const fetchCache = 'force-no-store'
export const revalidate = 0;