import { NextRequest, NextResponse } from "next/server"
import { db } from '@/lib/prisma'
import { ActivationTypes } from "@prisma/client"


interface Coupon {
  userId: string
  activation: ActivationTypes
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const coupons: Coupon[] = []

    const activations = await db.activation.findMany({
      where: { 
        OR: [
          { completed: true }, 
          { quantity: { gt: 0 } }
        ]
      }
    })    
    
    activations.forEach((activation) => {
      // Each point is a coupon
      if(activation.quantity) {
        for(let i = 0; i < activation.quantity; i++) { 
          coupons.push({ activation: activation.name, userId: activation.userId })
        }
        return
      }

      // Each activation is a coupon
      coupons.push({ activation: activation.name, userId: activation.userId })
    })

    const WIINER_COUNT = 1
    let winnerCoupon

    for (let i = 0; i < WIINER_COUNT; i++) {
      if (coupons.length > 0) {
        const randomIndex = Math.floor(Math.random() * coupons.length)
        winnerCoupon = coupons.splice(randomIndex, 1)[0]
      }
    }

    const winnerUser = await db.user.findUnique({
      where: { 
        id: winnerCoupon?.userId
      }
    })
    

    return NextResponse.json({ user: winnerUser, coupon: winnerCoupon }, { status: 200 })
  } catch (error) {
    return NextResponse.json({}, {
      status: 500,
      statusText: 'Internal Server Error'
    })
  }
}

export const fetchCache = 'force-no-store'
export const revalidate = 0;