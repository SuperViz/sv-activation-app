import { z } from "zod";
import { StringToJSONSchema } from "./string-to-json";
import { NextResponse } from "next/server";

type ValidationResult<T> = { 
  success: false,
  response: NextResponse
} | {
  success: true,
  response: T
}

export function validateRequestBody<T>(schema: z.AnyZodObject, body: string): ValidationResult<T> {
  const validateBody = StringToJSONSchema.safeParse(body)

  if(!validateBody.success) { 
    const { errors } = validateBody.error

    return {
      success: false,
      response: NextResponse.json(
        {
          message: 'Bad request', 
          errors,
        }, 
        {
          status: 400,
          statusText: 'Bad Request'
        }
      )
    }
  }

  const validationResponse = schema.safeParse(validateBody.data)  

  if(!validationResponse.success) {
    const { errors } = validationResponse.error

    return {
      success: false,
      response: NextResponse.json(
        {
          message: 'Bad request', 
          errors,
        }, 
        {
          status: 400,
          statusText: 'Bad Request'
        }
      )
    }
  }

  return {
    success: true, 
    response: validationResponse.data as T
  }
}