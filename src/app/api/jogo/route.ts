import { NextRequest, NextResponse } from "next/server";
import { db } from '@/lib/prisma'
import { validateRequestBody } from "@/lib/zod/validate-body";
import { z } from "zod";
import { ElementDTO } from './dto/generate-element';
import { IElement } from '../../../../types.game';
import { createHash } from 'crypto';

function getUniqueID(elementA: string, elementB: string): string {
  let id = [elementA, elementB].sort().join("").trim();
  return createHash('sha256').update(id).digest('hex');
}

function combineElements(elementA: string, elementB: string): IElement {
  return {
    emoji: '🔥',
    name: 'Fire',
    id: getUniqueID(elementA, elementB)
  }
}

async function checkForExistingCombination(elementA: string, elementB: string): Promise<IElement | null> {
  const id = getUniqueID(elementA, elementB);
  const element = await db.element.findUnique({
    where: {
      id: id
    }
  })
  return element;
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  const DEVELOPER_KEY = process.env.NEXT_PUBLIC_DEVELOPER_KEY as string;

  try {
    const body = await request.text()
    const parsedBody = validateRequestBody<z.infer<typeof ElementDTO>>(ElementDTO, body)

    if (!parsedBody?.success) {
      return parsedBody.response
    }

    const { elementA, elementB, email } = parsedBody.response

    const user = await db.user.findUnique({
      where: {
        email: email
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

    const existing = await checkForExistingCombination(elementA, elementB)
    if (existing) {
      return NextResponse.json({
        element: existing,
        isNew: false
      })
    }

    const combination = combineElements(elementA, elementB)
    if (!combination) {
      return NextResponse.json({}, {
        status: 500,
        statusText: 'Combination didnt work'
      })
    }

    const element = await db.element.create({
      data: {
        id: combination.id,
        name: combination.name,
        emoji: combination.emoji,
        elementA: elementA,
        elementB: elementB,
        userId: email
      }
    })

    // TODO: Add point to user

    await fetch('https://nodeapi.superviz.com/realtime/superviz_dashboard/default/publish', {
      method: 'POST',
      headers: {
        'apiKey': DEVELOPER_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'activation',
        data: {
          // TODO: Add data here
        }
      })
    })

    await fetch('https://nodeapi.superviz.com/realtime/superviz_dashboard/game/publish', {
      method: 'POST',
      headers: {
        'apiKey': DEVELOPER_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'new.element',
        data: {
          element,
          participant: user.name
        }
      })
    })

    return NextResponse.json({
      element: element,
      isNew: true
    })
  } catch (error) {
    console.log(error)

    return NextResponse.json({}, {
      status: 500,
      statusText: 'Internal Server Error'
    })
  }
}