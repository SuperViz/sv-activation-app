import { NextRequest, NextResponse } from "next/server";


export async function POST(request: NextRequest): Promise<NextResponse> {
  const body = await request.text()
  const parsed = JSON.parse(body)

  console.log(parsed)

  return NextResponse.json({}, { status: 200})
}