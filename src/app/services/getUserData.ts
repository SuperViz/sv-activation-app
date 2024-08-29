import {IUser} from "../../../types";

export default async function getUserData(email: string): Promise<IUser> {
  const params = new URLSearchParams({ email: email})
  
  return await fetch(`/api/user?${params}`)
    .then(async (res) => {
      return await res.json()
    })
    .then(res => res.data.user)
}