import { db } from '@/lib/prisma'
import { NextRequest, NextResponse } from "next/server";
import { IUser } from '../../../../types';

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const users = await db.user.findMany({ include: { activations: true } })

    if (!users) {
      return NextResponse.json(
        { message: 'Users not found' },
        { status: 404, statusText: 'Not Found' }
      )
    }

    return NextResponse.json({ message: 'Success', data: { users } }, { status: 200 })
  } catch (error) {
    console.log(error)

    return NextResponse.json({}, {
      status: 500,
      statusText: 'Internal Server Error'
    })
  }
}
