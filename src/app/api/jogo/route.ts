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

async function combineElements(elementA: string, elementB: string): Promise<IElement | null> {
  const AZURE_OPEN_AI = process.env.AZURE_OPEN_AI as string;
  const task = `TASK: Combine ${elementA} and ${elementB} to create a new element. Try to keep the element as simple and realistic as possible and only 1 word if possible as well. If two basic elements are combined, you should prioritize making a new thing out of that, rather than simply combining the words. Example: Earth + Earth = Solar System. You are allowed to use one of the inputs as the output, but only if there are no other elements. Two of the same item should output a larger version of that item if applicable. Your response should be the name of the new element and MUST contain one and only one emoji to represent the element. The response should never have less than or more than 1 emoji. Example: Fire + Water = 💨 Steam. Your output should be in json format to be parsed. Format: {new_element: "name", emoji: "emoji"}`

  const response = await fetch('https://sv-activation.openai.azure.com/openai/deployments/sv-activation/chat/completions?api-version=2024-02-15-preview', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'api-key': AZURE_OPEN_AI
    },
    body: JSON.stringify({
      messages: [
        {
          role: 'system',
          content: 'You are a funny game for developers.'
        },
        {
          role: 'user',
          content: task
        }
      ],
      temperature: 0.7,
      top_p: 0.95,
      max_tokens: 100
    })
  })

  const data = await response.json()
  const sanitazed = data.choices[0].message.content.replace(/```json\n/g, '').replace(/\n```/g, '')
  const parsed = JSON.parse(sanitazed)
  const newElement = {
    emoji: parsed.emoji,
    name: parsed.new_element,
    id: getUniqueID(elementA, elementB)
  }
  return newElement

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

    const combination = await combineElements(elementA, elementB)
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
        userId: user.id
      }
    })

    // TODO: Add point to user

    // await fetch('https://nodeapi.superviz.com/realtime/superviz_dashboard/default/publish', {
    //   method: 'POST',
    //   headers: {
    //     'apiKey': DEVELOPER_KEY,
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify({
    //     name: 'activation',
    //     data: {
    //       // TODO: Add data here
    //     }
    //   })
    // })

    // await fetch('https://nodeapi.superviz.com/realtime/superviz_dashboard/game/publish', {
    //   method: 'POST',
    //   headers: {
    //     'apiKey': DEVELOPER_KEY,
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify({
    //     name: 'new.element',
    //     data: {
    //       element,
    //       participant: user.name
    //     }
    //   })
    // })

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