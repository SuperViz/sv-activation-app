import { IUserResponse } from "../../../types";

export async function getUserData(email: string): Promise<IUserResponse> {
  const params = new URLSearchParams({ email: email })

  return await fetch(`/api/user?${params}`, {
    headers: { 
      cache: 'no-store'
    }
  })
    .then(async (res) => {
      return await res.json()
    })
    .then(res => res.data.user)
}


export function getUsers(): Promise<IUserResponse[]> {
  return fetch(`/api/users`, {
    headers: { 
     cache: 'no-store'
    }
  })
    .then((res) => {
      return res.json()
    })
    .then(res => res.data.users)
}

export function getOnlineUsersIds(): Promise<string[]> {
  const ROOM_ID = process.env.NEXT_PUBLIC_DASHBOARD_ROOM_ID as string;
  const DEVELOPER_KEY = process.env.NEXT_PUBLIC_DEVELOPER_KEY as string;
  return fetch(`https://nodeapi.superviz.com/realtime/participants/${ROOM_ID}/default`, {
    method: 'GET',
    headers: {
      'apiKey': DEVELOPER_KEY,
    }
  })
    .then((res) => {
      return res.json()
    })
    .then(res => {
      return res.map((user: any) => user.id)
    })
    .catch(err => {
      return []
    })
}