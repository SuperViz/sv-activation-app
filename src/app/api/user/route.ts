import { db } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { CreateUserDTO } from "./dto/create-user.dto";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { GetUserDTO } from "./dto/get-user.dto";
import { validateRequestBody } from "@/lib/zod/validate-body";
import { z } from "zod";
import { EditUserDTO } from "@/app/api/user/dto/edit-user.dto";
import { UpdateUserDTO } from "./dto/update-user.dto";

export async function POST(request: NextRequest): Promise<NextResponse> {

  try {
    const body = await request.text();
    const parsedBody = validateRequestBody<z.infer<typeof CreateUserDTO>>(
      CreateUserDTO,
      body
    );

    if (!parsedBody?.success) {
      return parsedBody.response;
    }

    const { name, email } = parsedBody.response;

    const user = await db.user.create({
      data: {
        name,
        email,
      },
    });

    return NextResponse.json(
      { message: "User Created", data: { user } },
      { status: 201 }
    );
  } catch (error) {
    console.log(error);

    if (error instanceof PrismaClientKnownRequestError) {
      return NextResponse.json(
        { message: "User email already exists" },
        { status: 409, statusText: "Conflict" }
      );
    }

    return NextResponse.json(
      {},
      {
        status: 500,
        statusText: "Internal Server Error",
      }
    );
  }
}

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const params = Object.fromEntries(request.nextUrl.searchParams);
    const validationResponse = GetUserDTO.safeParse(params);

    if (!validationResponse.success) {
      const { errors } = validationResponse.error;

      return NextResponse.json(
        {
          message: "Bad request",
          errors,
        },
        {
          status: 400,
          statusText: "Bad Request",
        }
      );
    }

    const { email } = validationResponse.data;

    const user = await db.user.findUnique({
      where: {
        email,
      },
      include: {
        activations: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404, statusText: "Not Found" }
      );
    }

    return NextResponse.json(
      { message: "Success", data: { user } },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);

    return NextResponse.json(
      {},
      {
        status: 500,
        statusText: "Internal Server Error",
      }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.text();
    const parsedBody = validateRequestBody<z.infer<typeof EditUserDTO>>(
      EditUserDTO,
      body
    );

    if (!parsedBody?.success) {
      return parsedBody.response;
    }

    const { email, discordUser, githubUser } = parsedBody.response;

    if (discordUser) {
      const user = await db.user.update({
        where: {
          email,
        },
        data: {
          discordUser,
        },
      });

      return NextResponse.json(
        { message: "Discord Added", data: { user } },
        { status: 201 }
      );
    }

    if (githubUser) {
      const user = await db.user.update({
        where: {
          email,
        },
        data: {
          githubUser,
        },
      });

      return NextResponse.json(
        { message: "GitHub Added", data: { user } },
        { status: 201 }
      );
    }
  } catch (error) {
    console.log(error);

    return NextResponse.json(
      {},
      {
        status: 500,
        statusText: "Internal Server Error",
      }
    );
  }
}

export async function PUT(request: NextRequest): Promise<NextResponse> {
  const body = await request.json();
  const validateRequestBody = UpdateUserDTO.safeParse(body);

  if (!validateRequestBody.success) {
    const { errors } = validateRequestBody.error;

    return NextResponse.json(
      {
        message: "Bad request",
        errors,
      },
      {
        status: 400,
        statusText: "Bad Request",
      }
    );
  }

  const email = validateRequestBody.data.email;
  const content = validateRequestBody.data;

  const user = await db.user.update({
    where: {
      email,
    },
    data: {
      ...content,
    },
  });

  return NextResponse.json(
    { message: "User updated", data: { user } },
    { status: 200 }
  );
}

export const fetchCache = 'force-no-store'
export const revalidate = 0;
