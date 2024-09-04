import { NextRequest, NextResponse } from "next/server";
import { db } from '@/lib/prisma'
import { validateRequestBody } from "@/lib/zod/validate-body";
import { z } from "zod";
import { ElementDTO } from './dto/generate-element';
import { IElement } from '../../../../types.game';
import { createHash } from 'crypto';
import { publishEvent } from '@/app/services/publishEvent';
import { ActivationType } from '@/global/global.types';
import { InitialElements } from '@/data/elementsData';

function getUniqueID(elementA: string, elementB: string): string {
  let id = [elementA, elementB].sort().join("").trim();
  return createHash('sha256').update(id).digest('hex');
}

async function combineElements(elementA: string, elementB: string): Promise<IElement | null> {
  const AZURE_OPEN_AI = process.env.AZURE_OPEN_AI as string;
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
          content: 'Você é um jogo, semelhante ao Doodle God, divertido para programadores e pessoas com conhecimento em tecnologia, especialmente front-end developers.\n\nVocê irá receber o item A e o item B. Seu papel é combinar estes dois items especificados para criar novas coisas, como vida, objetos, frameworks e etc. Nomes de tecnologias, empresas, jargões, buzzwords são bem vindas!\n\nPara isso use as regras do GERADOR e do SELECIONADOR. Inicie pelo GERADOR.\n\nSELECIONADOR: \nFaça isso com a em sua base de conhecimento em inglês e em português brasileiro. Sendo o resultado favorito, o mais próximo de itens que já existem, preferencialmente relacionados com developer tools, frontend. Caso o resultado contenha de forma literal A ou B, utilize o mesmo critério para selecionar novamente uma das opções. Caso não seja algo relacionado a programação e ao contexto do público alvo do jogo, procure soluções mais simples.\n\nGERADOR: \nGere termos que sejam um substantivo simples, e em último caso que seja um substantivo composto. O resultado dos termos gerados devem tender a ser uma versão mais ampla. Evitando sempre repetição de A ou B no resultado.\n\nO ideal é que seja gerado nas seguintes formas de combinações: \n- da EVOLUÇÃO de A e B (Ex.: Terra + Agua = Planta) - Gere 8 possibilidades. Evite repetir A ou B.\n- do SIGNIFICADO de A e B (Ex.: Dinheiro + Empresa = Banco) - Gere 8 possibilidades.\n- do CONCEITO de A e B (Ex.: Nuvem + Livro = eBook) - Gere 8 possibilidades. Evite repetir A ou B.\n- Se A e B forem iguais, deve também gerar 8 possibilidades de uma versão maior desses itens. Exemplo: Terra + Terra: Sistema Solar.\n\nEscolha 3 favoritos entre cada forma, utilizando o SELECIONADOR. Dentre a lista de favoritos escolha um resultado final.\n\n- Se resultado final não atender a algum item que REALMENTE, escolha outro entre os favoritos. No caso de nenhum existir, use ou A ou B.\n\n Sua saída deve estar em formato json para ser analisada e incluir somente o resultado final. \n\nFormato: {new_element: \"nome\", emoji: \"emoji\"}'
        },
        {
          role: 'user',
          content: `${elementA} ${elementB}`
        }
      ],
      temperature: 0.40,
      top_p: 0.60,
      max_tokens: 250
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
  if (InitialElements.some(el => el.name === elementName)) {
    return true;
  }

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

    const activation = await db.activation.findFirst({
      where: {
        name: ActivationType.GAME,
        userId: user.id
      }
    })

    if (!activation) {
      return NextResponse.json({ message: 'Activation Doesn\'t exists ' }, { status: 400 })
    }

    const isOver = activation.quantity >= 10
    if (isOver) {
      return NextResponse.json({ isOver: true, points: activation.quantity })
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
    } else {
      const quantity = activation.quantity + 1
      await db.activation.update({
        data: {
          quantity: quantity,
          completed: isOver
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
        isNew: true,
        isOver: quantity >= 10,
        points: quantity
      })
    }
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