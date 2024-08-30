import { NextRequest, NextResponse } from "next/server";
import { CreateActivationDTO } from "./dto/create-activation.dto";
import { db } from '@/lib/prisma'
import { validateRequestBody } from "@/lib/zod/validate-body";
import { z } from "zod";

// TODO: Verificar necessidade deste endpoint
export async function POST(request: NextRequest): Promise<NextResponse> {
  const DEVELOPER_KEY = process.env.NEXT_PUBLIC_DEVELOPER_KEY as string;

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

    await fetch('https://nodeapi.superviz.com/realtime/superviz_dashboard/default/publish', {
      method: 'POST',
      headers: {
        'apiKey': DEVELOPER_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'activation',
        data: {
          activation,
        }
      })
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