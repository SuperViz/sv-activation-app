import { NextRequest, NextResponse } from "next/server";
import { db } from '@/lib/prisma'
import { validateRequestBody } from "@/lib/zod/validate-body";
import { z } from "zod";
import { ElementDTO } from './dto/generate-element';
import { IElement } from '../../../../types.game';
import { createHash } from 'crypto';
import { publishEvent } from '@/app/services/publishEvent';

function getUniqueID(elementA: string, elementB: string): string {
  let id = [elementA, elementB].sort().join("").trim();
  return createHash('sha256').update(id).digest('hex');
}

async function combineElements(elementA: string, elementB: string): Promise<IElement | null> {
  const AZURE_OPEN_AI = process.env.AZURE_OPEN_AI as string;
  const task = `TAREFA: Combine ${elementA} e ${elementB} para criar um novo elemento. Tente manter o elemento o mais simples e realista possível e, preferencialmente com apenas 1 palavra. Se dois elementos básicos forem combinados, você deve priorizar a criação de uma nova coisa a partir disso, em vez de simplesmente combinar as palavras. Exemplo: Terra + Terra = Sistema Solar. Você pode usar um dos inputs como output, mas apenas se não houver outros elementos. Dois itens iguais devem resultar em uma versão maior desse item, se aplicável. Sua resposta deve ser o nome do novo elemento e DEVE conter um e apenas um emoji para representar o elemento. A resposta SOMENTE 1 emoji. Exemplo: Fogo + Água = 💨 Vapor. Sua saída deve estar em formato json para ser analisada. Formato: {new_element: "nome", emoji: "emoji"}`

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
          content: 'Você é um jogo divertido para desenvolvedores, piadas da área de tecnologia e desenvolvimento são bem vindas!'
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
    const totalPoints = 4 // TODO: pegar quantidade de pontos

    await publishEvent('default', 'new.element', {
      name: 'activation.game.update',
      data: {
        userId: user.id,
        points: totalPoints
      }
    })

    await publishEvent('game', 'new.element', {
      name: 'new.element',
      data: {
        element,
        userName: user.name
      }
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