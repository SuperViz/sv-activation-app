import {IUserResponse} from "../../../types";
import {ActivationTypes} from "@prisma/client";

interface IGiveawayResponse {
  user: IUserResponse
  coupon: {
    userId: string
    activation: ActivationTypes
  }
}

export async function sortWinner(): Promise<IGiveawayResponse> {

  return await fetch(`/api/giveaway`, {
    method: 'POST',
    headers: {
      cache: "no-store",
    },
  })
    .then(async (res) => {
      return await res.json();
    })
}