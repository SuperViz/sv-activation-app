import { NextResponse } from "next/server";

export async function GET(): Promise<NextResponse> {
  try {
    return await fetch(
      `https://api.superviz.com/realtime/participants/game`,
      {
        method: "GET",
        headers: {
          secret: process.env.SECRET_KEY as string,
          client_id: process.env.CLIENT_ID as string,
          cache: "no-store",
        },
      }
    )
      .then((res) => {
        return res.json();
      })
      .then((res) => {
        return NextResponse.json(res.map((user: any) => user.id));
      })
      .catch((err) => {
        return NextResponse.json([]);
      });
  } catch (error) {

    return NextResponse.json(
      {},
      {
        status: 500,
        statusText: "Internal Server Error",
      }
    );
  }
}

export const fetchCache = "force-no-store";
export const revalidate = 0;
