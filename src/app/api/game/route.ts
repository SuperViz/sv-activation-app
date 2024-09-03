import { NextRequest, NextResponse } from "next/server";
import { db } from '@/lib/prisma'
import { validateRequestBody } from "@/lib/zod/validate-body";
import { z } from "zod";
import { ElementDTO } from './dto/generate-element';
import { IElement } from '../../../../types.game';
import { createHash } from 'crypto';
import { publishEvent } from '@/app/services/publishEvent';
import { ActivationType } from '@/global/global.types';

function getUniqueID(elementA: string, elementB: string): string {
  let id = [elementA, elementB].sort().join("").trim();
  return createHash('sha256').update(id).digest('hex');
}

async function combineElements(elementA: string, elementB: string): Promise<IElement | null> {
  const AZURE_OPEN_AI = process.env.AZURE_OPEN_AI as string;
  const task = `TAREFA: Combine ${elementA} e ${elementB} para criar um novo elemento. Tente manter o elemento o mais simples e realista possível. Se dois elementos básicos forem combinados, você deve priorizar a criação de uma nova coisa a partir disso, em vez de simplesmente combinar as palavras. Exemplo: Terra + Agua = Planta. Você pode usar um dos inputs como output, caso precise. Dois itens iguais devem resultar em uma versão maior desse item. Exemplo: Terra + Terra: Sistema Solar. Se o elemento não houver combinação possível, use uma tecnologia com nome parecido, Exemplo: Terra + Bug = "Terraform". Sua resposta deve ser o nome do novo elemento e deve conter SOMENTE UM emoji para representar o elemento. Nomes de tecnologias, empresas, jargões em inglês, buzzwords são bem vindas. Ao criar nomes de techs, seja em inglês. Exemplo: Desenvolvedor + Café =  Bug. Sua saída deve estar em formato json para ser analisada. Formato: {new_element: "nome", emoji: "emoji"}`

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
      temperature: 0.35,
      top_p: 0.85,
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

async function checkForExistingName(elementName: string): Promise<boolean> {
  const element = await db.element.findFirst({
    where: {
      name: elementName
    }
  })
  return !!element;
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

    const existName = await checkForExistingName(combination.name)

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

    if (existName) {
      return NextResponse.json({
        element: element,
        isNew: false
      })
    }

    const activation = await db.activation.findFirst({
      where: {
        name: ActivationType.GAME,
        userId: user.id
      }
    })

    if (!activation) {
      return NextResponse.json({ message: 'Activation Doesn\'t exists ' }, { status: 400 })
    }

    if (activation.quantity === 10) {
      return NextResponse.json({ message: 'Game Over' }, { status: 400 })
    }

    const quantity = activation.quantity + 1

    await db.activation.update({
      data: {
        quantity: quantity
      },
      where: {
        id: activation.id
      }
    })

    await Promise.all([
      publishEvent('default', 'activation.game.update', {
        userId: user.id,
        points: quantity
      }),

      publishEvent('game', 'new.element', {
        element,
        user,
        points: quantity
      })
    ])

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